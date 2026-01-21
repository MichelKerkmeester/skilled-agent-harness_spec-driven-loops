# Tasks: [YOUR_VALUE_HERE: feature-name]

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-level3plus-verbose | v2.0-verbose -->

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending - not yet started |
| `[x]` | Completed - verified done |
| `[P]` | Parallelizable - can run alongside other [P] tasks |
| `[B]` | Blocked - waiting on dependency (add note explaining blocker) |

**Task Format**: `T### [P?] Description (file path if applicable)`

---

## Task Completion Criteria

**Mark a task `[x]` when:**
- [ ] Code implementation finished and working
- [ ] Code passes lint/format checks
- [ ] Tests written (if required)
- [ ] Code review approved (if required)
- [ ] Workstream owner verified (for L3+)

---

## Working Files Location

| Directory | Purpose | Persistence |
|-----------|---------|-------------|
| `scratch/` | Debug logs, test data, experiments | Temporary |
| `memory/` | Context for future sessions | Permanent |
| Spec folder root | Documentation files | Permanent |
| Source directories | Implementation code | Permanent |

---

## Phase 1: Setup

**Purpose**: Project initialization, environment setup, architecture decisions, and governance setup

- [ ] T001 Create project structure
- [ ] T002 Install dependencies
- [ ] T003 [P] Configure development tools
- [ ] T004 Create decision-record.md with initial ADRs
- [ ] T005 Verify spec review approval checkpoint passed

**Checkpoint**: Setup complete when all T00x tasks marked `[x]` and spec review approved

---

## Phase 2: Implementation

**Purpose**: Build the core feature functionality across workstreams

### Workstream A: [YOUR_VALUE_HERE: Core/Backend]

- [ ] T006 [YOUR_VALUE_HERE: First task for workstream A]
  - File: [YOUR_VALUE_HERE: path/to/file.ts]
  - Owner: [YOUR_VALUE_HERE: Workstream owner]

- [ ] T007 [YOUR_VALUE_HERE: Second task]
  - File: [YOUR_VALUE_HERE: path/to/file.ts]
  - Depends on: T006

### Workstream B: [YOUR_VALUE_HERE: UI/Frontend]

- [ ] T008 [P] [YOUR_VALUE_HERE: Task for workstream B - parallel with A]
  - File: [YOUR_VALUE_HERE: path/to/file.tsx]
  - Owner: [YOUR_VALUE_HERE: Workstream owner]

- [ ] T009 [YOUR_VALUE_HERE: Second task]
  - File: [YOUR_VALUE_HERE: path/to/file.tsx]
  - Depends on: T008

### Integration

- [ ] T010 SYNC-001: Integrate workstreams A and B
  - Depends on: T007, T009
  - Output: [YOUR_VALUE_HERE: What this produces]

- [ ] T011 Add error handling and edge cases
  - Depends on: T010

**Checkpoint**: Implementation complete when all Phase 2 tasks marked `[x]` and SYNC-001 verified

---

## Phase 3: Verification

**Purpose**: Validate implementation, complete checklist, finalize documentation

### Testing

- [ ] T012 Test happy path manually
- [ ] T013 Test edge cases
- [ ] T014 [P] Write unit tests
- [ ] T015 [P] Write integration tests

### Checklist Verification

- [ ] T016 Verify checklist.md P0 items
- [ ] T017 Verify checklist.md P1 items
- [ ] T018 Review P2 items
- [ ] T019 Complete L3+ compliance checkpoints

### Documentation

- [ ] T020 Update spec.md status to "Complete"
- [ ] T021 Finalize decision-record.md ADRs
- [ ] T022 Create implementation-summary.md
- [ ] T023 [P] Update external documentation

### Governance

- [ ] T024 Implementation review approval
- [ ] T025 Launch approval checkpoint

**Checkpoint**: Verification complete when all Phase 3 tasks pass, checklist verified, and approvals obtained

---

## Completion Criteria

- [ ] All tasks marked `[x]` - no pending items
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] checklist.md P0 items all verified
- [ ] checklist.md P1 items verified OR deferred with approval
- [ ] decision-record.md all ADRs finalized
- [ ] implementation-summary.md created
- [ ] All approval workflow checkpoints complete
- [ ] All compliance checkpoints verified

---

## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Decisions**: `decision-record.md`

---

## Notes

[YOUR_VALUE_HERE: Additional notes, decisions during implementation]

---

<!--
VERBOSE LEVEL 3+ TEMPLATE - TASKS (~200 lines)
- Level 3+: Large features with governance
- Includes workstream organization, sync points, governance tasks
-->
