import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { assertionMapSmoke } from './assertion-map-js-smoke.mjs';
import { launcher, localRustEnvironment, latestRun } from './coverage-test-helpers.mjs';

const roots = [];
try {
  for (const options of [
    { runner: 'node' }, { runner: 'node', commonjs: true }, { runner: 'node', typescript: true },
    { runner: 'vitest', typescript: true }, { runner: 'jest', commonjs: true }, { runner: 'playwright', typescript: true },
  ]) {
    const root = mkdtempSync(resolve(tmpdir(), 'supercov-map-js-')); roots.push(root);
    const pilot = assertionMapSmoke({ root, launcher, env: { ...process.env, ...localRustEnvironment }, ...options });
    if (options.runner === 'node' && options.typescript) {
      // Awaited operands get evidence; skipped sites remain in the inventory
      // and block a strict evidence gate.
      writeFileSync(resolve(root, pilot.testFile), `${pilot.source}test('await operand', async () => { assert.equal(await Promise.resolve(3), 3); });\ntest.skip('skipped', () => { assert.equal(value(0), 0); });\n`);
      pilot.ok('--', process.execPath, '--test', pilot.testFile);
      const run = latestRun(root);
      const q = (...args) => JSON.parse(pilot.ok('runs', run, 'assertions', ...args, '--json').stdout).data;
      const inherited = q();
      assert.equal(inherited.inheritance.from, pilot.run);
      assert.equal(q().summary.unobservedAssertions, 1);
      assert.equal(q().summary.assertions, 5);
      assert(q().summary.staleFlows > 0, 'changed test setup invalidates watched flows');
      assert.equal(pilot.invoke('runs', run, 'assertions', 'check', '--require-observed').status, 2);
      const carried = JSON.parse(readFileSync(inherited.map, 'utf8'));
      assert.equal(carried.assertions[0].id, pilot.map.assertions[0].id);
    }
  }
} finally {
  for (const root of roots) {
    if (process.env.SUPERCOV_KEEP_FIXTURE === '1') console.error(`retained ${root}`);
    else rmSync(root, { recursive: true, force: true, maxRetries: 10, retryDelay: 20 });
  }
}
