// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ LIBRARY: REQUEST-PINNED CANARY ROUTER                                   ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

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

function clone(value) {
  return JSON.parse(canonicalize(value));
}

function advisorDisposition(advisor, projection, policy) {
  if (!advisor || ['absent', 'unavailable'].includes(advisor.trust)) {
    return { contributes: false, reason: 'advisor-zero-evidence', evidence: null };
  }
  const identityMatches = advisor.trust === 'live'
    && advisor.hubId === projection.hubId
    && advisor.effectivePolicyHash === policy.effectivePolicyHash
    && advisor.projectionHash === projection.projectionHash;
  if (!identityMatches) {
    return {
      contributes: false,
      reason: advisor.trust === 'stale'
        ? 'advisor-stale-annotation-only'
        : 'advisor-projection-drift-annotation-only',
      evidence: {
        id: 'advisor:annotation',
        kind: 'advisor',
        provenance: { capturedAtEpoch: policy.activationGeneration, source: 'advisor-projection' },
        trust: 'stale',
        value: canonicalize({ annotationOnly: true }),
      },
    };
  }
  return {
    contributes: true,
    reason: 'advisor-live-identity-match',
    evidence: {
      id: 'advisor:rank',
      kind: 'advisor',
      provenance: { capturedAtEpoch: policy.activationGeneration, source: 'advisor-projection' },
      trust: 'live',
      value: canonicalize({
        activationGeneration: policy.activationGeneration,
        effectivePolicyHash: policy.effectivePolicyHash,
        rankScore: advisor.rankScore || '0',
        scoreMargin: advisor.scoreMargin || '0',
      }),
    },
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
    provenance: { capturedAtEpoch: policy.activationGeneration, source: 'fenced-selector' },
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
    observations,
    evidence,
    pinnedActivationGeneration: policy.activationGeneration,
  };
  request.requestFactsHash = computeRequestFactsHash(request);
  return { advisorDisposition: disposition, request };
}

function clarifyFromChecklist(decision, checklist) {
  if (decision.action !== 'clarify') return decision;
  const candidate = clone(decision);
  candidate.clarify.question = checklist[0];
  candidate.clarify.alternatives = [...checklist.slice(1, 4), 'none_of_these'];
  return parseRouteDecision(candidate);
}

function withholdEvidenceOnlyRoute(decision) {
  if (decision.action !== 'route'
    || decision.route.targets.some((entry) => entry.role === 'actor')) return decision;
  return parseRouteDecision({
    action: 'defer',
    defer: { authority: 'Withheld', reason: 'no-match', recovery: [] },
    schemaVersion: 'V1',
  });
}

/**
 * Evaluate one request while keeping recommendation evidence non-authoritative.
 *
 * @param {Object} snapshot - Compiled policy, advisor projection, and fallback data.
 * @param {Object} input - Prompt, optional advisor record, and constraints.
 * @returns {Object} Typed decision, trace, request, and advisor disposition.
 */
function evaluateCanary(snapshot, input) {
  const built = buildRequest(snapshot, input);
  const evaluated = evaluateWithTrace(built.request, snapshot.policy);
  const legalDecision = withholdEvidenceOnlyRoute(evaluated.decision);
  return {
    advisorDisposition: built.advisorDisposition,
    decision: clarifyFromChecklist(legalDecision, snapshot.fallbackChecklist),
    request: built.request,
    trace: evaluated.trace,
  };
}

module.exports = {
  advisorDisposition,
  buildRequest,
  evaluateCanary,
};
