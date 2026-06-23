---
title: "Memory indexing (memory_save)"
description: "Covers the save entry point that reads files, generates embeddings, applies quality gating and indexes content into the spec-doc record database."
trigger_phrases:
  - "memory save"
  - "memory indexing"
  - "memory_save"
  - "index memory"
version: 3.6.0.5
---

# Memory indexing (memory_save)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Covers the save entry point that reads files, generates embeddings, applies quality gating and indexes content into the spec-doc record database.

This is how you add new knowledge to the system. You point it at a file and it reads, understands and stores the content so it becomes searchable. Before storing, it checks whether the same information already exists and decides whether to add it fresh, update an older version or skip it entirely. Quality checks catch low-value content before it clutters up the knowledge base.

---

## 2. HOW IT WORKS

### Entry Point & Content Routing

`memory_save` is the save entry point for the canonical packet continuity path. You point it at a packet document or other supported markdown input, and it routes the content through `contentRouter`, applies the selected merge behavior via `anchorMergeOperation`, and writes the result through `atomicIndexMemory` inside the existing spec-folder lock. `_memory.continuity` now lives as supporting frontmatter state inside the spec doc, and `/speckit:resume` remains the canonical recovery surface.

The canonical router classifies save chunks across 8 categories: `narrative_progress`, `narrative_delivery`, `decision`, `handover_state`, `research_finding`, `task_update`, `metadata_only`, and `drop`. Tier 1 handles structured and heuristic routes, Tier 2 compares against the routing prototype library, and Tier 3 is wired into the live save handler by default when the configured LLM endpoint is available. Delivery cues favor sequencing, gating, rollout, and verification language over generic implementation verbs; the handover/drop boundary keeps hard transcript or telemetry wrappers on the refuse-to-route side and lets softer operational phrases survive when the chunk is clearly a stop-state note.

`routeAs` can force any of the 8 categories and preserves the natural router decision for audit when the override crosses a natural `drop`. Router session context passes `packet_kind` derived from spec metadata first (`type`, `title`, `description`), with parent-phase fallback only when the metadata is silent.

### Pre-Storage Pipeline

Before the indexed write, the handler normalizes content, generates embeddings, runs prediction-error arbitration, applies the three-layer quality gate, and performs reconsolidation where enabled. The save path records mutation history, invalidates caches, and preserves async-embedding behavior — all feeding spec-doc anchored continuity rather than the legacy memory-file path.

The direct MCP `memory_save` lane indexes document content and does not refresh packet metadata files. On mutating packet-doc saves, success responses include `metadataRefresh: { refreshed:false, refreshedBy:'generate-context save lane' }` and a hint to run the generate-context save lane when `description.json` or `graph-metadata.json` must be current. The `/memory:save` command's generate-context lane remains the path that refreshes packet metadata and backfills metadata surfaces.

### Prediction Error (PE) Arbitration

A PE gating system compares the new content against existing spec-doc records via cosine similarity and selects one of five actions:

- **CREATE** — no similar spec-doc record exists; store a new one.
- **REINFORCE** — near-duplicate found; boost FSRS stability without creating a new record.
- **UPDATE** — high-similarity match; overwrite the existing record in-place.
- **SUPERSEDE** — mark the older record deprecated, create a new one, link with a causal edge.
- **CREATE_LINKED** — store a new record with a relationship edge to a similar but distinct existing record.

Auto-edge insertion on SUPERSEDE and CREATE_LINKED paths respects a per-relation per-window cap so PE/reconsolidation supersede bursts cannot dominate the causal graph.

### Quality Gates & Validation

Two hard-blocks run before the pre-storage quality gate:

1. **Semantic sufficiency gate** — rejects thin aligned spec-doc records with `INSUFFICIENT_CONTEXT_ABORT`.
2. **Spec-doc structure validator** — rejects files missing required frontmatter, mandatory section anchors/HTML ids, or cleanup invariants.

After the hard-blocks, a three-layer quality gate runs when `SPECKIT_SAVE_QUALITY_GATE` is enabled (default ON). Layer 1 validates structure. Layer 2 scores content quality across five dimensions against a 0.4 signal density threshold. Layer 3 checks semantic deduplication via cosine similarity, rejecting near-duplicates above 0.92. A warn-only mode runs for the first 14 days, logging would-reject decisions without blocking saves.

When `SPECKIT_QUALITY_LOOP=true`, a verify-fix-verify loop runs before storage: one initial evaluation plus up to 2 auto-fix retries. If the loop rejects, `atomicIndexMemory()` returns `status: 'rejected'` and rolls back the index write.

### Reconsolidation & Chunking

Reconsolidation runs after embedding generation when `SPECKIT_RECONSOLIDATION=true` (default OFF). The system checks the top-3 most similar spec-doc records in the same folder: similarity ≥ 0.88 merges and boosts `importance_weight`; 0.75–0.88 deprecates the older record and creates a `supersedes` edge; below 0.75 stores unchanged. A checkpoint must exist before reconsolidation can run.

