// ───────────────────────────────────────────────────────────────────
// MODULE: Dispatch Receipt Evidence
// ───────────────────────────────────────────────────────────────────

import { asDispatchReceiptPayload } from './event-contract.js';
import {
  DispatchReceiptError,
  DispatchReceiptErrorCodes,
} from './errors.js';

import type {
  DurableAppendReceipt,
  VerifiedLedgerEvent,
} from '../authorized-ledger/index.js';
import type {
  DispatchReceiptEvidence,
  DispatchReceiptPayload,
  UnresolvedDispatchHandoff,
} from './types.js';

// ───────────────────────────────────────────────────────────────────
// 1. PUBLIC EVIDENCE HELPERS
// ───────────────────────────────────────────────────────────────────

/** Parse one verified event and retain only stable sibling-facing evidence. */
export function dispatchReceiptEvidenceFromVerified(
  verified: VerifiedLedgerEvent,
  unresolvedClassification: 'dispatch-resolved' | 'unresolved',
): {
  readonly evidence: DispatchReceiptEvidence;
  readonly payload: DispatchReceiptPayload;
} {
  let payload: DispatchReceiptPayload;
  try {
    payload = asDispatchReceiptPayload(verified.event.effective.envelope.payload);
  } catch {
    throw new DispatchReceiptError(
      DispatchReceiptErrorCodes.RECEIPT_EVIDENCE_CORRUPT,
      'resume',
      'Verified dispatch event does not match the registered receipt shape',
      { sequence: verified.frame.sequence },
    );
  }
  return Object.freeze({
    payload,
    evidence: Object.freeze({
      canonicalEventHash: verified.frame.canonical_event_hash,
      dispatchId: payload.dispatch_id,
      invocationFingerprint: payload.invocation_fingerprint,
      leafId: payload.leaf_id,
      ledgerId: verified.frame.ledger_id,
      ledgerSequence: verified.frame.sequence,
      logicalBranchId: payload.logical_branch_id,
      receiptId: payload.receipt_id,
      recordHash: verified.frame.record_hash,
      unresolvedClassification,
    }),
  });
}

/** Reconstruct the exact append receipt from its immutable verified frame. */
export function durableAppendReceiptFromVerified(
  verified: VerifiedLedgerEvent,
): DurableAppendReceipt {
  return Object.freeze({
    ...verified.frame.receipt,
    authorizationRef: verified.frame.authorization_ref,
    canonicalEventHash: verified.frame.canonical_event_hash,
    recordHash: verified.frame.record_hash,
  });
}

/** Create the typed recovery and successor handoff for receipt-only state. */
export function unresolvedDispatchHandoff(
  evidence: DispatchReceiptEvidence,
): UnresolvedDispatchHandoff {
  const unresolvedEvidence: DispatchReceiptEvidence = Object.freeze({
    ...evidence,
    unresolvedClassification: 'unresolved',
  });
  return Object.freeze({
    classification: 'unresolved',
    evidence: unresolvedEvidence,
    effectRecovery: Object.freeze({
      action: 'reconcile',
      reason: 'dispatch-receipt-without-result',
    }),
    successorSalvage: Object.freeze({
      action: 'inspect-and-salvage',
      reason: 'terminal-result-missing',
    }),
  });
}
