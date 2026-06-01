# Changelog — 014/052: mk-spec-memory MCP Server Rename

**Shipped**: 2026-05-14
**Commit**: `f91da9f1a`
**Deep-Review Commit**: `259886eec` (CONDITIONAL — 6 P1 / 5 P2)
**Remediation Commit**: forthcoming (the 053 packet)

## What Changed

Renamed the Spec Kit Memory MCP server alias from `spec_kit_memory` to `mk-spec-memory` across:

- Server identity (`context-server.ts:894` → `name: 'mk-spec-memory'`; dist rebuilt)
- Launcher binary (`.opencode/bin/spec-kit-memory-launcher.cjs` → `mk-spec-memory-launcher.cjs`; internal stderr prefix + state-file paths follow)
- Gemini launcher script (`.gemini/scripts/spec-kit-memory.sh` → `mk-spec-memory.sh`)
- 4 runtime configs in lockstep: `opencode.json`, `.claude/mcp.json`, `.codex/config.toml`, `.gemini/settings.json`
- 61 operational files swept (`mcp__spec_kit_memory__` → `mcp__mk_spec_memory__`)
- ~14 targeted server-name updates in doctor commands, deep-research/review YAMLs, memory-manage docs, gemini agents/scripts/commands, feature catalog, save-mutex tmpdir prefix
- Substrate harness + sandbox runner + vitest helper retuned for hyphen display name + underscore namespace form
- Packet relocated `027-xce-research-based-refinement/001-rename-mcp-namespace-mk-spec-memory` → `026-graph-and-context-optimization/052-mk-spec-memory-rename`

## Why

- Visible MCP tool-reference noise: `mcp__mk_spec_memory__` (22 chars) is shorter than `mcp__spec_kit_memory__` (22 chars same length but Gemini-compatible)
- Gemini policy parser splits on `mcp_` and treats underscores in MCP server names as policy-ambiguous — hyphenated form resolves cleanly
- Aligns with the `mk-*` MCP server naming convention established by the prior `mk-code-index` rename (packet 010 within the system-code-graph extraction line)

## What Was Preserved

- All 41 raw tool names (`memory_context`, `memory_search`, etc.) byte-for-byte identical (REQ-002)
- `~90` historical `.opencode/specs/**/*.md` files retain the old prefix as audit trail (same precedent as the mk-code-index rename's 007/010/014/018/020 packets)

## Verification

- JSON-RPC `initialize` returns `serverInfo.name = "mk-spec-memory"` (version 1.7.2)
- `tools/list` returns 41 tools including `memory_context` and `memory_search`
- `dist/context-server.js:629` advertises the new name post-rebuild
- `validate.sh --strict` on the 052 packet: exit 0, 0 errors / 0 warnings
- Operational sweep: zero `mcp__spec_kit_memory__` references outside `.opencode/specs/`, `/changelog/`, and `_sandbox/.../evidence/`

## Follow-on Work

Deep-review packet (`017/review/`, commit `259886eec`) flagged 6 P1 + 5 P2 findings. The remediation packet `053-mk-spec-memory-rename-remediation` closes all 11 findings.