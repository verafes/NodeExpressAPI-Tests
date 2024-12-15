export const BASE_API_URL = 'http://localhost:5000/api';
export const USERS_ENDPOINT = `${BASE_API_URL}/users`;

export const expectedTexts = {
    successfulGetApiHome: "Node Express API Server App",
    unsuccessfulGet: "Cannot GET",
    successfulGetUsersHomeEmptyDb: "There are no users.",
}

export const expectedHeaders = {
    contentTypeValue: {
        applicationJson: "application/json; charset=utf-8",
        textHtml: "text/html; charset=utf-8",
    },
    contentLengthValue: {
        successfulGetApiHomeLength: expectedTexts.successfulGetApiHome.length.toString(),
        successfulGetApiUsersHomeEmptyDb: expectedTexts.successfulGetUsersHomeEmptyDb.length.toString(),
    },
}

export const expectedStatusCodes = {
    _200: 200,
}
export const expectedResponseObjectsCount = {
    _1: 1,
}
export const expected = {
    idLength: 36,
}

export const userFirst = {
    "firstName": "Joe",
    "lastName": "Buffalo",
    "age": 43,
}
export const userSecond = {
    "firstName": "Sergey",
    "lastName": "Ivanov",
    "age": 25
}

export const users = [
    {
        "firstName": "John",
        "lastName": "Doe",
        "age": 35,
    },
    {
        "firstName": "Jane",
        "lastName": "Doe",
        "age": 30,
    },
    {
        "firstName": "Jonny",
        "lastName": "Doe",
        "age": 10,
    },
    {
        "firstName": "Jane",
        "lastName": "Unique",
        "age": 46,
    }
]