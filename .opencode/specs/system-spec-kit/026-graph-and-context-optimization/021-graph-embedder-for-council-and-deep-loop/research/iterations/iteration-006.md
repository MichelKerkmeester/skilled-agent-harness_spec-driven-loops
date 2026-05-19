# Iteration 006 — Adversarial Challenge: Testing Counterarguments

## Files / DBs read

(No new files - adversarial analysis based on prior findings)

## Findings

1. **Performance argument fails**: Current structural queries use SQL indexes on common columns (kind, session_id, source_id, target_id). These scale well with proper indexing. Semantic search would be slower than exact ID lookups (requires computing similarity against all nodes). Performance is not a valid argument for semantic search - if anything, it's an argument against it.

2. **Scalability argument fails**: As graphs grow, structural queries (traversing edges) remain O(edges) which is manageable. Semantic search would require computing similarity against all nodes, which is O(nodes * dim) - worse scalability. Scalability is not a valid argument for semantic search either.

3. **"Build it and they will come" fallacy**: The argument that "operators don't know what's possible" is rejected by operator principle "Don't build for hypothetical futures." This principle exists precisely to prevent over-engineering for hypothetical use cases. We should wait for explicit requests, not anticipate needs.

4. **Future-proof argument misinterpreted**: Operator principle "future-proof, hardened, strong, effective over speed" refers to quality and robustness, not speculative feature addition. Adding unused complexity doesn't make the system more future-proof - it makes it more complex and harder to maintain.

5. **Infrastructure reuse doesn't justify overuse**: Yes, nomic-embed-text-v1.5 is already configured and the adapter pattern exists. But that's for embedder models, not SQLite extensions. The sqlite-vec dependency is still a new dependency. The existence of a hammer doesn't mean everything is a nail - we should use embedders where there's a concrete need.

6. **No valid counterarguments found**: Common pro-arguments (performance, scalability, future-proofing, infrastructure reuse, operator education) don't apply in this case. The adversarial challenge strengthened the DON'T-BUILD conclusion by showing these arguments are invalid or misapplied.

7. **I'M UNCERTAIN ABOUT THIS**: Whether there are operator education or discoverability issues. Maybe operators would benefit from semantic search but don't know to request it. But the operator principles explicitly reject this reasoning - we should build to solve concrete problems, not to enable hypothetical possibilities.

## Updates to research.md

- Added "Adversarial Analysis" section to research.md documenting counterargument testing
- Updated "Recommendation" section with strengthened DON'T-BUILD rationale
- Added finding that common pro-arguments don't apply in this case

## Open questions for next iter

1. Are there any operator education or discoverability initiatives that would help surface latent needs?
2. Should we add a feature request mechanism to make it easier for operators to request capabilities?
3. Is there a threshold of operator demand that would justify revisiting this decision?
4. How do we balance "don't build for hypothetical futures" with being proactive about operator needs?

## Convergence signal

- new findings vs prior iter: 7 new findings
- Strong convergence toward DON'T-BUILD - adversarial challenge found no valid counterarguments
- Evidence is consistent across multiple angles: technical, operational, operator principles
