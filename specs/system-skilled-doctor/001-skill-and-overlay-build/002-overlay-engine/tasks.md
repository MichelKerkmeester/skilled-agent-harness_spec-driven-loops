---
title: "Tasks: Phase 2: overlay-engine"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "overlay engine tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 2: overlay-engine

<!-- SPECKIT_LEVEL: 3 -->

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

`D` is `.skilled/commands/doctor`, `E` is `D/scripts/overlay-engine.cjs`, `K` is `.skilled/skills/system-skilled-doctor`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Freeze the port source outside the repository (session scratchpad `port-source/`). Verify: `shasum -a 256 -c SHA256SUMS` prints `OK` for the five files listed in `plan.md` §1.
- [x] T002 Copy Barter's tree to a scratch folder for the parity run. Verify: the copy's file hashes are recorded before any run.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Merge Barter's two scripts into `E`, with the overlay folder read by `resolveOverlayDir` (REQ-009). Verify: `rg -n "overlayDir" E` prints one line, inside `resolveOverlayDir`.
- [x] T004 Port the 15 sync and 6 replay tests (`D/scripts/tests/overlay-engine-sync.test.cjs`, `overlay-engine-replay.test.cjs`). Verify: 21 of 21 pass on the straight port, before any fix.
- [x] T005 Write one failing test per fix (`D/scripts/tests/overlay-engine-fixes.test.cjs`). Verify: on the straight port 36 tests run, 26 pass and 10 fail, and every failure is a fix test.
- [x] T006 Plan the full check with the accepted hashes (REQ-003). Verify: the re-pinned overlay test passes, and no `upstream changed` line prints for it.
- [x] T007 Treat a retained path the overlay also replaces as an output (REQ-004). Verify: the retained-output test passes and the guard still allows the vendor's own files.
- [x] T008 Give the engine its own lock (REQ-005). Verify: the four lock tests pass, and a held lock prints its owner line and its path.
- [x] T009 Apply the operations of one json-entry set in order (REQ-011). Verify: the ordered-set test passes, a second apply prints `0 changed` and status exits 0.
- [x] T010 Pass token-named paths only by exact manifest path, with `protectedPaths` for walked entries (REQ-012, ADR-001). Verify: the token tests and the two `protectedPaths` tests pass.
- [x] T011 Add the command: `D/overlay.md`, `D/assets/doctor-overlay-{presentation.txt,status.yaml,apply.yaml}` and two routes in `D/_routes.yaml`. Verify: `route-validate.sh` prints `30 routes validated`.
- [x] T012 Add the command's contract test (`D/scripts/tests/doctor-overlay-contract.test.cjs`). Verify: 6 of 6 pass.
- [x] T013 Add `/doctor:overlay` to the listing surfaces, the scoring list and `command-contract.json`, then regenerate the bridges and the mirrors. Verify: `derive-command-bridges.cjs --check` prints `"changed": []`.
- [x] T014 Add the overlay reference, router intent, README row, changelog and playbook scenario to `K/`. Verify: `validate_skill_package.py K --strict` prints `PASS`.
- [x] T015 Point the `skill_owner` of the ten moved commands' workflow files at `K/`, finishing the tag move of phase 001. Verify: `rg -n "^skill_owner: .*system-spec-kit" D/assets` prints nothing.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Run the engine tests. Verify: `node --test D/scripts/tests/overlay-engine-*.test.cjs` prints `pass 40` and `fail 0`.
- [x] T017 Run the whole doctor gate. Verify: `node --test D/scripts/tests/*.test.cjs` prints `pass 1051` and `fail 0`, up from 1005 by the 40 engine tests and the 6 contract tests.
- [x] T018 Run `status` on the scratch copy of Barter's tree. Verify: exit 0, `in-sync=445`, `checked=118 ok=118`, and the copy's hashes are unchanged.
- [x] T019 Check routing. Verify: `doctor-phrase-reach.cjs` prints `STATUS=OK`, and "re-pin my vendored Skilled" ranks `system-skilled-doctor` first.
- [x] T020 Check the mirrors. Verify: `sync-skills-hermes.cjs --check` prints `PASS: 66 Hermes skill copies in sync`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the parity run, T018
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decisions**: See `decision-record.md`
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
- [x] CHK-003 [P1] Dependencies identified and available. The frozen source and its SHA-256 values are in `plan.md` §1.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks. `node --check` passes on the engine and every test file.
- [x] CHK-011 [P0] No console errors or warnings. The doctor suite printed `fail 0`.
- [x] CHK-012 [P1] Error handling implemented. Every refusal prints one `[overlay-engine]` line and exits 2.
- [x] CHK-013 [P1] Code follows project patterns. Standard library only, the doctor command shape, and the strict `sk-code-skilled` alignment check reports 0 findings.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. See `acceptance-criteria.md`.
- [x] CHK-021 [P0] Manual testing complete. The parity run, T018.
- [x] CHK-022 [P1] Edge cases tested. A held lock, a retained output, a token name met in a walk, and a `protectedPaths` value outside its entry.
- [x] CHK-023 [P1] Error scenarios validated. A failed regenerate step still removes the lock.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class. REQ-003 is `class-of-bug`, REQ-004 is `cross-consumer`, REQ-012 is `algorithmic`, and the rest are `instance-only`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. Every `planOverlay` call site in the engine passes the accepted hashes.
- [x] CHK-FIX-003 [P0] Consumer inventory completed. The planner, the guard's candidates and the capture lookup all read `keptRetainedPaths`.
- [x] CHK-FIX-004 [P0] Adversarial table tests. The `protectedPaths` test refuses an absolute value, an empty value, a `..` value and a `.env` name.
- [x] CHK-FIX-005 [P1] Matrix axes listed. Six scopes by the five states, in `plan.md`'s affected surfaces.
- [x] CHK-FIX-006 [P1] Hostile env variant. N/A: the engine reads no environment variable.
- [x] CHK-FIX-007 [P1] Evidence pinned to this phase's commit.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented. The setting file, the manifest paths and `protectedPaths` are refused when they leave the tree.
- [x] CHK-032 [P1] Auth/authz working correctly. N/A: no authentication surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate. The engine header lists every target and exit code.
- [x] CHK-042 [P2] README updated. The skill README has the `/doctor:overlay` row and links the overlay reference.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. The port source, the parity copy and the red runs are in the session scratchpad, outside the repository.
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 14/14 |
| P1 Items | 22 | 22/22 |
| P2 Items | 9 | 9/9 |

