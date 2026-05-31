---
iteration: 033
rq: RQ-N4
phase_target: 004-metadata-edge-promoter
newInfoRatio: 0.82
verdict: ADAPT
---

# Iteration 033 — RQ-N4: Deterministic Frontmatter Causal-Edge Promotion

## Research Question

What specific fields in `description.json` and `graph-metadata.json` can be deterministically promoted into causal edges today? Enumerate with field, promotion target, determinism confidence, and notes. Identify the indexer/causal-graph code that currently reads these files, with file:line cites.

---

## Context Files Read

- `004-metadata-edge-promoter/spec.md` (lines 1-60): Phase spec. Predecessor is 004, successor is 006. Handoff criterion: "Indexing a packet with structured relationship metadata creates idempotent auto causal edges with deterministic provenance."
- `lib/graph/graph-metadata-schema.ts`: Zod schema defining the canonical `GraphMetadata` type.
- `lib/graph/graph-metadata-parser.ts`: Parser that populates `GraphMetadata` from on-disk JSON; exports `packetReferencesToCausalLinks()` at line 1338.
- `lib/parsing/memory-parser.ts`: Calls `extractCausalLinksFromGraphMetadata()` at line 318 when document type is `graph_metadata`; imports `packetReferencesToCausalLinks` from graph-metadata-parser at line 28.
- `handlers/memory-index.ts`: Lines 610-671 — on scan completion for spec-doc-type folders, calls `createSpecDocumentChain()` to build intra-packet document chains.
- `lib/storage/causal-edges.ts` lines 859-898: `createSpecDocumentChain()` creates CAUSED/SUPPORTS edges from doc-type IDs only; does NOT read `graph-metadata.json` fields directly.
- `handlers/causal-links-processor.ts` lines 67-73: `CAUSAL_LINK_MAPPINGS` table — maps `depends_on → blocks/ENABLED (reverse)`, `supersedes → SUPERSEDES`, `related_to → SUPPORTS`.

---

## Field Enumeration: graph-metadata.json

Fields are taken from the Zod schema at `lib/graph/graph-metadata-schema.ts:34-71` and from 3 real files: `027-xce-research-based-refinement/graph-metadata.json`, `026-graph-and-context-optimization/graph-metadata.json`, and `028-code-graph-and-cocoindex/001-code-graph-hld-lld/graph-metadata.json`.

| Field | Path in schema | Promotion target (edge type) | Determinism confidence | Notes |
|---|---|---|---|---|
| `manual.depends_on[*].packet_id` | `graphMetadataManualSchema.depends_on` | `this_packet → depends_on → packet_id` (ENABLED/blocks, reverse) | **HIGH** | Currently wired: `packetReferencesToCausalLinks()` at graph-metadata-parser.ts:1338 maps this to `blocks[]`; `extractCausalLinksFromGraphMetadata()` at memory-parser.ts:480 consumes it. Edge insertion happens through `causal-links-processor.ts` CAUSAL_LINK_MAPPINGS. Round-trip confirmed. |
| `manual.supersedes[*].packet_id` | `graphMetadataManualSchema.supersedes` | `this_packet → supersedes → packet_id` (SUPERSEDES) | **HIGH** | Same pipeline. `packetReferencesToCausalLinks()` at graph-metadata-parser.ts:1342 maps to `supersedes[]`. No inference required — field is explicit author intent. |
| `manual.related_to[*].packet_id` | `graphMetadataManualSchema.related_to` | `this_packet ↔ related_to → packet_id` (SUPPORTS) | **HIGH** | Same pipeline. Maps to `related_to[]` at graph-metadata-parser.ts:1343. One real example found: `120-cli-opencode-minimax-optimization` has a non-empty `related_to` entry (graph-metadata.json:manual.related_to[0] = "skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/007-benchmark-mode-hardening-review"). |
| `parent_id` | `graphMetadataSchema.parent_id` | `this_packet → child_of → parent_id` (DERIVED_FROM or structural) | **HIGH** | Structural hierarchy edge. Many phase-child packets have a non-null `parent_id` (e.g., `028-code-graph-and-cocoindex/001-code-graph-hld-lld` has `parent_id: "system-spec-kit/028-code-graph-and-cocoindex"`). No causal promotion of this field currently exists in the indexer — gap confirmed. |
| `children_ids[*]` | `graphMetadataSchema.children_ids` | `this_packet → parent_of → child_id` (inverse of above, ENABLED or structural) | **HIGH** | Inverse of `parent_id`. The 027 root packet lists 8 children; 026 lists 8 children. Currently `derived.last_active_child_id` is read for resume routing only (not causal graph). No edge promotion today — gap confirmed. |
| `derived.last_active_child_id` | `graphMetadataDerivedSchema.last_active_child_id` | `parent → last_active_child → child_id` (SUPPORTS, recency-weighted) | **MEDIUM** | Present on several phase parents (e.g., `026` has `last_active_child_id: "system-spec-kit/026-graph-and-context-optimization/004-code-graph"`). Could yield a time-ordered "active continuation" edge. Deterministic from the field value itself, but recency semantics are implicit — ADAPT needed to decide edge weight and whether to emit on every re-index. |
| `derived.status` | `graphMetadataDerivedSchema.status` | attribute on packet node (not a directed edge) | **N/A — not an edge** | `status` is `"planned"`, `"in_progress"`, `"complete"`, etc. Useful for filtering but is not a source/target relationship. Skip for edge promotion. |
| `derived.causal_summary` | `graphMetadataDerivedSchema.causal_summary` | text on existing edge (evidence annotation) | **MEDIUM** | Not a structurally-parseable field — it is free prose. Can annotate a `parent → child` edge as evidence text, but cannot be promoted deterministically as a standalone edge. Deferred to LLM-augmented path. |
| `derived.entities[*]` | `graphMetadataDerivedSchema.entities` | `this_packet → mentions_entity → entity.path` (if entity.kind = doc/file) | **MEDIUM-LOW** | Entity list is LLM-derived; entities with `kind: "doc"` carry a `path` field that resolves to real files. However, this field is derived, not manually authored — promotable as a SUPPORTS relationship only with a low confidence weight. ADAPT: require `entity.source === "manual"` (none exist yet) for HIGH confidence promotion. |
| `schema_version` | `graphMetadataSchema.schema_version` | version guard only | **N/A** | Structural field; no causal edge meaning. |
| `migrated` / `migration_source` | `graphMetadataSchema.migrated` | migration provenance annotation | **LOW** | Could annotate a DERIVED_FROM edge to a legacy record ID, but legacy record IDs are not stored in a cross-referenceable form. Skip for Phase 005 scope. |

