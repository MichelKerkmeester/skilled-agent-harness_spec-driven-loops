---
title: "Implementation Summary: Phase 3: Runtime Integration [system-spec-kit/028-mcp-to-cli-tool-transition/001-spec-memory-cli/003-runtime-integration/implementation-summary]"
description: "Shipped summary for Phase 3 Runtime Integration: spec-memory CLI fallback, OpenCode plugin, and runtime guidance."
trigger_phrases:
  - "cli runtime integration implementation-summary"
  - "spec-memory allowlist implementation-summary"
  - "dual-stack rollout implementation-summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-mcp-to-cli-tool-transition/001-spec-memory-cli/003-runtime-integration"
    last_updated_at: "2026-06-09T19:10:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Reconciled shipped spec-memory runtime evidence"
    next_safe_action: "Continue dual-stack observation window"
    blockers: []
    key_files:
      - "implementation-summary.md"
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 028-mcp-to-cli-tool-transition/001-spec-memory-cli/003-runtime-integration |
| **Completed** | Shipped; observation window in progress |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The spec-memory runtime integration shipped warm-only CLI fallback paths for prompt-time hooks, a new OpenCode plugin and CLI bridge, runtime allowlist updates, and transport-down operator guidance. The prompt-time path probes the socket first, fails open in the no-socket case, and does not cold-spawn from prompt-time hooks.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/hooks/spec-memory-cli-fallback.ts` | Added | Shared warm-only CLI fallback helper |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts` | Modified | Claude hook path can use CLI fallback |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts` | Modified | Claude compaction path can use CLI fallback |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts` | Modified | Claude stop hook can use CLI fallback |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/session-start.ts` | Modified | Codex session-start hook can use CLI fallback |
| `.opencode/plugins/mk-spec-memory.js` | Added | OpenCode spec-memory plugin surface |
| `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/mk-spec-memory-bridge.mjs` | Added | CLI/IPC bridge with zero in-process DB imports |
| `.codex/settings.json` | Modified | Codex allowlist for CLI use |
| `.claude/settings.local.json` | Modified | Claude allowlist for CLI use |
| `AGENTS.md` | Modified | Transport-down fallback guidance |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivery stayed additive to the MCP registration. Prompt-time hooks use the warm-only helper with socket probe first, 1ms fail-open no-socket behavior, a 117ms warm path, and no prompt-time cold spawn. The OpenCode plugin bridge uses CLI/IPC transport only and does not import database internals.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Prompt-time hooks are warm-only | Cold spawn remains confined to SessionStart, explicit prewarm, cron, or non-prompt maintenance contexts |
| OpenCode bridge uses CLI/IPC only | The plugin must not reintroduce in-process DB access while MCP transport is down |
| MCP registrations remain untouched | The CLI is additive during the dual-stack window |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Build | Clean |
| Hook smoke | Both no-socket fail-open and warm paths passed |
| Bridge syntax | `node --check` passed |
| Bridge warm smoke | `status ok`, route `cli` |
| MCP registrations | Diff-empty |
| Requirements | REQ-001 through REQ-008 pass; REQ-005 observation remains in progress, not failed |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. REQ-005 dual-stack observation remains in progress by nature and is not failed.
2. Final program-level transport-down multi-runtime drill remains tracked outside this phase's shipped implementation.
<!-- /ANCHOR:limitations -->
