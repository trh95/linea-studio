/**
 * Linea Studio - Interactive Backend Architecture & Code Inspector
 * Allows full inspection of the production-ready Python/FastAPI/PostgreSQL codebase directly in UI.
 */

import React, { useState } from 'react';
import { Code2, Copy, Check, FileCode, Database, Terminal, Shield, Sparkles } from 'lucide-react';

const CODE_SNIPPETS = {
  models: `# /backend/models.py
"""
Linea Studio Backend - Database Models
SQLAlchemy 2.0 (Async) ORM definitions for PostgreSQL.
"""

from datetime import datetime
from typing import Optional, Dict, Any, List
from sqlalchemy import String, Boolean, Integer, DateTime, ForeignKey, Text, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(150), default="Linea Studio Admin")
    role: Mapped[str] = mapped_column(String(50), default="admin", nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

class FormResponse(Base):
    __tablename__ = "form_responses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    client_name: Mapped[str] = mapped_column(String(150), index=True, nullable=False)
    email: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)

    # JSONB field containing all 8 consultation question responses
    answers: Mapped[Dict[str, Any]] = mapped_column(JSONB, nullable=False, default=dict)

    is_done: Mapped[bool] = mapped_column(Boolean, default=False, index=True, nullable=False)
    admin_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    processed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

class PortfolioImage(Base):
    __tablename__ = "portfolio_images"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    category: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    image_url: Mapped[str] = mapped_column(String(500), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    is_visible: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

class CalendarSetting(Base):
    __tablename__ = "calendar_settings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    google_calendar_id: Mapped[str] = mapped_column(String(255), default="primary")
    sync_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    access_token: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    refresh_token: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
`,
  schemas: `# /backend/schemas.py
"""
Linea Studio Backend - Pydantic v2 Schemas
Strict type definitions and data validation.
"""

from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr, Field, ConfigDict

class IntakeFormAnswers(BaseModel):
    q01_effect: List[str] = Field(default_factory=list)
    q02_selected_sets: List[str] = Field(default_factory=list)
    q03_emphasis_level: Optional[int] = Field(default=3, ge=1, le=5)
    q04_dislikes: List[str] = Field(default_factory=list)
    q04_dislikes_other: Optional[str] = None
    q05_style: List[str] = Field(default_factory=list)
    q06_makeup_routine: Optional[str] = None
    q07_has_previous_lashes: Optional[str] = None
    q07_what_liked: Optional[str] = None
    q07_what_disliked: Optional[str] = None
    q08_mirror_wishes: List[str] = Field(default_factory=list)
    q08_mirror_custom_text: Optional[str] = None

class IntakeFormCreate(BaseModel):
    client_name: str = Field(..., min_length=2, max_length=150)
    email: EmailStr
    phone: Optional[str] = None
    answers: IntakeFormAnswers
    accept_terms: bool

class FormResponseRead(BaseModel):
    id: int
    client_name: str
    email: EmailStr
    phone: Optional[str]
    answers: Dict[str, Any]
    is_done: bool
    admin_notes: Optional[str]
    created_at: datetime
    processed_at: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)

class FormStatusUpdate(BaseModel):
    is_done: bool
    admin_notes: Optional[str] = None
`,
  api: `# /backend/main.py
"""
Linea Studio - FastAPI Main Application Key Endpoints
"""

from fastapi import FastAPI, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from .database import get_db
from .models import FormResponse, PortfolioImage
from .schemas import IntakeFormCreate, FormResponseRead, FormStatusUpdate
from .auth import get_current_admin
from .email_service import send_intake_confirmation_email

app = FastAPI(title="Linea Studio API", version="1.0.0")

@app.post("/api/forms", response_model=FormResponseRead, status_code=status.HTTP_201_CREATED)
async def submit_intake_form(
    payload: IntakeFormCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    """Public intake route: saves form response and schedules confirmation email."""
    new_response = FormResponse(
        client_name=payload.client_name,
        email=payload.email,
        phone=payload.phone,
        answers=payload.answers.model_dump(),
        is_done=False
    )
    db.add(new_response)
    await db.commit()
    await db.refresh(new_response)

    background_tasks.add_task(
        send_intake_confirmation_email,
        client_name=payload.client_name,
        client_email=payload.email
    )
    return new_response

@app.get("/api/admin/forms", response_model=List[FormResponseRead])
async def list_form_responses(
    status_filter: Optional[str] = None,
    current_admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    """Protected admin endpoint: lists incoming intake responses."""
    query = select(FormResponse).order_by(desc(FormResponse.created_at))
    if status_filter == "done":
        query = query.where(FormResponse.is_done == True)
    elif status_filter == "pending":
        query = query.where(FormResponse.is_done == False)
    result = await db.execute(query)
    return result.scalars().all()

@app.patch("/api/admin/forms/{form_id}/status", response_model=FormResponseRead)
async def toggle_form_status(
    form_id: int,
    status_data: FormStatusUpdate,
    current_admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    """Toggle is_done processed flag on client form."""
    query = select(FormResponse).where(FormResponse.id == form_id)
    res = await db.execute(query)
    form = res.scalar_one_or_none()
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    form.is_done = status_data.is_done
    await db.commit()
    await db.refresh(form)
    return form
`,
};

