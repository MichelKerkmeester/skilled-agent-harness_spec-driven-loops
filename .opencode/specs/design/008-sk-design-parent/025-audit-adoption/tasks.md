---
title: "Tasks: adopt the designer-skills-main audit findings into sk-design"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "audit adoption tasks designer-skills"
  - "visual-critique crosswalk tasks"
  - "sk-design audit build tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/025-audit-adoption"
    last_updated_at: "2026-06-27T11:49:46Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the audit-slice build task list"
    next_safe_action: "Verify the audit diff, then finalize and validate phase 025"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "build-154-025-audit-adoption"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Tasks: adopt the designer-skills-main audit findings into sk-design

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
- [x] T002 Confirm the four audit reference files; confirm executor cli-codex gpt-5.5 high fast
- [x] T003 Author the scope-locked audit codex prompt
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Visual-critique 7-dimension crosswalk (`design-audit/references/critique_hardening.md`)
- [x] T005 Perceived-quality / aesthetic-usability lens (`critique_hardening.md`)
- [x] T006 Release-hardening: component completeness + localization stress (`anti_patterns_production.md`)
- [x] T007 Token-tier guard + pseudo-localization test (`anti_patterns_production.md`)
- [x] T008 Accessibility modality coverage + optional POUR scaffold (`accessibility_performance.md`)
- [x] T009 Evidence-impact guard (`evidence_capture.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Diff-review every changed audit file: scope lock, no duplication, crosswalk-not-score
- [x] T011 Confirm skipped items (already present) are reported and not re-added
- [x] T012 Finalize checklist/decision-record/implementation-summary; run `validate.sh --strict`; save continuity
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
