---
title: "Tasks: Phase 3: scaffold-hub"
description: "Task list for the additive cli-external hub scaffold: five hub-root files plus two empty packet directories."
trigger_phrases:
  - "cli-external scaffold tasks"
  - "hub skeleton tasks"
  - "phase 003 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-cli-external-parent/003-scaffold-hub"
    last_updated_at: "2026-07-09T19:00:00Z"
    last_updated_by: "claude"
    recent_action: "Drafted the additive scaffold task list"
    next_safe_action: "Execute the additive scaffold after decision-gate approval"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external/mode-registry.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-003-scaffold-hub"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: scaffold-hub

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

- [ ] T001 Confirm the phase 002 frozen registry/router/graph target shapes
- [ ] T002 Identify the parent-skill template files to copy from
- [ ] T003 [P] Confirm `PARENT_HUB_CHECK_STRICT=0 parent-skill-check.cjs` as the scaffold gate
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Create `.opencode/skills/cli-external/mode-registry.json` with two `packetKind: "workflow"` modes
- [ ] T005 Create `.opencode/skills/cli-external/hub-router.json` with base-three outcomes and `defaultMode: "cli-opencode"`
- [ ] T006 Create `.opencode/skills/cli-external/description.json` and a thin `SKILL.md` at version 1.0.0.0
- [ ] T007 Create `.opencode/skills/cli-external/graph-metadata.json` (`skill_id: cli-external`, `family: cli`) and the two empty packet directories
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Run the non-strict parent-hub check and accept empty-packet warnings
- [ ] T009 Confirm zero content relocation and zero scorer edits occurred in this phase
- [ ] T010 Run phase-folder validation
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Non-strict parent-hub structural checks pass with empty-packet warnings accepted
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
