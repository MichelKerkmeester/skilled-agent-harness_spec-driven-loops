// ───────────────────────────────────────────────────────────────────
// MODULE: Upgrade Legacy Spec Folders
// ───────────────────────────────────────────────────────────────────

// A tree written under the earlier rules can hold hundreds of spec folders that fail today's
// validator. This command runs the repair tools over the failing ones in the order
// that keeps each step's output valid input for the next: document edits first, derivation
// last. No language model is involved. Whatever the tools cannot clear is recorded in the
// packet's upgrade-baseline.json. The validator reports a recorded finding as a warning, and
// any finding the file does not list stays an error, so a new mistake still fails.
//
// Only packets that fail are touched, and archived snapshots are only ever recorded, never
// rewritten. Dry by default; --apply writes.
//
// Usage:
//   node .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs [--roots <dir>]... [--include-archive] [--apply]
//
// Exit codes: 0 = every packet in scope passes,
//             1 = dry run found failing packets,
//             2 = a rejected argument, a failed step, or a packet still
//                 failing after --apply.

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────
import { execFile } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const run = promisify(execFile);

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────
const SCRIPT = 'upgrade-legacy';
const SKILL_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const REPO = path.resolve(SKILL_ROOT, '../../..');
const VALIDATE = path.join(SKILL_ROOT, 'runtime/cli/spec/validate.sh');
// The TypeScript tools run from source through the tsx loader, as repair-derived does,
// because a source module must not depend on a build that can be stale.
const TSX_LOADER = path.join(SKILL_ROOT, 'node_modules/tsx/dist/loader.mjs');
const GRAPH_BACKFILL = path.join(SKILL_ROOT, 'runtime/cli/graph/backfill-graph-metadata.ts');

// The backfill module runs its own CLI when argv[1] names it, so the root is
// passed first and the module path second: argv[1] must never be the module.
const LIST_SCRIPT = [
  "import { pathToFileURL } from 'node:url';",
  'const [root, modulePath] = process.argv.slice(1);',
  'const { collectSpecFolders } = await import(pathToFileURL(modulePath).href);',
  'process.stdout.write(JSON.stringify(collectSpecFolders(root, { activeOnly: false })));',
].join('\n');
const FRONTMATTER_LIB = path.join(SKILL_ROOT, 'runtime/cli/lib/frontmatter-migration.ts');
const TEMPLATES_ROOT = path.join(SKILL_ROOT, 'templates');
const HEAL = path.join(SKILL_ROOT, 'runtime/cli/spec/heal-spec-docs.cjs');
const REPAIR = path.join(SKILL_ROOT, 'runtime/cli/spec/repair-derived.cjs');
const MIGRATE = path.join(SKILL_ROOT, 'runtime/cli/graph/migrate-generated-json.ts');

// Each packet is validated in its own process and a worker spends most of its
// life waiting on the validator's rule subprocesses, so the pool is worth
// pushing past the core count; a measured tree flattened out at 24.
const WORKERS = Math.max(4, Math.min(24, Math.ceil(os.cpus().length * 1.5)));

// A wedged validator would otherwise hold a worker — and so the whole run —
// open forever. A packet takes about two seconds; five minutes is a hang.
const VALIDATE_CHILD = { cwd: REPO, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout: 5 * 60 * 1000 };

// A repair step can walk a whole tree and take minutes doing it, so it gets an
// hour; a wedged step still cannot hold the sweep open forever.
const STEP_CHILD = { ...VALIDATE_CHILD, timeout: 60 * 60 * 1000 };

// Folders per child call: some kernels cap a single argument near 128 KB, and
// a long list of absolute folder paths in one argv would cross it.
const BATCH = 100;

// Archived and future trees are frozen snapshots, so the default scope leaves
// them alone and --include-archive opts in deliberately.
const ARCHIVE_SEGMENTS = new Set(['z_archive', 'z_future']);

// research and review runs keep copies of spec folders inside a packet
// (containment baselines, source snapshots). Those copies are workflow
// artifacts, not packets, and repairing them would rewrite the evidence.
// The first segment is exempt because it names a track, and a track may
// carry one of these names.
const ARTIFACT_TREES = new Set(['research', 'review', 'context']);

const BASELINE_FILE = 'upgrade-baseline.json';

