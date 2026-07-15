---
title: "Tasks: Runtime-agnostic session lifecycle scripts [system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/004-runtime-agnostic-session-lifecycle-scripts/tasks]"
description: "Task tracker for making the lifecycle scripts runtime-agnostic."
trigger_phrases:
  - "runtime-agnostic lifecycle tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/006-operator-tooling/004-runtime-agnostic-session-lifecycle-scripts"
    last_updated_at: "2026-05-30T12:40:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "All tasks complete; shipped + pushed"
    next_safe_action: "Optional P2 doc refresh"
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Tasks: Runtime-agnostic session lifecycle scripts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Classify each script's Claude-specificity; map per-runtime session-end capability [investigation]

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Messaging
- [x] T002 Neutralize post-commit messaging (`.opencode/scripts/git-hooks/post-commit`) [10m]

### Sweeper generalization (closes REQ-001)
- [x] T003 Rename tree builder + var to session-neutral; multi-runtime preserve regex (`orphan-mcp-sweeper.sh`) [20m]
- [x] T004 Add operator-session preserves: opencode run / codex exec / gemini; rename preserve string `live-session-tree` [15m]

### Rename + generalize cleanup
- [x] T005 `git mv` claude-session-cleanup.sh → session-cleanup.sh; multi-runtime PID fallback + neutral log env/comments [20m]
- [x] T006 Create back-compat shim claude-session-cleanup.sh [5m]

### Per-runtime wiring
- [x] T007 Claude `.claude/settings.local.json` Stop → session-cleanup.sh [10m]
- [x] T008 Gemini `.gemini/settings.json` SessionEnd appends cleanup [10m]
- [x] T009 OpenCode `.opencode/plugins/session-cleanup.js` dispose bridge [20m]
- [x] T010 Document Codex/Devin sweeper-fallback in the script header [5m]

### Docs
- [x] T011 Update `.opencode/scripts/README.md` to new name + per-runtime table [15m]

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 `bash -n` / `node --check` clean on all changed scripts + plugin [5m]
- [x] T013 `preserve_reason` unit test: opencode-run / codex / gemini / devin all preserved (REQ-001) [10m]
- [x] T014 Shim delegates (execs session-cleanup.sh); PID fallback resolves to PPID [5m]
- [x] T015 `.claude` + `.gemini` JSON parse; OpenCode plugin ESM-valid [5m]
- [x] T016 `validate.sh --strict` on this packet exits 0 [5m]

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] REQ-001 (opencode-run preserve) proven
- [x] Claude cleanup unchanged (wire + shim)
- [x] Cleanup wired per runtime by capability
- [x] No `[B]` blocked tasks remaining

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->
