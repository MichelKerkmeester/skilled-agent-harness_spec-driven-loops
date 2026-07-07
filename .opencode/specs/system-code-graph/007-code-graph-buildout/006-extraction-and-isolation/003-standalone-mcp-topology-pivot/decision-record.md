---
title: "Decision Record: ADR-002 standalone system_code_graph MCP topology"
description: "ADR-002 explicitly supersedes ADR-001 Q3 and chooses standalone system_code_graph MCP registration."
trigger_phrases:
  - "mcp topology pivot"
  - "system code graph standalone mcp"
  - "ADR-002 code graph topology"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-code-graph/007-code-graph-buildout/006-extraction-and-isolation/003-standalone-mcp-topology-pivot"
    last_updated_at: "2026-05-14T09:24:15Z"
    last_updated_by: "claude"
    recent_action: "Validated ADR-002 standalone MCP topology pivot"
    next_safe_action: "Restart MCP children to pick up system_code_graph"
    blockers: []
    key_files:
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000007140007"
      session_id: "007-mcp-topology-pivot"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: ADR-002 standalone system_code_graph MCP topology

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Standalone system_code_graph MCP topology

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-14 |
| **Decider** | User direction, implemented in 014/007-mcp-topology-pivot |
| **Supersedes** | ADR-001 Q3 only |

---

<!-- ANCHOR:adr-002-context -->
### Context

User direction on 2026-05-14 reversed ADR-001 Q3. ADR-001 selected co-resident MCP registration under spec_kit_memory; this packet now requires standalone MCP topology. A separate divergence was discovered in the same recalibration: the user manually flattened the physical code-graph path, so runtime code lives at `system-code-graph/mcp_server/{lib,handlers,tools,tests}/` rather than `system-code-graph/mcp_server/code_graph/{lib,handlers,tools,tests}/`.

ADR-001 Q1, Q2, Q4, Q5, Q6, Q7, and Q8 remain valid unless this ADR explicitly touches them. Constraint A remains unchanged: no code-graph algorithms, parsing, scoring, scan-scope policy, or query semantics change.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We choose standalone clean MCP topology.** A new local MCP server named `system_code_graph` registers the existing code-graph tools. Tool IDs remain unchanged per ADR-001 Q4: `code_graph_scan`, `code_graph_query`, `code_graph_status`, `code_graph_context`, `code_graph_verify`, `code_graph_apply`, `detect_changes`, `ccc_status`, `ccc_reindex`, and `ccc_feedback`.

ADR-001 Q2 DB shape is preserved: `code-graph.sqlite` lives in `system-code-graph/mcp_server/database/` by default, with `SPECKIT_CODE_GRAPH_DB_DIR` override. ADR-001 Q5 cross-subsystem direct imports are still preserved: system-spec-kit handlers/hooks continue reading via direct in-process imports and the shared SQLite file. The scan loop remains the single writer.

Runtime namespace changes from `mcp__mk_spec_memory__code_graph_*`, `mcp__mk_spec_memory__ccc_*`, and `mcp__mk_spec_memory__detect_changes` to `mcp__system_code_graph__code_graph_*`, `mcp__system_code_graph__ccc_*`, and `mcp__system_code_graph__detect_changes`.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Alternative | Decision | Reason |
|-------------|----------|--------|
| Co-resident MCP (ADR-001 Q3) | Rejected | User explicitly reversed Q3. |
| Standalone with legacy bridge | Rejected | Adds a compatibility shim while tool names stay stable; namespace update is clearer and sufficient. |
| Standalone clean | Chosen | Ownership matches code/database/docs location; spec_kit_memory no longer carries code-graph MCP registration. |
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

- Four runtime config surfaces need the new MCP entry when mirrored: OpenCode now gets `system_code_graph`; other runtime agent grants point at the new namespace where explicit MCP prefixes exist.
- Launcher duplication is accepted for clarity: `.opencode/bin/system-code-graph-launcher.cjs` mirrors the memory launcher pattern.
- Tool schemas migrate to system-code-graph; spec_kit_memory keeps a comment marker and no longer lists or dispatches the code-graph tools.
- Agent grants and command allowed-tools entries must use `mcp__system_code_graph__*`. Bare tool IDs in prose remain stable.
- Stress tests, pure internal code-graph tests, and the code-graph compact bridge belong under system-code-graph.
- Path-flattening is now canonical: docs and tests should not refer to the removed intermediate `mcp_server/code_graph/` source path except when discussing historical ADR-001 state.
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks

| Check | Result | Evidence |
|-------|--------|----------|
| Necessary? | PASS | User reversed ADR-001 Q3 and requested standalone topology. |
| Beyond local maxima? | PASS | Compared co-resident, standalone with legacy bridge, and standalone clean. |
| Sufficient? | PASS | Covers launcher, entrypoint, schemas, config, grants, tests, bridge, docs, DB cleanup. |
| Fits goal? | PASS | Moves MCP ownership without changing code-graph behavior. |
| Opens horizons? | PASS | Leaves future runtime mirrors straightforward: add system_code_graph entry and grants. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-rollback -->
### Rollback

Revert ADR-002. ADR-001 Q3 then returns to force: code-graph tools register co-resident under spec_kit_memory. Restore the removed schema and dispatcher entries in system-spec-kit, remove `system_code_graph` from `opencode.json`, and delete the standalone launcher/entrypoint if no longer used.
<!-- /ANCHOR:adr-002-rollback -->

---

<!-- ANCHOR:adr-002-revisit -->
### Revisit Trigger

Revisit if standalone startup cannot build/load in offline installs, or if a runtime cannot expose a second MCP server entry. Tool IDs should still remain stable even if topology is rolled back.
<!-- /ANCHOR:adr-002-revisit -->

<!-- /ANCHOR:adr-002 -->
