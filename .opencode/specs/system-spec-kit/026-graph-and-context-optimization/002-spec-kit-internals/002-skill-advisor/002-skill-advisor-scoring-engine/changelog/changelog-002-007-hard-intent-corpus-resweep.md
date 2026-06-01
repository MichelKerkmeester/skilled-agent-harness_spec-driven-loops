

---
title: "Harder intent-described corpus + lexical mis-route sweep"
description: "Authored a harder 22-prompt corpus to test lexical mis-routes and ran a seeded sweep. The corpus confirmed that semantic weighting at 0.05 produces no top-route variance and no accuracy lift on harder cases."
trigger_phrases:
  - "harder intent prompt corpus"
  - "lexical false positive corpus"
  - "advisor cosine harder sweep"
  - "intent described misroute test"
  - "harder corpus saturation hypothesis"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-01

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/002-skill-advisor-scoring-engine/007-hard-intent-corpus-resweep` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/002-skill-advisor-scoring-engine`

### Summary

Authored a harder intent-prompt corpus with 22 lexical-mis-route prompts covering 11 distinct skill ids. Extended the seeded sweep test to run a second pass against this harder set. The harder corpus confirmed the saturation hypothesis only partly: the corpus is materially harder than the original 24 prompts, but semantic weights from 0.00 to 0.30 still produced no top-route variance and no accuracy lift. The recommendation is to stay at 0.05 lane weight.

### Added

- Harder intent prompt corpus fixture with 22 lexical-mis-route prompts across 11 skills.
- Second seeded sweep run against the harder corpus with delta comparison against original-24 baseline.
- Research artifact `research/sweep-results-harder.md` with full harder-set matrix results.

### Changed

- None.

### Fixed

- None.

### Verification

- Strict spec validation - Pass
- Parent strict validation - Pass
- Typecheck - Pass
- Vitest skill_advisor - Pass with known baseline
- Sweep harder run - Pass
- Dist rebuilt - Pass

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `mcp_server/skill_advisor/tests/scorer/fixtures/harder-intent-prompt-corpus.ts` | Created | Harder corpus fixture with 22 lexical-mis-route prompts across 11 skills |
| `mcp_server/skill_advisor/tests/scorer/lane-weight-sweep.vitest.ts` | Modified | Extended with second seeded sweep pass against harder corpus, fixture coverage assertions, skip-report handling, and report writer |

### Follow-Ups

- Authored vs real telemetry: harder prompts are still synthetic; real distributions may differ.
- Fixed lane registry: this packet does not change weights; downstream packet would act if a clear winner emerges.
- Provider variance: cosine vectors depend on the active embedding model; results bound to current Gemma config.
