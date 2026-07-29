// ───────────────────────────────────────────────────────────────────
// MODULE: Model Benchmark Rollback Switch
// ───────────────────────────────────────────────────────────────────

import { canonicalBytes, sha256Bytes } from '../event-envelope/index.js';
import { verifyClassificationManifest } from '../inflight-state-classification/index.js';
import {
  AtomicityDomains,
  ProtectedResourceKinds,
  canonicalizeProtectedResource,
  validateOpaqueIdentity,
} from '../locks-and-fencing/index.js';
import { parseModelBenchmarkResumeDecision } from '../model-benchmark-resume-adapter/index.js';

import { ModelBenchmarkModeMigrationGate } from './mode-gate.js';
import { MODEL_BENCHMARK_ROLLBACK_GATE_SCHEMA_VERSION } from './types.js';

import type { TransitionAuthorizationRequest } from '../authorized-ledger/index.js';
import type { JsonObject } from '../event-envelope/index.js';
import type { CanonicalProtectedResource, FencedLease } from '../locks-and-fencing/index.js';
import type {
  ModelBenchmarkModeMigrationCertificate,
  ModelBenchmarkRollbackCertificate,
  ModelBenchmarkRollbackDecision,
  ModelBenchmarkRollbackDenialReasonCode,
  ModelBenchmarkRollbackOperation,
  ModelBenchmarkRollbackRequest,
  ModelBenchmarkRollbackSwitchOptions,
} from './types.js';

interface ValidatedStaleWriterLease {
  readonly snapshot: FencedLease;
  readonly digest: string;
}

const HEX_64 = /^[a-f0-9]{64}$/u;
const TOKEN = /^[A-Za-z0-9][A-Za-z0-9._:/@+-]{0,255}$/u;
const REQUEST_KEYS = new Set([
  'configurationVersion',
  'operation',
  'currentAuthority',
  'expectedAuthorityEpoch',
  'gateCertificate',
  'gateInput',
  'authorizationRequest',
  'rollbackReason',
  'admissionState',
  'classificationManifest',
  'resumeEvidence',
  'writerResource',
  'staleWriterLease',
  'destructiveIntent',
  'retainedEventCountBefore',
  'retainedEventCountAfter',
  'retainedArtifactCountBefore',
  'retainedArtifactCountAfter',
  'rollbackAnchorDigest',
]);
const LEASE_KEYS = Object.freeze([
  'resource',
  'fenceToken',
  'leaseId',
  'ownerId',
  'correlationId',
  'acquiredAt',
  'renewedAt',
  'expiresAt',
] as const);
const AUTHORIZATION_REQUEST_KEYS = Object.freeze([
  'requestId',
  'mode',
  'event',
  'priorHead',
  'priorStateVersion',
  'priorStateFingerprint',
  'actorId',
  'capabilityId',
  'authorityEpoch',
  'policy',
  'evidenceDigest',
] as const);
const ALLOWED_AUTHORITY_STATES = new Set([
  'legacy_authoritative',
  'shadowing',
  'cutover_ready',
  'new_authoritative_reversible',
  'rollback_pending',
  'new_authoritative_final',
]);
const ALLOWED_ROLLBACK_OPERATIONS: ReadonlySet<ModelBenchmarkRollbackOperation> = new Set([
  'rollback',
  'unquarantine',
  'verifier-replacement',
  'authority-restoration',
]);
const MODEL_BENCHMARK_LEDGER_WRITER_RESOURCE = canonicalizeProtectedResource({
  kind: ProtectedResourceKinds.WRITER,
  components: { writerId: 'model-benchmark-ledger-writer' },
  atomicityDomain: AtomicityDomains.SINGLE_HOST_FILESYSTEM,
});

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value as JsonObject));
}

function isPlainRecord<T>(value: T): value is T & Record<string, unknown> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function hasExactKeys(value: object, keys: readonly string[]): boolean {
  const actual = Object.keys(value);
  const expected = new Set(keys);
  return actual.length === keys.length && actual.every((key) => expected.has(key));
}

