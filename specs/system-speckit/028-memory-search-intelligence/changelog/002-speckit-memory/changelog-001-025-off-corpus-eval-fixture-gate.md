---
title: "Changelog: Off-Corpus Eval Fixture and False-Confirm Gate [001-speckit-memory/025-off-corpus-eval-fixture-gate]"
description: "Chronological changelog for the off-corpus eval fixture and false-confirm gate phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/025-off-corpus-eval-fixture-gate` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory`

### Summary

This phase shipped an `off_corpus` eval fixture (ids 98-103, kubernetes pinned as the permanent regression anchor) with six absent bare terms carrying zero relevance rows, a `run-false-confirm-eval.mjs` driver that scores the class through the production verdict path and reads the dormant `falseGoodOnHardNegatives` metric, plus a default-off `SPECKIT_FALSE_CONFIRM_MAX_RATE` gate with a grandfather report mode. The live driver measures a 0.833 false-confirm rate on nomic, five of six absent terms earning a good verdict on an unrelated doc. The phase measures and guards the off-corpus defect and does not touch the verdict, the downstream lexical-grounding floor fixes it.

### Added

- Added the `off_corpus` query class to the eval ground-truth (ids 98-103) with kubernetes, oauth, kafka, terraform, graphql and webpack as absent bare terms, each with zero relevance rows.
- Added `run-false-confirm-eval.mjs`, a driver scoring the class through `computeResultConfidence` then `assessRequestQuality` on a read-only tempdir backup of the live DB, reusing `computeCitabilityConfusionMetrics` to read `falseGoodOnHardNegatives`.
- Added the default-off `SPECKIT_FALSE_CONFIRM_MAX_RATE` gate with a `SPECKIT_FALSE_CONFIRM_GRANDFATHER` report mode.
- Added `false-confirm-eval.vitest.ts` covering the class shape, the metric wiring and the gate modes.

### Changed

- Surfaced the `off_corpus` category through the `QueryCategory` union so the harness loads the absent-term queries.
- Exempted the target-free `off_corpus` class from the per-query relevance-target gates in `ground-truth-generator.ts`, mirrored in `ground-truth.vitest.ts`, a documented deviation needed to satisfy the requirements.

### Fixed

- No fixes recorded. This phase measures the defect and guards a regression, it does not move good versus weak.

### Verification

- Vitest covering the class shape and the false-confirm metric: PASS, 16/16 green.
- The kubernetes anchor is present with the PERMANENT ANCHOR marker and `resolveOffCorpusClass` rejects a drifted target: CONFIRMED.
- The env unset and grandfather modes record the rate and exit zero: CONFIRMED live, exit 0.
- The env 0.0 below the measured 0.833 rate exits non-zero and a non-numeric env is rejected: CONFIRMED live, exit 1.
- The report carries the active `nomic-embed-text-v1.5` block and the six scored terms: CONFIRMED.
- No edit to the verdict or scoring path: CONFIRMED, `git diff` clean on `confidence-scoring.ts` and `pipeline/types.ts`.
- Broad eval and scoring suite: PASS, 212/212 across 10 files.
- `validate.sh --strict` on 025: CONFIRMED, exit 0.

### Files Changed

- `mcp_server/lib/eval/data/ground-truth.json`: added the `off_corpus` class (ids 98-103) with absent bare terms and zero relevance rows.
- `mcp_server/lib/eval/ground-truth-data.ts`: added `off_corpus` to the `QueryCategory` union.
- `mcp_server/lib/eval/ground-truth-generator.ts`: exempted the target-free class from the per-query relevance-target gates.
- `mcp_server/scripts/evals/run-false-confirm-eval.mjs`: created, the driver gated by `SPECKIT_FALSE_CONFIRM_MAX_RATE`.
- `mcp_server/tests/false-confirm-eval.vitest.ts`: created, covers the class shape, metric wiring and gate modes.
- `mcp_server/tests/ground-truth.vitest.ts`: mirrored the target-free exemption and added `off_corpus` to the valid categories.

### Follow-Ups

- The off-corpus false-positive persists until the separate downstream lexical-grounding floor lands, the gate ships default-off for that reason.
- The `SPECKIT_FALSE_CONFIRM_MAX_RATE` enforcement value stays open until the downstream verdict fix lands.
- The 0.833 rate is embedder-scoped to nomic and should be re-measured on an embedder change.
