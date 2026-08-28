---
title: "Tasks: Phase 4: card-sync-guard-rewrite"
description: "Ordered tasks for card-sync-guard-rewrite, each closed with recorded command evidence."
trigger_phrases:
  - "008 phase 004 tasks"
  - "card-sync-guard-rewrite tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: card-sync-guard-rewrite

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

- [x] T001 Observe the guard failing on the deleted registry — evidence: `FileNotFoundError: './.opencode/skills/sk-prompt/sk-prompt-models/assets/model-profiles.json'` after CHECK 1 and CHECK 2 both reported PASS
- [x] T002 Confirm which checks still have a subject — evidence: CHECK 1 and CHECK 2 compare executor cards against a canonical home that survives; CHECK 3 and CHECK 4 read only the deleted registry
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Excise the registry-reading checks — evidence: The embedded Python block was removed as one contiguous span; a search of the guard for the retired name returns nothing
- [x] T004 Repoint the canonical-location header — evidence: Now names the surviving card and the surviving deep-theory reference
- [x] T005 Update the CI workflow's description — evidence: Reworded from a three-layer four-check guard to the two structural checks that remain
- [x] T006 Correct the pre-commit staged-path regex — evidence: Replaced underscored filenames that never existed and a non-existent top-level path with the four surfaces the guard actually checks
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Check the guard's syntax — evidence: `bash -n` on the guard and on the hook both succeed
- [x] T008 Run the guard — evidence: Both checks report PASS across all four executors; `GUARD PASS`, exit 0
- [x] T009 Self-test the corrected regex — evidence: Four in-scope paths MATCH and the out-of-scope control does not
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` — evidence: every task above carries a recorded command result
- [x] No `[B]` blocked tasks remaining — evidence: no task in this phase entered a blocked state
- [x] Manual verification passed — evidence: see the Verification table in `implementation-summary.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
