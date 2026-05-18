---
title: "Tasks: Fix advisor-script filesystem-scope resolution bugs"
description: "Completed Level 2 task list for the 013/009/009 advisor-script path fixes."
trigger_phrases:
  - "013/009/009 tasks"
  - "fix script fs scope tasks"
importance_tier: "critical"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-extraction/009-fix-script-fs-scope"
    last_updated_at: "2026-05-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Production fixes verified"
    next_safe_action: "013/009 line ready for close-out"
    blockers: []
    completion_pct: 100
---
# Tasks: Fix advisor-script filesystem-scope resolution bugs

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

- [x] T001 Read parent handover Tier 1 context (`handover.md`) [5m]
- [x] T002 Read sibling 008 spec and metadata shape (`008-move-skill-graph-tools-to-advisor/`) [10m]
- [x] T003 Read Level 2 template examples (`templates/examples/level_2/`) [10m]
- [x] T004 Read `skill_graph_compiler.py` lines 25-50 before editing [5m]
- [x] T005 Read `skill_advisor.py` lines 200-220 before editing [5m]
- [x] T006 Capture before path proof for `SKILLS_DIR` [5m]
- [x] T007 Capture before path proof for `SKILL_GRAPH_SQLITE_PATH` [5m]
- [x] T008 Capture package Vitest baseline [35m]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T009 Create Level 2 packet folder and docs (`009-fix-script-fs-scope/`) [25m]
- [x] T010 Fix `SKILLS_DIR` by removing one `..` (`skill_graph_compiler.py`) [2m]
- [x] T011 Fix `SKILL_GRAPH_SQLITE_PATH` by removing one `..` (`skill_advisor.py`) [2m]
- [x] T012 Avoid fixture edits because production fixes improved pass count without requiring fixture changes [1m]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T013 Run post-fix Python smoke for `SKILLS_DIR` [5m]
- [x] T014 Run post-fix Python smoke for `SKILL_GRAPH_SQLITE_PATH` [5m]
- [x] T015 Run package Vitest and record pass count [35m]
- [x] T016 Run strict validation for packet 009 [5m]
- [x] T017 Run strict validation for parent 013/009 [5m]
- [x] T018 Run strict validation for grandparent 013 [5m]
- [x] T019 Parse `description.json` and `graph-metadata.json` with Node [3m]
- [x] T020 Grep advisor scripts for similar four-level `..` chains as note-only check [3m]
- [x] T021 Update checklist and implementation summary with evidence [10m]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 requirements verified.
- [x] All P1 requirements verified.
- [x] No `[B]` blocked tasks remain.
- [x] `completion_pct=100` is justified by evidence.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Checklist**: See `checklist.md`.
- **Implementation Summary**: See `implementation-summary.md`.
<!-- /ANCHOR:cross-refs -->