**Verification Date**: 2026-11-06
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions documented in `decision-record.md`
- [x] CHK-101 [P1] All ADRs have status
- [x] CHK-102 [P1] Alternatives documented with rejection rationale
- [x] CHK-103 [P2] Migration path documented. Barter keeps its own scripts until it moves to this engine.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] Response time targets met. N/A: the design sets none.
- [x] CHK-111 [P1] Throughput targets met. N/A.
- [x] CHK-112 [P2] Load testing completed. N/A.
- [x] CHK-113 [P2] Performance benchmarks documented. N/A.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] CHK-120 [P0] Rollback procedure documented in `plan.md` §7: revert this phase's commit.
- [x] CHK-123 [P1] Runbook created. The skill's `references/overlays.md`.
- [x] CHK-124 [P2] Deployment runbook reviewed. N/A: no deployment.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] Security review completed. The engine never reads a `.env` file, even one a manifest names.
- [x] CHK-131 [P1] Dependency licenses compatible. No dependency added.
- [x] CHK-132 [P2] OWASP Top 10 checklist completed. N/A.
- [x] CHK-133 [P2] Data handling compliant. N/A.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] All spec documents synchronized
- [x] CHK-141 [P1] API documentation complete. The engine header and the command router.
- [x] CHK-142 [P2] User-facing documentation updated. The skill README, reference and changelog.
- [x] CHK-143 [P2] Knowledge transfer documented in `implementation-summary.md`.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Plan approver | [x] Approved the build plan and the `protectedPaths` answer | 2026-11-06 |
<!-- /ANCHOR:sign-off -->
