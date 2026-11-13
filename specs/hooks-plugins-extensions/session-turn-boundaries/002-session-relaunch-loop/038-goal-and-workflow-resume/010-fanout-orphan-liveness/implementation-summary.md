---
title: "Implementation Summary"
description: "A fan-out re-run could start a second writer in a lineage directory whose first process still survived the runner. Each spawn now records its pid in the ledger, the pool probes that pid with signal 0, and a re-run with a live lineage refuses with exit 3 before it marks an orphan or dispatches anything."
trigger_phrases:
  - "fanout orphan liveness implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/010-fanout-orphan-liveness"
    last_updated_at: "2026-11-13T10:03:41Z"
    last_updated_by: "implementer"
    recent_action: "Built the liveness probe, the spawned ledger row and the re-run refusal; all checks green"
    next_safe_action: "None; the packet is complete"
    blockers: []
    key_files:
      - ".skilled/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs"
      - ".skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
      - ".skilled/skills/system-deep-loop/runtime/tests/unit/fanout-pool.vitest.ts"
      - ".skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fanout.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-010-fanout-orphan-liveness"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Should a re-run refused by a reused pid have an override? Answer: no; the refusal names the label and the pid."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-fanout-orphan-liveness |
| **Status** | Complete |
| **Completed** | 2026-11-13 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A fan-out re-run no longer trusts the ledger's open labels on their own. Before this change, a lineage whose process outlived the runner that started it was still listed as orphaned, charged a retry and dispatched again into the same lineage directory, so two processes wrote the same files under the same stored session id. The re-run now reads a pid that each spawn writes to the ledger, probes it without sending a signal, and refuses the whole run while any lineage from an earlier run still answers.

### Phase 10: fanout-orphan-liveness

The ledger gains one `spawned` row per lineage spawn, written from the `onSpawn` callback beside the in-memory liveness map. That map dies with the runner, so the row is the only pid that survives a hop. On the next run the pool collects each open label, takes the latest `spawned` row after its latest `started` row, and probes the process group and then the pid with signal 0. A label with no `spawned` row is never live, so ledgers written before this change behave exactly as they did.

When the probe finds a live label, `fanout-run.cjs` throws an input error before the orphan mark and before any dispatch. The process exits 3 with a JSON `status: 'error'` whose message names every live label and its pid, and the operator stops the surviving process before re-running. A lineage whose pid is gone is requeued as today.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs` | Modified | Adds `isLineageAlive` and `detectLiveLineages`, and makes `detectOrphanedLineages` and `markOrphanedLineages` skip a live label |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modified | Appends the `spawned` ledger row from `onSpawn`, and refuses a re-run while any lineage is live |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-pool.vitest.ts` | Modified | Adds the probe, detect, skip, exited-pid and legacy-ledger tests |
| `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fanout.vitest.ts` | Modified | Adds the end-to-end re-run refusal test against the adapter shim |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Test first, in the order the tasks set. The double writer was reproduced before any source edit: `scratch/repro-double-writer.cjs` runs one `cli-opencode` lineage against the `timeout` shim in a `mkdtemp` root, kills the first runner with SIGKILL, runs the same command again, and prints `captures=2` with two `alive=true` pids and one `orphan_requeued` row. No real model session was started and the temporary root was removed.

Five unit tests and one stress test were written next. The four must-fail tests each held a recorded failing run in `scratch/red.txt` before the source edit: `isLineageAlive` and `detectLiveLineages` were missing functions, the live label came back from `markOrphanedLineages`, and the second runner exited 143 instead of 3. Then `fanout-pool.cjs` and `fanout-run.cjs` were changed, and the same commands passed into `scratch/green.txt`: `tests/unit/fanout-pool.vitest.ts` reported `42 passed`, and the refusal test reported `1 passed`.

The after-change reproduction in `scratch/repro-after.txt` shows `captures=1`, one `alive=true` pid and `second runner exit=3`, with no `orphan_requeued` row. The named suites reported `Test Files 4 passed (4)`, `Tests 248 passed | 1 skipped (249)`, and strict validation printed `RESULT: PASSED`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Refuse the whole re-run, not only the live label | A run that skipped a live label would still merge a ledger that lineage keeps writing, so the run stops before any orphan mark or dispatch and names every live label and pid |
| Write a `spawned` row after the spawn | The `started` row fires before the spawn and carries no pid, and the only other pid lives in a map that dies with the runner; the row is written in `onSpawn` where the pid first exists |
| Probe the process group first, then the pid, with signal 0 | Lineages spawn as detached group leaders, so a group probe catches a live worker whose leader exited, and signal 0 proves existence without delivering anything |
| Treat `EPERM` as alive and a missing `spawned` row as not live | `EPERM` proves the target exists under another owner; an old ledger cannot prove liveness, and treating it as live would block every re-run after the upgrade |
| No override for a reused pid | The operator chose refusal only; the message names the label and pid so a false positive can be checked and the process stopped by hand |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Double writer before the edit, `scratch/repro.txt` | `captures=2`, two `alive=true` pids, one `orphan_requeued` row; `rg -c` printed 2 and 1 |
| `npx vitest run --no-coverage tests/unit/fanout-pool.vitest.ts` | PASS: `Test Files 1 passed (1)`, `Tests 42 passed (42)` |
| `npx vitest run --no-coverage tests/stress/cli-adapter/fanout.vitest.ts -t 'refuses a re-run'` | PASS: `Test Files 1 passed (1)`, `Tests 1 passed \| 20 skipped (21)` |
| Named suites, four files | PASS: `Test Files 4 passed (4)`, `Tests 248 passed \| 1 skipped (249)` |
| After-change reproduction, `scratch/repro-after.txt` | `captures=1`, one `alive=true` pid, `second runner exit=3`, no `orphan_requeued` row |
| Strict spec validation | `RESULT: PASSED` |
| Leftover shim processes, `pgrep -f 'fanout-repro-\|cli-opencode-stress-'` | No output, exit 1 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A reused pid can refuse a run that should start.** The probe reads only the pid, not the process start time, so a recycled pid looks alive. The refusal names the label and pid; the operator checks the process and stops it, or escalates to a start-time check.
2. **A runner killed between spawn and the `spawned` row leaves no pid on disk.** That lineage is treated as an orphan and requeued as today. The window is one synchronous append after `spawn` returns.
3. **Windows liveness is a pid-only probe.** Lineages are not detached on Windows, and no Windows run is part of this phase.
<!-- /ANCHOR:limitations -->

---
