'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const SCHEMA_VERSION = '1.2';
const PROTOCOL = 'multi-ai-council';
const PRODUCER_VERSION = 'persist-artifacts@1.2.0';
const DEFAULT_MAX_BYTES = 10 * 1024 * 1024;

function computeChecksum(content) {
  const hash = crypto.createHash('sha256');
  hash.update(Buffer.isBuffer(content) ? content : String(content || ''), Buffer.isBuffer(content) ? undefined : 'utf8');
  return `sha256:${hash.digest('hex')}`;
}

function normalizeRoundId(roundId) {
  if (typeof roundId === 'string' && /^round-\d{3}$/.test(roundId)) return roundId;
  const parsed = Number(roundId || 1);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 99) {
    throw new Error('[multi-ai-council] round_id must be round-NNN or an integer from 1 to 99');
  }
  return `round-${String(parsed).padStart(3, '0')}`;
}

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

function appendJsonlEvent(stateJsonlPath, event, options = {}) {
  const target = path.resolve(stateJsonlPath);
  const line = `${JSON.stringify(normalizeEvent(event))}\n`;
  fs.mkdirSync(path.dirname(target), { recursive: true });
  rotateIfNeeded(target, Buffer.byteLength(line, 'utf8'), options.maxBytes || DEFAULT_MAX_BYTES);
  fs.appendFileSync(target, line, 'utf8');
  return target;
}

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
