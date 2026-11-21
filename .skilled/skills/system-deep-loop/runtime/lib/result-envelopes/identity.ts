// ─────────────────────────────────────────────────────────────────
// MODULE: Result Envelope Identity
// ──────────────────────────────────────────────────────────────────

import { canonicalBytes, sha256Bytes } from '../event-envelope/index.js';

import type { JsonObject } from '../event-envelope/index.js';

function identity(prefix: string, value: JsonObject): string {
  return `${prefix}:${sha256Bytes(canonicalBytes(value))}`;
}

/** Returns `leaf-result:` plus the SHA-256 of the canonical bytes of the dispatch receipt id. */
export function deriveResultEnvelopeId(dispatchReceiptId: string): string {
  return identity('leaf-result', { dispatch_receipt_id: dispatchReceiptId });
}

/** Returns `leaf-result-write:` plus the SHA-256 of the canonical bytes of the dispatch receipt id. */
export function deriveResultIdempotencyKey(dispatchReceiptId: string): string {
  return identity('leaf-result-write', { dispatch_receipt_id: dispatchReceiptId });
}

interface SalvageEventIdentityInput {
  readonly dispatchReceiptId: string;
  readonly parserName: string;
  readonly parserVersion: string;
  readonly recoveredScope: JsonObject;
  readonly sourceKind: string;
  readonly sourceReference: string;
}

/** Returns `leaf-salvage:` plus the SHA-256 of the canonical receipt, parser, recovered scope and source fields. */
export function deriveSalvageEventId(input: SalvageEventIdentityInput): string {
  return identity('leaf-salvage', {
    dispatch_receipt_id: input.dispatchReceiptId,
    parser_name: input.parserName,
    parser_version: input.parserVersion,
    recovered_scope: input.recoveredScope,
    source_kind: input.sourceKind,
    source_reference: input.sourceReference,
  });
}

/** Returns `leaf-salvage-write:` plus the SHA-256 of the canonical bytes of the salvage event id. */
export function deriveSalvageIdempotencyKey(salvageEventId: string): string {
  return identity('leaf-salvage-write', { salvage_event_id: salvageEventId });
}

/** Returns `leaf-recovery:` plus the SHA-256 of the canonical dispatch receipt and source effect event ids. */
export function deriveRecoveryLinkId(
  dispatchReceiptId: string,
  sourceEffectEventId: string,
): string {
  return identity('leaf-recovery', {
    dispatch_receipt_id: dispatchReceiptId,
    source_effect_event_id: sourceEffectEventId,
  });
}

/** Returns `leaf-recovery-write:` plus the SHA-256 of the canonical bytes of the recovery link id. */
export function deriveRecoveryIdempotencyKey(recoveryLinkId: string): string {
  return identity('leaf-recovery-write', { recovery_link_id: recoveryLinkId });
}
