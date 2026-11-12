---
title: "Feature Specification: Phase 4: recommendation-contract-and-brief"
description: "[YOUR_VALUE_HERE: What is broken, missing, or inefficient? 2-3 sentences describing the specific pain point.]"
trigger_phrases:
  - "recommendation contract and brief"
  - "phase 4 recommendation contract and brief"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3-plus-govern | v2.4 -->
<!-- SPECKIT_LEVEL: 3+ -->
# Feature Specification: Phase 4: recommendation-contract-and-brief



---

## EXECUTIVE SUMMARY
<!-- FILL: Write three sentences: the problem, the change and the proof. GOOD: Nothing deletes old archives, so `logs/archive` grows without limit. The `--keep <n>` option keeps only the newest n. With 10 archives, `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: This document describes the feature. -->

[2-3 sentence high-level overview for stakeholders who need quick context]

**Key Decisions**: [YOUR_VALUE_HERE: Major decision 1], [YOUR_VALUE_HERE: Major decision 2]

**Critical Dependencies**: [YOUR_VALUE_HERE: Blocking dependency]

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | [YOUR_VALUE_HERE: P0/P1/P2] |
| **Status** | Draft |
| **Created** | 2026-11-12 |
| **Branch** | `scaffold/004-recommendation-contract-and-brief` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 6 |
| **Predecessor** | 003-plain-chat-command-reach |
| **Successor** | 005-gate-2-binding-and-runtime-pointers |
| **Handoff Criteria** | [To be defined during planning] |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Build command surfacing in the skill advisor so every tracked slash command reaches the model with a run-or-ask policy and a chat-only request reaches a proper workflow specification.

**Scope Boundary**: [To be defined during planning]

**Dependencies**:
- [To be defined during planning]

**Deliverables**:
- [To be defined during planning]
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
[YOUR_VALUE_HERE: What is broken, missing, or inefficient? 2-3 sentences describing the specific pain point.]

### Purpose
[YOUR_VALUE_HERE: One-sentence outcome statement. What does success look like?]
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
[YOUR_VALUE_HERE: command and its verbatim output]
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- [YOUR_VALUE_HERE: Deliverable 1]
- [YOUR_VALUE_HERE: Deliverable 2]
- [YOUR_VALUE_HERE: Deliverable 3]

### Out of Scope
- [YOUR_VALUE_HERE: Excluded item 1] - [YOUR_VALUE_HERE: why]
- [YOUR_VALUE_HERE: Excluded item 2] - [YOUR_VALUE_HERE: why]

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| [YOUR_VALUE_HERE: path/to/file.js] | [YOUR_VALUE_HERE: Modify/Create/Delete] | [YOUR_VALUE_HERE: Brief description] |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | [YOUR_VALUE_HERE: Requirement description] |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | [YOUR_VALUE_HERE: Requirement description] |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: [YOUR_VALUE_HERE: Primary measurable outcome]
- **SC-002**: [YOUR_VALUE_HERE: Secondary measurable outcome]
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | [YOUR_VALUE_HERE: System/API] | [YOUR_VALUE_HERE: What if blocked] | [YOUR_VALUE_HERE: Fallback plan] |
| Risk | [YOUR_VALUE_HERE: Risk description] | [YOUR_VALUE_HERE: High/Med/Low] | [YOUR_VALUE_HERE: Mitigation strategy] |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->

### Performance
- **NFR-P01**: [YOUR_VALUE_HERE: Response time target]

### Security
- **NFR-S01**: [YOUR_VALUE_HERE: Auth requirement]

### Reliability
- **NFR-R01**: [YOUR_VALUE_HERE: Uptime target]

---

## 8. EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: [YOUR_VALUE_HERE: How system handles]
- Maximum input: [YOUR_VALUE_HERE: Limit and behavior]
- Failure path: [YOUR_VALUE_HERE: Exit code and message]

---

## 9. COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | [YOUR_VALUE_HERE: /25] | [YOUR_VALUE_HERE: Files: X, LOC: Y, Systems: Z] |
| Risk | [YOUR_VALUE_HERE: /25] | [YOUR_VALUE_HERE: Auth: Y/N, API: Y/N, Breaking: Y/N] |
| Research | [YOUR_VALUE_HERE: /20] | [YOUR_VALUE_HERE: Investigation needs] |
| Multi-Agent | [YOUR_VALUE_HERE: /15] | [YOUR_VALUE_HERE: Workstreams: X] |
| Coordination | [YOUR_VALUE_HERE: /15] | [YOUR_VALUE_HERE: Dependencies: X] |
| **Total** | **[YOUR_VALUE_HERE: /100]** | **Level 3+** |

---

## 10. RISK MATRIX
<!-- FILL: List each risk with impact, likelihood and one mitigation. GOOD: R1: a missing `--keep` value deletes every archive. Impact H, likelihood L. Mitigation: a test pins exit 2 before any delete. WEAK: Some risks exist. -->

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | [YOUR_VALUE_HERE: Risk] | [YOUR_VALUE_HERE: H/M/L] | [YOUR_VALUE_HERE: H/M/L] | [YOUR_VALUE_HERE: Strategy] |

---

## 11. USER STORIES
<!-- FILL: Write one story per user. Name the actor, the want and the benefit. GOOD: As a backup host, I want `--keep 3` to leave 3 archives, so that `logs/archive` stays under its quota. WEAK: Users want the feature. -->

### US-001: [YOUR_VALUE_HERE: Title] (Priority: P0)

**As a** [YOUR_VALUE_HERE: user type], **I want** [YOUR_VALUE_HERE: needed behavior], **so that** [YOUR_VALUE_HERE: benefit].

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:approval-workflow -->
## 12. APPROVAL WORKFLOW
<!-- FILL: Name the real approver for each checkpoint and the date it passed. GOOD: Spec review: operator, 2026-10-24. WEAK: Approvals pending. -->

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Spec Review | [YOUR_VALUE_HERE: Role/Name] | [YOUR_VALUE_HERE: Pending/Approved] | [YOUR_VALUE_HERE: Date] |
| Design Review | [YOUR_VALUE_HERE: Role/Name] | [YOUR_VALUE_HERE: Pending/Approved] | [YOUR_VALUE_HERE: Date] |
| Implementation Review | [YOUR_VALUE_HERE: Role/Name] | [YOUR_VALUE_HERE: Pending/Approved] | [YOUR_VALUE_HERE: Date] |
| Launch Approval | [YOUR_VALUE_HERE: Role/Name] | [YOUR_VALUE_HERE: Pending/Approved] | [YOUR_VALUE_HERE: Date] |
<!-- /ANCHOR:approval-workflow -->

---

<!-- ANCHOR:compliance-checkpoints -->
## 13. COMPLIANCE CHECKPOINTS
<!-- FILL: Mark each box or write `N/A` with one reason. Never leave the template wording. GOOD: Mark N/A with the reason: the option reads no user data and opens no socket. WEAK: Compliance checked. -->

### Security Compliance
- [ ] Security review completed
- [ ] OWASP Top 10 addressed
- [ ] Data protection requirements met

### Code Compliance
- [ ] Coding standards followed
- [ ] License compliance verified
<!-- /ANCHOR:compliance-checkpoints -->

---

<!-- ANCHOR:stakeholder-matrix -->
## 14. STAKEHOLDER MATRIX
<!-- FILL: Name each stakeholder, their interest and how you update them. GOOD: Build team, high interest, weekly note. WEAK: Stakeholders informed. -->

| Stakeholder | Role | Interest | Communication |
|-------------|------|----------|---------------|
| [YOUR_VALUE_HERE: Name] | Product | High | [YOUR_VALUE_HERE: Weekly sync] |
| [YOUR_VALUE_HERE: Name] | Engineering | High | [YOUR_VALUE_HERE: Daily standup] |
<!-- /ANCHOR:stakeholder-matrix -->

---

<!-- ANCHOR:change-log -->
## 15. CHANGE LOG
<!-- FILL: Add one row per version with the date and the change. GOOD: v1.0 2026-10-24: added `--keep <n>`. WEAK: Initial version. -->

### v1.0 ([YOUR_VALUE_HERE: Date])
**Initial specification**
<!-- /ANCHOR:change-log -->

---

<!-- ANCHOR:questions -->
## 16. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- [YOUR_VALUE_HERE: Question 1 requiring clarification]
- [YOUR_VALUE_HERE: Question 2 requiring clarification]
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
<!-- FILL: Leave the three links in place. Add `decision-record.md` when the packet has one. GOOD: Plan: See `plan.md`. WEAK: See the other docs. -->

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`

---

