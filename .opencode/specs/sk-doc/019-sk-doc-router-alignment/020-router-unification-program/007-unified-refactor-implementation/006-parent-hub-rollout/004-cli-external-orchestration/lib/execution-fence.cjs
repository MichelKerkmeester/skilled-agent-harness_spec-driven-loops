// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ LIBRARY: EXTERNAL EXECUTOR ACTOR FENCE                                 ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const {
  ExecutionProtocolError,
} = require('../../../003-execution-verify-commit/lib/execution-plane.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. EXECUTION FENCE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Commit only an executor actor after destination-local VERIFY returns READY.
 *
 * @param {Object} plane - Destination-local execution plane.
 * @param {Object} leg - Prepared target leg.
 * @param {Object} verification - Matching READY ticket.
 * @param {Object} destination - Destination authority and effect adapter.
 * @param {Object} options - Receipt timestamp and retention horizon.
 * @returns {Object} Frozen commit receipt envelope.
 */
function commitActor(plane, leg, verification, destination, options) {
  if (leg.target.role !== 'actor') {
    throw new ExecutionProtocolError(
      'ROLE_CANNOT_COMMIT',
      'only executor actor targets can commit',
    );
  }
  return plane.commit(leg, verification, destination, options);
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  commitActor,
};
