---
title: "Tasks: Phase 6: spec-kit-test-and-harness-cleanup"
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
    packet_pointer: "system-code-graph/036-code-graph-decommission/006-spec-kit-test-and-harness-cleanup"
    last_updated_at: "2026-07-28T04:51:16Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded the decommission phase child"
    next_safe_action: "Populate requirements from the touchpoint research synthesis"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-036-006-spec-kit-test-and-harness-cleanup"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6: spec-kit-test-and-harness-cleanup

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

- [x] T001 Confirm phase 005 removed the production coupling these tests cover — evidence: `scratch/closeout-facts.md`
- [x] T002 Classify each test file as graph-only, mixed, or graph-subject
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Delete 4 graph-only test files (launcher lifecycle and boundary proxy)
- [x] T004 Strip mocks and imports across 10 mixed test files (surviving behavior kept)
- [x] T005 Delete `session-health.vitest.ts` whole (every case proved graph-subject)
- [x] T006 Delete `session-bootstrap.vitest.ts` whole (every case proved graph-subject)
- [x] T007 Remove individual graph cases from `session-resume` and `context-metrics` tests
- [x] T008 Remove graph tool templates and manifest rows from matrix runners — evidence: `scratch/closeout-facts.md`
- [x] T009 Remove smoke matrices (commit `fef098b6b2`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Full spec-kit suite passes at 418 tests green (commit `607ba8cdf6`)
- [x] T011 Confirm no test imports a deleted module — evidence: `scratch/closeout-facts.md`
- [x] T012 Confirm no test is skipped to make the run pass — evidence: `scratch/closeout-facts.md`
- [x] T013 Enumerate dropped coverage explicitly — evidence: `scratch/closeout-facts.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (418 tests green, no skipped tests)
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
