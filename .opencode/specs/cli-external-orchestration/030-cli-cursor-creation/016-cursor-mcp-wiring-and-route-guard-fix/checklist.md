---
title: "Verification Checklist: Cursor MCP wiring + route-guard shape fix"
description: "Verification checklist for the Cursor MCP wiring and route-guard shape fix phase."
trigger_phrases: ["cursor mcp wiring checklist"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/016-cursor-mcp-wiring-and-route-guard-fix"
    last_updated_at: "2026-07-24T18:33:03Z"
    last_updated_by: "claude-code"
    recent_action: "All checklist items verified"
    next_safe_action: "Run validate.sh --strict, commit"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cursor-mcp-wiring-route-guard-fix", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Cursor MCP wiring + route-guard shape fix

All items below are checked — this phase is Complete.

<!-- ANCHOR:protocol -->
## Verification Protocol
| Priority | Handling |
|---|---|
| P0 | Must pass before this phase is Complete |
| P1 | Should pass; document any gap |
| P2 | Nice-to-have; document if skipped |
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## PRE-IMPLEMENTATION
- [x] CHK-001 [P0] Requirements documented in `spec.md`
- [x] CHK-002 [P0] Technical approach defined in `plan.md`
- [x] CHK-003 [P0] Cursor's `.cursor/mcp.json` schema confirmed from Cursor's own documentation (`mcpServers` / `command` string / `args` array / `env` object) BEFORE symlinking — not inferred from Claude's format
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## CODE QUALITY
- [x] CHK-004 [P0] `.cursor/mcp.json` is a relative symlink (`../.mcp.json`), not a duplicated copy that could drift
- [x] CHK-005 [P0] Payload normalization lives in the Cursor adapter, not the shared core — matching `post-tool-use.mjs`'s existing `Shell`→`Bash` precedent
- [x] CHK-006 [P0] The guard's status header no longer carries the false "no MCP server is configured / would need credentials" claim — replaced with `beforeMCPExecution is confirmed live-firing against cursor-agent 2026.07.23-e383d2b, with a real captured payload`
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## TESTING
- [x] CHK-007 [P0] `cursor-agent mcp list` lists all `5` repo servers through the symlink
- [x] CHK-008 [P0] Real payloads captured for BOTH events from a live `--approve-mcps` dispatch that actually invoked `sequentialthinking`
- [x] CHK-009 [P0] Dead-wire defect proven against the shared core, not asserted — bare `get_screenshot` silent vs. `mcp__figma__get_screenshot` advising
- [x] CHK-010 [P0] Post-fix: Cursor-shaped manifest-family payload produces the advisory; native `sequential_thinking` correctly stays silent
- [x] CHK-011 [P0] Fail-open preserved — malformed JSON and missing `mcp_server_name` both return a plain `{"permission":"allow"}`
- [x] CHK-012 [P0] `node --check` passes on the fixed guard
- [x] CHK-013 [P0] Live-fire in the real repo — `beforeMCPExecution-fired-1784915856` logged during a real MCP dispatch
- [x] CHK-014 [P0] `.cursor/hooks.json` restored and `diff`-confirmed byte-identical to its clean intended form after the live-fire wrapper
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## FIX COMPLETENESS
- [x] CHK-015 [P1] `afterMCPExecution` confirmed firing and its payload shape (`result_json`, `duration`) recorded, even though nothing is wired to it — so a future counterpart has the evidence ready
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## SECURITY
- [x] CHK-016 [P1] `grep -riE "sk-ant|sk-proj|CURSOR_(API_KEY|AUTH_TOKEN)\s*="` across the guard, `.cursor/hooks.json`, and this phase's docs → 0 matches
- [x] CHK-017 [P1] The symlink adds no new credential surface — all 5 servers are local `npx`/`node` launchers requiring no API keys
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## DOCUMENTATION
- [x] CHK-018 [P1] `feature-catalog.md`'s "unwired pending a configured MCP server" claim corrected
- [x] CHK-019 [P1] `hooks.md` moves the guard out of "Not Wired", adds the `beforeMCPExecution` row, and records the split-shape caveat
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## FILE ORGANIZATION
- [x] CHK-020 [P1] All `/tmp` probe artifacts deleted; only in-scope files touched
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary
| Category | Total | Verified |
|---|---|---|
| P0 Items | 14 | 14/14 |
| P1 Items | 6 | 6/6 |

**Verification Date**: 2026-07-24 — MCP wired via symlink, both events' real payloads captured, the dead-wire defect proven and fixed, guard live-fire confirmed.
<!-- /ANCHOR:summary -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `tasks.md`
