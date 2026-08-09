// ───────────────────────────────────────────────────────────────────
// MODULE: Cutover Certificate & Rollback Window Tests
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
import {
  appendCutoverCertificateEvent,
  buildCutoverCertificate,
  buildRollbackRevertRecord,
  closeRollbackWindow,
  createCutoverCertificateEventRegistry,
  evaluateMonitoredSignals,
  evaluateRollbackWindow,
  MonitoredSignalFamilies,
  openRollbackWindow,
  prepareCutoverCertificateEventWrite,
  verifyCutoverCertificate,
} from '../../lib/cutover-certificate/index.js';
import { canonicalBytes, sha256Bytes } from '../../lib/event-envelope/index.js';
import {
  createClassificationManifest,
  FROZEN_CENSUS_ROW_POLICIES,
  InflightDisposition,
} from '../../lib/inflight-state-classification/index.js';
import {
  certifyBoundaryReceipt,
  CertificationProviderRegistry,
  createHmacCertificationProvider,
} from '../../lib/receipts-and-effect-recovery/index.js';
import {
  createRollbackDrillCertificate,
  ROLLBACK_CERTIFICATE_SCHEMA_VERSION,
} from '../../lib/rollback-drills/index.js';

import type {
  AuthoritySnapshot,
  PolicyEvaluationInput,
  PolicyEvaluationResult,
  TransitionAuthorizationRequest,
} from '../../lib/authorized-ledger/index.js';
import type {
  CutoverCertificateEvidenceSources,
  CutoverCertificateMode,
  CutoverCertificateRequest,
  CutoverCertificateVerificationProviders,
  MonitoredSignalFamily,
  MonitoredSignalReading,
  RollbackWindowExecution,
  RollbackWindowOpenRequest,
  RollbackWindowRecord,
} from '../../lib/cutover-certificate/index.js';
import type {
  ClassificationEvidence,
  DispositionProof,
  InflightClassificationManifest,
  StateBackendCensus,
  StateBackendCensusRow,
} from '../../lib/inflight-state-classification/index.js';
import type {
  BoundaryReceiptPayload,
  CertificationEnvelope,
  CertificationProfile,
} from '../../lib/receipts-and-effect-recovery/index.js';
import type { RollbackDrillCertificate } from '../../lib/rollback-drills/index.js';
import type { MixedVersionOraclePass } from '../../lib/mixed-version-fixtures/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. SHARED FIXTURES
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
    classificationId: 'cutover-certificate-fixture',
    classifiedAt: '2026-07-28T12:00:00Z',
    classifierBuildId: 'cutover-certificate-tests',
    censusBytes: CENSUS_BYTES,
    evidence: CENSUS.rows.map(evidenceFor),
  }).manifest;
}

const CLASSIFICATION_MANIFEST = buildManifest();

// Two independently keyed trusted providers, mirroring the real deployment
// shape where the rollback-drill authority and the migration-receipt
// signer(s) are distinct issuers — a certificate built from evidence signed
// under one identity must never verify against the other's key.
const ROLLBACK_DRILL_CERTIFICATION_PROFILE: CertificationProfile = Object.freeze({
  scheme: 'hmac-sha256',
  provider_id: 'cutover-certificate-rollback-drill-tests',
  key_id: 'rollback-drill-k1',
  verifier_version: '1',
  trust_scope: 'durable-cross-resume',
});
const ROLLBACK_DRILL_PROVIDER_SECRET = 'a'.repeat(32);

function fixtureRollbackDrillProvider() {
  return createHmacCertificationProvider(ROLLBACK_DRILL_CERTIFICATION_PROFILE, ROLLBACK_DRILL_PROVIDER_SECRET);
}

const MIGRATION_RECEIPT_CERTIFICATION_PROFILE: CertificationProfile = Object.freeze({
  scheme: 'hmac-sha256',
  provider_id: 'cutover-certificate-migration-receipt-tests',
  key_id: 'migration-receipt-k1',
  verifier_version: '1',
  trust_scope: 'durable-cross-resume',
});
const MIGRATION_RECEIPT_PROVIDER_SECRET = 'b'.repeat(32);

function fixtureMigrationReceiptProviders(): CertificationProviderRegistry {
  return new CertificationProviderRegistry([
    createHmacCertificationProvider(MIGRATION_RECEIPT_CERTIFICATION_PROFILE, MIGRATION_RECEIPT_PROVIDER_SECRET),
  ]);
}

function fixtureCertificateVerificationProviders(): CutoverCertificateVerificationProviders {
  return {
    rollbackDrillProvider: fixtureRollbackDrillProvider(),
    migrationReceiptProviders: fixtureMigrationReceiptProviders(),
  };
}

/** A forged trusted-looking provider under a different key — never registered with the real fixture registry. */
function fixtureForeignMigrationReceiptProviders(): CertificationProviderRegistry {
  return new CertificationProviderRegistry([
    createHmacCertificationProvider(MIGRATION_RECEIPT_CERTIFICATION_PROFILE, 'c'.repeat(32)),
  ]);
}

async function fixtureBoundaryReceipt(
  label: string,
  overrides: Readonly<Partial<Omit<BoundaryReceiptPayload, 'certification'>>> = {},
  providers: CertificationProviderRegistry = fixtureMigrationReceiptProviders(),
): Promise<BoundaryReceiptPayload> {
  const facts: Omit<BoundaryReceiptPayload, 'certification'> = {
    receipt_id: `receipt-${label}`,
    boundary_id: `boundary-${label}`,
    boundary_kind: 'phase-handoff',
    scope: 'phase',
    scope_id: 'phase-014',
    from_state: 'cutover_ready',
    to_state: 'new_authoritative_reversible',
    from_head: { ledger_id: 'domain', sequence: 1, record_hash: digest(`${label}:from`) },
    result_head: { ledger_id: 'domain', sequence: 2, record_hash: digest(`${label}:result`) },
    result_event_id: `event-${label}`,
    result_event_type: 'deep-loop-cutover.ledger.certificate-issued',
    result_event_digest: digest(`${label}:event`),
    result_code: 'ok',
    evidence_digest: digest(`${label}:evidence`),
    artifact_digests: [],
    replay_fingerprint: digest(`${label}:replay`),
    authority_epoch: AUTHORITY_EPOCH,
    correlation_id: `correlation-${label}`,
    causation_id: `causation-${label}`,
    issuer: 'cutover-certificate-tests',
    issued_at: '2026-07-28T12:00:00Z',
    idempotency_key: `idempotency-${label}`,
    ...overrides,
  };
  const certification = await certifyBoundaryReceipt(facts, MIGRATION_RECEIPT_CERTIFICATION_PROFILE, providers);
  return Object.freeze({ ...facts, certification });
}

async function fixtureRollbackDrillCertificate(
  overrides: Readonly<Partial<Record<
    'mode' | 'candidateSha' | 'passed' | 'classificationDigest' | 'startingAuthorityEpoch', unknown
  >>> = {},
  provider = fixtureRollbackDrillProvider(),
): Promise<RollbackDrillCertificate> {
  const facts = {
    schemaVersion: ROLLBACK_CERTIFICATE_SCHEMA_VERSION,
    mode: MODE,
    candidateSha: CANDIDATE_SHA,
    passed: true,
    classificationDigest: CLASSIFICATION_MANIFEST.finalDigest,
    startingAuthorityEpoch: AUTHORITY_EPOCH,
    ...overrides,
  };
  return createRollbackDrillCertificate(facts as never, provider, ROLLBACK_DRILL_CERTIFICATION_PROFILE);
}

