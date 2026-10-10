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
 *                         (+ leaf-aliases.json and leaf-scopes.json when present)
 *                         and write it.
 *   --check <skillDir>   recompute the manifest and fail (nonzero exit) on
 *                         any byte drift against the committed file.
 *
 * An absent leaf-aliases.json is treated as zero authored aliases, so a hub
 * that has not authored one yet still generates and checks cleanly from its
 * on-disk packets alone. An absent leaf-scopes.json means every mode walks its
 * packet's full references/ + assets/ roots; a present file narrows a mode to
 * its own packet-relative subtrees (or single leaf files), which is what an
 * N-to-1 packet fan-out needs so its typed routes stay distinguishable.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const contract = require('./lib/leaf-resource-contract.cjs');
// Shared S-class config defaults, also read by init_skill.py, so the scaffold's
// written config and this fallback can never drift apart.
const S_DEFAULTS = require('./lib/s-class-config-defaults.json');

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

/** True when the path itself is a symbolic link, judged without following it. */
function isSymbolicLink(file) {
  try { return fs.lstatSync(file).isSymbolicLink(); } catch { return false; }
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

// Read a link's authored target for diagnostics only; a link whose target cannot
// even be read still deserves a message rather than an exception from the reporter.
function symlinkTarget(linkPath) {
  try {
    return fs.readlinkSync(linkPath);
  } catch {
    return '<unreadable>';
  }
}

// Generated noise that a name rule can recognize. Consulted only when git cannot
// say what it ignores, so a walk outside a work tree never drops a source file.
const FALLBACK_IGNORED_SEGMENTS = new Set(['__pycache__', 'node_modules', '.DS_Store']);

function fallbackIgnored(rel) {
  if (rel.endsWith('.pyc')) return true;
  return rel.split('/').some((segment) => FALLBACK_IGNORED_SEGMENTS.has(segment));
}

// The repository root that holds packetRoot, or null when git cannot name one.
function gitToplevel(cwd) {
  const res = spawnSync('git', ['rev-parse', '--show-toplevel'], { cwd, encoding: 'utf8' });
  if (res.error || res.status !== 0) return null;
  return fs.realpathSync(res.stdout.trim());
}

// Git owns the ignore rules, which live in .gitignore files this walker does not
// parse. Name rules only cover a walk that git cannot answer.
function dropGitIgnoredLeaves(packetRoot, rels) {
  if (rels.length === 0) return rels;
  const top = gitToplevel(packetRoot);
  if (top === null) return rels.filter((rel) => !fallbackIgnored(rel));
  // git refuses any path that passes through a symbolic link, so only the directory is
  // resolved. A leaf symlink keeps its own name because the manifest lists that path.
  const repoRels = rels.map((rel) => {
    const abs = path.join(packetRoot, rel);
    const real = path.join(fs.realpathSync(path.dirname(abs)), path.basename(abs));
    return path.relative(top, real).split(path.sep).join('/');
  });
  const res = spawnSync('git', ['check-ignore', '-z', '--stdin'], {
    cwd: top,
    input: `${repoRels.join('\0')}\0`,
    encoding: 'utf8',
  });
  // Exit status 1 means nothing matched. Any other failure leaves git's answer unknown.
  if (res.error || (res.status !== 0 && res.status !== 1)) {
    return rels.filter((rel) => !fallbackIgnored(rel));
  }
  const ignored = new Set(res.status === 0 ? res.stdout.split('\0').filter(Boolean) : []);
  return rels.filter((rel, i) => !ignored.has(repoRels[i]));
}

// A starting root or declared scope is read before any entry inside it is
// checked, so a link at that position has to be resolved and contained the same
// way the walker contains a link it finds inside a root. Without this, a root
// that is itself a link to a directory outside the skill would be enumerated as
// if it belonged to the skill.
function assertStartInsideSkill(skillDir, full) {
  const skillRoot = fs.realpathSync(skillDir);
  const resolved = fs.realpathSync(full);
  if (resolved !== skillRoot && !resolved.startsWith(`${skillRoot}${path.sep}`)) {
    const label = path.relative(skillDir, full).split(path.sep).join('/');
    throw new contract.ContractError('LEAF_SYMLINK_OUT_OF_ROOT', `leaf root escapes the skill root: ${label} resolves to ${resolved}`);
  }
}

// Recursively collect packet-root-relative file paths under <packetRoot>/<rootName>.
//
// A symlinked entry is emitted under the link's own packet-relative path, exactly
// as a real file of that name would be: the manifest's identity is the path a
// consumer resolves, and every consumer resolves a leaf with a follow-stat, so an
// in-tree link is transparent. A link that cannot become a reachable leaf
// (broken, escaping the skill root, or targeting a directory) is reported instead
// of dropped, because a dropped leaf is invisible to every downstream
// reachability check.
function walkLeafFiles(skillDir, packetRoot, rootName) {
  const start = path.join(packetRoot, rootName);
  if (!fs.existsSync(start)) return [];
  assertStartInsideSkill(skillDir, start);
  const skillRoot = fs.realpathSync(skillDir);
  const out = [];
  const stack = [start];
  while (stack.length) {
    const cur = stack.pop();
    for (const entry of fs.readdirSync(cur, { withFileTypes: true })) {
      const full = path.join(cur, entry.name);
      if (entry.isDirectory()) {
        // Local tool caches such as .pytest_cache are ignored by git, so they must not become leaves.
        if (!entry.name.startsWith('.')) stack.push(full);
        continue;
      }
      if (entry.isFile()) {
        out.push(path.relative(packetRoot, full).split(path.sep).join('/'));
        continue;
      }
      if (!entry.isSymbolicLink()) continue;
      const label = path.relative(skillDir, full).split(path.sep).join('/');
      const target = symlinkTarget(full);
      let resolved;
      try {
        resolved = fs.realpathSync(full);
      } catch {
        throw new contract.ContractError('BROKEN_LEAF_SYMLINK', `leaf symlink is broken: ${label} -> ${target}`);
      }
      if (resolved !== skillRoot && !resolved.startsWith(`${skillRoot}${path.sep}`)) {
        throw new contract.ContractError('LEAF_SYMLINK_OUT_OF_ROOT', `leaf symlink escapes the skill root: ${label} -> ${target}`);
      }
      if (!fs.statSync(resolved).isFile()) {
        throw new contract.ContractError('UNSUPPORTED_LEAF_SYMLINK', `leaf symlink must target a file: ${label} -> ${target}`);
      }
      out.push(path.relative(packetRoot, full).split(path.sep).join('/'));
    }
  }
  return dropGitIgnoredLeaves(packetRoot, out);
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
  const leafRoots = Array.isArray(cfg.leafRoots) && cfg.leafRoots.length ? cfg.leafRoots : S_DEFAULTS.leafRoots;
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
  // The packet field is joined onto skillDir and then walked, so an authored
  // "../.." would make the manifest enumerate files outside the skill. Reject
  // any packet that escapes its own skill root before it reaches the walker.
  const packet = typeof cfg.packet === 'string' && cfg.packet.length ? cfg.packet : S_DEFAULTS.packet;
  const packetRel = path.relative(skillDir, path.resolve(skillDir, packet));
  if (packetRel === '..' || packetRel.startsWith(`..${path.sep}`) || path.isAbsolute(packetRel)) {
    throw new contract.ContractError('PACKET_OUT_OF_ROOT', `${cfgPath} packet must stay within the skill root: ${packet}`);
  }
  return {
    workflowMode: cfg.workflowMode,
    packet,
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
    for (const rel of walkLeafFiles(skillDir, packetRoot, root)) {
      if (cfg.excludeIndexFiles) {
        const base = rel.split('/').pop();
        if (INDEX_BASENAMES.has(base) && rel === `${root}/${base}`) continue;
      }
      leaves.push(rel);
    }
  }
  return leaves;
}

// Authored leaf scoping is optional and per mode. A hub whose registry fans two
// workflowModes onto one physical packet hands every mode the whole packet by
// default, which makes the typed (workflowMode, leafResourceId) pair unable to
// distinguish them. A scopes entry narrows one mode to its own packet-relative
// subtrees (or single leaf files); a mode with no entry keeps the full walk.
// Absence of the file means no mode is narrowed.
function readLeafScopes(skillDir) {
  const scopesPath = path.join(skillDir, 'leaf-scopes.json');
  const byMode = new Map();
  if (!fs.existsSync(scopesPath)) return byMode;
  const data = readJson(scopesPath);
  const entries = Array.isArray(data) ? data : (Array.isArray(data && data.scopes) ? data.scopes : null);
  if (!entries) {
    throw new contract.ContractError('MALFORMED_LEAF_SCOPES', `${scopesPath} must be an array or {"scopes":[...]}`);
  }
  for (const entry of entries) {
    const workflowMode = entry && entry.workflowMode;
    if (typeof workflowMode !== 'string' || workflowMode.length === 0) {
      throw new contract.ContractError('MALFORMED_LEAF_SCOPES', `every leaf-scopes entry needs a non-empty workflowMode: ${JSON.stringify(entry)}`);
    }
    if (byMode.has(workflowMode)) {
      throw new contract.ContractError('DUPLICATE_LEAF_SCOPE_MODE', `leaf-scopes.json declares workflowMode ${workflowMode} more than once`);
    }
    const rawScopes = entry.leafScopes;
    if (!Array.isArray(rawScopes) || rawScopes.length === 0) {
      throw new contract.ContractError('MALFORMED_LEAF_SCOPES', `workflowMode ${workflowMode} needs a non-empty leafScopes array`);
    }
    byMode.set(workflowMode, rawScopes.map((scope) => normalizeLeafScope(scope, workflowMode)));
  }
  return byMode;
}

// A scope is a packet-relative subtree (or a single leaf file) and must stay
// inside one of the contract's routable roots. A scope that escapes them would
// widen the packet a mode claims or enumerate files the manifest does not own,
// so it fails closed rather than being silently clamped.
function normalizeLeafScope(scope, workflowMode) {
  const value = String(scope == null ? '' : scope).replace(/\\/g, '/');
  const segments = value.split('/');
  if (value.startsWith('/') || /^[A-Za-z]:\//.test(value)) {
    throw new contract.ContractError('ABSOLUTE_LEAF_SCOPE', `workflowMode ${workflowMode} leaf scope must be relative: ${value}`);
  }
  if (value.length === 0 || segments.some((segment) => segment === '' || segment === '.')) {
    throw new contract.ContractError('MALFORMED_LEAF_SCOPE', `workflowMode ${workflowMode} has a malformed leaf scope: ${JSON.stringify(scope)}`);
  }
  if (segments.includes('..')) {
    throw new contract.ContractError('LEAF_SCOPE_TRAVERSAL', `workflowMode ${workflowMode} leaf scope must not contain ".." segments: ${value}`);
  }
  const rooted = contract.LEAF_ROOTS.some((root) => value === root.replace(/\/$/, '') || value.startsWith(root));
  if (!rooted) {
    throw new contract.ContractError('OUT_OF_ROOT_LEAF_SCOPE', `workflowMode ${workflowMode} leaf scope must begin with one of ${contract.LEAF_ROOTS.map((r) => `"${r}"`).join(', ')}: ${value}`);
  }
  return value;
}

// Walk one mode's declared scopes. A directory scope contributes every file
// below it (the same follow-stat walk the default roots use); a file scope
// contributes exactly that leaf. A declared scope with nothing on disk is an
// authoring error, not an empty set: silently emitting zero leaves would hide
// a typo behind a manifest that still looks valid.
function collectScopedLeaves(skillDir, packetRoot, scopes, workflowMode) {
  const leaves = [];
  for (const scope of scopes) {
    const full = path.join(packetRoot, scope);
    let stat = null;
    try {
      stat = fs.statSync(full);
    } catch {
      stat = null;
    }
    if (!stat) {
      throw new contract.ContractError('MISSING_LEAF_SCOPE', `mode ${workflowMode} declares leaf scope ${scope}, but nothing exists there`);
    }
    if (stat.isDirectory()) {
      leaves.push(...walkLeafFiles(skillDir, packetRoot, scope));
    } else if (stat.isFile()) {
      assertStartInsideSkill(skillDir, full);
      leaves.push(scope);
    } else {
      throw new contract.ContractError('UNSUPPORTED_LEAF_SCOPE', `mode ${workflowMode} leaf scope must be a directory or a file: ${scope}`);
    }
  }
  return leaves;
}

// One mode entry per declared mode (not per physical packet directory), so
// an N-to-1 alias fan-out (two modes sharing one packet folder) keeps
// distinct, independently addressable leaf sets.
function collectModeEntries(skillDir, registryModes, aliasEntries, leafScopes) {
  const rawPairs = [];
  const modeEntries = [];
  for (const mode of registryModes || []) {
    if (!mode || !mode.workflowMode || !mode.packet) continue;
    // The packet is joined onto skillDir and then walked, so an authored "../.."
    // would make the manifest enumerate files outside the skill. Reject any
    // packet that escapes its own skill root before it reaches the walker
    // (mirrors the standalone-config guard).
    const packetRel = path.relative(skillDir, path.resolve(skillDir, mode.packet));
    if (packetRel === '..' || packetRel.startsWith(`..${path.sep}`) || path.isAbsolute(packetRel)) {
      throw new contract.ContractError('PACKET_OUT_OF_ROOT', `mode ${mode.workflowMode} packet must stay within the skill root: ${mode.packet}`);
    }
    const packetRoot = path.join(skillDir, mode.packet);
    const scopes = leafScopes instanceof Map ? leafScopes.get(mode.workflowMode) : undefined;
    const diskLeaves = Array.isArray(scopes)
      ? collectScopedLeaves(skillDir, packetRoot, scopes, mode.workflowMode)
      : [
        ...walkLeafFiles(skillDir, packetRoot, 'references'),
        ...walkLeafFiles(skillDir, packetRoot, 'assets'),
      ];
    const aliasLeaves = (aliasEntries || [])
      .filter((alias) => alias.workflowMode === mode.workflowMode)
      .map((alias) => alias.leafResourceId);
    const leaves = [...diskLeaves, ...aliasLeaves];
    for (const leaf of leaves) rawPairs.push({ workflowMode: mode.workflowMode, leafResourceId: leaf });
    modeEntries.push({ workflowMode: mode.workflowMode, packet: mode.packet, leaves });
  }
  const knownModes = new Set((registryModes || [])
    .map((mode) => mode && mode.workflowMode)
    .filter(Boolean));
  for (const alias of aliasEntries || []) {
    const workflowMode = alias && alias.workflowMode;
    if (!knownModes.has(workflowMode)) {
      const leafResourceId = alias && alias.leafResourceId;
      throw new contract.ContractError(
        'ORPHAN_ALIAS_MODE',
        `alias workflowMode ${JSON.stringify(workflowMode)} has no matching registry mode for leafResourceId ${JSON.stringify(leafResourceId)}`,
      );
    }
  }
  for (const workflowMode of leafScopes instanceof Map ? leafScopes.keys() : []) {
    if (!knownModes.has(workflowMode)) {
      throw new contract.ContractError(
        'ORPHAN_LEAF_SCOPE_MODE',
        `leaf-scopes.json workflowMode ${JSON.stringify(workflowMode)} has no matching registry mode`,
      );
    }
  }
  return { modeEntries, rawPairs };
}

/**
 * Build the canonical `leaf-manifest.json` bytes for a skill root (hub or
 * standalone), by walking every declared packet's leaf resources.
 * @param {string} skillDir Absolute path to the skill root directory.
 * @returns {Buffer} The serialized, digest-stamped manifest bytes.
 */
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
  const leafScopes = readLeafScopes(skillDir);
  const { modeEntries, rawPairs } = collectModeEntries(skillDir, registry.modes, aliasEntries, leafScopes);

  const dupes = contract.findDuplicateComposites(rawPairs);
  if (dupes.length) {
    throw new contract.ContractError('DUPLICATE_COMPOSITE', `duplicate (workflowMode, leafResourceId) pairs: ${dupes.join(', ')}`);
  }

  const collisions = contract.findCollidingModeLeafSets(modeEntries);
  if (collisions.length) {
    const [{ digest, workflowModes }] = collisions;
    throw new contract.ContractError(
      'MODE_LEAF_SET_COLLISION',
      `workflowModes ${workflowModes.map((m) => `"${m}"`).join(' and ')} receive hash-equal leaf sets (${digest.slice(0, 12)}); give each mode its own leafScopes in leaf-scopes.json`,
    );
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

/**
 * Write `bytes` to `file` through a fresh temporary sibling that is renamed over it.
 *
 * The temporary name is random and created exclusively, so a link planted at a
 * guessable name is never written through. The rename replaces whatever sits at
 * `file`, including a link, rather than following it.
 *
 * @param {string} file Absolute path of the destination file.
 * @param {Buffer} bytes Content to write.
 */
function writeFileAtomic(file, bytes) {
  const directory = path.dirname(file);
  const temporary = path.join(
    directory,
    `.${path.basename(file)}.${process.pid}.${crypto.randomBytes(6).toString('hex')}.tmp`,
  );
  // The entry is read without following it, so a link's target never sets the mode.
  let existing = null;
  try { existing = fs.lstatSync(file); } catch { existing = null; }
  const mode = existing !== null && existing.isFile() ? existing.mode & 0o777 : null;
  let descriptor = null;
  try {
    descriptor = fs.openSync(temporary, 'wx');
    fs.writeFileSync(descriptor, bytes);
    if (mode !== null) fs.fchmodSync(descriptor, mode);
    fs.fsyncSync(descriptor);
    fs.closeSync(descriptor);
    descriptor = null;
    fs.renameSync(temporary, file);
  } catch (err) {
    if (descriptor !== null) {
      try { fs.closeSync(descriptor); } catch { /* The original write error is more useful. */ }
    }
    try { fs.rmSync(temporary, { force: true }); } catch { /* The original write error is more useful. */ }
    throw err;
  }
}

/**
 * Regenerate and write `leaf-manifest.json` for a skill root.
 *
 * A manifest that is a link is refused rather than followed: the file it names
 * lies outside the skill, and a write through the link would overwrite it.
 *
 * @param {string} skillDir Absolute path to the skill root directory.
 * @returns {number} Exit code (0 on success).
 * @throws {Error} When `leaf-manifest.json` is a symbolic link.
 */
function runWrite(skillDir) {
  const manifestPath = path.join(skillDir, 'leaf-manifest.json');
  if (isSymbolicLink(manifestPath)) {
    throw new Error(`leaf-manifest.json is a symbolic link, not followed: ${manifestPath}; remove the link and write the manifest again`);
  }
  const bytes = buildManifestBytes(skillDir);
  writeFileAtomic(manifestPath, bytes);
  process.stdout.write(`leaf-manifest.json written (${contract.digestManifestBytes(bytes)})\n`);
  return 0;
}

/**
 * Check that a skill root's committed `leaf-manifest.json` matches a fresh
 * regeneration, without writing.
 * @param {string} skillDir Absolute path to the skill root directory.
 * @returns {number} Exit code: 0 fresh, non-zero when stale or missing.
 */
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
