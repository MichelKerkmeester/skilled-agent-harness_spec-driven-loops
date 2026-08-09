// ───────────────────────────────────────────────────────────────────
// MODULE: In-Flight State Migration Successor Handoff
// ───────────────────────────────────────────────────────────────────
//
// Binds every row's terminal receipt into one machine-verifiable manifest
// for successor `002-per-mode-authority-flip`. This module never moves
// authority and never issues a cutover decision; it only proves that every
// eligible row reached exactly one safe terminal outcome.

import { canonicalBytes, sha256Bytes } from '../event-envelope/index.js';
import { verifyClassificationManifest } from '../inflight-state-classification/index.js';
import { verifyMigrationReceipt } from './migration-coordinator.js';
import {
  InflightMigrationError,
  InflightMigrationErrorCodes,
  MigrationOperationStatuses,
} from './migration-types.js';

import type { InflightClassificationManifest } from '../inflight-state-classification/index.js';
import type {
  InflightMigrationHandoff,
  InflightMigrationHandoffClosure,
  InflightMigrationHandoffCore,
  InflightMigrationHandoffRow,
  MigrationReceipt,
} from './migration-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. HELPERS
// ───────────────────────────────────────────────────────────────────

const SHA256_PATTERN = /^[a-f0-9]{64}$/u;

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value as never));
}

function isDigest(value: unknown): value is string {
  return typeof value === 'string' && SHA256_PATTERN.test(value);
}

function compareStrings(left: string, right: string): number {
  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
}

// ───────────────────────────────────────────────────────────────────
// 2. BUILD
// ───────────────────────────────────────────────────────────────────

/**
 * One receipt per manifest row is required; a row with no receipt, a
 * receipt not bound to this exact manifest digest, or any non-terminal
 * receipt makes the handoff unbuildable rather than silently omitted.
 */
export function buildInflightMigrationHandoff(
  manifest: InflightClassificationManifest,
  receiptsByRowId: ReadonlyMap<string, MigrationReceipt>,
): InflightMigrationHandoff {
  if (!verifyClassificationManifest(manifest)) {
    throw new InflightMigrationError(
      InflightMigrationErrorCodes.MANIFEST_INVALID,
      'Handoff requires an intact classification manifest',
      {},
    );
  }

  const rows: InflightMigrationHandoffRow[] = [];
  let committedRows = 0;
  let upcastRows = 0;
  let forkedRows = 0;
  let migratedRows = 0;
  let pinnedRows = 0;
  let blockedRows = 0;
  let abortedRows = 0;
  const blockedRowIds: string[] = [];
  const pinnedRowIds: string[] = [];

  for (const row of manifest.rows) {
    const receipt = receiptsByRowId.get(row.rowId);
    if (!receipt || !verifyMigrationReceipt(receipt)) {
      throw new InflightMigrationError(
        InflightMigrationErrorCodes.HANDOFF_INVALID,
        'Row has no verified migration receipt',
        { rowId: row.rowId },
      );
    }
    if (receipt.envelope.classificationManifestDigest !== manifest.finalDigest) {
      throw new InflightMigrationError(
        InflightMigrationErrorCodes.HANDOFF_INVALID,
        'Row receipt is bound to a different classification manifest',
        { rowId: row.rowId },
      );
    }
    if (receipt.envelope.rowId !== row.rowId) {
      throw new InflightMigrationError(
        InflightMigrationErrorCodes.HANDOFF_INVALID,
        'Row receipt identity does not match the manifest row it claims to cover',
        { rowId: row.rowId },
      );
    }
    // A BLOCKED receipt may legitimately diverge from the manifest's frozen
    // disposition, because fresh evidence drift at migration time downgrades
    // any live disposition to BLOCK; only a COMMITTED receipt must have
    // executed exactly the disposition the manifest froze.
    if (
      receipt.status === MigrationOperationStatuses.COMMITTED
      && receipt.envelope.operationClass !== row.disposition
    ) {
      throw new InflightMigrationError(
        InflightMigrationErrorCodes.HANDOFF_INVALID,
        'A committed receipt must execute the disposition the manifest froze',
        { rowId: row.rowId },
      );
    }

    switch (receipt.status) {
      case MigrationOperationStatuses.COMMITTED:
        committedRows += 1;
        if (receipt.envelope.operationClass === 'UPCAST') upcastRows += 1;
        else if (receipt.envelope.operationClass === 'FORK') forkedRows += 1;
        else if (receipt.envelope.operationClass === 'MIGRATE') migratedRows += 1;
        else if (receipt.envelope.operationClass === 'PIN') pinnedRows += 1;
        if (receipt.envelope.operationClass === 'PIN') pinnedRowIds.push(row.rowId);
        break;
      case MigrationOperationStatuses.BLOCKED:
        blockedRows += 1;
        blockedRowIds.push(row.rowId);
        break;
      case MigrationOperationStatuses.ABORTED:
        abortedRows += 1;
        blockedRowIds.push(row.rowId);
        break;
      default:
        throw new InflightMigrationError(
          InflightMigrationErrorCodes.HANDOFF_INVALID,
          'Only a terminal receipt status may enter the successor handoff',
          { rowId: row.rowId, status: receipt.status },
        );
    }

    rows.push(Object.freeze({
      rowId: row.rowId,
      disposition: row.disposition,
      status: receipt.status,
      receiptDigest: receipt.receiptDigest,
      rollbackAnchorId: receipt.envelope.rollbackAnchorId,
    }));
  }

  const sortedRows = [...rows].sort((left, right) => compareStrings(left.rowId, right.rowId));
  const closure: InflightMigrationHandoffClosure = Object.freeze({
    totalRows: manifest.rows.length,
    committedRows,
    upcastRows,
    forkedRows,
    migratedRows,
    pinnedRows,
    blockedRows,
    abortedRows,
    unsafeCommittedRows: 0,
  });
  const core: InflightMigrationHandoffCore = Object.freeze({
    handoffVersion: 1,
    classificationManifestDigest: manifest.finalDigest,
    rows: sortedRows,
    blockedRowIds: Object.freeze([...blockedRowIds].sort(compareStrings)),
    pinnedRowIds: Object.freeze([...pinnedRowIds].sort(compareStrings)),
    closure,
  });
  return Object.freeze({ ...core, finalDigest: digest(core) });
}

