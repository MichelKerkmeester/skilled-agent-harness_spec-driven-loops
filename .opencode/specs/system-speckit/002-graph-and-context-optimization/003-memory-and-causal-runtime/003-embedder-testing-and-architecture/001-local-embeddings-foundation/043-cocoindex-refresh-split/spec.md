---
title: "042 CocoIndex Refresh/Search Split"
description: "Changes MCP search to avoid implicit index refresh by default and adds an explicit MCP refresh tool."
trigger_phrases:
  - "042 cocoindex refresh split"
  - "cocoindex refresh_index default false"
  - "cocoindex_refresh_index"
  - "mcp search refresh split"
importance_tier: "critical"
contextType: "spec"
status: "complete"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/043-cocoindex-refresh-split"
    last_updated_at: "2026-05-14T16:45:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented explicit CocoIndex MCP refresh split"
    next_safe_action: "Use cocoindex_refresh_index before search batches when code changed"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/tests/test_refresh_split.py"
      - ".opencode/skills/mcp-coco-index/references/tool_reference.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000042"
      session_id: "043-cocoindex-refresh-split"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Gate 3: E - phase folder 043-cocoindex-refresh-split"
      - "Branch: main; no commits"
      - "Memory MCP and SpawnAgent: forbidden"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: 042 CocoIndex Refresh/Search Split

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

MCP `search` now defaults `refresh_index=false`, so a normal semantic query no longer spends the same request budget on index refresh work. A new `cocoindex_refresh_index` MCP tool gives callers an explicit way to refresh before a search batch, while `search(refresh_index=true)` remains supported for backward compatibility.

**Key Decisions**: flip only the MCP default, add explicit refresh, leave CLI defaults unchanged.

**Critical Dependencies**: packet 035's timeout hypothesis and packet 041's observability hooks.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-05-14 |
| **Branch** | main (no branch, no commit per dispatch) |
| **Parent Spec** | `../spec.md` (`014-local-embeddings-migration`) |
| **Phase** | 042 |
| **Predecessors** | `035-cocoindex-mcp-reliability`, `042-cocoindex-ipc-observability` |
| **Level Note** | ADR required by dispatch makes strict validation Level 3; implementation scope is Level 2 sized. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Packet 035 found that MCP requests can time out while CocoIndex continues daemon-side work, and packet 041 added the request IDs and timings needed to see that cost. The remaining behavior problem was that MCP `search` defaulted `refresh_index=true`, so ordinary searches could trigger indexing inside the same request scope and exceed the client's latency budget.

### Purpose

Make search predictable by default, make refresh explicit and scriptable, and preserve opt-in refresh-before-search compatibility for existing callers.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Change the FastMCP `search.refresh_index` default from `true` to `false`.
- Preserve explicit `search(refresh_index=true)` behavior.
- Add `cocoindex_refresh_index(paths?: list[str])` as a standalone MCP tool that calls the existing daemon refresh path without performing search.
- Update mcp-coco-index user-facing docs that describe MCP tool count and refresh defaults.
- Add focused pytest coverage for default no-refresh search, explicit refresh-before-search, and refresh-without-search.
- Record ADR-004 for the contract change.

### Out of Scope

