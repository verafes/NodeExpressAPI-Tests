import { test, expect } from '@playwright/test';
import * as testData from '../testData/testData.js';


test('Title and URL as expected - Smoke test', async ({ page }) => {
    await page.goto(`${testData.BASE_URL}/`);

    await expect(page).toHaveURL(`${testData.BASE_URL}/`);
    await expect(page).toHaveTitle(testData.expectedHeaders.title);
});

test('H1 heading display and text validation - UI test', async ({ page }) => {
    await page.goto(`${testData.BASE_URL}/`);

    const headerLocator = page.getByRole('heading', { name: testData.expectedHeaders.h1 });

    await expect(headerLocator).toBeVisible();

    //second version
    const headerCssLocator = page.locator('#appName');
    
    await expect(headerCssLocator).toHaveText(testData.expectedHeaders.h1);
});

test('H2 headings display and text validation - UI test', async ({ page }) => {
    await page.goto(`${testData.BASE_URL}/`);

    const allH2 = await page.locator('h2');
    const h2Count = await allH2.count();

    await expect(h2Count).toBe(2);
    for (let i = 0; i < h2Count; i++) {
        await expect(allH2.nth(i)).toBeVisible();
        await expect(allH2.nth(i)).toHaveText(testData.expectedH2[i]);
    }
});

test('User form submission - Functional test', async ({ page }) => {
    await page.goto(`${testData.BASE_URL}/`);

    const firstNamePlaceholder = page.getByPlaceholder('Enter first name ...', { exact: true });
    await firstNamePlaceholder.fill("John");

    const lastNameLabel =  await page.getByLabel('Last Name', { exact: true });
    await lastNameLabel.fill("Doe");

    const ageId = await page.getByTestId('age');
    await ageId.fill('34');

    await expect(firstNamePlaceholder).toHaveValue('John');
    await expect(lastNameLabel).toHaveValue('Doe');
    await expect(ageId).toHaveValue('34');

    const addButton = await page.getByRole('button', { name: 'Add', exact: true });
    await addButton.click();
})