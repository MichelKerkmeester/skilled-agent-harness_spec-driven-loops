---
title: "Iter 001 — Track 1: tool surface count and per-server breakdown"
iteration: 1
track: 1
focus: "tool surface count and per-server breakdown"
status: complete
newInfoRatio: 0.85
---

# Iter 001 — Track 1: tool surface count and per-server breakdown

## RQ

Walk every claim in `./README.md` about MCP tool counts (the "66 MCP Tools" line, the per-server breakdown "39 mk-spec-memory + 8 mk_skill_advisor + 10 mk_code_index + 7 code mode + 1 CocoIndex + 1 sequential thinking", and any per-section repeats). Verify each count by counting entries in `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts`, `opencode.json` server registrations, and the analogous configs in the other 3 runtimes. Report exact actual counts and any drift.

## Actions

1. Read `./README.md` and grep for every mention of "66", "39", "8", "10", "7", "1", "MCP", and "tools"
2. Read `tool-schemas.ts` to count TOOL_DEFINITIONS entries
3. Read `mcp_server/tools/index.ts` + `skill-graph-tools.ts` for mk_skill_advisor
4. Read `tool-schemas.ts` (code-graph section) for mk_code_index
5. Read `code_mode/index.ts:141-273` for code_mode tool list
6. Read `cocoindex_code/server.py:108,252` for cocoindex tool list
7. Verify sequential_thinking external package tool count

## Findings

### F-001-001: Total count drift
- **Claim in README**: "66 MCP Tools" (line 57, also footer line 1497, FAQ line 1455)
- **Current truth**: 69 tools across 6 servers (39 + 9 + 11 + 7 + 2 + 1 = 69)
- **Status**: DRIFTED
- **Suggested edit**: change "66" -> "69" in all 3 locations (line 57, line 1455, line 1497)

### F-001-002: mk-spec-memory (39)
- **Claim in README**: "mk-spec-memory (39)"
- **Current truth**: 39 tools in TOOL_DEFINITIONS at tool-schemas.ts:783-835. Verified by grep entry count.
- **Status**: CURRENT
- **Suggested edit**: none

### F-001-003: mk_skill_advisor (8)
- **Claim in README**: "mk_skill_advisor (8)" / "Eight tools cover the public surface" (line 671)
- **Current truth**: 9 tools = 4 advisor (advisorRecommendTool, advisorRebuildTool, advisorStatusTool, advisorValidateTool) + 5 skill-graph (skillGraphScanTool, skillGraphQueryTool, skillGraphStatusTool, skillGraphValidateTool, skillGraphPropagateEnhancesTool)
- The README at line 671 explicitly says "Eight tools" and notes skillGraphPropagateEnhancesTool is excluded. This is intentional. The "8" reflects public-surface tools, not registered handler count.
- **Status**: DRIFTED (ambiguous: depends on whether "8" means public-surface or registered count)
- **Suggested edit**: clarify "8 public + 1 internal" OR update count to 9 with handler note

### F-001-004: mk_code_index (10)
- **Claim in README**: "mk_code_index (10)"
- **Current truth**: 11 tools in CODE_GRAPH_TOOL_SCHEMAS at tool-schemas.ts:232-244: codeGraphScan, codeGraphQuery, codeGraphStatus, codeGraphContext, codeGraphClassifyQueryIntent, codeGraphVerify, codeGraphApply, detectChanges, cccStatus, cccReindex, cccFeedback
- The 4 runtime configs claim 10 (likely excluding codeGraphClassifyQueryIntent)
- **Status**: DRIFTED
- **Suggested edit**: change "10" -> "11" OR document the exclusion

### F-001-005: code_mode (7)
- **Claim in README**: "code_mode (7)"
- **Current truth**: 7 tools at index.ts:141-273: register_manual, deregister_manual, search_tools, list_tools, get_required_keys_for_tool, tool_info, call_tool_chain
- **Status**: CURRENT
- **Suggested edit**: none

### F-001-006: cocoindex_code (1)
- **Claim in README**: "CocoIndex (1)" / "cocoindex_code (1)"
- **Current truth**: 2 tools at server.py: search (line 108), cocoindex_refresh_index (line 252)
- **Status**: DRIFTED
- **Suggested edit**: change "1" -> "2"

### F-001-007: sequential_thinking (1)
- **Claim in README**: "sequential_thinking (1)"
- **Current truth**: External package, 1 tool "sequentialthinking"
- **Status**: CURRENT
- **Suggested edit**: none

### F-001-008: Runtime config consistency
- All 4 runtime configs (opencode.json, .claude/mcp.json, .codex/config.toml, .gemini/settings.json) declare the same servers with consistent names
- Configs propagate the same drift the README has (39/8/10 breakdown)
- **Status**: CONSISTENT with README (both currently understate actual count)
- **Suggested edit**: none for configs; this iter focuses on README

## Coverage notes

Scanned README lines covering tool counts: 57 (4-pillar overview), 671 (Skill Advisor section), 1455 (FAQ), 1497 (footer).
Verified against 5 source files + 4 runtime configs + 1 external package.

## newInfoRatio rationale

First iter, baseline 0.85: high novelty because Phase D's audit reported all tool counts as CURRENT, but this iter found 3 distinct drifts (total count, mk_code_index, cocoindex_code) plus one ambiguous mk_skill_advisor case. The 0.15 reduction reflects partial overlap with Phase D's audit footprint.

## Recommended next focus

Next iter in Track 1 (iter 2): agent + skill + command counts. Verify "11 agents", "20 skills", "22 commands".
