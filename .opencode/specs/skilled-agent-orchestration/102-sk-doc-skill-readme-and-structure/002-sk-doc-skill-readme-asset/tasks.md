---
title: "Tasks: sk-doc skill README asset"
description: "Task list for sk-doc skill README asset."
trigger_phrases:
  - "sk-doc skill README asset"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/skilled-agent-orchestration/102-sk-doc-skill-readme-and-structure"
    last_updated_at: "2026-05-10T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Prepared planning documentation"
    next_safe_action: "Run implementation phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "102-sk-doc-skill-readme-and-structure"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: sk-doc skill README asset

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

- [ ] T001 Review `resource-map.md`
- [ ] T002 Inventory current files and references
- [ ] T003 Confirm out-of-scope work remains excluded
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Inventory README files under .opencode/skills.
- [ ] T005 Identify common skill README sections.
- [ ] T006 Confirm readme_template.md is the source template.
- [ ] T007 Create the dedicated skill README asset.
- [ ] T008 Reference the asset from SKILL.md and skill_creation.md.
- [ ] T009 Reference or test the asset from manual testing docs.
- [ ] T010 Run asset path searches and phase validation.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T900 Run exact searches from resource-map.md
- [ ] T901 Run phase validation
- [ ] T902 Update handoff evidence
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Resource Map**: See `resource-map.md`
<!-- /ANCHOR:cross-refs -->
