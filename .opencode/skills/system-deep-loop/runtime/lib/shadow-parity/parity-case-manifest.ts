// ───────────────────────────────────────────────────────────────────
// MODULE: Shadow Parity Case Manifest
// ───────────────────────────────────────────────────────────────────

import {
  canonicalBytes,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  SHADOW_PARITY_SCHEMA_VERSION,
  ShadowParityError,
  ShadowParityErrorCodes,
} from './shadow-parity-types.js';

import type { JsonValue } from '../event-envelope/index.js';
import type {
  ParityBaselineRow,
  ParityCaseDefinition,
  ParityCaseManifest,
  ParityObservationClass,
} from './shadow-parity-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. VALIDATION CONSTANTS
// ───────────────────────────────────────────────────────────────────

const DIGEST_PATTERN = /^[a-f0-9]{64}$/;
const BASE_SHA_PATTERN = /^[a-f0-9]{40}$/;
const IDENTITY_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;
const MAX_TIMEOUT_MS = 86_400_000;
const ObservationClasses = new Set<ParityObservationClass>([
  'terminal-status',
  'return-value',
  'error-halt',
  'ordered-transitions',
  'effect-receipts',
  'budgets',
  'emitted-artifacts',
  'reader-results',
]);

// ───────────────────────────────────────────────────────────────────
// 2. HELPERS
// ───────────────────────────────────────────────────────────────────

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value as JsonValue));
}

function requireIdentity(value: string, field: string): void {
  if (!IDENTITY_PATTERN.test(value)) {
    throw new ShadowParityError(
      ShadowParityErrorCodes.INVALID_INPUT,
      `Parity manifest ${field} must be a bounded stable identity`,
      { field },
    );
  }
}

function requireDigest(value: string, field: string): void {
  if (!DIGEST_PATTERN.test(value)) {
    throw new ShadowParityError(
      ShadowParityErrorCodes.INVALID_INPUT,
      `Parity manifest ${field} must be a lowercase SHA-256 digest`,
      { field },
    );
  }
}

function immutableBaselineRow(row: ParityBaselineRow): ParityBaselineRow {
  requireIdentity(row.scenarioId, 'scenarioId');
  requireIdentity(row.mode, 'mode');
  requireDigest(row.contractDigest, 'contractDigest');
  if (row.disposition !== 'known-defect' && row.disposition !== 'protected') {
    throw new ShadowParityError(
      ShadowParityErrorCodes.INVALID_INPUT,
      'Parity baseline disposition must be protected or known-defect',
      { scenarioId: row.scenarioId },
    );
  }
  return Object.freeze({ ...row });
}

function immutableCase(definition: ParityCaseDefinition): ParityCaseDefinition {
  requireIdentity(definition.caseId, 'caseId');
  requireIdentity(definition.scenarioId, 'scenarioId');
  requireIdentity(definition.mode, 'mode');
  requireDigest(definition.contractDigest, 'contractDigest');
  if (
    !Number.isSafeInteger(definition.timeoutMs)
    || definition.timeoutMs <= 0
    || definition.timeoutMs > MAX_TIMEOUT_MS
  ) {
    throw new ShadowParityError(
      ShadowParityErrorCodes.INVALID_INPUT,
      'Parity case timeout must be a bounded positive integer',
      { caseId: definition.caseId },
    );
  }
  requireIdentity(definition.terminationPolicy, 'terminationPolicy');
  if (
    !Array.isArray(definition.requiredObservations)
    || definition.requiredObservations.length === 0
    || new Set(definition.requiredObservations).size
      !== definition.requiredObservations.length
    || definition.requiredObservations.some((entry) => !ObservationClasses.has(entry))
  ) {
    throw new ShadowParityError(
      ShadowParityErrorCodes.INVALID_INPUT,
      'Parity cases require a non-empty unique registered observation set',
      { caseId: definition.caseId },
    );
  }
  if (
    !Array.isArray(definition.projectionIds)
    || definition.projectionIds.length === 0
    || new Set(definition.projectionIds).size !== definition.projectionIds.length
  ) {
    throw new ShadowParityError(
      ShadowParityErrorCodes.INVALID_INPUT,
      'Parity cases require a non-empty unique legacy projection set',
      { caseId: definition.caseId },
    );
  }
  definition.projectionIds.forEach((entry) => requireIdentity(entry, 'projectionId'));
  return Object.freeze({
    ...definition,
    requiredObservations: Object.freeze([...definition.requiredObservations]),
    projectionIds: Object.freeze([...definition.projectionIds]),
  });
}

