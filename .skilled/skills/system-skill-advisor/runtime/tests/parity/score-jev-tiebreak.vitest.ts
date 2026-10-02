// ───────────────────────────────────────────────────────────────
// MODULE: Jev Tie-Break Eval Tests
// ───────────────────────────────────────────────────────────────
// Offline checks for the binomial keep line and the cluster reorder. No model call.

import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it, vi } from 'vitest';

import {
  binomTail,
  minWins,
  winRate80,
  reciprocalRank,
  rankMetrics,
  calibrationMetrics,
  reorderSlots,
  movePickFirst,
  classifyRow,
  confidenceOrder,
  alwaysSecondOrder,
  buildFold,
  rerankOrder,
  loadCensus,
  summarizeCensus,
  summarizeColumn,
  columnLines,
  verdictLine,
  buildReport,
  spawnCall,
  writeCall,
  main,
} from '../../scripts/routing-accuracy/score-jev-tiebreak.mjs';

const SCRIPT = resolve(dirname(fileURLToPath(import.meta.url)), '../../scripts/routing-accuracy/score-jev-tiebreak.mjs');

function runScript(args: string[], env: NodeJS.ProcessEnv) {
  return spawnSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8', timeout: 110_000, env });
}

function makeStub(name: string, body: string) {
  const dir = mkdtempSync(join(tmpdir(), 'jev-tiebreak-stub-'));
  writeFileSync(join(dir, name), `#!/bin/sh\nD=$(dirname "$0")\necho "$*" >> "$D/${name}.log"\n${body}\n`, { mode: 0o755 });
  return dir;
}

let defaultStdoutValue: string | null = null;
let defaultStdoutLoaded = false;

function defaultStdout() {
  if (!defaultStdoutLoaded) {
    defaultStdoutValue = runScript([], process.env).stdout;
    defaultStdoutLoaded = true;
  }
  return defaultStdoutValue;
}

const strict = (a: string | null, g: string) => a === g;

function synthCensus(holdoutCorrect = 53) {
  return {
    holdoutTop1: { correct: holdoutCorrect, total: 70 },
    labels: [],
    isMatch: strict,
    describe: (s: string) => `desc ${s}`,
    rows: [
      { id: 'r1', file: 'labeled', split: 'train', prompt: 'p1', gold: 'a', goldKey: 'a', order: ['a', 'b', 'c'], cluster: ['a', 'b'], confidence: { a: 0.8, b: 0.9, c: 0.1 }, score: { a: 0.5, b: 0.4, c: 0.1 }, tau03: true },
      { id: 'r2', file: 'labeled', split: 'test', prompt: 'p2', gold: 'b', goldKey: 'b', order: ['a', 'b', 'c'], cluster: ['a', 'b'], confidence: { a: 0.9, b: 0.85, c: 0.1 }, score: { a: 0.6, b: 0.58, c: 0.2 }, tau03: false },
      { id: 'r3', file: 'holdout', split: 'train', prompt: 'p3', gold: 'z', goldKey: 'z', order: ['a', 'b'], cluster: ['a', 'b'], confidence: { a: 0.7, b: 0.7 }, score: { a: 0.5, b: 0.49 }, tau03: false },
      { id: 'r4', file: 'holdout', split: 'test', prompt: 'p4', gold: 'c', goldKey: 'c', order: ['c'], cluster: ['c'], confidence: { c: 0.9 }, score: { c: 0.9 }, tau03: false },
    ],
  };
}

describe('score-jev-tiebreak pure math', () => {
  it('binomTail returns the upper tail, with the empty and impossible edges', () => {
    expect(binomTail(5, 5)).toBe(0.03125);
    expect(binomTail(5, 0)).toBe(1);
    expect(binomTail(5, 6)).toBe(0);
  });

  it('minWins is the smallest count whose tail is at most alpha', () => {
    expect(minWins(4)).toBeNull();
    expect(minWins(5)).toBe(5);
    expect(minWins(23)).toBe(16);
    expect(minWins(55)).toBe(35);
  });

  it('winRate80 is the upper bisection bound that still clears power', () => {
    expect(winRate80(5)!.toFixed(3)).toBe('0.956');
    expect(winRate80(55)!.toFixed(3)).toBe('0.680');
    expect(winRate80(4)).toBeNull();
  });

  it('reorderSlots writes the new cluster into the old cluster positions', () => {
    expect(reorderSlots(['a', 'x', 'b', 'c'], ['a', 'b', 'c'], ['c', 'a', 'b'])).toEqual(['c', 'x', 'a', 'b']);
  });

  it('movePickFirst promotes a cluster member and leaves a stranger in place', () => {
    expect(movePickFirst(['a', 'x', 'b'], ['a', 'b'], 'b')).toEqual(['b', 'x', 'a']);
    expect(movePickFirst(['a', 'b'], ['a', 'b'], 'z')).toEqual(['a', 'b']);
  });

  it('rankMetrics averages reciprocal rank and counts prefix hits', () => {
    const order = ['a', 'b', 'c'];
    expect(reciprocalRank(order, 'b', strict)).toBe(0.5);
    expect(reciprocalRank(order, 'z', strict)).toBe(0);
    expect(rankMetrics([{ gold: 'b' }, { gold: 'z' }], () => order, strict)).toEqual({
      n: 2,
      mrr: 0.25,
      right1: 0,
      right3: 1,
    });
  });

  it('classifyRow separates a short cluster, a leading gold, a later gold, and a miss', () => {
    expect(classifyRow({ cluster: ['a'], gold: 'a' }, strict)).toBe('ineligible');
    expect(classifyRow({ cluster: ['g', 'a'], gold: 'g' }, strict)).toBe('gold_first');
    expect(classifyRow({ cluster: ['a', 'g'], gold: 'g' }, strict)).toBe('movable');
    expect(classifyRow({ cluster: ['a', 'b'], gold: 'g' }, strict)).toBe('gold_outside');
  });
});

