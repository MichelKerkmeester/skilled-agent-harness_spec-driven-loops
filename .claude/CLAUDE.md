# Claude Runtime Routing

## Tool Routing Enforcement

SEARCH ROUTING: use Code Graph structural search (`mcp__mk_code_index__code_graph_query`) plus Grep for concept, similarity, implementation-pattern, and "how does this work" code discovery. Use Code Graph for callers, imports, dependencies, outlines, symbols, and impact questions. Use exact text search when the user gives a literal token, path, or regex. Use `memory_search` only for spec docs and saved memory, not arbitrary code.

## Logic-Sync Protocol

When implementation evidence conflicts with the approved spec, stop and escalate for an AMENDMENT decision instead of shipping a silent workaround. Escalate once with the conflicting facts, a one-sentence root cause when known, and the decision needed.
