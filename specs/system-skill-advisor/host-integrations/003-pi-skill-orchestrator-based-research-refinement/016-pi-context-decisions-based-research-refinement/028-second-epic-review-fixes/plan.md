---
title: "Implementation Plan: Fix the six P2 findings of the second epic review"
description: "Small source fixes for each of the six review findings, each proved by a check that failed first, then a fresh five-pass review of the epic run the same way as the second one."
trigger_phrases:
  - "second epic review fixes plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Fix the six P2 findings of the second epic review

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node), Python 3, Markdown and JSON spec metadata |
| **Framework** | The skill advisor runtime and its Python fallback |
| **Storage** | None changed. The worktree's skill-graph database is built once for the tests |
| **Testing** | Vitest, the Python advisor suite, the routing ratchets |

### Overview
Each finding gets the smallest change at its source: one listener in the subprocess, one fold at the top of the offer gate in each runtime, one comment, four status flips, one catalog rewrite and one acceptance row. Three shared fixture cases and one subprocess test pin the behavior. A fresh five-pass review then checks the epic again.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Each finding is confirmed at HEAD: the `EPIPE` throw and the apostrophe gap by probe, the statuses, catalog and AC-006 by reading them.
- [x] The operator chose the comment fix for the spelled-count question.
- [x] The baseline gate set is green in the worktree.

### Definition of Done
- [x] Every row in `acceptance-criteria.md` is Met.
- [x] The gate set in section 5 passes from the final tree, with the advisor suite at 2601 passed and 4 skipped, 37 more than the baseline.
- [x] The review rerun reports no failed gate.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fix at the producer. The offer gate folds quotes once in its entry function, so every exception it calls reads the same text.

### Key Components
- `runSpawnAttempt` in `runtime/lib/subprocess.ts`.
- `asksForLoopRun` in `runtime/lib/command-attach.ts` and its Python copy `asks_for_loop_run`.
- `tests/fixtures/deep-loop-offer-cases.json`, read by both runtimes' tests.

### Data Flow
Prompt, then lowercase and quote fold, then the loop-request pattern, then the past-run, stuck-run, write-about and question exceptions.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `runSpawnAttempt` stdin | Writes the prompt to the Python child | update | The new early-exit case, and the same case against HEAD's file |
| `skill-advisor-cli-fallback.ts:278` | Already guards the same write | unchanged | Read at HEAD |
| `asksForLoopRun`, `asks_for_loop_run` | The deep-loop offer gate | update | 30 shared cases in both runtimes |
| `isStuckRunComplaint`, `isPastRunRead`, `isNoEditRequest` | Fold quotes themselves | unchanged | They fold again, which is a no-op on folded text |
| Receipt-guard catalog entry | Names the guard's sources | update | Each listed adapter imports the compiled handler |
| 007 to 010 metadata, 027 AC-006 | Completion records | update | Strict validation of each child |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup builds the worktree's skill graph and takes the baseline. Implementation adds each failing check, then its fix. Verification reruns the whole gate set and the five-pass review.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Early-exit child, the three new offer cases | Vitest, the Python advisor suite |
| Integration | Advisor typecheck, clean build, full suite, scorer-eval, local-native and holdout ratchets, corpus scorer, command bridges, leaf manifest, link check | npm scripts and the repository checkers |
| Manual | The review rerun over the whole epic | `/deep:review` workflow, native deep-review agent |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Worktree skill-graph database | Internal | Green | 13 advisor tests and one Python test fail without it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the offer gate misroutes a prompt the ratchets or golden prompts catch, or the subprocess reports a wrong result.
- **Procedure**: revert the packet's commit. The spec metadata edits are independent of the code and can stay.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | A green baseline | Verification |
| Verification | All fixes in | Merge |
<!-- /ANCHOR:phase-deps -->

---
