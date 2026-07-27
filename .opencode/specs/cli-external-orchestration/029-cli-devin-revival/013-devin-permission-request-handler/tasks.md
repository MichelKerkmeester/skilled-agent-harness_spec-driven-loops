---
title: "Tasks: Devin PermissionRequest handler"
description: "Task breakdown for the real PermissionRequest adapter, its registration, and its process-level plus live verification."
trigger_phrases:
  - "devin permission request handler tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/013-devin-permission-request-handler"
    last_updated_at: "2026-07-27T10:15:00Z"
    last_updated_by: "codex"
    recent_action: "Local implementation and verification complete; live probe unavailable."
    next_safe_action: "Re-run the live devin -p probe when the Devin log directory is writable."
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "devin-permission-request-handler"
      parent_session_id: null
    completion_pct: 0
    open_questions: ["Can devin -p be re-run after restoring a writable Devin log directory?"]
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Devin PermissionRequest handler

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Create `permission-request-policy.mjs` skeleton: stdin parse, fail-closed on malformed input/missing identity. [EVIDENCE: `node --check .opencode/skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs` passes; malformed-input and missing-identity rows deny.]
- [x] T002 Implement write-class classification delegating to `guardCore.isExemptTargetPath`. [EVIDENCE: adapter imports and calls the shared export; write-allow and write-deny rows pass.]
- [x] T003 Implement exec-class classification delegating to `dispatch-rule-checks.mjs`'s `readHardRules`/`evaluate`. [EVIDENCE: adapter imports both shared exports; exec-allow and exec-deny rows pass.]
- [x] T004 Implement default-deny for any `tool_name`/shape matching neither class. [EVIDENCE: unclassifiable-deny row passes.]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Register the adapter in `.devin/hooks.v1.json`'s `PermissionRequest` array using the documented nested `{matcher, hooks:[{type,command,timeout}]}` shape. [EVIDENCE: JSON parses successfully and the array contains the empty matcher plus the wrapped adapter command.]
- [x] T006 Build `permission-request-policy.test.mjs` with write-allow, write-deny, exec-allow, exec-deny, unclassifiable-deny, malformed-input, and missing-identity rows. [EVIDENCE: `node --test .opencode/skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.test.mjs` reports 2/2 tests passed.]
- [x] T007 Confirm the suite is discriminating (at least one row fails against a naive always-allow stub). [EVIDENCE: five deny rows mismatch the naive always-allow result; comparison is recorded in `implementation-summary.md`.]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Live-probe via `devin -p` with a real approval-needing tool call (backup/dispatch/restore `.devin/hooks.v1.json` around a temporary stdin/stdout-capturing wrapper). [EVIDENCE: captured real payloads for `write` and `exec` tool calls; the adapter correctly returned `{"decision":"approve","permissionDecision":"allow"}` for an exempt `/tmp` target in both cases. Devin itself still rejected both calls under default `--permission-mode auto` with its own non-interactive-mode message, ignoring the hook's decision -- confirmed a CLI-runtime limitation, not an adapter defect (see T008b and implementation-summary.md).]
- [ ] T008b Confirm whether ANY devin permission mode actually honors the PermissionRequest hook's decision for the final approval outcome. [EVIDENCE: NOT MET as originally envisioned -- `--permission-mode auto` fires the hook but ignores its answer (always denies write/exec); `--permission-mode dangerous` never fires the hook (always allows without consultation); `--permission-mode autonomous --sandbox` blocks at the OS sandbox layer before the hook's answer would matter. No tested mode lets the hook's decision control the outcome. Escalated to the operator in implementation-summary.md as a devin CLI limitation affecting REQ-002/REQ-006, not something further adapter work can fix.]
- [x] T009 Run the shared spec-gate core suite and `dispatch-rule-checks` suite to confirm no regression from composing them. [EVIDENCE: with inherited `AI_SESSION_CHILD` removed, `node --experimental-test-module-mocks --test ...` reports spec-gate core 73/73 and dispatch-rule checks 6/6.]
- [ ] T010 Run phase 013 strict and recursive parent strict validation. [EVIDENCE: pending final validation run after this documentation update.]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0/P1 tasks have command-backed evidence. [EVIDENCE: T008 remains unverified because the local Devin binary cannot initialize its log file.]
- [x] No blocked implementation tasks remain. [EVIDENCE: the implementation and local verification tasks are complete; live verification is an explicitly documented environment limitation, not an adapter defect.]
- [ ] Runtime, configuration, docs, and recursive packet gates pass. [EVIDENCE: local runtime/configuration/sk-code checks pass; strict packet validation is pending.]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Verification**: `checklist.md`
<!-- /ANCHOR:cross-refs -->
