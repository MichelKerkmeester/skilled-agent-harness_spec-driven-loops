// ───────────────────────────────────────────────────────────────────
// MODULE: Chat Question Detection Tests
// ───────────────────────────────────────────────────────────────────

import assert from 'node:assert/strict';
import { test } from 'node:test';

import { chatCandidatesFromTurns } from './chat-questions.mjs';

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
