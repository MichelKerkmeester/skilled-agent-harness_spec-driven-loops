---
title: "Feature Specification: Phase 2: template-and-example-defect-repair"
description: "Fix every phase 1 ledger row owned by phase 2: the leaked example descriptions, the stale Checklist.md lines, the bare spec-folder placeholders, the style guide contradiction and the dead hash file."
trigger_phrases:
  - "template and example defect repair"
  - "phase 2 template and example defect repair"
  - "leaked example descriptions"
  - "apply ledger rows"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 2: template-and-example-defect-repair

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

This phase applies every ledger row whose `owner_phase` is `002`. Twenty-five rows are known now and written out literally in `tasks.md`. The rest come from the phase 1 census and were checked by the phase 1 frontier review. Exact text swaps are applied by a tested script, not by a model, so a weak executor cannot paraphrase them.

**Key Decisions**: exact-match rows are applied by `apply_row.py`, which refuses unless the old text occurs exactly once. The dead `templates/.hashes` file is deleted. Write-recipe rows go to `041-write-recipe-fixes/006-fix-write-recipe-move-destination`.

**Critical Dependencies**: phase 1 closed with `ledger.jsonl` reviewed, and the launch preconditions in `../spec.md` section 3.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-10-23 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 9 |
| **Predecessor** | 001-template-drift-census-and-baseline |
| **Successor** | 003-versioned-placeholder-gate |
| **Handoff Criteria** | Every owner-002 ledger row no longer reproduces, and the spec-kit suite result matches the phase 1 start |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Make system-spec-kit templates and authoring docs followable by a DeepSeek V4.1 Flash agent swarm specification.

**Scope Boundary**: the files named by ledger rows with `owner_phase` `002`, all under `.skilled/skills/system-spec-kit/`. No template under `templates/core/`, `templates/addons/` or `templates/packet-types/` changes in this phase, because phases 3 and 4 own them. The one exception is the four owner `002` rows L-A-002 to L-A-005, which fix `core/implementation-summary.md.tmpl` and `addons/resource-map.md.tmpl`.

**Dependencies**:
- `../001-template-drift-census-and-baseline/scratch/ledger/ledger.jsonl`, reviewed.
- `../001-template-drift-census-and-baseline/scratch/baseline/suite-start.txt`.
- The launch preconditions in `../spec.md` section 3, recorded as met in `../goal.md` section 4. The build worktree path there becomes `WORKTREE` in `tasks.md`.

**Deliverables**:
- The fixed files.
- `scratch/ledger/known-rows.jsonl`: the 25 known rows.
- `scratch/tools/apply_row.py` and `scratch/tools/lib.sh`: the exact-match applier and its helper functions.
- `scratch/applied.txt`: an `APPLIED` line, a `CHECK` line and a `KCHECK` line for each of the 25 known rows.
- `scratch/census.txt`: one line per owner `002` ledger row with its result.
- One local commit for the phase.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The example docs a model imitates carry broken descriptions in 18 of 21 files, three of them still cite a `Checklist.md` that no longer exists. Two authoring lines tell a reader to open a literal `<spec-folder>`. The style guide says both "table" and "bulleted list" for the same metadata. A weak model copies these exactly.

### Purpose
Every defect the census assigned to this phase is gone, proved by its own evidence command no longer reproducing.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The 25 known rows in `tasks.md` T004.
- Every other ledger row with `owner_phase` `002`.
- Deleting `.skilled/skills/system-spec-kit/templates/.hashes` after a whole-repository reference check.

