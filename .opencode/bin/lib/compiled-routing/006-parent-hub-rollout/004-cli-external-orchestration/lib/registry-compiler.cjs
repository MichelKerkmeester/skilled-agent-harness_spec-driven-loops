// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ LIBRARY: CLI EXTERNAL ORCHESTRATION REGISTRY COMPILER                  ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const crypto = require('node:crypto');

const {
  canonicalize,
  computeProjectionHash,
} = require('../../../000-contract-schemas/lib/canonical.cjs');
const {
  compile,
  deriveDegeneracy,
  destinationKey,
  qualifiedDestinationId,
} = require('../../../001-compiler-n1-shadow/compiler/compiler.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const ACTOR_ROLE = 'actor';
const FORBIDDEN_SIGNAL = 'forbidden';

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function fail(code, message) {
  const error = new TypeError(message);
  error.code = code;
  throw error;
}

function compareText(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function sha256(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

function artifactBytes(value) {
  return Buffer.from(`${canonicalize(value)}\n`, 'utf8');
}

function sourceDigests(sourceBytes) {
  return Object.entries(sourceBytes)
    .map(([sourceId, bytes]) => {
      if (!Buffer.isBuffer(bytes)) {
        fail('AUTHORED_SOURCE_BYTES_INVALID', `${sourceId} must be bytes`);
      }
      return { hash: sha256(bytes), sourceId };
    })
    .sort((left, right) => compareText(left.sourceId, right.sourceId));
}

function parseSourceJson(sourceBytes, sourceId) {
  const bytes = sourceBytes[sourceId];
  if (!Buffer.isBuffer(bytes)) {
    fail('AUTHORED_SOURCE_BYTES_MISSING', `${sourceId} bytes are required`);
  }
  try {
    return JSON.parse(bytes.toString('utf8'));
  } catch (error) {
    fail('AUTHORED_SOURCE_JSON_INVALID', `${sourceId}: ${error.message}`);
  }
}

function assertSourceIdentity(input) {
  const registryId = 'cli-external-orchestration/mode-registry.json';
  const routerId = 'cli-external-orchestration/hub-router.json';
  const skillId = 'cli-external-orchestration/SKILL.md';
  if (canonicalize(parseSourceJson(input.sourceBytes, registryId))
    !== canonicalize(input.registry)) {
    fail('AUTHORED_SOURCE_IDENTITY_MISMATCH', `${registryId} differs from its bytes`);
  }
  if (canonicalize(parseSourceJson(input.sourceBytes, routerId))
    !== canonicalize(input.hubRouter)) {
    fail('AUTHORED_SOURCE_IDENTITY_MISMATCH', `${routerId} differs from its bytes`);
  }
  if (input.sourceBytes[skillId]?.toString('utf8') !== input.skillMarkdown) {
    fail('AUTHORED_SOURCE_IDENTITY_MISMATCH', `${skillId} differs from its bytes`);
  }
  for (const mode of input.registry.modes) {
    const packetId = `cli-external-orchestration/${mode.packet}/SKILL.md`;
    const markdown = input.packetSkillMarkdown[mode.workflowMode];
    if (input.sourceBytes[packetId]?.toString('utf8') !== markdown) {
      fail('AUTHORED_SOURCE_IDENTITY_MISMATCH', `${packetId} differs from its bytes`);
    }
    const name = /^name:\s*([^\n]+)$/m.exec(markdown || '')?.[1]?.trim();
    if (name !== mode.packetSkillName) {
      fail('PACKET_SKILL_IDENTITY_MISMATCH', `${mode.workflowMode} packet name drifted`);
    }
  }
}

function destinationId(skillId, mode) {
  return {
    backendKind: mode.backendKind,
    packetId: mode.packet,
    packetKind: mode.packetKind,
    skillId,
    workflowMode: mode.workflowMode,
  };
}

function authorityRef(id) {
  const digest = sha256(Buffer.from(canonicalize(id), 'utf8')).slice(0, 24);
  return `authority:${ACTOR_ROLE}:${digest}`;
}

function combinations(values, size, offset = 0, prefix = []) {
  if (prefix.length === size) return [prefix];
  const rows = [];
  for (let index = offset; index <= values.length - (size - prefix.length); index += 1) {
    rows.push(...combinations(values, size, index + 1, [...prefix, values[index]]));
  }
  return rows;
}

function orderedBundleRules(tieBreak) {
  const rows = [];
  for (let size = 2; size <= tieBreak.length; size += 1) {
    for (const targetWorkflowModes of combinations(tieBreak, size)) {
      rows.push({ kind: 'orderedBundle', targetWorkflowModes });
    }
  }
  return rows;
}

function assertHubShape(registry, hubRouter) {
  if (!registry || !Array.isArray(registry.modes) || registry.modes.length === 0) {
    fail('REGISTRY_INVALID', 'mode registry must declare modes');
  }
  if (!hubRouter || hubRouter.skill !== registry.skill) {
    fail('HUB_IDENTITY_MISMATCH', 'hub router and registry skill ids must match');
  }
  const modeNames = registry.modes.map((mode) => mode.workflowMode);
  const signalNames = Object.keys(hubRouter.routerSignals || {});
  const tieBreak = hubRouter.routerPolicy?.tieBreak;
  if (new Set(modeNames).size !== modeNames.length) {
    fail('REGISTRY_MODE_DUPLICATE', 'workflow modes must be unique');
  }
  if (!Array.isArray(tieBreak)
    || canonicalize([...tieBreak].sort(compareText))
      !== canonicalize([...modeNames].sort(compareText))) {
    fail('TIE_BREAK_MODE_DRIFT', 'tieBreak must contain every registered mode exactly once');
  }
  if (canonicalize([...signalNames].sort(compareText))
    !== canonicalize([...modeNames].sort(compareText))) {
    fail('ROUTER_SIGNAL_MODE_DRIFT', 'router signals and registered modes must align');
  }
  if (hubRouter.routerPolicy.defaultMode !== null) {
    fail('DEFAULT_MODE_FORBIDDEN', 'this hub must fail closed without a default mode');
  }
  for (const mode of registry.modes) {
    if (mode.packetKind !== 'workflow' || mode.backendKind !== 'cli-dispatch') {
      fail('EXECUTOR_ARCHETYPE_DRIFT', `${mode.workflowMode} is not a CLI workflow actor`);
    }
    if (mode.toolSurface?.mutatesWorkspace !== true) {
      fail('EXECUTOR_MUTATION_DRIFT', `${mode.workflowMode} must declare workspace mutation`);
    }
    const signal = hubRouter.routerSignals[mode.workflowMode];
    if (!Number.isSafeInteger(signal.weight) || signal.weight < 1) {
      fail('ROUTER_WEIGHT_INVALID', `${mode.workflowMode} weight must be positive`);
    }
    if (!Array.isArray(signal.classes) || signal.classes.length === 0) {
      fail('ROUTER_CLASS_MISSING', `${mode.workflowMode} must declare signal classes`);
    }
    const expectedResource = `${mode.packet}/SKILL.md`;
    if (canonicalize(signal.resources) !== canonicalize([expectedResource])) {
      fail('ROUTER_RESOURCE_DRIFT', `${mode.workflowMode} must load its packet SKILL.md`);
    }
    const aliasClass = signal.classes.find((classId) => classId.endsWith('-aliases'));
    if (!aliasClass) {
      fail('EXPLICIT_ALIAS_CLASS_MISSING', `${mode.workflowMode} needs an alias class`);
    }
    const aliasKeywords = hubRouter.vocabularyClasses?.[aliasClass]?.keywords || [];
    for (const alias of mode.aliases || []) {
      if (!aliasKeywords.includes(alias)) {
        fail('REGISTRY_ALIAS_UNROUTABLE', `${mode.workflowMode} alias is absent: ${alias}`);
      }
    }
  }
}

function authoredModel(input, sourceHashes) {
  const { hubRouter, registry } = input;
  const destinations = registry.modes.map((mode) => {
    const id = destinationId(registry.skill, mode);
    return {
      authorityRef: authorityRef(id),
      backendKind: id.backendKind,
      mutatesWorkspace: true,
      packetId: id.packetId,
      packetKind: id.packetKind,
      role: ACTOR_ROLE,
      skillId: id.skillId,
      workflowMode: id.workflowMode,
    };
  });
  const intentSignals = [];
  for (const mode of registry.modes) {
    const signal = hubRouter.routerSignals[mode.workflowMode];
    for (const classId of signal.classes) {
      const keywords = hubRouter.vocabularyClasses?.[classId]?.keywords;
      if (!Array.isArray(keywords) || keywords.length === 0) {
        fail('VOCABULARY_CLASS_INVALID', `${classId} must declare keywords`);
      }
      intentSignals.push({
        id: `${mode.workflowMode}:${classId}`,
        keywords,
        resources: [],
        weight: signal.weight,
        workflowMode: mode.workflowMode,
      });
    }
  }
  return {
    activationGeneration: input.activationGeneration,
    aliases: registry.modes.flatMap((mode) => mode.aliases || []),
    authorityGraph: destinations.map((destination) => ({
      fromAuthorityRef: destination.authorityRef,
      relation: 'approveBeforeCommit',
      toWorkflowMode: destination.workflowMode,
    })),
    bundleRules: orderedBundleRules(hubRouter.routerPolicy.tieBreak),
    crossTargetEdges: [],
    defaultResource: null,
    destinations,
    guardDisposition: 'advisory',
    handoffEdges: [],
    intentSignals,
    leaves: [],
    negativeAdmissions: [FORBIDDEN_SIGNAL],
    overlay: null,
    referencedModes: registry.modes.map((mode) => mode.workflowMode),
    resourceContractVersion: registry.resourceContractVersion,
    schemaVersion: 'V1',
    selectionPolicy: {
      ambiguityDelta: String(hubRouter.routerPolicy.ambiguityDelta),
      maximumIntents: hubRouter.routerPolicy.tieBreak.length,
    },
    skillId: registry.skill,
    sourceHashes,
  };
}

function buildDestinationGraph(policy, registry, hubRouter) {
  const modeSignals = registry.modes.flatMap((mode) => (
    hubRouter.routerSignals[mode.workflowMode].classes.map((classId) => ({
      classId,
      explicit: classId.endsWith('-aliases'),
      selectorId: `selector:${mode.workflowMode}:${classId}`,
      workflowMode: mode.workflowMode,
    }))
  ));
  const body = {
    activationGeneration: policy.activationGeneration,
    ambiguityDelta: String(hubRouter.routerPolicy.ambiguityDelta),
    destinations: policy.destinations.map((destination) => ({
      ...destination,
      effectClass: 'external-effect',
    })),
    effectivePolicyHash: policy.effectivePolicyHash,
    modeSignals,
    outcomes: hubRouter.routerPolicy.outcomes,
    schemaVersion: 'V1',
    selectionKinds: deriveDegeneracy(policy, {
      bundleRules: policy.compositionRules,
      crossTargetEdges: [],
      handoffEdges: [],
      overlay: null,
    }).selectionKinds,
    tieBreak: hubRouter.routerPolicy.tieBreak,
  };
  return Object.freeze({ ...body, graphHash: sha256(artifactBytes(body)) });
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. COMPILER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compile live CLI hub authorship through the shared policy compiler.
 *
 * @param {Object} input - Authored bytes, parsed sources, and generation.
 * @returns {Readonly<Object>} Compiled policy and read-only projections.
 */
function compileRegistry(input) {
  if (!Number.isSafeInteger(input.activationGeneration) || input.activationGeneration < 1) {
    fail('ACTIVATION_GENERATION_INVALID', 'activation generation must be positive');
  }
  assertHubShape(input.registry, input.hubRouter);
  assertSourceIdentity(input);
  const sourceHashes = sourceDigests(input.sourceBytes);
  const policy = compile(authoredModel(input, sourceHashes));
  const destinationGraph = buildDestinationGraph(
    policy,
    input.registry,
    input.hubRouter,
  );
  const advisorBody = {
    admissionLabels: [
      'positive-signal',
      'explicit-multi:orderedBundle',
      'ambiguous:clarify',
      'zero-signal:defer',
      'exclude:forbidden',
    ],
    aliases: [...new Set(input.registry.modes.flatMap((mode) => mode.aliases || []))]
      .sort(compareText),
    effectivePolicyHash: policy.effectivePolicyHash,
    eligibleModes: input.registry.modes.map((mode) => ({
      publicMode: mode.workflowMode,
      qualifiedId: qualifiedDestinationId(destinationId(input.registry.skill, mode)),
      routingClass: mode.advisorRouting.routingClass,
    })),
    hubId: input.registry.skill,
    schemaVersion: 'V1',
  };
  const advisorProjection = Object.freeze({
    ...advisorBody,
    projectionHash: computeProjectionHash('AdvisorProjectionV1', advisorBody),
  });
  return Object.freeze({
    advisorProjection,
    destinationGraph,
    policy,
    sourceHashes: Object.freeze(sourceHashes),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  ACTOR_ROLE,
  FORBIDDEN_SIGNAL,
  artifactBytes,
  compileRegistry,
  destinationKey,
  sha256,
};
