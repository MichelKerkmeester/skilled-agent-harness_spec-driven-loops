// ───────────────────────────────────────────────────────────────────
// MODULE: Stream-Fold Gauge Types
// ───────────────────────────────────────────────────────────────────

import type {
  DurableAppendReceipt,
  LedgerHead,
  TransitionAuthorizationRequest,
  VerifiedLedgerEvent,
} from '../authorized-ledger/index.js';
import type {
  CanonicalBytes,
  EventProducer,
  EventReadResult,
  EventWritePreflight,
  JsonObject,
  JsonValue,
} from '../event-envelope/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

/** Durable event type for one reproducible gauge result. */
export const GAUGE_RESULT_EVENT_TYPE = 'deep-loop.gauge.result-recorded';
/** Durable event type for one bounded legacy-versus-gauge comparison. */
export const GAUGE_COMPARISON_EVENT_TYPE = 'deep-loop.gauge.comparison-recorded';

/** Stable gauge families exposed to consumers and evidence records. */
export const GaugeFamilies = {
  PROGRESS: 'progress',
  NOVELTY: 'novelty',
  COST: 'cost',
  HEALTH: 'health',
} as const;

/** Family label attached to one registered gauge. */
export type GaugeFamily = typeof GaugeFamilies[keyof typeof GaugeFamilies];
/** Explicit behavior for verified event types outside a gauge input contract. */
export type GaugeUnknownEventPolicy = 'ignore' | 'reject';
/** Replay path selected after checkpoint validation. */
export type GaugeComputationMode = 'full' | 'incremental' | 'full-rebuild';
/** Checkpoint disposition recorded with every result. */
export type GaugeCheckpointStatus = 'not-provided' | 'used' | 'rejected';

// ───────────────────────────────────────────────────────────────────
// 2. DEFINITION TYPES
// ───────────────────────────────────────────────────────────────────

/** Exact effective event versions accepted by one gauge reducer. */
export interface AcceptedGaugeEvent {
  readonly eventType: string;
  readonly effectiveVersions: readonly number[];
}

/** Immutable pure fold contract registered under one gauge identity. */
export interface GaugeDefinition {
  readonly gaugeId: string;
  readonly gaugeVersion: string;
  readonly family: GaugeFamily;
  readonly acceptedEvents: readonly AcceptedGaugeEvent[];
  readonly reducerIdentity: string;
  readonly outputSchemaVersion: string;
  readonly configuration: Readonly<JsonObject>;
  readonly numericPolicy: Readonly<JsonObject>;
  readonly missingValueSemantics: string;
  readonly downstreamOwner: string;
  readonly unknownEventPolicy: GaugeUnknownEventPolicy;
  readonly dependencies: readonly string[];
  readonly initialAccumulator: Readonly<JsonObject>;
  readonly reduce: (
    state: Readonly<JsonObject>,
    event: Readonly<EventReadResult>,
    ledgerSequence: number,
  ) => JsonObject;
  readonly finalize: (state: Readonly<JsonObject>) => JsonObject;
  readonly validateAccumulator: (state: Readonly<JsonObject>) => boolean;
  readonly validateOutput: (output: Readonly<JsonObject>) => boolean;
}

/** Function-free registry view safe for manifests and diagnostics. */
export interface GaugeRegistryEntry extends JsonObject {
  readonly gaugeId: string;
  readonly gaugeVersion: string;
  readonly family: GaugeFamily;
  readonly acceptedEvents: JsonValue[];
  readonly reducerDigest: string;
  readonly configurationDigest: string;
  readonly definitionDigest: string;
  readonly outputSchemaVersion: string;
  readonly numericPolicy: JsonObject;
  readonly missingValueSemantics: string;
  readonly downstreamOwner: string;
  readonly unknownEventPolicy: GaugeUnknownEventPolicy;
  readonly dependencies: string[];
}

// ───────────────────────────────────────────────────────────────────
// 3. REPLAY TYPES
// ───────────────────────────────────────────────────────────────────

/** Disposable fold state bound to one exact ledger prefix and registry identity. */
export interface GaugeCheckpoint extends JsonObject {
  readonly checkpointSchemaVersion: number;
  readonly ledgerId: string;
  readonly lastSequence: number;
  readonly lastRecordHash: string;
  readonly eventRegistryDigest: string;
  readonly gaugeRegistryDigest: string;
  readonly gaugeId: string;
  readonly gaugeVersion: string;
  readonly reducerDigest: string;
  readonly configurationDigest: string;
  readonly accumulatorBytesBase64: string;
  readonly accumulatorHash: string;
}

