"use client";

import { FormEvent, useRef, useState } from "react";
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

type MessageKind = "idle" | "success" | "error";

export function UploadForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const successDialogRef = useRef<HTMLDialogElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [purchaseDetails, setPurchaseDetails] = useState("");
  const [contact, setContact] = useState("");
  const [consent, setConsent] = useState(false);
  const [message, setMessage] = useState("");
  const [messageKind, setMessageKind] = useState<MessageKind>("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function showMessage(text: string, kind: MessageKind) {
    setMessage(text);
    setMessageKind(kind);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file && !purchaseDetails.trim()) {
      showMessage("Прикрепите файл или опишите примерный объём закупки.", "error");
      return;
    }

    if (!contact.trim()) {
      showMessage("Укажите телефон, Telegram или другой контакт для ответа.", "error");
      return;
    }

    if (file && file.size > MAX_FILE_SIZE) {
      showMessage("Файл превышает 10 МБ. Выберите файл меньшего размера.", "error");
      return;
    }

    if (!consent) {
      showMessage("Отметьте согласие на обработку персональных данных.", "error");
      return;
    }

    const formData = new FormData();
    if (file) formData.append("file", file);
    formData.append("purchaseDetails", purchaseDetails.trim());
    formData.append("contact", contact.trim());
    formData.append("consent", "yes");
    formData.append("website", "");

    setIsSubmitting(true);
    showMessage("Отправляем заявку…", "idle");

    try {
      const response = await fetch("/api/request", {
        method: "POST",
        body: formData,
      });
      const result = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        throw new Error(result?.message || "Не удалось отправить заявку.");
      }

      setFile(null);
      setPurchaseDetails("");
      setContact("");
      setConsent(false);
      if (inputRef.current) inputRef.current.value = "";
      showMessage("Заявка отправлена. B2B‑менеджер свяжется с вами после расчёта.", "success");
      successDialogRef.current?.showModal();
    } catch (error) {
      showMessage(
        error instanceof Error ? error.message : "Не удалось отправить заявку. Попробуйте ещё раз.",
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <form className="upload-card" onSubmit={submit} aria-busy={isSubmitting}>
        <div className="upload-head"><span>Закупочный лист</span></div>
        <label className="upload-zone">
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.xlsx,.xls,.csv,.jpg,.jpeg,.png"
            disabled={isSubmitting}
            onChange={(event) => {
              const nextFile = event.target.files?.[0] ?? null;
              if (nextFile && nextFile.size > MAX_FILE_SIZE) {
                event.target.value = "";
                setFile(null);
                showMessage("Файл превышает 10 МБ. Выберите файл меньшего размера.", "error");
                return;
              }
              setFile(nextFile);
              showMessage("", "idle");
            }}
          />
          <span className="upload-icon" aria-hidden="true"><i /><b /></span>
          <strong>{file ? file.name : "Выберите файл с устройства"}</strong>
          <small>{file ? "Файл готов к отправке" : "PDF, XLSX, CSV, JPG или PNG · до 10 МБ"}</small>
        </label>
        <label className="details-field">
          <span>Или опишите примерный объём закупки</span>
          <textarea
            value={purchaseDetails}
            disabled={isSubmitting}
            maxLength={3000}
            onChange={(event) => {
              setPurchaseDetails(event.target.value);
              showMessage("", "idle");
            }}
            placeholder="Например: 20 кг кофе, 30 бутылок сиропа и 5 кг чая в месяц"
            rows={3}
            aria-label="Примерный объём закупки"
          />
        </label>
        <label className="contact-field">
          <span>Контакт для ответа</span>
          <input
            type="text"
            value={contact}
            disabled={isSubmitting}
            maxLength={300}
            required
            onChange={(event) => {
              setContact(event.target.value);
              showMessage("", "idle");
            }}
            placeholder="Телефон, Telegram или email"
            aria-label="Контакт для ответа"
          />
        </label>
        <label className="form-honeypot" aria-hidden="true">
          <span>Ваш сайт</span>
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
        <label className="consent-field">
          <input
            type="checkbox"
            checked={consent}
            disabled={isSubmitting}
            required
            onChange={(event) => {
              setConsent(event.target.checked);
              showMessage("", "idle");
            }}
          />
          <span>
            Я даю согласие на обработку персональных данных в соответствии с{" "}
            <a href="/privacy.html" target="_blank" rel="noopener noreferrer">политикой обработки персональных данных</a>.
          </span>
        </label>
        <button className="button button-dark" type="submit" disabled={isSubmitting}>
          <span>{isSubmitting ? "Отправляем…" : "Прислать закупочный лист"}</span>
          <span className="button-icon" aria-hidden="true"><ArrowUpRightIcon size={17} weight="regular" /></span>
        </button>
        <p className={`form-note form-note-${messageKind}`} aria-live="polite">
          {message || "Заявка и файл будут отправлены напрямую B2B‑менеджеру."}
        </p>
      </form>

      <dialog
        ref={successDialogRef}
        className="success-dialog"
        aria-labelledby="success-dialog-title"
        aria-describedby="success-dialog-description"
      >
        <div className="success-dialog-panel">
          <div className="success-dialog-topline">
            <span>Заявка принята</span>
            <span aria-hidden="true">NOSTRA · КАЗАНЬ</span>
          </div>
          <div className="success-dialog-mark" aria-hidden="true">✓</div>
          <h3 id="success-dialog-title">Всё отправлено</h3>
          <p id="success-dialog-description">
            Закупочный лист и контакт уже переданы B2B‑менеджеру Nostra.
          </p>
          <p className="success-dialog-note">Можно закрыть страницу — заявка уже доставлена.</p>
          <button className="button success-dialog-button" type="button" onClick={() => successDialogRef.current?.close()}>
            <span>Готово</span>
            <span className="button-icon" aria-hidden="true"><ArrowUpRightIcon size={17} weight="regular" /></span>
          </button>
        </div>
      </dialog>
    </>
  );
}
