// ───────────────────────────────────────────────────────────────────
// MODULE: Traceability Rollup Tests
// ───────────────────────────────────────────────────────────────────
//
// Proves the rollup folds every shape an iteration records its traceability
// checks in -- a canonical results array, results keyed by the short protocol
// field, protocol-to-status maps, protocol-to-object maps, and the same maps
// nested under core and overlay -- into the one protocol result form the
// coverage gate reads. It also proves that a pass which records a protocol as
// undecided cannot erase the verdict an earlier pass reached, and that a run
// recorded only as a status map still closes the coverage gate end to end.

import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { afterAll, describe, expect, it } from 'vitest';

type TraceabilityResult = {
  protocolId: string;
  status: string;
  gateClass: string;
  applicable: boolean;
  evidenceRefs?: string[];
};

type TraceabilityRollup = {
  summary: {
    required: number;
    executed: number;
    pass: number;
    partial: number;
    fail: number;
    blocked: number;
    notApplicable: number;
    gatingFailures: number;
  };
  results: TraceabilityResult[];
};

type TerminalGateRow = {
  gateId: string;
  status: string;
  reasonCode: string;
};

const requireCjs = createRequire(import.meta.url);
const {
  buildTraceabilityRollup,
  normalizeTraceabilityChecks,
  reduceReviewState,
} = requireCjs('../../scripts/reduce-state.cjs') as {
  buildTraceabilityRollup: (records: unknown[]) => TraceabilityRollup;
  normalizeTraceabilityChecks: (checks: unknown) => TraceabilityResult[];
  reduceReviewState: (
    specFolder: string,
    options?: Record<string, unknown>,
  ) => { registryPath: string };
};

const TERMINAL_GATES = resolve(import.meta.dirname, '..', '..', 'scripts', 'terminal-gates.cjs');

const tempDirs: string[] = [];

afterAll(() => {
  for (const dir of tempDirs) rmSync(dir, { recursive: true, force: true });
});

function tempDir(): string {
  const dir = mkdtempSync(join(tmpdir(), 'dlr-traceability-rollup-'));
  tempDirs.push(dir);
  return dir;
}

function protocolStatusRows(results: TraceabilityResult[]): string[][] {
  return results.map((result) => [result.protocolId, result.status]);
}

describe('normalizeTraceabilityChecks', () => {
  it('reads the canonical results array and keeps the recorded verdict', () => {
    const results = normalizeTraceabilityChecks({
      results: [
        { protocolId: 'spec_code', status: 'pass', gateClass: 'hard', applicable: true },
        { protocolId: 'skill_agent', status: 'partial', gateClass: 'advisory', applicable: true },
      ],
      summary: {
        required: 2, executed: 2, pass: 1, partial: 1, fail: 0,
        blocked: 0, notApplicable: 0, gatingFailures: 1,
      },
    });

    expect(results.map((result) => [result.protocolId, result.status, result.gateClass])).toEqual([
      ['spec_code', 'pass', 'hard'],
      ['skill_agent', 'partial', 'advisory'],
    ]);
  });

  it('reads a results item keyed by the short protocol field', () => {
    const results = normalizeTraceabilityChecks({
      results: [{ protocol: 'spec_code', status: 'fail' }],
    });

    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({ protocolId: 'spec_code', status: 'fail', gateClass: 'hard' });
  });

  it('reads a protocol-to-status map and skips the map notes', () => {
    const results = normalizeTraceabilityChecks({
      spec_code: 'pass',
      checklist_evidence: 'partial',
      notes: 'both protocols ran over the changed surface',
    });

    expect(protocolStatusRows(results)).toEqual([
      ['spec_code', 'pass'],
      ['checklist_evidence', 'partial'],
    ]);
  });

  it('reads a protocol-to-object map and keeps its evidence', () => {
    const results = normalizeTraceabilityChecks({
      spec_code: { status: 'pass', evidenceRefs: ['README.md:48'], note: 'claims resolve' },
    });

    expect(results[0]).toMatchObject({
      protocolId: 'spec_code',
      status: 'pass',
      gateClass: 'hard',
      applicable: true,
      evidenceRefs: ['README.md:48'],
    });
  });

  it('reads the same maps nested under core and overlay', () => {
    const results = normalizeTraceabilityChecks({
      core: { spec_code: 'pass', checklist_evidence: 'pass' },
      overlay: { skill_agent: 'pass' },
      note: 'the overlay applies to a skill target',
    });

    expect(results.map((result) => [result.protocolId, result.status, result.gateClass])).toEqual([
      ['spec_code', 'pass', 'hard'],
      ['checklist_evidence', 'pass', 'hard'],
      ['skill_agent', 'pass', 'advisory'],
    ]);
  });
});

