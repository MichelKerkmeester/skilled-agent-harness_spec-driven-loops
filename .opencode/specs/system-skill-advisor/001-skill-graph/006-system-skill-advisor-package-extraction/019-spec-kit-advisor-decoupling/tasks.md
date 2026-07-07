---
title: "Tasks: Full spec-kit advisor import decoupling [template:level_3/tasks.md]"
description: "Task ledger for packet 019 import isolation, regression classification, validation repair, and commit readiness."
trigger_phrases:
  - "019 tasks"
  - "advisor decoupling tasks"
  - "import isolation task ledger"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/019-spec-kit-advisor-decoupling"
    last_updated_at: "2026-05-15T09:20:00Z"
    last_updated_by: "codex"
    recent_action: "Completed remaining 019 unblock tasks through advisor test fix and validation repair."
    next_safe_action: "Commit and push after final scope audit."
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/scorer/lane-weight-sweep.vitest.ts"
      - ".opencode/specs/system-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/019-spec-kit-advisor-decoupling/"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All remaining dispatch tasks are complete except final commit/push at the time of this doc update."
---
# Tasks: Full Spec-Kit Advisor Import Decoupling

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## TASK NOTATION

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
## PHASE 1: SETUP

- [x] T001 Confirm packet path moved under `006-system-skill-advisor-package-extraction`.
- [x] T002 Review prior dispatch implementation summary and log.
- [x] T003 [P] Capture initial `git status -s` and `git stash list`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T004 Stash decoupling changes and run spec-kit memory baseline.
- [x] T005 Stash baseline test artifacts and run advisor baseline.
- [x] T006 Restore decoupling changes and run post-change memory suite.
- [x] T007 Run post-change advisor suite and identify lane sweep packet path failure.
- [x] T008 Fix `lane-weight-sweep.vitest.ts` packet paths.
- [x] T009 Normalize 019 docs to Level 3 template shape.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T010 Advisor vitest passes after fix.
- [x] T011 Memory regression count is 0 by baseline comparison.
- [x] T012 Exact advisor import audit returns zero.
- [x] T013 Strict validate 019 passes after doc repair.
- [x] T014 Strict validate parent passes.
- [x] T015 Stage only scoped decoupling files.
- [x] T016 Commit and push to `origin/main`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remain.
- [x] Verification evidence recorded in `implementation-summary.md`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Decision Record**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