function denied(
  reasonCode: ModelBenchmarkRollbackDenialReasonCode,
): ModelBenchmarkRollbackDecision {
  return Object.freeze({
    disposition: 'denied',
    authorityState: 'legacy_authoritative',
    ledgerAuthority: 'denied',
    reasonCode,
    gatewayDecisionId: null,
    certificate: null,
  });
}

function validCount(value: unknown): value is number {
  return Number.isSafeInteger(value) && (value as number) >= 0;
}

function validateStaleWriterLease(value: unknown): ValidatedStaleWriterLease {
  if (!isPlainRecord(value) || !hasExactKeys(value, LEASE_KEYS)) {
    throw new TypeError('Stale writer lease must use the closed lease shape');
  }
  const resource = canonicalizeProtectedResource(value.resource);
  validateOpaqueIdentity(value.leaseId, 'leaseId');
  validateOpaqueIdentity(value.ownerId, 'ownerId');
  validateOpaqueIdentity(value.correlationId, 'correlationId');
  if (!Number.isSafeInteger(value.fenceToken) || (value.fenceToken as number) <= 0) {
    throw new TypeError('Stale writer fence token must be a positive safe integer');
  }
  const acquiredAt = typeof value.acquiredAt === 'string' ? Date.parse(value.acquiredAt) : NaN;
  const renewedAt = typeof value.renewedAt === 'string' ? Date.parse(value.renewedAt) : NaN;
  const expiresAt = typeof value.expiresAt === 'string' ? Date.parse(value.expiresAt) : NaN;
  if (
    !Number.isFinite(acquiredAt)
    || !Number.isFinite(renewedAt)
    || !Number.isFinite(expiresAt)
    || renewedAt < acquiredAt
    || expiresAt <= renewedAt
  ) throw new TypeError('Stale writer lease timestamps must be monotonic');
  const snapshot: FencedLease = Object.freeze({
    resource,
    fenceToken: value.fenceToken as number,
    leaseId: value.leaseId as string,
    ownerId: value.ownerId as string,
    correlationId: value.correlationId as string,
    acquiredAt: value.acquiredAt as string,
    renewedAt: value.renewedAt as string,
    expiresAt: value.expiresAt as string,
  });
  return Object.freeze({ snapshot, digest: digest(snapshot) });
}

function validateResumeEvidence(
  input: NonNullable<ModelBenchmarkRollbackRequest['resumeEvidence']>,
): Readonly<{
  value: NonNullable<ModelBenchmarkRollbackRequest['resumeEvidence']>;
  digest: string;
}> {
  if (!isPlainRecord(input) || !hasExactKeys(input, [
    'legacyDecision',
    'ledgerDecision',
    'legacyEventTailDigest',
    'ledgerEventTailDigest',
    'legacyFreshProjectionFingerprint',
    'ledgerFreshProjectionFingerprint',
  ])) throw new TypeError('Resume evidence must use the closed parity shape');
  const legacyDecision = parseModelBenchmarkResumeDecision(input.legacyDecision);
  const ledgerDecision = parseModelBenchmarkResumeDecision(input.ledgerDecision);
  for (const field of [
    'legacyEventTailDigest',
    'ledgerEventTailDigest',
    'legacyFreshProjectionFingerprint',
    'ledgerFreshProjectionFingerprint',
  ] as const) {
    if (!HEX_64.test(input[field])) throw new TypeError('Resume evidence digest is malformed');
  }
  const value = Object.freeze({
    legacyDecision,
    ledgerDecision,
    legacyEventTailDigest: input.legacyEventTailDigest,
    ledgerEventTailDigest: input.ledgerEventTailDigest,
    legacyFreshProjectionFingerprint: input.legacyFreshProjectionFingerprint,
    ledgerFreshProjectionFingerprint: input.ledgerFreshProjectionFingerprint,
  });
  return Object.freeze({ value, digest: digest(value) });
}

