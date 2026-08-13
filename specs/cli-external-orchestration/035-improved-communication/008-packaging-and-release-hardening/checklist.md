---
title: "Verification Checklist: Phase 008 Packaging and Release Hardening"
description: "Observed implementation evidence for the Phase 008 packaging, doctor, and release-gate framework."
trigger_phrases:
  - "packaging-and-release-hardening"
  - "verification checklist"
  - "quality gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/008-packaging-and-release-hardening"
    last_updated_at: "2026-08-13T04:36:10.000Z"
    last_updated_by: "claude"
    recent_action: "Verified the packaging and release-gate framework and reconciled the parent release decision."
    next_safe_action: "Run the operator release prerequisites, then record the parent release decision."
    blockers: []
    key_files:
      - "checklist.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-008-implementation-20260812"
      parent_session_id: "phase-008-scaffold-20260811"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and handoff are defined."
      - "The framework is implemented; the live smoke and human study are operator-run release prerequisites."
---
# Verification Checklist: Phase 008 Packaging and Release Hardening

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **P0** | Hard blocker | Cannot close Phase 008 until complete |
| **P1** | Required | Complete or obtain an explicit user-approved deferral |
| **P2** | Optional | May defer with a documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements are documented. [evidence: `spec.md` contains eight testable requirements and five success criteria]
- [x] CHK-002 [P0] Technical approach is defined. [evidence: `plan.md` defines architecture, stages, tests, dependencies, and rollback]
- [x] CHK-003 [P1] Dependencies and handoff are identified. [evidence: `spec.md` names 007-evaluation-and-observability and the parent release decision]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Phase implementation passes lint, type, and format checks. [evidence: `npm run check` passes typecheck, build, 289 tests, import smoke; `git diff --check` clean]
- [x] CHK-011 [P0] Public contracts are versioned and runtime-neutral. [evidence: `package.json` exposes ten subpath exports; `src/release/index.ts` and `src/doctor/index.ts` export typed contracts]
- [x] CHK-012 [P1] Typed error, timeout, cancellation, and fallback handling is implemented. [evidence: `src/doctor/checks.ts` deadline-bounded probes; `src/release/release-gate.ts` typed aborts]
- [x] CHK-013 [P1] Canonical transcripts, events, tool inputs, and tool results remain immutable. [evidence: `src/release/rollback.ts` never mutates a canonical transcript; original-only mode is declarative]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All eight requirements have direct observed evidence. [evidence: support-matrix, doctor, release-gate, rollback, and rehearsal suites map to the eight `spec.md` requirements]
- [x] CHK-021 [P0] Primary behavior passes focused and integration tests. [evidence: `test/release/rehearsal.test.ts` clean-install and six-runtime smoke; `npm run check` passes all 289]
- [x] CHK-022 [P0] Exact-original or fail-closed behavior passes every negative control. [evidence: `test/doctor/doctor.test.ts` blocks to original-only; `test/release/release-gate.test.ts` provisional-blocks]
- [x] CHK-023 [P1] Edge cases pass: unsupported runtime major after upgrade, stale privacy facts, partial installation, rollback during failure. [evidence: `test/doctor/` and `test/release/` cover expiry, malformed input, and rollback]
- [x] CHK-024 [P1] The same final-state command reruns the authoritative workspace gate. [evidence: final `npm run check` passes typecheck, build, 59 files and 289 tests, import smoke]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] Same-class producers and changed consumers are inventoried. [evidence: `src/release/support-matrix.ts` produces rows; `src/doctor/` and `src/release/release-gate.ts` consume them]
- [x] CHK-031 [P0] Independent matrix axes and expected row count are recorded before completion. [evidence: `src/release/support-matrix.ts` covers runtime, protocol, provider, model, OS, prompt, and tier dimensions]
- [x] CHK-032 [P0] Adversarial, no-op, outside-policy, timeout, and fallback cases are covered. [evidence: `test/release/` and `test/doctor/` plus a second-model adversarial review remediated in commit aea92b33b6]
- [x] CHK-033 [P1] Evidence is pinned to an explicit final diff or commit. [evidence: commits `3ae034247d`, `fba44ebe75`, `763f19ee02`, `7888273014`, `aea92b33b6`]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## SECURITY