function fixtureMixedVersionReplay(
  overrides: Readonly<Partial<MixedVersionOraclePass>> = {},
): MixedVersionOraclePass {
  return Object.freeze({
    ok: true,
    caseId: 'mixed-version-case-1',
    capsuleDigest: digest('mixed-version-capsule'),
    evidenceDigest: digest('mixed-version-evidence'),
    deterministicRuns: 2,
    parityEligible: true,
    certificateEligible: true,
    authorityState: 'legacy_authoritative',
    authorityMutation: false,
    ...overrides,
  });
}

function fixturePolicy() {
  return new TransitionPolicyRegistry([{
    policyId: 'cutover-certificate-policy',
    policyVersion: 1,
    evaluatorVersion: '1',
    ruleIds: ['cutover-authorized'],
    evaluate: () => ({ verdict: 'allow' as const, reasonCode: 'allowed' as const, matchedRuleIds: ['cutover-authorized'] }),
  }]).resolve('cutover-certificate-policy', 1);
}

async function fixtureEvidence(
  overrides: Readonly<Partial<CutoverCertificateEvidenceSources>> = {},
): Promise<CutoverCertificateEvidenceSources> {
  return {
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
    rollbackDrillCertificate: await fixtureRollbackDrillCertificate(),
    mixedVersionReplay: fixtureMixedVersionReplay(),
    classificationManifest: CLASSIFICATION_MANIFEST,
    migrationReceipts: [await fixtureBoundaryReceipt('one'), await fixtureBoundaryReceipt('two')],
    approvingPolicy: fixturePolicy(),
    ...overrides,
  };
}

async function fixtureRequest(
  overrides: Readonly<Partial<CutoverCertificateRequest>> = {},
): Promise<CutoverCertificateRequest> {
  return {
    mode: MODE,
    candidateSha: CANDIDATE_SHA,
    fromAuthorityEpoch: AUTHORITY_EPOCH,
    issuer: 'cutover-certificate-tests',
    issuedAt: '2026-07-28T12:05:00Z',
    evidence: overrides.evidence ?? await fixtureEvidence(),
    ...overrides,
  };
}

// ───────────────────────────────────────────────────────────────────
// 2. BUILD (assembly)
// ───────────────────────────────────────────────────────────────────

