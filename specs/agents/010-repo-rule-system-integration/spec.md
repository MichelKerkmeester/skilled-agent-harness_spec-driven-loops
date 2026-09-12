---
title: "Feature Specification: Extend the repo-rule system across the wider system and shrink AGENTS.md where content no longer earns a full writeup"
description: "Three-lineage research into how the repo-rule system should extend across the wider system, and which parts of AGENTS.md no longer earn a full writeup in an always-loaded document."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Extend the repo-rule system across the wider system and shrink AGENTS.md where content no longer earns a full writeup

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

[2-3 sentence high-level overview for stakeholders who need quick context]

**Key Decisions**: [Major decision 1], [Major decision 2]

**Critical Dependencies**: [Blocking dependency]

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | [P0/P1/P2] |
| **Status** | Draft |
| **Created** | 2026-09-11 |
| **Branch** | `scaffold/010-repo-rule-system-integration` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The rule set grew to eleven files in a few days, and every proposal so far was decided by one constraint discovered mid-flight rather than by design: Gate 5 fires on the first write of a session and never on a read-only turn, so a rule file goes silent exactly when someone is only reading. Three proposals were settled by that fact. Nobody has asked what the rule set should look like knowing it up front.

`AGENTS.md` is the always-loaded document every runtime reads on every turn, and it is 501 lines. Some of that content is there because it has always been there, not because it earns being fully written out in a document that costs context on every single turn.

### Purpose
Ask three independent model families what the system actually justifies, rather than deciding it from one reading. Produce a ranked set of recommendations and an explicit set of refusals, each naming the test that decided it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Twenty research iterations across three lineages, none allowed to stop early
- What new rules the skills and system surfaces justify, refusals included
- Which existing rules need changing
- Where cross-skill or cross-system integration is missing
- What can be cut, compressed or relocated out of `AGENTS.md`
- A fresh synthesis across all three lineages that reconciles agreement and names disagreement

### Out of Scope
- Drafting rule text. Research decides what should exist, a later pass writes it
- Editing anything outside each lineage's own directory
- Removing the restraint signals table or the confidence bands. Both look duplicated and are the only copy

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/lineages/*/research.md` | Create | One synthesis per lineage |
| `research/` state, deltas, iterations | Create | Loop evidence proving the iterations ran |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Each lineage runs its full iteration count with no convergence stop |
| REQ-002 | Every claim carries a `file:line` citation that resolves |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Each proposal is run through the four decision tests, and refusals are kept |
| REQ-004 | A fresh synthesis reconciles the three lineages rather than averaging them |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Twenty iterations of loop evidence, not three single passes
- **SC-002**: Recommendations are ranked, and every refusal names its deciding test
- **SC-003**: The three lineages disagree somewhere, and the disagreement is named rather than smoothed
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Write containment reverts unrelated dirty files | High | Full tree snapshot taken before dispatch; no orchestrator writes outside a lineage while one runs |
| Risk | Models manufacture proposals to look productive | High | The brief states that an evidenced refusal is worth more than an invented rule |
| Risk | Three lineages return one averaged opinion | Medium | Synthesis must name disagreement; a tally is not a finding |
| Risk | A proposal ignores the read-only constraint | High | The brief carries it as the fact that decides most proposals |
| Dependency | Gateway credential and codex auth | No dispatch reaches a model | Check output text, never the exit code |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: [Response time target - e.g., <200ms p95]

### Security
- **NFR-S01**: [Auth requirement - e.g., JWT tokens required]

### Reliability
- **NFR-R01**: [Uptime target - e.g., 99.9%]

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: [How system handles]
- Maximum length: [Limit and behavior]

### Error Scenarios
- External service failure: [Fallback behavior]
- Network timeout: [Retry strategy]

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | [/25] | [Files: X, LOC: Y, Systems: Z] |
| Risk | [/25] | [Auth: Y/N, API: Y/N, Breaking: Y/N] |
| Research | [/20] | [Investigation needs] |
| Multi-Agent | [/15] | [Workstreams: X] |
| Coordination | [/15] | [Dependencies: X] |
| **Total** | **[/100]** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | [Risk] | [H/M/L] | [H/M/L] | [Strategy] |

---

## 11. USER STORIES

### US-001: [Title] (Priority: P0)

**As a** [user type], **I want** [needed behavior], **so that** [benefit].

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: [Title] (Priority: P1)

**As a** [user type], **I want** [needed behavior], **so that** [benefit].

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- None at dispatch. The run shape, iteration counts, executors and no-early-convergence requirement were all set by the operator before launch.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`

---


