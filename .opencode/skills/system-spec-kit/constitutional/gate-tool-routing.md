---
title: "TOOL ROUTING - Search & Retrieval Decision Tree"
importanceTier: constitutional
contextType: decision
last_confirmed: "2026-06-05"
last_confirmed_source: "git-log-last-touch"
triggerPhrases:
  # Search routing
  - search
  - find
  - look up
  - retrieve
  - query
  - semantic search
  - code search
  - grep
  - community search
  # Graph retrieval
  - graph retrieval
  - community summaries
  - dual level
  - retrievalLevel
  - global search
  - local search
  # Tool selection
  - which tool
  - Code Graph
  - memory_search
  - memory_context
---

# Tool Routing Decision Tree

> Lean constitutional rule. Always-surface guidance for picking the right retrieval tool by query shape.

## Code Search Decision Tree (MANDATORY)

Route code search queries using this priority order:

| Query Type | Primary Tool | Fallback |
|-----------|-------------|----------|
| **Semantic/concept** (meaning-based) | `mcp__mk_code_index__code_graph_query` (Code Graph) | `Grep` / `Glob` |
| **Structural** (callers, imports, deps) | `code_graph_query` (Code Graph) | `Grep` / `Glob` |
| **Exact text/regex** (string literal) | `Grep` | `Glob` |

## Memory & Context Search

| Query Type | Primary Tool | Fallback |
|-----------|-------------|----------|
| **Spec-doc continuity** (prior work, decisions) | `memory_search` / `memory_context` | `memory_match_triggers` |
| **Broad topic** (thematic overview) | `memory_search` with `retrievalLevel: "global"` | community search fallback |

## FTS 3-Tier Fallback Chain

When both graph and semantic search miss or return weak results, apply the 3-tier FTS fallback:

1. **FTS5 full-text** — exact keyword match against indexed content
2. **BM25 keyword scoring** — relevance-ranked keyword retrieval
3. **Grep/Glob** — direct filesystem text search as last resort

This ensures no query goes unanswered even when embeddings or the graph index are unavailable.

## Memory Search Retrieval Levels

- **`local`** (default): Entity-level matching against individual spec-doc records
- **`global`**: Community-level matching against topic clusters
- **`auto`**: Local first; if weak results (<3), falls back to community search

## Graph Retrieval Features

- **Always-on code-graph context injection**: Graph signals (structural edges, call chains, import trees) are injected into every retrieval response regardless of causal boost state (SPECKIT_GRAPH_CONTEXT_INJECTION). This ensures structural awareness is never absent from search results.
- **Community search fallback**: Activates on weak/zero results (SPECKIT_COMMUNITY_SEARCH_FALLBACK)
- **Query concept expansion**: Expands query with alias terms (SPECKIT_QUERY_CONCEPT_EXPANSION)
- **Graph-expanded fallback**: Walks causal edges for expanded terms (SPECKIT_GRAPH_FALLBACK)
- **Result provenance**: graphEvidence field shows contributing edges and communities (SPECKIT_RESULT_PROVENANCE)

## Maintenance

These routing tables are derived from the search handlers in `system-code-graph/` and `system-spec-kit/mcp_server/handlers/` (`memory-search`, `memory-context`, `memory-triggers`) plus the FTS5/BM25 search lib. When a handler's routing contract changes, update its docstring and this rule together.

*Constitutional rule — always surfaces at top of search results*
