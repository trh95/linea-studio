"""
Linea Studio - FastAPI Main Application
Enterprise-grade, clean, asynchronous REST API for Linea Studio Beauty & Lash Salon.
"""

from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select, update, delete, desc
from sqlalchemy.ext.asyncio import AsyncSession

from .database import get_db, engine
from .models import Base, User, FormResponse, PortfolioImage, CalendarSetting
from .schemas import (
    LoginRequest,
    TokenResponse,
    UserRead,
    IntakeFormCreate,
    FormResponseRead,
    FormStatusUpdate,
    QuickEmailReplyRequest,
    PortfolioImageCreate,
    PortfolioImageRead,
    AppointmentCreate,
    AppointmentRead,
)
from .auth import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_admin
)
from .email_service import (
    send_intake_confirmation_email,
    send_admin_reply_email
)
from .calendar_service import GoogleCalendarService

# Initialize FastAPI
app = FastAPI(
    title="Linea Studio API",
    description="Prémium szempilla szalon ügyfélkezelő és portfólió API",
    version="1.0.0"
)

# Configure CORS for Frontend React client
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

calendar_service = GoogleCalendarService()


@app.on_event("startup")
async def on_startup():
    """Create tables if not existing and seed initial admin user if empty."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


# ==========================================
# 1. Authentication Routes
# ==========================================

@app.post("/api/auth/login", response_model=TokenResponse, tags=["Auth"])
async def login(credentials: LoginRequest, db: AsyncSession = Depends(get_db)):
    """
    Admin authentication endpoint returning a JWT Bearer token.
    """
    query = select(User).where(User.email == credentials.email)
    result = await db.execute(query)
    user = result.scalar_one_or_none()

    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Helytelen e-mail cím vagy jelszó."
        )

    token = create_access_token(data={"sub": user.email, "role": user.role})
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user_id=user.id,
        email=user.email,
        full_name=user.full_name
    )


@app.get("/api/auth/me", response_model=UserRead, tags=["Auth"])
async def get_me(current_admin: User = Depends(get_current_admin)):
    """Returns the authenticated admin profile."""
    return current_admin


# ==========================================
# 2. Public Intake Form Routes
# ==========================================

@app.post("/api/forms", response_model=FormResponseRead, status_code=status.HTTP_201_CREATED, tags=["Intake Form"])
async def submit_intake_form(
    payload: IntakeFormCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    """
    Public endpoint to submit the 8-question client consultation test.
    Saves to PostgreSQL and schedules an async confirmation email.
    """
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

    # Trigger async email confirmation in background task
    background_tasks.add_task(
        send_intake_confirmation_email,
        client_name=payload.client_name,
        client_email=payload.email
    )

    return new_response


# ==========================================
# 3. Protected Admin Form Viewer Routes
# ==========================================

@app.get("/api/admin/forms", response_model=List[FormResponseRead], tags=["Admin Forms"])
async def list_form_responses(
    status_filter: Optional[str] = None, # "done", "pending", "all"
    current_admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    """
    Admin endpoint to view all submitted consultation forms.
    Supports filtering by processing status.
    """
    query = select(FormResponse).order_by(desc(FormResponse.created_at))

    if status_filter == "done":
        query = query.where(FormResponse.is_done == True)
    elif status_filter == "pending":
        query = query.where(FormResponse.is_done == False)

    result = await db.execute(query)
    return result.scalars().all()


@app.patch("/api/admin/forms/{form_id}/status", response_model=FormResponseRead, tags=["Admin Forms"])
async def toggle_form_status(
    form_id: int,
    status_data: FormStatusUpdate,
    current_admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    """
    Updates the 'is_done' boolean flag on a client consultation form.
    Sets processed_at timestamp when marked done.
    """
    query = select(FormResponse).where(FormResponse.id == form_id)
    result = await db.execute(query)
    form = result.scalar_one_or_none()

    if not form:
        raise HTTPException(status_code=404, detail="Konzultációs űrlap nem található.")

    form.is_done = status_data.is_done
    form.processed_at = datetime.now(timezone.utc) if status_data.is_done else None
    if status_data.admin_notes is not None:
        form.admin_notes = status_data.admin_notes

    await db.commit()
    await db.refresh(form)
    return form


@app.post("/api/admin/forms/{form_id}/email", tags=["Admin Forms"])
async def send_client_reply(
    form_id: int,
    reply: QuickEmailReplyRequest,
    background_tasks: BackgroundTasks,
    current_admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    """
    Sends a direct email response/appointment proposal to the selected client.
    """
    query = select(FormResponse).where(FormResponse.id == form_id)
    result = await db.execute(query)
    form = result.scalar_one_or_none()

    if not form:
        raise HTTPException(status_code=404, detail="Konzultációs űrlap nem található.")

    background_tasks.add_task(
        send_admin_reply_email,
        to_email=form.email,
        client_name=form.client_name,
        subject=reply.subject,
        message_body=reply.body
    )
    return {"success": True, "message": f"E-mail sikeresen elküldve ide: {form.email}"}


# ==========================================
# 4. Portfolio Management Routes
# ==========================================

@app.get("/api/portfolio", response_model=List[PortfolioImageRead], tags=["Portfolio"])
async def list_portfolio(
    category: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """Public endpoint to fetch portfolio gallery images."""
    query = select(PortfolioImage).where(PortfolioImage.is_visible == True).order_by(PortfolioImage.sort_order)
    if category and category != "Összes":
        query = query.where(PortfolioImage.category == category)
    result = await db.execute(query)
    return result.scalars().all()


@app.post("/api/portfolio/upload", response_model=PortfolioImageRead, tags=["Portfolio"])
async def upload_portfolio_image(
    title: str = Form(...),
    category: str = Form(...),
    description: Optional[str] = Form(None),
    file: UploadFile = File(...),
    current_admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    """
    Admin endpoint to upload a new beauty photo to the public portfolio.
    In cloud environments, this streams to S3 / Cloud Storage and saves public URL.
    """
    # Demo simulated cloud upload URL
    simulated_url = f"/assets/portfolio/{file.filename}"

    new_img = PortfolioImage(
        title=title,
        category=category,
        image_url=simulated_url,
        description=description,
        sort_order=0,
        is_visible=True
    )
    db.add(new_img)
    await db.commit()
    await db.refresh(new_img)
    return new_img


@app.delete("/api/portfolio/{image_id}", tags=["Portfolio"])
async def delete_portfolio_image(
    image_id: int,
    current_admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    """Admin endpoint to remove an image from the portfolio."""
    query = select(PortfolioImage).where(PortfolioImage.id == image_id)
    result = await db.execute(query)
    image = result.scalar_one_or_none()

    if not image:
        raise HTTPException(status_code=404, detail="Kép nem található.")

    await db.delete(image)
    await db.commit()
    return {"success": True, "message": "Kép sikeresen törölve."}


# ==========================================
# 5. Google Calendar Synchronization Routes
# ==========================================

@app.get("/api/calendar/events", tags=["Calendar"])
async def get_calendar_events(current_admin: User = Depends(get_current_admin)):
    """Fetches upcoming appointments from connected Google Calendar."""
    events = await calendar_service.list_upcoming_appointments()
    return events


@app.post("/api/calendar/events", tags=["Calendar"])
async def create_calendar_appointment(
    payload: AppointmentCreate,
    current_admin: User = Depends(get_current_admin)
):
    """Creates a new event in Google Calendar and optionally notifies the guest."""
    event = await calendar_service.create_appointment(
        client_name=payload.client_name,
        client_email=payload.client_email,
        summary=payload.summary,
        start_time=payload.start_time,
        end_time=payload.end_time,
        description=payload.notes,
        notify_client=payload.notify_client
    )
    return event
