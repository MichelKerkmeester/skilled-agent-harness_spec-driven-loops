---
title: "Changelog: Rename system_skill_advisor MCP server to mk_skill_advisor"
description: "Renames the Skill Advisor MCP runtime identity from system_skill_advisor to mk_skill_advisor, aligning it with the mk_ custom MCP naming pattern."
trigger_phrases:
  - "mk_skill_advisor rename"
  - "skill advisor MCP identity"
  - "system_skill_advisor to mk_skill_advisor"
  - "mk-skill-advisor-launcher"
  - "advisor server rename"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/015-mcp-server-mk-skill-advisor-rename` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction`

### Summary

The Skill Advisor MCP server was registered as `system_skill_advisor`, which no longer matched the `mk_` custom MCP naming pattern used by other servers like `mk_code_index`. The runtime identity, launcher, state file, and all live consumer references were renamed to `mk_skill_advisor` following the established rename precedent. The skill folder and public tool ids were preserved to maintain caller stability.

### Added

- None.

### Changed

- MCP server registration in `advisor-server.ts` now advertises as `mk_skill_advisor` with mk-prefixed startup logs.
- Launcher renamed to `.opencode/bin/mk-skill-advisor-launcher.cjs` with mk-prefixed logs, lock directory, and state file path.
- Launcher state file renamed to `.mk-skill-advisor-launcher.json` to match the new binary name.
- Runtime configs in `opencode.json`, `.claude/mcp.json`, `.codex/config.toml`, and `.gemini/settings.json` updated to the mk-prefixed server key and launcher path.
- Live consumer references across doctor commands, YAMLs, the plugin bridge, install guides, the feature catalog, playbooks, and package docs updated from `mcp__system_skill_advisor__*` to `mcp__mk_skill_advisor__*`.

### Fixed

- None.

### Verification

- Advisor package typecheck: PASS via `npm run typecheck` in `.opencode/skills/system-skill-advisor/mcp_server`.
- Spec-kit MCP typecheck: PASS via `npx tsc --noEmit` in `.opencode/skills/system-spec-kit/mcp_server`.
- Launcher smoke: PASS via `timeout 8 node .opencode/bin/mk-skill-advisor-launcher.cjs`, mk-prefixed logs and skill graph scan observed.
- OpenCode MCP list: PASS, `mk_skill_advisor` shows as connected.
- Old namespace grep: PASS, zero live references to `mcp__system_skill_advisor__` outside specs, changelogs, dist, and node_modules.
- Strict validation: PASS for packet 015.
- 28 task items completed.

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `opencode.json`, `.claude/mcp.json`, `.codex/config.toml`, `.gemini/settings.json` | Modified | MCP config key, launcher path, and namespace note renamed to mk_skill_advisor. |
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Renamed/Modified | Launcher filename, log prefix, lock directory, state path, and payload command updated to mk prefix. |
| `.opencode/skills/system-skill-advisor/mcp_server/database/.mk-skill-advisor-launcher.json` | Renamed/Modified | State file identity renamed to mk prefix. |
| `.opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts` | Modified | Server registers as `mk_skill_advisor`, startup logs use mk launcher prefix. |
| Doctor commands, YAMLs, plugin bridge, install guides, feature catalog, playbooks, and package docs | Modified | Live server-id and namespace references updated. |
| Parent `013/009/handover.md` and `graph-metadata.json` | Modified | Child packet 015 added and marked active. |

### Follow-Ups

- Long-lived MCP sessions may need a restart or reconnect to drop cached `system_skill_advisor` entries.
- Generated SQLite and runtime state files were dirtied by local MCP smoke and list commands, unrelated database churn was excluded from the scoped commit.
