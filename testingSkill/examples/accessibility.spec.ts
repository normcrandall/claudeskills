import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Accessibility Testing Examples
 *
 * These tests ensure the application meets WCAG 2.1 AA standards
 * and provides a good experience for users with disabilities.
 */

test.describe('Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the page you want to test
    await page.goto('/');
  });

  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('h1, h2, h3, h4, h5, h6')
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have accessible forms', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('form')
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Tab through interactive elements
    await page.keyboard.press('Tab');

    // Check that first focusable element has focus
    const firstFocusable = await page.locator(':focus').first();
    await expect(firstFocusable).toBeVisible();

    // Test Enter key on focused element
    await page.keyboard.press('Enter');

    // Verify action occurred (customize based on your app)
    // await expect(page).toHaveURL(/expected-url/);
  });

  test('should have visible focus indicators', async ({ page }) => {
    // Click first interactive element
    const button = page.getByRole('button').first();
    await button.focus();

    // Verify element has visible focus (check for outline or ring)
    const styles = await button.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        outline: computed.outline,
        boxShadow: computed.boxShadow,
      };
    });

    // Assert that some focus indicator exists
    expect(
      styles.outline !== 'none' || styles.boxShadow !== 'none'
    ).toBeTruthy();
  });

  test('should have alt text on images', async ({ page }) => {
    const images = await page.locator('img').all();

    for (const img of images) {
      const alt = await img.getAttribute('alt');
      const role = await img.getAttribute('role');

      // Images should have alt text or role="presentation"
      expect(alt !== null || role === 'presentation').toBeTruthy();
    }
  });

  test('should have proper ARIA labels on buttons', async ({ page }) => {
    const buttons = await page.getByRole('button').all();

    for (const button of buttons) {
      const accessibleName = await button.getAttribute('aria-label') ||
                            await button.textContent() ||
                            await button.getAttribute('aria-labelledby');

      expect(accessibleName).toBeTruthy();
    }
  });

  test('should have sufficient color contrast', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .disableRules(['color-contrast']) // We'll check this specifically
      .analyze();

    // Run specific color contrast check
    const contrastResults = await new AxeBuilder({ page })
      .include('body')
      .withRules(['color-contrast'])
      .analyze();

    expect(contrastResults.violations).toEqual([]);
  });
});
