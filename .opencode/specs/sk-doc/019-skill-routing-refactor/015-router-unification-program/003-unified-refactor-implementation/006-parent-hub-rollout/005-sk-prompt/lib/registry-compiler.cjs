'use strict';

const crypto = require('node:crypto');

const {
  canonicalize,
  computeProjectionHash,
} = require('../../../000-contract-schemas/lib/canonical.cjs');
const {
  compile,
  qualifiedDestinationId,
} = require('../../../001-compiler-n1-shadow/compiler/compiler.cjs');

const HUB_ROLE = 'actor';

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

function sourceDigestEntries(sourceBytes) {
  return Object.entries(sourceBytes)
    .map(([sourceId, bytes]) => {
      if (!Buffer.isBuffer(bytes)) fail('SOURCE_BYTES_INVALID', `${sourceId} must be bytes`);
      return { hash: sha256(bytes), sourceId };
    })
    .sort((left, right) => compareText(left.sourceId, right.sourceId));
}

function assertParsedIdentity(sourceBytes, sourceId, parsed) {
  const bytes = sourceBytes[sourceId];
  if (!Buffer.isBuffer(bytes)) fail('SOURCE_BYTES_MISSING', `${sourceId} bytes are required`);
  let observed;
  try {
    observed = JSON.parse(bytes.toString('utf8'));
  } catch (error) {
    fail('SOURCE_JSON_INVALID', `${sourceId}: ${error.message}`);
  }
  if (canonicalize(observed) !== canonicalize(parsed)) {
    fail('SOURCE_IDENTITY_MISMATCH', `${sourceId} object differs from its hashed bytes`);
  }
}

function assertTextIdentity(sourceBytes, sourceId, text) {
  const bytes = sourceBytes[sourceId];
  if (!Buffer.isBuffer(bytes)) fail('SOURCE_BYTES_MISSING', `${sourceId} bytes are required`);
  if (bytes.toString('utf8') !== text) {
    fail('SOURCE_IDENTITY_MISMATCH', `${sourceId} text differs from its hashed bytes`);
  }
}

function unique(values) {
  return [...new Set(values)];
}

function destinationId(registry, mode) {
  return {
    backendKind: mode.backendKind,
    packetId: mode.packet,
    packetKind: mode.packetKind,
    skillId: registry.skill,
    workflowMode: mode.workflowMode,
  };
}

function authorityRef(id) {
  return `authority:${HUB_ROLE}:${qualifiedDestinationId(id)}`;
}

function validateTopology(registry, hubRouter) {
  if (registry.skill !== 'sk-prompt' || hubRouter.skill !== registry.skill) {
    fail('HUB_IDENTITY_INVALID', 'registry and router must describe sk-prompt');
  }
  if (!Array.isArray(registry.modes) || registry.modes.length !== 2) {
    fail('MODE_CARDINALITY_INVALID', 'sk-prompt must declare exactly two modes');
  }
  const modeNames = registry.modes.map((mode) => mode.workflowMode);
  if (new Set(modeNames).size !== modeNames.length) {
    fail('PUBLIC_MODE_DUPLICATE', 'workflow modes must be unique');
  }
  const signalNames = Object.keys(hubRouter.routerSignals || {});
  if (canonicalize([...signalNames].sort(compareText)) !== canonicalize([...modeNames].sort(compareText))) {
    fail('ROUTER_MODE_DRIFT', 'router signal keys must match registry modes');
  }
  const policy = hubRouter.routerPolicy || {};
  if (!modeNames.includes(policy.defaultMode)) {
    fail('DEFAULT_MODE_INVALID', 'default mode must name a registered workflow');
  }
  if (!Array.isArray(policy.tieBreak)
    || canonicalize([...policy.tieBreak].sort(compareText)) !== canonicalize([...modeNames].sort(compareText))) {
    fail('TIE_BREAK_INVALID', 'tie break must list each registered workflow exactly once');
  }
  if (!Number.isSafeInteger(policy.ambiguityDelta) || policy.ambiguityDelta < 0) {
    fail('AMBIGUITY_DELTA_INVALID', 'ambiguity delta must be a non-negative integer');
  }
  for (const outcome of ['single', 'orderedBundle', 'defer']) {
    if (typeof policy.outcomes?.[outcome] !== 'string') {
      fail('OUTCOME_GRAMMAR_INVALID', `router outcome is missing: ${outcome}`);
    }
  }
  registry.modes.forEach((mode) => {
    if (mode.packetKind !== 'workflow') {
      fail('PACKET_KIND_INVALID', `${mode.workflowMode} must remain a workflow packet`);
    }
    if (!hubRouter.routerSignals[mode.workflowMode]) {
      fail('ROUTER_SIGNAL_MISSING', `${mode.workflowMode} lacks an authored signal row`);
    }
  });
}

