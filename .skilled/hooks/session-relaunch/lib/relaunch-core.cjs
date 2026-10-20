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
const { fileURLToPath } = require('node:url');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const STATE_DIRECTORY_NAME = 'skilled-relaunch';
const LEGACY_LOCK_MAX_AGE_MS = 10 * 60 * 1000;
const HANDOFF_SECTIONS = Object.freeze(['Goal', 'Done', 'Remaining work', 'In-flight state']);
const SPEC_FOLDER_PATTERN =
  /^specs\/(?:[A-Za-z0-9._-]+\/)+\d{3}-[a-z0-9]+(?:-[a-z0-9]+)*$/;
const NOTE_STATUSES = Object.freeze(['open', 'claimed', 'done']);
// The runtimes skilled-loop can launch. The CLI refuses any other, so a runtime the wrapper
// gains has to be added here or prepare refuses the loops that run it.
const RUNTIMES = Object.freeze(['claude', 'pi', 'opencode', 'codex', 'cursor', 'hermes', 'devin']);
// preparePending's default, which every reader also assumes for a record without a runtime.
const DEFAULT_RUNTIME = 'claude';
// The stop and session-end hooks and the CLI all wait on a process-table read, so a hung
// `ps` has to fail into each caller's refusal path instead of stalling it.
const PROCESS_TABLE_TIMEOUT_MS = 2000;
const MANUAL_TEMPLATE_TOKEN = '@@HANDOFF@@';
const SPEC_FOLDER_MARKER = ' | Spec folder: ';
const SPEC_FOLDER_SUFFIX = ' (carried from the handoff; Gate 3 answered in the sending session)';
const SPEC_FOLDER_SKIP_SUFFIX = ' (Gate 3 answered D, Skip, in the sending session)';
// Defaults for a record that names no limits; the wrapper reads the same values.
const DEFAULT_MAX_HOPS = 10;
const DEFAULT_MAX_AGE_MIN = 10;
// How each hook runtime reads a payload that names no event. Claude infers it from the
// payload's shape; Hermes takes it as its own event, because its plugin bridge can omit
// the name; Codex refuses it, because every Codex payload names its event.
const MISSING_EVENT_POLICIES = Object.freeze({
  claude: 'infer',
  hermes: 'accept',
  codex: 'refuse',
});
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

/** Build the seed suffix that carries a spec folder, or '' when there is no answer. */
function specFolderSuffix(specFolder) {
  if (specFolder === 'none') return `${SPEC_FOLDER_MARKER}none${SPEC_FOLDER_SKIP_SUFFIX}`;
  if (!validSpecFolder(specFolder)) return '';
  return `${SPEC_FOLDER_MARKER}${specFolder}${SPEC_FOLDER_SUFFIX}`;
}

