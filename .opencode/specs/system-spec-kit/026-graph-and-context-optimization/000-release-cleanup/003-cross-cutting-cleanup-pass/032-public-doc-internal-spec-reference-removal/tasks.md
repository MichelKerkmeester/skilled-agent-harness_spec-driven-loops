---
title: "Tasks: Public Doc Internal Spec Reference Removal [template:level_2/tasks.md]"
description: "Task list for removing internal spec packet path leaks from public-facing documentation and assets."
trigger_phrases:
  - "public docs"
  - "internal spec references"
  - "tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/003-cross-cutting-cleanup-pass/032-public-doc-internal-spec-reference-removal"
    last_updated_at: "2026-05-18T09:12:49Z"
    last_updated_by: "codex"
    recent_action: "Completed cleanup and scoped verification searches"
    next_safe_action: "Ready for final handoff"
    blockers: []
    key_files:
      - "README.md"
      - ".opencode/commands/"
      - ".opencode/install_guides/"
      - ".opencode/skills/"
    session_dedup:
      fingerprint: "sha256:8b8f9aaf1c5c269d7f9523e956e2b249ff458c5080105ba3461b151211a7eb60"
      session_id: "public-doc-internal-spec-reference-removal-2026-05-18"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "New spec folder path selected by user."
      - "Generic spec-root examples remain where they describe user-selected Spec Kit workflow paths."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Public Doc Internal Spec Reference Removal

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

- [x] T001 Create Level 2 cleanup packet under `000-release-cleanup/003-cross-cutting-cleanup-pass/032-public-doc-internal-spec-reference-removal`
- [x] T002 [P] Inventory public-facing command, setup, README, skill, asset, feature catalog, and manual playbook surfaces
- [x] T003 [P] Identify concrete internal spec packet path patterns
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Replace hardcoded command upstream packet paths with local command contract wording
- [x] T005 Remove root README and setup guide internal packet links
- [x] T006 Replace internal provenance paths in skill references, assets, feature catalogs, and playbooks
- [x] T007 Restore accidental out-of-scope runtime edits discovered during diff review
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Rerun concrete internal path search over scoped public docs
- [x] T009 Review remaining generic placeholders and document intentional leftovers
- [x] T010 Run strict validation for this cleanup packet
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Static search and strict spec validation passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