function compileRoutingModel(registry, hubRouter) {
  const modes = registry.modes.map((mode) => {
    const signal = hubRouter.routerSignals[mode.workflowMode];
    if (!Number.isSafeInteger(signal.weight) || signal.weight < 1) {
      fail('ROUTER_WEIGHT_INVALID', `${mode.workflowMode} weight must be positive`);
    }
    const keywords = [];
    for (const className of signal.classes || []) {
      const vocabulary = hubRouter.vocabularyClasses?.[className];
      if (!vocabulary || !Array.isArray(vocabulary.keywords)) {
        fail('VOCABULARY_CLASS_MISSING', `${mode.workflowMode} references ${className}`);
      }
      keywords.push(...vocabulary.keywords);
    }
    keywords.push(mode.workflowMode, ...(mode.aliases || []));
    if (typeof mode.command === 'string') keywords.push(mode.command);
    const resources = unique(signal.resources || []);
    if (resources.length !== 1 || resources[0] !== `${mode.packet}/SKILL.md`) {
      fail('MODE_RESOURCE_INVALID', `${mode.workflowMode} must route to its packet SKILL.md`);
    }
    return {
      destinationId: destinationId(registry, mode),
      keywords: unique(keywords.map((value) => String(value).trim().toLowerCase()).filter(Boolean)),
      resource: resources[0],
      weight: signal.weight,
      workflowMode: mode.workflowMode,
    };
  });
  return {
    ambiguityDelta: hubRouter.routerPolicy.ambiguityDelta,
    defaultMode: hubRouter.routerPolicy.defaultMode,
    modes,
    tieBreak: [...hubRouter.routerPolicy.tieBreak],
  };
}

function buildProjectionGraph(registry, routingModel) {
  const byMode = new Map(registry.modes.map((mode) => [mode.workflowMode, mode]));
  const rows = routingModel.tieBreak.map((workflowMode) => {
    const mode = byMode.get(workflowMode);
    const routed = routingModel.modes.find((entry) => entry.workflowMode === workflowMode);
    return {
      backendKind: mode.backendKind,
      defaultMode: workflowMode === routingModel.defaultMode,
      destinationId: routed.destinationId,
      identityTuple: [
        registry.skill,
        workflowMode,
        mode.packet,
        mode.packetKind,
        mode.backendKind,
        HUB_ROLE,
      ],
      packetKind: mode.packetKind,
      packetRef: mode.packet,
      qualifiedPublicMode: `${registry.skill}/${workflowMode}`,
      resource: routed.resource,
      role: HUB_ROLE,
      routingClass: mode.advisorRouting.routingClass,
      weight: routed.weight,
      workflowMode,
    };
  });
  return {
    edges: rows.flatMap((row) => [
      { fromQualifiedPublicMode: row.qualifiedPublicMode, kind: 'packetRef', value: row.packetRef },
      { fromQualifiedPublicMode: row.qualifiedPublicMode, kind: 'backendKind', value: row.backendKind },
      { fromQualifiedPublicMode: row.qualifiedPublicMode, kind: 'resource', value: row.resource },
    ]),
    hubId: registry.skill,
    rows,
    schemaVersion: 'V1',
  };
}

