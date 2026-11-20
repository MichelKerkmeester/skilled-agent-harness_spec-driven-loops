// ───────────────────────────────────────────────────────────────────
// MODULE: Continuity Thread Unit Tests
// ───────────────────────────────────────────────────────────────────

import { createRequire } from 'node:module';

import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);

interface CarriedForwardQuestion {
  text: string;
  addedAtIteration: number;
  source: string;
}

const {
  buildCarriedForwardOpenQuestions,
  deriveNextFocusFromContinuity,
  formatCarriedForwardOpenQuestions,
} = require('../../lib/deep-loop/continuity-thread.cjs') as {
  buildCarriedForwardOpenQuestions: (input: {
    iterationFiles?: Array<Record<string, unknown>>;
    iterationRecords?: Array<Record<string, unknown>>;
    machineOpenQuestions?: Array<string | { text: string }>;
    registryQuestions?: Array<string | { text: string }>;
    resolvedQuestions?: Array<string | { text: string }>;
  }) => CarriedForwardQuestion[];
  deriveNextFocusFromContinuity: (input: {
    iterationFiles?: Array<Record<string, unknown>>;
    iterationRecords?: Array<Record<string, unknown>>;
    carriedForwardOpenQuestions?: CarriedForwardQuestion[];
    machineOpenQuestions?: Array<string | { text: string }>;
    leafNextFocus?: string;
    resolvedQuestions?: Array<string | { text: string }>;
    terminalSentinel?: string;
  }) => string;
  formatCarriedForwardOpenQuestions: (questions: CarriedForwardQuestion[]) => string;
};

