---
title: "Implementation Plan: Phase 4: playbook-scenarios"
description: "Add an mcp-figma figma-to-code scenario category and a fundamentals unknown-project scenario, check a proposed token-or-scale scenario against the existing SKD-010 first, and keep both playbook packages valid with matching census counts."
trigger_phrases:
  - "playbook scenarios plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 4: playbook-scenarios

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown playbook scenarios |
| **Framework** | sk-create-manual-testing-playbook scenario contract |
| **Storage** | None |
| **Testing** | `validate-playbook-package.cjs --package <root>` |

### Overview
New scenario files land in two playbook packages, written to the sk-create-manual-testing-playbook contract, and each root index updates its census. The validator, run before and after, proves the counts and the contract.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `validate-playbook-package.cjs --package` exits 0 for mcp-figma at 20 scenarios in 7 categories and prints `PASS` for fundamentals
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Contract-shaped scenario files.

### Key Components
- **mcp-figma `figma-to-code/`**: three scenarios for the Figma read that feeds code and the five-pass check
- **fundamentals scenario**: an unknown project loads no profile
- **Root indexes**: category list and census the validator derives and compares

### Data Flow
An operator picks a scenario, runs its prompt, and compares the observed route and verdict with the scenario's expected outcome.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| mcp-figma playbook root | Lists six categories, census 17 | update | Validator output |
| fundamentals playbook root | Census 12 | update | Validator output |
| `SKD-010` scenario | Tests on-scale values | unchanged; compared | `scratch/skd-010-overlap.md` |
| Playbook validator | Checks the contract | not a consumer of a code change | Exit status |

Required inventories:
- Same-class producers: the Barter scenario copies in the primary checkout's gitignored `barter/ai-speckit/skilled/barter-overlays/` mcp-figma and fundamentals playbooks, read for shape only.
- Consumers of changed symbols: none.
- Matrix axes: two packages, before and after.
- Algorithm invariant: no scenario carries a Barter value.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup records both validator baselines and the SKD-010 comparison. Implementation writes the scenarios and indexes. Verification reruns the validator and greps for Barter values.

**Executors.** Research and verification dispatches go to DeepSeek V4.1 Flash 1017 through opencode-go, with the model literal confirmed from `cli-pi/SKILL.md` and `cli-opencode/references/providers-and-models.md` before the first dispatch. Builds dispatch to `cli-codex --model gpt-6-luna -c model_reasoning_effort="xhigh" -c service_tier="fast"`, never through a gateway.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Scenario contract per package | `validate-playbook-package.cjs` |
| Integration | One live run of the check scenario | The scenario's own prompt |
| Manual | Read each expected outcome | Reader check |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 `figma-to-code.md` | Internal | Yellow | The check scenario has nothing to exercise |
| Phase 003 profile slot | Internal | Yellow | The unknown-project scenario has nothing to exercise |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Either validator fails after the change and the fix is not a census correction.
- **Procedure**: Revert the phase commit with `git revert` and rerun both validators to confirm the baselines return.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (baselines, overlap) ──► Implementation (scenarios, indexes) ──► Verification (validator, grep)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phases 001 and 003 closed | Implementation |
| Implementation | The SKD-010 decision | Verification |
| Verification | All scenario files | Phase 005 |
<!-- /ANCHOR:phase-deps -->

---
