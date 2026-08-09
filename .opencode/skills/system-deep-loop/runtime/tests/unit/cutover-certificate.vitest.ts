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
  createHmacCertificationProvider,
} from '../../lib/receipts-and-effect-recovery/index.js';

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
  MonitoredSignalReading,
  RollbackWindowExecution,
  RollbackWindowRecord,
} from '../../lib/cutover-certificate/index.js';
import type {
  ClassificationEvidence,
  DispositionProof,
  InflightClassificationManifest,
  StateBackendCensus,
  StateBackendCensusRow,
} from '../../lib/inflight-state-classification/index.js';
import type { BoundaryReceiptPayload, CertificationEnvelope } from '../../lib/receipts-and-effect-recovery/index.js';
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

function fixtureCertification(): CertificationEnvelope {
  return Object.freeze({
    scheme: 'hmac-sha256',
    provider_id: 'cutover-certificate-tests',
    key_id: 'k1',
    verifier_version: '1',
    trust_scope: 'process-local-advisory',
    signed_digest: digest('signed'),
    signature_base64: Buffer.from('fixture-signature').toString('base64'),
  });
}

function fixtureBoundaryReceipt(label: string): BoundaryReceiptPayload {
  return Object.freeze({
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
    certification: fixtureCertification(),
  });
}

function fixtureRollbackDrillCertificate(
  overrides: Readonly<Partial<Record<'mode' | 'candidateSha' | 'passed' | 'classificationDigest', unknown>>> = {},
): RollbackDrillCertificate {
  return {
    facts: {
      mode: MODE,
      candidateSha: CANDIDATE_SHA,
      passed: true,
      classificationDigest: CLASSIFICATION_MANIFEST.finalDigest,
      ...overrides,
    },
    certification: fixtureCertification(),
    certificateDigest: digest('rollback-drill-certificate'),
  } as unknown as RollbackDrillCertificate;
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

function fixtureEvidence(
  overrides: Readonly<Partial<CutoverCertificateEvidenceSources>> = {},
): CutoverCertificateEvidenceSources {
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
    rollbackDrillCertificate: fixtureRollbackDrillCertificate(),
    mixedVersionReplay: fixtureMixedVersionReplay(),
    classificationManifest: CLASSIFICATION_MANIFEST,
    migrationReceipts: [fixtureBoundaryReceipt('one'), fixtureBoundaryReceipt('two')],
    approvingPolicy: fixturePolicy(),
    ...overrides,
  };
}

function fixtureRequest(
  overrides: Readonly<Partial<CutoverCertificateRequest>> = {},
): CutoverCertificateRequest {
  return {
    mode: MODE,
    candidateSha: CANDIDATE_SHA,
    fromAuthorityEpoch: AUTHORITY_EPOCH,
    issuer: 'cutover-certificate-tests',
    issuedAt: '2026-07-28T12:05:00Z',
    evidence: fixtureEvidence(),
    ...overrides,
  };
}

// ───────────────────────────────────────────────────────────────────
// 2. BUILD (assembly)
// ───────────────────────────────────────────────────────────────────

