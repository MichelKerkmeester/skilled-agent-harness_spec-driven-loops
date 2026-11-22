// ───────────────────────────────────────────────────────────────────
// MODULE: Transactional Projection Types
// ───────────────────────────────────────────────────────────────────

import type {
  VerifiedLedgerEvent,
} from '../authorized-ledger/index.js';
import type {
  JsonObject,
  JsonValue,
} from '../event-envelope/index.js';
import type {
  FencedLease,
  ProtectedResourceIdentity,
  ReplayIdentity,
} from '../locks-and-fencing/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. REGISTRY CONTRACTS
// ───────────────────────────────────────────────────────────────────

export type ProjectionUnknownEventPolicy = 'ignore' | 'reject';

/** An event type a view accepts and the effective envelope versions it accepts it at. */
export interface AcceptedProjectionEvent {
  readonly eventType: string;
  readonly effectiveVersions: readonly number[];
}

/** Ledger sequence and dependency view outputs passed to a view reducer. */
export interface ProjectionReduceContext {
  readonly ledgerSequence: number;
  readonly dependencyOutputs: Readonly<Record<string, Readonly<JsonObject>>>;
}

/** Versioned pure reducer for one member of an atomic projection bundle. */
export interface ProjectionViewDefinition {
  readonly viewId: string;
  readonly viewVersion: string;
  readonly outputSchemaVersion: string;
  readonly reducerIdentity: string;
  readonly acceptedEvents: readonly AcceptedProjectionEvent[];
  readonly unknownEventPolicy: ProjectionUnknownEventPolicy;
  readonly dependencies: readonly string[];
  readonly configuration: Readonly<JsonObject>;
  readonly initialState: Readonly<JsonObject>;
  readonly reduce: (
    state: Readonly<JsonObject>,
    event: Readonly<VerifiedLedgerEvent['event']>,
    context: Readonly<ProjectionReduceContext>,
  ) => JsonObject;
  readonly finalize: (state: Readonly<JsonObject>) => JsonObject;
  readonly validateState: (state: Readonly<JsonObject>) => boolean;
  readonly validateOutput: (output: Readonly<JsonObject>) => boolean;
}

/** A gauge a bundle includes, by id and version, with the views it depends on. */
export interface ProjectionGaugeBinding {
  readonly gaugeId: string;
  readonly gaugeVersion: string;
  readonly dependencies?: readonly string[];
}

/** A bundle as authored: its id, version, schema version, views and gauge bindings. */
export interface ProjectionBundleDefinition {
  readonly bundleId: string;
  readonly bundleVersion: string;
  readonly projectionSchemaVersion: string;
  readonly views: readonly ProjectionViewDefinition[];
  readonly gauges: readonly ProjectionGaugeBinding[];
}

/** Manifest row pinning one view's versions, reducer, configuration, accepted events and unknown-event policy. */
export interface ProjectionViewManifestEntry extends JsonObject {
  readonly viewId: string;
  readonly viewVersion: string;
  readonly outputSchemaVersion: string;
  readonly reducerIdentity: string;
  readonly reducerDigest: string;
  readonly configurationDigest: string;
  readonly definitionDigest: string;
  readonly acceptedEvents: JsonValue[];
  readonly unknownEventPolicy: ProjectionUnknownEventPolicy;
  readonly dependencies: string[];
}

/** Manifest row pinning one gauge's version, reducer, configuration and dependencies. */
export interface ProjectionGaugeManifestEntry extends JsonObject {
  readonly gaugeId: string;
  readonly gaugeVersion: string;
  readonly reducerDigest: string;
  readonly configurationDigest: string;
  readonly definitionDigest: string;
  readonly dependencies: string[];
}

/** Digested bundle manifest listing its views, gauges and dependency order. */
export interface ProjectionBundleManifest extends JsonObject {
  readonly bundleId: string;
  readonly bundleVersion: string;
  readonly projectionSchemaVersion: string;
  readonly dependencyOrder: string[];
  readonly views: JsonValue[];
  readonly gauges: JsonValue[];
  readonly reducerDigest: string;
  readonly configurationDigest: string;
  readonly bundleDigest: string;
}

// ───────────────────────────────────────────────────────────────────
// 2. DURABLE STATE CONTRACTS
// ───────────────────────────────────────────────────────────────────

/** Ledger range and final digest a projection was replayed over. */
export interface ProjectionReplayProvenance extends JsonObject {
  readonly fingerprintVersion: number;
  readonly ledgerId: string;
  readonly runId: string;
  readonly rangeStartSequence: number;
  readonly rangeEndSequence: number;
  readonly finalDigest: string;
}

/**
 * How far a generation has projected the ledger and under which bundle, reducer, configuration and registry
 * digests.
 */
