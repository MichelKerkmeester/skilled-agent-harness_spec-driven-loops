// ───────────────────────────────────────────────────────────────────
// MODULE: Authorization Decision Event
// ───────────────────────────────────────────────────────────────────

import { EventTypeRegistry } from '../event-envelope/index.js';

import type {
  AuthorizationDecisionRecord,
  AuthorizationReasonCode,
  AuthorizationVerdict,
  AuthorityState,
} from './authorized-ledger-types.js';
import type { EventTypeDefinition, JsonObject, JsonValue } from '../event-envelope/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const AUTHORIZATION_DECISION_EVENT_TYPE = 'authorization.decision.recorded';

const DECISION_FIELDS = [
  'decision_id',
  'request_id',
  'decision',
  'reason_code',
  'mode',
  'domain_ledger_id',
  'stream_id',
  'prior_head_sequence',
  'prior_head_hash',
  'prior_state_version',
  'prior_state_fingerprint',
  'requested_event_id',
  'requested_event_type',
  'requested_event_version',
  'requested_event_digest',
  'event_registry_digest',
  'actor_id',
  'capability_id',
  'authority_state',
  'authority_epoch',
  'policy_id',
  'policy_version',
  'policy_digest',
  'evaluator_version',
  'matched_rule_ids',
  'request_digest',
  'evidence_digest',
  'correlation_id',
  'causation_id',
  'idempotency_key_digest',
  'decided_at',
  'expires_at',
  'decision_digest',
] as const;

const VERDICTS = new Set<AuthorizationVerdict>(['allow', 'deny']);
const AUTHORITY_STATES = new Set<AuthorityState>([
  'legacy_authoritative',
  'shadowing',
  'cutover_ready',
  'new_authoritative_reversible',
  'rollback_pending',
  'new_authoritative_final',
]);

// ───────────────────────────────────────────────────────────────────
// 2. VALIDATION
// ───────────────────────────────────────────────────────────────────

function isNonEmptyString(value: JsonValue | undefined): value is string {
  return typeof value === 'string' && value.trim() !== '' && value.length <= 4_096;
}

function isNonNegativeInteger(value: JsonValue | undefined): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
}

function isPositiveInteger(value: JsonValue | undefined): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value > 0;
}

function validateDecisionPayload(payload: Readonly<JsonObject>): boolean {
  const stringFields = [
    'decision_id',
    'request_id',
    'reason_code',
    'mode',
    'domain_ledger_id',
    'stream_id',
    'prior_head_hash',
    'prior_state_version',
    'prior_state_fingerprint',
    'requested_event_id',
    'requested_event_type',
    'requested_event_digest',
    'event_registry_digest',
    'actor_id',
    'capability_id',
    'policy_id',
    'policy_digest',
    'evaluator_version',
    'request_digest',
    'evidence_digest',
    'correlation_id',
    'idempotency_key_digest',
    'decided_at',
    'expires_at',
    'decision_digest',
  ];
  if (stringFields.some((field) => !isNonEmptyString(payload[field]))) return false;
  if (!VERDICTS.has(payload.decision as AuthorizationVerdict)) return false;
  if (!AUTHORITY_STATES.has(payload.authority_state as AuthorityState)) return false;
  if (!isNonNegativeInteger(payload.prior_head_sequence)) return false;
  if (!isPositiveInteger(payload.requested_event_version)) return false;
  if (!isPositiveInteger(payload.authority_epoch)) return false;
  if (!isPositiveInteger(payload.policy_version)) return false;
  if (payload.causation_id !== null && !isNonEmptyString(payload.causation_id)) return false;
  if (
    !Array.isArray(payload.matched_rule_ids)
    || payload.matched_rule_ids.some((ruleId) => !isNonEmptyString(ruleId))
  ) {
    return false;
  }
  return true;
}

/** Create the schema-closed registry used only for gateway decision events. */
export function createAuthorizationDecisionRegistry(): EventTypeRegistry {
  const definition: EventTypeDefinition = {
    eventType: AUTHORIZATION_DECISION_EVENT_TYPE,
    currentVersion: 1,
    versions: [{
      version: 1,
      payload: {
        requiredFields: DECISION_FIELDS,
        validate: validateDecisionPayload,
      },
    }],
    upcasters: [],
  };
  return new EventTypeRegistry([definition]);
}

/** Narrow a validated decision-event payload to its closed decision record. */
export function asAuthorizationDecisionRecord(
  payload: Readonly<JsonObject>,
): AuthorizationDecisionRecord {
  if (!validateDecisionPayload(payload)) {
    throw new TypeError('Authorization decision payload does not match the closed schema');
  }
  return payload as AuthorizationDecisionRecord;
}

export type { AuthorizationReasonCode };
