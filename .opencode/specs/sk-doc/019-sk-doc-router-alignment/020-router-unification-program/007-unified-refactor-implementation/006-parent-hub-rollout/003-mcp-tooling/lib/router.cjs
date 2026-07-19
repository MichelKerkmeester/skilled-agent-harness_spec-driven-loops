'use strict';

const {
  computeRequestFactsHash,
} = require('../../../000-contract-schemas/lib/canonical.cjs');
const {
  parseRouteDecision,
} = require('../../../002-decision-evaluator/lib/decision-contract.cjs');
const { destinationKey } = require('./registry-compiler.cjs');

function target(destination) {
  return {
    authorityRef: destination.authorityRef,
    destinationId: destination.id,
    mutatesWorkspace: destination.mutatesWorkspace,
    role: destination.role,
  };
}

function negative(action, payload) {
  return { action, schemaVersion: 'V1', [action]: { ...payload, authority: 'Withheld' } };
}

function requestFor(snapshot, input) {
  const request = {
    evidence: [],
    observations: [{ kind: 'intent', value: input.prompt || '' }],
    pinnedActivationGeneration: snapshot.policy.activationGeneration,
    schemaVersion: 'V1',
  };
  request.requestFactsHash = computeRequestFactsHash(request);
  return request;
}

function matches(text, detector) {
  return text.includes(detector.value.toLowerCase());
}

function evaluateRoute(snapshot, input) {
  const text = String(input.prompt || '').toLowerCase();
  const graph = snapshot.destinationGraph;
  const request = requestFor(snapshot, input);
  if (graph.detectors.some((detector) => detector.kind === 'negative' && matches(text, detector))) {
    return { decision: negative('reject', { reason: 'forbidden' }), request, trace: { matches: [] } };
  }

  const matchedIds = new Set(graph.detectors.filter((detector) => matches(text, detector)).map((row) => row.id));
  const selected = graph.selectors
    .map((selector) => ({
      destination: graph.destinations.find((entry) => (
        destinationKey(entry.id) === destinationKey(selector.destinationId)
      )),
      hits: selector.detectorIds.filter((id) => matchedIds.has(id)).length,
    }))
    .filter((row) => row.hits > 0);

  const bundles = graph.compositionRules.map((rule) => {
    const judgment = selected.find((row) => destinationKey(row.destination.id) === destinationKey(rule.targetIds[0]));
    const transport = selected.find((row) => destinationKey(row.destination.id) === destinationKey(rule.targetIds[1]));
    return { judgment, rule, score: (judgment?.hits || 0) + (transport?.hits || 0), transport };
  }).filter((row) => row.judgment && row.transport);
  bundles.sort((left, right) => right.score - left.score);
  const topBundle = bundles[0];
  if (topBundle && (!bundles[1] || topBundle.score > bundles[1].score)) {
    const decision = {
      action: 'route',
      route: {
        authority: 'WithheldUntilVerify',
        basis: { kind: 'signal' },
        evidence: [],
        selectionKind: 'orderedBundle',
        targets: topBundle.rule.targetIds.map((id) => target(
          graph.destinations.find((entry) => destinationKey(entry.id) === destinationKey(id)),
        )),
      },
      schemaVersion: 'V1',
    };
    return {
      decision: parseRouteDecision(decision, snapshot.policy),
      request,
      trace: { matches: [...matchedIds], rule: topBundle.rule },
    };
  }

  const hubSelected = selected.filter((row) => row.destination.id.skillId === snapshot.advisorProjection.hubId);
  if (hubSelected.length === 0) {
    return {
      decision: negative('defer', { reason: 'no-match', recovery: ['defer'] }),
      request,
      trace: { matches: [...matchedIds] },
    };
  }
  hubSelected.sort((left, right) => right.hits - left.hits);
  if (hubSelected[1] && hubSelected[0].hits === hubSelected[1].hits) {
    return {
      decision: negative('defer', { reason: 'no-match', recovery: ['defer'] }),
      request,
      trace: { ambiguous: true, matches: [...matchedIds] },
    };
  }

  const chosen = hubSelected[0].destination;
  const mutationMatched = graph.detectors.some((detector) => (
    detector.id.startsWith(`detector:mutation:${chosen.id.workflowMode}:`) && matchedIds.has(detector.id)
  ));
  const authorityRequired = graph.compositionRules.some((rule) => (
    destinationKey(rule.targetIds[1]) === destinationKey(chosen.id)
  ));
  if (chosen.role === 'transport' && mutationMatched && authorityRequired) {
    return {
      decision: negative('defer', { reason: 'dependency-failure', recovery: ['defer'] }),
      request,
      trace: { authorityWithheld: true, matches: [...matchedIds] },
    };
  }

  const decision = {
    action: 'route',
    route: {
      authority: 'WithheldUntilVerify',
      basis: { kind: 'signal' },
      evidence: [],
      selectionKind: 'single',
      targets: [target(chosen)],
    },
    schemaVersion: 'V1',
  };
  return {
    decision: parseRouteDecision(decision, snapshot.policy),
    request,
    trace: { matches: [...matchedIds] },
  };
}

function advisorContribution(snapshot, advisor) {
  if (!advisor || advisor.state === 'absent' || advisor.state === 'unavailable') {
    return { contributes: false, reason: 'advisor-zero-evidence' };
  }
  if (advisor.state !== 'live') return { contributes: false, reason: 'advisor-annotation-only' };
  if (advisor.effectivePolicyHash !== snapshot.policy.effectivePolicyHash
    || advisor.projectionHash !== snapshot.advisorProjection.projectionHash) {
    return { contributes: false, reason: 'advisor-drift-annotation-only' };
  }
  return { contributes: true, reason: 'advisor-live-identity-match' };
}

module.exports = {
  advisorContribution,
  evaluateRoute,
};
