---
title: "Tasks: Cursor MCP wiring + route-guard shape fix"
description: "Task breakdown for symlinking .cursor/mcp.json and fixing the route guard's shape mismatch."
trigger_phrases: ["cursor mcp wiring tasks"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/016-cursor-mcp-wiring-and-route-guard-fix"
    last_updated_at: "2026-07-24T18:05:09Z"
    last_updated_by: "claude-code"
    recent_action: "All tasks complete"
    next_safe_action: "Run validate.sh --strict, commit"
    blockers: []
    key_files: ["spec.md", "plan.md", "checklist.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cursor-mcp-wiring-route-guard-fix", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Cursor MCP wiring + route-guard shape fix

<!-- ANCHOR:notation -->
## Task Notation
`T### [P?] Description (file path)` - `[P]` marks tasks that could run in parallel.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 Read `.mcp.json` — `5` configured servers (`sequential_thinking`, `mk-spec-memory`, `mk_skill_advisor`, `mk_code_index`, `code_mode`), all local `npx`/`node` launchers, zero API keys
- [x] T002 Read `opencode.json`'s `mcp` block — same 5 servers but a different schema (`mcp` key, `command` as array, `environment` key), ruling it out as a symlink source
- [x] T003 Confirmed `.cursor/mcp.json` absent, `~/.cursor/mcp.json` `0` bytes, `cursor-agent mcp list` reporting none — the narrow claim held, the "needs credentials" framing did not
- [x] T004 `WebFetch` on Cursor's MCP docs — schema confirmed as `mcpServers` / `command` string / `args` array / `env` object, byte-compatible with `.mcp.json`
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T005 Created `.cursor/mcp.json` as a relative symlink (`../.mcp.json`); `cursor-agent mcp list` now lists all 5 servers
- [x] T006 Built an isolated probe workspace logging full raw stdin for `beforeMCPExecution`/`afterMCPExecution`; dispatched a real `--approve-mcps` call that invoked `sequentialthinking`
- [x] T007 Captured both payloads — `beforeMCPExecution` carries `mcp_server_name`, a BARE `tool_name`, `tool_input` (a JSON string), `command`, `workspace_roots`; `afterMCPExecution` adds `result_json` + `duration`
- [x] T008 Read the shared core's parsers — only `mcp__<server>__<tool>` and `<server>_<tool>` are recognized; Cursor's split shape matches neither
- [x] T009 Proved the defect directly against the core: bare `get_screenshot` → silent, `mcp__figma__get_screenshot` → advisory, `figma_get_screenshot` → advisory
- [x] T010 Fixed `mcp-route-guard.mjs` — added `packServerAndTool()` recombining `mcp_server_name` + `tool_name`; rewrote the false "no MCP server configured" status header
- [x] T011 Added the `beforeMCPExecution` entry to `.cursor/hooks.json`
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T012 `node --check` on the fixed guard — passes
- [x] T013 Post-fix adapter tests — Cursor-shaped `figma` payload → advisory; native `sequential_thinking` → correctly silent; malformed JSON → fail-open; missing `mcp_server_name` → fail-open
- [x] T014 Live-fire in the REAL repo via a temporary wrapper during an `--approve-mcps` dispatch → `beforeMCPExecution-fired-1784915856` logged
- [x] T015 Restored `.cursor/hooks.json` and confirmed `diff` byte-identical to the clean intended version; deleted all `/tmp` probe artifacts
- [x] T016 Corrected the invalidated blocker language in `feature-catalog.md` and `hooks.md`
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
- [x] T017 `validate.sh 016-cursor-mcp-wiring-and-route-guard-fix --strict` passes 0/0; SC-001..SC-006 met; `implementation-summary.md` written
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
- Closes the `mcp-route-guard.mjs` item phase 011 deferred as blocked.
<!-- /ANCHOR:cross-refs -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `checklist.md`
