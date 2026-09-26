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
const temporary = mkdtempSync(resolve(tmpdir(), 'supercov-rust-esbuild-'));
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
  symlinkSync(
    resolve(repository, 'node_modules/esbuild'),
    resolve(project, 'node_modules/esbuild'),
  );
  symlinkSync(
    resolve(repository, 'node_modules/.bin/esbuild'),
    resolve(project, 'node_modules/.bin/esbuild'),
  );
  writeFileSync(
    resolve(project, 'package.json'),
    JSON.stringify({
      name: 'supercov-rust-esbuild-fixture',
      private: true,
      type: 'module',
      scripts: {
        build: 'esbuild src/permission.js --bundle --platform=node --format=esm --outfile=dist/permission.js',
        test: 'node --test',
      },
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
      "import assert from 'node:assert/strict';",
      "import test from 'node:test';",
      "import { permission } from '../dist/permission.js';",
      'for (const [name, admin, owner, expected] of [',
      "  ['admin', true, false, 'allowed'],",
      "  ['owner', false, true, 'allowed'],",
      "  ['both', true, true, 'allowed'],",
      "  ['neither', false, false, 'denied'],",
      ']) test(name, () => assert.equal(permission(admin, owner), expected));',
      '',
    ].join('\n'),
  );

  const run = rust('__run-js-direct', {
    root: project,
    command: ['npm', 'test'],
    runId: 'rust-generic-esbuild',
    startedAt: '2026-08-25T00:00:06.000Z',
  });
  assert.equal(run.exitCode, 0, run.output);
  assert.equal(run.assertionCalls, 1);
  assert.equal(readFileSync(resolve(project, 'src/permission.js'), 'utf8'), application);
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
  console.log(
    '[rust-generic-esbuild] Rust instruments, builds, attributes, and queries an arbitrary esbuild suite',
  );
} finally {
  if (process.env.SUPERCOV_KEEP_FIXTURE === '1')
    console.error(`[rust-generic-esbuild] retained ${project}`);
  else rmSync(temporary, { recursive: true, force: true });
}
