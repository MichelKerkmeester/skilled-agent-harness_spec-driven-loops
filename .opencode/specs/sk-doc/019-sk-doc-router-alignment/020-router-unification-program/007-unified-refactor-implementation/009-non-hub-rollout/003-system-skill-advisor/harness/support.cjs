'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const TARGET_ROOT = path.resolve(__dirname, '..');
const IMPLEMENTATION_ROOT = path.resolve(TARGET_ROOT, '..', '..');
const BASE_ROOT = path.join(IMPLEMENTATION_ROOT, '001-compiler-n1-shadow');
const CONTRACT_ROOT = path.join(IMPLEMENTATION_ROOT, '000-contract-schemas');

function findRepoRoot(startPath) {
  let candidate = path.resolve(startPath);
  for (;;) {
    if (fs.existsSync(path.join(candidate, '.opencode', 'skills', 'system-skill-advisor', 'SKILL.md'))) {
      return candidate;
    }
    const parent = path.dirname(candidate);
    if (parent === candidate) throw new Error('repository root could not be resolved');
    candidate = parent;
  }
}

const REPO_ROOT = findRepoRoot(TARGET_ROOT);
const SKILL_ROOT = path.join(REPO_ROOT, '.opencode', 'skills', 'system-skill-advisor');
const BENCHMARK_ROOT = path.join(
  REPO_ROOT,
  '.opencode',
  'skills',
  'system-deep-loop',
  'deep-improvement',
  'scripts',
  'skill-benchmark',
);
const COMPILER_PATH = path.join(BASE_ROOT, 'compiler', 'index.cjs');
const PROTECTED_REPLAY_PATH = path.join(BASE_ROOT, 'harness', 'protected-replay.cjs');

