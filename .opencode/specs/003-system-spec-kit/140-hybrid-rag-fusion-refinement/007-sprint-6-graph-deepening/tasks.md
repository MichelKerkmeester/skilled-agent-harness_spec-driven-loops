---
title: "Tasks: Sprint 6 — Graph Deepening"
description: "Task breakdown for Sprint 6: graph centrality, N3-lite consolidation, anchor-aware thinning, entity extraction, spec folder hierarchy"
trigger_phrases:
  - "sprint 6 tasks"
  - "graph deepening tasks"
  - "consolidation tasks"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Sprint 6 — Graph Deepening

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

**Task Format**: `T### [P?] Description [effort] {dependencies} — Requirement`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:checkpoint -->
## Safety Gate

- [ ] T-S6-PRE [GATE-PRE] Create checkpoint: `memory_checkpoint_create("pre-graph-mutations")` [0h] {} — Safety gate for N3-lite edge mutations

---

<!-- ANCHOR:phase-a -->
## Phase A: Graph (N2 + N3-lite)

- [ ] T001 Implement graph centrality + community detection — N2 items 4-6 [25-35h] — N2 (REQ-S6-004)
  > **ESTIMATION WARNING**: N2c listed at 12-15h; production-quality Louvain on SQLite requires 40-80h. Start with connected components (BFS, ~20 LOC) and escalate only if separation is insufficient.
  - T001a N2a: Graph Momentum (Temporal Degree Delta) — compute degree change over sliding 7-day window; surface memories with accelerating connectivity [8-12h]
    - Sub-steps: (1) Add `degree_snapshot` table to store daily degree counts. (2) Compute delta = current_degree - degree_7d_ago. (3) Surface top-N memories by delta magnitude.
    - Acceptance criteria: momentum score computed for all nodes with >=1 edge; top-10 most-connected recent memories identifiable.
  - T001b N2b: Causal Depth Signal — max-depth path from root memories; deeper = more derived; normalize by graph diameter [5-8h]
    - Sub-steps: (1) Identify root nodes (in-degree=0 in causal_edges). (2) BFS/DFS to compute max-depth for each node. (3) Normalize by graph diameter. (4) Expose as `causal_depth_score` field.
    - Acceptance criteria: causal_depth_score assigned to all nodes; root nodes score=0; leaf nodes score=1.0.
  - T001c N2c: Community Detection — identify memory clusters via connected components first, then Louvain if needed; boost intra-community recall [12-15h heuristic / 40-80h Louvain]
    - Algorithm references: Connected components — standard BFS, no library. Louvain — `igraph` (Python) or `graphology-communities-louvain` (npm). Export SQLite adjacency list to in-memory graph before running.
    - Sub-steps: (1) Export edge list from `causal_edges`. (2) Run connected-components BFS. (3) Evaluate cluster quality (avg cluster size, silhouette proxy). (4) Escalate to Louvain only if clusters are too coarse (avg size >50% of graph).
    - Acceptance criteria: community assignments stable across 2 consecutive runs on the same data (deterministic or jitter <5% membership change).
- [ ] T002 Implement N3-lite: contradiction scan + Hebbian strengthening + staleness detection with edge caps [10-15h] — N3-lite (REQ-S6-005)
  > **ESTIMATION WARNING**: ~40 LOC for contradiction scan assumes heuristic (cosine similarity + keyword conflict). Semantic accuracy >80% requires NLI model — effort 3-5x. Clarify threshold before implementing.
  - Contradiction scan: similarity >0.85, check conflicting conclusions (~40 LOC heuristic)
    - Sub-steps: (1) Candidate generation — cosine similarity >0.85 pair query. (2) Conflict check — keyword negation heuristic (contains "not", "never", contradicts prior claim). (3) Flag pair + surface cluster. (4) Write `contradiction_flag` to memory record.
    - Acceptance criteria: detects at least 1 known contradiction in curated test data (manually seeded pair).
  - Hebbian strengthening: +0.05 per validation cycle, MAX_STRENGTH_INCREASE=0.05, 30-day decay of 0.1 (~20 LOC)
  - Staleness detection: 90-day unfetched edges (~15 LOC)
  - Edge bounds: MAX_EDGES_PER_NODE=20, auto edges capped at strength=0.5, track `created_by`
  - Contradiction cluster surfacing: when contradiction detected (similarity >0.85), surface ALL cluster members (not just flagged pair) to agent for resolution (~25 LOC)
<!-- /ANCHOR:phase-a -->

---

<!-- ANCHOR:phase-b -->
## Phase B: Indexing + Spec-Kit (R7, R16, R10, S4)

