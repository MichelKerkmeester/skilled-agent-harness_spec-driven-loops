// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ LIBRARY: AUTHORED ROUTER SOURCE MODEL                                    ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const {
  DOMAIN_TAGS,
  canonicalize,
  hashArtifact,
} = require('../../000-contract-schemas/lib/canonical.cjs');

const { CompileError } = require('./errors.cjs');
const { compareUtf16 } = require('./order.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function sourceHash(sourceId, content) {
  return hashArtifact(DOMAIN_TAGS.CompiledPolicyV1, { content, sourceId });
}

function assertNonEmptyString(value, element) {
  if (typeof value !== 'string' || !/\S/.test(value)) {
    throw new CompileError(
      'INVALID_AUTHORED_SOURCE',
      element,
      `${element} must be a non-empty string`,
    );
  }
  return value;
}

function cloneSourceValue(value, element) {
  try {
    return JSON.parse(canonicalize(value));
  } catch (error) {
    throw new CompileError(
      'INVALID_AUTHORED_SOURCE',
      element,
      `${element} must contain canonical JSON values`,
      error,
    );
  }
}

function parseSkillName(skillMarkdown) {
  const match = /^name:\s*([^\n]+)$/m.exec(skillMarkdown);
  if (!match || !match[1].trim()) {
    throw new CompileError(
      'INVALID_AUTHORED_SOURCE',
      'SKILL.md:name',
      'SKILL.md must declare a non-empty name',
    );
  }
  return match[1].trim().replace(/^['"]|['"]$/g, '');
}

function parseIntentSignals(skillMarkdown) {
  const block = /INTENT_SIGNALS\s*=\s*\{([\s\S]*?)\n\}/m.exec(skillMarkdown);
  if (!block) {
    throw new CompileError(
      'INVALID_AUTHORED_SOURCE',
      'SKILL.md:INTENT_SIGNALS',
      'SKILL.md must declare INTENT_SIGNALS',
    );
  }

  const signals = [];
  const pattern = /^\s*"([^"]+)"\s*:\s*(\{.*\})\s*,?\s*$/gm;
  for (const match of block[1].matchAll(pattern)) {
    let definition;
    try {
      definition = JSON.parse(match[2]);
    } catch (error) {
      throw new CompileError(
        'INVALID_AUTHORED_SOURCE',
        `INTENT_SIGNALS.${match[1]}`,
        `intent ${match[1]} is not parseable JSON`,
        error,
      );
    }
    if (!Number.isSafeInteger(definition.weight) || definition.weight < 1) {
      throw new CompileError(
        'INVALID_AUTHORED_SOURCE',
        `INTENT_SIGNALS.${match[1]}.weight`,
        `intent ${match[1]} must have a positive integer weight`,
      );
    }
    if (!Array.isArray(definition.keywords) || definition.keywords.length === 0) {
      throw new CompileError(
        'INVALID_AUTHORED_SOURCE',
        `INTENT_SIGNALS.${match[1]}.keywords`,
        `intent ${match[1]} must have at least one keyword`,
      );
    }
    const keywords = definition.keywords.map((keyword, index) => (
      assertNonEmptyString(keyword, `INTENT_SIGNALS.${match[1]}.keywords[${index}]`)
        .toLowerCase()
    ));
    signals.push({
      id: match[1],
      keywords,
      weight: definition.weight,
    });
  }
  if (signals.length === 0) {
    throw new CompileError(
      'INVALID_AUTHORED_SOURCE',
      'SKILL.md:INTENT_SIGNALS',
      'SKILL.md contains no parseable intent signals',
    );
  }
  return signals.sort((left, right) => compareUtf16(left.id, right.id));
}

