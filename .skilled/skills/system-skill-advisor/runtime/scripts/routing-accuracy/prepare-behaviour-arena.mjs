// ───────────────────────────────────────────────────────────────
// MODULE: Behaviour Arena Builder
// ───────────────────────────────────────────────────────────────
//
// A live turn has to run where it cannot reach anything outside its own
// checkout, and where the advisor it measures is built the way a user gets it.
// A clone of the branch tip in a directory git does not own gives both. The
// clone has no remote to push to and no outer repository whose hooks or
// credentials it could borrow, and its tracked tree is exactly the commit under
// test, so a per-turn restore has a clean baseline to put back.
//
// A clone also leaves out every ignored build output. The advisor under test
// runs from compiled JavaScript and its SQLite skill graph, so those trees are
// copied in afterwards. Building them inside the clone instead would measure a
// bundle nobody reviewed, and would need the network while an arena is meant to
// be offline.
//
// A copy also has to look like a build. The freshness guard each CLI shim runs
// falls back to comparing the newest watched source against the build's own
// timestamp, and a checkout stamps every source with the clone time while the
// copied build keeps the moment it was compiled. Left alone, that order says
// every copied package is stale and every shim exits before running. The copied
// build is the same commit's build, so its timestamp is set to the copy time,
// which is what a build in this checkout would carry.
//
// Nothing is copied before the destination is checked. A destination inside a
// repository would inherit that repository's hooks and ignore rules, and a
// destination that already exists may hold another arm's log, so both are
// refused rather than merged into.
//
// The copy reads the source worktree, so the one thing it must never carry
// across is a dotenv file. A model reads and writes an arena, so a secret that
// followed the build output in would sit where a run can print it. Every file
// whose name begins with `.env` is skipped while copying, at every depth.
//
// Usage:
//   node prepare-behaviour-arena.mjs --source <repo root> --dest <dir>

// ───────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────

import { existsSync, lstatSync, lutimesSync, mkdirSync, readdirSync, rmSync, utimesSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// ───────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────

const SCRIPT_NAME = basename(fileURLToPath(import.meta.url));
const EXIT_REFUSED = 2;

const USAGE = `usage: node ${SCRIPT_NAME} --source <repo root> --dest <dir>`;

// A filesystem monitor that decides a path is unchanged makes the clone and the
// clean-tree check disagree about what the checkout holds.
const GIT_PREFIX = ['-c', 'core.fsmonitor=false'];

// The two ignored trees a build writes and a clone never carries.
const BUILD_DIR_NAMES = new Set(['dist', 'node_modules']);

const SQLITE_SUFFIX = '.sqlite';
const SKILLED_PREFIX = '.skilled/';
const DOTENV_PATTERN = /^\.env/;

// ───────────────────────────────────────────────────────────────
// 3. FAILURE SHAPES
// ───────────────────────────────────────────────────────────────

// A refusal is a precondition the caller can act on, so it carries a code on
// stdout. A step failure leaves no usable arena behind, so it reports the code
// and the failing command on stderr instead.
class StepFailure extends Error {
  constructor(code, detail) {
    super(detail === '' ? code : `${code}: ${detail}`);
    this.code = code;
  }
}

function writeJson(value) {
  process.stdout.write(`${JSON.stringify(value)}\n`);
}

function refuse(code, extra = {}) {
  writeJson({ ok: false, code, ...extra });
  process.exit(EXIT_REFUSED);
}

function abort(code, detail = '') {
  process.stderr.write(`${SCRIPT_NAME}: ${detail === '' ? code : `${code}: ${detail}`}\n`);
  writeJson({ ok: false, code });
  process.exit(1);
}

// ───────────────────────────────────────────────────────────────
// 4. ARGUMENT PARSING
// ───────────────────────────────────────────────────────────────

function valueAfter(argv, index, flag) {
  const value = argv[index];
  if (value === undefined || value.startsWith('--')) {
    process.stderr.write(`${SCRIPT_NAME}: ${flag} needs a value\n${USAGE}\n`);
    process.exit(EXIT_REFUSED);
  }
  return value;
}

function parseOptions(argv) {
  const options = { source: null, dest: null };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--source') {
      index += 1;
      options.source = valueAfter(argv, index, '--source');
    } else if (token === '--dest') {
      index += 1;
      options.dest = valueAfter(argv, index, '--dest');
    } else {
      process.stderr.write(`${SCRIPT_NAME}: unknown option: ${token}\n${USAGE}\n`);
      process.exit(EXIT_REFUSED);
    }
  }
  if (options.source === null || options.dest === null) {
    process.stderr.write(`${SCRIPT_NAME}: --source and --dest are required\n${USAGE}\n`);
    process.exit(EXIT_REFUSED);
  }
  return options;
}

