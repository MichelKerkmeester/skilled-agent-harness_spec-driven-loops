---
title: "Tasks: Physical move and database copy"
description: "Task list for moving code_graph source, stress tests, bridge, and copied DB into system-code-graph."
trigger_phrases:
  - "003 physical move tasks"
importance_tier: "important"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-code-graph/017-physical-move-and-database"
    last_updated_at: "2026-05-14T08:15:39Z"
    last_updated_by: "codex"
    recent_action: "Completed Phase 003 task ledger"
    next_safe_action: "Phase 004 validation and later Phase 006 cleanup"
    blockers: []
    key_files:
      - "tasks.md"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Tasks: Physical move and database copy

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## TASK NOTATION

| Marker | Meaning |
|--------|---------|
| `[x]` | Open |
| `[x]` | Done |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

- [x] T001 Record source `code_graph/` file count.
- [x] T002 Record source `stress_test/code-graph/` file count.
- [x] T003 Confirm Phase 002 placeholders are placeholder-only.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T010 Remove destination placeholder `.gitkeep` files and empty dirs.
- [x] T011 Move `mcp_server/code_graph/` to system-code-graph with `git mv`.
- [x] T012 Move `mcp_server/stress_test/code-graph/` to system-code-graph with `git mv`.
- [x] T013 Move code-graph-specific bridge `.mjs` to system-code-graph bridge folder.
- [x] T014 Copy `code-graph.sqlite` and available WAL/SHM files to system-code-graph database folder.
- [x] T015 Add `mcp_server/core/config.ts` in system-code-graph.
- [x] T016 Update moved `code-graph-db.ts` to import the new config.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T020 Verify moved source file count.
- [x] T021 Verify moved stress-test file count.
- [x] T022 Verify main DB copy with `cmp`.
- [x] T023 Inventory boundary-crossing imports in moved tree.
- [x] T024 Strict-validate this packet. (exit recorded in final validation)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- [x] All Phase 1-3 tasks `[x]`.
- [x] No `[B]` blockers.
- [x] DB copy result recorded in `implementation-summary.md`. (DB_COPIED=yes)
- [x] Source DB fallback remains present. (`system-spec-kit/mcp_server/database/code-graph.sqlite*` still exists)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- Parent: `005-code-graph/013-system-code-graph-extraction`
- Predecessor: `014/002-scaffold-skill`
- Atomic sibling: `014/004-rewire-consumers-and-tool-registration`
- ADR: `014/001-design-and-decision-record/decision-record.md`
<!-- /ANCHOR:cross-refs -->
