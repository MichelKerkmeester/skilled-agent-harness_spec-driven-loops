// ───────────────────────────────────────────────────────────────────
// MODULE: Evidence and Error Validators
// ───────────────────────────────────────────────────────────────────

import { ContractKinds, RuntimeIds } from './common.js';
import { PrivacyClasses } from './context.js';
import {
  EvaluationDimensionNames,
  TelemetryEventNames,
  TelemetryReasonCodes,
} from './evidence.js';
import { ErrorOutcomeCodes } from './error-record.js';
import {
  ValidationCollector,
  expectEnum,
  expectIsoDate,
  expectNonNegativeInteger,
  expectNumber,
  expectOnlyKeys,
  expectRecord,
  expectString,
  isJsonValue,
  validateHeader,
} from './validator-utils.js';

import type {
  BenchmarkRecord,
  EvaluationManifest,
  TelemetryEvent,
} from './evidence.js';
import type { ContractErrorRecord } from './error-record.js';
import type { ValidationResult } from './common.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const TELEMETRY_KEYS = [
  'contractKind',
  'schemaVersion',
  'eventName',
  'runtime',
  'providerId',
  'modelId',
  'privacyClass',
  'outcome',
  'reasonCode',
  'durations',
  'byteCounts',
  'attemptCount',
  'correlationDigest',
  'keyRotationId',
] as const;
const DURATION_KEYS = ['assemblyMs', 'providerMs', 'validationMs', 'totalMs'] as const;
const BYTE_COUNT_KEYS = ['input', 'output'] as const;
const HMAC_DIGEST_PATTERN = /^hmac-sha256:[a-f0-9]{64}$/;
const TELEMETRY_IDENTIFIER_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:@/-]{0,191}$/;

// ───────────────────────────────────────────────────────────────────
// 2. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

/** Validate the closed, content-free telemetry allowlist. */
export function validateTelemetryEvent(input: unknown): ValidationResult<TelemetryEvent> {
  const collector = new ValidationCollector();
  const record = expectRecord(input, '$', collector);
  if (record === null) {
    return collector.result(input);
  }

  expectOnlyKeys(record, TELEMETRY_KEYS, '$', collector);
  validateHeader(record, ContractKinds.TELEMETRY, '$', collector);
  expectEnum(record, 'eventName', Object.values(TelemetryEventNames), '$', collector);
  expectEnum(record, 'runtime', Object.values(RuntimeIds), '$', collector);
  expectNullableIdentifier(record, 'providerId', collector);
  expectNullableIdentifier(record, 'modelId', collector);
  expectEnum(record, 'privacyClass', Object.values(PrivacyClasses), '$', collector);
  expectEnum(record, 'outcome', ['accepted', 'exact-original', 'rejected'], '$', collector);
  expectEnum(record, 'reasonCode', Object.values(TelemetryReasonCodes), '$', collector);
  expectNonNegativeInteger(record, 'attemptCount', '$', collector);
  validateNumberMap(record.durations, '$.durations', DURATION_KEYS, false, collector);
  validateNumberMap(record.byteCounts, '$.byteCounts', BYTE_COUNT_KEYS, true, collector);

  const digest = record.correlationDigest;
  const rotation = record.keyRotationId;
  const bothNull = digest === null && rotation === null;
  const bothPresent = typeof digest === 'string'
    && HMAC_DIGEST_PATTERN.test(digest)
    && typeof rotation === 'string'
    && rotation.length > 0;
  collector.require(
    bothNull || bothPresent,
    '$.correlationDigest',
    'keyed_digest',
    'Correlation requires a rotating keyed HMAC digest and rotation identifier.',
  );

  return collector.result(input);
}

