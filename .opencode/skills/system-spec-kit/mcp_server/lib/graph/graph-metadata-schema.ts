// ───────────────────────────────────────────────────────────────
// MODULE: Graph Metadata Schema
// ───────────────────────────────────────────────────────────────

import { z } from 'zod';

export const GRAPH_METADATA_SCHEMA_VERSION = 1 as const;
export const GRAPH_METADATA_DOCUMENT_TYPE = 'graph_metadata' as const;
export const GRAPH_METADATA_FILENAME = 'graph-metadata.json' as const;
export const GRAPH_METADATA_MIGRATED_QUALITY_FLAG = 'graph_metadata_migrated' as const;
export const SAVE_LINEAGE_VALUES = ['description_only', 'graph_only', 'same_pass'] as const;

// Closed set of legitimate lifecycle statuses for derived.status. The schema, the
// status normalizer, the generated-metadata integrity rule and the parser re-derive
// all read this one declaration so they agree on what counts as a valid status and
// reject prose (multi-word narrative, em-dash summaries) at the boundary instead of
// admitting any non-empty string. Single-token authored states (draft, placeholder,
// blocked, deferred) stay admitted so a curated status is preserved, not narrative.
export const GRAPH_METADATA_STATUS_VALUES = [
  'planned',
  'draft',
  'placeholder',
  'in_progress',
  'blocked',
  'deferred',
  'complete',
  'unknown',
] as const;
export const GRAPH_METADATA_TRIGGER_PHRASE_LIMIT = 12;
export const GRAPH_METADATA_KEY_TOPIC_LIMIT = 12;
export const GRAPH_METADATA_KEY_FILE_LIMIT = 20;
export const GRAPH_METADATA_ENTITY_LIMIT = 24;
export type GraphMetadataMigrationSource = 'legacy';
export type SaveLineage = typeof SAVE_LINEAGE_VALUES[number];
export type GraphMetadataStatus = typeof GRAPH_METADATA_STATUS_VALUES[number];

export const packetReferenceSchema = z.object({
  packet_id: z.string().min(1),
  reason: z.string().min(1),
  source: z.string().min(1),
  spec_folder: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
});

export const graphEntityReferenceSchema = z.object({
  name: z.string().min(1),
  kind: z.string().min(1),
  path: z.string().min(1),
  source: z.string().min(1),
});

export const graphMetadataManualSchema = z.object({
  depends_on: z.array(packetReferenceSchema),
  supersedes: z.array(packetReferenceSchema),
  related_to: z.array(packetReferenceSchema),
});

export const graphMetadataDerivedSchema = z.object({
  trigger_phrases: z.array(z.string().min(1)).max(GRAPH_METADATA_TRIGGER_PHRASE_LIMIT),
  key_topics: z.array(z.string().min(1)).max(GRAPH_METADATA_KEY_TOPIC_LIMIT),
  importance_tier: z.string().min(1),
  status: z.enum(GRAPH_METADATA_STATUS_VALUES),
  key_files: z.array(z.string().min(1)).max(GRAPH_METADATA_KEY_FILE_LIMIT),
  entities: z.array(graphEntityReferenceSchema).max(GRAPH_METADATA_ENTITY_LIMIT),
  causal_summary: z.string(),
  created_at: z.string().datetime({ offset: true }),
  last_save_at: z.string().datetime({ offset: true }),
  save_lineage: z.enum(SAVE_LINEAGE_VALUES).optional(),
  last_accessed_at: z.string().datetime({ offset: true }).nullable(),
  source_docs: z.array(z.string().min(1)),
  // Drift-detection proof that the derived causal_summary and description were re-derived
  // from the current source docs rather than carried forward stale: sha256 over a single
  // volatile-ignoring projection of those docs (timestamps normalized out so a no-op
  // re-derive is identical). Optional so legacy files and a flag-off derive omit it
  // cleanly; a strict read re-derives over the current docs and reports a mismatch as
  // drift. Persisted only when the generator-hardening flag is on.
  source_fingerprint: z.string().min(1).optional(),
  // Freshness key for the drift gate: sha256 of each present source doc keyed by its
  // packet-relative path. Optional so legacy files and a flag-off derive omit it cleanly;
  // a doc edit changes its digest, letting a strict run skip the re-derive when the docs
  // are unchanged. Persisted only when the drift-gate flag is on.
  source_doc_hashes: z.record(z.string().min(1), z.string().min(1)).optional(),
  // Phase-parent chronology pointer: the most-recently-active direct child and when.
  // The resume ladder reads these to redirect into the live child phase. Optional +
  // nullable so leaf packets and freshly-derived metadata omit them cleanly; declared
  // here so the Zod parse preserves (rather than strips) them on every load/re-derive.
  last_active_child_id: z.string().min(1).nullable().optional(),
  last_active_at: z.string().datetime({ offset: true }).nullable().optional(),
});

