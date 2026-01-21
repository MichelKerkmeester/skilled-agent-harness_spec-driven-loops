# Verification Checklist: [YOUR_VALUE_HERE: Feature-Name]

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-level3-verbose | v2.0-verbose -->

---

## Verification Protocol

[YOUR_VALUE_HERE: Understand the priority system before verifying items.]

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval to defer |
| **[P2]** | Optional | Can defer with documented reason |

**How to mark items:**
- `[ ]` - Not yet verified
- `[x]` - Verified with evidence (add note explaining how verified)
- `[~]` - Deferred (P1/P2 only) - add approval note for P1

---

## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P0] Architecture decisions documented in decision-record.md
- [ ] CHK-004 [P1] Dependencies identified and available

---

## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
  [YOUR_VALUE_HERE: What command verifies this?]

- [ ] CHK-011 [P0] No console errors or warnings
  [YOUR_VALUE_HERE: Environments to check]

- [ ] CHK-012 [P1] Error handling implemented
  [NEEDS CLARIFICATION: What error scenarios are covered?]

- [ ] CHK-013 [P1] Code follows project patterns
  [YOUR_VALUE_HERE: What patterns should be followed?]

---

## Testing

- [ ] CHK-020 [P0] All acceptance criteria met
  [YOUR_VALUE_HERE: Reference acceptance criteria from spec.md]

- [ ] CHK-021 [P0] Manual testing complete
  [YOUR_VALUE_HERE: What user flows were tested?]

- [ ] CHK-022 [P1] Edge cases tested
  [YOUR_VALUE_HERE: Reference spec.md L2: Edge Cases section]

- [ ] CHK-023 [P1] Error scenarios validated
  [YOUR_VALUE_HERE: What error scenarios were tested?]

---

## Security

- [ ] CHK-030 [P0] No hardcoded secrets
  [YOUR_VALUE_HERE: Verification method]

- [ ] CHK-031 [P0] Input validation implemented
  [YOUR_VALUE_HERE: What inputs are validated?]

- [ ] CHK-032 [P1] Auth/authz working correctly
  [YOUR_VALUE_HERE: What auth verification is needed?]

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

[YOUR_VALUE_HERE: Level 3 features require architecture decision verification.]

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md
  [YOUR_VALUE_HERE: Verify all significant decisions have ADR entries]
  [example: ADR-001 through ADR-003 documented covering data fetching, chart library, export strategy]

- [ ] CHK-101 [P1] All ADRs have status (Proposed/Accepted/Rejected)
  [YOUR_VALUE_HERE: Review each ADR for final status]
  [example: All 3 ADRs have status "Accepted" with implementation notes]

- [ ] CHK-102 [P1] Alternatives documented with rejection rationale
  [YOUR_VALUE_HERE: Verify rejected alternatives are documented]
  [NEEDS CLARIFICATION: Are alternatives sufficiently documented?
    (a) Yes - each ADR lists alternatives considered
    (b) Partial - some ADRs missing alternatives
    (c) No - need to add alternative analysis]

- [ ] CHK-103 [P2] Migration path documented (if applicable)
  [YOUR_VALUE_HERE: If this changes existing behavior, is migration documented?]
  [NEEDS CLARIFICATION: Is migration needed?
    (a) Yes - document migration steps
    (b) No - new feature, no migration needed
    (c) N/A - internal change only]

---

## L3: Performance Verification

[YOUR_VALUE_HERE: Level 3 features often have performance requirements (NFRs).]

- [ ] CHK-110 [P1] Response time targets met (NFR-P01)
  [YOUR_VALUE_HERE: Measure and document actual performance]
  [example: API responses measured at 145ms p95, target was <200ms p95]
  [NEEDS CLARIFICATION: How was performance measured?
    (a) Manual timing in browser DevTools
    (b) Automated load testing (specify tool)
    (c) Production monitoring after deployment
    (d) N/A - no performance NFRs for this feature]

- [ ] CHK-111 [P1] Throughput targets met (NFR-P02)
  [YOUR_VALUE_HERE: Verify under expected load]
  [example: Load tested with 100 concurrent users, no degradation observed]

- [ ] CHK-112 [P2] Load testing completed
  [YOUR_VALUE_HERE: Was load testing performed? Results?]
  [NEEDS CLARIFICATION: What load testing was done?
    (a) Full load test with realistic scenarios
    (b) Basic stress test
    (c) Manual multi-tab testing
    (d) Deferred - not required for initial release]

- [ ] CHK-113 [P2] Performance benchmarks documented
  [YOUR_VALUE_HERE: Are benchmarks recorded for future comparison?]
  [example: Baseline metrics documented in implementation-summary.md]

---

## L3: Deployment Readiness

[YOUR_VALUE_HERE: Level 3 features require deployment preparation verification.]

- [ ] CHK-120 [P0] Rollback procedure documented and tested
  [YOUR_VALUE_HERE: Verify rollback plan from plan.md works]
  [example: Tested feature flag toggle, dashboard disappears within 30 seconds]
  [NEEDS CLARIFICATION: How was rollback tested?
    (a) Full rollback simulation in staging
    (b) Feature flag toggle verified
    (c) Git revert procedure documented
    (d) Not yet tested - needs testing before production]

- [ ] CHK-121 [P0] Feature flag configured (if applicable)
  [YOUR_VALUE_HERE: What feature flag controls this?]
  [NEEDS CLARIFICATION: Is feature flag used?
    (a) Yes - specify flag name: [YOUR_VALUE_HERE]
    (b) No - full deployment
    (c) N/A - not a user-facing feature]

