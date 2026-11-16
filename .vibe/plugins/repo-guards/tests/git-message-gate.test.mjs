// ───────────────────────────────────────────────────────────────────
// MODULE: Vibe Git Message Gate Hook Tests (node --test)
// ───────────────────────────────────────────────────────────────────
//
// Drives the pre_tool hook as Vibe runs it: one JSON payload on stdin and the
// verdict on stdout. Vibe names a foreground shell call file_system.bash and a
// background one process.start, so a commit message that breaks the sk-git
// templates must be refused under either name.

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const GUARDS = join(dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Runs the hook with one shell payload.
 * @param {string} toolName - The payload's tool_name.
 * @param {string} command - The shell command.
 * @param {object} [toolInput] - The payload's tool_input, when it is not a command.
 * @returns {string} The hook's stdout.
 */
function runHook(toolName, command, toolInput = { command }) {
  const result = spawnSync(process.execPath, [join(GUARDS, 'git-message-gate.mjs')], {
    input: JSON.stringify({
      hook_event_name: 'pre_tool',
      session_id: 'vibe-git-message-gate',
      cwd: tmpdir(),
      tool_name: toolName,
      tool_call_id: 'call-1',
      tool_input: toolInput,
    }),
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout;
}

test('a non-conforming commit message is refused in the foreground and in the background', () => {
  for (const toolName of ['file_system.bash', 'process.start']) {
    const verdict = JSON.parse(runHook(toolName, "git commit -m 'stuff'") || '{}');
    assert.equal(verdict.decision, 'deny', toolName);
  }
});

test('a non-conforming commit typed into a running background shell is refused', () => {
  const verdict = JSON.parse(runHook('process.write', '', { processId: 'proc-1', text: "git commit -m 'stuff'\n" }) || '{}');
  assert.equal(verdict.decision, 'deny');
});

test('a background command that is not a commit is allowed', () => {
  assert.equal(runHook('process.start', 'git status --short'), '');
});
