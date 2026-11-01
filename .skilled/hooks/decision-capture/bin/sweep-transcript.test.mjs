// ───────────────────────────────────────────────────────────────────
// MODULE: Claude Transcript Decision Sweep Tests
// ───────────────────────────────────────────────────────────────────
// Every test writes its own transcript into a throwaway project directory, so
// the sweep reads a fixture and the queue lands where the test can inspect it.
// Nothing here reads a real Claude transcript. The CLI test is the only one that
// spawns a process: it proves the entry point reads the transcript argument and
// prints the same result the function returns.

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  appendRecords,
  chatSourceKey,
  normalizeAskUserQuestion,
  queueDir,
  queueFile,
  readQueue,
} from '../lib/capture-core.mjs';
import { sweepTranscript } from './sweep-transcript.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const SCRIPT = join(HERE, 'sweep-transcript.mjs');
const SESSION = 'session-1';
const NOW = '2026-11-01T12:00:00.000Z';

const BADGE_QUESTION = 'Which colour should the badge use?';
const OWNER_QUESTION = 'Which store owns the delivery queue?';
const NUDGE_QUESTION = 'Where should the nudge land?';

const ROUND_ONE = [
  {
    question: BADGE_QUESTION,
    header: 'Badge',
    options: [{ label: 'Amber' }, { label: 'Teal' }],
    multiSelect: false,
  },
  {
    question: OWNER_QUESTION,
    header: 'Owner',
    options: [{ label: 'core' }, { label: 'cli' }],
    multiSelect: false,
  },
];
const ROUND_ONE_ANSWERS = { [BADGE_QUESTION]: 'Amber', [OWNER_QUESTION]: 'core' };

const ROUND_TWO = [
  {
    question: NUDGE_QUESTION,
    header: 'Nudge',
    options: [{ label: 'Stop' }, { label: 'Save' }],
    multiSelect: false,
  },
];
const ROUND_TWO_ANSWERS = { [NUDGE_QUESTION]: 'Stop' };

function withProject(run) {
  const projectDir = mkdtempSync(join(tmpdir(), 'decision-sweep-'));
  try {
    return run(projectDir);
  } finally {
    rmSync(projectDir, { recursive: true, force: true });
  }
}

function writeTranscript(projectDir, name, entries) {
  const filePath = join(projectDir, name);
  const body = entries.map((entry) => JSON.stringify(entry)).join('\n');
  writeFileSync(filePath, `${body}\n`);
  return filePath;
}

function assistantText(uuid, text) {
  return {
    type: 'assistant',
    uuid,
    sessionId: SESSION,
    message: { role: 'assistant', content: [{ type: 'text', text }] },
  };
}

function assistantToolUse(uuid, toolUseId, questions) {
  return {
    type: 'assistant',
    uuid,
    sessionId: SESSION,
    message: {
      role: 'assistant',
      content: [{ type: 'tool_use', id: toolUseId, name: 'AskUserQuestion', input: { questions } }],
    },
  };
}

function toolResult(uuid, toolUseId, answers) {
  return {
    type: 'user',
    uuid,
    sessionId: SESSION,
    message: {
      role: 'user',
      content: [{ type: 'tool_result', tool_use_id: toolUseId, content: 'Answered' }],
    },
    toolUseResult: { answers },
  };
}

function userPrompt(uuid, text) {
  return {
    type: 'user',
    uuid,
    sessionId: SESSION,
    message: { role: 'user', content: text },
  };
}

function twoRounds() {
  return [
    assistantToolUse('a1', 't1', ROUND_ONE),
    toolResult('u1', 't1', ROUND_ONE_ANSWERS),
    assistantToolUse('a2', 't2', ROUND_TWO),
    toolResult('u2', 't2', ROUND_TWO_ANSWERS),
  ];
}

test('two answered question rounds are recovered and stay pending', () => {
  withProject((projectDir) => {
    const transcriptPath = writeTranscript(projectDir, 'session-1.jsonl', twoRounds());

    const first = sweepTranscript({ projectDir, transcriptPath, now: NOW });
    assert.equal(first.transcript, transcriptPath);
    assert.equal(first.session_id, SESSION);
    assert.equal(first.recovered, 3);
    assert.equal(first.pending.length, 3);
    assert.equal(first.chat_candidates.length, 0);
    assert.ok(first.pending.every((record) => record.source === 'transcript'));

    const second = sweepTranscript({ projectDir, transcriptPath, now: NOW });
    assert.equal(second.recovered, 0);
    assert.equal(second.pending.length, 3);
    assert.equal(readQueue(projectDir, SESSION).length, 3);
  });
});

test('a record the hook already queued is not appended again', () => {
  withProject((projectDir) => {
    const transcriptPath = writeTranscript(projectDir, 'session-1.jsonl', twoRounds());

    appendRecords(projectDir, SESSION, normalizeAskUserQuestion({
      runtime: 'claude',
      sessionId: SESSION,
      toolUseId: 't1',
      toolInput: { questions: ROUND_ONE },
      toolResponse: { answers: ROUND_ONE_ANSWERS },
      source: 'hook',
      now: NOW,
    }));

    const result = sweepTranscript({ projectDir, transcriptPath, now: NOW });
    assert.equal(result.recovered, 1);
    assert.equal(result.pending.length, 3);
    assert.deepEqual(
      readQueue(projectDir, SESSION).map((record) => record.source),
      ['hook', 'hook', 'transcript'],
    );
  });
});

