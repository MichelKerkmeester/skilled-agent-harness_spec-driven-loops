'use strict';

const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const {
  DOMAIN_TAGS,
  canonicalBytes,
  canonicalize,
  hashArtifact,
  effectiveIdentityBody,
  computeBasePolicyHash,
  computeOverlayHash,
  computeEffectivePolicyHash,
  computeRequestFactsHash,
  computeProofHash,
  computeProjectionHash
} = require('../lib/canonical.cjs');

const phaseRoot = path.resolve(__dirname, '..');
const fixtureRoot = path.join(phaseRoot, 'fixtures');
const schemaRoot = path.join(phaseRoot, 'schemas');
const digestPattern = /^[a-f0-9]{64}$/;
const commitAuthorityPattern = /(?:^|[:._-])commit(?:$|[:._-])/i;
const evidenceReferencePattern = /^(?:advisor|authored|runtime|compatibility):\S(?:.*\S)?$/;
const reservedDisplayNamespacePattern = /^\s*(?:authority|capability):/i;
const skillIdentifierPattern = new RegExp(['\\bskill', 'Id\\b'].join(''));

const schemaFiles = Object.freeze({
  CompiledPolicyV1: 'compiled-policy.v1.schema.json',
  CorrectionOverlayV1: 'correction-overlay.v1.schema.json',
  RouteRequestV1: 'route-request.v1.schema.json',
  RouteDecisionV1: 'route-decision.v1.schema.json',
  RouteProofV1: 'route-proof.v1.schema.json',
  UncertaintyBudgetV1: 'uncertainty-budget.v1.schema.json',
  AdvisorProjectionV1: 'advisor-projection.v1.schema.json',
  TypedRouteGoldV1: 'typed-route-gold.v1.schema.json',
  PolicyCardV1: 'policy-card.v1.schema.json'
});

const goldenFixtures = Object.freeze([
  ['compiled-policy.multimode.json', 'CompiledPolicyV1'],
  ['compiled-policy.n1.json', 'CompiledPolicyV1'],
  ['correction-overlay.replay.json', 'CorrectionOverlayV1'],
  ['decisions/exact-single-route.json', 'RouteDecisionV1'],
  ['decisions/ordered-bundle.json', 'RouteDecisionV1'],
  ['decisions/surface-bundle.json', 'RouteDecisionV1'],
  ['decisions/zero-signal-defer.json', 'RouteDecisionV1'],
  ['decisions/one-turn-clarify.json', 'RouteDecisionV1'],
  ['decisions/forbidden-reject.json', 'RouteDecisionV1'],
  ['decisions/degraded-fallback-named-evidence.json', 'RouteDecisionV1'],
  ['route-request.live-explicit-mode.json', 'RouteRequestV1'],
  ['route-request.stale-advisor.json', 'RouteRequestV1'],
  ['route-request.absent-advisor.json', 'RouteRequestV1'],
  ['route-proof.fresh.json', 'RouteProofV1'],
  ['route-proof.stale.json', 'RouteProofV1'],
  ['uncertainty-budget.shared.json', 'UncertaintyBudgetV1'],
  ['advisor-projection.json', 'AdvisorProjectionV1'],
  ['typed-route-gold.singular-duplicate.json', 'TypedRouteGoldV1'],
  ['typed-route-gold.negative.json', 'TypedRouteGoldV1'],
  ['policy-card.frontmatter.json', 'PolicyCardV1']
]);

const adversarialFixtures = Object.freeze([
  ['adversarial/target-inside-defer.json', 'RouteDecisionV1', 'defer.targets is not allowed'],
  ['adversarial/authority-inside-reject.json', 'RouteDecisionV1', 'reject authority must be Withheld'],
  ['adversarial/degraded-without-evidence.json', 'RouteDecisionV1', 'route.basis.unavailableEvidence is required'],
  ['adversarial/evidence-mutation.json', 'CompiledPolicyV1', 'destinations[0] evidence cannot mutate workspace'],
  ['adversarial/bare-path-destination.json', 'CompiledPolicyV1', 'destinations[0].id must be an object'],
  ['adversarial/mode-only-destination.json', 'CompiledPolicyV1', 'destinations[0].id.skillId is required'],
  ['adversarial/route-evidence-mutation.json', 'RouteDecisionV1', 'route.targets[0] evidence cannot mutate workspace'],
  ['adversarial/route-evidence-commit-authority.json', 'RouteDecisionV1', 'route.targets[0] evidence cannot carry commit authority'],
  ['adversarial/single-with-multiple-targets.json', 'RouteDecisionV1', 'single route must have exactly one target'],
  ['adversarial/bundle-with-single-target.json', 'RouteDecisionV1', 'bundle route must have at least two targets'],
  ['adversarial/duplicate-destination-id.json', 'CompiledPolicyV1', 'duplicate canonical destination ID'],
  ['adversarial/dangling-selector-target.json', 'CompiledPolicyV1', 'selectors[0].destinationId must resolve to exactly one declared destination'],
  ['adversarial/dangling-composition-target.json', 'CompiledPolicyV1', 'compositionRules[0].targetIds[1] must resolve to exactly one declared destination'],
  ['adversarial/dangling-authority-target.json', 'CompiledPolicyV1', 'authorityGraph[0].toDestinationId must resolve to exactly one declared destination'],
  ['adversarial/degraded-blank-evidence-reference.json', 'RouteDecisionV1', 'unavailable evidence must not be blank'],
  ['adversarial/degraded-unknown-evidence-reference.json', 'RouteDecisionV1', 'unavailable evidence must reference request evidence by kind:id'],
  ['adversarial/clarify-capability-alternative.json', 'RouteDecisionV1', 'clarify alternative must not use reserved authority/capability namespace']
]);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function fixture(relativePath) {
  return readJson(path.join(fixtureRoot, relativePath));
}

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function exactObject(value, required, optional, label) {
  assert.ok(isObject(value), `${label} must be an object`);
  for (const key of required) {
    assert.ok(Object.prototype.hasOwnProperty.call(value, key), `${label}.${key} is required`);
  }
  const allowed = new Set([...required, ...optional]);
  for (const key of Object.keys(value)) {
    assert.ok(allowed.has(key), `${label}.${key} is not allowed`);
  }
}

