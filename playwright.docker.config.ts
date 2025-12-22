import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 10,
  timeout: 30000,

  reporter: [
    ['html'],
    ['list'],
    ['allure-playwright'],
    [
      'playwright-html-reporter',
      {
        testFolder: 'tests',
        title: 'OPEN CART Docker Report',
        project: 'Open Cart - Docker',
        release: '9.87.6',
        testEnvironment: 'DOCKER',
        embedAssets: true,
        embedAttachments: true,
        outputFolder: 'playwright-html-report-docker',
        minifyAssets: true,
        startServer: false,
      },
    ],
  ],

  use: {
    trace: 'on-first-retry',
    headless: true,
    screenshot: 'on',
    video: 'on',

    baseURL: 'https://naveenautomationlabs.com/opencart/index.php',

    httpCredentials: {
      username: 'admin',
      password: 'admin',
    },

    // Dynamic WebSocket endpoint (Docker / Remote execution)
    connectOptions: {
      wsEndpoint:
        process.env.PLAYWRIGHT_SERVER_URL || 'ws://localhost:3000',
    },
  },

  metadata: {
    appUsername: 'pwtest@nal.com',
    appPassword: 'test123',
  },

  projects: [
    {
      name: 'chromium-docker',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'firefox-docker',
      use: {
        ...devices['Desktop Firefox'],
      },
    },
    {
      name: 'webkit-docker',
      use: {
        ...devices['Desktop Safari'],
      },
    },
  ],
});
