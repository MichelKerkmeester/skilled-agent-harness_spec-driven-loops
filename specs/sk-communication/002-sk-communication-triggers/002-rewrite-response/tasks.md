---
title: "Tasks: Phase 2: rewrite-response command"
description: "Task list for authoring and verifying the /rewrite-response in-context self-rewrite command."
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-communication/002-sk-communication-triggers/002-rewrite-response"
    last_updated_at: "2026-08-19T04:41:42Z"
    last_updated_by: "claude"
    recent_action: "Executed T-001 through T-006"
    next_safe_action: "Proceed to phase 003"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-002-rewrite-response"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
trigger_phrases: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: rewrite-response command

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` complete, `[ ]` open. Each task names its verification.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001 Confirm the sk-create-command standard and the plain-English rubric source. Verified by reading `COPY_EDITING_INSTRUCTION` in `src/config/local-provider.ts`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-002 Author `.opencode/commands/rewrite-response.md` to template with the self-contained rubric, `--show-original` flag, and structured status.
- [x] T-003 Create the `.claude` and `.cursor` symlink mirrors.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-004 `check_authored_name_kebab.py` exits 0 (PASS kebab-case).
- [x] T-005 `validate_document.py --type command` exits 0 (VALID, 0 issues).
- [x] T-006 Both symlink mirrors resolve to the canonical file.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All tasks complete; both validators exit 0; mirrors resolve; no LLM or file write occurs at runtime.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Command: `.opencode/commands/rewrite-response.md`
- Parent: `../spec.md`
<!-- /ANCHOR:cross-refs -->
