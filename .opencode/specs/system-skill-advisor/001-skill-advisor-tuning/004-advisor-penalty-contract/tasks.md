---
title: "Tasks: Advisor Self-Recommendation Penalty Contract [template:level_2/tasks.md]"
description: "Task breakdown for documenting the implicit advisor self-recommendation penalty with a durable WHY comment and locking it with a regression test that breaks loudly on removal."
importance_tier: "supporting"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/001-skill-advisor-tuning/004-advisor-penalty-contract"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Tracked the document, test and verify tasks to done"
    next_safe_action: "Run the full advisor cli test pass"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/scorer/advisor-self-recommendation-penalty-contract.vitest.ts"
    completion_pct: 100
---
# Tasks: Advisor Self-Recommendation Penalty Contract

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the penalty definition and its application site, confirming the production-default branch that fires it and that its guard-off check matched the advisor by exact string (`.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts`)
- [x] T002 [P] Read the existing self-boost-guard test to reuse its fixture-projection harness and find the alias assertion to reconcile (`.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/provenance-self-boost-guard.vitest.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the durable WHY comment at the `auditRecsAdvisorPenalty` declaration and a short cross-reference at its value, no artifact-id (`.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/scoring-constants.ts`)
- [x] T004 Fix the guard-off branch to match through `isAdvisorSelfRecommendationSkill` so the alias is demoted too (`.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts`)
- [x] T005 Author the regression test: audit prompt, score-tied competitor sorting after the advisor, assertions neither the canonical id nor the alias is top, a negative-control, and a direct negative-constant assertion (`.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/advisor-self-recommendation-penalty-contract.vitest.ts`)
- [x] T006 Reconcile the existing alias test to the corrected guard-off behavior (`.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/provenance-self-boost-guard.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Confirm the test breaks when the penalty is zeroed and when the check is reverted to exact-id-only, then restore the fix (`.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts`)
- [x] T008 Typecheck the advisor build target clean and run the full scorer suite green (`.opencode/skills/system-skill-advisor/mcp_server/tsconfig.build.json`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
