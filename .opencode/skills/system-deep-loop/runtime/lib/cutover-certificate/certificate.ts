// ───────────────────────────────────────────────────────────────────
// MODULE: Cutover Certificate Assembly, Verification & Ledger Write
// ───────────────────────────────────────────────────────────────────

import { appendAuthorizedThroughFence } from '../locks-and-fencing/fenced-ledger-writer.js';
import {
  canonicalBytes,
  EventTypeRegistry,
  prepareEventWrite,
  sha256Bytes,
} from '../event-envelope/index.js';
import { verifyClassificationManifest } from '../inflight-state-classification/index.js';
import { verifyBoundaryReceiptCertification } from '../receipts-and-effect-recovery/index.js';
import { verifyRollbackDrillCertificate } from '../rollback-drills/index.js';
import {
  CUTOVER_CERTIFICATE_EVENT_TYPE,
  CUTOVER_CERTIFICATE_SCHEMA_VERSION,
  CutoverCertificateModes,
} from './types.js';

import type {
  AppendOnlyLedger,
  DurableAppendReceipt,
  GatewayAllowProof,
} from '../authorized-ledger/index.js';
import type {
  EventProducer,
  EventTypeDefinition,
  EventWritePreflight,
  JsonObject,
} from '../event-envelope/index.js';
import type {
  CutoverCertificate,
  CutoverCertificateAssemblyResult,
  CutoverCertificateFacts,
  CutoverCertificateMode,
  CutoverCertificateRejectionReasonCode,
  CutoverCertificateRequest,
  CutoverCertificateVerificationExpectation,
  CutoverCertificateVerificationProviders,
  CutoverCertificateVerificationResult,
} from './types.js';

// ───────────────────────────────────────────────────────────────────
// 1. HELPERS
// ───────────────────────────────────────────────────────────────────

const HEX_40 = /^[a-f0-9]{40}$/u;
const CUTOVER_CERTIFICATE_MODE_SET: ReadonlySet<string> = new Set(CutoverCertificateModes);

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value as JsonObject));
}

function rejected(
  reasonCode: CutoverCertificateRejectionReasonCode,
): CutoverCertificateAssemblyResult {
  return Object.freeze({ verdict: 'rejected', reasonCode });
}

function verificationRejected(
  reasonCode: CutoverCertificateRejectionReasonCode,
): CutoverCertificateVerificationResult {
  return Object.freeze({ verdict: 'rejected', reasonCode });
}

function isPositiveEpoch(value: unknown): value is number {
  return Number.isSafeInteger(value) && (value as number) > 0;
}

function uniqueSortedDigests(values: readonly string[]): string[] | null {
  if (values.length === 0 || values.some((value) => typeof value !== 'string' || value.length === 0)) {
    return null;
  }
  const sorted = [...values].sort();
  return new Set(sorted).size === sorted.length ? sorted : null;
}

// ───────────────────────────────────────────────────────────────────
// 2. ASSEMBLY (deny-by-default)
// ───────────────────────────────────────────────────────────────────

/**
 * Bind one mode's already-independently-verified readiness, parity, drill,
 * replay, classification, receipt, and policy evidence into one certificate
 * fact set. Every check fails closed: a missing, mismatched, or
 * cross-mode-bound input rejects before a certificate is ever built. The
 * rollback drill and migration receipt families additionally carry their own
 * cryptographic certification — this verifies each one's signature and
 * issuer identity against `providers`, and binds its mode/candidate/epoch
 * facts, rather than trusting the caller's self-reported shape alone.
 */
