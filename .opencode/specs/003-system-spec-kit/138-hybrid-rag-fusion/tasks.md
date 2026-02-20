# Tasks: 138 Hybrid RAG Fusion — Root Coordination

<!-- SPECKIT_LEVEL: 3+ -->
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

**Task Format**: `T### [P?] Description (file path)`

> **Scope note:** This root `tasks.md` tracks high-level tasks and cross-workstream integration. Detailed per-task tracking lives in sub-folder task files:
> - Workstream A: `001-system-speckit-hybrid-rag-fusion/tasks.md`
> - Workstream B: `002-skill-graph-integration/tasks.md`
> - Workstream C: `003-unified-graph-intelligence/tasks.md`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:overview -->
## Global Overview

| Workstream | Folder | Status | Progress |
|------------|--------|--------|----------|
| [W:RAG] Hybrid RAG Fusion | `001-system-speckit-hybrid-rag-fusion/` | In progress | 0 / 6 phases |
| [W:GRAPH] Skill Graph Integration | `002-skill-graph-integration/` | **Complete** | 5 / 5 phases |
| [W:INTEG] Global Integration | (root-level tasks) | Blocked on W:RAG | 0 / 5 tasks |
| [W:INTEG-GRAPH] Unified Graph Intelligence | `003-unified-graph-intelligence/` | **Complete** | 4 / 4 phases |

**Overall completion**: Workstream B done. Workstream C (Unified Graph Intelligence) done (22 tasks, 4725 tests, 50/54 checklist). Workstream A (Hybrid RAG Fusion) partially done — modules created but not wired. Global integration blocked on W:RAG.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:workstream-a -->
## Workstream A: Hybrid RAG Fusion [W:RAG]

> Details: `001-system-speckit-hybrid-rag-fusion/tasks.md`

### Phase 0: Activate Existing Assets
- [ ] [W:RAG-P0] T001 Refactor `hybridSearchEnhanced` to unified dispatcher
- [ ] [W:RAG-P0] T002 Activate graph channel routing
- [ ] [W:RAG-P0] T003 Enable semantic + keyword co-activation
- [ ] [W:RAG-P0] T004 Implement adaptive fallback (graceful degradation)

### Phase 1: MMR + TRM
- [ ] [W:RAG-P1] T005 Implement `applyMMR` diversity algorithm
- [ ] [W:RAG-P1] T006 Wire intent-mapped lambda values per query type
- [ ] [W:RAG-P1] T007 Add TRM confidence threshold check
- [ ] [W:RAG-P1] T008 Inject low-confidence warnings into retrieval output

### Phase 2: Graph + Weights
- [ ] [W:RAG-P2] T009 Upgrade FTS5 to BM25 ranking
- [ ] [W:RAG-P2] T010 Implement graph CTE weight scoring

### Phase 3: Multi-Query Expansion
- [ ] [W:RAG-P3] T011 Build synonym expansion module
- [ ] [W:RAG-P3] T012 [P] Implement scatter-gather parallel retrieval
- [ ] [W:RAG-P3] T013 Apply cross-variant RRF (Reciprocal Rank Fusion)

### Phase 4: Indexing Quality
- [ ] [W:RAG-P4] T014 [P] Add AST-based code parsing for structured chunks
- [ ] [W:RAG-P4] T015 [P] Compute PageRank scores for memory nodes
- [ ] [W:RAG-P4] T016 [P] Generate embedding centroids per cluster
- [ ] [W:RAG-P4] T017 Apply tier decay to older memory entries
- [ ] [W:RAG-P4] T018 Track prediction error for adaptive scoring

### Phase 5: Test Coverage
- [ ] [W:RAG-P5] T019 [P] Unit tests: hybridSearchEnhanced dispatcher
- [ ] [W:RAG-P5] T020 [P] Unit tests: MMR + TRM modules
- [ ] [W:RAG-P5] T021 [P] Unit tests: graph CTE weight scoring
- [ ] [W:RAG-P5] T022 [P] Unit tests: multi-query expansion + RRF
- [ ] [W:RAG-P5] T023 Integration test: end-to-end retrieval pipeline
- [ ] [W:RAG-P5] T024 Regression guards: prevent score regression on known queries
<!-- /ANCHOR:workstream-a -->