function parseResourceMap(skillMarkdown) {
  const block = /RESOURCE_MAP\s*=\s*\{([\s\S]*?)\n\}/m.exec(skillMarkdown);
  if (!block) {
    throw new CompileError(
      'INVALID_AUTHORED_SOURCE',
      'SKILL.md:RESOURCE_MAP',
      'SKILL.md must declare RESOURCE_MAP',
    );
  }

  const resourceMap = new Map();
  const pattern = /^\s*"([^"]+)"\s*:\s*(\[[^\n]*\])\s*,?\s*$/gm;
  for (const match of block[1].matchAll(pattern)) {
    let resources;
    try {
      resources = JSON.parse(match[2]);
    } catch (error) {
      throw new CompileError(
        'INVALID_AUTHORED_SOURCE',
        `RESOURCE_MAP.${match[1]}`,
        `resource map entry ${match[1]} is not parseable JSON`,
        error,
      );
    }
    resourceMap.set(match[1], resources.map((resource, index) => (
      assertNonEmptyString(resource, `RESOURCE_MAP.${match[1]}[${index}]`)
    )));
  }
  if (resourceMap.size === 0) {
    throw new CompileError(
      'INVALID_AUTHORED_SOURCE',
      'SKILL.md:RESOURCE_MAP',
      'SKILL.md contains no parseable resource mappings',
    );
  }
  return resourceMap;
}

function parseDefaultResource(skillMarkdown) {
  const match = /^DEFAULT_RESOURCE\s*=\s*"([^"]+)"\s*$/m.exec(skillMarkdown);
  return match ? match[1] : null;
}

function parseNegativeAdmissions(skillMarkdown) {
  const block = /### Do NOT Use Code Mode For([\s\S]*?)(?:\n### |\n>)/m.exec(skillMarkdown);
  if (!block) return [];
  const values = [];
  for (const line of block[1].split(/\r?\n/)) {
    const match = /^\s*-\s*(?:❌\s*)?(.+)$/.exec(line);
    if (!match) continue;
    const phrase = match[1]
      .replace(/\*\*/g, '')
      .split('(')[0]
      .trim()
      .replace(/\s+For$/i, '')
      .toLowerCase();
    if (phrase) values.push(phrase);
  }
  return [...new Set(values)].sort(compareUtf16);
}

function parseSelectionPolicy(skillMarkdown) {
  const match = /def select_intents\([^)]*ambiguity_delta:\s*float\s*=\s*([0-9.]+),\s*max_intents:\s*int\s*=\s*([0-9]+)/m
    .exec(skillMarkdown);
  return {
    ambiguityDelta: match ? match[1] : '1.0',
    maximumIntents: match ? Number(match[2]) : 2,
  };
}

function confirmAdvisoryGuard(guardSource) {
  const allows = /decision:\s*'allow'/.test(guardSource);
  const warns = /decision:\s*'warn'/.test(guardSource);
  const failOpen = /Fail open[\s\S]*decision:\s*'allow'/.test(guardSource);
  const blockingDecision = /decision:\s*'(?!allow'|warn')[^']+'/.test(guardSource);
  if (!allows || !warns || !failOpen || blockingDecision) {
    throw new CompileError(
      'INVALID_ADVISORY_GUARD',
      'mcp-route-guard.cjs',
      'route guard must remain allow/warn-only and fail open',
    );
  }
  return 'advisory';
}

