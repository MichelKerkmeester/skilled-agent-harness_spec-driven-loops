// ───────────────────────────────────────────────────────────────────
// MODULE: Codex Session Decision Sweep Tests
// ───────────────────────────────────────────────────────────────────
// Rollout lines exercise the reader against saved Codex tool-call shapes.

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { queueFile, readQueue, toolSourceKey } from '../lib/capture-core.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const SCRIPT = join(HERE, 'sweep-codex.mjs');
const FIXTURE = join(HERE, 'fixtures', 'codex-request-user-input.json');
const CHAT_FIXTURE = join(HERE, 'fixtures', 'codex-chat-rollout.jsonl');
const CLI_TIMEOUT_MS = 20000;

function withSandbox(run) {
  const rootDir = mkdtempSync(join(tmpdir(), 'codex-sweep-'));
  const projectDir = join(rootDir, 'project');
  const homeDir = join(rootDir, 'home');
  const codexHomeDir = join(rootDir, 'codex-home');
  mkdirSync(projectDir);
  mkdirSync(homeDir);
  mkdirSync(codexHomeDir);

  try {
    return run({ rootDir, projectDir, homeDir, codexHomeDir });
  } finally {
    rmSync(rootDir, { recursive: true, force: true });
  }
}

function runSweep(projectDir, homeDir, codexHomeDir, args) {
  return spawnSync(process.execPath, [SCRIPT, ...args], {
    cwd: projectDir,
    encoding: 'utf8',
    env: { ...process.env, HOME: homeDir, CODEX_HOME: codexHomeDir },
    timeout: CLI_TIMEOUT_MS,
  });
}

function readFixture() {
  return JSON.parse(readFileSync(FIXTURE, 'utf8'));
}

function writeTranscript(transcriptPath, lines) {
  const content = lines.map((line) => (
    typeof line === 'string' ? line : JSON.stringify(line)
  )).join('\n') + '\n';
  writeFileSync(transcriptPath, content);
  return content;
}

function fixtureCallId(fixture, caseName) {
  return fixture.cases.find((entry) => entry.case === caseName)?.call_id;
}

function requestCall(callId, questionId, question) {
  return {
    type: 'response_item',
    payload: {
      type: 'function_call',
      name: 'request_user_input',
      call_id: callId,
      arguments: JSON.stringify({
        questions: [{ id: questionId, question, options: [{ label: 'choice' }] }],
      }),
    },
  };
}

function functionCallOutput(callId, output) {
  return {
    type: 'response_item',
    payload: { type: 'function_call_output', call_id: callId, output },
  };
}

function messageItem(id, role, text) {
  return {
    type: 'response_item',
    payload: {
      type: 'message',
      id,
      role,
      content: [{ type: role === 'assistant' ? 'output_text' : 'input_text', text }],
    },
  };
}

// A tool call the sweep must treat as a turn boundary, not as a question request.
function shellCall(callId, toolCallType = 'function_call') {
  const payload = toolCallType === 'custom_tool_call'
    ? { type: toolCallType, name: 'shell', call_id: callId, input: '{"command":["ls"]}' }
    : { type: toolCallType, name: 'shell', call_id: callId, arguments: '{"command":["ls"]}' };
  return { type: 'response_item', payload };
}

function writeRollout(codexHomeDir, year, month, day, fileName, lines) {
  const transcriptPath = join(codexHomeDir, 'sessions', year, month, day, fileName);
  mkdirSync(join(codexHomeDir, 'sessions', year, month, day), { recursive: true });
  writeTranscript(transcriptPath, lines);
  return transcriptPath;
}