---

<!-- ANCHOR:workstream-b -->
## Workstream B: Skill Graph Integration [W:GRAPH]

> Details: `002-skill-graph-integration/tasks.md`

### Phase 1: Tooling
- [x] [W:GRAPH-P1] T101 Create `check-links.sh` link validation script
- [x] [W:GRAPH-P1] T102 Define SGQS grammar specification
- [x] [W:GRAPH-P1] T103 Build skill metadata mapping schema
- [x] [W:GRAPH-P1] T104 Generate coverage matrix for all skills

### Phase 2: Pilot Migration
- [x] [W:GRAPH-P2] T105 Decompose `system-spec-kit` skill into graph nodes
- [x] [W:GRAPH-P2] T106 Add frontmatter to pilot skill files
- [x] [W:GRAPH-P2] T107 Verify backward compatibility with existing consumers

### Phase 3: Broad Migration
- [x] [W:GRAPH-P3] T108 Convert all 9 skills to graph-compatible format
- [x] [W:GRAPH-P3] T109 Validate frontmatter completeness across all skills

### Phase 4: SGQS Layer
- [x] [W:GRAPH-P4] T110 Implement SGQS parser
- [x] [W:GRAPH-P4] T111 Implement SGQS executor
- [x] [W:GRAPH-P4] T112 Add compatibility tests for SGQS layer
- [x] [W:GRAPH-P4] T113 Confirm Neo4j exclusion (pure SQLite graph)

### Phase 5: Verification
- [x] [W:GRAPH-P5] T114 Validate global link integrity
- [x] [W:GRAPH-P5] T115 Run full graph traversal tests
- [x] [W:GRAPH-P5] T116 Execute SGQS end-to-end scenarios
<!-- /ANCHOR:workstream-b -->

---

<!-- ANCHOR:workstream-c -->
## Workstream C: Unified Graph Intelligence [W:INTEG-GRAPH]

> Details: `003-unified-graph-intelligence/tasks.md`

### Phase 0+: Wire Graph Channel — COMPLETE
- [x] [W:INTEG-P0+] T301 Create SkillGraphCacheManager singleton (graph-search cache) — maps to 003/T001
- [x] [W:INTEG-P0+] T302 Create createUnifiedGraphSearchFn() composite function — maps to 003/T002
- [x] [W:INTEG-P0+] T303 Wire graphSearchFn into hybridSearch.init() at context-server.ts:566 — maps to 003/T004+T005
- [x] [W:INTEG-P0+] T304 Add graphWeight to FusionWeights in adaptive-fusion.ts — maps to 003/T006
- [x] [W:INTEG-P0+] T305 Bind co-activation spreading return value (line 406-416) — maps to 003/T007
- [x] [W:INTEG-P0+] T306 Add SPECKIT_GRAPH_UNIFIED feature flag — maps to 003/T003

### Phase 1+: Validation & Intent Routing — COMPLETE
- [x] [W:INTEG-P1+] T307 Add graph channel metrics collection — maps to 003/T008
- [x] [W:INTEG-P1+] T308 Implement Intent-to-Subgraph Routing (Pattern 3) — maps to 003/T009
- [x] [W:INTEG-P1+] T309 Implement Semantic Bridge Discovery (Pattern 4) — maps to 003/T010
- [x] [W:INTEG-P1+] T310 Validate with 50-query benchmark — maps to 003/T011

### Phase 2+: Intelligence Amplification — COMPLETE
- [x] [W:INTEG-P2+] T311 [P] Graph-Guided MMR (Pattern 1) — maps to 003/T012
- [x] [W:INTEG-P2+] T312 [P] Structural Authority Propagation (Pattern 2) — maps to 003/T013
- [x] [W:INTEG-P2+] T313 [P] Evidence Gap Prevention (Pattern 5) — maps to 003/T014
- [x] [W:INTEG-P2+] T314 [P] Context Budget Optimization (Pattern 6) — maps to 003/T015
- [x] [W:INTEG-P2+] T315 [P] Temporal-Structural Coherence (Pattern 7) — maps to 003/T016

