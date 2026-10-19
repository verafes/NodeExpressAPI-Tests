# NodeExpressApiTests

A Playwright‑based automated testing framework for validating the functionality, UI behavior, and API integration of a custom Node + Express Users App.

Related Project: **[Node Express Users App](https://github.com/verafes/NodeExpressAPI.git)**
 (tested by this suite): 

## Overview

This repository contains automated tests covering both **UI** and **API** layers of the Users App.  
The suite ensures that all CRUD operations behave consistently and that the UI reflects backend changes correctly.

## Features

- **End‑to‑end tests** for:
  - Add User
  - Search User
  - Edit User
  - Delete User
  
- **UI validation**:
  - Navigation tabs
  - Form fields and placeholders
  - Table structure
  - Icons and hover states
  
- **API validation**:
  - GET /users
  - POST /users
  - PATCH /users/:id
  - DELETE /users/:id

- **Precondition utilities** for DB setup/reset
- **Reusable test data modules**
- **Randomized user selection** for functional robustness
- **Environment‑based configuration** (`PORT`, `BASE_URL`)

## Tech Stack

- Playwright Test Runner
- Playwright APIRequestContext
- Node.js
- Express.js (tested application)

## Setup

1. Clone repository to your machine: ```git clone https://github.com/verafes/NodeExpressAPI-Tests.git```
2. Navigate to project root folder: ```cd NodeExpressApiTests```.
3. Install dependencies: ```npm ci```.
4. Install Playwright:  ```npx playwright install```.
5. Install Allure reporter: ```npm install -D allure-playwright```

## Running Tests

Run all tests in UI mode
```bash
npx playwright test --ui
```

Run a single test 
```bash
npx playwright test demo-todo-app.spec.js --ui
```

Generate Playwright scripts interactively
```bash
npx playwright codegen https://demo.playwright.dev/todomvc
```

## Reports

Open the latest Playwright HTML report
```bash
npx playwright show-report
```

Generate and open Allure report
```bash
npx allure generate allure-results --clean
npx allure open
```

