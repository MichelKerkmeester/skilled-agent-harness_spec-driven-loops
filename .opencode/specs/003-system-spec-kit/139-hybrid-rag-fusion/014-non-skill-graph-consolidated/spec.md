<!-- SPECKIT_LEVEL: 3 -->
# Feature Specification: 014 - Non-Skill-Graph Consolidation

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

This phase consolidates the non-skill-graph child specs under `138-hybrid-rag-fusion` into one canonical subfolder. The source folders `005-install-guide-alignment`, `008-codex-audit`, `010-index-large-files`, and `011-default-on-hardening-audit` are merged operationally into this single active folder and archived to preserve history.

The consolidation removes duplicate active template files (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`) across multiple child folders and establishes one authoritative Workstream A documentation surface.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec ID** | 014 |
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-02-21 |
| **Branch** | `138-hybrid-rag-fusion` |
| **Parent** | `../spec.md` |
| **Predecessor** | `013-deprecate-skill-graph-and-readme-indexing-2` |
| **Source Folders Merged** | `005`, `008`, `010`, `011` |
| **Archive Root** | `../z_archive/non-skill-graph-legacy/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Non-skill-graph work was split across multiple child folders with duplicate template documents and overlapping closure records. Root documentation already referenced a single consolidated target, but the filesystem still had multiple active child folders.

### Purpose

Make `014-non-skill-graph-consolidated` the single active non-skill-graph subfolder and archive the legacy folders while preserving full historical artifacts.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Create one canonical non-skill-graph child folder (`014-non-skill-graph-consolidated`).
- Archive prior non-skill-graph folders:
  - `005-install-guide-alignment`
  - `008-codex-audit`
  - `010-index-large-files`
  - `011-default-on-hardening-audit`
- Establish one canonical template document set in `014`.
- Keep historical source artifacts intact under archive.

### Out of Scope

- Rewriting archived historical implementation details.
- Re-opening archived skill-graph legacy folders.
- Changing runtime behavior beyond deprecation cleanups already captured in 013.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `014-non-skill-graph-consolidated/*` | Create | Canonical Level 3 docs for merged non-skill-graph scope |
| `z_archive/non-skill-graph-legacy/005-install-guide-alignment/` | Move | Preserve source folder history |
| `z_archive/non-skill-graph-legacy/008-codex-audit/` | Move | Preserve source folder history |
| `z_archive/non-skill-graph-legacy/010-index-large-files/` | Move | Preserve source folder history |
| `z_archive/non-skill-graph-legacy/011-default-on-hardening-audit/` | Move | Preserve source folder history |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Single active non-skill-graph child folder | Only `014-non-skill-graph-consolidated` remains active for merged non-skill-graph scope |
| REQ-002 | Legacy folders preserved | All four source folders exist under `z_archive/non-skill-graph-legacy/` |
| REQ-003 | Canonical docs exist in 014 | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md` present |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Root references align with filesystem | Root docs reference 014/archives consistently |
| REQ-005 | Validation passes with no errors | `validate.sh` exits without errors for 014 and root |
| REQ-007 | Level 3 protocol completeness | AI execution protocol sections are present and complete |

### P2 - Optional

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Supplemental index provided | `supplemental-index.md` summarizes source-to-archive mapping |
| REQ-008 | Consolidation traceability | Source-to-archive mapping includes all merged folders with no omissions |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `014-non-skill-graph-consolidated/` exists with full Level 3 doc set.
- **SC-002**: `005/008/010/011` no longer exist as active child folders under root.
- **SC-003**: Source folders are preserved in `z_archive/non-skill-graph-legacy/`.
- **SC-004**: Root and 014 validation complete without errors.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:acceptance-scenarios -->
## Acceptance Scenarios

1. Given root documentation references Workstream A, when links are followed, then `014-non-skill-graph-consolidated` is the active destination.
2. Given historical non-skill-graph child work is needed, when archive paths are inspected, then `005/008/010/011` are present under `z_archive/non-skill-graph-legacy/`.
3. Given spec template documents are reviewed at root level, when active folders are enumerated, then duplicate active `spec.md` sets for merged folders are absent.
4. Given consolidation evidence is requested, when `supplemental-index.md` is opened, then all four source mappings are listed.
5. Given validator runs on child 014, when execution completes, then result is pass or warning-only with no errors.
6. Given validator runs on root 138 recursively, when execution completes, then no validation errors are reported from child 014.
<!-- /ANCHOR:acceptance-scenarios -->

---

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Archive path drift | Source history could appear missing | Keep fixed archive root and map in `supplemental-index.md` |
| Risk | Cross-reference mismatch | Root docs may point to stale folders | Run post-merge path checks and validator |
| Dependency | Spec validation scripts | Completion gate depends on validator availability | Use canonical `scripts/spec/validate.sh` |
| Dependency | Existing root phase topology | Some phase-link warnings may pre-exist | Limit this phase to non-skill-graph consolidation scope |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 8. NON-FUNCTIONAL REQUIREMENTS

- **NFR-001**: Consolidation must preserve historical artifacts with no content loss.
- **NFR-002**: Active documentation surface must be reduced to one canonical non-skill-graph child folder.
- **NFR-003**: Validator compatibility must be maintained for Level 3 templates.
- **NFR-004**: Path naming must follow existing spec folder conventions.
<!-- /ANCHOR:nfr -->

---

## AI Execution Protocol

### Pre-Task Checklist

- Confirm consolidation scope is limited to non-skill-graph child folders.
- Confirm source folders are archived, not deleted.
- Confirm canonical template docs exist in `014`.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| Scope lock | Edit only root/child documentation and folder structure needed for consolidation |
| Preservation | Move source folders to archive; avoid destructive cleanup |
| Verification | Run validator against child and root before completion claim |
| Evidence | Update checklist with concrete command/path evidence |

### Status Reporting Format

- `STATE`: current merge/validation phase
- `ACTIONS`: files and folders moved or updated
- `RESULT`: pass/fail with next action

### Blocked Task Protocol

1. Stop additional structural edits.
2. Record blocker with folder path and command output.
3. Attempt one bounded corrective step.
4. Escalate with options and impact if unresolved.

---

<!-- ANCHOR:completion-criteria -->
## 9. COMPLETION CRITERIA

- [x] Single canonical non-skill-graph child folder exists.
- [x] Source folders archived under `z_archive/non-skill-graph-legacy/`.
- [x] Canonical Level 3 docs exist in `014`.
- [ ] Validation for child and root completed with no errors.
<!-- /ANCHOR:completion-criteria -->

---

<!-- ANCHOR:related-docs -->
## 10. RELATED DOCUMENTS

- `plan.md`
- `tasks.md`
- `checklist.md`
- `decision-record.md`
- `implementation-summary.md`
- `supplemental-index.md`
<!-- /ANCHOR:related-docs -->

---
