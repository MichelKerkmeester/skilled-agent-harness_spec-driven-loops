---
title: "Feature Specification: Phase 6: docs-and-release"
description: "Release the capability: sk-git README and changelog v1.6.0.0, advisor vocabulary and regenerated manifests, the delegation-rule freeze paragraph and the AGENTS.md commit-identity row, and the parent packet closeout."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 6: docs-and-release

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

The code and the contract shipped in phases 003 to 005 and 007. This phase makes them findable and official: the README and changelog through sk-doc, the advisor vocabulary and derived manifests through the skill-root metadata gate, and the two rule edits ADR-005 decided. It runs last and closes the parent.

**Key Decisions**: version 1.6.0.0; no new repo rule, one paragraph in the delegation rule and one AGENTS.md row

**Critical Dependencies**: phases 003, 004, 005 and 007 landed

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-09-11 |
| **Branch** | `worktrees/048-crawlable-commit-history` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 6 |
| **Predecessor** | 005-history-rewrite |
| **Successor** | None |
| **Handoff Criteria** | validate_document.py, package_skill.py --check and ci-skill-root-metadata.cjs exit 0 for sk-git; the parent validates recursively |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the Crawlable commit history: a search-optimized, numbered commit message format for sk-git and the retroactive rewrite of existing history specification.

**Scope Boundary**: sk-git README, changelog, SKILL.md version, graph-metadata.json, the derived manifests, repo-rules/delegation-and-orchestration.md section 2, the AGENTS.md section 5 table, and the parent packet's docs.

**Dependencies**:
- ADR-005 in `../002-format-decision/decision-record.md`
- The scripts and hooks that phases 003, 005 and 007 added, which the README lists

**Deliverables**:
- README.md at 1.6.0.0 with commit identity, the new scripts and the queries
- changelog/v1.6.0.0.md
- graph-metadata.json vocabulary and regenerated leaf manifest and aliases
- The delegation-rule paragraph and the AGENTS.md row
- Parent spec map, goal log and description regenerated

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
sk-git's README says nothing about commit identity, its changelog stops at 1.5.2.0, the advisor cannot route commit-id vocabulary, and the two rule surfaces still lack the freeze paragraph and the identity row.

### Purpose
After this phase a reader, the advisor and the rules all know what commit identity is and who owns it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- README, changelog and version through sk-doc create-readme and create-changelog
- Advisor vocabulary and derived manifests through the skill-root metadata gate
- The two rule edits through create-repo-rule's revise path
- Parent closeout

### Out of Scope
- A new repo rule file - ADR-005 decided against it
- Any code change - phases 003 to 007 own the code

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-git/README.md` | Modify | Commit identity, scripts, queries, version |
| `.opencode/skills/sk-git/changelog/v1.6.0.0.md` | Create | Release entry |
| `.opencode/skills/sk-git/SKILL.md` | Modify | Version only |
| `.opencode/skills/sk-git/graph-metadata.json` | Modify | Vocabulary |
| `.opencode/skills/sk-git/leaf-manifest.json`, `leaf-aliases.json` | Regenerate | Derived |
| `repo-rules/delegation-and-orchestration.md` | Modify | Freeze paragraph, version bump |
| `AGENTS.md` | Modify | Commit identity row |
| `../spec.md`, `../goal.md` | Modify | Closeout |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | README, changelog and SKILL.md carry version 1.6.0.0 and pass validate_document.py |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | package_skill.py --check and ci-skill-root-metadata.cjs exit 0 for sk-git after the manifests regenerate |
| REQ-003 | The delegation rule carries the freeze paragraph with a bumped version and AGENTS.md carries the identity row |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: three validators exit 0 for sk-git
- **SC-002**: the advisor recommends sk-git for a commit-id prompt at or above the routing bar
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | phase 007 landed | README would list scripts that change | run last |
| Risk | SKILL.md word cap | Med | version bump only in that file |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: not applicable

### Security
- **NFR-S01**: sk-git stays class S: no description.json, mode-registry.json or hub-router.json at its root

### Reliability
- **NFR-R01**: derived manifests are regenerated, never hand-edited

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: not applicable
- Maximum length: SKILL.md stays under 5,000 words

### Error Scenarios
- External service failure: not applicable
- Network timeout: not applicable

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 10/25 | Files: 9 |
| Risk | 6/25 | docs and metadata |
| Research | 2/20 | decided |
| Multi-Agent | 8/15 | two dispatches |
| Coordination | 6/15 | runs last |
| **Total** | **32/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A regenerated manifest drifts from the routing gate's view | M | L | ci-skill-root-metadata.cjs is the authority and runs last |

---

## 11. USER STORIES

### US-001: Find the feature (Priority: P0)

**As a** reader of sk-git's README, **I want** commit identity explained where the other conventions are, **so that** I do not learn it from a hook error.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Route the vocabulary (Priority: P1)

**As an** operator typing find commits for a packet, **I want** the advisor to route to sk-git, **so that** the query is one prompt away.

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


