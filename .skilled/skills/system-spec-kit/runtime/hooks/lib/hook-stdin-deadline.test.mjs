// ───────────────────────────────────────────────────────────────────
// MODULE: Hook Stdin Deadline Tests
// ───────────────────────────────────────────────────────────────────
// A host that never closes a hook's stdin must not hold the hook until the
// host's own timeout kills it. Every hook entry below reads stdin through
// lib/hook-adapter-shared.mjs, ../shared-stdin.ts or, for the Claude
// prompt-submit shim, its own inlined reader, so with stdin left open and never
// written it gives up at the deadline and takes the same exit it takes on an
// empty payload. The payload tests pin the parse path of entries that no other
// suite spawns with a real payload, the byte cap of the compiled reader, and,
// for every short-deadline entry, that a payload its host writes but never
// closes is still acted on, while the same payload written after the deadline
// is dropped. The compiled entries run from dist, so build the runtime before
// running this file.
// ───────────────────────────────────────────────────────────────────

import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const RUNTIME_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPO_ROOT = path.resolve(RUNTIME_ROOT, '..', '..', '..', '..');

// The shared readers wait 3000 ms by default, so a hook blocked on an open
// stdin cannot exit before that and the lower bound shows it reached the read.
// The Claude lifecycle hooks wrap their read in an 1800 ms budget of their own,
// so their lower bound is that budget. Entries whose host kills them after 3
// seconds read with a 500 ms deadline, so their lower bound is that deadline
// and their upper bound stays well inside the host timeout. The other upper
// bound leaves room for every entry starting at once. The kill timer only stops
// a regression from hanging the run.
const DEADLINE_FLOOR_MS = 2900;
const CLAUDE_BUDGET_FLOOR_MS = 1700;
const SHORT_HOST_FLOOR_MS = 400;
const SHORT_HOST_LATEST_EXIT_MS = 2500;
const LATEST_EXIT_MS = 10000;
const SHORT_HOST = { floor: SHORT_HOST_FLOOR_MS, latest: SHORT_HOST_LATEST_EXIT_MS };
const KILL_AFTER_MS = 15000;

const ALLOW = '{"permission":"allow"}';
const PERMISSION_DENY = JSON.stringify({
  decision: 'block',
  reason: 'Permission denied: request payload is not valid JSON.',
  hookSpecificOutput: {
    hookEventName: 'PermissionRequest',
    permissionDecision: 'deny',
    permissionDecisionReason: 'Permission denied: request payload is not valid JSON.',
  },
});

const HOOKS = [
  { file: 'hooks/claude/completion-evidence-stop.cjs', code: 0, stdout: '' },
  { file: 'hooks/codex/completion-evidence-stop.cjs', code: 0, stdout: '' },
  { file: 'hooks/devin/completion-evidence-stop.cjs', code: 0, stdout: '' },
  { file: 'hooks/devin/post-compaction.cjs', code: 0, stdout: '' },
  { file: 'hooks/devin/permission-request-policy.mjs', code: 0, stdout: PERMISSION_DENY },
  { file: 'hooks/cursor/post-tool-use.mjs', code: 0, stdout: ALLOW },
  { file: 'hooks/cursor/spec-gate-prebind.mjs', code: 0, stdout: ALLOW },
  { file: 'hooks/cursor/completion-evidence-response.mjs', code: 0, stdout: '' },
  { file: 'hooks/claude/spec-gate-enforce.mjs', code: 0, stdout: '' },
  { file: 'hooks/codex/spec-gate-enforce.mjs', code: 0, stdout: '' },
  { file: 'hooks/cursor/spec-gate-enforce.mjs', code: 0, stdout: ALLOW },
  { file: 'hooks/devin/spec-gate-enforce.mjs', code: 0, stdout: '' },
  { file: 'hooks/claude/spec-gate-classify.mjs', code: 0, stdout: '', ...SHORT_HOST },
  { file: 'hooks/codex/spec-gate-classify.mjs', code: 0, stdout: '', ...SHORT_HOST },
  { file: 'hooks/cursor/spec-gate-classify.mjs', code: 0, stdout: ALLOW },
  { file: 'hooks/devin/spec-gate-classify.mjs', code: 0, stdout: '' },
  { file: 'dist/hooks/claude/compact-inject.js', code: 0, stdout: '', ...SHORT_HOST },
  { file: 'dist/hooks/claude/compact-inject.js', args: ['--authored-snapshot-worker'], code: 0, stdout: '' },
  { file: 'dist/hooks/claude/session-prime.js', code: 0, stdout: '', ...SHORT_HOST },
  { file: 'dist/hooks/claude/session-stop.js', code: 0, stdout: '', floor: CLAUDE_BUDGET_FLOOR_MS },
  { file: 'dist/hooks/claude/directive-lifecycle-boundary.js', code: 1, stdout: '' },
  { file: 'dist/hooks/claude/user-prompt-submit.js', code: 0, stdout: '{}', ...SHORT_HOST },
  { file: 'dist/hooks/codex/session-start.js', code: 0, stdout: '', ...SHORT_HOST },
  { file: 'dist/hooks/codex/session-stop.js', code: 0, stdout: '' },
  { file: 'dist/hooks/codex/user-prompt-submit.js', code: 0, stdout: '', ...SHORT_HOST },
  { file: 'dist/hooks/codex/compact-inject.js', code: 0, stdout: '' },
  { file: 'dist/hooks/cursor/session-start.js', code: 0, stdout: ALLOW },
  { file: 'dist/hooks/cursor/session-end.js', code: 0, stdout: '' },
  { file: 'dist/hooks/cursor/user-prompt-submit.js', code: 0, stdout: ALLOW },
  { file: 'dist/hooks/cursor/precompact.js', code: 0, stdout: ALLOW },
  { file: 'dist/hooks/devin/session-start.js', code: 0, stdout: '' },
  { file: 'dist/hooks/devin/session-stop.js', code: 0, stdout: '' },
  { file: 'dist/hooks/devin/user-prompt-submit.js', code: 0, stdout: '' },
];

