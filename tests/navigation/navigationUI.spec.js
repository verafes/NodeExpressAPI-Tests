import {test, expect} from '@playwright/test';
import * as testData from "../../testData/testData";

test.describe('Navigation tabs are available', async() => {
    test.beforeEach('navigate to home page url', async ({page}) => {
        await page.goto(`${testData.BASE_URL}/`);
    });

    /* Test Case 1: Verify Tabs Load Correctly
    Objective: Ensure all navigation tabs are displayed and labeled correctly.
    - Steps:
      1. Open the application.
      2. Check for the presence of each navigation tab (e.g., "Home", "About", "Contact").
    - Expected Result: All tabs should be visible and correctly labeled. */

    [
        {tabName: 'Add', expected: 'nav-link active'},
        {tabName: 'Search', expected: 'nav-link'},
        {tabName: 'Edit', expected: 'nav-link'},
        {tabName: 'Delete', expected: 'nav-link'},
    ].forEach(({tabName, expected}) => {
        test(`TC-NavBar-1: Verify  ${tabName} Tab Loads Correctly and Available`, async ({page}) => {
            test.setTimeout(5000);

            const tab = await page.getByRole('link', {name: `${tabName}`, exact: true});
            const tabClassAttribute = await tab.getAttribute('class');

            await expect(tab).toBeAttached();
            await expect(tab).toHaveCount(1);
            await expect(tab).toBeVisible();
            await expect(tab).toBeEnabled();
            await expect(tabClassAttribute).toStrictEqual(`${expected}`);
        })
    })

    /* Test Case 2: Verify Tab Navigation Functionality
       Objective: Ensure each tab navigates to the correct content/page.
       - Steps:
         1. Click on each tab.
         2. Verify the correct page content is loaded for each tab.
       - Expected Result: Clicking each tab should navigate to the correct corresponding page. */

    const navigationData = [
        {tabName: 'Add', expectedURL: 'http://localhost:5000/add', expectedTitle: 'Users App' },
        {tabName: 'Search', expectedURL: 'http://localhost:5000/search', expectedTitle: 'Edit User' },
        {tabName: 'Edit', expectedURL: 'http://localhost:5000/edit', expectedTitle: 'Search Users' },
        {tabName: 'Delete', expectedURL: 'http://localhost:5000/delete', expectedTitle: 'Delete Users' }
    ]
    for( const {tabName, expectedURL, expectedTitle} of navigationData) {
        test(`TC-NavTabFun-2: Verify ${expectedURL} URL AND ${expectedTitle} Change on ${tabName} Tab Click.`, async({ page }) => {
            test.setTimeout(20000);

            const tab = await page.getByRole('link', { name: `${tabName}`, exact:  true });

            await tab.click();

            const url = page.url();
            const title = await page.title();

            //url, title
            await expect(url).toEqual(expectedURL);
            await expect(title).toEqual(expectedTitle);
        })
    }
})

