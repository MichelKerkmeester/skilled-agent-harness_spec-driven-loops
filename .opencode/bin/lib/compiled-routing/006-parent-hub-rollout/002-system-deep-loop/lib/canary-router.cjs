// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ LIBRARY: REQUEST-PINNED DEEP-LOOP ROUTER                               ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const {
  canonicalize,
  computeRequestFactsHash,
} = require('../../../000-contract-schemas/lib/canonical.cjs');
const {
  parseRouteDecision,
} = require('../../../002-decision-evaluator/lib/decision-contract.cjs');
const {
  evaluateWithTrace,
} = require('../../../002-decision-evaluator/lib/evaluator.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function clone(value) {
  return JSON.parse(canonicalize(value));
}

function advisorDisposition(advisor, projection, policy) {
  if (!advisor || ['absent', 'unavailable'].includes(advisor.trust)) {
    return { contributes: false, evidence: null, reason: 'advisor-zero-evidence' };
  }
  const identityMatches = advisor.trust === 'live'
    && advisor.hubId === projection.hubId
    && advisor.effectivePolicyHash === policy.effectivePolicyHash
    && advisor.projectionHash === projection.projectionHash;
  if (!identityMatches) {
    return {
      contributes: false,
      evidence: {
        id: 'advisor:annotation',
        kind: 'advisor',
        provenance: {
          capturedAtEpoch: policy.activationGeneration,
          source: 'advisor-projection',
        },
        trust: 'stale',
        value: canonicalize({ annotationOnly: true }),
      },
      reason: advisor.trust === 'stale'
        ? 'advisor-stale-annotation-only'
        : 'advisor-projection-drift-annotation-only',
    };
  }
  return {
    contributes: true,
    evidence: {
      id: 'advisor:rank',
      kind: 'advisor',
      provenance: {
        capturedAtEpoch: policy.activationGeneration,
        source: 'advisor-projection',
      },
      trust: 'live',
      value: canonicalize({
        activationGeneration: policy.activationGeneration,
        effectivePolicyHash: policy.effectivePolicyHash,
        rankScore: advisor.rankScore || '0',
        scoreMargin: advisor.scoreMargin || '0',
      }),
    },
    reason: 'advisor-live-identity-match',
  };
}

function buildRequest(snapshot, input) {
  const policy = snapshot.policy;
  const disposition = advisorDisposition(input.advisor, snapshot.advisorProjection, policy);
  const observations = [];
  if (typeof input.prompt === 'string' && /\S/.test(input.prompt)) {
    observations.push({ kind: 'intent', value: input.prompt });
  }
  for (const constraint of input.constraints || []) {
    observations.push({ kind: 'constraint', value: constraint });
  }
  const evidence = [{
    id: 'runtime:activation',
    kind: 'runtime',
    provenance: {
      capturedAtEpoch: policy.activationGeneration,
      source: 'fenced-selector',
    },
    trust: 'live',
    value: canonicalize({
      activationGeneration: policy.activationGeneration,
      effectivePolicyHash: policy.effectivePolicyHash,
    }),
  }];
  if (disposition.evidence) evidence.push(disposition.evidence);
  const request = {
    schemaVersion: 'V1',
    ...(input.explicitMode ? { explicitMode: input.explicitMode } : {}),
    evidence,
    observations,
    pinnedActivationGeneration: policy.activationGeneration,
  };
  request.requestFactsHash = computeRequestFactsHash(request);
  return { advisorDisposition: disposition, request };
}

function clarifyFromChecklist(decision, checklist) {
  if (decision.action !== 'clarify') return decision;
  const candidate = clone(decision);
  candidate.clarify.question = checklist[0];
  candidate.clarify.alternatives = [...checklist.slice(1, 3), 'none_of_these'];
  return parseRouteDecision(candidate);
}

function assertSingleRoute(decision) {
  if (decision.action === 'route' && decision.route.selectionKind !== 'single') {
    const error = new TypeError('deep-loop routes must select exactly one destination');
    error.code = 'BUNDLE_EMISSION_FORBIDDEN';
    throw error;
  }
  if (decision.action === 'route' && decision.route.targets.length !== 1) {
    const error = new TypeError('deep-loop routes must carry exactly one target');
    error.code = 'BUNDLE_EMISSION_FORBIDDEN';
    throw error;
  }
  return decision;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. ROUTER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Evaluate one request while keeping compatibility evidence non-authoritative.
 *
 * @param {Object} snapshot - Compiled policy and read-only projections.
 * @param {Object} input - Prompt, constraints, and optional advisor record.
 * @returns {Object} Decision, trace, request, and advisor disposition.
 */
function evaluateCanary(snapshot, input) {
  const built = buildRequest(snapshot, input);
  const evaluated = evaluateWithTrace(built.request, snapshot.policy);
  const decision = clarifyFromChecklist(evaluated.decision, snapshot.fallbackChecklist);
  return {
    advisorDisposition: built.advisorDisposition,
    decision: assertSingleRoute(decision),
    request: built.request,
    trace: evaluated.trace,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  advisorDisposition,
  assertSingleRoute,
  buildRequest,
  evaluateCanary,
};
