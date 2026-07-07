---
title: "Iter 1 — correctness (commit c0ec765f4 post-impl review)"
iter_number: 1
dimension: correctness
executor: cli-devin
model: swe-1.6
recipe: agent-config-deep-review-iter.json
review_target_commit: c0ec765f4
---

## 1. SCOPE READ

- `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts` — read scoped imports and refresh/load regions; file total 1124 lines.
- `.opencode/skills/system-skill-advisor/mcp_server/tests/skill-graph/refresh-roundtrip.vitest.ts` — read full file; 201 lines.
- `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/registry.ts` — read full file; 107 lines.
- `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts` — read full file; 121 lines.
- `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/adapter.ts` — read full file; 22 lines.
- Pre-010/004 legacy refresh body via `git show c0ec765f4^:...skill-graph-db.ts` for behavior comparison.

## 2. correctness CLAIMS

1. Dispatch follows the intended pointer split: `refreshSkillEmbeddings()` obtains the DB, sends pointer-present installs to `refreshSkillEmbeddingsViaAdapter()`, and pointer-absent installs to `refreshSkillEmbeddingsLegacy()`. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:788-796`.

2. The pointer predicate is contractually tied to active embedder metadata presence: `hasActiveEmbedderPointer()` ensures `vec_metadata`, selects `active_embedder_name`, and returns `Boolean(row)`. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts:47-56`.

3. `setActiveEmbedder()` writes both active pointer keys and ensures the dimension-specific vector table before the pointer is established, so normal pointer-set state is compatible with the adapter branch. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts:97-121`.

4. The adapter branch uses the active embedder and dimension correctly: it calls `getActiveEmbedder()`, ensures `vec_<dim>`, resolves `getAdapter(active.name)`, embeds with `inputType: 'document'`, validates the returned vector length against `active.dim`, and upserts `(skill_id, embedding, model_id, content_hash)` into the active vec table. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:802-857` and `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:883-890`.

5. The adapter branch handles missing/unsupported adapters without silently writing bad rows: `getAdapter()` returns `undefined` for unknown manifests and throws for unsupported backend variants; the refresh helper returns `ADAPTER-UNAVAILABLE` warnings in both cases. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/registry.ts:85-106` and `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:805-825`.

6. The legacy branch is unchanged in material behavior from pre-010/004: it creates the shared embeddings provider, derives `modelId` from the provider profile, selects legacy columns from `skill_nodes`, skips out-of-scope paths, clears empty descriptions, hashes descriptions, skips matching cached rows, embeds via `provider.embedDocument()`, writes `skill_nodes.embedding`, and clears embedding on failure. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:904-972`; pre-commit comparison showed the same statements before extraction.

7. Round-trip tests directly exercise both dispatch states and core adapter-path behavior: pointer set writes/readbacks active-dim vectors, rerun idempotency skips unchanged rows, unknown manifests return `ADAPTER-UNAVAILABLE`, and pointer unset falls back to the mocked legacy provider. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/tests/skill-graph/refresh-roundtrip.vitest.ts:133-181` and `.opencode/skills/system-skill-advisor/mcp_server/tests/skill-graph/refresh-roundtrip.vitest.ts:183-200`.

## 3. FINDINGS

### P0

None.

### P1

None.

### P2

None.

## 4. FINDINGS COUNTS

- P0: 0
- P1: 0
- P2: 0

## 5. GAPS FOR NEXT ITER

- Did not execute the Vitest suite; this iteration stayed read-only and reviewed source/test evidence only.
- Did not review security, maintainability, or traceability dimensions.
- Did not inspect downstream ranking/search behavior beyond `loadSkillEmbeddings()` read compatibility for the new vec-table path.

## 6. JSONL DELTA ROW