export interface ProjectionWatermark extends JsonObject {
  readonly watermarkSchemaVersion: 1;
  readonly ledgerId: string;
  readonly generationId: string;
  readonly bundleId: string;
  readonly bundleVersion: string;
  readonly bundleDigest: string;
  readonly reducerDigest: string;
  readonly configurationDigest: string;
  readonly eventRegistryDigest: string;
  readonly sequence: number;
  readonly recordHash: string;
  readonly eventHash: string | null;
  readonly receiptId: string | null;
  readonly replayFingerprintDigest: string | null;
}

/** Receipt for applying one event to a generation, keyed by the digest of its input. */
export interface ProjectionApplyReceipt extends JsonObject {
  readonly receiptSchemaVersion: 1;
  readonly receiptId: string;
  readonly inputDigest: string;
  readonly ledgerId: string;
  readonly generationId: string;
  readonly bundleId: string;
  readonly bundleVersion: string;
  readonly bundleDigest: string;
  readonly reducerDigest: string;
  readonly configurationDigest: string;
  readonly eventRegistryDigest: string;
  readonly sequence: number;
  readonly recordHash: string;
  readonly canonicalEventHash: string;
  readonly eventType: string;
  readonly eventVersion: number;
  readonly priorSequence: number;
  readonly priorRecordHash: string;
  readonly viewHashes: JsonObject;
  readonly gaugeHashes: JsonObject;
  readonly replayFingerprintDigest: string | null;
}

/** One view's output in a generation, with the ledger cutoff and digests it was computed at. */
export interface ProjectionViewMaterialization extends JsonObject {
  readonly materializationSchemaVersion: 1;
  readonly generationId: string;
  readonly viewId: string;
  readonly viewVersion: string;
  readonly outputSchemaVersion: string;
  readonly reducerDigest: string;
  readonly configurationDigest: string;
  readonly cutoffSequence: number;
  readonly cutoffRecordHash: string;
  readonly state: JsonObject;
  readonly stateHash: string;
  readonly output: JsonObject;
  readonly outputHash: string;
}

/** One gauge's output in a generation, with the gauge registry digest and ledger cutoff it was computed at. */
export interface ProjectionGaugeMaterialization extends JsonObject {
  readonly materializationSchemaVersion: 1;
  readonly generationId: string;
  readonly gaugeId: string;
  readonly gaugeVersion: string;
  readonly gaugeRegistryDigest: string;
  readonly reducerDigest: string;
  readonly configurationDigest: string;
  readonly cutoffSequence: number;
  readonly cutoffRecordHash: string;
  readonly accumulator: JsonObject;
  readonly accumulatorHash: string;
  readonly output: JsonObject;
  readonly outputHash: string;
}

/** A projection generation: the bundle it was built with and the view and gauge outputs it holds. */
export interface ProjectionGeneration extends JsonObject {
  readonly generationSchemaVersion: 1;
  readonly generationId: string;
  readonly ledgerId: string;
  readonly bundleId: string;
  readonly bundleVersion: string;
  readonly projectionSchemaVersion: string;
  readonly bundleDigest: string;
  readonly reducerDigest: string;
  readonly configurationDigest: string;
  readonly eventRegistryDigest: string;
  readonly watermark: ProjectionWatermark;
  readonly replayProvenance: ProjectionReplayProvenance | null;
  readonly views: JsonObject;
  readonly gauges: JsonObject;
  readonly receipts: JsonObject;
  readonly canonicalProjectionHash: string;
}

/** Persisted store state: the active and previous generations, publication order, staged ids and every generation. */
export interface ProjectionStoreState extends JsonObject {
  readonly storeSchemaVersion: 1;
  readonly ledgerId: string;
  readonly bundleId: string;
  readonly activeGenerationId: string | null;
  readonly previousGenerationId: string | null;
  readonly publicationOrder: string[];
  readonly stagedGenerationIds: string[];
  readonly generations: JsonObject;
}

/** Store state as read, with its version and replay identity for compare-and-swap writes. */
export interface ProjectionStoreRead {
  readonly stateVersion: number;
  readonly replayIdentity: ReplayIdentity | null;
  readonly state: ProjectionStoreState;
}

// ───────────────────────────────────────────────────────────────────
// 3. ENGINE INPUTS AND OUTPUTS
// ───────────────────────────────────────────────────────────────────

/** Optional hooks called around each stage of a projection write, so a failure can be injected between stages. */
export interface ProjectionFaultInjection {
  readonly afterViewPrepared?: (viewId: string) => void;
  readonly afterGaugePrepared?: (gaugeId: string) => void;
  readonly afterReceiptPrepared?: () => void;
  readonly afterWatermarkPrepared?: () => void;
  readonly beforeCommit?: () => void;
  readonly afterCommit?: () => void;
}

/** Request to apply one verified event to a generation under a fenced lease, guarded by the expected watermark. */
export interface ApplyProjectionEventInput {
  readonly lease: FencedLease;
  readonly generationId: string;
  readonly expectedWatermark: ProjectionWatermark;
  readonly event: VerifiedLedgerEvent;
  readonly replayIdentity: ReplayIdentity;
  readonly faultInjection?: ProjectionFaultInjection;
}

