---
title: "Tasks: Phase 2: core-rename"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "sk-prompt-models core rename tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/121-sk-prompt-models-rename/002-core-rename"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase complete"
    next_safe_action: "Phase complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session/002-core-rename"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: core-rename

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

- [x] T001 `git mv .opencode/skills/sk-prompt-small-model .opencode/skills/sk-prompt-models`; confirm untracked files (glm-5.2.md, benchmarks/008) moved
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Update identity: `SKILL.md` `name:` + Keywords; `graph-metadata.json` `skill_id`; `description.json`; `README.md`
- [x] T003 Token-replace internal back-links: `references/models/*.md`, `_index.md`, `pattern_index.md`
- [x] T004 Update `assets/model_profiles.json` `profile_ref` strings (×5)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 `rg "sk-prompt-small-model" .opencode/skills/sk-prompt-models` = 0 live hits; resolve each profile_ref + back-link target
- [x] T006 Write implementation-summary.md and refresh continuity
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Folder internally consistent
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
