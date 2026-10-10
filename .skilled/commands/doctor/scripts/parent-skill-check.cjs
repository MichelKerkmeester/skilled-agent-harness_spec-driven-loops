#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Parent Skill Check
// ───────────────────────────────────────────────────────────────────
'use strict';

/**
 * Read-only structural audit for the canonical "parent hub with nested
 * packets" pattern.
 *
 * A parent hub keeps ONE advisor identity at the hub and routes to N
 * non-discoverable packets through a declarative mode-registry, with a
 * hub-router describing how a prompt picks/bundles modes. Every packet is a
 * modes[] entry with a required packetKind discriminator (workflow | surface | transport);
 * surface packets are read-only, advisor-invisible evidence bases. Deep-loop's
 * 3-tier machinery is expressed as named `extensions` that activate in-place
 * fields, so the checks are family-agnostic: they run FULL on every hub and
 * only demand extension-specific fields when the hub declares that extension.
 *
 * Usage:
 *   node parent-skill-check.cjs [parent-skill-dir]
 *   PARENT_HUB_CHECK_STRICT=0 node parent-skill-check.cjs [dir]   # advisory findings as WARN
 *   PARENT_HUB_CHECK_COMMANDS_DIR=<dir> node parent-skill-check.cjs [dir]
 *     # resolve bound /ns:name commands from <dir>/<ns>/<name>.md instead of
 *     # the repository's .skilled/commands (lets a fixture tree exercise 3k)
 *
 * The audit checks hub-router and registry consistency, changelog shape,
 * required hub metadata, playbook and benchmark baseline, leaf-manifest
 * freshness and reachability, skill-root metadata class, and routing-version
 * consistency. PARENT_HUB_CHECK_STRICT=0 downgrades advisory findings only;
 * hard failures remain failures.
 *
 * Output: one `PASS: <id>: ...`, `FAIL: <id>: ...`, `WARN: <id>: ...` or
 * `INFO: <id>: ...` line per finding. This format is the documented exemption
 * from bracketed logging: the doctor workflow, CI and the test suites parse
 * the verdict prefix and invariant id at the start of each line.
 *
 * Tool exemption: 3k ignores NON_CAPABILITY_TOOLS (TodoWrite) when it compares
 * a bound command's allowed-tools with its mode's toolSurface.allowed, because
 * a tool that only manages the agent's own task list grants no capability over
 * the workspace and so cannot escalate the mode.
 *
 * Exit codes:
 *   0  every hard invariant passed (warnings allowed)
 *   1  at least one invariant failed
 *   2  target directory missing or unreadable, or the audit could not finish
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const EXIT_OK = 0;
const EXIT_INVARIANT_FAILED = 1;
const EXIT_CHECKER_ERROR = 2;

// Targets and helper paths are repo-root-relative. Resolving them against the
// directory holding .opencode, not process.cwd(), keeps a non-root working
// directory from false-failing 4a or missing the hub entirely.
function findRepoRoot(start) {
  let dir = start;
  while (dir !== path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, '.opencode'))) return dir;
    dir = path.dirname(dir);
  }
  return path.resolve(start, '../../../..');
}
const REPO_ROOT = findRepoRoot(__dirname);

// Families the skill-graph compiler accepts for a discoverable identity.
// Mirrors ALLOWED_FAMILIES in skill_graph_compiler.py / skill-graph-db.ts;
// a family outside this set makes the hub undiscoverable.
const ALLOWED_FAMILIES = ['cli', 'mcp', 'sk-code', 'sk-hub', 'deep-loop', 'sk-util', 'system'];

// The advisor reaches a mode through one of these classes; the registry
// declares it per mode so the projection maps stay auditable. 'metadata' is the
// default for new hubs and for every surface packet (advisor-invisible).
const VALID_ROUTING_CLASSES = ['lexical', 'alias-fold', 'metadata', 'command-bridge'];

// The graph-backed convergence loop keys consumed by a runtime-loop backend.
// null is the explicit value for host/adapter modes; only demanded when the hub
// declares the runtime-loop extension.
const VALID_RUNTIME_LOOP_TYPES = ['research', 'review', 'council', null];

// Read-only tool set a surface packet's toolSurface.allowed must stay within,
// and the tools every non-mutating packet (surface or transport) must forbid.
const SURFACE_ALLOWED_TOOLS = ['Read', 'Bash', 'Grep', 'Glob'];
const NON_MUTATING_FORBIDDEN_TOOLS = ['Write', 'Edit', 'Task'];

// Tools a command may grant beyond its mode without escalating it (3k).
// TodoWrite edits only the agent's own task list, never the workspace.
const NON_CAPABILITY_TOOLS = ['TodoWrite'];

// Directories allowed at a hub root without being a registered packet.
const DIRECTORY_ALLOWLIST = new Set([
  'shared', 'changelog', 'benchmark',
  'manual-testing-playbook', 'feature-catalog',
  'references', 'assets', 'node_modules', 'scripts', 'templates', 'dist', 'runtime', 'styles',
]);

// The deep-loop reference drift-guard. A hub with lexical/alias-fold modes must
// point at ITS OWN drift-guard (advisorRoutingContract.driftGuard or the
// advisor-projection extension); this is only the fallback for deep-loop.
const DEEP_LOOP_DRIFT_GUARD =
  '.skilled/skills/system-skill-advisor/runtime/tests/routing-registry-drift-guard.vitest.ts';

// Advisor entrypoint for the dynamic cross-check of the registry's lexical
// projection against the live hardcoded map.
const ADVISOR_SCRIPT =
  '.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py';
const ADVISOR_SCRIPT_ABS = path.resolve(REPO_ROOT, ADVISOR_SCRIPT);

// The advisor dump imports the scorer, which takes seconds on a cold cache.
// Past this budget the cross-check is reported as unable to run.
const ADVISOR_DUMP_TIMEOUT_MS = 15000;

// The single global advisor projection map only mirrors this hub, so the
// dynamic 4b equality check applies to it; every other hub gets the inert-route
// coverage check (4c) instead.
const GLOBAL_MAP_OWNER = 'system-deep-loop';

const DEFAULT_TARGET = '.skilled/skills/system-deep-loop';

// Shared contract libraries and the leaf-manifest generator live once in the
// repository under sk-doc. They are resolved from the repo root so a hub
// outside .skilled/skills, such as a fixture, audits against the same code.
const SK_CREATE_SKILL_SCRIPTS = path.join(REPO_ROOT, '.skilled', 'skills', 'sk-doc', 'sk-create-skill', 'scripts');
const LEAF_GENERATOR_PATH = path.join(SK_CREATE_SKILL_SCRIPTS, 'generate-leaf-manifest.cjs');
const LEAF_CONTRACT_PATH = path.join(SK_CREATE_SKILL_SCRIPTS, 'lib', 'leaf-resource-contract.cjs');
// The compiled-routing tree keeps one canary fixture per parent hub, each in a folder named `<number>-<hub>`.
const CANARY_FIXTURE_ROOT = path.join(REPO_ROOT, '.skilled/bin/lib/compiled-routing/009-parent-hub-rollout');
const ROOT_METADATA_CONTRACT_PATH = path.join(SK_CREATE_SKILL_SCRIPTS, 'lib', 'skill-root-metadata-contract.cjs');
const ROOT_ROUTER_CONTRACT_PATH = path.join(SK_CREATE_SKILL_SCRIPTS, 'lib', 'root-router-contract.cjs');

// Bound commands resolve from here; the override lets a fixture supply them.
const COMMANDS_DIR = process.env.PARENT_HUB_CHECK_COMMANDS_DIR
  ? path.resolve(process.env.PARENT_HUB_CHECK_COMMANDS_DIR)
  : path.join(REPO_ROOT, '.skilled', 'commands');

// A slash command id: /namespace:name, both kebab-case.
const COMMAND_PATTERN = /^\/([a-z][a-z0-9-]*):([a-z0-9-]+)$/;
const FOUR_PART_VERSION = /^[0-9]+(?:\.[0-9]+){3}$/;

// Advisory hub-canon findings are FAIL by default. The strict opt-out changes
// only their severity; hard failures remain failures.
const STRICT_HUB_CANON = process.env.PARENT_HUB_CHECK_STRICT !== '0';

// ─────────────────────────────────────────────────────────────────────────────
// 3. OUTPUT HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const IS_TTY = Boolean(process.stdout.isTTY);
function color(text, code) {
  return IS_TTY ? `\x1b[${code}m${text}\x1b[0m` : text;
}
const red = (s) => color(s, '31');
const green = (s) => color(s, '32');
const yellow = (s) => color(s, '33');
const blue = (s) => color(s, '34');

let fails = 0;
let warns = 0;
function pass(msg) {
  console.log(`${green('PASS')}: ${msg}`);
}
function fail(msg) {
  console.error(`${red('FAIL')}: ${msg}`);
  fails += 1;
}
function warn(msg) {
  console.error(`${yellow('WARN')}: ${msg}`);
  warns += 1;
}
function info(msg) {
  console.log(`${blue('INFO')}: ${msg}`);
}
// Canon severity: FAIL by default (STRICT_HUB_CANON), WARN only when a
// work-in-progress hub opts out via PARENT_HUB_CHECK_STRICT=0.
function softFail(msg) {
  (STRICT_HUB_CANON ? fail : warn)(msg);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. FILE AND PARSE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function describeJson(value) {
  if (value === null) return 'null';
  return Array.isArray(value) ? 'an array' : typeof value;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

// Parse a file that must hold a JSON object. A literal null or an array is a
// defect of the file, not an absent value, so it is returned as an error.
function readJsonObject(file) {
  let parsed;
  try {
    parsed = readJson(file);
  } catch (e) {
    return { value: null, error: `is not valid JSON: ${e.message}` };
  }
  if (!isPlainObject(parsed)) {
    return { value: null, error: `is not a JSON object (got ${describeJson(parsed)})` };
  }
  return { value: parsed, error: null };
}

function isDirectory(p) {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
}

function isSymlink(p) {
  try {
    return fs.lstatSync(p).isSymbolicLink();
  } catch {
    return false;
  }
}

// Recursively collect every regular file whose name is in `names`, keyed by name.
function collectFilesNamed(dir, names) {
  const found = new Map(names.map((name) => [name, []]));
  const stack = [dir];
  while (stack.length > 0) {
    const current = stack.pop();
    let entries;
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(full);
      } else if (entry.isFile() && found.has(entry.name)) {
        found.get(entry.name).push(full);
      }
    }
  }
  return found;
}

// Every changelog file that is a symlink, beneath a changelog/ directory.
function symlinkedChangelogs(root) {
  const out = [];
  const stack = [root];
  while (stack.length > 0) {
    const current = stack.pop();
    let entries;
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isSymbolicLink()) {
        if (current.split(path.sep).includes('changelog') || entry.name.startsWith('CHANGELOG')) {
          out.push(full);
        }
      } else if (entry.isDirectory() && entry.name !== 'node_modules') {
        stack.push(full);
      }
    }
  }
  return out;
}

// Flatten a validated leaf-manifest.json object into its (workflowMode,
// leafResourceId) pairs.
function manifestCompositePairs(manifestObject) {
  const pairs = [];
  for (const mode of (manifestObject && Array.isArray(manifestObject.modes) ? manifestObject.modes : [])) {
    for (const leaf of (Array.isArray(mode.leaves) ? mode.leaves : [])) {
      pairs.push({ workflowMode: mode.workflowMode, leafResourceId: leaf, packet: mode.packet });
    }
  }
  return pairs;
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Word-boundary match so a longer neighbouring id or command cannot satisfy a
// shorter one ("review" inside "sk-code-review", "/a:b" inside "/a:b-two").
function tokenPattern(token) {
  return new RegExp(`(^|[^A-Za-z0-9_-])${escapeRegExp(token)}([^A-Za-z0-9_-]|$)`);
}

// The id a mode-table row is about: the first identifier in its first cell,
// with markdown emphasis and code ticks stripped.
function firstCellId(row) {
  const cell = row.trim().replace(/^\|/, '').split('|')[0] || '';
  const match = cell.match(/^[\s*_`]*([A-Za-z0-9_.:-]+)/);
  return match ? match[1] : null;
}

function isToolSurface(ts) {
  return isPlainObject(ts) && Array.isArray(ts.allowed) && Array.isArray(ts.forbidden)
    && typeof ts.mutatesWorkspace === 'boolean' && Array.isArray(ts.bashAllowlist);
}

// A tool list from a toolSurface, or [] when the field is not an array; the
// malformed shape itself is reported once by 3d.
function toolList(ts, field) {
  return isPlainObject(ts) && Array.isArray(ts[field]) ? ts[field] : [];
}

// A packet value must name one directory directly under the hub.
function isDirectChildName(packet) {
  const trimmed = packet.replace(/[\\/]+$/, '');
  return trimmed.length > 0 && trimmed !== '.' && trimmed !== '..'
    && !/[\\/]/.test(trimmed) && !path.isAbsolute(packet);
}

// The tools a frontmatter `allowed-tools` field grants, read the three ways
// YAML writes a list: a flow list ([Read, Write]), a bare comma string
// (Read, Write) or a block sequence. Null when there is no field to read.
function parseAllowedTools(source) {
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!frontmatter) return null;
  const lines = frontmatter[1].split(/\r?\n/);
  const index = lines.findIndex((line) => /^allowed-tools:/.test(line));
  if (index === -1) return null;
  const inline = lines[index].slice('allowed-tools:'.length).replace(/\s+#.*$/, '').trim();
  const items = [];
  if (inline) {
    items.push(...inline.replace(/^\[/, '').replace(/\]$/, '').split(','));
  } else {
    for (const line of lines.slice(index + 1)) {
      const entry = line.match(/^\s+-\s*(.*)$/);
      if (!entry) break;
      items.push(entry[1]);
    }
  }
  return items.map((t) => t.trim().replace(/^(['"])(.*)\1$/, '$2').trim()).filter(Boolean);
}

function loadModule(file) {
  if (!fs.existsSync(file)) return { module: null, missing: true, error: null };
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    return { module: require(file), missing: false, error: null };
  } catch (e) {
    return { module: null, missing: false, error: e };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. IDENTITY CHECKS (1a-1c, 2a-2b)
// ─────────────────────────────────────────────────────────────────────────────

function checkIdentity(ctx) {
  const { target, basename } = ctx;
  const found = collectFilesNamed(target, ['graph-metadata.json', 'description.json']);
  const metaFiles = found.get('graph-metadata.json');
  const hubMeta = path.join(target, 'graph-metadata.json');

  if (metaFiles.length === 1 && metaFiles[0] === hubMeta) {
    pass('1a: exactly one graph-metadata.json, located at the hub root');
  } else if (metaFiles.length === 0) {
    fail('1a: no graph-metadata.json found — the hub has no discoverable identity');
  } else {
    const rel = metaFiles.map((f) => path.relative(target, f) || '.');
    fail(`1a: expected exactly one graph-metadata.json at the hub root; found ${metaFiles.length}: ${rel.join(', ')}`);
  }

  if (fs.existsSync(hubMeta)) {
    const { value: meta, error } = readJsonObject(hubMeta);
    if (error) {
      fail(`1b: hub graph-metadata.json ${error}`);
    } else {
      if (meta.skill_id === basename) {
        pass(`1b: hub skill_id "${meta.skill_id}" matches directory name`);
      } else {
        fail(`1b: hub skill_id "${meta.skill_id}" does not match directory name "${basename}"`);
      }
      if (ALLOWED_FAMILIES.includes(meta.family)) {
        pass(`1c: hub family "${meta.family}" is in the allowed set`);
      } else {
        fail(`1c: hub family "${meta.family}" not in allowed set {${ALLOWED_FAMILIES.join(', ')}}`);
      }
    }
  } else {
    fail('1b: no hub graph-metadata.json at the root — cannot check identity');
  }

  // 2a: a nested graph-metadata.json re-introduces a second identity.
  const nested = metaFiles.filter((f) => f !== hubMeta);
  if (nested.length === 0) {
    pass('2a: no nested graph-metadata.json inside any packet or shared/');
  } else {
    const rel = nested.map((f) => path.relative(target, f));
    fail(`2a: nested graph-metadata.json found (re-introduces a second identity): ${rel.join(', ')}`);
  }

  // 2b: the advisor identity is hub-only; a nested description.json is dead residue.
  const nestedDesc = found.get('description.json').filter((f) => f !== path.join(target, 'description.json'));
  if (nestedDesc.length === 0) {
    pass('2b: no nested description.json inside any packet or shared/');
  } else {
    const rel = nestedDesc.map((f) => path.relative(target, f));
    fail(`2b: nested description.json found (re-introduces a second advisor identity): ${rel.join(', ')}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. REGISTRY CHECKS (3a-3k)
// ─────────────────────────────────────────────────────────────────────────────

// 3a: load mode-registry.json and derive the per-hub facts later checks share.
function loadRegistry(ctx) {
  const registryPath = path.join(ctx.target, 'mode-registry.json');
  if (!fs.existsSync(registryPath)) {
    fail('3a: mode-registry.json is missing');
    return;
  }
  const { value, error } = readJsonObject(registryPath);
  if (error) {
    fail(`3a: mode-registry.json ${error}`);
    return;
  }
  pass('3a: mode-registry.json exists and parses as JSON');
  ctx.registry = value;
  ctx.extensions = isPlainObject(value.extensions) ? value.extensions : {};
  const declares = (name) => Object.prototype.hasOwnProperty.call(ctx.extensions, name);
  ctx.ext = {
    runtimeLoop: declares('runtime-loop'),
    advisorProjection: declares('advisor-projection'),
    surfaceAxis: declares('surface-axis'),
    transportAxis: declares('transport-axis'),
    commandSubworkflows: declares('command-subworkflows'),
  };
  ctx.rawModes = Array.isArray(value.modes) ? value.modes : [];
  ctx.modes = ctx.rawModes.filter(isPlainObject);
  ctx.registryModeSet = new Set(ctx.modes.map((m) => m.workflowMode).filter(Boolean));
}

function newModeState() {
  return {
    packetOk: true,
    discriminatorOk: true, // hard: workflowMode + backendKind presence
    canonOk: true, // canon (FAIL by default): packetKind, toolSurface, names, aliases, runtimeLoopType
    routingOk: true,
    surfaceOk: true,
    transportOk: true,
    transportCount: 0,
    writeOk: true,
    commandOk: true,
    commandsCompared: 0,
    folderNameOk: true, // folder == packetSkillName unless grandfatheredFolderMismatch
    frontmatterNameOk: true, // packet SKILL.md frontmatter name == packetSkillName
    frontmatterNamesChecked: 0,
    packetFilesOk: true, // each packet carries SKILL.md + README.md + changelog/
    aliasOk: true, // aliases unique across all modes
    aliasSeen: new Map(), // alias (lowercased) → first mode that declared it
  };
}

// 3c: every mode's packet value must be a DIRECT child sub-dir.
function checkModePacket(ctx, mode, label, state) {
  const { packet } = mode;
  if (!packet || typeof packet !== 'string') {
    fail(`3c: mode "${label}" has no packet value`);
    state.packetOk = false;
    return false;
  }
  if (!isDirectChildName(packet)) {
    fail(`3c: mode "${label}" packet "${packet}" must be a direct child directory (no absolute, nested, "." or "../" paths)`);
    state.packetOk = false;
    return false;
  }
  ctx.registeredPackets.add(packet.replace(/[\\/]+$/, ''));
  if (!isDirectory(path.join(ctx.target, packet))) {
    fail(`3c: mode "${label}" packet "${packet}" is not an existing sub-directory`);
    state.packetOk = false;
    return false;
  }
  return true;
}

// 3d: two-axis discriminator. HARD: workflowMode + backendKind presence.
// CANON (softFail): packetKind, grandfatheredFolderMismatch, packetSkillName
// and aliases, the fields each hub carries once it adopts the two-axis shape.
function checkModeDiscriminator(mode, label, state) {
  const kind = mode.packetKind;
  if (typeof mode.workflowMode !== 'string' || mode.workflowMode.length === 0) {
    fail(`3d: mode "${label}" is missing workflowMode`);
    state.discriminatorOk = false;
  }
  // backendKind is presence-checked only: hub families name their own
  // descriptive backends; the one constrained case is a surface packet (3g).
  if (typeof mode.backendKind !== 'string' || mode.backendKind.length === 0) {
    fail(`3d: mode "${label}" is missing backendKind`);
    state.discriminatorOk = false;
  }
  if (kind !== 'workflow' && kind !== 'surface' && kind !== 'transport') {
    softFail(`3d: mode "${label}" has invalid packetKind ${JSON.stringify(kind)} (expected "workflow", "surface", or "transport")`);
    state.canonOk = false;
  }
  if (typeof mode.grandfatheredFolderMismatch !== 'boolean') {
    softFail(`3d: mode "${label}" is missing the grandfatheredFolderMismatch boolean`);
    state.canonOk = false;
  }
  if (typeof mode.packetSkillName !== 'string' || mode.packetSkillName.length === 0) {
    softFail(`3d: mode "${label}" is missing packetSkillName (the packet SKILL.md name)`);
    state.canonOk = false;
  }
  if (!Array.isArray(mode.aliases) || mode.aliases.some((a) => typeof a !== 'string' || a.trim().length === 0)) {
    softFail(`3d: mode "${label}" is missing an aliases array of non-empty strings`);
    state.canonOk = false;
  }
}

// 3d-name: folder == packetSkillName unless the mismatch is explicitly
// grandfathered, and the packet SKILL.md frontmatter name agrees.
function checkModeNaming(ctx, mode, label, state, packetUsable) {
  if (typeof mode.packet !== 'string' || typeof mode.packetSkillName !== 'string') return;
  // A mode may not ship grandfatheredFolderMismatch:false while its folder and
  // packetSkillName actually diverge: that is a silent, un-grandfathered mismatch.
  const folderLeaf = mode.packet.replace(/[\\/]+$/, '').split(/[\\/]/).pop();
  const nameMismatch = folderLeaf !== mode.packetSkillName;
  if (mode.grandfatheredFolderMismatch === false && nameMismatch) {
    softFail(`3d-name: mode "${label}" folder "${folderLeaf}" != packetSkillName "${mode.packetSkillName}" but grandfatheredFolderMismatch is false (set it true to preserve a real mismatch)`);
    state.folderNameOk = false;
  } else if (mode.grandfatheredFolderMismatch === true && !nameMismatch) {
    softFail(`3d-name: mode "${label}" sets grandfatheredFolderMismatch:true but folder "${folderLeaf}" == packetSkillName (stale flag — set it false; a blanket-true flag would mask a real future mismatch)`);
    state.folderNameOk = false;
  }
  if (!packetUsable) return;
  // Missing frontmatter/name is owned by a separate check.
  const skillFile = path.join(ctx.target, mode.packet, 'SKILL.md');
  if (!fs.existsSync(skillFile) || !fs.statSync(skillFile).isFile()) return;
  const frontmatter = fs.readFileSync(skillFile, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  const nameMatch = frontmatter && frontmatter[1].match(/^name:\s*(.+)$/m);
  if (!nameMatch) return;
  const frontmatterName = nameMatch[1].trim().replace(/^(['"])(.*)\1$/, '$2').trim();
  state.frontmatterNamesChecked += 1;
  if (frontmatterName !== mode.packetSkillName) {
    softFail(`3d-name-frontmatter: packet "${mode.packet}" SKILL.md frontmatter name "${frontmatterName}" != packetSkillName "${mode.packetSkillName}"`);
    state.folderNameOk = false;
    state.frontmatterNameOk = false;
  }
}

// 3d-files: every packet carries its companion files.
function checkModeFiles(ctx, mode, state) {
  const pdir = path.join(ctx.target, mode.packet);
  for (const companion of ['SKILL.md', 'README.md']) {
    if (!fs.existsSync(path.join(pdir, companion))) {
      softFail(`3d-files: packet "${mode.packet}" is missing companion ${companion}`);
      state.packetFilesOk = false;
    }
  }
  if (!isDirectory(path.join(pdir, 'changelog'))) {
    softFail(`3d-files: packet "${mode.packet}" is missing a changelog/ directory`);
    state.packetFilesOk = false;
  }
}

// 3d-alias: aliases are unique across modes and lowercase. The router matches
// vocabulary case-folded, so a mixed-case alias cannot mirror its vocabulary
// class; that half is advisory (WARN) because live hubs still carry them.
function checkModeAliases(mode, label, state) {
  for (const a of (Array.isArray(mode.aliases) ? mode.aliases : [])) {
    if (typeof a !== 'string') continue;
    const key = a.toLowerCase();
    if (state.aliasSeen.has(key)) {
      softFail(`3d-alias: alias ${JSON.stringify(a)} on mode "${label}" duplicates mode "${state.aliasSeen.get(key)}" (aliases must be unique across modes)`);
      state.aliasOk = false;
    } else {
      state.aliasSeen.set(key, label);
    }
    if (a !== key) {
      warn(`3d-alias: alias ${JSON.stringify(a)} on mode "${label}" is not lowercase (router vocabulary is matched case-folded)`);
    }
  }
}

// 3d: toolSurface shape on every mode, and runtimeLoopType only where the
// runtime-loop extension activates it.
function checkModeToolSurface(ctx, mode, label, state) {
  if (!isToolSurface(mode.toolSurface)) {
    softFail(`3d: mode "${label}" has a malformed toolSurface (need {allowed[], forbidden[], mutatesWorkspace:bool, bashAllowlist[]})`);
    state.canonOk = false;
  }
  const hasLoopType = 'runtimeLoopType' in mode;
  if (ctx.ext.runtimeLoop && mode.packetKind === 'workflow') {
    if (!hasLoopType) {
      softFail(`3d: mode "${label}" is missing runtimeLoopType (runtime-loop extension declared; null is allowed, absence is not)`);
      state.canonOk = false;
    } else if (!VALID_RUNTIME_LOOP_TYPES.includes(mode.runtimeLoopType)) {
      softFail(`3d: mode "${label}" has invalid runtimeLoopType ${JSON.stringify(mode.runtimeLoopType)} (expected one of {research, review, council, null})`);
      state.canonOk = false;
    }
  } else if (hasLoopType && !ctx.ext.runtimeLoop) {
    softFail(`3d: mode "${label}" declares runtimeLoopType but the hub does not declare the runtime-loop extension`);
    state.canonOk = false;
  } else if (hasLoopType && !VALID_RUNTIME_LOOP_TYPES.includes(mode.runtimeLoopType)) {
    softFail(`3d: mode "${label}" declares runtimeLoopType ${JSON.stringify(mode.runtimeLoopType)} outside the valid set`);
    state.canonOk = false;
  }
}

// 3e: advisorRouting block with a valid routingClass.
function checkModeRouting(mode, label, state) {
  const routing = mode.advisorRouting;
  if (!isPlainObject(routing)) {
    fail(`3e: mode "${label}" is missing an advisorRouting block`);
    state.routingOk = false;
  } else if (!VALID_ROUTING_CLASSES.includes(routing.routingClass)) {
    fail(`3e: mode "${label}" has invalid routingClass ${JSON.stringify(routing.routingClass)} (expected one of {${VALID_ROUTING_CLASSES.join(', ')}})`);
    state.routingOk = false;
  }
}

// 3g: surface packets are read-only, evidence-base, advisor-invisible.
function checkSurfaceMode(mode, label, state) {
  const routing = mode.advisorRouting;
  const ts = mode.toolSurface;
  if (mode.backendKind !== 'evidence-base') {
    softFail(`3g: surface packet "${label}" must be backendKind "evidence-base" (got ${JSON.stringify(mode.backendKind)})`);
    state.surfaceOk = false;
  }
  if (isPlainObject(routing) && routing.routingClass !== 'metadata') {
    softFail(`3g: surface packet "${label}" must be routingClass "metadata" (advisor-invisible)`);
    state.surfaceOk = false;
  }
  if (!isPlainObject(ts)) return;
  if (ts.mutatesWorkspace !== false) {
    softFail(`3g: surface packet "${label}" toolSurface must be read-only (mutatesWorkspace:false)`);
    state.surfaceOk = false;
  }
  const strayAllowed = toolList(ts, 'allowed').filter((t) => !SURFACE_ALLOWED_TOOLS.includes(t));
  if (strayAllowed.length > 0) {
    softFail(`3g: surface packet "${label}" allows non-read-only tools [${strayAllowed.join(', ')}] (allowed ⊆ {${SURFACE_ALLOWED_TOOLS.join(', ')}})`);
    state.surfaceOk = false;
  }
  const forbidden = toolList(ts, 'forbidden');
  const missingForbidden = NON_MUTATING_FORBIDDEN_TOOLS.filter((t) => !forbidden.includes(t));
  if (missingForbidden.length > 0) {
    softFail(`3g: surface packet "${label}" must forbid [${missingForbidden.join(', ')}]`);
    state.surfaceOk = false;
  }
}

// 3h: transport packets bridge to an external tool's CLI/MCP surface:
// metadata-routed (advisor-invisible), non-mutating in THIS repo (writes
// land in the external tool), never orchestrating, and declared on the
// transport-axis extension so the axis is registered, not ad-hoc.
function checkTransportMode(ctx, mode, label, state) {
  const routing = mode.advisorRouting;
  const ts = mode.toolSurface;
  state.transportCount += 1;
  if (isPlainObject(routing) && routing.routingClass !== 'metadata') {
    softFail(`3h: transport packet "${label}" must be routingClass "metadata" (advisor-invisible)`);
    state.transportOk = false;
  }
  if (isPlainObject(ts) && ts.mutatesWorkspace !== false) {
    softFail(`3h: transport packet "${label}" toolSurface must be mutatesWorkspace:false (writes land in the external tool, not this repo)`);
    state.transportOk = false;
  }
  const forbidden = toolList(ts, 'forbidden');
  const missing = NON_MUTATING_FORBIDDEN_TOOLS.filter((t) => !forbidden.includes(t));
  if (missing.length > 0) {
    softFail(`3h: transport packet "${label}" must forbid [${missing.join(', ')}]`);
    state.transportOk = false;
  }
  const axis = ctx.extensions['transport-axis'];
  if (!isPlainObject(axis) || !Array.isArray(axis.transports) || !axis.transports.includes(mode.workflowMode)) {
    softFail(`3h: transport packet "${label}" is not declared in the transport-axis extension's transports[]`);
    state.transportOk = false;
  }
}

// 3i: a mode that grants Write must declare mutatesWorkspace:true (writing a
// file mutates the workspace) UNLESS it carries a writeScopeNote documenting a
// non-project Write scope (e.g. an ephemeral, untracked cache).
function checkWriteGrant(mode, label, state) {
  const ts = mode.toolSurface;
  if (!toolList(ts, 'allowed').includes('Write')) return;
  const annotated = typeof ts.writeScopeNote === 'string' && ts.writeScopeNote.trim().length > 0;
  if (ts.mutatesWorkspace !== true && !annotated) {
    softFail(`3i: mode "${label}" grants Write but is mutatesWorkspace:false with no writeScopeNote (Write mutates the workspace — set mutatesWorkspace:true or annotate a non-project Write scope)`);
    state.writeOk = false;
  }
}

// 3k: a bound command's frontmatter must not grant tools beyond the mode's
// toolSurface.allowed; the command is an entrypoint into the mode, and a wider
// grant silently escalates the mode's declared tool contract.
function checkCommandGrant(mode, label, state) {
  const ts = mode.toolSurface;
  if (typeof mode.command !== 'string' || !isPlainObject(ts) || !Array.isArray(ts.allowed)) return;
  const cm = mode.command.match(COMMAND_PATTERN);
  const cmdFile = cm ? path.join(COMMANDS_DIR, cm[1], `${cm[2]}.md`) : null;
  if (!cmdFile || !fs.existsSync(cmdFile)) return;
  const granted = parseAllowedTools(fs.readFileSync(cmdFile, 'utf8'));
  if (!granted) return;
  state.commandsCompared += 1;
  const modeAllowed = new Set(ts.allowed);
  const over = granted.filter((t) => !modeAllowed.has(t) && !NON_CAPABILITY_TOOLS.includes(t));
  if (over.length > 0) {
    softFail(`3k: command ${mode.command} frontmatter grants tool(s) [${over.join(', ')}] beyond mode "${label}" toolSurface.allowed`);
    state.commandOk = false;
  }
}

function reportModeState(ctx, state) {
  if (state.packetOk) pass('3c: every mode packet resolves to an existing sub-directory');
  if (state.discriminatorOk) pass('3d: every mode carries the hard discriminator (workflowMode + backendKind)');
  if (state.canonOk) pass('3d-canon: every mode carries packetKind + toolSurface + grandfatheredFolderMismatch + packetSkillName + aliases');
  if (state.folderNameOk) pass('3d-name: every mode folder matches packetSkillName (or is grandfathered)');
  if (state.frontmatterNameOk) pass(`3d-name-frontmatter: all ${state.frontmatterNamesChecked} packet SKILL.md frontmatter name(s) match packetSkillName`);
  if (state.packetFilesOk) pass('3d-files: every packet carries SKILL.md, README.md, and changelog/');
  if (state.aliasOk) pass(`3d-alias: all ${state.aliasSeen.size} aliases are unique across modes`);
  if (state.routingOk) pass('3e: every mode has an advisorRouting block with a valid routingClass');
  if (ctx.surfaceCount === 0) {
    info('3g: hub declares no surface packets');
  } else if (state.surfaceOk) {
    pass(`3g: all ${ctx.surfaceCount} surface packet(s) are read-only evidence-base and advisor-invisible`);
  }
  if (state.transportCount === 0) {
    info('3h: hub declares no transport packets');
  } else if (state.transportOk) {
    pass(`3h: all ${state.transportCount} transport packet(s) are metadata-routed, non-mutating and declared on the transport axis`);
  }
  if (state.writeOk) pass('3i: every mode that grants Write declares mutatesWorkspace:true or a writeScopeNote');
  if (state.commandsCompared === 0) {
    info('3k: no bound command declares an allowed-tools list to compare');
  } else if (state.commandOk) {
    pass(`3k: all ${state.commandsCompared} bound command(s) stay within their mode toolSurface.allowed`);
  }
}

// 3b-3k: per-mode registry contract.
function checkModes(ctx) {
  if (!ctx.registry) return;
  if (ctx.rawModes.length === 0) {
    fail('3b: mode-registry.json has no modes array');
    return;
  }
  pass(`3b: mode-registry.json declares ${ctx.rawModes.length} modes`);

  const state = newModeState();
  ctx.rawModes.forEach((mode, index) => {
    if (!isPlainObject(mode)) {
      fail(`3d: modes[${index}] is not an object (got ${describeJson(mode)})`);
      state.discriminatorOk = false;
      return;
    }
    const label = mode.workflowMode || '<unnamed>';
    if (mode.packetKind === 'surface') ctx.surfaceCount += 1;

    const packetUsable = checkModePacket(ctx, mode, label, state);
    checkModeDiscriminator(mode, label, state);
    checkModeNaming(ctx, mode, label, state, packetUsable);
    if (packetUsable) checkModeFiles(ctx, mode, state);
    checkModeAliases(mode, label, state);
    checkModeToolSurface(ctx, mode, label, state);
    checkModeRouting(mode, label, state);
    if (mode.packetKind === 'surface') checkSurfaceMode(mode, label, state);
    if (mode.packetKind === 'transport') checkTransportMode(ctx, mode, label, state);
    checkWriteGrant(mode, label, state);
    checkCommandGrant(mode, label, state);
  });
  reportModeState(ctx, state);
}

// Issues in the command-subworkflows extension and its declared entries.
function commandSubworkflowIssues(ctx, commandSubworkflows) {
  const cfg = ctx.extensions['command-subworkflows'];
  const registeredModeIds = new Set(ctx.modes.map((mode) => mode.workflowMode));
  const seenIds = new Set();
  const seenCommands = new Set();
  const issues = [];
  if (!isPlainObject(cfg) || cfg.declaredField !== 'commandSubworkflows') {
    issues.push('extension must declare declaredField "commandSubworkflows"');
  }
  if (commandSubworkflows.length === 0) {
    issues.push('commandSubworkflows must be a non-empty array');
  }
  for (const subworkflow of commandSubworkflows) {
    const id = isPlainObject(subworkflow) ? subworkflow.id : undefined;
    if (typeof id !== 'string' || id.length === 0) {
      issues.push('each command subworkflow needs a non-empty id');
      continue;
    }
    if (seenIds.has(id)) issues.push(`duplicate command subworkflow id "${id}"`);
    seenIds.add(id);
    if (registeredModeIds.has(id)) issues.push(`command subworkflow "${id}" must not also be a registered mode`);
    if (!registeredModeIds.has(subworkflow.ownerMode)) issues.push(`command subworkflow "${id}" has unknown ownerMode "${subworkflow.ownerMode}"`);
    if (typeof subworkflow.command !== 'string' || !COMMAND_PATTERN.test(subworkflow.command)) {
      issues.push(`command subworkflow "${id}" has an invalid command`);
    } else if (seenCommands.has(subworkflow.command)) {
      issues.push(`duplicate command subworkflow command "${subworkflow.command}"`);
    } else {
      seenCommands.add(subworkflow.command);
    }
    for (const field of ['contract', 'proceduresPath', 'referencesPath', 'assetsPath']) {
      const value = subworkflow[field];
      if (typeof value !== 'string' || value.length === 0 || !fs.existsSync(path.join(ctx.target, value))) {
        issues.push(`command subworkflow "${id}" ${field} does not resolve on disk`);
      }
    }
    if (typeof subworkflow.contract === 'string' && path.basename(subworkflow.contract) !== 'contract.md') {
      issues.push(`command subworkflow "${id}" contract must end in contract.md`);
    }
    if (!isToolSurface(subworkflow.toolSurface)) {
      issues.push(`command subworkflow "${id}" has a malformed toolSurface`);
    }
  }
  const declaredCommands = new Set(isPlainObject(cfg) && Array.isArray(cfg.commands) ? cfg.commands : []);
  if (declaredCommands.size !== seenCommands.size
      || [...declaredCommands].some((command) => !seenCommands.has(command))) {
    issues.push('extension commands[] must exactly match commandSubworkflows commands');
  }
  return issues;
}

// 3f: extensions-consistency: a declared extension activates its fields.
function checkExtensions(ctx) {
  if (!ctx.registry) return;
  const { extensions, ext } = ctx;
  let extOk = true;
  if (ext.surfaceAxis && ctx.surfaceCount === 0) {
    fail('3f: surface-axis extension declared but no packetKind "surface" mode exists');
    extOk = false;
  }
  if (!ext.surfaceAxis && ctx.surfaceCount > 0) {
    softFail('3f: surface packets present but the surface-axis extension is not declared');
    extOk = false;
  }
  if (ext.transportAxis) {
    const axis = extensions['transport-axis'];
    const listed = isPlainObject(axis) && Array.isArray(axis.transports) ? axis.transports : [];
    const kindByMode = new Map(ctx.modes.map((m) => [m.workflowMode, m.packetKind]));
    const unregistered = listed.filter((id) => kindByMode.get(id) !== 'transport');
    if (unregistered.length > 0) {
      softFail(`3f: transport-axis transports[] lists [${unregistered.map(String).join(', ')}], which are not registered packetKind "transport" modes`);
      extOk = false;
    }
  }
  if (ext.runtimeLoop && !isPlainObject(extensions['runtime-loop'])) {
    fail('3f: runtime-loop extension must be an object describing the convergence backend');
    extOk = false;
  }
  if (ext.advisorProjection) {
    const cfg = extensions['advisor-projection'];
    const guard = isPlainObject(cfg) ? cfg.driftGuard : null;
    if (!guard || typeof guard !== 'string') {
      fail('3f: advisor-projection extension must declare a driftGuard test path');
      extOk = false;
    }
  }
  const commandSubworkflows = Array.isArray(ctx.registry.commandSubworkflows)
    ? ctx.registry.commandSubworkflows
    : [];
  if (ext.commandSubworkflows) {
    const issues = commandSubworkflowIssues(ctx, commandSubworkflows);
    for (const issue of issues) fail(`3f: ${issue}`);
    if (issues.length > 0) extOk = false;
  } else if (commandSubworkflows.length > 0) {
    fail('3f: commandSubworkflows present but command-subworkflows extension is not declared');
    extOk = false;
  }
  const declared = Object.keys(extensions);
  if (extOk && declared.length > 0) {
    pass(`3f: extensions {${declared.join(', ')}} are internally consistent`);
  } else if (declared.length === 0) {
    info('3f: hub declares no extensions (pure 2-tier)');
  }
}

// 3j: the routing-only hub must grant exactly the tools its modes can use: no
// tool that NO mode declares (an over-grant like a stray Task the hub never
// dispatches to), and every tool some mode needs (so the hub can enact it).
function checkHubToolGrant(ctx) {
  if (!ctx.registry || ctx.rawModes.length === 0) return;
  let hubTools = null;
  try {
    hubTools = parseAllowedTools(fs.readFileSync(path.join(ctx.target, 'SKILL.md'), 'utf8'));
  } catch { /* missing SKILL.md is reported by an earlier structural check */ }
  if (!hubTools) {
    softFail('3j: could not read allowed-tools[] from the hub SKILL.md frontmatter');
    return;
  }
  const union = new Set();
  for (const mode of ctx.modes) {
    for (const t of toolList(mode.toolSurface, 'allowed')) union.add(t);
  }
  const overGrant = hubTools.filter((t) => !union.has(t));
  const underGrant = [...union].filter((t) => !hubTools.includes(t));
  if (overGrant.length === 0 && underGrant.length === 0) {
    pass('3j: hub allowed-tools equals the union of mode tool surfaces');
    return;
  }
  if (overGrant.length > 0) softFail(`3j: hub SKILL.md grants tool(s) no mode declares: [${overGrant.join(', ')}] (routing-only hub must not over-grant)`);
  if (underGrant.length > 0) softFail(`3j: hub SKILL.md is missing tool(s) a mode needs: [${underGrant.join(', ')}]`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. ADVISOR PROJECTION CHECKS (4a-4c)
// ─────────────────────────────────────────────────────────────────────────────

// 4a: drift-guard wired when the hub has lexical/alias-fold modes.
function checkDriftGuard(ctx, projectedModes) {
  const { registry, extensions } = ctx;
  // The hub's own declared drift-guard path (falls back to the deep-loop
  // reference only for the global-map owner).
  const contract = registry && isPlainObject(registry.advisorRoutingContract) ? registry.advisorRoutingContract : {};
  const projection = isPlainObject(extensions['advisor-projection']) ? extensions['advisor-projection'] : {};
  const rawGuard = contract.driftGuard
    || (ctx.ext.advisorProjection && projection.driftGuard)
    || (ctx.basename === GLOBAL_MAP_OWNER ? DEEP_LOOP_DRIFT_GUARD : null);
  // The driftGuard field may carry a path followed by descriptive prose; the
  // path is the first whitespace-delimited token.
  const declaredGuard = typeof rawGuard === 'string' ? rawGuard.trim().split(/\s+/)[0] : rawGuard;

  if (projectedModes.length === 0) {
    info('4a: hub declares no lexical/alias-fold modes — no advisor drift-guard required');
  } else if (!declaredGuard) {
    fail(`4a: hub has ${projectedModes.length} lexical/alias-fold mode(s) [${projectedModes.join(', ')}] but declares no driftGuard path (advisorRoutingContract.driftGuard or advisor-projection extension)`);
  } else if (fs.existsSync(path.resolve(REPO_ROOT, declaredGuard))) {
    pass(`4a: routing-registry drift-guard present at ${declaredGuard}`);
  } else {
    fail(`4a: declared drift-guard test missing at ${declaredGuard} — registry/maps parity is unguarded`);
  }
}

// The advisor's live lexical map, or null after reporting why it is unavailable.
// A lexical projection that cannot be verified is a failure, not a skip: the
// cross-check is the only gate that reads the map the advisor actually serves.
function dumpAdvisorMap() {
  if (!fs.existsSync(ADVISOR_SCRIPT_ABS)) {
    fail(`4b: advisor script not found at ${ADVISOR_SCRIPT}; the lexical projection cannot be verified`);
    return null;
  }
  try {
    const raw = execFileSync('python3', [ADVISOR_SCRIPT_ABS, '--dump-routing-maps'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      timeout: ADVISOR_DUMP_TIMEOUT_MS,
    });
    return JSON.parse(raw).DEEP_ROUTING_MODE_BY_KEY || {};
  } catch (e) {
    fail(`4b: could not dump advisor routing maps (${e.message.split('\n')[0]}); the lexical projection cannot be verified`);
    return null;
  }
}

// 4b/4c: dynamic cross-check against the live advisor map.
function checkAdvisorMap(ctx, lexicalIds) {
  const ids = Object.keys(lexicalIds);
  if (ids.length === 0) {
    info('4b: registry declares no lexical modes; nothing to cross-check against the advisor');
    return;
  }
  const dumped = dumpAdvisorMap();
  if (!dumped) return;
  if (ctx.basename === GLOBAL_MAP_OWNER) {
    const expectedKeys = [...ids].sort();
    const dumpedKeys = Object.keys(dumped).sort();
    const match = expectedKeys.length === dumpedKeys.length && expectedKeys.every((k) => dumped[k] === lexicalIds[k]);
    if (match) {
      pass(`4b: registry lexical projection matches advisor DEEP_ROUTING_MODE_BY_KEY (${expectedKeys.length} keys)`);
    } else {
      fail(`4b: registry lexical projection ${JSON.stringify(lexicalIds)} != advisor DEEP_ROUTING_MODE_BY_KEY ${JSON.stringify(dumped)}`);
    }
    return;
  }
  const inert = ids.filter((id) => !(id in dumped));
  if (inert.length === 0) {
    pass(`4c: all ${ids.length} lexical mode(s) are wired into the advisor projection map`);
  } else {
    warn(`4c: ${inert.length} lexical mode(s) are INERT — legacyAdvisorId(s) [${inert.join(', ')}] absent from the advisor's map; wire them into the Python/TS maps + a per-skill drift-guard or they will not route`);
  }
}

function checkAdvisorProjection(ctx) {
  const projectedModes = [];
  const lexicalIds = {};
  for (const mode of ctx.modes) {
    const routing = mode.advisorRouting;
    if (!isPlainObject(routing)) continue;
    if (routing.routingClass === 'lexical' || routing.routingClass === 'alias-fold') {
      projectedModes.push(mode.workflowMode);
    }
    if (routing.routingClass === 'lexical' && routing.legacyAdvisorId) {
      lexicalIds[routing.legacyAdvisorId] = mode.workflowMode;
    }
  }
  checkDriftGuard(ctx, projectedModes);
  checkAdvisorMap(ctx, lexicalIds);
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. HUB-ROUTER CHECKS (5a-5j)
// ─────────────────────────────────────────────────────────────────────────────

function loadHubRouter(target) {
  const routerPath = path.join(target, 'hub-router.json');
  if (!fs.existsSync(routerPath)) return { exists: false, value: null, error: null };
  return { exists: true, ...readJsonObject(routerPath) };
}

function signalEntries(signals) {
  return Object.values(signals).filter(isPlainObject);
}

// 5b: routerSignals keys ↔ registry workflowModes, bidirectional.
function checkRouterSignals(ctx, signals) {
  const signalKeys = new Set(Object.keys(signals));
  const missingSignals = [...ctx.registryModeSet].filter((m) => !signalKeys.has(m));
  const straySignals = [...signalKeys].filter((m) => !ctx.registryModeSet.has(m));
  if (missingSignals.length === 0 && straySignals.length === 0) {
    pass(`5b: routerSignals keys match the registry workflowMode set (${signalKeys.size})`);
  } else {
    softFail(`5b: routerSignals ↔ registry mismatch — missing signals for [${missingSignals.join(', ') || 'none'}], stray signals [${straySignals.join(', ') || 'none'}]`);
  }
}

// 5c: every class referenced by a signal exists in vocabularyClasses.
function checkVocabularyClasses(allSignals, classes) {
  const referenced = new Set();
  for (const sig of allSignals) {
    for (const c of (Array.isArray(sig.classes) ? sig.classes : [])) referenced.add(c);
  }
  const missingClasses = [...referenced].filter((c) => !(c in classes));
  if (missingClasses.length === 0) {
    pass(`5c: all ${referenced.size} referenced vocabulary classes are defined`);
  } else {
    softFail(`5c: routerSignals reference undefined vocabulary class(es): [${missingClasses.join(', ')}]`);
  }
}

// 5d: resources referenced by signals and the default resource resolve on disk.
function checkRouterResources(ctx, allSignals, policy) {
  const missing = [];
  const probe = (r) => {
    if (!fs.existsSync(path.join(ctx.target, r))) missing.push(r);
  };
  for (const sig of allSignals) {
    for (const r of (Array.isArray(sig.resources) ? sig.resources : [])) probe(r);
  }
  for (const r of (Array.isArray(policy.defaultResource) ? policy.defaultResource : [])) probe(r);
  if (missing.length === 0) {
    pass('5d: every router resource path resolves on disk');
  } else {
    softFail(`5d: router resource path(s) missing on disk: [${[...new Set(missing)].join(', ')}]`);
  }
}

// 5e: tieBreak is an exact permutation of the registered modes.
function checkTieBreakPermutation(ctx, tieBreak) {
  const modeSet = ctx.registryModeSet;
  const tieMissing = [...modeSet].filter((m) => !tieBreak.includes(m));
  const tieCounts = new Map();
  for (const mode of tieBreak) tieCounts.set(mode, (tieCounts.get(mode) || 0) + 1);
  const tieExtras = [...tieCounts.keys()].filter((m) => !modeSet.has(m));
  const tieDuplicates = [...tieCounts.entries()].filter(([, count]) => count > 1).map(([m]) => m);
  if (modeSet.size > 0 && tieMissing.length === 0 && tieExtras.length === 0
      && tieDuplicates.length === 0 && tieBreak.length === modeSet.size) {
    pass('5e: routerPolicy.tieBreak covers every registered mode');
  } else {
    softFail(`5e: routerPolicy.tieBreak is not an exact permutation of registry modes — extras: [${tieExtras.join(', ') || 'none'}], duplicates: [${tieDuplicates.join(', ') || 'none'}], missing: [${tieMissing.join(', ') || 'none'}], length: ${tieBreak.length} (expected ${modeSet.size})`);
  }
}

// 5f: bundleRules reference real modes; surfaceBundle present when surfaces exist.
function checkBundleRules(ctx, policy, outcomes) {
  const bundleRules = Array.isArray(policy.bundleRules) ? policy.bundleRules : [];
  const badRefs = [];
  for (const rule of bundleRules.filter(isPlainObject)) {
    // A bundle rule names the modes it binds: whenPrimary (the primary workflow
    // mode), includeSurfaces (surface packets attached as evidence), and whenAll
    // (co-required workflow modes for an ordered bundle). Every named mode must be
    // a real registry mode, else the rule silently binds nothing.
    const refs = [].concat(
      typeof rule.whenPrimary === 'string' ? [rule.whenPrimary] : [],
      Array.isArray(rule.includeSurfaces) ? rule.includeSurfaces : [],
      Array.isArray(rule.whenAll) ? rule.whenAll : [],
    ).filter((x) => typeof x === 'string');
    for (const m of refs) if (!ctx.registryModeSet.has(m)) badRefs.push(m);
  }
  if (badRefs.length > 0) {
    softFail(`5f: bundleRules reference unknown mode(s): [${[...new Set(badRefs)].join(', ')}]`);
  } else if (ctx.surfaceCount === 0) {
    pass('5f: bundleRules reference real modes');
  } else if (outcomes.surfaceBundle) {
    pass('5f: surfaceBundle outcome declared and bundleRules reference real modes');
  } else {
    softFail('5f: hub has surface packets but routerPolicy.outcomes.surfaceBundle is not declared');
  }
}

// 5g: the three base outcomes are the universal router contract, required for
// every hub regardless of axis; surfaceBundle is the only axis-conditional one (5f).
function checkBaseOutcomes(outcomes) {
  const missingOutcomes = ['single', 'orderedBundle', 'defer'].filter((o) => !outcomes[o]);
  if (missingOutcomes.length === 0) {
    pass('5g: base router outcomes present (single, orderedBundle, defer)');
  } else {
    softFail(`5g: routerPolicy.outcomes is missing base outcome(s): [${missingOutcomes.join(', ')}]`);
  }
}

// 5h: defaultMode is a registered workflowMode or explicit null.
function checkDefaultMode(ctx, policy) {
  if (!('defaultMode' in policy)) {
    softFail('5h: routerPolicy.defaultMode is absent (must be a registered workflowMode or explicit null)');
  } else if (policy.defaultMode === null) {
    pass('5h: routerPolicy.defaultMode is null (surface-primary or no default)');
  } else if (ctx.registryModeSet.has(policy.defaultMode)) {
    pass(`5h: routerPolicy.defaultMode "${policy.defaultMode}" is a registered mode`);
  } else {
    softFail(`5h: routerPolicy.defaultMode ${JSON.stringify(policy.defaultMode)} is not a registered workflowMode (must be a real mode or null)`);
  }
}

// 5i: tie-break lists workflow modes before surface/transport modes: process
// selection is primary, evidence and transport secondary.
function checkTieBreakOrder(ctx, tieBreak) {
  const kindByMode = new Map(ctx.modes.map((m) => [m.workflowMode, m.packetKind]));
  let firstNonWorkflow = null;
  for (const m of tieBreak) {
    const k = kindByMode.get(m);
    if (k && k !== 'workflow') {
      if (!firstNonWorkflow) firstNonWorkflow = m;
    } else if (k === 'workflow' && firstNonWorkflow) {
      softFail(`5i: tieBreak places workflow mode "${m}" after non-workflow mode "${firstNonWorkflow}" (workflow modes must sort first)`);
      return;
    }
  }
  if (tieBreak.length > 0) pass('5i: tieBreak orders workflow modes before surface/transport modes');
}

// 5j: command-subworkflow router signals exactly mirror their registry declarations.
function checkSubworkflowSignals(ctx, subworkflowSignals) {
  const declared = new Map(
    (ctx.registry && Array.isArray(ctx.registry.commandSubworkflows) ? ctx.registry.commandSubworkflows : [])
      .filter(isPlainObject)
      .map((subworkflow) => [subworkflow.id, subworkflow]),
  );
  const signalKeys = new Set(Object.keys(subworkflowSignals));
  const missing = [...declared.keys()].filter((id) => !signalKeys.has(id));
  const stray = [...signalKeys].filter((id) => !declared.has(id));
  const mismatched = [];
  for (const [id, entry] of declared) {
    const signal = subworkflowSignals[id];
    if (!signal) continue;
    if (signal.ownerMode !== entry.ownerMode || signal.command !== entry.command) mismatched.push(id);
  }
  if (missing.length > 0 || stray.length > 0 || mismatched.length > 0) {
    softFail(`5j: command subworkflow routing mismatch — missing: [${missing.join(', ') || 'none'}], stray: [${stray.join(', ') || 'none'}], owner/command mismatch: [${mismatched.join(', ') || 'none'}]`);
  } else if (declared.size > 0) {
    pass(`5j: commandSubworkflowSignals match all ${declared.size} registry declaration(s)`);
  } else {
    info('5j: hub declares no command subworkflows');
  }
}

// 5k: the lexical surfaces of a hub must agree with one another. The alias leg
// checks each registry alias against the keywords of its routerSignal classes.
// The packet leg checks each mode packet against the description keywords. The
// canary leg checks that each routerSignals mode is the expected route of a case
// in the hub's canary fixture.
function findCanaryFixtureDir(basename) {
  if (!isDirectory(CANARY_FIXTURE_ROOT)) return null;
  const pattern = new RegExp(`^\\d+-${escapeRegExp(basename)}$`);
  const name = fs.readdirSync(CANARY_FIXTURE_ROOT).find((entry) => pattern.test(entry)
    && isDirectory(path.join(CANARY_FIXTURE_ROOT, entry)));
  return name ? path.join(CANARY_FIXTURE_ROOT, name) : null;
}

function aliasDrift(ctx, signals, classes) {
  const drift = [];
  for (const mode of ctx.modes) {
    const signal = signals[mode.workflowMode];
    if (typeof mode.workflowMode !== 'string' || !isPlainObject(signal) || !Array.isArray(mode.aliases)) continue;
    const vocabulary = new Set();
    for (const cls of Array.isArray(signal.classes) ? signal.classes : []) {
      if (!(cls in classes) || !isPlainObject(classes[cls]) || !Array.isArray(classes[cls].keywords)) continue;
      for (const keyword of classes[cls].keywords) {
        if (typeof keyword === 'string') vocabulary.add(keyword.toLowerCase());
      }
    }
    for (const alias of mode.aliases) {
      if (typeof alias === 'string' && !vocabulary.has(alias.toLowerCase())) {
        drift.push(`"${mode.workflowMode}": "${alias}" is not a keyword of its routerSignal classes`);
      }
    }
  }
  return drift;
}

function packetDrift(ctx) {
  const keywords = new Set(ctx.description.keywords
    .filter((keyword) => typeof keyword === 'string')
    .map((keyword) => keyword.toLowerCase()));
  const drift = [];
  for (const mode of ctx.modes) {
    if (typeof mode.packet !== 'string') continue;
    if (!keywords.has(mode.packet.toLowerCase())) {
      drift.push(`"${mode.workflowMode}": packet "${mode.packet}" is not a description keyword`);
    }
  }
  return drift;
}

function canaryDrift(signals, cases) {
  const routed = new Set();
  for (const testCase of cases) {
    if (testCase.expectedAction !== 'route' || !Array.isArray(testCase.expectedModes)) continue;
    for (const mode of testCase.expectedModes) routed.add(mode);
  }
  return Object.keys(signals)
    .filter((mode) => !routed.has(mode))
    .map((mode) => `"${mode}": no canary case routes to it`);
}

// A listed leg reports its drift as a warning; every other leg fails on it.
function reportParityLeg(ctx, leg, drift, okMessage) {
  if (drift.length === 0) {
    pass(`5k-${leg}: ${okMessage}`);
    return;
  }
  const warnOnly = Object.prototype.hasOwnProperty.call(VOCABULARY_PARITY_WARN_ONLY, ctx.basename)
    && VOCABULARY_PARITY_WARN_ONLY[ctx.basename].includes(leg);
  for (const item of drift) {
    if (warnOnly) warn(`5k-${leg}: ${item}`);
    else softFail(`5k-${leg}: ${item}`);
  }
}

function checkVocabularyParity(ctx) {
  const router = ctx.hubRouter.value;
  if (!ctx.hubRouter.exists || !router) return;
  if (!ctx.registry || !Array.isArray(ctx.registry.modes)) return;
  const signals = isPlainObject(router.routerSignals) ? router.routerSignals : {};
  const classes = isPlainObject(router.vocabularyClasses) ? router.vocabularyClasses : {};

  reportParityLeg(ctx, 'alias', aliasDrift(ctx, signals, classes),
    'every registry alias is a keyword of its routerSignal classes');

  if (ctx.description && Array.isArray(ctx.description.keywords)) {
    reportParityLeg(ctx, 'packet', packetDrift(ctx), 'every mode packet is a description keyword');
  }

  const fixtureDir = findCanaryFixtureDir(ctx.basename);
  if (!fixtureDir) {
    info(`5k-canary: no compiled-routing canary fixture for hub "${ctx.basename}", leg not applicable`);
    return;
  }
  let cases;
  try {
    const parsed = JSON.parse(fs.readFileSync(path.join(fixtureDir, 'fixtures', 'canary-cases.v1.json'), 'utf8'));
    cases = Array.isArray(parsed.cases) ? parsed.cases.filter(isPlainObject) : [];
  } catch (e) {
    softFail(`5k-canary: canary fixture for "${ctx.basename}" cannot be read or parsed: ${e.message.split('\n')[0]}`);
    return;
  }
  reportParityLeg(ctx, 'canary', canaryDrift(signals, cases),
    'every routerSignals mode is the expected route of a canary case');
}

// These hubs already carry vocabulary drift on the listed legs. Until that drift
// is repaired, a listed leg reports it as a warning. Drift on any other hub or
// leg fails the check.
const VOCABULARY_PARITY_WARN_ONLY = { 'mcp-tooling': ['alias'], 'sk-design': ['alias', 'packet'], 'sk-doc': ['alias'], 'system-deep-loop': ['alias'] };

function checkHubRouter(ctx) {
  const { exists, value: router, error } = ctx.hubRouter;
  if (!exists) {
    softFail('5a: hub-router.json is missing — vocab-sync silently no-ops without it');
    return;
  }
  if (error) {
    softFail(`5a: hub-router.json ${error}`);
    return;
  }
  pass('5a: hub-router.json exists and parses as JSON');
  const signals = isPlainObject(router.routerSignals) ? router.routerSignals : {};
  const subworkflowSignals = isPlainObject(router.commandSubworkflowSignals) ? router.commandSubworkflowSignals : {};
  const classes = isPlainObject(router.vocabularyClasses) ? router.vocabularyClasses : {};
  const policy = isPlainObject(router.routerPolicy) ? router.routerPolicy : {};
  const outcomes = isPlainObject(policy.outcomes) ? policy.outcomes : {};
  const tieBreak = Array.isArray(policy.tieBreak) ? policy.tieBreak : [];
  const allSignals = [...signalEntries(signals), ...signalEntries(subworkflowSignals)];

  checkRouterSignals(ctx, signals);
  checkVocabularyClasses(allSignals, classes);
  checkRouterResources(ctx, allSignals, policy);
  checkTieBreakPermutation(ctx, tieBreak);
  checkBundleRules(ctx, policy, outcomes);
  checkBaseOutcomes(outcomes);
  checkDefaultMode(ctx, policy);
  checkTieBreakOrder(ctx, tieBreak);
  checkSubworkflowSignals(ctx, subworkflowSignals);
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. DIRECTORY AND MODE-TABLE CHECKS (6a-6c)
// ─────────────────────────────────────────────────────────────────────────────

// 6a: registry ↔ directory reverse consistency.
function checkDirectoryConsistency(ctx) {
  let childDirs = [];
  try {
    childDirs = fs.readdirSync(ctx.target, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name);
  } catch { /* the target was proven readable before any check ran */ }
  const unregistered = childDirs.filter((d) => !DIRECTORY_ALLOWLIST.has(d) && !ctx.registeredPackets.has(d) && !d.startsWith('.'));
  if (childDirs.length === 0) {
    info('6a: no child directories to reconcile');
  } else if (unregistered.length === 0) {
    pass('6a: every hub child directory is a registered packet or an allowlisted support dir');
  } else {
    softFail(`6a: child director(ies) neither registered as a packet nor allowlisted: [${unregistered.join(', ')}]`);
  }
}

// Table rows of the hub SKILL.md outside fenced blocks; fences hold examples,
// not the contract.
function modeTableRows(source) {
  let fenced = false;
  return source.split('\n').filter((line) => {
    if (/^\s*```/.test(line)) {
      fenced = !fenced;
      return false;
    }
    return !fenced && line.trimStart().startsWith('|');
  });
}

// 6c: each registered command appears in the row that documents its mode.
// The row whose first cell is the mode id owns it. A mode with no row of its
// own (documented inside a neighbouring row's prose) is satisfied by any row
// that names it and shows the command. A mode the registry routes by alias
// (command: null) stays free to say "routes via aliases".
function checkModeTableCommands(ctx, rows) {
  const mismatches = [];
  for (const mode of ctx.modes) {
    if (typeof mode.workflowMode !== 'string' || !mode.workflowMode) continue;
    if (typeof mode.command !== 'string' || !mode.command) continue;
    const own = rows.find((r) => firstCellId(r) === mode.workflowMode);
    const mentionsMode = tokenPattern(mode.workflowMode);
    const candidates = own ? [own] : rows.filter((r) => mentionsMode.test(r));
    if (candidates.length === 0) continue; // 6b reports the absent mode
    const showsCommand = tokenPattern(mode.command);
    if (!candidates.some((r) => showsCommand.test(r))) {
      mismatches.push(`${mode.workflowMode} (registry declares "${mode.command}")`);
    }
  }
  if (mismatches.length === 0) {
    pass('6c: every mode-table row whose registry entry declares a command shows that exact command');
  } else {
    softFail(`6c: mode-table command column disagrees with the registry, hiding a working command: [${mismatches.join(', ')}]`);
  }
}

// 6b: the hub SKILL.md is the fallback discovery surface when the advisor is
// unreachable, so every registered mode must be named in its mode table.
// Deliberately row-level, not first-cell: several hubs document a mode inside
// a neighbouring row's prose, so this asserts presence in the table and
// nothing about accuracy (6c covers the command column).
function checkModeTable(ctx) {
  const hubSkillPath = path.join(ctx.target, 'SKILL.md');
  if (!fs.existsSync(hubSkillPath)) {
    info('6b: no hub SKILL.md to reconcile');
    return;
  }
  const rows = modeTableRows(fs.readFileSync(hubSkillPath, 'utf8'));
  if (rows.length === 0) {
    info('6b: hub SKILL.md documents no modes in a table; per-mode reconciliation skipped');
    return;
  }
  const undocumented = [...ctx.registryModeSet].filter((m) => {
    const pattern = tokenPattern(String(m));
    return !rows.some((r) => pattern.test(r));
  });
  if (undocumented.length === 0) {
    pass(`6b: every registered mode (${ctx.registryModeSet.size}) appears in the hub SKILL.md mode table`);
  } else {
    softFail(`6b: mode(s) registered but absent from the hub SKILL.md mode table: [${undocumented.join(', ')}]`);
  }
  checkModeTableCommands(ctx, rows);
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. HUB COMPANION CHECKS (7a, 8a-8b, 9a-9b)
// ─────────────────────────────────────────────────────────────────────────────

// 7a: changelog shape: a real directory of real files, no symlinks.
function checkChangelog(ctx) {
  const hubChangelog = path.join(ctx.target, 'changelog');
  if (!fs.existsSync(hubChangelog)) {
    softFail('7a: hub has no changelog/ directory');
  } else if (isSymlink(hubChangelog)) {
    softFail('7a: hub changelog/ is a symlink (policy: real directories only)');
  } else if (!isDirectory(hubChangelog)) {
    softFail('7a: hub changelog is not a directory (policy: a real changelog/ directory of real files)');
  } else {
    ctx.changelogIsDirectory = true;
    const links = symlinkedChangelogs(ctx.target);
    if (links.length === 0) {
      pass('7a: all changelog entries are real files (no symlinks)');
    } else {
      const rel = links.map((f) => path.relative(ctx.target, f));
      softFail(`7a: symlinked changelog entr(ies) found (policy: real files only): [${rel.join(', ')}]`);
    }
  }
}

// 8a/8b: description.json present, well-formed, and free of registry-owned keys.
function checkDescription(ctx) {
  const descPath = path.join(ctx.target, 'description.json');
  if (!fs.existsSync(descPath)) {
    softFail('8a: description.json is missing (required for all hubs)');
    return;
  }
  const { value: desc, error } = readJsonObject(descPath);
  if (error) {
    softFail(`8a: description.json ${error}`);
    return;
  }
  ctx.description = desc;
  const missing = ['name', 'description', 'version', 'keywords'].filter((k) => !(k in desc));
  if (missing.length === 0 && Array.isArray(desc.keywords)) {
    pass('8a: description.json present with the required fields');
  } else {
    softFail(`8a: description.json missing field(s): [${missing.join(', ')}]`);
  }
  // modes[]/backend_kinds belong to the mode-registry; a copy here is a second
  // source of truth that drifts silently.
  const registryOwned = ['modes', 'backend_kinds'].filter((k) => k in desc);
  if (registryOwned.length === 0) {
    pass('8b: description.json carries no registry-owned duplicate keys');
  } else {
    softFail(`8b: description.json carries registry-owned key(s) [${registryOwned.join(', ')}] — mode-registry.json is the single source of truth; remove them`);
  }
}

// 9a/9b: manual-testing-playbook/ and benchmark baseline.
function checkPlaybookAndBenchmark(ctx) {
  if (fs.existsSync(path.join(ctx.target, 'manual-testing-playbook'))) {
    pass('9a: manual-testing-playbook/ present');
  } else {
    softFail('9a: manual-testing-playbook/ is missing');
  }
  if (fs.existsSync(path.join(ctx.target, 'benchmark'))) {
    pass('9b: benchmark/ baseline present');
  } else {
    softFail('9b: benchmark/ baseline is missing');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 11. LEAF-MANIFEST CHECKS (10a-10d)
// ─────────────────────────────────────────────────────────────────────────────

function loadLeafManifest(target) {
  const file = path.join(target, 'leaf-manifest.json');
  if (!fs.existsSync(file)) return { exists: false, bytes: null, value: null, error: null };
  let bytes;
  try {
    bytes = fs.readFileSync(file);
  } catch (e) {
    return { exists: true, bytes: null, value: null, error: e.message };
  }
  try {
    return { exists: true, bytes, value: JSON.parse(bytes.toString('utf8')), error: null };
  } catch (e) {
    return { exists: true, bytes, value: null, error: e.message };
  }
}

// Authored leaf aliases; an unreadable file reads as none, because regeneration
// in 10a already reports it and 12a fails closed on the unresolved path.
function loadLeafAliases(target) {
  const aliasesPath = path.join(target, 'leaf-aliases.json');
  if (!fs.existsSync(aliasesPath)) return [];
  try {
    const data = readJson(aliasesPath);
    if (Array.isArray(data)) return data;
    return isPlainObject(data) && Array.isArray(data.aliases) ? data.aliases : [];
  } catch {
    return [];
  }
}

// Why a parsed manifest cannot be compared, or null when its shape is usable.
function manifestShapeIssue(manifest) {
  if (!isPlainObject(manifest)) return `not a JSON object (got ${describeJson(manifest)})`;
  if (typeof manifest.resourceContractVersion !== 'number' || !Array.isArray(manifest.modes)) {
    return 'missing resourceContractVersion or modes[] array';
  }
  for (const [index, entry] of manifest.modes.entries()) {
    if (!isPlainObject(entry) || typeof entry.workflowMode !== 'string') {
      return `modes[${index}] needs a string workflowMode`;
    }
    if (!Array.isArray(entry.leaves) || entry.leaves.some((leaf) => typeof leaf !== 'string')) {
      return `modes[${index}].leaves must be an array of strings`;
    }
  }
  return null;
}

// 10a: the registry declares a contract version and the committed manifest is
// readable JSON in the expected shape. Anything a regeneration cannot even
// attempt is a source defect, not staleness, and is reported here, not in 10b.
function leafManifestSource(ctx) {
  const issues = [];
  if (!ctx.registry || typeof ctx.registry.resourceContractVersion !== 'number') {
    issues.push('mode-registry.json is missing a numeric resourceContractVersion field');
  }
  const { bytes, value, error } = ctx.leafManifest;
  const shapeIssue = error || manifestShapeIssue(value);
  if (shapeIssue) issues.push(`leaf-manifest.json is unreadable or malformed: ${shapeIssue}`);

  const contract = loadModule(LEAF_CONTRACT_PATH);
  const generator = loadModule(LEAF_GENERATOR_PATH);
  if (contract.missing || generator.missing) {
    issues.push('the shared leaf-resource contract library/generator is missing under sk-doc/sk-create-skill/scripts/');
  } else if (contract.error || generator.error) {
    issues.push(`failed to load the leaf-resource contract library/generator: ${(contract.error || generator.error).message}`);
  }

  let freshBytes = null;
  let regenerationError = null;
  if (issues.length === 0) {
    try {
      freshBytes = generator.module.buildManifestBytes(ctx.target);
    } catch (e) {
      regenerationError = e;
      // A duplicate composite is the target/collision guard's finding, not a
      // malformed source, so 10a stays clean and the codes stay distinct.
      if (e.code !== 'DUPLICATE_COMPOSITE') issues.push(`regeneration failed (${e.code || 'ERROR'}): ${e.message}`);
    }
  }
  if (issues.length === 0) {
    pass('10a-manifest-source: resourceContractVersion declared and leaf-manifest.json is present, readable, and well-formed');
  } else {
    softFail(`10a-manifest-source: ${issues.join('; ')}`);
  }
  return { ok: issues.length === 0, lib: contract.module, committedBytes: bytes, committed: value, freshBytes, regenerationError };
}

// 10b: re-derive the manifest and compare canonical bytes; a hand-edit or a
// stale generation run fails closed rather than being silently trusted.
function checkManifestByteDrift(ctx, source) {
  const { lib, committedBytes, committed, freshBytes, regenerationError } = source;
  if (regenerationError) {
    info('10b-byte-drift: skipped — regeneration is blocked by a composite collision, see 10c');
    return;
  }
  if (Buffer.compare(committedBytes, freshBytes) === 0) {
    pass('10b-byte-drift: committed leaf-manifest.json matches a fresh regeneration byte for byte');
    return;
  }
  const freshManifest = JSON.parse(freshBytes.toString('utf8'));
  const committedKeys = new Set(manifestCompositePairs(committed).map((p) => lib.compositeKey(p)));
  const freshKeys = new Set(manifestCompositePairs(freshManifest).map((p) => lib.compositeKey(p)));
  const added = [...freshKeys].filter((k) => !committedKeys.has(k));
  const removed = [...committedKeys].filter((k) => !freshKeys.has(k));
  const detail = added.length || removed.length
    ? ` — added: [${added.join(', ') || 'none'}], removed: [${removed.join(', ') || 'none'}]`
    : ' — same entries, different byte layout';
  softFail(
    `10b-byte-drift: leaf-manifest.json is stale (committed ${lib.digestManifestBytes(committedBytes)} != fresh ${lib.digestManifestBytes(freshBytes)})${detail}. `
    + `Re-run: node "${LEAF_GENERATOR_PATH}" --write "${ctx.target}"`,
  );
}

// 10c: no two sources claim one composite key, and every committed leaf
// resolves to a real file on disk or a declared alias diskPath.
function checkManifestCollisions(ctx, source) {
  const { lib, committed, regenerationError } = source;
  const committedPairs = manifestCompositePairs(committed);
  const issues = lib.findDuplicateComposites(committedPairs)
    .map((k) => `duplicate composite in committed manifest: ${k}`);
  if (regenerationError && regenerationError.code === 'DUPLICATE_COMPOSITE') {
    issues.push(regenerationError.message);
  }
  const aliasByComposite = new Map(
    ctx.leafAliases
      .filter((a) => isPlainObject(a) && typeof a.workflowMode === 'string' && typeof a.leafResourceId === 'string')
      .map((a) => [lib.compositeKey({ workflowMode: a.workflowMode, leafResourceId: a.leafResourceId }), a]),
  );
  const missingTargets = [];
  for (const p of committedPairs) {
    if (fs.existsSync(path.join(ctx.target, p.packet || '', p.leafResourceId))) continue;
    const alias = aliasByComposite.get(lib.compositeKey({ workflowMode: p.workflowMode, leafResourceId: p.leafResourceId }));
    const aliasResolved = alias && typeof alias.diskPath === 'string' && fs.existsSync(path.join(ctx.target, alias.diskPath));
    if (!aliasResolved) missingTargets.push(`${p.workflowMode}:${p.leafResourceId}`);
  }
  if (missingTargets.length > 0) {
    issues.push(`leaf(s) resolve to no on-disk file or alias diskPath: [${missingTargets.join(', ')}]`);
  }
  if (issues.length === 0) {
    pass('10c-target-collision: no duplicate composite keys; every committed leaf resolves to a disk file or a declared alias');
  } else {
    softFail(`10c-target-collision: ${issues.join('; ')}`);
  }
}

// 10d: every registered mode has a manifest entry and every manifest entry
// maps back to a registered mode.
function checkManifestReachability(ctx, source) {
  const manifestModes = new Set(source.committed.modes.map((m) => m.workflowMode).filter(Boolean));
  const missingFromManifest = [...ctx.registryModeSet].filter((m) => !manifestModes.has(m));
  const orphanedInManifest = [...manifestModes].filter((m) => !ctx.registryModeSet.has(m));
  if (missingFromManifest.length === 0 && orphanedInManifest.length === 0) {
    pass(`10d-reachability: all ${manifestModes.size} manifest mode(s) reach back to a registered mode and vice versa`);
  } else {
    softFail(`10d-reachability: mode-registry ↔ leaf-manifest mismatch — missing from manifest: [${missingFromManifest.join(', ') || 'none'}], orphaned in manifest: [${orphanedInManifest.join(', ') || 'none'}]`);
  }
}

// The chain is opt-in per hub: a hub without a committed leaf-manifest.json
// has not adopted the contract and gets a single informational line.
function checkLeafManifest(ctx) {
  if (!ctx.leafManifest.exists) {
    info('10: hub has no leaf-manifest.json — leaf-resource contract guards do not apply');
    return;
  }
  const source = leafManifestSource(ctx);
  if (!source.ok) {
    info('10b-byte-drift: skipped — manifest-source is invalid, see 10a');
    info('10c-target-collision: skipped — manifest-source is invalid, see 10a');
    info('10d-reachability: skipped — manifest-source is invalid, see 10a');
    return;
  }
  checkManifestByteDrift(ctx, source);
  checkManifestCollisions(ctx, source);
  checkManifestReachability(ctx, source);
}

// ─────────────────────────────────────────────────────────────────────────────
// 12. ROOT CONTRACT CHECKS (11a, 12a)
// ─────────────────────────────────────────────────────────────────────────────

// 11a: the shared classifier decides the root's class from its own authored
// declaration, then reports the whole required/forbidden/overlay set at once,
// which is what makes a never-adopted file reportable.
function checkRootMetadataClass(ctx) {
  const lib = loadModule(ROOT_METADATA_CONTRACT_PATH);
  if (lib.missing) {
    softFail('11-lib: the shared skill-root metadata contract library is missing under sk-doc/sk-create-skill/scripts/lib/');
    return;
  }
  if (lib.error) {
    softFail(`11-lib: failed to load the skill-root metadata contract library: ${lib.error.message}`);
    return;
  }
  const presence = {};
  for (const name of lib.module.METADATA_FILES) presence[name] = fs.existsSync(path.join(ctx.target, name));
  const evaluation = lib.module.evaluateRoot(ctx.basename, presence);
  if (evaluation.skillClass === null) {
    softFail(`11a-class: ${evaluation.reason}`);
    return;
  }
  if (evaluation.violations.length === 0) {
    pass(`11a-class: root metadata conforms to class ${evaluation.skillClass} (${evaluation.reason})`);
    return;
  }
  // A missing generated file is fixed by running the scoped generator, never
  // by hand-authoring it, so the finding names the command.
  for (const violation of evaluation.violations) {
    const redirect = violation.code === 'MISSING_GENERATED_FILE' && fs.existsSync(LEAF_GENERATOR_PATH)
      ? ` Re-run: node "${LEAF_GENERATOR_PATH}" --write "${ctx.target}"`
      : '';
    softFail(`11a-class: ${violation.code} — ${violation.message}.${redirect}`);
  }
}

// 12a: every hub owns one root ROUTER.md declaring router_state
// active|stage1-only, a resolvable root SKILL.md pointer, and zero legacy
// router coexistence. The shared library owns the stable RRC codes so the
// doctor, package gate, and command workflows print the same failure set.
function checkRootRouter(ctx) {
  const lib = loadModule(ROOT_ROUTER_CONTRACT_PATH);
  if (lib.missing) {
    softFail('12-lib: the shared root-router contract library is missing under sk-doc/sk-create-skill/scripts/lib/');
    return;
  }
  if (lib.error) {
    softFail(`12-lib: failed to load the root-router contract library: ${lib.error.message}`);
    return;
  }
  const rootRouterPath = path.join(ctx.target, 'ROUTER.md');
  let routerText = null;
  if (fs.existsSync(rootRouterPath)) {
    try {
      routerText = fs.readFileSync(rootRouterPath, 'utf8');
    } catch (e) {
      softFail(`12a-router-contract: could not read ROUTER.md: ${e.message}`);
      return;
    }
  }
  const legacyFiles = lib.module.LEGACY_ROUTER_PATHS.filter((rel) => fs.existsSync(path.join(ctx.target, rel)));
  const router = ctx.hubRouter.value;
  const policy = router && isPlainObject(router.routerPolicy) ? router.routerPolicy : {};
  const rootPrefix = `${path.resolve(ctx.target)}${path.sep}`;
  try {
    const evaluation = lib.module.validateRootRouter({
      routerText,
      declaredModes: ctx.modes,
      aliasEntries: ctx.leafAliases,
      manifest: ctx.leafManifest.value,
      hubRouterDefaultResource: Array.isArray(policy.defaultResource) ? policy.defaultResource : [],
      legacyFiles,
      // The probe never resolves a path outside the hub: a `..`/absolute
      // segment that exists on disk would otherwise hand a foreign file the
      // identity of a hub leaf. The contract rejects such paths first; this
      // keeps the probe itself closed as a second barrier.
      resolveOnDisk: (rel) => {
        const resolved = path.resolve(ctx.target, rel);
        return resolved.startsWith(rootPrefix) && fs.existsSync(resolved);
      },
    });
    if (evaluation.violations.length === 0) {
      pass(`12a-router-contract: root ROUTER.md conforms to the two-state contract (${evaluation.state})`);
    } else {
      for (const violation of evaluation.violations) {
        softFail(`12a-router-contract: ${violation.code} — ${violation.message}`);
      }
    }
  } catch (e) {
    softFail(`12a-router-contract: RRC-UNKNOWN — the root-router contract library failed unexpectedly: ${e.message}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 13. VERSION PARITY CHECKS (13a-13b)
// ─────────────────────────────────────────────────────────────────────────────

// The first `version:` line of a markdown file, or absent.
function markdownVersion(target, file) {
  const filePath = path.join(target, file);
  if (!fs.existsSync(filePath)) return { present: false, value: null };
  const match = fs.readFileSync(filePath, 'utf8').match(/^version:[ \t]*(.*)$/m);
  if (!match) return { present: false, value: null };
  return { present: true, value: match[1].trim().replace(/^(['"])(.*)\1$/, '$2').trim() };
}

function jsonVersion(parsed) {
  if (!isPlainObject(parsed) || !('version' in parsed)) return { present: false, value: null };
  return { present: true, value: parsed.version };
}

function compareVersions(left, right) {
  const a = left.split('.').map(Number);
  const b = right.split('.').map(Number);
  for (let i = 0; i < 4; i += 1) if (a[i] !== b[i]) return a[i] - b[i];
  return 0;
}

// 13b: the authority names a release that shipped: it must equal the newest
// versioned changelog entry. A version ahead of its changelog is the drift.
function checkChangelogVersion(ctx, authority) {
  if (!ctx.changelogIsDirectory) {
    info('13b-version: skipped, no readable changelog/ directory to compare (see 7a)');
    return;
  }
  const entries = fs.readdirSync(path.join(ctx.target, 'changelog'))
    .map((name) => (name.match(/^v([0-9]+(?:\.[0-9]+){3})\.md$/) || [])[1])
    .filter(Boolean)
    .sort(compareVersions);
  const newest = entries[entries.length - 1] || null;
  if (!newest) {
    pass('13b-version: changelog directory holds no versioned entry to compare');
  } else if (newest === authority) {
    pass(`13b-version: SKILL.md version ${authority} matches the newest changelog entry`);
  } else {
    softFail(`13b-version: SKILL.md claims ${authority} but the newest changelog entry is v${newest}`);
  }
}

// 13a: SKILL.md is the release authority; every routing artifact that declares
// a version must carry exactly that four-part version. A declared version that
// does not parse is a mismatch, never a pass.
function checkVersionParity(ctx) {
  const authorityField = markdownVersion(ctx.target, 'SKILL.md');
  const authority = authorityField.present && FOUR_PART_VERSION.test(authorityField.value) ? authorityField.value : null;
  if (!authority) {
    softFail('13a-version: SKILL.md declares no four-part version, so the hub has no release authority to compare against');
    return;
  }
  const followers = [
    { file: 'ROUTER.md', ...markdownVersion(ctx.target, 'ROUTER.md') },
    { file: 'description.json', ...jsonVersion(ctx.description) },
    { file: 'hub-router.json', ...jsonVersion(ctx.hubRouter.value) },
    { file: 'mode-registry.json', ...jsonVersion(ctx.registry) },
  ];
  let parity = true;
  for (const { file, present, value } of followers) {
    if (!present) continue;
    if (typeof value !== 'string' || !FOUR_PART_VERSION.test(value)) {
      softFail(`13a-version: ${file} carries ${JSON.stringify(value)}, which is not a four-part version; SKILL.md, the release authority, carries ${authority}`);
      parity = false;
    } else if (value !== authority) {
      softFail(`13a-version: ${file} carries ${value} but SKILL.md, the release authority, carries ${authority}`);
      parity = false;
    }
  }
  if (parity) pass(`13a-version: all routing artifacts carry the SKILL.md version ${authority}`);
  checkChangelogVersion(ctx, authority);
}

// ─────────────────────────────────────────────────────────────────────────────
// 14. ORCHESTRATOR
// ─────────────────────────────────────────────────────────────────────────────

function createContext(target) {
  return {
    target,
    basename: path.basename(target),
    registry: null,
    extensions: {},
    ext: { runtimeLoop: false, advisorProjection: false, surfaceAxis: false, transportAxis: false, commandSubworkflows: false },
    rawModes: [],
    modes: [],
    registryModeSet: new Set(),
    registeredPackets: new Set(),
    surfaceCount: 0,
    hubRouter: { exists: false, value: null, error: null },
    description: null,
    changelogIsDirectory: false,
    leafManifest: { exists: false, bytes: null, value: null, error: null },
    leafAliases: [],
  };
}

// Exit 2 when the target cannot be audited at all; null when it can.
function targetError(target) {
  if (!fs.existsSync(target) || !fs.statSync(target).isDirectory()) {
    console.error(`${red('ERROR')}: parent skill directory not found: ${target}`);
    return EXIT_CHECKER_ERROR;
  }
  try {
    fs.readdirSync(target);
  } catch (e) {
    console.error(`${red('ERROR')}: parent skill directory is not readable: ${target} (${e.code || e.message})`);
    return EXIT_CHECKER_ERROR;
  }
  return null;
}

function main() {
  const explicitTarget = process.argv[2];
  const argTarget = explicitTarget || DEFAULT_TARGET;
  const target = path.isAbsolute(argTarget) ? argTarget : path.resolve(REPO_ROOT, argTarget);

  // A per-hub gate reporting on a hub the caller did not name reads exactly like success.
  if (!explicitTarget) {
    console.log(`${yellow('NOTE')}: no hub given, defaulting to ${DEFAULT_TARGET}.`);
    console.log(`${yellow('NOTE')}: this result describes THAT hub only. Pass a hub path to check another.`);
    console.log('');
  }
  info(`Parent skill: ${argTarget}`);
  info(`Resolved:     ${target}`);
  info(`Advisory findings: ${STRICT_HUB_CANON ? 'FAIL' : 'WARN'}. Hard failures always FAIL.`);
  console.log('');

  const unusable = targetError(target);
  if (unusable !== null) return unusable;

  const ctx = createContext(target);
  checkIdentity(ctx);
  loadRegistry(ctx);
  checkModes(ctx);
  checkExtensions(ctx);
  checkHubToolGrant(ctx);
  checkAdvisorProjection(ctx);
  ctx.hubRouter = loadHubRouter(target);
  checkHubRouter(ctx);
  checkDirectoryConsistency(ctx);
  checkModeTable(ctx);
  checkChangelog(ctx);
  checkDescription(ctx);
  checkVocabularyParity(ctx);
  checkPlaybookAndBenchmark(ctx);
  ctx.leafManifest = loadLeafManifest(target);
  ctx.leafAliases = loadLeafAliases(target);
  checkLeafManifest(ctx);
  checkRootMetadataClass(ctx);
  checkRootRouter(ctx);
  checkVersionParity(ctx);

  console.log('');
  console.log('─────────────────────────────────────────────────────────────────');
  if (fails === 0) {
    console.log(`${green('OK')}: parent-skill-check — all hard invariants passed, ${warns} warnings`);
    return EXIT_OK;
  }
  console.error(`${red('FAIL')}: parent-skill-check — ${fails} invariant failures, ${warns} warnings`);
  return EXIT_INVARIANT_FAILED;
}

// ─────────────────────────────────────────────────────────────────────────────
// 15. ENTRY POINT
// ─────────────────────────────────────────────────────────────────────────────

// Any unexpected throw means the audit did not finish, which is the checker's
// own error, never a verdict on the hub, so it maps to exit 2.
function run() {
  try {
    return main();
  } catch (e) {
    const reason = e && e.message ? e.message.split('\n')[0] : String(e);
    console.error(`${red('FAIL')}: parent-skill-check could not finish: ${reason}`);
    return EXIT_CHECKER_ERROR;
  }
}

process.exit(run());
