---
title: "Spec Memory MCP Server Rename to mk-spec-memory"
description: "Renamed the Spec Kit Memory MCP server alias from spec_kit_memory to mk-spec-memory for Gemini policy-parser compatibility and to match the mk-* naming convention. All 41 raw tool names were preserved byte-for-byte."
trigger_phrases:
  - "mk-spec-memory rename"
  - "spec_kit_memory to mk-spec-memory"
  - "mcp server alias rename gemini"
  - "mk- naming convention mcp"
  - "memory mcp namespace rename"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-14

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization` (program-level)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization`

### Summary

The Spec Kit Memory MCP server alias was `spec_kit_memory`, an underscore form that the Gemini policy parser cannot resolve cleanly. Gemini splits on `mcp_` and treats underscores inside MCP server names as policy-ambiguous. This phase renamed the server alias to the hyphenated `mk-spec-memory`, which resolves cleanly, and aligned it with the `mk-*` MCP server naming convention established by the earlier `mk-code-index` rename (packet 010 in the system-code-graph extraction line). Shipped in commit `f91da9f1a`. The rename touched server identity, launchers, four runtime configs, and 61 operational files in lockstep, while keeping every raw tool name unchanged.

### Added

- `.opencode/bin/mk-spec-memory-launcher.cjs`, the renamed launcher binary (replaces `spec-kit-memory-launcher.cjs`), with its internal stderr prefix and state-file paths following the new name.
- `.gemini/scripts/mk-spec-memory.sh`, the renamed Gemini launcher script (replaces `spec-kit-memory.sh`).

### Changed

- Server identity at `context-server.ts:894` now sets `name: 'mk-spec-memory'`, with dist rebuilt.
- Four runtime configs updated in lockstep: `opencode.json`, `.claude/mcp.json`, `.codex/config.toml`, `.gemini/settings.json`.
- 61 operational files swept from `mcp__spec_kit_memory__` to `mcp__mk_spec_memory__`.
- About 14 targeted server-name updates across doctor commands, deep-research and deep-review YAMLs, memory-manage docs, Gemini agents, scripts and commands, the feature catalog, and the save-mutex tmpdir prefix.
- Substrate harness, sandbox runner, and the vitest helper retuned for the hyphen display name with the underscore namespace form.
- Packet relocated from `027-xce-research-based-refinement/001-rename-mcp-namespace-mk-spec-memory` to `026-graph-and-context-optimization/052-mk-spec-memory-rename`.

### Fixed

- Gemini policy-parser ambiguity on the MCP server name. The hyphenated `mk-spec-memory` form resolves cleanly where the underscore `spec_kit_memory` form did not.

### Verification

- JSON-RPC `initialize` returns `serverInfo.name = "mk-spec-memory"` at version 1.7.2.
- `tools/list` returns 41 tools including `memory_context` and `memory_search`.
- `dist/context-server.js:629` advertises the new name after rebuild.
- `validate.sh --strict` on the 052 packet: exit 0, 0 errors and 0 warnings.
- Operational sweep: zero `mcp__spec_kit_memory__` references outside `.opencode/specs/`, `/changelog/`, and `_sandbox/.../evidence/`.
- Preserved: all 41 raw tool names (`memory_context`, `memory_search`, and the rest) byte-for-byte identical (REQ-002). About 90 historical `.opencode/specs/**/*.md` files retain the old prefix as an audit trail, matching the precedent of the mk-code-index rename packets.

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `context-server.ts` | Modified | Server identity set to `mk-spec-memory` at line 894, dist rebuilt |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Created | Renamed launcher binary with updated stderr prefix and state paths |
| `.gemini/scripts/mk-spec-memory.sh` | Created | Renamed Gemini launcher script |
| `opencode.json`, `.claude/mcp.json`, `.codex/config.toml`, `.gemini/settings.json` | Modified | Server alias updated in lockstep across 4 runtimes |
| 61 operational files | Modified | Namespace swept from `mcp__spec_kit_memory__` to `mcp__mk_spec_memory__` |

### Follow-Ups

- **Deep-review findings (deferred to remediation).** The deep-review at `017/review/` (commit `259886eec`) returned a CONDITIONAL verdict with 6 P1 and 5 P2 findings. The remediation packet `053-mk-spec-memory-rename-remediation` closes all 11 findings.