/** Parse a `pid ppid` process table into a child-to-parent map. */
function parentMapFromTable(table) {
  const parents = new Map();
  for (const line of table.split(/\r?\n/)) {
    const match = line.trim().match(/^(\d+)\s+(\d+)$/);
    if (match) parents.set(Number(match[1]), Number(match[2]));
  }
  return parents;
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
  if (value instanceof Date) return value.getTime();
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
    // The parser trims around the separator, so `status : open` is the same key and
    // must be replaced rather than duplicated, which the next parse would reject.
    // Keys come from this module's own callers and are plain identifiers.
    const keyPattern = new RegExp(`^\\s*${key}\\s*:`);
    const fieldIndex = fields.findIndex((line) => keyPattern.test(line));
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

function nonEmptyString(value) {
  return typeof value === 'string' && value.length > 0;
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
 * Classify a handoff note so every reader applies the same rule to it.
 *
 * @param {string} filePath - Handoff note path.
 * @returns {'missing'|'invalid'|'open'|'claimed'|'done'} The note's state. A note that
 *   exists but cannot be read or parsed, or carries an unknown status, is invalid.
 */
function noteState(filePath) {
  if (!nonEmptyString(filePath)) return 'missing';
  let text;
  try {
    text = fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    return error.code === 'ENOENT' ? 'missing' : 'invalid';
  }
  try {
    const { status } = parseHandoff(text).frontmatter;
    return NOTE_STATUSES.includes(status) ? status : 'invalid';
  } catch {
    return 'invalid';
  }
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
  runtime = DEFAULT_RUNTIME,
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
 * Arm a pending record once the previous runtime has stopped, or re-arm an armed one
 * whose killer has gone, restamping its age and working directory either way.
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
  if (record.status !== 'pending' && record.status !== 'armed') return null;

  // The arm paths reach an armed record only once its killer is gone, and the wrapper
  // ages a record from armedAt. Keeping the first stamp would leave the replacement
  // killer guarding a record the wrapper already declines as stale.
  const armed = { ...record, status: 'armed', armedAt: toIsoTimestamp(now), cwd };
  atomicWriteFile(relaunchFilePath(loopId, env), `${JSON.stringify(armed)}\n`);
  return armed;
}

/**
 * Decide whether an arm path may arm this record for its caller. Every runtime applies
 * the same order: the record must be this loop's, this session's and this runtime's
 * before its state counts, and an armed record is re-armed only once no live killer
 * holds its lock.
 *
 * @param {Object|null} record - Record returned by readRelaunchFile.
 * @param {Object} options - The caller's identity.
 * @param {string} options.loopId - Loop the caller runs under.
 * @param {string} options.sessionId - Session the caller reports.
 * @param {string} [options.runtime] - Runtime the caller arms for; omitted, any runtime matches.
 * @param {NodeJS.ProcessEnv} [options.env=process.env] - Runtime environment.
 * @returns {{armable: boolean, reason: string}} The verdict. An armable record reports
 *   `pending` or `killer-gone`; a refusal reports `no-record`, `other-loop`,
 *   `other-session`, `other-runtime`, `not-armable` or `killer-live`.
 */
function armableRecord(record, { loopId, sessionId, runtime, env = process.env } = {}) {
  const refuse = (reason) => ({ armable: false, reason });
  if (!record || typeof record !== 'object') return refuse('no-record');
  if (record.loopId !== loopId) return refuse('other-loop');
  if (!nonEmptyString(sessionId) || record.sessionId !== sessionId) return refuse('other-session');
  if (runtime !== undefined && (record.runtime ?? DEFAULT_RUNTIME) !== runtime) {
    return refuse('other-runtime');
  }
  if (record.status === 'pending') return { armable: true, reason: 'pending' };
  if (record.status !== 'armed') return refuse('not-armable');
  return liveKillerPid(loopId, env) === null
    ? { armable: true, reason: 'killer-gone' }
    : refuse('killer-live');
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
 * @param {string} [options.expectedArmedAt] - Required current armedAt for the transition.
 * @param {Date|number|string} [options.now] - Clock value for deterministic records.
 * @returns {Object|null} The disarmed record, or null when absent or conditions do not match.
 */
function unarm({
  loopId, env = process.env, reason, expectedStatus, expectedHandoff, expectedArmedAt, now,
}) {
  const record = readRelaunchFile(loopId, env);
  if (record === null) return null;
  if (expectedStatus !== undefined && record.status !== expectedStatus) return null;
  if (expectedHandoff !== undefined && record.handoff !== expectedHandoff) return null;
  if (expectedArmedAt !== undefined && record.armedAt !== expectedArmedAt) return null;
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
function shouldRelaunch(
  record,
  { now = Date.now(), maxHops = DEFAULT_MAX_HOPS, maxAgeMin = DEFAULT_MAX_AGE_MIN } = {},
) {
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
  // A relaunch needs a note to claim and a directory to start in. Declining here keeps
  // the wrapper on its decline path, which preserves the runtime's own exit code.
  if (!nonEmptyString(record.handoff) || !nonEmptyString(record.cwd)) {
    return { relaunch: false, reason: 'incomplete-record' };
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
 * @param {NodeJS.ProcessEnv} [env=process.env] - Environment carrying the wrapper's template.
 * @returns {string} The manual claim command line for that runtime's seed form. A template
 *   manualTemplateProblem rejects falls back to the plain form, so a caller that prints
 *   the command asks that function first and says why the options are missing.
 */
function manualClaimCommand(runtime, handoffPath, specFolder = '', env = process.env) {
  // Interactive Bash expands history inside double quotes, so each bang must sit outside them.
  const escapedPath = handoffPath
    .replace(/[\\"$`]/g, '\\$&')
    .replace(/!/g, "\"'!'\"");
  const suffix = specFolderSuffix(specFolder);
  const handoffSeed = `${escapedPath}${suffix}`;
  const manualTemplate = env?.SKILLED_LOOP_MANUAL_TEMPLATE;
  if (nonEmptyString(manualTemplate) && manualTemplateProblem(env) === null) {
    return manualTemplate.replace(MANUAL_TEMPLATE_TOKEN, () => handoffSeed);
  }
  const option = Object.hasOwn(RUNTIME_SEED_OPTIONS, runtime)
    ? RUNTIME_SEED_OPTIONS[runtime]
    : '';
  const optionPart = option ? ` ${option}` : '';
  const seed = `"[session-relaunch] claim and continue handoff ${handoffSeed}"`;
  return `skilled-loop ${runtime}${optionPart} ${seed}`;
}

/**
 * Report why the wrapper's manual-command template cannot be filled. The template repeats
 * the loop's launch options around one placeholder; with none, or with a second one that
 * a carried option value introduced, the command falls back to the plain form and those
 * options are lost, which a caller must say rather than print the plain form silently.
 *
 * @param {NodeJS.ProcessEnv} [env=process.env] - Environment carrying the template.
 * @returns {string|null} The reason, or null when the template is unset or usable.
 */
function manualTemplateProblem(env = process.env) {
  const template = env?.SKILLED_LOOP_MANUAL_TEMPLATE;
  if (!nonEmptyString(template)) return null;
  const placeholders = template.split(MANUAL_TEMPLATE_TOKEN).length - 1;
  if (placeholders === 1) return null;
  const count = placeholders === 0
    ? `no ${MANUAL_TEMPLATE_TOKEN} placeholder`
    : `${placeholders} ${MANUAL_TEMPLATE_TOKEN} placeholders`;
  return `SKILLED_LOOP_MANUAL_TEMPLATE holds ${count} where the manual command needs exactly one`;
}

/**
 * Resolve the event a hook payload is for, under its runtime's rule for a payload that
 * names none.
 *
 * @param {Object|null} payload - Parsed hook payload.
 * @param {Object} options - Runtime and the event the caller handles.
 * @param {string} options.runtime - Runtime whose rule applies; one without a rule refuses.
 * @param {string} [options.expected] - The one event the caller handles; omitted, any event.
 * @returns {string|null} The event name to handle, or null when the payload is for another event.
 */
function payloadEventName(payload, { runtime, expected } = {}) {
  const matches = (eventName) => (
    expected === undefined || eventName === expected ? eventName : null
  );
  const value = payload?.hook_event_name;
  if (nonEmptyString(value)) return matches(value);
  const policy = Object.hasOwn(MISSING_EVENT_POLICIES, runtime)
    ? MISSING_EVENT_POLICIES[runtime]
    : 'refuse';
  if (policy === 'infer') {
    return matches(typeof payload?.prompt === 'string' ? 'UserPromptSubmit' : 'PostToolUse');
  }
  // Only a payload that leaves the field out names no event; a present empty one is malformed.
  if (policy === 'accept' && payload && value === undefined) return expected ?? null;
  return null;
}

/**
 * Report whether an ES module is the script this process was started with, so a hook
 * entrypoint acts when run and stays inert when imported. Both paths are compared real,
 * because a hook started through a linked directory reports the linked path while Node
 * gives the module its real one.
 *
 * @param {string} moduleUrl - The calling module's `import.meta.url`.
 * @param {string} [scriptPath=process.argv[1]] - Path the process was started with.
 * @returns {boolean} True when both name the same file.
 */
function isEntrypoint(moduleUrl, scriptPath = process.argv[1]) {
  if (!nonEmptyString(scriptPath)) return false;
  try {
    return fs.realpathSync(scriptPath) === fs.realpathSync(fileURLToPath(moduleUrl));
  } catch {
    return false;
  }
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
 * Snapshot `pid ppid` pairs, or `pid ppid comm` rows, from the process table. Every
 * reader goes through here so each one waits on the same bound.
 *
 * @param {Object} [options] - Columns, bound and failure mode.
 * @param {boolean} [options.withCommand=false] - Add each process's command name.
 * @param {number} [options.timeoutMs=PROCESS_TABLE_TIMEOUT_MS] - Longest wait for `ps`.
 * @param {boolean} [options.throwOnFailure=false] - Throw the reason instead of returning null,
 *   for a caller that reports why it refused.
 * @returns {string|null} The table text, or null when `ps` fails or exceeds the bound.
 * @throws {Error} When the read fails and throwOnFailure is set.
 */
function readProcessTable({
  withCommand = false,
  timeoutMs = PROCESS_TABLE_TIMEOUT_MS,
  throwOnFailure = false,
} = {}) {
  let failure;
  try {
    const result = spawnSync('ps', ['-A', '-o', withCommand ? 'pid=,ppid=,comm=' : 'pid=,ppid='], {
      encoding: 'utf8',
      timeout: timeoutMs,
    });
    if (result.error) failure = result.error.message;
    else if (result.status !== 0) {
      failure = String(result.stderr || '').trim() || `ps exited ${result.status}`;
    } else {
      return result.stdout;
    }
  } catch (error) {
    failure = error.message;
  }
  if (throwOnFailure) throw new Error(failure);
  return null;
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

  const parents = parentMapFromTable(table);

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

/**
 * Choose the pid the killer will signal for this loop. A runtime that names its own
 * pid keeps it only while that pid descends from the loop, because the killer refuses
 * anything else; otherwise the walk from the calling process finds the loop's direct
 * child, which is the runtime the loop started.
 *
 * @param {string} loopId - Owning loop pid carried by SKILLED_LOOP_ID.
 * @param {Object} [options] - Preferred target and dependency seams for tests.
 * @param {number|string} [options.preferredPid] - Pid the runtime reports for itself.
 * @param {number} [options.pid=process.pid] - Descendant pid to climb from.
 * @param {string} [options.processTable] - `pid ppid` pairs; the live table when omitted.
 * @returns {number|null} The pid to signal, or null when no process below the loop is found.
 */
function resolveKillerTarget(loopId, { preferredPid, pid = process.pid, processTable } = {}) {
  const loopPid = Number(loopId);
  if (!Number.isSafeInteger(loopPid) || loopPid < 1) return null;
  const table = typeof processTable === 'string' ? processTable : readProcessTable();
  if (typeof table !== 'string') return null;

  const preferred = Number(preferredPid);
  if (
    preferredPid !== undefined
    && preferredPid !== null
    && preferredPid !== ''
    && Number.isSafeInteger(preferred)
    && preferred > 0
    && preferred !== loopPid
    && findLoopChildPid(loopId, { pid: preferred, processTable: table }) !== null
  ) {
    return preferred;
  }
  return findLoopChildPid(loopId, { pid, processTable: table });
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  HANDOFF_SECTIONS,
  RUNTIMES,
  PROCESS_TABLE_TIMEOUT_MS,
  DEFAULT_MAX_HOPS,
  DEFAULT_MAX_AGE_MIN,
  SPEC_FOLDER_MARKER,
  SPEC_FOLDER_SUFFIX,
  SPEC_FOLDER_SKIP_SUFFIX,
  validSpecFolder,
  specFolderSuffix,
  parentMapFromTable,
  stateDir,
  ensureStateDir,
  relaunchFilePath,
  parseHandoff,
  validateHandoff,
  noteState,
  preparePending,
  arm,
  armableRecord,
  unarm,
  readRelaunchFile,
  shouldRelaunch,
  claimHandoff,
  completeHandoff,
  supersedeClaimed,
  manualClaimCommand,
  manualTemplateProblem,
  payloadEventName,
  isEntrypoint,
  appendLog,
  readLockState,
  lockOwnerPid,
  lockIsExpired,
  isProcessAlive,
  liveKillerPid,
  readProcessTable,
  findLoopChildPid,
  resolveKillerTarget,
};
