---
title: "Feature Specification: Advisor Self-Recommendation Penalty Contract [template:level_2/spec.md]"
description: "The advisor's explicit self-recommendation guard was cut as redundant because an implicit routing penalty already demotes the advisor from recommending itself on a read-only audit-the-recommendation-quality prompt. That implicit penalty had no flag, no benchmark and no documented contract, so a future refactor could silently remove the sole remaining defense and let the advisor rank itself first on audit prompts again. This phase documents the penalty with a durable WHY comment at its definition and locks its behavior with a regression test that fires it in the production-default state and breaks loudly if the penalty is removed, zeroed or sign-flipped. The penalty value and the routing behavior are unchanged; only documentation and a test are added."
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
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/010-graduation-follow-ups/004-advisor-penalty-contract"
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
| **Parent Packet** | `system-spec-kit/028-memory-search-intelligence/010-graduation-follow-ups` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The 007 graduation suite cut the explicit advisor self-recommendation guard (`SPECKIT_ADVISOR_SELF_RECOMMENDATION_GUARD`) as redundant. It is redundant because an implicit routing penalty, `auditRecsAdvisorPenalty`, already demotes the advisor when it would recommend itself on a read-only "audit the recommendation quality" prompt: auditing routing output is a review task, not an advisor invocation. The penalty is defined in `lib/scorer/scoring-constants.ts` and applied in `lib/scorer/fusion.ts` inside `primaryIntentBonus`, where in the production-default state (the explicit guard flag OFF) it fires unconditionally for the advisor skill on an audit-recommendation prompt.

The problem is that this implicit penalty had no flag, no benchmark and no documented contract. With the explicit guard now cut, the penalty is the sole remaining defense. A future refactor that touches the calibration constants or the fusion routing block could silently remove, zero, or sign-flip the penalty and the advisor would rank itself first on audit and explainer prompts again, with nothing left to stop it, and no test to catch the regression.

### Purpose

Make the penalty's contract durable and self-defending. Add a WHY comment at the penalty's definition that states what it guards and that it is now the sole defense, so a future editor reads the consequence before changing it. Add a regression test that fires the penalty in the production-default state and asserts the advisor is not the top recommendation on an audit prompt, so the same future refactor breaks a test loudly instead of shipping a silent regression. The penalty value and the routing behavior are unchanged; only a comment and a test are added.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A durable WHY comment at the `auditRecsAdvisorPenalty` declaration in `scoring-constants.ts`, stating the advisor must not recommend itself on read-only audit/explainer prompts and that this penalty is the sole defense after the explicit guard was cut, so it must not be removed without a tested replacement. A short cross-reference comment at the constant's value site.
- A regression test under the advisor scorer test suite that feeds a self-recommendation-prone audit prompt to `scoreAdvisorPrompt` in the production-default state (explicit guard flag OFF) and asserts the advisor is not the top recommendation, is demoted below a score-tied competitor, and that the constant is negative. The test breaks loudly if the penalty is removed, zeroed or sign-flipped.

### Out of Scope

- Any change to the penalty's value (`-0.25`), the routing behavior, or the fusion logic. This phase only documents and tests the existing penalty.
- The advisor RRF fusion, which the 009 validation cleared with no change required.
- Re-introducing the cut explicit guard. The follow-up is to lock the implicit penalty that replaced it, not to revive the explicit one.
- Any artifact-id, spec-path or packet-number in the code comment. The comment carries the durable reason only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/scoring-constants.ts` | Modify | Durable WHY comment at the `auditRecsAdvisorPenalty` interface declaration, plus a short cross-reference comment at its value |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/advisor-self-recommendation-penalty-contract.vitest.ts` | Create | Regression test that fires the penalty in the production-default state and breaks if it is removed |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The penalty MUST carry a durable WHY comment at its definition explaining what it guards and that it is the sole defense after the explicit guard was cut | The comment is present at the `auditRecsAdvisorPenalty` declaration and states the advisor-must-not-self-recommend reason and the do-not-remove-without-replacement constraint |
| REQ-002 | A regression test MUST assert the penalty fires: on an audit prompt in the production-default state the advisor is NOT the top recommendation | The test runs green with the penalty present and fails when the penalty is removed or zeroed |
| REQ-003 | The penalty value and routing behavior MUST be unchanged | The constant remains `-0.25` and no fusion logic is altered |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The comment MUST carry no artifact-id, spec-path or packet-number, only the durable reason | The comment text references no spec folder, REQ id, packet number or finding id |
| REQ-005 | The advisor package build typecheck MUST stay clean | `tsc --noEmit --composite false -p tsconfig.build.json` exits 0 in the advisor `mcp_server` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The durable WHY comment is present at the penalty definition and names the consequence of removal without any artifact-id.
- **SC-002**: The regression test passes with the penalty present and was confirmed to fail when the penalty is zeroed, proving it is a real lock and not a vacuous assertion.
- **SC-003**: The advisor build typecheck exits 0, proving the comment and test introduced no type break.
- **SC-004**: The penalty constant is unchanged at `-0.25` and no fusion routing logic was modified.
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
- The explicit guard flag is ON: a separate existing test covers the guard-enabled path and its alias generalization. This phase pins only the production-default guard-OFF state, where the implicit penalty is the sole defense.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 5/25 | One comment block and one regression test file, no behavior change |
| Risk | 7/25 | The penalty is a load-bearing safety mechanism, mitigated by a test confirmed to fail on removal |
| Research | 5/20 | The penalty definition, application site and production-default state were read in source before any edit |
| **Total** | **17/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The penalty value and behavior stay unchanged, and the test was confirmed to break on removal.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:verdict -->
## 11. VERDICT

GO. The implicit `auditRecsAdvisorPenalty` now carries a durable WHY comment at its definition stating it is the sole defense against advisor self-recommendation on audit prompts after the explicit guard was cut, and a regression test fires the penalty in the production-default state and asserts the advisor is not the top recommendation on an audit prompt. The test was confirmed to fail when the penalty is zeroed, proving it is a real lock. The penalty value and the routing behavior are unchanged, and the advisor build typecheck exits 0.
<!-- /ANCHOR:verdict -->
