---
title: "Tasks: CLI Per-Command Help, Aliases, and Errors [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "002-cli-help-aliases-errors tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/016-cli-tooling-ux/002-cli-help-aliases-errors"
    last_updated_at: "2026-06-10T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded Level-1 task list (planned, unchecked)"
    next_safe_action: "Begin Phase 1 pattern capture tasks"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-016-002-cli-help-aliases-errors"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: CLI Per-Command Help, Aliases, and Errors

<!-- SPECKIT_LEVEL: 1 -->

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

- [ ] T001 Capture the skill-advisor per-command help shape (`skill-advisor-cli.ts:661-674`) as the pattern to mirror.
- [ ] T002 Enumerate current aliases across `spec-memory-cli.ts:222-228`, `code-index-cli.ts:241-247`, `skill-advisor-cli-manifest.ts:142-151` and list gaps.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 [P] Add per-command help/schema to `spec-memory-cli.ts` (replace global-only usage at `:750-755`).
- [ ] T004 [P] Add per-command help/schema to `code-index-cli.ts` (replace global-only usage at `:898-903`).
- [ ] T005 Declare a unified snake/kebab/camel alias map across all three CLIs with a collision test.
- [ ] T006 Add a "try list-tools" hint + closest-match suggestion to the unknown-command catch paths (`spec-memory-cli.ts:774-793`, `code-index-cli.ts:926-945`, `skill-advisor-cli.ts:1111-1130`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Verify per-command help prints offline for spec-memory and code-index (exit 0).
- [ ] T008 Verify the alias collision test is green.
- [ ] T009 Verify a typoed command returns the hint plus nearest-match suggestion.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
