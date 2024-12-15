import {test, expect, request} from '@playwright/test';
import * as testData from '../testData/testData.js';
import * as precondition from "../utils/preconditions.js";
import * as utils from '../utils/apiUtils/apiTestUtils';
import {setPrecondition_DeleteUsers_CreateUsers} from "../utils/preconditions.js";

/*
TC-LocalStorageFun-1:
Preconditions:
1. UsersDB contains at least 3 users
2. User is on Home page

Steps:
1. Randomly select User
2. Click Edit icon
3. Get data from localStorage

Expected result:
Data from localStorage should be the same as the random user's data.
*/

test.describe('Save and retrieve data to local storage functionality', async() => {
        let apiRequest;

    test.beforeEach('Delete DB, create DB via API, navigate to home page url', async ({page}) => {
        //1. DB is empty via api request
        apiRequest = await request.newContext()
        await precondition.setPrecondition_DeleteUsers_CreateUsers(apiRequest);

        await page.goto(testData.HOME_PAGE_URL);
    });

    test(`TC-LocalStorageFunc-1: First user's data is saved to Local Storage on clicking Edit icon`, async ({page}) => {
        console.log("Test 1");

        const users = page.locator('tbody > tr');

        await expect(await users.count()).toBeGreaterThanOrEqual(1);

        const firstUser = await users.first();
        const firstUserText = (await firstUser.allInnerTexts())[0].split('\t');
        let firstUserData = [];

        for(let i = 1; i <= 4; i++) {
            firstUserData[i - 1] = firstUserText[i];
        }

        const firstUserEditIcon = await firstUser.locator('td').nth(4).locator('i>a');

        await firstUserEditIcon.hover().then(async() => {
            await firstUserEditIcon.click();
        });

        const lsId = await page.evaluate(() => localStorage.getItem('idValue'));
        const lsFirstName = await page.evaluate(() => localStorage.getItem('firstNameValue'));
        const lsLastName = await page.evaluate(() => localStorage.getItem('lastNameValue'));
        const lsAge = await page.evaluate(() => localStorage.getItem('ageValue'));

        await expect(lsId).toEqual(firstUserData[3]);
        await expect(lsFirstName).toEqual(firstUserData[0]);
        await expect(lsLastName).toEqual(firstUserData[1]);
        await expect(lsAge).toEqual(firstUserData[2]);
    });

    test(`TC-LocalStorageFunc-2: Random user's data is saved to Local Storage on clicking Edit icon`, async ({page}) => {
        console.log("Test 2");

        const users = page.locator('tbody > tr');
        const usersAmount = await users.count();

        await expect(usersAmount).toBeGreaterThanOrEqual(1);

        let randomUserIndex = Math.floor(Math.random() * usersAmount);
        const randomUser = await users.nth(randomUserIndex);
        const randomUserText = (await randomUser.allInnerTexts())[0].split('\t');

        let randomUserData = [];

        for(let i = 1; i <= 4; i++) {
            randomUserData[i - 1] = randomUserText[i];
        }

        const randomUserEditIcon = await randomUser.locator('td').nth(4).locator('i>a');

        await randomUserEditIcon.hover().then(async() => {
            await randomUserEditIcon.click();
        });

        const lsId = await page.evaluate(() => localStorage.getItem('idValue'));
        const lsFirstName = await page.evaluate(() => localStorage.getItem('firstNameValue'));
        const lsLastName = await page.evaluate(() => localStorage.getItem('lastNameValue'));
        const lsAge = await page.evaluate(() => localStorage.getItem('ageValue'));

        await expect(lsId).toEqual(randomUserData[3]);
        await expect(lsFirstName).toEqual(randomUserData[0]);
        await expect(lsLastName).toEqual(randomUserData[1]);
        await expect(lsAge).toEqual(randomUserData[2]);
    });

    test.afterEach('Close API request context', async () => {
        await apiRequest.dispose();
    });
})