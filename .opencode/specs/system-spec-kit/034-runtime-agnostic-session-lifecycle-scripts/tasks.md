---
title: "Tasks: Runtime-agnostic session lifecycle scripts"
description: "Task tracker for making the lifecycle scripts runtime-agnostic."
trigger_phrases:
  - "runtime-agnostic lifecycle tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/034-runtime-agnostic-session-lifecycle-scripts"
    last_updated_at: "2026-05-30T11:35:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Task list authored"
    next_safe_action: "Execute Phase 1 (post-commit messaging)"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Runtime-agnostic session lifecycle scripts

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
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
## Phase 1: Messaging
- [ ] T001 Neutralize post-commit messaging L5 + L70 (`.opencode/scripts/git-hooks/post-commit`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Sweeper generalization (closes REQ-001)
- [ ] T002 Rename tree builder + var to session-neutral (`orphan-mcp-sweeper.sh`)
- [ ] T003 Multi-runtime preserve regex (claude|opencode|codex|gemini)
- [ ] T004 Add operator-session preserves: opencode run / codex exec / gemini
- [ ] T005 Rename preserve-reason string live-session-tree
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Rename + generalize cleanup
- [ ] T006 git mv claude-session-cleanup.sh → session-cleanup.sh
- [ ] T007 Multi-runtime PID fallback + neutral log env/comments
- [ ] T008 Create back-compat shim claude-session-cleanup.sh
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Per-runtime wiring
- [ ] T009 Claude: committed .claude/settings.json Stop → session-cleanup.sh; de-dupe local
- [ ] T010 Gemini: append cleanup to .gemini/settings.json SessionEnd
- [ ] T011 OpenCode: .opencode/plugins/session-cleanup.js dispose bridge
- [ ] T012 Document Codex/Devin sweeper-fallback
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Docs + verification
- [ ] T013 Update README + feature_catalog + playbook to new name
- [ ] T014 shellcheck / bash -n clean
- [ ] T015 Sweeper dry-run preserves a live opencode run tree (REQ-001 proof)
- [ ] T016 Claude Stop + Gemini SessionEnd + OpenCode dispose smoke
- [ ] T017 validate.sh --strict exit 0
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
- [ ] REQ-001 (opencode-run preserve) proven
- [ ] Claude cleanup unchanged
- [ ] Cleanup wired per runtime by capability
- [ ] No `[B]` blocked tasks remaining
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
