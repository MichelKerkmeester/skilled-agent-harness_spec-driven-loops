import assert from 'node:assert/strict';
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const repository = resolve(import.meta.dirname, '..');
const binary = resolve(repository, `target/debug/supercov${process.platform === 'win32' ? '.exe' : ''}`);
const temporary = mkdtempSync(resolve(tmpdir(), 'supercov-rust-vitest-'));
const project = resolve(temporary, 'project');

function rust(command, request) {
  const result = spawnSync(binary, [command], {
    cwd: repository,
    encoding: 'utf8',
    input: JSON.stringify(request),
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const value = JSON.parse(result.stdout.trim().split('\n').at(-1));
  // What the wrapped command printed, kept off the value's own fields so that
  // comparing it or printing it as JSON is unchanged. Without it a suite that
  // failed under Supercov reported only its exit code: a flaky browser test
  // and a broken one looked the same, and telling them apart took a rerun.
  Object.defineProperty(value, 'output', { value: tail(`${result.stdout}${result.stderr}`) });
  return value;
}

// The end of what a command printed, where the failure is, bounded so an
// assertion message stays readable.
function tail(text, lines = 200) {
  return text.trimEnd().split('\n').slice(-lines).join('\n');
}

try {
  mkdirSync(resolve(project, 'src'), { recursive: true });
  mkdirSync(resolve(project, 'tests'), { recursive: true });
  mkdirSync(resolve(project, 'node_modules/.bin'), { recursive: true });
  for (const dependency of ['vite', 'vitest'])
    symlinkSync(
      resolve(repository, 'node_modules', dependency),
      resolve(project, 'node_modules', dependency),
    );
  symlinkSync(
    resolve(repository, 'node_modules/.bin/vitest'),
    resolve(project, 'node_modules/.bin/vitest'),
  );
  writeFileSync(
    resolve(project, 'package.json'),
    JSON.stringify({
      name: 'supercov-rust-vitest-fixture',
      private: true,
      type: 'module',
      scripts: { test: 'vitest run' },
    }) + '\n',
  );
  const application = [
    'export function permission(admin, owner) {',
    '  if (admin || owner) return "allowed";',
    '  return "denied";',
    '}',
    '',
  ].join('\n');
  writeFileSync(resolve(project, 'src/permission.js'), application);
  writeFileSync(
    resolve(project, 'tests/permission.test.js'),
    [
      "import { expect, test } from 'vitest';",
      "import { permission } from '../src/permission.js';",
      "test('admin', () => expect(permission(true, false)).toBe('allowed'));",
      "test('owner', () => expect(permission(false, true)).toBe('allowed'));",
      "test('both', () => expect(permission(true, true)).toBe('allowed'));",
      "test('neither', () => expect(permission(false, false)).toBe('denied'));",
      "test.fails('known failure', () => expect(permission(true, false)).toBe('denied'));",
      '',
    ].join('\n'),
  );

  const run = rust('__run-js-direct', {
    root: project,
    command: ['npm', 'test'],
    runId: 'rust-direct-vitest',
    startedAt: '2026-08-25T00:00:02.000Z',
  });
  assert.equal(run.exitCode, 0, run.output);
  assert.equal(run.assertionCalls, 5);
  assert.equal(readFileSync(resolve(project, 'src/permission.js'), 'utf8'), application);
  const summary = rust('__query-stored-run', {
    root: project,
    query: {
      runId: run.runId,
      filter: 'passed',
      command: 'summary',
    },
  });
  assert.equal(summary.data.valid, true);
  assert.equal(summary.data.complete, true);
  assert.equal(summary.data.tests, 4);
  assert.equal(summary.data.coverage.conditionCoveragePct, 100);
  assert.equal(summary.data.coverage.lines.percentage, 100);
  assert.equal(summary.data.coverage.branches.percentage, 100);
  assert.equal(summary.data.confidence.lines.asserted, 0);
  assert.equal(summary.data.confidence.assertionCoveredMcdcConditions, 0);
  assert.deepEqual(
    summary.data.coverageByRunner.map(entry => entry.runner),
    ['vitest'],
  );
  const all = rust('__query-stored-run', {
    root: project,
    query: {
      runId: run.runId,
      filter: 'all',
      command: 'summary',
    },
  });
  assert.equal(all.data.tests, 5);
  assert.equal(all.data.testOutcomes.passed, 5);
  assert.equal(all.data.testOutcomes.failed, 0);
  const failed = rust('__query-stored-run', {
    root: project,
    query: {
      runId: run.runId,
      filter: 'failed',
      command: 'summary',
    },
  });
  assert.equal(failed.data.coverage.lines.covered, 0);
  assert.equal(failed.data.coverage.branches.covered, 0);
  const failedFiles = rust('__query-stored-run', {
    root: project,
    query: {
      runId: run.runId,
      filter: 'failed',
      command: 'files',
      offset: 0,
      limit: 20,
    },
  });
  const allFiles = rust('__query-stored-run', {
    root: project,
    query: {
      runId: run.runId,
      filter: 'all',
      command: 'files',
      offset: 0,
      limit: 20,
    },
  });
  assert.equal(failedFiles.data.files[0].file, 'src/permission.js');
  assert.ok(
    failedFiles.data.files[0].uncoveredLines > allFiles.data.files[0].uncoveredLines,
    '--filter failed must recalculate file coverage from failed attempts only',
  );
  const coveredLine = rust('__query-stored-run', {
    root: project,
    query: {
      runId: run.runId,
      filter: 'all',
      command: 'line',
      file: 'src/permission.js',
      line: 2,
      offset: 0,
      limit: 20,
    },
  });
  assert.match(coveredLine.data.source, /admin \|\| owner/u);
  const test = rust('__query-stored-run', {
    root: project,
    query: {
      runId: run.runId,
      filter: 'passed',
      command: 'test',
      selector: 'admin',
    },
  });
  assert.equal(test.data.tests.length, 1);
  assert.equal(test.data.tests[0].phases.length, 1);
  assert.equal(test.data.tests[0].phases[0].operation, 'expect.toBe');
  assert.ok(test.data.tests[0].phases[0].lines > 0);
  console.log(
    '[rust-direct-vitest] Rust-owned zero-config npm test run is valid and structurally complete',
  );
} finally {
  if (process.env.SUPERCOV_KEEP_FIXTURE === '1')
    console.error(`[rust-direct-vitest] retained ${project}`);
  else rmSync(temporary, { recursive: true, force: true });
}
