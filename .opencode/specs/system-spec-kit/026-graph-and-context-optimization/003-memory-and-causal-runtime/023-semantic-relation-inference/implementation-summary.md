---
title: "Implementation Summary: Semantic Relation Inference"
description: "Added the two deferred OPT-IN collectors to backfillRelationInference: a similarity 'supports' collector reading only the cached memory_index.related_memories column (threshold 75, top K<=5, strength ~0.35) and a 'contradicts' collector from structural memory_lineage.superseded_by_memory_id (strength ~0.3). Both default false, run inside the existing transaction, emit created_by='auto' edges through insertEdgesBatch, and inherit the dryRun-default + bounded safety. Wired through schema/types/handler; honest hint updated. Tests green; tsc clean; deploy pending."
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/023-semantic-relation-inference"
    last_updated_at: "2026-06-04T13:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "P2 polish: determinism tie-break + README + 3 tests; tsc + 169 tests green"
    next_safe_action: "Commit + deploy; actual backfill run stays user-gated"
    blockers: []
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "Cached related_memories column read instead of live vec keeps the similarity collector deterministic + testable."
      - "Contradicts is structural-supersession-only to avoid semantic false positives."
---
# Implementation Summary: Semantic Relation Inference

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Status** | Shipped (deploy pending) |
| **Date** | 2026-06-04 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The two collectors packet 021 deferred, added as OPT-IN extensions to the shipped `backfillRelationInference`.

| File | Change |
|------|--------|
| `mcp_server/lib/causal/relation-backfill.ts` | Added `collectSimilarityEdges` (reads ONLY the cached `memory_index.related_memories` column; keeps neighbours `similarity >= threshold` default 75; top K<=5; excludes self + spec-chain pairs; emits `supports` ~0.35) and `collectSupersessionEdges` (predecessor->successor `contradicts` ~0.3 from `superseded_by_memory_id`). Added `parseRelatedNeighbors`, `columnExists`, `pairKey` helpers. `BackfillRelationInferenceOptions` gains `similarity?`/`contradicts?`/`similarityThreshold?` (defaults false/false/75, threshold clamped 1-100). Both collectors are gated, run inside the existing transaction, and reuse the existing post-commit `invalidateEntityDensityCache()`. |
| `mcp_server/lib/causal/relation-coverage.ts` | Honest hint updated to advertise the opt-in collectors: `memory_causal_stats({ backfill: { dryRun:false, similarity:true, contradicts:true } })`. |
| `mcp_server/handlers/causal-graph.ts` | Local `backfill` interface + handler pass-through thread `similarity`/`contradicts`/`similarityThreshold` into `backfillRelationInference`. |
| `mcp_server/schemas/tool-input-schemas.ts` | `memoryCausalStatsSchema.backfill` gains optional `similarity`/`contradicts` booleans + `similarityThreshold` (`positiveIntMax(100)`). Nested fields need no separate allow-list entry. |
| `mcp_server/tools/types.ts` | `CausalStatsArgs.backfill` extended with `similarity?`/`contradicts?`/`similarityThreshold?`. |
| `mcp_server/tests/relation-backfill-similarity.vitest.ts` | NEW (11 tests): opt-in default off, dry-run zero writes with both on, bounded similarity (threshold/K/strength/auto), custom threshold, contradicts-from-supersession, idempotency, graceful no-op on empty + unparseable, genuinely-absent schema (no related_memories column + no memory_lineage), spec-chain pair dedup (direction-agnostic), and schema rejection of bad backfill.similarityThreshold / similarity type. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The similarity collector reads the pre-computed `related_memories` column (a JSON `[{ id, similarity }]` list, 0-100 scale, written by `link_related_on_save` / `populateRelatedMemories`) rather than running a live `vector_search`/sqlite-vec scan, so it is deterministic and unit-testable and never does O(n^2) all-pairs work. It parses tolerantly (dropping bare-id entries that carry no score), filters by threshold, takes the top K=5 by similarity, and excludes self-loops plus any unordered pair already produced by the spec-chain collector. The contradicts collector promotes the recorded `superseded_by_memory_id` pointer into a predecessor->successor `contradicts` edge — a structural fact, never an embedding guess, and it never calls `detectContradictions` (an insert-time guard) for candidates. Both collectors are OPT-IN (default false) so existing `memory_causal_stats({ backfill })` callers see no change, run inside the existing transaction, and emit `created_by='auto'` edges through `insertEdgesBatch`, inheriting every runtime guard (MAX_AUTO_STRENGTH=0.5, MAX_EDGES_PER_NODE=20, per-relation window cap, self-loop/orphan rejection, idempotent upsert). The existing single post-commit `invalidateEntityDensityCache()` covers the new edges; no extra invalidation was added.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

See `decision-record.md` (ADR-001..003):
- ADR-001: Read the cached `related_memories` column, not a live vector scan (deterministic + testable, no sqlite-vec).
- ADR-002: Drive `contradicts` from structural supersession, not embedding similarity (no false positives).
- ADR-003: Ship both collectors OPT-IN (default off) to keep the recovered DB safe and the existing contract intact.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- `npx tsc --noEmit --composite false -p tsconfig.json` → 0 errors.
- `npx vitest run tests/relation-backfill-similarity.vitest.ts tests/relation-backfill-unit.vitest.ts tests/relation-coverage-unit.vitest.ts tests/causal-stats-output.vitest.ts tests/causal-edges-unit.vitest.ts tests/handler-causal-graph.vitest.ts tests/mcp-input-validation.vitest.ts` → 166 passed across 7 files.
- New `relation-backfill-similarity.vitest.ts` proves the P0 requirements: (1) opt-in off by default writes no similarity/contradicts edges; (2) dryRun=true writes zero even with both collectors on; (3) non-dry + similarity:true writes bounded `supports` auto edges respecting threshold>=75, K<=5, strength<=0.5; (4) non-dry + contradicts:true writes the predecessor->successor `contradicts` edge. Plus idempotent re-run + graceful no-op on empty/unparseable.
- Post-deploy (pending): `memory_causal_stats({ backfill: { dryRun:false, similarity:true, contradicts:true } })` on the production DB.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The similarity collector is only as fresh as the cached `related_memories` column; a backfill re-run picks up updated caches but does not recompute neighbours itself.
- `contradicts` coverage is limited to recorded supersession pairs; other contradictions still require explicit `memory_causal_link`.
- Both collectors remain OPT-IN; they do not run for default `memory_causal_stats({ backfill })` callers until the flags are passed.
<!-- /ANCHOR:limitations -->
