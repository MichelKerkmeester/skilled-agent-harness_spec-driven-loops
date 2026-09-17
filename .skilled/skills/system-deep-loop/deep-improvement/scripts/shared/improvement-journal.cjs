// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ improvement-journal — append-only audit journal for improvement runs     ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS — Stop-Reason Taxonomy & Session Outcomes
// ─────────────────────────────────────────────────────────────────────────────

// The terminal lifecycle taxonomy (6 stopReasons + 4 sessionOutcomes) is the
// shared backend contract. Import it so accepted values, insertion order, and
// the validation error strings derived from them stay identical across every
// deep-loop mode rather than being redefined per skill.
const {
  STOP_REASONS,
  SESSION_OUTCOMES,
} = require('../../../runtime/lib/deep-loop/lifecycle-taxonomy.cjs');

/**
 * Valid event types for the improvement journal.
 * Journal captures lifecycle events and stop decisions (orchestrator only).
 * @type {Readonly<string[]>}
 */
const VALID_EVENT_TYPES = Object.freeze([
  'session_start',
  'session_initialized',
  'integration_scanned',
  'candidate_generated',
  'candidate_scored',
  'benchmark_completed',
  'gate_evaluation',
  'legal_stop_evaluated',
  'blocked_stop',
  'promotion_attempt',
  'promotion_attempted',
  'promotion_result',
  'rollback',
  'rollback_result',
  'trade_off_detected',
  'mutation_proposed',
  'mutation_outcome',
  'session_ended',
  'session_end',
  // Dispatch-cost accounting marker (not a domain event): emitted once per
  // score-candidate.cjs execution so check-dispatch-cap.cjs can count every
  // individual execution (primary + replays), since the domain
  // `candidate_scored` event only fires once per iteration for the primary.
  'score_execution_recorded',
]);

/**
 * Gate names a legal_stop_evaluated event must report on.
 * @type {Readonly<string[]>}
 */