---

## Field Enumeration: description.json

Schema enforced by `perFolderDescriptionSchema` via `parseDescriptionMetadataContent()` at memory-parser.ts:513. Observed fields in 3 real files: `027/description.json`, `029/description.json`, `028/005/description.json`.

| Field | Promotion target | Determinism confidence | Notes |
|---|---|---|---|
| `parentChain[*]` | `this_packet → child_of → parentChain[-1]` (structural DERIVED_FROM) | **HIGH** | `027/description.json` has `parentChain: ["system-spec-kit"]`. `028/005/description.json` has `parentChain: ["system-spec-kit", "028-code-graph-and-cocoindex"]`. Unambiguous hierarchy; each element is a resolvable spec folder. Overlaps with `graph-metadata.json.parent_id` but description.json carries the full ancestor chain, enabling multi-hop structural edges. No promotion today — gap confirmed. |
| `children[*]` (some description.json files only) | `this_packet → parent_of → child` | **HIGH** | Present in `027/description.json` as `children: ["000-release-cleanup", ...]`. Redundant with `graph-metadata.json.children_ids` but description.json uses relative slugs only. If both files are canonical, description.json `children` could be omitted from promotion to avoid double-insertion. |
| `specId` | ID disambiguation only | **N/A** | Numeric string like `"027"`. Useful for lookup key but not a relationship edge. |
| `keywords[*]` | topic tag on packet node | **N/A — not an edge** | Flat text tokens; no directional relationship. |
| `memoryNameHistory[*]` | `this_packet → iteration_artifact → filename` (DERIVED_FROM, weak) | **LOW** | History of prior session save filenames. Not cross-referenceable in the graph DB as memory IDs. Skip for Phase 005. |
| `is_phase_parent` | structural flag | **N/A** | Boolean attribute; not a relationship edge. |

---

## Current Code Path: What Already Exists

The promotion pipeline for `manual.depends_on`, `manual.supersedes`, and `manual.related_to` is already implemented end-to-end:

1. `memory-index.ts` indexes `graph-metadata.json` files as `document_type: 'graph_metadata'` (line 277).
2. `memory-parser.ts:301-335` routes `graph_metadata` documents through `extractCausalLinksFromGraphMetadata()` (line 318), which calls `packetReferencesToCausalLinks(metadata.manual)` (graph-metadata-parser.ts:1338).
3. `packetReferencesToCausalLinks` (graph-metadata-parser.ts:1338-1344) maps: `depends_on → blocks[]`, `supersedes → supersedes[]`, `related_to → related_to[]`.
4. `memory-save.ts:369` forwards `causalLinks` from parsed memory to `runPostInsertEnrichmentIfEnabled()` (line 2631), which calls `causal-links-processor.ts`.
5. `causal-links-processor.ts:67-73` maps `blocks → ENABLED (reverse)`, `supersedes → SUPERSEDES`, `related_to → SUPPORTS` and resolves packet IDs to memory row IDs via path/title lookup.

**Gap confirmed:** `parent_id`, `children_ids`, `parentChain`, and `derived.last_active_child_id` are NOT promoted today. The code reads them for display/routing only.

---

## ADAPT Verdict: Recommended Changes for Phase 005

The spec's handoff criterion requires "idempotent auto causal edges with deterministic provenance." The following fields are high-confidence promotion candidates that require no LLM extraction:

1. **`manual.depends_on[*].packet_id`** — already wired but not idempotent on re-index; Phase 005 should add a deduplication guard (ADAPT: verify upsert semantics in `insertEdgesBatch`).
2. **`graph-metadata.json.parent_id`** — deterministic structural `DERIVED_FROM` edge. New: requires a promoter that reads this field and emits `child → DERIVED_FROM → parent` during `memory_index_scan`.
3. **`graph-metadata.json.children_ids[*]`** — inverse structural edges. Could be inferred from `parent_id` during graph traversal rather than promoted separately to avoid duplication.
4. **`description.json.parentChain`** — multi-hop ancestor chain for packets that don't have `parent_id` in graph-metadata (older packets). Complements graph-metadata parent_id.

The `derived.last_active_child_id` field is an ADAPT-with-caution candidate: emit a time-ordered SUPPORTS edge only if the child is still active (status not `complete`).

---

## Key Finding

The `manual.depends_on/supersedes/related_to` fields in `graph-metadata.json` are already parsed into `CausalLinks` via `packetReferencesToCausalLinks()` (graph-metadata-parser.ts:1338) and consumed by `causal-links-processor.ts`, but `parent_id` and `children_ids` — the most structurally certain hierarchy edges — are not promoted at all; Phase 005 must add this promotion path while extending the deduplication guarantee to all auto-promoted edges.
