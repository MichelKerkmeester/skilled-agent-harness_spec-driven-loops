// ───────────────────────────────────────────────────────────────────
// MODULE: Upgrade Legacy Spec Folders
// ───────────────────────────────────────────────────────────────────

// A tree written under the earlier rules can hold hundreds of spec folders that fail today's
// validator. This command runs the repair tools over the failing ones in the order
// that keeps each step's output valid input for the next: frontmatter fill, anchor repair,
// healing, lane modes, and derivation last. No language model is involved. Whatever the
// tools cannot clear is recorded in the packet's upgrade-baseline.json. The validator
// reports a recorded finding as a warning, and any finding the file does not list stays an
// error, so a new mistake still fails.
//
// Only packets that fail are touched. An archived packet's prose is history and is never
// rewritten; moving the questions anchor opener, a marker line, is the one edit allowed
// there, because a nested opener is an error and moving it keeps every word while the
// anchors stay valid. Its derived fields, the recorded paths and the generated metadata,
// are repaired so they name where it lives now. Dry by default; --apply writes.
//
// Usage:
//   node .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs [--roots <dir>]... [--include-archive] [--apply]
//   node .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs --layout-map
//
// --layout-map prints the planned v3-to-v4 move of the spec roots as JSON and
// writes nothing.
//
// Exit codes: 0 = every packet in scope passes, or --layout-map found no collisions,
//             1 = dry run found failing packets, or --layout-map found collisions,
//             2 = a rejected argument, a failed step, a packet still failing
//                 after --apply, or a layout map that could not be produced.

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────
import { execFile } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { buildReport, classifyRepo } from './repo-era.mjs';

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

function createRunContext(repoRoot, skillRoot) {
  return {
    repoRoot,
    validate: path.join(skillRoot, 'runtime/cli/spec/validate.sh'),
    tsxLoader: path.join(skillRoot, 'node_modules/tsx/dist/loader.mjs'),
    frontmatterLib: path.join(skillRoot, 'runtime/cli/lib/frontmatter-migration.ts'),
    templatesRoot: path.join(skillRoot, 'templates'),
    heal: path.join(skillRoot, 'runtime/cli/spec/heal-spec-docs.cjs'),
    repair: path.join(skillRoot, 'runtime/cli/spec/repair-derived.cjs'),
    migrate: path.join(skillRoot, 'runtime/cli/graph/migrate-generated-json.ts'),
    validateOptions: { ...VALIDATE_CHILD, cwd: repoRoot },
    stepOptions: { ...STEP_CHILD, cwd: repoRoot },
  };
}

const LIVE_RUN_CONTEXT = createRunContext(REPO, SKILL_ROOT);

// Folders per child call: some kernels cap a single argument near 128 KB, and
// a long list of absolute folder paths in one argv would cross it.
const BATCH = 100;

// Archived and future trees hold finished work, so the default scope leaves
// them alone and --include-archive opts in deliberately. Even then their prose
// is left alone; moving the questions anchor opener, a marker line, is the one
// document edit, because a nested opener is an error and moving it keeps every
// word of the record while its anchors stay valid.
const ARCHIVE_SEGMENTS = new Set(['z_archive', 'z_future']);

// research and review runs keep copies of spec folders inside a packet
// (containment baselines, source snapshots). Those copies are workflow
// artifacts, not packets, and repairing them would rewrite the evidence.
// The first segment is exempt because it names a track, and a track may
// carry one of these names.
const ARTIFACT_TREES = new Set(['research', 'review', 'context']);

const BASELINE_FILE = 'upgrade-baseline.json';
const MANIFEST_FILE = 'upgrade-legacy.manifest.json';

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

function repoRelative(target) {
  return path.relative(REPO, target).split(path.sep).join('/');
}

function resolveRepoPath(relative) {
  if (typeof relative !== 'string' || relative.length === 0 || path.isAbsolute(relative)) {
    throw new Error(`invalid repository path: ${relative}`);
  }
  const target = path.resolve(REPO, ...relative.split('/'));
  if (!contained(target, REPO)) throw new Error(`repository path escapes REPO: ${relative}`);
  return target;
}

function parseDirtyPaths(stdout) {
  const fields = stdout.split('\0');
  const paths = [];
  for (let index = 0; index < fields.length;) {
    const record = fields[index];
    index += 1;
    if (!record || record.length < 4) continue;
    const status = record.slice(0, 2);
    const relative = record.slice(3);
    if (relative) paths.push(relative);
    if (status.includes('R') || status.includes('C')) index += 1;
  }
  return [...new Set(paths)].sort();
}

// Resolve Git state from REPO so a caller's current directory cannot select another worktree.
async function readRepositoryState() {
  let gitDir;
  try {
    const result = await run('git', ['-C', REPO, 'rev-parse', '--absolute-git-dir'], VALIDATE_CHILD);
    gitDir = result.stdout.trim();
  } catch {
    throw new Error(`${SCRIPT}: --apply requires REPO to be a git repository`);
  }

  let headSha = null;
  try {
    const result = await run('git', ['-C', REPO, 'rev-parse', '--verify', 'HEAD'], VALIDATE_CHILD);
    headSha = result.stdout.trim();
  } catch {
    // An initialized repository may not have a commit yet.
  }

  let status;
  try {
    const result = await run(
      'git',
      ['--no-optional-locks', '-c', 'core.fsmonitor=false', '-C', REPO, 'status', '--porcelain=v1', '-z', '--untracked-files=all'],
      VALIDATE_CHILD,
    );
    status = result.stdout;
  } catch (err) {
    throw new Error(`${SCRIPT}: cannot inspect REPO git status: ${(err && err.message) || err}`);
  }

  return { gitDir, headSha, dirtyPaths: parseDirtyPaths(status) };
}

