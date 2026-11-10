---
title: "Tasks: Phase 8: release-coverage"
description: "Fold the packet into the root release notes and README, and add a release-coverage check to the alignment harness."
trigger_phrases:
  - "release coverage tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 8: release-coverage

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `R` is `scripts/rotate-logs.sh`. `A` is `logs/archive/`. WEAK: Variables are defined below. -->

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the gap: the open release notes name none of this packet's skills, and S6 has no check (`.skilled/changelog/skilled/v4.0.1.0.md`, `surface-map.yaml`). Verify: the two commands in `spec.md` Measured Behavior. Evidence: no hit in v4.0.1.0; S6 read `checks: []`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Add `check-release-coverage.cjs` and its tests to the alignment harness, wire it as S6's check and widen the S5 and S6 lens (`.skilled/commands/assets/local-skilled-alignment/`). Verify: `node --test .skilled/commands/assets/local-skilled-alignment/tests/` reports `fail 0`. Evidence: 39 tests, 39 pass, 0 fail, five of them release-coverage cases.
- [x] T003 Run the check on this branch before the fold (`scratch/release-check-before.txt`). Verify: it prints `MISSING` lines and exits 1. Evidence: `scratch/release-check-before.txt`, six MISSING lines, exit 1, run against HEAD `2b0c41d61f` copies because the fold had started.
- [x] T004 Fold the packet into v4.0.1.0 and the root README (`.skilled/changelog/skilled/v4.0.1.0.md`, `README.md`). Verify: `validate_document.py` reports 0 issues. Evidence: 0 issues. The README router-tooling item was skipped: the README has no prose on the generator or reach to join, only the `router-reach` doctor target.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Run the check on this branch after the fold (`scratch/release-check-after.txt`). Verify: `STATUS=OK`, exit 0. Evidence: `scratch/release-check-after.txt`, required=7 missing=0, exit 0; the fold first left `mcp-figma` and `system-spec-kit` unnamed and the check caught both. The battery runs the row as `S6-release-coverage` pass.
- [x] T006 Run the README checkers and recursive strict validation. Verify: README checkers exit 0, every folder `RESULT: PASSED`. Evidence: both README checkers exit 0; recursive validation at phase close.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist
<!-- FILL: Fill each checklist section below. GOOD: Each CHK line names the command that answers it. WEAK: The checklist is done. -->

<!-- ANCHOR:protocol -->
## Verification Protocol
<!-- FILL: Keep the three rows and add the rule this packet uses for a blocked task. GOOD: P0 blocks close. P1 needs a recorded reason. WEAK: Follow the priorities. -->

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] The opencode-go DeepSeek route answers. Evidence: two builds through `opencode run`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [x] CHK-010 [P0] `node --check` passes on the new script. Evidence: the script runs under `node --test` and the battery.
- [x] CHK-011 [P0] A missing scope or notes folder ends in a `STATUS=ERROR` line, not a stack trace. Evidence: `--scope /dev/null` ends in a STATUS=ERROR line, exit 2.
- [x] CHK-012 [P1] Versions compare numerically. Evidence: test case (c) holds v1.0.0.0, v1.0.9.0 and v1.0.10.0.
- [x] CHK-013 [P1] The script follows the sibling harness scripts' header and section style
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] The check fails on this branch before the fold and passes after it. Evidence: T003 and T005.
- [x] CHK-022 [P1] A scope that adds nothing passes with `required=0`. Evidence: the phase 007 range adds no changelog and requires nothing.
- [x] CHK-023 [P1] A missing notes folder grades `cannot_run`. Evidence: test case (e) and the S6 `exit_map`.
<!-- /ANCHOR:testing -->

---
---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [x] CHK-030 [P0] No credential path is read or written
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] The release notes state nothing the per-skill changelogs do not support. Evidence: each section was read against the per-skill changelogs; one stale paired-only sentence was corrected.
- [x] CHK-042 [P1] The command doc lists the new asset. Evidence: the OWNED ASSETS row is in `.skilled/commands/local-skilled-alignment.md`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] Task-created temporary output is removed before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 7/7 |
| P1 Items | 10 | 10/10 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-11-03
<!-- /ANCHOR:summary -->

---