/** Validate reproducible benchmark metadata and percentile ordering. */
export function validateBenchmarkRecord(input: unknown): ValidationResult<BenchmarkRecord> {
  const collector = new ValidationCollector();
  const record = expectRecord(input, '$', collector);
  if (record === null) {
    return collector.result(input);
  }

  validateHeader(record, ContractKinds.BENCHMARK, '$', collector);
  expectString(record, 'benchmarkId', '$', collector);
  expectString(record, 'scenario', '$', collector);
  expectEnum(record, 'mode', ['cold', 'warm'], '$', collector);
  const warmups = expectNonNegativeInteger(record, 'warmupRuns', '$', collector);
  const measured = expectNonNegativeInteger(record, 'measuredRuns', '$', collector);
  expectEnum(record, 'sampleUnit', ['milliseconds'], '$', collector);
  const p50 = expectNumber(record, 'p50', '$', collector, 0);
  const p95 = expectNumber(record, 'p95', '$', collector, 0);
  expectIsoDate(record, 'recordedAt', '$', collector);
  validateBenchmarkEnvironment(record.environment, collector);

  if (warmups !== null) {
    collector.require(
      warmups >= 5,
      '$.warmupRuns',
      'sample_size',
      'At least five warm-up runs are required.',
    );
  }
  if (measured !== null) {
    collector.require(
      measured >= 30,
      '$.measuredRuns',
      'sample_size',
      'At least thirty measured runs are required.',
    );
  }
  if (p50 !== null && p95 !== null) {
    collector.require(p95 >= p50, '$.p95', 'percentile_order', 'p95 cannot be lower than p50.');
  }

  return collector.result(input);
}

/** Validate the blinded, powered, non-inferiority evaluation manifest. */
export function validateEvaluationManifest(
  input: unknown,
): ValidationResult<EvaluationManifest> {
  const collector = new ValidationCollector();
  const record = expectRecord(input, '$', collector);
  if (record === null) {
    return collector.result(input);
  }

  validateHeader(record, ContractKinds.EVALUATION, '$', collector);
  expectString(record, 'evaluationId', '$', collector);
  expectString(record, 'corpusVersion', '$', collector);
  expectString(record, 'blindOrderManifestId', '$', collector);
  const reviewerCount = expectNonNegativeInteger(record, 'reviewerCount', '$', collector);
  expectString(record, 'confidenceRule', '$', collector);
  const marginStatus = expectEnum(
    record,
    'marginStatus',
    ['baseline-derived', 'provisional-zero-tolerance'],
    '$',
    collector,
  );
  expectEnum(
    record,
    'inconclusivePolicy',
    ['block-release', 'collect-more-until-cap'],
    '$',
    collector,
  );
  if (reviewerCount !== null) {
    collector.require(
      reviewerCount >= 2,
      '$.reviewerCount',
      'reviewers',
      'At least two blinded reviewers are required.',
    );
  }

  validateCorpusCases(record.cases, collector);
  validateRubric(record.rubric, collector);
  validateBaselineVariance(record.baselineVarianceInputs, marginStatus, collector);
  validateSampleSizeRule(record.sampleSizeRule, collector);
  validateMargins(record.nonInferiorityMargins, marginStatus, collector);

  return collector.result(input);
}

/** Validate a typed error outcome and JSON-compatible diagnostic details. */
export function validateErrorRecord(input: unknown): ValidationResult<ContractErrorRecord> {
  const collector = new ValidationCollector();
  const record = expectRecord(input, '$', collector);
  if (record === null) {
    return collector.result(input);
  }

  validateHeader(record, ContractKinds.ERROR, '$', collector);
  expectString(record, 'errorId', '$', collector);
  expectEnum(record, 'code', Object.values(ErrorOutcomeCodes), '$', collector);
  expectString(record, 'message', '$', collector);
  collector.require(
    typeof record.retryable === 'boolean',
    '$.retryable',
    'type',
    'Expected a boolean retry policy.',
  );
  expectEnum(record, 'fallback', ['exact-original', 'none'], '$', collector);
  const details = expectRecord(record.details, '$.details', collector);
  if (details !== null) {
    collector.require(
      isJsonValue(details),
      '$.details',
      'json',
      'Expected JSON-compatible details.',
    );
  }

  return collector.result(input);
}

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

function expectNullableIdentifier(
  record: Record<string, unknown>,
  key: string,
  collector: ValidationCollector,
): void {
  const value = record[key];
  collector.require(
    value === null
      || (typeof value === 'string' && TELEMETRY_IDENTIFIER_PATTERN.test(value)),
    `$.${key}`,
    'type',
    'Expected null or a bounded identifier without whitespace.',
  );
}

