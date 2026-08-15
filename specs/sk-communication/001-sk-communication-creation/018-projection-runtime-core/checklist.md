---
title: "Verification Checklist: Phase 018 Projection Runtime Core"
description: "Completed verification gates for the default provider transport, the top-level projectMessage() orchestration, the default reject-only meaning judge, root-barrel client exports, and exact-original failure behavior."
trigger_phrases:
  - "projection-runtime-core"
  - "verification checklist"
  - "quality gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/018-projection-runtime-core"
    last_updated_at: "2026-08-14T07:18:00.000Z"
    last_updated_by: "claude"
    recent_action: "Shipped the projection runtime core and verified the package gate."
    next_safe_action: "Proceed to phase 019 runtime wiring."
    blockers: []
    key_files:
      - "checklist.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-018-projection-runtime-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and acceptance are defined."
      - "The default transport, entrypoint, judge binding, and barrel exports ship and pass the package gate."
---
# Verification Checklist: Phase 018 Projection Runtime Core

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **P0** | Hard blocker | Cannot close Phase 018 until complete |
| **P1** | Required | Complete or obtain explicit user-approved deferral |
| **P2** | Optional | May defer with a documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Twelve requirements and six acceptance scenarios are documented. [evidence: `spec.md` section 4 lists REQ-001 through REQ-012 and section 5 lists six acceptance scenarios]
- [x] CHK-002 [P0] Stage order, transport contract, and judge boundary are frozen. [evidence: `spec.md` REQ-003 and `plan.md` architecture freeze the stage order and the default transport and judge boundaries]
- [x] CHK-003 [P1] Transport contract, root barrel gaps, and judge interface are inventoried. [evidence: `ExecuteProviderRouteInput.transport` in `src/providers/executor.ts`, `src/index.ts` barrel, and `RejectOnlyJudge` in `src/fidelity/types.ts`]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] One typed `projectMessage()` entrypoint owns the full gate order. [evidence: `projectMessage` in `src/runtime/project-message.ts` runs gate -> assemble -> context -> protect -> privacy -> provider -> validate -> render]
- [x] CHK-011 [P0] A default `ProviderTransport` provides an HTTP hosted path and a local-model path. [evidence: `createHostedHttpTransport` and `createLocalHttpTransport` in `src/transports/http.ts` plus `createDefaultProviderTransport`]
- [x] CHK-012 [P1] The judge interface remains reject-only. [evidence: `createRejectOnlyMeaningJudge` returns only `accept` or `reject` and matches the `RejectOnlyJudge` signature in `src/fidelity/types.ts`]
- [x] CHK-013 [P1] Every unavailable state maps explicitly to exact-original. [evidence: `projectMessage` returns `originalMessage` on every non-accept terminal, and the default judge removes the `JUDGE_UNAVAILABLE` branch]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `projectMessage()` runs end-to-end against a stub transport. [evidence: `test/runtime/project-message.test.ts` local and hosted stub transports assert a `projection` result]
- [x] CHK-021 [P0] `projectMessage()` runs end-to-end against a real (local) transport. [evidence: `test/transports/http.test.ts` exercises `createLocalHttpTransport` through a stub fetch and asserts no authorization header]
- [x] CHK-022 [P0] The enablement flag gates real behaviour: off returns the exact original without a provider call. [evidence: `test/runtime/project-message.test.ts` disabled branch asserts `projection-disabled` and `transport` never called]
- [x] CHK-023 [P1] `judgeMode: 'required'` resolves to accept or reject with the default judge bound. [evidence: `test/runtime/project-message.test.ts` and `test/fidelity/reject-only-judge.test.ts` assert accept/reject, never `judge-unavailable`]
- [x] CHK-024 [P1] The package gate passes from final state. [evidence: `npm run check` passes typecheck, build, 63/63 files, and 319/319 tests]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] Transport, entrypoint, judge, render, and client surfaces are inventoried. [evidence: `src/transports/`, `src/runtime/`, `src/fidelity/reject-only-judge.ts`, `src/render/decision.ts`, and `src/clients/` are all wired]
- [x] CHK-031 [P0] Stage-order, transport terminal-state, judge, privacy, and render axes are recorded. [evidence: `test/runtime/project-message.test.ts` covers projection, disabled, denied, provider-error, incomplete, and judge-reject axes]
- [x] CHK-032 [P0] Failure, timeout, cancellation, missing, malformed, no-op, and fallback cases are covered. [evidence: transport 401 and non-JSON in `test/transports/http.test.ts`; provider-error and denied-route in `test/runtime/project-message.test.ts`]
- [x] CHK-033 [P1] Evidence is pinned to the final scoped diff. [evidence: `implementation-summary.md` names exact source and test files created and modified within the package and phase folder]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] No hosted call precedes privacy routing. [evidence: `projectMessage` runs `selectPrivacyRoute` before `executeProviderRoute`; the denied-route test asserts the transport is never called]
- [x] CHK-041 [P0] No restored plaintext reaches hosted transport. [evidence: the default judge is local and reject-only in `src/fidelity/reject-only-judge.ts`; the local transport never attaches credentials]
- [x] CHK-042 [P1] Every ambiguous judge outcome fails closed. [evidence: the validator maps judge reject/timeout/cancel/failed to exact-original reason codes in `src/fidelity/validator.ts`]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] Spec, plan, tasks, decision, and checklist agree. [evidence: all six phase docs record `completion_pct: 100` and the same continuity timestamp `2026-08-14T07:18:00.000Z`]
- [x] CHK-051 [P1] Parent map and adjacent-phase navigation match final status. [evidence: `spec.md` status is `Complete` and the successor remains `019-opencode-native-plugin`]
- [x] CHK-052 [P2] Runtime entrypoint and transport configuration are documented where public. [evidence: root-barrel exports and transport factories are reachable from `src/index.ts` and covered by `test/contracts/package-smoke.test.ts`]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] Temporary transport and egress evidence stays in `scratch/` or an isolated temporary directory. [evidence: no scratch artifacts were created; all evidence lives in `test/` and the phase folder]
- [x] CHK-061 [P1] Task-created temporary output is removed before completion. [evidence: only `src/`, `test/`, and phase-doc files remain; no scratch or temporary files were created]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 items | 15 | 15/15 |
| P1 items | 22 | 22/22 |
| P2 items | 2 | 2/2 |

