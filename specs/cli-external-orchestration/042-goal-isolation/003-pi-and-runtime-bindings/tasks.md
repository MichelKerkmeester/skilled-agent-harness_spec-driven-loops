---
title: "Tasks: Pi and Runtime Goal Bindings"
description: "Tasks for end-to-end native session binding and runtime support reconciliation."
trigger_phrases:
  - "pi goal binding tasks"
  - "runtime adapter goal tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/042-goal-isolation/003-pi-and-runtime-bindings"
    last_updated_at: "2026-08-10T14:34:30Z"
    last_updated_by: "codex"
    recent_action: "Completed every runtime-binding task with focused and live evidence"
    next_safe_action: "Hand the native binding contract to the legacy cutover phase"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Pi and Runtime Goal Bindings

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Complete with evidence |
| `[B]` | Blocked by native capability |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Reconcile Pi identity and management design with Phase 1 evidence.
  - Evidence: lifecycle and registered-command contexts expose `sessionManager.getSessionId()`; the current prompt-to-shell path does not.
- [x] T002 Add failing fake-context A/B and missing-id tests.
  - Evidence: `node --test` ran the expanded negative control with 27 tests, 18 pass and 9 exact binding failures before adapter changes.
- [x] T003 Pass native Pi session id through every lifecycle operation.
  - Evidence: 32/32 adapter tests cover input, session start, turn end, resume, fork/new id, and missing identity.
- [x] T004 Implement current-session set/show/mutate management.
  - Evidence: the registered `/goal-pi` handler obtains `getSessionId()` and 32/32 tests cover set, show, pause, resume, complete, history, scope override resistance, and missing-id failure.
- [x] T005 Run set-then-inject and turn-end non-owner canaries.
  - Evidence: 32/32 tests prove A/B injection and Session B byte equivalence during Session A turn end.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Bind and test Cursor injection identity.
  - Evidence: Cursor uses `session_id` with `conversation_id` fallback; 13/13 Cursor adapter rows pass including A/B and missing-id cases.
- [x] T007 Bind Cursor management or mark the surface unsupported.
  - Evidence: `.cursor/commands/goal-cursor.md` returns `UNSUPPORTED_SESSION_BINDING` and tests prove it never invokes the unbound CLI.
- [x] T008 Remove stale Devin goal-support claims and verify no adapter registration remains.
  - Evidence: `.devin/hooks.v1.json` parses with zero goal registrations, no Devin goal adapter exists, and current goal docs already state decommissioned support.
- [x] T009 Confirm OpenCode remains unchanged and Claude/Codex claims stay accurate.
  - Evidence: the committed OpenCode control passes 119/119; no Claude or Codex adapter or management surface was added.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run same-id/different-runtime, missing-id, resume, and fork tests.
  - Evidence: 74/74 integrated core/CLI/adapter tests pass the complete identity matrix.
- [x] T011 Parse all modified runtime registrations and verify every referenced file exists.
  - Evidence: `node --check` and JSON parse probes exit 0 for Cursor and Devin; the Cursor target exists and the Pi adapter symlink resolves.
- [x] T012 Run live two-session Pi canaries with raw transcript inspection when safe.
  - Evidence: two isolated real Pi invocations produced `PI_TWO_SESSION_CANARY=PASS` with two scoped files and distinct A/B objectives. No model transcript was generated because registered commands short-circuit before a model turn; input transcript behavior is covered headlessly.
- [x] T013 Record the Phase 4 handoff and whether Pi is technically safe to re-enable.
  - Evidence: Pi native command/load canary passes and `tsc --noEmit` exits 0; policy keeps the extension disabled until Phase 5 integrated acceptance.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Every supported runtime has end-to-end current-session binding.
- [x] No supported management path uses a global or process-current pointer.
- [x] Adapter, registration, and isolation checks pass.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Core**: `../002-session-scoped-core/spec.md`
<!-- /ANCHOR:cross-refs -->
