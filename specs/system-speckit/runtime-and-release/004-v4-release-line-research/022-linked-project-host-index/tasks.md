---
title: "Tasks: Phase 22: linked-project-host-index"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "linked project host index tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 22: linked-project-host-index

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

`R` is `.skilled/skills/system-spec-kit/runtime/cli/retrieval`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record baselines (`implementation-summary.md`). Verify: the retrieval files have a before count there.
- [x] T002 Reproduce the gap (`spec.md` Measured Behavior). Verify: the bare lookup from `backend-system` reads the packaged index and finds 0 candidates.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 `owningHostRoot` (`R/lib/host-index.mjs`). Verify: linked-project cases a and c pass.
- [x] T004 Default index, scope and paths line (`R/lookup-trigger-index.mjs`). Verify: cases a and b pass.
- [x] T005 Generator refusal, with a project's own index exempt (`R/generate-trigger-index.mjs`). Verify: case d and the own-index case pass.
- [x] T006 Linked Project Checkouts section (`runtime/data/README.md`). Verify: read against the code.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Rerun every baseline suite. Verify: no baseline-passing test fails; counts in `implementation-summary.md`.
- [x] T008 Run the Barter reproduction read-only. Verify: the source names the ai-speckit index and the notifications packet is found.
- [x] T009 Cross-family review of the phase diff. Verify: verdict in `decision-record.md` ADR-003.
- [x] T010 Strict validation of this folder. Verify: `validate.sh <this folder> --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the Barter reproduction from `backend-system`, recorded in the acceptance criteria
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decisions**: See `decision-record.md`
- **Findings**: the Barter handover of 2026-11-09, session 2381e5f3
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

A blocked task after three fix attempts marks the phase Blocked with evidence in `decision-record.md` (goal G7).
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Baselines captured before the first edit
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check` on both scripts; vitest passes; `git diff --check` clean
- [x] CHK-011 [P0] No new failure in any baseline suite
- [x] CHK-012 [P1] No spec path or finding id in any changed code comment
- [x] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Measured Behavior probes rerun by hand
- [x] CHK-022 [P1] One test per changed behaviour fails on the old code
- [x] CHK-023 [P1] Edge cases in `spec.md` exercised
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Class: index location resolved from the caller's root only, though the caller's tree is linked from another repository.
- [x] CHK-FIX-002 [P0] Same-class producer inventory done: the lookup default and the generator default (see `plan.md`).
- [x] CHK-FIX-003 [P0] Consumer inventory done for `defaultIndexPath`, `parseArgs` and the README.
- [x] CHK-FIX-004 [P0] Adversarial cases tested: owner without an index, project with its own index, empty and explicit `--spec-folder`, explicit `--index`.
- [x] CHK-FIX-005 [P1] Matrix axes listed in `plan.md`.
- [x] CHK-FIX-006 [P1] Hostile variant: a bare generation from a linked project writes nothing, packaged files unchanged by hash.
- [x] CHK-FIX-007 [P1] Evidence pinned to this phase's commit.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] The lookup reads only the index of the repository holding the caller's linked tree
- [x] CHK-032 [P1] N/A: no auth surface in this phase
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Changed code comments state the rule the code applies
- [x] CHK-042 [P2] The data README describes linked projects
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Probe logs live in the session scratchpad, not the worktree
- [x] CHK-051 [P1] scratch/ holds only its `.gitkeep`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-09
<!-- /ANCHOR:summary -->

---
