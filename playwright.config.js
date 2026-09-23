const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  testMatch: 'ui.spec.js',
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:5173', browserName: 'chromium', channel: process.env.PLAYWRIGHT_CHANNEL || undefined, screenshot: 'only-on-failure', trace: 'retain-on-failure' },
  webServer: {
    command: 'npm run demo',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 180000,
  },
});