function compileRegistry(input) {
  const {
    activationGeneration,
    hubRouter,
    hubSkillMarkdown,
    packetSkillMarkdown,
    registry,
    sourceBytes,
  } = input;
  if (!Number.isSafeInteger(activationGeneration) || activationGeneration < 1) {
    fail('ACTIVATION_GENERATION_INVALID', 'activation generation must be positive');
  }
  assertParsedIdentity(sourceBytes, 'hub-router.json', hubRouter);
  assertParsedIdentity(sourceBytes, 'mode-registry.json', registry);
  assertTextIdentity(sourceBytes, 'SKILL.md', hubSkillMarkdown);
  for (const mode of registry.modes || []) {
    assertTextIdentity(
      sourceBytes,
      `${mode.packet}/SKILL.md`,
      packetSkillMarkdown[mode.workflowMode],
    );
  }
  validateTopology(registry, hubRouter);
  const routingModel = compileRoutingModel(registry, hubRouter);
  const sourceHashes = sourceDigestEntries(sourceBytes);
  const modeByName = new Map(registry.modes.map((mode) => [mode.workflowMode, mode]));
  const destinations = routingModel.tieBreak.map((workflowMode) => {
    const mode = modeByName.get(workflowMode);
    const id = destinationId(registry, mode);
    return {
      authorityRef: authorityRef(id),
      backendKind: mode.backendKind,
      mutatesWorkspace: Boolean(mode.toolSurface?.mutatesWorkspace),
      packetId: mode.packet,
      packetKind: mode.packetKind,
      role: HUB_ROLE,
      skillId: registry.skill,
      workflowMode,
    };
  });
  const intentSignals = routingModel.modes.flatMap((mode) => (
    mode.keywords.map((keyword, index) => ({
      id: `${mode.workflowMode}:${String(index).padStart(3, '0')}`,
      keywords: [keyword],
      resources: [],
      weight: mode.weight,
      workflowMode: mode.workflowMode,
    }))
  ));
  const authoredSources = {
    activationGeneration,
    aliases: unique(registry.modes.flatMap((mode) => [
      mode.workflowMode,
      ...(mode.aliases || []),
      ...(typeof mode.command === 'string' ? [mode.command] : []),
    ])),
    authorityGraph: destinations.map((destination) => ({
      fromAuthorityRef: destination.authorityRef,
      relation: 'approveBeforeCommit',
      toWorkflowMode: destination.workflowMode,
    })),
    bundleRules: [{
      kind: 'orderedBundle',
      targetWorkflowModes: [...routingModel.tieBreak],
    }],
    crossTargetEdges: [],
    defaultResource: hubRouter.routerPolicy.defaultResource[0],
    destinations,
    guardDisposition: 'advisory',
    handoffEdges: [],
    intentSignals,
    leaves: routingModel.modes.map((mode) => ({
      resource: mode.resource,
      workflowMode: mode.workflowMode,
    })),
    negativeAdmissions: ['forbidden'],
    overlay: null,
    referencedModes: [...routingModel.tieBreak],
    resourceContractVersion: registry.resourceContractVersion,
    schemaVersion: 'V1',
    selectionPolicy: {
      ambiguityDelta: String(routingModel.ambiguityDelta),
      maximumIntents: 2,
    },
    skillId: registry.skill,
    sourceHashes,
  };
  const policy = compile(authoredSources);
  const projectionGraph = buildProjectionGraph(registry, routingModel);
  const manifestResources = routingModel.modes.map((mode) => ({
    leafResourceId: mode.resource,
    resource: mode.resource,
    workflowMode: mode.workflowMode,
  }));
  const resourceSelections = routingModel.modes.map((mode) => ({
    leafPairs: [{ leafResourceId: mode.resource, workflowMode: mode.workflowMode }],
    workflowMode: mode.workflowMode,
  }));
  const advisorBody = {
    admissionLabels: ['positive-signal', 'bounded-default', 'exclude:forbidden'],
    aliases: [...authoredSources.aliases].sort(compareText),
    effectivePolicyHash: policy.effectivePolicyHash,
    eligibleModes: projectionGraph.rows.map((row) => ({
      publicMode: row.workflowMode,
      qualifiedId: qualifiedDestinationId(row.destinationId),
      routingClass: row.routingClass,
    })),
    hubId: registry.skill,
    schemaVersion: 'V1',
  };
  const advisorProjection = {
    ...advisorBody,
    projectionHash: computeProjectionHash('AdvisorProjectionV1', advisorBody),
  };
  return Object.freeze({
    advisorProjection: Object.freeze(advisorProjection),
    manifestResources: Object.freeze(manifestResources),
    policy,
    projectionGraph: Object.freeze(projectionGraph),
    resourceSelections: Object.freeze(resourceSelections),
    routingModel: Object.freeze(routingModel),
    sourceHashes: Object.freeze(sourceHashes),
  });
}

module.exports = {
  HUB_ROLE,
  artifactBytes,
  compileRegistry,
  sha256,
};
