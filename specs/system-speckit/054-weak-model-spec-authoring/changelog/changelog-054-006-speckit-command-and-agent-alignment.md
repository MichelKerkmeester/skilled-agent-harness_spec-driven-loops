---
title: "Changelog: Phase 6: speckit-command-and-agent-alignment [054-weak-model-spec-authoring/006-speckit-command-and-agent-alignment]"
description: "Chronological changelog for the Phase 6: speckit-command-and-agent-alignment phase."
trigger_phrases:
  - "weak model spec authoring speckit command and agent alignment changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-10-24

> Spec folder: `specs/system-speckit/054-weak-model-spec-authoring/006-speckit-command-and-agent-alignment` (Level 3)
> Parent packet: `specs/system-speckit/054-weak-model-spec-authoring`

### Summary

The phase applied the rows in scratch/audit/applied.txt, regenerated every mirror and closed with the suite at the phase start.

### Added

- A `guard_scripts_command` line in `speckit-plan.yaml`, `speckit-implement.yaml` and `speckit-complete.yaml`, and one sentence in `plan.md`, `implement.md` and `complete.md`, that run `check-example-drift.sh` and `check-card-sync.sh` after each strict validation.
- The filled-example instruction in `speckit-plan.yaml` (twice) and in the `spec-doc` row of the markdown agent: show the writer the matching example under `templates/examples/` and treat the `.tmpl` file as the section contract.
- The authoring card as the first read in `speckit-complete.yaml` (three places) and in the `spec-doc` row of both markdown agent copies.
- A level-2 `acceptance-criteria.md` example in the template list of six creator commands, the feature-catalog, testing-playbook and skill-parent commands in auto and confirm form.

### Changed

- Both placeholder classifiers in `speckit-plan.yaml` and `speckit-complete.yaml` state the v2.3 rule: an unfilled value token warns while `spec.md` says Draft and errors at any other status, and an older doc keeps the error.
- The `checklist.md` doc is gone from the continuity ladder of both resume assets, the `orchestrate`, `code` and `context` agents in `.skilled` and `.claude`, and the 14 creator command assets.
- The creator commands that need verification now require, route and output `acceptance-criteria.md` where they named `checklist.md`.
- `deep-review-auto.yaml` and `deep-review-confirm.yaml` read `acceptance-criteria.md` for spec folders and child specs, and the AC_COVERAGE signal checks for `acceptance-criteria.md`.
- The Codex and Pi copies of the code, context, markdown and orchestrate agents were regenerated from the corrected sources.
- The deep/review compiled contract was recompiled, which updated the two source digests of the edited assets.

### Fixed

- A writer who opens a speckit command is sent to the authoring card and a filled example before the long references, and no command or agent sends a reader to a `checklist.md` that does not exist.
- The first full suite run failed three tests on the stale deep/review contract digests. After the recompile the suite matches the phase start.

### Verification

- Strict validation of this phase folder - validate.sh --strict printed RESULT: PASSED
- 78 rows applied with no unexplained path - T006 printed 78, 78, 78 and T011 listed 0 unexplained paths
- Eight mirror checks - 8 lines end in rc=0
- Search gates - A1 to A4 and A6 ended in 1, GUARD_REFS 6
- Contract drift - Two vitest files passed (43 tests) and check-contract-drift.cjs printed [CONTRACT DRIFT] OK commands=3
- Suite comparison with the phase start - SUITE_MATCH, exit=0 (scratch/suite-end.txt)
- Tasks complete - 64 completed task item(s) recorded

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.skilled/commands/speckit/plan.md, implement.md, complete.md` | Modified | Name the guard scripts after strict validation |
| `.skilled/commands/speckit/assets/*.yaml (5 files)` | Modified | Guard command, placeholder classifier, authoring card, filled example, continuity ladder |
| `.skilled/agents/markdown.md, orchestrate.md, code.md, context.md` | Modified | Card and filled example, retired checklist doc dropped |
| `.claude/agents/ (same 4 files)` | Modified | Same body text as the .skilled sources |
| `.skilled/commands/create/assets/*.yaml (14 files)` | Modified | Retired checklist doc replaced or dropped |
| `.skilled/commands/deep/assets/deep-review-auto.yaml, deep-review-confirm.yaml` | Modified | Retired checklist doc replaced |
| `.codex/agents/` TOMLs and `.pi/agents/` files, 4 each | Regenerated | Generated mirrors of the four agents |
| `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown` | Regenerated | Derived output required by the source digest check |
| `spec.md, plan.md, tasks.md, acceptance-criteria.md, goal.md, implementation-summary.md, scratch/` | Modified or created | Phase record and evidence |

### Follow-Ups

- The trigger index is stale before the phase starts. T009 proves this phase does not add to the staleness set. It does not repair the index, because that would rewrite a generated artifact outside the phase scope.
- The suite cannot match phase 1. Phases 2 to 5 add tests, so T012 compares with the phase start and records the cumulative difference as information.
- A row whose text drifted is skipped. The phase records it and does not guess a replacement, so a late change to main can leave one stale line for the operator.
- The index premise is imprecise. At the start the index was not fresh because 3 documents were missing from it, not because any was stale. The set is unchanged by this phase, and the phase 006 changelog adds one more unindexed document.
- The deep-review skill still says checklist.md. .skilled/skills/system-deep-loop/deep-review/SKILL.md has 3 mentions the rows do not cover, because the skill is outside this phase.
