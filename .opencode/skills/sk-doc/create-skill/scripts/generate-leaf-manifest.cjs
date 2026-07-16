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
