---
title: "Verification Checklist: create-skill-canon-self-consistency"
description: "Verification Date: pending"
trigger_phrases:
  - "canon consistency checklist"
  - "placeholder absence guardrail"
  - "scaffold rehearsal verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/025-skill-doc-currency/002-create-skill-canon-self-consistency"
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
# Verification Checklist: create-skill-canon-self-consistency

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
- [ ] CHK-005 [P0] The seven registry-supplementary items each carry their own evidence line; none was batch-edited
- [ ] CHK-006 [P0] The authority proof is recorded: the contract and module were read in full and confirmed authoritative, or the phase escalated
- [ ] CHK-007 [P0] DR-4 and DR-5 are ruled before the edits they govern
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:baselines -->
## Baselines (captured before any edit)

- [ ] CHK-010 [P0] Placeholder-file inventory recorded across all skill roots
- [ ] CHK-011 [P1] Fleet-gate result recorded for the affected hub roots
- [ ] CHK-012 [P1] Packaging-script result recorded for the sample skills
- [ ] CHK-013 [P1] Router-test result recorded before any alias change
- [ ] CHK-014 [P0] No delta claim in this phase cites a remembered number
<!-- /ANCHOR:baselines -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-020 [P0] The conformance test passes lint/format for its language
- [ ] CHK-021 [P0] The conformance test fails on a side it cannot read; a negative test proves it
- [ ] CHK-022 [P0] The conformance test was proven to fail on a deliberately introduced mismatch
- [ ] CHK-023 [P1] The test reports which documents it parsed, so a vacuous pass is visible
- [ ] CHK-024 [P1] Code follows project patterns
- [ ] CHK-025 [P1] No introduced comment embeds a spec path, packet id, phase id, requirement id or checklist id; the durable reason is kept instead
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-030 [P0] All acceptance criteria in spec.md §4 met
- [ ] CHK-031 [P0] A throwaway hub scaffolded from the repaired template emits no placeholder file and passes the fleet gate
- [ ] CHK-032 [P0] The throwaway scaffold was removed afterwards
- [ ] CHK-033 [P1] The packaging script produces no new failures against the recorded baseline
- [ ] CHK-034 [P1] Router tests green after alias normalization, with consumers updated in the same change
- [ ] CHK-035 [P1] Every directory named by the hub README and the default fallback resource exists
- [ ] CHK-036 [P1] The naming-rule table's valid and invalid columns are disjoint
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. The companion-metadata policy is explicitly `class-of-bug`: the packet was grepped for other statements, not only the four reported.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests — including every consumer of the normalized aliases.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. Applied to the conformance test's prose parser: a table inside a code fence, a nested table, and a missing table must not produce a false pass.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count listed before completion: skill class × companion file × source-of-claim.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:guardrails -->
## Guardrails

- [ ] CHK-040 [P0] No companion-metadata placeholder file exists that was absent from the pre-edit inventory
- [ ] CHK-041 [P0] The standalone-class skill still has no companion metadata file
- [ ] CHK-042 [P0] Neither the contract module nor its markdown contract was edited to make prose true
- [ ] CHK-043 [P0] The section-requirement validation was not changed alone; the ruling covered prose and validator together
<!-- /ANCHOR:guardrails -->

---

<!-- ANCHOR:coverage -->
## Coverage

- [ ] CHK-050 [P0] All 15 registry findings in scope reached a terminal state
- [ ] CHK-051 [P0] All 7 registry-supplementary findings reached a terminal state
- [ ] CHK-052 [P0] The arithmetic holds: 15 + 7 = 22 items, each in exactly one state
- [ ] CHK-053 [P1] The three ID pairs were closed as three surfaces, not six edits
<!-- /ANCHOR:coverage -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-055 [P0] `package_skill.py` still rejects a path resolving outside the skill root; the adversarial table test (CHK-FIX-004) still passes.
- [ ] CHK-056 [P1] No fixture or repaired document embeds a credential, token, or absolute machine-local path.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-060 [P1] Spec/plan/tasks synchronized
- [ ] CHK-061 [P1] The decision record carries DR-4 and DR-5 with a real status and rationale
- [ ] CHK-062 [P1] The two wave-2 phases were notified that the rulings are signed
- [ ] CHK-063 [P2] Any deferral recorded with an owner and a reason
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

- [ ] CHK-100 [P0] DR-4 and DR-5 recorded in `decision-record.md` with status, updated once ruled.
- [ ] CHK-101 [P1] The DR-4 finding's own warning against a validator-only change is honored in whichever way it rules.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P2] `parent-skill-check.cjs` fleet-gate runtime measured across all 11 hub roots and recorded.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented for the DR-4 and DR-5 edit groups independently.
- [ ] CHK-121 [P1] Neither edit group starts before its ruling lands (DR-4, DR-5).
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Fleet-gate check `10b`/`10c` invariants still pass across all 11 hub roots after every edit.
- [ ] CHK-131 [P2] No repaired document or fixture embeds a spec path, packet id, or finding id in a code comment.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] `decision-record.md` is updated the moment each ruling lands, not left scaffolded past that point.
- [ ] CHK-141 [P2] The four documents governed by DR-5 (`RE-006-11` plus the scheduled finding) are treated identically per the ruling.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 29 | 0/29 |
| P1 Items | 27 | 0/27 |
| P2 Items | 5 | 0/5 |

**Verification Date**: pending
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:sign-off -->
## L3: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | DR-4 required or advisory | [ ] Approved | |
| Operator | DR-5 generated or illustrative | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
