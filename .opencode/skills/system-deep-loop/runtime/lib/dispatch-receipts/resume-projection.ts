// ───────────────────────────────────────────────────────────────────
// MODULE: Dispatch Receipt Resume Projection
// ───────────────────────────────────────────────────────────────────

import {
  AppendOnlyLedger,
  AuthorizedLedgerError,
} from '../authorized-ledger/index.js';
import { EventEnvelopeError } from '../event-envelope/index.js';
import {
  LINEAGE_DISPATCH_RESOLVED_EVENT_TYPE,
  LINEAGE_DISPATCH_RESOLVED_EVENT_VERSION,
  asDispatchReceiptPayload,
} from './event-contract.js';
import {
  dispatchReceiptEvidenceFromVerified,
  unresolvedDispatchHandoff,
} from './evidence.js';
import {
  DispatchReceiptError,
  DispatchReceiptErrorCodes,
} from './errors.js';
import {
  deriveDispatchIdempotencyKey,
  deriveDispatchReceiptId,
} from './identity.js';
import { verifyDispatchReceiptIntegrity } from './integrity.js';

import type { VerifiedLedgerEvent } from '../authorized-ledger/index.js';
import type {
  DispatchReceiptEvidence,
  DispatchReceiptMacProvider,
  DispatchReceiptMacVerification,
  DispatchReceiptPayload,
  DispatchResumeDecision,
  ResumeDispatchInput,
  VerifiedDispatchResultEvidence,
} from './types.js';

// ───────────────────────────────────────────────────────────────────
// 1. PROJECTION TYPES
// ───────────────────────────────────────────────────────────────────

export type VerifiedDispatchReceiptProjection =
  | {
      readonly classification: 'not_dispatched';
    }
  | {
      readonly classification: 'dispatch_resolved';
      readonly evidence: DispatchReceiptEvidence;
      readonly macVerification: DispatchReceiptMacVerification;
      readonly payload: DispatchReceiptPayload;
      readonly verified: VerifiedLedgerEvent;
    };

// ───────────────────────────────────────────────────────────────────
// 2. HELPERS
// ───────────────────────────────────────────────────────────────────

const HASH_PATTERN = /^[a-f0-9]{64}$/;
const INVOCATION_FINGERPRINT_PATTERN = /^inv:[a-f0-9]{64}$/;

function errorCode(error: unknown): string {
  if (
    error instanceof DispatchReceiptError
    || error instanceof AuthorizedLedgerError
    || error instanceof EventEnvelopeError
  ) {
    return error.code;
  }
  return DispatchReceiptErrorCodes.RECEIPT_EVIDENCE_CORRUPT;
}

function validateResult(
  result: VerifiedDispatchResultEvidence,
  payload: DispatchReceiptPayload,
): 'exact' | 'conflict' {
  if (
    result.verified !== true
    || typeof result.resultId !== 'string'
    || result.resultId.trim() === ''
    || !HASH_PATTERN.test(result.resultDigest)
  ) {
    throw new DispatchReceiptError(
      DispatchReceiptErrorCodes.RECEIPT_EVIDENCE_CORRUPT,
      'resume',
      'Successor result evidence is malformed or unverified',
    );
  }
  return result.dispatchId === payload.dispatch_id
    && result.receiptId === payload.receipt_id
    && result.invocationFingerprint === payload.invocation_fingerprint
    ? 'exact'
    : 'conflict';
}

// ───────────────────────────────────────────────────────────────────
// 3. VERIFIED PROJECTION
// ───────────────────────────────────────────────────────────────────

