---
title: "Tasks: Rename sk-interface-design skill to sk-design-interface across the framework [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "rename tasks"
  - "sk-design-interface"
  - "skill-graph rebuild"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/153-sk-design-interface-rename"
    last_updated_at: "2026-06-21T08:50:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored Level 2 rename task list"
    next_safe_action: "Execute T101 git mv"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-153-rename"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Rename sk-interface-design skill to sk-design-interface across the framework

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Pre-flight snapshot: git status + baseline sqlite nodes/edges + symlink mode
- [x] T002 Confirm target folders not in concurrent-session dirty set
- [x] T003 [P] Author spec/plan/tasks/checklist for 153
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 `git mv` skill dir + changelog symlink; recreate symlink target (`.opencode/skills/sk-interface-design`, `.opencode/changelog/sk-interface-design`)
- [ ] T005 Edit renamed skill internals: SKILL.md, README, graph-metadata (skill_id, key_files, entities, causal_summary), feature_catalog, manual_testing_playbook, references
- [ ] T006 Update reciprocal sibling graph edges BEFORE rebuild (`{mcp-open-design,mcp-figma,sk-code}/graph-metadata.json`)
- [ ] T007 Update cross-skill live prose (`mcp-open-design`, `mcp-figma`, `sk-prompt`)
- [ ] T008 Update root + index docs (`/README.md`, `.opencode/skills/README.md`)
- [ ] T009 History rewrite: `git mv` 143 folder (+ child folders), reconcile pointers, global string-replace across `.opencode/specs/**` + `descriptions.json`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 `skill_graph_scan` rebuild + `skill_graph_validate` + `advisor_validate`
- [ ] T011 Verify zero live hits (`rg`), sqlite node present/old absent + 6 edges, routing smoke (`advisor_recommend`), symlink resolves
- [ ] T012 `validate.sh --strict` on touched spec folders; finalize implementation-summary + checklist
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
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