describe('buildCutoverCertificate', () => {
  it('issues a certificate from complete, consistent evidence', async () => {
    const result = await buildCutoverCertificate(await fixtureRequest(), fixtureCertificateVerificationProviders());
    expect(result.verdict).toBe('issued');
    if (result.verdict !== 'issued') throw new Error('expected issued');
    expect(result.certificate.facts.mode).toBe(MODE);
    expect(result.certificate.facts.candidateSha).toBe(CANDIDATE_SHA);
    expect(result.certificate.facts.fromAuthorityState).toBe('cutover_ready');
    expect(result.certificate.facts.toAuthorityState).toBe('new_authoritative_reversible');
    expect(result.certificate.facts.toAuthorityEpoch).toBe(AUTHORITY_EPOCH + 1);
    expect(result.certificate.facts.unresolvedBlockerCount).toBe(0);
    expect(result.certificate.facts.authorityMutation).toBe(false);
    expect(result.certificate.facts.evidence.migrationReceiptDigests).toHaveLength(2);
    const recomputed = sha256Bytes(canonicalBytes(result.certificate.facts as never));
    expect(result.certificate.certificateDigest).toBe(recomputed);
  });

  it('rejects a candidate SHA that is not 40-hex', async () => {
    const result = await buildCutoverCertificate(
      await fixtureRequest({ candidateSha: 'not-a-sha' }),
      fixtureCertificateVerificationProviders(),
    );
    expect(result).toEqual({ verdict: 'rejected', reasonCode: 'CANDIDATE_SHA_INVALID' });
  });

  it('rejects a non-positive authority epoch', async () => {
    const result = await buildCutoverCertificate(
      await fixtureRequest({ fromAuthorityEpoch: 0 }),
      fixtureCertificateVerificationProviders(),
    );
    expect(result).toEqual({ verdict: 'rejected', reasonCode: 'AUTHORITY_EPOCH_INVALID' });
  });

  it('rejects a mode gate certificate bound to a different mode', async () => {
    const evidence = await fixtureEvidence({
      modeGateCertificate: {
        mode: 'deep-review',
        candidateSha: CANDIDATE_SHA,
        authorityEpoch: AUTHORITY_EPOCH,
        readiness: 'ready-for-phase-014-consideration',
        certificateDigest: digest('mode-gate-certificate'),
      },
    });
    const result = await buildCutoverCertificate(await fixtureRequest({ evidence }), fixtureCertificateVerificationProviders());
    expect(result).toEqual({ verdict: 'rejected', reasonCode: 'READINESS_NOT_READY' });
  });

  it('rejects a mode gate certificate that is not readiness-ready', async () => {
    const evidence = await fixtureEvidence({
      modeGateCertificate: {
        mode: MODE,
        candidateSha: CANDIDATE_SHA,
        authorityEpoch: AUTHORITY_EPOCH,
        readiness: 'not-ready',
        certificateDigest: digest('mode-gate-certificate'),
      },
    });
    const result = await buildCutoverCertificate(await fixtureRequest({ evidence }), fixtureCertificateVerificationProviders());
    expect(result).toEqual({ verdict: 'rejected', reasonCode: 'READINESS_NOT_READY' });
  });

  it('rejects shadow parity that is not green', async () => {
    const evidence = await fixtureEvidence({
      shadowParity: {
        mode: MODE,
        candidateSha: CANDIDATE_SHA,
        exitStatus: 'red',
        evidenceDigest: digest('shadow-parity-evidence'),
      },
    });
    const result = await buildCutoverCertificate(await fixtureRequest({ evidence }), fixtureCertificateVerificationProviders());
    expect(result).toEqual({ verdict: 'rejected', reasonCode: 'PARITY_NOT_GREEN' });
  });

  it('rejects a rollback drill certificate that did not pass', async () => {
    const evidence = await fixtureEvidence({
      rollbackDrillCertificate: await fixtureRollbackDrillCertificate({ passed: false }),
    });
    const result = await buildCutoverCertificate(await fixtureRequest({ evidence }), fixtureCertificateVerificationProviders());
    expect(result).toEqual({ verdict: 'rejected', reasonCode: 'ROLLBACK_DRILL_NOT_PASSED' });
  });

  it('rejects a rollback drill certificate whose classification digest does not match the bound manifest', async () => {
    const evidence = await fixtureEvidence({
      rollbackDrillCertificate: await fixtureRollbackDrillCertificate({ classificationDigest: digest('stale') }),
    });
    const result = await buildCutoverCertificate(await fixtureRequest({ evidence }), fixtureCertificateVerificationProviders());
    expect(result).toEqual({ verdict: 'rejected', reasonCode: 'ROLLBACK_DRILL_NOT_PASSED' });
  });

  it('rejects a rollback drill certificate whose starting authority epoch does not match the request', async () => {
    const evidence = await fixtureEvidence({
      rollbackDrillCertificate: await fixtureRollbackDrillCertificate({ startingAuthorityEpoch: AUTHORITY_EPOCH + 5 }),
    });
    const result = await buildCutoverCertificate(await fixtureRequest({ evidence }), fixtureCertificateVerificationProviders());
    expect(result).toEqual({ verdict: 'rejected', reasonCode: 'ROLLBACK_DRILL_NOT_PASSED' });
  });

  it('rejects a rollback drill certificate whose signature does not verify against the trusted provider (tamper)', async () => {
    const genuine = await fixtureRollbackDrillCertificate();
    // Mutate a fact field this builder never explicitly binds — every
    // explicitly-checked field (mode/candidateSha/passed/classificationDigest/
    // startingAuthorityEpoch) still matches, so only signature verification
    // over the complete facts object can catch this.
    const tampered = {
      ...genuine,
      facts: { ...genuine.facts, drillId: 'tampered-drill-id' },
    };
    const evidence = await fixtureEvidence({ rollbackDrillCertificate: tampered as never });
    const result = await buildCutoverCertificate(await fixtureRequest({ evidence }), fixtureCertificateVerificationProviders());
    expect(result).toEqual({ verdict: 'rejected', reasonCode: 'ROLLBACK_DRILL_NOT_PASSED' });
  });

  it('rejects a rollback drill certificate issued by an untrusted signer (issuer substitution)', async () => {
    const forgedProvider = createHmacCertificationProvider(ROLLBACK_DRILL_CERTIFICATION_PROFILE, 'z'.repeat(32));
    const evidence = await fixtureEvidence({
      rollbackDrillCertificate: await fixtureRollbackDrillCertificate({}, forgedProvider),
    });
    const result = await buildCutoverCertificate(await fixtureRequest({ evidence }), fixtureCertificateVerificationProviders());
    expect(result).toEqual({ verdict: 'rejected', reasonCode: 'ROLLBACK_DRILL_NOT_PASSED' });
  });

  it('rejects a mixed-version replay result that is not a clean pass', async () => {
    const evidence = await fixtureEvidence({
      mixedVersionReplay: {
        ok: false,
        caseId: 'mixed-version-case-1',
        code: 'REPLAY_MISMATCH',
        stage: 'apply',
        expectedDigest: null,
        actualDigest: null,
        parityEligible: false,
        certificateEligible: false,
        authorityState: 'legacy_authoritative',
        authorityMutation: false,
      } as unknown as MixedVersionOraclePass,
    });
    const result = await buildCutoverCertificate(await fixtureRequest({ evidence }), fixtureCertificateVerificationProviders());
    expect(result).toEqual({ verdict: 'rejected', reasonCode: 'MIXED_VERSION_REPLAY_FAILED' });
  });

  it('rejects a tampered classification manifest', async () => {
    // Mutate a core field while keeping finalDigest unchanged, so the
    // drill's classificationDigest binding still matches this manifest and
    // the rejection is attributable to manifest integrity, not the binding.
    const tampered = {
      ...CLASSIFICATION_MANIFEST,
      classificationId: `${CLASSIFICATION_MANIFEST.classificationId}-tampered`,
    };
    const evidence = await fixtureEvidence({ classificationManifest: tampered });
    const result = await buildCutoverCertificate(await fixtureRequest({ evidence }), fixtureCertificateVerificationProviders());
    expect(result).toEqual({ verdict: 'rejected', reasonCode: 'CLASSIFICATION_MANIFEST_INVALID' });
  });

  it('rejects an empty migration receipt set', async () => {
    const evidence = await fixtureEvidence({ migrationReceipts: [] });
    const result = await buildCutoverCertificate(await fixtureRequest({ evidence }), fixtureCertificateVerificationProviders());
    expect(result).toEqual({ verdict: 'rejected', reasonCode: 'MIGRATION_RECEIPT_INVALID' });
  });

  it('rejects migration receipts with a duplicate evidence digest', async () => {
    const receipt = await fixtureBoundaryReceipt('dup');
    const evidence = await fixtureEvidence({ migrationReceipts: [receipt, receipt] });
    const result = await buildCutoverCertificate(await fixtureRequest({ evidence }), fixtureCertificateVerificationProviders());
    expect(result).toEqual({ verdict: 'rejected', reasonCode: 'MIGRATION_RECEIPT_INVALID' });
  });

  it('rejects a migration receipt bound to a different authority epoch than the request', async () => {
    const receipt = await fixtureBoundaryReceipt('wrong-epoch', { authority_epoch: AUTHORITY_EPOCH + 9 });
    const evidence = await fixtureEvidence({ migrationReceipts: [receipt, await fixtureBoundaryReceipt('two')] });
    const result = await buildCutoverCertificate(await fixtureRequest({ evidence }), fixtureCertificateVerificationProviders());
    expect(result).toEqual({ verdict: 'rejected', reasonCode: 'MIGRATION_RECEIPT_INVALID' });
  });

  it('rejects a migration receipt whose result was not successful (result_code substitution)', async () => {
    const receipt = await fixtureBoundaryReceipt('failed', { result_code: 'failed' });
    const evidence = await fixtureEvidence({ migrationReceipts: [receipt, await fixtureBoundaryReceipt('two')] });
    const result = await buildCutoverCertificate(await fixtureRequest({ evidence }), fixtureCertificateVerificationProviders());
    expect(result).toEqual({ verdict: 'rejected', reasonCode: 'MIGRATION_RECEIPT_INVALID' });
  });

  it('rejects a migration receipt whose signature does not verify against the trusted provider (tamper)', async () => {
    const genuine = await fixtureBoundaryReceipt('tampered');
    const tampered = { ...genuine, evidence_digest: digest('substituted-evidence') };
    const evidence = await fixtureEvidence({ migrationReceipts: [tampered, await fixtureBoundaryReceipt('two')] });
    const result = await buildCutoverCertificate(await fixtureRequest({ evidence }), fixtureCertificateVerificationProviders());
    expect(result).toEqual({ verdict: 'rejected', reasonCode: 'MIGRATION_RECEIPT_INVALID' });
  });

  it('rejects a migration receipt issued by an untrusted signer the certificate builder never registered (issuer substitution)', async () => {
    const foreignProviders = fixtureForeignMigrationReceiptProviders();
    const receipt = await fixtureBoundaryReceipt('foreign-signer', {}, foreignProviders);
    const evidence = await fixtureEvidence({ migrationReceipts: [receipt, await fixtureBoundaryReceipt('two')] });
    const result = await buildCutoverCertificate(await fixtureRequest({ evidence }), fixtureCertificateVerificationProviders());
    expect(result).toEqual({ verdict: 'rejected', reasonCode: 'MIGRATION_RECEIPT_INVALID' });
  });
});

// ───────────────────────────────────────────────────────────────────
// 3. VERIFY
// ───────────────────────────────────────────────────────────────────

