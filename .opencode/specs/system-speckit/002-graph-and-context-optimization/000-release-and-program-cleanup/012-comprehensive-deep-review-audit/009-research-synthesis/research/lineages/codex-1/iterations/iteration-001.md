# Iteration 001: Cluster all eight review slices and identify recurring failure families.

## Focus

Cluster all eight review slices and identify recurring failure families.

## Findings

1. The dominant pattern is contract drift, not one bad component: schemas, docs, validators, and runtime handlers repeatedly disagree about the same tool surfaces. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/src/tool-schemas.ts:342]
2. Governed ingest illustrates the pattern cleanly: tool schemas accept governance fields, but scan and async ingest paths drop them before indexing. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/src/tool-input-schemas.ts:455] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/src/memory-index.ts:721]
3. The review set also contains metadata, documentation, and orchestration variants of the same failure: generated claims are refreshed without source-of-truth reconciliation. [SOURCE: .opencode/skills/system-spec-kit/graph/graph-metadata-parser.ts:1030]
4. This is broader than stale prose because runtime behavior, public schema, and operational docs are all implicated. [SOURCE: .opencode/skills/system-spec-kit/INSTALL_GUIDE.md:737]
5. Initial negative check: isolated review false positives do not explain the breadth across MCP core, retrieval, indexing, governance, docs, and deep-loop orchestration. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/009-research-synthesis/research/lineages/codex-1/evidence/review-finding-clusters.json:2]

## Sources Consulted

- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/001-mcp-core-review/review/deep-review-findings-registry.json
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/002-mcp-retrieval-causal-review/review/deep-review-findings-registry.json
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/003-mcp-session-index-schema-review/review/deep-review-findings-registry.json
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/004-026-integrity-and-metadata-review/review/deep-review-findings-registry.json
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/005-catalog-playbook-comments-review/review/deep-review-findings-registry.json
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/006-governance-skdoc-skcode-review/review/deep-review-findings-registry.json
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/007-interconnected-mcps-and-deep-loops-review/review/deep-review-findings-registry.json
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/008-027-launch-state-readiness-review/review/deep-review-findings-registry.json
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/009-research-synthesis/research/lineages/codex-1/evidence/review-finding-clusters.json:2

## Assessment

Question 1 likely points to contract-governance drift. Question 2 requires a direct metadata scan before calling it systemic.

## Reflection

The strongest evidence comes from places where the boundary contract accepts or advertises one thing and the handler persists or executes another.

## Recommended Next Focus

Verify memory-correctness impact and P0 severity calibration against code paths, not finding labels.

## Iteration Metrics

- Status: complete
- Findings count: 5
- New information ratio: 1
- Novelty justification: Established initial taxonomy from review registries and direct source verification.
