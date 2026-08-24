import {
  canonicalBytes,
  sha256Bytes,
} from '../event-envelope/index.js';
import type { JsonObject } from '../event-envelope/index.js';
import type {
  AuthorizationDecisionRecord,
  TransitionAuthorizationRequest,
} from './authorized-ledger-types.js';

const HEX_64 = /^[a-f0-9]{64}$/u;

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value as JsonObject));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isDigest(value: unknown): value is string {
  return typeof value === 'string' && HEX_64.test(value);
}

/**
 * Returns true only when an allow decision is bound to the prepared request,
 * current authority state, both deterministic decision digests, and positively
 * verified actor, capability, and evidence identity.
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
      && decision.actor_id_verified === true
      && decision.capability_id_verified === true
      && decision.evidence_digest_verified === true
      && isDigest(decision.request_digest)
      && decision.request_digest === requestDigest
      && isDigest(decision.decision_digest)
      && digest(decisionBody) === decision.decision_digest;
  } catch {
    return false;
  }
}
