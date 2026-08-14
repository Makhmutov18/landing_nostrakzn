import assert from "node:assert/strict";
import test from "node:test";
import worker from "../dist/server/index.js";

class MemoryBucket {
  objects = new Map();

  async put(key, value, options = {}) {
    const bytes = new Uint8Array(await new Response(value).arrayBuffer());
    this.objects.set(key, { bytes, contentType: options.httpMetadata?.contentType });
  }

  async get(key) {
    const object = this.objects.get(key);
    if (!object) return null;
    return {
      body: new Blob([object.bytes]).stream(),
      writeHttpMetadata(headers) {
        if (object.contentType) headers.set("content-type", object.contentType);
      },
    };
  }
}

function createEnv() {
  return {
    LEAD_FILES: new MemoryBucket(),
    UNISENDER_API_KEY: "test-key",
    UNISENDER_LIST_ID: "2",
    UNISENDER_SENDER_EMAIL: "nostra.kzn@yandex.com",
    LEADS_EMAIL: "nostra.kzn@yandex.com",
    DOWNLOAD_SIGNING_SECRET: "test-signing-secret-at-least-32-characters",
  };
}

test("lead endpoint validates required contact", async () => {
  const form = new FormData();
  form.set("purchaseDetails", "10 кг кофе");

  const response = await worker.fetch(
    new Request("https://coffee.example/api/request", { method: "POST", body: form }),
    createEnv(),
    {},
  );

  assert.equal(response.status, 400);
  assert.match((await response.json()).message, /контакт/i);
});

test("lead endpoint emails a signed download link and serves the stored file", async () => {
  const env = createEnv();
  const originalFetch = globalThis.fetch;
  let emailPayload;

  globalThis.fetch = async (url, init) => {
    assert.equal(String(url), "https://api.unisender.com/ru/api/sendEmail");
    emailPayload = new URLSearchParams(init.body);
    return Response.json({ result: { email_id: "test-message" } });
  };

  try {
    const form = new FormData();
    form.set("contact", "+7 900 000-00-00");
    form.set("purchaseDetails", "10 кг кофе в месяц");
    form.set("file", new File(["sku,qty\ncoffee,10"], "purchase.csv", { type: "text/csv" }));

    const response = await worker.fetch(
      new Request("https://coffee.example/api/request", { method: "POST", body: form }),
      env,
      {},
    );
    const result = await response.json();

    assert.equal(response.status, 200);
    assert.equal(result.emailDelivered, true);
    assert.equal(result.telegramDelivered, false);
    assert.equal(emailPayload.get("email"), "nostra.kzn@yandex.com");
    assert.equal(emailPayload.get("sender_email"), "nostra.kzn@yandex.com");

    const html = emailPayload.get("body");
    const downloadUrl = html.match(/href="([^"]+)"/)?.[1];
    assert.ok(downloadUrl, "email should contain a download link");

    const download = await worker.fetch(new Request(downloadUrl), env, {});
    assert.equal(download.status, 200);
    assert.equal(download.headers.get("content-type"), "text/csv");
    assert.match(download.headers.get("content-disposition"), /purchase\.csv/);
    assert.equal(await download.text(), "sku,qty\ncoffee,10");
  } finally {
    globalThis.fetch = originalFetch;
  }
});
