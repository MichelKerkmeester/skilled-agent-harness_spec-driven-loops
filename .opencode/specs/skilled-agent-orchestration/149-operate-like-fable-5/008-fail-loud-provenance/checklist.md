---
title: "Verification Checklist: Fail-loud executor provenance: requested-versus-actual model comparison in the executor audit, emitting error on mismatch"
description: "Acceptance checks for the requested-vs-actual model diff in the deep-loop executor audit and the fallback-router guard. Verification Date: 2026-06-15."
trigger_phrases:
  - "verification"
  - "checklist"
  - "name"
  - "template"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "scaffold/008-fail-loud-provenance"
    last_updated_at: "2026-06-15T14:06:40Z"
    last_updated_by: "template-author"
    recent_action: "Initialized Level 2 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/008-fail-loud-provenance"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Fail-loud executor provenance: requested-versus-actual model comparison in the executor audit, emitting error on mismatch

<!-- SPECKIT_LEVEL: 2 -->
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

- [ ] CHK-001 [P0] Requirements documented in spec.md (REQ-001..REQ-005, the fail-loud-on-mismatch and pass-on-match acceptance)
- [ ] CHK-002 [P0] Technical approach defined in plan.md (comparison at the `buildExecutorAuditRecord` seam + `model_mismatch` via `emitDispatchFailure` + fallback-router guard)
- [ ] CHK-003 [P1] Baseline suite captured green and no structural dependency on earlier phases (pairs with 003 measurement)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `executor-audit.ts` and `fallback-router.ts` type-check and pass lint/format
- [ ] CHK-011 [P0] `model_mismatch` is added to the `DispatchFailureReason` union, not introduced as a free-form string (REQ-005)
- [ ] CHK-012 [P1] The mismatch path reuses `emitDispatchFailure`, no parallel logging channel added
- [ ] CHK-013 [P1] Comparison respects the native-executor skip already used by the audit writes
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] A requested-vs-actual mismatch emits a `dispatch_failure` with reason `model_mismatch` and writes no success record (REQ-001), proven by `executor-provenance-mismatch.vitest.ts`
- [ ] CHK-021 [P0] A matching requested/actual pair writes the provenance record unchanged with zero dispatch failures (REQ-002)
- [ ] CHK-022 [P1] Edge cases tested: native-executor skip, approved configured fallback passes, unapproved substitution returns `fail-fast` (REQ-003)
- [ ] CHK-023 [P1] A lost-provenance crash escalates visibly via the existing `crash` dispatch failure, never a silent success (REQ-004)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] The provenance gap is classed `class-of-bug` (silent substitution + lost-provenance crash), not a single instance; the fix guards the class at the recording seam.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed: `rg -n 'emitDispatchFailure|DispatchFailureReason|buildExecutorAuditRecord' lib/deep-loop/` confirms the only provenance/dispatch-failure producers touched.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for the new `model_mismatch` reason: `rg -n 'dispatch_failure|model_mismatch|resolveFallback' --glob '*.ts'` confirms readers tolerate the additive reason value.
- [ ] CHK-FIX-004 [P0] Provenance-policy fix includes adversarial table tests: mismatch, match, native-skip, approved-fallback-pass, unapproved-substitution-fail-fast, missing-actual-model.
- [ ] CHK-FIX-005 [P1] Matrix axes and rows listed in plan.md before completion is claimed (match/mismatch x native/non-native x approved/unapproved fallback x crash/clean).
- [ ] CHK-FIX-006 [P1] Mutation check executed: reverting the comparison turns the mismatch test RED, confirming it bites.
- [ ] CHK-FIX-007 [P1] Evidence pinned to the fix commit SHA, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets; the comparison reads only in-scope executor config and the approved model
- [ ] CHK-031 [P0] Provenance integrity holds: a shipped artifact's recorded model equals the approved model, or the run fails loud
- [ ] CHK-032 [P1] No new env reads, external calls, or path handling introduced by the comparison
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks/checklist synchronized and `validate.sh --strict` passes
- [ ] CHK-041 [P1] Code comments carry the durable WHY (provenance must not lie); no spec paths or artifact ids embedded in comments
- [ ] CHK-042 [P2] `deep-loop-runtime` README/changelog updated if the new reason value is operator-facing
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-06-15 (planned; checks run at implementation)
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->

