---
title: "Phase 005: Smart router remediation and OpenCode plugin"
description: "Shipped all 6 smart-router research recommendations plus the OpenCode skill-advisor plugin. ON_DEMAND hit rate rose from 5.5% to 48.0%. Static CI check and observe-only telemetry landed."
trigger_phrases:
  - "phase 005 changelog"
  - "smart router remediation"
  - "spec-kit-skill-advisor plugin"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-19

> Spec folder: `026-graph-and-context-optimization/006-skill-advisor/003-smart-remediation-opencode-plugin` (Level 2)
> Parent packet: `026-graph-and-context-optimization/006-skill-advisor`

### Summary

Phase 023 shipped all six work areas from the 021 smart-router research packet and added the OpenCode `spec-kit-skill-advisor` plugin. The packet fixes stale route resources, adds static router validation, tunes conservative ON_DEMAND routing keywords (5.5% to 48.0% hit rate), replaces silent CLI fallback with UNKNOWN disambiguation, creates observe-only telemetry, and delivers a bridge-backed OpenCode plugin that imports the Phase 020 advisor producer and renderer.

### Added

- `check-smart-router.sh`: static CI check scanning 20 skills for missing route paths and ALWAYS-tier bloat.
- `smart-router-telemetry.ts`: observe-only compliance recorder with `ComplianceRecord`, `ComplianceClass`, JSONL append.
- `live-session-wrapper.ts`: observe-only live-session read recorder for runtime adapters.
- `smart-router-analyze.ts`: compliance JSONL analyzer.
- `spec-kit-skill-advisor.js`: OpenCode plugin with event-driven cache, `spec_kit_skill_advisor_status` tool, opt-out.
- `spec-kit-skill-advisor-bridge.mjs`: Node bridge importing Phase 020 producer/renderer.
- 2 vitest files: `smart-router-telemetry.vitest.ts` (7 tests), `spec-kit-skill-advisor-plugin.vitest.ts` (9 tests).
- ON_DEMAND keywords added to all 20 smart-routing skills.

### Changed

- 5 stale route paths fixed across `mcp-code-mode`, `sk-improve-agent`, `sk-deep-research`, `sk-deep-review`, `sk-doc`.
- 4 CLI skill routers (`cli-claude-code`, `cli-codex`, `cli-gemini`, `cli-copilot`) now return `UNKNOWN` + disambiguation checklist on zero-score instead of silent `GENERATION` default.
- `.gitignore` updated to ignore `.opencode/skills/.smart-router-telemetry/`.

### Fixed

- ON_DEMAND union hit rate improved from 5.5% (11/200) to 48.0% (96/200) on 200-prompt corpus.
- Five stale route path references corrected in SKILL.md files.
- Zero silent `GENERATION` fallbacks remain in CLI skills.

### Verification

- `check-smart-router.sh`: exit 0, no missing paths, 5 informational bloat warnings.
- ON_DEMAND measurement: 5.5% before, 48.0% after.
- Phase 020 advisor/hook regression: 19 files / 118 tests passed.
- Telemetry + plugin tests: 2 files / 16 tests passed.
- TypeScript typecheck: exit 0.
- Final strict validation: exit 0, errors=0.

### Files Changed

| File | What changed |
|------|--------------|
| `scripts/spec/check-smart-router.sh` | New static CI check |
| `scripts/observability/smart-router-telemetry.ts` | New observe-only recorder |
| `scripts/observability/live-session-wrapper.ts` | New live-session recorder |
| `scripts/observability/smart-router-analyze.ts` | New analyzer |
| `plugins/spec-kit-skill-advisor.js` | New OpenCode plugin |
| `plugins/spec-kit-skill-advisor-bridge.mjs` | New bridge |
| `skill/*/SKILL.md` (20+ files) | ON_DEMAND keyword tuning + stale path fixes |
| `skill/cli-*/SKILL.md` (4 files) | UNKNOWN disambiguation on zero-score |

### Follow-Ups

- Bloat warnings remain observe-only (5 skills above 50%).
- Telemetry is not enforcement yet.
- Plugin rollout remains a deployment step.
