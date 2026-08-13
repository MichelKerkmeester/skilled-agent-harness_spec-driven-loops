---
title: "Verification Checklist: Phase 006 Runtime Adapters and Clients"
description: "Observed implementation and release evidence for the Phase 006 runtime adapter and client boundary."
trigger_phrases:
  - "runtime-adapters-and-clients"
  - "verification checklist"
  - "quality gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/006-runtime-adapters-and-clients"
    last_updated_at: "2026-08-12T09:10:00Z"
    last_updated_by: "claude"
    recent_action: "Verified Phase 006 and reconciled the Phase 007 handoff."
    next_safe_action: "Approve the Phase 007 evaluation architecture, then execute its T001."
    blockers: []
    key_files:
      - "checklist.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-006-implementation-20260812"
      parent_session_id: "phase-006-scaffold-20260811"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and handoff are defined."
      - "The architecture is accepted and the predecessor baseline passes."
      - "The focused and full package gates pass from the implemented state."
---
# Verification Checklist: Phase 006 Runtime Adapters and Clients

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **P0** | Hard blocker | Cannot close Phase 006 until complete |
| **P1** | Required | Complete or obtain an explicit user-approved deferral |
| **P2** | Optional | May defer with a documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements are documented. [evidence: `spec.md` contains nine testable requirements and the six-runtime user stories]
- [x] CHK-002 [P0] Technical approach is defined. [evidence: `plan.md` defines architecture, stages, tests, dependencies, and rollback]
- [x] CHK-003 [P1] Dependencies and handoff are identified. [evidence: `spec.md` and `plan.md` name 005-provider-adapters-and-privacy and 007-evaluation-and-observability]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Phase implementation passes lint, type, and format checks. [evidence: `npm run check` passes typecheck, build, 202 tests, and import smoke; `git diff --check` clean]
- [x] CHK-011 [P0] Public contracts are versioned and runtime-neutral. [evidence: `runtime-adapter/1.0.0` and `runtime-telemetry/1.0.0`; adapters consume shared contract/render/provider/privacy types with no runtime-specific leakage into the core]
- [x] CHK-012 [P1] Typed error, timeout, cancellation, and fallback handling is implemented. [evidence: every adapter's `exactEvent`/`exactPresentation` map incompatibility, failure, cancellation, timeout, and disconnect to typed exact-original outcomes]
- [x] CHK-013 [P1] Canonical transcripts, events, tool inputs, and tool results remain immutable. [evidence: `assertRuntimeAdapterConformance` snapshot compare + Proxy write-spies across all eight paths; no adapter or client writes canonical state]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All nine requirements have direct observed evidence. [evidence: runtime, client, matrix, fixture, smoke, edge, and performance suites map to the nine requirement rows in `spec.md`]
- [x] CHK-021 [P0] Primary behavior passes focused and integration tests. [evidence: `vitest run test/runtimes test/clients` passes; `npm run check` passes all 202]
- [x] CHK-022 [P0] Exact-original or fail-closed behavior passes every negative control. [evidence: byte round-trip `decodeExactOriginal` on incompatibility, failure, cancellation, timeout, and disconnect on all eight paths]
- [x] CHK-023 [P1] Edge cases pass: runtime reconnect with replayed events; unsupported protocol major or missing capability; partial stream followed by client disconnect; extension event unknown to the shared message extractor. [evidence: `test/runtimes/edge-cases.test.ts`]
- [x] CHK-024 [P1] The same final-state command reruns the authoritative workspace gate. [evidence: final `npm run check` re-run passes typecheck, build, 37 files and 202 tests, and import smoke]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] Same-class producers and changed consumers are inventoried. [evidence: `src/runtimes/` produces records and events; `src/clients/`, `src/runtimes/matrix.ts`, and `telemetryFor` consume them]
- [x] CHK-031 [P0] Independent matrix axes and expected row count are recorded before completion. [evidence: `matrix.ts` and `matrix.test.ts` cover eight concrete paths across six runtimes, six full-projection and two safe-native]
- [x] CHK-032 [P0] Adversarial, no-op, outside-policy, timeout, and fallback cases are covered. [evidence: `smoke.test.ts` tier stratification plus `edge-cases.test.ts`; second-model adversarial review applied and remediated]
- [x] CHK-033 [P1] Evidence is pinned to an explicit final diff or commit. [evidence: commits `0a0d931dfc`, `dea1ad3d2a`, `b5f02f638c`, `b9cd4d1d46`, `0a07c50640`]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## SECURITY

