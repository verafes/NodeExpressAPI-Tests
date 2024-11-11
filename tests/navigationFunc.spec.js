import { test, expect } from "@playwright/test";
import * as testData from "../testData/testData";

// parametrized test with external test data
testData.navigationData.forEach(({
    tabName , header, buttonName, expectedCount, expectedLabels, expectedURL,
    expectedTitle, expectedActiveClass, expectedAriaCurrent
    }) => {
    test.describe('Navigation Tabs Functionality', async () => {
        test.beforeEach('Navigate to home page url', async({ page }) => {
            await page.goto(`${testData.BASE_URL}/`);
        })
        /* # Test Case func 1: Verify Tab Navigation Functionality
        Objective: Ensure each tab navigates to the correct content/page.
        - Steps:
          1. Click on each tab (e.g., "Home", "About", "Contact").
          2. Verify the correct page content is loaded for each tab.
        - Expected Result: Clicking each tab should navigate to the correct corresponding page. */

        test(`TC-NavTabFunc-1: Verify '${tabName}' Tab Navigation Functionality.`, async({ page }) => {
            test.setTimeout(20000);
            const tab = await page.getByRole('link', { name: `${tabName}`, exact:  true });
            await tab.click();
            const h2Header = await page.getByRole('heading', { name: `${header}`, exact: true });
            const button = await page.getByRole('button', { name: `${buttonName}`, exact: true });
            const formFields = await page.locator('.form-group');
            const labelsTexts = await formFields.locator('label').allInnerTexts();

            // Assert h2, button, UserId
            await expect(h2Header).toBeVisible();
            await expect(button).toBeVisible();
            await expect(button).toBeEnabled({ enabled: false });
            await expect(formFields).toHaveCount(expectedCount);
            await expect(labelsTexts).toEqual(expectedLabels);
        })

        /* # Test Case func 2: Verify Active Tab Highlight
        Objective: Ensure the active tab is highlighted.
        - Steps:
        1. Click on any tab.
        2. Check if the clicked tab is highlighted to indicate it is active.
        - Expected Result: The clicked tab should have a distinct highlight. */

        test(`TC-NavTabFunc-2: Verify Active '${tabName}' Tab Highlight.`, async({ page }) => {
            test.setTimeout(20000);
            const tab = await page.getByRole('link', { name: `${tabName}`, exact:  true });
            await tab.click();

            await expect(tab).toHaveClass(expectedActiveClass);
        })

        /* # Test Case 3: Verify URL Change on Tab Click
          Objective: Ensure URL updates correctly based on tab navigation.
         - Steps:
          1. Click on each tab.
          2. Verify the URL and title updates according to the active tab.
        - Expected Result: URL and psge title should change based on the active tab. */

        test(`TC-NavTabFunc-3: Verify '${expectedURL}' URL AND '${expectedTitle}' Change on '${tabName}' Tab Click.`, async({ page }) => {
            test.setTimeout(20000);
            const tab = await page.getByRole('link', { name: `${tabName}`, exact:  true });
            await tab.click();
            const url = page.url();
            const title = await page.title();

            //Assert current url and title
            await expect(url).toEqual(expectedURL);
            await expect(title).toEqual(expectedTitle);
        })

        /* # Test Case 4: Verify Tab Persistence on Page Refresh
        Objective: Ensure the selected tab remains active after a page refresh.
        - Steps:
        1. Click on a tab.
        2. Refresh the page.
        3. Verify the same tab remains active after the refresh.
        - Expected Result: The active tab before the refresh should remain active afterward. */

        test(`TC-NavTabFunc-4: Verify '${tabName}' Tab Persistence on Page Refresh.`, async({ page }) => {
            test.setTimeout(20000);

            const tab = await page.getByRole('link', { name: `${tabName}`, exact: true });
            await tab.click();

            // Verify the tab has the 'active' class before the refresh
            await expect(tab).toHaveClass(expectedActiveClass);

            // Refresh the page
            await page.reload();

            // Re-locate the tab after the page reload
            const refreshedTab = await page.getByRole('link', { name: `${tabName}`, exact: true });

            // Assert the tab still has the 'active' class after the refresh
            await expect(refreshedTab).toHaveClass(expectedActiveClass);

            // Assert the tab has the 'aria-current' attribute for further validation
            await expect(refreshedTab).toHaveAttribute('aria-current', expectedAriaCurrent);
        })
    })
})