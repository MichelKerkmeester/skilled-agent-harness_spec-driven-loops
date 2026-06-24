---
title: "Implementation Summary"
description: "Status COMPLETE. Benchmarked the two default-off tail-append features SPECKIT_DETERMINISTIC_MULTIHOP and SPECKIT_LANE_CHAMPION_BACKFILL on the production search path against a read-only backup of the live corpus on nomic-embed-text-v1.5. completeRecall@K for K of 3, 5 and 8 is byte-identical with the flags off and on (prod recall 0.4375 at every K, delta 0, zero variance) because the append stages never run on the prod executePipeline path, the Stage-1 collectRawCandidates uses stopAfterFusion which skips the enrichFusedResults branch the appends live in. The prod path returns the full requested limit of ten, so the documented three-result floor is a never-cut-below-three minimum not a cap, and the real prod-limiting stage is token-budget truncation which trims the legacy path to three and strips every appended row. Verdict REFINE, the features are sound and byte-identical-when-off but unreachable as wired, and the refinement that would reach the prod reader moves the appends into the pipeline Stage-3 ahead of token truncation and exempts appended rows from it, which touches shared pipeline code and is designed for a follow-up."
trigger_phrases:
  - "multihop tail appends benchmark"
  - "tail append REFINE verdict"
  - "three result floor is not a cap"
  - "stopAfterFusion skips enrichFusedResults"
  - "token budget truncation strips appends"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation/001-multihop-tail-appends"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Ran the recall benchmark on the prod and legacy paths and authored the REFINE verdict"
    next_safe_action: "Phase complete, the refinement is designed for a follow-up that touches shared pipeline code"
    blockers: []
    key_files:
      - "results/metrics.json"
      - "benchmark-results.md"
      - "scripts/multihop-tail-appends-benchmark.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Status** | Complete |
| **Completed** | 2026-06-24 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A self-contained recall benchmark for the two default-off tail-append features and the verdict it grounds. `SPECKIT_DETERMINISTIC_MULTIHOP` appends a hub doc's cross-referenced sibling spec.md docs to the result tail with no LLM and no re-embedding. `SPECKIT_LANE_CHAMPION_BACKFILL` appends each base lane's top candidate that missed the fused top-K into empty tail slots with no new query. The harness imports the production search code, builds a labeled multi-target query set whose targets span the sibling folders a hub doc cross-references, and measures completeRecall@K for K of 3, 5 and 8 with the flags off and on, against a read-only backup of the live corpus on the `nomic-embed-text-v1.5` embedder.

The findings, every number from `results/metrics.json`:

**The prod path is byte-identical off vs on and recall is unchanged.** completeRecall@K is 0.4375 at every K with the flags off and 0.4375 with them on, a delta of exactly 0.000 with zero run-to-run variance across three repeats. The prod result ids are byte-identical off vs on (prodByteIdenticalOnVsOff true). Flipping the flags changes nothing on the production path.

**The appends never run on the prod path.** The production reader is `executePipeline`, the function the live `memory_search` MCP handler calls. Its Stage-1 candidate generation runs `collectRawCandidates`, which executes the fusion plan with `stopAfterFusion` set and returns the fused set without entering `enrichFusedResults`. The append stages C3 and C4 live inside `enrichFusedResults`, so the prod path never reaches them. The proof is structural: the prod pipeline's Stage-3 metadata carries `rerankApplied`, `rerankProvider`, `chunkReassemblyStats` and `durationMs` and no `multihop` or `laneChampionBackfill` key at all (prodAppendStagesEverApplied false).

**The three-result floor is a minimum not a cap.** The prod path returned the full requested limit of ten on every query (prod result count 10 across all 8 queries). The `DEFAULT_MIN_RESULTS = 3` is the never-cut-below-three minimum that token-budget truncation floors against, not a top-three window, so a tail contribution past rank three has room to land. The `005-spec-data-quality/benchmark-and-test-status.md` spine is correct and the `ENV_REFERENCE` blocker phrasing is wrong.

**Token-budget truncation is the prod-limiting stage, and it strips the appends where they run.** The legacy `searchWithFallback` path does run the append stages, but it overflows the token budget on every labeled query and truncates to the three-result floor. A tail-appended row is scored below every baseline hit, so it is the first cut. Zero appended rows survived to the reader across all 8 queries (legacyAppendedRowsSurvivingTotal 0). Even on the path where the appends execute, the reader never sees one.

