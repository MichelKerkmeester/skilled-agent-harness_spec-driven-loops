---
title: "Tasks: Public README Update"
description: "Task list for the repository-root README update after system-code-graph extraction."
trigger_phrases:
  - "015 public readme update tasks"
  - "readme standalone mcp topology tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/z_archive/019-code-graph-public-readme-update"
    last_updated_at: "2026-05-14T19:30:00Z"
    last_updated_by: "cli-codex-gpt5.5-xhigh-fast-015"
    recent_action: "Completed README verification; git staging blocked"
    next_safe_action: "Stage from writable shell"
    blockers:
      - ".git/index.lock creation is EPERM in this sandbox"
    key_files:
      - "README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-14-015-public-readme-update"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Public README Update

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

- [x] T001 Run requested pre-check for existing `015-*` child folder.
- [x] T002 Read root `README.md`.
- [x] T003 Read `sk-doc` README creation and validation guidance.
- [x] T004 Read system-code-graph and runtime config evidence.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Update root README overview, quick start, and topology diagram.
- [x] T006 Update Code Graph section to name first-class skill ownership and current `system_code_graph` server.
- [x] T007 Add concise recent shipped work callout for 014 and 038/039 work.
- [x] T008 Update skill index, native MCP table, FAQ, and related links.
- [x] T009 Create 015 Level 1 packet docs and metadata.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run sk-doc README validation.
- [x] T011 Run README local-link and placeholder checks.
- [x] T012 Run strict validation on the 015 packet.
- [x] T013 Attempt scoped staging for only `README.md` and the 015 packet folder.
- [B] T014 Commit blocked because this sandbox cannot create `.git/index.lock`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`.
- [ ] No `[B]` blocked tasks remaining.
- [x] Verification passed and the git metadata limitation is documented.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
