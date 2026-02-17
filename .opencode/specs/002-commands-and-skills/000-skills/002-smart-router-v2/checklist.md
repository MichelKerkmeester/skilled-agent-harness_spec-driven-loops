# Verification Checklist: Smart Router V2 Rollout

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

### P0

- [x] CHK-001 [P0] Requirements documented in spec.md [File: `spec.md`]
- [x] CHK-002 [P0] Technical approach defined in plan.md [File: `plan.md`]

### P1

- [x] CHK-003 [P1] Dependencies identified and available [File: `plan.md` Section 6]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Skill docs pass style and structure checks after rollout
- [ ] CHK-011 [P0] No routing ambiguity introduced by weighted intent mappings
- [ ] CHK-012 [P1] Error handling/fallback behavior documented consistently
- [ ] CHK-013 [P1] Skill docs follow existing project patterns and constraints
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met for all 10 targets
- [ ] CHK-021 [P0] Manual routing verification complete for representative prompt matrix
- [ ] CHK-022 [P1] Edge cases tested (ties, weak confidence, missing directories)
- [ ] CHK-023 [P1] Error scenarios validated (unknown stack markers, discovery boundaries)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets or credentials added in documentation [Inspection: current docs only]
- [ ] CHK-031 [P0] Input handling assumptions documented for low-confidence route fallback
- [ ] CHK-032 [P1] Existing skill constraints remain intact (read-only and safe-operation guidance)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized for Smart Router V2 scope [Files: `spec.md`, `plan.md`, `tasks.md`]
- [x] CHK-041 [P1] Documentation intent and status are explicit for documentation-only phase
- [ ] CHK-042 [P2] Related READMEs updated if rollout introduces visible usage changes
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temporary artifacts in spec root
- [ ] CHK-051 [P1] Any scratch artifacts cleaned before completion claim
- [ ] CHK-052 [P2] Findings saved to memory/ after implementation phase completes
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 4/11 |
| P1 Items | 11 | 5/11 |
| P2 Items | 4 | 0/4 |

**Verification Date**: 2026-02-17
<!-- /ANCHOR:summary -->

---

<!-- Append to Level 2 checklist.md -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md [File: `decision-record.md`]
- [x] CHK-101 [P1] ADR has status and decision metadata
- [x] CHK-102 [P1] Alternatives documented with rejection rationale
- [ ] CHK-103 [P2] Migration path documented if Smart Router V3 requires breaking changes
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Routing latency target met for weighted classification
- [ ] CHK-111 [P1] Discovery traversal target met for recursive scan
- [ ] CHK-112 [P2] Stress scenarios executed for dense keyword prompts
- [ ] CHK-113 [P2] Performance verification notes documented
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented and tested against one failed scenario
- [ ] CHK-121 [P0] Release gating/flag strategy documented if phased enablement is needed
- [ ] CHK-122 [P1] Monitoring/alerting implications documented for routing quality regressions
- [ ] CHK-123 [P1] Runbook created for rollout execution
- [ ] CHK-124 [P2] Deployment runbook reviewed by peer
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Security review completed for safe fallback and constraint preservation
- [ ] CHK-131 [P1] Cross-repository policy compatibility verified (Public + Barter)
- [ ] CHK-132 [P2] Threat model notes captured for prompt-classification misuse scenarios
- [ ] CHK-133 [P2] Data handling requirements remain unchanged and documented
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] Level 3 spec documents synchronized for this phase
- [ ] CHK-141 [P1] Target SKILL.md docs synchronized after implementation phase
- [ ] CHK-142 [P2] User-facing usage guidance updated where needed
- [ ] CHK-143 [P2] Knowledge transfer notes captured for maintainers
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Pending | Technical Lead | [ ] Approved | Pending |
| Pending | Product Owner | [ ] Approved | Pending |
| Pending | QA Lead | [ ] Approved | Pending |
<!-- /ANCHOR:sign-off -->

---

<!--
Level 3 checklist - Full verification + architecture
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