- CLI default changes; `ccc search --refresh` remains opt-in.
- Spec Kit Memory MCP daemon changes.
- Daemon protocol changes for path-scoped indexing.
- Background periodic refresh; documented as a follow-on because it is not needed for the contract split.
- Branches, commits, PRs, network access, Memory MCP calls, or sub-agents.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py` | Modify | Flip MCP search default and register `cocoindex_refresh_index`. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_refresh_split.py` | Create | Cover the three requested T042 behaviors. |
| `.opencode/skills/mcp-coco-index/references/tool_reference.md` | Modify | Document the new MCP tool and default. |
| `.opencode/skills/mcp-coco-index/SKILL.md` | Modify | Update skill guidance for explicit refresh. |
| `.opencode/skills/mcp-coco-index/README.md` | Modify | Update public behavior docs and FAQ. |
| `.opencode/skills/mcp-coco-index/references/search_patterns.md` | Modify | Update multi-query guidance. |
| `.opencode/skills/mcp-coco-index/references/cross_cli_playbook.md` | Modify | Update cross-CLI MCP usage guidance. |
| `.opencode/skills/mcp-coco-index/feature_catalog/feature_catalog.md` | Modify | Update MCP feature summary. |
| `.opencode/skills/mcp-coco-index/feature_catalog/02--mcp-server/01-search-tool-contract.md` | Modify | Update search contract feature entry. |
| `.opencode/skills/mcp-coco-index/feature_catalog/02--mcp-server/02-refresh-index-default.md` | Modify | Update refresh default feature entry. |
| `.opencode/skills/mcp-coco-index/scripts/common.sh` | Modify | Update readiness success guidance string. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/043-cocoindex-refresh-split/` | Create | Packet docs and metadata. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | MCP search default changes to no-refresh. | FastMCP schema exposes `refresh_index` default `false`, and omitted argument does not call `client.index`. |
| REQ-002 | Explicit refresh-before-search remains compatible. | `search(refresh_index=true)` calls `client.index(project_root)` before `client.search`. |
| REQ-003 | New refresh tool exists. | `cocoindex_refresh_index` is registered and calls `client.index(project_root)` without calling `client.search`. |
| REQ-004 | CLI behavior remains unchanged. | `cli.py` and `DaemonClient.search` receive no refresh default change. |
| REQ-005 | User-facing docs describe the new contract. | Tool reference and skill docs no longer claim MCP has only one tool or default refresh true. |
| REQ-006 | ADR captures the decision. | `decision-record.md` contains ADR-004 with status Accepted. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Observability stays request-scoped. | Refresh tool responses include `reqId`, and wrapper logs parse, refresh, serialization, and response size stages. |
| REQ-008 | Path hint limitation is explicit. | Docs state `paths` is accepted as a hint, while current daemon refresh remains project-wide incremental. |
| REQ-009 | Background refresh is not overfit. | Packet records periodic background refresh as deferred unless it is shipped and tested. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A caller that invokes MCP `search` without `refresh_index` gets search-only behavior.
- **SC-002**: A caller that invokes MCP `search(refresh_index=true)` keeps the previous refresh-before-search behavior.
- **SC-003**: A caller can invoke `cocoindex_refresh_index` before a search batch and observe a refresh result with `reqId`.
- **SC-004**: CLI search and index defaults remain unchanged.
- **SC-005**: Strict packet validation passes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Packet 035 | High | Use its timeout hypothesis as the reason for splitting refresh from search. |
| Dependency | Packet 041 | High | Reuse reqId and stage timing hooks for the new refresh tool. |
| Risk | Stale-index reads | Medium | Make refresh explicit and documented; preserve `search(refresh_index=true)`. |
| Risk | Callers expect MCP search to auto-refresh | Medium | Migration note says existing explicit `refresh_index=true` callers continue to work. |
| Risk | `paths` implies path-scoped refresh | Low | Tool description and docs state paths are hints until daemon supports scoped refresh. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Default MCP search avoids index refresh work inside the request scope.
- **NFR-P02**: Explicit refresh remains bounded by the existing MCP request timeout config.

### Security
- **NFR-S01**: No secrets, network access, or credential examples are added.
- **NFR-S02**: No destructive index lifecycle operations are exposed through MCP.

### Reliability
- **NFR-R01**: Existing explicit refresh-before-search callers remain compatible.
- **NFR-R02**: New refresh responses include request correlation.

---

## 8. EDGE CASES

### Data Boundaries
- `paths=[]` and omitted `paths` both run project-wide incremental refresh.
- `paths=["src/api"]` is accepted as a hint and echoed in the response, but does not limit daemon scope.

### Error Scenarios
- Refresh timeout returns `success=false` with the `reqId`.
- Refresh exception returns `success=false` with the `reqId`.
- Search exception path remains unchanged except for the new no-refresh default.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 13/25 | One Python source file, one pytest file, and docs. |
| Risk | 16/25 | User-visible MCP contract change with backward compatibility. |
| Research | 12/20 | Reads 035, 041, server/client/protocol, and existing docs. |
| Multi-Agent | 0/15 | SpawnAgent explicitly forbidden. |
| Coordination | 8/15 | Phase child under local llama-cpp parent with predecessor links. |
| **Total** | **49/100** | **Level 2 implementation scope; Level 3 docs because ADR is required.** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | New callers read a stale index if they never refresh. | M | M | Document `cocoindex_refresh_index` and preserve explicit `refresh_index=true`. |
| R-002 | Tests bypass FastMCP default injection. | M | L | Use `mcp.call_tool` in pytest to exercise schema defaults. |
| R-003 | Docs continue claiming a one-tool MCP surface. | M | M | Update tool reference, skill, README, catalog, and playbook guidance. |

---

## 11. USER STORIES

### US-001: Predictable Search (Priority: P0)

**As an** AI caller, **I want** MCP search to avoid implicit refresh by default, **so that** normal search latency is bounded by search work instead of indexing work.

**Acceptance Criteria**:
1. Given no `refresh_index` argument, when `search` runs, then `client.index` is not called.

---

### US-002: Explicit Refresh (Priority: P0)

**As an** operator or agent workflow, **I want** a refresh tool separate from search, **so that** I can refresh on my own schedule before a search batch.

**Acceptance Criteria**:
1. Given `cocoindex_refresh_index`, when it runs, then `client.index` is called and `client.search` is not called.

---

## 12. OPEN QUESTIONS

- Should a later packet add real path-scoped refresh to the daemon protocol?
- Should a later packet add opt-in periodic background refresh?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
