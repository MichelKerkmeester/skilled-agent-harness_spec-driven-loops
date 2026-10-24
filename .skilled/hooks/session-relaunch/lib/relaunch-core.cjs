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
const { createHash, randomUUID } = require('node:crypto');
const { spawnSync } = require('node:child_process');
const { fileURLToPath } = require('node:url');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const STATE_DIRECTORY_NAME = 'skilled-relaunch';
const LEGACY_LOCK_MAX_AGE_MS = 10 * 60 * 1000;
// How long an appender waits for another one, and when a lock left behind by a killed
// appender may be reclaimed. The wait is short because history logging must never
// stall a hook.
const APPEND_LOCK_WAIT_MS = 2000;
const APPEND_LOCK_STALE_MS = 10000;
const APPEND_LOCK_SLEEP_CELL = new Int32Array(new SharedArrayBuffer(4));
const HANDOFF_SECTIONS = Object.freeze(['Goal', 'Done', 'Remaining work', 'In-flight state']);
const SPEC_FOLDER_PATTERN =
  /^specs\/(?:[A-Za-z0-9._-]+\/)+\d{3}-[a-z0-9]+(?:-[a-z0-9]+)*$/;
const NOTE_STATUSES = Object.freeze(['open', 'claimed', 'done']);
// The runtimes skilled-loop can launch. The CLI refuses any other, so a runtime the wrapper
// gains has to be added here or prepare refuses the loops that run it.
const RUNTIMES = Object.freeze(['claude', 'pi', 'opencode', 'codex', 'cursor', 'hermes', 'devin']);
// A record disarmed for either reason means the operator kept the session going after its
// hand-over was prepared, so the note it names stopped matching the work.
const WITHDRAWN_DISARM_REASONS = new Set(['cancelled', 'user-message']);
// preparePending's default, which every reader also assumes for a record without a runtime.
const DEFAULT_RUNTIME = 'claude';
// The stop and session-end hooks and the CLI all wait on a process-table read, so a hung
// `ps` has to fail into each caller's refusal path instead of stalling it.
const PROCESS_TABLE_TIMEOUT_MS = 2000;
const MANUAL_TEMPLATE_TOKEN = '@@HANDOFF@@';
const SPEC_FOLDER_MARKER = ' | Spec folder: ';
const SPEC_FOLDER_SUFFIX = ' (carried from the handoff; Gate 3 answered in the sending session)';
const SPEC_FOLDER_SKIP_SUFFIX = ' (Gate 3 answered D, Skip, in the sending session)';
const GOAL_FILENAME = 'goal.md';
// Runtimes whose goal record names the packet the session is bound to; the lookup differs
// only in how the record is keyed.
const GOAL_RECORD_RUNTIMES = Object.freeze(['opencode', 'pi', 'devin', 'cursor', 'hermes']);
// The packet a Claude goal names is read from a bounded tail of the session log, so a long
// session costs the same as a short one.
const GOAL_LOG_TAIL_BYTES = 262144;
const GOAL_LOG_MAX_TAIL_BYTES = 16 * 1024 * 1024;
const GOAL_LOG_PACKET_PATTERN = /specs\/(?:[A-Za-z0-9._-]+\/)+\d{3}-[a-z0-9]+(?:-[a-z0-9]+)*/g;
const GOAL_LOG_MAX_CANDIDATES = 8;
const GOAL_SWITCH_OFF_VALUES = Object.freeze(['0', 'false', 'off', 'no']);
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

function insideDirectory(parent, child) {
  const relative = path.relative(parent, child);
  return relative !== ''
    && relative !== '..'
    && !relative.startsWith(`..${path.sep}`)
    && !path.isAbsolute(relative);
}

/**
 * Say why a goal packet cannot be carried to the next session, or null when it can. The
 * packet is shaped like a spec folder, and it must be a real directory whose goal.md is a
 * real file, both inside one of the roots once links are followed, so a link out of the
 * repository never reaches the receiver.
 *
 * @param {string} goalPacket - Repo-relative packet directory taken from a note or a record.
 * @param {string[]} roots - Absolute checkouts the packet may live in.
 * @returns {string|null} The reason the packet is refused, or null when it is usable.
 */
