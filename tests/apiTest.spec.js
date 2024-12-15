import {test, request, expect} from '@playwright/test';
import * as apiTestData from '../testData/apiTestData/apiTestData.js';
import * as testData from '../testData/TestData.js';
import * as utils from '../utils/apiUtils/apiTestUtils';
import * as preconditions from '../utils/preconditions.js';

const BASE_API_URL = testData.BASE_API_URL;

let apiRequest;

test.beforeEach(async() => {
    apiRequest = await request.newContext();
})

test.afterEach(async() => {
    await apiRequest.dispose();
})

// Variation 1: Test for GET request to root with inline test data
test('GET /', async() => {
    const expectedResponseText = "Node Express API Server App";
    const apiRequest = await request.newContext();
    console.log(`${BASE_API_URL}`)
    const response = await  apiRequest.get(`${BASE_API_URL}/`)

    const statusCode = response.status()
    const headersArray = response.headersArray()
    const contentType = headersArray
        .find((header) => header.name === 'Content-Type')
        .value

    // Assert response
    await expect(await response.text()).toEqual(expectedResponseText);
    await expect(statusCode).toBe(200);
    await expect(response).toBeOK();
})

// Variation 2: Test for GET request to root with external test data and utility functions
test('GET / with utils', async () => {
    const response = await apiRequest.get(`${BASE_API_URL}/`);

    // Assert response status
    const statusCode = utils.getResponseStatus(response);

    await expect(statusCode).toBe(apiTestData.expectedStatusCodes._200);

    const contentTypeHeaderValue = utils.getContentTypeHeaderValue(response);
    const contentLengthHeaderValue = utils.getContentLengthHeaderValue(response);
    const responseText = await utils.getResponseText(response);

    // Assert the overall response
    await expect(response).toBeOK();
    await expect(responseText).toEqual(apiTestData.expectedTexts.successfulGetApiHome);
    await expect(contentTypeHeaderValue).toBe(apiTestData.expectedHeaders.contentTypeValue.textHtml);
    await expect(contentLengthHeaderValue).toEqual(apiTestData.expectedHeaders.contentLengthValue.successfulGetApiHomeLength);
})

// Variation 1: Test GET request for empty DB message with inline test data
test('GET /users/ empty DB message', async() => {
    const expectedResponseText = "There are no users.";
    const expectedContentTypeValue = "text/html; charset=utf-8";
    const expectedContentLength = expectedResponseText.length.toString();

    const apiRequest = await request.newContext();

    // Precondition: Clear the users database
    await expect(
        await apiRequest.delete(`${BASE_API_URL}/users/`)
    ).toBeOK();

    const response = await apiRequest.get(`${BASE_API_URL}/users`);
    const statusCode = response.status();

    // Assert response status and content
    await expect(response).toBeOK();
    await expect(statusCode).toBe(200);
    expect(response.ok()).toBeTruthy();

    // Headers locators
    const contentTypeHeaderValue = response
        .headersArray()
        .find((header) => header.name === 'Content-Type')
        .value;
    const contentLengthHeaderValue = response
        .headersArray()
        .find((header) => header.name === 'Content-Length')
        .value;

    // Assert headers and response text
    await expect(contentTypeHeaderValue).toBe(expectedContentTypeValue);
    await expect(contentLengthHeaderValue).toBe(expectedContentLength);
    await expect(await response.text()).toEqual(expectedResponseText);
})

// Variation 2: Test GET request for empty DB message response with external test data
test('GET /users/ empty DB message with utils', async () => {

    // Precondition: Clear the users database with utilities function
    await preconditions.setPrecondition_DeleteUsers(apiRequest);

    const response = await apiRequest.get(`${testData.USERS_END_POINT}/`);

    const statusCode = utils.getResponseStatus(response);

    // Assert precondition response status and content
    await expect(statusCode).toBe(apiTestData.expectedStatusCodes._200);

    //headers
    const contentTypeHeaderValue = utils.getContentTypeHeaderValue(response);
    const contentLengthHeaderValue = utils.getContentLengthHeaderValue(response);
    const responseText = await utils.getResponseText(response);

    // Assert headers and response text
    await expect(contentTypeHeaderValue).toBe(apiTestData.expectedHeaders.contentTypeValue.textHtml);
    await expect(contentLengthHeaderValue).toBe(apiTestData.expectedHeaders.contentLengthValue.successfulGetApiUsersHomeEmptyDb);
    await expect(responseText).toBe(apiTestData.expectedTexts.successfulGetUsersHomeEmptyDb);
})

// Test for creating a user via POST request
test('Create users', async () => {
    const apiRequest = await request.newContext();
    const response = await apiRequest.post(`${BASE_API_URL}/users`,{
        data: apiTestData.userFirst
    })

    // Assert response status and message
    await expect(response.status()).toBe(200);
    await expect(await response.text()).toEqual("User created successfully.");
})

// Variation 1: test for GET request to retrieve with inline preconditions
test("Get /users/ response users' data", async() => {
    const apiRequest = await request.newContext();

    //  Precondition: Clear the users database and create a new user
    await expect(
        await apiRequest.delete(`${BASE_API_URL}/users/`)
    ).toBeOK();

    await expect(
        await apiRequest.post(`${BASE_API_URL}/users`,{
            data: apiTestData.userFirst
        })
    ).toBeOK();

    // Act: Send a GET request to fetch users
    const response = await apiRequest.get(`${BASE_API_URL}/users`);

    const responseJson = await response.json();

    const currentFirstName = responseJson[0].firstName;
    const currentLastName = responseJson[0].lastName;
    const currentAge = responseJson[0].age;

    // Assert response status and user data
    await expect(response.status()).toBe(200);
    await expect(currentFirstName).toEqual(apiTestData.userFirst.firstName);
    await expect(currentLastName).toEqual(apiTestData.userFirst.lastName);
    await expect(currentAge).toEqual(apiTestData.userFirst.age);
})

