---
title: "Verification Checklist: Compiled-Route Sync Authored-Root Repair"
description: "Architecture and runtime evidence checklist for safe promoted-closure synchronization."
trigger_phrases:
  - "compiled route sync checklist"
  - "atomic closure verification"
importance_tier: "critical"
contextType: "implementation"
status: "complete"
completion_pct: 100
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/015-router-unification-program/019-routing-coverage-activation-verification/017-fix-post-019-alignment-p1-finding-for-compiled-route-sync-authored-root"
    last_updated_at: "2026-07-26T07:59:02Z"
    last_updated_by: "opencode"
    recent_action: "Completed all live, cleanup, documentation, and strict-validation checks."
    next_safe_action: "No packet-local work remains."
    blockers: []
    key_files: []
---
# Verification Checklist: Compiled-Route Sync Authored-Root Repair

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3-arch | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete or receive explicit deferral |
| **[P2]** | Optional | May defer with documented reason |
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements and current source topology are documented.
  - **Evidence**: `spec.md` identifies current phases `003`, `004`, `005`, `008`, `009`, `013`, and `014`.
- [x] CHK-002 [P0] Technical approach and rollback are documented.
  - **Evidence**: `plan.md` and `decision-record.md` define verified staging, atomic publication, and local rollback.
- [x] CHK-003 [P1] Runtime consumers of old internal paths are inventoried.
  - **Evidence**: Exact-text search under `.opencode/bin` identified the sync, status, route, manifest, and test consumers.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Source-root constants target the current authored tree.
  - **Evidence**: Read-only `--check` reports 55 authored closure files and all seven hubs resolve.
- [x] CHK-011 [P0] Runtime consumers select one coherent promoted internal layout.
  - **Evidence**: `compiled-route-layout.cjs`; foundation suite 25/25 including partial-layout fail-closed coverage.
- [x] CHK-012 [P0] Publication code cannot expose a partial closure.
  - **Evidence**: Staging, post-publish, and persistent rename-failure fixtures restore or preserve verified candidates; publication suite 35/35.
- [x] CHK-013 [P1] Generated manifest records the current source and copied paths.
  - **Evidence**: Isolated publication test asserts `generatedFrom`, current resolver path, and absence of legacy resolver path.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Read-only check resolves all seven hubs.
  - **Evidence**: `node .opencode/bin/compiled-route-sync.cjs --check` exits 0.
- [x] CHK-021 [P0] Staging verifies before publication.
  - **Evidence**: Foundation suite 25/25; isolated authored closure resolves all seven hubs with zero spec-tree reads.
- [x] CHK-022 [P0] Existing manifest, status, route, and parity tests pass.
  - **Evidence**: Publication 35/35, foundation 25/25, flag propagation 9/9; broad bin gate 63/65 with only the captured WAL baseline failures.
- [x] CHK-023 [P0] Rollback failure paths are covered.
  - **Evidence**: Publication suite 35/35 covers arbitrary, symlinked, renamed, stale, divergent, cleanup-race, and rename-failure fixtures.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-024 [P0] The sealed authored-root finding cannot be reproduced.
  - **Evidence**: `node .opencode/bin/compiled-route-sync.cjs --check` exits 0 against the current authored root.
- [x] CHK-025 [P1] Every old internal path consumer is updated or intentionally retained as a negative fixture.
  - **Evidence**: Runtime consumers use `compiled-route-layout.cjs`; old paths remain only in negative assertions and legacy layout descriptors.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Canonical manifest and symlink checks remain green.
  - **Evidence**: Publication suite 35/35 includes unsafe identities, shared writer leasing, symlink rollback rejection, atomic mint, and atomic refresh.
- [x] CHK-031 [P0] Serving verification reports zero spec-tree reads.
  - **Evidence**: Final live `compiled-route-sync.cjs --verify` reports all seven hubs resolve and zero reads under `.opencode/specs`.
- [x] CHK-032 [P0] Frozen scorer hashes remain unchanged.
  - **Evidence**: `router-replay.cjs` `d5e13daf...`, `score-skill-benchmark.cjs` `d5a9cc72...`, `load-playbook-scenarios.cjs` `5029f22d...`.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] Spec, plan, tasks, decision, checklist, and summary agree.
  - **Evidence**: `spec.md`, `plan.md`, `tasks.md`, `decision-record.md`, `checklist.md`, and `implementation-summary.md` record the finalized live publication and pending backup disposition.
