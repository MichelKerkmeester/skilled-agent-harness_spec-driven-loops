// ──────────────────────────────────────────────────────────────────
// MODULE: Authorized Result, Salvage, and Recovery Recording
// ───────────────────────────────────────────────────────────────────

import {
  LINEAGE_DISPATCH_RESOLVED_EVENT_TYPE,
  asDispatchReceiptPayload,
  durableAppendReceiptFromVerified,
} from '../dispatch-receipts/index.js';
import {
  prepareEventWrite,
} from '../event-envelope/index.js';
import {
  EFFECT_RECONCILED_EVENT_TYPE,
} from '../receipts-and-effect-recovery/index.js';
import {
  LEAF_RECOVERY_RECORDED_EVENT_TYPE,
  LEAF_RESULT_RECORDED_EVENT_TYPE,
  LEAF_SALVAGE_RECORDED_EVENT_TYPE,
  asLeafRecoveryPayload,
  asLeafResultPayload,
  asSalvageFragmentPayload,
  buildLeafResultPayload,
  buildRecoveryPayload,
  buildSalvagePayload,
  prepareLeafResultEvent,
  prepareRecoveryEvent,
  prepareSalvageEvent,
} from './event-contracts.js';
import {
  ResultEnvelopeError,
  ResultEnvelopeErrorCodes,
} from './errors.js';

import type { VerifiedLedgerEvent } from '../authorized-ledger/index.js';
import type { DispatchReceiptPayload } from '../dispatch-receipts/index.js';
import type { JsonObject, JsonValue } from '../event-envelope/index.js';
import type {
  RecordLeafRecoveryInput,
  RecordLeafResultInput,
  RecordedLeafResult,
  RecordSalvageFragmentInput,
} from './types.js';

interface ReceiptRecord {
  readonly payload: DispatchReceiptPayload;
  readonly verified: VerifiedLedgerEvent;
}

function conflict(message: string, details: Record<string, string | number | boolean | null>): never {
  throw new ResultEnvelopeError(ResultEnvelopeErrorCodes.CONFLICT, message, details);
}

async function receiptFor(
  writer: RecordLeafResultInput['writer'],
  receiptId: string,
): Promise<ReceiptRecord> {
  const events = await writer.readVerifiedEvents();
  const matches = events.filter((verified) => {
    const envelope = verified.event.effective.envelope;
    return envelope.event_type === LINEAGE_DISPATCH_RESOLVED_EVENT_TYPE
      && envelope.event_id === receiptId;
  });
  if (matches.length === 0) {
    throw new ResultEnvelopeError(
      ResultEnvelopeErrorCodes.MISSING_DISPATCH_RECEIPT,
      'A result or salvage fragment cannot be recorded without a verified dispatch receipt',
      { dispatchReceiptId: receiptId },
    );
  }
  if (matches.length !== 1) {
    return conflict('Dispatch receipt identity resolves to multiple verified events', {
      dispatchReceiptId: receiptId,
      matches: matches.length,
    });
  }
  const verified = matches[0]!;
  const payload = asDispatchReceiptPayload(verified.event.effective.envelope.payload);
  if (payload.receipt_id !== receiptId) {
    return conflict('Dispatch receipt payload is not bound to its envelope identity', {
      dispatchReceiptId: receiptId,
    });
  }
  return { payload, verified };
}

function recorded(
  result: Awaited<ReturnType<RecordLeafResultInput['writer']['append']>>,
  event: RecordedLeafResult['event'],
): RecordedLeafResult {
  return Object.freeze({
    authority: 'shadow',
    event,
    receipt: result.receipt,
    status: result.status,
    verified: result.verified,
  });
}

function recordedExisting(
  verified: VerifiedLedgerEvent,
  registry: RecordLeafResultInput['registry'],
): RecordedLeafResult {
  const event = prepareEventWrite(verified.event.effective.envelope, registry);
  return Object.freeze({
    authority: 'shadow',
    event,
    receipt: durableAppendReceiptFromVerified(verified),
    status: 'idempotent',
    verified,
  });
}

