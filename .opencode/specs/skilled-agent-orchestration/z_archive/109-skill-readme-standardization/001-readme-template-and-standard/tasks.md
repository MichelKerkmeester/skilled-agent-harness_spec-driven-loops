---
title: "Tasks: README template and standard"
description: "Task list for rewriting the sk-doc skill-README template and shipping the sk-git golden example."
trigger_phrases:
  - "readme template tasks"
  - "narrative template tasks"
importance_tier: "high"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/109-skill-readme-standardization/001-readme-template-and-standard"
    last_updated_at: "2026-06-07T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "All phase-001 tasks complete"
    next_safe_action: "Begin batch A skill README rewrites (phases 002-005)"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/assets/skill/skill_readme_template.md"
      - ".opencode/skills/sk-git/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-std-135-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: README template and standard

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

- [x] T001 Read the sk-doc readme rules (`assets/template_rules.json`)
- [x] T002 Read the Human Voice Rules (`references/global/hvr_rules.md`)
- [x] T003 [P] Confirm the validator parses only numbered H2 headers
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Rewrite the section model and writing rules (`skill_readme_template.md`)
- [x] T005 Rewrite the fillable scaffold to numbered ALL-CAPS narrative sections
- [x] T006 Rewrite the validation checklist
- [x] T007 Author the sk-git golden example (`sk-git/README.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Pass `validate_document.py --type readme` on the example (0 issues)
- [x] T009 HVR scan clean on template and example
- [x] T010 Pass `validate.sh --strict` on phase 001
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
