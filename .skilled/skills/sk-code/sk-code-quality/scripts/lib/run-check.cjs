// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code-quality Check Spawner and Workspace Guard
// ───────────────────────────────────────────────────────────────────
'use strict';

// The one place the quality runner starts a process. Every command is an argv array
// with no shell in between, so a file name or a quote in a repository's config is
// never read as shell syntax, and each one runs under its own deadline. The workspace
// guard hashes what a check could change before and after it runs, because a gate
// that edits the code it reports on is no longer reporting on what the author wrote.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const { spawnSync } = require('node:child_process');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// An index refresh is an optional write that git skips under GIT_OPTIONAL_LOCKS=0, and
// a file-system monitor can start a daemon or hang on a stuck socket. Literal
// pathspecs keep a file name holding * or ? from matching other files.
const GIT_PREFIX = Object.freeze(['-c', 'core.fsmonitor=false']);
const GIT_ENV = Object.freeze({ GIT_OPTIONAL_LOCKS: '0', GIT_LITERAL_PATHSPECS: '1' });
const GIT_TIMEOUT_MS = 60000;
const EMPTY_TREE = '4b825dc642cb6eb9a060e54bf8d69288fbee4904';
const MAX_BUFFER = 64 * 1024 * 1024;
// A file past the runner's read limit is compared by size and change time, so the guard
// never reads a large untracked file in full twice per run.
const HASH_LIMIT_BYTES = 2 * 1024 * 1024;

// Each of these makes an interpreter run code before the file it was asked to read:
// a preload in NODE_OPTIONS, a startup file in BASH_ENV or ENV. A compile cache
// directory is a place node writes to.
const UNSAFE_ENV = Object.freeze(['NODE_OPTIONS', 'NODE_COMPILE_CACHE', 'BASH_ENV', 'ENV']);

// A repository command can fork helpers that outlive it and keep the output pipe open,
// so a small node parent starts it as the leader of its own process group, kills the
// whole group at the deadline and again once the leader exits, and reports the
// outcome on a fourth descriptor so the command's own output stays untouched. The
// parent's deadline sits a little past the group's, so a parent that hangs is still
// stopped.
const GROUP_PARENT = [
  "const { spawn } = require('node:child_process');",
  "const fs = require('node:fs');",
  'const argv = JSON.parse(process.argv[1]);',
  'const timeoutMs = Number(process.argv[2]);',
  'let done = false;',
  'let timedOut = false;',
  'const report = (fields) => {',
  '  if (done) return;',
  '  done = true;',
  '  try { fs.writeSync(3, JSON.stringify(fields)); } catch {}',
  '};',
  "const child = spawn(argv[0], argv.slice(1), { stdio: ['ignore', 'inherit', 'inherit'], detached: true, shell: false });",
  "const killGroup = () => { try { process.kill(-child.pid, 'SIGKILL'); } catch {} };",
  'const timer = setTimeout(() => { timedOut = true; killGroup(); }, timeoutMs);',
  "child.on('error', (error) => { clearTimeout(timer); report({ error: error.message, errno: error.code || null }); });",
  "child.on('exit', (code, signal) => { clearTimeout(timer); killGroup(); report({ code, signal, timedOut }); });",
].join('\n');
const GROUP_GRACE_MS = 5000;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function cleanEnv(base) {
  const env = { ...base };
  for (const key of UNSAFE_ENV) delete env[key];
  return env;
}

function isExecutableFile(file) {
  try {
    if (!fs.statSync(file).isFile()) return false;
    fs.accessSync(file, fs.constants.X_OK);
    return true;
  } catch {
    return false;
  }
}

function splitNul(text) {
  return text.split('\0').filter(Boolean);
}