describe('continuity threading helpers', () => {
  it('builds self-owned open questions without duplicating machine-owned questions', () => {
    const questions = buildCarriedForwardOpenQuestions({
      iterationFiles: [
        {
          run: 1,
          questionsRemaining: [
            'Question C',
            'Which runtime helper should own the next focus derivation?',
          ],
        },
      ],
      iterationRecords: [
        {
          run: 2,
          openQuestions: ['Which runtime helper should own the next focus derivation?', 'How should the prompt see the thread?'],
        },
      ],
      machineOpenQuestions: [{ text: 'Question C' }],
    });

    expect(questions).toEqual([
      {
        text: 'Which runtime helper should own the next focus derivation?',
        addedAtIteration: 1,
        source: 'iteration-markdown',
      },
      {
        text: 'How should the prompt see the thread?',
        addedAtIteration: 2,
        source: 'iteration-record',
      },
    ]);
  });

  it('formats an empty carried-forward block as an explicit none marker', () => {
    expect(formatCarriedForwardOpenQuestions([])).toBe('[None yet]');
  });

  it('orders same-iteration questions by content rather than input order', () => {
    const first = buildCarriedForwardOpenQuestions({
      iterationFiles: [{ run: 1, questionsRemaining: ['Zebra follow-up', 'Alpha follow-up'] }],
      machineOpenQuestions: [{ text: 'Question C' }],
    });
    const second = buildCarriedForwardOpenQuestions({
      iterationFiles: [{ run: 1, questionsRemaining: ['Alpha follow-up', 'Zebra follow-up'] }],
      machineOpenQuestions: [{ text: 'Question C' }],
    });

    expect(first.map((question) => question.text)).toEqual(second.map((question) => question.text));
  });

  it('prefers the latest carried-forward question when deriving next focus', () => {
    const focus = deriveNextFocusFromContinuity({
      machineOpenQuestions: [{ text: 'Question C' }],
      carriedForwardOpenQuestions: [
        { text: 'Earlier thread question', addedAtIteration: 1, source: 'iteration-markdown' },
        { text: 'Later thread question', addedAtIteration: 2, source: 'iteration-markdown' },
      ],
    });

    expect(focus).toBe('Later thread question');
  });

  it('derives next focus from the latest finding when no thread question exists', () => {
    const focus = deriveNextFocusFromContinuity({
      machineOpenQuestions: [{ text: 'Question C' }],
      iterationFiles: [
        { run: 1, findings: ['Earlier answer'] },
        { run: 2, findings: ['Runtime prompt rendering is already checked.'] },
      ],
    });

    expect(focus).toBe('Follow up on: Runtime prompt rendering is already checked.');
  });

  it('falls back to the strategy question or terminal sentinel when no answer can seed focus', () => {
    expect(deriveNextFocusFromContinuity({
      machineOpenQuestions: [{ text: 'Question C' }],
      iterationFiles: [{ run: 1, findings: [] }],
    })).toBe('Question C');

    expect(deriveNextFocusFromContinuity({
      machineOpenQuestions: [],
      iterationFiles: [{ run: 1, findings: ['Resolved answer'] }],
    })).toBe('[All tracked questions are resolved]');
  });

  // Loop narration and bare topic labels appear in `questionsRemaining` but are not
  // questions, so they must not seed the next focus or inflate the carried-forward thread.
  it('drops a carried-forward item that is not question-shaped', () => {
    const questions = buildCarriedForwardOpenQuestions({
      iterationFiles: [
        {
          run: 2,
          questionsRemaining: ['Iteration 1 mapped the reducer chain.', 'Which reducer owns focus?'],
        },
      ],
      machineOpenQuestions: [{ text: 'Is the open machine question answered?' }],
    });

    expect(questions.map((question) => question.text)).toEqual(['Which reducer owns focus?']);
  });

  it('keeps a non-question item that equals a registry question', () => {
    const questions = buildCarriedForwardOpenQuestions({
      iterationFiles: [{ run: 1, questionsRemaining: ['Map the reducer chain'] }],
      registryQuestions: [{ text: 'Map the reducer chain' }],
    });

    expect(questions.map((question) => question.text)).toEqual(['Map the reducer chain']);
  });

  // A resolved question stays resolved no matter how it is cased, so it must not return as focus.
  it('drops a carried-forward item that equals a resolved question', () => {
    const questions = buildCarriedForwardOpenQuestions({
      iterationFiles: [{ run: 3, questionsRemaining: ['Which file owns the stop decision?'] }],
      resolvedQuestions: [{ text: 'which file owns the stop decision?' }],
    });

    expect(questions).toEqual([]);
  });

  // A leaf's own recommendation is fresher evidence than the thread it inherited.
  it('returns the leaf recommendation ahead of the carried-forward thread', () => {
    const focus = deriveNextFocusFromContinuity({
      carriedForwardOpenQuestions: [
        { text: 'Old thread?', addedAtIteration: 1, source: 'iteration-markdown' },
      ],
      machineOpenQuestions: [{ text: 'Open question?' }],
      leafNextFocus: 'Inspect the review twin',
    });

    expect(focus).toBe('Inspect the review twin');
  });

  it('skips a leaf recommendation that equals a resolved question', () => {
    const focus = deriveNextFocusFromContinuity({
      carriedForwardOpenQuestions: [
        { text: 'Old thread?', addedAtIteration: 1, source: 'iteration-markdown' },
      ],
      machineOpenQuestions: [{ text: 'Open question?' }],
      leafNextFocus: 'Old answered?',
      resolvedQuestions: ['old answered?'],
    });

    expect(focus).toBe('Old thread?');
  });

  // A leaf that ends its pass by asking to close a frontier node has written a
  // bookkeeping step, not research to do; working it would spend an iteration on it.
  it('skips a leaf recommendation that only closes a frontier node', () => {
    const focus = deriveNextFocusFromContinuity({
      carriedForwardOpenQuestions: [
        { text: 'Old thread?', addedAtIteration: 1, source: 'iteration-markdown' },
      ],
      machineOpenQuestions: [{ text: 'Open question?' }],
      leafNextFocus: 'Close F-2-008 as answered; the frontier is then terminal. Next: Q1 restraint.',
    });

    expect(focus).toBe('Old thread?');
  });

  it('keeps an imperative leaf recommendation that closes a gap rather than a node', () => {
    const focus = deriveNextFocusFromContinuity({
      machineOpenQuestions: [{ text: 'Open question?' }],
      leafNextFocus: 'Close the projection-surface gap so the report sees everything the advisor scores.',
    });

    expect(focus).toBe('Close the projection-surface gap so the report sees everything the advisor scores.');
  });

  it('returns the terminal sentinel with no open machine question even when the leaf recommends a focus', () => {
    const focus = deriveNextFocusFromContinuity({
      machineOpenQuestions: [],
      leafNextFocus: 'Do more work',
    });

    expect(focus).toBe('[All tracked questions are resolved]');
  });
});
