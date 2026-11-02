# Linea Studio - Backend Dokumentáció (FastAPI + SQLAlchemy + PostgreSQL)

## Technológiai Stack
- **Python**: 3.11+
- **Framework**: FastAPI
- **ORM**: SQLAlchemy 2.0 (Async) + `asyncpg` driver
- **Adatbázis**: PostgreSQL 15+
- **Hitelesítés**: JWT + Bcrypt (`passlib`, `python-jose`)
- **Validáció**: Pydantic v2
- **Integrációk**: Google Calendar API, Aszinkron Tranzakciós Email Szolgáltatás

## Indítás lépései

1. Virtuális környezet létrehozása és függőségek telepítése:
```bash
python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn[standard] sqlalchemy[asyncio] asyncpg pydantic pydantic-settings passlib[bcrypt] python-jose[cryptography] python-multipart
```

2. Környezeti változók (`.env`):
```env
DATABASE_URL="postgresql+asyncpg://postgres:postgres@localhost:5432/lineastudio_db"
JWT_SECRET_KEY="linea-studio-super-secret-jwt-key-2026"
SMTP_HOST="smtp.resend.com"
SMTP_USER="resend"
SMTP_PASS="re_your_api_key"
SENDER_EMAIL="info@lineastudio.hu"
```

3. Szerver futtatása fejlesztői módban:
```bash
uvicorn backend.main:app --reload --port 8000
```
Swagger UI elérhető itt: `http://localhost:8000/docs`
