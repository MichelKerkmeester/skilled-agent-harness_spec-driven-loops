#!/usr/bin/env node
// Shared progress-record type, reducer allowlist, and pair validator.
//
// Cross-cutting across all deep-loop modes (council, context, review, research,
// improvement). Imported by every completion reducer so the allowlist contract
// lives in one place.

'use strict';

// Discriminators for the additive progress_record JSONL event type. v1 readers
// ignore records whose type/event do not match a known core event, so this is
// safe to append to any *-state.jsonl without breaking older consumers.
const PROGRESS_RECORD_TYPE = 'progress';
const PROGRESS_RECORD_EVENT = 'progress_record';

// Allowlist: record types that carry completion or iteration semantics from a
// *-state.jsonl. Every type NOT in this set is a non-completion additive event
// and MUST be ignored by completion math. Progress records reset the watchdog
// but never count as iterations, synthesis events, or terminal stops.
const COMPLETION_BEARING_TYPES = new Set(['iteration', 'event']);

// Threshold T (seconds): a started/completed progress pair is required for any
// step expected to run longer than T without another state-log append or
// artifact write. T is half the watchdog no-progress window — the watchdog
// fires after 120s of no new event AND no artifact mtime change, so a progress
// pair at T=60s resets the timer with a 60s margin for the watchdog to still
// catch a genuine stall if the step hangs after the started record.
const PROGRESS_THRESHOLD_SECONDS = 60;

// ─────────────────────────────────────────────────────────────────────────────
// Predicates & filters
// ─────────────────────────────────────────────────────────────────────────────

function isProgressRecord(record) {
  return Boolean(record
    && typeof record === 'object'
    && (record.type === PROGRESS_RECORD_TYPE || record.event === PROGRESS_RECORD_EVENT));
}

/**
 * Drop progress records from a parsed JSONL record array so completion math
 * never counts them. Returns a new array; does not mutate the input.
 *
 * @param {Array<Object>} records - Parsed JSONL records.
 * @returns {Array<Object>} Records with progress records removed.
 */
function filterCompletionBearingRecords(records) {
  return (Array.isArray(records) ? records : []).filter((r) => !isProgressRecord(r));
}

// ─────────────────────────────────────────────────────────────────────────────
// Pair validator (GAP-35: no-op heartbeats mask stalls)
// ─────────────────────────────────────────────────────────────────────────────

function normalizeText(value) {
  return String(value == null ? '' : value).trim();
}

/**
 * A completed record is work-anchored when it carries a positive progress_delta
 * OR a non-empty artifact_path. A record with neither (or a zero/missing delta)
 * is a no-op that must be rejected so a timer-only heartbeat cannot mask a
 * genuine stall.
 *
 * @param {Object} record - A progress record with status 'completed'.
 * @returns {boolean} True when the record carries real work evidence.
 */
function hasWorkAnchor(record) {
  if (!record || typeof record !== 'object') return false;
  const delta = Number(record.progress_delta);
  if (Number.isFinite(delta) && delta > 0) return true;
  const artifact = normalizeText(record.artifact_path);
  if (artifact) return true;
  return false;
}

/**
 * Validate a started/completed progress-record pair. A valid pair represents a
 * real step transition with measurable work output; a zero-delta no-op pair is
 * rejected.
 *
 * @param {Object} startedRecord - The progress record with status 'started'.
 * @param {Object} completedRecord - The progress record with status 'completed'.
 * @returns {{valid: boolean, reason?: string}} Validation result.
 */
function validateProgressRecordPair(startedRecord, completedRecord) {
  if (!startedRecord || typeof startedRecord !== 'object') {
    return { valid: false, reason: 'started record is missing or not an object' };
  }
  if (!completedRecord || typeof completedRecord !== 'object') {
    return { valid: false, reason: 'completed record is missing or not an object' };
  }
  if (startedRecord.status !== 'started') {
    return { valid: false, reason: `started record status is "${startedRecord.status}", expected "started"` };
  }
  if (completedRecord.status !== 'completed') {
    return { valid: false, reason: `completed record status is "${completedRecord.status}", expected "completed"` };
  }
  if (!hasWorkAnchor(completedRecord)) {
    return { valid: false, reason: 'zero-delta no-op pair: completed record has no progress_delta > 0 and no artifact_path' };
  }
  return { valid: true };
}

// ─────────────────────────────────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  PROGRESS_RECORD_TYPE,
  PROGRESS_RECORD_EVENT,
  COMPLETION_BEARING_TYPES,
  PROGRESS_THRESHOLD_SECONDS,
  isProgressRecord,
  filterCompletionBearingRecords,
  hasWorkAnchor,
  validateProgressRecordPair,
};
