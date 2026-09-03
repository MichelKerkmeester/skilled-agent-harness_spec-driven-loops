---
title: "Tasks: Phase 5: external-cli provider"
description: "Task list for the external-cli provider family, transport, tests, and the catalog and playbook references."
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/002-sk-communication-triggers/005-external-cli-provider"
    last_updated_at: "2026-08-19T07:35:00.000Z"
    last_updated_by: "claude"
    recent_action: "Executed T-001 through T-011"
    next_safe_action: "Reconcile parent metadata and validate"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-005-external-cli-provider"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
trigger_phrases: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: external-cli provider

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` complete, `[ ]` open. Each task names its verification.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001 Add the `EXTERNAL_CLI` family and adapter case. Verify: typecheck compiles the exhaustive switch.
- [x] T-002 Add the registry family/protocol compatibility clause. Verify: preset record validates.
- [x] T-003 Add and export `createExternalCliModelRecord`. Verify: import smoke and preset test.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-004 Create `createExternalCliTransport` mapping a wire request to a CLI invocation. Verify: seam test returns candidate and fail-closed responses.
- [x] T-005 Create `createChildProcessCliRunner` with an injected spawn boundary. Verify: argv, stdin, and timeout tests.
- [x] T-006 Export the transport API through the barrel. Verify: import smoke resolves the new symbols.
- [x] T-007 Cover preset validity, privacy routing, adapter body, and end-to-end candidate and fallback. Verify: `test/providers/external-cli.test.ts` passes.
- [x] T-008 Cover transport seam, engine resolution, argv, timeout, and stdout. Verify: `test/transports/cli.test.ts` passes.
- [x] T-009 Author and register the feature-catalog entry and playbook scenario. Verify: indexes list them and links resolve.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-010 Run the full package gate. Verify: typecheck 0, build 0, 78 files / 427 tests pass, import smoke OK.
- [x] T-011 Run `validate.sh --strict` on every touched spec folder. Verify: zero errors.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The external-cli provider builds and routes through the real pipeline, the package gate is green, and the catalog and playbook reference the new adapter code.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Package: `.opencode/skills/sk-communication/cli-communication-projection/`
- Parent: `../spec.md`
<!-- /ANCHOR:cross-refs -->
