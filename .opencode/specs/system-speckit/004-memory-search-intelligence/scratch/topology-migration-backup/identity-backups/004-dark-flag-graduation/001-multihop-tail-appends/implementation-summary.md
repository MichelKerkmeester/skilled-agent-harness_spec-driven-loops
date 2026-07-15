---
title: "Implementation Summary"
description: "Status COMPLETE. Benchmarked the two default-off tail-append features on the production path, diagnosed why they were unreachable, shipped the structural rewire that reaches the prod reader behind the same default-off flags, and re-benchmarked it. Diagnosis: the appends never ran on the prod executePipeline path because Stage-1 stopAfterFusion skipped the branch they lived in, and the three-result floor was a never-cut-below-three minimum not a cap. Refinement: a post-Stage-4 tail-append stage in the orchestrator that extends the capped baseline past the requested limit so an appended row is exempt from the final-limit cap, plus the per-lane shadow plumbing the backfill needs, all gated behind SPECKIT_DETERMINISTIC_MULTIHOP and SPECKIT_LANE_CHAMPION_BACKFILL. After the rewire completeRecall@20 rises from 0.5625 to 0.9375 (84 rows appended across 8 queries) and completeRecall@12 from 0.5625 to 0.625, while completeRecall@3, @5 and @8 stay flat because the appends extend the tail and never evict a baseline hit. Default-off is a proven strict no-op, tsc clean, 25 pipeline and flag tests plus 10 additive-tail-recall tests pass. Verdict GRADUATE for deep-K readers."
trigger_phrases:
  - "multihop tail appends rewire"
  - "tail append GRADUATE verdict deep-K"
  - "post stage4 tail append stage"
  - "lane lists shadow pipeline plumbing"
  - "default off byte identity tail append"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/004-dark-flag-graduation/001-multihop-tail-appends"
    last_updated_at: "2026-07-06T18:49:58.292Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped the tail-append rewire and re-benchmarked, GRADUATE for deep-K"
    next_safe_action: "Phase complete, a separate decision flips the flags on for deep-K readers"
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
| **Branch** | `system-speckit/004-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A benchmark, a diagnosis, a structural rewire, and a re-benchmark for the two default-off tail-append features. `SPECKIT_DETERMINISTIC_MULTIHOP` appends a hub doc's cross-referenced sibling spec.md docs to the result tail with no LLM and no re-embedding. `SPECKIT_LANE_CHAMPION_BACKFILL` appends each base lane's top candidate that missed the fused top-K into empty tail slots with no new query.

**The diagnosis.** The first benchmark proved the appends never ran on the production `executePipeline` path. The prod output was byte-identical with the flags off and on, and the pipeline carried no append metadata, because the pipeline's Stage-1 `collectRawCandidates` runs the fusion plan with `stopAfterFusion`, which returns the fused set without entering `enrichFusedResults`, the legacy branch the appends lived in. The floor-blocker myth broke with data: the prod path returns the full requested limit of ten, so `DEFAULT_MIN_RESULTS = 3` is a never-cut-below-three minimum not a cap, and the token-budget truncation the `ENV_REFERENCE` blamed lives only on the legacy path.

**The rewire.** A tail-append stage now runs in the orchestrator after Stage 4 and after the Stage-4 final-limit cap, gated behind the same two default-off flags. Because it runs past the cap, the appended rows extend the capped baseline rather than competing for a slot inside it, so an appended row is exempt from the cap and reaches the reader. The deterministic-multihop append reads the post-Stage-4 results and the database. The lane-champion backfill needs each base lane's ranked candidates, which the fused list blends away, so candidate generation now carries the per-lane lists forward on a non-enumerable shadow attached only when an append flag is on. The two append modules are unchanged, reused as-is.

**The re-benchmark, every number from `results/metrics.json`.** The appends now run on the prod path (the append stage applied, 84 rows appended across the 8 labeled queries) and lift completeRecall@20 from 0.5625 to 0.9375, a 0.375 gain with zero run-to-run variance, and completeRecall@12 from 0.5625 to 0.625. completeRecall@3, @5 and @8 stay flat at 0.4375 because the appended rows land past rank ten, so the baseline top-K is never disturbed and no baseline hit is evicted. Seven of eight queries reach perfect completeRecall@20 with the appends on, the starkest being `compact-code-graph-hooks` whose four sibling targets the baseline never recalled (recall@20 0.00) and the multi-hop append brings all four in (recall@20 1.00).

**Default-off byte-identity, proven.** With both flags off the tail-append stage does not run: no `tailAppends` metadata is emitted, no appended-source row appears, the result count stays at or below the limit, and the off output is deterministic across repeats. The flags-off prod path is byte-unchanged from before the rewire, confirmed by the off-path completeRecall holding at the pre-rewire 0.4375 at K of 3, 5 and 8. tsc is clean, and the 25 pipeline and flag regression tests plus the 10 additive-tail-recall tests pass.

**Verdict: GRADUATE for deep-K readers.** The rewire delivers a measured, variance-free recall win on the production path with byte-identical default-off safety. The win is real and large for a reader that consumes the tail past rank ten (completeRecall@20 0.5625 to 0.9375), and it is correctly a no-op for a reader that reads only the top eight, because the appends never evict a baseline hit. The honest graduation is conditional on the reader window: graduate the flags as a tail recall extension for deep-K consumers, where the prod-path gain is unambiguous, and recognize that they add nothing a shallow-K reader sees. This supersedes the earlier REFINE verdict, which was correct before the appends were reachable.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The rewire touches four `lib/search` pipeline files and the two append modules' shared lane constant, all within the phase's write scope, and does not touch the `memory_search` handler. `pipeline/types.ts` adds the `LaneCandidateList` type and the `attachLaneLists` and `readLaneLists` shadow helpers, plus the optional `tailAppends` field on `PipelineResult.metadata`. `hybrid-search.ts` attaches the base-lane lists to the `collectRawCandidates` result as a non-enumerable shadow when an append flag is on, and factors the base-lane set into a shared module constant. `pipeline/stage1-candidate-gen.ts` captures the per-lane shadow before the merge and filter steps drop it, and re-attaches it to the Stage-1 output. `pipeline/orchestrator.ts` reads the per-lane lists after Stage 1, then after Stage 4 runs the tail-append stage in a non-fatal try block: deterministic-multihop then lane-champion backfill, each gated behind its flag, extending the capped baseline and recording the outcome in `metadata.tailAppends`. The harness in `scripts/multihop-tail-appends-benchmark.mjs` measures completeRecall@K for K of 3, 5, 8, 12 and 20 on the prod path off and on, verifies the flag-off strict no-op, and writes `results/metrics.json` from a read-only corpus backup.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Append after Stage 4, past the final-limit cap, not before it.** Running the appends after the cap makes them a pure tail extension that the cap cannot trim, which is the literal meaning of exempting the appended rows from truncation and the cleanest way to keep the baseline top-K byte-identical.
- **Carry the per-lane lists on a non-enumerable shadow, gated by the flags.** The lane-champion backfill needs each base lane's candidates, which the fused list blends away. A non-enumerable shadow attached only when an append flag is on carries them forward without widening `PipelineRow` and without changing the flags-off array, mirroring the shadow-metadata pattern the fusion stage already uses.
- **Reuse the append modules unchanged.** The deterministic-multihop and lane-champion modules already implement the additive-tail, never-evict, dedup-against-baseline contract, so the rewire wires them into the pipeline rather than reimplementing them, and the 10 additive-tail-recall tests confirm the behavior is unchanged.
- **GRADUATE conditional on the reader window, stated plainly.** The win is at K past ten and absent at K of eight or below, so the verdict names the condition rather than claiming an unconditional graduation the shallow-K numbers do not support.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- `node scripts/multihop-tail-appends-benchmark.mjs` runs against a read-only corpus backup and rebuilds `results/metrics.json`, exit 0, no write to the live database.
- The prod path completeRecall@20 rises from 0.5625 off to 0.9375 on and completeRecall@12 from 0.5625 to 0.625, with 84 rows appended and zero run-to-run variance.
- completeRecall@3, @5 and @8 are unchanged at 0.4375 off and on, confirming the appends never evict a baseline top-K hit.
- The flag-off strict no-op holds on every off run: no `tailAppends` metadata, no appended-source row, deterministic output that matches the pre-rewire numbers.
- tsc is clean, and the 25 pipeline and flag regression tests plus the 10 additive-tail-recall tests pass.
- `validate.sh --strict` on this phase exits clean.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **The win is at deep K only.** The appends lift completeRecall at K of 12 and 20 and leave K of 3, 5 and 8 unchanged, because the appended rows are scored below every baseline hit by design and so fill the tail rather than the top. A reader that consumes only the top eight sees no benefit. Lifting a sibling into the top window would require rescoring it on its own merit, which the additive-tail contract forbids and which is a separate ranking question.
- **One labeled set, one corpus snapshot.** The recall numbers are measured on 8 labeled multi-target queries (24 resolved target ids) against one read-only corpus backup. They establish the prod-path lift and the byte-identical default-off safety, but the precise rates would shift with a different query mix or a re-indexed corpus.
- **The lane-list shadow covers the hybrid candidate paths.** The per-lane shadow is captured on the standard, deep-expansion, and embedding-expansion hybrid paths. A pure vector or lexical-only candidate path leaves no base-lane lists, so the lane-champion backfill finds nothing to add there, which is correct rather than a defect because those paths have no multi-lane disagreement to backfill.
- **The flag flip is a separate decision.** This phase ships the rewire behind the default-off flags and recommends graduation for deep-K readers. Flipping the defaults on, and deciding the reader window that consumes the appended tail, is the follow-up decision the verdict feeds, not an action taken here.
<!-- /ANCHOR:limitations -->
