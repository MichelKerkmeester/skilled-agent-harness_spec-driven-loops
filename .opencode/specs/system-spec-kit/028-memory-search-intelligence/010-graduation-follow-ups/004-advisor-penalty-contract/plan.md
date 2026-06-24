---
title: "Implementation Plan: Advisor Self-Recommendation Penalty Contract [template:level_2/plan.md]"
description: "Plan for documenting the implicit advisor self-recommendation penalty with a durable WHY comment and locking its behavior with a regression test that fires it in the production-default state, with no change to the penalty value or routing logic, proven by the advisor build typecheck and a confirmed break-on-removal of the test."
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/010-graduation-follow-ups/004-advisor-penalty-contract"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Planned the document-and-lock change for the implicit penalty"
    next_safe_action: "Run the full advisor cli test pass"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/scoring-constants.ts"
    completion_pct: 100
---
# Implementation Plan: Advisor Self-Recommendation Penalty Contract

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope. Remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript advisor MCP server scorer |
| **Framework** | spec-kit skill-advisor lane-fusion scorer and its vitest suite |
| **Storage** | None, a comment and a test only |
| **Testing** | The advisor build typecheck plus a new scorer vitest, validated by a break-on-removal check |

### Overview
The implicit `auditRecsAdvisorPenalty` already demotes the advisor from recommending itself on a read-only audit-recommendation prompt, and the 009 validation asked that this penalty replacing the cut explicit guard be documented and tested. A follow-up deep review then found the guard-off application matched the advisor by the exact string `system-skill-advisor` and missed the `skill-advisor` alias. So this is a document-lock-and-correct change: a durable WHY comment at the penalty's definition plus a short cross-reference at its value; a one-line predicate fix to apply the penalty through the canonical `isAdvisorSelfRecommendationSkill` helper so the alias is demoted too in the production-default state; and a regression test that fires the penalty for both the canonical id and the alias. The penalty value is unchanged; the only routing change is the deliberate alias coverage.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Document-lock-and-correct around an existing constant. The penalty is a single calibration value applied in one routing branch, so the change is a comment at the definition, a one-line predicate fix in the branch to cover the alias, plus a behavioral test that exercises the branch for both the canonical id and the alias. No new code path is introduced.

### Key Components
- **`auditRecsAdvisorPenalty` constant** in `scoring-constants.ts`: gains a durable WHY comment at its interface declaration and a short cross-reference at its value.
- **`primaryIntentBonus` in `fusion.ts`**: the application site. Its guard-off branch matched the advisor by exact string and missed the alias; the fix matches through the canonical `isAdvisorSelfRecommendationSkill` helper so both ids are demoted, aligning it with the guard-on path that already uses the helper.
- **New scorer vitest**: feeds an audit prompt to `scoreAdvisorPrompt` against a fixture projection and asserts both the canonical id and the alias are demoted, reusing the existing self-boost-guard harness.
- **Existing `provenance-self-boost-guard.vitest.ts`**: its alias test encoded the old guard-off behavior (alias top when off) and is reconciled to the corrected behavior (alias demoted off).

### Data Flow
On an audit-recommendation prompt with the explicit guard OFF, `primaryIntentBonus` now returns the penalty for any skill the canonical helper recognizes as the advisor or its alias, the demotion comparator subtracts it from that skill's adjusted score, and it falls below a score-tied competitor in the ranked output. The test reads that ranked output and asserts neither the canonical id nor the alias is first.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `auditRecsAdvisorPenalty` declaration | The sole defense demoting the advisor on audit prompts, undocumented | add a durable WHY comment stating the reason and the do-not-remove constraint | the comment is present at the declaration with no artifact-id |
| `auditRecsAdvisorPenalty` value | The frozen calibration number an editor would touch | add a short cross-reference comment to the contract | the value is unchanged at `-0.25` and points back to the declaration |
| `primaryIntentBonus` guard-off branch in `fusion.ts` | Matched the advisor by exact string, missing the alias | replace the exact `=== 'system-skill-advisor'` check with `isAdvisorSelfRecommendationSkill(recommendation.skill)` | the alias is demoted off the top spot on an audit prompt with the guard OFF |
| New scorer vitest | Did not exist | create a regression test firing the penalty for both the canonical id and the alias | the test passes with the fix and fails when the penalty is zeroed or reverted to exact-id-only |
| `provenance-self-boost-guard.vitest.ts` alias test | Asserted the alias is top off, demoted only on | reconcile to assert the alias is demoted off too | the full scorer suite is green |

