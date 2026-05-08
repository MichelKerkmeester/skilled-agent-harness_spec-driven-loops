---
title: "Tasks: 096/002 - agents rename"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "096/002 tasks"
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/002-agents"
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
# Tasks: 096/002 - agents rename

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

- [x] T001 Phase 001 verified complete
- [x] T002 cli-codex prompt scaffolded
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T010 cli-codex: `git mv .opencode/agent .opencode/agents`
- [ ] T011 cli-codex: bulk sed pass 1 (`\.opencode/agents/` → `\.opencode/agents/`)
- [ ] T012 cli-codex: bulk sed pass 2 (JSON-escaped)
- [ ] T013 cli-codex: patch CLAUDE.md §5 routing table
- [ ] T014 cli-codex: patch `.opencode/skills/sk-prompt/graph-metadata.json` mirrorPath
- [ ] T015 cli-codex: patch `.opencode/skills/deep-research/assets/runtime_capabilities.json` mirrorPath
- [ ] T016 cli-codex: patch `audit_descriptions.py` agent-half validators (path will be `.opencode/commands/doctor/scripts/audit_descriptions.py` POST-Phase-001 since skills are already plural; commands not yet)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T020 `git grep -E '\.opencode/agents/' | grep -v '\.opencode/agents/'` returns 0
- [ ] T021 JSON files validate
- [ ] T022 audit_descriptions.py syntax-valid
- [ ] T023 Author implementation-summary.md
- [ ] T024 Update graph-metadata.json (status complete)
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
