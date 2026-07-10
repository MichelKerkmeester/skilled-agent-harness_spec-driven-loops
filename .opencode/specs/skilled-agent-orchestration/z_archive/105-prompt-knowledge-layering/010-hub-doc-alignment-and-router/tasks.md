---
title: "Tasks: hub-doc-alignment-and-router"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "hub doc alignment tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/105-prompt-knowledge-layering/010-hub-doc-alignment-and-router"
    last_updated_at: "2026-06-03T08:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored phase 010 task list"
    next_safe_action: "Validate then commit"
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
# Tasks: hub-doc-alignment-and-router

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

- [x] T001 Read sk-doc templates (skill_md, skill_smart_router, skill_reference, skill_readme); map deviations
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Replace no-op §2 with a model-keyed smart router; relax LOC cap to 300; bump version 0.7.0.0 (SKILL.md)
- [x] T003 Rewrite README to hub identity, strip ephemeral spec refs, align to skill_readme_template + HVR (README.md)
- [x] T004 [P] Align 9 profiles + _index to skill_reference_template (delegated to subagents) (references/models/*.md)
- [x] T005 Refresh the stale hub index entry (skills/README.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Profiles verified: 7 numbered ALL-CAPS sections each, scaffold headers untouched, content preserved
- [x] T007 README verified spec-ref-clean + 0 em-dash/semicolon; guard green
- [ ] T008 validate.sh --recursive --strict exit 0; changelog v0.7.0.0; scoped commit
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Router, README, profiles aligned
- [ ] validate --strict exit 0 + committed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Templates**: `sk-doc/assets/skill/{skill_md,skill_smart_router,skill_reference,skill_readme}_template.md`
<!-- /ANCHOR:cross-refs -->
