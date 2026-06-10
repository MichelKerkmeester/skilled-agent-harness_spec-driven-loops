---
title: "Advisory CURRENT_STATE_DISCIPLINE validation rule (peck T4)"
description: "Registered an INFO-severity validation rule that advises when implementation-summary.md contains migration-history narrative. Ships as a sibling shell rule with registry and docs. No error-class severity and no existing rule behavior changed."
trigger_phrases:
  - "current-state discipline rule"
  - "CURRENT_STATE_DISCIPLINE validation"
  - "peck T4 teaching"
  - "check-current-state-discipline"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-10

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/003-current-state-discipline` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption`

### Summary

Adopted peck's T4 teaching by registering `CURRENT_STATE_DISCIPLINE` as a new INFO-severity advisory rule. The rule scans `implementation-summary.md` for migration-history narrative and skips fenced code plus HTML comments to reduce false positives. The existing phase-parent rule is untouched. Decision records, changelogs, and context indexes are outside the targeted scan surface.

### Added

- `scripts/rules/check-current-state-discipline.sh`: fence and comment-aware scanner targeting `implementation-summary.md`.
- `CURRENT_STATE_DISCIPLINE` entry in `scripts/lib/validator-registry.json` at severity `info`.
- Rule documentation in `references/validation/validation_rules.md` covering scope, tokens, and exemptions.

### Changed

- None. The existing phase-parent rule and its behavior are unchanged.

### Fixed

- None.

### Verification

| Check | Result |
|-------|--------|
| Rule script syntax (`bash -n`) | PASS |
| Registry JSON parse | PASS |
| Fixture advisory behavior: plain history wording | Returns `info` |
| Fixture advisory behavior: fenced/commented wording | Returns `pass` |
| Existing valid folder strict validation | PASS (Errors: 0, Warnings: 0) |
| Phase strict validation | PASS (Errors: 0, Warnings: 0) |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/scripts/rules/check-current-state-discipline.sh` | Created | Fence and comment-aware advisory scanner |
| `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json` | Modified | Registered `CURRENT_STATE_DISCIPLINE` at `info` severity |
| `.opencode/skills/system-spec-kit/references/validation/validation_rules.md` | Modified | Documented rule scope, tokens, and exemptions |

### Follow-Ups

- Wave 1 scans `implementation-summary.md` only. Ordinary `spec.md` files are deferred for a later rollout.
