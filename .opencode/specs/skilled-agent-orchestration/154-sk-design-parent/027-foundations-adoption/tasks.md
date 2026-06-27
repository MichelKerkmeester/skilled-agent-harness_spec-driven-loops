---
title: "Tasks: adopt the designer-skills-main foundations findings into sk-design"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "027-foundations-adoption tasks"
  - "sk-design adoption tasks"
  - "designer-skills build tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/027-foundations-adoption"
    last_updated_at: "2026-06-27T11:49:46Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Marked all build tasks complete after verification"
    next_safe_action: "Commit phases 025-027 once all three finalize"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "build-154-027-foundations-adoption"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:

---
# Tasks: adopt the designer-skills-main foundations findings into sk-design

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [x] T001 Create phase folder + scaffold spec/plan/tasks
- [x] T002 Confirm the target files; confirm executor cli-codex gpt-5.5 high fast
- [x] T003 Author the scope-locked codex prompt
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Grid contract + density modes + containment restraint (`design-foundations/.../layout/layout_responsive.md`)
- [x] T005 Theme-specific media verification + cultural color note (`design-foundations/.../color/palette_theming.md`)
- [x] T006 Script-specific typography note (`design-foundations/.../type/typography_system.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Diff-review every changed file: scope lock, no duplication
- [x] T021 Confirm skipped items (already present) are reported and not re-added
- [x] T022 Finalize checklist/decision-record/implementation-summary; run `validate.sh --strict`; save continuity
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Per-diff verification passed; strict validation clean
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source backlog**: See `../024-designer-skills-research/research/research.md`
<!-- /ANCHOR:cross-refs -->
