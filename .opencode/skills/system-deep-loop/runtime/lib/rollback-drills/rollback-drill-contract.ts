// ───────────────────────────────────────────────────────────────────
// MODULE: Rollback Drill Contract
// ───────────────────────────────────────────────────────────────────

import {
  canonicalBytes,
  canonicalJson,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  DRILL_INPUT_BINDING_KEYS,
  DetectorByFaultFixture,
  InflightDispositionActions,
  InflightDispositions,
  ROLLBACK_DRILL_SCHEMA_VERSION,
  ROLLBACK_POLICY_MINIMUM_CALENDAR_DAYS,
  ROLLBACK_POLICY_MINIMUM_SUCCESSFUL_RUNS,
  RollbackDrillReasonCodes,
} from './rollback-drill-types.js';

import type { JsonObject, JsonValue } from '../event-envelope/index.js';
import type {
  AppliedInflightDisposition,
  DrillInputBindings,
  InflightClassificationManifest,
  InflightDisposition,
  InflightStateClassification,
  RollbackDrillManifest,
  RollbackDrillReasonCode,
  RollbackLaneState,
  RollbackStateReconstruction,
  RollbackWorkload,
} from './rollback-drill-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const DIGEST_PATTERN = /^[a-f0-9]{64}$/u;
const COMMIT_PATTERN = /^[a-f0-9]{40,64}$/u;
const IDENTITY_PATTERN = /^[a-z0-9][a-z0-9-]{0,127}$/u;
const MANIFEST_KEYS = Object.freeze([
  'baseSha',
  'bindings',
  'candidateSha',
  'classification',
  'drillId',
  'fault',
  'legacyWriterId',
  'mode',
  'parityUnresolvedDivergences',
  'policyVersion',
  'rollbackAnchor',
  'rollbackWindow',
  'schemaVersion',
  'spineWriterId',
  'startingAuthorityEpoch',
  'verifierIdentity',
  'workload',
] as const);
const CLASSIFICATION_KEYS = Object.freeze(['expectedRowIds', 'rows'] as const);
const CLASSIFICATION_ROW_KEYS = Object.freeze([
  'activeLeaseIds',
  'authorityEpoch',
  'disposition',
  'identityCoverageComplete',
  'isQuiescent',
  'lifecyclePoint',
  'mutability',
  'orderCoverageComplete',
  'pendingEffectIds',
  'reasonCode',
  'rollbackAnchorDigest',
  'rowId',
  'shapeVersion',
  'stateDigest',
  'terminalReceiptId',
  'verifier',
] as const);
const ANCHOR_KEYS = Object.freeze(['anchorId', 'digest', 'state'] as const);
const STATE_KEYS = Object.freeze(['artifacts', 'completedSteps', 'facts'] as const);
const WORKLOAD_KEYS = Object.freeze(['artifactContent', 'artifactName', 'factIds'] as const);
const WINDOW_KEYS = Object.freeze([
  'minimumCalendarDays',
  'minimumSuccessfulRuns',
  'openedAt',
  'stricterDeadlineAt',
  'successfulAuthoritativeRuns',
] as const);
const FAULT_KEYS = Object.freeze(['cutPoint', 'expectedDetector', 'fixture', 'timeoutMs'] as const);

export const ROLLBACK_DISPOSITION_ARTIFACT_NAME = '.rollback-dispositions.json';

// ───────────────────────────────────────────────────────────────────
// 2. ERRORS
// ───────────────────────────────────────────────────────────────────

/** Typed failure used to keep unsafe or incomplete drill inputs fail closed. */
export class RollbackDrillError extends Error {
  public readonly reasonCode: RollbackDrillReasonCode;
  public readonly details: Readonly<Record<string, JsonValue>>;

