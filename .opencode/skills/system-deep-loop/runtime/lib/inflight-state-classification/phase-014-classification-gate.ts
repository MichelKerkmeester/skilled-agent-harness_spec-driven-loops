// ───────────────────────────────────────────────────────────────────
// MODULE: Phase Cutover Classification Gate
// ───────────────────────────────────────────────────────────────────

import { canonicalBytes, sha256Bytes } from '../event-envelope/index.js';
import {
  classificationFreshnessDigest,
  isClassificationEvidence,
  verifyClassificationManifest,
} from './inflight-state-classifier.js';
import {
  ClassificationErrorCodes,
  ClassificationReasonCodes,
  InflightClassificationError,
  InflightDisposition,
} from './inflight-state-types.js';

import type {
  ClassificationEvidence,
  ClassificationReasonCode,
  InflightClassificationManifest,
  ModeCutoverReadiness,
  Phase014EvidenceReceipts,
  Phase014HandlingInstruction,
  Phase014HandlingPlan,
  Phase014HandlingPlanCore,
  WorkflowMode,
} from './inflight-state-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. HELPERS
// ───────────────────────────────────────────────────────────────────

const SHA256_PATTERN = /^[a-f0-9]{64}$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isDigest(value: unknown): value is string {
  return typeof value === 'string' && SHA256_PATTERN.test(value);
}

function hasOnlyKeys(
  value: Record<string, unknown>,
  allowedKeys: readonly string[],
): boolean {
  const allowed = new Set(allowedKeys);
  return Object.keys(value).every((key) => allowed.has(key))
    && allowedKeys.every((key) => Object.prototype.hasOwnProperty.call(value, key));
}

function compareStrings(left: string, right: string): number {
  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
}

function deepFreeze<T>(value: T): T {
  if (value !== null && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach((entry) => deepFreeze(entry));
    Object.freeze(value);
  }
  return value;
}

function hashValue(value: unknown): string {
  return sha256Bytes(canonicalBytes(value));
}

function indexCurrentEvidence(
  values: readonly unknown[],
  manifest: InflightClassificationManifest,
): ReadonlyMap<string, unknown> {
  const knownRows = new Set(manifest.rows.map((row) => row.rowId));
  const indexed = new Map<string, unknown>();
  for (const [index, value] of values.entries()) {
    if (!isRecord(value) || typeof value.rowId !== 'string' || !knownRows.has(value.rowId)) {
      throw new InflightClassificationError(
        ClassificationErrorCodes.EVIDENCE_UNRECOGNIZED_ROW,
        'Current evidence cannot be bound to the classified census',
        { evidenceIndex: index },
      );
    }
    if (indexed.has(value.rowId)) {
      throw new InflightClassificationError(
        ClassificationErrorCodes.EVIDENCE_DUPLICATE_ROW,
        'Current evidence contains a duplicate row identity',
        { rowId: value.rowId },
      );
    }
    indexed.set(value.rowId, value);
  }
  return indexed;
}

function staleInstruction(
  rowId: string,
  modes: Phase014HandlingInstruction['modes'],
  classifiedDisposition: Phase014HandlingInstruction['classifiedDisposition'],
  reasonCode: ClassificationReasonCode,
): Phase014HandlingInstruction {
  return deepFreeze({
    rowId,
    modes,
    classifiedDisposition,
    instruction: InflightDisposition.BLOCK,
    reasonCode,
    isLive: true,
    freshnessDigest: null,
  });
}

// ───────────────────────────────────────────────────────────────────
// 2. FRESHNESS-BOUND HANDLING PLAN
// ───────────────────────────────────────────────────────────────────

