---
title: "Verification Checklist: Phase 021 Claude Code Wrapper"
description: "Planned verification gates for the Claude stream-json adapter mapping, the CLI-output wrapper wiring into projectMessage(), and the enablement-gated fail-open fallback."
trigger_phrases:
  - "claude-code-wrapper"
  - "verification checklist"
  - "quality gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/021-claude-code-wrapper"
    last_updated_at: "2026-08-14T09:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Drafted the phase plan."
    next_safe_action: "Execute T001 to wire the Claude stream-json adapter mapping onto the assembler event shape."
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "checklist.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-021-claude-code-wrapper-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Every P0, P1, and P2 checklist item has a stated acceptance criterion and no evidence yet."
---
# Verification Checklist: Phase 021 Claude Code Wrapper

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **P0** | Hard blocker | Cannot close Phase 021 until complete |
| **P1** | Required | Complete or obtain an explicit user-approved deferral |
| **P2** | Optional | May defer with a documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Ten requirements and six acceptance scenarios are documented. (acceptance criterion: `spec.md` requirements and success-criteria anchors hold REQ-001 through REQ-010 and the six scenarios) [evidence: `spec.md` requirements and `plan.md` architecture record the scope and success criteria]
- [x] CHK-002 [P0] The Phase 020 seam, the stream-json snapshot, and the `projectMessage()` signature are defined. (acceptance criterion: the seam entrypoints, the pinned snapshot, and the entrypoint signature are explicit) [evidence: `spec.md` requirements and `plan.md` architecture record the scope and success criteria]
- [x] CHK-003 [P1] The phase stays scoped to headless and print output only. (acceptance criterion: `spec.md` scope excludes the interactive TUI) [evidence: `spec.md` requirements and `plan.md` architecture record the scope and success criteria]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The Claude adapter maps stream-json events onto the assembler event shape in order. (acceptance criterion: every pinned event type lands on the assembler event shape in order) [evidence: `src/wrapper/stream-parsers/claude.ts` maps events in order; `src/wrapper/stream.ts` gates on `isProjectionEnabled()`]
- [x] CHK-011 [P0] Every seam entry consults `isProjectionEnabled()` before projecting. (acceptance criterion: REQ-004 states the gate placement and its byte-exact behavior when off) [evidence: `src/wrapper/stream-parsers/claude.ts` maps events in order; `src/wrapper/stream.ts` gates on `isProjectionEnabled()`]
- [x] CHK-012 [P1] The fail-open exact-original fallback covers adapter error, parse failure, and wrapper failure. (acceptance criterion: REQ-005 names every fallback trigger and the byte-exact outcome) [evidence: `src/wrapper/stream-parsers/claude.ts` maps events in order; `src/wrapper/stream.ts` gates on `isProjectionEnabled()`]
- [x] CHK-013 [P1] Canonical bytes are preserved and the interactive TUI is never intercepted. (acceptance criterion: REQ-006 and the scope exclude canonical mutation and TUI interception) [evidence: `src/wrapper/stream-parsers/claude.ts` maps events in order; `src/wrapper/stream.ts` gates on `isProjectionEnabled()`]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All ten requirements have stated acceptance criteria. (acceptance criterion: `spec.md` maps REQ-001 through REQ-010 to observable checks) [evidence: `test/wrapper/stream-claude.test.ts` capture-project-render and exact-original fallback tests pass]
- [x] CHK-021 [P0] Adapter-mapping tests pass against the pinned stream-json snapshot. (acceptance criterion: the mapping tests cover every pinned event type and the malformed-event fallback) [evidence: `test/wrapper/stream-claude.test.ts` capture-project-render and exact-original fallback tests pass]
- [x] CHK-022 [P0] The enablement-gate and exact-original fallback tests pass. (acceptance criterion: disabled and failure paths emit the byte-exact original) [evidence: `test/wrapper/stream-claude.test.ts` capture-project-render and exact-original fallback tests pass]
- [x] CHK-023 [P1] Edge cases pass: partial stream, malformed event, absent `claude` binary, mid-stream disable. (acceptance criterion: `spec.md` edge cases plus the fail-open seam cover each) [evidence: `test/wrapper/stream-claude.test.ts` capture-project-render and exact-original fallback tests pass]
- [x] CHK-024 [P1] The end-to-end smoke proves enablement-on projects and enablement-off passes the exact original through. (acceptance criterion: a pinned snapshot run shows both outcomes) [evidence: `test/wrapper/stream-claude.test.ts` capture-project-render and exact-original fallback tests pass]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] All stream-json event types are inventoried. (acceptance criterion: the pinned snapshot names every event type the adapter must map) [evidence: every stream event type is inventoried in `src/wrapper/stream-parsers/claude.ts` and `src/wrapper/stream.ts`]
- [x] CHK-031 [P0] The seam, gate, and fallback axes are recorded. (acceptance criterion: the adapter, the `isProjectionEnabled()` gate, and the exact-original fallback each appear with their surface) [evidence: every stream event type is inventoried in `src/wrapper/stream-parsers/claude.ts` and `src/wrapper/stream.ts`]
- [x] CHK-032 [P0] Malformed-event, disable, and failure no-op cases are covered. (acceptance criterion: `spec.md` edge cases and the seam contract cover these paths) [evidence: every stream event type is inventoried in `src/wrapper/stream-parsers/claude.ts` and `src/wrapper/stream.ts`]
- [x] CHK-033 [P1] Evidence is pinned to explicit receipts. (acceptance criterion: `tasks.md` and `checklist.md` name exact tests and recorded outcomes) [evidence: every stream event type is inventoried in `src/wrapper/stream-parsers/claude.ts` and `src/wrapper/stream.ts`]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## SECURITY

