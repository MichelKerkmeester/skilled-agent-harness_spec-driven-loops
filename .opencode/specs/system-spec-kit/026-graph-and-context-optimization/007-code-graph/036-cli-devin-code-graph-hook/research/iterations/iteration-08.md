# Iteration 08: `mk-code-index` MCP Name vs `mk-code-graph` Plugin Name Asymmetry — Rationale + ADR-002 Draft

## Question

The MCP server name is `mk-code-index` (stable tool surface, prefix `mcp__mk_code_index__*`). The user requested the plugin be renamed `mk-code-graph` (matches SKILL folder name). Document the rationale and propose an ADR.

## Investigation Steps

1. **Verified MCP server name**: Confirmed `mk-code-index` in .devin/config.json and tool prefix
2. **Checked SKILL folder name**: Verified system-code-graph SKILL folder name
3. **Analyzed naming asymmetry**: Compared with advisor pattern (mk-skill-advisor matches both MCP and SKILL)
4. **Drafted ADR rationale**: Documented why the asymmetry exists and is acceptable

## Findings

### Finding 1: MCP Server Name is `mk-code-index`

The MCP server is registered in `.devin/config.json:41-56` as `mk_code_index` (hyphen becomes underscore in config). Tool prefix is `mcp__mk_code_index__*`.

**Evidence**: <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.devin/config.json" lines="41-56" />

### Finding 2: SKILL Folder Name is `system-code-graph`

The SKILL folder is `.opencode/skills/system-code-graph/`. The user requested the plugin be renamed `mk-code-graph` to match the SKILL folder name (minus the `system-` prefix).

### Finding 3: Advisor Pattern is Different

The advisor skill has symmetric naming:
- MCP server: `mk_skill_advisor`
- Plugin: `mk-skill-advisor`
- SKILL folder: `system-skill-advisor`

All three share the same base name `skill-advisor`.

Code-graph has asymmetric naming:
- MCP server: `mk-code-index`
- Plugin: `mk-code-graph` (requested)
- SKILL folder: `system-code-graph`

### Finding 4: Rationale for Asymmetry

**MCP server name (`mk-code-index`)**: This is the stable tool surface contract. Renaming it would break all tool consumers (MCP tool names, scripts, documentation). The name reflects the function (code indexing) rather than the skill name.

**Plugin name (`mk-code-graph`)**: This matches the SKILL folder name for symmetry with `mk-skill-advisor`/`system-skill-advisor`. The plugin is a delivery mechanism, not the tool contract itself.

**Why the asymmetry exists**: The MCP server was named for its function (code indexing) before the skill extraction. The SKILL folder name reflects the broader concept (code graph). Renaming the MCP server would be a breaking change; renaming the plugin is cosmetic and low-risk.

## Confidence

**HIGH** - The rationale is clear and the asymmetry is justified.

## Open Follow-Ups

None - this question is fully resolved.

## Recommendation

**ADR-002 draft**:

**Decision**: Maintain naming asymmetry between MCP server (`mk-code-index`) and plugin (`mk-code-graph`).

**Rationale**:
1. **MCP server name stability**: The MCP server name `mk-code-index` is the stable tool surface contract. Tool names are prefixed `mcp__mk_code_index__*`. Renaming would break all consumers (scripts, docs, MCP clients).
2. **Plugin name symmetry**: The plugin name `mk-code-graph` matches the SKILL folder name for consistency with the advisor pattern (`mk-skill-advisor` matches `system-skill-advisor`).
3. **Functional vs conceptual naming**: The MCP server is named for its function (code indexing), while the plugin/SKILL is named for the broader concept (code graph).
4. **Low risk**: Plugin renaming is cosmetic and affects only OpenCode plugin loading, not the MCP tool contract.

**Documentation requirements**: Add a paragraph to both SKILL.md and plugins/README.md explaining the asymmetry so future readers understand the design intent.

## Actionable

**YES** - This finding provides ADR-002 draft and documentation requirements for Phase B/C.

## Category

naming-decision
