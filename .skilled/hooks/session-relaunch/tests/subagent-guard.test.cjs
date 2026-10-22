// ───────────────────────────────────────────────────────────────────
// MODULE: Session Relaunch Subagent Guard Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// A sub-agent or fork carries its parent's session id, so the relaunch CLI's
// lifecycle commands run from inside a sub-agent would act on the parent's
// handoff note. The guard keeps that note in the parent's hands; these cases
// pin the line between a sub-agent's call and the parent's own.

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const SUBAGENT_GUARD_PATH = path.resolve(__dirname, '../claude/subagent-guard.mjs');
const CLI_PATH = '.skilled/hooks/session-relaunch/bin/session-relaunch.cjs';
const SESSION_ID = 'session-subagent-guard-0001';
const AGENT_ID = 'a2e707a219a23a8f7';
const NOTE_PATH = '/workspace/handoffs/note-0001.md';

// The denial wording belongs to the implementation. Its guarantee is that the
// sub-agent is told whose session, and whose note, the command would touch.
const DENIAL_REASON_WORDS = [/sub-?agent/i, /parent/i, /session/i, /handoff/i];

function createSandbox(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'session-relaunch-subagent-guard-'));
  const home = path.join(root, 'home');
  const xdgRuntimeDir = path.join(root, 'runtime');
  fs.mkdirSync(home, { recursive: true });
  fs.mkdirSync(xdgRuntimeDir, { recursive: true });
  const env = {
    ...process.env,
    HOME: home,
    XDG_RUNTIME_DIR: xdgRuntimeDir,
    HOOK_FLAGS_CONFIG: path.join(home, 'hook-flags.env'),
  };
  // Kill-switches are operator state. A machine that disabled them must not turn
  // a deny case into a silent pass, so the child starts with all three cleared;
  // only the disabled case opts back in.
  for (const key of [
    'SYSTEM_SESSION_RELAUNCH_DISABLED',
    'SYSTEM_HOOKS_DISABLED',
    'MK_HOOKS_DISABLED',
  ]) delete env[key];
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return { root, home, xdgRuntimeDir, env };
}

function runGuard(sandbox, stdin) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [SUBAGENT_GUARD_PATH], {
      cwd: sandbox.root,
      env: sandbox.env,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.once('error', reject);
    child.once('close', (code, signal) => resolve({ code, signal, stdout, stderr }));
    child.stdin.end(stdin);
  });
}

function bashPayload(sandbox, command, overrides = {}) {
  return {
    session_id: SESSION_ID,
    transcript_path: path.join(sandbox.root, `${SESSION_ID}.jsonl`),
    cwd: sandbox.root,
    hook_event_name: 'PreToolUse',
    tool_name: 'Bash',
    tool_input: { command, description: 'session relaunch lifecycle' },
    ...overrides,
  };
}

function subagentBashPayload(sandbox, command, agentType = 'fork') {
  return bashPayload(sandbox, command, {
    agent_id: AGENT_ID,
    agent_type: agentType,
  });
}

function claimCommand() {
  return `node ${CLI_PATH} claim '${NOTE_PATH}' --session '${SESSION_ID}'`;
}

function assertDenied(result) {
  assert.equal(result.code, 0, result.stderr);
  assert.notEqual(result.stdout.trim(), '', 'expected a PreToolUse denial envelope');
  const output = JSON.parse(result.stdout.trim());
  assert.deepEqual(Object.keys(output), ['hookSpecificOutput']);
  const decision = output.hookSpecificOutput;
  assert.equal(decision.hookEventName, 'PreToolUse');
  assert.equal(decision.permissionDecision, 'deny');
  const reason = decision.permissionDecisionReason;
  assert.equal(typeof reason, 'string', 'permissionDecisionReason must be a string');
  assert.ok(reason.trim().length > 0, 'permissionDecisionReason must not be empty');
  for (const pattern of DENIAL_REASON_WORDS) {
    assert.match(reason, pattern);
  }
}

function assertSilent(result) {
  assert.equal(result.code, 0, result.stderr);
  assert.equal(result.stdout, '');
}

test('subagent-guard denies claim from a sub-agent', async (t) => {
  const sandbox = createSandbox(t);
  const result = await runGuard(sandbox, JSON.stringify(
    subagentBashPayload(sandbox, claimCommand(), 'general-purpose'),
  ));
  assertDenied(result);
});

test('subagent-guard denies complete from a sub-agent', async (t) => {
  const sandbox = createSandbox(t);
  const result = await runGuard(sandbox, JSON.stringify(
    subagentBashPayload(sandbox, `node ${CLI_PATH} complete '${NOTE_PATH}'`),
  ));
  assertDenied(result);
});

test('subagent-guard denies keep from a sub-agent', async (t) => {
  const sandbox = createSandbox(t);
  const result = await runGuard(sandbox, JSON.stringify(
    subagentBashPayload(
      sandbox,
      `node ${CLI_PATH} keep --handoff '${NOTE_PATH}' --session '${SESSION_ID}' --runtime 'claude'`,
    ),
  ));
  assertDenied(result);
});

test('subagent-guard denies prepare from a sub-agent', async (t) => {
  const sandbox = createSandbox(t);
  const result = await runGuard(sandbox, JSON.stringify(
    subagentBashPayload(
      sandbox,
      `node ${CLI_PATH} prepare --handoff '${NOTE_PATH}' --session '${SESSION_ID}' --runtime 'claude'`,
    ),
  ));
  assertDenied(result);
});

test('subagent-guard stays silent for the main session that carries no agent_id', async (t) => {
  const sandbox = createSandbox(t);
  const result = await runGuard(sandbox, JSON.stringify(
    bashPayload(sandbox, claimCommand()),
  ));
  assertSilent(result);
});

test('subagent-guard stays silent for a sub-agent reading the hop history', async (t) => {
  const sandbox = createSandbox(t);
  const result = await runGuard(sandbox, JSON.stringify(
    subagentBashPayload(sandbox, `node ${CLI_PATH} history --last 5`),
  ));
  assertSilent(result);
});

test('subagent-guard stays silent for an unrelated Bash command from a sub-agent', async (t) => {
  const sandbox = createSandbox(t);
  const result = await runGuard(sandbox, JSON.stringify(
    subagentBashPayload(sandbox, 'git status --short'),
  ));
  assertSilent(result);
});

test('subagent-guard stays silent for a non-Bash tool call from a sub-agent', async (t) => {
  const sandbox = createSandbox(t);
  const payload = subagentBashPayload(sandbox, claimCommand());
  payload.tool_name = 'Read';
  payload.tool_input = { file_path: NOTE_PATH };
  const result = await runGuard(sandbox, JSON.stringify(payload));
  assertSilent(result);
});

test('subagent-guard stays silent on stdin that is not valid JSON', async (t) => {
  const sandbox = createSandbox(t);
  const result = await runGuard(sandbox, '{"tool_name": "Bash", "tool_input": {"command": ');
  assertSilent(result);
});

test('subagent-guard stays silent when the relaunch concern is disabled', async (t) => {
  const sandbox = createSandbox(t);
  sandbox.env.SYSTEM_SESSION_RELAUNCH_DISABLED = '1';
  const result = await runGuard(sandbox, JSON.stringify(
    subagentBashPayload(sandbox, claimCommand()),
  ));
  assertSilent(result);
});
