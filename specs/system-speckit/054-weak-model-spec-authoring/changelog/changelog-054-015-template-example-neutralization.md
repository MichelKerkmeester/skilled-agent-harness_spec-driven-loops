---
title: "Changelog: Phase 15: template-example-neutralization [054-weak-model-spec-authoring/015-template-example-neutralization]"
description: "Chronological changelog for the Phase 15: template-example-neutralization phase."
trigger_phrases:
  - "weak model spec authoring template example neutralization changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-10-26

> Spec folder: `specs/system-speckit/054-weak-model-spec-authoring/015-template-example-neutralization` (Level 2)
> Parent packet: `specs/system-speckit/054-weak-model-spec-authoring`

### Summary

Phase 015 took the speed benchmark's own task, a quiet flag for `recommend-level.sh`, out of the guidance a model reads while authoring. The sweep found 87 lines in 12 files, 52 with the task's own words and 35 that told the same story in other words. Every one now uses one neutral feature: `scripts/rotate-logs.sh --keep <n>`, which deletes all but the newest n archives in `logs/archive/`. A fresh review found ten follow-ups, all ten were fixed, and a fix check recorded a PASS verdict. The phase is Complete, with three recorded deviations: the term gate excludes the one instruction line `goal.md` D3 keeps word for word, the scope check uses list membership because phases 016 and 017 share the uncommitted tree, and the planned replacement table was never written, so the sweep table stands in for it.

### Changed

- Fill-note examples in four core templates (spec, plan, tasks, implementation-summary) and seven add-ons (research, handover, debug-delegation, goal, acceptance-criteria, timeline, decision-record) tell the `--keep` story: ten archives become 3 after `--keep 3`, stay 10 after a plain run, and a missing value exits 2.
- The authoring card's section 6 and section 7 worked examples use the same feature.
- The implementation-summary decision example reads "Option over environment variable".
- `research.md.tmpl` drops the stray `-k` short option and the `--dry-run` feature, and its failure example is now a real defect.
- The golden snapshot is regenerated from the edited templates.

### Verification

- Term gate over the fill notes: 0, down from 63, with the D3 instruction line "List each flag and its effect" at `research.md.tmpl:777` excluded; that line names no benchmark task
- Card: no old example line; 7 real tool lines
- `template-fill-guidance.vitest.ts`: 24 passed; `scaffold-golden-snapshots.vitest.ts`: 12 passed
- `check-card-sync.sh` and `check-example-drift.sh` pass
- Hermes check: `PASS: 67`
- Strict census over 4,757 folders, shared with phases 016 and 017: no row changed
- Opus medium review: CHANGES NEEDED with 10 findings; all 10 fixed, then a fix check recorded `VERDICT: PASS`

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.skilled/skills/system-spec-kit/templates/core/spec.md.tmpl`, `plan.md.tmpl`, `tasks.md.tmpl`, `implementation-summary.md.tmpl` | Modified | Fill-note examples |
| `.skilled/skills/system-spec-kit/templates/addons/research.md.tmpl`, `handover.md.tmpl`, `debug-delegation.md.tmpl`, `goal.md.tmpl`, `acceptance-criteria.md.tmpl`, `timeline.md.tmpl`, `decision-record.md.tmpl` | Modified | Fill-note examples |
| `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md` | Modified | Section 6 and section 7 examples |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap` | Regenerated | Rendered fill notes |
