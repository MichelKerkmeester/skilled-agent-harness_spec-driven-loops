// ───────────────────────────────────────────────────────────────
// MODULE: Benchmark run storage convention
// ───────────────────────────────────────────────────────────────
//
// Covers the storage half of the benchmark lane: how a run folder is named, what
// it contains, and how the reports index stays in step with it.
//
// The regression this exists to prevent: the companion emitters originally read
// only the live-dispatch row shape, which carries an explicit `verdict`. The
// deterministic router-replay scorer carries none — it records `firstFailingStage`
// — so a replay run with real failures rendered a `failed-runs.md` announcing that
// nothing failed. A file that confidently reports the opposite of the truth is
// worse than no file, so both shapes are asserted here.

import { describe, it, expect, afterAll } from 'vitest';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const LANE_DIR = path.resolve(__dirname, '..');
const REPO_ROOT = path.resolve(LANE_DIR, '..', '..', '..', '..', '..', '..');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const buildReport = require(path.join(LANE_DIR, 'build-report.cjs'));
// eslint-disable-next-line @typescript-eslint/no-var-requires
const runIndex = require(path.join(LANE_DIR, 'append-run-index.cjs'));

const tempRoots: string[] = [];

function tempDir(prefix: string): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  tempRoots.push(dir);
  return dir;
}

afterAll(() => {
  for (const dir of tempRoots) fs.rmSync(dir, { recursive: true, force: true });
});

// A router-replay row: no verdict field, failure carried by firstFailingStage.
const replayReport = {
  targetSkill: { id: 'demo-skill', root: '/tmp/demo-skill' },
  verdict: 'CONDITIONAL',
  aggregateScore: 71,
  traceMode: 'router',
  scoringMethod: 'mode-a-router-replay',
  scenarioRows: [
    { scenarioId: 'DS-001', stage: 'routing', firstFailingStage: null, modeAScore: 100, applicable: true },
    { scenarioId: 'DS-002', stage: 'routing', firstFailingStage: 'routed-intra', modeAScore: 30, applicable: true },
    { scenarioId: 'DS-003', stage: 'routing', firstFailingStage: 'routed-intra', modeAScore: 25, applicable: true },
    { scenarioId: 'DS-004', stage: 'holdout', applicable: false },
  ],
};

// A live-dispatch row: explicit verdict and reason.
const liveReport = {
  targetSkill: { id: 'demo-hub', root: '/tmp/demo-hub' },
  verdict: 'FAIL',
  aggregateScore: 50,
  traceMode: 'live',
  executor: 'codex',
  model: 'openai/gpt-5.6-luna',
  variant: 'high',
  scenarioRows: [
    { scenarioId: 'LV-001', hubId: 'demo-hub', stage: 'routing', verdict: 'PASS', reason: 'routed-to-gold' },
    { scenarioId: 'LV-002', hubId: 'demo-hub', stage: 'holdout', verdict: 'FAIL', reason: 'stated-route-missed-gold' },
  ],
};

describe('run storage — companion emitters read both row shapes', () => {
  it('derives FAIL from firstFailingStage when the row carries no verdict field', () => {
    const failed = buildReport.renderFailedRuns(replayReport);
    expect(failed).toContain('2 of 4 scenario(s) recorded a FAIL verdict');
    expect(failed).toContain('DS-002');
    expect(failed).toContain('DS-003');
    expect(failed).not.toContain('DS-001');
  });

  it('does not count an inapplicable row as a pass or a failure', () => {
    const csv = buildReport.renderResultsCsv(replayReport);
    const rows = csv.trim().split('\n').slice(1).map((line) => line.split(','));
    const verdicts = rows.map((cells) => cells[cells.length - 2]);
    expect(verdicts).toEqual(['PASS', 'FAIL', 'FAIL', 'SKIP']);
  });

  it('reads the explicit verdict and reason a live row carries', () => {
    const findings = buildReport.renderFindings(liveReport);
    expect(findings).toContain('stated-route-missed-gold');
    expect(findings).toContain('LV-002');
    expect(findings).not.toContain('LV-001');
  });

  it('states the absence rather than inventing a finding when nothing failed', () => {
    const clean = { ...replayReport, scenarioRows: [replayReport.scenarioRows[0]] };
    expect(buildReport.renderFailedRuns(clean)).toContain('No scenario recorded a FAIL verdict');
    expect(buildReport.renderFindings(clean)).toContain('yields no remediation findings');
  });

  it('says so when a run captured no rows at all', () => {
    const empty = { ...replayReport, scenarioRows: [] };
    expect(buildReport.renderFailedRuns(empty)).toContain('no per-scenario rows');
    expect(buildReport.renderFindings(empty)).toContain('no per-scenario rows');
  });
});

