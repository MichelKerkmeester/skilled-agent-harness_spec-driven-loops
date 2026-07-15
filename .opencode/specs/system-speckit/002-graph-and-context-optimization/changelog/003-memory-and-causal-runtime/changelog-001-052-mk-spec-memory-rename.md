---
title: "Changelog: Rename MCP namespace to mk-spec-memory [001-local-embeddings-foundation/052-mk-spec-memory-rename]"
description: "Shipped the spec-kit-memory to mk-spec-memory MCP server rename across 4 runtime configs, the launcher binary, the server entrypoint, on-disk state files and roughly 75 operational documents while preserving all historical audit-trail references."
trigger_phrases:
  - "mk-spec-memory rename"
  - "spec-kit-memory MCP server rename"
  - "MCP namespace rename mk-spec-memory"
  - "spec_kit_memory to mk_spec_memory migration"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-14

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/052-mk-spec-memory-rename` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation`

### Summary

The Spec Kit Memory MCP server had been configured under the `spec_kit_memory` alias, forcing a 22-character fully qualified prefix into every Claude-style tool reference and triggering Gemini policy ambiguity because its parser splits after `mcp_`. The rename to `mk-spec-memory` brought this server in line with the `mk-*` naming convention established by the earlier `mk-code-index` rename (packets 010 and 016).

The change landed in a single commit across 105 files: the server-name constant in `context-server.ts`, the dist rebuild, the launcher binary rename, all four runtime configs and an operational sweep of 61 `mcp__spec_kit_memory__` occurrences plus targeted updates to 14 additional files. The substrate stress harness and sandbox runner required a dual-key fix so `selectClientForServer` accepted both the underscore form parsed from MCP namespace prefixes and the hyphenated display name. Historical spec-packet docs retained the old prefix as an intentional audit trail.

### Added

- Dual-key `selectClientForServer` acceptance for both `mk_spec_memory` (parsed namespace form) and `mk-spec-memory` (display name) in the substrate stress harness
- `mcp_server/tests/shared-daemon-runner-helpers.vitest.ts` rewritten with valid JS identifier dict keys and new server-name assertions

### Changed

- `mcp_server/context-server.ts` line 894 server identity from `spec-kit-memory` to `mk-spec-memory` (version `1.7.2`)
- Launcher binary renamed from `spec-kit-memory-launcher.cjs` to `mk-spec-memory-launcher.cjs` with matching stderr prefix and state-file paths
- All four runtime configs updated: `opencode.json`, `.claude/mcp.json`, `.codex/config.toml` and `.gemini/settings.json` now use the `mk-spec-memory` server key
- Gemini launcher script renamed from `spec-kit-memory.sh` to `mk-spec-memory.sh`
- Lock-root tmpdir prefix in `spec-folder-mutex.ts` updated to the new server name
- 61 operational files migrated from `mcp__spec_kit_memory__` to `mcp__mk_spec_memory__`
- 14 additional operational files received targeted server-name updates covering doctor commands, deep-research and review YAMLs, memory-manage docs and Gemini agents

### Fixed

- `shared-daemon-runner-helpers.vitest.ts` had invalid JS object literal syntax (`{mk-spec-memory: ...}`) introduced by a mid-flight sed pass. Rewritten to use valid underscore identifier keys.
- `run-substrate-stress-harness.mjs` client dispatch and connection handling corrected after the rename broke the tool-parse and server-lookup paths
- `handler-memory-save.vitest.ts` assertion updated to match the new lock-root substring

### Verification

| Check | Result |
|-------|--------|
| Launcher starts with new prefix | PASS. stderr emits `[mk-spec-memory-launcher] loaded N env(s) from ...` |
| MCP JSON-RPC `initialize` returns new server name | PASS. `serverInfo.name = "mk-spec-memory"`, version `1.7.2` |
| MCP `tools/list` returns 41 tools | PASS. `memory_context`, `memory_search` and all `session_*`/`checkpoint_*` tools present |
| Dist rebuilt with new server name | PASS. `dist/context-server.js:629` now reads `name: 'mk-spec-memory'` |
| Operational sweep: zero `mcp__spec_kit_memory__` outside historical packets | PASS. grep excluding `.opencode/specs/`, `/changelog/` and `_sandbox/.../evidence/` returns 0 hits |
| Historical packet preservation | PASS. 90+ files under `.opencode/specs/**/*.md` retain the old prefix as audit-trail evidence |
| `validate.sh --strict` on packet | PASS. exit 0, 0 errors, 0 warnings |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/bin/spec-kit-memory-launcher.cjs` | Renamed to `mk-spec-memory-launcher.cjs` | Launcher binary aligned with new server identity |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modified | New stderr prefix and state-file paths |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Modified | Server identity string updated at line 894 |
| `.opencode/skills/system-spec-kit/mcp_server/dist/context-server.js` | Rebuilt | Picks up new server identity after `npm run build` |
| `opencode.json`, `.claude/mcp.json`, `.codex/config.toml`, `.gemini/settings.json` | Modified | Runtime config server key and command path updated in all four runtimes |
| `.gemini/scripts/spec-kit-memory.sh` | Renamed to `mk-spec-memory.sh` | Gemini launcher script aligned with new name |
| `.opencode/skills/system-spec-kit/mcp_server/database/.spec-kit-memory-launcher.json` | Renamed to `.mk-spec-memory-launcher.json` | On-disk launcher state file |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/spec-folder-mutex.ts` | Modified | Lock-root tmpdir prefix updated |
| `.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts` | Modified | Lock-root assertion updated |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/run-substrate-stress-harness.mjs` | Modified | `selectClientForServer` dual-key support, connection and dict-key fixes |
| `.opencode/skills/system-spec-kit/mcp_server/tests/shared-daemon-runner-helpers.vitest.ts` | Rewritten | Valid JS dict keys and new server-name assertions |
| ~75 operational `.md`, `.ts`, `.yaml`, `.toml`, `.json` files | Modified | `mcp__spec_kit_memory__` to `mcp__mk_spec_memory__` plus targeted server-name updates |

### Follow-Ups

- Live MCP child processes retain the old server name until they respawn. Restart the runtime (OpenCode, Claude Code, Codex, Gemini) once after this commit to pick up the new identity. This is expected behavior for stateful daemons.
- The Gemini-style hyphenated namespace `mcp_mk-spec-memory_*` is rarely referenced in this repo. Only the dominant Claude-style underscored prefix `mcp__mk_spec_memory__` was swept. Any Gemini-mode tool references that remain will surface on the first Gemini probe.
- No backward-compatible alias exists for the old `spec_kit_memory` key. Users with local config overrides referencing the old key must update their config once. The absence of a shim is a deliberate decision recorded in the packet's decision table.