describe('score-jev-tiebreak census loader', () => {
  it('returns the frozen holdout top-1, kept rows, and gate labels', async () => {
    const census = await loadCensus();
    expect(census.holdoutTop1).toEqual({ correct: 53, total: 70 });
    expect(census.rows).toHaveLength(241);
    expect(census.rows.filter((row) => row.file === 'labeled')).toHaveLength(177);
    expect(census.labels).toHaveLength(195);
    expect(census.labels.filter((label) => label.yes)).toHaveLength(127);
    for (const row of census.rows) {
      for (const skill of row.cluster) {
        expect(row.order).toContain(skill);
      }
    }
    const description = census.describe('sk-code');
    expect(typeof description).toBe('string');
    expect(description.length).toBeGreaterThan(0);
  }, 120_000);
});

describe('score-jev-tiebreak census summary', () => {
  it('reports group counts, the scorer comparator, and an underpowered movable set', () => {
    const summary = summarizeCensus(synthCensus());
    expect(summary.headroom).toBe('underpowered');
    expect(summary.voided).toBe(false);
    expect(summary.eligible).toBe(3);
    expect(summary.movable).toBe(1);
    expect(summary.lines).toEqual([
      'census: file=labeled rows=2 eligible=2 movable=1 gold_first=1 gold_outside=0 gold_top3=2 tau03=1 over25=0',
      'census: file=holdout rows=2 eligible=1 movable=0 gold_first=0 gold_outside=1 gold_top3=1 tau03=0 over25=0',
      'census: split=train rows=2 eligible=2 movable=0 gold_first=1 gold_outside=1 gold_top3=1 tau03=1 over25=0',
      'census: split=test rows=2 eligible=1 movable=1 gold_first=0 gold_outside=0 gold_top3=2 tau03=0 over25=0',
      'baseline: holdout_top1=53/70',
      'comparator: name=scorer rows=3 mrr=0.5000 right1=1 right3=2',
      'comparator: name=confidence rows=3 mrr=0.3333 right1=0 right3=2',
      'comparator: name=always_second rows=3 mrr=0.5000 right1=1 right3=2',
      'comparator: name=rerank rows=1 mrr=0.5000 right1=0 right3=1',
      'power: movable=1 decided_ceiling=2 min_wins=none win_rate_80=none',
      'underpowered',
    ]);
  });

  it('voids the comparison when the holdout top-1 baseline drifts', () => {
    const summary = summarizeCensus(synthCensus(52));
    expect(summary.voided).toBe(true);
    expect(summary.lines).toHaveLength(6);
    expect(summary.lines.slice(-2)).toEqual([
      'baseline: holdout_top1=52/70',
      'baseline mismatch: comparison void',
    ]);
  });

  it('folds leading matches and applies the zero-call orders', () => {
    const census = synthCensus();
    const fold = buildFold([census.rows[0], census.rows[2]], strict);
    expect(fold).toEqual(new Map([
      ['a', { success: 1, failure: 0 }],
      ['z', { success: 0, failure: 1 }],
    ]));
    expect(rerankOrder(census.rows[1], fold)).toEqual(['a', 'b', 'c']);
    expect(rerankOrder(
      { order: ['a', 'b'], score: { a: 0.5, b: 0.49 } },
      new Map([['b', { success: 5, failure: 0 }]]),
    )).toEqual(['b', 'a']);
    expect(confidenceOrder(census.rows[0])).toEqual(['b', 'a', 'c']);
    expect(alwaysSecondOrder(census.rows[1])).toEqual(['b', 'a', 'c']);
  });
});

