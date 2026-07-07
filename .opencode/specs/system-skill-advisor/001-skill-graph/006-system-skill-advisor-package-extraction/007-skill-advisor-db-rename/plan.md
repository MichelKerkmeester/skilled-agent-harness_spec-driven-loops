---
title: "Implementation Plan: Skill graph DB rename"
description: "Targeted Option B rename for the spec-kit skill metadata index DB, preserving tool ownership while removing old-path skill-graph.sqlite writes."
trigger_phrases:
  - "skill graph db rename plan"
  - "graph metadata index implementation"
  - "option b rename"
importance_tier: "critical"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/007-skill-advisor-db-rename"
    last_updated_at: "2026-05-14T13:20:00Z"
    last_updated_by: "codex"
    recent_action: "Documented implemented plan"
    next_safe_action: "Operator review and commit"
    blockers: []
---
# Implementation Plan: Skill graph DB rename

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js MCP servers |
| **Storage** | SQLite via spec-kit and advisor DB directories |
| **Testing** | npm build, Vitest, launcher smoke checks, filesystem checks |

### Overview
Option B wins here because the two databases serve different consumers. The advisor scorer DB should keep `skill-graph.sqlite` under `system-skill-advisor`, while the spec-kit `skill_graph_*` metadata indexer can use a precise non-conflicting filename without changing MCP topology.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented.
- [x] Success criteria measurable by build, smoke, test, and filesystem checks.
- [x] Dependencies identified: spec-kit MCP server, system-skill-advisor DB, generated flat runtime.

### Definition of Done
- [x] Old spec-kit `skill-graph.sqlite*` files absent.
- [x] New spec-kit `graph-metadata-index.sqlite` present.
- [x] Canonical advisor `skill-graph.sqlite` still present.
- [x] Verification outcomes recorded in packet docs.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Spec-kit continues to own the `skill_graph_*` MCP tools and their metadata index. The only architecture change is the spec-kit DB filename:

| Store | Owner | Path |
|-------|-------|------|
| Skill metadata index | `spec_kit_memory` / system-spec-kit | `.opencode/skills/system-spec-kit/mcp_server/database/graph-metadata-index.sqlite` |
| Advisor scorer projection | system-skill-advisor | `.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite` |

This avoids coupling memory MCP startup to advisor internals and avoids a broad tool move.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Trace and Rename
- Trace `SKILL_GRAPH_DATABASE_PATH` from `context-server.ts` into `initSkillGraphDb()` and `indexSkillMetadata()`.
- Rename `DB_FILENAME` in `lib/skill-graph/skill-graph-db.ts` to `graph-metadata-index.sqlite`.
- Make `context-server.ts` use the exported constant.

### Phase 2: Call-Site and Fixture Cleanup
- Replace spec-kit checkpoint migration hardcoded DB paths with shared `DATABASE_DIR`.
- Update `skill_graph_scan` schema documentation and skill-graph README text.
- Move stale advisor fixtures away from the old spec-kit DB path; leave temp-only bare filenames unchanged.

### Phase 3: Verification and Filesystem Cleanup
- Build spec-kit MCP server.
- Run advisor package Vitest and record the delta from the 006 baseline.
- Smoke-start memory MCP and advisor launcher.
- Stop stale launcher processes that still hold the old DB, then delete only the old `skill-graph.sqlite` trio.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Build | TypeScript compile for spec-kit MCP server | `npm run build --workspace=@spec-kit/mcp-server` |
| Package | Advisor-side fixture regression coverage | `npm test` in `system-skill-advisor/mcp_server` |
| Targeted stress | Spec-kit skill-advisor diagnostic fixture | Vitest stress config |
| Smoke | Memory MCP and advisor launcher cold-start | `timeout 5 node ...` |
| Filesystem | Old/new DB path assertions | `find`, `ls`, `lsof` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `@spec-kit/mcp-server` build | Internal | Green | Cannot validate source compile. |
| `system-skill-advisor` canonical DB | Internal | Green | Advisor DB ownership check would fail. |
| Generated flat `dist` runtime | Internal | Green after sync | Memory MCP smoke would exercise stale code. |
| Existing launcher processes | Runtime | Cleared | Old DB files could not be removed while held. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Rollback is mechanical if the memory MCP cannot start: restore `DB_FILENAME` to `skill-graph.sqlite`, restore the previous `context-server.ts` hardcoded path, rebuild, and leave the old DB trio in place. This was not needed; the post-rename smoke reached `Context MCP server running on stdio` and produced `graph-metadata-index.sqlite`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Trace and Rename | Required file reads | Call-site cleanup |
| Call-Site and Fixture Cleanup | Trace and Rename | Verification |
| Verification and Filesystem Cleanup | Build and smoke success | Completion claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Actual Effort |
|-------|------------|---------------|
| Trace and Rename | Low | Completed in-session |
| Fixture Triage | Medium | Completed in-session |
| Runtime Smoke and Cleanup | Medium | Completed in-session |
| Packet Documentation | Low | Completed in-session |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

Rollback trigger is memory MCP startup failure after the rename. Procedure: restore the old filename constant and context-server path, rebuild, rerun memory MCP smoke, and leave the old DB files untouched. No rollback was required.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:verification -->
## 8. VERIFICATION

| Check | Result |
|-------|--------|
| `npm run build --workspace=@spec-kit/mcp-server` | PASS |
| `npm test` in `system-skill-advisor/mcp_server` | FAIL overall, 164/224 passed; baseline was 153/224 in 006 |
| `vitest run --config vitest.stress.config.ts stress_test/skill-advisor/mcp-diagnostics-stress.vitest.ts` | PASS, 3 tests |
| Memory MCP cold-start | PASS; server started and created `graph-metadata-index.sqlite` |
| Advisor launcher cold-start | PASS; resolved canonical advisor DB path |
| Old spec-kit DB cleanup | PASS; old `skill-graph.sqlite*` files absent |
<!-- /ANCHOR:verification -->
