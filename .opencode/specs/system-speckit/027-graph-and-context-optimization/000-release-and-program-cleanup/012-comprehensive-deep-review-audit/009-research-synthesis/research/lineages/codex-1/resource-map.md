# Resource Map

## Artifact Outputs

- deep-research-config.json: final loop config and artifact binding.
- deep-research-state.jsonl: append-only phase and iteration state.
- deep-research-findings-registry.json: final question registry.
- findings-registry.json: compatibility copy of the registry.
- deep-research-dashboard.md: loop dashboard.
- iterations/iteration-001.md through iterations/iteration-005.md: per-pass research reports.
- deltas/iter-001.jsonl through deltas/iter-005.jsonl: per-pass structured deltas.
- evidence/status-mismatch-scan.json: read-only metadata drift scan summary.
- evidence/orchestration-summary.tsv: source review-slice lineage summary.
- evidence/review-finding-clusters.json: clustered review finding summary.
- research.md: final synthesis.

## Primary Source Families

### Research Charter

- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/009-research-synthesis/spec.md: defines the synthesis purpose and five questions.

### Memory and Retrieval MCP

- .opencode/skills/system-spec-kit/mcp_server/src/memory-crud-update.ts: memory update path.
- .opencode/skills/system-spec-kit/mcp_server/src/memory/vector-index-mutations.ts: title/trigger mutation and cache refresh behavior.
- .opencode/skills/system-spec-kit/mcp_server/src/memory/entity-density.ts: entity-density TTL and invalidation.
- .opencode/skills/system-spec-kit/mcp_server/src/memory/atomic-index-memory.ts: pending file write, indexing, and promotion order.
- .opencode/skills/system-spec-kit/mcp_server/src/memory-search.ts: governed search pipeline and community fallback integration.
- .opencode/skills/system-spec-kit/mcp_server/src/community-search.ts: fallback search without scope parameter.
- .opencode/skills/system-spec-kit/mcp_server/src/stage1-candidate-gen.ts: normal scoped candidate filtering.
- .opencode/skills/system-spec-kit/mcp_server/src/scope-governance.ts: scope constraint helpers.
- .opencode/skills/system-spec-kit/mcp_server/src/causal-graph.ts: public causal link handler.
- .opencode/skills/system-spec-kit/mcp_server/src/memory/causal-edges.ts: causal edge insert behavior and orphan detection.

### Schemas, Docs, and Ingest

- .opencode/skills/system-spec-kit/mcp_server/src/tool-schemas.ts: public MCP tool definitions.
- .opencode/skills/system-spec-kit/mcp_server/src/tool-input-schemas.ts: runtime input schemas.
- .opencode/skills/system-spec-kit/mcp_server/src/memory-index.ts: scan/index path.
- .opencode/skills/system-spec-kit/mcp_server/src/memory-ingest.ts: async ingest path.
- .opencode/skills/system-spec-kit/mcp_server/src/context-server.ts: ingest queue processFile binding.
- .opencode/skills/system-spec-kit/INSTALL_GUIDE.md: installation playbook examples.

### Metadata and Graph Context

- .opencode/skills/system-spec-kit/graph/graph-metadata-parser.ts: graph metadata derivation logic.
- .opencode/skills/system-spec-kit/graph/graph-metadata-schema.vitest.ts: tests that encode completion fallback behavior.
- .opencode/specs/system-spec-kit/027-code-graph-mcp/003-incremental-index-foundation/spec.md: sample Draft spec.
- .opencode/specs/system-spec-kit/027-code-graph-mcp/003-incremental-index-foundation/graph-metadata.json: sample graph-complete metadata.
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md: root recency claim.
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json: root last-active pointer.

### Deep Loop Runtime

- .opencode/skills/deep-loop-runtime/bin/fanout-run.cjs: fanout prompt construction, timeout sizing, spawnSync worker, exit-code return.
- .opencode/skills/deep-loop-runtime/src/fanout-pool.cjs: capped pool success/failure accounting.
- .opencode/skills/deep-loop-runtime/src/executor-config.ts: fanout lineage schema and iterations contract.
