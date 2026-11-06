---
title: "Tasks: Phase 4: guard-hook"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "guard hook tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 4: guard-hook

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

`H` is `.skilled/hooks/overlay-guard`, `G` is `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors`, `K` is `.skilled/skills/system-skilled-doctor`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the engine's `--guard` contract and the `mcp-route-guard` hook as the model. Verify: the adapters follow its folder shape, `H/{lib,claude,codex,cursor,devin,pi}`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Write the hook tests (`H/lib/overlay-guard.test.cjs`). Verify: before the core existed 17 tests ran and 17 failed.
- [x] T003 Write the core (`H/lib/overlay-guard.cjs`): allow at once with no overlay folder, ask the engine otherwise (REQ-015). Verify: the no-manifest test passes without loading the engine.
- [x] T004 Refuse an owned path with the engine's message, and never apply (REQ-013). Verify: the owned-path test leaves the tree byte-identical, and fails against a copy of the core that applies.
- [x] T005 Write the five adapters (`H/{claude,codex,cursor,devin,pi}`). Verify: each adapter's payload test maps to the right path.
- [x] T006 Register one `overlay-guard` entry in `G/hook-registry.json` with no fallback chain for Cursor (ADR-001). Verify: the registered Cursor command exits 2 on an owned path.
- [x] T007 Regenerate the registrations and the mirrors, and update the pinned binding count. Verify: `sync-hook-registrations.cjs --check` prints `PASS: 4 registration files match the 33-hook registry`.
- [x] T008 List the hook in `.skilled/hooks/README.md`, `hook-flags.env.example` and the doctor's fallback health checks. Verify: `rg -c "overlay-guard" .skilled/hooks/README.md` prints 10.
- [x] T009 Add the guard to `K/references/overlays.md` and write the guard changelog entry, since folded into `K/changelog/v1.0.0.0.md`. Verify: `check_changelog_shape.py` prints `pass=1 fail=0`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run the hook tests. Verify: `node --test H/lib/overlay-guard.test.cjs` prints `pass 18` and `fail 0`.
- [x] T011 Run the doctor gate. Verify: `node --test .skilled/commands/doctor/scripts/tests/*.test.cjs` prints `fail 0`.
- [x] T012 Run the REQ-013 search. Verify: `rg -n "post-edit|--apply|apply --capture" H` prints nothing.
- [x] T013 Check the registrations and the mirrors. Verify: `sync-runtime-mirrors.cjs --check` prints `PASS: 219 mirrors`, and the Hermes check prints `PASS`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the registered-command tests, T006
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
- [x] CHK-003 [P1] Dependencies identified and available. The engine's `--guard` and the hook registry.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks. `node --check` passes on the engine and every test file.
- [x] CHK-011 [P0] No console errors or warnings. The hook tests and the doctor suite printed `fail 0`.
- [x] CHK-012 [P1] Error handling implemented. An engine error or timeout allows the edit with one stderr line (ADR-002).
- [x] CHK-013 [P1] Code follows project patterns. The `mcp-route-guard` shape and the shared flag resolver.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. See `acceptance-criteria.md`.
- [x] CHK-021 [P0] Manual testing complete. The registered commands run in the tests, T006.
- [x] CHK-022 [P1] Edge cases tested. No manifest, an unowned path in a tree with a manifest, and an `apply_patch` with several file headers.
- [x] CHK-023 [P1] Error scenarios validated. An engine error allows the edit.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class. The Cursor fallback is `cross-consumer`, and the guard is new behavior.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. Every adapter calls the one core.
- [x] CHK-FIX-003 [P0] Consumer inventory completed. The registry feeds four registration files, the mirrors and the doctor's fallback health checks.
- [x] CHK-FIX-004 [P0] Adversarial tests. A core that applies after refusing fails the byte-identical test.
- [x] CHK-FIX-005 [P1] Matrix axes listed. Five runtimes by owned, unowned and no-manifest paths.
- [x] CHK-FIX-006 [P1] Hostile env variant. The shared flag resolver's tests pass, 33 of 33.
- [x] CHK-FIX-007 [P1] Evidence pinned to this phase's commit.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented. Each path is resolved against the session directory before the engine is asked.
- [x] CHK-032 [P1] Auth/authz working correctly. N/A: no authentication surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate. The core and adapters carry module headers.
- [x] CHK-042 [P2] README updated. `H/README.md` and the hooks index.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. The red runs are in the session scratchpad, outside the repository.
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
- [x] CHK-103 [P2] Migration path documented. The changelog's upgrade note: nothing to do, and the flag that turns it off.
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

- [x] CHK-120 [P0] Rollback procedure documented in `plan.md` §7: revert this phase's commit and rerun the registration generator.
- [x] CHK-123 [P1] Runbook created. The guard section of `references/overlays.md`.
- [x] CHK-124 [P2] Deployment runbook reviewed. N/A: no deployment.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] Security review completed. The guard reads no file content and writes nothing.
- [x] CHK-131 [P1] Dependency licenses compatible. No dependency added.
- [x] CHK-132 [P2] OWASP Top 10 checklist completed. N/A.
- [x] CHK-133 [P2] Data handling compliant. N/A.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] All spec documents synchronized
- [x] CHK-141 [P1] API documentation complete. `H/README.md` lists each runtime's payload and answer.
- [x] CHK-142 [P2] User-facing documentation updated. The skill reference and changelog.
- [x] CHK-143 [P2] Knowledge transfer documented in `implementation-summary.md`.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Plan approver | [x] Approved the build plan | 2026-11-06 |
<!-- /ANCHOR:sign-off -->