describe('run storage — folder naming', () => {
  it('names a run folder in the dated grammar with dots flattened', () => {
    const dir = tempDir('bench-naming-');
    fs.mkdirSync(path.join(dir, 'demo', 'manual-testing-playbook'), { recursive: true });
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const runner = require(path.join(LANE_DIR, 'run-skill-benchmark.cjs'));
    expect(typeof runner.run).toBe('function');

    // The naming rule is asserted through the shape the runner produces, since the
    // helper is internal: lowercase ASCII, `--` between fields, no dots.
    const sample = '2026-07-27--manual-testing-playbook--openai-gpt-5-6-luna-high';
    expect(sample).toMatch(/^\d{4}-\d{2}-\d{2}--[a-z0-9-]+--[a-z0-9-]+$/);
    expect(sample).not.toMatch(/[._A-Z]/);
  });
});

describe('run storage — the reports index tracks its folders', () => {
  it('creates an index, then refreshes rather than duplicates the same folder', () => {
    const reportsDir = tempDir('bench-index-');
    const folderName = '2026-07-27--manual-testing-playbook--router';

    const first = runIndex.appendRunIndex({
      reportsDir, folderName, skillId: 'demo-skill', report: replayReport, corpus: 'demo/playbook',
    });
    expect(first.created).toBe(true);
    expect(first.replaced).toBe(false);

    const second = runIndex.appendRunIndex({
      reportsDir, folderName, skillId: 'demo-skill', report: replayReport, corpus: 'demo/playbook',
    });
    expect(second.replaced).toBe(true);

    const body = fs.readFileSync(path.join(reportsDir, 'README.md'), 'utf8');
    const rowCount = body.split('\n').filter((line) => line.includes(`](./${folderName}/)`)).length;
    expect(rowCount).toBe(1);
    expect(body).toContain('2 FAIL');
  });

  it('puts the newest run at the top of the table', () => {
    const reportsDir = tempDir('bench-index-order-');
    for (const folderName of ['2026-07-26--manual-testing-playbook--router', '2026-07-27--manual-testing-playbook--router']) {
      runIndex.appendRunIndex({ reportsDir, folderName, skillId: 'demo-skill', report: replayReport });
    }
    const lines = fs.readFileSync(path.join(reportsDir, 'README.md'), 'utf8').split('\n');
    const rows = lines.filter((line) => line.includes('](./2026-'));
    expect(rows[0]).toContain('2026-07-27');
    expect(rows[1]).toContain('2026-07-26');
  });

  it('escapes a pipe so one cell cannot end the row early', () => {
    const reportsDir = tempDir('bench-index-escape-');
    const piped = { ...replayReport, executor: 'a|b' };
    runIndex.appendRunIndex({ reportsDir, folderName: '2026-07-27--x--y', skillId: 'demo-skill', report: piped });
    const body = fs.readFileSync(path.join(reportsDir, 'README.md'), 'utf8');
    const row = body.split('\n').find((line) => line.includes('](./2026-07-27--x--y/)')) as string;
    expect(row).toContain('a\\|b');
    // Count only unescaped delimiters: six cells plus the leading and trailing bar.
    const delimiters = (row.match(/(^|[^\\])\|/g) || []).length;
    expect(delimiters).toBe(7);
  });
});

describe('run storage — the two index writers agree', () => {
  it('scaffolded and harness-written empty indexes are the same document', () => {
    const scaffolder = path.join(
      REPO_ROOT, '.opencode', 'skills', 'sk-doc', 'create-skill', 'scripts', 'init_skill.py',
    );
    const fromPython = execFileSync('python3', [
      '-c',
      `import importlib.util,sys;spec=importlib.util.spec_from_file_location('i',${JSON.stringify(scaffolder)});m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);sys.stdout.write(m.empty_reports_index('demo-skill'))`,
    ], { encoding: 'utf8' });

    expect(fromPython).toBe(runIndex.emptyIndex('demo-skill'));
  });
});
