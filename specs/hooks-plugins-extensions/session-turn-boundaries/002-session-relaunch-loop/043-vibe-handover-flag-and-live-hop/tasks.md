---
title: "Tasks: Vibe handover switch and live hop"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "vibe handover flag and live hop tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Vibe handover switch and live hop

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

`F` is `.skilled/hooks/shared`. `H` is this phase's `scratch/harness`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Measure the Vibe switch on the old code (`F/hook-flags.cjs`). Verify: `hookFlagDecision` with only `SYSTEM_SESSION_RELAUNCH_VIBE_ENABLED=1` and runtime `vibe` prints `enabled:false` and `reason:"global"`, recorded in `spec.md`.
- [x] T002 Copy the phase 042 probe and give it a Vibe case, `HOP_ENVS` and `VIBE_HOME` (`H/probe.sh`). Verify: `bash -n H/probe.sh` exits 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Write the runtime-list parity test first (`F/hook-flags.test.cjs`). Verify: on the old code the suite prints `pass 29` and `fail 1`, the missing entry `'vibe'`.
- [x] T004 Add `vibe` to `RUNTIMES` (`F/hook-flags.cjs`) and to the runtime case (`F/hook-flags.sh`). Verify: the suite prints `pass 30` and `fail 0`.
- [x] T005 [P] Name the Vibe switch in both env templates, the env reference and the doctor env flow, and correct the count in the relaunch tests README (`.env.example`, `.skilled/hooks/hook-flags.env.example`, `ENV-REFERENCE.md`, `doctor-env.yaml`, `session-relaunch/tests/README.md`). Verify: `rg -c SYSTEM_SESSION_RELAUNCH_VIBE_ENABLED` prints 1 for each of the first four.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Prepare a Vibe record on the Vibe switch alone. Verify: with `SYSTEM_SESSION_RELAUNCH_VIBE_ENABLED=0` prepare exits 2 naming that switch, and with `=1` it exits 0 and writes a pending record with `"runtime":"vibe"`.
- [x] T007 Run the gate. Verify: relaunch and plugin suites 1,567 passed, flag suite 30, Pi 67 under `.skilled/hooks/vitest.config.ts`, `tsc -p tsconfig.pi.json` exit 0, goal suites 203, writer tests 75, Vibe tests 48, both sync checks PASS, all 4 drift guards PASS.
- [x] T008 Run one live Vibe hop through `skilled-loop vibe` (`H/probe.sh vibe`). Verify: `scratch/runs/hop2-vibe/relaunch.log` shows `prepare` and then `decline reason=not-armed` with the printed claim command, and `scratch/runs/claim2-vibe` shows the receiver claim and complete the note, which reads `status: done`. The command-only tier prints the claim command instead of relaunching, so `relaunch` never appears.
- [x] T009 Write the two fixes the live run found, tests first (`generate-context.ts`, `handoff.md`, `save.md`, `speckit-save-context-tail.yaml`, `session-relaunch/README.md`). Verify: the writer tests print 3 failed on the old code and 75 passed after, and `rg -n "Devin, Cursor or Vibe" .skilled/commands/speckit/handoff.md` prints two lines.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the live Vibe runs are saved under `scratch/runs/`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
