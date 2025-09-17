import { test, expect } from '@playwright/test';

test.describe('Reservations Page CRUD', () => {
  // Before each test, log in and navigate to the reservations page
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Email address').fill('pro@example.com');
    await page.getByLabel('Password').fill('password');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await page.getByRole('link', { name: 'Reservations' }).click();
    await expect(page.getByRole('heading', { name: 'Reservations' })).toBeVisible();
  });

  test('should create, update, and delete a reservation', async ({ page }) => {
    // --- CREATE ---
    await page.getByRole('button', { name: 'Add Reservation' }).click();
    
    // Fill out the form in the modal
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();
    await modal.getByLabel('Customer Name').fill('Test User');
    await modal.getByLabel('Party Size').fill('3');
    await modal.getByLabel('Date').fill('2024-12-25');
    await modal.getByLabel('Time').fill('20:00');
    await modal.getByLabel('Status').selectOption('Confirmed');

    await modal.getByRole('button', { name: 'Save Reservation' }).click();
    
    // Verify the new reservation is in the table
    const newRow = page.getByRole('row', { name: /Test User/ });
    await expect(newRow).toBeVisible();
    await expect(newRow.getByRole('cell', { name: 'Test User' })).toBeVisible();
    await expect(newRow.getByRole('cell', { name: '3' })).toBeVisible();
    await expect(newRow.getByRole('cell', { name: 'Confirmed' })).toBeVisible();

    // --- UPDATE ---
    await newRow.getByRole('button', { name: 'Edit' }).click();
    
    // Change the party size in the modal
    const editModal = page.getByRole('dialog');
    await expect(editModal).toBeVisible();
    await editModal.getByLabel('Party Size').fill('4');
    await editModal.getByRole('button', { name: 'Save Reservation' }).click();
    
    // Verify the party size has been updated in the table
    await expect(newRow.getByRole('cell', { name: '4' })).toBeVisible();
    
    // --- DELETE ---
    // Playwright needs to handle the confirm dialog
    page.on('dialog', dialog => dialog.accept());
    
    await newRow.getByRole('button', { name: 'Delete' }).click();
    
    // Verify the row has been removed from the table
    await expect(newRow).not.toBeVisible();
  });
});
