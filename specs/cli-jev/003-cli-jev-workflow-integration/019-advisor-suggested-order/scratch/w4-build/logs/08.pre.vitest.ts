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
  runArm,
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

function nodeBin(name: string, js: string) {
  const dir = mkdtempSync(join(tmpdir(), 'suggested-order-node-'));
  writeFileSync(join(dir, `${name}.cjs`), js);
  writeFileSync(join(dir, name), `#!/bin/sh\nexec "${process.execPath}" "$(dirname "$0")/${name}.cjs" "$@"\n`, { mode: 0o755 });
  return dir;
}

const DEEM_STUB = `const fs = require('node:fs');
const path = require('node:path');
const args = process.argv.slice(2);
fs.appendFileSync(path.join(__dirname, 'cli-deem.log'), args.join(' ') + '\\n');
if (args[0] === 'health') {
  process.stdout.write(JSON.stringify({ ok: true, backend: 'torch', model: 'deem-0.8-v1', model_commit: 'abc1234', source_commit: 'def5678' }) + '\\n', () => process.exit(0));
}
if (process.env.STUB_MODE === 'refuse') process.exit(3);
let text = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => { text += chunk; });
process.stdin.on('end', () => {
  const keys = [];
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === '-o') keys.push(args[i + 1].split('=')[0]);
  }
  const probabilities = {};
  for (const key of keys) probabilities[key] = key === 'g' ? 0.7 : 0.3 / (keys.length - 1);
  if (text.startsWith('partial')) delete probabilities.none;
  process.stdout.write(JSON.stringify({ answers: { answer: { choice: 'g', probabilities } } }) + '\\n');
});
`;

const JEV_STUB = `const fs = require('node:fs');
const path = require('node:path');
const args = process.argv.slice(2);
fs.appendFileSync(path.join(__dirname, 'jev.log'), args.join(' ') + '\\n');
if (args[0] === '--version') {
  process.stdout.write('jev 0.6.2\\n', () => process.exit(0));
}
if (args[0] === 'auth' && args[1] === 'status') process.exit(0);
if (args[0] === 'auth' && args[1] === 'test') {
  if (process.env.STUB_AUTH === '3') process.exit(3);
  process.stdout.write('{"model":"stub-model"}\\n', () => process.exit(0));
}
let text = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => { text += chunk; });
process.stdin.on('end', () => {
  if (text.startsWith('busy') && !fs.existsSync(path.join(__dirname, 'busy.done'))) {
    fs.writeFileSync(path.join(__dirname, 'busy.done'), '');
    process.exit(4);
  }
  const keys = [];
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === '-o') keys.push(args[i + 1].split('=')[0]);
  }
  const probabilities = {};
  for (const key of keys) probabilities[key] = key === 'g' ? 0.7 : 0.3 / (keys.length - 1);
  if (text.startsWith('partial')) delete probabilities.none;
  process.stdout.write(JSON.stringify({ answers: { answer: { choice: 'g', probabilities } } }) + '\\n');
});
`;

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
    expect(t.over2200).toBe(2);
    expect(t.p95).toBeGreaterThan(2200);
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

function deemRow(id: string, prompt: string, cluster: string[] = ['a', 'g']) {
  return { ...rowOf(id, cluster), prompt };
}

function readCalls(outDir: string) {
  return readFileSync(join(outDir, 'calls.jsonl'), 'utf8')
    .split('\n')
    .filter((line) => line !== '')
    .map((line) => JSON.parse(line));
}

function deemRun(stubMode?: string) {
  const dir = nodeBin('cli-deem', DEEM_STUB);
  const outDir = mkdtempSync(join(tmpdir(), 'suggested-order-calls-'));
  const out = vi.fn();
  const gate = { cmd: [join(dir, 'cli-deem')], model: 'deem-0.8-v1', modelCommit: 'abc1234', sourceCommit: 'def5678' };
  const ctx = {
    out,
    env: { ...process.env, STUB_MODE: stubMode },
    outDir,
    childFile: stubChild(),
    advisorP50: 800,
  };
  return { dir, outDir, gate, ctx, lines: () => out.mock.calls.map(([line]) => line as string) };
}

