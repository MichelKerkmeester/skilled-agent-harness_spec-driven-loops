---
title: "Tasks: Phase 8: review-3-remediation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "review 3 remediation tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 8: review-3-remediation

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
- [x] T002 Confirm each of the fifteen findings against its file and line (`../review/review-report.md`, Verification)
- [x] T003 Prove each new behavior test fails on the pre-fix library files (6 of 163 failing, AC-003)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Treat a future `armedAt` as stale, DS-009 (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs`)
- [x] T005 Supersede this session's open notes and pin note updates to 0600, DS-002 and DS-003 (`relaunch-core.cjs`)
- [x] T006 Create a private handoffs directory and prefer the newest open note, DS-001, DS-002 and DS-003 (`.skilled/hooks/session-relaunch/lib/nudge.cjs`)
- [x] T007 Sweep stranded `.stale-` lock directories, DS-008 (`.skilled/hooks/session-relaunch/lib/killer.cjs`)
- [x] T008 Add Claude and Codex `spec_folder` nudge tests, DS-011 (`tests/claude-adapters.test.cjs`, `tests/codex-adapters.test.cjs`)
- [x] T009 Document both exit-3 paths, DS-007 (`.skilled/commands/speckit/handoff.md`)
- [x] T010 Add `SYSTEM_SPEC_FOLDER` and `HERMES_SPEC_FOLDER`, DS-010 (`.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`)
- [x] T011 Commit the run-10 log lines as `relaunch-run10.txt` and re-point the citations, DS-004 (`../007-handoff-gate-exemptions/`, the run-10 benchmark folder)
- [x] T012 Rerun the phase 002 smokes and reconcile its AC-003 and summary, P1-001 and P2-002 (`../002-pi-opencode-adapters/`)
- [x] T013 Move the phase 006 verification table into the packet and cite the archived round-2 report, DS-006 (`../006-deep-review-2-remediation/`)
- [x] T014 Bring the parent spec and goal to eight phases, DS-005, P2-003 and P2-004 (`../spec.md`, `../goal.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Run the full gate from the final state (rc 0, node 455/455, drift 4/4)
- [x] T016 Run recursive strict validation on the parent (nine RESULT: PASSED)
- [x] T017 Run comment hygiene on the changed code and tests (rc 0)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (phase 002 smokes rerun, `evidence/phase-002-smokes-2026-10-19.txt`)
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
- [x] CHK-002 [P0] Technical approach defined in plan.md (affected-surfaces table)
- [x] CHK-003 [P1] Dependencies identified and available (local relaunch log, `pi`, the OpenCode plugin)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks (drift guards 4/4 rc 0)
- [x] CHK-011 [P0] No console errors or warnings (suites rc 0; drift warnings are in unrelated spec scratch files)
- [x] CHK-012 [P1] Error handling implemented (directory create failure swallowed so the nudge still fires)
- [x] CHK-013 [P1] Code follows project patterns (Node built-ins only, comment hygiene rc 0)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (AC 7/7)
- [x] CHK-021 [P0] Manual testing complete (phase 002 literal smokes rc 0)
- [x] CHK-022 [P1] Edge cases tested (armed 1 ms in the future, two open notes, permissive note mode, aged stale-lock leftover)
- [x] CHK-023 [P1] Error scenarios validated (a fresh leftover survives the sweep; another session's open note is untouched)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. Each registry row carries one (`../review/deep-review-findings-registry.json`).
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. `rg -n "\.stale-"` in `killer.cjs` shows both rename sites.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. See plan.md, Affected Surfaces.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. No path, parser or redaction logic changed; the mode and directory fixes have their own tests.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. See plan.md, Affected Surfaces.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. The relative-root planner test now runs in its own temp cwd.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Pinned to the phase 008 commit on `worktrees/148-session-relaunch-deep-review`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets (evidence files scanned)
- [x] CHK-031 [P0] Input validation implemented (unchanged session-id and spec-folder gates)
- [x] CHK-032 [P1] Auth/authz working correctly (owner-only directory and note mode)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate (each fix states why)
- [x] CHK-042 [P2] README updated (if applicable): the command doc and env reference; no README claim changed
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only (run scratch lives in the session scratchpad)
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



