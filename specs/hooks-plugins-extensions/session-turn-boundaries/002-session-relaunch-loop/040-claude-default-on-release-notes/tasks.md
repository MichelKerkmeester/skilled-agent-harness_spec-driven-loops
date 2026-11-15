---
title: "Tasks: Claude Code session handover on by default and v4.0.2.1 release notes"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "claude default on release notes tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Claude Code session handover on by default and v4.0.2.1 release notes

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

`F` is `.skilled/hooks/shared/hook-flags`. `R` is `.skilled/hooks/session-relaunch/tests`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture the suite baselines (`R/*.test.cjs`, `F.test.cjs`, `pi/session-relaunch.test.ts`). Verify: the runs print 1,555, 28 and 62 tests passed with none failed.
- [x] T002 Record the measured default for every runtime (`F.cjs`). Verify: the Measured Behavior command in `spec.md` prints `"enabled":false` for all six runtimes.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add resolver tests for the Claude default, its switches and shell parity (`F.test.cjs`). Verify: `node --test F.test.cjs` fails on the new tests before T004.
- [x] T004 Add `DEFAULT_ON_RUNTIMES` and its last rung to `hookFlagDecision` (`F.cjs`). Verify: the new `.cjs` tests pass.
- [x] T005 Add the same rung to `hook_enabled` (`F.sh`). Verify: the parity test passes.
- [x] T006 Correct the default statements in the hook, plugin and spec-kit docs (`.skilled/hooks/**/README.md` and the files in `spec.md`). Verify: `rg -n 'ships off'` over those files prints no Claude line.
- [x] T007 Rewrite the Session Handover section and its glance, checks and upgrade rows (`.skilled/changelog/skilled/v4.0.2.1.md`). Verify: every child of packets 036 to 040 maps to a line in the section.
- [x] T008 Align In-Session Handover and the default statements (`README.md`). Verify: `rg -n 'off by default|ships off' README.md` prints no handover line that includes Claude Code.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run the three suites from the final tree (`R`, `F.test.cjs`, Pi). Verify: each prints `fail 0` with no fewer tests than T001.
- [x] T010 Validate the packet (`040-claude-default-on-release-notes`). Verify: `validate.sh --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] The Measured Behavior command prints Claude on and the other five off
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
- [x] CHK-003 [P1] Baselines captured before the first code edit
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check F.cjs` and `bash -n F.sh` exit 0
- [x] CHK-011 [P0] No code comment names a spec, packet, phase or task id
- [x] CHK-012 [P1] The new rung leaves the master, kill and runtime rungs unchanged
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] The new tests failed before the resolver change
- [x] CHK-022 [P1] A blank global value and a runtime outside `RUNTIMES` are tested
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secret or dotenv file is read or written
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks agree on the rung order
- [x] CHK-041 [P1] The release notes match the existing changelog style
- [x] CHK-042 [P1] The root README states the new default
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 6 | 6/6 |
| P1 Items | 8 | 8/8 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-11-14
<!-- /ANCHOR:summary -->

---
