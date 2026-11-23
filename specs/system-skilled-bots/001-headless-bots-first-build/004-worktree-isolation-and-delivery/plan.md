---
title: "Implementation Plan: Phase 4: worktree-isolation-and-delivery"
description: "Add an isolation module that runs a bot in a numbered sk-git worktree outside the checkout and removes it safely, and a delivery module that writes at-most-once delivery records. Both plug into the phase 3 runner and are proved against a temp repository."
trigger_phrases:
  - "worktree isolation and delivery plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 4: worktree-isolation-and-delivery

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on Node, the language phase 1 fixes for the skill runtime. Shells out to bash scripts owned by sk-git |
| **Framework** | None. Imports deep-loop libraries from `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/` |
| **Storage** | Run records and delivery records under the user-level state root (research.md §11). Run folders live in the Skilled tree's gitignored `.skilled/skills/.state/system-skilled-bots/<repo identity>/runs/<run id>/` (operator decision, 2026-11-22). Nothing tracked in the checkout |
| **Testing** | Vitest, the runner `system-deep-loop/runtime` already uses (`vitest.config.ts`), against temp git repositories |

### Overview
Two new modules plug into the phase 3 runner. `isolation.ts` allocates a numbered worktree through `worktree-naming.sh`, places it outside the checkout, links the shared paths and records the path and branch. It removes the tree only when it is clean and unchanged, unlinking first. `delivery.ts` resolves the targets after the run's terminal state is written and records one at-most-once delivery record per target. Tests run against throwaway repositories, so no proof touches the operator's checkout.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [x] Phase 3 is closed: `rg -n 'Closeable:\*\* Yes' ../003-manual-runner/acceptance-criteria.md` prints one line
- [x] The run record and `BOT.md` fields for worktree path, branch and delivery exist in phase 1's contract: `rg -n 'worktree|delivery' ../001-contracts-and-state-root/spec.md` prints matches
- [x] ADR-001 to ADR-005 in `decision-record.md` are no longer Proposed

### Definition of Done
- [ ] All acceptance criteria met (AC-012, the live desktop notice, awaits operator approval)
- [x] `npx vitest run runtime/tests/isolation.vitest.ts runtime/tests/delivery.vitest.ts` from the skill root exits 0 with no skipped test (run from `runtime/`: 27 passed)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Runner plug-in modules. The runner keeps its §8 order and calls isolation before dispatch and delivery after the result event.

### Key Components
- **`isolation.ts`**: turns a declared `isolation: worktree` into a real tree and back. Without it the runner must keep refusing `worktree`, and an editing bot can only write into the shared checkout.
- **`delivery.ts`**: turns the `BOT.md` delivery fields into sends and records. Without it a failed unattended run tells nobody.
- **Checker worktree invariant**: refuses a definition the isolation module would have to refuse at run time, so the author learns before the first fire.

### Data Flow
The runner takes the lease, then reads the honored posture. For `worktree` it calls `isolation.ts`, which runs `worktree-naming.sh create <slug> <base commit> --no-provision` with the configured base set outside the checkout (an unconfigured base is refused), links the shared paths and returns the path and branch. The runner dispatches the child with that path as its working directory and writes the result event. Isolation then removes the tree if it is clean and unchanged, or marks it kept with a reason, so the terminal run record and the notice both carry the outcome (ADR-007). The runner writes the terminal record with the worktree fields, then hands it to `delivery.ts`. Delivery resolves targets, writes each delivery record as `queued`, claims it, sends once and writes `delivered`, `failed`, `unknown` or `attempted`. The lease is released on every path, and its key never holds the worktree path.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

This phase is new work, not a fix. The addendum is kept because worktree removal is path handling near the main checkout.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/skills/sk-git/scripts/worktree-naming.sh` | Allocates numbers under a lock and creates `worktrees/NNN-slug` trees | unchanged, called | `git diff --stat` shows no change to it at close |
| `.skilled/bin/worktree-reaper.sh` | Reclaims numbered trees only with `--numbered`, never forced | not a consumer, named as the manual reclaim path | `git diff --stat` shows no change to it at close |
| `.skilled/bin/worktree-session.sh` | Holds the default shared-path list the links copy | not a consumer, read for the list only | `rg -n 'default_shared_paths' .skilled/bin/worktree-session.sh` |
| Phase 3 runner and lease | Owns dispatch order and the lease key | update: drop the worktree refusal, call the two modules | lease-key test in `isolation.vitest.ts` |

Required inventories:
- Same-class producers: `rg -n 'worktree remove|branch -d|branch -D' .skilled/skills/system-skilled-bots` lists every removal call, and each one sits in `isolation.ts`.
- Consumers of changed symbols: `rg -n 'worktreePath|worktreeBranch|deliveryState' .skilled/skills/system-skilled-bots --glob '*.ts'` lists the record writer, the runner and the tests.
- Matrix axes: tree state (clean, dirty, unmerged commits, half-provisioned) by removal caller (runner end, operator reaper). Eight rows, each a test case.
- Algorithm invariant: no removal follows a link out of the worktree. Adversarial cases are a link to the main checkout's `node_modules`, a link to a folder outside both trees and a dangling link.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup confirms phase 3 is closed, settles ADR-001 to ADR-005 and builds a temp-repository test fixture. Implementation creates `isolation.ts` and `delivery.ts`, wires them into the runner and adds the checker invariant. Verification runs the two test files, one live worktree run of the fixture bot and the no-`launchctl` grep.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

The one command: `npx vitest run runtime/tests/isolation.vitest.ts runtime/tests/delivery.vitest.ts` from the skill root exits 0 and reports no skipped test.

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Target resolution, delivery state transitions, lease-key builder, base-inside-checkout refusal | Vitest |
| Integration | Create, link, run, unlink and remove against a temp git repository with a fake main checkout holding `node_modules` | Vitest with `git` and `worktree-naming.sh` |
| Manual | One `bots run <id>` of the worktree fixture bot, then `git worktree list` and the run record | Terminal |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 3 `003-manual-runner` | Internal | Red (planned) | Nothing in this phase can run |
| Phase 1 `001-contracts-and-state-root` | Internal | Red (planned) | Worktree and delivery fields have no contract |
| Phase 2 `002-schedule-predicates-and-checker` checker code merged (phase 2 need not be closed) | Internal | Red (planned) | The invariant has no checker to live in |
| `worktree-naming.sh`, `worktree-reaper.sh` | Internal (sk-git) | Green (exist) | Numbering and reclaim would need new code |
| `osascript` | External (macOS) | Green | Desktop channel cannot ship. Local-only still works |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: a removal touches anything outside the bot worktree, or a send repeats for one target in one run.
- **Procedure**: revert this phase's commits. The runner falls back to phase 3, which refuses `isolation: worktree` and writes only `not-attempted` or local-only delivery. Kept worktrees stay on disk and the operator reclaims them with `.skilled/bin/worktree-reaper.sh --numbered --dry-run` first.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
<!-- FILL: Draw the phase order in the fence, then fill the table with depends-on and blocks. Write `N/A` with one reason, or delete the whole section. GOOD: Setup to Implementation to Verification. Verification blocks close. WEAK: Phases depend on each other. -->

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 3 closed, ADR-001 to ADR-005 decided | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Packet close. No later phase lists this one as a dependency in the parent phase map |
<!-- /ANCHOR:phase-deps -->

---
