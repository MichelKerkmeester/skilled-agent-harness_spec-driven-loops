---
title: "Implementation Plan: Apply the configured review minIterations floor in convergence"
description: "Remove the research-only condition from the minIterations floor check in convergence.cjs so review honors a configured floor, and name the floor in the review workflow and README. Proven by a configured-floor-above-2 case, an inverted stop-decision case and an unchanged stop-path replay."
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
One condition changes in `convergence.cjs`: the floor check stops testing for `loopType === 'research'`. A new review case with `minIterations: 3` proves the floor holds, the existing `stop-decision.vitest.ts` case that asserts the old research-only gate is inverted, and the existing stop-path replay proves the shipped floor of 2 changes nothing. The review stop-order prose and README name the floor, and the review compiled contract is regenerated.
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
- [ ] The SC-001 command exits 0, the configured-floor and inverted cases fail against the pre-change script, and `check-contract-drift.cjs --command deep/review` exits 0
- [ ] The playbook scenario is written through `/create:manual-testing-playbook`
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
- **`deep-review.yaml` `step_check_convergence` stop order**: the prose the orchestrator reads; without a floor line it describes a stop order the script no longer follows.

### Data Flow
`antiConvergence.minIterations` from the review config reaches `stopDecisionConfig`, which caps it at `maxIterations`. The stop decision compares it with the iteration count and returns `CONTINUE` before any gate evaluation when the count is below the floor.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Setup records the baseline of the three suites and the full runtime suite. Implementation writes the failing configured-floor case, inverts the `stop-decision.vitest.ts` review case, drops the research-only condition in `convergence.cjs`, adds the floor to the review stop order and README, and regenerates the review contract. Verification reruns the suites, the drift check and the research convergence cases, and writes the playbook scenario through the create command. Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

Run `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/integration/review-depth-convergence.vitest.ts tests/integration/review-stop-path-replay.vitest.ts tests/unit/stop-decision.vitest.ts`; it must exit 0. Run from `.skilled/skills/system-deep-loop/` instead, Vitest finds no config and exits 1. The new integration case uses a floor of 3 with a stop candidate at iteration 2, because an iteration-1 candidate cannot be built from real loop state (research §20). The direct-input case "does not apply the iteration floor to review" in `stop-decision.vitest.ts:905-913` already builds an iteration-1 stop; it is inverted to expect `CONTINUE` with `minIterationsNotReached`. The full-suite baseline is stated as one case changed and N added. Then `node .skilled/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs --command deep/review` exits 0. Manual: one scenario under `deep-review/manual-testing-playbook/convergence-and-recovery/`, written through `/create:manual-testing-playbook`.
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

Trigger: a review run with the shipped config stops at a different iteration than before. Revert the one commit that touches `convergence.cjs`, the test files, `deep-review.yaml`, the README and the regenerated review contract, then rerun `check-contract-drift.cjs`.
<!-- /ANCHOR:rollback -->

---
