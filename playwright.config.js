// @ts-check
const { defineConfig, devices } = require('@playwright/test');

const version = process.env.APP_VERSION === 'v1' ? 'v1' : 'v2';
const puerto = 4173;
// Las corridas visuales guardan su JSON aparte para no sobrescribir los resultados funcionales.
const sufijo = process.env.SUITE === 'visual' ? '-visual' : '';

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: 0,
  timeout: 20_000,
  expect: { timeout: 3_000 },
  // Las líneas base visuales se guardan por versión de navegador/SO.
  snapshotPathTemplate: '{testDir}/__lineas-base__/{testFilePath}/{arg}-{projectName}-{platform}{ext}',
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reportes/html', open: 'never' }],
    ['json', { outputFile: `reportes/resultados-${version}${sufijo}.json` }],
  ],
  use: {
    baseURL: `http://localhost:${puerto}`,
    actionTimeout: 3_000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    locale: 'es-CR',
  },
  projects: [
    { name: 'escritorio', use: { ...devices['Desktop Chrome'] } },
    { name: 'movil', use: { ...devices['Pixel 5'] } },
  ],
  webServer: {
    command: 'node servidor.js',
    url: `http://localhost:${puerto}`,
    env: { APP_VERSION: version, PORT: String(puerto) },
    reuseExistingServer: false,
    timeout: 15_000,
  },
});
