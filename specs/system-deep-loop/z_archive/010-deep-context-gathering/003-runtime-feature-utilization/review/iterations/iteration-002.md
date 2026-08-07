# Deep Review — Iteration 002

**Dimension**: correctness
**Scope**: deep-loop-runtime: fanout-run.cjs, convergence.cjs, coverage-graph-{db,signals,query}.ts, executor-config.ts
**Executor**: cli-opencode openai/gpt-5.5-fast --variant xhigh (read-only)
**Raw output**: /tmp/dr-r2.out

## Findings

- **[P1] R2-1** `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts:624`
  - Issue: dependencyCompleteness records edge.sourceId for DEPENDS_ON, but the documented context contract is SYMBOL->DEPENDENCY (DEPENDENCY is the edge TARGET)
  - Impact: dependency coverage stays falsely low for correctly directed edges, depressing the composite score and blocking STOP_ALLOWED
  - Fix: count DEPENDS_ON target ids for DEPENDENCY nodes (and handle IMPORTS by its documented direction) — VERIFY actual upsert direction in R9 before changing
- **[P2] R2-2** `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts:634`
  - Issue: agreementRate uses all finding nodes as the denominator instead of relevance-gated findings
  - Impact: below-gate noise can still depress agreement and block convergence even though it should be excluded
  - Fix: filter finding nodes by metadata.relevance >= CONTEXT_RELEVANCE_GATE before computing agreementRate

## Clean (no findings this lens)

- .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs (this round/correctness lens)
- .opencode/skills/deep-loop-runtime/scripts/convergence.cjs
- .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts
- .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-query.ts
- .opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts
