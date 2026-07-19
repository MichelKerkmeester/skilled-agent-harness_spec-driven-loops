'use strict';

const crypto = require('node:crypto');

const {
  DOMAIN_TAGS,
  canonicalize,
  computeProofHash,
  hashArtifact,
} = require('../../../000-contract-schemas/lib/canonical.cjs');
const { destinationKey } = require('./registry-compiler.cjs');

class CompositionExecutionError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'CompositionExecutionError';
    this.code = code;
  }
}

function fail(code, message) {
  throw new CompositionExecutionError(code, message);
}

function digest(value) {
  return crypto.createHash('sha256').update(canonicalize(value)).digest('hex');
}

function idempotencyKey(bindings, target) {
  return hashArtifact(DOMAIN_TAGS.RouteProofV1, {
    bindingKind: 'idempotencyKey',
    value: {
      requestFactsHash: bindings.requestFactsHash,
      target,
      effectivePolicyHash: bindings.effectivePolicyHash,
    },
  });
}

function proofBody(target, bindings, issuer, statement) {
  return {
    attestation: { issuer, statementHash: digest(statement) },
    destinationId: target.destinationId,
    epoch: bindings.generation,
    expiresAtEpoch: bindings.generation + 2,
    idempotencyKey: idempotencyKey(bindings, target),
    readSet: [
      { digest: bindings.requestFactsHash, resourceId: 'request-facts.v1' },
      { digest: bindings.effectivePolicyHash, resourceId: 'effective-policy.v1' },
      { digest: bindings.graphHash, resourceId: 'destination-graph.v1' },
      { digest: bindings.intentHash, resourceId: 'pinned-intent.v1' },
    ],
    schemaVersion: 'V1',
  };
}

function routeRule(graph, decision) {
  if (decision.action !== 'route' || decision.route.selectionKind !== 'orderedBundle') return null;
  const keys = decision.route.targets.map((target) => destinationKey(target.destinationId));
  return graph.compositionRules.find((rule) => (
    rule.targetIds.length === keys.length
    && rule.targetIds.every((id, index) => destinationKey(id) === keys[index])
  )) || null;
}

function assertComposeOrder(executor, leg) {
  const predecessors = executor.rule?.composeAfter
    .filter((edge) => destinationKey(edge.dependentId) === destinationKey(leg.target.destinationId))
    .map((edge) => destinationKey(edge.predecessorId)) || [];
  if (predecessors.some((key) => !executor.resolved.has(key))) {
    fail('COMPOSE_AFTER_PREDECESSOR_UNRESOLVED', 'composeAfter predecessor has not resolved');
  }
}

function assertAuthoritySatisfied(executor, leg) {
  const targetKey = destinationKey(leg.target.destinationId);
  const dependencies = executor.snapshot.destinationGraph.authorityGraph.filter((edge) => (
    edge.relation === 'requiresAuthorityFrom'
    && destinationKey(edge.toDestinationId) === targetKey
  ));
  if (dependencies.length === 0) return;
  if (!executor.rule || destinationKey(executor.rule.targetIds[1]) !== targetKey) {
    fail('REQUIRES_AUTHORITY_UNSATISFIED', 'dependent transport is outside its compiled authority bundle');
  }
  const approverKey = destinationKey(executor.rule.requiresAuthorityFrom);
  if (!dependencies.some((edge) => destinationKey(edge.approverDestinationId) === approverKey)) {
    fail('REQUIRES_AUTHORITY_UNSATISFIED', 'compiled authority edge does not license this approver');
  }
  const authority = executor.authority.get(approverKey);
  if (!authority || authority.decision !== 'approve') {
    fail('REQUIRES_AUTHORITY_UNSATISFIED', 'required judgment approval is absent or negative');
  }
  if (authority.requestFactsHash !== executor.bindings.requestFactsHash
    || authority.intentHash !== executor.bindings.intentHash
    || authority.effectivePolicyHash !== executor.bindings.effectivePolicyHash
    || authority.generation !== executor.bindings.generation) {
    fail('AUTHORITY_PIN_MISMATCH', 'judgment approval does not match the pinned intent tuple');
  }
  if (computeProofHash({ ...authority.proof, proofHash: undefined }) !== authority.proof.proofHash) {
    fail('AUTHORITY_PROOF_HASH_INVALID', 'judgment RouteProofV1 hash is invalid');
  }
  if (destinationKey(authority.proof.destinationId) !== approverKey) {
    fail('AUTHORITY_APPROVER_MISMATCH', 'approval proof was not issued by the required judgment');
  }
}

