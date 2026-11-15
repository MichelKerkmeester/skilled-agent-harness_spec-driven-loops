---
title: "Tasks: Handover gap closure on Pi, OpenCode and Codex"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "handover gap closure tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Handover gap closure on Pi, OpenCode and Codex

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

- [x] T001 Build the step-typing probe (`H/probe.sh`). Verify: `bash -n` exits 0 and a Claude run writes `pane.txt`, `relaunch.log` and `meta.json`.
- [x] T002 Measure the question gap on all four runtimes (`H/../runs/qguard-*`). Verify: Claude and Codex hop, Pi and OpenCode sit behind an open dialog with no signal.
- [x] T003 Measure the withdraw gap after the turn ends (`H/../runs/withdraw-pi`, `withdraw2-claude`, `withdrawbase-opencode`). Verify: Claude says withdrawn, Pi and OpenCode say they should stop or go idle.
- [x] T004 Measure the OpenCode model routes (`H/../runs/modelroute-opencode`). Verify: all three launches show the project model.
- [x] T005 Measure the Codex goal hop (`H/../runs/goal2-codex`). Verify: the receiver thread holds the goal from the note.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Add the Pi question and notice tests (`R/pi/session-relaunch.test.ts`). Verify: both fail on the old code.
- [x] T007 Add `questionHoldReason` and move Claude's guard onto it (`R/lib/nudge.cjs`, `R/claude/subagent-guard.mjs`). Verify: `subagent-guard.test.cjs` prints 23 passed.
- [x] T008 Refuse Pi's question tools and steer the notice (`R/pi/session-relaunch.ts`). Verify: 67 of 67 Pi tests pass and `tsc -p tsconfig.pi.json` exits 0.
- [x] T009 Add the OpenCode question and notice tests, then the fix (`.opencode/plugins/session-relaunch.js`). Verify: 2 fail first, then the plugin suite prints 73 passed.
- [x] T010 Add the Codex pointer tests, then `R/codex/compact-pointer.mjs` and its registry row. Verify: 3 fail first, then `codex-adapters.test.cjs` prints 29 passed and both sync checks PASS.
- [x] T011 Describe the guard, the notice and the Codex pointer (`R/README.md`, `R/codex/README.md`, `R/pi/README.md`, `R/opencode/README.md`, the relaunch feature catalog entry). Verify: `rg -n questionHoldReason R/README.md` finds the paragraph.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Run the full gate from the final tree. Verify: 1,564 relaunch and plugin tests, 29 flag tests, 67 Pi tests, 200 goal tests, `tsc` exit 0, both sync checks PASS.
- [x] T013 Probe the fixed code live (`H/../runs/qguardfix-*`, `withdrawfix-*`, `compactclone-codex`). Verify: no open dialog with a prepared record, both models say withdrawn, `compact-pointer` logged.
- [ ] T014 Validate the packet (`042-handover-gap-closure`). Verify: `validate.sh --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` but the closing validation
- [x] No `[B]` blocked tasks remaining
- [x] Every gap has a before and an after run, or a run that shows why it has no fix
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

- [x] CHK-010 [P0] `node --check` on the changed modules and `tsc -p tsconfig.pi.json` exit 0
- [x] CHK-011 [P0] No code comment names a spec, packet, phase or task id
- [x] CHK-012 [P1] Claude's refusal text is unchanged
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Each new test failed before its fix
- [x] CHK-022 [P1] Another session's question and a non-question tool are allowed, and a startup source adds nothing on Codex
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secret or dotenv file is read or written
- [x] CHK-031 [P1] The hook-trust bypass ran only on a scratch clone, for one probe, and changed no trust setting
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks agree on the five gaps and their outcome
- [x] CHK-041 [P1] Docs describe the guard on three runtimes, the notice on four and the Codex pointer
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Probe and run evidence in scratch/ only
- [x] CHK-051 [P1] Every run folder under scratch/runs holds evidence the summary cites
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 6 | 6/6 |
| P1 Items | 9 | 9/9 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-11-15
<!-- /ANCHOR:summary -->

---