export async function buildCutoverCertificate(
  request: Readonly<CutoverCertificateRequest>,
  providers: Readonly<CutoverCertificateVerificationProviders>,
): Promise<CutoverCertificateAssemblyResult> {
  try {
    const { mode, candidateSha, fromAuthorityEpoch, issuer, issuedAt, evidence } = request;
    if (!CUTOVER_CERTIFICATE_MODE_SET.has(mode)) return rejected('MODE_MISMATCH');
    if (!HEX_40.test(candidateSha)) return rejected('CANDIDATE_SHA_INVALID');
    if (!isPositiveEpoch(fromAuthorityEpoch)) return rejected('AUTHORITY_EPOCH_INVALID');
    if (typeof issuer !== 'string' || issuer.length === 0) return rejected('CERTIFICATE_MALFORMED');
    if (typeof issuedAt !== 'string' || Number.isNaN(Date.parse(issuedAt))) {
      return rejected('CERTIFICATE_MALFORMED');
    }

    const { modeGateCertificate, shadowParity, rollbackDrillCertificate, mixedVersionReplay,
      classificationManifest, migrationReceipts, approvingPolicy } = evidence;

    if (
      modeGateCertificate.mode !== mode
      || modeGateCertificate.candidateSha !== candidateSha
      || modeGateCertificate.authorityEpoch !== fromAuthorityEpoch
      || modeGateCertificate.readiness !== 'ready-for-phase-014-consideration'
      || typeof modeGateCertificate.certificateDigest !== 'string'
      || modeGateCertificate.certificateDigest.length === 0
    ) return rejected('READINESS_NOT_READY');

    if (
      shadowParity.mode !== mode
      || shadowParity.candidateSha !== candidateSha
      || shadowParity.exitStatus !== 'green'
      || typeof shadowParity.evidenceDigest !== 'string'
      || shadowParity.evidenceDigest.length === 0
    ) return rejected('PARITY_NOT_GREEN');

    const drillFacts = rollbackDrillCertificate.facts;
    if (
      drillFacts.mode !== mode
      || drillFacts.candidateSha !== candidateSha
      || drillFacts.passed !== true
      || drillFacts.classificationDigest !== classificationManifest.finalDigest
      || drillFacts.startingAuthorityEpoch !== fromAuthorityEpoch
    ) return rejected('ROLLBACK_DRILL_NOT_PASSED');
    try {
      await verifyRollbackDrillCertificate(rollbackDrillCertificate, providers.rollbackDrillProvider);
    } catch {
      return rejected('ROLLBACK_DRILL_NOT_PASSED');
    }

    if (
      mixedVersionReplay.ok !== true
      || mixedVersionReplay.certificateEligible !== true
      || mixedVersionReplay.authorityState !== 'legacy_authoritative'
      || mixedVersionReplay.authorityMutation !== false
    ) return rejected('MIXED_VERSION_REPLAY_FAILED');

    if (!verifyClassificationManifest(classificationManifest)) {
      return rejected('CLASSIFICATION_MANIFEST_INVALID');
    }

    for (const receipt of migrationReceipts) {
      if (
        receipt.from_state !== 'cutover_ready'
        || receipt.to_state !== 'new_authoritative_reversible'
        || receipt.authority_epoch !== fromAuthorityEpoch
        || receipt.result_code !== 'ok'
      ) return rejected('MIGRATION_RECEIPT_INVALID');
      try {
        await verifyBoundaryReceiptCertification(receipt, providers.migrationReceiptProviders);
      } catch {
        return rejected('MIGRATION_RECEIPT_INVALID');
      }
    }
    const migrationReceiptDigests = uniqueSortedDigests(
      migrationReceipts.map((receipt) => receipt.evidence_digest),
    );
    if (migrationReceiptDigests === null) return rejected('MIGRATION_RECEIPT_INVALID');

    if (
      typeof approvingPolicy.policyId !== 'string'
      || approvingPolicy.policyId.length === 0
      || !Number.isSafeInteger(approvingPolicy.policyVersion)
      || approvingPolicy.policyVersion <= 0
      || typeof approvingPolicy.digest !== 'string'
      || approvingPolicy.digest.length === 0
    ) return rejected('POLICY_INVALID');

    const toAuthorityEpoch = fromAuthorityEpoch + 1;
    const transitionDigest = digest({
      mode,
      candidateSha,
      fromAuthorityState: 'cutover_ready',
      toAuthorityState: 'new_authoritative_reversible',
      fromAuthorityEpoch,
      toAuthorityEpoch,
    });

    const factsCore: CutoverCertificateFacts = Object.freeze({
      schemaVersion: CUTOVER_CERTIFICATE_SCHEMA_VERSION,
      certificateKind: 'cutover-authorization' as const,
      mode,
      candidateSha,
      fromAuthorityState: 'cutover_ready' as const,
      toAuthorityState: 'new_authoritative_reversible' as const,
      fromAuthorityEpoch,
      toAuthorityEpoch,
      transitionDigest,
      evidence: Object.freeze({
        modeGateCertificateDigest: modeGateCertificate.certificateDigest,
        shadowParityEvidenceDigest: shadowParity.evidenceDigest,
        rollbackDrillCertificateDigest: rollbackDrillCertificate.certificateDigest,
        mixedVersionReplayDigest: mixedVersionReplay.evidenceDigest,
        classificationManifestDigest: classificationManifest.finalDigest,
        migrationReceiptDigests,
        approvingPolicyId: approvingPolicy.policyId,
        approvingPolicyVersion: approvingPolicy.policyVersion,
        approvingPolicyDigest: approvingPolicy.digest,
      }),
      issuer,
      issuedAt,
      unresolvedBlockerCount: 0 as const,
      authorityMutation: false as const,
    });
    const certificate: CutoverCertificate = Object.freeze({
      facts: factsCore,
      certificateDigest: digest(factsCore),
    });
    return Object.freeze({ verdict: 'issued', certificate });
  } catch {
    return rejected('CERTIFICATE_MALFORMED');
  }
}

// ───────────────────────────────────────────────────────────────────
// 3. VERIFICATION (deny-by-default)
// ───────────────────────────────────────────────────────────────────

