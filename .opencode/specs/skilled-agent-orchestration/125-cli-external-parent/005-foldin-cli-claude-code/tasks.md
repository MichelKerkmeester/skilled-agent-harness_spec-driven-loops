---
title: "Tasks: Phase 5: foldin-cli-claude-code"
description: "Task list for the atomic cli-claude-code fold-in, identity dissolution, and hub-aware scorer rewrite."
trigger_phrases:
  - "foldin cli-claude-code tasks"
  - "identity dissolution tasks"
  - "scorer rewrite tasks"
  - "phase 005 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-cli-external-parent/005-foldin-cli-claude-code"
    last_updated_at: "2026-07-09T19:00:00Z"
    last_updated_by: "claude"
    recent_action: "Drafted the atomic bundle task list"
    next_safe_action: "Execute the atomic bundle after phase 004"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/executor-delegation.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-005-foldin-cli-claude-code"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: foldin-cli-claude-code

<!-- SPECKIT_LEVEL: 2 -->

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

- [ ] T001 Confirm phase 004 landed and the hub `mode-registry.json` exists as the scorer source
- [ ] T002 Inventory the `EXECUTOR_KINDS` members and the actual 11-case `expectedTop` distribution (6 cli-opencode, 2 cli-claude-code, 2 sk-code, 1 none)
- [ ] T003 [P] Inventory both children's `graph-metadata.json` edges/intent signals for the union fold, and cli-claude-code's ~13 internal outbound relative paths
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 `git mv` the ~50-file cli-claude-code tree into `cli-external/cli-claude-code/`, rewriting its ~13 internal outbound relative paths (add a `../`) in the same move
- [ ] T005 Rewrite `executor-delegation.ts` to source from the hub `mode-registry.json` (no hub-id noun), resolve to `EXECUTOR_KINDS`, and rebuild the dist
- [ ] T006 Delete both children's `graph-metadata.json` and fold their union into the hub metadata — in the SAME commit as T005
- [ ] T007 Finalize the hook's cli-claude-code registry entry and repoint `check-prompt-quality-card-sync.sh`'s cli-claude-code card path, in the same commit
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Re-baseline `executor-delegation-cases.json` (11 cases: 6 `cli-opencode`, 2 `cli-claude-code`, keep the 2 `sk-code` + 1 `none` negatives green, no scenario resolves to `cli-external`) and confirm `executor-delegation.vitest.ts` is green
- [ ] T009 Run a link-resolve check for the rewritten relative paths and confirm the card-sync gate is green; confirm exactly one `graph-metadata.json` under `cli-external/` and that the dissolution plus scorer rewrite are one commit
- [ ] T010 Run phase-folder validation
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Delegation vitest green, one hub identity, and provable one-commit atomicity
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
