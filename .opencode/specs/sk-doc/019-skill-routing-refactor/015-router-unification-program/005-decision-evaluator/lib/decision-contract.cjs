// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Decision Contract Guard                                      ║
// ║ PURPOSE: Enforce the closed route-decision algebra at the boundary.      ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const {
  canonicalize,
  computeBasePolicyHash,
  computeEffectivePolicyHash,
} = require('../../000-contract-schemas/lib/canonical.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const ACTIONS = Object.freeze(['route', 'clarify', 'defer', 'reject']);
const SELECTION_KINDS = Object.freeze(['single', 'orderedBundle', 'surfaceBundle']);
const TARGET_ROLES = Object.freeze(['actor', 'evidence', 'transport', 'judgment']);
const DEFER_REASONS = Object.freeze([
  'idle',
  'no-match',
  'dependency-failure',
  'handoff-required',
  'stale-policy',
  'evidence-unavailable',
]);
const REJECT_REASONS = Object.freeze(['invalid', 'forbidden']);
const RECOVERY_ACTIONS = Object.freeze(['clarify', 'handoff', 'defer', 'reject']);
const RANK_KINDS = Object.freeze(['rankScore', 'scoreMargin']);
const BASIS_KINDS = Object.freeze(['signal', 'bounded-default', 'degraded-fallback']);
const DESTINATION_FIELDS = Object.freeze([
  'skillId',
  'workflowMode',
  'packetId',
  'packetKind',
  'backendKind',
]);
const DECIMAL_PATTERN = /^-?(0|[1-9][0-9]*)(\.[0-9]+)?$/;
const EVIDENCE_REFERENCE_PATTERN = /^(advisor|authored|runtime|compatibility):\S(?:.*\S)?$/;

// ─────────────────────────────────────────────────────────────────────────────
// 3. ERRORS AND HELPERS
// ─────────────────────────────────────────────────────────────────────────────

class DecisionValidationError extends TypeError {
  /**
   * Create a validation error with a stable machine-readable reason.
   *
   * @param {string} code - Stable rejection reason.
   * @param {string} message - Human-readable validation detail.
   */
  constructor(code, message) {
    super(message);
    this.name = 'DecisionValidationError';
    this.code = code;
  }
}

function fail(code, message) {
  throw new DecisionValidationError(code, message);
}

function isPlainObject(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function assertPlainObject(value, code, label) {
  if (!isPlainObject(value)) fail(code, `${label} must be a plain object`);
}

function assertExactKeys(value, allowedKeys, code, label) {
  const allowed = new Set(allowedKeys);
  const extra = Object.keys(value).filter((key) => !allowed.has(key));
  if (extra.length > 0) fail(code, `${label} contains unsupported fields: ${extra.join(', ')}`);
}

function assertNonEmptyString(value, code, label) {
  if (typeof value !== 'string' || !/\S/.test(value)) {
    fail(code, `${label} must be a non-empty string`);
  }
}

function cloneValue(value) {
  if (Array.isArray(value)) return value.map(cloneValue);
  if (!isPlainObject(value)) return value;
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, cloneValue(item)]));
}

function deepFreeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    for (const item of Object.values(value)) deepFreeze(item);
    Object.freeze(value);
  }
  return value;
}

function destinationKey(destinationId) {
  return canonicalize(destinationId);
}

function assertDestinationId(destinationId, code = 'TARGET_DESTINATION_INVALID') {
  assertPlainObject(destinationId, code, 'destinationId');
  assertExactKeys(
    destinationId,
    [...DESTINATION_FIELDS, 'runtimeDiscriminator'],
    code,
    'destinationId'
  );
  for (const field of DESTINATION_FIELDS) {
    assertNonEmptyString(destinationId[field], code, `destinationId.${field}`);
  }
  if (destinationId.runtimeDiscriminator !== undefined) {
    assertNonEmptyString(
      destinationId.runtimeDiscriminator,
      code,
      'destinationId.runtimeDiscriminator'
    );
  }
}

