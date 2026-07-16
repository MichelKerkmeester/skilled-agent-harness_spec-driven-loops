---
title: "Iter 012 — Track 4: runtime arrows + extraction boundaries"
iteration: 12
track: 4
focus: "runtime arrows + extraction boundaries"
status: complete
newInfoRatio: 0.00
---

# Iteration 012 Findings

## Analysis Summary

I analyzed the README.md for diagrams and prose describing component boundaries, cross-checking against the three SKILL.md files (system-spec-kit, system-skill-advisor, system-code-graph).

## Findings

**0 findings** - No diagrams or text in README.md show pre-extraction boundaries.

## Detailed Verification

### Diagrams and Architecture Descriptions in README.md

1. **"How It All Connects" diagram (lines 64-106)**
   - Shows `mk_code_index` as a standalone MCP server in the NATIVE MCP TOPOLOGY section
   - Correctly represents post-extraction boundaries

2. **"What's Shipped Recently" section (lines 108-112)**
   - Explicitly documents the code-graph extraction: "moved the code graph into `.opencode/skills/system-code-graph/` with its own MCP boundary"
   - References the extraction packet and the `mk-code-index` rename
   - Correctly post-extraction

3. **Component table (lines 52-60)**
   - Shows code-graph as "First-class skill at `.opencode/skills/system-code-graph/` with standalone MCP server identity `mk-code-index`"
   - Correctly post-extraction

4. **Memory Engine section (line 374)**
   - States: "Structural code indexing now lives in the standalone [`system-code-graph`](.opencode/skills/system-code-graph/) skill and MCP server"
   - Correctly post-extraction

5. **Layered MCP Surface table (line 394)**
   - L8 row: "Code graph lives in `mk_code_index`; advisor and skill graph live in `mk_skill_advisor`"
   - Correctly post-extraction

6. **CocoIndex + Code Graph section (lines 593-594)**
   - States: "The Code Graph is a SQLite-backed structural index owned by `.opencode/skills/system-code-graph/` and registered as the standalone `mk-code-index` MCP server"
   - Correctly post-extraction

7. **Skill Advisor section (line 671)**
   - States: "It is now a standalone MCP server named `mk_skill_advisor`, packaged under `.opencode/skills/system-skill-advisor/mcp_server/`"
   - Correctly post-extraction

8. **Skills Library MCP Integration subsection (lines 854-863)**
   - system-code-graph: "First-class code-graph subsystem at `.opencode/skills/system-code-graph/`"
   - system-skill-advisor: "Standalone Gate 2 skill routing package at `.opencode/skills/system-skill-advisor/`"
   - Correctly post-extraction

9. **Native MCP Servers table (lines 1204-1214)**
   - Lists `mk_code_index` as a standalone server with 10 tools
   - Lists `mk_skill_advisor` as a standalone server with 8 tools
   - Correctly post-extraction

10. **MCP Config Shape section (lines 1347-1372)**
    - Shows canonical config with `mk_code_index` and `mk_skill_advisor` as separate top-level MCP servers
    - Note acknowledges "Runtime config files can temporarily differ while the `mk-code-index` rename is being rolled out across clients"
    - Correctly post-extraction

11. **FAQ (lines 1453-1455)**
    - States: "Canonical advisor/skill-graph docs use `mk_skill_advisor` / `mcp__mk_skill_advisor__*`; canonical code-graph docs use `mk_code_index` / `mcp__mk_code_index__*`"
    - Correctly post-extraction

### Cross-Check Against SKILL.md Files

**system-spec-kit/SKILL.md (line 375)**
- States: "Use CocoIndex for semantic discovery, Code Graph for structural relationships, and Spec Kit Memory for prior decisions and continuity. `code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`, and `detect_changes` (under MCP namespace `mcp__mk_code_index__*`, owned by the standalone `system-code-graph` skill)..."
- Confirms post-extraction boundaries

**system-skill-advisor/SKILL.md (lines 94-110)**
- States: "The package owns a dedicated MCP server named `mk_skill_advisor`... The advisor implementation, skill-graph library, and package-local database now live under this skill package, while memory remains focused on memory tools."
- Confirms post-extraction boundaries

**system-code-graph/SKILL.md (lines 60, 80, 112-113)**
- States: "The standalone MCP server name is `mk-code-index`"
- States: "MCP tools are registered under the standalone `mk-code-index` server"
- States: "MCP callers, agents and commands: Standalone `mk-code-index` MCP namespace"
- Confirms post-extraction boundaries

## Conclusion

All diagrams, tables, and prose descriptions in README.md correctly reflect the post-extraction architecture. The README consistently represents:
- `mk-code-index` as a standalone MCP server owned by `system-code-graph`
- `mk_skill_advisor` as a standalone MCP server owned by `system-skill-advisor`
- Both as peers to `mk-spec-memory` in the MCP topology

No pre-extraction boundaries (showing code-graph or skill-advisor as subcomponents of system-spec-kit) were found.

ITER_012_COMPLETE: 0 findings, newInfoRatio=0.00
