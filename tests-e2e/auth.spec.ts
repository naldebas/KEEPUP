import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should allow a user to log in and see the dashboard', async ({ page }) => {
    // Navigate to the login page
    // Playwright will automatically use the baseURL from the config
    await page.goto('/'); 

    // Because of HashRouter, the initial path might redirect to /#/login or just be /#
    // We'll wait for the login form to be visible
    await expect(page.getByRole('heading', { name: 'Sign in to your account' })).toBeVisible();

    // Fill in the email and password
    await page.getByLabel('Email address').fill('pro@example.com');
    await page.getByLabel('Password').fill('password');

    // Click the sign-in button
    await page.getByRole('button', { name: 'Sign in' }).click();

    // After login, the user should be redirected to the dashboard
    // We can verify this by checking for an element unique to the dashboard,
    // like the "Welcome" heading.
    await expect(page.getByRole('heading', { name: 'Welcome, pro!' })).toBeVisible();
    
    // Check if the URL is correct for the dashboard page (root with hash)
    await expect(page).toHaveURL(/#\/$/);
  });

  test('should show an error for invalid credentials', async ({ page }) => {
    // This is a placeholder for a future test. 
    // Our current mock API doesn't simulate login failures, but in a real app, we would test this.
    // e.g., await api.auth.login('wrong@example.com', 'wrong');
    // await expect(page.getByText('Failed to log in.')).toBeVisible();
    test.skip(true, 'Login failure simulation not yet implemented in mock API.');
  });
});
