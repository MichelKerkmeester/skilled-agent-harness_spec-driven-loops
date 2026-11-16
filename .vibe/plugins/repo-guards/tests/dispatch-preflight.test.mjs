// ───────────────────────────────────────────────────────────────────
// MODULE: Vibe Dispatch Preflight Hook Tests (node --test)
// ───────────────────────────────────────────────────────────────────
//
// Drives the pre_tool hook as Vibe runs it: one JSON payload on stdin and the
// verdict on stdout. A dispatch that breaks a CLI skill's blocking hard rules
// must be refused whether the model runs it in the foreground
// (file_system.bash) or starts it in the background (process.start).

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const GUARDS = join(dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Runs the hook under an environment that carries none of the caller's hook
 * switches, so the verdict does not depend on the shell the suite runs in.
 * @param {string} toolName - The payload's tool_name.
 * @param {string} command - The shell command.
 * @returns {string} The hook's stdout.
 */
function runHook(toolName, command) {
  const env = { ...process.env, HOOK_FLAGS_CONFIG: join(tmpdir(), 'vibe-dispatch-preflight-absent.env') };
  for (const name of Object.keys(env)) {
    if (name.endsWith('_DISABLED')) delete env[name];
  }
  delete env.AI_SESSION_CHILD;
  const result = spawnSync(process.execPath, [join(GUARDS, 'dispatch-preflight.mjs')], {
    input: JSON.stringify({
      hook_event_name: 'pre_tool',
      session_id: 'vibe-dispatch-preflight',
      cwd: tmpdir(),
      tool_name: toolName,
      tool_call_id: 'call-1',
      tool_input: { command },
    }),
    env,
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout;
}

test('a dispatch its hard rules refuse is denied in the foreground and in the background', () => {
  for (const toolName of ['file_system.bash', 'process.start']) {
    const verdict = JSON.parse(runHook(toolName, 'vibe -p hi') || '{}');
    assert.equal(verdict.decision, 'deny', toolName);
  }
});

test('a background command that dispatches nothing is allowed', () => {
  assert.equal(runHook('process.start', 'ls -la'), '');
});
