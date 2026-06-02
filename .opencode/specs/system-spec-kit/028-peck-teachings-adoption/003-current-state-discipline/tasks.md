---
title: "Tasks: Phase 2: current-state-discipline [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-peck-teachings-adoption/003-current-state-discipline"
    last_updated_at: "2026-06-02T10:04:53Z"
    last_updated_by: "planning-author"
    recent_action: "Authored phase tasks (planned, not implemented)"
    next_safe_action: "Implement: extend the content scanner + register advisory rule"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-current-state-discipline"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: current-state-discipline

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

- [ ] T001 Study check-phase-parent-content.sh fence/comment-aware logic
- [ ] T002 Decide the in-scope doc set and the exemptions (decision-record, changelog)
- [ ] T003 [P] Draft the token list + test fixtures
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Extend the scanner to implementation-summary.md / non-parent spec.md
- [ ] T005 Register the rule in validator-registry.json at severity warn
- [ ] T006 Document the rule + exemptions in validation_rules.md
- [ ] T007 Wire the exemptions (decision-record.md, changelog/)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Fixture with history tokens emits a warning; exempt + fenced cases do not
- [ ] T009 Run on existing tracks; confirm no new errors in normal mode
- [ ] T010 Update phase docs + changelog
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Advisory rule verified on fixtures + existing tracks
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
