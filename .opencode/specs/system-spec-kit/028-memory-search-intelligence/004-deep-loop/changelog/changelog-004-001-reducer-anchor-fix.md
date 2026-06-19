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

A freshly-copied deep-research strategy file now folds its cross-iteration state cleanly instead of crashing on the first reduce. The shipped template deep_research_strategy.md previously carried thirteen section headings but none of the ANCHOR:* markers the reducer keys on, so the very first reduce after iteration 1 threw Missing anchor section key-questions in strategy file and the loop could not advance. The fix wraps the seven reducer-owned headings in their anchor pairs, restoring deterministic reducer behavior for every new deep-research run.

### Added

- Preserve all existing headings + the <!-- MACHINE-OWNED: START --> marker (additive-only, no heading moved/renamed)

### Changed

- Confirm the 7 reducer-target anchor ids + call sites (.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:734-745) — verified: key-questions, answered-questions, what-worked, what-failed, exhausted-approaches, ruled-out-directions, next-focus
- [P] Reference the hand-patched working copy for the target shape (.opencode/specs/system-spec-kit/028-memory-search-intelligence/004-deep-loop/research/deep-research-strategy.md)
- Wrap key-questions heading (§3) in its ANCHOR:key-questions / /ANCHOR:key-questions HTML-comment pair (deep_research_strategy.md) — commit 738e118751
- Wrap answered-questions heading (§6) in its anchor pair (deep_research_strategy.md) — commit 738e118751
- Wrap what-worked heading (§7) in its anchor pair (deep_research_strategy.md) — commit 738e118751
- Wrap what-failed heading (§8) in its anchor pair (deep_research_strategy.md) — commit 738e118751

### Fixed

- Confirm the shipped template carried ZERO anchor markers pre-fix (.opencode/skills/deep-loop-workflows/deep-research/assets/deep_research_strategy.md) — grep count = 0

### Verification

- Template carries the 7 anchor pairs - PASS — grep of the open-marker comment = 14; all 7 ids present (lines 39/58/66/74/82/98/106)
- Reducer regex matches all 7 ids on a fresh copy - PASS — 030 §14: "7 anchor pairs added; reducer regex verified (all 7 match)"
- Template-only diff (no runtime-code change) - PASS — commit 738e118751 touches only deep_research_strategy.md (+14) plus the 030 scaffold; reduce-state.cjs unchanged
- Tasks complete - 17 completed task item(s) recorded

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/deep-loop-workflows/deep-research/assets/deep_research_strategy.md` | Modified | Added the 7 reducer-owned ANCHOR:<id> / /ANCHOR:<id> HTML-comment marker pairs (+14 marker lines) so reduce-state.cjs no longer hard-fails on a fresh copy. |

### Follow-Ups

- Scope is the 7 updateStrategyContent anchors only. The reducer writes other anchored sections elsewhere (reduce-state.cjs:785+); those were never part of the hard-failure surface and are out of scope here.
- The reliability-weighted deep-loop cluster (D1/D2/D3/Q2) is unaffected and still open. D2 is a wholly-absent net-new build (every input is r=0.5 today), so it remains NO-GO until built and benchmarked, in sibling sub-phases of 004-deep-loop. This fix is fully independent of that cluster.
