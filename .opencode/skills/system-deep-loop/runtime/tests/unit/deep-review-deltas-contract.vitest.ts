// Proves the deep-review-deltas projection surface fans ledger events out
// into one per-iteration delta file whose rows match the exact shape the real
// deep-review reducer's loadDeltaPayloads + buildRegistry consume. The
// load-bearing check is not self-consistency of the fold but that the REAL
// consumer reads the projected files without corruption and the finding
// registry reflects the findings that were folded.

import { createRequire } from 'node:module';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, basename } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  createDeepReviewDeltasProjectionContract,
  foldLegacyProjectionSurface,
} from '../../lib/legacy-projections/index.js';

import type { EventReadResult, JsonObject } from '../../lib/event-envelope/index.js';

const require_ = createRequire(import.meta.url);
// The consumer is shipped as CommonJS; require it through createRequire so the
// projected files are exercised by the same code path the runtime uses.
const { reduceReviewState } = require_('../../scripts/reduce-state.cjs') as {
  reduceReviewState: (
    specFolder: string,
    options?: Record<string, unknown>,
  ) => {
    hasCorruption: boolean;
    corruptionWarnings: unknown[];
    registry: {
      openFindingsCount: number;
      resolvedFindingsCount: number;
      openFindings: { findingId: string; severity: string }[];
    };
  };
};

const FIXED_TS = '2026-08-23T00:00:00.000Z';
const TEST_LEDGER_ID = 'deep-review-ledger';
const GENESIS_HASH = '0'.repeat(64);

const fakeHead = Object.freeze({
  ledgerId: TEST_LEDGER_ID,
  sequence: 0,
  recordHash: GENESIS_HASH,
});

// A minimal event carrying only the fields the contract's reduce() reads:
// effective.envelope.{event_type, occurred_at, payload:{stem, scope, data}}.
function reviewEvent(
  stem: string,
  scope: Record<string, unknown>,
  data: Record<string, unknown>,
  occurredAt: string = FIXED_TS,
): EventReadResult {
  return {
    effective: {
      envelope: {
        event_type: `deep-review.ledger.${stem.replace(/^deep_review\./, '')}`,
        occurred_at: occurredAt,
        payload: { stem, scope, data },
      },
    },
  } as unknown as EventReadResult;
}

