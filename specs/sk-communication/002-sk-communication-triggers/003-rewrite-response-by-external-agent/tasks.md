---
title: "Tasks: Phase 3: rewrite-response-by-external-agent command"
description: "Task list for authoring and verifying the one-shot engine-choice projection command."
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-communication/002-sk-communication-triggers/003-rewrite-response-by-external-agent"
    last_updated_at: "2026-08-19T04:54:45Z"
    last_updated_by: "claude"
    recent_action: "Executed T-001 through T-006"
    next_safe_action: "Update SKILL note and mirrors in phase 004"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-003-rewrite-response-by-external-agent"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: rewrite-response-by-external-agent command

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` complete, `[ ]` open. Each task names its verification.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001 Confirm the engine roster, runnable entrypoint, and activation gate from phase 001.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-002 Author the mandatory engine gate and the three engine branches.
- [x] T-003 Author the ON→run→OFF mechanism section with inline scoping and a trap fallback.
- [x] T-004 Create the `.claude` and `.cursor` mirrors.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-005 `check_authored_name_kebab.py` and `validate_document.py --type command` both exit 0.
- [x] T-006 Confirm no projection package source was modified.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All tasks complete; both validators exit 0; the flag never persists; no package source changed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Command: `.opencode/commands/rewrite-response-by-external-agent.md`
- Parent: `../spec.md`
<!-- /ANCHOR:cross-refs -->
