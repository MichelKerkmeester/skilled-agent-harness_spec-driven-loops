// ───────────────────────────────────────────────────────────────────
// MODULE: Boundary Receipt Issuance and Verification
// ───────────────────────────────────────────────────────────────────

import {
  CURRENT_ENVELOPE_VERSION,
  canonicalBytes,
  canonicalJson,
  prepareEventWrite,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  CertificationProviderRegistry,
  certifyBoundaryReceipt,
  verifyBoundaryReceiptCertification,
} from './certification.js';
import {
  BOUNDARY_RECEIPT_EVENT_TYPE,
  BoundaryRegistry,
} from './event-contracts.js';
import {
  ReceiptEffectError,
  ReceiptEffectErrorCodes,
} from './errors.js';

import type {
  DurableAppendReceipt,
  VerifiedLedgerEvent,
} from '../authorized-ledger/index.js';
import type {
  EventProducer,
  EventTypeRegistry,
  EventWritePreflight,
  JsonObject,
} from '../event-envelope/index.js';
import type {
  AuthorizedEvidenceAppendResult,
  BoundaryDefinition,
  BoundaryReceiptIssueInput,
  BoundaryReceiptIssueResult,
  BoundaryReceiptPayload,
  CertificationProfile,
  LedgerHeadFacts,
} from './types.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────────

interface ReceiptWriter {
  append(event: EventWritePreflight): Promise<AuthorizedEvidenceAppendResult>;
  findEvent(eventId: string): Promise<VerifiedLedgerEvent | null>;
  readVerifiedEvents(): Promise<readonly VerifiedLedgerEvent[]>;
}

export interface BoundaryReceiptIssuerOptions {
  readonly writer: ReceiptWriter;
  readonly registry: EventTypeRegistry;
  readonly boundaries: BoundaryRegistry;
  readonly providers: CertificationProviderRegistry;
  readonly producer: EventProducer;
  readonly now?: () => Date;
}

// ───────────────────────────────────────────────────────────────────
// 2. HELPERS
// ───────────────────────────────────────────────────────────────────

function asPayload(verified: VerifiedLedgerEvent): Readonly<JsonObject> {
  return verified.event.effective.envelope.payload;
}

function profileFromPayload(payload: Readonly<BoundaryReceiptPayload>): CertificationProfile {
  return Object.freeze({
    scheme: payload.certification.scheme,
    provider_id: payload.certification.provider_id,
    key_id: payload.certification.key_id,
    verifier_version: payload.certification.verifier_version,
    trust_scope: payload.certification.trust_scope,
  });
}

function headFacts(
  ledgerId: string,
  sequence: number,
  recordHash: string,
): LedgerHeadFacts {
  return Object.freeze({
    ledger_id: ledgerId,
    sequence,
    record_hash: recordHash,
  });
}

function receiptKey(
  input: BoundaryReceiptIssueInput,
  definition: BoundaryDefinition,
  authorityEpoch: number,
): string {
  const digest = sha256Bytes(canonicalBytes({
    namespace: 'boundary-receipt-v1',
    boundary_id: input.boundaryId,
    boundary_kind: definition.boundaryKind,
    scope_id: input.scopeId,
    authority_epoch: authorityEpoch,
  }));
  return `boundary-receipt:v1:${digest}`;
}

function receiptIdFor(idempotencyKey: string): string {
  return `boundary-receipt-${sha256Bytes(canonicalBytes(idempotencyKey))}`;
}

function artifactDigests(payload: Readonly<JsonObject>): string[] {
  return [...(payload.artifact_digests as string[])].sort();
}

function assertResultContract(
  verified: VerifiedLedgerEvent,
  input: BoundaryReceiptIssueInput,
  definition: BoundaryDefinition,
): void {
  const envelope = verified.event.effective.envelope;
  const payload = asPayload(verified);
  if (
    envelope.event_type !== definition.resultEventType
    || payload.boundary_id !== input.boundaryId
    || payload.scope_id !== input.scopeId
    || !definition.allowedFromStates.includes(String(payload.from_state))
    || payload.to_state !== definition.toState
    || payload.result_code !== definition.resultCode
  ) {
    throw new ReceiptEffectError(
      ReceiptEffectErrorCodes.BOUNDARY_RESULT_INVALID,
      'receipt',
      'Committed boundary result does not satisfy the registered transition contract',
      { boundaryId: input.boundaryId, resultEventId: input.resultEventId },
    );
  }
}