const LEGAL_STOP_GATES = Object.freeze([
  'contractGate',
  'behaviorGate',
  'integrationGate',
  'evidenceGate',
  'improvementGate',
]);

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validate that an event object has the required fields and a valid event type.
 * @param {object} event - Event to validate
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateEvent(event) {
  const errors = [];

  if (!event || typeof event !== 'object') {
    return { valid: false, errors: ['Event must be a non-null object'] };
  }

  if (!event.eventType || typeof event.eventType !== 'string') {
    errors.push('Event must have a string eventType');
  } else if (!VALID_EVENT_TYPES.includes(event.eventType)) {
    errors.push(`Invalid eventType: "${event.eventType}". Valid types: ${VALID_EVENT_TYPES.join(', ')}`);
  }

  if (event.eventType === 'session_ended' || event.eventType === 'session_end') {
    if (!event.details || !event.details.stopReason) {
      errors.push('session_ended/session_end events MUST include details.stopReason');
    } else if (!Object.values(STOP_REASONS).includes(event.details.stopReason)) {
      errors.push(`Invalid stopReason: "${event.details.stopReason}". Valid reasons: ${Object.values(STOP_REASONS).join(', ')}`);
    }
    if (!event.details || !event.details.sessionOutcome) {
      errors.push('session_ended/session_end events MUST include details.sessionOutcome');
    } else if (!Object.values(SESSION_OUTCOMES).includes(event.details.sessionOutcome)) {
      errors.push(`Invalid sessionOutcome: "${event.details.sessionOutcome}". Valid outcomes: ${Object.values(SESSION_OUTCOMES).join(', ')}`);
    }
  }

  if (event.eventType === 'legal_stop_evaluated') {
    const gateResults = event.details && event.details.gateResults;
    if (!gateResults || typeof gateResults !== 'object' || Array.isArray(gateResults)) {
      errors.push('legal_stop_evaluated events MUST include details.gateResults object');
    } else {
      for (const gateName of LEGAL_STOP_GATES) {
        if (!Object.prototype.hasOwnProperty.call(gateResults, gateName)) {
          errors.push(`legal_stop_evaluated details.gateResults missing ${gateName}`);
        }
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Append an event to the improvement journal (append-only JSONL).
 * Journal emission is orchestrator-only; this function is the single write point.
 *
 * @param {string} journalPath - Path to the improvement-journal.jsonl file
 * @param {object} event - Event object with { eventType, iteration?, candidateId?, details? }
 * @returns {{ success: boolean, errors?: string[] }}
 */
function emitEvent(journalPath, event) {
  const enrichedEvent = {
    timestamp: new Date().toISOString(),
    ...event,
  };

  const validation = validateEvent(enrichedEvent);
  if (!validation.valid) {
    return { success: false, errors: validation.errors };
  }

  // Ensure directory exists
  const dir = path.dirname(journalPath);
  fs.mkdirSync(dir, { recursive: true });

  // Append-only 'a' flag: survives process restart, no in-memory buffering to lose on crash.
  const line = JSON.stringify(enrichedEvent) + '\n';
  fs.appendFileSync(journalPath, line, 'utf8');

  return { success: true };
}

/**
 * Read all events from a journal file, surfacing corrupt lines as warnings.
 * Used for resume/replay semantics.
 *
 * Returns an array of parsed event objects. The array also carries a
 * `corruptionWarnings` property (string[]) listing any lines that could not
 * be parsed, so callers that need the full picture can inspect them.
 * Existing callers that only iterate the array are unaffected.
 *
 * @param {string} journalPath - Path to the improvement-journal.jsonl file
 * @returns {object[] & { corruptionWarnings: string[] }} Valid event objects with attached warnings
 */
function readJournal(journalPath) {
  const corruptionWarnings = [];

  let validRecords;
  try {
    const content = fs.readFileSync(journalPath, 'utf8');
    const rawLines = content.split('\n');
    validRecords = [];
    for (let i = 0; i < rawLines.length; i += 1) {
      const line = rawLines[i].trim();
      if (!line) continue;
      try {
        validRecords.push(JSON.parse(line));
      } catch (parseErr) {
        // Physical line number (1-based, counts blank lines so it points at the real
        // file line); never echo raw content — a malformed record may carry secrets, so
        // report length + a short content hash instead of the bytes.
        const digest = crypto.createHash('sha256').update(line).digest('hex').slice(0, 12);
        const warning = `Line ${i + 1}: JSON parse error: ${parseErr.message} (len=${line.length} sha256:${digest})`;
        corruptionWarnings.push(warning);
        process.stderr.write(`[improvement-journal] Corrupt line skipped. ${warning}\n`);
      }
    }
  } catch (_fileErr) {
    validRecords = [];
  }

  // Attach warnings as a non-enumerable property so spread/JSON.stringify callers
  // are unaffected, but explicit readers can inspect corruptionWarnings directly.
  Object.defineProperty(validRecords, 'corruptionWarnings', {
    value: corruptionWarnings,
    writable: false,
    enumerable: false,
    configurable: false,
  });

  return validRecords;
}

/**
 * Read all events from a journal file and return both valid records and
 * corruption warnings as a plain object (dual-use-safe, matches the shape
 * that reduce-state.cjs's parseJsonlDetailed uses for parity).
 *
 * @param {string} journalPath - Path to the improvement-journal.jsonl file
 * @returns {{ records: object[], corruptionWarnings: string[] }}
 */
function readJournalDetailed(journalPath) {
  const events = readJournal(journalPath);
  return { records: events, corruptionWarnings: events.corruptionWarnings };
}

/**
 * Get the last completed iteration number from a journal.
 * Used for resume semantics — continuedFromIteration field.
 *
 * @param {string} journalPath - Path to the improvement-journal.jsonl file
 * @returns {number} Last completed iteration number, or 0 if none
 */
function getLastIteration(journalPath) {
  const events = readJournal(journalPath);
  let maxIteration = 0;
  for (const event of events) {
    if (typeof event.iteration === 'number' && event.iteration > maxIteration) {
      maxIteration = event.iteration;
    }
  }
  return maxIteration;
}

/**
 * Get the stop reason from the last session_ended event.
 *
 * @param {string} journalPath - Path to the improvement-journal.jsonl file
 * @returns {{ stopReason: string|null, sessionOutcome: string|null }}
 */
function getSessionResult(journalPath) {
  const events = readJournal(journalPath);
  const endEvents = events.filter(
    (e) => e.eventType === 'session_ended' || e.eventType === 'session_end'
  );
  if (endEvents.length === 0) {
    return { stopReason: null, sessionOutcome: null };
  }
  const last = endEvents[endEvents.length - 1];
  return {
    stopReason: (last.details && last.details.stopReason) || null,
    sessionOutcome: (last.details && last.details.sessionOutcome) || null,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  STOP_REASONS,
  SESSION_OUTCOMES,
  VALID_EVENT_TYPES,
  LEGAL_STOP_GATES,
  validateEvent,
  emitEvent,
  readJournal,
  readJournalDetailed,
  getLastIteration,
  getSessionResult,
};

// ─────────────────────────────────────────────────────────────────────────────
// 6. CLI ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

if (require.main === module) {
  const args = process.argv.slice(2);

  function findArg(name) {
    const prefix = `--${name}=`;
    for (const arg of args) {
      if (arg.startsWith(prefix)) {
        return arg.slice(prefix.length);
      }
    }
    const idx = args.indexOf(`--${name}`);
    if (idx !== -1 && idx + 1 < args.length && !args[idx + 1].startsWith('--')) {
      return args[idx + 1];
    }
    return undefined;
  }

  const readPath = findArg('read');
  const emitType = findArg('emit');
  const journalPath = findArg('journal');
  const detailsRaw = findArg('details');

  if (readPath) {
    // --read <path>: Read and dump journal as JSON array
    const events = readJournal(readPath);
    process.stdout.write(JSON.stringify(events, null, 2) + '\n');
  } else if (emitType && journalPath) {
    // --emit <eventType> --journal <path> [--details <json>]
    let details = {};
    if (detailsRaw) {
      try {
        details = JSON.parse(detailsRaw);
      } catch (err) {
        process.stderr.write(`Failed to parse --details JSON: ${err.message}\n`);
        process.exit(2);
      }
    }
    const event = { eventType: emitType, details };
    const result = emitEvent(journalPath, event);
    if (!result.success) {
      process.stderr.write(`Validation failed: ${result.errors.join(', ')}\n`);
      process.exit(1);
    }
    process.stdout.write(JSON.stringify({ success: true, eventType: emitType }) + '\n');
  } else {
    process.stderr.write(
      'Usage:\n' +
      '  node improvement-journal.cjs --emit <eventType> --journal <path> [--details <json>]\n' +
      '  node improvement-journal.cjs --read <path>\n'
    );
    process.exit(2);
  }
}