// ───────────────────────────────────────────────────────────────
// 5. GIT HELPERS
// ───────────────────────────────────────────────────────────────

function git(args, cwd) {
  const result = spawnSync('git', [...GIT_PREFIX, ...args], { cwd, encoding: 'utf8' });
  if (result.error) throw new StepFailure('spawn_failed', result.error.message);
  return result;
}

function gitText(args, cwd, code) {
  const result = git(args, cwd);
  if (result.status !== 0) throw new StepFailure(code, (result.stderr ?? '').trim());
  return result.stdout;
}

function headOf(cwd, code) {
  const head = gitText(['rev-parse', 'HEAD'], cwd, code).trim();
  if (head === '') throw new StepFailure(code, `no HEAD in ${cwd}`);
  return head;
}

// Whether git would leave a path out of a checkout decides whether a clone
// already holds it, so ignore rules are asked rather than guessed from a name.
function isIgnored(cwd, relPath) {
  return git(['check-ignore', '-q', '--', relPath], cwd).status === 0;
}

// ───────────────────────────────────────────────────────────────
// 6. DESTINATION CHECKS
// ───────────────────────────────────────────────────────────────

function pathExists(path) {
  try {
    lstatSync(path);
    return true;
  } catch {
    return false;
  }
}

function nearestExistingAncestor(path) {
  let current = path;
  while (!existsSync(current) && dirname(current) !== current) current = dirname(current);
  return current;
}

function isInsideRepository(path) {
  return git(['rev-parse', '--show-toplevel'], path).status === 0;
}

// ───────────────────────────────────────────────────────────────
// 7. COPY PLAN
// ───────────────────────────────────────────────────────────────

// One walk of the source decides what a clone is missing. A build directory is
// recorded and not descended into, so anything inside it travels with the tree.
// The SQLite files searched for sit under the tooling root only, because that is
// where the advisor keeps its graph.
function copyPlan(source) {
  const trees = [];
  const sqlite = [];
  const walk = (relPath) => {
    const absPath = relPath === '' ? source : join(source, relPath);
    for (const entry of readdirSync(absPath, { withFileTypes: true })) {
      if (entry.name === '.git') continue;
      const childRel = relPath === '' ? entry.name : `${relPath}/${entry.name}`;
      if (entry.isDirectory()) {
        if (BUILD_DIR_NAMES.has(entry.name)) {
          trees.push(childRel);
          continue;
        }
        walk(childRel);
        continue;
      }
      if (entry.isFile() && entry.name.endsWith(SQLITE_SUFFIX) && childRel.startsWith(SKILLED_PREFIX)) {
        sqlite.push(childRel);
      }
    }
  };
  walk('');
  return [...trees, ...sqlite].filter((relPath) => isIgnored(source, relPath)).sort();
}

function holdsDotenv(dirPath) {
  for (const entry of readdirSync(dirPath, { withFileTypes: true })) {
    if (DOTENV_PATTERN.test(entry.name)) return true;
    if (entry.isDirectory() && holdsDotenv(join(dirPath, entry.name))) return true;
  }
  return false;
}

function runCp(sourcePath, destParent) {
  const result = spawnSync('cp', ['-Rc', sourcePath, destParent], { encoding: 'utf8' });
  if (result.error) throw new StepFailure('copy_failed', `${sourcePath}: ${result.error.message}`);
  if (result.status !== 0) throw new StepFailure('copy_failed', `${sourcePath}: ${(result.stderr ?? '').trim()}`);
}

