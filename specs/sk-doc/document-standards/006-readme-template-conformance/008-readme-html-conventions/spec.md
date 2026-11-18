---
title: "Feature Specification: Phase 8: readme-html-conventions"
description: "READMEs never use GitHub alerts or folded tables, the README standards say nothing about either, and the validator passes a fold that is never closed. This phase writes the rule, adds a blocking fold check and pilots both on four files."
trigger_phrases:
  - "readme html conventions"
  - "phase 8 readme html conventions"
  - "readme alerts and folded tables"
  - "unclosed details fold check"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 8: readme-html-conventions

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-18 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 8 |
| **Predecessor** | 007-hook-code-folder-readmes |
| **Successor** | None |
| **Handoff Criteria** | The rule is in the README references, the fold check blocks a broken fold and passes every existing one, and the four pilot files validate |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the README template conformance specification. Phases 1 to 7 brought 184 READMEs to their templates. This phase adds two GitHub features those templates never covered.

**Scope Boundary**: The README writing reference, its checklist, one validator rule and four pilot files. No other README changes.

**Dependencies**:
- Phases 1 to 7, which left every README on its template and passing the validator

**Deliverables**:
- A rule for alerts and folded tables in `writing-patterns.md`, with a checklist line
- A blocking fold check in `validate_document.py`, with tests
- Two alerts and two folded tables on real files
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A warning that a hand edit is lost reads like any other bullet, and a 33-row file map pushes a README's story off the screen on GitHub. The README standards say nothing about alerts or folds, so no README uses them. The validator also passes a `<details>` fold that is never closed, which hides the rest of the page on GitHub.

### Purpose
A README author knows when to use an alert or a fold, and the validator refuses a broken fold.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ grep counts over the 905 tracked README.md files
> [!WARNING] / > [!NOTE] alerts: 0 files    <details>: 1 file (a script README)

$ fold scan over every tracked .md file, tags that start their line, outside code fences
{'live': 113, 'folds': 677, 'specs': 144}
no_summary_line all 1 live 0
unclosed all 1 live 0

$ validate_document.py --type readme on a copy of .claude/hooks/README.md with <details> opened and never closed
✅ VALID: .../probe/unclosed-README.md
Total issues: 0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add an "Alerts and Folded Tables" rule to the README writing reference and one line to its checklist
- Add a blocking fold check to `validate_document.py` for every document type: a `<details>` that never closes, a stray `</details>`, a fold with no `<summary>` line, and a `<summary>` line with no blank line after it
- Test the check against a good fold, each broken shape and a fold shown inside a code fence
- Pilot alerts on the hand-edit warnings in `.codex/SYNC.md` and `.devin/SYNC.md`
- Pilot folds on the hook map tables in `.claude/hooks/README.md` and `.devin/hooks/README.md`

### Out of Scope
- Folding or alerting any other README - the pilot decides whether the rule holds before a rollout
- The README templates in `assets/` - they point to the writing reference, which carries the rule
- Explicit `<a id>` anchors - only 7 anchored links into READMEs exist, and none needs one

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-readme/references/readme/writing-patterns.md` | Modify | The alert and fold rule |
| `.skilled/skills/sk-doc/sk-create-readme/references/readme/quality-and-checklist.md` | Modify | One checklist line |
| `.skilled/skills/sk-doc/shared/scripts/validate_document.py` | Modify | The fold check |
| `.skilled/skills/sk-doc/scripts/tests/test_structure_validation.py` | Modify | Tests for the fold check |
| `.codex/SYNC.md`, `.devin/SYNC.md` | Modify | Hand-edit warning as an alert |
| `.claude/hooks/README.md`, `.devin/hooks/README.md` | Modify | Hook map table folded |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `validate_document.py` reports a blocking issue for an unclosed fold, a stray close, a missing `<summary>` line and a `<summary>` line with no blank line after it |
| REQ-002 | The fold check finds 0 issues across the 677 existing folds, so no current document turns red |
| REQ-003 | The four pilot files print `VALID` with 0 hard voice blockers, and the README checkers still pass on them |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | `writing-patterns.md` says when to use an alert and when to fold a table, and the checklist carries one line for it |
| REQ-005 | GitHub's markdown renderer turns the pilot alert into an alert box and the pilot fold into a collapsed table |
| REQ-006 | The sk-doc suite exits 0 and the new tests pass |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The unclosed probe that prints `VALID` today prints `INVALID` with a fold issue.
- **SC-002**: A rescan of every tracked `.md` file with the new check reports 0 fold issues outside `specs/`.
- **SC-003**: `gh api markdown` renders the pilot SYNC file with an alert block and the pilot README with a `<details>` element holding a table.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | GitHub's renderer, reached through `gh api markdown` | Without it the render claim stays unchecked | Render the two pilot files once and read the HTML for the alert and the table |
| Risk | The check blocks a document that folds correctly in a way the scan missed | Med | Run it over every tracked `.md` file before landing, and keep fences and inline mentions out of it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
N/A: the change is a documentation rule and one line-scan check in an existing validator, with no service to measure.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a document with no fold produces no fold issue.
- Maximum input: a changelog with many folds, one after another, passes when each closes before the next opens or nests inside it.
- Failure path: a fold shown inside a code fence, or `<details>` named in inline code, is not a fold and produces no issue.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Two reference files, one validator rule with tests, four pilot files |
| Risk | 8/25 | A blocking rule in a shared validator, measured against every existing fold first |
| Research | 4/20 | The survey and the probes already ran |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
