---
title: "Changelog: Lexical-Grounding Floor [001-speckit-memory/026-lexical-grounding-floor]"
description: "Chronological changelog for the lexical-grounding floor phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-22

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/026-lexical-grounding-floor` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory`

### Summary

This phase shipped a lexical-grounding floor and a single-hit corroboration guard in `assessRequestQuality`, both behind the default-off `SPECKIT_LEXICAL_GROUNDING_V1` flag. The floor denies a good verdict unless the top hit clears the grounding floor read off the `fts_score` or `bm25_score` or `keyword` signal already on the rows, or a direct query-term overlap grounds it. With the flag ON the 025 off-corpus driver `falseConfirmRate` drops from 0.833 to 0, and with the flag OFF the verdict and citation logic are byte-for-byte the shipped behavior.

### Added

- Added the lexical-grounding floor, the single-hit corroboration guard and the lexical-signal and query-overlap helpers to `assessRequestQuality`, all gated by the default-off flag.
- Added the `isLexicalGroundingEnabled` default-off flag reader for `SPECKIT_LEXICAL_GROUNDING_V1`.
- Added `lexical-grounding-floor.vitest.ts`, a verdict-level proof over the off-corpus anchor, the aligned good queries, the weak case and the lone-hit path, flag ON and flag OFF.

### Changed

- Threaded the query string from the formatter into the `assessRequestQuality` call so the floor can read query-term overlap as a secondary grounding signal.
- Gated all three good branches including the top-dominant one, so an ungrounded hit cannot reach good even at a 0.8 cosine, with `deriveCitationPolicy` left unchanged because the gated label flows to cite_results automatically.
- Required single-hit corroboration on both the margin path and the lone-hit qualityRatio path, so a single off-corpus result with a zero margin can no longer reach good.

### Fixed

- Fixed the off-corpus false-relevance defect where a fluent absent term such as kubernetes earned a confident citation on one spurious high-cosine hit, when the flag is ON.

### Verification

- With the flag ON the off-corpus sample scores weak or gap: PASS, 025 driver `falseConfirmRate` 0.833 to 0, kubernetes weak with the flag ON.
- A single-result zero-margin sample scores weak and a two-hit corroborated query at the same top score scores good: PASS, vitest corroboration cases green.
- With the flag OFF the lone hit still scores good, proving the dark default leaves the shipped contract untouched: PASS, vitest dark-default case green and the two sibling suites unchanged.
- An absent lexical signal fails closed to weak or gap: PASS, vitest fail-closed case green.
- Vitest total: PASS, 12/12.
- The sibling `request-quality-aggregation.vitest.ts` and `scoring-opt-in.vitest.ts` pass unchanged.

### Files Changed

- `mcp_server/lib/search/confidence-scoring.ts`: added the lexical-grounding floor, the single-hit corroboration guard and the lexical-signal and query-overlap helpers, all gated, flag-OFF branch left unchanged.
- `mcp_server/lib/search/search-flags.ts`: added the `isLexicalGroundingEnabled` default-off reader for `SPECKIT_LEXICAL_GROUNDING_V1`.
- `mcp_server/formatters/search-results.ts`: threaded the query string into `assessRequestQuality`, `deriveCitationPolicy` unchanged.
- `mcp_server/tests/lexical-grounding-floor.vitest.ts`: created, verdict-level proof over the off-corpus, aligned-good, weak and lone-hit paths, flag ON and OFF.

### Follow-Ups

- Graduate the flag to ON after a wider off-corpus and aligned-good validation pass. The flag has since GRADUATED to default-on.
- The 0.833 to 0 `falseConfirmRate` delta was measured on `nomic-embed-text-v1.5` and the measured rate should be re-measured before graduating on a different embedder.
- The lexical-grounding floor is held at zero, a future embedder with noisier lexical scores may warrant tuning it.
