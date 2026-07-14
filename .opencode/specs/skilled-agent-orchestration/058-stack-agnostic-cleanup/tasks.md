---
title: "Tasks: Phase 071 Stack-Agnostic Cleanup"
description: "One cleanup task per affected non-sk-code skill, followed by final validation and summary."
trigger_phrases:
  - "phase 071 tasks"
  - "stack agnostic cleanup tasks"
  - "skill cleanup"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/058-stack-agnostic-cleanup"
    last_updated_at: "2026-05-05T19:14:28Z"
    last_updated_by: "cli-codex"
    recent_action: "Created task list with one task per known affected skill"
    next_safe_action: "Run inventory and start deterministic patch order"
    blockers: []
    key_files:
      - ".opencode/skills/"
    session_dedup:
      fingerprint: "sha256:cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc"
      session_id: "phase-071-stack-agnostic-cleanup"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 071 Stack-Agnostic Cleanup

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

- [x] T001 Create Level 2 packet (`specs/skilled-agent-orchestration/z_archive/058-stack-agnostic-cleanup/`)
- [x] T002 Draft spec, plan, tasks, checklist, and ADR (`specs/skilled-agent-orchestration/z_archive/058-stack-agnostic-cleanup/`)
- [x] T003 Save initial scoped grep inventory (`specs/skilled-agent-orchestration/z_archive/058-stack-agnostic-cleanup/scratch/initial-inventory.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Clean `cli-claude-code` (`.opencode/skills/cli-claude-code/`)
- [x] T005 Clean `cli-codex` (`.opencode/skills/cli-codex/`)
- [x] T006 Clean `cli-copilot` (`.opencode/skills/cli-copilot/`)
- [x] T007 Clean `cli-gemini` (`.opencode/skills/cli-gemini/`)
- [x] T008 Clean `cli-opencode` (`.opencode/skills/cli-opencode/`)
- [x] T009 Clean `mcp-chrome-devtools` (`.opencode/skills/mcp-chrome-devtools/`)
- [x] T010 Clean `mcp-coco-index` (`.opencode/skills/mcp-coco-index/`)
- [x] T011 Clean `sk-doc` (`.opencode/skills/sk-doc/`)
- [x] T012 Clean `sk-git` (`.opencode/skills/sk-git/`)
- [x] T013 Clean `sk-code-review` (`.opencode/skills/sk-code-review/`)
- [x] T014 Clean `system-spec-kit` (`.opencode/skills/system-spec-kit/`)
- [x] T015 Clean `mcp-code-mode` (`.opencode/skills/mcp-code-mode/`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Verify touched `SKILL.md` frontmatter still parses
- [x] T017 Re-run scoped grep and confirm zero non-protected hits
- [x] T018 Recompile skill graph export
- [x] T019 Run skill graph validate-only
- [x] T020 Run strict spec validation
- [x] T021 Confirm `sk-code` has no Phase 071 edits
- [x] T022 Author implementation summary
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Final verification commands passed or failures documented
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision Record**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
