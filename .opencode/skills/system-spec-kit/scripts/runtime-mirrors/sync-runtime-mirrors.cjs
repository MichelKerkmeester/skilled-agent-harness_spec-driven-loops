// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Sync Runtime Mirrors                                                     ║
// ╚══════════════════════════════════════════════════════════════════════════╝
//
// Cursor and Devin discover agents and commands by file convention, each at its
// own path and in its own shape. Rather than fork the content per runtime, every
// entry is a symlink back to one canonical file, so a mirror cannot drift from
// what it mirrors. This script owns those symlink trees.
//
// A real file sitting where a symlink belongs is the failure this guards: it
// still works today and silently stops tracking the source tomorrow. That is
// reported as STALE, never quietly accepted.
//
// Hook mirrors are derived from each runtime's own hook config rather than a
// hand-kept list, because the config is what the runtime actually executes; a
// list would be one more thing to forget to update.

'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { isCanonicalMirrorExcluded, isRuntimeNativeCommand } = require('./command-scope.cjs');

const REPO_ROOT = path.resolve(__dirname, '../../../../..');
const EXCLUDED_COMMAND_DIRS = new Set(['assets', 'scripts', 'fixtures']);

// Cursor and Devin parse the Claude agent dialect (`tools:`), not OpenCode's
// `permission:` block, so agents deliberately source from .claude/agents.
// Commands have no dialect split and source from .opencode directly.
const CLAUDE_AGENTS = '.claude/agents';
const OPENCODE_COMMANDS = '.opencode/commands';

const HOOK_CONFIGS = [
  { runtime: 'claude', config: '.claude/settings.json', mirror: '.claude/hooks' },
  { runtime: 'codex', config: '.codex/hooks.json', mirror: '.codex/hooks' },
  { runtime: 'cursor', config: '.cursor/hooks.json', mirror: '.cursor/hooks' },
  { runtime: 'devin', config: '.devin/hooks.v1.json', mirror: '.devin/hooks' },
];

function parseArguments(argv) {
  if (argv.length === 0) {
    return { check: false };
  }
  if (argv.length === 1 && argv[0] === '--check') {
    return { check: true };
  }
  throw new Error('Usage: node sync-runtime-mirrors.cjs [--check]');
}

function listAgentNames() {
  const dir = path.join(REPO_ROOT, CLAUDE_AGENTS);
  if (!fs.existsSync(dir)) {
    throw new Error(`No canonical agents found at ${CLAUDE_AGENTS}`);
  }
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith('.md'))
    .map((e) => e.name.slice(0, -3))
    .sort();
}

function listCommandPaths() {
  const root = path.join(REPO_ROOT, OPENCODE_COMMANDS);
  if (!fs.existsSync(root)) {
    throw new Error(`No canonical commands found at ${OPENCODE_COMMANDS}`);
  }
  const found = [];
  const walk = (current) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (!EXCLUDED_COMMAND_DIRS.has(entry.name)) walk(absolute);
        continue;
      }
      if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
      if (entry.name === 'README.md' || entry.name.endsWith('.contract.md')) continue;
      found.push(path.relative(root, absolute).split(path.sep).join('/'));
    }
  };
  walk(root);
  return found.sort();
}

// `create/agent.md` -> `create-agent`: both runtimes expose a flat namespace,
// so the directory separator collapses into the name.
function toFlatName(relativePath) {
  return relativePath.replace(/\.md$/, '').split('/').join('-');
}

// Every path the runtime's own config actually invokes is a path its discovery
// mirror should expose. Reading the raw text keeps this indifferent to the four
// mutually incompatible config shapes.
function hookSourcesFromConfig(configRelative) {
  const absolute = path.join(REPO_ROOT, configRelative);
  if (!fs.existsSync(absolute)) return [];
  const raw = fs.readFileSync(absolute, 'utf8');
  const matches = raw.match(/\.opencode\/[A-Za-z0-9_./-]+?\.(?:mjs|cjs|js|sh|py)/g) || [];
  return [...new Set(matches)].sort();
}

// Each entry: { mirror: repo-relative path of the symlink, source: repo-relative target }
function buildExpectedLinks() {
  const links = [];
  const agents = listAgentNames();
  const commands = listCommandPaths();

  for (const name of agents) {
    const source = `${CLAUDE_AGENTS}/${name}.md`;
    links.push({ tree: 'cursor-agents', mirror: `.cursor/agents/${name}.md`, source });
    links.push({ tree: 'devin-agents', mirror: `.devin/agents/${name}/AGENT.md`, source });
  }

  for (const relativePath of commands) {
    // Runtime-exclusive commands (the goal triggers) are not cross-mirrored; each
    // runtime carries only its own hand-authored native command instead.
    if (isCanonicalMirrorExcluded(relativePath)) continue;
    const source = `${OPENCODE_COMMANDS}/${relativePath}`;
    const flat = toFlatName(relativePath);
    links.push({ tree: 'cursor-commands', mirror: `.cursor/commands/${flat}.md`, source });
  }

  for (const { runtime, config, mirror } of HOOK_CONFIGS) {
    for (const source of hookSourcesFromConfig(config)) {
      links.push({ tree: `${runtime}-hooks`, mirror: `${mirror}/${path.posix.basename(source)}`, source });
    }
  }

  if (links.length === 0) throw new Error('No expected mirrors were derived');
  return links;
}

