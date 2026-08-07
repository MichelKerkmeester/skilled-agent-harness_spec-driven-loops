# Iteration 1: Doc/schema-to-code drift

## Focus

Investigate whether the recurring doc/schema/runtime drift comes from a single broken generator or from independently maintained contracts.

## Actions Taken

- Read the research charter and eight merged review registries.
- Compared public tool schemas, Zod input schemas, operator docs, handlers, and job-queue persistence for representative drift findings.

## Findings

1. The `memory_embedding_reconcile` public schema advertises `mode: "dry-run" | "apply"` and also exposes `activeOnly`, while the operator guide still tells users to pass `dryRun: false`. The runtime reads `args.mode` and never reads `args.activeOnly` in the reconcile function. This is not a single stale comment; it is a public-schema, docs, and implementation split. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:338] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:294] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:735]

2. Governed ingest fields exist in the Zod schemas and handler argument types for both `memory_index_scan` and `memory_ingest_start`. Those fields are validated by `validateGovernedIngest`, but scan destructuring keeps only scan controls and the async ingest job stores only `id`, `paths`, and `specFolder`. The metadata becomes a preflight gate, not persisted indexing state. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:233] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:254] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:316] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:38] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:262] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts:253]

3. The scan path delegates indexing through `indexMemoryFile` with only `force`, `qualityGateMode`, `fromScan`, and `asyncEmbedding`; no governed scope or provenance is passed through. This confirms the metadata drop happens before shared indexing, not merely in response formatting. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:277] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:708]

4. The eight merged review registries show this same contract drift across unrelated surfaces: reconcile docs/schema, governed ingest schemas, public tool definitions, catalog/playbook counts, stale paths, and sk-doc-vs-template rules. That breadth argues against one generator defect and toward missing round-trip tests between generated/advised surfaces and runtime behavior. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/001-mcp-core/review/deep-review-findings-registry.json:1] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/003-mcp-session-index-schema/review/deep-review-findings-registry.json:1] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/005-feature-catalog-playbook/review/deep-review-findings-registry.json:1]

## Questions Answered

- Q1 is answered. The common cause is divergent source-of-truth maintenance, not a single obviously broken generator. The repair target is a contract test/generator boundary: tool schemas, Zod schemas, docs, examples, and handler behavior need round-trip checks.

## Questions Remaining

- Q2 metadata drift systemicness.
- Q3 memory correctness impact.
- Q4 P0 severity calibration.
- Q5 deep-loop blast radius.

## Reflection

What worked: reading merged registries first gave a pattern map, then direct file reads separated repeated symptoms from causes.

What failed: searching for one central generator did not explain all drift classes; several surfaces are hand-authored or separately maintained.

Ruled out: "one stale doc page caused the drift" is too narrow; the evidence spans schemas, docs, runtime forwarding, catalog assertions, and skill governance docs.

## Recommended Next Focus

Q2 metadata drift: determine whether stale graph-metadata/status drift is systemic by sampling metadata and generators/backfills.

## Assessment

- newInfoRatio: 1.0
- Novelty justification: First iteration; it establishes the dominant drift mechanism with direct code/doc evidence.
- Confidence: High for Q1; medium for the broader generator/backfill recommendation until Q2 inspects metadata automation.