function pairedEvents(
  events: readonly VerifiedLedgerEvent[],
  eventType: string,
  receiptId: string,
): readonly VerifiedLedgerEvent[] {
  return events.filter((verified) => {
    const envelope = verified.event.effective.envelope;
    if (envelope.event_type !== eventType) return false;
    return envelope.payload.dispatch_receipt_id === receiptId;
  });
}

export async function recordLeafResult(
  input: RecordLeafResultInput,
): Promise<RecordedLeafResult> {
  const receipt = await receiptFor(input.writer, input.dispatchReceiptId);
  const candidatePayload = buildLeafResultPayload(
    receipt.payload,
    input.facts,
    input.context.authorityEpoch,
  );
  const candidateEvent = prepareLeafResultEvent(
    receipt.payload,
    input.facts,
    input.context,
    receipt.verified.event.effective.envelope.correlation_id,
    input.registry,
  );
  const events = await input.writer.readVerifiedEvents();
  const matches = pairedEvents(events, LEAF_RESULT_RECORDED_EVENT_TYPE, input.dispatchReceiptId);
  if (matches.length > 1) {
    return conflict('A dispatch receipt is paired to multiple result events', {
      dispatchReceiptId: input.dispatchReceiptId,
      matches: matches.length,
    });
  }
  if (matches.length === 1) {
    const existing = matches[0]!;
    const payload = asLeafResultPayload(existing.event.effective.envelope.payload);
    if (
      payload.result_envelope_id !== candidatePayload.result_envelope_id
      || payload.result_digest !== candidatePayload.result_digest
      || existing.event.stored.digest !== candidateEvent.canonicalDigest
    ) {
      return conflict('Dispatch receipt is already paired to different canonical result facts', {
        dispatchReceiptId: input.dispatchReceiptId,
        resultEnvelopeId: payload.result_envelope_id,
      });
    }
    return recordedExisting(existing, input.registry);
  }
  return recorded(await input.writer.append(candidateEvent), candidateEvent);
}

export async function recordSalvageFragment(
  input: RecordSalvageFragmentInput,
): Promise<RecordedLeafResult> {
  const receipt = await receiptFor(input.writer, input.dispatchReceiptId);
  const candidatePayload = buildSalvagePayload(
    input.dispatchReceiptId,
    input.facts,
    input.context.authorityEpoch,
  );
  const candidateEvent = prepareSalvageEvent(
    input.dispatchReceiptId,
    input.facts,
    input.context,
    receipt.verified.event.effective.envelope.correlation_id,
    input.registry,
  );
  const events = await input.writer.readVerifiedEvents();
  const existing = events.find((verified) =>
    verified.event.effective.envelope.event_id === candidatePayload.salvage_event_id) ?? null;
  if (existing) {
    const payload = asSalvageFragmentPayload(existing.event.effective.envelope.payload);
    if (
      payload.salvage_digest !== candidatePayload.salvage_digest
      || existing.event.stored.digest !== candidateEvent.canonicalDigest
    ) {
      return conflict('Salvage identity is already bound to different canonical fragment facts', {
        dispatchReceiptId: input.dispatchReceiptId,
        salvageEventId: payload.salvage_event_id,
      });
    }
    return recordedExisting(existing, input.registry);
  }
  return recorded(await input.writer.append(candidateEvent), candidateEvent);
}

