// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Execution Route-Gold Compatibility Projector                 ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Adapt typed execution fixtures to the frozen scorer shape.      ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/* ─────────────────────────────────────────────────────────────
   1. HELPERS
──────────────────────────────────────────────────────────────── */

function unique(values) {
  return [...new Set(values)];
}

function assertDecision(decision) {
  if (!decision || decision.schemaVersion !== 'V1' || typeof decision.action !== 'string') {
    throw new TypeError('a RouteDecisionV1 value is required');
  }
}

/* ─────────────────────────────────────────────────────────────
   2. PROJECTOR
──────────────────────────────────────────────────────────────── */

/**
 * Project a typed route decision into the frozen scorer observation shape.
 *
 * @param {Object} decision - RouteDecisionV1 value used by the protocol fixture.
 * @param {string[]} [resources] - Separately resolved manifest resources.
 * @returns {{observedIntents:string[],observedResources:string[]}} Scorer observation.
 */
function projectExecutionToRouteGold(decision, resources = []) {
  assertDecision(decision);
  if (decision.action !== 'route') {
    return { observedIntents: [], observedResources: [] };
  }
  if (!decision.route
    || decision.route.authority !== 'WithheldUntilVerify'
    || !Array.isArray(decision.route.targets)
    || decision.route.targets.length === 0) {
    throw new TypeError('positive projection requires a valid authority-withheld route');
  }
  if (!Array.isArray(resources) || resources.some((resource) => typeof resource !== 'string')) {
    throw new TypeError('resources must be an array of strings');
  }
  return {
    observedIntents: unique(decision.route.targets.map((target) => (
      target.destinationId.workflowMode
    ))),
    observedResources: unique(resources),
  };
}

/* ─────────────────────────────────────────────────────────────
   3. EXPORTS
──────────────────────────────────────────────────────────────── */

module.exports = {
  projectExecutionToRouteGold,
};
