# Iteration 004 — Operator Needs and Use Case Validation

## Files / DBs read

- `.opencode/skills/system-spec-kit/mcp_server/lib/council-graph/README.md:1-134`
  - Technical code documentation (folder boundary, structure, verification)
  - No operator workflows or use cases documented
  - Focus is on code organization and sk-code alignment

- `.opencode/skills/system-spec-kit/mcp_server/lib/coverage-graph/README.md:1-163`
  - Technical architecture documentation (storage, query, signal helpers)
  - Purpose: "Storage, query and signal helpers for session-scoped deep-loop coverage graphs"
  - No operator workflows or semantic search use cases documented
  - Focus is on library layer boundaries and data flow

## Findings

1. **No documented operator workflows**: Neither council-graph nor coverage-graph README files document any operator-facing use cases or workflows. The documentation is purely technical (code structure, architecture, verification) with no mention of semantic search needs.

2. **Council-graph purpose unclear from docs**: The council-graph README is a generic code README template with no specific purpose statement beyond "Internal library code for reusable skill behavior." It doesn't explain what problem the council graph solves for operators.

3. **Coverage-graph purpose is technical**: The coverage-graph README states its purpose is "Storage, query and signal helpers for session-scoped deep-loop coverage graphs." This describes the technical function, not operator value. The documented capabilities are structural (coverage gaps, contradictions, provenance chains, hot nodes) with no mention of semantic search.

4. **No evidence of operator demand**: The absence of semantic search in documented use cases, combined with the purely structural nature of existing queries, suggests there is no current operator demand for semantic search over these graphs.

5. **Operator principle "Don't build for hypothetical futures" applies**: Without concrete operator workflows or documented needs, adding semantic search would be building for hypothetical futures. The principle states "only ship if there's a concrete operator workflow that benefits."

6. **Alternative approaches are also unjustified**: Even FTS5-only (80% value at 20% cost) is unjustified without concrete operator needs. If there's no problem to solve, adding any search capability is premature.

7. **"Fix code, don't bandaid with model swaps" principle**: This principle suggests we should fix actual problems rather than adding capabilities to work around problems. If operators are not struggling with the current structural queries, then adding semantic search would be a bandaid, not a fix.

8. **I'M UNCERTAIN ABOUT THIS**: Whether there are undocumented operator workflows that would benefit from semantic search. The absence of documentation doesn't prove absence of need - operators might be informally requesting this feature or struggling silently.

## Updates to research.md

- Updated "Capabilities Unlocked" section with note that no documented operator workflows exist
- Updated "Recommendation" section with stronger DEFER rationale based on lack of concrete operator needs
- Added finding that technical documentation reveals no operator-facing use cases for semantic search

## Open questions for next iter

1. Are there undocumented operator workflows or informal requests for semantic search?
2. Should we actively solicit operator feedback before investing in this feature?
3. Is there a minimal viable experiment (e.g., one-shot script) to test operator interest before committing to schema changes?
4. What's the smallest possible implementation that could validate operator need without full schema migration?

## Convergence signal

- new findings vs prior iter: 8 new findings
- Not converged yet - significant new information about lack of documented operator needs
- Strong evidence that hypothetical workflows are just theoretical, but uncertainty remains about undocumented needs
