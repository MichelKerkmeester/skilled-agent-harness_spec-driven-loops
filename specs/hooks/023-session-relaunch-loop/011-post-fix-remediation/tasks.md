---
title: "Tasks: Phase 11: post-fix-remediation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "post fix remediation tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 11: post-fix-remediation

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Scaffold the phase folder with `create.sh --phase --parent` (this folder)
- [x] T002 Write each lane's tests first and see them fail on the current code
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P] Restamp a re-arm and add `armableRecord` for every arm path (`lib/relaunch-core.cjs`, five adapters, `lib/nudge.cjs`)
- [x] T004 [P] Shared exports and helpers: `HANDOFF_SECTIONS`, `handoffDir`, `RUNTIMES`, `readProcessTable`, the `env` parameter, the subcommand list (`lib/`, `bin/session-relaunch.cjs`)
- [x] T005 [P] `CLAUDE_PID` descent check in `prepare` (`bin/session-relaunch.cjs`)
- [x] T006 [P] `isEntrypoint` guard, Claude's exported arm function, `payloadEventName`, the Pi load check (adapters, `pi/session-relaunch.ts`)
- [x] T007 [P] Killer freshness check and logged template fallback (`lib/killer.cjs`)
- [x] T008 [P] `Date` clock in `shouldRelaunch` and the CLI's template warning (`lib/relaunch-core.cjs`, `bin/session-relaunch.cjs`)
- [x] T009 [P] Wrapper manual command from the core, visible template error, stdout (`.skilled/bin/skilled-loop`)
- [x] T010 [P] Arm conformance cases and adapter-level target tests (`tests/adapter-conformance.test.cjs`, `pi/session-relaunch.test.ts`, adapter tests)
- [x] T011 [P] Cursor and Devin wrapper tests (`tests/skilled-loop.test.cjs`)
- [x] T012 Docs: README frontmatter, glob test command, tests README invariant, wrapper variables, the new behaviour (`README.md`, `tests/README.md`, `ENV-REFERENCE.md`, `handoff.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Run the gate from the final state (node 566/566, Pi 39/39, tsc, shellcheck, hook registrations, mirrors)
- [x] T014 Swap in the pre-phase sources and prove the tests red, then restore (82 node and 2 Pi failures; `cmp` clean)
- [x] T015 Run recursive strict validation on the parent (RESULT: PASSED)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (red swap and byte-for-byte restore)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001 to REQ-004)
- [x] CHK-002 [P0] Technical approach defined in plan.md (affected-surfaces table)
- [x] CHK-003 [P1] Dependencies identified and available (the verified report, `ps`)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks (shellcheck rc 0, tsc rc 0, comment hygiene rc 0)
- [x] CHK-011 [P0] No console errors or warnings (suites rc 0)
- [x] CHK-012 [P1] Error handling implemented (refusals carry a reason; a failed `ps` still refuses)
- [x] CHK-013 [P1] Code follows project patterns (Node built-ins only)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (AC 6/6)
- [x] CHK-021 [P0] Manual testing complete (red swap and restore)
- [x] CHK-022 [P1] Edge cases tested (record without runtime, template with zero or two placeholders, linked entrypoint path, `Date` clock)
- [x] CHK-023 [P1] Error scenarios validated (dead killer, stale record at signal time, foreign loop, session and runtime)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. P1-1 and the killer check are algorithmic; P1-12, P2-13, P2-19 and P3-15 are cross-consumer; P2-10 is matrix/evidence; the rest are instance-only.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. `rg -n "armableRecord\("` lists all five arm paths and the nudge.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. See plan.md, Affected Surfaces.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. The arm guard has foreign loop, session and runtime cases; the template check has zero and two placeholders.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Five arm cases by five adapters, two skipped by design.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. Killer tests delete the process-wide template before running.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Pinned to the phase commit on `worktrees/156-session-relaunch-post-fix-remediation`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets (none in the diff)
- [x] CHK-031 [P0] Input validation implemented (arm guard, template check)
- [x] CHK-032 [P1] Auth/authz working correctly (`CLAUDE_PID` counts only inside the loop)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate (each new decision states why)
- [x] CHK-042 [P2] README updated (if applicable): the concern README and the tests README
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only (red-swap backups live in the session scratchpad)
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-19
<!-- /ANCHOR:summary -->

---
