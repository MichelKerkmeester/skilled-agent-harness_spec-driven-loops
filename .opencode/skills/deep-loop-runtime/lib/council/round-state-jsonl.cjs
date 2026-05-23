// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Council Round State JSONL                                                ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function byteLength(value) {
  return Buffer.byteLength(value, 'utf8');
}

function newlineLengthAt(content, index) {
  return content[index] === '\r' && content[index + 1] === '\n' ? 2 : 1;
}

function validPrefixByteLength(content) {
  let cursor = 0;
  let validEnd = 0;

  while (cursor < content.length) {
    const newlineMatch = /\r?\n/g;
    newlineMatch.lastIndex = cursor;
    const match = newlineMatch.exec(content);
    if (!match) break;

    const lineEnd = match.index;
    const rawLine = content.slice(cursor, lineEnd);
    const nextCursor = lineEnd + newlineLengthAt(content, lineEnd);

    if (rawLine.trim() !== '') {
      try {
        JSON.parse(rawLine);
      } catch {
        break;
      }
    }

    validEnd = nextCursor;
    cursor = nextCursor;
  }

  const trailing = content.slice(cursor);
  if (trailing.trim() === '') return byteLength(content);

  try {
    JSON.parse(trailing);
    return byteLength(content);
  } catch {
    return byteLength(content.slice(0, validEnd));
  }
}

function defaultLockPath(statePath) {
  return `${statePath}.lock`;
}

function normalizeRecord(record) {
  if (!isRecord(record)) {
    throw new TypeError('round state record must be an object');
  }
  return record;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Custom error thrown when the council round state lock file is already
 * held by another process or thread.
 *
 * @class
 * @extends Error
 */
class RoundStateLockError extends Error {
  /**
   * Create a RoundStateLockError.
   *
   * @param {string} lockPath - Path to the contended lock file.
   */
  constructor(lockPath) {
    super(`Council round state lock is already held: ${lockPath}`);
    this.name = 'RoundStateLockError';
    this.code = 'ROUND_STATE_LOCK_HELD';
    this.lockPath = lockPath;
  }
}

/**
 * Repair a JSONL state file by truncating trailing partial or invalid
 * lines.
 *
 * Scans lines sequentially and stops at the first line that is not
 * valid JSON. Returns a result indicating whether the file was
 * truncated and how many bytes were dropped.
 *
 * @param {string} statePath - Absolute path to the JSONL state file.
 * @returns {Object} Repair result with repaired (boolean) and
 *   droppedBytes (number).
 */
function repairRoundStateJsonl(statePath) {
  if (!fs.existsSync(statePath)) {
    return { repaired: false, droppedBytes: 0 };
  }

  const content = fs.readFileSync(statePath, 'utf8');
  if (content.length === 0) {
    return { repaired: false, droppedBytes: 0 };
  }

  const originalBytes = byteLength(content);
  const keepBytes = validPrefixByteLength(content);
  const droppedBytes = originalBytes - keepBytes;
  if (droppedBytes <= 0) {
    return { repaired: false, droppedBytes: 0 };
  }

  fs.truncateSync(statePath, keepBytes);
  return { repaired: true, droppedBytes };
}

/**
 * Acquire an exclusive file-system lock for round state operations.
 *
 * Creates the lock file atomically with wx open mode. If the lock
 * already exists (EEXIST), throws a RoundStateLockError. Writes a
 * JSON payload with owner PID, acquisition timestamp, and any
 * caller-supplied metadata into the lock file.
 *
 * @param {string} lockPath - Path to the lock file.
 * @param {Object} [metadata] - Additional metadata to persist in the
 *   lock file.
 * @returns {void}
 * @throws {RoundStateLockError} If the lock is already held.
 * @throws {Error} For any non-EEXIST errors during lock creation.
 */
function acquireRoundStateLock(lockPath, metadata) {
  fs.mkdirSync(path.dirname(lockPath), { recursive: true });
  let fd;
  try {
    fd = fs.openSync(lockPath, 'wx');
    const payload = {
      owner_pid: process.pid,
      acquired_at_iso: new Date().toISOString(),
      ...metadata,
    };
    fs.writeFileSync(fd, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
    fs.fsyncSync(fd);
  } catch (error) {
    if (error && error.code === 'EEXIST') {
      throw new RoundStateLockError(lockPath);
    }
    throw error;
  } finally {
    if (typeof fd === 'number') {
      fs.closeSync(fd);
    }
  }
}

/**
 * Release a previously acquired round state lock by removing the lock
 * file.
 *
 * @param {string} lockPath - Path to the lock file.
 * @returns {void}
 */
function releaseRoundStateLock(lockPath) {
  fs.rmSync(lockPath, { force: true });
}

/**
 * Append a record to a JSONL round state file under an exclusive lock.
 *
 * Optionally repairs the file before appending, writes a line with
 * schema_version, event_id, and written_at_iso metadata followed by
 * the caller's record, and fsyncs the append.
 *
 * @param {string} statePath - Path to the JSONL state file.
 * @param {Object} record - Round state record to append (must be a
 *   plain object).
 * @param {Object} [options] - Append options.
 * @param {string} [options.lockPath] - Custom lock file path (default
 *   derives from statePath).
 * @param {boolean} [options.repair=true] - Whether to repair the file
 *   before appending.
 * @returns {Object} Append result with appended (boolean) and repair
 *   info.
 * @throws {TypeError} If statePath is invalid or record is not an
 *   object.
 * @throws {RoundStateLockError} If the lock cannot be acquired.
 */
function appendRoundStateRecord(statePath, record, options = {}) {
  if (typeof statePath !== 'string' || statePath.trim() === '') {
    throw new TypeError('statePath must be a non-empty string');
  }
  const normalized = normalizeRecord(record);
  const lockPath = options.lockPath || defaultLockPath(statePath);
  const metadata = {
    state_path: statePath,
    round_id: normalized.round_id,
    topic_id: normalized.topic_id,
  };

  fs.mkdirSync(path.dirname(statePath), { recursive: true });
  acquireRoundStateLock(lockPath, metadata);
  try {
    const repair = options.repair === false
      ? { repaired: false, droppedBytes: 0 }
      : repairRoundStateJsonl(statePath);
    const line = `${JSON.stringify({
      schema_version: '1.0',
      event_id: `${Date.now()}-${process.pid}-${Math.random().toString(36).slice(2)}`,
      written_at_iso: new Date().toISOString(),
      ...normalized,
    })}\n`;
    const fd = fs.openSync(statePath, 'a');
    try {
      fs.writeFileSync(fd, line, 'utf8');
      fs.fsyncSync(fd);
    } finally {
      fs.closeSync(fd);
    }
    return { appended: true, repair };
  } finally {
    releaseRoundStateLock(lockPath);
  }
}

/**
 * Read all records from a JSONL round state file.
 *
 * Optionally repairs the file first, then splits on newlines, parses
 * each non-empty line as JSON, and returns the resulting array.
 *
 * @param {string} statePath - Path to the JSONL state file.
 * @param {Object} [options] - Read options.
 * @param {boolean} [options.repair=true] - Whether to repair the file
 *   before reading.
 * @returns {Array<Object>} Parsed round state records (empty array if
 *   the file does not exist).
 */
function readRoundStateRecords(statePath, options = {}) {
  if (!fs.existsSync(statePath)) return [];
  if (options.repair !== false) {
    repairRoundStateJsonl(statePath);
  }
  return fs.readFileSync(statePath, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  RoundStateLockError,
  appendRoundStateRecord,
  readRoundStateRecords,
  repairRoundStateJsonl,
};
