---
title: "Feature Specification: Phase 3: markdown-reference-sweep"
description: "Rename every remaining sk-code-opencode reference in spec docs and give every spec folder that carries the name its new name, keeping each packet's metadata consistent."
trigger_phrases:
  - "markdown reference sweep"
  - "phase 3 markdown reference sweep"
  - "sk-code-skilled spec folder rename"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: markdown-reference-sweep

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-18 |
| **Branch** | `worktrees/144-sk-code-skilled-rename` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 3 |
| **Predecessor** | 002-skill-and-routing-rename |
| **Successor** | None |
| **Handoff Criteria** | No identity spelling remains in a spec markdown file outside this packet, and every renamed spec packet validates as it did before |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the sk-code-skilled rename. It covers `specs/`.

**Scope Boundary**: spec markdown, spec metadata JSON and spec folder names.

**Dependencies**:
- Phase 002's rename script and safe patterns
- Operator decisions of 2026-10-18: rename history too, and rename spec folders

**Deliverables**:
- Every spec markdown reference renamed, history included
- Every spec folder and file that carried the name, under its new name

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
About 1,200 spec markdown files and 28 spec packets named the old identity, so searches and links kept pointing at a name the framework no longer uses.

### Purpose
Spec history reads with the new name, and every renamed packet keeps its links and validates the same as before.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Text references in spec markdown and spec metadata JSON
- `git mv` of spec folders and files whose names carry the identity
- Derived metadata repair and track-root refresh for the renamed packets

### Out of Scope
- Machine records in `specs/`: `.jsonl`, `.log`, `.out` and `.err` files - the operator kept them as recorded output
- This packet's own docs - they describe the rename itself

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/**/*.md` | Modify | Identity references renamed |
| 28 spec packets with the name in their folder | Rename | New folder names and repaired metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No spec markdown outside this packet names the old identity | `rg` with the identity pattern over `specs/**/*.md` returns hits only inside this packet |
| REQ-002 | Renamed packets validate as before | Each renamed packet's `validate.sh --strict` summary equals its summary on `main` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Track roots list the renamed packets | `refresh-track-roots.mjs` reports up to date for each affected track |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Zero identity hits in spec markdown outside this packet
- **SC-002**: 28 of 28 renamed packets give the same validation summary as on `main`
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A folder rename breaks a packet's metadata | Med | Run `repair-derived.cjs` on every renamed packet and compare validation with `main` |
| Risk | Old commit `Spec:` trailers no longer resolve to a folder | Low | Accepted by the operator when choosing to rename spec folders |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
