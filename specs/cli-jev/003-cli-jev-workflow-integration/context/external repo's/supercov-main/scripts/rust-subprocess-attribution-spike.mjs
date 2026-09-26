import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {cpSync, mkdtempSync, readFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const fixture = join(root, 'spikes/rustc-backend/subprocess-fixture');
const supercov = join(root, `target/debug/supercov${process.platform === 'win32' ? '.exe' : ''}`);
const companion = join(
  root,
  `spikes/rustc-backend/target/debug/supercov-rustc-backend-spike${process.platform === 'win32' ? '.exe' : ''}`,
);
const scratch = mkdtempSync(join(tmpdir(), 'supercov-rust-subprocess-'));

function run(program, commandArguments, options = {}) {
  const result = spawnSync(program, commandArguments, {
    cwd: options.cwd ?? root,
    env: {...process.env, ...options.env},
    input: options.input,
    encoding: 'utf8',
    timeout: options.timeout ?? 300_000,
    maxBuffer: 64 * 1024 * 1024,
  });
  assert.equal(result.error, undefined, result.error?.message);
  assert.equal(result.signal, null, `${program} terminated by ${result.signal}`);
  assert.equal(
    result.status,
    options.status ?? 0,
    `${program} ${commandArguments.join(' ')}\n${result.stderr}\n${result.stdout}`,
  );
  return result;
}

function sourceDigest(project) {
  const digest = createHash('sha256');
  for (const path of [
    'Cargo.toml',
    'src/lib.rs',
    'src/bin/child.rs',
    'tests/subprocess.rs',
  ]) {
    digest.update(path).update('\0').update(readFileSync(join(project, path)));
  }
  return digest.digest('hex');
}

function sourceLine(project, path, needle) {
  const lines = readFileSync(join(project, path), 'utf8').split('\n');
  const index = lines.findIndex((line) => line.includes(needle));
  assert.notEqual(index, -1, `missing ${needle} in ${path}`);
  return index + 1;
}

function query(project, runId, selector) {
  return JSON.parse(
    run(supercov, ['__query-stored-run'], {
      input: JSON.stringify({
        root: project,
        query: {
          runId,
          filter: 'all',
          command: 'test',
          selector,
          limit: 100,
        },
      }),
    }).stdout,
  );
}

function detailsFor(project, runId, selector) {
  const result = query(project, runId, selector);
  assert.equal(result.ok, true);
  assert.equal(result.data.tests.length, 1, `ambiguous test selector ${selector}`);
  return result.data.tests[0];
}

function processExists(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    assert.equal(error.code, 'ESRCH');
    return false;
  }
}

