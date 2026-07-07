---
title: "Implementation Summary: Advisor Self-Recommendation Penalty Contract [template:level_2/implementation-summary.md]"
description: "Summary of documenting the implicit advisor self-recommendation penalty with a durable WHY comment and locking it with a regression test that fires the penalty in the production-default state and was confirmed to break when the penalty is zeroed, with the penalty value unchanged at -0.25 and the advisor build typecheck clean."
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/012-skill-advisor-tuning/004-advisor-penalty-contract"
    last_updated_at: "2026-07-06T17:28:26.576Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Documented and locked the implicit penalty"
    next_safe_action: "Run the full advisor cli test pass, then have the user review and commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/scoring-constants.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/scorer/advisor-self-recommendation-penalty-contract.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-010-004-advisor-penalty-contract"
      parent_session_id: "phase-010-004-advisor-penalty-contract"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Whether the penalty value or routing needs to change, it does not, only a comment and a test were added"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
@4-advisor-penalty-contract |
| **Completed** | 2026-06-24, status COMPLETE |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Status COMPLETE. The implicit advisor self-recommendation penalty, `auditRecsAdvisorPenalty`, now carries a durable WHY comment at its definition, its guard-off application was corrected to demote the `skill-advisor` alias as well as the canonical id, and it is locked by a regression test that fires it in the production-default state for both ids and breaks loudly if the penalty is removed, zeroed, sign-flipped, or reverted to an exact-id-only check. The penalty value is unchanged at `-0.25`; the only routing change is the deliberate alias coverage. The advisor build typecheck exits 0 and the full scorer suite is green (119 tests).

### The durable WHY comment

A comment block at the `auditRecsAdvisorPenalty` interface declaration in `scoring-constants.ts` states that the penalty demotes the advisor — both its canonical id and its alias — from recommending itself on a read-only "audit the recommendation quality" prompt, that auditing routing output is a review task rather than an advisor invocation, and that this penalty is the sole remaining defense because the explicit opt-in guard that used to back it up had its CUT verdict adopted as redundant — the guard code still exists in `fusion.ts` and is scheduled for deletion in the gated code window — precisely because this implicit penalty already fires. The comment adds that the penalty must be applied through the canonical self-rec id set so the alias is demoted too, and states the constraint directly: do not remove or zero it without a documented, tested replacement. A short cross-reference comment at the constant's value site points an editor of the calibration numbers back to that contract. Neither comment carries an artifact-id, spec-path or packet-number; both carry the durable reason only.

### The alias-coverage fix

A follow-up deep review found the guard-off branch in `primaryIntentBonus` (`fusion.ts`) matched the advisor by the exact string `system-skill-advisor`, so the `skill-advisor` alias was missed and self-recommended to the top in the production-default state. The fix replaces the exact-string check with `isAdvisorSelfRecommendationSkill(recommendation.skill)`, the same canonical helper (over the `ADVISOR_SELF_RECOMMENDATION_SKILL_IDS` set) that the guard-on path already uses, so both the canonical id and the alias are demoted consistently in either guard state. The penalty value and every other branch are untouched.

### The regression test

A new test file `tests/scorer/advisor-self-recommendation-penalty-contract.vitest.ts` exercises the penalty through `scoreAdvisorPrompt` against a fixture projection. It pins the production-default state by deleting the explicit guard flag in `beforeEach` and restoring it in `afterEach`, so the implicit penalty is the only thing demoting the advisor. It feeds the self-recommendation-prone audit prompt `audit recommendation quality` and asserts neither the canonical id nor the `skill-advisor` alias is the top recommendation and each is ranked below a competitor. The competitor carries an identical explicit-author signal so the candidates tie on base score, and its id sorts after both advisor ids so an absent penalty would resolve the tie in the advisor's favor; the penalty is therefore the only thing that flips the order, which makes each assertion a real lock rather than a tie-break artifact. The file also asserts the constant is negative directly, and adds a negative-control on a non-audit prompt where the advisor must keep the tie-break lead, proving the penalty is conditional rather than a blanket advisor suppression.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/scoring-constants.ts` | Modified | Durable WHY comment at the `auditRecsAdvisorPenalty` declaration and a short cross-reference at its value |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts` | Modified | Guard-off branch matches through `isAdvisorSelfRecommendationSkill` so the alias is demoted too |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/advisor-self-recommendation-penalty-contract.vitest.ts` | Created | Regression test firing the penalty for both the canonical id and the alias, confirmed to break on removal and on an exact-id revert |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/provenance-self-boost-guard.vitest.ts` | Modified | Reconciled the existing alias test to the corrected guard-off behavior |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The penalty definition in `scoring-constants.ts` and its application in `fusion.ts` were read first. In `primaryIntentBonus`, an audit-recommendation prompt returned `auditRecsAdvisorPenalty` for `recommendation.skill === 'system-skill-advisor'` when the explicit guard flag is OFF. The exact-string check missed the `skill-advisor` alias, which the module's own canonical `isAdvisorSelfRecommendationSkill` helper (over `ADVISOR_SELF_RECOMMENDATION_SKILL_IDS = {'system-skill-advisor', 'skill-advisor'}`) already covers and which the guard-on path already uses. The follow-up deep review flagged this as P1-9, and the symptom was confirmed against the real code before any edit.

