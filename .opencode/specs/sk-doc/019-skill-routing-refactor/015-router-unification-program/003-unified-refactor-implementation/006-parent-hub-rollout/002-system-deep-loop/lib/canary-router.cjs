// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ LIBRARY: REQUEST-PINNED DEEP-LOOP ROUTER                               ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// This router scores directly against the bespoke routingModel that
// registry-compiler.cjs builds from hub-router.json (mirrors sk-code's and
// sk-design's lib/router.cjs). It deliberately does NOT go through the generic
// detector/selector evaluator (002-decision-evaluator/lib/evaluator.cjs): that
// evaluator's candidates came from detectorGraph()'s alias-owned detectors,
// whose vocabulary is mode-registry.json's own `aliases` field (plus
// workflowMode/command), a source that diverges from the frozen legacy
// replay's (router-replay.cjs) own hub-router.json projection in both
// directions on real scenarios -- missing a phrase the legacy vocabulary
// carries (under-routing: a genuine single-mode match fell back to
// defer/clarify because the registry alias didn't substring-match, or a
// bare-word alias collided with an unrelated mode with no word-boundary guard
// and no compositionRules entry to resolve the resulting "bundle", so it fell
// back to clarify), and carrying a phrase the legacy vocabulary deliberately
// omits (over-routing: a command-bridge mode -- model-benchmark/
// skill-benchmark -- fired on a bare natural-language registry alias where
// legacy requires the literal `/deep:*` command). The generic policy
// (destinations, detectors, selectors, authority graph, hashing) is still
// compiled and still valid; it just is not consulted for the live routing
// decision here.
//
// Unlike sk-code/sk-design, a near-tied 2+-mode score set here never becomes a
// route: this hub's policy admits only `single` routes (assertSingleRoute
// below; policy-card.cjs's bundleGrammar is `['single']` and
// registry-compiler.cjs's compositionRules stays empty), so it clarifies once
// instead -- matching the pre-existing canary fixture contract
// (fixtures/canary-cases.v1.json's "one-turn-clarify" case).

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

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// A bare keyword like "review" gets swallowed by unrelated longer words
// ("preview" contains "review"), so it is matched on a word boundary -- the
// exact guard the frozen legacy replay (router-replay.cjs's keywordHits)
// applies universally. None of this hub's authored keywords are bare short
// words today (they're all multi-word phrases), so the guard is currently
// inert here, but it is a shared-vocabulary property of the frozen replay, not
// a per-hub opt-in, so it is kept unconditionally for byte-for-byte parity.
const WORD_BOUNDARY_KEYWORDS = new Set(['review', 'lcp', 'inp', 'cls']);

function clone(value) {
  return JSON.parse(canonicalize(value));
}

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

function target(destination) {
  return {
    authorityRef: destination.authorityRef,
    destinationId: clone(destination.id),
    mutatesWorkspace: destination.mutatesWorkspace,
    role: destination.role,
  };
}

function routeSingle(snapshot, mode) {
  const byMode = new Map(snapshot.policy.destinations.map((destination) => (
    [destination.id.workflowMode, destination]
  )));
  return parseRouteDecision({
    action: 'route',
    route: {
      authority: 'WithheldUntilVerify',
      basis: { kind: 'signal' },
      evidence: [],
      selectionKind: 'single',
      targets: [target(byMode.get(mode))],
    },
    schemaVersion: 'V1',
  }, snapshot.policy);
}

function negative(action, payload) {
  return parseRouteDecision({
    action,
    [action]: { ...payload, authority: 'Withheld' },
    schemaVersion: 'V1',
  });
}

