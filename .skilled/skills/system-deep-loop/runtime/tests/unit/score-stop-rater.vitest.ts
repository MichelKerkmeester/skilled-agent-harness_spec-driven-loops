// ───────────────────────────────────────────────────────────────────
// MODULE: score-stop-rater
//   Census walk (listStateFiles, readConfig, isMovable, deltaIterationFiles)
//   Gold derivation (deriveGold)
//   Inert novelty window (isInertWindow)
//   Stop replay (readStateRecords, coverageSeries, replayVote, stopFor, rightOf, pickBaseline, gateLine)
//   Label gate (parseGoldReads, labelGate)
//   Jev gate and published check (which, jevGate, existsAtOriginMain, withheldRecords)
//   Jev arm (buildState, spawnCall, createCallLog, runJevArm)
//   Deem gate and arm (deemCommand, readDeemHealth, deemGate, runDeemArm)
//   Verdict and requalify (binomialTail, formatP, decideVerdict, summarizeColumn, verdictLine, readStoredReport)
//   Report (buildReport, writeReport)
//   Census run (main)
// ───────────────────────────────────────────────────────────────────

import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const rater = require(path.join(TEST_DIR, '../../scripts/score-stop-rater.cjs')) as Record<string, any>;

const tempDirs: string[] = [];

function tempDir(prefix: string): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

