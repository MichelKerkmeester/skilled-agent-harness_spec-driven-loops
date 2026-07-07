# Resource Map — 026/016/010/001 Post-Implementation Deep-Review

## Scope under review

Commit `ed5eb0e567fc6b087b3c08e52dbea2b6c0510cb1` — "feat(016/010/001): skill-advisor pluggable embedder architecture mirroring 016". 11 files, +796 / -10.

## Scope files (review surface)

| File | Lines (LOC added) | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/adapter.ts` | 22 | `EmbedderAdapter` interface + EmbedderOptions |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/types.ts` | 18 | `BackendKind` + `EmbedderManifest` |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/registry.ts` | 107 | `MANIFESTS` (6 entries) + `getAdapter()` dispatcher + `NotImplementedError` |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts` | 121 | `vec_metadata` table + `ensureVecTableForDim` + `getActiveEmbedder`/`setActiveEmbedder` |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/adapters/ollama.ts` | 266 | OllamaAdapter (`/api/embed` POST, error taxonomy, dim validation) |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/adapters/llama-cpp-baseline.ts` | 58 | LlamaCppBaselineAdapter (delegates to `createEmbeddingsProvider`) |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/index.ts` | 34 | Barrel re-exports |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts` | +55 | `ensureSchemaMigrations` adds `vec_metadata`, `vec_768`, `vec_1024`; `loadSkillEmbeddings` reads active table |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts` | +21/-10 | `withSemanticShadowPromptEmbedding` reads active embedder via registry |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/embedders/registry.vitest.ts` | 42 | MANIFESTS shape + getAdapter dispatch |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/embedders/schema.vitest.ts` | 62 | vec_metadata roundtrip + ensureVecTableForDim idempotency |

## Reference files (out of scope — for comparison only in iter 7)

| File | Purpose |
|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/adapter.ts` | 016/001 reference for EmbedderAdapter shape |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/types.ts` | 016/001 reference for BackendKind/EmbedderManifest |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/registry.ts` | 016/002 reference for MANIFESTS + getAdapter |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/schema.ts` | 016/003 reference for vec_metadata helpers |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/adapters/ollama.ts` | 016/003 reference for OllamaAdapter |

## Spec context

| File | Purpose |
|---|---|
| `.../003-skill-advisor-stack/001-pluggable-architecture/spec.md` | What was shipped and why (R1–R7) |
| `.../003-skill-advisor-stack/001-pluggable-architecture/plan.md` | Implementation plan |
| `.../003-skill-advisor-stack/001-pluggable-architecture/implementation-summary.md` | Build evidence (npm run build pass, vitest 4/4 pass, schema probe) |

## Output destination

`review/`:
- `iterations/iteration-{NNN}.md` — per-iter findings (P0/P1/P2 tagged)
- `deep-review-state.jsonl` — JSONL delta state row per iter
- `deep-review-config.json` — this run's config (already written)
- `review-report.md` — final 9-section consolidated report
- `resource-map.md` — this file