const { compareUtf16 } = require(COMPILER_PATH);
const {
  DOMAIN_TAGS,
  canonicalize,
  hashArtifact,
} = require(path.join(CONTRACT_ROOT, 'lib', 'canonical.cjs'));
const { parseRouter } = require(path.join(BENCHMARK_ROOT, 'router-replay.cjs'));

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function sha256Bytes(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

function sha256File(filePath) {
  return sha256Bytes(fs.readFileSync(filePath));
}

function canonicalJsonBytes(value) {
  return Buffer.from(`${canonicalize(value)}\n`, 'utf8');
}

function sourceHash(sourceId, content) {
  return hashArtifact(DOMAIN_TAGS.CompiledPolicyV1, { content, sourceId });
}

function parseSkillId(skillMarkdown) {
  const match = /^name:\s*([^\n]+)$/m.exec(skillMarkdown);
  if (!match) throw new Error('SKILL.md name is missing');
  return match[1].trim().replace(/^["']|["']$/g, '');
}

function parseNegativeAdmissions(skillMarkdown) {
  const match = /Do not use this skill as a replacement for the recommended target skill\./i
    .exec(skillMarkdown);
  if (!match) throw new Error('authored replacement exclusion is missing');
  return [match[0].replace(/\.$/, '').toLowerCase()];
}

function assertRouterPolicy(skillMarkdown) {
  if (!/top_score\s*-\s*score\s*<=\s*1/.test(skillMarkdown)) {
    throw new Error('authored ambiguity delta is missing');
  }
  if (!/\[:2\]/.test(skillMarkdown)) throw new Error('authored maximum-intent limit is missing');
  return { ambiguityDelta: '1.0', maximumIntents: 2 };
}

function loadSourceBundle() {
  const skillMarkdown = fs.readFileSync(path.join(SKILL_ROOT, 'SKILL.md'), 'utf8');
  const leafManifest = readJson(path.join(SKILL_ROOT, 'leaf-manifest.json'));
  const leafAliases = readJson(path.join(SKILL_ROOT, 'leaf-aliases.json'));
  const skillId = parseSkillId(skillMarkdown);
  const router = parseRouter(skillMarkdown, SKILL_ROOT);
  if (!router.parseable || router.routerSource !== 'inline') {
    throw new Error('inline authored router is not parseable');
  }
  if (router.defaultResourceSemantics !== 'fallback-only') {
    throw new Error('default resources must remain fallback-only');
  }
  const modes = leafManifest.modes;
  if (!Array.isArray(modes) || modes.length !== 1) {
    throw new Error('single-skill manifest must declare exactly one mode');
  }
  const mode = modes[0];
  if (mode.workflowMode !== skillId || mode.packet !== '.') {
    throw new Error('manifest mode identity does not match the standalone skill');
  }

  const signalKeys = Object.keys(router.intentSignals).sort(compareUtf16);
  const resourceKeys = Object.keys(router.resourceMap).sort(compareUtf16);
  if (canonicalize(signalKeys) !== canonicalize(resourceKeys)) {
    throw new Error('intent signals and resource map do not have identical keys');
  }
  const routedResources = [...new Set(resourceKeys.flatMap((key) => router.resourceMap[key]))]
    .sort(compareUtf16);
  const manifestLeaves = new Set(mode.leaves);
  for (const resource of routedResources) {
    if (!manifestLeaves.has(resource)) throw new Error(`routed leaf is absent from manifest: ${resource}`);
    if (!fs.existsSync(path.join(SKILL_ROOT, resource))) {
      throw new Error(`routed leaf is absent on disk: ${resource}`);
    }
    const alias = leafAliases.find((entry) => (
      entry.workflowMode === skillId
      && entry.leafResourceId === resource
      && entry.diskPath === resource
    ));
    if (!alias) throw new Error(`routed leaf has no exact typed alias: ${resource}`);
  }
  for (const resource of router.defaultResource) {
    if (!manifestLeaves.has(resource) || !fs.existsSync(path.join(SKILL_ROOT, resource))) {
      throw new Error(`fallback support resource is invalid: ${resource}`);
    }
  }

  const negativeAdmissions = parseNegativeAdmissions(skillMarkdown);
  const selectionPolicy = assertRouterPolicy(skillMarkdown);
  const authoredSources = {
    activationGeneration: 1,
    aliases: [skillId],
    authorityGraph: [],
    bundleRules: [],
    crossTargetEdges: [],
    defaultResource: null,
    destinations: [{
      authorityRef: `authority:${skillId}/${skillId}`,
      backendKind: 'local',
      mutatesWorkspace: false,
      packetId: '.',
      packetKind: 'standalone',
      role: 'actor',
      skillId,
      workflowMode: skillId,
    }],
    guardDisposition: 'advisory',
    handoffEdges: [],
    intentSignals: signalKeys.map((id) => ({
      id,
      keywords: [...router.intentSignals[id].keywords],
      resources: [...router.resourceMap[id]].sort(compareUtf16),
      weight: router.intentSignals[id].weight,
    })),
    leaves: routedResources.map((resource) => ({ resource, workflowMode: skillId })),
    negativeAdmissions,
    overlay: null,
    referencedModes: [skillId],
    resourceContractVersion: leafManifest.resourceContractVersion,
    schemaVersion: 'V1',
    selectionPolicy,
    skillId,
    sourceHashes: [
      { hash: sourceHash('SKILL.md', skillMarkdown), sourceId: 'SKILL.md' },
      { hash: sourceHash('leaf-aliases.json', leafAliases), sourceId: 'leaf-aliases.json' },
      { hash: sourceHash('leaf-manifest.json', leafManifest), sourceId: 'leaf-manifest.json' },
    ],
  };
  return {
    authoredSources,
    routerContract: {
      defaultResourceSemantics: router.defaultResourceSemantics,
      defaultResources: [...router.defaultResource],
      intentCount: signalKeys.length,
      negativeAdmissions,
      routedResources,
      selectionPolicy,
    },
  };
}

function loadAuthoredSources() {
  return loadSourceBundle().authoredSources;
}

function loadSchemas() {
  const root = path.join(CONTRACT_ROOT, 'schemas');
  return {
    advisor: readJson(path.join(root, 'advisor-projection.v1.schema.json')),
    card: readJson(path.join(root, 'policy-card.v1.schema.json')),
    decision: readJson(path.join(root, 'route-decision.v1.schema.json')),
    policy: readJson(path.join(root, 'compiled-policy.v1.schema.json')),
    typedGold: readJson(path.join(root, 'typed-route-gold.v1.schema.json')),
  };
}

function walkFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walkFiles(target) : [target];
  });
}

function hashTree(directory) {
  const digest = crypto.createHash('sha256');
  const files = walkFiles(directory).sort(compareUtf16);
  for (const filePath of files) {
    digest.update(path.relative(directory, filePath).split(path.sep).join('/'));
    digest.update(Buffer.from([0]));
    digest.update(fs.readFileSync(filePath));
    digest.update(Buffer.from([0]));
  }
  return { fileCount: files.length, sha256: digest.digest('hex') };
}

module.exports = {
  BASE_ROOT,
  BENCHMARK_ROOT,
  COMPILER_PATH,
  CONTRACT_ROOT,
  PROTECTED_REPLAY_PATH,
  REPO_ROOT,
  SKILL_ROOT,
  TARGET_ROOT,
  canonicalJsonBytes,
  hashTree,
  loadAuthoredSources,
  loadSchemas,
  loadSourceBundle,
  readJson,
  sha256Bytes,
  sha256File,
  walkFiles,
};