describe('verifyCutoverCertificate', () => {
  async function issuedCertificate() {
    const result = await buildCutoverCertificate(await fixtureRequest(), fixtureCertificateVerificationProviders());
    if (result.verdict !== 'issued') throw new Error('fixture certificate failed to issue');
    return result.certificate;
  }

  it('accepts a certificate that exactly matches the expectation', async () => {
    const certificate = await issuedCertificate();
    const outcome = verifyCutoverCertificate(certificate, {
      mode: MODE,
      candidateSha: CANDIDATE_SHA,
      fromAuthorityEpoch: AUTHORITY_EPOCH,
      policyId: certificate.facts.evidence.approvingPolicyId,
      policyVersion: certificate.facts.evidence.approvingPolicyVersion,
      policyDigest: certificate.facts.evidence.approvingPolicyDigest,
    });
    expect(outcome).toEqual({ verdict: 'valid' });
  });

  it('rejects a certificate whose digest was tampered', async () => {
    const certificate = await issuedCertificate();
    const tampered = { ...certificate, certificateDigest: digest('tampered') };
    const outcome = verifyCutoverCertificate(tampered, {
      mode: MODE,
      candidateSha: CANDIDATE_SHA,
      fromAuthorityEpoch: AUTHORITY_EPOCH,
      policyId: certificate.facts.evidence.approvingPolicyId,
      policyVersion: certificate.facts.evidence.approvingPolicyVersion,
      policyDigest: certificate.facts.evidence.approvingPolicyDigest,
    });
    expect(outcome).toEqual({ verdict: 'rejected', reasonCode: 'CERTIFICATE_MALFORMED' });
  });

  it('rejects a candidate SHA that does not match the expectation', async () => {
    const certificate = await issuedCertificate();
    const outcome = verifyCutoverCertificate(certificate, {
      mode: MODE,
      candidateSha: 'b'.repeat(40),
      fromAuthorityEpoch: AUTHORITY_EPOCH,
      policyId: certificate.facts.evidence.approvingPolicyId,
      policyVersion: certificate.facts.evidence.approvingPolicyVersion,
      policyDigest: certificate.facts.evidence.approvingPolicyDigest,
    });
    expect(outcome).toEqual({ verdict: 'rejected', reasonCode: 'CANDIDATE_SHA_MISMATCH' });
  });

  it('rejects an approving policy that does not match the expectation', async () => {
    const certificate = await issuedCertificate();
    const outcome = verifyCutoverCertificate(certificate, {
      mode: MODE,
      candidateSha: CANDIDATE_SHA,
      fromAuthorityEpoch: AUTHORITY_EPOCH,
      policyId: 'a-different-policy',
      policyVersion: certificate.facts.evidence.approvingPolicyVersion,
      policyDigest: certificate.facts.evidence.approvingPolicyDigest,
    });
    expect(outcome).toEqual({ verdict: 'rejected', reasonCode: 'POLICY_INVALID' });
  });
});

// ───────────────────────────────────────────────────────────────────
// 4. LEDGER EVENT WRITE AND APPEND
// ───────────────────────────────────────────────────────────────────

