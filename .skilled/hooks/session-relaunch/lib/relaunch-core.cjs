// ───────────────────────────────────────────────────────────────────
// MODULE: Session Relaunch Core
// ───────────────────────────────────────────────────────────────────
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const { spawnSync } = require('node:child_process');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const STATE_DIRECTORY_NAME = 'skilled-relaunch';
const LEGACY_LOCK_MAX_AGE_MS = 10 * 60 * 1000;
const HANDOFF_SECTIONS = Object.freeze(['Goal', 'Done', 'Remaining work', 'In-flight state']);
const SPEC_FOLDER_PATTERN =
  /^specs\/(?:[A-Za-z0-9._-]+\/)+\d{3}-[a-z0-9]+(?:-[a-z0-9]+)*$/;
const RUNTIME_SEED_OPTIONS = Object.freeze({
  opencode: '--prompt',
  hermes: 'chat -q',
  devin: '--',
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Validate a repo-relative packet folder before carrying it across sessions. */
function validSpecFolder(value) {
  return typeof value === 'string'
    && SPEC_FOLDER_PATTERN.test(value)
    && !value.split('/').includes('..')
    && !/[\r\n]/.test(value);
}

function ensureStateDir(env) {
  const directory = stateDir(env);
  fs.mkdirSync(directory, { recursive: true, mode: 0o700 });
  // mkdirSync succeeds through a symlink and says nothing about who owns the
  // directory, so re-inspect the real entry: a redirected or foreign-owned state
  // directory would let another user read or steer the relaunch records.
  const stats = fs.lstatSync(directory);
  const ownerUid = typeof process.getuid === 'function' ? process.getuid() : null;
  if (!stats.isDirectory() || (ownerUid !== null && stats.uid !== ownerUid)) {
    throw new Error(
      `relaunch state directory must be a real directory owned by the current user: ${directory}`,
    );
  }
  fs.chmodSync(directory, 0o700);
  return directory;
}

function atomicWriteFile(filePath, content, mode = 0o600) {
  const directory = path.dirname(filePath);
  const temporaryPath = path.join(directory, `.${path.basename(filePath)}.${randomUUID()}.tmp`);
  let fileDescriptor = null;
  let hasTemporaryFile = false;

  try {
    fileDescriptor = fs.openSync(temporaryPath, 'wx', mode);
    hasTemporaryFile = true;
    fs.writeFileSync(fileDescriptor, content, 'utf8');
    fs.fsyncSync(fileDescriptor);
    fs.closeSync(fileDescriptor);
    fileDescriptor = null;
    fs.renameSync(temporaryPath, filePath);
    hasTemporaryFile = false;
  } catch (error) {
    if (fileDescriptor !== null) {
      try {
        fs.closeSync(fileDescriptor);
      } catch {}
    }
    if (hasTemporaryFile) {
      try {
        fs.unlinkSync(temporaryPath);
      } catch {}
    }
    throw error;
  }
}

function toIsoTimestamp(now) {
  const value = now === undefined ? Date.now() : now;
  const date = value instanceof Date ? value : new Date(value);
  if (!Number.isFinite(date.getTime())) throw new Error('timestamp must be a valid date');
  return date.toISOString();
}

function parseTimestamp(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') return Date.parse(value);
  return Number.NaN;
}

function readHandoffText(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    throw new Error(`handoff note not found: ${filePath}`);
  }
}

function updateFrontmatter(text, updates) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?=\r?\n|$)/);
  if (!match) throw new Error('missing frontmatter fences');

  const lineEnding = match[0].includes('\r\n') ? '\r\n' : '\n';
  const fields = match[1].split(/\r?\n/);
  for (const [key, value] of Object.entries(updates)) {
    const fieldIndex = fields.findIndex((line) => line.startsWith(`${key}:`));
    const replacement = `${key}: ${value}`;
    if (fieldIndex === -1) fields.push(replacement);
    else fields[fieldIndex] = replacement;
  }

  const replacement = `---${lineEnding}${fields.join(lineEnding)}${lineEnding}---`;
  return replacement + text.slice(match[0].length);
}

