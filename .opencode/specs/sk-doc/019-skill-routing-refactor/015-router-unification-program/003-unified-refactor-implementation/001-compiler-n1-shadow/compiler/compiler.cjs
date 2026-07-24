// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ LIBRARY: CONTENT-ADDRESSED ROUTER POLICY COMPILER                        ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const {
  canonicalize,
  computeBasePolicyHash,
  computeEffectivePolicyHash,
} = require('../../000-contract-schemas/lib/canonical.cjs');
const COMPILED_POLICY_SCHEMA = require(
  '../../000-contract-schemas/schemas/compiled-policy.v1.schema.json'
);

const { CompileError } = require('./errors.cjs');
const { compareUtf16 } = require('./order.cjs');
const { validateNode } = require('../harness/json-schema.cjs');

const EMPTY_DIGEST = '0'.repeat(64);
const DESTINATION_ROLES = new Set(['actor', 'evidence', 'transport', 'judgment']);
const COMPOSITION_KINDS = new Set(['orderedBundle', 'surfaceBundle']);
const AUTHORITY_RELATIONS = new Set(['approveBeforeCommit', 'evidenceOnly']);
const AUTHORED_SOURCE_KEYS = new Set([
  'activationGeneration',
  'aliases',
  'authorityGraph',
  'bundleRules',
  'crossTargetEdges',
  'defaultResource',
  'destinations',
  'guardDisposition',
  'handoffEdges',
  'intentSignals',
  'leaves',
  'negativeAdmissions',
  'overlay',
  'referencedModes',
  'resourceContractVersion',
  'schemaVersion',
  'selectionPolicy',
  'skillId',
  'sourceHashes',
]);

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function assertObject(value, element) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new CompileError(
      'INVALID_AUTHORED_SOURCE',
      element,
      `${element} must be an object`,
    );
  }
}

function assertExactKeys(value, allowedKeys, element) {
  assertObject(value, element);
  for (const key of Object.keys(value)) {
    if (!allowedKeys.has(key)) {
      throw new CompileError(
        'INVALID_AUTHORED_SOURCE',
        `${element}.${key}`,
        `${element}.${key} is not a supported authored field`,
      );
    }
  }
}

function assertArray(value, element, minimumItems = 0) {
  if (!Array.isArray(value) || value.length < minimumItems) {
    throw new CompileError(
      'INVALID_AUTHORED_SOURCE',
      element,
      `${element} must be an array with at least ${minimumItems} item(s)`,
    );
  }
  return value;
}

function assertNonEmptyString(value, element) {
  if (typeof value !== 'string' || !/\S/.test(value)) {
    throw new CompileError(
      'INVALID_AUTHORED_SOURCE',
      element,
      `${element} must be a non-empty string`,
    );
  }
  return value;
}

function assertStringArray(value, element, minimumItems = 0) {
  return assertArray(value, element, minimumItems).map((item, index) => (
    assertNonEmptyString(item, `${element}[${index}]`)
  ));
}

function assertDestinationIdentitySource(source, element) {
  assertExactKeys(source, new Set([
    'backendKind',
    'packetId',
    'packetKind',
    'runtimeDiscriminator',
    'skillId',
    'workflowMode',
  ]), element);
  ['backendKind', 'packetId', 'packetKind', 'skillId', 'workflowMode']
    .forEach((key) => assertNonEmptyString(source[key], `${element}.${key}`));
  if (source.runtimeDiscriminator !== undefined) {
    assertNonEmptyString(source.runtimeDiscriminator, `${element}.runtimeDiscriminator`);
  }
}

