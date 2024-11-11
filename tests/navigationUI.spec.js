import {test, expect} from '@playwright/test';
import * as testData from "../testData/testData";

test.describe('Navigation tabs are available', async() => {
    test.beforeEach('navigate to home page url', async ({page}) => {
        await page.goto(`${testData.BASE_URL}/`);
    });

    /* # Test Case 1: Verify Tabs Load Correctly
    Objective: Ensure all navigation tabs are displayed and labeled correctly.
    - Steps:
      1. Open the application.
      2. Check for the presence of each navigation tab.
    - Expected Result: All tabs should be visible and correctly labeled. */

    // parametrized test with inline test data
    [
        {tabName: 'Add', expected: 'nav-link active'},
        {tabName: 'Search', expected: 'nav-link'},
        {tabName: 'Edit', expected: 'nav-link'},
        {tabName: 'Delete', expected: 'nav-link'},
    ].forEach(({tabName, expected}) => {
        test(`TC-NavBar-1: Verify '${tabName}' Tab Loads Correctly and Available`, async ({page}) => {
            test.setTimeout(5000);

            const tab = await page.getByRole('link', {name: `${tabName}`, exact: true});
            const tabClassAttribute = await tab.getAttribute('class');

            await expect(tab).toBeAttached();
            await expect(tab).toHaveCount(1);
            await expect(tab).toBeVisible();
            await expect(tab).toBeEnabled();
            await expect(tabClassAttribute).toStrictEqual(`${expected}`);
        });
    });
});

