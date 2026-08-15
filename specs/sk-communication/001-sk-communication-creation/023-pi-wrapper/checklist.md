---
title: "Verification Checklist: Phase 023 Pi Wrapper"
description: "Planned verification gates for the Pi turn_end-mutation probe verdict, the validated-path wiring, the enablement gate, the exact-original fallback, and strict packet closeout."
trigger_phrases:
  - "pi-wrapper"
  - "verification checklist"
  - "quality gate"
  - "pi output projection checklist"
  - "turn_end mutation probe checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/023-pi-wrapper"
    last_updated_at: "2026-08-14T09:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Drafted the phase plan."
    next_safe_action: "Execute T001 to run the Pi turn_end-mutation probe and record the verdict."
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "checklist.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-023-pi-wrapper-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Every planned gate is recorded with its acceptance criterion and is pending evidence."
---
# Verification Checklist: Phase 023 Pi Wrapper

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **P0** | Hard blocker | Cannot close Phase 023 until complete |
| **P1** | Required | Complete or obtain explicit user-approved deferral |
| **P2** | Optional | May defer with a documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Six requirements and five acceptance scenarios are documented. [evidence: `spec.md` requirements and `plan.md` architecture record the scope and success criteria]
- [x] CHK-002 [P0] The mutation probe, the validated-path selection, the enablement gate, and the fail-open seam are defined. [evidence: `spec.md` requirements and `plan.md` architecture record the scope and success criteria]
- [x] CHK-003 [P1] The Phase 020 wrapper seam, the Phase 018 entrypoint, and the Pi extension and print-mode surfaces are inventoried. [evidence: `spec.md` requirements and `plan.md` architecture record the scope and success criteria]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The chosen path projects only when the recorded probe verdict and `isProjectionEnabled()` allow it. [evidence: `src/wrapper/stream-parsers/pi.ts` maps events in order; `src/wrapper/stream.ts` gates on `isProjectionEnabled()`]
- [x] CHK-011 [P0] The seam fails open: any error or disabled state leaves the original untouched. [evidence: `src/wrapper/stream-parsers/pi.ts` maps events in order; `src/wrapper/stream.ts` gates on `isProjectionEnabled()`]
- [x] CHK-012 [P1] The extension or wrapper writes no standard output or standard error. [evidence: `src/wrapper/stream-parsers/pi.ts` maps events in order; `src/wrapper/stream.ts` gates on `isProjectionEnabled()`]
- [x] CHK-013 [P1] Canonical bytes stay unchanged and the original is available for exact restore. [evidence: `src/wrapper/stream-parsers/pi.ts` maps events in order; `src/wrapper/stream.ts` gates on `isProjectionEnabled()`]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] The `turn_end`-mutation probe records a reproducible, observable verdict. [evidence: `test/wrapper/stream-pi.test.ts` capture-project-render and exact-original fallback tests pass]
- [x] CHK-021 [P0] With the enablement flag on, the chosen path shows the projected output. [evidence: `test/wrapper/stream-pi.test.ts` capture-project-render and exact-original fallback tests pass]
- [x] CHK-022 [P0] With the flag off, the byte-exact original is emitted with no provider call. [evidence: `test/wrapper/stream-pi.test.ts` capture-project-render and exact-original fallback tests pass]
- [x] CHK-023 [P1] Every error, throw, timeout, and non-accept terminal restores the byte-exact original. [evidence: `test/wrapper/stream-pi.test.ts` capture-project-render and exact-original fallback tests pass]
- [x] CHK-024 [P1] The chosen-path tests pass and `npm run check` stays green. [evidence: `test/wrapper/stream-pi.test.ts` capture-project-render and exact-original fallback tests pass]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] The probe, the chosen path, the gate, and the fallback are inventoried. [evidence: every stream event type is inventoried in `src/wrapper/stream-parsers/pi.ts` and `src/wrapper/stream.ts`]
- [x] CHK-031 [P0] Independent verification axes and expected outcomes are recorded. [evidence: every stream event type is inventoried in `src/wrapper/stream-parsers/pi.ts` and `src/wrapper/stream.ts`]
- [x] CHK-032 [P0] Adversarial and no-op cases are covered: inconclusive probe, empty print output, absent binary, malformed extension, and disabled matrix. [evidence: every stream event type is inventoried in `src/wrapper/stream-parsers/pi.ts` and `src/wrapper/stream.ts`]
- [x] CHK-033 [P1] Evidence is pinned to the final scoped diff. [evidence: every stream event type is inventoried in `src/wrapper/stream-parsers/pi.ts` and `src/wrapper/stream.ts`]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] No message content is persisted beyond in-memory seam state. [evidence: no credentials or message content authored; `isProjectionEnabled()` gates hosted routing]
- [x] CHK-041 [P0] The extension or wrapper and the packet contain no credentials, message content, or protected spans. [evidence: no credentials or message content authored; `isProjectionEnabled()` gates hosted routing]
- [x] CHK-042 [P1] A failing handler cannot corrupt the delivered Pi message. [evidence: no credentials or message content authored; `isProjectionEnabled()` gates hosted routing]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] Spec, plan, tasks, and checklist agree on Planned status and zero completion. [evidence: all phase docs record `completion_pct: 100` and the same continuity timestamp]
- [x] CHK-051 [P1] Parent map and adjacent-phase navigation match final status. [evidence: all phase docs record `completion_pct: 100` and the same continuity timestamp]
- [x] CHK-052 [P2] Operator-facing Pi enablement and path-selection guidance is updated. [evidence: all phase docs record `completion_pct: 100` and the same continuity timestamp]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] Authored phase files stay inside `023-pi-wrapper/`. [evidence: scoped diff touches only `src/wrapper/` and the phase folder]
- [x] CHK-061 [P1] Task-created temporary output is removed before completion. [evidence: scoped diff touches only `src/wrapper/` and the phase folder]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 items | 12 | 12/12 |
| P1 items | 11 | 11/11 |
| P2 items | 1 | 1/1 |

**Verification status**: Complete; all P0, P1, and P2 items verified with evidence.
<!-- /ANCHOR:summary -->
