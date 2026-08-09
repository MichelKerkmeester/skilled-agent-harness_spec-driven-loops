// ───────────────────────────────────────────────────────────────────
// MODULE: Per-Mode Authority Flip Tests
// ───────────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

import {
  AppendOnlyLedger,
  TransitionAuthorizationGateway,
  TransitionPolicyRegistry,
} from '../../lib/authorized-ledger/index.js';
import { buildCutoverCertificate } from '../../lib/cutover-certificate/index.js';
import { canonicalBytes, sha256Bytes } from '../../lib/event-envelope/index.js';
import {
  createClassificationManifest,
  FROZEN_CENSUS_ROW_POLICIES,
  InflightDisposition,
} from '../../lib/inflight-state-classification/index.js';
import {
  buildInflightMigrationHandoff,
  MigrationCoordinator,
} from '../../lib/inflight-state-migration/index.js';
import { writeCanonicalJsonAtomic } from '../../lib/locks-and-fencing/durable-file.js';
import {
  AuthorityFlipCoordinator,
  AuthorityFlipError,
  AUTHORITY_FLIP_COMMON_MODE,
  AUTHORITY_FLIP_EVENT_TYPE,
  AuthorityRegistry,
  checkManifestOrder,
  createAuthorityTransitionEventRegistry,
  evaluateCutoverPreflight,
  isValidAuthorityRecord,
  rollbackAssetSetDigest,
  selectAuthorityRoute,
} from '../../lib/per-mode-authority-flip/index.js';

import type {
  AuthoritySnapshot,
  PolicyEvaluationResult,
} from '../../lib/authorized-ledger/index.js';
import type { CutoverCertificate, CutoverCertificateEvidenceSources } from '../../lib/cutover-certificate/index.js';
import type {
  ClassificationEvidence,
  DispositionProof,
  InflightClassificationManifest,
  StateBackendCensus,
  StateBackendCensusRow,
} from '../../lib/inflight-state-classification/index.js';
import type { InflightMigrationHandoff, MigrationReceipt } from '../../lib/inflight-state-migration/index.js';
import type {
  AuthorityRecord,
  CutoverCertificateMode,
  CutoverPreflightInput,
  CutoverRequest,
} from '../../lib/per-mode-authority-flip/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. SHARED FIXTURES (mirrors tests/unit/cutover-certificate.vitest.ts
//    and tests/unit/inflight-state-migration.vitest.ts)
// ───────────────────────────────────────────────────────────────────

const TEST_DIRECTORY = dirname(fileURLToPath(import.meta.url));
const REPOSITORY_ROOT = resolve(TEST_DIRECTORY, '../../../../../..');
const CENSUS_BYTES = readFileSync(join(
  REPOSITORY_ROOT,
  '.opencode/specs/system-deep-loop/036-deep-loop-innovation',
  '003-baseline-taxonomy-and-state-census/state-backend-census.json',
));
const CENSUS = JSON.parse(CENSUS_BYTES.toString('utf8')) as StateBackendCensus;
const CANDIDATE_SHA = 'a'.repeat(40);
const AUTHORITY_EPOCH = 3;
const MODE: CutoverCertificateMode = 'deep-ai-council';

function digest(label: string): string {
  return createHash('sha256').update(label, 'utf8').digest('hex');
}

function proofFor(rowId: string, disposition: keyof typeof InflightDisposition): DispositionProof {
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
      return { kind: 'block', veto: 'execution-control-must-drain' };
  }
}

