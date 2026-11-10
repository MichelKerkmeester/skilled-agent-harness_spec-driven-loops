---
title: "Tasks: Phase 32: opencode2-standalone-replay"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "opencode2 standalone replay tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 32: opencode2-standalone-replay

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

- [x] T001 Probe the installed OpenCode 2 for its flags (`opencode --help`, `opencode mini --help`)
- [x] T002 Baseline the relaunch gate: 837 of 837
- [x] T003 Write the failing wrapper tests and the stub `--help` answer (`.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Probe, `--standalone` on the first launch and the relaunch, `-m` dropped on OpenCode 2 (`.skilled/bin/skilled-loop`)
- [x] T005 Warn on `--server` (`.skilled/bin/skilled-loop`)
- [x] T006 Pass `api`, `service`, `reload`, `pair` and `mini` through (`.skilled/bin/skilled-loop-shell.sh`)
- [x] T007 Correct the docs that told the operator to pass the flag
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run the two-hop live proof without a shim (`scratch/harness/run-two-hop.sh`)
- [x] T009 Rerun the whole relaunch gate, plugin tests and Pi tests and report the delta
- [x] T010 Repair derived files, validate strict, fill the summary and the parent phase map
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

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001 to REQ-005)
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available (OpenCode 2.1.4 installed)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks (`bash -n` on both scripts)
- [x] CHK-011 [P0] No console errors or warnings (only the intended `--server` warning)
- [x] CHK-012 [P1] Error handling implemented (a failed probe leaves the launch unchanged)
- [x] CHK-013 [P1] Code follows project patterns (mirrors the Codex `--no-daemon` prepend)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (AC-001 to AC-005)
- [x] CHK-021 [P0] Manual testing complete (two live hops, `scratch/two-hop-live/`)
- [x] CHK-022 [P1] Edge cases tested (operator `--standalone`, `--server`, older help)
- [x] CHK-023 [P1] Error scenarios validated (`-m` rejected by OpenCode 2, probed live)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Class: `class-of-bug`, the relaunch rebuild dropped a launch flag.
- [x] CHK-FIX-002 [P0] Same-class producer: `build_relaunch_arguments` is the one place relaunch flags are built.
- [x] CHK-FIX-003 [P0] Consumers: the relaunch and the manual claim template, both covered by tests.
- [x] CHK-FIX-004 [P0] Not a security, path, parser or redaction fix.
- [x] CHK-FIX-005 [P1] Axes: help lists the flag or not, and the operator passed `--standalone`, `--server` or neither. Five rows.
- [x] CHK-FIX-006 [P1] The stub is driven by `STUB_HELP` per case, and the suite clears inherited loop variables.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the uncommitted diff on top of `79da339403`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets (evidence scanned)
- [x] CHK-031 [P0] Input validation implemented (help text matched, not executed)
- [x] CHK-032 [P1] Auth/authz: not applicable
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate
- [x] CHK-042 [P2] README updated
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ holds only the harness and the run evidence
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



