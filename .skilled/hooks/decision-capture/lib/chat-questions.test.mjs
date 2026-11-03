// ───────────────────────────────────────────────────────────────────
// MODULE: Chat Question Detection Tests
// ───────────────────────────────────────────────────────────────────

import assert from 'node:assert/strict';
import { test } from 'node:test';

import { answerEvidence, chatCandidatesFromTurns } from './chat-questions.mjs';

test('an assistant question followed by a prompt produces a Claude candidate', () => {
  const result = chatCandidatesFromTurns({
    runtime: 'claude',
    sessionId: 'session-1',
    turns: [
      {
        kind: 'assistant',
        id: 'assistant-1',
        text: 'Should the badge be blue or green?',
      },
      { kind: 'prompt', id: 'prompt-1', text: 'Blue.' },
    ],
    consumed: new Set(),
  });

  assert.deepEqual(result, {
    candidates: [
      {
        key: 'claude:session-1:chat:assistant-1:prompt-1',
        kind: 'chat',
        question: 'Should the badge be blue or green?',
        answer: 'Blue.',
        question_turn_id: 'assistant-1',
        answer_turn_id: 'prompt-1',
        evidence: {
          questionType: 'alternative',
          optionMatch: true,
          contentOverlap: 1,
          imperativeOpening: false,
          topicShift: false,
        },
      },
    ],
    dropped: 0,
  });
});

test('a tool turn clears the pending assistant question', () => {
  const result = chatCandidatesFromTurns({
    runtime: 'claude',
    sessionId: 'session-1',
    turns: [
      {
        kind: 'assistant',
        id: 'assistant-1',
        text: 'Should the badge be blue or green?',
      },
      { kind: 'tool' },
      { kind: 'prompt', id: 'prompt-1', text: 'Blue.' },
    ],
    consumed: new Set(),
  });

  assert.deepEqual(result, { candidates: [], dropped: 0 });
});

test('candidates past the per-message cap are counted as dropped', () => {
  const text = [
    'Should the badge be blue?',
    'Should the header be sticky?',
    'Should the footer stay hidden?',
    'Should the menu collapse on mobile?',
    'Should the logo be centred?',
  ].join('\n\n');
  const result = chatCandidatesFromTurns({
    runtime: 'claude',
    sessionId: 'session-1',
    turns: [
      { kind: 'assistant', id: 'assistant-1', text },
      { kind: 'prompt', id: 'prompt-1', text: 'Yes to all.' },
    ],
    consumed: new Set(),
  });

  assert.equal(result.candidates.length, 3);
  assert.equal(result.dropped, 2);
});

test('a topic shift and a new-task verb describe an alternative answer as new work', () => {
  assert.deepEqual(
    answerEvidence(
      'Should the badge be blue or amber?',
      [],
      'actually first fix the login bug',
    ),
    {
      questionType: 'alternative',
      optionMatch: false,
      contentOverlap: 0,
      imperativeOpening: true,
      topicShift: true,
    },
  );
});

test('an open question with no offered option reports no option to match', () => {
  assert.deepEqual(
    answerEvidence('Which colour should the badge be?', [], 'make it blue'),
    {
      questionType: 'open_value',
      optionMatch: 'not_applicable',
      contentOverlap: 0,
      imperativeOpening: false,
      topicShift: false,
    },
  );
});

test('a reply that restates a choice in other words names no option', () => {
  assert.deepEqual(
    answerEvidence('Should the badge be blue or amber?', [], 'use the darker one'),
    {
      questionType: 'alternative',
      optionMatch: false,
      contentOverlap: 0,
      imperativeOpening: false,
      topicShift: false,
    },
  );
});

test('a filler before a choice verb leaves the opening non-imperative', () => {
  assert.deepEqual(
    answerEvidence('Should the badge be blue or amber?', [], 'First, make it blue'),
    {
      questionType: 'alternative',
      optionMatch: true,
      contentOverlap: 1,
      imperativeOpening: false,
      topicShift: false,
    },
  );
});

test('an anaphor after the verb reads as approving the question, not new work', () => {
  assert.deepEqual(
    answerEvidence('Should I push to main?', [], 'Push it'),
    {
      questionType: 'yes_no',
      optionMatch: false,
      contentOverlap: 1,
      imperativeOpening: false,
      topicShift: false,
    },
  );
});

test('a bare yes matches the yes/no option', () => {
  assert.deepEqual(
    answerEvidence('Should I push to main?', [], 'Yes'),
    {
      questionType: 'yes_no',
      optionMatch: true,
      contentOverlap: 0,
      imperativeOpening: false,
      topicShift: false,
    },
  );
});

test('a numbered list marker before the verb still opens imperatively', () => {
  assert.deepEqual(
    answerEvidence('Which colour should the badge be?', [], '1. fix the login bug'),
    {
      questionType: 'open_value',
      optionMatch: 'not_applicable',
      contentOverlap: 0,
      imperativeOpening: true,
      topicShift: false,
    },
  );
});

test('a shift phrase past the opening window leaves the answer on topic', () => {
  assert.deepEqual(
    answerEvidence(
      'Should the badge be blue or amber?',
      [],
      'okay then blue it is, and after that maybe we could actually rename it',
    ),
    {
      questionType: 'alternative',
      optionMatch: true,
      contentOverlap: 1,
      imperativeOpening: false,
      topicShift: false,
    },
  );
});

test('inline code on one side of an or question still names the chosen option', () => {
  assert.deepEqual(
    answerEvidence('Should I use `retry` or `backoff`?', [], 'backoff'),
    {
      questionType: 'alternative',
      optionMatch: true,
      contentOverlap: 1,
      imperativeOpening: false,
      topicShift: false,
    },
  );
});

test('an unanswered question carries no evidence', () => {
  assert.equal(answerEvidence('Should the badge be blue or amber?', [], null), null);
});