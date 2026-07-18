// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Destination-Local Execution Plane                            ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Fence effects behind fresh proof and local authority checks.    ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/* ─────────────────────────────────────────────────────────────
   1. MODULE IMPORTS
──────────────────────────────────────────────────────────────── */

const {
  DOMAIN_TAGS,
  canonicalize,
  computeProofHash,
  hashArtifact,
} = require('../../000-contract-schemas/lib/canonical.cjs');
const { InMemoryIdempotencyLedger } = require('./idempotency-ledger.cjs');

/* ─────────────────────────────────────────────────────────────
   2. CONSTANTS
──────────────────────────────────────────────────────────────── */

const VERIFY_STATES = Object.freeze([
  'READY',
  'STALE_PROOF',
  'NEEDS_INPUT',
  'DEFER',
  'REJECT',
]);
const NEGATIVE_ACTIONS = Object.freeze(['clarify', 'defer', 'reject']);
const VERSIONED_RESOURCE_PATTERN = /\.v[1-9][0-9]*$/;
const DIGEST_PATTERN = /^[a-f0-9]{64}$/;
const READY_BRAND = Symbol('destination-ready-verification');

/* ─────────────────────────────────────────────────────────────
   3. VALIDATION AND HASH HELPERS
──────────────────────────────────────────────────────────────── */

class ExecutionProtocolError extends Error {
  /**
   * Create a protocol failure with a stable machine-readable code.
   *
   * @param {string} code - Stable rejection reason.
   * @param {string} message - Human-readable failure detail.
   */
  constructor(code, message) {
    super(message);
    this.name = 'ExecutionProtocolError';
    this.code = code;
  }
}

function fail(code, message) {
  throw new ExecutionProtocolError(code, message);
}

function assertPlainObject(value, label) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    fail('INPUT_INVALID', `${label} must be an object`);
  }
}

function assertNonEmptyString(value, label) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    fail('INPUT_INVALID', `${label} must be a non-empty string`);
  }
}

function assertDigest(value, label) {
  if (!DIGEST_PATTERN.test(value)) fail('INPUT_INVALID', `${label} must be a SHA-256 digest`);
}

function assertEpoch(value, label) {
  if (!Number.isSafeInteger(value) || value < 0) {
    fail('INPUT_INVALID', `${label} must be a non-negative safe integer`);
  }
}

function cloneCanonical(value) {
  return JSON.parse(canonicalize(value));
}

function deepFreeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
}

function targetKey(target) {
  return canonicalize(target);
}

function bindingDigest(kind, value) {
  return hashArtifact(DOMAIN_TAGS.RouteProofV1, { bindingKind: kind, value });
}

function validateTarget(target, label) {
  assertPlainObject(target, label);
  assertPlainObject(target.destinationId, `${label}.destinationId`);
  for (const field of ['skillId', 'workflowMode', 'packetId', 'packetKind', 'backendKind']) {
    assertNonEmptyString(target.destinationId[field], `${label}.destinationId.${field}`);
  }
  if (!['actor', 'evidence', 'transport', 'judgment'].includes(target.role)) {
    fail('INPUT_INVALID', `${label}.role is invalid`);
  }
  assertNonEmptyString(target.authorityRef, `${label}.authorityRef`);
  if (typeof target.mutatesWorkspace !== 'boolean') {
    fail('INPUT_INVALID', `${label}.mutatesWorkspace must be boolean`);
  }
  if (target.role === 'evidence' && target.mutatesWorkspace) {
    fail('EVIDENCE_MUTATION_FORBIDDEN', 'evidence targets must remain read-only');
  }
}

function validateVersionedReadSet(readSet) {
  if (!Array.isArray(readSet)) fail('INPUT_INVALID', 'readSet must be an array');
  const seen = new Set();
  for (const entry of readSet) {
    assertPlainObject(entry, 'readSet entry');
    assertNonEmptyString(entry.resourceId, 'readSet.resourceId');
    if (!VERSIONED_RESOURCE_PATTERN.test(entry.resourceId)) {
      fail('READ_SET_UNVERSIONED', `${entry.resourceId} lacks a version suffix`);
    }
    assertDigest(entry.digest, `readSet.${entry.resourceId}.digest`);
    if (seen.has(entry.resourceId)) fail('READ_SET_DUPLICATE', entry.resourceId);
    seen.add(entry.resourceId);
  }
}

