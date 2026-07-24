// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Recovery Ladder                                                         ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const {
  canonicalize,
} = require('../../000-contract-schemas/lib/canonical.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const RUNG_NAMES = Object.freeze([
  'eligibility-authority',
  'route-or-certificate-gated-auto-route',
  'clarify',
  'handoff',
  'defer',
  'reject',
]);

const DEFER_REASONS = Object.freeze([
  'idle',
  'no-match',
  'dependency-failure',
  'handoff-required',
  'stale-policy',
  'evidence-unavailable',
]);

const NONE_OF_THESE = 'none_of_these';
const MAX_ROUTE_OPTIONS = 3;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function snapshot(value) {
  return JSON.parse(canonicalize(value));
}

function isPlainObject(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function assertPlainObject(value, label) {
  if (!isPlainObject(value)) {
    throw new TypeError(`${label} must be an object`);
  }
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function assertNonEmptyString(value, label) {
  if (!isNonEmptyString(value)) {
    throw new TypeError(`${label} must be a non-empty string`);
  }
}

function uniqueStrings(values) {
  return [...new Set((values || []).map(String))];
}

function createTrace() {
  return {
    rungInvocations: [],
    rankCalls: 0,
    rescoreCalls: 0,
    handoffAttempts: 0,
    downstreamNeedsInputAttempts: 0,
    ownershipTransfers: [],
    callerContractViolations: [],
    terminalRung: null,
    terminalReason: null,
  };
}

function createBudgetState(request) {
  const supplied = request.budgetState;
  const violations = [];
  const expectedBudgetId = `budget:${request.requestId}`;
  if (supplied !== undefined && !isPlainObject(supplied)) {
    violations.push('budget-state-not-object');
  }
  const state = isPlainObject(supplied) ? supplied : {};
  if (supplied !== undefined && state.requestId !== request.requestId) {
    violations.push('budget-state-request-mismatch');
  }
  if (supplied !== undefined && state.contract?.budgetId !== expectedBudgetId) {
    violations.push('budget-state-id-mismatch');
  }
  const validUserTurns = state.userTurnsUsed === undefined
    || (Number.isInteger(state.userTurnsUsed) && state.userTurnsUsed >= 0 && state.userTurnsUsed <= 1);
  const validHandoffHops = state.handoffHopsUsed === undefined
    || (Number.isInteger(state.handoffHopsUsed) && state.handoffHopsUsed >= 0 && state.handoffHopsUsed <= 1);
  const validVisited = state.visited === undefined
    || (Array.isArray(state.visited) && state.visited.every((value) => typeof value === 'string'));
  const validClarification = state.clarification === undefined
    || state.clarification === null
    || isPlainObject(state.clarification);
  if (!validUserTurns) violations.push('budget-state-user-turns-invalid');
  if (!validHandoffHops) violations.push('budget-state-handoff-hops-invalid');
  if (!validVisited) violations.push('budget-state-visited-invalid');
  if (!validClarification) violations.push('budget-state-clarification-invalid');

  const visited = validVisited ? uniqueStrings(state.visited) : [];
  return {
    budget: {
      requestId: request.requestId,
      contract: {
        schemaVersion: 'V1',
        budgetId: expectedBudgetId,
        userTurns: 1,
        handoffHops: 1,
        visited,
      },
      userTurnsUsed: validUserTurns && Number.isInteger(state.userTurnsUsed)
        ? state.userTurnsUsed
        : 0,
      handoffHopsUsed: validHandoffHops && Number.isInteger(state.handoffHopsUsed)
        ? state.handoffHopsUsed
        : 0,
      visited,
      clarification: validClarification && state.clarification
        ? snapshot(state.clarification)
        : null,
    },
    violations,
  };
}

const ROUTE_BRANCH_KEYS = Object.freeze(['selectionKind', 'targets', 'basis', 'evidence', 'authority']);
const ROUTE_RECOVERY_ARTIFACTS = Object.freeze([
  'clarify', 'handoff', 'recovery', 'budgetRef', 'question', 'alternatives',
]);
const NEGATIVE_TARGET_FIELDS = Object.freeze([
  'target', 'targets', 'tool', 'tools', 'destination', 'destinationId',
]);
const CLARIFY_BRANCH_KEYS = Object.freeze(['question', 'budgetRef', 'alternatives', 'authority']);
const DEFER_BRANCH_KEYS = Object.freeze(['reason', 'recovery', 'authority']);
const REJECT_BRANCH_KEYS = Object.freeze(['reason', 'authority']);
const SELECTION_KINDS = Object.freeze(['single', 'orderedBundle', 'surfaceBundle']);

function hasExactKeys(value, allowedKeys) {
  const keys = Object.keys(value);
  return keys.length === allowedKeys.length && keys.every((key) => allowedKeys.includes(key));
}

function hasAnyKey(value, keyList) {
  return keyList.some((key) => Object.prototype.hasOwnProperty.call(value, key));
}

// A confident decision bypasses the ladder, so it must already satisfy the closed-algebra
// shape. Enforce it with an exact-key allowlist per branch (not a forbidden-key denylist): a
// target-bearing negative or a recovery-artifact-bearing route then becomes structurally
// unrepresentable rather than merely discouraged, and a stray key of any name is rejected.
function isValidDecision(decision) {
  if (!isPlainObject(decision) || decision.schemaVersion !== 'V1') return false;
  if (!['route', 'clarify', 'defer', 'reject'].includes(decision.action)) return false;
  const expectedKeys = ['action', 'schemaVersion', decision.action].sort();
  if (canonicalize(Object.keys(decision).sort()) !== canonicalize(expectedKeys)) return false;
  const branch = decision[decision.action];
  if (!isPlainObject(branch)) return false;

  if (decision.action === 'route') {
    if (hasAnyKey(branch, ROUTE_RECOVERY_ARTIFACTS)) return false;
    if (!hasExactKeys(branch, ROUTE_BRANCH_KEYS)) return false;
    return SELECTION_KINDS.includes(branch.selectionKind)
      && Array.isArray(branch.targets)
      && branch.targets.length > 0
      && branch.targets.every(isPlainObject)
      && branch.authority === 'WithheldUntilVerify';
  }

  if (hasAnyKey(branch, NEGATIVE_TARGET_FIELDS)) return false;
  if (branch.authority !== 'Withheld') return false;
  if (decision.action === 'clarify') {
    if (!hasExactKeys(branch, CLARIFY_BRANCH_KEYS)) return false;
    return isNonEmptyString(branch.question)
      && Array.isArray(branch.alternatives)
      && branch.alternatives.length >= 2
      && branch.alternatives.length <= 4
      && branch.alternatives.at(-1) === NONE_OF_THESE;
  }
  if (decision.action === 'defer') {
    if (!hasExactKeys(branch, DEFER_BRANCH_KEYS)) return false;
    return DEFER_REASONS.includes(branch.reason);
  }
  if (!hasExactKeys(branch, REJECT_BRANCH_KEYS)) return false;
  return ['invalid', 'forbidden'].includes(branch.reason);
}

function isRouteCandidate(candidate) {
  return isPlainObject(candidate) && isPlainObject(candidate.target);
}

function clarificationFingerprint(clarify) {
  // Bind the candidate's compatibility/resource identity into the fingerprint, not just its
  // target: otherwise a continuation whose resources changed between ask and answer still
  // matches and emits the wrong compatibility.
  return canonicalize({
    question: clarify.question,
    routeOptions: clarify.routeOptions,
    discriminatingAnswer: clarify.discriminatingAnswer,
    target: clarify.legalLocalCandidate.target,
    compatibility: clarify.legalLocalCandidate.compatibility ?? null,
  });
}

function isPaidClarificationContinuation(request, budget, clarify) {
  return request.budgetState !== undefined
    && budget.userTurnsUsed === 1
    && budget.clarification?.status === 'awaiting-answer'
    && budget.clarification.fingerprint === clarificationFingerprint(clarify);
}

function rejectCallerContract(reason, trace, budget, ownerId) {
  trace.callerContractViolations.push(reason);
  trace.terminalRung = RUNG_NAMES[2];
  trace.terminalReason = reason;
  return finish(makeReject('invalid'), null, trace, budget, ownerId);
}

function makeRoute(candidate, evidence = []) {
  assertPlainObject(candidate, 'route candidate');
  assertPlainObject(candidate.target, 'route candidate target');
  return {
    schemaVersion: 'V1',
    action: 'route',
    route: {
      selectionKind: 'single',
      targets: [snapshot(candidate.target)],
      basis: { kind: 'signal' },
      evidence: snapshot(evidence),
      authority: 'WithheldUntilVerify',
    },
  };
}

function makeClarify(question, budgetRef, alternatives) {
  return {
    schemaVersion: 'V1',
    action: 'clarify',
    clarify: {
      question,
      budgetRef,
      alternatives,
      authority: 'Withheld',
    },
  };
}

function makeDefer(reason, recovery = []) {
  if (!DEFER_REASONS.includes(reason)) {
    throw new TypeError(`unsupported defer reason: ${reason}`);
  }
  return {
    schemaVersion: 'V1',
    action: 'defer',
    defer: {
      reason,
      recovery,
      authority: 'Withheld',
    },
  };
}

function makeReject(reason) {
  if (!['invalid', 'forbidden'].includes(reason)) {
    throw new TypeError(`unsupported reject reason: ${reason}`);
  }
  return {
    schemaVersion: 'V1',
    action: 'reject',
    reject: {
      reason,
      authority: 'Withheld',
    },
  };
}

function finish(decision, compatibility, trace, budget, ownerId) {
  const continuation = snapshot(budget);
  return snapshot({
    decision,
    compatibility: compatibility || null,
    trace,
    budgetState: continuation,
    budget: continuation,
    ownerId: ownerId || null,
  });
}

function invokeRung(trace, rungIndex) {
  trace.rungInvocations.push(RUNG_NAMES[rungIndex]);
}

function terminate(trace, rungIndex, reason) {
  trace.terminalRung = RUNG_NAMES[rungIndex];
  trace.terminalReason = reason;
}

function canSpendUserTurn(budget) {
  return budget.userTurnsUsed < budget.contract.userTurns;
}

function spendUserTurn(budget) {
  if (!canSpendUserTurn(budget)) return false;
  budget.userTurnsUsed += 1;
  return true;
}

function clarifyConfiguration(request) {
  const clarify = request.clarify;
  if (!isPlainObject(clarify)) return null;
  const routeOptions = uniqueStrings(clarify.routeOptions);
  const discriminatingAnswers = uniqueStrings(clarify.discriminatingAnswers);
  const hasLegalCandidate = isRouteCandidate(clarify.legalLocalCandidate);
  const validOptions = routeOptions.length >= 1
    && routeOptions.length <= MAX_ROUTE_OPTIONS
    && !routeOptions.includes(NONE_OF_THESE);
  if (!validOptions || discriminatingAnswers.length !== 1 || !hasLegalCandidate) {
    return null;
  }
  if (!routeOptions.includes(discriminatingAnswers[0])) return null;
  if (!isNonEmptyString(clarify.question)) return null;
  return {
    ...clarify,
    routeOptions,
    discriminatingAnswer: discriminatingAnswers[0],
    alternatives: [...routeOptions, NONE_OF_THESE],
  };
}

function handoffRefusal(reason, trace, budget, ownerId, rejectReason = 'invalid') {
  terminate(trace, 3, reason);
  return finish(makeReject(rejectReason), null, trace, budget, ownerId);
}

function isNamedHandoffSource(handoff) {
  return !!handoff
    && handoff.sourceDecision?.action === 'defer'
    && handoff.sourceDecision?.defer?.reason === 'handoff-required'
    && typeof handoff.namedCandidateId === 'string'
    && handoff.namedCandidateId.length > 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Evaluate the ordered recovery path for one immutable request snapshot.
 *
 * @param {Object} request - Recovery inputs and any already-confident decision.
 * @returns {Object} A public decision plus non-authoritative trace and budget data.
 */
function evaluateRecovery(request) {
  assertPlainObject(request, 'request');
  assertNonEmptyString(request.requestId, 'request.requestId');

  const trace = createTrace();
  const { budget, violations } = createBudgetState(request);
  const ownerId = request.currentDestinationId || null;

  if (violations.length > 0) {
    violations.forEach((violation) => trace.callerContractViolations.push(violation));
    trace.terminalReason = violations[0];
    return finish(makeReject('invalid'), null, trace, budget, ownerId);
  }

  if (request.confidentDecision) {
    if (!isValidDecision(request.confidentDecision)) {
      trace.terminalReason = 'confident-decision-invalid';
      return finish(makeReject('invalid'), null, trace, budget, ownerId);
    }
    return finish(
      request.confidentDecision,
      request.confidentCompatibility,
      trace,
      budget,
      ownerId
    );
  }

  invokeRung(trace, 0);
  if (!isPlainObject(request.gate) || request.gate.eligible !== true) {
    const explicitlyIneligible = request.gate?.eligible === false;
    const reason = request.gate?.denialReason === 'invalid' ? 'invalid' : 'forbidden';
    const rejection = explicitlyIneligible ? reason : 'invalid';
    terminate(trace, 0, explicitlyIneligible ? `eligibility-${reason}` : 'eligibility-unproven');
    return finish(makeReject(rejection), null, trace, budget, ownerId);
  }
  if (request.gate?.authorityDependencyAvailable === false) {
    terminate(trace, 0, 'authority-dependency-missing');
    return finish(makeDefer('dependency-failure'), null, trace, budget, ownerId);
  }
  if (request.gate.authorityDependencyAvailable !== true) {
    terminate(trace, 0, 'authority-dependency-unproven');
    return finish(makeDefer('evidence-unavailable'), null, trace, budget, ownerId);
  }
  if (request.gate?.policyFresh === false) {
    terminate(trace, 0, 'policy-stale');
    return finish(makeDefer('stale-policy'), null, trace, budget, ownerId);
  }
  if (request.gate.policyFresh !== true) {
    terminate(trace, 0, 'policy-freshness-unproven');
    return finish(makeDefer('evidence-unavailable'), null, trace, budget, ownerId);
  }

  invokeRung(trace, 1);
  if (request.exactCandidate) {
    terminate(trace, 1, 'deterministic-exact-route');
    return finish(
      makeRoute(request.exactCandidate),
      request.exactCandidate.compatibility,
      trace,
      budget,
      ownerId
    );
  }
  if (request.rankedCandidate) {
    trace.rankCalls += 1;
  }

  invokeRung(trace, 2);
  const clarify = clarifyConfiguration(request);
  const hasAcceptedAnswer = isPlainObject(request.clarify)
    && Object.hasOwn(request.clarify, 'acceptedAnswer');
  if (hasAcceptedAnswer) {
    if (!clarify || !isPaidClarificationContinuation(request, budget, clarify)) {
      return rejectCallerContract(
        'clarification-budget-state-required',
        trace,
        budget,
        ownerId
      );
    }
    trace.rescoreCalls += 1;
    budget.clarification.status = 'rescored';
    if (clarify.acceptedAnswer === clarify.discriminatingAnswer) {
      terminate(trace, 2, 'clarification-resolved-local-route');
      return finish(
        makeRoute(clarify.legalLocalCandidate),
        clarify.legalLocalCandidate.compatibility,
        trace,
        budget,
        ownerId
      );
    }
    terminate(trace, 2, 'clarification-resolved-no-match');
    return finish(makeDefer('no-match'), null, trace, budget, ownerId);
  }
  if (clarify && canSpendUserTurn(budget)) {
    spendUserTurn(budget);
    budget.clarification = {
      fingerprint: clarificationFingerprint(clarify),
      status: 'awaiting-answer',
    };
    terminate(trace, 2, 'clarification-requested');
    return finish(
      makeClarify(
        clarify.question,
        budget.contract.budgetId,
        clarify.alternatives
      ),
      null,
      trace,
      budget,
      ownerId
    );
  }

  invokeRung(trace, 3);
  const handoff = request.handoff;
  if (handoff) {
    trace.handoffAttempts += 1;
    if (!isNamedHandoffSource(handoff)) {
      return handoffRefusal('handoff-source-invalid', trace, budget, ownerId);
    }
    if (!handoff.candidate
      || handoff.candidate.qualifiedId !== handoff.namedCandidateId
      || handoff.candidate.qualifiedId === ownerId
      || handoff.candidate.viable !== true) {
      return handoffRefusal('handoff-candidate-not-distinct-viable', trace, budget, ownerId);
    }
    if (handoff.policyPermits !== true) {
      return handoffRefusal('handoff-policy-forbidden', trace, budget, ownerId, 'forbidden');
    }
    if (budget.handoffHopsUsed >= budget.contract.handoffHops) {
      return handoffRefusal('handoff-hop-limit', trace, budget, ownerId);
    }
    if (budget.visited.includes(handoff.namedCandidateId)) {
      return handoffRefusal('handoff-visited-destination', trace, budget, ownerId);
    }
    if (!spendUserTurn(budget)) {
      return handoffRefusal('handoff-shared-budget-exhausted', trace, budget, ownerId);
    }

    budget.handoffHopsUsed += 1;
    budget.visited.push(handoff.namedCandidateId);
    budget.contract.visited = uniqueStrings(budget.visited);
    trace.ownershipTransfers.push({
      from: ownerId,
      to: handoff.namedCandidateId,
      accepted: true,
      completionClaimed: false,
    });

    if (handoff.downstreamStatus === 'NEEDS_INPUT') {
      trace.downstreamNeedsInputAttempts += 1;
      terminate(trace, 3, 'downstream-needs-input-no-new-turn');
      return finish(
        makeDefer('evidence-unavailable'),
        null,
        trace,
        budget,
        handoff.namedCandidateId
      );
    }

    terminate(trace, 3, 'handoff-ownership-transferred');
    return finish(
      makeDefer('handoff-required'),
      null,
      trace,
      budget,
      handoff.namedCandidateId
    );
  }

  invokeRung(trace, 4);
  if (request.invalid !== true) {
    const reason = request.deferReason || (request.clarify ? 'no-match' : 'idle');
    if (DEFER_REASONS.includes(reason)) {
      terminate(trace, 4, `defer-${reason}`);
      return finish(makeDefer(reason), null, trace, budget, ownerId);
    }
  }

  invokeRung(trace, 5);
  terminate(trace, 5, 'request-invalid');
  return finish(makeReject('invalid'), null, trace, budget, ownerId);
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  DEFER_REASONS,
  NONE_OF_THESE,
  RUNG_NAMES,
  evaluateRecovery,
};
