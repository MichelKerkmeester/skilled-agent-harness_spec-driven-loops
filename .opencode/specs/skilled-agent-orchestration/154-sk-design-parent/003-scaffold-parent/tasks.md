---
title: "Tasks: Phase 3: scaffold-parent"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sk-design scaffold tasks"
  - "umbrella router tasks"
  - "shared design-base tasks"
  - "family edges tasks"
  - "tasks core"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/003-scaffold-parent"
    last_updated_at: "2026-06-25T12:41:15Z"
    last_updated_by: "claude-opus"
    recent_action: "Initialize continuity block"
    next_safe_action: "Replace template defaults on first save"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "skilled-agent-orchestration/154-sk-design-parent/003-scaffold-parent"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: scaffold-parent

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

- [ ] T001 Create the `.opencode/skills/sk-design/` skill folder and `references/` subfolder
- [ ] T002 Re-confirm the umbrella-router model and 5-child target set from `../002-architecture-decision/` and `../001-corpus-research/research/research.md`
- [ ] T003 [P] Confirm the two existing skills' `skill_id`s (`sk-design-interface`, `sk-design-md-generator`) for the edge targets
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Author the thin `sk-design/SKILL.md` router: WHEN TO USE, SMART ROUTING to the 5 children, RULES (`.opencode/skills/sk-design/SKILL.md`)
- [ ] T005 Author `sk-design/graph-metadata.json` with `skill_id: sk-design` and `enhances`/`siblings` edges to the 5 children (`.opencode/skills/sk-design/graph-metadata.json`)
- [ ] T006 Author the shared design-base references: anti-slop principles, design-token vocabulary, 8 cognitive laws (`.opencode/skills/sk-design/references/`)
- [ ] T007 Keep the router thin: verify no design judgment or per-child content leaked into SKILL.md (`.opencode/skills/sk-design/SKILL.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Run `skill_graph_scan` and confirm a clean scan with no duplicate metadata
- [ ] T009 Confirm advisor discovers `sk-design` and the one-graph-metadata-per-skill invariant holds
- [ ] T010 Update documentation (spec/plan/tasks/implementation-summary)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] `skill_graph_scan` clean, advisor discovers `sk-design`, one-graph-metadata-per-skill invariant holds
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
