import {test, request, expect} from '@playwright/test';
import * as testData from '../testData/apiTestData/apiTestData.js';
import * as utils from '../utils/apiUtils/apiTestUtils';

const BASE_URL = 'http://localhost:5000/api';

let apiRequest;

test.beforeEach(async() => {
    apiRequest = await request.newContext();
})

test.afterEach(async() => {
    await apiRequest.dispose();
})

//example rare GET test scenario
test('GET /', async() => {
    const expectedResponseText = "Node Express API Server App";
    const apiRequest = await request.newContext();

    const response = await  apiRequest.get(`${BASE_URL}/`)

    const statusCode = response.status()
    const headersArray = response.headersArray()
    const contentType = headersArray
        .find((header) => header.name === 'Content-Type')
        .value

    console.log(response)
    console.log("------------------------")
    console.log("Response text:",await response.text())
    console.log("Response status:", statusCode)
    console.log("Response headers:", headersArray)
    console.log("contentType = " + contentType)

    //Assert response
    await expect(await response.text()).toEqual(expectedResponseText);
    await expect(statusCode).toBe(200);
    await expect(response).toBeOK();
})

// test GET scenario with utils
test('GET / with utils', async () => {
    const response = await apiRequest.get(`${testData.BASE_URL}/`); // act

    const statusCode = utils.getResponseStatus(response);

    await expect(statusCode).toBe(testData.expectedStatusCodes._200);

    const contentTypeHeaderValue = utils.getContentTypeHeaderValue(response);
    const contentLengthHeaderValue = utils.getContentLengthHeaderValue(response);
    const responseText = await utils.getResponseText(response);

    await expect(response).toBeOK();
    await expect(responseText).toEqual(testData.expectedTexts.successfulGetApiHome);
    await expect(contentTypeHeaderValue).toBe(testData.expectedHeaders.contentTypeValue.textHtml);
    await expect(contentLengthHeaderValue).toEqual(testData.expectedHeaders.contentLengthValue.successfulGetApiHomeLength);
})

//example rare 'GET empty DB message' test scenario
test('GET /users/ empty DB message', async() => {
    const expectedResponseText = "There are no users.";
    const expectedContentTypeValue = "text/html; charset=utf-8";
    const expectedContentLength = expectedResponseText.length.toString();

    const apiRequest = await request.newContext();

    // precondition to empty db
    await expect(
        await apiRequest.delete(`${BASE_URL}/users/`)
    ).toBeOK();

    const response = await apiRequest.get(`${BASE_URL}/users`);
    const statusCode = response.status();

    await expect(response).toBeOK();
    await expect(statusCode).toBe(200);
    expect(response.ok()).toBeTruthy();

    //headers
    const contentTypeHeaderValue = response
        .headersArray()
        .find((header) => header.name === 'Content-Type')
        .value;
    const contentLengthHeaderValue = response
        .headersArray()
        .find((header) => header.name === 'Content-Length')
        .value;
    const responseText = await response.text();

    await expect(contentTypeHeaderValue).toBe(expectedContentTypeValue);
    await expect(contentLengthHeaderValue).toBe(expectedContentLength);
    await expect(await response.text()).toEqual(expectedResponseText);
})

test('Create users', async () => {
    const apiRequest = await request.newContext();
    const response = await apiRequest.post(`${BASE_URL}/users`,{
        data: testData.userFirst
    })
    await expect(response.status()).toBe(200);
    await expect(await response.text()).toEqual("User created successfully.");
})

test("Get /users/ user's data", async() => {
    const apiRequest = await request.newContext();

    // preconditions: to empty db
    await expect(
        await apiRequest.delete(`${BASE_URL}/users/`)
    ).toBeOK();
    // to create a user
    await expect(
        await apiRequest.post(`${BASE_URL}/users`,{
            data: testData.userFirst
        })
    ).toBeOK();

    const response = await apiRequest.get(`${BASE_URL}/users`);

    const responseJson = await response.json();

    const currentFirstName = responseJson[0].firstName;
    const currentLastName = responseJson[0].lastName;
    const currentAge = responseJson[0].age;;

    await expect(response.status()).toBe(200);
    await expect(currentFirstName).toEqual(userFirst.firstName);
    await expect(currentLastName).toEqual(userFirst.lastName);
    await expect(currentAge).toEqual(userFirst.age);
})

test('PATCH /users/:id updates user by ID', async()  => {
    const expectedResponseText = "User was updated successfully.";
    const apiRequest = await request.newContext();

    // preconditions: to empty db
    await expect(
        await apiRequest.delete(`${BASE_URL}/users/`)
    ).toBeOK();
    // to create a user
    await expect(
        await apiRequest.post(`${BASE_URL}/users`,{
            data: testData.userFirst
        })
    ).toBeOK();

    const newUserResponse = await apiRequest.get(`${BASE_URL}/users`);
    const responseJson = await newUserResponse.json();
    const userId = responseJson[0]?.id;

    const patchResponse = await apiRequest.patch(`${BASE_URL}/users/${userId}`,{
        data: testData.userSecond
    })

    await expect(patchResponse.status()).toBe(200);
    await expect(await patchResponse.text()).toEqual(expectedResponseText);
})

test('GET /users/:id - retrieves user data by ID', async() => {
    const apiRequest = await request.newContext();

    // preconditions: to empty db
    await expect(
        await apiRequest.delete(`${BASE_URL}/users/`)
    ).toBeOK();
    // to create first user
    await expect(
        await apiRequest.post(`${BASE_URL}/users`,{
            data: testData.userFirst
        })
    ).toBeOK();
    // Create the second user
    await expect(
        await apiRequest.post(`${BASE_URL}/users`, {
            data: testData.userSecond
        })
    ).toBeOK();

    const newUserResponse = await apiRequest.get(`${BASE_URL}/users`);
    const responseJson = await newUserResponse.json();
    const userId = responseJson[0]?.id;
    console.log("users:", responseJson);

    const response = await apiRequest.get(`${BASE_URL}/users/${userId}`);

    const currentUserResponseJson = await response.json();
    console.log("current user:", currentUserResponseJson);

    const currentFirstName = currentUserResponseJson.firstName;
    const currentLastName = currentUserResponseJson.lastName;
    const currentAge = currentUserResponseJson.age;
    const currentUserId = currentUserResponseJson.id;

    await expect(response.status()).toBe(200);
    await expect(currentFirstName).toEqual(testData.userFirst.firstName);
    await expect(currentLastName).toEqual(testData.userFirst.lastName);
    await expect(currentAge).toEqual(testData.userFirst.age);
    await expect(currentUserId).toEqual(userId);
})

test('Delete /users/:id - deletes user by ID', async() => {
    const expectedResponseText = "User was deleted successfully.";
    const apiRequest = await request.newContext();

    // preconditions: to empty db
    await expect(
        await apiRequest.delete(`${BASE_URL}/users/`)
    ).toBeOK();
    // to create first user
    await expect(
        await apiRequest.post(`${BASE_URL}/users`,{
            data: testData.userFirst
        })
    ).toBeOK();

    const newUserResponse = await apiRequest.get(`${BASE_URL}/users`);
    const responseJson = await newUserResponse.json();
    const userId = responseJson[0]?.id;

    const response = await apiRequest.delete(`${BASE_URL}/users/${userId}`);

    await expect(response.status()).toBe(200);
    await expect(await response.text()).toEqual(expectedResponseText);
})