---
title: "Implementation Summary: Cursor MCP wiring + route-guard shape fix"
description: "Symlinked .cursor/mcp.json to the repo's .mcp.json, invalidating phase 011's no-MCP-server blocker; captured real MCP hook payloads; found mcp-route-guard.mjs was a silently-dead wire and fixed it, then wired it live."
trigger_phrases: ["cursor mcp wiring implementation", "mcp-route-guard dead wire fix"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/011-cursor-mcp-wiring-and-route-guard-fix"
    last_updated_at: "2026-07-27T03:47:58Z"
    last_updated_by: "claude-code"
    recent_action: "Implemented, verified, and validated"
    next_safe_action: "Commit"
    blockers: []
    key_files: [".cursor/mcp.json", ".opencode/skills/system-spec-kit/mcp-server/hooks/cursor/mcp-route-guard.mjs"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cursor-mcp-wiring-route-guard-fix", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- ANCHOR:metadata -->
## METADATA
| Field | Value |
|---|---|
| **Spec Folder** | 011-cursor-mcp-wiring-and-route-guard-fix |
| **Completed** | 2026-07-24 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## WHAT WAS BUILT

### The premise correction
Phase 011 deferred `mcp-route-guard.mjs` as blocked on *"no MCP server is configured for Cursor CLI on this machine… fabricating one was out of scope (would need credentials not present here)."* The operator challenged that, pointing at connected MCP servers in the session UI. Checking `.mcp.json` and `opencode.json` proved the framing wrong: this repo has **5 fully-configured MCP servers**, all local `npx`/`node` launchers against in-repo scripts, requiring **zero credentials**. Only the narrow mechanical claim held — Cursor reads solely `.cursor/mcp.json` / `~/.cursor/mcp.json`, which were absent / 0 bytes. The blocker was never "no servers exist"; it was "Cursor's own config file was never populated."

### MCP wiring
Cursor's documented schema (`mcpServers` / `command` string / `args` array / `env` object) is byte-compatible with Claude's `.mcp.json` — confirmed from Cursor's docs before acting. `.cursor/mcp.json` is now a relative symlink to `../.mcp.json`, so Cursor sees the same inventory with no third copy to drift. `cursor-agent mcp list` now lists all 5. (`opencode.json` was ruled out as a symlink source: different schema — `mcp` key, `command` as array, `environment` key.)

### The defect this exposed
With a real payload finally capturable, `beforeMCPExecution` and `afterMCPExecution` both proved to fire — and the captured shape contradicted the guard's core assumption. Cursor splits the server and tool into **separate** fields:

```
"mcp_server_name": "sequential_thinking",
"tool_name": "sequentialthinking",       <- BARE, no server prefix
"tool_input": "{\"thought\":\"...\"}",   <- a JSON *string*, not an object
```

The shared guard core parses only the two *packed* forms — `mcp__<server>__<tool>` or `<server>_<tool>`. The adapter forwarded Cursor's bare `tool_name` verbatim, so it could never match anything. Proven directly against the core rather than asserted:

| Input | Core result |
|---|---|
| `mcp__figma__get_screenshot` (Claude shape) | advisory |
| `figma_get_screenshot` (OpenCode shape) | advisory |
| `get_screenshot` (**Cursor's real shape**) | **silent** |

It was a silently-dead wire — the same defect class phase 011 correctly caught for `completion-evidence-stop.cjs`, but missed here because the field-name assumption looked reasonable and could not be tested at the time.

### The fix
`packServerAndTool()` recombines `mcp_server_name` + `tool_name` into the packed form before the core sees it, keeping runtime-specific shape knowledge in the adapter — the same separation `post-tool-use.mjs` already uses for its `Shell`→`Bash` normalization. The guard is now wired into `.cursor/hooks.json`'s `beforeMCPExecution` and live-fire confirmed firing during a real `--approve-mcps` dispatch.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## HOW IT WAS DELIVERED
1. Read `.mcp.json` and `opencode.json` directly rather than defending the earlier claim — establishing that 5 credential-free servers exist and that only Cursor's own config file was missing.
2. Confirmed Cursor's schema from Cursor's own documentation before creating anything, so "symlink is safe" was verified rather than assumed.
3. Created the symlink and confirmed recognition empirically via `cursor-agent mcp list`.
4. Built an isolated probe workspace (own `mcp.json` + `hooks.json`) logging the **full raw stdin** for both MCP events, and dispatched a real `--approve-mcps` call that genuinely invoked the tool — capturing actual payloads rather than inferring field names.
5. Read the shared core's parsers to locate exactly what shapes it accepts, then tested bare vs. both packed forms against the core directly. This is what converted "the assumption might be wrong" into a proven defect.
6. Fixed the adapter, then re-tested all four cases including both fail-open paths, confirming the fix did not weaken the safety behavior.
7. Wired the guard, live-fire confirmed it in the real repo with a temporary wrapper, then restored `.cursor/hooks.json` and `diff`-confirmed byte-identical.
8. Corrected the now-invalidated blocker language in the feature catalog and `hooks.md`.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## KEY DECISIONS
- **Symlink rather than copy.** Cursor's schema is byte-compatible with `.mcp.json`, so a symlink gives parity with zero drift risk — a copied file would silently diverge the moment either side changed. `opencode.json` could not participate; its schema genuinely differs.
- **Normalize in the adapter, not the core.** Changing the shared core to accept Cursor's split shape would push runtime-specific knowledge into code three other runtimes depend on. The adapter is the correct boundary, and this repo already established that precedent.
- **Prove the defect against the core before fixing it.** The mismatch was visible by reading the code, but reading is not evidence — testing bare vs. packed forms directly against the core turned a plausible hypothesis into a confirmed one, and also revealed that the first synthesis attempt (`sequential_thinking`) was silent for a *different, correct* reason (native servers aren't Code Mode families), which would otherwise have looked like the fix failing.
- **Wire it despite it staying silent today.** No Code Mode manifest family is currently a native Cursor server, so the guard will correctly not fire in the present config. That is its designed purpose — catching a *future* external server wired natively instead of through Code Mode — and it could never have fired even when it should have without this fix.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## VERIFICATION
| Item | Result |
|---|---|
| `cursor-agent mcp list` through the symlink (SC-001) | PASS — all 5 servers listed |
| Both MCP event payloads captured (SC-002) | PASS — field names recorded verbatim |
| Dead-wire defect proven against the core (SC-003) | PASS — bare silent, both packed forms advise |
| Post-fix advisory on a Cursor-shaped payload (SC-004) | PASS |
| Fail-open preserved (SC-005) | PASS — malformed + missing-field both plain allow |
| Live-fire in the real repo (SC-006) | PASS — `beforeMCPExecution-fired-1784915856` |
| `.cursor/hooks.json` restored byte-identical | PASS — `diff` clean |
| `node --check` on the fixed guard | PASS |
| `validate.sh 030-cli-cursor-creation --recursive --strict` | PASS across all 16 folders |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## KNOWN LIMITATIONS
1. The guard stays silent in today's configuration, because no Code Mode manifest family (`figma`, `github`, etc.) is a native Cursor server — those are reached through Code Mode's `call_tool_chain`. It fires only if someone later wires such a server natively, which is exactly the case it exists to catch.
2. `afterMCPExecution` is confirmed firing and its payload shape recorded, but nothing is wired to it — there is no Claude-side post-MCP counterpart to proxy to. The captured shape is documented so a future counterpart has the evidence ready.
3. The symlink inherits `code_mode`'s hardcoded absolute node path from `.mcp.json`, which is machine-specific. Pre-existing in that already-committed file; not introduced or worsened here, and out of scope to change.
4. `.cursor/mcp.json` is shared with the Cursor desktop editor, so the editor now also spawns these servers. Three of the five are multi-client daemons designed to share one resident process, so this is expected rather than duplicative.
<!-- /ANCHOR:limitations -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `tasks.md`, `checklist.md`
- `../009-cursor-hooks-lifecycle/003-cursor-hooks-claude-parity/implementation-summary.md` (the blocker this phase invalidates)
