---
title: "Tasks: Phase 11: opencode-pi-handover-parity"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "opencode pi handover parity tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 11: opencode-pi-handover-parity

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Record the suite baselines (`.skilled/hooks`). Verify: with `env -u AI_SESSION_CHILD`, engine prints `Tests  146 passed (146)`, hooks vitest `Tests  503 passed (503)`, readers `pass 103`, hand-over `pass 1115`.
- [x] T002 Score recall from the receiver's transcript (`scratch/harness/score.cjs`). Verify: re-scoring `runs/base1-pi` prints `sideWordStated: false, lookupCalls: 0` and `runs/base1-opencode` prints `true, 4`.
- [x] T003 Plant a URL password and clear `AI_SESSION_CHILD` in the harness (`scratch/harness/live-hop.sh`). Verify: `bash -n scratch/harness/live-hop.sh` exits 0 and `meta.json` of a new run holds `plantedSecret`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T004 Tell the sender the History Lookup exists (`.skilled/hooks/session-handover/lib/nudge.cjs`). Verify: `node --test .skilled/hooks/session-handover/tests/nudge.test.cjs` passes with the handoff-text test asserting the new line.
- [x] T005 Add a seed step that runs the lookup before asking the operator (`lib/nudge.cjs`). Verify: the seed-text test asserts step 6 names `## History Lookup`.
- [x] T006 Extend the claim closing line (`.skilled/hooks/session-handover/bin/session-handover.cjs`). Verify: the CLI suite passes with the updated `LOOKUP_SENTENCE`.
- [x] T007 Mirror the text in the command (`.skilled/commands/speckit/handoff.md`). Verify: `validate_document.py --type command` prints `Total issues: 0` and the mirror check prints `257 mirrors across 10 trees are in sync`.
- [x] T008 Redact credentials under header, camel-case and plural names and inside arrays (`.skilled/hooks/session-handover/history/lib/core.ts`). Verify: the redaction suite passes 5 of 5, and with the array fix reverted it prints `1 failed | 4 passed (5)`.
- [x] T009 End a cut browse preview with an ellipsis (`history/lib/navigator.ts`). Verify: the browse suite asserts a 160-character preview ending in `…`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T010 Rerun the four suites, typecheck and build (`.skilled/hooks`). Verify: engine `148 passed`, hooks `503 passed`, readers `pass 103`, hand-over `pass 1115`, typecheck and build exit 0.
- [x] T011 Prove the Pi hop three times in a row (`scratch/harness/live-hop.sh`). Verify: `runs/fix1-pi` to `runs/fix3-pi` each score 5/5 with `sideWordStated: true`, `sideWordInNote: false`, `leakedToReceiver: false`, `markerInLookupReply: true`.
- [x] T012 Prove the OpenCode hop three times in a row (`scratch/harness/live-hop.sh`). Verify: `runs/fix1-opencode` to `runs/fix3-opencode` each score the same way.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



