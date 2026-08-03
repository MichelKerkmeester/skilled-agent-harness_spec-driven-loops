---
title: "Verification Checklist: executor-and-dispatch-contract-truth"
description: "Verification Date: pending"
trigger_phrases:
  - "executor contract checklist"
  - "fleet gate verification"
  - "roster derivation verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/025-skill-doc-currency/001-executor-and-dispatch-contract-truth"
    last_updated_at: "2026-07-30T00:00:00Z"
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
# Verification Checklist: executor-and-dispatch-contract-truth

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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
- [ ] CHK-004 [P0] Every one of the 22 scope items has a confirm-against-HEAD disposition before any edit
- [ ] CHK-005 [P0] The eight iteration-4 salvaged items were re-read at their cited lines, not accepted from summary
- [ ] CHK-006 [P0] Confirmation rate recorded; if below 75%, the phase was re-scoped rather than patched
- [ ] CHK-007 [P0] The blocking operator decisions (Q2, DR-1) are answered, or the tasks depending on them are still marked blocked
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:baselines -->
## Baselines (captured before any edit)

- [ ] CHK-010 [P0] Fleet-gate output over all 11 hub roots recorded verbatim, with a date
- [ ] CHK-011 [P0] Corruption-sweep counts recorded, narrow and widened
- [ ] CHK-012 [P0] Runtime typecheck and test output recorded whole
- [ ] CHK-013 [P1] Installed CLI versions recorded with capture dates
- [ ] CHK-014 [P0] No delta or no-regression claim anywhere in this phase cites a remembered number
<!-- /ANCHOR:baselines -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-020 [P0] Introduced checks pass lint/format for their language
- [ ] CHK-021 [P0] No console errors or warnings from the introduced checks
- [ ] CHK-022 [P0] The derived-roster check fails loudly on a document it cannot parse; a negative test proves it
- [ ] CHK-023 [P1] The derived-roster check reports its parsed-document count, so a vacuous pass is visible
- [ ] CHK-024 [P1] Code follows project patterns
- [ ] CHK-025 [P1] No introduced comment embeds a spec path, packet id, phase id, requirement id or checklist id; the durable reason is kept instead
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-030 [P0] All acceptance criteria in spec.md §4 met
- [ ] CHK-031 [P0] Fleet gate green on all 11 roots from a post-edit run
- [ ] CHK-032 [P0] Corruption sweep returns zero; the delta against the recorded baseline is reported
- [ ] CHK-033 [P0] Runtime typecheck and test suite green; the delta against the recorded baseline is reported
- [ ] CHK-034 [P1] Each regenerated flag table read side by side with its fixture
- [ ] CHK-035 [P1] The council documents' advertised routes proven a subset of the resolver allowlist
- [ ] CHK-036 [P2] The find-and-replace hypothesis recorded as confirmed or not-established
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. The malformed-list findings are explicitly `class-of-bug`, so the sweep is required and the four reported sites are not sufficient.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. Applied here to the roster parser: a document with a code fence, a nested list and a partial name must not produce a false pass.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed: executor kind × document class × claim type.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P0] No hardcoded secrets
- [ ] CHK-041 [P0] Captured CLI help fixtures reviewed and free of credentials, tokens and machine-identifying paths
- [ ] CHK-042 [P1] No introduced check writes outside the packet
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:coverage -->
## Coverage

- [ ] CHK-050 [P0] All 20 registry findings in scope reached a terminal state
- [ ] CHK-051 [P0] Both synthesis-discovered findings reached a terminal state
- [ ] CHK-052 [P0] The arithmetic holds: 20 + 2 = 22 items, each in exactly one state
- [ ] CHK-053 [P1] The ceded findings were not edited here; the merge hazard was communicated before landing
- [ ] CHK-054 [P1] The closed refutation ID was not reopened; the file correction is recorded on refutation-audit grounds
<!-- /ANCHOR:coverage -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-060 [P1] Spec/plan/tasks synchronized
- [ ] CHK-061 [P1] Decision record ADR-001 through ADR-003 statuses reflect reality, not aspiration
- [ ] CHK-062 [P2] Any deferral is recorded with an owner and a reason
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-070 [P1] Temp files in scratch/ only
- [ ] CHK-071 [P1] scratch/ cleaned before completion
- [ ] CHK-072 [P1] Baselines kept inside the packet, not in a system temp directory
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## L3: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] ADR-001 (Copilot branch disposition), ADR-002 (capability vs. policy) and ADR-003 (executor roster ownership) recorded with status.
- [ ] CHK-101 [P1] Rejected alternatives documented with rationale for each of the three ADRs.
- [ ] CHK-102 [P2] Migration path documented for the roster-ownership cutover (ADR-003).
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P2] Derived-roster check runtime measured across the full command YAML and reference corpus.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented for the Copilot branch deletion (ADR-001).
- [ ] CHK-121 [P1] The derived-roster check is additive and can be reverted independently of the branch deletion.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P0] The capability claim and the policy claim (ADR-002) are stated separately, never merged into "unsupported".
- [ ] CHK-131 [P1] No repaired document embeds a spec path, packet id, or finding id in a code comment.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] The deep-loop mechanics reference is the single owner of the executor roster number (ADR-003); every other mention becomes a link.
- [ ] CHK-141 [P2] `decision-record.md` cites the tasks it blocks for all three ADRs.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 30 | 0/30 |
| P1 Items | 23 | 0/23 |
| P2 Items | 6 | 0/6 |

**Verification Date**: pending
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:sign-off -->
## L3: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | ADR-001 Copilot branch disposition | [ ] Approved | |
| Operator | ADR-002 capability vs. policy | [ ] Approved | |
| Operator | ADR-003 executor roster ownership | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
