---
title: "Iter 007 — Track 3: system-skill-advisor/SKILL.md content + tool count"
iteration: 7
track: 3
focus: "system-skill-advisor/SKILL.md content + tool count"
status: complete
newInfoRatio: 0.15
findings: 2
timestamp: 2026-05-15T17:24:11Z
---

## Iter 007 Findings

### Findings

**SKILL.md tool count claim (lines 98-106):**
- Lists 9 tools: `advisor_recommend`, `advisor_rebuild`, `advisor_status`, `advisor_validate`, `skill_graph_scan`, `skill_graph_query`, `skill_graph_status`, `skill_graph_validate`, `skill_graph_propagate_enhances`
- **VERDICT: CORRECT** - Actual implementation matches this count exactly

**Actual tool registration verification:**
- `index.ts` (lines 37-43): Registers 4 advisor_* tools + spreads skillGraphToolDefinitions
- `skill-graph-tools.ts` (lines 85-91): skillGraphToolDefinitions array contains 5 tools including `skillGraphPropagateEnhancesTool`
- `advisor-server.ts` (lines 197-199): ListToolsRequestSchema returns ALL TOOL_DEFINITIONS without filtering
- **Total: 9 tools registered and exposed via MCP**

**Documentation drift detected:**
- `mcp_server/tools/README.md` (lines 117-124): Entrypoints table lists only 8 tools, missing `skillGraphPropagateEnhancesTool`
- **Suggested fix:** Add row to entrpoints table: `| skillGraphPropagateEnhancesTool | Descriptor | Registers skill_graph_propagate_enhances. |`

**Public vs internal split claim:**
- User RQ assumes "8 public, 1 internal" with `propagate_enhances` as internal
- **VERDICT: NOT SUPPORTED BY CODE** - No public/internal split exists in implementation
- All 9 tools are registered in TOOL_DEFINITIONS and exposed via ListToolsRequestSchema
- No filtering, marking, or access control distinguishes any tool as internal
- The "8 public" assumption likely stems from the tools/README.md omission, but this is documentation error not technical reality

### Coverage notes

**Files verified:**
- `.opencode/skills/system-skill-advisor/SKILL.md` (215 lines)
- `.opencode/skills/system-skill-advisor/mcp_server/tools/index.ts` (70 lines)
- `.opencode/skills/system-skill-advisor/mcp_server/tools/skill-graph-tools.ts` (143 lines)
- `.opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts` (262 lines)
- `.opencode/skills/system-skill-advisor/mcp_server/tools/README.md` (151 lines)

**Tool registration flow confirmed:**
1. Individual tool descriptors defined in advisor-*.ts and skill-graph-tools.ts
2. Barrel export via index.ts TOOL_DEFINITIONS array
3. MCP server registration via advisor-server.ts ListToolsRequestSchema handler
4. All 9 tools exposed to MCP clients without filtering

### newInfoRatio rationale

**newInfoRatio: 0.15**

**Rationale:**
- 85% of content (tool names, counts, registration pattern) was already correctly documented in SKILL.md
- 15% new information: Discovered that the assumed "public vs internal" split does not exist in the implementation, and identified documentation drift in tools/README.md missing skillGraphPropagateEnhancesTool from the entrpoints table
- The core claim about 9 total tools (4 advisor_* + 5 skill_graph_*) is factually correct
- The distinction between public and internal tools appears to be a documentation assumption rather than a technical reality

ITER_007_COMPLETE: 2 findings, newInfoRatio=0.15
