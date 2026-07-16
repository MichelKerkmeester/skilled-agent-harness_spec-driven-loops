---
title: "Implementation Plan: Multi-Hop Tail-Appends Benchmark"
description: "Builds a self-contained recall harness that imports the production search code and measures completeRecall@K for K of 3, 5 and 8 with SPECKIT_DETERMINISTIC_MULTIHOP and SPECKIT_LANE_CHAMPION_BACKFILL off and on, over a labeled multi-target query set whose answers span sibling spec folders, against a read-only corpus backup on nomic-embed-text-v1.5. The harness measures the production executePipeline path the live memory_search handler calls and the legacy searchWithFallback path that actually runs the append stages, captures the prod result count, the append-stage application metadata and the token-budget truncation, and verifies default-off byte-identity on the prod path. The plan rejects benchmarking only the legacy enrichFusedResults path because the live reader is executePipeline, and rejects editing the shared pipeline to make the appends reachable because that touches code outside this phase's write scope and is designed as a follow-up instead."
trigger_phrases:
  - "multihop tail appends benchmark"
  - "completeRecall at K append flags"
  - "prod path vs legacy enrichFusedResults"
  - "token budget truncation floor"
  - "tail append harness plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/004-dark-flag-graduation/001-multihop-tail-appends"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the harness and ran it on both paths, matrix complete"
    next_safe_action: "Author the results tables and the verdict"
    blockers: []
    key_files:
      - "scripts/multihop-tail-appends-benchmark.mjs"
      - "results/metrics.json"
      - "benchmark-results.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Multi-Hop Tail-Appends Benchmark

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | A Node ESM `.mjs` benchmark script importing the built TypeScript search library |
| **Framework** | In-process `executePipeline` and `searchWithFallback` against a read-only corpus backup, `nomic-embed-text-v1.5` embedder |
| **Storage** | A read-only database backup, a read-only active vector shard backup, and a single metrics.json rollup |
| **Testing** | A reproducible harness run, exit 0, and a default-off byte-identity check on the prod path |

### Overview
This phase measures whether the two tail-append features lift multi-target recall on the production path and resolves the documented three-result-floor blocker with data. The harness backs the live database and its active vector shard up read-only to a temporary eval copy, points the runtime at the copy, and embeds a labeled multi-target query set once per query. For each query it runs the production `executePipeline` path with both append flags off and on, and the legacy `searchWithFallback` path with both off and on, repeating each measurement to expose run-to-run variance. It computes completeRecall@K for K of 3, 5 and 8 as the fraction of the query's resolved target spec.md ids present in the top-K results, verifies the prod result ids are byte-identical off vs on, and records the prod result count, the append-stage application metadata, the legacy surviving-append count, and the token-budget truncation. Benchmarking only the legacy path was rejected because the live reader is `executePipeline`, and editing the shared pipeline to make the appends reachable was rejected because it touches code outside this phase's write scope and is designed as a follow-up instead.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One read-only harness over two production entry points. The harness imports the built search code, flips only the two append flags, and measures the same labeled query set on the production `executePipeline` path and the legacy `searchWithFallback` path. The prod path is the function the live `memory_search` MCP handler calls. Its Stage-1 candidate generation runs `collectRawCandidates`, which executes the fusion plan with `stopAfterFusion` set, so it returns the fused set without entering `enrichFusedResults`. The append stages C3 and C4 live inside `enrichFusedResults`, so the prod path never runs them. The legacy path calls `enrichFusedResults` and therefore runs the append stages, which makes it the path that shows whether the appends help when they are reached and whether downstream truncation strips them.

### Key Components
- **`scripts/multihop-tail-appends-benchmark.mjs`**: the harness. It resolves the live database path from config, backs the database and the active vector shard up read-only to a temporary eval copy, embeds each labeled query once, runs the prod and legacy paths under both flag postures with repeats, computes completeRecall@K, verifies prod byte-identity, and writes `results/metrics.json`.
- **The labeled multi-target query set**: each query targets a hub spec doc that names sibling folders in its prose. The target set is the indexed spec.md id of each named sibling that resolves 1:1 to a unique folder, re-resolved against the corpus each run.
- **`results/metrics.json`**: the per-query and aggregate rollup, carrying the recall profiles, the byte-identity verdict, the append-stage metadata, the result counts, and the floor-blocker resolution.

