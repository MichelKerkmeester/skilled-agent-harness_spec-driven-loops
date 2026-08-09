// ───────────────────────────────────────────────────────────────────
// MODULE: In-Flight State Migration Coordinator
// ───────────────────────────────────────────────────────────────────

import { mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { canonicalBytes, sha256Bytes } from '../event-envelope/index.js';
import {
  ClassificationReasonCodes,
  InflightDisposition,
  isClassificationEvidence,
  verifyClassificationManifest,
} from '../inflight-state-classification/index.js';
import { FencedLeaseCoordinator, LocksAndFencingError } from '../locks-and-fencing/index.js';
import { readUtf8IfExists, writeCanonicalJsonAtomic } from '../locks-and-fencing/durable-file.js';
import {
  assertEnvelopeContinuity,
  buildBlockMigrationEnvelope,
  buildMigrationEnvelope,
  evidenceMatchesFrozenRow,
  verifyMigrationEnvelope,
} from './migration-envelope.js';
import { snapshotDigest } from './migration-integrity.js';
import {
  executeBlock,
  executeFork,
  executeMigrate,
  executePin,
  executeUpcast,
} from './migration-dispositions.js';
import {
  InflightMigrationError,
  InflightMigrationErrorCodes,
  MigrationOperationStatuses,
  TERMINAL_MIGRATION_STATUSES,
} from './migration-types.js';

import type {
  ClassificationEvidence,
  ClassifiedInflightStateRow,
} from '../inflight-state-classification/index.js';
import type { JsonObject } from '../event-envelope/index.js';
import type {
  MigrationCoordinatorOptions,
  MigrationEnvelope,
  MigrationOutcome,
  MigrationReceipt,
  MigrationReceiptCore,
  RunMigrationRowRequest,
  RunMigrationRowResult,
} from './migration-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS AND HELPERS
// ───────────────────────────────────────────────────────────────────

const SHA256_PATTERN = /^[a-f0-9]{64}$/u;
/** `computeIntegrityHash` (atomic-state.ts) prefixes its digest; preserved as-is, not stripped, to stay byte-faithful to the reused primitive. */
const INTEGRITY_SNAPSHOT_PATTERN = /^sha256:[a-f0-9]{64}$/u;
const MIGRATION_OWNER_ID = 'inflight-state-migration-coordinator';
const DEFAULT_LEASE_TTL_MS = 30_000;

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value as never));
}

function isDigest(value: unknown): value is string {
  return typeof value === 'string' && SHA256_PATTERN.test(value);
}

function isIntegritySnapshotDigest(value: unknown): value is string {
  return typeof value === 'string' && INTEGRITY_SNAPSHOT_PATTERN.test(value);
}

function isStatus(value: unknown): value is MigrationReceipt['status'] {
  return typeof value === 'string'
    && Object.values(MigrationOperationStatuses).includes(value as never);
}

function isIsoTimestamp(value: unknown): value is string {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value));
}

// ───────────────────────────────────────────────────────────────────
// 2. RECEIPT VERIFICATION
// ───────────────────────────────────────────────────────────────────

/** Recompute and rebind every field; a tampered or malformed receipt fails closed. */
export function verifyMigrationReceipt(receipt: unknown): receipt is MigrationReceipt {
  try {
    if (typeof receipt !== 'object' || receipt === null || Array.isArray(receipt)) return false;
    const raw = receipt as Record<string, unknown>;
    if (!isDigest(raw.receiptDigest)) return false;
    const { receiptDigest, ...core } = raw;
    if (digest(core) !== receiptDigest) return false;
    if (
      core.receiptVersion !== 1
      || typeof core.envelope !== 'object'
      || core.envelope === null
      || !verifyMigrationEnvelope(core.envelope as MigrationEnvelope)
      || !isStatus(core.status)
      || !Number.isSafeInteger(core.fenceToken)
      || (core.fenceToken as number) < 0
      || !isIntegritySnapshotDigest(core.preIntegrityDigest)
      || (core.postIntegrityDigest !== null && !isIntegritySnapshotDigest(core.postIntegrityDigest))
      || !Number.isSafeInteger(core.attempt)
      || (core.attempt as number) < 1
      || !isIsoTimestamp(core.startedAt)
      || (core.committedAt !== null && !isIsoTimestamp(core.committedAt))
      || (core.reasonCode !== null && typeof core.reasonCode !== 'string')
    ) return false;
    const status = core.status as MigrationReceipt['status'];
    if (TERMINAL_MIGRATION_STATUSES.has(status) && status !== MigrationOperationStatuses.ABORTED) {
      if (core.committedAt === null || core.postIntegrityDigest === null || core.outcome === null) return false;
    }
    return true;
  } catch {
    return false;
  }
}

