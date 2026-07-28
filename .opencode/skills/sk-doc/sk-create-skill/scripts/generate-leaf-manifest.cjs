#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ generate-leaf-manifest — CLI wrapper over the leaf-resource contract     ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * generate-leaf-manifest.cjs — walks a hub's declared packets, normalizes
 * every leaf resource through leaf-resource-contract.cjs, and writes or
 * checks that hub's `leaf-manifest.json`.
 *
 *   --write <skillDir>   generate leaf-manifest.json from mode-registry.json
 *                         (+ leaf-aliases.json when present) and write it.
 *   --check <skillDir>   recompute the manifest and fail (nonzero exit) on
 *                         any byte drift against the committed file.
 *
 * An absent leaf-aliases.json is treated as zero authored aliases, so a hub
 * that has not authored one yet still generates and checks cleanly from its
 * on-disk packets alone.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');
const contract = require('./lib/leaf-resource-contract.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = { mode: null, skillDir: null };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--write' || argv[i] === '--check') {
      args.mode = argv[i].slice(2);
      args.skillDir = argv[i + 1];
      i += 1;
    }
  }
  return args;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// Authored aliases are optional in this phase: absence means zero aliases,
// but a present-and-malformed file is a real authoring error, not a silent
// empty set.
function readAliasEntries(skillDir) {
  const aliasPath = path.join(skillDir, 'leaf-aliases.json');
  if (!fs.existsSync(aliasPath)) return [];
  const data = readJson(aliasPath);
  const entries = Array.isArray(data) ? data : (Array.isArray(data && data.aliases) ? data.aliases : null);
  if (!entries) {
    throw new contract.ContractError('MALFORMED_ALIASES', `${aliasPath} must be an array or {"aliases":[...]}`);
  }
  for (const entry of entries) {
    const diskPath = entry && entry.diskPath;
    if (typeof diskPath !== 'string' || diskPath.startsWith('/') || diskPath.split('/').includes('..')) {
      throw new contract.ContractError('MALFORMED_ALIAS_DISK_PATH', `alias diskPath must be a hub-relative, contained path: ${JSON.stringify(entry)}`);
    }
  }
  return entries;
}

// Recursively collect packet-root-relative file paths under <packetRoot>/<rootName>.
function walkLeafFiles(packetRoot, rootName) {
  const start = path.join(packetRoot, rootName);
  if (!fs.existsSync(start)) return [];
  const out = [];
  const stack = [start];
  while (stack.length) {
    const cur = stack.pop();
    for (const entry of fs.readdirSync(cur, { withFileTypes: true })) {
      const full = path.join(cur, entry.name);
      if (entry.isDirectory()) { stack.push(full); continue; }
      if (!entry.isFile()) continue;
      out.push(path.relative(packetRoot, full).split(path.sep).join('/'));
    }
  }
  return out;
}

// The package-index docs that name their own root directory. A standalone
// skill routes its feature-catalog/playbook docs as leaves, but the index doc
// itself is navigation, not a routable leaf, so it is excluded from the walk.
const INDEX_BASENAMES = new Set([
  'feature-catalog.md', 'manual-testing-playbook.md',
]);

// A standalone (registry-less) single-mode skill declares its own manifest
// shape in leaf-manifest.config.json: the sole workflowMode, the packet root
// (usually "." — the skill root itself), and the leaf roots to walk. This is
// the one-mode analogue of a mode-registry.json entry; it exists so a skill
// whose feature-catalog and manual-testing-playbook docs are the routed corpus
// can generate a manifest without being modeled as a parent hub. Returns null
// when the config is absent, so a skill with neither registry nor config still
// fails closed exactly as before.
function readStandaloneConfig(skillDir) {
  const cfgPath = path.join(skillDir, 'leaf-manifest.config.json');
  if (!fs.existsSync(cfgPath)) return null;
  const cfg = readJson(cfgPath);
  if (!cfg || typeof cfg.workflowMode !== 'string' || cfg.workflowMode.length === 0) {
    throw new contract.ContractError('MALFORMED_STANDALONE_CONFIG', `${cfgPath} must declare a non-empty "workflowMode"`);
  }
  const leafRoots = Array.isArray(cfg.leafRoots) && cfg.leafRoots.length ? cfg.leafRoots : ['references', 'assets'];
  const allowedRoots = new Set(['references', 'assets']);
  for (const root of leafRoots) {
    if (!allowedRoots.has(root) && !contract.canonicalPackageRoot(root)) {
      throw new contract.ContractError('UNSUPPORTED_LEAF_ROOT', `unsupported standalone leaf root: ${root}`);
    }
  }
  const canonicalPackageRoots = leafRoots.map((root) => contract.canonicalPackageRoot(root)).filter(Boolean);
  if (new Set(canonicalPackageRoots).size !== canonicalPackageRoots.length) {
    throw new contract.ContractError('COEXISTING_LEAF_ROOTS', 'standalone config declares both legacy and canonical forms of one package root');
  }
  return {
    workflowMode: cfg.workflowMode,
    packet: typeof cfg.packet === 'string' && cfg.packet.length ? cfg.packet : '.',
    leafRoots,
    excludeIndexFiles: cfg.excludeIndexFiles !== false,
    resourceContractVersion: cfg.resourceContractVersion != null ? cfg.resourceContractVersion : contract.CONTRACT_VERSION,
  };
}

