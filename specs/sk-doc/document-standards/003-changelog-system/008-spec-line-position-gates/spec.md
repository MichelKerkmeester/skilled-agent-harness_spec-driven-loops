---
title: "Feature Specification: Spec-Line Position Gates"
description: "The changelog contract says the spec-folder line closes an entry, but no checklist or gate checks where it sits, so a misplaced line passes every gate."
trigger_phrases:
  - "spec line position gates"
  - "phase 8 spec line position gates"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Spec-Line Position Gates

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-17 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 8 |
| **Predecessor** | 007-changelog-voice-rewrite |
| **Successor** | None |
| **Handoff Criteria** | The shape check fails a misplaced spec-folder line and the sk-doc suite passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the changelog system specification.

**Scope Boundary**: The changelog checklists, the shape check and its tests, and `PUBLIC-RELEASE.md`. No changelog entry is edited.

**Dependencies**:
- The spec-folder line contract that `dce67140eae` added to the template and SKILL.md section 5

**Deliverables**:
- A `spec-position` rule in `check_changelog_shape.py`, with tests
- Checklist lines that name the position, in SKILL.md and both `/create:changelog` workflows
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
The changelog template and SKILL.md section 5 say the spec-folder line closes the entry, after an `&nbsp;` line. The SKILL.md validation checklist and both `/create:changelog` workflows ask only that the line be present, and `check_changelog_shape.py` reads only its `(Level N)` label. A draft that keeps the line under the summary passes every gate, as the measured run below shows.

### Purpose
Every gate a changelog draft passes checks that the spec-folder line closes the entry.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ python3 .skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py probe-old-position.md
PASS probe-old-position.md
SUMMARY files=1 pass=1 fail=0
exit 0
```

`probe-old-position.md` holds a frontmatter block, one opening line, the spec-folder line and then a `## Changes` section.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Add a `spec-position` rule to `check_changelog_shape.py` that fails a spec-folder line followed by more content, or with no `&nbsp;` line before it.
- Name the position in the SKILL.md validation checklist and in both `/create:changelog` workflows' format checks.
- Correct the entry shape that `PUBLIC-RELEASE.md` describes.
- Move the spec line to the end of the test fixture and add tests for the new rule.

### Out of Scope
- Editing changelog entries - the operator kept the five entries with content after the line, and the 1,876 without an `&nbsp;` line, out of this phase.
- Restoring the section tags in v4.0.2.1 - that entry is the model the failing shape test reads, and it is a changelog entry.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py` | Modify | Add the `spec-position` rule |
| `.skilled/skills/sk-doc/scripts/tests/test_check_changelog_shape.py` | Modify | Move the fixture's spec line and test the new rule |
| `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md` | Modify | Name the position in validation item 4 and the shape-gate items |
| `.skilled/commands/create/assets/create-changelog-auto.yaml` | Modify | Name the position in the step 5 format check |
| `.skilled/commands/create/assets/create-changelog-confirm.yaml` | Modify | Name the position in FORMAT CHECKS |
| `.skilled/skills/sk-doc/sk-create-changelog/scripts/README.md` | Modify | List the new rule |
| `PUBLIC-RELEASE.md` | Modify | Say the entry closes with its spec-folder line |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The shape check fails a spec-folder line with content after it, or with no `&nbsp;` line before it. | The measured probe prints `FAIL` with a `[spec-position]` line and exits 1. An entry that closes with `&nbsp;` and the line passes. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | The SKILL.md checklist and both workflows name the position. | `rg -n "closes the entry\|closing the entry"` finds the line in each of the three files. |
| REQ-003 | `PUBLIC-RELEASE.md` describes the entry shape the template sets. | `rg -n "ends with upgrade notes" PUBLIC-RELEASE.md` finds nothing. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: The measured probe exits 1 with a `[spec-position]` line.
- **SC-002**: The shape-check tests pass, except the model-entry test that fails today for the out-of-scope v4.0.2.1 tags.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The template's spec-line contract | The rule would enforce a contract that no longer holds | Read template line 142 and SKILL.md line 107 before writing the rule |
| Risk | Old entries fail the stricter shape check | Low | The check runs on drafts from `/create:changelog`, not across old entries. No CI workflow or git hook calls it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- None
<!-- /ANCHOR:questions -->

---


