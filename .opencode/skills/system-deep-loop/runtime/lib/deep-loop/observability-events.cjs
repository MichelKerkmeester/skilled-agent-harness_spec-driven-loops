// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Deep-Loop Runtime — Observability Events                                 ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const OBSERVABILITY_SCHEMA_VERSION = '1.0';
const UNKNOWN_FIELD_VALUE = 'unknown';

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function nonEmptyString(value) {
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : null;
}

function firstString(...values) {
  for (const value of values) {
    const normalized = nonEmptyString(value);
    if (normalized) return normalized;
  }
  return null;
}

function eventStatus(value) {
  const event = nonEmptyString(value);
  if (!event) return null;
  if (event === 'started' || event === 'progress' || event === 'resume_waiting') return 'running';
  if (event === 'completed' || event === 'resume_waiting_complete') return 'completed';
  if (event === 'failed') return 'failed';
  if (event === 'stopped') return 'stopped';
  if (event === 'retry_scheduled' || event === 'orphan_requeued') return 'retrying';
  return null;
}

function normalizeSubject(payload, meta) {
  if (meta.subject !== undefined && meta.subject !== null) {
    return meta.subject;
  }
  const subject = firstString(
    payload.subject,
    payload.label,
    payload.sessionId,
    payload.session_id,
    payload.round_id,
    payload.topic_id,
    payload.spec_folder,
    payload.specFolder,
  );
  return subject ?? UNKNOWN_FIELD_VALUE;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Normalize a producer-native payload into the shared observability envelope.
 *
 * @param {Object} payload - Native producer payload to preserve under `payload`.
 * @param {Object} [meta] - Envelope metadata and overrides.
 * @param {string} [meta.eventId] - Precomputed event identifier.
 * @param {string} [meta.producer] - Producer name.
 * @param {string} [meta.stream] - Stream name.
 * @param {unknown} [meta.subject] - Indexable subject for this event.
 * @param {string} [meta.event] - Event name.
 * @param {string} [meta.status] - Event status.
 * @param {string} [meta.observedAtIso] - Event timestamp.
 * @returns {Object} Observability envelope.
 * @throws {TypeError} If payload or metadata is not an object.
 */
function normalizeObservabilityEvent(payload, meta = {}) {
  if (!isRecord(payload)) {
    throw new TypeError('payload must be an object');
  }
  if (!isRecord(meta)) {
    throw new TypeError('meta must be an object when provided');
  }

  const event = firstString(meta.event, payload.event, payload.type) ?? UNKNOWN_FIELD_VALUE;
  const status = firstString(meta.status, payload.status, eventStatus(event)) ?? UNKNOWN_FIELD_VALUE;

  return {
    schema_version: OBSERVABILITY_SCHEMA_VERSION,
    event_id: nonEmptyString(meta.eventId) ?? randomUUID(),
    producer: firstString(meta.producer, payload.producer) ?? UNKNOWN_FIELD_VALUE,
    stream: firstString(meta.stream, payload.stream, payload.loop_type, payload.mode) ?? UNKNOWN_FIELD_VALUE,
    subject: normalizeSubject(payload, meta),
    event,
    status,
    observed_at_iso: nonEmptyString(meta.observedAtIso) ?? new Date().toISOString(),
    payload: { ...payload },
  };
}

/**
 * Append a normalized observability event as one JSONL row.
 *
 * @param {string} eventPath - JSONL path to append to.
 * @param {Object} payload - Native producer payload.
 * @param {Object} [meta] - Envelope metadata and overrides.
 * @returns {Object} The appended observability envelope.
 * @throws {TypeError} If eventPath is invalid or normalization fails.
 */
// Lifecycle events severe enough to mirror to stderr — the JSONL ledger is otherwise pull-only,
// so a stall/abort/requeue would only be visible to something actively tailing the file.
const LOUD_OBSERVABILITY_EVENTS = new Set(['stall_detected', 'orphan_requeued', 'aborted']);

function appendObservabilityEvent(eventPath, payload, meta = {}) {
  if (typeof eventPath !== 'string' || eventPath.trim() === '') {
    throw new TypeError('eventPath must be a non-empty string');
  }

  const envelope = normalizeObservabilityEvent(payload, meta);
  fs.mkdirSync(path.dirname(eventPath), { recursive: true });
  fs.appendFileSync(eventPath, `${JSON.stringify(envelope)}\n`, 'utf8');
  if (LOUD_OBSERVABILITY_EVENTS.has(envelope.event)) {
    try {
      const label = envelope.payload && envelope.payload.label;
      process.stderr.write(`[deep-loop] ${envelope.event}${label ? ` lineage=${label}` : ''}\n`);
    } catch { /* a stderr write must never break event persistence */ }
  }
  return envelope;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  OBSERVABILITY_SCHEMA_VERSION,
  appendObservabilityEvent,
  normalizeObservabilityEvent,
};
