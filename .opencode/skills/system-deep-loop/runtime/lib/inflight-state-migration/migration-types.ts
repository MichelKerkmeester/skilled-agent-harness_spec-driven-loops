// ───────────────────────────────────────────────────────────────────
// MODULE: In-Flight State Migration Types
// ───────────────────────────────────────────────────────────────────

import type { AppendOnlyLedger, DurableAppendReceipt, GatewayAllowProof } from '../authorized-ledger/index.js';
import type { EventWritePreflight, JsonObject } from '../event-envelope/index.js';
import type {
  ClassificationReasonCode,
  ClassifiedInflightStateRow,
  InflightClassificationManifest,
  InflightDisposition as InflightDispositionType,
} from '../inflight-state-classification/index.js';
import type { CanonicalProtectedResource } from '../locks-and-fencing/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. CLOSED VOCABULARIES
// ───────────────────────────────────────────────────────────────────

/**
 * Resumable coordinator boundary. A receipt at any non-terminal status is a
 * crash artifact that `runRow` must resume through rather than restart; a
 * receipt at a terminal status is itself the durable commit marker, so no
 * separate marker file is written.
 */
export const MigrationOperationStatuses = {
  PREPARED: 'prepared',
  FENCED: 'fenced',
  SNAPSHOT_VERIFIED: 'snapshot_verified',
  OPERATION_APPLIED: 'operation_applied',
  POSTCHECK_VERIFIED: 'postcheck_verified',
  COMMITTED: 'committed',
  ABORTED: 'aborted',
  BLOCKED: 'blocked',
} as const;

export type MigrationOperationStatus =
  typeof MigrationOperationStatuses[keyof typeof MigrationOperationStatuses];

export const TERMINAL_MIGRATION_STATUSES: ReadonlySet<MigrationOperationStatus> = new Set([
  MigrationOperationStatuses.COMMITTED,
  MigrationOperationStatuses.ABORTED,
  MigrationOperationStatuses.BLOCKED,
]);

export const InflightMigrationErrorCodes = {
  MANIFEST_INVALID: 'INFLIGHT_MIGRATION_MANIFEST_INVALID',
  ROW_UNBOUND: 'INFLIGHT_MIGRATION_ROW_UNBOUND',
  ENVELOPE_INVALID: 'INFLIGHT_MIGRATION_ENVELOPE_INVALID',
  ENVELOPE_CONFLICT: 'INFLIGHT_MIGRATION_ENVELOPE_CONFLICT',
  RECEIPT_MALFORMED: 'INFLIGHT_MIGRATION_RECEIPT_MALFORMED',
  RECEIPT_CONFLICT: 'INFLIGHT_MIGRATION_RECEIPT_CONFLICT',
  INTEGRITY_FAILED: 'INFLIGHT_MIGRATION_INTEGRITY_FAILED',
  DISPOSITION_MISMATCH: 'INFLIGHT_MIGRATION_DISPOSITION_MISMATCH',
  LEDGER_CONTEXT_REQUIRED: 'INFLIGHT_MIGRATION_LEDGER_CONTEXT_REQUIRED',
  LEDGER_CONTEXT_MISMATCHED: 'INFLIGHT_MIGRATION_LEDGER_CONTEXT_MISMATCHED',
  HANDOFF_INVALID: 'INFLIGHT_MIGRATION_HANDOFF_INVALID',
} as const;

export type InflightMigrationErrorCode =
  typeof InflightMigrationErrorCodes[keyof typeof InflightMigrationErrorCodes];

/** Fail-closed structural error that never carries a raw state payload. */
export class InflightMigrationError extends Error {
  public readonly code: InflightMigrationErrorCode;
  public readonly details: Readonly<Record<string, boolean | number | string>>;

