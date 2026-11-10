---
title: "Feature Specification: Phase 9: reference-restructure"
description: "The nine sk-code-frontend references render badly and read out of order: each rule block collapses into one paragraph, six Deeper lines render as headings, the overview sections are content sections with OVERVIEW glued on, and Angular-only rules sit in the generic web layer. This phase rebuilds each file to sk-doc's reference template and removes the Angular specifics."
trigger_phrases:
  - "reference restructure"
  - "phase 9 reference restructure"
  - "frontend reference layout"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 9: reference-restructure

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-03 |
| **Branch** | `worktrees/315-frontend-reference-restructure` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 9 |
| **Predecessor** | 008-release-coverage |
| **Successor** | None |
| **Handoff Criteria** | Every frontend reference renders each rule field on its own line, opens with a real overview, holds no Angular-specific rule, and every link into it still resolves |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the frontend upstream proposals packet.

**Scope Boundary**: the nine authored files in `.skilled/skills/sk-code/sk-code-frontend/references/`, the links into them from other files, and the frontend packet changelog. The three workflow symlinks in that folder are not authored here.

**Dependencies**:
- Phase 008 closed, and main at `cd00629166` with every routing gate green.

**Deliverables**:
- Nine references rebuilt to the sk-doc reference template, with stable rule ids and stable externally linked section anchors.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The rule files write each rule as six bold-labelled lines with no blank line or list marker between them, so Markdown joins them into one paragraph. In `web-markup-and-css.md`, six `**Deeper:**` lines sit directly above a `---`, which renders them as H2 headings. An earlier fix glued `OVERVIEW AND` onto each file's first content section instead of writing an overview. Angular-only rules (`CS3`'s title, `A15`, `A16`, `I8` and an Angular framework block) sit in a layer meant to be framework-neutral web practice.

### Purpose
Each reference reads in order and renders as written: a one-line intro, a real overview, content sections with each rule's fields on their own lines, and no Angular-specific rule.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ for f in *.md; do awk 'NR>12 && /^---$/ && prev!="" {print FILENAME":"NR} {prev=$0}' "$f"; done
web-markup-and-css.md:47
web-markup-and-css.md:73
web-markup-and-css.md:88
web-markup-and-css.md:104
web-markup-and-css.md:116
web-markup-and-css.md:128
$ grep -c '^\*\*\(Rule\|Why\|When not to\|Pitfall\|Support\|See also\)\.\*\*' *.md
web-cascade-and-selectors.md:55
web-accessibility-patterns.md:111
web-elements-and-attributes.md:65
web-internationalization.md:54
web-layout-and-sizing.md:70
web-performance-and-loading.md:66
$ grep -c -i angular *.md | grep -v ':0'
web-accessibility-patterns.md:3
web-cascade-and-selectors.md:1
web-markup-and-css.md:4
web-internationalization.md:4
$ grep -n '^## 1\.' web-cascade-and-selectors.md web-performance-and-loading.md
web-cascade-and-selectors.md:19:## 1. OVERVIEW AND CASCADE AND SPECIFICITY
web-performance-and-loading.md:19:## 1. OVERVIEW AND FIELD METRICS AND LCP
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite each rule block as a list, one field per bullet, so every field renders on its own line.
- Give each file a one-line intro and a real `## 1. OVERVIEW` (purpose, when to use, what the file does not own), and move the first content block into its own numbered section.
- Put misplaced content where it belongs: the `bdg` capture recipes from `web-markup-and-css.md` into `figma-to-code.md`, P10 out of the image-delivery section, and one `Support` line per rule.
- Remove the Angular-specific content: the Angular framework block, `I8`, the Angular section in the internationalization file and Angular API names, and make `CS3`, `A15`, `A16`, `A17` and `A18` framework-neutral.
- Update every link the moves change, and record the change in the frontend packet changelog.

### Out of Scope
- The rule content itself, beyond the Angular removal: no rule is added, and none is reworded beyond its layout.
- The packet's `SKILL.md`, `ROUTER.md` and routing vocabulary, because no reference is added, renamed or deleted.
- The three workflow symlinks, which point at shared files owned elsewhere.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `sk-code-frontend/references/web-*.md` (7 files) | Modify | Template layout, field lists, real overview, Angular removal |
| `sk-code-frontend/references/frontend-practice.md` | Modify | Real overview; section 6 no longer repeats section 1 |
| `sk-code-frontend/references/figma-to-code.md` | Modify | Real overview; receives the `bdg` capture recipes |
| Files linking to a moved anchor | Modify | Link follows the moved section |
| `sk-code-frontend/changelog/` | Create | Patch entry for the restructure |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No rule field line starts at column 0 with a bold label, and no text line sits directly above a `---` in any of the nine files |
| REQ-002 | Every relative link into the references from `.skilled/` and the root README resolves to an existing file and heading anchor |
| REQ-003 | `validate_document.py` passes on each of the nine files |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | Each file's first numbered section is `## 1. OVERVIEW` and holds no rule item |
| REQ-005 | `grep -i angular` over the nine files prints nothing |
| REQ-006 | Every rule id present before the change (`CS1`-`CS9`, `A1`-`A18`, `EA1`-`EA9`, `I1`-`I9` less `I8`, `L1`-`L11`, `P1`-`P10`) is still present |
| REQ-007 | The sk-code playbooks, the compiled-route suites and router reach on sk-code still pass |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The two measured-behavior checks above print nothing for every file.
- **SC-002**: A reader of any rule sees Rule, Why, When not to, Pitfall, Support and See also as six separate lines.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | opencode-go DeepSeek V4.1 Flash for the builds | No builds | On a refusal or quota stop, stop and ask; never re-route |
| Risk | A renamed heading breaks an inbound anchor | Med | Keep externally linked section titles and rule-id headings; a link check over `.skilled/` and the README after each build |
| Risk | A builder rewords rule content while relaying it | Med | The brief forbids rewording; each diff is read and rule ids are counted before and after |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Reliability
- **NFR-R01**: Every rule's text is unchanged apart from layout and the Angular removal.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- A rule with two `Support` lines keeps both features in one `Support` bullet.
- A rule whose only content is Angular-specific (`I8`) is removed, and `I9` keeps its id so the gap is visible rather than renumbered.
- `frontend-practice.md` has no rule blocks; it gets the overview change only.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Nine documents, about 1,400 lines, plus inbound links |
| Risk | 6/25 | Documentation only; anchors are the one breakable contract |
| Research | 2/20 | The defects are measured |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The operator chose to remove the Angular-specific rules on 2026-11-03.
<!-- /ANCHOR:questions -->

---
