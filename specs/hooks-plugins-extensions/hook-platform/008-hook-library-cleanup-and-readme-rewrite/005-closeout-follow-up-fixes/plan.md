---
title: "Implementation Plan: Phase 5: closeout-follow-up-fixes"
description: "Fix the no-behavior-change findings from the phase 4 close at their source: one config glob, five doc and comment lines, two marker blocks and the dead Pi import fallbacks. Each fix is proven by the checker or suite that found it."
trigger_phrases:
  - "closeout follow up fixes plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 5: closeout-follow-up-fixes

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, CommonJS and TypeScript |
| **Framework** | Pi extension adapters, the sk-code quality gate |
| **Storage** | None |
| **Testing** | Vitest, `node --test`, the sk-doc README checkers |

### Overview
Change one glob in three places, a handful of doc and comment lines, and one import per Pi adapter. Each fix is proven by the checker or suite that reported the fault. The hook suites and both sync checks prove that no hook behavior changed.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] The hook Vitest suite passes with no `resolve.alias`, and both README checkers print `pass=1 fail=0` on the two docs
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Other: fixes at the source, no new component.

### Key Components
- **actionlint check row**: decides which changed files the quality gate hands to actionlint.
- **Pi adapters**: each imports its shared core once, from its real folder.

### Data Flow
The quality gate matches each changed path against a check row's `paths` and runs the check on the matches. Pi loads each adapter through a one-line re-export, so the adapter's own folder is where its relative imports resolve.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. Setup records each fault's checker output. Implementation fixes the docs and config, then the Pi adapters. Verification reruns each checker and the hook suites.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

`.skilled/node_modules/.bin/vitest run --config .skilled/hooks/vitest.config.ts` must pass with the alias removed. The quality gate must report actionlint `NOT_APPLICABLE` for the workflows README.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

None. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

Trigger: a Pi session fails to load an adapter after the change. Revert the phase commit with `git revert`.
<!-- /ANCHOR:rollback -->

---