// This mirrors the validator's own never-recorded list: recording one of these
// in an active packet would only mislead, since the validator never downgrades
// it there.
const NEVER_RECORDED_RULES = new Set([
  'GENERATED_METADATA_INTEGRITY', 'GENERATED_METADATA_DRIFT', 'METADATA_DISK_PATH_CONSISTENCY',
  'CANONICAL_SAVE_LINEAGE_REQUIRED', 'GRAPH_METADATA_CHILD_IDENTITY',
]);

// ───────────────────────────────────────────────────────────────────
// 3. ARGUMENTS
// ───────────────────────────────────────────────────────────────────
function parseArgs(argv) {
  const parsed = { roots: [], includeArchive: false, apply: false };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--apply') {
      parsed.apply = true;
    } else if (arg === '--include-archive') {
      parsed.includeArchive = true;
    } else if (arg === '--roots') {
      const value = argv[index + 1];
      if (value === undefined || value.startsWith('--')) {
        process.stderr.write(`${SCRIPT}: ${arg} requires a value\n`);
        process.exit(2);
      }
      parsed.roots.push(value);
      index += 1;
    } else {
      process.stderr.write(`${SCRIPT}: unknown argument: ${arg}\n`);
      process.exit(2);
    }
  }
  return parsed;
}

function contained(target, root) {
  const rel = path.relative(root, target);
  return target === root || (rel !== '' && !rel.startsWith('..') && !path.isAbsolute(rel));
}

// Roots are resolved to real paths and deduplicated because some checkouts
// symlink .opencode/specs at specs: walking both spellings would validate
// every packet twice and count every failure twice. A supplied root is also
// confined to the repository, checked on the real path so a symlink cannot
// point the walk out of the tree.
function resolveRoots(given) {
  const candidates = given.length > 0
    ? given.map((dir) => path.resolve(REPO, dir))
    : [path.join(REPO, 'specs'), path.join(REPO, '.opencode', 'specs')].filter((dir) => fs.existsSync(dir));
  const roots = [];
  for (const candidate of candidates) {
    if (!fs.existsSync(candidate)) {
      process.stderr.write(`${SCRIPT}: no such root: ${candidate}\n`);
      process.exit(2);
    }
    if (!fs.statSync(candidate).isDirectory()) {
      process.stderr.write(`${SCRIPT}: not a directory: ${candidate}\n`);
      process.exit(2);
    }
    const real = fs.realpathSync(candidate);
    // v3 kept packets in .opencode/specs and v4 reads them from a top-level
    // specs/. The derivation tools resolve every packet against specs/, so a
    // tree whose real home is still .opencode/specs would be repaired only
    // halfway. The run stops before any write and says how to move it.
    const [first, second] = path.relative(REPO, real).split(path.sep);
    if (first === '.opencode' && second === 'specs') {
      process.stderr.write(`${SCRIPT}: the packets still live in .opencode/specs, where v3 kept them, and v4 reads them from a top-level specs/ folder.\n`);
      // A v3 checkout tracks specs as a symlink to .opencode/specs, and git mv
      // refuses a destination that exists, so the link goes first. rm without
      // -r never removes a real directory.
      process.stderr.write('Move them, keep the old path working, then run this again:\n  rm -f specs && git mv .opencode/specs specs && ln -s ../specs .opencode/specs\n');
      process.exit(2);
    }
    if (!contained(real, REPO)) {
      process.stderr.write(`${SCRIPT}: root outside the repository: ${candidate}\n`);
      process.exit(2);
    }
    if (!roots.includes(real)) roots.push(real);
  }
  return roots;
}

// ───────────────────────────────────────────────────────────────────
// 4. DISCOVERY
// ───────────────────────────────────────────────────────────────────
async function listSpecFolders(root) {
  const { stdout } = await run('node', ['--import', TSX_LOADER, '--input-type=module', '-e', LIST_SCRIPT, root, GRAPH_BACKFILL], VALIDATE_CHILD);
  return JSON.parse(stdout);
}