function validateBindingContext(context) {
  assertPlainObject(context, 'binding context');
  assertDigest(context.requestFactsHash, 'requestFactsHash');
  assertDigest(context.effectivePolicyHash, 'effectivePolicyHash');
  assertDigest(context.registryAuthorityHash, 'registryAuthorityHash');
  assertNonEmptyString(context.authorityClass, 'authorityClass');
  if (!Array.isArray(context.preconditions)) fail('INPUT_INVALID', 'preconditions must be an array');
  context.preconditions.forEach((value, index) => (
    assertNonEmptyString(value, `preconditions[${index}]`)
  ));
  validateVersionedReadSet(context.readSet);
  assertEpoch(context.epoch, 'epoch');
  assertEpoch(context.expiresAtEpoch, 'expiresAtEpoch');
  if (context.expiresAtEpoch < context.epoch) {
    fail('INPUT_INVALID', 'expiresAtEpoch must not precede epoch');
  }
}

function scheduleTargets(targets) {
  return targets
    .map((target, originalIndex) => ({ target, originalIndex }))
    .sort((left, right) => (
      Number(left.target.mutatesWorkspace) - Number(right.target.mutatesWorkspace)
      || left.originalIndex - right.originalIndex
    ))
    .map(({ target }) => target);
}

function bindingReadSet(context, orderedTargets) {
  return [
    { resourceId: 'request-facts.v1', digest: context.requestFactsHash },
    { resourceId: 'effective-policy.v1', digest: context.effectivePolicyHash },
    { resourceId: 'registry-authority.v1', digest: context.registryAuthorityHash },
    {
      resourceId: 'ordered-targets.v1',
      digest: bindingDigest('orderedTargets', orderedTargets),
    },
    {
      resourceId: 'authority-class.v1',
      digest: bindingDigest('authorityClass', context.authorityClass),
    },
    {
      resourceId: 'preconditions.v1',
      digest: bindingDigest('preconditions', context.preconditions),
    },
    ...context.readSet,
  ];
}

function idempotencyKey(context, target) {
  return bindingDigest('idempotencyKey', {
    requestFactsHash: context.requestFactsHash,
    target,
    effectivePolicyHash: context.effectivePolicyHash,
  });
}

function statementHash(context, orderedTargets, target, readSet) {
  return bindingDigest('preparedStatement', {
    requestFactsHash: context.requestFactsHash,
    effectivePolicyHash: context.effectivePolicyHash,
    registryAuthorityHash: context.registryAuthorityHash,
    readSet,
    orderedTargets,
    target,
    authorityClass: context.authorityClass,
    preconditions: context.preconditions,
    epoch: context.epoch,
    expiresAtEpoch: context.expiresAtEpoch,
  });
}

function planId(context, orderedTargets) {
  return bindingDigest('planningEpoch', {
    requestFactsHash: context.requestFactsHash,
    effectivePolicyHash: context.effectivePolicyHash,
    epoch: context.epoch,
    orderedTargets,
  });
}

/* ─────────────────────────────────────────────────────────────
   4. PURE PREPARE
──────────────────────────────────────────────────────────────── */

function validateDecisionForPrepare(decision) {
  assertPlainObject(decision, 'decision');
  if (decision.schemaVersion !== 'V1') fail('DECISION_INVALID', 'schemaVersion must be V1');
  if (NEGATIVE_ACTIONS.includes(decision.action)) {
    const branch = decision[decision.action];
    if (!branch || branch.authority !== 'Withheld' || decision.route || decision.targets) {
      fail('NEGATIVE_DECISION_INVALID', 'negative decisions must be target-free and authority-free');
    }
    return false;
  }
  if (decision.action !== 'route' || !decision.route) {
    fail('DECISION_INVALID', 'decision action is outside the closed algebra');
  }
  if (decision.route.authority !== 'WithheldUntilVerify') {
    fail('ROUTE_AUTHORITY_INVALID', 'route authority must remain withheld until destination verify');
  }
  if (!Array.isArray(decision.route.targets) || decision.route.targets.length === 0) {
    fail('ROUTE_TARGETS_INVALID', 'route targets must be non-empty');
  }
  decision.route.targets.forEach((target, index) => validateTarget(target, `targets[${index}]`));
  return true;
}