function nonEmptyString(value, label) {
  assert.strictEqual(typeof value, 'string', `${label} must be a string`);
  assert.ok(value.trim().length > 0, `${label} must not be blank`);
}

function integer(value, label, minimum = 0, maximum = Number.MAX_SAFE_INTEGER) {
  assert.ok(Number.isSafeInteger(value), `${label} must be a safe integer`);
  assert.ok(value >= minimum && value <= maximum, `${label} is outside its bounds`);
}

function array(value, label) {
  assert.ok(Array.isArray(value), `${label} must be an array`);
}

function digest(value, label) {
  assert.ok(digestPattern.test(value), `${label} must be a lowercase SHA-256 digest`);
}

function member(value, values, label) {
  assert.ok(values.includes(value), `${label} has an invalid value`);
}

function destinationIdentityKey(value) {
  return canonicalize(value);
}

function assertDeclaredDestination(value, destinationsById, label) {
  assert.strictEqual(
    destinationsById.has(destinationIdentityKey(value)),
    true,
    `${label} must resolve to exactly one declared destination`
  );
}

function validateEvidenceReference(value, label) {
  nonEmptyString(value, label);
  assert.ok(
    evidenceReferencePattern.test(value),
    `${label} must reference request evidence by kind:id`
  );
}

function validateDisplayOnlyString(value, label) {
  nonEmptyString(value, label);
  assert.ok(
    !reservedDisplayNamespacePattern.test(value),
    `${label} must not use reserved authority/capability namespace`
  );
}

function listExecutableCjsFiles(root) {
  const files = [];
  const pending = [root];
  while (pending.length > 0) {
    const directory = pending.pop();
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) pending.push(entryPath);
      if (entry.isFile() && entry.name.endsWith('.cjs')) files.push(entryPath);
    }
  }
  return files.sort();
}

function extractParenthesizedConditions(source, keyword) {
  const conditions = [];
  const pattern = new RegExp(`\\b${keyword}\\s*\\(`, 'g');
  for (let match = pattern.exec(source); match; match = pattern.exec(source)) {
    const openingIndex = source.indexOf('(', match.index);
    let depth = 0;
    let quote = null;
    let escaped = false;
    for (let index = openingIndex; index < source.length; index += 1) {
      const character = source[index];
      if (quote !== null) {
        if (escaped) {
          escaped = false;
        } else if (character === '\\') {
          escaped = true;
        } else if (character === quote) {
          quote = null;
        }
        continue;
      }
      if (character === '\'' || character === '"' || character === '`') {
        quote = character;
        continue;
      }
      if (character === '(') depth += 1;
      if (character === ')') {
        depth -= 1;
        if (depth === 0) {
          conditions.push(source.slice(openingIndex + 1, index));
          pattern.lastIndex = index + 1;
          break;
        }
      }
    }
  }
  return conditions;
}

function containsSkillBranchToken(condition, skillNames) {
  if (skillIdentifierPattern.test(condition)) return true;
  return skillNames.some((skillName) => (
    condition.includes(`'${skillName}'`)
    || condition.includes(`"${skillName}"`)
    || condition.includes(`\`${skillName}\``)
  ));
}

function findSkillBranchViolations(source, skillNames) {
  const violations = [];
  for (const keyword of ['if', 'switch']) {
    for (const condition of extractParenthesizedConditions(source, keyword)) {
      if (containsSkillBranchToken(condition, skillNames)) {
        violations.push(`${keyword} condition: ${condition.trim()}`);
      }
    }
  }
  for (const statement of source.split(';')) {
    for (let index = 0; index < statement.length; index += 1) {
      if (statement[index] !== '?') continue;
      if (statement[index - 1] === '?' || statement[index + 1] === '?' || statement[index + 1] === '.') continue;
      const condition = statement.slice(0, index);
      if (containsSkillBranchToken(condition, skillNames)) {
        violations.push(`ternary condition: ${condition.trim()}`);
      }
    }
  }
  return violations;
}

function validateDestinationId(value, label) {
  exactObject(
    value,
    ['skillId', 'workflowMode', 'packetId', 'packetKind', 'backendKind'],
    ['runtimeDiscriminator'],
    label
  );
  for (const key of Object.keys(value)) nonEmptyString(value[key], `${label}.${key}`);
}

function validateDestination(value, label) {
  exactObject(value, ['id', 'role', 'authorityRef', 'mutatesWorkspace'], [], label);
  validateDestinationId(value.id, `${label}.id`);
  member(value.role, ['actor', 'evidence', 'transport', 'judgment'], `${label}.role`);
  nonEmptyString(value.authorityRef, `${label}.authorityRef`);
  assert.strictEqual(typeof value.mutatesWorkspace, 'boolean', `${label}.mutatesWorkspace must be boolean`);
  if (value.role === 'evidence') {
    assert.strictEqual(value.mutatesWorkspace, false, `${label} evidence cannot mutate workspace`);
    assert.ok(!commitAuthorityPattern.test(value.authorityRef), `${label} evidence cannot carry commit authority`);
  }
}