### Out of Scope
- Rows owned by phases 3, 4, 5 and 6. Their files change there.
- The write recipe. Its rows belong to the 041 series parent, per `phase-definitions.md` section 2.
- Any rewording beyond a row's `expected_text`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/templates/examples/level-*/*.md` (18 files) | Modify | Replace the leaked `description:` line |
| `.skilled/skills/system-spec-kit/templates/examples/level-2/tasks.md`, `level-3/tasks.md`, `level-3+/tasks.md` | Modify | Replace the `Checklist.md` line |
| `.skilled/skills/system-spec-kit/references/workflows/spec-folder-authoring-checklist.md` | Modify | Replace two bare `<spec-folder>` placeholders |
| `.skilled/skills/system-spec-kit/references/templates/template-style-guide.md` | Modify | Make the metadata rule say table in both places |
| `.skilled/skills/system-spec-kit/templates/.hashes` | Delete | Lists four files, three of which are not there, and nothing reads it |
| Other files named by owner-002 ledger rows | Modify | As each row states |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Each of the 25 known rows is applied, and `apply_row.py` printed `APPLIED` for it. |
| REQ-002 | For every ledger row with `owner_phase` `002`, its `evidence_cmd` no longer prints its `evidence_expect`. A row whose `expected_text` is `DELETE FILE` is met when its file no longer exists. |
| REQ-003 | Each of the 18 example `description:` lines equals the sentence written for it in `tasks.md` T004, and the leaked-text search in `tasks.md` T007 prints nothing. That search alone is not enough, because it matched only 15 of the 18 leaked lines before the repair. |
| REQ-004 | `templates/.hashes` is deleted, and a whole-repository search found no reader of it first. |
| REQ-005 | The spec-kit suite result at phase close matches `suite-start.txt` from phase 1: the `Test Files` lines, the `Tests` lines and the final `exit=` line are identical. |
| REQ-006 | No file changed except the files named by the 25 known rows, the files named by owner `002` ledger rows and `templates/.hashes`. Nothing under `templates/core`, `templates/addons` or `templates/packet-types` changed except `templates/core/implementation-summary.md.tmpl` and `templates/addons/resource-map.md.tmpl`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | The phase-close frontier review found no P0 or P1 problem in the diff, or each one is fixed. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A model that copies a Level 1, 2 or 3 example gets a correct full-sentence description.
- **SC-002**: No authoring doc tells a reader to open a path that does not exist.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 1 ledger | No census rows to apply | The 25 known rows still run, and the phase records the missing ledger as a blocker and cannot close |
| Risk | A row's locator no longer matches because of an earlier row | Row cannot apply | `apply_row.py` refuses and the conductor checks whether the evidence still reproduces |
| Risk | A test reads an example file's text | Suite regresses | REQ-005 compares the suite with the phase 1 start |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Exact-match rows are applied by script, one row at a time, with no model call.

### Security
- **NFR-S01**: `apply_row.py` writes only the file a row names, and only after the locator count is exactly one.

### Reliability
- **NFR-R01**: Applying the same row twice fails on the second run instead of editing twice.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: a ledger with no owner-002 rows beyond the known 25 is valid.
- Maximum length: a row whose `expected_text` spans paragraphs is applied as one replacement of the whole locator.

### Error Scenarios
- External service failure: a worker dispatch for a drifted row fails, and the row is marked `[B]` under the blocked task protocol.
- Network timeout: not applicable to script-applied rows.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 14/25 | Files: about 25, LOC: about 60, Systems: examples, references |
| Risk | 8/25 | Auth: N, API: N, Breaking: N, one file deletion |
| Research | 4/20 | The ledger already holds the findings |
| Multi-Agent | 6/15 | Workstreams: script rows, drifted rows, review |
| Coordination | 8/15 | Dependencies: phase 1 ledger, the 041 child |
| **Total** | **40/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Deleting `.hashes` breaks an unnoticed reader | M | L | Whole-repository search in T008 before deletion, and the delete runs only when both searches exit with code 1 |
| R-002 | A census row's `expected_text` is wrong | M | M | It was reviewed in phase 1, and this phase's close review reads the diff |
| R-003 | Two rows target the same text | L | M | Rows run in ID order, and the second refuses with a count of 0 |

---

## 11. USER STORIES

### US-001: Copyable examples (Priority: P0)

**As a** weak model copying an example, **I want** every description to be a finished sentence, **so that** the doc I write does not inherit a broken one.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Paths that exist (Priority: P1)

**As a** model following the authoring checklist, **I want** every path it names to exist, **so that** I do not stop or improvise.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None that block this phase. Every choice it needs is frozen in `goal.md` section 1.
- A ledger row that cannot be fixed inside this phase's scope is recorded in `goal.md` section 4 and raised to the operator.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `plan.md` section L3: ARCHITECTURE DECISION RECORD

---


