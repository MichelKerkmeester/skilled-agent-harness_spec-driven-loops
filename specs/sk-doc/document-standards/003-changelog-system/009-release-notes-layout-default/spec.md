---
title: "Feature Specification: Release-Notes Layout Default"
description: "The changelog template still asks for bold glance bullets, inline breaking markers and one paragraph per item, while the published v4.0.2.1 release notes use a newer layout the operator chose as the default."
trigger_phrases:
  - "release notes layout default"
  - "phase 9 release notes layout default"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Release-Notes Layout Default

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
| **Phase** | 9 of 9 |
| **Predecessor** | 008-spec-line-position-gates |
| **Successor** | None |
| **Handoff Criteria** | The template, SKILL.md and both workflows describe the v4.0.2.1 layout, and the shape check passes that entry with no skipped rule |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the changelog system specification.

**Scope Boundary**: The `sk-create-changelog` template, contract, workflows, shape check, tests and docs, plus the open battery findings on old entries.

**Dependencies**:
- The `spec-position` rule from phase 8
- The published v4.0.2.1 entry as the layout model

**Deliverables**:
- A template and contract that describe the v4.0.2.1 layout as the default
- A shape check that reads the glance table and a folded spec-folder list
- Old entries with the spec-folder line last, after an `&nbsp;` line
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The v4.0.2.1 release notes use short bullets under short paragraphs, a linked glance table, alert boxes and folded blocks. The template still asks for bold glance bullets with section comments, inline breaking markers and one paragraph per item. The shape check skips the glance order on the new table and fails the folded spec-folder list, so the model entry fails its own gate.

### Purpose
A changelog written from the template reads like the v4.0.2.1 release notes and passes every gate.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ python3 .skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py .skilled/changelog/skilled/v4.0.2.1.md
FAIL .skilled/changelog/skilled/v4.0.2.1.md
  [spec-position] line 729: content follows the spec-folder line. Move the line to the end of the entry
  [spec-position] line 729: put an "&nbsp;" line before the spec-folder line
  note: glance-order skipped: no glance bullet carries a section tag
SUMMARY files=1 pass=0 fail=1
```

The same rule over every skill and release changelog found 5 entries with content after the spec-folder line and 266 with no `&nbsp;` line before it. Packet-local changelogs add 3 and 1,654.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite the template's format, field guidelines, structure rules and length table for the v4.0.2.1 layout.
- Update the SKILL.md contract, rules and validation lists, and both `/create:changelog` workflows, to match.
- Teach the shape check the glance table's Section column and a spec-folder list folded in a closing `<details>` block, and stop it counting HTML tag lines as sentences.
- Move the spec-folder line to the end of the entries that have content after it, and add the missing `&nbsp;` line before it.

### Out of Scope
- Rewriting older entries into the new layout - they keep the layout they shipped with.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md` | Modify | The new default layout |
| `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md` | Modify | Contract, rules and validation lists |
| `.skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py` | Modify | Glance table, folded spec list, HTML lines |
| `.skilled/skills/sk-doc/scripts/tests/test_check_changelog_shape.py` | Modify | Tests for the three checker changes |
| `.skilled/commands/create/assets/create-changelog-auto.yaml` | Modify | Format and checks |
| `.skilled/commands/create/assets/create-changelog-confirm.yaml` | Modify | Format and checks |
| `.skilled/skills/sk-doc/sk-create-changelog/references/worked-examples.md` | Modify | Examples in the new layout |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The shape check passes the v4.0.2.1 entry with no skipped rule. | The checker prints `PASS` for it with no note, and `test_the_model_entry_passes_every_rule` passes. |
| REQ-002 | The template and SKILL.md describe the v4.0.2.1 layout as the default. | `rg -n "bold lead-in" changelog-template.md` finds only the rule that forbids it. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Both workflows describe the same layout. | `rg -n "bold lead-in sentence" create-changelog-*.yaml` finds nothing. |
| REQ-004 | Every skill and release changelog closes with its spec-folder line after an `&nbsp;` line. | The checker over every entry prints no `[spec-position]` line. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The v4.0.2.1 entry passes the shape check with no note.
- **SC-002**: The changelog tests pass with no failure.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The published v4.0.2.1 entry | The template would describe a layout no entry shows | The tests read that entry as the model |
| Risk | A bulk edit of old entries changes more than the spec-folder line | Medium | A script that only inserts an `&nbsp;` line, in its own commit, rerun to confirm a clean second pass |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None
<!-- /ANCHOR:questions -->

---
