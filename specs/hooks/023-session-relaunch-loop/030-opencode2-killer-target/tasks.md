---
title: "Tasks: Phase 30: opencode2-killer-target"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "opencode2 killer target tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 30: opencode2-killer-target

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

- [x] T001 Probe which OpenCode 2 process loads project plugins, and whether SIGTERM to the TUI ends both (`scratch/pid-probe.txt`)
- [x] T002 Record the relaunch and plugin gate baselines on the committed code (`scratch/gate/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Write the loop-child target test and see it fail on the old code (`.opencode/plugins/tests/session-relaunch.test.cjs`)
- [x] T004 Hand the killer the loop's direct child, falling back to the plugin's own pid (`.opencode/plugins/session-relaunch.js`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Rerun both gates and compare with the baselines (`scratch/gate/`)
- [x] T006 Rerun the live OpenCode 2 goal hop with the 028 harness; the first two reruns found the exit-130 and slow-exit defects, fixed test-first in T009 and T010, and the third passed (`scratch/opencode-a-hop/`)
- [x] T007 Update the OpenCode 2 hop criterion in phase 028 (`../028-goal-rebind-live-proof-and-docs/acceptance-criteria.md`)
- [x] T008 Correct the docs that say the OpenCode 2 hop fails
- [x] T009 Stamp the record before the signal and relaunch a signalled exit 130 (`relaunch-core.cjs`, `killer.cjs`, `session-relaunch.cjs`, `skilled-loop`)
- [x] T010 Raise the post-signal grace to 15 seconds (`killer.cjs`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks (`node --check .opencode/plugins/session-relaunch.js`)
- [x] CHK-011 [P0] No console errors or warnings in the gate runs
- [x] CHK-012 [P1] Error handling implemented: a failed walk falls back to the plugin's own pid
- [x] CHK-013 [P1] Code follows project patterns: the same shared walk the Hermes adapter uses
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (`acceptance-criteria.md`, six rows Met)
- [x] CHK-021 [P0] Manual testing complete (live hop, `scratch/opencode-a-hop/`)
- [x] CHK-022 [P1] Edge cases tested: a loop id that is not a pid keeps the plugin's own pid (the existing idle test at `.opencode/plugins/tests/session-relaunch.test.cjs:1015`)
- [x] CHK-023 [P1] Error scenarios validated: the fallback is the old behavior, which the existing idle tests pin
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: the OpenCode 2 killer target is `instance-only`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed: `rg -n -- "--target-pid"` lists the OpenCode, Pi, Hermes and Codex producers; Hermes already walks to the loop child and the others run in the process the wrapper starts.
- [x] CHK-FIX-003 [P0] Consumer inventory completed: the killer is the only consumer and its ancestry check accepts the loop child.
- [x] CHK-FIX-004 [P0] Not a path, parser or redaction fix; the killer's refusal of a pid outside the loop is unchanged.
- [x] CHK-FIX-005 [P1] Matrix axes: OpenCode 1 (host is the loop child), OpenCode 2 private server (host one below), OpenCode 2 shared service (no loop id, out of scope), non-pid loop id (fallback).
- [x] CHK-FIX-006 [P1] Hostile env variant: the test sets a real numeric loop id and runs through `dropNestedLoop` at plugin load.
- [x] CHK-FIX-007 [P1] Evidence was captured on the working tree this phase's commit records.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented: the walk rejects a loop id that is not a positive integer
- [x] CHK-032 [P1] Auth/authz working correctly: not applicable, no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate
- [x] CHK-042 [P2] README updated (`.skilled/hooks/session-relaunch/README.md`)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ holds only kept evidence
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-25
<!-- /ANCHOR:summary -->

---
