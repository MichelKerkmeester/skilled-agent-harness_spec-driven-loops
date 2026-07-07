---
title: "Feature Specification: sk-code compliance and code README coverage audit"
description: "Level 3 packet for auditing first-party code-bearing folders across 19 skills, authoring missing code READMEs, and recording sk-code convention findings."
trigger_phrases:
  - "026 sk-code audit"
  - "code README coverage"
  - "skill advisor extraction audit"
importance_tier: "high"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/026-sk-code-readme-audit"
    last_updated_at: "2026-05-15T11:40:19Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded packet and completed README coverage sweep"
    next_safe_action: "Run strict validation, targeted drift checks, commit, and push"
    blockers: []
    key_files:
      - "audit-report.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: sk-code compliance and code README coverage audit

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

This packet audits first-party code-bearing folders across the 19 requested skills for code README coverage and sk-code convention drift. The chosen scope prioritizes durable folder documentation now and names source-code convention clusters as follow-on packets where edits would cross many production and test surfaces.

**Key Decisions**: Exclude vendored/generated/fixture directories from coverage math, author missing code READMEs, defer broad source normalization clusters.

**Critical Dependencies**: sk-code OpenCode references, sk-doc README template, and Spec Kit strict validation.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-15 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The 19-skill tree contains many first-party code folders, but not every code-bearing folder has local README coverage. The same tree also contains sk-code convention drift, especially file headers and type-discipline patterns, which needs visible accounting before broad normalization.

### Purpose

Deliver a coverage matrix, create genuine missing code READMEs, and record named follow-ons for source convention clusters that exceed this dispatch scope.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Audit all 19 requested skills for first-party code-bearing folders.
- Create missing README.md files for audited code folders.
- Record README presence, README compliance, sk-code sample findings, and actions in audit-report.md.
- Run Spec Kit validation and targeted documentation checks.

### Out of Scope
- Vendored virtual environments and generated output folders, because they are not first-party authored skill code.
- Test fixtures, because this dispatch explicitly forbids editing fixtures.
- Broad source normalization, because the findings form multi-folder clusters that need their own verification packets.
- Tool-id, server-id, and skill-id renames, because the operator directive forbids them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-package-extraction/026-sk-code-readme-audit/` | Create | Level 3 packet docs and audit report. |
| `.opencode/skills/**/README.md` | Create | Missing code README files in first-party code-bearing folders. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Audit 19 requested skills | audit-report.md lists 19 skills and a folder matrix. |
| REQ-002 | Create missing code READMEs | Post-sweep README compliance is at least 95%. |
| REQ-003 | Preserve dispatch boundaries | No edits to packets 001-025, fixture files, renames, branches, force-push, or no-verify commits. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Surface sk-code findings | audit-report.md names violations and follow-on packets for deferred clusters. |
| REQ-005 | Verify packet | Strict Spec Kit validation passes for packet 026. |
| REQ-006 | Commit and push | A scoped commit lands on origin/main. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 19 skills audited.
- **SC-002**: Code README compliance reaches at least 95%.
- **SC-003**: audit-report.md includes a matrix with skill, subdir, README presence, README compliance, sk-code findings, and action.
- **SC-004**: Strict validation passes for packet 026.
- **SC-005**: Commit is scoped to this dispatch and pushed to origin/main.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Dirty worktree from parallel sessions | Accidental staging of unrelated files | Stage explicit packet and README paths only. |
| Risk | Source-code normalization crosses many files | Regression risk and broad verification burden | Defer as named packets with counts and reasons. |
| Dependency | Existing sk-code references | Audit criteria must match current conventions | Read and cite OpenCode style and quality references. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Audit scripts should complete locally without network access.

### Security
- **NFR-S01**: Do not modify databases, launchers, credentials, or environment config as part of this audit.

### Reliability
- **NFR-R01**: Generated READMEs must contain real folder paths and direct source file inventories.

---

## 8. EDGE CASES

### Data Boundaries
- Empty code folder: excluded because no direct code file is present.
- Generated or vendored code: excluded from coverage math and documented in audit scope.

### Error Scenarios
- Existing README does not match the compliance heuristic: preserve it and record a follow-on unless coverage target requires editing.
- Source violation is broad or package-boundary-sensitive: defer with a named follow-on packet.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 23/25 | 19 skills and 187 audited code folders. |
| Risk | 16/25 | Large dirty worktree and broad docs surface. |
| Research | 15/20 | Required prior packet and template reading. |
| Multi-Agent | 0/15 | Nested agents are forbidden for this dispatch. |
| Coordination | 12/15 | Must avoid unrelated dirty files and historical packets. |
| **Total** | **66/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | README generation becomes generic | H | M | Include direct folder path, file inventory, owner, and verification handoff in every README. |
| R-002 | Source edits exceed scope | H | M | Defer broad source clusters and avoid test fixture edits. |
| R-003 | Commit captures unrelated dirty files | H | M | Use explicit git add paths and inspect staged diff. |

---

## 11. USER STORIES

### US-001: Audit Skill Code Folders (Priority: P0)

**As an** operator, **I want** a complete matrix of first-party skill code folders, **so that** README and sk-code drift is visible.

**Acceptance Criteria**:
1. Given the 19 requested skills, When the audit runs, Then every included first-party code folder appears in audit-report.md.

---

### US-002: Fill README Gaps (Priority: P0)

**As a** maintainer, **I want** missing code READMEs created with real content, **so that** folder-level code navigation is consistent.

**Acceptance Criteria**:
1. Given folders missing README.md, When this dispatch completes, Then compliance reaches at least 95%.

---

## 12. OPEN QUESTIONS

- None. Operator pre-approved a new Level 3 packet and auto mode.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`.
- **Task Breakdown**: See `tasks.md`.
- **Verification Checklist**: See `checklist.md`.
- **Decision Records**: See `decision-record.md`.
- **Audit Report**: See `audit-report.md`.