// No kill-switch may leak in: a disabled hook exits at once without reading
// stdin, which would hide a missing deadline.
function hookEnv(extra = {}) {
  const env = { ...process.env };
  for (const name of Object.keys(env)) {
    if (name.endsWith('_DISABLED')) delete env[name];
  }
  delete env.SPECKIT_DIRECTIVE_LIFECYCLE_BOUNDARY_TARGET;
  return { ...env, HOOK_FLAGS_CONFIG: path.join(os.tmpdir(), 'hook-stdin-deadline-absent.env'), ...extra };
}

// Spawns one entry. With no input the stdin pipe stays open: nothing is
// written and nothing is ended. With holdOpen the input is written and the
// pipe still stays open.
function runHook(file, { args = [], input, env, holdOpen = false, writeDelayMs = 0 } = {}) {
  return new Promise((resolve) => {
    const started = Date.now();
    const child = spawn(process.execPath, [path.join(RUNTIME_ROOT, file), ...args], {
      cwd: REPO_ROOT,
      env: hookEnv(env),
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    // A hook that stops reading early closes the pipe under the writer.
    child.stdin.on('error', () => {});
    if (input !== undefined && holdOpen) {
      if (writeDelayMs > 0) setTimeout(() => child.stdin.write(input), writeDelayMs);
      else child.stdin.write(input);
    } else if (input !== undefined) child.stdin.end(input);
    const killer = setTimeout(() => child.kill('SIGKILL'), KILL_AFTER_MS);
    child.on('close', (code, signal) => {
      clearTimeout(killer);
      resolve({ code, signal, stdout: stdout.trim(), stderr, elapsedMs: Date.now() - started });
    });
  });
}

function hookId(hook) {
  return [hook.file, ...(hook.args ?? [])].join(' ');
}

test('every hook entry gives up at the stdin deadline when its host never closes stdin', async (t) => {
  const results = await Promise.all(HOOKS.map((hook) => runHook(hook.file, { args: hook.args })));
  for (const [index, hook] of HOOKS.entries()) {
    await t.test(hookId(hook), () => {
      const result = results[index];
      const floor = hook.floor ?? DEADLINE_FLOOR_MS;
      const latest = hook.latest ?? LATEST_EXIT_MS;
      assert.equal(result.signal, null, 'the hook must exit on its own, not be killed');
      assert.equal(result.code, hook.code);
      assert.equal(result.stdout, hook.stdout);
      assert.ok(result.elapsedMs >= floor, `exited after ${result.elapsedMs} ms, before it could have waited on stdin`);
      assert.ok(result.elapsedMs < latest, `exited after ${result.elapsedMs} ms, past the deadline plus margin`);
    });
  }
});

function tempDir(t, prefix) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return dir;
}

test('the Cursor post-tool-use hook still routes a Write payload to its chained hook', async (t) => {
  const workspace = tempDir(t, 'cursor-post-tool-use-');
  const chained = path.join(workspace, '.skilled', 'hooks', 'post-edit-quality', 'claude', 'claude-posttooluse.cjs');
  fs.mkdirSync(path.dirname(chained), { recursive: true });
  fs.writeFileSync(chained, "process.stdout.write('chained-hook-ran');\n");
  const result = await runHook('hooks/cursor/post-tool-use.mjs', {
    input: JSON.stringify({
      tool_name: 'Write',
      workspace_roots: [workspace],
      session_id: 'stdin-deadline-session',
      tool_input: { file_path: path.join(workspace, 'note.md') },
    }),
  });
  assert.equal(result.code, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), { permission: 'allow', agent_message: 'chained-hook-ran' });
});

