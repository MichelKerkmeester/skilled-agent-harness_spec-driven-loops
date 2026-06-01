

---
title: "Changelog: Smart-Router Remediation + OpenCode Plugin [003-skill-advisor-routing-engine/003-smart-remediation-opencode-plugin]"
description: "Phase 023 shipped six work areas from smart-router research and added the OpenCode spec-kit-skill-advisor plugin. The packet fixes stale route resources, adds static router validation, tunes ON_DEMAND routing keywords, replaces silent CLI fallback with UNKNOWN disambiguation, creates observe-only telemetry, and delivers a bridge-backed OpenCode plugin."
trigger_phrases:
  - "smart router remediation"
  - "spec-kit-skill-advisor plugin shipped"
  - "smart router ci check"
  - "on demand keyword tuning"
  - "cli unknown fallback"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-01

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/003-skill-advisor-routing-engine/003-smart-remediation-opencode-plugin` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/003-skill-advisor-routing-engine`

### Summary

Phase 023 shipped six work areas from smart-router research and added the OpenCode spec-kit-skill-advisor plugin. The packet fixed five stale route references across the skill advisor graph, raised the ON_DEMAND hit rate from 5.5% to 48.0% on a200-prompt corpus, replaced silent zero-score CLI fallbacks with explicit UNKNOWN disambiguation, delivered a static CI checker that validates router resource paths, created an observe-only telemetry harness for compliance recording, and shipped a bridge-backed OpenCode plugin that imports Phase 020 advisor producer/renderer without modifying Phase 020 runtime code.

### Added

- OpenCode spec-kit-skill-advisor plugin that sends prompts to a Node bridge and appends advisor briefs to system output without touching Phase 020 runtime code.
- Observe-only telemetry harness at `.opencode/skills/system-spec-kit/scripts/observability/smart-router-telemetry.ts` that classifies router compliance and appends JSONL records without blocking caller behavior.
- Static CI check script at `.opencode/skills/system-spec-kit/scripts/spec/check-smart-router.sh` that validates all smart-router resource paths and reports ALWAYS-tier bloat as informational warnings.
- Node bridge at `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs` that imports Phase 020 buildSkillAdvisorBrief and renderAdvisorBrief and returns structured advisor output.

### Changed

- ON_DEMAND keyword phrases across all 20 smart-routing skills raised the corpus hit rate from 5.5% to 48.0%.
- Four CLI skill routers (cli-claude-code, cli-codex, cli-copilot, cli-gemini) now return UNKNOWN intent and needs_disambiguation=True instead of silently falling back to GENERATION.
- Five skills received targeted path corrections.

### Fixed

- Stale route references across five skills were remediated, including the mcp-code-mode default resource path, sk-improve-agent onboarding reference, sk-deep-research auto workflow prose, sk-deep-review auto workflow prose route reference, and sk-doc feature catalog template path.

### Verification

- Initial required reads, PASS.
- validate.sh --strict after plan scaffold, PASS.
- check-smart-router.sh, PASS: exit 0, no missing paths, 5 informational bloat warnings.
- check-smart-router.sh --json, PASS: exit 0, empty errors array.
- ON_DEMAND hit-rate measurement, PASS: 5.5% before, 48.0% after on 200-prompt corpus.
- CLI fallback scan, PASS: four zero-score branches return UNKNOWN with no silent GENERATION fallback.
- Phase 020 advisor/hook regression suite, PASS: 19 files / 118 tests.
- Telemetry and plugin tests, PASS: 2 files / 16 tests.
- TypeScript, PASS: npm run typecheck exited 0.
- Final 023 strict validation, PASS: validate.sh --strict exited 0 with errors=0.

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/mcp-code-mode/SKILL.md` | Modified | Fix stale default smart-router resource path |
| `.opencode/skills/sk-improve-agent/SKILL.md` | Modified | Remove stale onboarding reference |
| `.opencode/skills/sk-deep-research/SKILL.md` | Modified | Point auto workflow prose at live command YAML |
| `.opencode/skills/sk-deep-review/SKILL.md` | Modified | Point auto workflow prose at live command YAML |
| `.opencode/skills/sk-doc/SKILL.md` | Modified | Correct feature catalog template path |
| `.opencode/skills/system-spec-kit/scripts/spec/check-smart-router.sh` | Created | Add static CI check for router resource paths and ALWAYS-tier bloat |
| `.opencode/skills/*/SKILL.md` | Modified | Tune ON_DEMAND keyword phrases across all 20 smart-routing skills |
| `.opencode/skills/cli-{claude-code,codex,copilot,gemini}/SKILL.md` | Modified | Replace zero-score silent CLI fallback with UNKNOWN disambiguation |
| `.opencode/skills/system-spec-kit/scripts/observability/smart-router-telemetry.ts` | Created | Observe-only router compliance recorder |
| `.opencode/skills/system-spec-kit/mcp_server/tests/smart-router-telemetry.vitest.ts` | Created | Test all compliance classes, JSONL roundtrip, idempotent directory creation, and path sanitization |
| `.gitignore` | Modified | Ignore `.opencode/skills/.smart-router-telemetry/` |
| `.opencode/skills/system-spec-kit/scripts/tsconfig.json` | Modified | Include observability/**/*.ts in script typechecking |
| `.opencode/plugins/spec-kit-skill-advisor.js` | Created | OpenCode plugin for skill-advisor prompt injection |
| `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs` | Created | Node bridge that imports Phase 020 advisor producer/renderer |
| `.opencode/skills/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts` | Created | Cache, status, opt-out, and timeout tests |

### Follow-Ups

- Bloat warnings remain observe-only. The static checker reports five ALWAYS-tier bloat warnings but exits 0 because Area D defines bloat as informational.
- Telemetry is not enforcement. Runtime enforcement should wait until real compliance data has been collected from `.opencode/skills/.smart-router-telemetry/compliance.jsonl`.
- Plugin rollout remains a deployment step. The plugin files are present and tested, but enabling them for users should be handled by the orchestrator or plugin marketplace/config workflow.