test('an answered chat question is offered with its exact wording', () => {
  withProject((projectDir) => {
    const transcriptPath = writeTranscript(projectDir, 'chat.jsonl', [
      assistantText('a1', 'The badge needs a colour.\n\nShould the badge be blue or green?'),
      userPrompt('u1', 'Blue, please.'),
    ]);

    const result = sweepTranscript({ projectDir, transcriptPath, now: NOW });
    assert.equal(result.recovered, 0);
    assert.deepEqual(result.chat_candidates, [
      {
        key: chatSourceKey('claude', SESSION, 'a1', 'u1'),
        kind: 'chat',
        question: 'Should the badge be blue or green?',
        answer: 'Blue, please.',
        question_turn_id: 'a1',
        answer_turn_id: 'u1',
      },
    ]);
  });
});

test('a closing question with no reply stays an unanswered candidate', () => {
  withProject((projectDir) => {
    const transcriptPath = writeTranscript(projectDir, 'open.jsonl', [
      assistantText('a1', 'Here is the plan.\n\nShould the badge be blue or green?'),
    ]);

    const [candidate] = sweepTranscript({ projectDir, transcriptPath, now: NOW }).chat_candidates;
    assert.equal(candidate.question, 'Should the badge be blue or green?');
    assert.equal(candidate.answer, null);
    assert.equal(candidate.answer_turn_id, null);
    assert.equal(candidate.key, null);
  });
});

test('text followed by a tool call is not a chat question', () => {
  withProject((projectDir) => {
    const transcriptPath = writeTranscript(projectDir, 'tool.jsonl', [
      assistantText('a1', 'Should the badge be blue or green?'),
      assistantToolUse('a2', 't1', ROUND_TWO),
      userPrompt('u1', 'Blue, please.'),
    ]);

    assert.deepEqual(
      sweepTranscript({ projectDir, transcriptPath, now: NOW }).chat_candidates,
      [],
    );
  });
});

test('a consumed chat key is not offered again', () => {
  withProject((projectDir) => {
    const transcriptPath = writeTranscript(projectDir, 'consumed.jsonl', [
      assistantText('a1', 'Should the badge be blue or green?'),
      userPrompt('u1', 'Blue, please.'),
    ]);

    mkdirSync(queueDir(projectDir), { recursive: true, mode: 0o700 });
    writeFileSync(
      join(queueDir(projectDir), 'consumed.jsonl'),
      `${JSON.stringify({
        key: chatSourceKey('claude', SESSION, 'a1', 'u1'),
        packet: 'demo-packet',
        id: 'Q001',
        at: NOW,
      })}\n`,
    );

    assert.deepEqual(
      sweepTranscript({ projectDir, transcriptPath, now: NOW }).chat_candidates,
      [],
    );
  });
});

// The first block is the literal gate wording. The second adds a question mark,
// because without one the paragraph is rejected as a non-question before the
// process filter ever runs, and the filter is what this test has to prove.
test('a documentation-scope question is not a chat candidate', () => {
  withProject((projectDir) => {
    const literal = writeTranscript(projectDir, 'gate.jsonl', [
      assistantText('a1', 'Before I proceed, I need to ask about documentation:\nA) Existing\nD) Skip'),
      userPrompt('u1', 'A) Existing'),
    ]);
    const withMark = writeTranscript(projectDir, 'gate-question.jsonl', [
      assistantText(
        'a1',
        'Before I proceed, I need to ask about documentation: which folder?\nA) Existing\nD) Skip',
      ),
      userPrompt('u1', 'A) Existing'),
    ]);

    assert.deepEqual(sweepTranscript({ projectDir, transcriptPath: literal, now: NOW }).chat_candidates, []);
    assert.deepEqual(
      sweepTranscript({ projectDir, transcriptPath: withMark, now: NOW }).chat_candidates,
      [],
    );
  });
});

test('sidechain lines are ignored', () => {
  withProject((projectDir) => {
    const transcriptPath = writeTranscript(projectDir, 'sidechain.jsonl', [
      { ...assistantText('a1', 'Should the badge be blue or green?'), isSidechain: true },
      { ...userPrompt('u1', 'Blue, please.'), isSidechain: true },
      { ...assistantToolUse('a2', 't1', ROUND_TWO), isSidechain: true },
      { ...toolResult('u2', 't1', ROUND_TWO_ANSWERS), isSidechain: true },
    ]);

    const result = sweepTranscript({ projectDir, transcriptPath, now: NOW });
    assert.equal(result.recovered, 0);
    assert.equal(result.session_id, 'sidechain');
    assert.deepEqual(result.chat_candidates, []);
  });
});

test('the CLI prints the sweep result for the given transcript', () => {
  withProject((projectDir) => {
    const transcriptPath = writeTranscript(projectDir, 'cli.jsonl', twoRounds());

    const run = spawnSync(process.execPath, [SCRIPT, '--transcript', transcriptPath], {
      cwd: projectDir,
      encoding: 'utf8',
      timeout: 20000,
    });

    assert.equal(run.status, 0);
    const result = JSON.parse(run.stdout);
    assert.equal(result.recovered, 3);
    assert.equal(result.session_id, SESSION);
    assert.equal(result.pending.length, 3);
    assert.equal(readFileSync(queueFile(projectDir, SESSION), 'utf8').trim().split('\n').length, 3);
  });
});

test('the CLI reports an unreadable transcript and exits 1', () => {
  withProject((projectDir) => {
    const run = spawnSync(
      process.execPath,
      [SCRIPT, '--transcript', join(projectDir, 'missing.jsonl')],
      { cwd: projectDir, encoding: 'utf8', timeout: 20000 },
    );

    assert.equal(run.status, 1);
    assert.ok(JSON.parse(run.stdout).error);
  });
});