describe('traceability status parsing', () => {
  it('takes the leading status word and keeps only the known ones', () => {
    const results = normalizeTraceabilityChecks({
      spec_code: 'pass in iteration 3',
      checklist_evidence: 'partial; claim not adjudicated',
      skill_agent: 'deferred - same drift as the previous pass',
      agent_cross_runtime: 'prior partial; unchanged',
      feature_catalog_code: 'blocked on a missing catalog entry',
      playbook_capability: 'Skimmed the playbook',
    });

    expect(protocolStatusRows(results)).toEqual([
      ['spec_code', 'pass'],
      ['checklist_evidence', 'partial'],
      ['skill_agent', 'deferred'],
      ['feature_catalog_code', 'blocked'],
    ]);
  });

  it('folds every not-applicable spelling onto one status and marks it inapplicable', () => {
    const results = normalizeTraceabilityChecks({
      core: { spec_code: 'n/a', checklist_evidence: 'not_applicable' },
      overlay: { skill_agent: 'notApplicable', agent_cross_runtime: 'not-applicable' },
    });

    expect(results.map((result) => [result.protocolId, result.status, result.applicable])).toEqual([
      ['spec_code', 'notApplicable', false],
      ['checklist_evidence', 'notApplicable', false],
      ['skill_agent', 'notApplicable', false],
      ['agent_cross_runtime', 'notApplicable', false],
    ]);
  });

  it('drops a results entry whose status is not a known word', () => {
    const results = normalizeTraceabilityChecks({
      results: [{ protocolId: 'spec_code', status: 'looks fine to me' }],
      checklist_evidence: 'pass',
    });

    expect(protocolStatusRows(results)).toEqual([['checklist_evidence', 'pass']]);
  });
});

