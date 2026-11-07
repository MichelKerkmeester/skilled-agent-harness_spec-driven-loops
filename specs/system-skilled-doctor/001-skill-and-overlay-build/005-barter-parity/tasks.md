---
title: "Tasks: Phase 5: barter-parity"
description: "Measure Barter and the test baseline, make the five engine changes, the doc and routing changes and Barter's adoption, then rerun every gate from the final state."
trigger_phrases:
  - "barter parity tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 5: barter-parity

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

`E` is `.skilled/commands/doctor/scripts/overlay-engine.cjs`. `B` is `/Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit/skilled`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Measure the upstream engine on Barter. Verify: `node E status --root B` printed `no overlay manifest at skilled-overlays/overlay-manifest.json`, exit 2.
- [x] T002 Measure Barter's fork. Verify: `replay.cjs --check` printed `checked=132 ok=132 miss=0` and `RESULT: PASSED`; `sync.cjs --status` printed `in-sync=468`.
- [x] T003 Baseline the doctor suite. Verify: `node --test .skilled/commands/doctor/scripts/tests/*.test.cjs` printed `tests 1065`, `pass 1059`, `fail 6`, all six in `agents-md-check.test.cjs` and `agents-md-manifest.test.cjs`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Block a protected path per entry (E `assertSafeToPlan`, `refusedPlan`, `analyze`). Verify: `node --test .skilled/commands/doctor/scripts/tests/overlay-engine-fixes.test.cjs` passes.
- [x] T005 Refuse a re-pin over a refused overlay before the backup (E `repinUnderLock`). Verify: the re-pin test "a re-pin over a refused overlay stops before the backup" passes.
- [x] T006 [P] Add `.dsh` to `DEFAULT_RUNTIME_FOLDERS` (E). Verify: the re-pin test "copies .dsh" prints `copy 10 paths, delete 2 paths`.
- [x] T007 [P] List not-copied upstream changes (E `notCopiedChanges`, `reportNotCopied`). Verify: the re-pin test's `report.notCopied` equals `['.claude/new.md', 'AGENTS.md', 'repo-rules/new-rule.md']`.
- [x] T008 [P] Print the stage-skip line (E `repinWrites`). Verify: the stage test matches `stage skipped 1 regenerate and 1 verify step(s)`.
- [x] T009 [P] Name the missing setting file (E `createContext`, `loadManifest`). Verify: `overlay-engine-sync.test.cjs` passes both variants.
- [x] T010 Update the workflow and presentation assets (`doctor-overlay-repin.yaml`, `doctor-overlay-presentation.txt`, `doctor-install-presentation.txt`). Verify: `rg -n 'not-copied|stage skipped|protected path' .skilled/commands/doctor/assets` lists the new rows.
- [x] T011 Add three adoption phrases and regenerate the bridges (`_routes.yaml`, `derive-command-bridges.cjs`, advisor `npm run build`). Verify: `doctor-phrase-reach.cjs` prints `STATUS=OK phrases=228 bridges=35`.
- [x] T012 Document adoption (`references/overlays.md` §4 to §6, `README.md` §5). Verify: `rg -n 'ADOPTING THE ENGINE' .skilled/skills/system-skilled-doctor/references/overlays.md` prints one line.
- [x] T013 Adopt the engine in Barter (B `.skilled-overlays.json`, `barter-overlays/overlay-manifest.json`). Verify: `node E status --root B` prints `checked=132 ok=132 miss=0` and `RESULT: PASSED`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Mutation pass over the new tests. Verify: dropping `.dsh`, the not-copied list or the re-pin refusal each failed 1 test, restoring the abort failed 2; the engine was restored byte-identical.
- [x] T015 Rerun the doctor suite from the final state. Verify: `tests 1068`, `pass 1062`, `fail 6`, the same six agents-md tests as the base.
- [x] T016 Run the advisor's vitest suite. Verify: `160 passed (160)` files, `1373 passed | 8 skipped`.
- [x] T017 Rerun the three Barter checks and stage a re-pin of Barter onto this branch's commit. Verify: upstream `status` `RESULT: PASSED`, fork checks green, `repin --to c29f26ded8 --stage` exit 0, `checked=132 ok=132 miss=0`, `RESULT: STAGED`, no blocked overlay, live tree unchanged.
- [x] T018 Validate the packet. Verify: `validate.sh <this folder> --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the upstream `status` passes on Barter's real tree
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: See `research/research.md`
- **Overnight decisions and questions**: See `scratch/morning-decisions.md`
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

A blocked item is marked `[B]` with the reason and the command that showed it.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: REQ-001 to REQ-009 in §4.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: §3 Data Flow.
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: the worktree was provisioned, `10 installed, 4 built, 0 failed`.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check` passes on the engine and the three test files. Evidence: `syntax ok (engine + 3 tests)`.
- [x] CHK-011 [P0] No new failure in the doctor suite. Evidence: the same six agents-md failures as the base, 1,062 of 1,068 passing.
- [x] CHK-012 [P1] Error handling implemented. Evidence: a path escape still throws, a protected path blocks its entry with the fix named.
- [x] CHK-013 [P1] Code follows project patterns. Evidence: the refused plan reuses `planOverlay`'s shape and the existing blocked path.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: `acceptance-criteria.md`, every row Met.
- [x] CHK-021 [P0] Manual testing complete. Evidence: the upstream `status` passed on Barter's real tree.
- [x] CHK-022 [P1] Edge cases tested. Evidence: a top-level link skipped, an excluded path listed, a `.env` exact entry blocked.
- [x] CHK-023 [P1] Error scenarios validated. Evidence: missing manifest with and without the setting, re-pin over a refused overlay.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: P1 `class-of-bug` (three throw sites), P2 to P5 `instance-only`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed: `rg -n "refusing to inspect a protected path" E` showed the three sites in `assertSafeToPlan` and `analyze`, all converted.
- [x] CHK-FIX-003 [P0] Consumer inventory completed: `commandGuard` does not call `analyze`; the guard hook's lib matches only `refuse:` on exit 1; the presentation and tests were updated.
- [x] CHK-FIX-004 [P0] Path fixes include adversarial cases: walked token file in two scopes, unlisted beside listed, exact `.env` entry, top-level link, excluded path.
- [x] CHK-FIX-005 [P1] Matrix axes: entry scope (directory, skill-root, file) by protected kind (token, `.env`) by command (status, apply, repin), with the rows the tests cover named in CHK-FIX-004.
- [x] CHK-FIX-006 [P1] Hostile env or global-state variant: N/A, the change reads no process-wide state.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the fix commit `c29f26ded8`.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: the change adds no credential and reads no `.env` file.
- [x] CHK-031 [P0] Input validation implemented. Evidence: a refused entry's plan has no outputs, so no protected byte is read or written.
- [x] CHK-032 [P1] Auth/authz: N/A, the engine has no authentication surface.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. Evidence: the same files, requirements and gates across the three.
- [x] CHK-041 [P1] Code comments adequate. Evidence: each new function states its WHY, with no packet ids.
- [x] CHK-042 [P2] README updated. Evidence: root `README.md` §5.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Evidence: staging copies and backups live in the session scratchpad, outside the repository.
- [x] CHK-051 [P1] scratch/ cleaned before completion; `morning-decisions.md` stays as the operator's record.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 14/14 |
| P1 Items | 14 | 14/14 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-07
<!-- /ANCHOR:summary -->

---