function validateCompiledPolicy(value) {
  exactObject(
    value,
    ['schemaVersion', 'activationGeneration', 'destinations', 'detectors', 'selectors', 'compositionRules', 'authorityGraph', 'thresholdPolicy', 'recoveryPolicy', 'provenancePolicy', 'basePolicyHash', 'effectivePolicyHash'],
    ['overlayHash'],
    'CompiledPolicyV1'
  );
  assert.strictEqual(value.schemaVersion, 'V1');
  integer(value.activationGeneration, 'activationGeneration');
  array(value.destinations, 'destinations');
  assert.ok(value.destinations.length > 0, 'destinations must be non-empty');
  value.destinations.forEach((item, index) => validateDestination(item, `destinations[${index}]`));
  const destinationsById = new Map();
  value.destinations.forEach((item, index) => {
    const key = destinationIdentityKey(item.id);
    assert.ok(
      !destinationsById.has(key),
      `duplicate canonical destination ID at destinations[${index}].id; first declared at destinations[${destinationsById.get(key)}].id`
    );
    destinationsById.set(key, index);
  });
  array(value.detectors, 'detectors');
  value.detectors.forEach((item, index) => {
    exactObject(item, ['id', 'kind'], ['value'], `detectors[${index}]`);
    nonEmptyString(item.id, `detectors[${index}].id`);
    member(item.kind, ['exact', 'alias', 'resource', 'negative'], `detectors[${index}].kind`);
    if (item.value !== undefined) nonEmptyString(item.value, `detectors[${index}].value`);
  });
  array(value.selectors, 'selectors');
  value.selectors.forEach((item, index) => {
    exactObject(item, ['id', 'destinationId', 'detectorIds'], [], `selectors[${index}]`);
    nonEmptyString(item.id, `selectors[${index}].id`);
    validateDestinationId(item.destinationId, `selectors[${index}].destinationId`);
    assertDeclaredDestination(item.destinationId, destinationsById, `selectors[${index}].destinationId`);
    array(item.detectorIds, `selectors[${index}].detectorIds`);
    item.detectorIds.forEach((id) => nonEmptyString(id, 'detector id'));
  });
  array(value.compositionRules, 'compositionRules');
  value.compositionRules.forEach((item, index) => {
    exactObject(item, ['kind', 'targetIds'], [], `compositionRules[${index}]`);
    member(item.kind, ['orderedBundle', 'surfaceBundle'], `compositionRules[${index}].kind`);
    array(item.targetIds, `compositionRules[${index}].targetIds`);
    assert.ok(item.targetIds.length >= 2, 'composition rules require at least two targets');
    item.targetIds.forEach((id, targetIndex) => {
      const label = `compositionRules[${index}].targetIds[${targetIndex}]`;
      validateDestinationId(id, label);
      assertDeclaredDestination(id, destinationsById, label);
    });
  });
  array(value.authorityGraph, 'authorityGraph');
  value.authorityGraph.forEach((item, index) => {
    exactObject(item, ['fromAuthorityRef', 'toDestinationId', 'relation'], [], `authorityGraph[${index}]`);
    nonEmptyString(item.fromAuthorityRef, `authorityGraph[${index}].fromAuthorityRef`);
    validateDestinationId(item.toDestinationId, `authorityGraph[${index}].toDestinationId`);
    assertDeclaredDestination(item.toDestinationId, destinationsById, `authorityGraph[${index}].toDestinationId`);
    member(item.relation, ['approveBeforeCommit', 'evidenceOnly'], `authorityGraph[${index}].relation`);
  });
  exactObject(value.thresholdPolicy, ['kind', 'thresholds'], [], 'thresholdPolicy');
  member(value.thresholdPolicy.kind, ['exact-admission', 'calibrated', 'guarded-default'], 'thresholdPolicy.kind');
  array(value.thresholdPolicy.thresholds, 'thresholdPolicy.thresholds');
  value.thresholdPolicy.thresholds.forEach((item) => assert.ok(/^-?(0|[1-9][0-9]*)(\.[0-9]+)?$/.test(item), 'threshold must be a decimal string'));
  exactObject(value.recoveryPolicy, ['ladder', 'userTurns', 'handoffHops'], [], 'recoveryPolicy');
  array(value.recoveryPolicy.ladder, 'recoveryPolicy.ladder');
  value.recoveryPolicy.ladder.forEach((item) => member(item, ['clarify', 'handoff', 'defer', 'reject'], 'recovery rung'));
  integer(value.recoveryPolicy.userTurns, 'recoveryPolicy.userTurns', 0, 1);
  integer(value.recoveryPolicy.handoffHops, 'recoveryPolicy.handoffHops', 0, 1);
  exactObject(value.provenancePolicy, ['kind', 'sourceHashes'], [], 'provenancePolicy');
  member(value.provenancePolicy.kind, ['static', 'offline-learned'], 'provenancePolicy.kind');
  array(value.provenancePolicy.sourceHashes, 'provenancePolicy.sourceHashes');
  value.provenancePolicy.sourceHashes.forEach((item) => digest(item, 'provenance source hash'));
  digest(value.basePolicyHash, 'basePolicyHash');
  if (value.overlayHash !== undefined) digest(value.overlayHash, 'overlayHash');
  digest(value.effectivePolicyHash, 'effectivePolicyHash');
  assert.strictEqual(computeBasePolicyHash(value), value.basePolicyHash, 'basePolicyHash mismatch');
  assert.strictEqual(computeEffectivePolicyHash(value), value.effectivePolicyHash, 'effectivePolicyHash mismatch');
}

function validateTarget(value, label) {
  exactObject(value, ['destinationId', 'role', 'authorityRef', 'mutatesWorkspace'], [], label);
  validateDestinationId(value.destinationId, `${label}.destinationId`);
  member(value.role, ['actor', 'evidence', 'transport', 'judgment'], `${label}.role`);
  nonEmptyString(value.authorityRef, `${label}.authorityRef`);
  assert.strictEqual(typeof value.mutatesWorkspace, 'boolean', `${label}.mutatesWorkspace must be boolean`);
  if (value.role === 'evidence') {
    assert.strictEqual(value.mutatesWorkspace, false, `${label} evidence cannot mutate workspace`);
    assert.ok(!commitAuthorityPattern.test(value.authorityRef), `${label} evidence cannot carry commit authority`);
  }
}

