---
title: "Implementation Summary: Lane C skill-benchmark applicability reporting"
description: "Outcome of adding the excluded-by-design reporting channel (D1-inter for advisor-invisible skills), fixing the hub-D1 skillId propagation bug, and failing D4-R closed on scenario selection in the Lane C skill-benchmark harness. code-opencode and sk-code router aggregates are byte-identical (86/85); the skillId fix corrects a false-negative that scored sk-code's advisor-mode D1-inter at 0 (aggregate 83) up to the correct 100 (aggregate 85). No advisor or sk-code metadata/vocab touched. New applicability test 3/3 green; the pre-existing 11 cli-external-relocation failures are unchanged."
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/031-smart-routing-benchmark-program/016-skill-benchmark-applicability-reporting"
    last_updated_at: "2026-07-11T15:10:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Harness reporting fix + hub-D1 skillId bug shipped; aggregates verified; tests green"
    next_safe_action: "Validate --strict, commit, push"
    blockers: []
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 016-skill-benchmark-applicability-reporting |
| **Completed** | Complete |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Three changes to the Lane C harness, plus tests and Lane C docs.

**1. Excluded-by-design reporting channel (`score-skill-benchmark.cjs`).** A new `resolveAdvisorOwner(skillRoot)` helper keys advisor visibility off the presence of `graph-metadata.json` — the literal criterion the advisor's own filesystem projection uses. When the benchmarked skill root lacks one, `aggregate()` reports D1-inter as `{ applicable:false, status:"excluded-by-design", reason, delegatedMeasure:{ targetSkill:<owner> } }`, lists it under a new `excludedDimensions` array, and removes it from `unscoredDimensions`. The owner is the nearest ancestor directory that carries `graph-metadata.json` (for `code-opencode`, that is `sk-code`). Advisor-visible skills are unchanged.

**2. hub-D1 skillId propagation fix (`run-skill-benchmark.cjs`).** `runPlaybook()` now threads `skillId` into `scoreScenario()`. Previously the `expectedFromScenario()` fallback `arg.skillId` was always undefined, so an advisor scenario relying on it scored D1-inter against an undefined expected identity — a false negative.

**3. D4-R fail-closed selection (`run-skill-benchmark.cjs`).** `augmentWithD4R()` drops the cross-target `DEFAULT_D4R_SCENARIOS` (`LS-*/SD-*`). With no explicit target-owned `--d4-scenarios` (or `--scenarios`), it writes `advisorySignals.D4_task_outcome.status = "not-run-no-target-scenarios"` and scores nothing, instead of silently intersecting another skill's ids with the target playbook.

**4. Report rendering (`build-report.cjs`).** Renders `excludedDimensions` with reason + delegated measure, distinct from `unscoredDimensions`.

The weighted D4 dimension stays `unscored-mode-a` harness-wide by design; no live weighted-D4 scorer was wired (the D4 instrument grades hallucination hygiene, not usefulness, and a mutation-free surface cannot support a weighted causal usefulness claim).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `skill-benchmark/score-skill-benchmark.cjs` | Modify | `resolveAdvisorOwner` + excluded-by-design in `aggregate()` |
| `skill-benchmark/run-skill-benchmark.cjs` | Modify | skillId thread-through; D4-R fail-closed |
| `skill-benchmark/build-report.cjs` | Modify | Render `excludedDimensions` |
| `skill-benchmark/tests/dimension-applicability.vitest.ts` | Create | Excluded-by-design, advisor-visible, D4-R fail-closed |
| `references/skill_benchmark/scoring_contract.md` | Modify | Excluded-by-design contract |
| `references/skill_benchmark/operator_guide.md` | Modify | D1-inter states; D4-R explicit-scenario requirement |
| `skill-benchmark/README.md` | Modify | score-skill-benchmark row |
<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implemented in an isolated worktree pinned to the origin tip. All benchmarks and vitest ran from the main tree's runtime (the worktree ships no `node_modules`), reading the worktree's harness and skills. GPT-5.6-sol-fast (xhigh) reviewed the design first; every load-bearing claim (D4 hardcoded null, skillId not propagated, D4-R cross-target defaults, `modeAScore` normalization) was re-verified against the source before editing.
<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Key advisor visibility off `graph-metadata.json` presence | It is the literal advisor projection criterion; simpler and more robust than re-parsing the parent registry |
| D1-inter excluded-by-design, D4 stays unscored | D1-inter is a category error for a bundled surface; weighted D4 is unimplemented harness-wide, not surface-specific |
| Do NOT wire live weighted-D4 | Its instrument grades hallucination, not usefulness; a mutation-free surface cannot support a weighted causal claim |
| Do NOT touch the advisor | The advisor tuning track is gated; the fix is a harness reporting-correctness change only |
| Land hub-D1 fix in the same packet | Operator chose "reporting fix + hub-D1 bug"; the delta is advisor-mode only and corrects a false negative |
<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Status | Evidence |
|-------|--------|----------|
| code-opencode router aggregate unchanged | Pass | 86 before / 86 after; `excludedDimensions:["D1inter"]`, `unscoredDimensions:["D4"]` |
| sk-code router aggregate unchanged (CI gate) | Pass | 85 before / 85 after; `excludedDimensions:[]` |
| hub-D1 fix corrects false negative | Pass | sk-code `--advisor-mode python`: D1-inter 0→100, aggregate 83→85 |
| New applicability tests | Pass | `dimension-applicability.vitest.ts` 3/3 |
| No new regressions | Pass | Full suite 11 failed / 126 passed identical with changes stashed (11 are pre-existing cli-external relocation) |
| Scope guard | Pass | `git diff` touches no `system-skill-advisor/` or `sk-code/{SKILL.md,graph-metadata.json,mode-registry.json,hub-router.json}` |
<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Pre-existing suite failures unchanged.** The 11 `cli-opencode→cli-external` relocation failures in `skill-benchmark.vitest.ts` predate this packet and are out of scope; this change neither fixes nor worsens them.
2. **Committed code-opencode benchmark reports not regenerated here.** `code-opencode/benchmark/*` still show the old schema (`unscored:["D1inter","D4"]`); they emit the new `excludedDimensions` on their next regeneration. Regenerating them is a code-opencode-surface concern (and the live report needs a paid run), left out to keep this packet harness-only.
3. **sk-code advisor-mode gain (83→85) is opt-in.** It appears only under `--advisor-mode python`; the router-mode CI gate is unchanged. A committed sk-code advisor-mode baseline, if any, would improve on regeneration.
<!-- /ANCHOR:limitations -->
