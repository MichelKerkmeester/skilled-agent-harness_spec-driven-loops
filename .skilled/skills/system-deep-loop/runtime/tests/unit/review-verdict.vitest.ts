// ───────────────────────────────────────────────────────────────────
// MODULE: Review Verdict Tests
// ───────────────────────────────────────────────────────────────────
//
// Proves the review verdict is one rule asked in one place: a remaining P0, or a
// required quality gate that failed at the terminal stop, is a FAIL even when no
// finding was recorded; a remaining P1, or an open search-debt obligation, is a
// CONDITIONAL; and a PASS records whether P2 advisories remain. The merged
// verdict and the per-lineage attribution verdict both read it here, so neither
// can call a stop a failure the other calls a pass.

import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { afterAll, describe, expect, it } from 'vitest';

const SCRIPT = resolve(import.meta.dirname, '..', '..', 'scripts', 'review-verdict.cjs');

type VerdictCounts = {
  activeP0: number;
  activeP1: number;
  activeP2: number;
  openSearchDebt: number;
  failedRequiredGateIds: string[];
};

type Verdict = { verdict: string; hasAdvisories: boolean };

type VerdictPayload = {
  status: string;
  verdict: string;
  has_advisories: boolean;
  active_p0: number;
  active_p1: number;
  active_p2: number;
  search_debt: number;
  failed_required_gate_ids: string[];
};

const requireCjs = createRequire(import.meta.url);

const { deriveReviewVerdict } = requireCjs('../../scripts/review-verdict.cjs') as {
  deriveReviewVerdict: (counts: Partial<VerdictCounts>) => Verdict;
};

const tempDirs: string[] = [];

afterAll(() => {
  for (const dir of tempDirs) rmSync(dir, { recursive: true, force: true });
});

function tempDir(): string {
  const dir = mkdtempSync(join(tmpdir(), 'dlr-review-verdict-'));
  tempDirs.push(dir);
  return dir;
}

function counts(overrides: Partial<VerdictCounts> = {}): VerdictCounts {
  return {
    activeP0: 0,
    activeP1: 0,
    activeP2: 0,
    openSearchDebt: 0,
    failedRequiredGateIds: [],
    ...overrides,
  };
}

function spawnScript(args: string[]): { status: number | null; stdout: string } {
  const result = spawnSync(process.execPath, [SCRIPT, ...args], {
    cwd: resolve(import.meta.dirname, '..', '..'),
    encoding: 'utf8',
  });
  return { status: result.status, stdout: result.stdout ?? '' };
}

// The registry and state log reach the CLI as the files a run leaves behind: the
// registry holds the findings and possibly a gate row the reducer wrote, and the
// state log holds the row the terminal stop wrote after it.
function runRegistryVerdict(
  registry: Record<string, unknown>,
  stateRows: Array<Record<string, unknown>>,
): { status: number | null; stdout: string } {
  const dir = tempDir();
  const registryPath = join(dir, 'registry.json');
  const stateLogPath = join(dir, 'state.jsonl');
  writeFileSync(registryPath, `${JSON.stringify(registry)}\n`, 'utf8');
  writeFileSync(stateLogPath, `${stateRows.map((row) => JSON.stringify(row)).join('\n')}\n`, 'utf8');
  return spawnScript(['--registry-path', registryPath, '--state-log', stateLogPath]);
}

describe('deriveReviewVerdict', () => {
  it('fails while an active P0 remains', () => {
    expect(deriveReviewVerdict(counts({ activeP0: 1 }))).toEqual({
      verdict: 'FAIL',
      hasAdvisories: false,
    });
  });

  it('fails on a required gate that failed at the stop with no finding recorded', () => {
    expect(deriveReviewVerdict(counts({ failedRequiredGateIds: ['coverage'] }))).toEqual({
      verdict: 'FAIL',
      hasAdvisories: false,
    });
  });

  it('keeps advisories off a verdict that is not a pass', () => {
    expect(deriveReviewVerdict(counts({ activeP0: 1, activeP2: 3 }))).toEqual({
      verdict: 'FAIL',
      hasAdvisories: false,
    });
    expect(deriveReviewVerdict(counts({ activeP1: 1, activeP2: 3 }))).toEqual({
      verdict: 'CONDITIONAL',
      hasAdvisories: false,
    });
  });

  it('is conditional while an active P1 remains', () => {
    expect(deriveReviewVerdict(counts({ activeP1: 2 }))).toEqual({
      verdict: 'CONDITIONAL',
      hasAdvisories: false,
    });
  });

  it('is conditional while search debt remains open', () => {
    expect(deriveReviewVerdict(counts({ openSearchDebt: 2 }))).toEqual({
      verdict: 'CONDITIONAL',
      hasAdvisories: false,
    });
  });

  it('fails on an active P0 even while search debt remains open', () => {
    expect(deriveReviewVerdict(counts({ activeP0: 1, openSearchDebt: 2 }))).toEqual({
      verdict: 'FAIL',
      hasAdvisories: false,
    });
  });

  it('fails on a required gate that failed even while search debt remains open', () => {
    expect(deriveReviewVerdict(counts({ openSearchDebt: 1, failedRequiredGateIds: ['coverage'] }))).toEqual({
      verdict: 'FAIL',
      hasAdvisories: false,
    });
  });

  it('keeps every verdict when no search debt remains', () => {
    expect(deriveReviewVerdict(counts({ openSearchDebt: 0 })).verdict).toBe('PASS');
    expect(deriveReviewVerdict(counts({ openSearchDebt: 0, activeP1: 1 })).verdict).toBe('CONDITIONAL');
    expect(deriveReviewVerdict(counts({ openSearchDebt: 0, activeP0: 1 })).verdict).toBe('FAIL');
  });

  it('passes with nothing active and no failed gate', () => {
    expect(deriveReviewVerdict(counts())).toEqual({
      verdict: 'PASS',
      hasAdvisories: false,
    });
  });

  it('marks a pass as carrying advisories while an active P2 remains', () => {
    expect(deriveReviewVerdict(counts({ activeP2: 1 }))).toEqual({
      verdict: 'PASS',
      hasAdvisories: true,
    });
  });
});