// Mirrors are relative symlinks so the tree stays valid when the repo moves.
function expectedTarget(mirrorRelative, sourceRelative) {
  return path.relative(
    path.dirname(path.join(REPO_ROOT, mirrorRelative)),
    path.join(REPO_ROOT, sourceRelative),
  );
}

function inspect(link) {
  const absolute = path.join(REPO_ROOT, link.mirror);
  let stat = null;
  try {
    stat = fs.lstatSync(absolute);
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
    return { state: 'MISSING' };
  }
  if (!stat.isSymbolicLink()) return { state: 'STALE', why: 'not a symlink (silent fork risk)' };
  if (!fs.existsSync(absolute)) return { state: 'STALE', why: 'broken symlink' };
  const want = expectedTarget(link.mirror, link.source);
  if (fs.readlinkSync(absolute) !== want) return { state: 'STALE', why: `points at ${fs.readlinkSync(absolute)}, expected ${want}` };
  return { state: 'OK' };
}

// A mirror with no canonical source keeps serving something the roster dropped.
function findOrphans(expectedLinks) {
  const expectedByDir = new Map();
  for (const link of expectedLinks) {
    const dir = path.posix.dirname(link.mirror);
    if (!expectedByDir.has(dir)) expectedByDir.set(dir, new Set());
    expectedByDir.get(dir).add(path.posix.basename(link.mirror));
  }

  const orphans = [];
  for (const [dir, names] of expectedByDir) {
    const absoluteDir = path.join(REPO_ROOT, dir);
    if (!fs.existsSync(absoluteDir)) continue;
    for (const entry of fs.readdirSync(absoluteDir, { withFileTypes: true })) {
      if (entry.name === 'README.md' || entry.name === 'README.txt' || entry.name.startsWith('.')) continue;
      // Nested trees (devin) hold one dir per item; flat trees hold files/symlinks.
      if (entry.isDirectory()) continue;
      // A runtime's own hand-authored native command is deliberately not a mirror.
      if (isRuntimeNativeCommand(dir, entry.name)) continue;
      if (!names.has(entry.name)) orphans.push(path.posix.join(dir, entry.name));
    }
  }

  // Devin nests each item in its own directory, so an orphan there is a whole dir.
  for (const parent of ['.devin/agents', '.devin/skills']) {
    const absoluteParent = path.join(REPO_ROOT, parent);
    if (!fs.existsSync(absoluteParent)) continue;
    const leaf = parent.endsWith('agents') ? 'AGENT.md' : 'SKILL.md';
    const wanted = new Set(
      expectedLinks
        .filter((l) => l.mirror.startsWith(`${parent}/`))
        .map((l) => l.mirror.split('/')[2]),
    );
    for (const entry of fs.readdirSync(absoluteParent, { withFileTypes: true })) {
      if (!entry.isDirectory() || entry.name.startsWith('.')) continue;
      // A hand-authored native skill in this tree is not a mirror.
      if (isRuntimeNativeCommand(parent, entry.name)) continue;
      if (!wanted.has(entry.name)) orphans.push(`${parent}/${entry.name}/${leaf}`);
    }
  }

  return orphans.sort();
}

function checkMirrors(expectedLinks) {
  const drift = [];
  for (const link of expectedLinks) {
    const result = inspect(link);
    if (result.state === 'MISSING') drift.push(`MISSING ${link.mirror}`);
    else if (result.state === 'STALE') drift.push(`STALE ${link.mirror} — ${result.why}`);
  }
  for (const orphan of findOrphans(expectedLinks)) drift.push(`EXTRA ${orphan}`);

  if (drift.length > 0) {
    console.error('[runtime-mirror-sync] Drift detected:');
    for (const item of drift) console.error(`[runtime-mirror-sync] ${item}`);
    return false;
  }

  const trees = new Set(expectedLinks.map((l) => l.tree));
  console.log(`[runtime-mirror-sync] PASS: ${expectedLinks.length} mirrors across ${trees.size} trees are in sync.`);
  return true;
}

function writeMirrors(expectedLinks) {
  let changed = 0;

  for (const link of expectedLinks) {
    const result = inspect(link);
    if (result.state === 'OK') continue;
    const absolute = path.join(REPO_ROOT, link.mirror);
    fs.mkdirSync(path.dirname(absolute), { recursive: true });
    if (result.state === 'STALE') fs.rmSync(absolute, { force: true });
    fs.symlinkSync(expectedTarget(link.mirror, link.source), absolute);
    changed += 1;
  }

  let removed = 0;
  for (const orphan of findOrphans(expectedLinks)) {
    const absolute = path.join(REPO_ROOT, orphan);
    fs.rmSync(absolute, { force: true });
    // Devin's per-item directory is meaningless once its only entry is gone.
    const parent = path.dirname(absolute);
    if (/\.devin\/(agents|skills)\//.test(orphan) && fs.existsSync(parent) && fs.readdirSync(parent).length === 0) {
      fs.rmdirSync(parent);
    }
    removed += 1;
  }

  console.log(`[runtime-mirror-sync] Linked ${changed}, removed ${removed}, of ${expectedLinks.length} expected mirrors.`);
}

function main() {
  const options = parseArguments(process.argv.slice(2));
  const expectedLinks = buildExpectedLinks();
  if (options.check) {
    if (!checkMirrors(expectedLinks)) process.exitCode = 1;
    return;
  }
  writeMirrors(expectedLinks);
}

try {
  main();
} catch (error) {
  console.error(`[runtime-mirror-sync] ERROR: ${error.message}`);
  process.exitCode = 1;
}