/**
 * Emit frozen proof evidence without reading or mutating destination state.
 *
 * @param {Object} decision - Frozen RouteDecisionV1 value.
 * @param {Object} context - Request, policy, authority, and expiry bindings.
 * @returns {{preparedLegs:Object[],protocolPath:string[]}} Prepared route legs.
 */
function prepareRoute(decision, context) {
  const isRoute = validateDecisionForPrepare(decision);
  if (!isRoute) {
    return Object.freeze({ preparedLegs: Object.freeze([]), protocolPath: Object.freeze(['PREPARE']) });
  }
  validateBindingContext(context);
  const orderedTargets = deepFreeze(cloneCanonical(scheduleTargets(decision.route.targets)));
  const readSet = bindingReadSet(context, orderedTargets);
  const currentPlanId = planId(context, orderedTargets);
  const preparedLegs = orderedTargets.map((target, sequence) => {
    const proofBody = cloneCanonical({
      schemaVersion: 'V1',
      destinationId: target.destinationId,
      readSet,
      epoch: context.epoch,
      expiresAtEpoch: context.expiresAtEpoch,
      idempotencyKey: idempotencyKey(context, target),
      attestation: {
        issuer: 'route-prepare-adapter',
        statementHash: statementHash(context, orderedTargets, target, readSet),
      },
    });
    const proof = deepFreeze({ ...proofBody, proofHash: computeProofHash(proofBody) });
    return Object.freeze({
      planId: currentPlanId,
      sequence,
      target,
      orderedTargets,
      authorityClass: context.authorityClass,
      preconditions: deepFreeze(cloneCanonical(context.preconditions)),
      proof,
    });
  });
  return Object.freeze({
    preparedLegs: Object.freeze(preparedLegs),
    protocolPath: Object.freeze(['PREPARE']),
  });
}

/* ─────────────────────────────────────────────────────────────
   5. DESTINATION EXECUTION
──────────────────────────────────────────────────────────────── */

class DestinationExecutionPlane {
  /**
   * Create a destination-local coordinator with no live authority by default.
   *
   * @param {Object} options - Initial destination state.
   * @param {number} options.planningEpoch - Currently active generation.
   * @param {InMemoryIdempotencyLedger} [options.ledger] - Destination ledger.
   */
  constructor(options) {
    assertPlainObject(options, 'execution plane options');
    assertEpoch(options.planningEpoch, 'planningEpoch');
    this.planningEpoch = options.planningEpoch;
    this.ledger = options.ledger || new InMemoryIdempotencyLedger();
    this.adapterEnabled = true;
    this.resolvedByPlan = new Map();
  }

  /** Disable every phase-local pre-effect entry point. */
  disablePreEffectAdapter() {
    this.adapterEnabled = false;
  }

  /**
   * Run pure PREPARE only while the reversible adapter is enabled.
   *
   * @param {Object} decision - Frozen RouteDecisionV1 value.
   * @param {Object} context - Current request and policy bindings.
   * @returns {{preparedLegs:Object[],protocolPath:string[]}} Prepared route result.
   */
  prepare(decision, context) {
    if (!this.adapterEnabled) {
      return Object.freeze({ preparedLegs: Object.freeze([]), protocolPath: Object.freeze(['PREPARE']) });
    }
    return prepareRoute(decision, context);
  }

