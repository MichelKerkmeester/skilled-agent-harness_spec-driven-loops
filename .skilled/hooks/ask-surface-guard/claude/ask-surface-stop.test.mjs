// ───────────────────────────────────────────────────────────────────
// MODULE: Claude Ask Surface Stop Guard Tests
// ───────────────────────────────────────────────────────────────────

import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const ADAPTER = path.join(here, 'ask-surface-stop.cjs');
const menu = JSON.parse(readFileSync(path.join(here, '..', 'fixtures', 'prose-menu-lettered.json'), 'utf8')).lastMessage;

const workDir = mkdtempSync(path.join(os.tmpdir(), 'ask-surface-claude-cwd-'));
process.on('exit', () => rmSync(workDir, { recursive: true, force: true }));

function run(payload, env = {}) {
  const result = spawnSync(process.execPath, [ADAPTER], {
    cwd: workDir,
    input: typeof payload === 'string' ? payload : JSON.stringify(payload),
    env: { ...process.env, HOOK_FLAGS_CONFIG: '/nonexistent/hook-flags.env', SYSTEM_ASK_SURFACE_DISABLED: '', SYSTEM_HOOKS_DISABLED: '', ...env },
    encoding: 'utf8',
  });
  return { status: result.status, stdout: result.stdout.trim() };
}

function runWithOpenStdin() {
  return new Promise((resolve) => {
    const started = Date.now();
    const child = spawn(process.execPath, [ADAPTER], {
      cwd: workDir,
      env: {
        ...process.env,
        HOOK_FLAGS_CONFIG: '/nonexistent/hook-flags.env',
        SYSTEM_ASK_SURFACE_DISABLED: '',
        SYSTEM_HOOKS_DISABLED: '',
      },
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    let stdout = '';
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    const killer = setTimeout(() => child.kill('SIGKILL'), 10000);
    child.on('close', (status, signal) => {
      clearTimeout(killer);
      resolve({ status, signal, stdout, elapsedMs: Date.now() - started });
    });
  });
}

function transcript(t, lines) {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'ask-surface-claude-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const file = path.join(dir, 'session.jsonl');
  writeFileSync(file, `${lines.map((line) => JSON.stringify(line)).join('\n')}\n`);
  return file;
}

test('a prose menu with no ask call is blocked once with the AskUserQuestion instruction', () => {
  const { status, stdout } = run({ stop_hook_active: false, last_assistant_message: menu });
  assert.equal(status, 0);
  const envelope = JSON.parse(stdout);
  assert.equal(envelope.decision, 'block');
  assert.match(envelope.reason, /AskUserQuestion/);
  const fires = readFileSync(path.join(workDir, '.skilled/skills/.state/ask-surface/fires.jsonl'), 'utf8').trim().split('\n');
  assert.equal(JSON.parse(fires.at(-1)).mode, 'reprompt');
});

test('a re-entrant stop after a block ends the turn', () => {
  assert.deepEqual(run({ stop_hook_active: true, last_assistant_message: menu }), { status: 0, stdout: '' });
});

test('the kill switch ends the turn', () => {
  const result = run({ stop_hook_active: false, last_assistant_message: menu }, { SYSTEM_ASK_SURFACE_DISABLED: '1' });
  assert.deepEqual(result, { status: 0, stdout: '' });
});

test('a malformed payload ends the turn', () => {
  assert.deepEqual(run('not json'), { status: 0, stdout: '' });
});

test('open stdin reaches the deadline and ends the turn without a block decision', async () => {
  const result = await runWithOpenStdin();
  assert.equal(result.signal, null, 'the hook must exit on its own, not be killed');
  assert.equal(result.status, 0);
  assert.equal(result.stdout, '');
  assert.ok(result.elapsedMs >= 2900, `exited after ${result.elapsedMs} ms, before the stdin deadline`);
  assert.ok(result.elapsedMs < 8000, `exited after ${result.elapsedMs} ms, past the deadline plus margin`);
});

test('an AskUserQuestion call earlier in the turn passes the menu', (t) => {
  const file = transcript(t, [
    { type: 'user', message: { content: 'Pick a folder' } },
    { type: 'assistant', message: { content: [{ type: 'tool_use', id: 't1', name: 'AskUserQuestion', input: {} }] } },
    { type: 'user', message: { content: [{ type: 'tool_result', tool_use_id: 't1', content: 'B' }] } },
    { type: 'assistant', message: { content: [{ type: 'text', text: menu }] } },
  ]);
  assert.deepEqual(run({ stop_hook_active: false, transcript_path: file, last_assistant_message: menu }), { status: 0, stdout: '' });
});

test('a slash command opens a turn, so an ask call before it does not excuse this one', (t) => {
  const file = transcript(t, [
    { type: 'user', message: { content: 'first task' } },
    { type: 'assistant', message: { content: [{ type: 'tool_use', id: 't1', name: 'AskUserQuestion', input: {} }] } },
    { type: 'user', message: { content: '<command-message>speckit:plan</command-message>\n<command-name>/speckit:plan</command-name>' } },
    { type: 'user', message: { content: [{ type: 'text', text: '<system-reminder>harness note</system-reminder>' }] } },
    { type: 'assistant', message: { content: [{ type: 'text', text: menu }] } },
  ]);
  const envelope = JSON.parse(run({ stop_hook_active: false, transcript_path: file }).stdout);
  assert.equal(envelope.decision, 'block');
});

test('an ask call in an earlier turn does not excuse this one', (t) => {
  const file = transcript(t, [
    { type: 'assistant', message: { content: [{ type: 'tool_use', id: 't1', name: 'AskUserQuestion', input: {} }] } },
    { type: 'user', message: { content: 'next task' } },
    { type: 'assistant', message: { content: [{ type: 'text', text: menu }] } },
  ]);
  const envelope = JSON.parse(run({ stop_hook_active: false, transcript_path: file }).stdout);
  assert.equal(envelope.decision, 'block');
});
