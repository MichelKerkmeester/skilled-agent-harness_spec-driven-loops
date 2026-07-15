---
title: "022/004b Skill-Advisor Interface and Env-Var Overrides: RoutingCalibration slots, resolved threshold helpers, prompt-policy JSON"
description: "Shipped waves 2 to 4 of phase 004 via cli-opencode plus deepseek-v4-pro: typed RoutingCalibration slots, env-var-aware threshold helpers, and externalized prompt-policy JSON with 9 new env vars. Closes 9 P1 and 2 P2 findings."
trigger_phrases:
  - "022/004b interface and env vars"
  - "resolvedConfidenceThreshold helper"
  - "prompt-policy.default.json externalization"
  - "RoutingCalibration typed slots"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-23

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/004b-skill-advisor-interface-and-env-vars`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc`

### Summary

This is the follow-on to 004a, shipping waves 2 to 4 of the phase 004 plan. The skill-advisor scorer gained typed RoutingCalibration slots in place of inline calibration literals, env-var-aware helpers that resolve thresholds and calibration at call-time, and an externalized prompt-policy JSON so the linguistic sets and fire/no-fire thresholds are configurable without code edits. Delivered through a cli-opencode plus deepseek-v4-pro atomic three-wave dispatch with HALT-on-failure per wave and a final bundle gate.

### Added

- `resolvedConfidenceThreshold()` and `resolvedUncertaintyThreshold()` helpers in `compat/contract.ts` that read env vars at call-time and fall back to the contract defaults
- Typed RoutingCalibration slots in `scoring-constants.ts` for `memorySaveBonus`, `createAgentBonus` and `testingPlaybookBonus`
- New `mcp_server/data/prompt-policy.default.json` (91 lines) externalizing 5 linguistic sets plus 5 fire/no-fire thresholds
- Nine env vars: `SPECKIT_ADVISOR_CONFIDENCE_THRESHOLD`, `SPECKIT_ADVISOR_UNCERTAINTY_THRESHOLD`, `SPECKIT_ADVISOR_CALIBRATION_OVERRIDE_JSON`, `SPECKIT_ADVISOR_PROMPT_POLICY_PATH` plus 5 `SPECKIT_ADVISOR_PROMPT_POLICY_*` numeric overrides

### Changed

- `fusion.ts` reads the calibration slots instead of inline `0.55` and `0.65` literals
- `prompt-cache.ts`, `render.ts`, `subprocess.ts` and `skill-advisor-brief.ts` call the resolved-threshold helpers instead of the static contract defaults
- `prompt-policy.ts` loads its defaults from the JSON file at module init with a path override

### Fixed

- 9 P1 and 2 P2 audit findings from packet 021

### Verification

- system-spec-kit `typecheck:root` exit 0, and skill-advisor `tsc` exit 0
- vitest showed 4 pre-existing failures (corpus-parity and lane-weight-sweep) confirmed via `git stash` to exist on `HEAD~1`, so zero new failures from this work
- `data/prompt-policy.default.json` confirmed present and non-empty

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/compat/contract.ts` | Modified | Resolved-threshold helpers reading env vars |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/scoring-constants.ts` | Modified | RoutingCalibration typed slots |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts` | Modified | Reads calibration slots, not inline literals |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/prompt-policy.ts` | Modified | Loads defaults from JSON at init |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/prompt-cache.ts` | Modified | Calls resolved-threshold helpers |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/render.ts` | Modified | Calls resolved-threshold helpers |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/subprocess.ts` | Modified | Calls resolved-threshold helpers |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-advisor-brief.ts` | Modified | Calls resolved-threshold helpers |
| `.opencode/skills/system-skill-advisor/mcp_server/data/prompt-policy.default.json` | Created | Externalized linguistic sets and thresholds |

### Follow-Ups

- `SPECKIT_ADVISOR_LANE_WEIGHTS_JSON` was skipped because `lane-registry.ts` has no env-var extension point, deferred to a structural follow-on
- The `ENV_REFERENCE.md` update for the 9 new env vars was deferred to arc convergence
