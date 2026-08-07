---
title: "Changelog: Scoring Hardening [001-speckit-memory/028-scoring-hardening]"
description: "Chronological changelog for the scoring hardening phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/028-scoring-hardening` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory`

### Summary

This phase landed five recommendations in the real scoring sources, four as default-off behavioral flags and one as documentation. It surfaced a grounding signal in the envelope behind `SPECKIT_GROUNDING_SIGNAL_V1`, subtracted a measured corpus noise-floor before banding behind `SPECKIT_NOISE_FLOOR_SUBTRACTION_V1`, added a `cite_with_caveat` tier behind `SPECKIT_CITE_WITH_CAVEAT_V1`, bridged the Stage 4 evidence-gap signal into the verdict behind `SPECKIT_EVIDENCE_GAP_VERDICT_V1`, and documented the calibration re-fit as a proven non-fix. With every flag OFF the band, the envelope and the citation policy reproduce the shipped output. The typed sources were compiled to dist by `npm run build`, the vitest is 16/16 and no regression hit 248 touched-suite cases.

### Added

- Added four default-off flag readers for grounding signal, noise-floor subtraction, cite_with_caveat and evidence-gap verdict.
- Added `noise-floor.ts`, an embedder-keyed measured noise-floor and a fail-closed resolver, with the floor measured against `nomic-embed-text-v1.5`.
- Added `assessGrounding` in `confidence-scoring.ts` and the `grounding` envelope field surfaced by the formatter behind `SPECKIT_GROUNDING_SIGNAL_V1`.
- Added the `cite_with_caveat` tier in `deriveCitationPolicy` between `cite_results` and `do_not_cite_results` behind `SPECKIT_CITE_WITH_CAVEAT_V1`.
- Added `scoring-hardening.vitest.ts`, 16 cases pairing each flag-ON case with a flag-OFF case.

### Changed

- Subtracted a measured corpus noise-floor from the absolute relevance before the band read in `assessRequestQuality`, floored at zero, behind `SPECKIT_NOISE_FLOOR_SUBTRACTION_V1`, with the margin computed off raw scores so it stays byte-identical.
- Read an `evidenceGapDetected` option threaded from the same Stage 4 signal the recovery path reads and capped a good verdict at weak on a true gap behind `SPECKIT_EVIDENCE_GAP_VERDICT_V1`.
- Edited the real `.ts` sources and regenerated `dist` by `npm run build` rather than editing the compiled declaration the scaffold pointed at.

### Fixed

- No fixes recorded. The behavioral changes ship dark behind default-off flags until a flag graduates against the off-corpus fixtures.

### Verification

- `npm run typecheck` (tsc --noEmit): PASS, exit 0.
- `npm run build` (tsc --build plus finalize-dist): PASS, exit 0, the new flags present in compiled `search-flags.js`, `confidence-scoring.js`, `search-results.js` and `noise-floor.js`.
- New `scoring-hardening.vitest.ts`: PASS, 16/16.
- With every flag OFF the band, envelope and citation policy match the shipped output: PASS, each rec has a flag-OFF case.
- The noise-floor flag ON drops the off-corpus high-cosine sample below good, weak ON and good OFF: PASS.
- The evidence-gap flag ON caps a good verdict at weak on a true Stage 4 gap: PASS.
- No regression across the touched suites: PASS, 248/248 across 11 suites.
- ENV_REFERENCE drift guard: PASS, 3/3, the four new flags documented.

### Files Changed

- `mcp_server/lib/search/search-flags.ts`: four default-off flag readers.
- `mcp_server/lib/search/noise-floor.ts`: added, embedder-keyed measured noise-floor and a fail-closed resolver.
- `mcp_server/lib/search/confidence-scoring.ts`: noise-floor band subtraction, evidence-gap cap and `assessGrounding`.
- `mcp_server/formatters/search-results.ts`: surfaced the grounding signal and the cite_with_caveat tier, threaded the Stage 4 gap into the verdict.
- `mcp_server/ENV_REFERENCE.md`: the four default-off flags and the calibration non-fix statement.
- `mcp_server/tests/scoring-hardening.vitest.ts`: added, 16 cases flag-ON and flag-OFF.
- `mcp_server/dist/**`: regenerated compiled surfaces from the typed sources.

### Follow-Ups

- The noise-floor, cite-with-caveat and evidence-gap flags have since GRADUATED to default-on against the off-corpus fixtures.
- The grounding-signal flag was purely informational and has since been DELETED.
- The corpus noise-floor is measured against a single embedder, a second embedder needs its own measured entry before it subtracts, and wiring the live active-embedder identity into the verdict call was deferred to graduation.
