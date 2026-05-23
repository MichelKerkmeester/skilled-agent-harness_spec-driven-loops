// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ lib/audit-trail                                                          ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ JSONL state event normalization and artifact_written audit emission      ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const SCHEMA_VERSION = '1.2';
const PROTOCOL = 'ai-council';
const PRODUCER_VERSION = 'persist-artifacts@1.2.0';
const DEFAULT_MAX_BYTES = 10 * 1024 * 1024;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compute a stable SHA-256 checksum for audit payload content.
 *
 * @param {Buffer|string} content - Content to checksum
 * @returns {string} Prefixed SHA-256 checksum
 */
function computeChecksum(content) {
  const hash = crypto.createHash('sha256');
  hash.update(Buffer.isBuffer(content) ? content : String(content || ''), Buffer.isBuffer(content) ? undefined : 'utf8');
  return `sha256:${hash.digest('hex')}`;
}

/**
 * Normalize caller-provided round identifiers into round-NNN form.
 *
 * @param {string|number} roundId - Round id or integer round number
 * @returns {string} Normalized round id
 * @throws {Error} When the round id is outside the supported range
 */
function normalizeRoundId(roundId) {
  if (typeof roundId === 'string' && /^round-\d{3}$/.test(roundId)) return roundId;
  const parsed = Number(roundId || 1);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 99) {
    throw new Error('[ai-council] round_id must be round-NNN or an integer from 1 to 99');
  }
  return `round-${String(parsed).padStart(3, '0')}`;
}

/**
 * Add council audit metadata to a state event payload.
 *
 * @param {Object} event - Event payload to normalize
 * @returns {Object} Event payload with schema metadata
 */
function normalizeEvent(event) {
  return {
    schema_version: SCHEMA_VERSION,
    protocol: PROTOCOL,
    producer: PRODUCER_VERSION,
    ...event,
  };
}

function rotateIfNeeded(stateJsonlPath, incomingBytes, maxBytes) {
  if (!fs.existsSync(stateJsonlPath)) return false;
  const currentBytes = fs.statSync(stateJsonlPath).size;
  if (currentBytes + incomingBytes <= maxBytes) return false;
  const backupPath = `${stateJsonlPath}.1`;
  fs.rmSync(backupPath, { force: true });
  fs.renameSync(stateJsonlPath, backupPath);
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Append a normalized JSONL event to the council state log.
 *
 * @param {string} stateJsonlPath - Path to the state JSONL file
 * @param {Object} event - Event payload to append
 * @param {Object} [options={}] - Write options
 * @param {number} [options.maxBytes] - Maximum state file size before rotation
 * @returns {string} Absolute state JSONL path
 */
function appendJsonlEvent(stateJsonlPath, event, options = {}) {
  const target = path.resolve(stateJsonlPath);
  const line = `${JSON.stringify(normalizeEvent(event))}\n`;
  fs.mkdirSync(path.dirname(target), { recursive: true });
  rotateIfNeeded(target, Buffer.byteLength(line, 'utf8'), options.maxBytes || DEFAULT_MAX_BYTES);
  fs.appendFileSync(target, line, 'utf8');
  return target;
}

/**
 * Append an artifact_written audit event to the council state log.
 *
 * @param {string} stateJsonlPath - Path to the state JSONL file
 * @param {Object} event - Artifact write details
 * @param {string} event.path - Artifact path relative to the council root
 * @param {number} event.bytes - Number of bytes written
 * @param {string} event.checksum - Artifact checksum
 * @returns {string} Absolute state JSONL path
 */
function appendArtifactWrittenEvent(stateJsonlPath, event) {
  const payload = {
    event: 'artifact_written',
    path: event.path,
    bytes: event.bytes,
    checksum: event.checksum,
    timestamp: event.timestamp || new Date().toISOString(),
    seat_id: event.seat_id || event.seatId || null,
    round_id: normalizeRoundId(event.round_id || event.roundId || 1),
  };
  if (event.event_id || event.eventId) payload.event_id = event.event_id || event.eventId;
  return appendJsonlEvent(stateJsonlPath, payload, event);
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  SCHEMA_VERSION,
  PROTOCOL,
  PRODUCER_VERSION,
  DEFAULT_MAX_BYTES,
  appendArtifactWrittenEvent,
  appendJsonlEvent,
  computeChecksum,
  normalizeEvent,
  normalizeRoundId,
};
