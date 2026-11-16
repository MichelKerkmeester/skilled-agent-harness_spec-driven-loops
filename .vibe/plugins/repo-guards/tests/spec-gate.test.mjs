// ───────────────────────────────────────────────────────────────────
// MODULE: Vibe Spec Gate Hook Tests (node --test)
// ───────────────────────────────────────────────────────────────────
//
// Drives the pre_agent classify hook and the strict pre_tool hook as Vibe runs
// them: one JSON payload on stdin, the verdict on stdout. Covers which session
// the gate may deny. An interactive session is denied a write until the
// spec-folder question is answered; a dispatched child is never denied, whether
// the child signal arrives as the inherited environment variable or as a parent
// session id in the payload.

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const GUARDS = join(dirname(fileURLToPath(import.meta.url)), '..');
const PROMPT = 'Create a file notes.txt with a short summary of this repository.';
const CORE_PATH = '../../../../.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs';

/**
 * Runs one hook script with a payload, under an environment that carries none
 * of the caller's spec-gate switches, so the result does not depend on the
 * shell the suite runs in.
 * @param {string} script - The hook file name under repo-guards.
 * @param {object} payload - The Vibe hook payload.
 * @param {Record<string, string>} extraEnv - Variables the case sets.
 * @returns {string} The hook's stdout.
 */
function runHook(script, payload, extraEnv) {
  const env = { ...process.env, ...extraEnv };
  if (!('AI_SESSION_CHILD' in extraEnv)) delete env.AI_SESSION_CHILD;
  delete env.SYSTEM_SPEC_GATE_ENFORCE;
  delete env.SYSTEM_SPEC_GATE_DISABLED;
  delete env.SYSTEM_SPEC_GATE_3_DELIVERY_SUPPRESSION;
  const result = spawnSync(process.execPath, [join(GUARDS, script)], {
    input: JSON.stringify(payload),
    env,
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout;
}

/**
 * Classifies a mutating prompt, then attempts a write in the same session.
 * @param {string} name - A session id unique to the case.
 * @param {{ parent?: string | null, env?: Record<string, string> }} options - The child signals.
 * @returns {{ classify: string, write: string }} Both hooks' stdout.
 */
function classifyThenWrite(name, { parent = null, env = {} } = {}) {
  const cwd = mkdtempSync(join(tmpdir(), 'vibe-spec-gate-'));
  try {
    const base = { session_id: name, cwd, parent_session_id: parent };
    const classify = runHook('spec-gate-classify.mjs', {
      ...base, hook_event_name: 'pre_agent', agent_name: 'default', turn_id: 'turn-1', prompt: PROMPT,
    }, env);
    const write = runHook('spec-gate.mjs', {
      ...base, hook_event_name: 'pre_tool', tool_name: 'file_system.write_file', tool_call_id: 'call-1',
      tool_input: { file_path: 'notes.txt', content: 'hello\n' },
    }, env);
    return { classify, write };
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
}

test('an interactive session is denied a write until the spec-folder question is answered', () => {
  const { classify, write } = classifyThenWrite('vibe-test-interactive');
  assert.match(classify, /first file mutation/);
  assert.equal(JSON.parse(write).decision, 'deny');
});

test('a headless dispatch that inherits AI_SESSION_CHILD=1 is never denied', () => {
  const { classify, write } = classifyThenWrite('vibe-test-child-env', { env: { AI_SESSION_CHILD: '1' } });
  assert.equal(classify, '');
  assert.equal(write, '');
});

test('a session whose payload names a parent is never denied', () => {
  const { classify, write } = classifyThenWrite('vibe-test-child-parent', { parent: 'parent-session' });
  assert.equal(classify, '');
  assert.equal(write, '');
});

// A gate that is open with no delivery marker is the state a classify pass that
// failed leaves behind. A shell call there is annotated, never denied, and the
// annotation must reach a background command exactly as it reaches a foreground one.
test('a background shell command is annotated like a foreground one while the gate is open', async () => {
  const core = await import(new URL(CORE_PATH, import.meta.url).href);
  const cwd = mkdtempSync(join(tmpdir(), 'vibe-spec-gate-'));
  try {
    for (const toolName of ['file_system.bash', 'process.start']) {
      const sessionId = `vibe-test-shell-${toolName}`;
      const { stateDir } = core.resolveGuardPaths(cwd);
      core.writeGateStateAtomic(stateDir, sessionId, { status: 'open', askedAtMs: Date.now() });
      const out = runHook('spec-gate.mjs', {
        session_id: sessionId, cwd, parent_session_id: null, hook_event_name: 'pre_tool',
        tool_name: toolName, tool_call_id: 'call-1', tool_input: { command: 'touch notes.txt' },
      }, {});
      const reply = JSON.parse(out || '{}');
      assert.equal(typeof reply.system_message, 'string', toolName);
      assert.equal(reply.decision, undefined, toolName);
    }
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});
