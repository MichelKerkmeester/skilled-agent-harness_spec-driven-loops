---
title: "Tasks: Graph Impact and Affordance Uplift"
description: "Sub-phase task list for the six-phase uplift plan, derived from the packet specification. Completion status was not recorded at the time."
trigger_phrases:
  - "graph impact and affordance uplift tasks"
  - "external project adoption task list"
  - "code graph uplift sub-phases"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Tasks: Graph Impact and Affordance Uplift

<!-- ANCHOR:phase-1 -->
## Phase 1: Governance

- [ ] T001 Clean-room license audit; record the decision in `decision-record.md` and set the fail-closed review rule (001)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 Code Graph phase-DAG runner plus read-only `detect_changes` preflight in `code_graph/lib/phase-runner.ts`, `code_graph/lib/diff-parser.ts`, `code_graph/handlers/detect-changes.ts` (002)
- [ ] T003 Code Graph edge `reason`/`step` display plus `blast_radius` risk, confidence filtering, ambiguity candidates, and structured failure fallback (003)
- [ ] T004 Skill Advisor affordance evidence through the sanitizer in `skill_advisor/lib/affordance-normalizer.ts` and the existing derived/graph-causal lanes (004)
- [ ] T005 Memory causal trust display (badges only) in `formatters/search-results.ts` and `lib/response/profile-formatters.ts` (005)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification and Docs

- [ ] T006 Docs and catalog rollup across the umbrella READMEs, `SKILL.md`, and the feature_catalog/manual_testing_playbook indexes (006)
- [ ] T007 Verify each sub-phase against its acceptance criteria and run the packet validation
<!-- /ANCHOR:phase-3 -->
