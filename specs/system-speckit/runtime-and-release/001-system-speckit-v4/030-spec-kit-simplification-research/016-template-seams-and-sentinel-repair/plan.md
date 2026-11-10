---
title: "Implementation Plan: Template seams and sentinel repair"
description: "Census every round-two row, fix the sentinel and the validator seams first because the runtime tests depend on them, then the scaffolder, rules, templates and documents, then repair the seven suites and wire the runtime project into CI."
trigger_phrases:
  - "seams repair plan"
  - "sentinel gate plan"
  - "runtime project in ci"
  - "template source document list"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Template seams and sentinel repair

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CommonJS sentinel, TypeScript validators, bash scaffolder and rules, a JS helper, a JSON manifest, Markdown |
| **Framework** | None |
| **Testing** | The runtime and CLI vitest projects, the legacy and validation lanes, strict validation over the program and three older packets |

### Overview
The rows were censused first, which turned the sentinel finding into the cause of three of the runtime failures. The sentinel and the validator seams changed first, then the scaffolder, the rules and the helper, then the manifest and documents in one literal pass. The runtime suites were repaired at their own faults with the fixtures moved to `tasks.md`. Widening the helper's document list broke the file-presence rules on older packets; the list became its own helper command read only by the template-source rule.
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
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One authority per fact: one continuity set, one document list per rule, one place the verification checklist lives.

### Key Components
- **`completion-evidence-sentinel.cjs`**: gates on the tasks verification section
- **`spec-doc-structure.ts`**: exports the continuity set and collects optional add-ons
- **`template-structure.js`**: `docs` for presence rules, `template-docs` for the marker rule

### Data Flow
Stop hook → sentinel → `tasks.md` protocol anchor → `check-completion.sh --json` → advisory. Contract → helper list → rule.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Sentinel gate | Completion advisory | update | sentinel suite; the fixture writes the tasks section |
| Continuity set | Two validator readers | unify | runtime project; strict validation over nineteen packets |
| Scaffolder flags | `create.sh` | remove one | goldens and the `--with-goal` scaffold case |
| Rule document lists | ToC and template-source rules | update | strict validation over the program and three older packets |
| Runtime suites | Seven files | repair | runtime project green |

Required inventories:
- Same-class producers: `grep` for `checklist.md`, `sharded`, `privateTaxonomy`, `stress-test` and `scripts/dist` across the runtime, the templates and the documents.
- Consumers of changed symbols: the helper's `docs` command has three callers, which is why the new list got its own command.
- Matrix axes: level (1, 2, 3, 3+, phase, review, research) by document class, for the parity pins.
- Algorithm invariant: a document is checked for a template marker only when a template renders it for an author.
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
| Unit | The seven repaired suites; goldens; parity | vitest |
| Integration | Runtime and CLI builds; the full runtime and CLI projects; the legacy and validation lanes; strict validation | npm, bash |
| Manual | Residue searches; sk-doc validator on touched documents | grep, python |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Lane 004's round-two census | Internal | Green | Nothing to fix without it |
| Child 014's CI lanes | Internal | Green | The runtime project joins the step they created |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the sentinel advises where it should not, or a rule fails packets it passed
- **Procedure**: `git revert` the single commit and rebuild the runtime and CLI
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Med | 1 hour of census |
| Core Implementation | High | 2 hours |
| Verification | Med | 45 minutes |
| **Total** | | **About 4 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) - not needed
- [x] Feature flag configured - none
- [x] Monitoring alerts set - the CI lanes are the alert

### Rollback Procedure
1. `git revert` the commit
2. Rebuild the runtime and the CLI
3. No stakeholders to notify

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
