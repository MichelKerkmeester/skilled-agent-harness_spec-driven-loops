---
title: "Implementation Plan: Apply the configured review minIterations floor in convergence"
description: "Remove the research-only condition from the minIterations floor check in convergence.cjs so review honors a configured floor. Proven by a configured-floor-above-2 case and an unchanged stop-path replay."
trigger_phrases:
  - "review min iterations floor plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Apply the configured review minIterations floor in convergence

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS script |
| **Framework** | system-deep-loop runtime |
| **Storage** | None |
| **Testing** | Vitest |

### Overview
One condition changes in `convergence.cjs`: the floor check stops testing for `loopType === 'research'`. A new review case with `minIterations: 3` proves the floor holds, and the existing stop-path replay proves the shipped floor of 2 changes nothing.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] The SC-001 command exits 0, and the configured-floor case fails against the pre-change script
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Other: widen one guard condition.

### Key Components
- **`convergence.cjs` stop decision**: the floor check at line 1159; without the change a review floor above 2 is read by `stopDecisionConfig` (line 1347) and never applied.

### Data Flow
`antiConvergence.minIterations` from the review config reaches `stopDecisionConfig`, which caps it at `maxIterations`. The stop decision compares it with the iteration count and returns `CONTINUE` before any gate evaluation when the count is below the floor.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Setup records the baseline of the two review suites. Implementation writes the failing configured-floor case, then drops the research-only condition in `convergence.cjs`. Verification reruns both suites and the research convergence cases. Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

From `.skilled/skills/system-deep-loop/`, run `npx vitest run runtime/tests/integration/review-depth-convergence.vitest.ts runtime/tests/integration/review-stop-path-replay.vitest.ts`; it must exit 0. The new case uses a floor of 3 with a stop candidate at iteration 2, because an iteration-1 candidate cannot be built from real loop state (research §20).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

None. No new package, and no other slice must land first (research §20).
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

Trigger: a review run with the shipped config stops at a different iteration than before. Revert the one commit that touches `convergence.cjs`.
<!-- /ANCHOR:rollback -->

---
