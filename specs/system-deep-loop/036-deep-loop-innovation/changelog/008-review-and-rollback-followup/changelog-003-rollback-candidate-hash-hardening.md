---
title: "Changelog: Rollback Candidate Hash Hardening [008-review-and-rollback-followup/003-rollback-candidate-hash-hardening]"
description: "Changelog for the rollback candidate hash hardening phase: enforced promoted-candidate-only rollback authority by removing dual-hash acceptance in assertRollbackHashGuard."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-08-13

> Spec folder: `specs/system-deep-loop/036-deep-loop-innovation/008-review-and-rollback-followup/003-rollback-candidate-hash-hardening` (Level 1)
> Parent packet: `specs/system-deep-loop/036-deep-loop-innovation/008-review-and-rollback-followup`

### Summary

This packet hardened the deep-improvement rollback path. `assertRollbackHashGuard` in `rollback-candidate.cjs` previously accepted either the pre-acceptance target hash or the promoted-candidate hash as a valid current-target state; the fix requires the current target hash to equal the promoted candidate hash exclusively, removing pre-ship rollback entirely as a deliberate behavior change. Landed in commit `c4fc339e83` with a red-before/green-after negative test in `rollback-candidate-hash-guard.vitest.ts` and the benchmark's pre-ship-rollback case updated to expect rejection; the two touched test files re-run 15/15 green. Status is Complete.
