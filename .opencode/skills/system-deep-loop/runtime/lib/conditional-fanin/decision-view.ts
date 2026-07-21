import { isLeafResultPayload } from '../result-envelopes/index.js';
import { conditionalFanInPolicyDigest } from './policy.js';

import type {
  AcceptedResultAtCut,
  FanInDecisionView,
  OutstandingBranchAtCut,
} from './types.js';

function requireIdentity(value: string, field: string): void {
  if (value.trim() === '') throw new TypeError(`${field} must be non-empty`);
}

function resultOrder(left: AcceptedResultAtCut, right: AcceptedResultAtCut): number {
  return left.ledgerSequence - right.ledgerSequence
    || left.envelope.result_envelope_id.localeCompare(right.envelope.result_envelope_id);
}

function outstandingOrder(
  left: OutstandingBranchAtCut,
  right: OutstandingBranchAtCut,
): number {
  return left.eventSequence - right.eventSequence
    || left.branch.registration.logical_branch_id.localeCompare(
      right.branch.registration.logical_branch_id,
    );
}

export function buildFanInDecisionView(
  input: FanInDecisionView,
): FanInDecisionView {
  requireIdentity(input.runId, 'runId');
  requireIdentity(input.waveId, 'waveId');
  requireIdentity(input.replayFingerprint, 'replayFingerprint');
  if (input.policyDigest !== conditionalFanInPolicyDigest(input.policy)) {
    throw new TypeError('Fan-in decision view policy digest does not match the policy');
  }
  if (input.partialFailurePolicyReference !== input.policy.partialFailurePolicyReference) {
    throw new TypeError('Partial-failure policy reference does not match the fan-in policy');
  }

  const accepted = [...input.acceptedResults].sort(resultOrder);
  const acceptedIds = new Set<string>();
  for (const result of accepted) {
    if (!isLeafResultPayload(result.envelope)) {
      throw new TypeError('Decision view contains an invalid result envelope');
    }
    if (result.ledgerSequence > input.cut.sequence) {
      throw new RangeError('Decision view cannot include a result after its event cut');
    }
    if (result.envelope.run_id !== input.runId) {
      throw new TypeError('Result envelope run does not match the decision view');
    }
    if (acceptedIds.has(result.envelope.result_envelope_id)) {
      throw new TypeError('Decision view contains a duplicate result envelope');
    }
    acceptedIds.add(result.envelope.result_envelope_id);
    requireIdentity(result.agreementKey, 'agreementKey');
    requireIdentity(result.provenanceGroupId, 'provenanceGroupId');
  }

  const outstanding = [...input.outstandingBranches].sort(outstandingOrder);
  const branchIds = new Set<string>();
  for (const branch of outstanding) {
    const logicalBranchId = branch.branch.registration.logical_branch_id;
    if (branch.eventSequence > input.cut.sequence) {
      throw new RangeError('Decision view cannot include branch state after its event cut');
    }
    if (branchIds.has(logicalBranchId)) {
      throw new TypeError('Decision view contains duplicate outstanding branch state');
    }
    branchIds.add(logicalBranchId);
    if (branch.executionState === 'running' && branch.lease === null) {
      throw new TypeError('Running branch state requires an active fenced lease');
    }
    if (
      branch.lease !== null
      && branch.lease.logicalBranchId !== logicalBranchId
    ) {
      throw new TypeError('Outstanding branch lease identity does not match its branch');
    }
  }

  return Object.freeze({
    ...input,
    acceptedResults: Object.freeze(accepted),
    outstandingBranches: Object.freeze(outstanding),
    anomalyCodes: Object.freeze([...new Set(input.anomalyCodes)].sort()),
  });
}
