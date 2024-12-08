import { test, expect, request } from '@playwright/test';
import { users } from "../testData/functionalTestData/usersTestData";
import { data } from "../testData/functionalTestData/searchFuncTestData";
import * as testData from '../testData/testData.js';
import * as precondition from "../utils/preconditions.js";
import * as utils from "../utils/apiUtils/apiTestUtils";
import * as apiTestData from "../testData/apiTestData/apiTestData";

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

            const response = await apiRequest.get(`http://localhost:5000/api/users/`);
            console.log(`${testData.USERS_END_POINT}`)
            const responseText = await utils.getResponseText(response);
            await expect(responseText).toBe(apiTestData.expectedTexts.successfulGetUsersHomeEmptyDb);
            console.log("responseText", responseText)

            // Create UsersDB contains at least 3 users

            const firstNameField = await page.getByPlaceholder('Enter first name ...');
            const lastNameField = await page.getByPlaceholder('Enter last name ...');
            const ageField = await page.getByPlaceholder('Enter age ...');

            const addButton = await page.locator('#addButton');

            // const userID = await page.locator('#userId');
            // const firstUserId = page.locator('[data-row="userId"]').nth(0);

            for (const user of usersDB) {
                await firstNameField.fill(user.firstName);
                await lastNameField.fill(user.lastName);
                await ageField.fill(user.age);
                await addButton.waitFor({ state: 'visible' });

                await addButton.click();
                console.log("click")
                test.setTimeout(1000);

                // await userID.waitFor({ state: 'visible' });
                //
                // console.log(await userID.last().textContent())
                // user.id = await userID.last().innerText();
                // console.log("user.id",  user.id)
                // user.id = await page.locator('#userId').innerText()
            }

            console.log(`TC-SearchFun-1: ${tcName}, user db`, usersDB, );
            const response2 = await apiRequest.get(`http://localhost:5000/api/users/`);
            const responseText2 = await utils.getResponseText(response2);
            console.log("responseText2", responseText2)

        })
        //  test
        test(`TC-SearchFun-1: ${tcName}`, async({ page }) => {
            console.log(`Test 1: ${tcName}`);
            test.setTimeout(10000);

            await page.locator('[href*="/search"]').click()
            const userIdField = await page.getByPlaceholder('Enter user ID ...')
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
            const fname = searchCriteria[1];
            console.log("first name", fname);

            const lastNameField =  await page.getByLabel(`${testData.expectedFormTexts.lastNameLabel}`, { exact: true });
            await lastNameField.fill(searchCriteria[2]);
            const lname = searchCriteria[2];
            console.log("last name", lname);

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
                    .last().innerText()
                const actualFirstUserName = await page.locator('tbody>tr')
                    .nth(i).locator('td')
                    .first().innerText()
                const actualLastUserName = await page.locator('tbody>tr')
                    .nth(i).locator('td')
                    .nth(1).innerText()
                const actualAge = await page.locator('tbody>tr')
                    .nth(i).locator('td')
                    .nth(2).innerText()

                console.log(actualFirstUserName, actualLastUserName, actualAge)

                await expect(actualFirstUserName).toEqual(expectedUsers[i].firstName)
                await expect(actualLastUserName).toEqual(expectedUsers[i].lastName)
                await expect(actualAge).toEqual(expectedUsers[i].age)
                await expect(actualUserId).toEqual(expectedUsers[i].id)
            }
        })

        test.afterEach('Close API request context', async () => {
            await apiRequest.dispose();
        })
    })
})