describe('score-jev-tiebreak entry point', () => {
  it('returns 2 for an unknown flag', async () => {
    await expect(main(['--bogus'])).resolves.toBe(2);
  });

  it('prints a supplied census and returns 1 when the baseline voids the comparison', async () => {
    const lines: string[] = [];
    const out = (l: string) => lines.push(l);
    await expect(main([], { census: synthCensus(), out })).resolves.toBe(0);
    expect(lines).toEqual(summarizeCensus(synthCensus()).lines);
    await expect(main([], { census: synthCensus(52), out })).resolves.toBe(1);
    expect(lines[lines.length - 1]).toBe('baseline mismatch: comparison void');
  });

  it('default run prints the census and spawns no model binary', async () => {
    const stub = mkdtempSync(join(tmpdir(), 'jev-tiebreak-stub-'));
    try {
      writeFileSync(join(stub, 'jev'), `#!/bin/sh\necho "$*" >> "${join(stub, 'jev')}.log"\n`, { mode: 0o755 });
      const result = spawnSync(process.execPath, [SCRIPT], {
        encoding: 'utf8',
        timeout: 110_000,
        env: { ...process.env, PATH: `${stub}${delimiter}${process.env.PATH}` },
      });
      expect(result.status).toBe(0);
      const stdoutLines = (result.stdout ?? '').split('\n');
      expect(stdoutLines.filter((line) => line.startsWith('census: file=labeled rows=177 '))).toHaveLength(1);
      expect(stdoutLines.filter((line) => line.startsWith('census: file=holdout rows=64 '))).toHaveLength(1);
      expect(stdoutLines.filter((line) => line === 'baseline: holdout_top1=53/70')).toHaveLength(1);
      expect(stdoutLines.filter((line) => line.startsWith('comparator: name=scorer '))).toHaveLength(1);
      expect(stdoutLines.filter((line) => line.startsWith('comparator: name=confidence '))).toHaveLength(1);
      expect(stdoutLines.filter((line) => line.startsWith('comparator: name=always_second '))).toHaveLength(1);
      expect(stdoutLines.filter((line) => line.startsWith('comparator: name=rerank '))).toHaveLength(1);
      expect(stdoutLines.filter((line) => line.startsWith('power: movable='))).toHaveLength(1);
      expect(existsSync(join(stub, 'jev.log'))).toBe(false);
    } finally {
      rmSync(stub, { recursive: true, force: true });
    }
  }, 120_000);

  it('refuses a passing jev gate without --out before any billed call', () => {
    const stub = makeStub('jev', `case "$1" in --version) echo 'jev 0.6.2';; auth) exit 0;; esac\nexit 0`);
    try {
      const env: NodeJS.ProcessEnv = { ...process.env, PATH: `${stub}${delimiter}${process.env.PATH}`, JEV_PROVIDER: 'openrouter' };
      const result = runScript(['--jev'], env);
      expect(result.status).toBe(2);
      expect(result.stderr).toContain('--jev needs --out <dir> so every billed call is recorded');
      const prefix = defaultStdout() ?? '';
      expect((result.stdout ?? '').startsWith(prefix)).toBe(true);
      expect(readFileSync(join(stub, 'jev.log'), 'utf8').split('\n').filter((line) => line !== '')).toEqual([
        '--version',
        'auth status --provider openrouter',
      ]);
    } finally {
      rmSync(stub, { recursive: true, force: true });
    }
  }, 120_000);
});

describe('score-jev-tiebreak jev gate', () => {
  it('skips when auth status is not zero and records both invocations', () => {
    const stub = makeStub('jev', `case "$1" in --version) echo 'jev 0.6.2';; auth) exit 3;; esac`);
    try {
      const env: NodeJS.ProcessEnv = {
        ...process.env,
        PATH: `${stub}${delimiter}${process.env.PATH}`,
        JEV_PROVIDER: 'openrouter',
      };
      const result = runScript(['--jev'], env);
      expect(result.status).toBe(0);
      const prefix = defaultStdout() ?? '';
      const stdout = result.stdout ?? '';
      expect(stdout.startsWith(prefix)).toBe(true);
      expect(stdout.slice(prefix.length).split('\n').filter((line) => line !== '')).toEqual([
        `jev: path=${stub}/jev provider=openrouter`,
        'jev arm skipped: no credential',
      ]);
      expect(readFileSync(join(stub, 'jev.log'), 'utf8').split('\n').filter((line) => line !== '')).toEqual([
        '--version',
        'auth status --provider openrouter',
      ]);
    } finally {
      rmSync(stub, { recursive: true, force: true });
    }
  }, 120_000);

  it('skips when the reported version is not the pinned one', () => {
    const stub = makeStub('jev', `case "$1" in --version) echo '0.2.3';; esac`);
    try {
      const env: NodeJS.ProcessEnv = { ...process.env, PATH: `${stub}${delimiter}${process.env.PATH}` };
      delete env.JEV_PROVIDER;
      const result = runScript(['--jev'], env);
      expect(result.status).toBe(0);
      const prefix = defaultStdout() ?? '';
      const stdout = result.stdout ?? '';
      expect(stdout.startsWith(prefix)).toBe(true);
      expect(stdout.slice(prefix.length).split('\n').filter((line) => line !== '')).toEqual([
        `jev: path=${stub}/jev provider=official`,
        'jev arm skipped: version',
        `jev: found="0.2.3" path=${stub}/jev`,
      ]);
      expect(readFileSync(join(stub, 'jev.log'), 'utf8').split('\n').filter((line) => line !== '')).toEqual([
        '--version',
      ]);
    } finally {
      rmSync(stub, { recursive: true, force: true });
    }
  }, 120_000);

  it('skips when jev is not on PATH', () => {
    const env: NodeJS.ProcessEnv = { ...process.env, PATH: '/usr/bin:/bin' };
    delete env.JEV_PROVIDER;
    const result = runScript(['--jev'], env);
    expect(result.status).toBe(0);
    const prefix = defaultStdout() ?? '';
    const stdout = result.stdout ?? '';
    expect(stdout.startsWith(prefix)).toBe(true);
    expect(stdout.slice(prefix.length).split('\n').filter((line) => line !== '')).toEqual([
      'jev: path=none provider=official',
      'jev arm skipped: jev not on PATH',
    ]);
  }, 120_000);
});

