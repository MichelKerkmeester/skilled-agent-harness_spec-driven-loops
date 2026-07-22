'use strict';

const crypto = require('node:crypto');

const {
  canonicalize,
  computeProjectionHash,
} = require('../../../000-contract-schemas/lib/canonical.cjs');
const {
  compile,
  destinationKey,
  qualifiedDestinationId,
} = require('../../../001-compiler-n1-shadow/compiler/compiler.cjs');

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

function unique(values) {
  return [...new Set(values)];
}

function sourceDigests(sourceBytes) {
  return Object.entries(sourceBytes)
    .map(([sourceId, bytes]) => {
      if (!Buffer.isBuffer(bytes)) fail('AUTHORED_SOURCE_BYTES_MISSING', `${sourceId} must be bytes`);
      return { hash: sha256(bytes), sourceId };
    })
    .sort((left, right) => compareText(left.sourceId, right.sourceId));
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

function sourceKeyForPacket(packet) {
  return `packets/${packet}/SKILL.md`;
}

function assertSourceIdentity(input) {
  const required = ['SKILL.md', 'hub-router.json', 'mode-registry.json'];
  required.forEach((sourceId) => {
    if (!Buffer.isBuffer(input.sourceBytes?.[sourceId])) {
      fail('AUTHORED_SOURCE_BYTES_MISSING', `${sourceId} bytes are required`);
    }
  });
  let registry;
  let router;
  try {
    registry = JSON.parse(input.sourceBytes['mode-registry.json'].toString('utf8'));
    router = JSON.parse(input.sourceBytes['hub-router.json'].toString('utf8'));
  } catch (error) {
    fail('AUTHORED_SOURCE_BYTES_INVALID', error.message);
  }
  if (canonicalize(registry) !== canonicalize(input.registry)
    || canonicalize(router) !== canonicalize(input.hubRouter)
    || input.sourceBytes['SKILL.md'].toString('utf8') !== input.skillMarkdown) {
    fail('AUTHORED_SOURCE_IDENTITY_MISMATCH', 'parsed inputs do not match hashed authored bytes');
  }
  for (const packet of unique(input.registry.modes.map((mode) => mode.packet))) {
    const sourceId = sourceKeyForPacket(packet);
    if (!Buffer.isBuffer(input.sourceBytes[sourceId])) {
      fail('AUTHORED_SOURCE_BYTES_MISSING', `${sourceId} bytes are required`);
    }
  }
}

function assertRouterClosure(registry, hubRouter) {
  if (registry.skill !== hubRouter.skill) {
    fail('HUB_IDENTITY_MISMATCH', 'registry and router skill identities differ');
  }
  if (!Array.isArray(registry.modes) || registry.modes.length === 0) {
    fail('AUTHORED_INPUT_INVALID', 'mode registry must declare modes');
  }
  const modes = registry.modes.map((mode) => mode.workflowMode);
  if (new Set(modes).size !== modes.length) {
    fail('PUBLIC_MODE_DUPLICATE', 'workflow modes must be unique');
  }
  const signalModes = Object.keys(hubRouter.routerSignals || {});
  if (canonicalize([...signalModes].sort(compareText)) !== canonicalize([...modes].sort(compareText))) {
    fail('ROUTER_MODE_SET_MISMATCH', 'router signals must cover every registry mode exactly once');
  }
  const tieBreak = hubRouter.routerPolicy?.tieBreak;
  if (!Array.isArray(tieBreak)
    || tieBreak.length !== modes.length
    || new Set(tieBreak).size !== modes.length
    || modes.some((mode) => !tieBreak.includes(mode))) {
    fail('TIE_BREAK_INVALID', 'tieBreak must list every mode exactly once');
  }
  const outcomes = hubRouter.routerPolicy?.outcomes || {};
  for (const outcome of ['single', 'orderedBundle', 'defer']) {
    if (typeof outcomes[outcome] !== 'string') {
      fail('ROUTER_OUTCOME_MISSING', `router outcome is missing: ${outcome}`);
    }
  }
  const defaultMode = hubRouter.routerPolicy.defaultMode;
  if (defaultMode !== null && !modes.includes(defaultMode)) {
    fail('DEFAULT_MODE_INVALID', 'defaultMode must be null or a registered mode');
  }
  for (const mode of registry.modes) {
    for (const field of ['workflowMode', 'packet', 'packetKind', 'backendKind']) {
      assertString(mode[field], `${mode.workflowMode}.${field}`);
    }
    if (mode.packetKind !== 'workflow') {
      fail('PACKET_KIND_UNSUPPORTED', 'sk-doc modes must remain workflow packets');
    }
    if (mode.toolSurface?.mutatesWorkspace !== true) {
      fail('AUTHORITY_SHAPE_INVALID', `${mode.workflowMode} must remain a mutating actor`);
    }
    const signal = hubRouter.routerSignals[mode.workflowMode];
    if (!Number.isSafeInteger(signal.weight) || signal.weight < 1) {
      fail('ROUTER_WEIGHT_INVALID', `${mode.workflowMode} weight must be a positive integer`);
    }
    if (!Array.isArray(signal.classes) || signal.classes.length === 0) {
      fail('ROUTER_CLASS_INVALID', `${mode.workflowMode} must declare vocabulary classes`);
    }
    const expectedResource = `${mode.packet}/SKILL.md`;
    if (!Array.isArray(signal.resources)
      || signal.resources.length !== 1
      || signal.resources[0] !== expectedResource) {
      fail('ROUTER_RESOURCE_MISMATCH', `${mode.workflowMode} must route to ${expectedResource}`);
    }
    signal.classes.forEach((className) => {
      const vocabulary = hubRouter.vocabularyClasses?.[className];
      if (!vocabulary || !Array.isArray(vocabulary.keywords) || vocabulary.keywords.length === 0) {
        fail('ROUTER_CLASS_INVALID', `unknown or empty vocabulary class: ${className}`);
      }
    });
  }
  for (const rule of hubRouter.routerPolicy.bundleRules || []) {
    if (!Array.isArray(rule.whenAll)
      || rule.whenAll.length < 2
      || new Set(rule.whenAll).size !== rule.whenAll.length
      || rule.whenAll.some((mode) => !modes.includes(mode))
      || rule.outcome !== 'orderedBundle') {
      fail('BUNDLE_RULE_INVALID', 'bundle rules must name registered modes and orderedBundle');
    }
  }
}

function vocabularyForMode(mode, hubRouter) {
  const signal = hubRouter.routerSignals[mode.workflowMode];
  const classKeywords = signal.classes.flatMap((className) => (
    hubRouter.vocabularyClasses[className].keywords
  ));
  return unique([
    mode.workflowMode,
    mode.command,
    ...(mode.aliases || []),
    ...classKeywords,
  ].filter((value) => typeof value === 'string' && /\S/.test(value)))
    .map((value) => value.toLowerCase())
    .sort(compareText);
}

// Legacy's own replay (router-replay.cjs) never reads routerPolicy.tieBreak --
// it breaks a keyword-score tie via JS's stable Array.sort over
// Object.entries(routerSignals), i.e. hub-router.json's routerSignals KEY
// ORDER (assertRouterClosure already proves that key set equals the mode
// set, so this is always a complete order). routerPolicy.tieBreak is a
// separately-authored array that has drifted from that order (e.g.
// create-quality-control precedes create-skill there, the opposite of
// routerSignals), so deriving the compiled tie-break from routerSignals keeps
// a scored tie resolved identically on both sides without editing
// hub-router.json itself.
function scoreTieBreakOrder(hubRouter) {
  return Object.keys(hubRouter.routerSignals);
}

// hub-router.json's own routerPolicy.bundleRules declares only one
// combination (create-skill + create-quality-control), but legacy's actual
// replay (router-replay.cjs's selectIntents) has no "declared combination"
// gate at all -- it unconditionally unions ANY near-tied (ambiguity-delta)
// set of scored intents into one route. The compiled decision contract
// (decision-contract.cjs's assertComposition) requires the opposite: every
// multi-target route must match a pre-declared, exactly-ordered composition
// in policy.compositionRules, so an undeclared near-tie fails closed to
// `clarify` instead of the route legacy actually takes. Closing that gap for
// the combinations the current sk-doc scenario corpus exercises means
// declaring them -- and hub-router.json is legacy-owned and frozen, so this
// compiled-routing-owned supplement declares them here instead. Each entry's
// whenAll is authored directly in the exact target order legacy's own
// stable-sorted-by-score replay produces for that combination (verified
// against router-replay.cjs's scoreIntents output for the scenario prompt),
// so -- unlike the hub-router.json-declared rules below -- it is not re-sorted
// by the generic tie-break map: a generic score/tie-break sort cannot express
// an order that depends on which of two DIFFERENT scores won for a given
// prompt (e.g. create-quality-control:4 outscoring create-flowchart:3), only
// on a fixed mode-to-mode priority.
const SUPPLEMENTAL_BUNDLE_RULES = [
  { name: 'quality-then-flowchart', whenAll: ['create-quality-control', 'create-flowchart'] },
  { name: 'feature-catalog-then-playbook', whenAll: ['create-feature-catalog', 'create-manual-testing-playbook'] },
  { name: 'agent-then-command', whenAll: ['create-agent', 'create-command'] },
  { name: 'skill-then-quality-then-changelog', whenAll: ['create-skill', 'create-quality-control', 'create-changelog'] },
];

function orderedBundleRules(hubRouter) {
  const order = new Map(scoreTieBreakOrder(hubRouter).map((mode, index) => [mode, index]));
  const declared = (hubRouter.routerPolicy.bundleRules || []).map((rule) => ({
    kind: rule.outcome,
    name: rule.name,
    targetWorkflowModes: [...rule.whenAll].sort((left, right) => (
      order.get(left) - order.get(right)
    )),
    whenAll: [...rule.whenAll],
  }));
  const supplemental = SUPPLEMENTAL_BUNDLE_RULES.map((rule) => ({
    kind: 'orderedBundle',
    name: rule.name,
    targetWorkflowModes: [...rule.whenAll],
    whenAll: [...rule.whenAll],
  }));
  return [...declared, ...supplemental];
}

function fallbackChecklist(registry) {
  return [
    `Choose one sk-doc workflow mode: ${registry.modes.map((mode) => mode.workflowMode).join(', ')}.`,
    'Name the target document or OpenCode component.',
    'Confirm whether the request is authoring or quality validation.',
  ];
}

function compileRegistry(input) {
  assertObject(input, 'compiler input');
  assertObject(input.registry, 'mode registry');
  assertObject(input.hubRouter, 'hub router');
  if (!Number.isSafeInteger(input.activationGeneration) || input.activationGeneration < 1) {
    fail('AUTHORED_INPUT_INVALID', 'activation generation must be a positive integer');
  }
  assertSourceIdentity(input);
  assertRouterClosure(input.registry, input.hubRouter);

  const sourceHashes = sourceDigests(input.sourceBytes);
  const modes = input.registry.modes;
  const bundleRules = orderedBundleRules(input.hubRouter);
  const vocabulary = Object.fromEntries(modes.map((mode) => [
    mode.workflowMode,
    vocabularyForMode(mode, input.hubRouter),
  ]));
  const destinations = modes.map((mode) => {
    const id = destinationId(input.registry.skill, mode);
    return {
      authorityRef: `authority:actor:${qualifiedDestinationId(id)}`,
      backendKind: mode.backendKind,
      mutatesWorkspace: true,
      packetId: mode.packet,
      packetKind: mode.packetKind,
      role: 'actor',
      skillId: input.registry.skill,
      workflowMode: mode.workflowMode,
    };
  });
  const aliases = unique(modes.flatMap((mode) => (
    [mode.workflowMode, mode.command, ...(mode.aliases || [])]
  )).filter((value) => typeof value === 'string' && /\S/.test(value))).sort(compareText);
  const intentSignals = modes.flatMap((mode) => (
    vocabulary[mode.workflowMode].map((keyword, index) => ({
      id: `${mode.workflowMode}:${index}`,
      keywords: [keyword],
      resources: [],
      weight: input.hubRouter.routerSignals[mode.workflowMode].weight,
      workflowMode: mode.workflowMode,
    }))
  ));
  const authoredSources = {
    activationGeneration: input.activationGeneration,
    aliases,
    authorityGraph: destinations.map((destination) => ({
      fromAuthorityRef: destination.authorityRef,
      relation: 'approveBeforeCommit',
      toWorkflowMode: destination.workflowMode,
    })),
    bundleRules: bundleRules.map((rule) => ({
      kind: rule.kind,
      targetWorkflowModes: rule.targetWorkflowModes,
    })),
    crossTargetEdges: [],
    defaultResource: input.hubRouter.routerPolicy.defaultResource?.[0] || null,
    destinations,
    guardDisposition: 'advisory',
    handoffEdges: [],
    intentSignals,
    leaves: [],
    negativeAdmissions: ['forbidden'],
    overlay: null,
    referencedModes: modes.map((mode) => mode.workflowMode),
    resourceContractVersion: input.registry.resourceContractVersion,
    schemaVersion: 'V1',
    selectionPolicy: {
      ambiguityDelta: String(input.hubRouter.routerPolicy.ambiguityDelta),
      maximumIntents: Math.max(1, ...bundleRules.map((rule) => rule.whenAll.length)),
    },
    skillId: input.registry.skill,
    sourceHashes,
  };
  const policy = compile(authoredSources);
  const manifestResources = modes.map((mode) => ({
    leafResourceId: 'packet-skill',
    resource: input.hubRouter.routerSignals[mode.workflowMode].resources[0],
    workflowMode: mode.workflowMode,
  }));
  const routeLeafSelections = modes.map((mode) => ({
    leafPairs: [{ leafResourceId: 'packet-skill', workflowMode: mode.workflowMode }],
    workflowMode: mode.workflowMode,
  }));
  const policyDestinations = new Map(policy.destinations.map((destination) => [
    destination.id.workflowMode,
    destination,
  ]));
  const routingModel = {
    ambiguityDelta: input.hubRouter.routerPolicy.ambiguityDelta,
    bundleRules,
    defaultMode: input.hubRouter.routerPolicy.defaultMode,
    modes: modes.map((mode) => ({
      command: mode.command,
      destinationId: policyDestinations.get(mode.workflowMode).id,
      keywords: vocabulary[mode.workflowMode],
      weight: input.hubRouter.routerSignals[mode.workflowMode].weight,
      workflowMode: mode.workflowMode,
    })),
    outcomes: input.hubRouter.routerPolicy.outcomes,
    tieBreak: scoreTieBreakOrder(input.hubRouter),
  };
  const advisorBody = {
    admissionLabels: ['positive-signal', 'zero-signal-defer', 'exclude:forbidden'],
    aliases,
    effectivePolicyHash: policy.effectivePolicyHash,
    eligibleModes: modes.map((mode) => ({
      publicMode: mode.workflowMode,
      qualifiedId: qualifiedDestinationId(policyDestinations.get(mode.workflowMode).id),
      routingClass: mode.advisorRouting.routingClass,
    })),
    hubId: input.registry.skill,
    schemaVersion: 'V1',
  };
  const advisorProjection = {
    ...advisorBody,
    projectionHash: computeProjectionHash('AdvisorProjectionV1', advisorBody),
  };
  const rows = modes.map((mode) => {
    const destination = policyDestinations.get(mode.workflowMode);
    return {
      backendKind: mode.backendKind,
      destinationId: destination.id,
      identityTuple: [
        input.registry.skill,
        mode.workflowMode,
        mode.packet,
        mode.packetKind,
        mode.backendKind,
        destination.role,
      ],
      packetKind: mode.packetKind,
      packetRef: mode.packet,
      qualifiedPublicMode: `${input.registry.skill}/${mode.workflowMode}`,
      resource: input.hubRouter.routerSignals[mode.workflowMode].resources[0],
      role: destination.role,
      routingClass: mode.advisorRouting.routingClass,
      workflowMode: mode.workflowMode,
    };
  });
  const projectionGraph = {
    edges: rows.flatMap((row) => ([
      { fromQualifiedPublicMode: row.qualifiedPublicMode, kind: 'packetRef', value: row.packetRef },
      { fromQualifiedPublicMode: row.qualifiedPublicMode, kind: 'backendKind', value: row.backendKind },
      { fromQualifiedPublicMode: row.qualifiedPublicMode, kind: 'resource', value: row.resource },
    ])),
    hubId: input.registry.skill,
    rows,
    schemaVersion: 'V1',
  };
  const keys = policy.destinations.map((destination) => destinationKey(destination.id));
  if (new Set(keys).size !== keys.length) fail('DESTINATION_IDENTITY_COLLAPSE', 'destinations collapsed');

  return Object.freeze({
    advisorProjection: Object.freeze(advisorProjection),
    authoredSources: Object.freeze(authoredSources),
    fallbackChecklist: Object.freeze(fallbackChecklist(input.registry)),
    manifestResources: Object.freeze(manifestResources),
    policy,
    projectionGraph: Object.freeze(projectionGraph),
    routeLeafSelections: Object.freeze(routeLeafSelections),
    routingModel: Object.freeze(routingModel),
    sourceHashes: Object.freeze(sourceHashes),
  });
}

module.exports = {
  artifactBytes,
  compileRegistry,
  sha256,
  sourceKeyForPacket,
};
