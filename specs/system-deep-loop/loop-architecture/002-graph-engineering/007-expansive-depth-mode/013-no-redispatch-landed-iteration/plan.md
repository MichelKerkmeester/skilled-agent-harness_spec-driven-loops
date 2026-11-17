---
title: "Implementation Plan: Stop redispatch_once from re-running an iteration that already landed"
description: "Add a reason filter to the redispatch_once rule in both deep-loop workflow YAMLs so executor_missing, which verify-iteration returns only after the iteration landed, skips the second dispatch. Proven by a YAML-reading assertion and a verify-iteration reason-table case."
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
The `redispatch_once` rule in each workflow YAML gains one clause: an `executor_missing` failure skips the redispatch and goes to the existing still-fails path. No script changes. A YAML-reading assertion pins the clause in both files, and a reason-table case in `verify-iteration.vitest.ts` pins that `executor_missing` means the iteration landed.
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
- [ ] The SC-001 command exits 0, and the YAML assertion fails against the pre-change YAMLs
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

### Data Flow
The dispatch step writes the iteration. `verify-iteration.cjs` returns a reason. The orchestrator reads `redispatch_once`: for `executor_missing` it skips the second dispatch and records the failure as the rule's still-fails path already does; for any other reason it re-dispatches once as today.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Setup records the baseline of the two suites. Implementation writes the failing YAML assertion and reason-table case, then adds the filter to both YAMLs. Verification reruns the suites and the YAML parity check. Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

From `.skilled/skills/system-deep-loop/`, run `npx vitest run runtime/tests/unit/verify-iteration.vitest.ts runtime/tests/unit/stop-policy-yaml-parity.vitest.ts`; it must exit 0. The YAML assertion reads both files the way `stop-policy-yaml-parity.vitest.ts` does and checks the `redispatch_once` value names `executor_missing` as excluded and does not exclude the three not-landed reasons.
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

Trigger: an iteration that did not land is no longer re-dispatched. Revert the one commit that touches the two YAMLs.
<!-- /ANCHOR:rollback -->

---
