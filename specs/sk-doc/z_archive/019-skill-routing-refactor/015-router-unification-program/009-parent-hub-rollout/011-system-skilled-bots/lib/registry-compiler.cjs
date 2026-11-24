'use strict';

const crypto = require('node:crypto');

const {
  canonicalize,
  computeBasePolicyHash,
  computeEffectivePolicyHash,
  computeProjectionHash,
} = require('../../../003-contract-schemas/lib/canonical.cjs');
const { ORDERED_KEYWORD_PREFIX, promptWords } = require('./router.cjs');

const HUB_ID = 'system-skilled-bots';
const REGISTRY_SOURCE = `${HUB_ID}/mode-registry.json`;
const ROUTER_SOURCE = `${HUB_ID}/hub-router.json`;
const SKILL_SOURCE = `${HUB_ID}/SKILL.md`;

// Every bots mode is a workflow packet that acts through its own tool surface,
// writing a bot definition or calling the bots runtime, so each one is an actor
// that holds its own commit authority.
const ROLE_BY_PACKET_KIND = Object.freeze({
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

function parseSourceJson(sourceBytes, sourceId) {
  const bytes = sourceBytes[sourceId];
  if (!bytes) fail('SOURCE_BYTES_MISSING', `${sourceId} bytes are required`);
  try {
    return JSON.parse(bytes.toString('utf8'));
  } catch (error) {
    return fail('SOURCE_JSON_INVALID', `${sourceId}: ${error.message}`);
  }
}

function assertParsedIdentity(sourceBytes, sourceId, parsed) {
  if (canonicalize(parseSourceJson(sourceBytes, sourceId)) !== canonicalize(parsed)) {
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

// The live routing vocabulary lives in hub-router.json (weighted routerSignals
// classes over vocabularyClasses), not in mode-registry.json's sparse
// advisor-facing aliases. Both the metadata graph and the live scorer read this
// one projection, so no second keyword list can drift from the authored one.
// Discovery-only classes are never referenced by a routerSignal, so they never
// reach a mode's vocabulary and a discovery-only prompt scores zero modes.
function modeVocabulary(hubRouter, workflowMode) {
  const signal = hubRouter.routerSignals[workflowMode];
  if (!signal) fail('ROUTER_SIGNAL_MISSING', `no routerSignals entry for ${workflowMode}`);
  const words = new Set();
  for (const className of signal.classes || []) {
    const vocabulary = hubRouter.vocabularyClasses[className];
    if (!vocabulary) fail('VOCABULARY_CLASS_MISSING', `${workflowMode} names unknown class ${className}`);
    for (const keyword of vocabulary.keywords || []) {
      words.add(vocabularyKeyword(keyword, className));
    }
  }
  return [...words].sort();
}

// A plain keyword is only lower-cased, exactly as before ordered keywords
// existed. An ordered keyword is stored as its prefix and its words joined by
// single spaces, so two spellings of one word list compile to the same
// detectors and graph hash. The policy hash still differs, because it also
// covers the source bytes. It needs two words, because one word has no order.
// Words are counted with the router's own tokenizer, so punctuation the router
// drops cannot pass here as a second word and serve as a one-word keyword.
function vocabularyKeyword(keyword, className) {
  const value = String(keyword).toLowerCase();
  if (!value.trim().startsWith(ORDERED_KEYWORD_PREFIX)) return value;
  const words = promptWords(value.trim().slice(ORDERED_KEYWORD_PREFIX.length));
  if (words.length < 2) {
    fail('ORDERED_KEYWORD_INVALID', `${className}: ordered keyword ${JSON.stringify(String(keyword))} needs at least two words`);
  }
  return `${ORDERED_KEYWORD_PREFIX}${words.join(' ')}`;
}

function detectorRows(prefix, workflowMode, values) {
  return uniqueSorted(values)
    .map((value, index) => ({
      id: `detector:${prefix}:${workflowMode}:${index}`,
      kind: 'alias',
      value: String(value).toLowerCase(),
    }));
}

// A same-hub tie is a surfaceBundle only with exactly one actor target beside
// one or more evidence targets. Every bots mode is an actor, so a tie here
// always resolves orderedBundle; the kind is still derived from roles so the
// rule stays correct if a mode's role ever changes.
function bundleKindForModes(workflowModes, byMode) {
  const roles = workflowModes.map((mode) => byMode.get(mode).role);
  const actors = roles.filter((role) => role === 'actor').length;
  const evidence = roles.filter((role) => role === 'evidence').length;
  return (actors === 1 && evidence === roles.length - 1) ? 'surfaceBundle' : 'orderedBundle';
}

// Every subset of two or more modes of the tie-break order, because a near-tied
// keyword score can land on any of them and the decision contract rejects a
// bundle that has no matching composition rule.
function tieBreakSubsets(tieBreak) {
  const modes = [...tieBreak];
  const subsets = [];
  for (let mask = 1; mask < (1 << modes.length); mask += 1) {
    const bits = [];
    for (let index = 0; index < modes.length; index += 1) {
      if (mask & (1 << index)) bits.push(modes[index]);
    }
    if (bits.length >= 2) subsets.push(bits);
  }
  return subsets;
}

function buildCompositionRules(destinations, tieBreak) {
  const byMode = new Map(destinations.map((destination) => [destination.id.workflowMode, destination]));
  return tieBreakSubsets(tieBreak).map((bits) => ({
    kind: bundleKindForModes(bits, byMode),
    targetIds: bits.map((mode) => byMode.get(mode).id),
  }));
}

// The same enumeration keyed by workflowMode, so the live router can look a
// near-tied, tie-break-ordered score set up without a destination round-trip.
function buildBundleRules(destinations, tieBreak) {
  const byMode = new Map(destinations.map((destination) => [destination.id.workflowMode, destination]));
  return tieBreakSubsets(tieBreak).map((bits) => ({
    kind: bundleKindForModes(bits, byMode),
    targetWorkflowModes: bits,
  }));
}

function assertTieBreakCoversModes(hubRegistry, tieBreak) {
  const declared = hubRegistry.modes.map((mode) => mode.workflowMode).sort();
  const ordered = [...tieBreak].sort();
  if (canonicalize(declared) !== canonicalize(ordered)) {
    fail('TIE_BREAK_MISMATCH', 'routerPolicy.tieBreak must list every declared mode exactly once');
  }
}

// The hub-specific routing model the live router scores against directly. The
// generic policy below still carries the authority graph, composition rules and
// hashing that the policy card and the projector read.
// Each blocker is one word as the router tokenizes the prompt, because the
// router compares it against single prompt words. A phrase or a punctuated
// entry would never match and would silently block nothing.
function orderedKeywordBlockers(routerPolicy) {
  const values = routerPolicy.orderedKeywordBlockers || [];
  if (!Array.isArray(values)) {
    fail('ORDERED_KEYWORD_BLOCKER_INVALID', 'routerPolicy.orderedKeywordBlockers must be an array of words');
  }
  return uniqueSorted(values.map((value) => {
    const words = promptWords(String(value));
    if (words.length !== 1 || words[0] !== String(value).trim().toLowerCase()) {
      fail('ORDERED_KEYWORD_BLOCKER_INVALID', `ordered keyword blocker ${JSON.stringify(String(value))} must be one word`);
    }
    return words[0];
  }));
}

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
    bundleRules: buildBundleRules(destinations, hubRouter.routerPolicy.tieBreak),
    defaultMode: hubRouter.routerPolicy.defaultMode,
    modes,
    orderedKeywordBlockers: orderedKeywordBlockers(hubRouter.routerPolicy),
    outcomes: hubRouter.routerPolicy.outcomes,
    tieBreak: [...hubRouter.routerPolicy.tieBreak],
  };
}

function compileRegistry(input) {
  const {
    activationGeneration,
    hubRegistry,
    hubSkillMarkdown,
    sourceBytes,
  } = input;
  if (!Number.isSafeInteger(activationGeneration) || activationGeneration < 1) {
    fail('ACTIVATION_GENERATION_INVALID', 'activation generation must be positive');
  }
  if (!hubRegistry || !Array.isArray(hubRegistry.modes)) {
    fail('REGISTRY_INVALID', 'hub registry modes are required');
  }
  if (hubRegistry.skill !== HUB_ID) fail('REGISTRY_INVALID', `registry skill must be ${HUB_ID}`);
  assertParsedIdentity(sourceBytes, REGISTRY_SOURCE, hubRegistry);
  assertTextIdentity(sourceBytes, SKILL_SOURCE, hubSkillMarkdown);
  const hubRouter = parseSourceJson(sourceBytes, ROUTER_SOURCE);
  assertTieBreakCoversModes(hubRegistry, hubRouter.routerPolicy.tieBreak);

  const destinationMetadata = hubRegistry.modes.map((mode) => {
    const role = ROLE_BY_PACKET_KIND[mode.packetKind];
    if (!role) fail('PACKET_KIND_UNSUPPORTED', `unsupported packet kind: ${mode.packetKind}`);
    const id = destinationId(hubRegistry, mode);
    const mutatesWorkspace = Boolean(mode.toolSurface?.mutatesWorkspace);
    return {
      authorityRef: authorityRef(role, id),
      effectClass: mutatesWorkspace ? 'workspace-mutation-capable' : 'read-only',
      id,
      mutatesWorkspace,
      role,
      vocabulary: modeVocabulary(hubRouter, mode.workflowMode),
    };
  });

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
  }
  detectors.push({ id: 'detector:negative:forbidden', kind: 'negative', value: 'forbidden' });

  const compositionRules = buildCompositionRules(destinationMetadata, hubRouter.routerPolicy.tieBreak);

  // Each actor approves its own commit; no mode supplies authority for another.
  const authorityGraph = destinationMetadata.map((destination) => ({
    approverDestinationId: destination.id,
    fromAuthorityRef: destination.authorityRef,
    relation: 'approveBeforeCommit',
    toDestinationId: destination.id,
  }));

  const destinationGraphBody = {
    activationGeneration,
    authorityGraph,
    compositionRules,
    destinations: destinationMetadata,
    detectors: detectors.sort((a, b) => a.id.localeCompare(b.id)),
    rolloutRules: [],
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

  return Object.freeze({
    advisorProjection,
    destinationGraph,
    policy,
    routingModel,
    sourceHashes,
  });
}

module.exports = {
  HUB_ID,
  REGISTRY_SOURCE,
  ROUTER_SOURCE,
  SKILL_SOURCE,
  artifactBytes,
  compileRegistry,
  destinationKey,
  sha256,
};
