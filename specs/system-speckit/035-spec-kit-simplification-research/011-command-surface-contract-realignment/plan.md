---
title: "Implementation Plan: Command surface contract realignment"
description: "Census the synthesis in the main checkout, then rewrite the eight workflow assets to the level contract in one literal-replacement script, fix the help printer under a new test, and correct the six documents and the fixture."
trigger_phrases:
  - "command surface realignment plan"
  - "workflow assets literal replacement"
  - "help printer test"
  - "acceptance criteria step"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Command surface contract realignment

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | YAML workflow assets, Bash printer, TypeScript test, Markdown |
| **Framework** | None |
| **Storage** | None |
| **Testing** | vitest for the help printer, the template parity suite and the drift guard; PyYAML parse of every asset |

### Overview
Every synthesis row was re-measured in the main checkout before anything changed, which surfaced the command-surface residue the lane had not weighed. The assets were rewritten by one script that replaces each site literally and asserts zero residue; the help printer was changed to derive its categories from the registry and a test now holds it there; the six document corrections and the fixture removal followed.
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
Contract-first alignment, continued from child 010: the level contract is the one authority, and the command surface is brought to it.

### Key Components
- **`speckit-*.yaml`**: the eight workflow assets an agent executes; each now scaffolds and verifies `acceptance-criteria.md` and the tasks checklist
- **`validate.sh` help printer**: derives its category headings from the registry
- **`validate-help-lists-every-rule.vitest.ts`**: the guard over the printer

### Data Flow
Level contract → workflow asset required files and steps → agent. Registry → printer → `--help`. Registry → test → assertion.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `documentation_levels` and `available_templates` in eight assets | Level and template guidance | update | PyYAML parse; residue search |
| Steps 5 and 11 of the completion workflow, step 4 of the implementation workflow | Closure document authoring and verification | update | residue search; the renamed keys have no code reader |
| Presentation artifact lines | Dashboard and success output | update | residue search |
| `list_registry_rules` in `validate.sh` | Help output | update | `bash -n`; the new test; 39 rules printed |
| Six documents, one fixture, one comment | Prose and test residue | update | sk-doc validator; JSON parse; drift guard |

Required inventories:
- Same-class producers: `grep` for `checklist.md`, `level_contract_`, `T-YML`, `SPECKIT_BM25_ENGINE` and `four strict-only` across the command directory, the skill and the root.
- Consumers of changed symbols: `required_files`, `available_templates` and the step keys were searched across the skill, the sk-doc scripts and CI; only `check-level-match.sh` matched, and it builds its list from the contract.
- Matrix axes: command (complete, implement, plan, resume) by mode (auto, confirm); every cell rewritten by the same script.
- Algorithm invariant: a document appears in a workflow asset only when the level contract scaffolds it or lists it as an add-on.
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
| Unit | The new help test; the template parity suite; the env-reference drift guard; the full CLI project | vitest |
| Integration | `bash -n` and `--help` on the printer; PyYAML parse of the eight assets; JSON parse of the fixture; `npm run check` | bash, python, npm |
| Manual | Residue search; sk-doc validator on six documents | grep, python |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Censused ledger from 005 | Internal | Green | Nothing to align without it |
| Child 010's contract | Internal | Green | The assets would be brought to a contract that is not yet true |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a `/speckit:*` run fails a step that the rewritten asset names, or `--help` stops printing a category
- **Procedure**: `git revert` the single commit
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
| Core Implementation | Med | 1 hour |
| Verification | Low | 20 minutes |
| **Total** | | **About 2.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) - not needed; history holds the previous assets
- [x] Feature flag configured - none; the assets are read at command time
- [x] Monitoring alerts set - the help test is the alert

### Rollback Procedure
1. `git revert` the realignment commit
2. Rerun the help test and the parity suite
3. No stakeholders to notify; the surfaces are internal

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
