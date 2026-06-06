---
title: "Tasks: Runtime Defect Fixes [system-spec-kit/026-graph-and-context-optimization/008-runtime-defect-fixes/tasks]"
description: "Four verified fixes plus the documented sweep no-op."
trigger_phrases:
  - "runtime defect fixes tasks"
  - "026 008 tasks"
importance_tier: "normal"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-runtime-defect-fixes"
    last_updated_at: "2026-06-06T16:45:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "All tasks complete with smoke evidence"
    next_safe_action: "Commit alongside the 028 program work"
    blockers: []
    key_files:
      - "tasks.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Runtime Defect Fixes

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

- [x] T001 Verify all four defects live: bridge import targets MISSING ×3, codex hooks pointing at claude scripts ×3 entries, stale config note, catalog drift
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Re-point the three bridge imports to system-spec-kit dist + document the borrow (mk-code-graph-bridge.mjs)
- [x] T003 Rewire SessionStart → codex/session-start.js and UserPromptSubmit → codex/user-prompt-submit.js; keep PreCompact on the shared claude script (.codex/hooks.json)
- [x] T004 Correct the DB-path note: skill-local is the default, shared path is legacy (.codex/config.toml)
- [x] T005 Correct the Gemini catalog: active implementation in system-skill-advisor, spec-kit file is the shim (gemini-hook.md)
- [x] T006 Lease/owner-aware orphan sweep — NO-OP verified: all 9 launchers' parents are live sessions (6 Claude, 1 OpenCode TUI, incl. a 1d7h session); zero kills
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Smoke: bridge --minimal exit 0 with transportOnly true; codex session-start emits envelope (466-byte context); codex UPS emits valid fail-open envelope; hooks.json parses
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] REQ-001..REQ-004 verified with smoke evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Origin**: 028 transition program research + gap audits surfaced all four defects
- **Deferred sibling work**: launcher lifecycle fix → 028 skill-advisor workstream
<!-- /ANCHOR:cross-refs -->
