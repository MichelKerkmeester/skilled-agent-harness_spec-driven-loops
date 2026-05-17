import { type UnicodeRuntimeFingerprint } from './unicode-normalization.js';
export declare const SHARED_PAYLOAD_KIND_VALUES: readonly ["startup", "resume", "health", "bootstrap", "compaction"];
export type SharedPayloadKind = (typeof SHARED_PAYLOAD_KIND_VALUES)[number];
export declare const SHARED_PAYLOAD_TRUST_STATE_VALUES: readonly ["live", "cached", "stale", "absent", "unavailable", "imported", "rebuilt", "rehomed"];
export type SharedPayloadTrustState = (typeof SHARED_PAYLOAD_TRUST_STATE_VALUES)[number];
export declare function isSharedPayloadTrustState(value: unknown): value is SharedPayloadTrustState;
export declare function assertSharedPayloadTrustState(value: unknown): SharedPayloadTrustState;
export declare const SHARED_PAYLOAD_CERTAINTY_VALUES: readonly ["exact", "estimated", "defaulted", "unknown"];
export type SharedPayloadCertainty = (typeof SHARED_PAYLOAD_CERTAINTY_VALUES)[number];
export declare const DETECTOR_PROVENANCE_VALUES: readonly ["ast", "structured", "regex", "heuristic"];
export type DetectorProvenance = (typeof DETECTOR_PROVENANCE_VALUES)[number];
export declare const PARSER_PROVENANCE_VALUES: readonly ["ast", "regex", "heuristic", "unknown"];
export type ParserProvenance = (typeof PARSER_PROVENANCE_VALUES)[number];
export declare const EVIDENCE_STATUS_VALUES: readonly ["confirmed", "probable", "unverified", "unknown"];
export type EvidenceStatus = (typeof EVIDENCE_STATUS_VALUES)[number];
export declare const FRESHNESS_AUTHORITY_VALUES: readonly ["live", "cached", "stale", "unknown"];
export type FreshnessAuthority = (typeof FRESHNESS_AUTHORITY_VALUES)[number];
export declare const MEASUREMENT_AUTHORITY_VALUES: readonly ["provider_counted", "estimated", "defaulted", "unknown"];
export type MeasurementAuthority = (typeof MEASUREMENT_AUTHORITY_VALUES)[number];
export declare const PUBLICATION_METHODOLOGY_STATUSES: readonly ["provisional", "published"];
export type PublicationMethodologyStatus = (typeof PUBLICATION_METHODOLOGY_STATUSES)[number];
export declare const MULTIPLIER_REQUIRED_FIELDS: readonly ["promptTokens", "completionTokens", "cacheReadTokens", "cacheWriteTokens"];
export type MultiplierRequiredField = (typeof MULTIPLIER_REQUIRED_FIELDS)[number];
export interface PublicationMethodologyMetadata {
    schemaVersion: string;
    methodologyStatus: PublicationMethodologyStatus;
    provenance: string[];
}
export interface PublishableMetricField<T = unknown> {
    key: string;
    value: T;
    certainty: SharedPayloadCertainty;
    authority: MeasurementAuthority;
    methodology: PublicationMethodologyMetadata;
}
export interface StructuralTrust {
    parserProvenance: ParserProvenance;
    evidenceStatus: EvidenceStatus;
    freshnessAuthority: FreshnessAuthority;
}
export interface HotFileBreadcrumb {
    degree: number;
    changeCarefullyReason: string;
}
export declare const SHARED_PAYLOAD_SOURCE_KIND_VALUES: readonly ["memory", "code-graph", "semantic", "session", "operational", "skill-inventory", "skill-graph", "advisor-runtime"];
export type SharedPayloadSourceKind = (typeof SHARED_PAYLOAD_SOURCE_KIND_VALUES)[number];
export interface SharedPayloadSourceRef {
    kind: SharedPayloadSourceKind;
    path: string;
}
export type SharedPayloadSourceRefValue = string | SharedPayloadSourceRef;
export declare const ADVISOR_ENVELOPE_FRESHNESS_VALUES: readonly ["live", "stale", "absent", "unavailable"];
export type AdvisorEnvelopeFreshness = (typeof ADVISOR_ENVELOPE_FRESHNESS_VALUES)[number];
export declare const ADVISOR_ENVELOPE_STATUS_VALUES: readonly ["ok", "skipped", "stale", "degraded", "fail_open"];
export type AdvisorEnvelopeStatus = (typeof ADVISOR_ENVELOPE_STATUS_VALUES)[number];
/**
 * Typed metadata carried by the shared-payload advisor producer.
 *
 * This contract intentionally allows only numeric trust fields plus one
 * sanitized, single-line skill label so prompt text and free-form reasons
 * cannot cross the shared transport boundary.
 */
