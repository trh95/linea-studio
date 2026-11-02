"""
Linea Studio Backend - Pydantic v2 Schemas
Strict type definitions and data validation for API requests and responses.
"""

from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr, Field, ConfigDict

# ==========================================
# Authentication & User Schemas
# ==========================================

class LoginRequest(BaseModel):
    email: EmailStr = Field(..., example="admin@lineastudio.hu")
    password: str = Field(..., min_length=6, example="SecretPassword123")


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    email: str
    full_name: str


class UserRead(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    role: str
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ==========================================
# 8-Step Consultation / Intake Form Schemas
# ==========================================

class IntakeFormAnswers(BaseModel):
    """
    Answers model covering the exact 8 consultation questions.
    """
    # 01. Milyen hatást szeretnél elérni?
    q01_effect: List[str] = Field(
        default_factory=list,
        description="Természetes, Elegáns, Dúsabb, Látványos, Segítséget kérek"
    )

    # 02. Melyik szett áll hozzád a legközelebb?
    q02_selected_sets: List[str] = Field(
        default_factory=list,
        description="Kiválasztott szettek azonosítói / fotói"
    )

    # 03. Mennyire szeretnéd, hogy hangsúlyos legyen? (1-5)
    q03_emphasis_level: Optional[int] = Field(
        default=3,
        ge=1,
        le=5,
        description="1 = visszafogott, 5 = hangsúlyos"
    )

    # 04. Mi az, amit nagyon nem szeretnél?
    q04_dislikes: List[str] = Field(
        default_factory=list,
        description="Nem kívánt hatások listája"
    )
    q04_dislikes_other: Optional[str] = Field(
        default=None,
        description="Egyéb szabadszavas nemkívánt elem"
    )

    # 05. Milyen a stílusod?
    q05_style: List[str] = Field(
        default_factory=list,
        description="Természetes, Elegáns, Modern, Feltűnőbb, Sportos, Romantikus, stb."
    )

    # 06. Mennyire sminkelsz a hétköznapokban?
    q06_makeup_routine: Optional[str] = Field(
        default=None,
        description="Szinte soha, Minimálisan, Rendszeresen, Szeretem a hangsúlyos sminket"
    )

    # 07. Volt már műszempillád?
    q07_has_previous_lashes: Optional[str] = Field(
        default=None,
        description="Igen / Nem, ez lenne az első alkalom"
    )
    q07_what_liked: Optional[str] = Field(
        default=None,
        description="Mi az, amit különösen szerettél benne?"
    )
    q07_what_disliked: Optional[str] = Field(
        default=None,
        description="Mi az, amit nagyon nem szerettél benne?"
    )

    # 08. Mit szeretnél látni, amikor tükörbe nézel?
    q08_mirror_wishes: List[str] = Field(
        default_factory=list,
        description="Szempillám színe harmonizáljon, nyitottabb tekintet, dúsabb, természetes, stb."
    )
    q08_mirror_custom_text: Optional[str] = Field(
        default=None,
        description="Szabadszavas leírás a tükörképhez"
    )


class IntakeFormCreate(BaseModel):
    client_name: str = Field(..., min_length=2, max_length=150, example="Kovács Anna")
    email: EmailStr = Field(..., example="kovacs.anna@example.hu")
    phone: Optional[str] = Field(default=None, max_length=50, example="+36 30 123 4567")
    answers: IntakeFormAnswers
    accept_terms: bool = Field(..., description="ÁSZF és Adatkezelés elfogadása")


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


class QuickEmailReplyRequest(BaseModel):
    subject: str = Field(..., min_length=3, example="Linea Studio - Konzultációs időpont egyeztetése")
    body: str = Field(..., min_length=10, example="Kedves Anna! Köszönjük a kérdőív kitöltését...")


# ==========================================
# Portfolio Image Schemas
# ==========================================

class PortfolioImageCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=200, example="Természetes 2D Soft Volume")
    category: str = Field(..., example="Természetes")
    image_url: str = Field(..., example="https://storage.lineastudio.hu/portfolio/lash1.jpg")
    description: Optional[str] = None
    sort_order: int = Field(default=0)
    is_visible: bool = Field(default=True)


class PortfolioImageRead(BaseModel):
    id: int
    title: str
    category: str
    image_url: str
    description: Optional[str]
    sort_order: int
    is_visible: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ==========================================
# Google Calendar & Appointment Schemas
# ==========================================

class AppointmentCreate(BaseModel):
    client_name: str
    client_email: EmailStr
    summary: str = Field(..., example="Szempilla építés - Új szett")
    start_time: datetime
    end_time: datetime
    notes: Optional[str] = None
    notify_client: bool = Field(default=True)


class AppointmentRead(BaseModel):
    event_id: str
    summary: str
    start_time: datetime
    end_time: datetime
    client_name: str
    client_email: str
    status: str
