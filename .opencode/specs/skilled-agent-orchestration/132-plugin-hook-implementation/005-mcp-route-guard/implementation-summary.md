---
title: "Implementation Summary: External MCP Route Guard (planning stub)"
description: "Planning stub. This phase is planned and not yet implemented; it makes no completion claims and lists only intended deliverables."
trigger_phrases:
  - "mcp route guard summary"
  - "guard planning stub"
  - "code mode guard status"
  - "warn-only guard plan state"
  - "external mcp guard intended"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-plugin-hook-implementation/005-mcp-route-guard"
    last_updated_at: "2026-07-11T09:03:30.904Z"
    last_updated_by: "spec-author"
    recent_action: "Marked implementation-summary as a planning stub; no work has been implemented"
    next_safe_action: "Populate this stub only after the guard ships and verification passes"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-code-mode/runtime/lib/mcp-route-guard.cjs"
      - ".opencode/plugins/mk-mcp-route-guard.js"
      - ".opencode/skills/mcp-code-mode/runtime/hooks/claude/mcp-route-guard.cjs"
      - ".claude/settings.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/005-mcp-route-guard"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Manifest-strict vs broad-advisory posture (ADR-002) awaits an operator ruling"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-mcp-route-guard |
| **Status** | Planned (not implemented) |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase is planned and not yet implemented. Nothing has been built. This stub records the intended deliverables so a later pass can replace it with the real summary once the guard ships and passes verification.

### External MCP Route Guard (planned)

The intended work adds a warn-first, never-block advisory that nudges a native external MCP tool call toward Code Mode `call_tool_chain`, and only for families Code Mode can route (present in `.utcp_config.json`). The design is a runtime-neutral policy core plus two thin adapters (an OpenCode `tool.execute.before` plugin and a Claude `PreToolUse` hook).

### Files Changed

No files have changed yet. The table below lists the intended targets for the implementation pass.

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/mcp-code-mode/runtime/lib/mcp-route-guard.cjs` | Planned Create | Runtime-neutral policy core (`evaluateNativeMcpCall`) |
| `.opencode/plugins/mk-mcp-route-guard.js` | Planned Create | OpenCode warn-only, log-only adapter |
| `.opencode/skills/mcp-code-mode/runtime/hooks/claude/mcp-route-guard.cjs` | Planned Create | Claude PreToolUse advisory hook |
| `.claude/settings.json` | Planned Modify | New `mcp__claude_ai_.*` matcher block |
| `.opencode/skills/mcp-code-mode/runtime/lib/mcp-route-guard.test.cjs` | Planned Create | Table-driven unit test plus Claude-hook integration test |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. Delivery, testing, and rollout will be recorded here after the implementation pass completes and the verification checklist has real evidence.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Shared core plus two thin adapters (ADR-001) | One tested source of truth for the warn policy so both runtimes stay in lockstep |
| Advisory, fail-open, warn-only posture with an env kill-switch (ADR-002) | Match the warn-first mandate and guarantee a guard bug never blocks a call |
| Default to manifest-strict; broad mode behind an env flag (ADR-002) | Keep every warning actionable while leaving the coverage nudge one flag away |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

No verification has run. The checklist items stay unchecked until there is real evidence.

| Check | Result |
|-------|--------|
| Table-driven unit test for `evaluateNativeMcpCall` | Not yet run (planning stage) |
| Claude-hook integration test | Not yet run (planning stage) |
| `validate.sh --strict` for this phase | See the phase author return notes |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not implemented.** This is a planning stub; no code exists yet.
2. **Value ceiling under manifest-strict.** The active warn-set today is essentially one family (ClickUp). The larger native connectors (Webflow, Notion, Gmail, Calendar, Drive) are absent from `.utcp_config.json`, so the guard correctly stays silent on them. Value scales as manifest coverage grows.
3. **OpenCode surface is dormant.** OpenCode registers no native external MCP today, so its adapter is parity-only until one is added to `opencode.json`.
<!-- /ANCHOR:limitations -->
