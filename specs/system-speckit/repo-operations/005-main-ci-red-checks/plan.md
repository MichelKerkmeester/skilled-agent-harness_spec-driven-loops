---
title: "Implementation Plan: Repair the five checks that fail on main"
description: "Each failing workflow gets one fix at its cause: a glob for Node 22, two refreshed baselines, one routing keyword and three Spec-Kit test repairs. Each fix is proved by the command that failed."
trigger_phrases:
  - "main ci red checks plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Repair the five checks that fail on main

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | GitHub Actions YAML, Bash, TypeScript, JSON, Markdown |
| **Framework** | `node --test`, vitest, Python test scripts |
| **Storage** | None |
| **Testing** | The failing workflow commands, run locally from worktree 346 |

### Overview
Five workflows fail on main for five separate reasons. Each is reproduced locally, traced to the code that produced it and fixed there. The command that failed is rerun, then the rest of its workflow.
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
- [x] `bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh` prints `all sk-doc script tests passed`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: five independent repairs, one per failing workflow.

### Key Components
- **Corpus workflows**: run the chart and diagram mutation suites on Node 22.
- **sk-doc README baselines**: two frozen files a test compares against the live tree.
- **CLI hub routing vocabulary**: `hub-router.json` picks the mode, `ROUTER.md` carries the same phrases as intents.
- **Spec-Kit CLI tests**: one count assertion, one sandbox copy and one Bash checker.

### Data Flow
`hub-router.json` and `ROUTER.md` feed the generated intent signals in `graph-metadata.json`, which feed the compiled `skill-graph.json`. A keyword added to `ROUTER.md` therefore needs both regenerated.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `node --test scripts/tests/` in two workflows | Runs the mutation suites | Update to a glob | Node v22.23.4: 21 and 88 tests pass |
| The same command in three sk-design READMEs | Tells a reader how to run the suites | Update to a glob | `rg -n "node --test" .skilled/skills/sk-design` |
| The same command in three `sk-create-goal` READMEs | Tells a reader how to run the goal tests | Unchanged, noted as follow-up | No failing check runs them |
| `cpSync` in `upgrade-legacy-harness.ts` | Copies the skill into a sandbox | Unchanged, it already filters `.workflow-lock` | `rg -n "workflow-lock" runtime/cli/tests` |
| `cpSync` in `upgrade-legacy-host-root.vitest.ts` | Copies the skill into a sandbox | Update with the same filter | The test file passes |
| `${#folders[@]:-0}` in `check-template-staleness.sh` | Counts discovered packets | Update to the bare length | `rg -n '\$\{#[a-zA-Z_]*\[@\]:-' .skilled` finds no other use |

Required inventories:
- Same-class producers: `rg -n "node --test [^-]*tests/$" .github .skilled` found the two workflows and six READMEs.
- Consumers of changed symbols: the phrase "opencode go route" is read by the vocabulary guard, the intent signal generator and the compiled graph.
- Matrix axes: Node 22 in CI and Node 26 locally for the glob. Bash 3.2 locally and Bash 5 in CI for the checker.
- Algorithm invariant: N/A, no path, parser or security logic changes.
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
| Unit | The three Spec-Kit test files and the sk-doc script tests | vitest, `run-script-tests.sh` |
| Integration | Every step of the routing workflow, the corpus suites on Node 22 | The workflow commands run by hand |
| Manual | One real request replayed through both routing stages | `skill-advisor.cjs`, `compiled-route.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Operator approval to push to main | Internal | Yellow | CI cannot confirm the fixes until the push |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A workflow that passed before these commits fails after them.
- **Procedure**: `git revert` the commit that touched that workflow's files. Each fix is its own commit.
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
| Setup | The failed job logs | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | The push to main |
<!-- /ANCHOR:phase-deps -->

---
