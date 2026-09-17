// ───────────────────────────────────────────────────────────────────
// MODULE: Contract Compatibility Policy
// ───────────────────────────────────────────────────────────────────

import { ContractKinds } from '../contracts/common.js';

import type { ContractKind } from '../contracts/common.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

/** Parsed semantic version used by the compatibility policy. */
export interface SemanticVersion {
  readonly major: number;
  readonly minor: number;
  readonly patch: number;
}

/** Compatibility decision for one contract kind and candidate version. */
export interface CompatibilityDecision {
  readonly supported: boolean;
  readonly behavior: CompatibilityBehavior;
  readonly requiresMigration: boolean;
  readonly supportedVersion: string;
  readonly candidateVersion: string;
  readonly reason: string;
}

/** Version behavior exposed to callers and migration tooling. */
export type CompatibilityBehavior =
  | 'additive'
  | 'backward-readable'
  | 'breaking'
  | 'exact'
  | 'invalid';

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

/** Current readable schema version for each contract family. */
export const SupportedSchemaVersions = {
  [ContractKinds.BENCHMARK]: '1.0.0',
  [ContractKinds.BOUNDED_CONTEXT]: '1.0.0',
  [ContractKinds.ERROR]: '1.0.0',
  [ContractKinds.EVALUATION]: '1.0.0',
  [ContractKinds.EVENT]: '1.0.0',
  [ContractKinds.EXACT_ORIGINAL]: '1.0.0',
  [ContractKinds.PRIVACY_DECISION]: '1.0.0',
  [ContractKinds.PROMPT_PROFILE]: '1.0.0',
  [ContractKinds.PROJECTION]: '1.0.0',
  [ContractKinds.PROVIDER]: '1.0.0',
  [ContractKinds.TELEMETRY]: '1.0.0',
} as const satisfies Record<ContractKind, string>;

// ───────────────────────────────────────────────────────────────────
// 3. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

/** Parse a strict three-component semantic version without coercion. */
export function parseSemanticVersion(version: string): SemanticVersion | null {
  const match = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.exec(version);
  if (match === null) {
    return null;
  }

  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
  };
}

/** Assess whether a contract version can be consumed without mutation. */
export function assessSchemaCompatibility(
  contractKind: ContractKind,
  candidateVersion: string,
): CompatibilityDecision {
  const supportedVersion = SupportedSchemaVersions[contractKind];
  const supported = parseSemanticVersion(supportedVersion);
  const candidate = parseSemanticVersion(candidateVersion);

  if (supported === null || candidate === null) {
    return {
      supported: false,
      behavior: 'invalid',
      requiresMigration: false,
      supportedVersion,
      candidateVersion,
      reason: 'Schema versions must use strict major.minor.patch syntax.',
    };
  }

  if (candidate.major !== supported.major) {
    return {
      supported: false,
      behavior: 'breaking',
      requiresMigration: true,
      supportedVersion,
      candidateVersion,
      reason: 'Unsupported schema major; preserve the original and fail closed.',
    };
  }

  if (candidate.minor > supported.minor) {
    return {
      supported: true,
      behavior: 'additive',
      requiresMigration: false,
      supportedVersion,
      candidateVersion,
      reason: 'Same-major additive fields remain readable and must be preserved.',
    };
  }

  if (candidate.minor < supported.minor) {
    return {
      supported: true,
      behavior: 'backward-readable',
      requiresMigration: false,
      supportedVersion,
      candidateVersion,
      reason: 'Earlier same-major records remain readable without rewriting them.',
    };
  }

  return {
    supported: true,
    behavior: candidate.patch === supported.patch ? 'exact' : 'backward-readable',
    requiresMigration: false,
    supportedVersion,
    candidateVersion,
    reason: 'Patch changes do not alter the serialized contract.',
  };
}
