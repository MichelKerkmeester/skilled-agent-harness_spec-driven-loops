// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ LIBRARY: CLI EXTERNAL ORCHESTRATION ROUTER                             ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const {
  computeRequestFactsHash,
} = require('../../../000-contract-schemas/lib/canonical.cjs');
const {
  parseRouteDecision,
} = require('../../../002-decision-evaluator/lib/decision-contract.cjs');
const { destinationKey } = require('./registry-compiler.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function target(destination) {
  return {
    authorityRef: destination.authorityRef,
    destinationId: destination.id,
    mutatesWorkspace: destination.mutatesWorkspace,
    role: destination.role,
  };
}

function requestFor(snapshot, input) {
  const request = {
    evidence: [],
    observations: [{ kind: 'intent', value: String(input.prompt || '') }],
    pinnedActivationGeneration: snapshot.policy.activationGeneration,
    schemaVersion: 'V1',
  };
  request.requestFactsHash = computeRequestFactsHash(request);
  return request;
}

function reject(reason) {
  return {
    action: 'reject',
    reject: { authority: 'Withheld', reason },
    schemaVersion: 'V1',
  };
}

function defer(reason) {
  return {
    action: 'defer',
    defer: {
      authority: 'Withheld',
      reason,
      recovery: ['clarify', 'defer'],
    },
    schemaVersion: 'V1',
  };
}

function clarify(modes) {
  return {
    action: 'clarify',
    clarify: {
      alternatives: [...modes, 'none_of_these'].slice(0, 4),
      authority: 'Withheld',
      budgetRef: 'uncertainty:cli-external-orchestration:v1',
      question: 'Which external CLI executor should handle this dispatch?',
    },
    schemaVersion: 'V1',
  };
}

function route(snapshot, workflowModes, selectionKind) {
  const byMode = new Map(snapshot.policy.destinations.map((destination) => (
    [destination.id.workflowMode, destination]
  )));
  const decision = {
    action: 'route',
    route: {
      authority: 'WithheldUntilVerify',
      basis: { kind: 'signal' },
      evidence: [],
      selectionKind,
      targets: workflowModes.map((mode) => target(byMode.get(mode))),
    },
    schemaVersion: 'V1',
  };
  return parseRouteDecision(decision, snapshot.policy);
}

function detectorMatches(text, detector) {
  return text.includes(String(detector.value).toLowerCase());
}

function scoredModes(snapshot, matchedDetectorIds) {
  const explicitSelectors = new Set(snapshot.destinationGraph.modeSignals
    .filter((signal) => signal.explicit)
    .map((signal) => signal.selectorId));
  const rows = new Map(snapshot.destinationGraph.tieBreak.map((mode, index) => (
    [mode, { explicitHits: 0, score: 0, tieBreakIndex: index, workflowMode: mode }]
  )));
  for (const selector of snapshot.policy.selectors) {
    const hits = selector.detectorIds.filter((id) => matchedDetectorIds.has(id)).length;
    if (hits === 0) continue;
    const row = rows.get(selector.destinationId.workflowMode);
    row.score += hits;
    if (explicitSelectors.has(selector.id)) row.explicitHits += hits;
  }
  return [...rows.values()].filter((row) => row.score > 0);
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. ROUTING
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Evaluate one request against the compiled hub contract.
 *
 * @param {Object} snapshot - Policy and destination-graph projections.
 * @param {Object} input - Prompt-bearing route input.
 * @returns {Object} Typed decision, immutable request, and diagnostic trace.
 */
function evaluateRoute(snapshot, input) {
  const text = String(input.prompt || '').toLowerCase();
  const request = requestFor(snapshot, input);
  const negative = snapshot.policy.detectors.find((detector) => (
    detector.kind === 'negative' && detectorMatches(text, detector)
  ));
  if (negative) {
    return {
      decision: reject('forbidden'),
      request,
      trace: { matchedDetectorIds: [negative.id], resolution: 'reject' },
    };
  }

  const matchedDetectorIds = new Set(snapshot.policy.detectors
    .filter((detector) => detector.kind === 'alias' && detectorMatches(text, detector))
    .map((detector) => detector.id));
  const scored = scoredModes(snapshot, matchedDetectorIds);
  if (scored.length === 0) {
    return {
      decision: defer('no-match'),
      request,
      trace: { matchedDetectorIds: [], resolution: 'defer' },
    };
  }

  const explicit = scored
    .filter((row) => row.explicitHits > 0)
    .sort((left, right) => left.tieBreakIndex - right.tieBreakIndex);
  if (explicit.length >= 2) {
    const modes = explicit.map((row) => row.workflowMode);
    return {
      decision: route(snapshot, modes, 'orderedBundle'),
      request,
      trace: {
        matchedDetectorIds: [...matchedDetectorIds].sort(),
        resolution: 'orderedBundle',
        scores: scored,
      },
    };
  }
  if (explicit.length === 1) {
    return {
      decision: route(snapshot, [explicit[0].workflowMode], 'single'),
      request,
      trace: {
        matchedDetectorIds: [...matchedDetectorIds].sort(),
        resolution: 'explicit-single',
        scores: scored,
      },
    };
  }

  scored.sort((left, right) => (
    right.score - left.score || left.tieBreakIndex - right.tieBreakIndex
  ));
  const ambiguityDelta = Number(snapshot.destinationGraph.ambiguityDelta);
  const topScore = scored[0].score;
  const ambiguous = scored.filter((row) => topScore - row.score <= ambiguityDelta);
  if (ambiguous.length > 1) {
    const modes = ambiguous
      .sort((left, right) => left.tieBreakIndex - right.tieBreakIndex)
      .map((row) => row.workflowMode);
    return {
      decision: clarify(modes),
      request,
      trace: {
        matchedDetectorIds: [...matchedDetectorIds].sort(),
        resolution: 'clarify',
        scores: scored,
      },
    };
  }
  return {
    decision: route(snapshot, [scored[0].workflowMode], 'single'),
    request,
    trace: {
      matchedDetectorIds: [...matchedDetectorIds].sort(),
      resolution: 'dominant-single',
      scores: scored,
    },
  };
}

/**
 * Keep advisor output non-authoritative unless it matches the compiled tuple.
 *
 * @param {Object} snapshot - Compiled projections.
 * @param {Object} advisor - Advisor state and identity.
 * @returns {Object} Contribution disposition.
 */
function advisorContribution(snapshot, advisor) {
  if (!advisor || ['absent', 'unavailable'].includes(advisor.state)) {
    return { contributes: false, reason: 'advisor-zero-evidence' };
  }
  if (advisor.state !== 'live') {
    return { contributes: false, reason: 'advisor-annotation-only' };
  }
  if (advisor.effectivePolicyHash !== snapshot.policy.effectivePolicyHash
    || advisor.projectionHash !== snapshot.advisorProjection.projectionHash) {
    return { contributes: false, reason: 'advisor-drift-annotation-only' };
  }
  return { contributes: true, reason: 'advisor-live-identity-match' };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  advisorContribution,
  evaluateRoute,
};
