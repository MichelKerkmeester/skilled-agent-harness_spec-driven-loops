# Iteration 1: claude-mirror

**Dimensions**: security, correctness
**Files reviewed**: .claude/agents/deep-context.md, .opencode/agents/deep-context.md
**Findings**: P0=1 P1=0 P2=0

## Findings
### [P0] Claude mirror grants all Spec Memory MCP tools despite read-only contract (S01-001)
- **Dimension**: security | **Class**: cross-consumer
- **Location**: `.claude/agents/deep-context.md:4`
- **Evidence**: The Claude frontmatter allows `mcp__mk_spec_memory__*`, which grants the whole Spec Kit Memory MCP surface rather than the read-only memory tools named in the body (`memory_search` / `memory_context`) and mirrored by the canonical OpenCode permissions. The same file states the agent is LEAF-only/read-only and must never mutate files or state at lines 24-31.
- **Recommendation**: Replace the wildcard with explicit read-only MCP tool ids needed by this agent, such as `mcp__mk_spec_memory__memory_search`, `mcp__mk_spec_memory__memory_context`, and any other audited read-only retrieval ids; do not grant mutating Spec Memory tools.
- **Scope proof**: Bounded to the two requested files: checked Claude frontmatter, canonical OpenCode permission block, and the shared body read-only contract only.

## Status
complete
