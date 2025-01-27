# API Testing Project with Playwright

This project uses [Playwright](https://playwright.dev/) to perform automated tests on the [ServRest API](https://serverest.dev/). The goal is to ensure that the main functionalities of the API are working correctly.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/brunobzs/playwright-api-test.git
   cd playwright-api-test
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Install the necessary browsers for Playwright:
   ```bash
   npx playwright install --with-deps
   ```

## Running the Tests

To run the tests, use the following command:
```bash
npx playwright test
```
## Project Structure
```
├── .github/workflows              # Contains the GitHub Actions configuration files
│   └── playwright.yml             # Configuration for the CI pipeline to run Playwright tests.
├── tests                          # Contains the test files
│   ├── carrinho-test.spec.ts      # Authentication API Tests
│   ├── login-test.spec.ts         # Login API Tests
│   ├── produto-test.spec.ts       # Product API Tests
│   └── usuario-test.spec.ts       # User API Tests
├── playwright.config.ts           # Playwright configuration file.
├── package.json                   # Contains the project dependencies and scripts.
└── README.md                      # Project documentation
```

## CI Configuration

The project is configured to use GitHub Actions to run the tests automatically on each push or pull request to the `master` branch. The pipeline configuration is in the `.github/workflows/playwright.yml` file.

## Dependencies

- `@playwright/test`: Playwright's testing framework.
- `@faker-js/faker`: Library to generate fake data for the tests.

## Contribution

Feel free to open issues and pull requests to contribute to the project.