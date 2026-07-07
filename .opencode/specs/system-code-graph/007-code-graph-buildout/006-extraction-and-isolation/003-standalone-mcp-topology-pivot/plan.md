---
title: "Implementation Plan: MCP topology pivot"
description: "Steps for ADR-002 standalone MCP topology pivot."
trigger_phrases:
  - "mcp topology pivot"
  - "system code graph standalone mcp"
  - "ADR-002 code graph topology"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/007-code-graph-buildout/006-extraction-and-isolation/003-standalone-mcp-topology-pivot"
    last_updated_at: "2026-05-14T09:24:15Z"
    last_updated_by: "claude"
    recent_action: "Validated ADR-002 standalone MCP topology pivot"
    next_safe_action: "Restart MCP children to pick up system_code_graph"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000007140007"
      session_id: "007-mcp-topology-pivot"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Implementation Plan: MCP topology pivot

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## SUMMARY

Recalibrate 001-006 metadata, author ADR-002, move code-graph MCP schemas out of spec_kit_memory, create standalone system_code_graph MCP server infrastructure, relocate remaining code-graph-owned assets, update runtime grants/config, clean stale database/path issues, and validate.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## QUALITY GATES

### Definition of Ready
- [x] Gate 3 pre-answered for 014 phase parent and listed target surfaces.
- [x] User explicitly reversed ADR-001 Q3.
- [x] User forbade behavior changes.

### Definition of Done
- [x] 007 strict validation passes. Evidence: final `validate.sh 007-mcp-topology-pivot --strict` exit recorded in implementation-summary.md.
- [x] Recursive 014 validation passes. Evidence: final `validate.sh 013-system-code-graph-extraction --strict --recursive` exit recorded in implementation-summary.md.
- [x] Typecheck passes for system-spec-kit and system-code-graph. Evidence: `npx tsc --noEmit -p mcp_server/tsconfig.json` and local `tsc --noEmit -p tsconfig.json` exit 0.
- [x] Smoke Vitest passes at new system-code-graph location. Evidence: `vitest run mcp_server/tests/code-graph-scan.vitest.ts` passed 39 tests.
- [x] Final metrics emitted. Evidence: Required dispatch metrics are recorded in implementation-summary.md and final response.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## ARCHITECTURE

| Component | Decision |
|-----------|----------|
| MCP server | Standalone `system_code_graph` process launched by `.opencode/bin/system-code-graph-launcher.cjs`. |
| Schemas | `CODE_GRAPH_TOOL_SCHEMAS` owned by system-code-graph. |
| Tool IDs | Stable: `code_graph_*`, `ccc_*`, `detect_changes`. |
| MCP namespace | Changes from `mcp__mk_spec_memory__*` to `mcp__system_code_graph__*`. |
| Direct imports | Preserved for system-spec-kit handlers/hooks/session code. |
| Database | Preserved at system-code-graph/mcp_server/database with env override. |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## IMPLEMENTATION PHASES

### Phase 1: Setup
- Recalibrate 001-006 graph metadata and summaries.
- Scaffold 007 packet docs and ADR-002.

### Phase 2: Implementation
- Create launcher, entrypoint, and code-graph tool schemas.
- Remove code-graph schemas and dispatch from spec_kit_memory.
- Move remaining stress/bridge/external test ownership.
- Update opencode.json, grants, docs, and path references.
- Delete stale stub DB when safe.

### Phase 3: Verification
- Validate 007 packet.
- Typecheck both packages.
- Run smoke Vitest.
- Recursive validate 014 parent.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## TESTING STRATEGY

| Layer | What | How |
|-------|------|-----|
| Spec | 007 packet contract | validate.sh --strict |
| Parent | 014 phase tree | validate.sh --strict --recursive |
| TypeScript | Imports and MCP entrypoints | npx tsc --noEmit |
| Smoke | Moved code-graph tests | vitest run mcp_server/tests/code-graph-scan.vitest.ts |
| Config | opencode.json registry | JSON parse and system_code_graph assertion |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## DEPENDENCIES

- ADR-001 Q2, Q4, Q5, Q6, Q7, and Q8 remain context.
- Current flattened system-code-graph mcp_server layout is authoritative.
- Existing system-spec-kit shared utility imports remain available.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## ROLLBACK PLAN

Revert ADR-002 changes: restore code-graph tool schemas and dispatcher registration to spec_kit_memory, remove system_code_graph opencode entry and launcher, and mark ADR-001 Q3 co-resident topology active again.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## PHASE DEPENDENCIES

| Phase | Depends On | Why |
|-------|------------|-----|
| Setup | 001-006 complete | Recalibration must reflect finished extraction. |
| Implementation | ADR-002 | Runtime changes follow topology decision. |
| Verification | Implementation | Validate after all ownership paths settle. |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## EFFORT ESTIMATE

| Component | Estimate |
|-----------|----------|
| Metadata/docs | Medium |
| MCP schemas/entrypoint/config | Medium |
| Test ownership/path cleanup | Medium |
| Validation iteration | Medium |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## ENHANCED ROLLBACK

If standalone startup fails after restart, restore the spec_kit_memory schema/dispatcher entries from git and remove the system_code_graph MCP entry. The code/database physical ownership can remain under system-code-graph because ADR-001 Q2/Q5 still support that shape.
<!-- /ANCHOR:enhanced-rollback -->
