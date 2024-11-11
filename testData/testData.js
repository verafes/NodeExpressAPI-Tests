export const BASE_URL = 'http://localhost:5000';

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
    geInputPlaceholder: 'Enter first name ...',
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
        expectedTitle: 'Users App',
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
        expectedTitle: 'Search',
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
        expectedTitle: 'Edit Users',
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
        expectedTitle: 'Delete Users',
        expectedActiveClass: 'nav-link active',
        expectedAriaCurrent: 'page',
    },
]