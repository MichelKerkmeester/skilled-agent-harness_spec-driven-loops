# Verification Checklist: Sub-Agent Nesting Depth Control

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

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
- [x] CHK-003 [P1] Dependencies identified — 3 orchestrate.md files
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Content Quality

- [ ] CHK-010 [P0] NDP section is self-contained and referenceable by section number
- [ ] CHK-011 [P0] No placeholder text remains ([PLACEHOLDER], [TODO], TBD)
- [ ] CHK-012 [P1] Agent tier classifications are complete (no agent missing)
- [ ] CHK-013 [P1] Depth counting rules are unambiguous
- [ ] CHK-014 [P1] Legal/illegal nesting examples included
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Workflow trace: Orchestrator > @context > @explore stays within depth 3
- [ ] CHK-021 [P0] Workflow trace: Orchestrator > Sub-Orchestrator > @general stays within depth 3
- [ ] CHK-022 [P0] Workflow trace: Orchestrator > @speckit is LEAF — no sub-dispatch
- [ ] CHK-023 [P1] Edge case: Sub-orchestrator at depth 1 can only dispatch LEAFs at depth 2
- [ ] CHK-024 [P1] Edge case: @context at depth 2 (from sub-orch) cannot dispatch @explore at depth 3 if max is 3
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets (N/A — documentation only)
- [ ] CHK-031 [P0] No sensitive information exposed (N/A)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P0] All 3 orchestrate.md files have identical NDP section
- [ ] CHK-041 [P0] No conflicting nesting depth statements remain anywhere in any file
- [ ] CHK-042 [P1] Spec/plan/tasks synchronized with actual changes
- [ ] CHK-043 [P1] Copilot Section 11 conflict resolved
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
- [ ] CHK-052 [P2] Findings saved to memory/
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 3/10 |
| P1 Items | 9 | 1/9 |
| P2 Items | 1 | 0/1 |

**Verification Date**: pending
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md
- [ ] CHK-101 [P1] ADR-001 (3-tier classification) has Accepted status
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale
- [ ] CHK-103 [P2] Future migration path noted (runtime enforcement)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] No measurable token overhead beyond ~20 tokens per dispatch
- [ ] CHK-111 [P2] Depth tracking does not require additional tool calls
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented (git revert)
- [ ] CHK-121 [P1] All 3 files can be reverted independently
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] NDP rules don't contradict existing valid rules
- [ ] CHK-131 [P1] Two-Tier Dispatch Model (Phase 1/Phase 2) preserved
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All spec documents synchronized
- [ ] CHK-141 [P1] NDP section is cross-referenced from Sections 3, 4, 10, 24
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| User | System Owner | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

---

<!--
Level 3 checklist - Full verification + architecture
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
