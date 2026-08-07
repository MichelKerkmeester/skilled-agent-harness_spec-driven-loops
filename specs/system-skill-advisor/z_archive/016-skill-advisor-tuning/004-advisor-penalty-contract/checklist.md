---
title: "Verification Checklist: Advisor Self-Recommendation Penalty Contract [template:level_2/checklist.md]"
description: "Verification checklist for documenting the implicit advisor self-recommendation penalty with a durable WHY comment and locking it with a regression test, proving the penalty value is unchanged, the test breaks on removal, and the advisor build typecheck is clean."
importance_tier: "supporting"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/016-skill-advisor-tuning/004-advisor-penalty-contract"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Verified the comment, the regression test and the build typecheck"
    next_safe_action: "Run the full advisor cli test pass"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/scoring-constants.ts"
    completion_pct: 100
---
# Verification Checklist: Advisor Self-Recommendation Penalty Contract

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] The penalty definition, its value and the production-default application branch were read before any edit
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The penalty value is unchanged at `-0.25`; only the guard-off matching predicate was changed, to cover the alias
- [x] CHK-011 [P0] The durable WHY comment states the advisor-must-not-self-recommend reason, the do-not-remove-without-replacement constraint, and that the penalty must be applied through the canonical self-rec id set so the alias is covered
- [x] CHK-012 [P1] A short cross-reference comment at the constant value points back to the contract
- [x] CHK-013 [P1] The guard-off branch matches through `isAdvisorSelfRecommendationSkill`, aligned with the guard-on path that already uses the helper
- [x] CHK-014 [P1] The regression test reuses the existing scorer fixture-projection harness pattern
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met (REQ-001 through REQ-007)
- [x] CHK-021 [P0] The regression test runs green with the fix present, 5 tests passing
- [x] CHK-022 [P0] The test was confirmed to fail when the penalty is zeroed (3 of 5 break) and when the check is reverted to exact-id-only (the alias test breaks), proving a real lock for both the value and the alias coverage
- [x] CHK-023 [P0] The full scorer suite is green after the predicate fix and the test reconciliation, 119 tests across 16 files
- [x] CHK-024 [P1] The advisor build typecheck exits 0 after the change
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] The finding class is `safety-mechanism-undocumented-and-alias-gap`, the sole-defense penalty now has a comment, an alias-covering predicate fix, and a test.
- [x] CHK-FIX-002 [P0] The penalty definition site located and annotated in `scoring-constants.ts`.
- [x] CHK-FIX-003 [P0] The guard-off branch in `fusion.ts` `primaryIntentBonus` confirmed to have matched by exact string, and fixed to match through the canonical self-rec id helper.
- [x] CHK-FIX-004 [P0] The regression test exercises the production-default state for both the canonical id and the alias, not a flag-on path.
- [x] CHK-FIX-005 [P1] A negative-control test proves the penalty is conditional, not a blanket advisor suppression.
- [x] CHK-FIX-006 [P1] The lock was validated by zeroing the penalty and by reverting to exact-id-only, observing the test break each way, then restoring the fix.
- [x] CHK-FIX-007 [P1] The existing alias test that encoded the old guard-off behavior was reconciled, and no other scorer test regressed.
- [x] CHK-FIX-008 [P1] Evidence is the post-change working tree, uncommitted for user review.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] A comment and a test introduce no new untrusted input or execution surface
- [x] CHK-032 [P1] The regression test makes the sole self-recommendation defense self-defending against silent removal
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments carry the durable WHY without artifact ids
- [x] CHK-042 [P1] The comment names the consequence of removal rather than a spec path or REQ id
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temp files left in the spec folder
- [x] CHK-051 [P1] scratch/ not required for this phase
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 14/14 |
| P1 Items | 15 | 15/15 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-06-24
<!-- /ANCHOR:summary -->

---
