'use strict';

// This router scores directly against the bespoke routingModel that
// registry-compiler.cjs builds from hub-router.json (mirrors sk-design's and
// sk-code's lib/{router,canary-router}.cjs). It deliberately does NOT go
// through the generic destinationGraph detector/selector/compositionRule
// evaluator: that generic evaluator sourced its vocabulary from
// mode-registry.json's sparse advisor-facing `aliases` list (missing most of
// hub-router.json's real routing vocabulary -- entire second vocabulary
// classes per mode, and even bare tool names like "figma"/"refero") and built
// a cross-hub bundle whenever a prompt matched both a transport and a paired
// sk-design judgment mode -- a capability the frozen legacy replay
// (router-replay.cjs) has no concept of at all. Together these under-routed 8
// of mcp-tooling's 14 route-gold scenarios (defer where legacy routes a
// single mode) and over-routed a 9th (MT-008 added sk-design's md-generator
// alongside mcp-refero, failing gold). The generic policy (destinations,
// authority graph, hashing) compiled by registry-compiler.cjs is still
// produced and still valid for policy-card/provenance purposes; it just is
// not consulted for the live routing decision here.

const {
  computeRequestFactsHash,
} = require('../../../000-contract-schemas/lib/canonical.cjs');
const {
  parseRouteDecision,
} = require('../../../002-decision-evaluator/lib/decision-contract.cjs');

// A bare keyword like "review" gets swallowed by unrelated longer words
// ("preview" contains "review"), so it is matched on a word boundary -- the
// exact guard the frozen legacy replay's keywordHits applies. Inert for
// mcp-tooling's current vocabulary (none of its keywords are in this set),
// but kept so this scorer stays a faithful copy of legacy's matching
// semantics rather than a hub-specific hand-tune.
const WORD_BOUNDARY_KEYWORDS = new Set(['review', 'lcp', 'inp', 'cls']);

function normalize(value) {
  return String(value).trim().toLowerCase();
}

function escapePattern(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function containsSignal(text, value) {
  const signal = normalize(value);
  if (WORD_BOUNDARY_KEYWORDS.has(signal)) {
    return new RegExp(`\\b${escapePattern(signal)}\\b`, 'i').test(text);
  }
  return text.includes(signal);
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

// Score every mode by (count of matched keywords) x weight -- identical to
// the frozen legacy replay's scoreIntents formula (weight is constant per
// mode in both, so summing weight-per-hit equals count-of-hits x weight).
// Keywords come from routingModel.modes[].keywords, which is the unfiltered
// union of hub-router.json's vocabularyClasses for that mode's routerSignals
// classes -- the same source legacy projects, with no cross-mode ambiguity
// filtering.
function scoreModes(routingModel, text) {
  return routingModel.modes.map((mode) => ({
    mode: mode.workflowMode,
    score: mode.keywords.filter((keyword) => containsSignal(text, keyword)).length * mode.weight,
  })).filter((entry) => entry.score > 0);
}

// Keep every mode within ambiguityDelta of the top score -- identical to the
// frozen legacy replay's selectIntents. Legacy never clarifies on a tie (and
// mcp-tooling's own hub-router.json routerPolicy.outcomes documents only
// single/orderedBundle/defer, no clarify): it unconditionally returns every
// near-tied intent, so this router routes every near-tied set too (as a
// bundle) rather than asking for disambiguation.
function selectNearTiedModes(scores, ambiguityDelta) {
  if (scores.length === 0) return [];
  const top = scores[0].score;
  return scores.filter((entry) => top - entry.score <= ambiguityDelta).map((entry) => entry.mode);
}

// Look up the authored bundle kind for an exact, tie-break-ordered mode set.
// registry-compiler.cjs's buildBundleRules generates one entry for every
// non-empty 2+ subset of the tie-break order, so a near-tied score set always
// finds an exact match here.
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
