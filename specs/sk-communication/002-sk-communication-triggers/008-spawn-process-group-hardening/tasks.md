---
title: "Tasks: Phase 8: spawn process-group hardening"
description: "Task list for hardening the external-cli spawn boundary to group-kill on timeout and abort, with real-subprocess tests."
importance_tier: "supporting"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/002-sk-communication-triggers/008-spawn-process-group-hardening"
    last_updated_at: "2026-08-20T05:52:00.000Z"
    last_updated_by: "claude"
    recent_action: "Executed T-001 through T-004"
    next_safe_action: "Validate the packet recursively"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-008-spawn-process-group-hardening"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 8: spawn process-group hardening

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` complete, `[ ]` open. Each task names its verification.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001 Add real-subprocess tests for timeout teardown, abort teardown, and the normal stdin/stdout path. Verify: the tests run and the two teardown cases fail against the current code.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-002 Spawn the child detached so it leads its own process group. Verify: typecheck and build pass.
- [x] T-003 Route timeout and abort through a whole-group SIGKILL with a direct-child fallback. Verify: the timeout and abort tests now pass.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-004 Run the full package gate. Verify: typecheck 0, build 0, 80 files / 442 tests pass, import smoke OK.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The spawn boundary group-kills on timeout and abort, a forked helper does not survive either, the normal path is unchanged, and the package gate is green.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Package: `.opencode/skills/sk-communication/cli-communication-projection/`
- Predecessor: `../007-command-namespace-rename/`
- Parent: `../spec.md`
<!-- /ANCHOR:cross-refs -->