function rejectDuplicate(
  values: readonly string[],
  field: string,
): void {
  const seen = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) {
      throw new ShadowParityError(
        ShadowParityErrorCodes.MANIFEST_CONFLICT,
        `Parity manifest contains a duplicate ${field}`,
        { field, value },
      );
    }
    seen.add(value);
  }
}

// ───────────────────────────────────────────────────────────────────
// 3. MANIFEST COMPILATION
// ───────────────────────────────────────────────────────────────────

/** Compile an exact one-to-one executable closure over immutable baseline rows. */
export function compileParityCaseManifest(input: Readonly<{
  baseSha: string;
  baselineRows: readonly ParityBaselineRow[];
  cases: readonly ParityCaseDefinition[];
}>): ParityCaseManifest {
  if (!BASE_SHA_PATTERN.test(input.baseSha)) {
    throw new ShadowParityError(
      ShadowParityErrorCodes.INVALID_INPUT,
      'Parity manifest requires the immutable forty-character baseline SHA',
    );
  }
  if (
    !Array.isArray(input.baselineRows)
    || input.baselineRows.length === 0
    || !Array.isArray(input.cases)
    || input.cases.length === 0
  ) {
    throw new ShadowParityError(
      ShadowParityErrorCodes.MANIFEST_GAP,
      'Parity manifest cannot certify a zero-discovery baseline or case set',
    );
  }

  const baselineRows = input.baselineRows
    .map(immutableBaselineRow)
    .sort((left, right) => left.scenarioId.localeCompare(right.scenarioId));
  const cases = input.cases
    .map(immutableCase)
    .sort((left, right) => left.caseId.localeCompare(right.caseId));
  rejectDuplicate(baselineRows.map((row) => row.scenarioId), 'baseline scenario');
  rejectDuplicate(cases.map((entry) => entry.caseId), 'case identity');
  rejectDuplicate(cases.map((entry) => entry.scenarioId), 'case scenario');

  const casesByScenario = new Map(cases.map((entry) => [entry.scenarioId, entry]));
  const baselineByScenario = new Map(
    baselineRows.map((entry) => [entry.scenarioId, entry]),
  );
  for (const baseline of baselineRows) {
    const definition = casesByScenario.get(baseline.scenarioId);
    if (!definition) {
      throw new ShadowParityError(
        ShadowParityErrorCodes.MANIFEST_GAP,
        'Parity manifest omitted a required baseline scenario',
        { scenarioId: baseline.scenarioId },
      );
    }
    if (
      definition.mode !== baseline.mode
      || definition.contractDigest !== baseline.contractDigest
    ) {
      throw new ShadowParityError(
        ShadowParityErrorCodes.MANIFEST_CONFLICT,
        'Parity case changed the frozen baseline mode or contract identity',
        { scenarioId: baseline.scenarioId },
      );
    }
  }
  for (const definition of cases) {
    if (!baselineByScenario.has(definition.scenarioId)) {
      throw new ShadowParityError(
        ShadowParityErrorCodes.MANIFEST_CONFLICT,
        'Parity case has no matching frozen baseline scenario',
        { scenarioId: definition.scenarioId },
      );
    }
  }

  const core = Object.freeze({
    schemaVersion: SHADOW_PARITY_SCHEMA_VERSION,
    baseSha: input.baseSha,
    baselineRows: Object.freeze(baselineRows),
    cases: Object.freeze(cases),
    caseCount: cases.length,
  });
  return Object.freeze({
    ...core,
    manifestDigest: digest(core),
  });
}