### Phase 3: Test Coverage — COMPLETE
- [x] [W:INTEG-P3] T316 [P] Unit tests for graph-search-fn.ts — maps to 003/T017
- [x] [W:INTEG-P3] T317 [P] Unit tests for SkillGraphCacheManager — maps to 003/T018
- [x] [W:INTEG-P3] T318 [P] Integration test: full pipeline with graph channel — maps to 003/T021
- [x] [W:INTEG-P3] T319 Regression test: flag=false baseline unchanged — maps to 003/T022
<!-- /ANCHOR:workstream-c -->

---

<!-- ANCHOR:global-integration -->
## Global Integration Tasks [W:INTEG]

These tasks require both workstreams to be sufficiently complete before execution.

| Task ID | Description | Blocked By | Status |
|---------|-------------|------------|--------|
| TASK-G001 | Validate SGQS metadata feeds into Workstream A graph channel | W:RAG-P0 complete | [ ] |
| TASK-G002 | Benchmark end-to-end pipeline with skill graph data | W:RAG-P4 complete | [ ] |
| TASK-G003 | Cross-workstream regression testing | TASK-G001, TASK-G002 | [ ] |
| TASK-G004 | Unified documentation review (spec.md, plan.md, decision-record.md) | TASK-G003 | [ ] |
| TASK-G005 | Final integration verification and sign-off | TASK-G004 | [ ] |

- [ ] [W:INTEG] TASK-G001 [B] Validate SGQS metadata feeds into graph channel (blocked: W:RAG-P0)
- [ ] [W:INTEG] TASK-G002 [B] Benchmark end-to-end pipeline with skill graph data (blocked: W:RAG-P4)
- [ ] [W:INTEG] TASK-G003 [B] Cross-workstream regression testing (blocked: TASK-G001, TASK-G002)
- [ ] [W:INTEG] TASK-G004 [B] Unified documentation review (blocked: TASK-G003)
- [ ] [W:INTEG] TASK-G005 [B] Final integration verification and sign-off (blocked: TASK-G004)
<!-- /ANCHOR:global-integration -->

---

<!-- ANCHOR:milestones -->
## Milestone Tracking

| Milestone | Workstream | Gate Criteria | Status |
|-----------|------------|---------------|--------|
| M1: Asset Activation | [W:RAG] | P0 tasks complete, hybridSearchEnhanced unified | [ ] |
| M2: Core Retrieval Upgrade | [W:RAG] | P1 + P2 complete, MMR + BM25 live | [ ] |
| M3: Advanced Retrieval | [W:RAG] | P3 + P4 complete, multi-query + indexing quality | [ ] |
| M4: Test Coverage | [W:RAG] | P5 complete, all unit + integration tests passing | [ ] |
| M5: Skill Graph Done | [W:GRAPH] | All phases complete, SGQS verified | [x] |
| M5b: Unified Graph Done | [W:INTEG-GRAPH] | All 4 phases complete (T301-T319), 4725 tests | [x] |
| M6: Integration Verified | [W:INTEG] | TASK-G001 through TASK-G005 complete | [ ] (blocked on W:RAG) |
| M7: Production Ready | All | M4 + M6 complete, sign-off received | [ ] |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All [W:RAG] tasks marked `[x]` (Workstream A)
- [x] All [W:GRAPH] tasks marked `[x]` (Workstream B — complete)
- [ ] All [W:INTEG] TASK-G### tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] M7 milestone reached: production ready
- [ ] `validate.sh` exits with code 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision Record**: See `decision-record.md`
- **Checklist**: See `checklist.md`
- **Workstream A Tasks**: `001-system-speckit-hybrid-rag-fusion/tasks.md`
- **Workstream B Tasks**: `002-skill-graph-integration/tasks.md`
- **Workstream C Tasks**: `003-unified-graph-intelligence/tasks.md`
<!-- /ANCHOR:cross-refs -->