test('the fixture queues three answered questions with their recovered text', () => {
  withSandbox(({ projectDir, homeDir, codexHomeDir, rootDir }) => {
    const fixture = readFixture();
    const transcriptPath = join(rootDir, 'fixture.jsonl');
    writeTranscript(transcriptPath, fixture.lines);

    const run = runSweep(projectDir, homeDir, codexHomeDir, ['--transcript', transcriptPath]);
    assert.equal(run.status, 0, run.stderr);
    const result = JSON.parse(run.stdout);

    assert.equal(result.transcript, transcriptPath);
    assert.equal(result.session_id, 'codex-fixture-session');
    assert.equal(result.recovered, 3);
    assert.equal(result.pending.length, 3);
    assert.equal(
      readFileSync(queueFile(projectDir, result.session_id), 'utf8').trimEnd().split('\n').length,
      3,
    );

    const records = readQueue(projectDir, result.session_id);
    assert.deepEqual(records.map((record) => record.answer), ['pear', 'small, large', 'teal']);
    assert.deepEqual(
      records.map((record) => record.key),
      [
        toolSourceKey('codex', result.session_id, 'call_fixture_1', 0),
        toolSourceKey('codex', result.session_id, 'call_fixture_3', 0),
        toolSourceKey('codex', result.session_id, 'call_fixture_4', 0),
      ],
    );
    assert.ok(records.every((record) => record.runtime === 'codex'));
    assert.ok(records.every((record) => record.source === 'transcript'));
    assert.ok(records.every((record) => record.multi_select === false));
  });
});

test('an interrupted call and the async request queue nothing', () => {
  withSandbox(({ projectDir, homeDir, codexHomeDir, rootDir }) => {
    const fixture = readFixture();
    const interruptedId = fixtureCallId(fixture, 'interrupted with Esc');
    const asyncId = fixtureCallId(fixture, 'async variant that only accepts');
    const callIds = new Set([interruptedId, asyncId]);
    const lines = fixture.lines.filter((line) => (
      line.type === 'session_meta' || callIds.has(line.payload?.call_id)
    ));
    const transcriptPath = join(rootDir, 'ignored.jsonl');
    writeTranscript(transcriptPath, lines);

    const run = runSweep(projectDir, homeDir, codexHomeDir, ['--transcript', transcriptPath]);
    assert.equal(run.status, 0, run.stderr);
    assert.equal(run.stdout, '');
    assert.deepEqual(readQueue(projectDir, 'codex-fixture-session'), []);
    assert.equal(existsSync(queueFile(projectDir, 'codex-fixture-session')), false);
  });
});

test('an output containing plain error text queues nothing', () => {
  withSandbox(({ projectDir, homeDir, codexHomeDir, rootDir }) => {
    const transcriptPath = join(rootDir, 'error.jsonl');
    writeTranscript(transcriptPath, [
      { type: 'session_meta', payload: { id: 'codex-error-session', cwd: projectDir } },
      requestCall('call_error', 'choice', 'Which choice should I use?'),
      functionCallOutput('call_error', 'request failed'),
    ]);

    const run = runSweep(projectDir, homeDir, codexHomeDir, ['--transcript', transcriptPath]);
    assert.equal(run.status, 0, run.stderr);
    assert.equal(run.stdout, '');
    assert.deepEqual(readQueue(projectDir, 'codex-error-session'), []);
  });
});

test('a second run appends zero new answers', () => {
  withSandbox(({ projectDir, homeDir, codexHomeDir, rootDir }) => {
    const fixture = readFixture();
    const transcriptPath = join(rootDir, 'fixture.jsonl');
    writeTranscript(transcriptPath, fixture.lines);

    const first = runSweep(projectDir, homeDir, codexHomeDir, ['--transcript', transcriptPath]);
    assert.equal(first.status, 0, first.stderr);

    const second = runSweep(projectDir, homeDir, codexHomeDir, ['--transcript', transcriptPath]);
    assert.equal(second.status, 0, second.stderr);
    const result = JSON.parse(second.stdout);

    assert.equal(result.recovered, 0);
    assert.equal(result.pending.length, 3);
    assert.equal(readQueue(projectDir, result.session_id).length, 3);
  });
});

