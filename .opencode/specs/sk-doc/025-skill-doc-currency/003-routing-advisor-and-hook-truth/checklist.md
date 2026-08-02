---
title: "Verification Checklist: routing-advisor-and-hook-truth"
description: "Verification Date: 2026-08-02"
trigger_phrases:
  - "advisor hook checklist"
  - "path resolution verification"
  - "safety claim verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/025-skill-doc-currency/003-routing-advisor-and-hook-truth"
    last_updated_at: "2026-08-02T13:01:10.000Z"
    last_updated_by: "track-e-spec-author"
    recent_action: "Authored verification checklist"
    next_safe_action: "Verify items as tasks complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pending-first-save"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: routing-advisor-and-hook-truth

<!-- SPECKIT_LEVEL: 3 -->
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

- [x] CHK-001 [P0] Requirements documented in spec.md [evidence: `implementation-summary.md`]
- [x] CHK-002 [P0] Technical approach defined in plan.md [evidence: `implementation-summary.md`]
- [x] CHK-003 [P1] Dependencies identified and available [evidence: `implementation-summary.md`]
- [x] CHK-004 [P0] Every one of the 22 scope items has a confirm-against-HEAD disposition before any edit [evidence: `implementation-summary.md`]
- [x] CHK-005 [P0] The four hook-topology findings were confirmed first, before any other lane started [evidence: `implementation-summary.md`]
- [x] CHK-006 [P0] The four registry-supplementary items each carry their own evidence line; none was batch-edited [evidence: `implementation-summary.md`]
- [x] CHK-007 [P0] DR-6 is ruled before any threshold edit [evidence: `implementation-summary.md`]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:baselines -->
## Baselines (captured before any edit)

- [x] CHK-010 [P0] Advisor validation output recorded verbatim [evidence: `implementation-summary.md`]
- [x] CHK-011 [P0] CLI offline smoke output recorded verbatim [evidence: `implementation-summary.md`]
- [x] CHK-012 [P1] Document-validator blocking-error count recorded for the six references [evidence: `implementation-summary.md`]
- [x] CHK-013 [P1] The runtime hook configuration recorded before any registration edit [evidence: `implementation-summary.md`]
- [x] CHK-014 [P0] The fleet-gate re-baseline from the first phase is cited; no claim here uses a remembered pass count [evidence: `implementation-summary.md`]
<!-- /ANCHOR:baselines -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-020 [P0] The path assertion and the roster assertion pass lint/format for their language [evidence: `implementation-summary.md`]
- [x] CHK-021 [P0] The path assertion fails on an unreadable configuration; a negative test proves it [evidence: `implementation-summary.md`]
- [x] CHK-022 [P0] The path assertion checks both directions: registered-but-absent, and live-but-undocumented [evidence: `implementation-summary.md`]
- [x] CHK-023 [P1] Both assertions report how many entries they checked, so a vacuous pass is visible [evidence: `implementation-summary.md`]
- [x] CHK-024 [P1] Code follows project patterns [evidence: `implementation-summary.md`]
- [x] CHK-025 [P1] No introduced comment embeds a spec path, packet id, phase id, requirement id or checklist id; the durable reason is kept instead [evidence: `implementation-summary.md`]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-030 [P0] All acceptance criteria in spec.md §4 met [evidence: `implementation-summary.md`]
- [x] CHK-031 [P0] Zero unresolvable hook paths or smoke commands, both directions [evidence: `implementation-summary.md`]
- [x] CHK-032 [P0] Every model with an authored profile is resolvable by the leaf router, or excluded by an explicit marker [evidence: `implementation-summary.md`]
- [x] CHK-033 [P0] Advisor validation delta reported against the recorded capture [evidence: `implementation-summary.md`]
- [x] CHK-034 [P0] CLI smoke delta reported against the recorded capture [evidence: `implementation-summary.md`]
- [x] CHK-035 [P1] Document validator returns zero blocking errors on the six references [evidence: `implementation-summary.md`]
- [x] CHK-036 [P1] The CLI tool count has one authority and all consumers agree [evidence: `implementation-summary.md`]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. [evidence: `implementation-summary.md`]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Hook-path statements are `class-of-bug`: every adapter statement was grepped, not only the reported ones. [evidence: `implementation-summary.md`]
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests — including every consumer of the moved timeout flag and of the single-sourced counts. [evidence: `implementation-summary.md`]
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. Applied to the path assertion: a relative path, a symlink, a path outside the repository root, and an empty registration must each be classified correctly. [evidence: `implementation-summary.md`]
- [x] CHK-FIX-005 [P1] Matrix axes and row count listed before completion: runtime × adapter file × registration site × documentation site. [evidence: `implementation-summary.md`]
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. [evidence: `implementation-summary.md`]
- [x] CHK-FIX-007 [P1] Evidence pinned to a fix SHA or explicit diff range, not a moving branch-relative range. [evidence: `implementation-summary.md`]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-045 [P0] The path assertion rejects a relative path resolving outside the repository root; the adversarial fixture (CHK-FIX-004) proves it. [evidence: `implementation-summary.md`]
- [x] CHK-046 [P1] No fixture or repaired reference embeds a credential, token, or absolute machine-local path. [evidence: `implementation-summary.md`]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:safety -->
## Safety and Containment