describe('score-suggested-order deem arm', () => {
  it('asks every row three times inside timed children and records each call', async () => {
    const { dir, outDir, gate, ctx, lines } = deemRun();
    const rows = Array.from({ length: 6 }, (_, index) => deemRow(`p${index + 1}`, `p${index + 1}`));
    const census = { rows, isMatch: strict, describe: (s: string) => `desc ${s}` };
    await runArm('deem', census, gate, ctx);
    expect(lines()).toContain('deem: nothing leaves the machine planned_calls=18 est_wall_s=18.7');
    expect(lines()).toContain('question: Which skill should handle this request?');
    const verdict = lines().find((line) => line.startsWith('verdict deem:'));
    expect(verdict?.startsWith('verdict deem: stop (margin) K=6 M=6 W=0 L=0 F=0')).toBe(true);
    expect(verdict?.endsWith('model=deem-0.8-v1 model_commit=abc1234 source_commit=def5678')).toBe(true);
    const calls = readCalls(outDir);
    expect(calls).toHaveLength(18);
    for (const call of calls) {
      expect(typeof call.child_wall_ms).toBe('number');
      expect(call.model_commit).toBe('abc1234');
      expect(call.source_commit).toBe('def5678');
      expect(call.status).toBe('measured');
      expect(Object.keys(call.probabilities).sort()).toEqual(['a', 'g', 'none']);
    }
    const log = readFileSync(join(dir, 'cli-deem.log'), 'utf8').trim().split('\n');
    expect(log.filter((line) => line === 'health')).toHaveLength(18);
    const choices = log.filter((line) => line.startsWith('choice'));
    expect(choices[0]).toContain('-o a=desc a -o g=desc g -o none=None of these skills fits the request');
    expect(choices[1]).toContain('-o g=desc g -o none=None of these skills fits the request -o a=desc a');
  }, 60_000);

  it('records a call the classifier cannot fully answer as unmeasured', async () => {
    const { outDir, gate, ctx, lines } = deemRun();
    const rows = [
      ...Array.from({ length: 5 }, (_, index) => deemRow(`p${index + 1}`, `p${index + 1}`)),
      deemRow('six', 'partial six'),
    ];
    const census = { rows, isMatch: strict, describe: (s: string) => `desc ${s}` };
    await runArm('deem', census, gate, ctx);
    const column = lines().find((line) => line.startsWith('column deem:'));
    expect(column).toContain('rows=6 measured=5');
    const partial = readCalls(outDir).filter((call) => call.row_id === 'six');
    expect(partial).toHaveLength(3);
    for (const call of partial) {
      expect(call.status).toBe('unmeasured');
      expect(call.probabilities).not.toHaveProperty('none');
    }
  }, 60_000);

  it('records a killed child at the timeout and stops on the latency p95', async () => {
    const { outDir, gate, ctx, lines } = deemRun();
    const rows = [
      ...Array.from({ length: 10 }, (_, index) => deemRow(`m${index + 1}`, `p${index + 1}`)),
      ...Array.from({ length: 8 }, (_, index) => deemRow(`f${index + 1}`, `f${index + 1}`, ['g', 'a'])),
      deemRow('slow1', 'slow 1'),
      deemRow('slow2', 'slow 2'),
    ];
    const census = { rows, isMatch: strict, describe: (s: string) => `desc ${s}` };
    await runArm('deem', census, gate, ctx);
    const slow = readCalls(outDir).filter((call) => call.row_id === 'slow1' || call.row_id === 'slow2');
    expect(slow).toHaveLength(6);
    for (const call of slow) {
      expect(call.status).toBe('unmeasured_timeout');
      expect(call.child_wall_ms).toBe(2500);
    }
    const verdict = lines().find((line) => line.startsWith('verdict deem:'));
    expect(verdict?.startsWith('verdict deem: stop (latency) K=20 M=18 W=8 L=0 F=0 p=0.0039 mrr=1.0000/0.7778 p95_ms=2500')).toBe(true);
  }, 120_000);

  it('stops the arm when the backend refuses', async () => {
    const { outDir, gate, ctx, lines } = deemRun('refuse');
    const rows = [deemRow('p1', 'p1'), deemRow('p2', 'p2')];
    const census = { rows, isMatch: strict, describe: (s: string) => `desc ${s}` };
    const result = await runArm('deem', census, gate, ctx);
    expect(result).toEqual({ stopped: 'deem arm stopped: backend refused' });
    expect(lines()).toContain('deem: partial_rows=0');
    expect(lines().some((line) => line.startsWith('verdict'))).toBe(false);
    const calls = readCalls(outDir);
    expect(calls).toHaveLength(1);
    expect(calls[0].exit_code).toBe(3);
  }, 60_000);
});

