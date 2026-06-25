---
title: "Tasks: Phase 4: onboard-existing"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "onboard existing design tasks"
  - "register design siblings tasks"
  - "aesthetics presets tasks"
  - "sk-design-spec role tasks"
  - "tasks core"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/004-onboard-existing"
    last_updated_at: "2026-06-25T12:41:16Z"
    last_updated_by: "claude-opus"
    recent_action: "Initialize continuity block"
    next_safe_action: "Replace template defaults on first save"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "skilled-agent-orchestration/154-sk-design-parent/004-onboard-existing"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: onboard-existing

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

- [ ] T001 Confirm phase 003 umbrella exists and `skill_graph_scan` is clean (`.opencode/skills/sk-design/`)
- [ ] T002 Inventory both existing skills' current edges and freeze every legacy trigger phrase (`.opencode/skills/sk-design-interface/graph-metadata.json`, `.opencode/skills/sk-design-md-generator/graph-metadata.json`)
- [ ] T003 [P] Confirm the `sk-design-spec` role label + alias policy from `../002-architecture-decision/`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add family edges to `sk-design-interface` and complete the umbrella's edge to it (`.opencode/skills/sk-design-interface/graph-metadata.json`, `.opencode/skills/sk-design/graph-metadata.json`)
- [ ] T005 Add family edges to `sk-design-md-generator` and complete the umbrella's edge to it (`.opencode/skills/sk-design-md-generator/graph-metadata.json`, `.opencode/skills/sk-design/graph-metadata.json`)
- [ ] T006 Augment `sk-design-interface`: family-routing pointer + `references/aesthetics/` presets (brutalist/minimalist/soft/apple-bento) (`.opencode/skills/sk-design-interface/SKILL.md`, `.opencode/skills/sk-design-interface/references/aesthetics/`)
- [ ] T007 Cross-link `sk-design-md-generator` as the `sk-design-spec` role + optional author-mode note; leave backend + cardinal-fidelity rule untouched (`.opencode/skills/sk-design-md-generator/SKILL.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Run `advisor_validate` and confirm it is clean; confirm no legacy trigger was dropped
- [ ] T009 Confirm routing confidence >=0.8 for both skills and that all pre-existing references still resolve
- [ ] T010 Update documentation (spec/plan/tasks/implementation-summary)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] `advisor_validate` clean, routing confidence >=0.8 for both skills, every legacy trigger preserved, flat names unchanged
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
