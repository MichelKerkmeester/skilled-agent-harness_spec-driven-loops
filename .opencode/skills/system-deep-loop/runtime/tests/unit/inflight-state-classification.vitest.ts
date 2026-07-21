// ───────────────────────────────────────────────────────────────────
// MODULE: In-Flight State Classification Tests
// ───────────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { canonicalBytes, sha256Bytes } from '../../lib/event-envelope/index.js';

import {
  ClassificationErrorCodes,
  ClassificationReasonCodes,
  FROZEN_CENSUS_CONTRACT,
  FROZEN_CENSUS_ROW_IDS,
  FROZEN_CENSUS_ROW_POLICIES,
  InflightClassificationError,
  InflightDisposition,
  createClassificationManifest,
  createPhase014HandlingPlan,
  evaluateModeCutoverReadiness,
  serializeClassificationManifest,
  validateFrozenCensusDocument,
  verifyClassificationManifest,
  verifyPhase014HandlingPlan,
} from '../../lib/inflight-state-classification/index.js';

import type {
  ClassificationEvidence,
  DispositionProof,
  InflightClassificationManifest,
  Phase014EvidenceReceipts,
  StateBackendCensus,
  StateBackendCensusRow,
  WorkflowMode,
} from '../../lib/inflight-state-classification/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. FROZEN INPUTS
// ───────────────────────────────────────────────────────────────────

const TEST_DIRECTORY = dirname(fileURLToPath(import.meta.url));
const REPOSITORY_ROOT = resolve(TEST_DIRECTORY, '../../../../../..');
const CENSUS_PATH = join(
  REPOSITORY_ROOT,
  '.opencode/specs/system-deep-loop/036-deep-loop-innovation',
  '003-baseline-taxonomy-and-state-census/state-backend-census.json',
);
const CENSUS_BYTES = readFileSync(CENSUS_PATH);
const CENSUS = JSON.parse(CENSUS_BYTES.toString('utf8')) as StateBackendCensus;
const CLASSIFIED_AT = '2026-07-21T09:30:00Z';
const CLASSIFICATION_ID = 'inflight-classification-fixture';
const CLASSIFIER_BUILD_ID = 'classifier-build-fixture';

function digest(label: string): string {
  return createHash('sha256').update(label, 'utf8').digest('hex');
}

function proofFor(
  rowId: string,
  disposition: keyof typeof InflightDisposition,
): DispositionProof {
  switch (disposition) {
    case InflightDisposition.UPCAST:
      return {
        kind: 'upcast',
        adjacentChainComplete: true,
        pure: true,
        deterministic: true,
        sideEffectFree: true,
        sourceBytesPreserved: true,
        immutableIdentityPreserved: true,
        replayEquivalent: true,
        sourceBytesDigest: digest(`${rowId}:source`),
        effectiveStateDigest: digest(`${rowId}:effective`),
        registryDigest: digest(`${rowId}:registry`),
        chainIdentitiesDigest: digest(`${rowId}:chain`),
      };
    case InflightDisposition.PIN:
      return {
        kind: 'pin',
        legacyWriterSoleAuthority: true,
        legacyCompletionAvailable: true,
        boundedCompletion: true,
        timedOut: false,
        terminalBoundary: 'legacy-terminal-receipt',
        terminalReceiptRequired: true,
      };
    case InflightDisposition.FORK:
      return {
        kind: 'fork',
        executionNamespace: `shadow-execution-${rowId}`,
        effectNamespace: `shadow-effects-${rowId}`,
        shadowOnlySink: true,
        livePublicationEnabled: false,
        sourceStateUnchanged: true,
        authorityUnaffected: true,
        budgetsUnaffected: true,
      };
    case InflightDisposition.MIGRATE:
      return {
        kind: 'migrate',
        quiescentCheckpoint: true,
        transactionalSnapshot: true,
        atomicImport: true,
        reversible: true,
        identityPreserved: true,
        orderPreserved: true,
        idempotencyPreserved: true,
        budgetsPreserved: true,
        receiptsPreserved: true,
        pendingWorkPreserved: true,
        checkpointDigest: digest(`${rowId}:checkpoint`),
        restorationReceiptDigest: digest(`${rowId}:restoration`),
      };
    case InflightDisposition.BLOCK:
      return {
        kind: 'block',
        veto: 'execution-control-must-drain',
      };
  }
}

