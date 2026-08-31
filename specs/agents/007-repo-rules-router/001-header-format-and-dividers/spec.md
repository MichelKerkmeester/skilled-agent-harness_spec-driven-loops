---
title: "Feature Specification: Phase 1: Numbered-Header Casing and Section Dividers"
description: "The seven governance documents this packet shipped — REPO RULES.md and the six files under repo-rules/ — carry 50 numbered section headers in sentence case and zero horizontal dividers, so a rule file reads as one unbroken column and does not match the ALL-CAPS numbered convention that AGENTS.md and every system-spec-kit reference already use. This phase applies that convention to the seven files as a pure formatting pass."
trigger_phrases:
  - "repo rules formatting"
  - "numbered header casing"
  - "section dividers"
  - "uppercase section headers"
  - "rule file readability"
importance_tier: "normal"
contextType: "specification"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: Numbered-Header Casing and Section Dividers

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-31 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 4 |
| **Predecessor** | None |
| **Successor** | 002-delegation-orchestration-rule |
| **Handoff Criteria** | All 50 numbered headers uppercase, all numbered sections divider-separated, zero rule-sentence changes in the diff |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the repo-rules router packet.

**Scope Boundary**: The seven governance markdown files shipped by this packet's baseline — `REPO RULES.md` at the repository root and the six files under `repo-rules/`. Presentation only: casing of numbered `##` headers and insertion of `---` dividers. No rule text, no table content, no link, and no file outside those seven.

**Dependencies**:
- The baseline packet work is shipped and validating (`RESULT: PASSED`, Errors 0, Warnings 0 as of 2026-08-31).

**Deliverables**:
- 50 numbered `##` headers converted to ALL CAPS across the seven files.
- A `---` divider between every pair of consecutive numbered sections, and one closing the preamble before the first numbered section.
- A recorded before/after count proving the pass touched only heading lines and blank/divider lines.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The seven governance files carry 50 numbered `##` section headers written in sentence case (`## 1. How to use this`, `## 3. The rollback sentence`) and contain zero `---` dividers. Every other governance surface in this repository uses the opposite convention: `AGENTS.md` numbers its sections in caps with dividers between them, and so does every `system-spec-kit` reference document, including `phase-definitions.md`. The inconsistency costs legibility exactly where legibility is the product — a rule file is read mid-task, under time pressure, to answer one question, and an unbroken column of same-weight headings makes the reader scan rather than jump.

### Purpose
Bring the seven files to the repository's established numbered-section convention — uppercase headers, dividers between sections — without altering a single rule.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Uppercasing the text of every `^## <n>. ` header in the seven files.
- Inserting `---` between consecutive numbered sections, and between the preamble block and the first numbered section.
- A verification pass proving the diff contains only heading lines, divider lines, and the blank lines that surround them.

