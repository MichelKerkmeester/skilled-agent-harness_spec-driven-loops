// ───────────────────────────────────────────────────────────────────
// MODULE: Authorized Evidence Writer
// ───────────────────────────────────────────────────────────────────

import {
  AuthorizedLedgerError,
  AuthorizedLedgerErrorCodes,
  AuthorizationReasonCodes,
} from '../authorized-ledger/index.js';
import {
  canonicalBytes,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  ReceiptEffectError,
  ReceiptEffectErrorCodes,
} from './errors.js';

import type {
  DurableAppendReceipt,
  LedgerRecordFrame,
  TransitionAuthorizationRequest,
  VerifiedLedgerEvent,
} from '../authorized-ledger/index.js';
import type { EventWritePreflight } from '../event-envelope/index.js';
import type {
  AuthorizedEvidenceAppendResult,
  AuthorizedEvidenceWriterOptions,
} from './types.js';

// ───────────────────────────────────────────────────────────────────
// 1. HELPERS
// ───────────────────────────────────────────────────────────────────

const DEFAULT_MAX_HEAD_RETRIES = 3;

function receiptFromFrame(frame: LedgerRecordFrame): DurableAppendReceipt {
  return Object.freeze({
    ...frame.receipt,
    canonicalEventHash: frame.canonical_event_hash,
    recordHash: frame.record_hash,
    authorizationRef: frame.authorization_ref,
  });
}

function requestIdFor(
  event: Readonly<EventWritePreflight>,
  priorHeadSequence: number,
  priorHeadHash: string,
): string {
  const digest = sha256Bytes(canonicalBytes({
    event_id: event.identity.eventId,
    event_digest: event.canonicalDigest,
    prior_head_sequence: priorHeadSequence,
    prior_head_hash: priorHeadHash,
  }));
  return `evidence-write-${digest}`;
}

function appendConflict(eventId: string): ReceiptEffectError {
  return new ReceiptEffectError(
    ReceiptEffectErrorCodes.AUTHORIZED_APPEND_FAILED,
    'authorization',
    'Event identity is already bound to different canonical facts',
    { eventId },
  );
}

// ───────────────────────────────────────────────────────────────────
// 2. WRITER
// ───────────────────────────────────────────────────────────────────

/** Single authorized append path for every durable event owned by this service. */
export class AuthorizedEvidenceWriter {
  readonly #options: AuthorizedEvidenceWriterOptions;
  readonly #maxHeadRetries: number;

  public constructor(options: AuthorizedEvidenceWriterOptions) {
    this.#options = options;
    this.#maxHeadRetries = options.maxHeadRetries ?? DEFAULT_MAX_HEAD_RETRIES;
    if (!Number.isSafeInteger(this.#maxHeadRetries) || this.#maxHeadRetries <= 0) {
      throw new ReceiptEffectError(
        ReceiptEffectErrorCodes.INVALID_INPUT,
        'input',
        'Authorized writer retry limit must be a positive safe integer',
        { maxHeadRetries: this.#maxHeadRetries },
      );
    }
  }

  /** Return verified events only after ledger framing and authorization linkage pass. */
  public async readVerifiedEvents(): Promise<readonly VerifiedLedgerEvent[]> {
    return this.#options.ledger.readVerifiedEvents();
  }

  /** Find one event through the verified reader without exposing storage bytes directly. */
  public async findEvent(eventId: string): Promise<VerifiedLedgerEvent | null> {
    const events = await this.readVerifiedEvents();
    return events.find(
      (verified) => verified.event.effective.envelope.event_id === eventId,
    ) ?? null;
  }

  /** Authorize and append one event, returning verified durable evidence. */
  public async append(
    event: EventWritePreflight,
  ): Promise<AuthorizedEvidenceAppendResult> {
    const existing = await this.findEvent(event.identity.eventId);
    if (existing) {
      if (existing.event.stored.digest !== event.canonicalDigest) {
        throw appendConflict(event.identity.eventId);
      }
      return Object.freeze({
        status: 'idempotent',
        receipt: receiptFromFrame(existing.frame),
        verified: existing,
      });
    }

    for (let attempt = 1; attempt <= this.#maxHeadRetries; attempt += 1) {
      const priorHead = await this.#options.ledger.getVerifiedHead();
      const authorization = this.#options.authorizationContext(event);
      const policy = this.#options.policies.resolve(
        authorization.policyId,
        authorization.policyVersion,
      );
      const request: TransitionAuthorizationRequest = {
        requestId: requestIdFor(event, priorHead.sequence, priorHead.recordHash),
        mode: authorization.mode,
        event,
        priorHead,
        priorStateVersion: authorization.priorStateVersion,
        priorStateFingerprint: authorization.priorStateFingerprint,
        actorId: authorization.actorId,
        capabilityId: authorization.capabilityId,
        authorityEpoch: authorization.authorityEpoch,
        policy: {
          policyId: policy.policyId,
          policyVersion: policy.policyVersion,
          policyDigest: policy.digest,
        },
        evidenceDigest: authorization.evidenceDigest,
      };
      const result = await this.#options.gateway.authorize(request);
      if (result.verdict === 'deny') {
        if (
          result.reasonCode === AuthorizationReasonCodes.STALE_HEAD
          && attempt < this.#maxHeadRetries
        ) {
          continue;
        }
        throw new ReceiptEffectError(
          ReceiptEffectErrorCodes.AUTHORIZATION_DENIED,
          'authorization',
          'Authorization gateway denied the evidence event',
          { eventId: event.identity.eventId, reasonCode: result.reasonCode },
        );
      }

      try {
        const receipt = await this.#options.ledger.appendAuthorized(event, result.proof);
        const verified = await this.findEvent(event.identity.eventId);
        if (!verified || verified.event.stored.digest !== event.canonicalDigest) {
          throw new ReceiptEffectError(
            ReceiptEffectErrorCodes.AUTHORIZED_APPEND_FAILED,
            'authorization',
            'Durable append did not become visible through the verified reader',
            { eventId: event.identity.eventId },
          );
        }
        return Object.freeze({ status: 'appended', receipt, verified });
      } catch (error: unknown) {
        if (
          error instanceof AuthorizedLedgerError
          && error.code === AuthorizedLedgerErrorCodes.AUTHORIZATION_INVALID
          && attempt < this.#maxHeadRetries
        ) {
          const raced = await this.findEvent(event.identity.eventId);
          if (raced) {
            if (raced.event.stored.digest !== event.canonicalDigest) {
              throw appendConflict(event.identity.eventId);
            }
            return Object.freeze({
              status: 'idempotent',
              receipt: receiptFromFrame(raced.frame),
              verified: raced,
            });
          }
          continue;
        }
        throw error;
      }
    }

    throw new ReceiptEffectError(
      ReceiptEffectErrorCodes.AUTHORIZED_APPEND_FAILED,
      'authorization',
      'Authorized append could not stabilize on a verified ledger head',
      { eventId: event.identity.eventId },
    );
  }
}
