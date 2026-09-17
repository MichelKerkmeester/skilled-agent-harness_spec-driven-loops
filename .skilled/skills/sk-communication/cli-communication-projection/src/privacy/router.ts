// ───────────────────────────────────────────────────────────────────
// MODULE: Privacy-First Provider Routing
// ───────────────────────────────────────────────────────────────────

import { PrivacyClasses } from '../contracts/context.js';
import { validatePrivacyDecision } from '../contracts/validate-policy.js';
import { deepFreeze } from '../fidelity/freeze.js';
import { createProviderRegistry } from '../providers/registry.js';
import {
  ProviderPrivacyFactNames,
} from '../providers/types.js';
import { PrivacyRoutingReasonCodes } from './types.js';

import type { PrivacyClass, PrivacyDecision } from '../contracts/context.js';
import type { ProviderModelRecord, ProviderPrivacyFact } from '../providers/types.js';
import type {
  DeniedPrivacyRoute,
  EligibleProviderRanker,
  PrivacyRoute,
  PrivacyRouteInput,
  PrivacyRoutingReasonCode,
  ProviderPrivacyEvaluation,
} from './types.js';

/** Select one primary and explicit fallbacks without allowing transport during routing. */
export function selectPrivacyRoute(
  input: PrivacyRouteInput,
  ranker: EligibleProviderRanker = rankEligibleProviders,
): PrivacyRoute {
  const inputReason = validateInput(input);
  if (inputReason !== null) {
    return denied(inputReason, []);
  }
  const registryResult = createProviderRegistry(input.records);
  if (!registryResult.success) {
    return denied(PrivacyRoutingReasonCodes.INVALID_INPUT, []);
  }
  const registry = registryResult.value;
  const evaluations: ProviderPrivacyEvaluation[] = [];
  const eligible: ProviderModelRecord[] = [];
  for (const providerId of input.candidateProviderIds) {
    const record = registry.get(providerId);
    if (record === null) {
      evaluations.push(evaluation(
        providerId,
        PrivacyClasses.UNKNOWN,
        'deny',
        PrivacyRoutingReasonCodes.PROVIDER_NOT_FOUND,
      ));
      continue;
    }
    const result = evaluateRecord(record, input);
    evaluations.push(result);
    if (result.decision === 'allow') {
      eligible.push(record);
    }
  }
  if (eligible.length === 0) {
    return denied(firstDenial(evaluations), evaluations);
  }

  let ranked: readonly ProviderModelRecord[] | null;
  try {
    ranked = validateRanking(ranker(Object.freeze([...eligible])), eligible);
  } catch (error: unknown) {
    ranked = null;
  }
  if (ranked === null || ranked.length === 0) {
    return denied(PrivacyRoutingReasonCodes.INVALID_INPUT, evaluations);
  }
  const primary = ranked[0];
  if (primary === undefined) {
    return denied(PrivacyRoutingReasonCodes.INVALID_INPUT, evaluations);
  }
  const attempts: ProviderModelRecord[] = [primary];
  const fallbackPolicy = primary.provider.fallbackPolicy;
  if (fallbackPolicy.mode === 'explicit-list') {
    for (const providerId of fallbackPolicy.providerIds) {
      if (attempts.some((record) => record.provider.providerId === providerId)) {
        continue;
      }
      const fallback = registry.get(providerId);
      if (fallback === null) {
        evaluations.push(evaluation(
          providerId,
          PrivacyClasses.UNKNOWN,
          'deny',
          PrivacyRoutingReasonCodes.PROVIDER_NOT_FOUND,
        ));
        continue;
      }
      if (
        fallbackPolicy.preservePrivacyClass
        && fallback.provider.privacyClass !== primary.provider.privacyClass
      ) {
        evaluations.push(evaluation(
          providerId,
          fallback.provider.privacyClass,
          'deny',
          PrivacyRoutingReasonCodes.PRIVACY_CLASS_NOT_ALLOWED,
        ));
        continue;
      }
      const result = evaluateRecord(fallback, input);
      evaluations.push(result);
      if (result.decision === 'allow') {
        attempts.push(fallback);
      }
    }
  }

  const privacyDecision = createAllowedDecision(primary, input.policy.egressConsent);
  if (privacyDecision === null) {
    return denied(PrivacyRoutingReasonCodes.INVALID_INPUT, evaluations);
  }
  return deepFreeze({
    status: 'approved',
    reasonCode: PrivacyRoutingReasonCodes.ALLOWED_BY_POLICY,
    policy: structuredClone(input.policy),
    privacyDecision,
    primary,
    attempts: attempts as [ProviderModelRecord, ...ProviderModelRecord[]],
    evaluations,
  });
}

