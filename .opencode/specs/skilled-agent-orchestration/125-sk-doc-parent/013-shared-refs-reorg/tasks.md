---
title: "Tasks: Move shared/references/global/* up into shared/references/"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "shared refs reorg tasks"
  - "125 sk-doc phase 013 tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-sk-doc-parent/013-shared-refs-reorg"
    last_updated_at: "2026-07-07T06:49:25.884Z"
    last_updated_by: "claude-sonnet"
    recent_action: "Author phase-013 tasks"
    next_safe_action: "Run T001 (fresh citation grep) before moving files"
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
# Tasks: Move shared/references/global/* up into shared/references/

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

- [ ] T001 Fresh repo-wide grep for `references/global` under `.opencode/skills/sk-doc/`
- [ ] T002 Confirm the 6-file move has no destination collisions
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 `git mv` the 6 files (`.opencode/skills/sk-doc/shared/references/global/` -> `.opencode/skills/sk-doc/shared/references/`)
- [ ] T004 Remove the now-empty `global/` directory
- [ ] T005 Run the repoint script across every citing file (`SKILL.md`s, `references/README.md`s, other reference docs, `hub-router.json`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Re-grep for `references/global`, confirm 0 hits
- [ ] T007 Run the markdown link checker, confirm 0 broken links
- [ ] T008 Run `parent-skill-check.cjs`, confirm 0 new warnings
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All 6 files live directly under `shared/references/`; `global/` no longer exists
- [ ] 0 remaining citations of `global/` under sk-doc
- [ ] No `[B]` blocked tasks remaining
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
