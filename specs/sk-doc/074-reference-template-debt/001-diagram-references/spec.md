---
title: "Feature Specification: Phase 1: diagram-references"
description: "The 34 sk-design-diagram references fail the reference format because they have no overview section, use sentence-case titles and skip the rule between sections. This phase fixes all of them with one script and proves that no section reference moved to a different heading."
trigger_phrases:
  - "diagram references"
  - "phase 1 diagram references"
  - "diagram reference overview section"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 1: diagram-references

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
| **Phase** | 1 of 2 |
| **Predecessor** | None |
| **Successor** | 002-remaining-references |
| **Handoff Criteria** | All 34 files report 0 issues, the before and after table has no mismatch and the routing replay is byte-identical |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Bring every skill reference doc that fails the reference format up to it specification.

**Scope Boundary**: The tracked docs under `.skilled/skills/sk-design/sk-design-diagram/references/` that fail `validate_document.py`. No resource path changes and no wording changes.

**Dependencies**:
- `validate_document.py` for the per-file counts
- `leaf-route-replay.cjs` for the routing proof

**Deliverables**:
- 34 references that report `Total issues: 0`
- A before and after table with one row for every section reference that moved
- A second scan showing no section reference points at a missing section

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 27 type files, the catalog, the three import and export procedures, the output spec, the derivation record and the icon primitive all fail the reference format. Thirty-three of them open with a one-paragraph intro under the title and go straight to `## 1.` of real content, so the required overview section is missing. Twenty-seven also use sentence-case section titles, and many put no `---` rule between sections. The files cite their own sections as `§N` and cite each other as `type-x.md §N`, so inserting an overview section shifts every number those citations rely on.

### Purpose
Every file reports 0 issues and every `§N` still lands on the heading it named before.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ validate_document.py <file>   (34 files, before)
  190 issues in total, 1 to 14 per file
  33 x missing_required_section, 27 x h2_not_uppercase, 1 x general_h2_separator
$ validate_document.py <file>   (34 files, after)
  Total issues: 0 for every file
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Wrap the intro under each title as `## 1. OVERVIEW` and keep its prose as written
- Renumber every later numbered section and every `### N.M` heading by one
- Rewrite every `§N` and `§N.M` that points at a renumbered file, code fences included
- Capitalise section titles outside backticks and add the `---` rule above each numbered section after the first

### Out of Scope
- References to `SKILL.md`, whose numbering does not change
- Any file outside `sk-design-diagram/references/` that cites these files by section, because none does
- The ascii-format, onboarding, style-guide and router-pseudocode references, which already pass

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-design/sk-design-diagram/references/types/type-*.md` (27) | Modify | Overview section, renumbering, capital titles, rules |
| `.skilled/skills/sk-design/sk-design-diagram/references/import-export/{export,import-drawio,import-mermaid}.md` | Modify | Same, plus `output-spec.md §N` citations |
| `.skilled/skills/sk-design/sk-design-diagram/references/foundations/output-spec.md` | Modify | Overview section and renumbering |
| `.skilled/skills/sk-design/sk-design-diagram/references/foundations/derivation-record.md` | Modify | One missing `---` rule |
| `.skilled/skills/sk-design/sk-design-diagram/references/primitives/primitive-icons.md` | Modify | Overview section and renumbering |
| `.skilled/skills/sk-design/sk-design-diagram/references/catalog.md` | Modify | Overview section, a numbered "Not indexed" section and a rule |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | All 34 files report `Total issues: 0` from `validate_document.py` |
| REQ-002 | Every rewritten section reference lands on a heading with the same words as before, shown by a table built from the new text and not from the renumbering map |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Routing does not change: the leaf replay totals line and report stay identical |
| REQ-004 | Nothing else in the files changes, shown by a comparison that removes only the allowed edits |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate_document.py` prints `Total issues: 0` for all 34 files
- **SC-002**: The before and after table has 125 rows and 0 mismatches
- **SC-003**: The replay totals line reads `gold=64 scored=56 tied=3 mean_f1=0.9161 exact=49` before and after, and the two reports compare equal
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A bare `§N` belongs to `SKILL.md` and is renumbered as a self reference | High | The script lists every reference with its context and reason, and the 21 it leaves alone are reviewed by hand |
| Risk | A citation outside the 34 files breaks | Med | A repo-wide search for `§`, `#anchor` and section words found none |
| Dependency | `catalog-bidirectional` reads the catalog between two sentinels | Low | The sentinels stay where they were and the corpus check is rerun |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- The script plans, applies and verifies the 34 files in a few seconds.

### Security
- No credential or network access. The script reads and writes tracked docs only.

### Reliability
- Apply refuses to write when the table has a mismatch or a reference cannot be placed.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a file that already has an overview section keeps its numbers and only gains missing rules (`derivation-record.md`).
- Maximum input: `type-process.md` carries 26 rewritten references and 13 shifted subsection headings.
- Failure path: a reference with no matching section stops the run instead of being guessed.
- Mixed targets: one line can cite a sibling type file, another file and `SKILL.md`, so each reference is placed on its own.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 34 docs, one mechanical transform |
| Risk | 10/25 | Citations can drift silently |
| Research | 8/20 | Classifying 146 references |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None for this phase. Two older citations are recorded as adjacent defects in `implementation-summary.md` and left as written.
<!-- /ANCHOR:questions -->

---
