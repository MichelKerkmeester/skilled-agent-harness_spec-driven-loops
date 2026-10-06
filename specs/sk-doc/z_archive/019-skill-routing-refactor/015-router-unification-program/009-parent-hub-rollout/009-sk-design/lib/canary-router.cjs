// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ LIBRARY: REQUEST-PINNED TWO-STAGE CANARY ROUTER (DESIGN HUB)             ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// This router scores the compiled routing model directly, in the hub's own
// two stages. It deliberately does not go through the generic detector or
// selector evaluator or the certificate-gated selective controller: those two
// together made a sibling hub's compiled router under-route relative to its
// frozen legacy replay, because the selective controller abstains on any
// ranked decision without a live calibration certificate and force-defers a
// bare evidence-only target. Neither guard exists in this hub's legacy
// contract. The generic policy (destinations, detectors, selectors,
// composition rules, hashing) is still compiled and still valid; it is just
// not consulted for the live routing decision here.
//
// Stage one selects workflow modes from the hub-router signals. Stage two
// scores the root router's intents inside the selected modes only, and turns
// the winning intents' pre-resolved leaf pairs into the trace. Keyword
// matching is a plain substring test on purpose: this hub's vocabulary is
// multi-word phrases and short second words ("org chart" vs "chart"), which a
// word-boundary guard wouldclip unpredictably, and the frozen legacy replay
// it preserves also matched loosely.

const {
  canonicalize,
  computeRequestFactsHash,
} = require('../../../003-contract-schemas/lib/canonical.cjs');
const {
  parseRouteDecision,
} = require('../../../005-decision-evaluator/lib/decision-contract.cjs');

function clone(value) {
  return JSON.parse(canonicalize(value));
}

function normalize(value) {
  return String(value).trim().toLowerCase();
}

function containsSignal(text, value) {
  return text.includes(normalize(value));
}

function advisorDisposition(advisor, projection, policy) {
  if (!advisor || ['absent', 'unavailable'].includes(advisor.trust)) {
    return { contributes: false, evidence: null, reason: 'advisor-zero-evidence' };
  }
  const matches = advisor.trust === 'live'
    && advisor.hubId === projection.hubId
    && advisor.effectivePolicyHash === policy.effectivePolicyHash
    && advisor.projectionHash === projection.projectionHash;
  if (!matches) {
    return {
      contributes: false,
      evidence: {
        id: 'advisor:annotation',
        kind: 'advisor',
        provenance: { capturedAtEpoch: policy.activationGeneration, source: 'advisor-projection' },
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
      provenance: { capturedAtEpoch: policy.activationGeneration, source: 'advisor-projection' },
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
  const disposition = advisorDisposition(input.advisor, snapshot.advisorProjection, snapshot.policy);
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
      capturedAtEpoch: snapshot.policy.activationGeneration,
      source: 'fenced-selector',
    },
    trust: 'live',
    value: canonicalize({
      activationGeneration: snapshot.policy.activationGeneration,
      effectivePolicyHash: snapshot.policy.effectivePolicyHash,
    }),
  }];
  if (disposition.evidence) evidence.push(disposition.evidence);
  const request = {
    evidence,
    ...(input.explicitMode ? { explicitMode: input.explicitMode } : {}),
    observations,
    pinnedActivationGeneration: snapshot.policy.activationGeneration,
    schemaVersion: 'V1',
  };
  request.requestFactsHash = computeRequestFactsHash(request);
  return { disposition, request };
}