function assertDestination(source, element) {
  assertExactKeys(source, new Set([
    'authorityRef',
    'backendKind',
    'mutatesWorkspace',
    'packetId',
    'packetKind',
    'role',
    'runtimeDiscriminator',
    'skillId',
    'workflowMode',
  ]), element);
  ['backendKind', 'packetId', 'packetKind', 'skillId', 'workflowMode']
    .forEach((key) => assertNonEmptyString(source[key], `${element}.${key}`));
  if (source.runtimeDiscriminator !== undefined) {
    assertNonEmptyString(source.runtimeDiscriminator, `${element}.runtimeDiscriminator`);
  }
  assertNonEmptyString(source.authorityRef, `${element}.authorityRef`);
  if (!DESTINATION_ROLES.has(source.role)) {
    throw new CompileError(
      'INVALID_AUTHORED_SOURCE',
      `${element}.role`,
      `${element}.role is not an allowed destination role`,
    );
  }
  if (typeof source.mutatesWorkspace !== 'boolean') {
    throw new CompileError(
      'INVALID_AUTHORED_SOURCE',
      `${element}.mutatesWorkspace`,
      `${element}.mutatesWorkspace must be boolean`,
    );
  }
}

function validateAuthoredSources(authoredSources) {
  assertObject(authoredSources, 'authoredSources');
  let normalized;
  try {
    normalized = JSON.parse(canonicalize(authoredSources));
  } catch (error) {
    throw new CompileError(
      'INVALID_AUTHORED_SOURCE',
      'authoredSources',
      'authored sources must contain canonical JSON values',
      error,
    );
  }
  assertExactKeys(normalized, AUTHORED_SOURCE_KEYS, 'authoredSources');
  if (normalized.schemaVersion !== 'V1') {
    throw new CompileError(
      'INVALID_AUTHORED_SOURCE',
      'schemaVersion',
      'only schema version V1 is supported',
    );
  }
  if (!Number.isSafeInteger(normalized.activationGeneration) || normalized.activationGeneration < 0) {
    throw new CompileError(
      'INVALID_AUTHORED_SOURCE',
      'activationGeneration',
      'activation generation must be a non-negative integer',
    );
  }
  assertNonEmptyString(normalized.skillId, 'skillId');
  assertStringArray(normalized.aliases, 'aliases', 1);
  if (normalized.defaultResource !== null) {
    assertNonEmptyString(normalized.defaultResource, 'defaultResource');
  }
  if (
    !Number.isSafeInteger(normalized.resourceContractVersion)
    || normalized.resourceContractVersion < 1
  ) {
    throw new CompileError(
      'INVALID_AUTHORED_SOURCE',
      'resourceContractVersion',
      'resource contract version must be a positive integer',
    );
  }
  assertArray(normalized.destinations, 'destinations', 1)
    .forEach((destination, index) => assertDestination(destination, `destinations[${index}]`));
  assertStringArray(normalized.referencedModes, 'referencedModes');
  assertArray(normalized.leaves, 'leaves').forEach((leaf, index) => {
    assertExactKeys(leaf, new Set(['resource', 'workflowMode']), `leaves[${index}]`);
    assertNonEmptyString(leaf.resource, `leaves[${index}].resource`);
    assertNonEmptyString(leaf.workflowMode, `leaves[${index}].workflowMode`);
  });
  assertArray(normalized.intentSignals, 'intentSignals').forEach((signal, index) => {
    assertExactKeys(
      signal,
      new Set(['id', 'keywords', 'resources', 'weight', 'workflowMode']),
      `intentSignals[${index}]`,
    );
    assertNonEmptyString(signal.id, `intentSignals[${index}].id`);
    if (!Number.isSafeInteger(signal.weight) || signal.weight < 1) {
      throw new CompileError(
        'INVALID_AUTHORED_SOURCE',
        `intentSignals[${index}].weight`,
        'intent signal weight must be a positive integer',
      );
    }
    assertStringArray(signal.keywords, `intentSignals[${index}].keywords`, 1);
    assertStringArray(signal.resources, `intentSignals[${index}].resources`);
    if (signal.workflowMode !== undefined) {
      assertNonEmptyString(signal.workflowMode, `intentSignals[${index}].workflowMode`);
    }
  });
  assertStringArray(normalized.negativeAdmissions, 'negativeAdmissions');
  assertExactKeys(
    normalized.selectionPolicy,
    new Set(['ambiguityDelta', 'maximumIntents']),
    'selectionPolicy',
  );
  if (
    typeof normalized.selectionPolicy.ambiguityDelta !== 'string'
    || !/^(?:0|[1-9][0-9]*)(?:\.[0-9]+)?$/.test(normalized.selectionPolicy.ambiguityDelta)
  ) {
    throw new CompileError(
      'INVALID_AUTHORED_SOURCE',
      'selectionPolicy.ambiguityDelta',
      'ambiguity delta must be a non-negative decimal string',
    );
  }
  if (
    !Number.isSafeInteger(normalized.selectionPolicy.maximumIntents)
    || normalized.selectionPolicy.maximumIntents < 1
  ) {
    throw new CompileError(
      'INVALID_AUTHORED_SOURCE',
      'selectionPolicy.maximumIntents',
      'maximum intents must be a positive integer',
    );
  }
  assertArray(normalized.bundleRules, 'bundleRules').forEach((rule, index) => {
    assertExactKeys(
      rule,
      new Set(['kind', 'targetIds', 'targetWorkflowModes']),
      `bundleRules[${index}]`,
    );
    if (!COMPOSITION_KINDS.has(rule.kind)) {
      throw new CompileError(
        'INVALID_AUTHORED_SOURCE',
        `bundleRules[${index}].kind`,
        'bundle rule kind is not allowed',
      );
    }
    const targets = Array.isArray(rule.targetIds)
      ? rule.targetIds
      : rule.targetWorkflowModes;
    if (Array.isArray(rule.targetIds) === Array.isArray(rule.targetWorkflowModes)) {
      throw new CompileError(
        'INVALID_AUTHORED_SOURCE',
        `bundleRules[${index}]`,
        'bundle rule must declare exactly one target collection',
      );
    }
    assertArray(targets, `bundleRules[${index}].targets`, 2).forEach((target, targetIndex) => {
      const element = `bundleRules[${index}].targets[${targetIndex}]`;
      if (typeof target === 'string') assertNonEmptyString(target, element);
      else assertDestinationIdentitySource(target, element);
    });
  });
  assertArray(normalized.authorityGraph, 'authorityGraph').forEach((edge, index) => {
    assertExactKeys(
      edge,
      new Set(['fromAuthorityRef', 'relation', 'toDestinationId', 'toWorkflowMode']),
      `authorityGraph[${index}]`,
    );
    assertNonEmptyString(edge.fromAuthorityRef, `authorityGraph[${index}].fromAuthorityRef`);
    if (!AUTHORITY_RELATIONS.has(edge.relation)) {
      throw new CompileError(
        'INVALID_AUTHORED_SOURCE',
        `authorityGraph[${index}].relation`,
        'authority relation is not allowed',
      );
    }
    const target = edge.toDestinationId === undefined
      ? edge.toWorkflowMode
      : edge.toDestinationId;
    if ((edge.toDestinationId === undefined) === (edge.toWorkflowMode === undefined)) {
      throw new CompileError(
        'INVALID_AUTHORED_SOURCE',
        `authorityGraph[${index}]`,
        'authority edge must declare exactly one destination target',
      );
    }
    if (typeof target === 'string') {
      assertNonEmptyString(target, `authorityGraph[${index}].target`);
    } else {
      assertDestinationIdentitySource(target, `authorityGraph[${index}].target`);
    }
  });
  if (assertArray(normalized.crossTargetEdges, 'crossTargetEdges').length > 0) {
    throw new CompileError(
      'UNSUPPORTED_AUTHORED_SOURCE',
      'crossTargetEdges',
      'cross-target edges are not supported by this shadow compiler',
    );
  }
  if (assertArray(normalized.handoffEdges, 'handoffEdges').length > 0) {
    throw new CompileError(
      'UNSUPPORTED_AUTHORED_SOURCE',
      'handoffEdges',
      'handoff edges are not supported by this shadow compiler',
    );
  }
  if (normalized.guardDisposition !== 'advisory') {
    throw new CompileError(
      'INVALID_AUTHORED_SOURCE',
      'guardDisposition',
      'guard disposition must remain advisory in shadow compilation',
    );
  }
  assertArray(normalized.sourceHashes, 'sourceHashes', 1).forEach((source, index) => {
    assertExactKeys(source, new Set(['hash', 'sourceId']), `sourceHashes[${index}]`);
    assertNonEmptyString(source.sourceId, `sourceHashes[${index}].sourceId`);
    if (typeof source.hash !== 'string' || !/^[a-f0-9]{64}$/.test(source.hash)) {
      throw new CompileError(
        'INVALID_AUTHORED_SOURCE',
        `sourceHashes[${index}].hash`,
        'source hash must be a lowercase SHA-256 digest',
      );
    }
  });
  if (normalized.overlay !== null) {
    throw new CompileError(
      'UNSUPPORTED_AUTHORED_SOURCE',
      'overlay',
      'correction overlays require the later learning compiler',
    );
  }
  return normalized;
}

