---
title: "Feature Specification: Phase 3: migration-design"
description: "Turn the phase-001 inventory into a frozen, ordered cutover that moves the source root to .skilled, with an observable check on every step and a rollback written before the first one."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 3: migration-design

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

Phases 001 and 002 measure what the move touches. This phase decides the order it happens in. The output is a cutover sequence where each step names the surface it changes, the command that proves it worked, and the way back if it did not.

**Key Decisions**: what stays behind at `.opencode/` for the opencode runtime; whether the cutover lands in one commit or a staged series

**Critical Dependencies**: phase 001 findings and the phase 002 per-runtime reference map — this phase cannot start until both research records exist

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | [P0/P1/P2] |
| **Status** | Draft |
| **Created** | 2026-09-16 |
| **Branch** | `scaffold/003-migration-design` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 3 |
| **Predecessor** | 002-per-runtime-reference-map |
| **Successor** | None |
| **Handoff Criteria** | [To be defined during planning] |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Research and design the .opencode to .skilled source-root move specification.

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
A move of this size fails in the ordering, not the rename. Retargeting a symlink before the file it points at has moved leaves a dangling link; rewriting a path in a generated artifact instead of regenerating it leaves a value that looks right and is not; landing the commit before the gates are taught the new path means the repository's own pre-commit hook rejects the migration that fixes it. The inventory alone does not say which step goes first.

### Purpose
Produce a cutover sequence that can be executed without judgment calls mid-flight, and a rollback that is written and rehearsed before any file moves.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The ordered cutover sequence, one step per surface class, each with its own observable check.
- The target layout: what `.skilled/` holds, what `.opencode/` retains, and whether the links between them are relative or absolute.
- The rollback: the exact commands that return the repository to its pre-migration state, and the point after which rollback stops being a revert and becomes a forward fix.
- The gate-teaching order — which validators, hooks and workflows learn the new path, and whether they learn it before or after the files move.
- Which parts of the rewrite are scripted and which are done by hand, decided from phase 001 evidence rather than by preference.

### Out of Scope
- Executing the cutover. This phase produces the design; execution is a later phase whose shape the design determines.
- Re-opening whether the migration happens. That is settled.
- Anything phase 001 places outside the repository's reach, `barter/` included.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| [path/to/file.js] | [Modify/Create/Delete] | [Brief description] |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every surface class named in phase 001 appears in the sequence exactly once, with the step that handles it |
| REQ-002 | Every step carries a command whose output distinguishes success from failure, not a description of success |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The rollback is written before the sequence, and names the point at which it stops being available |
| REQ-004 | The design records which phase-001 blockers it resolves and which it routes around |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reader who was not in this session can execute the sequence without asking a question
- **SC-002**: Every phase-001 blocker is either resolved by a step or explicitly deferred with a reason
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001 findings | This phase cannot start | Blocked until `research/research.md` lands |
| Risk | A generated artifact is rewritten rather than regenerated | High | Phase 001 partitions derived state from source text; the sequence regenerates rather than edits |
| Constraint | Work stays in the dedicated worktree by operator decision, while the repository's large-reorg runbook runs toolchain validation and metadata regeneration on `main` | Medium | The design says which runbook steps run in the worktree and what evidence stands in for the main-only ones |
| Risk | The repository's own gates reject the migration commit | Medium | Gate-teaching is sequenced explicitly, not assumed |
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

- [Question 1 requiring clarification]
- [Question 2 requiring clarification]
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`

---


