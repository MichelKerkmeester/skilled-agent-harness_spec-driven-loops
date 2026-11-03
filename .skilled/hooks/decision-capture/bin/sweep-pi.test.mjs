// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Session Decision Sweep Tests
// ───────────────────────────────────────────────────────────────────
// Pi's recorded session lines exercise the reader against its actual tool-call
// and tool-result shape. Every CLI case uses an isolated project and temporary HOME.

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { queueFile, readQueue, toolSourceKey } from '../lib/capture-core.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const SCRIPT = join(HERE, 'sweep-pi.mjs');
const FIXTURE = join(HERE, 'fixtures', 'pi-ask-user-question.json');
const CHAT_FIXTURE = join(HERE, 'fixtures', 'pi-chat-session.jsonl');
const NOW = '2026-11-02T12:00:00.000Z';
const CLI_TIMEOUT_MS = 20000;

function withSandbox(run) {
  const rootDir = mkdtempSync(join(tmpdir(), 'pi-sweep-'));
  const projectDir = join(rootDir, 'project');
  const homeDir = join(rootDir, 'home');
  mkdirSync(projectDir);
  mkdirSync(homeDir);

  try {
    return run({ rootDir, projectDir, homeDir });
  } finally {
    rmSync(rootDir, { recursive: true, force: true });
  }
}

function runSweep(projectDir, homeDir, args) {
  return spawnSync(process.execPath, [SCRIPT, ...args], {
    cwd: projectDir,
    encoding: 'utf8',
    env: { ...process.env, HOME: homeDir },
    timeout: CLI_TIMEOUT_MS,
  });
}

function readFixture() {
  return JSON.parse(readFileSync(FIXTURE, 'utf8'));
}

function writeTranscript(transcriptPath, lines) {
  writeFileSync(transcriptPath, lines.map((line) => JSON.stringify(line)).join('\n') + '\n');
}

function fixtureCallId(fixture, caseName) {
  return fixture.cases.find((entry) => entry.case === caseName)?.call_id;
}

function sessionDirectory(homeDir, projectDir) {
  const projectKey = realpathSync(projectDir).replace(/^\/+/, '').replaceAll('/', '-');
  return join(homeDir, '.pi', 'agent', 'sessions', '--' + projectKey + '--');
}

test('the fixture queues four answers with their original text', () => {
  withSandbox(({ projectDir, homeDir, rootDir }) => {
    const fixture = readFixture();
    const transcriptPath = join(rootDir, 'fixture.jsonl');
    writeTranscript(transcriptPath, fixture.lines);

    const run = runSweep(projectDir, homeDir, ['--transcript', transcriptPath]);
    assert.equal(run.status, 0, run.stderr);
    const result = JSON.parse(run.stdout);

    assert.equal(result.transcript, transcriptPath);
    assert.equal(result.session_id, 'pi-fixture-session');
    assert.equal(result.recovered, 4);
    assert.equal(result.pending.length, 4);
    assert.deepEqual(result.chat_candidates, []);

    const records = readQueue(projectDir, result.session_id);
    assert.equal(
      readFileSync(queueFile(projectDir, result.session_id), 'utf8').trimEnd().split('\n').length,
      4,
    );
    assert.deepEqual(
      records.map((record) => record.answer),
      ['green', 'small, large', 'teal', 'pear'],
    );
    assert.equal(records[1].multi_select, true);
    assert.ok(records.every((record) => record.runtime === 'pi'));
    assert.ok(records.every((record) => record.source === 'transcript'));
    assert.deepEqual(
      records.map((record) => record.key),
      [
        toolSourceKey('pi', result.session_id, 'call_fixture_1', 0),
        toolSourceKey('pi', result.session_id, 'call_fixture_3', 0),
        toolSourceKey('pi', result.session_id, 'call_fixture_5', 0),
        toolSourceKey('pi', result.session_id, 'call_fixture_6', 0),
      ],
    );
  });
});

test('a cancelled result on either question tool queues nothing', () => {
  withSandbox(({ projectDir, homeDir, rootDir }) => {
    const fixture = readFixture();
    const callIds = [
      fixtureCallId(fixture, 'a different tool named question'),
      fixtureCallId(fixture, 'cancelled with Esc'),
    ];
    const lines = fixture.lines.filter((line) =>
      callIds.includes(line.message?.toolCallId)
      || line.message?.content?.some((item) => callIds.includes(item.id)),
    );

    const transcriptPath = join(rootDir, 'ignored.jsonl');
    writeTranscript(transcriptPath, [fixture.lines[0], ...lines]);

    const run = runSweep(projectDir, homeDir, ['--transcript', transcriptPath]);
    assert.equal(run.status, 0, run.stderr);
    assert.equal(run.stdout, '');
  });
});

