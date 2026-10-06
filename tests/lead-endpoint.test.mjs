import assert from "node:assert/strict";
import test from "node:test";
import worker from "../dist/server/index.js";

function createEnv() {
  return {
    TELEGRAM_BOT_TOKEN: "test-bot-token",
    TELEGRAM_CHAT_ID: "123456789",
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

test("lead endpoint sends the uploaded purchase list directly to Telegram", async () => {
  const originalFetch = globalThis.fetch;
  let telegramPayload;

  globalThis.fetch = async (url, init) => {
    assert.equal(String(url), "https://api.telegram.org/bottest-bot-token/sendDocument");
    telegramPayload = init.body;
    return Response.json({ ok: true, result: { message_id: 1 } });
  };

  try {
    const form = new FormData();
    form.set("contact", "+7 900 000-00-00");
    form.set("consent", "yes");
    form.set("purchaseDetails", "10 кг кофе в месяц");
    form.set("file", new File(["sku,qty\ncoffee,10"], "purchase.csv", { type: "text/csv" }));

    const response = await worker.fetch(
      new Request("https://coffee.example/api/request", { method: "POST", body: form }),
      createEnv(),
      {},
    );
    const result = await response.json();

    assert.equal(response.status, 200);
    assert.equal(result.telegramDelivered, true);
    assert.ok(telegramPayload instanceof FormData);
    assert.equal(telegramPayload.get("chat_id"), "123456789");
    assert.match(telegramPayload.get("caption"), /10 кг кофе в месяц/);

    const document = telegramPayload.get("document");
    assert.ok(document instanceof File);
    assert.equal(document.name, "purchase.csv");
    assert.equal(await document.text(), "sku,qty\ncoffee,10");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("lead endpoint requires personal data consent", async () => {
  const form = new FormData();
  form.set("contact", "+7 900 000-00-00");
  form.set("purchaseDetails", "10 кг кофе");

  const response = await worker.fetch(
    new Request("https://coffee.example/api/request", { method: "POST", body: form }),
    createEnv(),
    {},
  );

  assert.equal(response.status, 400);
  assert.match((await response.json()).message, /согласие/i);
});