export const graphMetadataSchema = z.object({
  schema_version: z.literal(GRAPH_METADATA_SCHEMA_VERSION),
  packet_id: z.string().min(1),
  spec_folder: z.string().min(1),
  parent_id: z.string().min(1).nullable(),
  // Set when the merge kept a non-null parent over a null re-derive: the folder might
  // be genuinely re-parented rather than transiently unresolved, so it stays surfaced
  // for review instead of being silently retained. Optional so a clean record and the
  // legacy merge never carry it.
  parent_id_review_required: z.boolean().optional(),
  // Set when a re-derive dropped a non-enum legacy status and fell back to 'planned':
  // the prior status was prose the closed enum no longer admits, so it stays surfaced
  // for review rather than being silently rewritten. Optional so a clean record and a
  // genuinely new packet never carry it.
  status_review_required: z.boolean().optional(),
  children_ids: z.array(z.string().min(1)),
  migrated: z.boolean().optional(),
  migration_source: z.literal('legacy').optional(),
  manual: graphMetadataManualSchema,
  derived: graphMetadataDerivedSchema,
});

// Reason and source stamped onto a manual relationship that was stored as a bare
// packet-id string, matching the legacy text-file fallback so an upgraded reference is
// indistinguishable from one the legacy importer produced.
export const LEGACY_REFERENCE_REASON = 'Imported from legacy graph-metadata.json' as const;
export const LEGACY_REFERENCE_SOURCE = 'legacy' as const;

// Legacy and hand-authored graph-metadata files stored manual relationships as bare
// packet-id strings rather than the structured reference the contract now requires. A
// load upgrades a string to the object shape so the relationship is preserved on read
// rather than dropped, while the strict schema above keeps rejecting strings so the
// integrity validator still flags an un-migrated on-disk file. The object branch is
// tried first, so an already-structured reference passes through byte-identical.
const tolerantPacketReferenceSchema = z.union([
  packetReferenceSchema,
  z.string().min(1).transform((packetId) => ({
    packet_id: packetId,
    reason: LEGACY_REFERENCE_REASON,
    source: LEGACY_REFERENCE_SOURCE,
  })),
]);

const graphMetadataManualLoadSchema = z.object({
  depends_on: z.array(tolerantPacketReferenceSchema),
  supersedes: z.array(tolerantPacketReferenceSchema),
  related_to: z.array(tolerantPacketReferenceSchema),
});

// Tolerant variant for loading an on-disk file whose derived.status may still be a
// legacy non-enum string, or whose manual relationships are still bare strings. The
// strict schema closes the enum and requires structured references for writes and for
// the integrity rule, but a load must not crash on a legacy value: it reads the raw
// status so a later re-derive can detect and drop it, and upgrades a string reference so
// the relationship survives rather than being lost to the text fallback. Only the load
// path uses this; everything that writes or validates goes through the strict schema.
export const graphMetadataLoadSchema = graphMetadataSchema.extend({
  manual: graphMetadataManualLoadSchema,
  derived: graphMetadataDerivedSchema.extend({
    status: z.string().min(1),
  }),
});

export type PacketReference = z.infer<typeof packetReferenceSchema>;
export type GraphEntityReference = z.infer<typeof graphEntityReferenceSchema>;
export type GraphMetadataManual = z.infer<typeof graphMetadataManualSchema>;
export type GraphMetadataDerived = z.infer<typeof graphMetadataDerivedSchema>;
export type GraphMetadata = z.infer<typeof graphMetadataSchema>;

/**
 * Create an empty manual-relationship section for new graph metadata files.
 *
 * @returns Initialized manual relationship payload with empty lists
 */
export function createEmptyGraphMetadataManual(): GraphMetadataManual {
  return {
    depends_on: [],
    supersedes: [],
    related_to: [],
  };
}
