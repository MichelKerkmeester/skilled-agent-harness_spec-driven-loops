// Proves the deep-alignment-state-deltas projection surface folds ledger
// events into ONE state file plus one per-iteration delta file whose rows
// match the exact shapes the real alignment reducer
// (reduce-alignment-state.cjs) reads off the state log and the deltas
// directory. The load-bearing check is not self-consistency of the fold
// but that the REAL consumer reads the projected files without
// corruption and the derived registry reflects the folded
// iterations/findings.

import { createRequire } from 'node:module';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  createDeepAlignmentStateDeltasProjectionContract,
  foldLegacyProjectionSurface,
} from '../../lib/legacy-projections/index.js';

import type { EventReadResult, JsonObject } from '../../lib/event-envelope/index.js';

const require_ = createRequire(import.meta.url);
// The consumer is shipped as CommonJS; require it through createRequire so
// the projected files are exercised by the same code path the runtime uses.
// laneKey is required to compute the canonical laneId the reducer resolves
// from the config, so the folded rows carry the laneId the reducer filters
// by.
const { reduceAlignmentState, laneKey, buildLaneEntry, findingDedupKey } = require_('../../scripts/reduce-alignment-state.cjs') as {
  reduceAlignmentState: (
    specFolder: string,
    options?: Record<string, unknown>,
  ) => {
    hasCorruption: boolean;
    corruptionWarnings: unknown[];
    registry: {
      lanes: {
        laneId: string;
        iterationsRun: number;
        openFindings: { severity: string; findingId: string }[];
        findingsBySeverity: { P0: number; P1: number; P2: number };
        verdict: string;
      }[];
      overall: {
        findingsBySeverity: { P0: number; P1: number; P2: number };
        verdict: string;
      };
    };
  };
  laneKey: (lane: {
    authority: string;
    artifactClass: string;
    adapter?: string;
    scope: Record<string, unknown>;
  }) => string;
  buildLaneEntry: (
    requiredLane: {
      laneId: string;
      authority: string;
      adapter?: string;
      artifactClass: string;
      scope: Record<string, unknown>;
      canonicalScope?: Record<string, unknown>;
    },
    deltaRecords: Record<string, unknown>[],
    iterationRecords: Record<string, unknown>[],
  ) => {
    openFindings: { severity: string; [key: string]: unknown }[];
    findingsBySeverity: { P0: number; P1: number; P2: number };
  };
  findingDedupKey: (finding: Record<string, unknown>) => string;
};

const FIXED_TS = '2026-08-23T00:00:00.000Z';
const TEST_LEDGER_ID = 'deep-alignment-ledger';
const GENESIS_HASH = '0'.repeat(64);

const fakeHead = Object.freeze({
  ledgerId: TEST_LEDGER_ID,
  sequence: 0,
  recordHash: GENESIS_HASH,
});

// The lane the real reducer resolves from the proof config. Its laneId is
// derived canonically from the resolved lane tuple, so the folded rows
// must carry the same laneId the reducer will filter by.
const PROOF_LANE = Object.freeze({
  authority: 'sk-code',
  artifactClass: 'code',
  adapter: 'sk-code',
  scope: Object.freeze({ type: 'branchRange', from: 'main', to: 'feature/x' }),
});
const PROOF_LANE_ID = laneKey(PROOF_LANE);

// A minimal event carrying only the fields the contract's reduce() reads:
// effective.envelope.{event_type, occurred_at, payload:{stem, scope, data}}.
function alignmentEvent(
  stem: string,
  scope: Record<string, unknown>,
  data: Record<string, unknown>,
  occurredAt: string = FIXED_TS,
): EventReadResult {
  return {
    effective: {
      envelope: {
        event_type: `deep-alignment.ledger.${stem.replace(/^deep_alignment\./, '').replaceAll('_', '-')}`,
        occurred_at: occurredAt,
        payload: { stem, scope, data },
      },
    },
  } as unknown as EventReadResult;
}

