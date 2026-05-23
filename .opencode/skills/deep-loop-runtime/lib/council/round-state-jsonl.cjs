// MODULE: Council Round State JSONL
'use strict';

const fs = require('node:fs');
const path = require('node:path');

class RoundStateLockError extends Error {
  constructor(lockPath) {
    super(`Council round state lock is already held: ${lockPath}`);
    this.name = 'RoundStateLockError';
    this.code = 'ROUND_STATE_LOCK_HELD';
    this.lockPath = lockPath;
  }
}

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

function defaultLockPath(statePath) {
  return `${statePath}.lock`;
}

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

function releaseRoundStateLock(lockPath) {
  fs.rmSync(lockPath, { force: true });
}

function normalizeRecord(record) {
  if (!isRecord(record)) {
    throw new TypeError('round state record must be an object');
  }
  return record;
}

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

module.exports = {
  RoundStateLockError,
  appendRoundStateRecord,
  readRoundStateRecords,
  repairRoundStateJsonl,
};