function validateDecision(value) {
  exactObject(value, ['schemaVersion', 'action', value.action], [], 'RouteDecisionV1');
  assert.strictEqual(value.schemaVersion, 'V1');
  member(value.action, ['route', 'clarify', 'defer', 'reject'], 'action');
  const body = value[value.action];
  if (value.action === 'route') {
    exactObject(body, ['selectionKind', 'targets', 'basis', 'evidence', 'authority'], [], 'route');
    member(body.selectionKind, ['single', 'orderedBundle', 'surfaceBundle'], 'route.selectionKind');
    array(body.targets, 'route.targets');
    assert.ok(body.targets.length > 0, 'route targets must be non-empty');
    if (body.selectionKind === 'single') assert.strictEqual(body.targets.length, 1, 'single route must have exactly one target');
    if (body.selectionKind !== 'single') assert.ok(body.targets.length >= 2, 'bundle route must have at least two targets');
    body.targets.forEach((item, index) => validateTarget(item, `route.targets[${index}]`));
    exactObject(body.basis, ['kind'], body.basis.kind === 'degraded-fallback' ? ['unavailableEvidence'] : [], 'route.basis');
    member(body.basis.kind, ['signal', 'bounded-default', 'degraded-fallback'], 'route.basis.kind');
    if (body.basis.kind === 'degraded-fallback') {
      assert.ok(
        Object.prototype.hasOwnProperty.call(body.basis, 'unavailableEvidence'),
        'route.basis.unavailableEvidence is required'
      );
      array(body.basis.unavailableEvidence, 'route.basis.unavailableEvidence');
      assert.ok(body.basis.unavailableEvidence.length > 0, 'degraded fallback must name unavailable evidence');
      body.basis.unavailableEvidence.forEach((item) => validateEvidenceReference(item, 'unavailable evidence'));
      body.targets.forEach((item) => assert.strictEqual(item.mutatesWorkspace, false, 'degraded fallback must be read-only'));
    }
    array(body.evidence, 'route.evidence');
    body.evidence.forEach((item, index) => {
      exactObject(item, ['kind', 'value', 'nonAuthority'], [], `route.evidence[${index}]`);
      member(item.kind, ['rankScore', 'scoreMargin'], `route.evidence[${index}].kind`);
      assert.ok(/^-?(0|[1-9][0-9]*)(\.[0-9]+)?$/.test(item.value), 'rank evidence must be a decimal string');
      assert.strictEqual(item.nonAuthority, true, 'rank evidence cannot confer authority');
    });
    assert.strictEqual(body.authority, 'WithheldUntilVerify');
    return;
  }
  if (value.action === 'clarify') {
    exactObject(body, ['question', 'budgetRef', 'alternatives', 'authority'], [], 'clarify');
    nonEmptyString(body.question, 'clarify.question');
    nonEmptyString(body.budgetRef, 'clarify.budgetRef');
    array(body.alternatives, 'clarify.alternatives');
    assert.ok(body.alternatives.length >= 2 && body.alternatives.length <= 4);
    body.alternatives.forEach((item) => validateDisplayOnlyString(item, 'clarify alternative'));
    assert.strictEqual(body.authority, 'Withheld');
    return;
  }
  if (value.action === 'defer') {
    exactObject(body, ['reason', 'recovery', 'authority'], [], 'defer');
    member(body.reason, ['idle', 'no-match', 'dependency-failure', 'handoff-required', 'stale-policy', 'evidence-unavailable'], 'defer.reason');
    array(body.recovery, 'defer.recovery');
    body.recovery.forEach((item) => member(item, ['clarify', 'handoff', 'defer', 'reject'], 'defer recovery'));
    assert.strictEqual(body.authority, 'Withheld');
    return;
  }
  exactObject(body, ['reason', 'authority'], [], 'reject');
  member(body.reason, ['invalid', 'forbidden'], 'reject.reason');
  assert.strictEqual(body.authority, 'Withheld', 'reject authority must be Withheld');
}

function validateRequest(value) {
  exactObject(value, ['schemaVersion', 'requestFactsHash', 'observations', 'evidence', 'pinnedActivationGeneration'], ['explicitMode'], 'RouteRequestV1');
  assert.strictEqual(value.schemaVersion, 'V1');
  digest(value.requestFactsHash, 'requestFactsHash');
  if (value.explicitMode !== undefined) nonEmptyString(value.explicitMode, 'explicitMode');
  array(value.observations, 'observations');
  value.observations.forEach((item, index) => {
    exactObject(item, ['kind', 'value'], [], `observations[${index}]`);
    member(item.kind, ['intent', 'resource', 'command', 'constraint'], `observations[${index}].kind`);
    nonEmptyString(item.value, `observations[${index}].value`);
  });
  array(value.evidence, 'evidence');
  value.evidence.forEach((item, index) => {
    exactObject(item, ['id', 'kind', 'value', 'provenance', 'trust'], [], `evidence[${index}]`);
    nonEmptyString(item.id, `evidence[${index}].id`);
    member(item.kind, ['advisor', 'authored', 'runtime', 'compatibility'], `evidence[${index}].kind`);
    assert.strictEqual(typeof item.value, 'string');
    exactObject(item.provenance, ['source', 'capturedAtEpoch'], [], `evidence[${index}].provenance`);
    nonEmptyString(item.provenance.source, `evidence[${index}].provenance.source`);
    integer(item.provenance.capturedAtEpoch, `evidence[${index}].provenance.capturedAtEpoch`);
    member(item.trust, ['live', 'stale', 'absent', 'unavailable'], `evidence[${index}].trust`);
  });
  integer(value.pinnedActivationGeneration, 'pinnedActivationGeneration');
  assert.strictEqual(computeRequestFactsHash(value), value.requestFactsHash, 'requestFactsHash mismatch');
}

