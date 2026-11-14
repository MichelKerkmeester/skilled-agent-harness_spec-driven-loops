---
title: "Implementation Plan: Phase 6: save-search-handoff-contracts"
description: "Edits the save, search and handoff command text and the three lifecycle save steps so each command states one contract that matches its scripts. The tail becomes the one source of the writer call, and two test assertions move with the blocks they read."
trigger_phrases:
  - "save search handoff contracts plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 6: save-search-handoff-contracts

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown routers, workflow YAML and plain-text presentation files |
| **Framework** | Speckit command routers under `.skilled/commands/speckit/` |
| **Storage** | None |
| **Testing** | `test-phase-command-workflows.js`, `boolean-expr.test.ts` and `rg` checks |

### Overview
The change edits the save tail, the three save, search and handoff routers, the two presentation files and the save steps of the plan, implement and complete workflows. It replaces three writer shapes with one, removes text that no script or step backs and adds display rows for output the scripts already print. It is proven by the `rg` checks in `acceptance-criteria.md` and by both test files printing zero failures.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] Phase 5 is Complete: `rg -c '^\| AC-[0-9]+ .*\| Unmet \|' ../005-resume-detection-and-single-workflow/acceptance-criteria.md` prints nothing and exits 1
- [ ] The baseline holds: `test-phase-command-workflows.js` prints `passed=150 failed=0` and `boolean-expr.test.ts` prints `fail 0`
- [ ] The test-file edit is in scope, decided 2026-11-14: `rg -c 'Decided 2026-11-14' spec.md` run in this folder prints at least 1

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is `Met`
- [ ] `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js` prints `failed=0` and `node --import tsx --test tests/boolean-expr.test.ts` from `.skilled/skills/system-spec-kit/shared` prints `fail 0`
- [ ] `validate.sh` on this folder with `--strict` prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Single shared tail. No component is added.

### Key Components
- **`speckit-save-context-tail.yaml`**: the one place that states the writer call, the post-save check and the step timing for all three lifecycle workflows
- **`save-presentation.txt` and `search-presentation.txt`**: the display source the routers already defer to, now with rows for every output the scripts print

### Data Flow
A lifecycle save step points at the tail through `shared_tail`. The agent pipes its JSON to the writer with the flags the tail names, and the writer prints the lines the save display renders.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `speckit-save-context-tail.yaml` | Producer of the writer contract for three workflows | update | AC-001, AC-002, AC-004, AC-005 |
| Save steps in `speckit-plan.yaml`, `speckit-implement.yaml` and `speckit-complete.yaml` | Consumers of the tail, two with their own write block | update | AC-013, AC-014 |
| `save.md` and `save-presentation.txt` | Router and display of `/speckit:save` | update | AC-001, AC-006, AC-010, AC-011 |
| `speckit-complete-presentation.txt` | Display of complete's closeout, which offers a second save | update the closeout block only | AC-014 |
| `search.md` and `search-presentation.txt` | Router and display of `/speckit:search` | update | AC-003, AC-008, AC-009 |
| `handoff.md` | Router and inline display of `/speckit:handoff` | update | AC-001, AC-007, AC-012 |
| `test-phase-command-workflows.js` | Asserts T-EM3, T-EM6 and T-EM7 on the tail and the checkpoint lists | update T-EM7 only | prints `failed=0` |
| `boolean-expr.test.ts` | Asserts the `after:` timing inside complete's `write_continuity` block | update to read the tail | prints `fail 0` |
| `gate-3-menu-parity.test.mjs` | Reads `speckit-implement.yaml` for the Gate 3 option C line | not a consumer | the save steps hold no Gate 3 menu |
| `generate-context.js`, `session-relaunch.cjs`, `rg-wrapper.mjs`, `lookup-trigger-index.mjs` | Scripts the contracts describe | unchanged | read-only source for every flag and runtime list |

Required inventories:
- Same-class producers: `rg -n -e 'generate-context.js' -e 'Run /speckit:save' -e 'checkpoint__' -e 'handover_check' .skilled/commands/speckit`.
- Consumers of changed keys: `rg -n -e 'write_continuity' -e 'anchor_requirements' -e 'pre_index_instruction' -e 'handover_check' -e 'step_6_5' -e 'step_10_5' .skilled --glob '!**/node_modules/**'`.
- Matrix axes: three lifecycle workflows by two save shapes (inline block, tail only). After the change every row is tail only.
- Algorithm invariant: N/A. No path, parser or resolver logic changes.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Setup re-reads the nine command files after phases 1 to 5 and records the two test baselines. Implementation edits the tail, the three lifecycle save steps, the three routers, the save and search displays, the complete closeout display and the two test assertions. Verification runs every `acceptance-criteria.md` command and both test files. Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Workflow contract assertions T-EM3 to T-EM7 and the `after:` timing assertion | `node test-phase-command-workflows.js` prints `failed=0`. `node --import tsx --test tests/boolean-expr.test.ts` prints `fail 0` |
| Integration | Each acceptance row's `rg` command over `.skilled/commands/speckit/` | `rg`, with the output each row names |
| Manual | Read the tail and one lifecycle save step together and confirm the step names no writer flag of its own | Read |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 1 to 5 Complete | Internal | Yellow | Step keys may still move, so the save steps cannot be found by their final names |
| Approval of the test-file edit | Internal | Green, decided 2026-11-14 | AC-004, AC-013 and AC-014 cannot pass without the two test edits |
| `node`, `rg` and `tsx` | External | Green | No check can run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: A lifecycle save with `--full-auto` writes continuity or a decision record into the wrong packet, or either test file reports a failure that the change caused.
- **Procedure**: Revert the phase's one commit with `git revert <sha>`. The scripts are untouched, so the revert restores the old text and nothing else.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
<!-- FILL: Draw the phase order in the fence, then fill the table with depends-on and blocks. Write `N/A` with one reason, or delete the whole section. GOOD: Setup to Implementation to Verification. Verification blocks close. WEAK: Phases depend on each other. -->

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 5 Complete | Implementation |
| Implementation | Setup baselines recorded | Verification |
| Verification | Every implementation task done | Phase 7 start |
<!-- /ANCHOR:phase-deps -->

---

