---
title: "MCP Topology Pivot: ADR-002 Supersedes ADR-001 Q3 (Co-Resident -> Standalone)"
description: "User direction reversed ADR-001 Q3 and requires a standalone system_code_graph MCP server while preserving stable code-graph tool IDs and behavior."
trigger_phrases:
  - "mcp topology pivot"
  - "system code graph standalone mcp"
  - "ADR-002 code graph topology"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-code-graph/015-mcp-topology-pivot"
    last_updated_at: "2026-05-14T09:24:15Z"
    last_updated_by: "claude"
    recent_action: "Validated ADR-002 standalone MCP topology pivot"
    next_safe_action: "Restart MCP children to pick up system_code_graph"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000007140007"
      session_id: "007-mcp-topology-pivot"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# MCP Topology Pivot: ADR-002 Supersedes ADR-001 Q3 (Co-Resident -> Standalone)

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-14 |
| **Branch** | `007-mcp-topology-pivot` |
| **Fingerprint** | `0000000000000000000000000000000000000000000000000000000007140007` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Reality diverged from ADR-001 in two ways. First, the user manually flattened the code-graph source tree so runtime code now lives directly at `.opencode/skills/system-code-graph/mcp_server/{lib,handlers,tools,tests}/` rather than under an intermediate `code_graph/` directory. Second, the user reversed ADR-001 Q3 and now requires a standalone MCP topology.

The pivot improves ownership clarity: code, database, schemas, stress tests, bridge assets, and MCP registration all live under system-code-graph. ADR-001 Q1, Q2, Q4, Q5, Q6, Q7, and Q8 remain in force unless explicitly superseded.

### Purpose
Ship ADR-002 and the runtime changes needed for standalone `system_code_graph` MCP registration without changing code-graph algorithms, parsing, scoring, scan-scope policy, query semantics, or stable tool IDs.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Standalone MCP infrastructure: launcher, server entrypoint, and `opencode.json` entry.
- Tool-schema migration out of `spec_kit_memory` and into system-code-graph.
- File ownership moves for code-graph stress tests, code-graph plugin bridge, and pure internal external tests.
- Agent and command tool grant namespace updates from `mcp__mk_spec_memory__*` to `mcp__system_code_graph__*` for code-graph tools only.
- Environment default relocation for code-graph indexing flags.
- Path-consistency cleanup for flattened layout and doctor/update.md mutation boundaries.
- Stale stub DB cleanup when no process holds the old path.

### Out of Scope
- Code-graph behavior changes.
- Tool-id changes. Tool names remain `code_graph_*`, `ccc_*`, and `detect_changes`.
- Deleting or rewriting historical 001-006 spec, plan, tasks, checklist, or ADR content.
- Replacing direct in-process library imports used by system-spec-kit handlers/hooks.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | ADR-002 explicitly supersedes ADR-001 Q3. | decision-record.md states the supersession and preserves unchanged ADR-001 decisions. |
| REQ-002 | system-code-graph owns MCP tool schemas. | CODE_GRAPH_TOOL_SCHEMAS exports the code-graph tool schemas. |
| REQ-003 | spec_kit_memory stops registering code-graph MCP tools. | No code_graph_*, ccc_*, or detect_changes tool schemas remain in system-spec-kit tool-schemas.ts. |
| REQ-004 | Standalone MCP server exists. | Launcher, entrypoint, and opencode.json system_code_graph entry exist. |
| REQ-005 | Stable tool IDs are preserved. | Schema names remain unchanged. |
| REQ-006 | Direct library consumers keep working. | system-spec-kit imports code-graph lib functions directly where needed. |
| REQ-007 | Flattened layout is canonical. | Runtime/test/docs paths reference mcp_server/{lib,handlers,tools,tests}. |
| REQ-008 | Validation evidence is recorded. | Typecheck, smoke Vitest, and strict spec validation results populate implementation-summary.md. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- `system_code_graph` appears in `opencode.json` and points to `.opencode/bin/system-code-graph-launcher.cjs`.
- `.opencode/skills/system-code-graph/mcp_server/index.ts` registers only code-graph tools.
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` has zero code-graph MCP schema definitions.
- Code-graph stress tests and plugin bridge live under system-code-graph.
- Pure code-graph external tests move; cross-subsystem contract tests stay.
- 014 parent and 005-code-graph parent metadata reflect completion.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | MCP clients need restart | New server entry is not visible until restart | Parent continuity next action says restart MCP children. |
| Risk | Tool grant drift | Agents still call old namespace | Grep and replace only code-graph MCP namespace grants. |
| Risk | Schema divergence | spec_kit_memory and system_code_graph disagree | Move schema source, leave comment marker in spec-kit. |
| Risk | Flattened path leftovers | Tests/docs import deleted code_graph subdir | Path-consistency grep and TypeScript/Vitest smoke. |
| Dependency | ADR-001 Q4 | Stable tool IDs stay in force | Preserve schema names exactly. |
| Dependency | ADR-001 Q5 | Direct imports stay in force | Do not route handlers/hooks through MCP. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. User direction pre-answered Gate 3 and explicitly selected standalone MCP topology.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## 8. NON-FUNCTIONAL REQUIREMENTS

| ID | Class | Requirement |
|----|-------|-------------|
| NFR-Q01 | Compatibility | Public tool names remain stable. |
| NFR-Q02 | Maintainability | Runtime ownership matches skill ownership. |
| NFR-S01 | Safety | No code-graph algorithm or scan policy changes. |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 9. EDGE CASES

- Existing MCP children will not see the new server until restart.
- Some system-spec-kit handlers still import system-code-graph libraries directly by design.
- Existing tests may contain historical `code_graph/` fixture strings; only path/import consistency is changed.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 10. COMPLEXITY ASSESSMENT

| Aspect | Rating | Note |
|--------|--------|------|
| LOC estimate | 300-700 authored lines plus moved files | Launcher, entrypoint, schemas, docs, config. |
| Surface area | Medium | MCP config, test ownership, docs, metadata. |
| Risk | Medium | Runtime namespace changes require client restart. |
| Reversibility | High | ADR-002 rollback restores ADR-001 Q3 co-resident registration. |
<!-- /ANCHOR:complexity -->
