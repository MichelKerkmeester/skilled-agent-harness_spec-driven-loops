---
title: "Tasks: Let a session surface hint join a scored sk-code route and keep a second matched mode when one surface scores several phrases"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "host surface hint and score window tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Let a session surface hint join a scored sk-code route and keep a second matched mode when one surface scores several phrases

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `R` is `scripts/rotate-logs.sh`. `A` is `logs/archive/`. WEAK: Variables are defined below. -->

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`R` is `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code`. `B` is `.skilled/bin`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [ ] T001 Write every case's current route to a file (`scratch/routes-before.txt`). Verify: `wc -l scratch/routes-before.txt` prints the number of cases in `R/fixtures/canary-cases.v1.json`.
- [ ] T002 Find the legacy parity gate, its command and whether CI runs it (`R/harness/build-artifacts.cjs`). Verify: `goal.md` section 4 names the command and its result, or says no such gate runs.
- [ ] T003 Measure both surface score candidates over every case and list each changed route (`scratch/score-candidates.md`). Verify: the file names the chosen candidate and holds one line per changed route.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [ ] T004 Add failing tests for the join and for the kept workflow mode (`B/tests/compiled-route-surface-hint.test.cjs`). Verify: `node --test B/tests/compiled-route-surface-hint.test.cjs` prints `fail 2`, on the new tests.
- [ ] T005 Apply the chosen surface score in `scoreModes` (`R/lib/canary-router.cjs`). Verify: `scratch/probe-routes.cjs` prints `sk-code-review` and `sk-code-frontend` for `review the dark mode toggle and focus trap`.
- [ ] T006 Add the hinted specific surface inside `evaluateCanary` and record the hint as a request fact (`R/lib/canary-router.cjs`). Verify: `scratch/probe-routes.cjs` prints `sk-code-frontend` in the targets of the hinted `review this function for bugs`.
- [ ] T014 Route a hinted prompt that scores no mode to the hinted specific surface (`R/lib/canary-router.cjs`). Verify: `scratch/probe-routes.cjs` prints `sk-code-frontend` for the hinted `add a filter to the table`, and the same prompt with no hint prints `defer`.
- [ ] T007 Pass the hint into the evaluation (`B/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs`). Verify: `node --test B/tests/compiled-route-surface-hint.test.cjs` prints `fail 0`.
- [ ] T008 Add cases for the join and the kept workflow mode (`R/fixtures/canary-cases.v1.json`). Verify: the hub's harness run reports every case as matching.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [ ] T009 Republish the hub's closure and run the guard (`B/compiled-route-sync.cjs`). Verify: `node B/compiled-route-guard.cjs` passes for `sk-code`.
- [ ] T010 Compare every case's route with T001 (`scratch/routes-after.txt`). Verify: `diff scratch/routes-before.txt scratch/routes-after.txt` prints only the routes T003 listed.
- [ ] T011 Correct the `--surface-hint` line (`B/README.md`). Verify: `rg -n 'surface-hint' B/README.md` prints a line that says the hint adds a surface.
- [ ] T012 Say what a host may change in `hub-router.json` (`.skilled/skills/sk-code/README.md`). Verify: `rg -n 'ambiguityDelta' .skilled/skills/sk-code/README.md` prints one line.
- [ ] T013 Validate the packet (`spec.md`). Verify: `validate.sh <this folder> --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `scratch/routes-after.txt` differs from `scratch/routes-before.txt` only in the routes `scratch/score-candidates.md` lists
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



