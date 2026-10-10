// ───────────────────────────────────────────────────────────────────
// MODULE: ESM Hook Stdin Deadline Tests
// ───────────────────────────────────────────────────────────────────
// A host that never closes a hook's stdin must not hold the hook until the
// host's own timeout kills it. Every ESM adapter below reads stdin through the
// shared reader, so with stdin left open and never written it gives up at the
// deadline, exits 0 and prints its fail-open output. A second group of tests
// pins the payload path of the adapters that no other suite spawns; the classifier,
// goal, Codex dispatch and Fable adapters already have payload suites of their
// own (classifier-injection-screen-posttooluse.test.mjs, goal-cursor.test.mjs,
// goal-devin.test.mjs, codex-shell-tool.test.mjs and the Fable subagent guard
// test under .opencode/plugins/tests).
// ───────────────────────────────────────────────────────────────────

import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const HOOKS_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO_ROOT = path.resolve(HOOKS_ROOT, '..', '..');

// The shared reader waits 3000 ms. A hook blocked on an open stdin cannot exit
// before that, so the lower bound shows the hook reached the read at all; the
// upper bound is the deadline plus room for start-up with fourteen processes
// running at once; the kill timer only stops a regression from hanging the run.
const EARLIEST_EXIT_MS = 2900;
const LATEST_EXIT_MS = 8000;
const KILL_AFTER_MS = 12000;

const ALLOW = '{"permission":"allow"}';

const HOOKS = [
  { id: 'classifier-injection-screen/claude', file: 'classifier-injection-screen/claude/classifier-injection-screen-posttooluse.mjs', failOpen: '' },
  { id: 'classifier-injection-screen/devin', file: 'classifier-injection-screen/devin/classifier-injection-screen-posttooluse.mjs', failOpen: '' },
  { id: 'dispatch/claude preflight', file: 'dispatch/claude/dispatch-preflight-lint.mjs', failOpen: '' },
  { id: 'dispatch/codex preflight', file: 'dispatch/codex/dispatch-preflight-lint.mjs', failOpen: '' },
  { id: 'dispatch/cursor preflight', file: 'dispatch/cursor/dispatch-preflight-lint.mjs', failOpen: ALLOW },
  { id: 'dispatch/devin preflight', file: 'dispatch/devin/dispatch-preflight-lint.mjs', failOpen: '' },
  { id: 'dispatch/claude audit', file: 'dispatch/claude/dispatch-audit-posttooluse.mjs', failOpen: '' },
  { id: 'dispatch/codex audit', file: 'dispatch/codex/dispatch-audit-posttooluse.mjs', failOpen: '' },
  { id: 'dispatch/devin audit', file: 'dispatch/devin/dispatch-audit-posttooluse.mjs', failOpen: '' },
  { id: 'goal/cursor', file: 'goal/cursor/goal-inject.mjs', failOpen: ALLOW },
  { id: 'goal/devin', file: 'goal/devin/goal-inject.mjs', failOpen: '{}' },
  { id: 'mcp-route-guard/cursor', file: 'mcp-route-guard/cursor/mcp-route-guard.mjs', failOpen: ALLOW },
  { id: 'task-dispatch/cursor', file: 'task-dispatch/cursor/task-dispatch-guard.mjs', failOpen: ALLOW },
  { id: 'task-dispatch/claude fable', file: 'task-dispatch/claude/fable-subagent-guard.mjs', failOpen: '' },
];

// No kill-switch may leak in: a disabled hook exits at once without reading
// stdin, which would hide a missing deadline.
function hookEnv(extra = {}) {
  const env = { ...process.env };
  for (const name of Object.keys(env)) {
    if (name.endsWith('_DISABLED')) delete env[name];
  }
  return { ...env, HOOK_FLAGS_CONFIG: path.join(os.tmpdir(), 'hook-stdin-deadline-absent.env'), ...extra };
}

