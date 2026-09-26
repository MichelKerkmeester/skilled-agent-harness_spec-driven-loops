// A Jest suite under the Rust frontend: exact per-test identity through the
// substituted configuration (jest.config.mjs reads the user's own and adds the
// adapter and reporter), outcomes from the reporter, assertion phases for
// Jest's global `expect`, and the user's own setup file still running. Jest
// is installed into the temporary project from the registry; the repository
// does not depend on it.
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const repository = resolve(import.meta.dirname, '..');
const binary = resolve(repository, `target/debug/supercov${process.platform === 'win32' ? '.exe' : ''}`);
const temporary = mkdtempSync(resolve(tmpdir(), 'supercov-rust-jest-'));
const project = resolve(temporary, 'project');
const windows = process.platform === 'win32';

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

function query(runId, filter, command, extra = {}) {
  return rust('__query-stored-run', { root: project, query: { runId, filter, command, ...extra } });
}

try {
  mkdirSync(resolve(project, 'src'), { recursive: true });
  mkdirSync(resolve(project, 'tests'), { recursive: true });
  writeFileSync(
    resolve(project, 'package.json'),
    JSON.stringify({
      name: 'supercov-rust-jest-fixture',
      private: true,
      scripts: { test: 'jest' },
    }) + '\n',
  );
  // The user's own configuration and setup file must keep working: the setup
  // file defines a global the tests read.
  writeFileSync(
    resolve(project, 'jest.config.js'),
    "module.exports = { testEnvironment: 'node', setupFilesAfterEnv: ['<rootDir>/tests/setup.js'] };\n",
  );
  writeFileSync(resolve(project, 'tests/setup.js'), "globalThis.__fixtureSetupRan = true;\n");
  const application = [
    'function permission(admin, owner) {',
    '  if (admin || owner) {',
    "    return 'allowed';",
    '  }',
    "  return 'denied';",
    '}',
    '',
    'function never() {',
    "  return 'unreached';",
    '}',
    '',
    'module.exports = { permission, never };',
    '',
  ].join('\n');
  writeFileSync(resolve(project, 'src/permission.js'), application);
  writeFileSync(
    resolve(project, 'tests/permission.test.js'),
    [
      "const { permission } = require('../src/permission');",
      '',
      // Also touches the application: an assertion over nothing instrumented
      // is flagged by the report as evidence that may be missing.
      "test('setup file ran', () => expect(globalThis.__fixtureSetupRan && permission(true, true)).toBe('allowed'));",
      "test('admin', () => expect(permission(true, false)).toBe('allowed'));",
      "test('owner', () => expect(permission(false, true)).toBe('allowed'));",
      "test('neither', () => expect(permission(false, false)).toBe('denied'));",
      "test.each([[true, 'allowed'], [false, 'denied']])('param %s', (admin, expected) => {",
      '  expect(permission(admin, false)).toBe(expected);',
      '});',
      "test('wrong', () => expect(permission(false, false)).toBe('allowed'));",
      '',
    ].join('\n'),
  );
  // `jest.retryTimes` re-runs the test with its hooks; Jest reports one
  // result after the last attempt, so the reporter records the earlier
  // attempts as the failures they were.
  writeFileSync(
    resolve(project, 'tests/flaky.test.js'),
    [
      "const { permission } = require('../src/permission');",
      '',
      'jest.retryTimes(1);',
      '',
      'let attempts = 0;',
      "test('flaky', () => {",
      '  attempts += 1;',
      "  if (attempts === 1) throw new Error('first attempt fails');",
      "  expect(permission(true, false)).toBe('allowed');",
      '});',
      '',
    ].join('\n'),
  );
  const install = spawnSync(windows ? 'npm.cmd' : 'npm', ['install', '--no-audit', '--no-fund', '--silent', 'jest@29', 'babel-jest@29', 'jest-environment-jsdom@29', '@babel/core@7', '@babel/plugin-transform-modules-commonjs@7'], {
    cwd: project,
    encoding: 'utf8',
    shell: windows,
  });
  assert.equal(install.status, 0, `installing jest: ${install.stdout}\n${install.stderr}`);

  const run = rust('__run-js-direct', {
    root: project,
    command: ['npm', 'test'],
    runId: 'rust-direct-jest',
    startedAt: '2026-09-08T00:00:02.000Z',
  });
  assert.equal(run.exitCode, 1, `the failing test fails the command\n${run.output}`);
  assert.equal(readFileSync(resolve(project, 'src/permission.js'), 'utf8'), application);

  const all = query(run.runId, 'all', 'summary');
  // `valid` is the test command exiting 0; the failing test rules that out.
  assert.equal(all.data.valid, false);
  assert.deepEqual(all.data.diagnostics, [], 'every test with assertion phases also carries evidence');
  assert.equal(
    all.data.tests,
    8,
    `eight tests, two of them parameterized and one flaky: ${JSON.stringify({ outcomes: all.data.testOutcomes, diagnostics: all.data.diagnostics, measurement: all.data.measurement, stale: all.data.staleReasons })}`,
  );
  assert.equal(all.data.testOutcomes.passed, 6, JSON.stringify(all.data.testOutcomes));
  assert.equal(all.data.testOutcomes.failed, 1, JSON.stringify(all.data.testOutcomes));
  assert.equal(all.data.testOutcomes.flaky, 1, `a retried test that then passed is flaky: ${JSON.stringify(all.data.testOutcomes)}`);
  assert.deepEqual(all.data.coverageByRunner.map((entry) => entry.runner), ['jest']);
  assert.equal(all.data.measurement.complete, true, JSON.stringify(all.data.measurement));

  // The flaky test's passing attempt counts among the passed, its failing one
  // among the failed: filters recalculate from attempts.
  const passed = query(run.runId, 'passed', 'summary');
  assert.equal(passed.data.tests, 7, JSON.stringify(passed.data.testOutcomes));
  assert.equal(passed.data.confidence.lines.asserted, 0, "Only assertions.json awards assertion credit");

  const allowed = query(run.runId, 'all', 'line', { file: 'src/permission.js', line: 3, offset: 0, limit: 20 });
  const owners = JSON.stringify(allowed);
  assert.match(owners, /admin/, 'exact test identity reaches the line');
  assert.match(owners, /param true/, 'parameterized tests keep their names');
  assert.doesNotMatch(owners, /wrong/, 'the failing test never reached this line');

  const failed = query(run.runId, 'failed', 'summary');
  assert.equal(failed.data.tests, 2, JSON.stringify(failed.data.testOutcomes));

  // React and React Native presets transform ESM/TSX test imports to CJS.
  // The injected runtime import must resolve without asking Jest to require
  // an ESM file, and the user's existing aliases must remain effective.
  writeFileSync(resolve(project, 'babel.config.cjs'),
    "module.exports = { plugins: ['@babel/plugin-transform-modules-commonjs'] };\n");
  writeFileSync(resolve(project, 'jest.config.js'),
    "module.exports = { testEnvironment: 'jsdom', setupFiles: ['<rootDir>/tests/early.js'], testMatch: ['**/transformed.test.js'], moduleNameMapper: { '^@app$': '<rootDir>/src/permission.js' }, setupFilesAfterEnv: ['<rootDir>/tests/setup.js'] };\n");
  writeFileSync(resolve(project, 'tests/early.js'),
    "globalThis.__earlyPermission = require('../src/permission').permission(true, false);\n");
  writeFileSync(resolve(project, 'tests/transformed.test.js'),
    "import { permission } from '@app';\ntest('Babel imports retain runtime and aliases', () => expect([permission(true, false), globalThis.__earlyPermission, typeof document]).toEqual(['allowed', 'allowed', 'object']));\n");
  const transformed = rust('__run-js-direct', {
    root: project, command: ['npm', 'test'], runId: 'rust-babel-jest',
    startedAt: '2026-09-15T00:00:02.000Z',
  });
  assert.equal(transformed.exitCode, 0, `Babel-transformed ESM test executes under Jest\n${transformed.output}`);
  const transformedSummary = query(transformed.runId, 'all', 'summary');
  assert.equal(transformedSummary.data.testOutcomes.passed, 1);
  assert.deepEqual(transformedSummary.data.diagnostics, []);
  assert.ok(transformedSummary.data.coverage.lines.covered > 0);

  // jest-expo forwards its CLI arguments to another Jest process. The second
  // preload must not reinterpret our generated --config as the user's config.
  const proxyDirectory = resolve(project, 'tools/node_modules/.bin');
  mkdirSync(proxyDirectory, { recursive: true });
  const proxy = resolve(proxyDirectory, 'jest');
  writeFileSync(proxy,
    `const {spawnSync}=require('node:child_process');\nconst result=spawnSync(process.execPath,[${JSON.stringify(resolve(project, 'node_modules/jest/bin/jest.js'))},...process.argv.slice(2)],{stdio:'inherit'});\nprocess.exit(result.status ?? 1);\n`);
  const forwarded = rust('__run-js-direct', {
    root: project, command: ['node', proxy, '--config=jest.config.js', '--runInBand'],
    runId: 'rust-forwarded-jest', startedAt: '2026-09-15T00:00:03.000Z',
  });
  assert.equal(forwarded.exitCode, 0, `forwarded generated config does not recurse\n${forwarded.output}`);
  assert.equal(query(forwarded.runId, 'all', 'summary').data.testOutcomes.passed, 1);

  // Arbitrarily named declared setup files remain infrastructure even under src/.
  // Instrumenting this factory would violate babel-plugin-jest-hoist's scope rule.
  const manifest = JSON.parse(readFileSync(resolve(project, 'package.json'), 'utf8'));
  manifest.jest = {testEnvironment: 'jsdom', testMatch: ['**/transformed.test.js'],
    moduleNameMapper: {'^@app$': '<rootDir>/src/permission.js'},
    setupFiles: ['<rootDir>/tests/early.js'], setupFilesAfterEnv: ['<rootDir>/src/bootstrap.js']};
  writeFileSync(resolve(project, 'package.json'), JSON.stringify(manifest));
  rmSync(resolve(project, 'jest.config.js'));
  writeFileSync(resolve(project, 'src/bootstrap.js'),
    "jest.mock('node:os', () => ({hostname: () => 'mock-host'}));\n");
  writeFileSync(resolve(project, 'tests/transformed.test.js'),
    "import { permission } from '@app';\nimport {hostname} from 'node:os';\ntest('declared setup keeps hoisted mock factories', () => expect([hostname(), permission(true, false)]).toEqual(['mock-host', 'allowed']));\njest.retryTimes(1);\nlet attempt = 0;\ntest('same title', () => { expect(++attempt).toBe(2); expect(permission(true, false)).toBe('allowed'); });\ntest('same title', () => expect(permission(false, false)).toBe('denied'));\ntest.each([true, false])('same table title', allowed => expect(permission(allowed, false)).toBe(allowed ? 'allowed' : 'denied'));\n");
  const setupRun = rust('__run-js-direct', {root:project, command:['npm','test'],
    runId:'rust-declared-setup-jest', startedAt:'2026-09-15T00:00:04.000Z'});
  assert.equal(setupRun.exitCode, 0, `declared setup retains hoisted mocks\n${setupRun.output}`);
  assert.equal(query(setupRun.runId, 'all', 'summary').data.tests, 5);
  assert.equal(query(setupRun.runId, 'all', 'summary').data.testOutcomes.passed, 4);
  assert.equal(query(setupRun.runId, 'all', 'summary').data.testOutcomes.flaky, 1);
  assert.equal(query(setupRun.runId, 'all', 'summary').data.testOutcomes.unknown, 0);

  // ms runs its suite twice, in Node's environment and the edge runtime's.
  // Each Jest process numbers a test's attempts from 0, so the second run's
  // assertion phases repeated the first's and the run could not be opened.
  manifest.scripts = { test: 'jest && jest --testEnvironment node' };
  writeFileSync(resolve(project, 'package.json'), JSON.stringify(manifest));
  const twice = rust('__run-js-direct', {root:project, command:['npm','test'],
    runId:'rust-twice-jest', startedAt:'2026-09-26T00:00:05.000Z'});
  assert.equal(twice.exitCode, 0, `the suite passes both times\n${twice.output}`);
  const twiceSummary = query(twice.runId, 'all', 'summary');
  assert.equal(twiceSummary.data.tests, 5, 'the same five tests, run twice');
  assert.equal(twiceSummary.data.testOutcomes.passed, 4, JSON.stringify(twiceSummary.data.testOutcomes));
  assert.equal(twiceSummary.data.testOutcomes.flaky, 1, JSON.stringify(twiceSummary.data.testOutcomes));

  console.log('[rust-direct-jest] a Jest suite has exact per-test identity, reporter outcomes, its own setup file and assertion phases for the global expect');
} finally {
  rmSync(temporary, { recursive: true, force: true, maxRetries: 10, retryDelay: 20 });
}