// Synthetic events spanning two iterations of one lane. The state-bearing
// lane_completed events produce the iteration rows the reducer credits
// findings against; the delta-bearing claim_adjudication_recorded events
// produce the finding rows. Iteration 1 adjudicates a P1 finding;
// iteration 2 adjudicates a P0 finding. A run_initialized event seeds the
// config row so the state file is not empty.
function fixtureEvents(): EventReadResult[] {
  const baseScope = (iteration: number) => ({
    runId: 'align-1',
    sessionId: 's1',
    authorityEpochId: 'epoch-1',
    generation: 1,
    iterationId: String(iteration),
    laneId: PROOF_LANE_ID,
  });
  return [
    alignmentEvent(
      'deep_alignment.run_initialized',
      { runId: 'align-1', sessionId: 's1', authorityEpochId: 'epoch-1', generation: 1 },
      {
        target: { kind: 'repository', ref: 'HEAD' },
        lineageMode: 'fresh',
        maxIterations: 5,
        convergencePolicyVersion: '1',
        reviewModeContractDigest: '0'.repeat(64),
        initialReleaseReadinessState: 'not-assessed',
      },
    ),
    alignmentEvent(
      'deep_alignment.lane_completed',
      baseScope(1),
      {
        lanePlanEventId: 'EVT-LP-1',
        subjectSnapshotRef: 'snap-1',
        subjectSnapshotDigest: '0'.repeat(64),
        authorityValidationEventId: 'EVT-AV-1',
        applicabilityDecisionRefs: [],
        observationRefs: [],
        verificationRefs: [],
        status: 'complete',
        counts: { applicable: 0, notApplicable: 0, unresolved: 0, untested: 0, blocked: 0, nonConformant: 0 },
        completionDigest: '0'.repeat(64),
        blockedReasonCode: null,
      },
    ),
    alignmentEvent(
      'deep_alignment.claim_adjudication_recorded',
      { ...baseScope(1), candidateId: 'C001', findingId: 'F001', verificationId: 'V001' },
      {
        candidateEventId: 'EVT-C-1',
        verificationEventId: 'EVT-V-1',
        observationEventId: 'EVT-O-1',
        claimDigest: 'd1',
        evidenceReceiptRefs: ['E001'],
        proofWitnessRefs: [],
        counterevidenceRefs: [],
        verifierFingerprint: 'd2',
        assessorFingerprint: 'd3',
        authorityValidationEventId: 'EVT-AV-1',
        applicabilityDecisionId: 'EVT-AD-1',
        subjectSnapshotDigest: '0'.repeat(64),
        finalSeverity: 'P1',
        impact: 0.5,
        confidence: 0.8,
        outcome: 'accepted',
        transition: 'candidate-to-finding',
        adjudicationDigest: 'adj-d1',
        predecessorAdjudicationEventId: null,
      },
    ),
    alignmentEvent(
      'deep_alignment.lane_completed',
      baseScope(2),
      {
        lanePlanEventId: 'EVT-LP-2',
        subjectSnapshotRef: 'snap-2',
        subjectSnapshotDigest: '0'.repeat(64),
        authorityValidationEventId: 'EVT-AV-2',
        applicabilityDecisionRefs: [],
        observationRefs: [],
        verificationRefs: [],
        status: 'complete',
        counts: { applicable: 0, notApplicable: 0, unresolved: 0, untested: 0, blocked: 0, nonConformant: 0 },
        completionDigest: '0'.repeat(64),
        blockedReasonCode: null,
      },
    ),
    alignmentEvent(
      'deep_alignment.claim_adjudication_recorded',
      { ...baseScope(2), candidateId: 'C002', findingId: 'F002', verificationId: 'V002' },
      {
        candidateEventId: 'EVT-C-2',
        verificationEventId: 'EVT-V-2',
        observationEventId: 'EVT-O-2',
        claimDigest: 'd4',
        evidenceReceiptRefs: ['E002'],
        proofWitnessRefs: [],
        counterevidenceRefs: [],
        verifierFingerprint: 'd5',
        assessorFingerprint: 'd6',
        authorityValidationEventId: 'EVT-AV-2',
        applicabilityDecisionId: 'EVT-AD-2',
        subjectSnapshotDigest: '0'.repeat(64),
        finalSeverity: 'P0',
        impact: 0.9,
        confidence: 0.9,
        outcome: 'accepted',
        transition: 'candidate-to-finding',
        adjudicationDigest: 'adj-d2',
        predecessorAdjudicationEventId: null,
      },
    ),
  ];
}