describe('buildTraceabilityRollup', () => {
  it('counts a not-applicable protocol apart from the ones coverage requires', () => {
    const rollup = buildTraceabilityRollup([
      { traceabilityChecks: { core: { spec_code: 'pass', checklist_evidence: 'not_applicable' } } },
    ]);

    expect(rollup.summary).toMatchObject({
      required: 1,
      executed: 1,
      pass: 1,
      notApplicable: 1,
      gatingFailures: 0,
    });
    expect(rollup.results).toHaveLength(2);
  });

  it('keeps an earlier result when a later pass records the protocol as undecided', () => {
    const rollup = buildTraceabilityRollup([
      { traceabilityChecks: { results: [{ protocolId: 'spec_code', status: 'pass', gateClass: 'hard' }] } },
      { traceabilityChecks: { core: { spec_code: 'deferred - not rechecked this pass' } } },
    ]);

    expect(rollup.results).toHaveLength(1);
    expect(rollup.results[0]).toMatchObject({ protocolId: 'spec_code', status: 'pass' });
    expect(rollup.summary).toMatchObject({ pass: 1, executed: 1, gatingFailures: 0 });
  });

  it('takes the latest result when a later pass reruns the protocol with evidence', () => {
    const rollup = buildTraceabilityRollup([
      { traceabilityChecks: { spec_code: 'partial' } },
      { traceabilityChecks: { spec_code: { status: 'pass', evidenceRefs: ['spec.md:12'] } } },
    ]);

    expect(rollup.results[0]).toMatchObject({ protocolId: 'spec_code', status: 'pass' });
    expect(rollup.summary).toMatchObject({ partial: 0, pass: 1, gatingFailures: 0 });
  });

  it('keeps a partial verdict when the later pass records no evidence for it', () => {
    const rollup = buildTraceabilityRollup([
      { traceabilityChecks: { spec_code: 'partial' } },
      { traceabilityChecks: { spec_code: 'pass' } },
    ]);

    expect(rollup.results[0]).toMatchObject({ protocolId: 'spec_code', status: 'partial' });
    expect(rollup.summary).toMatchObject({ partial: 1, pass: 0, gatingFailures: 1 });
  });

  it('defaults a missing gate class to the contract class so a hard protocol still gates', () => {
    const rollup = buildTraceabilityRollup([
      { traceabilityChecks: { core: { spec_code: 'partial' }, overlay: { skill_agent: 'partial' } } },
    ]);

    expect(rollup.results.map((result) => [result.protocolId, result.gateClass])).toEqual([
      ['spec_code', 'hard'],
      ['skill_agent', 'advisory'],
    ]);
    expect(rollup.summary.gatingFailures).toBe(1);
  });

  it('takes the contract class over a class the reviewer recorded', () => {
    const rollup = buildTraceabilityRollup([
      {
        traceabilityChecks: {
          results: [
            { protocolId: 'spec_code', status: 'partial', gateClass: 'advisory' },
            { protocolId: 'skill_agent', status: 'partial', gateClass: 'hard' },
            { protocolId: 'custom_overlay', status: 'partial', gateClass: 'hard' },
          ],
        },
      },
    ]);

    expect(rollup.results.map((result) => [result.protocolId, result.gateClass])).toEqual([
      ['spec_code', 'hard'],
      ['skill_agent', 'advisory'],
      ['custom_overlay', 'hard'],
    ]);
    expect(rollup.summary.gatingFailures).toBe(2);
  });
});

describe('coverage gate over recorded iterations', () => {
  function iterationRows(): Array<Record<string, unknown>> {
    return [1, 2, 3].map((iteration) => ({
      type: 'iteration',
      mode: 'review',
      iteration,
      run: iteration,
      status: 'complete',
      focus: 'correctness',
      dimensions: ['correctness'],
      filesReviewed: ['src/app.ts'],
      findingsCount: 0,
      findingsSummary: { P0: 0, P1: 0, P2: 0 },
      findingsNew: { P0: 0, P1: 0, P2: 0 },
      newFindingsRatio: 0.3 - iteration * 0.05,
      durationMs: 0,
      traceabilityChecks: {
        core: { spec_code: 'pass', checklist_evidence: 'pass' },
        note: 'core protocols recorded as a status map',
      },
    }));
  }

  it('closes coverage for a run that records the core protocols only as a status map', () => {
    const reviewDir = tempDir();
    const configPath = join(reviewDir, 'deep-review-config.json');
    const stateLogPath = join(reviewDir, 'deep-review-state.jsonl');
    writeFileSync(configPath, `${JSON.stringify({
      maxIterations: 5,
      reviewDimensions: ['correctness'],
      reviewScopeFiles: ['src/app.ts'],
      crossReference: { core: ['spec_code', 'checklist_evidence'] },
    })}\n`, 'utf8');
    writeFileSync(stateLogPath, `${iterationRows().map((row) => JSON.stringify(row)).join('\n')}\n`, 'utf8');

    const reduced = reduceReviewState(reviewDir, { write: true, artifactDir: reviewDir });
    const run = spawnSync(process.execPath, [
      TERMINAL_GATES,
      '--config-path', configPath,
      '--registry-path', reduced.registryPath,
      '--state-log', stateLogPath,
    ], { cwd: resolve(import.meta.dirname, '..', '..'), encoding: 'utf8' });

    const payload = JSON.parse(run.stdout ?? '{}') as {
      terminal_gate_results_json: TerminalGateRow[];
    };
    const coverage = payload.terminal_gate_results_json
      .find((row) => row.gateId === 'coverage');

    expect(run.status).toBe(0);
    expect(coverage?.reasonCode).not.toBe('traceability-incomplete');
    expect(coverage?.status).toBe('pass');
  });
});
