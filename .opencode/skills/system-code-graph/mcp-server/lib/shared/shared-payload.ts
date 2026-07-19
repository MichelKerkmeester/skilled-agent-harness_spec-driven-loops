// ───────────────────────────────────────────────────────────────
// MODULE: Shared Payload Contract (local copy for system-code-graph)
// ───────────────────────────────────────────────────────────────

import { assertNever } from './assert-never.js';

export const SHARED_PAYLOAD_KIND_VALUES = ['startup', 'resume', 'health', 'bootstrap', 'compaction'] as const;
export type SharedPayloadKind = (typeof SHARED_PAYLOAD_KIND_VALUES)[number];

export const SHARED_PAYLOAD_TRUST_STATE_VALUES = [
  'live', 'cached', 'stale', 'absent', 'unavailable', 'imported', 'rebuilt', 'rehomed',
] as const;
export type SharedPayloadTrustState = (typeof SHARED_PAYLOAD_TRUST_STATE_VALUES)[number];

export const DETECTOR_PROVENANCE_VALUES = ['ast', 'structured', 'regex', 'heuristic'] as const;
export type DetectorProvenance = (typeof DETECTOR_PROVENANCE_VALUES)[number];

export const PARSER_PROVENANCE_VALUES = ['ast', 'regex', 'heuristic', 'unknown'] as const;
export type ParserProvenance = (typeof PARSER_PROVENANCE_VALUES)[number];

export const EVIDENCE_STATUS_VALUES = ['confirmed', 'probable', 'unverified', 'unknown'] as const;
export type EvidenceStatus = (typeof EVIDENCE_STATUS_VALUES)[number];

export const FRESHNESS_AUTHORITY_VALUES = ['live', 'cached', 'stale', 'unknown'] as const;
export type FreshnessAuthority = (typeof FRESHNESS_AUTHORITY_VALUES)[number];

export const ADVISOR_ENVELOPE_FRESHNESS_VALUES = ['live', 'stale', 'absent', 'unavailable'] as const;
export type AdvisorEnvelopeFreshness = (typeof ADVISOR_ENVELOPE_FRESHNESS_VALUES)[number];

export const ADVISOR_ENVELOPE_STATUS_VALUES = ['ok', 'skipped', 'stale', 'degraded', 'fail_open'] as const;
export type AdvisorEnvelopeStatus = (typeof ADVISOR_ENVELOPE_STATUS_VALUES)[number];

export const EDGE_EVIDENCE_CLASS_VALUES = [
  'direct_call', 'import', 'type_reference', 'inferred_heuristic', 'test_coverage',
] as const;
export type EdgeEvidenceClass = (typeof EDGE_EVIDENCE_CLASS_VALUES)[number];

export const SHARED_PAYLOAD_CERTAINTY_VALUES = ['exact', 'estimated', 'defaulted', 'unknown'] as const;
export type SharedPayloadCertainty = (typeof SHARED_PAYLOAD_CERTAINTY_VALUES)[number];

export const SHARED_PAYLOAD_SOURCE_KIND_VALUES = [
  'memory', 'code-graph', 'semantic', 'session', 'operational',
  'skill-inventory', 'skill-graph', 'advisor-runtime',
] as const;
export type SharedPayloadSourceKind = (typeof SHARED_PAYLOAD_SOURCE_KIND_VALUES)[number];

export const SHARED_PAYLOAD_PRODUCER_VALUES = [
  'startup_brief', 'session_snapshot', 'session_resume', 'session_health',
  'session_bootstrap', 'compact_merger', 'hook_cache', 'advisor',
] as const;
export type SharedPayloadProducer = (typeof SHARED_PAYLOAD_PRODUCER_VALUES)[number];

export interface StructuralTrust {
  parserProvenance: ParserProvenance;
  evidenceStatus: EvidenceStatus;
  freshnessAuthority: FreshnessAuthority;
}

export interface HotFileBreadcrumb {
  degree: number;
  changeCarefullyReason: string;
}

export interface GraphEdgeEnrichment {
  edgeEvidenceClass: EdgeEvidenceClass;
  numericConfidence: number;
}

