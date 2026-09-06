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
// work. Repairing only the first kind is the whole point: a tool that filled in
// the second would make the gate green by making the packet lie.
//
// Dry by default; --apply writes. Everything --apply will write is named by the
// dry run first, so the report is a faithful preview rather than a summary of
// some of it. Idempotent, so a second run is a no-op.
//
// Exit: 0 = nothing left that this tool can repair; 1 = repairable work found
// (dry run); 2 = something failed — a rejected argument, a packet whose report
// could not be read, or a repair that did not land.

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────
const { execFile } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { promisify } = require('node:util');

const run = promisify(execFile);

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────
const REPO = process.cwd();
const VALIDATE = '.opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh';
const BACKFILL = '.opencode/skills/system-spec-kit/runtime/cli/graph/backfill-graph-metadata.ts';
const TSX_LOADER = './.opencode/skills/system-spec-kit/node_modules/tsx/dist/loader.mjs';

// Each packet is validated by its own process and nothing is shared between
// them, so the wall-clock cost is a scheduling problem rather than a real one.
// Serially this walk takes hours, which is long enough that nobody runs it.
//
// Nearly all of a packet's cost is the validator's own rule subprocesses, so a
// worker spends most of its life waiting on children rather than computing, and
// the pool is worth pushing past the core count. Measured over a 181-packet
// tree on 18 cores: 12 workers 57.7s, 16 → 49.1s, 24 → 45.9s, 32 → 45.6s. The
// curve is flat past 24 and every worker holds a shell plus its node children,
// so that is where the cap sits.
const WORKERS = Math.max(4, Math.min(24, Math.ceil(os.cpus().length * 1.5)));

// A wedged validator would otherwise hold a worker — and so the whole run —
// open forever. A packet takes about two seconds; five minutes is a hang.
const CHILD = { cwd: REPO, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout: 5 * 60 * 1000 };

// Rules this tool can settle from repository state alone. Anything absent from
// this list is reported and left alone, however mechanical it may look.
//
// The validator registry already classifies every rule, and this list is not
// simply its structural category. Two deliberate differences, recorded here so
// the next reader does not have to guess whether they were intended:
//
//   GRAPH_METADATA_SHAPE is structural and included, because the re-derive
//   rewrites the very file it makes assertions about.
//
//   SPEC_DOC_INTEGRITY is classified as an authored-template rule and included
//   anyway, because one of its two failure modes is a recorded location that
//   has gone stale — recomputable — while the other is a reference to a file
//   that no longer exists, which is not. Only the first is repaired; a packet
//   failing solely on the second is reported as beyond this tool rather than
//   passing silently.
const DERIVABLE = new Set([
  'DESCRIPTION_SHAPE',
  'GENERATED_METADATA_INTEGRITY',
  'GENERATED_METADATA_DRIFT',
  'GRAPH_METADATA_SHAPE',
  'METADATA_DISK_PATH_CONSISTENCY',
  'SPEC_DOC_INTEGRITY',
]);

// The subset a re-derive can actually settle, because they are assertions about
// graph-metadata.json itself. The others describe description.json contents and
// in-document reference paths, which a re-derive does not write; planning one
// for them would be a write that changes nothing and a report line that never
// clears.
const REDERIVABLE = new Set([
  'GENERATED_METADATA_INTEGRITY',
  'GENERATED_METADATA_DRIFT',
  'GRAPH_METADATA_SHAPE',
  'METADATA_DISK_PATH_CONSISTENCY',
]);

const POINTER_LINE = /^([ \t]*packet_pointer:[ \t]*)(["']?)([^"'\r\n]*)(["']?)[ \t]*\r?$/m;
const SPEC_FOLDER_ROW = /(\|[ \t]*\*\*Spec Folder\*\*[ \t]*\|[ \t]*)([^|\r\n]+?)([ \t]*\|)/;
const DOCS = ['spec.md', 'plan.md', 'tasks.md', 'implementation-summary.md', 'handover.md'];
const PACKET_MARKERS = new Set(['spec.md', 'implementation-summary.md']);

// The recorded location lives in the leading YAML block. A pointer written into
// a document's body is an illustration of the format, not this packet's own
// record, and rewriting it would corrupt the passage it explains. The block can
// sit behind a template-source HTML comment, so the opener is matched past
// leading comments and blank lines rather than demanded at byte zero. Every
// repeat here consumes a newline, so the group cannot loop on an empty match.
const FRONTMATTER_OPEN = /^\uFEFF?(?:[ \t]*\r?\n|<!--[\s\S]*?-->[ \t]*\r?\n)*---[ \t]*\r?\n/;
const FRONTMATTER_CLOSE = /^(?:---|\.\.\.)[ \t]*\r?$/m;

