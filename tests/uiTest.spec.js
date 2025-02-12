import { test, expect } from '@playwright/test';
import * as testData from '../testData/testData.js';
import { usersData } from '../testData/testData.js';


test('Title and URL as expected - Smoke test', async ({ page }) => {
    // Navigate to the base URL
    await page.goto(`${testData.HOME_PAGE_URL}`);

    // Verify URL and title
    await expect(page).toHaveURL(`${testData.HOME_PAGE_URL}/`);
    await expect(page).toHaveTitle(testData.expectedHeaders.title);
});

test('H1 heading display and text validation - UI test', async ({ page }) => {
    // Navigate to the base URL
    await page.goto(`${testData.HOME_PAGE_URL}`);

    // Locate H1 header and check visibility
    const headerLocator = page.getByRole('heading', { name: testData.expectedHeaders.h1 });

    await expect(headerLocator).toBeVisible();

    // Alternative locator with CSS
    const headerCssLocator = page.locator('#appName');

    // Assert that the H1 header
    await expect(headerCssLocator).toHaveText(testData.expectedHeaders.h1);
});

test('H2 headings display and text validation - UI test', async ({ page }) => {
    await page.goto(`${testData.HOME_PAGE_URL}`);

    // Check H2 elements
    const allH2 = await page.locator('h2');
    const h2Count = await allH2.count();

    await expect(h2Count).toBe(2);

    // Validate each H2's visibility and text
    for (let i = 0; i < h2Count; i++) {
        await expect(allH2.nth(i)).toBeVisible();
        await expect(allH2.nth(i)).toHaveText(testData.expectedH2[i]);
    }
});

// Variation 1: Functional test with inline test data
test('User form submission - Functional test', async ({ page }) => {
    // Navigate to the base URL
    await page.goto(`${testData.HOME_PAGE_URL}`);

    // Fill the user form with inline data
    const firstNamePlaceholder = page.getByPlaceholder('Enter first name ...', { exact: true });
    await firstNamePlaceholder.fill("John");

    const lastNameLabel =  await page.getByLabel('Last Name', { exact: true });
    await lastNameLabel.fill("Doe");

    const ageId = await page.getByTestId('age');
    await ageId.fill('34');

    // Assert values
    await expect(firstNamePlaceholder).toHaveValue('John');
    await expect(lastNameLabel).toHaveValue('Doe');
    await expect(ageId).toHaveValue('34');

    // Submit the form
    const addButton = await page.getByRole('button', { name: 'Add', exact: true });
    await addButton.click();
})

// Variation 2: Functional test using external test data
test('User form submission - Functional test - using external test data', async ({ page }) => {
    // Navigate to the base URL
    await page.goto(`${testData.HOME_PAGE_URL}`);

    // Fill the user form with data from usersData
    const firstNamePlaceholder = page.getByPlaceholder( `${testData.expectedFormTexts.firstNameInputPlaceholder}`, { exact: true });
    await firstNamePlaceholder.fill(`${usersData[0].firstName}`);

    const lastNameLabel =  await page.getByLabel(`${testData.expectedFormTexts.lastNameLabel}`, { exact: true });
    await lastNameLabel.fill(`${usersData[0].lastName}`);

    const ageId = await page.getByTestId(`${testData.expectedFormTexts.ageID}`);
    await ageId.fill(`${usersData[0].age}`);

    // Assert values
    await expect(firstNamePlaceholder).toHaveValue(`${usersData[0].firstName}`);
    await expect(lastNameLabel).toHaveValue(`${usersData[0].lastName}`);
    await expect(ageId).toHaveValue(`${usersData[0].age}`);

    // Submit the form
    const addButton = await page.getByRole('button', { name: 'Add', exact: true });
    await addButton.click();
})