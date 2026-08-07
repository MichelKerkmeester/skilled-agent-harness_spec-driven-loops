// ───────────────────────────────────────────────────────────────────
// MODULE: Strict Mode Gate Validators
// ───────────────────────────────────────────────────────────────────

import {
  canonicalBytes,
  sha256Bytes,
} from '../event-envelope/index.js';

import type {
  AuthorizationDecisionRecord,
  TransitionAuthorizationRequest,
} from '../authorized-ledger/index.js';
import type { JsonObject } from '../event-envelope/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

/** Installed event, reducer, and projection versions for one mode gate. */
export interface InstalledVersionBindings {
  readonly eventEnvelopeVersion: number;
  readonly eventSchemaVersion: string;
  readonly reducerVersion: string;
  readonly projectionVersion: string;
}

/** Minimum certificate claim shape accepted by the artifact binding validator. */
export interface ArtifactClaimDigest {
  readonly contentDigest?: string;
  readonly binding?: {
    readonly reference?: {
      readonly qualified_digest?: string;
    };
  };
}

// ───────────────────────────────────────────────────────────────────
// 2. VALIDATION HELPERS
// ───────────────────────────────────────────────────────────────────

const HEX_64 = /^[a-f0-9]{64}$/u;
const QUALIFIED_DIGEST = /^[A-Za-z0-9._-]+:[a-f0-9]{64}$/u;

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value as JsonObject));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/** Reject extension keys so mode evidence cannot silently widen its contract. */
export function hasExactKeys(value: unknown, keys: readonly string[]): value is Record<string, unknown> {
  if (!isRecord(value)) return false;
  const expected = new Set(keys);
  const actual = Object.keys(value);
  return actual.length === keys.length && actual.every((key) => expected.has(key));
}

/** Validate every row in a typed evidence collection; callers must reject on false. */
export function validateRows<T>(rows: readonly T[], predicate: (row: T) => boolean): boolean {
  try {
    return Array.isArray(rows) && rows.every(predicate);
  } catch {
    return false;
  }
}

function isDigest(value: unknown): value is string {
  return typeof value === 'string' && HEX_64.test(value);
}

function isArtifactDigest(value: unknown): value is string {
  return typeof value === 'string' && (HEX_64.test(value) || QUALIFIED_DIGEST.test(value));
}

function claimDigest(value: unknown): string | null {
  if (!isRecord(value)) return null;
  const binding = isRecord(value.binding) ? value.binding : null;
  const reference = binding && isRecord(binding.reference) ? binding.reference : null;
  if (typeof reference?.qualified_digest === 'string') return reference.qualified_digest;
  return typeof value.contentDigest === 'string' ? value.contentDigest : null;
}

// ───────────────────────────────────────────────────────────────────
// 3. PUBLIC VALIDATORS
// ───────────────────────────────────────────────────────────────────

/**
 * Returns true only when all installed version bindings match exactly.
 *
 * The comparison intentionally accepts no compatibility range because a gate
 * certificate is valid only for the reducer and projection that produced it.
 */
export function matchesInstalledVersionBindings(
  actual: InstalledVersionBindings,
  expected: InstalledVersionBindings,
): boolean {
  try {
    return Number.isSafeInteger(actual.eventEnvelopeVersion)
      && actual.eventEnvelopeVersion > 0
      && actual.eventEnvelopeVersion === expected.eventEnvelopeVersion
      && typeof actual.eventSchemaVersion === 'string'
      && actual.eventSchemaVersion === expected.eventSchemaVersion
      && typeof actual.reducerVersion === 'string'
      && actual.reducerVersion === expected.reducerVersion
      && typeof actual.projectionVersion === 'string'
      && actual.projectionVersion === expected.projectionVersion;
  } catch {
    return false;
  }
}

/**
 * Returns true only when sealed artifact identities and certificate claims are
 * the same set and the certificate's committed claim-set digest is valid.
 */