function evidenceFor(row: StateBackendCensusRow): ClassificationEvidence {
  const policy = FROZEN_CENSUS_ROW_POLICIES[
    row.id as keyof typeof FROZEN_CENSUS_ROW_POLICIES
  ];
  const isPin = policy.disposition === InflightDisposition.PIN;
  const isPolicyBlock = policy.disposition === InflightDisposition.BLOCK;
  return {
    rowId: row.id,
    isPresent: !isPolicyBlock,
    stateDigest: digest(`${row.id}:state`),
    shapeVersion: '1',
    shapeStatus: 'registered',
    schemaDigest: digest(`${row.id}:schema`),
    lifecyclePoint: row.lifecycle,
    authorityState: 'legacy_authoritative',
    authorityEpoch: 7,
    mutability: row.mutability,
    leaseState: isPin ? 'active' : 'none',
    activeLeaseCount: isPin ? 1 : 0,
    leaseSetDigest: digest(`${row.id}:leases`),
    pendingEffectsState: isPin ? 'active-legacy' : 'none',
    pendingEffectSetDigest: digest(`${row.id}:effects`),
    identityCoverage: true,
    orderCoverage: true,
    idempotencyCoverage: true,
    budgetCoverage: true,
    receiptCoverage: true,
    pendingWorkCoverage: true,
    isCorrupt: false,
    rollbackAnchor: {
      anchorId: `legacy-anchor-${row.id}`,
      digest: digest(`${row.id}:rollback-anchor`),
      retained: true,
      restorable: true,
      minimumRetentionDays: 14,
      minimumSuccessfulRuns: 5,
    },
    verifier: {
      verified: true,
      receiptDigest: digest(`${row.id}:verifier`),
      replayFingerprintDigest: policy.disposition === InflightDisposition.UPCAST
        ? digest(`${row.id}:replay-fingerprint`)
        : null,
      rollbackScenarioDigest: digest(`${row.id}:rollback-scenario`),
      parityCaseDigest: policy.disposition === InflightDisposition.FORK
        ? digest(`${row.id}:parity-case`)
        : null,
    },
    proof: proofFor(row.id, policy.disposition),
  };
}

function allEvidence(): ClassificationEvidence[] {
  return CENSUS.rows.map(evidenceFor);
}

function cloneEvidence(evidence: ClassificationEvidence): ClassificationEvidence {
  return JSON.parse(JSON.stringify(evidence)) as ClassificationEvidence;
}

function replaceEvidence(
  values: readonly ClassificationEvidence[],
  replacement: ClassificationEvidence,
): ClassificationEvidence[] {
  return values.map((value) => value.rowId === replacement.rowId ? replacement : value);
}

function requiredEvidence(
  values: readonly ClassificationEvidence[],
  rowId: string,
): ClassificationEvidence {
  const evidence = values.find((item) => item.rowId === rowId);
  if (!evidence) throw new Error(`Missing test evidence for ${rowId}`);
  return evidence;
}

function buildManifest(
  evidence: readonly unknown[] = allEvidence(),
): InflightClassificationManifest {
  return createClassificationManifest({
    classificationId: CLASSIFICATION_ID,
    classifiedAt: CLASSIFIED_AT,
    classifierBuildId: CLASSIFIER_BUILD_ID,
    censusBytes: CENSUS_BYTES,
    evidence,
  }).manifest;
}

function completeReceipts(
  manifest: InflightClassificationManifest,
): Phase014EvidenceReceipts {
  const terminalPinReceipts: Record<string, string> = {};
  const forkParityReceipts: Record<string, string> = {};
  const migrationReceipts: Record<string, string> = {};
  for (const row of manifest.rows) {
    if (row.evidence.isPresent === false) continue;
    if (row.disposition === InflightDisposition.PIN) {
      terminalPinReceipts[row.rowId] = digest(`${row.rowId}:terminal`);
    }
    if (row.disposition === InflightDisposition.FORK) {
      forkParityReceipts[row.rowId] = digest(`${row.rowId}:parity`);
    }
    if (row.disposition === InflightDisposition.MIGRATE) {
      migrationReceipts[row.rowId] = digest(`${row.rowId}:migration`);
    }
  }
  return {
    rollbackRehearsalReceiptDigest: digest('rollback-rehearsal'),
    terminalPinReceipts,
    forkParityReceipts,
    migrationReceipts,
    failedVerifierRowIds: [],
  };
}

