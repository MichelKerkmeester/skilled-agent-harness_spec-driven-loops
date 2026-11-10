---
title: "Implementation Plan: Phase 9: reference-restructure"
description: "A deterministic script turns every rule block into a field list, then three parallel DeepSeek V4.1 Flash builds give each reference a real overview, move misplaced content and remove the Angular specifics, and this session checks links, rule ids and the routing gates."
trigger_phrases:
  - "reference restructure plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 9: reference-restructure

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown |
| **Framework** | sk-doc reference template, sk-code-frontend packet |
| **Storage** | None |
| **Testing** | `validate_document.py`, a link and anchor check, rule-id diff, playbook validator, compiled-route suites, router reach |

### Overview
The rule-block layout is mechanical, so a script converts it: each bold label line becomes a bullet, repeated `Support` lines merge and a blank line goes in before each `---`. No word changes in that step. The authored part, the overviews, the section moves and the Angular removal, runs as three DeepSeek V4.1 Flash max builds through `opencode run`, each owning three files. This session reads each diff, then checks links, rule ids and the gates.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Every link into the references resolves, and rule ids match the baseline less `I8`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Layout change over a fixed set of documents with two linking contracts: rule-id headings (`#cs4-...`) and section-number anchors (`#2-the-eleven-principles`). Files linked from outside by section number keep their numbering. Files linked by section number only from sibling references are renumbered, and the sibling link moves with them.

### Key Components
- **The rule files**: `web-cascade-and-selectors.md`, `web-layout-and-sizing.md`, `web-performance-and-loading.md`, `web-accessibility-patterns.md`, `web-elements-and-attributes.md`, `web-internationalization.md`.
- **The core and web layer**: `frontend-practice.md`, `web-markup-and-css.md`, `figma-to-code.md`, linked from `SKILL.md`, `ROUTER.md`, the hub docs and the mcp-figma playbook.

### Data Flow
`scratch/fieldlist.py` (layout) → three builds (`scratch/brief-a-css-perf.md`, `brief-b-a11y-i18n.md`, `brief-c-core-markup-figma.md`) → diff review → link, id and validator checks → gates.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Six rule files | Rule catalogs | Field lists, real overview, renumber | Validator, id diff |
| `web-markup-and-css.md` | Web layer | Real overview, Angular block out, `bdg` recipes out | Section anchors unchanged |
| `figma-to-code.md` | Figma check | Real overview, receives the recipes | `#5-the-check` unchanged |
| `frontend-practice.md` | Core | Real overview | `#2`, `#4`, `#5` unchanged |
| Inbound links | Navigation | Follow moved anchors | Link check over `.skilled/` and README |
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
| Unit | Each document's template shape | `python3 .skilled/skills/sk-doc/scripts/validate_document.py <file>` |
| Integration | Links and anchors into the references | A heading-slug check over every relative link in `.skilled/` and `README.md` |
| Regression | Routing and playbooks | `node --test .skilled/bin/tests/compiled-route-*.test.cjs`, the playbook validator, reach on sk-code |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `opencode run -m opencode-go/deepseek-v4.1-flash#max` | External | Green this session | No build; stop and ask |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a link, validator or routing gate that passed at `cd00629166` fails after the change.
- **Procedure**: `git revert` the restructure commit. The change is documentation only, so no route needs a republish.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 008 closed | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Phase close |
<!-- /ANCHOR:phase-deps -->

---