// The model writes the note with its own tool and the default mode; every update
// the loop makes re-pins it private, like the other relaunch files.
function writeHandoffUpdate(filePath, text) {
  atomicWriteFile(filePath, text, 0o600);
}

function validLoopId(loopId) {
  return typeof loopId === 'string' && /^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(loopId);
}

function assertValidSessionId(sessionId) {
  if (typeof sessionId !== 'string' || !sessionId.trim() || /[\r\n]/.test(sessionId)) {
    throw new Error('sessionId must be a non-empty single-line value');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Resolve the per-user runtime directory without creating it during reads.
 *
 * The temp fallback carries the uid, because a shared temp directory would
 * otherwise hand the second user on a host a directory the first user created.
 *
 * @param {NodeJS.ProcessEnv} [env=process.env] - Runtime environment overrides.
 * @returns {string} The private relaunch state directory path.
 */
function stateDir(env = process.env) {
  if (env?.XDG_RUNTIME_DIR) return path.join(env.XDG_RUNTIME_DIR, STATE_DIRECTORY_NAME);
  const directoryName = typeof process.getuid === 'function'
    ? `${STATE_DIRECTORY_NAME}-${process.getuid()}`
    : STATE_DIRECTORY_NAME;
  return path.join(os.tmpdir(), directoryName);
}

/**
 * Build a state-file path from a safe loop identifier.
 *
 * @param {string} loopId - Wrapper process identifier for this relaunch loop.
 * @param {NodeJS.ProcessEnv} [env=process.env] - Runtime environment overrides.
 * @returns {string} The relaunch record path.
 * @throws {Error} When the identifier could escape the state directory.
 */
function relaunchFilePath(loopId, env = process.env) {
  if (!validLoopId(loopId)) {
    throw new Error(
      'loopId must contain only letters, numbers, dots, underscores, or hyphens',
    );
  }
  return path.join(stateDir(env), `relaunch-${loopId}.json`);
}

/**
 * Parse flat handoff frontmatter and the Markdown sections that follow it.
 *
 * @param {string} text - Complete handoff note contents.
 * @returns {{frontmatter: Object<string, string>, sections: Object<string, string>}}
 * @throws {Error} When the note does not contain valid flat frontmatter fences.
 */
function parseHandoff(text) {
  if (typeof text !== 'string') throw new Error('handoff note must be text');
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) throw new Error('missing frontmatter fences');

  const frontmatter = {};
  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim()) continue;
    const separator = line.indexOf(':');
    if (separator <= 0) throw new Error(`invalid frontmatter line: ${line}`);
    const key = line.slice(0, separator).trim();
    if (!/^[A-Za-z0-9_-]+$/.test(key)) throw new Error(`invalid frontmatter key: ${key}`);
    if (Object.hasOwn(frontmatter, key)) throw new Error(`duplicate frontmatter key: ${key}`);
    frontmatter[key] = line.slice(separator + 1).trim();
  }

  const sections = {};
  let currentHeading = null;
  let currentLines = [];
  const saveSection = () => {
    if (currentHeading !== null) sections[currentHeading] = currentLines.join('\n').trim();
  };

  for (const line of text.slice(match[0].length).split(/\r?\n/)) {
    const heading = line.match(/^##\s+(.+?)\s*$/);
    if (heading) {
      saveSection();
      currentHeading = heading[1];
      currentLines = [];
    } else if (currentHeading !== null) {
      currentLines.push(line);
    }
  }
  saveSection();

  return { frontmatter, sections };
}

/**
 * Check the handoff note before a caller changes relaunch state.
 *
 * @param {string} filePath - Candidate handoff note path.
 * @param {{sessionId?: string}} [options] - Optional session ownership check.
 * @returns {{ok: true}|{ok: false, reason: string}} Validation result.
 */
function validateHandoff(filePath, { sessionId } = {}) {
  let parsed;
  try {
    parsed = parseHandoff(readHandoffText(filePath));
  } catch (error) {
    return { ok: false, reason: error.message };
  }

  if (parsed.frontmatter.status !== 'open') {
    return {
      ok: false,
      reason: `handoff status must be open, found ${parsed.frontmatter.status || 'missing'}`,
    };
  }
  if (
    sessionId !== undefined
    && sessionId !== null
    && parsed.frontmatter.session_id !== sessionId
  ) {
    return { ok: false, reason: 'handoff belongs to a different session' };
  }
  for (const heading of HANDOFF_SECTIONS) {
    if (!parsed.sections[heading]?.trim()) {
      return {
        ok: false,
        reason: `handoff is missing a non-empty ${heading} section`,
      };
    }
  }
  return { ok: true };
}

