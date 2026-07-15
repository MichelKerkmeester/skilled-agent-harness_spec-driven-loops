---
title: "Feature Specification: Skill graph DB rename"
description: "Rename system-spec-kit's skill metadata index DB so the post-extraction advisor DB is the only skill-graph.sqlite in the repo."
trigger_phrases:
  - "skill graph db rename"
  - "graph metadata index sqlite"
  - "old skill-graph sqlite cleanup"
  - "system skill advisor extraction follow-on"
importance_tier: "critical"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/004-skill-graph/006-system-skill-advisor-package-extraction/007-skill-advisor-db-rename"
    last_updated_at: "2026-05-14T13:20:00Z"
    last_updated_by: "codex"
    recent_action: "Documented implemented Option B rename"
    next_safe_action: "Operator review and commit"
    blockers: []
---
# Feature Specification: Skill graph DB rename

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Implemented |
| **Created** | 2026-05-14 |
| **Spec Folder** | `007-skill-advisor-db-rename` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After the system-skill-advisor extraction, two unrelated databases still used the filename `skill-graph.sqlite`. The advisor scorer DB correctly lives under `.opencode/skills/system-skill-advisor/mcp_server/database/`, but the spec-kit `skill_graph_*` metadata indexer still wrote `skill-graph.sqlite` under `.opencode/skills/system-spec-kit/mcp_server/database/`.

That collision made the old spec-kit path look like an active advisor write target and kept producing stale old-path files during `spec_kit_memory` startup.

### Purpose
Rename only the spec-kit skill metadata index DB so `skill-graph.sqlite` belongs exclusively to system-skill-advisor, while preserving `skill_graph_*` tool ownership inside `spec_kit_memory`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rename spec-kit's `skill_graph_*` DB filename to `graph-metadata-index.sqlite`.
- Update spec-kit production path construction and checkpoint migration scripts.
- Update stale test fixtures that referenced the old spec-kit advisor path.
- Remove the old spec-kit `skill-graph.sqlite`, `skill-graph.sqlite-shm`, and `skill-graph.sqlite-wal` files after smoke verification.
- Create this Level 2 follow-on packet and update the parent child metadata pointer.

### Out of Scope
- Moving `skill_graph_*` MCP tools out of `spec_kit_memory`.
- Changing advisor scoring, lane weights, or semantic projection behavior.
- Changing runtime MCP configs, hook wrappers, plugin bridge code, or code-graph DB ownership.
- Cleaning up other old-path DBs such as `code-graph.sqlite`.

### Files Changed

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts` | Modify | Changed spec-kit metadata index filename to `graph-metadata-index.sqlite`. |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Modify | Reused the exported DB filename constant instead of hardcoding `skill-graph.sqlite`. |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/migrations/create-checkpoint.ts` | Modify | Replaced the old hardcoded database directory with shared config. |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/migrations/restore-checkpoint.ts` | Modify | Replaced the old hardcoded database directory with shared config. |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | Modify | Updated `skill_graph_scan` description text for the new filename. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/skill-graph/README.md` | Modify | Updated local skill-graph DB documentation. |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/skill-advisor/mcp-diagnostics-stress.vitest.ts` | Modify | Pointed stress fixture at the canonical advisor DB path. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/projection-fallback-049-005.vitest.ts` | Modify | Replaced old spec-kit fixture DB path with advisor path. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/legacy/advisor-freshness.vitest.ts` | Modify | Moved legacy freshness fixture paths to the advisor package tree. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/handlers/advisor-status.vitest.ts` | Modify | Replaced old spec-kit fixture DB path with advisor path. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/native-scorer.vitest.ts` | Modify | Replaced an extra stale old-path fixture discovered by repo search. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001:** The spec-kit `skill_graph_*` database filename MUST no longer be `skill-graph.sqlite`.
- **REQ-002:** `skill-graph.sqlite` MUST remain present only for the canonical system-skill-advisor scorer DB.
- **REQ-003:** Spec-kit `skill_graph_*` handlers MUST keep their existing ownership and tool registration.
- **REQ-004:** Smoke-starting `spec_kit_memory` MUST create or use `graph-metadata-index.sqlite` under the spec-kit database directory.
- **REQ-005:** The old spec-kit `skill-graph.sqlite` trio MUST be removed after live handles are released.
- **REQ-006:** Advisor-side fixtures MUST not write to the real old spec-kit database path.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [x] `npm run build --workspace=@spec-kit/mcp-server` passes.
- [x] `timeout 5 node .opencode/skills/system-spec-kit/mcp_server/dist/context-server.js < /dev/null` starts the MCP server and creates `graph-metadata-index.sqlite`.
- [x] `timeout 5 node .opencode/bin/skill-advisor-launcher.cjs < /dev/null` resolves the advisor DB at `.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite`.
- [x] `find .opencode/skills/system-spec-kit/mcp_server/database -maxdepth 1 -name 'skill-graph.sqlite*'` returns no files.
- [x] `find .opencode -name 'skill-graph.sqlite*'` returns only the system-skill-advisor DB trio.
- [x] Package-local advisor Vitest result is recorded against the 006 baseline.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `spec_kit_memory` startup regression | Memory MCP could fail to boot | Build and cold-start smoke were run after generated runtime sync. |
| Risk | Active old DB handles | Old files could not be removed while launchers held WAL/SHM handles | Stale launcher processes were terminated with `SIGTERM`, then `lsof` showed no old DB handles. |
| Dependency | system-skill-advisor canonical DB | Advisor must keep its scorer projection DB | Advisor launcher smoke confirmed the canonical DB path remains unchanged. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **NFR-001:** The change must be a targeted filename/path refactor, not a topology migration.
- **NFR-002:** Runtime smoke checks must prove the memory MCP starts after the rename.
- **NFR-003:** Test fixtures must not write to real old spec-kit DB paths.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **Generated flat runtime:** The flat `dist/context-server.js` runtime needed generated cross-skill imports synced before smoke testing.
- **Temp-only fixtures:** Bare `skill-graph.sqlite` names inside temporary directories are allowed because they do not recreate the old repo path.
- **Existing metadata warning:** Memory MCP startup logs a pre-existing `skill_id` versus folder-name warning for `system-skill-advisor`; it does not block startup or write the old DB filename.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- None for this packet. Option A, moving `skill_graph_*` tools to system-skill-advisor, remains a separate topology decision and was intentionally not executed here.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:complexity -->
## 10. COMPLEXITY

Level 2 is sufficient: the source change is small, but verification crosses production path construction, generated runtime smoke, fixture path triage, and filesystem cleanup.
<!-- /ANCHOR:complexity -->
