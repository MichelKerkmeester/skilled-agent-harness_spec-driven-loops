// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Council Multi-Seat Dispatch                                              ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function normalizeSeat(seat, index) {
  if (typeof seat === 'string') {
    return { id: seat, input: { id: seat } };
  }
  if (!isRecord(seat)) {
    throw new TypeError(`seat at index ${index} must be a string or object`);
  }
  if (typeof seat.id !== 'string' || seat.id.trim() === '') {
    throw new TypeError(`seat at index ${index} must include a non-empty id`);
  }
  return { id: seat.id, input: seat };
}

function normalizeRoundId(roundId) {
  if (typeof roundId !== 'string' || roundId.trim() === '') {
    throw new TypeError('roundId must be a non-empty string');
  }
  return roundId;
}

function normalizeTimestamp(value) {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === 'string' && value.trim() !== '') {
    return value;
  }
  return new Date().toISOString();
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Dispatch a single council seat and capture its result or error.
 *
 * Wraps the seat-specific dispatch function and records timing,
 * status (fulfilled/rejected), and any error details so the
 * multi-seat dispatcher can aggregate per-round results.
 *
 * @param {Object} params - Seat dispatch parameters.
 * @param {Object} params.seat - Normalized seat descriptor with id
 *   and input.
 * @param {number} params.index - Zero-based seat index within the round.
 * @param {string} params.roundId - Normalized round identifier.
 * @param {Function} params.dispatchSeat - Async function that accepts
 *   (seatInput, context) and returns the seat's output.
 * @param {Object} params.context - Arbitrary context forwarded to
 *   dispatchSeat.
 * @param {Function} params.now - Callable returning a Date or ISO
 *   timestamp for timing.
 * @returns {Promise<Object>} Per-seat result with seat_id, status,
 *   started_at_iso, completed_at_iso, duration_ms, and
 *   output or error.
 */
async function settleSeat({ seat, index, roundId, dispatchSeat, context, now }) {
  const startedAtIso = normalizeTimestamp(now());
  const startedAtMs = Date.now();
  try {
    const output = await dispatchSeat(seat.input, { roundId, seatIndex: index, context });
    return {
      seat_id: seat.id,
      status: 'fulfilled',
      started_at_iso: startedAtIso,
      completed_at_iso: normalizeTimestamp(now()),
      duration_ms: Math.max(0, Date.now() - startedAtMs),
      output,
    };
  } catch (error) {
    return {
      seat_id: seat.id,
      status: 'rejected',
      started_at_iso: startedAtIso,
      completed_at_iso: normalizeTimestamp(now()),
      duration_ms: Math.max(0, Date.now() - startedAtMs),
      error: {
        name: error && error.name ? String(error.name) : 'Error',
        message: error && error.message ? String(error.message) : String(error),
      },
    };
  }
}

/**
 * Dispatch all council seats for a single deliberation round in parallel.
 *
 * Normalizes inputs, dispatches each seat concurrently via
 * Promise.all, and returns an aggregated round result with per-seat
 * outcomes and a summary (total / succeeded / failed / all_failed).
 *
 * @param {Object} options - Dispatch configuration.
 * @param {string} options.roundId - Round identifier (non-empty string).
 * @param {Array<string|Object>} options.seats - Array of seat
 *   descriptors (string IDs or objects with id and input).
 * @param {Function} options.dispatchSeat - Async dispatch function
 *   invoked per seat.
 * @param {Object} [options.context={}] - Arbitrary context forwarded
 *   to each seat dispatch.
 * @param {Function} [options.now] - Callable returning a Date or ISO
 *   timestamp (default: () => new Date()).
 * @returns {Promise<Object>} Round result with round_id,
 *   started_at_iso, completed_at_iso, results array, and summary.
 * @throws {TypeError} If options is not an object, roundId is invalid,
 *   seats is empty, or dispatchSeat is not a function.
 */
async function dispatchCouncilSeats(options) {
  if (!isRecord(options)) {
    throw new TypeError('dispatchCouncilSeats options must be an object');
  }
  const roundId = normalizeRoundId(options.roundId);
  if (!Array.isArray(options.seats) || options.seats.length === 0) {
    throw new TypeError('seats must be a non-empty array');
  }
  if (typeof options.dispatchSeat !== 'function') {
    throw new TypeError('dispatchSeat must be a function');
  }

  const now = typeof options.now === 'function' ? options.now : () => new Date();
  const seats = options.seats.map(normalizeSeat);
  const startedAtIso = normalizeTimestamp(now());
  const results = await Promise.all(
    seats.map((seat, index) => settleSeat({
      seat,
      index,
      roundId,
      dispatchSeat: options.dispatchSeat,
      context: options.context || {},
      now,
    })),
  );
  const completedAtIso = normalizeTimestamp(now());
  const succeeded = results.filter((result) => result.status === 'fulfilled').length;
  const failed = results.length - succeeded;

  return {
    round_id: roundId,
    started_at_iso: startedAtIso,
    completed_at_iso: completedAtIso,
    results,
    summary: {
      total: results.length,
      succeeded,
      failed,
      all_failed: failed === results.length,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  dispatchCouncilSeats,
};
