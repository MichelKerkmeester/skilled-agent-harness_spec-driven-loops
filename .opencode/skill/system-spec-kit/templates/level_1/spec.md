# Feature Specification: [NAME]

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.0 -->

<!-- WHEN TO USE THIS TEMPLATE:
Level 1 (Core) is appropriate when:
- Changes affect <100 lines of code
- Simple feature or bug fix with clear scope
- Single developer, single session work
- Low risk, well-understood change
- No architectural decisions required
- 1-2 user stories maximum

DO NOT use Level 1 if:
- Multiple stakeholders need alignment
- Verification checklist would help QA
- Complex edge cases exist
- Architecture decisions are involved (use Level 3)
- Governance/compliance required (use Level 3+)
-->

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | [P0/P1/P2] |
| **Status** | [Draft/In Progress/Review/Complete] |
| **Created** | [YYYY-MM-DD] |
| **Branch** | `[###-feature-name]` |

---

## 2. PROBLEM & PURPOSE

### Problem Statement
[What is broken, missing, or inefficient? 2-3 sentences describing the specific pain point.]

### Purpose
[One-sentence outcome statement. What does success look like?]

---

## 3. SCOPE

### In Scope
- [Deliverable 1]
- [Deliverable 2]
- [Deliverable 3]

### Out of Scope
- [Excluded item 1] - [why]
- [Excluded item 2] - [why]

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| [path/to/file.js] | [Modify/Create/Delete] | [Brief description] |

---

## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | [Requirement description] | [How to verify it's done] |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | [Requirement description] | [How to verify it's done] |

---

## 5. SUCCESS CRITERIA

- **SC-001**: [Primary measurable outcome]
- **SC-002**: [Secondary measurable outcome]

---

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | [System/API] | [What if blocked] | [Fallback plan] |
| Risk | [Risk description] | [High/Med/Low] | [Mitigation strategy] |

---

## 7. OPEN QUESTIONS

- [Question 1 requiring clarification]
- [Question 2 requiring clarification]

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|----------|---------|
| [`plan.md`](./plan.md) | Implementation approach and phases |
| [`tasks.md`](./tasks.md) | Detailed task breakdown |
| [`implementation-summary.md`](./implementation-summary.md) | Post-implementation record |

---

<!--
CORE TEMPLATE (~95 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
