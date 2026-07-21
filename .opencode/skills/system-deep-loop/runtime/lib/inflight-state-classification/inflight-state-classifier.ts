// ───────────────────────────────────────────────────────────────────
// MODULE: In-Flight State Classifier
// ───────────────────────────────────────────────────────────────────

import {
  canonicalBytes,
  canonicalJson,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  FROZEN_CENSUS_CONTRACT,
  FROZEN_CENSUS_ROW_IDS,
  frozenPolicyFor,
} from './frozen-census-policy.js';
import {
  ClassificationErrorCodes,
  ClassificationReasonCodes,
  InflightClassificationError,
  InflightDisposition,
} from './inflight-state-types.js';

import type {
  BuiltClassificationManifest,
  ClassificationEvidence,
  ClassifiedEvidenceSnapshot,
  ClassifiedInflightStateRow,
  ClassificationReasonCode,
  CreateClassificationManifestInput,
  DispositionProof,
  FrozenCensusRowPolicy,
  InflightClassificationManifest,
  InflightClassificationManifestCore,
  InflightDisposition as InflightDispositionType,
  LeaseState,
  LegacyAuthorityState,
  ModeClassificationSummary,
  PendingEffectsState,
  ShapeStatus,
  StateBackendCensus,
  StateBackendCensusRow,
  WorkflowMode,
} from './inflight-state-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const SHA256_PATTERN = /^[a-f0-9]{64}$/;
const GIT_SHA_PATTERN = /^(?:[a-f0-9]{40}|[a-f0-9]{64})$/;
const RFC3339_UTC_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?Z$/;
const MAX_CENSUS_BYTES = 1_048_576;
const MAX_IDENTIFIER_LENGTH = 256;

const WORKFLOW_MODES: readonly WorkflowMode[] = Object.freeze([
  'research',
  'review',
  'ai-council',
  'agent-improvement',
  'model-benchmark',
  'skill-benchmark',
  'alignment',
]);

const DISPOSITIONS: readonly InflightDispositionType[] = Object.freeze(
  Object.values(InflightDisposition),
);

const BLOCK_REASON_CODES: readonly ClassificationReasonCode[] = Object.freeze([
  ClassificationReasonCodes.POLICY_BLOCK,
  ClassificationReasonCodes.MISSING_EVIDENCE,
  ClassificationReasonCodes.INVALID_EVIDENCE,
  ClassificationReasonCodes.CORRUPT_STATE,
  ClassificationReasonCodes.UNKNOWN_SHAPE,
  ClassificationReasonCodes.LEGACY_AUTHORITY_REQUIRED,
  ClassificationReasonCodes.ROLLBACK_ANCHOR_UNSAFE,
  ClassificationReasonCodes.LEASE_STATE_UNSAFE,
  ClassificationReasonCodes.PENDING_EFFECTS_UNSAFE,
  ClassificationReasonCodes.UPCAST_UNSAFE,
  ClassificationReasonCodes.PIN_UNSAFE,
  ClassificationReasonCodes.FORK_UNSAFE,
  ClassificationReasonCodes.MIGRATION_UNSAFE,
  ClassificationReasonCodes.VERIFIER_FAILED,
]);

interface ClassificationDecision {
  readonly disposition: InflightDispositionType;
  readonly reasonCode: ClassificationReasonCode;
  readonly rationale: string;
}

// ───────────────────────────────────────────────────────────────────
// 2. STRUCTURAL HELPERS
// ───────────────────────────────────────────────────────────────────

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isBoundedString(value: unknown): value is string {
  return typeof value === 'string'
    && value.length > 0
    && value.length <= MAX_IDENTIFIER_LENGTH;
}

function isDigest(value: unknown): value is string {
  return typeof value === 'string' && SHA256_PATTERN.test(value);
}

function isDisposition(value: unknown): value is InflightDispositionType {
  return typeof value === 'string'
    && DISPOSITIONS.includes(value as InflightDispositionType);
}

function isBlockReasonCode(value: unknown): value is ClassificationReasonCode {
  return typeof value === 'string'
    && BLOCK_REASON_CODES.includes(value as ClassificationReasonCode);
}

function isGitSha(value: unknown): value is string {
  return typeof value === 'string' && GIT_SHA_PATTERN.test(value);
}

function isNonNegativeInteger(value: unknown): value is number {
  return Number.isSafeInteger(value) && Number(value) >= 0;
}

function hasBooleanFields(
  value: Record<string, unknown>,
  fields: readonly string[],
): boolean {
  return fields.every((field) => typeof value[field] === 'boolean');
}