Required inventories:
- Penalty definition: `auditRecsAdvisorPenalty` in `lib/scorer/scoring-constants.ts`.
- Application site: the audit-recommendation branch in `primaryIntentBonus` in `lib/scorer/fusion.ts`, guard-off check at the exact-id line.
- Canonical helper: `isAdvisorSelfRecommendationSkill` over the `ADVISOR_SELF_RECOMMENDATION_SKILL_IDS` set in `fusion.ts`, already used by the guard-on path.
- Algorithm invariant: the penalty value is unchanged; only the guard-off matching predicate changes, to cover the alias.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the penalty definition, its value, and the production-default branch in `primaryIntentBonus` that applies it
- [x] Read the existing self-boost-guard test to reuse its fixture-projection harness

### Phase 2: Core Implementation
- [x] Add the durable WHY comment at the `auditRecsAdvisorPenalty` declaration and a short cross-reference at its value, no artifact-id
- [x] Fix the guard-off branch to match through `isAdvisorSelfRecommendationSkill` so the alias is demoted too
- [x] Author the regression test: an audit prompt, a score-tied competitor sorting after the advisor, assertions neither the canonical id nor the alias is top, a negative-control, and a direct negative-constant assertion
- [x] Reconcile the existing alias test in `provenance-self-boost-guard.vitest.ts` to the corrected guard-off behavior

### Phase 3: Verification
- [x] Confirm the test breaks when the penalty is zeroed and when the check is reverted to exact-id-only, then restore the fix
- [x] Typecheck the advisor build target clean and run the full scorer suite green
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | The advisor build target typechecks clean after the change | `tsc --noEmit --composite false -p tsconfig.build.json` |
| Unit | The new regression test, the reconciled self-boost-guard test, and the full scorer suite for regressions | the scorer `*.vitest.ts` files |
| Mutation | The lock is validated by zeroing the penalty AND by reverting the check to exact-id-only, observing the test break each way | a temporary edit, then restore |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The penalty definition and its application branch | Internal | Green | Read in source before any edit, the production-default branch is confirmed |
| The existing self-boost-guard harness | Internal | Green | Reused for the fixture-projection shape so the new test matches the established pattern |
| The advisor build typecheck target | Internal | Green | `tsconfig.build.json` covers the scorer lib and exits 0 |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The predicate fix is found to over-demote a legitimate advisor route, or the comment or test is wrong or flaky.
- **Procedure**: Revert the working-tree changes, the change is uncommitted, so a single `git restore` on the affected files removes the comment, the predicate fix and the tests with no data involved. The alias fix only widens an existing demotion to a known alias, so reverting returns to the prior exact-id behavior.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 0.5 hour |
| Core Implementation | Low | 1 hour |
| Verification | Low | 0.5 hour |
| **Total** | | **2 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] The penalty value is unchanged at `-0.25`
- [x] The advisor build typecheck exits 0
- [x] The regression test is green and was confirmed to fail on removal and on an exact-id revert
- [x] The full scorer suite is green after the predicate fix and the test reconciliation

### Rollback Procedure
1. `git restore` the affected files to drop the comment, the predicate fix and the tests, the change is uncommitted
2. Re-run the advisor build typecheck to confirm it stays clean
3. Confirm the penalty value is unchanged either way

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the change is a comment, a one-line predicate fix and tests, no data is written
<!-- /ANCHOR:enhanced-rollback -->

---