/** Re-derive the certificate digest and rebind every fact to the caller's exact expectation. */
export function verifyCutoverCertificate(
  certificate: Readonly<CutoverCertificate>,
  expectation: Readonly<CutoverCertificateVerificationExpectation>,
): CutoverCertificateVerificationResult {
  try {
    const { facts } = certificate;
    if (digest(facts) !== certificate.certificateDigest) return verificationRejected('CERTIFICATE_MALFORMED');
    if (
      facts.schemaVersion !== CUTOVER_CERTIFICATE_SCHEMA_VERSION
      || facts.certificateKind !== 'cutover-authorization'
      || facts.fromAuthorityState !== 'cutover_ready'
      || facts.toAuthorityState !== 'new_authoritative_reversible'
      || facts.toAuthorityEpoch !== facts.fromAuthorityEpoch + 1
      || facts.unresolvedBlockerCount !== 0
      || facts.authorityMutation !== false
    ) return verificationRejected('CERTIFICATE_MALFORMED');
    if (facts.mode !== expectation.mode) return verificationRejected('MODE_MISMATCH');
    if (facts.candidateSha !== expectation.candidateSha) return verificationRejected('CANDIDATE_SHA_MISMATCH');
    if (facts.fromAuthorityEpoch !== expectation.fromAuthorityEpoch) {
      return verificationRejected('AUTHORITY_EPOCH_INVALID');
    }
    if (
      facts.evidence.approvingPolicyId !== expectation.policyId
      || facts.evidence.approvingPolicyVersion !== expectation.policyVersion
      || facts.evidence.approvingPolicyDigest !== expectation.policyDigest
    ) return verificationRejected('POLICY_INVALID');
    return Object.freeze({ verdict: 'valid' });
  } catch {
    return verificationRejected('CERTIFICATE_MALFORMED');
  }
}

// ───────────────────────────────────────────────────────────────────
// 4. LEDGER EVENT REGISTRATION AND APPEND
// ───────────────────────────────────────────────────────────────────

function isCutoverCertificatePayload(payload: Readonly<JsonObject>): boolean {
  const certificate = payload.certificate;
  return typeof certificate === 'object'
    && certificate !== null
    && !Array.isArray(certificate)
    && typeof (certificate as JsonObject).certificateDigest === 'string';
}

/** Register the one event type this certificate is written as. */
export function createCutoverCertificateEventRegistry(): EventTypeRegistry {
  const definition: EventTypeDefinition = {
    eventType: CUTOVER_CERTIFICATE_EVENT_TYPE,
    currentVersion: 1,
    versions: [{
      version: 1,
      payload: {
        requiredFields: ['certificate'],
        validate: isCutoverCertificatePayload,
      },
    }],
    upcasters: [],
  };
  return new EventTypeRegistry([definition]);
}

export interface CutoverCertificateEnvelopeFields {
  readonly eventId: string;
  readonly streamId: string;
  readonly streamSequence: number;
  readonly occurredAt: string;
  readonly recordedAt: string;
  readonly producer: EventProducer;
  readonly correlationId: string;
  readonly causationId: string | null;
  readonly idempotencyKey: string;
}

/** Build the write-preflight for one cutover certificate event, current version only. */
export function prepareCutoverCertificateEventWrite(
  certificate: Readonly<CutoverCertificate>,
  envelope: Readonly<CutoverCertificateEnvelopeFields>,
  registry: EventTypeRegistry,
): EventWritePreflight {
  return prepareEventWrite({
    envelope_version: 1,
    event_id: envelope.eventId,
    event_type: CUTOVER_CERTIFICATE_EVENT_TYPE,
    event_version: 1,
    stream_id: envelope.streamId,
    stream_sequence: envelope.streamSequence,
    occurred_at: envelope.occurredAt,
    recorded_at: envelope.recordedAt,
    producer: envelope.producer,
    authority_epoch: certificate.facts.fromAuthorityEpoch,
    correlation_id: envelope.correlationId,
    causation_id: envelope.causationId,
    idempotency_key: envelope.idempotencyKey,
    payload: { certificate },
  }, registry);
}

/**
 * Append exactly one cutover certificate event through the existing fenced,
 * gateway-authorized append seam. This module never appends any other event
 * type: a caller-supplied preflight for a different event type is refused
 * before the fence is even acquired.
 */
export async function appendCutoverCertificateEvent(
  ledger: AppendOnlyLedger,
  event: EventWritePreflight,
  proof: GatewayAllowProof,
): Promise<DurableAppendReceipt> {
  if (event.identity.eventType !== CUTOVER_CERTIFICATE_EVENT_TYPE) {
    throw new TypeError('Cutover certificate append received an event of a different type');
  }
  return appendAuthorizedThroughFence(ledger, event, proof);
}

export type { CutoverCertificateMode };
