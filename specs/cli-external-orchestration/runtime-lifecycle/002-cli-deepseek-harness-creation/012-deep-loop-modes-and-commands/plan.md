---
title: "Implementation Plan: Phase 12: deep-loop-modes-and-commands"
description: "List cli-deepseek-harness on the deep-research and deep-review protocol, skill, command YAML and presentation surfaces, regenerate the compiled contracts and record the AI Council seat decision. Docs come from the orchestrating Claude session under sk-doc, and YAML and regeneration from cli-codex under sk-code."
trigger_phrases:
  - "deep loop modes and commands plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 12: deep-loop-modes-and-commands

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, YAML, plain-text presentation lists, Node.js |
| **Framework** | system-deep-loop modes and `/deep:*` command assets |
| **Storage** | None |
| **Testing** | vitest deep-loop unit suites, contract regeneration with `git diff --exit-code` |

### Overview
This phase adds `cli-deepseek-harness` to every file `/deep:research` and `/deep:review` read when choosing an executor, then regenerates the compiled contracts from those sources. SKILL and protocol text follow `sk-doc` in the orchestrating Claude session, and YAML, contract regeneration and any council code follow `sk-code` `sk-code-skilled` through `cli-codex gpt-6-luna xhigh fast`. Proof is an `rg -l` match on every file, zero diff after regeneration and passing phase 006 suites.
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
- [ ] `rg -l cli-deepseek-harness` lists every Section 3 research and review file and `git diff --exit-code .skilled/commands/deep/assets/compiled/` exits 0 after regeneration
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Source-then-compile command contracts.

### Key Components
- **Maintained sources**: protocol docs, mode `SKILL.md` files, command YAMLs and presentation lists, which stay authoritative.
- **`compile-command-contracts.cjs`**: compiles the sources into `compiled/*.contract.markdown`, which the renderer rejects when stale.
- **Council decision record**: settles research Q13 and gates any council change.

### Data Flow
An operator runs `/deep:research` or `/deep:review`. The command renderer loads the compiled contract and the presentation list, the operator picks an executor and the fan-out runtime from phase 006 builds the dsh dispatch.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

N/A: this phase adds an executor choice and fixes no reported finding.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup captures the suite baseline. Implementation edits sources then decides the council seat. Verification regenerates and reruns the suites.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Phase 006 suites and the council suite if a seat is admitted | vitest |
| Integration | Compiled contract regeneration | `compile-command-contracts.cjs` with `git diff --exit-code` |
| Manual | Presentation lists show the new choice | `rg -n cli-deepseek-harness` on both `*-presentation.txt` files |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `006-deep-loop-executor-kind` | Internal | Red | Contracts name a kind the runtime rejects |
| `007-dispatch-recognition-and-stress-adapter` | Internal | Red | Loop dispatches skip the dsh preflight |
| `011-hub-registration-and-routing` | Internal | Red | Contracts point at an unregistered mode |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a regenerated contract is rejected by the renderer, or a phase 006 suite fails after the edits.
- **Procedure**: `git revert <sha>` on the phase commit, then rerun `compile-command-contracts.cjs` so `compiled/` matches the reverted sources.
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
| Setup (suite baseline) | Phases 006, 007 and 011 validated | Implementation |
| Implementation (sources and council decision) | Setup | Verification |
| Verification (regeneration and suites) | Implementation | Phase 013 loop run and close |
<!-- /ANCHOR:phase-deps -->

---
