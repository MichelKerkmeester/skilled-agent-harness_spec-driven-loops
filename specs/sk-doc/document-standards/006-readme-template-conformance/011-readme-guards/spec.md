---
title: "Feature Specification: Phase 11: readme-guards"
description: "Two sk-create-skill templates still ask for Mermaid, nothing stops a Mermaid fence in a README, the README quality checklist trips the voice scan, and 19 READMEs fail the reference or count checker. This phase closes all four."
trigger_phrases:
  - "readme guards"
  - "phase 11 readme guards"
  - "readme mermaid check"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 11: readme-guards

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-18 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 11 of 11 |
| **Predecessor** | 010-readme-text-diagrams |
| **Successor** | None |
| **Handoff Criteria** | No template asks for Mermaid, the validator blocks a Mermaid fence in a README, and the 19 READMEs pass both checkers |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11** of the README template conformance specification. A fresh review of what phase 010 left open found one item 010 missed and four it had named. The operator asked to fix all of them.

**Scope Boundary**: the two sk-create-skill templates, the README quality checklist, `validate_document.py` and its structure tests, and the 19 READMEs the reference and count checkers fail. Only the flagged lines change in each README.

**Dependencies**:
- Phase 010, which redrew the README diagrams so a Mermaid check breaks nothing

**Deliverables**:
- Text-diagram wording in `parent-skill-readme-template.md` and `skill-md-template.md`
- A blocking `readme_mermaid` check with two tests
- 19 READMEs that pass both checkers
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 010 changed only the sk-create-readme templates, so the parent-skill README template still asks for a Mermaid diagram and carries one, and the `SKILL.md` template still says to use Mermaid. No check stops a new Mermaid fence. The README quality checklist quotes three banned phrases in plain quotes, which the voice scan reads as a hard blocker, and 19 READMEs fail the reference or count checker on lines that are mostly correct but carry no opt-out marker.

### Purpose
No template asks for Mermaid, the validator keeps it out of READMEs, and the README gates run clean on every file this program touched.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ rg -n -i mermaid .skilled/skills/sk-doc/sk-create-skill/assets
skill/skill-md-template.md:637:- Use Mermaid for flow diagrams so a parser can read them.
skill/skill-md-template.md:949:□ Mermaid diagrams use valid syntax (when used)
parent-skill/parent-skill-readme-template.md:89:Add a simple Mermaid diagram when it clarifies multi-step routing.
parent-skill/parent-skill-readme-template.md:171:[Optional Mermaid diagram for a multi-step routing flow. ...]
parent-skill/parent-skill-readme-template.md:173:```mermaid
$ hvr_scan.py quality-and-checklist.md
  118:55  hard   phrase-blocker       when it comes to
  hard blockers:          1
$ check_readme_references.py <19 files>
SUMMARY files=19 pass=6 fail=13
$ check_derived_readme_counts.py <19 files>
SUMMARY files=19 pass=11 fail=8
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Replace the Mermaid wording and example in the parent-skill README template and the two Mermaid lines in the `SKILL.md` template
- Put the three quoted phrases on line 118 of the README quality checklist in code spans
- Add a blocking check to `validate_document.py` for a top-level Mermaid fence in a file named `README.md`, with two tests
- Fix each of the 19 failing READMEs with a `readme-check` marker for a correct reference the checkout cannot hold, or a rewording where the checker misreads plain prose

### Out of Scope
- Teaching the reference checker about a `cd` earlier in a command - a marker covers the one case, and the checker's own docstring names markers as the route
- The two pre-existing voice blockers in `skill-md-template.md` - they sit on lines this phase does not touch
- Regenerating the trigger index - the generator reads the working tree, which holds another session's uncommitted files

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-readme-template.md` | Modify | Text diagram in place of Mermaid |
| `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-md-template.md` | Modify | Two lines ask for a text diagram |
| `.skilled/skills/sk-doc/sk-create-readme/references/readme/quality-and-checklist.md` | Modify | Code spans on line 118 |
| `.skilled/skills/sk-doc/shared/scripts/validate_document.py` | Modify | `validate_readme_diagrams` |
| `.skilled/skills/sk-doc/scripts/tests/test_structure_validation.py` | Modify | Two tests |
| The 19 READMEs from the enumeration in `plan.md` | Modify | Markers and rewordings |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No sk-doc template asks for Mermaid | `rg -n -i mermaid` over the sk-create-skill and sk-create-readme assets prints only lines that rule it out |
| REQ-002 | A Mermaid fence in a README blocks | The new tests fail before the check and pass after, and the check flags 0 of the tracked READMEs |
| REQ-003 | The 19 READMEs pass both checkers | `check_readme_references.py` and `check_derived_readme_counts.py` print `fail=0` on them |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The checklist voice flag clears | `hvr_scan.py` on `quality-and-checklist.md` reports `hard blockers: 0` |
| REQ-005 | Nothing else regresses | The 184 program files stay `VALID` with 0 hard blockers, and parity, the sk-doc suite and the link check pass |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both README checkers print `fail=0` on the 19 files, each marker carrying a reason.
- **SC-002**: A README with a ` ```mermaid ` fence prints `INVALID` with `readme_mermaid`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Hy4 Flash Free on the OpenCode Go route | A writer that stops leaves its file unchanged | Rerun that file alone, and the main session checks every file |
| Risk | A marker hides a reference that is really broken | Med | Each marker names why the path cannot exist in the checkout, and a separate reviewer confirms it |
| Risk | The check blocks a README that shows Mermaid as an example | Low | Only a top-level fence counts, tested with an example inside a longer outer fence |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
