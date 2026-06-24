---
title: "Verification Checklist: Advisor Self-Recommendation Penalty Contract [template:level_2/checklist.md]"
description: "Verification checklist for documenting the implicit advisor self-recommendation penalty with a durable WHY comment and locking it with a regression test, proving the penalty value is unchanged, the test breaks on removal, and the advisor build typecheck is clean."
importance_tier: "supporting"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/010-graduation-follow-ups/004-advisor-penalty-contract"
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

- [x] CHK-010 [P0] The penalty value is unchanged at `-0.25` and no fusion routing logic was modified
- [x] CHK-011 [P0] The durable WHY comment states the advisor-must-not-self-recommend reason and the do-not-remove-without-replacement constraint
- [x] CHK-012 [P1] A short cross-reference comment at the constant value points back to the contract
- [x] CHK-013 [P1] The regression test reuses the existing scorer fixture-projection harness pattern
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met (REQ-001 through REQ-005)
- [x] CHK-021 [P0] The regression test runs green with the penalty present, 4 tests passing
- [x] CHK-022 [P0] The test was confirmed to fail when the penalty is zeroed, 3 of 4 tests break, proving a real lock
- [x] CHK-023 [P1] The advisor build typecheck exits 0 after the change
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] The finding class is `safety-mechanism-undocumented`, the sole-defense penalty now has a comment and a test.
- [x] CHK-FIX-002 [P0] The penalty definition site located and annotated in `scoring-constants.ts`.
- [x] CHK-FIX-003 [P0] The application site in `fusion.ts` `primaryIntentBonus` confirmed to fire in the production-default guard-OFF state.
- [x] CHK-FIX-004 [P0] The regression test exercises the production-default state, not a flag-on path.
- [x] CHK-FIX-005 [P1] A negative-control test proves the penalty is conditional, not a blanket advisor suppression.
- [x] CHK-FIX-006 [P1] The lock was validated by zeroing the penalty and observing the test break, then reverting.
- [x] CHK-FIX-007 [P1] Evidence is the post-change working tree, uncommitted for user review.
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
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-06-24
<!-- /ANCHOR:summary -->

---