function stableReceiptFacts(
  payload: Readonly<BoundaryReceiptPayload>,
): JsonObject {
  return {
    receipt_id: payload.receipt_id,
    boundary_id: payload.boundary_id,
    boundary_kind: payload.boundary_kind,
    scope: payload.scope,
    scope_id: payload.scope_id,
    from_state: payload.from_state,
    to_state: payload.to_state,
    from_head: payload.from_head,
    result_head: payload.result_head,
    result_event_id: payload.result_event_id,
    result_event_type: payload.result_event_type,
    result_event_digest: payload.result_event_digest,
    result_code: payload.result_code,
    evidence_digest: payload.evidence_digest,
    artifact_digests: [...payload.artifact_digests],
    replay_fingerprint: payload.replay_fingerprint,
    authority_epoch: payload.authority_epoch,
    correlation_id: payload.correlation_id,
    causation_id: payload.causation_id,
    issuer: payload.issuer,
    idempotency_key: payload.idempotency_key,
    certification_profile: profileFromPayload(payload),
  };
}

function expectedStableFacts(
  result: VerifiedLedgerEvent,
  input: BoundaryReceiptIssueInput,
  definition: BoundaryDefinition,
  idempotencyKey: string,
): JsonObject {
  const envelope = result.event.effective.envelope;
  const payload = asPayload(result);
  return {
    receipt_id: receiptIdFor(idempotencyKey),
    boundary_id: input.boundaryId,
    boundary_kind: definition.boundaryKind,
    scope: definition.scope,
    scope_id: input.scopeId,
    from_state: String(payload.from_state),
    to_state: definition.toState,
    from_head: headFacts(
      result.frame.ledger_id,
      result.frame.sequence - 1,
      result.frame.prev_record_hash,
    ),
    result_head: headFacts(
      result.frame.ledger_id,
      result.frame.sequence,
      result.frame.record_hash,
    ),
    result_event_id: envelope.event_id,
    result_event_type: envelope.event_type,
    result_event_digest: result.event.stored.digest,
    result_code: definition.resultCode,
    evidence_digest: String(payload.evidence_digest),
    artifact_digests: artifactDigests(payload),
    replay_fingerprint: String(payload.replay_fingerprint),
    authority_epoch: envelope.authority_epoch,
    correlation_id: envelope.correlation_id,
    causation_id: envelope.event_id,
    issuer: input.issuer,
    idempotency_key: idempotencyKey,
    certification_profile: input.certificationProfile,
  };
}

function receiptFromVerified(verified: VerifiedLedgerEvent): DurableAppendReceipt {
  return Object.freeze({
    ...verified.frame.receipt,
    canonicalEventHash: verified.frame.canonical_event_hash,
    recordHash: verified.frame.record_hash,
    authorizationRef: verified.frame.authorization_ref,
  });
}

function preparedFromVerified(
  verified: VerifiedLedgerEvent,
  registry: EventTypeRegistry,
): EventWritePreflight {
  return prepareEventWrite(verified.event.effective.envelope, registry);
}

function isReceiptEvent(verified: VerifiedLedgerEvent): boolean {
  return verified.event.effective.envelope.event_type === BOUNDARY_RECEIPT_EVENT_TYPE;
}

// ───────────────────────────────────────────────────────────────────
// 3. VERIFICATION
// ───────────────────────────────────────────────────────────────────

