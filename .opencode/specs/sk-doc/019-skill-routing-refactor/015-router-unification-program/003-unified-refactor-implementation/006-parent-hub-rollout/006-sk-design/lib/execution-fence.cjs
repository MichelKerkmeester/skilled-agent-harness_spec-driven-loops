'use strict';

const {
  ExecutionProtocolError,
} = require('../../../003-execution-verify-commit/lib/execution-plane.cjs');

function commitActor(plane, leg, verification, destination, options) {
  if (leg.target.role !== 'actor' || leg.target.mutatesWorkspace !== true) {
    throw new ExecutionProtocolError(
      'ROLE_CANNOT_COMMIT',
      'only a workspace-mutating actor target can commit',
    );
  }
  return plane.commit(leg, verification, destination, options);
}

module.exports = { commitActor };
