---
title: "Verification Checklist: Version-Suffix Flag-Name Cleanup [template:level_2/checklist.md]"
description: "Verification checklist for the hard clean rename that drops the _V1 suffix from twelve live SPECKIT flags, proving the live rename is complete, both typechecks are clean, the affected vitest suite is green, and the archived and historical records were left untouched."
importance_tier: "supporting"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/005-dark-flag-graduation/005-flag-name-cleanup"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Verified the live rename, typechecks and vitest all pass"
    next_safe_action: "User reviews the deliberate non-renames and commits"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md"
    completion_pct: 100
---
# Verification Checklist: Version-Suffix Flag-Name Cleanup

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
- [x] CHK-003 [P1] The full version-flag set, the twelve targets and the non-target families enumerated and classified before any edit
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The rename is a pure exact-name substitution with no behavior change, no new read and no new branch
- [x] CHK-011 [P0] No alias or fallback that still reads an old `_V1` name was added, so a stale export is a no-op
- [x] CHK-012 [P1] Only the twelve exact names were renamed, a near-miss token such as `SPECKIT_EVAL_V2_OUTPUT` was untouched
- [x] CHK-013 [P1] The renamed readers follow the existing `search-flags.ts` pattern unchanged
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met (REQ-001 through REQ-005)
- [x] CHK-021 [P0] The affected vitest suite runs green, 331 tests passing across 23 files
- [x] CHK-022 [P0] The `flag-ceiling.vitest.ts` drift guard passes with the renamed flags acknowledged
- [x] CHK-023 [P1] Both `mcp_server` typechecks exit 0 after the rename
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] The finding class is `cross-consumer`, every producer and consumer of the flag name renamed in lockstep.
- [x] CHK-FIX-002 [P0] Producer inventory completed, the readers in `lib/search` and `lib/response` located by `rg`.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for the tests, the eval scripts, the benchmark arm and the reference docs.
- [x] CHK-FIX-004 [P0] Zero of the twelve `_V1` names remain in the live tree, proven by `rg` over `.opencode/skills`.
- [x] CHK-FIX-005 [P1] The live-versus-archived split is listed, archives and the 028 spec-doc record tree excluded.
- [x] CHK-FIX-006 [P1] The drift guard the rename surfaced was reconciled by acknowledging the renamed flags.
- [x] CHK-FIX-007 [P1] Evidence is the post-rename working tree, the change is uncommitted for user review.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] A name substitution introduces no new untrusted input or execution surface
- [x] CHK-032 [P1] With no alias, a stale export resolves to the unset default rather than silently enabling a flag
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments carry the durable WHY without artifact ids
- [x] CHK-042 [P1] The live env reference docs name the suffix-less flags
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