function buildDestinations(skillId, modes, skillMarkdown) {
  const backendKind = /mcp__code_mode__call_tool_chain/.test(skillMarkdown) ? 'utcp' : 'local';
  const packetKind = modes.length === 1 ? 'standalone' : 'workflow';
  return modes
    .map((mode) => ({
      authorityRef: `authority:${skillId}/${mode.workflowMode}`,
      backendKind,
      mutatesWorkspace: false,
      packetId: mode.packet,
      packetKind,
      role: 'actor',
      ...(mode.runtimeDiscriminator
        ? { runtimeDiscriminator: mode.runtimeDiscriminator }
        : {}),
      skillId,
      workflowMode: mode.workflowMode,
    }))
    .sort((left, right) => (
      compareUtf16(
        `${left.workflowMode}\0${left.runtimeDiscriminator || ''}`,
        `${right.workflowMode}\0${right.runtimeDiscriminator || ''}`,
      )
    ));
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. SOURCE MODEL
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Convert declared source bytes into the compiler's side-effect-free input model.
 *
 * @param {Object} input - Authored source snapshots.
 * @param {string} input.skillMarkdown - Complete skill document bytes as text.
 * @param {Object} input.leafManifest - Parsed leaf manifest.
 * @param {string} input.guardSource - Complete advisory guard bytes as text.
 * @param {number} [input.activationGeneration=1] - Immutable snapshot generation.
 * @returns {Object} Normalized authored source model.
 * @throws {CompileError} When a source is missing or malformed.
 */
function buildAuthoredSources(input) {
  if (!input || typeof input !== 'object') {
    throw new CompileError('INVALID_AUTHORED_SOURCE', 'authoredSources', 'source input must be an object');
  }
  const clonedInput = cloneSourceValue(input, 'authoredSources');
  const {
    skillMarkdown,
    leafManifest,
    guardSource,
    activationGeneration = 1,
  } = clonedInput;
  if (typeof skillMarkdown !== 'string' || typeof guardSource !== 'string') {
    throw new CompileError(
      'INVALID_AUTHORED_SOURCE',
      'authoredSources',
      'skill and guard sources must be complete strings',
    );
  }
  if (!leafManifest || !Array.isArray(leafManifest.modes)) {
    throw new CompileError(
      'INVALID_AUTHORED_SOURCE',
      'leaf-manifest.json:modes',
      'leaf manifest must declare modes',
    );
  }
  if (!Number.isSafeInteger(activationGeneration) || activationGeneration < 0) {
    throw new CompileError(
      'INVALID_AUTHORED_SOURCE',
      'activationGeneration',
      'activation generation must be a non-negative integer',
    );
  }

  const skillId = parseSkillName(skillMarkdown);
  const modes = leafManifest.modes.map((mode, index) => {
    if (!mode || !Array.isArray(mode.leaves)) {
      throw new CompileError(
        'INVALID_AUTHORED_SOURCE',
        `leaf-manifest.json:modes[${index}]`,
        'each manifest mode must declare workflowMode and leaves',
      );
    }
    const workflowMode = assertNonEmptyString(
      mode.workflowMode,
      `leaf-manifest.json:modes[${index}].workflowMode`,
    );
    const packet = assertNonEmptyString(
      mode.packet || '.',
      `leaf-manifest.json:modes[${index}].packet`,
    );
    const leaves = mode.leaves.map((resource, leafIndex) => (
      assertNonEmptyString(
        resource,
        `leaf-manifest.json:modes[${index}].leaves[${leafIndex}]`,
      )
    ));
    const runtimeDiscriminator = mode.runtimeDiscriminator === undefined
      ? undefined
      : assertNonEmptyString(
        mode.runtimeDiscriminator,
        `leaf-manifest.json:modes[${index}].runtimeDiscriminator`,
      );
    return {
      leaves: leaves.sort(compareUtf16),
      packet,
      ...(runtimeDiscriminator ? { runtimeDiscriminator } : {}),
      workflowMode,
    };
  });
  const intentSignals = parseIntentSignals(skillMarkdown);
  const resourceMap = parseResourceMap(skillMarkdown);
  for (const signal of intentSignals) {
    if (!resourceMap.has(signal.id)) {
      throw new CompileError(
        'INVALID_AUTHORED_SOURCE',
        `RESOURCE_MAP.${signal.id}`,
        `intent ${signal.id} has no resource mapping`,
      );
    }
  }

  return {
    activationGeneration,
    aliases: [skillId],
    authorityGraph: [],
    bundleRules: [],
    crossTargetEdges: [],
    defaultResource: parseDefaultResource(skillMarkdown),
    destinations: buildDestinations(skillId, modes, skillMarkdown),
    guardDisposition: confirmAdvisoryGuard(guardSource),
    handoffEdges: [],
    intentSignals: intentSignals.map((signal) => ({
      ...signal,
      resources: [...resourceMap.get(signal.id)].sort(compareUtf16),
    })),
    leaves: modes.flatMap((mode) => mode.leaves.map((resource) => ({
      resource,
      workflowMode: mode.workflowMode,
    }))),
    negativeAdmissions: parseNegativeAdmissions(skillMarkdown),
    overlay: null,
    referencedModes: modes.map((mode) => mode.workflowMode),
    resourceContractVersion: leafManifest.resourceContractVersion,
    schemaVersion: 'V1',
    selectionPolicy: parseSelectionPolicy(skillMarkdown),
    skillId,
    sourceHashes: [
      { sourceId: 'SKILL.md', hash: sourceHash('SKILL.md', skillMarkdown) },
      { sourceId: 'leaf-manifest.json', hash: sourceHash('leaf-manifest.json', leafManifest) },
      { sourceId: 'mcp-route-guard.cjs', hash: sourceHash('mcp-route-guard.cjs', guardSource) },
    ],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  buildAuthoredSources,
};