// The result shape is the one pi-plan-build's `question` tool wrote in a live
// session: one entry per question, chosen labels in an `answers` array.
test('an answer through the pi-plan-build question tool queues its label', () => {
  withSandbox(({ projectDir, homeDir, rootDir }) => {
    const fixture = readFixture();
    const callId = 'call_plan_build_1';
    const question = 'Which colour should the status badge use?';
    const transcriptPath = join(rootDir, 'plan-build.jsonl');
    writeTranscript(transcriptPath, [
      fixture.lines[0],
      {
        type: 'message',
        message: {
          role: 'assistant',
          content: [{
            type: 'toolCall',
            id: callId,
            name: 'question',
            arguments: {
              questions: [{
                question,
                header: 'Badge colour',
                options: [{ label: 'Amber' }, { label: 'Teal' }, { label: 'Slate' }],
                multiple: false,
                custom: false,
              }],
            },
          }],
        },
      },
      {
        type: 'message',
        message: {
          role: 'toolResult',
          toolCallId: callId,
          toolName: 'question',
          details: {
            answers: [{ question, header: 'Badge colour', answers: ['Amber'], custom: false }],
          },
          isError: false,
        },
      },
    ]);

    const run = runSweep(projectDir, homeDir, ['--transcript', transcriptPath]);
    assert.equal(run.status, 0, run.stderr);
    const records = readQueue(projectDir, fixture.lines[0].id);
    assert.equal(records.length, 1);
    assert.equal(records[0].question, question);
    assert.equal(records[0].answer, 'Amber');
    assert.deepEqual(records[0].options, ['Amber', 'Teal', 'Slate']);
    assert.equal(records[0].multi_select, false);
  });
});

test('an answered result marked as an error queues nothing', () => {
  withSandbox(({ projectDir, homeDir, rootDir }) => {
    const fixture = readFixture();
    const answeredId = 'call_fixture_6';
    const answeredCall = fixture.lines.find((line) =>
      line.message?.content?.some((item) => item.id === answeredId),
    );
    const answeredResult = fixture.lines.find(
      (line) => line.message?.toolCallId === answeredId,
    );
    answeredResult.message.isError = true;

    const transcriptPath = join(rootDir, 'rejected.jsonl');
    writeTranscript(transcriptPath, [fixture.lines[0], answeredCall, answeredResult]);

    const run = runSweep(projectDir, homeDir, ['--transcript', transcriptPath]);
    assert.equal(run.status, 0, run.stderr);
    assert.equal(run.stdout, '');
  });
});

test('a second run appends zero new answers', () => {
  withSandbox(({ projectDir, homeDir, rootDir }) => {
    const fixture = readFixture();
    const transcriptPath = join(rootDir, 'fixture.jsonl');
    writeTranscript(transcriptPath, fixture.lines);

    const first = runSweep(projectDir, homeDir, ['--transcript', transcriptPath]);
    assert.equal(first.status, 0, first.stderr);

    const second = runSweep(projectDir, homeDir, ['--transcript', transcriptPath]);
    assert.equal(second.status, 0, second.stderr);
    const result = JSON.parse(second.stdout);

    assert.equal(result.recovered, 0);
    assert.equal(result.pending.length, 4);
    assert.equal(readQueue(projectDir, result.session_id).length, 4);
  });
});

test('a malformed transcript line is skipped', () => {
  withSandbox(({ projectDir, homeDir, rootDir }) => {
    const fixture = readFixture();
    const transcriptPath = join(rootDir, 'malformed.jsonl');
    const lines = [...fixture.lines];
    lines.splice(1, 0, 'not valid JSON');
    writeFileSync(
      transcriptPath,
      lines.map((line) => typeof line === 'string' ? line : JSON.stringify(line)).join('\n') + '\n',
    );

    const run = runSweep(projectDir, homeDir, ['--transcript', transcriptPath]);
    assert.equal(run.status, 0, run.stderr);
    assert.equal(JSON.parse(run.stdout).recovered, 4);
  });
});

test('a missing transcript reports an error', () => {
  withSandbox(({ projectDir, homeDir, rootDir }) => {
    const run = runSweep(projectDir, homeDir, ['--transcript', join(rootDir, 'missing.jsonl')]);
    assert.equal(run.status, 1, run.stderr);
    const result = JSON.parse(run.stdout);
    assert.equal(typeof result.error, 'string');
    assert.ok(result.error.length > 0);
  });
});

test('an empty readable transcript exits cleanly without output', () => {
  withSandbox(({ projectDir, homeDir }) => {
    const run = runSweep(projectDir, homeDir, ['--transcript', '/dev/null']);
    assert.equal(run.status, 0, run.stderr);
    assert.equal(run.stdout, '');
  });
});

