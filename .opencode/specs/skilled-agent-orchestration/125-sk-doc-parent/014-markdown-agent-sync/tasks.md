---
title: "Tasks: Align markdown agent files with current sk-doc setup"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "markdown agent sync tasks"
  - "125 sk-doc phase 014 tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-sk-doc-parent/014-markdown-agent-sync"
    last_updated_at: "2026-07-07T00:00:00Z"
    last_updated_by: "claude-sonnet"
    recent_action: "Author phase-014 tasks"
    next_safe_action: "Run T001 (confirm 012/013 closed) before any edits"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Align markdown agent files with current sk-doc setup

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

- [B] T001 Confirm `012-quality-control-rename/` and `013-shared-refs-reorg/` are closed
- [ ] T002 Grep both agent files for every `sk-doc` packet name/path citation
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Cross-check each citation against the current sk-doc tree; list stale hits
- [ ] T004 Draft the repoint for `.opencode/agents/markdown.md` (`.opencode/agents/markdown.md`)
- [ ] T005 Draft the matching repoint for `.claude/agents/markdown.md` (`.claude/agents/markdown.md`)
- [ ] T006 Confirm the `/create:*` command-to-template table lists all 10 packets accurately
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Fresh-Sonnet verification: every cited path resolves on disk
- [ ] T008 Diff the two agent files, confirm no unintended divergence
- [ ] T009 Grep both files for `doc-quality` and `references/global`, confirm 0 stale hits
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Both agent files cite only paths/names that exist on the post-011-013 tree
- [ ] The two runtime mirrors are content-identical
- [ ] No `[B]` blocked tasks remaining
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
