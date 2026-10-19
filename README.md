# NodeExpressApiTests

## Setup
1. Clone repository to your machine: ```git clone <repo-url>```
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
