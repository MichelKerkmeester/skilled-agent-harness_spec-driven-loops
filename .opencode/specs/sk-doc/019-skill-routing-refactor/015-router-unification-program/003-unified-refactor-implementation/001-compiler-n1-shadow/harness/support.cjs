// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ LIBRARY: SHADOW HARNESS SUPPORT                                          ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const { canonicalize } = require('../../000-contract-schemas/lib/canonical.cjs');
const { buildAuthoredSources } = require('../compiler/index.cjs');
const { compareUtf16 } = require('../compiler/order.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. PATHS
// ─────────────────────────────────────────────────────────────────────────────

const PHASE_ROOT = path.resolve(__dirname, '..');

function findRepoRoot(startPath) {
  let candidate = path.resolve(startPath);
  for (;;) {
    const marker = path.join(candidate, '.opencode', 'skills', 'mcp-code-mode', 'SKILL.md');
    if (fs.existsSync(marker)) return candidate;
    const parent = path.dirname(candidate);
    if (parent === candidate) throw new Error('repository root could not be resolved');
    candidate = parent;
  }
}

const REPO_ROOT = findRepoRoot(PHASE_ROOT);
const SKILL_ROOT = path.join(REPO_ROOT, '.opencode', 'skills', 'mcp-code-mode');
const BENCHMARK_ROOT = path.join(
  REPO_ROOT,
  '.opencode',
  'skills',
  'system-deep-loop',
  'deep-improvement',
  'scripts',
  'skill-benchmark',
);
const CONTRACT_ROOT = path.resolve(PHASE_ROOT, '..', '000-contract-schemas');

// ─────────────────────────────────────────────────────────────────────────────
// 3. SOURCE AND ARTIFACT HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function loadAuthoredSources() {
  return buildAuthoredSources({
    activationGeneration: 1,
    guardSource: fs.readFileSync(
      path.join(SKILL_ROOT, 'runtime', 'lib', 'mcp-route-guard.cjs'),
      'utf8',
    ),
    leafManifest: readJson(path.join(SKILL_ROOT, 'leaf-manifest.json')),
    skillMarkdown: fs.readFileSync(path.join(SKILL_ROOT, 'SKILL.md'), 'utf8'),
  });
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

function writeCanonicalJson(filePath, value) {
  fs.writeFileSync(filePath, `${canonicalize(value)}\n`, { encoding: 'utf8', mode: 0o600 });
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

// ─────────────────────────────────────────────────────────────────────────────
// 4. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  BENCHMARK_ROOT,
  CONTRACT_ROOT,
  PHASE_ROOT,
  REPO_ROOT,
  SKILL_ROOT,
  hashTree,
  loadAuthoredSources,
  loadSchemas,
  readJson,
  sha256Bytes,
  sha256File,
  walkFiles,
  writeCanonicalJson,
};
