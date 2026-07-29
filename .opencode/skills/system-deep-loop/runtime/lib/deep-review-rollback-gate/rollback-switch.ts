// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Review Rollback Switch
// ───────────────────────────────────────────────────────────────────

import { canonicalBytes, sha256Bytes } from '../event-envelope/index.js';
import { verifyClassificationManifest } from '../inflight-state-classification/index.js';
import {
  AtomicityDomains,
  ProtectedResourceKinds,
  canonicalizeProtectedResource,
  validateOpaqueIdentity,
} from '../locks-and-fencing/index.js';

import { DeepReviewModeMigrationGate } from './mode-gate.js';
import {
  DEEP_REVIEW_ROLLBACK_GATE_SCHEMA_VERSION,
} from './types.js';

import type { JsonObject } from '../event-envelope/index.js';
import type { CanonicalProtectedResource } from '../locks-and-fencing/index.js';
import type {
  DeepReviewModeMigrationCertificate,
  DeepReviewRollbackCertificate,
  DeepReviewRollbackDecision,
  DeepReviewRollbackDenialReasonCode,
  DeepReviewRollbackOperation,
  DeepReviewRollbackRequest,
  DeepReviewRollbackSwitchOptions,
} from './types.js';

const HEX_64 = /^[a-f0-9]{64}$/u;
const TOKEN = /^[A-Za-z0-9][A-Za-z0-9._:/@-]{0,255}$/u;
const ALLOWED_AUTHORITY_STATES = new Set([
  'legacy_authoritative',
  'shadowing',
  'cutover_ready',
  'new_authoritative_reversible',
  'rollback_pending',
  'new_authoritative_final',
]);
const ALLOWED_ROLLBACK_OPERATIONS: ReadonlySet<DeepReviewRollbackOperation> = new Set([
  'rollback',
  'unquarantine',
  'verifier-replacement',
  'authority-restoration',
]);
const ROLLBACK_REQUEST_KEYS = new Set([
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
const DEEP_REVIEW_LEDGER_WRITER_RESOURCE = canonicalizeProtectedResource({
  kind: ProtectedResourceKinds.WRITER,
  components: { writerId: 'deep-review-ledger-writer' },
  atomicityDomain: AtomicityDomains.SINGLE_HOST_FILESYSTEM,
});

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value as JsonObject));
}

function denied(reasonCode: DeepReviewRollbackDenialReasonCode): DeepReviewRollbackDecision {
  return Object.freeze({
    disposition: 'denied',
    authorityState: 'legacy_authoritative',
    ledgerAuthority: 'denied',
    reasonCode,
    gatewayDecisionId: null,
    certificate: null,
  });
}

async function reverifyMigrationCertificate(
  certificate: DeepReviewModeMigrationCertificate | null | undefined,
  gateInput: DeepReviewRollbackRequest['gateInput'],
): Promise<DeepReviewModeMigrationCertificate | null> {
  if (!certificate) return null;
  try {
    const { certificateDigest, ...core } = certificate;
    const internallyValid = certificate.schemaVersion === DEEP_REVIEW_ROLLBACK_GATE_SCHEMA_VERSION
      && certificate.certificateKind === 'mode-migration-readiness'
      && certificate.mode === 'deep-review'
      && certificate.readiness === 'ready-for-phase-014-consideration'
      && certificate.authorityState === 'legacy_authoritative'
      && certificate.authorityMutation === false
      && certificate.rollbackWindowClosed === false
      && certificate.cutoverCertificate === false
      && HEX_64.test(certificateDigest)
      && digest(core) === certificateDigest;
    if (!internallyValid || gateInput === undefined) return null;
    const reverified = await new DeepReviewModeMigrationGate().evaluate(gateInput);
    return reverified.verdict === 'pass'
      && reverified.certificate?.certificateDigest === certificateDigest
      ? reverified.certificate
      : null;
  } catch {
    return null;
  }
}

function validCount(value: unknown): value is number {
  return Number.isSafeInteger(value) && (value as number) >= 0;
}

