---
title: "Tasks: Phase 001 Discovery Impact Map"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "070 phase 001 tasks"
  - "sk-deep discovery tasks"
  - "impact inventory tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/070-sk-deep-rename/001-discovery-impact-map"
    last_updated_at: "2026-05-05T18:30:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Completed discovery inventory and validation artifacts"
    next_safe_action: "Hand off canonical inventory to Phase 002"
    blockers: []
    key_files:
      - "tasks.md"
      - "inventory.md"
      - "inventory.tsv"
      - "edge-cases.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-05-phase-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Phase 001 Discovery Impact Map

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
- [x] T002 Read parent pre-discovery resource map (`../resource-map.md`)
- [x] T003 Author Phase 001 Level 2 planning artifacts (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`)
- [x] T004 Author initial in-progress graph metadata (`graph-metadata.json`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Run primary exact text grep over requested roots and extensions
- [x] T006 Count per-file matches for `sk-deep-review`
- [x] T007 Count per-file matches for `sk-deep-research`
- [x] T008 Compute unique union, review-only, research-only, and both-name file sets
- [x] T009 Classify every matching file into the requested `area` taxonomy
- [x] T010 Assign downstream phase ownership (`002`, `003`, `004`, `005`) for every inventory row
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 [P] Run filename embed audit for files matching `*sk-deep-*`
- [x] T012 [P] Run folder embed audit for directories matching `sk-deep-*`
- [x] T013 [P] Run MCP TS/JS string literal grep in `.opencode/skills/system-spec-kit/mcp_server`
- [x] T014 [P] Run SQLite/database name audit without editing binary database files
- [x] T015 [P] Run snapshot fixture audit for `*.snap` and `*-snapshots`
- [x] T016 [P] Run active graph metadata audit for `.opencode/specs/**/graph-metadata.json`
- [x] T017 [P] Audit code graph database/file-name surfaces for stale indexed names
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Inventory Synthesis

- [x] T018 Write `inventory.tsv` with required columns and one row per active matching file
- [x] T019 Write `inventory.md` with total counts, category breakdown, top files, edge cases, and phase-order recommendation
- [x] T020 Write `edge-cases.md` with snippets and expected handling
- [x] T021 Update tasks and checklist with evidence
- [x] T022 Update `graph-metadata.json` status to `complete`
- [x] T023 Run child strict validation
- [x] T024 Run parent strict validation
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `inventory.md`, `inventory.tsv`, and `edge-cases.md` exist and match requested structure
- [x] Child and parent strict validation exit 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Parent Resource Map**: See `../resource-map.md`
<!-- /ANCHOR:cross-refs -->
