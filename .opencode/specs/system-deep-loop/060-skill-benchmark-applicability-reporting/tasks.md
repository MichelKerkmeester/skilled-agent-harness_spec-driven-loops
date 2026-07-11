---
title: "Tasks: Lane C skill-benchmark applicability reporting"
description: "Task breakdown for the excluded-by-design reporting channel, hub-D1 skillId fix, and D4-R fail-closed selection."
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/060-skill-benchmark-applicability-reporting"
    last_updated_at: "2026-07-11T14:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Tasks enumerated"
    next_safe_action: "Implement Phase 2 harness changes"
    blockers: []
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Tasks: Lane C Skill-Benchmark Applicability Reporting

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation
`[ ]` open · `[x]` done · `[B]` blocked. Each task names its file(s) and verification.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 — Capture pre-change invariants: code-opencode router (86) + live (84) `aggregateScore`, `unscoredDimensions`, and sk-code router baseline. Evidence: saved JSON snapshots in scratchpad.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T002 — `run-skill-benchmark.cjs`: thread `skillId` into the `scoreScenario()` call in `runPlaybook()`.
- [x] T003 — `score-skill-benchmark.cjs`: add `resolveAdvisorOwner(skillRoot)` (walk ancestors for `graph-metadata.json`); returns `{visible, owner}`.
- [x] T004 — `score-skill-benchmark.cjs`: in `aggregate()`, when the target is advisor-invisible, set `dimensionScores.D1inter` to `{points, score:null, applicable:false, status:"excluded-by-design", reason, delegatedMeasure:{targetSkill:owner}}`, add `excludedDimensions`, and remove D1inter from `unscoredDimensions`.
- [x] T005 — `run-skill-benchmark.cjs`: `augmentWithD4R()` drops `DEFAULT_D4R_SCENARIOS`; requires explicit target-owned scenarios; else writes `advisorySignals.D4_task_outcome.status = "not-run-no-target-scenarios"` and scores nothing.
- [x] T006 — `build-report.cjs`: render `excludedDimensions` (reason + delegated measure) distinctly from `unscoredDimensions`.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T007 — Tests: advisor-invisible → excluded-by-design; advisor-visible → unchanged; D4-R fail-closed. Update mirrors asserting old `unscoredDimensions`.
- [x] T008 — Re-run code-opencode router + live; assert `aggregateScore` unchanged, `excludedDimensions:["D1inter"]`.
- [x] T009 — sk-code re-baseline after skillId fix; record any D1-inter delta; land separately if the aggregate moves.
- [x] T010 — Scope-guard: `git diff --stat` shows zero advisor/sk-code-metadata files. `validate.sh --strict` Errors 0.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
All T001-T010 `[x]` with evidence; full test suite green; aggregate unchanged; scope-guard clean.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
- Harness: `system-deep-loop/deep-improvement/scripts/skill-benchmark/{run-skill-benchmark,score-skill-benchmark,build-report}.cjs`
- Sibling precedent: `system-deep-loop/058-mcp-cli-hub-benchmark` (D1inter scenarios for advisor-visible hubs)
- Advisor invariant: `system-skill-advisor/.../scorer/projection.ts` (graph-metadata.json = advisor candidate)
<!-- /ANCHOR:cross-refs -->
