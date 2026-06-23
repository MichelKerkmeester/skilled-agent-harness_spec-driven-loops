---
title: "Post-insert enrichment marker (post_insert_enrichment_status)"
description: "Each saved memory_index row carries a post_insert_enrichment_status marker (plus state, completed-at, and version columns) so deferred post-insert enrichment can be tracked and repaired on a later pass instead of silently leaving rows under-enriched."
trigger_phrases:
  - "post insert enrichment marker"
  - "post_insert_enrichment_status"
  - "deferred enrichment repair"
  - "enrichment marker columns memory_index"
  - "incomplete enrichment backfill"
version: 3.6.0.2
---

# Post-insert enrichment marker (post_insert_enrichment_status)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

When a memory is saved, some enrichment work (causal links, entity extraction, graph signals) can run after the row is inserted rather than blocking the save. In planner-first save modes that post-insert step is deferred. If the server is interrupted or the deferred step fails, the row would otherwise be left silently under-enriched with no way to find it again. The post-insert enrichment marker fixes that: every `memory_index` row records whether its post-insert enrichment completed, so an incomplete row is discoverable and repairable on a later pass.

---

## 2. HOW IT WORKS

### Marker columns

Schema migration v30 added four columns to `memory_index`:

- `post_insert_enrichment_status` (`NOT NULL DEFAULT 'complete'`) — the lifecycle status of the row's post-insert enrichment. Values include `pending`, `complete`, `partial`, `failed`, and `deferred`.
- `post_insert_enrichment_state` — a serialized record of the enrichment result (which steps ran, skipped, or failed) for diagnostics and repair.
- `post_insert_enrichment_completed_at` — the timestamp the enrichment finished.
- `post_insert_enrichment_version` — the enrichment-logic version (`POST_INSERT_ENRICHMENT_VERSION`) that produced the marker, so a future logic bump can re-run rows enriched under an older version.

The `DEFAULT 'complete'` means every pre-v30 row and every row whose enrichment runs inline is classified as complete with no backfill, while deferred or failed rows are written with the appropriate non-complete status.

### Finding and repairing incomplete rows

Migration v30 also created the partial index `idx_post_insert_enrichment_incomplete ON memory_index(post_insert_enrichment_status, id) WHERE post_insert_enrichment_status != 'complete'`. That index lets a repair/backfill scan find only the rows that still need enrichment cheaply, without walking the whole table. The enrichment-state module reads each row's marker, re-runs the post-insert step for incomplete rows, and updates the status (to `complete`, `partial`, or `failed`) with the result state, completion time, and version.

This makes the deferred post-insert enrichment idempotent and recoverable: a row that was `deferred` at save time, or `failed` on a previous attempt, is found by the partial index and repaired on the next pass instead of remaining permanently under-enriched.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/vector-index-schema.ts` | Library | Migration v30: the four `post_insert_enrichment_*` columns and the `idx_post_insert_enrichment_incomplete` partial index |
| `mcp_server/handlers/save/enrichment-state.ts` | Handler | Reads/writes the marker; repair and backfill of incomplete rows; `POST_INSERT_ENRICHMENT_VERSION` |
| `mcp_server/handlers/save/post-insert.ts` | Handler | Runs the deferred post-insert enrichment step and reports its execution status |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/vector-index-schema-enrichment-v30.vitest.ts` | Automated test | v30 marker columns and partial index |
| `mcp_server/tests/enrichment-state.vitest.ts` | Automated test | Marker read/write, repair, and backfill of incomplete rows |
| `mcp_server/tests/post-insert-deferred.vitest.ts` | Automated test | Deferred post-insert enrichment lifecycle |
| `mcp_server/tests/run-enrichment-step.vitest.ts` | Automated test | Individual enrichment-step execution and status mapping |

---

## 4. SOURCE METADATA
- Group: Memory Quality And Indexing
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `13--memory-quality-and-indexing/post-insert-enrichment-marker.md`
Related references:
- [session-enrichment-and-alignment-guards.md](session-enrichment-and-alignment-guards.md) — Stateless enrichment and alignment guards
- [../08--bug-fixes-and-data-integrity/schema-version-history-v28-v30.md](../08--bug-fixes-and-data-integrity/schema-version-history-v28-v30.md) — Schema version history (v28 to v30)
