---
title: "Iter 5 — architecture-fit (commit c0ec765f4 post-impl review)"
iter_number: 5
dimension: architecture-fit
executor: cli-devin
model: swe-1.6
recipe: agent-config-deep-review-iter.json
review_target_commit: c0ec765f4
---

## 1. SCOPE READ

- `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts` — read scoped imports and refresh/load sections; file has 1124 lines.
- `.opencode/skills/system-skill-advisor/mcp_server/tests/skill-graph/refresh-roundtrip.vitest.ts` — read full file; 201 lines.
- `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/registry.ts` — read full file; 107 lines.
- `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts` — read full file; 121 lines.
- `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/adapter.ts` — read full file; 22 lines.

## 2. architecture-fit CLAIMS

1. The new writer path uses the intended module boundaries: `skill-graph-db.ts` imports schema-owned vector helpers from `../embedders/schema.js`, registry-owned adapter lookup from `../embedders/registry.js`, and only the `EmbedderAdapter` type from `../embedders/adapter.js` (`skill-graph-db.ts:18-26`).

2. The dispatcher matches the intended cross-wire split: `refreshSkillEmbeddings()` opens the DB, routes to the adapter path only when `hasActiveEmbedderPointer(database)` is true, and otherwise preserves the legacy provider path (`skill-graph-db.ts:788-795`).

3. The adapter path fits the registry contract: it calls `getActiveEmbedder()`, ensures the dimension-specific vec table, computes `vec_<dim>`, then resolves `getAdapter(active.name)` and handles both missing manifests and thrown unsupported-backend errors as `ADAPTER-UNAVAILABLE` warnings (`skill-graph-db.ts:798-825`; `registry.ts:85-105`).

4. The schema layer owns the active-pointer and vec-table primitives: `hasActiveEmbedderPointer()` checks `vec_metadata`, `ensureVecTableForDim()` creates `skill_id`, `embedding`, `model_id`, `content_hash`, and `updated_at`, and `setActiveEmbedder()` writes pointer metadata after ensuring the table (`schema.ts:47-55`, `schema.ts:69-81`, `schema.ts:97-121`).

5. The writer/read shape aligns for active adapters: the adapter writer upserts `skill_id`, `embedding`, `model_id`, `content_hash`, and `updated_at` into `vec_<dim>` (`skill-graph-db.ts:849-857`), while `loadSkillEmbeddings()` reads `skill_id`, `embedding`, `model_id`, and `content_hash` from the same active vec table (`skill-graph-db.ts:975-1012`). `updated_at` is write-only metadata and is not required by the `SkillEmbeddingRow` return shape (`skill-graph-db.ts:93-98`).

6. The tests cover the architecture seam rather than only the legacy behavior: they mock `getAdapter()` at the registry boundary, set the active pointer through `setActiveEmbedder()`, assert 1024-dim adapter round-trip reads, assert idempotent skips, assert unknown adapter warning behavior, and assert pointer-unset legacy fallback (`refresh-roundtrip.vitest.ts:39-56`, `refresh-roundtrip.vitest.ts:133-181`, `refresh-roundtrip.vitest.ts:183-200`).

## 3. FINDINGS

### P0

None.

### P1

None.

### P2

None.

## 4. FINDINGS COUNTS

P0: 0, P1: 0, P2: 0

## 5. GAPS FOR NEXT ITER

- No next iteration is scheduled; this is iter 5 of 5.
- Residual risk: the scoped tests use mocked registry/factory paths, so they validate the architecture seam but not live Ollama or llama-cpp adapter readiness.
- Residual risk: this pass checked the scoped code contracts only; it did not re-read the full mk-spec-memory 016/001-003 design packet.

## 6. JSONL DELTA ROW