function decodeUtf8(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes);
}

function parseJsonl(bytes: Uint8Array): JsonObject[] {
  const text = decodeUtf8(bytes).trimEnd();
  if (text === '') return [];
  return text.split('\n').map((line) => JSON.parse(line) as JsonObject);
}

const scratchDirs: string[] = [];
afterEach(() => {
  while (scratchDirs.length > 0) {
    const dir = scratchDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

describe('deep-alignment-state-deltas projection surface', () => {
  it('folds events into one state artifact plus one delta artifact per iteration', () => {
    const surface = createDeepAlignmentStateDeltasProjectionContract();
    const folded = foldLegacyProjectionSurface(surface, fixtureEvents(), fakeHead);

    // One state artifact + two delta artifacts (iterations 1 and 2).
    expect(folded).toHaveLength(3);

    const stateArtifact = folded.find((a) => a.artifactId === 'alignment-state');
    expect(stateArtifact).toBeDefined();
    expect(stateArtifact!.relativePath).toBe('alignment/deep-alignment-state.jsonl');
    expect(stateArtifact!.format).toBe('jsonl');

    const deltaArtifacts = folded.filter((a) => a.artifactId.startsWith('alignment-deltas:iter-'));
    expect(deltaArtifacts).toHaveLength(2);
    expect(deltaArtifacts[0].relativePath).toBe('alignment/deltas/iter-001.jsonl');
    expect(deltaArtifacts[1].relativePath).toBe('alignment/deltas/iter-002.jsonl');
    expect(deltaArtifacts[0].artifactId).toBe('alignment-deltas:iter-001');
    expect(deltaArtifacts[1].artifactId).toBe('alignment-deltas:iter-002');

    // State file: one config row + two iteration rows (lane_completed for
    // iterations 1 and 2), each carrying the canonical laneId.
    const stateRows = parseJsonl(stateArtifact!.bytes);
    const configRows = stateRows.filter((r) => r.type === 'config');
    const iterationRows = stateRows.filter((r) => r.type === 'iteration');
    expect(configRows).toHaveLength(1);
    expect(configRows[0]).toMatchObject({ topic: 'align-1', maxIterations: 5 });
    expect(iterationRows).toHaveLength(2);
    expect(iterationRows.every((r) => r.laneId === PROOF_LANE_ID)).toBe(true);
    expect(iterationRows[0]).toMatchObject({ iteration: 1, status: 'complete' });
    expect(iterationRows[1]).toMatchObject({ iteration: 2, status: 'complete' });

    // Delta file 1: one finding row, iteration 1 only, P1.
    const rows1 = parseJsonl(deltaArtifacts[0].bytes);
    expect(rows1).toHaveLength(1);
    expect(rows1[0].iteration).toBe(1);
    expect(rows1[0]).toMatchObject({ type: 'finding', laneId: PROOF_LANE_ID });
    expect((rows1[0].finding as JsonObject).severity).toBe('P1');

    // Delta file 2: one finding row, iteration 2 only, P0.
    const rows2 = parseJsonl(deltaArtifacts[1].bytes);
    expect(rows2).toHaveLength(1);
    expect(rows2[0].iteration).toBe(2);
    expect(rows2[0]).toMatchObject({ type: 'finding', laneId: PROOF_LANE_ID });
    expect((rows2[0].finding as JsonObject).severity).toBe('P0');
  });

  it('produces files the real alignment reducer reads without corruption and with the folded iterations/findings', () => {
    const specFolder = mkdtempSync(join(tmpdir(), 'alignment-state-deltas-projection-'));
    scratchDirs.push(specFolder);
    const alignmentDir = join(specFolder, 'alignment');
    mkdirSync(alignmentDir, { recursive: true });

    // Minimal config the reducer's resolveLanesFromConfig accepts: one
    // branchRange lane whose canonical laneId matches the folded rows.
    writeFileSync(
      join(alignmentDir, 'deep-alignment-config.json'),
      JSON.stringify({
        alignmentTarget: 'state-deltas-projection-proof',
        lanes: [PROOF_LANE],
      }),
    );

    // Fold and write each artifact's bytes at its spec-folder-relative path
    // (the state file under alignment/, each delta under alignment/deltas/).
    const surface = createDeepAlignmentStateDeltasProjectionContract();
    const folded = foldLegacyProjectionSurface(surface, fixtureEvents(), fakeHead);
    for (const artifact of folded) {
      const outputPath = join(specFolder, artifact.relativePath);
      mkdirSync(dirname(outputPath), { recursive: true });
      writeFileSync(outputPath, decodeUtf8(artifact.bytes));
    }

    const result = reduceAlignmentState(specFolder, { write: false });

    // No corruption: the projected JSONL is well-formed and the config is
    // valid, so the reducer reports a clean parse.
    expect(result.hasCorruption).toBe(false);
    expect(result.corruptionWarnings).toHaveLength(0);

    // The reducer resolved the one configured lane.
    expect(result.registry.lanes).toHaveLength(1);
    const lane = result.registry.lanes[0];
    expect(lane.laneId).toBe(PROOF_LANE_ID);

    // The two lane_completed iteration rows are reflected as iterationsRun.
    expect(lane.iterationsRun).toBe(2);

    // The two adjudicated findings (F001 P1, F002 P0) are credited because
    // each iteration's state-log row is status:'complete', which the
    // reducer's isCreditableDeltaFinding accepts.
    expect(lane.openFindings).toHaveLength(2);
    const findingIds = lane.openFindings.map((f) => f.findingId).sort();
    expect(findingIds).toEqual(['F001', 'F002']);
    const byId = new Map(lane.openFindings.map((f) => [f.findingId, f]));
    expect(byId.get('F001')?.severity).toBe('P1');
    expect(byId.get('F002')?.severity).toBe('P0');

    // The overall rollup aggregates the two findings by severity.
    expect(result.registry.overall.findingsBySeverity.P0).toBe(1);
    expect(result.registry.overall.findingsBySeverity.P1).toBe(1);
    expect(result.registry.overall.findingsBySeverity.P2).toBe(0);
  });
});

// Regression coverage for findingDedupKey excluding severity from a finding's
// identity. A re-check that still fails re-emits the same finding, and a
// retriage can change its severity between iterations (e.g. P1 escalated to
// P0). Keying dedup on severity would treat that as two distinct findings
// instead of one finding whose severity was updated, double-counting it in
// the release gate.
describe('reduce-alignment-state findingDedupKey — severity excluded from finding identity', () => {
  const requiredLane = Object.freeze({
    laneId: PROOF_LANE_ID,
    authority: PROOF_LANE.authority,
    adapter: PROOF_LANE.adapter,
    artifactClass: PROOF_LANE.artifactClass,
    scope: PROOF_LANE.scope,
    canonicalScope: PROOF_LANE.scope,
  });

  it('findingDedupKey ignores severity in its fallback (non-contentHash) key shape', () => {
    const base = { type: 'missing-test', message: 'Endpoint X lacks integration coverage', artifactPath: 'src/x.ts' };
    expect(findingDedupKey({ ...base, severity: 'P1' })).toBe(findingDedupKey({ ...base, severity: 'P0' }));
  });

  it('collapses a retriaged finding into one open finding at the more severe of the two occurrences', () => {
    const iterationRecords = [{ type: 'iteration', laneId: PROOF_LANE_ID, iteration: 1, status: 'complete' }];
    const deltaRecords = [
      { type: 'finding', laneId: PROOF_LANE_ID, finding: { type: 'missing-test', message: 'Endpoint X lacks integration coverage', artifactPath: 'src/x.ts', severity: 'P1' } },
      { type: 'finding', laneId: PROOF_LANE_ID, finding: { type: 'missing-test', message: 'Endpoint X lacks integration coverage', artifactPath: 'src/x.ts', severity: 'P0' } },
    ];

    const entry = buildLaneEntry(requiredLane, deltaRecords, iterationRecords);

    // Before the fix, severity was part of the dedup key, so the P0
    // re-emission of the exact same finding produced a second open finding
    // instead of being recognized as the same finding retriaged.
    expect(entry.openFindings).toHaveLength(1);
    expect(entry.openFindings[0].severity).toBe('P0');
    expect(entry.findingsBySeverity).toEqual({ P0: 1, P1: 0, P2: 0 });
  });
});