function validateOverlay(value) {
  exactObject(value, ['schemaVersion', 'basePolicyHash', 'adjustments', 'promotionProvenance', 'overlayHash'], [], 'CorrectionOverlayV1');
  assert.strictEqual(value.schemaVersion, 'V1');
  digest(value.basePolicyHash, 'basePolicyHash');
  array(value.adjustments, 'adjustments');
  value.adjustments.forEach((item, index) => {
    exactObject(item, ['vocabulary', 'destinationId'], [], `adjustments[${index}]`);
    array(item.vocabulary, `adjustments[${index}].vocabulary`);
    assert.ok(item.vocabulary.length > 0);
    item.vocabulary.forEach((word) => nonEmptyString(word, 'vocabulary item'));
    validateDestinationId(item.destinationId, `adjustments[${index}].destinationId`);
  });
  exactObject(value.promotionProvenance, ['candidateId', 'approvedBy', 'replayHash'], [], 'promotionProvenance');
  nonEmptyString(value.promotionProvenance.candidateId, 'promotionProvenance.candidateId');
  nonEmptyString(value.promotionProvenance.approvedBy, 'promotionProvenance.approvedBy');
  digest(value.promotionProvenance.replayHash, 'promotionProvenance.replayHash');
  digest(value.overlayHash, 'overlayHash');
  assert.strictEqual(computeOverlayHash(value), value.overlayHash, 'overlayHash mismatch');
}

function validateProof(value) {
  exactObject(value, ['schemaVersion', 'destinationId', 'readSet', 'epoch', 'expiresAtEpoch', 'idempotencyKey', 'attestation', 'proofHash'], [], 'RouteProofV1');
  assert.strictEqual(value.schemaVersion, 'V1');
  validateDestinationId(value.destinationId, 'destinationId');
  array(value.readSet, 'readSet');
  value.readSet.forEach((item, index) => {
    exactObject(item, ['resourceId', 'digest'], [], `readSet[${index}]`);
    nonEmptyString(item.resourceId, `readSet[${index}].resourceId`);
    digest(item.digest, `readSet[${index}].digest`);
  });
  integer(value.epoch, 'epoch');
  integer(value.expiresAtEpoch, 'expiresAtEpoch');
  nonEmptyString(value.idempotencyKey, 'idempotencyKey');
  exactObject(value.attestation, ['issuer', 'statementHash'], [], 'attestation');
  nonEmptyString(value.attestation.issuer, 'attestation.issuer');
  digest(value.attestation.statementHash, 'attestation.statementHash');
  digest(value.proofHash, 'proofHash');
  assert.strictEqual(computeProofHash(value), value.proofHash, 'proofHash mismatch');
}

function validateBudget(value) {
  exactObject(value, ['schemaVersion', 'budgetId', 'userTurns', 'handoffHops', 'visited'], [], 'UncertaintyBudgetV1');
  assert.strictEqual(value.schemaVersion, 'V1');
  nonEmptyString(value.budgetId, 'budgetId');
  assert.strictEqual(value.userTurns, 1);
  assert.strictEqual(value.handoffHops, 1);
  array(value.visited, 'visited');
  assert.strictEqual(new Set(value.visited).size, value.visited.length, 'visited set must be unique');
  value.visited.forEach((item) => nonEmptyString(item, 'visited item'));
}

const advisorAllowedKeys = Object.freeze([
  'schemaVersion', 'hubId', 'aliases', 'eligibleModes', 'admissionLabels', 'effectivePolicyHash', 'projectionHash'
]);
const advisorOmitKeys = new Set([
  'path', 'paths', 'tool', 'tools', 'mutationScope', 'fence', 'fences', 'handoffLease', 'handoffLeases', 'commitAuthority'
]);

function assertOmittedRecursively(value, omitted, label) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertOmittedRecursively(item, omitted, `${label}[${index}]`));
    return;
  }
  if (!isObject(value)) return;
  for (const [key, item] of Object.entries(value)) {
    assert.ok(!omitted.has(key), `${label}.${key} is forbidden`);
    assertOmittedRecursively(item, omitted, `${label}.${key}`);
  }
}

function validateAdvisor(value) {
  exactObject(value, advisorAllowedKeys, [], 'AdvisorProjectionV1');
  assert.strictEqual(value.schemaVersion, 'V1');
  nonEmptyString(value.hubId, 'hubId');
  array(value.aliases, 'aliases');
  value.aliases.forEach((item) => nonEmptyString(item, 'alias'));
  array(value.eligibleModes, 'eligibleModes');
  value.eligibleModes.forEach((item, index) => {
    exactObject(item, ['qualifiedId', 'publicMode', 'routingClass'], [], `eligibleModes[${index}]`);
    Object.entries(item).forEach(([key, field]) => nonEmptyString(field, `eligibleModes[${index}].${key}`));
  });
  array(value.admissionLabels, 'admissionLabels');
  value.admissionLabels.forEach((item) => nonEmptyString(item, 'admission label'));
  digest(value.effectivePolicyHash, 'effectivePolicyHash');
  digest(value.projectionHash, 'projectionHash');
  assert.strictEqual(computeProjectionHash('AdvisorProjectionV1', value), value.projectionHash, 'advisor projection hash mismatch');
  assertOmittedRecursively(value, advisorOmitKeys, 'AdvisorProjectionV1');
}

