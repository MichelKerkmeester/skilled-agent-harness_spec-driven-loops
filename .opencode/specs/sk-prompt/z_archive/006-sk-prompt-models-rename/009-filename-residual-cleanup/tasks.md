---
title: "Tasks: Phase 9: filename-residual-cleanup"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "filename residual cleanup tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-prompt/006-sk-prompt-models-rename/009-filename-residual-cleanup"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase complete"
    next_safe_action: "Phase complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session/009-filename-residual-cleanup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 9: filename-residual-cleanup

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

- [x] T001 git mv the 2 cli-opencode playbook files (`deepseek-v4-direct-…`, `kimi-k2-7-direct-…`) → `…-with-sk-prompt-models.md`
- [x] T002 Confirm `.opencode/changelog/sk-prompt-small-model` (file vs dir) + what references it, then git mv → `sk-prompt-models`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Repair the `manual_testing_playbook.md` index references to the two renamed files
- [x] T004 Reconcile repo-root `README.md` to the new name without bundling unrelated WIP (isolate the rename hunk or commit with the WIP per user direction)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 `git ls-files '*sk-prompt-small-model*'` returns only history/archive; playbook links resolve
- [x] T006 README HEAD says the new name; write implementation-summary.md and refresh continuity
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] No live old-name filenames; README renamed; no unrelated WIP committed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
