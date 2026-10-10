// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Git Hook Stdin Deadline Tests                                 ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Prove both sk-git hooks exit on their own when stdin stays open.║
// ╚══════════════════════════════════════════════════════════════════════════╝
//
// A host is not obliged to close a hook's stdin. One that holds the pipe open and writes
// nothing leaves a hook that reads to end-of-stream waiting until the host's own timeout
// kills it, which the operator sees as a stalled session rather than a decision. These
// tests spawn each hook with its stdin left open and assert it finishes on its own,
// quickly and successfully, so a hook that only works on a host that closes stdin fails
// here.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));

const HOOKS = ['git-message-gate.mjs', 'git-preflight-advisory.mjs'];

// The hook has to act before the host loses patience, so this is an upper bound on a
// self-driven exit. The kill timer is only a net under a regression that hangs the run.
const LATEST_EXIT_MS = 4500;
const KILL_AFTER_MS = 6000;

// Nothing is written to the pipe and nothing ends it, so the child sees an open stdin for
// the whole test, the state a host leaves a hook in when it never closes the stream.
function runWithOpenStdin(file) {
  return new Promise((resolve) => {
    const started = Date.now();
    const child = spawn(process.execPath, [path.join(HERE, file)], {
      env: { ...process.env, SKGIT_ADVISORY: '0' },
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    const killer = setTimeout(() => child.kill('SIGKILL'), KILL_AFTER_MS);
    child.on('close', (code, signal) => {
      clearTimeout(killer);
      resolve({ code, signal, elapsedMs: Date.now() - started });
    });
  });
}

for (const file of HOOKS) {
  test(`${file} exits on its own when stdin stays open`, async () => {
    const { code, signal, elapsedMs } = await runWithOpenStdin(file);
    assert.equal(code, 0, 'the hook must approve and exit 0');
    assert.equal(signal, null, 'the hook must exit on its own, not be killed');
    assert.ok(elapsedMs < LATEST_EXIT_MS, `the hook exited after ${elapsedMs} ms, past its deadline`);
  });
}
