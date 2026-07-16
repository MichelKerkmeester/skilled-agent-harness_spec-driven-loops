---
title: "Tasks: 009 RM-8 deep-review iteration prompt hardening"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "rm-8 tasks"
  - "prompt hardening tasks"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/002-spec-kit-internals/002-template-levels/009-harden-deep-review-iteration-prompts"
    last_updated_at: "2026-05-11T05:52:00Z"
    last_updated_by: "main-claude-opus-4.7"
    recent_action: "Authored tasks from plan.md"
    next_safe_action: "Apply edit (T004), commit, then run smoke (T008)"
    blockers: []
    key_files:
      - ".opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl"
    session_dedup:
      fingerprint: "sha256:rm8-009-tasks-author-2026-05-11"
      session_id: "main-rm8-009-2026-05-11"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 009 RM-8 deep-review iteration prompt hardening

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

- [x] T001 Verify prompt template path and current §CONSTRAINTS block content (`.opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl`)
- [x] T002 Confirm all five `{state_paths_*}` tokens are already substituted in the template
- [x] T003 Identify insertion point — immediately after the existing READ-ONLY constraint line
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Insert allowed-write list block in §CONSTRAINTS (`.opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl`)
- [ ] T005 Insert destructive-verb ban naming `rm`, `git rm`, `mv`, `sed -i`, `rmdir`, output-redirect truncate, `find -delete` (same file)
- [ ] T006 Insert `scope_violation` finding instruction for would-be out-of-scope mutations (same file)
- [ ] T007 Verify the edit applied cleanly with no leftover placeholders or broken tokens
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Smoke-test: dispatch `/deep:start-review-loop:auto` on `010-doctor-update-orchestrator` phase parent inside isolated worktree using cli-opencode + deepseek/deepseek-v4-pro (this is the run that motivated this packet — verification is in-band)
- [ ] T009 Post-dispatch: `git status -- 010-doctor-update-orchestrator/` shows no surprise writes outside `010-doctor-update-orchestrator/review/`
- [ ] T010 Update implementation-summary.md with smoke result
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] T001–T010 all marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Smoke run completed without out-of-scope writes
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Origin**: `../cross-phase-review-synthesis.md` §5 (destructive event) and §6 (RM-8 row)
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
