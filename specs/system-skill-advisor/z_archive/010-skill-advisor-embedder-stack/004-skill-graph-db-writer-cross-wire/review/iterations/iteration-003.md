---
title: "Iter 3 — error-handling (commit c0ec765f4 post-impl review)"
iter_number: 3
dimension: error-handling
executor: cli-devin
model: swe-1.6
recipe: agent-config-deep-review-iter.json
review_target_commit: c0ec765f4
---

## 1. SCOPE READ

- `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts` — 1,124 lines; read imports, schema/init, deleteMissingNodes, refresh dispatcher/helpers, load path.
- `.opencode/skills/system-skill-advisor/mcp_server/tests/skill-graph/refresh-roundtrip.vitest.ts` — 201 lines; read all tests.
- `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/registry.ts` — 107 lines; read all.
- `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts` — 121 lines; read all.
- `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/adapter.ts` — 22 lines; read all.

## 2. error-handling CLAIMS

1. The dispatcher switches to the adapter path whenever an active embedder *name* pointer exists: `refreshSkillEmbeddings()` calls `hasActiveEmbedderPointer(database)` and then `refreshSkillEmbeddingsViaAdapter(...)`. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:788-795`; `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts:47-56`.

2. `ADAPTER-UNAVAILABLE` is returned for unknown manifests or `getAdapter()` exceptions before any row-level processing. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:802-825`; `getAdapter()` returns `undefined` for missing manifests and throws for unsupported backends. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/registry.ts:85-105`.

3. Empty descriptions are cleaned from the active vec table. The adapter path trims `skillDescriptionForEmbedding(...)`, calls `deleteEmbedding.run(row.id)` when empty, increments `skipped`, and continues. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:866-870`.

4. Per-row embedding failures are also cleaned from the active vec table. The adapter path catches adapter throws and dimension mismatches, increments `failed`, deletes the row, and emits `EMBEDDING-FAILED`. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:883-897`.

5. Orphan cleanup for normal index/delete flow is covered by FK cascade: `vec_<dim>.skill_id` references `skill_nodes(id) ON DELETE CASCADE`, `initDb()` enables `foreign_keys = ON`, and stale `skill_nodes` are deleted by `deleteMissingNodes()`. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts:69-81`; `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:276-290`; `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:567-575`.

6. The new test file covers adapter happy path, adapter idempotency, unknown manifest, and legacy fallback, but does not cover adapter throw, dimension mismatch, empty-description deletion, or orphan cleanup. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/tests/skill-graph/refresh-roundtrip.vitest.ts:133-181`; `.opencode/skills/system-skill-advisor/mcp_server/tests/skill-graph/refresh-roundtrip.vitest.ts:183-200`.

## 3. FINDINGS

### P0

None.

### P1

#### P1-1 — Active embedder name/dim mismatch can erase valid vec rows as per-skill failures instead of failing configuration early

Reproduction evidence:

- `setActiveEmbedder()` accepts any non-empty name with any positive integer dimension; it does not validate that the dimension matches the named manifest. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts:97-105`.
- `refreshSkillEmbeddingsViaAdapter()` then trusts `active.dim` for the target table and expected vector length, while `getAdapter(active.name)` resolves the adapter by manifest name. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:802-804`; `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:883-889`; `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/registry.ts:85-98`.
- Real manifests have fixed dimensions, e.g. `embeddinggemma-300m` is 768 and `jina-embeddings-v3` is 1024. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/registry.ts:13-28`.
- Therefore, calling `setActiveEmbedder(db, 'embeddinggemma-300m', 1024)` creates a valid active pointer and `vec_1024`, resolves the 768-dim baseline adapter, then treats every returned 768-dim vector as `EMBEDDING-FAILED` because the code expects 1024. The catch handler deletes any existing row in `vec_1024` for that skill. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:886-897`.

Impact:

- A configuration/pointer integrity error is misclassified as row-level embedding failure.
- A single bad pointer can delete all currently valid rows in the active `vec_<dim>` table for changed/non-skipped skills.
- The result exposes only repeated `EMBEDDING-FAILED` warnings, not an actionable active-pointer/manifest mismatch error.

Suggested fix:

- Validate `active.name` against the manifest dimension before iterating rows, or validate `adapter.dim === active.dim` immediately after `getAdapter(active.name)`.
- Return a single configuration-level warning/error, e.g. `ADAPTER-DIM-MISMATCH`, without deleting per-skill rows.

### P2

None.

## 4. FINDINGS COUNTS

P0: 0, P1: 1, P2: 0

## 5. GAPS FOR NEXT ITER

- Add/verify tests for adapter throw cleanup and dimension mismatch cleanup; current tests do not exercise `EMBEDDING-FAILED`.
- Add/verify tests for empty-description deletion from `vec_<dim>`.
- Add/verify tests for stale skill deletion cascading out of `vec_<dim>`.
- Re-check whether active pointer corruption should be treated as `ADAPTER-UNAVAILABLE`, a new config error, or a hard throw.

## 6. JSONL DELTA ROW
