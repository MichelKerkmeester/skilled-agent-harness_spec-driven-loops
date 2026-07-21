// ───────────────────────────────────────────────────────────────────
// MODULE: Legacy Recovery Compatibility
// ───────────────────────────────────────────────────────────────────

import { verifyReceipt } from '../deep-loop/receipt-crypto.js';
import {
  canonicalBytes,
  sha256Bytes,
} from '../event-envelope/index.js';

import type { JsonObject } from '../event-envelope/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. LEGACY SURFACE MANIFEST
// ───────────────────────────────────────────────────────────────────

export interface LegacyRecoverySurface extends JsonObject {
  readonly surface_id: string;
  readonly module: string;
  readonly evidence_role: string;
  readonly authority: 'legacy-authoritative';
  readonly dark_service_action: 'observe-only';
}

export const LEGACY_RECOVERY_SURFACES: readonly LegacyRecoverySurface[] = Object.freeze([
  Object.freeze({
    surface_id: 'dispatch-receipts',
    module: 'runtime/lib/deep-loop/executor-audit.ts',
    evidence_role: 'process-local dispatch intent and completion evidence',
    authority: 'legacy-authoritative',
    dark_service_action: 'observe-only',
  }),
  Object.freeze({
    surface_id: 'persisted-waits',
    module: 'runtime/scripts/fanout-run.cjs',
    evidence_role: 'pre-dispatch wait checkpoint and resume',
    authority: 'legacy-authoritative',
    dark_service_action: 'observe-only',
  }),
  Object.freeze({
    surface_id: 'fanout-salvage',
    module: 'runtime/scripts/fanout-salvage.cjs',
    evidence_role: 'captured-output artifact salvage',
    authority: 'legacy-authoritative',
    dark_service_action: 'observe-only',
  }),
  Object.freeze({
    surface_id: 'atomic-state',
    module: 'runtime/lib/deep-loop/atomic-state.ts',
    evidence_role: 'fsync and atomic replace publication',
    authority: 'legacy-authoritative',
    dark_service_action: 'observe-only',
  }),
  Object.freeze({
    surface_id: 'jsonl-repair',
    module: 'runtime/lib/deep-loop/jsonl-repair.ts',
    evidence_role: 'locked repair and convergent merge',
    authority: 'legacy-authoritative',
    dark_service_action: 'observe-only',
  }),
]);

export const LEGACY_RECOVERY_SURFACE_MANIFEST_DIGEST = sha256Bytes(
  canonicalBytes(LEGACY_RECOVERY_SURFACES as unknown as JsonObject[]),
);

// ───────────────────────────────────────────────────────────────────
// 2. DISPATCH RECEIPT ASSESSMENT
// ───────────────────────────────────────────────────────────────────

export interface LegacyDispatchReceiptAssessment extends JsonObject {
  readonly kind: 'legacy-dispatch-receipt';
  readonly trust_scope: 'process-local-advisory';
  readonly same_process_mac_valid: boolean | null;
  readonly durable_cross_resume_accepted: false;
}

/** Preserve legacy evidence while refusing to promote its process-local MAC. */
export function assessLegacyDispatchReceipt(
  record: Readonly<Record<string, unknown>>,
  sameProcessKey?: string,
): LegacyDispatchReceiptAssessment {
  const mac = typeof record.mac === 'string' ? record.mac : null;
  const sameProcessMacValid = sameProcessKey === undefined || mac === null
    ? null
    : verifyReceipt(record, mac, sameProcessKey);
  return Object.freeze({
    kind: 'legacy-dispatch-receipt',
    trust_scope: 'process-local-advisory',
    same_process_mac_valid: sameProcessMacValid,
    durable_cross_resume_accepted: false,
  });
}
