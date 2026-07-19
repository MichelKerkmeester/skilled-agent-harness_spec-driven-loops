// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ LIBRARY: DEEP-LOOP REGISTRY COMPILER                                   ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const crypto = require('node:crypto');

const {
  canonicalize,
  computeBasePolicyHash,
  computeEffectivePolicyHash,
  computeProjectionHash,
} = require('../../../000-contract-schemas/lib/canonical.cjs');
const {
  destinationKey,
  qualifiedDestinationId,
  validateReferenceClosure,
} = require('../../../001-compiler-n1-shadow/compiler/compiler.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const DEEP_LOOP_ROLE = 'actor';
const IMPROVEMENT_MODES = Object.freeze([
  'agent-improvement',
  'model-benchmark',
  'skill-benchmark',
]);

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function fail(code, message) {
  const error = new TypeError(message);
  error.code = code;
  throw error;
}

function assertObject(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    fail('AUTHORED_INPUT_INVALID', `${label} must be an object`);
  }
}

function assertString(value, label) {
  if (typeof value !== 'string' || !/\S/.test(value)) {
    fail('AUTHORED_INPUT_INVALID', `${label} must be a non-empty string`);
  }
}

function compareText(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function sha256(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

function sourceDigests(sourceBytes) {
  return Object.entries(sourceBytes)
    .map(([sourceId, bytes]) => ({ hash: sha256(bytes), sourceId }))
    .sort((left, right) => compareText(left.sourceId, right.sourceId));
}

function assertSourceIdentity(input) {
  const registryBytes = input.sourceBytes?.['mode-registry.json'];
  const skillBytes = input.sourceBytes?.['SKILL.md'];
  const routerBytes = input.sourceBytes?.['smart_routing.md'];
  const manifestBytes = input.sourceBytes?.['leaf-manifest.json'];
  if (![registryBytes, skillBytes, routerBytes, manifestBytes].every(Buffer.isBuffer)) {
    fail('AUTHORED_SOURCE_BYTES_MISSING', 'all authored source bytes must be supplied');
  }
  let parsedRegistry;
  let parsedManifest;
  try {
    parsedRegistry = JSON.parse(registryBytes.toString('utf8'));
    parsedManifest = JSON.parse(manifestBytes.toString('utf8'));
  } catch (error) {
    fail('AUTHORED_SOURCE_BYTES_INVALID', `authored JSON bytes are invalid: ${error.message}`);
  }
  if (canonicalize(parsedRegistry) !== canonicalize(input.registry)
    || canonicalize(parsedManifest) !== canonicalize(input.leafManifest)
    || skillBytes.toString('utf8') !== input.skillMarkdown
    || routerBytes.toString('utf8') !== input.smartRoutingMarkdown) {
    fail('AUTHORED_SOURCE_IDENTITY_MISMATCH', 'parsed inputs do not match hashed authored bytes');
  }
}

function destinationId(skillId, mode) {
  return {
    backendKind: mode.backendKind,
    packetId: mode.packet,
    packetKind: mode.packetKind,
    ...(mode.runtimeLoopType === null
      ? {}
      : { runtimeDiscriminator: mode.runtimeLoopType }),
    skillId,
    workflowMode: mode.workflowMode,
  };
}

function authorityRef(id) {
  return `authority:actor:${qualifiedDestinationId(id)}`;
}

function projectionRow(skillId, mode) {
  const id = destinationId(skillId, mode);
  return {
    backendKind: mode.backendKind,
    identityTuple: [
      skillId,
      mode.workflowMode,
      mode.packet,
      mode.packetKind,
      mode.backendKind,
      mode.runtimeLoopType,
      DEEP_LOOP_ROLE,
    ],
    packetKind: mode.packetKind,
    packetRef: mode.packet,
    qualifiedPublicMode: `${skillId}/${mode.workflowMode}`,
    role: DEEP_LOOP_ROLE,
    routingClass: mode.advisorRouting.routingClass,
    runtimeLoopType: mode.runtimeLoopType,
    workflowMode: mode.workflowMode,
    destinationId: id,
  };
}

function assertModeShape(mode, index) {
  assertObject(mode, `modes[${index}]`);
  for (const field of ['workflowMode', 'packet', 'packetKind', 'backendKind']) {
    assertString(mode[field], `modes[${index}].${field}`);
  }
  if (mode.runtimeLoopType !== null) {
    assertString(mode.runtimeLoopType, `modes[${index}].runtimeLoopType`);
  }
  assertObject(mode.advisorRouting, `modes[${index}].advisorRouting`);
  assertString(mode.advisorRouting.routingClass, `modes[${index}].advisorRouting.routingClass`);
}

function assertPublicModeUniqueness(modes) {
  const authoredPublicModes = new Set();
  modes.forEach((mode, index) => {
    if (!mode || typeof mode.workflowMode !== 'string' || !/\S/.test(mode.workflowMode)) {
      fail('PUBLIC_MODE_MISSING', `modes[${index}].workflowMode must name a public mode`);
    }
    if (authoredPublicModes.has(mode.workflowMode)) {
      fail(
        'PUBLIC_MODE_DUPLICATE',
        `authored public mode must be unique: ${mode.workflowMode}`,
      );
    }
    authoredPublicModes.add(mode.workflowMode);
  });
}

function assertInjective(rows) {
  const keys = rows.map((row) => canonicalize(row.identityTuple));
  if (new Set(keys).size !== rows.length) {
    fail('DESTINATION_IDENTITY_COLLAPSE', 'destination identity tuple is not injective');
  }
}

function assertNoCollapse(rows, registry) {
  const rowByMode = new Map(rows.map((row) => [row.workflowMode, row]));
  const registryModes = registry.modes.map((mode) => mode.workflowMode);
  if (rows.length !== registryModes.length
    || registryModes.some((mode) => !rowByMode.has(mode))) {
    fail('REGISTRY_MODE_COLLAPSE', 'compiled rows must preserve every authored public mode');
  }

  const improvementRows = IMPROVEMENT_MODES.map((mode) => rowByMode.get(mode));
  if (improvementRows.some((row) => !row)
    || new Set(improvementRows.map((row) => row.workflowMode)).size !== 3
    || new Set(improvementRows.map((row) => canonicalize(row.identityTuple))).size !== 3
    || improvementRows.some((row) => row.packetRef !== 'deep-improvement')
    || new Set(improvementRows.map((row) => row.routingClass)).size !== 2
    || improvementRows[0].routingClass !== 'alias-fold'
    || improvementRows.slice(1).some((row) => row.routingClass !== 'command-bridge')) {
    fail('SHARED_PACKET_COLLAPSE', 'deep-improvement public lanes collapsed or lost alias class');
  }

  const review = rowByMode.get('review');
  const alignment = rowByMode.get('alignment');
  if (!review || !alignment
    || review.runtimeLoopType !== 'review'
    || alignment.runtimeLoopType !== 'review'
    || review.packetRef === alignment.packetRef) {
    fail('RUNTIME_KEY_COLLAPSE', 'review runtime key no longer preserves distinct packets');
  }
}

function aliasRows(registry) {
  const rows = [];
  for (const mode of registry.modes) {
    const routingClass = mode.advisorRouting.routingClass;
    const values = [
      ['workflow-mode', mode.workflowMode],
      ['command', mode.command],
      ...(mode.aliases || []).map((value) => ['public-alias', value]),
      ...(mode.advisorRouting.legacyAliases || []).map((value) => ['advisor-alias', value]),
      ...(mode.advisorRouting.legacyAdvisorId
        ? [['advisor-id', mode.advisorRouting.legacyAdvisorId]]
        : []),
    ];
    for (const [kind, value] of values) {
      if (typeof value === 'string' && /\S/.test(value)) {
        rows.push({ kind, routingClass, value, workflowMode: mode.workflowMode });
      }
    }
  }
  const owners = new Map();
  for (const row of rows) {
    if (!owners.has(row.value)) owners.set(row.value, []);
    owners.get(row.value).push(row);
  }
  const resolved = [];
  for (const [value, candidates] of owners) {
    const defaults = candidates.filter((candidate) => {
      const mode = registry.modes.find((entry) => entry.workflowMode === candidate.workflowMode);
      return mode?.advisorRouting?.advisorDefaultMode === true;
    });
    const selected = defaults.length === 1 ? defaults[0] : candidates[0];
    if (new Set(candidates.map((candidate) => candidate.workflowMode)).size > 1
      && defaults.length !== 1) continue;
    resolved.push({ ...selected, value });
  }
  return resolved.sort((left, right) => (
    compareText(left.value, right.value) || compareText(left.workflowMode, right.workflowMode)
  ));
}

function detectorGraph(registry, destinations) {
  const byMode = new Map(destinations.map((destination) => [
    destination.id.workflowMode,
    destination,
  ]));
  const detectors = [];
  const selectors = [];
  for (const mode of registry.modes) {
    const values = [...new Set([
      mode.workflowMode,
      mode.command,
      ...(mode.aliases || []),
    ].filter((value) => typeof value === 'string' && /\S/.test(value)))];
    values.forEach((value, index) => {
      const detectorId = `detector:signal:${mode.workflowMode}:${index}`;
      detectors.push({ id: detectorId, kind: 'alias', value: value.toLowerCase() });
      selectors.push({
        destinationId: byMode.get(mode.workflowMode).id,
        detectorIds: [detectorId],
        id: `selector:${mode.workflowMode}:${index}`,
      });
    });
  }
  detectors.push({ id: 'detector:negative:forbidden', kind: 'negative', value: 'forbidden' });
  detectors.sort((left, right) => compareText(left.id, right.id));
  selectors.sort((left, right) => compareText(left.id, right.id));
  return { detectors, selectors };
}

function compileManifestResources(leafManifest, registry) {
  assertObject(leafManifest, 'leaf manifest');
  if (!Array.isArray(leafManifest.modes)) {
    fail('AUTHORED_INPUT_INVALID', 'leaf manifest must declare modes');
  }
  const registryByMode = new Map(registry.modes.map((mode) => [mode.workflowMode, mode]));
  const identities = [];
  const seen = new Set();
  leafManifest.modes.forEach((mode, modeIndex) => {
    assertObject(mode, `leaf manifest modes[${modeIndex}]`);
    assertString(mode.workflowMode, `leaf manifest modes[${modeIndex}].workflowMode`);
    assertString(mode.packet, `leaf manifest modes[${modeIndex}].packet`);
    const registered = registryByMode.get(mode.workflowMode);
    if (!registered || registered.packet !== mode.packet) {
      fail(
        'MANIFEST_IDENTITY_MISMATCH',
        `leaf manifest identity does not match the registry: ${mode.workflowMode}`,
      );
    }
    if (!Array.isArray(mode.leaves)) {
      fail('AUTHORED_INPUT_INVALID', `leaf manifest modes[${modeIndex}].leaves must be an array`);
    }
    mode.leaves.forEach((leafResourceId, leafIndex) => {
      assertString(
        leafResourceId,
        `leaf manifest modes[${modeIndex}].leaves[${leafIndex}]`,
      );
      const key = `${mode.workflowMode}\u0000${leafResourceId}`;
      if (seen.has(key)) {
        fail(
          'MANIFEST_IDENTITY_DUPLICATE',
          `leaf manifest identity is duplicated: ${mode.workflowMode}/${leafResourceId}`,
        );
      }
      seen.add(key);
      identities.push({
        leafResourceId,
        resource: `${mode.packet}/${leafResourceId}`,
        workflowMode: mode.workflowMode,
      });
    });
  });
  return identities.sort((left, right) => (
    compareText(left.workflowMode, right.workflowMode)
      || compareText(left.leafResourceId, right.leafResourceId)
  ));
}

function buildDestinations(registry) {
  return registry.modes.map((mode) => {
    const id = destinationId(registry.skill, mode);
    return {
      authorityRef: authorityRef(id),
      id,
      mutatesWorkspace: Boolean(mode.toolSurface?.mutatesWorkspace),
      role: DEEP_LOOP_ROLE,
    };
  });
}

function buildProjectionGraph(registry, rows) {
  const packetEdges = rows.map((row) => ({
    fromQualifiedPublicMode: row.qualifiedPublicMode,
    kind: 'packetRef',
    value: row.packetRef,
  }));
  const backendEdges = rows.map((row) => ({
    fromQualifiedPublicMode: row.qualifiedPublicMode,
    kind: 'backendKind',
    value: row.backendKind,
  }));
  const runtimeEdges = rows.map((row) => ({
    fromQualifiedPublicMode: row.qualifiedPublicMode,
    kind: 'runtimeLoopType',
    value: row.runtimeLoopType,
  }));
  return {
    edges: [...packetEdges, ...backendEdges, ...runtimeEdges],
    hubId: registry.skill,
    rows,
    schemaVersion: 'V1',
  };
}

function fallbackChecklist(registry, skillMarkdown) {
  if (!skillMarkdown.includes('UNKNOWN_FALLBACK')) {
    fail('FALLBACK_CHECKLIST_MISSING', 'authored skill does not declare UNKNOWN_FALLBACK');
  }
  const modes = registry.modes.map((mode) => mode.workflowMode);
  return [
    `Choose one deep-loop mode: ${modes.join(', ')}.`,
    'Name the matching /deep:* command or public mode.',
    'Confirm the target and whether the operation may mutate the workspace.',
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. COMPILER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compile the authored deep-loop registry without deriving runtime discriminators.
 *
 * @param {Object} input - Registry, source bytes, and activation generation.
 * @returns {Object} Frozen policy and compatibility projections.
 */
function compileRegistry(input) {
  assertObject(input, 'compiler input');
  assertObject(input.registry, 'mode registry');
  assertString(input.registry.skill, 'mode registry skill');
  if (!Array.isArray(input.registry.modes) || input.registry.modes.length === 0) {
    fail('AUTHORED_INPUT_INVALID', 'mode registry must declare modes');
  }
  assertPublicModeUniqueness(input.registry.modes);
  input.registry.modes.forEach(assertModeShape);
  if (!Number.isSafeInteger(input.activationGeneration) || input.activationGeneration < 1) {
    fail('AUTHORED_INPUT_INVALID', 'activation generation must be a positive integer');
  }
  assertSourceIdentity(input);

  const rows = input.registry.modes.map((mode) => projectionRow(input.registry.skill, mode));
  assertInjective(rows);
  assertNoCollapse(rows, input.registry);
  const manifestResources = compileManifestResources(input.leafManifest, input.registry);
  const destinations = buildDestinations(input.registry);
  const destinationKeys = destinations.map((destination) => destinationKey(destination.id));
  if (new Set(destinationKeys).size !== destinations.length) {
    fail('DESTINATION_IDENTITY_COLLAPSE', 'compiled destination ids are not unique');
  }
  const selection = detectorGraph(input.registry, destinations);
  const sourceHashes = sourceDigests(input.sourceBytes);
  const policyBody = {
    activationGeneration: input.activationGeneration,
    authorityGraph: destinations.map((destination) => ({
      fromAuthorityRef: destination.authorityRef,
      relation: 'approveBeforeCommit',
      toDestinationId: destination.id,
    })),
    compositionRules: [],
    destinations,
    detectors: selection.detectors,
    provenancePolicy: {
      kind: 'static',
      sourceHashes: sourceHashes.map((entry) => entry.hash),
    },
    recoveryPolicy: {
      handoffHops: 0,
      ladder: ['clarify', 'defer', 'reject'],
      userTurns: 1,
    },
    schemaVersion: 'V1',
    selectors: selection.selectors,
    thresholdPolicy: { kind: 'exact-admission', thresholds: [] },
  };
  validateReferenceClosure(policyBody);
  const policy = { ...policyBody, basePolicyHash: computeBasePolicyHash(policyBody) };
  policy.effectivePolicyHash = computeEffectivePolicyHash(policy);

  const aliases = aliasRows(input.registry);
  const advisorProjection = {
    admissionLabels: ['positive-signal', 'exclude:forbidden'],
    aliases: [...new Set(aliases.map((entry) => entry.value))].sort(compareText),
    effectivePolicyHash: policy.effectivePolicyHash,
    eligibleModes: rows.map((row) => ({
      publicMode: row.workflowMode,
      qualifiedId: qualifiedDestinationId(row.destinationId),
      routingClass: row.routingClass,
    })),
    hubId: input.registry.skill,
    schemaVersion: 'V1',
  };
  advisorProjection.projectionHash = computeProjectionHash(
    'AdvisorProjectionV1',
    advisorProjection,
  );

  return Object.freeze({
    advisorProjection: Object.freeze(advisorProjection),
    aliasProjections: Object.freeze(aliases),
    fallbackChecklist: Object.freeze(fallbackChecklist(input.registry, input.skillMarkdown)),
    manifestResources: Object.freeze(manifestResources.map((entry) => Object.freeze(entry))),
    policy: Object.freeze(policy),
    projectionGraph: Object.freeze(buildProjectionGraph(input.registry, rows)),
    sourceHashes: Object.freeze(sourceHashes),
  });
}

/**
 * Encode a generated artifact with the frozen canonical serializer.
 *
 * @param {Object} value - JSON-compatible artifact.
 * @returns {Buffer} Canonical bytes with one terminal newline.
 */
function artifactBytes(value) {
  return Buffer.from(`${canonicalize(value)}\n`, 'utf8');
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  DEEP_LOOP_ROLE,
  IMPROVEMENT_MODES,
  artifactBytes,
  assertInjective,
  assertNoCollapse,
  compileRegistry,
  sha256,
};