function hashEntry(root, rel) {
  const abs = path.join(root, rel);
  let stat;
  try {
    stat = fs.lstatSync(abs);
  } catch {
    return 'missing';
  }
  if (stat.isSymbolicLink()) return `link:${fs.readlinkSync(abs)}`;
  if (!stat.isFile()) return `other:${stat.mode}`;
  if (stat.size > HASH_LIMIT_BYTES) return `large:${stat.mode}:${stat.size}:${stat.mtimeMs}`;
  const digest = crypto.createHash('sha256').update(fs.readFileSync(abs)).digest('hex');
  return `file:${stat.mode & 0o111 ? 'x' : '-'}:${digest}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Find an executable on PATH without starting it.
 *
 * @param {string} name - Program name, or a path holding a slash.
 * @param {Object} [env] - Environment whose PATH is searched.
 * @returns {string|null} Absolute path, or null when no executable file matches.
 */
function findTool(name, env = process.env) {
  if (name.includes('/')) return isExecutableFile(name) ? name : null;
  for (const dir of String(env.PATH || '').split(path.delimiter)) {
    if (!dir) continue;
    const candidate = path.join(dir, name);
    if (isExecutableFile(candidate)) return candidate;
  }
  return null;
}

/**
 * Run one argv array under a deadline, with no shell.
 *
 * @param {string[]} argv - Program and arguments.
 * @param {Object} [options] - cwd, env, timeoutMs, input and the signal a deadline sends.
 * @returns {{state:string, exit:number|null, stdout:string, stderr:string, durationMs:number, error:string|null}}
 */
function spawnArgv(argv, { cwd, env = process.env, timeoutMs, input, killSignal = 'SIGKILL' } = {}) {
  const started = Date.now();
  const result = spawnSync(argv[0], argv.slice(1), {
    cwd,
    env: cleanEnv(env),
    input,
    encoding: 'utf8',
    timeout: timeoutMs,
    killSignal,
    maxBuffer: MAX_BUFFER,
    shell: false,
  });
  const durationMs = Date.now() - started;
  const base = { exit: result.status, stdout: result.stdout || '', stderr: result.stderr || '', durationMs };
  if (result.error && result.error.code === 'ETIMEDOUT') return { ...base, state: 'TIMEOUT', error: 'timed out' };
  if (result.error) return { ...base, state: 'ERROR', error: result.error.message };
  if (result.status === null) return { ...base, state: 'ERROR', error: `killed by ${result.signal}` };
  return { ...base, state: result.status === 0 ? 'RAN_CLEAN' : 'RAN_FAIL', error: null };
}

/**
 * Run one repository command as the leader of its own process group, with no shell
 * and no input. The whole group is killed at the deadline and again when the leader
 * exits, so a helper it forked cannot outlive the check.
 *
 * @param {string[]} argv - Program and arguments, passed to the program as they are.
 * @param {Object} options - cwd, env and timeoutMs.
 * @returns {{state:string, exit:number|null, stdout:string, stderr:string, durationMs:number, error:string|null}}
 */
function spawnGroup(argv, { cwd, env = process.env, timeoutMs }) {
  const started = Date.now();
  const result = spawnSync(process.execPath, ['-e', GROUP_PARENT, JSON.stringify(argv), String(timeoutMs)], {
    cwd,
    env: cleanEnv(env),
    stdio: ['ignore', 'pipe', 'pipe', 'pipe'],
    encoding: 'utf8',
    timeout: timeoutMs + GROUP_GRACE_MS,
    killSignal: 'SIGKILL',
    maxBuffer: MAX_BUFFER,
    shell: false,
  });
  const durationMs = Date.now() - started;
  const base = { stdout: result.stdout || '', stderr: result.stderr || '', durationMs };
  if (result.error && result.error.code === 'ETIMEDOUT') return { ...base, exit: null, state: 'TIMEOUT', error: 'timed out' };
  if (result.error) return { ...base, exit: null, state: 'ERROR', error: result.error.message };
  let outcome = null;
  try {
    outcome = JSON.parse((result.output && result.output[3]) || '');
  } catch {
    outcome = null;
  }
  if (!outcome) return { ...base, exit: null, state: 'ERROR', error: 'the process group parent reported no outcome' };
  if (outcome.error) return { ...base, exit: null, state: 'ERROR', error: outcome.error, missing: outcome.errno === 'ENOENT' };
  if (outcome.timedOut) return { ...base, exit: null, state: 'TIMEOUT', error: 'timed out' };
  if (outcome.code === null) return { ...base, exit: null, state: 'ERROR', error: `killed by ${outcome.signal}` };
  return { ...base, exit: outcome.code, state: outcome.code === 0 ? 'RAN_CLEAN' : 'RAN_FAIL', error: null };
}

/**
 * Run git read-only, with optional locks and the file-system monitor off.
 *
 * @param {string[]} args - Git arguments after the program name.
 * @param {Object} [options] - cwd, env and input.
 * @returns {{ok:boolean, missing:boolean, stdout:string, stderr:string, state:string}}
 */
function runGit(args, { cwd, env = process.env, input } = {}) {
  const result = spawnArgv(['git', ...GIT_PREFIX, ...args], {
    cwd,
    env: { ...env, ...GIT_ENV },
    timeoutMs: GIT_TIMEOUT_MS,
    input,
  });
  return {
    ...result,
    ok: result.state === 'RAN_CLEAN',
    missing: result.state === 'ERROR' && /ENOENT/.test(String(result.error)),
  };
}

// The tracked changes against HEAD, the untracked files and the commit HEAD names, so
// a second edit to a file that was already modified changes the hash even though its
// status code does not. A run lists the untracked files for its scope anyway, so the
// snapshot hashes that list instead of walking the tree again, and it hashes the named
// files only where that list does not already cover them. Outside git the guard hashes
// the named files.
function takeSnapshot({ root, git, files, env, folders, untracked }) {
  const entries = new Map();
  if (!git) {
    for (const rel of files) entries.set(rel, hashEntry(root, rel));
    return entries;
  }
  const head = runGit(['rev-parse', '--verify', '-q', 'HEAD^{commit}'], { cwd: root, env });
  const base = head.ok ? head.stdout.trim() : EMPTY_TREE;
  const tracked = runGit(['diff', '--name-only', '-z', '--no-renames', base], { cwd: root, env });
  if (!tracked.ok) throw guardFailed();
  const listed = untracked === undefined ? listUntracked({ root, env, folders }) : untracked || [];
  entries.set('@HEAD', base);
  for (const rel of [...splitNul(tracked.stdout), ...listed]) entries.set(rel, hashEntry(root, rel));
  for (const rel of files) if (!entries.has(rel)) entries.set(rel, hashEntry(root, rel));
  return entries;
}

function guardFailed() {
  const error = new Error('git could not list the workspace state for the guard');
  error.code = 'GUARD_FAILED';
  return error;
}

// The untracked paths a snapshot hashes when no caller listed them. The bound is the
// folders the scope reaches, so a write where a check runs stays visible at the cost of
// those folders rather than the whole tree. An empty bound is a scope that reaches no
// folder, so there is nothing beyond its own files to look for.
function listUntracked({ root, env, folders }) {
  if (Array.isArray(folders) && folders.length === 0) return [];
  const args = ['ls-files', '--others', '--exclude-standard', '-z'];
  if (folders) args.push('--', ...folders);
  const result = runGit(args, { cwd: root, env });
  if (!result.ok) throw guardFailed();
  return splitNul(result.stdout);
}

function changedPaths(before, after) {
  const keys = new Set([...before.keys(), ...after.keys()]);
  return [...keys].filter((key) => before.get(key) !== after.get(key)).sort();
}

/**
 * Run work under the workspace guard. Passing the snapshot an earlier guard returned
 * chains the guards, so a window starts where the last one ended. The runner passes
 * its built-in checks as one piece of work and each repository command as its own, so
 * a mutation names the one command that made it. The closing snapshot lists again inside
 * the folders the scope reaches, because a check can create a path no earlier listing
 * holds, and a guard handed no listing lists there at both snapshots.
 *
 * @param {Object} context - root, git, files, env, folders and untracked, as takeSnapshot reads them.
 * @param {Function} work - The check, called with no arguments.
 * @param {Map} [before] - The snapshot to compare against, taken now when absent.
 * @returns {{value:*, after:Map, mutated:string[]}}
 */
function withGuard(context, work, before) {
  const start = before || takeSnapshot(context);
  const value = work();
  const after = takeSnapshot(context.untracked === null ? context : { ...context, untracked: undefined });
  return { value, after, mutated: changedPaths(start, after) };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { findTool, runGit, spawnArgv, spawnGroup, withGuard };
