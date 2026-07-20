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
const RECOVERY_LADDER_CONTRACT = require(
  '../../../004-recovery-ladder/recovery-ladder.v1.json'
);
const {
  resolveSelectiveController,
} = require('../../../005-calibration/003-selective-controller/lib/selective-controller.cjs');

function clone(value) {
  return JSON.parse(canonicalize(value));
}

function createBudgetState(requestId) {
  const shared = RECOVERY_LADDER_CONTRACT.budget;
  return {
    requestId,
    contract: {
      schemaVersion: shared.schemaVersion,
      budgetId: `budget:${requestId}`,
      userTurns: shared.userTurns,
      handoffHops: shared.handoffHops,
      visited: [],
    },
    userTurnsUsed: 0,
    handoffHopsUsed: 0,
    visited: [],
    clarification: null,
  };
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
  const requestId = request.requestFactsHash;
  const riskSlice = input.riskSlice || 'actor:mutating:none';
  return {
    advisorDisposition: disposition,
    budgetState: input.budgetState
      ? clone(input.budgetState)
      : createBudgetState(requestId),
    certificateHandle: input.certificateHandle
      ? clone(input.certificateHandle)
      : { state: 'absent' },
    controllerRequest: {
      requestId,
      hubId: snapshot.advisorProjection.hubId,
      pinnedActivationGeneration: {
        generation: policy.activationGeneration,
        effectivePolicyHash: policy.effectivePolicyHash,
      },
      riskSlice,
      policyPosture: { thresholdPolicy: 'selective' },
      evidence: clone(evidence),
    },
    request,
  };
}

function rankEvidenceFromEvaluation(decision, built, policy) {
  const evidenceByKind = new Map(
    decision.route.evidence.map((entry) => [entry.kind, entry])
  );
  const exactAdmissionValue = policy.thresholdPolicy.kind === 'exact-admission' ? '1' : '0';
  const advisor = built.advisorDisposition.contributes
    ? {
      trust: 'live',
      policyHash: policy.effectivePolicyHash,
      riskSlice: built.controllerRequest.riskSlice,
    }
    : {
      trust: built.advisorDisposition.reason.includes('stale')
        || built.advisorDisposition.reason.includes('drift')
        ? 'stale'
        : 'absent',
    };
  return {
    source: built.advisorDisposition.contributes ? 'combined' : 'compiled-policy',
    rankScore: clone(evidenceByKind.get('rankScore') || {
      value: exactAdmissionValue,
      nonAuthority: true,
    }),
    scoreMargin: clone(evidenceByKind.get('scoreMargin') || {
      value: exactAdmissionValue,
      nonAuthority: true,
    }),
    advisor,
  };
}

function rankedCandidatesFromEvaluation(decision, built, policy, fallbackChecklist) {
  const candidates = decision.route.targets.map((target) => ({
    target: clone(target),
    localLegal: true,
    exactSignal: decision.route.targets.length === 1 && decision.route.basis.kind === 'signal',
  }));
  const ranked = {
    candidateCount: candidates.length,
    selectionKind: decision.route.selectionKind,
    rankingInvoked: candidates.length > 1,
    candidates,
    interaction: {
      attempt: 1,
      userTurnsUsed: built.budgetState.userTurnsUsed,
    },
  };
  if (candidates.length === 1) return ranked;
  ranked.rankEvidence = rankEvidenceFromEvaluation(decision, built, policy);
  ranked.clarification = {
    question: fallbackChecklist[0],
    decisionCard: 'Choose the legal local route that matches the requested outcome.',
    options: candidates.slice(0, 3).map((candidate, index) => ({
      id: candidate.target.destinationId.workflowMode,
      label: candidate.target.destinationId.workflowMode,
      candidateIndex: index,
    })),
  };
  return ranked;
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
  const controlled = evaluated.decision.action === 'route'
    ? resolveSelectiveController(
      built.controllerRequest,
      rankedCandidatesFromEvaluation(
        evaluated.decision,
        built,
        snapshot.policy,
        snapshot.fallbackChecklist
      ),
      built.certificateHandle,
      built.budgetState
    )
    : null;
  const legalDecision = withholdEvidenceOnlyRoute(
    controlled ? controlled.decision : evaluated.decision
  );
  return {
    advisorDisposition: built.advisorDisposition,
    budgetState: controlled ? controlled.budgetState : built.budgetState,
    calibration: controlled ? controlled.calibration : { status: 'unvalidated' },
    controllerRequest: built.controllerRequest,
    decision: controlled
      ? legalDecision
      : clarifyFromChecklist(legalDecision, snapshot.fallbackChecklist),
    request: built.request,
    trace: {
      controller: controlled ? controlled.trace : null,
      evaluator: evaluated.trace,
    },
  };
}

module.exports = {
  advisorDisposition,
  buildRequest,
  evaluateCanary,
};