function validateTypedGold(value) {
  exactObject(
    value,
    ['schemaVersion', 'scenarioId', 'effectivePolicyHash', 'decisionAction', 'targetQualifiedIds', 'observedIntents', 'observedResources', 'receiptAttempts', 'assertions', 'projectionHash'],
    ['selectionKind'],
    'TypedRouteGoldV1'
  );
  assert.strictEqual(value.schemaVersion, 'V1');
  nonEmptyString(value.scenarioId, 'scenarioId');
  digest(value.effectivePolicyHash, 'effectivePolicyHash');
  member(value.decisionAction, ['route', 'clarify', 'defer', 'reject'], 'decisionAction');
  array(value.targetQualifiedIds, 'targetQualifiedIds');
  value.targetQualifiedIds.forEach((item) => nonEmptyString(item, 'target qualified ID'));
  array(value.observedIntents, 'observedIntents');
  value.observedIntents.forEach((item) => nonEmptyString(item, 'observed intent'));
  array(value.observedResources, 'observedResources');
  value.observedResources.forEach((item, index) => {
    exactObject(item, ['intent', 'resource'], [], `observedResources[${index}]`);
    nonEmptyString(item.intent, `observedResources[${index}].intent`);
    nonEmptyString(item.resource, `observedResources[${index}].resource`);
  });
  array(value.receiptAttempts, 'receiptAttempts');
  value.receiptAttempts.forEach((item, index) => {
    exactObject(item, ['idempotencyKey', 'receiptId', 'effectApplied'], [], `receiptAttempts[${index}]`);
    nonEmptyString(item.idempotencyKey, `receiptAttempts[${index}].idempotencyKey`);
    nonEmptyString(item.receiptId, `receiptAttempts[${index}].receiptId`);
    assert.strictEqual(typeof item.effectApplied, 'boolean');
  });
  exactObject(value.assertions, ['rankCalls', 'handoffEdges', 'duplicateIdempotencyKeyProducesSingleReceipt'], [], 'assertions');
  integer(value.assertions.rankCalls, 'assertions.rankCalls');
  array(value.assertions.handoffEdges, 'assertions.handoffEdges');
  value.assertions.handoffEdges.forEach((item) => nonEmptyString(item, 'handoff edge'));
  assert.strictEqual(typeof value.assertions.duplicateIdempotencyKeyProducesSingleReceipt, 'boolean');
  if (value.decisionAction === 'route') {
    member(value.selectionKind, ['single', 'orderedBundle', 'surfaceBundle'], 'selectionKind');
    assert.ok(value.targetQualifiedIds.length > 0, 'route gold must name targets');
  } else {
    assert.strictEqual(value.selectionKind, undefined, 'negative gold cannot have selectionKind');
    assert.deepStrictEqual(value.targetQualifiedIds, [], 'negative gold cannot have targets');
    assert.deepStrictEqual(value.observedIntents, [], 'negative compatibility intents must be empty');
    assert.deepStrictEqual(value.observedResources, [], 'negative compatibility resources must be empty');
  }
  digest(value.projectionHash, 'projectionHash');
  assert.strictEqual(computeProjectionHash('TypedRouteGoldV1', value), value.projectionHash, 'typed gold projection hash mismatch');
}

function validatePolicyCard(value) {
  exactObject(
    value,
    ['schemaVersion', 'effectivePolicyHash', 'humanViewHash', 'hubId', 'admission', 'qualifiedRoles', 'bundleGrammar', 'thresholdPolicy', 'recoveryBudget', 'negativeReasons', 'authorityEdges', 'lifecycleChecklist', 'limitations'],
    [],
    'PolicyCardV1'
  );
  assert.strictEqual(value.schemaVersion, 'V1');
  digest(value.effectivePolicyHash, 'effectivePolicyHash');
  digest(value.humanViewHash, 'humanViewHash');
  nonEmptyString(value.hubId, 'hubId');
  for (const key of ['admission', 'qualifiedRoles', 'bundleGrammar', 'negativeReasons', 'authorityEdges', 'lifecycleChecklist', 'limitations']) {
    array(value[key], key);
  }
  for (const key of ['admission', 'qualifiedRoles', 'negativeReasons', 'authorityEdges', 'lifecycleChecklist', 'limitations']) {
    value[key].forEach((item) => nonEmptyString(item, `${key} item`));
  }
  value.bundleGrammar.forEach((item) => member(item, ['single', 'orderedBundle', 'surfaceBundle'], 'bundleGrammar item'));
  nonEmptyString(value.thresholdPolicy, 'thresholdPolicy');
  nonEmptyString(value.recoveryBudget, 'recoveryBudget');
  assert.strictEqual(computeProjectionHash('PolicyCardV1', value, 'humanViewHash'), value.humanViewHash, 'human view hash mismatch');
}

const validators = Object.freeze({
  CompiledPolicyV1: validateCompiledPolicy,
  CorrectionOverlayV1: validateOverlay,
  RouteRequestV1: validateRequest,
  RouteDecisionV1: validateDecision,
  RouteProofV1: validateProof,
  UncertaintyBudgetV1: validateBudget,
  AdvisorProjectionV1: validateAdvisor,
  TypedRouteGoldV1: validateTypedGold,
  PolicyCardV1: validatePolicyCard
});

function compatibilityProjection(typedGold) {
  validateTypedGold(typedGold);
  return {
    observedIntents: typedGold.observedIntents,
    observedResources: typedGold.observedResources
  };
}

const results = [];

function group(name, action) {
  try {
    const detail = action();
    results.push({ name, passed: true });
    process.stdout.write(`PASS ${name}${detail ? ` — ${detail}` : ''}\n`);
  } catch (error) {
    results.push({ name, passed: false });
    process.stdout.write(`FAIL ${name} — ${error.message}\n`);
  }
}

group('schema artifacts', () => {
  for (const [title, filename] of Object.entries(schemaFiles)) {
    const schema = readJson(path.join(schemaRoot, filename));
    assert.strictEqual(schema.$schema, 'https://json-schema.org/draft/2020-12/schema');
    assert.strictEqual(schema.title, title);
    assert.ok(schema.$id);
  }
  const decisionSchema = readJson(path.join(schemaRoot, schemaFiles.RouteDecisionV1));
  assert.strictEqual(decisionSchema.oneOf.length, 4);
  assert.strictEqual(decisionSchema.$defs.target.allOf.length, 1, 'route target evidence conditional is required');
  assert.strictEqual(decisionSchema.$defs.routeDecision.properties.route.allOf.length, 2, 'route cardinality conditionals are required');
  const targetEvidenceProperties = decisionSchema.$defs.target.allOf[0].then.properties;
  assert.strictEqual(targetEvidenceProperties.mutatesWorkspace.const, false, 'route evidence target must be read-only in schema');
  assert.ok(targetEvidenceProperties.authorityRef.pattern.includes('[Cc][Oo][Mm][Mm][Ii][Tt]'), 'route evidence target must reject commit authority in schema');
  const routeCardinalityRules = decisionSchema.$defs.routeDecision.properties.route.allOf;
  assert.strictEqual(routeCardinalityRules[0].then.properties.targets.maxItems, 1, 'single route schema cardinality must be one');
  assert.strictEqual(routeCardinalityRules[1].then.properties.targets.minItems, 2, 'bundle route schema cardinality must be at least two');
  const compiledSchema = readJson(path.join(schemaRoot, schemaFiles.CompiledPolicyV1));
  assert.strictEqual(compiledSchema.$defs.destination.allOf[0].then.properties.mutatesWorkspace.const, false, 'compiled evidence destination must be read-only in schema');
  return `${Object.keys(schemaFiles).length}/9 loaded`;
});

