// ───────────────────────────────────────────────────────────────────
// MODULE: env-secret-guard After-Call Watch
// ───────────────────────────────────────────────────────────────────
// The policy core judges a call by its text, so a route it cannot read from
// the text gets through: a script that hard-codes the path, `source .env`
// followed by `echo`, a dotenv library's default path. This module judges the
// result instead. Before a shell call it records every dotenv file in the
// project; after the call it puts back any that changed and looks for a dotenv
// value in the output. No value is ever returned or logged.
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const guardCore = require('./env-secret-guard.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const WRITE_CHECK_ENV = 'ENV_SECRET_GUARD_WRITE_CHECK';
const STATE_ENV = 'ENV_SECRET_GUARD_STATE_DIR';
const MAX_WALK_DEPTH = 3;
const MAX_DOTENV_FILES = 40;
const MAX_DOTENV_BYTES = 1024 * 1024;
const MAX_OUTPUT_BYTES = 4 * 1024 * 1024;
// A record older than this was not taken for the call being judged, so it is not trusted.
const MAX_RECORD_AGE_MS = 60 * 60 * 1000;
// Shorter values are too common in ordinary output to treat as a leak.
const MIN_SECRET_LENGTH = 12;
const SKIP_DIRS = new Set(['node_modules', 'vendor', 'dist', 'build', 'target']);
const LOCAL_VALUE = /^(?:[a-z][a-z0-9+.-]*:\/\/)?(?:localhost|127\.0\.0\.1|0\.0\.0\.0)(?:[:/]|$)/i;

// ─────────────────────────────────────────────────────────────────────────────
// 3. DISCOVERY AND STATE
// ─────────────────────────────────────────────────────────────────────────────

/** Every dotenv file in the project, to a bounded depth, as real paths. */
function findDotenvFiles(cwd) {
  const found = [];
  const walk = (dir, depth) => {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (found.length >= MAX_DOTENV_FILES) return;
      const full = path.join(dir, entry.name);
      if (entry.isFile() && guardCore.isDotenvName(entry.name)) found.push(full);
      else if (entry.isDirectory() && depth < MAX_WALK_DEPTH && !entry.name.startsWith('.') && !SKIP_DIRS.has(entry.name)) {
        walk(full, depth + 1);
      }
    }
  };
  let root;
  try {
    root = fs.realpathSync.native(path.resolve(cwd));
  } catch {
    return found;
  }
  walk(root, 0);
  return found;
}

/**
 * The private folder that holds one project's record and backups. It sits
 * outside the checkout, readable by the owner only, because a backup is a
 * copy of a dotenv file.
 */
function stateDir(cwd, env = process.env) {
  const base = env[STATE_ENV]
    || path.join(env.XDG_STATE_HOME || path.join(os.homedir(), '.local', 'state'), 'env-secret-guard');
  let root = path.resolve(cwd);
  try {
    root = fs.realpathSync.native(root);
  } catch {
    // An unresolvable project still gets a stable id from its given path.
  }
  return path.join(base, crypto.createHash('sha256').update(root).digest('hex').slice(0, 16));
}

