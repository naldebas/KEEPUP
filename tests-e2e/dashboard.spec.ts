import { test, expect } from '@playwright/test';

test.describe('Dashboard Page', () => {
  // Before each test, log in as a user with export permissions
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Sign in to your account' })).toBeVisible();
    await page.getByLabel('Email address').fill('pro@example.com');
    await page.getByLabel('Password').fill('password');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByRole('heading', { name: 'Welcome, pro!' })).toBeVisible();
  });

  test('should display key dashboard widgets', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Revenue Trends' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Customer Growth' })).toBeVisible();
    await expect(page.getByRole('heading', { name: "Today's Bookings" })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Top Customers (by CLV)' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Loyalty Engagement' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Booking Calendar' })).toBeVisible();
  });

  test('should allow changing the time period', async ({ page }) => {
    // The 30d button should be active by default
    const button30d = page.getByRole('button', { name: '30d' });
    await expect(button30d).toHaveClass(/bg-primary-500/);

    // Click the 7d button
    const button7d = page.getByRole('button', { name: '7d' });
    await button7d.click();

    // Now 7d button should be active and 30d should not
    await expect(button7d).toHaveClass(/bg-primary-500/);
    await expect(button30d).not.toHaveClass(/bg-primary-500/);

    // Check the dashboard description text update
    await expect(page.getByText("Here's your business overview for the last 7 days.")).toBeVisible();
  });

  test('should allow exporting data for an authorized user', async ({ page }) => {
    const exportButton = page.getByRole('button', { name: 'Export CSV' });
    await expect(exportButton).toBeEnabled();

    // Start waiting for the download before clicking.
    const downloadPromise = page.waitForEvent('download');
    await exportButton.click();
    const download = await downloadPromise;

    // Verify download details
    expect(download.suggestedFilename()).toBe('dashboard-export-30d.csv');
  });
  
  test('should disable export and show tooltip for an unauthorized user', async ({ page }) => {
    // Log out as 'pro' user
    await page.getByRole('button', { name: 'pro' }).click();
    await page.getByRole('button', { name: 'Sign out' }).click();
    await expect(page.getByRole('heading', { name: 'Sign in to your account' })).toBeVisible();

    // Log in as 'free' user
    await page.getByLabel('Email address').fill('free@example.com');
    await page.getByLabel('Password').fill('password');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByRole('heading', { name: 'Welcome, free!' })).toBeVisible();

    const exportButton = page.getByRole('button', { name: 'Export CSV' });
    await expect(exportButton).toBeDisabled();
    
    // The button is inside the group div, so we find the parent and hover
    const wrapper = page.locator('.group', { has: exportButton });
    await wrapper.hover();
    await expect(page.getByText('Upgrade your plan to access this feature.')).toBeVisible();
  });
});
