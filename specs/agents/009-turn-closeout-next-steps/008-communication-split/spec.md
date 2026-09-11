---
title: "Feature Specification: Phase 1: communication-split"
description: "Split communication.md two ways: prose craft keeps the file and its broad trigger, and the decision-shape sections move to a new rule with a narrower trigger."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: communication-split

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | [P0/P1/P2] |
| **Status** | Complete |
| **Created** | 2026-09-11 |
| **Branch** | `scaffold/008-communication-split` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 8 |
| **Predecessor** | 007-progress-updates |
| **Successor** | None |
| **Handoff Criteria** | [To be defined during planning] |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the Split communication.md into prose craft and presenting decisions specification.

**Scope Boundary**: [To be defined during planning]

**Dependencies**:
- [To be defined during planning]

**Deliverables**:
- [To be defined during planning]

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`communication.md` bundled three different trigger conditions under one. Sections 1 to 6 govern how every reply reads and need the broad trigger the file argues for. Sections 7 to 9 govern the shape of a decision and fire only when there is a recommendation, a fork or an ambiguous request, so they were loading on every three-line answer that contained neither.

The length ceiling made it urgent rather than merely untidy. Two proposals in this packet were shaped by the file sitting at 244 lines against a 250-line ceiling rather than by their merits, and an edit settling the human-voice boundary pushed it to 251.

### Purpose
Split it so each half carries its own trigger, and so the rule set stops refusing content on a line count.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Move sections 7 to 9 out of `communication.md` into a new rule
- Renumber and reconcile what remains, including stale cross-references
- Move the trigger phrases that belong to the moved sections, so nothing collides
- Wire the new rule: trigger row, index row, and pointers in every governed section
- Keep the doctrine unchanged; this is a relocation, not a rewrite

### Out of Scope
- Changing what any of the moved sections say. The text moves verbatim except where a section number had to change
- Splitting any other rule. One file reached its ceiling, the rest have not

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `repo-rules/presenting-decisions.md` | Create | The new rule, 156 lines, preferred band |
| `repo-rules/communication.md` | Modify | 251 to 193 lines; sections excised, survivors renumbered, phrases and cross-references reconciled |
| `REPO RULES.md` | Modify | Trigger row and index row added; the communication rows narrowed to what the file still governs |
| `AGENTS.md` | Modify | Pointers in sections 3, 8 and 10 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Both files sit inside a length band, and neither is over the ceiling |
| REQ-002 | Zero trigger-phrase collisions across the whole rule set |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Dividers equal numbered sections in both files |
| REQ-004 | No cross-reference points at a section number that moved |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Rule files, trigger rows and index rows are all the same count
- **SC-002**: Every link in the router and in `AGENTS.md` resolves
- **SC-003**: The moved doctrine reads the same as before the move
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A split narrows a trigger and the moved content goes quiet | High | Sections 1 to 6 keep the broad trigger; only the sections that were over-triggering moved |
| Risk | Trigger phrases collide between the two files | Medium | Phrases moved with their sections and the whole set was re-checked, 194 phrases, zero collisions |
| Risk | Renumbering leaves dangling cross-references | Medium | Grepped for stale section references after the renumber |
| Risk | The set grows because splitting is easy | Low | One file reached its ceiling; no other rule was touched |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: [Response time target - e.g., <200ms p95]
- **NFR-P02**: [Throughput target - e.g., 100 req/sec]

### Security
- **NFR-S01**: [Auth requirement - e.g., JWT tokens required]
- **NFR-S02**: [Data protection - e.g., TLS + encrypted at rest]

### Reliability
- **NFR-R01**: [Uptime target - e.g., 99.9%]
- **NFR-R02**: [Error rate - e.g., <1%]
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: [How system handles]
- Maximum length: [Limit and behavior]
- Invalid format: [Validation response]

### Error Scenarios
- External service failure: [Fallback behavior]
- Network timeout: [Retry strategy]
- Concurrent access: [Conflict resolution]

### State Transitions
- Partial completion: [Recovery behavior]
- Session expiry: [User experience]
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | [/25] | [Files, LOC, systems] |
| Risk | [/25] | [Auth, API, breaking changes] |
| Research | [/20] | [Investigation needs] |
| **Total** | **[/70]** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. The operator approved the split, the two-way shape and the timing before it ran.
<!-- /ANCHOR:questions -->

---


