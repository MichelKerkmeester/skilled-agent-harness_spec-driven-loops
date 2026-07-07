---
title: "Implementation Summary: Phase 3: Runtime Integration [system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/003-runtime-integration/implementation-summary]"
description: "Shipped summary for Phase 3 Runtime Integration: code-index CLI fallback, bridge repair to the CLI route, allowlists, and docs."
trigger_phrases:
  - "code-index runtime integration result"
  - "002 003-runtime-integration result"
  - "code-index phase 3 result"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/003-runtime-integration"
    last_updated_at: "2026-06-09T20:17:55Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Reconciled shipped code-index runtime evidence"
    next_safe_action: "Run final multi-runtime transport-down drill"
    blockers: []
    key_files:
      - "implementation-summary.md"
    completion_pct: 95
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
| **Spec Folder** | 003-runtime-integration |
| **Completed** | Shipped; observation window in progress |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The code-index runtime integration shipped a warm-only CLI fallback helper wired into the Claude/Codex session adapters (socket probe first, exit-75 skip, no prompt-time cold spawn) and REPAIRED the mk-code-graph bridge: in-process dist/DB imports were replaced with the CLI route, the plugin synthesizes its transport contract from the status payload, and maintenance tools are blocked at prompt time. Codex allowlist and AGENTS.md policy guidance landed alongside; MCP registrations stayed untouched.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/hooks/code-index-cli-fallback.ts` | Added | Shared warm-only code-index CLI fallback helper |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts` | Modified | Claude session adapter gains the code-index CLI warm path |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/session-start.ts` | Modified | Codex session adapter gains the code-index CLI warm path |
| `.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs` | Modified | Bridge repaired to the CLI route; no in-process dist/DB imports |
| `.opencode/plugins/mk-code-graph.js` | Modified | Plugin synthesizes its transport contract from the status payload |
| `.codex/settings.json` | Modified | Codex allowlist for CLI use |
| `AGENTS.md` | Modified | Transport-down fallback + maintenance-tool policy guidance |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivery stayed additive to the MCP registration: the hook path is warm-only (socket probe first, exit-75 skip, no prompt-time cold spawn) and the bridge repair removed the reverted in-process import approach in favor of the CLI/IPC route. Verified with a clean build, the plugin vitest suite green, a warm smoke returning a real payload, a maintenance-block smoke, and an MCP-registration diff showing no changes.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Scope inherited verbatim from the research record + program pairing rule | The research terminally classified the risks; the pairing rule is operator-directed program scope |
| Bridge repaired via the CLI route, never in-process imports | The import-only repair tried in 026/008 was reverted as a direct-DB dual-writer hazard |
| Maintenance tools blocked at prompt time | scan/apply/verify must never run from prompt-time hooks |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Build | Clean |
| Plugin vitest | Suite green |
| Warm smoke | Real payload returned over the CLI route |
| Maintenance-block smoke | Prompt-time maintenance tools blocked as scoped |
| MCP registrations | Diff-empty (untouched) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The dual-stack observation window remains open by design; the final program-level multi-runtime transport-down drill is tracked outside this phase's shipped implementation.
<!-- /ANCHOR:limitations -->
