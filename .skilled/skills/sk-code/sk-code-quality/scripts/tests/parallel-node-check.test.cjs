// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code-quality Parallel Syntax Check Helper Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// The helper owns the children a check starts, and the runner reads only two lines of
// what each one wrote. These cases pin the parts a scan of the code cannot: that a
// helper stopped from outside leaves no interpreter behind, that the record it keeps
// for a minified file still carries the message the finding is built from, and that one
// crashed child costs only its own record.
//
// The first case blocks a child on a FIFO that has no writer, so it is skipped where
// process groups do not exist. Every case builds its fixtures under the OS temp folder,
// so the repository is never the place a check runs.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn, spawnSync } = require('node:child_process');
const { setTimeout: delay } = require('node:timers/promises');
const test = require('node:test');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const HELPER = path.resolve(__dirname, '..', 'lib', 'parallel-node-check.cjs');
const STDERR_LIMIT = 4096;
// More source than the record may keep, so the budget is spent before the message arrives
// and a record that dropped the end of the stream would lose it. It is also more than the
// 64 KiB a macOS stdio channel takes at once under Node 22 and later, so a helper that read
// the report through a pipe loses the message under every Node, not only under Node 20.
const LONG_LINE_CHARS = 100000;
const MESSAGE = /^(?:SyntaxError|Error): (.*)$/m;
const POSIX = process.platform !== 'win32';

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function tempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'parallel-node-check-'));
}

// The helper starts every child directly, so its own child list is the list of `node
// --check` processes it is holding at this moment.
function childPids(pid) {
  const found = spawnSync('pgrep', ['-P', String(pid)], { encoding: 'utf8' });
  if (found.status !== 0) return [];
  return found.stdout.split('\n').filter(Boolean).map(Number);
}

function commandOf(pid) {
  const found = spawnSync('ps', ['-o', 'command=', '-p', String(pid)], { encoding: 'utf8' });
  return found.status === 0 ? found.stdout.trim() : '';
}

function alive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    // A process this user may not signal is still running, and only a missing one throws
    // the error this case is looking for.
    return error.code === 'EPERM';
  }
}

// A dead child is reparented and reaped a moment after its parent goes, so a zombie reads
// as alive until then and the answer is polled rather than read once.
async function waitFor(probe, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  let value = probe();
  while (!value && Date.now() < deadline) {
    await delay(25);
    value = probe();
  }
  return value;
}