// Walk every declared leaf root for a standalone skill and collect its leaves,
// dropping only the package-index doc that names its own root directory
// (feature-catalog/feature-catalog.md, manual-testing-playbook/…). No alias
// merge happens here: a standalone manifest is a pure function of its on-disk
// corpus, and any resolver aliases live in their own file for router replay.
function collectStandaloneLeaves(skillDir, cfg) {
  const packetRoot = path.join(skillDir, cfg.packet);
  const leaves = [];
  for (const root of cfg.leafRoots) {
    for (const rel of walkLeafFiles(packetRoot, root)) {
      if (cfg.excludeIndexFiles) {
        const base = rel.split('/').pop();
        if (INDEX_BASENAMES.has(base) && rel === `${root}/${base}`) continue;
      }
      leaves.push(rel);
    }
  }
  return leaves;
}

// One mode entry per declared mode (not per physical packet directory), so
// an N-to-1 alias fan-out (two modes sharing one packet folder) keeps
// distinct, independently addressable leaf sets.
function collectModeEntries(skillDir, registryModes, aliasEntries) {
  const rawPairs = [];
  const modeEntries = [];
  for (const mode of registryModes || []) {
    if (!mode || !mode.workflowMode || !mode.packet) continue;
    const packetRoot = path.join(skillDir, mode.packet);
    const diskLeaves = [
      ...walkLeafFiles(packetRoot, 'references'),
      ...walkLeafFiles(packetRoot, 'assets'),
    ];
    const aliasLeaves = (aliasEntries || [])
      .filter((alias) => alias.workflowMode === mode.workflowMode)
      .map((alias) => alias.leafResourceId);
    const leaves = [...diskLeaves, ...aliasLeaves];
    for (const leaf of leaves) rawPairs.push({ workflowMode: mode.workflowMode, leafResourceId: leaf });
    modeEntries.push({ workflowMode: mode.workflowMode, packet: mode.packet, leaves });
  }
  return { modeEntries, rawPairs };
}

function buildManifestBytes(skillDir) {
  const registryPath = path.join(skillDir, 'mode-registry.json');
  if (!fs.existsSync(registryPath)) {
    // Registry-less standalone skill: build one degenerate mode from its
    // authored config. Parent hubs always ship a mode-registry.json, so this
    // branch never fires for them and their generation stays byte-identical.
    const cfg = readStandaloneConfig(skillDir);
    if (cfg) {
      const leaves = collectStandaloneLeaves(skillDir, cfg);
      const rawPairs = leaves.map((leaf) => ({ workflowMode: cfg.workflowMode, leafResourceId: leaf }));
      const dupes = contract.findDuplicateComposites(rawPairs);
      if (dupes.length) {
        throw new contract.ContractError('DUPLICATE_COMPOSITE', `duplicate (workflowMode, leafResourceId) pairs: ${dupes.join(', ')}`);
      }
      const manifest = contract.buildManifest({
        resourceContractVersion: cfg.resourceContractVersion,
        modeEntries: [{ workflowMode: cfg.workflowMode, packet: cfg.packet, leaves }],
      });
      return contract.canonicalManifestBytes(manifest);
    }
    throw new contract.ContractError('MISSING_REGISTRY', `mode-registry.json not found under ${skillDir}`);
  }
  const registry = readJson(registryPath);
  const aliasEntries = readAliasEntries(skillDir);
  const { modeEntries, rawPairs } = collectModeEntries(skillDir, registry.modes, aliasEntries);

  const dupes = contract.findDuplicateComposites(rawPairs);
  if (dupes.length) {
    throw new contract.ContractError('DUPLICATE_COMPOSITE', `duplicate (workflowMode, leafResourceId) pairs: ${dupes.join(', ')}`);
  }

  const resourceContractVersion = registry.resourceContractVersion != null
    ? registry.resourceContractVersion
    : contract.CONTRACT_VERSION;
  const manifest = contract.buildManifest({ resourceContractVersion, modeEntries });
  return contract.canonicalManifestBytes(manifest);
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

function runWrite(skillDir) {
  const bytes = buildManifestBytes(skillDir);
  fs.writeFileSync(path.join(skillDir, 'leaf-manifest.json'), bytes);
  process.stdout.write(`leaf-manifest.json written (${contract.digestManifestBytes(bytes)})\n`);
  return 0;
}

function runCheck(skillDir) {
  const manifestPath = path.join(skillDir, 'leaf-manifest.json');
  if (!fs.existsSync(manifestPath)) {
    process.stderr.write(`generate-leaf-manifest: no leaf-manifest.json to check under ${skillDir}\n`);
    return 2;
  }
  const committed = fs.readFileSync(manifestPath);
  const fresh = buildManifestBytes(skillDir);
  if (Buffer.compare(committed, fresh) === 0) {
    process.stdout.write(`leaf-manifest.json OK (${contract.digestManifestBytes(fresh)})\n`);
    return 0;
  }
  process.stderr.write(
    `generate-leaf-manifest: leaf-manifest.json is stale under ${skillDir}\n`
    + `  committed: ${contract.digestManifestBytes(committed)}\n`
    + `  fresh:     ${contract.digestManifestBytes(fresh)}\n`
    + 'Re-run with --write to regenerate.\n',
  );
  return 1;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { buildManifestBytes, runWrite, runCheck };

if (require.main === module) {
  const args = parseArgs(process.argv.slice(2));
  if (!args.mode || !args.skillDir) {
    process.stderr.write('usage: generate-leaf-manifest.cjs --write|--check <skillDir>\n');
    process.exit(2);
  }
  try {
    const code = args.mode === 'write' ? runWrite(args.skillDir) : runCheck(args.skillDir);
    process.exit(code);
  } catch (err) {
    process.stderr.write(`generate-leaf-manifest: ${err.message}\n`);
    process.exit(2);
  }
}