afterEach(() => {
  for (const dir of tempDirs.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
});

function gitRepo(): string {
  const dir = tempDir('stop-rater-repo-');
  execFileSync('git', ['init', '-q'], { cwd: dir });
  return dir;
}

function commitAll(dir: string): void {
  execFileSync('git', ['add', '-A'], { cwd: dir });
  execFileSync('git', ['-c', 'user.name=test', '-c', 'user.email=test@example.com', '-c', 'commit.gpgsign=false', '-c', 'core.hooksPath=/dev/null', 'commit', '-qm', 'fixture'], { cwd: dir });
  execFileSync('git', ['update-ref', 'refs/remotes/origin/main', 'HEAD'], { cwd: dir });
}

function iteration(n: number, ratio: number, status = 'complete'): Record<string, unknown> {
  return { type: 'iteration', iteration: n, status, focus: 'fixture', findingsCount: 1, newInfoRatio: ratio };
}

function makeLineage(
  repo: string,
  name: string,
  opts: {
    config?: Record<string, unknown>;
    records?: Array<Record<string, unknown>>;
    deltas?: Record<string, Array<Record<string, unknown>>>;
  },
): void {
  const dir = path.join(repo, name);
  fs.mkdirSync(dir, { recursive: true });
  if (opts.config !== undefined) {
    fs.writeFileSync(path.join(dir, 'deep-research-config.json'), JSON.stringify(opts.config), 'utf8');
  }
  fs.writeFileSync(
    path.join(dir, 'deep-research-state.jsonl'),
    (opts.records ?? []).map((record) => JSON.stringify(record)).join('\n') + '\n',
    'utf8',
  );
  for (const [file, rows] of Object.entries(opts.deltas ?? {})) {
    fs.mkdirSync(path.join(dir, 'deltas'), { recursive: true });
    fs.writeFileSync(
      path.join(dir, 'deltas', file),
      rows.map((record) => JSON.stringify(record)).join('\n') + '\n',
      'utf8',
    );
  }
}

async function runMain(
  argv: string[],
  repoRoot: string,
): Promise<{ code: number; lines: string[]; errs: string[] }> {
  const lines: string[] = [];
  const errs: string[] = [];
  const code = await rater.main(argv, {
    out: (line: string) => lines.push(line),
    err: (line: string) => errs.push(line),
    repoRoot,
  });
  return { code, lines, errs };
}

function censusOf(lines: string[]): Record<string, number> {
  const line = lines.find((entry) => entry.startsWith('lineages: ')) as string;
  expect(line).toBeDefined();
  const match = /^lineages: tracked (\d+) no config (\d+) forced (\d+) no deltas (\d+) kept (\d+) no gold (\d+) sampled (\d+) inert (\d+)$/.exec(line);
  expect(match).not.toBeNull();
  const keys = ['tracked', 'noConfig', 'forced', 'noDeltas', 'kept', 'noGold', 'sampled', 'inert'];
  return Object.fromEntries(keys.map((key, index) => [key, Number((match as RegExpExecArray)[index + 1])]));
}

function stubBackends(): { log: string; env: NodeJS.ProcessEnv } {
  const stubDir = tempDir('stop-rater-stubs-');
  const log = path.join(stubDir, 'backends.log');
  for (const name of ['jev', 'cli-deem']) {
    fs.writeFileSync(
      path.join(stubDir, name),
      `#!/bin/sh\necho "$0 $*" >> '${log}'\n`,
      { mode: 0o755 },
    );
  }
  return { log, env: { ...process.env, PATH: `${stubDir}${path.delimiter}${process.env.PATH ?? ''}` } };
}

function deemStub(body: string): { dir: string; log: string; env: NodeJS.ProcessEnv } {
  const dir = tempDir('stop-rater-deem-');
  const log = path.join(dir, 'cli-deem.log');
  fs.writeFileSync(path.join(dir, 'cli-deem'), `#!/bin/sh\necho "$*" >> '${log}'\n${body}\n`, { mode: 0o755 });
  const env: NodeJS.ProcessEnv = { ...process.env, PATH: `${dir}${path.delimiter}${process.env.PATH ?? ''}` };
  return { dir, log, env };
}

async function runWithEnv(
  argv: string[],
  repoRoot: string,
  env: NodeJS.ProcessEnv,
): Promise<{ code: number; lines: string[]; errs: string[] }> {
  const lines: string[] = [];
  const errs: string[] = [];
  const code = await rater.main(argv, {
    out: (line: string) => lines.push(line),
    err: (line: string) => errs.push(line),
    repoRoot,
    env,
    timeoutMs: 5000,
  });
  return { code, lines, errs };
}

function fiveLineageRepo(): string {
  const repo = gitRepo();
  for (let index = 0; index < 5; index += 1) {
    makeLineage(repo, `lineage-${index}`, {
      config: {},
      records: [iteration(1, 0.04), iteration(2, 0.04), iteration(3, 0.04)],
      deltas: {
        'iter-001.jsonl': [{ type: 'finding', source: `src-${index}-a` }],
        'iter-002.jsonl': [{ type: 'finding', source: `src-${index}-a` }],
        'iter-003.jsonl': [{ type: 'finding', source: `src-${index}-a` }],
      },
    });
  }
  commitAll(repo);
  return repo;
}

function writeGoldReads(repo: string, differAt: number | null): string {
  const rows = [0, 1, 2, 3, 4].map((index) => {
    const { gold } = rater.deriveGold(rater.deltaIterationFiles(path.join(repo, `lineage-${index}`)));
    return {
      lineage: `lineage-${index}`,
      gold_iteration: index === differAt ? gold + 1 : gold,
      labeler: 'operator',
    };
  });
  const dir = tempDir('stop-rater-reads-');
  const file = path.join(dir, 'gold-reads.jsonl');
  fs.writeFileSync(file, rows.map((row) => JSON.stringify(row)).join('\n') + '\n', 'utf8');
  return file;
}

describe('score-stop-rater walker', () => {
  it('walker keeps a movable lineage', async () => {
    const repo = gitRepo();
    makeLineage(repo, 'lineage-a', {
      config: {},
      records: [iteration(1, 0.5)],
      deltas: { 'iter-001.jsonl': [{ type: 'finding', source: 'src-a' }] },
    });
    commitAll(repo);
    const { code, lines, errs } = await runMain([], repo);
    expect(errs).toEqual([]);
    expect(code).toBe(0);
    const census = censusOf(lines);
    expect(census.tracked).toBe(1);
    expect(census.kept).toBe(1);
    expect(census.sampled).toBe(1);
  });

  it('walker drops a max-iterations lineage', async () => {
    const repo = gitRepo();
    makeLineage(repo, 'lineage-a', {
      config: { stopPolicy: 'max-iterations' },
      records: [iteration(1, 0.5)],
      deltas: { 'iter-001.jsonl': [{ type: 'finding', source: 'src-a' }] },
    });
    commitAll(repo);
    const { code, lines } = await runMain([], repo);
    expect(code).toBe(0);
    const census = censusOf(lines);
    expect(census.forced).toBe(1);
    expect(census.kept).toBe(0);
  });

  it('walker drops an off-mode and a min>=max lineage', async () => {
    const repo = gitRepo();
    makeLineage(repo, 'lineage-off', {
      config: { convergenceMode: 'off' },
      records: [iteration(1, 0.5)],
      deltas: { 'iter-001.jsonl': [{ type: 'finding', source: 'src-a' }] },
    });
    makeLineage(repo, 'lineage-floor', {
      config: { minIterations: 5, maxIterations: 3 },
      records: [iteration(1, 0.5)],
      deltas: { 'iter-001.jsonl': [{ type: 'finding', source: 'src-b' }] },
    });
    commitAll(repo);
    const { code, lines } = await runMain([], repo);
    expect(code).toBe(0);
    const census = censusOf(lines);
    expect(census.forced).toBe(2);
    expect(census.kept).toBe(0);
  });

  it('walker drops an anti-convergence off-mode lineage', async () => {
    const repo = gitRepo();
    makeLineage(repo, 'lineage-a', {
      config: { antiConvergence: { convergenceMode: 'off' } },
      records: [iteration(1, 0.5)],
      deltas: { 'iter-001.jsonl': [{ type: 'finding', source: 'src-a' }] },
    });
    commitAll(repo);
    const { code, lines } = await runMain([], repo);
    expect(code).toBe(0);
    const census = censusOf(lines);
    expect(census.forced).toBe(1);
    expect(census.kept).toBe(0);
  });

  it('sample keeps the first 25 lineages by SHA-256 of the path', async () => {
    const repo = gitRepo();
    const names = Array.from({ length: 30 }, (_, index) => `lineage-${index}`);
    for (const name of names) {
      makeLineage(repo, name, {
        config: {},
        records: [iteration(1, 0.5)],
        deltas: { 'iter-001.jsonl': [{ type: 'finding', source: `src-${name}` }] },
      });
    }
    commitAll(repo);
    const outDir = tempDir('stop-rater-out-');
    const { code, errs } = await runMain(['--out', outDir], repo);
    expect(code).toBe(0);
    expect(errs).toEqual([]);
    const report = JSON.parse(fs.readFileSync(path.join(outDir, 'report.json'), 'utf8'));
    const hash = (name: string) => crypto.createHash('sha256').update(name).digest('hex');
    const expected = [...names].sort((a, b) => (hash(a) < hash(b) ? -1 : hash(a) > hash(b) ? 1 : 0)).slice(0, 25);
    expect(report.lineages.map((entry: { path: string }) => entry.path)).toEqual(expected);
  });
});

describe('score-stop-rater gold', () => {
  it('gold picks the last first-appearance source', () => {
    const dir = tempDir('stop-rater-gold-');
    fs.mkdirSync(path.join(dir, 'deltas'));
    fs.writeFileSync(path.join(dir, 'deltas', 'iter-001.jsonl'), JSON.stringify({ type: 'finding', source: 'A' }) + '\n', 'utf8');
    fs.writeFileSync(path.join(dir, 'deltas', 'iter-002.jsonl'), JSON.stringify({ type: 'finding', source: 'B' }) + '\n', 'utf8');
    fs.writeFileSync(path.join(dir, 'deltas', 'iter-003.jsonl'), JSON.stringify({ type: 'finding', source: 'A' }) + '\n', 'utf8');
    const files = rater.deltaIterationFiles(dir);
    const result = rater.deriveGold(files);
    expect(result.gold).toBe(2);
  });

  it('gold counts sources and evidence arrays', () => {
    const dir = tempDir('stop-rater-gold-arrays-');
    fs.mkdirSync(path.join(dir, 'deltas'));
    fs.writeFileSync(
      path.join(dir, 'deltas', 'iter-001.jsonl'),
      JSON.stringify({ type: 'finding', sources: ['a.md'] }) + '\n',
      'utf8',
    );
    fs.writeFileSync(
      path.join(dir, 'deltas', 'iter-002.jsonl'),
      JSON.stringify({ type: 'finding', evidence: ['b.md'] }) + '\n',
      'utf8',
    );
    const result = rater.deriveGold(rater.deltaIterationFiles(dir));
    expect(result.gold).toBe(2);
    expect(result.cited.get(1)).toBe(1);
    expect(result.cited.get(2)).toBe(1);
    expect(result.firstAppearance.get(1)).toBe(1);
    expect(result.firstAppearance.get(2)).toBe(1);
  });

  it('gold deduplicates sources with different line references', () => {
    const dir = tempDir('stop-rater-gold-lines-');
    fs.mkdirSync(path.join(dir, 'deltas'));
    fs.writeFileSync(
      path.join(dir, 'deltas', 'iter-001.jsonl'),
      JSON.stringify({ type: 'finding', source: 'a.md:1-5' }) + '\n',
      'utf8',
    );
    fs.writeFileSync(
      path.join(dir, 'deltas', 'iter-002.jsonl'),
      JSON.stringify({ type: 'finding', source: 'a.md:9-12' }) + '\n',
      'utf8',
    );
    const result = rater.deriveGold(rater.deltaIterationFiles(dir));
    expect(result.gold).toBe(1);
  });

  it('gold ignores a tool-prefixed source', () => {
    const dir = tempDir('stop-rater-gold-tool-source-');
    fs.mkdirSync(path.join(dir, 'deltas'));
    fs.writeFileSync(
      path.join(dir, 'deltas', 'iter-001.jsonl'),
      JSON.stringify({ type: 'finding', source: 'Glob:x/*.json' }) + '\n',
      'utf8',
    );
    const result = rater.deriveGold(rater.deltaIterationFiles(dir));
    expect(result.gold).toBeNull();
    expect(result.cited.get(1)).toBe(0);
  });

  it('findingSources normalizes and deduplicates sources in first-seen order', () => {
    expect(typeof rater.findingSources).toBe('function');
    expect(rater.findingSources({
      source: 'a.md:3',
      sources: ['b.md:1-2', 'a.md:7'],
    })).toEqual(['a.md', 'b.md']);
    expect(rater.findingSources({
      source: 1,
      sources: ['  ', 2],
      evidence: [null],
    })).toEqual([]);
  });

  it('gold drops a lineage with no source', async () => {
    const repo = gitRepo();
    makeLineage(repo, 'lineage-a', {
      config: {},
      records: [iteration(1, 0.5)],
      deltas: { 'iter-001.jsonl': [{ type: 'finding', label: 'no source here' }] },
    });
    commitAll(repo);
    const { code, lines } = await runMain([], repo);
    expect(code).toBe(0);
    const census = censusOf(lines);
    expect(census.noGold).toBe(1);
    expect(census.sampled).toBe(0);
  });
});

describe('score-stop-rater inert window', () => {
  it('inert window sorts first', async () => {
    const repo = gitRepo();
    makeLineage(repo, 'aaa-plain', {
      config: {},
      records: [iteration(1, 0.5)],
      deltas: { 'iter-001.jsonl': [{ type: 'finding', source: 'src-plain' }] },
    });
    makeLineage(repo, 'zzz-inert', {
      config: {},
      records: [iteration(1, 0.95), iteration(2, 0.95), iteration(3, 0.95)],
      deltas: { 'iter-001.jsonl': [{ type: 'finding', source: 'src-inert' }] },
    });
    commitAll(repo);
    const { code, lines } = await runMain([], repo);
    expect(code).toBe(0);
    const census = censusOf(lines);
    expect(census.inert).toBe(1);
    const reads = lines.find((entry) => entry.startsWith('reads: ')) as string;
    expect(reads).toBeDefined();
    expect(reads.indexOf('zzz-inert')).toBeLessThan(reads.indexOf('aaa-plain'));
  });
});

describe('score-stop-rater methods', () => {
  it('recorded stops at the last iteration', () => {
    const dir = tempDir('stop-rater-recorded-');
    makeLineage(dir, 'lineage-a', {
      config: {},
      records: [iteration(1, 1.0), iteration(2, 0.5), iteration(3, 0.2)],
      deltas: {
        'iter-001.jsonl': [{ type: 'finding', source: 'A' }],
        'iter-002.jsonl': [{ type: 'finding', source: 'B' }],
        'iter-003.jsonl': [{ type: 'finding', source: 'A' }],
      },
    });
    const lineage = path.join(dir, 'lineage-a');
    const { gold } = rater.deriveGold(rater.deltaIterationFiles(lineage));
    const { iterations } = rater.readStateRecords(path.join(lineage, 'deep-research-state.jsonl'));
    const recorded = iterations[iterations.length - 1].n;
    expect(gold).toBe(2);
    expect(recorded).toBe(3);
    expect(rater.rightOf(recorded, gold)).toBe(true);
  });

  it('legacy stop honors minIterations', () => {
    const series = [
      { n: 1, ratio: 0.9 },
      { n: 2, ratio: 0.9 },
      { n: 3, ratio: 0.9 },
    ];
    const coverage = new Map([
      [1, 0.9],
      [2, 0.9],
      [3, 0.9],
    ]);
    expect(rater.replayVote(series, { threshold: 0.05, minIterations: 2, coverage })).toBe(2);
    expect(rater.replayVote(series, { threshold: 0.05, minIterations: 3, coverage })).toBeNull();
    expect(rater.stopFor(series, { threshold: 0.05, minIterations: 3, coverage })).toBe(3);
  });

  it('legacy honors a STOP_BLOCKED event', () => {
    const dir = tempDir('stop-rater-blocked-');
    const stateFile = path.join(dir, 'deep-research-state.jsonl');
    const rows = [
      iteration(1, 0.0),
      iteration(2, 0.0),
      iteration(3, 0.0),
      iteration(4, 0.0),
      { type: 'event', event: 'graph_convergence', mode: 'research', run: 3, decision: 'STOP_BLOCKED' },
    ];
    fs.writeFileSync(stateFile, rows.map((row) => JSON.stringify(row)).join('\n') + '\n', 'utf8');
    const records = rater.readStateRecords(stateFile);
    const series = records.iterations.map((entry: { n: number; ratio: number | null }) => ({ n: entry.n, ratio: entry.ratio }));
    expect(records.blocked).toEqual([3]);
    expect(rater.replayVote(series, { threshold: 0.05, minIterations: 3 })).toBe(3);
    expect(rater.replayVote(series, { threshold: 0.05, minIterations: 3, blocked: records.blocked })).toBe(4);
    expect(rater.stopFor(series, { threshold: 0.05, minIterations: 3, blocked: records.blocked })).toBe(4);
  });

  it('sources stop lands on its gold', async () => {
    const repo = gitRepo();
    const repeated = Array.from({ length: 99 }, () => ({ type: 'finding', source: 'src-known' }));
    makeLineage(repo, 'lineage-a', {
      config: {},
      records: [iteration(1, 1.0), iteration(2, 1.0), iteration(3, 0.5)],
      deltas: {
        'iter-001.jsonl': [{ type: 'finding', label: 'no source' }],
        'iter-002.jsonl': [{ type: 'finding', label: 'no source' }],
        'iter-003.jsonl': [...repeated, { type: 'finding', source: 'src-new' }],
      },
    });
    const lineage = path.join(repo, 'lineage-a');
    const deltas = rater.deltaIterationFiles(lineage);
    const { gold, cited, firstAppearance } = rater.deriveGold(deltas);
    const sourceSeries = deltas.map((entry: { n: number }) => {
      const citedCount = cited.get(entry.n) ?? 0;
      return { n: entry.n, ratio: citedCount > 0 ? (firstAppearance.get(entry.n) ?? 0) / citedCount : 0 };
    });
    const stop = rater.stopFor(sourceSeries, { threshold: 0.05, minIterations: 3 });
    expect(gold).toBe(3);
    expect(stop).toBe(3);
    expect(rater.rightOf(stop, gold)).toBe(true);
    commitAll(repo);
    const { code, lines } = await runMain([], repo);
    expect(code).toBe(0);
    expect(lines).toContain('method sources: right 1 of 1');
  });

  it('vote redistributes weight without counts', async () => {
    const repo = gitRepo();
    makeLineage(repo, 'lineage-a', {
      config: {},
      records: [iteration(1, 0.04), iteration(2, 0.04), iteration(3, 0.04)],
      deltas: {
        'iter-001.jsonl': [{ type: 'finding', source: 'src-a' }],
        'iter-002.jsonl': [{ type: 'finding', source: 'src-b' }],
        'iter-003.jsonl': [{ type: 'finding', source: 'src-c' }],
      },
    });
    commitAll(repo);
    const { code, lines } = await runMain([], repo);
    expect(code).toBe(0);
    expect(lines).toContain('question counts: 0 of 1 sampled lineages carry key/answered counts');
    const lineage = path.join(repo, 'lineage-a');
    const records = rater.readStateRecords(path.join(lineage, 'deep-research-state.jsonl'));
    const coverage = rater.coverageSeries(records.iterations);
    expect(coverage.get(1)).toBeNull();
    const series = records.iterations.map((entry: { n: number; ratio: number | null }) => ({ n: entry.n, ratio: entry.ratio }));
    expect(rater.replayVote(series, { threshold: 0.05, minIterations: 3, coverage })).toBe(3);
    expect(lines).toContain('method legacy: right 1 of 1');
  });
});

describe('score-stop-rater baseline and gate', () => {
  it('baseline tie goes to legacy', async () => {
    const repo = gitRepo();
    for (let index = 0; index < 5; index += 1) {
      makeLineage(repo, `lineage-${index}`, {
        config: {},
        records: [iteration(1, 0.04), iteration(2, 0.04), iteration(3, 0.04)],
        deltas: {
          'iter-001.jsonl': [{ type: 'finding', source: `src-${index}-a` }],
          'iter-002.jsonl': [{ type: 'finding', source: `src-${index}-b` }],
          'iter-003.jsonl': [{ type: 'finding', source: `src-${index}-c` }],
        },
      });
    }
    commitAll(repo);
    const { code, lines } = await runMain([], repo);
    expect(code).toBe(0);
    expect(lines).toContain('method recorded: right 5 of 5');
    expect(lines).toContain('method legacy: right 5 of 5');
    expect(lines).toContain('baseline: legacy right 5 of 5');
  });

  it('census prints no headroom on a saturated fixture', async () => {
    const repo = gitRepo();
    for (let index = 0; index < 10; index += 1) {
      makeLineage(repo, `lineage-${index}`, {
        config: {},
        records: [iteration(1, 0.04), iteration(2, 0.04), iteration(3, 0.04)],
        deltas: {
          'iter-001.jsonl': [{ type: 'finding', source: `src-${index}-a` }],
          'iter-002.jsonl': [{ type: 'finding', source: `src-${index}-b` }],
          'iter-003.jsonl': [{ type: 'finding', source: `src-${index}-c` }],
        },
      });
    }
    commitAll(repo);
    const stubDir = tempDir('stop-rater-stubs-');
    const stubLog = path.join(stubDir, 'backends.log');
    for (const name of ['jev', 'cli-deem']) {
      fs.writeFileSync(
        path.join(stubDir, name),
        `#!/bin/sh\necho "$0 $*" >> '${stubLog}'\n`,
        { mode: 0o755 },
      );
    }
    const lines: string[] = [];
    const errs: string[] = [];
    const code = await rater.main(['--jev', '--deem', '--out', tempDir('stop-rater-out-')], {
      out: (line: string) => lines.push(line),
      err: (line: string) => errs.push(line),
      repoRoot: repo,
      env: { ...process.env, PATH: `${stubDir}${path.delimiter}${process.env.PATH ?? ''}` },
    });
    expect(code).toBe(0);
    expect(errs).toEqual([]);
    expect(lines).toContain('baseline: legacy right 10 of 10');
    const powerIndex = lines.indexOf(rater.POWER_LINE);
    expect(powerIndex).toBeGreaterThan(-1);
    expect(lines[powerIndex + 1]).toBe('no headroom');
    expect(lines.some((entry) => entry.startsWith('planned calls:'))).toBe(false);
    expect(fs.existsSync(stubLog)).toBe(false);
  });

  it('no headroom closes both arms after the label gate passes', async () => {
    const repo = gitRepo();
    for (let index = 0; index < 10; index += 1) {
      makeLineage(repo, `lineage-${index}`, {
        config: {},
        records: [iteration(1, 0.04), iteration(2, 0.04), iteration(3, 0.04)],
        deltas: {
          'iter-001.jsonl': [{ type: 'finding', source: `src-${index}-a` }],
          'iter-002.jsonl': [{ type: 'finding', source: `src-${index}-b` }],
          'iter-003.jsonl': [{ type: 'finding', source: `src-${index}-c` }],
        },
      });
    }
    commitAll(repo);
    const { log, env } = stubBackends();
    const rows = Array.from({ length: 10 }, (_, index) => ({
      lineage: `lineage-${index}`,
      gold_iteration: rater.deriveGold(rater.deltaIterationFiles(path.join(repo, `lineage-${index}`))).gold,
      labeler: 'operator',
    }));
    const readsFile = path.join(tempDir('stop-rater-reads-'), 'gold-reads.jsonl');
    fs.writeFileSync(readsFile, rows.map((row) => JSON.stringify(row)).join('\n') + '\n', 'utf8');
    const lines: string[] = [];
    const errs: string[] = [];
    const code = await rater.main(['--jev', '--deem', '--out', tempDir('stop-rater-out-'), '--gold-reads', readsFile], {
      out: (line: string) => lines.push(line),
      err: (line: string) => errs.push(line),
      repoRoot: repo,
      env,
    });
    expect(code).toBe(0);
    expect(errs).toEqual([]);
    expect(lines.some((entry) => entry.startsWith('stop:'))).toBe(false);
    const headroomIndex = lines.indexOf('no headroom');
    const jevIndex = lines.indexOf('jev arm skipped: no headroom');
    expect(headroomIndex).toBeGreaterThan(-1);
    expect(jevIndex).toBeGreaterThan(headroomIndex);
    expect(lines.indexOf('deem arm skipped: no headroom')).toBeGreaterThan(jevIndex);
    expect(fs.existsSync(log)).toBe(false);
  });
});

describe('score-stop-rater label gate', () => {
  it('label gate stops below five reads', async () => {
    const repo = fiveLineageRepo();
    const { log, env } = stubBackends();
    const lines: string[] = [];
    const errs: string[] = [];
    const code = await rater.main(['--jev', '--deem', '--out', tempDir('stop-rater-out-')], {
      out: (line: string) => lines.push(line),
      err: (line: string) => errs.push(line),
      repoRoot: repo,
      env,
    });
    expect(code).toBe(0);
    expect(errs).toEqual([]);
    expect(lines).toContain('stop: fewer than 5 confirmed lineages');
    expect(fs.existsSync(log)).toBe(false);
  });

  it('label gate stops on one disagreement', async () => {
    const repo = fiveLineageRepo();
    const { log, env } = stubBackends();
    const readsFile = writeGoldReads(repo, 4);
    const lines: string[] = [];
    const errs: string[] = [];
    const code = await rater.main(['--jev', '--deem', '--out', tempDir('stop-rater-out-'), '--gold-reads', readsFile], {
      out: (line: string) => lines.push(line),
      err: (line: string) => errs.push(line),
      repoRoot: repo,
      env,
    });
    expect(code).toBe(0);
    expect(errs).toEqual([]);
    expect(lines).toContain('stop: derived gold disagrees on 1 of 5 lineages');
    expect(fs.existsSync(log)).toBe(false);
  });

  it('label gate passes five agreeing rows', async () => {
    const repo = fiveLineageRepo();
    const { env } = stubBackends();
    const readsFile = writeGoldReads(repo, null);
    const lines: string[] = [];
    const errs: string[] = [];
    const code = await rater.main(['--jev', '--deem', '--out', tempDir('stop-rater-out-'), '--gold-reads', readsFile], {
      out: (line: string) => lines.push(line),
      err: (line: string) => errs.push(line),
      repoRoot: repo,
      env,
    });
    expect(code).toBe(0);
    expect(errs).toEqual([]);
    expect(censusOf(lines).sampled).toBe(5);
    expect(lines.some((entry) => entry.startsWith('stop:'))).toBe(false);
  });
});

describe('score-stop-rater report and out', () => {
  it('out missing refuses a model arm', async () => {
    const repo = fiveLineageRepo();
    const { log, env } = stubBackends();
    const lines: string[] = [];
    const errs: string[] = [];
    const code = await rater.main(['--deem'], {
      out: (line: string) => lines.push(line),
      err: (line: string) => errs.push(line),
      repoRoot: repo,
      env,
    });
    expect(code).toBe(2);
    expect(lines).toEqual([]);
    expect(errs).toEqual(['--deem needs --out <dir> so every call is recorded']);
    expect(fs.existsSync(log)).toBe(false);
  });

  it('default run with --out writes only report.json', async () => {
    const repo = fiveLineageRepo();
    const outDir = tempDir('stop-rater-out-');
    const { code, lines, errs } = await runMain(['--out', outDir], repo);
    expect(code).toBe(0);
    expect(errs).toEqual([]);
    expect(lines.some((entry) => entry.startsWith('lineages: '))).toBe(true);
    const reportFile = path.join(outDir, 'report.json');
    expect(fs.existsSync(reportFile)).toBe(true);
    expect(fs.existsSync(path.join(outDir, 'calls.jsonl'))).toBe(false);
    const report = JSON.parse(fs.readFileSync(reportFile, 'utf8'));
    expect(report.question).toBe(rater.QUESTION);
    expect(report.census.sampled).toBe(5);
    expect(report.lineages).toHaveLength(5);
    expect(report.columns).toEqual({});
    expect(report.stopped).toEqual({});
    expect(report.skipped).toEqual({});
    expect(report.requalify).toEqual({});
  });
});

describe('score-stop-rater jev gate', () => {
  const PASSING_JEV = 'case "$1" in --version) echo \'jev 0.6.2\';; auth) exit 0;; esac';
  const NO_CREDENTIAL_JEV = 'case "$1" in --version) echo \'jev 0.6.2\';; auth) exit 3;; esac';
  const OLD_VERSION_JEV = 'case "$1" in --version) echo \'0.2.3\';; esac';

  function jevStub(body: string): { dir: string; log: string; env: NodeJS.ProcessEnv } {
    const dir = tempDir('stop-rater-jev-');
    const log = path.join(dir, 'jev.log');
    fs.writeFileSync(path.join(dir, 'jev'), `#!/bin/sh\necho "$*" >> '${log}'\n${body}\n`, { mode: 0o755 });
    const env: NodeJS.ProcessEnv = { ...process.env, PATH: `${dir}${path.delimiter}${process.env.PATH ?? ''}` };
    delete env.JEV_PROVIDER;
    return { dir, log, env };
  }

  async function runWithEnv(
    argv: string[],
    repoRoot: string,
    env: NodeJS.ProcessEnv,
  ): Promise<{ code: number; lines: string[]; errs: string[] }> {
    const lines: string[] = [];
    const errs: string[] = [];
    const code = await rater.main(argv, {
      out: (line: string) => lines.push(line),
      err: (line: string) => errs.push(line),
      repoRoot,
      env,
    });
    return { code, lines, errs };
  }

  it('jev gate passes a stub', async () => {
    const repo = fiveLineageRepo();
    const readsFile = writeGoldReads(repo, null);
    const { dir, log, env } = jevStub(PASSING_JEV);
    const { code, lines, errs } = await runWithEnv(
      ['--jev', '--out', tempDir('stop-rater-out-'), '--gold-reads', readsFile],
      repo,
      env,
    );
    expect(code).toBe(0);
    expect(errs).toEqual([]);
    expect(lines).toContain(`jev: path=${path.join(dir, 'jev')} provider=official`);
    expect(lines.some((entry) => entry.startsWith('jev arm skipped:'))).toBe(false);
    expect(lines.some((entry) => entry.startsWith('stop:'))).toBe(false);
    const logged = fs.readFileSync(log, 'utf8').trim().split('\n');
    expect(logged.slice(0, 2)).toEqual(['--version', 'auth status --provider official']);
  });

  it('jev gate skips with no credential', async () => {
    const repo = fiveLineageRepo();
    const readsFile = writeGoldReads(repo, null);
    const { dir, env } = jevStub(NO_CREDENTIAL_JEV);
    const base = await runMain([], repo);
    const { code, lines, errs } = await runWithEnv(
      ['--jev', '--out', tempDir('stop-rater-out-'), '--gold-reads', readsFile],
      repo,
      env,
    );
    expect(code).toBe(0);
    expect(errs).toEqual([]);
    expect(lines.slice(0, base.lines.length)).toEqual(base.lines);
    expect(lines.slice(base.lines.length)).toEqual([
      `jev: path=${path.join(dir, 'jev')} provider=official`,
      'jev arm skipped: no credential',
    ]);
  });

  it('jev gate skips on version', async () => {
    const repo = fiveLineageRepo();
    const readsFile = writeGoldReads(repo, null);
    const { dir, env } = jevStub(OLD_VERSION_JEV);
    const base = await runMain([], repo);
    const { code, lines, errs } = await runWithEnv(
      ['--jev', '--out', tempDir('stop-rater-out-'), '--gold-reads', readsFile],
      repo,
      env,
    );
    expect(code).toBe(0);
    expect(errs).toEqual([]);
    expect(lines.slice(0, base.lines.length)).toEqual(base.lines);
    expect(lines.slice(base.lines.length)).toEqual([
      `jev: path=${path.join(dir, 'jev')} provider=official`,
      'jev arm skipped: version',
      `jev: found="0.2.3" path=${path.join(dir, 'jev')}`,
    ]);
  });

  it('unpublished lineage is withheld from jev', () => {
    const repo = gitRepo();
    makeLineage(repo, 'lineage-published', {
      config: {},
      records: [iteration(1, 0.5), iteration(2, 0.5)],
      deltas: {
        'iter-001.jsonl': [{ type: 'finding', source: 'src-a' }],
        'iter-002.jsonl': [{ type: 'finding', source: 'src-b' }],
      },
    });
    makeLineage(repo, 'lineage-unpublished', {
      config: {},
      records: [iteration(1, 0.5), iteration(2, 0.5)],
      deltas: {
        'iter-001.jsonl': [{ type: 'finding', source: 'src-c' }],
      },
    });
    commitAll(repo);
    fs.writeFileSync(
      path.join(repo, 'lineage-unpublished', 'deltas', 'iter-002.jsonl'),
      JSON.stringify({ type: 'finding', source: 'src-d' }) + '\n',
      'utf8',
    );
    expect(rater.existsAtOriginMain(repo, 'lineage-published/deltas/iter-002.jsonl')).toBe(true);
    expect(rater.existsAtOriginMain(repo, 'lineage-unpublished/deltas/iter-002.jsonl')).toBe(false);
    const records = rater.withheldRecords(
      [
        { path: 'lineage-published', iterations: [1, 2] },
        { path: 'lineage-unpublished', iterations: [1, 2] },
      ],
      repo,
      'official',
    ) as Array<{ lineage: string; iteration: number; status: string }>;
    expect(records.map((record) => `${record.lineage} ${record.iteration} ${record.status}`)).toEqual([
      'lineage-unpublished 1 unmeasured_unpublished',
      'lineage-unpublished 2 unmeasured_unpublished',
    ]);
  });
});

describe('score-stop-rater jev arm', () => {
  function rateableRepo(): string {
    const repo = gitRepo();
    for (let index = 0; index < 5; index += 1) {
      makeLineage(repo, `lineage-${index}`, {
        config: { convergenceThreshold: 0.05, minIterations: 3 },
        records: [iteration(1, 0.5), iteration(2, 0.5), iteration(3, 0.5), iteration(4, 0.5)],
        deltas: {
          'iter-001.jsonl': [{ type: 'finding', label: `finding ${index} one`, source: `src-${index}-a` }],
          'iter-002.jsonl': [{ type: 'finding', label: `finding ${index} two`, source: `src-${index}-b` }],
          'iter-003.jsonl': [{ type: 'finding', label: `finding ${index} one`, source: `src-${index}-a` }],
          'iter-004.jsonl': [{ type: 'finding', label: `finding ${index} two`, source: `src-${index}-b` }],
        },
      });
    }
    commitAll(repo);
    return repo;
  }

  function jevArmStub(levels: [number, number, number]): { dir: string; log: string; env: NodeJS.ProcessEnv } {
    const dir = tempDir('stop-rater-jev-arm-');
    const log = path.join(dir, 'jev.log');
    fs.writeFileSync(
      path.join(dir, 'jev'),
      `#!/bin/sh
D=$(dirname "$0")
case "$1" in
  --version) echo 'jev 0.6.2'; exit 0;;
  auth)
    if [ "$2" = test ]; then echo '{"ok":true,"valid":true,"model":"stub-model"}'; exit 0; fi
    exit 0;;
  score)
    echo "$*" >> '${log}'
    N=$(cat "$D/count" 2>/dev/null || echo 0)
    N=$((N+1))
    echo "$N" > "$D/count"
    case $((N % 3)) in
      1) L=${levels[0]};; 2) L=${levels[1]};; 0) L=${levels[2]};;
    esac
    echo "{\\"score\\":$L,\\"probabilities\\":{\\"0\\":0.5,\\"4\\":0.5}}"
    exit 0;;
esac
exit 0
`,
      { mode: 0o755 },
    );
    const env: NodeJS.ProcessEnv = { ...process.env, PATH: `${dir}${path.delimiter}${process.env.PATH ?? ''}` };
    delete env.JEV_PROVIDER;
    return { dir, log, env };
  }

  async function runArm(
    argv: string[],
    repoRoot: string,
    env: NodeJS.ProcessEnv,
  ): Promise<{ code: number; lines: string[]; errs: string[] }> {
    const lines: string[] = [];
    const errs: string[] = [];
    const code = await rater.main(argv, {
      out: (line: string) => lines.push(line),
      err: (line: string) => errs.push(line),
      repoRoot,
      env,
      timeoutMs: 5000,
      backoffMs: 1,
    });
    return { code, lines, errs };
  }

  it('jev arm prints keep on scripted answers', async () => {
    const repo = rateableRepo();
    const readsFile = writeGoldReads(repo, null);
    const { log, env } = jevArmStub([0, 0, 0]);
    const { code, lines, errs } = await runArm(
      ['--jev', '--out', tempDir('stop-rater-out-'), '--gold-reads', readsFile],
      repo,
      env,
    );
    expect(code).toBe(0);
    expect(errs).toEqual([]);
    expect(lines).toContain('jev: auth test provider=official model=stub-model');
    const verdict = lines.find((entry) => entry.startsWith('verdict jev: ')) as string;
    expect(verdict).toBeDefined();
    expect(verdict.startsWith('verdict jev: keep')).toBe(true);
    expect(verdict).toContain('F=0');
    expect(fs.readFileSync(log, 'utf8').trim().split('\n')).toHaveLength(60);
  });

  it('jev arm stops on flips', async () => {
    const repo = rateableRepo();
    const readsFile = writeGoldReads(repo, null);
    const { env } = jevArmStub([0, 0, 4]);
    const { code, lines, errs } = await runArm(
      ['--jev', '--out', tempDir('stop-rater-out-'), '--gold-reads', readsFile],
      repo,
      env,
    );
    expect(code).toBe(0);
    expect(errs).toEqual([]);
    const verdict = lines.find((entry) => entry.startsWith('verdict jev: ')) as string;
    expect(verdict).toBeDefined();
    expect(verdict.startsWith('verdict jev: stop (flips)')).toBe(true);
  });

  it('every logged jev call carries one provider', async () => {
    const repo = rateableRepo();
    const readsFile = writeGoldReads(repo, null);
    const { log, env } = jevArmStub([0, 0, 0]);
    env.JEV_PROVIDER = 'openrouter';
    const { code, errs } = await runArm(
      ['--jev', '--out', tempDir('stop-rater-out-'), '--gold-reads', readsFile],
      repo,
      env,
    );
    expect(code).toBe(0);
    expect(errs).toEqual([]);
    const logged = fs.readFileSync(log, 'utf8').trim().split('\n');
    expect(logged.length).toBeGreaterThan(0);
    for (const line of logged) expect(line).toContain('--provider openrouter');
  });
});

describe('score-stop-rater deem gate', () => {
  it('deem gate passes a fake health', async () => {
    const repo = fiveLineageRepo();
    const readsFile = writeGoldReads(repo, null);
    const { log, env } = deemStub(`case "$1" in
  health)
    echo '{"ok":true,"backend":"torch","model":"deem-0.8-v1","model_commit":"abc123","source_commit":"def456"}'
    exit 0;;
  score)
    echo '{"score":0,"probabilities":{"0":0.9,"4":0.1}}'
    exit 0;;
esac
exit 0`);
    const outDir = tempDir('stop-rater-out-');
    const { code, lines, errs } = await runWithEnv(
      ['--deem', '--out', outDir, '--gold-reads', readsFile],
      repo,
      env,
    );
    expect(code).toBe(0);
    expect(errs).toEqual([]);
    expect(lines).toContain('deem: health backend=torch model=deem-0.8-v1 model_commit=abc123 source_commit=def456');
    expect(lines).toContain('deem: nothing leaves the machine; planned calls: 15; estimated wall time: 1.0 s at 65.6 ms per call, the 2-option p50 from deem-local.md');
    expect(lines.some((entry) => entry.startsWith('deem arm skipped:'))).toBe(false);
    expect(lines.some((entry) => entry.startsWith('verdict deem: '))).toBe(true);
    const logged = fs.readFileSync(log, 'utf8').trim().split('\n');
    expect(logged.filter((entry) => entry.startsWith('score'))).toHaveLength(15);
    const records = fs
      .readFileSync(path.join(outDir, 'calls.jsonl'), 'utf8')
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line)) as Array<Record<string, unknown>>;
    expect(records).toHaveLength(15);
    for (const record of records) {
      expect(record.backend).toBe('deem');
      expect(record.modelId).toBe('deem-0.8-v1');
      expect(record.modelCommit).toBe('abc123');
      expect(record.sourceCommit).toBe('def456');
    }
  });

  it('deem gate skips a stub backend byte-identically', async () => {
    const repo = fiveLineageRepo();
    const readsFile = writeGoldReads(repo, null);
    const { env } = deemStub(`case "$1" in
  health)
    echo '{"ok":true,"backend":"stub","model":"deem-0.8-v1","model_commit":"abc","source_commit":"def"}'
    exit 0;;
esac
exit 0`);
    const base = await runMain([], repo);
    const { code, lines, errs } = await runWithEnv(
      ['--deem', '--out', tempDir('stop-rater-out-'), '--gold-reads', readsFile],
      repo,
      env,
    );
    expect(code).toBe(0);
    expect(errs).toEqual([]);
    expect(lines.slice(0, base.lines.length)).toEqual(base.lines);
    expect(lines.slice(base.lines.length)).toEqual(['deem arm skipped: stub backend']);
  });
});

