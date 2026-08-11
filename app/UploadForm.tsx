"use client";

import { FormEvent, useRef, useState } from "react";

export function UploadForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) {
      inputRef.current?.click();
      setMessage("Сначала выберите закупочный лист.");
      return;
    }

    const shareData = {
      title: "Закупочный лист для Coffee Nostra",
      text: contact
        ? `Контакт для ответа: ${contact}`
        : "Закупочный лист для расчёта экономии Coffee Nostra",
      files: [file],
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
      <div className="upload-head"><span>Закупочный лист</span><small>Шаг 1 из 1</small></div>
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
      <button className="button button-dark" type="submit">Пришлите закупочный лист</button>
      <p className="form-note" aria-live="polite">
        {message || "На iPad и телефоне откроется системное меню отправки файла."}
      </p>
    </form>
  );
}
