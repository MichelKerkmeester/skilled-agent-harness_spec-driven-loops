---
title: "Changelog: Deep Research Reducer-Anchor Template Fix (028/004 ship-first correctness) [004-deep-loop/001-reducer-anchor-fix]"
description: "Chronological changelog for the Deep Research Reducer-Anchor Template Fix (028/004 ship-first correctness) phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-19

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/004-deep-loop/001-reducer-anchor-fix` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/004-deep-loop`

### Summary

A fresh deep-research strategy file now reduces cleanly on the first iteration. The shipped template had the reducer-owned headings but lacked the anchor comment pairs the reducer uses to update those sections. This phase adds the seven required anchor pairs to `deep_research_strategy.md`, so new deep-research runs can fold cross-iteration state without a first-reduce crash.

### Added

- Seven reducer-owned anchor pairs in the shipped deep-research strategy template.
- Additive markers only. Existing headings and machine-owned boundaries stay in place.

### Changed

- `deep_research_strategy.md` now matches the reducer's expected update targets for key questions, answered questions, what worked, what failed, exhausted approaches, ruled-out directions and next focus.
- `reduce-state.cjs` stays unchanged. The template now satisfies the reducer contract.

### Fixed

- New strategy copies no longer fail with a missing `key-questions` anchor during the first reduce.

### Verification

- Template anchor-pair count - PASS
- Reducer regex match on all seven ids - PASS
- Template-only runtime diff - PASS

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/deep-loop-workflows/deep-research/assets/deep_research_strategy.md` | Modified | Added the 7 reducer-owned ANCHOR:<id> / /ANCHOR:<id> HTML-comment marker pairs (+14 marker lines) so reduce-state.cjs no longer hard-fails on a fresh copy. |

### Follow-Ups

- Scope stays limited to the seven reducer-owned strategy anchors.
- Reliability-weighted convergence remains separate and unaffected.