/** Evidence describing whether a checkpoint was absent, accepted, or rejected. */
export interface GaugeCheckpointProvenance extends JsonObject {
  readonly status: GaugeCheckpointStatus;
  readonly sequence: number | null;
  readonly recordHash: string | null;
  readonly accumulatorHash: string | null;
  readonly rejectionCode: string | null;
}

/** Canonical gauge result with complete replay and configuration provenance. */
export interface GaugeResultEnvelope extends JsonObject {
  readonly resultSchemaVersion: number;
  readonly ledgerId: string;
  readonly cutoffSequence: number;
  readonly cutoffRecordHash: string;
  readonly gaugeId: string;
  readonly gaugeVersion: string;
  readonly gaugeFamily: GaugeFamily;
  readonly gaugeRegistryDigest: string;
  readonly reducerDigest: string;
  readonly configurationDigest: string;
  readonly eventRegistryDigest: string;
  readonly accumulatorHash: string;
  readonly outputHash: string;
  readonly replayFingerprintDigest: string | null;
  readonly computationMode: GaugeComputationMode;
  readonly sourceEventCount: number;
  readonly eventsProcessed: number;
  readonly checkpointProvenance: GaugeCheckpointProvenance;
  readonly output: JsonObject;
}

/** Inputs accepted by the pure verified-event replay boundary. */
export interface GaugeReplayInput {
  readonly verifiedEvents: readonly VerifiedLedgerEvent[];
  readonly cutoff: LedgerHead;
  readonly eventRegistryDigest: string;
  readonly gaugeId: string;
  readonly gaugeVersion: string;
  readonly checkpoint?: unknown;
}

/** Canonical replay products, including a reusable disposable checkpoint. */
export interface GaugeReplayOutcome {
  readonly result: GaugeResultEnvelope;
  readonly resultBytes: CanonicalBytes;
  readonly accumulator: Readonly<JsonObject>;
  readonly accumulatorBytes: CanonicalBytes;
  readonly outputBytes: CanonicalBytes;
  readonly checkpoint: GaugeCheckpoint;
}

/** Minimal projection used to bind gauge replay to replay-fingerprint identity. */
export interface GaugeFingerprintProjection extends JsonObject {
  readonly accumulator: JsonObject;
  readonly processedSequence: number;
}

// ───────────────────────────────────────────────────────────────────
// 4. DARK EVIDENCE TYPES
// ───────────────────────────────────────────────────────────────────

/** Legacy observation surfaces that remain authoritative during dark operation. */
export type LegacyGaugeSurface =
  | 'fanout-pool'
  | 'convergence'
  | 'coverage-signals'
  | 'metrics-snapshot'
  | 'observability';

/** Bounded comparison evidence that excludes the compared payload values. */
export interface DarkGaugeComparison extends JsonObject {
  readonly comparisonSchemaVersion: number;
  readonly surface: LegacyGaugeSurface;
  readonly gaugeId: string;
  readonly gaugeVersion: string;
  readonly legacyHash: string;
  readonly gaugeOutputHash: string;
  readonly parity: boolean;
  readonly differingPaths: string[];
}

/** Comparison result preserving the caller's exact legacy result reference. */
export interface DarkGaugeComparisonOutcome<TLegacy> {
  readonly legacyResult: TLegacy;
  readonly evidence: DarkGaugeComparison;
}

/** Caller-supplied event-envelope identity for durable gauge evidence. */
export interface GaugeEvidenceEnvelopeInput {
  readonly eventId: string;
  readonly streamId: string;
  readonly streamSequence: number;
  readonly occurredAt: string;
  readonly recordedAt: string;
  readonly producer: EventProducer;
  readonly authorityEpoch: number;
  readonly correlationId: string;
  readonly causationId: string | null;
  readonly idempotencyKey: string;
}

/** Exact prepared event and authorization request submitted for publication. */
export interface GaugeEvidenceAppendInput {
  readonly event: EventWritePreflight;
  readonly request: TransitionAuthorizationRequest;
}

/** Receipt returned after an authorized evidence append succeeds. */
export interface GaugeEvidenceAppendResult {
  readonly status: 'appended';
  readonly receipt: DurableAppendReceipt;
  readonly event: EventWritePreflight;
}