- [ ] CHK-122 [P1] Monitoring/alerting configured
  [YOUR_VALUE_HERE: What metrics are monitored?]
  [example: Dashboard error rate alert at >1%, latency alert at >3s]
  [NEEDS CLARIFICATION: What monitoring is in place?
    (a) Full monitoring - errors, latency, usage
    (b) Basic monitoring - error rate only
    (c) No monitoring - relying on existing infrastructure
    (d) TBD - monitoring to be configured before production]

- [ ] CHK-123 [P1] Runbook created
  [YOUR_VALUE_HERE: Is there a runbook for operational issues?]
  [NEEDS CLARIFICATION: Is runbook needed?
    (a) Yes - runbook created at [location]
    (b) No - using existing runbook for this service
    (c) N/A - no operational procedures needed]

- [ ] CHK-124 [P2] Deployment runbook reviewed
  [YOUR_VALUE_HERE: Has deployment procedure been reviewed?]

---

## L3: Compliance Verification

[YOUR_VALUE_HERE: Level 3 features may have compliance requirements.]

- [ ] CHK-130 [P1] Security review completed
  [YOUR_VALUE_HERE: Was security review performed?]
  [NEEDS CLARIFICATION: What security review is required?
    (a) Full security review by security team
    (b) Self-review using security checklist
    (c) Code review included security considerations
    (d) N/A - no security-sensitive changes]

- [ ] CHK-131 [P1] Dependency licenses compatible
  [YOUR_VALUE_HERE: Verify new dependencies have compatible licenses]
  [example: TanStack Query is MIT licensed, compatible with project]

- [ ] CHK-132 [P2] OWASP Top 10 checklist completed
  [YOUR_VALUE_HERE: Were OWASP vulnerabilities considered?]
  [NEEDS CLARIFICATION: OWASP review status?
    (a) Completed - no issues found
    (b) Completed - issues addressed (list them)
    (c) Not applicable - no user input/auth changes
    (d) Deferred - to be completed before production]

- [ ] CHK-133 [P2] Data handling compliant with requirements
  [YOUR_VALUE_HERE: Verify data handling meets any compliance requirements]
  [NEEDS CLARIFICATION: What compliance applies?
    (a) GDPR - user data handling verified
    (b) SOC2 - audit logging in place
    (c) HIPAA - no PHI involved
    (d) N/A - no compliance requirements]

---

## L3: Documentation Verification

[YOUR_VALUE_HERE: Level 3 features require comprehensive documentation.]

- [ ] CHK-140 [P1] All spec documents synchronized
  [YOUR_VALUE_HERE: Verify spec.md, plan.md, tasks.md, decision-record.md are consistent]

- [ ] CHK-141 [P1] API documentation complete (if applicable)
  [YOUR_VALUE_HERE: Are new APIs documented?]
  [NEEDS CLARIFICATION: Is API documentation needed?
    (a) Yes - new endpoints documented at [location]
    (b) No - using existing documented APIs only
    (c) N/A - no API changes]

- [ ] CHK-142 [P2] User-facing documentation updated
  [YOUR_VALUE_HERE: Does user documentation need updates?]

- [ ] CHK-143 [P2] Knowledge transfer documented
  [YOUR_VALUE_HERE: Is there documentation for team handoff?]
  [example: Key learnings documented in memory/ folder]

---

## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | [YOUR_VALUE_HERE: count] | [ ]/[YOUR_VALUE_HERE] |
| P1 Items | [YOUR_VALUE_HERE: count] | [ ]/[YOUR_VALUE_HERE] |
| P2 Items | [YOUR_VALUE_HERE: count] | [ ]/[YOUR_VALUE_HERE] |

**Verification Date**: [YOUR_VALUE_HERE: YYYY-MM-DD]

**Verified By**: [YOUR_VALUE_HERE: Name or AI agent identifier]

---

## Deferred Items Log

[YOUR_VALUE_HERE: Document any P1/P2 items that were deferred. P1 requires approval.]

| Item | Priority | Reason | Approval (P1 only) |
|------|----------|--------|-------------------|
| [YOUR_VALUE_HERE: CHK-###] | [P1/P2] | [YOUR_VALUE_HERE: Why deferred] | [YOUR_VALUE_HERE: Who approved, or N/A for P2] |

---

## L3: Sign-Off

[YOUR_VALUE_HERE: Level 3 features require formal sign-off before claiming complete.]

| Approver | Role | Status | Date |
|----------|------|--------|------|
| [YOUR_VALUE_HERE: Name] | Technical Lead | [ ] Approved | |
| [YOUR_VALUE_HERE: Name] | Product Owner | [ ] Approved | |
| [YOUR_VALUE_HERE: Name] | QA Lead | [ ] Approved | |

[NEEDS CLARIFICATION: What sign-offs are required?
  (a) All three: Technical, Product, QA
  (b) Technical and Product only
  (c) Technical only
  (d) Self-approval acceptable]

---

<!--
VERBOSE LEVEL 3 TEMPLATE - VERIFICATION CHECKLIST (~350 lines)
- Extended guidance with [YOUR_VALUE_HERE], [NEEDS CLARIFICATION], and [example] patterns
- Level 3: Large features (500+ LOC), complex/architecture changes
- Includes L3 addendum sections: Architecture, Performance, Deployment, Compliance verification
- Requires formal sign-off before completion
- After completion, summary section provides quick status overview
-->
