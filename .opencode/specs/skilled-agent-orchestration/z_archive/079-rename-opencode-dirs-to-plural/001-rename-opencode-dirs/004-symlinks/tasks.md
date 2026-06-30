---
title: "Tasks: 096/004 - symlinks redirect"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "096/004 tasks"
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/004-symlinks"
    last_updated_at: "2026-05-07T14:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored tasks.md"
    next_safe_action: "Execute symlink redirects"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-07"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: 096/004 - symlinks redirect

<!-- SPECKIT_LEVEL: 2 -->
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

- [x] T001 Phases 001-003 verified
- [x] T002 Pre-flight: `.opencode/skills` + `.opencode/commands` directories exist
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T010 `cd .claude && rm skills && ln -s ../.opencode/skills skills`
- [ ] T011 `cd .claude && rm commands && ln -s ../.opencode/commands commands`
- [ ] T012 `cd .codex && rm skills && ln -s ../.opencode/skills skills`
- [ ] T013 `cd .codex && rm prompts && ln -s ../.opencode/commands prompts`
- [ ] T014 `cd .gemini && rm skills && ln -s ../.opencode/skills skills`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T020 `test -e <link>` for all 5 symlinks
- [ ] T021 `readlink <link>` shows new plural target
- [ ] T022 opencode smoke test
- [ ] T023 Document pre-existing broken `.gemini/workflows/*` symlinks
- [ ] T024 Author implementation-summary.md
- [ ] T025 Update graph-metadata.json
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Resource Map**: `../resource-map.md`
<!-- /ANCHOR:cross-refs -->
