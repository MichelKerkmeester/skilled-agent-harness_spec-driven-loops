---
title: "Feature Specification: Phase 1: roster-completeness"
description: "Every prose roster in the three hubs names the executor kinds the code registers and the modes the registry holds, with counts replaced by their source where one exists."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: roster-completeness

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-09-15 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 9 |
| **Predecessor** | 001-angle-driven-review |
| **Successor** | 003-version-authority |
| **Handoff Criteria** | [To be defined during planning] |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Remediate the alignment review findings specification.

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
The external orchestration router listed six CLI kinds in its opening parenthetical, its leaf-set bullets and its disambiguation rule while its own machine block and the registry carried seven; its skill file said six modes in one line and seven in four others. The deep-loop protocols named three adapters, and the runtime fan-out catalog claimed three kinds while naming one of them twice, displacing another. The review rated the router omission its only P0.

### Purpose
No document states a roster or count that its own registry or the executor config contradicts.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The router's opening parenthetical, its seventh leaf bullet and its disambiguation rule
- The skill file's one contradicting mode count
- Both loop protocols' fan-out adapter lists
- The runtime fan-out catalog's kind list and count
- Regenerated compiled contracts for the edited protocol digests

### Out of Scope
- Version fields - the next phase owns them
- The hub write-containment catalog - it carries no executor roster to correct

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/cli-external-orchestration/ROUTER.md` | Modify | Seventh kind in the parenthetical, the leaf bullets and the disambiguation rule |
| `.opencode/skills/cli-external-orchestration/SKILL.md` | Modify | The contradicting count replaced by its registry source |
| `.opencode/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md, deep-research/.../loop-protocol.md` | Modify | Adapter lists naming every kind, sourced to the executor config |
| `.opencode/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md` | Modify | Kind list corrected, duplicate name removed, count replaced by its source |
| `.opencode/commands/deep/assets/compiled/deep-review.contract.md, deep-research.contract.md` | Regenerate | Digest the edited protocols |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every prose roster in the router, the skill file, both protocols and the runtime catalog names the same kinds the executor config registers |
| REQ-002 | No document states a mode or kind count its own registry contradicts; a count that can name its source does |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The compiled contracts are regenerated for every edited file they digest |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The router names the seventh kind in every roster statement, not only its machine block
- **SC-002**: Contract drift tests and the deep-loop suite exit zero
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A roster freezes again at the next kind | Med | Where a document can name the executor config as its source it does, so the next kind needs no prose edit there |
| Dependency | The executor config as authority | Green | Eight entries: native plus seven CLI kinds |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Not applicable

### Security
- **NFR-S01**: Not applicable

### Reliability
- **NFR-R01**: The compiled contracts match the edited protocol bytes
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A document that counts rather than lists: replaced by its source where one exists
- The native kind: counted in the executor config, not a CLI kind

### Error Scenarios
- Contract stale after a protocol edit: the drift test fails until regenerated

### State Transitions
- Not applicable
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | Five prose files, two contracts |
| Risk | 4/25 | Documentation of what the code already does |
| Research | 3/20 | Finding located by the review, verified against the registry |
| **Total** | **13/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None open.
<!-- /ANCHOR:questions -->

---


