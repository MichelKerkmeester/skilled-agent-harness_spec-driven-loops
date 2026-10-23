---
title: "Feature Specification: Phase 6: fix-write-recipe-move-destination"
description: "Step 2 of the spec folder write recipe ends its move command with a bare placeholder, so a reader who copies the block has no destination to type. This phase replaces the placeholder with a real example path and says the track is an example."
trigger_phrases:
  - "fix write recipe move destination"
  - "phase 6 fix write recipe move destination"
  - "spec folder move destination"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 6: fix-write-recipe-move-destination

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

Step 2 of the spec folder write recipe shows an `mv` command whose destination line is a bare `<spec-folder>` placeholder. A reader who copies the block has to invent the one value the block does not supply, and a reader who copies it literally gets a shell syntax error. This phase replaces the line with a real example path and adds one sentence that says the track is an example and the reader substitutes the track they selected.

**Key Decisions**: one known row carries both the destination and the sentence, applied by the shared exactly-once applier.

**Critical Dependencies**: the applier from 054 phase 002 and the verified ledger from 054 phase 001.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-10-23 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 6 |
| **Predecessor** | 005-fix-write-recipe-verification-gate |
| **Successor** | None |
| **Handoff Criteria** | T001 finds 054 phase 002's `scratch/tools/apply_row.py` before any apply, then `scratch/applied.txt` holds `APPLIED K-041-006-01`, the bare destination no longer reproduces, `scratch/changed-files.txt` names only the recipe file, T008 prints `SUITE_MATCH`, `validate.sh --strict` prints `RESULT: PASSED` and `scratch/review/T009.txt` is saved |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the Write recipe fixes series.

**Scope Boundary**: Writes land in this phase folder and in one file, `.skilled/skills/system-spec-kit/references/workflows/spec-folder-write-recipe.md`. The phase reads the 054 ledger and applier and changes nothing else.

**Dependencies**:
- This phase runs after 054 phase 002 saves `scratch/tools/apply_row.py`, and T001 stops the phase when that file is missing.
- The 054 phase 001 ledger exists when that phase closed.
- The launch preconditions in `../../054-weak-model-spec-authoring/spec.md` section 3 are recorded in `../../054-weak-model-spec-authoring/goal.md` section 4.

**Deliverables**:
- The fixed Step 2 block in the recipe.
- `scratch/known-rows.jsonl`: the known row in the applier schema.
- `scratch/census.txt` and `scratch/recheck.txt`: the ledger sweep and the recheck.
- `scratch/review/T009.txt`: the read-only frontier review.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Step 2 of `.skilled/skills/system-spec-kit/references/workflows/spec-folder-write-recipe.md` moves the scaffold into the selected track. The `mv` block names a real source, `specs/078-opencode-authoring-recipe`, and then a destination line of two spaces and `<spec-folder>`. The placeholder is the only value a reader must invent, and nothing in the block says what to put there. A reader who copies the block literally gets a shell syntax error on the destination line. A reader who pauses to interpret it has left the recipe.

### Purpose
The block runs as written with the example track, and one sentence tells the reader which part to change.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Replace `  <spec-folder>` with `  specs/system-speckit/078-opencode-authoring-recipe`.
- Add one sentence after the block that names the track as an example and tells the reader to substitute the track they selected.
- Apply every ledger row with `owner_phase` `041-006` whose evidence still reproduces, with the shared applier.
- One read-only frontier review at close.

