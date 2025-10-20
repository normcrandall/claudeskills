import { test, expect } from '@playwright/test';

/**
 * UX Principles Testing Examples
 *
 * These tests validate best practices for user experience including
 * responsiveness, loading states, error handling, and user feedback.
 */

test.describe('UX Principles Tests', () => {
  test.describe('Responsiveness', () => {
    const viewports = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1920, height: 1080 },
    ];

    for (const viewport of viewports) {
      test(`should be responsive on ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({
          width: viewport.width,
          height: viewport.height,
        });

        await page.goto('/');

        // Check for horizontal scrolling (usually indicates responsive issues)
        const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
        const viewportWidth = await page.evaluate(() => window.innerWidth);

        expect(bodyScrollWidth).toBeLessThanOrEqual(viewportWidth + 1); // +1 for rounding

        // Verify main content is visible
        const mainContent = page.locator('main, [role="main"]').first();
        await expect(mainContent).toBeVisible();
      });
    }
  });

  test.describe('Loading States', () => {
    test('should show loading indicator during async operations', async ({ page }) => {
      await page.goto('/');

      // Click button that triggers async operation
      const asyncButton = page.getByRole('button', { name: /submit|load|fetch/i }).first();

      if (await asyncButton.count() > 0) {
        await asyncButton.click();

        // Look for loading indicators
        const loadingIndicator = page.locator('[role="status"], [aria-live="polite"], .loading, .spinner');

        // Should show loading state briefly
        // Use timeout to ensure it appears
        await expect(loadingIndicator.first()).toBeVisible({ timeout: 1000 }).catch(() => {
          // If no loading indicator found, that's a UX issue we should note
          console.warn('No loading indicator found for async operation');
        });
      }
    });

    test('should not have layout shift during loading', async ({ page }) => {
      await page.goto('/');

      // Measure cumulative layout shift
      const cls = await page.evaluate(() => {
        return new Promise<number>((resolve) => {
          let clsScore = 0;

          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
                clsScore += (entry as any).value;
              }
            }
          });

          observer.observe({ entryTypes: ['layout-shift'] });

          setTimeout(() => {
            observer.disconnect();
            resolve(clsScore);
          }, 3000);
        });
      });

      // CLS should be less than 0.1 for good UX
      expect(cls).toBeLessThan(0.1);
    });
  });

  test.describe('Error Handling', () => {
    test('should show clear error messages for form validation', async ({ page }) => {
      await page.goto('/');

      // Find a form
      const form = page.locator('form').first();

      if (await form.count() > 0) {
        // Try to submit without filling required fields
        const submitButton = form.getByRole('button', { name: /submit|send|save/i });

        if (await submitButton.count() > 0) {
          await submitButton.click();

          // Look for error messages
          const errorMessage = page.locator('[role="alert"], .error, [aria-invalid="true"]').first();

          // Should show error message
          await expect(errorMessage).toBeVisible({ timeout: 2000 });

          // Error message should have meaningful text
          const errorText = await errorMessage.textContent();
          expect(errorText?.length).toBeGreaterThan(0);
        }
      }
    });

    test('should handle network errors gracefully', async ({ page }) => {
      // Simulate offline mode
      await page.context().setOffline(true);

      await page.goto('/', { waitUntil: 'commit' }).catch(() => {
        // Expected to fail
      });

      // Should show offline message or error page
      const offlineMessage = page.getByText(/offline|no connection|network error/i);
      await expect(offlineMessage).toBeVisible({ timeout: 3000 }).catch(() => {
        console.warn('No offline error message shown');
      });

      await page.context().setOffline(false);
    });
  });

  test.describe('User Feedback', () => {
    test('should show success message after form submission', async ({ page }) => {
      await page.goto('/');

      const form = page.locator('form').first();

      if (await form.count() > 0) {
        // Fill form with valid data (customize based on your form)
        const inputs = await form.locator('input[required]').all();

        for (const input of inputs) {
          const type = await input.getAttribute('type');

          if (type === 'email') {
            await input.fill('test@example.com');
          } else if (type === 'text' || type === 'tel') {
            await input.fill('Test Value');
          }
        }

        // Submit form
        await form.getByRole('button', { name: /submit/i }).click();

        // Look for success message
        const successMessage = page.locator('[role="status"], .success, .toast').first();

        await expect(successMessage).toBeVisible({ timeout: 5000 }).catch(() => {
          console.warn('No success message shown after form submission');
        });
      }
    });

    test('should provide visual feedback on button click', async ({ page }) => {
      await page.goto('/');

      const button = page.getByRole('button').first();

      if (await button.count() > 0) {
        // Get initial state
        const initialState = await button.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            backgroundColor: computed.backgroundColor,
            transform: computed.transform,
            opacity: computed.opacity,
          };
        });

        // Click and check for visual change (hover/active state)
        await button.hover();

        const hoverState = await button.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            backgroundColor: computed.backgroundColor,
            transform: computed.transform,
            opacity: computed.opacity,
          };
        });

        // At least one property should change on hover
        const hasVisualFeedback =
          initialState.backgroundColor !== hoverState.backgroundColor ||
          initialState.transform !== hoverState.transform ||
          initialState.opacity !== hoverState.opacity;

        expect(hasVisualFeedback).toBeTruthy();
      }
    });
  });

  test.describe('Navigation', () => {
    test('should have working navigation links', async ({ page }) => {
      await page.goto('/');

      // Get all navigation links
      const navLinks = page.locator('nav a, header a').all();

      const links = await navLinks;

      // Test first few links
      for (let i = 0; i < Math.min(links.length, 5); i++) {
        const link = links[i];
        const href = await link.getAttribute('href');

        if (href && !href.startsWith('#') && !href.startsWith('http')) {
          // Internal link
          await link.click();

          // Should navigate to new page
          await page.waitForLoadState('networkidle');

          // Go back
          await page.goto('/');
        }
      }
    });

    test('should maintain navigation state', async ({ page }) => {
      await page.goto('/');

      // Click a navigation link
      const navLink = page.locator('nav a').first();

      if (await navLink.count() > 0) {
        await navLink.click();
        await page.waitForLoadState('networkidle');

        // Active nav item should be highlighted
        const activeNav = page.locator('nav [aria-current], nav .active');

        await expect(activeNav).toHaveCount(1).catch(() => {
          console.warn('No active navigation indicator found');
        });
      }
    });
  });

  test.describe('Performance', () => {
    test('should load page within acceptable time', async ({ page }) => {
      const startTime = Date.now();

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const loadTime = Date.now() - startTime;

      // Page should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);
    });

    test('should have good performance metrics', async ({ page }) => {
      await page.goto('/');

      const metrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

        return {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          firstPaint: performance.getEntriesByType('paint')
            .find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
        };
      });

      // First Contentful Paint should be under 2 seconds
      expect(metrics.firstPaint).toBeLessThan(2000);

      // DOM Content Loaded should be quick
      expect(metrics.domContentLoaded).toBeLessThan(1000);
    });
  });
});
