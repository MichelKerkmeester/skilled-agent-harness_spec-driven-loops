// Proves the deep-review-projections projection surface folds ledger
// events into the ledger-derivable findings registry whose JSON shape
// matches the exact records the finding/evidence/adjudication/lineage
// stems carry. The load-bearing check is not self-consistency of the
// fold but that the projected bytes hold the concrete ledger-derivable
// content (findings, evidence, adjudications, lineage) and omit the
// prose files the ledger does not carry. The negative-control toggle
// proves the findings assertion can go red.

import { execFileSync } from 'node:child_process';
import {
  mkdtempSync,
  readFileSync,
  writeFileSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

import {
  createDeepReviewProjectionsProjectionContract,
  foldLegacyProjectionSurface,
} from '../../lib/legacy-projections/index.js';

import type { EventReadResult, JsonObject } from '../../lib/event-envelope/index.js';

const here = dirname(fileURLToPath(import.meta.url));
const runtimeRoot = resolve(here, '..', '..');
const CONTRACT_PATH = resolve(
  runtimeRoot, 'lib', 'legacy-projections', 'deep-review-projections-contract.ts',
);
const TSX_BIN = resolve(runtimeRoot, 'node_modules', '.bin', 'tsx');

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
        event_type: `deep-review.ledger.${stem.replace(/^deep_review\./, '').replace(/_/g, '-')}`,
        occurred_at: occurredAt,
        payload: { stem, scope, data },
      },
    },
  } as unknown as EventReadResult;
}

// Synthetic events exercising every registry-bearing stem once, plus a
// non-registry stem (dimension_pass_started) to prove it is ignored. The
// fixture holds one finding candidate, one fresh evidence observation,
// one reconciled evidence record, one adjudication, and one lineage row.
function registryFixtureEvents(): EventReadResult[] {
  return [
    reviewEvent(
      'deep_review.dimension_pass_started',
      { runId: 'rev-1', sessionId: 's-1', generation: 1, iterationId: 'it-1', dimensionId: 'dim-1' },
      { passNumber: 1 },
    ),
    reviewEvent(
      'deep_review.finding_candidate_emitted',
      { runId: 'rev-1', sessionId: 's-1', generation: 1, iterationId: 'it-1', dimensionId: 'dim-1', candidateId: 'cand-1' },
      {
        targetRefs: ['t-1'],
        evidenceRefs: ['ev-1'],
        claimTextDigest: 'ctd-1',
        findingClass: 'bug',
        impact: 0.8,
        rawConfidence: 0.6,
        rawCandidateScore: 0.5,
        actionability: 0.4,
        reachability: 0.3,
        exploitability: 0.2,
        evidenceType: 'inspection',
        evidenceScope: 'direct',
        rawObservationDigest: 'rod-1',
        semanticFingerprint: { parts: [] },
        sourcePassEventId: 'pass-1',
      },
    ),
    reviewEvent(
      'deep_review.evidence_observed',
      { runId: 'rev-1', sessionId: 's-1', generation: 1, iterationId: 'it-1', dimensionId: 'dim-1', candidateId: 'cand-1', evidenceId: 'ev-1' },
      {
        locator: { kind: 'file', value: 'src/a.ts' },
        observationKind: 'inspection',
        rawResultDigest: 'rrd-1',
        sourceDigest: 'sd-1',
        contentDigest: 'cd-1',
        toolFingerprint: 'tf-1',
        analyzerFingerprint: 'af-1',
        independentEvidenceClass: 'primary',
        causalProximityStatus: 'direct',
        stabilityStatus: 'stable',
        relevanceStatus: 'relevant',
        supersedesEvidenceEventId: null,
      },
    ),
    reviewEvent(
      'deep_review.evidence_reconciled',
      { runId: 'rev-1', sessionId: 's-1', generation: 1, iterationId: 'it-1', dimensionId: 'dim-1', candidateId: 'cand-1', evidenceId: 'ev-2' },
      {
        locator: { kind: 'file', value: 'src/b.ts' },
        observationKind: 'runtime-witness',
        rawResultDigest: 'rrd-2',
        sourceDigest: 'sd-2',
        contentDigest: 'cd-2',
        toolFingerprint: 'tf-2',
        analyzerFingerprint: 'af-2',
        independentEvidenceClass: 'secondary',
        causalProximityStatus: 'indirect',
        stabilityStatus: 'stable',
        relevanceStatus: 'relevant',
        supersedesEvidenceEventId: 'ev-1',
        reconciliationOutcome: 'confirmed',
        evidenceSetDigest: 'esd-1',
      },
    ),
    reviewEvent(
      'deep_review.claim_adjudication_recorded',
      { runId: 'rev-1', sessionId: 's-1', generation: 1, iterationId: 'it-1', dimensionId: 'dim-1', candidateId: 'cand-1', findingId: 'find-1' },
      {
        claimDigest: 'cd-1',
        evidenceRefs: ['ev-1', 'ev-2'],
        counterevidenceSoughtRefs: [],
        alternativeExplanationDigest: 'aed-1',
        finalSeverity: 'P1',
        impact: 0.8,
        confidence: 0.7,
        downgradeTrigger: 'none',
        transition: 'candidate-to-finding',
        validatorFingerprint: 'vf-1',
        adjudicationOutcome: 'accepted',
        predecessorAdjudicationEventId: null,
      },
    ),
    reviewEvent(
      'deep_review.finding_lineage_recorded',
      { runId: 'rev-1', sessionId: 's-1', generation: 1, iterationId: 'it-1', dimensionId: 'dim-1', findingId: 'find-1' },
      {
        priorFingerprint: { parts: [] },
        currentFingerprint: { parts: [] },
        lineageRelation: 'introduced',
        baselineStatus: 'absent',
        evidenceSetDigest: 'esd-2',
        predecessorEventRef: 'pred-1',
      },
    ),
  ];
}

