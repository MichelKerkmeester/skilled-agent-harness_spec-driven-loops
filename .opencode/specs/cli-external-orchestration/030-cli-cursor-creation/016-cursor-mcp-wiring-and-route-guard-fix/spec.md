---
title: "Feature Specification: Cursor MCP wiring + route-guard shape fix"
description: "Symlink .cursor/mcp.json to the repo's existing .mcp.json (identical schema), which invalidated phase 011's no-MCP-server blocker; live-captured real beforeMCPExecution/afterMCPExecution payloads; found and fixed mcp-route-guard.mjs forwarding a shape the shared core can never match, then wired it."
trigger_phrases: ["cursor mcp.json symlink", "beforeMCPExecution payload", "mcp-route-guard cursor fix"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/016-cursor-mcp-wiring-and-route-guard-fix"
    last_updated_at: "2026-07-24T18:33:03Z"
    last_updated_by: "claude-code"
    recent_action: "mcp.json symlinked; route-guard shape fixed and wired"
    next_safe_action: "Run validate.sh --strict, commit"
    blockers: []
    key_files: [".cursor/mcp.json", ".cursor/hooks.json", ".opencode/skills/system-spec-kit/mcp-server/hooks/cursor/mcp-route-guard.mjs"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cursor-mcp-wiring-route-guard-fix", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: ["Populate .cursor/mcp.json how: symlink to the repo's .mcp.json -- Cursor's documented schema is byte-compatible with Claude's (mcpServers / command string / args array / env object), confirmed against Cursor's own docs and then empirically via cursor-agent mcp list.", "OpenCode's opencode.json was NOT a symlink candidate: different schema (mcp key, command as array, environment key).", "Wire mcp-route-guard.mjs: yes -- the phase 011 blocker (no configured server) is gone, and a real payload capture let its actual field assumption be corrected first."]
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Cursor MCP wiring + route-guard shape fix

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|---|---|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-24 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `cli-external-orchestration/030-cli-cursor-creation` |
| **Predecessor** | `../015-hook-code-style-cross-runtime/spec.md` |
| **Successor** | `../017-codex-claude-hooks-discovery-mirrors/spec.md` |
| **Handoff Criteria** | `.cursor/mcp.json` resolves and `cursor-agent mcp list` sees the repo's servers; real `beforeMCPExecution`/`afterMCPExecution` payloads are captured and recorded; `mcp-route-guard.mjs` forwards a shape the shared core actually matches, proven by a before/after comparison against the core; the guard is wired and live-fire confirmed in the real repo. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 011 recorded a blocker: *"no MCP server is configured for Cursor CLI on this machine… fabricating one was out of scope (would need credentials not present here),"* and on that basis deliberately left `mcp-route-guard.mjs` built-but-unwired. The operator challenged the premise directly, pointing at 11 connected MCP servers in the session UI.

The premise was wrong in the part that mattered. This repo has **5 fully-configured MCP servers** in `.mcp.json` (Claude) and the same 5 in `opencode.json` (OpenCode) — all local `npx`/`node` launchers against in-repo scripts, requiring **zero credentials**. What was narrowly true is that Cursor reads only its own `.cursor/mcp.json` / `~/.cursor/mcp.json`, and those were absent / 0 bytes. So the real blocker was never "no servers exist" — it was "Cursor's config file was never populated," which needs no credentials at all.

Removing that blocker then exposed a second, more serious problem. With a real payload finally capturable, `beforeMCPExecution`'s actual shape turned out to contradict the guard's core assumption: Cursor emits the server and tool in **separate** fields (`mcp_server_name` + a bare `tool_name`), whereas the shared guard core only parses the two *packed* forms (`mcp__<server>__<tool>` or `<server>_<tool>`). The guard as written forwarded the bare tool name verbatim — matching nothing, always. It was a silently-dead wire.

### Purpose
Populate `.cursor/mcp.json` (as a symlink, since Cursor's schema is byte-compatible with `.mcp.json`), capture the real `beforeMCPExecution`/`afterMCPExecution` payloads, correct `mcp-route-guard.mjs`'s shape handling against that real evidence, and wire it — closing phase 011's deferred item with the assumption actually verified rather than inferred.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read `.mcp.json` and `opencode.json` to establish what MCP servers actually exist and in which schema.
- Confirm Cursor's own `.cursor/mcp.json` schema from Cursor's documentation before assuming compatibility.
- Create `.cursor/mcp.json` as a relative symlink to `.mcp.json`; confirm `cursor-agent mcp list` recognizes the servers.
- Probe `beforeMCPExecution`/`afterMCPExecution` in an isolated workspace with a real MCP dispatch (`--approve-mcps`) and capture the full raw payloads.
- Compare the captured shape against the shared guard core's actual parsers; empirically test bare vs. packed forms against the core.
- Fix `mcp-route-guard.mjs` to recombine `mcp_server_name` + `tool_name` into the packed shape; keep fail-open behavior.
- Wire the guard into `.cursor/hooks.json`'s `beforeMCPExecution`; live-fire confirm in the real repo; restore the clean file.
- Correct the now-invalidated blocker language in the feature catalog and `hooks.md`.

### Out of Scope
- Adding external Code Mode manifest servers (`figma`, `github`, etc.) to `.cursor/mcp.json` — they are reached through Code Mode's `call_tool_chain`, not as separate native Cursor servers; the guard exists precisely to advise when someone wires one natively instead.
- `afterMCPExecution` adapter — the event is confirmed firing and its payload recorded, but no Claude-side counterpart exists to proxy to, so nothing is wired for it.
- Changing the shared Claude guard core to accept a split shape — the adapter is the correct place to normalize a runtime-specific payload, matching how `post-tool-use.mjs` already normalizes `Shell`→`Bash`.
- `code_mode`'s machine-specific absolute node path inside `.mcp.json` — a pre-existing condition inherited by the symlink, not introduced here.

### Files to Change
| File Path | Change Type | Description |
|---|---|---|
| `.cursor/mcp.json` | Create | Relative symlink to `../.mcp.json`. |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/mcp-route-guard.mjs` | Modify | Recombine split server/tool fields into the packed shape; rewrite the now-false status header. |
| `.cursor/hooks.json` | Modify | Add the `beforeMCPExecution` entry. |
| `.opencode/skills/cli-external-orchestration/feature-catalog/feature-catalog.md` | Modify | Correct the "unwired pending a configured MCP server" claim. |
| `.opencode/skills/sk-code/code-opencode/references/shared/hooks.md` | Modify | Move the guard out of "Not Wired"; add the event row and the split-shape caveat. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Priority |
|---|---|---|
| REQ-001 | Cursor's `.cursor/mcp.json` schema is confirmed from Cursor's own documentation before any symlink is created, not assumed from Claude's format. | P0 |
| REQ-002 | `cursor-agent mcp list` recognizes the repo's servers through the symlink. | P0 |
| REQ-003 | Real `beforeMCPExecution` and `afterMCPExecution` payloads are captured from a live dispatch and their exact field names recorded. | P0 |
| REQ-004 | The guard's shape handling is corrected against that captured evidence, and the fix is proven by testing bare vs. packed forms directly against the shared core. | P0 |
| REQ-005 | The guard preserves fail-open behavior for malformed payloads and for a missing `mcp_server_name`. | P0 |
| REQ-006 | The guard is wired and live-fire confirmed firing in the real repo; `.cursor/hooks.json` is restored byte-identical to its clean form afterward. | P0 |
| REQ-007 | Every doc carrying the now-invalidated "no MCP server configured" blocker is corrected. | P1 |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- **SC-001**: `cursor-agent mcp list` lists all 5 repo servers through the symlink. **MET** — all 5 shown as "needs approval" (expected; `--approve-mcps` grants it per dispatch).
- **SC-002**: Real payloads captured for both events. **MET** — `beforeMCPExecution` carries `mcp_server_name`, bare `tool_name`, `tool_input` (a JSON **string**), `command`, `workspace_roots`; `afterMCPExecution` adds `result_json` + `duration`.
- **SC-003**: The dead-wire defect is proven, not asserted. **MET** — against the shared core, `mcp__figma__get_screenshot` and `figma_get_screenshot` both advise; bare `get_screenshot` (Cursor's real shape) returns nothing.
- **SC-004**: Post-fix, a Cursor-shaped manifest-family payload produces the advisory. **MET**.
- **SC-005**: Fail-open preserved for malformed input and missing `mcp_server_name`. **MET** — both return a plain allow.
- **SC-006**: Live-fire confirmed in the real repo. **MET** — `beforeMCPExecution-fired-1784915856` logged during a real `--approve-mcps` dispatch; `.cursor/hooks.json` then diffed byte-identical to its clean form.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
- **`.cursor/mcp.json` is shared with the Cursor desktop editor**, so the editor now also spawns these 5 servers. Mitigation: they are the same launchers the operator already runs for Claude/OpenCode, and three are multi-client daemons (`SPECKIT_MAX_SECONDARY_CLIENTS: 64`) designed to share a resident process rather than duplicate it.
- **The symlink inherits `code_mode`'s hardcoded absolute node path** from `.mcp.json`. Mitigation: pre-existing in the already-committed `.mcp.json`; the symlink neither introduces nor worsens it, and fixing it belongs to whoever owns that file.
- **The guard advises only for Code Mode manifest families**, none of which are currently native Cursor servers — so in today's config it will correctly stay silent. Mitigation: that is its designed purpose (catch a *future* external server wired natively); the fix was still required, since without it the guard could never fire even when it should.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS
- **NFR-C01**: Runtime-specific payload normalization stays in the Cursor adapter, never in the shared core, matching `post-tool-use.mjs`'s existing `Shell`→`Bash` precedent.

## 8. EDGE CASES
- A server whose `mcp_server_name` contains characters that collide with the `__` separator would produce an ambiguous packed string; not observed in any captured payload, and the core's own parser already handles multi-segment server tokens.
- `afterMCPExecution` fires but is unwired — if a Claude-side post-MCP counterpart is ever added, the captured payload shape (`result_json`, `duration`) is already recorded here for it.

## 9. COMPLEXITY ASSESSMENT
| Dimension | Score | Notes |
|---|---|---|
| Scope | 9/25 | One symlink, one small code fix, one hooks.json entry, three doc corrections. |
| Risk | 11/25 | Real behavior change (editor also spawns servers; a new hook fires on every MCP call), mitigated by fail-open design and live-fire verification. |
| Research | 10/20 | Required Cursor schema confirmation, a real payload capture, and reading the shared core's parser to locate the mismatch. |
| **Total** | **30/70** | **Level 2** |

## 10. RISK MATRIX
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Guard mis-parses an unusual server name | Low | Low (fails open to allow) | Fail-open verified for malformed + missing-field cases |
| Editor spawns 5 servers unexpectedly | Medium | Low (same launchers already running; daemons are multi-client) | Documented in the catalog's cross-surface note |
| Doc claims drift from the corrected reality | Low | Medium (misleads a future reader) | All three carrying docs corrected in this phase |

## 11. USER STORIES
- As the operator, I want Cursor to see the same MCP servers Claude and OpenCode already use, without maintaining a third copy of the config.
- As a maintainer, I want a guard that actually fires when it should — not one that silently matches nothing because it forwards the wrong shape.

## 12. OPEN QUESTIONS
None — the premise was corrected against real evidence and the resulting defect was fixed and verified.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- `plan.md`, `tasks.md`, `checklist.md` (this phase)
- `../015-hook-code-style-cross-runtime/spec.md` (predecessor)
- `../011-cursor-hooks-claude-parity/implementation-summary.md` (source of the blocker this phase invalidates)
- `.opencode/skills/mcp-code-mode/runtime/lib/mcp-route-guard.cjs` (the shared core whose parser shape drove the fix)
