// ───────────────────────────────────────────────────────────────────
// MODULE: Per-Mode Authority Flip Tests
// ───────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
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
  buildMigrationEnvelope,
  MigrationCoordinator,
  MigrationOperationStatuses,
} from '../../lib/inflight-state-migration/index.js';
import { writeCanonicalJsonAtomic } from '../../lib/locks-and-fencing/durable-file.js';
import {
  AuthorityFlipCoordinator,
  AuthorityFlipError,
  AUTHORITY_FLIP_COMMON_MODE,
  AUTHORITY_FLIP_EVENT_TYPE,
  AUTHORITY_FLIP_MODE_ORDER,
  AuthorityRegistry,
  checkManifestOrder,
  createAuthorityTransitionEventRegistry,
  deriveFlippedModes,
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
// The first manifest-order mode: every other mode requires its predecessors
// to already show a durable dark-authoritative state, so using the
// order-independent first entry keeps most fixtures in this file free of
// unrelated predecessor-seeding boilerplate; order-specific tests seed the
// registry or supply an explicit non-default mode where the ordering rule
// itself is under test.
const MODE: CutoverCertificateMode = 'deep-research';

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

/**
 * A MIGRATE-disposition row genuinely committing requires a real ledger
 * checkpoint import (see the MIGRATE ledger-checkpoint coverage in the
 * sibling migration test file); that machinery is out of scope for this
 * fixture, so this hand-builds an internally valid COMMITTED receipt for
 * each MIGRATE row directly, bypassing the coordinator the same way
 * `seedAuthorityRecord` bypasses the registry class. The receipt still
 * passes every structural/digest check `verifyMigrationReceipt` performs.
 */
function committedMigrateReceipt(rowId: string, now: string): MigrationReceipt {
  const row = CLASSIFICATION_MANIFEST.rows.find((candidate) => candidate.rowId === rowId);
  if (!row) throw new Error(`manifest row not found: ${rowId}`);
  const evidence = freshEvidenceFor(rowId);
  const envelope = buildMigrationEnvelope(CLASSIFICATION_MANIFEST, row, InflightDisposition.MIGRATE, evidence);
  const outcome = Object.freeze({
    kind: 'migrate' as const,
    checkpointDigest: digest(`${rowId}:clean-checkpoint`),
    restorationReceiptDigest: digest(`${rowId}:clean-restoration`),
    ledgerEventId: `clean-migrate-${rowId}`,
    ledgerAppendReceiptDigest: digest(`${rowId}:clean-ledger-receipt`),
  });
  const core = Object.freeze({
    receiptVersion: 1 as const,
    envelope,
    status: MigrationOperationStatuses.COMMITTED,
    fenceToken: 1,
    preIntegrityDigest: `sha256:${digest(`${rowId}:pre`)}`,
    postIntegrityDigest: `sha256:${digest(`${rowId}:post`)}`,
    outcome,
    reasonCode: null,
    attempt: 1,
    startedAt: now,
    committedAt: now,
  });
  return Object.freeze({ ...core, receiptDigest: sha256Bytes(canonicalBytes(core as never)) });
}

/**
 * Every non-BLOCK-disposition row reaches a genuine COMMITTED terminal
 * receipt; only rows the census permanently, policy-freezes to BLOCK
 * disposition (a lock/writer-ownership resource that can never be
 * migrated) remain BLOCKED. This is the "nothing illegitimately blocked"
 * handoff a real flip needs to reach `ready`.
 */
async function runAllRowsToTerminalClean(root: string): Promise<Map<string, MigrationReceipt>> {
  const coordinator = new MigrationCoordinator({ rootDirectory: root });
  const receipts = new Map<string, MigrationReceipt>();
  for (const row of CLASSIFICATION_MANIFEST.rows) {
    if (row.disposition === InflightDisposition.MIGRATE) {
      receipts.set(row.rowId, committedMigrateReceipt(row.rowId, '2026-08-09T00:00:00Z'));
      continue;
    }
    const evidence = row.disposition === InflightDisposition.BLOCK ? undefined : freshEvidenceFor(row.rowId);
    const { receipt } = await coordinator.runRow({ manifest: CLASSIFICATION_MANIFEST, row, currentEvidence: evidence });
    receipts.set(row.rowId, receipt);
  }
  return receipts;
}

async function buildCleanHandoffFixture(root: string): Promise<InflightMigrationHandoff> {
  const receipts = await runAllRowsToTerminalClean(root);
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
    const result = selectAuthorityRoute(validRecord(), { mode: 'deep-review' });
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

function predecessorsOf(mode: CutoverCertificateMode): ReadonlySet<CutoverCertificateMode> {
  return new Set(AUTHORITY_FLIP_MODE_ORDER.slice(0, AUTHORITY_FLIP_MODE_ORDER.indexOf(mode)));
}

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

  it('rejects deep-improvement-common flipping first: the full eight-mode prefix is required, not only "common before its variants"', () => {
    expect(checkManifestOrder([AUTHORITY_FLIP_COMMON_MODE], new Set())).toEqual({
      verdict: 'denied', reasonCode: 'MODE_ORDER_VIOLATION',
    });
  });

  it('allows deep-improvement-common once its full predecessor prefix has flipped', () => {
    expect(checkManifestOrder([AUTHORITY_FLIP_COMMON_MODE], predecessorsOf(AUTHORITY_FLIP_COMMON_MODE))).toEqual({
      verdict: 'ok',
    });
  });

  it('rejects a benchmark variant when only deep-improvement-common (not its own full prefix) has flipped', () => {
    expect(checkManifestOrder(['model-benchmark'], new Set([AUTHORITY_FLIP_COMMON_MODE]))).toEqual({
      verdict: 'denied', reasonCode: 'MODE_ORDER_VIOLATION',
    });
  });

  it('allows a benchmark variant once its full predecessor prefix has flipped', () => {
    expect(checkManifestOrder(['model-benchmark'], predecessorsOf('model-benchmark'))).toEqual({ verdict: 'ok' });
  });

  it('allows the first manifest mode independent of any other mode state', () => {
    expect(checkManifestOrder(['deep-research'], new Set())).toEqual({ verdict: 'ok' });
  });

  it('rejects the last manifest mode when only some, not all, of its seven predecessors have flipped', () => {
    const partial = new Set(AUTHORITY_FLIP_MODE_ORDER.slice(0, AUTHORITY_FLIP_MODE_ORDER.length - 2));
    expect(checkManifestOrder(['deep-alignment'], partial)).toEqual({
      verdict: 'denied', reasonCode: 'MODE_ORDER_VIOLATION',
    });
  });

  it('allows the last manifest mode once every one of its seven predecessors has flipped', () => {
    expect(checkManifestOrder(['deep-alignment'], predecessorsOf('deep-alignment'))).toEqual({ verdict: 'ok' });
  });
});

