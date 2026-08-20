---
title: "Tasks: Delete the sk-design hub and interface commands"
description: "Task breakdown for the scoped, operator-gated deletion of the sk-design judgment hub and the interface command namespace."
trigger_phrases:
  - "delete sk-design hub tasks"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/016-deprecate-sk-design-interface/005-delete-hub-and-interface-commands"
    last_updated_at: "2026-08-19T12:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Deleted sk-design hub (328) + interface commands (8); survivor proven green first"
    next_safe_action: "Phase 006: repo-wide reference cleanup and reconcile"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/"
      - ".opencode/commands/interface/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Tasks: Delete the sk-design hub and interface commands

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the extraction-before-deletion invariant: survivor present at `.opencode/skills/sk-design-md-generator/`, backend suite 173/173, Class-S PASS on the new root.
- [x] T002 Grep the survivor for any residual dependency on the doomed hub (`skills/sk-design/`, `../shared`) — returns NONE, so the delete strands nothing inside the survivor.
- [x] T003 Confirm `/interface:design-reference` was already rebound to `/design:design-reference` in a prior phase, so deleting `commands/interface/` drops no still-needed capability.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Delete `.opencode/skills/sk-design/` — the parent hub, `sk-design-interface/`, the retired foundations/motion/audit design modes, `shared/`, `benchmark/`, and styles remnants (328 tracked deletions).
- [x] T005 Delete `.opencode/commands/interface/` — `design.md`, `design-reference.md`, and the auto/confirm/presentation assets (8 tracked deletions).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 `test -d .opencode/skills/sk-design` → absent; `test -d .opencode/commands/interface` → absent.
- [x] T007 Survivor untouched: `sk-design-md-generator/SKILL.md` present; `/design:` rebind directory present; 0 refs from the survivor back to the deleted hub.
- [x] T008 Scoped diff: `git status --porcelain` shows the 336 deletions confined to `.opencode/skills/sk-design/` (328) and `.opencode/commands/interface/` (8); concurrent unrelated dirty work (sk-code-mobile-cli, runtime databases) is excluded from this phase's scope.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All 8 tasks (T001–T008) marked `[x]`
- [x] `.opencode/skills/sk-design/` absent (328 deletions) and `.opencode/commands/interface/` absent (8 deletions)
- [x] Survivor green and detached (0 dangling refs back to the hub)
- [x] Deletion is reversible while uncommitted (`git checkout --` both trees); nothing committed or pushed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
