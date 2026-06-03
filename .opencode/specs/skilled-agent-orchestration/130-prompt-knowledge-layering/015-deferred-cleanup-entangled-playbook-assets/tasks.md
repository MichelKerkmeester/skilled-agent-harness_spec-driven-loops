---
title: "Tasks: deferred-cleanup-entangled-playbook-assets"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "deferred cleanup tasks"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "130-prompt-knowledge-layering/015-deferred-cleanup-entangled-playbook-assets"
    last_updated_at: "2026-06-03T13:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Entangled docs landed; playbook repointed; asset dividers removed"
    next_safe_action: "Validate then commit phase 015"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "e02c3e95-f865-4fec-8ff8-0a7907486924"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: deferred-cleanup-entangled-playbook-assets

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Cross-check cli-devin permission-mode count against `cli-devin/README.md` (2 modes)
- [x] T002 Confirm `sk-prompt-small-model/assets/model-profiles.json` exists and the old `sk-prompt/assets/` path does not
- [x] T003 Enumerate the 9 dangling playbook card paths and the 6 asset leading dividers
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Land cli-devin/cli_reference.md permission-mode dedup + fix version-drift wording to 2-mode
- [x] T005 Land cli-devin/quota-fallback.md (model-profiles.json repoint + dividers)
- [x] T006 Land cli-opencode/cli_reference.md (MiniMax-M3 row + dividers)
- [x] T007 Repoint the 9 dangling card paths in `sk-prompt/manual_testing_playbook/**` to the hub
- [x] T008 Remove the leading `---` before section 1 in the 6 asset docs
- [x] T009 Version bumps + changelogs for cli-devin, cli-opencode, cli-claude-code, cli-codex, cli-gemini, sk-prompt
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Content-skeleton diff on the 3 entangled docs shows only the intended content edits
- [x] T011 grep: 0 old card paths in the playbook; both hub paths resolve on disk
- [x] T012 [P] first-H2 check: 6 assets carry no leading `---`; strict divider scout +0
- [x] T013 `validate.sh --recursive --strict` exit 0; card-sync guard green
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