const USAGE = 'Usage: repair-derived.cjs [--folder <packet>] [--roots <dir>] [--apply]';

// Reported as one planned step like any other, so a dry run names it and the
// exit code counts it. Carries no apply(): the re-derive is a child process the
// repair awaits, not a file this tool writes itself.
const REDERIVE_STEP = Object.freeze({ what: 're-derive graph metadata' });

/** Rejected arguments, kept apart from failures so the usage line follows them. */
class UsageError extends Error {}

function fail(message) {
  throw new UsageError(message);
}

// ───────────────────────────────────────────────────────────────────
// 3. DIAGNOSIS
// ───────────────────────────────────────────────────────────────────
function parseReport(stdout) {
  try {
    const report = JSON.parse(stdout);
    return report && typeof report === 'object' ? report : null;
  } catch {
    return null;
  }
}

async function validate(folder) {
  try {
    const { stdout } = await run('bash', [VALIDATE, folder, '--strict', '--json', '--no-recursive'], CHILD);
    return parseReport(stdout);
  } catch (err) {
    // A non-zero exit is the normal path for a failing packet; the report still
    // arrives on stdout. A child that was *killed* — by the timeout, by a
    // signal, by output past maxBuffer — never finished writing that report,
    // and its truncated stdout must not be mistaken for one. Only a child that
    // chose its own exit status has a report worth reading.
    if (err.killed || err.signal || typeof err.code !== 'number') return null;
    return parseReport(err.stdout);
  }
}

/** Why a child process did not succeed, in one line fit for the report. */
function childFailure(err) {
  if (err.killed || err.signal) return `killed (${err.signal || 'timed out'})`;
  const lastLine = String(err.stderr || '').trim().split('\n').filter(Boolean).pop();
  if (typeof err.code === 'number') return lastLine ? `exit ${err.code}: ${lastLine}` : `exit ${err.code}`;
  return String(err.code || err.message || 'unknown failure');
}

// Packets resolve to one of two report schemas — the node validation
// orchestrator's `entries` and the shell fallback's `results` — and reading
// only one silently reports half the fleet as having nothing wrong.
function findings(report) {
  const rows = [...(report.results || []), ...(report.entries || [])];
  return rows.filter((r) => ['error', 'warn', 'warning'].includes(String(r.status || r.severity || '').toLowerCase()));
}

const LEVEL_MARKER = /<!--\s*SPECKIT_LEVEL:\s*(\d\+?)\s*-->/;
const LEVEL_MARKER_DOCS = ['spec.md', 'tasks.md', 'plan.md'];

// The level the packet states about itself, or null when it states none.
// Mirrors the generator that owns this field so the two writers agree; the
// validator's reported level cannot be used here because it falls back to a
// default when nothing is declared, and writing that would record a level the
// packet never claimed.
function declaredLevel(folder) {
  for (const doc of LEVEL_MARKER_DOCS) {
    const text = readIfPresent(path.join(folder, doc));
    const found = text === null ? null : LEVEL_MARKER.exec(text);
    if (found) return found[1];
  }
  return null;
}

/** The frontmatter block's end offset, or 0 when the document has no block. */
function frontmatterEnd(text) {
  const open = FRONTMATTER_OPEN.exec(text);
  if (!open) return 0;
  const body = text.slice(open[0].length);
  const close = FRONTMATTER_CLOSE.exec(body);
  return close ? open[0].length + close.index + close[0].length : 0;
}

/** Read a file that may not be there, without racing a separate existence check. */
function readIfPresent(file) {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch (err) {
    if (err.code === 'ENOENT' || err.code === 'EISDIR') return null;
    throw err;
  }
}

// ───────────────────────────────────────────────────────────────────
// 4. DERIVED REPAIRS
// ───────────────────────────────────────────────────────────────────

// A repair rewrites a document a person wrote. Writing in place truncates the
// file first, so an interrupt between the truncate and the write leaves that
// document empty — an outcome worse than the failure being repaired. Writing a
// sibling and renaming over the original makes the swap atomic: a reader sees
// either the old bytes or the new ones, never neither.
let tempWriteSeq = 0;

function writeAtomic(file, text) {
  const temp = path.join(path.dirname(file), `.${path.basename(file)}.repair-${process.pid}-${(tempWriteSeq += 1)}.tmp`);
  try {
    fs.writeFileSync(temp, text);
    try {
      fs.chmodSync(temp, fs.statSync(file).mode & 0o777);
    } catch {
      // No original to match: the default mode is right for a new file.
    }
    fs.renameSync(temp, file);
  } catch (err) {
    fs.rmSync(temp, { force: true });
    throw err;
  }
}

