---
title: "Verification Checklist: Investigation P1 Fixes for Execution-Router Policy and Shutdown Hooks"
description: "Canonical-anchor verification checklist for F6, F31, F52, F53, F58, F61, and F74."
trigger_phrases:
  - "arc 010 003 002 checklist"
  - "execution-router p1 checklist"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-system-spec-kit-mcp-sidecar-investigation/003-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/002-fix-investigation-p1s-for-execution-router-policy-and-shutdown-hooks"
    last_updated_at: "2026-05-23T06:22:00Z"
    last_updated_by: "codex"
    recent_action: "completed-checklist-evidence"
    next_safe_action: "parent-agent-commit-handoff"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0100030020100030020100030020100030020100030020100030020100030020"
      session_id: "010-003-002-execution-router-p1"
      parent_session_id: null
    completion_pct: 100
---

# Verification Checklist: Investigation P1 Fixes for Execution-Router Policy and Shutdown Hooks

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

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

- [x] CHK-001 [P0] Requirements documented in `spec.md`.
- [x] CHK-002 [P0] Technical approach defined in `plan.md`.
- [x] CHK-003 [P1] Dependencies identified and available.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] TypeScript typecheck passes for `@spec-kit/mcp-server`; evidence: `npm run typecheck --workspace=@spec-kit/mcp-server` exit 0.
- [x] CHK-011 [P0] `resolveExecutionPolicy()` is pure and warning side effects are separated; evidence: `execution-router.ts:52-69`, `execution-router.vitest.ts:71-82`.
- [x] CHK-012 [P1] Test-only exports are isolated from the production router import path; evidence: `execution-router.testables.ts:14-21`, `execution-router.vitest.ts:63-69`, grep shows no production-module export.
- [x] CHK-013 [P1] No out-of-scope files are modified; evidence: changed-file list in `implementation-summary.md`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] F52 fixture proves explicit/config dimensions path; evidence: `execution-router.vitest.ts:84-100`.
- [x] CHK-021 [P0] F61 fixture proves mismatched default fallback warning; evidence: `execution-router.vitest.ts:102-116`.
- [x] CHK-022 [P0] F53/F58 fixture proves shared signal hook registration; evidence: `execution-router.vitest.ts:118-128`.
- [x] CHK-023 [P1] Embedder vitest command exits 0; evidence: 4 files passed, 39 tests passed, exit 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] F6 status closed; evidence: production aggregate removed, seam created in `execution-router.testables.ts:14-21`, tests updated in `embedder-sidecar.vitest.ts:10-15`.
- [x] CHK-FIX-002 [P0] F31 status closed; evidence: pure resolver at `execution-router.ts:52-60`, logger at `execution-router.ts:62-69`, caller invocation at `execution-router.ts:71-74`.
- [x] CHK-FIX-003 [P0] F52 status closed; evidence: `resolveDimensions()` now uses explicit/config then default profile at `execution-router.ts:84-95`, test at `execution-router.vitest.ts:84-100`.
- [x] CHK-FIX-004 [P0] F53 status closed; evidence: async shutdown and signal handler await cleanup before re-signal at `execution-router.ts:112-118`, ADR-003.
- [x] CHK-FIX-005 [P0] F58 status closed; evidence: shared signal array and forEach registration at `execution-router.ts:31`, `execution-router.ts:115-120`.
- [x] CHK-FIX-006 [P0] F61 status closed; evidence: mismatch warning at `execution-router.ts:89-95`, fixture at `execution-router.vitest.ts:102-116`.
- [x] CHK-FIX-007 [P0] F74 status closed; evidence: direct adapter class has no `ready()` at `execution-router.ts:127-183`, fixture at `execution-router.vitest.ts:130-137`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No new process-wide environment mutation leaks across tests; evidence: `execution-router.vitest.ts:39-61`.
- [x] CHK-031 [P0] Shutdown hook changes do not add unsafe signal behavior; evidence: same shared async handler for SIGINT/SIGTERM/SIGHUP at `execution-router.ts:115-120`.
- [x] CHK-032 [P1] Fallback warning includes enough context for operators without exposing secrets; evidence: provider/model/dim-only warning at `execution-router.ts:91-93`.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, checklist, decision record, and implementation summary synchronized.
- [x] CHK-041 [P1] ADRs record test seam, fallback policy, and shutdown hook semantics.
- [x] CHK-042 [P2] Parent phase scope remains unchanged.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Modified files are limited to the approved source, test, and packet docs.
- [x] CHK-051 [P1] No generated scratch or temporary files remain in the packet.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Finding | Severity | Fingerprint | Status | Evidence |
|---------|----------|-------------|--------|----------|
| F6 | P1 | `dead-code:execution-router:test-harness-exports` | closed | execution-router.testables.ts:14-21 + execution-router.vitest.ts:63-69 |
| F31 | P1 | `refinement:execution-router:resolveexecutionpolicy-logging-side-effect` | closed | execution-router.ts:52-74 + execution-router.vitest.ts:71-82 |
| F52 | P1 | `over-engineering:execution-router:resolve-dimensions-dead-branch` | closed | execution-router.ts:84-95 + execution-router.vitest.ts:84-100 |
| F53 | P1 | `over-engineering:execution-router:shutdown-hooks-fire-and-forget` | closed | execution-router.ts:112-120 + ADR-003 |
| F58 | P1 | `simplification:execution-router:registershutdownhooks-repetitive-signal-handling` | closed | execution-router.ts:31,115-120 + execution-router.vitest.ts:118-128 |
| F61 | P1 | `refinement:execution-router:resolvedimensions-unconditional-fallback` | closed | execution-router.ts:89-95 + execution-router.vitest.ts:102-116 |
| F74 | P1 | `dead-code:execution-router:directprovideradapter-ready-zero-production-callers` | closed | execution-router.ts:127-183 + execution-router.vitest.ts:130-137 |

**Verification Date**: 2026-05-23
<!-- /ANCHOR:summary -->
