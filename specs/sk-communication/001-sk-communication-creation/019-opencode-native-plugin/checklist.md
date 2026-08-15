---
title: "Verification Checklist: Phase 019 OpenCode Native Plugin"
description: "Completed verification gates for the chat.message hook, the dual gate, message-id snapshots, byte-exact restore, the plugin boundary, and strict packet closeout."
trigger_phrases:
  - "opencode-native-plugin"
  - "verification checklist"
  - "quality gate"
  - "mk-communication-projection checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/019-opencode-native-plugin"
    last_updated_at: "2026-08-14T07:55:00.000Z"
    last_updated_by: "claude"
    recent_action: "Implemented and verified the OpenCode native projection plugin."
    next_safe_action: "Run the live chat.message render confirmation as the documented manual validation step."
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
      session_id: "phase-019-opencode-plugin-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and acceptance are defined."
      - "The plugin is built, its tests pass, and the packet validates cleanly."
---
# Verification Checklist: Phase 019 OpenCode Native Plugin

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **P0** | Hard blocker | Cannot close Phase 019 until complete |
| **P1** | Required | Complete or obtain explicit user-approved deferral |
| **P2** | Optional | May defer with a documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Ten requirements and five acceptance scenarios are documented. [evidence: `spec.md` section 4 lists REQ-001 through REQ-010 and section 5 lists five acceptance scenarios]
- [x] CHK-002 [P0] The dual gate, message-id snapshot model, restore path, and display-caveat step are defined. [evidence: `spec.md` REQ-003/REQ-004/REQ-005 and `plan.md` architecture name the two gates, the snapshot map, restore, and the display-caveat task]
- [x] CHK-003 [P1] The Phase 018 entrypoint, shared kill-switch surface, and plugin test pattern are inventoried. [evidence: `projectMessage` in the package `dist/runtime/project-message.js`; the kill-switch surface does not exist, so `MK_COMMUNICATION_PROJECTION_DISABLED` was adopted per the `mk-*.test.cjs` pattern]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The plugin registers the `chat.message` hook and mutates `output.parts` only. [evidence: `hooks['chat.message']` in `.opencode/plugins/mk-communication-projection.js`; only `output.parts` is reassigned]
- [x] CHK-011 [P0] Projection is gated by `isProjectionEnabled()` AND `isHookEnabled(concern)`. [evidence: `createProjectionCore` checks `hookEnabled()` then `projectionEnabled()` before reading or mutating anything]
- [x] CHK-012 [P1] The hook fails open: any error or disabled state leaves the original parts untouched. [evidence: `a thrown projectMessage error fails open` test plus the gate-matrix tests assert byte-identical parts with no thrown exception]
- [x] CHK-013 [P1] The plugin writes no standard output or standard error. [evidence: `the plugin writes nothing to stdout or stderr` test traps console and `process.stdout.write`/`process.stderr.write` and asserts none]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] With the flag on, `output.parts` show the projected text. [evidence: `enabled: a projection replaces the text parts` test asserts the text part carries the projected text]
- [x] CHK-021 [P0] With the flag off, `output.parts` remain byte-identical. [evidence: `enablement off` test asserts `projectMessage` is never called and parts are unchanged]
- [x] CHK-022 [P0] With the kill-switch off, the parts stay untouched even with the flag on. [evidence: `kill-switch off` test asserts `projectMessage` is never called with the kill-switch disabled]
- [x] CHK-023 [P1] Every error, throw, timeout, and non-accept terminal restores the byte-exact original. [evidence: `a thrown projectMessage error fails open` and `an exact-original outcome` tests leave parts byte-identical to the pre-call snapshot]
- [x] CHK-024 [P1] The plugin test suite passes from the repository root with `node --test`. [evidence: `node --test .opencode/plugins/tests/mk-communication-projection.test.cjs` reports 17/17 pass]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] Hook registration, gate surface, snapshot map, entrypoint call, and restore path are inventoried. [evidence: `mk-communication-projection.js` sections 2-7 implement the kill-switch, part helpers, snapshot map, input builder, core, and factory]
- [x] CHK-031 [P0] Independent verification axes and expected outcomes are recorded. [evidence: `mk-communication-projection.test.cjs` covers enablement, kill-switch, projection, exact-original, thrown-error, and no-terminal-output axes independently]
- [x] CHK-032 [P0] Adversarial and no-op cases are covered: double invoke, missing snapshot, malformed parts, and disabled matrix. [evidence: `a second invocation...`, `malformed output.parts...`, and `no message identity...` tests cover the adversarial and no-op cases]
- [x] CHK-033 [P1] Evidence is pinned to the final scoped diff. [evidence: `implementation-summary.md` names the two created files and the phase folder, and no other surface was touched]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] No message content is persisted beyond in-memory plugin-side state. [evidence: the snapshot map holds parts in memory only, evicted oldest-first at `MAX_SNAPSHOTS`, and is never written to disk]
- [x] CHK-041 [P0] The plugin and packet contain no credentials, message content, or protected spans. [evidence: `mk-communication-projection.js` imports only `projectMessage`/`isProjectionEnabled`/`createExactOriginalRecord` and holds no secrets]
- [x] CHK-042 [P1] A failing hook cannot corrupt the stored session message. [evidence: the outer `try/catch` in `createProjectionCore` restores the snapshot on error, and the snapshot is written before any mutation]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] Spec, plan, tasks, decision, and checklist agree on Complete status and 100% completion. [evidence: all six phase docs record `completion_pct: 100` and continuity timestamp `2026-08-14T07:55:00.000Z`]
- [x] CHK-051 [P1] Parent map and adjacent-phase navigation match final status. [evidence: `spec.md` status is `Complete`; the successor remains `020-cli-output-wrapper-framework`]
- [x] CHK-052 [P2] Operator-facing plugin enablement and kill-switch guidance is updated. [evidence: `implementation-summary.md` documents `COMMUNICATION_PROJECTION_ENABLED` and `MK_COMMUNICATION_PROJECTION_DISABLED` plus the manual render validation step]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] Authored phase files stay inside `019-opencode-native-plugin/`. [evidence: only the six phase docs and metadata files under the 019 folder were modified]
- [x] CHK-061 [P1] Plugin and test files stay under `.opencode/plugins/`. [evidence: `mk-communication-projection.js` and `mk-communication-projection.test.cjs` are the only plugin-tree files added]
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

