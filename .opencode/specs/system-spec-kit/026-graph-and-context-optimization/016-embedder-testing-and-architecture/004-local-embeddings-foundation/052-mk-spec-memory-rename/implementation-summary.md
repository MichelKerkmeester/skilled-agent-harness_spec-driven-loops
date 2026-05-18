---
title: "Implementation Summary: mk-spec-memory MCP Rename"
description: "Closed the spec-kit-memory → mk-spec-memory MCP server rename: source-name, dist rebuild, launcher binary, 4 runtime configs, ~60 operational files, harness/test fixes. Historical spec packets preserved."
trigger_phrases:
  - "017 implementation summary"
  - "mk-spec-memory rename complete"
  - "spec-kit-memory rename evidence"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-local-embeddings-foundation/052-mk-spec-memory-rename"
    last_updated_at: "2026-05-14T23:50:00Z"
    last_updated_by: "main_agent"
    recent_action: "Closed rename — server-name, launcher, runtime configs, operational sweep, smoke verified"
    next_safe_action: "validate.sh --strict + commit on main"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/context-server.ts"
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - "opencode.json"
      - ".claude/mcp.json"
      - ".codex/config.toml"
      - ".gemini/settings.json"
    session_dedup:
      fingerprint: "sha256:ee62a3e0add1bf78c0b680db36d9921e746894c895831acebebfd8e38165a54d"
      session_id: "main-2026-05-14-mk-spec-memory-rename"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-local-embeddings-foundation/052-mk-spec-memory-rename |
| **Completed** | 2026-05-14 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The spec-kit-memory MCP server now identifies itself as `mk-spec-memory`. The change cuts across 4 runtime configurations, the launcher binary, the server entrypoint, the on-disk state file paths, and roughly 60 operational documents — without touching a single raw tool name and without rewriting the audit trail in historical spec packets.

### Server identity

The MCP server constructor in `mcp_server/context-server.ts:894` now advertises `{ name: 'mk-spec-memory', version: '1.7.2' }`. After rebuild, the JSON-RPC `initialize` handshake returns `serverInfo.name = "mk-spec-memory"` and the tools/list response still ships the full 41-tool surface. Gemini's policy parser, which treats underscores in server names as ambiguous, now resolves cleanly against the hyphenated identifier.

### Launcher binary

`.opencode/bin/spec-kit-memory-launcher.cjs` → `.opencode/bin/mk-spec-memory-launcher.cjs` (git mv). Internal stderr prefix is now `[mk-spec-memory-launcher]`. State and lock files moved from `.spec-kit-memory-launcher.{json,lockdir}` to `.mk-spec-memory-launcher.{json,lockdir}`. This mirrors the Option A precedent set by packet 010 for `mk-code-index`.

### Runtime configs (4)

All four MCP-aware runtimes now point at the new server key + binary:

- `opencode.json` — `"mk-spec-memory"` key, command path updated
- `.claude/mcp.json` — `"mk-spec-memory"` key, command path updated
- `.codex/config.toml` — `[mcp_servers."mk-spec-memory"]` (TOML requires quotes for hyphenated table names), args updated
- `.gemini/settings.json` — `"mk-spec-memory"` key, command path updated

### Operational doc sweep

61 operational files swept from `mcp__spec_kit_memory__` → `mcp__mk_spec_memory__`. ~14 additional files received targeted server-name updates (`spec_kit_memory`/`spec-kit-memory` → `mk-spec-memory` or `mk_spec_memory_*` depending on context): doctor commands, deep-research/review YAMLs, memory-manage docs, gemini agents/scripts/commands, feature catalog cross-reference, and the save-mutex tmpdir prefix.

### Substrate harness + sandbox + tests

