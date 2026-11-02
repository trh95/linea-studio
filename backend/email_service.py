"""
Linea Studio Backend - Asynchronous Email Service
Handles transactional notifications, client intake confirmations, and quick admin replies.
"""

import os
import logging
from typing import Dict, Any

logger = logging.getLogger("linea.mailer")

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.resend.com")
SMTP_USER = os.getenv("SMTP_USER", "resend")
SMTP_PASS = os.getenv("SMTP_PASS", "")
SENDER_EMAIL = os.getenv("SENDER_EMAIL", "info@lineastudio.hu")
SENDER_NAME = "Linea Studio Szempilla Szalon"


async def send_intake_confirmation_email(client_name: str, client_email: str) -> bool:
    """
    Sends an automated, elegant confirmation email to the client right after form submission.
    """
    subject = "Linea Studio - Köszönjük konzultációs kérdőíved kitöltését! 🤍"
    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {{ font-family: 'Montserrat', Arial, sans-serif; background-color: #F8F7F2; color: #001D50; margin: 0; padding: 20px; }}
        .card {{ max-width: 600px; margin: 0 auto; background: #FFFFFF; border: 1px solid #E8E5DD; border-radius: 8px; padding: 40px; box-shadow: 0 4px 12px rgba(0,29,80,0.04); }}
        .header {{ text-align: center; border-bottom: 1px solid #E8E5DD; padding-bottom: 24px; }}
        .brand {{ font-size: 26px; font-weight: bold; color: #001D50; letter-spacing: 2px; }}
        .subtitle {{ font-size: 13px; color: #C6A86A; text-transform: uppercase; letter-spacing: 3px; margin-top: 6px; }}
        .content {{ padding: 30px 0; line-height: 1.8; font-size: 15px; }}
        .highlight {{ color: #C6A86A; font-weight: 600; }}
        .footer {{ font-size: 12px; color: #718096; text-align: center; border-top: 1px solid #E8E5DD; padding-top: 20px; }}
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div class="brand">LINEA STUDIO</div>
          <div class="subtitle">Prémium Szempilla & Szemöldök Szalon</div>
        </div>
        <div class="content">
          <p>Kedves <strong>{client_name}</strong>!</p>
          <p>Hálásan köszönöm, hogy kitöltötted a konzultációs kérdőívet. Az általad megosztott preferenciák és stílusigények alapján már készítem a személyre szabott styling javaslatodat.</p>
          <p>Hamarosan jelentkezem ezen az e-mail címen a lehetséges szabad időpontokkal és a részletekkel!</p>
          <p>Szeretettel várlak,<br><span class="highlight">Linea Studio Budapest</span></p>
        </div>
        <div class="footer">
          Linea Studio · 1052 Budapest, Deák tér 3. · +36 30 123 4567<br>
          Ez egy automatikus visszaigazoló üzenet.
        </div>
      </div>
    </body>
    </html>
    """
    logger.info(f"Mock/Async sending confirmation email to {client_email} ({client_name})")
    # In production, integrate with aiosmtplib or httpx to Resend/SendGrid API:
    # async with aiosmtplib.SMTP(hostname=SMTP_HOST, port=587) as smtp:
    #     ...
    return True


async def send_admin_reply_email(to_email: str, client_name: str, subject: str, message_body: str) -> bool:
    """
    Sends a direct reply / appointment proposal from the Admin dashboard to the client.
    """
    logger.info(f"Sending custom reply from Linea Studio Admin to {to_email}: {subject}")
    # Production SMTP dispatch logic here
    return True
