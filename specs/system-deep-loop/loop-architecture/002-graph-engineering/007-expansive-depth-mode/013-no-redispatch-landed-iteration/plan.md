---
title: "Implementation Plan: Stop redispatch_once from re-running an iteration that already landed"
description: "Add a reason filter to the redispatch_once rule in both deep-loop workflow YAMLs so executor_missing, findings_not_enumerated and ledger_backing_missing, which verify-iteration returns only after the iteration landed, skip the second dispatch. Proven by a YAML-reading assertion, a verify-iteration reason-table case and a landed-plus-error-row fixture."
trigger_phrases:
  - "no redispatch landed iteration plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Stop redispatch_once from re-running an iteration that already landed

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Workflow YAML read by the orchestrator, Vitest in TypeScript |
| **Framework** | `/deep:research` and `/deep:review` command workflows |
| **Storage** | None |
| **Testing** | Vitest |

### Overview
The `redispatch_once` rule in each workflow YAML gains one shared clause, `Skip this redispatch when the failure reason is executor_missing, findings_not_enumerated or ledger_backing_missing.` Those failures go to the existing still-fails path. No script changes. A YAML-reading assertion pins the clause in both files, a reason-table case in `verify-iteration.vitest.ts` pins that `executor_missing` and `findings_not_enumerated` mean the iteration landed, and a fixture pins what the still-fails row does to the counters. Both `command_note` lines and both compiled contracts follow.
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
- [ ] The SC-001 command exits 0, the YAML assertion fails against the pre-change YAMLs, and `check-contract-drift.cjs` exits 0
- [ ] The playbook scenario is written through `/create:manual-testing-playbook`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Other: reason filter in workflow prose.

### Key Components
- **`post_dispatch_validate.on_failure.redispatch_once` in both YAMLs**: the only place that decides a second dispatch; without the filter every reason re-dispatches.
- **`command_note` of the verify step in both YAMLs**: says any non-zero exit triggers the redispatch; without the update it contradicts the filter.

### Data Flow
The dispatch step writes the iteration. `verify-iteration.cjs` returns a reason. The orchestrator reads `redispatch_once`: for `executor_missing`, `findings_not_enumerated` or `ledger_backing_missing` it skips the second dispatch and records the failure as the rule's still-fails path already does; for any other reason, route-proof included, it re-dispatches once as today.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Setup records the baseline of the four suites and the full runtime suite. Implementation writes the failing YAML assertion, the reason-table case and the landed-plus-error-row fixture, then adds the filter and the `command_note` update to both YAMLs and regenerates both contracts. Verification reruns the suites and the drift check, and writes the playbook scenario through the create command. Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

Run `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/verify-iteration.vitest.ts tests/unit/loop-counters-derivation.vitest.ts tests/unit/deep-research-reduce-state.vitest.ts tests/unit/deep-review-state-reducer.vitest.ts`; it must exit 0. Run from `.skilled/skills/system-deep-loop/` instead, Vitest finds no config and exits 1. `stop-policy-yaml-parity.vitest.ts` is not run: nothing in this phase touches it. The YAML assertion in `verify-iteration.vitest.ts` reads both files with `readFileSync` and checks each `redispatch_once` value contains the one shared literal and names none of the three not-landed or two route-proof reasons. The test pins wording, not orchestrator behavior. Then `node .skilled/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs` exits 0. Manual: one scenario under `runtime/manual-testing-playbook/executor/`, written through `/create:manual-testing-playbook`.
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

Trigger: an iteration that did not land is no longer re-dispatched. Revert the one commit that touches the two YAMLs, the tests and the two regenerated contracts, then rerun `check-contract-drift.cjs`.
<!-- /ANCHOR:rollback -->

---