export function matchesArtifactClaimSet(
  artifactDigests: readonly string[],
  claims: readonly ArtifactClaimDigest[],
  artifactSetDigest: string,
): boolean {
  try {
    if (!isDigest(artifactSetDigest) || artifactDigests.length === 0 || claims.length === 0) {
      return false;
    }
    const claimedDigests = claims.map((claim) => claimDigest(claim));
    if (
      claimedDigests.some((value) => value === null || !isArtifactDigest(value))
      || artifactDigests.some((value) => !isArtifactDigest(value))
    ) return false;
    const sealed = [...artifactDigests].sort();
    const claimed = claimedDigests as string[];
    if (
      new Set(sealed).size !== sealed.length
      || new Set(claimed).size !== claimed.length
      || sealed.length !== claimed.length
      || sealed.some((value, index) => value !== [...claimed].sort()[index])
    ) return false;
    return digest(claims) === artifactSetDigest;
  } catch {
    return false;
  }
}

/**
 * Returns true only when an allow decision is bound to the prepared request,
 * current authority state, and both deterministic decision digests.
 */
export function matchesPreparedAuthorizationDecision(
  decision: AuthorizationDecisionRecord,
  request: TransitionAuthorizationRequest,
  expectedMode: string,
): boolean {
  try {
    if (!isRecord(decision) || request.mode !== expectedMode) return false;
    const input = {
      mode: request.mode,
      streamId: request.event.identity.streamId,
      priorHeadSequence: request.priorHead.sequence,
      priorHeadHash: request.priorHead.recordHash,
      priorStateVersion: request.priorStateVersion,
      priorStateFingerprint: request.priorStateFingerprint,
      requestedEventId: request.event.identity.eventId,
      requestedEventType: request.event.identity.eventType,
      requestedEventVersion: request.event.identity.eventVersion,
      requestedEventDigest: request.event.canonicalDigest,
      actorId: request.actorId,
      capabilityId: request.capabilityId,
      authorityState: decision.authority_state,
      authorityEpoch: request.authorityEpoch,
      evidenceDigest: request.evidenceDigest,
      correlationId: request.event.envelope.correlation_id,
      causationId: request.event.envelope.causation_id,
      idempotencyKeyDigest: digest(request.event.identity.idempotencyKey),
    };
    const requestDigest = digest({
      requestId: request.requestId,
      ledgerId: request.priorHead.ledgerId,
      registryDigest: request.event.registryDigest,
      input,
      policyId: request.policy.policyId,
      policyVersion: request.policy.policyVersion,
      policyDigest: request.policy.policyDigest,
    });
    const { decision_digest: ignoredDecisionDigest, ...decisionBody } = decision;
    void ignoredDecisionDigest;
    return decision.decision === 'allow'
      && decision.reason_code === 'allowed'
      && decision.request_id === request.requestId
      && decision.mode === expectedMode
      && decision.domain_ledger_id === request.priorHead.ledgerId
      && decision.stream_id === request.event.identity.streamId
      && decision.prior_head_sequence === request.priorHead.sequence
      && decision.prior_head_hash === request.priorHead.recordHash
      && decision.prior_state_version === request.priorStateVersion
      && decision.prior_state_fingerprint === request.priorStateFingerprint
      && decision.requested_event_id === request.event.identity.eventId
      && decision.requested_event_type === request.event.identity.eventType
      && decision.requested_event_version === request.event.identity.eventVersion
      && decision.requested_event_digest === request.event.canonicalDigest
      && decision.event_registry_digest === request.event.registryDigest
      && decision.actor_id === request.actorId
      && decision.capability_id === request.capabilityId
      && decision.authority_epoch === request.authorityEpoch
      && decision.policy_id === request.policy.policyId
      && decision.policy_version === request.policy.policyVersion
      && decision.policy_digest === request.policy.policyDigest
      && decision.evidence_digest === request.evidenceDigest
      && decision.correlation_id === request.event.envelope.correlation_id
      && decision.causation_id === request.event.envelope.causation_id
      && decision.idempotency_key_digest === input.idempotencyKeyDigest
      && isDigest(decision.request_digest)
      && decision.request_digest === requestDigest
      && isDigest(decision.decision_digest)
      && digest(decisionBody) === decision.decision_digest;
  } catch {
    return false;
  }
}