function fixDescriptionLevel(folder, report) {
  const file = path.join(folder, 'description.json');
  const text = readIfPresent(file);
  if (text === null) return null;
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    // Unparseable metadata is a shape failure the validator reports; guessing
    // at what the file meant to say is exactly the writing this tool refuses.
    return null;
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) return null;
  // Only a level the packet declares itself. The validator reports a level for
  // every packet, but where none is declared that number comes from a fallback
  // ladder ending in a default — a value nobody wrote down. Recording it would
  // be inventing the fact this tool exists to avoid inventing, so a packet that
  // declares nothing keeps an absent field and stays visibly incomplete.
  const level = declaredLevel(folder);
  if (!level) return null;
  // A present value that contradicts the declared one is repaired, not left
  // alone. Filling only an absent field made drift permanent: the scaffold
  // writes a level before the author picks one, so every packet authored above
  // the scaffold level kept a derived number its own documents disagree with,
  // and nothing ever reconciled the two.
  const recorded = 'level' in data ? String(data.level) : null;
  if (recorded === level) return null;
  const verb = recorded === null ? 'set' : `corrected from ${recorded}`;
  return {
    file,
    what: `description level ${verb} -> ${level}`,
    apply: () => {
      const current = JSON.parse(fs.readFileSync(file, 'utf8'));
      // Recorded as a string: that is what the overwhelming majority of packets
      // already carry, and the schema accepts either, so matching them keeps the
      // field comparable across the fleet.
      current.level = level;
      writeAtomic(file, `${JSON.stringify(current, null, 2)}\n`);
    },
  };
}

function fixRecordedLocation(folder) {
  const actions = [];
  const basename = path.basename(folder);
  const pointer = path.relative(path.join(REPO, 'specs'), path.resolve(REPO, folder)).split(path.sep).join('/');

  const summary = path.join(folder, 'implementation-summary.md');
  const summaryText = readIfPresent(summary);
  if (summaryText !== null) {
    const row = SPEC_FOLDER_ROW.exec(summaryText);
    if (row && row[2].trim() !== basename) {
      actions.push({
        file: summary,
        what: `spec folder -> ${basename}`,
        apply: () => {
          const current = fs.readFileSync(summary, 'utf8');
          const hit = SPEC_FOLDER_ROW.exec(current);
          if (!hit) throw new Error('the Spec Folder row moved between the report and the write');
          writeAtomic(summary, current.slice(0, hit.index) + hit[1] + basename + hit[3] + current.slice(hit.index + hit[0].length));
        },
      });
    }
  }

  for (const name of DOCS) {
    const file = path.join(folder, name);
    const text = readIfPresent(file);
    if (text === null) continue;
    const hit = POINTER_LINE.exec(text);
    if (!hit || hit.index >= frontmatterEnd(text) || hit[3] === pointer) continue;
    actions.push({
      file,
      what: `packet pointer -> ${pointer}`,
      apply: () => {
        const current = fs.readFileSync(file, 'utf8');
        const found = POINTER_LINE.exec(current);
        if (!found || found.index >= frontmatterEnd(current)) {
          throw new Error('the packet pointer left the frontmatter between the report and the write');
        }
        writeAtomic(file, `${current.slice(0, found.index)}${found[1]}"${pointer}"${current.slice(found.index + found[0].length)}`);
      },
    });
  }
  return actions;
}

async function rederive(folder) {
  try {
    await run('node', ['--import', TSX_LOADER, BACKFILL, folder], CHILD);
    return null;
  } catch (err) {
    return childFailure(err);
  }
}

