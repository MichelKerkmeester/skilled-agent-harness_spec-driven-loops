---
title: "Feature Specification: Move advisor source DB and tests"
description: "Physically relocate advisor TS source + skill-graph SQLite + tests from system-spec-kit/mcp_server/skill_advisor/ to system-skill-advisor/mcp_server/. Update imports, DB path resolver, vitest config. Same MCP server still registers the tools."
trigger_phrases:
  - "advisor source move"
  - "skill-graph DB relocation"
  - "015/009/003 source move"
  - "physical advisor extraction"
  - "advisor handlers move"
importance_tier: "critical"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/015-skill-advisor-semantic-lane/009-system-skill-advisor-extraction/003-move-advisor-source-db-and-tests"
    last_updated_at: "2026-05-14T10:45:00Z"
    last_updated_by: "claude"
    recent_action: "Spec authored"
    next_safe_action: "Author plan + tasks"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-move-advisor-source-db-and-tests"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Move advisor source DB and tests

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-05-14 |
| **Branch** | `main` (no feature branch per repo policy) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The skill advisor runtime lives under `system-spec-kit/mcp_server/skill_advisor/` even though ADR-001 (015/009/001) locked a standalone-MCP-with-legacy-bridge shape and child 002 already scaffolded `.opencode/skills/system-skill-advisor/`. As long as the source physically sits inside the spec-kit MCP server tree, the standalone MCP server (child 004) and the consumer cutover (child 005) cannot proceed. The DB path is similarly co-located, which couples advisor write contention with the memory MCP's database directory.

### Purpose
Move advisor TypeScript source (handlers, lib, tools, schemas, scripts, compat), tests, and the skill-graph SQLite file from `system-spec-kit/mcp_server/skill_advisor/` to `system-skill-advisor/mcp_server/`. Update import paths, DB path resolution, and vitest config so the existing `spec_kit_memory` MCP server still registers the same `advisor_*` tools — just sourced from the new location. No standalone server, no runtime config changes, no consumer updates in this packet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Move `mcp_server/skill_advisor/{handlers,lib,tools,schemas,scripts,compat,tests,data,bench}/**` to `system-skill-advisor/mcp_server/{handlers,lib,tools,schemas,scripts,compat,tests,data,bench}/**`.
- Move skill-graph DB path: `mcp_server/database/skill-graph.sqlite*` to `system-skill-advisor/mcp_server/database/skill-graph.sqlite*`.
- Update all internal import paths inside the moved files.
- Update DB path resolver(s) — anything that computes the skill-graph SQLite location.
- Update `mcp_server/src/context-server.ts` advisor handler registrations to point at the new module paths.
- Update vitest config (and tsconfig if needed) so the moved tests still discover + resolve.
- Re-run vitest skill_advisor: parity should resolve from 4 failures toward 0 (4 → ≤ 3 target from spec 002).

