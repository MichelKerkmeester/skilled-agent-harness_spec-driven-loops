---
title: "Feature Specification: Advisor Self-Recommendation Penalty Contract [template:level_2/spec.md]"
description: "The advisor's explicit self-recommendation guard has a CUT verdict adopted as redundant (the guard code still exists in `fusion.ts` and is scheduled for deletion in the gated code window) because an implicit routing penalty already demotes the advisor from recommending itself on a read-only audit-the-recommendation-quality prompt. That implicit penalty had no flag, no benchmark and no documented contract, so a future refactor could silently remove the sole remaining defense and let the advisor rank itself first on audit prompts again. This phase documents the penalty with a durable WHY comment at its definition and locks its behavior with a regression test that fires it in the production-default state and breaks loudly if the penalty is removed, zeroed or sign-flipped. The penalty value and the routing behavior are unchanged; only documentation and a test are added."
trigger_phrases:
  - "advisor self-recommendation penalty"
  - "auditRecsAdvisorPenalty contract"
  - "advisor must not recommend itself on audit prompts"
  - "lock the cut self-recommendation guard's replacement"
  - "advisor penalty regression test"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/016-skill-advisor-tuning/004-advisor-penalty-contract"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Documented and tested the implicit penalty"
    next_safe_action: "Run the full advisor cli test pass and have the user review"
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
      - "Whether the penalty value or routing behavior needs to change, it does not, the 009 validation cleared the advisor RRF fusion and the follow-up is documentation plus a test only"
