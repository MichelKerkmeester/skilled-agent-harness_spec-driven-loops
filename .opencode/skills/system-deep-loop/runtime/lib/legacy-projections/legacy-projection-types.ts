// ───────────────────────────────────────────────────────────────────
// MODULE: Legacy Projection Types
// ───────────────────────────────────────────────────────────────────

import type {
  AppendOnlyLedger,
  LedgerHead,
} from '../authorized-ledger/index.js';
import type {
  EventReadResult,
  JsonObject,
} from '../event-envelope/index.js';
import type { DerivedReplayFingerprint } from '../replay-fingerprint/index.js';
import type {
  LegacyProjectionError,
} from './legacy-projection-errors.js';

// ───────────────────────────────────────────────────────────────────
// 1. PROJECTION CONTRACTS
// ───────────────────────────────────────────────────────────────────

/** Exact output family whose existing reader contract must remain unchanged. */
export type LegacyProjectionFormat = 'json' | 'jsonl';

/** Existing writer boundary at which a shadow artifact becomes eligible to refresh. */
export type LegacyProjectionRefreshBoundary = 'event' | 'lifecycle';

/** Immutable starting point for a projection fold. */
export interface LegacyProjectionBase<TState extends JsonObject> {
  readonly baseSha: string;
  readonly baseDigest: string;
  readonly bytes: Uint8Array;
  readonly state: Readonly<TState>;
  readonly ledgerHead: LedgerHead;
}

/** Versioned pure fold plus the exact legacy serializer for one artifact. */
export interface LegacyProjectionContract<TState extends JsonObject> {
  readonly artifactId: string;
  readonly censusSurfaceId: string;
  readonly ledgerId: string;
  readonly streamIds: readonly string[];
  readonly relativePath: string;
  readonly format: LegacyProjectionFormat;
  readonly refreshBoundary: LegacyProjectionRefreshBoundary;
  readonly foldId: string;
  readonly reducerId: string;
  readonly projectionVersion: string;
  readonly reducerVersion: string;
  readonly serializerId: string;
  readonly legacyWriter: string;
  readonly readers: readonly string[];
  readonly base: LegacyProjectionBase<TState>;
  readonly acceptedEventVersions: Readonly<Record<string, readonly number[]>>;
  readonly reduce: (
    state: Readonly<TState>,
    event: Readonly<EventReadResult>,
  ) => TState;
  readonly serialize: (state: Readonly<TState>) => Uint8Array | string;
}

/** Exact immutable oracle and replay binding for one requested shadow refresh. */
export interface LegacyProjectionRequest<TState extends JsonObject> {
  readonly contract: LegacyProjectionContract<TState>;
  readonly ledger: AppendOnlyLedger;
  readonly replayFingerprint: DerivedReplayFingerprint<TState>;
  readonly expectedLegacyBytes: Uint8Array | string;
}

// ───────────────────────────────────────────────────────────────────
// 2. DERIVED EVIDENCE
// ───────────────────────────────────────────────────────────────────

/** Pure fold output retained before any filesystem publication. */
export interface FoldedLegacyProjection<TState extends JsonObject> {
  readonly artifactId: string;
  readonly ledgerHead: LedgerHead;
  readonly foldId: string;
  readonly projectionVersion: string;
  readonly reducerVersion: string;
  readonly serializerId: string;
  readonly refreshBoundary: LegacyProjectionRefreshBoundary;
  readonly replayFingerprint: string;
  readonly state: Readonly<TState>;
  readonly bytes: Uint8Array;
  readonly digest: string;
}

/** Durable progress record written only after projected output is durable. */
export interface LegacyProjectionWatermark {
  readonly watermark_version: number;
  readonly artifact_id: string;
  readonly ledger_id: string;
  readonly ledger_sequence: number;
  readonly ledger_record_hash: string;
  readonly projection_version: string;
  readonly reducer_version: string;
  readonly replay_fingerprint: string;
  readonly base_sha: string;
  readonly base_digest: string;
  readonly prior_ledger_sequence: number | null;
  readonly prior_output_digest: string | null;
  readonly output_digest: string;
  readonly output_byte_length: number;
  readonly refreshed_at: string;
}

/** Success evidence passed to the later parity consumer. */
export interface LegacyProjectionReceipt {
  readonly artifactId: string;
  readonly censusSurfaceId: string;
  readonly outputPath: string;
  readonly watermarkPath: string;
  readonly ledgerHead: LedgerHead;
  readonly foldId: string;
  readonly projectionVersion: string;
  readonly reducerVersion: string;
  readonly serializerId: string;
  readonly refreshBoundary: LegacyProjectionRefreshBoundary;
  readonly replayFingerprint: string;
  readonly baseSha: string;
  readonly baseDigest: string;
  readonly manifestDigest: string;
  readonly expectedDigest: string;
  readonly projectedDigest: string;
  readonly expectedBytes: readonly number[];
  readonly projectedBytes: readonly number[];
  readonly byteLength: number;
  readonly publication: 'appended' | 'recovered' | 'replaced' | 'unchanged';
  readonly refreshedAt: string;
}

/** Bounded observation emitted for every projection attempt. */
export interface LegacyProjectionObservation {
  readonly artifactId: string;
  readonly status: 'failed' | 'published' | 'unchanged';
  readonly ledgerSequence: number | null;
  readonly watermarkSequence: number | null;
  readonly lagEvents: number | null;
  readonly refreshDurationMs: number;
  readonly projectionVersion: string;
  readonly code: string | null;
  readonly invariant: string | null;
  readonly observedAt: string;
}

/** Public result keeps typed failures separate from trusted receipts. */
export type LegacyProjectionResult =
  | { readonly ok: true; readonly receipt: LegacyProjectionReceipt }
  | { readonly ok: false; readonly error: LegacyProjectionError };

// ───────────────────────────────────────────────────────────────────
// 3. RUNTIME OPTIONS
// ───────────────────────────────────────────────────────────────────

/** Fault boundaries used to prove output-before-watermark crash recovery. */
export interface LegacyProjectionFaultInjection {
  readonly beforeOutputCommit?: () => void;
  readonly afterOutputDurableBeforeWatermark?: () => void;
}

/** Filesystem, clock, and observation dependencies for the shadow publisher. */
export interface LegacyProjectionEngineOptions {
  readonly shadowRoot: string;
  readonly protectedLegacyPaths: readonly string[];
  readonly now?: () => Date;
  readonly observe?: (observation: Readonly<LegacyProjectionObservation>) => void;
  readonly faultInjection?: LegacyProjectionFaultInjection;
}
