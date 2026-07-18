// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Foundations Corpus Relationship Blueprint                              ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { isDeepStrictEqual } from 'node:util';

import {
  AUTHORITY_ORDER,
  COMMON_PROOF_HANDOFF_FIELDS,
} from '../../shared/corpus-context/corpus-context-plan.mjs';
import {
  validateCorpusContextPlan,
  validateProofHandoffRecord,
} from '../../shared/corpus-context/validate-context-plan.mjs';
import { runHydrate, runQuery } from '../../styles/_engine/style-library.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

export const FOUNDATIONS_RELATIONSHIP_BLUEPRINT_VERSION =
  'FOUNDATIONS_RELATIONSHIP_BLUEPRINT v1';
export const FOUNDATIONS_AXIS_COMPATIBILITY_VERSION =
  'FOUNDATIONS_AXIS_COMPATIBILITY v1';
export const FOUNDATIONS_TRANSFORMATION_LEDGER_VERSION =
  'FOUNDATIONS_TRANSFORMATION_LEDGER v1';

const REQUEST_KEYS = Object.freeze([
  'contextPlan',
  'retrievalRequest',
  'selection',
  'blueprint',
  'compatibilityGraph',
  'transformationLedger',
  'downstreamChecks',
  'authorityInputs',
]);
const RETRIEVAL_REQUEST_KEYS = Object.freeze([
  'text',
  'requiredFacets',
  'excludedFacets',
  'useFts',
]);
const SELECTION_KEYS = Object.freeze(['mode', 'coherentAnchorId', 'axisOwnerIds']);
const BLUEPRINT_KEYS = Object.freeze([
  'schemaVersion',
  'systemRole',
  'roleTopology',
  'groupingPolicy',
  'identityLocks',
  'doNotConstraints',
  'adaptationPolicy',
]);
const GRAPH_KEYS = Object.freeze(['schemaVersion', 'nodes', 'edges']);
const NODE_KEYS = Object.freeze(['nodeId', 'axis', 'ownerRole', 'sourceId']);
const EDGE_KEYS = Object.freeze(['edgeId', 'fromNodeId', 'toNodeId', 'relation', 'basis']);
const LEDGER_KEYS = Object.freeze(['schemaVersion', 'records']);
const LEDGER_RECORD_KEYS = Object.freeze([
  'sourceId',
  'relationshipEdgeId',
  'transformation',
  'lock',
  'authorityLockId',
]);
const DOWNSTREAM_CHECK_KEYS = Object.freeze([
  'accessibility',
  'contrast',
  'gamut',
  'rhythm',
  'responsive',
  'extractionTruth',
]);
const AUTHORITY_INPUT_KEYS = Object.freeze([
  'brief',
  'ownedSystem',
  'targetRoles',
  'targetValues',
  'accessibilityChecks',
  'extractionTruth',
]);
const AUTHORITY_LOCK_KEYS = Object.freeze(['authority', 'lockId', 'contentHash', 'state']);
const AUTHORITY_NAMES = Object.freeze([
  'brief',
  'owned-system',
  'target-roles',
  'target-values',
  'accessibility-checks',
  'extraction-truth',
]);
const AUTHORITY_KEY_TO_NAME = Object.freeze({
  brief: 'brief',
  ownedSystem: 'owned-system',
  targetRoles: 'target-roles',
  targetValues: 'target-values',
  accessibilityChecks: 'accessibility-checks',
  extractionTruth: 'extraction-truth',
});
const SELECTION_MODES = Object.freeze(['coherent-anchor', 'bounded-synthesis', 'none']);
const SYSTEM_ROLES = Object.freeze([
  'brand-surface',
  'product-ui',
  'marketing-surface',
  'data-ui',
  'multi-platform',
]);
const ROLE_TOPOLOGIES = Object.freeze([
  'surface-layering',
  'text-hierarchy',
  'spacing-rhythm',
  'responsive-grouping',
  'data-encoding',
]);
const GROUPING_POLICIES = Object.freeze([
  'proximity-first',
  'hierarchy-first',
  'content-driven',
]);
const IDENTITY_LOCKS = Object.freeze([
  'coherent-anchor',
  'brief-pins',
  'owned-system-roles',
]);
const DO_NOT_CONSTRAINTS = Object.freeze([
  'no-source-literals',
  'no-token-averaging',
  'no-co-presence-compatibility',
  'no-exact-reuse',
]);
const ADAPTATION_POLICIES = Object.freeze([
  'preserve-relationships',
  'recalculate-for-target',
  'target-derived',
]);
const AXES = Object.freeze([
  'color-role',
  'typography-role',
  'spacing-rhythm',
  'layout-hierarchy',
  'density',
  'responsive-adaptation',
]);
const OWNER_ROLES = Object.freeze(['coherent-anchor', 'axis-owner']);
export const COMPATIBILITY_RELATIONS = Object.freeze([
  'works-with',
  'conflicts-with',
  'not-assessed',
]);
const RELATION_BASIS_UNIONS = Object.freeze({
  'works-with': Object.freeze([
    'coherent-anchor-relationship',
    'cross-axis-dependency',
  ]),
  'conflicts-with': Object.freeze([
    'cross-axis-dependency',
    'target-pin-conflict',
  ]),
  'not-assessed': Object.freeze(['unresolved-target-check']),
});
const TRANSFORMATION_LOCK_UNIONS = Object.freeze({
  'preserve-relationship': Object.freeze([
    'brief-pin',
    'owned-system-role',
    'target-role',
    'source-literal-excluded',
  ]),
  'recalculate-for-target': Object.freeze([
    'brief-pin',
    'owned-system-role',
    'target-role',
    'source-literal-excluded',
  ]),
  reject: Object.freeze([
    'brief-pin',
    'owned-system-role',
    'target-role',
    'source-literal-excluded',
  ]),
});
const TRANSFORMATION_LOCK_AUTHORITIES = Object.freeze({
  'brief-pin': 'brief',
  'owned-system-role': 'ownedSystem',
  'target-role': 'targetRoles',
  'source-literal-excluded': 'extractionTruth',
});
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const HASH_PATTERN = /^sha256:[a-f0-9]{64}$/;
const MAX_AXIS_OWNERS = 3;
const MAX_QUERY_CARDS = 5;
const HYDRATION_BYTES = 8 * 1_024;
const RETRIEVAL_UNAVAILABLE_CODES = Object.freeze(new Set([
  'manifest-missing',
  'manifest-stale',
  'ENOENT',
]));
const HYDRATION_UNAVAILABLE_CODES = Object.freeze(new Set([
  'manifest-missing',
  'manifest-invalid',
  'manifest-stale',
  'generation-mismatch',
  'unavailable',
]));

