---
title: "Implementation Summary: Skill graph DB rename"
description: "Spec-kit now writes its skill metadata index to graph-metadata-index.sqlite, leaving skill-graph.sqlite exclusively for system-skill-advisor."
trigger_phrases:
  - "skill graph db rename implementation"
  - "graph metadata index sqlite summary"
importance_tier: "critical"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-package-extraction/007-skill-advisor-db-rename"
    last_updated_at: "2026-05-14T13:20:00Z"
    last_updated_by: "codex"
    recent_action: "Renamed spec-kit skill metadata DB and removed old spec-kit skill-graph.sqlite files"
    next_safe_action: "Operator review and commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/context-server.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/database/graph-metadata-index.sqlite"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Option B was used because it eliminates the filename collision without moving skill_graph_* tools."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `007-skill-advisor-db-rename` |
| **Completed** | 2026-05-14 |
| **Level** | 2 |
| **Status** | Implemented |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Spec-kit now stores the `skill_graph_*` metadata index in `graph-metadata-index.sqlite`, so the old spec-kit database directory no longer produces `skill-graph.sqlite`. The advisor scorer DB keeps the `skill-graph.sqlite` filename under `system-skill-advisor`, which makes ownership clear without moving MCP tools.

### Rename and Path Wiring

`DB_FILENAME` in `lib/skill-graph/skill-graph-db.ts` was renamed to `graph-metadata-index.sqlite`, and `context-server.ts` now uses that exported constant for `SKILL_GRAPH_DATABASE_PATH`. The checkpoint migration scripts now use the shared `DATABASE_DIR`, removing stale hardcoded old-path construction.

### Fixture Cleanup

Five stale fixtures were migrated away from the old spec-kit path. Two fixtures were left unchanged because they create a temporary bare `skill-graph.sqlite` inside an isolated temp directory and do not write to repo paths.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts` | Modified | Renamed spec-kit DB filename. |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Modified | Uses exported filename constant. |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/migrations/create-checkpoint.ts` | Modified | Uses shared database directory. |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/migrations/restore-checkpoint.ts` | Modified | Uses shared database directory. |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | Modified | Documents new filename. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/skill-graph/README.md` | Modified | Documents new filename. |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/skill-advisor/mcp-diagnostics-stress.vitest.ts` | Modified | Migrates advisor fixture DB path. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/projection-fallback-049-005.vitest.ts` | Modified | Migrates advisor fixture DB path. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/legacy/advisor-freshness.vitest.ts` | Modified | Migrates legacy fixture source paths. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/handlers/advisor-status.vitest.ts` | Modified | Migrates advisor status fixture DB path. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/native-scorer.vitest.ts` | Modified | Migrates extra stale fixture DB path discovered by search. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation followed the lower-risk Option B path: rename the spec-kit metadata index DB and leave `skill_graph_*` tool registration in `spec_kit_memory`. After the source build passed, the generated flat runtime was synced for smoke testing because `dist/context-server.js` is the command exercised by the launcher path.

Stale launcher processes still held the old DB WAL/SHM handles. They were terminated with `SIGTERM`, verified clear with `lsof`, and only then were the old `skill-graph.sqlite`, `skill-graph.sqlite-shm`, and `skill-graph.sqlite-wal` files removed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Rename to `graph-metadata-index.sqlite` | The spec-kit DB indexes skill `graph-metadata.json`, not advisor scoring state. |
| Keep `skill_graph_*` tools in `spec_kit_memory` | Moving tools would be a broader topology change outside this cleanup. |
| Preserve advisor `skill-graph.sqlite` | It is the canonical scorer projection DB after extraction. |
| Leave temp-only bare DB fixtures unchanged | They do not recreate old repo-path writes. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Spec-kit build | PASS |
| Advisor package Vitest | FAIL overall, 164/224 passing; +11 passing tests versus 006 baseline |
| Targeted spec-kit skill-advisor stress Vitest | PASS, 3 tests |
| Memory MCP smoke | PASS; stdio server started and created `graph-metadata-index.sqlite` |
| Advisor launcher smoke | PASS; canonical advisor DB path preserved |
| Old spec-kit DB cleanup | PASS; old `skill-graph.sqlite*` files removed |

Memory MCP startup still logs an existing skill metadata validation warning for `.opencode/skills/system-skill-advisor/graph-metadata.json` where `skill_id` does not match the folder name. That is separate from the DB filename path and did not stop MCP startup.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The broader advisor package suite still fails overall at 164/224 passing tests. This is an improvement over the 006 baseline of 153/224, but remaining failures are outside this DB rename packet.
2. The memory MCP startup scan still reports the existing `system-skill-advisor/graph-metadata.json` skill-id mismatch. That is separate from old-path DB writes.
3. Generated flat `dist` runtime sync was required for local smoke testing; source build remained the committed source gate.
<!-- /ANCHOR:limitations -->
