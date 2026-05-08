---
title: "Tasks: 096/001 - skills rename"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "096/001 tasks"
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/001-skills"
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
# Tasks: 096/001 - skills rename

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

- [x] T001 Resource map and critical-patch list ready
- [x] T002 cli-codex dispatch shape decided
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T010 cli-codex: `git mv .opencode/skill .opencode/skills`
- [ ] T011 cli-codex: bulk sed pass 1 (`\.opencode/skills/` → `\.opencode/skills/`)
- [ ] T012 cli-codex: bulk sed pass 2 (`\.opencode\\/skill\\/` → `\.opencode\\/skills\\/`)
- [ ] T013 cli-codex: targeted Read+Edit `opencode.json` (3 MCP commands at lines 23, 44, 57)
- [ ] T014 cli-codex: targeted Read+Edit `.claude/settings.local.json` (4 hooks at lines 37, 49, 61, 73)
- [ ] T015 cli-codex: targeted Read+Edit `skill_advisor.py` (regex line ~1913, f-strings ~2160/2168, dict keys ~1601-1685)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T020 Orchestrator: `git grep -E '\.opencode/skills/' | grep -v '\.opencode/skills/'` returns 0
- [ ] T021 Orchestrator: `python3 -c "import json; json.load(open('opencode.json'))"` succeeds; same for settings.local.json
- [ ] T022 Orchestrator: `python3 -c "import re; re.compile(r'\\.opencode/skills/([^/]+)/')"`  + smoke skill_advisor invocation returns reco
- [ ] T023 Orchestrator: opencode smoke test no "Could not find" warning
- [ ] T024 Orchestrator: validate.sh strict on packet 095 returns exit 0
- [ ] T025 Orchestrator: validate_document.py on all 16 playbook roots VALID
- [ ] T026 Author implementation-summary.md
- [ ] T027 Update graph-metadata.json (status complete)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All checklist items resolved
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Resource Map**: `../resource-map.md`
<!-- /ANCHOR:cross-refs -->
