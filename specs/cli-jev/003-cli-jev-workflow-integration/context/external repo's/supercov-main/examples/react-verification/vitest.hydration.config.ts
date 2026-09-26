import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
const executablePath =
  process.env.SUPERCOV_TEST_CHROME ??
  (process.platform === 'darwin'
    ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    : undefined);
const test = {
  include: ['compat/*.test.tsx'],
  setupFiles: ['./tests/setup.ts'],
};
export default defineConfig({
  test: {
    projects: [
      { test: { ...test, name: 'ssr-jsdom', environment: 'jsdom' } },
      {
        test: {
          ...test,
          name: 'hydration-chromium',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({ launchOptions: { executablePath } }),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
