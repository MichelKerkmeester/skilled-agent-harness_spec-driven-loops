---
title: "Implementation Summary: Move advisor source DB and tests"
description: "Pending; filled post-codex with the per-batch edit ledger + parity-test delta + DB-isolation evidence."
trigger_phrases:
  - "advisor source move summary"
  - "015/009/003 ledger"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/015-skill-advisor-semantic-lane/009-system-skill-advisor-extraction/003-move-advisor-source-db-and-tests"
    last_updated_at: "2026-05-14T10:45:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded packet"
    next_safe_action: "Dispatch codex"
    blockers: []
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-move-advisor-source-db-and-tests"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Implementation Summary: Move advisor source DB and tests

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-05-14 |
| **Branch** | `main` (no feature branch per repo policy) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

To be filled post-codex. Expected artifacts:

- Renames under `git mv`: all advisor source + DB + tests relocate from `system-spec-kit/mcp_server/skill_advisor/` to `system-skill-advisor/mcp_server/`
- Import-path rewrites inside moved files
- `system-spec-kit/mcp_server/src/context-server.ts` advisor handler imports updated
- New `system-skill-advisor/mcp_server/tsconfig.json` (extends spec-kit) + `vitest.config.*`
- DB path resolver honoring `SYSTEM_SKILL_ADVISOR_DB_DIR` env override
- `system-skill-advisor/mcp_server/README.md` updated to reflect landed content
- Parity test delta: 4 → ≤ 3 (expected)
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

To be filled. Plan: cli-codex gpt-5.5 high fast executes the 4-batch Phase 2 move sequence with typecheck gates between batches. Expected wall: 45-85 min for the full move + validation cycle.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## KEY DECISIONS

| Decision | Why |
|----------|-----|
| `git mv` for all relocations | Preserves blame; renames cleanly identified in git history |
| Memory MCP server still registers advisor tools | Standalone launcher is child 004's deliverable; this packet only moves source |
| tsconfig extends spec-kit | Avoids second `node_modules` install; child 004 may split later |
| DB env override | `SYSTEM_SKILL_ADVISOR_DB_DIR` lets tests use tmpdir + child 004 reuse for launcher |
| Bench files relocate with advisor | They lived in `skill_advisor/bench/` even though they target code-graph; future cleanup can move under system-code-graph |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Gate | Status | Evidence |
|------|--------|----------|
| Strict spec validation 003 | Pending | `validate.sh --strict` |
| Strict spec validation 015/009 + 015 | Pending | `validate.sh --strict` |
| Typecheck | Pending | `npm run typecheck` from `system-spec-kit/mcp_server/` |
| Vitest skill_advisor parity ≤ 3 | Pending | `vitest run skill_advisor` |
| MCP advisor_recommend smoke | Pending | Live tool call returns shaped output |
| Grep sweep for old path | Pending | No live `*.ts` references the old `skill_advisor/` prefix |
| DB isolation | Pending | NEW path SQLite mtime advances; OLD path absent |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Move only**: standalone MCP launcher is child 004's deliverable. Memory MCP still registers advisor tools post-move.
2. **Consumers unchanged**: hooks, plugin bridge, Python shim, doctor:update workflow stay pointed at the existing tool ids; physical paths change only inside MCP server registration.
3. **Old directory soft-cleanup**: removing the now-empty `system-spec-kit/mcp_server/skill_advisor/` directory + stale doc references is child 006's job.
4. **Bench file home**: `code-graph-*.bench.ts` relocates with the advisor for now; future packet may move under system-code-graph.
<!-- /ANCHOR:limitations -->
