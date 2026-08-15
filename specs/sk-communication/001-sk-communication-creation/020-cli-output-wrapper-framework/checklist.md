---
title: "Verification Checklist: Phase 020 CLI-Output Wrapper Framework"
description: "Completed verification gates for the parameterized wrapper entrypoint, incremental stream capture and envelope normalization, the projectMessage() feed with a fail-open byte-exact original passthrough, the launch/registration pattern, and strict packet closeout."
trigger_phrases:
  - "cli-output-wrapper-framework"
  - "verification checklist"
  - "quality gate"
  - "wrapper framework checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/020-cli-output-wrapper-framework"
    last_updated_at: "2026-08-14T07:56:00.000Z"
    last_updated_by: "claude"
    recent_action: "Shipped the CLI-output wrapper framework and verified the package gate."
    next_safe_action: "Proceed to phase 021 Claude Code wrapper wiring."
    blockers: []
    key_files:
      - "checklist.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-020-cli-output-wrapper-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and acceptance are defined."
      - "Every checklist gate is verified with observed evidence recorded in this file and the implementation summary."
---
# Verification Checklist: Phase 020 CLI-Output Wrapper Framework

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **P0** | Hard blocker | Cannot close Phase 020 until complete |
| **P1** | Required | Complete or obtain explicit user-approved deferral |
| **P2** | Optional | May defer with a documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Ten requirements and five acceptance scenarios are documented. [evidence: `spec.md` section 4 lists REQ-001 through REQ-010 and section 5 lists five acceptance scenarios]
- [x] CHK-002 [P0] The parameterized entrypoint, incremental capture, envelope normalization, projectMessage feed, fail-open fallback, and launch pattern are defined. [evidence: `spec.md` section 3 and `plan.md` architecture freeze the capture-normalize-project-render stage order]
- [x] CHK-003 [P1] The headless, stream, and print modes and the per-runtime adapter shapes are inventoried. [evidence: `src/wrapper/registry.ts` pins the declared launch mode, pathId, protocol, and versions for each wrapper-target runtime; the adapters live in `src/runtimes/`]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The wrapper exposes one entrypoint parameterized by runtime and runs the capture-normalize-project-render stage order. [evidence: `runRuntimeWrapper` in `src/wrapper/index.ts` resolves the plan and delegates to `runWrapperProjection` in `src/wrapper/run.ts`]
- [x] CHK-011 [P0] Projection is gated by `isProjectionEnabled()` before any `projectMessage()` call. [evidence: `runWrapperProjection` in `src/wrapper/run.ts` returns the exact original with `projection-disabled` before normalization or projection]
- [x] CHK-012 [P1] The wrapper fails open: any error or disabled state passes the byte-exact original through. [evidence: normalization, adapter-throw, and entrypoint-throw paths all return the exact original; see `src/wrapper/run.ts` and `src/wrapper/normalize.ts`]
- [x] CHK-013 [P1] The wrapper writes no standard output or standard error and mutates no canonical bytes. [evidence: the wrapper is a pure function returning a value; the canonical-bytes test in `test/wrapper/wrapper.test.ts` asserts byte equality before and after]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] With the flag on, a wrapper-target runtime's output is captured incrementally and re-rendered as the projected text. [evidence: `test/wrapper/wrapper.test.ts` projects a Claude message through a stub transport to `ship the \`release\` build today.`]
- [x] CHK-021 [P0] With the flag off, the captured output passes through byte-exact. [evidence: the disabled test asserts `projection-disabled` and the transport is never called]
- [x] CHK-022 [P0] With an incapable runtime or an unexpected output shape, the raw stream passes through byte-exact. [evidence: `runtime-incapable` for opencode/unknown ids and `normalization-failed` for a throwing adapter both return the exact original]
- [x] CHK-023 [P1] Every error, throw, timeout, and non-accept terminal passes the byte-exact original through. [evidence: `test/wrapper/failure.test.ts` mocks a throwing entrypoint to `wrapper-failure`; the provider 503 and terminal-error tests return `provider-error` and `runtime-failure` with the exact original]
- [x] CHK-024 [P1] The wrapper test suite and the package gate pass from the package directory. [evidence: `npm run check` passes typecheck, build, public-import smoke, and 65/65 files, 337/337 tests]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] Entrypoint resolution, launcher, capture, normalizer, entrypoint call, and render seam are inventoried. [evidence: `src/wrapper/index.ts`, `src/wrapper/registry.ts`, `src/wrapper/normalize.ts`, `src/wrapper/run.ts`, `src/wrapper/render.ts`, and `bin/cli-output-wrapper.mjs` are all wired]
- [x] CHK-031 [P0] Independent verification axes and expected outcomes are recorded. [evidence: `test/wrapper/wrapper.test.ts` covers projection, disabled, incapable, terminal-error, empty-stream, provider-error, and canonical-byte axes]
- [x] CHK-032 [P0] Adversarial and no-op cases are covered: disabled matrix, incapable runtime, unexpected shape, mid-stream exit, and double invoke. [evidence: disabled matrix and incapable runtime in `wrapper.test.ts`; unexpected shape via throwing adapter; mid-stream exit via empty envelopes; each run is an independent capture-render cycle]
- [x] CHK-033 [P1] Evidence is pinned to the final scoped diff. [evidence: `implementation-summary.md` names exact source, launcher, and test files created within the package and phase folder]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] No captured message content is persisted beyond in-memory wrapper state. [evidence: `src/wrapper/run.ts` holds envelopes and the exact-original record only in memory for one run; nothing is written to disk]
- [x] CHK-041 [P0] The wrapper and packet contain no credentials, message content, or protected spans. [evidence: the wrapper reuses injected transports and records; no credential or message content is authored into `src/wrapper/` or the packet docs]
- [x] CHK-042 [P1] A failing wrapper cannot corrupt the captured output or the runtime session. [evidence: every fallback returns the byte-exact original, proven by `test/wrapper/failure.test.ts` and the normalization fallback in `src/wrapper/normalize.ts`]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] Spec, plan, tasks, decision, and checklist agree on Complete status and 100% completion. [evidence: all six phase docs record `completion_pct: 100` and the same continuity timestamp `2026-08-14T07:56:00.000Z`]
- [x] CHK-051 [P1] Parent map and adjacent-phase navigation match final status. [evidence: `spec.md` status is `Complete` and the successor remains `021-claude-code-wrapper`]
- [x] CHK-052 [P2] Operator-facing launch/registration guidance is updated. [evidence: `bin/cli-output-wrapper.mjs` provides the launch pattern with `--list`, passthrough, and registration output]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] Authored phase files stay inside `020-cli-output-wrapper-framework/`. [evidence: only `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md` were authored inside the phase folder]
- [x] CHK-061 [P1] Wrapper, launcher, and test files stay under `src/wrapper/`, `bin/`, and `test/wrapper/`. [evidence: `src/wrapper/*.ts`, `bin/cli-output-wrapper.mjs`, and `test/wrapper/*.ts` are the only non-phase files changed]
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

