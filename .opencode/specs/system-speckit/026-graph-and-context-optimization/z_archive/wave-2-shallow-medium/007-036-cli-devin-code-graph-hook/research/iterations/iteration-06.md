# Iteration 06: Plugin Rename Safety — Who Consumes `'spec-kit-compact-code-graph'`?

## Question

Grep current code/docs/tests/configs for `'spec-kit-compact-code-graph'`. Categorize as source / cross-ref / backcompat / archive. Enumerate env vars and decide rename + alias strategy.

## Investigation Steps

1. **Grep for PLUGIN_ID**: Searched for `'spec-kit-compact-code-graph'` across the codebase
2. **Categorized findings**: Grouped by type (source, cross-ref, backcompat, archive)
3. **Checked env vars**: Looked for SPECKIT_*_CODE_GRAPH_* patterns
4. **Analyzed touch scope**: Compared against advisor packet rename scope

## Findings

### Finding 1: PLUGIN_ID Usage Locations

Grep found the PLUGIN_ID `'spec-kit-compact-code-graph'` in:
- Source: `.opencode/plugins/spec-kit-compact-code-graph.js` (line 39)
- Bridge: `.opencode/skills/system-code-graph/mcp_server/plugin_bridges/spec-kit-compact-code-graph-bridge.mjs` (multiple)
- Tests: Various test files in system-spec-kit and system-code-graph
- Documentation: README files, feature catalog entries

### Finding 2: No Legacy Env Vars Found

No `SPECKIT_*_CODE_GRAPH_*` environment variables found. The code-graph plugin does not have legacy env var patterns like the advisor's `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED`.

**Evidence**: Grep for `SPECKIT.*CODE_GRAPH` returned no results.

### Finding 3: Touch Scope Matches Advisor Pattern

The rename scope for code-graph plugin mirrors the advisor pattern:
- Plugin file rename
- Bridge module rename
- PLUGIN_ID constant update
- README updates
- Test file renames
- Feature catalog updates
- Manual testing playbook updates

**Difference**: Code-graph has no legacy env vars to alias, simplifying the rename.

### Finding 4: Archive Exclusion Policy

Per plan, z_archive and changelog directories are hands-off (historical, do NOT backfill). Grep confirmed references exist in these locations but they should be left untouched.

## Confidence

**HIGH** - The scope is clear and matches the established advisor pattern.

## Open Follow-Ups

None - this question is fully resolved.

## Recommendation

**Direct rename** (no env var alias needed):
1. Rename plugin file: `spec-kit-compact-code-graph.js` → `mk-code-graph.js`
2. Rename bridge: `spec-kit-compact-code-graph-bridge.mjs` → `mk-code-graph-bridge.mjs`
3. Update PLUGIN_ID constant to `'mk-code-graph'`
4. Update all cross-refs (README, tests, docs)
5. No env var aliases needed (none exist)

## Actionable

**YES** - This finding defines the exact rename scope for Phase C implementation.

## Category

plugin-rename