describe('score-stop-rater deem arm', () => {
  it('deem arm stops on a changed pair at exit 4', async () => {
    const repo = fiveLineageRepo();
    const readsFile = writeGoldReads(repo, null);
    const { log, env } = deemStub(`case "$1" in
  health)
    D=$(dirname "$0")
    H=$(cat "$D/health" 2>/dev/null || echo 0)
    H=$((H + 1))
    echo "$H" > "$D/health"
    if [ "$H" -ge 2 ]; then
      echo '{"ok":true,"backend":"torch","model":"deem-0.8-v1","model_commit":"newc","source_commit":"news"}'
    else
      echo '{"ok":true,"backend":"torch","model":"deem-0.8-v1","model_commit":"oldc","source_commit":"olds"}'
    fi
    exit 0;;
  score)
    exit 4;;
esac
exit 0`);
    const outDir = tempDir('stop-rater-out-');
    const { code, lines, errs } = await runWithEnv(
      ['--deem', '--out', outDir, '--gold-reads', readsFile],
      repo,
      env,
    );
    expect(code).toBe(0);
    expect(errs).toEqual([]);
    expect(lines).toContain('deem arm stopped: model commit changed mid-run');
    expect(lines).toContain('deem: partial lineages=0');
    expect(lines.some((entry) => entry.startsWith('verdict deem: '))).toBe(false);
    const logged = fs.readFileSync(log, 'utf8').trim().split('\n');
    expect(logged.filter((entry) => entry.startsWith('score'))).toHaveLength(1);
    const records = fs
      .readFileSync(path.join(outDir, 'calls.jsonl'), 'utf8')
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line)) as Array<Record<string, unknown>>;
    expect(records).toHaveLength(1);
    expect(records[0].exitCode).toBe(4);
    expect(records[0].status).toBe('unmeasured');
  });

  it('oversize state is withheld', async () => {
    const repo = gitRepo();
    // One repeated source over three iterations leaves the baseline headroom, so the arm opens; the first label rides into every later state.
    for (let index = 0; index < 5; index += 1) {
      makeLineage(repo, `lineage-${index}`, {
        config: {},
        records: [iteration(1, 0.04), iteration(2, 0.04), iteration(3, 0.04)],
        deltas: {
          'iter-001.jsonl': [{ type: 'finding', label: 'x'.repeat(25000), source: `src-${index}-a` }],
          'iter-002.jsonl': [{ type: 'finding', source: `src-${index}-a` }],
          'iter-003.jsonl': [{ type: 'finding', source: `src-${index}-a` }],
        },
      });
    }
    commitAll(repo);
    const readsFile = writeGoldReads(repo, null);
    const { log, env } = deemStub(`case "$1" in
  health)
    echo '{"ok":true,"backend":"torch","model":"deem-0.8-v1","model_commit":"abc123","source_commit":"def456"}'
    exit 0;;
  score)
    echo '{"score":0,"probabilities":{"0":0.9}}'
    exit 0;;
esac
exit 0`);
    const outDir = tempDir('stop-rater-out-');
    const { code, lines, errs } = await runWithEnv(
      ['--deem', '--out', outDir, '--gold-reads', readsFile],
      repo,
      env,
    );
    expect(code).toBe(0);
    expect(errs).toEqual([]);
    const records = fs
      .readFileSync(path.join(outDir, 'calls.jsonl'), 'utf8')
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line)) as Array<Record<string, unknown>>;
    expect(records).toHaveLength(15);
    for (const record of records) expect(record.status).toBe('unmeasured_oversize');
    expect(fs.readFileSync(log, 'utf8')).not.toContain('score');
    expect(lines.some((entry) => entry.startsWith('deem: nothing leaves the machine'))).toBe(true);
  });
});