function destinationId(source) {
  return {
    backendKind: source.backendKind,
    packetId: source.packetId,
    packetKind: source.packetKind,
    skillId: source.skillId,
    ...(source.runtimeDiscriminator === undefined
      ? {}
      : { runtimeDiscriminator: source.runtimeDiscriminator }),
    workflowMode: source.workflowMode,
  };
}

function destinationKey(id) {
  return canonicalize(id);
}

function qualifiedDestinationId(id) {
  return [
    id.skillId,
    id.workflowMode,
    id.packetId,
    id.packetKind,
    id.backendKind,
    ...(id.runtimeDiscriminator === undefined ? [] : [id.runtimeDiscriminator]),
  ].join('/');
}

function destinationForMode(byMode, workflowMode, element) {
  const destinations = byMode.get(workflowMode) || [];
  if (destinations.length === 0) {
    throw new CompileError(
      'MISSING_REFERENCED_MODE',
      String(workflowMode),
      `${element} references missing mode ${workflowMode}`,
    );
  }
  if (destinations.length > 1) {
    throw new CompileError(
      'AMBIGUOUS_DESTINATION_REFERENCE',
      String(workflowMode),
      `${element} must use a complete destination identity for mode ${workflowMode}`,
    );
  }
  return destinations[0];
}