/** Recheck every classified row without exposing an authority-changing operation. */
export function createPhase014HandlingPlan(
  manifest: InflightClassificationManifest,
  currentEvidence: readonly unknown[],
): Phase014HandlingPlan {
  if (!verifyClassificationManifest(manifest)) {
    throw new InflightClassificationError(
      ClassificationErrorCodes.MANIFEST_INVALID,
      'Phase cutover handling requires an intact classification manifest',
    );
  }

  const currentByRow = indexCurrentEvidence(currentEvidence, manifest);
  const instructions = manifest.rows.map((row): Phase014HandlingInstruction => {
    const current = currentByRow.get(row.rowId);
    if (current === undefined) {
      return staleInstruction(
        row.rowId,
        row.modes,
        row.disposition,
        ClassificationReasonCodes.MISSING_EVIDENCE,
      );
    }
    if (!isClassificationEvidence(current) || current.rowId !== row.rowId) {
      return staleInstruction(
        row.rowId,
        row.modes,
        row.disposition,
        ClassificationReasonCodes.INVALID_EVIDENCE,
      );
    }

    const currentFreshnessDigest = classificationFreshnessDigest(current);
    if (
      row.evidence.freshnessDigest === null
      || currentFreshnessDigest !== row.evidence.freshnessDigest
    ) {
      return staleInstruction(
        row.rowId,
        row.modes,
        row.disposition,
        ClassificationReasonCodes.CLASSIFICATION_STALE,
      );
    }

    return deepFreeze({
      rowId: row.rowId,
      modes: row.modes,
      classifiedDisposition: row.disposition,
      instruction: row.disposition,
      reasonCode: row.reasonCode,
      isLive: current.isPresent,
      freshnessDigest: currentFreshnessDigest,
    });
  }).sort((left, right) => compareStrings(left.rowId, right.rowId));

  const core: Phase014HandlingPlanCore = deepFreeze({
    planVersion: 1,
    manifestDigest: manifest.finalDigest,
    authorityPosture: 'legacy-authoritative-dark',
    authorityMutationPermitted: false,
    instructions,
  });
  return deepFreeze({ ...core, finalDigest: hashValue(core) });
}

/** Verify plan closure and row bindings before readiness can consume it. */
export function verifyPhase014HandlingPlan(
  manifest: InflightClassificationManifest,
  plan: Phase014HandlingPlan,
): boolean {
  try {
    if (
      !verifyClassificationManifest(manifest)
      || !isRecord(plan)
      || !hasOnlyKeys(plan, [
        'planVersion',
        'manifestDigest',
        'authorityPosture',
        'authorityMutationPermitted',
        'instructions',
        'finalDigest',
      ])
      || plan.planVersion !== 1
      || plan.manifestDigest !== manifest.finalDigest
      || plan.authorityPosture !== 'legacy-authoritative-dark'
      || plan.authorityMutationPermitted !== false
      || !Array.isArray(plan.instructions)
      || plan.instructions.length !== manifest.rows.length
      || !isDigest(plan.finalDigest)
    ) {
      return false;
    }
    const { finalDigest, ...core } = plan;
    if (hashValue(core) !== finalDigest) return false;

    const manifestRows = new Map(manifest.rows.map((row) => [row.rowId, row]));
    const rowIds = plan.instructions.map((instruction) => instruction.rowId);
    if (
      rowIds.length !== new Set(rowIds).size
      || rowIds.some((rowId, index) => index > 0 && rowIds[index - 1] > rowId)
    ) {
      return false;
    }

    for (const instruction of plan.instructions) {
      if (
        !isRecord(instruction)
        || typeof instruction.rowId !== 'string'
        || !hasOnlyKeys(instruction, [
          'rowId',
          'modes',
          'classifiedDisposition',
          'instruction',
          'reasonCode',
          'isLive',
          'freshnessDigest',
        ])
      ) {
        return false;
      }
      const manifestRow = manifestRows.get(instruction.rowId);
      if (
        !manifestRow
        || hashValue(instruction.modes) !== hashValue(manifestRow.modes)
        || instruction.classifiedDisposition !== manifestRow.disposition
        || typeof instruction.isLive !== 'boolean'
      ) {
        return false;
      }

      const passesThroughClassification = instruction.instruction === manifestRow.disposition
        && instruction.reasonCode === manifestRow.reasonCode
        && instruction.isLive === manifestRow.evidence.isPresent
        && instruction.freshnessDigest === manifestRow.evidence.freshnessDigest;
      const safeFreshnessVeto = instruction.instruction === InflightDisposition.BLOCK
        && instruction.isLive
        && instruction.freshnessDigest === null
        && (
          instruction.reasonCode === ClassificationReasonCodes.MISSING_EVIDENCE
          || instruction.reasonCode === ClassificationReasonCodes.INVALID_EVIDENCE
          || instruction.reasonCode === ClassificationReasonCodes.CLASSIFICATION_STALE
        );
      if (!passesThroughClassification && !safeFreshnessVeto) return false;
    }
    return manifest.rows.every((row) => rowIds.includes(row.rowId));
  } catch {
    return false;
  }
}

