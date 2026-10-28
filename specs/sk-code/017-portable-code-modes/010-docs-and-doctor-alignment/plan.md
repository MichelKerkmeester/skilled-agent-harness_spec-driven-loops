---
title: "Implementation Plan: Align docs, playbooks, catalogs and doctor text with the shipped portable quality and review behavior"
description: "Find every doc that describes sk-code quality or review, correct each stale claim at its source with sk-doc's matching template, add the foreign-repository playbook scenarios from commands that were run, then regenerate what the edits made stale."
trigger_phrases:
  - "docs and doctor alignment plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Align docs, playbooks, catalogs and doctor text with the shipped portable quality and review behavior

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, YAML and JSON documents, with Node and Python checkers |
| **Framework** | sk-doc templates for READMEs, playbooks, catalogs, changelogs and frontmatter |
| **Storage** | None |
| **Testing** | `validate_document.py`, `validate-playbook-package.cjs`, `validate_catalog_package.py`, the README checkers, the drift guards and the setup battery |

### Overview
Search every document that describes the quality or review behavior, record each stale claim with its line and the shipped fact, and fix it at the doc that owns it, keeping that doc's structure and voice. The foreign-repository scenarios are built from scratch fixtures whose commands were run, the review ones with a live `@review` agent. The generators then refresh the compiled-route manifest and the Hermes copies.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified: the landed quality and review children

### Definition of Done
- [x] All acceptance criteria met
- [x] `node .skilled/commands/doctor/scripts/sk-code-setup-check.cjs` prints `STATUS=OK legs=9`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation alignment: one owner doc per claim, one catalog leaf per feature, one playbook file per scenario.

### Key Components
- **Review docs and playbook**: floor, lens, `Rule sources:` line, agent verdict, three foreign-repository scenarios.
- **Quality docs and playbook**: the levers a repository has, the multi-file explain, two scenarios.
- **Hub, shared and SKILLED docs**: where each rule lives and who applies a row.
- **Doctor, hook and CI texts**: the hygiene line, the init suggestion and the config key reaching the hook and the job.
- **Generated files**: the compiled-route manifest and its archived copy, the Hermes copies.

### Data Flow
The scenarios build a fixture in a scratch folder, call the shared linter, the quality runner's explain entry and the runner, and for the review ones dispatch `@review` over the fixture. Their saved output is the expected output the playbook quotes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sk-code-review` README, reference, scripts README | Describes the review mode | Update | `grep -c "Rule sources"` 0 at `HEAD`, 9 now |
| `sk-code-quality` README, scripts READMEs, `SKILL.md` | Describes the quality mode | Update | `grep -c disableRules` 0 at `HEAD`, 3 now |
| Both playbooks and their roots | Prove the modes | Update | playbook validators `violations=0` |
| Feature catalog | Inventories the hub | Update and add leaves | `validate_catalog_package.py` PASS |
| Doctor command text and assets | Describe `/doctor:sk-code quality` | Update | doctor script tests 485 pass |
| Hook and CI READMEs | Describe the layers that run the hygiene check | Update | README reference checker shows no new failure |
| `check-comment-hygiene.sh`, `quality-gate.cjs`, the hooks | Behavior the docs describe | Unchanged, not a consumer | `git diff --stat` over `scripts/` is empty |
| `.skilled/agents/{review,deep-review,orchestrate,code}.md` | Agent text | Unchanged, already aligned | `grep -c "advisory"` and `REQUESTED_CHANGES` read as shipped |
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
| Unit | The shared linter, the config validation, the checker suites | `node --test`, the canary suite |
| Integration | The playbook scenarios, replayed command by command | Shell, the runner, the resolver, the linter |
| Manual | Three live `@review` runs over the foreign-repository fixtures | The `@review` agent, `check-review-final-line.js`, `check-review-findings.js` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The quality and review children | Internal | Green | The docs would describe nothing |
| The quality run applying override sections | Internal | Yellow, landed on `origin/main` only | Docs stay silent on it; round B documents it |
| The compiled-route and Hermes generators | Internal | Green | The setup battery would stay red |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a changed doc contradicts shipped behavior, or a gate regresses.
- **Procedure**: revert the commit for this child. The generated manifest and Hermes copies are rebuilt by the same two generators, so nothing else needs undoing.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (baselines, fixtures, stale-claim table) | The landed children | Implementation |
| Implementation (docs, playbooks, catalog, changelogs) | Setup | Generators, verification |
| Verification (checkers, generators, validate.sh) | Implementation | Closure |
<!-- /ANCHOR:phase-deps -->

---
