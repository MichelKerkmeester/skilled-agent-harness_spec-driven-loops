---
title: "Implementation Plan: Keep a workflow skill above the CLI hub when a request names an executor, and clear the advisor's failing ratchet and inventory test"
description: "Add a workflow-owner guard to the executor-delegation route path so system-deep-loop and system-spec-kit stay first, and make the divergence ratchet ignore machine-private skills."
trigger_phrases:
  - "executor workflow owner guard plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Keep a workflow skill above the CLI hub when a request names an executor, and clear the advisor's failing ratchet and inventory test

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (advisor runtime), Node, Python scorer for parity |
| **Framework** | None, vitest for tests |
| **Storage** | None for the change; the skill graph SQLite database is read by the scorer |
| **Testing** | vitest in `.skilled/skills/system-skill-advisor/runtime`, `node --test` for the sk-code and sk-create-skill suites |

### Overview
`applyExecutorDelegationOverride` lifts the CLI hub to 0.95 whenever a delegation cue sits next to an executor alias. The change finds a passing `system-deep-loop` or `system-spec-kit` recommendation whose explicit lane carries a real match, returns it first and puts the lifted hub directly beneath it at a confidence just below. The ratchet is made hermetic against private `local-*` skills instead of editing its ledger.
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
- [x] `./node_modules/.bin/vitest run tests/scorer/executor-delegation.vitest.ts` prints `Tests  14 passed (14)`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Post-fusion override branch.

### Key Components
- **`applyExecutorDelegationOverride`**: after resolving the executor, selects a workflow owner and returns `[owner, hub, ...rest]` instead of `[hub, ...rest]`.
- **`hasExplicitWorkflowMatch`**: mirrors the explicit-lane test in `fusion.ts` (`hasExplicitWorkflowSignal`, floor 0.55) without importing it, because `fusion.ts` imports this module.

### Data Flow
`ranked` from fusion goes in. The resolver names an executor. The owner is the first recommendation in `ranked` for `system-deep-loop` or `system-spec-kit` that passes the threshold and has explicit-lane evidence. The hub keeps the larger of its own confidence and 0.95 as before, then is capped at the owner's confidence minus 0.001.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/scorer/executor-delegation.ts` | Owns the post-fusion executor lift | update | `vitest run tests/scorer/executor-delegation.vitest.ts` |
| `lib/scorer/fusion.ts` | Calls the override once per ranking run, then reads `topSkill` and the ambiguity check | not a consumer of the new branch | The guard returns the same array shape, so `rg -n applyExecutorDelegationOverride lib` shows a single call site |
| `tests/parity/fixtures/executor-delegation-cases.json` | Shared fixture for TypeScript and Python parity | unchanged | Same test file, 14 of 14 pass with the Python parity case |
| `tests/parity/local-native-divergence-ratchet.vitest.ts` and the capture script | Replay the committed divergence ledger | update | Ratchet passes 9 of 9 with the variable set in the shell |
| Five suites that pin counts on a clean checkout | Same private-skill exposure | update | Each passes with the variable exported; full run green both ways |
| `tests/legacy/advisor-graph-health.vitest.ts` | Compares the live graph with discovery, so it needs the variable | unchanged | Passes in the full run with the variable set |

Same-class producers: `rg -n "CLI_HUB_SKILL_ID" .skilled/skills/system-skill-advisor/runtime/lib` shows the abstain branch and the route branch only; the abstain branch suppresses and never lifts, so it needs no guard.
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
| Unit | `scoreAdvisorPrompt` ordering for two workflow-owned prompts and three plain delegations | vitest |
| Integration | Live `advisor_recommend` output, routing drift guard and deep routing parity, full advisor suite | CLI, vitest |
| Manual | Old-code proof: restore `executor-delegation.ts` from `HEAD`, run the new tests, restore the edit | vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `npm run build` in the advisor runtime | Internal | Green | The live CLI keeps the old order until `dist/` is rebuilt |
| `python3` for the parity suites | External | Green | The ratchet and delegation parity tests refuse to skip |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a delegation prompt that names no workflow owner changes order, or a workflow owner outranks a CLI hub the operator wanted first.
- **Procedure**: revert the edits to `executor-delegation.ts` and its test file, then `npm run build` in the advisor runtime so `dist/` matches.
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
| Setup (baseline run) | None | Implementation |
| Implementation (guard, tests, ratchet, record) | Setup | Verification |
| Verification (suites, build, live CLI, validate) | Implementation | Closure |
<!-- /ANCHOR:phase-deps -->

---