---
# Feature Specification: Advisor Self-Recommendation Penalty Contract

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope and verification evidence.
- Remove placeholders, stale status and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | COMPLETE |
| **Created** | 2026-06-24 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation/011-graduation-follow-ups` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The 007 graduation suite adopted the CUT verdict for the explicit advisor self-recommendation guard (`SPECKIT_ADVISOR_SELF_RECOMMENDATION_GUARD`); the guard code remains in `fusion.ts` pending deletion in the gated code window. It is redundant because an implicit routing penalty, `auditRecsAdvisorPenalty`, already demotes the advisor when it would recommend itself on a read-only "audit the recommendation quality" prompt: auditing routing output is a review task, not an advisor invocation. The penalty is defined in `lib/scorer/scoring-constants.ts` and applied in `lib/scorer/fusion.ts` inside `primaryIntentBonus`, where in the production-default state (the explicit guard flag OFF) it fires unconditionally for the advisor skill on an audit-recommendation prompt.

The problem is that this implicit penalty had no flag, no benchmark and no documented contract. With the explicit guard now cut, the penalty is the sole remaining defense. A future refactor that touches the calibration constants or the fusion routing block could silently remove, zero, or sign-flip the penalty and the advisor would rank itself first on audit and explainer prompts again, with nothing left to stop it, and no test to catch the regression.

A follow-up deep review then found a second gap in the same branch: the guard-off application matched the advisor by the exact string `system-skill-advisor`, so the `skill-advisor` alias was missed and self-recommended to the top in the production-default state. The module already carries a canonical self-rec id set (`isAdvisorSelfRecommendationSkill`, covering both ids) that the guard-on path uses, so the fix is to apply the penalty through that helper in the guard-off branch too. This is a deliberate, correct behavior change: the alias should be demoted just like the canonical id.

### Purpose

Make the penalty's contract durable, correct and self-defending. Add a WHY comment at the penalty's definition that states what it guards and that it is now the sole defense, so a future editor reads the consequence before changing it. Apply the penalty through the canonical self-rec id helper in the guard-off branch so both the canonical id and its alias are demoted on audit prompts. Add a regression test that fires the penalty in the production-default state and asserts neither the advisor nor its alias is the top recommendation on an audit prompt, so the same future refactor breaks a test loudly instead of shipping a silent regression. The penalty value is unchanged; the only routing change is the deliberate alias coverage.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A durable WHY comment at the `auditRecsAdvisorPenalty` declaration in `scoring-constants.ts`, stating the advisor must not recommend itself on read-only audit/explainer prompts, that this penalty is the sole defense after the CUT verdict was adopted (guard-code deletion pending) so it must not be removed without a tested replacement, and that it must be applied through the canonical self-rec id set so the alias is demoted too. A short cross-reference comment at the constant's value site.
- The guard-off application in `primaryIntentBonus` (`fusion.ts`) changed to match the advisor through the canonical `isAdvisorSelfRecommendationSkill` helper instead of an exact `system-skill-advisor` string, so both the canonical id and the `skill-advisor` alias are demoted in the production-default state. This is a deliberate behavior change, aligning the guard-off path with the guard-on path that already uses the helper.
- A regression test under the advisor scorer test suite that feeds a self-recommendation-prone audit prompt to `scoreAdvisorPrompt` in the production-default state (explicit guard flag OFF) and asserts neither the advisor nor its alias is the top recommendation, each is demoted below a score-tied competitor, and that the constant is negative. The test breaks loudly if the penalty is removed, zeroed, sign-flipped, or reverted to an exact-id-only check.

### Out of Scope

- Any change to the penalty's value (`-0.25`). Only the matching predicate in the guard-off branch is changed, to cover the alias.
- The advisor RRF fusion, which the 009 validation cleared with no change required.
- Re-introducing the cut explicit guard. The follow-up is to lock and correct the implicit penalty that replaced it, not to revive the explicit one.
- Any artifact-id, spec-path or packet-number in the code comment. The comment carries the durable reason only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/scoring-constants.ts` | Modify | Durable WHY comment at the `auditRecsAdvisorPenalty` interface declaration, plus a short cross-reference comment at its value |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts` | Modify | Apply the penalty through `isAdvisorSelfRecommendationSkill` in the guard-off branch so the alias is demoted too |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/advisor-self-recommendation-penalty-contract.vitest.ts` | Create | Regression test that fires the penalty for both the canonical id and the alias and breaks if it is removed or reverted to exact-id-only |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/provenance-self-boost-guard.vitest.ts` | Modify | Reconcile the existing alias test to the corrected guard-off behavior (alias demoted off, not only on) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The penalty MUST carry a durable WHY comment at its definition explaining what it guards and that it is the sole defense after the CUT verdict was adopted (guard-code deletion pending) | The comment is present at the `auditRecsAdvisorPenalty` declaration and states the advisor-must-not-self-recommend reason and the do-not-remove-without-replacement constraint |
| REQ-002 | A regression test MUST assert the penalty fires: on an audit prompt in the production-default state neither the advisor nor its alias is the top recommendation | The test runs green with the fix present and fails when the penalty is removed, zeroed, or reverted to an exact-id-only check |
| REQ-003 | The penalty MUST demote the `skill-advisor` alias as well as the canonical id in the guard-off default, applied through the canonical self-rec id helper | The guard-off branch matches via `isAdvisorSelfRecommendationSkill`, and the alias is demoted off the top spot on an audit prompt |
| REQ-006 | The penalty VALUE MUST be unchanged; only the matching predicate changes | The constant remains `-0.25`, only the guard-off id check is altered |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The comment MUST carry no artifact-id, spec-path or packet-number, only the durable reason | The comment text references no spec folder, REQ id, packet number or finding id |
| REQ-005 | The advisor package build typecheck MUST stay clean | `tsc --noEmit --composite false -p tsconfig.build.json` exits 0 in the advisor `mcp_server` |
| REQ-007 | The existing alias test that encoded the old guard-off behavior MUST be reconciled to the corrected behavior, with no other scorer regression | `provenance-self-boost-guard.vitest.ts` asserts the alias is demoted in the guard-off default, and the full scorer suite is green |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The durable WHY comment is present at the penalty definition and names the consequence of removal without any artifact-id.
- **SC-002**: The regression test passes with the fix present and was confirmed to fail both when the penalty is zeroed and when the guard-off check is reverted to exact-id-only, proving it is a real lock for both the value and the alias coverage.
- **SC-003**: The advisor build typecheck exits 0, proving the comment, the predicate change and the test introduced no type break.
- **SC-004**: The penalty constant is unchanged at `-0.25`; the only routing change is the deliberate alias coverage in the guard-off branch, and the full scorer suite is green.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A future refactor removes the penalty and the advisor self-recommends on audit prompts again with no defense | High | A regression test that fires the penalty in the production-default state and breaks loudly on removal, plus a durable WHY comment at the definition that states the consequence |
| Risk | The regression test passes vacuously, asserting an ordering the tie-break already produces without the penalty | Med | The competitor id sorts after the advisor so a score tie would otherwise favor the advisor, and the test was confirmed to fail when the penalty is zeroed |
| Risk | The comment embeds an artifact-id and violates comment hygiene | Low | The comment carries only the durable reason, no spec path, REQ id or packet number |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The change adds a comment and a test only, with no runtime cost on the routing path.

### Reliability
- **NFR-R01**: The regression test makes the sole remaining defense self-defending: a refactor that drops the penalty fails a test rather than shipping a silent self-recommendation regression.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A non-audit prompt that names the advisor directly: the penalty is scoped to audit/recommendation-quality prompts, so the advisor is not demoted. A negative-control test asserts the advisor keeps the tie-break lead here, proving the penalty is conditional rather than a blanket suppression.

### Error Scenarios
- The `skill-advisor` alias on an audit prompt with the guard OFF: before the fix the exact-id check missed it and the alias self-recommended to the top. The fix matches through the canonical self-rec id set so the alias is demoted like the canonical id. A regression test pins the alias case and fails if the check reverts to exact-id-only.
- The explicit guard flag is ON: a separate existing test covers the guard-enabled path. The guard-on and guard-off paths now both match the advisor through the same canonical helper, so the alias is demoted consistently in either state.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | A comment block, a one-line predicate fix, a regression test, and one existing-test reconciliation |
| Risk | 9/25 | The penalty is a load-bearing safety mechanism and the predicate change is a deliberate behavior change, mitigated by tests confirmed to fail on both removal and exact-id revert plus a green full scorer suite |
| Research | 5/20 | The penalty definition, application site, the alias gap and the production-default state were read in source before any edit |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The penalty value stays unchanged, the alias gap is fixed through the canonical helper, and the test was confirmed to break on both removal and an exact-id revert.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:verdict -->
## 11. VERDICT

GO. The implicit `auditRecsAdvisorPenalty` now carries a durable WHY comment at its definition stating it is the sole defense against advisor self-recommendation on audit prompts after the CUT verdict was adopted (guard-code deletion pending) and that it must be applied through the canonical self-rec id set. A follow-up deep review found the guard-off branch matched the advisor by exact string and missed the `skill-advisor` alias; the fix applies the penalty through `isAdvisorSelfRecommendationSkill` so the alias is demoted in the production-default state too, a deliberate, correct behavior change aligning the guard-off path with the guard-on path. A regression test asserts neither the canonical id nor the alias is the top recommendation on an audit prompt, and was confirmed to fail both when the penalty is zeroed and when the check is reverted to exact-id-only. The existing alias test was reconciled to the corrected guard-off behavior. The penalty value is unchanged at `-0.25`, the advisor build typecheck exits 0, and the full scorer suite is green (119 tests).
<!-- /ANCHOR:verdict -->
