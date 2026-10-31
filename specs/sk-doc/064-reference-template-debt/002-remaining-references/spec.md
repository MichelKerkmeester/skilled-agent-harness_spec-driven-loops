---
title: "Feature Specification: Phase 2: remaining-references"
description: "Twenty-seven reference docs outside sk-design-diagram fail the reference format. This phase fixes 22 of them with the phase 1 script, updates the 11 files that cite renumbered sections, and exempts the other five by exact path suffix in the validator."
trigger_phrases:
  - "remaining references"
  - "phase 2 remaining references"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 2: remaining-references

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-29 |
| **Branch** | `worktrees/277-reference-template-debt` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 2 |
| **Predecessor** | 001-diagram-references |
| **Successor** | None |
| **Handoff Criteria** | 22 files report 0 issues, the proof table has no mismatch, the routing replay is byte-identical and the five exempted files each have an Accepted decision in decision-record.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Bring every skill reference doc that fails the reference format up to it specification.

**Scope Boundary**: The 27 tracked `references/**/*.md` docs outside `sk-design-diagram` that failed `validate_document.py` after phase 1, the files that cite their section numbers, and the newest changelog entry of each touched skill. No resource path changes.

**Dependencies**:
- `renumber-references.py` from phase 1 (`../001-diagram-references/scratch/`), run with a hand-listed edits file for the prose citations it cannot place
- `validate_document.py` for the per-file counts
- `leaf-route-replay.cjs` for the routing proof

**Deliverables**:
- 22 references that report `Total issues: 0`
- A proof table with one row for every section citation that moved
- One changelog bullet per touched skill
- A decision record for the five files that cannot be fixed, and the exact-suffix exemption it chose, with a test
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After phase 1, 27 reference docs still fail the format. Thirteen open with intro prose and have no overview section. Four `writing-notes.md` files are a bare bullet list under the title. Five number their sections wrongly: four repo-rule docs start at `## 0.` and the deep-review loop protocol jumps from section 8 to `## 11.`. Five are not plain references. Four are sample `DESIGN.md` outputs that the md-generator ships as study material, and one is `design-md-format.md`, whose section numbers 0 to 16 are schema identifiers cited from TypeScript code, playbooks and rule cards.

### Purpose
Fix every doc that a renumber can fix without moving a citation, and exempt the five that cannot, with the reason recorded.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ validate_document.py <file>   (all 454 tracked references, after phase 1)
  27 files failing outside sk-design-diagram, 22 issues in the 22 fixable ones
  5 files failing: 4 x examples/<brand>/DESIGN.md (1 issue each), design-md-format.md (2 issues)
$ validate_document.py <file>   (all 454 tracked references, after phase 2)
  445 OK, 5 FAIL, 4 SKIPPED
  Total issues: 0 for every one of the 22 fixed files
$ validate_document.py <file>   (all 454 tracked references, after the format-spec exemption)
  445 OK, 0 FAIL, 9 SKIPPED
  the five files report: Format spec: its section numbers are the DESIGN.md format's ids
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Wrap the intro under each title as `## 1. OVERVIEW`, or insert the section above a bare list, and keep the prose as written
- Renumber the four repo-rule docs and the loop protocol so the sections run 1, 2, 3 in sequence
- Update every citation of a renumbered section: three in `sk-create-repo-rule/SKILL.md`, 28 in ten playbook scenarios and the self-references inside the changed docs
- Add one bullet to the newest changelog entry of each of the 12 touched skills
- Decide, for each of the five remaining files, whether to fix or exempt it, and record the reason
- Exempt those five by exact path suffix in `validate_document.py`, with a test that a sibling in the same folder is still validated

### Out of Scope
- Any other validator behavior - the change is one exemption list and its check
- Frontmatter version numbers - the pre-commit gate raises them for any staged doc whose body changed
- Rebuilding the trigger index - the operator rebuilds it after the packet docs land

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| 22 reference docs across 12 skills | Modify | Overview section, renumbered sections, capital titles, rules |
| `.skilled/skills/sk-doc/sk-create-repo-rule/SKILL.md` and 10 playbook scenarios | Modify | Section citations that followed the four repo-rule references |
| 12 `changelog/` newest entries | Modify | One bullet each |
| `.hermes/skills/sk-create-repo-rule/SKILL.md` | Regenerate | Generated copy of the edited skill contract |
| `.skilled/skills/sk-doc/shared/scripts/validate_document.py` | Modify | `FORMAT_SPEC_FILES` and its check in `should_exclude_path` |
| `.skilled/skills/sk-doc/scripts/tests/test_format_spec_exclusion.py` | Create | Two tests for the exemption |
| sk-doc newest untagged changelog entry | Modify | One bullet for the validator change |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The 22 fixable files report `Total issues: 0` from `validate_document.py`, and the rerun over all 454 references finds no new failure |
| REQ-002 | Every section citation that moved lands on a heading with the same words as before, shown by a table built from the new text |
| REQ-003 | Routing does not change: the leaf replay totals line reads `gold=64 scored=56 tied=3 mean_f1=0.9161 exact=49` and the two reports compare equal |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | Each of the 12 touched skills passes `package_skill.py --check --strict`, sk-design passes `parent-skill-check.cjs`, and the Hermes copy matches its source |
| REQ-005 | Each of the 12 newest changelog entries gains one bullet and still validates |
| REQ-006 | Each of the five remaining files has a decision in `decision-record.md` with the exact change that would clear it |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The rerun over 454 references reads 445 OK, 0 FAIL and 9 SKIPPED, down from 389 OK, 61 FAIL and 4 SKIPPED (445 OK, 5 FAIL, 4 SKIPPED after the fixes and before the exemption)
- **SC-002**: The proof table has 36 rows and 0 mismatches
- **SC-003**: The replay totals line is unchanged and `cmp` prints nothing for the two reports
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 1 script | Med | The script already handles the three modes this phase needs and reports a reference it cannot place instead of guessing |
| Risk | A bare `§N` in a repo-rule doc names `REPO RULES.md` or `AGENTS.md`, not the doc that holds it | High | The first plan run stopped on `decision-tests.md` line 50, and six references are pinned to their real target by a hand-listed override |
| Risk | A playbook scenario cites a repo-rule section in prose the script cannot place | Med | 23 listed edits carry the old and new number, and the proof table checks the heading words on both sides |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- The plan, apply and verify steps for the 33 files run in a few seconds.

### Security
- No credential or network access. The script reads and writes tracked docs only.

### Reliability
- Apply refuses to write when a proof row mismatches or a citation cannot be placed.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: the four `writing-notes.md` files have no heading under the title, so the overview section is inserted above the bullet list.
- Maximum input: `cli-reference.md` gains 11 section rules and `design-md-theming.md` gains 7.
- Failure path: a bare `§8` in `decision-tests.md` had no section 8 in that file, so the plan stopped until the line was pinned to `AGENTS.md`.
- Mixed targets: `agents-md-integration.md` cites `RULES.md`, `REPO RULES.md` and its own sections, so each reference is placed on its own.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | 22 references, 11 citing files, 12 changelogs |
| Risk | 12/25 | Repo-rule citations point at other files by bare number |
| Research | 10/20 | Deciding the five exemptions |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None. Both questions are answered in `decision-record.md`:

- The four sample `DESIGN.md` files leave the failing list by exact path suffix, not a folder pattern, so the `writing-notes.md` siblings stay validated (ADR-001, Accepted).
- `design-md-format.md` is exempted by exact path suffix and keeps its 0 to 16 schema numbering (ADR-002, Accepted).
<!-- /ANCHOR:questions -->

---
