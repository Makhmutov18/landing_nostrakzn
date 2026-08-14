import json
import smtplib
import ssl
import sys
from email.message import EmailMessage
from pathlib import Path

CONFIG_FILE = Path("/etc/nostra/mail.env")
SMTP_HOST = "smtp.yandex.ru"


def read_config() -> dict[str, str]:
    config: dict[str, str] = {}
    for raw_line in CONFIG_FILE.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        config[key.strip()] = value.strip().strip('"').strip("'")
    return config


def main() -> None:
    config = read_config()
    smtp_user = config["YANDEX_SMTP_USER"]
    smtp_password = config["YANDEX_SMTP_PASSWORD"]
    delivery_email = config.get("DELIVERY_EMAIL", smtp_user)
    payload = json.load(sys.stdin)
    contact = str(payload.get("contact") or "")[:300]
    purchase_details = str(payload.get("purchaseDetails") or "")[:3000]

    message = EmailMessage()
    message["From"] = f"Nostra Site <{smtp_user}>"
    message["To"] = delivery_email
    message["Subject"] = "Новая заявка Nostra"

    body = f"Новая заявка Nostra\n\nКонтакт: {contact}"
    if purchase_details:
        body += f"\n\nЗакупка:\n{purchase_details}"
    message.set_content(body)

    file_path = payload.get("filePath")
    if file_path:
        attachment = Path(str(file_path)).read_bytes()
        mime_type = str(payload.get("mimeType") or "application/octet-stream")
        maintype, _, subtype = mime_type.partition("/")
        message.add_attachment(
            attachment,
            maintype=maintype or "application",
            subtype=subtype or "octet-stream",
            filename=str(payload.get("fileName") or "purchase-list"),
        )

    with smtplib.SMTP_SSL(SMTP_HOST, 465, timeout=20, context=ssl.create_default_context()) as smtp:
        smtp.login(smtp_user, smtp_password)
        smtp.send_message(message)

    json.dump({"ok": True}, sys.stdout)


if __name__ == "__main__":
    main()