function expectClassificationError(
  action: () => unknown,
  code: string,
): void {
  try {
    action();
    throw new Error('Expected classification failure');
  } catch (error: unknown) {
    expect(error).toBeInstanceOf(InflightClassificationError);
    expect((error as InflightClassificationError).code).toBe(code);
  }
}

// ───────────────────────────────────────────────────────────────────
// 2. CENSUS CLOSURE AND AUDITABILITY
// ───────────────────────────────────────────────────────────────────

describe('frozen census ingestion', () => {
  it('binds the exact 46-row census bytes and every row-level policy', () => {
    const actualDigest = createHash('sha256').update(CENSUS_BYTES).digest('hex');
    const censusIds = [...CENSUS.rows.map((row) => row.id)].sort();

    expect(actualDigest).toBe(FROZEN_CENSUS_CONTRACT.stateBackendCensusSha256);
    expect(CENSUS.baseSha).toBe(FROZEN_CENSUS_CONTRACT.baseSha);
    expect(CENSUS.rows).toHaveLength(46);
    expect(censusIds).toEqual([...FROZEN_CENSUS_ROW_IDS]);
    expect(Object.keys(FROZEN_CENSUS_ROW_POLICIES)).toHaveLength(46);
  });

  it('rejects tampered census bytes before classification', () => {
    const tampered = Buffer.from(CENSUS_BYTES);
    const offset = tampered.indexOf('research-config');
    tampered[offset] = 'R'.charCodeAt(0);

    expectClassificationError(
      () => createClassificationManifest({
        classificationId: CLASSIFICATION_ID,
        classifiedAt: CLASSIFIED_AT,
        classifierBuildId: CLASSIFIER_BUILD_ID,
        censusBytes: tampered,
        evidence: allEvidence(),
      }),
      ClassificationErrorCodes.CENSUS_DIGEST_MISMATCH,
    );
  });

  it('rejects a duplicate row during structural closure validation', () => {
    const candidate = {
      ...CENSUS,
      rows: [...CENSUS.rows, CENSUS.rows[0]],
    };
    expectClassificationError(
      () => validateFrozenCensusDocument(candidate),
      ClassificationErrorCodes.CENSUS_DUPLICATE_ROW,
    );
  });

  it('rejects a missing row during structural closure validation', () => {
    const candidate = {
      ...CENSUS,
      rows: CENSUS.rows.slice(1),
    };
    expectClassificationError(
      () => validateFrozenCensusDocument(candidate),
      ClassificationErrorCodes.CENSUS_ROW_MISSING,
    );
  });

  it('rejects a newly discovered row with no explicit policy', () => {
    const candidate = {
      ...CENSUS,
      rows: [
        ...CENSUS.rows.slice(0, -1),
        { ...CENSUS.rows.at(-1), id: 'unclassified-runtime-state' },
      ],
    };
    expectClassificationError(
      () => validateFrozenCensusDocument(candidate),
      ClassificationErrorCodes.CENSUS_ROW_UNRECOGNIZED,
    );
  });
});

// ───────────────────────────────────────────────────────────────────
// 3. TOTAL, EXCLUSIVE, FAIL-CLOSED CLASSIFICATION
// ───────────────────────────────────────────────────────────────────

