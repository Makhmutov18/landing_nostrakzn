/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  LEAD_FILES: R2Bucket;
  UNISENDER_API_KEY?: string;
  UNISENDER_LIST_ID?: string;
  UNISENDER_SENDER_EMAIL?: string;
  LEADS_EMAIL?: string;
  DOWNLOAD_SIGNING_SECRET?: string;
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
const DOWNLOAD_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const ALLOWED_EXTENSIONS = new Set(["pdf", "xlsx", "xls", "csv", "jpg", "jpeg", "png"]);

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return Response.json(body, {
    status,
    headers: { "cache-control": "no-store" },
  });
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function safeFilename(value: string): string {
  const normalized = value.replace(/[\r\n]/g, "").trim();
  return normalized.replace(/[^a-zA-Z0-9._-]+/g, "_").slice(-140) || "purchase-list";
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/g, "");
}

function base64UrlToBytes(value: string): Uint8Array {
  const normalized = value.replaceAll("-", "+").replaceAll("_", "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function signPayload(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return bytesToBase64Url(new Uint8Array(signature));
}

async function createDownloadToken(key: string, name: string, secret: string): Promise<string> {
  const payload = bytesToBase64Url(new TextEncoder().encode(JSON.stringify({
    key,
    name,
    expiresAt: Date.now() + DOWNLOAD_TTL_MS,
  })));
  return `${payload}.${await signPayload(payload, secret)}`;
}

async function readDownloadToken(token: string, secret: string): Promise<{ key: string; name: string } | null> {
  const [payload, suppliedSignature] = token.split(".");
  if (!payload || !suppliedSignature) return null;

  const expectedSignature = await signPayload(payload, secret);
  if (expectedSignature.length !== suppliedSignature.length) return null;

  let difference = 0;
  for (let index = 0; index < expectedSignature.length; index += 1) {
    difference |= expectedSignature.charCodeAt(index) ^ suppliedSignature.charCodeAt(index);
  }
  if (difference !== 0) return null;

  try {
    const decoded = new TextDecoder().decode(base64UrlToBytes(payload));
    const data = JSON.parse(decoded) as { key?: unknown; name?: unknown; expiresAt?: unknown };
    if (
      typeof data.key !== "string" ||
      typeof data.name !== "string" ||
      typeof data.expiresAt !== "number" ||
      data.expiresAt < Date.now()
    ) return null;
    return { key: data.key, name: data.name };
  } catch {
    return null;
  }
}

function requireEmailConfig(env: Env) {
  const { UNISENDER_API_KEY, UNISENDER_LIST_ID, UNISENDER_SENDER_EMAIL, LEADS_EMAIL } = env;
  if (!UNISENDER_API_KEY || !UNISENDER_LIST_ID || !UNISENDER_SENDER_EMAIL || !LEADS_EMAIL) {
    throw new Error("Email delivery is not configured");
  }
  return { UNISENDER_API_KEY, UNISENDER_LIST_ID, UNISENDER_SENDER_EMAIL, LEADS_EMAIL };
}

async function sendEmail(
  env: Env,
  contact: string,
  purchaseDetails: string,
  downloadUrl: string | null,
  originalFilename: string | null,
): Promise<void> {
  const config = requireEmailConfig(env);
  const fileBlock = downloadUrl
    ? `<p><strong>Файл:</strong> ${escapeHtml(originalFilename || "Закупочный лист")}<br><a href="${escapeHtml(downloadUrl)}">Скачать файл</a> <small>(ссылка действует 30 дней)</small></p>`
    : "<p><strong>Файл:</strong> не приложен</p>";
  const html = [
    "<h2>Новая заявка с сайта Coffee Nostra</h2>",
    `<p><strong>Контакт:</strong> ${escapeHtml(contact)}</p>`,
    `<p><strong>Описание закупки:</strong><br>${escapeHtml(purchaseDetails || "Не указано").replaceAll("\n", "<br>")}</p>`,
    fileBlock,
    `<p><small>Получено: ${escapeHtml(new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" }))} (МСК)</small></p>`,
  ].join("");

  const payload = new URLSearchParams({
    format: "json",
    api_key: config.UNISENDER_API_KEY,
    email: config.LEADS_EMAIL,
    sender_name: "Coffee Nostra",
    sender_email: config.UNISENDER_SENDER_EMAIL,
    subject: `Новая заявка Coffee Nostra — ${contact.slice(0, 80)}`,
    body: html,
    list_id: config.UNISENDER_LIST_ID,
    error_checking: "1",
  });

  const response = await fetch("https://api.unisender.com/ru/api/sendEmail", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded;charset=UTF-8" },
    body: payload,
  });
  const result = await response.json() as {
    error?: string;
    result?: Array<{ errors?: Array<{ message?: string }> }> | Record<string, unknown>;
  };
  const recipientError = Array.isArray(result.result)
    ? result.result.find((entry) => Array.isArray(entry.errors) && entry.errors.length > 0)
    : null;

  if (!response.ok || result.error || recipientError) {
    throw new Error(result.error || recipientError?.errors?.[0]?.message || "Unisender rejected the message");
  }
}