// ───────────────────────────────────────────────────────────────────
// 3. COORDINATOR
// ───────────────────────────────────────────────────────────────────

/**
 * Executes the classified disposition for each eligible in-flight row. Every
 * protected write happens inside `FencedLeaseCoordinator.withFence` for the
 * row's canonical WRITER resource, reusing the existing lease/fence
 * primitive rather than a bespoke mutex. A receipt at a terminal status is
 * itself the durable commit marker; a receipt at `operation_applied` is the
 * crash-resume boundary — a resumed attempt completes from the persisted
 * outcome instead of re-invoking the disposition executor.
 */
export class MigrationCoordinator {
  readonly #rootDirectory: string;
  readonly #coordinator: FencedLeaseCoordinator;
  readonly #now: () => Date;
  readonly #faultInjection: MigrationCoordinatorOptions['faultInjection'];

  public constructor(options: MigrationCoordinatorOptions) {
    if (!options || typeof options.rootDirectory !== 'string' || options.rootDirectory.trim() === '') {
      throw new TypeError('Migration coordinator requires a rootDirectory');
    }
    this.#rootDirectory = resolve(options.rootDirectory);
    this.#coordinator = new FencedLeaseCoordinator({ rootDirectory: this.#rootDirectory });
    this.#now = options.now ?? (() => new Date());
    this.#faultInjection = options.faultInjection;
    mkdirSync(this.#receiptDirectory(), { recursive: true });
  }

  /** Read the durable receipt for one row without acquiring a lease. */
  public peekReceipt(manifestDigest: string, rowId: string): MigrationReceipt | null {
    return this.#readReceipt(this.#receiptPath(manifestDigest, rowId));
  }

  /**
   * Run exactly one migration row to closure. Idempotent: a call for a row
   * whose receipt is already terminal returns that receipt unchanged and
   * never re-executes the disposition.
   */
  public async runRow(request: RunMigrationRowRequest): Promise<RunMigrationRowResult> {
    const { manifest, row } = request;
    if (!verifyClassificationManifest(manifest)) {
      throw new InflightMigrationError(
        InflightMigrationErrorCodes.MANIFEST_INVALID,
        'Migration requires an intact classification manifest',
        {},
      );
    }
    const manifestRow = manifest.rows.find((candidate) => candidate.rowId === row.rowId);
    if (!manifestRow || digest(manifestRow) !== digest(row)) {
      throw new InflightMigrationError(
        InflightMigrationErrorCodes.ROW_UNBOUND,
        'Row is not bound to the supplied classification manifest',
        { rowId: row.rowId },
      );
    }

    const receiptPath = this.#receiptPath(manifest.finalDigest, row.rowId);
    const existing = this.#readReceipt(receiptPath);
    if (existing && TERMINAL_MIGRATION_STATUSES.has(existing.status)) {
      return { receipt: existing, resumed: true };
    }

    const { envelope, effectiveDisposition, blockVeto, blockReasonCode, currentEvidence } =
      this.#resolveEnvelope(manifest, row, request.currentEvidence);
    assertEnvelopeContinuity(existing?.envelope ?? null, envelope);

    // A resume from `operation_applied` completes from the persisted outcome
    // without re-invoking the disposition executor, so it does not need a
    // fresh ledger context; every other MIGRATE attempt fails fast here
    // rather than acquiring a lease it cannot use to completion.
    if (
      effectiveDisposition === InflightDisposition.MIGRATE
      && !request.ledgerContext
      && existing?.status !== MigrationOperationStatuses.OPERATION_APPLIED
    ) {
      throw new InflightMigrationError(
        InflightMigrationErrorCodes.LEDGER_CONTEXT_REQUIRED,
        'MIGRATE requires a caller-supplied ledger context',
        { rowId: row.rowId },
      );
    }

    const preIntegrityDigest = snapshotDigest({
      envelope: envelope as unknown as Record<string, unknown>,
      proofDigest: currentEvidence ? digest(currentEvidence.proof) : null,
      effectiveDisposition,
      blockReasonCode,
    });
    if (existing && existing.preIntegrityDigest !== preIntegrityDigest) {
      throw new InflightMigrationError(
        InflightMigrationErrorCodes.INTEGRITY_FAILED,
        'Pre-operation integrity drifted since the last resumable attempt',
        { rowId: row.rowId },
      );
    }

    const lease = await this.#coordinator.acquire({
      resource: envelope.resource,
      ownerId: MIGRATION_OWNER_ID,
      correlationId: envelope.migrationId,
      ttlMs: DEFAULT_LEASE_TTL_MS,
    });
    try {
      const receipt = await this.#coordinator.withFence(lease, () => async () => this.#commit(
        receiptPath,
        envelope,
        effectiveDisposition,
        blockVeto,
        blockReasonCode,
        currentEvidence,
        preIntegrityDigest,
        lease.fenceToken,
        request,
      ));
      return { receipt, resumed: false };
    } catch (error: unknown) {
      if (error instanceof LocksAndFencingError || error instanceof InflightMigrationError) {
        const aborted = await this.#recordAbort(envelope, receiptPath, existing, preIntegrityDigest, error);
        if (aborted) return { receipt: aborted, resumed: false };
      }
      throw error;
    } finally {
      await this.#coordinator.release(lease).catch(() => undefined);
    }
  }

  // ───────────────────────────────────────────────────────────────
  // Preflight: freshness recheck and effective-disposition resolution
  // ───────────────────────────────────────────────────────────────

  #resolveEnvelope(
    manifest: RunMigrationRowRequest['manifest'],
    row: ClassifiedInflightStateRow,
    rawEvidence: unknown,
  ): {
    envelope: MigrationEnvelope;
    effectiveDisposition: MigrationEnvelope['operationClass'];
    blockVeto: string | null;
    blockReasonCode: string | null;
    currentEvidence: ClassificationEvidence | null;
  } {
    if (row.disposition === InflightDisposition.BLOCK) {
      return {
        envelope: buildBlockMigrationEnvelope(manifest, row),
        effectiveDisposition: InflightDisposition.BLOCK,
        blockVeto: row.rationale,
        blockReasonCode: row.reasonCode,
        currentEvidence: null,
      };
    }
    if (rawEvidence === undefined) {
      return {
        envelope: buildBlockMigrationEnvelope(manifest, row),
        effectiveDisposition: InflightDisposition.BLOCK,
        blockVeto: 'Fresh evidence at migration time is missing; the row vetoes migration.',
        blockReasonCode: ClassificationReasonCodes.MISSING_EVIDENCE,
        currentEvidence: null,
      };
    }
    if (!isClassificationEvidence(rawEvidence) || rawEvidence.rowId !== row.rowId) {
      return {
        envelope: buildBlockMigrationEnvelope(manifest, row),
        effectiveDisposition: InflightDisposition.BLOCK,
        blockVeto: 'Fresh evidence at migration time is malformed or bound to the wrong row; the row vetoes migration.',
        blockReasonCode: ClassificationReasonCodes.INVALID_EVIDENCE,
        currentEvidence: null,
      };
    }
    if (!evidenceMatchesFrozenRow(row, rawEvidence)) {
      return {
        envelope: buildBlockMigrationEnvelope(manifest, row),
        effectiveDisposition: InflightDisposition.BLOCK,
        blockVeto: 'Fresh evidence no longer matches the frozen classification row; reclassification is required.',
        blockReasonCode: ClassificationReasonCodes.CLASSIFICATION_STALE,
        currentEvidence: null,
      };
    }
    return {
      envelope: buildMigrationEnvelope(manifest, row, row.disposition, rawEvidence),
      effectiveDisposition: row.disposition,
      blockVeto: null,
      blockReasonCode: null,
      currentEvidence: rawEvidence,
    };
  }

  // ───────────────────────────────────────────────────────────────
  // Commit: runs strictly inside the caller's revalidated fence
  // ───────────────────────────────────────────────────────────────

  async #commit(
    receiptPath: string,
    envelope: MigrationEnvelope,
    effectiveDisposition: MigrationEnvelope['operationClass'],
    blockVeto: string | null,
    blockReasonCode: string | null,
    currentEvidence: ClassificationEvidence | null,
    preIntegrityDigest: string,
    fenceToken: number,
    request: RunMigrationRowRequest,
  ): Promise<MigrationReceipt> {
    const insideExisting = this.#readReceipt(receiptPath);
    if (insideExisting && TERMINAL_MIGRATION_STATUSES.has(insideExisting.status)) return insideExisting;

    if (effectiveDisposition === InflightDisposition.BLOCK) {
      const outcome = executeBlock(blockVeto ?? 'blocked', blockReasonCode ?? ClassificationReasonCodes.POLICY_BLOCK);
      return this.#writeTerminalReceipt(
        receiptPath, envelope, MigrationOperationStatuses.BLOCKED, fenceToken,
        preIntegrityDigest, outcome, blockReasonCode, insideExisting,
      );
    }

    if (currentEvidence === null) {
      throw new InflightMigrationError(
        InflightMigrationErrorCodes.DISPOSITION_MISMATCH,
        'A non-BLOCK disposition requires fresh evidence, none was resolved',
        { rowId: envelope.rowId },
      );
    }

    let outcome: MigrationOutcome;
    if (
      insideExisting !== null
      && insideExisting.status === MigrationOperationStatuses.OPERATION_APPLIED
      && insideExisting.outcome !== null
    ) {
      outcome = insideExisting.outcome;
    } else {
      outcome = await this.#runDisposition(effectiveDisposition, envelope, currentEvidence, request);
      const appliedCore: MigrationReceiptCore = Object.freeze({
        receiptVersion: 1,
        envelope,
        status: MigrationOperationStatuses.OPERATION_APPLIED,
        fenceToken,
        preIntegrityDigest,
        postIntegrityDigest: null,
        outcome,
        reasonCode: null,
        attempt: (insideExisting?.attempt ?? 0) + 1,
        startedAt: insideExisting?.startedAt ?? this.#now().toISOString(),
        committedAt: null,
      });
      this.#writeReceipt(receiptPath, Object.freeze({ ...appliedCore, receiptDigest: digest(appliedCore) }));
      this.#faultInjection?.afterOperationAppliedBeforeCommit?.();
    }

    return this.#writeTerminalReceipt(
      receiptPath, envelope, MigrationOperationStatuses.COMMITTED, fenceToken,
      preIntegrityDigest, outcome, null, insideExisting,
    );
  }

  async #runDisposition(
    disposition: MigrationEnvelope['operationClass'],
    envelope: MigrationEnvelope,
    currentEvidence: ClassificationEvidence,
    request: RunMigrationRowRequest,
  ): Promise<MigrationOutcome> {
    switch (disposition) {
      case InflightDisposition.UPCAST:
        return executeUpcast(envelope, currentEvidence.proof, this.#rootDirectory);
      case InflightDisposition.FORK:
        return executeFork(
          envelope,
          currentEvidence.proof,
          currentEvidence.verifier.parityCaseDigest ?? '',
          this.#rootDirectory,
        );
      case InflightDisposition.PIN:
        return executePin(envelope, currentEvidence.proof);
      case InflightDisposition.MIGRATE:
        if (!request.ledgerContext) {
          throw new InflightMigrationError(
            InflightMigrationErrorCodes.LEDGER_CONTEXT_REQUIRED,
            'MIGRATE requires a caller-supplied ledger context',
            { rowId: envelope.rowId },
          );
        }
        return executeMigrate(envelope, currentEvidence.proof, request.ledgerContext);
      case InflightDisposition.BLOCK:
        throw new InflightMigrationError(
          InflightMigrationErrorCodes.DISPOSITION_MISMATCH,
          'BLOCK never reaches the live disposition executor',
          { rowId: envelope.rowId },
        );
    }
  }

  #writeTerminalReceipt(
    receiptPath: string,
    envelope: MigrationEnvelope,
    status: typeof MigrationOperationStatuses.COMMITTED | typeof MigrationOperationStatuses.BLOCKED,
    fenceToken: number,
    preIntegrityDigest: string,
    outcome: MigrationOutcome,
    reasonCode: string | null,
    insideExisting: MigrationReceipt | null,
  ): MigrationReceipt {
    const postIntegrityDigest = snapshotDigest({
      envelope: envelope as unknown as Record<string, unknown>,
      outcome: outcome as unknown as Record<string, unknown>,
    });
    const core: MigrationReceiptCore = Object.freeze({
      receiptVersion: 1,
      envelope,
      status,
      fenceToken,
      preIntegrityDigest,
      postIntegrityDigest,
      outcome,
      reasonCode,
      attempt: insideExisting?.attempt ?? 1,
      startedAt: insideExisting?.startedAt ?? this.#now().toISOString(),
      committedAt: this.#now().toISOString(),
    });
    const receipt: MigrationReceipt = Object.freeze({ ...core, receiptDigest: digest(core) });
    this.#writeReceipt(receiptPath, receipt);
    return receipt;
  }

  // ───────────────────────────────────────────────────────────────
  // Abort: best-effort durable evidence; never masks an unexpected error
  // ───────────────────────────────────────────────────────────────

  async #recordAbort(
    envelope: MigrationEnvelope,
    receiptPath: string,
    existing: MigrationReceipt | null,
    preIntegrityDigest: string,
    error: unknown,
  ): Promise<MigrationReceipt | null> {
    try {
      const lease = await this.#coordinator.acquire({
        resource: envelope.resource,
        ownerId: MIGRATION_OWNER_ID,
        correlationId: `${envelope.migrationId}:abort`,
        ttlMs: DEFAULT_LEASE_TTL_MS,
      });
      try {
        return await this.#coordinator.withFence(lease, () => () => {
          const insideExisting = this.#readReceipt(receiptPath);
          if (insideExisting && TERMINAL_MIGRATION_STATUSES.has(insideExisting.status)) return insideExisting;
          const core: MigrationReceiptCore = Object.freeze({
            receiptVersion: 1,
            envelope,
            status: MigrationOperationStatuses.ABORTED,
            fenceToken: lease.fenceToken,
            preIntegrityDigest,
            postIntegrityDigest: null,
            outcome: null,
            reasonCode: error instanceof InflightMigrationError || error instanceof LocksAndFencingError
              ? error.code
              : 'UNEXPECTED_FAILURE',
            attempt: insideExisting?.attempt ?? existing?.attempt ?? 1,
            startedAt: insideExisting?.startedAt ?? existing?.startedAt ?? this.#now().toISOString(),
            committedAt: null,
          });
          const receipt: MigrationReceipt = Object.freeze({ ...core, receiptDigest: digest(core) });
          this.#writeReceipt(receiptPath, receipt);
          return receipt;
        });
      } finally {
        await this.#coordinator.release(lease).catch(() => undefined);
      }
    } catch {
      return null;
    }
  }

  // ───────────────────────────────────────────────────────────────
  // Durable receipt storage
  // ───────────────────────────────────────────────────────────────

  #receiptDirectory(): string {
    return join(this.#rootDirectory, 'inflight-state-migration-v1', 'receipts');
  }

  #receiptPath(manifestDigest: string, rowId: string): string {
    return join(this.#receiptDirectory(), `${digest({ manifestDigest, rowId })}.json`);
  }

  #readReceipt(path: string): MigrationReceipt | null {
    const text = readUtf8IfExists(path);
    if (text === null) return null;
    let raw: unknown;
    try {
      raw = JSON.parse(text);
    } catch {
      throw new InflightMigrationError(
        InflightMigrationErrorCodes.RECEIPT_MALFORMED,
        'Migration receipt is not valid JSON',
        {},
      );
    }
    if (!verifyMigrationReceipt(raw)) {
      throw new InflightMigrationError(
        InflightMigrationErrorCodes.RECEIPT_MALFORMED,
        'Migration receipt failed integrity verification',
        {},
      );
    }
    return raw;
  }

  #writeReceipt(path: string, receipt: MigrationReceipt): void {
    writeCanonicalJsonAtomic(path, receipt as unknown as JsonObject);
  }
}
