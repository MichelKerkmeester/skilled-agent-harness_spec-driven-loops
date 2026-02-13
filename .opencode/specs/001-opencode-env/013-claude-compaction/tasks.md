# Tasks: Claude Code Compaction Resilience

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch | v2.2 -->

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] [Priority] Description (file path) → CHK-###`

---

## Phase 1: CLAUDE.md Section

- [ ] T001 [P0] Draft "Context Compaction Behavior" section with CRITICAL/STOP markers → CHK-020
- [ ] T002 [P0] Include numbered steps 1-5 (stop, re-read, summarize, present, don't assume) → CHK-021
- [ ] T003 [P0] Include "When compacting, always preserve:" block (file paths, errors, instructions, git state) → CHK-022
- [ ] T004 [P0] Include multi-compaction guidance (2+ compactions → recommend /clear) → CHK-023
- [ ] T005 [P1] Verify section is under 25 lines → CHK-030
- [ ] T006 [P1] Verify section is under 500 tokens → CHK-031

**Phase Gate**: All P0 tasks complete; content reviewed for accuracy and clarity

---

## Phase 2: MEMORY.md Entry

- [ ] T007 [P] [P0] Draft 2-line "Compaction Recovery" entry for MEMORY.md → CHK-024
- [ ] T008 [P] [P1] Verify MEMORY.md stays under 200-line limit after addition → CHK-032
- [ ] T009 [P1] Include manual /compact workflow reference (70% trigger threshold) → CHK-025

**Phase Gate**: All P0 tasks complete; MEMORY.md within limits

---

## Phase 3: Workflow Documentation

- [ ] T010 [P0] Document manual /compact workflow in spec documents → CHK-040
- [ ] T011 [P1] Document context monitoring guidance (when to trigger /compact) → CHK-040
- [ ] T012 [P1] Document multi-compaction session recovery procedure → CHK-041
- [ ] T013 [P1] Document verification procedure for testing compaction resilience → CHK-042
- [ ] T014 [P1] Cross-reference all spec documents (spec ↔ plan ↔ tasks ↔ checklist ↔ ADRs) → CHK-043

**Phase Gate**: All documentation complete and cross-referenced

---

## Phase 4: Verification Protocol

- [ ] T015 [P0] Define 5-run behavioral test protocol with specific scenarios → CHK-050
- [ ] T016 [P0] Run Test 1: Basic compaction → verify stop-and-confirm behavior → CHK-051
- [ ] T017 [P0] Run Test 2: Compaction with active behavioral constraint ("plan only") → CHK-052
- [ ] T018 [P0] Run Test 3: Compaction mid-task with file modifications tracked → CHK-053
- [ ] T019 [P1] Run Test 4: Second compaction in same session → verify /clear recommendation → CHK-054
- [ ] T020 [P1] Run Test 5: Manual /compact with focus instructions → CHK-055

**Phase Gate**: All P0 tests pass (5/5 stop-and-confirm verified)

---

## Phase 5: Execute & Verify

- [ ] T021 [P0] Insert CLAUDE.md section into production file (CLAUDE.md) → CHK-060
- [ ] T022 [P0] Insert MEMORY.md entry into production file → CHK-061
- [ ] T023 [P0] Run final verification: new session starts cleanly with instructions loaded → CHK-062
- [ ] T024 [P1] Complete implementation-summary.md with results and evidence → CHK-063

**Phase Gate**: Production files updated, verification passed, summary complete

---

## Completion Criteria

- [ ] All 24 tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] 5-run behavioral test protocol passed
- [ ] All P0 checklist items verified
- [ ] Implementation summary complete with evidence

---

## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification**: See `checklist.md`
- **Decisions**: See `decision-record.md`
- **Research**: See `../compaction-research/research.md`

---

## L2: TASK-CHECKLIST MAPPING