/** Verify certification plus exact durable result/head ordering. */
export async function verifyBoundaryReceiptEvent(
  receiptEvent: VerifiedLedgerEvent,
  events: readonly VerifiedLedgerEvent[],
  boundaries: BoundaryRegistry,
  providers: CertificationProviderRegistry,
): Promise<BoundaryReceiptPayload> {
  if (!isReceiptEvent(receiptEvent)) {
    throw new ReceiptEffectError(
      ReceiptEffectErrorCodes.RECEIPT_INVALID,
      'receipt',
      'Verified event is not a boundary receipt',
      { eventType: receiptEvent.event.effective.envelope.event_type },
    );
  }
  const payload = receiptEvent.event.effective.envelope.payload as BoundaryReceiptPayload;
  const definition = boundaries.resolve(payload.boundary_kind);
  const result = events.find(
    (candidate) => candidate.event.effective.envelope.event_id === payload.result_event_id,
  );
  if (!result || result.frame.sequence >= receiptEvent.frame.sequence) {
    throw new ReceiptEffectError(
      ReceiptEffectErrorCodes.RECEIPT_INVALID,
      'receipt',
      'Receipt does not follow its durable boundary result',
      { receiptId: payload.receipt_id, resultEventId: payload.result_event_id },
    );
  }
  const expectedInput: BoundaryReceiptIssueInput = {
    boundaryId: payload.boundary_id,
    boundaryKind: payload.boundary_kind,
    scopeId: payload.scope_id,
    resultEventId: payload.result_event_id,
    issuer: payload.issuer,
    certificationProfile: profileFromPayload(payload),
  };
  assertResultContract(result, expectedInput, definition);
  const expectedKey = receiptKey(expectedInput, definition, result.event.effective.envelope.authority_epoch);
  const expected = expectedStableFacts(result, expectedInput, definition, expectedKey);
  if (canonicalJson(stableReceiptFacts(payload)) !== canonicalJson(expected)) {
    throw new ReceiptEffectError(
      ReceiptEffectErrorCodes.RECEIPT_INVALID,
      'receipt',
      'Receipt facts do not match the verified result event and ledger heads',
      { receiptId: payload.receipt_id },
    );
  }
  await verifyBoundaryReceiptCertification(payload, providers, true);
  return payload;
}

// ───────────────────────────────────────────────────────────────────
// 4. ISSUER
// ───────────────────────────────────────────────────────────────────

/** Post-result issuer that records every receipt through the authorized writer. */
export class BoundaryReceiptIssuer {
  readonly #options: BoundaryReceiptIssuerOptions;
  readonly #now: () => Date;
  readonly #locks = new Map<string, Promise<void>>();

  public constructor(options: BoundaryReceiptIssuerOptions) {
    this.#options = options;
    this.#now = options.now ?? (() => new Date());
  }

