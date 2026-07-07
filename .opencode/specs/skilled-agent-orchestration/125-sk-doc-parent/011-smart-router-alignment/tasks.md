---
title: "Tasks: Align router-carrying SKILL.md nested smart-routers to the canonical template"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "smart router alignment tasks"
  - "125 sk-doc phase 011 tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-sk-doc-parent/011-smart-router-alignment"
    last_updated_at: "2026-07-07T06:49:18.161Z"
    last_updated_by: "claude-sonnet"
    recent_action: "Author phase-011 tasks"
    next_safe_action: "Run T001-T002 (enumerate candidates, read canonical template)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Align router-carrying SKILL.md nested smart-routers to the canonical template

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Enumerate router-carrying skills (`.opencode/skills/*/SKILL.md`)
- [ ] T002 Read the canonical template (`.opencode/skills/sk-doc/create-skill/assets/skill/skill_smart_router.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Classify each candidate full-router vs simple-routing with rationale
- [ ] T004 [P] Draft aligned router sections for full-router skills, batched by cluster (GPT-5.5-fast-high, >=5 concurrent)
- [ ] T005 Fresh-Sonnet verification of every drafted alignment against the skill's real resources
- [ ] T006 Apply verified edits, scoped to the router section only
- [ ] T007 Record a one-line exemption rationale per simple-routing skill
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Spot-check a sample of full-router skills against all 4 canonical patterns
- [ ] T009 Confirm concurrent-lane skills were touched only at the router section
- [ ] T010 Record the final classification + outcome table
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All ~24 candidates classified with recorded rationale
- [ ] Every full-router skill aligned or exempted with a documented reason
- [ ] No `[B]` blocked tasks remaining
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