export type StructuralTrustCarrier<T extends object = Record<string, unknown>> = T & StructuralTrust;
export type GraphEdgeEnrichmentCarrier<T extends object = Record<string, unknown>> = T & GraphEdgeEnrichment;

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

export interface SharedPayloadProvenance {
  producer: SharedPayloadProducer;
  sourceSurface: string;
  trustState: SharedPayloadTrustState;
  generatedAt: string;
  lastUpdated: string | null;
  sourceRefs: (string | { kind: SharedPayloadSourceKind; path: string })[];
  sanitizerVersion?: string;
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

export interface AdvisorEnvelopeMetadata {
  freshness: AdvisorEnvelopeFreshness;
  confidence: number;
  uncertainty: number;
  skillLabel: string | null;
  status: AdvisorEnvelopeStatus;
}

export type SharedPayloadEnvelopeMetadata = AdvisorEnvelopeMetadata;

export interface SharedPayloadEnvelope {
  kind: SharedPayloadKind;
  summary: string;
  sections: SharedPayloadSection[];
  provenance: SharedPayloadProvenance;
  metadata?: SharedPayloadEnvelopeMetadata;
  selection?: PreMergeSelectionMetadata;
}

function detectorProvenanceToParserProvenance(value: DetectorProvenance): ParserProvenance {
  if (value === 'structured') return 'regex';
  return value as ParserProvenance;
}

export function buildStructuralTrustFromProvenance(input: {
  evidenceStatus: EvidenceStatus;
  freshnessAuthority: FreshnessAuthority;
  detectorProvenance?: DetectorProvenance | null;
  fallbackParserProvenance?: ParserProvenance;
}): StructuralTrust {
  const parserProvenance = input.detectorProvenance
    ? detectorProvenanceToParserProvenance(input.detectorProvenance)
    : input.fallbackParserProvenance ?? 'unknown';
  return { parserProvenance, evidenceStatus: input.evidenceStatus, freshnessAuthority: input.freshnessAuthority };
}

export function attachStructuralTrustFields<T extends object>(
  payload: T,
  trustPayload: unknown,
  _options?: { label?: string },
): StructuralTrustCarrier<T> {
  const structuralTrust = trustPayload as StructuralTrust;
  return { ...payload, ...structuralTrust };
}

export function attachGraphEdgeEnrichment<T extends object>(
  payload: T,
  enrichment: unknown,
  _options?: { label?: string },
): GraphEdgeEnrichmentCarrier<T> {
  const graphEdgeEnrichment = enrichment as GraphEdgeEnrichment;
  return { ...payload, ...graphEdgeEnrichment };
}

export function trustStateFromGraphState(
  graphState: 'ready' | 'stale' | 'empty' | 'missing' | 'error',
): SharedPayloadTrustState {
  switch (graphState) {
    case 'ready': return 'live';
    case 'stale': return 'stale';
    case 'empty':
    case 'missing': return 'absent';
    case 'error': return 'unavailable';
    default: return assertNever(graphState, 'graph-state');
  }
}

function truncateInline(text: string, maxChars: number = 220): string {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxChars) return normalized;
  return `${normalized.slice(0, maxChars - 3).trimEnd()}...`;
}

export function createSharedPayloadEnvelope(input: {
  kind: SharedPayloadKind;
  sections: SharedPayloadSection[];
  provenance: SharedPayloadProvenance;
  metadata?: SharedPayloadEnvelopeMetadata;
  summary?: string;
  selection?: PreMergeSelectionMetadata;
}): SharedPayloadEnvelope {
  const sections = input.sections.filter((section) => section.content.trim().length > 0);
  const summary = input.summary
    ? truncateInline(input.summary)
    : truncateInline(
      sections.length > 0
        ? sections.slice(0, 2).map((section) => `${section.title}: ${section.content}`).join(' | ')
        : `${input.kind} payload from ${input.provenance.producer}`,
    );
  return {
    kind: input.kind,
    summary,
    sections,
    provenance: input.provenance,
    ...(input.metadata ? { metadata: input.metadata } : {}),
    ...(input.selection ? { selection: input.selection } : {}),
  };
}