async function sendTelegram(
  env: Env,
  contact: string,
  purchaseDetails: string,
  file: File | null,
  downloadUrl: string | null,
): Promise<boolean> {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return false;

  const caption = [
    "Новая заявка Coffee Nostra",
    `Контакт: ${contact}`,
    purchaseDetails ? `Закупка: ${purchaseDetails}` : "",
    downloadUrl && !file ? `Файл: ${downloadUrl}` : "",
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

  if (!env.DOWNLOAD_SIGNING_SECRET) {
    return jsonResponse({ message: "Отправка временно недоступна. Попробуйте позднее." }, 503);
  }

  let downloadUrl: string | null = null;
  let originalFilename: string | null = null;
  if (file) {
    originalFilename = file.name.replace(/[\r\n]/g, "").slice(0, 180);
    const date = new Date().toISOString().slice(0, 10);
    const key = `leads/${date}/${crypto.randomUUID()}/${safeFilename(originalFilename)}`;
    await env.LEAD_FILES.put(key, file.stream(), {
      httpMetadata: { contentType: file.type || "application/octet-stream" },
    });
    const token = await createDownloadToken(key, originalFilename, env.DOWNLOAD_SIGNING_SECRET);
    const url = new URL("/api/request-file", request.url);
    url.searchParams.set("token", token);
    downloadUrl = url.toString();
  }

  const deliveries = await Promise.allSettled([
    sendEmail(env, contact, purchaseDetails, downloadUrl, originalFilename),
    sendTelegram(env, contact, purchaseDetails, file, downloadUrl),
  ]);
  const emailDelivered = deliveries[0].status === "fulfilled";
  const telegramDelivered = deliveries[1].status === "fulfilled" && deliveries[1].value;

  if (!emailDelivered && !telegramDelivered) {
    return jsonResponse({ message: "Не удалось отправить заявку. Попробуйте ещё раз через минуту." }, 502);
  }

  return jsonResponse({ ok: true, emailDelivered, telegramDelivered });
}

async function handleFileDownload(request: Request, env: Env): Promise<Response> {
  if (!env.DOWNLOAD_SIGNING_SECRET) return new Response("Not found", { status: 404 });
  const token = new URL(request.url).searchParams.get("token");
  if (!token) return new Response("Not found", { status: 404 });

  const data = await readDownloadToken(token, env.DOWNLOAD_SIGNING_SECRET);
  if (!data) return new Response("Ссылка недействительна или истекла.", { status: 403 });

  const object = await env.LEAD_FILES.get(data.key);
  if (!object) return new Response("Файл не найден.", { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("content-disposition", `attachment; filename="${safeFilename(data.name)}"; filename*=UTF-8''${encodeURIComponent(data.name)}`);
  headers.set("cache-control", "private, no-store");
  headers.set("x-content-type-options", "nosniff");
  return new Response(object.body, { headers });
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

    if (url.pathname === "/api/request-file" && request.method === "GET") {
      return handleFileDownload(request, env);
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