function buildDestinationIndex(authoredSources) {
  if (!Array.isArray(authoredSources.destinations) || authoredSources.destinations.length === 0) {
    throw new CompileError(
      'INVALID_AUTHORED_SOURCE',
      'destinations',
      'at least one destination is required',
    );
  }
  const destinations = [];
  const byKey = new Map();
  const byMode = new Map();
  for (const source of authoredSources.destinations) {
    const id = destinationId(source);
    const key = destinationKey(id);
    if (byKey.has(key)) {
      throw new CompileError(
        'DUPLICATE_DESTINATION',
        qualifiedDestinationId(id),
        `destination ${qualifiedDestinationId(id)} is declared more than once`,
      );
    }
    const destination = {
      authorityRef: source.authorityRef,
      id,
      mutatesWorkspace: source.mutatesWorkspace,
      role: source.role,
    };
    byKey.set(key, destination);
    const modeDestinations = byMode.get(source.workflowMode) || [];
    modeDestinations.push(destination);
    byMode.set(source.workflowMode, modeDestinations);
    destinations.push(destination);
  }
  destinations.sort((left, right) => compareUtf16(destinationKey(left.id), destinationKey(right.id)));
  return { byKey, byMode, destinations };
}

function validateReferencedModes(authoredSources, byMode) {
  const references = Array.isArray(authoredSources.referencedModes)
    ? authoredSources.referencedModes
    : [];
  for (const workflowMode of references) {
    if (!byMode.has(workflowMode)) {
      throw new CompileError(
        'MISSING_REFERENCED_MODE',
        String(workflowMode),
        `referenced mode ${workflowMode} has no declared destination`,
      );
    }
  }
}

