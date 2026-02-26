---
title: "Tasks: Sprint 2 — Scoring Calibration"
description: "Task breakdown for Sprint 2: embedding cache, cold-start boost, G2 investigation, score normalization"
trigger_phrases:
  - "sprint 2 tasks"
  - "scoring calibration tasks"
  - "embedding cache tasks"
importance_tier: "important"
contextType: "implementation"
---
# Tasks: Sprint 2 — Scoring Calibration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
| `[GATE]` | Sprint exit gate |

**Task Format**: `T### [P?] Description (file path) [effort] {dependencies} — Requirement`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Embedding Cache (R18)

- [ ] T001 [P] Create `embedding_cache` table with migration — schema: `content_hash TEXT, model_id TEXT, embedding BLOB, dimensions INT, created_at TEXT, last_used_at TEXT, PRIMARY KEY (content_hash, model_id)` [8-12h] — R18 (REQ-S2-001)
  - [ ] T001a Create table migration with backup protocol
  - [ ] T001b Implement cache lookup logic in embedding pipeline
  - [ ] T001c Implement cache store logic on embedding generation
  - [ ] T001d Add `last_used_at` update for cache eviction support
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Cold-Start Boost (N4)

- [ ] T002 [P] Implement cold-start boost with exponential decay behind `SPECKIT_NOVELTY_BOOST` flag (`composite-scoring.ts`) [3-5h] — N4 (REQ-S2-002)
  - Formula: `boost = 0.15 * exp(-elapsed_hours / 12)`
  - Applied BEFORE FSRS temporal decay
  - Combined score cap at 0.95
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: G2 Investigation + Normalization

- [ ] T003 [P] Investigate double intent weighting — trace intent weight application through full pipeline (`hybrid-search.ts`) [4-6h] — G2 (REQ-S2-003)
  - [ ] T003a Identify all locations where intent weights are applied
  - [ ] T003b Determine: bug or intentional design
  - [ ] T003c If bug: fix. If intentional: document rationale
- [ ] T004 Implement score normalization — both RRF and composite to [0,1] range (`rrf-fusion.ts`, `composite-scoring.ts`) [4-6h] {T003} — Calibration (REQ-S2-004)
  - Note: Normalization approach may depend on G2 outcome
- [ ] T004a [P] Investigate RRF K-value sensitivity — grid search K ∈ {20, 40, 60, 80, 100}, measure MRR@5 delta per value [2-3h] {T004} — Calibration (REQ-S2-005)
- [ ] T005 [P] Implement interference scoring — add `interference_score` column to `memory_index` (migration), compute at index time by counting memories with cosine similarity > 0.75 in same `spec_folder`, apply as `-0.08 * interference_score` in `composite-scoring.ts` behind `SPECKIT_INTERFERENCE_SCORE` flag [4-6h] — TM-01 (REQ-S2-006)
- [ ] T006 [P] Implement classification-based decay in `fsrs-scheduler.ts` — decay policy multipliers by `context_type` (decisions: no decay, research: 2x stability, implementation/discovery/general: standard) and `importance_tier` (constitutional/critical: no decay, important: 1.5x, normal: standard, temporary: 0.5x) [3-5h] — TM-03 (REQ-S2-007)
<!-- /ANCHOR:phase-3 -->

---

## Phase 5 (PI-A1): Folder-Level Relevance Scoring via DocScore Aggregation

- [ ] T009 [P] Implement folder-level relevance scoring in reranker — compute `FolderScore(F) = (1/sqrt(M+1)) * SUM(MemoryScore(m))` by grouping normalized memory scores by `spec_folder`; expose FolderScore as metadata on each search result; implement two-phase retrieval path (top-K folders by FolderScore then within-folder search) [4-8h] {T004} — PI-A1
  - Formula: `FolderScore = (1 / sqrt(M + 1)) * SUM(MemoryScore(m) for m in folder F)` where M = memory count in F
  - Damping factor `1/sqrt(M+1)` is mandatory — prevents large folders from dominating by volume
  - Pure scoring addition to existing reranker — no schema changes, no new tables
  - Requires [0,1]-normalized MemoryScore values from score normalization (T004) to be meaningful
  - Extends R-006 (weight rebalancing surface) and R-007 (post-reranker stage in scoring pipeline)

## Phase 4: Verification

- [ ] T007 Verify dark-run results for N4 and normalization — new memories visible, old not displaced, MRR@5 not regressed [included] {T002, T004}
- [ ] T008 [GATE] Sprint 2 exit gate verification [0h] {T001, T002, T003, T004, T004a, T005, T006, T007}
  - [ ] R18 cache hit >90% on unchanged content re-index
  - [ ] N4 dark-run passes
  - [ ] G2 resolved: fixed or documented as intentional
  - [ ] Score distributions normalized to [0,1]
  - [ ] RRF K-value investigation completed; optimal K documented
  - [ ] TM-01 interference penalty active; high-similarity cluster scores reduced; no false penalties
  - [ ] TM-03 classification-based decay verified — constitutional/critical memories not decaying; temporary memories decaying faster

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks T001-T008 (including T004a, T005, T006) marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Sprint 2 exit gate (T006) passed
- [ ] 8-12 new tests added and passing
- [ ] 158+ existing tests still passing
- [ ] Feature flag `SPECKIT_NOVELTY_BOOST` enabled (or decision to keep disabled documented)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Tasks**: See `../tasks.md`
- **Predecessor Tasks**: See `../002-sprint-1-graph-signal-activation/tasks.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS — Phase 3 of 8
- 7 tasks across 4 phases (T001-T006 + T004a)
- T001-T003: Parallelizable (R18, N4, G2 are independent)
- T004: Depends on T003 (G2 outcome influences normalization)
- T004a: Depends on T004 (RRF K-value sensitivity investigation)
- T005-T006: Verification + exit gate
-->