function assertReady(executor, leg, verification) {
  if (!verification || verification.state !== 'READY') {
    fail('COMMIT_WITHOUT_VERIFY', 'COMMIT requires a READY result from VERIFY');
  }
  if (verification.legKey !== destinationKey(leg.target.destinationId)
    || verification.requestFactsHash !== executor.bindings.requestFactsHash) {
    fail('VERIFY_BINDING_MISMATCH', 'READY result does not belong to this leg and request');
  }
}

function assertPreparedProof(executor, leg) {
  if (computeProofHash({ ...leg.proof, proofHash: undefined }) !== leg.proof.proofHash) {
    fail('PROOF_HASH_MISMATCH', 'prepared RouteProofV1 hash is invalid');
  }
  if (leg.proof.epoch !== executor.bindings.generation) {
    fail('PROOF_EPOCH_MISMATCH', 'proof epoch differs from the pinned generation');
  }
  if (leg.proof.expiresAtEpoch < executor.bindings.generation) {
    fail('PROOF_EXPIRED', 'proof expired before VERIFY');
  }
  const reads = new Map(leg.proof.readSet.map((entry) => [entry.resourceId, entry.digest]));
  const expected = [
    ['request-facts.v1', executor.bindings.requestFactsHash],
    ['effective-policy.v1', executor.bindings.effectivePolicyHash],
    ['destination-graph.v1', executor.bindings.graphHash],
    ['pinned-intent.v1', executor.bindings.intentHash],
  ];
  if (expected.some(([resourceId, value]) => reads.get(resourceId) !== value)) {
    fail('PROOF_READ_SET_MISMATCH', 'proof read-set differs from pinned bindings');
  }
}

class CompositionExecutor {
  constructor(snapshot, request, intent) {
    this.snapshot = snapshot;
    this.bindings = {
      effectivePolicyHash: snapshot.policy.effectivePolicyHash,
      generation: snapshot.policy.activationGeneration,
      graphHash: snapshot.destinationGraph.graphHash,
      intentHash: digest(intent),
      requestFactsHash: request.requestFactsHash,
    };
    this.authority = new Map();
    this.resolved = new Set();
    this.effects = new Map();
    this.rule = null;
  }

  prepare(decision) {
    if (decision.action !== 'route') return Object.freeze({ legs: Object.freeze([]), protocolPath: ['PREPARE'] });
    this.rule = routeRule(this.snapshot.destinationGraph, decision);
    if (decision.route.selectionKind === 'orderedBundle' && !this.rule) {
      fail('COMPOSITION_RULE_MISSING', 'ordered bundle is absent from compiled composition data');
    }
    const legs = decision.route.targets.map((routeTarget, sequence) => {
      const body = proofBody(
        routeTarget,
        this.bindings,
        'route-prepare-adapter',
        { bindings: this.bindings, sequence, target: routeTarget.destinationId },
      );
      return Object.freeze({
        proof: Object.freeze({ ...body, proofHash: computeProofHash(body) }),
        sequence,
        target: routeTarget,
      });
    });
    return Object.freeze({ legs: Object.freeze(legs), protocolPath: Object.freeze(['PREPARE']) });
  }

  verifyJudgment(leg, decision) {
    assertPreparedProof(this, leg);
    if (leg.target.role !== 'judgment') fail('JUDGMENT_ROLE_REQUIRED', 'approval must come from judgment');
    if (!['approve', 'deny'].includes(decision)) fail('JUDGMENT_DECISION_INVALID', decision);
    const statement = { decision, ...this.bindings, target: leg.target.destinationId };
    const body = proofBody(
      leg.target,
      this.bindings,
      'destination-judgment-verify',
      statement,
    );
    const approvalProof = Object.freeze({ ...body, proofHash: computeProofHash(body) });
    const key = destinationKey(leg.target.destinationId);
    if (decision === 'approve') {
      this.authority.set(key, Object.freeze({ decision, proof: approvalProof, ...this.bindings }));
      this.resolved.add(key);
      return Object.freeze({
        approvalProof,
        legKey: key,
        protocolPath: Object.freeze(['PREPARE', 'VERIFY']),
        requestFactsHash: this.bindings.requestFactsHash,
        state: 'READY',
      });
    }
    this.authority.delete(key);
    this.resolved.add(key);
    return Object.freeze({
      approvalProof,
      legKey: key,
      protocolPath: Object.freeze(['PREPARE', 'VERIFY']),
      requestFactsHash: this.bindings.requestFactsHash,
      state: 'REJECT',
    });
  }