function resumeEvidenceDigest(input: NonNullable<DeepReviewRollbackRequest['resumeEvidence']>): string {
  return digest(input);
}

interface ValidatedStaleWriterLease {
  readonly resource: CanonicalProtectedResource;
  readonly fenceToken: unknown;
}

function validateStaleWriterLease(value: unknown): ValidatedStaleWriterLease {
  if (
    value === null
    || typeof value !== 'object'
    || Array.isArray(value)
    || Object.getPrototypeOf(value) !== Object.prototype
    || (Object.keys(value).length !== 8 && Object.keys(value).length !== 9)
    || Object.keys(value).some((key) => ![
      'resource',
      'fenceToken',
      'leaseId',
      'ownerId',
      'correlationId',
      'acquiredAt',
      'renewedAt',
      'expiresAt',
      'acquisition',
    ].includes(key))
  ) {
    throw new TypeError('Stale writer lease must be an object');
  }
  const lease = value as Record<string, unknown>;
  if (
    lease.acquisition !== undefined
    && lease.acquisition !== 'acquired'
    && lease.acquisition !== 'takeover'
  ) throw new TypeError('Stale writer lease acquisition is invalid');
  const resource = canonicalizeProtectedResource(lease.resource);
  validateOpaqueIdentity(lease.leaseId, 'leaseId');
  validateOpaqueIdentity(lease.ownerId, 'ownerId');
  validateOpaqueIdentity(lease.correlationId, 'correlationId');
  const acquiredAt = typeof lease.acquiredAt === 'string'
    ? Date.parse(lease.acquiredAt)
    : Number.NaN;
  const renewedAt = typeof lease.renewedAt === 'string'
    ? Date.parse(lease.renewedAt)
    : Number.NaN;
  const expiresAt = typeof lease.expiresAt === 'string'
    ? Date.parse(lease.expiresAt)
    : Number.NaN;
  if (
    !Number.isFinite(acquiredAt)
    || !Number.isFinite(renewedAt)
    || !Number.isFinite(expiresAt)
    || renewedAt < acquiredAt
    || expiresAt <= renewedAt
  ) {
    throw new TypeError('Stale writer lease timestamps must be monotonic ISO timestamps');
  }
  return { resource, fenceToken: lease.fenceToken };
}

export class DeepReviewRollbackSwitch {
  readonly #options: DeepReviewRollbackSwitchOptions;

  public constructor(options: DeepReviewRollbackSwitchOptions) {
    this.#options = options;
  }

