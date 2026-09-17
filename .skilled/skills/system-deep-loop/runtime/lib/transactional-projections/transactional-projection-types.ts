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

export interface AcceptedProjectionEvent {
  readonly eventType: string;
  readonly effectiveVersions: readonly number[];
}

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

export interface ProjectionGaugeBinding {
  readonly gaugeId: string;
  readonly gaugeVersion: string;
  readonly dependencies?: readonly string[];
}

export interface ProjectionBundleDefinition {
  readonly bundleId: string;
  readonly bundleVersion: string;
  readonly projectionSchemaVersion: string;
  readonly views: readonly ProjectionViewDefinition[];
  readonly gauges: readonly ProjectionGaugeBinding[];
}

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

export interface ProjectionGaugeManifestEntry extends JsonObject {
  readonly gaugeId: string;
  readonly gaugeVersion: string;
  readonly reducerDigest: string;
  readonly configurationDigest: string;
  readonly definitionDigest: string;
  readonly dependencies: string[];
}

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

export interface ProjectionReplayProvenance extends JsonObject {
  readonly fingerprintVersion: number;
  readonly ledgerId: string;
  readonly runId: string;
  readonly rangeStartSequence: number;
  readonly rangeEndSequence: number;
  readonly finalDigest: string;
}

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

export interface ProjectionStoreRead {
  readonly stateVersion: number;
  readonly replayIdentity: ReplayIdentity | null;
  readonly state: ProjectionStoreState;
}

// ───────────────────────────────────────────────────────────────────
// 3. ENGINE INPUTS AND OUTPUTS
// ───────────────────────────────────────────────────────────────────

export interface ProjectionFaultInjection {
  readonly afterViewPrepared?: (viewId: string) => void;
  readonly afterGaugePrepared?: (gaugeId: string) => void;
  readonly afterReceiptPrepared?: () => void;
  readonly afterWatermarkPrepared?: () => void;
  readonly beforeCommit?: () => void;
  readonly afterCommit?: () => void;
}

export interface ApplyProjectionEventInput {
  readonly lease: FencedLease;
  readonly generationId: string;
  readonly expectedWatermark: ProjectionWatermark;
  readonly event: VerifiedLedgerEvent;
  readonly replayIdentity: ReplayIdentity;
  readonly faultInjection?: ProjectionFaultInjection;
}

export interface StageProjectionRebuildInput {
  readonly lease: FencedLease;
  readonly generationId: string;
  readonly verifiedEvents: readonly VerifiedLedgerEvent[];
  readonly cutoffSequence: number;
  readonly cutoffRecordHash: string;
  readonly replayIdentity: ReplayIdentity | null;
  readonly faultInjection?: ProjectionFaultInjection;
}

export interface PublishProjectionGenerationInput {
  readonly lease: FencedLease;
  readonly generationId: string;
  readonly expectedActiveGenerationId: string | null;
  readonly faultInjection?: Pick<ProjectionFaultInjection, 'beforeCommit' | 'afterCommit'>;
}

export interface RollbackProjectionGenerationInput {
  readonly lease: FencedLease;
  readonly generationId: string;
  readonly expectedActiveGenerationId: string;
  readonly faultInjection?: Pick<ProjectionFaultInjection, 'beforeCommit' | 'afterCommit'>;
}

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

export interface ProjectionResumeReady {
  readonly mode: 'resume';
  readonly generationId: string;
  readonly nextSequence: number;
  readonly watermark: ProjectionWatermark;
}

export interface ProjectionResumeRebuild {
  readonly mode: 'rebuild';
  readonly reasonCode: string;
}

export type ProjectionResumeDecision = ProjectionResumeReady | ProjectionResumeRebuild;

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

export interface ProjectionDeliveryResult {
  readonly status: 'delivered' | 'delivery-failed';
  readonly manifestDigest: string;
  readonly errorName: string | null;
}

export interface LegacyProjectionMetadata extends JsonObject {
  readonly eventId: string | null;
  readonly observedAt: string | null;
}

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

export interface LegacyProjectionComparisonOutcome<TLegacy> {
  readonly legacyResult: TLegacy;
  readonly evidence: LegacyProjectionComparisonEvidence;
}

export interface TransactionalProjectionStoreOptions {
  readonly rootDirectory: string;
  readonly ledgerId: string;
  readonly bundleId: string;
  readonly resource?: ProtectedResourceIdentity;
}
