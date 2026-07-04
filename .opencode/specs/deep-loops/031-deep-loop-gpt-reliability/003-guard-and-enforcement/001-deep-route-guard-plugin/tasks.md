---
title: "Tasks: Detection-Layer Sub-Agent-Routing Enforcement Plugin"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "deep route guard plugin"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-gpt-reliability/003-guard-and-enforcement/001-deep-route-guard-plugin"
    last_updated_at: "2026-07-01T16:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "All 12 tasks complete; validate.sh --strict passing"
    next_safe_action: "Proceed to phase 012"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-011-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Detection-Layer Sub-Agent-Routing Enforcement Plugin

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

- [x] T001 Confirm phases 008-010 are complete.
- [x] T002 Plugin home: `.opencode/plugins/mk-deep-loop-guard.js` (renamed 2026-07-01 from `deep-route-guard.js` for `mk-*` naming parity), matching the repo's own established convention (5 existing plugins there, per `.opencode/plugins/README.md`: "OpenCode 1.3.17+ auto-loads JavaScript files in `.opencode/plugins/` at session start... default export only.")
- [x] T003 Confirmed from `@opencode-ai/plugin` SDK types: `"tool.execute.before"?: (input: {tool, sessionID, callID}, output: {args: any}) => Promise<void>`. Default-export-only confirmed both from the SDK's `PluginModule`/`Plugin` types and explicitly from `.opencode/plugins/README.md`'s own load-bearing warning (a stray named export drops the entire file).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Implemented: reads `mode-registry.json`, builds an `agent -> mode` map, and for any `task` dispatch whose `subagent_type` matches a registry entry, extracts a `mode=X` token from the prompt text and compares it against the entry's `workflowMode`.
- [x] T005 Implemented: registry load wrapped in try/catch returning `null` on failure (missing file, malformed JSON); the mismatch check short-circuits (returns, no action) whenever the registry is unavailable, an unexpected arg shape is seen, or `subagent_type`/`mode` tokens are absent.
- [x] T006 Implemented both: default is mutate-and-warn (`console.error`, no blocking); `MK_DEEP_LOOP_GUARD_REJECT=1` env var (renamed 2026-07-01 from `DEEP_ROUTE_GUARD_REJECT`) switches to throw-based rejection. Kept both as a permanent, intentional toggle rather than removing one -- see `implementation-summary.md` Key Decisions for the reasoned deviation from the plan's "remove the unused path" instruction.
- [x] T007 Hard limits documented in the plugin's own header comment (no hard identity; no semantic-content catch; fails open on its own errors).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Live-tested via `opencode run --agent general "...use the task tool..."` with a deliberately mismatched dispatch (`subagent_type=ai-council`, prompt containing `mode=research`): hook fired, logged `[deep-route-guard] WARN: ... mode mismatch ...`, task completed normally (default warn mode).
- [x] T009 Live-tested with `DEEP_ROUTE_GUARD_REJECT=1` set: the same mismatched dispatch's `task` tool call status became `"error"`, and the calling agent's own final text confirmed: "The exact task dispatch was attempted once. It was blocked by deep-route-guard...". **Definitive answer: throw-based rejection DOES actually block the dispatch on this OpenCode install (v1.17.11).**
- [x] T010 Both paths are genuinely functional (confirmed by T008/T009), not one confirmed-working and one dead -- kept both as a configurable toggle (default warn / opt-in reject) rather than deleting a working capability. Documented as an intentional, reasoned deviation from the plan's original "remove the unused path" framing.
- [x] T011 Live-tested `subagent_type=review` (not a registry entry) with `DEEP_ROUTE_GUARD_REJECT=1` still set: task completed normally, "OK" reply -- confirms the guard only acts on the 4 deep-mode agents.
- [x] T012 Ran `validate.sh --strict`: see `implementation-summary.md` Verification.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Hook registration confirmed (T008).
- [x] Fail-closed-vs-warn question answered with evidence (T009).
- [x] Strict spec validation passes (T012).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Predecessor**: `../010-ai-council-subagent-only/`
- **Research**: `../007-gpt-behavioral-hardening-research/research/research.md`
<!-- /ANCHOR:cross-refs -->

---