function validateNumberMap(
  value: unknown,
  path: string,
  keys: readonly string[],
  integer: boolean,
  collector: ValidationCollector,
): void {
  const record = expectRecord(value, path, collector);
  if (record === null) {
    return;
  }
  expectOnlyKeys(record, keys, path, collector);
  for (const key of keys) {
    const number = expectNumber(record, key, path, collector, 0);
    if (integer && number !== null) {
      collector.require(
        Number.isInteger(number),
        `${path}.${key}`,
        'integer',
        'Expected an integer.',
      );
    }
  }
}

function validateBenchmarkEnvironment(value: unknown, collector: ValidationCollector): void {
  const path = '$.environment';
  const record = expectRecord(value, path, collector);
  if (record === null) {
    return;
  }
  for (const key of [
    'platform',
    'release',
    'architecture',
    'cpu',
    'nodeVersion',
    'powerMode',
  ]) {
    expectString(record, key, path, collector);
  }
  const logicalCpuCount = expectNonNegativeInteger(record, 'logicalCpuCount', path, collector);
  const totalMemoryBytes = expectNonNegativeInteger(record, 'totalMemoryBytes', path, collector);
  if (logicalCpuCount !== null) {
    collector.require(
      logicalCpuCount > 0,
      `${path}.logicalCpuCount`,
      'range',
      'CPU count must be positive.',
    );
  }
  if (totalMemoryBytes !== null) {
    collector.require(
      totalMemoryBytes > 0,
      `${path}.totalMemoryBytes`,
      'range',
      'Memory must be positive.',
    );
  }
}

function validateCorpusCases(value: unknown, collector: ValidationCollector): void {
  collector.require(Array.isArray(value), '$.cases', 'type', 'Expected a corpus-case array.');
  if (!Array.isArray(value)) {
    return;
  }
  collector.require(value.length > 0, '$.cases', 'sample_size', 'Corpus cannot be empty.');
  const seen = new Set<string>();
  for (const [index, caseValue] of value.entries()) {
    const path = `$.cases[${index}]`;
    const record = expectRecord(caseValue, path, collector);
    if (record === null) {
      continue;
    }
    const caseId = expectString(record, 'caseId', path, collector);
    expectString(record, 'category', path, collector);
    expectString(record, 'sourceOriginalId', path, collector);
    expectString(record, 'referenceOutputId', path, collector);
    if (caseId !== null) {
      collector.require(
        !seen.has(caseId),
        `${path}.caseId`,
        'duplicate',
        'Case identifiers must be unique.',
      );
      seen.add(caseId);
    }
  }
}

function validateRubric(value: unknown, collector: ValidationCollector): void {
  collector.require(Array.isArray(value), '$.rubric', 'type', 'Expected a rubric array.');
  if (!Array.isArray(value)) {
    return;
  }
  const dimensions = new Set<string>();
  for (const [index, dimensionValue] of value.entries()) {
    const path = `$.rubric[${index}]`;
    const record = expectRecord(dimensionValue, path, collector);
    if (record === null) {
      continue;
    }
    const name = expectEnum(
      record,
      'name',
      Object.values(EvaluationDimensionNames),
      path,
      collector,
    );
    const minimum = expectNumber(record, 'minimumScore', path, collector);
    const maximum = expectNumber(record, 'maximumScore', path, collector);
    collector.require(
      typeof record.blocking === 'boolean',
      `${path}.blocking`,
      'type',
      'Expected a boolean.',
    );
    if (minimum !== null && maximum !== null) {
      collector.require(
        maximum > minimum,
        `${path}.maximumScore`,
        'range',
        'Maximum score must exceed minimum.',
      );
    }
    if (name !== null) {
      collector.require(
        !dimensions.has(name),
        `${path}.name`,
        'duplicate',
        'Rubric dimensions must be unique.',
      );
      dimensions.add(name);
    }
  }
  for (const dimension of Object.values(EvaluationDimensionNames)) {
    collector.require(
      dimensions.has(dimension),
      '$.rubric',
      'coverage',
      `Missing rubric dimension ${dimension}.`,
    );
  }
}

