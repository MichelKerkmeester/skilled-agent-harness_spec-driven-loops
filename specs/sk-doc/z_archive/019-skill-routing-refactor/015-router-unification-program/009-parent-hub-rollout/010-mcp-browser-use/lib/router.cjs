'use strict';

// This router scores directly against the routingModel that registry-compiler.cjs
// builds from hub-router.json. It does not go through the generic
// destinationGraph detector and selector evaluator, because the authored routing
// contract is the weighted vocabulary scorer in hub-router.json: a prompt scores
// each mode by its distinct keyword matches times the mode's weight, near-ties
// within ambiguityDelta route together in tie-break order, and a prompt that
// matches no mode defers because the hub declares no default mode. The generic
// policy is still compiled and hashed for the policy card and provenance.

const {
  computeRequestFactsHash,
} = require('../../../003-contract-schemas/lib/canonical.cjs');
const {
  parseRouteDecision,
} = require('../../../005-decision-evaluator/lib/decision-contract.cjs');

function normalize(value) {
  return String(value).trim().toLowerCase();
}

// A hyphenated and a spaced prompt name the same thing, so both sides fold
// hyphen runs to one space and collapse whitespace before comparing.
function spaced(value) {
  return String(value).replace(/-+/g, ' ').replace(/\s+/g, ' ').trim();
}

function containsSignal(text, value) {
  return spaced(text).includes(spaced(normalize(value)));
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

function target(destination) {
  return {
    authorityRef: destination.authorityRef,
    destinationId: destination.id,
    mutatesWorkspace: destination.mutatesWorkspace,
    role: destination.role,
  };
}

function negative(action, payload) {
  return parseRouteDecision({ action, [action]: { ...payload, authority: 'Withheld' }, schemaVersion: 'V1' });
}

function route(snapshot, selectionKind, modes) {
  const byMode = new Map(snapshot.policy.destinations.map((destination) => (
    [destination.id.workflowMode, destination]
  )));
  return parseRouteDecision({
    action: 'route',
    route: {
      authority: 'WithheldUntilVerify',
      basis: { kind: 'signal' },
      evidence: [],
      selectionKind,
      targets: modes.map((mode) => target(byMode.get(mode))),
    },
    schemaVersion: 'V1',
  }, snapshot.policy);
}

// A vocabulary that lists both spellings of one phrase names it once, so the
// fold-deduped count keeps a single mention worth one hit rather than two.
function scoreModes(routingModel, text) {
  return routingModel.modes.map((mode) => {
    const matched = new Set(mode.keywords
      .filter((keyword) => containsSignal(text, keyword))
      .map((keyword) => spaced(normalize(keyword))));
    return { mode: mode.workflowMode, score: matched.size * mode.weight };
  }).filter((entry) => entry.score > 0);
}

// Keep every mode within ambiguityDelta of the top score. The hub's outcomes
// declare single, orderedBundle and defer only, so a near-tie routes every tied
// mode as a bundle rather than asking for clarification.
function selectNearTiedModes(scores, ambiguityDelta) {
  if (scores.length === 0) return [];
  const top = scores[0].score;
  return scores.filter((entry) => top - entry.score <= ambiguityDelta).map((entry) => entry.mode);
}

function exactBundle(routingModel, orderedModes) {
  const candidate = orderedModes.join(' ');
  return routingModel.bundleRules.find((rule) => (
    rule.targetWorkflowModes.join(' ') === candidate
  )) || null;
}

function evaluateRoute(snapshot, input) {
  const request = requestFor(snapshot, input);
  const text = normalize(input.prompt || '');
  const constraints = new Set((input.constraints || []).map(normalize));
  let decision;
  let scores = [];
  if (constraints.has('forbidden') || text.includes('forbidden')) {
    decision = negative('reject', { reason: 'forbidden' });
  } else if (constraints.has('dependency-failure')) {
    decision = negative('defer', { reason: 'dependency-failure', recovery: ['defer'] });
  } else {
    scores = scoreModes(snapshot.routingModel, text);
    const order = new Map(snapshot.routingModel.tieBreak.map((mode, index) => [mode, index]));
    scores.sort((left, right) => (
      right.score - left.score || order.get(left.mode) - order.get(right.mode)
    ));
    const selected = selectNearTiedModes(scores, snapshot.routingModel.ambiguityDelta);
    if (selected.length === 0) {
      decision = snapshot.routingModel.defaultMode == null
        ? negative('defer', { reason: 'no-match', recovery: ['defer'] })
        : route(snapshot, 'single', [snapshot.routingModel.defaultMode]);
    } else if (selected.length === 1) {
      decision = route(snapshot, 'single', selected);
    } else {
      const ordered = [...selected].sort((left, right) => order.get(left) - order.get(right));
      const bundle = exactBundle(snapshot.routingModel, ordered);
      decision = route(snapshot, bundle ? bundle.kind : 'orderedBundle', ordered);
    }
  }
  return {
    decision,
    request,
    trace: {
      matchedScores: scores,
      outcome: decision.action === 'route' ? decision.route.selectionKind : decision.action,
    },
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
