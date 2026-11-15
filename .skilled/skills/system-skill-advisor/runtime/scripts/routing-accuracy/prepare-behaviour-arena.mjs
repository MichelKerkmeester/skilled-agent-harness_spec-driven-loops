// ───────────────────────────────────────────────────────────────
// MODULE: Behaviour Arena Builder
// ───────────────────────────────────────────────────────────────
//
// A live turn has to run where the advisor it measures is built the way a user
// gets it. A clone of the branch tip in a directory git does not own gives that
// and takes the outside world's handles away. It has no remote, so a turn has
// nothing to push to by name, and no outer repository whose hooks or credentials
// it could borrow. Its tracked tree is exactly the commit under test, so a
// per-turn restore has a clean baseline to put back. What the clone does not
// take away is the filesystem, since a turn can still read and write anywhere
// its user can by absolute path.
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
// whose name begins with `.env` is skipped while copying the build trees, at
// every depth. A clone brings every tracked file, so a dotenv file in the commit
// is already in the arena, and the output and the marker name it instead.
//
// Usage:
//   node prepare-behaviour-arena.mjs --source <repo root> --dest <dir>

// ───────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────

import { appendFileSync, existsSync, lstatSync, lutimesSync, mkdirSync, readdirSync, realpathSync, rmSync, utimesSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
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

export const MARK = 'skilled-behaviour-arena';

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
// 7. SOURCE CHECKS
// ───────────────────────────────────────────────────────────────

// A clone carries the commit and nothing else, so a changed or untracked path is
// what the arena would silently not measure.
function sourceChanges(source) {
  return gitText(['status', '--porcelain'], source, 'source_status_unreadable')
    .split('\n')
    .filter((line) => line !== '')
    .map((line) => line.slice(3));
}

function newestFileTime(path) {
  let newest = 0;
  for (const entry of readdirSync(path, { withFileTypes: true })) {
    const child = join(path, entry.name);
    if (entry.isDirectory()) {
      newest = Math.max(newest, newestFileTime(child));
      continue;
    }
    newest = Math.max(newest, lstatSync(child).mtimeMs);
  }
  return newest;
}

// The guard a CLI shim runs compares a build with the newest watched source, so the
// build has to be at least as new as every tracked file in the folder that holds it.
function newestTrackedTime(source, folder) {
  const prefix = folder === '.' ? '' : `${folder}/`;
  const tracked = gitText(['ls-files', '-z', '--', folder], source, 'tracked_files_unreadable')
    .split('\0')
    .filter(
      (relPath) =>
        relPath !== '' &&
        !relPath.startsWith(`${prefix}dist/`) &&
        !relPath.startsWith(`${prefix}node_modules/`),
    );
  let newest = 0;
  for (const relPath of tracked) newest = Math.max(newest, lstatSync(join(source, relPath)).mtimeMs);
  return newest;
}

// One refusal lists every stale build, so a single rebuild round clears the tree
// instead of one refusal per build.
function staleBuilds(source, copied) {
  const stale = [];
  for (const relPath of copied) {
    if (basename(relPath) !== 'dist') continue;
    const buildTime = newestFileTime(join(source, relPath));
    const sourceTime = newestTrackedTime(source, dirname(relPath));
    if (buildTime >= sourceTime) continue;
    stale.push({
      path: relPath,
      source: new Date(sourceTime).toISOString(),
      build: new Date(buildTime).toISOString(),
    });
  }
  return stale;
}

// A copied build tree can hold a link whose target sits outside the checkout, and
// copying the link would bring that data into the arena where a run can read it.
// A link is allowed only when it already resolves inside the source, so a dangling
// link is refused too because nothing shows where it would land. The walk reads
// the trees a clone never carries, which is where such a link can hide.
function escapingLinks(source, copied) {
  const root = realpathSync(source);
  const escapes = [];
  const visit = (relPath) => {
    for (const entry of readdirSync(join(source, relPath), { withFileTypes: true })) {
      const childRel = `${relPath}/${entry.name}`;
      const childPath = join(source, childRel);
      if (entry.isSymbolicLink()) {
        let target = null;
        try {
          target = realpathSync(childPath);
        } catch {
          escapes.push({ path: childRel, target: null });
          continue;
        }
        const fromRoot = relative(root, target);
        const outside = isAbsolute(fromRoot) || fromRoot === '..' || fromRoot.startsWith(`..${sep}`);
        if (outside) escapes.push({ path: childRel, target });
        continue;
      }
      if (entry.isDirectory()) visit(childRel);
    }
  };
  for (const relPath of copied) {
    if (lstatSync(join(source, relPath)).isDirectory()) visit(relPath);
  }
  return escapes;
}

// ───────────────────────────────────────────────────────────────
// 8. COPY PLAN
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

// A tracked dotenv file is already in the commit, so a clone carries it and the
// copy below never sees it. Naming it is what tells the operator the arena holds
// one, and the commit already published it to anyone who clones.
function trackedDotenvFiles(source) {
  return gitText(['ls-files', '-z'], source, 'tracked_files_unreadable')
    .split('\0')
    .filter((relPath) => relPath !== '' && DOTENV_PATTERN.test(basename(relPath)));
}

function holdsDotenv(dirPath) {
  for (const entry of readdirSync(dirPath, { withFileTypes: true })) {
    if (DOTENV_PATTERN.test(entry.name)) return true;
    if (entry.isDirectory() && holdsDotenv(join(dirPath, entry.name))) return true;
  }
  return false;
}

// The clonefile flag copies a file's blocks instead of its bytes, and only the
// macOS `cp` has it, so the platform picks the list rather than assuming every
// `cp` accepts the flag.
export function copyArgs(platform) {
  return platform === 'darwin' ? ['-Rc'] : ['-R'];
}

function runCp(sourcePath, destParent) {
  const result = spawnSync('cp', [...copyArgs(process.platform), sourcePath, destParent], { encoding: 'utf8' });
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

// The clonefile flag is macOS only, and on the same volume it keeps the copy
// cheap. The walk only happens where a dotenv file is actually present, so the
// common tree is one `cp` call rather than one call per file.
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
// 9. ARENA BUILD
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

// Claude Code reads CLAUDE.md and not AGENTS.md, so the arena imports its own
// rules, and the exclude line keeps the clean-tree check and the head unchanged.
function writeClaudePointer(dest) {
  const pointerPath = join(dest, 'CLAUDE.md');
  if (existsSync(pointerPath)) return;
  writeFileSync(pointerPath, '@AGENTS.md\n');
  mkdirSync(join(dest, '.git', 'info'), { recursive: true });
  appendFileSync(join(dest, '.git', 'info', 'exclude'), '/CLAUDE.md\n');
}

function buildArena(source, dest, head, copied, trackedDotenv) {
  cloneInto(source, dest);
  checkoutDetached(dest, head);
  removeRemotes(dest);
  for (const relPath of copied) {
    const destPath = join(dest, relPath);
    copyPath(join(source, relPath), destPath);
    if (basename(relPath) === 'dist') stampBuildTree(destPath);
  }
  assertHead(dest, head);
  writeClaudePointer(dest);
  // The runner refuses a live arm in a checkout without this file, because only a
  // checkout built here has no remote, no outer repository and no dotenv file in
  // its copied build trees. The lines after the head record what the source checks
  // found and when each copied build was compiled.
  const marker = [head, 'source clean'];
  for (const relPath of copied) {
    if (basename(relPath) !== 'dist') continue;
    marker.push(`built ${relPath} ${new Date(newestFileTime(join(source, relPath))).toISOString()}`);
  }
  for (const relPath of trackedDotenv) marker.push(`tracked-dotenv ${relPath}`);
  writeFileSync(join(dest, '.git', MARK), `${marker.join('\n')}\n`);
}

// ───────────────────────────────────────────────────────────────
// 10. ENTRY POINT
// ───────────────────────────────────────────────────────────────

function main(argv) {
  const options = parseOptions(argv);
  const source = resolve(options.source);
  const dest = resolve(options.dest);
  const head = headOf(source, 'source_not_repo');

  if (pathExists(dest)) refuse('dest_exists', { dest });
  if (isInsideRepository(nearestExistingAncestor(dirname(dest)))) refuse('dest_in_repo', { dest });

  // An uncommitted edit also makes its build read stale, so the tree is checked
  // before the builds, and both run before anything is copied.
  const changes = sourceChanges(source);
  if (changes.length > 0) refuse('source_dirty', { paths: changes.slice(0, 10) });

  const copied = copyPlan(source);
  const stale = staleBuilds(source, copied);
  if (stale.length > 0) refuse('stale_build', { stale });

  const escaping = escapingLinks(source, copied);
  if (escaping.length > 0) refuse('symlink_escape', { links: escaping });

  const trackedDotenv = trackedDotenvFiles(source);

  mkdirSync(dirname(dest), { recursive: true });
  try {
    buildArena(source, dest, head, copied, trackedDotenv);
    writeJson({ ok: true, dest, head, copied, ...(trackedDotenv.length > 0 ? { trackedDotenv } : {}) });
  } catch (error) {
    // A half-built arena would answer the next call with `dest_exists` while
    // holding a checkout nobody finished, so the failed attempt removes itself.
    rmSync(dest, { recursive: true, force: true });
    abort(error.code ?? 'arena_failed', error.message);
  }
}

// The marker name is exported for the tests that write it, so the CLI runs only
// when this file is the entry point. An imported module that parsed the host's
// argv would refuse on flags it never received. The entry path is compared after
// resolving links, because Node names a linked entry by its real path.
const invokedDirectly = (() => {
  if (typeof process.argv[1] !== 'string') return false;
  try {
    return realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url));
  } catch {
    return false;
  }
})();

if (invokedDirectly) {
  main(process.argv.slice(2));
}
