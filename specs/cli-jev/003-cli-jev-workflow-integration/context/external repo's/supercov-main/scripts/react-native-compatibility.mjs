import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
const repository = resolve(import.meta.dirname, '..');
const binary = resolve(
  repository,
  `target/debug/supercov${process.platform === 'win32' ? '.exe' : ''}`,
);
for (const name of ['react-native', 'react-expo']) {
  const cwd = resolve(repository, 'tests/fixtures', name);
  function run(command, args) {
    const result = spawnSync(command, args, {
      cwd,
      encoding: 'utf8',
      timeout: 180000,
      maxBuffer: 20 * 1024 * 1024,
    });
    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stdout + result.stderr);
    return result.stdout;
  }
  run('npm', ['ci', '--no-audit', '--no-fund']);
  run('npm', ['test']);
  run(binary, ['--', 'npm', 'test']);
  const summary = JSON.parse(run(binary, ['runs', 'latest', '--json'])).data;
  assert.equal(summary.tests, 4, name);
  assert.equal(summary.testOutcomes.failed, 0, name);
  assert.equal(summary.measurement.complete, true, name);
  assert.equal(summary.coverage.lines.percentage, 100, name);
  console.log(`[${name}] 4 tests; unchanged snapshot; full line evidence`);
}