// Track packet contents so saved baselines are reused only while their trees match.
function packetTreeHash(relativePackets) {
  const hash = crypto.createHash('sha256');
  const visit = (target) => {
    let stat;
    try {
      stat = fs.lstatSync(target);
    } catch (err) {
      if (err && err.code === 'ENOENT') {
        hash.update(`${repoRelative(target)}\0missing\0`);
        return;
      }
      throw err;
    }

    hash.update(`${repoRelative(target)}\0`);
    if (stat.isSymbolicLink()) {
      hash.update(`symlink\0${fs.readlinkSync(target)}\0`);
    } else if (stat.isDirectory()) {
      hash.update('directory\0');
      for (const name of fs.readdirSync(target).sort()) visit(path.join(target, name));
    } else if (stat.isFile()) {
      hash.update(`file:${stat.mode & 0o777}\0`);
      hash.update(fs.readFileSync(target));
    } else {
      hash.update(`other:${stat.mode}\0`);
    }
  };

  for (const relative of [...relativePackets].sort()) {
    const target = resolveRepoPath(relative);
    if (!relative.startsWith('specs/') && !relative.startsWith('.opencode/specs/')) {
      throw new Error(`manifest packet path is outside spec roots: ${relative}`);
    }
    visit(target);
  }
  return hash.digest('hex');
}

function baselineMapFor(packets, manifest = null) {
  const map = {};
  for (const packet of packets) {
    const relative = repoRelative(packet.folder);
    const hasSavedTree = manifest?.scopeHashes
      && Object.prototype.hasOwnProperty.call(manifest.scopeHashes, relative);
    const savedMap = hasSavedTree && [manifest?.recordedBaselineMap, manifest?.baselineMap].find((candidate) =>
      candidate
        && typeof candidate === 'object'
        && !Array.isArray(candidate)
        && Object.prototype.hasOwnProperty.call(candidate, relative),
    );
    if (savedMap) {
      map[relative] = Array.isArray(savedMap[relative]) ? savedMap[relative] : null;
      continue;
    }
    try {
      const body = JSON.parse(fs.readFileSync(path.join(packet.folder, BASELINE_FILE), 'utf8'));
      map[relative] = Array.isArray(body.findings) ? body.findings : null;
    } catch {
      map[relative] = null;
    }
  }
  return map;
}

// Snapshot dirty files inside packets this run will repair, not unrelated worktree files.
function beforeImagesFor(gitState, packets) {
  const images = [];
  for (const relative of gitState.dirtyPaths) {
    const target = resolveRepoPath(relative);
    if (!packets.some((packet) => contained(target, packet.folder))) continue;

    let stat;
    try {
      stat = fs.lstatSync(target);
    } catch (err) {
      if (err && err.code === 'ENOENT') {
        images.push({ path: relative, beforeImage: { kind: 'absent' } });
        continue;
      }
      throw err;
    }

    if (stat.isSymbolicLink()) {
      images.push({ path: relative, beforeImage: { kind: 'symlink-target', target: fs.readlinkSync(target) } });
    } else if (stat.isFile()) {
      images.push({
        path: relative,
        beforeImage: {
          kind: 'file-bytes',
          encoding: 'base64',
          content: fs.readFileSync(target).toString('base64'),
          mode: stat.mode & 0o777,
        },
      });
    }
  }
  return images.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
}

function manifestPathFor(gitState) {
  return path.join(gitState.gitDir, MANIFEST_FILE);
}

// Write manifest updates atomically so readers never see a partial file.
function writeManifestFile(file, manifest, exclusive) {
  const content = `${JSON.stringify(manifest, null, 2)}\n`;
  if (exclusive) {
    let descriptor = null;
    let created = false;
    try {
      descriptor = fs.openSync(file, 'wx', 0o600);
      created = true;
      fs.writeFileSync(descriptor, content, 'utf8');
      fs.fsyncSync(descriptor);
      fs.closeSync(descriptor);
      descriptor = null;
    } catch (err) {
      if (descriptor !== null) {
        try { fs.closeSync(descriptor); } catch { /* The write error is the useful failure. */ }
      }
      if (created) {
        try { fs.unlinkSync(file); } catch { /* A failed create must not leave a partial manifest. */ }
      }
      throw err;
    }
    return;
  }

  const temporary = `${file}.${process.pid}.${crypto.randomBytes(6).toString('hex')}.tmp`;
  try {
    fs.writeFileSync(temporary, content, { encoding: 'utf8', flag: 'wx', mode: 0o600 });
    fs.renameSync(temporary, file);
  } catch (err) {
    try { fs.unlinkSync(temporary); } catch { /* Keep the original write failure. */ }
    throw err;
  }
}

// Reuse saved baselines only while the recorded HEAD and packet trees still match.
function readManifestIfExists(gitState) {
  const file = manifestPathFor(gitState);
  if (!fs.existsSync(file)) return { manifest: null, issue: null };

  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    throw new Error(`cannot read reversibility manifest ${file}: ${(err && err.message) || err}`);
  }
  if (!manifest || manifest.schema !== 1 || typeof manifest.repoRoot !== 'string') {
    throw new Error(`invalid reversibility manifest: ${file}`);
  }
  if (manifest.headSha !== gitState.headSha) {
    return {
      manifest: null,
      issue: {
        kind: 'head-mismatch',
        file,
        recordedHead: manifest.headSha,
        currentHead: gitState.headSha,
      },
    };
  }
  if (manifest.status === 'in-progress') {
    return {
      manifest: null,
      issue: {
        kind: 'in-progress',
        file,
        recordedHead: manifest.headSha,
        currentHead: gitState.headSha,
      },
    };
  }
  const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
  const hasValidBaselineMap = (value) => isObject(value)
    && Object.values(value).every((findings) => findings === null || Array.isArray(findings));
  const hasScopedBaselines = isObject(manifest.scopeHashes)
    && isObject(manifest.baselineMap)
    && isObject(manifest.recordedBaselineMap)
    && Object.keys(manifest.scopeHashes).every((relative) =>
      Object.prototype.hasOwnProperty.call(manifest.baselineMap, relative)
        && Object.prototype.hasOwnProperty.call(manifest.recordedBaselineMap, relative),
    );
  if (
    manifest.status !== 'complete'
    || !isObject(manifest.scopeHashes)
    || !hasValidBaselineMap(manifest.baselineMap)
    || !hasValidBaselineMap(manifest.recordedBaselineMap)
    || !hasScopedBaselines
  ) {
    throw new Error(`reversibility manifest is incomplete: ${file}`);
  }

  for (const [relative, recordedTree] of Object.entries(manifest.scopeHashes)) {
    if (typeof recordedTree !== 'string') {
      throw new Error(`reversibility manifest is incomplete: ${file}`);
    }
    const currentTree = packetTreeHash([relative]);
    if (currentTree !== recordedTree) {
      return {
        manifest: null,
        issue: {
          kind: 'tree-mismatch',
          file,
          recordedHead: manifest.headSha,
          currentHead: gitState.headSha,
          relative,
          recordedTree,
          currentTree,
        },
      };
    }
  }
  return { manifest, issue: null };
}