describe('cutover certificate ledger event', () => {
  const temporaryRoots: string[] = [];
  afterEach(() => {
    while (temporaryRoots.length > 0) {
      const root = temporaryRoots.pop();
      if (root) rmSync(root, { recursive: true, force: true });
    }
  });

  function temporaryRoot(label: string): string {
    const root = mkdtempSync(join(tmpdir(), `cutover-certificate-${label}-`));
    temporaryRoots.push(root);
    return root;
  }

  it('appends exactly one cutover certificate event through the fenced authorized-ledger seam', async () => {
    const rootDirectory = temporaryRoot('append');
    const registry = createCutoverCertificateEventRegistry();
    const policies = new TransitionPolicyRegistry([{
      policyId: 'cutover-append-policy',
      policyVersion: 1,
      evaluatorVersion: '1',
      ruleIds: ['always-allow'],
      evaluate: (): PolicyEvaluationResult => (
        { verdict: 'allow', reasonCode: 'allowed', matchedRuleIds: ['always-allow'] }
      ),
    }]);
    const authority: AuthoritySnapshot = { state: 'cutover_ready', epoch: AUTHORITY_EPOCH };
    const authorityProvider = () => authority;
    const ledger = new AppendOnlyLedger({
      rootDirectory,
      ledgerId: 'cutover-domain',
      auditLedgerId: 'cutover-audit',
      authorityProvider,
    }, registry);
    const gateway = new TransitionAuthorizationGateway({
      rootDirectory,
      auditLedgerId: 'cutover-audit',
      authorityProvider,
    }, ledger, policies);

    const buildResult = await buildCutoverCertificate(await fixtureRequest(), fixtureCertificateVerificationProviders());
    if (buildResult.verdict !== 'issued') throw new Error('fixture certificate failed to issue');
    const event = prepareCutoverCertificateEventWrite(buildResult.certificate, {
      eventId: 'cutover-certificate-1',
      streamId: 'deep-ai-council-cutover',
      streamSequence: 1,
      occurredAt: '2026-07-28T12:06:00Z',
      recordedAt: '2026-07-28T12:06:00Z',
      producer: { name: 'cutover-certificate-tests', version: '1' },
      correlationId: 'cutover-correlation-1',
      causationId: null,
      idempotencyKey: 'cutover-idempotency-1',
    }, registry);

    const policy = policies.resolve('cutover-append-policy', 1);
    const priorHead = await ledger.getVerifiedHead();
    const request: TransitionAuthorizationRequest = {
      requestId: 'cutover-request-1',
      mode: MODE,
      event,
      priorHead,
      priorStateVersion: 'cutover-state@1',
      priorStateFingerprint: sha256Bytes(canonicalBytes({ state: 'none' })),
      actorId: 'cutover-certificate-tests',
      capabilityId: 'write',
      authorityEpoch: authority.epoch,
      policy: { policyId: policy.policyId, policyVersion: policy.policyVersion, policyDigest: policy.digest },
      evidenceDigest: sha256Bytes(canonicalBytes({ certificate: buildResult.certificate } as never)),
    };
    const authorization = await gateway.authorize(request);
    expect(authorization.verdict).toBe('allow');
    if (authorization.verdict !== 'allow') throw new Error('expected allow');

    const receipt = await appendCutoverCertificateEvent(ledger, event, authorization.proof);
    expect(receipt.event_type).toBe('deep-loop-cutover.ledger.certificate-issued');
    expect(receipt.sequence).toBe(1);

    const events = await ledger.readVerifiedEvents();
    expect(events).toHaveLength(1);
    expect(events[0]?.event.stored.envelope.event_type).toBe('deep-loop-cutover.ledger.certificate-issued');
  });

  it('fails closed on a stale re-append of an already-committed event rather than silently duplicating', async () => {
    const rootDirectory = temporaryRoot('stale-retry');
    const registry = createCutoverCertificateEventRegistry();
    const policies = new TransitionPolicyRegistry([{
      policyId: 'cutover-append-policy',
      policyVersion: 1,
      evaluatorVersion: '1',
      ruleIds: ['always-allow'],
      evaluate: (): PolicyEvaluationResult => (
        { verdict: 'allow', reasonCode: 'allowed', matchedRuleIds: ['always-allow'] }
      ),
    }]);
    const authority: AuthoritySnapshot = { state: 'cutover_ready', epoch: AUTHORITY_EPOCH };
    const ledger = new AppendOnlyLedger({
      rootDirectory,
      ledgerId: 'cutover-domain',
      auditLedgerId: 'cutover-audit',
      authorityProvider: () => authority,
    }, registry);
    const gateway = new TransitionAuthorizationGateway({
      rootDirectory,
      auditLedgerId: 'cutover-audit',
      authorityProvider: () => authority,
    }, ledger, policies);
    const buildResult = await buildCutoverCertificate(await fixtureRequest(), fixtureCertificateVerificationProviders());
    if (buildResult.verdict !== 'issued') throw new Error('fixture certificate failed to issue');
    const event = prepareCutoverCertificateEventWrite(buildResult.certificate, {
      eventId: 'cutover-certificate-retry',
      streamId: 'deep-ai-council-cutover',
      streamSequence: 1,
      occurredAt: '2026-07-28T12:06:00Z',
      recordedAt: '2026-07-28T12:06:00Z',
      producer: { name: 'cutover-certificate-tests', version: '1' },
      correlationId: 'cutover-correlation-retry',
      causationId: null,
      idempotencyKey: 'cutover-idempotency-retry',
    }, registry);
    const policy = policies.resolve('cutover-append-policy', 1);
    const priorHead = await ledger.getVerifiedHead();
    const request: TransitionAuthorizationRequest = {
      requestId: 'cutover-request-retry',
      mode: MODE,
      event,
      priorHead,
      priorStateVersion: 'cutover-state@1',
      priorStateFingerprint: sha256Bytes(canonicalBytes({ state: 'none' })),
      actorId: 'cutover-certificate-tests',
      capabilityId: 'write',
      authorityEpoch: authority.epoch,
      policy: { policyId: policy.policyId, policyVersion: policy.policyVersion, policyDigest: policy.digest },
      evidenceDigest: sha256Bytes(canonicalBytes({ certificate: buildResult.certificate } as never)),
    };
    const authorization = await gateway.authorize(request);
    if (authorization.verdict !== 'allow') throw new Error('expected allow');
    await appendCutoverCertificateEvent(ledger, event, authorization.proof);

    // Re-appending with the same (now stale) proof after the head has
    // already advanced is refused rather than silently duplicating.
    await expect(appendCutoverCertificateEvent(ledger, event, authorization.proof)).rejects.toThrow();
    expect(await ledger.readVerifiedEvents()).toHaveLength(1);
  });

  it('refuses to append a preflight event of a different type', async () => {
    const rootDirectory = temporaryRoot('refuse');
    const registry = createCutoverCertificateEventRegistry();
    const authority: AuthoritySnapshot = { state: 'cutover_ready', epoch: AUTHORITY_EPOCH };
    const ledger = new AppendOnlyLedger({
      rootDirectory,
      ledgerId: 'cutover-domain',
      auditLedgerId: 'cutover-audit',
      authorityProvider: () => authority,
    }, registry);
    const buildResult = await buildCutoverCertificate(await fixtureRequest(), fixtureCertificateVerificationProviders());
    if (buildResult.verdict !== 'issued') throw new Error('fixture certificate failed to issue');
    const event = prepareCutoverCertificateEventWrite(buildResult.certificate, {
      eventId: 'cutover-certificate-2',
      streamId: 'deep-ai-council-cutover',
      streamSequence: 1,
      occurredAt: '2026-07-28T12:06:00Z',
      recordedAt: '2026-07-28T12:06:00Z',
      producer: { name: 'cutover-certificate-tests', version: '1' },
      correlationId: 'cutover-correlation-2',
      causationId: null,
      idempotencyKey: 'cutover-idempotency-2',
    }, registry);
    const forgedEvent = {
      ...event,
      identity: { ...event.identity, eventType: 'deep-loop-cutover.ledger.something-else' },
    };
    await expect(appendCutoverCertificateEvent(
      ledger,
      forgedEvent as never,
      { proofVersion: 1 } as never,
    )).rejects.toThrow(TypeError);
  });
});

// ───────────────────────────────────────────────────────────────────
// 5. ROLLBACK WINDOW: OPEN AND EVALUATE
// ───────────────────────────────────────────────────────────────────

const WINDOW_OPENED_AT = '2026-07-01T00:00:00.000Z';

function fixtureWindowRecord(overrides: Readonly<Partial<RollbackWindowOpenRequest>> = {}): RollbackWindowRecord {
  return openRollbackWindow({
    mode: MODE,
    cutoverCertificateDigest: digest('cutover-certificate'),
    candidateSha: CANDIDATE_SHA,
    rollbackAnchorDigest: digest('rollback-anchor'),
    retainedLegacyAssetDigests: [digest('legacy-adapter'), digest('legacy-state')],
    openedAt: WINDOW_OPENED_AT,
    openingAuthorityEpoch: AUTHORITY_EPOCH,
    ...overrides,
  });
}

function execution(
  record: RollbackWindowRecord,
  overrides: Readonly<Partial<RollbackWindowExecution>> = {},
): RollbackWindowExecution {
  return {
    executionId: digest(`execution-${Math.random()}`),
    mode: record.mode,
    windowRecordDigest: record.recordDigest,
    candidateSha: record.candidateSha,
    authorityState: 'new_authoritative_reversible',
    authorityEpoch: record.openingAuthorityEpoch + 1,
    result: 'trusted-completion',
    certificateDigest: digest(`certificate-${Math.random()}`),
    observedAt: '2026-07-10T00:00:00.000Z',
    ...overrides,
  };
}

describe('openRollbackWindow', () => {
  it('opens a digest-bound record from CAS facts', () => {
    const record = fixtureWindowRecord();
    expect(record.mode).toBe(MODE);
    expect(record.monitorCursor).toBe('0');
    expect(record.retainedLegacyAssetDigests).toEqual([...record.retainedLegacyAssetDigests].sort());
    const { recordDigest, ...core } = record;
    expect(recordDigest).toBe(sha256Bytes(canonicalBytes(core as never)));
  });

  it('throws on a malformed rollback anchor digest', () => {
    expect(() => openRollbackWindow({
      mode: MODE,
      cutoverCertificateDigest: digest('cutover-certificate'),
      candidateSha: CANDIDATE_SHA,
      rollbackAnchorDigest: 'not-a-digest',
      retainedLegacyAssetDigests: [],
      openedAt: WINDOW_OPENED_AT,
      openingAuthorityEpoch: AUTHORITY_EPOCH,
    })).toThrow(TypeError);
  });

  it('throws on a malformed candidate SHA', () => {
    expect(() => openRollbackWindow({
      mode: MODE,
      cutoverCertificateDigest: digest('cutover-certificate'),
      candidateSha: 'not-a-sha',
      rollbackAnchorDigest: digest('rollback-anchor'),
      retainedLegacyAssetDigests: [],
      openedAt: WINDOW_OPENED_AT,
      openingAuthorityEpoch: AUTHORITY_EPOCH,
    })).toThrow(TypeError);
  });
});

