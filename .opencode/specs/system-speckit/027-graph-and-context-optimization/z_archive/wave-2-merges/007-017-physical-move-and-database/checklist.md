---
title: "Checklist: Physical move and database copy"
description: "QA gates for Phase 003 physical source move and DB copy."
trigger_phrases:
  - "003 physical move checklist"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/z_archive/wave-2-merges/007-017-physical-move-and-database"
    last_updated_at: "2026-05-14T08:15:39Z"
    last_updated_by: "codex"
    recent_action: "Completed Phase 003 verification checklist"
    next_safe_action: "Carry source DB fallback into later validation cleanup"
    blockers: []
    key_files:
      - "checklist.md"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Checklist: Physical move and database copy

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol
- [x] CHK-200 [P0] Strict validate this packet. (final command exit recorded separately)
- [x] CHK-201 [P0] Source tree moved with count recorded. (108 files)
- [x] CHK-202 [P0] Stress-test tree moved with count recorded. (13 files)
- [x] CHK-203 [P0] Main DB copy verified byte-equal. (`cmp` returned success; WAL/SHM copied)
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] CHK-210 [P0] ADR-001 constraints reviewed. (Q2/Q3/Q5/Q6 applied)
- [x] CHK-211 [P0] Source and destination paths inspected before edits. (source count 108; stress count 13)
- [x] CHK-212 [P1] Plugin loader placement checked before moving plugin entrypoint. (`.opencode/plugins/README.md` confirms entrypoint stays)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] CHK-010 [P0] No code-graph algorithms, scoring, parsing, scan-scope policy, or query semantics changed. (path/config-only)
- [x] CHK-011 [P0] `code-graph-db.ts` imports only the new config boundary. (`../../core/config.js`)
- [x] CHK-012 [P1] New config resolver is small and self-contained. (`SPECKIT_CODE_GRAPH_DB_DIR` plus default database dir)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [x] CHK-020 [P0] File counts recorded. (108 source, 13 stress)
- [x] CHK-021 [P0] DB copy recorded as yes/partial/no. (yes)
- [x] CHK-022 [P1] Phase 004 typecheck covers the post-move import graph. (TS exit 0)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] CHK-FIX-001 [P0] Placeholder dirs removed before the physical move. (placeholder `.gitkeep` files removed)
- [x] CHK-FIX-002 [P0] Source DB remains in old location. (old DB/WAL/SHM still present)
- [x] CHK-FIX-003 [P1] Bridge ownership updated without moving shared message schema. (code-graph bridge moved; shared schema stayed)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
- [x] CHK-220 [P0] No secrets surfaced. (only paths/counts printed)
- [x] CHK-221 [P0] No external network calls. (local shell/npm only)
- [x] CHK-222 [P1] No MCP server was run during the move. (no server command executed)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [x] CHK-040 [P1] Spec/plan/tasks/checklist synchronized. (all Phase 003 docs patched)
- [x] CHK-041 [P1] Implementation summary records counts and DB result. (108/13/yes)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [x] CHK-230 [P0] `code_graph/` lives under system-code-graph. (108 files)
- [x] CHK-231 [P0] `stress_test/code-graph/` lives under system-code-graph. (13 files)
- [x] CHK-232 [P1] Shared plugin message schema stays in system-spec-kit. (`spec-kit-opencode-message-schema.mjs`)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Gate | Status |
|------|--------|
| All P0 items | PASS |
| All P1 items | PASS |
| Strict validation | PASS |
| DB copy | yes |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:perf-verify -->
## Performance Verification
- [x] CHK-110 [P1] No performance-sensitive code path changed beyond import/config relocation. (structural move only)
<!-- /ANCHOR:perf-verify -->
