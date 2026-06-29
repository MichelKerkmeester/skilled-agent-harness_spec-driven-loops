---
title: "Tasks: Deep Improvement Rollback Hash Guard"
description: "Task list for the rollback accepted-state hash guard remediation."
trigger_phrases:
  - "deep improvement rollback hash guard tasks"
  - "rollback candidate accepted state hash tasks"
  - "promote candidate benchmark rollback tasks"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/156-agent-loops-improved/009-loop-systems-remediation/001-deep-improvement-rollback-hash-guard"
    last_updated_at: "2026-06-29T10:50:10Z"
    last_updated_by: "codex"
    recent_action: "Tracked rollback guard remediation"
    next_safe_action: "Install local Vitest dependency and rerun full suite"
    blockers:
      - "Requested npx vitest run cannot execute because vitest is not installed locally and network lookup for npm registry fails."
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/rollback-candidate.cjs"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/tests/promote-candidate-benchmark.vitest.ts"
    session_dedup:
      fingerprint: "sha256:1111111111111111111111111111111111111111111111111111111111111111"
      session_id: "rollback-hash-guard-2026-06-29"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
# Tasks: Deep Improvement Rollback Hash Guard

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

- [x] T001 Read rollback helper (`.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/rollback-candidate.cjs`)
- [x] T002 Read acceptance-state producer (`.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/promote-candidate.cjs`)
- [x] T003 [P] Read benchmark promotion tests (`.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/tests/promote-candidate-benchmark.vitest.ts`)
- [x] T004 Run requested baseline suite command and capture dependency failure
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Add rollback SHA-256 helper (`.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/rollback-candidate.cjs`)
- [x] T006 Add accepted-state source hash guard (`.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/rollback-candidate.cjs`)
- [x] T007 Verify backup hash before restore (`.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/rollback-candidate.cjs`)
- [x] T008 Add pre-ship rollback and drift-block regression coverage (`.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/tests/promote-candidate-benchmark.vitest.ts`)
- [x] T009 Author concrete Level-1 docs (`spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run syntax check on rollback helper
- [x] T011 Run direct Node CLI rollback hash-guard scenario
- [ ] T012 [B] Run full deep-improvement Vitest suite
- [x] T013 Run comment hygiene on modified code/test files
- [x] T014 Run strict spec validation after metadata refresh
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [x] Direct behavioral verification passed
- [ ] Full requested Vitest suite passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
