---
title: "Changelog: 002-code-index-cli / 003-runtime-integration"
description: "Code-index runtime integration shipped: warm-only CLI fallback in hooks, mk-code-graph bridge repaired to the CLI route, Codex allowlist, and maintenance-tool block at prompt time."
trigger_phrases:
  - "code-index runtime integration changelog"
  - "code-index phase 3 changelog"
  - "code-graph bridge repair changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-09

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/002-code-index-cli/003-runtime-integration` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/002-code-index-cli`

### Summary

The code-index runtime integration wired warm-only CLI fallback into Claude and Codex prompt-submit hooks and REPAIRED the mk-code-graph bridge: the previous in-process dist/DB import approach (reverted in 026/008 as a direct-DB dual-writer hazard) was replaced with the CLI route. The plugin now synthesizes its transport contract from the status payload. Maintenance tools are blocked at prompt time. MCP registrations stayed untouched.

### Added

- `.opencode/skills/system-spec-kit/mcp_server/hooks/code-index-cli-fallback.ts` — shared warm-only code-index CLI fallback helper (socket probe first, exit-75 skip, no cold spawn at prompt time)

### Changed

- `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts` — gains code-index CLI warm path
- `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/session-start.ts` — gains code-index CLI warm path
- `.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs` — bridge repaired to CLI route; in-process dist/DB imports removed
- `.opencode/plugins/mk-code-graph.js` — plugin synthesizes transport contract from status payload
- `.codex/settings.json` — Codex allowlist for CLI use
- `AGENTS.md` — transport-down fallback and maintenance-tool policy guidance

### Fixed

- `mk-code-graph-bridge.mjs` — removed in-process dist/DB imports that were a dual-writer hazard; replaced with CLI/IPC route

### Verification

| Check | Result |
|-------|--------|
| Build | PASS (clean) |
| Plugin vitest suite | PASS (green) |
| Warm smoke | Real payload returned over CLI route |
| Maintenance-block smoke | Prompt-time maintenance tools blocked as scoped |
| MCP registrations diff | Empty (untouched) |

### Files Changed

| File | Action | Purpose |
|------|---------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/hooks/code-index-cli-fallback.ts` | Added | Shared warm-only code-index CLI fallback helper |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts` | Modified | Claude session adapter gains code-index CLI warm path |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/session-start.ts` | Modified | Codex session adapter gains code-index CLI warm path |
| `.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs` | Modified | Bridge repaired to CLI route; no in-process dist/DB imports |
| `.opencode/plugins/mk-code-graph.js` | Modified | Plugin synthesizes transport contract from status payload |
| `.codex/settings.json` | Modified | Codex allowlist for CLI use |
| `AGENTS.md` | Modified | Transport-down fallback and maintenance-tool policy guidance |

### Follow-Ups

- Dual-stack observation window remains open by design
- Final program-level multi-runtime transport-down drill tracked outside this phase
