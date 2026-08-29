#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ repair-derived — repair the packet facts that are derivable from disk    ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// Validation failures split into two kinds. Some are facts the repository
// already knows and the document merely records wrongly: where a packet sits on
// disk, what level it declares, whether its generated metadata still matches
// its sources. Those can be recomputed and are what this repairs. The rest are
// records of work someone did — evidence, verification results, decisions —
// which cannot be derived from anything and must be written by whoever did the
// work. Repairing only the first kind is the whole point: a tool that fills in
// the second would make the gate green by making the packet lie.
//
// Dry by default; --apply writes. Idempotent, so a second run is a no-op.
//
// Exit: 0 = nothing left that this tool can repair; 1 = repairable work found
// (dry run); 2 = a repair was attempted and failed.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const REPO = process.cwd();
const VALIDATE = '.opencode/skills/system-spec-kit/scripts/spec/validate.sh';
const BACKFILL = '.opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts';
const TSX_LOADER = './.opencode/skills/system-spec-kit/scripts/node_modules/tsx/dist/loader.mjs';

// Rules this tool can settle from repository state alone. Anything absent from
// this list is reported and left alone, however mechanical it may look.
const DERIVABLE = new Set([
  'DESCRIPTION_SHAPE',
  'GENERATED_METADATA_INTEGRITY',
  'GENERATED_METADATA_DRIFT',
  'METADATA_DISK_PATH_CONSISTENCY',
  'SPEC_DOC_INTEGRITY',
]);

const POINTER_LINE = /^(\s*packet_pointer:\s*)(["']?)([^"'\n]*)(["']?)\s*$/m;
const SPEC_FOLDER_ROW = /(\|\s*\*\*Spec Folder\*\*\s*\|\s*)([^|\n]+?)(\s*\|)/;
const DOCS = ['spec.md', 'plan.md', 'tasks.md', 'checklist.md', 'implementation-summary.md', 'handover.md'];

// ─────────────────────────────────────────────────────────────────────────────
// 3. DIAGNOSIS
// ─────────────────────────────────────────────────────────────────────────────
function validate(folder) {
  try {
    const out = execFileSync('bash', [VALIDATE, folder, '--strict', '--json', '--no-recursive'], {
      cwd: REPO, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'],
    });
    return JSON.parse(out);
  } catch (err) {
    // A non-zero exit is the normal path for a failing packet; the report still
    // arrives on stdout. Only unparseable output means we truly cannot tell.
    try { return JSON.parse(err.stdout || ''); } catch { return null; }
  }
}

// Packets resolve to one of two report schemas; reading only one silently
// reports half the fleet as having nothing wrong.
function findings(report) {
  const rows = [...(report.results || []), ...(report.entries || [])];
  return rows.filter((r) => ['error', 'warn', 'warning'].includes(String(r.status || r.severity || '').toLowerCase()));
}

