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

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const STATE_DIRECTORY_NAME = 'skilled-relaunch';
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

function writeHandoffUpdate(filePath, text) {
  const mode = fs.statSync(filePath).mode & 0o777;
  atomicWriteFile(filePath, text, mode);
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
 * @param {NodeJS.ProcessEnv} [env=process.env] - Runtime environment overrides.
 * @returns {string} The private relaunch state directory path.
 */
function stateDir(env = process.env) {
  return path.join(env?.XDG_RUNTIME_DIR || os.tmpdir(), STATE_DIRECTORY_NAME);
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
  if (
    !Number.isFinite(nowMs)
    || !Number.isFinite(armedAtMs)
    || !Number.isFinite(ageLimitMs)
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
 * Complete this session's claimed notes when a new handoff carries the work forward.
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
    if (
      parsed.frontmatter.status !== 'claimed'
      || parsed.frontmatter.claimed_by !== sessionId
    ) continue;

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
    specFolderSuffix = ' | Spec folder: none (Gate 3 answered D) Skip in the sending session)';
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
  let previous = '';
  try {
    previous = fs.readFileSync(logPath, 'utf8');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  const separator = previous && !previous.endsWith('\n') ? '\n' : '';
  atomicWriteFile(logPath, `${previous}${separator}${line}\n`);
  return line;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  validSpecFolder,
  stateDir,
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
};
