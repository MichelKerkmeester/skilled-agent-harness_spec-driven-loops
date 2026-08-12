// ───────────────────────────────────────────────────────────────────
// MODULE: Release Support Types
// ───────────────────────────────────────────────────────────────────

/** Independent axes published by the portable support matrix. */
export type SupportDimension =
  | 'runtime'
  | 'protocol'
  | 'provider'
  | 'model'
  | 'operating-system'
  | 'prompt-profile'
  | 'presentation-tier';

/** Release confidence assigned to one dated support claim. */
export type SupportReleaseStatus = 'supported' | 'provisional' | 'unsupported';

/** One content-free, evidence-backed support claim. */
export interface SupportRow {
  readonly dimension: SupportDimension;
  readonly identifier: string;
  readonly evidenceRef: string;
  readonly testedDate: string;
  readonly expiryDate: string;
  readonly releaseStatus: SupportReleaseStatus;
}

/** Versioned release support claims with a digest over metadata only. */
export interface SupportMatrix {
  readonly version: 'support-matrix/1.0.0';
  readonly rows: readonly SupportRow[];
  readonly contentFreeDigest: string;
}

/** Stable reason emitted while checking one dated support row. */
export type FreshnessReasonCode =
  | 'expired'
  | 'expiry-before-tested'
  | 'expiry-date-invalid'
  | 'fresh'
  | 'now-invalid'
  | 'tested-date-invalid';

/** One row whose evidence remains inside its declared window. */
export interface FreshSupportRow {
  readonly row: SupportRow;
  readonly reasonCode: 'fresh';
}

/** One row that cannot be trusted at the requested date. */
export interface StaleSupportRow {
  readonly row: SupportRow;
  readonly reasonCode: Exclude<FreshnessReasonCode, 'fresh'>;
}

/** Fail-closed freshness decision over a complete support matrix. */
export interface FreshnessResult {
  readonly status: 'fresh' | 'stale';
  readonly decision: 'allow' | 'block';
  readonly freshRows: readonly FreshSupportRow[];
  readonly staleRows: readonly StaleSupportRow[];
  readonly reasonCodes: readonly FreshnessReasonCode[];
}

/** Content-free hosted privacy decision for OpenCode Go. */
export interface HostedPrivacyFreshnessResult {
  readonly decision: 'allow' | 'block';
  readonly reasonCode:
    | 'fresh'
    | 'not-opencode-go-hosted'
    | 'now-invalid'
    | 'privacy-fact-expired'
    | 'privacy-fact-missing'
    | 'privacy-fact-unknown';
  readonly factNames: readonly ('retention' | 'training-use')[];
}