- [x] CHK-040 [P0] No secret, credential value, raw protected span, or user content appears in logs or telemetry. [evidence: `sanitizeRuntimeTelemetryPathId` allowlists the pathId; content and credential canaries pass in `claude.test.ts` and `smoke.test.ts`]
- [x] CHK-041 [P0] Inputs, versions, capabilities, and externally supplied metadata are validated. [evidence: `src/runtimes/adapter.ts` validates envelopes; `capability.ts` checks runtime and protocol majors and fails closed on unknown]
- [x] CHK-042 [P1] Privacy policy and egress boundaries are tested where applicable. [evidence: adapters carry no egress decision; `test/runtimes/` proves they preserve the 005 route and never mutate canonical state]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] Spec, plan, tasks, decision, checklist, and summary match final behavior. [evidence: Phase 006 documents report Complete, 100%, accepted architecture, and the same verification receipts]
- [x] CHK-051 [P1] Parent map and successor handoff match final status. [evidence: `../spec.md` marks Phase 006 Complete and Phase 007 next; `handover.md` records the 202-test baseline for 007]
- [x] CHK-052 [P2] User and operator documentation is updated where applicable. [evidence: capability records are typed and `handover.md` documents the 007 consumption contract and pinned versions]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] Temporary evidence lives only in `scratch/`. [evidence: worker prompts and logs remain under `scratch/` and are untracked]
- [x] CHK-061 [P1] Task-created temporary output is removed before completion. [evidence: `git status` shows only package source, tests, and packet documentation staged; the errant `.opencode` plugin-version drift was reverted]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 items | 15 | 15/15 |
| P1 items | 22 | 22/22 |
| P2 items | 2 | 2/2 |

**Verification date**: 2026-08-12; strict validation and the implementation checkpoints are recorded above.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## Architecture Verification

- [x] CHK-100 [P0] Primary architecture decision is documented. [evidence: `decision-record.md` ADR-001]
- [x] CHK-101 [P1] ADR status and deciders are recorded. [evidence: `decision-record.md` metadata, Accepted 2026-08-12]
- [x] CHK-102 [P1] Alternatives and rejection rationale are documented. [evidence: `decision-record.md` alternatives table]
- [x] CHK-103 [P1] Implementation matches the accepted decision. [evidence: `src/clients/display.ts` atomic full projection; `src/runtimes/capability.ts` fails closed to safe-native/original-only]
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## Performance Verification

- [x] CHK-110 [P1] The Phase 006 performance target is measured under stated conditions. [evidence: `performance.test.ts` measures adapter overhead per presentation tier with warmups and at least 30 runs against the 30 ms p95 budget]
- [x] CHK-111 [P2] Baseline and final p50/p95 or throughput delta is documented where applicable. [evidence: adapter overhead stays within the provisional 30 ms p95 budget on both tiers; a new surface has no predecessor runtime baseline]
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## Deployment Readiness

- [x] CHK-120 [P0] Rollback or original-only procedure is exercised. [evidence: `test/runtimes/claude.test.ts` and peers assert byte-identical exact-original on every terminal path]
- [x] CHK-121 [P1] Monitoring and content-free reason codes cover terminal states where applicable. [evidence: `telemetryFor` maps accepted, exact-original, and degraded states to content-free reason codes]
- [x] CHK-122 [P1] A runbook or successor handoff is current. [evidence: `handover.md` records API boundaries, traps, evidence, and the Phase 007 start order]
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## Compliance Verification

- [x] CHK-130 [P0] Privacy and secret-handling review passes. [evidence: `test/runtimes/smoke.test.ts` content and credential canaries; `sanitizeRuntimeTelemetryPathId` in `src/runtimes/adapter.ts`; second-model review remediated]
- [x] CHK-131 [P1] Added dependencies and licenses are reviewed. [evidence: `package.json` dependencies unchanged; no dependency was added]
- [x] CHK-132 [P1] Data handling matches the declared local or hosted privacy class. [evidence: `src/runtimes/` adapters preserve the 005 privacy classification; `test/runtimes/` confirms presentation never re-classifies content]
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## Documentation Verification

- [x] CHK-140 [P1] All required Level 3 documents pass strict validation. [evidence: `validate.sh --strict` and `--strict --recursive` finish with zero errors]
- [x] CHK-141 [P1] Public contracts or configuration docs are complete where applicable. [evidence: `src/runtimes/index.ts` and `src/clients/index.ts` export the adapter, capability, matrix, and client presentation types]
- [x] CHK-142 [P1] Implementation summary reports observed checks without optimistic claims. [evidence: `implementation-summary.md` records the review finding and remediation, not only the green gate]
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Project owner | Product and privacy | Architecture approved under autonomous-goal delegation | 2026-08-12 |
| Implementer | Technical | Passed | 2026-08-12 |
| Reviewer | Quality and release | Automated gates plus second-model adversarial review passed | 2026-08-12 |
<!-- /ANCHOR:sign-off -->
