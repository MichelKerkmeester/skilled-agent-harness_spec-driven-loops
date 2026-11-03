// ───────────────────────────────────────────────────────────────────
// MODULE: Decision Table Matcher Tests
// ───────────────────────────────────────────────────────────────────
// The matcher decides which hand-written table row an answer fills, so a wrong
// match marks an answer recorded when it is not. These cases pin the parse,
// the score threshold and every refusal path.

import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { afterAll, describe, expect, it } from 'vitest';

import {
  DEFAULT_THRESHOLD,
  DEFAULT_TIE_MARGIN,
  DEFAULT_WEIGHTS,
  matchRecords,
  normalize,
  parseDecisionTables,
  summaryLine,
  type DecisionQueueRecord,
} from '../lib/continuity/decision-table-matcher.js';

const fixturePath = fileURLToPath(
  new URL('../test-fixtures/decision-table/hand-written-record.md', import.meta.url),
);
const fixtureText = readFileSync(fixturePath, 'utf8');
const fixtureHashBefore = hashFixture();
const fixtureRows = parseDecisionTables(fixtureText);

afterAll(() => {
  expect(hashFixture()).toBe(fixtureHashBefore);
});

describe('decision table matcher', () => {
  it('parses every qualifying table and keeps escaped pipes inside cells', () => {
    const nextTable = [
      '| # | date | round | topic | question | options | answer | ruling | carried by |',
      '|---|---|---|---|---|---|---|---|---|',
      '| Q009 | 2026-11-01 | 4 | Quiet hours | Should alerts pause overnight? | Pause; Continue | Pause | Keep evenings quiet. | settings-plan |',
    ].join('\n');
    const rows = parseDecisionTables(`${fixtureText}\n\n${nextTable}`);

    expect(rows).toHaveLength(9);
    expect(rows.find((row) => row.id === 'Q007')?.question).toContain('alpha | beta');
    expect(rows.at(-1)?.id).toBe('Q009');
    expect(rows[0]?.line).toBeGreaterThan(0);
  });

  it('normalizes quotes, recommendation notes, line breaks, and whitespace', () => {
    expect(normalize('  "Keep note (Recommended)\nwith care"  ')).toBe('keep note / with care');
    expect(normalize('Choose (rEc.) today')).toBe('choose today');
  });

  it('matches an answer whose queue line break is shown as a slash in the table', () => {
    const result = matchRecords(
      [makeRecord({
        header: 'Field notes',
        question: 'Should a saved field note include a brief summary?',
        answer: 'Save note\ninclude a short summary',
      })],
      fixtureRows,
      [],
    );

    expect(result.matches).toHaveLength(1);
    expect(result.matches[0]?.id).toBe('Q002');
  });

  it('scores the same UTC day as matching date evidence', () => {
    const sameDay = matchRecords([makeRecord()], fixtureRows, []);
    const differentDay = matchRecords(
      [makeRecord({ captured_at: '2026-11-02T12:00:00.000Z' })],
      fixtureRows,
      [],
    );

    expect(sameDay.matches[0]?.id).toBe('Q001');
    expect(differentDay.matches[0]?.score).toBeCloseTo(
      (sameDay.matches[0]?.score ?? 0) - DEFAULT_WEIGHTS.date,
      6,
    );
  });

  it('matches a shortened table option when the answer and other evidence agree', () => {
    const result = matchRecords(
      [makeRecord({
        header: 'Cache refresh',
        question: 'How often should the local cache refresh?',
        options: ['Use local cache', 'Refresh daily with a backoff'],
        answer: 'Refresh daily',
      })],
      fixtureRows,
      [],
    );

    expect(result.matches[0]?.id).toBe('Q003');
    expect(result.matches[0]?.score).toBeGreaterThan(DEFAULT_THRESHOLD);
  });

  it('refuses a tie between rows with the same answer and near-identical topics', () => {
    const result = matchRecords(
      [makeRecord({
        header: 'Search preview',
        question: 'Should the search preview open inline?',
        options: ['Open inline', 'Use a detail page'],
        answer: 'Open inline',
      })],
      fixtureRows,
      [],
    );

    expect(result.refused).toEqual([{ key: 'queue-key', reason: 'tie' }]);
  });

  it('refuses a passing row when another answer-gated row is just below threshold', () => {
    const primaryRow = fixtureRows.find((row) => row.id === 'Q001');
    if (primaryRow === undefined) {
      throw new Error('Expected the fixture draft row');
    }

    const competingRow = { ...primaryRow, id: 'Q009', topic: 'Other subject' };
    const result = matchRecords(
      [makeRecord()],
      [primaryRow, competingRow],
      [],
      { threshold: 0.8, tieMargin: 0.31 },
    );

    expect(result.refused).toEqual([{ key: 'queue-key', reason: 'tie' }]);
  });

  it('keeps records pending when the answer gate has no row', () => {
    const result = matchRecords(
      [makeRecord({ answer: 'No matching decision exists' })],
      fixtureRows,
      [],
    );

    expect(result.pending).toEqual([{ key: 'queue-key', reason: 'no row' }]);
  });

  it('keeps an answer-gated row pending when its score is below threshold', () => {
    const result = matchRecords(
      [makeRecord({
        header: 'Unrelated topic',
        question: 'Which unrelated setting should change?',
        options: ['Unrelated choice'],
      })],
      fixtureRows,
      [],
      { threshold: 0.95 },
    );

    expect(result.pending).toEqual([{ key: 'queue-key', reason: 'no row' }]);
  });

  it('refuses a row consumed by another key with a different recorded answer', () => {
    const record = makeRecord({ answer: 'Keep draft' });
    const result = matchRecords(
      [record],
      fixtureRows,
      [{ key: 'earlier-key', packet: 'notes/packet', id: 'Q001' }],
      {
        packet: 'notes/packet',
        answersByKey: new Map([['earlier-key', 'Discard draft']]),
      },
    );

    expect(result.refused).toEqual([{
      key: 'queue-key',
      reason: 'row already consumed by a different answer',
    }]);
  });

  it('lets the earlier queue record claim a row only once in the same run', () => {
    const first = makeRecord({ answer: 'Keep draft' });
    const second = makeRecord({ key: 'second-key', answer: 'Keep draft' });
    const result = matchRecords([first, second], fixtureRows, []);

    expect(result.matches).toHaveLength(1);
    expect(result.matches[0]).toMatchObject({ key: 'queue-key', id: 'Q001' });
    expect(result.matches[0]?.score).toBeGreaterThan(DEFAULT_THRESHOLD);
    expect(result.refused).toEqual([{
      key: 'second-key',
      reason: 'row already consumed by a different answer',
    }]);
  });

  it('returns identical results on rerun and on a fresh consumed-row list', () => {
    const records = [
      makeRecord({
        key: 'line-break',
        header: 'Field notes',
        question: 'Should a saved field note include a brief summary?',
        answer: 'Save note\ninclude a short summary',
      }),
      makeRecord({
        key: 'short-option',
        header: 'Cache refresh',
        question: 'How often should the local cache refresh?',
        options: ['Use local cache', 'Refresh daily with a backoff'],
        answer: 'Refresh daily',
      }),
      makeRecord({ key: 'no-row', answer: 'No matching decision exists' }),
    ];
    const first = matchRecords(records, fixtureRows, []);
    const second = matchRecords(records, fixtureRows, []);
    const rebuilt = matchRecords(records, fixtureRows, []);

    expect(second).toEqual(first);
    expect(rebuilt).toEqual(first);
    expect(DEFAULT_WEIGHTS).toEqual({
      options: 0.35,
      headerTopic: 0.3,
      question: 0.3,
      date: 0.05,
    });
    expect(DEFAULT_THRESHOLD).toBe(0.4);
    expect(DEFAULT_TIE_MARGIN).toBeGreaterThan(0);
  });

  it('prints the required summary counts', () => {
    const result = matchRecords(
      [
        makeRecord({ answer: 'Keep draft' }),
        makeRecord({
          key: 'tie-key',
          header: 'Search preview',
          question: 'Should the search preview open inline?',
          options: ['Open inline', 'Use a detail page'],
          answer: 'Open inline',
        }),
        makeRecord({ key: 'pending-key', answer: 'No matching decision exists' }),
      ],
      fixtureRows,
      [],
    );

    expect(summaryLine(result)).toBe('consumed 1, refused 1, pending 1');
  });
});

function makeRecord(overrides: Partial<DecisionQueueRecord> = {}): DecisionQueueRecord {
  return {
    key: 'queue-key',
    header: 'Draft retention',
    question: 'How should the autosaved draft behave after a short pause?',
    options: ['Keep draft', 'Discard draft'],
    answer: 'Keep draft',
    captured_at: '2026-11-01T12:00:00.000Z',
    ...overrides,
  };
}

function hashFixture(): string {
  return createHash('sha256').update(readFileSync(fixturePath)).digest('hex');
}