describe('buildCutoverCertificate', () => {
  it('issues a certificate from complete, consistent evidence', () => {
    const result = buildCutoverCertificate(fixtureRequest());
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

  it('rejects a candidate SHA that is not 40-hex', () => {
    const result = buildCutoverCertificate(fixtureRequest({ candidateSha: 'not-a-sha' }));
    expect(result).toEqual({ verdict: 'rejected', reasonCode: 'CANDIDATE_SHA_INVALID' });
  });

  it('rejects a non-positive authority epoch', () => {
    const result = buildCutoverCertificate(fixtureRequest({ fromAuthorityEpoch: 0 }));
    expect(result).toEqual({ verdict: 'rejected', reasonCode: 'AUTHORITY_EPOCH_INVALID' });
  });

  it('rejects a mode gate certificate bound to a different mode', () => {
    const evidence = fixtureEvidence({
      modeGateCertificate: {
        mode: 'deep-review',
        candidateSha: CANDIDATE_SHA,
        authorityEpoch: AUTHORITY_EPOCH,
        readiness: 'ready-for-phase-014-consideration',
        certificateDigest: digest('mode-gate-certificate'),
      },
    });
    const result = buildCutoverCertificate(fixtureRequest({ evidence }));
    expect(result).toEqual({ verdict: 'rejected', reasonCode: 'READINESS_NOT_READY' });
  });

  it('rejects a mode gate certificate that is not readiness-ready', () => {
    const evidence = fixtureEvidence({
      modeGateCertificate: {
        mode: MODE,
        candidateSha: CANDIDATE_SHA,
        authorityEpoch: AUTHORITY_EPOCH,
        readiness: 'not-ready',
        certificateDigest: digest('mode-gate-certificate'),
      },
    });
    const result = buildCutoverCertificate(fixtureRequest({ evidence }));
    expect(result).toEqual({ verdict: 'rejected', reasonCode: 'READINESS_NOT_READY' });
  });

  it('rejects shadow parity that is not green', () => {
    const evidence = fixtureEvidence({
      shadowParity: {
        mode: MODE,
        candidateSha: CANDIDATE_SHA,
        exitStatus: 'red',
        evidenceDigest: digest('shadow-parity-evidence'),
      },
    });
    const result = buildCutoverCertificate(fixtureRequest({ evidence }));
    expect(result).toEqual({ verdict: 'rejected', reasonCode: 'PARITY_NOT_GREEN' });
  });

  it('rejects a rollback drill certificate that did not pass', () => {
    const evidence = fixtureEvidence({
      rollbackDrillCertificate: fixtureRollbackDrillCertificate({ passed: false }),
    });
    const result = buildCutoverCertificate(fixtureRequest({ evidence }));
    expect(result).toEqual({ verdict: 'rejected', reasonCode: 'ROLLBACK_DRILL_NOT_PASSED' });
  });

  it('rejects a rollback drill certificate whose classification digest does not match the bound manifest', () => {
    const evidence = fixtureEvidence({
      rollbackDrillCertificate: fixtureRollbackDrillCertificate({ classificationDigest: digest('stale') }),
    });
    const result = buildCutoverCertificate(fixtureRequest({ evidence }));
    expect(result).toEqual({ verdict: 'rejected', reasonCode: 'ROLLBACK_DRILL_NOT_PASSED' });
  });

  it('rejects a mixed-version replay result that is not a clean pass', () => {
    const evidence = fixtureEvidence({
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
    const result = buildCutoverCertificate(fixtureRequest({ evidence }));
    expect(result).toEqual({ verdict: 'rejected', reasonCode: 'MIXED_VERSION_REPLAY_FAILED' });
  });

  it('rejects a tampered classification manifest', () => {
    // Mutate a core field while keeping finalDigest unchanged, so the
    // drill's classificationDigest binding still matches this manifest and
    // the rejection is attributable to manifest integrity, not the binding.
    const tampered = {
      ...CLASSIFICATION_MANIFEST,
      classificationId: `${CLASSIFICATION_MANIFEST.classificationId}-tampered`,
    };
    const evidence = fixtureEvidence({ classificationManifest: tampered });
    const result = buildCutoverCertificate(fixtureRequest({ evidence }));
    expect(result).toEqual({ verdict: 'rejected', reasonCode: 'CLASSIFICATION_MANIFEST_INVALID' });
  });

  it('rejects an empty migration receipt set', () => {
    const evidence = fixtureEvidence({ migrationReceipts: [] });
    const result = buildCutoverCertificate(fixtureRequest({ evidence }));
    expect(result).toEqual({ verdict: 'rejected', reasonCode: 'MIGRATION_RECEIPT_INVALID' });
  });

  it('rejects migration receipts with a duplicate evidence digest', () => {
    const receipt = fixtureBoundaryReceipt('dup');
    const evidence = fixtureEvidence({ migrationReceipts: [receipt, receipt] });
    const result = buildCutoverCertificate(fixtureRequest({ evidence }));
    expect(result).toEqual({ verdict: 'rejected', reasonCode: 'MIGRATION_RECEIPT_INVALID' });
  });
});

// ───────────────────────────────────────────────────────────────────
// 3. VERIFY
// ───────────────────────────────────────────────────────────────────

describe('verifyCutoverCertificate', () => {
  function issuedCertificate() {
    const result = buildCutoverCertificate(fixtureRequest());
    if (result.verdict !== 'issued') throw new Error('fixture certificate failed to issue');
    return result.certificate;
  }

  it('accepts a certificate that exactly matches the expectation', () => {
    const certificate = issuedCertificate();
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

  it('rejects a certificate whose digest was tampered', () => {
    const certificate = issuedCertificate();
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

  it('rejects a candidate SHA that does not match the expectation', () => {
    const certificate = issuedCertificate();
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

  it('rejects an approving policy that does not match the expectation', () => {
    const certificate = issuedCertificate();
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

    const buildResult = buildCutoverCertificate(fixtureRequest());
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
    const buildResult = buildCutoverCertificate(fixtureRequest());
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
    const buildResult = buildCutoverCertificate(fixtureRequest());
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

function fixtureWindowRecord(): RollbackWindowRecord {
  return openRollbackWindow({
    mode: MODE,
    cutoverCertificateDigest: digest('cutover-certificate'),
    rollbackAnchorDigest: digest('rollback-anchor'),
    retainedLegacyAssetDigests: [digest('legacy-adapter'), digest('legacy-state')],
    openedAt: '2026-07-01T00:00:00.000Z',
    openingAuthorityEpoch: AUTHORITY_EPOCH,
  });
}

function execution(overrides: Readonly<Partial<RollbackWindowExecution>> = {}): RollbackWindowExecution {
  return {
    executionId: digest(`execution-${Math.random()}`),
    authorityState: 'new_authoritative_reversible',
    authorityEpoch: AUTHORITY_EPOCH + 1,
    result: 'trusted-completion',
    certificateDigest: digest(`certificate-${Math.random()}`),
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
      rollbackAnchorDigest: 'not-a-digest',
      retainedLegacyAssetDigests: [],
      openedAt: '2026-07-01T00:00:00.000Z',
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
      executions: [execution(), execution(), execution()],
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
      executions: [execution(), execution(), execution(), execution(), execution()],
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
      executions: [execution(), execution(), execution(), execution(), execution()],
      unresolvedEvidenceCount: 0,
      lowTraffic: true,
    });
    expect(evaluation.state).toBe('extended');
  });

  it('extends when a signal has an unresolved evidence count', () => {
    const record = fixtureWindowRecord();
    const evaluation = evaluateRollbackWindow(record, {
      evaluatedAt: '2026-07-20T00:00:00.000Z',
      executions: [execution(), execution(), execution(), execution(), execution()],
      unresolvedEvidenceCount: 2,
      lowTraffic: false,
    });
    expect(evaluation.state).toBe('extended');
  });

  it('folds executions that share an identity link into one credit', () => {
    const record = fixtureWindowRecord();
    const sharedCertificate = digest('shared-certificate');
    const linked = [
      execution({ executionId: 'run-1', certificateDigest: sharedCertificate }),
      execution({ executionId: 'run-2', certificateDigest: sharedCertificate }),
    ];
    const evaluation = evaluateRollbackWindow(record, {
      evaluatedAt: '2026-07-20T00:00:00.000Z',
      executions: [...linked, execution(), execution(), execution()],
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
});

// ───────────────────────────────────────────────────────────────────
// 6. MONITORED SIGNALS
// ───────────────────────────────────────────────────────────────────

function reading(overrides: Readonly<Partial<MonitoredSignalReading>> = {}): MonitoredSignalReading {
  return {
    family: 'health',
    severity: 'clear',
    observedAt: '2026-07-10T00:00:00.000Z',
    evidenceDigest: digest('signal'),
    reasonCode: null,
    ...overrides,
  };
}

describe('evaluateMonitoredSignals', () => {
  it('continues when every family is clear', () => {
    const decision = evaluateMonitoredSignals([reading(), reading({ family: 'parity-drift' })]);
    expect(decision.decision).toBe('continue');
  });

  it('extends when a family reports a warning', () => {
    const decision = evaluateMonitoredSignals([reading({ family: 'receipt', severity: 'warning', reasonCode: 'RECEIPT_DELAYED' })]);
    expect(decision.decision).toBe('extend');
    expect(decision.triggeredBy).toEqual(['receipt']);
    expect(decision.reasonCodes).toEqual(['RECEIPT_DELAYED']);
  });

  it('reverts when a family reports revert severity', () => {
    const decision = evaluateMonitoredSignals([
      reading({ family: 'parity-drift', severity: 'revert', reasonCode: 'PARITY_DRIFT_CRITICAL' }),
      reading({ family: 'health', severity: 'warning' }),
    ]);
    expect(decision.decision).toBe('revert');
    expect(decision.triggeredBy).toEqual(['parity-drift']);
  });

  it('stops for an operator when one family reports contradictory severities', () => {
    const decision = evaluateMonitoredSignals([
      reading({ family: 'budget', severity: 'clear' }),
      reading({ family: 'budget', severity: 'revert' }),
    ]);
    expect(decision.decision).toBe('operator_stop');
    expect(decision.reasonCodes).toEqual(['SIGNAL_CONTRADICTORY']);
  });

  it('stops for an operator on a malformed reading', () => {
    const decision = evaluateMonitoredSignals([{ ...reading(), family: 'not-a-family' } as never]);
    expect(decision.decision).toBe('operator_stop');
    expect(decision.reasonCodes).toEqual(['SIGNAL_MALFORMED']);
  });

  it('continues on an empty signal batch', () => {
    const decision = evaluateMonitoredSignals([]);
    expect(decision.decision).toBe('continue');
  });
});

// ───────────────────────────────────────────────────────────────────
// 7. REVERT RECORD
// ───────────────────────────────────────────────────────────────────

describe('buildRollbackRevertRecord', () => {
  function revertDecision() {
    return evaluateMonitoredSignals([reading({ family: 'health', severity: 'revert', reasonCode: 'HEALTH_CRITICAL' })]);
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
      triggerDecision: evaluateMonitoredSignals([reading()]),
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

  function eligibleEvaluation() {
    const record = fixtureWindowRecord();
    return {
      record,
      evaluation: evaluateRollbackWindow(record, {
        evaluatedAt: '2026-07-20T00:00:00.000Z',
        executions: [execution(), execution(), execution(), execution(), execution()],
        unresolvedEvidenceCount: 0,
        lowTraffic: false,
      }),
    };
  }

  it('closes and signs durable evidence once eligible with no unresolved signal', async () => {
    const { record, evaluation } = eligibleEvaluation();
    const result = await closeRollbackWindow({
      windowRecord: record,
      evaluation,
      signalDecision: evaluateMonitoredSignals([reading()]),
      closureDecidedAt: '2026-07-20T00:05:00.000Z',
    }, provider);
    expect(result.verdict).toBe('closed');
    if (result.verdict !== 'closed') throw new Error('expected closed');
    expect(result.closure.facts.handoffReady).toBe(true);
    expect(result.closure.facts.successfulAuthoritativeExecutions).toBe(5);
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
    const evaluation = evaluateRollbackWindow(record, {
      evaluatedAt: '2026-07-02T00:00:00.000Z',
      executions: [],
      unresolvedEvidenceCount: 0,
      lowTraffic: false,
    });
    const result = await closeRollbackWindow({
      windowRecord: record,
      evaluation,
      signalDecision: evaluateMonitoredSignals([reading()]),
      closureDecidedAt: '2026-07-02T00:05:00.000Z',
    }, provider);
    expect(result).toEqual({ verdict: 'rejected', reasonCode: 'WINDOW_NOT_ELIGIBLE' });
  });

  it('refuses to close while a monitored signal is unresolved', async () => {
    const { record, evaluation } = eligibleEvaluation();
    const result = await closeRollbackWindow({
      windowRecord: record,
      evaluation,
      signalDecision: evaluateMonitoredSignals([reading({ severity: 'warning' })]),
      closureDecidedAt: '2026-07-20T00:05:00.000Z',
    }, provider);
    expect(result).toEqual({ verdict: 'rejected', reasonCode: 'UNRESOLVED_SIGNAL' });
  });
});