describe('review-verdict CLI', () => {
  it('reads the gate ids from the last terminal-gates row over the registry', () => {
    const run = runRegistryVerdict(
      { openFindings: [], terminalGates: { failedRequiredGateIds: [] } },
      [
        { type: 'event', event: 'terminal_gates', failedRequiredGateIds: ['coverage'] },
        { type: 'event', event: 'terminal_gates', failedRequiredGateIds: ['evidence'] },
      ],
    );
    const payload = JSON.parse(run.stdout) as VerdictPayload;

    expect(run.status).toBe(0);
    expect(payload).toMatchObject({
      status: 'ok',
      verdict: 'FAIL',
      has_advisories: false,
      failed_required_gate_ids: ['evidence'],
    });
  });

  it('counts only the findings the registry records as active', () => {
    const run = runRegistryVerdict(
      {
        openFindings: [
          { findingId: 'f1', severity: 'P1', disposition: 'active' },
          { findingId: 'f2', severity: 'P0', disposition: 'resolved' },
          { findingId: 'f3', severity: 'P2', status: 'active' },
        ],
        terminalGates: { failedRequiredGateIds: [] },
      },
      [{ type: 'event', event: 'terminal_gates', failedRequiredGateIds: [] }],
    );
    const payload = JSON.parse(run.stdout) as VerdictPayload;

    expect(run.status).toBe(0);
    expect(payload).toMatchObject({
      status: 'ok',
      verdict: 'CONDITIONAL',
      has_advisories: false,
      active_p0: 0,
      active_p1: 1,
      active_p2: 1,
      search_debt: 0,
      failed_required_gate_ids: [],
    });
  });

  it('counts the search debt the registry still owes', () => {
    const run = runRegistryVerdict(
      {
        openFindings: [],
        searchDebt: [
          { bugClass: 'unguarded-input', disposition: 'deferred' },
          { bugClass: 'incomplete-guard', disposition: 'blocked' },
        ],
        terminalGates: { failedRequiredGateIds: [] },
      },
      [{ type: 'event', event: 'terminal_gates', failedRequiredGateIds: [] }],
    );
    const payload = JSON.parse(run.stdout) as VerdictPayload;

    expect(run.status).toBe(0);
    expect(payload).toMatchObject({
      status: 'ok',
      verdict: 'CONDITIONAL',
      has_advisories: false,
      search_debt: 2,
    });
  });

  it('derives the verdict from the values a merge already bound', () => {
    const run = spawnScript([
      '--active-p0', '0',
      '--active-p1', '0',
      '--active-p2', '2',
      '--search-debt', '0',
      '--failed-gate-ids', '[]',
    ]);
    const payload = JSON.parse(run.stdout) as VerdictPayload;

    expect(run.status).toBe(0);
    expect(payload).toEqual({
      status: 'ok',
      verdict: 'PASS',
      has_advisories: true,
      active_p0: 0,
      active_p1: 0,
      active_p2: 2,
      search_debt: 0,
      failed_required_gate_ids: [],
    });
  });

  it('refuses a bound verdict that omits the search debt', () => {
    const run = spawnScript([
      '--active-p0', '0',
      '--active-p1', '0',
      '--active-p2', '0',
      '--failed-gate-ids', '[]',
    ]);
    const payload = JSON.parse(run.stdout) as { status: string; error: string };

    expect(run.status).toBe(2);
    expect(payload.status).toBe('error');
    expect(payload.error).toContain('--search-debt');
  });

  it('reports an unknown flag as an error and exits 2', () => {
    const run = spawnScript(['--merge-verdict', 'PASS']);
    const payload = JSON.parse(run.stdout) as { status: string; error: string };

    expect(run.status).toBe(2);
    expect(payload.status).toBe('error');
    expect(payload.error).toContain('--merge-verdict');
  });
});
