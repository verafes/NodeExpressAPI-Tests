import * as testData from "../testData/apiTestData/apiTestData";

// CHECK: throw only if the request itself failed
async function assertOk(response, label) {
    if (response.status() !== 200) {
        throw new Error(`[PRECONDITION] ${label} failed: ${response.status()} ${await response.text()}`);
    }
}

export async function setPrecondition_DeleteUsers_CreateUser(request) {
    try {
        const del = await request.delete(`${testData.USERS_ENDPOINT}/`)
        await assertOk(del, 'DELETE /users/');

        const post = await request.post(
            `${testData.USERS_ENDPOINT}/`,
            {data: testData.userFirst,}
            );
        await assertOk(post, 'POST /users/ (userFirst)');
    } catch (e) {
        throw new Error(`[PRECONDITION] setPrecondition_DeleteUsers_CreateUser: ${e.message}`);
    }
}

export async function setPrecondition_DeleteUsers(request) {
    try {
        const del = await request.delete(`${testData.USERS_ENDPOINT}/`);
        await assertOk(del, 'DELETE /users/');
    } catch (e) {
        throw new Error(`[PRECONDITION] setPrecondition_DeleteUsers: ${e.message}`);
    }
}

export async function setPrecondition_DeleteUsers_CreateUsers(request) {
    try {
        const del = await request.delete(`${testData.USERS_ENDPOINT}/`)
        await assertOk(del, 'DELETE /users/');

        for (let user of testData.users) {
            const post = await request.post(
                `${testData.USERS_ENDPOINT}/`,
                {data: user,}
                );
            await assertOk(post, `POST /users/ (${user.firstName} ${user.lastName})`);
        }
    } catch (e) {
        throw new Error(`[PRECONDITION] setPrecondition_DeleteUsers_CreateUsers: ${e.message}`);
    }
}