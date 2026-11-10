---
title: "Tasks: Phase 18: host-trigger-index-and-repin-generated"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "host trigger index and repin generated tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 18: host-trigger-index-and-repin-generated

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

`RT` is `.skilled/skills/system-spec-kit/runtime/cli/retrieval`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record baselines (`implementation-summary.md`). Verify: every suite named in `plan.md` has a before count there.
- [x] T002 Reproduce the findings (`spec.md` Measured Behavior). Verify: the probes print the defect.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Host helper (`RT/lib/host-index.mjs`). Verify: five detection tests pass.
- [x] T004 Lookup default (`RT/lookup-trigger-index.mjs`). Verify: host test finds the host packet; own repo prints `candidates : 20`.
- [x] T005 Generator defaults (`RT/generate-trigger-index.mjs`). Verify: bare generation writes `.speckit-index/` and packaged hashes are unchanged.
- [x] T006 Docs (`runtime/data/README.md`, `references/structure/folder-structure.md`). Verify: read against the code.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Rerun every baseline suite. Verify: no baseline-passing test fails; counts in `implementation-summary.md`.
- [x] T008 Cross-family review of the phase diff. Verify: verdict and adjudication in `decision-record.md`.
- [x] T009 Strict validation of this folder. Verify: `validate.sh <this folder> --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: Barter read-only lookup and a staged re-pin on a scratch host copy, both recorded in the acceptance criteria
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decisions**: See `decision-record.md`
- **Findings**: `../research/research.md`, rows Barter handover items 1 and 2
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

- [x] CHK-FIX-001 [P0] Classes: Item 1 class-of-bug (a default resolved from the script location instead of the caller); item 2 a consequence of item 1.
- [x] CHK-FIX-002 [P0] Same-class producer inventory done (see `plan.md` inventories).
- [x] CHK-FIX-003 [P0] Consumer inventory done for every changed helper, field and doc.
- [x] CHK-FIX-004 [P0] Adversarial cases tested: Skilled checkout with no `.speckit-index/`, host with and without an index, cwd outside git, explicit flags.
- [x] CHK-FIX-005 [P1] Matrix axes listed in `implementation-summary.md`.
- [x] CHK-FIX-006 [P1] Hostile variant: A bare generation in a host never writes the packaged files.
- [x] CHK-FIX-007 [P1] Evidence pinned to this phase's commit.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] The lookup reads only inside the caller's repository unless `--index` names a file
- [x] CHK-032 [P1] N/A: no auth surface in this phase
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Changed code comments state the rule the code applies
- [x] CHK-042 [P2] Host index docs show the bare commands
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Probe scripts and logs live in the session scratchpad, not the worktree
- [x] CHK-051 [P1] scratch/ holds only its `.gitkeep`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 14 | 14/14 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-09
<!-- /ANCHOR:summary -->

---
