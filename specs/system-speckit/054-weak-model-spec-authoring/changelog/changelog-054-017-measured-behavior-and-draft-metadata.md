---
title: "Changelog: Phase 17: measured-behavior-and-draft-metadata [054-weak-model-spec-authoring/017-measured-behavior-and-draft-metadata]"
description: "Chronological changelog for the Phase 17: measured-behavior-and-draft-metadata phase."
trigger_phrases:
  - "weak model spec authoring measured behavior and draft metadata changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-10-26

> Spec folder: `specs/system-speckit/054-weak-model-spec-authoring/017-measured-behavior-and-draft-metadata` (Level 2)
> Parent packet: `specs/system-speckit/054-weak-model-spec-authoring`

### Summary

Phase 017 acts on two findings from the benchmark. Authors misstated a script's output in 5 of 12 packets even after running it, so the spec template gains a Measured Behavior block that holds a command and its verbatim output, with a warning-only rule for new specs. And 33 of the 36 failed validator rounds in the 24 author runs failed only on derived metadata, so a strict validate run on a Draft packet now repairs that metadata itself, names each file it rewrote and validates again. A fresh review found no blocker and six findings, all fixed. Both full suites ran on the final tree with no new failure, and the phase is Complete.

### Added

- A `measured-behavior` anchor with an H3 `Measured Behavior`, a fill note and a fence, right after the `problem` anchor at every level. No H2, so no existing doc gains a required section.
- The `MEASURED_BEHAVIOR` rule at severity `warn`, for a `spec.md` stamped `spec-core` v2.4 or later. It warns on a missing or empty block and passes a filled fence or an `N/A:` line with a reason. The registry now holds 42 rules.
- Draft auto-repair in the validate CLI entry. It runs `repair-derived.cjs --apply` once when the run is `--strict`, `spec.md` says Draft and every error is a derived-metadata rule. `SPECKIT_DRAFT_AUTO_REPAIR=0`, `false` or `off`, a set `CI` or a `SPECKIT_RULES` subset turns it off. `validateFolder` never writes.
- Tests: `measured-behavior-rule.vitest.ts` (7 cases) and `draft-auto-repair.vitest.ts` (15 cases).

### Changed

- The spec, plan, tasks, implementation-summary and acceptance-criteria templates are stamped v2.4. The four example specs show a filled block that measures a `404`.
- `repair-derived.cjs`, `upgrade-legacy.mjs`, `quality-audit.sh`, `progressive-validate.sh` and the strict-pass freshness sweep run their child `validate.sh` with the switch at `0`, so dry runs and audits stay read-only.
- The card, `SKILL.md`, `validation-rules.md`, `ENV-REFERENCE.md`, the `validate.sh` help and `README.md` describe the rule, the repair and its switch, and say 42-rule registry. `ARCHITECTURE.md` says 42 rules (23 authored-template, 13 operational-runtime, 6 structural).

### Verification

- Rule and repair tests: 7 and 15 passed; eight more targeted CLI test files pass, each run on its own
- Strict and six-rule census diffs over 4,757 folders print nothing; the new-rule census holds no warning
- `check-example-drift.sh`, `check-card-sync.sh` and the Hermes check (`PASS: 67`) pass
- `rg -n '41-rule registry'` over system-spec-kit prints nothing
- Full runtime suite: `Test Files 279 passed | 3 skipped (282)`, `Tests 4184 passed | 21 skipped (4205)`, no failure
- Full CLI suite: `Tests 1 failed | 2202 passed | 20 skipped (2223)`; the one failure, `recursive-child-manifest`, also fails in phase 013's baseline run, where `repo-era` failed too and now passes
- Census write check: `git status --porcelain specs/` outside packet 054 prints nothing

### Deviations

- No suite baseline was taken before the edits; phase 013's whole CLI run stands in for it, and no runtime-project baseline exists, which the zero-failure runtime run makes moot.
- No tree-status snapshot was taken before the census; the write check ran afterwards, and the census path calls `validateFolder`, which cannot repair.
- The census baselines are shared with phase 016 and live in its `scratch/baseline/`.
- Phases 015, 016 and 017 were built in one uncommitted tree and are committed together; the stamp v2.4 was set once for all five templates.
- The commit SHA is pinned after the commit.

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.skilled/skills/system-spec-kit/templates/core/spec.md.tmpl`, `templates/spec-kit-docs.json` | Modified | The Measured Behavior block and its anchor |
| `.skilled/skills/system-spec-kit/templates/core/plan.md.tmpl`, `tasks.md.tmpl`, `implementation-summary.md.tmpl`, `templates/addons/acceptance-criteria.md.tmpl` | Modified | Stamps to v2.4 |
| `.skilled/skills/system-spec-kit/templates/examples/level-*/spec.md` | Modified | A filled block |
| `.skilled/skills/system-spec-kit/runtime/cli/rules/check-measured-behavior.sh` | Created | The warning rule |
| `.skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json` | Modified | 42 rules |
| `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts`, `runtime/cli/spec/validate.sh` | Modified | Draft auto-repair and its help text |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs`, `upgrade-legacy.mjs`, `quality-audit.sh`, `progressive-validate.sh`, `runtime/cli/sweep/strict-pass-freshness.ts` | Modified | Child validate runs with the switch at `0` |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/measured-behavior-rule.vitest.ts`, `draft-auto-repair.vitest.ts` | Created | New tests |
| `.skilled/skills/system-spec-kit/runtime/tests/validation-optional-anchors.vitest.ts`, `runtime/cli/tests/level-contract-resolver.vitest.ts`, `upgrade-legacy.vitest.ts` | Modified | Updated cases |
| `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md`, `SKILL.md`, `references/validation/validation-rules.md`, `runtime/ENV-REFERENCE.md`, `README.md`, and the `.hermes` copy of `SKILL.md` | Modified | Docs for the rule, the repair and the count |
| `.skilled/skills/system-spec-kit/ARCHITECTURE.md` | Modified | The 42-rule count |