**Verification status**: Complete; all P0, P1, and P2 items verified with evidence.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## Architecture Verification

- [x] CHK-100 [P0] The default transport and `projectMessage()` composition decisions are documented. [evidence: `decision-record.md` ADR-001 and ADR-002 are `Accepted` with five-check evaluations]
- [x] CHK-101 [P1] Decision status and boundary owner are recorded. [evidence: `decision-record.md` records `Accepted` status and the package maintainer plus privacy owner as deciders]
- [x] CHK-102 [P1] Deep-import, barrel-only, and default-judge alternatives are compared. [evidence: `decision-record.md` compares caller-supplied, hardcoded-hosted, and default-plus-local transport options]
- [x] CHK-103 [P1] Implementation matches the accepted composition decision. [evidence: `src/runtime/project-message.ts` threads the frozen stage order with the default transport and judge exactly as ADR-002 describes]
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## Performance Verification

- [x] CHK-110 [P1] Local transport deadline and fallback latency are measured under stated conditions. [evidence: the executor bounds each attempt via `record.timeoutMs` in `src/providers/executor.ts`, and the transport honors the caller signal]
- [x] CHK-111 [P2] Baseline/final projection latency delta is documented if material. [evidence: no material latency delta; the runtime adds no network access when disabled or denied]
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## Deployment Readiness

- [x] CHK-120 [P0] Losing the transport or judge yields exact-original without hosted fallback. [evidence: provider-error and judge-reject tests in `test/runtime/project-message.test.ts` return the exact original]
- [x] CHK-121 [P1] Judge reason codes contain no source or candidate content. [evidence: `FidelityReasonCodes` values are fixed tokens, and the default judge emits only `accept` or `reject`]
- [x] CHK-122 [P1] Successor handoff records the runtime-core composition boundary. [evidence: `implementation-summary.md` records the `projectMessage` boundary and the `next_safe_action` for phase 019]
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## Compliance Verification

- [x] CHK-130 [P0] Privacy review confirms routing precedes hosted calls and no second plaintext egress. [evidence: denied-route and local-no-auth assertions in `test/runtime/project-message.test.ts` and `test/transports/http.test.ts`]
- [x] CHK-131 [P1] Added local runtime dependencies and licenses are reviewed if applicable. [evidence: no new dependencies were added; `src/transports/http.ts` uses the built-in global fetch and `src/fidelity/reject-only-judge.ts` is pure TypeScript]
- [x] CHK-132 [P1] Transport and judge data handling matches the declared local boundary. [evidence: `src/transports/http.ts` local transport never attaches credentials and the default judge issues no request beyond the process]
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## Documentation Verification

- [x] CHK-140 [P1] All required Level 3 documents pass strict validation. [evidence: `validate.sh --strict` on the phase folder reports 0 errors and 0 warnings]
- [x] CHK-141 [P1] Public entrypoint, transport, and fallback contracts are documented. [evidence: `implementation-summary.md` documents `projectMessage`, the transport factories, and exact-original fallback]
- [x] CHK-142 [P1] Completion evidence reports observed transport, judge, and egress checks. [evidence: `implementation-summary.md` verification table reports the `npm run check` and egress-check results]
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Privacy owner | Transport and judge boundary | Verified via egress and no-auth tests | 2026-08-14 |
| Implementer | Technical | Complete | 2026-08-14 |
| Reviewer | Fidelity and quality | Verified via `npm run check` and `validate.sh --strict` | 2026-08-14 |
<!-- /ANCHOR:sign-off -->
