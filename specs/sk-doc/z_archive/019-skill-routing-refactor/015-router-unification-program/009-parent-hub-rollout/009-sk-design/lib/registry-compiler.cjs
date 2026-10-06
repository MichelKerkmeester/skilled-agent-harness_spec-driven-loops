// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ LIBRARY: REGISTRY-DRIVEN PARENT-HUB COMPILER (DESIGN HUB)                ║
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
} = require('../../../003-contract-schemas/lib/canonical.cjs');
const {
  destinationKey,
  qualifiedDestinationId,
  validateReferenceClosure,
} = require('../../../004-compiler-n1-shadow/compiler/compiler.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const PACKET_AUTHORITY = Object.freeze({
  workflow: Object.freeze({ role: 'actor', mutatesWorkspace: true }),
  surface: Object.freeze({ role: 'evidence', mutatesWorkspace: false }),
});

// The root router's intent table, restated from its prose section: which intent
// is owned by which workflow mode. VALUES and REVIEW share a mode on purpose,
// because they share its references; they stay separate intents because they
// load different ones. Keeping the ownership here (validated against both the
// registry and the leaf manifest) means a root-router row that points at a
// retired or renamed mode fails the build instead of silently routing there.
const INTENT_MODE_OWNERS = Object.freeze({
  VALUES: 'sk-design-fundamentals',
  REVIEW: 'sk-design-fundamentals',
  CHART: 'sk-design-chart',
  FLOWCHART: 'sk-design-diagram',
  EXTRACT: 'sk-design-md-generator',
});

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

