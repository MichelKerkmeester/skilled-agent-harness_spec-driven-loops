---
title: "Harder intent-described corpus + sweep against lexical false-positives"
description: "Authored a harder 22-prompt corpus where the lexical lane mis-routes, extended the seeded sweep to cover it, and confirmed the cosine lane saturation hypothesis at weight 0.05."
trigger_phrases:
  - "harder intent prompt corpus"
  - "lexical false positive sweep"
  - "skill advisor scoring engine test"
  - "lane weight sweep harder set"
  - "cosine lane saturation hypothesis"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/002-skill-advisor-scoring-engine/007-hard-intent-corpus-resweep` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/002-skill-advisor-scoring-engine`

### Summary

The original 24-prompt intent corpus was lexical-saturated and showed zero routing variance across all semantic weight levels. A harder corpus was needed to test whether the cosine lane could help when prompts describe intent without using the target skill's keywords. A new 22-prompt harder corpus covering 11 skills was authored alongside a second seeded sweep over the combined set. Results confirmed partial saturation only: the harder set is materially harder but semantic weights from 0.00 to 0.30 still produced no routing lift, reinforcing the recommendation to stay at weight 0.05.

### Added
- A harder intent-described prompt corpus with 22 lexical-mis-route entries covering 11 skill ids
- A second seeded sweep run in the lane-weight test against the combined original and harder corpus
- A sweep results report documenting per-vector accuracy, intent-described deltas, and flipped counts

### Changed
- The lane-weight sweep test now asserts fixture coverage for the harder corpus and handles skip-report fallback writing
- None.

### Fixed
- None.

### Verification
- Strict spec validation: Pass
- Parent strict validation: Pass
- Typecheck: Pass
- Vitest skill_advisor suite: Pass with 1 known baseline failure (303 tests, 42 files)
- Seeded sweep harder run: Pass (3 tests, 1 file)
- Dist rebuilt: Pass
- Recommendation cited: Pass (stay at 0.05)

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `mcp_server/skill_advisor/tests/scorer/fixtures/harder-intent-prompt-corpus.ts` | Created | 22 lexical-mis-route prompts with inline mis-route comments, mirroring the existing fixture shape |
| `mcp_server/skill_advisor/tests/scorer/lane-weight-sweep.vitest.ts` | Modified | Added second seeded sweep, fixture coverage assertions, and report writer for harder results |
| `research/sweep-results-harder.md` | Created | Per-vector table with accuracy, intent-described delta, and flipped-from-baseline counts |

### Follow-Ups
- Authored vs real telemetry: harder prompts are still synthetic and real user distributions may differ
- Fixed lane registry: this packet does not change weights and a downstream packet would act if a clear winner emerges
- Provider variance: cosine vectors depend on the active embedding model and results are bound to the current Gemma config
