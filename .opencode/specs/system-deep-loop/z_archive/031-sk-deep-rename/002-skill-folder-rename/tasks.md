---
title: "Tasks: Phase 002 Skill Folder Rename"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "070 phase 002 tasks"
  - "skill folder rename tasks"
  - "skill graph rename tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/031-sk-deep-rename/002-skill-folder-rename"
    last_updated_at: "2026-05-05T19:20:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Completed Phase 002 task list"
    next_safe_action: "Start Phase 003"
    blockers: []
    key_files:
      - "tasks.md"
      - ".opencode/skills/deep-review"
      - ".opencode/skills/deep-research"
      - ".opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-05-phase-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Phase 002 Skill Folder Rename

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

- [x] T001 Read parent rename context (`../spec.md`)
- [x] T002 Read parent resource map (`../resource-map.md`)
- [x] T003 Read Phase 001 inventory artifacts (`../001-discovery-impact-map/inventory.md`, `edge-cases.md`, `inventory.tsv`)
- [x] T004 Author Phase 002 Level 2 planning artifacts (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `graph-metadata.json`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Rename `.opencode/skills/sk-deep-review/` to `.opencode/skills/deep-review/` (evidence: `git mv` attempted first and failed on `.git/index.lock`; filesystem rename completed)
- [x] T006 Rename `.opencode/skills/sk-deep-research/` to `.opencode/skills/deep-research/` (evidence: filesystem rename completed after Git index write was blocked)
- [x] T007 Verify new folders exist and old folders are gone (evidence: `OK: old folders gone`; `ls` shows both new roots)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Replace quoted `sk-deep-review` IDs with `deep-review` in `skill-graph.json` (evidence: quoted old graph IDs absent)
- [x] T009 Replace quoted `sk-deep-research` IDs with `deep-research` in `skill-graph.json` (evidence: quoted old graph IDs absent)
- [x] T010 Verify `skill-graph.json` parses as JSON (evidence: Python JSON parse printed `valid`)
- [x] T011 Verify `signals` contains new keys and excludes old keys (evidence: key assertion printed `OK: skill-graph.json keys updated`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: B.3 Internal Content Updates

- [x] T012 Replace old self-references inside `.opencode/skills/deep-review/` (evidence: internal grep clean)
- [x] T013 Replace old self-references inside `.opencode/skills/deep-research/` (evidence: internal grep clean)
- [x] T014 Replace cross-references between the renamed folders (evidence: both renamed folders grep clean for both old IDs)
- [x] T015 Remove replacement backup files (evidence: `find ... -name "*.bak*"` returned no rows)
- [x] T016 Verify no `sk-deep-review` or `sk-deep-research` strings remain in the renamed folders (evidence: grep returned no rows)
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: B.4 Rebuild and Validation

- [x] T017 Run advisor graph rebuild script or record orchestrator deferral (evidence: Node reported `MODULE_NOT_FOUND` for the expected build script; deferral recorded)
- [x] T018 Run child strict validation (evidence: strict validation exit 0)
- [x] T019 Run parent strict validation (evidence: strict validation exit 0)
- [x] T020 Record completion evidence in tasks and checklist
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Folder rename, graph JSON, internal grep, advisor rebuild, and validation evidence recorded
- [x] Child and parent strict validation exit 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Parent Resource Map**: See `../resource-map.md`
- **Phase 001 Inventory**: See `../001-discovery-impact-map/inventory.tsv`
<!-- /ANCHOR:cross-refs -->
