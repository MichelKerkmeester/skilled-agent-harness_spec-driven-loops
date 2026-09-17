#!/usr/bin/env node
'use strict';

// Read-only /doctor diagnostic for command-catalog and command-metadata drift.
//
// WHY THIS EXISTS: a command's own frontmatter is the only place its identity is
// stated once. Everything else that names commands is a copy — the repo-wide
// index at .opencode/commands/README.txt, the per-family indexes beside it, and
// the command-metadata.json each hub keeps so the skill advisor can route to a
// command it owns. Adding, renaming or deleting a command updates the file and
// none of the copies, and nothing notices: the runtime still dispatches, the
// advisor still routes what it knows about, and only a reader who trusts an
// index is misled. This check makes that omission loud.
//
// It compares copies against the frontmatter tree, never a copy against a copy,
// so it stays a guard rather than a second generator. Generating the indexes was
// considered and rejected: the metadata covers 20 of the 39 shipped commands and
// is itself hand-kept, so deriving one copy from another would launder drift
// instead of reporting it.
//
// Two tiers, because two kinds of disagreement are not the same failure:
//   - Structural (drives exit status). Coverage, identity, counts and resolvable
//     resources. A command missing from an index, an index naming a command that
//     no longer exists, a stale group count, a metadata entry pointing at
//     nothing. These break a reader or a router.
//   - Prose (reported, exit 0 unless --strict). The description and argumentHint
//     a hub copies out of frontmatter. A hub legitimately phrases a routing
//     description its own way, and the metadata convention appends a pre-bound
//     setup annotation the frontmatter often omits, so a verbatim mismatch is
//     worth seeing without being worth failing a diagnostic over.
//
// Never writes; a /doctor run is read-only by contract.
// Exit 0 when every copy covers the tree, 1 on drift, 2 on error.
//
// Usage: command-catalog-mirror-check.cjs [--root <dir>] [--strict]
//   --root   check a copy of the tree instead of this repository, so a
//            deliberate staleness can be proven without editing the real one.
//   --strict promote prose divergence from a warning to drift.

const fs = require('node:fs');
const path = require('node:path');

const DEFAULT_REPO = path.resolve(__dirname, '../../../..');

// Directories under .opencode/commands/ that hold support files rather than
// commands. Anything else with .md files in it is a command namespace.
const NON_NAMESPACE_DIRS = new Set(['assets', 'scripts']);

// Hubs keep their command-metadata beside their SKILL.md. Only hubs that own
// commands carry entries; a hub with none carries an empty array.
const METADATA_GLOB_ROOT = '.opencode/skills';

// A slash-command id: /name for a root utility, /family:name for a namespaced
// one. The same grammar the metadata schema enforces.
const COMMAND_ID_RE = /^\/[a-z][a-z0-9-]*(:[a-z][a-z0-9-]*)?$/;

// Namespaced command ids mentioned in prose. Root-form ids (/vision) are not
// scanned for orphans: a bare slash-word is too easily a path or a fragment, and
// a false orphan trains the reader to ignore this output.
const NAMESPACED_MENTION_RE = /\/[a-z][a-z0-9-]*:[a-z][a-z0-9-]*/g;

// The metadata convention appends this annotation to an argument hint whose
// :auto mode accepts pre-bound setup answers; the frontmatter carries it only on
// some commands. The two surfaces disagree systematically rather than by drift,
// so the grammar is compared without it.
const PREBOUND_ANNOTATION_RE = /\s*\(:auto supports PRE-BOUND SETUP ANSWERS[^)]*\)\s*$/;

function fail(message) {
  console.error(`STATUS=ERROR command-catalog-mirror: ${message}`);
  process.exit(2);
}

function parseArgs(argv) {
  const opts = { root: DEFAULT_REPO, strict: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--strict') opts.strict = true;
    else if (argv[i] === '--root') {
      const next = argv[++i];
      if (!next) fail('--root needs a directory');
      opts.root = path.resolve(next);
    } else fail(`unknown argument: ${argv[i]}`);
  }
  return opts;
}

// ── the tree of record ───────────────────────────────────────────────────────