describe('five-way classification', () => {
  it('classifies every census row exactly once with a rationale', () => {
    const manifest = buildManifest();
    const rowIds = manifest.rows.map((row) => row.rowId);
    const dispositionCounts = manifest.rows.reduce<Record<string, number>>(
      (counts, row) => ({ ...counts, [row.disposition]: (counts[row.disposition] ?? 0) + 1 }),
      {},
    );

    expect(manifest.rows).toHaveLength(46);
    expect(new Set(rowIds).size).toBe(46);
    expect(manifest.rows.every((row) => row.rationale.length > 0)).toBe(true);
    expect(manifest.rows.every((row) => (
      Object.values(InflightDisposition).includes(row.disposition)
    ))).toBe(true);
    expect(dispositionCounts).toEqual({
      BLOCK: 7,
      FORK: 4,
      MIGRATE: 6,
      PIN: 18,
      UPCAST: 11,
    });
    expect(manifest.closure).toMatchObject({
      censusRows: 46,
      classifiedRows: 46,
      missingCensusRows: 0,
      duplicateCensusRows: 0,
      unrecognizedCensusRows: 0,
      duplicateManifestRows: 0,
      unknownDispositionRows: 0,
      missingEvidenceRows: 0,
      invalidEvidenceRows: 0,
      blockedRows: 7,
      liveBlockedRows: 0,
    });
  });

  it('keeps totality while missing evidence becomes one explicit block', () => {
    const evidence = allEvidence().filter((item) => item.rowId !== 'research-deltas');
    const manifest = buildManifest(evidence);
    const row = manifest.rows.find((item) => item.rowId === 'research-deltas');

    expect(manifest.rows).toHaveLength(46);
    expect(row?.disposition).toBe(InflightDisposition.BLOCK);
    expect(row?.reasonCode).toBe(ClassificationReasonCodes.MISSING_EVIDENCE);
    expect(manifest.closure.missingEvidenceRows).toBe(1);
    expect(manifest.closure.liveBlockedRows).toBe(1);
  });

  it('rejects duplicate evidence rather than choosing one copy', () => {
    const evidence = allEvidence();
    expectClassificationError(
      () => buildManifest([...evidence, cloneEvidence(evidence[0])]),
      ClassificationErrorCodes.EVIDENCE_DUPLICATE_ROW,
    );
  });

  it('blocks evidence whose mutability drifts from the census', () => {
    const evidence = allEvidence();
    const changed = cloneEvidence(requiredEvidence(evidence, 'research-deltas'));
    Object.assign(changed, { mutability: 'mutable-overwrite' });
    const manifest = buildManifest(replaceEvidence(evidence, changed));
    const row = manifest.rows.find((item) => item.rowId === changed.rowId);

    expect(row?.disposition).toBe(InflightDisposition.BLOCK);
    expect(row?.reasonCode).toBe(ClassificationReasonCodes.INVALID_EVIDENCE);
  });

  it('blocks corrupt state before any positive class is evaluated', () => {
    const evidence = allEvidence();
    const original = requiredEvidence(evidence, 'research-deltas');
    const changed: ClassificationEvidence = { ...original, isCorrupt: true };
    const manifest = buildManifest(replaceEvidence(evidence, changed));
    const row = manifest.rows.find((item) => item.rowId === changed.rowId);

    expect(row?.disposition).toBe(InflightDisposition.BLOCK);
    expect(row?.reasonCode).toBe(ClassificationReasonCodes.CORRUPT_STATE);
  });

  it.each(['unknown', 'future', 'malformed'] as const)(
    'blocks a %s state shape',
    (shapeStatus) => {
      const evidence = allEvidence();
      const original = requiredEvidence(evidence, 'research-deltas');
      const changed: ClassificationEvidence = { ...original, shapeStatus };
      const manifest = buildManifest(replaceEvidence(evidence, changed));
      const row = manifest.rows.find((item) => item.rowId === changed.rowId);

      expect(row?.disposition).toBe(InflightDisposition.BLOCK);
      expect(row?.reasonCode).toBe(ClassificationReasonCodes.UNKNOWN_SHAPE);
    },
  );

  it('blocks uncertain pending effects before state handling', () => {
    const evidence = allEvidence();
    const original = requiredEvidence(evidence, 'research-state');
    const changed: ClassificationEvidence = {
      ...original,
      pendingEffectsState: 'uncertain',
    };
    const manifest = buildManifest(replaceEvidence(evidence, changed));
    const row = manifest.rows.find((item) => item.rowId === changed.rowId);

    expect(row?.disposition).toBe(InflightDisposition.BLOCK);
    expect(row?.reasonCode).toBe(ClassificationReasonCodes.PENDING_EFFECTS_UNSAFE);
  });

  it('blocks uncertain lease ownership before state handling', () => {
    const evidence = allEvidence();
    const original = requiredEvidence(evidence, 'research-state');
    const changed: ClassificationEvidence = {
      ...original,
      leaseState: 'uncertain',
      activeLeaseCount: 0,
    };
    const manifest = buildManifest(replaceEvidence(evidence, changed));
    const row = manifest.rows.find((item) => item.rowId === changed.rowId);

    expect(row?.disposition).toBe(InflightDisposition.BLOCK);
    expect(row?.reasonCode).toBe(ClassificationReasonCodes.LEASE_STATE_UNSAFE);
  });

  it.each([
    ['thirteen retained days', { minimumRetentionDays: 13 }],
    ['four successful runs', { minimumSuccessfulRuns: 4 }],
    ['an unrestorable anchor', { restorable: false }],
  ] as const)('blocks %s', (_label, anchorOverride) => {
    const evidence = allEvidence();
    const original = requiredEvidence(evidence, 'research-state');
    const changed: ClassificationEvidence = {
      ...original,
      rollbackAnchor: { ...original.rollbackAnchor, ...anchorOverride },
    };
    const manifest = buildManifest(replaceEvidence(evidence, changed));
    const row = manifest.rows.find((item) => item.rowId === changed.rowId);

    expect(row?.disposition).toBe(InflightDisposition.BLOCK);
    expect(row?.reasonCode).toBe(ClassificationReasonCodes.ROLLBACK_ANCHOR_UNSAFE);
  });

  it('blocks an upcast when the adjacent pure chain is not proven', () => {
    const evidence = allEvidence();
    const original = cloneEvidence(requiredEvidence(evidence, 'research-deltas'));
    if (original.proof.kind !== 'upcast') throw new Error('Expected upcast proof');
    const changed: ClassificationEvidence = {
      ...original,
      proof: { ...original.proof, adjacentChainComplete: false },
    };
    const manifest = buildManifest(replaceEvidence(evidence, changed));
    const row = manifest.rows.find((item) => item.rowId === changed.rowId);

    expect(row?.disposition).toBe(InflightDisposition.BLOCK);
    expect(row?.reasonCode).toBe(ClassificationReasonCodes.UPCAST_UNSAFE);
  });

  it('blocks a lossy upcast instead of silently migrating it', () => {
    const evidence = allEvidence();
    const original = cloneEvidence(requiredEvidence(evidence, 'research-deltas'));
    if (original.proof.kind !== 'upcast') throw new Error('Expected upcast proof');
    const changed: ClassificationEvidence = {
      ...original,
      proof: { ...original.proof, replayEquivalent: false },
    };
    const manifest = buildManifest(replaceEvidence(evidence, changed));
    const row = manifest.rows.find((item) => item.rowId === changed.rowId);

    expect(row?.disposition).toBe(InflightDisposition.BLOCK);
    expect(row?.reasonCode).toBe(ClassificationReasonCodes.UPCAST_UNSAFE);
    expect(row?.disposition).not.toBe(InflightDisposition.MIGRATE);
  });

  it('blocks a migration when reversible semantic preservation is incomplete', () => {
    const evidence = allEvidence();
    const original = cloneEvidence(requiredEvidence(evidence, 'research-state'));
    if (original.proof.kind !== 'migrate') throw new Error('Expected migration proof');
    const changed: ClassificationEvidence = {
      ...original,
      proof: { ...original.proof, receiptsPreserved: false },
    };
    const manifest = buildManifest(replaceEvidence(evidence, changed));
    const row = manifest.rows.find((item) => item.rowId === changed.rowId);

    expect(row?.disposition).toBe(InflightDisposition.BLOCK);
    expect(row?.reasonCode).toBe(ClassificationReasonCodes.MIGRATION_UNSAFE);
    expect(row?.disposition).not.toBe(InflightDisposition.MIGRATE);
  });

  it('blocks a partial migration checkpoint', () => {
    const evidence = allEvidence();
    const original = cloneEvidence(requiredEvidence(evidence, 'research-state'));
    if (original.proof.kind !== 'migrate') throw new Error('Expected migration proof');
    const changed: ClassificationEvidence = {
      ...original,
      proof: { ...original.proof, transactionalSnapshot: false },
    };
    const manifest = buildManifest(replaceEvidence(evidence, changed));
    const row = manifest.rows.find((item) => item.rowId === changed.rowId);

    expect(row?.disposition).toBe(InflightDisposition.BLOCK);
    expect(row?.reasonCode).toBe(ClassificationReasonCodes.MIGRATION_UNSAFE);
  });

  it('blocks a pin after timeout instead of admitting dual authority', () => {
    const evidence = allEvidence();
    const original = cloneEvidence(requiredEvidence(evidence, 'research-strategy-inbox'));
    if (original.proof.kind !== 'pin') throw new Error('Expected pin proof');
    const changed: ClassificationEvidence = {
      ...original,
      proof: { ...original.proof, timedOut: true },
    };
    const manifest = buildManifest(replaceEvidence(evidence, changed));
    const row = manifest.rows.find((item) => item.rowId === changed.rowId);

    expect(row?.disposition).toBe(InflightDisposition.BLOCK);
    expect(row?.reasonCode).toBe(ClassificationReasonCodes.PIN_UNSAFE);
    expect(manifest.authorityPosture).toBe('legacy-authoritative-dark');
  });

  it('blocks a fork that can publish live effects and leaves source evidence unchanged', () => {
    const evidence = allEvidence();
    const original = cloneEvidence(requiredEvidence(evidence, 'behavior-benchmark-output'));
    if (original.proof.kind !== 'fork') throw new Error('Expected fork proof');
    const changed: ClassificationEvidence = {
      ...original,
      proof: { ...original.proof, livePublicationEnabled: true },
    };
    const sourceBefore = JSON.stringify(changed);
    const manifest = buildManifest(replaceEvidence(evidence, changed));
    const row = manifest.rows.find((item) => item.rowId === changed.rowId);

    expect(row?.disposition).toBe(InflightDisposition.BLOCK);
    expect(row?.reasonCode).toBe(ClassificationReasonCodes.FORK_UNSAFE);
    expect(JSON.stringify(changed)).toBe(sourceBefore);
  });

  it('blocks a fork with no bound parity case', () => {
    const evidence = allEvidence();
    const original = requiredEvidence(evidence, 'behavior-benchmark-output');
    const changed: ClassificationEvidence = {
      ...original,
      verifier: { ...original.verifier, parityCaseDigest: null },
    };
    const manifest = buildManifest(replaceEvidence(evidence, changed));
    const row = manifest.rows.find((item) => item.rowId === changed.rowId);

    expect(row?.disposition).toBe(InflightDisposition.BLOCK);
    expect(row?.reasonCode).toBe(ClassificationReasonCodes.FORK_UNSAFE);
  });

  it('keeps active lock state as a live hard veto', () => {
    const evidence = allEvidence();
    const changed: ClassificationEvidence = {
      ...cloneEvidence(requiredEvidence(evidence, 'research-controls')),
      isPresent: true,
      leaseState: 'active',
      activeLeaseCount: 1,
    };
    const currentEvidence = replaceEvidence(evidence, changed);
    const manifest = buildManifest(currentEvidence);
    const plan = createPhase014HandlingPlan(manifest, currentEvidence);
    const readiness = evaluateModeCutoverReadiness(
      manifest,
      plan,
      'research',
      completeReceipts(manifest),
    );

    expect(manifest.closure.liveBlockedRows).toBe(1);
    expect(readiness.eligible).toBe(false);
    expect(readiness.blockedRowIds).toContain('research-controls');
    expect(readiness.reasonCodes).toContain(ClassificationReasonCodes.POLICY_BLOCK);
  });

  it('does not copy unexpected payload or prompt fields into the manifest', () => {
    const evidence = allEvidence();
    const first = evidence[0] as ClassificationEvidence & Record<string, unknown>;
    first.prompt = 'sensitive prompt bytes';
    first.payload = { secret: 'sensitive payload bytes' };
    const serialized = serializeClassificationManifest(buildManifest(evidence));

    expect(serialized).not.toContain('sensitive prompt bytes');
    expect(serialized).not.toContain('sensitive payload bytes');
  });
});

