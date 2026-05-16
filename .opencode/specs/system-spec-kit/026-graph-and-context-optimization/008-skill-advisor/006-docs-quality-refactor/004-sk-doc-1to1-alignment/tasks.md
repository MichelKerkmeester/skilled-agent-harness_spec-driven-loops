---
title: "Tasks: 004-sk-doc-1to1-alignment (skeleton)"
description: "Task skeleton — fills post-001."
trigger_phrases:
  - "004 sk-doc alignment tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "006-docs-quality-refactor/004-sk-doc-1to1-alignment"
    last_updated_at: "2026-05-16T00:00:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Scaffolded tasks skeleton"
    next_safe_action: "Fill post-001"
    blockers: ["001 not shipped"]
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "004-tasks"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: 004-sk-doc-1to1-alignment

<!-- SPECKIT_LEVEL: 1 -->
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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Extract per-file action list from 001 research
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 [B] SKILL.md, ARCHITECTURE.md, INSTALL_GUIDE.md alignment
- [ ] T003 [B] references/* alignment (7 files)
- [ ] T004 [B] feature_catalog/* alignment (parent + 7 groups)
- [ ] T005 [B] manual_testing_playbook/* alignment (parent + 9 categories)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 sk-doc validate per surface
- [ ] T007 Playbook PARTIAL → PASS confirmed
- [ ] T008 Update implementation-summary.md
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] T006-T007 green
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **sk-doc templates**: `.opencode/skills/sk-doc/`
<!-- /ANCHOR:cross-refs -->