function snapshotAuthorizationRequest(value: unknown): TransitionAuthorizationRequest {
  if (!isPlainRecord(value) || !hasExactKeys(value, AUTHORIZATION_REQUEST_KEYS)) {
    throw new TypeError('Authorization request must use the closed gateway shape');
  }
  const before = digest(value);
  const snapshot = structuredClone(value) as unknown as TransitionAuthorizationRequest;
  if (digest(snapshot) !== before) {
    throw new TypeError('Authorization request changed while it was snapshotted');
  }
  return Object.freeze(snapshot);
}

async function reverifyMigrationCertificate(
  certificate: ModelBenchmarkModeMigrationCertificate | null | undefined,
  gateInput: ModelBenchmarkRollbackRequest['gateInput'],
): Promise<ModelBenchmarkModeMigrationCertificate | null> {
  if (certificate === null || certificate === undefined) return null;
  try {
    const { certificateDigest, ...core } = certificate;
    const internallyValid = certificate.schemaVersion
        === MODEL_BENCHMARK_ROLLBACK_GATE_SCHEMA_VERSION
      && certificate.certificateKind === 'mode-migration-readiness'
      && certificate.mode === 'model-benchmark'
      && certificate.readiness === 'ready-for-phase-014-consideration'
      && certificate.authorityState === 'legacy_authoritative'
      && certificate.authorityMutation === false
      && certificate.rollbackWindowClosed === false
      && certificate.cutoverCertificate === false
      && certificate.selectionApplied === false
      && certificate.legacyWriterRetired === false
      && HEX_64.test(certificateDigest)
      && digest(core) === certificateDigest;
    if (!internallyValid || gateInput === undefined) return null;
    const reverified = await new ModelBenchmarkModeMigrationGate().evaluate(gateInput);
    return reverified.verdict === 'pass'
      && reverified.certificate?.certificateDigest === certificateDigest
      ? reverified.certificate : null;
  } catch {
    return null;
  }
}

export class ModelBenchmarkRollbackSwitch {
  readonly #options: ModelBenchmarkRollbackSwitchOptions;

  public constructor(options: ModelBenchmarkRollbackSwitchOptions) {
    this.#options = options;
  }

