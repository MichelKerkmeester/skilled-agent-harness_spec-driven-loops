#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ ci-skill-root-metadata — fleet-wide skill-root metadata class gate       ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * ci-skill-root-metadata.cjs — fleet gate for root-level skill metadata.
 *
 * Classifies every skill root, then enforces that root's class contract:
 * required files present, forbidden files absent, overlays scoped, one advisor
 * identity per root, and every generated manifest byte-fresh.
 *
 * The ordering matters. The freshness scanner this gate fronts discovers work by
 * walking committed manifests, so a root that never committed one is invisible
 * to it — a scanner that begins at outputs can never report a missing output.
 * This gate begins at SKILL.md instead, which is the one marker that exists
 * before any tooling has run, so an unadopted root is a finding rather than a
 * silence.
 *
 * Discovery is deliberately limited to direct children of the skills directory.
 * Nested packets are visited only to prove they carry no second advisor
 * identity; they are never candidates themselves. The spec tree is never
 * scanned at all: it holds files of the same two names under a wholly separate
 * continuity schema, and conflating them would let packet metadata reach an
 * advisor that must only ever see skill identities.
 *
 * Usage:
 *   node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs
 *        [--skills-dir <dir>]   default: the repo .opencode/skills (resolved from
 *                               this file's location)
 *        [--format text|json]   default: text
 *        [--fix]                regenerate missing/stale manifests, nothing else
 *
 * Exit codes:
 *   0  every root conforms to its class contract
 *   1  one or more roots have violations
 *   2  the gate could not run (bad skills dir)
 *
 * `--fix` writes leaf-manifest.json only. The other seven files carry authored
 * identity, policy, or compatibility data; regenerating them would mean
 * inventing meaning, so they are always reported and never written.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');
const { buildManifestBytes } = require('./generate-leaf-manifest.cjs');
const leafContract = require('./lib/leaf-resource-contract.cjs');
const rootContract = require('./lib/skill-root-metadata-contract.cjs');
const commandSchema = require('./lib/command-metadata-schema.cjs');

// Keep this closed: an ignored top-level block hid authored routing data for
// months because no consumer rejected unknown keys.
const GRAPH_METADATA_TOP_LEVEL_KEYS = new Set([
  'schema_version',
  'skill_id',
  'family',
  'category',
  'edges',
  'domains',
  'intent_signals',
  'derived',
  'deprecated',
  'importance_tier',
  'enhance_when',
]);

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = {
    skillsDir: null, format: 'text', fix: false, skill: null,
  };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--skills-dir') { args.skillsDir = argv[i + 1]; i += 1; }
    else if (argv[i] === '--format') { args.format = argv[i + 1]; i += 1; }
    else if (argv[i] === '--fix') { args.fix = true; }
    else if (argv[i] === '--skill') { args.skill = argv[i + 1]; i += 1; }
  }
  return args;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

/**
 * A skill root is a direct child directory carrying SKILL.md. Using the authored
 * marker rather than any generated artifact is what lets the gate see a root
 * that has adopted none of the contract yet.
 */
function findSkillRoots(skillsDir) {
  // A missing directory is a legitimate empty result (ENOENT); any other
  // failure — a regular file passed as the root, a permissions error — must
  // surface, not silently become zero roots and a false-green pass. run()
  // separately proves the path is a real directory before calling here.
  let entries;
  try {
    entries = fs.readdirSync(skillsDir, { withFileTypes: true });
  } catch (err) {
    if (err && err.code === 'ENOENT') return [];
    throw err;
  }
  return entries
    .filter((entry) => entry.isDirectory() && entry.name !== 'node_modules' && !entry.name.startsWith('.'))
    .map((entry) => path.join(skillsDir, entry.name))
    .filter((dir) => fs.existsSync(path.join(dir, rootContract.SKILL_MARKER)))
    .sort();
}

/** Which contract files exist at this root. */
function readPresence(skillDir) {
  const presence = Object.create(null);
  for (const name of rootContract.METADATA_FILES) {
    presence[name] = fs.existsSync(path.join(skillDir, name));
  }
  return presence;
}

/**
 * Skill identity is discriminated by content, not location, because the spec
 * tree uses these same filenames for continuity metadata. A file lacking every
 * skill-shaped key is not a competing identity, just a same-named neighbour.
 */
