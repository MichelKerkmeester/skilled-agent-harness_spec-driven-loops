// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ LIBRARY: REQUEST-PINNED CANARY ROUTER                                   ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// This router scores directly against the bespoke routingModel that
// registry-compiler.cjs builds from hub-router.json (mirrors sk-design's
// lib/router.cjs). It deliberately does NOT go through the generic
// detector/selector evaluator (005-decision-evaluator/lib/evaluator.cjs) or
// the certificate-gated selective controller (008-calibration's
// resolveSelectiveController): those two together caused sk-code's compiled
// router to under-route relative to legacy — the selective controller
// abstains on any ranked (2+-candidate) decision without a live calibration
// certificate, and a bare evidence-only single target was force-deferred by
// a withholdEvidenceOnlyRoute guard — neither of which the legacy replay
// (router-replay.cjs) implements. The generic policy (destinations,
// detectors, selectors, compositionRules, hashing) is still compiled and
// still valid; it just is not consulted for the live routing decision here.

const {
  canonicalize,
  computeRequestFactsHash,
} = require('../../../003-contract-schemas/lib/canonical.cjs');
const {
  parseRouteDecision,
} = require('../../../005-decision-evaluator/lib/decision-contract.cjs');

// A bare keyword like "review" gets swallowed by unrelated longer words
// ("preview" contains "review"), so it is matched on a word boundary — the
// exact guard the frozen legacy replay (router-replay.cjs's keywordHits)
// applies, and sk-code's own vocabulary carries "review" as a standalone
// keyword (code-review-aliases), so this guard is load-bearing here (unlike
// sk-design, whose vocabulary never uses these words as bare keywords).
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

// A hyphenated and a spaced prompt name the same thing, so both sides fold
// hyphen runs to one space and collapse whitespace before comparing.
function spaced(value) {
  return String(value).replace(/-+/g, ' ').replace(/\s+/g, ' ').trim();
}

function containsSignal(text, value) {
  const signal = spaced(normalize(value));
  const haystack = spaced(text);
  if (WORD_BOUNDARY_KEYWORDS.has(signal)) {
    return new RegExp(`\\b${escapePattern(signal)}\\b`, 'i').test(haystack);
  }
  return haystack.includes(signal);
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

// Look up the authored bundle kind (surfaceBundle vs orderedBundle) for an
// exact, tie-break-ordered mode set. The compiler generates one rule for every
// subset of two to four modes of the tie-break order, so a tie across more
// modes finds no match here.
function exactBundle(routingModel, orderedModes) {
  const candidate = orderedModes.join('\0');
  return routingModel.bundleRules.find((rule) => (
    rule.targetWorkflowModes.join('\0') === candidate
  )) || null;
}

function explicitMode(routingModel, value) {
  const normalized = normalize(value);
  return routingModel.modes.filter((mode) => (
    normalize(mode.workflowMode) === normalized
    || normalize(`sk-code/${mode.workflowMode}`) === normalized
  ));
}

// Score every mode by (count of distinct matched keyword forms) x weight.
// Weight is constant per mode, so counting each hit once matches the frozen
// legacy replay's scoreIntents formula. Keywords come from
// routingModel.modes[].keywords, the unfiltered union of hub-router.json's
// vocabularyClasses for that mode's routerSignals classes: the same source
// legacy projects, with no cross-mode ambiguity filtering. A vocabulary that
// lists both spellings of one phrase names it once, so the fold-deduped count
// keeps a single mention worth one hit rather than two.
function scoreModes(routingModel, text) {
  const direct = routingModel.modes.filter((mode) => (
    typeof mode.command === 'string' && containsSignal(text, mode.command)
  ));
  if (direct.length > 0) {
    return direct.map((mode) => ({ mode: mode.workflowMode, score: Number.MAX_SAFE_INTEGER }));
  }
  return routingModel.modes.map((mode) => {
    const matched = new Set(mode.keywords
      .filter((keyword) => containsSignal(text, keyword))
      .map((keyword) => spaced(normalize(keyword))));
    return { mode: mode.workflowMode, score: matched.size * mode.weight };
  }).filter((entry) => entry.score > 0);
}

// Keep every mode within ambiguityDelta of the top score — identical to the
// frozen legacy replay's selectIntents. Legacy never clarifies on a tie: it
// unconditionally returns every near-tied intent and the parity harness reads
// a non-empty result as `action: route`, so this router routes every
// near-tied set too (as a bundle) rather than asking for disambiguation.
function selectNearTiedModes(scores, ambiguityDelta) {
  if (scores.length === 0) return [];
  const top = scores[0].score;
  return scores.filter((entry) => top - entry.score <= ambiguityDelta).map((entry) => entry.mode);
}

// The caller may name the surface its session is working in, as a declared
// detection label such as SKILLED or as a workflowMode. Only a declared surface
// packet counts, so UNKNOWN, a workflow mode or an unknown name resolves to null.
function hintedSurface(snapshot, surfaceHint) {
  if (typeof surfaceHint !== 'string' || !surfaceHint.trim()) return null;
  const hint = normalize(surfaceHint);
  const labels = (snapshot.routingModel.surfaceDetection || {}).labels || {};
  const labelled = labels[hint.toUpperCase()];
  const match = snapshot.policy.destinations.find((destination) => (
    destination.id.packetKind === 'surface'
    && (destination.id.workflowMode === labelled
      || destination.id.workflowMode === hint
      || destination.id.workflowMode === `${destination.id.skillId}-${hint}`)
  ));
  return match ? match.id.workflowMode : null;
}

// Serve-time reorder of a validated route's targets. The compiled composition
// rules fix one order per surface set, so the hint is applied after validation
// and never inside evaluateCanary. The hinted surface takes the first surface
// slot, workflow modes keep their slots and no target is added or dropped, so a
// hint the prompt did not match returns the targets unchanged. The fallback
// surface ranks after every other surface, so a hint naming it changes nothing:
// the tie-break order already places it where it belongs.
function applySurfaceHint(snapshot, targets, surfaceHint) {
  const lead = hintedSurface(snapshot, surfaceHint);
  const isSurface = (target) => target.destinationId.packetKind === 'surface';
  const fallback = (snapshot.routingModel.surfaceDetection || {}).fallback || null;
  if (!lead || lead === fallback
    || !targets.some((target) => isSurface(target) && target.destinationId.workflowMode === lead)) {
    return targets;
  }
  const surfaces = targets.filter(isSurface);
  const reordered = [
    ...surfaces.filter((target) => target.destinationId.workflowMode === lead),
    ...surfaces.filter((target) => target.destinationId.workflowMode !== lead),
  ];
  let next = 0;
  return targets.map((target) => {
    if (!isSurface(target)) return target;
    next += 1;
    return reordered[next - 1];
  });
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
  return {
    advisorDisposition: built.disposition,
    decision,
    request: built.request,
    trace: {
      // Compatibility shim: harness/build-artifacts.cjs's typedGold() reads
      // trace.controller?.rankCalls ?? trace.evaluator.rankCalls unchanged
      // from before this rewrite; this router has no controller stage, so it
      // supplies the evaluator-shaped field directly rather than editing that
      // harness (out of this fix's file scope).
      evaluator: { rankCalls: scores.length > 1 ? 1 : 0 },
      matchedScores: scores,
      outcome: decision.action === 'route' ? decision.route.selectionKind : decision.action,
    },
  };
}

module.exports = {
  advisorDisposition,
  applySurfaceHint,
  buildRequest,
  evaluateCanary,
  scoreModes,
};