function evidenceFor(row: StateBackendCensusRow): ClassificationEvidence {
  const policy = FROZEN_CENSUS_ROW_POLICIES[row.id as keyof typeof FROZEN_CENSUS_ROW_POLICIES];
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

function buildManifest(): InflightClassificationManifest {
  return createClassificationManifest({
    classificationId: 'per-mode-authority-flip-fixture',
    classifiedAt: '2026-08-09T00:00:00Z',
    classifierBuildId: 'per-mode-authority-flip-tests',
    censusBytes: CENSUS_BYTES,
    evidence: CENSUS.rows.map(evidenceFor),
  }).manifest;
}

const CLASSIFICATION_MANIFEST = buildManifest();

function freshEvidenceFor(rowId: string): ClassificationEvidence {
  const row = CENSUS.rows.find((candidate) => candidate.id === rowId);
  if (!row) throw new Error(`census row not found: ${rowId}`);
  return evidenceFor(row);
}

/** Runs every manifest row to a terminal receipt (MIGRATE rows are forced BLOCK, matching the sibling fixture). */
async function runAllRowsToTerminal(root: string): Promise<Map<string, MigrationReceipt>> {
  const coordinator = new MigrationCoordinator({ rootDirectory: root });
  const receipts = new Map<string, MigrationReceipt>();
  for (const row of CLASSIFICATION_MANIFEST.rows) {
    const evidence = row.disposition === InflightDisposition.BLOCK
      || row.disposition === InflightDisposition.MIGRATE
      ? undefined
      : freshEvidenceFor(row.rowId);
    const { receipt } = await coordinator.runRow({ manifest: CLASSIFICATION_MANIFEST, row, currentEvidence: evidence });
    receipts.set(row.rowId, receipt);
  }
  return receipts;
}

async function buildHandoffFixture(root: string): Promise<InflightMigrationHandoff> {
  const receipts = await runAllRowsToTerminal(root);
  return buildInflightMigrationHandoff(CLASSIFICATION_MANIFEST, receipts);
}

function fixtureCertification() {
  return Object.freeze({
    scheme: 'hmac-sha256' as const,
    provider_id: 'per-mode-authority-flip-tests',
    key_id: 'k1',
    verifier_version: '1',
    trust_scope: 'process-local-advisory' as const,
    signed_digest: digest('signed'),
    signature_base64: Buffer.from('fixture-signature').toString('base64'),
  });
}

function fixturePolicy() {
  return new TransitionPolicyRegistry([{
    policyId: 'authority-flip-policy',
    policyVersion: 1,
    evaluatorVersion: '1',
    ruleIds: ['authority-flip-authorized'],
    evaluate: () => (
      { verdict: 'allow' as const, reasonCode: 'allowed' as const, matchedRuleIds: ['authority-flip-authorized'] }
    ),
  }]).resolve('authority-flip-policy', 1);
}

function fixtureCutoverCertificate(
  overrides: Readonly<Partial<CutoverCertificateEvidenceSources>> = {},
): CutoverCertificate {
  const policy = fixturePolicy();
  const result = buildCutoverCertificate({
    mode: MODE,
    candidateSha: CANDIDATE_SHA,
    fromAuthorityEpoch: AUTHORITY_EPOCH,
    issuer: 'per-mode-authority-flip-tests',
    issuedAt: '2026-08-09T00:05:00Z',
    evidence: {
      modeGateCertificate: {
        mode: MODE,
        candidateSha: CANDIDATE_SHA,
        authorityEpoch: AUTHORITY_EPOCH,
        readiness: 'ready-for-phase-014-consideration',
        certificateDigest: digest('mode-gate-certificate'),
      },
      shadowParity: {
        mode: MODE,
        candidateSha: CANDIDATE_SHA,
        exitStatus: 'green',
        evidenceDigest: digest('shadow-parity-evidence'),
      },
      rollbackDrillCertificate: {
        facts: {
          mode: MODE,
          candidateSha: CANDIDATE_SHA,
          passed: true,
          classificationDigest: CLASSIFICATION_MANIFEST.finalDigest,
        },
        certification: fixtureCertification(),
        certificateDigest: digest('rollback-drill-certificate'),
      } as never,
      mixedVersionReplay: Object.freeze({
        ok: true,
        caseId: 'mixed-version-case-1',
        capsuleDigest: digest('mixed-version-capsule'),
        evidenceDigest: digest('mixed-version-evidence'),
        deterministicRuns: 2,
        parityEligible: true,
        certificateEligible: true,
        authorityState: 'legacy_authoritative',
        authorityMutation: false,
      }) as never,
      classificationManifest: CLASSIFICATION_MANIFEST,
      migrationReceipts: [{
        receipt_id: 'receipt-one',
        boundary_id: 'boundary-one',
        boundary_kind: 'phase-handoff',
        scope: 'phase',
        scope_id: 'phase-014',
        from_state: 'cutover_ready',
        to_state: 'new_authoritative_reversible',
        from_head: { ledger_id: 'domain', sequence: 1, record_hash: digest('one:from') },
        result_head: { ledger_id: 'domain', sequence: 2, record_hash: digest('one:result') },
        result_event_id: 'event-one',
        result_event_type: 'deep-loop-cutover.ledger.certificate-issued',
        result_event_digest: digest('one:event'),
        result_code: 'ok',
        evidence_digest: digest('one:evidence'),
        artifact_digests: [],
        replay_fingerprint: digest('one:replay'),
        authority_epoch: AUTHORITY_EPOCH,
        correlation_id: 'correlation-one',
        causation_id: 'causation-one',
        issuer: 'per-mode-authority-flip-tests',
        issued_at: '2026-08-09T00:00:00Z',
        idempotency_key: 'idempotency-one',
        certification: fixtureCertification(),
      }] as never,
      approvingPolicy: policy,
      ...overrides,
    },
  });
  if (result.verdict !== 'issued') throw new Error(`fixture cutover certificate failed to issue: ${result.reasonCode}`);
  return result.certificate;
}

function fixturePreflightInput(
  overrides: Readonly<Partial<CutoverPreflightInput>> = {},
  handoff: InflightMigrationHandoff,
): CutoverPreflightInput {
  const certificate = fixtureCutoverCertificate();
  return {
    mode: MODE,
    expectedAuthorityEpoch: AUTHORITY_EPOCH,
    alreadyFlippedModes: new Set(),
    cutover: {
      certificate,
      expectation: {
        mode: MODE,
        candidateSha: CANDIDATE_SHA,
        fromAuthorityEpoch: AUTHORITY_EPOCH,
        policyId: certificate.facts.evidence.approvingPolicyId,
        policyVersion: certificate.facts.evidence.approvingPolicyVersion,
        policyDigest: certificate.facts.evidence.approvingPolicyDigest,
      },
    },
    migration: {
      handoff,
      classificationManifest: CLASSIFICATION_MANIFEST,
    },
    rollbackAssetDigests: [digest('rollback-anchor-one'), digest('rollback-anchor-two')],
    ...overrides,
  };
}

/** Writes an authority record file with the exact schema/digest the registry itself would produce. */
function seedAuthorityRecord(root: string, record: Omit<AuthorityRecord, 'recordDigest'>): AuthorityRecord {
  const full: AuthorityRecord = Object.freeze({
    ...record,
    recordDigest: sha256Bytes(canonicalBytes(record as never)),
  });
  writeCanonicalJsonAtomic(join(root, `authority-${record.mode}.json`), full as never);
  return full;
}

function cutoverReadyRecord(mode: CutoverCertificateMode, epoch: number): Omit<AuthorityRecord, 'recordDigest'> {
  return {
    schemaVersion: 1,
    mode,
    state: 'cutover_ready',
    epoch,
    selectedWriter: 'legacy',
    candidateSha: null,
    policyVersion: 0,
    cutoverCertificateDigest: null,
    lastTransitionDigest: null,
    updatedAt: '2026-08-09T00:00:00Z',
  };
}

// ───────────────────────────────────────────────────────────────────
// 2. SELECTOR
// ───────────────────────────────────────────────────────────────────

describe('selectAuthorityRoute', () => {
  function validRecord(overrides: Readonly<Partial<AuthorityRecord>> = {}): AuthorityRecord {
    const core = {
      schemaVersion: 1 as const,
      mode: MODE,
      state: 'legacy_authoritative' as const,
      epoch: 1,
      selectedWriter: 'legacy' as const,
      candidateSha: null,
      policyVersion: 0,
      cutoverCertificateDigest: null,
      lastTransitionDigest: null,
      updatedAt: '2026-08-09T00:00:00Z',
      ...overrides,
    };
    return { ...core, recordDigest: sha256Bytes(canonicalBytes(core as never)) };
  }

  it('routes legacy_authoritative to legacy with no shadow route', () => {
    const result = selectAuthorityRoute(validRecord(), { mode: MODE });
    expect(result).toEqual({
      outcome: 'selected', route: 'legacy', shadowRoute: null, state: 'legacy_authoritative', epoch: 1, admissionOpen: true,
    });
  });

  it('routes cutover_ready to legacy while shadowing dark for observation', () => {
    const result = selectAuthorityRoute(validRecord({ state: 'cutover_ready' }), { mode: MODE });
    expect(result).toEqual({
      outcome: 'selected', route: 'legacy', shadowRoute: 'dark', state: 'cutover_ready', epoch: 1, admissionOpen: true,
    });
  });

  it('routes new_authoritative_reversible to dark while legacy stays observable', () => {
    const result = selectAuthorityRoute(
      validRecord({ state: 'new_authoritative_reversible', epoch: 2, selectedWriter: 'dark' }),
      { mode: MODE },
    );
    expect(result).toEqual({
      outcome: 'selected', route: 'dark', shadowRoute: 'legacy', state: 'new_authoritative_reversible', epoch: 2, admissionOpen: true,
    });
  });

  it('routes new_authoritative_final to dark with no shadow route', () => {
    const result = selectAuthorityRoute(
      validRecord({ state: 'new_authoritative_final', epoch: 3, selectedWriter: 'dark' }),
      { mode: MODE },
    );
    expect(result.outcome).toBe('selected');
    if (result.outcome !== 'selected') throw new Error('expected selected');
    expect(result.route).toBe('dark');
    expect(result.shadowRoute).toBeNull();
  });

  it('denies admission during rollback_pending rather than exposing either writer', () => {
    const result = selectAuthorityRoute(validRecord({ state: 'rollback_pending' }), { mode: MODE });
    expect(result).toEqual({ outcome: 'denied', reasonCode: 'ACTIVE_TRANSACTION_CONFLICT' });
  });

  it('denies a missing record', () => {
    expect(selectAuthorityRoute(undefined, { mode: MODE })).toEqual({ outcome: 'denied', reasonCode: 'RECORD_MALFORMED' });
  });

  it('denies a record whose digest was tampered', () => {
    const record = { ...validRecord(), recordDigest: digest('tampered') };
    expect(selectAuthorityRoute(record, { mode: MODE })).toEqual({ outcome: 'denied', reasonCode: 'RECORD_MALFORMED' });
  });

  it('denies an unknown authority state', () => {
    const record = { ...validRecord(), state: 'not-a-real-state' };
    const tampered = { ...record, recordDigest: sha256Bytes(canonicalBytes(record as never)) };
    expect(selectAuthorityRoute(tampered, { mode: MODE })).toEqual({ outcome: 'denied', reasonCode: 'RECORD_MALFORMED' });
  });

  it('denies a record bound to a different mode than expected', () => {
    const result = selectAuthorityRoute(validRecord(), { mode: 'deep-research' });
    expect(result).toEqual({ outcome: 'denied', reasonCode: 'WRONG_MODE_BINDING' });
  });

  it('denies a policy-version mismatch (policy drift)', () => {
    const result = selectAuthorityRoute(validRecord({ policyVersion: 2 }), { mode: MODE, policyVersion: 1 });
    expect(result).toEqual({ outcome: 'denied', reasonCode: 'POLICY_MISMATCH' });
  });

  it('denies a caller-supplied expected record digest that no longer matches (stale cache)', () => {
    const result = selectAuthorityRoute(validRecord(), { mode: MODE, expectedRecordDigest: digest('stale-cache') });
    expect(result).toEqual({ outcome: 'denied', reasonCode: 'RECORD_DIGEST_MISMATCH' });
  });

  it('accepts a matching caller-supplied expected record digest', () => {
    const record = validRecord();
    const result = selectAuthorityRoute(record, { mode: MODE, expectedRecordDigest: record.recordDigest });
    expect(result.outcome).toBe('selected');
  });
});

describe('isValidAuthorityRecord', () => {
  it('rejects a non-object value', () => {
    expect(isValidAuthorityRecord(null)).toBe(false);
    expect(isValidAuthorityRecord('not-a-record')).toBe(false);
  });
});

// ───────────────────────────────────────────────────────────────────
// 3. MANIFEST ORDER
// ───────────────────────────────────────────────────────────────────

describe('checkManifestOrder', () => {
  it('rejects a batch request naming more than one mode', () => {
    expect(checkManifestOrder(['deep-research', 'deep-review'], new Set())).toEqual({
      verdict: 'denied', reasonCode: 'MULTI_MODE_REQUEST_REJECTED',
    });
  });

  it('rejects an unknown mode identity', () => {
    expect(checkManifestOrder(['not-a-real-mode'], new Set())).toEqual({
      verdict: 'denied', reasonCode: 'UNKNOWN_MODE',
    });
  });

  it('rejects a benchmark variant before deep-improvement-common has flipped', () => {
    expect(checkManifestOrder(['model-benchmark'], new Set())).toEqual({
      verdict: 'denied', reasonCode: 'MODE_ORDER_VIOLATION',
    });
  });

  it('allows deep-improvement-common to flip first', () => {
    expect(checkManifestOrder([AUTHORITY_FLIP_COMMON_MODE], new Set())).toEqual({ verdict: 'ok' });
  });

  it('allows a benchmark variant once deep-improvement-common has already flipped', () => {
    expect(checkManifestOrder(['model-benchmark'], new Set([AUTHORITY_FLIP_COMMON_MODE]))).toEqual({ verdict: 'ok' });
  });

  it('allows the first manifest mode independent of any other mode state', () => {
    expect(checkManifestOrder(['deep-research'], new Set())).toEqual({ verdict: 'ok' });
  });
});

// ───────────────────────────────────────────────────────────────────
// 4. AUTHORITY REGISTRY
// ───────────────────────────────────────────────────────────────────

describe('AuthorityRegistry', () => {
  const temporaryRoots: string[] = [];
  afterEach(() => {
    while (temporaryRoots.length > 0) {
      const root = temporaryRoots.pop();
      if (root) rmSync(root, { recursive: true, force: true });
    }
  });
  function temporaryRoot(label: string): string {
    const root = mkdtempSync(join(tmpdir(), `authority-registry-${label}-`));
    temporaryRoots.push(root);
    return root;
  }

  it('reads legacy_authoritative at epoch 1 as the default for a mode never written', () => {
    const registry = new AuthorityRegistry(temporaryRoot('default'));
    const record = registry.read('deep-research');
    expect(record.state).toBe('legacy_authoritative');
    expect(record.epoch).toBe(1);
    expect(record.selectedWriter).toBe('legacy');
    expect(isValidAuthorityRecord(record)).toBe(true);
  });

  it('flips cutover_ready to new_authoritative_reversible with a monotonic epoch increment', () => {
    const root = temporaryRoot('cas-success');
    seedAuthorityRecord(root, cutoverReadyRecord('deep-research', 5));
    const registry = new AuthorityRegistry(root);
    const outcome = registry.compareAndSwap({
      mode: 'deep-research',
      expectedState: 'cutover_ready',
      expectedEpoch: 5,
      nextSelectedWriter: 'dark',
      candidateSha: CANDIDATE_SHA,
      policyVersion: 1,
      cutoverCertificateDigest: digest('certificate'),
      lastTransitionDigest: digest('transition'),
      at: '2026-08-09T00:10:00Z',
    });
    expect(outcome.resumed).toBe(false);
    expect(outcome.record.state).toBe('new_authoritative_reversible');
    expect(outcome.record.epoch).toBe(6);
    expect(registry.read('deep-research').epoch).toBe(6);
  });

  it('rejects a stale/wrong epoch CAS and leaves the record unchanged', () => {
    const root = temporaryRoot('cas-stale-epoch');
    seedAuthorityRecord(root, cutoverReadyRecord('deep-research', 5));
    const registry = new AuthorityRegistry(root);
    expect(() => registry.compareAndSwap({
      mode: 'deep-research',
      expectedState: 'cutover_ready',
      expectedEpoch: 4,
      nextSelectedWriter: 'dark',
      candidateSha: CANDIDATE_SHA,
      policyVersion: 1,
      cutoverCertificateDigest: digest('certificate'),
      lastTransitionDigest: digest('transition'),
      at: '2026-08-09T00:10:00Z',
    })).toThrow(AuthorityFlipError);
    const record = registry.read('deep-research');
    expect(record.state).toBe('cutover_ready');
    expect(record.epoch).toBe(5);
  });

  it('rejects a CAS whose expected state does not match the current record', () => {
    const root = temporaryRoot('cas-wrong-state');
    // Default record is legacy_authoritative@1, not cutover_ready.
    const registry = new AuthorityRegistry(root);
    expect(() => registry.compareAndSwap({
      mode: 'deep-research',
      expectedState: 'cutover_ready',
      expectedEpoch: 1,
      nextSelectedWriter: 'dark',
      candidateSha: CANDIDATE_SHA,
      policyVersion: 1,
      cutoverCertificateDigest: digest('certificate'),
      lastTransitionDigest: digest('transition'),
      at: '2026-08-09T00:10:00Z',
    })).toThrow(AuthorityFlipError);
    expect(registry.read('deep-research').state).toBe('legacy_authoritative');
  });

  it('resumes idempotently when the record already reflects the exact target transition', () => {
    const root = temporaryRoot('cas-resume');
    seedAuthorityRecord(root, cutoverReadyRecord('deep-research', 5));
    const registry = new AuthorityRegistry(root);
    const first = registry.compareAndSwap({
      mode: 'deep-research',
      expectedState: 'cutover_ready',
      expectedEpoch: 5,
      nextSelectedWriter: 'dark',
      candidateSha: CANDIDATE_SHA,
      policyVersion: 1,
      cutoverCertificateDigest: digest('certificate'),
      lastTransitionDigest: digest('transition'),
      at: '2026-08-09T00:10:00Z',
    });
    expect(first.resumed).toBe(false);

    // A second CAS call with the same expected pre-state fails the literal
    // precondition (the record already moved), but because it already
    // reflects the exact same target and transition digest, this is the
    // resume path rather than a genuine conflict.
    const second = registry.compareAndSwap({
      mode: 'deep-research',
      expectedState: 'cutover_ready',
      expectedEpoch: 5,
      nextSelectedWriter: 'dark',
      candidateSha: CANDIDATE_SHA,
      policyVersion: 1,
      cutoverCertificateDigest: digest('certificate'),
      lastTransitionDigest: digest('transition'),
      at: '2026-08-09T00:20:00Z',
    });
    expect(second.resumed).toBe(true);
    expect(second.record.epoch).toBe(6);
    expect(second.record.updatedAt).toBe(first.record.updatedAt);
  });

  it('rejects a tampered on-disk record rather than trusting stored bytes', () => {
    const root = temporaryRoot('tampered');
    const record = cutoverReadyRecord('deep-research', 5);
    writeCanonicalJsonAtomic(
      join(root, 'authority-deep-research.json'),
      { ...record, recordDigest: digest('forged') } as never,
    );
    const registry = new AuthorityRegistry(root);
    expect(() => registry.read('deep-research')).toThrow(AuthorityFlipError);
  });

  it('serializes transactions through the transaction lock', async () => {
    const registry = new AuthorityRegistry(temporaryRoot('transaction-lock'));
    const started: string[] = [];
    const first = registry.withTransactionLock(async () => {
      started.push('first');
      await new Promise((resolveWait) => setTimeout(resolveWait, 10));
      return 'first-done';
    });
    await expect(registry.withTransactionLock(async () => 'second-done')).rejects.toThrow(AuthorityFlipError);
    expect(await first).toBe('first-done');
    expect(started).toEqual(['first']);
  });
});

// ───────────────────────────────────────────────────────────────────
// 5. PREFLIGHT
// ───────────────────────────────────────────────────────────────────

describe('evaluateCutoverPreflight', () => {
  const temporaryRoots: string[] = [];
  afterEach(() => {
    while (temporaryRoots.length > 0) {
      const root = temporaryRoots.pop();
      if (root) rmSync(root, { recursive: true, force: true });
    }
  });
  function temporaryRoot(label: string): string {
    const root = mkdtempSync(join(tmpdir(), `authority-flip-preflight-${label}-`));
    temporaryRoots.push(root);
    return root;
  }

  it('passes with a valid certificate, bound migration handoff, and clean rollback assets', async () => {
    const handoff = await buildHandoffFixture(temporaryRoot('ready'));
    const input = fixturePreflightInput({}, handoff);
    const result = evaluateCutoverPreflight(input);
    expect(result.verdict).toBe('ready');
    if (result.verdict !== 'ready') throw new Error('expected ready');
    expect(result.classificationManifestDigest).toBe(CLASSIFICATION_MANIFEST.finalDigest);
  });

  it('blocks on a cutover certificate whose digest was tampered', async () => {
    const handoff = await buildHandoffFixture(temporaryRoot('tampered-certificate'));
    const certificate = fixtureCutoverCertificate();
    const tampered = { ...certificate, certificateDigest: digest('tampered') };
    const input = fixturePreflightInput({
      cutover: {
        certificate: tampered,
        expectation: {
          mode: MODE,
          candidateSha: CANDIDATE_SHA,
          fromAuthorityEpoch: AUTHORITY_EPOCH,
          policyId: certificate.facts.evidence.approvingPolicyId,
          policyVersion: certificate.facts.evidence.approvingPolicyVersion,
          policyDigest: certificate.facts.evidence.approvingPolicyDigest,
        },
      },
    }, handoff);
    expect(evaluateCutoverPreflight(input)).toEqual({ verdict: 'blocked', reasonCode: 'CUTOVER_CERTIFICATE_INVALID' });
  });

  it('blocks a certificate bound to a different mode than requested', async () => {
    const handoff = await buildHandoffFixture(temporaryRoot('wrong-mode'));
    const input = fixturePreflightInput({ mode: 'deep-research' }, handoff);
    const result = evaluateCutoverPreflight(input);
    expect(result).toEqual({ verdict: 'blocked', reasonCode: 'WRONG_MODE_BINDING' });
  });

  it('blocks a stale expected authority epoch', async () => {
    const handoff = await buildHandoffFixture(temporaryRoot('stale-epoch'));
    const input = fixturePreflightInput({ expectedAuthorityEpoch: AUTHORITY_EPOCH + 1 }, handoff);
    expect(evaluateCutoverPreflight(input)).toEqual({ verdict: 'blocked', reasonCode: 'STALE_AUTHORITY_EPOCH' });
  });

  it('blocks a migration handoff bound to a different classification manifest', async () => {
    const handoff = await buildHandoffFixture(temporaryRoot('unbound-handoff'));
    const otherManifest = { ...CLASSIFICATION_MANIFEST, finalDigest: digest('a-different-manifest') };
    const input = fixturePreflightInput({
      migration: { handoff, classificationManifest: otherManifest as never },
    }, handoff);
    expect(evaluateCutoverPreflight(input)).toEqual({ verdict: 'blocked', reasonCode: 'MIGRATION_HANDOFF_UNBOUND' });
  });

  it('blocks a tampered migration handoff digest', async () => {
    const handoff = await buildHandoffFixture(temporaryRoot('tampered-handoff'));
    const tampered = { ...handoff, finalDigest: digest('tampered-handoff-digest') };
    const input = fixturePreflightInput({ migration: { handoff: tampered, classificationManifest: CLASSIFICATION_MANIFEST } }, handoff);
    expect(evaluateCutoverPreflight(input)).toEqual({ verdict: 'blocked', reasonCode: 'MIGRATION_HANDOFF_INVALID' });
  });

  it('blocks an empty rollback-asset set', async () => {
    const handoff = await buildHandoffFixture(temporaryRoot('empty-rollback-assets'));
    const input = fixturePreflightInput({ rollbackAssetDigests: [] }, handoff);
    expect(evaluateCutoverPreflight(input)).toEqual({ verdict: 'blocked', reasonCode: 'ROLLBACK_ASSETS_INVALID' });
  });

  it('blocks duplicate rollback-asset digests', async () => {
    const handoff = await buildHandoffFixture(temporaryRoot('duplicate-rollback-assets'));
    const one = digest('rollback-anchor-one');
    const input = fixturePreflightInput({ rollbackAssetDigests: [one, one] }, handoff);
    expect(evaluateCutoverPreflight(input)).toEqual({ verdict: 'blocked', reasonCode: 'ROLLBACK_ASSETS_INVALID' });
  });

  it('blocks a benchmark variant requested before deep-improvement-common has flipped', async () => {
    // The manifest-order guard runs before any certificate/mode-binding
    // check, so a variant request denies on ordering regardless of which
    // mode the supplied fixture certificate itself was issued for.
    const handoff = await buildHandoffFixture(temporaryRoot('order-violation'));
    const input = fixturePreflightInput({ mode: 'model-benchmark' }, handoff);
    expect(evaluateCutoverPreflight(input)).toEqual({ verdict: 'blocked', reasonCode: 'MODE_ORDER_VIOLATION' });
  });

  it('allows a benchmark variant once deep-improvement-common already appears flipped', async () => {
    const handoff = await buildHandoffFixture(temporaryRoot('order-satisfied'));
    const variantCertificate = fixtureCutoverCertificateForMode('model-benchmark');
    const input = fixturePreflightInput({
      mode: 'model-benchmark',
      alreadyFlippedModes: new Set([AUTHORITY_FLIP_COMMON_MODE]),
      cutover: {
        certificate: variantCertificate,
        expectation: {
          mode: 'model-benchmark',
          candidateSha: CANDIDATE_SHA,
          fromAuthorityEpoch: AUTHORITY_EPOCH,
          policyId: variantCertificate.facts.evidence.approvingPolicyId,
          policyVersion: variantCertificate.facts.evidence.approvingPolicyVersion,
          policyDigest: variantCertificate.facts.evidence.approvingPolicyDigest,
        },
      },
    }, handoff);
    expect(evaluateCutoverPreflight(input).verdict).toBe('ready');
  });
});

function fixtureCutoverCertificateForMode(mode: CutoverCertificateMode): CutoverCertificate {
  const policy = fixturePolicy();
  const result = buildCutoverCertificate({
    mode,
    candidateSha: CANDIDATE_SHA,
    fromAuthorityEpoch: AUTHORITY_EPOCH,
    issuer: 'per-mode-authority-flip-tests',
    issuedAt: '2026-08-09T00:05:00Z',
    evidence: {
      modeGateCertificate: {
        mode,
        candidateSha: CANDIDATE_SHA,
        authorityEpoch: AUTHORITY_EPOCH,
        readiness: 'ready-for-phase-014-consideration',
        certificateDigest: digest('mode-gate-certificate'),
      },
      shadowParity: {
        mode,
        candidateSha: CANDIDATE_SHA,
        exitStatus: 'green',
        evidenceDigest: digest('shadow-parity-evidence'),
      },
      rollbackDrillCertificate: {
        facts: {
          mode,
          candidateSha: CANDIDATE_SHA,
          passed: true,
          classificationDigest: CLASSIFICATION_MANIFEST.finalDigest,
        },
        certification: fixtureCertification(),
        certificateDigest: digest('rollback-drill-certificate'),
      } as never,
      mixedVersionReplay: Object.freeze({
        ok: true,
        caseId: 'mixed-version-case-1',
        capsuleDigest: digest('mixed-version-capsule'),
        evidenceDigest: digest('mixed-version-evidence'),
        deterministicRuns: 2,
        parityEligible: true,
        certificateEligible: true,
        authorityState: 'legacy_authoritative',
        authorityMutation: false,
      }) as never,
      classificationManifest: CLASSIFICATION_MANIFEST,
      migrationReceipts: [{
        receipt_id: 'receipt-one',
        boundary_id: 'boundary-one',
        boundary_kind: 'phase-handoff',
        scope: 'phase',
        scope_id: 'phase-014',
        from_state: 'cutover_ready',
        to_state: 'new_authoritative_reversible',
        from_head: { ledger_id: 'domain', sequence: 1, record_hash: digest('one:from') },
        result_head: { ledger_id: 'domain', sequence: 2, record_hash: digest('one:result') },
        result_event_id: 'event-one',
        result_event_type: 'deep-loop-cutover.ledger.certificate-issued',
        result_event_digest: digest('one:event'),
        result_code: 'ok',
        evidence_digest: digest('one:evidence'),
        artifact_digests: [],
        replay_fingerprint: digest('one:replay'),
        authority_epoch: AUTHORITY_EPOCH,
        correlation_id: 'correlation-one',
        causation_id: 'causation-one',
        issuer: 'per-mode-authority-flip-tests',
        issued_at: '2026-08-09T00:00:00Z',
        idempotency_key: 'idempotency-one',
        certification: fixtureCertification(),
      }] as never,
      approvingPolicy: policy,
    },
  });
  if (result.verdict !== 'issued') throw new Error(`fixture cutover certificate failed to issue: ${result.reasonCode}`);
  return result.certificate;
}

describe('rollbackAssetSetDigest', () => {
  it('is order-independent (a deterministic set digest)', () => {
    const a = digest('a');
    const b = digest('b');
    expect(rollbackAssetSetDigest([a, b])).toBe(rollbackAssetSetDigest([b, a]));
  });
});

// ───────────────────────────────────────────────────────────────────
// 6. COORDINATOR — ATOMIC FLIP
// ───────────────────────────────────────────────────────────────────

describe('AuthorityFlipCoordinator', () => {
  const temporaryRoots: string[] = [];
  afterEach(() => {
    while (temporaryRoots.length > 0) {
      const root = temporaryRoots.pop();
      if (root) rmSync(root, { recursive: true, force: true });
    }
  });
  function temporaryRoot(label: string): string {
    const root = mkdtempSync(join(tmpdir(), `authority-flip-coordinator-${label}-`));
    temporaryRoots.push(root);
    return root;
  }

  async function buildLedgerAndGateway(root: string, authorityEpoch: number) {
    const authority: AuthoritySnapshot = { state: 'cutover_ready', epoch: authorityEpoch };
    const eventRegistry = createAuthorityTransitionEventRegistry();
    const policies = new TransitionPolicyRegistry([{
      policyId: 'authority-flip-append-policy',
      policyVersion: 1,
      evaluatorVersion: '1',
      ruleIds: ['always-allow'],
      evaluate: (): PolicyEvaluationResult => (
        { verdict: 'allow', reasonCode: 'allowed', matchedRuleIds: ['always-allow'] }
      ),
    }]);
    const ledger = new AppendOnlyLedger({
      rootDirectory: root,
      ledgerId: 'authority-flip-domain',
      auditLedgerId: 'authority-flip-audit',
      authorityProvider: () => authority,
    }, eventRegistry);
    const gateway = new TransitionAuthorizationGateway({
      rootDirectory: root,
      auditLedgerId: 'authority-flip-audit',
      authorityProvider: () => authority,
    }, ledger, policies);
    const policy = policies.resolve('authority-flip-append-policy', 1);
    return { ledger, gateway, policy };
  }

  function buildRequest(
    policy: Readonly<{ policyId: string; policyVersion: number; digest: string }>,
    preflight: CutoverPreflightInput,
  ): CutoverRequest {
    return {
      requestedModes: [MODE],
      preflight,
      requestId: 'authority-flip-request-1',
      actorId: 'per-mode-authority-flip-tests',
      capabilityId: 'write',
      policyId: policy.policyId,
      policyVersion: policy.policyVersion,
      policyDigest: policy.digest,
      streamId: `${MODE}-authority-flip`,
      correlationId: 'authority-flip-correlation-1',
      decidedAt: '2026-08-09T00:15:00Z',
    };
  }

  it('flips one mode atomically: one ledger event, one epoch increment, dark canonical route', async () => {
    const root = temporaryRoot('flip');
    const handoff = await buildHandoffFixture(join(root, 'migration'));
    const preflight = fixturePreflightInput({}, handoff);
    seedAuthorityRecord(join(root, 'authority-registry'), cutoverReadyRecord(MODE, AUTHORITY_EPOCH));
    const registry = new AuthorityRegistry(join(root, 'authority-registry'));
    const { ledger, gateway, policy } = await buildLedgerAndGateway(join(root, 'ledger'), AUTHORITY_EPOCH);
    const coordinator = new AuthorityFlipCoordinator({ registry, ledger, gateway });

    const decision = await coordinator.requestCutover(buildRequest(policy, preflight));
    expect(decision.disposition).toBe('flipped');
    if (decision.disposition !== 'flipped') throw new Error('expected flipped');
    expect(decision.record.state).toBe('new_authoritative_reversible');
    expect(decision.record.epoch).toBe(AUTHORITY_EPOCH + 1);
    expect(decision.resumed).toBe(false);

    const events = await ledger.readVerifiedEvents();
    const flipEvents = events.filter((entry) => entry.event.effective.envelope.event_type === AUTHORITY_FLIP_EVENT_TYPE);
    expect(flipEvents).toHaveLength(1);
    expect(registry.read(MODE).state).toBe('new_authoritative_reversible');

    const selected = selectAuthorityRoute(registry.read(MODE), { mode: MODE });
    expect(selected).toMatchObject({ outcome: 'selected', route: 'dark' });
  });

  it('rejects a stale/wrong expected epoch with zero side effects', async () => {
    const root = temporaryRoot('stale-epoch');
    const handoff = await buildHandoffFixture(join(root, 'migration'));
    const preflight = fixturePreflightInput({ expectedAuthorityEpoch: AUTHORITY_EPOCH }, handoff);
    seedAuthorityRecord(join(root, 'authority-registry'), cutoverReadyRecord(MODE, AUTHORITY_EPOCH + 1));
    const registry = new AuthorityRegistry(join(root, 'authority-registry'));
    const { ledger, gateway, policy } = await buildLedgerAndGateway(join(root, 'ledger'), AUTHORITY_EPOCH);
    const coordinator = new AuthorityFlipCoordinator({ registry, ledger, gateway });

    const decision = await coordinator.requestCutover(buildRequest(policy, preflight));
    expect(decision).toEqual({ disposition: 'denied', reasonCode: 'STALE_AUTHORITY_EPOCH' });
    expect(await ledger.readVerifiedEvents()).toHaveLength(0);
    expect(registry.read(MODE).state).toBe('cutover_ready');
    expect(registry.read(MODE).epoch).toBe(AUTHORITY_EPOCH + 1);
  });

  it('requires a valid cutover certificate: a tampered certificate denies with zero side effects', async () => {
    const root = temporaryRoot('invalid-certificate');
    const handoff = await buildHandoffFixture(join(root, 'migration'));
    const certificate = fixtureCutoverCertificate();
    const tampered = { ...certificate, certificateDigest: digest('tampered') };
    const preflight = fixturePreflightInput({
      cutover: {
        certificate: tampered,
        expectation: {
          mode: MODE,
          candidateSha: CANDIDATE_SHA,
          fromAuthorityEpoch: AUTHORITY_EPOCH,
          policyId: certificate.facts.evidence.approvingPolicyId,
          policyVersion: certificate.facts.evidence.approvingPolicyVersion,
          policyDigest: certificate.facts.evidence.approvingPolicyDigest,
        },
      },
    }, handoff);
    seedAuthorityRecord(join(root, 'authority-registry'), cutoverReadyRecord(MODE, AUTHORITY_EPOCH));
    const registry = new AuthorityRegistry(join(root, 'authority-registry'));
    const { ledger, gateway, policy } = await buildLedgerAndGateway(join(root, 'ledger'), AUTHORITY_EPOCH);
    const coordinator = new AuthorityFlipCoordinator({ registry, ledger, gateway });

    const decision = await coordinator.requestCutover(buildRequest(policy, preflight));
    expect(decision).toEqual({ disposition: 'denied', reasonCode: 'CUTOVER_CERTIFICATE_INVALID' });
    expect(await ledger.readVerifiedEvents()).toHaveLength(0);
    expect(registry.read(MODE).state).toBe('cutover_ready');
  });

  it('rejects a batch request naming more than one mode before touching the registry', async () => {
    const root = temporaryRoot('multi-mode');
    const handoff = await buildHandoffFixture(join(root, 'migration'));
    const preflight = fixturePreflightInput({}, handoff);
    seedAuthorityRecord(join(root, 'authority-registry'), cutoverReadyRecord(MODE, AUTHORITY_EPOCH));
    const registry = new AuthorityRegistry(join(root, 'authority-registry'));
    const { ledger, gateway, policy } = await buildLedgerAndGateway(join(root, 'ledger'), AUTHORITY_EPOCH);
    const coordinator = new AuthorityFlipCoordinator({ registry, ledger, gateway });

    const request = buildRequest(policy, preflight);
    const decision = await coordinator.requestCutover({ ...request, requestedModes: [MODE, 'deep-research'] });
    expect(decision).toEqual({ disposition: 'denied', reasonCode: 'MULTI_MODE_REQUEST_REJECTED' });
    expect(registry.read(MODE).state).toBe('cutover_ready');
  });

  it('resumes safely after a crash between the ledger append and the registry publish, with no duplicate ledger event', async () => {
    const root = temporaryRoot('crash-resume');
    const handoff = await buildHandoffFixture(join(root, 'migration'));
    const preflight = fixturePreflightInput({}, handoff);
    seedAuthorityRecord(join(root, 'authority-registry'), cutoverReadyRecord(MODE, AUTHORITY_EPOCH));
    const registry = new AuthorityRegistry(join(root, 'authority-registry'));
    const { ledger, gateway, policy } = await buildLedgerAndGateway(join(root, 'ledger'), AUTHORITY_EPOCH);

    const crashing = new AuthorityFlipCoordinator({
      registry,
      ledger,
      gateway,
      faultInjection: {
        afterLedgerAppendBeforeCas: () => {
          throw new Error('simulated process crash');
        },
      },
    });
    const request = buildRequest(policy, preflight);
    await expect(crashing.requestCutover(request)).rejects.toThrow('simulated process crash');
    expect(await ledger.readVerifiedEvents()).toHaveLength(1);
    expect(registry.read(MODE).state).toBe('cutover_ready');

    const resumed = new AuthorityFlipCoordinator({ registry, ledger, gateway });
    const decision = await resumed.requestCutover(request);
    expect(decision.disposition).toBe('flipped');
    if (decision.disposition !== 'flipped') throw new Error('expected flipped');
    expect(decision.record.state).toBe('new_authoritative_reversible');
    expect(decision.record.epoch).toBe(AUTHORITY_EPOCH + 1);
    expect(await ledger.readVerifiedEvents()).toHaveLength(1);
  });
});