function mk(id: string, gold: string, order: string[], cluster: string[], split = 'test') {
  const weights = Object.fromEntries(order.map((skill, index) => [skill, 1 - index / 10]));
  return {
    id,
    file: 'labeled',
    prompt: id,
    gold,
    goldKey: gold,
    order,
    cluster,
    split,
    tau03: false,
    confidence: weights,
    score: weights,
  };
}

describe('score-jev-tiebreak column and keep rule', () => {
  function recs(answersById: Record<string, Array<string | null>>) {
    return Object.fromEntries(
      Object.entries(answersById).map(([id, answers]) => [
        id,
        answers.map((answer) => ({ answer, wallMs: 10 })),
      ]),
    );
  }

  it('scores a mixed column as underpowered below five decided rows', () => {
    const rows = [
      mk('m1', 'b', ['a', 'b', 'c'], ['a', 'b']),
      mk('d1', 'a', ['a', 'b'], ['a', 'b']),
      mk('o1', 'z', ['a', 'b'], ['a', 'b']),
      mk('n1', 'b', ['a', 'b'], ['a', 'b']),
      mk('x1', 'b', ['a', 'b'], ['a', 'b']),
    ];
    const column = summarizeColumn('jev', rows, recs({
      m1: ['b', 'b', 'b'],
      d1: ['b', 'b', 'a'],
      o1: ['b', 'b', 'b'],
      n1: ['none', 'none', 'a'],
      x1: ['b', null, 'b'],
    }), { ...synthCensus(), rows });
    expect(column.measured).toBe(4);
    expect(column.unmeasured).toBe(1);
    expect(column.wins).toBe(1);
    expect(column.losses).toBe(1);
    expect(column.ties).toBe(1);
    expect(column.abstentions).toBe(1);
    expect(column.unstable).toBe(0);
    expect(column.decided).toBe(2);
    expect(column.movableWins).toBe(1);
    expect(column.goldDemotions).toBe(1);
    expect(column.noneOnGoldInCluster).toBe(1);
    expect(column.flip.toFixed(4)).toBe('0.1667');
    expect(column.pWin).toBe(0.75);
    expect(column.latency.p50).toBe(10);
    expect(column.verdict).toBe('underpowered');
    const summary = column;
    expect(Object.keys(summary.decidedRr)).toHaveLength(summary.decided);
    const verdict = verdictLine(summary, '');
    expect(verdict.startsWith('verdict: underpowered backend=')).toBe(true);
    expect(verdict.endsWith('p_win=0.7500 p_loss=0.7500 flip=0.1667')).toBe(true);
  });

  it('keeps a column when the sign, rank, right-3, and flip conditions all hold', () => {
    const rows = ['k1', 'k2', 'k3', 'k4', 'k5', 'k6'].map((id, index) => {
      const row = mk(id, 'b', ['a', 'c', 'b'], ['a', 'c', 'b'], index % 2 === 1 ? 'train' : 'test');
      row.confidence = { a: 0.9, c: 0.85, b: 0.8 };
      row.score = { a: 0.5, c: 0.45, b: 0.4 };
      return row;
    });
    const answers = Object.fromEntries(rows.map((row) => [row.id, ['b', 'b', 'b']]));
    const column = summarizeColumn('jev', rows, recs(answers), { ...synthCensus(), rows });
    expect(column.wins).toBe(6);
    expect(column.decided).toBe(6);
    expect(column.pWin).toBe(0.015625);
    expect(column.conditions.sign.held).toBe(true);
    expect(column.conditions.mrr.held).toBe(true);
    expect(column.conditions.right3.held).toBe(true);
    expect(column.conditions.flip.held).toBe(true);
    expect(column.verdict).toBe('keep');
    const summary = column;
    expect(verdictLine(summary, 'model=stub-model model_commit=mc1 source_commit=sc1')).toBe(
      'verdict: keep backend=jev decided=6 wins=6 losses=0 p_win=0.0156 p_loss=1.0000 flip=0.0000 model=stub-model model_commit=mc1 source_commit=sc1',
    );
    expect(columnLines(summary)[0]).toBe(
      'column: backend=jev rows=6 measured=6 wins=6 losses=0 ties=0 abstentions=0 unmeasured=0 unstable=0',
    );
    expect(columnLines(summary)[4]).toBe('column: backend=jev latency_p50_ms=10 latency_p95_ms=10');
  });

  it('counts all three answers of a three-way split as flips, which blocks a keep', () => {
    const rows = Array.from({ length: 25 }, (_, index) => {
      const row = mk(`s${index}`, 'b', ['a', 'c', 'b'], ['a', 'c', 'b'], index % 2 === 1 ? 'train' : 'test');
      row.confidence = { a: 0.9, c: 0.85, b: 0.8 };
      row.score = { a: 0.5, c: 0.45, b: 0.4 };
      return row;
    });
    const answers = Object.fromEntries(rows.map((row, index) => [row.id, index < 22 ? ['b', 'b', 'b'] : ['a', 'c', 'b']]));
    const column = summarizeColumn('jev', rows, recs(answers), { ...synthCensus(), rows });
    expect(column.measured).toBe(25);
    expect(column.wins).toBe(22);
    expect(column.unstable).toBe(3);
    expect(column.flip.toFixed(4)).toBe('0.1200');
    expect(column.conditions.flip.held).toBe(false);
    expect(column.verdict).not.toBe('keep');
  });

  it('stays inconclusive when the column does not beat the confidence order', () => {
    const rows = ['k1', 'k2', 'k3', 'k4', 'k5', 'k6'].map((id, index) => {
      const row = mk(id, 'b', ['a', 'c', 'b'], ['a', 'c', 'b'], index % 2 === 1 ? 'train' : 'test');
      row.confidence = { b: 0.95, a: 0.9, c: 0.85 };
      row.score = { a: 0.5, c: 0.45, b: 0.4 };
      return row;
    });
    const answers = Object.fromEntries(rows.map((row) => [row.id, ['b', 'b', 'b']]));
    const column = summarizeColumn('jev', rows, recs(answers), { ...synthCensus(), rows });
    expect(column.conditions.mrr.held).toBe(false);
    expect(column.conditions.sign.held).toBe(true);
    expect(column.verdict).toBe('inconclusive');
  });

  it('kills a column whose losses are one-sided', () => {
    const rows = ['k1', 'k2', 'k3', 'k4', 'k5', 'k6'].map((id) => mk(id, 'a', ['a', 'b'], ['a', 'b']));
    const answers = Object.fromEntries(rows.map((row) => [row.id, ['b', 'b', 'b']]));
    const column = summarizeColumn('jev', rows, recs(answers), { ...synthCensus(), rows });
    expect(column.losses).toBe(6);
    expect(column.goldDemotions).toBe(6);
    expect(column.verdict).toBe('kill');
  });

  it('counts a retried attempt in latency', () => {
    const rows = [mk('t1', 'b', ['a', 'b'], ['a', 'b'])];
    const records = { t1: [{ answer: 'b', wallMs: 10, retryWallMs: 1000 }, { answer: 'b', wallMs: 10 }, { answer: 'b', wallMs: 10 }] };
    const column = summarizeColumn('jev', rows, records, { ...synthCensus(), rows });
    expect(column.latency.p50).toBe(10);
    expect(column.latency.p95).toBe(1000);
  });
});

