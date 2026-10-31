// ───────────────────────────────────────────────────────────────
// MODULE: Suggested Cluster Order Eval Tests
// ───────────────────────────────────────────────────────────────
// Offline checks with synthetic rows, stub binaries and stub children. No model call.

import { describe, expect, it } from 'vitest';

import {
  nearestRank,
  rotations,
  optionArgs,
  readProbabilities,
  topKey,
  orderFromMaps,
  judgeColumn,
  verdictLineFor,
  columnLine,
} from '../../scripts/routing-accuracy/score-suggested-order.mjs';

describe('score-suggested-order pure helpers', () => {
  it('nearestRank takes the nearest-rank quantile and leaves its input in place', () => {
    const values = [5, 1, 3];
    expect(nearestRank(values, 0.5)).toBe(3);
    expect(values).toEqual([5, 1, 3]);
    expect(nearestRank([], 0.95)).toBeNull();
    expect(nearestRank(Array.from({ length: 20 }, (_, index) => index + 1), 0.95)).toBe(19);
  });

  it('rotations returns the three left rotations of the keys', () => {
    expect(rotations(['a', 'b', 'none'])).toEqual([
      ['a', 'b', 'none'],
      ['b', 'none', 'a'],
      ['none', 'a', 'b'],
    ]);
  });

  it('optionArgs labels each key and disambiguates equal descriptions', () => {
    const texts: Record<string, string> = { a: 'same', b: 'same', c: 'other' };
    expect(optionArgs(['a', 'b', 'c', 'none'], (key: string) => texts[key], ['a', 'b', 'c'])).toEqual([
      '-o',
      'a=same [a]',
      '-o',
      'b=same [b]',
      '-o',
      'c=other',
      '-o',
      'none=None of these skills fits the request',
    ]);
  });

  it('readProbabilities returns the raw map and a full-coverage copy', () => {
    const stdout = JSON.stringify({ answers: { answer: { choice: 'a', probabilities: { a: 0.6, b: 0.3, none: 0.1 } } } });
    const { raw, full } = readProbabilities(stdout, ['a', 'b', 'none']);
    expect(full).toEqual({ a: 0.6, b: 0.3, none: 0.1 });
    expect(raw).toEqual({ a: 0.6, b: 0.3, none: 0.1 });
    expect(full).not.toBe(raw);
  });

  it('readProbabilities nulls the full map on a missing key or a non-number', () => {
    const withoutNone = JSON.stringify({ answers: { answer: { probabilities: { a: 0.6, b: 0.4 } } } });
    const missing = readProbabilities(withoutNone, ['a', 'b', 'none']);
    expect(missing.full).toBeNull();
    expect(missing.raw).toEqual({ a: 0.6, b: 0.4 });
    expect(readProbabilities('oops', ['a', 'b', 'none'])).toEqual({ raw: null, full: null });
    const stringValue = JSON.stringify({ answers: { answer: { probabilities: { a: '0.6', b: 0.4, none: 0 } } } });
    expect(readProbabilities(stringValue, ['a', 'b', 'none']).full).toBeNull();
  });

  it('topKey returns the first key with the highest value', () => {
    expect(topKey({ a: 0.2, b: 0.5, none: 0.3 }, ['a', 'b', 'none'])).toBe('b');
    expect(topKey({ a: 0.4, b: 0.4, none: 0.2 }, ['a', 'b', 'none'])).toBe('a');
  });

  it('orderFromMaps sorts the cluster by mean probability across the passes', () => {
    const row = { order: ['a', 'x', 'b', 'c'], cluster: ['a', 'b', 'c'] };
    const maps = [
      { a: 0.1, b: 0.6, c: 0.2, none: 0.1 },
      { a: 0.1, b: 0.5, c: 0.3, none: 0.1 },
      { a: 0.2, b: 0.4, c: 0.3, none: 0.1 },
    ];
    expect(orderFromMaps(row, maps)).toEqual({ order: ['b', 'x', 'c', 'a'], abstained: false });
  });

  it('orderFromMaps keeps the cluster order when the means tie', () => {
    const row = { order: ['a', 'b'], cluster: ['a', 'b'] };
    const maps = [
      { a: 0.4, b: 0.4, none: 0.2 },
      { a: 0.4, b: 0.4, none: 0.2 },
      { a: 0.4, b: 0.4, none: 0.2 },
    ];
    expect(orderFromMaps(row, maps)).toEqual({ order: ['a', 'b'], abstained: false });
  });

  it('orderFromMaps abstains when none leads every cluster key', () => {
    const row = { order: ['a', 'b'], cluster: ['a', 'b'] };
    const maps = [
      { a: 0.2, b: 0.3, none: 0.5 },
      { a: 0.2, b: 0.3, none: 0.5 },
      { a: 0.2, b: 0.3, none: 0.5 },
    ];
    expect(orderFromMaps(row, maps)).toEqual({ order: ['a', 'b'], abstained: true });
  });
});

const strict = (a: string | null, g: string) => a === g;

function rowOf(id: string, cluster: string[]) {
  return {
    id,
    gold: 'g',
    order: [...cluster, 'z'],
    cluster,
    confidence: { [cluster[0]]: 0.9, [cluster[1]]: 0.8, z: 0.1 },
  };
}

