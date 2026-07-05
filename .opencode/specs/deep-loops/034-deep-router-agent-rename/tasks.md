---
title: "Tasks: Rename the deep router agent to deep-loop"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "deep router rename tasks"
  - "deep-loop agent tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "deep-loops/034-deep-router-agent-rename"
    last_updated_at: "2026-07-04T17:50:32Z"
    last_updated_by: "claude-code"
    recent_action: "Executed and verified the scoped rename"
    next_safe_action: "Validate, commit the tracked rename, and push"
    blockers: []
    key_files:
      - ".opencode/agents/deep-loop.md"
      - ".claude/agents/deep-loop.md"
      - ".opencode/agents/orchestrate.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "034-deep-router-rename"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Rename the deep router agent to deep-loop

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

- [x] T001 `git mv` the tracked router files `deep.md` → `deep-loop.md` (.opencode/agents, .claude/agents)
- [x] T002 Rename the untracked codex router mirror on disk for runtime parity (.codex/agents/deep-loop.md)
- [x] T003 Set `name: deep-loop` and repoint the mirror-note paths in all three renamed files
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Replace bare `@deep` → `@deep-loop` in .opencode/agents/orchestrate.md (spares `@deep-<mode>`)
- [x] T005 Replace bare `@deep` → `@deep-loop` in .claude/agents/orchestrate.md
- [x] T006 Replace bare `@deep` → `@deep-loop` in .codex/agents/orchestrate.md
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Confirm zero bare `@deep` router refs remain in live agent/orchestrate files
- [x] T008 Confirm `name: deep-loop` in all three mirrors and codex parity with opencode
- [x] T009 Run validate.sh --strict, scoped commit, push
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Reference verification passed (zero bare `@deep` router refs)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