function hashFile(file) {
  const stat = fs.statSync(file);
  if (!stat.isFile() || stat.size > MAX_DOTENV_BYTES) return null;
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function backupName(file) {
  return crypto.createHash('sha256').update(file).digest('hex').slice(0, 24);
}

function readIndex(dir) {
  try {
    const parsed = JSON.parse(fs.readFileSync(path.join(dir, 'index.json'), 'utf8'));
    const valid = parsed && typeof parsed === 'object' && parsed.files && typeof parsed.files === 'object';
    return valid ? parsed : null;
  } catch {
    return null;
  }
}

function writePrivate(file, data) {
  fs.writeFileSync(file, data, { mode: 0o600 });
  fs.chmodSync(file, 0o600);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. WRITE CHECK
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Record every dotenv file before a shell call runs. A file that differs from
 * the last record was changed outside an agent call, by the user or an editor,
 * so its new content becomes the record.
 * @param {string} cwd
 * @param {NodeJS.ProcessEnv} [env]
 * @returns {number} How many files are on record.
 */
function snapshotDotenv(cwd, env = process.env) {
  const dir = stateDir(cwd, env);
  fs.mkdirSync(path.join(dir, 'backup'), { recursive: true, mode: 0o700 });
  const previous = readIndex(dir)?.files ?? {};
  const files = {};
  for (const file of findDotenvFiles(cwd)) {
    const hash = hashFile(file);
    if (!hash) continue;
    const backup = path.join(dir, 'backup', backupName(file));
    if (previous[file]?.hash !== hash || !fs.existsSync(backup)) writePrivate(backup, fs.readFileSync(file));
    files[file] = { hash, mode: fs.statSync(file).mode & 0o777 };
  }
  writePrivate(path.join(dir, 'index.json'), JSON.stringify({ at: Date.now(), files }));
  return Object.keys(files).length;
}

/**
 * Compare every dotenv file with the record taken before the call. In the
 * default `restore` mode a changed or deleted file is put back and a new one
 * is removed, and the rejected version is kept in the private folder so an
 * edit the user made during the call is never lost. `report` mode changes
 * nothing. Without a record taken in the last hour it reports nothing.
 * @param {string} cwd
 * @param {NodeJS.ProcessEnv} [env]
 * @returns {{file: string, change: 'modified'|'deleted'|'created', restored: boolean, kept: string|null}[]}
 */
function reviewDotenvWrites(cwd, env = process.env) {
  const dir = stateDir(cwd, env);
  const index = readIndex(dir);
  // With no fresh record there is nothing to compare against, and treating
  // every dotenv file as new would delete the user's own files.
  if (!index || typeof index.at !== 'number' || Date.now() - index.at > MAX_RECORD_AGE_MS) return [];
  const recorded = index.files;
  const restore = String(env[WRITE_CHECK_ENV] || 'restore').toLowerCase() !== 'report';
  const root = path.resolve(cwd);
  const changes = [];
  const keep = (file) => {
    const rejected = path.join(dir, 'rejected');
    fs.mkdirSync(rejected, { recursive: true, mode: 0o700 });
    const kept = path.join(rejected, `${Date.now()}-${backupName(file).slice(0, 8)}-${path.basename(file)}`);
    writePrivate(kept, fs.readFileSync(file));
    return kept;
  };
  const current = new Set(findDotenvFiles(cwd));
  for (const [file, record] of Object.entries(recorded)) {
    const exists = current.has(file);
    let hash = null;
    try {
      hash = exists ? hashFile(file) : null;
    } catch {
      hash = null;
    }
    if (exists && hash === record.hash) continue;
    const change = { file: path.relative(root, file) || file, change: exists ? 'modified' : 'deleted', restored: false, kept: null };
    if (restore) {
      const backup = path.join(dir, 'backup', backupName(file));
      if (exists) change.kept = keep(file);
      fs.copyFileSync(backup, file);
      fs.chmodSync(file, record.mode);
      change.restored = true;
    }
    changes.push(change);
  }
  for (const file of current) {
    if (recorded[file]) continue;
    const change = { file: path.relative(root, file) || file, change: 'created', restored: false, kept: null };
    if (restore) {
      change.kept = keep(file);
      fs.rmSync(file);
      change.restored = true;
    }
    changes.push(change);
  }
  return changes;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. OUTPUT SCAN
// ─────────────────────────────────────────────────────────────────────────────

/** Every string inside a tool result, joined, so a value is found wherever the runtime put it. */
function textOf(output, depth = 0) {
  if (typeof output === 'string') return output;
  if (!output || typeof output !== 'object' || depth > 6) return '';
  const parts = [];
  for (const value of Array.isArray(output) ? output : Object.values(output)) {
    const text = textOf(value, depth + 1);
    if (text) parts.push(text);
  }
  return parts.join('\n');
}

/** True for a value worth treating as a secret: long enough, not a local address, not one plain word. */
function isSecretLike(value) {
  if (typeof value !== 'string' || value.length < MIN_SECRET_LENGTH) return false;
  if (LOCAL_VALUE.test(value)) return false;
  return !/^[a-z]+$/i.test(value);
}

/** The key and value of every secret-like entry in the project's dotenv files. */
function projectSecrets(cwd) {
  const secrets = [];
  const root = path.resolve(cwd);
  for (const file of findDotenvFiles(cwd)) {
    let text;
    try {
      if (fs.statSync(file).size > MAX_DOTENV_BYTES) continue;
      text = fs.readFileSync(file, 'utf8');
    } catch {
      continue;
    }
    for (const { key, value } of guardCore.parseDotenv(text).entries) {
      if (isSecretLike(value)) secrets.push({ key, value, file: path.relative(root, file) || file });
    }
  }
  return secrets;
}

/**
 * The dotenv values a tool result holds, by key and file only.
 * @param {unknown} output - The tool result in whatever shape the runtime sends.
 * @param {string} cwd
 * @returns {{leaks: {key: string, file: string}[], redact: (text: string) => string}}
 *   `redact` replaces every found value in a string with a marker naming its key.
 */
function scanOutput(output, cwd) {
  const text = textOf(output).slice(0, MAX_OUTPUT_BYTES);
  const hits = text ? projectSecrets(cwd).filter(({ value }) => text.includes(value)) : [];
  const leaks = [];
  for (const { key, file } of hits) {
    if (!leaks.some((leak) => leak.key === key && leak.file === file)) leaks.push({ key, file });
  }
  const redact = (value) => hits.reduce(
    (result, hit) => result.split(hit.value).join(`[env-secret-guard: ${hit.key} redacted]`),
    String(value),
  );
  return { leaks, redact };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. AFTER-CALL REVIEW
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Judge a finished tool call: undo a dotenv write a shell call made, and find
 * a dotenv value in what the call returned.
 * @param {{tool: string, output: unknown, cwd?: string, env?: NodeJS.ProcessEnv}} call
 * @returns {{message: string|null, leaks: {key: string, file: string}[], changes: object[], redact: (text: string) => string}}
 *   `message` is the notice for the model and the user, or null when nothing was found.
 */
function reviewToolResult({ tool, output, cwd = process.cwd(), env = process.env } = {}) {
  const shell = guardCore.SHELL_TOOLS.has(String(tool || '').toLowerCase());
  let changes = [];
  if (shell) {
    try {
      changes = reviewDotenvWrites(cwd, env);
    } catch {
      // A write check that cannot run must not hide a leak the scan can still find.
    }
  }
  const { leaks, redact } = scanOutput(output, cwd);
  const lines = [];
  for (const change of changes) {
    const kept = change.kept ? ` The rejected version is kept at ${change.kept}.` : '';
    lines.push(change.restored
      ? `env-secret-guard: that call ${change.change} ${change.file}, a dotenv file, and the change was undone.${kept} `
        + 'Ask the user to make the change themselves.'
      : `env-secret-guard: that call ${change.change} ${change.file}, a dotenv file. Tell the user.`);
  }
  for (const leak of leaks) {
    lines.push(`env-secret-guard: the output of that call held the value of ${leak.key} from ${leak.file}. `
      + 'Do not repeat it. Tell the user it reached the session and should be rotated.');
  }
  for (const line of lines) guardCore.recordEvent(cwd, line);
  return { message: lines.length ? lines.join('\n') : null, leaks, changes, redact };
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  WRITE_CHECK_ENV,
  STATE_ENV,
  findDotenvFiles,
  snapshotDotenv,
  reviewDotenvWrites,
  scanOutput,
  reviewToolResult,
};
