---
title: "Changelog: Convergence Threshold and Forced Depth Flag [009-research-backlog-remediation/008-convergence-threshold-and-forced-depth-flag]"
description: "Chronological changelog for the Convergence Threshold and Forced Depth Flag phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-07-01

> Spec folder: `.opencode/specs/deep-loops/030-agent-loops-improved/009-research-backlog-remediation/008-convergence-threshold-and-forced-depth-flag` (Level 1)
> Parent packet: `.opencode/specs/deep-loops/030-agent-loops-improved/009-research-backlog-remediation`

### Summary

A hardcoded convergence-threshold fallback disagreed with deep-research's own documented default, and the original fix framing of a flat value change was corrected mid-implementation once it was found the same code path also serves review and context loops with their own different correct defaults. The already-working but undocumented `--stop-policy` flag was also documented on both consumer commands.

### Added

- Add `--stop-policy <convergence|max-iterations>` documentation, with its effect explained, on both `/deep:research` and `/deep:review`.
- Add 2 regression tests asserting the research-specific default and the preserved review and context default.

### Changed

- `buildNativeCommandInput()`'s convergence-threshold fallback is now loop-type-conditional, research gets 0.05 and every other native loop type keeps 0.1, rather than a flat value replacement that would have regressed review and context.

### Fixed

- Fixed the cross-sibling convergence-threshold default mismatch for research lineages specifically, while confirming review and context already had the correct default and were never actually broken.

### Verification

- Targeted `fanout-run.vitest.ts` run, PASS, 40 of 40 including the 2 new tests.
- Full `deep-loop-runtime` Vitest suite run, PASS, 559 of 561, the same pre-existing unrelated baseline failures noted throughout this remediation phase.
- Direct diff review confirmed the conditional logic, not a flat value change.

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Modified | Loop-type-conditional convergence-threshold fallback. |
| `.opencode/commands/deep/research.md` | Modified | Documented `--stop-policy`. |
| `.opencode/commands/deep/review.md` | Modified | Documented `--stop-policy`'s effect in full. |
| `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts` | Modified | Added the 2 default-value regression tests. |

### Follow-Ups

- None. The corrected, loop-type-aware fix is documented as an explicit amendment to the original spec framing.