test('the transcript bytes remain unchanged after a sweep', () => {
  withSandbox(({ projectDir, homeDir, rootDir }) => {
    const fixture = readFixture();
    const transcriptPath = join(rootDir, 'fixture.jsonl');
    writeTranscript(transcriptPath, fixture.lines);
    const before = readFileSync(transcriptPath);

    const run = runSweep(projectDir, homeDir, ['--transcript', transcriptPath]);
    assert.equal(run.status, 0, run.stderr);
    assert.deepEqual(readFileSync(transcriptPath), before);
  });
});

test('the newest session file is selected from the temporary HOME', () => {
  withSandbox(({ projectDir, homeDir }) => {
    const fixture = readFixture();
    const sessionsDir = sessionDirectory(homeDir, projectDir);
    mkdirSync(sessionsDir, { recursive: true });

    const older = structuredClone(fixture.lines);
    older[0].id = 'pi-older-session';
    older[0].cwd = realpathSync(projectDir);
    const newest = structuredClone(fixture.lines);
    newest[0].id = 'pi-newest-session';
    newest[0].cwd = realpathSync(projectDir);
    writeTranscript(join(sessionsDir, '2026-11-01T00-00-00.000Z_old.jsonl'), older);
    const newestPath = join(sessionsDir, '2026-11-02T00-00-00.000Z_newest.jsonl');
    writeTranscript(newestPath, newest);

    const run = runSweep(projectDir, homeDir, []);
    assert.equal(run.status, 0, run.stderr);
    const result = JSON.parse(run.stdout);

    assert.equal(result.transcript, newestPath);
    assert.equal(result.session_id, 'pi-newest-session');
    assert.equal(result.recovered, 4);
  });
});

// `/work/foo-bar` and `/work/foo/bar` flatten to the same session directory,
// so a newer session from the other project must not be picked.
test('a newer session recorded for another project is skipped', () => {
  withSandbox(({ projectDir, homeDir, rootDir }) => {
    const fixture = readFixture();
    const sessionsDir = sessionDirectory(homeDir, projectDir);
    mkdirSync(sessionsDir, { recursive: true });

    const own = structuredClone(fixture.lines);
    own[0].id = 'pi-own-session';
    own[0].cwd = realpathSync(projectDir);
    const other = structuredClone(fixture.lines);
    other[0].id = 'pi-other-project';
    other[0].cwd = join(rootDir, 'other-project');
    const ownPath = join(sessionsDir, '2026-11-01T00-00-00.000Z_own.jsonl');
    writeTranscript(ownPath, own);
    writeTranscript(join(sessionsDir, '2026-11-02T00-00-00.000Z_other.jsonl'), other);

    const run = runSweep(projectDir, homeDir, []);
    assert.equal(run.status, 0, run.stderr);
    const result = JSON.parse(run.stdout);
    assert.equal(result.transcript, ownPath);
    assert.equal(result.session_id, 'pi-own-session');
  });
});

test('the real Pi chat fixture yields one candidate with its typed answer', () => {
  withSandbox(({ projectDir, homeDir }) => {
    const run = runSweep(projectDir, homeDir, ['--transcript', CHAT_FIXTURE]);
    assert.equal(run.status, 0, run.stderr);
    const result = JSON.parse(run.stdout);

    assert.equal(result.session_id, 'd3cca2c1-d036-4116-a342-46c3780c1c7c');
    assert.equal(result.recovered, 0);
    assert.deepEqual(result.pending, []);
    assert.equal(result.chat_candidates.length, 1);
    assert.equal(result.chat_candidates_dropped, 0);

    const candidate = result.chat_candidates[0];
    assert.ok(candidate.key.startsWith('pi:'));
    assert.equal(candidate.question, 'Should the badge blink?');
    assert.equal(candidate.answer, 'No, keep it static.');
  });
});

test('a tool turn between a question and a prompt yields no chat candidate', () => {
  withSandbox(({ projectDir, homeDir, rootDir }) => {
    const transcriptPath = join(rootDir, 'tool-between-turns.jsonl');
    writeTranscript(transcriptPath, [
      {
        type: 'session',
        id: 'pi-tool-turn-session',
        version: 3,
        timestamp: NOW,
        cwd: '[PROJECT]',
      },
      {
        type: 'message',
        id: 'assistant-question',
        message: {
          role: 'assistant',
          content: [{ type: 'text', text: 'Should the badge blink?' }],
        },
      },
      {
        type: 'message',
        id: 'assistant-tool',
        message: {
          role: 'assistant',
          content: [{
            type: 'toolCall',
            id: 'call_tool_between_turns',
            name: 'probe',
            arguments: {},
          }],
        },
      },
      {
        type: 'message',
        id: 'user-prompt',
        message: {
          role: 'user',
          content: [{ type: 'text', text: 'No, keep it static.' }],
        },
      },
    ]);

    const run = runSweep(projectDir, homeDir, ['--transcript', transcriptPath]);
    assert.equal(run.status, 0, run.stderr);
    assert.equal(run.stdout, '');
  });
});
