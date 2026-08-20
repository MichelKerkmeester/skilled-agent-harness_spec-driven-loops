---
title: "Tasks: Rebase-Abort HEAD Preservation"
description: "Executor-ready task list for the foreign-rebase refusal, HEAD restore, and the fail-first regression test."
trigger_phrases:
  - "rebase abort head preservation tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-git/024-rebase-abort-head-preservation"
    last_updated_at: "2026-08-20T08:35:00Z"
    last_updated_by: "sk-git"
    recent_action: "Listed and completed the two edits + fail-first test"
    next_safe_action: "Land on main and v4"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "024-tasks"
      parent_session_id: null
---
# Tasks: Rebase-Abort HEAD Preservation

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

- [x] T001 Author the hermetic fail-first test that plants an authentic stale `rebase-merge` (`.opencode/bin/tests/git-rebase-abort-head-preservation.test.sh`) [evidence: test authored, 5 cases / 14 assertions, own temp repos with empty core.hooksPath]
- [x] T002 Prove it fails on the unmodified scripts — HEAD rewound to the stale orig-head on both (SC-001) [evidence: unmodified scripts report `FAIL=2` — "reconcile … lost commit <X>" and "git-sync … lost commit <X>", HEAD rewound to the stale orig-head]

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Refuse a pre-existing rebase; restore `ORIGINAL_HEAD` after any abort (`.opencode/bin/git-primary-reconcile.sh`) [evidence: pre-existing-rebase refusal + reset --hard "$ORIGINAL_HEAD" added; bash -n OK]
- [x] T004 Same refusal; add HEAD-identity restore around the abort using `HEAD_SHA` (`.opencode/bin/git-sync.sh`) [evidence: pre-existing-rebase refusal + HEAD-identity assertion/restore on "$HEAD_SHA" added; bash -n OK]

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Rerun the test against the fixed scripts — both stale cases preserve HEAD (SC-001) [evidence: `PASS=14 FAIL=0`, exit 0; HEAD stays on the local commit on both stale cases]
- [x] T006 [P] Add and pass a genuine-conflict case: clean abort, commit preserved, no false failure (SC-002) [evidence: CASE 3/5 — commit preserved, log records "aborted cleanly", no "assertion failed"/"abort-failed"]
- [x] T007 [P] Add and pass a clean-divergence case: rebase publishes to the remote (SC-003) [evidence: CASE 4 — `git ls-remote` shows origin advanced to the rebased HEAD; both remote and local files present]
- [x] T008 `bash -n` clean on both scripts [evidence: bash -n reports OK on git-primary-reconcile.sh and git-sync.sh]

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` [evidence: T001–T008 complete with cited evidence]
- [x] No `[B]` blocked tasks remaining [evidence: no blocked items in this list]
- [x] Full suite green (PASS=14, FAIL=0) [evidence: git-rebase-abort-head-preservation.test.sh reports PASS=14 FAIL=0, exit 0]

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`

<!-- /ANCHOR:cross-refs -->
