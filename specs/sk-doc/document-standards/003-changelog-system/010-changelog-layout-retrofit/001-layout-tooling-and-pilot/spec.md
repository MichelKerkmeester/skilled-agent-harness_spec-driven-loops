---
title: "Feature Specification: Phase 1: layout-tooling-and-pilot"
description: "Adapt the voice-rewrite driver into a layout rewrite with a fact lock and a free writer, split the 1,576 changelogs into lists and pilot on 20."
trigger_phrases:
  - "layout tooling and pilot"
  - "phase 1 layout tooling and pilot"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 1: layout-tooling-and-pilot

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
| **Phase** | 1 of 13 |
| **Predecessor** | 009-release-notes-layout-default |
| **Successor** | 002-skilled-release-line |
| **Handoff Criteria** | The 20 pilot files pass every gate and the operator approves the pilot |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the changelog layout retrofit.

**Scope Boundary**: The rewrite tooling in `../scratch/` and the 20 pilot changelogs. No other changelog.

**Dependencies**:
- The voice-rewrite driver and gates in `../../007-changelog-voice-rewrite/scratch/`
- The v4.1.0.0 template and `check_changelog_shape.py` from phase 009

**Deliverables**:
- `../scratch/rewrite-driver.cjs`, `../scratch/brief-rewrite.md` and `../scratch/brief-verify.md`
- 12 scope lists in `../scratch/lists/` and a 20-file pilot list
- 20 rewritten pilot changelogs
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The voice-rewrite driver locks every heading, table row and bullet in place, because that rewrite only shortened sentences. A layout rewrite has to change headings, turn paragraphs into bullets and add tables, alert boxes and folded blocks. Its worker and fact checker also ran on paid models, and this program writes only with free ones.

### Purpose
One driver rewrites an old changelog into the v4.1.0.0 layout with a free model and restores it unless every fact survives.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
N/A: the baseline is measured by this phase's first task, which counts each list and runs the shape check over it.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Copy the driver and replace its structure lock with a fact lock: every inline code span, number, frontmatter key and spec-folder line of the original must survive.
- Point the writer at `opencode-go/hy4-flash-free#high`, with Devin's `glm-5-2` as the fallback, and the fact check at a free model too.
- Write the 12 scope lists and a 20-file pilot drawn from every list.
- Run the pilot and record each file's gate results.

### Out of Scope
- Rewriting any file outside the pilot - each family's phase does that after the pilot passes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `../scratch/rewrite-driver.cjs` | Create | The layout driver with the fact lock |
| `../scratch/brief-rewrite.md`, `../scratch/brief-verify.md` | Create | The writer and fact-check briefs |
| `../scratch/lists/*.txt` | Create | The 12 scope lists and the pilot list |
| The 20 files in `../scratch/lists/pilot.txt` | Modify | Rewritten pilot changelogs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The fact lock restores a draft that drops a code span, number or spec-folder line. | A draft built to drop one span is restored, and the state file records why. |
| REQ-002 | A pilot rewrite adds no shape failure. | `check_changelog_shape.py` fails no rule on a pilot rewrite that it did not fail on its original. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The 12 lists cover the scope exactly once. | Their line counts add up to 1,576 and no path appears twice. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The 20 pilot files record `pass` in the driver state.
- **SC-002**: `validate.sh --strict` on this phase prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The opencode-go route for Hy4 Flash Free | The writer is unavailable | Devin's free `glm-5-2` |
| Risk | The fact lock misses a reworded fact | High | A second free model checks every draft against its original |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- How many dispatches run at once. The pilot measures one dispatch's time before the full run.
<!-- /ANCHOR:questions -->

---
