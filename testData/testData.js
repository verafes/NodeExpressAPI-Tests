const PORT = process.env.PORT
const BASE_URL = `http://localhost:${PORT}`
export const HOME_PAGE_URL = `${BASE_URL}/`
export const BASE_API_URL=`${BASE_URL}/api`
export const USERS_END_POINT = `${BASE_API_URL}/users`;

export const expectedHeaders = {
    title: 'Users App',
    h1: 'Node Express API Server App',
    addUserH2: 'Add User',
    userListH2: 'Users List',
}

export const expectedH2 = ['Add User', 'Users List']

export const expectedFormTexts = {
    firstNameLabel: 'First Name',
    lastNameLabel: 'Last Name',
    age: 'Age',
    firstNameID: 'firstName',
    lastNameID: 'lastName',
    ageID: 'age',
    firstNameInputPlaceholder: 'Enter first name ...',
    lastNameInputPlaceholder: 'Enter first name ...',
    ageInputPlaceholder: 'Enter age ...',
    addButton: 'Add',
}

export const expectedTablesHeadList = [
    '#', 'First', 'Last', 'Age', 'ID'
]

export const usersData = [
    {
        firstName: "Joe",
        lastName: "Buffalo",
        age: 43,
    },
    {
        firstName: "Sergey",
        lastName: "Ivanov",
        age: 25,
    },
    {
        firstName: "Michael",
        lastName: "Smith",
        age: 37,
    },
]

export const navigationData = [
    {
        tabName: 'Add',
        header: 'Add User',
        buttonName: 'Add',
        expectedCount: 3,
        expectedLabels: ['First Name', 'Last Name', 'Age'],
        expectedURL: `${process.env.BASE_URL}` + '/add',
        expectedTitle: 'Users app',
        expectedActiveClass: 'nav-link active',
        expectedAriaCurrent: 'page',
    },
    {
        tabName: 'Search',
        header: 'Search User',
        buttonName: 'Search',
        expectedCount: 4,
        expectedLabels: ['User ID', 'First Name', 'Last Name', 'Age'],
        expectedURL: `${process.env.BASE_URL}` + '/search',
        expectedTitle: 'Search user',
        expectedActiveClass: 'nav-link active',
        expectedAriaCurrent: 'page',
    },
    {
        tabName: 'Edit',
        header: 'Edit User',
        buttonName: 'Edit',
        expectedCount: 4,
        expectedLabels: ['User ID', 'First Name', 'Last Name', 'Age'],
        expectedURL: `${process.env.BASE_URL}` + '/edit',
        expectedTitle: 'Edit user',
        expectedActiveClass: 'nav-link active',
        expectedAriaCurrent: 'page',
    },
    {
        tabName: 'Delete',
        header: 'Delete User',
        buttonName: 'Delete',
        expectedCount: 4,
        expectedLabels: ['User ID', 'First Name', 'Last Name', 'Age'],
        expectedURL: `${process.env.BASE_URL}` + '/delete',
        expectedTitle: 'Delete user',
        expectedActiveClass: 'nav-link active',
        expectedAriaCurrent: 'page',
    },
]