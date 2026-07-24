// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ LIBRARY: ZERO-AUTHORITY SHADOW PARITY                                    ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const { compareUtf16 } = require('../compiler/order.cjs');
const { validateActivationManifest } = require('../activation/fenced-manifest.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 1. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function sameStrings(left, right) {
  const leftValues = [...new Set(left)].sort(compareUtf16);
  const rightValues = [...new Set(right)].sort(compareUtf16);
  return JSON.stringify(leftValues) === JSON.stringify(rightValues);
}

function classifyMismatch(compiled, legacy) {
  const action = compiled.decision.action;
  if (action === 'defer' && legacy.resources.length > 0) return 'legacy-default-union';
  if (action === 'clarify' && legacy.intents.length > 1) return 'typed-clarify-vs-legacy-multi-route';
  if (action === 'reject' && legacy.resources.length > 0) return 'typed-reject-vs-legacy-fallback';
  if (action !== 'route') return `typed-${action}-vs-legacy-route`;
  if (!sameStrings(compiled.diagnostics.selectedIntents, legacy.intents)) {
    return 'intent-mismatch';
  }
  if (!sameStrings(compiled.diagnostics.selectedResources, legacy.resources)) {
    return 'resource-mismatch';
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. PARITY RUNNER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compare compiled decisions with serving legacy observations without effects.
 *
 * @param {Object} input - Parity dependencies and scenarios.
 * @param {Object} input.policy - CompiledPolicyV1 snapshot.
 * @param {Array<Object>} input.scenarios - Read-only task scenarios.
 * @param {Function} input.evaluateCompiled - Pure compiled evaluator.
 * @param {Function} input.evaluateLegacy - Read-only legacy router adapter.
 * @returns {Object} Classified parity report.
 */
function runShadowParity(input) {
  const manifest = validateActivationManifest(input.activationManifest, 'pinned activation manifest');
  const legacyServingAuthority = (
    manifest.servingAuthority === 'legacy' && manifest.shadowOnly === true
  );
  const rows = input.scenarios.map((scenario) => {
    const compiled = input.evaluateCompiled(input.policy, { taskText: scenario.taskText });
    const legacy = input.evaluateLegacy(scenario.taskText);
    const mismatchClass = classifyMismatch(compiled, legacy);
    return {
      compiledAction: compiled.decision.action,
      effectCount: compiled.diagnostics.effects.length,
      legacyAuthoritative: legacyServingAuthority,
      legacyIntents: [...legacy.intents],
      legacyResources: [...legacy.resources],
      mismatchClass,
      scenarioId: scenario.scenarioId,
    };
  });
  const effectCount = rows.reduce((total, row) => total + row.effectCount, 0);
  return {
    activationDeferred: true,
    effectCount,
    goldMutation: effectCount === 0 ? 'observed-none' : 'observed-effects',
    legacyServingAuthority,
    manifestGeneration: manifest.selectedPolicy.generation,
    matches: rows.filter((row) => row.mismatchClass === null).length,
    mismatches: rows.filter((row) => row.mismatchClass !== null).length,
    rows,
    status: 'shadow-partial',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  runShadowParity,
};