function recoverySourcePayload(source: VerifiedLedgerEvent): Readonly<{
  attempt: number;
  evidence_digest: string;
  observed_at: string;
  retry_decision: 'execute_once' | 'operator_required' | 'reject' | 'synthesize_confirmation';
  terminal_status: 'confirmed' | 'conflict' | 'operator_required' | 'retrying';
  verdict: 'applied' | 'conflict' | 'in_doubt' | 'not_applied';
}> {
  const envelope = source.event.effective.envelope;
  const payload = envelope.payload as Record<string, JsonValue>;
  if (
    envelope.event_type !== EFFECT_RECONCILED_EVENT_TYPE
    || !Number.isSafeInteger(payload.attempt)
    || Number(payload.attempt) <= 0
    || typeof payload.evidence_digest !== 'string'
    || typeof payload.observed_at !== 'string'
    || !['execute_once', 'operator_required', 'reject', 'synthesize_confirmation'].includes(String(payload.retry_decision))
    || !['confirmed', 'conflict', 'operator_required', 'retrying'].includes(String(payload.terminal_status))
    || !['applied', 'conflict', 'in_doubt', 'not_applied'].includes(String(payload.verdict))
  ) {
    throw new ResultEnvelopeError(
      ResultEnvelopeErrorCodes.RECOVERY_EVIDENCE_INVALID,
      'Recovery link source is not a verified effect reconciliation event',
      { sourceEventId: envelope.event_id },
    );
  }
  return payload as unknown as ReturnType<typeof recoverySourcePayload>;
}

export async function recordLeafRecovery(
  input: RecordLeafRecoveryInput,
): Promise<RecordedLeafResult> {
  const receipt = await receiptFor(input.writer, input.dispatchReceiptId);
  const dispatchEnvelope = receipt.verified.event.effective.envelope;
  const sourceEnvelope = input.source.event.effective.envelope;
  const durableSource = await input.writer.findEvent(sourceEnvelope.event_id);
  if (
    !durableSource
    || durableSource.frame.record_hash !== input.source.frame.record_hash
    || durableSource.event.stored.digest !== input.source.event.stored.digest
  ) {
    throw new ResultEnvelopeError(
      ResultEnvelopeErrorCodes.RECOVERY_EVIDENCE_INVALID,
      'Recovery source is not the same event returned by the verified ledger reader',
      { sourceEventId: sourceEnvelope.event_id },
    );
  }
  if (
    input.expectedCorrelationId.trim() === ''
    || dispatchEnvelope.correlation_id !== input.expectedCorrelationId
    || sourceEnvelope.correlation_id !== input.expectedCorrelationId
  ) {
    throw new ResultEnvelopeError(
      ResultEnvelopeErrorCodes.RECOVERY_EVIDENCE_INVALID,
      'Recovery source correlation does not bind to the target dispatch receipt',
      {
        dispatchReceiptId: input.dispatchReceiptId,
        expectedCorrelationId: input.expectedCorrelationId,
        sourceEventId: sourceEnvelope.event_id,
      },
    );
  }
  const source = recoverySourcePayload(input.source);
  const sourceFacts = {
    attempt: source.attempt,
    evidenceDigest: source.evidence_digest,
    eventDigest: input.source.event.stored.digest,
    eventId: sourceEnvelope.event_id,
    observedAt: source.observed_at,
    retryDecision: source.retry_decision,
    terminalStatus: source.terminal_status,
    verdict: source.verdict,
  };
  const candidatePayload = buildRecoveryPayload(
    input.dispatchReceiptId,
    sourceFacts,
    input.replayFingerprint,
    input.context.authorityEpoch,
  );
  const candidateEvent = prepareRecoveryEvent(
    input.dispatchReceiptId,
    sourceFacts,
    input.replayFingerprint,
    input.context,
    receipt.verified.event.effective.envelope.correlation_id,
    input.registry,
  );
  const existing = await input.writer.findEvent(candidatePayload.recovery_link_id);
  if (existing) {
    const payload = asLeafRecoveryPayload(existing.event.effective.envelope.payload);
    if (
      payload.recovery_digest !== candidatePayload.recovery_digest
      || existing.event.stored.digest !== candidateEvent.canonicalDigest
    ) {
      return conflict('Recovery link identity is already bound to different canonical facts', {
        dispatchReceiptId: input.dispatchReceiptId,
        recoveryLinkId: payload.recovery_link_id,
      });
    }
    return recordedExisting(existing, input.registry);
  }
  return recorded(await input.writer.append(candidateEvent), candidateEvent);
}

export function resultPayloadFromVerified(event: VerifiedLedgerEvent): JsonObject {
  return asLeafResultPayload(event.event.effective.envelope.payload);
}