function sha256(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

function compareText(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
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

function qualifiedAuthority(prefix, id) {
  return `authority:${prefix}:${qualifiedDestinationId(id)}`;
}

function extractFallbackChecklist(skillMarkdown) {
  const match = /UNKNOWN_FALLBACK_CHECKLIST\s*=\s*\[([\s\S]*?)\]/m.exec(skillMarkdown);
  if (!match) fail('FALLBACK_CHECKLIST_MISSING', 'fallback checklist is absent from authored skill');
  const items = [...match[1].matchAll(/["']([^"']+)["']/g)].map((entry) => entry[1]);
  if (items.length < 3) {
    fail('FALLBACK_CHECKLIST_INVALID', 'fallback checklist must contain at least three items');
  }
  return items;
}

function vocabularyByMode(registry, hubRouter) {
  const classes = hubRouter.vocabularyClasses || {};
  const signals = hubRouter.routerSignals || {};
  const raw = new Map();
  for (const mode of registry.modes) {
    const values = new Set([mode.workflowMode, ...(mode.aliases || [])]);
    for (const className of signals[mode.workflowMode]?.classes || []) {
      for (const keyword of classes[className]?.keywords || []) values.add(keyword);
    }
    raw.set(mode.workflowMode, [...values].map((value) => value.toLowerCase()));
  }
  const owners = new Map();
  for (const [mode, values] of raw) {
    for (const value of values) {
      if (!owners.has(value)) owners.set(value, new Set());
      owners.get(value).add(mode);
    }
  }
  return new Map([...raw].map(([mode, values]) => [
    mode,
    [...new Set(values.filter((value) => owners.get(value).size === 1))].sort(compareText),
  ]));
}

function buildDestinationGraph(registry) {
  const destinations = registry.modes.map((mode) => {
    const authority = PACKET_AUTHORITY[mode.packetKind];
    if (!authority) {
      fail('PACKET_KIND_UNSUPPORTED', `unsupported packet kind: ${String(mode.packetKind)}`);
    }
    const id = destinationId(registry.skill, mode);
    return {
      authorityRef: qualifiedAuthority(
        authority.role === 'actor' ? 'actor' : 'evidence-only',
        id,
      ),
      id,
      mutatesWorkspace: authority.mutatesWorkspace,
      role: authority.role,
    };
  });
  const keys = destinations.map((destination) => destinationKey(destination.id));
  if (new Set(keys).size !== keys.length) {
    fail('DESTINATION_DUPLICATE', 'destination compound identities must be unique');
  }
  return destinations;
}

function buildSelectors(registry, hubRouter, destinations) {
  const vocabulary = vocabularyByMode(registry, hubRouter);
  const byMode = new Map(destinations.map((destination) => [
    destination.id.workflowMode,
    destination,
  ]));
  const detectors = [];
  const selectors = [];
  for (const mode of registry.modes) {
    const destination = byMode.get(mode.workflowMode);
    const words = vocabulary.get(mode.workflowMode) || [];
    words.forEach((word, index) => {
      const detectorId = `detector:signal:${mode.workflowMode}:${index}`;
      detectors.push({ id: detectorId, kind: 'alias', value: word });
      selectors.push({
        destinationId: destination.id,
        detectorIds: [detectorId],
        id: `selector:${mode.workflowMode}:${index}`,
      });
    });
  }
  detectors.push({ id: 'detector:negative:forbidden', kind: 'negative', value: 'forbidden' });
  detectors.sort((left, right) => compareText(left.id, right.id));
  selectors.sort((left, right) => compareText(left.id, right.id));
  return { detectors, selectors, vocabulary };
}

// A bundle is `surfaceBundle` only when it carries exactly one actor alongside
// one or more evidence destinations (the decision contract's own definition).
// This hub declares every mode as a mutating workflow actor, so every multi-
// target tie here lands on `orderedBundle`, which carries no role restriction.
function bundleKindForModes(modeWorkflowModes, byMode) {
  const roles = modeWorkflowModes.map((mode) => byMode.get(mode).role);
  const actors = roles.filter((role) => role === 'actor').length;
  const evidence = roles.filter((role) => role === 'evidence').length;
  return (actors === 1 && evidence === roles.length - 1) ? 'surfaceBundle' : 'orderedBundle';
}

// Every non-empty two-or-more subset of the tie-break order, not just the
// authored shapes: a near-tied keyword score can legally land on any subset,
// so the router needs a valid, order-matching composition rule for each one,
// or decision parsing rejects a real tie.
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

// Union every keyword the hub-router assigns to a mode's classes, unfiltered
// by any cross-mode overlap. This mirrors the frozen legacy replay's own
// hub-router projection: each mode scores independently off its own keyword
// set, so a keyword shared by two modes still counts as a positive signal for
// both, never dropped the way the detector-vocabulary ownership filter below
// drops it.
function modeVocabulary(hubRouter, workflowMode) {
  const signal = hubRouter.routerSignals[workflowMode];
  const words = new Set();
  for (const className of signal.classes || []) {
    const vocabulary = hubRouter.vocabularyClasses[className];
    for (const keyword of (vocabulary && vocabulary.keywords) || []) {
      words.add(String(keyword).toLowerCase());
    }
  }
  return [...words].sort(compareText);
}

// Bundle targets for the bespoke routing model below, expressed as
// workflowMode strings so the router can look one up directly off a scored,
// ordered mode list without a destination round-trip.
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

// The bespoke, hub-specific routing model the compiled router scores against
// directly, rather than through the generic detector/selector evaluator. It
// sits alongside the generic policy (which still carries the authority graph,
// composition rules, and hashing) instead of replacing it. The second-stage
// intent model rides inside it: the canary scores mode signals and intent
// signals from one structure, so the two stages can never drift apart.
function buildRoutingModel(registry, hubRouter, destinations, intentEntries) {
  const byMode = new Map(destinations.map((destination) => [destination.id.workflowMode, destination]));
  const modes = registry.modes.map((mode) => {
    const signal = hubRouter.routerSignals[mode.workflowMode];
    return {
      command: mode.command,
      destinationId: byMode.get(mode.workflowMode).id,
      keywords: modeVocabulary(hubRouter, mode.workflowMode),
      weight: signal.weight,
      workflowMode: mode.workflowMode,
    };
  });
  return {
    ambiguityDelta: hubRouter.routerPolicy.ambiguityDelta,
    bundleRules: buildBundleRules(hubRouter.routerPolicy.tieBreak, destinations),
    defaultMode: hubRouter.routerPolicy.defaultMode,
    intents: intentEntries,
    modes,
    outcomes: hubRouter.routerPolicy.outcomes,
    tieBreak: [...hubRouter.routerPolicy.tieBreak],
  };
}

function buildAuthorityGraph(destinations) {
  return destinations.map((destination) => ({
    fromAuthorityRef: destination.authorityRef,
    relation: destination.role === 'actor' ? 'approveBeforeCommit' : 'evidenceOnly',
    toDestinationId: destination.id,
  }));
}

function sourceDigests(sourceBytes) {
  const entries = Object.entries(sourceBytes).map(([sourceId, bytes]) => ({
    hash: sha256(bytes),
    sourceId,
  }));
  entries.sort((left, right) => compareText(left.sourceId, right.sourceId));
  return entries;
}

function assertSourceIdentity(input) {
  const registryBytes = input.sourceBytes?.['mode-registry.json'];
  const routerBytes = input.sourceBytes?.['hub-router.json'];
  const skillBytes = input.sourceBytes?.['SKILL.md'];
  const rootRouterBytes = input.sourceBytes?.['ROUTER.md'];
  if (!Buffer.isBuffer(registryBytes)
    || !Buffer.isBuffer(routerBytes)
    || !Buffer.isBuffer(skillBytes)
    || !Buffer.isBuffer(rootRouterBytes)) {
    fail('AUTHORED_SOURCE_BYTES_MISSING', 'all authored source bytes must be supplied');
  }
  let parsedRegistry;
  let parsedRouter;
  try {
    parsedRegistry = JSON.parse(registryBytes.toString('utf8'));
    parsedRouter = JSON.parse(routerBytes.toString('utf8'));
  } catch (error) {
    fail('AUTHORED_SOURCE_BYTES_INVALID', `authored JSON bytes are invalid: ${error.message}`);
  }
  if (canonicalize(parsedRegistry) !== canonicalize(input.registry)
    || canonicalize(parsedRouter) !== canonicalize(input.hubRouter)
    || skillBytes.toString('utf8') !== input.skillMarkdown
    || rootRouterBytes.toString('utf8') !== input.routerMarkdown) {
    fail('AUTHORED_SOURCE_IDENTITY_MISMATCH', 'parsed inputs do not match hashed authored bytes');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. ROOT-ROUTER INTENT LAYER
// ─────────────────────────────────────────────────────────────────────────────

// Parse the machine-readable root-router block. That block is the
// byte-for-byte deterministic replay source, written as quoted-key, quoted-
// string Python literals with no calls or f-strings, so a strict regex parse
// of the two dictionaries is sufficient and keeps the parser independent of
// any Python runtime.
function parseIntentLayer(routerMarkdown) {
  const signalsBlock = /INTENT_SIGNALS\s*=\s*\{([\s\S]*?)\n\}/m.exec(routerMarkdown);
  if (!signalsBlock) fail('ROOT_ROUTER_INTENTS_MISSING', 'the intent signals block is absent from the root router');
  const intents = [];
  const entryPattern = /"([A-Z]+)":\s*\{\s*"weight":\s*(\d+)\s*,\s*"keywords":\s*\[([^\]]*)\]/g;
  for (const match of signalsBlock[1].matchAll(entryPattern)) {
    const keywords = [...match[3].matchAll(/"([^"]+)"/g)].map((entry) => entry[1]);
    if (keywords.length === 0) {
      fail('ROOT_ROUTER_INTENT_EMPTY', `intent ${match[1]} carries no keywords`);
    }
    intents.push({ intent: match[1], keywords, weight: Number(match[2]) });
  }
  if (intents.length === 0) fail('ROOT_ROUTER_INTENTS_EMPTY', 'no intent entries parsed from the root router');

  const mapBlock = /RESOURCE_MAP\s*=\s*\{([\s\S]*?)\n\}/m.exec(routerMarkdown);
  if (!mapBlock) fail('ROOT_ROUTER_RESOURCE_MAP_MISSING', 'the resource map block is absent from the root router');
  const resourcePaths = new Map();
  const rowPattern = /"([A-Z]+)":\s*\[([^\]]*)\]/g;
  for (const match of mapBlock[1].matchAll(rowPattern)) {
    resourcePaths.set(match[1], [...match[2].matchAll(/"([^"]+)"/g)].map((entry) => entry[1]));
  }
  return { intents, resourcePaths };
}

// Resolve every intent's resource-map rows into typed (workflowMode,
// leafResourceId) pairs through the declared leaf manifest, and fail the build
// when a root-router row cannot be closed: the manifest must name the leaf
// inside the owning mode's packet, and the owning mode must be a registered
// workflow mode. This is the closure guarantee the two-stage contract needs:
// a route decision from this hub can only ever name leaves that resolve.
function resolveIntentLayer(intents, resourcePaths, registry, leafManifest) {
  const byMode = new Map(registry.modes.map((mode) => [mode.workflowMode, mode]));
  const leafGroups = new Map((leafManifest.modes || []).map((group) => [group.workflowMode, group]));
  const entries = [];
  const manifestResources = [];
  for (const intent of intents) {
    const owner = INTENT_MODE_OWNERS[intent.intent];
    if (!owner) fail('ROOT_ROUTER_INTENT_INVALID', `intent ${intent.intent} has no owning mode in the hub contract`);
    if (!byMode.has(owner)) fail('ROOT_ROUTER_OWNERSHIP_MISMATCH', `intent ${intent.intent} owner ${owner} is not a registered mode`);
    const paths = resourcePaths.get(intent.intent);
    if (!paths || paths.length === 0) fail('ROOT_ROUTER_LEAVES_MISSING', `intent ${intent.intent} maps no leaf resources`);
    const group = leafGroups.get(owner);
    if (!group) fail('ROOT_ROUTER_LEAF_UNRESOLVED', `no leaf manifest group for ${owner}`);
    const leafPairs = [];
    for (const resourcePath of paths) {
      const separator = resourcePath.indexOf('/');
      if (separator < 0) fail('ROOT_ROUTER_LEAF_UNRESOLVED', `resource path is not packet-qualified: ${resourcePath}`);
      const packet = resourcePath.slice(0, separator);
      const leaf = resourcePath.slice(separator + 1);
      if (packet !== group.packet) {
        fail('ROOT_ROUTER_OWNERSHIP_MISMATCH', `resource ${resourcePath} lives under ${packet}, but the owning packet of ${owner} is ${group.packet}`);
      }
      if (!group.leaves.includes(leaf)) {
        fail('ROOT_ROUTER_LEAF_UNRESOLVED', `leaf ${leaf} is absent from the declared manifest of ${owner}`);
      }
      leafPairs.push({ leafResourceId: leaf, workflowMode: owner });
      manifestResources.push({ leafResourceId: leaf, resource: resourcePath, workflowMode: owner });
    }
    entries.push({ intent: intent.intent, keywords: intent.keywords, leafPairs, mode: owner, weight: intent.weight });
  }
  return { entries, manifestResources };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. COMPILER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compile the design hub's routing contract without trusting destination-local
 * role claims, and resolve the root router's intent layer against the declared
 * leaf manifest in the same pass, so one compilation both hashes the authored
 * sources and proves the two-stage closure.
 *
 * @param {Object} input - Authored registry, routers, skill text, leaf
 *   manifest, and generation.
 * @returns {Object} Compiled snapshot plus read-only projections and source
 *   model.
 */
function compileRegistry(input) {
  assertObject(input, 'compiler input');
  assertObject(input.registry, 'mode registry');
  assertObject(input.hubRouter, 'hub router');
  assertObject(input.leafManifest, 'leaf manifest');
  assertString(input.registry.skill, 'mode registry skill');
  assertString(input.routerMarkdown, 'root router markdown');
  if (!Array.isArray(input.registry.modes) || input.registry.modes.length === 0) {
    fail('AUTHORED_INPUT_INVALID', 'mode registry must declare modes');
  }
  if (!Number.isSafeInteger(input.activationGeneration) || input.activationGeneration < 1) {
    fail('AUTHORED_INPUT_INVALID', 'activation generation must be a positive integer');
  }
  assertSourceIdentity(input);
  const sourceHashes = sourceDigests(input.sourceBytes);
  const destinations = buildDestinationGraph(input.registry);
  const selection = buildSelectors(input.registry, input.hubRouter, destinations);
  const intentLayer = parseIntentLayer(input.routerMarkdown);
  const resolved = resolveIntentLayer(intentLayer.intents, intentLayer.resourcePaths, input.registry, input.leafManifest);
  const policyBody = {
    activationGeneration: input.activationGeneration,
    authorityGraph: buildAuthorityGraph(destinations),
    compositionRules: buildCompositionRules(destinations, input.hubRouter.routerPolicy.tieBreak),
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

  const aliases = input.registry.modes.flatMap((mode) => (
    (mode.aliases || []).map((alias) => ({ alias, workflowMode: mode.workflowMode }))
  )).sort((left, right) => compareText(left.alias, right.alias));
  const advisorProjection = {
    admissionLabels: ['positive-signal', 'exclude:forbidden'],
    aliases: [...new Set(aliases.map((entry) => entry.alias))].sort(compareText),
    effectivePolicyHash: policy.effectivePolicyHash,
    eligibleModes: policy.destinations
      .filter((destination) => destination.role === 'actor')
      .map((destination) => ({
        publicMode: destination.id.workflowMode,
        qualifiedId: qualifiedDestinationId(destination.id),
        routingClass: 'metadata',
      })),
    hubId: input.registry.skill,
    schemaVersion: 'V1',
  };
  advisorProjection.projectionHash = computeProjectionHash(
    'AdvisorProjectionV1',
    advisorProjection,
  );

  const routingModel = buildRoutingModel(input.registry, input.hubRouter, destinations, resolved.entries);

  return Object.freeze({
    advisorProjection: Object.freeze(advisorProjection),
    aliases: Object.freeze(aliases),
    fallbackChecklist: Object.freeze(extractFallbackChecklist(input.skillMarkdown)),
    intentModel: Object.freeze({ entries: Object.freeze(resolved.entries.map((entry) => Object.freeze(entry))) }),
    manifestResources: Object.freeze(resolved.manifestResources.map((entry) => Object.freeze(entry))),
    policy: Object.freeze(policy),
    routingModel: Object.freeze(routingModel),
    sourceHashes: Object.freeze(sourceHashes),
    vocabulary: selection.vocabulary,
  });
}

/**
 * Encode a compiled artifact through the frozen canonical serializer.
 *
 * @param {Object} value - JSON-compatible artifact.
 * @returns {Buffer} Canonical bytes with one terminal newline.
 */
function artifactBytes(value) {
  return Buffer.from(`${canonicalize(value)}\n`, 'utf8');
}

module.exports = {
  artifactBytes,
  compileRegistry,
  sha256,
};
