// ───────────────────────────────────────────────────────────────────
// MODULE: score-stop-hint
//   Report reader (sha256, readRaterReport, gateStopLine)
//   Hint counter (hintFor, countColumn, columnLine)
//   Column selector (selectColumns)
//   Verdict and requalify (binomialTail, formatP, decideVerdict, raterSuffix, verdictLine, readStoredReport)
//   Report and no-call guard (hintLine, buildReport, writeReport)
//   Gate stop (main)
// ───────────────────────────────────────────────────────────────────

import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const hint = require(path.join(TEST_DIR, '../../scripts/score-stop-hint.cjs')) as Record<string, any>;

const tempDirs: string[] = [];

function tempDir(prefix: string): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

afterEach(() => {
  for (const dir of tempDirs.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
});

function lineage(index: number): Record<string, unknown> {
  return {
    path: `lineage-${index}`,
    gold: 1,
    lastIteration: 3,
    stops: { recorded: 3, legacy: 2, sources: 2 },
  };
}

function reportFixture(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    generated: '2026-09-29T00:00:00.000Z',
    census: { sampled: 20 },
    lineages: Array.from({ length: 20 }, (_, index) => lineage(index)),
    gate: { label: { passed: true }, headroom: 'headroom: 0.02' },
    columns: {},
    stopped: {},
    skipped: {},
    requalify: {},
    ...overrides,
  };
}