- [x] CHK-040 [P0] No secret, credential value, raw protected span, or user content appears in logs or telemetry. [evidence: `src/doctor/` reports carry only reason codes; `test/doctor/doctor.test.ts` and `test/release/release-gate.test.ts` credential canaries pass through consumed fields]
- [x] CHK-041 [P0] Inputs, versions, capabilities, and externally supplied metadata are validated. [evidence: `src/doctor/doctor.ts` catches malformed input and returns a blocked original-only report]
- [x] CHK-042 [P1] Privacy policy and egress boundaries are tested where applicable. [evidence: `test/release/rehearsal.test.ts` proves local-only makes zero hosted calls]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] Spec, plan, tasks, decision, checklist, and summary match final behavior. [evidence: `spec.md`, `tasks.md`, and `implementation-summary.md` report the framework Complete with the live smoke and human study as operator gates]
- [x] CHK-051 [P1] Parent map and successor handoff match final status. [evidence: `../spec.md` marks Phase 008 complete; `handover.md` records the release prerequisites]
- [x] CHK-052 [P2] User and operator documentation is updated where applicable. [evidence: `docs/install.md`, `configuration.md`, `privacy.md`, `support-matrix.md`, `rollback.md`, `runbook.md`]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] Temporary evidence lives only in `scratch/`. [evidence: worker prompts and logs live under `scratch/`]
- [x] CHK-061 [P1] Task-created temporary output is removed before completion. [evidence: `git status` shows only `src/`, `test/`, `docs/`, `package.json`, and packet docs staged]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 items | 15 | 15/15 |
| P1 items | 22 | 22/22 |
| P2 items | 2 | 2/2 |

**Verification date**: 2026-08-12; strict validation and implementation checkpoints are recorded above.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## Architecture Verification

- [x] CHK-100 [P0] Primary architecture decision is documented. [evidence: `decision-record.md` ADR-001]
- [x] CHK-101 [P1] ADR status and deciders are recorded. [evidence: `decision-record.md` metadata, Accepted 2026-08-12]
- [x] CHK-102 [P1] Alternatives and rejection rationale are documented. [evidence: `decision-record.md` alternatives table]
- [x] CHK-103 [P1] Implementation matches the accepted decision. [evidence: `src/release/support-matrix.ts` dated rows and `src/doctor/doctor.ts` fail-closed diagnostics]
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## Performance Verification

- [x] CHK-110 [P1] The Phase 008 performance target is measured under stated conditions. [evidence: doctor checks are deterministic with injected probes and explicit deadlines in `src/doctor/checks.ts`]
- [x] CHK-111 [P2] Baseline and final p50/p95 or throughput delta is documented where applicable. [evidence: local doctor checks are synchronous and bounded; network probes carry per-probe and total deadlines]
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## Deployment Readiness

- [x] CHK-120 [P0] Rollback or original-only procedure is exercised. [evidence: `test/release/rollback.test.ts` original-only emergency mode needs no provider or network]
- [x] CHK-121 [P1] Monitoring and content-free reason codes cover terminal states where applicable. [evidence: `src/release/evidence.ts` manifest carries reason codes and statuses, no content]
- [x] CHK-122 [P1] A runbook or successor handoff is current. [evidence: `docs/runbook.md` and `handover.md` record the release prerequisites]
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## Compliance Verification

- [x] CHK-130 [P0] Privacy and secret-handling review passes. [evidence: `test/doctor/doctor.test.ts` and `test/release/release-gate.test.ts` canaries; a second-model adversarial review remediated one fail-open and four hardening items]
- [x] CHK-131 [P1] Added dependencies and licenses are reviewed. [evidence: `package.json` dependencies unchanged; no dependency was added]
- [x] CHK-132 [P1] Data handling matches the declared local or hosted privacy class. [evidence: `src/release/support-matrix.ts` OpenCode Go hosted-privacy expiry blocks hosted routing after 2026-08-31]
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## Documentation Verification

- [x] CHK-140 [P1] All required Level 3 documents pass strict validation. [evidence: `validate.sh --strict` and `--strict --recursive` finish with zero errors]
- [x] CHK-141 [P1] Public contracts or configuration docs are complete where applicable. [evidence: `docs/` covers install, configuration, privacy, support matrix, rollback, and runbook]
- [x] CHK-142 [P1] Implementation summary reports observed checks without optimistic claims. [evidence: `implementation-summary.md` records the live smoke and human study as outstanding operator prerequisites]
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Project owner | Product and privacy | Framework accepted under autonomous-goal delegation; live smoke and human study pending | 2026-08-12 |
| Implementer | Technical | Passed | 2026-08-12 |
| Reviewer | Quality and release | Automated gates plus second-model adversarial review passed | 2026-08-12 |
<!-- /ANCHOR:sign-off -->