function target(destination) {
  return {
    authorityRef: destination.authorityRef,
    destinationId: clone(destination.id),
    mutatesWorkspace: destination.mutatesWorkspace,
    role: destination.role,
  };
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

function negative(action, payload) {
  return parseRouteDecision({
    action,
    [action]: { ...payload, authority: 'Withheld' },
    schemaVersion: 'V1',
  });
}

function clarify(snapshot, request, modes) {
  const order = new Map(snapshot.routingModel.tieBreak.map((mode, index) => [mode, index]));
  const alternatives = [...modes]
    .sort((left, right) => order.get(left) - order.get(right))
    .slice(0, 3);
  alternatives.push('none_of_these');
  return parseRouteDecision({
    action: 'clarify',
    clarify: {
      alternatives,
      authority: 'Withheld',
      budgetRef: `budget:${request.requestFactsHash.slice(0, 16)}`,
      question: snapshot.fallbackChecklist[0],
    },
    schemaVersion: 'V1',
  });
}

// Look up the authored bundle kind for an exact, tie-break-ordered mode set.
// The compiler generates one composition rule for every non-empty 2+ subset of
// the tie-break order, so a near-tied score set always finds an exact match.
function exactBundle(routingModel, orderedModes) {
  const candidate = orderedModes.join(' ');
  return routingModel.bundleRules.find((rule) => (
    rule.targetWorkflowModes.join(' ') === candidate
  )) || null;
}

// An explicit mode names exactly one mode. It arrives either as this hub's
// documented /design:* command, as the bare workflow mode, or in the
// hub-qualified form; the command is what the skill's own contract publishes.
function explicitMode(routingModel, value) {
  const normalized = normalize(value);
  return routingModel.modes.filter((mode) => (
    normalize(mode.workflowMode) === normalized
    || normalize(`sk-design/${mode.workflowMode}`) === normalized
    || (typeof mode.command === 'string' && normalize(mode.command) === normalized)
  ));
}

// ─────────────────────────────────────────────────────────────────────────────
// STAGE-ONE SCORING
// ─────────────────────────────────────────────────────────────────────────────

// Score every mode by (count of matched keywords) x weight — identical to the
// frozen legacy replay's scoreIntents formula. A direct command mention routes
// past keyword scoring entirely, exactly as the legacy replay resolved
// /design:chart, /design:diagram and /design:extract.
function scoreModes(routingModel, text) {
  const direct = routingModel.modes.filter((mode) => (
    typeof mode.command === 'string' && containsSignal(text, mode.command)
  ));
  if (direct.length > 0) {
    return direct.map((mode) => ({ mode: mode.workflowMode, score: Number.MAX_SAFE_INTEGER }));
  }
  return routingModel.modes.map((mode) => ({
    mode: mode.workflowMode,
    score: mode.keywords.filter((keyword) => containsSignal(text, keyword)).length * mode.weight,
  })).filter((entry) => entry.score > 0);
}

// Keep every mode within ambiguityDelta of the top score — identical to the
// frozen legacy replay's selectIntents. Legacy never clarifies on a tie: it
// returns every near-tied intent, so this router routes every near-tied set
// too (as a bundle) rather than asking for disambiguation.
function selectNearTiedModes(scores, ambiguityDelta) {
  if (scores.length === 0) return [];
  const top = scores[0].score;
  return scores.filter((entry) => top - entry.score <= ambiguityDelta).map((entry) => entry.mode);
}

// ─────────────────────────────────────────────────────────────────────────────
// STAGE-TWO INTENT SCORING
// ─────────────────────────────────────────────────────────────────────────────

// Score the root router's intents whose owning mode was actually selected,
// then keep every intent within the same ambiguity delta of the top intent
// score. A tie between two intents of the same mode is not ambiguity to
// escalate: it is one mode loading both leaf sets, so the resulting pairs are
// unioned and deduped. Intents are ordered by their owning mode's tie-break
// rank first, so the union's order (and therefore the emitted resource order)
// is a function of the authored tie-break, not of accident.
function scoreIntents(snapshot, selectedModes, text) {
  const intents = snapshot.routingModel.intents || [];
  const selected = new Set(selectedModes);
  const modeOrder = new Map(snapshot.routingModel.tieBreak.map((mode, index) => [mode, index]));
  const scores = intents
    .filter((intent) => selected.has(intent.mode))
    .map((intent) => ({
      intent: intent.intent,
      mode: intent.mode,
      score: intent.keywords.filter((keyword) => containsSignal(text, keyword)).length * intent.weight,
    }))
    .filter((entry) => entry.score > 0);
  scores.sort((left, right) => (
    right.score - left.score
    || modeOrder.get(left.mode) - modeOrder.get(right.mode)
    || compareText(left.intent, right.intent)
  ));
  if (scores.length === 0) return { leafPairs: [], outcome: 'UNKNOWN', selectedIntents: [], scores };
  const top = scores[0].score;
  const kept = scores.filter((entry) => top - entry.score <= snapshot.routingModel.ambiguityDelta);
  const byIntent = new Map(intents.map((intent) => [intent.intent, intent]));
  const seen = new Set();
  const leafPairs = [];
  for (const entry of kept) {
    for (const pair of byIntent.get(entry.intent).leafPairs) {
      const key = `${pair.workflowMode}\u0000${pair.leafResourceId}`;
      if (!seen.has(key)) {
        seen.add(key);
        leafPairs.push(pair);
      }
    }
  }
  return {
    leafPairs,
    outcome: 'MATCHED',
    selectedIntents: kept.map((entry) => entry.intent),
    scores,
  };
}

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
    const matches = explicitMode(snapshot.routingModel, input.explicitMode);
    if (matches.length === 1) decision = route(snapshot, 'single', [matches[0].workflowMode]);
    else if (constraints.has('clarify') || matches.length > 1) {
      decision = clarify(snapshot, built.request, matches.map((mode) => mode.workflowMode));
    } else decision = negative('defer', { reason: 'no-match', recovery: [] });
  } else {
    scores = scoreModes(snapshot.routingModel, text);
    const order = new Map(snapshot.routingModel.tieBreak.map((mode, index) => [mode, index]));
    scores.sort((left, right) => (
      right.score - left.score || order.get(left.mode) - order.get(right.mode)
    ));
    const selected = selectNearTiedModes(scores, snapshot.routingModel.ambiguityDelta);
    if (constraints.has('clarify')) {
      decision = clarify(snapshot, built.request, selected.length ? selected : scores.map((entry) => entry.mode));
    } else if (selected.length === 0) {
      // The hub router's own "none" outcome: no signal at all falls to the
      // default mode, because this hub declares a values question as the
      // safe default for an unclear design request.
      decision = snapshot.routingModel.defaultMode === null
        ? negative('defer', { reason: 'no-match', recovery: [] })
        : route(snapshot, 'single', [snapshot.routingModel.defaultMode]);
    } else if (selected.length === 1) {
      decision = route(snapshot, 'single', selected);
    } else {
      const ordered = [...selected].sort((left, right) => order.get(left) - order.get(right));
      const bundle = exactBundle(snapshot.routingModel, ordered);
      decision = route(snapshot, bundle ? bundle.kind : 'orderedBundle', ordered);
    }
  }

  // Stage two runs for a route decision only: clarify, defer and reject carry
  // no targets, so there is no mode scope to score intents inside, and the
  // scorer observation of a non-route is empty by contract.
  const routed = decision.action === 'route';
  const targetModes = routed
    ? decision.route.targets.map((targetEntry) => targetEntry.destinationId.workflowMode)
    : [];
  const intentStage = routed
    ? scoreIntents(snapshot, targetModes, text)
    : { leafPairs: [], outcome: 'NONE', selectedIntents: [], scores: [] };

  return {
    advisorDisposition: built.disposition,
    decision,
    leafPairs: intentStage.leafPairs,
    request: built.request,
    trace: {
      // Compatibility shim: the artifact generator reads
      // trace.controller?.rankCalls ?? trace.evaluator.rankCalls unchanged
      // from before this rewrite; this router has no controller stage, so it
      // supplies the evaluator-shaped field directly. A rank happened when
      // either stage scored more than one contender.
      evaluator: { rankCalls: (scores.length > 1 || intentStage.scores.length > 1) ? 1 : 0 },
      intentOutcome: intentStage.outcome,
      intentScores: intentStage.scores,
      leafPairCount: intentStage.leafPairs.length,
      matchedScores: scores,
      outcome: decision.action === 'route' ? decision.route.selectionKind : decision.action,
      selectedIntents: intentStage.selectedIntents,
    },
  };
}

module.exports = {
  advisorDisposition,
  buildRequest,
  evaluateCanary,
  scoreIntents,
  scoreModes,
};