// ─────────────────────────────────────────────────────────────────────────────
// 3. VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

function isPlainObject(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function validateExactKeys(errors, value, path, keys) {
  if (!isPlainObject(value)) {
    errors.push(`${path}:required-object`);
    return false;
  }
  for (const key of keys) {
    if (!Object.hasOwn(value, key)) errors.push(`${path}.${key}:required`);
  }
  for (const key of Reflect.ownKeys(value)) {
    if (!keys.includes(key)) errors.push(`${path}.${String(key)}:unexpected`);
  }
  return true;
}

function validateEnum(errors, value, path, values) {
  if (!values.includes(value)) errors.push(`${path}:invalid`);
}

function validateRetrievalRequest(errors, request) {
  if (!isPlainObject(request)) {
    errors.push('retrievalRequest:required-object');
    return;
  }
  for (const key of Reflect.ownKeys(request)) {
    if (!RETRIEVAL_REQUEST_KEYS.includes(key)) {
      errors.push(`retrievalRequest.${String(key)}:unexpected`);
    }
  }
  if (request.text !== undefined && typeof request.text !== 'string') {
    errors.push('retrievalRequest.text:invalid');
  }
  for (const key of ['requiredFacets', 'excludedFacets']) {
    if (
      request[key] !== undefined
      && (!Array.isArray(request[key]) || request[key].some((item) => typeof item !== 'string'))
    ) {
      errors.push(`retrievalRequest.${key}:invalid`);
    }
  }
  if (request.useFts !== undefined && typeof request.useFts !== 'boolean') {
    errors.push('retrievalRequest.useFts:invalid');
  }
}

function validateUuid(errors, value, path, nullable = false) {
  if (nullable && value === null) return;
  if (typeof value !== 'string' || !UUID_PATTERN.test(value)) errors.push(`${path}:invalid-id`);
}

function validateHash(errors, value, path) {
  if (typeof value !== 'string' || !HASH_PATTERN.test(value)) errors.push(`${path}:invalid-hash`);
}

function validateUniqueEnumList(errors, value, path, values, { min = 0, max = Infinity } = {}) {
  if (!Array.isArray(value) || value.length < min || value.length > max) {
    errors.push(`${path}:invalid-length`);
    return;
  }
  if (new Set(value).size !== value.length) errors.push(`${path}:duplicate-item`);
  for (const item of value) validateEnum(errors, item, path, values);
}

function validateSelection(errors, selection) {
  if (!validateExactKeys(errors, selection, 'selection', SELECTION_KEYS)) return;
  validateEnum(errors, selection.mode, 'selection.mode', SELECTION_MODES);
  validateUuid(errors, selection.coherentAnchorId, 'selection.coherentAnchorId', true);
  if (!Array.isArray(selection.axisOwnerIds)) {
    errors.push('selection.axisOwnerIds:required-array');
    return;
  }
  if (selection.axisOwnerIds.length > MAX_AXIS_OWNERS) {
    errors.push('selection.axisOwnerIds:maximum-three');
  }
  for (const [index, sourceId] of selection.axisOwnerIds.entries()) {
    validateUuid(errors, sourceId, `selection.axisOwnerIds.${index}`);
  }
  if (new Set(selection.axisOwnerIds).size !== selection.axisOwnerIds.length) {
    errors.push('selection.axisOwnerIds:duplicate-item');
  }
  if (selection.axisOwnerIds.includes(selection.coherentAnchorId)) {
    errors.push('selection.axisOwnerIds:anchor-cannot-be-axis-owner');
  }
  if (selection.mode === 'none') {
    if (selection.coherentAnchorId !== null || selection.axisOwnerIds.length > 0) {
      errors.push('selection:none-requires-no-sources');
    }
  } else if (selection.coherentAnchorId === null) {
    errors.push('selection.coherentAnchorId:required-for-source-mode');
  }
  if (selection.mode === 'coherent-anchor' && selection.axisOwnerIds.length > 0) {
    errors.push('selection.axisOwnerIds:coherent-anchor-must-stand-alone');
  }
}

function validateBlueprint(errors, blueprint) {
  if (!validateExactKeys(errors, blueprint, 'blueprint', BLUEPRINT_KEYS)) return;
  if (blueprint.schemaVersion !== FOUNDATIONS_RELATIONSHIP_BLUEPRINT_VERSION) {
    errors.push('blueprint.schemaVersion:invalid');
  }
  validateEnum(errors, blueprint.systemRole, 'blueprint.systemRole', SYSTEM_ROLES);
  validateUniqueEnumList(errors, blueprint.roleTopology, 'blueprint.roleTopology', ROLE_TOPOLOGIES, {
    min: 1,
  });
  validateEnum(errors, blueprint.groupingPolicy, 'blueprint.groupingPolicy', GROUPING_POLICIES);
  validateUniqueEnumList(errors, blueprint.identityLocks, 'blueprint.identityLocks', IDENTITY_LOCKS, {
    min: 1,
  });
  validateUniqueEnumList(
    errors,
    blueprint.doNotConstraints,
    'blueprint.doNotConstraints',
    DO_NOT_CONSTRAINTS,
    { min: DO_NOT_CONSTRAINTS.length, max: DO_NOT_CONSTRAINTS.length },
  );
  if (!isDeepStrictEqual(blueprint.doNotConstraints, DO_NOT_CONSTRAINTS)) {
    errors.push('blueprint.doNotConstraints:fixed-set-required');
  }
  validateEnum(
    errors,
    blueprint.adaptationPolicy,
    'blueprint.adaptationPolicy',
    ADAPTATION_POLICIES,
  );
}

function validateCompatibilityGraph(errors, graph, selection) {
  if (!validateExactKeys(errors, graph, 'compatibilityGraph', GRAPH_KEYS)) return;
  if (graph.schemaVersion !== FOUNDATIONS_AXIS_COMPATIBILITY_VERSION) {
    errors.push('compatibilityGraph.schemaVersion:invalid');
  }
  if (!Array.isArray(graph.nodes)) {
    errors.push('compatibilityGraph.nodes:required-array');
    return;
  }
  if (!Array.isArray(graph.edges)) {
    errors.push('compatibilityGraph.edges:required-array');
    return;
  }
  if (selection?.mode === 'none') {
    if (graph.nodes.length > 0) errors.push('compatibilityGraph.nodes:none-requires-empty');
    if (graph.edges.length > 0) errors.push('compatibilityGraph.edges:none-requires-empty');
    return;
  }
  if (graph.nodes.length === 0) {
    errors.push('compatibilityGraph.nodes:non-empty-array-required');
    return;
  }
  const selectedSources = new Set([
    selection?.coherentAnchorId,
    ...(selection?.axisOwnerIds ?? []),
  ].filter(Boolean));
  const nodeIds = new Set();
  const nodesById = new Map();
  for (const [index, node] of graph.nodes.entries()) {
    const path = `compatibilityGraph.nodes.${index}`;
    if (!validateExactKeys(errors, node, path, NODE_KEYS)) continue;
    validateUuid(errors, node.nodeId, `${path}.nodeId`);
    validateEnum(errors, node.axis, `${path}.axis`, AXES);
    validateEnum(errors, node.ownerRole, `${path}.ownerRole`, OWNER_ROLES);
    validateUuid(errors, node.sourceId, `${path}.sourceId`, true);
    if (nodeIds.has(node.nodeId)) errors.push(`${path}.nodeId:duplicate`);
    nodeIds.add(node.nodeId);
    nodesById.set(node.nodeId, node);
    if (!selectedSources.has(node.sourceId)) {
      errors.push(`${path}.sourceId:not-selected`);
    }
    if (node.ownerRole === 'coherent-anchor' && node.sourceId !== selection?.coherentAnchorId) {
      errors.push(`${path}.sourceId:anchor-mismatch`);
    }
    if (node.ownerRole === 'axis-owner' && !selection?.axisOwnerIds?.includes(node.sourceId)) {
      errors.push(`${path}.sourceId:axis-owner-mismatch`);
    }
  }
  if (graph.edges.length === 0) {
    errors.push('compatibilityGraph.edges:non-empty-array-required');
    return;
  }
  const edgeIds = new Set();
  for (const [index, edge] of graph.edges.entries()) {
    const path = `compatibilityGraph.edges.${index}`;
    if (!validateExactKeys(errors, edge, path, EDGE_KEYS)) continue;
    validateUuid(errors, edge.edgeId, `${path}.edgeId`);
    validateUuid(errors, edge.fromNodeId, `${path}.fromNodeId`);
    validateUuid(errors, edge.toNodeId, `${path}.toNodeId`);
    validateEnum(errors, edge.relation, `${path}.relation`, COMPATIBILITY_RELATIONS);
    const allowedBases = RELATION_BASIS_UNIONS[edge.relation] ?? [];
    if (!allowedBases.includes(edge.basis)) {
      errors.push(`${path}.relation-basis:invalid-union`);
    }
    if (edgeIds.has(edge.edgeId)) errors.push(`${path}.edgeId:duplicate`);
    edgeIds.add(edge.edgeId);
    const fromNode = nodesById.get(edge.fromNodeId);
    const toNode = nodesById.get(edge.toNodeId);
    if (!fromNode || !toNode) errors.push(`${path}:unknown-node`);
    if (edge.fromNodeId === edge.toNodeId) errors.push(`${path}:self-edge-forbidden`);
    if (fromNode && toNode && fromNode.axis === toNode.axis) {
      errors.push(`${path}:cross-axis-required`);
    }
  }
}

function validateTransformationLedger(errors, ledger, graph, selection, authorityInputs) {
  if (!validateExactKeys(errors, ledger, 'transformationLedger', LEDGER_KEYS)) return;
  if (ledger.schemaVersion !== FOUNDATIONS_TRANSFORMATION_LEDGER_VERSION) {
    errors.push('transformationLedger.schemaVersion:invalid');
  }
  if (!Array.isArray(ledger.records)) {
    errors.push('transformationLedger.records:required-array');
    return;
  }
  if (selection?.mode === 'none') {
    if (ledger.records.length > 0) {
      errors.push('transformationLedger.records:none-requires-empty');
    }
    return;
  }
  if (ledger.records.length === 0) {
    errors.push('transformationLedger.records:non-empty-array-required');
    return;
  }
  const edgesById = new Map(graph?.edges?.map((edge) => [edge.edgeId, edge]));
  const edgeIds = new Set(edgesById.keys());
  const nodesById = new Map(graph?.nodes?.map((node) => [node.nodeId, node]));
  const selectedSources = new Set([
    selection?.coherentAnchorId,
    ...(selection?.axisOwnerIds ?? []),
  ].filter(Boolean));
  const recordedEdges = new Set();
  for (const [index, record] of ledger.records.entries()) {
    const path = `transformationLedger.records.${index}`;
    if (!validateExactKeys(errors, record, path, LEDGER_RECORD_KEYS)) continue;
    validateUuid(errors, record.sourceId, `${path}.sourceId`);
    validateUuid(errors, record.relationshipEdgeId, `${path}.relationshipEdgeId`);
    validateUuid(errors, record.authorityLockId, `${path}.authorityLockId`);
    const allowedLocks = TRANSFORMATION_LOCK_UNIONS[record.transformation] ?? [];
    if (!Object.hasOwn(TRANSFORMATION_LOCK_UNIONS, record.transformation)) {
      errors.push(`${path}.transformation:invalid`);
    }
    if (!allowedLocks.includes(record.lock)) {
      errors.push(`${path}.transformation-lock:invalid-union`);
    }
    if (!selectedSources.has(record.sourceId)) errors.push(`${path}.sourceId:not-selected`);
    const edge = edgesById.get(record.relationshipEdgeId);
    if (!edge) {
      errors.push(`${path}.relationshipEdgeId:unknown-edge`);
    } else {
      const endpointSources = [
        nodesById.get(edge.fromNodeId)?.sourceId,
        nodesById.get(edge.toNodeId)?.sourceId,
      ].filter(Boolean);
      if (!endpointSources.includes(record.sourceId)) {
        errors.push(`${path}.sourceId:not-edge-endpoint`);
      }
    }
    const authorityKey = TRANSFORMATION_LOCK_AUTHORITIES[record.lock];
    if (
      authorityKey
      && record.authorityLockId !== authorityInputs?.[authorityKey]?.lockId
    ) {
      errors.push(`${path}.authorityLockId:lock-authority-mismatch`);
    }
    if (recordedEdges.has(record.relationshipEdgeId)) {
      errors.push(`${path}.relationshipEdgeId:duplicate`);
    }
    recordedEdges.add(record.relationshipEdgeId);
  }
  for (const edgeId of edgeIds) {
    if (!recordedEdges.has(edgeId)) {
      errors.push(`transformationLedger.records:missing-edge:${edgeId}`);
    }
  }
}

function validateDownstreamChecks(errors, checks) {
  if (!validateExactKeys(errors, checks, 'downstreamChecks', DOWNSTREAM_CHECK_KEYS)) return;
  for (const key of DOWNSTREAM_CHECK_KEYS) {
    if (checks[key] !== 'not-assessed') errors.push(`downstreamChecks.${key}:must-be-not-assessed`);
  }
}

function validateAuthorityInputs(errors, authorityInputs) {
  if (!validateExactKeys(errors, authorityInputs, 'authorityInputs', AUTHORITY_INPUT_KEYS)) return;
  for (const key of AUTHORITY_INPUT_KEYS) {
    const path = `authorityInputs.${key}`;
    const lock = authorityInputs[key];
    if (!validateExactKeys(errors, lock, path, AUTHORITY_LOCK_KEYS)) continue;
    validateEnum(errors, lock.authority, `${path}.authority`, [AUTHORITY_KEY_TO_NAME[key]]);
    validateUuid(errors, lock.lockId, `${path}.lockId`);
    validateHash(errors, lock.contentHash, `${path}.contentHash`);
    validateEnum(errors, lock.state, `${path}.state`, ['locked']);
  }
}

/**
 * Validate the closed foundations corpus request before retrieval.
 *
 * @param {Object} input - Neutral plan and typed foundations relationship records.
 * @returns {{valid:boolean,errors:string[]}} Stable validation result.
 */
export function validateFoundationsRelationshipRequest(input) {
  const errors = [];
  if (!validateExactKeys(errors, input, 'input', REQUEST_KEYS)) {
    return { valid: false, errors };
  }
  errors.push(...validateCorpusContextPlan(input.contextPlan).errors);
  validateRetrievalRequest(errors, input.retrievalRequest);
  validateSelection(errors, input.selection);
  validateBlueprint(errors, input.blueprint);
  validateCompatibilityGraph(errors, input.compatibilityGraph, input.selection);
  validateTransformationLedger(
    errors,
    input.transformationLedger,
    input.compatibilityGraph,
    input.selection,
    input.authorityInputs,
  );
  validateDownstreamChecks(errors, input.downstreamChecks);
  validateAuthorityInputs(errors, input.authorityInputs);
  return { valid: errors.length === 0, errors };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. BUILDERS
// ─────────────────────────────────────────────────────────────────────────────

function isKnownRetrievalUnavailable(error) {
  return error instanceof SyntaxError || RETRIEVAL_UNAVAILABLE_CODES.has(error?.code);
}

function provenanceFromCard(card) {
  const provenance = card.provenance ?? {};
  return {
    status: ['known', 'partial', 'unknown'].includes(provenance.status)
      ? provenance.status
      : 'unknown',
    sourceUrl: provenance.sourceUrl ?? null,
    licenseStatus: provenance.licenseStatus ?? 'unknown',
    rightsKnown: provenance.rightsKnown === true,
    useLabel: provenance.rightsKnown === true ? 'transformed-reference' : 'rights-unknown',
  };
}

function sourceDescriptor(card, hydration, role) {
  const provenanceUseLabel = provenanceFromCard(card);
  return {
    sourceId: card.id,
    generationHash: card.generationHash,
    contentHash: card.contentHash,
    sourceUrl: provenanceUseLabel.sourceUrl,
    role,
    provenanceUseLabel,
    artifactHashes: hydration.artifacts.map((artifact) => ({
      path: artifact.path,
      sha256: artifact.sha256,
      truncated: artifact.truncated,
    })),
  };
}

function sourceReference(source) {
  return {
    sourceId: source.sourceId,
    generationHash: source.generationHash,
    contentHash: source.contentHash,
    role: source.role,
    provenanceUseLabel: structuredClone(source.provenanceUseLabel),
  };
}

function negativeProofHandoff(contextPlan, outcome) {
  const isUnavailable = outcome === 'unavailable';
  return {
    generationIdentity: contextPlan.generationIdentity,
    sourceIdentity: null,
    provenanceUseLabel: {
      status: isUnavailable ? 'unavailable' : 'unknown',
      sourceUrl: null,
      licenseStatus: 'not-applicable',
      rightsKnown: false,
      useLabel: isUnavailable ? 'unavailable' : 'not-used',
    },
    semanticRole: { role: 'none', dimensions: [] },
    transformation: {
      state: 'not-applicable',
      summary: 'No corpus source influenced the target-owned foundations blueprint.',
      copiedSourceSpecificMaterial: false,
    },
    fallback: {
      state: isUnavailable ? 'ordinary-workflow' : 'target-derived',
      reason: 'The ordinary target-derived foundations workflow remains active.',
    },
    proofState: {
      outcome,
      status: 'accepted-evidence',
      targetChecks: 'not-assessed',
    },
  };
}

function positiveProofHandoff(contextPlan, anchor, relationCount) {
  const hasKnownRights = anchor.provenanceUseLabel.rightsKnown;
  return {
    generationIdentity: contextPlan.generationIdentity,
    sourceIdentity: {
      sourceId: anchor.sourceId,
      contentHash: anchor.contentHash,
      sourceUrl: anchor.sourceUrl,
    },
    provenanceUseLabel: anchor.provenanceUseLabel,
    semanticRole: { role: 'reference', dimensions: ['relationship', 'rationale'] },
    transformation: {
      state: 'transformed',
      summary: `${relationCount} typed relationships were translated without source literals.`,
      copiedSourceSpecificMaterial: false,
    },
    fallback: {
      state: hasKnownRights ? 'not-needed' : 'target-derived',
      reason: hasKnownRights
        ? 'Bounded relationship evidence informed target-owned decisions.'
        : 'Unknown rights keep all source-specific material out of target output.',
    },
    proofState: {
      outcome: hasKnownRights ? 'positive' : 'unknown-rights',
      status: 'accepted-evidence',
      targetChecks: 'not-assessed',
    },
  };
}

function validateBuiltProof(proofHandoff) {
  const validation = validateProofHandoffRecord(proofHandoff);
  if (!validation.valid) {
    return { ok: false, error: 'invalid-proof-handoff', details: validation.errors };
  }
  return null;
}

function authorityPreservation(authorityInputs, snapshot) {
  const snapshotUnchanged = isDeepStrictEqual(authorityInputs, snapshot);
  const locks = AUTHORITY_INPUT_KEYS.map((key) => ({
    authority: authorityInputs[key].authority,
    lockId: authorityInputs[key].lockId,
    state: snapshotUnchanged ? 'preserved' : 'violated',
  }));
  return {
    order: [...AUTHORITY_ORDER],
    locks,
    allPreserved: locks.every((lock) => lock.state === 'preserved'),
  };
}

function fallbackResult(input, outcome, warnings = []) {
  const proofHandoff = negativeProofHandoff(input.contextPlan, outcome);
  const proofError = validateBuiltProof(proofHandoff);
  if (proofError) return proofError;
  const snapshot = structuredClone(input.authorityInputs);
  return {
    ok: true,
    outcome,
    relationshipBlueprint: structuredClone(input.blueprint),
    compatibilityGraph: {
      schemaVersion: FOUNDATIONS_AXIS_COMPATIBILITY_VERSION,
      nodes: [],
      edges: [],
    },
    transformationLedger: {
      schemaVersion: FOUNDATIONS_TRANSFORMATION_LEDGER_VERSION,
      records: [],
    },
    downstreamChecks: structuredClone(input.downstreamChecks),
    sources: [],
    authorityPreservation: authorityPreservation(input.authorityInputs, snapshot),
    averagedTokenValues: false,
    copiedSourceSpecificMaterial: false,
    proofHandoff,
    warnings,
  };
}

async function hydrateSource(card, engineOptions) {
  try {
    return await runHydrate({
      id: card.id,
      generationHash: card.generationHash,
      mode: 'foundations',
      usage: 'reference',
      includes: ['DESIGN.md', 'design-tokens.json', 'source.md'],
      maxBytes: HYDRATION_BYTES,
    }, engineOptions);
  } catch (error) {
    if (!isKnownRetrievalUnavailable(error)) throw error;
    return { ok: false, error: error.code ?? 'manifest-invalid' };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. PUBLIC API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build a typed foundations compatibility result through the neutral seam.
 *
 * @param {Object} input - Closed relationship, graph, ledger, and authority records.
 * @param {Object} engineOptions - Retrieval-engine corpus and manifest paths.
 * @returns {Promise<Object>} Grounded relationships, validated fallback, or refusal.
 */
export async function buildFoundationsRelationshipPlan(input, engineOptions = {}) {
  const validation = validateFoundationsRelationshipRequest(input);
  if (!validation.valid) {
    return { ok: false, error: 'invalid-foundations-request', details: validation.errors };
  }
  const authoritySnapshot = structuredClone(input.authorityInputs);
  if (input.contextPlan.availability === 'unavailable') {
    return fallbackResult(input, 'unavailable');
  }
  if (input.selection.mode === 'none') return fallbackResult(input, 'no-fit');

  let query;
  try {
    query = await runQuery({
      ...(input.retrievalRequest ?? {}),
      usage: 'reference',
      exactReuse: false,
      limit: MAX_QUERY_CARDS,
    }, engineOptions);
  } catch (error) {
    if (!isKnownRetrievalUnavailable(error)) throw error;
    return fallbackResult(
      input,
      'no-fit',
      [`retrieval-unavailable:${error.code ?? 'invalid-manifest'}`],
    );
  }
  if (query.generationHash !== input.contextPlan.generationIdentity.observedGenerationHash) {
    return fallbackResult(input, 'no-fit', ['retrieval-unavailable:generation-mismatch']);
  }

  const selectedIds = [input.selection.coherentAnchorId, ...input.selection.axisOwnerIds];
  const selectedCards = selectedIds.map((sourceId) => (
    query.cards.find((card) => card.id === sourceId)
  ));
  if (selectedCards.some((card) => !card)) return fallbackResult(input, 'no-fit');

  const sources = [];
  for (const [index, card] of selectedCards.entries()) {
    const hydration = await hydrateSource(card, engineOptions);
    if (!hydration.ok) {
      if (!HYDRATION_UNAVAILABLE_CODES.has(hydration.error)) {
        return { ok: false, error: `source-${hydration.error}` };
      }
      return fallbackResult(input, 'no-fit', [`source-unavailable:${hydration.error}`]);
    }
    sources.push(sourceDescriptor(card, hydration, index === 0 ? 'coherent-anchor' : 'axis-owner'));
  }
  if (!isDeepStrictEqual(input.authorityInputs, authoritySnapshot)) {
    return { ok: false, error: 'authority-input-mutated' };
  }
  const proofHandoff = positiveProofHandoff(
    input.contextPlan,
    sources[0],
    input.compatibilityGraph.edges.length,
  );
  const proofError = validateBuiltProof(proofHandoff);
  if (proofError) return proofError;

  return {
    ok: true,
    outcome: 'relationship-context',
    relationshipBlueprint: structuredClone(input.blueprint),
    compatibilityGraph: structuredClone(input.compatibilityGraph),
    transformationLedger: structuredClone(input.transformationLedger),
    downstreamChecks: structuredClone(input.downstreamChecks),
    sources: sources.map(sourceReference),
    authorityPreservation: authorityPreservation(input.authorityInputs, authoritySnapshot),
    averagedTokenValues: false,
    copiedSourceSpecificMaterial: false,
    proofHandoff,
    warnings: [],
  };
}

/**
 * Return the unchanged shared proof field set used by foundations.
 *
 * @returns {string[]} Stable common proof/handoff fields.
 */
export function foundationsProofHandoffFields() {
  return [...COMMON_PROOF_HANDOFF_FIELDS];
}
