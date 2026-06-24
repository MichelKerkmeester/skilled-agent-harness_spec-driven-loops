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
The implicit `auditRecsAdvisorPenalty` already demotes the advisor from recommending itself on a read-only audit-recommendation prompt, and the 009 validation cleared the advisor RRF fusion and asked only that this penalty replacing the cut explicit guard be documented and tested. So this is a document-and-lock change with no behavior change. A durable WHY comment is added at the penalty's definition, plus a short cross-reference at its value, and a regression test fires the penalty in the production-default state and asserts the advisor is not the top recommendation on an audit prompt. The penalty value and the fusion logic are untouched.
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
Document-and-lock around an existing constant. The penalty is a single calibration value applied in one routing branch, so the change is a comment at the definition plus a behavioral test that exercises the branch. No new code path is introduced.

### Key Components
- **`auditRecsAdvisorPenalty` constant** in `scoring-constants.ts`: gains a durable WHY comment at its interface declaration and a short cross-reference at its value.
- **`primaryIntentBonus` in `fusion.ts`**: the application site, read to confirm the production-default branch that returns the penalty for the advisor on an audit-recommendation prompt when the explicit guard flag is OFF. Unchanged.
- **New scorer vitest**: feeds an audit prompt to `scoreAdvisorPrompt` against a fixture projection and asserts the advisor is demoted, reusing the existing self-boost-guard harness.

### Data Flow
On an audit-recommendation prompt with the explicit guard OFF, `primaryIntentBonus` returns the penalty for the advisor skill, the demotion comparator subtracts it from the advisor's adjusted score, and the advisor falls below a score-tied competitor in the ranked output. The test reads that ranked output and asserts the advisor is not first.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `auditRecsAdvisorPenalty` declaration | The sole defense demoting the advisor on audit prompts, undocumented | add a durable WHY comment stating the reason and the do-not-remove constraint | the comment is present at the declaration with no artifact-id |
| `auditRecsAdvisorPenalty` value | The frozen calibration number an editor would touch | add a short cross-reference comment to the contract | the value is unchanged at `-0.25` and points back to the declaration |
| `primaryIntentBonus` in `fusion.ts` | Applies the penalty in the production-default branch | no change, read to confirm the branch | the routing logic is byte-identical |
| New scorer vitest | Did not exist | create a regression test firing the penalty in the production-default state | the test passes with the penalty and fails when it is zeroed |

Required inventories:
- Penalty definition: `auditRecsAdvisorPenalty` in `lib/scorer/scoring-constants.ts`.
- Application site: the audit-recommendation branch in `primaryIntentBonus` in `lib/scorer/fusion.ts`.
- Algorithm invariant: the penalty value and the fusion routing are unchanged; only a comment and a test are added.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the penalty definition, its value, and the production-default branch in `primaryIntentBonus` that applies it
- [x] Read the existing self-boost-guard test to reuse its fixture-projection harness

### Phase 2: Core Implementation
- [x] Add the durable WHY comment at the `auditRecsAdvisorPenalty` declaration and a short cross-reference at its value, no artifact-id
- [x] Author the regression test: an audit prompt, a score-tied competitor sorting after the advisor, assertions the advisor is not top and is demoted, a negative-control, and a direct negative-constant assertion

### Phase 3: Verification
- [x] Confirm the test breaks when the penalty is zeroed, then revert the penalty to `-0.25`
- [x] Typecheck the advisor build target clean and run the new and existing self-recommendation tests green
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | The advisor build target typechecks clean after the change | `tsc --noEmit --composite false -p tsconfig.build.json` |
| Unit | The new regression test plus the existing self-boost-guard test | the scorer `*.vitest.ts` files |
| Mutation | The lock is validated by zeroing the penalty and observing the test break | a temporary edit, then revert |
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

- **Trigger**: The comment or the test is found to be wrong or the test is flaky.
- **Procedure**: Revert the working-tree changes, the change is uncommitted, so a single `git restore` on the two affected files removes the comment and the test with no data involved and no behavior change to undo.
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
- [x] The regression test is green and was confirmed to fail on removal

### Rollback Procedure
1. `git restore` the two affected files to drop the comment and the test, the change is uncommitted
2. Re-run the advisor build typecheck to confirm it stays clean
3. Confirm the penalty value and the fusion logic are unchanged either way

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the change is a comment and a test, no data is written
<!-- /ANCHOR:enhanced-rollback -->

---