  verifyDestination(leg) {
    assertPreparedProof(this, leg);
    assertComposeOrder(this, leg);
    assertAuthoritySatisfied(this, leg);
    return Object.freeze({
      authorityConsumedFor: destinationKey(leg.target.destinationId),
      legKey: destinationKey(leg.target.destinationId),
      protocolPath: Object.freeze(['PREPARE', 'VERIFY']),
      requestFactsHash: this.bindings.requestFactsHash,
      state: 'READY',
    });
  }

  verifyReadOnly(leg) {
    assertPreparedProof(this, leg);
    const destination = this.snapshot.destinationGraph.destinations.find((entry) => (
      destinationKey(entry.id) === destinationKey(leg.target.destinationId)
    ));
    if (!destination || !['read-only', 'external-mutation-capable'].includes(destination.effectClass)) {
      fail('READ_ONLY_VERIFICATION_INVALID', 'destination has no declared read-only leg');
    }
    return Object.freeze({
      legKey: destinationKey(leg.target.destinationId),
      protocolPath: Object.freeze(['PREPARE', 'VERIFY']),
      readOnly: true,
      requestFactsHash: this.bindings.requestFactsHash,
      state: 'READY',
    });
  }

  resolveReadOnly(leg, verification) {
    assertReady(this, leg, verification);
    if (verification.readOnly !== true) fail('READ_ONLY_VERIFY_REQUIRED', 'read-only resolution needs read-only VERIFY');
    this.resolved.add(destinationKey(leg.target.destinationId));
    return Object.freeze({ protocolPath: ['PREPARE', 'VERIFY'], state: 'RESOLVED_READ_ONLY' });
  }

  commit(leg, verification) {
    assertReady(this, leg, verification);
    const destination = this.snapshot.destinationGraph.destinations.find((entry) => (
      destinationKey(entry.id) === destinationKey(leg.target.destinationId)
    ));
    if (!destination || destination.effectClass === 'read-only') {
      fail('READ_ONLY_DESTINATION_CANNOT_COMMIT', 'read-only destinations resolve without COMMIT');
    }
    assertComposeOrder(this, leg);
    assertAuthoritySatisfied(this, leg);
    if (verification.authorityConsumedFor !== destinationKey(leg.target.destinationId)) {
      fail('DESTINATION_AUTHORITY_NOT_CONSUMED', 'authority must be consumed at this destination VERIFY');
    }
    const prior = this.effects.get(leg.proof.idempotencyKey);
    if (prior) return Object.freeze({ duplicate: true, protocolPath: ['PREPARE', 'VERIFY', 'COMMIT'], receipt: prior });
    const receipt = Object.freeze({
      destinationId: leg.target.destinationId,
      effectivePolicyHash: this.bindings.effectivePolicyHash,
      idempotencyKey: leg.proof.idempotencyKey,
      intentHash: this.bindings.intentHash,
      outcome: 'simulated-external-effect',
      schemaVersion: 'V1',
    });
    this.effects.set(leg.proof.idempotencyKey, receipt);
    this.resolved.add(destinationKey(leg.target.destinationId));
    return Object.freeze({ duplicate: false, protocolPath: ['PREPARE', 'VERIFY', 'COMMIT'], receipt });
  }
}

function assertReadOnlyStageEligible(gate, rule) {
  const missing = rule.readOnlyBeforeMutating
    .map(destinationKey)
    .filter((key) => gate.readOnly.get(key) !== true);
  if (missing.length > 0) {
    fail('READ_ONLY_LEGS_INCOMPLETE', 'every declared read-only leg must pass before mutation');
  }
}

class DestinationRolloutGate {
  constructor(graph) {
    this.graph = graph;
    this.readOnly = new Map();
    this.enabled = new Set();
  }

  recordReadOnly(destinationId, passed) {
    this.readOnly.set(destinationKey(destinationId), passed === true);
  }

  enableMutating(destinationId) {
    const rule = this.graph.rolloutRules.find((entry) => (
      destinationKey(entry.mutatingDestinationId) === destinationKey(destinationId)
    ));
    if (!rule) fail('MUTATING_ROLLOUT_UNDECLARED', 'mutating destination lacks a rollout rule');
    assertReadOnlyStageEligible(this, rule);
    this.enabled.add(destinationKey(destinationId));
    return Object.freeze({ enabled: true, destinationId });
  }
}

module.exports = {
  CompositionExecutionError,
  CompositionExecutor,
  DestinationRolloutGate,
};
