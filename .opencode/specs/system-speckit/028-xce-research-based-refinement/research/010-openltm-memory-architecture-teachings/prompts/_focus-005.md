
# YOUR NARROW FOCUS — iteration 005 of 10: Typed knowledge graph + BFS conflict detection
Read (stay scoped to this subsystem):
- `packages/openltm-core/src/graph.ts` — BFS traversal, conflict/reinforcement detection
- `packages/openltm-core/src/db.ts` — the `relate()` function (edge create/update)
- `migrations/004_graph_reasoning.sql`, `migrations/018_relation_semantics.sql`
- `src/cluster.ts`, `migrations/005_clusters.sql`, `migrations/016_memory_layout.sql`
- `docs/03-architecture.md` — graph section
Focus on: the 6 typed edges (supports/contradicts/refines/depends_on/related_to/supersedes) and whether OpenLTM detects CONTRADICTIONS / supersession at recall time. Contrast with our causal edges — is recall-time conflict detection + a `contradicts`/`supersedes` vocabulary a genuine delta over our causal-edge model?
