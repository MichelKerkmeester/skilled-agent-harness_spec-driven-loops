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
  JsonPrimitive,
} from '../event-envelope/index.js';
import type { DerivedReplayFingerprint } from '../replay-fingerprint/index.js';
import type {
  LegacyProjectionError,
} from './legacy-projection-errors.js';

// ───────────────────────────────────────────────────────────────────
// 1. PROJECTION CONTRACTS
// ───────────────────────────────────────────────────────────────────

/** Exact output family whose existing reader contract must remain unchanged. */
export type LegacyProjectionFormat = 'json' | 'jsonl' | 'md';

/** Existing writer boundary at which a shadow artifact becomes eligible to refresh. */
export type LegacyProjectionRefreshBoundary = 'event' | 'lifecycle';

// Every fold below builds its state with Object.freeze end to end, so the
// row and array-valued fields are declared `readonly` to keep that
// immutability visible in the type. JsonObject's index signature only
// accepts a mutable JsonValue[], so a state shape carrying a genuinely
// frozen `readonly X[]` field cannot satisfy JsonObject directly without
// either dropping the freeze or dropping the readonly annotation — both
// would misdescribe what the fold actually returns. This pair mirrors
// JsonValue/JsonObject's own recursive shape with the array arm widened
// to readonly, so a frozen projection state can satisfy one index
// signature without losing its readonly element type or its
// Object.freeze call. A plain JsonObject is still assignable here since
// every one of its arms (primitives, nested JsonObject, mutable arrays)
// is a narrower case of the arms below.
export type LegacyProjectionJsonValue =
  | JsonPrimitive
  | LegacyProjectionJsonObject
  | readonly LegacyProjectionJsonValue[];

/** JSON object shape identical to JsonObject except each property may also hold a readonly array. */
export interface LegacyProjectionJsonObject {
  [key: string]: LegacyProjectionJsonValue;
}

/** Immutable starting point for a projection fold. */
export interface LegacyProjectionBase<TState extends LegacyProjectionJsonObject> {
  readonly baseSha: string;
  readonly baseDigest: string;
  readonly bytes: Uint8Array;
  readonly state: Readonly<TState>;
  readonly ledgerHead: LedgerHead;
}

/** Versioned pure fold plus the exact legacy serializer for one artifact. */
export interface LegacyProjectionContract<TState extends LegacyProjectionJsonObject> {
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

// A census surface that projects more than one file composes a set of
// single-artifact contracts rather than rewriting the fold engine. The
// surface receives the verified events so a per-iteration delta surface can
// partition them into one artifact per iteration; a static multi-file
// surface ignores them and returns a fixed artifact set. Each artifact's
// reduce remains the authority over which events it absorbs.
export interface LegacyProjectionSurfaceContract {
  readonly surfaceId: string;
  readonly ledgerId: string;
  readonly buildArtifacts: (
    events: readonly EventReadResult[],
  ) => readonly LegacyProjectionContract<any>[];
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
