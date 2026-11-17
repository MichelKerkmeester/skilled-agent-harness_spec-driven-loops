---
title: "Feature Specification: Move the changelog spec-folder blockquote from under the summary to the end of the entry in the template and in every existing changelog"
description: "Every changelog puts its spec-folder blockquote right under the summary, so bookkeeping sits between the reader and the change. This packet moves it to the end of the entry in the template and in all 2,815 existing changelogs."
trigger_phrases:
  - "changelog spec folder at bottom"
  - "move the changelog spec folder blockquote from under"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Move the changelog spec-folder blockquote from under the summary to the end of the entry in the template and in every existing changelog

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-17 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The changelog template puts the `> Spec folder:` blockquote directly under the summary. A reader meets a packet path before they learn what changed, and every existing changelog copies that order.

### Purpose
The spec-folder blockquote closes each changelog entry, in the template and in every existing changelog in the repository.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ rg -l --glob '*.md' -i '^>\s*Spec folders?:' . | grep '/changelog/' | wc -l
    2815

placement profile of the 2,796 single-block files:
already in last 20% of the file: 1 of 2796
block has continuation quote lines ("> Parent packet" etc.): 1393
files with more than one spec-folder line: 19

$ sed -n 59,62p .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md
{Summary: a few short sentences, about 60 words in all, ...}

> Spec folder: `{path}`
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Move the spec-folder blockquote to the end of both template shapes, compact and expanded.
- State the new position in the SKILL.md contract and the worked example.
- Move the blockquote in every file under a `changelog/` folder, with a script for single-block files.
- Move each block in the 19 multi-block files with Hy4 Flash Free at high thinking, then check every output.

### Out of Scope
- Scratch copies, plans and research files that quote a changelog - they are not changelogs.
- The command YAML checklists - they check that the blockquote is present, not where it sits.
- Rewording any changelog - only the blockquote's position changes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md` | Modify | Blockquote last in both shapes |
| `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md` | Modify | Contract item 4 names the position |
| `.skilled/skills/sk-doc/sk-create-changelog/references/worked-examples.md` | Modify | Example and annotation follow the rule |
| 2,815 files under `**/changelog/` | Modify | Blockquote moved to the end |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every single-block changelog ends with its spec-folder blockquote | `move_spec_block.py changelog-files.txt` dry run reports 2,796 `already last` |
| REQ-002 | No text other than the blockquote and its spacing changes | A line-multiset check, ignoring blank and `&nbsp;` lines, matches before and after |
| REQ-003 | The template places the blockquote last in both shapes | `rg -n 'Spec folder' changelog-template.md` shows each line after its shape's last section |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Each block in a multi-block file sits at the end of its own dated section, or at the end of the file | A placement check passes for all 19 files |
| REQ-005 | The changelog gates give the same result per file before and after | `check_changelog_shape.py` and `validate_document.py --type changelog` diff clean over the 1,181 `.skilled` files |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The migration dry run prints `{'already last': 2796, 'spec lines': 19}`.
- **SC-002**: The before and after gate results over the 1,181 `.skilled` changelogs are identical.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Hy4 Flash Free on opencode-go | The 19 multi-block files wait | Edits run on copies, so a failed run changes nothing |
| Risk | A model rewords text while moving a line | High | Every output is checked line by line against its input before copy-back |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
N/A. The change edits documents and runs no service.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a file with no spec-folder line is not in the list and is not touched.
- Maximum input: a file with two or three blocks is skipped by the script and handled per section by Hy4.
- Failure path: a spec line inside a code fence is skipped and reported, never moved.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | 2,818 files, but one mechanical move |
| Risk | 8/25 | Docs only, fully reversible through git |
| Research | 4/20 | Placement profile and one model timing |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None
<!-- /ANCHOR:questions -->

---