function assertRoutePolicy(policy) {
  assertPlainObject(policy, 'ROUTE_POLICY_REQUIRED', 'policy');
  if (!Array.isArray(policy.destinations) || !Array.isArray(policy.compositionRules)) {
    fail('ROUTE_POLICY_INVALID', 'route parsing requires policy destinations and composition rules');
  }
  if (!Array.isArray(policy.authorityGraph)) {
    fail('ROUTE_POLICY_INVALID', 'route parsing requires a policy authority graph');
  }
  if (computeBasePolicyHash(policy) !== policy.basePolicyHash
    || computeEffectivePolicyHash(policy) !== policy.effectivePolicyHash) {
    fail('ROUTE_POLICY_HASH_INVALID', 'route parsing requires a content-valid policy identity');
  }

  const index = new Map();
  for (const destination of policy.destinations) {
    assertPlainObject(destination, 'ROUTE_POLICY_DESTINATION_INVALID', 'policy destination');
    assertDestinationId(destination.id, 'ROUTE_POLICY_DESTINATION_INVALID');
    const key = destinationKey(destination.id);
    if (index.has(key)) {
      fail('ROUTE_POLICY_DESTINATION_DUPLICATE', 'policy destination identities must be unique');
    }
    index.set(key, destination);
  }

  const relationsByAuthority = new Map();
  const relationsByDestination = new Map();
  for (const edge of policy.authorityGraph) {
    assertPlainObject(edge, 'ROUTE_POLICY_AUTHORITY_GRAPH_INVALID', 'policy authority edge');
    assertNonEmptyString(
      edge.fromAuthorityRef,
      'ROUTE_POLICY_AUTHORITY_GRAPH_INVALID',
      'policy authority edge.fromAuthorityRef'
    );
    assertDestinationId(edge.toDestinationId, 'ROUTE_POLICY_AUTHORITY_GRAPH_INVALID');
    if (!['approveBeforeCommit', 'evidenceOnly'].includes(edge.relation)) {
      fail('ROUTE_POLICY_AUTHORITY_GRAPH_INVALID', 'policy authority relation is outside the closed vocabulary');
    }
    if (!index.has(destinationKey(edge.toDestinationId))) {
      fail('ROUTE_POLICY_AUTHORITY_GRAPH_INVALID', 'policy authority edge targets an undeclared destination');
    }
    if (!relationsByAuthority.has(edge.fromAuthorityRef)) {
      relationsByAuthority.set(edge.fromAuthorityRef, new Set());
    }
    relationsByAuthority.get(edge.fromAuthorityRef).add(edge.relation);
    const targetKey = destinationKey(edge.toDestinationId);
    if (!relationsByDestination.has(targetKey)) {
      relationsByDestination.set(targetKey, new Set());
    }
    relationsByDestination.get(targetKey).add(edge.relation);
  }

  for (const relations of relationsByAuthority.values()) {
    if (relations.size !== 1) {
      fail('ROUTE_POLICY_AUTHORITY_CLASS_CONFLICT', 'one authority reference cannot span authority classes');
    }
  }
  for (const destination of policy.destinations) {
    const relations = relationsByAuthority.get(destination.authorityRef);
    if (['evidence', 'transport'].includes(destination.role)
      && relations?.has('approveBeforeCommit')) {
      fail(
        'POLICY_NON_ACTOR_COMMIT_AUTHORITY_FORBIDDEN',
        'evidence and transport destinations cannot hold commit authority'
      );
    }
    if (destination.role !== 'evidence') continue;
    const incomingRelations = relationsByDestination.get(destinationKey(destination.id));
    if (incomingRelations?.has('approveBeforeCommit')) {
      fail(
        'POLICY_EVIDENCE_COMMIT_AUTHORITY_FORBIDDEN',
        'evidence destinations cannot receive commit authority through another reference'
      );
    }
    const hasEvidenceEdge = policy.authorityGraph.some((edge) => (
      edge.fromAuthorityRef === destination.authorityRef
      && edge.relation === 'evidenceOnly'
      && destinationKey(edge.toDestinationId) === destinationKey(destination.id)
    ));
    if (!relations || !relations.has('evidenceOnly') || !hasEvidenceEdge) {
      fail(
        'POLICY_EVIDENCE_AUTHORITY_INVALID',
        'evidence destinations require a matching evidenceOnly authority edge'
      );
    }
  }
  return index;
}

