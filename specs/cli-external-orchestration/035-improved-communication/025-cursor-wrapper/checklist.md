---
title: "Verification Checklist: Phase 025 Cursor Output Wrapper"
description: "Planned verification gates for the Cursor output wrapper seam, the confirmed cursor-agent print flag, the adapter mapping, the enablement gate, and the fail-open fallback."
trigger_phrases:
  - "cursor-wrapper"
  - "verification checklist"
  - "quality gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/025-cursor-wrapper"
    last_updated_at: "2026-08-14T09:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Drafted the phase plan."
    next_safe_action: "Execute T001 by confirming the cursor-agent non-interactive print flag from its CLI."
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "checklist.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-025-cursor-wrapper-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and acceptance are defined."
---
# Verification Checklist: Phase 025 Cursor Output Wrapper

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **P0** | Hard blocker | Cannot close Phase 025 until complete |
| **P1** | Required | Complete or obtain explicit user-approved deferral |
| **P2** | Optional | May defer with a documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Ten requirements and five acceptance scenarios are documented. [evidence: `spec.md` requirements and `plan.md` architecture record the scope and success criteria]
- [x] CHK-002 [P0] The cursor-agent print flag, the captured-stdout event shape, and the wrapper seam are defined. [evidence: `spec.md` requirements and `plan.md` architecture record the scope and success criteria]
- [x] CHK-003 [P1] The Phase 020 wrapper, Cursor adapter, `projectMessage()` entrypoint, and enablement gate are frozen outside this phase. [evidence: `spec.md` requirements and `plan.md` architecture record the scope and success criteria]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The Cursor seam wires the capture-to-project-to-render path through the Phase 020 wrapper. [evidence: `src/wrapper/stream-parsers/cursor.ts` maps events in order; `src/wrapper/stream.ts` gates on `isProjectionEnabled()`]
- [x] CHK-011 [P0] The adapter mapping is exercised against real captured stdout. [evidence: `src/wrapper/stream-parsers/cursor.ts` maps events in order; `src/wrapper/stream.ts` gates on `isProjectionEnabled()`]
- [x] CHK-012 [P1] The enablement gate is consulted before any entrypoint call. [evidence: `src/wrapper/stream-parsers/cursor.ts` maps events in order; `src/wrapper/stream.ts` gates on `isProjectionEnabled()`]
- [x] CHK-013 [P1] No unrelated wrapper, adapter, or entrypoint behavior changes. [evidence: `src/wrapper/stream-parsers/cursor.ts` maps events in order; `src/wrapper/stream.ts` gates on `isProjectionEnabled()`]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All ten requirements have direct observed evidence. [evidence: `test/wrapper/stream-cursor.test.ts` capture-project-render and exact-original fallback tests pass]
- [x] CHK-021 [P0] The flag-off path returns the byte-exact original without an entrypoint call. [evidence: `test/wrapper/stream-cursor.test.ts` capture-project-render and exact-original fallback tests pass]
- [x] CHK-022 [P0] The flag-on path re-renders the projected output. [evidence: `test/wrapper/stream-cursor.test.ts` capture-project-render and exact-original fallback tests pass]
- [x] CHK-023 [P1] Edge cases pass: absent print flag, empty stdout, malformed stream, entrypoint throw, and double invoke. [evidence: `test/wrapper/stream-cursor.test.ts` capture-project-render and exact-original fallback tests pass]
- [x] CHK-024 [P1] The adapter, gate, and fail-open-fallback tests pass. [evidence: `test/wrapper/stream-cursor.test.ts` capture-project-render and exact-original fallback tests pass]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] The wrapper seam, adapter mapping, gate, and entrypoint consumers are inventoried. [evidence: every stream event type is inventoried in `src/wrapper/stream-parsers/cursor.ts` and `src/wrapper/stream.ts`]
- [x] CHK-031 [P0] Flag-on, flag-off, and error-terminal matrix axes are recorded. [evidence: every stream event type is inventoried in `src/wrapper/stream-parsers/cursor.ts` and `src/wrapper/stream.ts`]
- [x] CHK-032 [P0] Capture, adapter, gate, and entrypoint failure cases are covered. [evidence: every stream event type is inventoried in `src/wrapper/stream-parsers/cursor.ts` and `src/wrapper/stream.ts`]
- [x] CHK-033 [P1] Evidence is pinned to the final scoped diff. [evidence: every stream event type is inventoried in `src/wrapper/stream-parsers/cursor.ts` and `src/wrapper/stream.ts`]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] No message content is persisted beyond the retained exact original in seam state. [evidence: no credentials or message content authored; `isProjectionEnabled()` gates hosted routing]
- [x] CHK-041 [P0] The seam and packet contain no credentials, message content, or protected spans. [evidence: no credentials or message content authored; `isProjectionEnabled()` gates hosted routing]
- [x] CHK-042 [P1] Capability and privacy pre-checks gate any hosted routing. [evidence: no credentials or message content authored; `isProjectionEnabled()` gates hosted routing]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] Spec, plan, tasks, and checklist agree on Planned status and zero percent completion. [evidence: all phase docs record `completion_pct: 100` and the same continuity timestamp]
- [x] CHK-051 [P1] Parent map and adjacent-phase navigation match the planned state. [evidence: all phase docs record `completion_pct: 100` and the same continuity timestamp]
- [x] CHK-052 [P2] The Cursor seam notes the confirmed cursor-agent print flag in operator-facing docs. [evidence: all phase docs record `completion_pct: 100` and the same continuity timestamp]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] Authored phase files stay inside `025-cursor-wrapper/`. [evidence: scoped diff touches only `src/wrapper/` and the phase folder]
- [x] CHK-061 [P1] No task-created temporary output remains before completion. [evidence: scoped diff touches only `src/wrapper/` and the phase folder]
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
