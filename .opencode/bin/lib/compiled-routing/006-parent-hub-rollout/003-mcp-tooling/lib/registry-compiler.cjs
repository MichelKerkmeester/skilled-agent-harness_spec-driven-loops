'use strict';

const crypto = require('node:crypto');

const {
  canonicalize,
  computeBasePolicyHash,
  computeEffectivePolicyHash,
  computeProjectionHash,
} = require('../../../000-contract-schemas/lib/canonical.cjs');

const ROLE_BY_PACKET_KIND = Object.freeze({
  transport: 'transport',
  workflow: 'actor',
});

function fail(code, message) {
  const error = new TypeError(message);
  error.code = code;
  throw error;
}

function sha256(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

function artifactBytes(value) {
  return Buffer.from(`${canonicalize(value)}\n`, 'utf8');
}

function destinationKey(id) {
  return canonicalize(id);
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

function authorityRef(role, id) {
  return `authority:${role}:${sha256(Buffer.from(destinationKey(id))).slice(0, 24)}`;
}

function uniqueSorted(values) {
  return [...new Set(values)].sort();
}

function sourceDigestEntries(sourceBytes) {
  return Object.entries(sourceBytes)
    .map(([sourceId, bytes]) => {
      if (!Buffer.isBuffer(bytes)) fail('SOURCE_BYTES_INVALID', `${sourceId} must be bytes`);
      return { hash: sha256(bytes), sourceId };
    })
    .sort((left, right) => left.sourceId.localeCompare(right.sourceId));
}

function assertParsedIdentity(sourceBytes, sourceId, parsed) {
  const bytes = sourceBytes[sourceId];
  if (!bytes) fail('SOURCE_BYTES_MISSING', `${sourceId} bytes are required`);
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
  if (!bytes) fail('SOURCE_BYTES_MISSING', `${sourceId} bytes are required`);
  if (bytes.toString('utf8') !== text) {
    fail('SOURCE_IDENTITY_MISMATCH', `${sourceId} text differs from its hashed bytes`);
  }
}

function extractMutationSignals(skillMarkdown) {
  const match = /^- \*\*MUTATING\*\*[^:]*:\s*([^\n]+)/m.exec(skillMarkdown || '');
  if (!match) return [];
  return uniqueSorted([...match[1].matchAll(/`([^`]+)`/g)]
    .flatMap((entry) => entry[1].split(/[|/,]/))
    .map((value) => value.replace(/\*/g, '').trim().toLowerCase())
    .filter((value) => value.length >= 3));
}

function detectorRows(prefix, mode, extraValues = []) {
  return uniqueSorted([mode.workflowMode, ...(mode.aliases || []), ...extraValues])
    .map((value, index) => ({
      id: `detector:${prefix}:${mode.workflowMode}:${index}`,
      kind: 'alias',
      value: String(value).toLowerCase(),
    }));
}

function assertNoTransportApprover(destinationGraph) {
  const byKey = new Map(destinationGraph.destinations.map((entry) => [destinationKey(entry.id), entry]));
  const transportApprover = destinationGraph.authorityGraph.some((edge) => (
    byKey.get(destinationKey(edge.approverDestinationId))?.role === 'transport'
  ));
  if (transportApprover) fail('TRANSPORT_SUPPLIES_JUDGMENT', 'transport cannot approve authority');
}

function compileRegistry(input) {
  const {
    activationGeneration,
    externalInfrastructureMarkdown,
    hubRegistry,
    hubSkillMarkdown,
    judgmentRegistries,
    judgmentSkillMarkdown,
    packetSkillMarkdown,
    sourceBytes,
  } = input;
  if (!Number.isSafeInteger(activationGeneration) || activationGeneration < 1) {
    fail('ACTIVATION_GENERATION_INVALID', 'activation generation must be positive');
  }
  if (!hubRegistry || !Array.isArray(hubRegistry.modes)) {
    fail('REGISTRY_INVALID', 'hub registry modes are required');
  }
  assertParsedIdentity(sourceBytes, 'mcp-tooling/mode-registry.json', hubRegistry);
  assertTextIdentity(sourceBytes, 'mcp-tooling/SKILL.md', hubSkillMarkdown);
  assertTextIdentity(
    sourceBytes,
    'mcp-code-mode/SKILL.md',
    externalInfrastructureMarkdown,
  );

  const pairing = hubRegistry.extensions?.['transport-axis']?.crossHubPairing || {};
  const pairedSkillIds = uniqueSorted(Object.values(pairing));
  for (const skillId of pairedSkillIds) {
    const registry = judgmentRegistries[skillId];
    if (!registry) fail('JUDGMENT_REGISTRY_MISSING', `paired registry is missing: ${skillId}`);
    assertParsedIdentity(sourceBytes, `${skillId}/mode-registry.json`, registry);
    assertTextIdentity(sourceBytes, `${skillId}/SKILL.md`, judgmentSkillMarkdown[skillId]);
  }
  for (const [mode, text] of Object.entries(packetSkillMarkdown)) {
    assertTextIdentity(sourceBytes, `mcp-tooling/${mode}/SKILL.md`, text);
  }

  const destinationMetadata = [];
  for (const mode of hubRegistry.modes) {
    const role = ROLE_BY_PACKET_KIND[mode.packetKind];
    if (!role) fail('PACKET_KIND_UNSUPPORTED', `unsupported packet kind: ${mode.packetKind}`);
    const id = destinationId(hubRegistry, mode);
    const mutationSignals = extractMutationSignals(packetSkillMarkdown[mode.workflowMode]);
    destinationMetadata.push({
      authorityRef: authorityRef(role, id),
      effectClass: mutationSignals.length > 0 ? 'external-mutation-capable' : (
        mode.toolSurface?.mutatesWorkspace ? 'workspace-mutation-capable' : 'read-only'
      ),
      id,
      mutatesWorkspace: Boolean(mode.toolSurface?.mutatesWorkspace),
      mutationSignals,
      role,
      selectorValues: uniqueSorted([mode.workflowMode, ...(mode.aliases || [])]),
    });
  }

  for (const skillId of pairedSkillIds) {
    const registry = judgmentRegistries[skillId];
    for (const mode of registry.modes.filter((entry) => entry.packetKind !== 'transport')) {
      const id = destinationId(registry, mode);
      destinationMetadata.push({
        authorityRef: authorityRef('judgment', id),
        effectClass: mode.toolSurface?.mutatesWorkspace ? 'workspace-mutation-capable' : 'read-only',
        id,
        mutatesWorkspace: Boolean(mode.toolSurface?.mutatesWorkspace),
        mutationSignals: [],
        role: 'judgment',
        selectorValues: uniqueSorted([mode.workflowMode, ...(mode.aliases || [])]),
      });
    }
  }

  const keys = destinationMetadata.map((entry) => destinationKey(entry.id));
  if (new Set(keys).size !== keys.length) fail('DESTINATION_DUPLICATE', 'destination tuples must be unique');
  const byMode = new Map(destinationMetadata.map((entry) => (
    [`${entry.id.skillId}/${entry.id.workflowMode}`, entry]
  )));

  const detectors = [];
  const selectors = [];
  for (const destination of destinationMetadata) {
    const mode = {
      aliases: destination.selectorValues.slice(1),
      workflowMode: destination.id.workflowMode,
    };
    const rows = detectorRows(destination.role, mode);
    detectors.push(...rows);
    selectors.push({
      destinationId: destination.id,
      detectorIds: rows.map((row) => row.id),
      id: `selector:${destination.id.skillId}:${destination.id.workflowMode}`,
    });
    for (const [index, value] of destination.mutationSignals.entries()) {
      detectors.push({
        id: `detector:mutation:${destination.id.workflowMode}:${index}`,
        kind: 'exact',
        value,
      });
    }
  }
  detectors.push({ id: 'detector:negative:forbidden', kind: 'negative', value: 'forbidden' });

  const compositionRules = [];
  for (const [transportMode, judgmentSkillId] of Object.entries(pairing)) {
    const transport = byMode.get(`${hubRegistry.skill}/${transportMode}`);
    if (!transport || transport.role !== 'transport') {
      fail('PAIRING_TRANSPORT_INVALID', `pairing source is not a transport: ${transportMode}`);
    }
    const judgments = destinationMetadata.filter((entry) => (
      entry.id.skillId === judgmentSkillId && entry.role === 'judgment'
    ));
    if (judgments.length === 0) fail('PAIRING_JUDGMENT_EMPTY', judgmentSkillId);
    for (const judgment of judgments) {
      compositionRules.push({
        composeAfter: [{ dependentId: transport.id, predecessorId: judgment.id }],
        kind: 'orderedBundle',
        requiresAuthorityFrom: judgment.id,
        targetIds: [judgment.id, transport.id],
      });
    }
  }

  const authorityGraph = [];
  for (const destination of destinationMetadata) {
    if (!['actor', 'judgment'].includes(destination.role)) continue;
    authorityGraph.push({
      approverDestinationId: destination.id,
      fromAuthorityRef: destination.authorityRef,
      relation: 'approveBeforeCommit',
      toDestinationId: destination.id,
    });
  }
  for (const rule of compositionRules) {
    const judgment = byMode.get(
      `${rule.requiresAuthorityFrom.skillId}/${rule.requiresAuthorityFrom.workflowMode}`,
    );
    authorityGraph.push({
      approverDestinationId: judgment.id,
      fromAuthorityRef: judgment.authorityRef,
      relation: 'requiresAuthorityFrom',
      toDestinationId: rule.targetIds[1],
    });
  }

  const transports = destinationMetadata.filter((entry) => entry.role === 'transport');
  const rolloutRules = transports
    .filter((entry) => entry.effectClass !== 'read-only')
    .map((entry) => ({
      mutatingDestinationId: entry.id,
      readOnlyBeforeMutating: transports.map((transport) => transport.id),
    }));

  const destinationGraphBody = {
    activationGeneration,
    authorityGraph,
    compositionRules,
    destinations: destinationMetadata,
    detectors: detectors.sort((a, b) => a.id.localeCompare(b.id)),
    rolloutRules,
    schemaVersion: 'V1',
    selectionKinds: ['single', 'orderedBundle'],
    selectors: selectors.sort((a, b) => a.id.localeCompare(b.id)),
  };
  const graphHash = sha256(artifactBytes(destinationGraphBody));
  const destinationGraph = Object.freeze({ ...destinationGraphBody, graphHash });

  const sourceHashes = sourceDigestEntries(sourceBytes);
  const policyBody = {
    activationGeneration,
    authorityGraph: authorityGraph.map((edge) => ({
      fromAuthorityRef: edge.fromAuthorityRef,
      relation: edge.relation === 'requiresAuthorityFrom' ? 'approveBeforeCommit' : edge.relation,
      toDestinationId: edge.toDestinationId,
    })),
    compositionRules: compositionRules.map((rule) => ({ kind: rule.kind, targetIds: rule.targetIds })),
    destinations: destinationMetadata.map((entry) => ({
      authorityRef: entry.authorityRef,
      id: entry.id,
      mutatesWorkspace: entry.mutatesWorkspace,
      role: entry.role,
    })),
    detectors: destinationGraph.detectors.map(({ id, kind, value }) => ({ id, kind, value })),
    provenancePolicy: {
      kind: 'static',
      sourceHashes: uniqueSorted([...sourceHashes.map((entry) => entry.hash), graphHash]),
    },
    recoveryPolicy: { handoffHops: 0, ladder: ['defer', 'reject'], userTurns: 1 },
    schemaVersion: 'V1',
    selectors: destinationGraph.selectors,
    thresholdPolicy: { kind: 'exact-admission', thresholds: [] },
  };
  const basePolicyHash = computeBasePolicyHash(policyBody);
  const policyWithBase = { ...policyBody, basePolicyHash };
  const policy = Object.freeze({
    ...policyWithBase,
    effectivePolicyHash: computeEffectivePolicyHash(policyWithBase),
  });

  const advisorBody = {
    admissionLabels: ['positive-signal', 'exclude:forbidden', 'zero-or-ambiguous:defer'],
    aliases: uniqueSorted(hubRegistry.modes.flatMap((mode) => mode.aliases || [])),
    effectivePolicyHash: policy.effectivePolicyHash,
    eligibleModes: hubRegistry.modes.map((mode) => ({
      publicMode: mode.workflowMode,
      qualifiedId: `${hubRegistry.skill}/${mode.workflowMode}/${mode.packet}/${mode.packetKind}/${mode.backendKind}`,
      routingClass: mode.advisorRouting.routingClass,
    })),
    hubId: hubRegistry.skill,
    schemaVersion: 'V1',
  };
  const advisorProjection = Object.freeze({
    ...advisorBody,
    projectionHash: computeProjectionHash('AdvisorProjectionV1', advisorBody),
  });

  assertNoTransportApprover(destinationGraph);

  return Object.freeze({
    advisorProjection,
    destinationGraph,
    policy,
    sourceHashes,
  });
}

module.exports = {
  artifactBytes,
  assertNoTransportApprover,
  compileRegistry,
  destinationKey,
  extractMutationSignals,
  sha256,
};
