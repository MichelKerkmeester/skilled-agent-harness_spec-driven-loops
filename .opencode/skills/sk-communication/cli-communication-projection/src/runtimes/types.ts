// ───────────────────────────────────────────────────────────────────
// MODULE: Runtime Adapter Types
// ───────────────────────────────────────────────────────────────────

import type {
  ConfidenceState,
  JsonObject,
  RuntimeId,
} from '../contracts/common.js';
import type { EventEnvelope } from '../contracts/event.js';
import type { ExactOriginalRecord } from '../contracts/exact-original.js';
import type { GenerationKey } from '../core/assembly-types.js';
import type { RenderDecision } from '../render/types.js';

/** Presentation ownership available at one documented runtime boundary. */
export type PresentationTier = 'full-projection' | 'safe-native';

/** Explicit fallback modes available when atomic replacement is unavailable. */
export type DegradationMode = 'append' | 'sidecar' | 'original-only';

/** Evidence state for one version-sensitive runtime capability. */
export type RuntimeCapabilityState = 'no' | 'unknown' | 'yes';

/** One dated capability claim. */
export interface RuntimeCapabilityClaim {
  readonly state: RuntimeCapabilityState;
  readonly confidence: ConfidenceState;
}

/** Pinned evidence used to classify one runtime presentation path. */
export interface RuntimeCapabilityEvidence {
  readonly observedAt: string;
  readonly source: string;
  readonly completeMessage: RuntimeCapabilityClaim;
  readonly atomicRenderDecision: RuntimeCapabilityClaim;
  readonly safePresentationBoundary: RuntimeCapabilityClaim;
  readonly append: RuntimeCapabilityClaim;
  readonly sidecar: RuntimeCapabilityClaim;
}

/** Versions exercised together for one runtime path. */
export interface RuntimeTestedVersions {
  readonly runtime: string;
  readonly protocol: string;
}

/** Fail-closed behavior retained in every public capability record. */
export interface RuntimeFailClosedDefaults {
  readonly unknownCapability: 'original-only';
  readonly incompatibleRuntimeMajor: 'original-only';
  readonly incompatibleProtocolMajor: 'original-only';
}

/** Versioned capability and presentation decision for one runtime path. */
export interface RuntimeCapabilityRecord {
  readonly recordVersion: 'runtime-capability/1.0.0';
  readonly runtime: RuntimeId;
  readonly pathId: string;
  readonly protocol: string;
  readonly testedVersions: RuntimeTestedVersions;
  readonly evidence: RuntimeCapabilityEvidence;
  readonly presentationTier: PresentationTier;
  readonly allowedDegradationModes: readonly DegradationMode[];
  readonly failClosedDefaults: RuntimeFailClosedDefaults;
}

/** Input whose evidence is mapped into a capability record. */
export interface RuntimeCapabilityInput {
  readonly runtime: RuntimeId;
  readonly pathId: string;
  readonly protocol: string;
  readonly testedVersions: RuntimeTestedVersions;
  readonly evidence: RuntimeCapabilityEvidence;
}

/** Runtime-neutral immutable wrapper around one vendor event. */
export interface RuntimeEnvelope<TRuntimeEvent> {
  readonly envelopeVersion: 'runtime-envelope/1.0.0';
  readonly runtime: RuntimeId;
  readonly runtimeVersion: string;
  readonly protocol: string;
  readonly protocolVersion: string;
  readonly pathId: string;
  readonly sessionId: string;
  readonly turnId: string;
  readonly messageId: string;
  readonly generationId: string;
  readonly attempt: number;
  readonly capturedAt: string;
  readonly event: TRuntimeEvent;
}

/** Read-only canonical state exposed to an adapter. */
export interface RuntimeCanonicalState {
  readonly exactOriginal: ExactOriginalRecord;
  readonly transcriptRevision: string;
  readonly toolInputRevision: string;
  readonly toolResultRevision: string;
  readonly futureContextRevision: string;
}

/** Complete input to one runtime event mapping. */
export interface RuntimeAdapterInput<TRuntimeEvent> {
  readonly envelope: RuntimeEnvelope<TRuntimeEvent>;
  readonly canonical: RuntimeCanonicalState;
}

