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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:overview -->
## Global Overview

| Workstream | Folder | Status | Progress |
|------------|--------|--------|----------|
| [W:RAG] Hybrid RAG Fusion | `001-system-speckit-hybrid-rag-fusion/` | In progress | 0 / 6 phases |
| [W:GRAPH] Skill Graph Integration | `002-skill-graph-integration/` | Complete | 5 / 5 phases |
| [W:INTEG] Global Integration | (root-level tasks) | Pending | 0 / 5 tasks |

**Overall completion**: Workstream B done. Workstream A implementation not started. Integration tasks pending.
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
| M6: Integration Verified | [W:INTEG] | TASK-G001 through TASK-G005 complete | [ ] |
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
<!-- /ANCHOR:cross-refs -->
