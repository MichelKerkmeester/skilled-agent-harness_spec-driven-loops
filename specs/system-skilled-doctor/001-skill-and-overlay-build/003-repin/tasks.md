---
title: "Tasks: Phase 3: repin"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "repin tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 3: repin

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

- [x] T001 Read Barter's frozen runbook and the design rows, then fix the engine's command-line contract. Verify: the contract is in `plan.md` §3 and both workers built to it.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Write the repin tests against a temporary upstream repository (`D/scripts/tests/overlay-engine-repin.test.cjs`). Verify: on phase 002's engine 13 tests ran and 13 failed.
- [x] T003 Add `repin` to `E`: one touched-path set, the drift scan, the backup, the copy and two applies (REQ-006, REQ-007). Verify: the backup and drift tests pass.
- [x] T004 Add `--rollback <run>` (REQ-006, NFR-R01). Verify: the rollback test restores the tree byte for byte and `status` passes.
- [x] T005 Add `--stage <dir>` (REQ-010). Verify: the stage test lists both groups and the live tree digest is unchanged.
- [x] T006 Read pinned upstream bytes after a moved pin as `overlay-edited` (ADR-001). Verify: the classifier test passes and the earlier moved-pin tests still pass.
- [x] T007 Add the `.env` refusal test (ADR-003). Verify: it fails when the refusal is removed from a copy of the engine, and passes on the engine.
- [x] T008 Add the `repin` route: `D/assets/doctor-overlay-repin.yaml`, `D/overlay.md`, `D/_routes.yaml` and the presentation. Verify: `route-validate.sh` prints `31 routes validated`.
- [x] T009 Extend the command's contract test, the scoring list, the listing surfaces and the mirrors. Verify: `derive-command-bridges.cjs --check` prints `"changed": []`.
- [x] T010 Add the re-pin steps to `K/references/overlays.md` and write the re-pin changelog entry, since folded into `K/changelog/v1.0.0.0.md`. Verify: `check_changelog_shape.py` prints `pass=1 fail=0`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run the engine tests. Verify: `node --test D/scripts/tests/overlay-engine-*.test.cjs` prints `fail 0`.
- [x] T012 Run the whole doctor gate. Verify: `node --test D/scripts/tests/*.test.cjs` prints `fail 0` with no skipped test.
- [x] T013 Stage a re-pin of the copy of Barter's tree to `c06b7cfc14`. Verify: it refuses before any write and names 19 unowned paths, and the copy's digest is unchanged.
- [x] T014 Check routing. Verify: `doctor-phrase-reach.cjs` prints `STATUS=OK`, and "re-pin my vendored Skilled" ranks `system-skilled-doctor` first with the repin bridge next.
- [x] T015 Check the skill and the mirrors. Verify: `validate_skill_package.py K --strict` prints `PASS` and `sync-skills-hermes.cjs --check` prints `PASS`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the Barter stage run, T013
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
- [x] CHK-003 [P1] Dependencies identified and available. Phase 002's engine and lock, and `git`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks. `node --check` passes on the engine and every test file.
- [x] CHK-011 [P0] No console errors or warnings. The doctor suite printed `fail 0`.
- [x] CHK-012 [P1] Error handling implemented. Every refusal before a write exits 2, and every failure after the backup prints the rollback line.
- [x] CHK-013 [P1] Code follows project patterns. Standard library only, the doctor command shape, and the strict `sk-code-skilled` alignment check reports 0 findings.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. See `acceptance-criteria.md`.
- [x] CHK-021 [P0] Manual testing complete. The Barter stage run, T013.
- [x] CHK-022 [P1] Edge cases tested. A repin to the pinned commit, a missing commit, a held lock, a real folder under `repin.exclude`, and a non-empty stage folder.
- [x] CHK-023 [P1] Error scenarios validated. A failure after the backup is rolled back, and a tampered backup file refuses the rollback.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class. The classifier change is `class-of-bug`, and the repin requirements are new behavior.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. The drift scan, the backup and the copy all read the one touched-path set.
- [x] CHK-FIX-003 [P0] Consumer inventory completed. `classifyDestination` feeds `status`, `apply` and the repin stage report, and all three suites pass.
- [x] CHK-FIX-004 [P0] Adversarial tests. A stage folder inside the live tree, a tampered backup and an upstream `.env` path are each refused.
- [x] CHK-FIX-005 [P1] Matrix axes listed. The three copy kinds by live and stage runs, in `plan.md`'s affected surfaces.
- [x] CHK-FIX-006 [P1] Hostile env variant. N/A: the engine reads no environment variable.
- [x] CHK-FIX-007 [P1] Evidence pinned to this phase's commit.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented. A missing commit and a stage folder inside the tree are refused, each by a test.
- [x] CHK-032 [P1] Auth/authz working correctly. N/A: no authentication surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate. The engine header and usage name `repin` and its exit codes.
- [x] CHK-042 [P2] README updated. The skill README row and FAQ name `repin` and its rollback.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. The stage trees and the red runs are in the session scratchpad, outside the repository.
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
- [x] CHK-103 [P2] Migration path documented. The changelog's upgrade note names the `repin.exclude` and regenerate entries a project adds.
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
- [x] CHK-123 [P1] Runbook created. The re-pin section of `references/overlays.md`.
- [x] CHK-124 [P2] Deployment runbook reviewed. N/A: no deployment.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] Security review completed. A re-pin never reads a `.env` file, and ADR-003 records why the backup copies token-named files.
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
| Operator | Plan approver | [x] Approved the build plan | 2026-11-06 |
<!-- /ANCHOR:sign-off -->