  public async requestRollback(
    input: ModelBenchmarkRollbackRequest,
  ): Promise<ModelBenchmarkRollbackDecision> {
    let prepared: Readonly<{
      operation: ModelBenchmarkRollbackOperation;
      authorizationRequest: TransitionAuthorizationRequest;
      rollbackReason: string;
      classificationDigest: string;
      resumeEvidenceDigest: string;
      writerResource: CanonicalProtectedResource;
      staleWriterLease: FencedLease;
      rollbackAnchorDigest: string;
      retainedEventCountAfter: number;
      retainedArtifactCountAfter: number;
    }>;
    try {
      if (!isPlainRecord(input) || Object.keys(input).some((key) => !REQUEST_KEYS.has(key))) {
        return denied('EVIDENCE_INCOMPLETE');
      }
      if (!input.configurationVersion || !TOKEN.test(input.configurationVersion)) {
        return denied('MISSING_CONFIGURATION');
      }
      if (
        !input.operation
        || !ALLOWED_ROLLBACK_OPERATIONS.has(input.operation)
        || !isPlainRecord(input.currentAuthority)
        || !hasExactKeys(input.currentAuthority, ['state', 'epoch'])
        || !ALLOWED_AUTHORITY_STATES.has(input.currentAuthority.state)
        || !Number.isSafeInteger(input.currentAuthority.epoch)
        || input.currentAuthority.epoch <= 0
      ) return denied('UNKNOWN_STATE');
      if (
        !Number.isSafeInteger(input.expectedAuthorityEpoch)
        || input.expectedAuthorityEpoch !== input.currentAuthority.epoch
      ) return denied('STALE_AUTHORITY_EPOCH');
      const gateCertificate = await reverifyMigrationCertificate(
        input.gateCertificate,
        input.gateInput,
      );
      if (gateCertificate === null) return denied('ABSENT_GATE_CERTIFICATE');
      if (
        input.authorizationRequest === undefined
        || typeof input.rollbackReason !== 'string'
        || input.rollbackReason.length === 0
        || input.rollbackReason.length > 1_024
        || input.admissionState !== 'frozen'
        || input.classificationManifest === undefined
        || !verifyClassificationManifest(input.classificationManifest)
        || input.resumeEvidence === undefined
        || input.writerResource === undefined
        || input.staleWriterLease === undefined
        || typeof input.rollbackAnchorDigest !== 'string'
        || !HEX_64.test(input.rollbackAnchorDigest)
        || !validCount(input.retainedEventCountBefore)
        || !validCount(input.retainedEventCountAfter)
        || !validCount(input.retainedArtifactCountBefore)
        || !validCount(input.retainedArtifactCountAfter)
      ) return denied('EVIDENCE_INCOMPLETE');
      if (input.rollbackAnchorDigest !== gateCertificate.rollbackAnchorDigest) {
        return denied('EVIDENCE_INCOMPLETE');
      }
      if (
        input.destructiveIntent !== 'none'
        || input.retainedEventCountAfter !== input.retainedEventCountBefore
        || input.retainedArtifactCountAfter !== input.retainedArtifactCountBefore
      ) return denied('DESTRUCTIVE_ROLLBACK_REJECTED');

      const writerResource = canonicalizeProtectedResource(input.writerResource);
      let staleWriterLease: ValidatedStaleWriterLease;
      try {
        staleWriterLease = validateStaleWriterLease(input.staleWriterLease);
      } catch {
        return denied('WRITER_FENCE_FAILED');
      }
      const resumeEvidence = validateResumeEvidence(input.resumeEvidence);
      const authorizationRequest = snapshotAuthorizationRequest(input.authorizationRequest);
      const classificationDigest = input.classificationManifest.finalDigest;
      const boundEvidenceDigest = digest({
        configurationVersion: input.configurationVersion,
        operation: input.operation,
        rollbackReason: input.rollbackReason,
        currentAuthorityState: input.currentAuthority.state,
        currentAuthorityEpoch: input.currentAuthority.epoch,
        gateCertificateDigest: gateCertificate.certificateDigest,
        classificationDigest,
        resumeEvidenceDigest: resumeEvidence.digest,
        writerResourceDigest: writerResource.resourceDigest,
        staleWriterLeaseDigest: staleWriterLease.digest,
        rollbackAnchorDigest: input.rollbackAnchorDigest,
        retainedEventCountBefore: input.retainedEventCountBefore,
        retainedEventCountAfter: input.retainedEventCountAfter,
        retainedArtifactCountBefore: input.retainedArtifactCountBefore,
        retainedArtifactCountAfter: input.retainedArtifactCountAfter,
      });
      if (
        authorizationRequest.mode !== 'model-benchmark'
        || authorizationRequest.authorityEpoch !== input.currentAuthority.epoch
        || authorizationRequest.evidenceDigest !== boundEvidenceDigest
      ) return denied('EVIDENCE_INCOMPLETE');
      if (
        writerResource.resourceDigest !== MODEL_BENCHMARK_LEDGER_WRITER_RESOURCE.resourceDigest
        || staleWriterLease.snapshot.resource.resourceDigest !== writerResource.resourceDigest
      ) return denied('WRITER_FENCE_FAILED');
      prepared = Object.freeze({
        operation: input.operation,
        authorizationRequest,
        rollbackReason: input.rollbackReason,
        classificationDigest,
        resumeEvidenceDigest: resumeEvidence.digest,
        writerResource,
        staleWriterLease: staleWriterLease.snapshot,
        rollbackAnchorDigest: input.rollbackAnchorDigest,
        retainedEventCountAfter: input.retainedEventCountAfter,
        retainedArtifactCountAfter: input.retainedArtifactCountAfter,
      });
    } catch {
      return denied('EVIDENCE_INCOMPLETE');
    }

    let authorization;
    try {
      authorization = await this.#options.gateway.authorize(prepared.authorizationRequest);
    } catch {
      return denied('GATEWAY_FAILURE');
    }
    if (authorization.verdict !== 'allow') {
      return Object.freeze({
        ...denied(authorization.reasonCode === 'gateway_failure'
          ? 'GATEWAY_FAILURE' : 'AUTHORIZATION_DENIED'),
        gatewayDecisionId: authorization.decision?.decision_id ?? null,
      });
    }
    if (
      authorization.decision.mode !== 'model-benchmark'
      || authorization.decision.authority_epoch !== prepared.authorizationRequest.authorityEpoch
      || authorization.decision.evidence_digest !== prepared.authorizationRequest.evidenceDigest
    ) return denied('AUTHORIZATION_DENIED');

    let writerFenceToken: number;
    try {
      const rollbackLease = await this.#options.fencingCoordinator.acquire({
        resource: prepared.writerResource,
        ownerId: 'model-benchmark-external-rollback',
        correlationId: authorization.decision.decision_id,
        ttlMs: 60_000,
        acquireTimeoutMs: 1_000,
      });
      let superseded = false;
      try {
        writerFenceToken = rollbackLease.fenceToken;
        await this.#options.fencingCoordinator.withFence(rollbackLease, () => () => undefined);
        const durable = await this.#options.fencingCoordinator.inspect(prepared.writerResource);
        superseded = prepared.staleWriterLease.fenceToken > 0
          && prepared.staleWriterLease.fenceToken < writerFenceToken
          && prepared.staleWriterLease.fenceToken < durable.lastFenceToken
          && durable.lastFenceToken === writerFenceToken
          && durable.activeLease?.leaseId === rollbackLease.leaseId
          && durable.activeLease.fenceToken === writerFenceToken
          && durable.resource.resourceDigest === prepared.writerResource.resourceDigest;
      } finally {
        await this.#options.fencingCoordinator.release(rollbackLease);
      }
      if (!superseded) return denied('WRITER_FENCE_FAILED');
    } catch {
      return denied('WRITER_FENCE_FAILED');
    }

    const certificateCore = Object.freeze({
      schemaVersion: MODEL_BENCHMARK_ROLLBACK_GATE_SCHEMA_VERSION,
      certificateKind: 'non-destructive-rollback' as const,
      mode: 'model-benchmark' as const,
      operation: prepared.operation,
      policyVersion: String(authorization.decision.policy_version),
      decisionId: authorization.decision.decision_id,
      requestDigest: authorization.decision.request_digest,
      evidenceDigest: authorization.decision.evidence_digest,
      rollbackReason: prepared.rollbackReason,
      fromAuthorityState: authorization.decision.authority_state,
      fromAuthorityEpoch: authorization.decision.authority_epoch,
      restoredAuthorityState: 'legacy_authoritative' as const,
      restoredAuthorityEpoch: authorization.decision.authority_epoch + 1,
      writerFenceToken,
      writerResourceDigest: prepared.writerResource.resourceDigest,
      classificationDigest: prepared.classificationDigest,
      resumeEvidenceDigest: prepared.resumeEvidenceDigest,
      rollbackAnchorDigest: prepared.rollbackAnchorDigest,
      retainedEventCount: prepared.retainedEventCountAfter,
      retainedArtifactCount: prepared.retainedArtifactCountAfter,
      admissionFrozen: true as const,
      staleWriterDenied: true as const,
      eventDeletionCount: 0 as const,
      artifactRewriteCount: 0 as const,
      authorityMutation: false as const,
      phase014RestorationRequired: true as const,
    });
    const certificate: ModelBenchmarkRollbackCertificate = Object.freeze({
      ...certificateCore,
      certificateDigest: digest(certificateCore),
    });
    return Object.freeze({
      disposition: 'authorized',
      authorityState: 'legacy_authoritative',
      ledgerAuthority: 'denied',
      reasonCode: null,
      gatewayDecisionId: authorization.decision.decision_id,
      certificate,
    });
  }
}
