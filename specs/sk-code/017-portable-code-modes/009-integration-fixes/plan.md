---
title: "Implementation Plan: Integration fixes: doctor quality shows applied rules, implement dashboard uses runner verdicts, outside-repository surface rules documented"
description: "The doctor quality status asks the runner's --explain which checklists, overrides and hygiene rules apply over a sample of the tree, the implement dashboard takes the runner's gate values, and the quality docs state the outside-repository limit."
trigger_phrases:
  - "integration fixes plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Integration fixes: doctor quality shows applied rules, implement dashboard uses runner verdicts, outside-repository surface rules documented

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS, Markdown and YAML command assets |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `node --test` |

### Overview
The doctor script gains a status block that lists what the gate would apply, read from `quality-gate.cjs --explain` over one file per first three folders and extension. The implement dashboard's quality gate field takes the runner's gate values. Two quality docs state how an external repository declares its rules. Tests fail against the `HEAD` script and pass against the changed one.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified: the multi-file `--explain` with `sources` and `overrides` is on main

### Definition of Done
- [x] All acceptance criteria met
- [x] `node --test .skilled/commands/doctor/scripts/tests/sk-code-quality-config.test.cjs` prints `pass 14` and `fail 0`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Caller of the runner's resolver.

### Key Components
- **`sk-code-quality-config.cjs` status**: samples the listed files, calls the runner's `--explain` in batches, merges the per-file checklist rows and reports them with the hygiene rules.
- **`quality-gate.cjs --explain`**: the one resolver for checklists, seats and override sections. It is read, never changed.

### Data Flow
`git ls-files --cached --others --exclude-standard` gives the file list. One regular file per sample key goes to `quality-gate.cjs --explain` in batches of 500. Each batch's `files[].checklists` rows merge by checklist file into seats, a sampled-file count and the override block. Batch `errors` and `config.warnings` merge, and a warning another batch reports as an error is dropped. The hygiene list comes from the checker's own rule table minus `commentHygiene.disableRules`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sk-code-quality-config.cjs` status | Reports config, trust, tools and layers | update | `node --test` doctor quality suite |
| `doctor-sk-code-quality.yaml`, `doctor-sk-code-presentation.txt` | Workflow and rendering for the status | update | `bash .skilled/commands/doctor/scripts/route-validate.sh` |
| `quality-gate.cjs --explain` | Resolver the status reads | unchanged | runner contract section 3 |
| `speckit-implement-presentation.txt` dashboard | Renders the quality gate field | update | `node --test .opencode/plugins/tests/speckit-goal-offer-contract.test.cjs` |
| `speckit-implement.yaml` | Holds scored pre and post gates, no dashboard value list | not a consumer | `rg -n -i 'not-run|blocked|quality gate' .skilled/commands/speckit/assets/speckit-implement.yaml` |
| Doctor READMEs, feature catalog, playbook | Describe the status | unchanged here | Left to the docs-alignment lane |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup measures the sample, implementation changes the script, assets and docs, and verification runs the suites both ways.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Status `applies` block on throwaway git fixtures | `node --test` |
| Integration | Every doctor suite, route validation, setup battery, speckit presentation contract | `node --test`, `route-validate.sh`, `sk-code-setup-check.cjs` |
| Manual | Status on this repository and on a scratch fixture | Terminal |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Multi-file `--explain` with `sources` and `overrides` | Internal | Green, on main | The status could not resolve seats or overrides |
| `commentHygiene.disableRules` and `readHygieneRules` | Internal | Green, on main | No disabled list to show |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the status slows an interactive doctor run past a few seconds, or a repository's status fails on a checklist error the operator disputes.
- **Procedure**: revert the commit. The status then returns to config, trust, tools and layers, and nothing else reads the `applies` field.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | The landed explain and hygiene children | Implementation |
| Implementation | Setup's sample measurement | Verification |
| Verification | Implementation | Handback |
<!-- /ANCHOR:phase-deps -->

---