test('the directive lifecycle boundary still forwards a valid payload', async (t) => {
  const workspace = tempDir(t, 'directive-boundary-');
  const received = path.join(workspace, 'received.json');
  const target = path.join(workspace, 'target.cjs');
  fs.writeFileSync(
    target,
    `let text = ''; process.stdin.on('data', (chunk) => { text += chunk; }).on('end', () => { require('node:fs').writeFileSync(${JSON.stringify(received)}, text); });\n`,
  );
  const result = await runHook('dist/hooks/claude/directive-lifecycle-boundary.js', {
    input: JSON.stringify({ sessionId: 'stdin-deadline-session', boundary: 'startup' }),
    env: { SPECKIT_DIRECTIVE_LIFECYCLE_BOUNDARY_TARGET: target },
  });
  assert.equal(result.code, 0, result.stderr);
  assert.deepEqual(JSON.parse(fs.readFileSync(received, 'utf8')), {
    session_id: 'stdin-deadline-session',
    boundary: 'startup',
  });
});

test('the Codex, Cursor and Devin session-start adapters still answer a valid payload', async () => {
  const sessionId = `stdin-deadline-${process.pid}`;
  const [codex, cursor, devin] = await Promise.all([
    runHook('dist/hooks/codex/session-start.js', {
      input: JSON.stringify({ hook_event_name: 'SessionStart', session_id: `${sessionId}-codex`, cwd: REPO_ROOT, source: 'startup' }),
    }),
    runHook('dist/hooks/cursor/session-start.js', {
      input: JSON.stringify({ hook_event_name: 'sessionStart', session_id: `${sessionId}-cursor`, workspace_roots: [REPO_ROOT] }),
    }),
    runHook('dist/hooks/devin/session-start.js', {
      input: JSON.stringify({ hook_event_name: 'SessionStart', session_id: `${sessionId}-devin`, cwd: REPO_ROOT, source: 'startup' }),
    }),
  ]);
  for (const result of [codex, devin]) {
    assert.equal(result.code, 0, result.stderr);
    assert.equal(JSON.parse(result.stdout).hookSpecificOutput.hookEventName, 'SessionStart');
  }
  assert.equal(cursor.code, 0, cursor.stderr);
  assert.equal(JSON.parse(cursor.stdout).permission, 'allow');
  assert.ok(typeof JSON.parse(cursor.stdout).agent_message === 'string');
});

test('the compiled reader still drops a payload past its byte cap without waiting for the deadline', async () => {
  const oversized = `{"session_id":"${'x'.repeat(1024 * 1024 + 16)}"}`;
  const [claude, codex] = await Promise.all([
    runHook('dist/hooks/claude/session-prime.js', { input: oversized }),
    runHook('dist/hooks/codex/session-start.js', { input: oversized }),
  ]);
  assert.equal(claude.code, 0, claude.stderr);
  assert.match(claude.stderr, /Hook stdin exceeded 1048576 bytes/);
  assert.equal(codex.code, 0, codex.stderr);
  assert.equal(codex.stdout, '');
  assert.ok(codex.elapsedMs < DEADLINE_FLOOR_MS, `the capped read took ${codex.elapsedMs} ms`);
});