  public constructor(
    code: InflightMigrationErrorCode,
    message: string,
    details: Readonly<Record<string, boolean | number | string>> = {},
  ) {
    super(message);
    this.name = 'InflightMigrationError';
    this.code = code;
    this.details = Object.freeze({ ...details });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// ───────────────────────────────────────────────────────────────────
// 2. MIGRATION ENVELOPE
// ───────────────────────────────────────────────────────────────────

/**
 * Row-level binding built fresh at every attempt from the frozen
 * classification manifest and the caller's re-read evidence. Two attempts
 * for the same manifest+row+operation always derive the same envelope
 * digest, which is what makes receipt-store resume safe: a resumed attempt
 * that recomputes a different envelope digest is treated as drift, not as
 * a continuation.
 */
export interface MigrationEnvelopeCore {
  readonly envelopeVersion: 1;
  readonly migrationId: string;
  readonly rowId: string;
  readonly classificationManifestDigest: string;
  readonly operationClass: InflightDispositionType;
  readonly sourceDigest: string;
  readonly authorityEpoch: number;
  readonly resource: CanonicalProtectedResource;
  readonly rollbackAnchorId: string;
  readonly rollbackAnchorDigest: string;
  readonly idempotencyKey: string;
}

export interface MigrationEnvelope extends MigrationEnvelopeCore {
  readonly envelopeDigest: string;
}

// ───────────────────────────────────────────────────────────────────
// 3. DISPOSITION OUTCOMES
// ───────────────────────────────────────────────────────────────────

export interface UpcastOutcome {
  readonly kind: 'upcast';
  readonly sourceBytesDigest: string;
  readonly effectiveStateDigest: string;
  readonly snapshotArtifactDigest: string;
}

export interface ForkOutcome {
  readonly kind: 'fork';
  readonly executionNamespace: string;
  readonly effectNamespace: string;
  readonly parityCaseDigest: string;
  readonly darkArtifactDigest: string;
}

export interface MigrateOutcome {
  readonly kind: 'migrate';
  readonly checkpointDigest: string;
  readonly restorationReceiptDigest: string;
  readonly ledgerEventId: string;
  readonly ledgerAppendReceiptDigest: string;
}

export interface PinOutcome {
  readonly kind: 'pin';
  readonly terminalBoundary: string;
  readonly admissionDigest: string;
}

export interface BlockOutcome {
  readonly kind: 'block';
  readonly veto: string;
  readonly blockReasonCode: string;
}

export type MigrationOutcome =
  | UpcastOutcome
  | ForkOutcome
  | MigrateOutcome
  | PinOutcome
  | BlockOutcome;

// ───────────────────────────────────────────────────────────────────
// 4. RECEIPT
// ───────────────────────────────────────────────────────────────────

export interface MigrationReceiptCore {
  readonly receiptVersion: 1;
  readonly envelope: MigrationEnvelope;
  readonly status: MigrationOperationStatus;
  readonly fenceToken: number;
  readonly preIntegrityDigest: string;
  readonly postIntegrityDigest: string | null;
  readonly outcome: MigrationOutcome | null;
  readonly reasonCode: string | null;
  readonly attempt: number;
  readonly startedAt: string;
  readonly committedAt: string | null;
}

export interface MigrationReceipt extends MigrationReceiptCore {
  readonly receiptDigest: string;
}

// ───────────────────────────────────────────────────────────────────
// 5. LEDGER IMPORT (MIGRATE only)
// ───────────────────────────────────────────────────────────────────

export interface InflightMigrationCheckpointFacts extends JsonObject {
  readonly schemaVersion: 1;
  readonly migrationId: string;
  readonly rowId: string;
  readonly classificationManifestDigest: string;
  readonly checkpointDigest: string;
  readonly restorationReceiptDigest: string;
  readonly importedAt: string;
}

export interface MigrationLedgerContext {
  readonly ledger: AppendOnlyLedger;
  readonly checkpointFacts: InflightMigrationCheckpointFacts;
  readonly event: EventWritePreflight;
  readonly proof: GatewayAllowProof;
}

export interface AppendedMigrationCheckpoint {
  readonly receipt: DurableAppendReceipt;
  readonly factsDigest: string;
}

// ───────────────────────────────────────────────────────────────────
// 6. COORDINATOR REQUEST / RESULT
// ───────────────────────────────────────────────────────────────────

/** Test-only crash-simulation seam, mirroring `CoordinatorFaultInjection`/`LedgerFaultInjection`. */
export interface MigrationCoordinatorFaultInjection {
  readonly afterOperationAppliedBeforeCommit?: () => void;
}

export interface MigrationCoordinatorOptions {
  readonly rootDirectory: string;
  readonly now?: () => Date;
  readonly faultInjection?: MigrationCoordinatorFaultInjection;
}

export interface RunMigrationRowRequest {
  readonly manifest: InflightClassificationManifest;
  readonly row: ClassifiedInflightStateRow;
  readonly currentEvidence: unknown;
  readonly ledgerContext?: MigrationLedgerContext;
}

export interface RunMigrationRowResult {
  readonly receipt: MigrationReceipt;
  readonly resumed: boolean;
}

// ───────────────────────────────────────────────────────────────────
// 7. SUCCESSOR HANDOFF
// ───────────────────────────────────────────────────────────────────

export interface InflightMigrationHandoffRow {
  readonly rowId: string;
  readonly disposition: InflightDispositionType;
  readonly status: MigrationOperationStatus;
  readonly receiptDigest: string | null;
  readonly rollbackAnchorId: string | null;
}

export interface InflightMigrationHandoffClosure {
  readonly totalRows: number;
  readonly committedRows: number;
  readonly upcastRows: number;
  readonly forkedRows: number;
  readonly migratedRows: number;
  readonly pinnedRows: number;
  readonly blockedRows: number;
  readonly abortedRows: number;
  readonly unsafeCommittedRows: 0;
}

export interface InflightMigrationHandoffCore {
  readonly handoffVersion: 1;
  readonly classificationManifestDigest: string;
  readonly rows: readonly InflightMigrationHandoffRow[];
  readonly blockedRowIds: readonly string[];
  readonly pinnedRowIds: readonly string[];
  readonly closure: InflightMigrationHandoffClosure;
}

export interface InflightMigrationHandoff extends InflightMigrationHandoffCore {
  readonly finalDigest: string;
}

export type { ClassificationReasonCode };