- [ ] T003 [P] Implement anchor-aware chunk thinning [10-15h] — R7 (REQ-S6-001)
  - Sub-steps: (1) Parse anchor markers in indexed content. (2) Score chunks by anchor presence + content density. (3) Apply thinning threshold — drop chunks below score cutoff. (4) Run Recall@20 eval before/after.
  - Acceptance criteria: Recall@20 within 10% of pre-thinning baseline on eval query set.
- [ ] T004 [P] Implement encoding-intent capture behind `SPECKIT_ENCODING_INTENT` flag [5-8h] — R16 (REQ-S6-002)
  - Sub-steps: (1) Add `encoding_intent` field to memory index schema. (2) Classify intent at index time (code, prose, structured data). (3) Store alongside embedding. (4) Expose in retrieval metadata.
  - Acceptance criteria: `encoding_intent` field populated for all newly indexed memories when flag is enabled.
- [ ] T005 [P] Implement auto entity extraction (gated on density <1.0) behind `SPECKIT_AUTO_ENTITIES` flag [12-18h heuristic / 30-50h ML] — R10 (REQ-S6-003)
  > **ESTIMATION WARNING**: 12-18h assumes rule-based heuristics (noun-phrase extraction via `compromise` npm or `spaCy` if available). FP <20% is an ML challenge; escalate to fine-tuned NER only if heuristic FP >20% on sample review.
  - Sub-steps: (1) Measure current edge density (gate check). (2) Implement noun-phrase NER using rule-based library. (3) Tag extracted entities with `created_by='auto'`, strength=0.5. (4) Manual FP review on sample of >=50 entities. (5) Disable flag and remove auto-entities if FP >20%.
  - Algorithm references: Rule-based — `compromise` npm (lightweight, no model download). ML-based — `wink-nlp` or `node-nlp`. Python bridge — `spaCy` en_core_web_sm for higher accuracy.
  - Acceptance criteria: FP rate <20% verified on manual review of >=50 randomly sampled auto-extracted entities; all entities tagged `created_by='auto'`.
- [ ] T006 [P] Implement spec folder hierarchy as retrieval structure [6-10h] — S4 (REQ-S6-006)
  - Sub-steps: (1) Parse spec folder path from memory metadata. (2) Build in-memory hierarchy tree at query time (or cached). (3) Add hierarchy-aware traversal to `graph-search-fn.ts`. (4) Return parent/sibling memories as contextual results.
  - Acceptance criteria: hierarchy traversal returns parent-folder memories when queried from a child spec folder; functional in at least 1 integration test.
<!-- /ANCHOR:phase-b -->

---

<!-- ANCHOR:verification -->
## Verification

- [ ] T007 [GATE] Sprint 6 exit gate verification [0h] {T001, T002, T003, T004, T005, T006}
  - [ ] R7 Recall@20 within 10% of baseline
  - [ ] R10 FP rate <20% on manual review of >=50 entities (if implemented)
  - [ ] N2 graph channel attribution >10%
  - [ ] N2c community assignments stable across 2 runs
  - [ ] N3-lite contradiction scan identifies at least 1 known contradiction in curated test data
  - [ ] N3-lite edge bounds enforced (MAX_EDGES_PER_NODE=20, MAX_STRENGTH_INCREASE=0.05/cycle)
  - [ ] Active feature flag count <=6
  - [ ] **Feature flag sunset audit**: List all active flags (`SPECKIT_CONSOLIDATION`, `SPECKIT_AUTO_ENTITIES`, `SPECKIT_ENCODING_INTENT`, plus any from Sprints 1-5). Retire or consolidate any flags no longer needed. Document survivors with justification.
  - [ ] All health dashboard targets checked
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks T001-T007 marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Sprint 6 exit gate (T007) passed
- [ ] 12-18 new tests added and passing
- [ ] All existing tests still passing
- [ ] Active feature flag count <=6
- [ ] Checkpoint created before sprint start
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:pageindex-xrefs -->
## PageIndex Cross-References (from Earlier Sprints)

- [ ] T-PI-S6 Review and integrate PageIndex patterns from earlier sprints [2-4h] — Cross-reference (non-blocking)
  - PI-A1 (Sprint 2): Evaluate folder-level DocScore aggregation as a pre-filter before graph traversal
  - PI-A2 (Sprint 3): Ensure graph queries with empty results emit a signal into the Sprint 3 fallback chain
  - Status: Pending
  - Research evidence: See `9 - analysis-pageindex-systems-architecture.md`, `9 - recommendations-pageindex-patterns-for-speckit.md`, `9 - pageindex-tree-search-analysis.md` in the parent research/ folder
<!-- /ANCHOR:pageindex-xrefs -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Tasks**: See `../tasks.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS — Phase 7 of 8
- 7 tasks across 3 sections
- Phase A (Graph): T001-T002
- Phase B (Indexing + Spec-Kit): T003-T006 parallelizable
- T007: Sprint exit gate
- Internal phases A and B can run in parallel
-->