function validateBaselineVariance(
  value: unknown,
  marginStatus: string | null,
  collector: ValidationCollector,
): void {
  collector.require(
    Array.isArray(value),
    '$.baselineVarianceInputs',
    'type',
    'Expected baseline-variance inputs.',
  );
  if (!Array.isArray(value)) {
    return;
  }
  const dimensions = new Set<string>();
  for (const [index, varianceValue] of value.entries()) {
    const path = `$.baselineVarianceInputs[${index}]`;
    const record = expectRecord(varianceValue, path, collector);
    if (record === null) {
      continue;
    }
    const dimension = expectEnum(
      record,
      'dimension',
      Object.values(EvaluationDimensionNames),
      path,
      collector,
    );
    const status = expectEnum(record, 'status', ['measured', 'pending'], path, collector);
    if (marginStatus === 'baseline-derived') {
      collector.require(
        status === 'measured',
        `${path}.status`,
        'baseline_status',
        'Baseline-derived margins require measured variance inputs.',
      );
    } else if (marginStatus === 'provisional-zero-tolerance') {
      collector.require(
        status === 'pending',
        `${path}.status`,
        'baseline_status',
        'Provisional margins require explicitly pending variance inputs.',
      );
    }
    if (status === 'measured') {
      expectNumber(record, 'referenceToReference', path, collector, 0);
      expectNumber(record, 'humanToHuman', path, collector, 0);
    } else if (status === 'pending') {
      collector.require(
        record.referenceToReference === null && record.humanToHuman === null,
        path,
        'pending_measurement',
        'Pending baseline measurements must use null values.',
      );
    }
    if (dimension !== null) {
      collector.require(
        !dimensions.has(dimension),
        `${path}.dimension`,
        'duplicate',
        'Baseline-variance dimensions must be unique.',
      );
      dimensions.add(dimension);
    }
  }
  for (const dimension of Object.values(EvaluationDimensionNames)) {
    collector.require(
      dimensions.has(dimension),
      '$.baselineVarianceInputs',
      'coverage',
      `Missing baseline-variance dimension ${dimension}.`,
    );
  }
}

function validateSampleSizeRule(value: unknown, collector: ValidationCollector): void {
  const path = '$.sampleSizeRule';
  const record = expectRecord(value, path, collector);
  if (record === null) {
    return;
  }
  const repetitions = expectNonNegativeInteger(record, 'minimumRepetitions', path, collector);
  const minimumPairs = expectNonNegativeInteger(record, 'minimumPairs', path, collector);
  const maximumPairs = expectNonNegativeInteger(record, 'maximumPairs', path, collector);
  expectNumber(record, 'alpha', path, collector, 0.000_001, 0.5);
  expectNumber(record, 'power', path, collector, 0.5, 0.999_999);
  if (repetitions !== null) {
    collector.require(
      repetitions >= 3,
      `${path}.minimumRepetitions`,
      'sample_size',
      'At least three repetitions are required.',
    );
  }
  if (minimumPairs !== null && maximumPairs !== null) {
    collector.require(
      maximumPairs >= minimumPairs,
      `${path}.maximumPairs`,
      'sample_size',
      'Sample cap cannot be below the minimum.',
    );
  }
}

function validateMargins(
  value: unknown,
  status: string | null,
  collector: ValidationCollector,
): void {
  const path = '$.nonInferiorityMargins';
  const record = expectRecord(value, path, collector);
  if (record === null) {
    return;
  }
  expectOnlyKeys(record, Object.values(EvaluationDimensionNames), path, collector);
  for (const dimension of Object.values(EvaluationDimensionNames)) {
    const margin = expectNumber(record, dimension, path, collector, 0);
    if (status === 'provisional-zero-tolerance' && margin !== null) {
      collector.require(
        margin === 0,
        `${path}.${dimension}`,
        'provisional_margin',
        'Provisional non-inferiority margins must be zero.',
      );
    }
  }
}
