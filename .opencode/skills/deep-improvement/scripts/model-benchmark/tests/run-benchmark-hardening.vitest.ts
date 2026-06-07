// ───────────────────────────────────────────────────────────────────
// MODULE: run-benchmark hardening remediation
//   Fixture-id path traversal
//   Report history snapshot
//   Scorer/grader provenance on success + failure paths
//   P2      profile/fixture provenance persisted
//   P2      regex DoS guard (bounded pattern length)
// ───────────────────────────────────────────────────────────────────

import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../../');
const SCRIPTS = path.join(WORKSPACE_ROOT, '.opencode/skills/deep-improvement/scripts');
const RUN_BENCHMARK = path.join(SCRIPTS, 'model-benchmark/run-benchmark.cjs');
const MATERIALIZE = path.join(SCRIPTS, 'shared/materialize-benchmark-fixtures.cjs');
const DEFAULT_PROFILE = path.join(WORKSPACE_ROOT, '.opencode/skills/deep-improvement/assets/model-benchmark/benchmark-profiles/default.json');

let work: string;

function writeJson(filePath: string, value: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function runBenchmark(profile: string, outDir: string, reportPath: string, extraArgs: string[]) {
  return spawnSync(
    'node',
    [RUN_BENCHMARK, '--profile', profile, '--outputs-dir', outDir, '--output', reportPath, ...extraArgs],
    { encoding: 'utf8', cwd: WORKSPACE_ROOT },
  );
}

beforeEach(() => { work = fs.mkdtempSync(path.join(os.tmpdir(), 'run-bench-hardening-')); });
afterEach(() => { fs.rmSync(work, { recursive: true, force: true }); });

describe('F-P1-9 fixture id path traversal', () => {
  function profileWithFixtureId(id: string): string {
    const fixtureDir = path.join(work, 'fixtures');
    const profilePath = path.join(work, 'profile.json');
    // The fixture file name itself stays safe; only the in-file `id` is hostile.
    writeJson(path.join(fixtureDir, 'evil.json'), {
      id,
      title: 'hostile',
      requiredHeadings: [],
      requiredPatterns: [],
      forbiddenPatterns: [],
      content: ['x'],
    });
    writeJson(profilePath, {
      profileId: 'hostile',
      family: 'test',
      targetPath: 'n/a',
      fixtureDir,
      fixtures: ['evil'],
      thresholdDelta: 0,
      benchmark: { requiredAggregateScore: 80, minimumFixtureScore: 70 },
    });
    return profilePath;
  }

  it("rejects a parent-traversal fixture id ('../evil') without writing outside outputsDir", () => {
    const profile = profileWithFixtureId('../evil');
    const outDir = path.join(work, 'outputs');
    const report = path.join(outDir, 'report.json');
    const r = runBenchmark(profile, outDir, report, []);
    // The run fails (routed through the infra_failure path) rather than scoring.
    expect(r.status).toBe(1);
    const data = JSON.parse(fs.readFileSync(report, 'utf8'));
    expect(data.status).toBe('infra_failure');
    expect(data.error).toMatch(/unsafe fixture id/);
    // Nothing escaped: no evil.md sibling of outputsDir was created.
    expect(fs.existsSync(path.join(work, 'evil.md'))).toBe(false);
  });

  it("rejects a separator-bearing fixture id ('a/b')", () => {
    const profile = profileWithFixtureId('a/b');
    const outDir = path.join(work, 'outputs');
    const report = path.join(outDir, 'report.json');
    const r = runBenchmark(profile, outDir, report, []);
    expect(r.status).toBe(1);
    const data = JSON.parse(fs.readFileSync(report, 'utf8'));
    expect(data.status).toBe('infra_failure');
    expect(data.error).toMatch(/unsafe fixture id/);
    expect(fs.existsSync(path.join(work, 'a'))).toBe(false);
  });
});

describe('F-P1-13 report history snapshot', () => {
  it('writes a label-stamped immutable snapshot alongside the canonical report', () => {
    const fx = path.join(work, 'fx');
    const report = path.join(work, 'report.json');
    spawnSync('node', [MATERIALIZE, '--profile', DEFAULT_PROFILE, '--outputs-dir', fx], { encoding: 'utf8', cwd: WORKSPACE_ROOT });
    const r = runBenchmark(DEFAULT_PROFILE, fx, report, ['--label', 'iter-1']);
    expect(r.status).toBe(0);
    const historyDir = path.join(path.dirname(report), 'report-history');
    expect(fs.existsSync(historyDir)).toBe(true);
    const snaps = fs.readdirSync(historyDir).filter((f) => f.endsWith('.json'));
    expect(snaps.length).toBe(1);
    expect(snaps[0]).toMatch(/^report-iter-1-/);
    // canonical report points at the snapshot via the state-log row (see below);
    // the snapshot content equals the canonical report.
    const canonical = JSON.parse(fs.readFileSync(report, 'utf8'));
    const snapshot = JSON.parse(fs.readFileSync(path.join(historyDir, snaps[0]), 'utf8'));
    expect(snapshot.aggregateScore).toBe(canonical.aggregateScore);
  });
});

describe('F-P1-7 + P2 provenance', () => {
  it('persists scoringMethod, grader, and profile provenance on the success report and ledger', () => {
    const fx = path.join(work, 'fx');
    const report = path.join(work, 'report.json');
    const stateLog = path.join(work, 'state.jsonl');
    spawnSync('node', [MATERIALIZE, '--profile', DEFAULT_PROFILE, '--outputs-dir', fx], { encoding: 'utf8', cwd: WORKSPACE_ROOT });
    const r = runBenchmark(DEFAULT_PROFILE, fx, report, ['--scorer=5dim', '--grader=mock', '--state-log', stateLog, '--label', 'prov']);
    expect(r.status).toBe(0);
    const data = JSON.parse(fs.readFileSync(report, 'utf8'));
    expect(data.scoringMethod).toBe('5dim');
    expect(data.grader).toBe('mock');
    expect(data.provenance.profilePath).toBe(DEFAULT_PROFILE);
    expect(data.provenance.profileVersion).toBe('1.0');
    expect(typeof data.provenance.fixtureDir).toBe('string');
    expect(Array.isArray(data.provenance.fixtureFiles)).toBe(true);
    expect(data.provenance.fixtureFiles.length).toBeGreaterThan(0);

    const ledgerRow = JSON.parse(fs.readFileSync(stateLog, 'utf8').trim().split('\n').pop() as string);
    expect(ledgerRow.type).toBe('benchmark_run');
    expect(ledgerRow.scoringMethod).toBe('5dim');
    expect(ledgerRow.grader).toBe('mock');
    expect(ledgerRow.reportSnapshot).toMatch(/report-history[\\/]report-prov-/);
    expect(ledgerRow.provenance.profilePath).toBe(DEFAULT_PROFILE);
  });

  it('carries scorer + grader provenance on the failure report and infra_failure ledger row', () => {
    // Point at a profile that loads but whose fixtures cannot be read => failure
    // AFTER the scorer/grader and profile are bound.
    const fixtureDir = path.join(work, 'fixtures');
    fs.mkdirSync(fixtureDir, { recursive: true });
    const profilePath = path.join(work, 'profile.json');
    writeJson(profilePath, {
      profileId: 'broken',
      version: '9.9',
      family: 'test',
      targetPath: 'n/a',
      fixtureDir,
      fixtures: ['does-not-exist'],
      thresholdDelta: 0,
    });
    const outDir = path.join(work, 'outputs');
    const report = path.join(outDir, 'report.json');
    const stateLog = path.join(work, 'state.jsonl');
    const r = runBenchmark(profilePath, outDir, report, ['--scorer=5dim', '--grader=llm', '--state-log', stateLog]);
    expect(r.status).toBe(1);
    const data = JSON.parse(fs.readFileSync(report, 'utf8'));
    expect(data.status).toBe('infra_failure');
    expect(data.scoringMethod).toBe('5dim');
    expect(data.grader).toBe('llm');
    expect(data.provenance.profilePath).toBe(profilePath);
    expect(data.provenance.profileVersion).toBe('9.9');

    const ledgerRow = JSON.parse(fs.readFileSync(stateLog, 'utf8').trim().split('\n').pop() as string);
    expect(ledgerRow.type).toBe('infra_failure');
    expect(ledgerRow.scoringMethod).toBe('5dim');
    expect(ledgerRow.grader).toBe('llm');
  });
});

describe('P2 regex DoS guard', () => {
  it('rejects an over-length authored pattern instead of compiling it', () => {
    const fixtureDir = path.join(work, 'fixtures');
    const profilePath = path.join(work, 'profile.json');
    const evil = `(a+)+${'a'.repeat(600)}`; // > 512 chars, classic backtracking shape
    writeJson(path.join(fixtureDir, 'fx.json'), {
      id: 'fx',
      title: 'dos',
      requiredHeadings: [],
      requiredPatterns: [evil],
      forbiddenPatterns: [],
      content: ['x'],
    });
    writeJson(profilePath, {
      profileId: 'dos',
      family: 'test',
      targetPath: 'n/a',
      fixtureDir,
      fixtures: ['fx'],
      thresholdDelta: 0,
    });
    const outDir = path.join(work, 'outputs');
    const report = path.join(outDir, 'report.json');
    // materialize a matching output so scoreFixture reaches compilePatterns
    spawnSync('node', [MATERIALIZE, '--profile', profilePath, '--outputs-dir', outDir], { encoding: 'utf8', cwd: WORKSPACE_ROOT });
    const r = runBenchmark(profilePath, outDir, report, []);
    expect(r.status).toBe(1);
    const data = JSON.parse(fs.readFileSync(report, 'utf8'));
    expect(data.status).toBe('infra_failure');
    expect(data.error).toMatch(/pattern exceeds 512 chars/);
  });
});
