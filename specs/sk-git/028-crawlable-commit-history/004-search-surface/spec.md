---
title: "Feature Specification: Phase 4: search-surface"
description: "Deliver the search the format promises: recipes in the quick reference, a catalog entry and a playbook scenario that prove a commit resolves by packet and by identifier, and no index because plain git log suffices."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 4: search-surface

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

The grammar exists and the hooks enforce it. This phase documents how to find commits with it and proves the queries work, through sk-doc's catalog and playbook modes. Research showed plain git log answers every query, so no index script is built.

**Key Decisions**: no index script; queries live in quick-reference, catalog and one playbook scenario

**Critical Dependencies**: phase 003 hooks and allocator

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-09-11 |
| **Branch** | `worktrees/048-crawlable-commit-history` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 6 |
| **Predecessor** | 003-contract-and-hook |
| **Successor** | 005-history-rewrite |
| **Handoff Criteria** | Every recipe run against HEAD returns a commit, and the touched documents pass validate_document.py |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Crawlable commit history: a search-optimized, numbered commit message format for sk-git and the retroactive rewrite of existing history specification.

**Scope Boundary**: sk-git documentation only: quick-reference, feature catalog, manual testing playbook.

**Dependencies**:
- The three queries from `../002-format-decision/decision-record.md` ADR-001
- The stamper and allocator from phase 003

**Deliverables**:
- A catalog subsection on commit identity and search
- Playbook scenario GIT-044 with its index row
- Recipes run against HEAD with recorded output

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A reader who knows a packet or an ordinal has no documented way to get from it to a commit. The queries are three lines of git, but nobody will find them unless the catalog, the playbook and the quick reference carry them.

### Purpose
After this phase the catalog says what commit identity is, the playbook proves the queries, and the quick reference shows them.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Catalog entry extension and root summary
- Playbook scenario GIT-044 and its index row
- Recipe verification against HEAD

### Out of Scope
- An index generator - research showed plain git log answers every query
- Any history change - phase 005

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `feature-catalog/workflow-playbooks/conventional-commit-workflows.md` | Modify | Commit identity and search subsection, source rows |
| `feature-catalog/feature-catalog.md` | Modify | Root summary sentences |
| `manual-testing-playbook/commit-formation/find-commits-by-packet-and-id.md` | Create | Scenario GIT-044 |
| `manual-testing-playbook/manual-testing-playbook.md` | Modify | Index row |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The three queries are documented and each was run against HEAD with its output recorded |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | Every touched document passes validate_document.py |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: three queries return the same stamped commit
- **SC-002**: catalog and playbook validators exit 0
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | phase 003 stamper | no stamped commit to query | run the scenario in a fixture repo with the hooks installed |
| Risk | the playbook package validator has package-level rules the brief does not know | Med | run it and fix what it names |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: each query returns in under one second on the live history

### Security
- **NFR-S01**: not applicable

### Reliability
- **NFR-R01**: every recipe is copy-pasteable as written

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: a packet with no stamped commits returns nothing, which is correct
- Maximum length: not applicable

### Error Scenarios
- External service failure: not applicable
- Network timeout: not applicable

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 8/25 | Files: 4, LOC: 0, Systems: 1 |
| Risk | 3/25 | docs only |
| Research | 2/20 | decided |
| Multi-Agent | 8/15 | one dispatch |
| Coordination | 5/15 | one dependency |
| **Total** | **26/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | [Risk] | [H/M/L] | [H/M/L] | [Strategy] |

---

## 11. USER STORIES

### US-001: Find a packet's commits (Priority: P0)

**As a** maintainer, **I want** one query that lists a packet's commits, **so that** I can review its history without reading the log by eye.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Resolve an ordinal (Priority: P1)

**As a** reader of a spec document, **I want** a cited Commit-Id to resolve to a commit, **so that** the citation survives a rewrite.

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