function goalPacketProblem(goalPacket, roots) {
  if (!validSpecFolder(goalPacket)) {
    return 'goal_packet must be the repo-relative packet path, or empty';
  }
  let reason = `goal_packet ${goalPacket} holds no ${GOAL_FILENAME} in this repository`;
  for (const root of roots) {
    try {
      const realRoot = fs.realpathSync(root);
      const realPacket = fs.realpathSync(path.join(root, goalPacket));
      const realGoal = fs.realpathSync(path.join(realPacket, GOAL_FILENAME));
      if (!insideDirectory(realRoot, realPacket) || !insideDirectory(realRoot, realGoal)) {
        reason = `goal_packet ${goalPacket} resolves outside the repository`;
      } else if (fs.statSync(realPacket).isDirectory() && fs.statSync(realGoal).isFile()) {
        return null;
      }
    } catch {
      // A missing path is a packet without a goal.md, which the reason already says.
    }
  }
  return reason;
}

/**
 * Read the goal switch. On unless the operator turned it off, so a hand-over carries the
 * sender's goal without any setup.
 *
 * @param {Object<string, string|undefined>} switches - Environment merged over the flags file.
 * @returns {boolean} False only when SESSION_RELAUNCH_GOAL is an off value.
 */
function goalSwitchOn(switches) {
  const value = String(switches?.SESSION_RELAUNCH_GOAL ?? '').trim().toLowerCase();
  return !GOAL_SWITCH_OFF_VALUES.includes(value);
}

// A spec folder and the packets above it, nearest first: a child packet rarely holds the
// goal.md that its parent packet does.
function packetLineage(specFolder) {
  const lineage = [];
  let current = specFolder;
  while (validSpecFolder(current)) {
    lineage.push(current);
    current = path.posix.dirname(current);
  }
  return lineage;
}

function firstUsablePacket(candidates, roots, accepts = () => true) {
  return candidates.find((candidate) => (
    goalPacketProblem(candidate, roots) === null && accepts(candidate)
  )) ?? '';
}

// The goal record a runtime keeps for one session. OpenCode keys its record by the session
// digest alone; the runtime-neutral core scopes it by workspace, runtime and session.
function goalRecordFor(runtime, sessionId, workspace) {
  const goalCore = require('../../goal/lib/goal-core.cjs');
  if (runtime !== 'opencode') {
    return goalCore.readGoalRecord({ scope: { workspace, runtime, sessionId } });
  }
  const digest = createHash('sha256').update(sessionId, 'utf8').digest('hex');
  const recordPath = path.join(goalCore.resolveStateDir({ workspace }), `${digest}.json`);
  return JSON.parse(fs.readFileSync(recordPath, 'utf8'));
}

function readLogTail(filePath, byteCount) {
  const fileDescriptor = fs.openSync(filePath, 'r');
  try {
    const size = fs.fstatSync(fileDescriptor).size;
    const start = Math.max(0, size - byteCount);
    const buffer = Buffer.alloc(size - start);
    const bytesRead = fs.readSync(fileDescriptor, buffer, 0, buffer.length, start);
    return { text: buffer.subarray(0, bytesRead).toString('utf8'), whole: start === 0 };
  } finally {
    fs.closeSync(fileDescriptor);
  }
}

// What the goal log last said about the session's goal. A goal ends when its status entry
// reports it met or failed, and a `/goal clear` command ends it too.
function goalLogEntry(entry) {
  if (entry?.attachment?.type === 'goal_status') {
    const status = entry.attachment;
    return {
      active: status.met === false && !status.failed,
      condition: typeof status.condition === 'string' ? status.condition : '',
    };
  }
  if (entry?.type === 'system' && entry.subtype === 'local_command'
    && /<command-name>\/goal<\/command-name>[\s\S]*<command-args>\s*clear\s*<\/command-args>/
      .test(String(entry.content ?? ''))) {
    return { active: false, condition: '' };
  }
  return null;
}

// The newest goal entry of one Claude session log, widening the tail while the read starts
// mid-file and holds none. Null when the log has none.
function latestGoalLogEntry(logPath) {
  let byteCount = GOAL_LOG_TAIL_BYTES;
  for (;;) {
    const tail = readLogTail(logPath, byteCount);
    const lines = tail.text.split(/\r?\n/);
    // A tail that starts mid-file begins inside a line, which cannot be parsed.
    if (!tail.whole) lines.shift();
    let latest = null;
    for (const line of lines) {
      if (!line.includes('goal')) continue;
      let entry;
      try {
        entry = JSON.parse(line);
      } catch {
        continue;
      }
      latest = goalLogEntry(entry) ?? latest;
    }
    if (latest !== null || tail.whole || byteCount >= GOAL_LOG_MAX_TAIL_BYTES) return latest;
    byteCount = Math.min(byteCount * 4, GOAL_LOG_MAX_TAIL_BYTES);
  }
}

