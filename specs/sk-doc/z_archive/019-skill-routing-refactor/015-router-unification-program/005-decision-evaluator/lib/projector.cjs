// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Route-Gold Compatibility Projector                           ║
// ║ PURPOSE: Adapt typed decisions to the frozen scorer observation shape.  ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const { parseRouteDecision } = require('./decision-contract.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function unique(values) {
  return [...new Set(values)];
}

function pairKey(pair) {
  return `${pair.workflowMode}\u0000${pair.leafResourceId}`;
}

class ProjectionValidationError extends TypeError {
  /**
   * Create a projection error with a stable machine-readable reason.
   *
   * @param {string} code - Stable projection rejection reason.
   * @param {string} message - Human-readable projection detail.
   */
  constructor(code, message) {
    super(message);
    this.name = 'ProjectionValidationError';
    this.code = code;
  }
}

function buildManifestIndex(manifestResources) {
  const index = new Map();
  for (const entry of manifestResources) {
    if (!entry
      || typeof entry.workflowMode !== 'string'
      || typeof entry.leafResourceId !== 'string'
      || typeof entry.resource !== 'string'
      || entry.workflowMode.length === 0
      || entry.leafResourceId.length === 0
      || entry.resource.length === 0) {
      throw new TypeError('manifest resource entries require workflowMode, leafResourceId, and resource');
    }
    const key = pairKey(entry);
    if (index.has(key)) {
      throw new ProjectionValidationError(
        'MANIFEST_IDENTITY_DUPLICATE',
        `manifest identity is duplicated: ${entry.workflowMode}/${entry.leafResourceId}`
      );
    }
    index.set(key, entry.resource);
  }
  return index;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. PROJECTOR
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Project a typed decision into the frozen scorer observation convention.
 *
 * @param {Object} decision - RouteDecisionV1 to project.
 * @param {Object} [options] - Policy and manifest-aware projection inputs.
 * @param {Object} [options.policy] - Validated compiled policy for positive decisions.
 * @param {Array<{workflowMode:string,leafResourceId:string}>} [options.leafPairs]
 *   Typed leaf identities selected by the request adapter.
 * @param {Array<{workflowMode:string,leafResourceId:string,resource:string}>}
 *   [options.manifestResources] Frozen leaf-to-resource observations.
 * @returns {{observedIntents:string[],observedResources:string[]}} Scorer observation.
 */
function projectToRouteGold(decision, options = {}) {
  const parsed = parseRouteDecision(decision, options.policy);
  if (parsed.action !== 'route') {
    return { observedIntents: [], observedResources: [] };
  }

  const observedIntents = unique(
    parsed.route.targets.map((target) => target.destinationId.workflowMode)
  );
  const leafPairs = Array.isArray(options.leafPairs) ? options.leafPairs : [];
  const manifestResources = Array.isArray(options.manifestResources)
    ? options.manifestResources
    : [];
  const manifestIndex = buildManifestIndex(manifestResources);
  const observedResources = [];
  for (const pair of leafPairs) {
    if (!pair
      || typeof pair.workflowMode !== 'string'
      || typeof pair.leafResourceId !== 'string') {
      throw new TypeError('leaf pairs require workflowMode and leafResourceId');
    }
    if (!observedIntents.includes(pair.workflowMode)) {
      throw new TypeError(`leaf pair targets an unselected workflow mode: ${pair.workflowMode}`);
    }
    const resource = manifestIndex.get(pairKey(pair));
    if (!resource) {
      throw new TypeError(
        `leaf pair is absent from the manifest projection: ${pair.workflowMode}/${pair.leafResourceId}`
      );
    }
    observedResources.push(resource);
  }
  return { observedIntents, observedResources: unique(observedResources) };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  ProjectionValidationError,
  projectToRouteGold,
};