  public async requestRollback(input: DeepReviewRollbackRequest): Promise<DeepReviewRollbackDecision> {
    let prepared: Readonly<{
      operation: DeepReviewRollbackOperation;
      authorizationRequest: NonNullable<DeepReviewRollbackRequest['authorizationRequest']>;
      rollbackReason: string;
      classificationDigest: string;
      resumeEvidenceDigest: string;
      writerResource: CanonicalProtectedResource;
      staleWriterFenceToken: unknown;
      rollbackAnchorDigest: string;
      retainedEventCountAfter: number;
      retainedArtifactCountAfter: number;
    }>;
    try {
      if (
        input === null
        || typeof input !== 'object'
        || Array.isArray(input)
        || Object.getPrototypeOf(input) !== Object.prototype
        || Object.keys(input).some((key) => !ROLLBACK_REQUEST_KEYS.has(key))
      ) return denied('EVIDENCE_INCOMPLETE');
      if (!input.configurationVersion || !TOKEN.test(input.configurationVersion)) {
        return denied('MISSING_CONFIGURATION');
      }
      if (
        !input.operation
        || !ALLOWED_ROLLBACK_OPERATIONS.has(input.operation)
        || !input.currentAuthority
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
      if (!gateCertificate) return denied('ABSENT_GATE_CERTIFICATE');
      if (
        !input.authorizationRequest
        || !input.rollbackReason
        || input.rollbackReason.length > 1_024
        || input.admissionState !== 'frozen'
        || !input.classificationManifest
        || !verifyClassificationManifest(input.classificationManifest)
        || !input.resumeEvidence
        || !input.writerResource
        || !input.staleWriterLease
        || !input.rollbackAnchorDigest
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
      const resumeDigest = resumeEvidenceDigest(input.resumeEvidence);
      const boundEvidenceDigest = digest({
        configurationVersion: input.configurationVersion,
        operation: input.operation,
        rollbackReason: input.rollbackReason,
        currentAuthorityState: input.currentAuthority.state,
        currentAuthorityEpoch: input.currentAuthority.epoch,
        gateCertificateDigest: gateCertificate.certificateDigest,
        classificationDigest: input.classificationManifest.finalDigest,
        resumeEvidenceDigest: resumeDigest,
        writerResourceDigest: writerResource.resourceDigest,
        staleWriterLeaseDigest: digest(input.staleWriterLease),
        rollbackAnchorDigest: input.rollbackAnchorDigest,
        retainedEventCountBefore: input.retainedEventCountBefore,
        retainedEventCountAfter: input.retainedEventCountAfter,
        retainedArtifactCountBefore: input.retainedArtifactCountBefore,
        retainedArtifactCountAfter: input.retainedArtifactCountAfter,
      });
      if (
        input.authorizationRequest.mode !== 'deep-review'
        || input.authorizationRequest.authorityEpoch !== input.currentAuthority.epoch
        || input.authorizationRequest.evidenceDigest !== boundEvidenceDigest
      ) return denied('EVIDENCE_INCOMPLETE');
      if (
        writerResource.resourceDigest !== DEEP_REVIEW_LEDGER_WRITER_RESOURCE.resourceDigest
        || staleWriterLease.resource.resourceDigest !== writerResource.resourceDigest
      ) return denied('WRITER_FENCE_FAILED');

      prepared = Object.freeze({
        operation: input.operation,
        authorizationRequest: input.authorizationRequest,
        rollbackReason: input.rollbackReason,
        classificationDigest: input.classificationManifest.finalDigest,
        resumeEvidenceDigest: resumeDigest,
        writerResource,
        staleWriterFenceToken: staleWriterLease.fenceToken,
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
          ? 'GATEWAY_FAILURE'
          : 'AUTHORIZATION_DENIED'),
        gatewayDecisionId: authorization.decision?.decision_id ?? null,
      });
    }

    let writerFenceToken: number;
    try {
      const rollbackLease = await this.#options.fencingCoordinator.acquire({
        resource: prepared.writerResource,
        ownerId: 'deep-review-external-rollback',
        correlationId: authorization.decision.decision_id,
        ttlMs: 60_000,
        acquireTimeoutMs: 1_000,
      });
      writerFenceToken = rollbackLease.fenceToken;
      const acquiredSnapshot = await this.#options.fencingCoordinator.inspect(prepared.writerResource);
      await this.#options.fencingCoordinator.withFence(rollbackLease, () => () => undefined);
      await this.#options.fencingCoordinator.release(rollbackLease);
      const releasedSnapshot = await this.#options.fencingCoordinator.inspect(prepared.writerResource);
      if (
        acquiredSnapshot.lastFenceToken !== writerFenceToken
        || acquiredSnapshot.activeLease?.leaseId !== rollbackLease.leaseId
        || releasedSnapshot.lastFenceToken !== writerFenceToken
        || releasedSnapshot.activeLease !== null
        || !Number.isSafeInteger(prepared.staleWriterFenceToken)
        || (prepared.staleWriterFenceToken as number) <= 0
        || (prepared.staleWriterFenceToken as number) >= writerFenceToken
      ) return denied('WRITER_FENCE_FAILED');
    } catch {
      return denied('WRITER_FENCE_FAILED');
    }

    const certificateCore = Object.freeze({
      schemaVersion: DEEP_REVIEW_ROLLBACK_GATE_SCHEMA_VERSION,
      certificateKind: 'non-destructive-rollback' as const,
      mode: 'deep-review' as const,
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
    const certificate: DeepReviewRollbackCertificate = Object.freeze({
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
