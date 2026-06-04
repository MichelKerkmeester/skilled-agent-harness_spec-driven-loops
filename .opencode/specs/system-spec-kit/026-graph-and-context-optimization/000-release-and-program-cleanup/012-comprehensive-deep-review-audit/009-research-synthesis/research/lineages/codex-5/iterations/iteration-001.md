# Iteration 1: Common Root Cause for Doc/Schema-to-Code Drift

## Focus
Determine whether the recurring doc/schema-to-code drift findings come from isolated mistakes or divergent maintained sources of truth.

## Findings

1. The MCP public tool definition for `memory_embedding_reconcile` exposes `mode`, `activeOnly`, `resetMissing`, and other fields in one hand-maintained schema object [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:338]. The runtime Zod schema and allowed-parameter list repeat the same contract separately [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:583].

2. The handler actually chooses apply behavior from `args.mode === 'apply'`; there is no `dryRun: false` path in the handler [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-embedding-reconcile.ts:19]. The feature catalog still tells operators that calling without `dryRun: false` stays in dry-run mode [SOURCE: file:.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:654].

3. `activeOnly` is documented as a public input [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:343], but the reconcile runtime reads `mode`, `resetMissing`, `requireActiveShard`, and `repairSuccessCoverage`, not `activeOnly` [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:299].

4. Governed ingest fields are accepted by the runtime schema via `...governanceSchemaFields` on `memory_index_scan` and `memory_ingest_start` [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:455], while the public tool schema for `memory_index_scan` omits those governance fields [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:522]. This is not just prose drift; public schemas and runtime schemas are separate.

5. Catalog/playbook drift repeats the same class. The catalog says the MCP server exposes 37 tools [SOURCE: file:.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:48], while the README and a test expect 36 [SOURCE: file:.opencode/skills/system-spec-kit/README.md:45] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tests/review-fixes.vitest.ts:117].

## Sources Consulted
- `001-mcp-core/review/deep-review-findings-registry.json`
- `003-mcp-session-index-schema/review/deep-review-findings-registry.json`
- `005-feature-catalog-playbook/review/deep-review-findings-registry.json`
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-embedding-reconcile.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts`
- `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md`

## Assessment
newInfoRatio: 1.00

Novelty justification: first pass; it established the repeated split between public schemas, runtime validation, handlers, docs, catalog, and tests.

Confidence: high. Multiple independently reviewed drift findings reduce the chance that this is an isolated typo.

## Reflection
Worked: using structured review registries first narrowed the direct file reads.

Failed: raw text search across all reports produced duplicate fan-out claims.

Ruled out: "fix docs only." The root cause is not only prose; runtime and public contracts diverge too.

## Recommended Next Focus
Metadata-drift systemic-ness: inspect graph-metadata, generation/backfill scripts, and 026/027 packet counts.
