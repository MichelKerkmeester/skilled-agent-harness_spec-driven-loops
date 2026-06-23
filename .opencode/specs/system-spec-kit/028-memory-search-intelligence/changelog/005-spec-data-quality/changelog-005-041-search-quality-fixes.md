---
title: "Changelog: Search-Quality Fixes [005-spec-data-quality/041-search-quality-fixes]"
description: "Chronological changelog for the search-quality fixes phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-23

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/041-search-quality-fixes` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality`

### Summary

Landed and verified the six search-quality fixes the 029 deep-research surfaced. The keystone is the one real bug. The `SPECKIT_EVIDENCE_GAP_VERDICT_V1` cap had graduated to default-ON but never fired on the live path, because the handler set the evidence-gap warning that drives the banner yet never set the boolean the verdict cap reads. Bridging the Stage-4 `evidenceGapDetected` signal into the verdict path makes the cap fire live, so an off-corpus query now caps `good` to `weak` with the banner and verdict in agreement where it returned `good` beside the banner before. The other five are a three-tier `citeCorrect` benchmark metric, an honest `retrievalProfileWeightsEnabled` envelope field, a resolved `score` on graph and degree rows, a default-off deterministic-ranking flag and a presentation-contract count-and-title tightening.

### Added

- The keystone bridge in the search handler, plumbing `pipelineResult.metadata.stage4.evidenceGapDetected` into `extraData.evidenceGap` so a gap-detecting search caps `good` to `weak` before the envelope renders.
- A default-off `SPECKIT_DETERMINISTIC_RANKING` flag across `search-flags.ts`, `hybrid-search.ts` and `pipeline/stage2-fusion.ts`, which removes the wall-clock recency inputs so a fixed query is reproducible, with the always-on trigger id tie-break as its pure-win companion.
- A new `deterministic-ranking-flag.vitest.ts` and a graph-row assertion in the search-results formatter tests.

### Changed

- The `citeCorrect` metric in the 029 `extract-metrics.mjs` became three-tier-aware, so the re-extracted rate reads 1.0 across all four models where the binary metric read about 0.55.
- The provenance envelope gained an honest `retrievalProfileWeightsEnabled` field for programmatic consumers, with `intent.weightsApplied` left intact, registered after adding the new flag to the `provenance-envelope.vitest.ts` search-flags mock.
- Graph and degree rows now carry a resolved `score` in `search-results.ts` rather than a blank.
- The `search_presentation.txt` contract tightened so the displayed count equals the rows shown in the `shown of total` form, with the leaf title corrected.

### Fixed

- The dead evidence-gap verdict cap now fires live. The recovery-classification side effect was checked, on a true gap the recovery status becomes `partial` (an appropriate refine hint) and non-gaps are unchanged.

### Verification

- Keystone, live - the dead cap fires. Off-corpus `kubernetes` returns `weak` plus `cite_with_caveat` with the banner, the `good`-beside-banner contradiction is gone.
- Focused tests - scoring-hardening, deterministic-ranking-flag, handler-memory-search, provenance-envelope, search-results-format and env-reference-drift all pass. Fix 5 ran 163 tests across the ranking suites, byte-identical with the flag off.
- Fast-subset re-run (9 cells, 3 open-source models) - 6 of 6 off-corpus cells capped to `weak` or `gap`, and 0 `good`-beside-banner contradictions where the prior failure mode was 19 of 144. `authentication` returns `gap` plus `do_not_cite_results`, `kubernetes` returns `weak` plus `cite_with_caveat`.
- dist - `npm run build` compiled all four code fixes into dist and the daemon was recycled so the re-run exercised the rebuilt dist.
- Full-suite note - the pre-existing mcp_server failures are unrelated, this change added zero new mock failures.

### Files Changed

- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts`: bridged the Stage-4 evidence-gap signal into the verdict-cap path and added the honest `retrievalProfileWeightsEnabled` envelope field.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts`: added the default-off `SPECKIT_DETERMINISTIC_RANKING` flag and its accessor.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`: routed ranking through the deterministic flag with the always-on trigger id tie-break.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`: zeroed the wall-clock recency inputs behind the flag.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-results.ts`: resolved the `score` on graph and degree rows.
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/029-vague-query-model-benchmark/scripts/extract-metrics.mjs`: made the `citeCorrect` metric three-tier-aware.
- `.opencode/commands/memory/assets/search_presentation.txt`: tightened the count-equals-rows contract and corrected the leaf title.
- `.opencode/skills/system-spec-kit/mcp_server/tests/provenance-envelope.vitest.ts` and `deterministic-ranking-flag.vitest.ts`: added the new flag mock and the deterministic-ranking coverage.

### Follow-Ups

- The deterministic-ranking flag ships default-off and unproven for recall. Graduating it to default-on needs a recall benchmark confirming that removing recency does not hurt ranking. That benchmark ran in `042-deterministic-ranking-benchmark` and returned STAY DEFAULT-OFF.
- The aligned-query cap is conservative. The Stage-4 gap detector fires on the ambiguous one-word `graph` query and caps it to `weak`, banner and verdict in agreement. Whether the threshold should be that conservative on aligned one-word queries was a tuning question carried into `043-gap-threshold-calibration-benchmark`, which found the detector mis-designed not mis-tuned.
