# Iteration 004 - Maintainability

Focus: stale source references in sampled catalog leaves and maintainability of the verification surface.

## Actions

- Parsed obvious backticked implementation paths in the sampled feature catalog category.
- Checked the local-LLM category source table against live files.
- Located current embedding and causal handler implementations.

## Findings

### P1-006 - The local-LLM catalog category points at stale implementation paths for shared embeddings and drift handlers

The local-LLM category lists `mcp_server/shared/embeddings/factory.ts`, `profile.ts`, `README.md`, and `causal-graph-db.ts` as implementation/doc paths [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/local-llm-query-intelligence/category-overview.md:40]. It also points to `mcp_server/handlers/memory-drift-why.ts` [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/local-llm-query-intelligence/category-overview.md:45].

The live embedding factory is under the sibling shared package [SOURCE: .opencode/skills/system-spec-kit/shared/embeddings/factory.ts:1]. The `memory_drift_why` feature is implemented by the consolidated causal graph handler, which carries feature catalog comments for `memory_causal_stats` and `memory_drift_why` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:28], and the handler function begins at line 468 [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:468].

Impact: the category's source table sends operators to missing files for a newly added feature area.

Fix: update the source table to `shared/embeddings/*` and `mcp_server/handlers/causal-graph.ts`.

Claim adjudication packet:
```json
{
  "findingId": "P1-006",
  "claim": "The local-LLM category has stale source paths for shared embeddings and drift handling.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/feature_catalog/local-llm-query-intelligence/category-overview.md:40",
    ".opencode/skills/system-spec-kit/feature_catalog/local-llm-query-intelligence/category-overview.md:45",
    ".opencode/skills/system-spec-kit/shared/embeddings/factory.ts:1",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:28",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:468"
  ],
  "counterevidenceSought": "Searched the live mcp_server/handlers tree and shared/embeddings package for causal and embedding implementations.",
  "alternativeExplanation": "The category may have been drafted before the shared embeddings package was extracted and causal handlers consolidated.",
  "finalSeverity": "P1",
  "confidence": 0.93,
  "downgradeTrigger": "Downgrade if a generated docs layer rewrites these paths before users see them."
}
```

## Verdict

One new P1 maintainability finding. No P0.

Review verdict: CONDITIONAL