describe('evaluateRollbackWindow', () => {
  it('stays open before either minimum is reached', () => {
    const record = fixtureWindowRecord();
    const evaluation = evaluateRollbackWindow(record, {
      evaluatedAt: '2026-07-02T00:00:00.000Z',
      executions: [],
      unresolvedEvidenceCount: 0,
      lowTraffic: false,
    });
    expect(evaluation.state).toBe('open');
    expect(evaluation.elapsedCalendarDays).toBe(1);
    expect(evaluation.successfulAuthoritativeExecutions).toBe(0);
  });

  it('stays open at 14+ days with fewer than 5 successful executions', () => {
    const record = fixtureWindowRecord();
    const evaluation = evaluateRollbackWindow(record, {
      evaluatedAt: '2026-07-20T00:00:00.000Z',
      executions: [execution(record), execution(record), execution(record)],
      unresolvedEvidenceCount: 0,
      lowTraffic: false,
    });
    expect(evaluation.elapsedCalendarDays).toBeGreaterThanOrEqual(14);
    expect(evaluation.successfulAuthoritativeExecutions).toBe(3);
    expect(evaluation.state).toBe('open');
  });

  it('becomes eligible to close once both minimums are met', () => {
    const record = fixtureWindowRecord();
    const evaluation = evaluateRollbackWindow(record, {
      evaluatedAt: '2026-07-20T00:00:00.000Z',
      executions: [execution(record), execution(record), execution(record), execution(record), execution(record)],
      unresolvedEvidenceCount: 0,
      lowTraffic: false,
    });
    expect(evaluation.successfulAuthoritativeExecutions).toBe(5);
    expect(evaluation.state).toBe('eligible_to_close');
  });

  it('extends when traffic is low even after both minimums are met', () => {
    const record = fixtureWindowRecord();
    const evaluation = evaluateRollbackWindow(record, {
      evaluatedAt: '2026-07-20T00:00:00.000Z',
      executions: [execution(record), execution(record), execution(record), execution(record), execution(record)],
      unresolvedEvidenceCount: 0,
      lowTraffic: true,
    });
    expect(evaluation.state).toBe('extended');
  });

  it('extends when a signal has an unresolved evidence count', () => {
    const record = fixtureWindowRecord();
    const evaluation = evaluateRollbackWindow(record, {
      evaluatedAt: '2026-07-20T00:00:00.000Z',
      executions: [execution(record), execution(record), execution(record), execution(record), execution(record)],
      unresolvedEvidenceCount: 2,
      lowTraffic: false,
    });
    expect(evaluation.state).toBe('extended');
  });

  it('folds executions that share an identity link into one credit', () => {
    const record = fixtureWindowRecord();
    const sharedCertificate = digest('shared-certificate');
    const linked = [
      execution(record, { executionId: 'run-1', certificateDigest: sharedCertificate }),
      execution(record, { executionId: 'run-2', certificateDigest: sharedCertificate }),
    ];
    const evaluation = evaluateRollbackWindow(record, {
      evaluatedAt: '2026-07-20T00:00:00.000Z',
      executions: [...linked, execution(record), execution(record), execution(record)],
      unresolvedEvidenceCount: 0,
      lowTraffic: false,
    });
    expect(evaluation.successfulAuthoritativeExecutions).toBe(4);
  });

  it('throws when the evaluation time precedes the open time', () => {
    const record = fixtureWindowRecord();
    expect(() => evaluateRollbackWindow(record, {
      evaluatedAt: '2026-06-01T00:00:00.000Z',
      executions: [],
      unresolvedEvidenceCount: 0,
      lowTraffic: false,
    })).toThrow(TypeError);
  });

  it('does not count an execution bound to a different mode (cross-mode substitution)', () => {
    const record = fixtureWindowRecord();
    const foreign = execution(record, { mode: 'deep-review' });
    const evaluation = evaluateRollbackWindow(record, {
      evaluatedAt: '2026-07-20T00:00:00.000Z',
      executions: [foreign, execution(record), execution(record), execution(record), execution(record)],
      unresolvedEvidenceCount: 0,
      lowTraffic: false,
    });
    expect(evaluation.successfulAuthoritativeExecutions).toBe(4);
    expect(evaluation.state).toBe('open');
  });

  it('does not count an execution bound to a different window instance (cross-window substitution)', () => {
    const record = fixtureWindowRecord();
    const otherWindow = fixtureWindowRecord({ openedAt: '2026-06-01T00:00:00.000Z' });
    const foreign = execution(otherWindow);
    const evaluation = evaluateRollbackWindow(record, {
      evaluatedAt: '2026-07-20T00:00:00.000Z',
      executions: [foreign, execution(record), execution(record), execution(record), execution(record)],
      unresolvedEvidenceCount: 0,
      lowTraffic: false,
    });
    expect(evaluation.successfulAuthoritativeExecutions).toBe(4);
    expect(evaluation.state).toBe('open');
  });

  it('does not count an execution bound to a different candidate SHA', () => {
    const record = fixtureWindowRecord();
    const foreign = execution(record, { candidateSha: 'b'.repeat(40) });
    const evaluation = evaluateRollbackWindow(record, {
      evaluatedAt: '2026-07-20T00:00:00.000Z',
      executions: [foreign, execution(record), execution(record), execution(record), execution(record)],
      unresolvedEvidenceCount: 0,
      lowTraffic: false,
    });
    expect(evaluation.successfulAuthoritativeExecutions).toBe(4);
  });

  it('does not count an execution bound to a different (non-post-cutover) authority epoch', () => {
    const record = fixtureWindowRecord();
    const foreign = execution(record, { authorityEpoch: record.openingAuthorityEpoch });
    const evaluation = evaluateRollbackWindow(record, {
      evaluatedAt: '2026-07-20T00:00:00.000Z',
      executions: [foreign, execution(record), execution(record), execution(record), execution(record)],
      unresolvedEvidenceCount: 0,
      lowTraffic: false,
    });
    expect(evaluation.successfulAuthoritativeExecutions).toBe(4);
  });

  it('does not count an execution observed before the window opened (stale)', () => {
    const record = fixtureWindowRecord();
    const stale = execution(record, { observedAt: '2026-06-15T00:00:00.000Z' });
    const evaluation = evaluateRollbackWindow(record, {
      evaluatedAt: '2026-07-20T00:00:00.000Z',
      executions: [stale, execution(record), execution(record), execution(record), execution(record)],
      unresolvedEvidenceCount: 0,
      lowTraffic: false,
    });
    expect(evaluation.successfulAuthoritativeExecutions).toBe(4);
  });

  it('does not count an execution observed after the evaluation instant (premature)', () => {
    const record = fixtureWindowRecord();
    const premature = execution(record, { observedAt: '2026-08-01T00:00:00.000Z' });
    const evaluation = evaluateRollbackWindow(record, {
      evaluatedAt: '2026-07-20T00:00:00.000Z',
      executions: [premature, execution(record), execution(record), execution(record), execution(record)],
      unresolvedEvidenceCount: 0,
      lowTraffic: false,
    });
    expect(evaluation.successfulAuthoritativeExecutions).toBe(4);
  });
});