function hasOnlyKeys(
  value: Record<string, unknown>,
  allowedKeys: readonly string[],
): boolean {
  const allowed = new Set(allowedKeys);
  return Object.keys(value).every((key) => allowed.has(key))
    && allowedKeys.every((key) => Object.prototype.hasOwnProperty.call(value, key));
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

function compareStrings(left: string, right: string): number {
  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
}

function assertManifestIdentifier(value: string, field: string): void {
  if (!isBoundedString(value)) {
    throw new InflightClassificationError(
      ClassificationErrorCodes.MANIFEST_INVALID,
      'Classification manifest identity is invalid',
      { field },
    );
  }
}

function assertTimestamp(value: string, field: string): void {
  if (!RFC3339_UTC_PATTERN.test(value) || Number.isNaN(Date.parse(value))) {
    throw new InflightClassificationError(
      ClassificationErrorCodes.MANIFEST_INVALID,
      'Classification timestamp must be an RFC 3339 UTC value',
      { field },
    );
  }
}

function isLeaseState(value: unknown): value is LeaseState {
  return value === 'none'
    || value === 'quiescent'
    || value === 'active'
    || value === 'uncertain';
}

function isPendingEffectsState(value: unknown): value is PendingEffectsState {
  return value === 'none'
    || value === 'reconciled'
    || value === 'active-legacy'
    || value === 'uncertain';
}

function isShapeStatus(value: unknown): value is ShapeStatus {
  return value === 'registered'
    || value === 'unknown'
    || value === 'future'
    || value === 'malformed';
}

function isAuthorityState(value: unknown): value is LegacyAuthorityState {
  return value === 'legacy_authoritative'
    || value === 'shadowing'
    || value === 'cutover_ready'
    || value === 'new_authoritative_reversible'
    || value === 'rollback_pending'
    || value === 'new_authoritative_final';
}

function isDispositionProof(value: unknown): value is DispositionProof {
  if (!isRecord(value) || typeof value.kind !== 'string') return false;
  switch (value.kind) {
    case 'upcast':
      return hasOnlyKeys(value, [
        'kind',
        'adjacentChainComplete',
        'pure',
        'deterministic',
        'sideEffectFree',
        'sourceBytesPreserved',
        'immutableIdentityPreserved',
        'replayEquivalent',
        'sourceBytesDigest',
        'effectiveStateDigest',
        'registryDigest',
        'chainIdentitiesDigest',
      ])
        && hasBooleanFields(value, [
          'adjacentChainComplete',
          'pure',
          'deterministic',
          'sideEffectFree',
          'sourceBytesPreserved',
          'immutableIdentityPreserved',
          'replayEquivalent',
        ])
        && isDigest(value.sourceBytesDigest)
        && isDigest(value.effectiveStateDigest)
        && isDigest(value.registryDigest)
        && isDigest(value.chainIdentitiesDigest);
    case 'pin':
      return hasOnlyKeys(value, [
        'kind',
        'legacyWriterSoleAuthority',
        'legacyCompletionAvailable',
        'boundedCompletion',
        'timedOut',
        'terminalBoundary',
        'terminalReceiptRequired',
      ])
        && hasBooleanFields(value, [
          'legacyWriterSoleAuthority',
          'legacyCompletionAvailable',
          'boundedCompletion',
          'timedOut',
          'terminalReceiptRequired',
        ])
        && isBoundedString(value.terminalBoundary);
    case 'fork':
      return hasOnlyKeys(value, [
        'kind',
        'executionNamespace',
        'effectNamespace',
        'shadowOnlySink',
        'livePublicationEnabled',
        'sourceStateUnchanged',
        'authorityUnaffected',
        'budgetsUnaffected',
      ])
        && isBoundedString(value.executionNamespace)
        && isBoundedString(value.effectNamespace)
        && hasBooleanFields(value, [
          'shadowOnlySink',
          'livePublicationEnabled',
          'sourceStateUnchanged',
          'authorityUnaffected',
          'budgetsUnaffected',
        ]);
    case 'migrate':
      return hasOnlyKeys(value, [
        'kind',
        'quiescentCheckpoint',
        'transactionalSnapshot',
        'atomicImport',
        'reversible',
        'identityPreserved',
        'orderPreserved',
        'idempotencyPreserved',
        'budgetsPreserved',
        'receiptsPreserved',
        'pendingWorkPreserved',
        'checkpointDigest',
        'restorationReceiptDigest',
      ])
        && hasBooleanFields(value, [
          'quiescentCheckpoint',
          'transactionalSnapshot',
          'atomicImport',
          'reversible',
          'identityPreserved',
          'orderPreserved',
          'idempotencyPreserved',
          'budgetsPreserved',
          'receiptsPreserved',
          'pendingWorkPreserved',
        ])
        && isDigest(value.checkpointDigest)
        && isDigest(value.restorationReceiptDigest);
    case 'block':
      return hasOnlyKeys(value, ['kind', 'veto'])
        && isBoundedString(value.veto);
    default:
      return false;
  }
}

// ───────────────────────────────────────────────────────────────────
// 3. CENSUS INGESTION
// ───────────────────────────────────────────────────────────────────

function isCensusRow(value: unknown): value is StateBackendCensusRow {
  if (!isRecord(value)) return false;
  return [
    'id',
    'surface',
    'mutability',
    'resolvedPath',
    'owner',
    'lifecycle',
    'recovery',
    'archivalReader',
    'authority',
    'fixture',
    'evidence',
  ].every((field) => isBoundedString(value[field]));
}

/** Validate row closure independently so tests can challenge every structural veto. */
export function validateFrozenCensusDocument(value: unknown): StateBackendCensus {
  if (!isRecord(value) || !Array.isArray(value.rows) || !isRecord(value.discovery)) {
    throw new InflightClassificationError(
      ClassificationErrorCodes.CENSUS_SCHEMA_MISMATCH,
      'State census does not match the frozen document shape',
    );
  }
  if (value.schemaVersion !== FROZEN_CENSUS_CONTRACT.schemaVersion) {
    throw new InflightClassificationError(
      ClassificationErrorCodes.CENSUS_SCHEMA_MISMATCH,
      'State census schema version does not match the frozen contract',
    );
  }
  if (value.baseSha !== FROZEN_CENSUS_CONTRACT.baseSha || !isGitSha(value.baseSha)) {
    throw new InflightClassificationError(
      ClassificationErrorCodes.CENSUS_BASE_MISMATCH,
      'State census BASE identity does not match the frozen contract',
    );
  }

  const seen = new Set<string>();
  for (const row of value.rows) {
    if (!isCensusRow(row)) {
      throw new InflightClassificationError(
        ClassificationErrorCodes.CENSUS_ROW_INVALID,
        'State census contains a malformed row',
      );
    }
    if (seen.has(row.id)) {
      throw new InflightClassificationError(
        ClassificationErrorCodes.CENSUS_DUPLICATE_ROW,
        'State census contains a duplicate row identity',
        { rowId: row.id },
      );
    }
    if (frozenPolicyFor(row.id) === null) {
      throw new InflightClassificationError(
        ClassificationErrorCodes.CENSUS_ROW_UNRECOGNIZED,
        'State census contains a row with no frozen disposition policy',
        { rowId: row.id },
      );
    }
    seen.add(row.id);
  }

  const missingRows = FROZEN_CENSUS_ROW_IDS.filter((rowId) => !seen.has(rowId));
  if (missingRows.length > 0 || value.rows.length !== FROZEN_CENSUS_CONTRACT.stateBackendRowCount) {
    throw new InflightClassificationError(
      ClassificationErrorCodes.CENSUS_ROW_MISSING,
      'State census does not close over every frozen row',
      {
        actualRows: value.rows.length,
        expectedRows: FROZEN_CENSUS_CONTRACT.stateBackendRowCount,
        missingRows: missingRows.length,
      },
    );
  }

  return value as unknown as StateBackendCensus;
}

function parseFrozenCensus(censusBytes: Uint8Array): StateBackendCensus {
  if (!(censusBytes instanceof Uint8Array) || censusBytes.byteLength === 0) {
    throw new InflightClassificationError(
      ClassificationErrorCodes.INVALID_CENSUS_BYTES,
      'State census bytes are missing',
    );
  }
  if (censusBytes.byteLength > MAX_CENSUS_BYTES) {
    throw new InflightClassificationError(
      ClassificationErrorCodes.INVALID_CENSUS_BYTES,
      'State census bytes exceed the bounded ingestion limit',
      { byteLength: censusBytes.byteLength, limit: MAX_CENSUS_BYTES },
    );
  }
  const actualDigest = sha256Bytes(censusBytes);
  if (actualDigest !== FROZEN_CENSUS_CONTRACT.stateBackendCensusSha256) {
    throw new InflightClassificationError(
      ClassificationErrorCodes.CENSUS_DIGEST_MISMATCH,
      'State census bytes do not match the frozen census digest',
      { actualDigest, expectedDigest: FROZEN_CENSUS_CONTRACT.stateBackendCensusSha256 },
    );
  }

  let decoded: string;
  let parsed: unknown;
  try {
    decoded = new TextDecoder('utf-8', { fatal: true }).decode(censusBytes);
    parsed = JSON.parse(decoded) as unknown;
  } catch {
    throw new InflightClassificationError(
      ClassificationErrorCodes.INVALID_CENSUS_BYTES,
      'State census bytes are not valid UTF-8 JSON',
    );
  }
  return validateFrozenCensusDocument(parsed);
}

// ───────────────────────────────────────────────────────────────────
// 4. EVIDENCE NORMALIZATION
// ───────────────────────────────────────────────────────────────────

/** Narrow bounded metadata evidence without admitting payload bytes. */
export function isClassificationEvidence(value: unknown): value is ClassificationEvidence {
  if (!isRecord(value) || !isRecord(value.rollbackAnchor) || !isRecord(value.verifier)) {
    return false;
  }
  if (!hasOnlyKeys(value, [
    'rowId',
    'isPresent',
    'stateDigest',
    'shapeVersion',
    'shapeStatus',
    'schemaDigest',
    'lifecyclePoint',
    'authorityState',
    'authorityEpoch',
    'mutability',
    'leaseState',
    'activeLeaseCount',
    'leaseSetDigest',
    'pendingEffectsState',
    'pendingEffectSetDigest',
    'identityCoverage',
    'orderCoverage',
    'idempotencyCoverage',
    'budgetCoverage',
    'receiptCoverage',
    'pendingWorkCoverage',
    'isCorrupt',
    'rollbackAnchor',
    'verifier',
    'proof',
  ])) {
    return false;
  }
  if (!hasOnlyKeys(value.rollbackAnchor, [
    'anchorId',
    'digest',
    'retained',
    'restorable',
    'minimumRetentionDays',
    'minimumSuccessfulRuns',
  ]) || !hasOnlyKeys(value.verifier, [
    'verified',
    'receiptDigest',
    'replayFingerprintDigest',
    'rollbackScenarioDigest',
    'parityCaseDigest',
  ])) {
    return false;
  }
  const hasCommonBooleans = hasBooleanFields(value, [
    'isPresent',
    'identityCoverage',
    'orderCoverage',
    'idempotencyCoverage',
    'budgetCoverage',
    'receiptCoverage',
    'pendingWorkCoverage',
    'isCorrupt',
  ]);
  const leaseCountIsConsistent = isNonNegativeInteger(value.activeLeaseCount)
    && (value.leaseState === 'active'
      ? value.activeLeaseCount > 0
      : value.leaseState === 'uncertain' || value.activeLeaseCount === 0);
  return isBoundedString(value.rowId)
    && hasCommonBooleans
    && isDigest(value.stateDigest)
    && isBoundedString(value.shapeVersion)
    && isShapeStatus(value.shapeStatus)
    && isDigest(value.schemaDigest)
    && isBoundedString(value.lifecyclePoint)
    && isAuthorityState(value.authorityState)
    && isNonNegativeInteger(value.authorityEpoch)
    && isBoundedString(value.mutability)
    && isLeaseState(value.leaseState)
    && leaseCountIsConsistent
    && isDigest(value.leaseSetDigest)
    && isPendingEffectsState(value.pendingEffectsState)
    && isDigest(value.pendingEffectSetDigest)
    && isBoundedString(value.rollbackAnchor.anchorId)
    && isDigest(value.rollbackAnchor.digest)
    && hasBooleanFields(value.rollbackAnchor, ['retained', 'restorable'])
    && isNonNegativeInteger(value.rollbackAnchor.minimumRetentionDays)
    && isNonNegativeInteger(value.rollbackAnchor.minimumSuccessfulRuns)
    && typeof value.verifier.verified === 'boolean'
    && isDigest(value.verifier.receiptDigest)
    && (value.verifier.replayFingerprintDigest === null
      || isDigest(value.verifier.replayFingerprintDigest))
    && isDigest(value.verifier.rollbackScenarioDigest)
    && (value.verifier.parityCaseDigest === null
      || isDigest(value.verifier.parityCaseDigest))
    && isDispositionProof(value.proof);
}

function indexEvidence(values: readonly unknown[]): ReadonlyMap<string, unknown> {
  const indexed = new Map<string, unknown>();
  for (const [index, value] of values.entries()) {
    if (!isRecord(value) || !isBoundedString(value.rowId)) {
      throw new InflightClassificationError(
        ClassificationErrorCodes.EVIDENCE_UNRECOGNIZED_ROW,
        'Classification evidence cannot be bound to a census row',
        { evidenceIndex: index },
      );
    }
    if (frozenPolicyFor(value.rowId) === null) {
      throw new InflightClassificationError(
        ClassificationErrorCodes.EVIDENCE_UNRECOGNIZED_ROW,
        'Classification evidence names an unrecognized census row',
        { rowId: value.rowId },
      );
    }
    if (indexed.has(value.rowId)) {
      throw new InflightClassificationError(
        ClassificationErrorCodes.EVIDENCE_DUPLICATE_ROW,
        'Classification evidence contains a duplicate row identity',
        { rowId: value.rowId },
      );
    }
    indexed.set(value.rowId, value);
  }
  return indexed;
}

/** Bind every freshness-sensitive field into one deterministic comparison token. */
export function classificationFreshnessDigest(evidence: ClassificationEvidence): string {
  return hashValue({
    rowId: evidence.rowId,
    isPresent: evidence.isPresent,
    stateDigest: evidence.stateDigest,
    shapeVersion: evidence.shapeVersion,
    shapeStatus: evidence.shapeStatus,
    schemaDigest: evidence.schemaDigest,
    authorityState: evidence.authorityState,
    authorityEpoch: evidence.authorityEpoch,
    leaseState: evidence.leaseState,
    leaseSetDigest: evidence.leaseSetDigest,
    pendingEffectsState: evidence.pendingEffectsState,
    pendingEffectSetDigest: evidence.pendingEffectSetDigest,
    rollbackAnchorId: evidence.rollbackAnchor.anchorId,
    rollbackAnchorDigest: evidence.rollbackAnchor.digest,
  });
}

function evidenceSnapshot(evidence: ClassificationEvidence): ClassifiedEvidenceSnapshot {
  return deepFreeze({
    isPresent: evidence.isPresent,
    stateDigest: evidence.stateDigest,
    shapeVersion: evidence.shapeVersion,
    shapeStatus: evidence.shapeStatus,
    schemaDigest: evidence.schemaDigest,
    lifecyclePoint: evidence.lifecyclePoint,
    authorityState: evidence.authorityState,
    authorityEpoch: evidence.authorityEpoch,
    mutability: evidence.mutability,
    leaseState: evidence.leaseState,
    leaseSetDigest: evidence.leaseSetDigest,
    pendingEffectsState: evidence.pendingEffectsState,
    pendingEffectSetDigest: evidence.pendingEffectSetDigest,
    identityCoverage: evidence.identityCoverage,
    orderCoverage: evidence.orderCoverage,
    idempotencyCoverage: evidence.idempotencyCoverage,
    budgetCoverage: evidence.budgetCoverage,
    receiptCoverage: evidence.receiptCoverage,
    pendingWorkCoverage: evidence.pendingWorkCoverage,
    rollbackAnchorId: evidence.rollbackAnchor.anchorId,
    rollbackAnchorDigest: evidence.rollbackAnchor.digest,
    verifierReceiptDigest: evidence.verifier.receiptDigest,
    replayFingerprintDigest: evidence.verifier.replayFingerprintDigest,
    rollbackScenarioDigest: evidence.verifier.rollbackScenarioDigest,
    parityCaseDigest: evidence.verifier.parityCaseDigest,
    proofDigest: hashValue(evidence.proof),
    freshnessDigest: classificationFreshnessDigest(evidence),
  });
}

function emptyEvidenceSnapshot(): ClassifiedEvidenceSnapshot {
  return Object.freeze({
    isPresent: null,
    stateDigest: null,
    shapeVersion: null,
    shapeStatus: null,
    schemaDigest: null,
    lifecyclePoint: null,
    authorityState: null,
    authorityEpoch: null,
    mutability: null,
    leaseState: null,
    leaseSetDigest: null,
    pendingEffectsState: null,
    pendingEffectSetDigest: null,
    identityCoverage: null,
    orderCoverage: null,
    idempotencyCoverage: null,
    budgetCoverage: null,
    receiptCoverage: null,
    pendingWorkCoverage: null,
    rollbackAnchorId: null,
    rollbackAnchorDigest: null,
    verifierReceiptDigest: null,
    replayFingerprintDigest: null,
    rollbackScenarioDigest: null,
    parityCaseDigest: null,
    proofDigest: null,
    freshnessDigest: null,
  });
}

function isNullableBoolean(value: unknown): value is boolean | null {
  return value === null || typeof value === 'boolean';
}

function isNullableDigest(value: unknown): value is string | null {
  return value === null || isDigest(value);
}

function isNullableBoundedString(value: unknown): value is string | null {
  return value === null || isBoundedString(value);
}

function isEvidenceSnapshot(value: unknown): value is ClassifiedEvidenceSnapshot {
  if (!isRecord(value) || !hasOnlyKeys(value, [
    'isPresent',
    'stateDigest',
    'shapeVersion',
    'shapeStatus',
    'schemaDigest',
    'lifecyclePoint',
    'authorityState',
    'authorityEpoch',
    'mutability',
    'leaseState',
    'leaseSetDigest',
    'pendingEffectsState',
    'pendingEffectSetDigest',
    'identityCoverage',
    'orderCoverage',
    'idempotencyCoverage',
    'budgetCoverage',
    'receiptCoverage',
    'pendingWorkCoverage',
    'rollbackAnchorId',
    'rollbackAnchorDigest',
    'verifierReceiptDigest',
    'replayFingerprintDigest',
    'rollbackScenarioDigest',
    'parityCaseDigest',
    'proofDigest',
    'freshnessDigest',
  ])) {
    return false;
  }
  return isNullableBoolean(value.isPresent)
    && isNullableDigest(value.stateDigest)
    && isNullableBoundedString(value.shapeVersion)
    && (value.shapeStatus === null || isShapeStatus(value.shapeStatus))
    && isNullableDigest(value.schemaDigest)
    && isNullableBoundedString(value.lifecyclePoint)
    && (value.authorityState === null || isAuthorityState(value.authorityState))
    && (value.authorityEpoch === null || isNonNegativeInteger(value.authorityEpoch))
    && isNullableBoundedString(value.mutability)
    && (value.leaseState === null || isLeaseState(value.leaseState))
    && isNullableDigest(value.leaseSetDigest)
    && (value.pendingEffectsState === null
      || isPendingEffectsState(value.pendingEffectsState))
    && isNullableDigest(value.pendingEffectSetDigest)
    && isNullableBoolean(value.identityCoverage)
    && isNullableBoolean(value.orderCoverage)
    && isNullableBoolean(value.idempotencyCoverage)
    && isNullableBoolean(value.budgetCoverage)
    && isNullableBoolean(value.receiptCoverage)
    && isNullableBoolean(value.pendingWorkCoverage)
    && isNullableBoundedString(value.rollbackAnchorId)
    && isNullableDigest(value.rollbackAnchorDigest)
    && isNullableDigest(value.verifierReceiptDigest)
    && isNullableDigest(value.replayFingerprintDigest)
    && isNullableDigest(value.rollbackScenarioDigest)
    && isNullableDigest(value.parityCaseDigest)
    && isNullableDigest(value.proofDigest)
    && isNullableDigest(value.freshnessDigest);
}

// ───────────────────────────────────────────────────────────────────
// 5. DECISION ENGINE
// ───────────────────────────────────────────────────────────────────

function block(
  reasonCode: ClassificationReasonCode,
  rationale: string,
): ClassificationDecision {
  return { disposition: InflightDisposition.BLOCK, reasonCode, rationale };
}

function positive(
  disposition: InflightDispositionType,
  reasonCode: ClassificationReasonCode,
  rationale: string,
): ClassificationDecision {
  return { disposition, reasonCode, rationale };
}

function hasSafeRollbackAnchor(evidence: ClassificationEvidence): boolean {
  return evidence.rollbackAnchor.retained
    && evidence.rollbackAnchor.restorable
    && evidence.rollbackAnchor.minimumRetentionDays
      >= FROZEN_CENSUS_CONTRACT.rollbackMinimumDays
    && evidence.rollbackAnchor.minimumSuccessfulRuns
      >= FROZEN_CENSUS_CONTRACT.rollbackMinimumSuccessfulRuns;
}

function decideUpcast(
  policy: FrozenCensusRowPolicy,
  evidence: ClassificationEvidence,
): ClassificationDecision {
  const proof = evidence.proof;
  if (
    proof.kind !== 'upcast'
    || !proof.adjacentChainComplete
    || !proof.pure
    || !proof.deterministic
    || !proof.sideEffectFree
    || !proof.sourceBytesPreserved
    || !proof.immutableIdentityPreserved
    || !proof.replayEquivalent
    || !evidence.identityCoverage
    || !evidence.orderCoverage
    || !evidence.idempotencyCoverage
  ) {
    return block(
      ClassificationReasonCodes.UPCAST_UNSAFE,
      'Pure replay-equivalent upcasting was not proven; legacy authority remains unchanged.',
    );
  }
  return positive(
    InflightDisposition.UPCAST,
    ClassificationReasonCodes.UPCAST_PROVEN,
    policy.rationale,
  );
}

function decidePin(
  policy: FrozenCensusRowPolicy,
  evidence: ClassificationEvidence,
): ClassificationDecision {
  const proof = evidence.proof;
  if (
    proof.kind !== 'pin'
    || !proof.legacyWriterSoleAuthority
    || !proof.legacyCompletionAvailable
    || !proof.boundedCompletion
    || proof.timedOut
    || !proof.terminalReceiptRequired
  ) {
    return block(
      ClassificationReasonCodes.PIN_UNSAFE,
      'Bounded legacy-only completion was not proven; the row vetoes cutover.',
    );
  }
  return positive(
    InflightDisposition.PIN,
    ClassificationReasonCodes.PIN_LEGACY_BOUNDED,
    policy.rationale,
  );
}

function decideFork(
  policy: FrozenCensusRowPolicy,
  evidence: ClassificationEvidence,
): ClassificationDecision {
  const proof = evidence.proof;
  if (
    proof.kind !== 'fork'
    || proof.executionNamespace === proof.effectNamespace
    || !proof.shadowOnlySink
    || proof.livePublicationEnabled
    || !proof.sourceStateUnchanged
    || !proof.authorityUnaffected
    || !proof.budgetsUnaffected
    || evidence.verifier.parityCaseDigest === null
  ) {
    return block(
      ClassificationReasonCodes.FORK_UNSAFE,
      'Dark-fork namespace and effect isolation were not proven; no copy is admitted.',
    );
  }
  return positive(
    InflightDisposition.FORK,
    ClassificationReasonCodes.FORK_ISOLATED,
    policy.rationale,
  );
}

function decideMigrate(
  policy: FrozenCensusRowPolicy,
  evidence: ClassificationEvidence,
): ClassificationDecision {
  const proof = evidence.proof;
  if (
    proof.kind !== 'migrate'
    || !proof.quiescentCheckpoint
    || !proof.transactionalSnapshot
    || !proof.atomicImport
    || !proof.reversible
    || !proof.identityPreserved
    || !proof.orderPreserved
    || !proof.idempotencyPreserved
    || !proof.budgetsPreserved
    || !proof.receiptsPreserved
    || !proof.pendingWorkPreserved
    || !evidence.identityCoverage
    || !evidence.orderCoverage
    || !evidence.idempotencyCoverage
    || !evidence.budgetCoverage
    || !evidence.receiptCoverage
    || !evidence.pendingWorkCoverage
  ) {
    return block(
      ClassificationReasonCodes.MIGRATION_UNSAFE,
      'Complete reversible checkpoint migration was not proven; the row remains legacy-authoritative.',
    );
  }
  return positive(
    InflightDisposition.MIGRATE,
    ClassificationReasonCodes.MIGRATION_REVERSIBLE,
    policy.rationale,
  );
}

function decideRow(
  row: StateBackendCensusRow,
  policy: FrozenCensusRowPolicy,
  evidence: ClassificationEvidence,
): ClassificationDecision {
  if (evidence.mutability !== row.mutability) {
    return block(
      ClassificationReasonCodes.INVALID_EVIDENCE,
      'Observed mutability does not match the frozen census; the row requires reclassification.',
    );
  }
  if (evidence.isCorrupt) {
    return block(
      ClassificationReasonCodes.CORRUPT_STATE,
      'Corrupt state cannot be transformed or moved; legacy authority remains unchanged.',
    );
  }
  if (evidence.shapeStatus !== 'registered') {
    return block(
      ClassificationReasonCodes.UNKNOWN_SHAPE,
      'Unknown, future, or malformed state shapes cannot be interpreted safely.',
    );
  }
  if (evidence.authorityState !== 'legacy_authoritative') {
    return block(
      ClassificationReasonCodes.LEGACY_AUTHORITY_REQUIRED,
      'Classification is valid only while legacy remains the sole authoritative writer.',
    );
  }
  if (!hasSafeRollbackAnchor(evidence)) {
    return block(
      ClassificationReasonCodes.ROLLBACK_ANCHOR_UNSAFE,
      'The retained rollback anchor does not satisfy restoration and minimum-window requirements.',
    );
  }
  if (evidence.leaseState === 'uncertain') {
    return block(
      ClassificationReasonCodes.LEASE_STATE_UNSAFE,
      'Lease ownership is uncertain and therefore vetoes state handling.',
    );
  }
  if (evidence.pendingEffectsState === 'uncertain') {
    return block(
      ClassificationReasonCodes.PENDING_EFFECTS_UNSAFE,
      'Pending effects are uncertain and therefore veto state handling.',
    );
  }
  if (!evidence.verifier.verified) {
    return block(
      ClassificationReasonCodes.VERIFIER_FAILED,
      'The class-specific verifier did not produce a trusted receipt.',
    );
  }
  if (policy.disposition === InflightDisposition.BLOCK) {
    return block(ClassificationReasonCodes.POLICY_BLOCK, policy.rationale);
  }
  if (
    policy.disposition !== InflightDisposition.PIN
    && evidence.leaseState === 'active'
  ) {
    return block(
      ClassificationReasonCodes.LEASE_STATE_UNSAFE,
      'Active lease ownership permits only bounded legacy pinning or blocking.',
    );
  }
  if (
    policy.disposition !== InflightDisposition.PIN
    && evidence.pendingEffectsState === 'active-legacy'
  ) {
    return block(
      ClassificationReasonCodes.PENDING_EFFECTS_UNSAFE,
      'Active legacy effects permit only bounded legacy pinning or blocking.',
    );
  }

  switch (policy.disposition) {
    case InflightDisposition.UPCAST:
      return decideUpcast(policy, evidence);
    case InflightDisposition.PIN:
      return decidePin(policy, evidence);
    case InflightDisposition.FORK:
      return decideFork(policy, evidence);
    case InflightDisposition.MIGRATE:
      return decideMigrate(policy, evidence);
  }
}

function classifyRow(
  row: StateBackendCensusRow,
  rawEvidence: unknown,
): ClassifiedInflightStateRow {
  const policy = frozenPolicyFor(row.id);
  if (policy === null) {
    throw new InflightClassificationError(
      ClassificationErrorCodes.CENSUS_ROW_UNRECOGNIZED,
      'State census row has no frozen classification policy',
      { rowId: row.id },
    );
  }

  if (rawEvidence === undefined) {
    return deepFreeze({
      rowId: row.id,
      censusRowDigest: hashValue(row),
      modes: policy.modes,
      disposition: InflightDisposition.BLOCK,
      reasonCode: ClassificationReasonCodes.MISSING_EVIDENCE,
      rationale: 'Required safety evidence is missing; the row vetoes cutover.',
      evidence: emptyEvidenceSnapshot(),
    });
  }
  if (!isClassificationEvidence(rawEvidence) || rawEvidence.rowId !== row.id) {
    return deepFreeze({
      rowId: row.id,
      censusRowDigest: hashValue(row),
      modes: policy.modes,
      disposition: InflightDisposition.BLOCK,
      reasonCode: ClassificationReasonCodes.INVALID_EVIDENCE,
      rationale: 'Safety evidence is malformed or bound to the wrong row; the row vetoes cutover.',
      evidence: emptyEvidenceSnapshot(),
    });
  }

  const decision = decideRow(row, policy, rawEvidence);
  return deepFreeze({
    rowId: row.id,
    censusRowDigest: hashValue(row),
    modes: policy.modes,
    disposition: decision.disposition,
    reasonCode: decision.reasonCode,
    rationale: decision.rationale,
    evidence: evidenceSnapshot(rawEvidence),
  });
}

// ───────────────────────────────────────────────────────────────────
// 6. MANIFEST CONSTRUCTION
// ───────────────────────────────────────────────────────────────────

function emptyDispositionCounts(): Record<InflightDispositionType, number> {
  return {
    UPCAST: 0,
    PIN: 0,
    FORK: 0,
    MIGRATE: 0,
    BLOCK: 0,
  };
}

function summarizeModes(
  rows: readonly ClassifiedInflightStateRow[],
): readonly ModeClassificationSummary[] {
  return WORKFLOW_MODES.map((mode) => {
    const modeRows = rows.filter((row) => row.modes.includes(mode));
    const dispositions = emptyDispositionCounts();
    modeRows.forEach((row) => {
      dispositions[row.disposition] += 1;
    });
    return deepFreeze({
      mode,
      rowCount: modeRows.length,
      liveRowCount: modeRows.filter((row) => row.evidence.isPresent !== false).length,
      liveBlockedRowCount: modeRows.filter((row) => (
        row.disposition === InflightDisposition.BLOCK
        && row.evidence.isPresent !== false
      )).length,
      dispositions: Object.freeze(dispositions),
    });
  });
}

/** Build a byte-stable, read-only classification manifest over the frozen census. */
export function createClassificationManifest(
  input: CreateClassificationManifestInput,
): BuiltClassificationManifest {
  assertManifestIdentifier(input.classificationId, 'classificationId');
  assertManifestIdentifier(input.classifierBuildId, 'classifierBuildId');
  assertTimestamp(input.classifiedAt, 'classifiedAt');

  const census = parseFrozenCensus(input.censusBytes);
  const evidenceByRow = indexEvidence(input.evidence);
  const rows = census.rows
    .map((row) => classifyRow(row, evidenceByRow.get(row.id)))
    .sort((left, right) => compareStrings(left.rowId, right.rowId));
  const rowIds = rows.map((row) => row.rowId);
  const duplicateManifestRows = rowIds.length - new Set(rowIds).size;
  const unknownDispositionRows = rows.filter(
    (row) => !DISPOSITIONS.includes(row.disposition),
  ).length;
  if (duplicateManifestRows !== 0 || unknownDispositionRows !== 0) {
    throw new InflightClassificationError(
      ClassificationErrorCodes.MANIFEST_INVALID,
      'Classification manifest is not exclusive over the frozen census',
      { duplicateManifestRows, unknownDispositionRows },
    );
  }

  const core: InflightClassificationManifestCore = deepFreeze({
    manifestVersion: 1,
    classificationId: input.classificationId,
    classifiedAt: input.classifiedAt,
    classifierBuildId: input.classifierBuildId,
    census: FROZEN_CENSUS_CONTRACT,
    authorityPosture: 'legacy-authoritative-dark',
    authorityMutationPermitted: false,
    legacyRetirementPermitted: false,
    rows,
    modeSummaries: summarizeModes(rows),
    closure: {
      censusRows: census.rows.length,
      classifiedRows: rows.length,
      missingCensusRows: 0,
      duplicateCensusRows: 0,
      unrecognizedCensusRows: 0,
      duplicateManifestRows: 0,
      unknownDispositionRows: 0,
      missingEvidenceRows: rows.filter(
        (row) => row.reasonCode === ClassificationReasonCodes.MISSING_EVIDENCE,
      ).length,
      invalidEvidenceRows: rows.filter(
        (row) => row.reasonCode === ClassificationReasonCodes.INVALID_EVIDENCE,
      ).length,
      blockedRows: rows.filter((row) => row.disposition === InflightDisposition.BLOCK).length,
      liveBlockedRows: rows.filter((row) => (
        row.disposition === InflightDisposition.BLOCK
        && row.evidence.isPresent !== false
      )).length,
    },
  });
  const finalDigest = hashValue(core);
  const manifest: InflightClassificationManifest = deepFreeze({ ...core, finalDigest });
  return Object.freeze({
    manifest,
    canonicalBytes: Uint8Array.from(canonicalBytes(manifest)),
  });
}

/** Verify the manifest's self-excluding commitment before any cutover read. */
export function verifyClassificationManifest(
  manifest: InflightClassificationManifest,
): boolean {
  try {
  if (
    !isRecord(manifest)
    || !hasOnlyKeys(manifest, [
      'manifestVersion',
      'classificationId',
      'classifiedAt',
      'classifierBuildId',
      'census',
      'authorityPosture',
      'authorityMutationPermitted',
      'legacyRetirementPermitted',
      'rows',
      'modeSummaries',
      'closure',
      'finalDigest',
    ])
    || !isDigest(manifest.finalDigest)
    || !isBoundedString(manifest.classificationId)
    || !isBoundedString(manifest.classifierBuildId)
    || !RFC3339_UTC_PATTERN.test(manifest.classifiedAt)
    || !Array.isArray(manifest.rows)
    || !Array.isArray(manifest.modeSummaries)
    || !isRecord(manifest.census)
    || !isRecord(manifest.closure)
  ) return false;
  const { finalDigest, ...core } = manifest;
  if (hashValue(core) !== finalDigest) return false;
  if (
    canonicalJson(manifest.census) !== canonicalJson(FROZEN_CENSUS_CONTRACT)
    || manifest.manifestVersion !== 1
    || manifest.authorityPosture !== 'legacy-authoritative-dark'
    || manifest.authorityMutationPermitted !== false
    || manifest.legacyRetirementPermitted !== false
    || manifest.rows.length !== FROZEN_CENSUS_CONTRACT.stateBackendRowCount
  ) {
    return false;
  }
  const rowIds = manifest.rows.map((row) => row.rowId);
  const sortedRowIds = [...rowIds].sort(compareStrings);
  if (rowIds.length !== new Set(rowIds).size) {
    return false;
  }
  if (
    sortedRowIds.some((rowId, index) => rowId !== rowIds[index])
    || !FROZEN_CENSUS_ROW_IDS.every((rowId) => rowIds.includes(rowId))
  ) {
    return false;
  }

  const positiveReasonByDisposition: Readonly<
    Partial<Record<InflightDispositionType, ClassificationReasonCode>>
  > = {
    UPCAST: ClassificationReasonCodes.UPCAST_PROVEN,
    PIN: ClassificationReasonCodes.PIN_LEGACY_BOUNDED,
    FORK: ClassificationReasonCodes.FORK_ISOLATED,
    MIGRATE: ClassificationReasonCodes.MIGRATION_REVERSIBLE,
  };
  for (const row of manifest.rows) {
    const policy = frozenPolicyFor(row.rowId);
    if (
      !isRecord(row)
      || !hasOnlyKeys(row, [
        'rowId',
        'censusRowDigest',
        'modes',
        'disposition',
        'reasonCode',
        'rationale',
        'evidence',
      ])
      || policy === null
      || !Array.isArray(row.modes)
      || !isDisposition(row.disposition)
      || !isDigest(row.censusRowDigest)
      || !isBoundedString(row.rationale)
      || !isEvidenceSnapshot(row.evidence)
      || canonicalJson(row.modes) !== canonicalJson(policy.modes)
    ) {
      return false;
    }
    if (
      row.disposition !== InflightDisposition.BLOCK
      && (
        row.disposition !== policy.disposition
        || row.reasonCode !== positiveReasonByDisposition[row.disposition]
        || row.rationale !== policy.rationale
        || !isDigest(row.evidence.freshnessDigest)
        || !isDigest(row.evidence.proofDigest)
        || !isDigest(row.evidence.verifierReceiptDigest)
        || !isDigest(row.evidence.rollbackScenarioDigest)
      )
    ) {
      return false;
    }
    if (
      row.disposition === InflightDisposition.FORK
      && !isDigest(row.evidence.parityCaseDigest)
    ) {
      return false;
    }
    if (
      row.disposition === InflightDisposition.BLOCK
      && !isBlockReasonCode(row.reasonCode)
    ) {
      return false;
    }
  }

  const expectedModeSummaries = summarizeModes(manifest.rows);
  const expectedMissingEvidence = manifest.rows.filter(
    (row) => row.reasonCode === ClassificationReasonCodes.MISSING_EVIDENCE,
  ).length;
  const expectedInvalidEvidence = manifest.rows.filter(
    (row) => row.reasonCode === ClassificationReasonCodes.INVALID_EVIDENCE,
  ).length;
  const expectedBlocked = manifest.rows.filter(
    (row) => row.disposition === InflightDisposition.BLOCK,
  ).length;
  const expectedLiveBlocked = manifest.rows.filter((row) => (
    row.disposition === InflightDisposition.BLOCK
    && row.evidence.isPresent !== false
  )).length;
  return canonicalJson(manifest.modeSummaries) === canonicalJson(expectedModeSummaries)
    && manifest.closure.censusRows === FROZEN_CENSUS_CONTRACT.stateBackendRowCount
    && manifest.closure.classifiedRows === FROZEN_CENSUS_CONTRACT.stateBackendRowCount
    && manifest.closure.missingCensusRows === 0
    && manifest.closure.duplicateCensusRows === 0
    && manifest.closure.unrecognizedCensusRows === 0
    && manifest.closure.duplicateManifestRows === 0
    && manifest.closure.unknownDispositionRows === 0
    && manifest.closure.missingEvidenceRows === expectedMissingEvidence
    && manifest.closure.invalidEvidenceRows === expectedInvalidEvidence
    && manifest.closure.blockedRows === expectedBlocked
    && manifest.closure.liveBlockedRows === expectedLiveBlocked;
  } catch {
    return false;
  }
}

/** Return canonical text for audit logs without exposing any source payload. */
export function serializeClassificationManifest(
  manifest: InflightClassificationManifest,
): string {
  if (!verifyClassificationManifest(manifest)) {
    throw new InflightClassificationError(
      ClassificationErrorCodes.MANIFEST_INVALID,
      'Classification manifest failed integrity verification',
    );
  }
  return canonicalJson(manifest);
}