// ───────────────────────────────────────────────────────────────────
// 3. VERIFY
// ───────────────────────────────────────────────────────────────────

/** Recompute and rebind every field; incomplete or stale handoff evidence fails closed. */
export function verifyInflightMigrationHandoff(
  manifest: InflightClassificationManifest,
  handoff: InflightMigrationHandoff,
): boolean {
  try {
    if (!verifyClassificationManifest(manifest)) return false;
    const { finalDigest, ...core } = handoff;
    if (!isDigest(finalDigest) || digest(core) !== finalDigest) return false;
    if (
      core.handoffVersion !== 1
      || core.classificationManifestDigest !== manifest.finalDigest
      || core.rows.length !== manifest.rows.length
      || core.closure.totalRows !== manifest.rows.length
      || core.closure.unsafeCommittedRows !== 0
    ) return false;
    const rowIds = core.rows.map((row) => row.rowId);
    if (rowIds.length !== new Set(rowIds).size) return false;
    const sorted = [...rowIds].sort(compareStrings);
    if (sorted.some((rowId, index) => rowId !== rowIds[index])) return false;
    const manifestRowIds = new Set(manifest.rows.map((row) => row.rowId));
    if (!rowIds.every((rowId) => manifestRowIds.has(rowId))) return false;

    let committedRows = 0;
    let blockedRows = 0;
    let abortedRows = 0;
    for (const row of core.rows) {
      if (row.status === MigrationOperationStatuses.COMMITTED) committedRows += 1;
      else if (row.status === MigrationOperationStatuses.BLOCKED) blockedRows += 1;
      else if (row.status === MigrationOperationStatuses.ABORTED) abortedRows += 1;
      else return false;
      if (row.receiptDigest !== null && !isDigest(row.receiptDigest)) return false;
    }
    return core.closure.committedRows === committedRows
      && core.closure.blockedRows === blockedRows
      && core.closure.abortedRows === abortedRows;
  } catch {
    return false;
  }
}