function assertTarget(target, policyIndex) {
  assertPlainObject(target, 'TARGET_INVALID', 'target');
  assertExactKeys(
    target,
    ['destinationId', 'role', 'authorityRef', 'mutatesWorkspace'],
    'TARGET_FIELDS_INVALID',
    'target'
  );
  assertDestinationId(target.destinationId);
  if (!TARGET_ROLES.includes(target.role)) {
    fail('TARGET_ROLE_INVALID', `target role must be one of ${TARGET_ROLES.join(', ')}`);
  }
  assertNonEmptyString(target.authorityRef, 'TARGET_AUTHORITY_INVALID', 'target.authorityRef');
  if (typeof target.mutatesWorkspace !== 'boolean') {
    fail('TARGET_MUTATION_FLAG_INVALID', 'target.mutatesWorkspace must be boolean');
  }
  if (target.role === 'evidence' && target.mutatesWorkspace) {
    fail('EVIDENCE_TARGET_MUTATION_FORBIDDEN', 'evidence targets cannot mutate the workspace');
  }
  if (policyIndex) {
    const declared = policyIndex.get(destinationKey(target.destinationId));
    if (!declared) {
      fail('TARGET_NOT_IN_POLICY', 'target identity tuple is absent from policy.destinations');
    }
    if (target.role !== declared.role
      || target.authorityRef !== declared.authorityRef
      || target.mutatesWorkspace !== declared.mutatesWorkspace) {
      fail('TARGET_DECLARATION_MISMATCH', 'target role or authority differs from policy declaration');
    }
  }
}

function assertRankEvidence(evidence) {
  assertPlainObject(evidence, 'RANK_EVIDENCE_INVALID', 'route evidence');
  assertExactKeys(
    evidence,
    ['kind', 'value', 'nonAuthority'],
    'RANK_EVIDENCE_FIELDS_INVALID',
    'route evidence'
  );
  if (!RANK_KINDS.includes(evidence.kind)) {
    fail('RANK_EVIDENCE_KIND_INVALID', 'route evidence kind is not rankScore or scoreMargin');
  }
  if (typeof evidence.value !== 'string' || !DECIMAL_PATTERN.test(evidence.value)) {
    fail('RANK_EVIDENCE_VALUE_INVALID', 'rank evidence value must be a decimal string');
  }
  if (evidence.nonAuthority !== true) {
    fail('RANK_EVIDENCE_AUTHORITY_FORBIDDEN', 'rank evidence must be marked nonAuthority');
  }
}

function assertBasis(basis) {
  assertPlainObject(basis, 'ROUTE_BASIS_INVALID', 'route basis');
  if (!BASIS_KINDS.includes(basis.kind)) {
    fail('ROUTE_BASIS_KIND_INVALID', 'route basis kind is outside the closed vocabulary');
  }
  if (basis.kind !== 'degraded-fallback') {
    assertExactKeys(basis, ['kind'], 'ROUTE_BASIS_FIELDS_INVALID', 'route basis');
    return;
  }
  if (basis.cached === true) {
    fail('DEGRADED_FALLBACK_CACHED', 'degraded fallback must never be cached');
  }
  if (basis.mutatesWorkspace === true) {
    fail('DEGRADED_FALLBACK_MUTATING', 'degraded fallback must be read-only');
  }
  if (basis.visibleBeforeRun === false) {
    fail('DEGRADED_FALLBACK_NOT_VISIBLE', 'degraded fallback must be visible before execution');
  }
  if (!Array.isArray(basis.unavailableEvidence) || basis.unavailableEvidence.length === 0) {
    fail('DEGRADED_FALLBACK_UNNAMED', 'degraded fallback must name unavailable evidence');
  }
  for (const reference of basis.unavailableEvidence) {
    if (typeof reference !== 'string' || !EVIDENCE_REFERENCE_PATTERN.test(reference)) {
      fail('DEGRADED_FALLBACK_EVIDENCE_INVALID', 'unavailable evidence reference is malformed');
    }
  }
  assertExactKeys(
    basis,
    ['kind', 'unavailableEvidence'],
    'DEGRADED_FALLBACK_FIELDS_INVALID',
    'degraded fallback'
  );
}

