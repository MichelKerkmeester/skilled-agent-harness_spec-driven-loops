---
title: "Changelog: Advisor RRF Fusion Benchmark [005-dark-flag-graduation/007-advisor-rrf-fusion]"
description: "Chronological changelog for the Advisor RRF Fusion Benchmark benchmark phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-24

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-dark-flag-graduation/007-advisor-rrf-fusion` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-dark-flag-graduation`

### Summary

This phase benchmarked the advisor RRF-fusion cluster (`SPECKIT_ADVISOR_RRF_FUSION` with `ADVISOR_RRF_K=8`, the conflict-rerank seam and `SPECKIT_ADVISOR_SELF_RECOMMENDATION_GUARD`) against the weighted-sum baseline on routing top-1 correctness through the production `scoreAdvisorPrompt` path. The widened 42-prompt labeled set included a self_guard band and a conflict band that targeted the two seam guards directly. RRF lifted top-1 from 37 of 42 (0.8810) to 38 of 42 (0.9048) with zero regressions and 0.9762 agreement. The conflict-rerank seam corrected one top-1 (4 of 5 to 5 of 5) and repaired a regression plain RRF introduces by dropping the signed conflict suppression the weighted-sum holds natively. The self-recommendation guard moved zero top-1 on the four audit prompts built to trigger it and is behaviorally redundant with the existing generic explainer floor and un-flagged audit penalty. Verdicts: GRADUATE for the RRF core paired with the conflict-rerank seam. CUT for the self-recommendation guard.

### Added

- `scripts/labeled-routing-set.mjs`: 42-prompt labeled routing set grounded in the advisor corpus trigger phrases across five bands (exact, paraphrase, hard, self_guard, conflict).
- `scripts/conflict-overlay.mjs`: in-memory benchmark overlay seeding five `conflicts_with` edges into the loaded projection for the conflict band only, leaving the live corpus read-only.
- `scripts/advisor-rrf-benchmark.mjs`: three-arm matrix harness over the production `scoreAdvisorPrompt` path against a read-only projection copy, with the self-guard and conflict-rerank differentials.
- `results/metrics.json`: per-prompt and aggregate metric rollup covering all three arms, the per-band breakdown, the agreement spread, the two seam differentials, the determinism pass and the byte-identity pass.
- `results/skill-graph.backup.sqlite`: read-only backup copy of the live projection committed as the evidence record.
- `benchmark-results.md`: data tables and per-seam graduate, refine and cut verdicts grounded strictly in `results/metrics.json`.

### Changed

- No production code was edited. No flag default was flipped. The phase widened the prompt set from 33 to 42 prompts and added the self_guard and conflict bands to the prior partial measurement that had returned REFINE.

### Fixed

- Nothing to report.

### Verification

- Production path confirmed: harness imports compiled `scoreAdvisorPrompt` and `loadAdvisorProjection` and toggles only the real flag readers through the environment.
- Read-only corpus confirmed: source `skill-graph.sqlite` hash unchanged after the run and git shows no change to it.
- RRF top-1 lift confirmed: 37 of 42 (0.8810) baseline to 38 of 42 (0.9048) under RRF, agreement spread 0.9762, one prompt moved from wrong to right.
- Self-guard differential confirmed: 0 of 4 top-1 moved on the four self_guard band prompts.
- Conflict-rerank differential confirmed: 1 of 5 top-1 moved, correct rising from 4 of 5 to 5 of 5 with the overlay.
- Byte-identity confirmed: baseline arm byte-identical across repeated runs over all 42 prompts.
- Determinism confirmed: every arm is run-to-run top-1 stable.
- Strict validation confirmed: `validate.sh --strict` on this phase exits clean.

### Files Changed

- `scripts/labeled-routing-set.mjs`: 42-prompt labeled routing set across five bands.
- `scripts/conflict-overlay.mjs`: benchmark conflict-edge overlay merged into the in-memory projection.
- `scripts/advisor-rrf-benchmark.mjs`: three-arm matrix harness with seam differentials.
- `results/metrics.json`: single source of truth for all benchmark numbers and verdicts.
- `results/skill-graph.backup.sqlite`: committed read-only projection backup as evidence record.
- `benchmark-results.md`: per-seam verdicts and data tables.
- `implementation-summary.md`: what was built, key decisions, verification and known limitations.
- `spec.md`: problem statement, scope and requirements for the phase.

### Follow-Ups

- The conflict-rerank seam graduates as RRF's safety net but is inert on the live corpus because no `conflicts_with` edges exist. Seeding those edges into the live corpus is a separate corpus-authoring decision.
- The self-recommendation guard CUT should be paired with deleting the guard code so the redundancy does not re-emerge if the generic explainer floor or un-flagged audit penalty changes in the future.
- The one-prompt RRF lift is a narrow margin on a deterministic scorer. A larger or harder labeled set could widen or narrow it and is worth a follow-on measurement before the live flip.
