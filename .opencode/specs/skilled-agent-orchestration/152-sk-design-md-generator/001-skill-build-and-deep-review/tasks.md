---
title: "Tasks: Create sk-design-md-generator skill with an embedded extraction pipeline [template:level_3/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "design-md-generator tasks"
  - "embed and author"
  - "advisor registration"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/152-sk-design-md-generator"
    last_updated_at: "2026-06-21T10:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored Level 3 generator task list"
    next_safe_action: "Verify routing and tool smoke"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-152-generator"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Create sk-design-md-generator skill with an embedded extraction pipeline

<!-- SPECKIT_LEVEL: 3 -->

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

- [x] T001 Author spec.md + decision-record.md (embed depth + artifact trimming)
- [x] T002 Adapt the extraction tool into tool/
- [x] T003 [P] Confirm sk-doc standards + exemplar (mcp-figma)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Embed tool/ (scripts, resources, examples, configs); drop generated HTML + platform entry files
- [x] T005 Author SKILL.md via DeepSeek-v4-pro; verify flags against real CLI; correct invented flags
- [x] T006 [P] Author README + INSTALL_GUIDE via MiMo-v2.5-pro; references + graph-metadata + changelog by Claude
- [x] T007 Add reciprocal sibling back-edges in sk-design-interface/mcp-figma/mcp-open-design
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 package_skill.py --check + quick_validate.py PASS; snake_case reference fix
- [x] T009 skill_graph_scan register + skill_graph_validate isValid + advisor_recommend routes to the skill (#1, conf 0.89)
- [x] T010 Tool smoke: npm install + vitest (50/50) + live extraction of example.com (tokens.json produced)
- [ ] T011 validate.sh --strict on 152 folder; finalize impl-summary + checklist
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed (SC-001..004)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decisions**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