function favor(k: string, cluster: string[]) {
  const keys = [...cluster, 'none'];
  const map: Record<string, number> = {};
  for (const key of keys) map[key] = key === k ? 0.7 : 0.3 / (keys.length - 1);
  return map;
}

type Row = ReturnType<typeof rowOf>;

describe('score-suggested-order keep rule', () => {
  const walls = Array.from({ length: 60 }, () => 800);

  function rowsOf(mCount: number, fCount: number): Row[] {
    return [
      ...Array.from({ length: mCount }, (_, index) => rowOf(`m${index + 1}`, ['a', 'g'])),
      ...Array.from({ length: fCount }, (_, index) => rowOf(`f${index + 1}`, ['g', 'a'])),
    ];
  }

  function answersOf(rows: Row[], pick: (row: Row) => string) {
    const answersByRow: Record<string, Array<Record<string, number> | null>> = {};
    for (const row of rows) {
      const map = favor(pick(row), row.cluster);
      answersByRow[row.id] = [map, map, map];
    }
    return answersByRow;
  }

  it('keeps a column that wins every decided row', () => {
    const rows = rowsOf(10, 10);
    const answersByRow = answersOf(rows, () => 'g');
    const s = judgeColumn('deem', rows, answersByRow, walls, { isMatch: strict });
    expect(s.verdict).toBe('keep');
    expect(s.baseline).toBe('scorer');
    expect(s.W).toBe(10);
    expect(s.L).toBe(0);
    expect(verdictLineFor(s, 'model=x')).toBe(
      'verdict deem: keep K=20 M=20 W=10 L=0 F=0 p=0.0010 mrr=1.0000/0.7500 p95_ms=800 model=x',
    );
    expect(columnLine(s).startsWith('column deem: rows=20 measured=20 wins=10 losses=0')).toBe(true);
  });

  it('kills a column that loses every decided row', () => {
    const rows = rowsOf(0, 20);
    const answersByRow = {
      ...answersOf(rows.slice(0, 10), () => 'a'),
      ...answersOf(rows.slice(10), () => 'g'),
    };
    const s = judgeColumn('deem', rows, answersByRow, walls, { isMatch: strict });
    expect(s.verdict).toBe('kill');
    expect(s.W).toBe(0);
    expect(s.L).toBe(10);
  });

  it('stops on coverage when too few rows are measured', () => {
    const rows = rowsOf(10, 10);
    const answersByRow = answersOf(rows, () => 'g');
    for (const id of ['m1', 'm2', 'm3']) {
      answersByRow[id] = [favor('g', ['a', 'g']), favor('g', ['a', 'g']), null];
    }
    const s = judgeColumn('deem', rows, answersByRow, walls, { isMatch: strict });
    expect(s.M).toBe(17);
    expect(s.verdict).toBe('stop (coverage)');
  });

  it('stops on margin when one win cannot clear the baseline gap', () => {
    const rows = rowsOf(1, 19);
    const answersByRow = answersOf(rows, () => 'g');
    const s = judgeColumn('deem', rows, answersByRow, walls, { isMatch: strict });
    expect(s.baseline).toBe('scorer');
    expect(s.W).toBe(1);
    expect(s.L).toBe(0);
    expect(s.verdict).toBe('stop (margin)');
  });

  it('stops on the sign test when too few rows decide', () => {
    const rows = rowsOf(4, 4);
    const answersByRow = answersOf(rows, () => 'g');
    const s = judgeColumn('deem', rows, answersByRow, walls, { isMatch: strict });
    expect(s.baseline).toBe('scorer');
    expect(s.W).toBe(4);
    expect(s.L).toBe(0);
    expect(s.verdict).toBe('stop (sign test)');
  });

  it('stops on flips when a row answers with three disagreeing top keys', () => {
    const rows = rowsOf(10, 10);
    const answersByRow = answersOf(rows, () => 'g');
    for (const row of rows.slice(10)) {
      answersByRow[row.id] = [favor('g', row.cluster), favor('g', row.cluster), favor('a', row.cluster)];
    }
    const s = judgeColumn('deem', rows, answersByRow, walls, { isMatch: strict });
    expect(s.F).toBe(10);
    expect(s.verdict).toBe('stop (flips)');
  });

  it('stops on latency when the p95 wall exceeds the advisor budget', () => {
    const rows = rowsOf(10, 10);
    const answersByRow = answersOf(rows, () => 'g');
    const slowWalls = [...Array.from({ length: 56 }, () => 800), ...Array.from({ length: 4 }, () => 2500)];
    const s = judgeColumn('deem', rows, answersByRow, slowWalls, { isMatch: strict });
    expect(s.t).toBe(2500);
    expect(s.verdict).toBe('stop (latency)');
  });

  it('names the best zero-call order as the baseline when the column cannot beat it', () => {
    const rows = rowsOf(10, 0);
    const answersByRow = answersOf(rows, () => 'g');
    const s = judgeColumn('deem', rows, answersByRow, walls, { isMatch: strict });
    expect(s.baseline).toBe('always_second');
    expect(s.W).toBe(0);
    expect(s.L).toBe(0);
    expect(s.verdict).toBe('stop (margin)');
  });
});