function buildLeafIndex(authoredSources, byMode) {
  if (!Array.isArray(authoredSources.leaves)) {
    throw new CompileError('INVALID_AUTHORED_SOURCE', 'leaves', 'leaves must be an array');
  }
  const leaves = new Map();
  for (const leaf of authoredSources.leaves) {
    assertObject(leaf, 'leaf');
    const resource = String(leaf.resource || '');
    if (!resource) {
      throw new CompileError('INVALID_AUTHORED_SOURCE', 'leaf.resource', 'leaf resource is required');
    }
    let destination;
    try {
      destination = destinationForMode(byMode, leaf.workflowMode, `leaf ${resource}`);
    } catch (error) {
      if (error instanceof CompileError && error.code === 'MISSING_REFERENCED_MODE') {
        throw new CompileError(
          'UNRESOLVED_LEAF',
          resource,
          `leaf ${resource} references missing mode ${leaf.workflowMode}`,
        );
      }
      throw error;
    }
    if (leaves.has(resource)) {
      throw new CompileError(
        'DUPLICATE_LEAF',
        resource,
        `leaf ${resource} is declared more than once`,
      );
    }
    leaves.set(resource, destination);
  }
  return leaves;
}

function buildDetectorsAndSelectors(authoredSources, byMode, leaves) {
  if (!Array.isArray(authoredSources.intentSignals)) {
    throw new CompileError(
      'INVALID_AUTHORED_SOURCE',
      'intentSignals',
      'intent signals must be an array',
    );
  }
  const detectors = [];
  const leafDetectorIds = new Map();
  [...leaves.keys()].sort(compareUtf16).forEach((resource, index) => {
    const id = `detector:leaf:${index}`;
    detectors.push({ id, kind: 'resource', value: resource });
    leafDetectorIds.set(resource, id);
  });

  const negativeAdmissions = Array.isArray(authoredSources.negativeAdmissions)
    ? authoredSources.negativeAdmissions
    : [];
  [...negativeAdmissions].sort(compareUtf16).forEach((value, index) => {
    detectors.push({ id: `detector:negative:${index}`, kind: 'negative', value });
  });

  detectors.push({
    id: 'policy:ambiguity-delta',
    kind: 'exact',
    value: String(authoredSources.selectionPolicy?.ambiguityDelta ?? '1.0'),
  });
  detectors.push({
    id: 'policy:maximum-intents',
    kind: 'exact',
    value: String(authoredSources.selectionPolicy?.maximumIntents ?? 2),
  });

  const selectors = [];
  const signalIds = new Set();
  const signals = [...authoredSources.intentSignals]
    .sort((left, right) => compareUtf16(left.id, right.id));
  for (const signal of signals) {
    if (signalIds.has(signal.id)) {
      throw new CompileError(
        'DUPLICATE_SELECTOR',
        String(signal.id),
        `selector class ${signal.id} is declared more than once`,
      );
    }
    signalIds.add(signal.id);
    const workflowMode = signal.workflowMode || authoredSources.referencedModes[0];
    const destination = destinationForMode(byMode, workflowMode, `selector ${signal.id}`);
    const detectorIds = [];
    [...signal.keywords].sort(compareUtf16).forEach((keyword, keywordIndex) => {
      for (let unit = 0; unit < signal.weight; unit += 1) {
        const id = `detector:signal:${signal.id}:${keywordIndex}:${unit}`;
        detectors.push({ id, kind: 'alias', value: keyword });
        detectorIds.push(id);
      }
    });
    for (const resource of [...signal.resources].sort(compareUtf16)) {
      const detectorId = leafDetectorIds.get(resource);
      if (!detectorId) {
        throw new CompileError(
          'UNRESOLVED_LEAF',
          resource,
          `selector ${signal.id} references undeclared leaf ${resource}`,
        );
      }
      detectorIds.push(detectorId);
    }
    selectors.push({
      destinationId: destination.id,
      detectorIds: [...new Set(detectorIds)].sort(compareUtf16),
      id: `selector:${signal.id}`,
    });
  }
  detectors.sort((left, right) => compareUtf16(left.id, right.id));
  selectors.sort((left, right) => compareUtf16(left.id, right.id));
  return { detectors, selectors };
}

function resolveTarget(target, byMode, element) {
  if (typeof target === 'string') {
    const destination = destinationForMode(byMode, target, element);
    return destination.id;
  }
  assertObject(target, element);
  return destinationId(target);
}