// ───────────────────────────────────────────────────────────────────
// 4. DETERMINISM AND FRESHNESS
// ───────────────────────────────────────────────────────────────────

describe('deterministic manifest and freshness gate', () => {
  it('produces byte-identical manifests regardless of evidence input order', () => {
    const evidence = allEvidence();
    const forward = createClassificationManifest({
      classificationId: CLASSIFICATION_ID,
      classifiedAt: CLASSIFIED_AT,
      classifierBuildId: CLASSIFIER_BUILD_ID,
      censusBytes: CENSUS_BYTES,
      evidence,
    });
    const reverse = createClassificationManifest({
      classificationId: CLASSIFICATION_ID,
      classifiedAt: CLASSIFIED_AT,
      classifierBuildId: CLASSIFIER_BUILD_ID,
      censusBytes: CENSUS_BYTES,
      evidence: [...evidence].reverse(),
    });

    expect(forward.manifest.finalDigest).toBe(reverse.manifest.finalDigest);
    expect(forward.canonicalBytes).toEqual(reverse.canonicalBytes);
    expect(verifyClassificationManifest(forward.manifest)).toBe(true);
  });

  it('rejects a rehashed manifest that changes a frozen positive disposition', () => {
    const manifest = buildManifest();
    const modifiedRows = manifest.rows.map((row) => row.rowId === 'research-deltas'
      ? {
        ...row,
        disposition: InflightDisposition.MIGRATE,
        reasonCode: ClassificationReasonCodes.MIGRATION_REVERSIBLE,
      }
      : row);
    const core = {
      manifestVersion: manifest.manifestVersion,
      classificationId: manifest.classificationId,
      classifiedAt: manifest.classifiedAt,
      classifierBuildId: manifest.classifierBuildId,
      census: manifest.census,
      authorityPosture: manifest.authorityPosture,
      authorityMutationPermitted: manifest.authorityMutationPermitted,
      legacyRetirementPermitted: manifest.legacyRetirementPermitted,
      rows: modifiedRows,
      modeSummaries: manifest.modeSummaries,
      closure: manifest.closure,
    };
    const rehashed = {
      ...core,
      finalDigest: sha256Bytes(canonicalBytes(core)),
    };

    expect(verifyClassificationManifest(rehashed)).toBe(false);
  });

  const freshnessMutations: readonly [
    string,
    (evidence: ClassificationEvidence) => ClassificationEvidence,
  ][] = [
    ['state digest', (evidence) => ({
      ...evidence,
      stateDigest: digest('drifted-state'),
    })],
    ['presence', (evidence) => ({ ...evidence, isPresent: false })],
    ['authority epoch', (evidence) => ({
      ...evidence,
      authorityEpoch: evidence.authorityEpoch + 1,
    })],
    ['shape version', (evidence) => ({ ...evidence, shapeVersion: '2' })],
    ['schema digest', (evidence) => ({
      ...evidence,
      schemaDigest: digest('drifted-schema'),
    })],
    ['lease set', (evidence) => ({
      ...evidence,
      leaseSetDigest: digest('drifted-leases'),
    })],
    ['pending effects', (evidence) => ({
      ...evidence,
      pendingEffectSetDigest: digest('drifted-effects'),
    })],
    ['rollback anchor', (evidence) => ({
      ...evidence,
      rollbackAnchor: {
        ...evidence.rollbackAnchor,
        digest: digest('drifted-anchor'),
      },
    })],
  ];

  it.each(freshnessMutations)('blocks %s drift before handling', (_label, mutate) => {
    const classifiedEvidence = allEvidence();
    const manifest = buildManifest(classifiedEvidence);
    const current = classifiedEvidence.map(cloneEvidence);
    const target = mutate(requiredEvidence(current, 'research-deltas'));
    const plan = createPhase014HandlingPlan(manifest, replaceEvidence(current, target));
    const instruction = plan.instructions.find((item) => item.rowId === target.rowId);

    expect(instruction?.instruction).toBe(InflightDisposition.BLOCK);
    expect(instruction?.reasonCode).toBe(ClassificationReasonCodes.CLASSIFICATION_STALE);
    expect(plan.authorityMutationPermitted).toBe(false);
  });

  it('keeps absent-state drift as a live fail-closed cutover veto', () => {
    const classifiedEvidence = allEvidence();
    const manifest = buildManifest(classifiedEvidence);
    const current = classifiedEvidence.map(cloneEvidence);
    const original = requiredEvidence(current, 'research-deltas');
    const changed = { ...original, isPresent: false };
    const plan = createPhase014HandlingPlan(manifest, replaceEvidence(current, changed));
    const readiness = evaluateModeCutoverReadiness(
      manifest,
      plan,
      'research',
      completeReceipts(manifest),
    );

    expect(readiness.eligible).toBe(false);
    expect(readiness.blockedRowIds).toContain('research-deltas');
    expect(readiness.reasonCodes).toContain(ClassificationReasonCodes.CLASSIFICATION_STALE);
  });
});