async function repairFolder(folder, apply) {
  const report = await validate(folder);
  if (!report) return { folder, unreadable: true };

  const rules = new Set(findings(report).map((f) => f.rule).filter(Boolean));
  const authored = [...rules].filter((rule) => !DERIVABLE.has(rule));
  if (authored.length === rules.size) return { folder, planned: [], authored };

  const edits = [];
  const levelFix = fixDescriptionLevel(folder, report);
  if (levelFix) edits.push(levelFix);
  edits.push(...fixRecordedLocation(folder));

  // Editing a document invalidates the fingerprint taken over it, so the
  // re-derive is part of the repair rather than a follow-up; skipping it swaps
  // one error for another. It also settles the metadata rules on its own, which
  // is the second reason to plan one.
  const staleMetadata = [...rules].some((rule) => REDERIVABLE.has(rule));
  const planned = edits.length > 0 || staleMetadata ? [...edits, REDERIVE_STEP] : [];

  // A rule can be on the allow-list and still have nothing this tool can do
  // about this particular packet — a reference to a file that is simply gone,
  // for instance. Such a packet used to leave here reported as neither repaired
  // nor refused, so it appeared in no total and a clean run was partly a
  // definition rather than a finding. Name it as beyond reach instead.
  const beyond = planned.length === 0 ? [...rules].filter((rule) => DERIVABLE.has(rule)) : [];
  if (!apply || planned.length === 0) return { folder, planned, authored, beyond };

  let wrote = 0;
  let failure = null;
  for (const edit of edits) {
    try {
      edit.apply();
      wrote += 1;
    } catch (err) {
      failure = `${path.basename(edit.file)}: ${err.message}`;
      break;
    }
  }
  // Re-derive after a partial failure too: the edits that did land have already
  // invalidated the stored fingerprint, and leaving it stale is the error this
  // step exists to prevent.
  if (wrote > 0 || staleMetadata) {
    const reason = await rederive(folder);
    if (reason && !failure) failure = `re-derive: ${reason}`;
  }
  return { folder, planned, authored, failure };
}

// ───────────────────────────────────────────────────────────────────
// 5. DISCOVERY
// ───────────────────────────────────────────────────────────────────

// Snapshots taken before a rename are frozen by definition: their recorded
// location is deliberately the old one, so "repairing" it to match where the
// snapshot now sits destroys the very thing the copy was kept to preserve.
const FROZEN_TREES = new Set(['node_modules', '.git', 'z_archive', 'scratch']);
const frozen = (name) => FROZEN_TREES.has(name) || name.startsWith('.backup-');

function discover(root) {
  const packets = [];
  const stack = [root];
  while (stack.length) {
    const dir = stack.pop();
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    let isPacket = false;
    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (!frozen(entry.name)) stack.push(path.join(dir, entry.name));
      } else if (PACKET_MARKERS.has(entry.name)) {
        isPacket = true;
      }
    }
    if (isPacket) packets.push(dir);
  }
  return packets.sort();
}

// ───────────────────────────────────────────────────────────────────
// 6. ARGUMENTS
// ───────────────────────────────────────────────────────────────────
function parseArgs(argv) {
  const options = { apply: false, folder: undefined, roots: 'specs' };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--apply') {
      options.apply = true;
    } else if (token === '--folder' || token === '--roots') {
      const value = argv[i + 1];
      if (value === undefined || value.startsWith('--')) fail(`${token} needs a path`);
      options[token === '--folder' ? 'folder' : 'roots'] = value;
      i += 1;
    } else if (token.startsWith('--')) {
      fail(`unknown argument: ${token}`);
    } else {
      // A bare path must not be read as an unscoped run. Accepting it would
      // turn a dropped flag name — `repair-derived.cjs specs/one --apply` —
      // into a rewrite of every packet in the tree.
      fail(`unexpected argument: ${token} (paths need --folder or --roots)`);
    }
  }
  return options;
}

function contained(target, root) {
  const rel = path.relative(root, target);
  return target === root || (rel !== '' && !rel.startsWith('..') && !path.isAbsolute(rel));
}

// A repair writes into whatever it is pointed at, so the target is confined to
// the packet tree before anything is read. Without this a mistyped or relative
// path could rewrite files elsewhere in the repository, and the tool would have
// no way to notice it had done so. The real path is checked as well, because a
// lexical check cannot see a symlink: `specs/anywhere -> /etc` resolves inside
// the tree and writes outside it. Real paths only ever narrow what is accepted;
// a target that fails the lexical check is refused without consulting the disk.
function insideSpecs(target) {
  const specsRoot = path.resolve(REPO, 'specs');
  if (!contained(path.resolve(REPO, target), specsRoot)) return false;
  try {
    return contained(fs.realpathSync(path.resolve(REPO, target)), fs.realpathSync(specsRoot));
  } catch {
    // Nothing on disk to resolve; the existence check reports it by name.
    return true;
  }
}

