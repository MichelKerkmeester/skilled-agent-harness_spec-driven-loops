import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    include: ['tests/**/*.vitest.ts'],
    globals: true,
    environment: 'node',
    // Resolve paths the same way the compiled tests do:
    // tests import from ../lib/ which maps to the compiled JS in dist/
    alias: {
      // Allow tests to import from lib/ (compiled JS output)
      '@lib': path.resolve(__dirname, 'lib'),
    },
  },
});
