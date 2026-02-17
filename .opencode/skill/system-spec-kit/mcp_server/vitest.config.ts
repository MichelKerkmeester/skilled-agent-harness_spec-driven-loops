// ---------------------------------------------------------------
// CONFIG: VITEST
// ---------------------------------------------------------------

import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    include: ['tests/**/*.vitest.ts'],
    globals: true,
    environment: 'node',
    alias: {
      '@lib': path.resolve(__dirname, 'lib'),
    },
  },
});
