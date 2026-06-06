---
title: "Tasks: spec and resource-map for deep-skill doc evolution"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "deep-skill doc evolution tasks"
  - "008 phase 1 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/008-deep-skill-doc-evolution/001-spec-and-resource-map"
    last_updated_at: "2026-05-25T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "authored-tasks"
    next_safe_action: "author-resource-map-and-schemas"
    blockers: []
    key_files:
      - "resource-map.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000803"
      session_id: "116-008-001-tasks"
      parent_session_id: "116-008-001-spec-and-resource-map"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: spec and resource-map for deep-skill doc evolution

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

- [x] T001 Author 008 parent control files (spec.md, description.json, graph-metadata.json)
- [x] T002 Author 001 child spec.md
- [x] T003 Author 001 child plan.md and tasks.md
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Generate artifact inventory across the five skills (find SKILL.md, README.md, references/**, feature_catalog/**, manual_testing_playbook/**)
- [ ] T005 Author schemas/audit-finding.schema.json
- [ ] T006 [P] Author schemas/changelog-entry.schema.json
- [ ] T007 [P] Author schemas/validation-report.schema.json
- [ ] T008 Author resource-map.yaml with template mapping and delta status per artifact
- [ ] T009 Author the delta reconciliation table against 000-release-cleanup
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Parse each schema against one valid and one invalid sample
- [ ] T011 Cross-check that every resource-map row maps to a real sk-doc template path
- [ ] T012 Run `validate.sh --strict` on this folder and confirm exit 0
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
<!-- /ANCHOR:cross-refs -->
