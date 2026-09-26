import { expect, test } from "@playwright/test";

test("coverage observation does not install visible browser routes", async ({
  context,
}) => {
  expect((context as unknown as { _routes?: unknown[] })._routes ?? []).toEqual([]);
  expect(/supercov/).toEqual(/supercov/);
});

test("increments the counter", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#status")).toHaveText("empty");
  await page.locator("#increment").click();
  await expect(page.locator("#status")).toHaveText("active");
});

test("retains a failed retry before the terminal pass", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  await expect(page.locator("#status")).toHaveText("empty");
  expect(testInfo.retry).toBe(1);
});

test.skip("records a skipped outcome without inventing coverage", async () => {});

test("keeps expected failure out of passed-only coverage", async ({ page }) => {
  test.fail();
  await page.goto("/");
  expect("observed failure").toBe("expected failure");
});

test("attributes request fixtures, user contexts, and popup frames", async ({
  browser,
  page,
  request,
}) => {
  const response = await request.get("/coverage-headers");
  const requestHeaders = await response.json();
  expect(requestHeaders.scope).toContain("r=");
  expect(requestHeaders.phase).toContain("phase:");

  const context = await browser.newContext();
  const userPage = await context.newPage();
  await userPage.goto("http://127.0.0.1:4397/");
  await expect(userPage.locator("#increment")).toHaveText("Count: 0");

  await page.goto("/");
  const popupPromise = page.waitForEvent("popup");
  await page.evaluate(() => window.open("/", "_blank"));
  const popup = await popupPromise;
  await expect(popup.locator("#status")).toHaveText("empty");

  const websocketHeaders = await page.evaluate(
    () =>
      Promise.race([
        new Promise<{ scope: string | null; phase: string | null }>((resolve) => {
          const socket = new WebSocket("ws://127.0.0.1:4397");
          socket.addEventListener("message", (event) =>
            resolve(JSON.parse(String(event.data))),
          );
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("WebSocket header probe timed out")), 5_000),
        ),
      ]),
  );
  expect(websocketHeaders.scope).toContain("r=");
  expect(websocketHeaders.phase).toContain("phase:");

  const serviceWorkerHeaders = await page.evaluate(async () => {
    await navigator.serviceWorker.register("/sw.js");
    const registration = await navigator.serviceWorker.ready;
    return Promise.race([
      new Promise<{ scope: string | null; phase: string | null }>(
        (resolve) => {
          const channel = new MessageChannel();
          channel.port1.onmessage = (event) => resolve(event.data);
          registration.active!.postMessage("headers", [channel.port2]);
        },
      ),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Service-worker header probe timed out")), 5_000),
      ),
    ]);
  });
  expect(serviceWorkerHeaders.scope).toContain("r=");
  expect(serviceWorkerHeaders.phase).toContain("phase:");
  await context.close();
});