// ───────────────────────────────────────────────────────────────────
// 5. READ-ONLY CUTOVER READINESS
// ───────────────────────────────────────────────────────────────────

describe('mode cutover readiness', () => {
  function setup(mode: WorkflowMode = 'research') {
    const evidence = allEvidence();
    const manifest = buildManifest(evidence);
    const plan = createPhase014HandlingPlan(manifest, evidence);
    const receipts = completeReceipts(manifest);
    return { mode, evidence, manifest, plan, receipts };
  }

  it('returns eligible only after all live class receipts and rollback rehearsal exist', () => {
    const { mode, manifest, plan, receipts } = setup();
    const readiness = evaluateModeCutoverReadiness(manifest, plan, mode, receipts);

    expect(readiness).toEqual({
      mode: 'research',
      eligible: true,
      authorityMutationPermitted: false,
      reasonCodes: [],
      blockedRowIds: [],
    });
    expect(manifest.authorityMutationPermitted).toBe(false);
    expect(manifest.legacyRetirementPermitted).toBe(false);
    expect(plan.authorityMutationPermitted).toBe(false);
  });

  it('refuses an unterminated pin', () => {
    const { mode, manifest, plan, receipts } = setup();
    const terminalPinReceipts = Object.fromEntries(
      Object.entries(receipts.terminalPinReceipts)
        .filter(([rowId]) => rowId !== 'research-strategy-inbox'),
    );
    const readiness = evaluateModeCutoverReadiness(manifest, plan, mode, {
      ...receipts,
      terminalPinReceipts,
    });

    expect(readiness.eligible).toBe(false);
    expect(readiness.blockedRowIds).toContain('research-strategy-inbox');
    expect(readiness.reasonCodes).toContain(ClassificationReasonCodes.RECEIPT_INCOMPLETE);
  });

  it('refuses a missing parity-fork receipt', () => {
    const { mode, manifest, plan, receipts } = setup();
    const forkParityReceipts = Object.fromEntries(
      Object.entries(receipts.forkParityReceipts)
        .filter(([rowId]) => rowId !== 'behavior-benchmark-output'),
    );
    const readiness = evaluateModeCutoverReadiness(manifest, plan, mode, {
      ...receipts,
      forkParityReceipts,
    });

    expect(readiness.eligible).toBe(false);
    expect(readiness.blockedRowIds).toContain('behavior-benchmark-output');
  });

  it('refuses a failed class verifier', () => {
    const { mode, manifest, plan, receipts } = setup();
    const readiness = evaluateModeCutoverReadiness(manifest, plan, mode, {
      ...receipts,
      failedVerifierRowIds: ['research-deltas'],
    });

    expect(readiness.eligible).toBe(false);
    expect(readiness.blockedRowIds).toContain('research-deltas');
    expect(readiness.reasonCodes).toContain(ClassificationReasonCodes.VERIFIER_FAILED);
  });

  it('refuses a missing rollback rehearsal', () => {
    const { mode, manifest, plan, receipts } = setup();
    const readiness = evaluateModeCutoverReadiness(manifest, plan, mode, {
      ...receipts,
      rollbackRehearsalReceiptDigest: null,
    });

    expect(readiness.eligible).toBe(false);
    expect(readiness.reasonCodes).toContain(ClassificationReasonCodes.RECEIPT_INCOMPLETE);
  });

  it('refuses a tampered manifest or handling plan without moving authority', () => {
    const { mode, manifest, plan, receipts } = setup();
    const tampered = {
      ...manifest,
      finalDigest: digest('tampered-manifest'),
    };
    const readiness = evaluateModeCutoverReadiness(tampered, plan, mode, receipts);

    expect(verifyClassificationManifest(tampered)).toBe(false);
    expect(readiness.eligible).toBe(false);
    expect(readiness.authorityMutationPermitted).toBe(false);
    expect(readiness.reasonCodes).toEqual([
      ClassificationReasonCodes.MANIFEST_INTEGRITY_FAILED,
    ]);
  });

  it('rejects a rehashed handling plan that omits a census row', () => {
    const { mode, manifest, plan, receipts } = setup();
    const core = {
      planVersion: plan.planVersion,
      manifestDigest: plan.manifestDigest,
      authorityPosture: plan.authorityPosture,
      authorityMutationPermitted: plan.authorityMutationPermitted,
      instructions: plan.instructions.slice(1),
    };
    const rehashed = {
      ...core,
      finalDigest: sha256Bytes(canonicalBytes(core)),
    };
    const readiness = evaluateModeCutoverReadiness(manifest, rehashed, mode, receipts);

    expect(verifyPhase014HandlingPlan(manifest, rehashed)).toBe(false);
    expect(readiness.eligible).toBe(false);
    expect(readiness.authorityMutationPermitted).toBe(false);
    expect(readiness.reasonCodes).toEqual([
      ClassificationReasonCodes.MANIFEST_INTEGRITY_FAILED,
    ]);
  });
});
