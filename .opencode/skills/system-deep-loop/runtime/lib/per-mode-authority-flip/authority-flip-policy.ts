// ───────────────────────────────────────────────────────────────────
// MODULE: Per-Mode Authority Flip — Transition Policy
// ───────────────────────────────────────────────────────────────────

import {
  AuthorizationReasonCodes,
  AuthorizationVerdicts,
  TransitionPolicyRegistry,
} from '../authorized-ledger/index.js';
import { AUTHORITY_FLIP_EVENT_TYPE } from './types.js';

import type {
  PolicyEvaluationInput,
  PolicyEvaluationResult,
  TransitionPolicyDefinition,
} from '../authorized-ledger/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const AUTHORITY_FLIP_POLICY_ID = 'per-mode-authority-flip';
export const AUTHORITY_FLIP_POLICY_VERSION = 1;
export const AUTHORITY_FLIP_EVENT_RULE_ID = 'authority-flip-event-type';
export const AUTHORITY_FLIP_STATE_RULE_ID = 'authority-flip-cutover-ready';
export const AUTHORITY_FLIP_ACTOR_RULE_ID = 'authority-flip-actor-authority';

const AUTHORITY_FLIP_RULE_IDS = Object.freeze([
  AUTHORITY_FLIP_ACTOR_RULE_ID,
  AUTHORITY_FLIP_EVENT_RULE_ID,
  AUTHORITY_FLIP_STATE_RULE_ID,
]);

// ───────────────────────────────────────────────────────────────────
// 2. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

export interface AuthorityFlipPolicyOptions {
  readonly authorizedActorIds: readonly string[];
  readonly authorizedCapabilityIds: readonly string[];
}

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

function normalizeAllowlist(values: readonly string[], field: string): readonly string[] {
  const normalized = [...new Set(values)]
    .filter((value) => typeof value === 'string' && value.trim().length > 0)
    .sort();
  if (normalized.length === 0) {
    throw new TypeError(`${field} must contain at least one non-empty identity`);
  }
  return Object.freeze(normalized);
}

function deny(
  reasonCode: typeof AuthorizationReasonCodes[keyof typeof AuthorizationReasonCodes],
  matchedRuleIds: readonly string[],
): PolicyEvaluationResult {
  return Object.freeze({
    verdict: AuthorizationVerdicts.DENY,
    reasonCode,
    matchedRuleIds: Object.freeze([...matchedRuleIds]),
  });
}

function allow(): PolicyEvaluationResult {
  return Object.freeze({
    verdict: AuthorizationVerdicts.ALLOW,
    reasonCode: AuthorizationReasonCodes.ALLOWED,
    matchedRuleIds: AUTHORITY_FLIP_RULE_IDS,
  });
}

function buildEvaluator(
  authorizedActorIds: readonly string[],
  authorizedCapabilityIds: readonly string[],
): (input: Readonly<PolicyEvaluationInput>) => PolicyEvaluationResult {
  return (input) => {
    if (input.requestedEventType !== AUTHORITY_FLIP_EVENT_TYPE) {
      return deny(AuthorizationReasonCodes.UNSUPPORTED_EVENT, [AUTHORITY_FLIP_EVENT_RULE_ID]);
    }
    if (input.authorityState !== 'cutover_ready') {
      return deny(AuthorizationReasonCodes.POLICY_DENIED, [AUTHORITY_FLIP_STATE_RULE_ID]);
    }
    if (
      !authorizedActorIds.includes(input.actorId)
      || !authorizedCapabilityIds.includes(input.capabilityId)
    ) {
      return deny(AuthorizationReasonCodes.POLICY_DENIED, [AUTHORITY_FLIP_ACTOR_RULE_ID]);
    }
    return allow();
  };
}

// ───────────────────────────────────────────────────────────────────
// 4. PUBLIC FACTORY
// ───────────────────────────────────────────────────────────────────

/** Build the immutable policy registry that gates authority-flip appends. */
export function createAuthorityFlipTransitionPolicyRegistry(
  options: AuthorityFlipPolicyOptions,
): TransitionPolicyRegistry {
  const authorizedActorIds = normalizeAllowlist(options.authorizedActorIds, 'authorizedActorIds');
  const authorizedCapabilityIds = normalizeAllowlist(
    options.authorizedCapabilityIds,
    'authorizedCapabilityIds',
  );
  const definition: TransitionPolicyDefinition = {
    policyId: AUTHORITY_FLIP_POLICY_ID,
    policyVersion: AUTHORITY_FLIP_POLICY_VERSION,
    evaluatorVersion: 'authority-flip-policy-v1',
    ruleIds: AUTHORITY_FLIP_RULE_IDS,
    capturedAuthorizationState: {
      authorizedActorIds: [...authorizedActorIds],
      authorizedCapabilityIds: [...authorizedCapabilityIds],
    },
    evaluate: buildEvaluator(authorizedActorIds, authorizedCapabilityIds),
  };
  return new TransitionPolicyRegistry([definition]);
}
