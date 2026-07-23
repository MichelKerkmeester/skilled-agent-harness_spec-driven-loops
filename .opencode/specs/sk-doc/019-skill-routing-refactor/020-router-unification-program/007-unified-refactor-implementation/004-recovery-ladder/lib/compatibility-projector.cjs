// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Recovery Compatibility Projector                                         ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const {
  computeProjectionHash,
} = require('../../000-contract-schemas/lib/canonical.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function qualifiedId(target) {
  const identity = target.destinationId;
  return `${identity.skillId}/${identity.workflowMode}`;
}

function uniqueStrings(values) {
  return [...new Set((values || []).map(String))];
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. PROJECTION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Project a recovery result into the existing scorer observation shape.
 *
 * @param {Object} result - Recovery result from the ordered ladder.
 * @returns {{observedIntents:string[], observedResources:string[]}} Scorer input.
 */
function projectCompatibility(result) {
  if (result.decision.action !== 'route') {
    return {
      observedIntents: [],
      observedResources: [],
    };
  }
  const compatibility = result.compatibility || {};
  return {
    observedIntents: uniqueStrings(compatibility.intents),
    observedResources: uniqueStrings(compatibility.resources),
  };
}

/**
 * Build a frozen-schema-shaped typed-gold row from a projected result.
 *
 * @param {Object} args - Typed row inputs.
 * @param {string} args.scenarioId - Stable fixture identity.
 * @param {string} args.effectivePolicyHash - Pinned shadow policy digest.
 * @param {Object} args.result - Recovery result.
 * @param {Object} args.observation - Existing scorer observation shape.
 * @returns {Object} TypedRouteGoldV1-compatible row.
 */
function buildTypedRouteGold({ scenarioId, effectivePolicyHash, result, observation }) {
  const decision = result.decision;
  const firstIntent = observation.observedIntents[0] || 'none';
  const targets = decision.action === 'route' ? decision.route.targets : [];
  const body = {
    schemaVersion: 'V1',
    scenarioId,
    effectivePolicyHash,
    decisionAction: decision.action,
    ...(decision.action === 'route'
      ? { selectionKind: decision.route.selectionKind }
      : {}),
    targetQualifiedIds: targets.map(qualifiedId),
    observedIntents: observation.observedIntents,
    observedResources: observation.observedResources.map((resource) => ({
      intent: firstIntent,
      resource,
    })),
    receiptAttempts: [],
    assertions: {
      rankCalls: result.trace.rankCalls,
      handoffEdges: result.trace.ownershipTransfers.map(
        (transfer) => `${transfer.from || 'unowned'}->${transfer.to}`
      ),
      duplicateIdempotencyKeyProducesSingleReceipt: false,
    },
  };
  return {
    ...body,
    projectionHash: computeProjectionHash('TypedRouteGoldV1', body),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  buildTypedRouteGold,
  projectCompatibility,
};
