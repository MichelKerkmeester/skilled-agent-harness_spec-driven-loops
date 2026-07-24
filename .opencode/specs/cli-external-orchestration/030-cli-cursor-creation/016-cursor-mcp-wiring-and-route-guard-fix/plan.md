---
title: "Implementation Plan: Cursor MCP wiring + route-guard shape fix"
description: "Plan for symlinking .cursor/mcp.json, capturing real MCP hook payloads, and fixing the route guard's shape mismatch."
trigger_phrases: ["cursor mcp wiring plan"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/016-cursor-mcp-wiring-and-route-guard-fix"
    last_updated_at: "2026-07-24T18:05:09Z"
    last_updated_by: "claude-code"
    recent_action: "All phases complete"
    next_safe_action: "None - phase complete"
    blockers: []
    key_files: ["spec.md", "checklist.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cursor-mcp-wiring-route-guard-fix", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Cursor MCP wiring + route-guard shape fix

<!-- ANCHOR:summary -->
## 1. SUMMARY
Verify the repo's real MCP inventory, confirm Cursor's schema is byte-compatible with `.mcp.json`, symlink `.cursor/mcp.json`, capture real `beforeMCPExecution`/`afterMCPExecution` payloads, prove the route guard forwards an unmatched shape, fix it, wire it, and correct the invalidated blocker language across three docs.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- [x] Cursor schema confirmed from Cursor's own docs before symlinking.
- [x] `cursor-agent mcp list` recognizes servers through the symlink.
- [x] Real payloads captured for both MCP events.
- [x] Dead-wire defect proven by direct core testing, not asserted.
- [x] Fix verified; fail-open preserved.
- [x] Live-fire confirmed; clean `.cursor/hooks.json` restored byte-identical.
- [x] Invalidated doc claims corrected.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
Three small, independent changes: (1) a filesystem symlink giving Cursor the repo's existing MCP inventory with no duplicated config; (2) a payload-normalization fix inside the Cursor adapter — recombining `mcp_server_name` + `tool_name` into the packed `mcp__<server>__<tool>` string the shared core parses — keeping all runtime-specific shape knowledge in the adapter rather than the core; (3) one new `beforeMCPExecution` entry in `.cursor/hooks.json`.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
| Surface | Current Role | Action | Verification |
|---|---|---|---|
| `.cursor/mcp.json` (new) | Did not exist | Symlink to `../.mcp.json` | `cursor-agent mcp list` |
| `mcp-route-guard.mjs` | Built, unwired, dead-wire shape | Recombine split fields | Before/after core comparison |
| `.cursor/hooks.json` | Live hook wiring | Add `beforeMCPExecution` | Live-fire marker log |
| `feature-catalog.md` | Hub catalog | Correct blocker claim | Grep |
| `hooks.md` | Cross-runtime reference | Move out of "Not Wired" | Grep |
<!-- /ANCHOR:affected-surfaces -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Establish the real premise
- [x] Read `.mcp.json` — found 5 configured servers, all local `npx`/`node` launchers, zero API keys required.
- [x] Read `opencode.json`'s `mcp` block — same 5 servers, but a DIFFERENT schema (`mcp` key, `command` as array, `environment` key), so not a symlink candidate.
- [x] Confirmed `.cursor/mcp.json` absent and `~/.cursor/mcp.json` 0 bytes; `cursor-agent mcp list` reported none — so the narrow claim was true, but the "would need credentials" framing was not.
- [x] `WebFetch` against Cursor's own MCP docs — confirmed the schema is `mcpServers` / `command` string / `args` array / `env` object, byte-compatible with `.mcp.json`.

### Phase 2: Wire MCP and capture real payloads
- [x] Created `.cursor/mcp.json` as a relative symlink to `../.mcp.json`.
- [x] `cursor-agent mcp list` now lists all 5 servers ("needs approval", expected).
- [x] Built an isolated probe workspace with its own `mcp.json` + `hooks.json` logging the full raw stdin for both MCP events.
- [x] Dispatched a real `--approve-mcps` call that actually invoked the `sequentialthinking` tool; captured both payloads.

### Phase 3: Find and fix the shape mismatch
- [x] Read the shared core's parsers — only `mcp__<server>__<tool>` (`parseClaudeShape`) and `<server>_<tool>` (`parseOpenCodeShape`) are recognized.
- [x] Tested the core directly: bare `get_screenshot` → silent; `mcp__figma__get_screenshot` → advisory; `figma_get_screenshot` → advisory. Confirmed the guard's forwarded shape can never match.
- [x] Fixed `mcp-route-guard.mjs` to recombine `mcp_server_name` + `tool_name`; rewrote its now-false status header.
- [x] Re-tested: Cursor-shaped manifest-family payload → advisory; native server → correctly silent; malformed and missing-field → fail-open.

### Phase 4: Wire, verify, document
- [x] Added the `beforeMCPExecution` entry to `.cursor/hooks.json`.
- [x] Live-fire confirmed in the real repo via a temporary wrapper during a real MCP dispatch; restored the clean file and diffed byte-identical.
- [x] Corrected the invalidated blocker language in the feature catalog and `hooks.md`.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Layered, each layer independently falsifiable: real payload capture (what Cursor actually sends), direct core testing of bare vs. packed shapes (whether the mismatch is real), post-fix adapter testing including fail-open cases (whether the fix works without weakening safety), and a real-repo live-fire dispatch (whether the wiring actually delivers). No step relies on reading the code and asserting behavior.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
| Dependency | Type | Status | Impact if Blocked |
|---|---|---|---|
| Repo `.mcp.json` | Internal | Green — 5 servers, no credentials | Symlink target |
| Cursor MCP schema docs | External | Green — confirmed compatible | Justifies symlink over a copy |
| Shared `mcp-route-guard.cjs` core | Internal | Green | Defines the shape the adapter must produce |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
`rm .cursor/mcp.json` (Cursor returns to seeing no servers), remove the `beforeMCPExecution` entry from `.cursor/hooks.json`, and `git checkout` the guard. All three are independent; the guard is fail-open, so even a mid-flight partial revert cannot block an MCP call.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
Closes the deferred `mcp-route-guard.mjs` item phase 011 left unwired; extends phase 010's `.cursor/hooks.json`.
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION
| Phase | Complexity | Estimated Effort |
|---|---|---|
| Establish premise + schema confirmation | Low | 20 min |
| Payload capture | Medium | 20 min |
| Find + fix shape mismatch | Medium | 30 min |
| Wire, verify, document | Low | 25 min |
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK
Three independently reversible changes, none of which can block work when reverted — the guard fails open by design and the symlink's removal simply returns Cursor to its prior no-servers state.
<!-- /ANCHOR:enhanced-rollback -->

---

## RELATED DOCUMENTS
- `spec.md`, `tasks.md`, `checklist.md`
