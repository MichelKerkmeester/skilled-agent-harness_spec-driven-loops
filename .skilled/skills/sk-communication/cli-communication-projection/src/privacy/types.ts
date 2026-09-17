// ───────────────────────────────────────────────────────────────────
// MODULE: Privacy Route Types
// ───────────────────────────────────────────────────────────────────

import type { PrivacyClass, PrivacyDecision } from '../contracts/context.js';
import type {
  ProviderModelRecord,
  ProviderPrivacyFactName,
} from '../providers/types.js';

/** Stable routing reasons that never contain source or provider response text. */
export const PrivacyRoutingReasonCodes = {
  ALLOWED_BY_POLICY: 'allowed-by-policy',
  EGRESS_NOT_CONSENTED: 'egress-not-consented',
  INVALID_INPUT: 'invalid-input',
  PRIVACY_CLASS_NOT_ALLOWED: 'privacy-class-not-allowed',
  PRIVACY_CLASS_UNKNOWN: 'privacy-class-unknown',
  PRIVACY_FACT_CONTRADICTORY: 'privacy-fact-contradictory',
  PRIVACY_FACT_STALE: 'privacy-fact-stale',
  PRIVACY_FACT_UNKNOWN: 'privacy-fact-unknown',
  PROVIDER_NOT_FOUND: 'provider-not-found',
  TERMS_STALE: 'terms-stale',
} as const;

/** Content-free privacy routing reason. */
export type PrivacyRoutingReasonCode =
  typeof PrivacyRoutingReasonCodes[keyof typeof PrivacyRoutingReasonCodes];

/** Policy inputs established before provider quality or cost ranking. */
export interface PrivacyRoutePolicy {
  readonly allowedPrivacyClasses: readonly PrivacyClass[];
  readonly egressConsent: boolean;
  readonly requiredKnownFacts: readonly ProviderPrivacyFactName[];
}

/** Complete transport-free route selection input. */
export interface PrivacyRouteInput {
  readonly records: readonly ProviderModelRecord[];
  readonly candidateProviderIds: readonly string[];
  readonly policy: PrivacyRoutePolicy;
  readonly now: string;
}

/** One content-free provider eligibility result. */
export interface ProviderPrivacyEvaluation {
  readonly providerId: string;
  readonly privacyClass: PrivacyClass;
  readonly decision: 'allow' | 'deny';
  readonly reasonCode: PrivacyRoutingReasonCode;
}

/** Ranker invoked only after every candidate has passed privacy policy. */
export type EligibleProviderRanker = (
  eligible: readonly ProviderModelRecord[],
) => readonly ProviderModelRecord[];

/** Approved primary plus only explicitly configured, policy-safe fallbacks. */
export interface ApprovedPrivacyRoute {
  readonly status: 'approved';
  readonly reasonCode: 'allowed-by-policy';
  readonly policy: PrivacyRoutePolicy;
  readonly privacyDecision: PrivacyDecision;
  readonly primary: ProviderModelRecord;
  readonly attempts: readonly [ProviderModelRecord, ...ProviderModelRecord[]];
  readonly evaluations: readonly ProviderPrivacyEvaluation[];
}

/** Fail-closed route decision created without invoking a transport. */
export interface DeniedPrivacyRoute {
  readonly status: 'denied';
  readonly reasonCode: Exclude<PrivacyRoutingReasonCode, 'allowed-by-policy'>;
  readonly privacyDecision: null;
  readonly primary: null;
  readonly attempts: readonly [];
  readonly evaluations: readonly ProviderPrivacyEvaluation[];
}

/** Transport-free privacy route result. */
export type PrivacyRoute = ApprovedPrivacyRoute | DeniedPrivacyRoute;