function reportManifestIssue(issue, apply) {
  const recordedHead = issue.recordedHead || '(none)';
  const currentHead = issue.currentHead || '(none)';
  const action = apply ? '--apply refuses' : 'dry run continues';
  const inProgress = issue.kind === 'in-progress';
  const recovery = inProgress
    ? 'Restore its beforeImages and prior baselines, then remove the manifest before retrying. Remove it deliberately only if recovery is not needed.'
    : 'Restore the worktree from its beforeImages, or remove the manifest deliberately after deciding recovery is not needed.';
  const state = inProgress
    ? 'is in-progress from an interrupted run'
    : 'has a tree mismatch';
  const treeDetail = issue.kind === 'tree-mismatch'
    ? ` for ${issue.relative}: recorded packet hash ${issue.recordedTree}, current packet hash ${issue.currentTree}`
    : '';
  process.stderr.write(
    `${SCRIPT}: reversibility manifest ${issue.file} ${state}${treeDetail}: recorded HEAD ${recordedHead}, current HEAD ${currentHead}; ${action}. ${recovery}\n`,
  );
}

// Write the before-images before any packet repair can change their contents.
function prepareManifest(gitState, packets, failing, file) {
  const scopeHashes = {};
  for (const packet of failing) {
    const relative = repoRelative(packet.folder);
    scopeHashes[relative] = packetTreeHash([relative]);
  }

  const next = {
    schema: 1,
    repoRoot: REPO,
    headSha: gitState.headSha,
    recordedAt: new Date().toISOString(),
    status: 'in-progress',
    baselineMap: baselineMapFor(packets),
    recordedBaselineMap: null,
    scopeHashes,
    beforeImages: beforeImagesFor(gitState, failing),
  };
  writeManifestFile(file, next, !fs.existsSync(file));
  return { file, manifest: next };
}

// Record the baselines produced by the run for later dry-run inspection.
function completeManifest(context, packets) {
  context.manifest.recordedBaselineMap = {
    ...(context.manifest.recordedBaselineMap || {}),
    ...baselineMapFor(packets),
  };
  context.manifest.status = 'complete';
  for (const relative of Object.keys(context.manifest.scopeHashes)) {
    context.manifest.scopeHashes[relative] = packetTreeHash([relative]);
  }
  context.manifest.completedAt = new Date().toISOString();
  writeManifestFile(context.file, context.manifest, false);
}

// Show stored baseline entries and new errors that can be recorded after repair.
function printDowngrades(packets, findingsByFolder) {
  process.stdout.write('\nDowngrades:\n');
  let count = 0;
  const print = (relative, finding) => {
    if (!finding || typeof finding.rule !== 'string') return;
    const detail = typeof finding.detail === 'string' ? finding.detail.replace(/\s+/gu, ' ').trim() : '';
    process.stdout.write(`  ${relative} | ${finding.rule} | error -> warning${detail ? ` | ${detail}` : ''}\n`);
    count += 1;
  };

  for (const packet of packets) {
    const relative = repoRelative(packet.folder);
    for (const finding of findingsByFolder.get(packet.folder) || []) print(relative, finding);
  }
  if (count === 0) process.stdout.write('  none\n');
}

