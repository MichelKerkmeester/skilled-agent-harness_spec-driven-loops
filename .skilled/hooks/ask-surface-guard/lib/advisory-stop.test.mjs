// ───────────────────────────────────────────────────────────────────
// MODULE: Ask Surface Advisory Stop Tests
// ───────────────────────────────────────────────────────────────────

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const menu = JSON.parse(readFileSync(path.join(here, '..', 'fixtures', 'prose-menu-lettered.json'), 'utf8')).lastMessage;

const workDir = mkdtempSync(path.join(os.tmpdir(), 'ask-surface-advisory-cwd-'));
process.on('exit', () => rmSync(workDir, { recursive: true, force: true }));

function run(runtime, payload, env = {}) {
  const result = spawnSync(process.execPath, [path.join(here, '..', runtime, 'ask-surface-stop.cjs')], {
    cwd: workDir,
    input: typeof payload === 'string' ? payload : JSON.stringify(payload),
    env: { ...process.env, HOOK_FLAGS_CONFIG: '/nonexistent/hook-flags.env', SYSTEM_ASK_SURFACE_DISABLED: '', SYSTEM_HOOKS_DISABLED: '', ...env },
    encoding: 'utf8',
  });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

for (const [runtime, tool] of [['codex', 'request_user_input'], ['devin', 'ask_user_question']]) {
  test(`${runtime}: a prose menu logs an advisory naming ${tool} and never blocks`, () => {
    const { status, stdout, stderr } = run(runtime, { stop_hook_active: false, last_assistant_message: menu });
    assert.equal(status, 0);
    assert.equal(stdout, '');
    assert.match(stderr, new RegExp(tool));
    const fires = readFileSync(path.join(workDir, '.skilled/skills/.state/ask-surface/fires.jsonl'), 'utf8');
    assert.match(fires, new RegExp(`"runtime":"${runtime}","mode":"advise"`));
  });

  test(`${runtime}: an ordinary reply, the kill switch and a bad payload stay silent`, () => {
    for (const [payload, env] of [
      [{ last_assistant_message: 'Done. Anything else?' }, {}],
      [{ last_assistant_message: menu }, { SYSTEM_ASK_SURFACE_DISABLED: '1' }],
      ['not json', {}],
    ]) {
      const { status, stdout, stderr } = run(runtime, payload, env);
      assert.deepEqual({ status, stdout, stderr }, { status: 0, stdout: '', stderr: '' });
    }
  });
}