// Session logs sit under a per-project folder named from the working directory, which the
// CLI cannot rebuild exactly, so the folders are searched for the session's own log.
function claudeSessionLogPath(sessionId, env) {
  if (!/^[A-Za-z0-9._-]+$/.test(sessionId)) return null;
  const configDirectory = env?.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');
  const projectsDirectory = path.join(configDirectory, 'projects');
  for (const project of fs.readdirSync(projectsDirectory)) {
    const candidate = path.join(projectsDirectory, project, `${sessionId}.jsonl`);
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

function claudeGoalPacket({ sessionId, specFolder, roots, env }) {
  const lineage = packetLineage(specFolder);
  let logPath = null;
  try {
    logPath = claudeSessionLogPath(sessionId, env);
  } catch {
    // An unreadable projects folder reads like a missing log.
  }
  // No log to read means nothing contradicts the packet the note names, so it stands.
  if (logPath === null) return firstUsablePacket(lineage, roots);
  let latest;
  try {
    latest = latestGoalLogEntry(logPath);
  } catch {
    return firstUsablePacket(lineage, roots);
  }
  if (latest === null || !latest.active) return '';
  const headline = latest.condition.split(/\r?\n/).find((line) => line.trim() !== '') ?? '';
  const named = [...new Set(latest.condition.match(GOAL_LOG_PACKET_PATTERN) ?? [])];
  const candidates = [...lineage, ...named].slice(0, GOAL_LOG_MAX_CANDIDATES);
  // The log keeps the goal's text, not its packet, so a packet is the sender's only when its
  // goal.md carries the text's opening line.
  return firstUsablePacket(candidates, roots, (candidate) => {
    for (const root of roots) {
      try {
        const goalText = fs.readFileSync(path.join(root, candidate, GOAL_FILENAME), 'utf8');
        if (headline !== '' && goalText.includes(headline)) return true;
      } catch {
        // The next root may hold the file.
      }
    }
    return false;
  });
}

function recordedGoalPacket({ runtime, sessionId, roots }) {
  for (const root of roots) {
    let record = null;
    try {
      record = goalRecordFor(runtime, sessionId, root);
    } catch {
      // A record that cannot be read is a goal that cannot be proven.
    }
    const packet = record?.status === 'active' && typeof record.packetPath === 'string'
      ? record.packetPath
      : '';
    if (packet !== '' && goalPacketProblem(packet, roots) === null) return packet;
  }
  return '';
}

/**
 * Find the packet the sending session's goal is bound to, or '' when it had none. Every
 * reader fails closed: a log or record that cannot be read leaves the answer empty, so a
 * hand-over never fails for want of a goal.
 *
 * @param {Object} options - The session to resolve.
 * @param {string} options.runtime - Runtime that owns the session.
 * @param {string} options.sessionId - The session's identifier.
 * @param {string} [options.specFolder] - The note's spec folder, the only signal Codex gives.
 * @param {string[]} options.roots - Absolute checkouts the packet may live in.
 * @param {NodeJS.ProcessEnv} [options.env=process.env] - Environment carrying the log location.
 * @returns {string} A repo-relative packet directory holding goal.md, or ''.
 */
function resolveGoalPacket({
  runtime, sessionId, specFolder = '', roots = [], env = process.env,
} = {}) {
  try {
    if (!nonEmptyString(sessionId) || roots.length === 0) return '';
    if (GOAL_RECORD_RUNTIMES.includes(runtime)) {
      return recordedGoalPacket({ runtime, sessionId, roots });
    }
    if (runtime === 'claude') return claudeGoalPacket({ sessionId, specFolder, roots, env });
    if (runtime === 'codex') return firstUsablePacket(packetLineage(specFolder), roots);
  } catch {
    // Resolution is a convenience for the receiver, never a reason to refuse a hand-over.
  }
  return '';
}

/**
 * Write the sender's goal packet into an open note, replacing nothing it already carries.
 *
 * @param {string} filePath - Handoff note path.
 * @param {string} goalPacket - A packet goalPacketProblem accepted.
 * @returns {boolean} True when the field was written, false when the note already held one.
 */
function recordGoalPacket(filePath, goalPacket) {
  return withAppendLock(filePath, () => {
    const text = readHandoffText(filePath);
    if (nonEmptyString(parseHandoff(text).frontmatter.goal_packet)) return false;
    writeHandoffUpdate(filePath, updateFrontmatter(text, { goal_packet: goalPacket }));
    return true;
  });
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
  // The write shares the lock every other record writer takes, so it cannot land between a
  // writer's read and its write and be overwritten by that writer's older copy.
  const filePath = relaunchFilePath(loopId, env);
  withAppendLock(filePath, () => atomicWriteFile(filePath, `${JSON.stringify(record)}\n`));
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
  return withAppendLock(relaunchFilePath(loopId, env), () => armLocked({ loopId, cwd, env, now }));
}

function armLocked({ loopId, cwd, env, now }) {
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
  // killer guarding a record the wrapper already declines as stale. An arm that lands
  // in the same millisecond as the record it replaces keeps the same armedAt, so each
  // arm also carries an identity a killer can compare against the one it watched.
  const armed = {
    ...record,
    status: 'armed',
    armedAt: toIsoTimestamp(now),
    armId: randomUUID(),
    cwd,
  };
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
 * @param {string} [options.expectedArmId] - Required current armId for the transition.
 * @param {Date|number|string} [options.now] - Clock value for deterministic records.
 * @returns {Object|null} The disarmed record, or null when absent or conditions do not match.
 */
function unarm(options) {
  const { loopId, env = process.env } = options;
  return withAppendLock(relaunchFilePath(loopId, env), () => unarmLocked(options));
}

function unarmLocked({
  loopId,
  env = process.env,
  reason,
  expectedStatus,
  expectedHandoff,
  expectedArmedAt,
  expectedArmId,
  now,
}) {
  const record = readRelaunchFile(loopId, env);
  if (record === null) return null;
  if (expectedStatus !== undefined && record.status !== expectedStatus) return null;
  if (expectedHandoff !== undefined && record.handoff !== expectedHandoff) return null;
  if (expectedArmedAt !== undefined && record.armedAt !== expectedArmedAt) return null;
  if (expectedArmId !== undefined && record.armId !== expectedArmId) return null;
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
 * Mark a pending record whose Stop was deferred, so a prompt the operator sends while it
 * waits can tell it apart from a hand-over the session prepared moments ago.
 *
 * @param {Object} options - Loop state transition inputs.
 * @param {string} options.loopId - Wrapper process identifier.
 * @param {NodeJS.ProcessEnv} [options.env=process.env] - Runtime environment.
 * @param {Date|number|string} [options.now] - Clock value for deterministic records.
 * @returns {Object|null} The marked record, or null when no pending record exists.
 */
function markDeferred({ loopId, env = process.env, now }) {
  return withAppendLock(relaunchFilePath(loopId, env), () => {
    const record = readRelaunchFile(loopId, env);
    if (record?.status !== 'pending') return null;
    const deferred = { ...record, deferredAt: toIsoTimestamp(now) };
    atomicWriteFile(relaunchFilePath(loopId, env), `${JSON.stringify(deferred)}\n`);
    return deferred;
  });
}

/**
 * Disarm a record when `accept` approves what is on disk. The read, the verdict and the
 * disarm share one lock, so a Stop cannot arm the record between the verdict and the write.
 * Callers do not use this directly: `withdraw.cjs` wraps it with the follow-ups every
 * withdrawal owes the session, and the guarded `unarm` stays for transitions that are not
 * the session calling its hand-over off.
 *
 * @param {Object} options - Loop state transition inputs.
 * @param {string} options.loopId - Wrapper process identifier.
 * @param {string} options.reason - Why the record was disarmed.
 * @param {(record: Object) => boolean} options.accept - Verdict on the record found.
 * @param {NodeJS.ProcessEnv} [options.env=process.env] - Runtime environment.
 * @param {Date|number|string} [options.now] - Clock value for deterministic records.
 * @returns {Object|null} The disarmed record, or null when none exists or `accept` refused it.
 */
function withdrawRecord({ loopId, reason, accept, env = process.env, now }) {
  // The disarm runs through the unlocked helper because the mkdir lock is not reentrant.
  return withAppendLock(relaunchFilePath(loopId, env), () => {
    const record = readRelaunchFile(loopId, env);
    if (!record || typeof record !== 'object' || !accept(record)) return null;
    return unarmLocked({ loopId, env, reason, now });
  });
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
 * @returns {{relaunch: true}|{relaunch: false, reason: string}} Decision. A refusal reports
 *   `no-file`, `not-armed`, `withdrawn` (the session called the hand-over off), `stale`,
 *   `hop-cap` or `incomplete-record`.
 */
function shouldRelaunch(
  record,
  { now = Date.now(), maxHops = DEFAULT_MAX_HOPS, maxAgeMin = DEFAULT_MAX_AGE_MIN } = {},
) {
  if (!record || typeof record !== 'object') return { relaunch: false, reason: 'no-file' };
  if (record.status !== 'armed') {
    // A hand-over the session itself called off leaves nothing to claim, so the wrapper
    // must not offer the note as a manual claim the way it does for other unarmed records.
    const calledOff = record.status === 'disarmed'
      && WITHDRAWN_DISARM_REASONS.has(record.disarmReason);
    return { relaunch: false, reason: calledOff ? 'withdrawn' : 'not-armed' };
  }

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
  // The status check and the write share one lock, so two sessions claiming one note
  // cannot both read it open; the second sees `claimed` and throws.
  return withAppendLock(filePath, () => {
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
  });
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
  return withAppendLock(filePath, () => {
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
  });
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

    // A claim runs under the note's lock, so the read and the rewrite share it: a note read
    // open here and claimed before the write would otherwise be overwritten as done. One
    // candidate at a time keeps the locks from nesting.
    const superseded = withAppendLock(candidatePath, () => {
      let text;
      let parsed;
      try {
        text = readHandoffText(candidatePath);
        parsed = parseHandoff(text);
      } catch {
        return false;
      }
      const claimedHere = parsed.frontmatter.status === 'claimed'
        && parsed.frontmatter.claimed_by === sessionId;
      const writtenHere = parsed.frontmatter.status === 'open'
        && parsed.frontmatter.session_id === sessionId;
      if (!claimedHere && !writtenHere) return false;

      try {
        const updated = updateFrontmatter(text, {
          status: 'done',
          completed_at: completedAt,
          superseded_by: path.basename(handoffPath),
        });
        writeHandoffUpdate(candidatePath, updated);
        return true;
      } catch {
        return false;
      }
    });
    if (superseded) supersededPaths.push(candidatePath);
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
 * Run `fn` while holding the mkdir lock beside a file: the log's append lock, and the
 * lock that serializes a read-then-write on a relaunch record or a handoff note. The
 * lock is not reentrant, so `fn` must not take the same file's lock again.
 *
 * Every lock failure falls through to running `fn` without the lock: history logging
 * and state writes must never block or fail a hook.
 *
 * @template T
 * @param {string} logPath - Path of the file whose lock is taken.
 * @param {() => T} fn - Work to run under the lock.
 * @returns {T} Whatever `fn` returns.
 */
function withAppendLock(logPath, fn) {
  const lockPath = `${logPath}.lock`;
  const deadline = Date.now() + APPEND_LOCK_WAIT_MS;
  let held = false;
  // Every retry path re-checks the deadline here, so a lock that keeps going stale or
  // vanishing cannot hold an appender past the wait bound.
  while (!held && Date.now() < deadline) {
    try {
      fs.mkdirSync(lockPath, 0o700);
      held = true;
    } catch (error) {
      if (error.code !== 'EEXIST') break;
      try {
        const ageMs = Date.now() - fs.statSync(lockPath).mtimeMs;
        if (ageMs > APPEND_LOCK_STALE_MS) {
          try {
            fs.rmdirSync(lockPath);
          } catch (removeError) {
            if (removeError.code !== 'ENOENT') break;
          }
          continue;
        }
      } catch (statError) {
        if (statError.code === 'ENOENT') continue;
        break;
      }
      Atomics.wait(APPEND_LOCK_SLEEP_CELL, 0, 0, 2);
    }
  }
  try {
    return fn();
  } finally {
    if (held) {
      try {
        fs.rmdirSync(lockPath);
      } catch {
        // A lock already removed is not this appender's problem.
      }
    }
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
  withAppendLock(logPath, () => {
    const fileDescriptor = fs.openSync(logPath, 'a+', 0o600);
    try {
      // A pre-existing log may carry a permissive mode; re-pin it on every append.
      fs.fchmodSync(fileDescriptor, 0o600);
      // A truncated write leaves a partial final line; the next event starts on
      // its own line so readers keep one event per line. The peek and the write
      // share one lock, because a concurrent appender's write can show a size
      // that ends mid-line.
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
  });
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

/**
 * Parse `pid ppid` or `pid ppid comm` rows into a pid-keyed map. The command
 * column is what separates a shell from the runtime above it, and a command
 * name may contain spaces, so the row is split on its first two numeric fields
 * only.
 *
 * @param {string} table - Process table text.
 * @returns {Map<number, { ppid: number, comm: string }>} Rows keyed by pid.
 */
function processRowsFromTable(table) {
  const rows = new Map();
  for (const line of table.split(/\r?\n/)) {
    const match = line.trim().match(/^(\d+)\s+(\d+)(?:\s+(.*))?$/);
    if (match) {
      rows.set(Number(match[1]), {
        ppid: Number(match[2]),
        comm: typeof match[3] === 'string' ? match[3].trim() : '',
      });
    }
  }
  return rows;
}

// A runtime reaches its session through whatever shell started it, so these are
// the process names that are transparent when the runtime above is located.
const SHELL_NAMES = new Set(['sh', 'bash', 'zsh', 'dash', 'ksh', 'fish', 'tcsh', 'csh']);

/**
 * Report whether a command column names a shell. A login shell is reported as
 * `-/bin/zsh` or `-zsh`, where a leading dash marks the login variant instead
 * of belonging to the path.
 *
 * @param {string} comm - Command column from a process-table row.
 * @returns {boolean} True when the command is a shell.
 */
function isShellCommand(comm) {
  if (typeof comm !== 'string' || comm.length === 0) return false;
  const withoutLoginMark = comm.startsWith('-') ? comm.slice(1) : comm;
  const programName = path.basename(withoutLoginMark);
  return SHELL_NAMES.has(programName.startsWith('-') ? programName.slice(1) : programName);
}

/**
 * Resolve the runtime that hosts this process by skipping the shells above it.
 * A runtime started from a tool shell sits below that shell, so process.ppid
 * names the shell rather than the runtime that owns the session; the nearest
 * non-shell ancestor is the host the loop variables belong to.
 *
 * @param {Object} [options] - Dependency seams for tests.
 * @param {number} [options.pid=process.pid] - Descendant pid to climb from.
 * @param {string} [options.processTable] - `pid ppid comm` rows; the live table when omitted.
 * @returns {number|null} The nearest non-shell ancestor, or null at the end of the chain.
 */
function hostRuntimePid({ pid = process.pid, processTable } = {}) {
  const table = typeof processTable === 'string'
    ? processTable
    : readProcessTable({ withCommand: true });
  if (typeof table !== 'string') return null;

  const rows = processRowsFromTable(table);

  let current = Number(pid);
  const visited = new Set();
  while (Number.isSafeInteger(current) && current > 0 && !visited.has(current)) {
    visited.add(current);
    const row = rows.get(current);
    // A row the table does not carry ends the chain: the processes above it are
    // unreadable, and an unreadable ancestor cannot be proven to be the runtime.
    if (!row) return null;
    const parent = row.ppid;
    if (!Number.isSafeInteger(parent) || parent < 1) return null;
    const parentRow = rows.get(parent);
    if (!parentRow) return null;
    if (!isShellCommand(parentRow.comm)) return parent;
    current = parent;
  }
  return null;
}

/**
 * Report whether this runtime was started from inside the session the loop id
 * names. A runtime started from the loop's own tool shell inherits the loop
 * variables through the outer runtime, so dropping them needs positive proof of
 * that depth: only a walk that meets the loop pid with two or more processes in
 * between marks the run as nested.
 *
 * @param {string} loopId - Owning loop pid carried by SKILLED_LOOP_ID.
 * @param {Object} [options] - Host pid and dependency seams for tests.
 * @param {number} [options.hostPid] - Runtime pid to walk up from.
 * @param {string} [options.processTable] - `pid ppid` pairs; the live table when omitted.
 * @returns {boolean} True only when the loop pid is reached with two or more processes between.
 */
function nestedUnderLoop(loopId, { hostPid, processTable } = {}) {
  const loopPid = Number(loopId);
  if (!Number.isSafeInteger(loopPid) || loopPid < 1) return false;
  const startPid = Number(hostPid);
  if (!Number.isSafeInteger(startPid) || startPid < 1 || startPid === loopPid) return false;

  const table = typeof processTable === 'string' ? processTable : readProcessTable();
  if (typeof table !== 'string') return false;

  const rows = processRowsFromTable(table);

  let current = startPid;
  let between = 0;
  const visited = new Set();
  while (!visited.has(current)) {
    visited.add(current);
    const row = rows.get(current);
    if (!row) return false;
    const parent = row.ppid;
    if (!Number.isSafeInteger(parent) || parent < 1) return false;
    if (parent === loopPid) return between >= 2;
    between += 1;
    current = parent;
  }
  return false;
}

/**
 * Drop the inherited loop variables when this runtime runs inside the loop they
 * name. Every nested run carries the outer loop's id, so leaving it in place
 * would let the inner runtime treat this session as the loop's own runtime and
 * arm a relaunch against the outer loop's record. An unknown or unrelated loop
 * pid keeps today's behavior, because dropping the variables there would turn a
 * real loop child into an unguarded session. Only a loop id that is a pid can
 * name an ancestor, so any other value skips the read.
 *
 * @param {NodeJS.ProcessEnv} env - Environment to strip; mutated in place. Every
 *   `SKILLED_LOOP_` key goes, because the outer loop's manual template, model, name and
 *   provider would otherwise make the nested runtime print the outer loop's command.
 * @param {Object} [options] - Host pid and dependency seams for tests.
 * @param {number} [options.hostPid] - Runtime pid to compare against; resolved from pid when omitted.
 * @param {number} [options.pid=process.pid] - Descendant pid to resolve the host from.
 * @param {string} [options.processTable] - `pid ppid comm` rows; the live table when omitted.
 * @returns {boolean} True when the inherited loop variables were dropped.
 */
function dropNestedLoop(env, { hostPid, pid = process.pid, processTable } = {}) {
  try {
    if (!nonEmptyString(env?.SKILLED_LOOP_ID)) return false;
    const loopPid = Number(env.SKILLED_LOOP_ID);
    if (!Number.isSafeInteger(loopPid) || loopPid < 1) return false;

    const table = typeof processTable === 'string'
      ? processTable
      : readProcessTable({ withCommand: true });
    const resolvedHostPid = hostPid === undefined || hostPid === null
      ? hostRuntimePid({ pid, processTable: table })
      : hostPid;
    const nested = nestedUnderLoop(env.SKILLED_LOOP_ID, {
      hostPid: resolvedHostPid,
      processTable: table,
    });
    if (!nested) return false;

    try {
      appendLog('loop-nested-run', { loopId: env.SKILLED_LOOP_ID, hostPid: resolvedHostPid }, env);
    } catch {
      // A log that cannot be written must not keep the inherited loop alive.
    }

    for (const key of Object.keys(env)) {
      if (key.startsWith('SKILLED_LOOP_')) delete env[key];
    }
    return true;
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  HANDOFF_SECTIONS,
  RUNTIMES,
  WITHDRAWN_DISARM_REASONS,
  PROCESS_TABLE_TIMEOUT_MS,
  DEFAULT_MAX_HOPS,
  DEFAULT_MAX_AGE_MIN,
  SPEC_FOLDER_MARKER,
  SPEC_FOLDER_SUFFIX,
  SPEC_FOLDER_SKIP_SUFFIX,
  validSpecFolder,
  specFolderSuffix,
  goalPacketProblem,
  goalSwitchOn,
  resolveGoalPacket,
  recordGoalPacket,
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
  markDeferred,
  withdrawRecord,
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
  withAppendLock,
  readLockState,
  lockOwnerPid,
  lockIsExpired,
  isProcessAlive,
  liveKillerPid,
  readProcessTable,
  findLoopChildPid,
  resolveKillerTarget,
  hostRuntimePid,
  nestedUnderLoop,
  dropNestedLoop,
};
