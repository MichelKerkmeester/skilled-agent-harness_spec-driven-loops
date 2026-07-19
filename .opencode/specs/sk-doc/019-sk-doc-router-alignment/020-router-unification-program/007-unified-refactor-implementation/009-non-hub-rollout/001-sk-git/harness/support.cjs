'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const {
  DOMAIN_TAGS,
  canonicalize,
  hashArtifact,
} = require('../../../000-contract-schemas/lib/canonical.cjs');
const {
  buildAuthoredSources,
  compareUtf16,
} = require('../../../001-compiler-n1-shadow/compiler/index.cjs');

const CHILD_ROOT = path.resolve(__dirname, '..');
const CONTRACT_ROOT = path.resolve(CHILD_ROOT, '..', '..', '000-contract-schemas');

function findRepoRoot(startPath) {
  let candidate = path.resolve(startPath);
  for (;;) {
    const marker = path.join(candidate, '.opencode', 'skills', 'sk-git', 'SKILL.md');
    if (fs.existsSync(marker)) return candidate;
    const parent = path.dirname(candidate);
    if (parent === candidate) throw new Error('repository root could not be resolved');
    candidate = parent;
  }
}

const REPO_ROOT = findRepoRoot(CHILD_ROOT);
const SKILL_ROOT = path.join(REPO_ROOT, '.opencode', 'skills', 'sk-git');
const BENCHMARK_ROOT = path.join(
  REPO_ROOT,
  '.opencode',
  'skills',
  'system-deep-loop',
  'deep-improvement',
  'scripts',
  'skill-benchmark',
);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function sourceHash(sourceId, content) {
  return hashArtifact(DOMAIN_TAGS.CompiledPolicyV1, { content, sourceId });
}

function sortedUnique(values) {
  return [...new Set(values)].sort(compareUtf16);
}

function loadAuthoredSources() {
  const skillPath = path.join(SKILL_ROOT, 'SKILL.md');
  const sourceContractPath = path.join(__dirname, 'source-contract.json');
  const skillMarkdown = fs.readFileSync(skillPath, 'utf8');
  const sourceContract = readJson(sourceContractPath);
  if (fs.existsSync(path.join(SKILL_ROOT, 'hub-router.json'))) {
    throw new Error('sk-git unexpectedly declares a hub router');
  }
  if (fs.existsSync(path.join(SKILL_ROOT, 'mode-registry.json'))) {
    throw new Error('sk-git unexpectedly declares a mode registry');
  }
  for (const phrase of sourceContract.forbiddenAdmissions) {
    if (!skillMarkdown.toLowerCase().includes(phrase)) {
      throw new Error(`authored forbidden admission is missing: ${phrase}`);
    }
  }

  const leafManifest = {
    modes: [{
      leaves: [...sourceContract.leaves],
      packet: sourceContract.packetId,
      workflowMode: sourceContract.workflowMode,
    }],
    resourceContractVersion: sourceContract.resourceContractVersion,
  };
  const sources = buildAuthoredSources({
    activationGeneration: 1,
    guardSource: [
      "decision: 'allow'",
      "decision: 'warn'",
      "Fail open decision: 'allow'",
    ].join('\n'),
    leafManifest,
    skillMarkdown,
  });

  const authoredLeaves = sortedUnique([
    sources.defaultResource,
    ...sources.intentSignals.flatMap((signal) => signal.resources),
  ].filter(Boolean));
  if (canonicalize(authoredLeaves) !== canonicalize(sourceContract.leaves)) {
    throw new Error('source contract leaves differ from the authored router');
  }
  if (!sources.defaultResource) throw new Error('sk-git must retain its authored default resource');
  if (/DEFAULT_RESOURCE_SEMANTICS\s*=/.test(skillMarkdown)) {
    throw new Error('sk-git default-resource semantics changed from legacy always-union');
  }

  sources.destinations = [{
    authorityRef: `authority:${sources.skillId}/${sourceContract.workflowMode}`,
    backendKind: sourceContract.backendKind,
    mutatesWorkspace: sourceContract.mutatesWorkspace,
    packetId: sourceContract.packetId,
    packetKind: 'standalone',
    role: 'actor',
    skillId: sources.skillId,
    workflowMode: sourceContract.workflowMode,
  }];
  sources.intentSignals = sources.intentSignals.map((signal) => ({
    ...signal,
    resources: sortedUnique([sources.defaultResource, ...signal.resources]),
    workflowMode: sourceContract.workflowMode,
  }));
  sources.negativeAdmissions = [...sourceContract.forbiddenAdmissions];
  sources.referencedModes = [sourceContract.workflowMode];
  sources.sourceHashes = [
    { hash: sourceHash('SKILL.md', skillMarkdown), sourceId: 'SKILL.md' },
    {
      hash: sourceHash('source-contract.json', sourceContract),
      sourceId: 'source-contract.json',
    },
  ];
  return sources;
}

function loadSchemas() {
  const schemaRoot = path.join(CONTRACT_ROOT, 'schemas');
  return {
    advisor: readJson(path.join(schemaRoot, 'advisor-projection.v1.schema.json')),
    card: readJson(path.join(schemaRoot, 'policy-card.v1.schema.json')),
    decision: readJson(path.join(schemaRoot, 'route-decision.v1.schema.json')),
    policy: readJson(path.join(schemaRoot, 'compiled-policy.v1.schema.json')),
    typedGold: readJson(path.join(schemaRoot, 'typed-route-gold.v1.schema.json')),
  };
}

function canonicalJsonBytes(value) {
  return Buffer.from(`${canonicalize(value)}\n`, 'utf8');
}

function sha256Bytes(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

function sha256File(filePath) {
  return sha256Bytes(fs.readFileSync(filePath));
}

function walkFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walkFiles(target) : [target];
  });
}

function hashTree(directory) {
  const files = walkFiles(directory).sort(compareUtf16);
  const digest = crypto.createHash('sha256');
  for (const filePath of files) {
    const relativePath = path.relative(directory, filePath).split(path.sep).join('/');
    digest.update(relativePath);
    digest.update(Buffer.from([0]));
    digest.update(fs.readFileSync(filePath));
    digest.update(Buffer.from([0]));
  }
  return { fileCount: files.length, sha256: digest.digest('hex') };
}

module.exports = {
  BENCHMARK_ROOT,
  CHILD_ROOT,
  CONTRACT_ROOT,
  REPO_ROOT,
  SKILL_ROOT,
  canonicalJsonBytes,
  hashTree,
  loadAuthoredSources,
  loadSchemas,
  readJson,
  sha256Bytes,
  sha256File,
  walkFiles,
};
