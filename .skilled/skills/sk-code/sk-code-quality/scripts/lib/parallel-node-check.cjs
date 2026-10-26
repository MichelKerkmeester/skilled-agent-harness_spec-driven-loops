#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code-quality Parallel Syntax Check Helper
// ───────────────────────────────────────────────────────────────────
'use strict';

// One `node --check` per file is the only syntax authority the runner accepts, so a
// fifty-file change starts fifty interpreters. Timed runs showed the process starts,
// not the compiles, were most of that check's cost, so this helper keeps the per-file
// command, result and order exactly as they were and overlaps only the waiting. It is
// started once by the runner inside the runner's workspace-guard window and prints one
// record per input file, in input order, so the parent rebuilds its findings from the
// same evidence it read from a sequential loop.
//
// Every child it starts leads its own process group and is tracked here, because the
// helper can be stopped from outside while children are still running: the runner's own
// deadline and an operator's interrupt both reach the helper and not its children, and a
// child nobody waits for would keep an interpreter on a file the run has already
// abandoned. A signal, a normal exit and a failed run therefore kill them all.
//
// Usage: node parallel-node-check.cjs <node binary> <limit> <timeout ms>
// The file list arrives on stdin as a JSON array of paths.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const { spawn } = require('node:child_process');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// The parent builds a finding from two lines of a child's stderr: the first, which names
// the file and the line, and the first `Error:` line, which names the message, plus the
// last line when it quotes no message. A minified one-line file puts tens of thousands of
// characters of source between those lines, so keeping only the start of the stream would
// drop the text the finding is built from, and keeping all of it lets a thousand failing
// files grow past the parent's single read of this process's output. The head and the tail
// carry every line the parent reads, and together they stay inside one budget per child.
const STDERR_LIMIT = 4096;
const STDERR_TAIL = 2048;
const STDERR_SNIP = '\n[truncated]\n';
const EXIT_USAGE = 2;
const EXIT_FAILURE = 1;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function readInput() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    process.stdin.on('data', (chunk) => chunks.push(chunk));
    process.stdin.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    process.stdin.on('error', reject);
  });
}

// Every child still running, so a signal, an exit or a failed run can stop all of them.
// An entry is added when the child starts and dropped once it has been reaped.
const liveChildren = new Set();

// A child leads its own process group, so a negative pid reaches anything it started, the
// same way the runner stops a repository command. Only its stderr is piped, because that
// is the one stream the parent reads. Windows has no process groups and gives a detached
// child its own console window, so there the child stays attached and hidden, and
// stopChild falls back to killing the child itself.
function startChild(binary, file) {
  const child = spawn(binary, ['--check', file], {
    stdio: ['ignore', 'ignore', 'pipe'],
    shell: false,
    detached: process.platform !== 'win32',
    windowsHide: true,
  });
  liveChildren.add(child);
  child.on('close', () => liveChildren.delete(child));
  child.on('error', () => liveChildren.delete(child));
  return child;
}

function stopChild(child) {
  // A child that has already left is left alone, because its pid may belong to another
  // process by the time a deadline fires.
  if (!child.pid || child.exitCode !== null || child.signalCode !== null) return;
  try {
    process.kill(-child.pid, 'SIGKILL');
  } catch {
    // A platform without process groups rejects the negative pid, so the child itself is
    // the fallback and is still stopped.
    try { child.kill('SIGKILL'); } catch {}
  }
}

function stopAllChildren() {
  for (const child of liveChildren) stopChild(child);
  liveChildren.clear();
}

// A signal reaches this process and not its children, because each child leads its own
// group, so every child is killed here before the process goes. The exit code is the one
// a shell reports for a process it stopped with that signal.
function leaveOn(signal, code) {
  process.on(signal, () => {
    stopAllChildren();
    process.exit(code);
  });
}
leaveOn('SIGTERM', 143);
leaveOn('SIGINT', 130);
process.on('exit', stopAllChildren);

// A child's stderr arrives in chunks and is kept inside the budget from the first byte,
// so no single file can grow the record past it. The head holds the line and column line
// and the tail holds the message and the frames after it, which are the only lines the
// parent reads.
function stderrCapture() {
  let text = '';
  return {
    push(chunk) {
      text += chunk;
      if (text.length > STDERR_LIMIT) {
        const head = STDERR_LIMIT - STDERR_TAIL - STDERR_SNIP.length;
        text = text.slice(0, head) + STDERR_SNIP + text.slice(-STDERR_TAIL);
      }
    },
    text() {
      return text;
    },
  };
}

// One file, one `node --check`, the same command a sequential run started and the same
// three things the parent read back from it: the exit status, the stderr and whether
// the deadline stopped it. Killing at the deadline keeps one hung file from holding the
// pool past the check's own budget, because the parent's deadline covers the whole
// check rather than one child.
function checkFile(binary, file, timeoutMs) {
  return new Promise((resolve) => {
    const child = startChild(binary, file);
    const stderr = stderrCapture();
    let timedOut = false;
    let settled = false;
    const finish = (status, error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ file, status, stderr: stderr.text(), timedOut, error });
    };
    const timer = setTimeout(() => {
      timedOut = true;
      stopChild(child);
    }, timeoutMs);
    child.stderr.setEncoding('utf8');
    child.stderr.on('data', (chunk) => stderr.push(chunk));
    child.on('error', (error) => finish(null, error.message));
    child.on('close', (code, signal) => {
      if (timedOut) return finish(null, 'timed out');
      if (code === null) return finish(null, `killed by ${signal}`);
      return finish(code, null);
    });
  });
}

// The pool holds at most `limit` children at once. Each worker claims the next unclaimed
// index, so a record lands at its input index and the parent reads them back in the
// order it asked, whichever child finished first.
async function runPool(files, limit, binary, timeoutMs) {
  const records = new Array(files.length);
  let next = 0;
  const worker = async () => {
    while (next < files.length) {
      const index = next;
      next += 1;
      records[index] = await checkFile(binary, files[index], timeoutMs);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, files.length) }, () => worker()));
  return records;
}

function number(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 1 ? Math.round(parsed) : null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. MAIN
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const [binary, limitArg, timeoutArg] = process.argv.slice(2);
  const limit = Number(limitArg);
  const timeoutMs = number(timeoutArg);
  if (!binary || !Number.isFinite(limit) || limit < 1 || timeoutMs === null) {
    process.stderr.write('parallel-node-check: usage: <node binary> <limit> <timeout ms> with the file list on stdin\n');
    process.exitCode = EXIT_USAGE;
    return;
  }
  let files;
  try {
    files = JSON.parse(await readInput());
  } catch (error) {
    process.stderr.write(`parallel-node-check: the file list was not JSON: ${error.message}\n`);
    process.exitCode = EXIT_USAGE;
    return;
  }
  if (!Array.isArray(files) || files.some((file) => typeof file !== 'string')) {
    process.stderr.write('parallel-node-check: the file list is not an array of paths\n');
    process.exitCode = EXIT_USAGE;
    return;
  }
  // An empty list asks for no work, so it starts nothing and prints the empty result.
  if (files.length === 0) {
    process.stdout.write('[]\n');
    return;
  }
  const records = await runPool(files, Math.round(limit), binary, timeoutMs);
  process.stdout.write(`${JSON.stringify(records)}\n`);
}

// A run that throws here would otherwise leave children behind and still exit zero on an
// unhandled rejection, so the failure stops them and reports itself as a failed run.
main().catch((error) => {
  stopAllChildren();
  process.stderr.write(`parallel-node-check: ${error.message}\n`);
  process.exitCode = EXIT_FAILURE;
});
