// ───────────────────────────────────────────────────────────────────
// MODULE: Health Degeneration Policy
// ───────────────────────────────────────────────────────────────────

import { canonicalBytes, canonicalJson, sha256Bytes } from '../event-envelope/index.js';
import {
  HealthHarnessError,
  HealthHarnessErrorCodes,
} from './health-harness-types.js';

import type { JsonObject } from '../event-envelope/index.js';
import type { HealthPolicy } from './health-harness-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. POLICY CONSTRUCTION
// ───────────────────────────────────────────────────────────────────

export const HEALTH_POLICY_VERSION = 'health-shadow-v1';

type HealthPolicyCore = Pick<HealthPolicy,
  | 'schemaVersion'
  | 'policyVersion'
  | 'observationWindow'
  | 'minimumComparableSamples'
  | 'collapseConcentrationCount'
  | 'collapseProgressFloorBps'
  | 'noveltyWindow'
  | 'noveltyLowYieldCount'
  | 'independentEvidenceFloorBps'
  | 'coverageProgressFloorBps'
  | 'qualityComparableSamples'
  | 'qualityDecayDeltaBps'
  | 'budgetDecisionWindow'
  | 'budgetPressureCount'
  | 'budgetPressureRatioBps'
  | 'budgetEvidenceYieldFloorBps'
  | 'healthyWindowsToRecover'
  | 'cooldownObservations'
  | 'observationRetention'
  | 'signalRetention'
  | 'requestRetention'
  | 'deduplicationRetention'
>;

function assertPositiveInteger(value: number, field: string): void {
  if (!Number.isSafeInteger(value) || value < 1) {
    throw new TypeError(`${field} must be a positive safe integer`);
  }
}

function assertBasisPoints(value: number, field: string): void {
  if (!Number.isSafeInteger(value) || value < 0 || value > 10_000) {
    throw new TypeError(`${field} must be an integer from 0 through 10000`);
  }
}

function immutablePolicy(core: HealthPolicyCore): HealthPolicy {
  const digest = sha256Bytes(canonicalBytes(core));
  return Object.freeze(JSON.parse(canonicalJson({
    ...core,
    policyDigest: digest,
  })) as HealthPolicy);
}

/** Create an exact policy generation whose digest commits every threshold. */
export function createHealthPolicy(core: HealthPolicyCore): HealthPolicy {
  if (core.schemaVersion !== 1 || core.policyVersion.trim() === '') {
    throw new TypeError('Health policy requires a supported schema and stable version');
  }
  const positiveFields: readonly (keyof HealthPolicyCore)[] = [
    'observationWindow',
    'minimumComparableSamples',
    'collapseConcentrationCount',
    'noveltyWindow',
    'noveltyLowYieldCount',
    'qualityComparableSamples',
    'budgetDecisionWindow',
    'budgetPressureCount',
    'healthyWindowsToRecover',
    'cooldownObservations',
    'observationRetention',
    'signalRetention',
    'requestRetention',
    'deduplicationRetention',
  ];
  for (const field of positiveFields) {
    assertPositiveInteger(core[field] as number, field);
  }
  const basisPointFields: readonly (keyof HealthPolicyCore)[] = [
    'collapseProgressFloorBps',
    'independentEvidenceFloorBps',
    'coverageProgressFloorBps',
    'qualityDecayDeltaBps',
    'budgetPressureRatioBps',
    'budgetEvidenceYieldFloorBps',
  ];
  for (const field of basisPointFields) {
    assertBasisPoints(core[field] as number, field);
  }
  if (
    core.minimumComparableSamples > core.observationWindow
    || core.collapseConcentrationCount > core.observationWindow
    || core.noveltyLowYieldCount > core.noveltyWindow
    || core.budgetPressureCount > core.budgetDecisionWindow
  ) {
    throw new TypeError('Health policy thresholds cannot exceed their bounded windows');
  }
  return immutablePolicy(core);
}

export const DEFAULT_HEALTH_POLICY = createHealthPolicy({
  schemaVersion: 1,
  policyVersion: HEALTH_POLICY_VERSION,
  observationWindow: 8,
  minimumComparableSamples: 4,
  collapseConcentrationCount: 6,
  collapseProgressFloorBps: 2_500,
  noveltyWindow: 6,
  noveltyLowYieldCount: 4,
  independentEvidenceFloorBps: 2_500,
  coverageProgressFloorBps: 100,
  qualityComparableSamples: 3,
  qualityDecayDeltaBps: 1_000,
  budgetDecisionWindow: 8,
  budgetPressureCount: 3,
  budgetPressureRatioBps: 3_000,
  budgetEvidenceYieldFloorBps: 2_500,
  healthyWindowsToRecover: 2,
  cooldownObservations: 2,
  observationRetention: 64,
  signalRetention: 128,
  requestRetention: 128,
  deduplicationRetention: 128,
});

// ───────────────────────────────────────────────────────────────────
// 2. CLOSED REGISTRY
// ───────────────────────────────────────────────────────────────────

/** Immutable exact-version registry that prevents silent threshold mutation. */
export class HealthPolicyRegistry {
  public readonly digest: string;
  readonly #policies: ReadonlyMap<string, HealthPolicy>;

  public constructor(policies: readonly HealthPolicy[]) {
    if (policies.length === 0) throw new TypeError('Health policy registry cannot be empty');
    const registered = new Map<string, HealthPolicy>();
    for (const policy of policies) {
      const { policyDigest: suppliedDigest, ...core } = policy;
      const expected = immutablePolicy(core);
      if (expected.policyDigest !== suppliedDigest) {
        throw new TypeError('Health policy digest does not match its threshold bytes');
      }
      if (registered.has(policy.policyVersion)) {
        throw new TypeError(`Duplicate health policy version: ${policy.policyVersion}`);
      }
      registered.set(policy.policyVersion, policy);
    }
    this.#policies = registered;
    this.digest = sha256Bytes(canonicalBytes([...registered.values()].map((policy) => ({
      policyVersion: policy.policyVersion,
      policyDigest: policy.policyDigest,
    })) as JsonObject[]));
    Object.freeze(this);
  }

  public resolve(policyVersion: string): HealthPolicy {
    const policy = this.#policies.get(policyVersion);
    if (!policy) {
      throw new HealthHarnessError(
        HealthHarnessErrorCodes.UNSUPPORTED_POLICY,
        'Health policy version is not registered',
        { policyVersion },
      );
    }
    return policy;
  }
}

/** Return the initial additive-dark policy registry. */
export function createDefaultHealthPolicyRegistry(): HealthPolicyRegistry {
  return new HealthPolicyRegistry([DEFAULT_HEALTH_POLICY]);
}