function isSkillShapedGraph(value) {
  if (!value || typeof value !== 'object') return false;
  return 'skill_id' in value || 'family' in value || 'edges' in value;
}

function isSkillShapedDescription(value) {
  if (!value || typeof value !== 'object') return false;
  return 'name' in value && 'description' in value && 'keywords' in value;
}

/**
 * Walk everything below the root looking for a second advisor identity. A hub
 * projects exactly one identity; a nested one would make the same skill
 * resolvable under two names and split its routing evidence.
 */
function findNestedIdentities(skillDir) {
  const found = [];
  const stack = [skillDir];
  while (stack.length) {
    const cur = stack.pop();
    // Skip-and-continue is intentional for a nested subtree: an unreadable
    // packet directory should not abort the whole one-identity scan, only
    // forgo that branch. The top-level root itself is already proven readable
    // by run()/checkRoot before this walk begins.
    let entries;
    try { entries = fs.readdirSync(cur, { withFileTypes: true }); } catch { continue; }
    for (const entry of entries) {
      if (entry.name === 'node_modules' || entry.name === '.git') continue;
      const full = path.join(cur, entry.name);
      if (entry.isDirectory()) { stack.push(full); continue; }
      if (!entry.isFile()) continue;
      if (cur === skillDir) continue;
      if (entry.name !== 'graph-metadata.json' && entry.name !== 'description.json') continue;
      let parsed;
      try { parsed = readJson(full); } catch { continue; }
      const shaped = entry.name === 'graph-metadata.json'
        ? isSkillShapedGraph(parsed)
        : isSkillShapedDescription(parsed);
      if (shaped) found.push(path.relative(skillDir, full).split(path.sep).join('/'));
    }
  }
  return found.sort();
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Regenerate the class-required manifest and compare bytes. Runs even when the
 * committed file is absent, which is the whole point: absence is a finding the
 * output-first scanner structurally cannot produce.
 */
function checkGeneratedManifest(skillDir, presence, fix) {
  const manifestPath = path.join(skillDir, 'leaf-manifest.json');
  let fresh;
  try {
    fresh = buildManifestBytes(skillDir);
  } catch (err) {
    return {
      violations: [{
        code: 'MANIFEST_REGENERATION_FAILED',
        file: 'leaf-manifest.json',
        message: `${path.basename(skillDir)}: cannot regenerate leaf-manifest.json — ${err.code || 'ERROR'}: ${err.message}`,
      }],
      fixed: false,
    };
  }

  const digest = leafContract.digestManifestBytes(fresh);

  if (!presence['leaf-manifest.json']) {
    if (fix) {
      fs.writeFileSync(manifestPath, fresh);
      return { violations: [], fixed: true, digest, freshBytes: fresh };
    }
    // evaluateRoot already reports the absence; adding a second violation for
    // the same fact would double-count it in the summary.
    return { violations: [], fixed: false, digest, freshBytes: fresh };
  }

  const committed = fs.readFileSync(manifestPath);
  if (Buffer.compare(committed, fresh) === 0) {
    return { violations: [], fixed: false, digest, freshBytes: fresh };
  }
  if (fix) {
    fs.writeFileSync(manifestPath, fresh);
    return { violations: [], fixed: true, digest, freshBytes: fresh };
  }
  return {
    violations: [{
      code: 'STALE_GENERATED_FILE',
      file: 'leaf-manifest.json',
      message: `${path.basename(skillDir)}: leaf-manifest.json is stale (committed=${leafContract.digestManifestBytes(committed)} fresh=${digest})`,
    }],
    fixed: false,
    digest,
    freshBytes: fresh,
  };
}

/**
 * Project a standalone root's aliases from its manifest.
 *
 * A standalone root has exactly one workflow mode, so every alias row collapses
 * to that mode plus a resource whose id and disk path are the same string. The
 * rows therefore carry no information the manifest does not already hold, and
 * hand-maintaining them only creates a list that rots the next time a leaf lands.
 * Row order follows the manifest's own sorted order so the bytes are
 * reproducible; every consumer reads these rows as a set, never positionally.
 */
function buildAliasBytes(manifestBytes) {
  const manifest = JSON.parse(manifestBytes.toString('utf8'));
  const rows = [];
  for (const mode of manifest.modes || []) {
    for (const leaf of mode.leaves || []) {
      rows.push({ workflowMode: mode.workflowMode, leafResourceId: leaf, diskPath: leaf });
    }
  }
  return Buffer.from(`${JSON.stringify(rows, null, 2)}\n`);
}

/**
 * Check (and optionally write) the derived alias projection for a standalone
 * root. Hubs never reach here: their alias rows relocate resources across
 * packets and are authored, so a generator would destroy real information.
 */
function checkDerivedAliases(skillDir, presence, manifestBytes, fix) {
  const aliasPath = path.join(skillDir, 'leaf-aliases.json');
  const fresh = buildAliasBytes(manifestBytes);

  if (!presence['leaf-aliases.json']) {
    if (fix) {
      fs.writeFileSync(aliasPath, fresh);
      return { violations: [], fixed: true };
    }
    return { violations: [], fixed: false };
  }

  const committed = fs.readFileSync(aliasPath);
  if (Buffer.compare(committed, fresh) === 0) return { violations: [], fixed: false };
  if (fix) {
    fs.writeFileSync(aliasPath, fresh);
    return { violations: [], fixed: true };
  }
  return {
    violations: [{
      code: 'STALE_GENERATED_FILE',
      file: 'leaf-aliases.json',
      message: `${path.basename(skillDir)}: leaf-aliases.json does not match the projection of its leaf-manifest.json`,
    }],
    fixed: false,
  };
}

/**
 * Validate a hub's command-metadata.json against the core schema, resolving
 * choreography resources and command definition files on disk. Skipped when
 * the file is absent (presence is already the class contract's finding) or
 * unparseable (reported as one malformed-JSON violation instead).
 */
function checkCommandMetadata(skillDir) {
  const skillsDir = path.dirname(skillDir);
  const filePath = path.join(skillDir, 'command-metadata.json');
  if (!fs.existsSync(filePath)) return [];

  let entries;
  try {
    entries = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    return [{
      code: 'COMMAND_METADATA_INVALID',
      file: 'command-metadata.json',
      message: `${path.basename(skillDir)}: command-metadata.json is not valid JSON: ${err.message}`,
    }];
  }

  let registryModes = [];
  try {
    const registry = JSON.parse(fs.readFileSync(path.join(skillDir, 'mode-registry.json'), 'utf8'));
    registryModes = (registry.modes || []).map((m) => m && m.workflowMode).filter(Boolean);
  } catch {
    // A missing/broken registry is already an unclassifiable or missing-file
    // finding elsewhere; command validation proceeds with owner checks moot.
  }

  const repoRoot = path.dirname(path.dirname(skillsDir));
  const commandsDir = path.join(repoRoot, '.opencode', 'commands');

  const violations = commandSchema.validateCommandMetadata(entries, {
    skillId: path.basename(skillDir),
    registryModes,
    // Choreography resources are repo-root-relative per the contract, and every
    // authored entry resolves that way. The former skillDir fallback made a
    // hub-relative path silently valid too, contradicting the stated contract
    // and masking a wrong path — resolve against the repo root only.
    resourceExists: (rel) => fs.existsSync(path.join(repoRoot, rel)),
    commandExists: (commandId) => fs.existsSync(
      path.join(commandsDir, commandSchema.commandDefinitionRelPath(commandId)),
    ),
  });

  return violations.map((v) => ({
    code: `COMMAND_METADATA_${v.code}`,
    file: 'command-metadata.json',
    message: v.message,
  }));
}

function checkGraphMetadata(skillDir) {
  const skillId = path.basename(skillDir);
  const filePath = path.join(skillDir, 'graph-metadata.json');
  if (!fs.existsSync(filePath)) return { violations: [], notes: [] };

  let metadata;
  try {
    metadata = readJson(filePath);
  } catch (err) {
    return {
      violations: [{
        code: 'GRAPH_METADATA_INVALID',
        file: 'graph-metadata.json',
        message: `${skillId}: graph-metadata.json is not valid JSON: ${err.message}`,
      }],
      notes: [],
    };
  }

  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
    return {
      violations: [{
        code: 'GRAPH_METADATA_INVALID',
        file: 'graph-metadata.json',
        message: `${skillId}: graph-metadata.json must contain a JSON object`,
      }],
      notes: [],
    };
  }

  const violations = [];
  const notes = [];
  const unknown = Object.keys(metadata)
    .filter((key) => !GRAPH_METADATA_TOP_LEVEL_KEYS.has(key))
    .sort();
  if (unknown.length) {
    violations.push({
      code: 'GRAPH_METADATA_UNKNOWN_KEY',
      file: 'graph-metadata.json',
      message: `${skillId}: graph-metadata.json has unknown top-level key(s): ${unknown.join(', ')}`,
    });
  }

  const intentSignals = Array.isArray(metadata.intent_signals)
    ? metadata.intent_signals.filter((entry) => typeof entry === 'string')
    : [];
  const derived = metadata.derived && typeof metadata.derived === 'object' && !Array.isArray(metadata.derived)
    ? metadata.derived
    : {};
  const triggerPhrases = Array.isArray(derived.trigger_phrases)
    ? derived.trigger_phrases.filter((entry) => typeof entry === 'string')
    : [];

  if (intentSignals.length < 8) {
    violations.push({
      code: 'INTENT_SIGNALS_BELOW_FLOOR',
      file: 'graph-metadata.json',
      message: `${skillId}: intent_signals has ${intentSignals.length} entries; minimum is 8`,
    });
  }
  if (intentSignals.length === 0 && triggerPhrases.length === 0) {
    violations.push({
      code: 'INTENT_SIGNALS_AND_TRIGGERS_EMPTY',
      file: 'graph-metadata.json',
      message: `${skillId}: intent_signals and derived.trigger_phrases are both empty`,
    });
  }

  const intentSet = new Set(intentSignals.map((entry) => entry.trim().toLowerCase()).filter(Boolean));
  const triggerSet = new Set(triggerPhrases.map((entry) => entry.trim().toLowerCase()).filter(Boolean));
  const union = new Set([...intentSet, ...triggerSet]);
  const intersectionSize = [...intentSet].filter((entry) => triggerSet.has(entry)).length;
  const similarity = union.size === 0 ? 1 : intersectionSize / union.size;
  if (similarity < 0.05) {
    // These authored and derived fields may legitimately diverge, so review is
    // prompted without turning a useful reconciliation signal into red CI.
    notes.push({
      code: 'INTENT_SIGNALS_TRIGGER_RECONCILIATION',
      message: `${skillId}: intent_signals/derived.trigger_phrases Jaccard=${similarity.toFixed(3)}`,
    });
  }

  return { violations, notes };
}

