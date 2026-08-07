

---
title: "CLI Devin UserPromptSubmit Hook + mk-skill-advisor Plugin Rename + Bridge Migration"
description: "Added a Devin UserPromptSubmit hook variant for the skill advisor, renamed the plugin to mk-skill-advisor, and migrated the plugin bridge to align with mk-* MCP server naming conventions."
trigger_phrases:
  - "cli-devin"
  - "skill-advisor hook"
  - "mk-skill-advisor"
  - "userpromptsubmit"
  - "plugin bridge"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-01

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/004-skill-advisor-production-hardening/004-devin-advisor-hook-integration` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/004-skill-advisor-production-hardening`

### Summary

A Devin UserPromptSubmit hook variant was added for the system-skill-advisor skill to enable advisor brief injection in Devin CLI sessions. The plugin was renamed from spec-kit-skill-advisor to mk-skill-advisor to align with mk-* MCP server naming. The plugin bridge was migrated from system-spec-kit ownership to system-skill-advisor ownership.

### Added

- Devin UserPromptSubmit hook at `hooks/devin/user-prompt-submit.ts` mirrors the Claude variant pattern, fail-open, diagnostic JSONL with runtime tag.
- System-spec-kit shim forwards hook calls to the advisor compiled hook, matching existing Claude/Gemini/Codex shim pattern.
- mk-skill-advisor bridge moved to system-skill-advisor ownership with new README documentation.
- Five-runtime parity smoke test added to runtime-parity.vitest.ts.
- Legacy environment variable alias SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED retained for backcompat alongside new MK_SKILL_ADVISOR_HOOK_DISABLED.

### Changed

- Plugin file renamed from `spec-kit-skill-advisor.js` to `mk-skill-advisor.js` with PLUGIN_ID const updated.
- Bridge file migrated from `system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs` to `system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs`.
- Test file renamed from `spec-kit-skill-advisor-plugin.vitest.ts` to `mk-skill-advisor-plugin.vitest.ts`.
- Devin tools reference updated to confirm hook support.
- All stale spec-kit-skill-advisor references updated in SKILL.md, README, INSTALL_GUIDE, SET-UP_GUIDE, ARCHITECTURE.md, feature_catalog, and manual_testing_playbook.

### Fixed

- None.

### Verification

- Strict validate passed with exit 0, 0 errors, 0 warnings.
- Devin hook smoke test (shim) returns proper hookSpecificOutput with additionalContext, exit 0.
- Devin hook smoke test (direct) emits proper advisor brief, exit 0.
- Plugin rename grep shows 0 hits for spec-kit-skill-advisor in current code and docs.
- TypeScript build passes with exit 0.

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/plugins/mk-skill-advisor.js` | Created | Plugin renamed from spec-kit-skill-advisor.js with updated PLUGIN_ID const |
| `.opencode/skills/system-skill-advisor/hooks/devin/user-prompt-submit.ts` | Created | Devin UserPromptSubmit hook variant for skill advisor |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/devin/user-prompt-submit.ts` | Created | Process-boundary shim forwarding to advisor compiled hook |
| `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs` | Created | Bridge migrated from system-spec-kit to system-skill-advisor ownership |
| `.devin/hooks.v1.json` | Modified | UserPromptSubmit registration routes through shim to advisor dist |
| `.opencode/skills/system-skill-advisor/SKILL.md` | Modified | All stale plugin references updated to mk-skill-advisor |
| `.opencode/skills/system-skill-advisor/README.md` | Modified | Plugin rename reflected throughout |
| `.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md` | Modified | Environment variable names updated |
| `.opencode/skills/system-skill-advisor/SET-UP_GUIDE.md` | Modified | Plugin and bridge references updated |
| `.opencode/skills/system-skill-advisor/ARCHITECTURE.md` | Modified | Bridge ownership migration documented |
| `.opencode/skills/system-skill-advisor/feature_catalog/07--hooks-and-plugin/.md` | Modified | Hook and plugin documentation updated |
| `.opencode/skills/system-skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/.md` | Modified | CLI hook documentation updated |
| `cli-devin/references/devin_tools.md` | Modified | Hooks row flipped to confirm Devin hook support |
| `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/README.md` | Created | Bridge documentation for mk-skill-advisor ownership |
| `runtime-parity.vitest.ts` | Modified | Extended with five-runtime parity smoke test |
| `mk-skill-advisor-plugin.vitest.ts` | Created | Test renamed from spec-kit-skill-advisor-plugin.vitest.ts |

### Follow-Ups

- None.
