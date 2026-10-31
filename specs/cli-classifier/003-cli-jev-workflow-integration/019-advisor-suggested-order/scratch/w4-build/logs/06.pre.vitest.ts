// ───────────────────────────────────────────────────────────────
// MODULE: Suggested Cluster Order Eval Tests
// ───────────────────────────────────────────────────────────────
// Offline checks with synthetic rows, stub binaries and stub children. No model call.

import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { describe, expect, it, vi } from 'vitest';

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
  childMain,
  runTimedChild,
  childEnv,
  timeAdvisor,
  advisorLine,
  headroomLine,
  main,
} from '../../scripts/routing-accuracy/score-suggested-order.mjs';

const SCRIPT = resolve(dirname(fileURLToPath(import.meta.url)), '../../scripts/routing-accuracy/score-suggested-order.mjs');

function makeBin(name: string, body: string) {
  const dir = mkdtempSync(join(tmpdir(), 'suggested-order-stub-'));
  writeFileSync(join(dir, name), `#!/bin/sh\nD=$(dirname "$0")\necho "$*" >> "$D/${name}.log"\n${body}\n`, { mode: 0o755 });
  return dir;
}

function stubChild() {
  const dir = mkdtempSync(join(tmpdir(), 'suggested-order-child-'));
  const file = join(dir, 'child.mjs');
  const lines = [
    `import { childMain } from '${pathToFileURL(SCRIPT).href}';`,
    "let text = '';",
    "process.stdin.setEncoding('utf8');",
    "process.stdin.on('data', (chunk) => { text += chunk; });",
    "process.stdin.on('end', async () => {",
    '  const job = JSON.parse(text);',
    "  const ms = job.prompt.startsWith('slow') ? 5000 : job.prompt.startsWith('late') ? 2300 : 0;",
    '  const result = await childMain(text, { runAdvisor: () => new Promise((done) => setTimeout(done, ms)) });',
    '  process.stdout.write(`${JSON.stringify(result)}\\n`, () => process.exit(0));',
    '});',
  ];
  writeFileSync(file, `${lines.join('\n')}\n`);
  return file;
}

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

  it('stops on flips when one answer in each row disagrees with the other two', () => {
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

describe('score-suggested-order timed child', () => {
  it('runs health, then the call with the prompt on stdin', async () => {
    const bin = makeBin('cli-deem', `case "$1" in health) exit 0;; choice) cat > "$D/stdin.txt"; echo '{"ok":true}';; esac`);
    const job = {
      prompt: 'hello prompt',
      health: [join(bin, 'cli-deem')],
      call: { cmd: [join(bin, 'cli-deem')], args: ['choice', '-q', 'Q'] },
    };
    const result = await childMain(JSON.stringify(job), { runAdvisor: async () => {} });
    expect(result.healthCode).toBe(0);
    expect(result.code).toBe(0);
    expect(result.stdout.trim()).toBe('{"ok":true}');
    expect(typeof result.advisorMs).toBe('number');
    expect(readFileSync(join(bin, 'cli-deem.log'), 'utf8').trim().split('\n')).toEqual(['health', 'choice -q Q']);
    expect(readFileSync(join(bin, 'stdin.txt'), 'utf8')).toBe('hello prompt');
  });

  it('skips the call when the health check fails', async () => {
    const bin = makeBin('cli-deem', `case "$1" in health) exit 4;; esac`);
    const job = {
      prompt: 'hello prompt',
      health: [join(bin, 'cli-deem')],
      call: { cmd: [join(bin, 'cli-deem')], args: ['choice', '-q', 'Q'] },
    };
    const result = await childMain(JSON.stringify(job), { runAdvisor: async () => {} });
    expect(result.healthCode).toBe(4);
    expect(result.code).toBe(4);
    expect(result.callMs).toBeNull();
    expect(readFileSync(join(bin, 'cli-deem.log'), 'utf8').trim().split('\n')).toEqual(['health']);
    expect(existsSync(join(bin, 'stdin.txt'))).toBe(false);
  });

  it('returns a finished child result with its wall time', async () => {
    const out = await runTimedChild({ prompt: 'quick' }, { childFile: stubChild() });
    expect(out.timedOut).toBe(false);
    expect(typeof out.result?.advisorMs).toBe('number');
    expect(out.wallMs).toBeGreaterThan(0);
  });

  it('kills a child that overruns the timeout', async () => {
    const started = Date.now();
    const out = await runTimedChild({ prompt: 'slow one' }, { childFile: stubChild() });
    expect(out.timedOut).toBe(true);
    expect(out.wallMs).toBe(2500);
    expect(out.result).toBeNull();
    expect(Date.now() - started).toBeLessThan(4000);
  });

  it('childEnv gives the advisor its budget and a short daemon idle timeout', () => {
    const env = childEnv({ A: '1' });
    expect(env.A).toBe('1');
    expect(env.SPECKIT_CLAUDE_HOOK_TIMEOUT_MS).toBe('2200');
    expect(env.SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN).toBe('1');
    expect(childEnv({ SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN: '5' }).SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN).toBe('5');
  });
});

describe('score-suggested-order advisor timing and headroom', () => {
  it('times the advisor child on each prompt and reports the latency stop', async () => {
    const t = await timeAdvisor(['late a', 'late b'], { childFile: stubChild() });
    expect(t.n).toBe(2);
    expect(t.killed).toBe(0);
    expect(t.over2200).toBe(2);
    expect(t.p95).toBeGreaterThanOrEqual(2300);
    expect(headroomLine(23, t.p95)).toBe('no headroom (latency)');
  }, 30_000);

  it('advisorLine rounds the quantiles and prints none for an empty sample', () => {
    expect(advisorLine({ n: 241, p50: 812.4, p95: 1103, max: 2281, over2200: 1, killed: 0, walls: [] })).toBe(
      'advisor child: p50=812 p95=1103 max=2281 over_2200=1 children=241 killed=0',
    );
    expect(advisorLine({ n: 0, p50: null, p95: null, max: null, over2200: 0, killed: 0, walls: [] })).toBe(
      'advisor child: p50=none p95=none max=none over_2200=0 children=0 killed=0',
    );
  });

  it('headroomLine stops on movable first, then on latency', () => {
    expect(headroomLine(4, 800)).toBe('no headroom (movable)');
    expect(headroomLine(5, 2200)).toBeNull();
    expect(headroomLine(23, 2201)).toBe('no headroom (latency)');
    expect(headroomLine(23, null)).toBe('no headroom (latency)');
  });
});

function censusOf(movable: number, correct = 53) {
  const specs = [
    ...Array.from({ length: movable }, (_, index) => ({ id: `m${index + 1}`, cluster: ['a', 'g'], file: 'labeled' })),
    ...Array.from({ length: 4 }, (_, index) => ({ id: `f${index + 1}`, cluster: ['g', 'a'], file: 'holdout' })),
    { id: 'solo', cluster: ['g'], file: 'holdout' },
  ];
  const rows = specs.map((spec, index) => {
    const keys = [...spec.cluster, 'z'];
    const confidence: Record<string, number> = {};
    const score: Record<string, number> = {};
    keys.forEach((key, keyIndex) => {
      confidence[key] = 0.9 - 0.1 * keyIndex;
      score[key] = 0.5 - 0.01 * keyIndex;
    });
    return {
      ...spec,
      split: index % 2 === 0 ? 'train' : 'test',
      prompt: `prompt ${spec.id}`,
      gold: 'g',
      goldKey: 'g',
      order: keys,
      tau03: false,
      confidence,
      score,
    };
  });
  return { holdoutTop1: { correct, total: 70 }, labels: [], isMatch: strict, describe: (s: string) => `desc ${s}`, rows };
}

const timing = { n: 11, p50: 800, p95: 900, max: 1000, over2200: 0, killed: 0, walls: [] };

const KEEP_RULE = 'keep rule: coverage 10*M>=9*K, kill P(X>=L)<=0.05, margin 20*(SA-SB)>=M, sign test P(X>=W)<0.05, flips 10*F<=3*M, latency p95<=2200ms';

describe('score-suggested-order entry point', () => {
  it('returns 2 on an unknown flag', async () => {
    expect(await main(['--bogus'])).toBe(2);
  });

  it('refuses a model arm without --out before any call', async () => {
    const out = vi.fn();
    expect(await main(['--jev'], { out })).toBe(2);
    expect(out).not.toHaveBeenCalled();

    const deemDir = makeBin('cli-deem', '');
    const child = spawnSync(process.execPath, [SCRIPT, '--deem'], {
      encoding: 'utf8',
      env: { ...process.env, PATH: `${deemDir}:${process.env.PATH}` },
      timeout: 20_000,
    });
    expect(child.status).toBe(2);
    expect(child.stdout).toBe('');
    expect(child.stderr).toContain('--jev and --deem need --out <dir>');
    expect(existsSync(join(deemDir, 'cli-deem.log'))).toBe(false);
  });

  it('defaults to the zero-call comparison and the planned calls', async () => {
    const jevDir = makeBin('jev', '');
    const deemDir = makeBin('cli-deem', '');
    const env = { ...process.env, PATH: `${jevDir}:${deemDir}:${process.env.PATH}` };
    const out = vi.fn();
    expect(await main([], { census: censusOf(6), timing, out, env })).toBe(0);
    const lines = out.mock.calls.map(([line]) => line);
    expect(lines).toContain('baseline: holdout_top1=53/70');
    for (const name of ['scorer', 'confidence', 'always_second']) {
      expect(lines.some((line) => line.startsWith(`comparator: name=${name}`))).toBe(true);
    }
    expect(lines.some((line) => line.startsWith('power: movable=6'))).toBe(true);
    expect(lines.slice(-4)).toEqual([
      'advisor child: p50=800 p95=900 max=1000 over_2200=0 children=11 killed=0',
      'planned calls: jev=31 deem=30',
      'margin: 0.05',
      KEEP_RULE,
    ]);
    expect(existsSync(join(jevDir, 'jev.log'))).toBe(false);
    expect(existsSync(join(deemDir, 'cli-deem.log'))).toBe(false);
  });

  it('stops on movable before planning any call', async () => {
    const out = vi.fn();
    expect(await main([], { census: censusOf(4), timing, out })).toBe(0);
    const lines = out.mock.calls.map(([line]) => line);
    expect(lines).toContain('no headroom (movable)');
    expect(lines.some((line) => line.startsWith('planned calls:'))).toBe(false);
    expect(lines).not.toContain('underpowered');
  });

  it('returns 1 and prints no timing when the holdout baseline moved', async () => {
    const out = vi.fn();
    expect(await main([], { census: censusOf(6, 52), timing, out })).toBe(1);
    const lines = out.mock.calls.map(([line]) => line);
    expect(lines).toContain('baseline mismatch: comparison void');
    expect(lines.some((line) => line.startsWith('advisor child:'))).toBe(false);
  });

  it('answers one child job with a single JSON line on stdout', async () => {
    const chunks: string[] = [];
    const write = vi.spyOn(process.stdout, 'write').mockImplementation(((
      chunk: string | Uint8Array,
      callback?: (error?: Error) => void,
    ) => {
      chunks.push(String(chunk));
      if (typeof callback === 'function') callback();
      return true;
    }) as typeof process.stdout.write);
    try {
      const code = await main(['--child'], { stdinText: JSON.stringify({ prompt: 'p' }), runAdvisor: async () => {} });
      expect(code).toBe(0);
      const line = JSON.parse(chunks.join('').trim());
      expect(typeof line.advisorMs).toBe('number');
      expect(line.code).toBeNull();
    } finally {
      write.mockRestore();
    }
  });
});
