# Iteration 007 — Test File Analysis and Final Evidence Check

## Files / DBs read

- `.opencode/skills/system-spec-kit/mcp_server/tests/council-graph.vitest.ts:1-100`
  - Tests structural operations: upsert, query unresolved disagreements, decision support
  - Test data uses structural node kinds (SESSION, SEAT, CLAIM, EVIDENCE, DISAGREEMENT, DECISION)
  - No semantic search or text-based similarity tests
  - Focus is on graph structure (edges, node kinds, metadata)

- `.opencode/skills/system-spec-kit/scripts/tests/coverage-graph-convergence.vitest.ts:1-100`
  - Tests convergence signals: source diversity, evidence depth, question coverage
  - All calculations are graph-based (path length, edge traversal, node counting)
  - No semantic search or text-based similarity tests
  - Focus is on structural graph metrics for stop-gate logic

## Findings

1. **Test files confirm structural-only usage**: Council-graph tests focus on structural operations (upsert, query unresolved disagreements, decision support). Coverage-graph tests focus on structural convergence metrics (source diversity, evidence depth, question coverage). No semantic search tests exist.

2. **Convergence tests are purely structural**: The coverage-graph-convergence tests compute metrics based on graph topology (path lengths, edge counts, node kinds). Source diversity is "average distinct source quality classes per question" - a structural metric, not a semantic one.

3. **No evidence of latent semantic search needs**: If semantic search were a latent need, we would expect to see test patterns that approximate semantic behavior (e.g., text matching, keyword overlap). The absence of such patterns suggests no latent need.

4. **Test coverage aligns with documentation**: Test coverage matches the technical documentation - structural queries and convergence detection. This consistency across documentation, code, and tests strengthens confidence that current use cases are purely structural.

5. **No operator-facing test scenarios**: The tests are all technical validation (database operations, graph algorithms). There are no operator-facing scenario tests that would reveal workflow needs not captured in technical documentation.

6. **Final evidence check complete**: After 7 iterations examining schema, handlers, documentation, AI agent workflows, adversarial arguments, and tests, no evidence supports adding semantic search. All evidence points to DON'T-BUILD.

7. **Convergence achieved**: The research has converged strongly on DON'T-BUILD. Multiple lines of evidence (schema analysis, handler patterns, documentation, AI agent usage, adversarial challenge, test coverage) all align on the same conclusion.

## Updates to research.md

- Updated "Operator Config" section with note that config analysis is academic given DON'T-BUILD recommendation
- Added final evidence summary to research synthesis
- Updated convergence status in Recommendation section

## Open questions for next iter

- None - research has converged on DON'T-BUILD
- Ready to proceed to final synthesis (research-report.md)

## Convergence signal

- new findings vs prior iter: 7 new findings
- Strong convergence achieved - all evidence aligns on DON'T-BUILD
- Multiple lines of evidence (schema, handlers, docs, AI agents, adversarial, tests) all consistent
- Ready for final synthesis
