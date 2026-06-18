---
title: "Confidence Calibration: Relevance-Dominant Rebalance On, Isotonic Infrastructure Off"
description: "Per-result confidence stopped under-reading a strong isolated hit. A default-ON weight rebalance makes relevance dominate the per-result confidence value, and a separate flag-gated default-OFF isotonic calibration path is shipped as machinery plus a corpus-derived proxy seed only. The calibration stays off until a real labeled set is collected, because the proxy is unvalidated."
trigger_phrases:
  - "002/017/004 confidence calibration labeled set changelog"
  - "relevance-dominant confidence rebalance"
  - "isotonic calibration flag-gated default off"
  - "calibration proxy seed unvalidated"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-17

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/017-search-and-output-intelligence-implementation/004-confidence-calibration-labeled-set` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement`

### Summary

A strong but isolated high-cosine hit could be capped at `medium` confidence because the per-result `confidence.value` reflected only about forty percent absolute relevance. This phase ships two clearly separated deliverables. The first is a default-ON weight rebalance that makes relevance dominate the per-result confidence value, moving the blend to `heuristicValue * 0.45 + scorePrior * 0.55` so a genuinely relevant result reads as confident. The second is calibration infrastructure: an isotonic fit-and-apply path that would map raw scores onto observed relevance, plus a loader and a flag. That second path is default-OFF and ships as machinery plus a corpus-derived proxy seed only. The proxy labels are derived from the spec corpus (a spec's own keywords as the query, that spec as the positive and a different spec as the negative), so the fitted model is unvalidated and must not be trusted for production ranking. The flag stays off until a real labeled set of roughly fifty to one hundred human-judged pairs from live traffic is collected.

### Added

- `lib/search/confidence-calibration.ts` - isotonic PAV fit, apply and model loader
- `SPECKIT_CONFIDENCE_CALIBRATION` opt-in flag (default OFF) and `SPECKIT_CONFIDENCE_CALIBRATION_MODEL` model-path resolution
- Proxy seed assets under the phase folder: a corpus-derived labeled set, a fitted isotonic model and the `fit-calibration.mjs` seed generator, all marked not ground truth

### Changed

- `lib/search/confidence-scoring.ts` - per-result confidence rebalanced to `heuristicValue * 0.45 + scorePrior * 0.55` (default ON) plus a flag-gated calibration hook
- `lib/search/search-flags.ts` - added `isConfidenceCalibrationEnabled()` (opt-in) and the model-path resolver

### Fixed

- A strong isolated hit no longer under-reads its per-result confidence

### Verification

| Check | Result |
|-------|--------|
| Phase suite | PASS: `confidence-calibration.vitest.ts` (fit, apply, loader, flag-off no-op) |
| Touched-surface sweep | PASS: 12 files green |
| Calibration model validity | CONFIRMED proxy: monotone isotonic curve (x 0 to 1, y 0 to 1), not degenerate, but fit on proxy labels not ground truth |
| Live calibration | DEFERRED: flag stays OFF until a real labeled set exists |

### Files Changed

| File | Action |
|------|--------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-calibration.ts` | Added |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/tests/confidence-calibration.vitest.ts` | Added |
| `…/004-confidence-calibration-labeled-set/assets/confidence-labeled-set.starter.json` | Added |
| `…/004-confidence-calibration-labeled-set/assets/confidence-calibration-model.starter.json` | Added |
| `…/004-confidence-calibration-labeled-set/assets/fit-calibration.mjs` | Added |

### Follow-Ups

- The real labeled set (roughly fifty to one hundred human-judged pairs from live `memory_search` traffic, joined to the raw score the pipeline assigned each pair) is the documented prerequisite before `SPECKIT_CONFIDENCE_CALIBRATION` can be enabled.