function jevRow(id: string, prompt: string, cluster: string[] = ['a', 'g']) {
  return { ...rowOf(id, cluster), prompt };
}

function jevRun(stubAuth?: string) {
  const dir = nodeBin('jev', JEV_STUB);
  const outDir = mkdtempSync(join(tmpdir(), 'suggested-order-calls-'));
  const out = vi.fn();
  const gate = { path: join(dir, 'jev'), provider: 'openrouter' };
  const ctx = {
    out,
    env: { ...process.env, STUB_AUTH: stubAuth },
    outDir,
    childFile: stubChild(),
    advisorP50: 800,
    backoffMs: 10,
  };
  return { dir, outDir, gate, ctx, lines: () => out.mock.calls.map(([line]) => line as string) };
}

describe('score-suggested-order jev arm', () => {
  it('sends every row to the hosted classifier and records each call', async () => {
    const { dir, outDir, gate, ctx, lines } = jevRun();
    const rows = Array.from({ length: 6 }, (_, index) => jevRow(`m${index + 1}`, `p${index + 1}`));
    const census = { rows, isMatch: strict, describe: (s: string) => `desc ${s}` };
    await runArm('jev', census, gate, ctx);
    expect(lines().some((line) => line.startsWith('jev: payload=routing corpus prompts and skill projection descriptions planned_calls=19 est_input_tokens='))).toBe(true);
    expect(lines()).toContain('jev: auth_test provider=openrouter model=stub-model');
    const verdict = lines().find((line) => line.startsWith('verdict jev:'));
    expect(verdict?.startsWith('verdict jev: ')).toBe(true);
    expect(verdict?.endsWith('jev_version=0.6.2 provider=openrouter model=stub-model')).toBe(true);
    const log = readFileSync(join(dir, 'jev.log'), 'utf8').trim().split('\n');
    expect(log).toHaveLength(19);
    expect(log[0]).toBe('auth test --provider openrouter');
    for (const line of log.slice(1)) {
      expect(line.startsWith('choice --provider openrouter -q ')).toBe(true);
    }
    expect(log).not.toContain('health');
    for (const line of log) {
      expect(line.split('--provider')).toHaveLength(2);
    }
    const calls = readCalls(outDir);
    expect(calls).toHaveLength(19);
    for (const call of calls) {
      expect(call.provider).toBe('openrouter');
    }
    const choices = calls.filter((call) => call.kind === 'choice');
    expect(choices).toHaveLength(18);
    for (const call of choices) {
      expect(call.model).toBe('stub-model');
    }
  }, 60_000);

  it('stops the arm when the key is rejected', async () => {
    const { dir, gate, ctx, lines } = jevRun('3');
    const rows = [jevRow('p1', 'p1'), jevRow('p2', 'p2')];
    const census = { rows, isMatch: strict, describe: (s: string) => `desc ${s}` };
    const result = await runArm('jev', census, gate, ctx);
    expect(result).toEqual({ stopped: 'jev arm stopped: key rejected' });
    expect(lines()).toContain('jev: partial_rows=0');
    expect(readFileSync(join(dir, 'jev.log'), 'utf8').trim().split('\n')).toEqual(['auth test --provider openrouter']);
  }, 60_000);

  it('retries a busy classifier once after the backoff', async () => {
    const { outDir, gate, ctx, lines } = jevRun();
    const rows = [jevRow('p1', 'p1'), jevRow('busy1', 'busy two')];
    const census = { rows, isMatch: strict, describe: (s: string) => `desc ${s}` };
    await runArm('jev', census, gate, ctx);
    const busy = readCalls(outDir).filter((call) => call.row_id === 'busy1' && call.order === 0);
    expect(busy).toHaveLength(2);
    expect(busy[0].attempt).toBe(1);
    expect(busy[0].exit_code).toBe(4);
    expect(busy[0].status).toBe('unmeasured');
    expect(busy[1].attempt).toBe(2);
    expect(busy[1].status).toBe('measured');
    const column = lines().find((line) => line.startsWith('column jev:'));
    expect(column).toContain('measured=2');
  }, 60_000);
});