let goldenAccepted = 0;
group('golden fixture validation', () => {
  for (const [relativePath, type] of goldenFixtures) {
    validators[type](fixture(relativePath));
    goldenAccepted += 1;
  }
  return `${goldenAccepted}/${goldenFixtures.length} accepted`;
});

let adversarialRejected = 0;
group('adversarial parse rejection', () => {
  for (const [relativePath, type, expectedRule] of adversarialFixtures) {
    let rejection;
    try {
      validators[type](fixture(relativePath));
    } catch (error) {
      rejection = error;
    }
    assert.ok(rejection, `${relativePath} unexpectedly parsed`);
    assert.ok(
      rejection.message.includes(expectedRule),
      `${relativePath} rejected for the wrong reason: expected "${expectedRule}", received "${rejection.message}"`
    );
    adversarialRejected += 1;
  }
  return `${adversarialRejected}/${adversarialFixtures.length} rejected for expected rule`;
});

group('decision algebra safety', () => {
  const route = fixture('decisions/exact-single-route.json');
  const clarify = fixture('decisions/one-turn-clarify.json');
  const defer = fixture('decisions/zero-signal-defer.json');
  const reject = fixture('decisions/forbidden-reject.json');
  assert.ok(route.route.targets.length > 0);
  assert.ok(!Object.prototype.hasOwnProperty.call(clarify.clarify, 'targets'));
  assert.ok(!Object.prototype.hasOwnProperty.call(defer.defer, 'targets'));
  assert.ok(!Object.prototype.hasOwnProperty.call(reject.reject, 'targets'));
  assert.strictEqual(route.route.authority, 'WithheldUntilVerify');
  assert.deepStrictEqual([clarify.clarify.authority, defer.defer.authority, reject.reject.authority], ['Withheld', 'Withheld', 'Withheld']);
  assert.ok(!canonicalize(defer).includes('default'));
  return 'nested union and no-over-emission invariants hold';
});

group('canonical serialization', () => {
  const vectors = fixture('canonical-vectors.json');
  let externalVectorMatches = 0;
  vectors.forEach((vector, index) => {
    exactObject(vector, ['input', 'expectedCanonicalBytes'], [], `canonicalVectors[${index}]`);
    nonEmptyString(vector.expectedCanonicalBytes, `canonicalVectors[${index}].expectedCanonicalBytes`);
    const actualCanonicalBytes = canonicalize(vector.input);
    assert.strictEqual(actualCanonicalBytes, vector.expectedCanonicalBytes, `canonical vector ${index} byte mismatch`);
    const expectedHash = crypto.createHash('sha256').update(vector.expectedCanonicalBytes, 'utf8').digest('hex');
    const actualHash = crypto.createHash('sha256').update(actualCanonicalBytes, 'utf8').digest('hex');
    assert.strictEqual(actualHash, expectedHash, `canonical vector ${index} SHA-256 mismatch`);
    externalVectorMatches += 1;
  });
  const first = { z: [], a: 7 };
  const second = { a: 7, z: [] };
  assert.strictEqual(canonicalize(first), '{"a":7,"z":[]}');
  assert.deepStrictEqual(canonicalBytes(first), canonicalBytes(second));
  assert.ok(!canonicalBytes(first).subarray(0, 3).equals(Buffer.from([0xef, 0xbb, 0xbf])));
  for (const [relativePath] of goldenFixtures) {
    const value = fixture(relativePath);
    assert.deepStrictEqual(canonicalBytes(value), canonicalBytes(JSON.parse(JSON.stringify(value))));
  }
  assert.throws(() => canonicalize({ invalid: 0.5 }), /finite safe integer/);
  assert.throws(() => canonicalize({ invalid: '\ud800' }), /lone high surrogate/);
  assert.throws(() => canonicalize({ invalid: '\udc00' }), /lone low surrogate/);
  assert.throws(() => canonicalize({ ['\ud800']: 'invalid key' }), /lone high surrogate/);
  const noOverlay = effectiveIdentityBody({ schemaVersion: 'V1', activationGeneration: 1, basePolicyHash: 'a'.repeat(64) });
  const nullOverlay = effectiveIdentityBody({ schemaVersion: 'V1', activationGeneration: 1, basePolicyHash: 'a'.repeat(64), overlayHash: null });
  assert.deepStrictEqual(canonicalBytes(noOverlay), canonicalBytes(nullOverlay));
  assert.deepStrictEqual(
    canonicalBytes({ schemaVersion: 'V1', collections: [], overlayHash: null }),
    canonicalBytes({ schemaVersion: 'V1', collections: [] })
  );
  return `${externalVectorMatches}/${vectors.length} external vectors matched; Unicode and overlay invariants hold`;
});

group('hash identity and reproducibility', () => {
  const multi = fixture('compiled-policy.multimode.json');
  const n1 = fixture('compiled-policy.n1.json');
  const overlay = fixture('correction-overlay.replay.json');
  assert.strictEqual(computeBasePolicyHash(multi), multi.basePolicyHash);
  assert.strictEqual(computeEffectivePolicyHash(multi), multi.effectivePolicyHash);
  assert.strictEqual(computeEffectivePolicyHash(n1), n1.effectivePolicyHash);
  assert.strictEqual(computeOverlayHash(overlay), overlay.overlayHash);
  assert.strictEqual(computeEffectivePolicyHash(n1), computeEffectivePolicyHash(JSON.parse(JSON.stringify(n1))));
  const identity = effectiveIdentityBody(n1);
  const original = hashArtifact(DOMAIN_TAGS.EffectivePolicyV1, identity);
  for (const changed of [
    { ...identity, basePolicyHash: 'b'.repeat(64) },
    { ...identity, overlayHash: 'c'.repeat(64) },
    { ...identity, schemaVersion: 'V2' },
    { ...identity, activationGeneration: identity.activationGeneration + 1 }
  ]) {
    assert.notStrictEqual(hashArtifact(DOMAIN_TAGS.EffectivePolicyV1, changed), original);
  }
  return 'base, overlay, request, proof, projection, and effective hashes reproduced';
});

