---
title: "Changelog: 005-advisor-feedback-calibration"
description: "Advisor validate outcomes can now produce default-off shadow calibration reports without changing live recommendation weights or ranking."
trigger_phrases:
  - "018 005 advisor feedback changelog"
  - "shadow calibration reducer"
  - "advisor feedback calibration"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-10

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/005-advisor-feedback-calibration` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph`

### Summary

The advisor can now turn `advisor_validate` accepted/corrected/ignored outcomes into reviewable calibration reports without changing recommendations. The lane is default-off, shadow-only, and explicitly advisory.

### Added

- `feedback-calibration.ts` reducer with sample guards, poisoning checks, and bounded JSONL report persistence.
- Tests for reducer behavior, validate integration, and byte-identical live scoring with the shadow flag off and on.

### Changed

- `advisor_validate` invokes the reducer only when `SPECKIT_ADVISOR_FEEDBACK_CALIBRATION_SHADOW` is enabled.
- `weights-config.ts` can build read-only proposals without changing live defaults.

### Fixed

- Outcome feedback now has a safe inspection path instead of implied automatic promotion.

### Verification

| Check | Result |
|-------|--------|
| Targeted calibration/validate tests | PASS: 2 files, 11 tests |
| Typecheck | PASS |
| Build | PASS |
| Full suite | BASELINE FAIL only in known out-of-scope settings parity suite |
| Comment hygiene | PASS |
| Strict validation | PASS: child phase 0 errors, 0 warnings |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `lib/scorer/feedback-calibration.ts` | Created | Shadow reducer and report persistence |
| `lib/scorer/weights-config.ts` | Modified | Read-only proposal builder |
| `handlers/advisor-validate.ts` | Modified | Flag-gated report recording |
| `tests/scorer/advisor-feedback-calibration.vitest.ts` | Created | Reducer coverage |
| `tests/handlers/advisor-validate.vitest.ts` | Modified | Handler integration coverage |

### Follow-Ups

- Any promotion requires future held-out validation and a separate change.
