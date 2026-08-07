---
title: "022/004a Skill-Advisor Compat-Contract Consolidation (Wave 1): single source for confidence and uncertainty thresholds"
description: "Five skill-advisor production files now derive their default confidence (0.8) and uncertainty (0.35) thresholds from SKILL_ADVISOR_COMPAT_CONTRACT.defaults instead of inline literals. Closes 14 P0 audit findings."
trigger_phrases:
  - "022/004a compat contract consolidation"
  - "skill-advisor threshold single source"
  - "SKILL_ADVISOR_COMPAT_CONTRACT defaults"
  - "confidence uncertainty threshold dedup"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-23

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/004a-skill-advisor-compat-contract-consolidation`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc`

### Summary

The skill-advisor scorer carried the default confidence threshold (0.8) and uncertainty threshold (0.35) as inline literals duplicated across five files, which packet 021 flagged as 14 P0 drift findings. All five sites now derive both values from a single source, `SKILL_ADVISOR_COMPAT_CONTRACT.defaults` at `compat/contract.ts`. This is Wave 1 of the four-wave phase 004 plan. Waves 2 to 4 were split to the follow-on 004b after pre-execution investigation showed the original plan referenced files that do not exist in the current skill-advisor structure.

### Added

- `import { SKILL_ADVISOR_COMPAT_CONTRACT }` in `scorer/fusion.ts`, `skill-advisor-brief.ts`, `prompt-cache.ts`, `subprocess.ts` and `render.ts`

### Changed

- `scorer/fusion.ts`: `DEFAULT_CONFIDENCE_THRESHOLD` and `DEFAULT_UNCERTAINTY_THRESHOLD` now read from the contract defaults
- `skill-advisor-brief.ts`: the exported `DEFAULT_ADVISOR_CONFIDENCE_THRESHOLD` and `DEFAULT_ADVISOR_UNCERTAINTY_THRESHOLD` now derive from the contract, with the export shape preserved so downstream consumers are unchanged
- `prompt-cache.ts`, `subprocess.ts` and `render.ts`: inline `?? 0.8` and `?? 0.35` fallbacks replaced with the contract defaults

### Fixed

- 14 P0 audit findings from packet 021 (`f-iter004-001` through `f-iter004-014`), all duplicate confidence and uncertainty threshold defaults

### Verification

- skill-advisor `tsc --noEmit` exit 0, and system-spec-kit `typecheck:root` exit 0
- ban-list grep for ` 0.8` and ` 0.35` across the five files returned 0 hits, down from 10
- `rg -l SKILL_ADVISOR_COMPAT_CONTRACT lib/` returned 6 files, the 5 consumers plus `contract.ts`

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts` | Modified | Module-level threshold consts derive from the contract |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-advisor-brief.ts` | Modified | Exported threshold consts derive from the contract, shape preserved |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/prompt-cache.ts` | Modified | Inline fallbacks replaced |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/subprocess.ts` | Modified | Inline fallbacks replaced |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/render.ts` | Modified | Inline fallbacks replaced |

### Follow-Ups

- Waves 2 to 4 (RoutingCalibration interface expansion, env-var overrides, prompt-policy externalization) shipped in the follow-on 004b
- Compiled `.js` files keep the old literals until the next `tsc` build, left to the natural build cycle
