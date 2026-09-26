import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
const repository = resolve(import.meta.dirname, '..');
const cwd = resolve(repository, 'examples/react-verification');
const binary = resolve(
  repository,
  `target/debug/supercov${process.platform === 'win32' ? '.exe' : ''}`,
);
function run(command, args) {
  const r = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    timeout: 120000,
    maxBuffer: 10 * 1024 * 1024,
  });
  assert.ifError(r.error);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  return r.stdout;
}
const args = ['test', '--', '--config', 'vitest.hydration.config.ts'];
run('npm', args);
run(binary, ['--', 'npm', ...args]);
const summary = JSON.parse(run(binary, ['runs', 'latest', '--json'])).data;
assert.equal(summary.tests, 4);
assert.equal(summary.testOutcomes.passed, 4);
assert.equal(summary.testOutcomes.unknown, 0);
assert.equal(summary.measurement.complete, true);
console.log(
  '[react-hydration] matching DOM, first interaction and mismatch recovery pass in jsdom and Chromium',
);
