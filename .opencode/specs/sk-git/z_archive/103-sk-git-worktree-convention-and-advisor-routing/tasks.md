---
title: "Tasks: sk-git Worktree Convention (wt/NNNN-name) + Skill-Advisor Routing Optimization"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sk-git worktree tasks"
  - "wt/ convention tasks"
  - "advisor reindex tasks"
  - "tasks core"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/z_archive/103-sk-git-worktree-convention-and-advisor-routing"
    last_updated_at: "2026-07-14T21:40:41Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored Level 2 task list for sk-git wt/ convention + advisor routing"
    next_safe_action: "Execute T001 onward: edit sk-git docs, changelog, reindex, restructure"
    blockers: []
    key_files:
      - ".opencode/skills/sk-git/references/worktree_workflows.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-128-sk-git-worktree"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: sk-git Worktree Convention (wt/NNNN-name) + Skill-Advisor Routing Optimization

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

- [ ] T001 Inventory existing feature worktrees and current NNNN values (`.worktrees/`)
- [ ] T002 Identify the two in-flight worktrees to defer and confirm `.worktrees/` is gitignored
- [ ] T003 [P] Capture baseline advisor routing margins for git/worktree prompts
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Update worktree convention to `wt/{NNNN}-{name}` + `.worktrees/{NNNN}-{name}` with the global-counter rule (`.opencode/skills/sk-git/references/worktree_workflows.md`)
- [ ] T005 Update the Worktree Directory Convention section and document the ephemeral-wrapper exception (`.opencode/skills/sk-git/README.md`)
- [ ] T006 Update branch-naming guidance and add new worktree-convention trigger phrases (`.opencode/skills/sk-git/SKILL.md`)
- [ ] T007 Align the worktree checklist to the numbered convention (`.opencode/skills/sk-git/assets/worktree_checklist.md`)
- [ ] T008 Add a changelog entry for the convention adoption and routing change (`.opencode/skills/sk-git/changelog/`)
- [ ] T009 Rebuild the skill-advisor index (mk_skill_advisor)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 grep the sk-git skill for leftover `type/{short-desc}` / unnumbered feature-worktree examples (expect none)
- [ ] T011 Run representative git/worktree/branch/commit/PR/merge/finish prompts through the advisor and confirm sk-git wins
- [ ] T012 Restructure existing feature worktrees into `.worktrees/{NNNN}-{name}` + `wt/{NNNN}-{name}`, prune stale worktrees, and defer the two in-flight worktrees
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