// ───────────────────────────────────────────────────────────────────
// 3. CUTOVER READINESS
// ───────────────────────────────────────────────────────────────────

function receiptFor(
  disposition: Phase014HandlingInstruction['instruction'],
  rowId: string,
  receipts: Phase014EvidenceReceipts,
): string | null {
  switch (disposition) {
    case InflightDisposition.PIN:
      return receipts.terminalPinReceipts[rowId] ?? null;
    case InflightDisposition.FORK:
      return receipts.forkParityReceipts[rowId] ?? null;
    case InflightDisposition.MIGRATE:
      return receipts.migrationReceipts[rowId] ?? null;
    case InflightDisposition.UPCAST:
    case InflightDisposition.BLOCK:
      return null;
  }
}

/** Assess readiness only; this function cannot issue a certificate or move authority. */
export function evaluateModeCutoverReadiness(
  manifest: InflightClassificationManifest,
  plan: Phase014HandlingPlan,
  mode: WorkflowMode,
  receipts: Phase014EvidenceReceipts,
): ModeCutoverReadiness {
  if (
    !verifyPhase014HandlingPlan(manifest, plan)
  ) {
    return Object.freeze({
      mode,
      eligible: false,
      authorityMutationPermitted: false,
      reasonCodes: Object.freeze([ClassificationReasonCodes.MANIFEST_INTEGRITY_FAILED]),
      blockedRowIds: Object.freeze([]),
    });
  }

  const manifestRows = new Map(manifest.rows.map((row) => [row.rowId, row]));
  const failedVerifiers = new Set(receipts.failedVerifierRowIds);
  const reasonCodes = new Set<ClassificationReasonCode>();
  const blockedRowIds = new Set<string>();
  if (!isDigest(receipts.rollbackRehearsalReceiptDigest)) {
    reasonCodes.add(ClassificationReasonCodes.RECEIPT_INCOMPLETE);
  }

  for (const instruction of plan.instructions) {
    if (!instruction.modes.includes(mode) || !instruction.isLive) continue;
    const manifestRow = manifestRows.get(instruction.rowId);
    if (!manifestRow) {
      reasonCodes.add(ClassificationReasonCodes.MANIFEST_INTEGRITY_FAILED);
      blockedRowIds.add(instruction.rowId);
      continue;
    }
    if (instruction.instruction === InflightDisposition.BLOCK) {
      reasonCodes.add(instruction.reasonCode);
      blockedRowIds.add(instruction.rowId);
      continue;
    }
    if (
      failedVerifiers.has(instruction.rowId)
      || !isDigest(manifestRow.evidence.verifierReceiptDigest)
    ) {
      reasonCodes.add(ClassificationReasonCodes.VERIFIER_FAILED);
      blockedRowIds.add(instruction.rowId);
      continue;
    }
    const requiredReceipt = receiptFor(
      instruction.instruction,
      instruction.rowId,
      receipts,
    );
    if (
      instruction.instruction !== InflightDisposition.UPCAST
      && !isDigest(requiredReceipt)
    ) {
      reasonCodes.add(ClassificationReasonCodes.RECEIPT_INCOMPLETE);
      blockedRowIds.add(instruction.rowId);
    }
  }

  const sortedReasonCodes = [...reasonCodes].sort(compareStrings);
  const sortedBlockedRows = [...blockedRowIds].sort(compareStrings);
  return deepFreeze({
    mode,
    eligible: sortedReasonCodes.length === 0 && sortedBlockedRows.length === 0,
    authorityMutationPermitted: false,
    reasonCodes: sortedReasonCodes,
    blockedRowIds: sortedBlockedRows,
  });
}

/** Extract current evidence for callers that already validated the shape. */
export function currentEvidenceForRow(
  values: readonly unknown[],
  rowId: string,
): ClassificationEvidence | null {
  const matches = values.filter(
    (value) => isRecord(value) && value.rowId === rowId,
  );
  return matches.length === 1 && isClassificationEvidence(matches[0])
    ? matches[0]
    : null;
}
