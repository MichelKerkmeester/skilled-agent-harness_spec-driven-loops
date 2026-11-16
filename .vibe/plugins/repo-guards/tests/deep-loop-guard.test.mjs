// ───────────────────────────────────────────────────────────────────
// MODULE: Vibe Deep Loop Guard Hook Tests (node --test)
// ───────────────────────────────────────────────────────────────────
//
// Drives the pre_tool hook as Vibe runs it: one agents.spawn payload on stdin
// and the verdict on stdout. A spawn whose Deep Route header declares a mode
// the registry does not give the target agent is refused; an ordinary spawn
// is allowed. Each case uses its own session id, because the core keeps
// per-session repeat counters.

import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const GUARDS = join(dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Runs the hook under an environment that carries none of the caller's hook
 * switches or reject-policy values, so the hook supplies its own policy.
 * @param {object} toolInput - The spawn tool's arguments.
 * @returns {string} The hook's stdout.
 */
function runHook(toolInput) {
  const env = { ...process.env, HOOK_FLAGS_CONFIG: join(tmpdir(), 'vibe-deep-loop-guard-absent.env') };
  for (const name of Object.keys(env)) {
    if (name.endsWith('_DISABLED')) delete env[name];
  }
  delete env.SYSTEM_DEEP_LOOP_GUARD_REJECT;
  delete env.SYSTEM_DEEP_LOOP_GUARD_REJECT_LOOP;
  const result = spawnSync(process.execPath, [join(GUARDS, 'deep-loop-guard.mjs')], {
    input: JSON.stringify({
      hook_event_name: 'pre_tool',
      session_id: `vibe-deep-loop-guard-${randomUUID()}`,
      cwd: tmpdir(),
      parent_session_id: null,
      tool_name: 'agents.spawn',
      tool_call_id: 'call-1',
      tool_input: toolInput,
    }),
    env,
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout;
}

test('a spawn whose declared mode the registry does not give the agent is denied', () => {
  const verdict = JSON.parse(runHook({
    name: 'packet-review',
    config_name: 'deep-research',
    message: 'Deep Route: workflow=deep-research mode=review target_agent=@deep-research\n\nReview the packet and report findings.',
  }) || '{}');
  assert.equal(verdict.decision, 'deny');
  assert.ok(verdict.reason, 'the deny carries a reason');
});

test('an ordinary spawn with no Deep Route header is allowed', () => {
  assert.equal(runHook({
    name: 'folder-explore',
    config_name: 'explore',
    message: 'List the files in the current folder and report their names.',
  }), '');
});