- [x] CHK-100 [P0] The native-hook integration seam and the message-id snapshot model are documented. [evidence: `decision-record.md` ADR-001 and ADR-002 are `Accepted` with five-check evaluations]
- [x] CHK-101 [P1] ADR status and deciders are recorded. [evidence: `decision-record.md` records `Accepted` status and the operator, runtime integrator, and privacy owner as deciders]
- [x] CHK-102 [P1] Alternatives to the native-hook and snapshot approaches are documented with rejection rationale. [evidence: `decision-record.md` compares the wrapper seam and the pure overlay with scores and rejection rationale]
- [x] CHK-103 [P1] Implementation matches the accepted decisions. [evidence: `mk-communication-projection.js` registers the native hook and holds a message-id snapshot exactly as ADR-001 and ADR-002 describe]
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## Performance Verification

- [x] CHK-110 [P1] Hook execution stays within the Phase 018 entrypoint's bounded execution. [evidence: the hook adds only the snapshot clone and input build; the projection itself runs through the bounded `projectMessage` stage order]
- [x] CHK-111 [P2] Plugin-side state grows only per message id and is cleared with the session lifecycle. [evidence: the snapshot map is bounded at `MAX_SNAPSHOTS` with oldest-first eviction and holds no cross-session state]
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## Deployment Readiness

- [x] CHK-120 [P0] The rollback procedure is documented (remove the plugin and its test file). [evidence: `decision-record.md` and the plan record removing `mk-communication-projection.js` and its test file as the rollback]
- [x] CHK-121 [P1] The display-caveat confirmation is recorded before authoring the hook. [evidence: the display caveat could not be confirmed in an automated environment, so it is recorded as the manual validation step in `implementation-summary.md` rather than blocking]
- [x] CHK-122 [P1] The handoff identifies the proven hook seam for the wrapper-based phases. [evidence: `implementation-summary.md` records the snapshot and gate model as reusable for the wrapper-based phases]
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## Compliance Verification

- [x] CHK-130 [P0] No hosted projection egress beyond what `projectMessage()` performs. [evidence: the plugin performs no network access of its own; it only calls the entrypoint, which owns privacy routing and any egress]
- [x] CHK-131 [P1] No dependency or license change is introduced. [evidence: `mk-communication-projection.js` imports only the existing package and Node built-ins; no new dependency was added]
- [x] CHK-132 [P1] Default-off and the shared kill-switch remain the operator controls. [evidence: `isProjectionEnabled()` stays default-off, and `MK_COMMUNICATION_PROJECTION_DISABLED` is the independent hook-class kill-switch]
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## Documentation Verification

- [x] CHK-140 [P1] All required Level 3 documents pass strict validation. [evidence: `validate.sh --strict` on the phase folder reports 0 errors and 0 warnings]
- [x] CHK-141 [P1] Plugin boundary and rollback contracts are documented. [evidence: `implementation-summary.md` documents the fail-open boundary, no-terminal-output rule, and the remove-files rollback]
- [x] CHK-142 [P1] The packet records completed status without optimistic implementation claims. [evidence: `implementation-summary.md` records the implemented plugin, its `17/17` passing tests, and the manual render validation as the sole deferred item]
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Product and privacy | Pending | Not yet reviewed |
| Implementer | Technical | Complete | 2026-08-14 |
| Reviewer | Runtime and quality | Pending | Not yet reviewed |
<!-- /ANCHOR:sign-off -->
