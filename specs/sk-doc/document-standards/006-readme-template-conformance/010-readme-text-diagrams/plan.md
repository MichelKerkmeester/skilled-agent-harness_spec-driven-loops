---
title: "Implementation Plan: Phase 10: readme-text-diagrams"
description: "Change the skill README template and the README rules to ask for a text diagram, then have one Hy4 writer session per README redraw its Mermaid block as box-drawing text and one Hy4 reviewer session check it against the skill."
trigger_phrases:
  - "readme text diagrams plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 10: readme-text-diagrams

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, box-drawing text |
| **Framework** | sk-doc `validate_document.py`, the sk-design diagram mode's `ascii-markdown` notation |
| **Storage** | None |
| **Testing** | `validate_document.py`, `hvr_scan.py`, both README checkers, a box alignment check, `run-script-tests.sh` |

### Overview
The main session changes the template and the two rule files first, so the rule the writers follow is the one on main. Each of the 55 READMEs then gets one writer session that swaps only its Mermaid fence for a text diagram of the same flow, and one reviewer session that checks the diagram against the skill. The main session diffs every file, reruns every check and owns the commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] No tracked README holds a Mermaid fence, and `run-script-tests.sh` prints `all sk-doc script tests passed`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One block swap per README, written and reviewed in separate sessions.

### Key Components
- **Writer sessions**: Hy4 Flash Free at `high` through cli-opencode (`opencode-go/hy4-flash-free#high`), one README per session, four at a time. Each reads the Mermaid block and the skill's `SKILL.md`, then replaces only that fence.
- **Reviewer sessions**: the same model, never the session that wrote the file. Each checks the new diagram's steps and branches against the old Mermaid block and the skill, read-only, and returns findings.
- **Main session**: diffs each file so only the old fence changed, runs the box alignment check, confirms each reviewer finding before applying it and reruns every gate.

### Enumeration
```bash
git ls-files '*README.md' | xargs rg -l '```mermaid' | while read f; do [ -L "$f" ] || echo "$f"; done
```
Expected: 55 lines. `mcp-code-mode/mcp-server/README.md` is a link to `mcp-code-mode/README.md`, so it is skipped.

### Writer Brief Constraints
- Replace the whole Mermaid fence, opening and closing lines included, with one `text` fence. Change no other line.
- Draw each Mermaid node as a box made of `┌ ─ ┐ │ └ ┘`, joined by `│` and `▼` down and `─▶` across, as in the diagram in `.skilled/hooks/README.md`.
- Keep each node's wording unless the skill's `SKILL.md` shows it is wrong.
- Use one box width for the whole diagram, and keep every line at 100 characters or fewer.
- Write a yes or no branch as `[YES]` and `[NO]` beside its arrow. Write any other edge label as plain words beside its arrow.
- Never use the tree markers `├──` or `└──`, because the reference checker reads a tree line as a file path.
- In `system-spec-kit/README.md`, start from the lifecycle diagram at `d68e7fdf888^` and keep it only where it still matches the skill.
- Run no git command. Report each command run with its exit status.

### Data Flow
The writer reads the Mermaid block and the skill and writes the diagram. The reviewer reads the old block from git, the new diagram and the skill, then returns findings. The main session applies confirmed findings and reruns the checks.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `skill-readme-template.md` | Tells a writer what a skill README holds | Update: text diagram, no Mermaid | `rg -n -i mermaid` prints only the line that rules it out |
| `writing-patterns.md`, `quality-and-checklist.md` | The README format rules and their checklist | Update: one line each | The lines read beside the alert and fold rule |
| `check_readme_references.py` | Reads tree lines in a README as paths | Not changed, but a tree marker in a diagram would feed it | The reference checker fails no file that passed before |
| `durable-directory-manifest.json` | The frozen list of directories that carry a README, read by `test_readme_manifest.py` | Update: add `.skilled/repo-rules`, missing since phase 009 added its README | `test_readme_manifest.py` prints `manifest=reproducible` |
| `baseline-readme-verdicts.json` | Holds the validator verdict CI expects per README | Unchanged unless a verdict moves | `test_readme_verdict_parity.py` prints `PARITY PASS` |
| `trigger-index.json` | Maps `trigger_phrases` to paths | Not touched: no frontmatter changes, and the tree's index files belong to another session | `git status` shows it unchanged by this phase |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each README's structure, voice and links | `validate_document.py`, `hvr_scan.py`, `check_readme_references.py`, `check_derived_readme_counts.py` |
| Unit | Each new diagram's boxes | A scratch box alignment check: every box closes on the columns it opened on |
| Integration | The README verdicts CI expects and the sk-doc suite | `test_readme_verdict_parity.py`, `run-script-tests.sh`, `check-markdown-links.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `opencode-go/hy4-flash-free#high` | External | Green, a one-turn run replied `OK` on 2026-11-18 | Writers and reviewers stop, and the operator picks another executor |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A text diagram reads worse than the Mermaid block it replaced, or a gate fails after the push
- **Procedure**: Revert the phase commit. The rule edits and all 55 diagrams sit in it
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Setup ──▶ Rule edits ──▶ Writers ──▶ Reviewers ──▶ Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup: enumeration and baseline | Nothing | Every edit |
| Rule edits: template and rules | The baseline | The writer brief |
| Writers and reviewers | The rule edits | Verification |
| Verification: gates and push | Every file reviewed | Closing the phase |
<!-- /ANCHOR:phase-deps -->

---