group('domain separation', () => {
  const tags = Object.values(DOMAIN_TAGS);
  assert.strictEqual(tags.length, 10);
  assert.strictEqual(new Set(tags).size, tags.length);
  tags.forEach((tag) => assert.ok(/^[\x20-\x7e]+$/.test(tag) && !tag.includes('\0')));
  const body = { same: 'bytes' };
  const hashes = tags.map((tag) => hashArtifact(tag, body));
  assert.strictEqual(new Set(hashes).size, hashes.length);
  assert.throws(() => hashArtifact('speckit.router.UnregisteredV1', body), /unregistered/);
  return '10/10 registered tags unique across equal canonical bytes';
});

group('singular degeneracy', () => {
  const n1 = fixture('compiled-policy.n1.json');
  const gold = fixture('typed-route-gold.singular-duplicate.json');
  assert.strictEqual(n1.destinations.length, 1);
  assert.deepStrictEqual(n1.compositionRules, []);
  assert.deepStrictEqual(n1.authorityGraph, []);
  assert.ok(!Object.prototype.hasOwnProperty.call(n1, 'overlayHash'));
  assert.ok(!canonicalize(n1).includes('orderedBundle'));
  assert.ok(!canonicalize(n1).includes('surfaceBundle'));
  assert.ok(!n1.recoveryPolicy.ladder.includes('handoff'));
  assert.strictEqual(n1.recoveryPolicy.handoffHops, 0);
  assert.ok(!canonicalize(n1).includes('rankScore'));
  assert.ok(!canonicalize(n1).includes('scoreMargin'));
  assert.strictEqual(gold.assertions.rankCalls, 0);
  assert.deepStrictEqual(gold.assertions.handoffEdges, []);
  const policySkillNames = [fixture('compiled-policy.n1.json'), fixture('compiled-policy.multimode.json')]
    .flatMap((policy) => policy.destinations.map((destination) => destination.id.skillId));
  const skillNames = [...new Set(policySkillNames)];
  const detectorSelfTests = [
    ['multiline if', ['if', ' (\n  skillId === candidateId\n) { return candidate; }'].join('')],
    ['switch', ['switch', ' (skillId) { case candidateId: break; }'].join('')],
    ['ternary', ['const selected = skillId === ', `'${n1.destinations[0].id.skillId}'`, ' ', String.fromCharCode(63), ' actor : evidence;'].join('')]
  ];
  detectorSelfTests.forEach(([label, source]) => {
    assert.ok(findSkillBranchViolations(source, skillNames).length > 0, `${label} detector self-test was not flagged`);
  });
  const codeFiles = listExecutableCjsFiles(phaseRoot);
  assert.ok(codeFiles.length > 0, 'no executable .cjs files were inventoried');
  codeFiles.forEach((file) => {
    const violations = findSkillBranchViolations(fs.readFileSync(file, 'utf8'), skillNames);
    assert.deepStrictEqual(violations, [], `${file} has a skill-name branch: ${violations.join(' | ')}`);
  });
  return `empty collections and zero rank calls; ${codeFiles.length} executable .cjs inventoried; detector self-tests passed`;
});

group('advisor projection omit-list', () => {
  const advisor = fixture('advisor-projection.json');
  assert.deepStrictEqual(Object.keys(advisor).sort(), [...advisorAllowedKeys].sort());
  assertOmittedRecursively(advisor, advisorOmitKeys, 'AdvisorProjectionV1');
  return 'paths/tools/mutation/fences/leases/commit authority absent';
});

group('compatibility projection', () => {
  const positive = fixture('typed-route-gold.singular-duplicate.json');
  const negative = fixture('typed-route-gold.negative.json');
  assert.deepStrictEqual(compatibilityProjection(positive), {
    observedIntents: ['code-mode'],
    observedResources: [{ intent: 'code-mode', resource: 'canonical-leaf' }]
  });
  assert.deepStrictEqual(compatibilityProjection(negative), { observedIntents: [], observedResources: [] });
  return 'typed positive/negative cases map to observedIntents/observedResources';
});

group('proof overlay and idempotency evidence', () => {
  const fresh = fixture('route-proof.fresh.json');
  const stale = fixture('route-proof.stale.json');
  const overlay = fixture('correction-overlay.replay.json');
  const gold = fixture('typed-route-gold.singular-duplicate.json');
  assert.ok(fresh.expiresAtEpoch > fresh.epoch);
  assert.ok(stale.expiresAtEpoch < fresh.epoch);
  assert.strictEqual(overlay.basePolicyHash, fixture('compiled-policy.multimode.json').basePolicyHash);
  assert.strictEqual(gold.receiptAttempts.length, 2);
  assert.strictEqual(new Set(gold.receiptAttempts.map((item) => item.idempotencyKey)).size, 1);
  assert.strictEqual(new Set(gold.receiptAttempts.map((item) => item.receiptId)).size, 1);
  assert.strictEqual(gold.receiptAttempts.filter((item) => item.effectApplied).length, 1);
  assert.strictEqual(gold.assertions.duplicateIdempotencyKeyProducesSingleReceipt, true);
  return 'stale proof, base-bound overlay replay, and duplicate receipt behavior represented';
});

const passed = results.filter((result) => result.passed).length;
process.stdout.write(`SUMMARY golden=${goldenFixtures.length} accepted=${goldenAccepted}; adversarial=${adversarialFixtures.length} rejected=${adversarialRejected}; groups=${results.length} passed=${passed}\n`);
if (passed !== results.length) process.exitCode = 1;