For large files, the system splits into a parent record (metadata only) plus child chunk records, each with its own embedding. Anchor-aware chunk thinning scores each chunk on anchor presence (weight 0.6) and content density (weight 0.4), dropping chunks below 0.3. The thinning never returns an empty array. Chunk embedding cache keys hash normalized content so structurally equivalent chunks reuse the same cache entry.

### Post-Save Behavior

When `SPECKIT_ENCODING_INTENT` is enabled (default ON), content is classified at index time as `document`, `code`, or `structured_data` and stored as read-only metadata. No retrieval-time scoring impact yet — it builds a labeled dataset for future type-aware retrieval.

After every successful save, a consolidation cycle hook fires when `SPECKIT_CONSOLIDATION` is enabled (default ON). The N3-lite engine scans for contradictions, runs Hebbian strengthening on recently accessed edges (+0.05 per cycle, 30-day decay), detects stale edges (90+ days unfetched), and enforces a 20-edge-per-node bound. Successful insertions also clear the search cache immediately so repeated `memory_search` calls see the new record right away.

Document type sets importance weighting automatically: constitutional files 1.0, spec documents 0.8, plans 0.7, supporting memory artifacts 0.5, scratch files 0.25.

### Async & Safety

The `asyncEmbedding` parameter (default `false`) enables non-blocking saves: the record is written immediately with a `pending` embedding status and becomes searchable via BM25/FTS5 while the embedding generates in the background. When `false`, the save blocks until embedding generation completes.

Safety mechanisms include path and file-type allowlists, pre-flight anchor/duplicate/token-budget validation, a per-spec-folder mutex lock (prevents TOCTOU races), SHA-256 content hashing (skips healthy duplicate rows, re-indexes unhealthy ones), and a full mutation ledger for audit. All caches (trigger matcher, tool, constitutional, entity-density) are invalidated on write.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/memory-save.ts` | Handler | Save entry point and orchestration for validation, quality gating, PE arbitration, spec-doc routing, reconsolidation, and persistence |
| `mcp_server/handlers/save/atomic-index-memory.ts` | Handler | Atomic post-merge index/write commit for spec-doc continuity |
| `mcp_server/lib/routing/content-router.ts` | Lib | Classifies save content and selects the merge/routing path |
| `mcp_server/lib/merge/anchor-merge-operation.ts` | Lib | Anchor-aware merge modes used by the save path |
| `mcp_server/handlers/save/markdown-evidence-builder.ts` | Handler | Extracts structured markdown evidence snapshots used by save-time semantic sufficiency checks |
| `mcp_server/handlers/save/validation-responses.ts` | Handler | Builds insufficiency, template-contract, and dry-run response payloads for the save path |
| `mcp_server/handlers/save/embedding-pipeline.ts` | Handler | Embedding cache lookup, provider generation, and async/deferred pending behavior |
| `mcp_server/handlers/save/pe-orchestration.ts` | Handler | Save-path PE decision evaluation and early-return handling |
| `mcp_server/handlers/save/create-record.ts` | Handler | Record creation, BM25 insert, lineage transition, and save-time history writes |
| `mcp_server/handlers/save/response-builder.ts` | Handler | Success envelope builder, including metadata-refresh advisories for content-only saves |
| `mcp_server/handlers/save/spec-folder-mutex.ts` | Handler | Per-spec-folder serialization around save execution |
| `mcp_server/handlers/chunking-orchestrator.ts` | Handler | Chunked indexing path for large packet documents |
| `mcp_server/handlers/quality-loop.ts` | Handler | Verify-fix-verify quality loop before storage |
| `mcp_server/lib/validation/spec-doc-structure.ts` | Lib | Phase-018 spec-doc structure rule set for save legality |
| `mcp_server/lib/validation/save-quality-gate.ts` | Lib | Pre-storage quality gate and semantic dedup checks |
| `mcp_server/lib/storage/history.ts` | Lib | ADD/UPDATE history logging used by the save path |
| `shared/parsing/memory-template-contract.ts` | Shared | Rendered document structural contract validator |
| `scripts/core/workflow.ts` | Script orchestrator | Canonical save workflow that now always refreshes packet metadata on successful saves |
| `scripts/memory/backfill-research-metadata.ts` | Script | Research-tree metadata backfill step invoked from the canonical save workflow |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `mcp_server/tests/handler-memory-save.vitest.ts` | Automated test | Save handler validation and template-contract enforcement |
| `mcp_server/tests/memory-save-integration.vitest.ts` | Automated test | Save-path PE arbitration integration tests |
| `mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts` | Automated test | Save pipeline enforcement and async/deferred embedding scenarios |
| `mcp_server/tests/quality-loop.vitest.ts` | Automated test | Quality loop behavior |
| `scripts/tests/workflow-canonical-save-metadata.vitest.ts` | Automated test | Canonical save metadata refresh coverage |

---

## 4. SOURCE METADATA

- Group: Mutation
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `02--mutation/memory-indexing-memorysave.md`
- Source list updated 2026-03-25 per deep review

Related references:
- [memory-metadata-update-memoryupdate.md](memory-metadata-update-memoryupdate.md) — Memory metadata update (memory_update)
