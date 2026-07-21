// ───────────────────────────────────────────────────────────────────
// MODULE: Claim Continuity Event Contracts
// ───────────────────────────────────────────────────────────────────

import {
  AuthorizationReasonCodes,
  AuthorizationVerdicts,
  TransitionPolicyRegistry,
} from '../authorized-ledger/index.js';
import { EventTypeRegistry } from '../event-envelope/index.js';
import {
  ContinuityIdentityKinds,
  validateIdentityRef,
} from '../deep-loop/continuity-identity/index.js';

import type {
  PolicyEvaluationInput,
  PolicyEvaluationResult,
  PolicyReference,
} from '../authorized-ledger/index.js';
import type { EventTypeDefinition, JsonObject } from '../event-envelope/index.js';

export const CLAIM_MATCH_RECORDED_EVENT = 'deep-loop.claim.match-recorded';
export const CLAIM_REGISTERED_EVENT = 'deep-loop.claim.registered';
export const CLAIM_OBSERVATION_ATTACHED_EVENT = 'deep-loop.claim.observation-attached';
export const CLAIM_EVIDENCE_ATTACHED_EVENT = 'deep-loop.claim.evidence-attached';
export const CLAIM_LIFECYCLE_RECORDED_EVENT = 'deep-loop.claim.lifecycle-recorded';
export const CLAIM_ADJUDICATION_RECORDED_EVENT = 'deep-loop.claim.adjudication-recorded';
export const CLAIM_CORRECTION_RECORDED_EVENT = 'deep-loop.claim.correction-recorded';
export const CLAIM_CONTRADICTION_RECORDED_EVENT = 'deep-loop.claim.contradiction-recorded';
export const CLAIM_SUPERSESSION_RECORDED_EVENT = 'deep-loop.claim.supersession-recorded';

export const CLAIM_CONTINUITY_EVENT_TYPES = Object.freeze([
  CLAIM_MATCH_RECORDED_EVENT,
  CLAIM_REGISTERED_EVENT,
  CLAIM_OBSERVATION_ATTACHED_EVENT,
  CLAIM_EVIDENCE_ATTACHED_EVENT,
  CLAIM_LIFECYCLE_RECORDED_EVENT,
  CLAIM_ADJUDICATION_RECORDED_EVENT,
  CLAIM_CORRECTION_RECORDED_EVENT,
  CLAIM_CONTRADICTION_RECORDED_EVENT,
  CLAIM_SUPERSESSION_RECORDED_EVENT,
]);

export const CLAIM_CONTINUITY_REDUCER_ID = 'claim-continuity-fold';
export const CLAIM_CONTINUITY_REDUCER_VERSION = '1';
export const CLAIM_CONTINUITY_PROJECTION_SCHEMA_VERSION = '1';
export const CLAIM_CONTINUITY_POLICY_ID = 'claim-continuity-dark-write';
export const CLAIM_CONTINUITY_POLICY_VERSION = 1;
export const CLAIM_CONTINUITY_WRITE_CAPABILITY = 'claim-continuity-write';

const HASH_PATTERN = /^[a-f0-9]{64}$/;
const ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,511}$/;
const CLAIM_EVENT_TYPE_SET = new Set<string>(CLAIM_CONTINUITY_EVENT_TYPES);

function isObject(value: unknown): value is Readonly<JsonObject> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0 && value.length <= 512;
}

function isId(value: unknown): value is string {
  return isString(value) && ID_PATTERN.test(value);
}

function isHash(value: unknown): value is string {
  return typeof value === 'string' && HASH_PATTERN.test(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isString);
}

function isClaimRef(value: unknown): boolean {
  validateIdentityRef(value, ContinuityIdentityKinds.CLAIM);
  return true;
}

function validateCandidate(value: unknown): boolean {
  if (!isObject(value)) return false;
  return isClaimRef(value.claim_ref)
    && isId(value.namespace)
    && isHash(value.normalized_fingerprint)
    && typeof value.similarity_score === 'number'
    && value.similarity_score >= 0
    && value.similarity_score <= 1
    && ['equivalent', 'distinct', 'topical_only'].includes(String(value.semantic_decision))
    && isId(value.community_id)
    && isId(value.community_projection_version)
    && typeof value.community_consensus === 'boolean'
    && isHash(value.provenance_digest);
}