function buildCompositionRules(authoredSources, byMode, byKey) {
  const rules = Array.isArray(authoredSources.bundleRules) ? authoredSources.bundleRules : [];
  return rules.map((rule, index) => {
    assertObject(rule, `bundleRules[${index}]`);
    const rawTargets = Array.isArray(rule.targetIds)
      ? rule.targetIds
      : rule.targetWorkflowModes;
    if (!Array.isArray(rawTargets)) {
      throw new CompileError(
        'INVALID_AUTHORED_SOURCE',
        `bundleRules[${index}].targetIds`,
        'bundle rule targetIds must be an array',
      );
    }
    const targetIds = rawTargets.map((target) => resolveTarget(
      target,
      byMode,
      `bundleRules[${index}]`,
    ));
    for (const targetId of targetIds) {
      if (!byKey.has(destinationKey(targetId))) {
        throw new CompileError(
          'DANGLING_DESTINATION_REFERENCE',
          qualifiedDestinationId(targetId),
          `bundle rule ${index} references an undeclared destination`,
        );
      }
    }
    return { kind: rule.kind, targetIds };
  });
}

function validateCardinality(destinations, compositionRules) {
  if (destinations.length === 1 && compositionRules.length > 0) {
    throw new CompileError(
      'N1_BUNDLE_FORBIDDEN',
      'bundleRules',
      'one candidate cannot compile an ordered or surface bundle',
    );
  }
}

function buildAuthorityGraph(authoredSources, byMode, byKey) {
  const edges = Array.isArray(authoredSources.authorityGraph)
    ? authoredSources.authorityGraph
    : [];
  const relationByPair = new Map();
  return edges.map((edge, index) => {
    assertObject(edge, `authorityGraph[${index}]`);
    const toDestinationId = resolveTarget(
      edge.toDestinationId || edge.toWorkflowMode,
      byMode,
      `authorityGraph[${index}]`,
    );
    if (!byKey.has(destinationKey(toDestinationId))) {
      throw new CompileError(
        'DANGLING_DESTINATION_REFERENCE',
        qualifiedDestinationId(toDestinationId),
        `authority edge ${index} references an undeclared destination`,
      );
    }
    const pair = `${edge.fromAuthorityRef}\0${destinationKey(toDestinationId)}`;
    const priorRelation = relationByPair.get(pair);
    if (priorRelation && priorRelation !== edge.relation) {
      throw new CompileError(
        'AUTHORITY_GRAPH_CONTRADICTION',
        `${edge.fromAuthorityRef}->${qualifiedDestinationId(toDestinationId)}`,
        `authority edge declares both ${priorRelation} and ${edge.relation}`,
      );
    }
    if (priorRelation) {
      throw new CompileError(
        'DUPLICATE_AUTHORITY_EDGE',
        `${edge.fromAuthorityRef}->${qualifiedDestinationId(toDestinationId)}`,
        'authority edge is declared more than once',
      );
    }
    relationByPair.set(pair, edge.relation);
    return {
      fromAuthorityRef: edge.fromAuthorityRef,
      relation: edge.relation,
      toDestinationId,
    };
  });
}

function validateReferenceClosure(policy) {
  const destinationCounts = new Map();
  for (const destination of policy.destinations) {
    const key = destinationKey(destination.id);
    destinationCounts.set(key, (destinationCounts.get(key) || 0) + 1);
  }
  const assertExactlyOne = (id, element) => {
    const count = destinationCounts.get(destinationKey(id)) || 0;
    if (count !== 1) {
      throw new CompileError(
        'DANGLING_DESTINATION_REFERENCE',
        element,
        `${element} resolves to ${count} destinations instead of exactly one`,
      );
    }
  };
  for (const selector of policy.selectors) {
    assertExactlyOne(selector.destinationId, selector.id);
  }
  policy.compositionRules.forEach((rule, index) => {
    rule.targetIds.forEach((id) => assertExactlyOne(id, `compositionRules[${index}]`));
  });
  policy.authorityGraph.forEach((edge, index) => {
    assertExactlyOne(edge.toDestinationId, `authorityGraph[${index}]`);
  });
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  Object.values(value).forEach(deepFreeze);
  return value;
}

