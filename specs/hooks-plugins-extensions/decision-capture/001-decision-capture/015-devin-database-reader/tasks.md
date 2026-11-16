---
title: "Tasks: Phase 15: devin-database-reader"
description: "Probe the Devin key format live, dispatch the message-store reader and its test, then prove recovery on the real session."
trigger_phrases:
  - "devin database reader tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 15: devin-database-reader

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`DC` is `.skilled/hooks/decision-capture`. `PROBE` is one interactive Devin session in a scratch project, answered by hand in tmux, with a second hook that saves the raw payload.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Compare the hook's id with the store's (`PROBE`). Verify: both are `ask_user_question:0#055c21a4…`, and the queue key carries `.`.
- [x] T002 Check the stored-twice rows. Verify: the two rows share a message id and differ only in metadata.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 The reader and its use (`DC/bin/sweep-devin.mjs`). Verify: the message-store test passes.
- [x] T004 The message-store test (`DC/bin/sweep-devin.test.mjs`). Verify: it fails on the old file.
- [x] T005 Correct the transcript wording (`DC/bin/README.md`, two comments). Verify: `rg -c "writes no transcript" DC` prints nothing.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Rerun the hook suites. Verify: 144 passed and 0 failed.
- [x] T007 Real session against a store copy with no transcripts. Verify: `Blue` recovered under the hook key, then 0 with the hook's queue present.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the real session recovers the hook key once
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