function stopQuietly(pid) {
  try {
    process.kill(pid, 'SIGKILL');
  } catch {}
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. TESTS
// ─────────────────────────────────────────────────────────────────────────────

test('unit: node pool helper: a SIGTERM leaves no node --check child running', { skip: POSIX ? false : 'process groups are a POSIX feature' }, async () => {
  const dir = tempDir();
  const fifo = path.join(dir, 'blocking.js');
  const made = spawnSync('mkfifo', [fifo], { encoding: 'utf8' });
  assert.equal(made.status, 0, `mkfifo did not make a FIFO: ${made.stderr}`);
  const helper = spawn(process.execPath, [HELPER, process.execPath, '1', '60000'], { stdio: ['pipe', 'pipe', 'pipe'] });
  const started = [];
  try {
    helper.stdin.end(JSON.stringify([fifo]));
    // A read of a FIFO with no writer blocks, so the child a check started never finishes
    // and is still there to be found when the helper is told to stop.
    const found = await waitFor(() => {
      const pids = childPids(helper.pid);
      started.push(...pids.filter((pid) => !started.includes(pid)));
      return started.length > 0 ? started : null;
    }, 20000);
    assert.ok(found, 'the helper started no child to stop');
    assert.match(commandOf(started[0]), /--check .*blocking\.js/, 'the child is not the syntax check it should be');
    helper.kill('SIGTERM');
    const [code, signal] = await new Promise((resolve) => helper.on('exit', (exitCode, exitSignal) => resolve([exitCode, exitSignal])));
    assert.ok(signal === 'SIGTERM' || code === 143, `the helper left with code ${code} and signal ${signal}`);
    const gone = await waitFor(() => started.every((pid) => !alive(pid)), 10000);
    assert.ok(gone, `a node --check child outlived the helper: ${started.filter(alive).join(', ')}`);
  } finally {
    for (const pid of started) stopQuietly(pid);
    helper.kill('SIGKILL');
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('unit: node pool helper: a long one-line file keeps its message inside the record budget', () => {
  const dir = tempDir();
  try {
    const file = path.join(dir, 'long.js');
    fs.writeFileSync(file, `var a = 1;${'x'.repeat(LONG_LINE_CHARS)} function(\n`);
    // The reference report goes to a file, because a node child that exits while an async
    // stderr write is still queued loses what the parent-created channel could not take at
    // once, 8 KiB under a Node 20 parent and 64 KiB under Node 22 and later on macOS, and
    // that loss is the one the helper must not inherit.
    const errorFile = path.join(dir, 'direct.stderr');
    const fd = fs.openSync(errorFile, 'w');
    let direct;
    try {
      direct = spawnSync(process.execPath, ['--check', file], { stdio: ['ignore', 'ignore', fd] });
    } finally {
      fs.closeSync(fd);
    }
    const directStderr = fs.readFileSync(errorFile, 'utf8');
    assert.equal(direct.status, 1, 'the file was meant to fail node --check');
    const expected = MESSAGE.exec(directStderr);
    assert.ok(expected, 'the direct check reported no message');
    assert.ok(directStderr.length > STDERR_LIMIT, 'the file was meant to write past the record budget');
    const run = spawnSync(process.execPath, [HELPER, process.execPath, '1', '60000'], {
      input: JSON.stringify([file]),
      encoding: 'utf8',
      timeout: 60000,
    });
    const records = JSON.parse(run.stdout);
    assert.equal(records.length, 1);
    assert.equal(records[0].status, 1);
    assert.ok(records[0].stderr.length <= STDERR_LIMIT, `the record kept ${records[0].stderr.length} characters`);
    assert.match(records[0].stderr.split('\n')[0], /long\.js:1\s*$/, 'the record lost the line and column line');
    assert.equal(MESSAGE.exec(records[0].stderr)[1], expected[1], 'the record lost the message the finding quotes');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

// The stub stands in for node: it kills itself when it is handed the chosen file and
// otherwise runs the real `node --check`, so one crash sits in the middle of a list longer
// than the pool and every other file still gets its genuine verdict. A shebang script is
// started directly only where the system reads shebangs, so the case is POSIX only.
test('unit: node pool helper: a child killed mid-list keeps one record per file and the rest still run', { skip: POSIX ? false : 'a shebang stub needs POSIX' }, () => {
  const dir = tempDir();
  try {
    const stub = path.join(dir, 'stub-node');
    fs.writeFileSync(stub, [
      `#!${process.execPath}`,
      "const { spawnSync } = require('node:child_process');",
      'const file = process.argv[process.argv.length - 1];',
      "if (require('node:path').basename(file) === 'crash.js') process.kill(process.pid, 'SIGKILL');",
      "const run = spawnSync(process.execPath, ['--check', file], { stdio: 'inherit' });",
      'process.exit(run.status === null ? 1 : run.status);',
      '',
    ].join('\n'));
    fs.chmodSync(stub, 0o755);
    const names = ['a-clean.js', 'b-clean.js', 'c-clean.js', 'crash.js', 'd-bad.js', 'e-clean.js', 'f-clean.js'];
    const files = names.map((name) => {
      const file = path.join(dir, name);
      fs.writeFileSync(file, name === 'd-bad.js' ? 'const a = ;\n' : 'module.exports = 1;\n');
      return file;
    });
    const run = spawnSync(process.execPath, [HELPER, stub, '2', '60000'], {
      input: JSON.stringify(files),
      encoding: 'utf8',
      timeout: 60000,
    });
    assert.equal(run.status, 0, `the helper failed: ${run.stderr}`);
    const records = JSON.parse(run.stdout);
    assert.deepEqual(records.map((record) => record.file), files, 'the records are not one per file in input order');
    const crashed = records[names.indexOf('crash.js')];
    assert.deepEqual([crashed.status, crashed.timedOut, crashed.error], [null, false, 'killed by SIGKILL']);
    assert.deepEqual(records.map((record) => record.status), [0, 0, 0, null, 1, 0, 0]);
    assert.match(records[names.indexOf('d-bad.js')].stderr, MESSAGE, 'the failing file after the crash lost its message');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
