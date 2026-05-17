# Codex Runtime Routing

## Tool Routing Enforcement

SEARCH ROUTING: use CocoIndex semantic search (`mcp__cocoindex_code__search`) for concept, similarity, implementation-pattern, and "how does this work" code discovery. Use Code Graph structural search (`mcp__mk_code_index__code_graph_query`) for callers, imports, dependencies, outlines, symbols, and impact questions. Use exact text search only when the user gives a literal token, path, or regex.
