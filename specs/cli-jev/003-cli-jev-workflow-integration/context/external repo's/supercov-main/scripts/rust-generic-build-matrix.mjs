import assert from 'node:assert/strict';
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const repository = resolve(import.meta.dirname, '..');
const binary = resolve(repository, `target/debug/supercov${process.platform === 'win32' ? '.exe' : ''}`);
const temporary = mkdtempSync(resolve(tmpdir(), 'supercov-rust-build-matrix-'));

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

function copyFixture(name, extraFiles) {
  const source = resolve(repository, 'tests/fixtures', name);
  const project = resolve(temporary, name);
  mkdirSync(project, { recursive: true });
  for (const entry of ['package.json', 'src', 'tests', ...extraFiles])
    cpSync(resolve(source, entry), resolve(project, entry), { recursive: true });
  mkdirSync(resolve(project, 'node_modules/.bin'), { recursive: true });
  return { project, source };
}

function linkPackage(project, name) {
  const destination = resolve(project, 'node_modules', name);
  mkdirSync(resolve(destination, '..'), { recursive: true });
  symlinkSync(resolve(repository, 'node_modules', name), destination);
}

function linkBinary(project, name) {
  symlinkSync(
    resolve(repository, 'node_modules/.bin', name),
    resolve(project, 'node_modules/.bin', name),
  );
}

function verify(name, project, sourceFile, runId) {
  const original = readFileSync(resolve(project, sourceFile), 'utf8');
  const run = rust('__run-js-direct', {
    root: project,
    command: ['npm', 'test'],
    runId,
    startedAt: `2026-08-25T00:00:${runId.endsWith('webpack') ? '08' : '09'}.000Z`,
  });
  assert.equal(run.exitCode, 0, `${name} test command failed\n${run.output}`);
  assert.equal(run.assertionCalls, 1);
  assert.equal(readFileSync(resolve(project, sourceFile), 'utf8'), original);
  assert.ok(run.metadata.timings.instrumentedBuildMs > 0);
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
    ['node:test'],
  );
}

try {
  const webpack = copyFixture('generic-webpack', ['webpack.config.cjs']);
  for (const dependency of ['webpack', 'webpack-cli'])
    linkPackage(webpack.project, dependency);
  linkBinary(webpack.project, 'webpack');
  verify(
    'webpack',
    webpack.project,
    'src/permission.js',
    'rust-generic-webpack',
  );

  const swc = copyFixture('generic-swc', ['build.mjs']);
  linkPackage(swc.project, '@swc/core');
  verify('swc', swc.project, 'src/permission.js', 'rust-generic-swc');

  console.log(
    '[rust-generic-build-matrix] webpack and SWC preserve exact Rust-owned build, attribution, and query semantics',
  );
} finally {
  if (process.env.SUPERCOV_KEEP_FIXTURE === '1')
    console.error(`[rust-generic-build-matrix] retained ${temporary}`);
  else rmSync(temporary, { recursive: true, force: true });
}