// One row per short-deadline entry: the payload its host would send and the sign that
// the entry acted on it. The same rows drive the early-write and the late-write test,
// so a payload written in time is acted on and the identical payload written after the
// deadline is not, for every entry. The prompt entries forward to a stub advisor, and
// the classifiers act on a workspace whose gate state shows whether they read anything.
function shortHostPayloads(workspace, stub, sessionId) {
  const prompt = 'please edit the file src/app.js and fix the bug';
  const gateState = (name) => {
    const dir = path.join(workspace, '.skilled', 'skills', '.state', 'spec-gate');
    return fs.existsSync(dir) && fs.readdirSync(dir).some((file) => file.startsWith(Buffer.from(`${sessionId}-${name}`).toString('hex')));
  };
  return [
    {
      file: 'hooks/claude/spec-gate-classify.mjs',
      input: { session_id: `${sessionId}-claude-classify`, prompt, cwd: workspace, hook_event_name: 'UserPromptSubmit' },
      received: () => gateState('claude-classify'),
    },
    {
      file: 'hooks/codex/spec-gate-classify.mjs',
      input: { session_id: `${sessionId}-codex-classify`, prompt, cwd: workspace, hook_event_name: 'UserPromptSubmit' },
      received: () => gateState('codex-classify'),
    },
    {
      file: 'dist/hooks/claude/compact-inject.js',
      input: { session_id: `${sessionId}-compact`, trigger: 'manual' },
      received: (result) => /PreCompact triggered for session/.test(result.stderr),
    },
    {
      file: 'dist/hooks/claude/session-prime.js',
      input: { session_id: `${sessionId}-prime`, source: 'startup' },
      received: (result) => /## Session Context/.test(result.stdout),
    },
    {
      file: 'dist/hooks/claude/user-prompt-submit.js',
      input: { prompt: 'stdin-deadline prompt' },
      env: { SPECKIT_USER_PROMPT_TARGET: stub },
      received: (result) => /stub received stdin-deadline prompt/.test(result.stdout),
    },
    {
      file: 'dist/hooks/codex/session-start.js',
      input: { hook_event_name: 'SessionStart', session_id: `${sessionId}-codex`, cwd: REPO_ROOT, source: 'startup' },
      received: (result) => /"hookEventName":"SessionStart"/.test(result.stdout),
    },
    {
      file: 'dist/hooks/codex/user-prompt-submit.js',
      input: { hook_event_name: 'UserPromptSubmit', session_id: `${sessionId}-codex-prompt`, cwd: REPO_ROOT, prompt: 'stdin-deadline prompt' },
      env: { SPECKIT_USER_PROMPT_TARGET: stub },
      received: (result) => /stub received stdin-deadline prompt/.test(result.stdout),
    },
  ];
}

function shortHostFixture(t, prefix, label) {
  const workspace = tempDir(t, prefix);
  const stub = path.join(workspace, 'advisor-stub.cjs');
  fs.writeFileSync(
    stub,
    "let text = ''; process.stdin.on('data', (chunk) => { text += chunk; }).on('end', () => { process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: 'stub received ' + JSON.parse(text).prompt } })); });\n",
  );
  return shortHostPayloads(workspace, stub, `stdin-deadline-${process.pid}-${label}`);
}

// The Claude prompt shim cannot import the shared constant, so its copy is checked here.
test('the three copies of the short-host deadline agree', () => {
  const read = (rel) => fs.readFileSync(path.join(RUNTIME_ROOT, rel), 'utf8');
  const values = [
    read('hooks/shared-stdin.ts').match(/SHORT_HOST_STDIN_TIMEOUT_MS = (\d+)/)?.[1],
    read('hooks/lib/hook-adapter-shared.mjs').match(/SHORT_HOST_STDIN_TIMEOUT_MS = (\d+)/)?.[1],
    read('hooks/claude/user-prompt-submit.ts').match(/STDIN_DEADLINE_MS = (\d+)/)?.[1],
  ];
  assert.deepEqual(values, ['500', '500', '500']);
});

test('every short-deadline entry has a payload row', (t) => {
  const rows = shortHostFixture(t, 'short-host-rows-', 'rows').map((row) => row.file).sort();
  const shortHost = HOOKS.filter((hook) => hook.floor === SHORT_HOST_FLOOR_MS && !hook.args).map((hook) => hook.file).sort();
  assert.deepEqual(rows, shortHost);
});

test('every short-deadline entry still acts on a payload its host writes but never closes', async (t) => {
  const rows = shortHostFixture(t, 'short-host-payload-', 'open');
  const results = await Promise.all(rows.map((row) => runHook(row.file, { input: JSON.stringify(row.input), holdOpen: true, env: row.env })));
  for (const [index, row] of rows.entries()) {
    await t.test(row.file, () => {
      const result = results[index];
      assert.equal(result.signal, null, 'the hook must exit on its own, not be killed');
      assert.equal(result.code, 0, result.stderr);
      assert.ok(result.elapsedMs < SHORT_HOST_LATEST_EXIT_MS, `exited after ${result.elapsedMs} ms`);
      assert.ok(row.received(result), `the payload written in time was not acted on: ${result.stdout} ${result.stderr}`);
    });
  }
});

test('every short-deadline entry drops a payload its host writes after the deadline', async (t) => {
  const rows = shortHostFixture(t, 'short-host-late-', 'late');
  const results = await Promise.all(rows.map((row) => runHook(row.file, { input: JSON.stringify(row.input), holdOpen: true, writeDelayMs: 800, env: row.env })));
  for (const [index, row] of rows.entries()) {
    await t.test(row.file, () => {
      const result = results[index];
      assert.equal(result.signal, null, 'the hook must exit on its own, not be killed');
      assert.equal(result.code, 0, result.stderr);
      assert.ok(result.elapsedMs < SHORT_HOST_LATEST_EXIT_MS, `exited after ${result.elapsedMs} ms`);
      assert.ok(!row.received(result), `a payload written after the 500 ms deadline was acted on: ${result.stdout}`);
    });
  }
});
