# Feature Specification: [YOUR_VALUE_HERE: Feature-Name]

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-level3plus-verbose | v2.0-verbose -->

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3+ (500+ LOC with governance) |
| **Priority** | [NEEDS CLARIFICATION: What is the implementation priority? (a) P0 - HARD BLOCKER, must complete before launch (b) P1 - Must complete OR user-approved deferral (c) P2 - Can defer without approval, nice-to-have] |
| **Status** | [YOUR_VALUE_HERE: Draft / In Progress / Review / Complete] |
| **Created** | [YOUR_VALUE_HERE: YYYY-MM-DD format] |
| **Branch** | `[YOUR_VALUE_HERE: ###-feature-name, e.g., 042-user-auth]` |

---

## L3: EXECUTIVE SUMMARY

[YOUR_VALUE_HERE: 2-3 sentence high-level overview for stakeholders who need quick context. Level 3+ features require executive summary due to complexity.]

[example: This feature implements a comprehensive metrics dashboard enabling users to track API usage, set alerts, and export data for analysis. It addresses the #1 support ticket driver (billing questions) and is critical for enterprise customer retention. Expected to reduce support load by 50% and improve NPS by 10 points.]

**Key Decisions**:
- [YOUR_VALUE_HERE: Major architectural or technical decision 1]
- [YOUR_VALUE_HERE: Major architectural or technical decision 2]

**Critical Dependencies**:
- [YOUR_VALUE_HERE: Blocking dependency 1 - what happens if unavailable]
- [YOUR_VALUE_HERE: Blocking dependency 2 - what happens if unavailable]

**Timeline**: [YOUR_VALUE_HERE: Expected duration, key milestones, or target date]

---

## L3+: APPROVAL WORKFLOW

[YOUR_VALUE_HERE: Level 3+ features require formal approval workflow tracking.]

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Spec Review | [YOUR_VALUE_HERE: Role/Name responsible for approving spec] | [NEEDS CLARIFICATION: (a) Pending (b) Approved (c) Changes Requested] | [YOUR_VALUE_HERE: Date or "TBD"] |
| Design Review | [YOUR_VALUE_HERE: Role/Name responsible for design approval] | [Pending/Approved/Changes Requested] | [YOUR_VALUE_HERE: Date or "TBD"] |
| Implementation Review | [YOUR_VALUE_HERE: Role/Name - usually Tech Lead] | [Pending/Approved/Changes Requested] | [YOUR_VALUE_HERE: Date or "TBD"] |
| Launch Approval | [YOUR_VALUE_HERE: Role/Name - usually Product Owner] | [Pending/Approved/Changes Requested] | [YOUR_VALUE_HERE: Date or "TBD"] |

[example:
| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Spec Review | @product-lead | Approved | 2024-01-10 |
| Design Review | @design-lead | Pending | TBD |
| Implementation Review | @tech-lead | Pending | TBD |
| Launch Approval | @product-owner | Pending | TBD |]

---

## L3+: COMPLIANCE CHECKPOINTS

[YOUR_VALUE_HERE: Level 3+ features often have compliance requirements. Track them explicitly.]

### Security Compliance

- [ ] Security review completed
  [NEEDS CLARIFICATION: What security review is required?
    (a) Full review by security team
    (b) Self-review using security checklist
    (c) N/A - no security-sensitive changes]
- [ ] OWASP Top 10 addressed
  [YOUR_VALUE_HERE: Which OWASP items apply to this feature?]
- [ ] Data protection requirements met
  [NEEDS CLARIFICATION: What data protection applies?
    (a) GDPR compliance required
    (b) SOC2 audit logging
    (c) HIPAA requirements
    (d) N/A - no regulated data]

### Code Compliance

- [ ] Coding standards followed
  [YOUR_VALUE_HERE: Which coding standards apply?]
- [ ] License compliance verified
  [YOUR_VALUE_HERE: Verify new dependencies have compatible licenses]
- [ ] Dependency audit completed
  [YOUR_VALUE_HERE: Check for vulnerabilities in dependencies]

### Documentation Compliance

- [ ] API documentation complete
  [NEEDS CLARIFICATION: Is API documentation required?
    (a) Yes - new APIs need documentation
    (b) No - using existing documented APIs
    (c) N/A - no API changes]
- [ ] User documentation updated
  [YOUR_VALUE_HERE: What user-facing documentation needs updates?]
- [ ] Runbook created
  [NEEDS CLARIFICATION: Is operational runbook needed?
    (a) Yes - new operational procedures
    (b) No - existing runbooks cover this
    (c) N/A - no operational impact]

---

## L3+: STAKEHOLDER MATRIX

[YOUR_VALUE_HERE: Level 3+ features affect multiple stakeholders. Document them for communication planning.]

| Stakeholder | Role | Interest | Communication |
|-------------|------|----------|---------------|
| [YOUR_VALUE_HERE: Name or title] | [YOUR_VALUE_HERE: Product/Engineering/QA/etc.] | [NEEDS CLARIFICATION: Interest level? (a) High - actively involved (b) Medium - informed (c) Low - FYI only] | [YOUR_VALUE_HERE: How and when to communicate, e.g., "Weekly sync", "Slack updates"] |
| [YOUR_VALUE_HERE: Name or title] | [YOUR_VALUE_HERE: Role] | [High/Medium/Low] | [YOUR_VALUE_HERE: Communication method] |
| [YOUR_VALUE_HERE: Name or title] | [YOUR_VALUE_HERE: Role] | [High/Medium/Low] | [YOUR_VALUE_HERE: Communication method] |

[example:
| Stakeholder | Role | Interest | Communication |
|-------------|------|----------|---------------|
| @product-lead | Product | High | Weekly sync, Slack updates |
| @tech-lead | Engineering Lead | High | Daily standup, PR reviews |
| @qa-lead | QA | Medium | Test reviews, bug triage |
| @support-lead | Support | Medium | Feature preview, training |
| @ceo | Executive | Low | Launch announcement only |]

---

## 2. PROBLEM & PURPOSE

### Problem Statement

[YOUR_VALUE_HERE: Describe the specific problem, pain point, or gap that this feature addresses. What is broken, missing, or inefficient today? Be specific about user impact. 2-3 sentences.]

### Purpose

[YOUR_VALUE_HERE: One-sentence outcome statement describing what this achieves. Keep technology-agnostic and focus on user/business value.]

---

## 3. SCOPE

### In Scope

- [YOUR_VALUE_HERE: Specific deliverable 1]
- [YOUR_VALUE_HERE: Specific deliverable 2]
- [YOUR_VALUE_HERE: Specific deliverable 3]

### Out of Scope

- [YOUR_VALUE_HERE: Excluded item 1] - [reason]
- [YOUR_VALUE_HERE: Excluded item 2] - [reason]

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| [YOUR_VALUE_HERE: path/to/file.js] | [Create/Modify/Delete] | [YOUR_VALUE_HERE: Description] |

---

## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | [YOUR_VALUE_HERE: Requirement] | [YOUR_VALUE_HERE: Criteria] |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | [YOUR_VALUE_HERE: Requirement] | [YOUR_VALUE_HERE: Criteria] |

### Requirements Needing Clarification

- **REQ-005**: [NEEDS CLARIFICATION: Question with options]

---

## 5. SUCCESS CRITERIA

- **SC-001**: [YOUR_VALUE_HERE: Measurable outcome]
- **SC-002**: [YOUR_VALUE_HERE: Measurable outcome]

---

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | [YOUR_VALUE_HERE: Dependency] | [YOUR_VALUE_HERE: Impact] | [YOUR_VALUE_HERE: Mitigation] |
| Risk | [YOUR_VALUE_HERE: Risk] | [H/M/L] | [YOUR_VALUE_HERE: Mitigation] |

---

## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: [YOUR_VALUE_HERE: Response time target]
- **NFR-P02**: [YOUR_VALUE_HERE: Throughput target]

### Security

- **NFR-S01**: [YOUR_VALUE_HERE: Authentication requirement]
- **NFR-S02**: [YOUR_VALUE_HERE: Data protection requirement]

### Reliability

- **NFR-R01**: [YOUR_VALUE_HERE: Uptime target]
- **NFR-R02**: [YOUR_VALUE_HERE: Error rate target]

---

## L2: EDGE CASES

### Data Boundaries

- **Empty input**: [YOUR_VALUE_HERE]
- **Maximum length**: [YOUR_VALUE_HERE]
- **Invalid format**: [YOUR_VALUE_HERE]

### Error Scenarios

- **External service failure**: [YOUR_VALUE_HERE]
- **Network timeout**: [YOUR_VALUE_HERE]
- **Concurrent access**: [YOUR_VALUE_HERE]

### State Transitions

- **Partial completion**: [YOUR_VALUE_HERE]
- **Session expiry**: [YOUR_VALUE_HERE]

---

## L3: FULL COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | [YOUR_VALUE_HERE: /25] | [YOUR_VALUE_HERE: Files, LOC, Systems] |
| Risk | [YOUR_VALUE_HERE: /25] | [YOUR_VALUE_HERE: Auth, API, Breaking] |
| Research | [YOUR_VALUE_HERE: /20] | [YOUR_VALUE_HERE: Investigation needs] |
| Multi-Agent | [YOUR_VALUE_HERE: /15] | [YOUR_VALUE_HERE: Workstreams] |
| Coordination | [YOUR_VALUE_HERE: /15] | [YOUR_VALUE_HERE: Dependencies] |
| **Total** | **[YOUR_VALUE_HERE: /100]** | **Level 3+ (50+ with governance)** |

---

## L3: RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation | Owner |
|---------|-------------|--------|------------|------------|-------|
| R-001 | [YOUR_VALUE_HERE: Risk] | [H/M/L] | [H/M/L] | [YOUR_VALUE_HERE: Strategy] | [YOUR_VALUE_HERE: Owner] |
| R-002 | [YOUR_VALUE_HERE: Risk] | [H/M/L] | [H/M/L] | [YOUR_VALUE_HERE: Strategy] | [YOUR_VALUE_HERE: Owner] |

---

## L3: USER STORIES (Extended)

### US-001: [YOUR_VALUE_HERE: Title] (Priority: P0)

**As a** [user type], **I want** [capability], **so that** [benefit].

**Acceptance Criteria**:
1. Given [context], When [action], Then [outcome]

**Independent Test**: [YOUR_VALUE_HERE: How to verify]

---

## L3+: CHANGE LOG

[YOUR_VALUE_HERE: Track changes to this specification over time. Level 3+ features evolve and need change tracking.]

### v1.0 ([YOUR_VALUE_HERE: Date])
**Initial specification**

[YOUR_VALUE_HERE: Brief description of initial version scope]

<!--
### v1.1 ([Date])
**Summary**: [Brief description of changes]

**ADDED**:
- [New requirement or scope item]

**MODIFIED**:
- [Changed requirement] - Reason: [Why changed]

**REMOVED**:
- [Removed requirement] - Reason: [Why removed]
-->

---

## 7. OPEN QUESTIONS

- [NEEDS CLARIFICATION: Question 1]
- [NEEDS CLARIFICATION: Question 2]

---

## 8. ASSUMPTIONS

- [YOUR_VALUE_HERE: Assumption 1]
- [YOUR_VALUE_HERE: Assumption 2]

---

<!--
VERBOSE LEVEL 3+ TEMPLATE - SPECIFICATION (~500 lines)
- Extended guidance with [YOUR_VALUE_HERE], [NEEDS CLARIFICATION], and [example] patterns
- Level 3+: Large features with governance (500+ LOC, formal approval, compliance)
- Includes L2 + L3 + L3+ addendum sections: Approval Workflow, Compliance Checkpoints, Stakeholder Matrix, Change Log
- Use for major initiatives requiring formal governance
- After completion, can be simplified to core format by removing guidance
-->