/** Deterministic default ranking over privacy-approved records only. */
export function rankEligibleProviders(
  eligible: readonly ProviderModelRecord[],
): readonly ProviderModelRecord[] {
  return Object.freeze([...eligible].sort((left, right) =>
    right.priority - left.priority
      || left.provider.providerId.localeCompare(right.provider.providerId)));
}

function evaluateRecord(
  record: ProviderModelRecord,
  input: PrivacyRouteInput,
): ProviderPrivacyEvaluation {
  const privacyClass = record.provider.privacyClass;
  if (privacyClass === PrivacyClasses.UNKNOWN) {
    return evaluation(
      record.provider.providerId,
      privacyClass,
      'deny',
      PrivacyRoutingReasonCodes.PRIVACY_CLASS_UNKNOWN,
    );
  }
  if (!input.policy.allowedPrivacyClasses.includes(privacyClass)) {
    return evaluation(
      record.provider.providerId,
      privacyClass,
      'deny',
      PrivacyRoutingReasonCodes.PRIVACY_CLASS_NOT_ALLOWED,
    );
  }
  if (record.provider.deploymentMode === 'hosted' && !input.policy.egressConsent) {
    return evaluation(
      record.provider.providerId,
      privacyClass,
      'deny',
      PrivacyRoutingReasonCodes.EGRESS_NOT_CONSENTED,
    );
  }
  if (record.provider.deploymentMode === 'hosted' && !hasFreshTerms(record, input.now)) {
    return evaluation(
      record.provider.providerId,
      privacyClass,
      'deny',
      PrivacyRoutingReasonCodes.TERMS_STALE,
    );
  }

  const requiredFacts = new Set(input.policy.requiredKnownFacts);
  if (privacyClass === PrivacyClasses.HOSTED_ZDR) {
    requiredFacts.add(ProviderPrivacyFactNames.RETENTION);
    requiredFacts.add(ProviderPrivacyFactNames.TRAINING_USE);
  }
  for (const name of requiredFacts) {
    const fact = record.privacyFacts.find((candidate) => candidate.name === name);
    const factReason = evaluateFact(fact, input.now);
    if (factReason !== null) {
      return evaluation(record.provider.providerId, privacyClass, 'deny', factReason);
    }
  }
  if (privacyClass === PrivacyClasses.HOSTED_ZDR && contradictsZdr(record.privacyFacts)) {
    return evaluation(
      record.provider.providerId,
      privacyClass,
      'deny',
      PrivacyRoutingReasonCodes.PRIVACY_FACT_CONTRADICTORY,
    );
  }
  return evaluation(
    record.provider.providerId,
    privacyClass,
    'allow',
    PrivacyRoutingReasonCodes.ALLOWED_BY_POLICY,
  );
}

function evaluateFact(
  fact: ProviderPrivacyFact | undefined,
  now: string,
): PrivacyRoutingReasonCode | null {
  if (fact === undefined || fact.state === 'unknown') {
    return PrivacyRoutingReasonCodes.PRIVACY_FACT_UNKNOWN;
  }
  const nowMs = Date.parse(now);
  if (
    Date.parse(fact.observedAt) > nowMs
    || (fact.expiresAt !== null && Date.parse(fact.expiresAt) <= nowMs)
  ) {
    return PrivacyRoutingReasonCodes.PRIVACY_FACT_STALE;
  }
  return null;
}