export const BackendCodeViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'models' | 'schemas' | 'api'>('models');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(CODE_SNIPPETS[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
      {/* Intro card */}
      <div className="bg-white border border-[#E8E5DD] p-8 rounded-sm shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#001D50] text-[#C6A86A] text-[11px] uppercase tracking-widest font-semibold rounded-xs mb-3">
            <Code2 className="w-3.5 h-3.5" />
            <span>Python 3.11+ / FastAPI / SQLAlchemy 2.0 / PostgreSQL</span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#001D50]">
            Backend Kód & Architektúra Blueprint
          </h2>
          <p className="text-xs md:text-sm text-[#001D50]/75 mt-2 font-sans max-w-2xl leading-relaxed">
            A teljes backend forráskód a projekt <code>/backend</code> könyvtárában található és azonnal futtatható. 
            Szilárd SOLID elvek, Pydantic v2 szigorú típusok és aszinkron adatbázis-kapcsolatok.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#001D50] bg-[#C6A86A] hover:bg-[#A98A4D] hover:text-white rounded-xs transition-colors shrink-0 shadow-xs cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Kimásolva!' : 'Kód Másolása'}</span>
        </button>
      </div>

      {/* Code Tabs */}
      <div className="bg-[#001D50] rounded-sm overflow-hidden shadow-lg border border-[#0A275C]">
        <div className="flex items-center justify-between bg-[#001438] px-4 py-2.5 border-b border-[#0A275C]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('models')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-xs transition-colors ${
                activeTab === 'models'
                  ? 'bg-[#001D50] text-[#C6A86A] font-bold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>models.py (SQLAlchemy)</span>
            </button>
            <button
              onClick={() => setActiveTab('schemas')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-xs transition-colors ${
                activeTab === 'schemas'
                  ? 'bg-[#001D50] text-[#C6A86A] font-bold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>schemas.py (Pydantic v2)</span>
            </button>
            <button
              onClick={() => setActiveTab('api')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-xs transition-colors ${
                activeTab === 'api'
                  ? 'bg-[#001D50] text-[#C6A86A] font-bold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>main.py (FastAPI Routes)</span>
            </button>
          </div>

          <span className="text-[11px] font-mono text-[#C6A86A]">UTF-8 · Python</span>
        </div>

        {/* Code Content Box */}
        <pre className="p-6 text-xs text-neutral-200 font-mono overflow-x-auto leading-relaxed max-h-[600px] scrollbar-thin">
          <code>{CODE_SNIPPETS[activeTab]}</code>
        </pre>
      </div>
    </div>
  );
};
