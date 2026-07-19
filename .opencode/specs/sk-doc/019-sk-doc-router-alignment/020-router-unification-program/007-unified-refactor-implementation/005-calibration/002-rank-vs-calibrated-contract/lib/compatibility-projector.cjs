// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Calibration-Invisible Compatibility Projector                           ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const {
  CalibrationContractError,
  assertProbabilityLegality,
  validateRouteDecision,
} = require('./calibration-contract.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. PROJECTION
// ─────────────────────────────────────────────────────────────────────────────

function unique(values) {
  return [...new Set(values)];
}

function pairKey(pair) {
  return `${pair.workflowMode}\u0000${pair.leafResourceId}`;
}

function fail(code, message) {
  throw new CalibrationContractError(code, message);
}

function unwrapDecision(value) {
  if (value && typeof value === 'object' && !Array.isArray(value)
    && Object.prototype.hasOwnProperty.call(value, 'decision')) {
    return value.decision;
  }
  return value;
}

const NEGATIVE_BRANCH_FIELDS = Object.freeze({
  clarify: Object.freeze(['question', 'budgetRef', 'alternatives', 'authority']),
  defer: Object.freeze(['reason', 'recovery', 'authority']),
  reject: Object.freeze(['reason', 'authority']),
});

function validateNegativeDecision(decision) {
  if (!decision || typeof decision !== 'object' || Array.isArray(decision)) {
    fail('NEGATIVE_DECISION_INVALID', 'decision must be an object');
  }
  if (!['clarify', 'defer', 'reject'].includes(decision.action)) {
    fail('NEGATIVE_DECISION_ACTION_INVALID', 'decision must use a closed negative action');
  }
  if (decision.schemaVersion !== 'V1') {
    fail('NEGATIVE_DECISION_VERSION_INVALID', 'negative decision schemaVersion must be V1');
  }
  const topLevelKeys = new Set(['schemaVersion', 'action', decision.action]);
  const topLevelExtras = Object.keys(decision).filter((key) => !topLevelKeys.has(key));
  if (topLevelExtras.length > 0) {
    fail(
      'NEGATIVE_DECISION_FIELDS_INVALID',
      `negative decision contains unsupported fields: ${topLevelExtras.join(', ')}`
    );
  }
  const payload = decision[decision.action];
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    fail('NEGATIVE_DECISION_PAYLOAD_INVALID', 'negative decision payload must be an object');
  }
  assertProbabilityLegality([decision], false);
  const allowedFields = NEGATIVE_BRANCH_FIELDS[decision.action];
  const allowed = new Set(allowedFields);
  const extras = Object.keys(payload).filter((key) => !allowed.has(key));
  const missing = allowedFields.filter(
    (key) => !Object.prototype.hasOwnProperty.call(payload, key)
  );
  if (extras.length > 0 || missing.length > 0) {
    fail(
      'NEGATIVE_DECISION_FIELDS_INVALID',
      `${decision.action} fields are not exact; extras=${extras.join(',')}; missing=${missing.join(',')}`
    );
  }
  if (payload.authority !== 'Withheld') {
    fail('NEGATIVE_DECISION_AUTHORITY_INVALID', 'negative decisions must withhold authority');
  }
  return decision;
}

function validateLegalityResult(result) {
  if (!result || typeof result !== 'object' || Array.isArray(result)
    || !Object.prototype.hasOwnProperty.call(result, 'decision')) {
    fail(
      'PROJECTION_LEGALITY_RESULT_REQUIRED',
      'projection requires an externally established legality result'
    );
  }
  if (typeof result.calibratedAutoRouteAvailable !== 'boolean'
    || typeof result.certificateNoOp !== 'boolean') {
    if (result.schemaVersion === 'CalibrationEvidenceEnvelopeV1') {
      fail(
        'PROJECTION_LEGALITY_RESULT_REQUIRED',
        'calibration evidence must pass through the evaluator before projection'
      );
    }
    fail(
      'PROJECTION_LEGALITY_RESULT_INVALID',
      'legality result must declare calibrated availability and certificate no-op state'
    );
  }
  const decision = result.decision.action === 'route'
    ? validateRouteDecision(result.decision)
    : validateNegativeDecision(result.decision);
  const routeIsLegal = result.calibratedAutoRouteAvailable || result.certificateNoOp;
  if (decision.action === 'route' && !routeIsLegal) {
    fail('PROJECTION_ROUTE_NOT_LEGAL', 'external legality result does not admit a route');
  }
  if (decision.action !== 'route' && routeIsLegal) {
    fail('PROJECTION_LEGALITY_RESULT_INVALID', 'negative decision cannot admit a route');
  }
  return {
    decision,
    isProbabilityLicensed: result.calibratedAutoRouteAvailable,
  };
}