describe('score-jev-tiebreak report', () => {
  it('files columns and calibration', () => {
    expect(buildReport(
      { headroom: 'ok', lines: ['census line'] },
      {
        backend: 'jev',
        wins: 6,
        decidedRr: { r1: 1 },
        conditions: { sign: { value: 0.0156, held: true } },
        verdict: 'keep',
        line: 'verdict: keep backend=jev',
      },
    )).toEqual({
      headroom: 'ok',
      census: ['census line'],
      columns: {
        jev: {
          backend: 'jev',
          wins: 6,
          verdict: {
            outcome: 'keep',
            line: 'verdict: keep backend=jev',
            conditions: { sign: { value: 0.0156, held: true } },
          },
        },
      },
      calibration: {},
      stopped: {},
    });
    expect(buildReport({ headroom: 'ok', lines: [] }, { calibration: { measured: 3 } })).toEqual({
      headroom: 'ok',
      census: [],
      columns: {},
      calibration: { jev: { measured: 3 } },
      stopped: {},
    });
    expect(buildReport({ headroom: 'none', lines: [] }, undefined)).toEqual({
      headroom: 'none',
      census: [],
      columns: {},
      calibration: {},
      stopped: {},
    });
  });
});

describe('score-jev-tiebreak call helpers', () => {
  it('runs a child that reads stdin and keeps its exit code', async () => {
    const result = await spawnCall('/bin/sh', ['-c', 'cat; exit 3'], 'hello', process.env, 5000);
    expect(result.code).toBe(3);
    expect(result.stdout).toBe('hello');
    expect(result.timedOut).toBe(false);
    expect(result.wallMs).toBeGreaterThanOrEqual(0);
  });

  it('kills a child at the timeout without waiting for close', async () => {
    const t0 = Date.now();
    const result = await spawnCall('/bin/sh', ['-c', 'exec sleep 5'], '', process.env, 200);
    expect(result.timedOut).toBe(true);
    expect(result.code).toBeNull();
    expect(Date.now() - t0).toBeLessThan(2000);
  });

  it('reports a spawn failure as code 127', async () => {
    const result = await spawnCall('/nonexistent/jev-tiebreak-missing', [], '', process.env, 1000);
    expect(result.code).toBe(127);
  });

  it('appends one JSON line per record and ignores a missing outDir', () => {
    const dir = mkdtempSync(join(tmpdir(), 'jev-tiebreak-calls-'));
    try {
      writeCall(dir, { a: 1 });
      writeCall(dir, { a: 1 });
      const lines = readFileSync(join(dir, 'calls.jsonl'), 'utf8').split('\n').filter((line) => line !== '');
      expect(lines).toHaveLength(2);
      for (const line of lines) expect(JSON.parse(line)).toEqual({ a: 1 });
      expect(() => writeCall(undefined, { a: 1 })).not.toThrow();
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

describe('score-jev-tiebreak jev arm', () => {
  const stubBody = [
    `case "$1" in --version) echo 'jev 0.6.2'; exit 0;; auth) [ "$2" = test ] && echo '{"ok":true,"valid":true,"model":"stub-model"}'; exit 0;; esac`,
    `p=$(cat); case "$p" in *offkey*) echo '{"model":"stub-model","answers":{"answer":{"choice":"zzz","probabilities":{"zzz":0.9,"none":0.05}}}}'; exit 0;; *sigint*) exit 130;; *hang*) exec sleep 30;; *exit1*) exit 1;; *exit2*) exit 2;; *exit3*) exit 3;; *exit4*) exit 4;; esac`,
    `echo '{"model":"stub-model","answers":{"answer":{"choice":"b","probabilities":{"b":0.7,"none":0.1}}}}'`,
  ].join('\n');

  function census(prompts: string[]) {
    return {
      ...synthCensus(),
      rows: prompts.map((prompt, index) => ({
        ...mk(`r${index}`, 'b', ['a', 'b'], ['a', 'b'], index % 2 ? 'train' : 'test'),
        prompt,
      })),
    };
  }

  async function drive(prompts: string[]) {
    const stub = makeStub('jev', stubBody);
    const dir = mkdtempSync(join(tmpdir(), 'jev-tiebreak-arm-'));
    const lines: string[] = [];
    try {
      const code = await main(['--jev', '--out', dir], {
        census: census(prompts),
        out: (line: string) => lines.push(line),
        env: {
          ...process.env,
          PATH: `${stub}${delimiter}${process.env.PATH}`,
          JEV_PROVIDER: 'openrouter',
        },
        timeoutMs: 1500,
        backoffMs: 10,
      });
      const calls = readFileSync(join(dir, 'calls.jsonl'), 'utf8')
        .split('\n')
        .filter((line) => line !== '')
        .map((line) => JSON.parse(line));
      const logLines = readFileSync(join(stub, 'jev.log'), 'utf8')
        .split('\n')
        .filter((line) => line !== '');
      return { code, lines, calls, logLines };
    } finally {
      rmSync(stub, { recursive: true, force: true });
      rmSync(dir, { recursive: true, force: true });
    }
  }

  it('records retries, failures, timeouts, and measured picks', async () => {
    const result = await drive(['exit4 a', 'exit1 b', 'hang c', 'ok d', 'ok e', 'ok f']);
    expect(result.code).toBe(0);

    for (const call of result.calls) {
      expect(typeof call.wall_ms).toBe('number');
      expect(call.provider).toBe('openrouter');
      expect(call.model).toBe('stub-model');
      expect(typeof call.status).toBe('string');
    }

    const choice = result.calls.filter((call) => call.kind === 'choice');
    const byRow = (id: string) => choice.filter((call) => call.row_id === id);

    expect(byRow('r0')).toHaveLength(6);
    for (const call of byRow('r0')) {
      expect(call.status).toBe('unmeasured');
      expect(call.exit_code).toBe(4);
    }
    expect(byRow('r1').map((call) => call.status)).toEqual(['unmeasured', 'unmeasured', 'unmeasured']);
    expect(byRow('r2').map((call) => call.status)).toEqual(['unmeasured_timeout', 'unmeasured_timeout', 'unmeasured_timeout']);
    for (const id of ['r3', 'r4', 'r5']) {
      const rowCalls = byRow(id);
      expect(rowCalls).toHaveLength(3);
      for (const call of rowCalls) {
        expect(call.status).toBe('measured');
        expect(call.answer).toBe('b');
        expect(call.pick_prob).toBe(0.7);
        expect(call.none_prob).toBe(0.1);
      }
    }

    const choiceLines = result.logLines.filter((line) => line.startsWith('choice'));
    expect(choiceLines).toHaveLength(21);
    expect(choice).toHaveLength(choiceLines.length);
    for (const line of result.logLines) {
      if (line !== '--version') expect(line).toContain('--provider openrouter');
    }

    const verdicts = result.lines.filter((line) => line.startsWith('verdict: '));
    expect(verdicts).toHaveLength(1);
    expect(verdicts[0].endsWith('provider=openrouter model=stub-model')).toBe(true);
  }, 60_000);

  it('stops on a rejected key and reports the rows that finished', async () => {
    const result = await drive(['ok a', 'ok b', 'exit3 c', 'ok d', 'ok e', 'ok f']);
    expect(result.lines).toContain('jev arm stopped: key rejected');
    expect(result.lines).toContain('jev: partial_rows=2');
    expect(result.lines.some((line) => line.startsWith('verdict: '))).toBe(false);
    const last = result.calls[result.calls.length - 1];
    expect(last).toMatchObject({ kind: 'choice', row_id: 'r2', pass: 1, exit_code: 3, answer: null, status: 'unmeasured' });
  }, 60_000);

  it('stops on a usage error before any row finishes', async () => {
    const result = await drive(['exit2 a', 'ok b', 'ok c', 'ok d', 'ok e', 'ok f']);
    expect(result.lines).toContain('jev arm stopped: usage error');
    expect(result.lines).toContain('jev: partial_rows=0');
    const choice = result.calls.filter((call) => call.kind === 'choice');
    expect(choice).toHaveLength(1);
    expect(choice[0]).toMatchObject({ row_id: 'r0', exit_code: 2, status: 'unmeasured' });
  }, 60_000);

  it('names the model unknown when auth test omits it', async () => {
    const stub = makeStub('jev', [
      `case "$1" in --version) echo 'jev 0.6.2'; exit 0;; auth) [ "$2" = test ] && echo '{"ok":true,"valid":true}'; exit 0;; esac`,
      'exit 2',
    ].join('\n'));
    const dir = mkdtempSync(join(tmpdir(), 'jev-tiebreak-gate-out-'));
    const lines: string[] = [];
    try {
      await main(['--jev', '--out', dir], {
        census: census(['a', 'b', 'c', 'd', 'e', 'f']),
        out: (line: string) => lines.push(line),
        env: { ...process.env, PATH: `${stub}${delimiter}${process.env.PATH}`, JEV_PROVIDER: 'openrouter' },
        timeoutMs: 1500,
        backoffMs: 10,
      });
    } finally {
      rmSync(stub, { recursive: true, force: true });
      rmSync(dir, { recursive: true, force: true });
    }
    expect(lines).toContain('jev: auth_test provider=openrouter model=unknown');
    expect(lines).toContain('jev arm stopped: usage error');
  }, 60_000);

  it('leaves a row out of the sign test when jev answers a key it was not offered', async () => {
    const result = await drive(['offkey a', 'ok b', 'ok c', 'ok d', 'ok e', 'ok f']);
    expect(result.code).toBe(0);
    expect(result.lines.some((line) => line.startsWith('jev arm stopped'))).toBe(false);
    const choice = result.calls.filter((call) => call.kind === 'choice');
    const offkey = choice.filter((call) => call.row_id === 'r0');
    expect(offkey).toHaveLength(3);
    for (const call of offkey) expect(call).toMatchObject({ exit_code: 0, answer: null, pick_prob: null, status: 'unmeasured' });
    expect(choice.filter((call) => call.row_id !== 'r0').map((call) => call.status)).toEqual(Array(15).fill('measured'));
    expect(result.lines).toContain('column: backend=jev rows=6 measured=5 wins=5 losses=0 ties=0 abstentions=0 unmeasured=1 unstable=0');
    expect(result.lines.find((line) => line.startsWith('verdict: '))).toContain(' decided=5 wins=5 losses=0 ');
  }, 60_000);

  it('stops on an interrupt at the first judgment and scores nothing', async () => {
    const result = await drive(['sigint a', 'ok b', 'ok c', 'ok d', 'ok e', 'ok f']);
    expect(result.code).toBe(0);
    expect(result.lines).toContain('jev arm stopped: interrupted');
    expect(result.lines).toContain('jev: partial_rows=0');
    expect(result.lines.some((line) => line.startsWith('column: ') || line.startsWith('verdict: '))).toBe(false);
    const choice = result.calls.filter((call) => call.kind === 'choice');
    expect(choice).toHaveLength(1);
    expect(choice[0]).toMatchObject({ row_id: 'r0', pass: 1, exit_code: 130, answer: null, status: 'unmeasured' });
    expect(result.logLines.filter((line) => line.startsWith('choice'))).toHaveLength(1);
  }, 60_000);
});

describe('score-jev-tiebreak calibration', () => {
  it('scores accuracy, F1, Brier, ECE, and temperature, including the empty list', () => {
    const metrics = calibrationMetrics([
      { p: 0.9, yes: true },
      { p: 0.8, yes: true },
      { p: 0.3, yes: false },
      { p: 0.6, yes: false },
    ]);
    expect(metrics.n).toBe(4);
    expect(metrics.accuracy).toBe(0.75);
    expect(metrics.f1).toBe(0.8);
    expect(metrics.brier).toBeCloseTo(0.125);
    expect(metrics.ece5).toBeCloseTo(0.3);
    expect(metrics.temperature).toBe(0.53);
    expect(calibrationMetrics([])).toEqual({
      n: 0,
      accuracy: null,
      f1: null,
      brier: null,
      ece5: null,
      temperature: null,
    });
  });
});

describe('score-jev-tiebreak jev calibration', () => {
  it('asks one noul per labeled prompt over three passes when the census is underpowered', async () => {
    const body = [
      `case "$1" in --version) echo 'jev 0.6.2'; exit 0;; auth) [ "$2" = test ] && echo '{"ok":true,"valid":true,"model":"stub-model"}'; exit 0;; esac`,
      `p=$(cat); case "$p" in *bad*) echo 'not json'; exit 0;; *write*) v=0.9;; *) v=0.2;; esac`,
      `echo "{\\"model\\":\\"stub-model\\",\\"answers\\":{\\"answer\\":{\\"noul\\":$v}}}"`,
    ].join('\n');
    const stub = makeStub('jev', body);
    const dir = mkdtempSync(join(tmpdir(), 'jev-tiebreak-jev-cal-'));
    const lines: string[] = [];
    try {
      const code = await main(['--jev', '--out', dir], {
        census: {
          ...synthCensus(),
          labels: [
            { id: 'l1', prompt: 'write a file', yes: true },
            { id: 'l2', prompt: 'read only', yes: false },
            { id: 'l3', prompt: 'write docs', yes: true },
            { id: 'l4', prompt: 'bad row', yes: false },
          ],
        },
        out: (line: string) => lines.push(line),
        env: {
          ...process.env,
          PATH: `${stub}${delimiter}${process.env.PATH}`,
          JEV_PROVIDER: 'openrouter',
        },
        timeoutMs: 1500,
        backoffMs: 10,
      });
      expect(code).toBe(0);
      expect(lines).toContain('underpowered');
      expect(lines).toContain('jev: payload=routing corpus prompts planned_calls=13 est_input_tokens=152');
      const calibration = lines.find((line) => line.startsWith('calibration: backend=jev n=4 measured=3 accuracy=1.0000 f1=1.0000 brier=0.0200 flip=0.0000 latency_p50_ms='));
      expect(calibration?.endsWith(' archived_f1=0.9843 provider=openrouter model=stub-model')).toBe(true);
      expect(lines.some((line) => line.startsWith('verdict: '))).toBe(false);
      expect(lines.some((line) => line.startsWith('column: '))).toBe(false);
      const calls = readFileSync(join(dir, 'calls.jsonl'), 'utf8')
        .split('\n')
        .filter((line) => line !== '')
        .map((line) => JSON.parse(line));
      const noul = calls.filter((call) => call.kind === 'noul');
      expect(noul).toHaveLength(12);
      for (const call of noul) expect(call.provider).toBe('openrouter');
      const bad = noul.filter((call) => call.row_id === 'l4');
      expect(bad).toHaveLength(3);
      for (const call of bad) {
        expect(call.status).toBe('unmeasured');
        expect(call.answer).toBeNull();
      }
      const logLines = readFileSync(join(stub, 'jev.log'), 'utf8')
        .split('\n')
        .filter((line) => line !== '');
      expect(logLines.filter((line) => line.startsWith('noul --provider openrouter -q '))).toHaveLength(12);
      expect(logLines.some((line) => line.startsWith('choice'))).toBe(false);
    } finally {
      rmSync(stub, { recursive: true, force: true });
      rmSync(dir, { recursive: true, force: true });
    }
  }, 60_000);
});

describe('score-jev-tiebreak jev refusal by headroom', () => {
  async function run(census: ReturnType<typeof synthCensus>) {
    const stub = makeStub('jev', `case "$1" in --version) echo 'jev 0.6.2';; auth) exit 0;; esac\nexit 0`);
    const lines: string[] = [];
    const errors: string[] = [];
    const spy = vi.spyOn(process.stderr, 'write').mockImplementation((chunk: string | Uint8Array) => { errors.push(String(chunk)); return true; });
    try {
      const env = { ...process.env, PATH: `${stub}${delimiter}${process.env.PATH}`, JEV_PROVIDER: 'openrouter' };
      const code = await main(['--jev'], { census, out: (line: string) => lines.push(line), env, timeoutMs: 1500, backoffMs: 10 });
      const log = readFileSync(join(stub, 'jev.log'), 'utf8').split('\n').filter((line) => line !== '');
      return { code, lines, errors: errors.join(''), log };
    } finally {
      spy.mockRestore();
      rmSync(stub, { recursive: true, force: true });
    }
  }

  it('runs a passing gate at no headroom without --out and makes no paid call', async () => {
    const rows = ['n0', 'n1', 'n2', 'n3', 'n4', 'n5'].map((id) => mk(id, 'a', ['a', 'b'], ['a', 'b']));
    const result = await run({ ...synthCensus(), rows });
    expect(result.code).toBe(0);
    expect(result.lines).toContain('no headroom');
    expect(result.errors).not.toContain('needs --out');
    expect(result.log).toEqual(['--version', 'auth status --provider openrouter']);
  });

  it('refuses a passing gate at underpowered without --out before any paid call', async () => {
    const result = await run(synthCensus());
    expect(result.code).toBe(2);
    expect(result.lines).toContain('underpowered');
    expect(result.errors).toContain('--jev needs --out <dir> so every billed call is recorded');
    expect(result.log).toEqual(['--version', 'auth status --provider openrouter']);
  });
});
