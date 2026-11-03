// ───────────────────────────────────────────────────────────────────
// MODULE: Decision Record Writer Test
// ───────────────────────────────────────────────────────────────────

// Proves the writer upserts by id without touching what it does not own, keeps
// the packet's detected level across the record's creation, and round-trips the
// verbatim appendix exactly.
//
// Each case builds its own packet in a temp folder, so every write can be
// compared against the bytes the file started from.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  DecisionRecordWriteError,
  detectLevel,
  readVerbatimAppendix,
  recordConsumedKeys,
  writeDecisionRecord,
  type OperatorDecisionEntry,
} from '@spec-kit/runtime/api';

const APPENDIX_CLOSE = '<!-- /ANCHOR:operator-answers-verbatim -->';

const LEVEL_TWO_SPEC = `---
title: "Feature Specification: Capture probe"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Capture probe

<!-- SPECKIT_LEVEL: 2 -->

---
`;

const MARKERLESS_SPEC = `---
title: "Feature Specification: Markerless probe"
---
# Feature Specification: Markerless probe

Body text without a stated level.
`;

const EMPTY_RECORD = `---
title: "Decision Record: Empty template"
description: "Operator decisions and their verbatim answers for this packet."
---

# Decision Record: Empty template

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

<!-- /ANCHOR:operator-answers-verbatim -->
`;

const HAND_WRITTEN_RECORD = `---
title: "Decision Record: Hand-written probe"
description: "A record with ADRs, rows and plain appendix items."
---

# Decision Record: Hand-written probe

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Keep the hand-written record

This ADR must survive a decision write byte for byte.
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | First choice | Because one. | None | plan.md |
| Q002 | Second choice | Because two. | Q001 | plan.md |
| Q003 | Third choice | Because three. | None | plan.md |

<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001

Question: First question?
Options: First; Second
Answer: First

### Q002

Question: Second question?
Options: First; Second
Answer: Second

### Q003

Question: Third question?
Options: First; Second
Answer: First

<!-- /ANCHOR:operator-answers-verbatim -->
`;

let PACKET = '';

beforeEach(() => {
  PACKET = fs.mkdtempSync(path.join(os.tmpdir(), 'decision-record-writer-'));
});

afterEach(() => {
  fs.rmSync(PACKET, { recursive: true, force: true });
});

function writePacketFile(name: string, content: string): void {
  fs.writeFileSync(path.join(PACKET, name), content, 'utf8');
}

function readRecord(): string {
  return fs.readFileSync(path.join(PACKET, 'decision-record.md'), 'utf8');
}

function entry(overrides: Partial<OperatorDecisionEntry> = {}): OperatorDecisionEntry {
  return {
    sourceKey: 'decision:scope',
    decided: 'Keep the record inside the bound packet.',
    why: 'The packet stays portable.',
    supersedes: 'None',
    carriedBy: 'plan.md',
    question: 'Where should the decision record live?',
    options: ['Inside the packet', 'A shared log'],
    answer: 'Inside the packet',
    ...overrides,
  };
}

