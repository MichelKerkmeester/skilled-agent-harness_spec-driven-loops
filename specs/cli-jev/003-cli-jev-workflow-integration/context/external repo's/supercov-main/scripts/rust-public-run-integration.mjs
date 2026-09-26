import assert from 'node:assert/strict';
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { once } from 'node:events';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { spawn, spawnSync } from 'node:child_process';

const repository = resolve(import.meta.dirname, '..');
const binary = resolve(repository, `target/debug/supercov${process.platform === 'win32' ? '.exe' : ''}`);
const launcher = resolve(repository, 'bin/supercov.js');
const fixture = resolve(repository, 'tests/fixtures/generic-node');
const temporary = mkdtempSync(resolve(tmpdir(), 'supercov-rust-public-run-'));
const project = resolve(temporary, 'project');

function run(arguments_) {
  return spawnSync(process.execPath, [launcher, ...arguments_], {
    cwd: project,
    encoding: 'utf8',
    env: {
      ...process.env,
      SUPERCOV_RUST_BINARY: binary,
    },
  });
}

function publishedRuns() {
  const root = resolve(project, '.supercov/runs');
  return readdirSync(root).sort((left, right) => {
    const leftRun = JSON.parse(readFileSync(resolve(root, left, 'run.json'), 'utf8'));
    const rightRun = JSON.parse(readFileSync(resolve(root, right, 'run.json'), 'utf8'));
    return leftRun.startedAt.localeCompare(rightRun.startedAt) || left.localeCompare(right);
  });
}

