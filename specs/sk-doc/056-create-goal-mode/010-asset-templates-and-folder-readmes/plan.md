---
title: "Implementation Plan: Phase 10: asset-templates-and-folder-readmes"
description: "Build three per-kind goal templates from the rendered goal.md.tmpl, guard them with a parity test and the checker, document the code folders, retire the references index and republish routing."
trigger_phrases:
  - "goal template plan"
  - "template parity approach"
  - "create-goal routing republish"
  - "code folder readme plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 10: asset-templates-and-folder-readmes

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, Node.js CommonJS, YAML |
| **Framework** | sk-doc parent hub, compiled routing |
| **Storage** | None |
| **Testing** | `node:test`, sk-doc validators, compiled-route gates |

### Overview
Render `goal.md.tmpl` at a numbered level and at the `phase` level, then write three asset templates whose blocks keep the rendered fixed text and replace only the placeholder wording. A parity test resolves the template's own conditional blocks and compares fixed lines, and the checker reads each template's placeholder wording so an unfilled copy fails.
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
- [x] Tests passing
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Checked copies: system-spec-kit keeps the source template, and the mode keeps per-kind copies that a test holds to it.

### Key Components
- **Asset templates**: one blank per goal kind, inside `<!-- BEGIN TEMPLATE -->` and `<!-- END TEMPLATE -->` markers, as the sibling modes do.
- **Parity test**: resolves `IF level:` blocks in `goal.md.tmpl` for level `2` or `phase` and compares non-placeholder lines with the template block.
- **Checker**: merges the templates' objective, decision and criterion placeholders into its placeholder list.

### Data Flow
`goal.md.tmpl` → rendered at a level → template block with kind wording → author copies it into `goal.md` → checker rejects anything left unfilled.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `SKILL.md`, reference, command YAMLs, presentation, README, playbook | Told authors to render through system-spec-kit and keep no copy | Update | `rg -n 'inline-gate-renderer\|local template' sk-create-goal .skilled/commands/create` finds no workflow step left |
| `ROUTER.md`, `leaf-manifest.json`, compiled route | Named `references/README.md` and `assets/.gitkeep` | Update | Guard fresh, canary 22 of 22 |
| `check-goal.cjs` placeholder list | Matched only `goal.md.tmpl` wording | Update | Corpus report identical before and after |
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
| Unit | Parity per template, drift detection, unfilled-template rejection | `node --test` |
| Integration | Corpus report old versus new checker, compiled-route gates | `check-goal.cjs --all`, `compiled-route-*.cjs` |
| Manual | README, changelog and template voice and shape | `validate_document.py`, `hvr_scan.py`, the changelog shape checker |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `goal.md.tmpl` and `inline-gate-renderer.sh` | Internal | Green | The template text could not be rendered |
| Compiled-route tooling | Internal | Green | The hub would keep routing to the deleted index |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A routing gate fails after sync, or the parity test fails on the committed tree.
- **Procedure**: `compiled-route-sync.cjs --revert <rollback>` before finalize, or `git revert` of this phase's commit after it.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (render the template) ──► Core (templates, checker, READMEs, contract) ──► Verify (tests, routing, validation)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Under an hour |
| Core Implementation | Medium | A few hours |
| Verification | Medium | About an hour |
| **Total** | | **Half a day** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Rollback directory retained until the routing gates passed
- [x] No feature flag needed
- [x] Guard and canary checked before finalize

### Rollback Procedure
1. Before finalize, run `compiled-route-sync.cjs --revert` with the retained rollback path.
2. After commit, `git revert` the phase commit and republish the route.
3. Rerun the guard and the canary.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