// Spawns the hook and leaves its stdin pipe open: nothing is written and
// nothing is ended.
function runWithOpenStdin(file) {
  return new Promise((resolve) => {
    const started = Date.now();
    const child = spawn(process.execPath, [path.join(HOOKS_ROOT, file)], {
      cwd: REPO_ROOT,
      env: hookEnv(),
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    let stdout = '';
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    const killer = setTimeout(() => child.kill('SIGKILL'), KILL_AFTER_MS);
    child.on('close', (code, signal) => {
      clearTimeout(killer);
      resolve({ code, signal, stdout, elapsedMs: Date.now() - started });
    });
  });
}

test('every ESM hook exits 0 at the stdin deadline when its host never closes stdin', async (t) => {
  const results = await Promise.all(HOOKS.map((hook) => runWithOpenStdin(hook.file)));
  for (const [index, hook] of HOOKS.entries()) {
    await t.test(hook.id, () => {
      const result = results[index];
      assert.equal(result.signal, null, 'the hook must exit on its own, not be killed');
      assert.equal(result.code, 0);
      assert.equal(result.stdout, hook.failOpen);
      assert.ok(result.elapsedMs >= EARLIEST_EXIT_MS, `exited after ${result.elapsedMs} ms, before it could have waited on stdin`);
      assert.ok(result.elapsedMs < LATEST_EXIT_MS, `exited after ${result.elapsedMs} ms, past the deadline plus margin`);
    });
  }
});

// A flagged dispatch trips one hard rule whose id the assertions look for.
const FLAGGED_DISPATCH = 'opencode run -m p/m --agent general "x" </dev/null';
const RULE_ID = 'no-bare-agent-general';

function runWithPayload(file, payload, env) {
  return spawnSync(process.execPath, [path.join(HOOKS_ROOT, file)], {
    input: JSON.stringify(payload),
    encoding: 'utf8',
    env: hookEnv(env),
    cwd: REPO_ROOT,
    timeout: 15000,
  });
}

function recordedAuditLine(projectDir) {
  const logPath = path.join(projectDir, '.skilled', 'logs', 'cli-dispatch-audit.log');
  return JSON.parse(fs.readFileSync(logPath, 'utf8').trim().split('\n').pop());
}

test('the Claude and Devin preflight lints still flag a dispatch sent on a normal payload', () => {
  const claude = runWithPayload(
    'dispatch/claude/dispatch-preflight-lint.mjs',
    { tool_name: 'Bash', cwd: REPO_ROOT, tool_input: { command: FLAGGED_DISPATCH } },
    { CLAUDE_PROJECT_DIR: REPO_ROOT },
  );
  assert.equal(claude.status, 0, claude.stderr);
  assert.equal(JSON.parse(claude.stdout).hookSpecificOutput.hookEventName, 'PreToolUse');
  assert.ok(claude.stdout.includes(RULE_ID));

  const devin = runWithPayload(
    'dispatch/devin/dispatch-preflight-lint.mjs',
    { tool_name: 'exec', cwd: REPO_ROOT, tool_input: { command: FLAGGED_DISPATCH } },
  );
  assert.equal(devin.status, 0, devin.stderr);
  assert.equal(JSON.parse(devin.stdout).hookSpecificOutput.hookEventName, 'PreToolUse');
  assert.ok(devin.stdout.includes(RULE_ID));
});

test('the Claude and Devin dispatch audits still record a dispatch sent on a normal payload', (t) => {
  for (const { file, tool, runtime } of [
    { file: 'dispatch/claude/dispatch-audit-posttooluse.mjs', tool: 'Bash', runtime: 'claude' },
    { file: 'dispatch/devin/dispatch-audit-posttooluse.mjs', tool: 'exec', runtime: 'devin' },
  ]) {
    const projectDir = fs.mkdtempSync(path.join(os.tmpdir(), `${runtime}-dispatch-audit-`));
    t.after(() => fs.rmSync(projectDir, { recursive: true, force: true }));
    const result = runWithPayload(file, {
      tool_name: tool,
      cwd: projectDir,
      session_id: 'stdin-deadline-session',
      tool_input: { command: FLAGGED_DISPATCH },
      tool_response: { stdout: 'done\n', stderr: '' },
    });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stdout, '');
    assert.equal(recordedAuditLine(projectDir).runtime, runtime);
  }
});

test('the Cursor preflight, MCP route and Task guards still answer a normal payload', () => {
  const lint = runWithPayload('dispatch/cursor/dispatch-preflight-lint.mjs', {
    tool_name: 'Shell',
    workspace_roots: [REPO_ROOT],
    tool_input: { command: FLAGGED_DISPATCH },
  });
  assert.equal(lint.status, 0, lint.stderr);
  assert.equal(JSON.parse(lint.stdout).permission, 'allow');
  assert.ok(JSON.parse(lint.stdout).agent_message.includes(RULE_ID));

  const mcp = runWithPayload(
    'mcp-route-guard/cursor/mcp-route-guard.mjs',
    { mcp_server_name: 'external-example', tool_name: 'lookup', workspace_roots: [REPO_ROOT] },
    { MCP_ROUTE_GUARD_BROAD_MODE: '1' },
  );
  assert.equal(mcp.status, 0, mcp.stderr);
  assert.equal(JSON.parse(mcp.stdout).permission, 'allow');
  assert.ok(JSON.parse(mcp.stdout).agent_message.includes('native call to "external-example"'));

  const task = runWithPayload(
    'task-dispatch/cursor/task-dispatch-guard.mjs',
    {
      tool_name: 'Task',
      workspace_roots: [REPO_ROOT],
      tool_input: { subagent_type: 'ai-council', prompt: 'mode=research do the thing' },
    },
    { SYSTEM_DEEP_LOOP_GUARD_REJECT: '1' },
  );
  assert.equal(task.status, 2, task.stderr);
  assert.equal(JSON.parse(task.stdout).permission, 'deny');
  assert.match(JSON.parse(task.stdout).agent_message, /Deep Route mode mismatch/);
});
