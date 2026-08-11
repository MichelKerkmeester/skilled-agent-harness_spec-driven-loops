---
title: "Verification Checklist: Phase 004 Protected Spans, Fidelity, and Render"
description: "Observed implementation and release evidence for the Phase 004 fidelity and render boundary."
trigger_phrases:
  - "protected-spans-fidelity-render"
  - "verification checklist"
  - "quality gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/004-protected-spans-fidelity-render"
    last_updated_at: "2026-08-11T19:25:48Z"
    last_updated_by: "codex"
    recent_action: "Verified implementation, focused behavior, performance, privacy, dependencies and packaging."
    next_safe_action: "Close metadata, changelog and recursive strict validation, then hand over to Phase 005."
    blockers: []
    key_files:
      - "checklist.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
      - "handover.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-004-scaffold-20260811"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and handoff are defined."
      - "The project owner approved the Phase 004 architecture and implementation."
      - "All code and behavior gates pass; final recursive packet closure remains."
---
# Verification Checklist: Phase 004 Protected Spans, Fidelity, and Render

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **P0** | Hard blocker | Cannot close Phase 004 until complete |
| **P1** | Required | Complete or obtain an explicit user-approved deferral |
| **P2** | Optional | May defer with a documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements are documented. [evidence: `spec.md` contains eight testable requirements and six acceptance scenarios]
- [x] CHK-002 [P0] Technical approach is defined. [evidence: `plan.md` defines architecture, stages, tests, dependencies, and rollback]
- [x] CHK-003 [P1] Dependencies and handoff are identified. [evidence: `spec.md` and `plan.md` name 003-core-normalization-and-assembly and 005-provider-adapters-and-privacy]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Phase implementation passes lint, type, and format checks. [evidence: strict TypeScript typecheck and build pass; the package defines no separate lint or formatter script; the 18-file whitespace, tab and final-newline boundary passes]
- [x] CHK-011 [P0] Public contracts are versioned and runtime-neutral. [evidence: protected-spans, fidelity and render profiles carry `1.0.0` version markers and import without a CLI dependency]
- [x] CHK-012 [P1] Typed error, timeout, cancellation, and fallback handling is implemented. [evidence: focused Vitest 23/23 covers provider, judge, abort, malformed input and validator exceptions]
- [x] CHK-013 [P1] Canonical transcripts, events, tool inputs, and tool results remain immutable. [evidence: focused Vitest 23/23 freezes separate render decisions and retains exact original bytes after mutation]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All eight requirements have direct observed evidence. [evidence: `implementation-summary.md` requirement table]
- [x] CHK-021 [P0] Primary behavior passes focused and integration tests. [evidence: focused Vitest passes 23/23 across 4 files]
- [x] CHK-022 [P0] Exact-original or fail-closed behavior passes every negative control. [evidence: focused Vitest 23/23 covers placeholder, semantic, provider, judge, exception, CAS, capability and invalid-input outcomes]
- [x] CHK-023 [P1] Edge cases pass: nested fences and unmatched delimiters; source text that resembles placeholder tokens; duplicate identifiers with distinct byte ranges; candidate with changed negation, modal strength, or reordered table cells. [evidence: direct cases in `protected-spans.test.ts` and `validator.test.ts`]
- [x] CHK-024 [P1] The same final-state command reruns the authoritative workspace gate. [evidence: `npm run check` passes typecheck, build, 16 files, 70/70 tests and public import smoke]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] Same-class producers and changed consumers are inventoried. [evidence: `implementation-summary.md` producer and consumer inventory]
- [x] CHK-031 [P0] Independent matrix axes and expected row count are recorded before completion. [evidence: `plan.md` records a 20-row minimum; the final focused suite has 23 tests]
- [x] CHK-032 [P0] Adversarial, no-op, outside-policy, timeout, and fallback cases are covered. [evidence: focused Vitest 23/23 covers the generated corpus, safe rewrite, unknown evidence key, judge timeout and original-only cases]
- [x] CHK-033 [P1] Evidence is pinned to an explicit final diff or commit. [evidence: uncommitted scoped code manifest `sha256:923dcc68b3b008facb9576ff35657d645f2ac2a174b7fc60df43688f5be845d3`; no commit was requested]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## SECURITY