function decodeUtf8(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes);
}

function parseJson(bytes: Uint8Array): JsonObject {
  return JSON.parse(decodeUtf8(bytes)) as JsonObject;
}

const scratchDirs: string[] = [];
afterEach(() => {
  while (scratchDirs.length > 0) {
    const dir = scratchDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

// ───────────────────────────────────────────────────────────────────
// (a) BYTE PROOF — concrete ledger-derivable registry content
// ───────────────────────────────────────────────────────────────────

describe('deep-review-projections projection surface — findings-registry byte proof', () => {
  it('folds registry-bearing events into one JSON artifact with the exact ledger-derivable records', () => {
    const surface = createDeepReviewProjectionsProjectionContract();
    const events = registryFixtureEvents();
    const folded = foldLegacyProjectionSurface(surface, events, fakeHead);

    // One artifact: the findings registry. The two prose files in the
    // mixed surface are omitted (not ledger-derivable), so exactly one.
    expect(folded).toHaveLength(1);
    expect(folded[0].relativePath).toBe('review/deep-review-findings-registry.json');
    expect(folded[0].format).toBe('json');
    expect(folded[0].artifactId).toBe('review-projections:findings-registry');

    const registry = parseJson(folded[0].bytes);
    const findings = registry.findings as JsonObject[];
    const evidence = registry.evidence as JsonObject[];
    const adjudications = registry.adjudications as JsonObject[];
    const lineage = registry.lineage as JsonObject[];

    // One finding from finding_candidate_emitted; dimension_pass_started
    // ignored.
    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatchObject({
      candidateId: 'cand-1',
      dimensionId: 'dim-1',
      findingClass: 'bug',
      claimTextDigest: 'ctd-1',
      evidenceRefs: ['ev-1'],
      targetRefs: ['t-1'],
      impact: 0.8,
      rawConfidence: 0.6,
      reachability: 0.3,
      exploitability: 0.2,
      evidenceType: 'inspection',
      evidenceScope: 'direct',
      rawObservationDigest: 'rod-1',
      sourcePassEventId: 'pass-1',
      producerEventTimestamp: FIXED_TS,
    });

    // Two evidence records: one fresh (evidence_observed, empty
    // reconciliation fields), one reconciled (evidence_reconciled, with
    // supersedes + outcome).
    expect(evidence).toHaveLength(2);
    expect(evidence[0]).toMatchObject({
      evidenceId: 'ev-1',
      candidateId: 'cand-1',
      dimensionId: 'dim-1',
      observationKind: 'inspection',
      rawResultDigest: 'rrd-1',
      sourceDigest: 'sd-1',
      contentDigest: 'cd-1',
      independentEvidenceClass: 'primary',
      causalProximityStatus: 'direct',
      stabilityStatus: 'stable',
      relevanceStatus: 'relevant',
      supersedesEvidenceEventId: '',
      reconciliationOutcome: '',
      producerEventTimestamp: FIXED_TS,
    });
    expect(evidence[1]).toMatchObject({
      evidenceId: 'ev-2',
      observationKind: 'runtime-witness',
      independentEvidenceClass: 'secondary',
      causalProximityStatus: 'indirect',
      supersedesEvidenceEventId: 'ev-1',
      reconciliationOutcome: 'confirmed',
      producerEventTimestamp: FIXED_TS,
    });

    // One adjudication from claim_adjudication_recorded.
    expect(adjudications).toHaveLength(1);
    expect(adjudications[0]).toMatchObject({
      findingId: 'find-1',
      candidateId: 'cand-1',
      dimensionId: 'dim-1',
      claimDigest: 'cd-1',
      evidenceRefs: ['ev-1', 'ev-2'],
      finalSeverity: 'P1',
      impact: 0.8,
      confidence: 0.7,
      adjudicationOutcome: 'accepted',
      transition: 'candidate-to-finding',
      downgradeTrigger: 'none',
      predecessorAdjudicationEventId: '',
      producerEventTimestamp: FIXED_TS,
    });

    // One lineage row from finding_lineage_recorded.
    expect(lineage).toHaveLength(1);
    expect(lineage[0]).toMatchObject({
      findingId: 'find-1',
      dimensionId: 'dim-1',
      lineageRelation: 'introduced',
      baselineStatus: 'absent',
      predecessorEventRef: 'pred-1',
      producerEventTimestamp: FIXED_TS,
    });

    // The prose files are omitted: the registry carries only the four
    // ledger-derivable arrays, no dashboard/report keys.
    expect(Object.keys(registry).sort()).toEqual(
      ['adjudications', 'evidence', 'findings', 'lineage'],
    );
  });

  it('produces stable pretty-printed JSON bytes with a trailing newline', () => {
    const surface = createDeepReviewProjectionsProjectionContract();
    const folded = foldLegacyProjectionSurface(surface, registryFixtureEvents(), fakeHead);
    const text = decodeUtf8(folded[0].bytes);
    expect(text.endsWith('\n')).toBe(true);
    expect(text).toContain('\n  "findings":');
    const reparsed = parseJson(folded[0].bytes);
    expect((reparsed.findings as JsonObject[]).length).toBe(1);
  });
});

// ───────────────────────────────────────────────────────────────────
// (b) NEGATIVE CONTROL
// ───────────────────────────────────────────────────────────────────

// The helper runs in a fresh tsx subprocess so the flipped toggle is
// observed. It folds the same fixture events and reports the findings
// count and the evidence count so the GREEN/RED contrast is the
// findings array length, not a self-consistency tautology.
function writeNegControlHelper(helperPath: string): void {
  const helper = `import { createDeepReviewProjectionsProjectionContract } from ${JSON.stringify(CONTRACT_PATH.replace(/\\.ts$/, '.js'))};
import { foldLegacyProjectionSurface } from ${JSON.stringify(resolve(runtimeRoot, 'lib', 'legacy-projections', 'legacy-projection-surface-fold.js'))};
import type { EventReadResult } from ${JSON.stringify(resolve(runtimeRoot, 'lib', 'event-envelope', 'index.js'))};
const TS = ${JSON.stringify(FIXED_TS)};
function ev(stem: string, scope: Record<string, unknown>, data: Record<string, unknown>): EventReadResult {
  return { effective: { envelope: { event_type: 'x', occurred_at: TS, payload: { stem, scope, data } } } } as unknown as EventReadResult;
}
const events: EventReadResult[] = [
  ev('deep_review.finding_candidate_emitted', { runId: 'r', sessionId: 's', generation: 1, iterationId: 'i', dimensionId: 'd', candidateId: 'c1' }, { targetRefs: [], evidenceRefs: [], claimTextDigest: 'x', findingClass: 'bug', impact: 0.5, rawConfidence: 0.5, rawCandidateScore: 0.5, actionability: 0.5, reachability: 0.5, exploitability: 0.5, evidenceType: 'inspection', evidenceScope: 'direct', rawObservationDigest: 'x', semanticFingerprint: { parts: [] }, sourcePassEventId: 'p' }),
  ev('deep_review.evidence_observed', { runId: 'r', sessionId: 's', generation: 1, iterationId: 'i', dimensionId: 'd', candidateId: 'c1', evidenceId: 'e1' }, { locator: {}, observationKind: 'inspection', rawResultDigest: 'x', sourceDigest: 'x', contentDigest: 'x', toolFingerprint: 'x', analyzerFingerprint: 'x', independentEvidenceClass: 'p', causalProximityStatus: 'direct', stabilityStatus: 'stable', relevanceStatus: 'relevant', supersedesEvidenceEventId: null }),
];
const surface = createDeepReviewProjectionsProjectionContract();
const head = { ledgerId: 'deep-review-ledger', sequence: 0, recordHash: '0'.repeat(64) };
const folded = foldLegacyProjectionSurface(surface, events, head as any);
const registry = JSON.parse(new TextDecoder().decode(folded[0].bytes));
const findingsCount = registry.findings.length;
const evidenceCount = registry.evidence.length;
process.stdout.write(JSON.stringify({ findingsCount, evidenceCount }));
`;
  writeFileSync(helperPath, helper);
}

interface NegControlCounts {
  readonly findingsCount: number;
  readonly evidenceCount: number;
}

describe('deep-review-projections projection surface — negative control', () => {
  it('flips the contract toggle GREEN->RED->RESTORE and prints all three states', () => {
    // Sanity: the contract starts in the production (true) state.
    const before = readFileSync(CONTRACT_PATH, 'utf8');
    expect(before).toContain('const EMIT_FINDINGS = true;');

    const tmp = mkdtempSync(join(tmpdir(), 'review-proj-negctl-'));
    scratchDirs.push(tmp);
    const helperPath = join(tmp, 'neg-control-helper.ts');
    writeNegControlHelper(helperPath);

    // One bash invocation runs the whole GREEN -> RED -> RESTORE sequence.
    // The RESTORE is performed BY the trap on EXIT/INT/TERM (not by an
    // explicit sed before exit), so the source is restored even if the
    // RED run is interrupted. All paths are absolute.
    const script = [
      `set -e`,
      `CONTRACT=${JSON.stringify(CONTRACT_PATH)}`,
      `HELPER=${JSON.stringify(helperPath)}`,
      `TSX=${JSON.stringify(TSX_BIN)}`,
      `run() { "$TSX" "$HELPER"; }`,
      `FLIP_FALSE="s/^const EMIT_FINDINGS = true;\\$/const EMIT_FINDINGS = false;/"`,
      `FLIP_TRUE="s/^const EMIT_FINDINGS = false;\\$/const EMIT_FINDINGS = true;/"`,
      `echo "GREEN: $(run)"`,
      `trap 'sed -i "" "$FLIP_TRUE" "$CONTRACT"; echo "RESTORE: $(run)"' EXIT INT TERM`,
      `sed -i '' "$FLIP_FALSE" "$CONTRACT"`,
      `echo "RED: $(run)"`,
    ].join('\n');

    let stdout: string;
    try {
      stdout = execFileSync('bash', ['-c', script], { cwd: runtimeRoot, encoding: 'utf8' });
    } finally {
      // Belt-and-suspenders: ensure the contract is restored even if the
      // bash invocation itself failed before the trap could fire.
      const afterAttempt = readFileSync(CONTRACT_PATH, 'utf8');
      if (afterAttempt.includes('const EMIT_FINDINGS = false;')) {
        const restored = afterAttempt.replace(
          'const EMIT_FINDINGS = false;',
          'const EMIT_FINDINGS = true;',
        );
        writeFileSync(CONTRACT_PATH, restored);
      }
    }

    const lines = stdout.split('\n').filter((l) => l.length > 0);
    const greenLine = lines.find((l) => l.startsWith('GREEN: '));
    const redLine = lines.find((l) => l.startsWith('RED: '));
    const restoreLine = lines.find((l) => l.startsWith('RESTORE: '));

    for (const l of lines) {
      process.stdout.write(`${l}\n`);
    }

    expect(greenLine).toBeDefined();
    expect(redLine).toBeDefined();
    expect(restoreLine).toBeDefined();

    const green = JSON.parse(greenLine!.slice('GREEN: '.length)) as NegControlCounts;
    const red = JSON.parse(redLine!.slice('RED: '.length)) as NegControlCounts;
    const restore = JSON.parse(restoreLine!.slice('RESTORE: '.length)) as NegControlCounts;

    // GREEN: the finding candidate is present; evidence still folds.
    expect(green.findingsCount).toBe(1);
    expect(green.evidenceCount).toBe(1);

    // RED: the toggle suppressed finding rows, so the findings array is
    // empty — the load-bearing assertion that would have passed green
    // now fails. Evidence still folds, proving the fold ran and only the
    // findings branch was disabled.
    expect(red.findingsCount).toBe(0);
    expect(red.evidenceCount).toBe(1);

    // RESTORE: the trap restored the toggle and the findings return.
    expect(restore.findingsCount).toBe(1);
    expect(restore.evidenceCount).toBe(1);

    // Final-state proof: the contract source is back to the production
    // toggle value with no stray mutation.
    const after = readFileSync(CONTRACT_PATH, 'utf8');
    expect(after).toContain('const EMIT_FINDINGS = true;');
    expect(after).not.toContain('const EMIT_FINDINGS = false;');
    expect(after).toBe(before);
  });
});
