---
title: "Feature Specification: Phase 13: github-release-notes-sync"
description: "Rebuild the 60 GitHub release bodies that have an entry and rewrite the 92 that do not, with no tag moved."
trigger_phrases:
  - "github release notes sync"
  - "phase 13 github release notes sync"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 13: github-release-notes-sync

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-17 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 13 of 13 |
| **Predecessor** | 012-small-skill-changelogs |
| **Successor** | None |
| **Handoff Criteria** | Every one of the 152 release bodies is in the new layout and every tag is where it was |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 13** of the changelog layout retrofit.

**Scope Boundary**: The bodies of the 152 GitHub releases. No tag, title or asset.

**Dependencies**:
- The 62 rewritten Skilled release entries from phase 002
- The driver and fact lock from phase 001

**Deliverables**:
- 60 release bodies rebuilt from their entries
- 92 release bodies rewritten from their live text
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 152 GitHub releases show their old bodies. 60 of them have an entry in the repository, and 92 older ones, from `1.0.0.0` to `v2.0.1.3`, do not.

### Purpose
Every GitHub release body reads in the v4.1.0.0 layout and keeps every fact it held.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
N/A: `gh release list` and the entry folders are compared by this phase's first task, after phase 002 lands.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rebuild the 60 bodies that have an entry with `build_release_notes.py` and `gh release edit`.
- Rewrite the 92 bodies with no entry from their live text, through the same driver and fact lock.
- Save every body before it changes, so each can be put back.

### Out of Scope
- Moving a tag, renaming a release or touching an asset - only the body changes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| The 60 release bodies with an entry | Modify | Rebuilt from the rewritten entry |
| The 92 release bodies without an entry | Modify | Rewritten from the live body |
| `scratch/release-bodies-before/` | Create | Every body as it stood, for rollback |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No tag moves. | `git ls-remote --tags origin` matches the list saved before the phase. |
| REQ-002 | A body with an entry equals its rebuilt notes. | A diff of each live body against `build_release_notes.py` output is empty. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | A rewritten body keeps every fact. | The fact lock reports no missing code span or number for the 92 rewritten bodies. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 152 bodies are in the new layout.
- **SC-002**: `validate.sh --strict` on this phase prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | An authenticated `gh` with release write access | The sync cannot run | Stop and ask the operator |
| Risk | A body edit loses text | Med | Every body is saved first and can be put back with `gh release edit --notes-file` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- How many dispatches run at once. The pilot measures one dispatch's time before the full run.
<!-- /ANCHOR:questions -->

---