// A symlink is stamped through the link itself, because its target may live
// outside the arena and is not this copy's to change.
function stampPath(path, time) {
  if (lstatSync(path).isSymbolicLink()) {
    lutimesSync(path, time, time);
    return;
  }
  utimesSync(path, time, time);
}

// Only a build tree is stamped. The guard reads the timestamp of a dist entry,
// and neither a dependency tree nor a database file is watched.
function stampBuildTree(path) {
  const time = new Date();
  for (const entry of readdirSync(path, { withFileTypes: true })) {
    const child = join(path, entry.name);
    if (entry.isDirectory()) stampBuildTree(child);
    else stampPath(child, time);
  }
  stampPath(path, time);
}

// The clonefile flag keeps the copy cheap on the same volume, and the walk only
// happens where a dotenv file is actually present, so the common tree is one
// `cp` call rather than one call per file.
function copyPath(sourcePath, destPath) {
  const isDirectory = lstatSync(sourcePath).isDirectory();
  if (!isDirectory || !holdsDotenv(sourcePath)) {
    mkdirSync(dirname(destPath), { recursive: true });
    runCp(sourcePath, dirname(destPath));
    return;
  }
  mkdirSync(destPath, { recursive: true });
  for (const entry of readdirSync(sourcePath, { withFileTypes: true })) {
    if (DOTENV_PATTERN.test(entry.name)) continue;
    copyPath(join(sourcePath, entry.name), join(destPath, entry.name));
  }
}

// ───────────────────────────────────────────────────────────────
// 8. ARENA BUILD
// ───────────────────────────────────────────────────────────────

function cloneInto(source, dest) {
  const result = git(['clone', '--no-hardlinks', source, dest], process.cwd());
  if (result.status !== 0) throw new StepFailure('clone_failed', (result.stderr ?? '').trim());
}

function checkoutDetached(dest, head) {
  const result = git(['checkout', '--quiet', '--detach', head], dest);
  if (result.status !== 0) throw new StepFailure('checkout_failed', (result.stderr ?? '').trim());
}

// A remote is the one piece of git state a turn could use to reach outside the
// checkout, so every one the clone inherits is removed rather than left dormant.
function removeRemotes(dest) {
  const names = gitText(['remote'], dest, 'remote_unreadable')
    .split('\n')
    .map((name) => name.trim())
    .filter((name) => name !== '');
  for (const name of names) gitText(['remote', 'remove', name], dest, 'remote_unreadable');
}

function assertHead(dest, head) {
  const cloned = gitText(['rev-parse', 'HEAD'], dest, 'head_unreadable').trim();
  if (cloned !== head) throw new StepFailure('head_mismatch', `expected ${head}, got ${cloned}`);
}

function buildArena(source, dest, head) {
  cloneInto(source, dest);
  checkoutDetached(dest, head);
  removeRemotes(dest);
  const copied = copyPlan(source);
  for (const relPath of copied) {
    const destPath = join(dest, relPath);
    copyPath(join(source, relPath), destPath);
    if (basename(relPath) === 'dist') stampBuildTree(destPath);
  }
  assertHead(dest, head);
  return copied;
}

// ───────────────────────────────────────────────────────────────
// 9. ENTRY POINT
// ───────────────────────────────────────────────────────────────

function main(argv) {
  const options = parseOptions(argv);
  const source = resolve(options.source);
  const dest = resolve(options.dest);
  const head = headOf(source, 'source_not_repo');

  if (pathExists(dest)) refuse('dest_exists', { dest });
  if (isInsideRepository(nearestExistingAncestor(dirname(dest)))) refuse('dest_in_repo', { dest });

  mkdirSync(dirname(dest), { recursive: true });
  try {
    const copied = buildArena(source, dest, head);
    writeJson({ ok: true, dest, head, copied });
  } catch (error) {
    // A half-built arena would answer the next call with `dest_exists` while
    // holding a checkout nobody finished, so the failed attempt removes itself.
    rmSync(dest, { recursive: true, force: true });
    abort(error.code ?? 'arena_failed', error.message);
  }
}

main(process.argv.slice(2));