/** Stable adapter outcomes safe for telemetry and policy decisions. */
export const RuntimeAdapterReasonCodes = {
  ATOMIC_REPLACE_UNAVAILABLE: 'atomic-replace-unavailable',
  CANCELLED: 'cancelled',
  DISCONNECTED: 'disconnected',
  INCOMPATIBLE_PROTOCOL_MAJOR: 'incompatible-protocol-major',
  INCOMPATIBLE_RUNTIME_MAJOR: 'incompatible-runtime-major',
  INVALID_EVENT: 'invalid-event',
  NONE: 'none',
  ORIGINAL_SELECTED: 'original-selected',
  PROJECTION_REJECTED: 'projection-rejected',
  RUNTIME_FAILURE: 'runtime-failure',
  TIMEOUT: 'timeout',
  UNKNOWN_CAPABILITY: 'unknown-capability',
  UNSUPPORTED_PATH: 'unsupported-path',
  UNSUPPORTED_PRESENTATION: 'unsupported-presentation',
} as const;

/** Content-free runtime adapter reason. */
export type RuntimeAdapterReasonCode =
  typeof RuntimeAdapterReasonCodes[keyof typeof RuntimeAdapterReasonCodes];

/** Closed telemetry record that contains no transcript or projection content. */
export interface RuntimeTelemetryRecord {
  readonly telemetryVersion: 'runtime-telemetry/1.0.0';
  readonly eventName: 'runtime-adapter-terminal';
  readonly runtime: RuntimeId;
  readonly pathId: string;
  readonly presentationTier: PresentationTier;
  readonly status: 'degraded' | 'exact-original' | 'mapped' | 'projection';
  readonly reasonCode: RuntimeAdapterReasonCode;
}

interface RuntimeAdaptationBase {
  readonly generation: GenerationKey;
  readonly event: EventEnvelope | null;
  readonly presentationTier: PresentationTier;
  readonly telemetry: RuntimeTelemetryRecord;
}

/** Successfully normalized runtime event. */
export interface RuntimeMappedEvent extends RuntimeAdaptationBase {
  readonly status: 'mapped';
  readonly reasonCode: 'none';
  readonly event: EventEnvelope;
  readonly exactOriginal: null;
}

/** Terminal or incompatible mapping that preserves the exact original. */
export interface RuntimeExactOriginalEvent extends RuntimeAdaptationBase {
  readonly status: 'exact-original';
  readonly reasonCode: Exclude<RuntimeAdapterReasonCode, 'none'>;
  readonly exactOriginal: ExactOriginalRecord;
}

/** Result of translating one runtime event. */
export type RuntimeAdapterResult = RuntimeExactOriginalEvent | RuntimeMappedEvent;

/** Complete input to runtime-specific presentation selection. */
export interface RuntimePresentationInput {
  readonly pathId: string;
  readonly runtimeVersion: string;
  readonly protocolVersion: string;
  readonly renderDecision: RenderDecision;
  readonly preferredDegradationModes?: readonly DegradationMode[];
}

interface RuntimePresentationBase {
  readonly presentationTier: PresentationTier;
  readonly exactOriginal: ExactOriginalRecord;
  readonly telemetry: RuntimeTelemetryRecord;
  readonly originalSuppressed: boolean;
}

/** Validated projection presented through complete-message atomic ownership. */
export interface RuntimeProjectionPresentation extends RuntimePresentationBase {
  readonly status: 'projection';
  readonly mode: 'atomic-replace';
  readonly reasonCode: 'none';
  readonly projectionText: string;
  readonly presentationTier: 'full-projection';
  readonly originalSuppressed: true;
}

/** Validated projection presented without suppressing the canonical original. */
export interface RuntimeDegradedPresentation extends RuntimePresentationBase {
  readonly status: 'degraded';
  readonly mode: Exclude<DegradationMode, 'original-only'>;
  readonly reasonCode: 'atomic-replace-unavailable';
  readonly projectionText: string;
  readonly presentationTier: 'safe-native';
  readonly originalSuppressed: false;
}

/** Exact-original presentation selected for every unsafe terminal path. */
export interface RuntimeExactOriginalPresentation extends RuntimePresentationBase {
  readonly status: 'exact-original';
  readonly mode: 'original-only';
  readonly reasonCode: Exclude<RuntimeAdapterReasonCode, 'none'>;
  readonly projectionText: null;
  readonly originalSuppressed: false;
}

/** Runtime presentation result after capability and compatibility checks. */
export type RuntimePresentationResult =
  | RuntimeDegradedPresentation
  | RuntimeExactOriginalPresentation
  | RuntimeProjectionPresentation;

/** Content-free vendor extension payload retained under a stable namespace. */
export interface RuntimeExtension {
  readonly namespace: string;
  readonly value: JsonObject;
}