// A packet's place is judged below the first `specs` directory inside the
// repository, never below the root the caller named: a root that already
// sits inside z_archive must still mark its packets archived, or they would
// be repaired as active ones. The first one, because a research run keeps
// copies of whole specs trees inside a packet, and measuring from such a
// copy's own `specs` would hide the research folder that holds it.
function specsSegments(folder) {
  const segments = path.relative(REPO, folder).split(path.sep);
  return segments.slice(segments.indexOf('specs') + 1);
}

async function discover(roots, includeArchive) {
  const packets = [];
  // Roots may nest, such as specs and one track inside it, and a packet under
  // both would otherwise be validated and repaired twice.
  const seen = new Set();
  for (const root of roots) {
    for (const folder of await listSpecFolders(root)) {
      if (seen.has(folder)) continue;
      seen.add(folder);
      const segments = specsSegments(folder);
      const archived = segments.some((segment) => ARCHIVE_SEGMENTS.has(segment));
      if (archived && !includeArchive) continue;
      if (segments.slice(1).some((segment) => ARTIFACT_TREES.has(segment))) continue;
      packets.push({ folder, root, archived });
    }
  }
  return packets.sort((a, b) => (a.folder < b.folder ? -1 : a.folder > b.folder ? 1 : 0));
}

// ───────────────────────────────────────────────────────────────────
// 5. VALIDATION
// ───────────────────────────────────────────────────────────────────
function parseReport(stdout) {
  try {
    const report = JSON.parse(stdout);
    return report && typeof report === 'object' ? report : null;
  } catch {
    return null;
  }
}

// Why a packet's report could not be read. An unexplained "unreadable" line
// looks the same whether the validator hung, crashed or printed nothing.
const unreadableWhy = new Map();

async function validate(folder) {
  unreadableWhy.delete(folder);
  try {
    const { stdout } = await run('bash', [VALIDATE, folder, '--strict', '--json', '--no-recursive'], VALIDATE_CHILD);
    const report = parseReport(stdout);
    if (report === null) unreadableWhy.set(folder, 'no JSON report on stdout');
    return report;
  } catch (err) {
    // A non-zero exit is the normal path for a failing packet; the report still
    // arrives on stdout. A child that was *killed* — by the timeout, by a
    // signal, by output past maxBuffer — never finished writing that report,
    // and its truncated stdout must not be mistaken for one. Only a child that
    // chose its own exit status has a report worth reading.
    if (err.killed || err.signal || typeof err.code !== 'number') {
      unreadableWhy.set(folder, err.signal ? `killed (${err.signal})` : `did not run (${err.code || 'unknown error'})`);
      return null;
    }
    const report = parseReport(err.stdout);
    if (report === null) {
      const last = String(err.stderr || '').split('\n').reverse().find((line) => line.trim() !== '');
      unreadableWhy.set(folder, last === undefined ? `exit ${err.code}` : `exit ${err.code}: ${last}`);
    }
    return report;
  }
}

function failingRules(report) {
  return [...new Set(report.entries.filter((row) => row.status === 'error').map((row) => row.rule))].sort();
}

async function validateAll(packets) {
  const reports = new Map();
  let next = 0;
  async function worker() {
    while (next < packets.length) {
      const { folder } = packets[next];
      next += 1;
      reports.set(folder, await validate(folder));
    }
  }
  await Promise.all(Array.from({ length: Math.min(WORKERS, packets.length) }, () => worker()));
  return reports;
}

// ───────────────────────────────────────────────────────────────────
// 6. STEPS
// ───────────────────────────────────────────────────────────────────

// A failing repair step must not abort the sweep: the later steps and the
// other packets still deserve their attempt, so a failure becomes one reported
// line and the run goes on. Nothing here may throw.
async function runStep(label, args, options = STEP_CHILD, quiet = false, relay = false) {
  let why = null;
  let out = '';
  try {
    const result = await run('node', ['--import', TSX_LOADER, ...args], options);
    out = result.stdout;
  } catch (err) {
    out = String((err && err.stdout) || '');
    if (err && (err.killed || err.signal)) {
      why = `killed (${err.signal || 'timed out'})`;
    } else {
      const code = err && typeof err.code === 'number' ? err.code : '?';
      const last = String((err && err.stderr) || '').split('\n').reverse().find((line) => line.trim() !== '');
      why = last === undefined ? `exit ${code}` : `exit ${code}: ${last}`;
    }
  }
  // A relayed step reports to the user on its stdout, and a failed run may
  // still have named files before it stopped.
  if (relay && out) process.stdout.write(out);
  if (!quiet) process.stdout.write(why === null ? `step ${label}: ok\n` : `step ${label}: FAILED ${why}\n`);
  return why;
}