- [x] CHK-100 [P0] The parameterized wrapper pattern, the per-runtime adapter reuse, and the fail-open seam are documented. [evidence: `decision-record.md` ADR-001 and ADR-002 are `Accepted` with five-check evaluations]
- [x] CHK-101 [P1] ADR status and deciders are recorded. [evidence: `decision-record.md` records `Accepted` status with the operator, runtime integrator, and privacy owner as deciders]
- [x] CHK-102 [P1] Alternatives to the wrapper and incremental-capture approaches are documented with rejection rationale. [evidence: `decision-record.md` compares per-runtime wrappers and plugin extension in ADR-001, and whole-session buffering in ADR-002]
- [x] CHK-103 [P1] Implementation matches the accepted decisions. [evidence: `src/wrapper/` reuses the per-runtime adapters and captures per-message, exactly as the ADRs describe]
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## Performance Verification

- [x] CHK-110 [P1] Wrapper execution stays within the Phase 018 entrypoint's bounded execution. [evidence: the wrapper adds only normalization before delegating to `projectMessage`, whose own bounds are unchanged]
- [x] CHK-111 [P2] Stream capture stays incremental and bounded with no whole-session buffering. [evidence: the wrapper normalizes one assistant message per run and buffers only that message's envelopes before projecting]
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## Deployment Readiness

- [x] CHK-120 [P0] The rollback procedure is documented (remove the wrapper, launcher, and tests). [evidence: `plan.md` L2 Enhanced Rollback and `decision-record.md` record the removal steps]
- [x] CHK-121 [P1] The launch/registration pattern is recorded for operators. [evidence: `bin/cli-output-wrapper.mjs` is the executable operator launch surface and is documented in `implementation-summary.md`]
- [x] CHK-122 [P1] The handoff identifies the single-runtime validation target for Phase 021. [evidence: `spec.md` successor is `021-claude-code-wrapper` and `next_safe_action` points to it]
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## Compliance Verification

- [x] CHK-130 [P0] No hosted projection egress beyond what `projectMessage()` performs. [evidence: the wrapper only calls `projectMessage`; it introduces no additional hosted call path]
- [x] CHK-131 [P1] No dependency or license change is introduced. [evidence: `package.json` is unchanged; the wrapper uses only the existing adapters, transports, and contracts already in the package]
- [x] CHK-132 [P1] Default-off and the shared enablement gate remain the operator controls. [evidence: the wrapper consults `isProjectionEnabled()` before any projection, matching the shared gate]
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## Documentation Verification

- [x] CHK-140 [P1] All required Level 3 documents pass strict validation. [evidence: `validate.sh --strict` on the phase folder reports 0 errors and 0 warnings]
- [x] CHK-141 [P1] Wrapper boundary and rollback contracts are documented. [evidence: `implementation-summary.md` documents the capture-normalize-project-render boundary and the rollback procedure]
- [x] CHK-142 [P1] The packet records completed status with observed evidence. [evidence: `spec.md` status is `Complete`, `completion_pct` is `100`, and the verification table reports the observed gate results]
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Product and privacy | Verified via fail-open and no-egress tests | 2026-08-14 |
| Implementer | Technical | Complete | 2026-08-14 |
| Reviewer | Runtime and quality | Verified via `npm run check` and `validate.sh --strict` | 2026-08-14 |
<!-- /ANCHOR:sign-off -->