### Data Flow
The harness reads `DATABASE_PATH` from config, backs the database and the active vector shard up to a temporary copy, and points `MEMORY_DB_PATH` at the copy. It initializes the vector index against the copy, attaches the shard, and wires the hybrid search. For each labeled query it generates the embedding once, then for each repeat it runs `executePipeline` off and on and `searchWithFallback` off and on, restoring the flags off after each. It scores completeRecall@K against the resolved target ids, captures the prod append-stage metadata from `metadata.stage3`, captures the legacy surviving-append count by source tag, and writes the aggregate and per-query rows to `results/metrics.json`, the single source for the data tables and the verdict.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase is a benchmark, not a fix. It edits no shared production code. The surfaces below are imported read-only by the harness and listed so the reader can audit what the benchmark measures and confirm the no-edit boundary.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/search/deterministic-multihop.ts` | The multi-hop tail-append module | imported and exercised through the flag, never edited | the harness flips `SPECKIT_DETERMINISTIC_MULTIHOP` and reads the result, the file is unchanged |
| `lib/search/lane-champion-backfill.ts` | The lane champion backfill module | imported and exercised through the flag, never edited | the harness flips `SPECKIT_LANE_CHAMPION_BACKFILL` and reads the result, the file is unchanged |
| `lib/search/hybrid-search.ts` | Holds the append stages C3 and C4 inside `enrichFusedResults` and the `stopAfterFusion` Stage-1 path | imported through `searchWithFallback`, never edited | the harness calls `searchWithFallback` and `init`, the file is unchanged |
| `lib/search/pipeline/index.js` | Exports the production `executePipeline` | imported and called, never edited | the harness calls `executePipeline`, the file is unchanged |

Required inventories:
- Same-class producers: `rg -n 'applyDeterministicMultihop|applyLaneChampionBackfill' lib/search`.
- Consumers of the appends: `enrichFusedResults` in `hybrid-search.ts` runs the C3 and C4 stages, reached by `searchWithFallback` but not by the pipeline's `collectRawCandidates` which sets `stopAfterFusion`.
- Matrix axes: a labeled multi-target query set across the production `executePipeline` path and the legacy `searchWithFallback` path, each scored with both append flags off and both on, repeated to expose variance.
- Algorithm invariant: with the flags off the prod and legacy outputs are byte-identical to the flags-on outputs because the appends are either never reached on prod or stripped by token-budget truncation on legacy, so the reader sees no change either way.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Trace the production reader from the `memory_search` MCP handler through `executePipeline` to confirm the live entry point
- [x] Confirm the append stages C3 and C4 live in `enrichFusedResults` and that the pipeline Stage-1 `collectRawCandidates` sets `stopAfterFusion`, so the prod path never runs them
- [x] Build the labeled multi-target query set from hub docs that cross-reference sibling folders, resolving each target to its indexed spec.md id

### Phase 2: Core Implementation
- [x] Write the harness with the read-only backup of the database and the active vector shard
- [x] Measure completeRecall@K for K of 3, 5 and 8 on the prod `executePipeline` path with both append flags off and on, with repeats
- [x] Measure the same on the legacy `searchWithFallback` path that runs the append stages
- [x] Capture the prod result count, the append-stage application metadata, the legacy surviving-append count, and the prod byte-identity check, and write `results/metrics.json`

### Phase 3: Verification
- [x] Confirm the harness runs reproducibly from a read-only backup, exit 0, no write to the live database
- [x] Confirm the prod path returns the full requested limit and is byte-identical off vs on, resolving the floor-blocker question with data
- [x] Author the results tables and the GRADUATE, REFINE or CUT verdict grounded strictly in metrics.json
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Integration | The harness runs both production paths against the read-only corpus backup and produces metrics.json | `node scripts/multihop-tail-appends-benchmark.mjs`, exit 0 |
| Invariant | The prod path output is byte-identical with both append flags off and both on | the prodByteIdenticalOnVsOff field in metrics.json, true across repeats |
| Manual | Spot-check that the prod path returns the full requested limit and that the legacy path truncates to the three-result floor | reading the resultCounts rows in metrics.json |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The production `executePipeline` and the legacy `searchWithFallback` | Internal | Green | The harness cannot measure the prod path or the append-running path without them |
| The two append modules and the two flag readers | Internal | Green | The harness cannot toggle the features without the flags |
| The `nomic-embed-text-v1.5` embedder | Internal | Green | The harness cannot embed the queries or score recall without it |
| The labeled multi-target query set and the read-only corpus backup | Internal | Green | The harness cannot measure recall without the labels and the corpus |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The benchmark is unsound or the phase is abandoned.
- **Procedure**: Delete this phase folder. It edits no shared production code and changes no default, so removing the harness and the results leaves the production search behavior untouched.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Med | 2-3 hours |
| Core Implementation | Med | 2-3 hours |
| Verification | Low | 1-2 hours |
| **Total** | | **5-8 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] The harness reads a read-only corpus backup and the active vector shard backup and issues no write
- [x] The harness flips only the two append flags and restores them off after each measurement
- [x] No shared production code is edited and no default is changed

### Rollback Procedure
1. Delete this phase folder to remove the harness and the results
2. Confirm `SPECKIT_DETERMINISTIC_MULTIHOP` and `SPECKIT_LANE_CHAMPION_BACKFILL` remain default-off, which is the unchanged production state
3. Confirm the shared search code is untouched, since the harness only imported and read it

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the harness reads a corpus backup without writing it, so there is no data to reverse
<!-- /ANCHOR:enhanced-rollback -->

---
