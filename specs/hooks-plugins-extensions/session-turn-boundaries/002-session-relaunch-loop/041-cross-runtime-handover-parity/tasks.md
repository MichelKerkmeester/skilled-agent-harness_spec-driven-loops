---
title: "Tasks: Cross-runtime session handover parity for Pi, OpenCode and Codex"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "cross runtime handover parity tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Cross-runtime session handover parity for Pi, OpenCode and Codex

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

`R` is `.skilled/hooks/session-relaunch`. `H` is this packet's `scratch/harness`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Build the live-hop harness and scorer (`H/live-hop.sh`, `H/score.cjs`). Verify: `bash -n` and `node --check` exit 0, and a Claude run scores 5/5.
- [x] T002 Run the baseline on all four runtimes (`H/../runs/base1-*`). Verify: Claude 5/5, Codex 5/5, Pi 2/5, OpenCode 1/5.
- [x] T003 Capture the suite baselines (`R/tests`, `.opencode/plugins/tests`, `R/pi`). Verify: 1,556 and 62 passed with none failed.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add OpenCode 2 host-walk tests (`R/tests/relaunch-core.test.cjs`). Verify: 2 of 3 fail on the old code, the nested guard passes.
- [x] T005 Skip OpenCode helpers in the host walk (`R/lib/relaunch-core.cjs`). Verify: the suite prints 170 passed, 0 failed.
- [x] T006 Add the `turn_end` steer tests (`R/pi/session-relaunch.test.ts`). Verify: both fail on the old code.
- [x] T007 Steer the held nudge at `turn_end` (`R/pi/session-relaunch.ts`). Verify: the Pi suite passes and a live Pi run prepares under its real session id.
- [x] T008 Add the appended-block seed test, then read the seed from the first block (`R/pi/session-relaunch.*`). Verify: the test fails first, then 65 of 65 pass and a live Pi run scores 5/5.
- [x] T009 Declare the `turn_end` registrar the way the adapter declares its other events (`R/pi/session-relaunch.ts`). Verify: `tsc -p tsconfig.pi.json` exits 0.
- [x] T010 Describe the new Pi delivery and the host walk (`R/README.md`, `R/pi/README.md`, `.skilled/hooks/injection-contract.md`, the Pi and OpenCode playbook, the relaunch feature catalog entry). Verify: `rg 'holds the nudge for .agent_end.'` finds nothing.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run the full gate from the final tree. Verify: 1,560 relaunch and plugin tests, 29 flag tests, 65 Pi tests, `tsc` exit 0, both sync checks PASS.
- [x] T012 Print the `complete` command after the claimed note body (`R/bin/session-relaunch.cjs`, `R/tests/session-relaunch-cli.test.cjs`). Verify: the new test fails without it, then 1,560 pass.
- [x] T014 Run four final live rounds on all four runtimes (`H/../runs/final*`). Verify: in rounds 3 and 4 every runtime hops and closes its note.
- [x] T013 Validate the packet (`041-cross-runtime-handover-parity`). Verify: `validate.sh --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every runtime hops and closes its note in rounds 3 and 4
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance**: See `acceptance-criteria.md`
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
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Live and suite baselines captured before the first code edit
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check` on the core and `tsc -p tsconfig.pi.json` exit 0
- [x] CHK-011 [P0] No code comment names a spec, packet, phase or task id
- [x] CHK-012 [P1] The shared seed parser is unchanged
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Each new test failed before its fix
- [x] CHK-022 [P1] A nested OpenCode run and a Pi turn with no tool results are tested
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secret or dotenv file is read or written
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks agree on the three producers
- [x] CHK-041 [P1] Docs describe the `turn_end` steer and the OpenCode host walk
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Harness and run evidence in scratch/ only
- [x] CHK-051 [P1] Every run folder under scratch/runs holds evidence a criterion cites
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 6 | 6/6 |
| P1 Items | 7 | 7/7 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-11-14
<!-- /ANCHOR:summary -->

---