describe('score-stop-rater verdict', () => {
  interface ScriptedLineage {
    path: string;
    gold: number;
    baselineStop: number | null;
    stop: number | null;
    ratios: Array<number | null>;
    flips?: number;
  }

  function scriptedColumn(backend: 'jev' | 'deem', rows: ScriptedLineage[]): Record<string, any> {
    const lineages = rows.map((row) => ({ path: row.path, gold: row.gold, baselineStop: row.baselineStop }));
    const answers = new Map(rows.map((row) => [row.path, row.ratios.map((ratio, index) => ({ n: index + 1, ratio }))]));
    const flips = new Map(rows.map((row) => [row.path, row.flips ?? 0]));
    const stops = new Map(rows.map((row) => [row.path, row.stop]));
    return rater.summarizeColumn(backend, lineages, answers, flips, stops, 'legacy');
  }

  it('verdict keep', () => {
    const rows = [0, 1, 2, 3, 4].map((index) => ({
      path: `lineage-${index}`,
      gold: 2,
      baselineStop: 4,
      stop: 3,
      ratios: [0.0, 0.0, 0.0, 0.0],
    }));
    const summary = scriptedColumn('deem', rows);
    expect(summary.K).toBe(5);
    expect(summary.M).toBe(5);
    expect(summary.A).toBe(5);
    expect(summary.B).toBe(0);
    expect(summary.W).toBe(5);
    expect(summary.L).toBe(0);
    expect(summary.C).toBe(20);
    expect(summary.outcome).toBe('keep');
    expect(summary.reason).toBe(null);
    const line = rater.verdictLine(summary, 'model=deem-0.8-v1 model_commit=abc123 source_commit=def456');
    expect(line.startsWith('verdict deem: keep')).toBe(true);
    expect(line).toContain('K=5 M=5 A=5 B=0 W=5 L=0 F=n/a');
    expect(line).toContain('p=0.03125');
    expect(line).toContain('baseline=legacy');
    expect(line.endsWith('model=deem-0.8-v1 model_commit=abc123 source_commit=def456')).toBe(true);
  });

  it('verdict kill', () => {
    const rows = [0, 1, 2, 3, 4].map((index) => ({
      path: `lineage-${index}`,
      gold: 2,
      baselineStop: 2,
      stop: 4,
      ratios: [0.0, 0.0, 0.0, 0.0],
    }));
    const summary = scriptedColumn('deem', rows);
    expect(summary.A).toBe(0);
    expect(summary.B).toBe(5);
    expect(summary.W).toBe(0);
    expect(summary.L).toBe(5);
    expect(summary.outcome).toBe('kill');
    expect(summary.reason).toBe(null);
    const line = rater.verdictLine(summary, '');
    expect(line.startsWith('verdict deem: kill')).toBe(true);
    expect(line).toContain('W=0 L=5');
    expect(line).toContain('p=0.03125');
  });

  it('verdict stop (coverage)', () => {
    const rows = Array.from({ length: 25 }, (_, index) => ({
      path: `lineage-${index}`,
      gold: 2,
      baselineStop: 4,
      stop: index < 22 ? 3 : null,
      ratios: [0.0, 0.0, 0.0, 0.0],
    }));
    const summary = scriptedColumn('deem', rows);
    expect(summary.K).toBe(25);
    expect(summary.M).toBe(22);
    expect(summary.unmeasured).toBe(3);
    expect(summary.outcome).toBe('stop');
    expect(summary.reason).toBe('coverage');
    const line = rater.verdictLine(summary, '');
    expect(line.startsWith('verdict deem: stop (coverage)')).toBe(true);
    expect(line).toContain('K=25 M=22');
  });

  it('verdict stop (margin)', () => {
    const rows = Array.from({ length: 25 }, (_, index) => ({
      path: `lineage-${index}`,
      gold: 2,
      baselineStop: index < 11 ? 2 : 4,
      stop: index < 13 ? 3 : 4,
      ratios: [0.0, 0.0, 0.0, 0.0],
    }));
    const summary = scriptedColumn('deem', rows);
    expect(summary.M).toBe(25);
    expect(summary.A).toBe(13);
    expect(summary.B).toBe(11);
    expect(summary.W).toBe(2);
    expect(summary.L).toBe(0);
    expect(summary.outcome).toBe('stop');
    expect(summary.reason).toBe('margin');
    const line = rater.verdictLine(summary, '');
    expect(line.startsWith('verdict deem: stop (margin)')).toBe(true);
  });

  it('requalify prints before the verdict', async () => {
    const repo = fiveLineageRepo();
    const readsFile = writeGoldReads(repo, null);
    const { env } = deemStub(`case "$1" in
  health)
    echo '{"ok":true,"backend":"torch","model":"deem-0.8-v1","model_commit":"abc123","source_commit":"def456"}'
    exit 0;;
  score)
    echo '{"score":0,"probabilities":{"0":0.9,"4":0.1}}'
    exit 0;;
esac
exit 0`);
    const outDir = tempDir('stop-rater-out-');
    fs.writeFileSync(
      path.join(outDir, 'report.json'),
      JSON.stringify({ columns: { deem: { modelId: 'deem-0.8-v1', modelCommit: 'oldc', sourceCommit: 'olds' } } }),
      'utf8',
    );
    const { code, lines, errs } = await runWithEnv(
      ['--deem', '--out', outDir, '--gold-reads', readsFile],
      repo,
      env,
    );
    expect(code).toBe(0);
    expect(errs).toEqual([]);
    const requalifyIndex = lines.indexOf('requalify: model commit changed');
    expect(requalifyIndex).toBeGreaterThanOrEqual(0);
    expect(lines[requalifyIndex + 1].startsWith('verdict deem: ')).toBe(true);
    const report = JSON.parse(fs.readFileSync(path.join(outDir, 'report.json'), 'utf8'));
    expect(report.requalify.deem).toBe('requalify: model commit changed');
  });
});