function batches(list) {
  const out = [];
  for (let index = 0; index < list.length; index += BATCH) out.push(list.slice(index, index + BATCH));
  return out;
}

// Adds the frontmatter keys a document lacks and never rewrites one it has.
// The shared builder regenerates a whole block, which would replace authored
// titles and reorder keys, so its output serves only as the source of values
// for missing keys. It runs in a child process under the tsx loader, because
// the builder is TypeScript and this command is plain Node, so it is written
// to be serialized: everything it uses arrives as a parameter.
function fillMissingFrontmatter({ fs, path, lib }, templatesRoot, folders) {
  const canonical = (key) => key.toLowerCase().replace(/_/gu, '');
  const managed = new Set(['title', 'description', 'triggerphrases', 'importancetier', 'contexttype']);
  let failed = 0;
  for (const folder of folders) {
    for (const name of fs.readdirSync(folder)) {
      if (!lib.SPEC_DOC_BASENAMES.has(name.toLowerCase())) continue;
      const file = path.join(folder, name);
      try {
        if (!fs.statSync(file).isFile()) continue;
        const original = fs.readFileSync(file, 'utf8');
        const built = lib.buildFrontmatterContent(original, { templatesRoot }, file);
        if (built.malformedFrontmatter) {
          // A block the detector cannot read is left byte-identical, and the
          // run names it, because nothing else tells the user it was passed over.
          process.stdout.write(`left as is ${path.relative(process.cwd(), file)}: ${built.malformedReason}\n`);
          continue;
        }
        if (!built.changed) continue;
        const own = lib.detectFrontmatter(original);
        let next;
        if (!own.found) {
          // A delimiter the detector refuses, such as an overlong block, is
          // still somebody's frontmatter, and a second block above it would
          // corrupt the document.
          if (original.split('\n').slice(0, 5).some((line) => line.trim() === '---')) {
            process.stdout.write(`left as is ${path.relative(process.cwd(), file)}: a frontmatter delimiter the detector refuses\n`);
            continue;
          }
          next = built.content;
        } else {
          const present = new Set(own.sections.map((section) => canonical(section.key)));
          const added = lib.detectFrontmatter(built.content).sections
            .filter((section) => managed.has(canonical(section.key)) && !present.has(canonical(section.key)));
          if (added.length === 0) continue;
          const eol = own.rawBlock.includes('\r\n') ? '\r\n' : '\n';
          const closing = original.indexOf('\n', own.start) + 1 + own.rawBlock.length;
          next = `${original.slice(0, closing)}${added.flatMap((section) => section.lines).join(eol)}${eol}${original.slice(closing)}`;
        }
        if (next !== original) fs.writeFileSync(file, next, 'utf8');
      } catch (err) {
        failed += 1;
        process.stderr.write(`fill-frontmatter ${file}: ${(err && err.message) || err}\n`);
      }
    }
  }
  if (failed > 0) process.exitCode = 1;
}

// The templates root comes first so that argv[1] is never the library, the
// same guard the discovery script keeps.
const FILL_SCRIPT = [
  "import fs from 'node:fs';",
  "import path from 'node:path';",
  "import { pathToFileURL } from 'node:url';",
  `const fillMissingFrontmatter = ${fillMissingFrontmatter.toString()};`,
  'const [templatesRoot, libPath, ...folders] = process.argv.slice(1);',
  'const lib = await import(pathToFileURL(libPath).href);',
  'fillMissingFrontmatter({ fs, path, lib }, templatesRoot, folders);',
].join('\n');

