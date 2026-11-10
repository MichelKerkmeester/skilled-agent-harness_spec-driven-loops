---
title: "Tasks: Phase 21: host-root-marker-refresh"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "host root marker refresh tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 21: host-root-marker-refresh

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

`SP` is `.skilled/skills/system-spec-kit/runtime/cli/spec`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record baselines (`implementation-summary.md`). Verify: every suite named in `plan.md` has a before count there.
- [x] T002 Reproduce the defects (`spec.md` Measured Behavior). Verify: `--roots specs/bartender` from Barter's root resolves into `skilled/specs` and exits 2.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Host repository root, default roots and ignored folders (`SP/upgrade-legacy.mjs`). Verify: the host-root vitest file passes 3 of 3.
- [x] T004 Skipped-folder count on stderr (`SP/upgrade-legacy.mjs`). Verify: host-root case a asserts `skipped 1 spec folders`.
- [x] T005 Marker proof counts emitted anchors (`SP/heal-spec-docs.cjs`). Verify: three new refresh-markers unit cases pass.
- [x] T006 Two READMEs (`runtime/cli/retrieval/lib/README.md`, `SP/README.md`). Verify: read against the code.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Rerun every baseline suite. Verify: no baseline-passing test fails; counts in `implementation-summary.md`.
- [x] T008 Measure the Barter census on a scratch copy. Verify: dry-run totals recorded in `implementation-summary.md`.
- [x] T009 Cross-family review of the phase diff. Verify: verdict in `decision-record.md` ADR-003.
- [x] T010 Strict validation of this folder. Verify: `validate.sh <this folder> --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the Barter dry run over a scratch copy, recorded in the acceptance criteria
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decisions**: See `decision-record.md`
- **Findings**: the caveats in the Barter handover from phases 018 and 019
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

- [x] CHK-FIX-001 [P0] Classes: repository root taken from the file location instead of the caller; anchor proof reading a narrower set than the contract.
- [x] CHK-FIX-002 [P0] Same-class producer inventory done (see `plan.md` inventories).
- [x] CHK-FIX-003 [P0] Consumer inventory done for every changed helper and doc.
- [x] CHK-FIX-004 [P0] Adversarial cases tested: ignored mirror in a host, explicit host root, plain checkout, current document with a custom anchor, old document with a custom anchor.
- [x] CHK-FIX-005 [P1] Matrix axes listed in `implementation-summary.md`.
- [x] CHK-FIX-006 [P1] Hostile variant: a host whose git ignores every folder says so on stderr instead of reporting nothing.
- [x] CHK-FIX-007 [P1] Evidence pinned to this phase's commit.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] A host run reads only the host repository, and every root containment check still applies
- [x] CHK-032 [P1] N/A: no auth surface in this phase
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Changed code comments state the rule the code applies
- [x] CHK-042 [P2] Both READMEs name the new pieces
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
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-09
<!-- /ANCHOR:summary -->

---
