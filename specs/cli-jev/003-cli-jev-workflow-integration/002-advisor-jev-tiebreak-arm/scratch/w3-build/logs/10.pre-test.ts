// ───────────────────────────────────────────────────────────────
// MODULE: Jev Tie-Break Eval Tests
// ───────────────────────────────────────────────────────────────
// Offline checks for the binomial keep line and the cluster reorder. No model call.

import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import {
  binomTail,
  minWins,
  winRate80,
  reciprocalRank,
  rankMetrics,
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
      for (const name of ['jev', 'cli-deem']) {
        writeFileSync(join(stub, name), `#!/bin/sh\necho "$*" >> "${join(stub, name)}.log"\n`, { mode: 0o755 });
      }
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
      expect(existsSync(join(stub, 'cli-deem.log'))).toBe(false);
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

describe('score-jev-tiebreak deem gate', () => {
  it('skips a stub backend', () => {
    const stub = makeStub('cli-deem', `echo '{"ok":true,"backend":"stub","model":"deem-0.8-v1","model_commit":"m1","source_commit":"s1"}'`);
    try {
      const env: NodeJS.ProcessEnv = { ...process.env, PATH: `${stub}${delimiter}${process.env.PATH}` };
      const result = runScript(['--deem'], env);
      expect(result.status).toBe(0);
      const prefix = defaultStdout() ?? '';
      const stdout = result.stdout ?? '';
      expect(stdout.startsWith(prefix)).toBe(true);
      expect(stdout.slice(prefix.length).split('\n').filter((line) => line !== '')).toEqual([
        'deem arm skipped: stub backend',
      ]);
      expect(readFileSync(join(stub, 'cli-deem.log'), 'utf8').split('\n').filter((line) => line !== '')).toEqual(['health']);
    } finally {
      rmSync(stub, { recursive: true, force: true });
    }
  }, 120_000);

  it('skips a model other than the pinned one', () => {
    const stub = makeStub('cli-deem', `echo '{"ok":true,"backend":"torch","model":"deem-1.5","model_commit":"m1","source_commit":"s1"}'`);
    try {
      const env: NodeJS.ProcessEnv = { ...process.env, PATH: `${stub}${delimiter}${process.env.PATH}` };
      const result = runScript(['--deem'], env);
      expect(result.status).toBe(0);
      const prefix = defaultStdout() ?? '';
      const stdout = result.stdout ?? '';
      expect(stdout.startsWith(prefix)).toBe(true);
      expect(stdout.slice(prefix.length).split('\n').filter((line) => line !== '')).toEqual([
        'deem arm skipped: model',
        'deem: found="deem-1.5"',
      ]);
      expect(readFileSync(join(stub, 'cli-deem.log'), 'utf8').split('\n').filter((line) => line !== '')).toEqual(['health']);
    } finally {
      rmSync(stub, { recursive: true, force: true });
    }
  }, 120_000);

  it('skips a refused model reported on stderr', () => {
    const stub = makeStub('cli-deem', `echo '{"ok":false,"error":"refused model: deem-1.5, expected deem-0.8-v1"}' >&2; exit 3`);
    try {
      const env: NodeJS.ProcessEnv = { ...process.env, PATH: `${stub}${delimiter}${process.env.PATH}` };
      const result = runScript(['--deem'], env);
      expect(result.status).toBe(0);
      const prefix = defaultStdout() ?? '';
      const stdout = result.stdout ?? '';
      expect(stdout.startsWith(prefix)).toBe(true);
      expect(stdout.slice(prefix.length).split('\n').filter((line) => line !== '')).toEqual([
        'deem arm skipped: model',
        'deem: found="refused model: deem-1.5, expected deem-0.8-v1"',
      ]);
      expect(readFileSync(join(stub, 'cli-deem.log'), 'utf8').split('\n').filter((line) => line !== '')).toEqual(['health']);
    } finally {
      rmSync(stub, { recursive: true, force: true });
    }
  }, 120_000);

  it('skips when the health check is not reachable', () => {
    const stub = makeStub('cli-deem', `echo '{"ok":false,"error":"Deem unreachable: ECONNREFUSED"}' >&2; exit 4`);
    try {
      const env: NodeJS.ProcessEnv = { ...process.env, PATH: `${stub}${delimiter}${process.env.PATH}` };
      const result = runScript(['--deem'], env);
      expect(result.status).toBe(0);
      const prefix = defaultStdout() ?? '';
      const stdout = result.stdout ?? '';
      expect(stdout.startsWith(prefix)).toBe(true);
      expect(stdout.slice(prefix.length).split('\n').filter((line) => line !== '')).toEqual([
        'deem arm skipped: not reachable',
      ]);
      expect(readFileSync(join(stub, 'cli-deem.log'), 'utf8').split('\n').filter((line) => line !== '')).toEqual(['health']);
    } finally {
      rmSync(stub, { recursive: true, force: true });
    }
  }, 120_000);

  it('skips a health body that is not json', () => {
    const stub = makeStub('cli-deem', `echo 'not json'`);
    try {
      const env: NodeJS.ProcessEnv = { ...process.env, PATH: `${stub}${delimiter}${process.env.PATH}` };
      const result = runScript(['--deem'], env);
      expect(result.status).toBe(0);
      const prefix = defaultStdout() ?? '';
      const stdout = result.stdout ?? '';
      expect(stdout.startsWith(prefix)).toBe(true);
      expect(stdout.slice(prefix.length).split('\n').filter((line) => line !== '')).toEqual([
        'deem arm skipped: bad health response',
        'deem: found="not json"',
      ]);
      expect(readFileSync(join(stub, 'cli-deem.log'), 'utf8').split('\n').filter((line) => line !== '')).toEqual(['health']);
    } finally {
      rmSync(stub, { recursive: true, force: true });
    }
  }, 120_000);

  it('prints the health line when the pinned torch backend answers', () => {
    const stub = makeStub('cli-deem', `echo '{"ok":true,"backend":"torch","model":"deem-0.8-v1","model_commit":"m1","source_commit":"s1"}'`);
    try {
      const env: NodeJS.ProcessEnv = { ...process.env, PATH: `${stub}${delimiter}${process.env.PATH}` };
      const result = runScript(['--deem'], env);
      expect(result.status).toBe(0);
      const prefix = defaultStdout() ?? '';
      const stdout = result.stdout ?? '';
      expect(stdout.startsWith(prefix)).toBe(true);
      expect(stdout.slice(prefix.length).split('\n').filter((line) => line !== '')).toEqual([
        'deem: health backend=torch model=deem-0.8-v1 model_commit=m1 source_commit=s1',
      ]);
      expect(readFileSync(join(stub, 'cli-deem.log'), 'utf8').split('\n').filter((line) => line !== '')).toEqual(['health']);
    } finally {
      rmSync(stub, { recursive: true, force: true });
    }
  }, 120_000);
});

describe('score-jev-tiebreak column and keep rule', () => {
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
    const column = summarizeColumn('deem', rows, recs({
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
    const column = summarizeColumn('deem', rows, recs(answers), { ...synthCensus(), rows });
    expect(column.wins).toBe(6);
    expect(column.decided).toBe(6);
    expect(column.pWin).toBe(0.015625);
    expect(column.conditions.sign.held).toBe(true);
    expect(column.conditions.mrr.held).toBe(true);
    expect(column.conditions.right3.held).toBe(true);
    expect(column.conditions.flip.held).toBe(true);
    expect(column.verdict).toBe('keep');
    const summary = column;
    expect(verdictLine(summary, 'model=deem-0.8-v1 model_commit=mc1 source_commit=sc1')).toBe(
      'verdict: keep backend=deem decided=6 wins=6 losses=0 p_win=0.0156 p_loss=1.0000 flip=0.0000 model=deem-0.8-v1 model_commit=mc1 source_commit=sc1',
    );
    expect(columnLines(summary)[0]).toBe(
      'column: backend=deem rows=6 measured=6 wins=6 losses=0 ties=0 abstentions=0 unmeasured=0 unstable=0',
    );
    expect(columnLines(summary)[4]).toBe('column: backend=deem latency_p50_ms=10 latency_p95_ms=10');
  });

  it('stays inconclusive when the column does not beat the confidence order', () => {
    const rows = ['k1', 'k2', 'k3', 'k4', 'k5', 'k6'].map((id, index) => {
      const row = mk(id, 'b', ['a', 'c', 'b'], ['a', 'c', 'b'], index % 2 === 1 ? 'train' : 'test');
      row.confidence = { b: 0.95, a: 0.9, c: 0.85 };
      row.score = { a: 0.5, c: 0.45, b: 0.4 };
      return row;
    });
    const answers = Object.fromEntries(rows.map((row) => [row.id, ['b', 'b', 'b']]));
    const column = summarizeColumn('deem', rows, recs(answers), { ...synthCensus(), rows });
    expect(column.conditions.mrr.held).toBe(false);
    expect(column.conditions.sign.held).toBe(true);
    expect(column.verdict).toBe('inconclusive');
  });

  it('kills a column whose losses are one-sided', () => {
    const rows = ['k1', 'k2', 'k3', 'k4', 'k5', 'k6'].map((id) => mk(id, 'a', ['a', 'b'], ['a', 'b']));
    const answers = Object.fromEntries(rows.map((row) => [row.id, ['b', 'b', 'b']]));
    const column = summarizeColumn('deem', rows, recs(answers), { ...synthCensus(), rows });
    expect(column.losses).toBe(6);
    expect(column.goldDemotions).toBe(6);
    expect(column.verdict).toBe('kill');
  });
});
