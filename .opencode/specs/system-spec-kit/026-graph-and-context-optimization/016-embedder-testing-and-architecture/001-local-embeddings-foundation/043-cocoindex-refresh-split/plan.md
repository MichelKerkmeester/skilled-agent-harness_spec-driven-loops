---
title: "Implementation Plan: 042 CocoIndex Refresh/Search Split"
description: "Plan for changing MCP refresh semantics while preserving CLI behavior and backward compatibility."
trigger_phrases:
  - "042 plan"
  - "cocoindex refresh split plan"
importance_tier: "critical"
contextType: "spec"
status: "complete"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/001-local-embeddings-foundation/043-cocoindex-refresh-split"
    last_updated_at: "2026-05-14T16:45:00Z"
    last_updated_by: "codex"
    recent_action: "Planned MCP refresh/search split"
    next_safe_action: "Run targeted CocoIndex tests and strict packet validation"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/tests/test_refresh_split.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000042"
      session_id: "043-cocoindex-refresh-split"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Background refresh deferred as follow-on."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 042 CocoIndex Refresh/Search Split

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3.11 |
| **Framework** | FastMCP, Pydantic, msgspec daemon client |
| **Storage** | Existing CocoIndex daemon and vector index |
| **Testing** | pytest, compileall, editable install, spec validation |

### Overview

Implement the split at the MCP wrapper layer. The existing daemon `client.index(project_root)` call is already separable from `client.search(...)`, so the plan is to move default behavior to search-only while exposing refresh as a separate FastMCP tool.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 035 and 041 context read; evidence points to refresh work dominating request scope.
- [x] `server.py`, `client.py`, and `protocol.py` read before edits.
- [x] Scope excludes CLI default changes and Memory MCP.

### Definition of Done
- [x] MCP search default is `refresh_index=false`.
- [x] Explicit refresh-before-search remains tested.
- [x] `cocoindex_refresh_index` exists and is tested.
- [x] User-facing docs are updated.
- [x] Packet strict validation is run and recorded.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Thin FastMCP wrapper over the existing daemon client.

### Key Components
- **FastMCP search tool**: validates search arguments, optionally refreshes when explicitly requested, delegates search to the daemon client.
- **FastMCP refresh tool**: validates optional path hints, calls daemon `index(project_root)`, returns a request-correlated result.
- **Docs and tests**: keep the external contract and migration path clear.

### Data Flow

`cocoindex_refresh_index` calls `client.index(project_root)` and returns a refresh result. `search` calls `client.search(...)` by default; only explicit `refresh_index=true` runs `client.index(project_root)` first.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| FastMCP search schema | Public MCP contract | Change default `refresh_index` to `false` | `test_mcp_search_refresh_index_default_is_false` |
| FastMCP refresh tool | New MCP contract | Add `cocoindex_refresh_index` | `test_mcp_refresh_index_tool_refreshes_without_searching` |
| CLI search | Existing CLI contract | Unchanged | No `cli.py` edit; compile/test run covers package import |
| Daemon protocol | Existing IPC contract | Unchanged | No `protocol.py` edit in this packet |
| Docs | User-facing behavior | Update one-tool and default-true claims | grep checks and strict validation |

Required inventories:
- Same-class producers: `rg -n "refresh_index|cocoindex_refresh_index" .opencode/skills/mcp-coco-index`.
- Consumers of changed symbols: docs under `README.md`, `SKILL.md`, `references/`, and `feature_catalog/`.
- Matrix axes: omitted vs explicit `refresh_index`, refresh tool vs search tool, CLI unchanged vs MCP changed.
- Algorithm invariant: search-only default must never call `client.index`; explicit refresh paths must still call `client.index`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Scaffold 042 packet.
- [x] Read 041 instrumentation and current `server.py` defaults.
- [x] Confirm refresh call is separable in the MCP wrapper.

### Phase 2: Core Implementation
- [x] Change `search.refresh_index` default to `false`.
- [x] Add `RefreshIndexResultModel`.
- [x] Add `cocoindex_refresh_index(paths?: list[str])`.
- [x] Add tests for omitted default, explicit true compatibility, and refresh without search.
- [x] Update user-facing docs.

### Phase 3: Verification
- [x] Run compileall.
- [x] Run focused and requested pytest commands.
- [x] Run editable install.
- [x] Run strict spec validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | FastMCP schema default and tool dispatch | `tests/test_refresh_split.py` |
| Regression | Existing observability and daemon tests | `tests/test_observability.py`, `tests/test_e2e_daemon.py` |
| Build | Python import/syntax and editable install | `compileall`, `pip install -e . --no-build-isolation --no-deps` |
| Documentation | Packet contract | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Packet 035 | Spec context | Available | Weakens timeout rationale. |
| Packet 041 | Source instrumentation | Available | New refresh tool would lack request-correlation pattern. |
| FastMCP tool manager | Test surface | Available in local venv | Tests would need lower-level function calls. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: MCP clients require implicit refresh by default and cannot be updated to pass `refresh_index=true`.
- **Procedure**: Revert `server.py` default to `true`, remove the new test expectations or change them to explicit-only coverage, and revert docs that describe the default split.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) -> Phase 2 (Core) -> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Gate 3 answer and source reads | Core |
| Core | Setup | Verify |
| Verify | Core | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Under 1 hour |
| Core Implementation | Medium | 1 to 2 hours |
| Verification | Medium | 1 hour |
| **Total** | Medium | **2 to 4 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data migration.
- [x] No feature flag required.
- [x] Backward-compatible explicit `refresh_index=true` path preserved.

### Rollback Procedure
1. Revert the `refresh_index` default in `server.py`.
2. Keep or remove `cocoindex_refresh_index` depending on compatibility needs.
3. Re-run pytest and strict validation.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: No data reversal required.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
035 reliability evidence -> 041 observability -> 042 behavior split
                                      |
                                      v
                         FastMCP server + tests + docs
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| 035 findings | Existing spec docs | Timeout hypothesis | ADR rationale |
| 041 instrumentation | Existing source hooks | reqId and timing pattern | Refresh tool observability |
| 042 code | `server.py` | New MCP behavior | Verification |
| 042 docs | Code and tests | Migration record | Strict validation |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. Read current MCP search handler - critical.
2. Patch FastMCP wrapper and tests - critical.
3. Update docs and ADR - critical.
4. Run verification - critical.

**Total Critical Path**: One autonomous dispatch.

**Parallel Opportunities**:
- Docs and tests can be prepared after the source behavior is understood.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Status | Evidence |
|-----------|--------|----------|
| M1 Source behavior identified | Complete | `server.py` default and `client.index` call site read. |
| M2 Behavior split implemented | Complete | `server.py` patched. |
| M3 Tests added | Complete | `tests/test_refresh_split.py`. |
| M4 Docs updated | Complete | Tool reference, skill docs, README, catalog. |
| M5 Verification complete | Complete | See `implementation-summary.md`. |
<!-- /ANCHOR:milestones -->
