---
title: "Feature Specification: Phase 2: format decision"
description: "Freeze the commit grammar, the identifier rule, the stamping mechanics, the retrofit mapping and the repo-rule verdict in a decision record the operator approves before any hook or skill edit."
trigger_phrases:
  - "commit grammar decision"
  - "format decision phase"
  - "commit-id ordinal decision"
  - "operator approval grammar"
importance_tier: "critical"
contextType: "decision"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 2: format decision

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

Phase 001 produced a grammar from one model. This phase argued against it with a second model family, let the repository settle the disagreements, and put five decisions in front of the operator. All five are approved, and phase 003 builds on them.

**Key Decisions**: repository-wide ordinal in `Commit-Id:`, full packet path in `Spec:`, hook whitelist before stamper, re-mint on cherry-pick, no new repo rule

**Critical Dependencies**: `../001-research/research/research.md`

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-09-11 |
| **Branch** | `worktrees/048-crawlable-commit-history` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 7 |
| **Predecessor** | 001-research |
| **Successor** | 003-contract-and-hook |
| **Handoff Criteria** | decision-record.md carries five Accepted decisions and an operator approval line for each |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Crawlable Commit History specification.

**Scope Boundary**: decisions only. No hook, skill or history file changes.

**Dependencies**:
- `../001-research/research/research.md` and the lineage iterations
- An adversarial review by a second model family, briefed to break the proposal

**Deliverables**:
- `decision-record.md` with five decisions, alternatives, consequences and the operator's answers

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
One model's design is one opinion. The research proposed a packet-derived identifier that reads well and is wrong for this repository: 15 track-number prefixes name two packets, and a third of commits belong to no packet. Those defects only surface when someone is told to find them.

### Purpose
Freeze a grammar that survived an attack, with the operator's approval recorded, so phases 003 to 006 implement a contract and not a draft.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The identifier shape and where the packet pointer lives
- The hook change and its order against the stamper
- The stamper's paragraph rule and the cherry-pick policy
- The retrofit mapping refinements
- Whether a git repo rule is needed

### Out of Scope
- Writing any of it - phases 003 to 006
- The rewrite window and its push - phase 005 and the operator's yes at that moment

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `decision-record.md` | Create | Five decisions with the operator's answers |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A second model family reviews the grammar before the operator sees it |
| REQ-002 | Every decision names its alternatives and the evidence that decided it |
| REQ-003 | The operator's answer is recorded per decision with a date |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The repo-rule question gets a verdict with reasons |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: five decisions with status Accepted and an approval row each
- **SC-002**: at least one research recommendation reversed on evidence, recorded with the evidence
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The reviewer agrees with everything | No second lens | The brief named specific attacks and demanded evidence |
| Risk | The operator is asked more than needed | Delay | Only the two preference forks were asked; the rest bundled |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Not applicable

### Security
- **NFR-S01**: The reviewer ran read-only

### Reliability
- **NFR-R01**: Every reversed recommendation cites the command or file that reversed it

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: a review with no objections would have been rerun with a narrower brief
- Maximum length: five decisions, no more

### Error Scenarios
- External service failure: not applicable
- Network timeout: not applicable

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 5/25 | Files: 1, LOC: 0, Systems: 0 |
| Risk | 15/25 | Every later phase depends on it |
| Research | 15/20 | Second lens over ten iterations |
| Multi-Agent | 10/15 | One reviewer dispatch |
| Coordination | 10/15 | Operator gate |
| **Total** | **55/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A decision is wrong and phase 003 builds on it | H | L | Each decision names its rollback |

---

## 11. USER STORIES

### US-001: Approve a grammar that was attacked (Priority: P0)

**As the** operator, **I want** the proposal argued against before I approve it, **so that** I am not the first reviewer.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Know whether a repo rule is needed (Priority: P1)

**As the** operator, **I want** a verdict with reasons, **so that** the rule set does not grow by reflex.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`

---
