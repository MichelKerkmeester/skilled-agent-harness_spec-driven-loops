---
title: "Tasks: git test/tool subprocess env isolation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "git env isolation tasks"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/018-git-subprocess-env-isolation"
    last_updated_at: "2026-07-29T06:03:51Z"
    last_updated_by: "claude"
    recent_action: "All tasks complete; 3 helpers hardened and verified"
    next_safe_action: "Commit on skilled/v4"
    blockers: []
    key_files:
      - ".opencode/skills/sk-git/scripts/lib/git-rule-checks.test.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "git-env-isolation-20260729"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: git test/tool subprocess env isolation

<!-- SPECKIT_LEVEL: 2 -->
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

- [x] T001 Confirm the poisoned-env leak reproduces against the current `git()` helper (baseline red).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Add a scrubbed-env helper and apply it to the `git()` subprocess in `sk-git/scripts/lib/git-rule-checks.test.mjs`.
- [x] T003 [P] Build a scrubbed base env for `_run_git` in `sk-doc/shared/scripts/rename_tooling_fixture_core.py` (both the `environment is None` and caller-supplied branches).
- [x] T004 [P] `unset` the `GIT_*` redirectors before the fixture git calls in `sk-git/scripts/tests/worktree-naming.test.sh`.
- [x] T005 Add a poisoned-env regression test to `git-rule-checks.test.mjs` asserting a stand-in repo pointed at by `GIT_DIR`/`GIT_WORK_TREE` is untouched.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 `node --test git-rule-checks.test.mjs` passes (incl. the new regression case).
- [x] T007 `bash worktree-naming.test.sh` passes 47/47. The sk-doc rename fixture harness has 2 pre-existing failures (deleted `.gitkeep` files, not-mine) proven independent by running the HEAD core; the Python fix is verified via T008's direct poisoned-env check instead.
- [x] T008 Direct poisoned-env check: run each hardened helper with `GIT_DIR`/`GIT_WORK_TREE` exported at a throwaway repo; assert its identity/bare/hooksPath unchanged.
- [x] T009 Comment hygiene clean on all three changed files; `validate.sh --strict` Errors 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Poisoned-env leak no longer reproduces against any of the three helpers
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