try {
  mkdirSync(project);
  cpSync(resolve(fixture, 'package.json'), resolve(project, 'package.json'));
  cpSync(resolve(fixture, 'src'), resolve(project, 'src'), { recursive: true });
  cpSync(resolve(fixture, 'tests'), resolve(project, 'tests'), { recursive: true });
  mkdirSync(resolve(project, 'node_modules'));
  symlinkSync(resolve(repository, 'node_modules/expect'), resolve(project, 'node_modules/expect'));
  const permissionSource = resolve(project, 'src/permission.mjs');
  const authoredPermissionSource = `${readFileSync(permissionSource, 'utf8')}\nexport function choose(value = 'fallback') {\n  return value;\n}\n\nif (false) {\n  throw new Error('syntactically unreachable fixture');\n}\n`;
  writeFileSync(permissionSource, authoredPermissionSource);
  const permissionTest = resolve(project, 'tests/permission.test.mjs');
  writeFileSync(
    permissionTest,
    readFileSync(permissionTest, 'utf8')
      .replace('{ permission }', '{ permission, choose }')
      .replace(
        'assert.equal(permission(true, false), "allowed");',
        'assert.equal(permission(true, false), "allowed");\n  assert.equal(choose(), "fallback");\n  assert.equal(choose("explicit"), "explicit");',
      ),
  );
  const chooseLine = authoredPermissionSource
    .slice(0, authoredPermissionSource.indexOf('export function choose'))
    .split('\n').length;

  const missing = run(['--']);
  assert.equal(missing.status, 2);
  assert.equal(missing.stderr, 'Usage: supercov -- <test command>\n');
  const help = run(['--help']);
  assert.equal(help.status, 0, help.stderr);
  assert.match(help.stdout, /Measure your full test command/u);
  assert.match(help.stdout, /npx supercov -- npm test/u);
  const agentGuide = run(['docs', 'agent-loop']);
  assert.equal(agentGuide.status, 0, agentGuide.stderr);
  assert.match(agentGuide.stdout, /# Agent workflow/u);

  const successful = run(['--', process.execPath, '--test', '--test-concurrency=2']);
  assert.equal(successful.status, 0, successful.stderr || successful.stdout);
  assert.match(successful.stdout, /tests 4/);
  assert.match(
    successful.stdout,
    /\[coverage\] evidence: .*\/\.supercov\/runs\/run_[a-f0-9]{16}\/evidence\.raw\.gz/,
  );
  assert.match(successful.stderr, /\[supercov\] instrumenting isolated workspace /);
  assert.match(successful.stderr, /\[supercov\] attributed \d+ native node:assert call\(s\)/);
  assert.match(successful.stderr, /\[supercov\] running in isolated workspace: .* --test/);
  // Command outputs sync back to the project now; the run must not point
  // users into the workspace cache.
  assert.doesNotMatch(
    successful.stderr,
    /outputs created by the wrapped command remain under/,
  );
  assert.match(
    successful.stderr,
    /\[supercov\] timings initialization=\d+(?:\.\d)?ms workspace=\d+(?:\.\d)?ms setup=\d+(?:\.\d)?ms build=\d+(?:\.\d)?ms tests=\d+(?:\.\d)?ms evidence=\d+(?:\.\d)?ms publication=\d+(?:\.\d)?ms total=\d+(?:\.\d)?ms/,
  );
  const [successfulId] = publishedRuns();
  assert.match(successfulId, /^run_[a-f0-9]{16}$/);
  const successfulMetadata = JSON.parse(
    readFileSync(resolve(project, '.supercov/runs', successfulId, 'run.json'), 'utf8'),
  );
  assert.equal(successfulMetadata.id, successfulId);
  assert.equal(successfulMetadata.testExitCode, 0);
  const successfulSummary = run(['runs', successfulId]);
  assert.equal(successfulSummary.status, 0, successfulSummary.stderr);
  assert.match(successfulSummary.stdout, /command: .* --test --test-concurrency=2/u);
  assert.match(successfulSummary.stdout, /By test kind\n  unit/u);
  assert.match(
    successfulSummary.stdout,
    /Complete for the measured command and coverage model/u,
  );
  assert.match(successfulSummary.stdout, /does not prove every project test suite was run/u);
  const filesView = run(['runs', successfulId, 'files']);
  const gapsView = run(['runs', successfulId, 'gaps']);
  assert.match(filesView.stdout, /Coverage files — every included source file/u);
  assert.match(gapsView.stdout, /Coverage gaps — only files with unresolved obligations/u);
  const coveredBranchLine = run([
    'runs',
    successfulId,
    'line',
    `src/permission.mjs:${chooseLine}`,
  ]);
  assert.match(coveredBranchLine.stdout, /Status\n  COVERED/u);
  assert.match(coveredBranchLine.stdout, /Branch at column \d+ — covered/u);
  assert.doesNotMatch(coveredBranchLine.stdout, /Covering tests\n  None/u);

  writeFileSync(
    resolve(project, 'tests/failure.test.mjs'),
    [
      "import test from 'node:test';",
      "import assert from 'node:assert/strict';",
      "test('intentional failure', () => assert.equal(1, 2));",
      '',
    ].join('\n'),
  );
  const failed = run(['--', process.execPath, '--test', '--test-concurrency=2']);
  assert.equal(failed.status, 1, failed.stderr || failed.stdout);
  assert.match(failed.stdout, /fail 1/);
  assert.match(failed.stdout, /\[coverage\] evidence: /);
  assert.match(failed.stderr, /\[supercov\] timings /);
  const runs = publishedRuns();
  assert.equal(runs.length, 2);
  const failedId = runs.at(-1);
  const failedMetadata = JSON.parse(
    readFileSync(resolve(project, '.supercov/runs', failedId, 'run.json'), 'utf8'),
  );
  assert.equal(failedMetadata.testExitCode, 1);
  const failedSummary = run(['runs', failedId]);
  assert.equal(failedSummary.status, 0, failedSummary.stderr);
  assert.match(
    failedSummary.stdout,
    /status: wrapped command exited 1 — coverage below is diagnostic and cannot gate/u,
  );
  assert.match(
    failedSummary.stdout,
    /Coverage \(diagnostic — the wrapped command did not pass\)/u,
  );
  const failedProjection = run(['runs', failedId, '--filter', 'failed']);
  assert.match(
    failedProjection.stdout,
    new RegExp(`npx supercov runs '${failedId}' files --filter failed`, 'u'),
  );
  assert.equal(
    readFileSync(resolve(project, 'src/permission.mjs'), 'utf8'),
    authoredPermissionSource,
  );
  assert.deepEqual(readdirSync(resolve(project, '.supercov/work')), []);

  rmSync(resolve(project, 'tests/failure.test.mjs'));
  writeFileSync(
    resolve(project, 'tests/interrupted.test.mjs'),
    [
      "import test from 'node:test';",
      "import assert from 'node:assert/strict';",
      "import { permission } from '../src/permission.mjs';",
      "test('long-running test', async () => {",
      "  assert.equal(permission(true, false), 'allowed');",
      '  await new Promise(resolve => setTimeout(resolve, 30_000));',
      '});',
      '',
    ].join('\n'),
  );
  const interrupted = spawn(
    process.execPath,
    [launcher, '--', process.execPath, '--test', '--test-concurrency=2'],
    {
      cwd: project,
      env: {
        ...process.env,
        SUPERCOV_RUST_BINARY: binary,
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );
  let interruptedStdout = '';
  let interruptedStderr = '';
  interrupted.stdout.setEncoding('utf8');
  interrupted.stderr.setEncoding('utf8');
  interrupted.stdout.on('data', chunk => {
    interruptedStdout += chunk;
  });
  const running = new Promise(resolveRunning => {
    interrupted.stderr.on('data', chunk => {
      interruptedStderr += chunk;
      if (interruptedStderr.includes('[supercov] running in isolated workspace:'))
        resolveRunning();
    });
  });
  let readinessTimer;
  await Promise.race([
    running,
    new Promise((_, reject) => {
      readinessTimer = setTimeout(
        () => reject(new Error(`interrupted run never started:\n${interruptedStderr}`)),
        5_000,
      );
    }),
  ]);
  clearTimeout(readinessTimer);
  interrupted.kill('SIGINT');
  const [interruptedCode, interruptedSignal] = await once(interrupted, 'exit');
  assert.equal(interruptedCode, 130);
  assert.equal(interruptedSignal, null);
  assert.doesNotMatch(interruptedStdout, /\[coverage\] evidence:/);
  assert.match(interruptedStderr, /\[supercov\] timings /);
  assert.equal(publishedRuns().length, 2);
  assert.equal(
    readdirSync(resolve(project, '.supercov/locks')).includes('active.json'),
    false,
  );
  const interruptedWork = readdirSync(resolve(project, '.supercov/work'));
  assert.equal(interruptedWork.length, 1);
  const interruptedState = JSON.parse(
    readFileSync(
      resolve(project, '.supercov/work', interruptedWork[0], 'state.json'),
      'utf8',
    ),
  );
  assert.equal(interruptedState.status, 'interrupted');
  assert.equal(interruptedState.signal, 'SIGINT');
  assert.equal(
    readFileSync(resolve(project, 'src/permission.mjs'), 'utf8'),
    authoredPermissionSource,
  );

  console.log(
    '[rust-public-run] public Rust wrapping preserves success/failure/signal exits, durable evidence, source isolation, cleanup, progress, and timing UX',
  );
} finally {
  rmSync(temporary, {
    recursive: true,
    force: true,
    maxRetries: 10,
    retryDelay: 20,
  });
}
