# Claude Runtime Routing

## Tool Routing Enforcement

SEARCH ROUTING: use Grep for concept, similarity, implementation-pattern, and "how does this work" code discovery, then Glob to map the surrounding tree and Read to confirm. Callers, imports, dependencies and impact questions are answered the same way — grep the symbol, then widen the pattern rather than trusting a single hit. Use exact text search when the user gives a literal token, path, or regex. Use `memory_search` only for spec docs and saved memory, not arbitrary code.

## Logic-Sync Protocol

When implementation evidence conflicts with the approved spec, stop and escalate for an AMENDMENT decision instead of shipping a silent workaround. Escalate once with the conflicting facts, a one-sentence root cause when known, and the decision needed.