// Alternatives are drawn from the authored fallback checklist
// (registry-compiler.cjs's fallbackChecklist()), not from the candidate mode
// names: the compiled-routing-parity harness only ever compares
// action/selectionKind/targets (compiled-routing-parity.cjs's
// firstProjectionDifference), never clarify.question/alternatives, so this
// wording is display-only and matches what this hub already asked before this
// rewrite (the prior clarifyFromChecklist() post-processing step).
function clarify(snapshot, request) {
  return parseRouteDecision({
    action: 'clarify',
    clarify: {
      alternatives: [...snapshot.fallbackChecklist.slice(1, 3), 'none_of_these'],
      authority: 'Withheld',
      budgetRef: `budget:${request.requestFactsHash.slice(0, 16)}`,
      question: snapshot.fallbackChecklist[0],
    },
    schemaVersion: 'V1',
  });
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

function explicitModeMatches(snapshot, value) {
  const normalized = normalize(value);
  const hubId = snapshot.advisorProjection.hubId;
  return snapshot.routingModel.modes.filter((mode) => (
    normalize(mode.workflowMode) === normalized
    || normalize(`${hubId}/${mode.workflowMode}`) === normalized
  ));
}

// Score every mode by (count of matched keywords) x weight -- identical to the
// frozen legacy replay's scoreIntents formula (weight is constant per mode in
// both, so summing weight-per-hit equals count-of-hits x weight). Keywords
// come from routingModel.modes[].keywords, the unfiltered union of
// hub-router.json's vocabularyClasses for that mode's routerSignals classes:
// the same source legacy projects (router-replay.cjs's projectHubRouter), with
// no cross-mode ambiguity filtering.
function scoreModes(routingModel, text) {
  return routingModel.modes.map((mode) => ({
    mode: mode.workflowMode,
    score: mode.keywords.filter((keyword) => containsSignal(text, keyword)).length * mode.weight,
  })).filter((entry) => entry.score > 0);
}

// Keep every mode within ambiguityDelta of the top score -- identical to the
// frozen legacy replay's selectIntents. Legacy never clarifies on a tie by
// itself; here a size-1 result routes, and a size-2+ result clarifies (see the
// top-of-file note on why this hub never emits a bundle route).
function selectNearTiedModes(scores, ambiguityDelta) {
  if (scores.length === 0) return [];
  const top = scores[0].score;
  return scores.filter((entry) => top - entry.score <= ambiguityDelta).map((entry) => entry.mode);
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. ROUTER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Evaluate one request while keeping compatibility evidence non-authoritative.
 *
 * @param {Object} snapshot - Compiled policy, routingModel, and read-only projections.
 * @param {Object} input - Prompt, constraints, and optional advisor record.
 * @returns {Object} Decision, trace, request, and advisor disposition.
 */
function evaluateCanary(snapshot, input) {
  const built = buildRequest(snapshot, input);
  const text = normalize(input.prompt || '');
  const constraints = new Set((input.constraints || []).map(normalize));
  let decision;
  let scores = [];
  if (constraints.has('forbidden') || text.includes('forbidden')) {
    decision = negative('reject', { reason: 'forbidden' });
  } else if (constraints.has('dependency-failure')) {
    decision = negative('defer', { reason: 'dependency-failure', recovery: ['defer'] });
  } else if (input.explicitMode) {
    const matches = explicitModeMatches(snapshot, input.explicitMode);
    if (matches.length === 1) decision = routeSingle(snapshot, matches[0].workflowMode);
    else if (constraints.has('clarify') || matches.length > 1) {
      decision = clarify(snapshot, built.request);
    } else decision = negative('defer', { reason: 'no-match', recovery: [] });
  } else {
    scores = scoreModes(snapshot.routingModel, text);
    const order = new Map(snapshot.routingModel.tieBreak.map((mode, index) => [mode, index]));
    scores.sort((left, right) => (
      right.score - left.score || order.get(left.mode) - order.get(right.mode)
    ));
    const selected = selectNearTiedModes(scores, snapshot.routingModel.ambiguityDelta);
    if (constraints.has('clarify')) {
      decision = clarify(snapshot, built.request);
    } else if (selected.length === 0) {
      decision = snapshot.routingModel.defaultMode === null
        ? negative('defer', { reason: 'no-match', recovery: [] })
        : routeSingle(snapshot, snapshot.routingModel.defaultMode);
    } else if (selected.length === 1) {
      decision = routeSingle(snapshot, selected[0]);
    } else {
      decision = clarify(snapshot, built.request);
    }
  }
  return {
    advisorDisposition: built.advisorDisposition,
    decision: assertSingleRoute(decision),
    request: built.request,
    trace: {
      // Compatibility: harness/build-artifacts.cjs's typedGold() reads
      // evaluated.trace.rankCalls directly (no nesting), unchanged from before
      // this rewrite; 1 whenever 2+ modes scored and a rank/tie-break decision
      // was actually needed, 0 otherwise (0 or 1 candidate).
      matchedScores: scores,
      outcome: decision.action === 'route' ? decision.route.selectionKind : decision.action,
      rankCalls: scores.length > 1 ? 1 : 0,
    },
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
  scoreModes,
};