**Verdict: REFINE.** The two features are sound and byte-identical when off, but they are unreachable as wired. They are dead code on the production path because `stopAfterFusion` skips the branch they live in, and they are stripped by token-budget truncation on the legacy path where they do run. The recall opportunity they target is real, the labeled multi-target queries under-recall on the prod path (0.4375 leaves siblings unrecalled), so a structural change inside the flag's reach would expose the appends to measurement. That makes the honest verdict REFINE not CUT. The named refinement is designed below and left for a follow-up because it touches shared pipeline code outside this phase's write scope.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The harness in `scripts/multihop-tail-appends-benchmark.mjs` resolves the live database path from config, backs the database and the active vector shard up read-only to a temporary eval copy, and points the runtime at the copy so the live corpus is never opened for writes. It builds the labeled multi-target query set from hub docs that cross-reference sibling folders and re-resolves each target folder to its indexed spec.md id every run, reporting an unresolved folder rather than scoring it. For each query it embeds once, then runs the production `executePipeline` path off and on and the legacy `searchWithFallback` path off and on, three times each, restoring the flags off after every measurement. It computes completeRecall@K against the resolved target ids, verifies the prod ids are byte-identical off vs on, captures the prod append-stage metadata from `metadata.stage3`, captures the legacy surviving-append count by source tag, records the token-budget truncation, and writes the aggregate and per-query rows to `results/metrics.json`, the single source for the data tables and this verdict. The harness edits no shared production code and flips only the two append flags.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Measure the production `executePipeline` path, not only the legacy path.** The live `memory_search` handler calls `executePipeline`, so a recall number on that path proves a prod-path keep. The legacy `searchWithFallback` path was measured alongside it precisely because it is the path that actually runs the append stages, which is what let the benchmark distinguish "would help if reachable" from "is unreachable."
- **REFINE not CUT.** No measured recall win survives the prod path, which would point at CUT, but the features are unreached rather than measured-and-lost, and the recall opportunity they target is real, so the honest verdict is REFINE with a named structural change.
- **Design the refinement, do not implement it here.** Making the appends reach the prod reader requires moving them into the pipeline Stage-3 ahead of token-budget truncation and exempting appended rows from that truncation, which touches shared pipeline code outside this phase's write scope. The benchmark phase designs it and leaves it for a follow-up, keeping the parallel-safety boundary the suite requires.
- **Re-resolve targets each run.** A target folder that no longer maps 1:1 to one indexed spec.md is reported as unresolved rather than silently scored, so a stale label cannot inflate or deflate recall.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- `node scripts/multihop-tail-appends-benchmark.mjs` runs against a read-only corpus backup and rebuilds `results/metrics.json`, exit 0, no write to the live database.
- The prod path completeRecall@K is 0.4375 at every K with the flags off and on, delta 0.000, zero run-to-run variance, and the prod result ids are byte-identical off vs on (prodByteIdenticalOnVsOff true).
- The prod pipeline Stage-3 metadata carries no `multihop` or `laneChampionBackfill` key, confirming the append stages never run on the prod path (prodAppendStagesEverApplied false).
- The prod path returns the full requested limit of ten on every query, and the legacy path truncates to the three-result floor with zero appended rows surviving (legacyAppendedRowsSurvivingTotal 0), resolving the floor-blocker question with data.
- `validate.sh --strict` on this phase exits clean.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **The append firing is observed post-truncation, the pre-truncation fire is inferred from the code.** The harness measures what reaches the reader, which is zero appended rows on the legacy path and no append-stage run on the prod path. That the append stages do fire inside `enrichFusedResults` before token-budget truncation strips them is read from the code structure (the C3 and C4 stages run unconditionally inside `enrichFusedResults`), not directly observed, because the fusion-stage intermediate is not exported for measurement.
- **One labeled set, one corpus snapshot.** The recall numbers are measured on 8 labeled multi-target queries (24 resolved target ids) against one read-only corpus backup. They establish that the prod path is byte-identical off vs on and returns ten results, but the precise recall rates would shift with a different query mix or a re-indexed corpus.
- **The refinement is designed, not measured.** Whether moving the appends into Stage-3 ahead of token-budget truncation and exempting appended rows actually lifts completeRecall@K is the question the follow-up benchmark would answer. This phase establishes that the appends cannot help as currently wired and names the change, it does not measure the changed path.
- **The token budget is content-dependent.** The legacy path truncated to three because every labeled query's content overflowed the token budget. A query whose recalled docs are token-cheap could return more than three on the legacy path, so the three-result legacy count is a property of these queries' content size, not a fixed cap.
<!-- /ANCHOR:limitations -->
