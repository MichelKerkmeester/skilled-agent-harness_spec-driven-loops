---
title: "Tasks: install-claude-frontend-design"
description: "Task tracking for vendoring Anthropic's frontend-design skill into .opencode/skills/sk-design-interface and registering it."
trigger_phrases:
  - "interface design tasks"
  - "sk-design-interface"
  - "skill install tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "design/001-sk-design-interface/001-install-claude-frontend-design"
    last_updated_at: "2026-06-13T13:55:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored task list for sk-design-interface install"
    next_safe_action: "Run validate.sh --strict"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-interface/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-148-001-install-claude-frontend-design"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: install-claude-frontend-design

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

- [x] T001 Locate upstream skill (anthropics/skills/skills/frontend-design)
- [x] T002 Confirm name + family with operator (sk-design-interface, sk-code family)
- [x] T003 Download SKILL.md + LICENSE.txt; scaffold spec folder 148
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Author references/design_principles.md (reference template, verbatim guidance)
- [x] T005 Author lean house-template SKILL.md (`.opencode/skills/sk-design-interface/SKILL.md`)
- [x] T006 Author README.md + graph-metadata.json (schema-2, sk-code family)
- [x] T007 Preserve LICENSE.txt + Anthropic attribution
- [x] T008 Update catalog README + root README (counts + listings)
- [x] T009 Add reciprocal sibling edge to sk-code graph-metadata
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 package_skill.py + validate_document.py (SKILL/README/reference) all green
- [x] T011 skill_graph_scan + validate (errorCount 0, symmetry clean) + advisor_recommend (top match)
- [x] T012 validate.sh --strict on the spec folder
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Advisor routes design prompts to sk-design-interface (Gate 2)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
