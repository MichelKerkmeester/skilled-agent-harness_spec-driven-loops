---
title: "Changelog: Phase 16: scaffold-filler-section-trim [054-weak-model-spec-authoring/016-scaffold-filler-section-trim]"
description: "Chronological changelog for the Phase 16: scaffold-filler-section-trim phase."
trigger_phrases:
  - "weak model spec authoring scaffold filler section trim changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-10-26

> Spec folder: `specs/system-speckit/054-weak-model-spec-authoring/016-scaffold-filler-section-trim` (Level 2)
> Parent packet: `specs/system-speckit/054-weak-model-spec-authoring`

### Summary

Phase 016 removed the sample rows that weak models kept as filler. In 12 graded packets the sign-off role table survived 9 times, the pre-deployment rows 8 times, the "Phase 1.5" diagram and the service edge cases 6 times each, and "Tests passing (if applicable)" 4 times. Each section got one decision: remove it, or replace its sample with tokens. Fix Completeness became optional, the card's plan shape now matches the template, and both decision-record pointers hold when the file does not exist. The strict and six-rule censuses over 4,757 folders matched their baselines exactly.

### Added

- None recorded.

### Changed

- `plan.md.tmpl` drops the L2 effort and enhanced-rollback sections. The phase-deps sample is a `Setup ──► Implementation ──► Verification` skeleton with token rows, and the DoD test line is one token.
- `spec.md.tmpl` edge cases are three token lines, empty input, maximum input and failure path, at L2 and Level 3. The Level 3 block has no anchor, so it stays optional.
- `tasks.md.tmpl` sign-off has one token row. Fix Completeness is `## FIX ADDENDUM: FIX COMPLETENESS`, which the existing optional prefix drops from the required set. CHK-100 is conditional. Deploy-ready CHK-121 and CHK-122 are one token row; CHK-120, CHK-123 and CHK-124 stay.
- Card section 6 names three phases in one line each and asks for no `### Step` block.
- `spec-kit-docs.json` section gates, the compliance contract (v1.6.0.17), the level and template reference docs and the `create.sh` and `upgrade-level.sh` help text match the new sections.
- Examples level-1 to level-3+ and the handover add-on drop the filler strings.
- `template-fill-guidance.vitest.ts` has new anchor counts, `validation-optional-anchors.vitest.ts` gains a Fix Completeness case, and the golden snapshots are regenerated.

### Fixed

- None recorded.

### Verification

- Strict and six-rule census diffs, before against after: no output
- Golden snapshot: none of the five filler strings
- `template-fill-guidance`, `scaffold-golden-snapshots`, `required-template-anchors`: 40 of 40 passed; `validation-optional-anchors`: 2 of 2
- `check-card-sync.sh`: `CARD SYNC OK`; `check-example-drift.sh`: `EXAMPLE_DRIFT_OK`
- Hermes check: `PASS: 67`; `check-markdown-links.cjs`: 0 broken
- Opus medium review: one wrong edit, the card's "3 or 4 phases", fixed with the follow-ups

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.skilled/skills/system-spec-kit/templates/core/plan.md.tmpl`, `spec.md.tmpl`, `tasks.md.tmpl` | Modified | Section decisions, Fix Completeness header, the two pointers |
| `.skilled/skills/system-spec-kit/templates/spec-kit-docs.json` | Modified | Section gates |
| `.skilled/skills/system-spec-kit/templates/examples/level-1/` to `level-3+/`, `templates/addons/handover.md.tmpl` | Modified | Match the template; filler strings removed |
| `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md` | Modified | Section 6 plan shape and the section 11 bullet |
| `.skilled/skills/system-spec-kit/references/validation/template-compliance-contract.md` | Modified | Optional `fix-completeness`; two plan addenda dropped |
| `.skilled/skills/system-spec-kit/assets/` (3 files), `references/templates/level-specifications.md`, `level-selection-guide.md` | Modified | No effort estimation; sign-off in `tasks.md` with one approver row |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh`, `upgrade-level.sh` | Modified | Help text |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/template-fill-guidance.vitest.ts`, `runtime/tests/validation-optional-anchors.vitest.ts` | Modified | Anchor counts and the new case |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap` | Regenerated | The new scaffold |
| `.hermes/skills/system-spec-kit/` | Synced | Copies of the edited docs |

### Follow-Ups

- None recorded.
