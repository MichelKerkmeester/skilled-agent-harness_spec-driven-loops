// ───────────────────────────────────────────────────────────────────
// MODULE: Stress Playbook Validator Test Discovery
// ───────────────────────────────────────────────────────────────────

import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const { parseVitestList } = require('../stress/cli-adapter/validate-playbook-package.cjs') as {
  parseVitestList: (stdout: string) => Array<{ file: string; testName: string; fullName: string }>;
};

describe('validate-playbook-package vitest list parsing', () => {
  it('reads plain test lines under the stress directory', () => {
    const tests = parseVitestList('tests/stress/cli-adapter/cli-codex.vitest.ts > codex > runs a cell\n');
    expect(tests).toEqual([{
      file: 'tests/stress/cli-adapter/cli-codex.vitest.ts',
      testName: 'runs a cell',
      fullName: 'tests/stress/cli-adapter/cli-codex.vitest.ts > codex > runs a cell',
    }]);
  });

  it('reads test lines that vitest prefixes with a project name', () => {
    const stdout = [
      '[serial] tests/stress/cli-adapter/cli-codex.vitest.ts > codex > runs a cell',
      '[parallel] tests/unit/other.vitest.ts > other > ignored',
      '',
    ].join('\n');
    const tests = parseVitestList(stdout);
    expect(tests.map((test) => test.file)).toEqual(['tests/stress/cli-adapter/cli-codex.vitest.ts']);
    expect(tests[0]?.testName).toBe('runs a cell');
  });
});
