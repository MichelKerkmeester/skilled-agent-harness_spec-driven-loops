// A project may run its tests under a custom ESM loader. Loaders conventionally
// skip dependencies, and our generated runtime lives under a directory named
// node_modules, so such a loader hands our ES modules back as CommonJS: a named
// import between two of them then has nothing to bind to and every worker dies
// before a test runs. That is what `ts-node/esm` does, and this fixture
// reproduces the property without depending on it.
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const repository = resolve(import.meta.dirname, '..');
const binary = resolve(repository, `target/debug/supercov${process.platform === 'win32' ? '.exe' : ''}`);
const temporary = mkdtempSync(resolve(tmpdir(), 'supercov-host-loader-'));
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
  mkdirSync(resolve(project, 'node_modules'), { recursive: true });
  writeFileSync(
    resolve(project, 'package.json'),
    JSON.stringify({
      name: 'supercov-host-loader-fixture',
      private: true,
      type: 'module',
      scripts: { test: 'node --test --experimental-loader ./loader.mjs' },
    }) + '\n',
  );
  // The property every dependency-skipping loader shares: a `.js` file inside
  // a node_modules directory is somebody else's build output, so it is handed
  // back as CommonJS rather than parsed as an ES module. Anything that says
  // what it is by extension is left alone.
  writeFileSync(
    resolve(project, 'loader.mjs'),
    [
      'export async function load(url, context, nextLoad) {',
      "  if (url.includes('/node_modules/') && url.endsWith('.js')) {",
      "    return { format: 'commonjs', shortCircuit: true, source: null };",
      '  }',
      '  return nextLoad(url, context);',
      '}',
      '',
    ].join('\n'),
  );
  writeFileSync(
    resolve(project, 'src/permission.js'),
    [
      "import { spawnSync } from 'node:child_process';",
      'export function permission(admin) {',
      '  if (admin) return "allowed";',
      '  spawnSync(process.execPath, ["-e", ""]);',
      '  return "denied";',
      '}',
      '',
    ].join('\n'),
  );
  writeFileSync(
    resolve(project, 'tests/permission.test.js'),
    [
      "import assert from 'node:assert/strict';",
      "import test from 'node:test';",
      "import { permission } from '../src/permission.js';",
      "test('allowed', () => assert.equal(permission(true), 'allowed'));",
      "test('denied', () => assert.equal(permission(false), 'denied'));",
      '',
    ].join('\n'),
  );

  const run = rust('__run-js-direct', {
    root: project,
    command: ['npm', 'test'],
    runId: 'rust-host-loader',
    startedAt: '2026-09-04T00:00:00.000Z',
  });
  assert.equal(run.exitCode, 0, `the suite runs under a dependency-skipping loader\n${run.output}`);
  assert.equal(run.assertionCalls, 2);

  const summary = rust('__query-stored-run', {
    root: project,
    query: { runId: run.runId, filter: 'passed', command: 'summary' },
  });
  assert.equal(summary.data.valid, true);
  assert.equal(summary.data.tests, 2);
  // Coverage is real, not an empty run that merely exited zero. The loader
  // itself is a project file that no test imports, so the total is not 100.
  assert.ok(
    summary.data.coverage.lines.covered >= 4,
    `expected the measured suite to cover its source: ${JSON.stringify(summary.data.coverage.lines)}`,
  );
  console.log(
    '[rust-host-loader] the generated runtime links under a loader that treats node_modules as CommonJS',
  );
} finally {
  if (process.env.SUPERCOV_KEEP_FIXTURE === '1')
    console.error(`[rust-host-loader] retained ${project}`);
  else rmSync(temporary, { recursive: true, force: true });
}