/**
 * Store a pending record atomically so a wrapper never reads a partial state.
 *
 * @param {Object} options - Handoff and loop state to persist.
 * @param {string} options.loopId - Wrapper process identifier.
 * @param {string} options.handoffPath - Validated handoff note path.
 * @param {string} options.sessionId - Claude session identifier.
 * @param {string} [options.runtime='claude'] - Runtime that owns the session.
 * @param {string|null} [options.name=null] - Optional named session.
 * @param {string} options.cwd - Working directory to resume.
 * @param {number} [options.hops=0] - Number of completed hops.
 * @param {NodeJS.ProcessEnv} [options.env=process.env] - Runtime environment.
 * @param {Date|number|string} [options.now] - Clock value for deterministic records.
 * @returns {Object} The persisted pending record.
 */
function preparePending({
  loopId,
  handoffPath,
  sessionId,
  runtime = 'claude',
  name = null,
  cwd,
  hops = 0,
  env = process.env,
  now,
}) {
  const record = {
    version: 1,
    status: 'pending',
    loopId,
    handoff: handoffPath,
    sessionId,
    runtime,
    name,
    cwd,
    hops,
    preparedAt: toIsoTimestamp(now),
  };
  ensureStateDir(env);
  atomicWriteFile(relaunchFilePath(loopId, env), `${JSON.stringify(record)}\n`);
  return record;
}

/**
 * Arm a pending record once the previous runtime has stopped.
 *
 * @param {Object} options - Loop state transition inputs.
 * @param {string} options.loopId - Wrapper process identifier.
 * @param {string} [options.cwd=process.cwd()] - Live working directory.
 * @param {NodeJS.ProcessEnv} [options.env=process.env] - Runtime environment.
 * @param {Date|number|string} [options.now] - Clock value for deterministic records.
 * @returns {Object|null} The armed record, or null when absent, unreadable, or not armable.
 */
function arm({ loopId, cwd = process.cwd(), env = process.env, now }) {
  let record;
  try {
    record = readRelaunchFile(loopId, env);
  } catch (error) {
    if (typeof error.code === 'string') return null;
    throw error;
  }
  if (record === null) return null;
  if (record.status === 'armed') return record;
  if (record.status !== 'pending') return null;

  const armed = { ...record, status: 'armed', armedAt: toIsoTimestamp(now), cwd };
  atomicWriteFile(relaunchFilePath(loopId, env), `${JSON.stringify(armed)}\n`);
  return armed;
}

/**
 * Disarm a record after a failed or abandoned relaunch.
 *
 * @param {Object} options - Loop state transition inputs.
 * @param {string} options.loopId - Wrapper process identifier.
 * @param {NodeJS.ProcessEnv} [options.env=process.env] - Runtime environment.
 * @param {string} options.reason - Why the record was disarmed.
 * @param {string} [options.expectedStatus] - Required current status for the transition.
 * @param {string} [options.expectedHandoff] - Required current handoff for the transition.
 * @param {Date|number|string} [options.now] - Clock value for deterministic records.
 * @returns {Object|null} The disarmed record, or null when absent or conditions do not match.
 */
function unarm({ loopId, env = process.env, reason, expectedStatus, expectedHandoff, now }) {
  const record = readRelaunchFile(loopId, env);
  if (record === null) return null;
  if (expectedStatus !== undefined && record.status !== expectedStatus) return null;
  if (expectedHandoff !== undefined && record.handoff !== expectedHandoff) return null;
  const disarmed = {
    ...record,
    status: 'disarmed',
    disarmReason: String(reason ?? 'unspecified'),
    disarmedAt: toIsoTimestamp(now),
  };
  atomicWriteFile(relaunchFilePath(loopId, env), `${JSON.stringify(disarmed)}\n`);
  return disarmed;
}

