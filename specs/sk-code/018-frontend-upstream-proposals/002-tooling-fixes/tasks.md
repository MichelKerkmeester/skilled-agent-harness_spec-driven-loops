---
title: "Tasks: Phase 2: tooling-fixes"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "tooling fixes tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 2: tooling-fixes

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

`S` is `.skilled/skills/sk-doc/sk-create-skill/scripts`. `GEN` is `node $S/generate-router-intent-signals.cjs`. `RCH` is `node $S/ci-router-vocabulary-reach.cjs`.
<!-- /ANCHOR:notation -->

---
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Measure reach on sk-code at concurrency 8 and at 2, recording wall time and `probe-error` count (`scratch/reach-concurrency.txt`). Verify: the file holds two summary lines and two wall times. Evidence: `scratch/reach-concurrency.txt`.
- [x] T002 Decide the keep-marker form and record it with its reason (`scratch/keep-marker.md`). Verify: the note names one form and one rejected alternative. Evidence: `scratch/keep-marker.md`.
- [x] T003 [P] List every caller of `GEN --check` and of `DEFAULT_CONCURRENCY` (`scratch/callers.txt`). Verify: `rg -n "generate-router-intent-signals|DEFAULT_CONCURRENCY" .skilled .github` output is saved. Evidence: `scratch/callers.txt`, 54 lines.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Compute orphans in `plan()` next to `missing`, honoring the keep marker (`$S/generate-router-intent-signals.cjs`). Verify: a fixture with one orphan yields `orphans.length === 1` in a test. Evidence: orphan test passes.
- [x] T005 Report and count orphans in the text and JSON output and fail `--check` on them (`$S/generate-router-intent-signals.cjs`). Verify: `GEN --check` on the fixture exits 1 and names the orphan. Evidence: `--check` exits 1 naming the orphan in the fixture.
- [x] T006 Remove orphans on `--write`, keeping the order of the remaining signals (`$S/generate-router-intent-signals.cjs`). Verify: the fixture's `intent_signals` after `--write` equals the expected array. Evidence: order test passes.
- [x] T007 Apply the measured reach choice: default 2, or a concurrency-1 retry of `probe-error` rows (`$S/ci-router-vocabulary-reach.cjs`). Verify: a test pins the default behavior. Evidence: default 2 (ADR-002), pinned by a test.
- [x] T008 [P] Add the tests for T004 to T007 (`$S/tests/`). Verify: `node --test $S/tests/` lists the new tests as passing. Evidence: 7 new tests pass.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Revert T004 locally and rerun the orphan test. Verify: the test fails, then passes again once T004 is restored. Evidence: `scratch/revert-test.txt`: 3 fail broken, 7 pass restored.
- [x] T010 Run `GEN --check` against the live tree and save the orphan report for the hub owners (`scratch/orphans.txt`). Verify: the file lists each hub with its orphan count. Evidence: `scratch/orphans.txt`.
- [x] T011 Run the full scripts test suite from the final state. Verify: `node --test $S/tests/` exits 0. Evidence: 97/97, exit 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `scratch/orphans.txt` holds the live orphan report and no hub `graph-metadata.json` changed
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

No live hub is pruned in this phase. A task that would run `--write` against a live hub is out of scope, not blocked.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available
- [x] CHK-004 [P1] `scratch/reach-concurrency.txt` holds the measured comparison
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check` exits 0 on both scripts
- [x] CHK-011 [P1] The script headers describe the orphan rule and the keep marker
- [x] CHK-012 [P1] No comment carries a packet, phase or task id
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] The orphan test fails when the orphan logic is reverted
- [x] CHK-022 [P1] An empty `intent_signals` hub reports no orphans
- [x] CHK-023 [P1] A keep-marked signal survives `--write`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] `--write` touches only the target hub's `graph-metadata.json`
- [x] CHK-031 [P1] No credential is read or written
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P2] The sk-create-skill changelog records both changes
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] Fixture hubs live under the tests folder, not under `.skilled/skills/`. Evidence: each test builds its fixture hubs in the OS temp dir and removes them, so none lands under `.skilled/skills/`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 6 | 6/6 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-03
<!-- /ANCHOR:summary -->

---
