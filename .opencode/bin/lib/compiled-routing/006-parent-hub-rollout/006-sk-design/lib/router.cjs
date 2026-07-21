'use strict';

const {
  canonicalize,
  computeRequestFactsHash,
} = require('../../../000-contract-schemas/lib/canonical.cjs');
const {
  parseRouteDecision,
} = require('../../../002-decision-evaluator/lib/decision-contract.cjs');

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
  if (signal.startsWith('/')) {
    return new RegExp(`${escapePattern(signal)}(?![a-z0-9-])`, 'i').test(text);
  }
  return text.includes(signal);
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

function exactBundle(routingModel, modes) {
  const candidate = new Set(modes);
  return routingModel.bundleRules.find((rule) => (
    rule.whenAll.length === candidate.size
    && rule.whenAll.every((mode) => candidate.has(mode))
  )) || null;
}

function explicitMode(routingModel, value) {
  const normalized = normalize(value);
  return routingModel.modes.filter((mode) => (
    normalize(mode.workflowMode) === normalized
    || normalize(`sk-design/${mode.workflowMode}`) === normalized
  ));
}

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

function clearlySeparateAxes(text, modes) {
  return modes.length === 2 && /\b(?:and|plus|then)\b/.test(text);
}

// Mirrors router-replay.cjs's selectIntents (the legacy replay's own ambiguity
// gate): keep only the modes within ambiguityDelta of the top score. An
// authored bundle rule (see exactBundle) has no textual signal of its own to
// justify overriding a clear score winner, unlike clearlySeparateAxes's
// explicit and/plus/then conjunction -- so it must only fire when its modes
// are genuinely co-dominant, the same bar legacy applies before it ever
// selects more than one intent.
function contendingModes(scores, ambiguityDelta) {
  if (scores.length === 0) return [];
  const top = scores[0].score;
  return scores.filter((entry) => top - entry.score <= ambiguityDelta).map((entry) => entry.mode);
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
    const modes = scores.map((entry) => entry.mode);
    if (constraints.has('clarify')) {
      decision = clarify(snapshot, built.request, modes);
    } else if (modes.length === 0) {
      decision = snapshot.routingModel.defaultMode === null
        ? negative('defer', { reason: 'no-match', recovery: [] })
        : route(snapshot, 'single', [snapshot.routingModel.defaultMode]);
    } else {
      const contending = contendingModes(scores, snapshot.routingModel.ambiguityDelta);
      const bundle = exactBundle(snapshot.routingModel, contending);
      if (bundle) {
        decision = route(snapshot, 'orderedBundle', bundle.targetWorkflowModes);
      } else if (clearlySeparateAxes(text, modes)) {
        decision = route(snapshot, 'orderedBundle', modes.sort((left, right) => (
          order.get(left) - order.get(right)
        )));
      } else if (scores.length === 1
        || scores[0].score - scores[1].score > snapshot.routingModel.ambiguityDelta) {
        decision = route(snapshot, 'single', [scores[0].mode]);
      } else {
        decision = clarify(snapshot, built.request, modes);
      }
    }
  }
  return {
    advisorDisposition: built.disposition,
    decision,
    request: built.request,
    trace: {
      matchedScores: scores,
      outcome: decision.action === 'route' ? decision.route.selectionKind : decision.action,
    },
  };
}

function nestedLeafResources(snapshot, workflowMode, prompt) {
  const router = snapshot.routingModel.nestedRouters[workflowMode];
  const text = normalize(prompt || '');
  const scored = router.intents.map((intent) => ({
    intent: intent.intent,
    score: intent.keywords.filter((keyword) => containsSignal(text, keyword)).length * intent.weight,
  })).filter((entry) => entry.score > 0).sort((left, right) => right.score - left.score);
  const selected = scored.length === 0
    ? []
    : scored.filter((entry) => scored[0].score - entry.score <= router.ambiguityDelta);
  return [...new Set([
    ...router.defaultResources,
    ...selected.flatMap((entry) => router.resourceMap[entry.intent]),
  ])];
}

function leafPairsForDecision(snapshot, decision, input) {
  if (decision.action !== 'route') return [];
  const manifest = new Map(snapshot.manifestResources.map((entry) => (
    [`${entry.workflowMode}\0${entry.resource}`, entry.leafResourceId]
  )));
  return decision.route.targets.flatMap((entry) => {
    const workflowMode = entry.destinationId.workflowMode;
    return nestedLeafResources(snapshot, workflowMode, input.prompt).map((resource) => ({
      leafResourceId: manifest.get(`${workflowMode}\0${resource}`),
      workflowMode,
    }));
  });
}

module.exports = {
  advisorDisposition,
  buildRequest,
  evaluateCanary,
  leafPairsForDecision,
  nestedLeafResources,
  scoreModes,
};
