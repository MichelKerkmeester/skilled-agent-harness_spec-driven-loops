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

// mcp-tooling's live routing vocabulary lives in hub-router.json (weighted
// routerSignals classes over vocabularyClasses), not in mode-registry.json's
// sparse advisor-facing `aliases` list. This is the same projection the
// frozen legacy replay (router-replay.cjs's projectHubRouter) reads, so it is
// the single vocabulary source both the metadata graph below and the live
// scorer (router.cjs) read -- no second, independently-drifting keyword list.
function modeVocabulary(hubRouter, workflowMode) {
  const signal = hubRouter.routerSignals[workflowMode];
  const words = new Set();
  for (const className of signal.classes || []) {
    const vocabulary = hubRouter.vocabularyClasses[className];
    for (const keyword of (vocabulary && vocabulary.keywords) || []) {
      words.add(String(keyword).toLowerCase());
    }
  }
  return [...words].sort();
}

function detectorRows(prefix, workflowMode, values) {
  return uniqueSorted(values)
    .map((value, index) => ({
      id: `detector:${prefix}:${workflowMode}:${index}`,
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

// A same-hub tie can only ever be `surfaceBundle` when it carries exactly one
// actor-role target alongside one-or-more evidence-role targets (the shared
// decision-contract's own definition, 002-decision-evaluator/lib/evaluator.cjs
// isValidPolicy). mcp-tooling declares no evidence-role destination of its own
// (its modes are actor/transport only), so this always resolves orderedBundle
// here -- computed generically, like sk-design/sk-code's registry-compiler,
// rather than hardcoded, so the rule stays correct if that ever changes.
function bundleKindForModes(workflowModes, byMode) {
  const roles = workflowModes.map((mode) => byMode.get(mode).role);
  const actors = roles.filter((role) => role === 'actor').length;
  const evidence = roles.filter((role) => role === 'evidence').length;
  return (actors === 1 && evidence === roles.length - 1) ? 'surfaceBundle' : 'orderedBundle';
}

// Every non-empty two-or-more subset of the tie-break order: a near-tied
// keyword score can legally land on any subset, so the router needs a valid,
// order-matching composition rule for each one, or parseRouteDecision's
// BUNDLE_NOT_IN_POLICY check rejects a real tie (mirrors sk-design/sk-code's
// registry-compiler; destinationId-object shape for the hashed policy).
function buildCompositionRules(destinations, tieBreak) {
  const byMode = new Map(destinations.map((destination) => [destination.id.workflowMode, destination]));
  const modes = [...tieBreak];
  const rules = [];
  for (let mask = 1; mask < (1 << modes.length); mask += 1) {
    const bits = [];
    for (let index = 0; index < modes.length; index += 1) {
      if (mask & (1 << index)) bits.push(modes[index]);
    }
    if (bits.length < 2) continue;
    rules.push({
      kind: bundleKindForModes(bits, byMode),
      targetIds: bits.map((mode) => byMode.get(mode).id),
    });
  }
  return rules;
}

// Same enumeration as buildCompositionRules, keyed by workflowMode string
// instead of destinationId object, so the live router can look a near-tied,
// tie-break-ordered score set up directly without a destination round-trip.
function buildBundleRules(tieBreak, destinations) {
  const byMode = new Map(destinations.map((destination) => [destination.id.workflowMode, destination]));
  const modes = [...tieBreak];
  const rules = [];
  for (let mask = 1; mask < (1 << modes.length); mask += 1) {
    const bits = [];
    for (let index = 0; index < modes.length; index += 1) {
      if (mask & (1 << index)) bits.push(modes[index]);
    }
    if (bits.length < 2) continue;
    rules.push({ kind: bundleKindForModes(bits, byMode), targetWorkflowModes: bits });
  }
  return rules;
}

// The bespoke, hub-specific routing model the live router (router.cjs) scores
// against directly (mirrors sk-design's and sk-code's registry-compiler
// buildRoutingModel). This sits alongside the generic destinationGraph/policy
// below rather than replacing it: the policy still carries the authority
// graph, composition rules, and hashing that policy-card.cjs and the
// projector read.
function buildRoutingModel(hubRegistry, hubRouter, destinations) {
  const byMode = new Map(destinations.map((destination) => [destination.id.workflowMode, destination]));
  const modes = hubRegistry.modes.map((mode) => ({
    destinationId: byMode.get(mode.workflowMode).id,
    keywords: modeVocabulary(hubRouter, mode.workflowMode),
    weight: hubRouter.routerSignals[mode.workflowMode].weight,
    workflowMode: mode.workflowMode,
  }));
  return {
    ambiguityDelta: hubRouter.routerPolicy.ambiguityDelta,
    bundleRules: buildBundleRules(hubRouter.routerPolicy.tieBreak, destinations),
    defaultMode: hubRouter.routerPolicy.defaultMode,
    modes,
    outcomes: hubRouter.routerPolicy.outcomes,
    tieBreak: [...hubRouter.routerPolicy.tieBreak],
  };
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

  const hubRouterBytes = sourceBytes['mcp-tooling/hub-router.json'];
  if (!hubRouterBytes) fail('SOURCE_BYTES_MISSING', 'mcp-tooling/hub-router.json bytes are required');
  let hubRouter;
  try {
    hubRouter = JSON.parse(hubRouterBytes.toString('utf8'));
  } catch (error) {
    fail('SOURCE_JSON_INVALID', `mcp-tooling/hub-router.json: ${error.message}`);
  }

  // The transport axis' cross-hub judgment pairing stays an authored, hashed
  // input (its byte-identity is still validated below), but it no longer
  // contributes a live composition rule or destination. The frozen legacy
  // replay (router-replay.cjs) scores mcp-tooling's own hub-router.json
  // vocabulary only and has no cross-hub concept at all, so a compiled bundle
  // built from this pairing could add a target legacy never routes -- exactly
  // how MT-008 over-routed sk-design's md-generator alongside mcp-refero.
  // Kept here purely for provenance hashing and input-integrity checking.
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
      vocabulary: modeVocabulary(hubRouter, mode.workflowMode),
    });
  }

  const keys = destinationMetadata.map((entry) => destinationKey(entry.id));
  if (new Set(keys).size !== keys.length) fail('DESTINATION_DUPLICATE', 'destination tuples must be unique');

  const detectors = [];
  const selectors = [];
  for (const destination of destinationMetadata) {
    const rows = detectorRows(destination.role, destination.id.workflowMode, destination.vocabulary);
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

  // Same-hub bundle rules only (see buildCompositionRules) -- the cross-hub
  // judgment pairing above no longer contributes a composition rule.
  const compositionRules = buildCompositionRules(destinationMetadata, hubRouter.routerPolicy.tieBreak);

  // Only an actor-role destination self-approves; a transport never holds
  // commit authority (assertRoutePolicy's own
  // POLICY_NON_ACTOR_COMMIT_AUTHORITY_FORBIDDEN guard), and with the
  // cross-hub judgment pairing no longer feeding a composition rule, no other
  // edge exists for a transport destination.
  const authorityGraph = [];
  for (const destination of destinationMetadata) {
    if (destination.role !== 'actor') continue;
    authorityGraph.push({
      approverDestinationId: destination.id,
      fromAuthorityRef: destination.authorityRef,
      relation: 'approveBeforeCommit',
      toDestinationId: destination.id,
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
      relation: edge.relation,
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

  const routingModel = Object.freeze(buildRoutingModel(hubRegistry, hubRouter, destinationMetadata));

  assertNoTransportApprover(destinationGraph);

  return Object.freeze({
    advisorProjection,
    destinationGraph,
    policy,
    routingModel,
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
