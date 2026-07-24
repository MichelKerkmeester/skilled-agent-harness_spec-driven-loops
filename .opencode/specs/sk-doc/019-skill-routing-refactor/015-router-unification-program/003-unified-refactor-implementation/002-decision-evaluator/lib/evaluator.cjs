// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Pure Route Decision Evaluator                                ║
// ║ PURPOSE: Resolve pinned request facts without effects or live authority. ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const {
  computeBasePolicyHash,
  computeEffectivePolicyHash,
  computeRequestFactsHash,
} = require('../../000-contract-schemas/lib/canonical.cjs');
const { destinationKey, parseRouteDecision } = require('./decision-contract.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const OBSERVATION_KINDS = Object.freeze(['intent', 'resource', 'command', 'constraint']);
const EVIDENCE_KINDS = Object.freeze(['advisor', 'authored', 'runtime', 'compatibility']);
const TRUST_STATES = Object.freeze(['live', 'stale', 'absent', 'unavailable']);
const DIGEST_PATTERN = /^[a-f0-9]{64}$/;
const DECIMAL_PATTERN = /^-?(0|[1-9][0-9]*)(\.[0-9]+)?$/;
const RANK_KINDS = Object.freeze(['rankScore', 'scoreMargin']);
const RECOVERY_ACTIONS = Object.freeze(['clarify', 'handoff', 'defer', 'reject']);

// ─────────────────────────────────────────────────────────────────────────────
// 3. CONTRACT VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

function isPlainObject(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function hasExactKeys(value, allowedKeys) {
  const allowed = new Set(allowedKeys);
  return Object.keys(value).every((key) => allowed.has(key));
}

function isNonEmptyString(value) {
  return typeof value === 'string' && /\S/.test(value);
}

function isDestinationId(value) {
  if (!isPlainObject(value)
    || !hasExactKeys(value, [
      'skillId',
      'workflowMode',
      'packetId',
      'packetKind',
      'backendKind',
      'runtimeDiscriminator',
    ])) return false;
  const required = ['skillId', 'workflowMode', 'packetId', 'packetKind', 'backendKind'];
  return required.every((field) => isNonEmptyString(value[field]))
    && (value.runtimeDiscriminator === undefined || isNonEmptyString(value.runtimeDiscriminator));
}

function isValidRequest(request) {
  if (!isPlainObject(request)
    || !hasExactKeys(request, [
      'schemaVersion',
      'requestFactsHash',
      'explicitMode',
      'observations',
      'evidence',
      'pinnedActivationGeneration',
    ])) return false;
  if (request.schemaVersion !== 'V1'
    || !DIGEST_PATTERN.test(request.requestFactsHash)
    || !Number.isInteger(request.pinnedActivationGeneration)
    || request.pinnedActivationGeneration < 0
    || (request.explicitMode !== undefined && !isNonEmptyString(request.explicitMode))
    || !Array.isArray(request.observations)
    || !Array.isArray(request.evidence)) return false;
  const observationsValid = request.observations.every((observation) => (
    isPlainObject(observation)
    && hasExactKeys(observation, ['kind', 'value'])
    && OBSERVATION_KINDS.includes(observation.kind)
    && isNonEmptyString(observation.value)
  ));
  const evidenceValid = request.evidence.every((evidence) => (
    isPlainObject(evidence)
    && hasExactKeys(evidence, ['id', 'kind', 'value', 'provenance', 'trust'])
    && isNonEmptyString(evidence.id)
    && EVIDENCE_KINDS.includes(evidence.kind)
    && typeof evidence.value === 'string'
    && TRUST_STATES.includes(evidence.trust)
    && isPlainObject(evidence.provenance)
    && hasExactKeys(evidence.provenance, ['source', 'capturedAtEpoch'])
    && isNonEmptyString(evidence.provenance.source)
    && Number.isInteger(evidence.provenance.capturedAtEpoch)
    && evidence.provenance.capturedAtEpoch >= 0
  ));
  if (!observationsValid || !evidenceValid) return false;
  try {
    return computeRequestFactsHash(request) === request.requestFactsHash;
  } catch {
    return false;
  }
}

function isValidPolicy(policy) {
  if (!isPlainObject(policy)
    || !hasExactKeys(policy, [
      'schemaVersion',
      'activationGeneration',
      'destinations',
      'detectors',
      'selectors',
      'compositionRules',
      'authorityGraph',
      'thresholdPolicy',
      'recoveryPolicy',
      'provenancePolicy',
      'basePolicyHash',
      'overlayHash',
      'effectivePolicyHash',
    ])) return false;
  if (policy.schemaVersion !== 'V1'
    || !Number.isInteger(policy.activationGeneration)
    || policy.activationGeneration < 0
    || !Array.isArray(policy.destinations)
    || policy.destinations.length === 0
    || !Array.isArray(policy.detectors)
    || !Array.isArray(policy.selectors)
    || !Array.isArray(policy.compositionRules)
    || !Array.isArray(policy.authorityGraph)
    || !DIGEST_PATTERN.test(policy.basePolicyHash)
    || !DIGEST_PATTERN.test(policy.effectivePolicyHash)
    || (policy.overlayHash !== undefined && !DIGEST_PATTERN.test(policy.overlayHash))) return false;
  const destinationsValid = policy.destinations.every((destination) => (
    isPlainObject(destination)
    && hasExactKeys(destination, ['id', 'role', 'authorityRef', 'mutatesWorkspace'])
    && isDestinationId(destination.id)
    && ['actor', 'evidence', 'transport', 'judgment'].includes(destination.role)
    && isNonEmptyString(destination.authorityRef)
    && typeof destination.mutatesWorkspace === 'boolean'
    && !(destination.role === 'evidence' && destination.mutatesWorkspace)
  ));
  if (!destinationsValid) return false;
  const destinationKeys = new Set(policy.destinations.map((destination) => destinationKey(destination.id)));
  if (destinationKeys.size !== policy.destinations.length) return false;
  const destinationByKey = new Map(
    policy.destinations.map((destination) => [destinationKey(destination.id), destination])
  );
  const detectorIds = new Set();
  for (const detector of policy.detectors) {
    if (!isPlainObject(detector)
      || !hasExactKeys(detector, ['id', 'kind', 'value'])
      || !isNonEmptyString(detector.id)
      || !['exact', 'alias', 'resource', 'negative'].includes(detector.kind)
      || (detector.value !== undefined && !isNonEmptyString(detector.value))
      || detectorIds.has(detector.id)) return false;
    detectorIds.add(detector.id);
  }
  const selectorsValid = policy.selectors.every((selector) => (
    isPlainObject(selector)
    && hasExactKeys(selector, ['id', 'destinationId', 'detectorIds'])
    && isNonEmptyString(selector.id)
    && isDestinationId(selector.destinationId)
    && destinationKeys.has(destinationKey(selector.destinationId))
    && Array.isArray(selector.detectorIds)
    && selector.detectorIds.every((id) => detectorIds.has(id))
  ));
  const compositionValid = policy.compositionRules.every((rule) => (
    isPlainObject(rule)
    && hasExactKeys(rule, ['kind', 'targetIds'])
    && ['orderedBundle', 'surfaceBundle'].includes(rule.kind)
    && Array.isArray(rule.targetIds)
    && rule.targetIds.length >= 2
    && rule.targetIds.every((id) => isDestinationId(id) && destinationKeys.has(destinationKey(id)))
    && (rule.kind !== 'surfaceBundle' || (() => {
      const roles = rule.targetIds.map((id) => destinationByKey.get(destinationKey(id)).role);
      return roles.filter((role) => role === 'actor').length === 1
        && roles.filter((role) => role === 'evidence').length === roles.length - 1;
    })())
  ));
  const authorityGraphValid = policy.authorityGraph.every((edge) => (
    isPlainObject(edge)
    && hasExactKeys(edge, ['fromAuthorityRef', 'toDestinationId', 'relation'])
    && isNonEmptyString(edge.fromAuthorityRef)
    && isDestinationId(edge.toDestinationId)
    && destinationKeys.has(destinationKey(edge.toDestinationId))
    && ['approveBeforeCommit', 'evidenceOnly'].includes(edge.relation)
  ));
  const relationsByAuthority = new Map();
  const relationsByDestination = new Map();
  for (const edge of policy.authorityGraph) {
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
  const authorityClassesValid = [...relationsByAuthority.values()].every(
    (relations) => relations.size === 1
  );
  const evidenceAuthoritiesValid = policy.destinations
    .filter((destination) => destination.role === 'evidence')
    .every((destination) => {
      const relations = relationsByAuthority.get(destination.authorityRef);
      const incomingRelations = relationsByDestination.get(destinationKey(destination.id));
      return relations
        && relations.has('evidenceOnly')
        && !incomingRelations?.has('approveBeforeCommit')
        && policy.authorityGraph.some((edge) => (
          edge.fromAuthorityRef === destination.authorityRef
          && edge.relation === 'evidenceOnly'
          && destinationKey(edge.toDestinationId) === destinationKey(destination.id)
        ));
    });
  const nonActorAuthoritiesValid = policy.destinations
    .filter((destination) => ['evidence', 'transport'].includes(destination.role))
    .every((destination) => (
      !relationsByAuthority.get(destination.authorityRef)?.has('approveBeforeCommit')
    ));
  const thresholdValid = isPlainObject(policy.thresholdPolicy)
    && hasExactKeys(policy.thresholdPolicy, ['kind', 'thresholds'])
    && ['exact-admission', 'calibrated', 'guarded-default'].includes(policy.thresholdPolicy.kind)
    && Array.isArray(policy.thresholdPolicy.thresholds)
    && policy.thresholdPolicy.thresholds.every((value) => (
      typeof value === 'string' && DECIMAL_PATTERN.test(value)
    ));
  const recoveryValid = isPlainObject(policy.recoveryPolicy)
    && hasExactKeys(policy.recoveryPolicy, ['ladder', 'userTurns', 'handoffHops'])
    && Array.isArray(policy.recoveryPolicy.ladder)
    && policy.recoveryPolicy.ladder.every((action) => RECOVERY_ACTIONS.includes(action))
    && Number.isInteger(policy.recoveryPolicy.userTurns)
    && policy.recoveryPolicy.userTurns >= 0
    && policy.recoveryPolicy.userTurns <= 1
    && Number.isInteger(policy.recoveryPolicy.handoffHops)
    && policy.recoveryPolicy.handoffHops >= 0
    && policy.recoveryPolicy.handoffHops <= 1;
  const provenanceValid = isPlainObject(policy.provenancePolicy)
    && hasExactKeys(policy.provenancePolicy, ['kind', 'sourceHashes'])
    && ['static', 'offline-learned'].includes(policy.provenancePolicy.kind)
    && Array.isArray(policy.provenancePolicy.sourceHashes)
    && policy.provenancePolicy.sourceHashes.every((hash) => DIGEST_PATTERN.test(hash));
  if (!selectorsValid
    || !compositionValid
    || !authorityGraphValid
    || !authorityClassesValid
    || !evidenceAuthoritiesValid
    || !nonActorAuthoritiesValid
    || !thresholdValid
    || !recoveryValid
    || !provenanceValid) return false;
  try {
    return computeBasePolicyHash(policy) === policy.basePolicyHash
      && computeEffectivePolicyHash(policy) === policy.effectivePolicyHash;
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. EVIDENCE AND SELECTION HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function createTrace() {
  return {
    rankCalls: 0,
    bundleCalls: 0,
    handoffCalls: 0,
  };
}

function normalizeSignal(value) {
  return String(value).trim().toLowerCase();
}

function requestSignals(request) {
  return request.observations.map((observation) => ({
    kind: observation.kind,
    value: normalizeSignal(observation.value),
  }));
}

function detectorMatches(detector, signals) {
  if (!detector.value) return false;
  const expected = normalizeSignal(detector.value);
  return signals.some((signal) => {
    if (detector.kind === 'exact') return signal.value === expected;
    if (detector.kind === 'resource' && signal.kind !== 'resource') return false;
    return signal.value.includes(expected);
  });
}

function hasForbiddenSignal(policy, signals) {
  if (signals.some((signal) => signal.kind === 'constraint' && signal.value === 'forbidden')) {
    return true;
  }
  return policy.detectors
    .filter((detector) => detector.kind === 'negative')
    .some((detector) => detectorMatches(detector, signals));
}

function analyzePolicyEvidence(request, policy) {
  let liveBindingClaims = 0;
  const eligibleAdvisorRanks = [];
  for (const evidence of request.evidence) {
    if (!['runtime', 'compatibility', 'advisor'].includes(evidence.kind)
      || !evidence.value.trim().startsWith('{')) continue;
    let value;
    try {
      value = JSON.parse(evidence.value);
    } catch {
      continue;
    }
    const hasGeneration = Object.prototype.hasOwnProperty.call(value, 'activationGeneration');
    const hasHash = Object.prototype.hasOwnProperty.call(value, 'effectivePolicyHash');
    if (!hasGeneration && !hasHash) continue;
    if (!Number.isInteger(value.activationGeneration)
      || typeof value.effectivePolicyHash !== 'string') {
      return { binding: 'invalid', eligibleAdvisorRanks: [] };
    }
    if (value.activationGeneration !== request.pinnedActivationGeneration
      || value.activationGeneration !== policy.activationGeneration
      || value.effectivePolicyHash !== policy.effectivePolicyHash) {
      return { binding: 'invalid', eligibleAdvisorRanks: [] };
    }
    if (evidence.trust === 'live' && ['runtime', 'compatibility'].includes(evidence.kind)) {
      liveBindingClaims += 1;
    }
    if (evidence.trust === 'live' && evidence.kind === 'advisor') {
      eligibleAdvisorRanks.push(value);
    }
  }
  return {
    binding: liveBindingClaims > 0 ? 'bound' : 'unbound',
    eligibleAdvisorRanks,
  };
}

function collectUnavailableEvidence(request) {
  return request.evidence
    .filter((evidence) => ['absent', 'unavailable'].includes(evidence.trust))
    .map((evidence) => {
      const kindPrefix = `${evidence.kind}:`;
      const opaqueId = evidence.id.startsWith(kindPrefix)
        ? evidence.id.slice(kindPrefix.length)
        : evidence.id;
      const referenceId = opaqueId.length > 0 ? opaqueId : evidence.id;
      const encodedId = /^\S(?:.*\S)?$/.test(referenceId)
        ? referenceId
        : `base64url-${Buffer.from(referenceId, 'utf8').toString('base64url')}`;
      return `${kindPrefix}${encodedId}`;
    });
}

function collectRankEvidence(eligibleAdvisorRanks, trace) {
  trace.rankCalls += 1;
  const rankEvidence = [];
  for (const value of eligibleAdvisorRanks) {
    for (const kind of RANK_KINDS) {
      if (typeof value[kind] === 'string' && /^-?(0|[1-9][0-9]*)(\.[0-9]+)?$/.test(value[kind])) {
        rankEvidence.push({ kind, value: value[kind], nonAuthority: true });
      }
    }
  }
  return rankEvidence;
}

function destinationMatchesSignal(destination, signals) {
  const workflowMode = normalizeSignal(destination.id.workflowMode);
  const qualifiedId = normalizeSignal(`${destination.id.skillId}/${destination.id.workflowMode}`);
  return signals.some((signal) => signal.value === workflowMode || signal.value === qualifiedId);
}

function selectCandidates(policy, signals) {
  const matchedDetectorIds = new Set(
    policy.detectors
      .filter((detector) => detector.kind !== 'negative' && detectorMatches(detector, signals))
      .map((detector) => detector.id)
  );
  const selectedKeys = new Set();
  for (const destination of policy.destinations) {
    if (destinationMatchesSignal(destination, signals)) selectedKeys.add(destinationKey(destination.id));
  }
  for (const selector of policy.selectors) {
    if (selector.detectorIds.length > 0
      && selector.detectorIds.every((id) => matchedDetectorIds.has(id))) {
      selectedKeys.add(destinationKey(selector.destinationId));
    }
  }
  return policy.destinations.filter((destination) => selectedKeys.has(destinationKey(destination.id)));
}

function selectExplicitCandidates(policy, explicitMode) {
  const signal = [{ kind: 'explicitMode', value: normalizeSignal(explicitMode) }];
  return policy.destinations.filter((destination) => destinationMatchesSignal(destination, signal));
}

function targetFromDestination(destination) {
  return {
    destinationId: { ...destination.id },
    role: destination.role,
    authorityRef: destination.authorityRef,
    mutatesWorkspace: destination.mutatesWorkspace,
  };
}

function routeDecision(selectionKind, destinations, basis, rankEvidence, policy) {
  return parseRouteDecision({
    schemaVersion: 'V1',
    action: 'route',
    route: {
      selectionKind,
      targets: destinations.map(targetFromDestination),
      basis,
      evidence: rankEvidence,
      authority: 'WithheldUntilVerify',
    },
  }, policy);
}

function boundRouteDecision(
  identityBinding,
  selectionKind,
  destinations,
  basis,
  rankEvidence,
  policy
) {
  if (identityBinding !== 'bound') return deferDecision('stale-policy');
  return routeDecision(selectionKind, destinations, basis, rankEvidence, policy);
}

function deferDecision(reason, recovery = []) {
  return parseRouteDecision({
    schemaVersion: 'V1',
    action: 'defer',
    defer: { reason, recovery, authority: 'Withheld' },
  });
}

function rejectDecision(reason) {
  return parseRouteDecision({
    schemaVersion: 'V1',
    action: 'reject',
    reject: { reason, authority: 'Withheld' },
  });
}

function clarifyDecision(request, candidates, policy) {
  const source = candidates.length > 0 ? candidates : policy.destinations;
  const alternatives = source
    .slice(0, 3)
    .map((destination) => destination.id.workflowMode);
  alternatives.push('none_of_these');
  return parseRouteDecision({
    schemaVersion: 'V1',
    action: 'clarify',
    clarify: {
      question: 'Which local route matches the request?',
      budgetRef: `budget:${request.requestFactsHash.slice(0, 16)}`,
      alternatives,
      authority: 'Withheld',
    },
  });
}

function selectBundle(policy, candidates, trace) {
  trace.bundleCalls += 1;
  const candidateKeys = new Set(candidates.map((destination) => destinationKey(destination.id)));
  for (const rule of policy.compositionRules) {
    if (rule.targetIds.length !== candidateKeys.size) continue;
    if (!rule.targetIds.every((id) => candidateKeys.has(destinationKey(id)))) continue;
    const byKey = new Map(
      policy.destinations.map((destination) => [destinationKey(destination.id), destination])
    );
    return {
      kind: rule.kind,
      destinations: rule.targetIds.map((id) => byKey.get(destinationKey(id))),
    };
  }
  return null;
}

function basisForRequest(request) {
  const unavailableEvidence = collectUnavailableEvidence(request);
  if (unavailableEvidence.length > 0) {
    return { kind: 'degraded-fallback', unavailableEvidence };
  }
  return { kind: 'signal' };
}

function namedHandoffDestination(policy, signals) {
  const prefix = 'handoff-required:';
  const claims = signals
    .filter((signal) => signal.kind === 'constraint' && signal.value.startsWith(prefix))
    .map((signal) => signal.value.slice(prefix.length));
  if (claims.length !== 1 || claims[0].length === 0) return null;
  return policy.destinations.find((destination) => (
    normalizeSignal(`${destination.id.skillId}/${destination.id.workflowMode}`) === claims[0]
  )) || null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EVALUATOR
// ─────────────────────────────────────────────────────────────────────────────

function evaluateInternal(request, policy, trace) {
  if (!isValidPolicy(policy) || !isValidRequest(request)) return rejectDecision('invalid');
  if (request.pinnedActivationGeneration !== policy.activationGeneration) {
    return deferDecision('stale-policy');
  }
  const policyEvidence = analyzePolicyEvidence(request, policy);
  if (policyEvidence.binding === 'invalid') return rejectDecision('invalid');

  const signals = requestSignals(request);
  if (hasForbiddenSignal(policy, signals)) return rejectDecision('forbidden');

  const hasDependencyFailure = signals.some(
    (signal) => signal.kind === 'constraint' && signal.value === 'dependency-failure'
  );
  const wantsClarification = signals.some(
    (signal) => signal.kind === 'constraint' && signal.value === 'clarify'
  );

  if (hasDependencyFailure) return deferDecision('dependency-failure', ['defer']);
  if (request.explicitMode) {
    const explicitCandidates = selectExplicitCandidates(policy, request.explicitMode);
    if (explicitCandidates.length === 1) {
      return boundRouteDecision(
        policyEvidence.binding,
        'single',
        explicitCandidates,
        basisForRequest(request),
        [],
        policy
      );
    }
    if (explicitCandidates.length > 1 || wantsClarification) {
      return clarifyDecision(request, explicitCandidates, policy);
    }
    return deferDecision('no-match');
  }

  const candidates = selectCandidates(policy, signals);

  if (policy.destinations.length === 1) {
    if (wantsClarification) return clarifyDecision(request, candidates, policy);
    if (candidates.length === 0) return deferDecision('no-match');
    return boundRouteDecision(
      policyEvidence.binding,
      'single',
      candidates,
      basisForRequest(request),
      [],
      policy
    );
  }

  const rankEvidence = collectRankEvidence(policyEvidence.eligibleAdvisorRanks, trace);
  if (wantsClarification) return clarifyDecision(request, candidates, policy);

  if (candidates.length >= 2) {
    const bundle = selectBundle(policy, candidates, trace);
    if (bundle) {
      return boundRouteDecision(
        policyEvidence.binding,
        bundle.kind,
        bundle.destinations,
        basisForRequest(request),
        rankEvidence,
        policy
      );
    }
    return clarifyDecision(request, candidates, policy);
  }
  if (candidates.length === 1) {
    return boundRouteDecision(
      policyEvidence.binding,
      'single',
      candidates,
      basisForRequest(request),
      rankEvidence,
      policy
    );
  }

  const handoffDestination = namedHandoffDestination(policy, signals);
  if (handoffDestination && policy.recoveryPolicy.ladder.includes('handoff')) {
    trace.handoffCalls += 1;
    return deferDecision('handoff-required', ['handoff']);
  }
  if (collectUnavailableEvidence(request).length > 0) {
    return deferDecision('evidence-unavailable', ['defer']);
  }
  return deferDecision('no-match');
}

/**
 * Evaluate a request against one immutable compiled policy.
 *
 * @param {Object} request - Frozen RouteRequestV1 snapshot.
 * @param {Object} policy - Frozen CompiledPolicyV1 snapshot.
 * @returns {Object} Immutable RouteDecisionV1.
 */
function evaluate(request, policy) {
  return evaluateInternal(request, policy, createTrace());
}

/**
 * Evaluate with operation counters used to prove singular constant-folding.
 *
 * @param {Object} request - Frozen RouteRequestV1 snapshot.
 * @param {Object} policy - Frozen CompiledPolicyV1 snapshot.
 * @returns {{decision:Object,trace:{rankCalls:number,bundleCalls:number,handoffCalls:number}}}
 *   Decision and non-authoritative instrumentation.
 */
function evaluateWithTrace(request, policy) {
  const trace = createTrace();
  return { decision: evaluateInternal(request, policy, trace), trace: { ...trace } };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  evaluate,
  evaluateWithTrace,
};
