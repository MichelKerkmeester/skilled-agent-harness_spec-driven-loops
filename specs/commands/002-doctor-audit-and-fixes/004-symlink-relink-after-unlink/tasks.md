---
title: "Tasks: Phase 4: symlink-relink-after-unlink"
description: "Ordered tasks and the verification checklist for giving each symlink apply its own run folder."
trigger_phrases:
  - "symlink relink after unlink tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 4: symlink-relink-after-unlink

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

| Variable | Value |
|----------|-------|
| `E` | `.skilled/commands/doctor/scripts/symlink-engine.cjs` |
| `T` | `.skilled/commands/doctor/scripts/tests/symlink-engine.test.cjs` |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the pre-change counts of the whole doctor gate and the two symlink suites (`scratch/baseline-before-change.md`). Verify: `bash .skilled/commands/doctor/scripts/tests/run-all.sh` prints `7 suite(s) passed, 0 failed`. Evidence: `scratch/baseline-before-change.md`.
- [x] T002 [P] Inventory every site that derives or parses a run folder name, plus the Barter-facing callers (`scratch/run-folder-consumers.md`). Verify: `rg -n "doctor-symlink|RUNS_PATH|runDir|digest.slice" .skilled/commands/doctor` prints the two engine `digest.slice(0, 16)` sites. Evidence: `scratch/run-folder-consumers.md`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the link, unlink and relink regression test to `T`, asserting the earlier `manifest.json` is unchanged. Verify: `node --test --test-name-pattern "relinking the same plan" T` against the unmodified `E` prints `fail 1` with `EEXIST`. Evidence: `scratch/red-before-change.md`.
- [x] T004 Make `createRunRecord()` in `E` claim `<prefix>`, then `<prefix>-2` and up, with an exclusive `mkdir`, capped at 1000. Verify: the relink test prints `pass 1`. Evidence: `scratch/verification-evidence.md`.
- [x] T005 Make `runUnlink()` in `E` accept the numbered names for the recorded digest through `runNamePattern()`. Verify: the relink test's second `unlink --yes` exits 0. Evidence: `scratch/verification-evidence.md`.
- [x] T006 Add the misnamed-folder edge test to `T`. Verify: `node --test --test-name-pattern "unlink refuses a run folder" T` prints `pass 1`. Evidence: `scratch/verification-evidence.md`.
- [x] T007 Update the three doc lines that state the run-folder name (`symlink.md`, `assets/doctor-symlink-link.yaml`, `_routes.yaml`). Verify: `rg -c "prefix>-2" .skilled/commands/doctor/symlink.md .skilled/commands/doctor/assets/doctor-symlink-link.yaml .skilled/commands/doctor/_routes.yaml` prints 1 for each. Evidence: `scratch/verification-evidence.md`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Rerun the engine and contract suites. Verify: `node --test T` prints `pass 12` and `fail 0`; `node --test .skilled/commands/doctor/scripts/tests/doctor-symlink-contract.test.cjs` prints `pass 34`. Evidence: `scratch/verification-evidence.md`.
- [x] T009 Rerun the whole doctor gate. Verify: `bash .skilled/commands/doctor/scripts/tests/run-all.sh` exits 0 and prints `0 failed`. Evidence: `scratch/verification-evidence.md`.
- [x] T010 Validate this folder and the parent strictly. Verify: `validate.sh <folder> --strict` prints `RESULT: PASSED` for both. Evidence: `implementation-summary.md` verification table.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] The relink test is red before and green after, recorded in `scratch/`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
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

A blocked P0 item keeps the packet open; a blocked P1 item needs the operator's recorded approval.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: `spec.md` section 4, REQ-001 to REQ-006.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: `plan.md` section 3 and the affected-surfaces table.
- [x] CHK-003 [P1] Dependencies identified and available: Node built-in `fs` only. Evidence: `plan.md` section 6.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The engine parses. Verify: `node -c E` exits 0. Evidence: `scratch/verification-evidence.md`.
- [x] CHK-011 [P0] No fixed-name derivation remains. Verify: `rg -n "slice\(0, 16\)" E` prints no line. Evidence: `scratch/verification-evidence.md`.
- [x] CHK-012 [P1] Errors stay typed: a non-`EEXIST` mkdir failure and an exhausted sequence both throw `PreconditionError`, which exits 2. Evidence: `E` `createRunRecord()`.
- [x] CHK-013 [P1] Code comments carry no packet, task or requirement ids. Verify: `rg -n "REQ-0|T00|004-symlink|specs/" E T` prints no line. Evidence: `scratch/verification-evidence.md`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: `acceptance-criteria.md`, eight rows `Met`.
- [x] CHK-021 [P0] The relink test is red before and green after. Evidence: `scratch/red-before-change.md`; `scratch/verification-evidence.md`.
- [x] CHK-022 [P1] Edge case: three misnamed run folders are refused with exit 2 and the target is unchanged. Evidence: `scratch/verification-evidence.md`.
- [x] CHK-023 [P1] Error scenario: the earlier run record stays byte-identical across the relink. Evidence: `T` relink test, `fs.readFileSync` comparison.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `cross-consumer`, because the producer and the unlink check both derived the same fixed name. Evidence: `plan.md` affected-surfaces table.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. Verify: `rg -n "digest.slice" .skilled/commands/doctor` prints the engine sites and the separate `agents-md-embed.cjs:925`. Evidence: `scratch/run-folder-consumers.md`.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for the run folder name across scripts, assets, docs and tests. Evidence: `scratch/run-folder-consumers.md`.
- [x] CHK-FIX-004 [P0] Path fixes include adversarial cases: `<prefix>-x` (delimiter), `<prefix>-0` (no-op suffix), `copied-run` (outside the sequence) are refused; the plain prefix and `<prefix>-2` are accepted. Joined-input and outside-root cases keep the existing parent check `path.dirname(realRunDir) !== runsRoot`. Evidence: `T` edge test and relink test.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Evidence: `plan.md` affected-surfaces inventories, six rows.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant: N/A, neither changed function reads an environment variable or process-wide state. Evidence: `E` `createRunRecord()` and `runUnlink()`.
- [x] CHK-FIX-007 [P1] Evidence is pinned to an explicit diff: the uncommitted working tree on `main` at the HEAD recorded in `scratch/verification-evidence.md`. Evidence: `scratch/verification-evidence.md`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Verify: `rg -n -i "secret|password" E` prints no line. Evidence: `scratch/verification-evidence.md`.
- [x] CHK-031 [P0] Input validation kept: `--run` must still be a real directory directly under the runs root of the recorded source, named for the recorded digest. Evidence: `E` `runUnlink()`; `T` edge test.
- [x] CHK-032 [P1] Auth/authz: N/A, the engine authenticates nothing. Evidence: `spec.md` NFR security.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks name the same five files. Evidence: `spec.md` files table; `plan.md` affected surfaces; tasks T004 to T007.
- [x] CHK-041 [P1] The `createRunRecord()` comment states why a repeated digest is normal and why earlier records are kept. Evidence: `E` doc block above `createRunRecord()`.
- [x] CHK-042 [P2] The three doc lines state the numbered fallback. Evidence: T007.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Fixtures live under `os.tmpdir()` only, through the suite's `makeTempRoot()`. Evidence: `T` section 1.
- [x] CHK-051 [P1] The suite removes its temporary roots in `test.after()`, and `scratch/` holds only evidence notes. Evidence: `T` section 1; `ls scratch`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-01
<!-- /ANCHOR:summary -->

---