/** Request to rebuild a staged generation from verified events up to a ledger cutoff. */
export interface StageProjectionRebuildInput {
  readonly lease: FencedLease;
  readonly generationId: string;
  readonly verifiedEvents: readonly VerifiedLedgerEvent[];
  readonly cutoffSequence: number;
  readonly cutoffRecordHash: string;
  readonly replayIdentity: ReplayIdentity | null;
  readonly faultInjection?: ProjectionFaultInjection;
}

/** Request to publish a generation, guarded by the generation expected to be active. */
export interface PublishProjectionGenerationInput {
  readonly lease: FencedLease;
  readonly generationId: string;
  readonly expectedActiveGenerationId: string | null;
  readonly faultInjection?: Pick<ProjectionFaultInjection, 'beforeCommit' | 'afterCommit'>;
}

/** Request to roll back to a generation, guarded by the generation expected to be active. */
export interface RollbackProjectionGenerationInput {
  readonly lease: FencedLease;
  readonly generationId: string;
  readonly expectedActiveGenerationId: string;
  readonly faultInjection?: Pick<ProjectionFaultInjection, 'beforeCommit' | 'afterCommit'>;
}

/** Read-consistent view of a published generation, pinned to its bundle, digests and ledger position. */
export interface ProjectionSnapshot extends JsonObject {
  readonly snapshotSchemaVersion: 1;
  readonly generationId: string;
  readonly ledgerId: string;
  readonly bundleId: string;
  readonly bundleVersion: string;
  readonly bundleDigest: string;
  readonly reducerDigest: string;
  readonly configurationDigest: string;
  readonly eventRegistryDigest: string;
  readonly cutoffSequence: number;
  readonly cutoffRecordHash: string;
  readonly applyReceipt: ProjectionApplyReceipt | null;
  readonly replayProvenance: ProjectionReplayProvenance | null;
  readonly views: JsonObject;
  readonly gauges: JsonObject;
  readonly canonicalProjectionHash: string;
}

/** Resume plan that continues a generation from the next ledger sequence after its watermark. */
export interface ProjectionResumeReady {
  readonly mode: 'resume';
  readonly generationId: string;
  readonly nextSequence: number;
  readonly watermark: ProjectionWatermark;
}

/** Resume plan that requires a full rebuild, with the reason code. */
export interface ProjectionResumeRebuild {
  readonly mode: 'rebuild';
  readonly reasonCode: string;
}

export type ProjectionResumeDecision = ProjectionResumeReady | ProjectionResumeRebuild;

/** Digested manifest describing a published generation and its canonical projection hash for delivery. */
export interface ProjectionPublicationManifest extends JsonObject {
  readonly manifestSchemaVersion: 1;
  readonly manifestDigest: string;
  readonly generationId: string;
  readonly ledgerId: string;
  readonly bundleId: string;
  readonly bundleVersion: string;
  readonly cutoffSequence: number;
  readonly cutoffRecordHash: string;
  readonly canonicalProjectionHash: string;
  readonly snapshot: ProjectionSnapshot;
}

/** Whether a publication manifest was delivered, with the error name when it was not. */
export interface ProjectionDeliveryResult {
  readonly status: 'delivered' | 'delivery-failed';
  readonly manifestDigest: string;
  readonly errorName: string | null;
}

/** Optional event id and observation time reported by the legacy surface. */
export interface LegacyProjectionMetadata extends JsonObject {
  readonly eventId: string | null;
  readonly observedAt: string | null;
}

/** Evidence of a legacy-versus-projection comparison: both hashes, parity, differing paths and the ledger cutoff. */
export interface LegacyProjectionComparisonEvidence extends JsonObject {
  readonly comparisonSchemaVersion: 1;
  readonly surface: string;
  readonly legacyAuthority: true;
  readonly legacyHash: string;
  readonly projectionHash: string;
  readonly parity: boolean;
  readonly differingPaths: string[];
  readonly ledgerId: string;
  readonly cutoffSequence: number;
  readonly cutoffRecordHash: string;
  readonly generationId: string;
  readonly bundleVersion: string;
  readonly legacyManifestDigest: string;
  readonly legacyMetadata: LegacyProjectionMetadata;
}

/** The legacy result returned unchanged, with the comparison evidence beside it. */
export interface LegacyProjectionComparisonOutcome<TLegacy> {
  readonly legacyResult: TLegacy;
  readonly evidence: LegacyProjectionComparisonEvidence;
}

/**
 * Root directory, ledger and bundle a projection store persists under, with an optional protected resource
 * identity.
 */
export interface TransactionalProjectionStoreOptions {
  readonly rootDirectory: string;
  readonly ledgerId: string;
  readonly bundleId: string;
  readonly resource?: ProtectedResourceIdentity;
}
