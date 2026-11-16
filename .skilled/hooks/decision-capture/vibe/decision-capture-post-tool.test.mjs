// ───────────────────────────────────────────────────────────────────
// MODULE: Vibe Post-Tool Decision Capture Tests
// ───────────────────────────────────────────────────────────────────
// The adapter runs as a child process on the payload the runtime's post_tool
// envelope carries, so each case sees exactly what the hook leaves on disk when
// Vibe calls it. Every queue case runs in an isolated project directory.

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readdirSync, realpathSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { readQueue, toolSourceKey } from '../lib/capture-core.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ADAPTER = join(HERE, 'decision-capture-post-tool.mjs');

const SESSION_ID = '08b32b11-0d8a-bb26-2385-86bb47a2ca7d';
const CALL_ID = 'chatcmpl-tool-6f1c2a77000040008000000000000001';
const QUESTION = 'Which route?';

function hookEnv() {
  const env = { ...process.env };
  for (const name of [
    'SYSTEM_HOOKS_DISABLED',
    'MK_HOOKS_DISABLED',
    'SYSTEM_DECISION_CAPTURE_DISABLED',
    'MISTRAL_VIBE_SESSION_ROOT',
  ]) {
    delete env[name];
  }
  return env;
}

function withProject(run) {
  const rootDir = mkdtempSync(join(tmpdir(), 'vibe-capture-'));
  const projectDir = join(rootDir, 'project');
  mkdirSync(projectDir);
  try {
    return run(realpathSync(projectDir));
  } finally {
    rmSync(rootDir, { recursive: true, force: true });
  }
}

function entriesUnder(dir, prefix = '') {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const relativePath = join(prefix, entry.name);
    const fullPath = join(dir, entry.name);
    return entry.isDirectory()
      ? [relativePath, ...entriesUnder(fullPath, relativePath)]
      : [relativePath];
  });
}

function payloadFor(cwd, overrides = {}) {
  return {
    session_id: SESSION_ID,
    transcript_path: join(cwd, 'logs', 'session', 'fixture'),
    cwd,
    parent_session_id: null,
    hook_event_name: 'post_tool',
    tool_name: 'ask_user_question',
    tool_call_id: CALL_ID,
    tool_input: {
      questions: [
        {
          question: QUESTION,
          header: 'Route',
          options: [{ label: 'A', description: 'One hop.' }, { label: 'B', description: 'Two hops.' }],
          multiSelect: false,
        },
      ],
    },
    tool_status: 'success',
    tool_output: {
      answers: [{ question: QUESTION, answer: 'A', is_other: false }],
      cancelled: false,
    },
    tool_output_text: `${QUESTION}: A`,
    tool_error: null,
    duration_ms: 0,
    ...overrides,
  };
}

function runAdapter(input, cwd) {
  return spawnSync(process.execPath, [ADAPTER], {
    cwd,
    input: typeof input === 'string' ? input : JSON.stringify(input),
    encoding: 'utf8',
    env: hookEnv(),
    timeout: 15000,
  });
}

test('the measured payload queues one record keyed by the call id', () => {
  withProject((projectDir) => {
    const result = runAdapter(payloadFor(projectDir), projectDir);

    assert.equal(result.status, 0);
    assert.equal(result.stdout, '');

    const records = readQueue(projectDir, SESSION_ID);
    assert.equal(records.length, 1);
    assert.equal(records[0].key, toolSourceKey('vibe', SESSION_ID, CALL_ID, 0));
    assert.equal(records[0].runtime, 'vibe');
    assert.equal(records[0].question, QUESTION);
    assert.equal(records[0].answer, 'A');
    assert.deepEqual(records[0].options, ['A', 'B']);
    assert.equal(records[0].source, 'hook');
  });
});

test('a payload for another tool writes nothing', () => {
  withProject((projectDir) => {
    const result = runAdapter(
      payloadFor(projectDir, { tool_name: 'file_system.write_file' }),
      projectDir,
    );

    assert.equal(result.status, 0);
    assert.equal(result.stdout, '');
    assert.deepEqual(entriesUnder(projectDir), []);
  });
});

test('a group-qualified tool name is captured under the same key', () => {
  withProject((projectDir) => {
    const result = runAdapter(
      payloadFor(projectDir, { tool_name: 'ui.ask_user_question' }),
      projectDir,
    );

    assert.equal(result.status, 0);
    assert.equal(result.stdout, '');

    const records = readQueue(projectDir, SESSION_ID);
    assert.equal(records.length, 1);
    assert.equal(records[0].key, toolSourceKey('vibe', SESSION_ID, CALL_ID, 0));
    assert.equal(records[0].answer, 'A');
  });
});

test('malformed stdin exits silently and writes nothing', () => {
  withProject((projectDir) => {
    const result = runAdapter('not json', projectDir);

    assert.equal(result.status, 0);
    assert.equal(result.stdout, '');
    assert.deepEqual(entriesUnder(projectDir), []);
  });
});
