---
title: "Feature Specification: Phase 7: system-spec-kit-changelogs"
description: "The 169 system-spec-kit changelogs predate the v4.1.0.0 layout. This phase rewrites them with a free model and keeps every fact."
trigger_phrases:
  - "system spec kit changelogs"
  - "phase 7 system spec kit changelogs"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 7: system-spec-kit-changelogs

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-17 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 13 |
| **Predecessor** | 006-mcp-tooling-changelogs |
| **Successor** | 008-system-deep-loop-changelogs |
| **Handoff Criteria** | Every file in `../scratch/lists/007.txt` passes the driver's gates and the driver state shows no failed file |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the changelog layout retrofit.

**Scope Boundary**: The 169 system-spec-kit changelogs in `../scratch/lists/007.txt`. No other file.

**Dependencies**:
- The driver, briefs and fact lock from `001-layout-tooling-and-pilot`

**Deliverables**:
- 169 system-spec-kit changelogs rewritten into the v4.1.0.0 layout
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 169 system-spec-kit changelogs were written before the v4.1.0.0 layout. They use bold lead-in bullets, one paragraph per item and inline breaking markers, so they read differently from every entry written since.

### Purpose
Every system-spec-kit changelog reads in the v4.1.0.0 layout and records exactly the facts it recorded before.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
N/A: phase 001 measures the baseline for every list, this one included, before any rewrite runs.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite the 169 files in `../scratch/lists/007.txt`: `.skilled/skills/system-spec-kit/**/changelog/**/v*.md`.
- Rerun any file the driver restored, then record why any file still fails.

### Out of Scope
- Adding a fact or a section the source never recorded - the layout reshapes what an entry says, it never adds to it.
- Release bodies - phase 013 rebuilds them after every entry is rewritten.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| The 169 files in `../scratch/lists/007.txt` | Modify | Rewritten in place into the v4.1.0.0 layout |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every rewritten file keeps every fact of its original. | The fact lock reports no missing code span, number or spec-folder line for any listed file. |
| REQ-002 | No rewrite adds a shape or voice failure. | `check_changelog_shape.py` fails no rule on a rewrite that it did not fail on the original, and `hvr_scan.py` reports 0 hard blockers. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Every listed file ends in a final state. | The driver state records `pass` or `unchanged` for each of the 169 files. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The driver state shows 169 files in `pass` or `unchanged` and 0 in `restored`.
- **SC-002**: `validate.sh --strict` on this phase prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The free Hy4 Flash Free route through opencode-go | The run stops while the route is down | GLM 5.3 Flash on the opencode-go provider writes when Hy4 is limited or fails |
| Risk | A rewrite drops or changes a fact | High | The fact lock and the second-model fact check restore the original on any miss |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None
<!-- /ANCHOR:questions -->

---