function validateMatchRecord(value: unknown): boolean {
  if (!isObject(value)) return false;
  const decision = String(value.decision);
  const resolved = value.resolved_claim_ref;
  return isId(value.match_record_id)
    && isId(value.observation_id)
    && isId(value.namespace)
    && isStringArray(value.aliases)
    && isHash(value.normalized_fingerprint)
    && isId(value.policy_version)
    && isHash(value.policy_digest)
    && Array.isArray(value.candidate_set)
    && value.candidate_set.every(validateCandidate)
    && ['mint', 'reuse', 'unresolved'].includes(decision)
    && isId(value.reason)
    && (resolved === null || isClaimRef(resolved))
    && ((decision === 'reuse') === (resolved !== null))
    && isHash(value.provenance_digest);
}

function validateRegistered(payload: Readonly<JsonObject>): boolean {
  return isClaimRef(payload.claim_ref)
    && isId(payload.match_record_id)
    && isId(payload.mint_identity_event_id)
    && isHash(payload.mint_request_token_digest)
    && isId(payload.namespace)
    && isHash(payload.provenance_digest);
}

function validateObservation(payload: Readonly<JsonObject>): boolean {
  return isClaimRef(payload.claim_ref)
    && isId(payload.match_record_id)
    && isId(payload.observation_id)
    && isString(payload.raw_text)
    && isHash(payload.normalized_fingerprint)
    && isStringArray(payload.aliases)
    && isId(payload.source_event_id)
    && isHash(payload.provenance_digest);
}

function validateEvidence(payload: Readonly<JsonObject>): boolean {
  return isClaimRef(payload.claim_ref)
    && isId(payload.evidence_ref)
    && isId(payload.source_ref)
    && ['support', 'qualification'].includes(String(payload.stance))
    && isId(payload.independence_key)
    && typeof payload.is_duplicate === 'boolean'
    && isHash(payload.provenance_digest);
}

function validateLifecycle(payload: Readonly<JsonObject>): boolean {
  return isClaimRef(payload.claim_ref)
    && ['admit', 'retract'].includes(String(payload.transition))
    && isId(payload.rationale_ref);
}

function validateAdjudication(payload: Readonly<JsonObject>): boolean {
  return isClaimRef(payload.claim_ref)
    && ['unassessed', 'supported', 'refuted'].includes(String(payload.outcome))
    && isStringArray(payload.evidence_refs)
    && isId(payload.rationale_ref);
}

function validateCorrection(payload: Readonly<JsonObject>): boolean {
  return isClaimRef(payload.claim_ref)
    && isId(payload.target_event_id)
    && isId(payload.rationale_ref);
}

function validateRelationshipBase(payload: Readonly<JsonObject>): boolean {
  return isId(payload.relationship_id)
    && isStringArray(payload.evidence_refs)
    && isStringArray(payload.provenance_refs)
    && isStringArray(payload.independence_refs)
    && isId(payload.detector_version)
    && isId(payload.evidence_snapshot_ref)
    && ['assert', 'withdraw'].includes(String(payload.relation_action))
    && (
      (payload.relation_action === 'assert' && payload.retracts_event_id === null)
      || (payload.relation_action === 'withdraw' && isId(payload.retracts_event_id))
    );
}

function validateContradiction(payload: Readonly<JsonObject>): boolean {
  if (!validateRelationshipBase(payload)) return false;
  const left = validateIdentityRef(payload.left_claim_id, ContinuityIdentityKinds.CLAIM);
  const right = validateIdentityRef(payload.right_claim_id, ContinuityIdentityKinds.CLAIM);
  return left.id < right.id
    && isString(payload.incompatibility_scope)
    && isStringArray(payload.semantic_community_ids);
}

function validateSupersession(payload: Readonly<JsonObject>): boolean {
  if (!validateRelationshipBase(payload)) return false;
  const predecessor = validateIdentityRef(
    payload.predecessor_claim_id,
    ContinuityIdentityKinds.CLAIM,
  );
  const successor = validateIdentityRef(
    payload.successor_claim_id,
    ContinuityIdentityKinds.CLAIM,
  );
  return predecessor.id !== successor.id
    && isString(payload.replacement_scope)
    && isString(payload.strength_rationale);
}

function definition(
  eventType: string,
  requiredFields: readonly string[],
  validate: (payload: Readonly<JsonObject>) => boolean,
): EventTypeDefinition {
  return {
    eventType,
    currentVersion: 1,
    versions: [{
      version: 1,
      payload: { requiredFields, validate },
    }],
    upcasters: [],
  };
}

