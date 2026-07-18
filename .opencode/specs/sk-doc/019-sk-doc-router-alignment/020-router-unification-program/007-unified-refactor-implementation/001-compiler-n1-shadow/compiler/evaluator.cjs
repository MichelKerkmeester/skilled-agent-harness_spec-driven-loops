// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ LIBRARY: READ-ONLY SHADOW POLICY EVALUATOR                               ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const { compareUtf16 } = require('./order.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 1. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function detectorIndex(policy) {
  return new Map(policy.detectors.map((detector) => [detector.id, detector]));
}

function policyNumber(detectors, id, fallback) {
  const detector = detectors.get(id);
  if (!detector) return fallback;
  const value = Number(detector.value);
  return Number.isFinite(value) ? value : fallback;
}

function scoreSelectors(policy, taskText, detectors) {
  const text = taskText.toLowerCase();
  return policy.selectors.map((selector) => {
    const signalDetectors = selector.detectorIds
      .filter((id) => id.startsWith('detector:signal:'))
      .map((id) => detectors.get(id));
    const score = signalDetectors.reduce(
      (total, detector) => total + (detector && text.includes(detector.value) ? 1 : 0),
      0,
    );
    return { score, selector };
  }).filter((entry) => entry.score > 0)
    .sort((left, right) => {
      if (left.score !== right.score) return right.score - left.score;
      return compareUtf16(left.selector.id, right.selector.id);
    });
}

function targetFor(policy, destinationId) {
  const destination = policy.destinations.find((candidate) => (
    JSON.stringify(candidate.id) === JSON.stringify(destinationId)
  ));
  if (!destination) return null;
  return {
    authorityRef: destination.authorityRef,
    destinationId: destination.id,
    mutatesWorkspace: destination.mutatesWorkspace,
    role: destination.role,
  };
}

function selectorIntent(selector) {
  return selector.id.replace(/^selector:/, '');
}

function selectorResources(selector, detectors) {
  return selector.detectorIds
    .filter((id) => id.startsWith('detector:leaf:'))
    .map((id) => detectors.get(id)?.value)
    .filter(Boolean)
    .sort(compareUtf16);
}

function rejectDecision(reason) {
  return {
    action: 'reject',
    reject: {
      authority: 'Withheld',
      reason,
    },
    schemaVersion: 'V1',
  };
}

function deferDecision(reason) {
  return {
    action: 'defer',
    defer: {
      authority: 'Withheld',
      reason,
      recovery: ['clarify', 'defer', 'reject'],
    },
    schemaVersion: 'V1',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. EVALUATOR
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Evaluate a task against a compiled snapshot without authority or effects.
 *
 * @param {Object} policy - CompiledPolicyV1 snapshot.
 * @param {Object} request - Shadow request facts.
 * @param {string} request.taskText - Task text to classify.
 * @returns {Object} Typed decision plus non-authoritative diagnostics.
 */
function evaluatePolicy(policy, request) {
  const taskText = String(request?.taskText || '');
  const text = taskText.toLowerCase();
  const detectors = detectorIndex(policy);
  const negative = policy.detectors.find((detector) => (
    detector.kind === 'negative' && detector.value && text.includes(detector.value)
  ));
  if (negative) {
    return {
      decision: rejectDecision('forbidden'),
      diagnostics: {
        effects: [],
        matchedNegative: negative.value,
        rankCalls: 0,
        selectedIntents: [],
        selectedResources: [],
      },
    };
  }

  const scored = scoreSelectors(policy, taskText, detectors);
  if (scored.length === 0) {
    return {
      decision: deferDecision('no-match'),
      diagnostics: {
        effects: [],
        rankCalls: 0,
        selectedIntents: [],
        selectedResources: [],
      },
    };
  }

  const ambiguityDelta = policyNumber(detectors, 'policy:ambiguity-delta', 1);
  const maximumIntents = policyNumber(detectors, 'policy:maximum-intents', 2);
  const topScore = scored[0].score;
  const selected = scored
    .filter((entry) => topScore - entry.score <= ambiguityDelta)
    .slice(0, maximumIntents);
  if (selected.length > 1) {
    const alternatives = [
      ...selected.map((entry) => selectorIntent(entry.selector)),
      'none_of_these',
    ];
    return {
      decision: {
        action: 'clarify',
        clarify: {
          alternatives,
          authority: 'Withheld',
          budgetRef: 'uncertainty:single-turn',
          question: 'Which routing intent best matches this request?',
        },
        schemaVersion: 'V1',
      },
      diagnostics: {
        clarifyCount: 1,
        effects: [],
        rankCalls: 0,
        selectedIntents: selected.map((entry) => selectorIntent(entry.selector)),
        selectedResources: [],
      },
    };
  }

  const winner = selected[0].selector;
  const target = targetFor(policy, winner.destinationId);
  if (!target) {
    return {
      decision: deferDecision('dependency-failure'),
      diagnostics: {
        effects: [],
        rankCalls: 0,
        selectedIntents: [],
        selectedResources: [],
      },
    };
  }
  return {
    decision: {
      action: 'route',
      route: {
        authority: 'WithheldUntilVerify',
        basis: { kind: 'signal' },
        evidence: [],
        selectionKind: 'single',
        targets: [target],
      },
      schemaVersion: 'V1',
    },
    diagnostics: {
      effects: [],
      rankCalls: 0,
      selectedIntents: [selectorIntent(winner)],
      selectedResources: selectorResources(winner, detectors),
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  evaluatePolicy,
};
