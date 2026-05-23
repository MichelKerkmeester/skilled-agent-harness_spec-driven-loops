// MODULE: Council Multi-Seat Dispatch
'use strict';

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

module.exports = {
  dispatchCouncilSeats,
};