function readLevel(report) {
  const level = report.level;
  return level === undefined || level === null || level === '' ? null : String(level);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. DERIVED REPAIRS
// ─────────────────────────────────────────────────────────────────────────────
function fixDescriptionLevel(folder, report) {
  const file = path.join(folder, 'description.json');
  if (!fs.existsSync(file)) return null;
  let data;
  try { data = JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return null; }
  if ('level' in data) return null;
  const level = readLevel(report);
  if (!level) return null;
  return { file, apply: () => {
    // Recorded as a string: that is what the overwhelming majority of packets
    // already carry, and the schema accepts either, so matching them keeps the
    // field comparable across the fleet.
    data.level = level;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
  }, what: `description level -> ${level}` };
}

function fixRecordedLocation(folder) {
  const actions = [];
  const basename = path.basename(folder);
  const pointer = path.relative(path.join(REPO, 'specs'), path.resolve(REPO, folder)).split(path.sep).join('/');

  const summary = path.join(folder, 'implementation-summary.md');
  if (fs.existsSync(summary)) {
    const text = fs.readFileSync(summary, 'utf8');
    const row = SPEC_FOLDER_ROW.exec(text);
    if (row && row[2].trim() !== basename) {
      actions.push({ file: summary, what: `spec folder -> ${basename}`, apply: () => {
        const current = fs.readFileSync(summary, 'utf8');
        const m = SPEC_FOLDER_ROW.exec(current);
        if (m) fs.writeFileSync(summary, current.slice(0, m.index) + m[1] + basename + m[3] + current.slice(m.index + m[0].length));
      } });
    }
  }

  for (const name of DOCS) {
    const file = path.join(folder, name);
    if (!fs.existsSync(file)) continue;
    const text = fs.readFileSync(file, 'utf8');
    const hit = POINTER_LINE.exec(text);
    if (!hit || hit[3] === pointer) continue;
    actions.push({ file, what: `packet pointer -> ${pointer}`, apply: () => {
      const current = fs.readFileSync(file, 'utf8');
      fs.writeFileSync(file, current.replace(POINTER_LINE, (_m, lead) => `${lead}"${pointer}"`));
    } });
  }
  return actions;
}

function rederive(folder) {
  try {
    execFileSync('node', ['--import', TSX_LOADER, BACKFILL, folder], {
      cwd: REPO, stdio: 'ignore', maxBuffer: 64 * 1024 * 1024,
    });
    return true;
  } catch { return false; }
}

function repairFolder(folder, apply) {
  const before = validate(folder);
  if (!before) return { folder, unreadable: true };
  const rules = new Set(findings(before).map((f) => f.rule));
  const derivable = [...rules].filter((r) => DERIVABLE.has(r));
  const authored = [...rules].filter((r) => !DERIVABLE.has(r));
  if (derivable.length === 0) return { folder, planned: [], authored, rederived: false };

  const planned = [];
  const levelFix = fixDescriptionLevel(folder, before);
  if (levelFix) planned.push(levelFix);
  planned.push(...fixRecordedLocation(folder));

  if (!apply) return { folder, planned, authored, rederived: false };

  for (const action of planned) action.apply();
  // Editing a document invalidates the stored fingerprint, so the re-derive is
  // part of the repair rather than a follow-up; skipping it swaps one error for
  // another. It also settles the metadata rules on its own.
  const rederived = rederive(folder);
  return { folder, planned, authored, rederived };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. DISCOVERY
// ─────────────────────────────────────────────────────────────────────────────
function discover(root) {
  const out = [];
  const stack = [root];
  const skip = new Set(['node_modules', '.git', 'z_archive', 'scratch']);
  // Snapshots taken before a rename are frozen by definition: their recorded
  // location is deliberately the old one, so "repairing" it to match where the
  // snapshot now sits destroys the very thing the copy was kept to preserve.
  const frozen = (name) => skip.has(name) || name.startsWith('.backup-');
  while (stack.length) {
    const dir = stack.pop();
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { continue; }
    if (fs.existsSync(path.join(dir, 'spec.md')) || fs.existsSync(path.join(dir, 'implementation-summary.md'))) out.push(dir);
    for (const e of entries) if (e.isDirectory() && !frozen(e.name)) stack.push(path.join(dir, e.name));
  }
  return out.sort();
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. ENTRY POINT
// ─────────────────────────────────────────────────────────────────────────────
const USAGE = 'Usage: repair-derived.cjs [--folder <packet>] [--roots <dir>] [--apply]';

function flagValue(argv, name) {
  const at = argv.indexOf(name);
  if (at === -1) return undefined;
  const value = argv[at + 1];
  if (value === undefined || value.startsWith('--')) fail(`${name} needs a path`);
  return value;
}

function fail(message) {
  process.stderr.write(`${message}\n${USAGE}\n`);
  process.exit(2);
}

// A repair writes into whatever it is pointed at, so the target is confined to
// the packet tree before anything is read. Without this a mistyped or relative
// path could rewrite files elsewhere in the repository, and the tool would have
// no way to notice it had done so.
function insideSpecs(target) {
  const resolved = path.resolve(REPO, target);
  const specsRoot = path.resolve(REPO, 'specs');
  const rel = path.relative(specsRoot, resolved);
  return resolved === specsRoot || (rel !== '' && !rel.startsWith('..') && !path.isAbsolute(rel));
}

function main() {
  const argv = process.argv.slice(2);
  const known = new Set(['--folder', '--roots', '--apply']);
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token.startsWith('--')) {
      if (!known.has(token)) fail(`unknown argument: ${token}`);
      if (token !== '--apply') i += 1;
    }
  }

  const apply = argv.includes('--apply');
  const folderArg = flagValue(argv, '--folder');
  const rootsArg = flagValue(argv, '--roots') || 'specs';
  for (const candidate of [folderArg, rootsArg].filter(Boolean)) {
    if (!insideSpecs(candidate)) fail(`refusing a target outside the packet tree: ${candidate}`);
    if (!fs.existsSync(path.resolve(REPO, candidate))) fail(`no such path: ${candidate}`);
  }
  const targets = folderArg ? [folderArg] : discover(rootsArg);

  let repaired = 0, pending = 0, failed = 0;
  const blocked = new Map();

  for (const folder of targets) {
    const result = repairFolder(folder, apply);
    if (result.unreadable) { failed += 1; process.stdout.write(`UNREADABLE ${folder}\n`); continue; }
    for (const rule of result.authored || []) blocked.set(rule, (blocked.get(rule) || 0) + 1);
    if (!result.planned || result.planned.length === 0) continue;
    if (apply) {
      repaired += 1;
      if (!result.rederived) { failed += 1; process.stdout.write(`REDERIVE-FAILED ${folder}\n`); }
      process.stdout.write(`repaired ${folder}\n`);
      for (const action of result.planned) process.stdout.write(`    ${action.what}\n`);
    } else {
      pending += 1;
      process.stdout.write(`would repair ${folder}\n`);
      for (const action of result.planned) process.stdout.write(`    ${action.what}\n`);
    }
  }

  process.stdout.write(`\ninspected=${targets.length} ${apply ? `repaired=${repaired}` : `repairable=${pending}`} failed=${failed}\n`);
  if (blocked.size) {
    process.stdout.write('\nNot repairable here — these record work someone did, and only they can write them:\n');
    for (const [rule, count] of [...blocked].sort((a, b) => b[1] - a[1])) {
      process.stdout.write(`  ${String(count).padStart(5)}  ${rule}\n`);
    }
  }
  if (failed) process.exit(2);
  process.exit(!apply && pending > 0 ? 1 : 0);
}

main();