/** Evaluate one root end to end: class, presence, identity, freshness. */
function checkRoot(skillDir, options = {}) {
  const fix = Boolean(options.fix);
  const skillId = path.basename(skillDir);
  const presence = readPresence(skillDir);
  const evaluation = rootContract.evaluateRoot(skillId, presence);
  const violations = [...evaluation.violations];
  const notes = [];
  let fixed = false;
  let digest = null;

  for (const nested of findNestedIdentities(skillDir)) {
    violations.push({
      code: 'NESTED_IDENTITY',
      file: nested,
      message: `${skillId}: nested advisor identity at ${nested} — a root projects exactly one identity`,
    });
  }

  const graphMetadata = checkGraphMetadata(skillDir);
  violations.push(...graphMetadata.violations);
  notes.push(...graphMetadata.notes);

  const writtenFiles = [];
  if (evaluation.skillClass !== null
      && rootContract.REQUIRED_BY_CLASS[evaluation.skillClass].includes('leaf-manifest.json')) {
    const manifest = checkGeneratedManifest(skillDir, presence, fix);
    violations.push(...manifest.violations);
    digest = manifest.digest || null;
    if (manifest.fixed) writtenFiles.push('leaf-manifest.json');

    // The alias projection depends on the manifest, so it only runs once the
    // manifest itself regenerated cleanly.
    if (manifest.freshBytes
        && rootContract.isGenerated('leaf-aliases.json', evaluation.skillClass)) {
      const aliases = checkDerivedAliases(skillDir, presence, manifest.freshBytes, fix);
      violations.push(...aliases.violations);
      if (aliases.fixed) writtenFiles.push('leaf-aliases.json');
    }

    // A --fix run resolves the absences evaluateRoot saw on the pre-fix presence
    // map, so those findings must not survive into the report.
    for (const written of writtenFiles) {
      for (let i = violations.length - 1; i >= 0; i -= 1) {
        if (violations[i].code === 'MISSING_GENERATED_FILE' && violations[i].file === written) {
          violations.splice(i, 1);
        }
      }
    }
    fixed = writtenFiles.length > 0;
  }

  // Hubs additionally get their command surface validated as data: entries
  // against the core schema, owner modes against the registry, choreography
  // resources and command definition files against the disk.
  if (evaluation.skillClass === rootContract.CLASS_HUB) {
    violations.push(...checkCommandMetadata(skillDir));
  }

  return {
    skill: skillId,
    skillDir,
    skillClass: evaluation.skillClass,
    reason: evaluation.reason,
    status: violations.length ? 'fail' : 'pass',
    fixed,
    written: writtenFiles,
    digest,
    violations,
    notes,
  };
}

