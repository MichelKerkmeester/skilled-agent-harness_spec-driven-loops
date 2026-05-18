# Iteration 003 — Track 1: system-spec-kit/SKILL.md content drift

## Findings Summary

### 1. Tool Count Discrepancy (CRITICAL)

**Location 1**: `feature_catalog/02--mutation/12-memory-retention-sweep.md:36`
- **Claim**: "The tool contributes to the current `mk-spec-memory` server's 41-tool count."
- **Reality**: The `TOOL_DEFINITIONS` array in `mcp_server/tool-schemas.ts` contains 36 tools (excluding skill advisor imports)
- **Suggested fix**: Update to "36-tool count" or verify if skill advisor imports should be included in the base count

**Location 2**: `references/config/environment_variables.md:27`
- **Claim**: "Enforce strict Zod MCP tool input validation for the 54-tool `mk-spec-memory` surface"
- **Reality**: 36 tools in base TOOL_DEFINITIONS + 4 skill advisor imports = 40 tools total (not 54)
- **Suggested fix**: Update to "40-tool `mk-spec-memory` surface" or clarify the count methodology

**Location 3**: `references/memory/memory_system.md:96`
- **Claim**: "Tool Reference (54 `mk-spec-memory` tools)"
- **Reality**: Same as above - actual count is 36 local + 4 skill advisor = 40 tools
- **Suggested fix**: Update to "Tool Reference (40 `mk-spec-memory` tools)" or document the counting method

**Location 4**: `references/memory/memory_system.md:98`
- **Claim**: "The public surface is 50 local descriptors from `mcp_server/tool-schemas.ts` plus 4 Skill Advisor descriptors"
- **Reality**: Only 36 local descriptors in TOOL_DEFINITIONS array
- **Suggested fix**: Update to "36 local descriptors" or explain the discrepancy

### 2. MCP Server Naming Inconsistency

**Location 1**: Multiple files use both `mk-spec-memory` and `mk_spec_memory` (underscore variant)
- **Examples found in**:
  - `mcp_server/tests/shared-daemon-runner-helpers.vitest.ts:61,75,77,78,83,86,88`
  - `manual_testing_playbook/24--local-llm-query-intelligence/*.md` (multiple references)
  - `references/memory/trigger_config.md:85`
- **Reality**: The MCP server list shows both `mk-spec-memory` and `spec_kit_memory` as registered servers
- **Suggested fix**: Standardize on one naming convention (prefer `mk-spec-memory` based on usage frequency) and update all references

**Location 2**: `changelog/v3.4.1.0.md:437`
- **Claim**: "the `spec_kit_memory` MCP server config are now plural"
- **Reality**: Server list shows `spec_kit_memory` exists alongside `mk-spec-memory`, creating ambiguity
- **Suggested fix**: Clarify which server is the canonical one or document the relationship between them

### 3. Extraction-line Packet References (UNVERIFIABLE)

**RQ Request**: Check recent commits in extraction-line packets (005-code-graph, 006-skill-advisor, 014-local-llama-cpp)
- **Reality**: These packet numbers do not exist as top-level extraction-line packets in the specs/ directory
- **Finding**: The referenced packets appear to be child folders within other spec packets, not standalone extraction-line packets
- **Suggested fix**: Update RQ to reference actual extraction-line packet numbers or clarify the packet structure being referenced

### 4. Verified Correct Claims

The following claims were verified as accurate:
- **Agent count**: 11 agents (matches actual count in `.opencode/agents/`)
- **Skill count**: 20 skills (matches actual SKILL.md files in `.opencode/skills/`)
- **Command count**: 22 commands (matches actual .md files in `.opencode/commands/`)

## Severity Assessment

- **P0 (Critical)**: Tool count discrepancies affect documentation accuracy and user understanding of system capabilities
- **P1 (High)**: MCP server naming inconsistency creates confusion about which server to reference
- **P2 (Medium)**: Extraction-line packet references are unverifiable with current packet structure

ITER_003_COMPLETE: 6 findings, newInfoRatio=0.85
