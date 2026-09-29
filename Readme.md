# OrangeHRM - QA Automation Framework (Playwright + JavaScript)

Scalable end-to-end automation for Employee Lifecycle Management on https://opensource-demo.orangehrmlive.com/

## Features
- Playwright Test with JavaScript
- Page Object Model (POM) for maintainability
- Data-driven testing from JSON
- API validation via ReqRes (simulated OrangeHRM API)
- HTML report + video recording on failure
- Clean folder structure, reusable utilities

## Framework Structure
```
orangehrm-automation/
├── src/
│   ├── pages/
│   │   ├── LoginPage.js
│   │   ├── DashboardPage.js
│   │   ├── PIMPage.js
│   │   ├── AddEmployeePage.js
│   │   └── PersonalDetailsPage.js
│   └── utils/
│       ├── apiHelper.js
│       ├── dataGenerator.js
│       └── fileHelper.js
├── test-data/
│   ├── employees.json
│   └── assets/profile.jpg
├── tests/
│   └── employeeLifecycle.spec.js
├── playwright.config.js
├── package.json
└── README.md
```

## Test Scenario Covered
1. **Login** - Admin / admin123, verify dashboard
2. **Add New Employee** - PIM > Add Employee, data from JSON, upload profile picture
3. **Edit Employee** - Update Job Title & Employment Status
4. **Validate via API** - Create/Update/Get/Delete on ReqRes, cross-check UI vs API
5. **Delete Employee** - Delete from UI, verify via UI and API
6. **Logout** - Confirm logout and session invalidation

## Setup Instructions

### Prerequisites
- Node.js >= 18
- npm

### Installation
```bash
npm install
npx playwright install
```

### How to Run
```bash
# Run all tests headless
npm test

# Run headed
npm run test:headed

# View HTML report
npm run report
```

Test report will be generated at `playwright-report/index.html`
Videos and traces on failure under `test-results/`

## Dependencies
- @playwright/test ^1.44.0
- dotenv for env handling

## Best Practices Implemented
- Page Object Model with locators using getByRole / getByPlaceholder
- Descriptive assertions with meaningful messages
- Single worker for OrangeHRM demo stability (can be parallelized for other apps)
- Reusable API helper with status validation
- Unique Employee ID generator to avoid collisions
- Clean coding: naming conventions, reusable methods, clear folder separation

## Deliverables for Submission
- Source code in this repo
- playwright-report/
- test-results/ (contains videos)
- README.md

## Notes
- OrangeHRM demo site resets periodically, hence unique ID generation is used.
- API validation is simulated using ReqRes.in as per assessment guidelines.
- If OrangeHRM API becomes available, replace baseURL in apiHelper.js.
