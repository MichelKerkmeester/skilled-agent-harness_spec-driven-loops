# Plan: CodeGraph Migration in AGENTS.md

## Changes Required

### 1. Section 1 - Mandatory Tools
- Update "Semantic Search MCP is MANDATORY" → "CodeGraph MCP is MANDATORY"

### 2. Section 2 - Code Quality Standards Compliance  
- Update skill reference from `mcp-semantic-search` to `mcp-codegraph`

### 3. Section 6 - Tool Selection
- Update "Two Semantic Systems" table: replace semantic_search entries with codegraph
- Update skill references line

### 4. Section 7 - Tool Routing
- Replace `mcp__semantic_search__semantic_search()` with `codegraph_agentic_context()`
- Update NATIVE MCP block with codegraph tools

### 5. Section 8 - Skills System
- Replace `mcp-semantic-search` skill entry with `mcp-codegraph`
- Add `workflows-create-plugin` skill entry

## New Skill Entries

### mcp-codegraph
GraphRAG-powered code intelligence providing agentic reasoning tools (agentic_context, agentic_impact, agentic_architecture, agentic_quality) that return synthesized ANSWERS about code relationships, dependencies, architecture, and quality metrics.

### workflows-create-plugin
OpenCode plugin development specialist providing plugin architecture guidance, hook implementation patterns, build configuration, and debugging workflows.
