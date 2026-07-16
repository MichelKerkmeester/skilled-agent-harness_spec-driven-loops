# Resource Map

Evidence-derived map for this lineage. The source spec folder did not contain an upstream `resource-map.md` at init, so this file records resources discovered from iteration evidence.

| Area | Resource | Status | Why It Matters |
|---|---|---|---|
| Charter | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/009-research-synthesis/spec.md` | Read | Defines the five research questions and read-only synthesis scope. |
| Review Registry | `001-mcp-core/review/deep-review-findings-registry.json` | Read | Memory write-path, reconcile, and doc/schema drift findings. |
| Review Registry | `002-mcp-retrieval-causal/review/deep-review-findings-registry.json` | Read | Scoped fallback and causal authorization findings. |
| Review Registry | `003-mcp-session-index-schema/review/deep-review-findings-registry.json` | Read | Governed ingest and public schema drift findings. |
| Review Registry | `004-026-integrity/review/deep-review-findings-registry.json` | Read | 026 metadata and changelog drift findings. |
| Review Registry | `005-feature-catalog-playbook/review/deep-review-findings-registry.json` | Read | Catalog, playbook, count, and link drift findings. |
| Review Registry | `006-governance-skdoc-skcode/review/deep-review-findings-registry.json` | Read | Comment hygiene and skill/doc contract drift findings. |
| Review Registry | `007-interconnected-mcps/review/deep-review-findings-registry.json` | Read | Deep-loop runtime and code-graph integration findings. |
| Review Registry | `008-027-launch-state/review/deep-review-findings-registry.json` | Read | 027 launch metadata and placeholder phase findings. |
| Runtime Code | `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | Read | Public MCP tool definitions and tool count. |
| Runtime Code | `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | Read | Zod runtime schema and allowed-parameter map. |
| Runtime Code | `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts` | Read | Scoped pipeline and unscoped community fallback path. |
| Runtime Code | `.opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts` | Read | Global community summary scan and member ID return. |
| Runtime Code | `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts` | Read | Bare-ID causal link/unlink handlers. |
| Runtime Code | `.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts` | Read | Cache TTL and invalidation contract. |
| Runtime Code | `.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts` | Read | Pending-file, index, promote ordering. |
| Metadata Tooling | `.opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts` | Read | Bulk metadata refresh and review flag heuristics. |
| Metadata Tooling | `.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts` | Read | Canonical save and phase-parent pointer update. |
| Deep Loop Runtime | `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs` | Read | Fulfilled/rejected pool summary semantics. |
| Deep Loop Runtime | `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Read | CLI subprocess spawn, exit-code return, lineage summary writing. |
| Catalog | `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md` | Read | Tool-count and universal-coverage claims. |
| Playbook | `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` | Read | Scenario-count release gate drift. |