try {
  const project = join(scratch, 'fixture');
  cpSync(fixture, project, {recursive: true});
  const cargo = run('rustup', ['which', 'cargo']).stdout.trim();
  const rustc = run('rustup', ['which', 'rustc']).stdout.trim();
  const sourceBefore = sourceDigest(project);
  const latePidFile = join(scratch, 'late-child.pid');

  const command = [
    cargo,
    'test',
    '--test',
    'subprocess',
    '--',
    '--test-threads=3',
  ];
  const baseline = run(command[0], command.slice(1), {
    cwd: project,
    env: {CARGO_TARGET_DIR: join(scratch, 'baseline-target')},
  });
  assert.match(baseline.stdout + baseline.stderr, /12 passed/u);

  const covered = JSON.parse(
    run(supercov, ['__run-rust-compiler'], {
      cwd: project,
      env: {
        RUSTC: rustc,
        SUPERCOV_LATE_PID_FILE: latePidFile,
      },
      input: JSON.stringify({
        root: project,
        command,
        runId: 'run_8123456789abcdef',
        startedAt: '2026-08-28T00:00:00.000Z',
        wrapperPath: supercov,
        companionCandidates: [companion],
        requirePublicCapabilities: false,
      }),
    }).stdout,
  );
  assert.equal(covered.exitCode, 0);
  assert.equal(covered.tests, 12);
  assert.equal(covered.libtests, 12);
  assert.equal(covered.doctests, 0);
  assert.equal(covered.backgroundResults, 1);
  assert.equal(covered.transportHealth.length, 13);
  assert(
    covered.transportHealth.every(
      ({status, transport}) =>
        status === 'passed' &&
        transport.dropped === 0 &&
        transport.incomplete === 0,
    ),
  );
  assert.equal(sourceDigest(project), sourceBefore);

  const childSource = 'src/lib.rs';
  const inheritedLine = sourceLine(
    project,
    childSource,
    'pub fn inherited_child_probe',
  );
  const backgroundLine = sourceLine(
    project,
    childSource,
    'pub fn background_child_probe',
  );
  const lateLine = sourceLine(project, childSource, 'pub fn late_child_probe');

  const inherited = detailsFor(
    project,
    covered.runId,
    'inherited_subprocess_is_attributed',
  );
  assert(
    inherited.hitDetails.some(
      ({file, line}) => file === childSource && line === inheritedLine,
    ),
    'inherited child evidence was not attributed to its parent test',
  );

  const contextless = detailsFor(
    project,
    covered.runId,
    'contextless_subprocess_is_background',
  );
  assert(
    !contextless.hitDetails.some(
      ({file, line}) => file === childSource && line === backgroundLine,
    ),
    'context-zero child evidence was falsely attributed to its parent test',
  );
  const background = detailsFor(
    project,
    covered.runId,
    'background:rust-runner:',
  );
  assert.equal(background.role, 'background');
  assert(
    background.hitDetails.some(
      ({file, line}) => file === childSource && line === backgroundLine,
    ),
    'context-zero child evidence was not retained as background',
  );

  const exactPropagationCases = [
    ['forked_worker_is_attributed', 'pub fn forked_worker_probe'],
    ['fork_exec_child_is_attributed', 'pub fn exec_child_probe'],
    ['pre_exec_child_is_attributed', 'pub fn pre_exec_child_probe'],
    ['spawnp_child_is_attributed', 'pub fn spawnp_child_probe'],
    ['failed_launch_keeps_exact_context', 'pub fn launch_failure_probe'],
    ['nested_thread_is_attributed', 'pub fn nested_thread_probe'],
    ['thread_creation_failure_preserves_exact_context', 'pub fn thread_failure_probe'],
    ['thread_creation_failure_preserves_exact_context', 'pub fn thread_recovery_probe'],
  ];
  for (const [test, needle] of exactPropagationCases) {
    const probeLine = sourceLine(project, childSource, needle);
    const details = detailsFor(project, covered.runId, test);
    assert(
      details.hitDetails.some(
        ({file, line}) => file === childSource && line === probeLine,
      ),
      `${test} evidence was not attributed to its exact parent test`,
    );
    assert(
      !background.hitDetails.some(
        ({file, line}) => file === childSource && line === probeLine,
      ),
      `${test} evidence leaked into background`,
    );
  }

  // A lazily created shared pool worker outlives both tests that use it, so
  // its evidence is deterministic background with an explicit limitation:
  // never attributed to the creating test nor to the second user.
  const poolLine = sourceLine(project, childSource, 'pub fn pool_worker_probe');
  for (const poolTest of [
    'pool_first_use_stays_background',
    'pool_second_use_stays_background',
  ]) {
    const details = detailsFor(project, covered.runId, poolTest);
    assert.equal(details.outcome, 'passed');
    assert(
      !details.hitDetails.some(
        ({file, line}) => file === childSource && line === poolLine,
      ),
      `${poolTest} was falsely credited with shared pool-thread work`,
    );
  }
  assert(
    background.hitDetails.some(
      ({file, line}) => file === childSource && line === poolLine,
    ),
    'shared pool-thread evidence was not retained as background',
  );
  const threadScopeLimitations = covered.transportHealth.flatMap(
    (record) => record.threadScopeLimitations ?? [],
  );
  assert(
    threadScopeLimitations.some((limitation) =>
      limitation.startsWith('RUST_THREAD_OUTLIVED_TEST: thread phase '),
    ),
    `the run did not surface the RUST_THREAD_OUTLIVED_TEST limitation: ${JSON.stringify(covered.transportHealth)}`,
  );

  const late = detailsFor(
    project,
    covered.runId,
    'late_subprocess_is_contained',
  );
  assert(
    !late.hitDetails.some(
      ({file, line}) => file === childSource && line === lateLine,
    ),
    'late child committed evidence after the parent test completed',
  );
  const latePid = Number.parseInt(readFileSync(latePidFile, 'utf8').trim(), 10);
  assert(Number.isSafeInteger(latePid) && latePid > 1);
  assert.equal(processExists(latePid), false, 'late child escaped its test process group');

  console.log(
    '[rust-subprocess-attribution-spike] libtest thread count is preserved; inherited, forked, fork+execve, pre_exec, posix_spawnp, failed-launch and nested-thread work is exact; context-zero children remain background, shared pool-thread work is join-bounded background with an explicit limitation, and late children are contained',
  );
} finally {
  if (process.env.SUPERCOV_RUST_SPIKE_KEEP_SCRATCH === '1') {
    process.stderr.write(`[rust-subprocess-attribution-spike] retained scratch: ${scratch}\n`);
  } else {
    rmSync(scratch, {recursive: true, force: true});
  }
}