// ───────────────────────────────────────────────────────────────────
// 7. ENTRY POINT
// ───────────────────────────────────────────────────────────────────
async function main() {
  const { apply, folder: folderArg, roots: rootsArg } = parseArgs(process.argv.slice(2));

  // One clear refusal beats the same spawn failure repeated once per packet.
  const required = apply ? [VALIDATE, BACKFILL] : [VALIDATE];
  for (const tool of required) {
    if (!fs.existsSync(path.resolve(REPO, tool))) fail(`run this from the repository root: ${tool} is not here`);
  }
  for (const candidate of [folderArg, rootsArg].filter(Boolean)) {
    if (!insideSpecs(candidate)) fail(`refusing a target outside the packet tree: ${candidate}`);
    if (!fs.existsSync(path.resolve(REPO, candidate))) fail(`no such path: ${candidate}`);
  }
  const targets = folderArg ? [folderArg] : discover(rootsArg);

  let repaired = 0;
  let pending = 0;
  let failed = 0;
  let done = 0;
  const blocked = new Map();
  const unreachable = new Map();
  const lines = [];
  const progress = process.stderr.isTTY && targets.length > 1;

  let next = 0;
  async function worker() {
    while (next < targets.length) {
      const folder = targets[next];
      next += 1;
      let result;
      try {
        result = await repairFolder(folder, apply);
      } catch (err) {
        // One packet going wrong must not abandon the rest of the walk, nor
        // leave an --apply run without the account of what it already wrote.
        result = { folder, planned: [], authored: [], failure: err && err.message ? err.message : String(err) };
      }
      done += 1;
      // A whole-tree walk is long enough that silence reads as a hang, so the
      // count goes to stderr where it cannot contaminate piped output.
      if (progress) process.stderr.write(`\r  ${done}/${targets.length} packets`);

      if (result.unreadable) {
        failed += 1;
        lines.push(`UNREADABLE ${folder}`);
        continue;
      }
      for (const rule of result.authored) blocked.set(rule, (blocked.get(rule) || 0) + 1);
      for (const rule of result.beyond || []) unreachable.set(rule, (unreachable.get(rule) || 0) + 1);
      if (result.failure) {
        failed += 1;
        lines.push(`FAILED ${folder} — ${result.failure}`);
      } else if (result.planned.length === 0) {
        continue;
      } else if (apply) {
        repaired += 1;
        lines.push(`repaired ${folder}`);
      } else {
        pending += 1;
        lines.push(`would repair ${folder}`);
      }
      for (const step of result.planned) lines.push(`    ${step.what}`);
    }
  }

  await Promise.all(Array.from({ length: Math.min(WORKERS, targets.length) }, () => worker()));
  if (progress) process.stderr.write('\r\u001b[K');

  for (const line of lines) process.stdout.write(`${line}\n`);
  process.stdout.write(`\ninspected=${targets.length} ${apply ? `repaired=${repaired}` : `repairable=${pending}`} failed=${failed}\n`);

  if (blocked.size) {
    process.stdout.write('\nNot repairable here — these record work someone did, and only they can write them:\n');
    // Ties break by name so two runs over the same tree produce the same bytes;
    // insertion order here is whatever the pool happened to schedule.
    for (const [rule, count] of [...blocked].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))) {
      process.stdout.write(`  ${String(count).padStart(5)}  ${rule}\n`);
    }
  }

  if (unreachable.size) {
    process.stdout.write('\nOn the repairable list, but nothing here could settle this packet:\n');
    for (const [rule, count] of [...unreachable].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))) {
      process.stdout.write(`  ${String(count).padStart(5)}  ${rule}\n`);
    }
  }

  // End on the command that acts on what was just reported, so the next step is
  // copyable rather than something to reconstruct from the usage line.
  if (!apply && pending > 0) {
    const scope = folderArg ? `--folder ${folderArg}` : `--roots ${rootsArg}`;
    process.stdout.write(`\nTo apply these repairs:\n  node ${path.relative(REPO, __filename)} ${scope} --apply\n`);
  }

  // Set the status and let the process end on its own. process.exit() tears
  // down the runtime on top of whatever the streams are still doing, and it
  // would be the one place in the file that decides an exit code differently
  // from the handler below.
  process.exitCode = failed ? 2 : (!apply && pending > 0 ? 1 : 0);
}

// A reader that leaves early — `| head`, a closed terminal — is an ordinary way
// to end a report, not a failure. Node delivers that as an error event on the
// stream, which is fatal when unhandled; the process.exit() this used to end on
// happened to outrun it, so letting the process finish normally is what makes
// the handler necessary.
for (const stream of [process.stdout, process.stderr]) {
  stream.on('error', (err) => {
    if (err && err.code !== 'EPIPE') process.exitCode = 2;
  });
}

main().catch((err) => {
  if (err instanceof UsageError) process.stderr.write(`${err.message}\n${USAGE}\n`);
  else process.stderr.write(`repair-derived failed: ${(err && err.stack) || err}\n`);
  process.exitCode = 2;
});