function assertComposition(route, policy) {
  if (route.selectionKind === 'single' && route.targets.length !== 1) {
    fail('SINGLE_TARGET_COUNT_INVALID', 'single routes require exactly one target');
  }
  if (route.selectionKind !== 'single' && route.targets.length < 2) {
    fail('BUNDLE_TARGET_COUNT_INVALID', 'bundle routes require at least two targets');
  }
  if (route.selectionKind === 'surfaceBundle') {
    const actors = route.targets.filter((target) => target.role === 'actor');
    const evidence = route.targets.filter((target) => target.role === 'evidence');
    if (actors.length !== 1 || evidence.length !== route.targets.length - 1 || evidence.length === 0) {
      fail(
        'SURFACE_BUNDLE_ROLE_INVALID',
        'surfaceBundle requires exactly one actor and one or more evidence targets'
      );
    }
  }
  if (!policy || route.selectionKind === 'single') return;
  const targetKeys = route.targets.map((target) => destinationKey(target.destinationId));
  const matchingRule = policy.compositionRules.some((rule) => {
    if (rule.kind !== route.selectionKind || rule.targetIds.length !== targetKeys.length) return false;
    return rule.targetIds.every((id, index) => destinationKey(id) === targetKeys[index]);
  });
  if (!matchingRule) {
    fail('BUNDLE_NOT_IN_POLICY', 'bundle target order is absent from policy.compositionRules');
  }
}

function assertRouteBranch(decision, policy, policyIndex) {
  const route = decision.route;
  assertPlainObject(route, 'ROUTE_PAYLOAD_INVALID', 'route');
  const recoveryFields = ['clarify', 'handoff', 'recovery', 'budgetRef', 'question', 'alternatives'];
  const forbidden = recoveryFields.filter((field) => Object.prototype.hasOwnProperty.call(route, field));
  if (forbidden.length > 0) {
    fail('ROUTE_RECOVERY_ARTIFACT_FORBIDDEN', `route contains recovery artifacts: ${forbidden.join(', ')}`);
  }
  assertExactKeys(
    route,
    ['selectionKind', 'targets', 'basis', 'evidence', 'authority'],
    'ROUTE_FIELDS_INVALID',
    'route'
  );
  if (!SELECTION_KINDS.includes(route.selectionKind)) {
    fail('ROUTE_SELECTION_KIND_INVALID', 'route selectionKind is outside the closed vocabulary');
  }
  if (!Array.isArray(route.targets) || route.targets.length === 0) {
    fail('ROUTE_TARGETS_EMPTY', 'route requires a non-empty targets array');
  }
  if (route.authority !== 'WithheldUntilVerify') {
    fail('ROUTE_AUTHORITY_INVALID', 'route authority must be WithheldUntilVerify');
  }
  assertBasis(route.basis);
  if (!Array.isArray(route.evidence)) {
    fail('ROUTE_EVIDENCE_INVALID', 'route evidence must be an array');
  }
  for (const target of route.targets) assertTarget(target, policyIndex);
  for (const evidence of route.evidence) assertRankEvidence(evidence);
  assertComposition(route, policy);
}

