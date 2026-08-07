# Iteration 1: Review Finding Cluster Map

## Focus

Map the eight merged review registries into recurring symptom clusters and decide which clusters need direct source verification in later iterations.

## Findings

1. The audit findings cluster into six recurring families rather than fifty isolated defects: MCP contract/schema drift, memory write-path correctness, governed-scope/security boundaries, metadata/status drift, catalog/playbook verification drift, and deep-loop executor reliability. The target charter explicitly asks for root causes and blast radius across these same themes, not another per-slice finding inventory. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/009-research-synthesis/spec.md:37]

2. MCP contract drift spans several independent surfaces. The first slice records stale `dryRun:false` documentation, an exposed-but-unused `activeOnly` field, entity-density update staleness, and atomic save ordering risk in one registry, so the common shape is contract drift between handler/runtime, schemas, and operator docs. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/001-mcp-core/review/deep-review-findings-registry.json:17] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/001-mcp-core/review/deep-review-findings-registry.json:76] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/001-mcp-core/review/deep-review-findings-registry.json:106] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/001-mcp-core/review/deep-review-findings-registry.json:137]

3. Governed-scope findings are concentrated in retrieval/causal and session ingest surfaces. One registry records community fallback bypassing governed retrieval scope and bare-ID causal graph access; another records governed metadata accepted by ingest schemas but dropped before indexing. This points to boundary enforcement drift rather than one missing condition. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/002-mcp-retrieval-causal/review/deep-review-findings-registry.json:41] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/002-mcp-retrieval-causal/review/deep-review-findings-registry.json:65] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/003-mcp-session-index-schema/review/deep-review-findings-registry.json:15]

4. Metadata/status drift appears in both 026 and 027. The 026 integrity registry records stale program graph metadata, omitted changelog rollups, stale packet statuses, and stale resource-map rows; the 027 registry records placeholder executable-child claims, old phase IDs, and draft phases marked complete. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/004-026-integrity/review/deep-review-findings-registry.json:17] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/008-027-launch-state/review/deep-review-findings-registry.json:15]

5. Catalog/playbook and governance drift are verification-process problems. The catalog slice records false universal annotation coverage, count drift, scenario-count drift, and broken links; the governance slice records comment-hygiene and sk-doc/sk-code contradictions. These are symptoms of claims that are not rechecked by durable tests at publication time. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/005-feature-catalog-playbook/review/deep-review-findings-registry.json:14] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/006-governance-skdoc-skcode/review/deep-review-findings-registry.json:48]

6. Deep-loop reliability needs separate calibration because it affects the trustworthiness of this audit campaign itself. The interconnected MCP registry records non-zero CLI exits counted as success, synchronous fan-out, per-lineage iteration override drift, and stale service-tier dispatch values. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/007-interconnected-mcps/review/deep-review-findings-registry.json:87]

## Sources Consulted

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/009-research-synthesis/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/001-mcp-core/review/deep-review-findings-registry.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/002-mcp-retrieval-causal/review/deep-review-findings-registry.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/003-mcp-session-index-schema/review/deep-review-findings-registry.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/004-026-integrity/review/deep-review-findings-registry.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/005-feature-catalog-playbook/review/deep-review-findings-registry.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/006-governance-skdoc-skcode/review/deep-review-findings-registry.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/007-interconnected-mcps/review/deep-review-findings-registry.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/008-027-launch-state/review/deep-review-findings-registry.json`

## Assessment

- `newInfoRatio`: 1.00
- Novelty justification: First iteration for this lineage; all cluster mapping is new to the packet.
- Confidence: High for cluster existence because it is drawn from all eight merged registries; medium for root-cause claims until direct source evidence is checked.

## Reflection

What worked: The merged registries provide enough signal to prioritize source verification instead of rereading every lineage iteration.

What failed: Registry title deduplication is imperfect because similar findings were merged from different lineages with slightly different wording.

Ruled out: Treating every registry row as unique would inflate the blast radius; later synthesis should group by symptom and evidence, not raw row count.

## Recommended Next Focus

Verify the MCP contract-drift and memory-correctness clusters directly in source: tool schema fields, handler options, entity-density cache invalidation, and atomic save ordering.
