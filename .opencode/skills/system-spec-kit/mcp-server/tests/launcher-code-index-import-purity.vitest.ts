import { createRequire } from 'node:module';

import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const launcherPath = '../../../../bin/mk-code-index-launcher.cjs';

function restoreEnv(snapshot: NodeJS.ProcessEnv) {
  for (const key of Object.keys(process.env)) {
    if (!(key in snapshot)) {
      delete process.env[key];
    }
  }
  for (const [key, value] of Object.entries(snapshot)) {
    process.env[key] = value;
  }
}

describe('mk-code-index launcher import purity', () => {
  it('does not mutate process.env when required for helpers', () => {
    const resolvedLauncherPath = require.resolve(launcherPath);
    const envSnapshot = { ...process.env };
    const serializedEnvBeforeRequire = JSON.stringify(process.env);

    let codeIndex: {
      bridgeStdioThroughSessionProxy: unknown;
      classifyCodeIndexFrame: unknown;
    } | undefined;

    try {
      expect(() => {
        delete require.cache[resolvedLauncherPath];
        codeIndex = require(launcherPath) as {
          bridgeStdioThroughSessionProxy: unknown;
          classifyCodeIndexFrame: unknown;
        };
      }).not.toThrow();

      expect(JSON.stringify(process.env)).toBe(serializedEnvBeforeRequire);
      expect(typeof codeIndex?.bridgeStdioThroughSessionProxy).toBe('function');
      expect(typeof codeIndex?.classifyCodeIndexFrame).toBe('function');
    } finally {
      restoreEnv(envSnapshot);
    }
  });
});
