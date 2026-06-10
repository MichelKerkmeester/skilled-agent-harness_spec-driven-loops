---
title: "Changelog: 003-skill-advisor-cli / 003-runtime-integration"
description: "Skill-advisor runtime integration shipped: warm-only CLI fallback in Claude/Codex hooks, CLI fallback route in the OpenCode bridge, read-only doctor probes, and Gate-2 facade-vs-CLI guidance."
trigger_phrases:
  - "skill-advisor runtime integration changelog"
  - "skill-advisor phase 3 changelog"
  - "skill-advisor hook fallback changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-10

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/003-skill-advisor-cli/003-runtime-integration` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/003-skill-advisor-cli`

### Summary

The skill-advisor runtime integration wired warm-only CLI fallback into Claude and Codex prompt-submit hooks, added a CLI fallback route to the OpenCode bridge (primary MCP path stays intact), updated doctor probes to read-only CLI calls, and added Gate-2 facade-vs-CLI guidance to both `README.md` and `SKILL.md`. The absent-socket fail-open path measured 0.8ms; warm calls measured 120-198ms, well below the 824.8ms one-shot native bridge ban.

### Added

- `.opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts` — shared warm-only CLI fallback helper

### Changed

- `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` — Claude advisor hook gains CLI fallback
- `.opencode/skills/system-skill-advisor/hooks/codex/user-prompt-submit.ts` — Codex advisor hook gains CLI fallback
- `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs` — CLI fallback route added; primary MCP path untouched
- `.opencode/commands/doctor/assets/doctor_skill-advisor.yaml` — read-only CLI probe for advisor status
- `.opencode/commands/doctor/assets/doctor_skill-budget.yaml` — read-only CLI probe for skill-budget diagnostics
- `README.md` — Gate-2 facade-vs-CLI guidance
- `.opencode/skills/system-skill-advisor/SKILL.md` — Gate-2 facade-vs-CLI guidance

### Fixed

- None

### Verification

| Check | Result |
|-------|--------|
| Build | PASS (clean) |
| Hook smoke (no-socket fail-open) | PASS at 0.8ms |
| Hook smoke (warm path) | PASS at 120-198ms |
| Bridge fallback (CLI route) | PASS; primary path untouched |
| Fail-open vs one-shot ban | 0.8ms vs 824.8ms ban; well within budget |
| Scope | PASS (clean) |

### Files Changed

| File | Action | Purpose |
|------|---------|---------|
| `.opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts` | Added | Shared warm-only CLI fallback helper |
| `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` | Modified | Claude advisor hook gains CLI fallback |
| `.opencode/skills/system-skill-advisor/hooks/codex/user-prompt-submit.ts` | Modified | Codex advisor hook gains CLI fallback |
| `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs` | Modified | CLI fallback route; primary MCP path untouched |
| `.opencode/commands/doctor/assets/doctor_skill-advisor.yaml` | Modified | Read-only CLI probe for advisor status |
| `.opencode/commands/doctor/assets/doctor_skill-budget.yaml` | Modified | Read-only CLI probe for skill-budget diagnostics |
| `README.md` | Modified | Gate-2 facade-vs-CLI guidance |
| `.opencode/skills/system-skill-advisor/SKILL.md` | Modified | Gate-2 facade-vs-CLI guidance |

### Follow-Ups

- Final multi-runtime transport-down drill tracked as program-level verification
