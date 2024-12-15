import {test, expect, request} from "@playwright/test";
import {users} from "../testData/functionalTestData/usersTestData";
import * as precondition from "../utils/preconditions";
import * as testData from "../testData/testData";
import * as utils from "../utils/apiUtils/apiTestUtils";
import * as apiTestData from "../testData/apiTestData/apiTestData";

test.describe('Icons created Functionality',
    async () => {
        let apiRequest;

        test.beforeEach('Land on Home Page, Create tested users', async ({page}) => {
            //1. DB is empty via api request
            apiRequest = await request.newContext()
            await precondition.setPrecondition_DeleteUsers(apiRequest);

            const response = await apiRequest.get(`${testData.USERS_END_POINT}/`);
            const responseText = await utils.getResponseText(response);
            await expect(responseText).toBe(apiTestData.expectedTexts.successfulGetUsersHomeEmptyDb);

            await page.goto(testData.HOME_PAGE_URL);
        });

        test(`TC-IconsUI-1: Verify Edit and Delete icons in table`, async ({page}) => {
            const firstNamePlaceholder = await page.getByPlaceholder("Enter first name...");
            const lastNamePlaceholder = await page.getByPlaceholder("Enter last name...");
            const agePlaceholder = await page.getByPlaceholder("Enter age...");
            const addButton = await page.getByRole('button', {name: 'Add', exact: true})
            const tableRows = await page.getByRole('row');

            await expect(tableRows).toHaveCount(1);
            await expect(await page.locator('table>tbody>tr')).toHaveCount(0);
            await expect(await page.locator('table>tbody>tr')
                .getByRole('cell').nth(4).locator("i>a>svg.bi-pen")).toHaveCount(0);
            await expect(await page.locator('table>tbody>tr')
                .getByRole('cell').nth(5).locator("i>a>svg.bi-trash")).toHaveCount(0);

            await firstNamePlaceholder.fill(users.user1.firstName);
            await lastNamePlaceholder.fill(users.user1.lastName);
            await agePlaceholder.fill(users.user1.age);
            await addButton.click();

            const userRow = await page.locator('table>tbody>tr');
            const userInfoCells = await userRow.getByRole('cell');
            const editIconInUserRow = await userRow.getByRole('cell').nth(4)
                .locator("i>a>svg.bi-pen");
            const deleteIconInUserRow = await userRow.getByRole('cell').nth(5)
                .locator("i>a>svg.bi-trash");

            await expect(tableRows).toHaveCount(2);
            await expect(userRow).toHaveCount(1);
            await expect(userInfoCells).toHaveCount(6);
            await expect(editIconInUserRow).toHaveCount(1);
            await expect(editIconInUserRow).toBeVisible();
            await expect(deleteIconInUserRow).toHaveCount(1);
            await expect(deleteIconInUserRow).toBeVisible();
        });

        test(`TC-IconsUI-2: Verify Icons change color on hover`, async ({page}) => {
            const firstNameField = await page.locator('#firstName');
            const lastNameField = await page.locator('#lastName');
            const ageField = await page.locator('#age');
            const addButton = await page.getByRole('button', {name: 'Add', exact: true})
            const tableRows = await page.getByRole('row');
            const userRow = await page.locator('table>tbody>tr');

            await expect(tableRows).toHaveCount(1);
            await expect(await page.locator('table>tbody>tr')).toHaveCount(0);
            await expect(await page.locator('table>tbody>tr').getByRole('cell').nth(4).locator("i>a>svg.bi-pen")).toHaveCount(0);
            await expect(await page.locator('table>tbody>tr').getByRole('cell').nth(5).locator("i>a>svg.bi-trash")).toHaveCount(0);

            await firstNameField.fill(users.user1.firstName);
            await lastNameField.fill(users.user1.lastName);
            await ageField.fill(users.user1.age);
            await addButton.click();
            const linkEdit = await userRow.getByRole('cell').nth(4).locator('i>a');
            const linkDelete = await userRow.getByRole('cell').nth(5).locator('i>a');

            await expect(linkEdit).toHaveCSS("color", "rgb(0, 0, 0)");
            await expect(linkDelete).toHaveCSS("color", "rgb(0, 0, 0)");

            await linkEdit.hover()
                .then(() => {
                        expect(linkEdit).toHaveCSS("color", "rgb(0, 139, 139)");
                    }
                )

            await linkDelete.hover()
                .then(() => {
                        expect(linkDelete).toHaveCSS("color", "rgb(255, 0, 0)");
                    }
                )
        })

        test.afterEach('Dispose request', async ({page}) => {
            await apiRequest.dispose();
        })
    });