---
title: "Decision Record: 042 CocoIndex Refresh/Search Split"
description: "ADR-004 records the MCP contract change that defaults search refresh off and adds explicit refresh."
trigger_phrases:
  - "ADR-004"
  - "cocoindex refresh split decision"
  - "refresh_index false decision"
importance_tier: "critical"
contextType: "decision"
status: "complete"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/001-local-embeddings-foundation/043-cocoindex-refresh-split"
    last_updated_at: "2026-05-14T16:45:00Z"
    last_updated_by: "codex"
    recent_action: "Accepted ADR-004 for explicit refresh"
    next_safe_action: "Use explicit refresh in MCP workflows"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py"
      - ".opencode/skills/mcp-coco-index/references/tool_reference.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000042"
      session_id: "043-cocoindex-refresh-split"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Option A chosen: flip MCP default and add explicit refresh tool."
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: 042 CocoIndex Refresh/Search Split

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: ADR-004 Default MCP Search Refresh Off And Add Explicit Refresh Tool

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted (shipped in 042) |
| **Date** | 2026-05-14 |
| **Deciders** | Codex dispatch under 042 packet |

---

<!-- ANCHOR:adr-001-context -->
### Context

Packet 035 mapped CocoIndex MCP reliability failures where host-visible `-32001 Request timed out` errors matched daemon logs showing client disconnects before responses could be sent. Packet 041 then added request IDs, stage timing, serialized response byte counts, gated msgspec decode metadata, and a configurable MCP request timeout.

The remaining cost was behavioral: MCP `search` defaulted `refresh_index=true`, and that caused `client.index(project_root)` to run inside the same FastMCP request scope before `client.search(...)`. For larger indexes, refresh dominates the request latency budget and makes ordinary search unpredictable.

### Constraints

- CLI behavior must remain unchanged.
- Existing MCP callers that pass `refresh_index=true` must keep working.
- The new refresh path must reuse 041 observability patterns.
- The solution must not touch Spec Kit Memory MCP.
- Background refresh is optional and should not ship without low-risk tests.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Option A, flip MCP `search.refresh_index` default to `false` and add explicit `cocoindex_refresh_index`.

**How it works**: MCP `search` now searches only by default. Callers can run `cocoindex_refresh_index()` before a search batch, or pass `search(refresh_index=true)` to preserve the previous one-shot refresh-before-search behavior. The CLI keeps its existing `--refresh` opt-in behavior.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **A. Flip default plus add explicit tool** | Stabilizes default search latency; refresh becomes explicit and scriptable; preserves compatibility. | Callers can read stale indexes if they forget to refresh. | 9/10 |
| B. Keep default but raise MCP timeout | Lowest code change. | Hides the coupling and still makes search latency depend on index size. | 4/10 |
| C. Parallelize refresh asynchronously inside search | Could hide refresh cost from the caller. | More concurrency risk around the known `ComponentContext` class of failures. | 5/10 |
| D. Do nothing | No migration cost. | Leaves the 035 timeout cause in the default path. | 1/10 |

**Why this one**: Option A changes the smallest public contract necessary to make search predictable while keeping explicit refresh available.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Search latency stabilizes because default MCP search no longer refreshes first.
- Refresh becomes explicit, scriptable, and observable with its own `reqId`.
- Existing callers passing `refresh_index=true` continue to work.
- CLI behavior stays unchanged.

**What it costs**:
- Stale-index reads are possible when callers forget to refresh. Mitigation: docs now point agents to `cocoindex_refresh_index`, and `search(refresh_index=true)` remains available.
- Path hints on `cocoindex_refresh_index` are not path-scoped yet. Mitigation: docs state current daemon refresh remains project-wide incremental.
- Optional background refresh did not ship in 042. Mitigation: defer it to a focused follow-on with env parsing and scheduler tests.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Agent workflows assume search auto-refreshes | M | Migration docs and backward-compatible `refresh_index=true`. |
| Refresh tool is mistaken for reset or destructive index lifecycle | L | Tool only wraps incremental `client.index(project_root)`. |
| Background refresh is added later without bounds | M | Follow-on should clamp interval and document startup lifecycle. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 035 tied timeouts to long request work; search default refresh was still coupled. |
| 2 | **Beyond Local Maxima?** | PASS | Compared default flip, timeout increase, async refresh, and no-op. |
| 3 | **Sufficient?** | PASS | One wrapper-layer change and one wrapper-layer tool solve the contract problem. |
| 4 | **Fits Goal?** | PASS | The user explicitly requested `refresh_index=false` plus likely refresh/search split. |
| 5 | **Open Horizons?** | PASS | Path-scoped refresh and background scheduling can be added later without changing the new default. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py` changes the MCP `search` default and registers `cocoindex_refresh_index`.
- `.opencode/skills/mcp-coco-index/mcp_server/tests/test_refresh_split.py` covers omitted default, explicit true, and refresh-without-search.
- `.opencode/skills/mcp-coco-index/references/tool_reference.md` documents migration and the new tool.

**How to roll back**: Change `refresh_index` default in `server.py` back to `true`, update docs to state implicit refresh, and adjust `test_mcp_search_refresh_index_default_is_false` to the restored contract.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
