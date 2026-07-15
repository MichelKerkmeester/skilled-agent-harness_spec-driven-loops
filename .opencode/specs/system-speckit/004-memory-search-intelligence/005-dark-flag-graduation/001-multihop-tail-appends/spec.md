---
title: "Spec: Multi-Hop Tail-Appends Benchmark"
description: "Benchmarks the two default-off search tail-append features SPECKIT_DETERMINISTIC_MULTIHOP and SPECKIT_LANE_CHAMPION_BACKFILL against the live corpus on the production path, and resolves the documented three-result-floor blocker with data. The harness measures completeRecall@K for K of 3, 5 and 8 with appends-on vs appends-off over a labeled multi-target query set whose answers span sibling and cross-referenced spec folders, against a read-only backup of the live memory corpus on the nomic-embed-text-v1.5 embedder. The data shows the appends never run on the production executePipeline path because the Stage-1 collectRawCandidates uses stopAfterFusion which skips the enrichFusedResults branch the append stages live in, so flipping the flags is byte-identical on prod and recall is unchanged. The three-result floor is a never-cut-below-three minimum not a cap, the prod path returns the full requested limit of ten, and the real prod-limiting stage is token-budget truncation which trims the tail to the floor and strips appended rows even on the legacy path where they run. Verdict REFINE: the features are sound and byte-identical-when-off but unreachable as wired, and the refinement that would reach the prod reader requires touching shared pipeline code and is designed here for a follow-up."
trigger_phrases:
  - "multihop tail appends benchmark"
  - "deterministic multihop recall"
  - "lane champion backfill recall"
  - "three result floor blocker"
  - "tail append prod path reach"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/005-dark-flag-graduation/001-multihop-tail-appends"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Built the recall harness, ran it on the prod and legacy paths, authored the REFINE verdict"
    next_safe_action: "Phase complete, verdict lives in benchmark-results.md and implementation-summary.md"
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
# Spec: Multi-Hop Tail-Appends Benchmark

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-24 |
| **Branch** | `system-speckit/004-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Successor** | ../002-retrieval-class-weights/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Two finished search features ship dark behind default-off flags with no measured verdict. `SPECKIT_DETERMINISTIC_MULTIHOP` parses the sibling and cross-reference folder slugs a hub doc writes in its own prose, resolves each 1:1 to a unique spec folder, and appends that folder's spec.md to the result tail with no LLM and no re-embedding. `SPECKIT_LANE_CHAMPION_BACKFILL` appends each base lane's top candidate that missed the fused top-K into empty tail slots, reusing the per-lane arrays the pipeline already populated with no new query. Both are tail-only and byte-identical when off, and both claim to lift multi-target recall by extending it into otherwise-empty tail.

A specific myth gates them. The `ENV_REFERENCE` holds each off because "the prod default route truncates to a 3-result floor, so a tail-additive append never reaches the prod reader." The packet's own `003-spec-data-quality/benchmark-and-test-status.md` contradicts that: `DEFAULT_MIN_RESULTS = 3` is a never-cut-below-three floor guarantee not a cap, the route returns up to the caller's limit, and the real prod-limiting stage is token-budget truncation. So the held-off reasoning is a hypothesis to test on the production path with data, not a settled fact.

### Purpose
Measure whether these two tail-appends lift multi-target recall on the production search path, and resolve the floor-blocker question with data. Build a labeled multi-target query set whose correct answer spans sibling or cross-referenced spec folders, measure completeRecall@K for K of 3, 5 and 8 with appends-on vs appends-off on the production path against a read-only corpus backup, verify default-off byte-identity, and return a GRADUATE, REFINE or CUT verdict grounded strictly in the measured numbers. State plainly whether the documented three-result floor blocks the appends, and if not, name the stage that does.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A self-contained benchmark harness under this phase's `scripts/` that imports the production search code and measures completeRecall@K with the two append flags off and on
- A labeled multi-target query set whose targets are the indexed spec.md ids of the sibling folders a hub doc cross-references, re-resolved against the corpus each run so a stale label is reported not silently scored
- Measurement on the production `executePipeline` path that the live `memory_search` MCP handler calls, and on the legacy `searchWithFallback` path that actually runs the append stages, so the verdict distinguishes "would help if reachable" from "is unreachable"
- A structural rewire, gated behind the same default-off flags, that wires the two append stages into the production pipeline as a post-Stage-4 tail-append step so the appends reach the prod reader, and a re-benchmark of it
- A default-off strict-no-op check on the prod path, confirming the tail-append stage does not run with both flags off and the output is byte-unchanged from before the rewire
- A direct read of the floor and truncation behavior, recording the prod result count, the append-stage application metadata and the token-budget truncation that trims the legacy tail
- A GRADUATE, REFINE or CUT verdict grounded in the measured prod-path recall and the default-off byte-identity

### Out of Scope
- Flipping either flag to default-on. No production default is changed. The rewire ships behind the existing default-off flags, and the flip is a separate evidence-gated decision
- Editing the `memory_search` handler or any file outside the `lib/search` pipeline and the two append modules. The handler is owned by a sibling phase
- A reindex of the corpus. The harness reads a read-only backup as-is
- The other six dark-flag clusters in the 007 suite. Each is its own phase

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| lib/search/pipeline/types.ts | Modify | Add the lane-list shadow helpers, the LaneCandidateList type and the optional tailAppends result metadata |
| lib/search/hybrid-search.ts | Modify | Attach the base-lane lists to the collectRawCandidates result as a flag-gated non-enumerable shadow, and factor the base-lane set into a module constant |
| lib/search/pipeline/stage1-candidate-gen.ts | Modify | Capture the per-lane shadow before the merge and filter steps drop it, and re-attach it to the Stage-1 output |
| lib/search/pipeline/orchestrator.ts | Modify | Run the flag-gated tail-append stage after Stage 4, extending the capped baseline past the limit |
| scripts/multihop-tail-appends-benchmark.mjs | Create | The recall harness over the labeled multi-target query set on the prod and legacy paths |
| results/metrics.json | Create | The per-query and aggregate completeRecall@K rollup with the floor-blocker finding and the rewire numbers |
| benchmark-results.md | Create | The full data tables and the GRADUATE-for-deep-K verdict |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The benchmark measures completeRecall@K on the production `executePipeline` path with appends off and on | metrics.json reports prodRecallOff and prodRecallOn for K of 3, 5, 8, 12 and 20 over the labeled set |
| REQ-002 | Default-off byte-identity is verified on the prod path after the rewire | metrics.json reports prodFlagOffStrictNoOp true, the tail-append stage not running with both flags off, no appended-source row, and deterministic off output |
| REQ-003 | The floor-blocker hypothesis is resolved with data | metrics.json records the prod result count, the prod append-stage application metadata, the legacy surviving-append count, and a resolution stating whether the three-result floor blocks the appends |
| REQ-004 | The phase returns one of GRADUATE, REFINE or CUT with evidence | benchmark-results.md states the verdict and the one-line reason, every claim traced to a measured number |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The harness is reproducible and reads the corpus read-only | `node scripts/multihop-tail-appends-benchmark.mjs` rebuilds metrics.json from a read-only backup, exit 0, no write to the live database |
| REQ-006 | Where the verdict is REFINE, the named code change is designed | benchmark-results.md and implementation-summary.md name the change that would make the appends reach the prod reader, left for a follow-up because it touches shared pipeline code |
| REQ-007 | Every verdict claim traces to a measured number | benchmark-results.md and implementation-summary.md cite values present in metrics.json |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A runnable recall benchmark that measures completeRecall@K for K of 3, 5, 8, 12 and 20 with the two append flags off and on, on the production path against a read-only corpus backup
- **SC-002**: A data-resolved answer to the floor-blocker question, showing the three-result floor is a minimum not a cap and naming the structural reason the appends were unreachable
- **SC-003**: A structural rewire behind the default-off flags that makes the appends reach the prod reader, with default-off proven a strict no-op and the prod-path recall lift measured
- **SC-004**: A GRADUATE, REFINE or CUT verdict for the two features grounded strictly in the measured recall and the default-off byte-identity numbers
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A recall win measured on an unforced eval path vanishes on the truncation-active prod path | An eval-only artifact mistaken for a prod keep | The benchmark measures the production `executePipeline` path that the live handler calls, with truncation active, so a number proves a prod-path keep |
| Risk | The harness mutates the live corpus | A benchmark cell writes the production database | The harness backs the database and the active vector shard up read-only to a temporary eval copy and runs every search against the copy, never opening the source for writes |
| Risk | A stale target label inflates or deflates recall | A folder that no longer resolves 1:1 to one indexed spec.md silently scores wrong | Each target folder is re-resolved against the corpus each run, and a folder that resolves to zero or many spec.md rows is reported as unresolved not scored |
| Dependency | The production `executePipeline`, `searchWithFallback`, the two append modules and the two flag readers | Internal | The harness imports them from the built dist and flips only the two flags, so it measures the shipped code |
| Dependency | The `nomic-embed-text-v1.5` embedder and the read-only corpus backup | Internal | The harness reads the active embedder from the backup metadata and embeds each query once, so it scores against the live corpus state |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The harness embeds each query once and reuses the embedding across the prod and legacy runs and the repeats, so the embedder cost is one call per query not one per measurement
- **NFR-P02**: The benchmark requests the prod default limit of ten rather than a widened eval window, so the measured recall reflects what the live handler returns

### Security
- **NFR-S01**: The harness reads a read-only corpus backup and the active vector shard backup and issues no write, so no benchmark cell mutates the live memory database
- **NFR-S02**: The harness flips only `SPECKIT_DETERMINISTIC_MULTIHOP` and `SPECKIT_LANE_CHAMPION_BACKFILL` in-process and restores them off after each measurement, so no other results-affecting default is touched

### Reliability
- **NFR-R01**: Each measurement repeats three times and the harness reports the run-to-run stdev, so a recall delta is read against real jitter rather than assumed deterministic
- **NFR-R02**: A target folder that fails to resolve 1:1 to one indexed spec.md is reported as unresolved, so the recall denominator counts only labels the corpus can actually return
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- The prod path returns the full requested limit of ten when the content fits the token budget, so a tail contribution past rank three has room to land and the three-result number is a floor not a ceiling
- The legacy path overflows the token budget on every labeled query and truncates to the three-result floor, so a tail-appended row scored below the baseline is the first cut
- A query whose target set resolves to a single spec.md reads completeRecall as a 0-or-1 hit, recorded honestly rather than averaged away

### Error Scenarios
- The append stages never run on the prod path, so the prod append-stage metadata is absent and flipping the flags is byte-identical, which the harness records as the structural cause of the unchanged recall
- The legacy path runs the append stages but token-budget truncation strips every appended row before the reader, so the surviving-append count is zero, which the harness records as the truncation cause on the path where the appends do run

### State Transitions
- Flag off to on, prod path: the result ids are byte-identical because the append stages are never reached, so the transition is a no-op on the production path
- Flag off to on, legacy path: the append stages run and add tail candidates, but the downstream token-budget truncation returns the same three-result floor, so the reader sees no change there either
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One self-contained harness plus the results and the verdict docs, no production edit |
| Risk | 5/25 | Read-only corpus backup, flips only the two flags under test, no default changed |
| Research | 18/20 | A labeled multi-target recall benchmark on two production paths with byte-identity and a data-resolved floor-blocker finding |
| **Total** | **31/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Whether the refinement that wires the appends into the prod path should position them inside the pipeline Stage-3 rerank ahead of token-budget truncation, or whether the appended tail rows should be exempted from token truncation entirely, since both land outside this phase's write scope and are designed for a follow-up
- Whether the legacy `searchWithFallback` path that still runs the append stages should be retired now that the production reader is `executePipeline`, since the append code is reachable only on a path the live handler no longer calls
<!-- /ANCHOR:questions -->
