---
title: "Tasks: Deprecate the deep-skill-benchmark lane"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Deprecate the deep-skill-benchmark lane

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Build the per-file reference map of every tracked path naming the lane, bucketed by owner
- [x] T002 Install worktree dependencies and build the validation orchestrator (`.opencode/skills/system-spec-kit/runtime`)
- [x] T003 [P] Capture the hub gate baseline (`parent-skill-check.cjs .opencode/skills/system-deep-loop`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Delete the command front doors in all five runtime trees and the three workflow assets
- [x] T005 Delete the lane trees under `deep-improvement/` and the three `runtime/lib/skill-benchmark-*` libraries with their unit tests
- [x] T006 Remove the mode from the hub registry, router, graph metadata, command metadata, description and routing allowlist
- [x] T007 Remove the lane branch from `scripts/shared/loop-host.cjs` and the ledger adapter from `runtime/scripts/append-mode-event.cjs`
- [x] T008 [P] Regenerate `leaf-manifest.json` and the advisor command-bridge projection from their own generators
- [x] T009 [P] Sweep `system-deep-loop` documentation, the four runtime agent definitions, the root README and the command inventory
- [x] T010 Update the runtime test that asserted the improvement lane count (`tests/unit/host-driven-improvement.vitest.ts`)
- [x] T010b Drop the mode from `runtime/lib/per-mode-authority-flip/types.ts`, whose frozen authority order a live write-path test enforces against the adapter switch
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Re-run the hub gate and compare against the Phase 1 baseline
- [x] T012 Rescan the repository for residue and confirm the preserved surfaces are untouched
- [x] T013 Run the deep-loop runtime unit suite and triage every failure as mine or pre-existing
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
<!-- /ANCHOR:cross-refs -->

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

Before the first deletion, all four must hold:

- [x] The per-file reference map exists and separates lane source from other owners' artifacts.
- [x] A baseline run of the authoritative hub gate is captured, including any failure that predates the work.
- [x] The rollback sentence names a real commit.
- [x] The validation orchestrator is built, so a later `RESULT: PASSED` means something.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Delete command surfaces before registry sources, registry sources before generated artifacts. A generated artifact regenerated before its source is edited records the old state. |
| TASK-SCOPE | Only the lane's own surfaces, plus any file the deletion would otherwise leave with a broken import. A file that merely names the lane without breaking is adjacent and gets reported, not edited. |
| TASK-GEN | Never hand-edit `leaf-manifest.json` or the advisor command-bridge projection. Edit their sources, then run their generators. |
| TASK-EVIDENCE | Preserved surfaces are counted before and after, not assumed. |

### Status Reporting Format

Each task reports: the command run, the observed output marker, and the exit status. A removal task additionally reports the count of files it touched, so a scope error shows up as a number rather than as prose.

### Blocked Task Protocol

A task is BLOCKED when completing it would edit a surface outside the frozen scope. The response is to stop that task, record the blocking surface with `file:line`, finish every unblocked task, and hand the decision to the operator. This fired once: retiring the `sk-doc` scripts that consumed the deleted lane as a library would mean editing a second parent hub, so those scripts are reported rather than changed.

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
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Edited JSON parses, edited JS passes `node --check`, edited Python passes `py_compile`
- [x] CHK-011 [P0] `loop-host.cjs` smoke test emits no unexpected warning for either surviving lane
- [x] CHK-012 [P1] Unknown-mode fallback preserved in both edited dispatchers
- [x] CHK-013 [P1] Generated artifacts regenerated rather than hand-edited
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (`acceptance-criteria.md`, 7 rows, all `Met`)
- [x] CHK-021 [P0] Manual testing complete (hub gate, generator runs, dispatcher smoke test)
- [x] CHK-022 [P1] Edge cases tested (unknown mode falls back; deleted-module import scan clean)
- [x] CHK-023 [P1] Error scenarios validated (validation orchestrator staleness caught and fixed before relying on it)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: `cross-consumer`. The lane spanned commands, registries, generated projections, shared dispatchers and documentation.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed: all 1254 tracked matching paths bucketed by owner before any deletion.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for the deleted libraries, the registry entry and the loop-host export.
- [x] CHK-FIX-004 [P0] Not applicable: no security, path, parser or redaction behavior is touched.
- [x] CHK-FIX-005 [P1] Matrix axes listed in `plan.md`: 5 runtime trees, 8 hub surfaces, 4 generated artifacts, 2 shared code files.
- [x] CHK-FIX-006 [P1] Not applicable: no process-wide state is read by the changed code.
- [x] CHK-FIX-007 [P1] Evidence pinned to base commit `a1faf0914a` and the worktree's uncommitted diff.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets introduced; removal only
- [x] CHK-031 [P0] Not applicable: no input-validation surface changed
- [x] CHK-032 [P1] Not applicable: no auth or authz surface touched
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate; no ephemeral artifact labels introduced
- [x] CHK-042 [P2] Root README and command inventory updated
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files kept in the session scratchpad, outside the repository
- [x] CHK-051 [P1] npm install residue reverted; packet `scratch/` holds only its scaffolded placeholder
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 14 | 14/14 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-11
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions documented in `plan.md` L3 ADR section (ADR-001, ADR-002)
- [x] CHK-101 [P1] Both ADRs carry status `Accepted`
- [x] CHK-102 [P1] Alternatives documented with rejection rationale
- [x] CHK-103 [P2] Migration path documented: the rollback sentence in `plan.md` section 7
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] NFR-P01 met by construction: one fewer mode to resolve, no added work
- [x] CHK-111 [P1] Not applicable: no throughput surface
- [x] CHK-112 [P2] Not applicable: no load path
- [x] CHK-113 [P2] Not applicable: no performance claim is made
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] CHK-120 [P0] Rollback procedure documented in `plan.md`; base commit recorded
- [x] CHK-121 [P0] Not applicable: structural removal, no feature flag
- [x] CHK-122 [P1] Not applicable: no deployed service
- [x] CHK-123 [P1] Not applicable: no runbook surface
- [x] CHK-124 [P2] Not applicable
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] No security-relevant surface changed
- [x] CHK-131 [P1] No dependency added to the repository; worktree installs are gitignored and their lockfile drift was reverted
- [x] CHK-132 [P2] Not applicable
- [x] CHK-133 [P2] Not applicable: no data handling changed
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] All spec documents synchronized
- [x] CHK-141 [P1] Not applicable: no API documentation surface
- [x] CHK-142 [P2] Root README updated
- [x] CHK-143 [P2] Residue and open decisions recorded in `spec.md` section 12
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Technical Lead | [ ] Approved | |
| Operator | Product Owner | [ ] Approved | |
| Operator | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