function assertNegativeBranch(decision) {
  const payload = decision[decision.action];
  assertPlainObject(payload, 'NEGATIVE_PAYLOAD_INVALID', decision.action);
  const targetFields = ['target', 'targets', 'tool', 'tools', 'destination', 'destinationId'];
  const smuggled = targetFields.filter((field) => Object.prototype.hasOwnProperty.call(payload, field));
  if (smuggled.length > 0) {
    fail('NEGATIVE_TARGET_FORBIDDEN', `${decision.action} cannot carry target fields`);
  }
  if (payload.authority !== 'Withheld') {
    fail('NEGATIVE_AUTHORITY_INVALID', `${decision.action} authority must be Withheld`);
  }

  if (decision.action === 'clarify') {
    assertExactKeys(
      payload,
      ['question', 'budgetRef', 'alternatives', 'authority'],
      'CLARIFY_FIELDS_INVALID',
      'clarify'
    );
    assertNonEmptyString(payload.question, 'CLARIFY_QUESTION_INVALID', 'clarify.question');
    assertNonEmptyString(payload.budgetRef, 'CLARIFY_BUDGET_INVALID', 'clarify.budgetRef');
    if (!Array.isArray(payload.alternatives)
      || payload.alternatives.length < 2
      || payload.alternatives.length > 4) {
      fail('CLARIFY_ALTERNATIVES_INVALID', 'clarify requires two to four alternatives');
    }
    for (const alternative of payload.alternatives) {
      assertNonEmptyString(alternative, 'CLARIFY_ALTERNATIVE_INVALID', 'clarify alternative');
      if (/^\s*(authority|capability):/i.test(alternative)) {
        fail('CLARIFY_CAPABILITY_ALTERNATIVE', 'clarify alternatives are display-only');
      }
    }
    return;
  }

  if (decision.action === 'defer') {
    assertExactKeys(payload, ['reason', 'recovery', 'authority'], 'DEFER_FIELDS_INVALID', 'defer');
    if (!DEFER_REASONS.includes(payload.reason)) {
      fail('DEFER_REASON_INVALID', 'defer reason is outside the closed vocabulary');
    }
    if (!Array.isArray(payload.recovery)
      || payload.recovery.some((action) => !RECOVERY_ACTIONS.includes(action))) {
      fail('DEFER_RECOVERY_INVALID', 'defer recovery contains an unknown action');
    }
    return;
  }

  assertExactKeys(payload, ['reason', 'authority'], 'REJECT_FIELDS_INVALID', 'reject');
  if (!REJECT_REASONS.includes(payload.reason)) {
    fail('REJECT_REASON_INVALID', 'reject reason is outside the closed vocabulary');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. PUBLIC GUARDS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse a decision through the closed four-action contract.
 *
 * @param {Object} decision - Candidate decision object.
 * @param {Object} [policy] - Compiled policy used for referential closure.
 * @returns {Object} Immutable validated copy.
 * @throws {DecisionValidationError} When the decision violates the contract.
 */
function parseDecision(decision, policy, requireRoutePolicy) {
  assertPlainObject(decision, 'DECISION_INVALID', 'decision');
  if (Object.prototype.hasOwnProperty.call(decision, 'selectionKind')) {
    fail('DECISION_TOP_LEVEL_SELECTION_KIND', 'selectionKind belongs inside route');
  }
  if (!ACTIONS.includes(decision.action)) {
    fail('DECISION_ACTION_CLOSED_ALGEBRA', 'decision action must be route, clarify, defer, or reject');
  }
  assertExactKeys(
    decision,
    ['schemaVersion', 'action', decision.action],
    'DECISION_FIELDS_INVALID',
    'decision'
  );
  if (decision.schemaVersion !== 'V1') {
    fail('DECISION_SCHEMA_VERSION_INVALID', 'decision schemaVersion must be V1');
  }
  if (decision.action === 'route') {
    const policyIndex = requireRoutePolicy ? assertRoutePolicy(policy) : null;
    assertRouteBranch(decision, policy, policyIndex);
  } else assertNegativeBranch(decision);
  return deepFreeze(cloneValue(decision));
}

/**
 * Parse a decision through shape-only validation without referential authority.
 *
 * @param {Object} decision - Candidate decision object.
 * @returns {Object} Immutable shape-validated copy.
 * @throws {DecisionValidationError} When the decision shape violates the contract.
 */
function parseRouteDecisionShape(decision) {
  return parseDecision(decision, undefined, false);
}

/**
 * Parse a decision through the closed contract and policy authority graph.
 *
 * @param {Object} decision - Candidate decision object.
 * @param {Object} [policy] - Required for every positive route decision.
 * @returns {Object} Immutable validated copy.
 * @throws {DecisionValidationError} When the decision or policy violates the contract.
 */
function parseRouteDecision(decision, policy) {
  return parseDecision(decision, policy, true);
}

module.exports = {
  ACTIONS,
  BASIS_KINDS,
  DEFER_REASONS,
  DecisionValidationError,
  REJECT_REASONS,
  SELECTION_KINDS,
  TARGET_ROLES,
  destinationKey,
  parseRouteDecision,
  parseRouteDecisionShape,
};
