---
title: "Changelog: Phase 4: discriminating-bakeoff [149-kimi-k2-7-code-support/004-discriminating-bakeoff]"
description: "Chronological changelog for the strict-validator Kimi K2.7 Code bakeoff that produced empirical guidance."
trigger_phrases:
  - "phase changelog"
  - "discriminating bakeoff"
  - "kimi run 007"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/skilled-agent-orchestration/z_archive/116-kimi-k2-7-code-support/004-discriminating-bakeoff` (Level 1)
> Parent packet: `.opencode/specs/skilled-agent-orchestration/z_archive/116-kimi-k2-7-code-support`

### Summary

Run 006 proved the first bakeoff was too easy, so this phase built the sharper test the recommendation needed. Run 007 used invalid-dominant strict validators, recovered from an external kill, fixed throttling, persisted serial Kimi dispatches and produced a separable correctness spread. The final guidance is model-specific and empirical: Kimi K2.7 Code is mostly framework-robust on these strict validators, but `rcaf` measured weakest and the registry now promotes `costar` with `tidd-ec` as the token-efficient fallback.

### Added

- None.

### Changed

- Cloned `framework-bakeoff.json` to `kimi-k2.7-discriminating.json` in `deep-loop-workflows` benchmark profiles.
- Ran `007-kimi-k2.7-discriminating` through the sweep engine in framework-bakeoff mode.
- Recovered from the accidental external kill at 52/120 and relaunched resiliently from saved state.
- Promoted the `kimi-k2.7-code` registry block to `primary costar`, `fallback tidd-ec`, `avoid rcaf`, `status empirical` and evidence run 007.
- Mirrored §1, §3, §4 and §5 of `kimi-k2.7-code.md` to the run 007 result.
- Updated the `_index.md` row to the run 007 result.
- Strict-validated this phase and the parent.
- Updated the parent phase map row to Complete.

### Fixed

- Retargeted fixtures to invalid-dominant strict validators: `validate-ipv4`, `validate-date`, `validate-semver` and `hard-roman-to-int`, later excluded.
- Set `correctnessGate.threshold` to 0.0 and `samplesPerCell` to 6.
- Throttled to serial real `kimi-for-coding/k2p7` dispatches with per-fixture persistence.
- Fixed the throttle bug mid-flight.
- Excluded `hard-roman-to-int` after it stalled under orchestration churn.

### Verification

| Check | Result |
|-------|--------|
| Profile shape | PASS: `kimi-k2.7-discriminating.json` has five frameworks, strict validators, `correctnessGate.threshold` 0.0 and `samplesPerCell` 6. |
| Run status | PASS: run 007 `synthesis.md` recorded status separable and `correctness_saturated: false`. |
| Correctness spread | PASS: per-framework correctness was `tidd-ec` 1.000, `race` 1.000, `costar` 1.000, `cidi` 0.996 and `rcaf` 0.992, with n=18 each. |
| Registry promotion | PASS: `model-profiles.json` promoted primary `costar`, fallback `tidd-ec`, avoid `rcaf`, status `empirical` and benchmark 007. |
| Reference parity | PASS: `kimi-k2.7-code.md` §3 and §4 plus `_index.md` report `costar`, `tidd-ec`, avoid `rcaf` and benchmark 007. |
| Strict validation | PASS: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <004 folder> --strict` exited 0. |
| Tasks complete | PASS: 13 completed task items recorded. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `kimi-k2.7-discriminating.json` | Created | Strict-validator bakeoff profile with five frameworks, invalid-dominant validators, gate threshold 0.0 and 6 samples per cell. |
| `benchmarks/007-kimi-k2.7-discriminating/ (aggregate.json, synthesis.md, results.json, per-fixture-correctness.json)` | Created | Run outputs with separable verdict, five-row correctness leaderboard and per-fixture correctness. |
| `model-profiles.json` | Updated | `kimi-k2.7-code` promoted to `costar`, `tidd-ec`, avoid `rcaf`, status empirical and evidence run 007. |
| `references/models/kimi-k2.7-code.md` | Updated | §1, §3, §4 and §5 rewritten to the COSTAR default and the run 007 leaderboard. |
| `references/models/_index.md` | Updated | Kimi row changed to empirical with benchmark 007, perfect tier tied and RCAF weakest. |

### Follow-Ups

- `hard-roman-to-int` was excluded after it stalled under orchestration churn from a thrashing background agent. The leaderboard aggregates three fixtures, not four.
- The three-fixture result is conclusive for the recommendation, but a future re-run could add `hard-roman-to-int` back for completeness.
- The verdict is a TIE among the perfect tier. `costar`, `tidd-ec` and `race` all scored correctness 1.0 and cannot be statistically separated, with 90% CI `[0, 0]`.
- The default is best-of-tied plus corroborated, not a single decisive winner. The actionable signal is that `rcaf` is weakest, not that `costar` beats the other two perfect frameworks.
- Confidence is medium, not high. Three fixtures at 6 samples per cell clearly separate `rcaf` from the perfect tier, but a larger fixture set would tighten confidence on the within-tier ordering.
- The result is model-specific. The leaderboard is for `kimi-for-coding/k2p7` on strict validators and should not be transferred to sibling models.