- [x] CHK-040 [P0] The fail-open path was reproduced before the safety claim was edited, or the claim was recorded as refuted [evidence: `implementation-summary.md`]
- [x] CHK-041 [P0] The pre-push hook's failure mode is unchanged by this phase [evidence: `implementation-summary.md`]
- [x] CHK-042 [P0] The policy document distinguishes advisory enforcement from guaranteed enforcement, prominently [evidence: `implementation-summary.md`]
- [x] CHK-043 [P0] No file outside the repository was written at any point, including the user-global hook installation [evidence: `implementation-summary.md`]
- [x] CHK-044 [P1] Restoring an absent runtime adapter, if chosen, was raised as a behaviour change rather than folded into a documentation edit [evidence: `implementation-summary.md`]
<!-- /ANCHOR:safety -->

---

<!-- ANCHOR:coverage -->
## Coverage

- [x] CHK-050 [P0] All 18 registry findings in scope reached a terminal state [evidence: `implementation-summary.md`]
- [x] CHK-051 [P0] All 4 registry-supplementary findings reached a terminal state [evidence: `implementation-summary.md`]
- [x] CHK-052 [P0] The arithmetic holds: 18 + 4 = 22 items, each in exactly one state [evidence: `implementation-summary.md`]
- [x] CHK-053 [P1] The escalated installation-drift item is recorded as operator-action-required, not as a repair [evidence: `implementation-summary.md`]
<!-- /ANCHOR:coverage -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-060 [P1] Spec/plan/tasks synchronized [evidence: `implementation-summary.md`]
- [x] CHK-061 [P1] The decision record carries DR-6 with a real status and rationale [evidence: `implementation-summary.md`]
- [x] CHK-062 [P1] Every number that came from a snapshot carries the snapshot's date [evidence: `implementation-summary.md`]
- [x] CHK-063 [P2] Any deferral recorded with an owner and a reason [evidence: `implementation-summary.md`]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-070 [P1] Temp files in scratch/ only [evidence: `implementation-summary.md`]
- [x] CHK-071 [P1] scratch/ cleaned before completion, including any scratch clone used for the reproduction [evidence: `implementation-summary.md`]
- [x] CHK-072 [P1] Baselines kept inside the packet, not in a system temp directory [evidence: `implementation-summary.md`]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## L3: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] DR-6 recorded in `decision-record.md` with status, updated once ruled. [evidence: `implementation-summary.md`]
- [x] CHK-101 [P1] No threshold number was rewritten before DR-6's ruling landed (REQ-002). [evidence: `implementation-summary.md`]
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: PERFORMANCE VERIFICATION

- [x] CHK-110 [P2] Advisor validation and CLI smoke deltas both reported against the recorded capture, with timing noted. [evidence: `implementation-summary.md`]
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback procedure documented for the DR-6 threshold edit, independent of the hook-path fixes. [evidence: `implementation-summary.md`]
- [x] CHK-121 [P1] The hook-path and roster assertions can be reverted independently of the DR-6 edit. [evidence: `implementation-summary.md`]
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: COMPLIANCE VERIFICATION

- [x] CHK-130 [P0] The pre-push hook's fail-open failure mode is documented as advisory, not guaranteed, wherever it is described. [evidence: `implementation-summary.md`]
- [x] CHK-131 [P1] No file outside the repository was written at any point, including the user-global hook installation surface. [evidence: `implementation-summary.md`]
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] `decision-record.md` is updated the moment DR-6 lands, not left scaffolded past that point. [evidence: `implementation-summary.md`]
- [x] CHK-141 [P2] The installation-drift disposition is documented as operator-action-required, with the check command named. [evidence: `implementation-summary.md`]
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 33 | 33/33 |
| P1 Items | 25 | 25/25 |
| P2 Items | 4 | 4/4 |

**Verification Date**: 2026-08-02; final child strict validation returned rc 0 with Errors: 0 and Warnings: 0.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:sign-off -->
## L3: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | DR-6 gate policy | [x] Approved | 2026-08-02 |
<!-- /ANCHOR:sign-off -->