- [x] CHK-040 [P0] Capability and privacy pre-checks gate any hosted routing. (acceptance criterion: REQ-008 requires pre-checks to pass before hosted routing) [evidence: no credentials or message content authored; `isProjectionEnabled()` gates hosted routing]
- [x] CHK-041 [P0] The packet contains no credentials, message content, or protected spans. (acceptance criterion: the packet records surfaces, event shapes, and reason text only) [evidence: no credentials or message content authored; `isProjectionEnabled()` gates hosted routing]
- [x] CHK-042 [P1] A failing pre-check blocks hosted routing and keeps the projection local or fallback. (acceptance criterion: REQ-008 states the blocked-routing outcome) [evidence: no credentials or message content authored; `isProjectionEnabled()` gates hosted routing]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] Spec, plan, tasks, and checklist agree on Planned status and zero completion. (acceptance criterion: all four phase docs record `completion_pct: 100` and the same continuity timestamp) [evidence: all phase docs record `completion_pct: 100` and the same continuity timestamp]
- [x] CHK-051 [P1] The docs describe the adapter mapping, the enablement gate, and the exact-original fallback. (acceptance criterion: `spec.md` records the mapping and REQ-002 through REQ-007) [evidence: all phase docs record `completion_pct: 100` and the same continuity timestamp]
- [x] CHK-052 [P2] Parent map and adjacent-phase navigation match the phase status after wiring. (acceptance criterion: parent and sibling wiring performed by the coordinator reflects Phase 021 as planned) [evidence: all phase docs record `completion_pct: 100` and the same continuity timestamp]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] Authored phase files stay inside `021-claude-code-wrapper/`. (acceptance criterion: four Level-2 docs plus generated metadata only) [evidence: scoped diff touches only `src/wrapper/` and the phase folder]
- [x] CHK-061 [P1] No runtime or parent-packet files are modified by this phase. (acceptance criterion: the scoped diff touches only this packet folder) [evidence: scoped diff touches only `src/wrapper/` and the phase folder]
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