  /** Issue once, or return the exact previously verified receipt. */
  public async issue(input: BoundaryReceiptIssueInput): Promise<BoundaryReceiptIssueResult> {
    if (input.certificationProfile.trust_scope !== 'durable-cross-resume') {
      throw new ReceiptEffectError(
        ReceiptEffectErrorCodes.DURABLE_CERTIFICATION_REQUIRED,
        'certification',
        'Boundary receipts require a restart-verifiable certification provider',
        { providerId: input.certificationProfile.provider_id },
      );
    }
    const definition = this.#options.boundaries.resolve(input.boundaryKind);
    const events = await this.#options.writer.readVerifiedEvents();
    const result = events.find(
      (candidate) => candidate.event.effective.envelope.event_id === input.resultEventId,
    );
    if (!result) {
      throw new ReceiptEffectError(
        ReceiptEffectErrorCodes.BOUNDARY_RESULT_MISSING,
        'receipt',
        'Boundary result is not present in the verified ledger',
        { resultEventId: input.resultEventId },
      );
    }
    assertResultContract(result, input, definition);
    const idempotencyKey = receiptKey(
      input,
      definition,
      result.event.effective.envelope.authority_epoch,
    );
    return this.#withLock(idempotencyKey, () => this.#issueLocked(
      input,
      definition,
      result,
      idempotencyKey,
    ));
  }

  async #issueLocked(
    input: BoundaryReceiptIssueInput,
    definition: BoundaryDefinition,
    result: VerifiedLedgerEvent,
    idempotencyKey: string,
  ): Promise<BoundaryReceiptIssueResult> {
    const receiptId = receiptIdFor(idempotencyKey);
    const existing = await this.#options.writer.findEvent(receiptId);
    if (existing) {
      const payload = existing.event.effective.envelope.payload as BoundaryReceiptPayload;
      const expected = expectedStableFacts(result, input, definition, idempotencyKey);
      if (!isReceiptEvent(existing) || canonicalJson(stableReceiptFacts(payload)) !== canonicalJson(expected)) {
        throw new ReceiptEffectError(
          ReceiptEffectErrorCodes.RECEIPT_CONFLICT,
          'receipt',
          'Receipt identity is already bound to different boundary facts',
          { receiptId },
        );
      }
      await verifyBoundaryReceiptEvent(
        existing,
        await this.#options.writer.readVerifiedEvents(),
        this.#options.boundaries,
        this.#options.providers,
      );
      return Object.freeze({
        status: 'idempotent',
        payload,
        receipt: receiptFromVerified(existing),
        event: preparedFromVerified(existing, this.#options.registry),
      });
    }

    const resultEnvelope = result.event.effective.envelope;
    const resultPayload = asPayload(result);
    const unsigned: Omit<BoundaryReceiptPayload, 'certification'> = {
      receipt_id: receiptId,
      boundary_id: input.boundaryId,
      boundary_kind: definition.boundaryKind,
      scope: definition.scope,
      scope_id: input.scopeId,
      from_state: String(resultPayload.from_state),
      to_state: definition.toState,
      from_head: headFacts(
        result.frame.ledger_id,
        result.frame.sequence - 1,
        result.frame.prev_record_hash,
      ),
      result_head: headFacts(
        result.frame.ledger_id,
        result.frame.sequence,
        result.frame.record_hash,
      ),
      result_event_id: resultEnvelope.event_id,
      result_event_type: resultEnvelope.event_type,
      result_event_digest: result.event.stored.digest,
      result_code: definition.resultCode,
      evidence_digest: String(resultPayload.evidence_digest),
      artifact_digests: artifactDigests(resultPayload),
      replay_fingerprint: String(resultPayload.replay_fingerprint),
      authority_epoch: resultEnvelope.authority_epoch,
      correlation_id: resultEnvelope.correlation_id,
      causation_id: resultEnvelope.event_id,
      issuer: input.issuer,
      issued_at: input.issuedAt ?? this.#now().toISOString(),
      idempotency_key: idempotencyKey,
    };
    const certification = await certifyBoundaryReceipt(
      unsigned,
      input.certificationProfile,
      this.#options.providers,
    );
    const payload = Object.freeze({
      ...unsigned,
      certification,
    }) as unknown as BoundaryReceiptPayload;
    const event = prepareEventWrite({
      envelope_version: CURRENT_ENVELOPE_VERSION,
      event_id: receiptId,
      event_type: BOUNDARY_RECEIPT_EVENT_TYPE,
      event_version: 1,
      stream_id: `boundary-receipt:${input.boundaryId}`,
      stream_sequence: 1,
      occurred_at: payload.issued_at,
      recorded_at: payload.issued_at,
      producer: this.#options.producer,
      authority_epoch: payload.authority_epoch,
      correlation_id: payload.correlation_id,
      causation_id: payload.causation_id,
      idempotency_key: payload.idempotency_key,
      payload,
    }, this.#options.registry);
    const appended = await this.#options.writer.append(event);
    const allEvents = await this.#options.writer.readVerifiedEvents();
    await verifyBoundaryReceiptEvent(
      appended.verified,
      allEvents,
      this.#options.boundaries,
      this.#options.providers,
    );
    return Object.freeze({
      status: appended.status,
      payload,
      receipt: appended.receipt,
      event,
    });
  }

  async #withLock<TResult>(key: string, operation: () => Promise<TResult>): Promise<TResult> {
    const prior = this.#locks.get(key) ?? Promise.resolve();
    let release: () => void = () => undefined;
    const current = new Promise<void>((resolve) => { release = resolve; });
    const chained = prior.then(() => current);
    this.#locks.set(key, chained);
    await prior;
    try {
      return await operation();
    } finally {
      release();
      if (this.#locks.get(key) === chained) this.#locks.delete(key);
    }
  }
}