/**
 * Run the fleet-wide skill-root metadata class gate over every discovered root.
 * @param {{ skillsDir?: string, fix?: boolean, skill?: string }} args Options;
 *   `skillsDir` overrides the discovery root, `fix` writes generated files in
 *   place, and `skill` scopes discovery to the one root whose basename
 *   matches — an authoring path (e.g. init_skill.py) can then pass
 *   `--fix --skill <name>` and prove the write touched only that root,
 *   instead of accepting the fleet-wide blast radius of an unscoped --fix.
 * @returns {number} Exit code: 0 clean, 1 violations found, 2 the gate could not run.
 */
function run(args) {
  const skillsDir = path.resolve(args.skillsDir || path.resolve(__dirname, '..', '..', '..'));
  // An existing non-directory (a regular file passed as --skills-dir) used to
  // reach the walker, get caught, and report a false-green zero-root pass.
  // Prove it is a real directory here so "cannot run" exits 2, never 0.
  let skillsStat;
  try {
    skillsStat = fs.statSync(skillsDir);
  } catch {
    skillsStat = null;
  }
  if (!skillsStat || !skillsStat.isDirectory()) {
    process.stderr.write(`ci-skill-root-metadata: skills dir not found or not a directory: ${skillsDir}\n`);
    return 2;
  }
  let roots = findSkillRoots(skillsDir);
  if (args.skill) {
    roots = roots.filter((dir) => path.basename(dir) === args.skill);
    if (roots.length === 0) {
      process.stderr.write(`ci-skill-root-metadata: --skill '${args.skill}' not found (or has no SKILL.md) under ${skillsDir}\n`);
      return 2;
    }
  }
  const results = roots.map((dir) => checkRoot(dir, { fix: args.fix }));
  const failed = results.filter((r) => r.status === 'fail');
  const fixedCount = results.filter((r) => r.fixed).length;

  if (args.format === 'json') {
    process.stdout.write(`${JSON.stringify({
      skillsDir,
      checked: results.length,
      passed: results.length - failed.length,
      failed: failed.length,
      fixed: fixedCount,
      byClass: {
        H: results.filter((r) => r.skillClass === rootContract.CLASS_HUB).map((r) => r.skill),
        S: results.filter((r) => r.skillClass === rootContract.CLASS_STANDALONE).map((r) => r.skill),
        unclassified: results.filter((r) => r.skillClass === null).map((r) => r.skill),
      },
      results: results.map(({ skillDir, ...rest }) => rest),
    }, null, 2)}\n`);
  } else {
    for (const r of results) {
      const label = r.skillClass || '?';
      if (r.status === 'pass') {
        process.stdout.write(`OK   [${label}] ${r.skill}${r.fixed ? `  (wrote ${r.written.join(', ')})` : ''}\n`);
      } else {
        process.stdout.write(`FAIL [${label}] ${r.skill}\n`);
        for (const v of r.violations) process.stdout.write(`       ${v.code}: ${v.message}\n`);
      }
      for (const note of r.notes) process.stdout.write(`NOTE [${note.code}] ${note.message}\n`);
    }
    process.stdout.write(`\nchecked=${results.length} passed=${results.length - failed.length} failed=${failed.length} fixed=${fixedCount}\n`);
    if (failed.length && !args.fix) {
      process.stdout.write('Re-run with --fix to regenerate missing or stale manifests; authored files must be written by hand.\n');
    }
  }
  return failed.length ? 1 : 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  findSkillRoots,
  readPresence,
  findNestedIdentities,
  isSkillShapedGraph,
  isSkillShapedDescription,
  buildAliasBytes,
  checkGeneratedManifest,
  checkDerivedAliases,
  checkGraphMetadata,
  checkCommandMetadata,
  checkRoot,
  run,
};

if (require.main === module) {
  process.exit(run(parseArgs(process.argv.slice(2))));
}
