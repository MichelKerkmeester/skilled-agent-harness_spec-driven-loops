---
title: "Tasks: sk-git Large-Reorg + Worktree Hardening [sk-git/z_archive/096-sk-git-reorg-hardening/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sk-git reorg hardening tasks"
  - "git worktree gitignored deps"
  - "rename-heavy merge guidance"
  - "scoped staging discipline"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/z_archive/096-sk-git-reorg-hardening"
    last_updated_at: "2026-07-14T21:40:41Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored tasks.md for completed sk-git hardening"
    next_safe_action: "Author checklist/implementation-summary and validate"
    blockers: []
    key_files:
      - "tasks.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: sk-git Large-Reorg + Worktree Hardening

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

- [x] T001 Capture 026 wave-4 incident lessons (scratch/agent1-worktree-notes.md, scratch/agent2-commit-notes.md)
- [x] T002 [P] Split scope across two sibling agents (worktree/playbook vs commit/merge)
- [x] T003 Confirm sk-git reference doc structure (.opencode/skills/sk-git/references/)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Add worktree caveats + leftover-cruft detection one-liner: §8b (.opencode/skills/sk-git/references/worktree_workflows.md)
- [x] T005 [P] Add scoped-staging discipline + deny-pattern assertion + `git reset --mixed HEAD~1` recovery: §3 Step 7 (.opencode/skills/sk-git/references/commit_workflows.md)
- [x] T006 [P] Add rename-heavy merge verification: §10 with comm -12 disjointness, merge.renameLimit, `git ls-files`, R-status (.opencode/skills/sk-git/references/shared_patterns.md)
- [x] T007 Add the step-ordered large-reorg runbook (.opencode/skills/sk-git/references/large_reorg_playbook.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Add SKILL.md discoverability pointers to §3 Step 7 and §10 (.opencode/skills/sk-git/SKILL.md)
- [x] T009 Cross-link the two sibling sections (commit_workflows.md <-> shared_patterns.md)
- [x] T010 Run validate.sh --strict on the packet until RESULT: PASSED
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