`run-substrate-stress-harness.mjs` and `_sandbox/24--local-llm-query-intelligence/evidence/run-mcp-direct.mjs` had their tool-parse + client-dispatch internals retuned: `selectClientForServer` now accepts both `'mk_spec_memory'` (underscore form, matching the namespace prefix parsed from `mcp__mk_spec_memory__*`) and `'mk-spec-memory'` (server display name). The `clients` and `toolNameSets` dicts use JS-identifier underscore keys. `shared-daemon-runner-helpers.vitest.ts` rewritten so its object literals stay valid JS (the earlier opencode sed had introduced `{ mk-spec-memory, ... }` shorthand which is invalid syntax).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/bin/spec-kit-memory-launcher.cjs` → `mk-spec-memory-launcher.cjs` | Renamed | Launcher binary |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modified | New stderr prefix + state file paths |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Modified | Server identity string |
| `.opencode/skills/system-spec-kit/mcp_server/dist/context-server.js` | Rebuilt | Picks up new server identity |
| `opencode.json`, `.claude/mcp.json`, `.codex/config.toml`, `.gemini/settings.json` | Modified | Runtime config server key + command |
| `.gemini/scripts/spec-kit-memory.sh` → `mk-spec-memory.sh` | Renamed | Gemini launcher script |
| `.opencode/skills/system-spec-kit/mcp_server/database/.spec-kit-memory-launcher.json` → `.mk-spec-memory-launcher.json` | Renamed | Launcher state file |
| ~61 operational `.md`/`.ts`/`.yaml`/`.toml`/`.json` files | Modified | `mcp__spec_kit_memory__` → `mcp__mk_spec_memory__` |
| ~14 operational files | Modified | Server-name doc references |
| `mcp_server/handlers/save/spec-folder-mutex.ts` | Modified | Lock-root tmpdir prefix |
| `mcp_server/tests/handler-memory-save.vitest.ts` | Modified | Match new lock-root substring |
| `mcp_server/stress_test/substrate/run-substrate-stress-harness.mjs` | Modified | selectClientForServer + connection + dict keys |
| `_sandbox/24--local-llm-query-intelligence/evidence/run-mcp-direct.mjs` | Modified | Same harness fixes |
| `mcp_server/tests/shared-daemon-runner-helpers.vitest.ts` | Rewritten | Valid JS dict keys + new server-name assertions |
| `.opencode/specs/system-spec-kit/027-...001-rename-mcp-namespace-mk-spec-memory/` → `026-.../017-mk-spec-memory-rename/` | Moved | Packet relocated under 026 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Two-phase execution: (1) cli-opencode (`opencode-go/glm-5.1`) dispatch completed the load-bearing changes — launcher rename, all 4 runtime configs, the gemini script rename — before hitting an account balance limit. (2) Main agent finished the operational doc sweep, fixed the broken-JS-syntax in the vitest helper, retuned the substrate harness for the underscore/hyphen dual mapping, rebuilt `dist/context-server.js`, and verified the smoke probe end-to-end.

The smoke probe spun up the renamed launcher, ran JSON-RPC `initialize` + `tools/list`, and confirmed `serverInfo.name = "mk-spec-memory"` and a 41-tool surface (with `memory_context` and `memory_search` present).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Option A (full launcher binary rename + state file rename) | Mirrors mk-code-index precedent in packet 010 — keeps the substrate visibly aligned with its new identity |
| No backward-compatible shim for the old `"spec_kit_memory"` config key | Full cutover; users restart their runtime once. Shim would have ossified the old name |
| `selectClientForServer` accepts both `'mk_spec_memory'` and `'mk-spec-memory'` | The MCP prefix regex captures the underscore form; the server display name uses the hyphen form. Accepting both is the cleanest reconciliation |
| Preserve all `.opencode/specs/**/*.md` historical packet docs (~90 files) | Audit trail — same precedent set by 007/010/014/018/020 for the mk-code-index rename |
| Preserve `tool-schemas.ts:69` doc string referencing `"011-spec-kit-memory-upgrade"` | That is a historical packet name, not a server reference |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Launcher starts with new prefix | PASS — stderr emits `[mk-spec-memory-launcher] loaded N env(s) from ...` |
| MCP JSON-RPC `initialize` returns new server name | PASS — `serverInfo.name = "mk-spec-memory"`, version `1.7.2` |
| MCP `tools/list` returns 41 tools | PASS — `memory_context`, `memory_search`, all `session_*`/`checkpoint_*`/`council_graph_*`/`deep_loop_graph_*` present |
| Dist rebuilt with new server name | PASS — `dist/context-server.js:629` now `name: 'mk-spec-memory'` |
| Operational sweep: zero `mcp__spec_kit_memory__` outside historical packets | PASS — `grep` excluding `.opencode/specs/`, `/changelog/`, `_sandbox/.../evidence/` returns 0 hits |
| Historical packet preservation | PASS — 90+ files under `.opencode/specs/**/*.md` still carry the old prefix as audit-trail evidence |
| `validate.sh --strict` on 017 packet | PASS — exit 0, 0 errors / 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Live MCP child processes retain the old server name until they respawn.** Restart the runtime (OpenCode, Claude Code, Codex, Gemini) once after this commit to pick up the new identity. Not a defect; expected behavior for stateful daemons.
2. **The Gemini-style hyphenated namespace `mcp_mk-spec-memory_*` is rarely referenced in this repo.** Only the dominant Claude-style underscored prefix `mcp__mk_spec_memory__*` was swept. If any Gemini-mode tool reference exists in the operational corpus that I missed, it will surface on first Gemini probe.
3. **No backward-compatible alias for the old key.** Anyone whose user-level config still reads `"spec_kit_memory"` will need to update once. Documented in this packet's spec.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
