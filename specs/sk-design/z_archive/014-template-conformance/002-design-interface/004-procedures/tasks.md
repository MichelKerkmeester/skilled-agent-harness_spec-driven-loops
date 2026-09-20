---
title: "Tasks: design-interface procedures conformance"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "procedures tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/002-design-interface/004-procedures"
    last_updated_at: "2026-07-27T16:20:08Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Planned tasks.md"
    next_safe_action: "Start T001"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: design-interface procedures conformance

<!-- SPECKIT_LEVEL: 2 -->
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

- [x] T001 Re-read `skill-procedure-template.md` §2-§3
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 [P] Audit `component-system-inventory.md`, `deck-direction-spec.md` — both conformant, no changes
- [x] T003 [P] Audit `discovery-question-round.md`, `hierarchy-rhythm-review.md` — both conformant, no changes
- [x] T004 [P] Audit `prototype-flow-spec.md`, `tweakable-design-controls.md` — both conformant, no changes
- [x] T005 [P] Audit `variation-set.md`, `wireframe-exploration.md` — both conformant, no changes
- [x] T006 Grep `Owning mode` across all 9 cards + `SKILL.md` — found in all 9 cards, consistent usage
- [x] T007 Apply the resolved field-label decision across all 9 cards — decision: `Owning mode` is correct per `sk-design/shared/procedure-card-schema.md` §2; no rename applied
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run `package_skill.py --check` — `strict mode`, PASS; also ran `node .opencode/skills/sk-design/shared/scripts/procedure-card-schema-check.mjs`, 12/12 cards pass
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
