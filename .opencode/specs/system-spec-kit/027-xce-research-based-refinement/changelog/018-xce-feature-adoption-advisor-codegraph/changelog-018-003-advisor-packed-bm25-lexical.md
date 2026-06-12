---
title: "Changelog: 003-advisor-packed-bm25-lexical"
description: "Added a default-off packed BM25F lexical shadow helper for advisor skill fields while preserving live recommendation ranking."
trigger_phrases:
  - "018 003 advisor BM25 changelog"
  - "packed BM25F lexical shadow"
  - "advisor lexical shadow"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-10

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/003-advisor-packed-bm25-lexical` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph`

### Summary

The advisor gained a packed BM25F lexical scorer for shadow evaluation only. Existing token-overlap lexical scoring remains the only live lexical contribution, and the BM25 flag is default-off so live recommendation outputs remain unchanged until a future promotion phase.

### Added

- `bm25.ts`, a packed BM25F helper over advisor skill fields.
- `bm25-lexical-shadow.vitest.ts` covering helper behavior, footprint, corpus non-regression, and live parity.

### Changed

- `lexical.ts` now exposes default-off shadow scoring through `SPECKIT_ADVISOR_BM25_LEXICAL_SHADOW`.
- `lane-registry.ts` includes BM25 shadow metadata outside live fusion lanes.

### Fixed

- None. This phase intentionally did not change live ranking behavior.

### Verification

| Check | Result |
|-------|--------|
| BM25 lexical shadow tests | PASS: 1 file, 5 tests |
| Typecheck | PASS |
| Scorer and validate suites | PASS: 9 files, 74 tests |
| Build | PASS |
| Live parity | PASS: byte-identical `scoreAdvisorPrompt` output with flag off and on |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `lib/scorer/lanes/bm25.ts` | Created | Packed BM25F helper |
| `lib/scorer/lanes/lexical.ts` | Modified | Default-off shadow wrapper |
| `lib/scorer/lane-registry.ts` | Modified | Shadow metadata |
| `tests/scorer/bm25-lexical-shadow.vitest.ts` | Created | Helper and parity coverage |

### Follow-Ups

- Future promotion must wire BM25 into advisor_validate baselines and make a separate promotion decision.