// Runs the repair tools over the packets that failed the first validation, in
// an order that keeps each step's output valid input for the next: document
// edits first, derivation last. Only these targets are touched, so a packet
// that already passes is never rewritten.
async function repairPackets(targets) {
  const failures = [];

  for (const batch of batches(targets)) {
    const why = await runStep('fill-frontmatter', ['--input-type=module', '-e', FILL_SCRIPT, TEMPLATES_ROOT, FRONTMATTER_LIB, ...batch], STEP_CHILD, false, true);
    if (why !== null) failures.push(why);
  }

  let next = 0;
  let failed = 0;
  async function worker() {
    while (next < targets.length) {
      const target = targets[next];
      next += 1;
      const why = await runStep(`heal-spec-docs ${path.relative(REPO, target)}`, [HEAL, '--apply', '--folder', target], STEP_CHILD, true);
      if (why !== null) {
        failed += 1;
        failures.push(`${path.relative(REPO, target)}: ${why}`);
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(WORKERS, targets.length) }, () => worker()));
  process.stdout.write(failed === 0
    ? `step heal-spec-docs: ok (${targets.length} packets)\n`
    : `step heal-spec-docs: FAILED ${failed} of ${targets.length} packets\n`);

  for (const batch of batches(targets)) {
    const why = await runStep('repair-derived', [REPAIR, '--apply', ...batch.flatMap((folder) => ['--folder', folder])]);
    if (why !== null) failures.push(why);
  }

  for (const batch of batches(targets)) {
    const why = await runStep('migrate-generated-json', [MIGRATE, ...batch.flatMap((folder) => ['--only', folder])]);
    if (why !== null) failures.push(why);
  }

  return failures;
}

// ───────────────────────────────────────────────────────────────────
// 7. RECORD
// ───────────────────────────────────────────────────────────────────

// The baseline must list whatever is still visible as wrong after repair (the
// fresh errors plus anything already recorded), because a recorded finding the
// file no longer names would flip straight back to an error on the next run.
// Every copy is listed, repeats included: the validator relaxes an entry only
// when each copy of a detail is listed, so one line for two copies would leave
// the entry an error.
function findingsOf(report, archived) {
  const findings = [];
  for (const entry of report.entries) {
    if (entry.status !== 'error' && entry.recorded !== true) continue;
    if (!archived && NEVER_RECORDED_RULES.has(entry.rule)) continue;
    const details = entry.details.length > 0 ? entry.details : [entry.message];
    for (const detail of details) findings.push({ rule: entry.rule, detail });
  }
  findings.sort((a, b) => (a.rule < b.rule ? -1 : a.rule > b.rule ? 1 : a.detail < b.detail ? -1 : a.detail > b.detail ? 1 : 0));
  return findings;
}

// The validator reads the baseline from beside the packet's documents. A file
// whose real parent resolves outside the roots would write into some other
// tree, so that is refused loudly instead of recorded.
function recordFindings(folder, findings, roots) {
  const file = path.join(folder, BASELINE_FILE);
  const parent = fs.realpathSync(path.dirname(file));
  if (!roots.some((root) => contained(parent, root))) {
    throw new Error(`${SCRIPT}: refusing to record outside the roots: ${file}`);
  }
  try {
    const existing = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (JSON.stringify(existing.findings) === JSON.stringify(findings)) return 'unchanged';
  } catch {
    // A missing or malformed baseline simply gets rewritten below.
  }
  const body = { schema: 1, recordedBy: 'upgrade-legacy', recordedAt: new Date().toISOString(), findings };
  const tmp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, `${JSON.stringify(body, null, 2)}\n`);
  fs.renameSync(tmp, file);
  return 'written';
}