| Task ID | Checklist Item | Priority | Status |
|---------|----------------|----------|--------|
| T001 | CHK-020 | P0 | [ ] |
| T002 | CHK-021 | P0 | [ ] |
| T003 | CHK-022 | P0 | [ ] |
| T004 | CHK-023 | P0 | [ ] |
| T005 | CHK-030 | P1 | [ ] |
| T006 | CHK-031 | P1 | [ ] |
| T007 | CHK-024 | P0 | [ ] |
| T008 | CHK-032 | P1 | [ ] |
| T009 | CHK-025 | P1 | [ ] |
| T010 | CHK-040 | P0 | [ ] |
| T014 | CHK-043 | P1 | [ ] |
| T015 | CHK-050 | P0 | [ ] |
| T016 | CHK-051 | P0 | [ ] |
| T017 | CHK-052 | P0 | [ ] |
| T018 | CHK-053 | P0 | [ ] |
| T019 | CHK-054 | P1 | [ ] |
| T020 | CHK-055 | P1 | [ ] |
| T021 | CHK-060 | P0 | [ ] |
| T022 | CHK-061 | P0 | [ ] |
| T023 | CHK-062 | P0 | [ ] |
| T024 | CHK-063 | P1 | [ ] |

---

## L2: PHASE COMPLETION GATES

### Gate 1: Content Drafted (Phase 1 + 2)
- [ ] CLAUDE.md section drafted with all required elements
- [ ] MEMORY.md entry drafted
- [ ] Both within size constraints

### Gate 2: Documentation Complete (Phase 3)
- [ ] Workflow documentation complete
- [ ] All spec documents cross-referenced
- [ ] Verification protocol defined

### Gate 3: Verification Passed (Phase 4)
- [ ] 5-run test protocol executed
- [ ] All P0 tests pass (stop-and-confirm verified)
- [ ] Results documented

### Gate 4: Production Deployed (Phase 5)
- [ ] CLAUDE.md updated in production
- [ ] MEMORY.md updated in production
- [ ] Implementation summary complete

---

## L2: BLOCKED TASK TRACKING

| Task ID | Blocker | Impact | Resolution |
|---------|---------|--------|------------|
| (none) | -- | -- | All dependencies satisfied |

---

## L3: ARCHITECTURE TASKS

### ADR Implementation

| Task ID | ADR Reference | Description | Status |
|---------|---------------|-------------|--------|
| T001 | ADR-001 | Place instructions in CLAUDE.md (primary location) | [ ] |
| T007 | ADR-001 | Place pointer in MEMORY.md (secondary reinforcement) | [ ] |
| T002 | ADR-002 | Implement "Stop and Confirm" pattern (steps 1-5) | [ ] |
| T001 | ADR-003 | Use structured numbered format with CRITICAL/STOP markers | [ ] |

---

## L3: MILESTONE TRACKING

| Milestone | Target | Tasks Required | Status |
|-----------|--------|----------------|--------|
| M1: Content Drafted | Phase 2 | T001-T009 | [ ] |
| M2: Docs Complete | Phase 4 | T010-T020 | [ ] |
| M3: Verified & Deployed | Phase 5 | T021-T024 | [ ] |

---

## L3: RISK MITIGATION TASKS

| Task ID | Risk ID | Mitigation Action | Priority | Status |
|---------|---------|-------------------|----------|--------|
| T001 | R-001 | Use CRITICAL/STOP markers for maximum salience | P0 | [ ] |
| T007 | R-001 | Add MEMORY.md as secondary reinforcement layer | P0 | [ ] |
| T005-T006 | R-002 | Verify section stays under size constraints | P1 | [ ] |
| T004 | R-005 | Include multi-compaction /clear recommendation | P1 | [ ] |
| T016-T020 | R-004 | 5-run test protocol with varied scenarios | P0 | [ ] |

---

<!--
LEVEL 3 TASKS
- Core + L2 verification + L3 architecture
- Task-to-checklist traceability
- Phase completion gates
- ADR-linked tasks and milestones
-->
