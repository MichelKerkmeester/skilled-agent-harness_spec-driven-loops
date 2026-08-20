---
title: "Tasks: Phase 7: rewrite command namespace rename"
description: "Task list for relocating the two trigger commands into the rewrite/ namespace and updating functional references."
importance_tier: "supporting"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/002-sk-communication-triggers/007-command-namespace-rename"
    last_updated_at: "2026-08-19T20:34:00.000Z"
    last_updated_by: "claude"
    recent_action: "Executed T-001 through T-004"
    next_safe_action: "Validate the packet recursively"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-007-command-namespace-rename"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 7: rewrite command namespace rename

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` complete, `[ ]` open. Each task names its verification.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001 Create `.opencode/commands/rewrite/` and `git mv` both command files into it, dropping the `rewrite-` prefix. Verify: new paths exist, flat paths gone, `git status` shows renames.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-002 Update the invocation strings inside both command files to the colon-namespaced form. Verify: each file contains `/rewrite:response` and no `/rewrite-response`.
- [x] T-003 Update the `SKILL.md` trigger list and the feature-catalog reference. Verify: both use the colon-namespaced invocation.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-004 Confirm no functional surface references the old flat invocation and validate the packet. Verify: a `/rewrite-response` search over the functional surfaces is empty and `validate.sh` runs clean recursively.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

Both commands live under `.opencode/commands/rewrite/`, invoke as `/rewrite:response` and `/rewrite:response-by-external-agent`, no functional surface references the old flat names, and the packet validates recursively.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Commands: `.opencode/commands/rewrite/`
- Predecessor: `../006-external-cli-runtime-wiring/`
- Parent: `../spec.md`
<!-- /ANCHOR:cross-refs -->
