# Iteration 004 — Local-LLM Legacy Hunt

## Focus
This correctness pass scanned production TypeScript/Python/CJS, committed runtime configs, package manifests, scoped description/graph metadata, and the embedding-related asset/template surfaces for post-022 residue that can change runtime behavior or keep committed config state pointed at pre-profile database assumptions. The scan specifically targeted hardcoded singleton sqlite names, stale no-dtype cloud profile names, ONNX runtime remnants in executable surfaces, stale 384/default assertions, and provider fallback paths that could violate the canonical Voyage -> OpenAI -> llama-cpp -> hf-local resolver contract.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|
| L-004-001 | P1 | correctness | .opencode/skills/system-spec-kit/mcp_server/scripts/migrations/restore-checkpoint.ts:169 | "`\`${toTimestampId(now)}__pre-restore-context-index.sqlite\`,`" | confirmed-residue | Replace the backup basename with an active-profile-derived basename, for example `pre-restore-${path.basename(args.dbPath)}`, so migration backups do not preserve the retired singleton DB name in production code. |
| L-004-002 | P1 | correctness | .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/054-runtime-cleanup-followups/graph-metadata.json:88 | "\"path\": \"mcp_server/database/context-index__voyage__voyage-4__1024.sqlite\"," | confirmed-residue | Refresh this graph metadata so derived key-file/entity paths use the canonical dtype-inclusive cloud profile shape or remove stale generated DB artifacts from the packet metadata. |
| L-004-003 | P1 | correctness | .opencode/skills/system-spec-kit/mcp_server/context-server.ts:1830 | "process.env.EMBEDDINGS_PROVIDER = 'hf-local';" | confirmed-residue | On auto-migration failure, either abort or re-resolve both provider and database path from one profile source before initialization; mutating only `EMBEDDINGS_PROVIDER` after startup profile/path constants are loaded risks running hf-local against the already-resolved llama-cpp profile DB. |

## Iteration summary
- Files scanned: 5223
- New findings: 3 (P0=0, P1=3, P2=0)
- Out-of-scope/historical noted but NOT flagged: 81
- Notes: Saturation reached below the requested 5-finding floor. Most remaining hits were prior iteration duplicates, intentional legacy model registries, test-only temporary sqlite filenames, arbitrary mock 384-dim vectors, package-lock transitive dependency entries, or explicitly historical packet/evidence material.