  /**
   * Recompute every proof binding and current authority at the destination.
   *
   * @param {Object} leg - One prepared route leg.
   * @param {Object} current - Current request, policy, registry, and read-set state.
   * @param {Object} destination - Destination authority adapter.
   * @returns {Object} One closed verification state.
   */
  verify(leg, current, destination) {
    assertPlainObject(leg, 'prepared leg');
    assertPlainObject(current, 'current bindings');
    assertPlainObject(destination, 'destination adapter');
    if (typeof destination.verifyCurrentAuthority !== 'function') {
      fail('DESTINATION_ADAPTER_INVALID', 'verifyCurrentAuthority is required');
    }

    const staleReasons = [];
    if (computeProofHash(leg.proof) !== leg.proof.proofHash) staleReasons.push('proof-hash');
    if (leg.proof.epoch !== this.planningEpoch) staleReasons.push('generation');
    assertEpoch(current.currentEpoch, 'currentEpoch');
    if (current.currentEpoch > leg.proof.expiresAtEpoch) staleReasons.push('expiry');

    const bindingContext = {
      ...current,
      epoch: leg.proof.epoch,
      expiresAtEpoch: leg.proof.expiresAtEpoch,
    };
    validateBindingContext(bindingContext);
    const orderedTargets = Array.isArray(current.orderedTargets)
      ? current.orderedTargets
      : leg.orderedTargets;
    orderedTargets.forEach((target, index) => validateTarget(target, `orderedTargets[${index}]`));
    const expectedReadSet = bindingReadSet(bindingContext, orderedTargets);
    if (canonicalize(expectedReadSet) !== canonicalize(leg.proof.readSet)) {
      staleReasons.push('bound-digest');
    }
    const expectedStatementHash = statementHash(
      bindingContext,
      orderedTargets,
      leg.target,
      expectedReadSet
    );
    if (expectedStatementHash !== leg.proof.attestation.statementHash) {
      staleReasons.push('attestation');
    }
    if (staleReasons.length > 0) {
      return Object.freeze({
        state: 'STALE_PROOF',
        reasons: Object.freeze([...new Set(staleReasons)]),
        protocolPath: Object.freeze(['PREPARE', 'VERIFY']),
      });
    }

    const authorityResult = destination.verifyCurrentAuthority({
      target: leg.target,
      authorityClass: current.authorityClass,
      preconditions: current.preconditions,
    });
    assertPlainObject(authorityResult, 'authority verification');
    if (!VERIFY_STATES.includes(authorityResult.state)) {
      fail('VERIFY_STATE_INVALID', 'destination returned a state outside the closed set');
    }
    if (authorityResult.state !== 'READY') {
      return Object.freeze({
        state: authorityResult.state,
        reason: authorityResult.reason || null,
        protocolPath: Object.freeze(['PREPARE', 'VERIFY']),
      });
    }

    return Object.freeze({
      state: 'READY',
      proofHash: leg.proof.proofHash,
      planId: leg.planId,
      sequence: leg.sequence,
      verifiedEpoch: this.planningEpoch,
      targetKey: targetKey(leg.target),
      protocolPath: Object.freeze(['PREPARE', 'VERIFY']),
      [READY_BRAND]: true,
    });
  }

  resolvedSet(planId) {
    let resolved = this.resolvedByPlan.get(planId);
    if (!resolved) {
      resolved = new Set();
      this.resolvedByPlan.set(planId, resolved);
    }
    return resolved;
  }

  validateReady(leg, verification) {
    if (!verification
      || verification[READY_BRAND] !== true
      || verification.state !== 'READY'
      || verification.proofHash !== leg.proof.proofHash
      || verification.planId !== leg.planId
      || verification.sequence !== leg.sequence
      || verification.targetKey !== targetKey(leg.target)) {
      fail('COMMIT_WITHOUT_READY', 'commit requires the matching destination READY verification');
    }
  }

  /**
   * Resolve evidence-only work without granting it COMMIT authority.
   *
   * @param {Object} leg - Prepared evidence leg.
   * @param {Object} verification - Matching READY verification.
   * @returns {{state:string,sequence:number}} Resolution marker.
   */
  resolveEvidence(leg, verification) {
    this.validateReady(leg, verification);
    if (leg.target.role !== 'evidence') {
      fail('ROLE_RESOLUTION_INVALID', 'only evidence targets use evidence resolution');
    }
    this.resolvedSet(leg.planId).add(leg.sequence);
    return Object.freeze({ state: 'RESOLVED_READ_ONLY', sequence: leg.sequence });
  }

