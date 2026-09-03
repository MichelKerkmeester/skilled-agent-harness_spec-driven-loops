---
title: "Tasks: Phase 6: external-cli runtime wiring"
description: "Task list for the external-cli entrypoint, per-engine command table, projection module, tests, and command 2 Branch B adoption."
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/002-sk-communication-triggers/006-external-cli-runtime-wiring"
    last_updated_at: "2026-08-19T20:34:00.000Z"
    last_updated_by: "claude"
    recent_action: "Executed T-001 through T-010"
    next_safe_action: "Reconcile parent metadata and validate recursively"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-006-external-cli-runtime-wiring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
trigger_phrases: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6: external-cli runtime wiring

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` complete, `[ ]` open. Each task names its verification.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001 Add `resolveCliEngineCommand` for the six cli-* engines. Verify: engine-table test asserts argv and env per engine.
- [x] T-002 Close stdin unconditionally in `defaultChildProcessSpawn`. Verify: typecheck plus the prompt-arg spawn test asserting `input` is null.
- [x] T-003 Export the engine table through the transports barrel. Verify: import smoke resolves `resolveCliEngineCommand` and `CliEngineIds`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-004 Add `runExternalCliProjection` building the external-cli `projectMessage` inputs. Verify: module candidate and fallback tests.
- [x] T-005 Export the projection module through the runtime barrel. Verify: import smoke resolves `runExternalCliProjection`.
- [x] T-006 Add the `bin/external-cli-project.mjs` launcher. Verify: launcher fail-safe smokes for disabled projection and an absent binary.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-007 Cover the engine table argv, unknown engine, and pi provider derivation. Verify: `test/transports/cli-engines.test.ts` passes.
- [x] T-008 Cover the projection module candidate, fallback, disabled, and spawn-boundary paths. Verify: `test/runtime/external-cli-projection.test.ts` passes.
- [x] T-009 Rewrite command 2 Branch B to invoke the entrypoint. Verify: Branch B calls `bin/external-cli-project.mjs` and preserves the display-only and default-off notes.
- [x] T-010 Run the full package gate. Verify: typecheck 0, build 0, 80 files / 439 tests pass, import smoke OK.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The external-cli provider is invocable end-to-end through a runnable entrypoint, the per-engine table resolves all six engines, command 2 Branch B routes through the package pipeline, and the package gate is green.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Package: `.opencode/skills/sk-communication/cli-communication-projection/`
- Predecessor: `../005-external-cli-provider/`
- Parent: `../spec.md`
<!-- /ANCHOR:cross-refs -->
