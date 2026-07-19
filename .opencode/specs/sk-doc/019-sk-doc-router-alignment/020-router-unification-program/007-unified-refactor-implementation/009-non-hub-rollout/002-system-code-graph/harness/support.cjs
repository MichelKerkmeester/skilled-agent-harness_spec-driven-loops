'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const { canonicalize } = require('../../../000-contract-schemas/lib/canonical.cjs');
const {
  buildAuthoredSources,
  compareUtf16,
} = require('../../../001-compiler-n1-shadow/compiler/index.cjs');

const PHASE_ROOT = path.resolve(__dirname, '..');

function findRepoRoot(startPath) {
  let candidate = path.resolve(startPath);
  for (;;) {
    if (fs.existsSync(path.join(candidate, '.opencode', 'skills', 'system-code-graph', 'SKILL.md'))) {
      return candidate;
    }
    const parent = path.dirname(candidate);
    if (parent === candidate) throw new Error('repository root could not be resolved');
    candidate = parent;
  }
}

const REPO_ROOT = findRepoRoot(PHASE_ROOT);
const SKILL_ROOT = path.join(REPO_ROOT, '.opencode', 'skills', 'system-code-graph');
const CONTRACT_ROOT = path.resolve(PHASE_ROOT, '..', '..', '000-contract-schemas');
const BASE_PHASE_ROOT = path.resolve(PHASE_ROOT, '..', '..', '001-compiler-n1-shadow');
const BENCHMARK_ROOT = path.join(
  REPO_ROOT,
  '.opencode',
  'skills',
  'system-deep-loop',
  'deep-improvement',
  'scripts',
  'skill-benchmark',
);
const PROTECTED_REPLAY_PATH = path.join(BASE_PHASE_ROOT, 'harness', 'protected-replay.cjs');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function parseNegativeAdmissions(skillMarkdown) {
  const section = /### When NOT to use\n([\s\S]*?)\n---/m.exec(skillMarkdown);
  if (!section) throw new Error('authored negative-admission section is missing');
  const values = section[1].split(/\r?\n/).flatMap((line) => {
    const match = /^\s*-\s*([^:]+):/.exec(line);
    return match ? [match[1].trim().toLowerCase()] : [];
  });
  if (values.length === 0) throw new Error('authored negative-admission section is empty');
  return [...new Set(values)].sort(compareUtf16);
}

function parseFallbackDefaults(skillMarkdown) {
  const block = /DEFAULT_RESOURCES\s*=\s*\[([\s\S]*?)\]/m.exec(skillMarkdown);
  if (!block) throw new Error('authored fallback defaults are missing');
  return [...block[1].matchAll(/"([^"]+)"/g)]
    .map((match) => match[1])
    .sort(compareUtf16);
}

function loadAuthoredSources() {
  const skillMarkdown = fs.readFileSync(path.join(SKILL_ROOT, 'SKILL.md'), 'utf8');
  const advisoryShadowSentinel = [
    "decision: 'allow'",
    "decision: 'warn'",
    "Fail open decision: 'allow'",
  ].join('\n');
  const sources = buildAuthoredSources({
    activationGeneration: 1,
    guardSource: advisoryShadowSentinel,
    leafManifest: readJson(path.join(SKILL_ROOT, 'leaf-manifest.json')),
    skillMarkdown,
  });
  return {
    ...sources,
    negativeAdmissions: parseNegativeAdmissions(skillMarkdown),
    sourceHashes: sources.sourceHashes.filter((source) => source.sourceId !== 'mcp-route-guard.cjs'),
  };
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
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walkFiles(target) : [target];
  }).sort(compareUtf16);
}

function hashTree(directory) {
  const digest = crypto.createHash('sha256');
  const files = walkFiles(directory);
  for (const filePath of files) {
    digest.update(path.relative(directory, filePath));
    digest.update(Buffer.from([0]));
    digest.update(fs.readFileSync(filePath));
    digest.update(Buffer.from([0]));
  }
  return { fileCount: files.length, sha256: digest.digest('hex') };
}

function runProtectedReplay(action, items) {
  const result = spawnSync(process.execPath, [PROTECTED_REPLAY_PATH], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    input: JSON.stringify({ action, items }),
    maxBuffer: 8 * 1024 * 1024,
  });
  if (result.status !== 0) throw new Error(result.stderr || 'protected replay failed');
  return JSON.parse(result.stdout);
}

module.exports = {
  BENCHMARK_ROOT,
  CONTRACT_ROOT,
  PHASE_ROOT,
  REPO_ROOT,
  SKILL_ROOT,
  canonicalJsonBytes,
  hashTree,
  loadAuthoredSources,
  loadSchemas,
  parseFallbackDefaults,
  readJson,
  runProtectedReplay,
  sha256Bytes,
  sha256File,
  walkFiles,
};
