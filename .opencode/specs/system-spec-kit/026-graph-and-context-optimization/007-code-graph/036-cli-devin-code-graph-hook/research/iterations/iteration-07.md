# Iteration 07: Bridge Module Rename + Duplicate Audit (Code-Graph)

## Question

Bridge: `.opencode/skills/system-code-graph/mcp_server/plugin_bridges/spec-kit-compact-code-graph-bridge.mjs` → `mk-code-graph-bridge.mjs`. Verify no duplicate at `system-spec-kit/mcp_server/plugin_bridges/`. List import paths.

## Investigation Steps

1. **Checked for duplicates**: Searched for bridge files in both locations
2. **Listed import paths**: Grep for bridge imports across the codebase
3. **Compared with advisor pattern**: Checked if advisor had duplicate bridge issue

## Findings

### Finding 1: No Duplicate Bridge Found

No duplicate bridge file exists at `system-spec-kit/mcp_server/plugin_bridges/spec-kit-compact-code-graph-bridge.mjs`. The code-graph bridge only exists in its skill location.

**Evidence**: `ls -la .opencode/skills/system-spec-kit/mcp_server/plugin_bridges/` shows no code-graph bridge file.

### Finding 2: Advisor Had Duplicate, Code-Graph Does Not

The advisor packet had to delete a duplicate bridge at `system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs` post-extraction. Code-graph does not have this issue.

**Rationale**: Code-graph extraction was cleaner, or the duplicate was already cleaned up in a prior packet.

### Finding 3: Import Path Migration List

Bridge is imported by:
- `.opencode/plugins/spec-kit-compact-code-graph.js` (plugin file)
- Test files in system-code-graph/mcp_server/tests/
- Documentation references

All import paths need to update from:
`../system-code-graph/mcp_server/plugin_bridges/spec-kit-compact-code-graph-bridge.mjs`
to:
`../system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs`

## Confidence

**HIGH** - No duplicate found, simplifying the rename.

## Open Follow-Ups

None - this question is fully resolved.

## Recommendation

**Simple rename**:
1. Rename bridge file to `mk-code-graph-bridge.mjs`
2. Update PLUGIN_ID in bridge to `'mk-code-graph'`
3. Update all import paths
4. No deletion needed (no duplicate exists)

## Actionable

**YES** - This finding confirms the bridge rename scope and deletion plan (none needed).

## Category

plugin-rename
