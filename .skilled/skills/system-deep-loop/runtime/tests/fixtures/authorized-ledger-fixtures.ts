// ───────────────────────────────────────────────────────────────────
// MODULE: Authorized Ledger Fixtures
// ───────────────────────────────────────────────────────────────────

import {
  CURRENT_ENVELOPE_VERSION,
  EventTypeRegistry,
  prepareEventWrite,
  sha256Bytes,
  canonicalBytes,
} from '../../lib/event-envelope/index.js';
import { TransitionPolicyRegistry } from '../../lib/authorized-ledger/index.js';

import type {
  AuthoritySnapshot,
  PolicyEvaluationInput,
  PolicyEvaluationResult,
  TransitionAuthorizationRequest,
} from '../../lib/authorized-ledger/index.js';
import type {
  EventTypeDefinition,
  EventWritePreflight,
  JsonObject,
} from '../../lib/event-envelope/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const FIXTURE_EVENT_TYPE = 'deep-loop.fixture.state-recorded';
export const FIXTURE_LEDGER_ID = 'fixture-domain';
export const FIXTURE_AUDIT_LEDGER_ID = 'fixture-authorization-audit';
export const FIXTURE_TIMESTAMP = '2026-07-20T12:00:00.000Z';
export const FIXTURE_EVIDENCE_DIGEST = sha256Bytes(canonicalBytes({ fixture: 'evidence' }));
export const FIXTURE_AUTHORITY: AuthoritySnapshot = Object.freeze({
  state: 'shadowing',
  epoch: 1,
});

// ───────────────────────────────────────────────────────────────────
// 2. REGISTRIES
// ───────────────────────────────────────────────────────────────────

function validateFixturePayload(payload: Readonly<JsonObject>): boolean {
  return typeof payload.value === 'number'
    && Number.isSafeInteger(payload.value)
    && typeof payload.label === 'string'
    && payload.label.length > 0;
}

function evaluateCapabilityPolicy(
  input: Readonly<PolicyEvaluationInput>,
): PolicyEvaluationResult {
  return input.capabilityId === 'write'
    ? { verdict: 'allow', reasonCode: 'allowed', matchedRuleIds: ['capability-write'] }
    : { verdict: 'deny', reasonCode: 'policy_denied', matchedRuleIds: ['capability-write'] };
}

function evaluateThrowingPolicy(
  _input: Readonly<PolicyEvaluationInput>,
): PolicyEvaluationResult {
  throw new Error('fixture evaluator failure');
}

function evaluateTimeoutPolicy(
  _input: Readonly<PolicyEvaluationInput>,
): Promise<PolicyEvaluationResult> {
  return new Promise(() => undefined);
}

/** Create the exact domain registry shared by parent and worker processes. */
export function createFixtureEventRegistry(): EventTypeRegistry {
  const definition: EventTypeDefinition = {
    eventType: FIXTURE_EVENT_TYPE,
    currentVersion: 1,
    versions: [{
      version: 1,
      payload: {
        requiredFields: ['label', 'value'],
        validate: validateFixturePayload,
      },
    }],
    upcasters: [],
  };
  return new EventTypeRegistry([definition]);
}

/** Create immutable allow, exception, and timeout policies for failure-matrix tests. */
export function createFixturePolicyRegistry(): TransitionPolicyRegistry {
  return new TransitionPolicyRegistry([
    {
      policyId: 'fixture-capability-policy',
      policyVersion: 1,
      evaluatorVersion: '1',
      ruleIds: ['capability-write'],
      evaluate: evaluateCapabilityPolicy,
    },
    {
      policyId: 'fixture-throwing-policy',
      policyVersion: 1,
      evaluatorVersion: '1',
      ruleIds: ['exception-path'],
      evaluate: evaluateThrowingPolicy,
    },
    {
      policyId: 'fixture-timeout-policy',
      policyVersion: 1,
      evaluatorVersion: '1',
      ruleIds: ['timeout-path'],
      evaluate: evaluateTimeoutPolicy,
    },
  ]);
}

// ───────────────────────────────────────────────────────────────────
// 3. BUILDERS
// ───────────────────────────────────────────────────────────────────

/** Build one current-version validated domain event with stable canonical bytes. */
export function createFixtureEvent(
  registry: EventTypeRegistry,
  index: number,
  overrides: Readonly<Record<string, unknown>> = {},
): EventWritePreflight {
  return prepareEventWrite({
    envelope_version: CURRENT_ENVELOPE_VERSION,
    event_id: `fixture-event-${index}`,
    event_type: FIXTURE_EVENT_TYPE,
    event_version: 1,
    stream_id: 'fixture-stream',
    stream_sequence: index,
    occurred_at: FIXTURE_TIMESTAMP,
    recorded_at: FIXTURE_TIMESTAMP,
    producer: { name: 'authorized-ledger-tests', version: '1' },
    authority_epoch: 1,
    correlation_id: `fixture-correlation-${index}`,
    causation_id: index === 1 ? null : `fixture-event-${index - 1}`,
    idempotency_key: `fixture-idempotency-${index}`,
    payload: { label: `event-${index}`, value: index },
    ...overrides,
  }, registry);
}

/** Bind a preflight event to the ledger's currently verified prior head. */
export async function createFixtureRequest(
  ledger: { getVerifiedHead(): Promise<TransitionAuthorizationRequest['priorHead']> },
  event: EventWritePreflight,
  policies: TransitionPolicyRegistry,
  requestId: string,
  overrides: Readonly<Partial<TransitionAuthorizationRequest>> = {},
): Promise<TransitionAuthorizationRequest> {
  const policy = policies.resolve('fixture-capability-policy', 1);
  return {
    requestId,
    mode: 'research',
    event,
    priorHead: await ledger.getVerifiedHead(),
    priorStateVersion: 'fixture-state@1',
    priorStateFingerprint: sha256Bytes(canonicalBytes({ state: 'fixture' })),
    actorId: 'fixture-actor',
    capabilityId: 'write',
    authorityEpoch: 1,
    policy: {
      policyId: policy.policyId,
      policyVersion: policy.policyVersion,
      policyDigest: policy.digest,
    },
    evidenceDigest: FIXTURE_EVIDENCE_DIGEST,
    ...overrides,
  };
}