describe('deriveFlippedModes', () => {
  const temporaryRoots: string[] = [];
  afterEach(() => {
    while (temporaryRoots.length > 0) {
      const root = temporaryRoots.pop();
      if (root) rmSync(root, { recursive: true, force: true });
    }
  });
  function temporaryRoot(label: string): string {
    const root = mkdtempSync(join(tmpdir(), `derive-flipped-modes-${label}-`));
    temporaryRoots.push(root);
    return root;
  }

  it('reports no mode flipped for a freshly initialized registry', () => {
    const registry = new AuthorityRegistry(temporaryRoot('empty'));
    expect(deriveFlippedModes(registry)).toEqual(new Set());
  });

  it('derives flipped status purely from each mode\'s own durable state, ignoring any caller belief', () => {
    const root = temporaryRoot('mixed');
    seedAuthorityRecord(root, {
      schemaVersion: 1,
      mode: 'deep-research',
      state: 'new_authoritative_reversible',
      epoch: 2,
      selectedWriter: 'dark',
      candidateSha: CANDIDATE_SHA,
      policyVersion: 1,
      cutoverCertificateDigest: digest('certificate'),
      lastTransitionDigest: digest('transition'),
      updatedAt: '2026-08-09T00:00:00Z',
    });
    seedAuthorityRecord(root, {
      schemaVersion: 1,
      mode: 'deep-review',
      state: 'rollback_pending',
      epoch: 2,
      selectedWriter: 'dark',
      candidateSha: CANDIDATE_SHA,
      policyVersion: 1,
      cutoverCertificateDigest: digest('certificate'),
      lastTransitionDigest: digest('transition'),
      updatedAt: '2026-08-09T00:00:00Z',
    });
    const registry = new AuthorityRegistry(root);
    // deep-research is dark-authoritative (flipped); deep-review is mid
    // rollback (not flipped, and not admitting either writer); every other
    // mode is still the untouched legacy default (not flipped).
    expect(deriveFlippedModes(registry)).toEqual(new Set(['deep-research']));
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

  // ─────────────────────────────────────────────────────────────────
  // Reverse CAS: rollback actually restores durable authority
  // ─────────────────────────────────────────────────────────────────

  describe('compareAndSwapRollback', () => {
    it('admits a write at cutover_ready, flips forward, then rollback restores legacy at a new epoch and denies the stale dark epoch', () => {
      const root = temporaryRoot('rollback-restores');
      seedAuthorityRecord(root, cutoverReadyRecord('deep-research', 5));
      const registry = new AuthorityRegistry(root);

      // A canonical write is admitted at cutover_ready (legacy still routes).
      const preFlip = selectAuthorityRoute(registry.read('deep-research'), { mode: 'deep-research' });
      expect(preFlip).toMatchObject({ outcome: 'selected', route: 'legacy' });

      // Forward flip: legacy -> dark, epoch 5 -> 6.
      const flipped = registry.compareAndSwap({
        mode: 'deep-research',
        expectedState: 'cutover_ready',
        expectedEpoch: 5,
        nextSelectedWriter: 'dark',
        candidateSha: CANDIDATE_SHA,
        policyVersion: 1,
        cutoverCertificateDigest: digest('certificate'),
        lastTransitionDigest: digest('forward-transition'),
        at: '2026-08-09T00:10:00Z',
      });
      expect(flipped.record.state).toBe('new_authoritative_reversible');
      const darkDigest = flipped.record.recordDigest;
      const staleExpectation = { mode: 'deep-research' as const, expectedRecordDigest: darkDigest };

      // Rollback: dark -> legacy, epoch 6 -> 7, against the same registry.
      const rolledBack = registry.compareAndSwapRollback({
        mode: 'deep-research',
        expectedEpoch: 6,
        rollbackCertificateDigest: digest('rollback-certificate'),
        at: '2026-08-09T00:20:00Z',
      });
      expect(rolledBack.resumed).toBe(false);
      expect(rolledBack.record.state).toBe('legacy_authoritative');
      expect(rolledBack.record.epoch).toBe(7);
      expect(rolledBack.record.selectedWriter).toBe('legacy');

      // The selector reads legacy back at the new epoch from the same
      // durable registry the forward flip published to.
      const freshRecord = registry.read('deep-research');
      expect(freshRecord.epoch).toBe(7);
      const postRollback = selectAuthorityRoute(freshRecord, { mode: 'deep-research' });
      expect(postRollback).toMatchObject({ outcome: 'selected', route: 'legacy', epoch: 7 });

      // A caller still holding the pre-rollback dark-authoritative record
      // digest (a stale lease) is denied rather than silently admitted.
      const staleWrite = selectAuthorityRoute(freshRecord, staleExpectation);
      expect(staleWrite).toEqual({ outcome: 'denied', reasonCode: 'RECORD_DIGEST_MISMATCH' });
    });

    it('rejects a rollback whose expected epoch/state no longer matches the durable record', () => {
      const root = temporaryRoot('rollback-conflict');
      // Default record is legacy_authoritative@1, never flipped forward.
      const registry = new AuthorityRegistry(root);
      expect(() => registry.compareAndSwapRollback({
        mode: 'deep-research',
        expectedEpoch: 1,
        rollbackCertificateDigest: digest('rollback-certificate'),
        at: '2026-08-09T00:20:00Z',
      })).toThrow(AuthorityFlipError);
      expect(registry.read('deep-research').state).toBe('legacy_authoritative');
    });

    it('resumes from a crash-stranded rollback_pending and completes the second write deterministically', () => {
      const root = temporaryRoot('rollback-resume-pending');
      const registry = new AuthorityRegistry(root);
      // Simulate a hard death between the two rollback writes: the durable
      // record is stranded at rollback_pending, exactly what the first
      // write of `compareAndSwapRollback` would leave behind.
      seedAuthorityRecord(root, {
        schemaVersion: 1,
        mode: 'deep-research',
        state: 'rollback_pending',
        epoch: 6,
        selectedWriter: 'dark',
        candidateSha: CANDIDATE_SHA,
        policyVersion: 1,
        cutoverCertificateDigest: digest('certificate'),
        lastTransitionDigest: digest('rollback-certificate'),
        updatedAt: '2026-08-09T00:15:00Z',
      });

      // Admission stays fail-closed while stranded: neither writer is exposed.
      expect(selectAuthorityRoute(registry.read('deep-research'), { mode: 'deep-research' })).toEqual({
        outcome: 'denied', reasonCode: 'ACTIVE_TRANSACTION_CONFLICT',
      });

      const resumed = registry.compareAndSwapRollback({
        mode: 'deep-research',
        expectedEpoch: 6,
        rollbackCertificateDigest: digest('rollback-certificate'),
        at: '2026-08-09T00:25:00Z',
      });
      expect(resumed.resumed).toBe(true);
      expect(resumed.record.state).toBe('legacy_authoritative');
      expect(resumed.record.epoch).toBe(7);
      expect(selectAuthorityRoute(registry.read('deep-research'), { mode: 'deep-research' })).toMatchObject({
        outcome: 'selected', route: 'legacy',
      });
    });

    it('resumes idempotently when the rollback already fully completed', () => {
      const root = temporaryRoot('rollback-resume-final');
      const registry = new AuthorityRegistry(root);
      seedAuthorityRecord(root, {
        schemaVersion: 1,
        mode: 'deep-research',
        state: 'legacy_authoritative',
        epoch: 7,
        selectedWriter: 'legacy',
        candidateSha: CANDIDATE_SHA,
        policyVersion: 1,
        cutoverCertificateDigest: digest('certificate'),
        lastTransitionDigest: digest('rollback-certificate'),
        updatedAt: '2026-08-09T00:25:00Z',
      });
      const resumed = registry.compareAndSwapRollback({
        mode: 'deep-research',
        expectedEpoch: 6,
        rollbackCertificateDigest: digest('rollback-certificate'),
        at: '2026-08-09T00:30:00Z',
      });
      expect(resumed.resumed).toBe(true);
      expect(resumed.record.epoch).toBe(7);
      expect(resumed.record.updatedAt).toBe('2026-08-09T00:25:00Z');
    });
  });

  // ─────────────────────────────────────────────────────────────────
  // Stale-lock reclaim
  // ─────────────────────────────────────────────────────────────────

  describe('stale-lock reclaim', () => {
    function deadPid(): number {
      // A real, previously valid PID that has already exited — the most
      // portable way to obtain a guaranteed-dead PID for an ESRCH check.
      const child = spawnSync(process.execPath, ['-e', 'process.exit(0)']);
      const pid = child.pid;
      if (typeof pid !== 'number' || pid <= 0) throw new Error('failed to obtain a dead pid fixture');
      return pid;
    }

    it('reclaims a transaction lock left by a process that no longer exists', async () => {
      const root = temporaryRoot('stale-lock-dead-pid');
      const registry = new AuthorityRegistry(root);
      writeFileSync(
        join(root, 'authority-flip-transaction.lock'),
        JSON.stringify({ pid: deadPid(), acquiredAt: '2026-08-09T00:00:00Z' }),
      );
      const result = await registry.withTransactionLock(async () => 'reclaimed');
      expect(result).toBe('reclaimed');
    });

    it('reclaims a transaction lock older than the stale-lock TTL even if its owner pid is still alive', async () => {
      const root = temporaryRoot('stale-lock-ttl');
      const now = new Date('2026-08-09T01:00:00Z');
      // A 1ms TTL constructor makes any pre-existing lock file immediately stale.
      const registry = new AuthorityRegistry(root, () => now, 1);
      writeFileSync(
        join(root, 'authority-flip-transaction.lock'),
        JSON.stringify({ pid: process.pid, acquiredAt: '2026-08-09T00:00:00Z' }),
      );
      const result = await registry.withTransactionLock(async () => 'reclaimed');
      expect(result).toBe('reclaimed');
    });

    it('does not reclaim a live, non-stale transaction lock (no regression on the existing fail-fast conflict contract)', async () => {
      const root = temporaryRoot('stale-lock-live');
      const registry = new AuthorityRegistry(root);
      writeFileSync(
        join(root, 'authority-flip-transaction.lock'),
        JSON.stringify({ pid: process.pid, acquiredAt: new Date().toISOString() }),
      );
      await expect(registry.withTransactionLock(async () => 'should-not-run')).rejects.toThrow(AuthorityFlipError);
    });

    it('does not auto-reclaim a malformed lock file (fails loud rather than displacing an unknown holder)', async () => {
      const root = temporaryRoot('stale-lock-malformed');
      const registry = new AuthorityRegistry(root);
      writeFileSync(join(root, 'authority-flip-transaction.lock'), 'not-json');
      await expect(registry.withTransactionLock(async () => 'should-not-run')).rejects.toThrow(AuthorityFlipError);
    });

    it('reclaims a per-mode CAS lock left by a dead process, so a stranded forward flip is still completable', () => {
      const root = temporaryRoot('stale-lock-per-mode');
      seedAuthorityRecord(root, cutoverReadyRecord('deep-research', 5));
      const registry = new AuthorityRegistry(root);
      writeFileSync(
        join(root, 'authority-deep-research.lock'),
        JSON.stringify({ pid: deadPid(), acquiredAt: '2026-08-09T00:00:00Z' }),
      );
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
      expect(outcome.record.state).toBe('new_authoritative_reversible');
    });
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

  it('passes with a valid certificate, a genuinely clean migration handoff, and clean rollback assets', async () => {
    const handoff = await buildCleanHandoffFixture(temporaryRoot('ready'));
    const input = fixturePreflightInput({}, handoff);
    const result = evaluateCutoverPreflight(input);
    expect(result.verdict).toBe('ready');
    if (result.verdict !== 'ready') throw new Error('expected ready');
    expect(result.classificationManifestDigest).toBe(CLASSIFICATION_MANIFEST.finalDigest);
  });

  it('denies a handoff carrying rows that vetoed to BLOCKED instead of reaching their intended disposition, even with zero ABORTED rows: unresolved/blocked state denies the flip', async () => {
    const handoff = await buildHandoffFixture(temporaryRoot('illegitimately-blocked'));
    // Every MIGRATE-disposition row in this handoff vetoed to BLOCKED for
    // missing fresh evidence — none of them are frozen-BLOCK by policy —
    // while every ABORTED count stays at zero.
    expect(handoff.closure.abortedRows).toBe(0);
    const illegitimatelyBlocked = handoff.rows.filter(
      (row) => row.status === MigrationOperationStatuses.BLOCKED && row.disposition !== InflightDisposition.BLOCK,
    );
    expect(illegitimatelyBlocked.length).toBeGreaterThan(0);

    const input = fixturePreflightInput({}, handoff);
    expect(evaluateCutoverPreflight(input)).toEqual({ verdict: 'blocked', reasonCode: 'MIGRATION_HANDOFF_INVALID' });
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
    // The certificate/expectation block still binds MODE ('deep-research');
    // overriding only the top-level requested mode to a later manifest
    // entry (with its predecessor prefix satisfied, so the order guard
    // itself does not intercept first) isolates the mode-binding check.
    const input = fixturePreflightInput({
      mode: 'deep-review',
      alreadyFlippedModes: predecessorsOf('deep-review'),
    }, handoff);
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
    const handoff = await buildCleanHandoffFixture(temporaryRoot('empty-rollback-assets'));
    const input = fixturePreflightInput({ rollbackAssetDigests: [] }, handoff);
    expect(evaluateCutoverPreflight(input)).toEqual({ verdict: 'blocked', reasonCode: 'ROLLBACK_ASSETS_INVALID' });
  });

  it('blocks duplicate rollback-asset digests', async () => {
    const handoff = await buildCleanHandoffFixture(temporaryRoot('duplicate-rollback-assets'));
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

  it('allows a benchmark variant once its full manifest-order predecessor prefix has flipped', async () => {
    const handoff = await buildCleanHandoffFixture(temporaryRoot('order-satisfied'));
    const variantCertificate = fixtureCutoverCertificateForMode('model-benchmark');
    const input = fixturePreflightInput({
      mode: 'model-benchmark',
      alreadyFlippedModes: predecessorsOf('model-benchmark'),
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
    const handoff = await buildCleanHandoffFixture(join(root, 'migration'));
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
    const handoff = await buildCleanHandoffFixture(join(root, 'migration'));
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
    const handoff = await buildCleanHandoffFixture(join(root, 'migration'));
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
    // The two durable facts are split at this exact instant — the ledger
    // already has the event, the registry does not yet reflect it — but a
    // durable prepare marker records exactly what completes the split.
    expect(registry.readPendingTransition(MODE)).not.toBeNull();

    const resumed = new AuthorityFlipCoordinator({ registry, ledger, gateway });
    const decision = await resumed.requestCutover(request);
    expect(decision.disposition).toBe('flipped');
    if (decision.disposition !== 'flipped') throw new Error('expected flipped');
    expect(decision.record.state).toBe('new_authoritative_reversible');
    expect(decision.record.epoch).toBe(AUTHORITY_EPOCH + 1);
    expect(await ledger.readVerifiedEvents()).toHaveLength(1);
    // Every observer now derives exactly one authority from the same
    // committed epoch: the marker that recorded the split is gone.
    expect(registry.readPendingTransition(MODE)).toBeNull();
    expect(selectAuthorityRoute(registry.read(MODE), { mode: MODE })).toMatchObject({
      outcome: 'selected', route: 'dark', epoch: AUTHORITY_EPOCH + 1,
    });
  });

  it('reconciles and cleanly aborts a prepared transition that never actually reached the ledger, then completes a fresh request normally', async () => {
    const root = temporaryRoot('reconcile-abort-never-appended');
    const handoff = await buildCleanHandoffFixture(join(root, 'migration'));
    const preflight = fixturePreflightInput({}, handoff);
    seedAuthorityRecord(join(root, 'authority-registry'), cutoverReadyRecord(MODE, AUTHORITY_EPOCH));
    const registry = new AuthorityRegistry(join(root, 'authority-registry'));
    const { ledger, gateway, policy } = await buildLedgerAndGateway(join(root, 'ledger'), AUTHORITY_EPOCH);

    // Simulate a hard death immediately after the durable prepare marker
    // was written but before the ledger append itself ever landed: the
    // marker exists, the ledger has zero events for it.
    registry.preparePendingTransition({
      mode: MODE,
      expectedState: 'cutover_ready',
      expectedEpoch: AUTHORITY_EPOCH,
      nextSelectedWriter: 'dark',
      candidateSha: CANDIDATE_SHA,
      policyVersion: 1,
      cutoverCertificateDigest: digest('orphaned-certificate'),
      lastTransitionDigest: digest('orphaned-transition-that-never-reached-the-ledger'),
      at: '2026-08-09T00:14:00Z',
    }, '2026-08-09T00:14:00Z');
    expect(registry.readPendingTransition(MODE)).not.toBeNull();
    expect(await ledger.readVerifiedEvents()).toHaveLength(0);

    const coordinator = new AuthorityFlipCoordinator({ registry, ledger, gateway });
    const decision = await coordinator.requestCutover(buildRequest(policy, preflight));

    expect(decision.disposition).toBe('flipped');
    if (decision.disposition !== 'flipped') throw new Error('expected flipped');
    // The abandoned marker was cleanly aborted (the registry never actually
    // moved for it), and exactly one real ledger event exists — the fresh
    // request's own, not a duplicate or a corrupted resume of the orphan.
    const events = await ledger.readVerifiedEvents();
    const flipEvents = events.filter((entry) => entry.event.effective.envelope.event_type === AUTHORITY_FLIP_EVENT_TYPE);
    expect(flipEvents).toHaveLength(1);
    expect(registry.readPendingTransition(MODE)).toBeNull();
    expect(registry.read(MODE).state).toBe('new_authoritative_reversible');
  });

  it('fails loud rather than guessing when a ledger-committed transition cannot be reconciled against an incompatible durable registry state', async () => {
    const root = temporaryRoot('reconcile-anomaly');
    const handoff = await buildCleanHandoffFixture(join(root, 'migration'));
    const preflight = fixturePreflightInput({}, handoff);
    seedAuthorityRecord(join(root, 'authority-registry'), cutoverReadyRecord(MODE, AUTHORITY_EPOCH));
    const registry = new AuthorityRegistry(join(root, 'authority-registry'));
    const { ledger, gateway, policy } = await buildLedgerAndGateway(join(root, 'ledger'), AUTHORITY_EPOCH);
    const request = buildRequest(policy, preflight);

    // Drive one real crash-stranded prepare (ledger has the event, registry
    // publish never ran), matching the earlier scenario exactly.
    const crashing = new AuthorityFlipCoordinator({
      registry,
      ledger,
      gateway,
      faultInjection: { afterLedgerAppendBeforeCas: () => { throw new Error('simulated process crash'); } },
    });
    await expect(crashing.requestCutover(request)).rejects.toThrow('simulated process crash');
    expect(registry.readPendingTransition(MODE)).not.toBeNull();

    // Now corrupt the registry out from under the pending marker into a
    // state that is neither the expected pre-state nor the expected
    // post-state — an out-of-band mutation the marker cannot explain.
    seedAuthorityRecord(join(root, 'authority-registry'), {
      schemaVersion: 1,
      mode: MODE,
      state: 'shadowing',
      epoch: AUTHORITY_EPOCH,
      selectedWriter: 'legacy',
      candidateSha: null,
      policyVersion: 0,
      cutoverCertificateDigest: null,
      lastTransitionDigest: null,
      updatedAt: '2026-08-09T00:16:00Z',
    });

    const resumed = new AuthorityFlipCoordinator({ registry, ledger, gateway });
    await expect(resumed.requestCutover(request)).rejects.toThrow(AuthorityFlipError);
  });
});

// ───────────────────────────────────────────────────────────────────
// 7. FROZEN MANIFEST ORDER ENFORCED FROM DURABLE STATE
// ───────────────────────────────────────────────────────────────────

describe('AuthorityFlipCoordinator manifest-order enforcement', () => {
  const temporaryRoots: string[] = [];
  afterEach(() => {
    while (temporaryRoots.length > 0) {
      const root = temporaryRoots.pop();
      if (root) rmSync(root, { recursive: true, force: true });
    }
  });
  function temporaryRoot(label: string): string {
    const root = mkdtempSync(join(tmpdir(), `authority-flip-order-${label}-`));
    temporaryRoots.push(root);
    return root;
  }

  async function buildLedgerAndGateway(root: string, authorityEpoch: number) {
    const authority: AuthoritySnapshot = { state: 'cutover_ready', epoch: authorityEpoch };
    const eventRegistry = createAuthorityTransitionEventRegistry();
    const policies = new TransitionPolicyRegistry([{
      policyId: 'authority-flip-order-policy',
      policyVersion: 1,
      evaluatorVersion: '1',
      ruleIds: ['always-allow'],
      evaluate: (): PolicyEvaluationResult => (
        { verdict: 'allow', reasonCode: 'allowed', matchedRuleIds: ['always-allow'] }
      ),
    }]);
    const ledger = new AppendOnlyLedger({
      rootDirectory: root,
      ledgerId: 'authority-flip-order-domain',
      auditLedgerId: 'authority-flip-order-audit',
      authorityProvider: () => authority,
    }, eventRegistry);
    const gateway = new TransitionAuthorizationGateway({
      rootDirectory: root,
      auditLedgerId: 'authority-flip-order-audit',
      authorityProvider: () => authority,
    }, ledger, policies);
    const policy = policies.resolve('authority-flip-order-policy', 1);
    return { ledger, gateway, policy };
  }

  it('denies a later mode when the caller forges an alreadyFlippedModes set that durable state does not actually show', async () => {
    const root = temporaryRoot('forged-order');
    // deep-alignment is the eighth/last manifest mode; none of its seven
    // predecessors have actually flipped in the durable registry — only
    // the request's own (forged) claim says otherwise.
    const lastMode: CutoverCertificateMode = AUTHORITY_FLIP_MODE_ORDER[AUTHORITY_FLIP_MODE_ORDER.length - 1];
    const handoff = await buildCleanHandoffFixture(join(root, 'migration'));
    const certificate = fixtureCutoverCertificateForMode(lastMode);
    const preflight = fixturePreflightInput({
      mode: lastMode,
      alreadyFlippedModes: predecessorsOf(lastMode), // the forged claim
      cutover: {
        certificate,
        expectation: {
          mode: lastMode,
          candidateSha: CANDIDATE_SHA,
          fromAuthorityEpoch: AUTHORITY_EPOCH,
          policyId: certificate.facts.evidence.approvingPolicyId,
          policyVersion: certificate.facts.evidence.approvingPolicyVersion,
          policyDigest: certificate.facts.evidence.approvingPolicyDigest,
        },
      },
    }, handoff);
    seedAuthorityRecord(join(root, 'authority-registry'), cutoverReadyRecord(lastMode, AUTHORITY_EPOCH));
    const registry = new AuthorityRegistry(join(root, 'authority-registry'));
    const { ledger, gateway, policy } = await buildLedgerAndGateway(join(root, 'ledger'), AUTHORITY_EPOCH);
    const coordinator = new AuthorityFlipCoordinator({ registry, ledger, gateway });

    const request: CutoverRequest = {
      requestedModes: [lastMode],
      preflight,
      requestId: 'authority-flip-order-request-1',
      actorId: 'per-mode-authority-flip-tests',
      capabilityId: 'write',
      policyId: policy.policyId,
      policyVersion: policy.policyVersion,
      policyDigest: policy.digest,
      streamId: `${lastMode}-authority-flip`,
      correlationId: 'authority-flip-order-correlation-1',
      decidedAt: '2026-08-09T00:15:00Z',
    };
    const decision = await coordinator.requestCutover(request);
    expect(decision).toEqual({ disposition: 'denied', reasonCode: 'MODE_ORDER_VIOLATION' });
    expect(await ledger.readVerifiedEvents()).toHaveLength(0);
    expect(registry.read(lastMode).state).toBe('cutover_ready');
  });

  it('admits only the true next mode in the frozen order, once durable state actually shows every predecessor flipped', async () => {
    const root = temporaryRoot('true-next-mode');
    const lastMode: CutoverCertificateMode = AUTHORITY_FLIP_MODE_ORDER[AUTHORITY_FLIP_MODE_ORDER.length - 1];
    const handoff = await buildCleanHandoffFixture(join(root, 'migration'));
    const certificate = fixtureCutoverCertificateForMode(lastMode);
    const preflight = fixturePreflightInput({
      mode: lastMode,
      alreadyFlippedModes: new Set(), // ignored either way — derived fresh from the registry
      cutover: {
        certificate,
        expectation: {
          mode: lastMode,
          candidateSha: CANDIDATE_SHA,
          fromAuthorityEpoch: AUTHORITY_EPOCH,
          policyId: certificate.facts.evidence.approvingPolicyId,
          policyVersion: certificate.facts.evidence.approvingPolicyVersion,
          policyDigest: certificate.facts.evidence.approvingPolicyDigest,
        },
      },
    }, handoff);
    const registryRoot = join(root, 'authority-registry');
    seedAuthorityRecord(registryRoot, cutoverReadyRecord(lastMode, AUTHORITY_EPOCH));
    // Every one of the seven predecessor modes genuinely shows a
    // dark-authoritative durable state — the true precondition, not a claim.
    for (const predecessor of AUTHORITY_FLIP_MODE_ORDER.slice(0, AUTHORITY_FLIP_MODE_ORDER.length - 1)) {
      seedAuthorityRecord(registryRoot, {
        schemaVersion: 1,
        mode: predecessor,
        state: 'new_authoritative_reversible',
        epoch: 2,
        selectedWriter: 'dark',
        candidateSha: CANDIDATE_SHA,
        policyVersion: 1,
        cutoverCertificateDigest: digest(`${predecessor}:certificate`),
        lastTransitionDigest: digest(`${predecessor}:transition`),
        updatedAt: '2026-08-09T00:00:00Z',
      });
    }
    const registry = new AuthorityRegistry(registryRoot);
    const { ledger, gateway, policy } = await buildLedgerAndGateway(join(root, 'ledger'), AUTHORITY_EPOCH);
    const coordinator = new AuthorityFlipCoordinator({ registry, ledger, gateway });

    const request: CutoverRequest = {
      requestedModes: [lastMode],
      preflight,
      requestId: 'authority-flip-order-request-2',
      actorId: 'per-mode-authority-flip-tests',
      capabilityId: 'write',
      policyId: policy.policyId,
      policyVersion: policy.policyVersion,
      policyDigest: policy.digest,
      streamId: `${lastMode}-authority-flip`,
      correlationId: 'authority-flip-order-correlation-2',
      decidedAt: '2026-08-09T00:15:00Z',
    };
    const decision = await coordinator.requestCutover(request);
    expect(decision.disposition).toBe('flipped');
    if (decision.disposition !== 'flipped') throw new Error('expected flipped');
    expect(decision.record.state).toBe('new_authoritative_reversible');
    expect(registry.read(lastMode).state).toBe('new_authoritative_reversible');

    // The blast radius is exactly the requested mode: every predecessor's
    // own record is untouched by this call.
    for (const predecessor of AUTHORITY_FLIP_MODE_ORDER.slice(0, AUTHORITY_FLIP_MODE_ORDER.length - 1)) {
      expect(registry.read(predecessor).epoch).toBe(2);
    }
  });
});