/** Fold only ledger-verified events into one exact dispatch receipt slot. */
export function projectVerifiedDispatchReceipt(
  events: readonly VerifiedLedgerEvent[],
  dispatchId: string,
  macProviders: readonly DispatchReceiptMacProvider[] = [],
): VerifiedDispatchReceiptProjection {
  const receiptId = deriveDispatchReceiptId(dispatchId);
  const candidates = events.filter((verified) => (
    verified.event.effective.envelope.event_type === LINEAGE_DISPATCH_RESOLVED_EVENT_TYPE
    && (
      verified.event.effective.envelope.event_id === receiptId
      || verified.event.effective.envelope.payload.dispatch_id === dispatchId
    )
  ));
  if (candidates.length === 0) return Object.freeze({ classification: 'not_dispatched' });
  if (candidates.length !== 1) {
    throw new DispatchReceiptError(
      DispatchReceiptErrorCodes.RECEIPT_EVIDENCE_CORRUPT,
      'resume',
      'Multiple verified receipt events claim one dispatch identity',
      { dispatchId },
    );
  }

  const verified = candidates[0];
  const envelope = verified.event.effective.envelope;
  const payload = asDispatchReceiptPayload(envelope.payload);
  if (
    envelope.event_version !== LINEAGE_DISPATCH_RESOLVED_EVENT_VERSION
    || envelope.event_id !== receiptId
    || envelope.idempotency_key !== deriveDispatchIdempotencyKey(dispatchId)
    || payload.dispatch_id !== dispatchId
    || payload.receipt_id !== receiptId
  ) {
    throw new DispatchReceiptError(
      DispatchReceiptErrorCodes.RECEIPT_EVIDENCE_CORRUPT,
      'resume',
      'Dispatch receipt identity is not bound to its envelope slot',
      { sequence: verified.frame.sequence },
    );
  }
  const macVerification = verifyDispatchReceiptIntegrity(payload, macProviders);
  const { evidence } = dispatchReceiptEvidenceFromVerified(verified, 'dispatch-resolved');
  return Object.freeze({
    classification: 'dispatch_resolved',
    evidence,
    macVerification,
    payload,
    verified,
  });
}

// ───────────────────────────────────────────────────────────────────
// 4. RESUME CLASSIFICATION
// ───────────────────────────────────────────────────────────────────

/** Classify never-dispatched, resolved, and receipt-only states without mutable checkpoints. */
export async function resumeDispatchFromVerifiedLedger(
  input: ResumeDispatchInput,
): Promise<DispatchResumeDecision> {
  if (!(input.ledger instanceof AppendOnlyLedger)) {
    return Object.freeze({
      authority: 'ledger',
      classification: 'corrupt',
      eligibleForFirstDispatch: false,
      reasonCode: DispatchReceiptErrorCodes.RECEIPT_EVIDENCE_CORRUPT,
    });
  }
  if (!INVOCATION_FINGERPRINT_PATTERN.test(input.desiredInvocationFingerprint)) {
    return Object.freeze({
      authority: 'ledger',
      classification: 'corrupt',
      eligibleForFirstDispatch: false,
      reasonCode: DispatchReceiptErrorCodes.INVALID_INPUT,
    });
  }

  try {
    const events = await input.ledger.readVerifiedEvents();
    const projection = projectVerifiedDispatchReceipt(
      events,
      input.dispatchId,
      input.macProviders,
    );
    if (projection.classification === 'not_dispatched') {
      return Object.freeze({
        authority: 'ledger',
        classification: 'not_dispatched',
        eligibleForFirstDispatch: true,
      });
    }
    if (projection.payload.invocation_fingerprint !== input.desiredInvocationFingerprint) {
      return Object.freeze({
        authority: 'ledger',
        classification: 'conflict',
        eligibleForFirstDispatch: false,
        evidence: projection.evidence,
        needsNewAuthorizedDispatchIdentity: true,
        reasonCode: 'DESIRED_FINGERPRINT_MISMATCH',
      });
    }

    if (input.result) {
      if (validateResult(input.result, projection.payload) === 'conflict') {
        return Object.freeze({
          authority: 'ledger',
          classification: 'conflict',
          eligibleForFirstDispatch: false,
          evidence: projection.evidence,
          needsNewAuthorizedDispatchIdentity: true,
          reasonCode: 'RESULT_BINDING_MISMATCH',
        });
      }
      return Object.freeze({
        authority: 'ledger',
        classification: 'result_recorded',
        eligibleForFirstDispatch: false,
        evidence: projection.evidence,
        macVerification: projection.macVerification,
        result: input.result,
      });
    }

    const handoff = unresolvedDispatchHandoff(projection.evidence);
    if (input.routeUnresolved) {
      try {
        await input.routeUnresolved(handoff);
      } catch {
        throw new DispatchReceiptError(
          DispatchReceiptErrorCodes.RECOVERY_ROUTING_FAILED,
          'recovery',
          'Receipt-only dispatch could not enter recovery and salvage routing',
          { dispatchId: input.dispatchId },
        );
      }
    }
    return Object.freeze({
      authority: 'ledger',
      classification: 'unresolved',
      eligibleForFirstDispatch: false,
      evidence: handoff.evidence,
      handoff,
      macVerification: projection.macVerification,
    });
  } catch (error: unknown) {
    return Object.freeze({
      authority: 'ledger',
      classification: 'corrupt',
      eligibleForFirstDispatch: false,
      reasonCode: errorCode(error),
    });
  }
}