  /**
   * Acquire local authority, execute once, record a receipt, and fence mutation.
   *
   * @param {Object} leg - Prepared effect-capable route leg.
   * @param {Object} verification - Matching READY verification.
   * @param {Object} destination - Destination-owned authority and effect adapter.
   * @param {Object} options - Timestamp and retention horizon.
   * @returns {Object} Receipt, duplicate marker, and fencing result.
   */
  commit(leg, verification, destination, options) {
    this.validateReady(leg, verification);
    if (!this.adapterEnabled) fail('ADAPTER_DISABLED', 'pre-effect adapter is disabled');
    if (leg.target.role === 'evidence') {
      fail('ROLE_CANNOT_COMMIT', 'evidence targets can verify and resolve but never commit');
    }
    assertPlainObject(destination, 'destination adapter');
    assertPlainObject(options, 'commit options');
    if (typeof destination.acquireLocalAuthority !== 'function'
      || typeof destination.performEffect !== 'function') {
      fail('DESTINATION_ADAPTER_INVALID', 'local authority and effect callbacks are required');
    }
    assertNonEmptyString(options.timestamp, 'timestamp');
    assertEpoch(options.retentionUntilEpoch, 'retentionUntilEpoch');
    if (options.retentionUntilEpoch < leg.proof.expiresAtEpoch) {
      fail('RETENTION_TOO_SHORT', 'ledger retention must outlive proof expiry');
    }
    if (!['atomic', 'non-atomic'].includes(destination.atomicity)) {
      fail('DESTINATION_ADAPTER_INVALID', 'destination atomicity must be declared');
    }

    const partitionKey = canonicalize({
      destinationId: leg.proof.destinationId,
      authorityClass: leg.authorityClass,
    });
    const originalReceipt = this.ledger.lookupReceipt(partitionKey, leg.proof.idempotencyKey);
    if (originalReceipt) {
      return Object.freeze({
        duplicate: true,
        receipt: originalReceipt,
        fencingEpoch: originalReceipt.epoch,
        invalidatedLaterLegs: Object.freeze([]),
        protocolPath: Object.freeze(['PREPARE', 'VERIFY', 'COMMIT']),
      });
    }

    if (verification.verifiedEpoch !== this.planningEpoch
      || leg.proof.epoch !== this.planningEpoch) {
      fail('READY_STALE', 'planning epoch changed after verify');
    }
    const resolved = this.resolvedSet(leg.planId);
    const unresolvedReadOnly = leg.orderedTargets
      .map((target, sequence) => ({ target, sequence }))
      .filter(({ target, sequence }) => (
        sequence < leg.sequence && !target.mutatesWorkspace && !resolved.has(sequence)
      ));
    if (unresolvedReadOnly.length > 0) {
      fail('ORDERING_BLOCKED', 'read-only legs must resolve before a mutating leg commits');
    }

    const acquired = destination.acquireLocalAuthority({
      target: leg.target,
      authorityClass: leg.authorityClass,
      preconditions: leg.preconditions,
    });
    if (!acquired || acquired.state !== 'ACQUIRED' || !acquired.handle) {
      fail('LOCAL_AUTHORITY_NOT_ACQUIRED', 'destination did not acquire current local authority');
    }

    const commitEpoch = this.planningEpoch;
    const fencingEpoch = leg.target.mutatesWorkspace ? commitEpoch + 1 : commitEpoch;
    const ledgerResult = this.ledger.commitOnce({
      partitionKey,
      idempotencyKey: leg.proof.idempotencyKey,
      atomicity: destination.atomicity,
      retentionUntilEpoch: options.retentionUntilEpoch,
      performEffect: () => destination.performEffect({
        authorityHandle: acquired.handle,
        idempotencyKey: leg.proof.idempotencyKey,
        target: leg.target,
      }),
      createReceipt: (outcome) => ({
        idempotencyKey: leg.proof.idempotencyKey,
        epoch: fencingEpoch,
        effectivePolicyHash: leg.proof.readSet.find((entry) => (
          entry.resourceId === 'effective-policy.v1'
        )).digest,
        target: leg.target,
        outcome,
        timestamp: options.timestamp,
      }),
    });
    resolved.add(leg.sequence);

    let invalidatedLaterLegs = [];
    if (leg.target.mutatesWorkspace) {
      this.planningEpoch = fencingEpoch;
      this.ledger.stampFence(partitionKey, fencingEpoch);
      invalidatedLaterLegs = leg.orderedTargets
        .map((target, sequence) => ({ target, sequence }))
        .filter(({ sequence }) => sequence > leg.sequence && !resolved.has(sequence))
        .map(({ sequence }) => sequence);
    }

    return Object.freeze({
      duplicate: ledgerResult.duplicate,
      receipt: ledgerResult.receipt,
      fencingEpoch,
      invalidatedLaterLegs: Object.freeze(invalidatedLaterLegs),
      protocolPath: Object.freeze(['PREPARE', 'VERIFY', 'COMMIT']),
    });
  }
}

/* ─────────────────────────────────────────────────────────────
   6. EXPORTS
──────────────────────────────────────────────────────────────── */

module.exports = {
  DestinationExecutionPlane,
  ExecutionProtocolError,
  prepareRoute,
};