describe('writeDecisionRecord', () => {
  it('creates the record beside a level-marked spec and keeps the detected level', () => {
    writePacketFile('spec.md', LEVEL_TWO_SPEC);
    expect(detectLevel(PACKET)).toBe('2');

    const result = writeDecisionRecord(PACKET, [entry()]);

    expect(result.created).toBe(true);
    expect(result.changed).toBe(true);
    expect(result.levelMarkerAdded).toBe(false);
    expect(result.ids).toEqual([{ sourceKey: 'decision:scope', id: 'Q001' }]);

    const record = readRecord();
    expect(record).toContain('<!-- ANCHOR:operator-decisions -->');
    expect(record).toContain('<!-- /ANCHOR:operator-decisions -->');
    expect(record).toContain('<!-- ANCHOR:operator-answers-verbatim -->');
    expect(record).toContain('<!-- /ANCHOR:operator-answers-verbatim -->');
    expect(record).toMatch(/^\| Q001 \|/mu);
    expect(record).toContain('<!-- source: decision:scope -->');
    // The validator expects every spec doc to carry the template's continuity block.
    expect(record).toMatch(/^_memory:\n {2}continuity:\n {4}packet_pointer: "/mu);
    expect(detectLevel(PACKET)).toBe('2');
  });

  it('reads a bare decision record in a markerless packet as level 3', () => {
    writePacketFile('spec.md', MARKERLESS_SPEC);
    writePacketFile('tasks.md', '<!-- ANCHOR:protocol -->\n');
    expect(detectLevel(PACKET)).toBe('2');

    writePacketFile('decision-record.md', '---\ntitle: "Decision Record: Bare"\n---\n');

    expect(detectLevel(PACKET)).toBe('3');
  });

  it('adds the level marker before creating the record so the level does not move', () => {
    writePacketFile('spec.md', MARKERLESS_SPEC);
    writePacketFile('tasks.md', '<!-- ANCHOR:protocol -->\n');
    expect(detectLevel(PACKET)).toBe('2');

    const result = writeDecisionRecord(PACKET, [entry()]);

    expect(result.levelMarkerAdded).toBe(true);
    expect(fs.readFileSync(path.join(PACKET, 'spec.md'), 'utf8')).toContain('<!-- SPECKIT_LEVEL: 2 -->');
    expect(detectLevel(PACKET)).toBe('2');
  });

  it('refuses to create a record without a spec and writes nothing', () => {
    let caught: unknown;
    try {
      writeDecisionRecord(PACKET, [entry()]);
    } catch (error) {
      caught = error;
    }

    expect(caught).toBeInstanceOf(DecisionRecordWriteError);
    expect((caught as DecisionRecordWriteError).code).toBe('NO_SPEC');
    expect(fs.existsSync(path.join(PACKET, 'decision-record.md'))).toBe(false);
  });

  it('leaves the record byte-identical when the same entries are written twice', () => {
    writePacketFile('spec.md', LEVEL_TWO_SPEC);
    writeDecisionRecord(PACKET, [entry()]);
    const first = fs.readFileSync(path.join(PACKET, 'decision-record.md'));

    const second = writeDecisionRecord(PACKET, [entry()]);
    const again = fs.readFileSync(path.join(PACKET, 'decision-record.md'));

    expect(second.created).toBe(false);
    expect(second.changed).toBe(false);
    expect(again.equals(first)).toBe(true);
  });

  it('adds Q004 to a hand-written record without moving a byte before the new row', () => {
    writePacketFile('spec.md', LEVEL_TWO_SPEC);
    writePacketFile('decision-record.md', HAND_WRITTEN_RECORD);

    const result = writeDecisionRecord(PACKET, [
      entry({ sourceKey: 'decision:later', decided: 'Fourth choice' }),
    ]);

    expect(result.ids).toEqual([{ sourceKey: 'decision:later', id: 'Q004' }]);

    const after = readRecord();
    const rowLine = after.split('\n').find((line) => line.startsWith('| Q004 |'));
    expect(rowLine).toBeDefined();
    const prefix = after.slice(0, after.indexOf(rowLine ?? ''));
    expect(HAND_WRITTEN_RECORD.startsWith(prefix)).toBe(true);

    const adrStart = HAND_WRITTEN_RECORD.indexOf('<!-- ANCHOR:adr-001 -->');
    const adrEnd = HAND_WRITTEN_RECORD.indexOf('<!-- /ANCHOR:adr-001 -->') + '<!-- /ANCHOR:adr-001 -->'.length;
    expect(after).toContain(HAND_WRITTEN_RECORD.slice(adrStart, adrEnd));
  });

  it('replaces the row for a known source key and leaves the appendix alone', () => {
    writePacketFile('spec.md', LEVEL_TWO_SPEC);
    writeDecisionRecord(PACKET, [entry()]);
    const before = readRecord();
    const appendixItem = before.slice(before.indexOf('### Q001'), before.indexOf(APPENDIX_CLOSE));

    const result = writeDecisionRecord(PACKET, [
      entry({ decided: 'Move the record to a shared log.' }),
    ]);

    const after = readRecord();
    expect(result.ids).toEqual([{ sourceKey: 'decision:scope', id: 'Q001' }]);
    expect(after).toContain('| Q001 | Move the record to a shared log. |');
    expect(after.split('\n').filter((line) => line.startsWith('| Q001 |'))).toHaveLength(1);
    expect(after.slice(after.indexOf('### Q001'), after.indexOf(APPENDIX_CLOSE))).toBe(appendixItem);
  });

  it('replaces a same-key appendix item when the answer changes', () => {
    writePacketFile('spec.md', LEVEL_TWO_SPEC);
    writeDecisionRecord(PACKET, [entry({ sourceKey: 'K', decided: 'Amber', answer: 'Amber' })]);

    const result = writeDecisionRecord(PACKET, [
      entry({ sourceKey: 'K', decided: 'Red', answer: 'Red' }),
    ]);

    const record = readRecord();
    const appendix = record.slice(record.indexOf('### Q001'), record.indexOf(APPENDIX_CLOSE));
    expect(result.ids).toEqual([{ sourceKey: 'K', id: 'Q001' }]);
    expect(record.split('\n').filter((line) => line.startsWith('| Q001 |'))).toHaveLength(1);
    expect(record).toContain('| Q001 | Red |');
    expect(record.split('\n').filter((line) => line.trim() === '### Q001')).toHaveLength(1);
    expect(appendix).toContain('Answer:\n```text\nRed\n```');
    expect(appendix).not.toContain('Amber');
  });

  it('keeps a repeated changed answer byte-identical', () => {
    writePacketFile('spec.md', LEVEL_TWO_SPEC);
    writeDecisionRecord(PACKET, [entry({ sourceKey: 'K', decided: 'Amber', answer: 'Amber' })]);
    const redEntry = entry({ sourceKey: 'K', decided: 'Red', answer: 'Red' });
    writeDecisionRecord(PACKET, [redEntry]);
    const firstRedWrite = fs.readFileSync(path.join(PACKET, 'decision-record.md'));

    const result = writeDecisionRecord(PACKET, [redEntry]);
    const repeatedRedWrite = fs.readFileSync(path.join(PACKET, 'decision-record.md'));

    expect(result.changed).toBe(false);
    expect(repeatedRedWrite.equals(firstRedWrite)).toBe(true);
  });

  it('leaves another source key appendix item untouched when one answer changes', () => {
    writePacketFile('spec.md', LEVEL_TWO_SPEC);
    writeDecisionRecord(PACKET, [
      entry({ sourceKey: 'K', decided: 'Amber', answer: 'Amber' }),
      entry({ sourceKey: 'other', decided: 'Blue', answer: 'Blue' }),
    ]);
    const before = readRecord();
    const otherItemBefore = before.slice(before.indexOf('### Q002'), before.indexOf(APPENDIX_CLOSE));

    writeDecisionRecord(PACKET, [entry({ sourceKey: 'K', decided: 'Red', answer: 'Red' })]);

    const after = readRecord();
    const otherItemAfter = after.slice(after.indexOf('### Q002'), after.indexOf(APPENDIX_CLOSE));
    expect(otherItemAfter).toBe(otherItemBefore);
  });

  it('round-trips fenced questions, piped options and multi-line answers exactly', () => {
    writePacketFile('spec.md', LEVEL_TWO_SPEC);
    const question = 'Which block should the note show?\n```js\nconst value = 1;\n```\nAnd why?';
    const options = ['A) Keep `|` in the table', 'B) Move it'];
    const answer = 'A) Keep `|` in the table\nbecause the row stays readable';

    writeDecisionRecord(PACKET, [entry({ question, options, answer })]);

    const item = readVerbatimAppendix(readRecord()).get('Q001');

    expect(item).toBeDefined();
    expect(item?.sourceKey).toBe('decision:scope');
    expect(item?.question).toBe(question);
    expect(item?.options).toEqual(options);
    expect(item?.answer).toBe(answer);
  });

  // An answer may quote the record's own structure. Inside a fence those lines are
  // text, so they must neither end the appendix nor claim an id.
  it('treats heading and anchor lines inside a fenced answer as text', () => {
    writePacketFile('spec.md', LEVEL_TWO_SPEC);
    const answer = ['Keep both.', '### Q999', APPENDIX_CLOSE, '| Q998 | not a row |'].join('\n');

    writeDecisionRecord(PACKET, [entry({ answer })]);
    writeDecisionRecord(PACKET, [entry({ sourceKey: 'decision:second', answer: 'Second.' })]);

    const record = readRecord();
    const items = readVerbatimAppendix(record);
    expect([...items.keys()]).toEqual(['Q001', 'Q002']);
    expect(items.get('Q001')?.answer).toBe(answer);
    expect(items.get('Q002')?.sourceKey).toBe('decision:second');
    expect(record.split('\n').filter((line) => line.startsWith('| Q00')).length).toBe(2);
  });

  it('fills the empty cells and escapes a pipe in the decision', () => {
    writePacketFile('spec.md', LEVEL_TWO_SPEC);

    writeDecisionRecord(PACKET, [
      entry({ why: undefined, supersedes: undefined, decided: 'Keep A | B' }),
    ]);

    expect(readRecord()).toContain('| Q001 | Keep A \\| B | Not stated. | None |');
  });

  it('inserts the first row right after the separator of an empty template table', () => {
    writePacketFile('spec.md', LEVEL_TWO_SPEC);
    writePacketFile('decision-record.md', EMPTY_RECORD);

    writeDecisionRecord(PACKET, [entry({ decided: 'First real row' })]);

    const lines = readRecord().split('\n');
    const separator = lines.findIndex((line) => line.startsWith('|----'));
    expect(separator).toBeGreaterThan(-1);
    expect(lines[separator + 1]).toBe(
      '| Q001 | First real row | The packet stays portable. | None | plan.md |',
    );
  });
});

// A row an author wrote by hand carries no source comment, so a later sweep of
// the same exchange arrives with a key the record has never seen.
describe('writeDecisionRecord with hand-written rows', () => {
  it('reuses the id of a plain-label hand-written item whose question and answer match', () => {
    writePacketFile('spec.md', LEVEL_TWO_SPEC);
    writePacketFile('decision-record.md', HAND_WRITTEN_RECORD);

    const result = writeDecisionRecord(PACKET, [
      entry({
        sourceKey: 'claude:session:toolu_second:0',
        decided: 'Second choice',
        question: '  second   QUESTION? ',
        options: ['First', 'Second'],
        answer: 'Second',
      }),
    ]);

    const after = readRecord();
    expect(result.ids).toEqual([{ sourceKey: 'claude:session:toolu_second:0', id: 'Q002' }]);
    expect(after.split('\n').filter((line) => line.startsWith('| Q00'))).toHaveLength(3);
    expect(after.split('\n').filter((line) => line.trim() === '### Q002')).toHaveLength(1);
  });

  it('reuses the id of a hand-written item with bolded labels', () => {
    writePacketFile('spec.md', LEVEL_TWO_SPEC);
    const record = HAND_WRITTEN_RECORD
      .replace('Question: Second question?', '**Question:** Second question?')
      .replace('Options: First; Second', '**Options**: First; Second')
      .replace('Answer: Second', '**Answer:** Second');
    writePacketFile('decision-record.md', record);

    const result = writeDecisionRecord(PACKET, [
      entry({
        sourceKey: 'claude:session:toolu_second:0',
        decided: 'Second choice',
        question: '  second   QUESTION? ',
        options: ['First', 'Second'],
        answer: 'Second',
      }),
    ]);

    const after = readRecord();
    expect(result.ids).toEqual([{ sourceKey: 'claude:session:toolu_second:0', id: 'Q002' }]);
    expect(after.split('\n').filter((line) => line.startsWith('| Q00'))).toHaveLength(3);
    expect(after.split('\n').filter((line) => line.trim() === '### Q002')).toHaveLength(1);
  });

  it('reuses the id of a hand-written item with indented labels', () => {
    writePacketFile('spec.md', LEVEL_TWO_SPEC);
    const record = HAND_WRITTEN_RECORD
      .replace('Question: Second question?', '  Question: Second question?')
      .replace('Options: First; Second', '\tOptions: First; Second')
      .replace('Answer: Second', '    Answer: Second');
    writePacketFile('decision-record.md', record);

    const result = writeDecisionRecord(PACKET, [
      entry({
        sourceKey: 'claude:session:toolu_second:0',
        decided: 'Second choice',
        question: '  second   QUESTION? ',
        options: ['First', 'Second'],
        answer: 'Second',
      }),
    ]);

    const after = readRecord();
    expect(result.ids).toEqual([{ sourceKey: 'claude:session:toolu_second:0', id: 'Q002' }]);
    expect(after.split('\n').filter((line) => line.startsWith('| Q00'))).toHaveLength(3);
    expect(after.split('\n').filter((line) => line.trim() === '### Q002')).toHaveLength(1);
  });

  it('gives a new id when only the question of a hand-written item matches', () => {
    writePacketFile('spec.md', LEVEL_TWO_SPEC);
    writePacketFile('decision-record.md', HAND_WRITTEN_RECORD);

    const result = writeDecisionRecord(PACKET, [
      entry({ sourceKey: 'claude:session:toolu_other:0', question: 'Second question?', answer: 'First' }),
    ]);

    expect(result.ids).toEqual([{ sourceKey: 'claude:session:toolu_other:0', id: 'Q004' }]);
  });
});

describe('recordConsumedKeys', () => {
  it('records each source key once across repeated saves', () => {
    const consumedPath = path.join(PACKET, '.skilled/skills/.state/decision-capture/consumed.jsonl');

    recordConsumedKeys(PACKET, 'specs/demo', [{ sourceKey: 'claude:s:t1:0', id: 'Q001' }], '2026-11-01T12:00:00.000Z');
    recordConsumedKeys(PACKET, 'specs/demo', [
      { sourceKey: 'claude:s:t1:0', id: 'Q001' },
      { sourceKey: 'claude:s:t2:0', id: 'Q002' },
    ], '2026-11-01T12:05:00.000Z');

    const keys = fs.readFileSync(consumedPath, 'utf8').trim().split('\n').map((line) => JSON.parse(line).key);
    expect(keys).toEqual(['claude:s:t1:0', 'claude:s:t2:0']);
  });
});