// ───────────────────────────────────────────────────────────────────
// 6. MONITORED SIGNALS
// ───────────────────────────────────────────────────────────────────

const SIGNAL_EVALUATED_AT = '2026-07-20T00:00:00.000Z';
const SIGNAL_CONTEXT = Object.freeze({ mode: MODE, windowOpenedAt: WINDOW_OPENED_AT, evaluatedAt: SIGNAL_EVALUATED_AT });

function reading(overrides: Readonly<Partial<MonitoredSignalReading>> = {}): MonitoredSignalReading {
  return {
    mode: MODE,
    family: 'health',
    severity: 'clear',
    observedAt: '2026-07-10T00:00:00.000Z',
    evidenceDigest: digest(`signal-${Math.random()}`),
    reasonCode: null,
    ...overrides,
  };
}

/** One fresh, distinct, in-window reading per declared family — the minimum a clean batch requires. */
function allFamilyReadings(
  overrides: Readonly<Partial<Record<MonitoredSignalFamily, Partial<MonitoredSignalReading>>>> = {},
): MonitoredSignalReading[] {
  return MonitoredSignalFamilies.map((family) => reading({
    family,
    evidenceDigest: digest(`signal-${family}`),
    ...(overrides[family] ?? {}),
  }));
}

describe('evaluateMonitoredSignals', () => {
  it('continues when every declared family reports a fresh, in-window, single-mode clear reading', () => {
    const decision = evaluateMonitoredSignals(allFamilyReadings(), SIGNAL_CONTEXT);
    expect(decision.decision).toBe('continue');
  });

  it('extends when a family reports a warning', () => {
    const decision = evaluateMonitoredSignals(
      allFamilyReadings({ receipt: { severity: 'warning', reasonCode: 'RECEIPT_DELAYED' } }),
      SIGNAL_CONTEXT,
    );
    expect(decision.decision).toBe('extend');
    expect(decision.triggeredBy).toEqual(['receipt']);
    expect(decision.reasonCodes).toEqual(['RECEIPT_DELAYED']);
  });

  it('reverts when a family reports revert severity', () => {
    const decision = evaluateMonitoredSignals(
      allFamilyReadings({
        'parity-drift': { severity: 'revert', reasonCode: 'PARITY_DRIFT_CRITICAL' },
        health: { severity: 'warning' },
      }),
      SIGNAL_CONTEXT,
    );
    expect(decision.decision).toBe('revert');
    expect(decision.triggeredBy).toEqual(['parity-drift']);
  });

  it('stops for an operator when one family reports contradictory severities', () => {
    const decision = evaluateMonitoredSignals(
      [...allFamilyReadings(), reading({ family: 'budget', severity: 'revert', evidenceDigest: digest('budget-second') })],
      SIGNAL_CONTEXT,
    );
    expect(decision.decision).toBe('operator_stop');
    expect(decision.reasonCodes).toEqual(['SIGNAL_CONTRADICTORY']);
  });

  it('stops for an operator on a malformed reading', () => {
    const decision = evaluateMonitoredSignals([{ ...reading(), family: 'not-a-family' } as never], SIGNAL_CONTEXT);
    expect(decision.decision).toBe('operator_stop');
    expect(decision.reasonCodes).toEqual(['SIGNAL_MALFORMED']);
  });

  it('stops for an operator on an empty signal batch rather than treating no evidence as clean', () => {
    const decision = evaluateMonitoredSignals([], SIGNAL_CONTEXT);
    expect(decision.decision).toBe('operator_stop');
    expect(decision.reasonCodes).toEqual(['SIGNAL_INCOMPLETE_FAMILIES']);
  });

  it('stops for an operator when a declared family has no reading at all', () => {
    const missingOne = allFamilyReadings().filter((entry) => entry.family !== 'authorization');
    const decision = evaluateMonitoredSignals(missingOne, SIGNAL_CONTEXT);
    expect(decision.decision).toBe('operator_stop');
    expect(decision.reasonCodes).toEqual(['SIGNAL_INCOMPLETE_FAMILIES']);
  });

  it('stops for an operator on a duplicate evidence digest reused across two families', () => {
    const base = allFamilyReadings();
    const withDuplicate = base.map((entry, index) => (
      index === 1 ? { ...entry, evidenceDigest: base[0].evidenceDigest } : entry
    ));
    const decision = evaluateMonitoredSignals(withDuplicate, SIGNAL_CONTEXT);
    expect(decision.decision).toBe('operator_stop');
    expect(decision.reasonCodes).toEqual(['SIGNAL_DUPLICATE']);
  });

  it('stops for an operator on a reading bound to a different mode (cross-mode substitution)', () => {
    const foreign = allFamilyReadings({ health: { mode: 'deep-review' } });
    const decision = evaluateMonitoredSignals(foreign, SIGNAL_CONTEXT);
    expect(decision.decision).toBe('operator_stop');
    expect(decision.reasonCodes).toEqual(['SIGNAL_CROSS_MODE']);
  });

  it('stops for an operator on a reading dated before the window opened (stale)', () => {
    const stale = allFamilyReadings({ health: { observedAt: '2026-06-01T00:00:00.000Z' } });
    const decision = evaluateMonitoredSignals(stale, SIGNAL_CONTEXT);
    expect(decision.decision).toBe('operator_stop');
    expect(decision.reasonCodes).toEqual(['SIGNAL_STALE']);
  });

  it('stops for an operator on a reading dated after the evaluation instant (premature)', () => {
    const premature = allFamilyReadings({ health: { observedAt: '2026-08-01T00:00:00.000Z' } });
    const decision = evaluateMonitoredSignals(premature, SIGNAL_CONTEXT);
    expect(decision.decision).toBe('operator_stop');
    expect(decision.reasonCodes).toEqual(['SIGNAL_STALE']);
  });
});

// ───────────────────────────────────────────────────────────────────
// 7. REVERT RECORD
// ───────────────────────────────────────────────────────────────────

