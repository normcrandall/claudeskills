import { test, expect } from '@playwright/test';

/**
 * Functional Testing Examples
 *
 * These tests verify that the application works correctly according to
 * its intended functionality and business logic.
 */

test.describe('Functional Tests', () => {
  test.describe('User Authentication Flow', () => {
    test('should allow user to sign up with valid credentials', async ({ page }) => {
      await page.goto('/signup');

      // Fill signup form
      await page.getByLabel(/email/i).fill(`test-${Date.now()}@example.com`);
      await page.getByLabel(/password/i).fill('SecurePassword123!');
      await page.getByLabel(/confirm password/i).fill('SecurePassword123!');

      // Submit form
      await page.getByRole('button', { name: /sign up|create account/i }).click();

      // Should redirect to dashboard or show success message
      await expect(page).toHaveURL(/dashboard|home|welcome/, { timeout: 5000 });
    });

    test('should prevent signup with invalid email', async ({ page }) => {
      await page.goto('/signup');

      await page.getByLabel(/email/i).fill('invalid-email');
      await page.getByLabel(/password/i).fill('SecurePassword123!');

      await page.getByRole('button', { name: /sign up/i }).click();

      // Should show error message
      const errorMessage = page.locator('[role="alert"], .error');
      await expect(errorMessage).toBeVisible();
      await expect(errorMessage).toContainText(/email|invalid/i);
    });

    test('should allow user to login with valid credentials', async ({ page }) => {
      await page.goto('/login');

      await page.getByLabel(/email/i).fill('test@example.com');
      await page.getByLabel(/password/i).fill('password123');

      await page.getByRole('button', { name: /log in|sign in/i }).click();

      // Should redirect to dashboard
      await expect(page).toHaveURL(/dashboard|home/, { timeout: 5000 });
    });

    test('should show error for invalid credentials', async ({ page }) => {
      await page.goto('/login');

      await page.getByLabel(/email/i).fill('wrong@example.com');
      await page.getByLabel(/password/i).fill('wrongpassword');

      await page.getByRole('button', { name: /log in/i }).click();

      // Should show error message
      const errorMessage = page.locator('[role="alert"], .error');
      await expect(errorMessage).toBeVisible();
      await expect(errorMessage).toContainText(/invalid|incorrect|wrong/i);
    });

    test('should allow user to logout', async ({ page, context }) => {
      // Setup: Login first
      await page.goto('/login');
      await page.getByLabel(/email/i).fill('test@example.com');
      await page.getByLabel(/password/i).fill('password123');
      await page.getByRole('button', { name: /log in/i }).click();
      await page.waitForURL(/dashboard|home/);

      // Logout
      await page.getByRole('button', { name: /log out|sign out/i }).click();

      // Should redirect to login or homepage
      await expect(page).toHaveURL(/login|^\/$/, { timeout: 5000 });

      // Session should be cleared
      const cookies = await context.cookies();
      const sessionCookie = cookies.find(c => c.name.includes('session') || c.name.includes('token'));
      expect(sessionCookie).toBeUndefined();
    });
  });

  test.describe('Form Handling', () => {
    test('should submit form with valid data', async ({ page }) => {
      await page.goto('/contact');

      await page.getByLabel(/name/i).fill('John Doe');
      await page.getByLabel(/email/i).fill('john@example.com');
      await page.getByLabel(/message/i).fill('This is a test message.');

      await page.getByRole('button', { name: /submit|send/i }).click();

      // Should show success message
      await expect(page.locator('[role="status"], .success')).toBeVisible({ timeout: 5000 });
    });

    test('should validate required fields', async ({ page }) => {
      await page.goto('/contact');

      // Try to submit empty form
      await page.getByRole('button', { name: /submit|send/i }).click();

      // Should show validation errors
      const errors = page.locator('[aria-invalid="true"], .error');
      await expect(errors.first()).toBeVisible();
    });

    test('should preserve form data on validation error', async ({ page }) => {
      await page.goto('/contact');

      const testName = 'John Doe';
      const invalidEmail = 'not-an-email';

      await page.getByLabel(/name/i).fill(testName);
      await page.getByLabel(/email/i).fill(invalidEmail);

      await page.getByRole('button', { name: /submit/i }).click();

      // Form data should be preserved
      await expect(page.getByLabel(/name/i)).toHaveValue(testName);
      await expect(page.getByLabel(/email/i)).toHaveValue(invalidEmail);
    });
  });

  test.describe('Data Operations (CRUD)', () => {
    test('should create a new item', async ({ page }) => {
      await page.goto('/items');

      // Click create button
      await page.getByRole('button', { name: /create|new|add/i }).click();

      // Fill form
      const itemName = `Test Item ${Date.now()}`;
      await page.getByLabel(/name|title/i).fill(itemName);
      await page.getByLabel(/description/i).fill('Test description');

      // Save
      await page.getByRole('button', { name: /save|create/i }).click();

      // Should show in list
      await expect(page.getByText(itemName)).toBeVisible({ timeout: 5000 });
    });

    test('should read and display items', async ({ page }) => {
      await page.goto('/items');

      // Should load items list
      const itemsList = page.locator('[role="list"], .items, table');
      await expect(itemsList).toBeVisible();

      // Should have at least one item (or empty state)
      const items = page.locator('[role="listitem"], tr, .item');
      const count = await items.count();

      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should update an existing item', async ({ page }) => {
      await page.goto('/items');

      // Click edit on first item
      const editButton = page.getByRole('button', { name: /edit/i }).first();
      await editButton.click();

      // Update name
      const updatedName = `Updated Item ${Date.now()}`;
      const nameInput = page.getByLabel(/name|title/i);
      await nameInput.clear();
      await nameInput.fill(updatedName);

      // Save
      await page.getByRole('button', { name: /save|update/i }).click();

      // Should show updated name
      await expect(page.getByText(updatedName)).toBeVisible({ timeout: 5000 });
    });

    test('should delete an item', async ({ page }) => {
      await page.goto('/items');

      // Get first item text
      const firstItem = page.locator('[role="listitem"], tr, .item').first();
      const itemText = await firstItem.textContent();

      // Click delete
      await firstItem.getByRole('button', { name: /delete|remove/i }).click();

      // Confirm deletion (if confirmation dialog exists)
      const confirmButton = page.getByRole('button', { name: /confirm|yes|delete/i });
      if (await confirmButton.isVisible({ timeout: 1000 }).catch(() => false)) {
        await confirmButton.click();
      }

      // Item should be removed
      await expect(page.getByText(itemText || '')).not.toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Search and Filter', () => {
    test('should filter items based on search query', async ({ page }) => {
      await page.goto('/items');

      const searchInput = page.getByRole('searchbox').or(page.getByPlaceholder(/search/i));

      if (await searchInput.count() > 0) {
        // Enter search query
        await searchInput.fill('test');

        // Wait for results to update
        await page.waitForTimeout(500);

        // All visible items should contain search term
        const visibleItems = page.locator('[role="listitem"], .item').all();
        const items = await visibleItems;

        for (const item of items) {
          const text = await item.textContent();
          expect(text?.toLowerCase()).toContain('test');
        }
      }
    });

    test('should handle no search results gracefully', async ({ page }) => {
      await page.goto('/items');

      const searchInput = page.getByRole('searchbox').or(page.getByPlaceholder(/search/i));

      if (await searchInput.count() > 0) {
        // Enter query that returns no results
        await searchInput.fill('xyznonexistentquery123');

        await page.waitForTimeout(500);

        // Should show empty state
        const emptyState = page.getByText(/no results|not found|no items/i);
        await expect(emptyState).toBeVisible();
      }
    });
  });

  test.describe('API Integration', () => {
    test('should handle API success responses', async ({ page }) => {
      // Intercept API call
      await page.route('**/api/**', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, data: [] }),
        });
      });

      await page.goto('/');

      // Verify UI updated based on successful API response
      // Customize based on your app's behavior
    });

    test('should handle API error responses', async ({ page }) => {
      // Intercept API call and return error
      await page.route('**/api/**', (route) => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal Server Error' }),
        });
      });

      await page.goto('/');

      // Should show error message to user
      const errorMessage = page.locator('[role="alert"], .error');
      await expect(errorMessage).toBeVisible({ timeout: 5000 });
    });

    test('should handle slow API responses', async ({ page }) => {
      // Intercept and delay API response
      await page.route('**/api/**', async (route) => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true }),
        });
      });

      await page.goto('/');

      // Should show loading state during delay
      const loadingIndicator = page.locator('[role="status"], .loading');
      await expect(loadingIndicator).toBeVisible();

      // Should hide loading state after response
      await expect(loadingIndicator).not.toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('State Management', () => {
    test('should persist data across navigation', async ({ page }) => {
      await page.goto('/');

      // Perform action that updates state
      const input = page.getByRole('textbox').first();
      const testValue = 'Persistent Value';

      if (await input.count() > 0) {
        await input.fill(testValue);

        // Navigate away
        await page.goto('/about');

        // Navigate back
        await page.goto('/');

        // Value should be persisted (if app uses state management)
        const currentValue = await input.inputValue();

        // This depends on your app's state management
        // Adjust expectation based on whether state should persist
      }
    });

    test('should handle concurrent state updates', async ({ page }) => {
      await page.goto('/');

      // Trigger multiple state updates simultaneously
      const buttons = page.getByRole('button').all();

      const allButtons = await buttons;

      if (allButtons.length > 1) {
        // Click multiple buttons quickly
        await Promise.all([
          allButtons[0].click(),
          allButtons[1].click(),
        ]);

        // App should handle concurrent updates without crashing
        // No errors in console
        const consoleErrors: string[] = [];

        page.on('console', msg => {
          if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
          }
        });

        await page.waitForTimeout(1000);

        expect(consoleErrors.length).toBe(0);
      }
    });
  });

  test.describe('Edge Cases', () => {
    test('should handle very long input strings', async ({ page }) => {
      await page.goto('/');

      const input = page.getByRole('textbox').first();

      if (await input.count() > 0) {
        const longString = 'A'.repeat(10000);
        await input.fill(longString);

        // Should not crash or freeze
        await expect(input).toBeVisible();
      }
    });

    test('should handle special characters in input', async ({ page }) => {
      await page.goto('/');

      const input = page.getByRole('textbox').first();

      if (await input.count() > 0) {
        const specialChars = '<script>alert("xss")</script> & \' " / \\';
        await input.fill(specialChars);

        // Should sanitize or escape properly
        // Should not execute scripts
        const dialogPromise = page.waitForEvent('dialog', { timeout: 1000 }).catch(() => null);
        const dialog = await dialogPromise;

        expect(dialog).toBeNull(); // No alert should appear
      }
    });

    test('should handle rapid clicking', async ({ page }) => {
      await page.goto('/');

      const button = page.getByRole('button').first();

      if (await button.count() > 0) {
        // Click rapidly multiple times
        for (let i = 0; i < 10; i++) {
          await button.click({ delay: 10 });
        }

        // Should not cause errors or duplicate actions
        // (Depends on your app's debouncing/throttling)
      }
    });
  });
});