test('a malformed transcript line is skipped', () => {
  withSandbox(({ projectDir, homeDir, codexHomeDir, rootDir }) => {
    const fixture = readFixture();
    const transcriptPath = join(rootDir, 'malformed.jsonl');
    const lines = [...fixture.lines];
    lines.splice(1, 0, 'not valid JSON');
    writeTranscript(transcriptPath, lines);

    const run = runSweep(projectDir, homeDir, codexHomeDir, ['--transcript', transcriptPath]);
    assert.equal(run.status, 0, run.stderr);
    assert.equal(JSON.parse(run.stdout).recovered, 3);
  });
});

test('a missing transcript reports an error', () => {
  withSandbox(({ projectDir, homeDir, codexHomeDir, rootDir }) => {
    const run = runSweep(
      projectDir,
      homeDir,
      codexHomeDir,
      ['--transcript', join(rootDir, 'missing.jsonl')],
    );
    assert.equal(run.status, 1, run.stderr);
    const result = JSON.parse(run.stdout);
    assert.equal(typeof result.error, 'string');
    assert.ok(result.error.length > 0);
  });
});

test('the transcript bytes remain unchanged after a sweep', () => {
  withSandbox(({ projectDir, homeDir, codexHomeDir, rootDir }) => {
    const fixture = readFixture();
    const transcriptPath = join(rootDir, 'fixture.jsonl');
    writeTranscript(transcriptPath, fixture.lines);
    const before = readFileSync(transcriptPath);

    const run = runSweep(projectDir, homeDir, codexHomeDir, ['--transcript', transcriptPath]);
    assert.equal(run.status, 0, run.stderr);
    assert.deepEqual(readFileSync(transcriptPath), before);
  });
});

test('the newest rollout with a matching cwd is selected and supplies the fallback session id', () => {
  withSandbox(({ projectDir, homeDir, codexHomeDir, rootDir }) => {
    const processCwd = realpathSync(projectDir);
    const matchedPath = writeRollout(
      codexHomeDir,
      '2026',
      '11',
      '01',
      'rollout-2026-11-01T23-00-00-matched-session.jsonl',
      [
        { type: 'session_meta', payload: { cwd: processCwd } },
        requestCall('call_match', 'choice', 'Which choice should I use?'),
        functionCallOutput('call_match', '{"answers":{"choice":{"answers":["matched"]}}}'),
      ],
    );
    writeRollout(
      codexHomeDir,
      '2026',
      '11',
      '02',
      'rollout-2026-11-02T00-00-00-newer-session.jsonl',
      [{ type: 'session_meta', payload: { id: 'newer-session', cwd: join(rootDir, 'other-project') } }],
    );

    const run = runSweep(projectDir, homeDir, codexHomeDir, []);
    assert.equal(run.status, 0, run.stderr);
    const result = JSON.parse(run.stdout);

    assert.equal(result.transcript, matchedPath);
    assert.equal(result.session_id, 'matched-session');
    assert.equal(result.recovered, 1);
    assert.equal(readQueue(projectDir, result.session_id)[0].answer, 'matched');
  });
});

// Codex records the directory it started in, which can be a symlink to the real
// path the sweep's process sees.
test('a rollout recorded under a symlinked spelling of the project is selected', () => {
  withSandbox(({ projectDir, homeDir, codexHomeDir, rootDir }) => {
    const linkedProject = join(rootDir, 'linked-project');
    symlinkSync(projectDir, linkedProject);
    const matchedPath = writeRollout(
      codexHomeDir,
      '2026',
      '11',
      '01',
      'rollout-2026-11-01T23-00-00-linked-session.jsonl',
      [
        { type: 'session_meta', payload: { cwd: linkedProject } },
        requestCall('call_linked', 'choice', 'Which choice should I use?'),
        functionCallOutput('call_linked', '{"answers":{"choice":{"answers":["linked"]}}}'),
      ],
    );

    const run = runSweep(projectDir, homeDir, codexHomeDir, []);
    assert.equal(run.status, 0, run.stderr);
    assert.equal(JSON.parse(run.stdout).transcript, matchedPath);
  });
});

