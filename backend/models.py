"""
Linea Studio Backend - Database Models
SQLAlchemy 2.0 (Async) ORM definitions for PostgreSQL.
"""

from datetime import datetime
from typing import Optional, Dict, Any, List
from sqlalchemy import (
    String,
    Boolean,
    Integer,
    DateTime,
    ForeignKey,
    Text,
    func
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import (
    DeclarativeBase,
    Mapped,
    mapped_column,
    relationship
)

class Base(DeclarativeBase):
    pass


class User(Base):
    """
    Admin user model for salon owner authentication.
    """
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(150), default="Linea Studio Admin")
    role: Mapped[str] = mapped_column(String(50), default="admin", nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )

    # Relationships
    calendar_settings: Mapped[List["CalendarSetting"]] = relationship(
        "CalendarSetting",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<User id={self.id} email='{self.email}' role='{self.role}'>"


class FormResponse(Base):
    """
    Client anamnesis & consultation test response model.
    Stores structured client data and dynamic 8-question answers.
    """
    __tablename__ = "form_responses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    client_name: Mapped[str] = mapped_column(String(150), index=True, nullable=False)
    email: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)

    # JSONB field containing all 8 question responses
    # Structure: { q01_effect: [...], q02_sets: [...], q03_emphasis: 3, ... }
    answers: Mapped[Dict[str, Any]] = mapped_column(JSONB, nullable=False, default=dict)

    # Admin processing workflow state
    is_done: Mapped[bool] = mapped_column(Boolean, default=False, index=True, nullable=False)
    admin_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    processed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )

    def __repr__(self) -> str:
        return f"<FormResponse id={self.id} client='{self.client_name}' is_done={self.is_done}>"


class PortfolioImage(Base):
    """
    Public portfolio gallery entity managed dynamically by Admin.
    """
    __tablename__ = "portfolio_images"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    category: Mapped[str] = mapped_column(String(100), index=True, nullable=False) # e.g. "Természetes 1D", "Volume", "Wispy"
    image_url: Mapped[str] = mapped_column(String(500), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    is_visible: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    def __repr__(self) -> str:
        return f"<PortfolioImage id={self.id} title='{self.title}' category='{self.category}'>"


class CalendarSetting(Base):
    """
    Google Calendar integration and appointment sync settings.
    """
    __tablename__ = "calendar_settings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    google_calendar_id: Mapped[str] = mapped_column(String(255), default="primary", nullable=False)
    sync_enabled: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    auto_notify_guests: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    default_duration_minutes: Mapped[int] = mapped_column(Integer, default=120, nullable=False)

    # Google OAuth2 tokens (encrypted in production)
    access_token: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    refresh_token: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    token_expiry: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="calendar_settings")

    def __repr__(self) -> str:
        return f"<CalendarSetting id={self.id} calendar_id='{self.google_calendar_id}'>"
