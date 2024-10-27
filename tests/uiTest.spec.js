import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5000';

test('Title and URL as expected', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);

    await expect(page).toHaveURL("http://localhost:5000/");
    await expect(page).toHaveTitle("My Express App");
});

test('Header text', async ({ page }) => {
    const expectedHeader = 'Node Express API Server App';
    await page.goto(`${BASE_URL}/`);

    const headerLocator = page.getByRole('heading', { name: expectedHeader });

    await expect(headerLocator).toBeVisible();

    //second version
    const headerCssLocator = page.locator("#appName");
    
    await expect(headerCssLocator).toHaveText(expectedHeader);
});