function assertCompiledPolicySchema(policy) {
  const errors = validateNode(COMPILED_POLICY_SCHEMA, policy, COMPILED_POLICY_SCHEMA, '$');
  if (errors.length > 0) {
    throw new CompileError(
      'INVALID_COMPILED_POLICY',
      'policy',
      `compiled policy schema errors: ${errors.join('; ')}`,
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. COMPILER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compile normalized authored sources into one immutable V1 policy snapshot.
 *
 * @param {Object} authoredSources - Complete normalized source model.
 * @returns {Object} Frozen CompiledPolicyV1 snapshot.
 * @throws {CompileError} For every invalid or unresolved authored input.
 */
function compile(authoredSources) {
  try {
    const normalizedSources = validateAuthoredSources(authoredSources);
    const { byKey, byMode, destinations } = buildDestinationIndex(normalizedSources);
    validateReferencedModes(normalizedSources, byMode);
    const leaves = buildLeafIndex(normalizedSources, byMode);
    const { detectors, selectors } = buildDetectorsAndSelectors(
      normalizedSources,
      byMode,
      leaves,
    );
    const compositionRules = buildCompositionRules(normalizedSources, byMode, byKey);
    validateCardinality(destinations, compositionRules);
    const authorityGraph = buildAuthorityGraph(normalizedSources, byMode, byKey);
    const policy = {
      activationGeneration: normalizedSources.activationGeneration,
      authorityGraph,
      compositionRules,
      destinations,
      detectors,
      provenancePolicy: {
        kind: normalizedSources.overlay === null ? 'static' : 'offline-learned',
        sourceHashes: [...normalizedSources.sourceHashes]
          .sort((left, right) => compareUtf16(left.sourceId, right.sourceId))
          .map((source) => source.hash),
      },
      recoveryPolicy: {
        handoffHops: normalizedSources.handoffEdges.length > 0 ? 1 : 0,
        ladder: normalizedSources.handoffEdges.length > 0
          ? ['clarify', 'handoff', 'defer', 'reject']
          : ['clarify', 'defer', 'reject'],
        userTurns: 1,
      },
      schemaVersion: 'V1',
      selectors,
      thresholdPolicy: {
        kind: 'exact-admission',
        thresholds: [],
      },
    };
    validateReferenceClosure(policy);
    const schemaCandidate = {
      ...policy,
      basePolicyHash: EMPTY_DIGEST,
      effectivePolicyHash: EMPTY_DIGEST,
    };
    assertCompiledPolicySchema(schemaCandidate);
    const completePolicy = {
      ...policy,
      basePolicyHash: computeBasePolicyHash(policy),
    };
    completePolicy.effectivePolicyHash = computeEffectivePolicyHash(completePolicy);
    assertCompiledPolicySchema(completePolicy);
    return deepFreeze(completePolicy);
  } catch (error) {
    if (error instanceof CompileError) throw error;
    throw new CompileError(
      'INVALID_AUTHORED_SOURCE',
      'authoredSources',
      `authored source compilation failed: ${error.message}`,
      error,
    );
  }
}

/**
 * Derive cardinality facts without changing the frozen policy schema.
 *
 * @param {Object} policy - CompiledPolicyV1 snapshot.
 * @param {Object} authoredSources - Source model used for compilation.
 * @returns {Object} Structural degeneracy view.
 */
function deriveDegeneracy(policy, authoredSources) {
  validateCardinality(policy.destinations, policy.compositionRules);
  const selectionKinds = new Set(['single']);
  policy.compositionRules.forEach((rule) => selectionKinds.add(rule.kind));
  return {
    P: policy.provenancePolicy.kind,
    R: [...policy.recoveryPolicy.ladder],
    T: policy.thresholdPolicy.kind,
    bundleRules: [...authoredSources.bundleRules],
    candidateCount: policy.destinations.length,
    crossTargetEdges: [...authoredSources.crossTargetEdges],
    handoffEdges: [...authoredSources.handoffEdges],
    overlay: authoredSources.overlay,
    selectionKinds: [...selectionKinds].sort(compareUtf16),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  compile,
  deriveDegeneracy,
  destinationKey,
  qualifiedDestinationId,
  validateAuthoredSources,
  validateReferenceClosure,
};
