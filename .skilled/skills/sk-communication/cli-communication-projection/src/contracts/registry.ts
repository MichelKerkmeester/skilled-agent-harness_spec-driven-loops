// ───────────────────────────────────────────────────────────────────
// MODULE: Contract Registry
// ───────────────────────────────────────────────────────────────────

import { ContractKinds } from './common.js';
import { ContractErrorCodes, ContractValidationError } from './errors.js';
import {
  validateBenchmarkRecord,
  validateErrorRecord,
  validateEvaluationManifest,
  validateTelemetryEvent,
} from './validate-evidence.js';
import { validateEventEnvelope, validateExactOriginal } from './validate-event.js';
import {
  validateBoundedContext,
  validatePrivacyDecision,
  validateProjectionOutcome,
  validatePromptProfile,
  validateProviderRecord,
} from './validate-policy.js';
import { ValidationCollector, expectRecord, expectString } from './validator-utils.js';

import type { ContractKind, ValidationResult } from './common.js';
import type { BoundedContextRecord, PrivacyDecision } from './context.js';
import type { BenchmarkRecord, EvaluationManifest, TelemetryEvent } from './evidence.js';
import type { ContractErrorRecord } from './error-record.js';
import type { EventEnvelope } from './event.js';
import type { ExactOriginalRecord } from './exact-original.js';
import type { ProjectionOutcome } from './projection.js';
import type { PromptProfileRecord } from './prompt.js';
import type { ProviderRecord } from './provider.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

/** Union of every contract record accepted by the package registry. */
export type ContractRecord =
  | BenchmarkRecord
  | BoundedContextRecord
  | ContractErrorRecord
  | EvaluationManifest
  | EventEnvelope
  | ExactOriginalRecord
  | PrivacyDecision
  | ProjectionOutcome
  | PromptProfileRecord
  | ProviderRecord
  | TelemetryEvent;

// ───────────────────────────────────────────────────────────────────
// 2. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

/** Validate a record through its declared contract family. */
export function validateContract(input: unknown): ValidationResult<ContractRecord> {
  const collector = new ValidationCollector();
  const record = expectRecord(input, '$', collector);
  if (record === null) {
    return collector.result(input);
  }

  const kind = expectString(record, 'contractKind', '$', collector);
  if (kind === null || !isContractKind(kind)) {
    collector.require(false, '$.contractKind', 'contract_kind', 'Unknown contract kind.');
    return collector.result(input);
  }

  switch (kind) {
    case ContractKinds.BENCHMARK:
      return validateBenchmarkRecord(input);
    case ContractKinds.BOUNDED_CONTEXT:
      return validateBoundedContext(input);
    case ContractKinds.ERROR:
      return validateErrorRecord(input);
    case ContractKinds.EVALUATION:
      return validateEvaluationManifest(input);
    case ContractKinds.EVENT:
      return validateEventEnvelope(input);
    case ContractKinds.EXACT_ORIGINAL:
      return validateExactOriginal(input);
    case ContractKinds.PRIVACY_DECISION:
      return validatePrivacyDecision(input);
    case ContractKinds.PROMPT_PROFILE:
      return validatePromptProfile(input);
    case ContractKinds.PROJECTION:
      return validateProjectionOutcome(input);
    case ContractKinds.PROVIDER:
      return validateProviderRecord(input);
    case ContractKinds.TELEMETRY:
      return validateTelemetryEvent(input);
  }
}

/** Validate a record and throw a typed error while retaining its original reference. */
export function assertValidContract(input: unknown): ContractRecord {
  const result = validateContract(input);
  if (result.success) {
    return result.value;
  }

  const isUnsupportedMajor = result.issues.some(
    (issue) => issue.code === 'unsupported_major',
  );
  const code = isUnsupportedMajor
    ? ContractErrorCodes.UNSUPPORTED_SCHEMA_MAJOR
    : ContractErrorCodes.INVALID_CONTRACT;
  throw new ContractValidationError(
    code,
    `Contract validation failed with ${result.issues.length} issue(s).`,
    result.issues,
    result.originalInput,
  );
}

/** Return true when a value names a registered contract family. */
export function isContractKind(value: string): value is ContractKind {
  return (Object.values(ContractKinds) as readonly string[]).includes(value);
}
