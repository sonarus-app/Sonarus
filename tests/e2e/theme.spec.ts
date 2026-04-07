// tests/e2e/theme.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Theme System", () => {
  test("should default to system preference on first launch", async ({
    page,
  }) => {
    await page.goto("/");

    // Check initial theme based on system preference
    const html = page.locator("html");
    const systemPrefersDark = await page.evaluate(
      () => window.matchMedia("(prefers-color-scheme: dark)").matches,
    );

    if (systemPrefersDark) {
      await expect(html).toHaveClass(/dark/);
    } else {
      await expect(html).not.toHaveClass(/dark/);
    }
  });

  test("should switch to dark theme when selected", async ({ page }) => {
    await page.goto("/");

    // Ensure we're on the general section (contains theme settings)
    await page.click('[data-testid="sidebar-general"]');

    // Open theme dropdown
    await page.click('[data-testid="theme-dropdown"]');

    // Select dark theme from dropdown
    await page.click("text=Dark");

    // Verify dark theme is applied
    const html = page.locator("html");
    await expect(html).toHaveClass(/dark/);

    // Reload page and verify persistence
    await page.reload();
    await expect(html).toHaveClass(/dark/);
  });

  test("should switch to light theme when selected", async ({ page }) => {
    await page.goto("/");

    // Ensure we're on the general section (contains theme settings)
    await page.click('[data-testid="sidebar-general"]');

    // Open theme dropdown
    await page.click('[data-testid="theme-dropdown"]');

    // Select light theme from dropdown
    await page.click("text=Light");

    // Verify light theme is applied
    const html = page.locator("html");
    await expect(html).not.toHaveClass(/dark/);

    // Reload page and verify persistence
    await page.reload();
    await expect(html).not.toHaveClass(/dark/);
  });
});
