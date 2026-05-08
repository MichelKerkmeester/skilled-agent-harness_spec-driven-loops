---
title: "Tasks: 096/003 - commands rename"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "096/003 tasks"
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/003-commands"
    last_updated_at: "2026-05-07T14:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored tasks.md"
    next_safe_action: "Dispatch cli-codex"
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
# Tasks: 096/003 - commands rename

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

- [x] T001 Phases 001 + 002 verified
- [x] T002 cli-codex prompt scaffolded
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T010 `git mv .opencode/command .opencode/commands`
- [ ] T011 bulk sed pass 1 (literal `\.opencode/commands/`)
- [ ] T012 bulk sed pass 2 (JSON-escaped)
- [ ] T013 patch audit_descriptions.py command half
- [ ] T014 patch target_manifest.jsonc
- [ ] T015 patch mcp-doctor.sh
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T020 `git grep -E '\.opencode/commands/' | grep -v '\.opencode/commands/'` returns 0
- [ ] T021 Python compile + JSONC parse + bash syntax
- [ ] T022 Author implementation-summary.md
- [ ] T023 Update graph-metadata.json
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
