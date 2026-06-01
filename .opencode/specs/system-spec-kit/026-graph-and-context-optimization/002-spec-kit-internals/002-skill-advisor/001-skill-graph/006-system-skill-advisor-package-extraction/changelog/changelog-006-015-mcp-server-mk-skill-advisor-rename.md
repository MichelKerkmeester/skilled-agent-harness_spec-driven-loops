

---
title: "Rename Skill Advisor MCP server to mk_skill_advisor"
description: "The Skill Advisor MCP runtime identity is now mk_skill_advisor, matching the custom MCP snake_case naming pattern."
trigger_phrases:
  - "mk_skill_advisor"
  - "system_skill_advisor rename"
  - "skill advisor mcp rename"
  - "mcp server identity rename"
  - "skill advisor package extraction"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/015-mcp-server-mk-skill-advisor-rename` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction`

### Summary

The Skill Advisor MCP runtime identity is now mk_skill_advisor, matching the custom MCP snake_case naming pattern established by mk_code_index. The launcher moved to .opencode/bin/mk-skill-advisor-launcher.cjs and its state file moved to .mk-skill-advisor-launcher.json. All four runtime configs now register the mk-prefixed server and live namespace consumers use mcp__mk_skill_advisor__*. Tool ids and skill folder structure remain unchanged to preserve caller stability.

### Added

- None.

### Changed

- Launcher renamed from system-skill-advisor-launcher.cjs to mk-skill-advisor-launcher.cjs in .opencode/bin with updated logs, lockdir, state path, and payload command.
- Launcher state file moved to .mk-skill-advisor-launcher.json.
- Four runtime configs updated to register mk_skill_advisor server.
- Live namespace references updated from mcp__system_skill_advisor__* to mcp__mk_skill_advisor__*.
- Doctor commands, YAMLs, plugin bridge, install guides, feature catalog, playbooks, and package docs updated with new server identity.
- Parent handover.md and graph-metadata.json updated to reflect child 015 completion.

### Fixed

- Runtime identity mismatch resolved. The Skill Advisor MCP server now uses the mk_skill_advisor naming pattern instead of system_skill_advisor, aligning with the custom MCP snake_case convention.

### Verification

- Advisor package typecheck - PASS: npm run typecheck in .opencode/skills/system-skill-advisor/mcp_server.
- Spec-kit MCP typecheck - PASS: npx tsc --noEmit in .opencode/skills/system-spec-kit/mcp_server.
- Launcher smoke - PASS: timeout 8 node .opencode/bin/mk-skill-advisor-launcher.cjs; mk-prefixed logs and skill graph scan observed.
- OpenCode MCP list - PASS: mk_skill_advisor connected.
- Old namespace grep - PASS: mcp__system_skill_advisor__ live count is 0 outside specs/changelog/dist/node_modules.
- Strict validation - PASS: packet 015 strict validation.

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Renamed | Launcher renamed to mk-prefixed name with updated logs, lockdir, state path, and payload command. |
| `.opencode/skills/system-skill-advisor/mcp_server/database/.mk-skill-advisor-launcher.json` | Renamed | State file renamed to mk-prefixed identity. |
| `.opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts` | Modified | MCP server registers as mk_skill_advisor with mk launcher prefix in startup logs. |
| `opencode.json, .claude/mcp.json, .codex/config.toml, .gemini/settings.json` | Modified | MCP config key, launcher path, and namespace note updated to mk-prefixed values. |
| `Doctor commands, YAMLs, plugin bridge, install guides, feature catalog, playbooks, package docs` | Modified | Live server-id and namespace references updated to mk_skill_advisor. |
| `Parent 013/009/handover.md and graph-metadata.json` | Modified | Child 015 added and marked active. |

### Follow-Ups

- Existing long-lived MCP sessions may need restart or reconnect to drop cached system_skill_advisor entries.
- Generated SQLite and runtime state files were dirtied by local MCP smoke/list commands. Unrelated database churn was kept out of the scoped commit.