function contradictsZdr(facts: readonly ProviderPrivacyFact[]): boolean {
  const retention = facts.find((fact) => fact.name === ProviderPrivacyFactNames.RETENTION);
  const training = facts.find((fact) => fact.name === ProviderPrivacyFactNames.TRAINING_USE);
  return retention?.value !== '0-days' || training?.value !== 'not-used';
}

function hasFreshTerms(record: ProviderModelRecord, now: string): boolean {
  const checkedAt = record.provider.termsCheckedAt;
  const expiresAt = record.provider.termsExpiresAt;
  if (checkedAt === null || expiresAt === null) {
    return false;
  }
  const nowMs = Date.parse(now);
  return Date.parse(checkedAt) <= nowMs && Date.parse(expiresAt) > nowMs;
}

function createAllowedDecision(
  record: ProviderModelRecord,
  egressConsent: boolean,
): PrivacyDecision | null {
  const candidate: PrivacyDecision = {
    contractKind: 'privacy-decision',
    schemaVersion: '1.0.0',
    privacyClass: record.provider.privacyClass,
    route: record.provider.deploymentMode,
    egressConsent,
    decision: 'allow',
    reasonCode: 'allowed-by-policy',
  };
  const result = validatePrivacyDecision(candidate);
  return result.success ? deepFreeze(structuredClone(result.value)) : null;
}

function validateInput(input: PrivacyRouteInput): DeniedPrivacyRoute['reasonCode'] | null {
  if (
    typeof input !== 'object'
    || input === null
    || !Array.isArray(input.records)
    || !Array.isArray(input.candidateProviderIds)
    || input.candidateProviderIds.length === 0
    || input.candidateProviderIds.some((value) => typeof value !== 'string' || value.length === 0)
    || new Set(input.candidateProviderIds).size !== input.candidateProviderIds.length
    || typeof input.policy !== 'object'
    || input.policy === null
    || !Array.isArray(input.policy.allowedPrivacyClasses)
    || input.policy.allowedPrivacyClasses.length === 0
    || !Array.isArray(input.policy.requiredKnownFacts)
    || typeof input.policy.egressConsent !== 'boolean'
    || !Number.isFinite(Date.parse(input.now))
  ) {
    return PrivacyRoutingReasonCodes.INVALID_INPUT;
  }
  return null;
}

function validateRanking(
  ranked: readonly ProviderModelRecord[],
  eligible: readonly ProviderModelRecord[],
): readonly ProviderModelRecord[] | null {
  if (!Array.isArray(ranked) || ranked.length !== eligible.length) {
    return null;
  }
  const expected = new Set(eligible.map((record) => record.provider.providerId));
  const actual = ranked.map((record) => record.provider.providerId);
  return new Set(actual).size === actual.length && actual.every((id) => expected.has(id))
    ? Object.freeze([...ranked])
    : null;
}

function firstDenial(
  evaluations: readonly ProviderPrivacyEvaluation[],
): DeniedPrivacyRoute['reasonCode'] {
  const reasonCode = evaluations.find((entry) => entry.decision === 'deny')?.reasonCode;
  return reasonCode === undefined || reasonCode === PrivacyRoutingReasonCodes.ALLOWED_BY_POLICY
    ? PrivacyRoutingReasonCodes.INVALID_INPUT
    : reasonCode;
}

function evaluation(
  providerId: string,
  privacyClass: PrivacyClass,
  decision: ProviderPrivacyEvaluation['decision'],
  reasonCode: PrivacyRoutingReasonCode,
): ProviderPrivacyEvaluation {
  return Object.freeze({ providerId, privacyClass, decision, reasonCode });
}

function denied(
  reasonCode: DeniedPrivacyRoute['reasonCode'],
  evaluations: readonly ProviderPrivacyEvaluation[],
): DeniedPrivacyRoute {
  return deepFreeze({
    status: 'denied',
    reasonCode,
    privacyDecision: null,
    primary: null,
    attempts: [],
    evaluations: [...evaluations],
  });
}
