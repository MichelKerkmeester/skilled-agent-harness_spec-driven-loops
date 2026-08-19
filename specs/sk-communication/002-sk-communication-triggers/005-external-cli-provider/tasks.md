---
title: "Tasks: Phase 5: external-cli provider"
description: "Task list for the external-cli provider family, transport, tests, and the catalog and playbook references."
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/002-sk-communication-triggers/005-external-cli-provider"
    last_updated_at: "2026-08-19T05:55:00.000Z"
    last_updated_by: "claude"
    recent_action: "Listed external-cli provider tasks"
    next_safe_action: "Implement family, adapter, preset, transport"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-005-external-cli-provider"
      parent_session_id: null
    completion_pct: 20
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: external-cli provider

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` complete, `[ ]` open. Each task names its verification.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Provider family and record

- [ ] T-001 Add the `EXTERNAL_CLI` family and adapter case. Verify: typecheck compiles the exhaustive switch.
- [ ] T-002 Add the registry family/protocol compatibility clause. Verify: preset record validates.
- [ ] T-003 Add and export `createExternalCliModelRecord`. Verify: import smoke and preset test.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Transport and runner

- [ ] T-004 Create `createExternalCliTransport`. Verify: seam test returns candidate and fail-closed responses.
- [ ] T-005 Create `createChildProcessCliRunner` with an injected spawn boundary and engine table. Verify: argv and timeout tests.
- [ ] T-006 Export the transport API. Verify: import smoke resolves the new symbols.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Tests and pipeline proof

- [ ] T-007 Cover preset validity, privacy routing, and adapter body. Verify: `test/providers/external-cli.test.ts` passes.
- [ ] T-008 Cover end-to-end candidate and exact-original fallback. Verify: executor test asserts both terminals.
- [ ] T-009 Cover transport seam, engine resolution, argv, timeout, stdout. Verify: `test/transports/cli.test.ts` passes.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Verification and references

- [ ] T-010 Run `npm run check`. Verify: exit 0.
- [ ] T-011 Run the sk-code drift guards. Verify: clean packet-scoped delta against the frozen baseline.
- [ ] T-012 Author and register the feature-catalog entry. Verify: index lists it and links resolve.
- [ ] T-013 Author and register the playbook scenario. Verify: index lists it and links resolve.
- [ ] T-014 Run `validate.sh --strict` on every touched spec folder. Verify: zero errors.
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The external-cli provider builds and routes through the real pipeline, `npm run check` is green, the drift-guard delta is clean, and the catalog and playbook reference the new adapter code.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Package: `.opencode/skills/sk-communication/cli-communication-projection/`
- Parent: `../spec.md`
<!-- /ANCHOR:cross-refs -->
