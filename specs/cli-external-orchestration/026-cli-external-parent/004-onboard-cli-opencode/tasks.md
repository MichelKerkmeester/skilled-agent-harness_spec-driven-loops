---
title: "Tasks: Phase 4: onboard-cli-opencode"
description: "Task list for relocating the cli-opencode tree into the hub packet and repointing the fail-open PreToolUse dispatch hook."
trigger_phrases:
  - "onboard cli-opencode tasks"
  - "cli-opencode relocation tasks"
  - "dispatch hook repoint tasks"
  - "phase 004 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/026-cli-external-parent/004-onboard-cli-opencode"
    last_updated_at: "2026-07-09T19:00:00Z"
    last_updated_by: "claude"
    recent_action: "Drafted the cli-opencode onboarding task list"
    next_safe_action: "Execute the move and hook repoint after phase 003"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external/cli-opencode/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-004-onboard-cli-opencode"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: onboard-cli-opencode

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

- [ ] T001 Confirm phase 003 left `.opencode/skills/cli-external/cli-opencode/` empty and ready
- [ ] T002 Inventory the current cli-opencode tree and the `.claude/settings.json` PreToolUse hook path
- [ ] T003 [P] Confirm the hook's `DISPATCH_SKILLS` registry and path.join resolution as the hub-aware target
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 `git mv` the ~70-file cli-opencode tree into `cli-external/cli-opencode/`, keeping the hub as the single surviving advisor identity
- [ ] T005 Rewrite cli-opencode's ~54 internal outbound relative cross-skill paths (add the extra `../`) and any absolute self-refs, in the same move
- [ ] T006 Repoint the `.claude/settings.json` PreToolUse hook path and `check-prompt-quality-card-sync.sh`'s cli-opencode card path in the same change
- [ ] T007 Make the hook resolve cli-opencode from `cli-external/cli-opencode/SKILL.md`; leave the cli-claude-code entry for phase 005
- [ ] T008 Confirm no dispatch behavior, self-invocation guard, or provider logic changed
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Confirm `git status --short` shows renames, not copy/delete churn
- [ ] T010 Run an active Bash-call smoke check that the dispatch-preflight lint still fires from the new path
- [ ] T011 Run a link-resolve check for the rewritten internal outbound paths and confirm `check-prompt-quality-card-sync.sh` is green after the cli-opencode card-path repoint
- [ ] T012 Run phase-folder validation
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] The fail-open PreToolUse hook fires from its new path, confirmed by an active check
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