  public constructor(
    reasonCode: RollbackDrillReasonCode,
    message: string,
    details: Readonly<Record<string, JsonValue>> = {},
  ) {
    super(message);
    this.name = 'RollbackDrillError';
    this.reasonCode = reasonCode;
    this.details = Object.freeze({ ...details });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// ───────────────────────────────────────────────────────────────────
// 3. CANONICAL HELPERS
// ───────────────────────────────────────────────────────────────────

function cloneJson<T extends JsonValue>(value: T): T {
  return JSON.parse(Buffer.from(canonicalBytes(value)).toString('utf8')) as T;
}

function assertExactKeys(
  value: Readonly<Record<string, unknown>>,
  expected: readonly string[],
  label: string,
): void {
  const actual = Object.keys(value).sort();
  const wanted = [...expected].sort();
  if (
    actual.length !== wanted.length
    || actual.some((key, index) => key !== wanted[index])
  ) {
    throw new RollbackDrillError(
      RollbackDrillReasonCodes.INPUT_INVALID,
      `${label} contains missing or unknown fields`,
      { label, actual, expected: wanted },
    );
  }
}

function assertIdentity(value: unknown, label: string): asserts value is string {
  if (typeof value !== 'string' || !IDENTITY_PATTERN.test(value)) {
    throw new RollbackDrillError(
      RollbackDrillReasonCodes.INPUT_INVALID,
      `${label} must be bounded lowercase hyphen-case`,
      { label },
    );
  }
}

function assertDigest(value: unknown, label: string): asserts value is string {
  if (typeof value !== 'string' || !DIGEST_PATTERN.test(value)) {
    throw new RollbackDrillError(
      RollbackDrillReasonCodes.INPUT_INVALID,
      `${label} must be a lowercase SHA-256 digest`,
      { label },
    );
  }
}

function assertIsoInstant(value: unknown, label: string): asserts value is string {
  if (
    typeof value !== 'string'
    || !value.endsWith('Z')
    || Number.isNaN(Date.parse(value))
  ) {
    throw new RollbackDrillError(
      RollbackDrillReasonCodes.INPUT_INVALID,
      `${label} must be an RFC 3339 UTC instant`,
      { label },
    );
  }
}

/** Compute the exact row-set digest consumed by manifest freshness checks. */
export function classificationManifestDigest(
  manifest: Readonly<InflightClassificationManifest>,
): string {
  return sha256Bytes(canonicalBytes(manifest));
}

/** Compute the immutable rollback-anchor identity from its state and identifier. */
export function rollbackAnchorDigest(
  anchorId: string,
  state: Readonly<RollbackLaneState>,
): string {
  return sha256Bytes(canonicalBytes({ anchorId, state }));
}

/** Compute one canonical state digest for control and resumed-lane comparison. */
export function rollbackLaneStateDigest(state: Readonly<RollbackLaneState>): string {
  return sha256Bytes(canonicalBytes(state));
}

/** Bind only path-free manifest facts so certificates never retain host paths. */
export function rollbackDrillManifestDigest(
  manifest: Readonly<RollbackDrillManifest>,
): string {
  return sha256Bytes(canonicalBytes(manifest));
}

/** Bind the bounded continuation independently from the surrounding manifest. */
export function rollbackWorkloadDigest(workload: Readonly<RollbackWorkload>): string {
  return sha256Bytes(canonicalBytes(workload));
}

// ───────────────────────────────────────────────────────────────────
// 4. CLASSIFICATION VALIDATION
// ───────────────────────────────────────────────────────────────────

function validateClassification(
  classification: Readonly<InflightClassificationManifest>,
): Record<InflightDisposition, number> {
  assertExactKeys(classification, CLASSIFICATION_KEYS, 'classification');
  if (
    !Array.isArray(classification.expectedRowIds)
    || classification.expectedRowIds.length === 0
    || !Array.isArray(classification.rows)
  ) {
    throw new RollbackDrillError(
      RollbackDrillReasonCodes.INPUT_INVALID,
      'State classification requires a non-empty expected row set and concrete rows',
    );
  }
  const expected = classification.expectedRowIds;
  const expectedSet = new Set(expected);
  const actualIds = classification.rows.map((row) => row.rowId);
  if (
    expectedSet.size !== expected.length
    || new Set(actualIds).size !== actualIds.length
    || actualIds.length !== expected.length
    || actualIds.some((rowId) => !expectedSet.has(rowId))
  ) {
    throw new RollbackDrillError(
      RollbackDrillReasonCodes.RECONCILIATION_BLOCKED,
      'State classification must cover every expected row exactly once',
    );
  }

  const counts: Record<InflightDisposition, number> = {
    UPCAST: 0,
    PIN: 0,
    FORK: 0,
    MIGRATE: 0,
    BLOCK: 0,
  };
  const allowed = new Set<InflightDisposition>(Object.values(InflightDispositions));
  for (const row of classification.rows) {
    assertExactKeys(row, CLASSIFICATION_ROW_KEYS, `classification.${row.rowId ?? 'row'}`);
    assertIdentity(row.rowId, 'classification.rowId');
    assertDigest(row.stateDigest, `classification.${row.rowId}.stateDigest`);
    assertDigest(
      row.rollbackAnchorDigest,
      `classification.${row.rowId}.rollbackAnchorDigest`,
    );
    if (
      !allowed.has(row.disposition)
      || !Number.isSafeInteger(row.authorityEpoch)
      || row.authorityEpoch <= 0
      || typeof row.shapeVersion !== 'string'
      || row.shapeVersion.trim() === ''
      || typeof row.lifecyclePoint !== 'string'
      || row.lifecyclePoint.trim() === ''
      || typeof row.mutability !== 'string'
      || row.mutability.trim() === ''
      || typeof row.reasonCode !== 'string'
      || row.reasonCode.trim() === ''
      || typeof row.verifier !== 'string'
      || row.verifier.trim() === ''
      || !Array.isArray(row.activeLeaseIds)
      || !Array.isArray(row.pendingEffectIds)
    ) {
      throw new RollbackDrillError(
        RollbackDrillReasonCodes.RECONCILIATION_BLOCKED,
        'State classification row is incomplete or uses an unknown disposition',
        { rowId: row.rowId },
      );
    }
    counts[row.disposition] += 1;
    if (
      row.disposition === InflightDispositions.BLOCK
      || row.activeLeaseIds.length > 0
      || row.pendingEffectIds.length > 0
      || !row.identityCoverageComplete
      || !row.orderCoverageComplete
      || (row.disposition === InflightDispositions.PIN && row.terminalReceiptId === null)
      || (row.disposition === InflightDispositions.MIGRATE && !row.isQuiescent)
    ) {
      throw new RollbackDrillError(
        RollbackDrillReasonCodes.RECONCILIATION_BLOCKED,
        'State classification contains a live veto or lacks closure evidence',
        { rowId: row.rowId, disposition: row.disposition },
      );
    }
  }
  return counts;
}

// ───────────────────────────────────────────────────────────────────
// 5. MANIFEST VALIDATION
// ───────────────────────────────────────────────────────────────────

function validateBindings(bindings: Readonly<DrillInputBindings>): void {
  assertExactKeys(bindings, DRILL_INPUT_BINDING_KEYS, 'bindings');
  for (const key of DRILL_INPUT_BINDING_KEYS) {
    assertDigest(bindings[key], `bindings.${key}`);
  }
}

/** Validate every authority-, replay-, and rollback-affecting input before writes begin. */
export function validateRollbackDrillManifest(
  manifest: Readonly<RollbackDrillManifest>,
): Record<InflightDisposition, number> {
  assertExactKeys(manifest, MANIFEST_KEYS, 'manifest');
  if (manifest.schemaVersion !== ROLLBACK_DRILL_SCHEMA_VERSION) {
    throw new RollbackDrillError(
      RollbackDrillReasonCodes.INPUT_INVALID,
      'Rollback drill schema version is not registered',
    );
  }
  assertIdentity(manifest.drillId, 'drillId');
  assertIdentity(manifest.mode, 'mode');
  assertIdentity(manifest.legacyWriterId, 'legacyWriterId');
  assertIdentity(manifest.spineWriterId, 'spineWriterId');
  assertIdentity(manifest.verifierIdentity, 'verifierIdentity');
  if (
    !COMMIT_PATTERN.test(manifest.baseSha)
    || !COMMIT_PATTERN.test(manifest.candidateSha)
    || typeof manifest.policyVersion !== 'string'
    || manifest.policyVersion.trim() === ''
    || !Number.isSafeInteger(manifest.startingAuthorityEpoch)
    || manifest.startingAuthorityEpoch <= 0
    || manifest.parityUnresolvedDivergences !== 0
  ) {
    throw new RollbackDrillError(
      RollbackDrillReasonCodes.INPUT_INVALID,
      'Drill identity, authority epoch, or parity evidence is incomplete',
    );
  }
  validateBindings(manifest.bindings);
  assertExactKeys(manifest.rollbackAnchor, ANCHOR_KEYS, 'rollbackAnchor');
  assertExactKeys(manifest.rollbackAnchor.state, STATE_KEYS, 'rollbackAnchor.state');
  assertExactKeys(manifest.workload, WORKLOAD_KEYS, 'workload');
  assertExactKeys(manifest.rollbackWindow, WINDOW_KEYS, 'rollbackWindow');
  assertExactKeys(manifest.fault, FAULT_KEYS, 'fault');
  assertIdentity(manifest.rollbackAnchor.anchorId, 'rollbackAnchor.anchorId');
  if (
    !Array.isArray(manifest.rollbackAnchor.state.facts)
    || manifest.rollbackAnchor.state.facts.some((fact) => typeof fact !== 'string')
    || manifest.rollbackAnchor.state.artifacts === null
    || Array.isArray(manifest.rollbackAnchor.state.artifacts)
    || typeof manifest.rollbackAnchor.state.artifacts !== 'object'
    || Object.values(manifest.rollbackAnchor.state.artifacts)
      .some((value) => typeof value !== 'string')
    || !Number.isSafeInteger(manifest.rollbackAnchor.state.completedSteps)
    || manifest.rollbackAnchor.state.completedSteps < 0
  ) {
    throw new RollbackDrillError(
      RollbackDrillReasonCodes.INPUT_INVALID,
      'Rollback anchor state is incomplete or not canonically bounded',
    );
  }
  const dispositionCounts = validateClassification(manifest.classification);
  const calculatedClassificationDigest = classificationManifestDigest(
    manifest.classification,
  );
  if (calculatedClassificationDigest !== manifest.bindings.classificationManifest) {
    throw new RollbackDrillError(
      RollbackDrillReasonCodes.BINDING_DRIFT,
      'Classification manifest bytes do not match the bound identity',
    );
  }
  const calculatedAnchorDigest = rollbackAnchorDigest(
    manifest.rollbackAnchor.anchorId,
    manifest.rollbackAnchor.state,
  );
  if (
    calculatedAnchorDigest !== manifest.rollbackAnchor.digest
    || calculatedAnchorDigest !== manifest.bindings.rollbackAsset
  ) {
    throw new RollbackDrillError(
      RollbackDrillReasonCodes.BINDING_DRIFT,
      'Rollback anchor bytes do not match the bound rollback asset',
    );
  }
  if (
    manifest.fault.expectedDetector !== DetectorByFaultFixture[manifest.fault.fixture]
    || typeof manifest.fault.cutPoint !== 'string'
    || manifest.fault.cutPoint.trim() === ''
    || !Number.isSafeInteger(manifest.fault.timeoutMs)
    || manifest.fault.timeoutMs <= 0
  ) {
    throw new RollbackDrillError(
      RollbackDrillReasonCodes.REGRESSION_CLASS_MISMATCH,
      'Fault fixture must bind its registered detector and bounded cut point',
    );
  }
  assertIsoInstant(manifest.rollbackWindow.openedAt, 'rollbackWindow.openedAt');
  if (manifest.rollbackWindow.stricterDeadlineAt !== null) {
    assertIsoInstant(
      manifest.rollbackWindow.stricterDeadlineAt,
      'rollbackWindow.stricterDeadlineAt',
    );
  }
  if (
    manifest.rollbackWindow.minimumCalendarDays
      < ROLLBACK_POLICY_MINIMUM_CALENDAR_DAYS
    || !Number.isSafeInteger(manifest.rollbackWindow.minimumCalendarDays)
    || manifest.rollbackWindow.minimumSuccessfulRuns
      < ROLLBACK_POLICY_MINIMUM_SUCCESSFUL_RUNS
    || !Number.isSafeInteger(manifest.rollbackWindow.minimumSuccessfulRuns)
    || !Number.isSafeInteger(manifest.rollbackWindow.successfulAuthoritativeRuns)
    || manifest.rollbackWindow.successfulAuthoritativeRuns < 0
    || !Array.isArray(manifest.workload.factIds)
    || manifest.workload.factIds.length === 0
    || manifest.workload.factIds.some((factId) =>
      typeof factId !== 'string' || factId.trim() === '')
    || new Set(manifest.workload.factIds).size !== manifest.workload.factIds.length
    || typeof manifest.workload.artifactName !== 'string'
    || manifest.workload.artifactName.trim() === ''
    || manifest.workload.artifactName === ROLLBACK_DISPOSITION_ARTIFACT_NAME
    || Object.prototype.hasOwnProperty.call(
      manifest.rollbackAnchor.state.artifacts,
      ROLLBACK_DISPOSITION_ARTIFACT_NAME,
    )
    || typeof manifest.workload.artifactContent !== 'string'
  ) {
    throw new RollbackDrillError(
      RollbackDrillReasonCodes.INPUT_INVALID,
      'Rollback window or bounded workload weakens the registered contract',
    );
  }
  canonicalBytes(manifest as unknown as JsonObject);
  return Object.freeze({ ...dispositionCounts });
}

// ───────────────────────────────────────────────────────────────────
// 6. STATE TRANSFORMS
// ───────────────────────────────────────────────────────────────────

/** Apply one deterministic legacy continuation to a cloned rollback anchor. */
export function applyRollbackWorkload(
  anchor: Readonly<RollbackLaneState>,
  workload: Readonly<RollbackWorkload>,
): RollbackLaneState {
  const cloned = cloneJson(anchor);
  return Object.freeze({
    facts: Object.freeze([...cloned.facts, ...workload.factIds]) as unknown as string[],
    artifacts: Object.freeze({
      ...cloned.artifacts,
      [workload.artifactName]: workload.artifactContent,
    }),
    completedSteps: cloned.completedSteps + workload.factIds.length,
  });
}

function emptyDispositionCounts(): Record<InflightDisposition, number> {
  return {
    UPCAST: 0,
    PIN: 0,
    FORK: 0,
    MIGRATE: 0,
    BLOCK: 0,
  };
}

function applyInflightDisposition(
  row: Readonly<InflightStateClassification>,
): AppliedInflightDisposition {
  let action: AppliedInflightDisposition['action'];
  let restoredStateDigest: string;
  switch (row.disposition) {
    case InflightDispositions.UPCAST:
      action = InflightDispositionActions.UPCAST;
      restoredStateDigest = sha256Bytes(canonicalBytes({
        action,
        source_state_digest: row.stateDigest,
        shape_version: row.shapeVersion,
      }));
      break;
    case InflightDispositions.PIN:
      action = InflightDispositionActions.PIN;
      restoredStateDigest = sha256Bytes(canonicalBytes({
        action,
        source_state_digest: row.stateDigest,
        terminal_receipt_id: row.terminalReceiptId,
      }));
      break;
    case InflightDispositions.FORK:
      action = InflightDispositionActions.FORK;
      restoredStateDigest = sha256Bytes(canonicalBytes({
        action,
        source_state_digest: row.stateDigest,
        shadow_namespace: `rollback-shadow-${row.rowId}`,
      }));
      break;
    case InflightDispositions.MIGRATE:
      action = InflightDispositionActions.MIGRATE;
      restoredStateDigest = sha256Bytes(canonicalBytes({
        action,
        source_state_digest: row.stateDigest,
        rollback_anchor_digest: row.rollbackAnchorDigest,
      }));
      break;
    case InflightDispositions.BLOCK:
    default:
      throw new RollbackDrillError(
        RollbackDrillReasonCodes.RECONCILIATION_BLOCKED,
        'Rollback reconstruction refuses blocked or undeclared state dispositions',
        { rowId: row.rowId, disposition: row.disposition },
      );
  }
  return Object.freeze({
    rowId: row.rowId,
    disposition: row.disposition,
    action,
    sourceStateDigest: row.stateDigest,
    restoredStateDigest,
  });
}

/** Represent cutover state before any rollback disposition has been applied. */
export function createCutoverStateReconstruction(
  state: Readonly<RollbackLaneState>,
): RollbackStateReconstruction {
  return Object.freeze({
    state: cloneJson(state),
    appliedDispositions: Object.freeze([]) as unknown as AppliedInflightDisposition[],
    dispositionCounts: Object.freeze(emptyDispositionCounts()),
  });
}

/** Apply every declared disposition and materialize its result into restored state. */
export function reconstructRollbackState(
  anchor: Readonly<RollbackLaneState>,
  workload: Readonly<RollbackWorkload>,
  classification: Readonly<InflightClassificationManifest>,
): RollbackStateReconstruction {
  validateClassification(classification);
  const rowsById = new Map(classification.rows.map((row) => [row.rowId, row]));
  const appliedDispositions = classification.expectedRowIds.map((rowId) => {
    const row = rowsById.get(rowId);
    if (!row) {
      throw new RollbackDrillError(
        RollbackDrillReasonCodes.RECONCILIATION_BLOCKED,
        'Rollback reconstruction cannot skip a declared state row',
        { rowId },
      );
    }
    return applyInflightDisposition(row);
  });
  const dispositionCounts = emptyDispositionCounts();
  for (const applied of appliedDispositions) {
    dispositionCounts[applied.disposition] += 1;
  }
  const continued = applyRollbackWorkload(anchor, workload);
  const state: RollbackLaneState = Object.freeze({
    facts: Object.freeze([...continued.facts]) as unknown as string[],
    artifacts: Object.freeze({
      ...continued.artifacts,
      [ROLLBACK_DISPOSITION_ARTIFACT_NAME]: canonicalJson(
        appliedDispositions as unknown as JsonValue,
      ),
    }),
    completedSteps: continued.completedSteps + appliedDispositions.length,
  });
  return Object.freeze({
    state,
    appliedDispositions: Object.freeze(appliedDispositions) as unknown as AppliedInflightDisposition[],
    dispositionCounts: Object.freeze(dispositionCounts),
  });
}

/** Commit the complete reconstructed state and applied-disposition evidence. */
export function rollbackStateReconstructionDigest(
  reconstruction: Readonly<RollbackStateReconstruction>,
): string {
  return sha256Bytes(canonicalBytes(reconstruction));
}
