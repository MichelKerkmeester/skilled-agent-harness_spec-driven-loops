# Tasks: Skill Graph Utilization Testing

<!-- SPECKIT_LEVEL: 1 -->
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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Create spec folder documentation (spec.md, plan.md, tasks.md)
- [x] T002 Build test harness script with SGQS CLI wrapper and error handling (`scratch/test-harness.sh`) [E: `scratch/test-harness.sh` + smoke run `MATCH (n:Node) RETURN COUNT(n)`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Execution

- [x] T003 [P] Run Git persona agent — 4+ scenarios, scored results (`scratch/results-git.json`) [E: `totalScenarios=4`, `averageScore=5.00`]
- [x] T004 [P] Run Frontend persona agent — 4+ scenarios, scored results (`scratch/results-frontend.json`) [E: `totalScenarios=4`, `averageScore=5.00`]
- [x] T005 [P] Run Docs persona agent — 4+ scenarios, scored results (`scratch/results-docs.json`) [E: `totalScenarios=4`, `averageScore=5.00`]
- [x] T006 [P] Run Full-Stack persona agent — 4+ scenarios, scored results (`scratch/results-fullstack.json`) [E: `totalScenarios=4`, `averageScore=5.00`]
- [x] T007 [P] Run QA persona agent — 4+ scenarios, scored results (`scratch/results-qa.json`) [E: `totalScenarios=4`, `averageScore=5.00`]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Synthesis

- [x] T008 Collect all persona JSON results and compute aggregate score with assessment tier [E: `scratch/results-utilization-all.json`, `averageScore=5.00`, tier=Exceptional]
- [x] T009 Write utilization report with cross-cutting metrics dashboard (`scratch/utilization-report.md`) [E: report created with metric table + status]
- [x] T010 Save memory context for this spec folder [E: `memory/21-02-26_10-35__skill-graph-utilization-testing.md` present]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Aggregate score >= 3.0 (SC-001 met)
- [x] Error resilience 100% — no unhandled SGQS failures (SC-002 met)
- [x] Utilization report written and readable in scratch/
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Prior work**: `002-skill-graph-integration/` and `003-unified-graph-intelligence/` (graph implementation context)
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