function readFrontmatter(file) {
  const text = fs.readFileSync(file, 'utf8');
  const block = text.match(/^---\n([\s\S]*?)\n---/);
  if (!block) return {};
  const fields = {};
  for (const line of block[1].split('\n')) {
    const kv = line.match(/^([A-Za-z][A-Za-z-]*):\s*(.*)$/);
    if (!kv) continue;
    let value = kv[2].trim();
    const quoted = (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"));
    if (quoted && value.length >= 2) value = value.slice(1, -1);
    fields[kv[1]] = value;
  }
  return fields;
}

// Every shipped command, from the files themselves.
function readCommandTree(commandsDir) {
  const commands = [];
  for (const entry of fs.readdirSync(commandsDir).sort()) {
    const abs = path.join(commandsDir, entry);
    if (fs.statSync(abs).isDirectory()) {
      if (NON_NAMESPACE_DIRS.has(entry)) continue;
      for (const file of fs.readdirSync(abs).sort()) {
        if (!file.endsWith('.md')) continue;
        const name = file.slice(0, -3);
        commands.push({
          id: `/${entry}:${name}`,
          ns: entry,
          name,
          abs: path.join(abs, file),
          rel: `${entry}/${file}`,
          frontmatter: readFrontmatter(path.join(abs, file)),
        });
      }
    } else if (entry.endsWith('.md')) {
      const name = entry.slice(0, -3);
      commands.push({
        id: `/${name}`,
        ns: null,
        name,
        abs,
        rel: entry,
        frontmatter: readFrontmatter(abs),
      });
    }
  }
  return commands;
}

// ── catalogs ─────────────────────────────────────────────────────────────────

// Coverage is judged against the catalog's table rows alone, never the whole
// document. An index lists its commands in a table; a usage example further down
// mentions the same ids in passing. Scanning everything lets a deleted row hide
// behind an example of the command it used to describe, which is precisely the
// staleness worth catching.
function tableRows(text) {
  return text.split('\n').filter((line) => /^\s*\|/.test(line)).join('\n');
}

// A row names a command either by its invocation id or by its file path. The
// doctor router is the reason both count: it ships as doctor/speckit.md but is
// invoked as `/doctor <target>`, so its index row names the backing file.
function catalogNames(rows, command) {
  return rows.includes(command.id) || rows.includes(command.rel);
}

function findCatalogs(commandsDir, namespaces) {
  const catalogs = [];
  const repoWide = path.join(commandsDir, 'README.txt');
  if (fs.existsSync(repoWide)) {
    catalogs.push({ label: 'commands/README.txt', abs: repoWide, scope: null });
  }
  for (const ns of namespaces) {
    const abs = path.join(commandsDir, ns, 'README.txt');
    if (fs.existsSync(abs)) {
      catalogs.push({ label: `commands/${ns}/README.txt`, abs, scope: ns });
    }
  }
  return catalogs;
}

// The repo-wide index opens with a group table carrying a command count per
// group. The count is the claim most likely to rot, and the index says so itself.
function groupCounts(text) {
  const counts = new Map();
  for (const line of text.split('\n')) {
    if (!/^\s*\|/.test(line)) continue;
    const cells = line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
    if (cells.length < 3) continue;
    const group = cells[0].match(/^\*\*([a-z][a-z0-9-]*)\*\*$/);
    const count = cells[2].match(/^\d+$/);
    if (group && count) counts.set(group[1], Number(count[0]));
  }
  return counts;
}

function checkCatalog(catalog, commands, namespaces) {
  const text = fs.readFileSync(catalog.abs, 'utf8');
  const rows = tableRows(text);
  const inScope = catalog.scope === null
    ? commands
    : commands.filter((c) => c.ns === catalog.scope);
  const problems = [];

  for (const command of inScope) {
    if (!catalogNames(rows, command)) problems.push(`${command.id} not listed`);
  }

  // An id in the catalog with no file behind it is drift the other way: the
  // index keeps offering a command the tree no longer defines.
  const known = new Set(commands.map((c) => c.id));
  const scanned = new Set();
  for (const mention of text.match(NAMESPACED_MENTION_RE) || []) {
    if (scanned.has(mention)) continue;
    scanned.add(mention);
    const ns = mention.slice(1).split(':')[0];
    if (catalog.scope !== null && ns !== catalog.scope) continue;
    if (!namespaces.has(ns)) continue;
    if (!known.has(mention)) problems.push(`${mention} listed but no such command file`);
  }

  if (catalog.scope === null) {
    for (const [group, claimed] of groupCounts(text)) {
      const actual = group === 'root'
        ? commands.filter((c) => c.ns === null).length
        : commands.filter((c) => c.ns === group).length;
      // A group row naming no namespace on disk is a stale row, not a bad count.
      if (actual === 0 && group !== 'root') {
        problems.push(`group table lists '${group}' but no such command folder`);
      } else if (actual !== claimed) {
        problems.push(`group '${group}' count says ${claimed}, folder holds ${actual}`);
      }
    }
  }

  return { covered: inScope.length - problems.filter((p) => p.endsWith('not listed')).length, total: inScope.length, problems };
}

// ── hub command-metadata ─────────────────────────────────────────────────────

function findMetadataFiles(repo) {
  const skillsDir = path.join(repo, METADATA_GLOB_ROOT);
  if (!fs.existsSync(skillsDir)) return [];
  const found = [];
  for (const skill of fs.readdirSync(skillsDir).sort()) {
    const abs = path.join(skillsDir, skill, 'command-metadata.json');
    if (fs.existsSync(abs)) found.push({ label: `${skill}/command-metadata.json`, abs, skill });
  }
  return found;
}

function checkMetadata(meta, commands, repo) {
  let entries;
  try {
    entries = JSON.parse(fs.readFileSync(meta.abs, 'utf8'));
  } catch (err) {
    return { problems: [`unparseable: ${err.message}`], warnings: [], entries: 0 };
  }
  if (!Array.isArray(entries)) return { problems: ['not an array'], warnings: [], entries: 0 };

  const byId = new Map(commands.map((c) => [c.id, c]));
  const problems = [];
  const warnings = [];
  const claimedNamespaces = new Set();

  for (const entry of entries) {
    const id = typeof entry.command === 'string' ? entry.command : '(unnamed entry)';
    if (!COMMAND_ID_RE.test(id)) {
      problems.push(`${id} is not a slash-command id`);
      continue;
    }
    const command = byId.get(id);
    if (!command) {
      problems.push(`${id} has an entry but no command file`);
      continue;
    }
    if (command.ns) claimedNamespaces.add(command.ns);

    for (const step of entry.choreography || []) {
      if (!step || typeof step.resource !== 'string') continue;
      if (!fs.existsSync(path.join(repo, step.resource))) {
        problems.push(`${id} loads a resource that does not exist: ${step.resource}`);
      }
    }

    const description = command.frontmatter.description || '';
    if ((entry.description || '') !== description) {
      warnings.push(`${id} description differs from frontmatter`);
    }
    const hint = (command.frontmatter['argument-hint'] || '').replace(PREBOUND_ANNOTATION_RE, '');
    const claimed = (entry.argumentHint || '').replace(PREBOUND_ANNOTATION_RE, '');
    if (claimed !== hint) {
      warnings.push(`${id} argumentHint differs from frontmatter`);
    }
  }

  // A hub that speaks for a namespace speaks for all of it. Half a namespace is
  // how a newly added command goes unrouted while the file sits happily on disk.
  const declared = new Set(entries.map((e) => e && e.command).filter(Boolean));
  for (const ns of claimedNamespaces) {
    for (const command of commands.filter((c) => c.ns === ns)) {
      if (!declared.has(command.id)) {
        problems.push(`${command.id} has no entry, though this hub covers the rest of ${ns}/`);
      }
    }
  }

  return { problems, warnings, entries: entries.length };
}

// ── report ───────────────────────────────────────────────────────────────────

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const commandsDir = path.join(opts.root, '.opencode/commands');
  if (!fs.existsSync(commandsDir)) fail(`commands directory not found: ${commandsDir}`);

  const commands = readCommandTree(commandsDir);
  if (commands.length === 0) fail(`no command files under ${commandsDir}`);
  const namespaces = new Set(commands.map((c) => c.ns).filter(Boolean));

  const drift = [];
  const prose = [];

  console.log('\n/doctor command-catalog-mirror — read-only coverage check');
  console.log(`canonical: .opencode/commands frontmatter (${commands.length} commands)\n`);

  const catalogs = findCatalogs(commandsDir, [...namespaces].sort());
  if (catalogs.length === 0) drift.push('catalog: no README.txt index found under .opencode/commands');
  for (const catalog of catalogs) {
    const result = checkCatalog(catalog, commands, namespaces);
    const mark = result.problems.length === 0 ? 'OK  ' : 'DRIFT';
    console.log(`  ${mark} ${catalog.label.padEnd(34)} ${result.covered}/${result.total} listed`);
    for (const p of result.problems) {
      console.log(`         - ${p}`);
      drift.push(`${catalog.label}: ${p}`);
    }
  }

  for (const meta of findMetadataFiles(opts.root)) {
    const result = checkMetadata(meta, commands, opts.root);
    if (result.entries === 0 && result.problems.length === 0) continue;
    const mark = result.problems.length === 0 ? 'OK  ' : 'DRIFT';
    console.log(`  ${mark} ${meta.label.padEnd(34)} ${result.entries} entr${result.entries === 1 ? 'y' : 'ies'}`);
    for (const p of result.problems) {
      console.log(`         - ${p}`);
      drift.push(`${meta.label}: ${p}`);
    }
    for (const w of result.warnings) {
      console.log(`         ? ${w}`);
      prose.push(`${meta.label}: ${w}`);
    }
  }

  if (prose.length > 0 && !opts.strict) {
    console.log(`\n  ${prose.length} prose divergence(s) reported above; --strict fails on them.`);
  }

  const failing = opts.strict ? drift.length + prose.length : drift.length;
  if (failing > 0) {
    console.log(`\nSTATUS=DRIFT command-catalog-mirror: ${failing} issue(s)`);
    console.log('Repair: the command file\'s frontmatter is the source. Update the index row, the group count, or the hub metadata entry to match it — never the other way round.\n');
    process.exit(1);
  }
  console.log('\nSTATUS=OK command-catalog-mirror: every catalog and hub metadata covers the command tree\n');
  process.exit(0);
}

main();
