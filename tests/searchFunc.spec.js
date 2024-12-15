import { test, expect, request } from '@playwright/test';
import { users } from "../testData/functionalTestData/usersTestData";
import { data } from "../testData/functionalTestData/searchFuncTestData";
import * as testData from '../testData/testData.js';
import * as precondition from "../utils/preconditions.js";

/*  TC-SearchFunc-1
*
* Precondition
* 1. DB is empty
* 2. User is more Home page
* 3. UsersDB contain at least 3 users
*
* Steps:
* 1. CLick on Search Tab
* 2. Fill search criteria in corresponding fields
* 3. CLick Search button
*
* Expected results: at least 1 search result is shown in User List table
* */

[
    {tcName: data._1.tcName, searchCriteria: data._1.searchCriteria, expectedCount: data._1.expectedCount, expectedUsers: data._1.expectedUsers},
    {tcName: data._2.tcName, searchCriteria: data._2.searchCriteria, expectedCount: data._2.expectedCount, expectedUsers: data._2.expectedUsers},
    {tcName: data._3.tcName, searchCriteria: data._3.searchCriteria, expectedCount: data._3.expectedCount, expectedUsers: data._3.expectedUsers},
    {tcName: data._4.tcName, searchCriteria: data._4.searchCriteria, expectedCount: data._4.expectedCount, expectedUsers: data._4.expectedUsers},
    {tcName: data._5.tcName, searchCriteria: data._5.searchCriteria, expectedCount: data._5.expectedCount, expectedUsers: data._5.expectedUsers},
    {tcName: data._6.tcName, searchCriteria: data._6.searchCriteria, expectedCount: data._6.expectedCount, expectedUsers: data._6.expectedUsers},
].forEach(({tcName, searchCriteria, expectedCount, expectedUsers}) => {
    test.describe('Search User Functionality', async() => {
        let apiRequest;
        const usersDB = [users.user1, users.user2, users.user3, users.user4];

        test.beforeEach('Land on Home Page, Create tested users', async({page}) => {
            apiRequest = await request.newContext()
            await precondition.setPrecondition_DeleteUsers(apiRequest);

            await page.goto(testData.HOME_PAGE_URL);

            // Create UsersDB contains at least 4 users
            const firstNameField = await page.getByPlaceholder('Enter first name...');
            const lastNameField = await page.getByPlaceholder('Enter last name...');
            const ageField = await page.getByPlaceholder('Enter age...')
            const addButton = await page.getByRole('button', {name: "Add"});
            const userID = page.locator('td[data-row="userId"]');

            for (let i = 0; i < usersDB.length; i++) {
                const user = usersDB[i];

                await firstNameField.fill(user.firstName);
                await lastNameField.fill(user.lastName);
                await ageField.fill(user.age);

                await addButton.click();

                user.id = await userID.nth(i).textContent();
            }

        })
        //  test
        test.skip(`TC-SearchFun-1: ${tcName}`, async({ page }) => {
            console.log(`Test 1: ${tcName}`);
            test.setTimeout(10000);

            await page.locator('[href*="/search"]').click()
            const userIdField = await page.getByPlaceholder('Enter user ID...')
            const searchButton = await page.getByRole('button', {name: 'Search'})

            await page.goto(testData.HOME_PAGE_URL);
            const tabSearch = await page.getByRole('link', { name: `Search`, exact:  true });
            await tabSearch.click();

            const searchH2 = await page.locator('h2').first();
            const h2Text = await searchH2.textContent();
            await expect(searchH2).toBeVisible();
            await expect(searchH2).toHaveText(testData.navigationData[1].header);

            //Fill search criteria in corresponding fields
            const firstNameField = page.getByLabel( `${testData.expectedFormTexts.firstNameLabel}`, { exact: true });
            await firstNameField.fill(searchCriteria[1]);

            const lastNameField =  await page.getByLabel(`${testData.expectedFormTexts.lastNameLabel}`, { exact: true });
            await lastNameField.fill(searchCriteria[2]);

            const ageField = await page.getByTestId(`${testData.expectedFormTexts.ageID}`);
            const ageValue = searchCriteria[3];
            console.log("age=", ageValue);
            ageValue === "" ? await ageField.clear() : await ageField.fill(ageValue);

            await userIdField.fill(searchCriteria[0])
            await firstNameField.fill(searchCriteria[1])
            await lastNameField.fill(searchCriteria[2])
            await ageField.fill(searchCriteria[3])
            await searchButton.click()

            const actualListSearchedUsers = await page.locator('tbody')
                .locator('tr').all()
            const actualCountSearchedUsers = actualListSearchedUsers.length

            await expect(actualCountSearchedUsers).toEqual(expectedCount)

            for (let i = 0; i < actualCountSearchedUsers; i++) {

                const actualUserId = await page.locator('tbody>tr')
                    .nth(i).locator('td')
                    .nth(3).innerText()
                const actualFirstUserName = await page.locator('tbody>tr')
                    .nth(i).locator('td')
                    .first().innerText()
                const actualLastUserName = await page.locator('tbody>tr')
                    .nth(i).locator('td')
                    .nth(1).innerText()
                const actualAge = await page.locator('tbody>tr')
                    .nth(i).locator('td')
                    .nth(2).innerText()

                await expect(actualFirstUserName).toEqual(expectedUsers[i].firstName)
                await expect(actualLastUserName).toEqual(expectedUsers[i].lastName)
                await expect(actualAge).toEqual(expectedUsers[i].age)
                await expect(actualUserId).toEqual(expectedUsers[i].id)
            }
        });
        // tests: Variation 2
        test(`TC-SearchFun-2: ${tcName}`, async ({page}) => {
            const searchTab = await page.getByRole('link', { name: 'Search'});

            await searchTab.click();

            let tableRows = await page.locator('tbody>tr');
            console.log("tableRows", await tableRows, "tableRows-COUNT", await tableRows.count())
            // await expect(await tableRows).toHaveCount(usersDB.length);

            const userIdField = await page.getByPlaceholder('Enter user ID...');
            const firstNameField = await page.getByPlaceholder('Enter first name...');
            const lastNameField = await page.getByPlaceholder('Enter last name...');
            const ageField = await page.getByPlaceholder('Enter age...');
            const searchButton = await page.getByRole('button', {name: 'Search'});

            await userIdField.fill(searchCriteria[0]);
            await firstNameField.fill(searchCriteria[1]);
            await lastNameField.fill(searchCriteria[2]);
            await ageField.fill(searchCriteria[3]);

            await searchButton.click();

            const foundUsers = [];
            tableRows = await page.locator('tbody tr');
            const usersList = await tableRows.allInnerTexts();

            for(let userInfo of usersList) {
                userInfo = userInfo.split('\t');
                userInfo = userInfo.slice(1);

                const user = {};
                user.firstName = userInfo[0];
                user.lastName = userInfo[1];
                user.age = userInfo[2];
                user.id = userInfo[3];

                foundUsers.push(user);
            }

            await expect(tableRows.count()).not.toBe(usersDB.length);
            await expect(tableRows).toHaveCount(expectedCount);
            await expect(foundUsers.length).toBe(expectedCount);
            await expect(foundUsers).toStrictEqual(expectedUsers);

        })

        test.afterEach('Close API request context', async () => {
            await apiRequest.dispose();
        });
    });
})