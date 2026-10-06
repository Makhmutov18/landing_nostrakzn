/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_REQUEST_SIZE = 12 * 1024 * 1024;
const ALLOWED_EXTENSIONS = new Set(["pdf", "xlsx", "xls", "csv", "jpg", "jpeg", "png"]);

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return Response.json(body, {
    status,
    headers: { "cache-control": "no-store" },
  });
}

function safeFilename(value: string): string {
  const normalized = value.replace(/[\r\n]/g, "").trim();
  return normalized.replace(/[^a-zA-Z0-9._-]+/g, "_").slice(-140) || "purchase-list";
}

async function sendTelegram(
  env: Env,
  contact: string,
  purchaseDetails: string,
  file: File | null,
): Promise<boolean> {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return false;

  const caption = [
    "Новая заявка Nostra",
    `Контакт: ${contact}`,
    purchaseDetails ? `Закупка: ${purchaseDetails}` : "",
  ].filter(Boolean).join("\n").slice(0, 950);
  const form = new FormData();
  form.set("chat_id", env.TELEGRAM_CHAT_ID);

  let method = "sendMessage";
  if (file) {
    method = "sendDocument";
    form.set("caption", caption);
    form.set("document", file, safeFilename(file.name));
  } else {
    form.set("text", caption);
  }

  const response = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${method}`, {
    method: "POST",
    body: form,
  });
  if (!response.ok) throw new Error("Telegram rejected the message");
  return true;
}

async function handleLeadRequest(request: Request, env: Env): Promise<Response> {
  const contentLength = Number(request.headers.get("content-length") || "0");
  if (contentLength > MAX_REQUEST_SIZE) {
    return jsonResponse({ message: "Файл превышает допустимый размер 10 МБ." }, 413);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return jsonResponse({ message: "Не удалось прочитать данные формы." }, 400);
  }

  if (String(form.get("website") || "").trim()) {
    return jsonResponse({ ok: true });
  }

  const contact = String(form.get("contact") || "").trim().slice(0, 300);
  const purchaseDetails = String(form.get("purchaseDetails") || "").trim().slice(0, 3000);
  const fileValue = form.get("file");
  const file = fileValue instanceof File && fileValue.size > 0 ? fileValue : null;

  if (!contact) return jsonResponse({ message: "Укажите контакт для ответа." }, 400);
  if (String(form.get("consent") || "") !== "yes") {
    return jsonResponse({ message: "Нужно согласие на обработку персональных данных." }, 400);
  }
  if (!file && !purchaseDetails) {
    return jsonResponse({ message: "Прикрепите файл или опишите примерный объём закупки." }, 400);
  }

  if (file) {
    const extension = file.name.split(".").pop()?.toLowerCase() || "";
    if (!ALLOWED_EXTENSIONS.has(extension)) {
      return jsonResponse({ message: "Поддерживаются PDF, XLSX, XLS, CSV, JPG и PNG." }, 400);
    }
    if (file.size > MAX_FILE_SIZE) {
      return jsonResponse({ message: "Файл превышает допустимый размер 10 МБ." }, 413);
    }
  }

  let telegramDelivered = false;
  try {
    telegramDelivered = await sendTelegram(env, contact, purchaseDetails, file);
  } catch {
    telegramDelivered = false;
  }

  if (!telegramDelivered) {
    return jsonResponse({ message: "Не удалось отправить заявку. Попробуйте ещё раз через минуту." }, 502);
  }

  return jsonResponse({ ok: true, telegramDelivered: true });
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/request" && request.method === "POST") {
      return handleLeadRequest(request, env);
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