function writeReport(dir: string, report: unknown): string {
  const file = path.join(dir, 'report.json');
  fs.writeFileSync(file, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  return file;
}

async function runMain(argv: string[]): Promise<{ code: number; lines: string[]; errs: string[] }> {
  const lines: string[] = [];
  const errs: string[] = [];
  const code = await hint.main(argv, {
    out: (line: string) => lines.push(line),
    err: (line: string) => errs.push(line),
  });
  return { code, lines, errs };
}

async function runMainWithEnv(
  argv: string[],
  env: NodeJS.ProcessEnv,
): Promise<{ code: number; lines: string[]; errs: string[] }> {
  const lines: string[] = [];
  const errs: string[] = [];
  const code = await hint.main(argv, {
    out: (line: string) => lines.push(line),
    err: (line: string) => errs.push(line),
    env,
  });
  return { code, lines, errs };
}

function sha12Of(file: string): string {
  return createHash('sha256').update(fs.readFileSync(file)).digest('hex').slice(0, 12);
}

describe('score-stop-hint reader', () => {
  it('reader accepts a gated report', () => {
    const dir = tempDir('stop-hint-reader-');
    const file = writeReport(dir, reportFixture());
    const loaded = hint.readRaterReport(dir);
    expect(Object.keys(loaded).sort()).toEqual(['path', 'report', 'sha256']);
    expect(loaded.report.gate.label.passed).toBe(true);
    expect(loaded.report.lineages).toHaveLength(20);
    expect(loaded.path).toBe(file);
    expect(loaded.sha256).toMatch(/^[0-9a-f]{64}$/);
    expect(loaded.sha256).toBe(hint.sha256(file));
    expect(loaded.sha256).toBe(createHash('sha256').update(fs.readFileSync(file)).digest('hex'));
  });

  it('reader refuses a missing report', async () => {
    const dir = tempDir('stop-hint-missing-');
    const { code, lines, errs } = await runMain(['--rater-report', dir]);
    expect(code).toBe(2);
    expect(lines).toEqual([]);
    expect(errs).toEqual([`rater report not found: ${path.join(dir, 'report.json')}`]);
  });

  it('reader refuses an unparseable report', async () => {
    const dir = tempDir('stop-hint-bad-json-');
    fs.writeFileSync(path.join(dir, 'report.json'), '{', 'utf8');
    const { code, lines, errs } = await runMain(['--rater-report', dir]);
    expect(code).toBe(2);
    expect(lines).toEqual([]);
    expect(errs).toEqual([`rater report is not JSON: ${path.join(dir, 'report.json')}`]);
  });
});

describe('score-stop-hint gate stop', () => {
  it('gate stop prints the stop line and exits 0', async () => {
    const dir = tempDir('stop-hint-stop-');
    writeReport(dir, reportFixture({ gate: { label: { passed: false }, headroom: 'headroom: 0.0' } }));
    const { code, lines, errs } = await runMain(['--rater-report', dir]);
    expect(code).toBe(0);
    expect(errs).toEqual([]);
    expect(lines).toEqual(['stop: rater report has no confirmed gold']);
  });

  it('an unarmed report stops too', async () => {
    const dir = tempDir('stop-hint-unarmed-');
    writeReport(dir, reportFixture({ gate: { label: null, headroom: 'headroom: 0.0' } }));
    const { code, lines } = await runMain(['--rater-report', dir]);
    expect(code).toBe(0);
    expect(lines).toEqual(['stop: rater report has no confirmed gold']);
  });
});

describe('score-stop-hint hint counter', () => {
  it('hint is right inside the gold window', () => {
    expect(hint.hintFor({ gold: 1, lastIteration: 3 }, 2)).toEqual({ hint: 2, right: true, wrong: false, saved: 1 });
  });

  it('hint is wrong before gold', () => {
    expect(hint.hintFor({ gold: 3, lastIteration: 5 }, 1)).toEqual({ hint: 1, right: false, wrong: true, saved: 0 });
  });

  it('a stop at the recorded last iteration raises no hint', () => {
    const line = { gold: 1, lastIteration: 2, stops: { legacy: 2 } };
    expect(hint.hintFor(line, line.stops.legacy)).toEqual({ hint: null, right: false, wrong: false, saved: 0 });
    expect(hint.countColumn([line], 'legacy')).toEqual({ column: 'legacy', K: 1, M: 1, hints: 0, W: 0, L: 0, noHint: 1, saved: 0 });
  });

  it('a stop past the recorded last iteration raises no hint', () => {
    const line = { gold: 2, lastIteration: 6, stops: { legacy: 7 } };
    expect(hint.hintFor(line, line.stops.legacy)).toEqual({ hint: null, right: false, wrong: false, saved: 0 });
  });

  it('an unmeasured stop raises no hint and trims M', () => {
    const measured = { gold: 1, lastIteration: 3, stops: { legacy: 2 } };
    const unmeasured = { gold: 1, lastIteration: 3, stops: { legacy: null } };
    expect(hint.hintFor(unmeasured, unmeasured.stops.legacy)).toEqual({ hint: null, right: false, wrong: false, saved: 0 });
    expect(hint.countColumn([measured, unmeasured], 'legacy')).toEqual({ column: 'legacy', K: 2, M: 1, hints: 1, W: 1, L: 0, noHint: 0, saved: 1 });
  });
});

describe('score-stop-hint column lines', () => {
  it('column lines print measured hints right wrong no hint saved', async () => {
    const dir = tempDir('stop-hint-columns-');
    writeReport(dir, reportFixture());
    const { code, lines, errs } = await runMain(['--rater-report', dir]);
    expect(code).toBe(0);
    expect(errs).toEqual([]);
    expect(lines.filter((line) => line.startsWith('column '))).toEqual([
      'column legacy: measured 20 hints 20 right 20 wrong 0 no hint 0 saved 20',
      'column sources: measured 20 hints 20 right 20 wrong 0 no hint 0 saved 20',
    ]);
  });
});

describe('score-stop-hint column selection', () => {
  it('default run prints legacy and sources only', async () => {
    const dir = tempDir('stop-hint-default-');
    writeReport(dir, reportFixture());
    const { code, lines, errs } = await runMain(['--rater-report', dir]);
    expect(code).toBe(0);
    expect(errs).toEqual([]);
    expect(lines.filter((line) => line.startsWith('column '))).toEqual([
      'column legacy: measured 20 hints 20 right 20 wrong 0 no hint 0 saved 20',
      'column sources: measured 20 hints 20 right 20 wrong 0 no hint 0 saved 20',
    ]);
    expect(lines.some((line) => line.startsWith('column jev:') || line.startsWith('column deem:'))).toBe(false);
    expect(lines.some((line) => line.startsWith('verdict jev:') || line.startsWith('verdict deem:'))).toBe(false);
  });

  it('--jev/--deem skip a report with no rater columns and leave the rest byte-identical', async () => {
    const dir = tempDir('stop-hint-skips-');
    writeReport(dir, reportFixture({ columns: {}, stopped: {}, skipped: {} }));
    const base = await runMain(['--rater-report', dir]);
    const armed = await runMain(['--rater-report', dir, '--jev', '--deem']);
    expect(armed.code).toBe(0);
    expect(armed.lines).toEqual([
      ...base.lines,
      'jev column skipped: rater report has none',
      'deem column skipped: rater report has none',
    ]);
    const withoutSkips = armed.lines.filter((line) => line !== 'jev column skipped: rater report has none' && line !== 'deem column skipped: rater report has none');
    expect(withoutSkips).toEqual(base.lines);
  });

  it('--jev skips a column the rater stopped', async () => {
    const dir = tempDir('stop-hint-stopped-');
    writeReport(dir, reportFixture({ stopped: { jev: { line: 'jev arm stopped: usage error', partialLineages: 0 } } }));
    const { code, lines, errs } = await runMain(['--rater-report', dir, '--jev']);
    expect(code).toBe(0);
    expect(errs).toEqual([]);
    expect(lines.filter((line) => line.startsWith('column '))).toEqual([
      'column legacy: measured 20 hints 20 right 20 wrong 0 no hint 0 saved 20',
      'column sources: measured 20 hints 20 right 20 wrong 0 no hint 0 saved 20',
    ]);
    expect(lines[lines.length - 1]).toBe('jev column skipped: rater report has none');
  });

  it('--deem skips a column the rater skipped', async () => {
    const dir = tempDir('stop-hint-skipped-');
    writeReport(dir, reportFixture({ skipped: { deem: 'deem arm skipped: no backend' } }));
    const { code, lines, errs } = await runMain(['--rater-report', dir, '--deem']);
    expect(code).toBe(0);
    expect(errs).toEqual([]);
    expect(lines.filter((line) => line.startsWith('column '))).toEqual([
      'column legacy: measured 20 hints 20 right 20 wrong 0 no hint 0 saved 20',
      'column sources: measured 20 hints 20 right 20 wrong 0 no hint 0 saved 20',
    ]);
    expect(lines[lines.length - 1]).toBe('deem column skipped: rater report has none');
  });
});

describe('score-stop-hint verdicts', () => {
  it('verdict keep', async () => {
    const dir = tempDir('stop-hint-keep-');
    const right = Array.from({ length: 18 }, (_, index) => ({ path: `right-${index}`, gold: 1, lastIteration: 3, stops: { legacy: 2 } }));
    const wrong = [{ path: 'wrong-0', gold: 3, lastIteration: 5, stops: { legacy: 1 } }];
    const flat = [{ path: 'flat-0', gold: 1, lastIteration: 3, stops: { legacy: 3 } }];
    const file = writeReport(dir, reportFixture({ lineages: [...right, ...wrong, ...flat] }));
    const { code, lines, errs } = await runMain(['--rater-report', dir]);
    expect(code).toBe(0);
    expect(errs).toEqual([]);
    const verdict = lines.find((line) => line.startsWith('verdict legacy: ')) as string;
    expect(verdict).toBe(`verdict legacy: keep K=20 M=20 W=18 L=1 saved=18 p=0.00003815 report=${sha12Of(file)}`);
  });

  it('verdict kill', async () => {
    const dir = tempDir('stop-hint-kill-');
    const wrong = Array.from({ length: 5 }, (_, index) => ({ path: `wrong-${index}`, gold: 3, lastIteration: 5, stops: { legacy: 1 } }));
    const flat = Array.from({ length: 15 }, (_, index) => ({ path: `flat-${index}`, gold: 1, lastIteration: 3, stops: { legacy: 3 } }));
    writeReport(dir, reportFixture({ lineages: [...wrong, ...flat] }));
    const { code, lines } = await runMain(['--rater-report', dir]);
    expect(code).toBe(0);
    const verdict = lines.find((line) => line.startsWith('verdict legacy: ')) as string;
    expect(verdict.startsWith('verdict legacy: kill')).toBe(true);
    expect(verdict).toContain('p=0.03125');
  });

  it('verdict stop (precision)', async () => {
    const dir = tempDir('stop-hint-precision-');
    const right = Array.from({ length: 17 }, (_, index) => ({ path: `right-${index}`, gold: 1, lastIteration: 3, stops: { legacy: 2 } }));
    const wrong = Array.from({ length: 3 }, (_, index) => ({ path: `wrong-${index}`, gold: 3, lastIteration: 5, stops: { legacy: 1 } }));
    writeReport(dir, reportFixture({ lineages: [...right, ...wrong] }));
    const { code, lines } = await runMain(['--rater-report', dir]);
    expect(code).toBe(0);
    const verdict = lines.find((line) => line.startsWith('verdict legacy: ')) as string;
    expect(verdict.startsWith('verdict legacy: stop (precision)')).toBe(true);
    expect(verdict).toContain('W=17 L=3');
  });

  it('verdict stop (coverage)', async () => {
    const dir = tempDir('stop-hint-coverage-');
    const measured = Array.from({ length: 17 }, (_, index) => ({ path: `jev-${index}`, gold: 1, lastIteration: 3, stops: { jev: 2 } }));
    const unmeasured = Array.from({ length: 3 }, (_, index) => ({ path: `jev-null-${index}`, gold: 1, lastIteration: 3, stops: { jev: null } }));
    writeReport(dir, reportFixture({
      lineages: [...measured, ...unmeasured],
      columns: { jev: { jevVersion: 'jev-1.0', provider: 'official', model: 'stub-model', F: 0, C: 0 } },
    }));
    const { code, lines } = await runMain(['--rater-report', dir, '--jev']);
    expect(code).toBe(0);
    const verdict = lines.find((line) => line.startsWith('verdict jev: ')) as string;
    expect(verdict.startsWith('verdict jev: stop (coverage)')).toBe(true);
    expect(verdict).toContain('K=20 M=17');
  });

  it('verdict stop (savings)', async () => {
    const dir = tempDir('stop-hint-savings-');
    const right = [{ path: 'right-0', gold: 1, lastIteration: 3, stops: { legacy: 2 } }];
    const flat = Array.from({ length: 19 }, (_, index) => ({ path: `flat-${index}`, gold: 1, lastIteration: 3, stops: { legacy: 3 } }));
    writeReport(dir, reportFixture({ lineages: [...right, ...flat] }));
    const { code, lines } = await runMain(['--rater-report', dir]);
    expect(code).toBe(0);
    const verdict = lines.find((line) => line.startsWith('verdict legacy: ')) as string;
    expect(verdict.startsWith('verdict legacy: stop (savings)')).toBe(true);
  });

  it('verdict stop (sign test)', async () => {
    const dir = tempDir('stop-hint-sign-');
    const right = Array.from({ length: 4 }, (_, index) => ({ path: `right-${index}`, gold: 1, lastIteration: 3, stops: { legacy: 2 } }));
    const flat = Array.from({ length: 16 }, (_, index) => ({ path: `flat-${index}`, gold: 1, lastIteration: 3, stops: { legacy: 3 } }));
    writeReport(dir, reportFixture({ lineages: [...right, ...flat] }));
    const { code, lines } = await runMain(['--rater-report', dir]);
    expect(code).toBe(0);
    const verdict = lines.find((line) => line.startsWith('verdict legacy: ')) as string;
    expect(verdict.startsWith('verdict legacy: stop (sign test)')).toBe(true);
  });

  it('verdict stop (flips) on jev', async () => {
    const dir = tempDir('stop-hint-flips-');
    const right = Array.from({ length: 5 }, (_, index) => ({ path: `jev-${index}`, gold: 1, lastIteration: 3, stops: { jev: 2 } }));
    const flat = Array.from({ length: 15 }, (_, index) => ({ path: `jev-flat-${index}`, gold: 1, lastIteration: 3, stops: { jev: 3 } }));
    writeReport(dir, reportFixture({
      lineages: [...right, ...flat],
      columns: { jev: { jevVersion: 'jev-1.0', provider: 'official', model: 'stub-model', F: 2, C: 10 } },
    }));
    const { code, lines } = await runMain(['--rater-report', dir, '--jev']);
    expect(code).toBe(0);
    const verdict = lines.find((line) => line.startsWith('verdict jev: ')) as string;
    expect(verdict.startsWith('verdict jev: stop (flips)')).toBe(true);
  });

  it('jev keep when the flip rate holds', async () => {
    const dir = tempDir('stop-hint-jev-keep-');
    const right = Array.from({ length: 5 }, (_, index) => ({ path: `jev-${index}`, gold: 1, lastIteration: 3, stops: { jev: 2 } }));
    const flat = Array.from({ length: 15 }, (_, index) => ({ path: `jev-flat-${index}`, gold: 1, lastIteration: 3, stops: { jev: 3 } }));
    writeReport(dir, reportFixture({
      lineages: [...right, ...flat],
      columns: { jev: { jevVersion: 'jev-1.0', provider: 'official', model: 'stub-model', F: 1, C: 10 } },
    }));
    const { code, lines } = await runMain(['--rater-report', dir, '--jev']);
    expect(code).toBe(0);
    const verdict = lines.find((line) => line.startsWith('verdict jev: ')) as string;
    expect(verdict.startsWith('verdict jev: keep')).toBe(true);
    expect(verdict).toContain('jev_version=jev-1.0 provider=official model=stub-model');
  });
});

describe('score-stop-hint requalify', () => {
  it('requalify prints only when the rater identity changed since the stored run', async () => {
    const dir = tempDir('stop-hint-requalify-');
    const outDir = tempDir('stop-hint-requalify-out-');
    writeReport(dir, reportFixture({ columns: { deem: { modelId: 'deem-0.8-v1', modelCommit: 'oldc', sourceCommit: 'olds' } } }));
    const first = await runMain(['--rater-report', dir, '--deem', '--out', outDir]);
    expect(first.code).toBe(0);
    expect(first.lines).not.toContain('requalify: rater changed');
    const same = await runMain(['--rater-report', dir, '--deem', '--out', outDir]);
    expect(same.code).toBe(0);
    expect(same.lines).not.toContain('requalify: rater changed');
    writeReport(dir, reportFixture({ columns: { deem: { modelId: 'deem-1.0-v2', modelCommit: 'newc', sourceCommit: 'news' } } }));
    const changed = await runMain(['--rater-report', dir, '--deem', '--out', outDir]);
    expect(changed.code).toBe(0);
    expect(changed.errs).toEqual([]);
    const requalifyIndex = changed.lines.indexOf('requalify: rater changed');
    expect(requalifyIndex).toBeGreaterThanOrEqual(0);
    expect(changed.lines[requalifyIndex + 1].startsWith('verdict deem: ')).toBe(true);
  });
});

describe('score-stop-hint report and out', () => {
  it('a kept column writes the proposed hint line', async () => {
    const dir = tempDir('stop-hint-hint-line-');
    const outDir = tempDir('stop-hint-hint-line-out-');
    writeReport(dir, reportFixture());
    const { code, errs } = await runMain(['--rater-report', dir, '--out', outDir]);
    expect(code).toBe(0);
    expect(errs).toEqual([]);
    const report = JSON.parse(fs.readFileSync(path.join(outDir, 'report.json'), 'utf8'));
    expect(report.columns.legacy.hintLine).toBe(
      '**Stop hint**: legacy replay says this loop found its last new cited source by iteration <t>',
    );
  });

  it('report.json holds every verdict line', async () => {
    const dir = tempDir('stop-hint-report-');
    const outDir = tempDir('stop-hint-report-out-');
    writeReport(dir, reportFixture());
    const { code, lines, errs } = await runMain(['--rater-report', dir, '--out', outDir]);
    expect(code).toBe(0);
    expect(errs).toEqual([]);
    const report = JSON.parse(fs.readFileSync(path.join(outDir, 'report.json'), 'utf8'));
    const verdicts = lines.filter((line) => line.startsWith('verdict '));
    expect(verdicts).toHaveLength(2);
    for (const line of verdicts) {
      const name = /^verdict ([^:]+):/.exec(line)?.[1] as string;
      expect(report.columns[name].verdict).toBe(line);
    }
  });
});

describe('score-stop-hint no-call guard', () => {
  it('stub jev and cli-deem log nothing in any mode', async () => {
    const stubDir = tempDir('stop-hint-stubs-');
    const stubLog = path.join(stubDir, 'backends.log');
    for (const name of ['jev', 'cli-deem']) {
      fs.writeFileSync(
        path.join(stubDir, name),
        `#!/bin/sh\necho "$0 $*" >> '${stubLog}'\n`,
        { mode: 0o755 },
      );
    }
    const env: NodeJS.ProcessEnv = { ...process.env, PATH: `${stubDir}${path.delimiter}${process.env.PATH ?? ''}` };
    const dir = tempDir('stop-hint-no-call-');
    writeReport(dir, reportFixture());
    const base = await runMainWithEnv(['--rater-report', dir], env);
    const armed = await runMainWithEnv(['--rater-report', dir, '--jev', '--deem'], env);
    expect(base.code).toBe(0);
    expect(armed.code).toBe(0);
    expect(fs.existsSync(stubLog)).toBe(false);
  });

  it('the script holds no spawn of a rater', () => {
    const source = fs.readFileSync(path.join(TEST_DIR, '../../scripts/score-stop-hint.cjs'), 'utf8');
    expect(source).not.toMatch(/spawn.*(jev|cli-deem)/);
  });
});
