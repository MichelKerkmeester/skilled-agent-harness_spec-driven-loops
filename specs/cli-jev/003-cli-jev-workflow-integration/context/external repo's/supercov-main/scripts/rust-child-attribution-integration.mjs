// Most of an application's code can run in child processes: a gateway, a
// server, a CLI the test drives. Coverage from those children has to keep the
// identity of the test that caused it, through every shape a real suite uses
// to start them. A child that outlives the test that started it is the one
// case that cannot be attributed, and it says so rather than guessing.
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const repository = resolve(import.meta.dirname, '..');
const binary = resolve(repository, `target/debug/supercov${process.platform === 'win32' ? '.exe' : ''}`);
const temporary = mkdtempSync(resolve(tmpdir(), 'supercov-child-attribution-'));
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
  mkdirSync(resolve(project, 'node_modules/fake-sdk'), { recursive: true });
  writeFileSync(
    resolve(project, 'package.json'),
    JSON.stringify({
      name: 'supercov-child-attribution-fixture',
      private: true,
      type: 'module',
      scripts: { test: 'node --test --test-concurrency=1', start: 'node src/cli.js' },
    }) + '\n',
  );
  // Application code that only ever executes inside a child process.
  writeFileSync(
    resolve(project, 'src/gateway.js'),
    [
      'export function route(kind) {',
      "  if (kind === 'sse') return 'sse';",
      "  if (kind === 'stdio') return 'stdio';",
      "  if (kind === 'http') return 'http';",
      "  if (kind === 'awaited') return 'awaited';",
      "  if (kind === 'detached') return 'detached';",
      "  if (kind === 'orphaned') return 'orphaned';",
      "  return 'unknown';",
      '}',
      '',
    ].join('\n'),
  );
  writeFileSync(
    resolve(project, 'src/cli.js'),
    [
      "import { route } from './gateway.js';",
      "process.stdout.write(route(process.argv[2] ?? 'sse'));",
      '',
    ].join('\n'),
  );
  // A dependency that spawns for its caller, the way an SDK transport does.
  writeFileSync(
    resolve(project, 'node_modules/fake-sdk/package.json'),
    JSON.stringify({ name: 'fake-sdk', version: '1.0.0', type: 'module', main: 'index.js' }) + '\n',
  );
  writeFileSync(
    resolve(project, 'node_modules/fake-sdk/index.js'),
    [
      "import { spawnSync } from 'node:child_process';",
      'export function launch(argument) {',
      "  return spawnSync(process.execPath, ['src/cli.js', argument], {",
      "    encoding: 'utf8',",
      '    // Curated, the way a transport avoids leaking the parent environment.',
      '    env: { PATH: process.env.PATH, HOME: process.env.HOME },',
      '  }).stdout;',
      '}',
      '',
    ].join('\n'),
  );
  writeFileSync(
    resolve(project, 'src/server.js'),
    [
      "import { route } from './gateway.js';",
      "process.stdin.setEncoding('utf8');",
      "process.stdin.on('data', (chunk) => {",
      "  for (const line of chunk.split('\\n').filter(Boolean)) {",
      "    process.stdout.write(route(line.trim()) + '\\n');",
      '  }',
      '});',
      '',
    ].join('\n'),
  );
  writeFileSync(
    resolve(project, 'tests/gateway.test.js'),
    [
      "import assert from 'node:assert/strict';",
      "import test from 'node:test';",
      "import { spawnSync } from 'node:child_process';",
      "import { launch } from 'fake-sdk';",
      "test('spawned by the test', () => {",
      "  const out = spawnSync(process.execPath, ['src/cli.js', 'sse'], { encoding: 'utf8' }).stdout;",
      "  assert.equal(out, 'sse');",
      '});',
      "test('spawned by a dependency with a curated environment', () => {",
      "  assert.equal(launch('stdio'), 'stdio');",
      '});',
      "test('spawned behind an npm script', () => {",
      "  const result = spawnSync('npm', ['run', '--silent', 'start', '--', 'http'], { encoding: 'utf8' });",
      '  assert.match(result.stdout, /http/);',
      '});',
      '',
      '// A gateway the test starts, drives over stdio and tears down. How the',
      '// teardown happens decides when the child writes its last evidence, and',
      '// none of those moments may cost it its test.',
      "import { spawn } from 'node:child_process';",
      'function start() {',
      "  return spawn(process.execPath, ['src/server.js'], { stdio: ['pipe', 'pipe', 'inherit'] });",
      '}',
      'function ask(child, request) {',
      '  return new Promise((resolve) => {',
      "    child.stdout.once('data', (data) => resolve(String(data).trim()));",
      "    child.stdin.write(request + '\\n');",
      '  });',
      '}',
      "test('a gateway the test waits for', async () => {",
      '  const child = start();',
      "  assert.equal(await ask(child, 'awaited'), 'awaited');",
      '  child.kill();',
      "  await new Promise((resolve) => child.once('exit', resolve));",
      '});',
      "test('a gateway the test stops without waiting', async () => {",
      '  const child = start();',
      "  assert.equal(await ask(child, 'detached'), 'detached');",
      '  child.kill();',
      '});',
      "test('a gateway that exits after the test returns', async () => {",
      '  const child = start();',
      "  assert.equal(await ask(child, 'orphaned'), 'orphaned');",
      '  child.stdin.end();',
      '});',
      '',
    ].join('\n'),
  );

  const run = rust('__run-js-direct', {
    root: project,
    command: ['npm', 'test'],
    runId: 'rust-child-attribution',
    startedAt: '2026-09-04T00:00:00.000Z',
  });
  assert.equal(run.exitCode, 0, run.output);

  function query(command, extra = {}) {
    return rust('__query-stored-run', {
      root: project,
      query: { runId: run.runId, filter: 'all', command, ...extra },
    }).data;
  }

  // Nothing landed in the run's background: every child was caused by a test.
  const runners = query('runners');
  assert.deepEqual(
    runners.runners.map((entry) => entry.runner),
    ['node:test'],
    `child coverage escaped its test: ${JSON.stringify(runners.runners.map((entry) => entry.runner))}`,
  );
  assert.equal(runners.runners[0].tests, 6);

  // Each arm runs in exactly one child, so it names exactly the test that
  // started that child.
  for (const [line, name] of [
    [2, 'spawned by the test'],
    [3, 'spawned by a dependency with a curated environment'],
    [4, 'spawned behind an npm script'],
    [5, 'a gateway the test waits for'],
    [6, 'a gateway the test stops without waiting'],
    [7, 'a gateway that exits after the test returns'],
  ]) {
    const detail = query('line', { file: 'src/gateway.js', line });
    const tests = detail.tests.map((entry) => entry.name);
    assert.ok(
      tests.includes(name),
      `src/gateway.js:${line} should name ${name}, got ${JSON.stringify(tests)}`,
    );
    assert.ok(
      !tests.some((entry) => entry.toLowerCase().includes('background')),
      `src/gateway.js:${line} fell back to the run: ${JSON.stringify(tests)}`,
    );
  }
  console.log(
    '[rust-child-attribution] coverage from children keeps its test through direct, dependency, curated-environment and npm-wrapped launches, and through every gateway teardown',
  );
} finally {
  if (process.env.SUPERCOV_KEEP_FIXTURE === '1')
    console.error(`[rust-child-attribution] retained ${project}`);
  else rmSync(temporary, { recursive: true, force: true });
}
