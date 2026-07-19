'use strict';

const crypto = require('node:crypto');
const path = require('node:path');

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

function sourceKeyForPacket(packet) {
  return `packets/${packet}/SKILL.md`;
}

function sourceKeyForRouter(packet) {
  return `packets/${packet}/references/smart-router-pseudocode.md`;
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

function roleFor(mode) {
  return mode.packetKind === 'transport' ? 'transport' : 'actor';
}

function extractBalanced(text, start, open, close) {
  if (text[start] !== open) fail('ROUTER_PARSE_INVALID', `expected ${open}`);
  let depth = 0;
  let quote = null;
  let escaped = false;
  for (let index = start; index < text.length; index += 1) {
    const character = text[index];
    if (quote !== null) {
      if (escaped) escaped = false;
      else if (character === '\\') escaped = true;
      else if (character === quote) quote = null;
      continue;
    }
    if (character === '"' || character === "'") {
      quote = character;
      continue;
    }
    if (character === open) depth += 1;
    if (character === close) {
      depth -= 1;
      if (depth === 0) return text.slice(start, index + 1);
    }
  }
  fail('ROUTER_PARSE_INVALID', `unterminated ${open}${close} block`);
}

function assignmentBlock(markdown, names, open, close) {
  for (const name of names) {
    const match = new RegExp(`\\b${name}\\s*=\\s*`).exec(markdown);
    if (!match) continue;
    const start = markdown.indexOf(open, match.index + match[0].length);
    if (start >= 0) return extractBalanced(markdown, start, open, close);
  }
  return null;
}

function parseQuoted(text, start) {
  const quote = text[start];
  let value = '';
  let escaped = false;
  for (let index = start + 1; index < text.length; index += 1) {
    const character = text[index];
    if (escaped) {
      value += character;
      escaped = false;
    } else if (character === '\\') {
      escaped = true;
    } else if (character === quote) {
      return { end: index + 1, value };
    } else {
      value += character;
    }
  }
  fail('ROUTER_PARSE_INVALID', 'unterminated quoted string');
}

function quotedStrings(text) {
  const values = [];
  for (let index = 0; index < text.length; index += 1) {
    if (text[index] !== '"' && text[index] !== "'") continue;
    const parsed = parseQuoted(text, index);
    values.push(parsed.value);
    index = parsed.end - 1;
  }
  return values;
}

function parsePythonMap(markdown, names) {
  const block = assignmentBlock(markdown, names, '{', '}');
  if (!block) fail('ROUTER_MAP_MISSING', `router map missing: ${names.join(' or ')}`);
  const body = block.slice(1, -1);
  const entries = [];
  let index = 0;
  while (index < body.length) {
    while (index < body.length && /[\s,]/.test(body[index])) index += 1;
    if (index >= body.length) break;
    if (body[index] === '#') {
      index = body.indexOf('\n', index);
      if (index < 0) break;
      continue;
    }
    if (body[index] !== '"' && body[index] !== "'") {
      fail('ROUTER_PARSE_INVALID', `unexpected router map token: ${body.slice(index, index + 16)}`);
    }
    const key = parseQuoted(body, index);
    index = key.end;
    while (/\s/.test(body[index])) index += 1;
    if (body[index] !== ':') fail('ROUTER_PARSE_INVALID', `router map key lacks colon: ${key.value}`);
    index += 1;
    while (/\s/.test(body[index])) index += 1;
    const valueStart = index;
    let curly = 0;
    let square = 0;
    let round = 0;
    let quote = null;
    let escaped = false;
    for (; index < body.length; index += 1) {
      const character = body[index];
      if (quote !== null) {
        if (escaped) escaped = false;
        else if (character === '\\') escaped = true;
        else if (character === quote) quote = null;
        continue;
      }
      if (character === '"' || character === "'") quote = character;
      else if (character === '{') curly += 1;
      else if (character === '}') curly -= 1;
      else if (character === '[') square += 1;
      else if (character === ']') square -= 1;
      else if (character === '(') round += 1;
      else if (character === ')') round -= 1;
      else if (character === ',' && curly === 0 && square === 0 && round === 0) break;
    }
    entries.push([key.value, body.slice(valueStart, index).trim()]);
    index += 1;
  }
  return entries;
}

function defaultResources(markdown) {
  const match = /\bDEFAULT_RESOURCE(?:S)?\s*=\s*/.exec(markdown);
  if (!match) fail('ROUTER_DEFAULT_MISSING', 'mode router must declare DEFAULT_RESOURCE');
  let index = match.index + match[0].length;
  while (/\s/.test(markdown[index])) index += 1;
  if (markdown[index] === '[') return quotedStrings(extractBalanced(markdown, index, '[', ']'));
  if (markdown[index] === '"' || markdown[index] === "'") return [parseQuoted(markdown, index).value];
  fail('ROUTER_DEFAULT_INVALID', 'DEFAULT_RESOURCE must be a string or list');
}

function parseIntentModel(markdown) {
  const entries = parsePythonMap(markdown, ['INTENT_SIGNALS', 'INTENT_MODEL']);
  return entries.map(([intent, value]) => {
    const keywordMatch = /["']keywords["']\s*:\s*/.exec(value);
    if (!keywordMatch) fail('ROUTER_INTENT_INVALID', `${intent} has no keywords`);
    const start = value.indexOf('[', keywordMatch.index + keywordMatch[0].length);
    const keywords = quotedStrings(extractBalanced(value, start, '[', ']'));
    const explicitWeight = /["']weight["']\s*:\s*(\d+)/.exec(value);
    const tupleWeights = [...value.matchAll(/\(\s*["'][^"']+["']\s*,\s*(\d+)\s*\)/g)]
      .map((match) => Number(match[1]));
    const weight = explicitWeight ? Number(explicitWeight[1]) : Math.max(1, ...tupleWeights);
    return { intent, keywords, weight };
  });
}

function normalizeResource(packet, relativeResource) {
  const normalized = path.posix.normalize(path.posix.join(packet, relativeResource));
  if (normalized.startsWith('../') || path.posix.isAbsolute(normalized)) {
    fail('ROUTER_RESOURCE_ESCAPE', `${packet}/${relativeResource} escapes the skill root`);
  }
  return normalized;
}

function parseNestedRouter(mode, markdown) {
  const resourceEntries = parsePythonMap(markdown, ['RESOURCE_MAP']);
  const resourceMap = Object.fromEntries(resourceEntries.map(([intent, value]) => (
    [intent, unique(quotedStrings(value).map((resource) => normalizeResource(mode.packet, resource)))]
  )));
  const intents = parseIntentModel(markdown).map((entry) => {
    if (!Object.prototype.hasOwnProperty.call(resourceMap, entry.intent)) {
      fail('ROUTER_INTENT_RESOURCE_MISSING', `${mode.workflowMode}/${entry.intent} has no resource map`);
    }
    return entry;
  });
  const defaults = defaultResources(markdown).map((resource) => normalizeResource(mode.packet, resource));
  const resources = unique([...defaults, ...Object.values(resourceMap).flat()]).sort(compareText);
  const deltaMatch = /\bAMBIGUITY_DELTA\s*=\s*(\d+)/.exec(markdown);
  return {
    ambiguityDelta: deltaMatch ? Number(deltaMatch[1]) : 1,
    defaultResources: defaults,
    intents,
    resourceMap,
    resources,
    workflowMode: mode.workflowMode,
  };
}

function assertSourceIdentity(input) {
  for (const sourceId of ['SKILL.md', 'hub-router.json', 'mode-registry.json']) {
    if (!Buffer.isBuffer(input.sourceBytes?.[sourceId])) {
      fail('AUTHORED_SOURCE_BYTES_MISSING', `${sourceId} bytes are required`);
    }
  }
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
    fail('AUTHORED_SOURCE_IDENTITY_MISMATCH', 'parsed hub inputs do not match hashed bytes');
  }
  for (const mode of input.registry.modes) {
    const packetSourceId = sourceKeyForPacket(mode.packet);
    const routerSourceId = input.routerSourceIds[mode.workflowMode];
    if (!Buffer.isBuffer(input.sourceBytes[packetSourceId])) {
      fail('AUTHORED_SOURCE_BYTES_MISSING', `${packetSourceId} bytes are required`);
    }
    if (!Buffer.isBuffer(input.sourceBytes[routerSourceId])) {
      fail('AUTHORED_SOURCE_BYTES_MISSING', `${routerSourceId} bytes are required`);
    }
    if (input.packetRouterMarkdown[mode.workflowMode]
      !== input.sourceBytes[routerSourceId].toString('utf8')) {
      fail('AUTHORED_SOURCE_IDENTITY_MISMATCH', `${mode.workflowMode} router differs from hashed bytes`);
    }
  }
}

function assertRouterClosure(registry, hubRouter) {
  if (registry.skill !== 'sk-design' || hubRouter.skill !== registry.skill) {
    fail('HUB_IDENTITY_MISMATCH', 'the registry and router must identify sk-design');
  }
  if (!Array.isArray(registry.modes) || registry.modes.length !== 6) {
    fail('AUTHORED_INPUT_INVALID', 'sk-design must declare six modes');
  }
  const modes = registry.modes.map((mode) => mode.workflowMode);
  if (new Set(modes).size !== modes.length) fail('PUBLIC_MODE_DUPLICATE', 'workflow modes must be unique');
  const expectedOrder = ['interface', 'foundations', 'motion', 'audit', 'md-generator', 'design-mcp-open-design'];
  if (canonicalize(hubRouter.routerPolicy?.tieBreak) !== canonicalize(expectedOrder)) {
    fail('TIE_BREAK_INVALID', 'tieBreak differs from the authored design-axis order');
  }
  if (hubRouter.routerPolicy.defaultMode !== null) {
    fail('DEFAULT_MODE_INVALID', 'sk-design defaultMode must remain null');
  }
  for (const outcome of ['single', 'orderedBundle', 'defer']) {
    assertString(hubRouter.routerPolicy?.outcomes?.[outcome], `outcomes.${outcome}`);
  }
  const rules = hubRouter.routerPolicy.bundleRules;
  if (!Array.isArray(rules) || rules.length !== 1
    || rules[0].name !== 'ui-build-bundle'
    || canonicalize(rules[0].whenAll) !== canonicalize(['interface', 'foundations'])
    || rules[0].outcome !== 'orderedBundle') {
    fail('BUNDLE_RULE_INVALID', 'ui-build-bundle must remain the sole authored bundle rule');
  }
  const signalModes = Object.keys(hubRouter.routerSignals || {});
  if (canonicalize([...signalModes].sort(compareText)) !== canonicalize([...modes].sort(compareText))) {
    fail('ROUTER_MODE_SET_MISMATCH', 'router signals must cover every registry mode exactly once');
  }
  for (const mode of registry.modes) {
    for (const field of ['workflowMode', 'packet', 'packetKind', 'backendKind']) {
      assertString(mode[field], `${mode.workflowMode}.${field}`);
    }
    if (!['workflow', 'transport'].includes(mode.packetKind)) {
      fail('PACKET_KIND_UNSUPPORTED', `${mode.workflowMode} has an unsupported packet kind`);
    }
    if (typeof mode.toolSurface?.mutatesWorkspace !== 'boolean') {
      fail('AUTHORITY_SHAPE_INVALID', `${mode.workflowMode} lacks a mutation declaration`);
    }
    const signal = hubRouter.routerSignals[mode.workflowMode];
    if (signal.weight !== 4) fail('ROUTER_WEIGHT_INVALID', `${mode.workflowMode} weight must remain 4`);
    const expectedResource = `${mode.packet}/SKILL.md`;
    if (canonicalize(signal.resources) !== canonicalize([expectedResource])) {
      fail('ROUTER_RESOURCE_MISMATCH', `${mode.workflowMode} must route to ${expectedResource}`);
    }
    for (const className of signal.classes || []) {
      const vocabulary = hubRouter.vocabularyClasses?.[className];
      if (!vocabulary || !Array.isArray(vocabulary.keywords) || vocabulary.keywords.length === 0) {
        fail('ROUTER_CLASS_INVALID', `unknown or empty vocabulary class: ${className}`);
      }
    }
  }
}

function orderedBundleRules(hubRouter) {
  const order = new Map(hubRouter.routerPolicy.tieBreak.map((mode, index) => [mode, index]));
  return hubRouter.routerPolicy.bundleRules.map((rule) => ({
    kind: rule.outcome,
    name: rule.name,
    targetWorkflowModes: [...rule.whenAll].sort((left, right) => order.get(left) - order.get(right)),
    whenAll: [...rule.whenAll],
  }));
}

function compiledPairRules(hubRouter) {
  const modes = hubRouter.routerPolicy.tieBreak;
  const rules = [];
  for (let left = 0; left < modes.length; left += 1) {
    for (let right = left + 1; right < modes.length; right += 1) {
      rules.push({ kind: 'orderedBundle', targetWorkflowModes: [modes[left], modes[right]] });
    }
  }
  return rules;
}

function fallbackChecklist() {
  return [
    'Choose the dominant design axis or name the separate axes: interface, foundations, motion, audit, md-generator, or Open Design transport.',
    'Name the target surface, artifact, or transport operation.',
    'Confirm whether the request asks for design judgment, extraction, audit, or transport.',
  ];
}

function compileRegistry(input) {
  assertObject(input, 'compiler input');
  assertObject(input.registry, 'mode registry');
  assertObject(input.hubRouter, 'hub router');
  if (!Number.isSafeInteger(input.activationGeneration) || input.activationGeneration < 1) {
    fail('AUTHORED_INPUT_INVALID', 'activation generation must be positive');
  }
  assertSourceIdentity(input);
  assertRouterClosure(input.registry, input.hubRouter);

  const sourceHashes = sourceDigests(input.sourceBytes);
  const modes = input.registry.modes;
  const nestedRouters = Object.fromEntries(modes.map((mode) => (
    [mode.workflowMode, parseNestedRouter(mode, input.packetRouterMarkdown[mode.workflowMode])]
  )));
  const manifestResources = modes.flatMap((mode) => nestedRouters[mode.workflowMode].resources.map((resource) => ({
    leafResourceId: `${mode.workflowMode}:${resource}`,
    resource,
    workflowMode: mode.workflowMode,
  })));
  const leafIdsByMode = new Map(modes.map((mode) => [
    mode.workflowMode,
    manifestResources.filter((leaf) => leaf.workflowMode === mode.workflowMode).map((leaf) => leaf.leafResourceId),
  ]));
  const destinations = modes.map((mode) => {
    const id = destinationId(input.registry.skill, mode);
    const role = roleFor(mode);
    return {
      authorityRef: `authority:${role}:${qualifiedDestinationId(id)}`,
      backendKind: mode.backendKind,
      mutatesWorkspace: mode.toolSurface.mutatesWorkspace,
      packetId: mode.packet,
      packetKind: mode.packetKind,
      role,
      skillId: input.registry.skill,
      workflowMode: mode.workflowMode,
    };
  });
  const aliases = unique([
    input.registry.skill,
    ...modes.flatMap((mode) => [mode.workflowMode, mode.command, ...(mode.aliases || [])]),
  ].filter((value) => typeof value === 'string' && /\S/.test(value))).sort(compareText);
  const intentSignals = modes.flatMap((mode) => {
    const signal = input.hubRouter.routerSignals[mode.workflowMode];
    return signal.classes.map((className) => ({
      id: className,
      keywords: [...input.hubRouter.vocabularyClasses[className].keywords],
      resources: [...leafIdsByMode.get(mode.workflowMode)],
      weight: signal.weight,
      workflowMode: mode.workflowMode,
    }));
  });
  const bundleRules = orderedBundleRules(input.hubRouter);
  const compositionRules = compiledPairRules(input.hubRouter);
  const authoredSources = {
    activationGeneration: input.activationGeneration,
    aliases,
    authorityGraph: destinations.map((destination) => ({
      fromAuthorityRef: destination.authorityRef,
      relation: destination.role === 'transport' ? 'evidenceOnly' : 'approveBeforeCommit',
      toWorkflowMode: destination.workflowMode,
    })),
    bundleRules: compositionRules,
    crossTargetEdges: [],
    defaultResource: input.hubRouter.routerPolicy.defaultResource[0],
    destinations,
    guardDisposition: 'advisory',
    handoffEdges: [],
    intentSignals,
    leaves: manifestResources.map((leaf) => ({
      resource: leaf.leafResourceId,
      workflowMode: leaf.workflowMode,
    })),
    negativeAdmissions: ['forbidden'],
    overlay: null,
    referencedModes: [...input.hubRouter.routerPolicy.tieBreak],
    resourceContractVersion: input.registry.resourceContractVersion,
    schemaVersion: 'V1',
    selectionPolicy: {
      ambiguityDelta: String(input.hubRouter.routerPolicy.ambiguityDelta),
      maximumIntents: modes.length,
    },
    skillId: input.registry.skill,
    sourceHashes,
  };
  const policy = compile(authoredSources);
  const policyDestinations = new Map(policy.destinations.map((destination) => [
    destination.id.workflowMode,
    destination,
  ]));
  const routingModel = {
    ambiguityDelta: input.hubRouter.routerPolicy.ambiguityDelta,
    bundleRules,
    defaultMode: input.hubRouter.routerPolicy.defaultMode,
    modes: modes.map((mode) => {
      const signal = input.hubRouter.routerSignals[mode.workflowMode];
      return {
        command: mode.command,
        destinationId: policyDestinations.get(mode.workflowMode).id,
        keywords: unique(signal.classes.flatMap((className) => (
          input.hubRouter.vocabularyClasses[className].keywords
        ))).map((keyword) => keyword.toLowerCase()),
        weight: signal.weight,
        workflowMode: mode.workflowMode,
      };
    }),
    nestedRouters,
    outcomes: input.hubRouter.routerPolicy.outcomes,
    tieBreak: [...input.hubRouter.routerPolicy.tieBreak],
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
      leafResources: nestedRouters[mode.workflowMode].resources,
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
      ...row.leafResources.map((resource) => ({
        fromQualifiedPublicMode: row.qualifiedPublicMode,
        kind: 'leafResource',
        value: resource,
      })),
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
    fallbackChecklist: Object.freeze(fallbackChecklist()),
    manifestResources: Object.freeze(manifestResources),
    policy,
    projectionGraph: Object.freeze(projectionGraph),
    routingModel: Object.freeze(routingModel),
    sourceHashes: Object.freeze(sourceHashes),
  });
}

module.exports = {
  artifactBytes,
  compileRegistry,
  parseNestedRouter,
  sha256,
  sourceKeyForPacket,
  sourceKeyForRouter,
};
