// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ LIBRARY: REGISTRY-DRIVEN PARENT-HUB COMPILER                            ║
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

const SURFACE_DETECTION_ROLES = Object.freeze(['specific', 'fallback']);
const SURFACE_MARKER_KEYS = Object.freeze(['pathMarkers', 'fileMarkers', 'contentMarkers']);
const QUALITY_BLOCK_KEYS = Object.freeze(['checklists']);
const QUALITY_SELECTOR_KEYS = Object.freeze(['paths', 'extensions', 'contentMarkers']);

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

function nonEmptySubsets(values) {
  const subsets = [];
  for (let mask = 1; mask < (1 << values.length); mask += 1) {
    subsets.push(values.filter((_, index) => Boolean(mask & (1 << index))));
  }
  return subsets;
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
// one or more evidence destinations (the decision-contract's own definition
// in 005-decision-evaluator/lib/evaluator.cjs's isValidPolicy). Every other
// multi-target tie (two-or-more actors, or evidence with no actor at all) is
// `orderedBundle`, which carries no role restriction.
function bundleKindForModes(modeWorkflowModes, byMode) {
  const roles = modeWorkflowModes.map((mode) => byMode.get(mode).role);
  const actors = roles.filter((role) => role === 'actor').length;
  const evidence = roles.filter((role) => role === 'evidence').length;
  return (actors === 1 && evidence === roles.length - 1) ? 'surfaceBundle' : 'orderedBundle';
}

// Every non-empty two-or-more subset of the tie-break order (not just the
// authored actor-plus-evidence-subset shapes): a near-tied keyword score can
// legally land on any subset — two actors, evidence alone, or a mixed set —
// so the router needs a valid, order-matching composition rule for each one,
// or parseRouteDecision's BUNDLE_NOT_IN_POLICY check rejects a real tie.
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
// hub-router projection exactly (router-replay.cjs's projectHubRouter): each
// mode scores independently off its own keyword set, so a keyword shared by
// two modes (e.g. a hub-identity term) still counts as a positive signal for
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
// workflowMode strings (not destinationId objects) so the router can look one
// up directly off a scored, ordered mode list without a destination round-trip.
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

// Surface detection tries specific surfaces before the one fallback, so the
// fallback must never outrank another surface. That holds only when exactly one
// surface declares the fallback role and the tie-break order ranks it last,
// which is what a keyword tie between two surfaces falls back to. A hub with no
// surface packets has nothing to detect and passes.
function validateSurfaceDetection(registry, hubRouter) {
  const surfaces = registry.modes.filter((mode) => mode.packetKind === 'surface');
  const declared = [];
  for (const mode of registry.modes) {
    const block = mode.surfaceDetection;
    if (block === undefined) continue;
    const label = `${mode.workflowMode} surfaceDetection`;
    if (mode.packetKind !== 'surface') {
      fail('SURFACE_DETECTION_INVALID', `${label} is declared on a ${String(mode.packetKind)} mode, not a surface`);
    }
    assertObject(block, label);
    assertString(block.label, `${label}.label`);
    if (!SURFACE_DETECTION_ROLES.includes(block.role)) {
      fail('SURFACE_DETECTION_INVALID', `${label}.role must be one of ${SURFACE_DETECTION_ROLES.join(', ')}`);
    }
    let markerCount = 0;
    for (const key of SURFACE_MARKER_KEYS) {
      if (block[key] === undefined) continue;
      if (!Array.isArray(block[key])) fail('SURFACE_DETECTION_INVALID', `${label}.${key} must be an array`);
      block[key].forEach((marker, index) => assertString(marker, `${label}.${key}[${index}]`));
      markerCount += block[key].length;
    }
    if (markerCount === 0) fail('SURFACE_DETECTION_INVALID', `${label} declares no markers`);
    declared.push({ label: block.label.toUpperCase(), role: block.role, workflowMode: mode.workflowMode });
  }
  if (surfaces.length === 0) return declared;
  const labels = declared.map((entry) => entry.label);
  if (new Set(labels).size !== labels.length) {
    fail('SURFACE_DETECTION_INVALID', 'surfaceDetection labels must be unique');
  }
  const fallbacks = declared.filter((entry) => entry.role === 'fallback');
  if (fallbacks.length !== 1) {
    fail('SURFACE_FALLBACK_INVALID', `a hub with surface packets declares exactly one fallback surface, found ${fallbacks.length}`);
  }
  const tieBreak = hubRouter.routerPolicy.tieBreak;
  if (tieBreak[tieBreak.length - 1] !== fallbacks[0].workflowMode) {
    fail('SURFACE_FALLBACK_INVALID', `fallback surface ${fallbacks[0].workflowMode} must be last in routerPolicy.tieBreak`);
  }
  return declared;
}

// A surface declares the checklists that apply to its files, and the quality runner
// loads every one it names. A malformed row would load nothing or the wrong file
// without any error, so the compiler refuses it here. A block carries checklists
// only, never a command, because commands come only from the repository.
function failQuality(label, message) {
  fail('QUALITY_DECLARATION_INVALID', `${label} ${message}`);
}

function validateQualitySelector(row, key, label) {
  if (row[key] === undefined) return 0;
  if (!Array.isArray(row[key]) || row[key].length === 0) failQuality(label, `${key} must be a non-empty array`);
  row[key].forEach((value, index) => {
    if (typeof value !== 'string' || !/\S/.test(value)) failQuality(label, `${key}[${index}] must be a non-empty string`);
    if (key === 'extensions' && !/^\.[^./\s]+$/.test(value)) failQuality(label, `${key}[${index}] must start with a dot`);
  });
  return 1;
}

function validateQualityDeclarations(registry) {
  for (const mode of registry.modes) {
    const block = mode.quality;
    if (block === undefined) continue;
    const label = `${mode.workflowMode} quality`;
    if (mode.packetKind !== 'surface') failQuality(label, `is declared on a ${String(mode.packetKind)} mode, not a surface`);
    if (!block || typeof block !== 'object' || Array.isArray(block)) failQuality(label, 'must be an object');
    const unknown = Object.keys(block).filter((key) => !QUALITY_BLOCK_KEYS.includes(key));
    if (unknown.length > 0) failQuality(label, `holds unknown key ${unknown.join(', ')}`);
    if (!Array.isArray(block.checklists) || block.checklists.length === 0) failQuality(label, 'checklists must be a non-empty array');
    block.checklists.forEach((row, index) => {
      const rowLabel = `${label}.checklists[${index}]`;
      if (!row || typeof row !== 'object' || Array.isArray(row)) failQuality(rowLabel, 'must be an object');
      const extra = Object.keys(row).filter((key) => key !== 'file' && !QUALITY_SELECTOR_KEYS.includes(key));
      if (extra.length > 0) failQuality(rowLabel, `holds unknown key ${extra.join(', ')}`);
      const selectors = QUALITY_SELECTOR_KEYS.reduce((count, key) => count + validateQualitySelector(row, key, rowLabel), 0);
      if (selectors === 0) failQuality(rowLabel, `names no selector, one of ${QUALITY_SELECTOR_KEYS.join(', ')}`);
      const file = row.file;
      if (typeof file !== 'string' || !/\.md$/.test(file) || file.startsWith('/') || file.split('/').includes('..')) {
        failQuality(rowLabel, 'file must be a relative .md path inside the hub');
      }
    });
  }
}

// The detection facts the compiled router needs at serve time: which surface is
// the fallback, so a session hint naming it never moves it ahead of another
// surface, and which label names each declared surface.
function buildSurfaceDetectionModel(declared) {
  const fallback = declared.find((entry) => entry.role === 'fallback');
  return {
    fallback: fallback ? fallback.workflowMode : null,
    labels: Object.fromEntries(declared.map((entry) => [entry.label, entry.workflowMode])),
    specific: declared.filter((entry) => entry.role === 'specific').map((entry) => entry.workflowMode),
  };
}

// The bespoke, hub-specific routing model the compiled router scores against
// directly (mirrors sk-design's registry-compiler.cjs routingModel). This
// sits alongside the generic detector/selector policy above rather than
// replacing it: the policy still carries the authority graph, composition
// rules, and hashing that policy-card.cjs and the projector read.
function buildRoutingModel(registry, hubRouter, destinations, surfaceDetection) {
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
    modes,
    outcomes: hubRouter.routerPolicy.outcomes,
    surfaceDetection: buildSurfaceDetectionModel(surfaceDetection),
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
  if (!Buffer.isBuffer(registryBytes)
    || !Buffer.isBuffer(routerBytes)
    || !Buffer.isBuffer(skillBytes)) {
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
    || skillBytes.toString('utf8') !== input.skillMarkdown) {
    fail('AUTHORED_SOURCE_IDENTITY_MISMATCH', 'parsed inputs do not match hashed authored bytes');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. COMPILER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compile a parent-hub registry without trusting destination-local role claims.
 *
 * @param {Object} input - Authored registry, router, skill text, and generation.
 * @returns {Object} Compiled snapshot plus read-only projections and source model.
 */
function compileRegistry(input) {
  assertObject(input, 'compiler input');
  assertObject(input.registry, 'mode registry');
  assertObject(input.hubRouter, 'hub router');
  assertString(input.registry.skill, 'mode registry skill');
  if (!Array.isArray(input.registry.modes) || input.registry.modes.length === 0) {
    fail('AUTHORED_INPUT_INVALID', 'mode registry must declare modes');
  }
  if (!Number.isSafeInteger(input.activationGeneration) || input.activationGeneration < 1) {
    fail('AUTHORED_INPUT_INVALID', 'activation generation must be a positive integer');
  }
  assertSourceIdentity(input);
  const surfaceDetection = validateSurfaceDetection(input.registry, input.hubRouter);
  validateQualityDeclarations(input.registry);
  const sourceHashes = sourceDigests(input.sourceBytes);
  const destinations = buildDestinationGraph(input.registry);
  const selection = buildSelectors(input.registry, input.hubRouter, destinations);
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

  const routingModel = buildRoutingModel(input.registry, input.hubRouter, destinations, surfaceDetection);

  return Object.freeze({
    advisorProjection: Object.freeze(advisorProjection),
    aliases: Object.freeze(aliases),
    fallbackChecklist: Object.freeze(extractFallbackChecklist(input.skillMarkdown)),
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
  PACKET_AUTHORITY,
  artifactBytes,
  compileRegistry,
  extractFallbackChecklist,
  sha256,
  validateQualityDeclarations,
  validateSurfaceDetection,
};