The WHY comment was added at the declaration, the guard-off check was changed to match through the canonical helper, and the existing `provenance-self-boost-guard.vitest.ts` was read both to reuse its `createFixtureProjection`/`skill()` harness and to find its alias test, which encoded the old behavior (alias top when guard off). The new regression test was authored and validated as a real lock in two ways: temporarily zeroing the penalty broke three of its five tests (the negative-constant, not-top and demotion assertions), and temporarily reverting the check to exact-id-only broke exactly the alias test while the canonical-id tests stayed green. The fix was then restored. The existing alias test was reconciled to assert the alias is demoted in the guard-off default (matching the canonical-id test), and the full scorer suite was re-run green.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix the alias gap via the canonical helper, not a second exact-string check | The module already has `isAdvisorSelfRecommendationSkill` over both ids, used by the guard-on path; matching through it covers the alias and keeps the two paths consistent |
| Treat the alias demotion as a deliberate, correct behavior change | The review confirmed the alias self-recommending on audit prompts is a bug; demoting it like the canonical id is the intended behavior |
| Comment at the declaration plus a value-site pointer | The declaration is where the contract is most legible, the value site is where a calibration edit would land, so both touch points carry the warning |
| Competitor id sorts after both advisor ids | A score tie would otherwise resolve in the advisor's favor, so the penalty alone flips the order and the ranking assertions cannot pass vacuously |
| Validate the lock two ways | Zeroing the penalty proves the value lock; reverting to exact-id-only proves the alias-coverage lock, so both regressions are caught |
| Reconcile the existing alias test rather than leave it failing | That test asserted the old guard-off behavior the fix deliberately changes, so it was updated to the corrected behavior with the rest of the scorer suite confirmed green |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

The advisor build typecheck `tsc --noEmit --composite false -p tsconfig.build.json` was run in `.opencode/skills/system-skill-advisor/mcp_server`. The tests were run with `vitest run` against the new file, the reconciled self-boost-guard file, and the full `tests/scorer/` directory.

| Check | Result |
|-------|--------|
| `tsc` clean on the advisor build target | PASS, exit 0, no output |
| The new regression test passes with the fix present | PASS, 5 tests |
| The full scorer suite passes after the fix and the test reconciliation | PASS, 119 tests across 16 files |
| The test fails when the penalty is zeroed | CONFIRMED, 3 of 5 tests break, then restored |
| The test fails when the guard-off check is reverted to exact-id-only | CONFIRMED, the alias test breaks while the canonical-id tests pass, then restored |
| The penalty value is unchanged | PASS, `-0.25`; only the guard-off matching predicate changed |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The full advisor cli test pass runs after this phase.** The build typecheck and the targeted scorer tests are green; the complete suite run through the cli executor is the remaining verification step before a completion claim at the parent level.
2. **The advisor tests typecheck target has 4 pre-existing errors.** They are in `skill-advisor-launcher-orphan-reaping.vitest.ts`, an unrelated file this phase did not touch, and are `'second.child.stdin' is possibly 'null'` strictness warnings. The new test file contributes zero type errors, and the build target is clean.
3. **The new test pins the production-default guard-OFF state for both ids.** The explicit guard-ON path is covered by the existing `provenance-self-boost-guard.vitest.ts`, which after the fix asserts the alias is demoted in both guard states. The two paths now share the canonical helper, so alias coverage is consistent across them.
<!-- /ANCHOR:limitations -->

---
