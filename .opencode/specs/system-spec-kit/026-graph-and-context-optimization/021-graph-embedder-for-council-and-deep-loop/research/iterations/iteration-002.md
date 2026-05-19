# Iteration 002 — Existing Query Patterns and Operator Workflows

## Files / DBs read

- `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/query.ts:1-125`
  - Council graph query types: unresolved_disagreements, evidence_chain, decision_support, convergence_blockers, hot_nodes
  - All queries are structural/graph-based (following edges, checking node kinds, counting connections)
  - No text-based or semantic queries exist

- `.opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:1-188`
  - Coverage graph query types: uncovered_questions, unverified_claims, contradictions, provenance_chain, coverage_gaps, hot_nodes
  - All queries are structural/graph-based (edge traversal, node kind filtering, coverage analysis)
  - No text-based or semantic queries exist

## Findings

1. **Existing queries are purely structural**: Both council and coverage graphs currently support only graph-traversal and structural queries (edge following, node kind filtering, coverage gap detection). There are no text-based searches, keyword searches, or semantic similarity queries.

2. **Council graph query patterns**:
   - `unresolved_disagreements`: Find DISAGREEMENT nodes without RESOLVES edges
   - `evidence_chain`: BFS traversal following EVIDENCE_FOR/SUPPORTS/DERIVES_FROM edges
   - `decision_support`: Count incoming SUPPORTS/EVIDENCE_FOR/AGREES_WITH edges for DECISION/RECOMMENDATION nodes
   - `convergence_blockers`: Find unresolved critical disagreements, low-confidence decisions, unsupported decisions
   - `hot_nodes`: Rank nodes by edge count + weight sum

3. **Coverage graph query patterns**:
   - `uncovered_questions`: Find QUESTION nodes with no incoming ANSWERS/COVERS edges (research only)
   - `coverage_gaps`: Find DIMENSION/FILE nodes with no outgoing COVERS/EVIDENCE_FOR edges (review)
   - `unverified_claims`: Find CLAIM nodes with verification_status != 'verified' (research) or FINDING nodes with no RESOLVES edges (review)
   - `contradictions`: Find all CONTRADICTS edge pairs
   - `provenance_chain`: BFS traversal following CITES/EVIDENCE_FOR/DERIVED_FROM/SUPPORTS edges
   - `hot_nodes`: Rank nodes by edge count + weight sum

4. **No semantic search capability exists**: None of the existing queries use the `name` field content for search or similarity. All queries operate on graph structure (edges, node kinds, metadata fields). This suggests semantic search would be a NEW capability, not a replacement for existing functionality.

5. **Operator workflows are AI-agent centric**: The graphs are described as "derived from ai-council artifacts" and used for "deep-research/deep-review cycles". The query patterns suggest the primary consumers are AI agents doing coverage analysis, convergence checking, and provenance tracking - not human operators doing ad-hoc semantic search.

6. **Potential semantic search workflows** (hypothetical, not currently implemented):
   - Cross-session similarity: "Find prior councils that converged on similar conclusions" - would require semantic search over DECISION/RECOMMENDATION node names across sessions
   - Near-duplicate detection: "Did seat 3 just rephrase seat 1's claim?" - would require semantic similarity over CLAIM node names within a session
   - Finding clustering: "Group findings that report the same defect across packets" - would require semantic similarity over FINDING node names across spec folders
   - Dimension retrospectives: "Which dimensions did we revisit across deep-review cycles?" - would require semantic similarity over DIMENSION node names across sessions

7. **I'M UNCERTAIN ABOUT THIS**: Whether these hypothetical workflows are actual operator needs or just theoretical possibilities. The existing query patterns suggest operators/agents are focused on structural analysis (coverage, convergence, provenance) rather than semantic content exploration.

## Updates to research.md

- Updated "Capabilities Unlocked" section with hypothetical semantic search workflows
- Updated "Comparison to mk-spec-memory" section with observation that current graphs have no search capability at all (purely structural)
- Added finding that existing queries are purely structural with no text-based search

## Open questions for next iter

1. Are the hypothetical semantic search workflows actual operator needs, or just theoretical possibilities?
2. How would semantic search compose with existing structural queries? Would it be a separate query type or integrated into existing queries?
3. What's the incremental value of semantic search over the existing structural queries? Does it enable new use cases or just provide alternative access patterns?
4. Should semantic search be cross-session (across all spec folders/sessions) or scoped to a single session? The existing queries are session-scoped.
5. How would vector similarity be implemented in SQLite? No native vector operations - would need application-layer distance computation or a SQLite extension.

## Convergence signal

- new findings vs prior iter: 5 new findings
- Not converged yet - significant new information about existing query patterns and hypothetical workflows