- [x] CHK-040 [P0] No secret, credential value, raw protected span, or user content appears in logs or telemetry. [evidence: `render.test.ts` proves raw-content and HMAC-key canaries are absent from schema-valid terminal events]
- [x] CHK-041 [P0] Inputs, versions, capabilities, and externally supplied metadata are validated. [evidence: `validator.test.ts` and `render.test.ts` cover malformed protection, unknown fields, invalid projections and open capabilities]
- [x] CHK-042 [P1] Privacy policy and egress boundaries are tested where applicable. [evidence: `npm ls --omit=dev --depth=0` is empty and the source scan finds no provider or network path; egress routing remains Phase 005]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] Spec, plan, tasks, decision, checklist, and summary match final behavior. [evidence: `validate_document.py` reports 0 issues across all seven Phase 004 documents]
- [x] CHK-051 [P1] Parent map and successor handoff match final status. [evidence: parent `spec.md`, Phase 004 `handover.md` and Phase 005 continuity identify the completed and next phases]
- [x] CHK-052 [P2] User and operator documentation is updated where applicable. [evidence: no end-user surface exists in this internal-library phase; `handover.md` documents the Phase 005 operator boundary]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] Temporary evidence lives only in `scratch/`. [evidence: no packet-local temporary evidence was created; transient manifests used an OS temporary file and were removed]
- [x] CHK-061 [P1] Task-created temporary output is removed before completion. [evidence: `find packages/cli-communication-projection specs/cli-external-orchestration/035-improved-communication -type f` residue scan returned 0 tarball, temporary, cache or scratch paths]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 items | 15 | 15/15 |
| P1 items | 22 | 22/22 |
| P2 items | 2 | 2/2 |

**Verification date**: 2026-08-11; all required items have observed evidence.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## Architecture Verification

- [x] CHK-100 [P0] Primary architecture decision is documented. [evidence: `decision-record.md` ADR-001]
- [x] CHK-101 [P1] ADR status and deciders are recorded. [evidence: `decision-record.md` metadata]
- [x] CHK-102 [P1] Alternatives and rejection rationale are documented. [evidence: `decision-record.md` alternatives table]
- [x] CHK-103 [P1] Implementation matches the accepted decision. [evidence: `validator.test.ts` proves deterministic rules run before the optional reject-only judge and every veto retains exact original bytes]
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## Performance Verification

- [x] CHK-110 [P1] The Phase 004 performance target is measured under stated conditions. [evidence: `performance.test.ts` records Apple M5 Max, Node v25.6.1, 5 warmups, 30 runs, 23.72 ms p50 and 24.83 ms p95]
- [x] CHK-111 [P2] Baseline and final p50/p95 or throughput delta is documented where applicable. [evidence: failing p95 92.86 ms to final 24.83 ms, down 68.03 ms or 73.3%; the failed run did not emit a trustworthy baseline p50]
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## Deployment Readiness

- [x] CHK-120 [P0] Rollback or original-only procedure is exercised. [evidence: all runtime display capabilities disabled selects `exact-original-only` with `unsupported-mode`]
- [x] CHK-121 [P1] Monitoring and content-free reason codes cover terminal states where applicable. [evidence: `render.test.ts` produces schema-valid validation and projection terminal events]
- [x] CHK-122 [P1] A runbook or successor handoff is current. [evidence: `handover.md` records the Phase 005 API boundary, traps, cold-read order and next safe action]
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## Compliance Verification

- [x] CHK-130 [P0] Privacy and secret-handling review passes. [evidence: `render.test.ts`, the unsafe-source scan and `npm audit --omit=dev` pass]
- [x] CHK-131 [P1] Added dependencies and licenses are reviewed. [evidence: `npm ls --omit=dev --depth=0` is empty and audit reports 0 vulnerabilities]
- [x] CHK-132 [P1] Data handling matches the declared local or hosted privacy class. [evidence: `src/render/evidence.ts` passes only the validated privacy enum and content-free counters into telemetry]
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## Documentation Verification

- [x] CHK-140 [P1] All required Level 3 documents pass strict validation. [evidence: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/cli-external-orchestration/035-improved-communication/004-protected-spans-fidelity-render --strict --verbose` previously exited 0 with 0 errors and 0 warnings]
- [x] CHK-141 [P1] Public contracts or configuration docs are complete where applicable. [evidence: `npm run test:import` loads the six Phase 004 functions and their versioned public types carry JSDoc]
- [x] CHK-142 [P1] Implementation summary reports observed checks without optimistic claims. [evidence: `validate_document.py` reports 0 issues and DQI is 79/100 with no HVR/style issues]
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Project owner | Product and privacy | Approved | 2026-08-11 |
| Implementer | Technical | Verified | 2026-08-11 |
| Reviewer | Quality and release | Verified by automated and document gates | 2026-08-11 |
<!-- /ANCHOR:sign-off -->
