// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ LIBRARY: ACTOR-ONLY EXECUTION FENCE                                     ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const {
  ExecutionProtocolError,
} = require('../../../003-execution-verify-commit/lib/execution-plane.cjs');

/**
 * Refuse a commit-intent verification before an evidence target can become READY.
 *
 * @param {Object} plane - Destination-local execution plane.
 * @param {Object} leg - Prepared target leg.
 * @param {Object} current - Current proof bindings.
 * @param {Object} destination - Destination-owned verifier.
 * @param {string} operation - Requested terminal operation.
 * @returns {Object} Closed verification state.
 */
function verifyForOperation(plane, leg, current, destination, operation) {
  if (operation === 'commit' && leg.target.role !== 'actor') {
    return Object.freeze({
      protocolPath: Object.freeze(['PREPARE', 'VERIFY']),
      reason: 'evidence-target-cannot-commit',
      state: 'REJECT',
    });
  }
  return plane.verify(leg, current, destination);
}

/**
 * Commit only an actor leg through the frozen destination-local lifecycle.
 *
 * @param {Object} plane - Destination-local execution plane.
 * @param {Object} leg - Prepared target leg.
 * @param {Object} verification - Matching READY ticket.
 * @param {Object} destination - Destination-owned effect adapter.
 * @param {Object} options - Receipt timestamp and retention.
 * @returns {Object} Frozen commit receipt envelope.
 */
function commitActor(plane, leg, verification, destination, options) {
  if (leg.target.role !== 'actor') {
    throw new ExecutionProtocolError(
      'ROLE_CANNOT_COMMIT',
      'only actor targets can enter COMMIT',
    );
  }
  return plane.commit(leg, verification, destination, options);
}

module.exports = {
  commitActor,
  verifyForOperation,
};
