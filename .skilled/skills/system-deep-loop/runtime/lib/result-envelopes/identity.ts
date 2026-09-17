// ─────────────────────────────────────────────────────────────────
// MODULE: Result Envelope Identity
// ──────────────────────────────────────────────────────────────────

import { canonicalBytes, sha256Bytes } from '../event-envelope/index.js';

import type { JsonObject } from '../event-envelope/index.js';

function identity(prefix: string, value: JsonObject): string {
  return `${prefix}:${sha256Bytes(canonicalBytes(value))}`;
}

export function deriveResultEnvelopeId(dispatchReceiptId: string): string {
  return identity('leaf-result', { dispatch_receipt_id: dispatchReceiptId });
}

export function deriveResultIdempotencyKey(dispatchReceiptId: string): string {
  return identity('leaf-result-write', { dispatch_receipt_id: dispatchReceiptId });
}

export function deriveSalvageEventId(input: Readonly<{
  dispatchReceiptId: string;
  parserName: string;
  parserVersion: string;
  recoveredScope: JsonObject;
  sourceKind: string;
  sourceReference: string;
}>): string {
  return identity('leaf-salvage', {
    dispatch_receipt_id: input.dispatchReceiptId,
    parser_name: input.parserName,
    parser_version: input.parserVersion,
    recovered_scope: input.recoveredScope,
    source_kind: input.sourceKind,
    source_reference: input.sourceReference,
  });
}

export function deriveSalvageIdempotencyKey(salvageEventId: string): string {
  return identity('leaf-salvage-write', { salvage_event_id: salvageEventId });
}

export function deriveRecoveryLinkId(
  dispatchReceiptId: string,
  sourceEffectEventId: string,
): string {
  return identity('leaf-recovery', {
    dispatch_receipt_id: dispatchReceiptId,
    source_effect_event_id: sourceEffectEventId,
  });
}

export function deriveRecoveryIdempotencyKey(recoveryLinkId: string): string {
  return identity('leaf-recovery-write', { recovery_link_id: recoveryLinkId });
}
