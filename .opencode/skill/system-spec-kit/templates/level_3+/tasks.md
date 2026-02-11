# Tasks: [NAME]

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

<!-- WHEN TO USE THIS TEMPLATE:
Level 3+ Tasks (+Govern) is appropriate when:
- AI Execution Protocol with multi-tier agents
- Workstream coordination ([W-A], [W-B], [SYNC] notation)
- Formal phase gates with sign-off
- Architecture decisions documented (decision-record.md)
- Milestone tracking and critical path analysis needed
- Risk mitigation tasks needed

DO NOT use Level 3+ Tasks if:
- Simple feature <100 LOC (use Level 1)
- Only verification needed (use Level 2)
- Standard complex feature (use Level 3)
- No parallel workstream coordination needed
-->

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

## Phase 1: Setup

- [ ] T001 [P0] Create project structure → CHK-001
- [ ] T002 [P0] Install dependencies → CHK-003
- [ ] T003 [P] [P1] Configure development tools

**Phase Gate**: All P0 tasks complete before proceeding

---

## Phase 2: Implementation

- [ ] T004 [P0] [Implement core feature 1] → CHK-020
- [ ] T005 [P0] [Implement core feature 2] → CHK-020
- [ ] T006 [P1] [Implement core feature 3]
- [ ] T007 [P0] [Add error handling] → CHK-012

**Phase Gate**: All P0 tasks complete, code passes lint → CHK-010

---

## Phase 3: Verification

- [ ] T008 [P0] Test happy path manually → CHK-021
- [ ] T009 [P1] Test edge cases → CHK-022
- [ ] T010 [P1] Update documentation → CHK-040

**Phase Gate**: All acceptance criteria verified → CHK-020

---

## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] All P0 checklist items verified

---

## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification**: See `checklist.md`
- **Decisions**: See `decision-record.md`

---

## L2: TASK-CHECKLIST MAPPING

| Task ID | Checklist Item | Priority | Status |
|---------|----------------|----------|--------|
| T001 | CHK-001 | P0 | [ ] |
| T002 | CHK-003 | P1 | [ ] |
| T004 | CHK-020 | P0 | [ ] |
| T007 | CHK-012 | P1 | [ ] |
| T008 | CHK-021 | P0 | [ ] |

---

## L2: PHASE COMPLETION GATES

### Gate 1: Setup Complete
- [ ] All P0 setup tasks done
- [ ] Dependencies verified working
- [ ] Ready for implementation

### Gate 2: Implementation Complete
- [ ] Core features functional
- [ ] Error handling in place
- [ ] Code quality checks pass (CHK-010, CHK-011)

### Gate 3: Verification Complete
- [ ] All acceptance criteria met (CHK-020)
- [ ] Edge cases documented (CHK-022)
- [ ] Security checklist passed (CHK-030, CHK-031)

---

## L2: BLOCKED TASK TRACKING

| Task ID | Blocker | Impact | Resolution |
|---------|---------|--------|------------|
| [T###] | [Description] | [High/Med/Low] | [Action needed] |

---

## L3: ARCHITECTURE TASKS

### ADR Implementation

| Task ID | ADR Reference | Description | Status |
|---------|---------------|-------------|--------|
| T100 | ADR-001 | [Implement decision] | [ ] |
| T101 | ADR-001 | [Configure components] | [ ] |

---

## L3: MILESTONE TRACKING

| Milestone | Target | Tasks Required | Status |
|-----------|--------|----------------|--------|
| M1 | [Date/Phase] | T001-T003 | [ ] |
| M2 | [Date/Phase] | T004-T007 | [ ] |
| M3 | [Date/Phase] | T008-T010 | [ ] |

---

## L3: RISK MITIGATION TASKS

| Task ID | Risk ID | Mitigation Action | Priority | Status |
|---------|---------|-------------------|----------|--------|
| T200 | R-001 | [Action description] | [P0/P1/P2] | [ ] |

---

## L3+: AI Execution Protocol

### Pre-Task Checklist

Before starting each task, verify:

1. [ ] Load `spec.md` and verify scope hasn't changed
2. [ ] Load `plan.md` and identify current phase
3. [ ] Load `tasks.md` and find next uncompleted task
4. [ ] Verify task dependencies are satisfied
5. [ ] Load `checklist.md` and identify relevant P0/P1 items
6. [ ] Check for blocking issues in `decision-record.md`
7. [ ] Verify `memory/` folder for context from previous sessions
8. [ ] Confirm understanding of success criteria
9. [ ] Begin implementation only after all checks pass

### Execution Rules

| Rule | Description |
|------|-------------|
| TASK-SEQ | Complete tasks in dependency order |
| TASK-SCOPE | Stay within task boundary, no scope creep |
| TASK-VERIFY | Verify each task against acceptance criteria |
| TASK-DOC | Update status immediately on completion |

### Status Reporting Format

```
## Status Update - [TIMESTAMP]
- **Task**: T### - [Description]
- **Status**: [IN_PROGRESS | COMPLETED | BLOCKED]
- **Evidence**: [Link to code/test/artifact]
- **Blockers**: [None | Description]
- **Next**: T### - [Next task]
```

---

## L3+: Workstream Organization

<!-- For parallel workstreams, organize tasks by workstream -->

### Workstream 1: [Name]
- [ ] T### [Task description]

### Workstream 2: [Name]
- [ ] T### [Task description]

---

<!--
LEVEL 3+ TASKS (~195 lines)
- Core + L2 verification + L3 architecture + L3+ governance
- Task-to-checklist traceability
- Phase completion gates
- ADR-linked tasks and milestones
- Risk mitigation tasks
- AI execution protocol with pre-task checklist
- Workstream organization for parallel work
- Status reporting format
-->
