'use strict';

const {
  canonicalize,
  computeRequestFactsHash,
} = require('../../../000-contract-schemas/lib/canonical.cjs');
const {
  parseRouteDecision,
} = require('../../../002-decision-evaluator/lib/decision-contract.cjs');

function normalize(value) {
  return String(value || '').trim().toLowerCase();
}

function target(destination) {
  return {
    authorityRef: destination.authorityRef,
    destinationId: destination.id,
    mutatesWorkspace: destination.mutatesWorkspace,
    role: destination.role,
  };
}

function negative(action, payload) {
  return parseRouteDecision({
    action,
    [action]: { ...payload, authority: 'Withheld' },
    schemaVersion: 'V1',
  });
}

function buildRequest(snapshot, input) {
  const observations = [];
  if (typeof input.prompt === 'string' && /\S/.test(input.prompt)) {
    observations.push({ kind: 'intent', value: input.prompt });
  }
  for (const constraint of input.constraints || []) {
    observations.push({ kind: 'constraint', value: constraint });
  }
  const request = {
    evidence: [{
      id: 'runtime:activation',
      kind: 'runtime',
      provenance: {
        capturedAtEpoch: snapshot.policy.activationGeneration,
        source: 'fenced-selector',
      },
      trust: 'live',
      value: canonicalize({
        activationGeneration: snapshot.policy.activationGeneration,
        effectivePolicyHash: snapshot.policy.effectivePolicyHash,
      }),
    }],
    ...(input.explicitMode ? { explicitMode: input.explicitMode } : {}),
    observations,
    pinnedActivationGeneration: snapshot.policy.activationGeneration,
    schemaVersion: 'V1',
  };
  request.requestFactsHash = computeRequestFactsHash(request);
  return request;
}

function destinationByMode(snapshot, workflowMode) {
  return snapshot.policy.destinations.find((destination) => (
    destination.id.workflowMode === workflowMode
  ));
}

function route(snapshot, workflowModes, basisKind) {
  const destinations = workflowModes.map((workflowMode) => destinationByMode(snapshot, workflowMode));
  const selectionKind = workflowModes.length === 1 ? 'single' : 'orderedBundle';
  return parseRouteDecision({
    action: 'route',
    route: {
      authority: 'WithheldUntilVerify',
      basis: { kind: basisKind },
      evidence: [],
      selectionKind,
      targets: destinations.map(target),
    },
    schemaVersion: 'V1',
  }, snapshot.policy);
}

function clarify(snapshot, request) {
  return parseRouteDecision({
    action: 'clarify',
    clarify: {
      alternatives: [...snapshot.routingModel.tieBreak, 'none_of_these'],
      authority: 'Withheld',
      budgetRef: `budget:${request.requestFactsHash.slice(0, 16)}`,
      question: 'Which sk-prompt workflow matches the request?',
    },
    schemaVersion: 'V1',
  });
}

function scoreModes(routingModel, text) {
  return routingModel.modes.map((mode) => {
    const matches = mode.keywords.filter((keyword) => text.includes(keyword));
    return {
      matches,
      score: matches.length * mode.weight,
      workflowMode: mode.workflowMode,
    };
  });
}

function evaluateCanary(snapshot, input) {
  const request = buildRequest(snapshot, input);
  const text = normalize(input.prompt);
  const constraints = new Set((input.constraints || []).map(normalize));
  const trace = { bundleCalls: 0, rankCalls: 0 };
  if (constraints.has('forbidden') || text.includes('forbidden')) {
    return {
      decision: negative('reject', { reason: 'forbidden' }),
      request,
      trace,
    };
  }
  if (constraints.has('dependency-failure')) {
    return {
      decision: negative('defer', { reason: 'dependency-failure', recovery: ['defer'] }),
      request,
      trace,
    };
  }
  if (constraints.has('clarify')) {
    return { decision: clarify(snapshot, request), request, trace };
  }
  if (input.explicitMode) {
    const explicit = normalize(input.explicitMode);
    if (!snapshot.routingModel.tieBreak.includes(explicit)) {
      return {
        decision: negative('defer', { reason: 'no-match', recovery: [] }),
        request,
        trace,
      };
    }
    return { decision: route(snapshot, [explicit], 'signal'), request, trace };
  }

  const explicitlyNamed = snapshot.routingModel.tieBreak.filter((mode) => text.includes(mode));
  if (explicitlyNamed.length === snapshot.routingModel.tieBreak.length) {
    trace.bundleCalls += 1;
    return {
      decision: route(snapshot, snapshot.routingModel.tieBreak, 'signal'),
      request,
      trace,
    };
  }

  trace.rankCalls += 1;
  const scored = scoreModes(snapshot.routingModel, text)
    .filter((entry) => entry.score > 0)
    .sort((left, right) => {
      if (left.score !== right.score) return right.score - left.score;
      return snapshot.routingModel.tieBreak.indexOf(left.workflowMode)
        - snapshot.routingModel.tieBreak.indexOf(right.workflowMode);
    });
  if (scored.length === 0) {
    return {
      decision: route(snapshot, [snapshot.routingModel.defaultMode], 'bounded-default'),
      request,
      trace,
    };
  }
  if (scored.length > 1
    && scored[0].score - scored[1].score <= snapshot.routingModel.ambiguityDelta) {
    return { decision: clarify(snapshot, request), request, trace };
  }
  return {
    decision: route(snapshot, [scored[0].workflowMode], 'signal'),
    request,
    trace,
  };
}

function advisorDisposition(snapshot, advisor) {
  if (!advisor || ['absent', 'unavailable'].includes(advisor.trust)) {
    return { contributes: false, reason: 'advisor-zero-evidence' };
  }
  const matches = advisor.trust === 'live'
    && advisor.hubId === snapshot.advisorProjection.hubId
    && advisor.effectivePolicyHash === snapshot.policy.effectivePolicyHash
    && advisor.projectionHash === snapshot.advisorProjection.projectionHash;
  return matches
    ? { contributes: true, reason: 'advisor-live-identity-match' }
    : { contributes: false, reason: 'advisor-annotation-only' };
}

module.exports = {
  advisorDisposition,
  buildRequest,
  evaluateCanary,
  scoreModes,
};
