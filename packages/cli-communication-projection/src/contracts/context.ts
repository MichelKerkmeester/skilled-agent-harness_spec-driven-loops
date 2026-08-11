// ───────────────────────────────────────────────────────────────────
// MODULE: Bounded Context and Privacy Contracts
// ───────────────────────────────────────────────────────────────────

import type { ContractHeader } from './common.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

/** Privacy classification and egress decision for one processing step. */
export interface PrivacyDecision extends ContractHeader {
  readonly contractKind: 'privacy-decision';
  readonly privacyClass: PrivacyClass;
  readonly route: 'hosted' | 'local';
  readonly egressConsent: boolean;
  readonly decision: 'allow' | 'deny';
  readonly reasonCode: PrivacyReasonCode;
}

/** Selected non-meta user message, referenced without copying its bytes. */
export interface SelectedContextMessage {
  readonly messageId: string;
  readonly role: 'user';
  readonly isMeta: false;
  readonly textOriginalId: string;
}

/** Explicit truncation policy and observed result. */
export interface ContextTruncation {
  readonly unit: 'bytes' | 'codepoints' | 'tokens';
  readonly limit: number;
  readonly originalUnits: number;
  readonly selectedUnits: number;
  readonly wasTruncated: boolean;
}

/** Freshness evidence for the transcript used during selection. */
export interface TranscriptFreshness {
  readonly state: 'fresh' | 'stale' | 'unknown';
  readonly observedAt: string;
  readonly maximumAgeMs: number;
}

/** Versioned bounded-context selection result. */
export interface BoundedContextRecord extends ContractHeader {
  readonly contractKind: 'bounded-context';
  readonly contextId: string;
  readonly outcome: 'absent' | 'present';
  readonly selectedMessage: SelectedContextMessage | null;
  readonly truncation: ContextTruncation;
  readonly privacy: PrivacyDecision;
  readonly absentReason: ContextAbsentReason | null;
  readonly transcriptFreshness: TranscriptFreshness;
  readonly noContextFallback: 'exact-original' | 'rewrite-without-context';
}

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

/** Privacy classes ordered by deployment and data-handling boundary. */
export const PrivacyClasses = {
  HOSTED_RETAINED: 'hosted-retained',
  HOSTED_ZDR: 'hosted-zdr',
  LOCAL_NETWORKED: 'local-networked',
  LOCAL_OFFLINE: 'local-offline',
  UNKNOWN: 'unknown',
} as const;

/** Privacy class for a provider or context decision. */
export type PrivacyClass = typeof PrivacyClasses[keyof typeof PrivacyClasses];

/** Stable reasons for privacy routing decisions. */
export const PrivacyReasonCodes = {
  ALLOWED_BY_POLICY: 'allowed-by-policy',
  EGRESS_NOT_CONSENTED: 'egress-not-consented',
  PRIVACY_CLASS_UNKNOWN: 'privacy-class-unknown',
  TERMS_STALE: 'terms-stale',
} as const;

/** Privacy decision reason. */
export type PrivacyReasonCode =
  typeof PrivacyReasonCodes[keyof typeof PrivacyReasonCodes];

/** Explicit reasons why bounded user context is absent. */
export const ContextAbsentReasons = {
  META_ONLY: 'meta-only',
  NO_USER_MESSAGE: 'no-user-message',
  PRIVACY_DENIED: 'privacy-denied',
  STALE_TRANSCRIPT: 'stale-transcript',
  TRANSCRIPT_UNAVAILABLE: 'transcript-unavailable',
} as const;

/** Reason why no bounded context was selected. */
export type ContextAbsentReason =
  typeof ContextAbsentReasons[keyof typeof ContextAbsentReasons];
