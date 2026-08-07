// ───────────────────────────────────────────────────────────────────
// MODULE: Transition Policy Registry
// ───────────────────────────────────────────────────────────────────

import { canonicalBytes, sha256Bytes } from '../event-envelope/index.js';
import {
  AuthorizedLedgerError,
  AuthorizedLedgerErrorCodes,
} from './authorized-ledger-errors.js';

import type {
  PolicyEvaluationInput,
  PolicyEvaluationResult,
  TransitionPolicyDefinition,
} from './authorized-ledger-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

export interface RegisteredTransitionPolicy {
  readonly policyId: string;
  readonly policyVersion: number;
  readonly evaluatorVersion: string;
  readonly ruleIds: readonly string[];
  readonly implementationDigest: string;
  readonly digest: string;
  readonly evaluate: (
    input: Readonly<PolicyEvaluationInput>,
  ) => PolicyEvaluationResult | Promise<PolicyEvaluationResult>;
}

export interface TransitionPolicyInspectionEntry {
  readonly policyId: string;
  readonly policyVersion: number;
  readonly evaluatorVersion: string;
  readonly ruleIds: readonly string[];
  readonly implementationDigest: string;
  readonly digest: string;
}

// ───────────────────────────────────────────────────────────────────
// 2. HELPERS
// ───────────────────────────────────────────────────────────────────

function requireIdentity(value: string, field: string): string {
  if (typeof value !== 'string' || value.trim() === '' || value.length > 256) {
    throw new AuthorizedLedgerError(
      AuthorizedLedgerErrorCodes.INPUT_INVALID,
      'input',
      'Policy identity fields must be bounded non-empty strings',
      { field },
    );
  }
  return value;
}

function registryKey(policyId: string, policyVersion: number): string {
  return `${policyId}@${policyVersion}`;
}

function registerPolicy(definition: TransitionPolicyDefinition): RegisteredTransitionPolicy {
  const policyId = requireIdentity(definition.policyId, 'policyId');
  const evaluatorVersion = requireIdentity(definition.evaluatorVersion, 'evaluatorVersion');
  if (!Number.isSafeInteger(definition.policyVersion) || definition.policyVersion <= 0) {
    throw new AuthorizedLedgerError(
      AuthorizedLedgerErrorCodes.INPUT_INVALID,
      'input',
      'Policy version must be a positive safe integer',
      { policyId, policyVersion: definition.policyVersion },
    );
  }
  if (typeof definition.evaluate !== 'function') {
    throw new AuthorizedLedgerError(
      AuthorizedLedgerErrorCodes.INPUT_INVALID,
      'input',
      'Transition policy requires one deterministic evaluator',
      { policyId, policyVersion: definition.policyVersion },
    );
  }

  const ruleIds = [...definition.ruleIds].map((ruleId) => requireIdentity(ruleId, 'ruleId')).sort();
  if (ruleIds.length === 0 || new Set(ruleIds).size !== ruleIds.length) {
    throw new AuthorizedLedgerError(
      AuthorizedLedgerErrorCodes.INPUT_INVALID,
      'input',
      'Transition policy rule identities must be non-empty and unique',
      { policyId, policyVersion: definition.policyVersion },
    );
  }
  const implementationDigest = sha256Bytes(
    canonicalBytes(Function.prototype.toString.call(definition.evaluate)),
  );
  const digest = sha256Bytes(canonicalBytes({
    policyId,
    policyVersion: definition.policyVersion,
    evaluatorVersion,
    ruleIds,
    implementationDigest,
  }));
  return Object.freeze({
    policyId,
    policyVersion: definition.policyVersion,
    evaluatorVersion,
    ruleIds: Object.freeze(ruleIds),
    implementationDigest,
    digest,
    evaluate: definition.evaluate,
  });
}

// ───────────────────────────────────────────────────────────────────
// 3. REGISTRY
// ───────────────────────────────────────────────────────────────────

/** Immutable exact-version registry for deterministic transition policies. */
export class TransitionPolicyRegistry {
  readonly #policies: ReadonlyMap<string, RegisteredTransitionPolicy>;
  public readonly digest: string;

  public constructor(definitions: readonly TransitionPolicyDefinition[]) {
    const policies = new Map<string, RegisteredTransitionPolicy>();
    for (const definition of definitions) {
      const policy = registerPolicy(definition);
      const key = registryKey(policy.policyId, policy.policyVersion);
      if (policies.has(key)) {
        throw new AuthorizedLedgerError(
          AuthorizedLedgerErrorCodes.INPUT_INVALID,
          'input',
          'Transition policy registry contains a duplicate exact version',
          { policyId: policy.policyId, policyVersion: policy.policyVersion },
        );
      }
      policies.set(key, policy);
    }
    this.#policies = policies;
    this.digest = sha256Bytes(canonicalBytes(this.inspect()));
    Object.freeze(this);
  }

  /** Return a stable function-free policy registry description. */
  public inspect(): readonly TransitionPolicyInspectionEntry[] {
    return Object.freeze(
      Array.from(this.#policies.values())
        .sort((left, right) => registryKey(left.policyId, left.policyVersion)
          .localeCompare(registryKey(right.policyId, right.policyVersion)))
        .map((policy) => Object.freeze({
          policyId: policy.policyId,
          policyVersion: policy.policyVersion,
          evaluatorVersion: policy.evaluatorVersion,
          ruleIds: Object.freeze([...policy.ruleIds]),
          implementationDigest: policy.implementationDigest,
          digest: policy.digest,
        })),
    );
  }

  /** Resolve an exact immutable policy version or fail closed. */
  public resolve(policyId: string, policyVersion: number): RegisteredTransitionPolicy {
    const policy = this.#policies.get(registryKey(policyId, policyVersion));
    if (!policy) {
      throw new AuthorizedLedgerError(
        AuthorizedLedgerErrorCodes.AUTHORIZATION_INVALID,
        'authorization',
        'Requested transition policy is not registered',
        { policyId, policyVersion },
      );
    }
    return policy;
  }
}
