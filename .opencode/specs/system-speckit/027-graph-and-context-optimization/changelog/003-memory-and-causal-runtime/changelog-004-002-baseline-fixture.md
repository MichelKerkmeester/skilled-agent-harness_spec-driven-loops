---
title: "Code-retrieval baseline fixture for CocoIndex embedder benchmarking"
description: "Authored 18 deterministic query-to-expected-source pairs across 5 easy, 7 medium, 6 hard tiers, plus an idempotent validator script, to give 004-code-index-stack a repeatable retrieval benchmark."
trigger_phrases:
  - "code-retrieval baseline fixture"
  - "cocoindex embedder fixture"
  - "baseline fixture 002"
  - "fixture-validate.sh"
  - "018/002 baseline fixture"
importance_tier: "normal"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-17

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/002-baseline-fixture` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack`

### Summary

CocoIndex embedder comparisons had no deterministic benchmark: "is CodeRankEmbed better?" had no measurable answer without a fixed query-to-source ground truth. The mk-spec-memory side already had cat-24/409 for its own retrieval tests, but no equivalent existed for the CocoIndex code-search path.

Eighteen deterministic query-to-expected-source pairs were authored across difficulty tiers (5 easy with high lexical overlap, 7 medium with paraphrased wording, 6 hard with semantic-intent-only queries). Domains span mk-spec-memory embedder code, mk-spec-memory handler code, Code Graph libraries, the rescue/fusion layer, CocoIndex Python code, spec-kit scripts, Vitest/Python tests. An idempotent validator script checks fixture shape, path existence, safe repo-relative paths, difficulty distribution, `DEFAULT_INCLUDED_PATTERNS` compatibility. The fixture gives sub-phase 003-comparison-measure a stable scoring surface.

### Added

- `evidence/code-retrieval-fixture.json` with 18 query-to-expected-source pairs (5 easy, 7 medium, 6 hard) (NEW)
- `evidence/fixture-validate.sh` idempotent validator checking shape, path existence, repo-relative safety, difficulty distribution (NEW)

### Changed

None.

### Fixed

None.

### Verification

| Check | Result |
|-------|--------|
| `bash evidence/fixture-validate.sh` | PASS, exit 0, 18 pairs with `easy=5`, `medium=7`, `hard=6` |
| Hand-review: queries avoid exact source snippets and adversarial wording | PASS |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` | PASS, exit 0 |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `evidence/code-retrieval-fixture.json` (NEW) | Created | 18 deterministic query-to-expected-source pairs across easy, medium, hard tiers. |
| `evidence/fixture-validate.sh` (NEW) | Created | Idempotent validator for shape, path existence, safe paths, difficulty distribution, CocoIndex include-pattern compatibility. |

### Follow-Ups

- Run 003-comparison-measure against this fixture to produce per-difficulty recall scores for each embedder candidate.
- Revalidate fixture paths after any large-scale repo rename or restructure because `fixture-validate.sh` catches drift at run time, not at author time.