test('the chat fixture yields one codex candidate carrying its answer', () => {
  withSandbox(({ projectDir, homeDir, codexHomeDir }) => {
    const run = runSweep(projectDir, homeDir, codexHomeDir, ['--transcript', CHAT_FIXTURE]);
    assert.equal(run.status, 0, run.stderr);
    const result = JSON.parse(run.stdout);

    assert.equal(result.session_id, 'codex-chat-fixture-session');
    assert.equal(result.recovered, 0);
    assert.deepEqual(result.pending, []);
    assert.equal(result.chat_candidates.length, 1);
    assert.equal(result.chat_candidates_dropped, 0);

    const candidate = result.chat_candidates[0];
    assert.equal(candidate.kind, 'chat');
    assert.ok(candidate.key.startsWith('codex:'));
    assert.equal(candidate.question, 'Should the badge blink?');
    assert.equal(candidate.answer, 'No, keep it static.');
    assert.equal(candidate.question_turn_id, 'msg_assistant_question');
    assert.equal(candidate.answer_turn_id, 'msg_user_answer');
  });
});

test('a tool call between a question and a prompt yields no chat candidate', () => {
  withSandbox(({ projectDir, homeDir, codexHomeDir, rootDir }) => {
    const transcriptPath = join(rootDir, 'tool-between-turns.jsonl');
    writeTranscript(transcriptPath, [
      { type: 'session_meta', payload: { id: 'codex-tool-turn-session', cwd: projectDir } },
      messageItem('msg_question', 'assistant', 'Should the badge blink?'),
      shellCall('call_tool_between_turns'),
      messageItem('msg_answer', 'user', 'No, keep it static.'),
    ]);

    const run = runSweep(projectDir, homeDir, codexHomeDir, ['--transcript', transcriptPath]);
    assert.equal(run.status, 0, run.stderr);
    assert.equal(run.stdout, '');
  });
});

test('a custom tool call between a question and a prompt yields no chat candidate', () => {
  withSandbox(({ projectDir, homeDir, codexHomeDir, rootDir }) => {
    const transcriptPath = join(rootDir, 'custom-tool-between-turns.jsonl');
    writeTranscript(transcriptPath, [
      { type: 'session_meta', payload: { id: 'codex-custom-tool-session', cwd: projectDir } },
      messageItem('msg_question', 'assistant', 'Should the badge blink?'),
      shellCall('call_custom_between_turns', 'custom_tool_call'),
      messageItem('msg_answer', 'user', 'No, keep it static.'),
    ]);

    const run = runSweep(projectDir, homeDir, codexHomeDir, ['--transcript', transcriptPath]);
    assert.equal(run.status, 0, run.stderr);
    assert.equal(run.stdout, '');
  });
});

test('an injected user message starting with "<" is not read as a prompt', () => {
  withSandbox(({ projectDir, homeDir, codexHomeDir, rootDir }) => {
    const transcriptPath = join(rootDir, 'injected-context.jsonl');
    writeTranscript(transcriptPath, [
      { type: 'session_meta', payload: { id: 'codex-injected-session', cwd: projectDir } },
      messageItem('msg_question', 'assistant', 'Should the badge blink?'),
      messageItem(
        'msg_environment',
        'user',
        '<environment_context>\n  <cwd>/workspace/project</cwd>\n</environment_context>',
      ),
      messageItem('msg_answer', 'user', 'No, keep it static.'),
    ]);

    const run = runSweep(projectDir, homeDir, codexHomeDir, ['--transcript', transcriptPath]);
    assert.equal(run.status, 0, run.stderr);
    const result = JSON.parse(run.stdout);

    assert.equal(result.chat_candidates.length, 1);
    assert.equal(result.chat_candidates[0].answer, 'No, keep it static.');
    assert.equal(result.chat_candidates[0].answer_turn_id, 'msg_answer');
  });
});