// Synthetic events spanning iterations 1 and 2 with finding-bearing stems.
// Iteration 1: a candidate emitted then adjudicated to P1.
// Iteration 2: a candidate adjudicated to P0.
// The candidate row has no severity and is dropped by the consumer; the
// adjudication rows carry finalSeverity and populate the registry.
function deltaFixtureEvents(): EventReadResult[] {
  return [
    reviewEvent(
      'deep_review.finding_candidate_emitted',
      { runId: 'rev-1', sessionId: 's1', generation: 1, iterationId: '1', dimensionId: 'correctness', candidateId: 'C001' },
      { findingClass: 'logic', evidenceRefs: ['E001'], claimTextDigest: 'd1', impact: 0.5, rawConfidence: 0.8, rawCandidateScore: 0.7, actionability: 0.6, reachability: 0.5, exploitability: 0.4, evidenceType: 'inspection', evidenceScope: 'direct', rawObservationDigest: 'd2', semanticFingerprint: { algorithmVersion: '1', semanticAnchorDigest: 'd3', normalizedContextDigest: 'd4', programSliceDigest: 'd5', renameMapVersion: '1', baselineState: 'absent' }, sourcePassEventId: 'EVT-001' },
    ),
    reviewEvent(
      'deep_review.claim_adjudication_recorded',
      { runId: 'rev-1', sessionId: 's1', generation: 1, iterationId: '1', dimensionId: 'correctness', candidateId: 'C001', findingId: 'F001' },
      { claimDigest: 'd6', evidenceRefs: ['E001'], counterevidenceSoughtRefs: [], alternativeExplanationDigest: 'd7', finalSeverity: 'P1', impact: 0.5, confidence: 0.8, downgradeTrigger: 'none', transition: 'candidate-to-finding', validatorFingerprint: 'd8', adjudicationOutcome: 'accepted', predecessorAdjudicationEventId: null },
    ),
    reviewEvent(
      'deep_review.claim_adjudication_recorded',
      { runId: 'rev-1', sessionId: 's1', generation: 1, iterationId: '2', dimensionId: 'security', candidateId: 'C002', findingId: 'F002' },
      { claimDigest: 'd9', evidenceRefs: ['E002'], counterevidenceSoughtRefs: [], alternativeExplanationDigest: 'd10', finalSeverity: 'P0', impact: 0.9, confidence: 0.9, downgradeTrigger: 'none', transition: 'candidate-to-finding', validatorFingerprint: 'd11', adjudicationOutcome: 'accepted', predecessorAdjudicationEventId: null },
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

describe('deep-review-deltas projection surface', () => {
  it('fans out events into one jsonl artifact per iteration with only that iteration rows', () => {
    const surface = createDeepReviewDeltasProjectionContract();
    const events = deltaFixtureEvents();
    const folded = foldLegacyProjectionSurface(surface, events, fakeHead);

    // Two distinct iterations present (1 and 2) → exactly two artifacts.
    expect(folded).toHaveLength(2);
    expect(folded[0].relativePath).toBe('review/deltas/iter-001.jsonl');
    expect(folded[1].relativePath).toBe('review/deltas/iter-002.jsonl');
    expect(folded[0].format).toBe('jsonl');
    expect(folded[1].format).toBe('jsonl');
    expect(folded[0].artifactId).toBe('review-deltas:iter-001');
    expect(folded[1].artifactId).toBe('review-deltas:iter-002');

    // Iteration 1 file: candidate + adjudication rows, all iteration 1.
    const rows1 = parseJsonl(folded[0].bytes);
    expect(rows1).toHaveLength(2);
    expect(rows1.every((r) => r.iteration === 1)).toBe(true);
    expect(rows1[0]).toMatchObject({ type: 'finding', id: 'C001', status: 'candidate' });
    expect(rows1[1]).toMatchObject({ type: 'finding', id: 'F001', severity: 'P1', finalSeverity: 'P1' });

    // Iteration 2 file: one adjudication row, iteration 2 only.
    const rows2 = parseJsonl(folded[1].bytes);
    expect(rows2).toHaveLength(1);
    expect(rows2[0].iteration).toBe(2);
    expect(rows2[0]).toMatchObject({ type: 'finding', id: 'F002', severity: 'P0', finalSeverity: 'P0' });
  });

  it('produces delta files the real deep-review reducer reads without corruption and with the folded findings', () => {
    const specFolder = mkdtempSync(join(tmpdir(), 'review-deltas-projection-'));
    scratchDirs.push(specFolder);
    const reviewDir = join(specFolder, 'review');
    const deltasDir = join(reviewDir, 'deltas');
    mkdirSync(deltasDir, { recursive: true });

    // Write a minimal config and an empty state file so reduceReviewState runs.
    writeFileSync(
      join(reviewDir, 'deep-review-config.json'),
      JSON.stringify({ maxIterations: 5, reviewTarget: 'deltas-projection-proof' }),
    );
    writeFileSync(join(reviewDir, 'deep-review-state.jsonl'), '');

    // Fold and write each artifact's bytes to the deltas directory.
    const surface = createDeepReviewDeltasProjectionContract();
    const folded = foldLegacyProjectionSurface(surface, deltaFixtureEvents(), fakeHead);
    for (const artifact of folded) {
      writeFileSync(join(deltasDir, basename(artifact.relativePath)), decodeUtf8(artifact.bytes));
    }

    const result = reduceReviewState(specFolder, { write: false, artifactDir: reviewDir });

    // No corruption: the projected JSONL is well-formed.
    expect(result.hasCorruption).toBe(false);
    expect(result.corruptionWarnings).toHaveLength(0);

    // The registry reflects the two adjudicated findings (F001 P1, F002 P0).
    // The candidate row (C001, no severity) was silently dropped by
    // deltaRecordToFinding, proving the consumer reads the real row shape.
    expect(result.registry.openFindingsCount).toBe(2);
    const findingIds = result.registry.openFindings.map((f) => f.findingId).sort();
    expect(findingIds).toEqual(['F001', 'F002']);
    const byId = new Map(result.registry.openFindings.map((f) => [f.findingId, f]));
    expect(byId.get('F001')?.severity).toBe('P1');
    expect(byId.get('F002')?.severity).toBe('P0');
  });
});
