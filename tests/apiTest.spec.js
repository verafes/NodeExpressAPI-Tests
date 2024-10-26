import {test, request, expect} from '@playwright/test'

const BASE_URL = 'http://localhost:5000'

const userFirst = {
    "firstName": "Joe",
    "lastName": "Buffalo",
    "age": 43,
}
const userSecond = {
    "firstName": "Sergey",
    "lastName": "Ivanov",
    "age": 25
}

test('GET /', async() => {
    const apiRequest = await request.newContext()

    const response = await  apiRequest.get(`${BASE_URL}/`)

    const statusCode = response.status()
    const headersArray = response.headersArray()
    const contentType = headersArray
        .find((header) => header.name === 'Content-Type')
        .value

    console.log(response)
    console.log("------------------------")
    console.log(await response.text())
    console.log(statusCode)
    console.log(headersArray)
    console.log("contentType = " + contentType)

    //Assert response
    expect(await response.text()).toEqual("Node Express API Server")
    expect(statusCode).toBe(200)
    await expect(response).toBeOK()
})
