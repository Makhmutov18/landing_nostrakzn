"use client";

import { FormEvent, useRef, useState } from "react";

export function UploadForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [purchaseDetails, setPurchaseDetails] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file && !purchaseDetails.trim()) {
      setMessage("Прикрепите файл или опишите примерный объём закупки.");
      return;
    }

    const shareData: ShareData = {
      title: "Закупочный лист для Coffee Nostra",
      text: [
        contact ? `Контакт для ответа: ${contact}` : "Расчёт экономии Coffee Nostra",
        purchaseDetails.trim() ? `Примерный объём закупки: ${purchaseDetails.trim()}` : "",
      ].filter(Boolean).join("\n"),
      ...(file ? { files: [file] } : {}),
    };

    if (navigator.share && (!navigator.canShare || navigator.canShare(shareData))) {
      try {
        await navigator.share(shareData);
        setMessage("Файл передан в выбранный вами канал.");
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setMessage("Не удалось открыть меню отправки. Попробуйте ещё раз.");
        }
      }
      return;
    }

    setMessage("Файл выбран. На этом устройстве отправьте его менеджеру через привычный канал связи.");
  }

  return (
    <form className="upload-card" onSubmit={submit}>
      <div className="upload-head"><span>Закупочный лист</span></div>
      <label className="upload-zone">
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.xlsx,.xls,.csv,.jpg,.jpeg,.png"
          onChange={(event) => {
            setFile(event.target.files?.[0] ?? null);
            setMessage("");
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
          onChange={(event) => {
            setPurchaseDetails(event.target.value);
            setMessage("");
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
          onChange={(event) => setContact(event.target.value)}
          placeholder="Телефон или Telegram"
          aria-label="Телефон или Telegram для ответа"
        />
      </label>
      <button className="button button-dark" type="submit">Прислать закупочный лист</button>
      <p className="form-note" aria-live="polite">
        {message || "На iPad и телефоне откроется системное меню отправки файла."}
      </p>
    </form>
  );
}