/** Build the closed event manifest, including read contracts for sibling relationships. */
export function createClaimContinuityEventRegistry(): EventTypeRegistry {
  return new EventTypeRegistry([
    definition(CLAIM_MATCH_RECORDED_EVENT, ['match_record'], (payload) => (
      validateMatchRecord(payload.match_record)
    )),
    definition(CLAIM_REGISTERED_EVENT, [
      'claim_ref',
      'match_record_id',
      'mint_identity_event_id',
      'mint_request_token_digest',
      'namespace',
      'provenance_digest',
    ], validateRegistered),
    definition(CLAIM_OBSERVATION_ATTACHED_EVENT, [
      'claim_ref',
      'match_record_id',
      'observation_id',
      'raw_text',
      'normalized_fingerprint',
      'aliases',
      'source_event_id',
      'provenance_digest',
    ], validateObservation),
    definition(CLAIM_EVIDENCE_ATTACHED_EVENT, [
      'claim_ref',
      'evidence_ref',
      'source_ref',
      'stance',
      'independence_key',
      'is_duplicate',
      'provenance_digest',
    ], validateEvidence),
    definition(CLAIM_LIFECYCLE_RECORDED_EVENT, [
      'claim_ref',
      'transition',
      'rationale_ref',
    ], validateLifecycle),
    definition(CLAIM_ADJUDICATION_RECORDED_EVENT, [
      'claim_ref',
      'outcome',
      'evidence_refs',
      'rationale_ref',
    ], validateAdjudication),
    definition(CLAIM_CORRECTION_RECORDED_EVENT, [
      'claim_ref',
      'target_event_id',
      'rationale_ref',
    ], validateCorrection),
    definition(CLAIM_CONTRADICTION_RECORDED_EVENT, [
      'relationship_id',
      'left_claim_id',
      'right_claim_id',
      'incompatibility_scope',
      'semantic_community_ids',
      'evidence_refs',
      'provenance_refs',
      'independence_refs',
      'detector_version',
      'evidence_snapshot_ref',
      'relation_action',
      'retracts_event_id',
    ], validateContradiction),
    definition(CLAIM_SUPERSESSION_RECORDED_EVENT, [
      'relationship_id',
      'predecessor_claim_id',
      'successor_claim_id',
      'replacement_scope',
      'strength_rationale',
      'evidence_refs',
      'provenance_refs',
      'independence_refs',
      'detector_version',
      'evidence_snapshot_ref',
      'relation_action',
      'retracts_event_id',
    ], validateSupersession),
  ]);
}

function evaluateClaimPolicy(
  input: Readonly<PolicyEvaluationInput>,
): PolicyEvaluationResult {
  const dark = input.authorityState === 'legacy_authoritative'
    || input.authorityState === 'shadowing';
  const allowed = dark
    && input.capabilityId === CLAIM_CONTINUITY_WRITE_CAPABILITY
    && CLAIM_EVENT_TYPE_SET.has(input.requestedEventType);
  return allowed
    ? {
      verdict: AuthorizationVerdicts.ALLOW,
      reasonCode: AuthorizationReasonCodes.ALLOWED,
      matchedRuleIds: ['dark-authority', 'typed-claim-event', 'write-capability'],
    }
    : {
      verdict: AuthorizationVerdicts.DENY,
      reasonCode: AuthorizationReasonCodes.POLICY_DENIED,
      matchedRuleIds: ['dark-authority', 'typed-claim-event', 'write-capability'],
    };
}

/** Create a dark-only authorization policy without changing legacy authority. */
export function createClaimContinuityPolicyRegistry(): {
  readonly registry: TransitionPolicyRegistry;
  readonly reference: PolicyReference;
} {
  const registry = new TransitionPolicyRegistry([{
    policyId: CLAIM_CONTINUITY_POLICY_ID,
    policyVersion: CLAIM_CONTINUITY_POLICY_VERSION,
    evaluatorVersion: '1',
    ruleIds: ['dark-authority', 'typed-claim-event', 'write-capability'],
    evaluate: evaluateClaimPolicy,
  }]);
  const policy = registry.resolve(CLAIM_CONTINUITY_POLICY_ID, CLAIM_CONTINUITY_POLICY_VERSION);
  return Object.freeze({
    registry,
    reference: Object.freeze({
      policyId: policy.policyId,
      policyVersion: policy.policyVersion,
      policyDigest: policy.digest,
    }),
  });
}
