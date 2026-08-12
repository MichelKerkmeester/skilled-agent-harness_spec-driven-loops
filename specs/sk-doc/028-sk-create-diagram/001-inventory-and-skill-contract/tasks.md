---
title: "Tasks: Inventory and skill-contract mapping"
description: "Task queue for inventorying the forked diagram-design source and recording the trim, tree, name, and command decisions."
trigger_phrases:
  - "diagram inventory tasks"
importance_tier: "important"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/028-sk-create-diagram/001-inventory-and-skill-contract"
    last_updated_at: "2026-08-12T05:53:36.000Z"
    last_updated_by: "claude"
    recent_action: "All tasks completed"
    next_safe_action: "Start phase 002"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-create-diagram-fork"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Inventory and skill-contract mapping

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable after dependencies are satisfied |
| `[B]` | Blocked by an explicit gate |

**Task Format**: T### [P?] Description (file path)
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm `context/` exists in the worktree (copied from the untracked source)
- [x] T002 Re-read `sk-create-skill/SKILL.md` for the required standalone-skill shape and frontmatter contract
- [x] T003 Re-read `sk-create-flowchart/SKILL.md` for the existing ASCII-only boundary language
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Size every `references/*.md` file with `wc -l` (resource-map.md)
- [x] T005 Confirm `drawio_extract.py` and `mermaid_extract.py` import only stdlib modules
- [x] T006 Count and size `assets/*.html` (100 files, 1.4M) and decide the trim ratio (one canonical example per type)
- [x] T007 Decide the skill folder name (`sk-create-diagram`) and write the `sk-create-flowchart` boundary sentence
- [x] T008 Decide the command surface: one `/create:diagram` command, import/export routed by natural language inside the packet
- [x] T009 Resolve the icon-set open question: include `primitive-icons.md` + `assets/icons.html` in v1
- [x] T010 Resolve the onboarding open question: agent-mediated guidance only, no packet script claims network fetch [EVIDENCE: `decision-record.md` §5, `toolSurface.allowed` cross-checked against all 12 existing `mode-registry.json` entries]
- [x] T011 Draft the target file tree for `references/`, `assets/`, `scripts/`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Cross-check every file listed under `context/skills/diagram-design/` has a fate in `resource-map.md`
- [x] T013 Confirm the target tree in `decision-record.md` matches the `sk-create-skill` required shape (SKILL.md, README.md, references/, assets/, scripts/, changelog/, manual-testing-playbook/, benchmark/)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked [x]
- [x] No [B] tasks remain
- [x] `decision-record.md` and `resource-map.md` exist and are internally consistent
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Decisions**: `decision-record.md`
- **Resource inventory**: `resource-map.md`
<!-- /ANCHOR:cross-refs -->
