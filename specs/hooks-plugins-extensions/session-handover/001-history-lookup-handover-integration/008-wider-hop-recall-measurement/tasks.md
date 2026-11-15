---
title: "Tasks: Phase 8: wider-hop-recall-measurement"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "wider hop recall measurement tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 8: wider-hop-recall-measurement

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

`H` is this phase's `scratch/harness/`. `CORE` is `.skilled/hooks/session-handover/history/dist/cli.js`.

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Copy the phase 1 harness into this phase (`H/hop-recall.sh`, `H/analyze.py`). Verify: `ls H` lists both files.
- [ ] T002 Point the copied harness at the engine's new build (`H/hop-recall.sh`). Verify: `rg -n 'session-handover/history/dist/cli.js' H/hop-recall.sh` prints one line and `rg -c 'runtime/dist/hooks/lib/history' H/hop-recall.sh` prints nothing.
- [ ] T003 Confirm the build the lookup arm needs exists. Verify: `test -f CORE && echo built` prints `built`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add a runtime argument that launches Codex or Vibe under `skilled-loop` (`H/hop-recall.sh`). Verify: a dry run per runtime ends with the receiver's answer in its pane capture.
- [ ] T005 Teach the scorer to read Codex rollouts and Vibe session folders (`H/analyze.py`). Verify: on each dry run it writes a `result.json` with `lookup_attempted` set.
- [ ] T006 Add a real-handoff mode: the sender does a real read-only task, and the question names a detail from its turns that the note left out (`H/hop-recall.sh`). Verify: a dry run's `result.json` holds the question, the source turn and the answer.
- [ ] T007 Run the counted synthetic runs, one runtime at a time, in both arms (`scratch/runs/`). Verify: each runtime and arm holds the agreed count of runs whose `result.json` meets the counting rule.
- [ ] T008 Run the counted real handoffs, one runtime at a time, in both arms (`scratch/runs/`). Verify: each runtime and arm holds the agreed count of real-handoff runs.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Check every baseline run kept the build hidden (`scratch/runs/baseline-*`). Verify: every counted baseline `result.json` reads `cliReappeared=0`.
- [ ] T010 Write the result table with its exclusions and limits (`scratch/measurement.md`). Verify: `rg -n 'Claude Code|Codex|Vibe' scratch/measurement.md` prints a row for each runtime.
- [ ] T011 Confirm the engine build is back after the last run. Verify: `test -f CORE && echo built` prints `built`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] `scratch/measurement.md` reports both arms on Claude Code, Codex and Vibe for both handoff kinds
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Phase 1 harness and runs**: `../001-hop-recall-baseline/scratch/`
- **Earlier result table**: `../006-docs-and-live-hop-proof/scratch/measurement.md`
<!-- /ANCHOR:cross-refs -->

---



