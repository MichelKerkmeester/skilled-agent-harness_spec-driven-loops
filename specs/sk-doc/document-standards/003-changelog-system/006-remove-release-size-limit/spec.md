---
title: "Feature Specification: Remove the file-total line ceiling from release notes"
description: "The changelog shape check fails an expanded release note past 280 lines. The v4.0.2.1 entry sits at the ceiling, so every addition needs a trim first."
trigger_phrases:
  - "remove release size limit"
  - "remove the file total line ceiling from release"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Remove the file-total line ceiling from release notes

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/395-remove-release-size-limit` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`check_changelog_shape.py` fails an expanded release note that runs past 280 lines below its frontmatter. The v4.0.2.1 entry sits at 278 of those lines, so a writer who adds one fact must first cut another. The operator asked for the size limit to go.

### Purpose
A release note runs as long as its release needs, while the H4 item, glance bullet and sentence gates stay.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
The v4.0.2.1 entry with three filler lines appended, run through the checker before and after the change:
```text
$ python3 check_changelog_shape.py entry-281.md   # before
FAIL entry-281.md
  [file-total] 281 lines below the frontmatter, ceiling 280
SUMMARY files=1 pass=0 fail=1
exit 1
$ python3 check_changelog_shape.py entry-281.md   # after
PASS entry-281.md
SUMMARY files=1 pass=1 fail=0
exit 0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove the `file-total` rule and its constant from `check_changelog_shape.py`.
- Replace the 280-line test with one proving a 1,000-line expanded entry passes.
- Drop the compact and expanded file-total rows from the template's length table and every doc line that states them.
- Drop the 240-line draft target from both `/create:changelog` workflow files, and align their H4 item and glance bullet numbers with the checker's 32 and 14.
- Remove the 32 H4 item and 14 glance bullet ceilings, which the operator asked for after the line ceiling went.
- Raise sk-create-changelog to 1.5.1.0 and the sk-doc hub to 2.9.14.0, with a release note for each.

### Out of Scope
- The two sentence-length gates - they govern readability, not size.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py` | Modify | Remove the `file-total` rule |
| `.skilled/skills/sk-doc/scripts/tests/test_check_changelog_shape.py` | Modify | Replace the ceiling test and drop the template-match assertion |
| `.skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md` | Modify | Drop both file-total rows, state that no line ceiling applies |
| `sk-create-changelog/SKILL.md`, `README.md`, `scripts/README.md` | Modify | Drop the 280-line and 40-line statements |
| `.skilled/commands/create/assets/create-changelog-auto.yaml`, `create-changelog-confirm.yaml` | Modify | Drop the 240-line target |
| sk-doc `SKILL.md`, `description.json`, `hub-router.json`, `mode-registry.json` and two `changelog/` notes | Modify, Create | Version bumps and release notes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | An expanded entry of any length passes the shape check when every other rule holds | The 281-line entry in Measured Behavior prints `PASS` and exits 0, and `test_an_expanded_entry_has_no_line_ceiling` passes at 1,000 lines |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | No doc or workflow file states a release-note line ceiling | `rg -n "280 lines\|40 prose lines\|40 lines of prose\|240 lines below" .skilled/skills/sk-doc/sk-create-changelog .skilled/commands/create/assets --glob "!**/changelog/**"` prints nothing. Release notes keep their history |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `python3 -m pytest -q .skilled/skills/sk-doc/scripts/tests/test_check_changelog_shape.py` prints `20 passed`.
- **SC-002**: The H4 item and glance bullet tests still fail one past their ceilings, inside that same run.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The template's ceiling table, which a test compares with the checker constants | A leftover row would fail that test | The row and its assertion are removed together |
| Risk | Entries grow long with nothing to stop them | Low | The H4 item and glance bullet ceilings still bound the structure, and the template keeps its usual-length targets |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None
<!-- /ANCHOR:questions -->

---