// ───────────────────────────────────────────────────────────────────
// 8. MAIN
// ───────────────────────────────────────────────────────────────────
async function main() {
  const { roots: given, includeArchive, apply } = parseArgs(process.argv.slice(2));
  const roots = resolveRoots(given);
  const packets = await discover(roots, includeArchive);

  if (packets.length === 0) {
    process.stdout.write(`${SCRIPT}: no spec folders found\n`);
    process.exitCode = 0;
    return;
  }

  const before = await validateAll(packets);

  // Every repair decision rests on the first validation, and a packet with no
  // report cannot be judged. The usual cause, a stale build or a broken
  // toolchain, would make every later step unreliable too, so --apply writes
  // nothing at all.
  const unread = packets.filter((packet) => before.get(packet.folder) === null);
  if (apply && unread.length > 0) {
    for (const packet of unread) {
      process.stderr.write(`unreadable ${path.relative(REPO, packet.folder)}: ${unreadableWhy.get(packet.folder)}\n`);
    }
    process.stderr.write(`${SCRIPT}: ${unread.length} packet(s) could not be validated, so nothing was written\n`);
    process.exitCode = 2;
    return;
  }

  if (apply) {
    const failures = await repairPackets(packets
      .filter((packet) => !packet.archived && before.get(packet.folder)?.passed !== true)
      .map((packet) => packet.folder));

    const mid = await validateAll(packets);
    const recorded = [];
    for (const packet of packets) {
      // A packet that passed at the start was never repaired, so a failure now
      // is damage from a step rather than an inherited finding. Recording it
      // would hide the damage; it stays an error and is reported below.
      if (before.get(packet.folder).passed === true) continue;
      const report = mid.get(packet.folder);
      if (report === null || report.passed === true) continue;
      const findings = findingsOf(report, packet.archived);
      if (findings.length === 0) continue;
      let outcome;
      try {
        outcome = recordFindings(packet.folder, findings, roots);
      } catch (err) {
        failures.push((err && err.message) || String(err));
        continue;
      }
      if (outcome === 'written') {
        recorded.push(packet);
        process.stdout.write(`recorded ${path.relative(REPO, packet.folder)} (${findings.length} findings)\n`);
      }
    }

    const after = new Map(mid);
    for (const [folder, report] of await validateAll(recorded)) after.set(folder, report);

    let notPassing = 0;
    for (const packet of packets) {
      const report = after.get(packet.folder);
      const shown = path.relative(REPO, packet.folder);
      if (report === null) {
        notPassing += 1;
        process.stdout.write(`unreadable ${shown}: ${unreadableWhy.get(packet.folder)}\n`);
        continue;
      }
      if (report.passed === true) continue;
      notPassing += 1;
      process.stdout.write(`still failing ${shown}: ${failingRules(report).join(', ')}\n`);
    }

    const active = packets.filter((packet) => !packet.archived).length;
    process.stdout.write(`\ninspected=${packets.length} active=${active} archived=${packets.length - active}\n`);
    const passingNow = (reports) => packets.filter((packet) => {
      const report = reports.get(packet.folder);
      return report !== null && report.passed === true;
    }).length;
    process.stdout.write(`passing before=${passingNow(before)}/${packets.length} after=${passingNow(after)}/${packets.length}\n`);

    const byRule = new Map();
    for (const packet of packets) {
      let body;
      try {
        body = JSON.parse(fs.readFileSync(path.join(packet.folder, BASELINE_FILE), 'utf8'));
      } catch {
        continue;
      }
      if (!body || !Array.isArray(body.findings)) continue;
      for (const finding of body.findings) {
        byRule.set(finding.rule, (byRule.get(finding.rule) || 0) + 1);
      }
    }
    process.stdout.write('recorded findings by rule:\n');
    for (const rule of [...byRule.keys()].sort()) {
      process.stdout.write(`  ${rule}: ${byRule.get(rule)}\n`);
    }

    process.exitCode = failures.length > 0 || notPassing > 0 ? 2 : 0;
    return;
  }

  let bad = 0;
  for (const { folder } of packets) {
    const report = before.get(folder);
    const shown = path.relative(REPO, folder);
    if (report === null) {
      bad += 1;
      process.stdout.write(`unreadable ${shown}: ${unreadableWhy.get(folder)}\n`);
      continue;
    }
    if (report.passed === true) continue;
    bad += 1;
    process.stdout.write(`failing ${shown}: ${failingRules(report).join(', ')}\n`);
  }

  const active = packets.filter((packet) => !packet.archived).length;
  process.stdout.write(`\ninspected=${packets.length} active=${active} archived=${packets.length - active}\n`);
  const passing = packets.filter((packet) => {
    const report = before.get(packet.folder);
    return report !== null && report.passed === true;
  }).length;
  process.stdout.write(`passing=${passing}/${packets.length}\n`);

  process.stdout.write('\n--apply would run: fill-frontmatter, heal-spec-docs, repair-derived, migrate-generated-json, then record the remaining findings in upgrade-baseline.json\n');
  process.exitCode = bad > 0 ? 1 : 0;
}

main().catch((err) => {
  process.stderr.write(`${SCRIPT} failed: ${(err && err.stack) || err}\n`);
  process.exit(2);
});