/**
 * Project a public decision while ignoring out-of-band calibration evidence.
 *
 * @param {Object} value - Public decision or controller/evaluator envelope.
 * @param {Object} request - Pinned manifest and leaf-pair inputs.
 * @returns {{observedIntents:string[],observedResources:string[]}} Scorer input.
 */
function projectCompatibility(value, request) {
  const decision = unwrapDecision(value);
  if (decision.action !== 'route') {
    validateNegativeDecision(decision);
    return { observedIntents: [], observedResources: [] };
  }
  const parsed = validateRouteDecision(decision);
  const observedIntents = unique(
    parsed.route.targets.map((target) => target.destinationId.workflowMode)
  );
  const manifest = new Map(
    (request.manifestResources || []).map((entry) => [pairKey(entry), entry.resource])
  );
  const observedResources = [];
  for (const pair of request.leafPairs || []) {
    if (!observedIntents.includes(pair.workflowMode)) {
      throw new TypeError(`leaf pair targets an unselected mode: ${pair.workflowMode}`);
    }
    const resource = manifest.get(pairKey(pair));
    if (!resource) {
      throw new TypeError(
        `leaf pair is absent from the pinned manifest: ${pair.workflowMode}/${pair.leafResourceId}`
      );
    }
    observedResources.push(resource);
  }
  return {
    observedIntents,
    observedResources: unique(observedResources),
  };
}

/**
 * Build all read-only projections while keeping calibration projection-invisible.
 *
 * @param {Object} legalityResult - Externally established evaluator verdict.
 * @param {Object} request - Request and manifest identity.
 * @returns {Object} Advisor, typed-gold, policy-card, and compatibility projections.
 */
function projectAll(legalityResult, request) {
  const { decision: parsed, isProbabilityLicensed } = validateLegalityResult(
    legalityResult
  );
  const compatibility = projectCompatibility(parsed, request);
  const route = parsed.action === 'route' ? parsed.route : null;
  const targetQualifiedIds = route
    ? route.targets.map((target) => (
      `${target.destinationId.skillId}/${target.destinationId.workflowMode}`
    ))
    : [];
  const projections = {
    compatibility,
    advisorProjection: {
      schemaVersion: 'V1',
      hubId: request.hubId,
      effectivePolicyHash: request.pinnedActivationGeneration.effectivePolicyHash,
      eligibleModes: compatibility.observedIntents,
    },
    typedRouteGold: {
      schemaVersion: 'V1',
      decisionAction: parsed.action,
      ...(route ? { selectionKind: route.selectionKind } : {}),
      targetQualifiedIds,
      observedIntents: compatibility.observedIntents,
      observedResources: compatibility.observedResources,
    },
    policyCard: [
      '# Route Policy Card',
      '',
      `- Action: ${parsed.action}`,
      ...(route ? [`- Selection: ${route.selectionKind}`] : []),
      `- Targets: ${targetQualifiedIds.join(', ')}`,
      `- Authority: ${route ? route.authority : parsed[parsed.action].authority}`,
    ].join('\n'),
  };
  assertProbabilityLegality(
    [
      parsed,
      projections.advisorProjection,
      projections.typedRouteGold,
      projections.policyCard,
    ],
    isProbabilityLicensed
  );
  return projections;
}

module.exports = {
  projectAll,
  projectCompatibility,
};
