---
title: "Implementation Summary: Advisor Self-Recommendation Penalty Contract [template:level_2/implementation-summary.md]"
description: "Summary of documenting the implicit advisor self-recommendation penalty with a durable WHY comment and locking it with a regression test that fires the penalty in the production-default state and was confirmed to break when the penalty is zeroed, with the penalty value unchanged at -0.25 and the advisor build typecheck clean."
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/010-graduation-follow-ups/004-advisor-penalty-contract"
    last_updated_at: "2026-06-24T00:00:00Z"
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
| **Spec Folder** | 010-graduation-follow-ups/004-advisor-penalty-contract |
| **Completed** | 2026-06-24, status COMPLETE |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Status COMPLETE. The implicit advisor self-recommendation penalty, `auditRecsAdvisorPenalty`, now carries a durable WHY comment at its definition and is locked by a regression test that fires it in the production-default state and breaks loudly if the penalty is removed, zeroed or sign-flipped. The penalty value is unchanged at `-0.25`, no fusion routing logic was modified, and the advisor build typecheck exits 0.

### The durable WHY comment

A comment block at the `auditRecsAdvisorPenalty` interface declaration in `scoring-constants.ts` states that the penalty demotes the advisor from recommending itself on a read-only "audit the recommendation quality" prompt, that auditing routing output is a review task rather than an advisor invocation, and that this penalty is the sole remaining defense because the explicit opt-in guard that used to back it up was removed as redundant precisely because this implicit penalty already fires. The comment states the constraint directly: do not remove or zero it without a documented, tested replacement, or the advisor can rank itself first on audit and explainer prompts again with nothing to stop it. A short cross-reference comment at the constant's value site points an editor of the calibration numbers back to that contract. Neither comment carries an artifact-id, spec-path or packet-number; both carry the durable reason only.

### The regression test

A new test file `tests/scorer/advisor-self-recommendation-penalty-contract.vitest.ts` exercises the penalty through `scoreAdvisorPrompt` against a fixture projection. It pins the production-default state by deleting the explicit guard flag in `beforeEach` and restoring it in `afterEach`, so the implicit penalty is the only thing demoting the advisor. It feeds the self-recommendation-prone audit prompt `audit recommendation quality` and asserts the advisor is not the top recommendation and is ranked below a competitor. The competitor carries an identical explicit-author signal so the two tie on base score, and its id sorts after `system-skill-advisor` so an absent penalty would resolve the tie in the advisor's favor; the penalty is therefore the only thing that flips the order, which makes the assertion a real lock rather than a tie-break artifact. The file also asserts the constant is negative directly, and adds a negative-control on a non-audit prompt where the advisor must keep the tie-break lead, proving the penalty is conditional rather than a blanket advisor suppression.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/scoring-constants.ts` | Modified | Durable WHY comment at the `auditRecsAdvisorPenalty` declaration and a short cross-reference at its value |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/advisor-self-recommendation-penalty-contract.vitest.ts` | Created | Regression test firing the penalty in the production-default state, confirmed to break on removal |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The penalty definition in `scoring-constants.ts` and its application in `fusion.ts` were read first. In `primaryIntentBonus`, an audit-recommendation prompt returns `auditRecsAdvisorPenalty` for the `system-skill-advisor` skill when the explicit guard flag is OFF, which is the production-default branch. The existing `provenance-self-boost-guard.vitest.ts` was read to reuse its `createFixtureProjection` and `skill()` harness so the new test matches the established scorer-test shape.

The WHY comment was added at the declaration, where a future editor of the calibration constants reads it before changing the value, with a short pointer at the value site for an editor touching the frozen number block. The regression test was authored, then validated as a real lock by temporarily zeroing the penalty: three of its four tests failed, the direct negative-constant assertion, the not-top assertion and the demotion-ordering assertion, while the negative-control stayed green. The penalty was then reverted to `-0.25` and the test re-run green.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Document and test only, no behavior change | The 009 validation cleared the advisor RRF fusion and asked only to document and lock the implicit penalty replacing the cut guard |
| Comment at the declaration plus a value-site pointer | The declaration is where the contract is most legible, the value site is where a calibration edit would land, so both touch points carry the warning |
| Competitor id sorts after the advisor | A score tie would otherwise resolve in the advisor's favor, so the penalty alone flips the order and the ranking assertion cannot pass vacuously |
| Pin the production-default guard-OFF state | The explicit guard is cut, so the implicit penalty is the sole defense exactly in this state, which is what the test must protect |
| Validate the lock by zeroing the penalty | A regression test that does not break when the protected mechanism is removed is not a lock, so removal was confirmed to fail it before acceptance |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

The advisor build typecheck `tsc --noEmit --composite false -p tsconfig.build.json` was run in `.opencode/skills/system-skill-advisor/mcp_server`. The regression test was run with `vitest run` against the new file and the existing self-boost-guard file.

| Check | Result |
|-------|--------|
| `tsc` clean on the advisor build target | PASS, exit 0, no output |
| The new regression test passes with the penalty present | PASS, 4 tests |
| The new and existing self-recommendation tests pass together | PASS, 9 tests across 2 files |
| The test fails when the penalty is zeroed | CONFIRMED, 3 of 4 tests break, then reverted |
| The penalty value is unchanged | PASS, `-0.25`, no fusion logic modified |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The full advisor cli test pass runs after this phase.** The build typecheck and the targeted scorer tests are green; the complete suite run through the cli executor is the remaining verification step before a completion claim at the parent level.
2. **The advisor tests typecheck target has 4 pre-existing errors.** They are in `skill-advisor-launcher-orphan-reaping.vitest.ts`, an unrelated file this phase did not touch, and are `'second.child.stdin' is possibly 'null'` strictness warnings. The new test file contributes zero type errors, and the build target is clean.
3. **The test pins only the production-default guard-OFF state.** The explicit guard-ON path and its alias generalization are covered by the existing `provenance-self-boost-guard.vitest.ts`, so this phase intentionally does not re-cover them.
<!-- /ANCHOR:limitations -->

---