export interface AdvisorEnvelopeMetadata {
    freshness: AdvisorEnvelopeFreshness;
    confidence: number;
    uncertainty: number;
    skillLabel: string | null;
    status: AdvisorEnvelopeStatus;
}
export type SharedPayloadEnvelopeMetadata = AdvisorEnvelopeMetadata;
export declare const EDGE_EVIDENCE_CLASS_VALUES: readonly ["direct_call", "import", "type_reference", "inferred_heuristic", "test_coverage"];
export type EdgeEvidenceClass = (typeof EDGE_EVIDENCE_CLASS_VALUES)[number];
export interface GraphEdgeEnrichment {
    edgeEvidenceClass: EdgeEvidenceClass;
    numericConfidence: number;
}
export type StructuralTrustCarrier<T extends object = Record<string, unknown>> = T & StructuralTrust;
export type GraphEdgeEnrichmentCarrier<T extends object = Record<string, unknown>> = T & GraphEdgeEnrichment;
export type MultiplierAuthorityField = Pick<PublishableMetricField<number>, 'certainty' | 'authority'>;
export type MultiplierAuthorityFields = Partial<Record<MultiplierRequiredField, MultiplierAuthorityField | null>>;
export interface SharedPayloadSection {
    key: string;
    title: string;
    content: string;
    source: SharedPayloadSourceKind;
    certainty?: SharedPayloadCertainty;
    structuralTrust?: StructuralTrust;
    graphEdgeEnrichment?: GraphEdgeEnrichment;
    hotFileBreadcrumb?: HotFileBreadcrumb;
}
export declare const SHARED_PAYLOAD_PRODUCER_VALUES: readonly ["startup_brief", "session_snapshot", "session_resume", "session_health", "session_bootstrap", "compact_merger", "hook_cache", "advisor"];
export type SharedPayloadProducer = (typeof SHARED_PAYLOAD_PRODUCER_VALUES)[number];
export interface SharedPayloadProvenance {
    producer: SharedPayloadProducer;
    sourceSurface: string;
    trustState: SharedPayloadTrustState;
    generatedAt: string;
    lastUpdated: string | null;
    sourceRefs: SharedPayloadSourceRefValue[];
    sanitizerVersion?: string;
    runtimeFingerprint?: UnicodeRuntimeFingerprint;
}
export interface PreMergeSelectionMetadata {
    strategy: 'pre-merge';
    selectedFrom: string[];
    fileCount: number;
    topicCount: number;
    attentionSignalCount: number;
    notes: string[];
    antiFeedbackGuards: string[];
}
export interface SharedPayloadEnvelope {
    kind: SharedPayloadKind;
    summary: string;
    sections: SharedPayloadSection[];
    provenance: SharedPayloadProvenance;
    metadata?: SharedPayloadEnvelopeMetadata;
    selection?: PreMergeSelectionMetadata;
}
export declare class StructuralTrustPayloadError extends Error {
    readonly code = "STRUCTURAL_TRUST_PAYLOAD_INVALID";
    constructor(message: string);
}
export declare function isSharedPayloadKind(value: unknown): value is SharedPayloadKind;
export declare function isSharedPayloadCertainty(value: unknown): value is SharedPayloadCertainty;
export declare function isSharedPayloadProducer(value: unknown): value is SharedPayloadProducer;
export declare function isSharedPayloadSourceKind(value: unknown): value is SharedPayloadSourceKind;
export declare function isAdvisorEnvelopeFreshness(value: unknown): value is AdvisorEnvelopeFreshness;
export declare function isAdvisorEnvelopeStatus(value: unknown): value is AdvisorEnvelopeStatus;
export declare function isParserProvenance(value: unknown): value is ParserProvenance;
export declare function isDetectorProvenance(value: unknown): value is DetectorProvenance;
export declare function isEvidenceStatus(value: unknown): value is EvidenceStatus;
export declare function isFreshnessAuthority(value: unknown): value is FreshnessAuthority;
export declare function assertSharedPayloadCertainty(value: unknown): SharedPayloadCertainty;
export declare function assertDetectorProvenance(value: unknown): DetectorProvenance;
export declare function validateAdvisorEnvelopeMetadata(value: unknown): AdvisorEnvelopeMetadata;
export declare function validateSharedPayloadSourceRef(value: unknown): SharedPayloadSourceRefValue;
export declare function isMeasurementAuthority(value: unknown): value is MeasurementAuthority;
export declare function assertMeasurementAuthority(value: unknown): MeasurementAuthority;
export declare function detectorProvenanceToParserProvenance(value: DetectorProvenance): ParserProvenance;
export declare function buildStructuralTrustFromProvenance(input: {
    evidenceStatus: EvidenceStatus;
    freshnessAuthority: FreshnessAuthority;
    detectorProvenance?: DetectorProvenance | null;
    fallbackParserProvenance?: ParserProvenance;
}): StructuralTrust;
export declare function createPublicationMethodologyMetadata(metadata: PublicationMethodologyMetadata): PublicationMethodologyMetadata;
export declare function createPublishableMetricField<T>(field: PublishableMetricField<T>): PublishableMetricField<T>;
export declare function validateStructuralTrustPayload(payload: unknown, options?: {
    label?: string;
}): StructuralTrust;
export declare function makeStructuralTrust(input: StructuralTrust): StructuralTrust;
export declare function buildStructuralContextTrust(structuralContext: {
    status: string;
    detectorProvenance?: unknown;
}): StructuralTrust;
export declare function attachStructuralTrustFields<T extends object>(payload: T, trustPayload: unknown, options?: {
    label?: string;
}): StructuralTrustCarrier<T>;
export declare function isEdgeEvidenceClass(value: unknown): value is EdgeEvidenceClass;
export declare function assertEdgeEvidenceClass(value: unknown): EdgeEvidenceClass;
export declare function validateGraphEdgeEnrichment(value: unknown, options?: {
    label?: string;
}): GraphEdgeEnrichment;
export declare function attachGraphEdgeEnrichment<T extends object>(payload: T, enrichment: unknown, options?: {
    label?: string;
}): GraphEdgeEnrichmentCarrier<T>;
export declare function isStructuralTrustComplete(value: StructuralTrust | null | undefined): value is StructuralTrust;
export declare function canPublishMultiplier(fields: MultiplierAuthorityFields): boolean;
export declare function summarizeCertaintyContract(entries: Array<{
    label: string;
    certainty: SharedPayloadCertainty;
}>): string;
export declare function summarizeUnknown(value: unknown, maxChars?: number): string;
export declare function createSharedPayloadEnvelope(input: {
    kind: SharedPayloadKind;
    sections: SharedPayloadSection[];
    provenance: SharedPayloadProvenance;
    metadata?: SharedPayloadEnvelopeMetadata;
    summary?: string;
    selection?: PreMergeSelectionMetadata;
}): SharedPayloadEnvelope;
/** Narrow an unknown runtime payload to the shared payload envelope contract. */
export declare function coerceSharedPayloadEnvelope(value: unknown): SharedPayloadEnvelope | null;
export declare function trustStateFromGraphState(graphState: 'ready' | 'stale' | 'empty' | 'missing' | 'error'): SharedPayloadTrustState;
export declare function trustStateFromStructuralStatus(status: 'ready' | 'stale' | 'missing'): SharedPayloadTrustState;
export declare function trustStateFromCache(cachedAt: string, maxAgeMs: number, nowMs?: number): SharedPayloadTrustState;
export declare function createPreMergeSelectionMetadata(input: {
    selectedFrom: string[];
    fileCount: number;
    topicCount: number;
    attentionSignalCount: number;
    notes?: string[];
    antiFeedbackGuards?: string[];
}): PreMergeSelectionMetadata;
//# sourceMappingURL=shared-payload.d.ts.map