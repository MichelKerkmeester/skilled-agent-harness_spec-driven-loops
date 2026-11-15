---
title: "Tasks: Phase 19: vibe-relaunch-command-tier"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "vibe relaunch command tier tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 19: vibe-relaunch-command-tier

<!-- SPECKIT_LEVEL: 1 -->

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

`R` is `.skilled/hooks/session-relaunch`. `L` is `.skilled/bin/skilled-loop`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Run the relaunch suites as the baseline and save the summary (`scratch/baseline.txt`). Verify: `node --test R/tests/*.test.cjs` prints `fail 0` and the pass count is recorded.
- [x] T002 [P] Record Vibe's options that take a value from `vibe --help` (`scratch/vibe-options.md`). Verify: `rg -c -- "--" scratch/vibe-options.md` prints at least 10.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add `vibe` to the frozen runtime list (`R/lib/relaunch-core.cjs`). Verify: `node -e 'console.log(require("./R/lib/relaunch-core.cjs").RUNTIMES.join(" "))'` prints a list ending in `vibe`.
- [x] T004 Add `vibe` to the runtime-list assertion (`R/tests/relaunch-core.test.cjs`). Verify: `node --test R/tests/relaunch-core.test.cjs` prints `fail 0`.
- [x] T005 Add the `vibe` runtime case and a launch case that passes the seed as the initial prompt with no `--model` (`L`). Verify: `bash -n L` exits 0 and `rg -c '\bvibe\b' L` prints at least 2.
- [x] T006 Add Vibe's value-taking options from T002 to the wrapper's option tables (`L`). Verify: `rg -c 'vibe:--' L` prints at least the count of value options T002 recorded.
- [x] T007 Add Vibe to the command-only prepare message beside Cursor and Devin (`R/bin/session-relaunch.cjs`). Verify: `rg -n "runtime === 'vibe'" R/bin/session-relaunch.cjs` prints one line.
- [x] T008 [P] Add the Vibe matrix row marked COMMAND-ONLY (`R/README.md`). Verify: `rg -n '^\| Vibe \|.*COMMAND-ONLY' R/README.md` prints one line.
- [x] T009 Add a Vibe launch-arguments case and a child-skip case (`R/tests/skilled-loop-wrapper-launch-arguments.test.cjs`). Verify: `node --test R/tests/skilled-loop-wrapper-launch-arguments.test.cjs` prints `fail 0`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Write the numbered operator steps for the manual hop: start `skilled-loop vibe` in a terminal, work until a handoff is wanted, run the prepare command, exit, watch the relaunch and the claim, then run `session-relaunch.cjs history` (`scratch/manual-hop/procedure.md`). Verify: `rg -c '^[0-9]+\. ' scratch/manual-hop/procedure.md` prints at least 6.
- [B] T011 Follow `scratch/manual-hop/procedure.md` for one manual hop under `skilled-loop vibe` and record the prepare line, the exit, the relaunch and the claim; decide from it whether a turn-start claim part and a `VIBE_SPEC_FOLDER` export are needed (`scratch/manual-hop.md`). Verify: `node R/bin/session-relaunch.cjs history` shows a claimed hop with runtime `vibe`, and `scratch/manual-hop.md` states both decisions. — Blocked: the hop needs an interactive operator at a terminal, which this non-interactive worker does not have; the prepare half and both decisions are recorded in `scratch/manual-hop.md`.
- [x] T012 Run the full relaunch suites (`R/tests/`). Verify: `node --test R/tests/*.test.cjs` prints `fail 0` and a pass count above the T001 baseline.
- [x] T013 Probe `vibe -p --resume <session_id>` on a keyed headless run that stopped on `--max-turns 1` (`scratch/resume-probe.md`). Verify: the file holds the command, its exit code and a one-line verdict.
- [x] T014 Validate this phase folder (`spec.md`). Verify: `validate.sh <this folder> --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed: the hop and the resume probe are recorded in `scratch/`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Relaunch loop**: `.skilled/hooks/session-relaunch/README.md`
<!-- /ANCHOR:cross-refs -->

---
