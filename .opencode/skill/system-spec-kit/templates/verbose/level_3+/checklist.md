# Verification Checklist: [YOUR_VALUE_HERE: Feature-Name]

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-level3plus-verbose | v2.0-verbose -->

---

## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval to defer |
| **[P2]** | Optional | Can defer with documented reason |

---

## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P0] Architecture decisions documented in decision-record.md
- [ ] CHK-004 [P1] Dependencies identified and available

---

## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings
- [ ] CHK-012 [P1] Error handling implemented
- [ ] CHK-013 [P1] Code follows project patterns

---

## Testing

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual testing complete
- [ ] CHK-022 [P1] Edge cases tested
- [ ] CHK-023 [P1] Error scenarios validated

---

## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented
- [ ] CHK-032 [P1] Auth/authz working correctly

---

## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate
- [ ] CHK-042 [P2] README updated (if applicable)

---

## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
- [ ] CHK-052 [P2] Findings saved to memory/

---

## L3: Architecture Verification

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md
- [ ] CHK-101 [P1] All ADRs have status (Proposed/Accepted/Rejected)
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale
- [ ] CHK-103 [P2] Migration path documented (if applicable)

---

## L3: Performance Verification

- [ ] CHK-110 [P1] Response time targets met (NFR-P01)
- [ ] CHK-111 [P1] Throughput targets met (NFR-P02)
- [ ] CHK-112 [P2] Load testing completed
- [ ] CHK-113 [P2] Performance benchmarks documented

---

## L3: Deployment Readiness

- [ ] CHK-120 [P0] Rollback procedure documented and tested
- [ ] CHK-121 [P0] Feature flag configured (if applicable)
- [ ] CHK-122 [P1] Monitoring/alerting configured
- [ ] CHK-123 [P1] Runbook created
- [ ] CHK-124 [P2] Deployment runbook reviewed

---

## L3: Compliance Verification

- [ ] CHK-130 [P1] Security review completed
- [ ] CHK-131 [P1] Dependency licenses compatible
- [ ] CHK-132 [P2] OWASP Top 10 checklist completed
- [ ] CHK-133 [P2] Data handling compliant with requirements

---

## L3: Documentation Verification

- [ ] CHK-140 [P1] All spec documents synchronized
- [ ] CHK-141 [P1] API documentation complete (if applicable)
- [ ] CHK-142 [P2] User-facing documentation updated
- [ ] CHK-143 [P2] Knowledge transfer documented

---

## L3+: Governance Verification

[YOUR_VALUE_HERE: Level 3+ features require governance verification.]

### Approval Workflow

- [ ] CHK-200 [P0] Spec review approval obtained
  [YOUR_VALUE_HERE: Who approved and when]
  [example: @product-lead approved 2024-01-10]

- [ ] CHK-201 [P0] Design review approval obtained (if applicable)
  [YOUR_VALUE_HERE: Who approved and when, or "N/A - no design changes"]

- [ ] CHK-202 [P0] Implementation review approval obtained
  [YOUR_VALUE_HERE: Who approved and when]

- [ ] CHK-203 [P0] Launch approval obtained
  [YOUR_VALUE_HERE: Who approved and when]

### Compliance Checkpoints

- [ ] CHK-210 [P1] Security compliance verified per spec.md L3+ section
  [YOUR_VALUE_HERE: Evidence of security compliance]

- [ ] CHK-211 [P1] Code compliance verified per spec.md L3+ section
  [YOUR_VALUE_HERE: Evidence of code compliance]

- [ ] CHK-212 [P1] Documentation compliance verified per spec.md L3+ section
  [YOUR_VALUE_HERE: Evidence of documentation compliance]

### Stakeholder Communication

- [ ] CHK-220 [P1] All high-interest stakeholders notified of completion
  [YOUR_VALUE_HERE: Who was notified and how]

- [ ] CHK-221 [P2] Knowledge transfer completed
  [YOUR_VALUE_HERE: What knowledge was transferred and to whom]

---

## L3+: Workstream Verification

[YOUR_VALUE_HERE: Level 3+ features with multiple workstreams require coordination verification.]

- [ ] CHK-230 [P0] All workstreams complete
  [YOUR_VALUE_HERE: List workstreams and their completion status]
  [example: W-A (Core Logic): Complete, W-B (UI): Complete, W-C (Tests): Complete]

- [ ] CHK-231 [P0] All sync points verified
  [YOUR_VALUE_HERE: List sync points and their verification]
  [example: SYNC-001: Integration test passed, SYNC-002: Final verification passed]

- [ ] CHK-232 [P1] No file ownership conflicts
  [YOUR_VALUE_HERE: Verify no conflicts between workstreams]

- [ ] CHK-233 [P2] Workstream coordination documented
  [YOUR_VALUE_HERE: Lessons learned documented in implementation-summary.md]

---

## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | [count] | [ ]/[count] |
| P1 Items | [count] | [ ]/[count] |
| P2 Items | [count] | [ ]/[count] |

**Verification Date**: [YYYY-MM-DD]

**Verified By**: [Name or AI agent identifier]

---

## Deferred Items Log

| Item | Priority | Reason | Approval (P1 only) |
|------|----------|--------|-------------------|
| [CHK-###] | [P1/P2] | [Why deferred] | [Who approved or N/A] |

---

## L3+: Sign-Off

[YOUR_VALUE_HERE: Level 3+ features require formal sign-off.]

| Approver | Role | Status | Date |
|----------|------|--------|------|
| [Name] | Technical Lead | [ ] Approved | |
| [Name] | Product Owner | [ ] Approved | |
| [Name] | QA Lead | [ ] Approved | |

**Final Sign-Off Notes**: [YOUR_VALUE_HERE: Any notes from sign-off meeting]

---

<!--
VERBOSE LEVEL 3+ TEMPLATE - VERIFICATION CHECKLIST (~300 lines)
- Level 3+: Large features with governance
- Includes L3+ addendum sections: Governance Verification, Workstream Verification
- Requires formal sign-off with multiple approvers
-->
