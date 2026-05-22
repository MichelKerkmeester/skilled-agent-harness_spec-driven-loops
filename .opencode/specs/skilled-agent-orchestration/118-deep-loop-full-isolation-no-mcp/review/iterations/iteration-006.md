# Iteration 6 — Consumer Cutover Deep-Dive

## Summary

Iteration 6 focused on consumer-side cutover verification post-arc 118. Deep-review SKILL.md correctly references deep-loop-runtime paths. All 4 workflow YAMLs correctly invoke deep-loop-runtime scripts with proper CLI args and interpolation tokens. /doctor route manifest correctly uses script_invocations instead of removed MCP tools. System-code-graph feature catalog supersession block is structurally accurate. Found 1 new P1 finding: deep-research changelog missing entry for the deep-loop-runtime dependency switch in arc 118.

## Findings

### P0
None.

### P1

**F-026: deep-research changelog missing arc 118 dependency switch entry**
- **Dimension**: consumer-cutover
- **File**: `.opencode/skills/deep-research/changelog/`
- **Line**: N/A (missing entry)
- **Evidence**: Arc 118 (FULL_ISOLATE_NO_MCP) removed the 4 `mcp__mk_spec_memory__deep_loop_graph_*` MCP tools and replaced them with direct `.cjs` script entry points under `.opencode/skills/deep-loop-runtime/scripts/`. Deep-review changelog (v1.4.0.0) documents this transition. Deep-research SKILL.md (v1.6.2.0) correctly references the deep-loop runtime via `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts`. However, deep-research changelog entries v1.7.0.0 through v1.11.0.0 contain no corresponding entry for this dependency switch. The arc missed updating deep-research changelog to document the deep-loop-runtime dependency change.
- **Fix**: Add a changelog entry to deep-research documenting the arc 118 deep-loop-runtime dependency switch (similar to how deep-review v1.4.0.0 documents it). The entry should note that coverage graph tools now dispatch through deep-loop-runtime scripts instead of MCP tools.

### P2
None.

## Convergence Signal
- newFindings: 1
- Cumulative: P0=0 P1=12 P2=11
