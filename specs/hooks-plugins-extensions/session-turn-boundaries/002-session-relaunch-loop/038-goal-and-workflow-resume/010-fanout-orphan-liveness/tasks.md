---
title: "Tasks: Phase 10: fanout-orphan-liveness"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "fanout orphan liveness tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 10: fanout-orphan-liveness

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

**Task variables**: `RT` is `.skilled/skills/system-deep-loop/runtime`, and every `npx vitest` command runs from it. `PH` is `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/010-fanout-orphan-liveness`.

**Scratch packet rule**: the reproduction runs only inside a `mkdtemp` root under the system temp directory, with `specs/fanout-repro` as its packet. It never names a real packet and removes its root and both shim process groups before it exits.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Write and run the double-writer reproduction before any source edit (`PH/scratch/repro-double-writer.cjs`). It makes its root with `mkdtemp` under the prefix `fanout-repro-`, copies `RT/tests/stress/cli-adapter/shims/opencode-shim.cjs` and `adapter-shim-core.cjs` into a temporary `bin`, sets the shim mode to `timeout`, runs `RT/scripts/fanout-run.cjs` for one `cli-opencode` lineage, waits for the shim pid file, sends SIGKILL to the first runner, runs the same command again with a 10 s cap, then prints the capture count, one `pid=<n> alive=<true|false>` line per shim pid from `process.kill(pid, 0)`, one `second runner exit=<code>` line and each `orphan_requeued` ledger row, and last kills both shim process groups and removes the root. Verify: `node PH/scratch/repro-double-writer.cjs > PH/scratch/repro.txt` and `rg -c 'alive=true' PH/scratch/repro.txt` prints 2 and `rg -c 'orphan_requeued' PH/scratch/repro.txt` prints 1. If either count differs, stop the phase and record the output in `goal.md`.
- [ ] T002 Record the unit baseline (`RT/tests/unit/fanout-pool.vitest.ts`). Verify: `npx vitest run --no-coverage tests/unit/fanout-pool.vitest.ts` exits 0 with `37 passed`.
- [ ] T003 Record the stress baseline (`RT/tests/stress/cli-adapter/fanout.vitest.ts`). Verify: `npx vitest run --no-coverage tests/stress/cli-adapter/fanout.vitest.ts` exits 0 and the pass count is written in `goal.md`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add test `isLineageAlive reads ESRCH as dead and EPERM as alive`, which must fail first (`RT/tests/unit/fanout-pool.vitest.ts`). Verify: `npx vitest run --no-coverage tests/unit/fanout-pool.vitest.ts -t 'isLineageAlive reads ESRCH'` exits 1 with `isLineageAlive` in the failure.
- [ ] T005 Add test `detectLiveLineages returns a started label whose spawned pid is alive`, which must fail first (`RT/tests/unit/fanout-pool.vitest.ts`). Verify: `npx vitest run --no-coverage tests/unit/fanout-pool.vitest.ts -t 'detectLiveLineages returns'` exits 1 with `detectLiveLineages` in the failure.
- [ ] T006 Add test `markOrphanedLineages leaves a live lineage unmarked` with a real detached child, which must fail first (`RT/tests/unit/fanout-pool.vitest.ts`). Verify: `npx vitest run --no-coverage tests/unit/fanout-pool.vitest.ts -t 'leaves a live lineage unmarked'` exits 1 with the returned label in the failure.
- [ ] T007 Add guard tests `markOrphanedLineages requeues a lineage whose spawned pid has exited` and `a label with no spawned record is still an orphan`, which may pass at once (`RT/tests/unit/fanout-pool.vitest.ts`). Verify: `npx vitest run --no-coverage tests/unit/fanout-pool.vitest.ts -t 'spawned pid has exited|no spawned record'` exits 0.
- [ ] T008 Add test `refuses a re-run while a lineage from the earlier run is alive`, which must fail first (`RT/tests/stress/cli-adapter/fanout.vitest.ts`). Verify: `npx vitest run --no-coverage tests/stress/cli-adapter/fanout.vitest.ts -t 'refuses a re-run'` exits 1 with a second capture or a missing exit 3 in the failure.
- [ ] T009 Save the four failing runs (`PH/scratch/red.txt`). Verify: `rg -c 'FAIL' PH/scratch/red.txt` prints at least 4.
- [ ] T010 Add `isLineageAlive` and `detectLiveLineages`, and skip a live label in `detectOrphanedLineages` and `markOrphanedLineages` (`RT/scripts/fanout-pool.cjs`). Verify: `npx vitest run --no-coverage tests/unit/fanout-pool.vitest.ts` exits 0 with `42 passed`.
- [ ] T011 Append the `spawned` row from `onSpawn` and refuse a re-run with any live label before the orphan mark (`RT/scripts/fanout-run.cjs`). Verify: `npx vitest run --no-coverage tests/stress/cli-adapter/fanout.vitest.ts -t 'refuses a re-run'` exits 0.
- [ ] T012 Save the passing runs of T010 and T011 (`PH/scratch/green.txt`). Verify: `rg -c 'passed' PH/scratch/green.txt` prints at least 2 and `rg -c 'FAIL' PH/scratch/green.txt` prints 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Rerun the reproduction after the change (`PH/scratch/repro-after.txt`). Verify: `node PH/scratch/repro-double-writer.cjs > PH/scratch/repro-after.txt` and `rg -c 'alive=true' PH/scratch/repro-after.txt` prints 1, `rg -n 'second runner exit=3' PH/scratch/repro-after.txt` prints 1 line and `rg -c 'orphan_requeued' PH/scratch/repro-after.txt` prints 0.
- [ ] T014 Run the named suites (`RT/tests`). Verify: `npx vitest run --no-coverage tests/unit/fanout-pool.vitest.ts tests/unit/fanout-run.vitest.ts tests/unit/observability-events.vitest.ts tests/stress/cli-adapter/fanout.vitest.ts` exits 0.
- [ ] T015 Confirm no shim process outlived the tests (`RT/tests/stress/cli-adapter/fanout.vitest.ts`). Verify: `pgrep -f 'fanout-repro-|cli-opencode-stress-'` prints nothing and exits 1.
- [ ] T016 Confirm the phase touched only the four named files (`RT`). Verify: `git diff --name-only -- .skilled` prints exactly the four paths in `spec.md` Files to Change.
- [ ] T017 Run strict validation on the phase (`PH`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh PH --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] Every row of `acceptance-criteria.md` is `Met`
- [ ] `scratch/repro.txt` and `scratch/repro-after.txt` show the double writer before and the refusal after
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: `../research/research.md` section 3 (Fan-out lineages), section 7 item 1 and section 9 rank 2
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A task blocked by a failed reproduction in T001 is marked `[B]` with the output in `goal.md`, and the phase stops there.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md. Verify: `rg -c '^\| REQ-' PH/spec.md` prints 8.
- [ ] CHK-002 [P0] The double writer is reproduced. Verify: `rg -c 'alive=true' PH/scratch/repro.txt` prints 2.
- [ ] CHK-003 [P1] The unit baseline is recorded. Verify: `npx vitest run --no-coverage tests/unit/fanout-pool.vitest.ts` prints `37 passed` before the first edit.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The changed scripts parse. Verify: `node --check RT/scripts/fanout-pool.cjs && node --check RT/scripts/fanout-run.cjs` exits 0.
- [ ] CHK-011 [P0] No console output is added. Verify: `git diff -U0 -- RT/scripts` prints no added `console.` line.
- [ ] CHK-012 [P1] No spec path, phase number or requirement id lands in a code comment. Verify: `git diff -U0 -- RT/scripts RT/tests` prints no added line matching `specs/`, `REQ-` or `010-`.
- [ ] CHK-013 [P1] The liveness read keeps its durable reason in a comment. Verify: `rg -n 'signal 0' RT/scripts/fanout-pool.cjs` prints at least 1 line.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Every acceptance row is `Met`. Verify: `rg -c '\| Met \|' PH/acceptance-criteria.md` prints 9.
- [ ] CHK-021 [P0] The named suites exit 0. Verify: T014.
- [ ] CHK-022 [P1] Each of the four must-fail tests holds a red run. Verify: `rg -c 'FAIL' PH/scratch/red.txt` prints at least 4.
- [ ] CHK-023 [P1] The after-change reproduction shows the refusal. Verify: `rg -n 'second runner exit=3' PH/scratch/repro-after.txt` prints 1 line.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] The finding carries one class in `plan.md`. Verify: `rg -n 'class-of-bug' PH/plan.md` prints 1 line.
- [ ] CHK-FIX-002 [P0] The same-class producer inventory ran. Verify: `rg -n "event: 'started'|event: 'spawned'" RT/scripts` lists one `started` and one `spawned` producer.
- [ ] CHK-FIX-003 [P0] The consumer inventory ran. Verify: `rg -n 'markOrphanedLineages|detectOrphanedLineages|detectLiveLineages|isLineageAlive' .skilled --glob '!**/node_modules/**'` lists only `fanout-pool.cjs`, `fanout-run.cjs` and `tests/unit/fanout-pool.vitest.ts`.
- [ ] CHK-FIX-004 [P0] The adversarial cases exist for an exited pid, an `EPERM` pid, a missing `spawned` row and a retried label. Verify: `rg -n 'EPERM|has exited|no spawned record|attempt: 2' RT/tests/unit/fanout-pool.vitest.ts` prints at least 4 lines.
- [ ] CHK-FIX-005 [P1] The matrix axes are listed before completion is claimed. Verify: `rg -n 'Matrix axes' PH/plan.md` prints 1 line.
- [ ] CHK-FIX-006 [P1] The hostile process-state variant ran with a real detached child. Verify: `npx vitest run --no-coverage tests/unit/fanout-pool.vitest.ts -t 'leaves a live lineage unmarked'` exits 0.
- [ ] CHK-FIX-007 [P1] The evidence is pinned to a commit. Verify: `git rev-parse HEAD` is written in `goal.md` at close.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secret is added. Verify: `git diff -U0 -- RT` prints no added line matching `api_key`, `password` or `secret`.
- [ ] CHK-031 [P0] The probe sends signal 0 only. Verify: `git diff -U0 -- RT/scripts/fanout-pool.cjs` shows no added `process.kill` call with a signal other than `0`.
- [ ] CHK-032 [P1] A pid from the ledger that is not a positive integer is never probed. Verify: `npx vitest run --no-coverage tests/unit/fanout-pool.vitest.ts -t 'isLineageAlive'` exits 0.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan, tasks, criteria and goal name the same files. Verify: `rg -l 'fanout-pool.cjs' PH/spec.md PH/plan.md PH/tasks.md PH/acceptance-criteria.md PH/goal.md` lists 5 files.
- [ ] CHK-041 [P1] The refusal message names the label and the pid. Verify: `rg -n 'still running' RT/scripts/fanout-run.cjs` prints 1 line.
- [ ] CHK-042 [P2] The open question in `goal.md` has the operator's answer before close. Verify: `rg -n 'Answer:' PH/goal.md` prints 1 line.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] scratch holds the reproduction script and the four run logs. Verify: `ls PH/scratch` lists `repro-double-writer.cjs`, `repro.txt`, `repro-after.txt`, `red.txt` and `green.txt`.
- [ ] CHK-051 [P1] The reproduction left no temporary root behind. Verify: `find "${TMPDIR:-/tmp}" -maxdepth 1 -name 'fanout-repro-*' | wc -l` prints 0.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-13
<!-- /ANCHOR:summary -->

---
