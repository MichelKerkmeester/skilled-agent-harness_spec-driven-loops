---
title: "Skill Advisor Phase 004: Standalone MCP Launcher and Runtime Configs"
description: "Standalone skill-advisor MCP launcher created and registered across four runtime configs. The advisor now starts as its own process under the system_skill_advisor server id with stable advisor_* tool ids, while spec_kit_memory registrations remain byte-for-byte unchanged."
trigger_phrases:
  - "standalone skill advisor launcher"
  - "system_skill_advisor runtime config"
  - "skill-advisor-launcher.cjs"
  - "advisor mcp registration"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-14

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/004-standalone-mcp-launcher-runtime-configs` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction`

### Summary

After child 003 moved advisor source and DB ownership into a dedicated package, no standalone launcher or runtime registration existed. The advisor tools remained reachable only through the `spec_kit_memory` server topology, meaning advisor failures and memory failures could not be diagnosed independently.

This packet completed step 3 of ADR-001's five-phase migration by creating `.opencode/bin/skill-advisor-launcher.cjs` and registering `system_skill_advisor` beside `spec_kit_memory` in OpenCode, Codex, Claude and Gemini runtime configs. The launcher mirrors the memory launcher pattern: repo env loading, build-if-missing bootstrap, advisor-scoped lock/state files, child process signal forwarding and DB path logging with `SYSTEM_SKILL_ADVISOR_DB_DIR` env override support. Direct MCP smoke returned all four stable `advisor_*` tool ids and a live `advisor_recommend` result. The `spec_kit_memory` blocks across all four configs were confirmed byte-for-byte unchanged after the patch.

### Added

- `.opencode/bin/skill-advisor-launcher.cjs` standalone launcher with env loading, build-if-missing bootstrap, advisor-scoped lock and state files plus DB path logging
- `.opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts` MCP server entrypoint registering the four stable `advisor_*` tool ids
- `.opencode/skills/system-skill-advisor/mcp_server/tools/types.ts` shared tool registration types for the standalone server
- `.opencode/skills/system-skill-advisor/mcp_server/tsconfig.build.json` emit-to-dist build config excluding benchmark entrypoints
- `system_skill_advisor` MCP entry added to `opencode.json`, `.codex/config.toml`, `.claude/mcp.json` and `.gemini/settings.json`

### Changed

- `opencode.json` gained a `mcp.system_skill_advisor` block alongside the existing `spec_kit_memory` block
- `.codex/config.toml` gained `[mcp_servers.system_skill_advisor]` with env subblock alongside existing `spec_kit_memory`
- `.claude/mcp.json` gained `mcpServers.system_skill_advisor` entry
- `.gemini/settings.json` gained `mcpServers.system_skill_advisor` with `cwd` and trust fields matching sibling local MCP entries
- `advisor-rebuild.ts`, `advisor-recommend.ts`, `advisor-status.ts` and `advisor-validate.ts` received minor one-line wiring updates for standalone server registration

### Fixed

- Advisor tools were unreachable as an independent MCP server process. The launcher and registration made `system_skill_advisor` a first-class peer of `spec_kit_memory` so the two servers can fail and be diagnosed independently.

### Verification

| Check | Result |
|-------|--------|
| Advisor package build | PASS: `npm run build` emitted `dist/system-skill-advisor/mcp_server/advisor-server.js`. Build exposed `*.bench.ts` inclusion; `tsconfig.build.json` now excludes benchmark test entrypoints. |
| Advisor package typecheck | PASS: `npm run typecheck` exited 0. |
| Advisor package tests | BLOCKED: broader suite fails on out-of-scope child 005 surfaces, missing hook/plugin bridge paths, legacy parity fixtures. Standalone server build and direct MCP smoke pass. |
| Strict packet validation | PASS: `validate.sh .../004-standalone-mcp-launcher-runtime-configs --strict` exited 0, zero errors, zero warnings. |
| JSON config parse | PASS: `opencode.json`, `.claude/mcp.json` and `.gemini/settings.json` all parsed cleanly. |
| TOML config parse | PASS: `python3.13` + `tomllib` parsed `.codex/config.toml` with the new advisor block. |
| `spec_kit_memory` block preservation | PASS: raw block comparison against `/tmp/013009004-baseline` showed all four configs unchanged. |
| Cold-start smoke | PASS: deleting generated `dist/` caused the launcher to run `npm run build` and recreate the advisor entrypoint. |
| Default DB log | PASS: launcher logged the expected package-local `skill-graph.sqlite` path. |
| Env override DB log | PASS: `SYSTEM_SKILL_ADVISOR_DB_DIR=/tmp/test-advisor-db` logged `/tmp/test-advisor-db/skill-graph.sqlite`. |
| Direct MCP tool list | PASS: `advisor_recommend`, `advisor_rebuild`, `advisor_status`, `advisor_validate` returned from stdio. |
| Direct `advisor_recommend` call | PASS: returned `ok:stale:3`. |
| OpenCode runtime manager | PASS: `opencode mcp list` showed `system_skill_advisor connected`. |
| Codex runtime manager | PASS: `codex mcp list` showed `system_skill_advisor enabled`. |
| Claude runtime manager | BLOCKED: `claude mcp list` did not surface `.claude/mcp.json` entry. |
| Gemini runtime manager | BLOCKED: `gemini mcp list --debug` reported only `sequential_thinking`. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/bin/skill-advisor-launcher.cjs` (NEW) | Created | Standalone advisor launcher with env load, build-if-missing bootstrap, advisor-scoped lock/state files, DB path logging |
| `.opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts` (NEW) | Created | Standalone MCP server entrypoint registering the four stable `advisor_*` tool ids via `StdioServerTransport` |
| `.opencode/skills/system-skill-advisor/mcp_server/tools/types.ts` (NEW) | Created | Shared tool registration types for the standalone server |
| `.opencode/skills/system-skill-advisor/mcp_server/tsconfig.build.json` (NEW) | Created | Build config for advisor package with benchmark entrypoints excluded |
| `opencode.json` | Modified | Added `mcp.system_skill_advisor` block beside existing `spec_kit_memory` |
| `.codex/config.toml` | Modified | Added `[mcp_servers.system_skill_advisor]` with env subblock |
| `.claude/mcp.json` | Modified | Added `mcpServers.system_skill_advisor` entry |
| `.gemini/settings.json` | Modified | Added `mcpServers.system_skill_advisor` with `cwd` and trust fields |

### Follow-Ups

- Diagnose why `claude mcp list` does not surface project-level `.claude/mcp.json` entries without a session restart. The config parses cleanly and the entry is present.
- Diagnose why `gemini mcp list --debug` reports only `sequential_thinking` despite `.gemini/settings.json` containing `system_skill_advisor`. Tracked as CHK-033 for child 005.
- Resolve the full advisor package test suite. Failures are in out-of-scope child 005 consumer surfaces and legacy parity fixtures, not in the standalone server build or direct MCP smoke.
- Complete child 005 consumer cutover: hooks, Python shim, plugin bridge and `spec_kit_memory` deprecation proxy are out of scope for this packet.