### Out of Scope
- The `<folder>` placeholders in Steps 3, 4, 5 and 6. They are the same class in different steps, and each needs its own reading of the command. They are listed in `goal.md` section 4 as adjacent findings.
- The `<spec-folder>` destination in `references/debugging/troubleshooting.md` line 304. It is the same class in another file, and no ledger row owns it here.
- The commit hook, sk-git, any template or validator change, and any other file in the 041 series.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/references/workflows/spec-folder-write-recipe.md` | Modify | Replace the bare destination and add the track sentence |
| `scratch/known-rows.jsonl` | Create | The known row in the applier schema |
| `tasks.md`, `goal.md`, `acceptance-criteria.md`, `implementation-summary.md` | Modify | Progress and evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The recipe holds no `  <spec-folder>` line and holds `  specs/system-speckit/078-opencode-authoring-recipe`. |
| REQ-002 | One sentence directly after the Step 2 code block says the track is an example and the reader substitutes the track they selected. |
| REQ-003 | Every ledger row with `owner_phase` `041-006` ends as `APPLIED` or `SKIP-GONE`, and no such row's evidence still reproduces. |
| REQ-004 | The only path changed outside this phase folder is the recipe file. |
| REQ-005 | The spec-kit suite summary matches the 054 phase 001 start summary, or the phase records the substitution when that file is absent. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | One read-only frontier review ran at close and each finding is applied or recorded in `goal.md` section 4. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reader who copies Step 2 gets a working `mv` command without inventing a destination.
- **SC-002**: The remaining `<folder>` placeholders are named with file and line, so a later packet can pick them up without a new census.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 054 phase 002 `scratch/tools/apply_row.py` | No mechanical apply | T001 checks the file and stops the phase when it is missing |
| Dependency | 054 phase 001 `ledger.jsonl` | The `041-006` sweep has nothing to read | T005 writes `LEDGER-MISSING`, the known row still runs, and AC-003 records 0 rows |
| Risk | A ledger row's locator drifted after the census | The applier refuses the row | The row is recorded `BLOCKED` with the applier line, and the phase continues |
| Risk | The 078 example path collides with a real packet later | The example stops being an example | The added sentence says the track is an example, and the packet number is free at the start commit |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: One applier call per row. No model edits the recipe, so a row costs milliseconds.

### Security
- **NFR-S01**: No brief holds a credential. The frontier review runs with `--sandbox read-only`.

### Reliability
- **NFR-R01**: A second apply of the same row prints `FAIL <id>: locator found 0 times` and exits 1.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: a ledger with no `041-006` row writes the single line `LEDGER-MISSING` or no lines, and the phase continues.
- Maximum length: a locator that spans four lines is one string, and the applier counts it as one occurrence.

### Error Scenarios
- External service failure: the review dispatch fails. The error is saved to `scratch/review/T009.err` and REQ-006 stays open.
- Network timeout: the applier is local and has no network path.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 4/25 | Files: 1 changed outside this folder. Systems: one reference doc |
| Risk | 3/25 | Auth: N, API: N, Breaking: N |
| Research | 4/20 | Read one Step and the ledger schema |
| Multi-Agent | 3/15 | Workstreams: one conductor, one reviewer |
| Coordination | 4/15 | Dependencies: the 054 applier and ledger |
| **Total** | **18/100** | **Level 3 (operator decision)** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | The known locator no longer occurs once because another session edited the recipe | H | L | T003 counts it with `python3` before the apply and stops when it is not 1 |
| R-002 | The added sentence drifts from the file's voice | L | L | T009 checks for em dash and semicolon |
| R-003 | The suite differs for an unrelated reason | M | L | T008 compares only the `Test Files`, `Tests` and `exit=` lines and reruns once |

---

## 11. USER STORIES

### US-001: A copyable Step 2 (Priority: P0)

**As a** spec author, **I want** the Step 2 block to name a real destination, **so that** I can run it without inventing a path.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: A mechanical fix (Priority: P1)

**As a** conductor, **I want** one applier call to carry both edits, **so that** no model rewrites prose in a shared reference.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None that block this phase. The one-row fix and the example path are frozen in `goal.md` section 1.
- The adjacent placeholders are listed in `goal.md` section 4 and in the scope above. This phase does not fix them.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `plan.md` section L3: ARCHITECTURE DECISION RECORD

---