/**
 * Read one record; logging corrupt JSON may create the state directory.
 *
 * @param {string} loopId - Wrapper process identifier.
 * @param {NodeJS.ProcessEnv} [env=process.env] - Runtime environment.
 * @returns {Object|null} Parsed record, or null when absent or invalid JSON.
 * A corrupt record is logged and treated as absent; logging may create the directory.
 */
function readRelaunchFile(loopId, env = process.env) {
  let contents;
  try {
    contents = fs.readFileSync(relaunchFilePath(loopId, env), 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }

  try {
    return JSON.parse(contents);
  } catch (error) {
    if (!(error instanceof SyntaxError)) throw error;
    // The log is best-effort: a state-dir failure must not turn a corrupt
    // record into a thrown read.
    try {
      appendLog('corrupt-relaunch-file', { loop: loopId }, env);
    } catch {}
    return null;
  }
}

/**
 * Decide whether an armed record is fresh and below the hop limit.
 *
 * @param {Object|null} record - Record returned by readRelaunchFile.
 * @param {Object} [options] - Clock and safety limits.
 * @param {Date|number|string} [options.now=Date.now()] - Current time.
 * @param {number} [options.maxHops=10] - Highest allowed completed-hop count.
 * @param {number} [options.maxAgeMin=10] - Maximum record age in minutes.
 * @returns {{relaunch: true}|{relaunch: false, reason: string}} Decision.
 */
function shouldRelaunch(record, { now = Date.now(), maxHops = 10, maxAgeMin = 10 } = {}) {
  if (!record || typeof record !== 'object') return { relaunch: false, reason: 'no-file' };
  if (record.status !== 'armed') return { relaunch: false, reason: 'not-armed' };

  const nowMs = parseTimestamp(now);
  const armedAtMs = parseTimestamp(record.armedAt);
  const ageLimitMs = Number(maxAgeMin) * 60 * 1000;
  // A record armed in the future means the clock stepped back since it was
  // written, so its age is unknown; stale is the safe reading, not fresh.
  if (
    !Number.isFinite(nowMs)
    || !Number.isFinite(armedAtMs)
    || !Number.isFinite(ageLimitMs)
    || nowMs < armedAtMs
    || nowMs - armedAtMs > ageLimitMs
  ) {
    return { relaunch: false, reason: 'stale' };
  }

  const hops = Number(record.hops);
  const hopLimit = Number(maxHops);
  if (!Number.isFinite(hops) || !Number.isFinite(hopLimit) || hops >= hopLimit) {
    return { relaunch: false, reason: 'hop-cap' };
  }
  return { relaunch: true };
}

/**
 * Claim an open note for the new session before printing its work context.
 *
 * @param {string} filePath - Handoff note path.
 * @param {{sessionId: string, now?: Date|number|string}} options - Claim metadata.
 * @returns {Object} Parsed note after the claim transition.
 * @throws {Error} When the note is not open or claim metadata is invalid.
 */
function claimHandoff(filePath, { sessionId, now } = {}) {
  assertValidSessionId(sessionId);
  const text = readHandoffText(filePath);
  const parsed = parseHandoff(text);
  if (parsed.frontmatter.status !== 'open') {
    throw new Error(
      `cannot claim handoff with status ${parsed.frontmatter.status || 'missing'}`,
    );
  }

  const updated = updateFrontmatter(text, {
    status: 'claimed',
    claimed_at: toIsoTimestamp(now),
    claimed_by: sessionId,
  });
  writeHandoffUpdate(filePath, updated);
  return parseHandoff(updated);
}

/**
 * Mark a claimed note done so a later session cannot claim it again.
 *
 * @param {string} filePath - Handoff note path.
 * @param {{now?: Date|number|string}} [options] - Completion clock.
 * @returns {Object} Parsed note after the completion transition.
 * @throws {Error} When the note has not already been claimed.
 */
function completeHandoff(filePath, { now } = {}) {
  const text = readHandoffText(filePath);
  const parsed = parseHandoff(text);
  if (parsed.frontmatter.status !== 'claimed') {
    throw new Error(
      `cannot complete handoff with status ${parsed.frontmatter.status || 'missing'}`,
    );
  }

  const updated = updateFrontmatter(text, {
    status: 'done',
    completed_at: toIsoTimestamp(now),
  });
  writeHandoffUpdate(filePath, updated);
  return parseHandoff(updated);
}

/**
 * Complete this session's earlier notes when a new handoff carries the work forward:
 * the notes it claimed, and any note it wrote but never prepared, which would
 * otherwise stay open with no session left to claim it.
 *
 * @param {string} handoffPath - New handoff note path.
 * @param {{sessionId: string, now?: Date|number|string}} options - Session and clock metadata.
 * @returns {string[]} Paths of notes superseded by the new handoff.
 */
function supersedeClaimed(handoffPath, { sessionId, now } = {}) {
  assertValidSessionId(sessionId);
  const directory = path.dirname(handoffPath);
  const currentPath = path.resolve(handoffPath);
  const completedAt = toIsoTimestamp(now);
  const supersededPaths = [];

  for (const fileName of fs.readdirSync(directory)) {
    if (!fileName.endsWith('.md')) continue;

    const candidatePath = path.join(directory, fileName);
    if (path.resolve(candidatePath) === currentPath) continue;

    let text;
    let parsed;
    try {
      text = readHandoffText(candidatePath);
      parsed = parseHandoff(text);
    } catch {
      continue;
    }
    const claimedHere = parsed.frontmatter.status === 'claimed'
      && parsed.frontmatter.claimed_by === sessionId;
    const writtenHere = parsed.frontmatter.status === 'open'
      && parsed.frontmatter.session_id === sessionId;
    if (!claimedHere && !writtenHere) continue;

    try {
      const updated = updateFrontmatter(text, {
        status: 'done',
        completed_at: completedAt,
        superseded_by: path.basename(handoffPath),
      });
      writeHandoffUpdate(candidatePath, updated);
      supersededPaths.push(candidatePath);
    } catch {
      continue;
    }
  }

  return supersededPaths;
}

/**
 * Build the manual claim command for a runtime and handoff path. The wrapper
 * forwards first-launch arguments to the runtime, so a runtime whose seed is not
 * a positional takes its flag or subcommand form.
 *
 * @param {string} runtime - Runtime name the wrapper will launch.
 * @param {string} handoffPath - Handoff note path placed inside the quoted seed.
 * @param {string} [specFolder] - Valid packet folder or the answered skip value.
 * @returns {string} The manual claim command line for that runtime's seed form.
 */
function manualClaimCommand(runtime, handoffPath, specFolder = '') {
  // Interactive Bash expands history inside double quotes, so each bang must sit outside them.
  const escapedPath = handoffPath
    .replace(/[\\"$`]/g, '\\$&')
    .replace(/!/g, "\"'!'\"");
  let specFolderSuffix = '';
  if (specFolder === 'none') {
    specFolderSuffix = ' | Spec folder: none (Gate 3 answered D, Skip, in the sending session)';
  } else if (validSpecFolder(specFolder)) {
    specFolderSuffix = ` | Spec folder: ${specFolder}`
      + ' (carried from the handoff; Gate 3 answered in the sending session)';
  }
  const handoffSeed = `${escapedPath}${specFolderSuffix}`;
  const handoffToken = '@@HANDOFF@@';
  const manualTemplate = process.env.SKILLED_LOOP_MANUAL_TEMPLATE;
  if (typeof manualTemplate === 'string' && manualTemplate.split(handoffToken).length === 2) {
    return manualTemplate.replace(handoffToken, () => handoffSeed);
  }
  const option = Object.hasOwn(RUNTIME_SEED_OPTIONS, runtime)
    ? RUNTIME_SEED_OPTIONS[runtime]
    : '';
  const optionPart = option ? ` ${option}` : '';
  const seed = `"[session-relaunch] claim and continue handoff ${handoffSeed}"`;
  return `skilled-loop ${runtime}${optionPart} ${seed}`;
}

/**
 * Append one sanitized event line for operator-visible relaunch history.
 *
 * @param {string} event - Event name.
 * @param {Object} [fields] - Ordered key/value details.
 * @param {NodeJS.ProcessEnv} [env=process.env] - Runtime environment.
 * @param {Date|number|string} [now] - Clock value for deterministic logs.
 * @returns {string} The line appended to the log.
 */
function appendLog(event, fields = {}, env = process.env, now) {
  if (typeof event !== 'string' || !/^[A-Za-z0-9_-]+$/.test(event)) {
    throw new Error('event must be a simple name');
  }
  const values = Object.entries(fields).map(([key, value]) => {
    const safeKey = key.replace(/[^A-Za-z0-9_.-]/g, '_');
    const safeValue = String(value ?? '').replace(/[\s=]/g, '_');
    return `${safeKey}=${safeValue}`;
  });
  const line = `${toIsoTimestamp(now)} ${event}${values.length ? ` ${values.join(' ')}` : ''}`;
  const directory = ensureStateDir(env);
  const logPath = path.join(directory, 'relaunch.log');
  const fileDescriptor = fs.openSync(logPath, 'a+', 0o600);
  try {
    // A pre-existing log may carry a permissive mode; re-pin it on every append.
    fs.fchmodSync(fileDescriptor, 0o600);
    // A truncated write leaves a partial final line; the next event starts on
    // its own line so readers keep one event per line.
    let separator = '';
    const size = fs.fstatSync(fileDescriptor).size;
    if (size > 0) {
      const lastByte = Buffer.alloc(1);
      fs.readSync(fileDescriptor, lastByte, 0, 1, size - 1);
      if (lastByte[0] !== 0x0a) separator = '\n';
    }
    const text = `${separator}${line}\n`;
    const expectedBytes = Buffer.byteLength(text);
    const writtenBytes = fs.writeSync(fileDescriptor, text);
    // A short write (disk full, file-size limit) truncates the event line while
    // still looking like success; concurrent appenders rule out a retry loop, so
    // the truncation is surfaced instead of silently losing the event.
    if (writtenBytes < expectedBytes) {
      throw new Error(
        `relaunch log short write: wrote ${writtenBytes} of ${expectedBytes} bytes to ${logPath}`,
      );
    }
    fs.fsyncSync(fileDescriptor);
  } finally {
    fs.closeSync(fileDescriptor);
  }
  return line;
}

/**
 * Read a killer lock once and report both facts that decide ownership.
 *
 * Owner and expiry have to come from the same snapshot: a lock unlinked between
 * two separate reads would otherwise report a live owner for a lock that is
 * already gone.
 *
 * The lock only names a pid and a timestamp, so a killer killed with SIGKILL
 * pins the loop whenever its pid is reused by a long-lived process; the
 * recorded expiry bounds that window. Locks written before the expiry field
 * existed are aged out from their creation stamp instead.
 *
 * @param {string} lockPath - Killer lock file path.
 * @param {number} [now=Date.now()] - Clock value in epoch milliseconds.
 * @returns {{ ownerPid: number|null, expired: boolean }} Recorded owner and expiry verdict.
 */
function readLockState(lockPath, now = Date.now()) {
  let lockContents;
  try {
    lockContents = fs.readFileSync(lockPath, 'utf8');
  } catch (error) {
    // A non-file at the lock path records no owner either: a read of a directory
    // fails the same way a missing lock does, and reporting no owner leaves the
    // caller's staleness rule in charge instead of aborting the caller.
    if (error.code === 'ENOENT' || error.code === 'EACCES' || error.code === 'EISDIR') {
      return { ownerPid: null, expired: false };
    }
    throw error;
  }
  const fields = lockContents.trim().split(/\s+/);
  const ownerPid = Number(fields[0]);
  const expiry = Date.parse(fields[2] ?? '');
  let expired = false;
  if (Number.isFinite(expiry)) {
    expired = now >= expiry;
  } else {
    const created = Date.parse(fields[1] ?? '');
    if (Number.isFinite(created)) expired = now >= created + LEGACY_LOCK_MAX_AGE_MS;
  }
  return {
    ownerPid: Number.isSafeInteger(ownerPid) && ownerPid > 0 ? ownerPid : null,
    expired,
  };
}

/**
 * Read the owning pid from a killer lock file.
 *
 * @param {string} lockPath - Killer lock file path.
 * @returns {number|null} The recorded owner pid, or null when unreadable or absent.
 */
function lockOwnerPid(lockPath) {
  return readLockState(lockPath).ownerPid;
}

/**
 * Decide whether a killer lock has outlived the killer that wrote it.
 *
 * @param {string} lockPath - Killer lock file path.
 * @param {number} [now=Date.now()] - Clock value in epoch milliseconds.
 * @returns {boolean} True once the recorded expiry has passed.
 */
function lockIsExpired(lockPath, now = Date.now()) {
  return readLockState(lockPath, now).expired;
}

/**
 * Probe whether a pid still refers to a running process.
 *
 * @param {number|null} pid - Process identifier to probe.
 * @returns {boolean} True while the process exists; EPERM counts as alive.
 */
function isProcessAlive(pid) {
  if (!Number.isSafeInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    if (error.code === 'ESRCH') return false;
    if (error.code === 'EPERM') return true;
    throw error;
  }
}

/**
 * Return the pid of the killer that currently owns this loop's lock.
 * An armed record only suppresses a new killer while a live killer holds the
 * lock, so arm paths re-spawn when the recorded killer has died or the lock has
 * expired.
 *
 * @param {string} loopId - Wrapper process identifier.
 * @param {NodeJS.ProcessEnv} [env=process.env] - Runtime environment.
 * @returns {number|null} The live lock owner's pid, or null when no live killer owns it.
 */
function liveKillerPid(loopId, env = process.env) {
  if (!validLoopId(loopId)) return null;
  const lockPath = path.join(stateDir(env), `killer-${loopId}.lock`);
  const { ownerPid, expired } = readLockState(lockPath);
  if (!isProcessAlive(ownerPid)) return null;
  return expired ? null : ownerPid;
}

/**
 * Snapshot `pid ppid` pairs from the process table.
 *
 * The read is bounded because the stop and session-end hooks wait on it: a hung
 * `ps` must fail into the null path instead of stalling the hook.
 *
 * @returns {string|null} The table text, or null when `ps` is unavailable or exceeds the bound.
 */
function readProcessTable() {
  try {
    const result = spawnSync('ps', ['-A', '-o', 'pid=,ppid='], {
      encoding: 'utf8',
      timeout: 2000,
    });
    if (result.error || result.status !== 0) return null;
    return result.stdout;
  } catch {
    return null;
  }
}

/**
 * Resolve the loop's direct child above a descendant adapter process.
 * The adapter can run below a transient shell, so process.ppid is not a stable
 * kill target.
 *
 * @param {string} loopId - Owning loop pid carried by SKILLED_LOOP_ID.
 * @param {Object} [options] - Dependency seams for tests.
 * @param {number} [options.pid=process.pid] - Descendant pid to climb from.
 * @param {string} [options.processTable] - `pid ppid` pairs; the live table when omitted.
 * @returns {number|null} The ancestor pid whose parent is the loop, or null when unmatched.
 */
function findLoopChildPid(loopId, { pid = process.pid, processTable } = {}) {
  const loopPid = Number(loopId);
  if (!Number.isSafeInteger(loopPid) || loopPid < 1) return null;
  const table = typeof processTable === 'string' ? processTable : readProcessTable();
  if (typeof table !== 'string') return null;

  const parents = new Map();
  for (const line of table.split(/\r?\n/)) {
    const match = line.trim().match(/^(\d+)\s+(\d+)$/);
    if (match) parents.set(Number(match[1]), Number(match[2]));
  }

  let current = Number(pid);
  const visited = new Set();
  while (Number.isSafeInteger(current) && current > 0 && !visited.has(current)) {
    visited.add(current);
    const parent = parents.get(current);
    if (parent === loopPid) return current;
    current = parent;
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  validSpecFolder,
  stateDir,
  ensureStateDir,
  relaunchFilePath,
  parseHandoff,
  validateHandoff,
  preparePending,
  arm,
  unarm,
  readRelaunchFile,
  shouldRelaunch,
  claimHandoff,
  completeHandoff,
  supersedeClaimed,
  manualClaimCommand,
  appendLog,
  readLockState,
  lockOwnerPid,
  lockIsExpired,
  isProcessAlive,
  liveKillerPid,
  readProcessTable,
  findLoopChildPid,
};
