const { expect, test } = require("@playwright/test");

test("loads through a CommonJS Playwright import", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#increment")).toHaveText("Count: 0");
});