### Out of Scope
- Standalone MCP launcher (`.opencode/bin/skill-advisor-launcher.cjs`) — owned by child 004.
- Runtime config wiring (.codex/.claude/.gemini/opencode.json) — child 004.
- Hook wrapper updates, plugin bridge, Python shim, doctor:update workflow — child 005.
- Removing the now-empty `system-spec-kit/mcp_server/skill_advisor/` directory + stale docs — child 006.
- `advisor_*` MCP tool-id renames — keep stable per ADR-001 legacy-bridge.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/handlers/**` | Delete (via move) | Source tree relocates |
| `.opencode/skills/system-skill-advisor/mcp_server/handlers/**` | Create (via move) | Destination for handlers |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/{lib,tools,schemas,scripts,compat,tests,data,bench}/**` | Delete (via move) | Same pattern as handlers |
| `.opencode/skills/system-skill-advisor/mcp_server/{lib,tools,schemas,scripts,compat,tests,data,bench}/**` | Create (via move) | Destinations |
| `.opencode/skills/system-spec-kit/mcp_server/database/skill-graph.sqlite{,-shm,-wal}` | Delete (via move) | DB relocates |
| `.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite{,-shm,-wal}` | Create (via move) | DB destination |
| `.opencode/skills/system-spec-kit/mcp_server/src/context-server.ts` | Modify | Advisor handler import paths |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/freshness/db-path-resolver.ts` (or equivalent) | Modify-via-move | DB resolver points at new dir |
| `.opencode/skills/system-spec-kit/mcp_server/tsconfig.json` / `vitest.config.*` | Modify | Path mappings if any |
| `.opencode/skills/system-skill-advisor/mcp_server/tsconfig.json` | Create | Local tsconfig for moved package |
| `.opencode/skills/system-skill-advisor/mcp_server/vitest.config.*` | Create | Test config for moved tests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All advisor TS source moves to `system-skill-advisor/mcp_server/` | `find .opencode/skills/system-spec-kit/mcp_server/skill_advisor -type f` returns empty (or only ignorable artifacts) |
| REQ-002 | Skill-graph SQLite + companion files relocate | New DB path is the active write location; old path absent post-move |
| REQ-003 | All import paths inside moved files resolve | `tsc --noEmit` passes from the destination tsconfig |
| REQ-004 | `mcp_server/src/context-server.ts` registers advisor handlers from new paths | Grep shows no `mcp_server/skill_advisor/` import remains in context-server.ts |
| REQ-005 | Vitest skill_advisor parity ≤ 3 failures | Failure count drops from 4 (post-002) to ≤ 3 |
| REQ-006 | No `advisor_*` MCP tool-id renames | All existing tool ids stay verbatim |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | DB path resolver consults `SYSTEM_SKILL_ADVISOR_DB_DIR` env override before fallback | Env-based override works for tests + ops |
| REQ-008 | `system-skill-advisor/mcp_server/README.md` updated from "child 003 drop target" stub to reflect actual landed content | README describes the now-present directories |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `git status` post-move shows only the rename block under `system-spec-kit/mcp_server/skill_advisor/` → `system-skill-advisor/mcp_server/` plus the context-server.ts edit, the DB move, and tsconfig/vitest updates.
- **SC-002**: `npm run typecheck` from `system-spec-kit/mcp_server/` is exit-0.
- **SC-003**: Vitest skill_advisor parity ≤ 3 (down from 4).
- **SC-004**: Memory MCP server still serves all `advisor_*` tools at the same ids; advisor_recommend smoke returns shaped output.
- **SC-005**: Strict-validate green at 015/009/003 + 015/009 + 015.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Import path breakage during move | High — vitest + typecheck fail | Use `git mv` so blame survives; run typecheck after each batch of imports |
| Risk | Hidden absolute path in tests/fixtures | Medium — tests pass locally, fail in CI | Grep entire moved tree for `system-spec-kit/mcp_server/skill_advisor` strings post-move |
| Risk | Shadow-deltas data file fragility (data/shadow-deltas.jsonl is vitest-written) | Low — file recreated on test run | Allow vitest to regenerate after move; do not preserve historical deltas |
| Risk | DB path resolver default vs env override drift | Medium — wrong DB used silently | Add explicit test that resolver returns new path absent env, env path present env |
| Dependency | 015/009/001 ADR-001 | Locks the shape | ADR shipped 07c612f8a |
| Dependency | 015/009/002 scaffold | Provides the destination tree | Shipped 004c4f2cc; envelope ready |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: skill_graph_scan completion stays under 30s on the 18-skill set post-move (no regression).
- **NFR-P02**: advisor_recommend p50 latency stays within ± 20% of pre-move baseline.

### Security
- **NFR-S01**: No secrets in moved tree; verify before commit via grep for known token patterns.
- **NFR-S02**: New DB path inherits same filesystem permissions as old path (700).

### Reliability
- **NFR-R01**: DB move is atomic — either both source and target SQLite files (plus -shm/-wal) move together, or rollback.
- **NFR-R02**: Test suite must remain runnable from either `system-spec-kit/mcp_server` (parent tsconfig) or `system-skill-advisor/mcp_server` (local tsconfig). At least one path is required.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Skill-graph DB exists at OLD path AND NEW path before move: refuse — operator must reconcile first.
- Skill-graph DB exists at NEIGHBOR path only (`-shm`/`-wal` without main file): treat as crash recovery — move all three together.

### Error Scenarios
- Typecheck fails after partial import rewrites: halt and roll back the batch; do not commit broken state.
- A test fixture references the old path absolutely: hardcoded path is a bug to fix in this packet, not work to defer.

### State Transitions
- Partial move (some files relocated, some still at old path): not a stable state. Either complete or revert.
- Memory MCP server running mid-move: must restart after the move to pick up new module paths.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | ~30-50 files moved + import rewrites + DB move + tsconfig + vitest config |
| Risk | 14/25 | Mostly mechanical with one nontrivial risk: hidden absolute paths in tests |
| Research | 6/20 | ADR-001 + 002 scaffold already locked the shape; no further investigation needed |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should the new `system-skill-advisor/mcp_server/tsconfig.json` extend the spec-kit tsconfig or stand alone? (Default proposal: extend, to share path mappings until child 004 splits the server.)
- Does the legacy `bench/code-graph-*.bench.ts` set belong under the advisor package, or should it stay under spec-kit's code-graph? (Default proposal: bench files relocate with the advisor since they were sitting in `skill_advisor/bench/`.)
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
