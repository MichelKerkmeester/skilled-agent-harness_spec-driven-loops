// ───────────────────────────────────────────────────────────────────
// MODULE: Devin PostToolUse Decision Capture Tests
// ───────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { devinAnswerRecords } from '../bin/sweep-devin.mjs';
import { appendRecords, queueFile, readQueue } from '../lib/capture-core.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const HERE = dirname(fileURLToPath(import.meta.url));
const ADAPTER = join(HERE, 'ask-capture-posttooluse.mjs');
const FIXTURE = join(HERE, 'fixtures', 'devin-posttooluse-ask-user-question.json');
const SESSION_ID = 'devin-fixture-session';
const TOOL_USE_ID = 'ask_user_question:0#fixture0001';
// Devin's call id carries `#`, which the decision-record writer refuses in a key,
// so the queue holds it with that character replaced by a dot.
const RECORD_KEY = `devin:${SESSION_ID}:${TOOL_USE_ID.replace('#', '.')}:0`;
const CAPTURED_AT = '2026-11-02T00:00:00.000Z';

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function withProject(run) {
  const root = mkdtempSync(join(tmpdir(), 'devin-capture-hook-'));
  const projectDir = join(root, 'project');
  const hookCwd = join(root, 'hook-cwd');
  mkdirSync(projectDir);
  mkdirSync(hookCwd);
  try {
    return run(projectDir, hookCwd);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

function hookEnv(projectDir, extra = {}) {
  const env = { ...process.env };
  for (const name of Object.keys(env)) {
    if (name.endsWith('_DISABLED')) delete env[name];
  }
  return {
    ...env,
    DEVIN_PROJECT_DIR: projectDir,
    HOOK_FLAGS_CONFIG: join(projectDir, 'hook-flags.env'),
    ...extra,
  };
}

function runAdapter(input, projectDir, hookCwd, extraEnv = {}) {
  return spawnSync(process.execPath, [ADAPTER], {
    cwd: hookCwd,
    input: typeof input === 'string' ? input : JSON.stringify(input),
    encoding: 'utf8',
    env: hookEnv(projectDir, extraEnv),
    timeout: 15000,
  });
}

function fixturePayload() {
  return JSON.parse(readFileSync(FIXTURE, 'utf8'));
}

function equivalentTranscript(payload) {
  return {
    steps: [
      {
        tool_calls: [
          {
            function_name: 'ask_user_question',
            tool_call_id: payload.tool_use_id,
            arguments: payload.tool_input,
          },
        ],
        observation: {
          results: [
            {
              source_call_id: payload.tool_use_id,
              content: payload.tool_response.output,
            },
          ],
        },
      },
    ],
  };
}

function sweepRecords(payload) {
  return devinAnswerRecords({
    transcript: equivalentTranscript(payload),
    sessionId: payload.session_id,
    now: CAPTURED_AT,
  });
}

function assertSilentSuccess(result) {
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, '');
  assert.equal(result.stderr, '');
}

function assertSingleRecord(projectDir, source) {
  const records = readQueue(projectDir, SESSION_ID);
  assert.equal(records.length, 1);
  assert.equal(records[0].key, RECORD_KEY);
  assert.equal(records[0].answer, 'pear');
  assert.equal(records[0].source, source);
  assert.equal(
    readFileSync(queueFile(projectDir, SESSION_ID), 'utf8').trim().split('\n').length,
    1,
  );
}

function assertNoRecord(projectDir) {
  assert.deepEqual(readdirSync(projectDir), []);
  assert.equal(existsSync(queueFile(projectDir, SESSION_ID)), false);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. TESTS
// ─────────────────────────────────────────────────────────────────────────────

test('queues the answered question and deduplicates later transcript recovery', () => {
  withProject((projectDir, hookCwd) => {
    const payload = fixturePayload();
    const result = runAdapter(payload, projectDir, hookCwd);
    assertSilentSuccess(result);
    assertSingleRecord(projectDir, 'hook');

    const recovered = sweepRecords(payload);
    assert.equal(recovered.length, 1);
    assert.equal(recovered[0].answer, 'pear');
    assert.deepEqual(appendRecords(projectDir, SESSION_ID, recovered), {
      appended: 0,
      skipped: 1,
    });
    assertSingleRecord(projectDir, 'hook');
  });
});

test('keeps one queue line when transcript recovery runs before the hook', () => {
  withProject((projectDir, hookCwd) => {
    const payload = fixturePayload();
    const recovered = sweepRecords(payload);
    assert.equal(recovered.length, 1);
    assert.equal(appendRecords(projectDir, SESSION_ID, recovered).appended, 1);

    const result = runAdapter(payload, projectDir, hookCwd);
    assertSilentSuccess(result);
    assertSingleRecord(projectDir, 'transcript');
  });
});

test('is silent when decision capture is disabled', () => {
  withProject((projectDir, hookCwd) => {
    const result = runAdapter(fixturePayload(), projectDir, hookCwd, {
      SYSTEM_DECISION_CAPTURE_DISABLED: '1',
    });
    assertSilentSuccess(result);
    assertNoRecord(projectDir);
  });
});

test('is silent for malformed JSON', () => {
  withProject((projectDir, hookCwd) => {
    const result = runAdapter('{', projectDir, hookCwd);
    assertSilentSuccess(result);
    assertNoRecord(projectDir);
  });
});

test('ignores another tool name', () => {
  withProject((projectDir, hookCwd) => {
    const payload = { ...fixturePayload(), tool_name: 'exec' };
    const result = runAdapter(payload, projectDir, hookCwd);
    assertSilentSuccess(result);
    assertNoRecord(projectDir);
  });
});

test('ignores refusal text in the tool response', () => {
  withProject((projectDir, hookCwd) => {
    const payload = fixturePayload();
    payload.tool_response.output = 'The question was refused.';
    const result = runAdapter(payload, projectDir, hookCwd);
    assertSilentSuccess(result);
    assertNoRecord(projectDir);
  });
});