// The per-packet failing lines name each blocking rule but not how many details
// sit behind it, so this pairs every rule with its detail count for the packet
// it blocks. A packet whose report could not be read is named too, so a summary
// built from failures never quietly drops one.
function printGroupedDetail(packets, reports) {
  process.stdout.write('grouped detail:\n');
  let count = 0;
  for (const packet of packets) {
    const relative = repoRelative(packet.folder);
    const report = reports.get(packet.folder);
    if (report === null) {
      count += 1;
      process.stdout.write(`### ${relative} / unreadable\n`);
      continue;
    }
    if (!report || report.passed === true) continue;
    count += 1;
    const byRule = new Map();
    for (const entry of report.entries) {
      if (entry.status !== 'error') continue;
      const details = entry.details.length > 0 ? entry.details : [entry.message];
      byRule.set(entry.rule, [...(byRule.get(entry.rule) || []), ...details]);
    }
    for (const rule of [...byRule.keys()].sort()) {
      const details = byRule.get(rule);
      process.stdout.write(`### ${relative} / x ${rule} (${details.length})\n`);
      for (const detail of details) {
        process.stdout.write(`    - ${detail.replace(/\s+/gu, ' ').trim()}\n`);
      }
    }
  }
  if (count === 0) process.stdout.write('  none\n');
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

async function validate(folder, context = LIVE_RUN_CONTEXT) {
  unreadableWhy.delete(folder);
  try {
    const { stdout } = await run('bash', [context.validate, folder, '--strict', '--json', '--no-recursive'], context.validateOptions);
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

async function validateAll(packets, context = LIVE_RUN_CONTEXT) {
  const reports = new Map();
  let next = 0;
  async function worker() {
    while (next < packets.length) {
      const { folder } = packets[next];
      next += 1;
      reports.set(folder, await validate(folder, context));
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
// for missing keys. A missing value follows the document class's template
// literal before the builder's runtime tables, so a filled document matches
// what scaffolding writes. It runs in a child process under the tsx loader,
// because the builder is TypeScript and this command is plain Node, so it is
// written to be serialized: everything it uses arrives as a parameter.
function fillMissingFrontmatter({ fs, path, lib }, templatesRoot, folders) {
  const canonical = (key) => key.toLowerCase().replace(/_/gu, '');
  const managed = new Set(['title', 'description', 'triggerphrases', 'importancetier', 'contexttype']);
  let failed = 0;
  for (const folder of folders) {
    for (const name of fs.readdirSync(folder)) {
      // The template map also names the addon documents the spec-doc set never
      // held, so their missing keys are filled from their own template defaults.
      const eligible = lib.SPEC_DOC_BASENAMES.has(name.toLowerCase())
        || lib.TEMPLATE_DOC_FILES.has(name.toLowerCase());
      if (!eligible) continue;
      const file = path.join(folder, name);
      try {
        if (!fs.statSync(file).isFile()) continue;
        const original = fs.readFileSync(file, 'utf8');
        const built = lib.buildFrontmatterContent(original, { templatesRoot, templateLiteralDefaults: true }, file);
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

// Use the context path so preview workspaces load the healer copied with their files.
const requireFromScript = createRequire(import.meta.url);

function healerFor(context) {
  return requireFromScript(context.heal);
}

// Runs the repair tools over the packets that failed the first validation, in
// an order that keeps each step's output valid input for the next: document
// edits first, derivation last. Only these targets are touched, so a packet
// that already passes is never rewritten.
async function repairPackets(targets, context = LIVE_RUN_CONTEXT, refusalsByFolder = new Map()) {
  const failures = [];
  const silent = context.silent === true;

  for (const batch of batches(targets)) {
    const why = await runStep(
      'fill-frontmatter',
      ['--input-type=module', '-e', FILL_SCRIPT, context.templatesRoot, context.frontmatterLib, ...batch],
      context.stepOptions,
      silent,
      !silent,
    );
    if (why !== null) failures.push(why);
  }

  // Duplicate anchors and a nested questions opener are structural damage the
  // healer cannot judge: it reads each anchor line as evidence, so the anchor
  // set is repaired and final before the healer inspects it.
  let anchorChanged = 0;
  let anchorFailed = 0;
  for (const target of targets) {
    const relative = repoRelative(target);
    try {
      const spec = path.join(target, 'spec.md');
      if (!fs.existsSync(spec)) continue;
      const result = healerFor(context).repairAnchorFile(spec, { apply: true });
      if (result.changed) anchorChanged += 1;
      if (silent) continue;
      for (const action of result.actions) process.stdout.write(`repaired ${repoRelative(spec)}: ${action}\n`);
      for (const refusal of result.refusals) process.stdout.write(`left unchanged ${repoRelative(spec)}: ${refusal}\n`);
    } catch (err) {
      anchorFailed += 1;
      failures.push(`${relative}: anchor-repair ${(err && err.message) || err}`);
    }
  }
  if (!silent && targets.length > 0) {
    process.stdout.write(anchorFailed === 0
      ? `step anchor-repair: ok (${targets.length} packets, ${anchorChanged} changed)\n`
      : `step anchor-repair: FAILED ${anchorFailed} of ${targets.length} packets\n`);
  }

  let next = 0;
  let failed = 0;
  async function worker() {
    while (next < targets.length) {
      const target = targets[next];
      next += 1;
      const why = await runStep(
        `heal-spec-docs ${path.relative(context.repoRoot, target)}`,
        [context.heal, '--apply', '--folder', target],
        context.stepOptions,
        true,
      );
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

  // Lane modes are document edits too, so they run after the healer and before
  // any derivation reads what the documents say. A refusal is a defect a mode
  // cannot derive the fix for; it is kept for the baseline the caller records.
  let laneRefused = 0;
  let laneFailed = 0;
  for (const target of targets) {
    try {
      const result = healerFor(context).runLaneModes(target, { apply: true, repoRoot: context.repoRoot });
      refusalsByFolder.set(target, result.refusals);
      laneRefused += result.refusals.length;
    } catch (err) {
      laneFailed += 1;
      failures.push(`${repoRelative(target)}: lane modes: ${(err && err.message) || err}`);
    }
  }
  if (!silent) {
    process.stdout.write(laneFailed === 0
      ? `step lane-modes: ok (${targets.length} packets, ${laneRefused} refusals)\n`
      : `step lane-modes: FAILED ${laneFailed} of ${targets.length} packets\n`);
  }

  for (const batch of batches(targets)) {
    const why = await runStep(
      'repair-derived',
      [context.repair, '--apply', ...batch.flatMap((folder) => ['--folder', folder])],
      context.stepOptions,
      silent,
    );
    if (why !== null) failures.push(why);
  }

  for (const batch of batches(targets)) {
    const why = await runStep(
      'migrate-generated-json',
      [context.migrate, ...batch.flatMap((folder) => ['--only', folder])],
      context.stepOptions,
      silent,
    );
    if (why !== null) failures.push(why);
  }

  return failures;
}

// An archived packet records where it lives now, like any other, so its derived
// fields are repaired. Frontmatter filling and healing are skipped because they
// would rewrite a finished record. The questions anchor opener is a marker line
// rather than prose, so moving it above its heading is allowed and keeps the
// record intact while its anchors stay valid once nesting is an error.
async function repairArchived(targets, context = LIVE_RUN_CONTEXT) {
  const failures = [];
  const silent = context.silent === true;

  let anchorChanged = 0;
  let anchorFailed = 0;
  for (const target of targets) {
    const relative = repoRelative(target);
    try {
      const spec = path.join(target, 'spec.md');
      if (!fs.existsSync(spec)) continue;
      const result = healerFor(context).unnestQuestionsAnchors(fs.readFileSync(spec, 'utf8'));
      if (result.changed) {
        healerFor(context).writeFileAtomic(spec, result.text);
        anchorChanged += 1;
      }
      if (silent) continue;
      for (const action of result.actions) process.stdout.write(`repaired ${repoRelative(spec)}: ${action}\n`);
      for (const refusal of result.refusals) process.stdout.write(`left unchanged ${repoRelative(spec)}: ${refusal}\n`);
    } catch (err) {
      anchorFailed += 1;
      failures.push(`${relative}: anchor-unnest ${(err && err.message) || err}`);
    }
  }
  if (!silent && targets.length > 0) {
    process.stdout.write(anchorFailed === 0
      ? `step anchor-unnest (archived): ok (${targets.length} packets, ${anchorChanged} changed)\n`
      : `step anchor-unnest (archived): FAILED ${anchorFailed} of ${targets.length} packets\n`);
  }

  for (const batch of batches(targets)) {
    const why = await runStep(
      'repair-derived (archived)',
      [context.repair, '--apply', ...batch.flatMap((folder) => ['--folder', folder])],
      context.stepOptions,
      silent,
    );
    if (why !== null) failures.push(why);
  }
  return failures;
}

// The dry run has no repaired copy to read, so each packet's anchor repair is
// predicted against the live documents. An archived packet predicts only the
// questions-anchor un-nesting, the one document edit it would receive. It reads
// only; --apply is what writes.
function previewAnchorRepairs(packets, reports) {
  const { repairAnchors, unnestQuestionsAnchors } = healerFor(LIVE_RUN_CONTEXT);
  for (const packet of packets) {
    const report = reports.get(packet.folder);
    if (!report || report.passed === true) continue;
    const spec = path.join(packet.folder, 'spec.md');
    if (!fs.existsSync(spec)) continue;
    const repair = packet.archived ? unnestQuestionsAnchors : repairAnchors;
    const result = repair(fs.readFileSync(spec, 'utf8'));
    for (const action of result.actions) process.stdout.write(`would repair ${repoRelative(spec)}: ${action}\n`);
    for (const refusal of result.refusals) process.stdout.write(`would leave unchanged ${repoRelative(spec)}: ${refusal}\n`);
  }
}

function copyPreviewAncestorFiles(folder, previewRoot) {
  let ancestor = path.dirname(folder);
  while (ancestor !== REPO) {
    const relative = repoRelative(ancestor);
    if (!relative.startsWith('specs/') && !relative.startsWith('.opencode/specs/')) break;
    const targetDirectory = path.join(previewRoot, ...relative.split('/'));
    fs.mkdirSync(targetDirectory, { recursive: true });
    for (const entry of fs.readdirSync(ancestor, { withFileTypes: true })) {
      if (!entry.isFile() && !entry.isSymbolicLink()) continue;
      fs.cpSync(path.join(ancestor, entry.name), path.join(targetDirectory, entry.name), {
        recursive: true,
        dereference: true,
      });
    }
    ancestor = path.dirname(ancestor);
  }
}

// cpSync's dereference option does not reach symlinks nested inside a
// recursive copy, so a linked document would reach the preview as a link and
// the preview's repair steps would write through it into the real tree.
// Replace every link under the copied spec roots with a copy of its target.
function materializeSymlinks(directory) {
  if (!fs.existsSync(directory)) return;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) {
      const resolved = fs.realpathSync(target);
      fs.unlinkSync(target);
      fs.cpSync(resolved, target, { recursive: true, dereference: true });
      if (fs.statSync(target).isDirectory()) materializeSymlinks(target);
    } else if (entry.isDirectory()) {
      materializeSymlinks(target);
    }
  }
}

async function createPreviewWorkspace(packets) {
  const previewRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'upgrade-legacy-preview-'));
  try {
    const skillRoot = path.join(previewRoot, '.skilled/skills/system-spec-kit');
    fs.mkdirSync(path.dirname(skillRoot), { recursive: true });
    fs.cpSync(SKILL_ROOT, skillRoot, {
      recursive: true,
      filter: (source) => path.basename(source) !== 'node_modules',
    });

    for (const relative of ['node_modules', 'runtime/node_modules', 'runtime/cli/node_modules']) {
      const source = path.join(SKILL_ROOT, relative);
      const target = path.join(skillRoot, relative);
      if (!fs.existsSync(source)) continue;
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.symlinkSync(source, target, 'dir');
    }
    const runtimeModules = path.join(skillRoot, 'runtime/node_modules');
    if (!fs.existsSync(runtimeModules)) fs.mkdirSync(runtimeModules, { recursive: true });

    const now = new Date();
    const touchDist = (directory) => {
      for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        const target = path.join(directory, entry.name);
        if (entry.isDirectory()) touchDist(target);
        else if (entry.isFile() && target.includes(`${path.sep}dist${path.sep}`)) {
          fs.utimesSync(target, now, now);
        }
      }
    };
    touchDist(path.join(skillRoot, 'runtime'));

    const previewPackets = packets.map((packet) => {
      const relative = repoRelative(packet.folder);
      if (!relative.startsWith('specs/') && !relative.startsWith('.opencode/specs/')) {
        throw new Error(`cannot preview a packet outside the spec roots: ${relative}`);
      }
      copyPreviewAncestorFiles(packet.folder, previewRoot);
      const folder = path.resolve(previewRoot, ...relative.split('/'));
      if (!contained(folder, previewRoot)) throw new Error(`packet path escapes preview root: ${relative}`);
      fs.mkdirSync(path.dirname(folder), { recursive: true });
      fs.cpSync(packet.folder, folder, { recursive: true, dereference: true });
      return { ...packet, folder, root: path.join(previewRoot, repoRelative(packet.root)) };
    });
    for (const specRoot of ['specs', '.opencode/specs']) materializeSymlinks(path.join(previewRoot, specRoot));

    await run('git', ['init', '-q'], { cwd: previewRoot, encoding: 'utf8' });
    const context = createRunContext(previewRoot, skillRoot);
    context.silent = true;
    return { previewRoot, packets: previewPackets, context };
  } catch (err) {
    fs.rmSync(previewRoot, { recursive: true, force: true });
    throw err;
  }
}

async function predictDowngradeFindings(packets, reports, manifestIssue, manifest) {
  const findingsByFolder = new Map();
  const baselines = baselineMapFor(packets, manifest);
  for (const packet of packets) {
    const baseline = baselines[repoRelative(packet.folder)];
    findingsByFolder.set(packet.folder, Array.isArray(baseline) ? baseline : []);
  }

  if (
    manifestIssue
    || manifest !== null
    || packets.some((packet) => reports.get(packet.folder) === null)
  ) return findingsByFolder;
  const failing = packets.filter((packet) => reports.get(packet.folder)?.passed !== true);
  if (failing.length === 0) return findingsByFolder;

  const preview = await createPreviewWorkspace(failing);
  try {
    const active = preview.packets.filter((packet) => !packet.archived).map((packet) => packet.folder);
    const archived = preview.packets.filter((packet) => packet.archived).map((packet) => packet.folder);
    await repairPackets(active, preview.context);
    await repairArchived(archived, preview.context);
    const after = await validateAll(preview.packets, preview.context);

    for (let index = 0; index < failing.length; index += 1) {
      const original = failing[index];
      const report = after.get(preview.packets[index].folder);
      if (report === null) {
        throw new Error(`preview could not validate ${repoRelative(original.folder)}: ${unreadableWhy.get(preview.packets[index].folder)}`);
      }
      if (report.passed === true) continue;
      const findings = findingsOf(report, original.archived);
      if (findings.length > 0) findingsByFolder.set(original.folder, findings);
    }
  } finally {
    fs.rmSync(preview.previewRoot, { recursive: true, force: true });
  }
  return findingsByFolder;
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

// Refusals are written in the healer's own mode order, then by document and
// reason, so the same run over the same tree writes the same array and the
// unchanged check can compare equal.
function sortRefusals(refusals) {
  const order = new Map(healerFor(LIVE_RUN_CONTEXT).LANE_MODES.map((mode, index) => [mode.name, index]));
  const rank = (refusal) => order.get(refusal.mode);
  return [...refusals].sort((a, b) =>
    rank(a) - rank(b)
    || (a.document < b.document ? -1 : a.document > b.document ? 1 : 0)
    || (a.reason < b.reason ? -1 : a.reason > b.reason ? 1 : 0));
}

// The validator reads the baseline from beside the packet's documents. A file
// whose real parent resolves outside the roots would write into some other
// tree, so that is refused loudly instead of recorded.
function recordFindings(folder, findings, roots, refusals = []) {
  const file = path.join(folder, BASELINE_FILE);
  const parent = fs.realpathSync(path.dirname(file));
  if (!roots.some((root) => contained(parent, root))) {
    throw new Error(`${SCRIPT}: refusing to record outside the roots: ${file}`);
  }
  const sortedRefusals = refusals.length > 0 ? sortRefusals(refusals) : [];
  try {
    const existing = JSON.parse(fs.readFileSync(file, 'utf8'));
    const storedRefusals = Array.isArray(existing.refusals) ? existing.refusals : [];
    if (
      JSON.stringify(existing.findings) === JSON.stringify(findings)
      && JSON.stringify(storedRefusals) === JSON.stringify(sortedRefusals)
    ) return 'unchanged';
  } catch {
    // A missing or malformed baseline simply gets rewritten below.
  }
  // A refusal records a repair that was not attempted, so it is written beside
  // the findings and never inside them: the validator relaxes every findings
  // entry, and a repair nobody attempted is not a finding to relax.
  const body = { schema: 1, recordedBy: 'upgrade-legacy', recordedAt: new Date().toISOString(), findings };
  if (sortedRefusals.length > 0) body.refusals = sortedRefusals;
  const tmp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, `${JSON.stringify(body, null, 2)}\n`);
  fs.renameSync(tmp, file);
  return 'written';
}

// ───────────────────────────────────────────────────────────────────
// 8. LAYOUT MAP
// ───────────────────────────────────────────────────────────────────

// A pre-v4 checkout keeps packets in .opencode/specs and tracks specs as a
// symlink to it; a v4 checkout keeps them in specs and may keep the old path
// working as a link back. The map is recomputed from disk on every call
// because an interrupted move can leave either root in any state, and only
// what is on disk now says which steps are still owed. Symlinks are compared
// by realpath: the two roots point at each other once the layout is complete,
// and the resolved target decides that, not the spelling of the link.

const LEGACY_SPECS = '.opencode/specs';
const CURRENT_SPECS = 'specs';

function isAliasOf(side, real) {
  return side.kind === 'symlink' && side.real !== null && side.real === real;
}

// lstat only, so a symlink stays a link rather than becoming its target; a
// broken link resolves to nothing and can never alias the other root.
function layoutRoot(target) {
  let stat;
  try {
    stat = fs.lstatSync(target);
  } catch (err) {
    if (err && err.code === 'ENOENT') return { kind: 'absent', real: null };
    throw err;
  }
  if (stat.isSymbolicLink()) {
    let real = null;
    try {
      real = fs.realpathSync(target);
    } catch {
      // Nothing to compare, so the link cannot match the expected alias.
    }
    return { kind: 'symlink', real };
  }
  if (stat.isDirectory()) return { kind: 'directory', real: null };
  if (stat.isFile()) return { kind: 'file', real: null };
  return { kind: 'other', real: null };
}

function entryKind(target) {
  const stat = fs.lstatSync(target);
  if (stat.isSymbolicLink()) return 'symlink';
  if (stat.isDirectory()) return 'directory';
  if (stat.isFile()) return 'file';
  return 'other';
}

function compareLayoutTrees(legacyDir, currentDir, legacyRel, currentRel, found) {
  const read = (dir) => fs.readdirSync(dir)
    .filter((name) => name !== '.DS_Store')
    .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  const legacyNames = read(legacyDir);
  const currentNames = read(currentDir);
  const legacyExact = new Set(legacyNames);
  const currentExact = new Set(currentNames);
  // The first name in sorted order answers a folded match, so two case
  // variants in one directory still give the same map on every run.
  const currentFolded = new Map();
  for (const name of currentNames) {
    const folded = name.toLowerCase();
    if (!currentFolded.has(folded)) currentFolded.set(folded, name);
  }
  const legacyFolded = new Set(legacyNames.map((name) => name.toLowerCase()));

  for (const name of legacyNames) {
    const from = `${legacyRel}/${name}`;
    if (currentExact.has(name)) {
      const to = `${currentRel}/${name}`;
      const legacyKind = entryKind(path.join(legacyDir, name));
      const currentKind = entryKind(path.join(currentDir, name));
      if (legacyKind === 'directory' && currentKind === 'directory') {
        compareLayoutTrees(path.join(legacyDir, name), path.join(currentDir, name), from, to, found);
      } else if ((legacyKind === 'file' || legacyKind === 'symlink') && legacyKind === currentKind) {
        found.collisions.push({ from, to, reason: 'exists-in-both' });
      } else {
        found.collisions.push({ from, to, reason: 'type-mismatch' });
      }
      continue;
    }
    const foldedMatch = currentFolded.get(name.toLowerCase());
    if (foldedMatch !== undefined) {
      found.collisions.push({ from, to: `${currentRel}/${foldedMatch}`, reason: 'case-only-difference' });
      continue;
    }
    found.moves.push({ from, to: `${currentRel}/${name}` });
  }

  for (const name of currentNames) {
    if (legacyExact.has(name)) continue;
    if (legacyFolded.has(name.toLowerCase())) continue;
    found.alreadyMoved.push(`${currentRel}/${name}`);
  }
}

// A partial tree holds packets on both sides, so the steps move the legacy-only
// entries across, delete finder metadata and the then-empty legacy directories,
// and put the old path back as a link. rmdir is the loud one on purpose: it
// fails if the comparison missed a real entry, so nothing is silently dropped.
function partialLayoutMove(legacyPath, currentPath) {
  const found = { moves: [], alreadyMoved: [], collisions: [] };
  compareLayoutTrees(legacyPath, currentPath, LEGACY_SPECS, CURRENT_SPECS, found);
  found.moves.sort((a, b) => (a.from < b.from ? -1 : a.from > b.from ? 1 : 0));
  found.alreadyMoved.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  found.collisions.sort((a, b) => (
    a.from < b.from ? -1 : a.from > b.from ? 1
      : a.to < b.to ? -1 : a.to > b.to ? 1
        : a.reason < b.reason ? -1 : a.reason > b.reason ? 1 : 0
  ));

  const steps = [];
  if (found.collisions.length === 0) {
    found.moves.forEach((move, index) => {
      steps.push({ id: `move-${index + 1}`, argv: ['mv', move.from, move.to] });
    });
    steps.push({ id: 'remove-finder-metadata', argv: ['find', LEGACY_SPECS, '-name', '.DS_Store', '-type', 'f', '-delete'] });
    steps.push({ id: 'remove-empty-legacy-dirs', argv: ['find', LEGACY_SPECS, '-mindepth', '1', '-depth', '-type', 'd', '-empty', '-delete'] });
    steps.push({ id: 'remove-legacy-root', argv: ['rmdir', LEGACY_SPECS] });
    steps.push({ id: 'link-legacy-path', argv: ['ln', '-s', '../specs', LEGACY_SPECS] });
  }
  return { state: 'partial', ...found, steps };
}

function layoutRootCollision(legacy, current) {
  const symlinked = legacy.kind === 'symlink' || current.kind === 'symlink';
  return { from: LEGACY_SPECS, to: CURRENT_SPECS, reason: symlinked ? 'unexpected-symlink' : 'type-mismatch' };
}

/**
 * Plan how the legacy layout should move within the repository.
 *
 * @param {string} repoRoot - Repository root containing the layouts.
 * @returns {{
 *   state: 'none' | 'v3' | 'v4' | 'partial',
 *   moves: Array<{from: string, to: string}>,
 *   alreadyMoved: string[],
 *   collisions: Array<{from: string, to: string, reason: string}>,
 *   steps: Array<{id: string, argv: string[]}>
 * }}
 */
export function planLayoutMove(repoRoot) {
  const legacyPath = path.join(repoRoot, '.opencode', 'specs');
  const currentPath = path.join(repoRoot, 'specs');
  const legacy = layoutRoot(legacyPath);
  const current = layoutRoot(currentPath);
  const nothing = { moves: [], alreadyMoved: [], collisions: [], steps: [] };

  if (legacy.kind === 'absent' && current.kind === 'absent') {
    return { state: 'none', ...nothing };
  }
  if (current.kind === 'directory' && (legacy.kind === 'absent' || isAliasOf(legacy, fs.realpathSync(currentPath)))) {
    return { state: 'v4', ...nothing };
  }
  if (legacy.kind === 'directory' && (current.kind === 'absent' || isAliasOf(current, fs.realpathSync(legacyPath)))) {
    const steps = [];
    if (current.kind === 'symlink') steps.push({ id: 'remove-specs-link', argv: ['rm', '-f', CURRENT_SPECS] });
    steps.push({ id: 'move-tree', argv: ['git', 'mv', LEGACY_SPECS, CURRENT_SPECS] });
    steps.push({ id: 'link-legacy-path', argv: ['ln', '-s', '../specs', LEGACY_SPECS] });
    return { state: 'v3', moves: [{ from: LEGACY_SPECS, to: CURRENT_SPECS }], alreadyMoved: [], collisions: [], steps };
  }
  if (legacy.kind === 'directory' && current.kind === 'directory') {
    return partialLayoutMove(legacyPath, currentPath);
  }
  return { state: 'partial', ...nothing, collisions: [layoutRootCollision(legacy, current)] };
}

// ───────────────────────────────────────────────────────────────────
// 9. MAIN
// ───────────────────────────────────────────────────────────────────
async function main() {
  const { roots: given, includeArchive, apply } = parseArgs(process.argv.slice(2));
  let gitState = null;
  if (apply) {
    try {
      gitState = await readRepositoryState();
    } catch (err) {
      process.stderr.write(`${(err && err.message) || err}\n`);
      process.exitCode = 2;
      return;
    }
  } else {
    try {
      gitState = await readRepositoryState();
    } catch {
      gitState = null;
    }
  }

  const roots = resolveRoots(given);
  const packets = await discover(roots, includeArchive);

  if (packets.length === 0) {
    process.stdout.write(`${SCRIPT}: no spec folders found\n`);
    if (apply) process.stdout.write('plan changes=0\n');
    else process.stdout.write('\nDowngrades:\n  none\n');
    process.exitCode = 0;
    return;
  }

  let manifestIssue = null;
  let manifest = null;
  if (gitState !== null) {
    try {
      const manifestState = readManifestIfExists(gitState);
      manifest = manifestState.manifest;
      manifestIssue = manifestState.issue;
      if (manifestIssue !== null) {
        reportManifestIssue(manifestIssue, apply);
        if (apply) {
          process.exitCode = 2;
          return;
        }
      }
    } catch (err) {
      process.stderr.write(`${SCRIPT}: ${(err && err.message) || err}\n`);
      process.exitCode = 2;
      return;
    }
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
    const failing = packets.filter((packet) => before.get(packet.folder)?.passed !== true);
    process.stdout.write(`plan changes=${failing.length}\n`);
    let manifestContext = null;
    if (gitState.dirtyPaths.length > 0 && failing.length > 0) {
      const file = manifestPathFor(gitState);
      try {
        manifestContext = prepareManifest(gitState, packets, failing, file);
      } catch (err) {
        process.stderr.write(`${SCRIPT}: could not write reversibility manifest at ${file}: ${(err && err.message) || err}; no packet changes were made\n`);
        process.exitCode = 2;
        return;
      }
    }

    // Lane-mode refusals are collected so the run can record them in each
    // packet's baseline beside the findings that survive the repair.
    const laneRefusalsByFolder = new Map();
    const failures = await repairPackets(
      failing.filter((packet) => !packet.archived).map((packet) => packet.folder),
      LIVE_RUN_CONTEXT,
      laneRefusalsByFolder,
    );
    failures.push(...await repairArchived(failing.filter((packet) => packet.archived).map((packet) => packet.folder)));

    const mid = await validateAll(packets);
    const recorded = [];
    for (const packet of packets) {
      // A packet that passed at the start was never repaired, so a failure now
      // is damage from a step rather than an inherited finding. Recording it
      // would hide the damage; it stays an error and is reported below.
      if (before.get(packet.folder).passed === true) continue;
      const report = mid.get(packet.folder);
      if (report === null) continue;
      // A report that passes mid-run may still owe its pass to findings the
      // previous baseline recorded, so those entries are carried over rather
      // than dropped: findingsOf lists the fresh errors plus everything already
      // recorded, and a baseline that stopped naming a recorded finding would
      // flip it back to an error on the next run.
      const findings = findingsOf(report, packet.archived);
      const refusals = laneRefusalsByFolder.get(packet.folder) || [];
      if (findings.length === 0 && refusals.length === 0) continue;
      let outcome;
      try {
        outcome = recordFindings(packet.folder, findings, roots, refusals);
      } catch (err) {
        failures.push((err && err.message) || String(err));
        continue;
      }
      if (outcome === 'written') {
        recorded.push(packet);
        const refusalNote = refusals.length > 0 ? `, ${refusals.length} refusals` : '';
        process.stdout.write(`recorded ${path.relative(REPO, packet.folder)} (${findings.length} findings${refusalNote})\n`);
      }
    }

    const after = new Map(mid);
    for (const [folder, report] of await validateAll(recorded)) after.set(folder, report);

    if (manifestContext !== null) {
      try {
        completeManifest(manifestContext, packets);
      } catch (err) {
        failures.push(`${SCRIPT}: could not finalize reversibility manifest at ${manifestContext.file}: ${(err && err.message) || err}`);
      }
    }

    const savedBaselines = baselineMapFor(packets, manifestContext?.manifest ?? manifest);
    const findingsByFolder = new Map(packets.map((packet) => [
      packet.folder,
      Array.isArray(savedBaselines[repoRelative(packet.folder)])
        ? savedBaselines[repoRelative(packet.folder)]
        : [],
    ]));
    printDowngrades(packets, findingsByFolder);

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

    printGroupedDetail(packets, after);

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

  previewAnchorRepairs(packets, before);

  printGroupedDetail(packets, before);

  let findingsByFolder;
  try {
    findingsByFolder = await predictDowngradeFindings(packets, before, manifestIssue, manifest);
  } catch (err) {
    process.stderr.write(`${SCRIPT}: could not predict Downgrades: ${(err && err.message) || err}\n`);
    process.exitCode = 2;
    return;
  }
  printDowngrades(packets, findingsByFolder);

  const active = packets.filter((packet) => !packet.archived).length;
  process.stdout.write(`\ninspected=${packets.length} active=${active} archived=${packets.length - active}\n`);
  const passing = packets.filter((packet) => {
    const report = before.get(packet.folder);
    return report !== null && report.passed === true;
  }).length;
  process.stdout.write(`passing=${passing}/${packets.length}\n`);

  const eraReport = buildReport(classifyRepo(REPO));
  const { layout, frontmatter } = eraReport.signals;
  process.stdout.write('repo era report:\n');
  process.stdout.write(
    '  layout provenance: source='
      + (layout.provenance.source ?? 'none')
      + '; description.json residue count='
      + layout.provenance.residueCount
      + '\n',
  );
  process.stdout.write(`  layout: ${layout.kind} (v3=${layout.v3}, v4=${layout.v4})\n`);
  process.stdout.write(`  frontmatter: present=${frontmatter.present} missing=${frontmatter.missing}\n`);

  process.stdout.write('\n--apply would run: fill-frontmatter, anchor-repair, heal-spec-docs, lane-modes, repair-derived, migrate-generated-json (archived packets: questions-anchor un-nesting and repair-derived only), then record the remaining findings in upgrade-baseline.json\n');
  process.exitCode = bad > 0 ? 1 : 0;
}

// Node resolves the executed path through symlinks, so both sides are compared
// by realpath: invoking the script through a linked path still starts the CLI,
// while importing the module stays quiet. A missing argv[1] is not a direct run.
function directRun() {
  try {
    return fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url));
  } catch {
    return false;
  }
}

if (directRun()) {
  if (process.argv.length === 3 && process.argv[2] === '--layout-map') {
    try {
      const layout = planLayoutMove(REPO);
      process.stdout.write(`${JSON.stringify(layout, null, 2)}\n`);
      process.exitCode = layout.collisions.length > 0 ? 1 : 0;
    } catch (err) {
      process.stderr.write(`${SCRIPT}: layout map failed: ${(err && err.message) || err}\n`);
      process.exitCode = 2;
    }
  } else {
    main().catch((err) => {
      process.stderr.write(`${SCRIPT} failed: ${(err && err.stack) || err}\n`);
      process.exit(2);
    });
  }
}
