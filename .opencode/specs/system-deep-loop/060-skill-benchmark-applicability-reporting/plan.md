---
title: "Plan: Lane C skill-benchmark applicability reporting"
description: "Implementation plan for the excluded-by-design reporting channel, the hub-D1 skillId fix, and the D4-R fail-closed selection in the Lane C skill-benchmark harness."
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/060-skill-benchmark-applicability-reporting"
    last_updated_at: "2026-07-11T14:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Plan authored from verified code design"
    next_safe_action: "Implement Phase 2 harness changes"
    blockers: []
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Plan: Lane C Skill-Benchmark Applicability Reporting

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY
A self-contained change to the Lane C harness (`system-deep-loop/deep-improvement/scripts/skill-benchmark/`). Advisor-visibility is keyed off the presence of `graph-metadata.json` at the benchmarked skill root — the literal criterion the advisor projection uses. When absent, D1-inter is reported excluded-by-design with the owning advisor identity as the delegated measure. The weighted aggregate is untouched because D1-inter/D4 are already excluded from `modeAScore()` when null. Two correctness fixes ride along: threading `skillId` into `scoreScenario()`, and failing D4-R closed instead of borrowing foreign scenarios.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- Full `skill-benchmark/tests/` vitest suite green (incl. `code-opencode-playbook-ids`).
- code-opencode router + live reports: `aggregateScore` byte-identical to pre-change; `excludedDimensions:["D1inter"]`, `unscoredDimensions:["D4"]`.
- `git diff --stat` shows zero advisor/sk-code-metadata files.
- `validate.sh --strict` on this packet at Errors 0 (packet baseline).
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
- `score-skill-benchmark.cjs` — `aggregate()` gains `skillRoot`-derived advisor-visibility + owner resolution (walk up to the nearest ancestor with `graph-metadata.json`); builds `dimensionScores.D1inter` with `applicable/status/reason/delegatedMeasure` and the `excludedDimensions` array. `scoreScenario()`/`normalizeScenarioInput()` already read `arg.skillId`.
- `run-skill-benchmark.cjs` — `runPlaybook()` passes `skillId`; `augmentWithD4R()` requires target-owned scenarios or emits `not-run-no-target-scenarios`.
- `build-report.cjs` — render `excludedDimensions` with reason + delegated measure, distinct from `unscoredDimensions`.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
1. **Setup** — capture pre-change report invariants (code-opencode aggregate 84/86, sk-code baseline).
2. **Harness** — skillId thread-through; advisor-visibility + owner resolution helper; excluded-by-design in `aggregate()`; D4-R fail-closed; report rendering.
3. **Verification** — tests, re-run code-opencode router+live, sk-code re-baseline, scope-guard diff, validate.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
- Unit: an advisor-invisible fixture asserts D1-inter excluded-by-design + `excludedDimensions`; an advisor-visible fixture asserts unchanged behavior; a D4-R fixture asserts fail-closed with no target scenarios.
- Integration: re-run `run-skill-benchmark.cjs` for code-opencode (router + live) and diff `aggregateScore`.
- Regression: full `skill-benchmark/tests/` suite; update the mirrors that assert the old `unscoredDimensions`.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
- No new packages. Node built-ins (`fs`, `path`) already imported.
- Depends on the advisor-invisibility invariant (no `graph-metadata.json`) staying the projection criterion; cross-referenced to `projection.ts`.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
Single commit in an isolated worktree. Rollback = revert the commit; the harness returns to silent normalization. No data migration, no state. sk-code re-baseline (if it moves) lands as a separate commit and reverts independently.
<!-- /ANCHOR:rollback -->
