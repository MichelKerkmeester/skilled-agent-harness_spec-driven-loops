---
title: "Feature Specification: Phase 10: readme-text-diagrams"
description: "The skill README template asks for a Mermaid diagram, so 55 READMEs now carry one, while the repository has always drawn its diagrams as plain-text boxes. This phase returns the template and the 55 files to text diagrams."
trigger_phrases:
  - "readme text diagrams"
  - "phase 10 readme text diagrams"
  - "mermaid to text diagram readme"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 10: readme-text-diagrams

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-18 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 10 |
| **Predecessor** | 009-repo-rules-readme |
| **Successor** | None |
| **Handoff Criteria** | No tracked README holds a Mermaid fence, the template asks for a text diagram and every changed file passes the README gates |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the README template conformance specification. Phase 001 followed the new skill README template, which asks for a Mermaid diagram, and replaced the text diagram in `system-spec-kit/README.md`. The operator asked to go back to the plain-text diagrams the repository has always used.

**Scope Boundary**: the Mermaid fence in each of the 55 READMEs, the diagram lines of the skill README template and one rule line each in the README writing patterns and the quality checklist. Nothing else in a README changes.

**Dependencies**:
- Phase 001, which wrote most of the diagrams this phase redraws
- The `ascii-markdown` format of the sk-design diagram mode, which sets the box notation

**Deliverables**:
- 55 READMEs with a text diagram in place of the Mermaid fence
- A skill README template and README rules that ask for a text diagram and rule out Mermaid
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The skill README template created on 2026-11-16 asks every multi-step skill for "a small Mermaid diagram", and 55 READMEs now carry one. The rest of the repository draws its diagrams as box-drawing text in a `text` fence, which reads the same in a terminal, an editor and on GitHub.

### Purpose
Every README diagram is plain text again, and the template no longer asks for Mermaid.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ git ls-files '*README.md' | xargs rg -l '```mermaid' | wc -l
      56
$ ls -l .skilled/skills/mcp-code-mode/mcp-server/README.md
lrwxr-xr-x ... .skilled/skills/mcp-code-mode/mcp-server/README.md -> ../README.md
$ rg -n -i mermaid .skilled/skills/sk-doc/sk-create-readme/assets/skill-readme-template.md | wc -l
       5
$ git show d68e7fdf888 -- '*README.md' | rg -c '^-.*[┌└│├┐┘]'
65
```
One of the 56 paths is a link to another, so 55 files hold one Mermaid fence each. Commit `d68e7fdf888` removed 65 lines of box-drawing text while adding Mermaid, all from `system-spec-kit/README.md`, the packet lifecycle diagram among them. The other 54 files had no flow diagram before their Mermaid block.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Replace the Mermaid fence in each of the 55 READMEs with a `text` fence that draws the same flow in box-drawing characters
- Change the skill README template's section row, guidance line, example fence and two checklist rows to ask for a text diagram
- Add one line to the README writing patterns and one checklist line saying a README draws diagrams as text, never Mermaid

### Out of Scope
- A validator check that blocks a Mermaid fence - the operator did not choose it
- Any other line in the 55 READMEs - the other text was checked in its own phase
- The 13 reference-checker failures and 8 count-checker failures these files carry before the change - they predate this phase and are not diagram lines

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| The 55 READMEs from the enumeration in `plan.md` | Modify | Mermaid fence becomes a text diagram |
| `.skilled/skills/sk-doc/sk-create-readme/assets/skill-readme-template.md` | Modify | Ask for a text diagram |
| `.skilled/skills/sk-doc/sk-create-readme/references/readme/writing-patterns.md` | Modify | One rule line on diagrams |
| `.skilled/skills/sk-doc/sk-create-readme/references/readme/quality-and-checklist.md` | Modify | One checklist line |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json` | Modify | Add `.skilled/repo-rules`, which gained a README in phase 009, so the README manifest test reproduces again |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No tracked README holds a Mermaid fence, and each of the 55 holds a text diagram where its Mermaid fence was |
| REQ-002 | Each new diagram draws the same steps and branches as the Mermaid block it replaces, checked against the skill it describes by a session that did not write it |
| REQ-003 | Each changed README still prints `VALID` with 0 hard voice blockers, and neither README checker fails a file that passed before |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The skill README template and the README rules ask for a text diagram and name Mermaid as not used |
| REQ-005 | Every box in every new diagram closes on the column it opened on |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `git ls-files '*README.md' | xargs rg -l '```mermaid'` prints nothing.
- **SC-002**: `rg -n -i mermaid` on the skill README template prints only the guidance line and the checklist row that rule it out.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Hy4 Flash Free on the OpenCode Go route | A writer that stops leaves its file unchanged | Rerun that file alone, and the main session checks every file before the commit |
| Risk | A writer edits more than the diagram | Med | The main session diffs each file and accepts only changes inside the old fence |
| Risk | A tree marker such as `├──` in a flow diagram reads as a file path to the reference checker | Med | The writer brief forbids tree markers, and the reference checker runs on every file |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A, the change is documentation and runs no service.

### Security
- **NFR-S01**: Writer and reviewer briefs carry no secret, and each writer edits only its assigned README.

### Reliability
- **NFR-R01**: A diagram line stays at or under 100 characters so it reads without wrapping in a terminal.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a README whose Mermaid block a writer cannot read is left unchanged and listed as not done.
- Maximum input: the largest Mermaid block holds 11 lines, which fits one text diagram.
- Failure path: a file whose new diagram fails the box check or a gate is redrawn, or restored from git and listed as not done.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | 58 files, one block each, no code |
| Risk | 6/25 | Documentation only, every change inside one fence |
| Research | 6/20 | Each diagram is checked against its skill |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
