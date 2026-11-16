---
title: "Tasks: Phase 2: failed-arm-deferred-mark"
description: "Ordered tasks for the deferred mark on Codex, Pi and OpenCode, each built by one Vibe CLI brief and checked by a test and a mutation."
trigger_phrases:
  - "failed arm deferred mark tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 2: failed-arm-deferred-mark

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

`H` is `.skilled/hooks/session-handover`. Briefs live in `../scratch/briefs/`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the baseline (`H/tests`). Verify: the suite prints `fail 0` and its test count. Evidence: before any change the handover suite printed `tests 1026`, `fail 0`, Pi vitest `67 passed` and the OpenCode plugin suite `tests 73`, `fail 0`.
- [x] T002 Write the briefs for this phase (`../scratch/briefs/`). Verify: one brief per change. Evidence: `../scratch/briefs/03-codex-defer-failed-arm.md` to `06-opencode-defer-and-withdraw.md`, one change each.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Codex: mark deferred and print the notice on three failed branches (`H/codex/stop-arm.mjs`). Verify: each branch test fails with its mark removed. Evidence: the no-transcript, no-target and arm-throws branches call `markParked` and `writeNotice`. With the marks removed, four tests fail: the three branch tests and the Codex conformance row.
- [x] T004 [P] Pi and OpenCode: mark deferred when `arm` throws (`H/pi/session-handover.ts`, `.opencode/plugins/session-handover.js`). Verify: each test fails with its mark removed. Evidence: Pi wraps `arm` in try/catch and logs `agent-settled-arm-error`. OpenCode does the same and logs `session-idle-arm-error`. With the mark removed, one test fails on each.
- [x] T005 Default withdraw policy on Codex, Pi and OpenCode (`H/codex/shared.mjs`, `H/pi/session-handover.ts`, `.opencode/plugins/session-handover.js`). Verify: a deferred record is withdrawn, a fresh pending one stays, and the test fails with `pending: 'none'` restored. Evidence: the `pending: 'none'` argument is gone on all three runtimes. Restoring it fails one test on each: Codex, Pi and OpenCode. A fresh pending record stays pending in the Codex test, in Pi's `agent_start before the arm leaves a pending record pending` and in OpenCode's `a user message before the arm does not disarm`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Run the handover and Pi suites from the final state. Verify: `fail 0` above the baseline count. Evidence: handover `tests 1039`, `fail 0`, Pi vitest `69 passed`, OpenCode plugin `tests 75`, `fail 0`.
- [x] T007 Update the README withdraw and arm paragraphs (`H/README.md`). Verify: drift guards pass. Evidence: the README's Codex, Pi and OpenCode paragraphs and its record-state tables now name the deferred mark and the withdraw; drift guards print `all 4 guards PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed: N/A, the failure branches cannot be forced in a live hop; the unit tests cover each
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
- [x] CHK-003 [P1] Dependencies identified and available Evidence: `markDeferred` in `relaunch-core.cjs` and the default deferred policy in `lib/withdraw.cjs` already exist.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Drift guards pass Evidence: `run-all-drift-guards.sh` prints `all 4 guards PASSED`.
- [x] CHK-011 [P0] No test prints an error Evidence: all three suites print zero failures.
- [x] CHK-012 [P1] A failure while marking logs and never fails the hook Evidence: each `markParked` catches its own error and logs `stage=defer`, and each notice write catches and logs `stage=notice`.
- [x] CHK-013 [P1] Code follows the Claude adapter's shape Evidence: the Codex branches mirror Claude's `stop-arm.mjs`: log, mark, one `systemMessage` line.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met Evidence: every row in `acceptance-criteria.md` is Met.
- [x] CHK-021 [P0] Manual testing complete Evidence: both live hops ran the arm path to a relaunch with no deferral: `../scratch/runs/live1-pi` and `live1-opencode` score 5/5.
- [x] CHK-022 [P1] Edge cases tested: another session's record, a fresh pending record Evidence: the Pi and OpenCode suites keep their tests for another session's record, and the Codex withdraw test checks a fresh pending record stays pending.
- [x] CHK-023 [P1] Error scenarios validated: each failed arm branch Evidence: one Codex test per failed branch, and one arm-throws test each on Pi and OpenCode.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each finding has a class Evidence: the failed-arm gap is `cross-consumer`: the withdraw helper only withdraws what a failed arm marked.
- [x] CHK-FIX-002 [P0] Same-class producers checked Evidence: every arm producer now marks a failed arm: Claude already did, and Codex, Pi, OpenCode and Vibe do now.
- [x] CHK-FIX-003 [P0] Consumers checked Evidence: the consumers are the withdraw paths on Codex, Pi and OpenCode, which now use the helper's default policy, and `should-relaunch`, which reports the result as `withdrawn`.
- [x] CHK-FIX-004 [P0] Security or path fix reviewed, or N/A Evidence: N/A: no path or security surface changes.
- [x] CHK-FIX-005 [P1] Matrix axes named Evidence: axes: runtime (Codex, Pi, OpenCode) by record state (fresh pending, deferred, armed).
- [x] CHK-FIX-006 [P1] Hostile environment considered Evidence: a state directory that cannot be written leaves the record as it was and logs the mark error; the hook still returns.
- [x] CHK-FIX-007 [P1] Evidence pinned to the feature commit Evidence: evidence is pinned to the phase's feature commit on branch `worktrees/420-cross-runtime-handover-parity-fixes`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets Evidence: no secret in code or tests.
- [x] CHK-031 [P0] Input validation: the mark and withdraw act only on the loop's own record Evidence: `markDeferred` and the withdraw take the loop id from the environment, and the arm path already matched the record to this session.
- [x] CHK-032 [P1] N/A: no authentication surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks name the same files Evidence: spec, plan and tasks name the same five code files and their tests.
- [x] CHK-041 [P1] Code comments carry no spec or phase ids Evidence: a grep of the added comment lines for ticket, phase and spec ids finds none.
- [x] CHK-042 [P2] README names the deferred mark and policy for Codex, Pi and OpenCode Evidence: the README names the deferred mark and the default withdraw policy for Codex, Pi and OpenCode.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned Evidence: only the run folders and briefs stay in `../scratch/`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Pending
<!-- /ANCHOR:summary -->

---
