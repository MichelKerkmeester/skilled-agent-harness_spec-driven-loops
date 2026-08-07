---
title: "Tasks: Deep Improvement Promotion Safety"
description: "Task list for the mirror-sync gate canonical-baseline remediation."
trigger_phrases:
  - "deep improvement promotion safety tasks"
  - "mirror sync gate canonical baseline tasks"
  - "promote candidate mirror sync tasks"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/024-deep-loop-improved/008-loop-systems-remediation/002-deep-improvement-promotion-safety"
    last_updated_at: "2026-06-29T14:00:00Z"
    last_updated_by: "claude"
    recent_action: "Tracked the mirror-sync baseline remediation"
    next_safe_action: "Finalize the remaining 009 remediation phases"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/promote-candidate.cjs"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/tests/promote-candidate-mirror-sync.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-improvement-promotion-safety-2026-06-29"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Deep Improvement Promotion Safety

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

- [x] T001 Read the mirror-sync gate (`.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/promote-candidate.cjs`)
- [x] T002 Read `verifyMirrorSync` and `evaluateMirrorSyncGate` (`.opencode/skills/deep-loop-workflows/deep-improvement/scripts/lib/mirror-sync-verify.cjs`, `lib/promotion-gates.cjs`)
- [x] T003 [P] Read existing mirror-sync and benchmark tests for fixtures
- [x] T004 Capture the full deep-improvement suite baseline (403 tests)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Author the hermetic regression test (`.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/tests/promote-candidate-mirror-sync.vitest.ts`)
- [x] T006 Confirm RED before the fix (in-sync case blocked by candidate comparison)
- [x] T007 Read the current canonical body instead of the candidate in the gate (`.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/promote-candidate.cjs`)
- [x] T008 Add the missing-target fallback to preserve new-agent behavior (`.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/promote-candidate.cjs`)
- [x] T009 Author concrete Level-1 docs (`spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run `node --check` on the promotion CLI
- [x] T011 Confirm GREEN after the fix (in-sync passes, drift blocks)
- [x] T012 Run the full deep-improvement Vitest suite (no regressions)
- [x] T013 Run comment hygiene on modified code/test files
- [x] T014 Run strict spec validation after metadata refresh
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] RED-before / GREEN-after verification passed
- [x] Full deep-improvement Vitest suite passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
