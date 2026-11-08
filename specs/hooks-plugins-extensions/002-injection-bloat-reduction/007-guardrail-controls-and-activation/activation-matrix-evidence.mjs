/**
 * Authoritative activation-evidence binding gate for matrix cells.
 * JSON Schema types individual evidence fields but cannot express cross-field
 * equality between behavioral and delivery records or pin them to a cell;
 * consumers validating an activated cell must call evidenceBindsToCell.
 */

function evidencePasses(evidence, cell) {
  return Boolean(
    evidence
      && evidence.status === 'pass'
      && typeof evidence.artifact === 'string'
      && evidence.artifact.length > 0
      && typeof evidence.source === 'string'
      && evidence.source.length > 0
      && typeof evidence.observedAt === 'string'
      && typeof evidence.notes === 'string'
      && evidence.notes.length > 0
      && typeof evidence.runtime === 'string'
      && evidence.runtime === cell.runtime
      && typeof evidence.candidate === 'string'
      && evidence.candidate === cell.candidate
      && typeof evidence.contentHash === 'string'
      && evidence.contentHash.length > 0
      && Number.isInteger(evidence.lifecycleEpoch)
      && evidence.lifecycleEpoch >= 1
      && evidence.hostReceiptStatus === 'observed'
      && typeof evidence.artifactDigest === 'string'
      && evidence.artifactDigest.length > 0,
  );
}

/**
 * Returns true only when both evidence records are passing, host-observed,
 * cell-bound on runtime and candidate, and mutually consistent on
 * runtime, candidate, contentHash, lifecycleEpoch, and artifactDigest.
 */
export function evidenceBindsToCell(behavioralEvidence, deliveryEvidence, cell) {
  if (!evidencePasses(behavioralEvidence, cell) || !evidencePasses(deliveryEvidence, cell)) {
    return false;
  }
  return behavioralEvidence.runtime === deliveryEvidence.runtime
    && behavioralEvidence.candidate === deliveryEvidence.candidate
    && behavioralEvidence.contentHash === deliveryEvidence.contentHash
    && behavioralEvidence.lifecycleEpoch === deliveryEvidence.lifecycleEpoch
    && behavioralEvidence.artifactDigest === deliveryEvidence.artifactDigest;
}