// Variation 2: test for GET request to retrieve user data with external precondition
test ('GET /users/ response testData', async () => {

    // Precondition: Clear the users database and create a new user
    await preconditions.setPrecondition_DeleteUsers_CreateUser(apiRequest);

    // Act: Send a GET request to fetch users
    const response = await apiRequest.get(`${testData.USERS_END_POINT}/`);
    const statusCode = response.status();

    // Assert response status and validate response body
    await expect(statusCode).toBe(apiTestData.expectedStatusCodes._200);

    const contentTypeHeaderValue = utils.getContentTypeHeaderValue(response);
    const responseBody = await utils.getResponseBody(response);
    const isArray = await Array.isArray(responseBody);

    await expect(contentTypeHeaderValue).toBe(apiTestData.expectedHeaders.contentTypeValue.applicationJson);
    await expect(isArray).toBeTruthy();
    await expect(isArray).toBe(true);
    await expect(responseBody).toHaveLength(apiTestData.expectedResponseObjectsCount._1);
    await expect(responseBody[0].firstName).toBe(apiTestData.userFirst.firstName);
    await expect(responseBody[0].lastName).toBe(apiTestData.userFirst.lastName);
    await expect(responseBody[0].age).toBe(apiTestData.userFirst.age);
    await expect(responseBody[0].id.length).toBe(apiTestData.expected.idLength);
    console.log("test", await expect(responseBody[0].id.length).toBe(apiTestData.expected.idLength))
})

// Test for updating a user via PATCH request
test('PATCH /users/:id updates user by ID', async()  => {
    const expectedResponseText = "User was updated successfully.";
    const apiRequest = await request.newContext();

    // // Precondition: Clear the users database and create a new user
    await expect(
        await apiRequest.delete(`${BASE_API_URL}/users/`)
    ).toBeOK();

    await expect(
        await apiRequest.post(`${BASE_API_URL}/users`,{
            data: apiTestData.userFirst
        })
    ).toBeOK();

    // Act: Retrieve the created user and update their information
    const newUserResponse = await apiRequest.get(`${BASE_API_URL}/users`);
    const responseJson = await newUserResponse.json();
    const userId = responseJson[0]?.id;

    const patchResponse = await apiRequest.patch(`${BASE_API_URL}/users/${userId}`,{
        data: apiTestData.userSecond
    })

    // Assert response status and message
    await expect(patchResponse.status()).toBe(200);
    await expect(await patchResponse.text()).toEqual(expectedResponseText);
})

// Test for retrieving a user by ID via GET request
test('GET /users/:id - retrieves user data by ID', async() => {
    const apiRequest = await request.newContext();

    // Precondition: Clear the users database and create two new users
    await expect(
        await apiRequest.delete(`${BASE_API_URL}/users/`)
    ).toBeOK();

    await expect(
        await apiRequest.post(`${BASE_API_URL}/users`,{
            data: apiTestData.userFirst
        })
    ).toBeOK();

    await expect(
        await apiRequest.post(`${BASE_API_URL}/users`, {
            data: apiTestData.userSecond
        })
    ).toBeOK();

    // Act: Retrieve the list of users and get the ID of the first user
    const newUserResponse = await apiRequest.get(`${BASE_API_URL}/users`);
    const responseJson = await newUserResponse.json();
    const userId = responseJson[0]?.id;
    console.log("users:", responseJson);

    // Act: Retrieve the user by ID
    const response = await apiRequest.get(`${BASE_API_URL}/users/${userId}`);

    const currentUserResponseJson = await response.json();
    console.log("current user:", currentUserResponseJson);

    // Assert response status and validate user data
    const currentFirstName = currentUserResponseJson.firstName;
    const currentLastName = currentUserResponseJson.lastName;
    const currentAge = currentUserResponseJson.age;
    const currentUserId = currentUserResponseJson.id;

    await expect(response.status()).toBe(200);
    await expect(currentFirstName).toEqual(apiTestData.userFirst.firstName);
    await expect(currentLastName).toEqual(apiTestData.userFirst.lastName);
    await expect(currentAge).toEqual(apiTestData.userFirst.age);
    await expect(currentUserId).toEqual(userId);
})

test('Delete /users/:id - deletes user by ID', async() => {
    const expectedResponseText = "User was deleted successfully.";
    const apiRequest = await request.newContext();

    // preconditions: to empty db
    await expect(
        await apiRequest.delete(`${BASE_API_URL}/users/`)
    ).toBeOK();
    // to create first user
    await expect(
        await apiRequest.post(`${BASE_API_URL}/users`,{
            data: apiTestData.userFirst
        })
    ).toBeOK();

    const newUserResponse = await apiRequest.get(`${BASE_API_URL}/users`);
    const responseJson = await newUserResponse.json();
    const userId = responseJson[0]?.id;

    const response = await apiRequest.delete(`${BASE_API_URL}/users/${userId}`);

    await expect(response.status()).toBe(200);
    await expect(await response.text()).toEqual(expectedResponseText);
})