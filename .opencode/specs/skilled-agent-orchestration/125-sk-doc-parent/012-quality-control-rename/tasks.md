---
title: "Tasks: Rename packet doc-quality -> create_quality_control"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "quality control rename tasks"
  - "125 sk-doc phase 012 tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-sk-doc-parent/012-quality-control-rename"
    last_updated_at: "2026-07-07T00:00:00Z"
    last_updated_by: "claude-sonnet"
    recent_action: "Author phase-012 tasks"
    next_safe_action: "Run T001-T002 (repo-wide reference inventory)"
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
# Tasks: Rename packet doc-quality -> create_quality_control

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

- [ ] T001 Inventory every repo-wide reference to `doc-quality` (`.opencode/skills/sk-doc/`, commands, external READMEs)
- [ ] T002 Confirm the exact field list to change per hub config
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 `git mv` `.opencode/skills/sk-doc/doc-quality/` to `.opencode/skills/sk-doc/create_quality_control/`
- [ ] T004 Update `.opencode/skills/sk-doc/mode-registry.json`
- [ ] T005 Update `.opencode/skills/sk-doc/hub-router.json`
- [ ] T006 [P] Update `.opencode/skills/sk-doc/description.json`
- [ ] T007 [P] Update `.opencode/skills/sk-doc/graph-metadata.json`
- [ ] T008 Update `.opencode/skills/sk-doc/create_quality_control/SKILL.md` name/aliases
- [ ] T009 Repoint `.opencode/commands/doc/quality.md`
- [ ] T010 Repoint any remaining repo-wide reference found in T001
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Run `parent-skill-check.cjs`, confirm 0 warnings
- [ ] T012 Run the repo-wide link checker, confirm 0 broken links
- [ ] T013 Manually invoke `/doc:quality` end to end
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] `create_quality_control/` exists with all prior content; `doc-quality/` no longer exists
- [ ] `parent-skill-check.cjs` passes with 0 warnings
- [ ] 0 broken links introduced
- [ ] No `[B]` blocked tasks remaining
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
