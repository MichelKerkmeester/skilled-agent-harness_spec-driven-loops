---
title: "Tasks: Rename sk-interface-design skill to sk-design-interface across the framework [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "rename tasks"
  - "design-interface skill"
  - "skill-graph rebuild"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/151-sk-design-interface-rename"
    last_updated_at: "2026-06-21T09:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Completed rename and graph rebuild"
    next_safe_action: "Verify packet 152 closure"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-152-rename"
      parent_session_id: null
    completion_pct: 100
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
- [x] T003 [P] Author spec/plan/tasks/checklist for 152
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 `git mv` skill dir + changelog symlink; recreate symlink target (commit 8ba686c04a)
- [x] T005 Edit renamed skill internals: SKILL.md, README, graph-metadata, feature_catalog, playbook, references (66 occurrences, 0 remaining)
- [x] T006 Update reciprocal sibling graph edges before rebuild (`{mcp-open-design,mcp-figma,sk-code}/graph-metadata.json`)
- [x] T007 Update cross-skill live prose (`mcp-open-design`, `mcp-figma`, `sk-prompt`) + AGENTS.md/CLAUDE.md co-load mandate (commit cffa3e056f)
- [x] T008 Update root + index docs (`/README.md`, `.opencode/skills/README.md`)
- [x] T009 History rewrite: `git mv` 143 folder + 2 child folders, reconcile pointers, replace doc/metadata across track + `descriptions.json` (commit 2aaec599fb)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 `skill_graph_scan` rebuild + `skill_graph_validate` (isValid, 0 errors) + routing smoke (conf 0.95)
- [x] T011 Verified zero live hits (`rg`), sqlite node present/old absent + 6 symmetric edges, symlink resolves
- [x] T012 `validate.sh --strict` PASS on 143 + 152; machine artifacts left honest (documented)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (SC-001..004)
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
