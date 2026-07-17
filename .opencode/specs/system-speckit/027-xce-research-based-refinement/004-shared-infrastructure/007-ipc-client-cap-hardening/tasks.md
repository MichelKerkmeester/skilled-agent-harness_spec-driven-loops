---
title: "Tasks: IPC Client Cap Hardening and Silent Bridge Skip"
description: "Tasks for the cap raise across sources/configs and the banner suppression."
trigger_phrases:
  - "ipc cap tasks"
  - "banner suppression tasks"
  - "max clients tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/004-shared-infrastructure/007-ipc-client-cap-hardening"
    last_updated_at: "2026-06-11T17:40:00Z"
    last_updated_by: "claude-fable"
    recent_action: "All tasks complete"
    next_safe_action: "None; complete"
---
# Tasks: IPC Client Cap Hardening and Silent Bridge Skip

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

- [x] T001 Dispatch fresh Fable 5 xhigh debug seat; capture empirical root cause
- [x] T002 Enumerate all socket-server copies (2 real, 2 re-export shims)

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Bump shared module default to 64 (`shared/ipc/socket-server.ts`)
- [x] T004 Bump code-graph copy to 64 (`system-code-graph/.../ipc/socket-server.ts`)
- [x] T005 Pin knob=64 for 3 daemons in `opencode.json` (unicode-safe edit)
- [x] T006 [P] Pin knob in `.claude/mcp.json` + `.codex/config.toml`
- [x] T007 Debug-gate the plugin banner (`plugins/mk-code-graph.js`)
- [x] T008 Update ENV_REFERENCE row; rebuild both dists

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Dists carry 64; knob count 3+3+3 across configs
- [x] T010 Banner present in pre-fix sweep stderr, absent in post-fix sessions
- [x] T011 Strict validation + scoped commit

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks `[x]`, no `[B]`
- [x] Cap effective on next daemon spawn; banner gone for new sessions
- [x] Follow-ons filed (busy-reply on refusal, probe budget flag)

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`

<!-- /ANCHOR:cross-refs -->