describe('buildRollbackRevertRecord', () => {
  function revertDecision() {
    return evaluateMonitoredSignals(
      allFamilyReadings({ health: { severity: 'revert', reasonCode: 'HEALTH_CRITICAL' } }),
      SIGNAL_CONTEXT,
    );
  }

  it('records a well-formed, non-destructive revert', () => {
    const record = fixtureWindowRecord();
    const result = buildRollbackRevertRecord({
      windowRecord: record,
      triggerDecision: revertDecision(),
      admissionsFrozenAt: '2026-07-05T00:00:00.000Z',
      spineFencedAt: '2026-07-05T00:00:05.000Z',
      reconciliationDigest: digest('reconciliation'),
      restoredAuthorityEpoch: record.openingAuthorityEpoch + 1,
      retainedEventCountBefore: 42,
      retainedEventCountAfter: 42,
      retainedArtifactCountBefore: 7,
      retainedArtifactCountAfter: 7,
      rollbackCertificateDigest: digest('rollback-certificate'),
    });
    expect(result.verdict).toBe('recorded');
    if (result.verdict !== 'recorded') throw new Error('expected recorded');
    expect(result.record.restoredAuthorityState).toBe('legacy_authoritative');
    expect(result.record.eventDeletionCount).toBe(0);
    expect(result.record.artifactRewriteCount).toBe(0);
  });

  it('rejects a decision that is not a revert', () => {
    const record = fixtureWindowRecord();
    const result = buildRollbackRevertRecord({
      windowRecord: record,
      triggerDecision: evaluateMonitoredSignals(allFamilyReadings(), SIGNAL_CONTEXT),
      admissionsFrozenAt: '2026-07-05T00:00:00.000Z',
      spineFencedAt: '2026-07-05T00:00:05.000Z',
      reconciliationDigest: digest('reconciliation'),
      restoredAuthorityEpoch: record.openingAuthorityEpoch + 1,
      retainedEventCountBefore: 42,
      retainedEventCountAfter: 42,
      retainedArtifactCountBefore: 7,
      retainedArtifactCountAfter: 7,
      rollbackCertificateDigest: digest('rollback-certificate'),
    });
    expect(result).toEqual({ verdict: 'rejected', reasonCode: 'STALE_TRIGGER_DECISION' });
  });

  it('rejects a retained-event count that drifted (destructive rollback)', () => {
    const record = fixtureWindowRecord();
    const result = buildRollbackRevertRecord({
      windowRecord: record,
      triggerDecision: revertDecision(),
      admissionsFrozenAt: '2026-07-05T00:00:00.000Z',
      spineFencedAt: '2026-07-05T00:00:05.000Z',
      reconciliationDigest: digest('reconciliation'),
      restoredAuthorityEpoch: record.openingAuthorityEpoch + 1,
      retainedEventCountBefore: 42,
      retainedEventCountAfter: 41,
      retainedArtifactCountBefore: 7,
      retainedArtifactCountAfter: 7,
      rollbackCertificateDigest: digest('rollback-certificate'),
    });
    expect(result).toEqual({ verdict: 'rejected', reasonCode: 'DESTRUCTIVE_ROLLBACK_REJECTED' });
  });

  it('rejects a restored epoch that does not advance exactly one past the opening epoch', () => {
    const record = fixtureWindowRecord();
    const result = buildRollbackRevertRecord({
      windowRecord: record,
      triggerDecision: revertDecision(),
      admissionsFrozenAt: '2026-07-05T00:00:00.000Z',
      spineFencedAt: '2026-07-05T00:00:05.000Z',
      reconciliationDigest: digest('reconciliation'),
      restoredAuthorityEpoch: record.openingAuthorityEpoch + 2,
      retainedEventCountBefore: 42,
      retainedEventCountAfter: 42,
      retainedArtifactCountBefore: 7,
      retainedArtifactCountAfter: 7,
      rollbackCertificateDigest: digest('rollback-certificate'),
    });
    expect(result).toEqual({ verdict: 'rejected', reasonCode: 'RECORD_MALFORMED' });
  });
});

// ───────────────────────────────────────────────────────────────────
// 8. CLEAN CLOSURE
// ───────────────────────────────────────────────────────────────────

describe('closeRollbackWindow', () => {
  const provider = createHmacCertificationProvider({
    scheme: 'hmac-sha256',
    provider_id: 'cutover-certificate-tests',
    key_id: 'closure-key',
    verifier_version: '1',
    trust_scope: 'durable-cross-resume',
  }, 'a'.repeat(32));

  function eligibleExecutions(record: RollbackWindowRecord): RollbackWindowExecution[] {
    return [execution(record), execution(record), execution(record), execution(record), execution(record)];
  }

  it('closes and signs durable evidence once eligible with no unresolved signal, recomputed from raw evidence', async () => {
    const record = fixtureWindowRecord();
    const result = await closeRollbackWindow({
      windowRecord: record,
      executions: eligibleExecutions(record),
      unresolvedEvidenceCount: 0,
      lowTraffic: false,
      signalReadings: allFamilyReadings(),
      closureDecidedAt: '2026-07-20T00:05:00.000Z',
    }, provider);
    expect(result.verdict).toBe('closed');
    if (result.verdict !== 'closed') throw new Error('expected closed');
    expect(result.closure.facts.handoffReady).toBe(true);
    expect(result.closure.facts.successfulAuthoritativeExecutions).toBe(5);
    expect(result.closure.facts.signalDecision.decision).toBe('continue');
    const verified = await provider.verify(
      Uint8Array.from(canonicalBytes({
        facts: result.closure.facts,
        certification_profile: {
          scheme: result.closure.certification.scheme,
          provider_id: result.closure.certification.provider_id,
          key_id: result.closure.certification.key_id,
          verifier_version: result.closure.certification.verifier_version,
          trust_scope: result.closure.certification.trust_scope,
        },
      } as never)),
      Uint8Array.from(Buffer.from(result.closure.certification.signature_base64, 'base64')),
    );
    expect(verified).toBe(true);
  });

  it('refuses to close a window that is not yet eligible', async () => {
    const record = fixtureWindowRecord();
    const result = await closeRollbackWindow({
      windowRecord: record,
      executions: [],
      unresolvedEvidenceCount: 0,
      lowTraffic: false,
      signalReadings: allFamilyReadings(),
      closureDecidedAt: '2026-07-02T00:05:00.000Z',
    }, provider);
    expect(result).toEqual({ verdict: 'rejected', reasonCode: 'WINDOW_NOT_ELIGIBLE' });
  });

  it('refuses to close while a monitored signal is unresolved', async () => {
    const record = fixtureWindowRecord();
    const result = await closeRollbackWindow({
      windowRecord: record,
      executions: eligibleExecutions(record),
      unresolvedEvidenceCount: 0,
      lowTraffic: false,
      signalReadings: allFamilyReadings({ health: { severity: 'warning' } }),
      closureDecidedAt: '2026-07-20T00:05:00.000Z',
    }, provider);
    expect(result).toEqual({ verdict: 'rejected', reasonCode: 'UNRESOLVED_SIGNAL' });
  });

  it('refuses to close on an empty signal batch rather than treating no evidence as clean', async () => {
    const record = fixtureWindowRecord();
    const result = await closeRollbackWindow({
      windowRecord: record,
      executions: eligibleExecutions(record),
      unresolvedEvidenceCount: 0,
      lowTraffic: false,
      signalReadings: [],
      closureDecidedAt: '2026-07-20T00:05:00.000Z',
    }, provider);
    expect(result).toEqual({ verdict: 'rejected', reasonCode: 'UNRESOLVED_SIGNAL' });
  });

  it('refuses to close on executions submitted from a different window instance (cross-window substitution)', async () => {
    const record = fixtureWindowRecord();
    const otherWindow = fixtureWindowRecord({ openedAt: '2026-06-01T00:00:00.000Z' });
    const result = await closeRollbackWindow({
      windowRecord: record,
      executions: eligibleExecutions(otherWindow),
      unresolvedEvidenceCount: 0,
      lowTraffic: false,
      signalReadings: allFamilyReadings(),
      closureDecidedAt: '2026-07-20T00:05:00.000Z',
    }, provider);
    expect(result).toEqual({ verdict: 'rejected', reasonCode: 'WINDOW_NOT_ELIGIBLE' });
  });
});