- [x] CHK-041 [P1] Generated metadata reflects current packet content.
  - **Evidence**: `validate.sh --strict` passes generated metadata integrity, drift, shape, path, and freshness checks.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temporary staging, rollback, failed-root, and publication-lock siblings are absent after finalization.
  - **Evidence**: `.opencode/bin/lib` contains only the serving root and normal libraries; the publication-bound rollback and sibling lease are absent. The hidden terminal state inside the serving root is the intentional durable finalize receipt.
- [x] CHK-051 [P1] Failed-upgrade packet backups are removed at closeout.
  - **Evidence**: Operator authorized deletion; `.backup-20260725-122701/` and its four markdown files are absent.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions are documented.
  - **Evidence**: `decision-record.md` accepts a stable root with current internals and verified atomic publication.
- [x] CHK-101 [P1] Alternatives include rejection rationale. [EVIDENCE: `decision-record.md` ADR-001 Alternatives Considered table]
  - **Evidence**: Recreating stale topology, rewriting copied imports, and treating the mirror as source are rejected explicitly.
- [x] CHK-102 [P0] Staged candidate is complete before publication.
  - **Evidence**: Foundation suite 25/25 verifies the isolated staged root resolves 7/7 hubs and reads zero spec-tree paths.
- [x] CHK-103 [P0] Exact prior closure remains recoverable through post-publish checks.
  - **Evidence**: Publication suite 35/35 covers retained rollback, content-complete closure fingerprints, cleanup retry, and exact restoration.
<!-- /ANCHOR:arch-verify -->

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] Routing remains a direct promoted-root load.
  - **Evidence**: `compiled-route.cjs` resolves one complete local runtime layout; no additional serving I/O introduced.
- [x] CHK-111 [P1] Sync checks complete locally without network access.
  - **Evidence**: Local gates pass at 35/35 publication, 25/25 foundation, and 32/32 no-spec runtime files.
- [x] CHK-112 [P2] Load testing is not required because routing algorithms and request volume behavior are unchanged.
<!-- /ANCHOR:perf-verify -->

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Operator approval is recorded before serving-root replacement.
  - **Evidence**: The operator explicitly authorized replacement and then issued `go` before the live build.
- [x] CHK-121 [P0] Rollback directory and procedure are verified.
  - **Evidence**: Publication suite 35/35 verifies exact restoration, terminal retry, and candidate retention on conflict or rename failure.
- [x] CHK-122 [P0] Post-publish status and parity checks pass before rollback cleanup.
  - **Evidence**: Before finalize, status reported 7/7 fresh compiled-serving hubs, live verify reported zero spec reads, and foundation plus flag suites passed 34/34.
- [x] CHK-123 [P1] Kill-switch behavior remains available.
  - **Evidence**: Flag-propagation suite passes 9/9; foundation kill-switch table passes.
<!-- /ANCHOR:deploy-ready -->

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P0] Strict packet validation exits 0.
  - **Evidence**: `validate.sh --strict` passes with 0 errors and 0 warnings on 2026-07-26.
- [x] CHK-131 [P1] Comment hygiene and no-spec-import guards pass.
  - **Evidence**: `check-no-spec-imports.cjs` passes 71/71 runtime files; all three sk-code drift guards pass.
<!-- /ANCHOR:compliance-verify -->

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] Implementation summary cites exact build and verification commands.
  - **Evidence**: Command and result evidence is recorded in `implementation-summary.md:68-85`.
- [x] CHK-141 [P1] Parent phase map records final status.
  - **Evidence**: Parent phase status is recorded at `../spec.md:48`.
<!-- /ANCHOR:docs-verify -->

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

- [x] CHK-150 [P0] Seven hubs are healthy, fresh, compiled-serving, and parity-clean.
  - **Evidence**: Final status reports valid fresh manifests and `compiled-serving` for all seven hubs; parity and kill-switch suites pass 34/34.
<!-- /ANCHOR:sign-off -->

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 22 | 22/22 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-26 (post-publication completion)
**Verified By**: OpenCode execution session
**ADRs**: 1 documented, 1 accepted
<!-- /ANCHOR:summary -->