### Out of Scope
- **Unnumbered headers** (`## Fires when`, `## The rule`, `### Precedence`) - the operator scoped the change to numbered section headers; these are preamble and sub-structure, and recasing them would flatten the visual hierarchy the numbered headers are gaining.
- **Rule content, tables, links, and ordering** - this is a formatting pass; changing what a rule says belongs to phases 2 and 4.
- **`AGENTS.md`** - already conforms to the convention being applied.
- **Any other markdown in the repository** - the operator named this packet's own governance files; a repo-wide sweep is a different, much larger piece of work.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `REPO RULES.md` | Modify | 4 numbered headers uppercased, dividers inserted |
| `repo-rules/overengineering.md` | Modify | 6 numbered headers uppercased, dividers inserted |
| `repo-rules/scope-discipline.md` | Modify | 8 numbered headers uppercased, dividers inserted |
| `repo-rules/evidence-and-proof.md` | Modify | 11 numbered headers uppercased, dividers inserted |
| `repo-rules/blast-radius.md` | Modify | 7 numbered headers uppercased, dividers inserted |
| `repo-rules/root-cause.md` | Modify | 8 numbered headers uppercased, dividers inserted |
| `repo-rules/uncertainty-and-honesty.md` | Modify | 6 numbered headers uppercased, dividers inserted |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every `^## <n>. ` header in the seven files renders its text in ALL CAPS, with the number, the period, and inline code spans left intact. |
| REQ-002 | A `---` divider separates every pair of consecutive numbered sections in each of the seven files. |
| REQ-003 | No rule sentence, table cell, list item, or link changes. The diff contains heading lines, divider lines, and surrounding blank lines only. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | A `---` divider closes the preamble block immediately before the first numbered section of each file, so the numbered body is delimited on both sides. |
| REQ-005 | The router's own trigger and index tables still resolve to files that exist after the pass. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `grep -cE '^## [0-9]+\. '` and `grep -cE '^## [0-9]+\. [^a-z]*$'` return the same number for each of the seven files.
- **SC-002**: Each file's `---` count is at least its numbered-header count, and no two dividers are adjacent.
- **SC-003**: `git diff -U0` over the seven files shows changed lines that are exclusively `## `-prefixed, `---`, or empty.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A naive uppercase transform mangles inline code spans, filenames, or a proper noun inside a heading | Med — a heading like `` ## 3. Two signals `AGENTS.md` does not carry `` must keep the code span readable | Uppercase the heading text but leave backticked spans byte-identical; verify by diffing only heading lines |
| Risk | Divider insertion collides with an existing horizontal rule and produces `---` `---` | Low — currently zero dividers exist in all seven files, measured | Insert only where the preceding non-blank line is not already `---`; assert no adjacent dividers after the pass |
| Risk | A blanket regex catches numbered headings inside fenced code blocks | Low — no fenced block in these files contains a `## n.` line, measured | Restrict the transform to lines outside fenced regions and confirm the changed-line count matches the measured header count |
| Dependency | `REPO RULES.md` link targets under `repo-rules/` | Broken links make the router useless | Filenames are untouched by this phase; links re-resolved as a closing check |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Context Cost
- **NFR-C01**: Divider and casing changes add fewer than 60 lines in total across the seven files, so a triggered rule load costs essentially what it costs today.
- **NFR-C02**: No file crosses the ~160-line ceiling the parent packet set for a single rule file.

### Legibility
- **NFR-L01**: A reader scanning a rule file can locate a numbered section by heading weight alone, without reading body text.
- **NFR-L02**: The seven files match `AGENTS.md` and the `system-spec-kit` references, so a reader moving between governance documents meets one convention.

### Reversibility
- **NFR-R01**: The entire phase is revertible with a single `git checkout` of seven paths; no generated artifact depends on the heading casing.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Heading Content
- Heading containing an inline code span: the span's contents stay byte-identical; only surrounding prose uppercases.
- Heading already fully uppercase: left unchanged, and not double-counted as a change.
- Heading containing a quoted phrase or an apostrophe: punctuation is preserved verbatim.

### Divider Placement
- Two numbered sections separated only by a sub-heading: the divider goes immediately before the numbered heading, not before the sub-heading.
- Last numbered section in a file: no trailing divider is added after it.
- A file that already ends with a horizontal rule: no second rule appended.

### Verification Boundaries
- A file with zero numbered headers: skipped, and reported as skipped rather than silently passing.
- The transform run twice: idempotent — the second run produces an empty diff.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | 7 files, ~110 changed lines, presentation only |
| Risk | 4/25 | Fully reversible, no runtime surface, no executable change |
| Research | 2/20 | Convention already established by `AGENTS.md`; nothing to investigate |
| **Total** | **12/70** | **Level 2** (inherited from the parent packet's level for consistency across children) |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should the unnumbered `## Fires when` / `## The rule` preamble headers eventually be numbered too, so every heading in a rule file is uppercase? **DEFERRED: outside the operator's stated scope for this phase; raised rather than absorbed.**
- Should a lint check enforce the convention on future rule files? **DEFERRED to phase 4, which decides the rule set's shape; enforcement tooling was explicitly out of scope for the parent packet.**
<!-- /ANCHOR:questions -->

---
