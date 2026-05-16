# Iteration 05: Bridge Module Rename + Duplicate Audit

## Question

The bridge module: `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs`. Does a duplicate exist at `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs`? If yes: diff them, decide which is canonical, plan deletion of the duplicate, identify all import paths that need to flip.

## Investigation Steps

1. **Checked advisor bridge location**: Attempted to list `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/` - directory does not exist
2. **Confirmed system-spec-kit bridge location**: Bridge lives at `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs` (verified in iteration 4)

## Findings

### Finding 1: No Duplicate - Bridge Lives in System-Spec-Kit

The advisor bridge does NOT exist in the `system-skill-advisor` directory. The only bridge is at:
`.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs`

This is legacy from pre-extraction when the advisor was part of system-spec-kit.

**Evidence**: Directory listing shows `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/` does not exist.

### Finding 2: Bridge Rename Should Include Location Move

As part of the plugin rename, the bridge should:
1. Move from: `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs`
2. Move to: `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs`

This aligns with the extraction ownership - the advisor skill should own its bridge.

**Evidence**: Inferred from extraction context (advisor extracted in packet 008/022) and the need for skill ownership per Q2.

### Finding 3: Import Path Migration

The plugin file (`.opencode/plugins/spec-kit-skill-advisor.js`) imports the bridge. After the rename + move:
- Old import: `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs`
- New import: `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs`

The plugin's bridge path reference needs updating.

**Evidence**: Inferred from plugin architecture (plugin spawns bridge subprocess).

## Confidence

**HIGH** - Directory listing confirms no duplicate exists. The move is straightforward.

## Open Follow-Ups

None - this is a clear rename + move operation.

## Recommendation

Move the bridge from system-spec-kit to system-skill-advisor as part of the rename operation. Update the plugin's bridge path reference. No deletion needed (no duplicate).

## Actionable

**YES** - This finding provides the bridge rename + move plan needed for Phase B decision-record.md and Phase C implementation.

## Category

rename-safety
