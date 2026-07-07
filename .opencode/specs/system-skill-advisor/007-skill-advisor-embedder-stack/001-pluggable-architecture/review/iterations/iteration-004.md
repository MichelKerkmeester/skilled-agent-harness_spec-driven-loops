---
title: "Iter 4 — testing-coverage (commit ed5eb0e56 post-impl review)"
iter_number: 4
dimension: testing-coverage
executor: cli-devin
model: swe-1.6
recipe: agent-config-deep-review-iter.json
review_target_commit: ed5eb0e56
---

## 1. SCOPE READ

- `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/adapter.ts` — 22 lines
- `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/types.ts` — 18 lines
- `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/registry.ts` — 107 lines
- `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts` — 121 lines
- `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/adapters/ollama.ts` — 266 lines
- `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/adapters/llama-cpp-baseline.ts` — 58 lines
- `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/index.ts` — 34 lines
- `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts` — 987 lines
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts` — 171 lines
- `.opencode/skills/system-skill-advisor/mcp_server/tests/embedders/schema.vitest.ts` — 62 lines
- `.opencode/skills/system-skill-advisor/mcp_server/tests/embedders/registry.vitest.ts` — 42 lines
- `.opencode/skills/system-skill-advisor/mcp_server/tests/skill-graph-db.vitest.ts` — 102 lines
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/__tests__/semantic-shadow-cosine.vitest.ts` — 215 lines

## 2. testing-coverage CLAIMS

1. The new embedder tests cover only high-level registry shape, not adapter behavior. `registry.vitest.ts` resolves `jina-embeddings-v3` and checks that `embed`/`ready` are functions, but never calls either method. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/tests/embedders/registry.vitest.ts:31-40`.

2. The Ollama adapter contains substantial behavior that is not exercised by tests: empty input short-circuit, prefix/truncation preparation, `/api/embed` vs `/api/embeddings` fallback, model-missing detection, embedding row-count validation, and dimension mismatch validation. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/adapters/ollama.ts:163-176`, `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/adapters/ollama.ts:195-231`, `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/adapters/ollama.ts:250-264`.

3. The registry exhaustiveness test is partial: `MANIFESTS` defines six manifests across `llama-cpp` and `ollama`, but the test only resolves the default Jina adapter. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/registry.ts:13-63`, `.opencode/skills/system-skill-advisor/mcp_server/tests/embedders/registry.vitest.ts:14-29`, `.opencode/skills/system-skill-advisor/mcp_server/tests/embedders/registry.vitest.ts:31-40`.

4. The schema tests verify direct helper behavior, but they do not assert that `initDb()` migrations create `vec_metadata`, `vec_768`, and `vec_1024` together. `ensureSchemaMigrations()` does all three, while the tests separately round-trip metadata and direct-create only `vec_1024`. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:238-241`, `.opencode/skills/system-skill-advisor/mcp_server/tests/embedders/schema.vitest.ts:31-60`, `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/__tests__/semantic-shadow-cosine.vitest.ts:116-128`.

5. The active-embedder vector-table path is untested. `setActiveEmbedder()` writes the active pointer and creates a dimension-specific `vec_N` table, and `loadSkillEmbeddings()` switches to that table when the pointer exists; the test search found `setActiveEmbedder()` only in `schema.vitest.ts`, with no test combining it with `loadSkillEmbeddings()` or semantic scoring. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts:97-105`, `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:838-876`, `.opencode/skills/system-skill-advisor/mcp_server/tests/embedders/schema.vitest.ts:39`.

## 3. FINDINGS

### P0

None.

### P1

None.

### P2

1. P2 — Adapter contract behavior is not covered beyond shape checks.

   Reproduction evidence:
   - `registry.vitest.ts` only checks that the default adapter has `embed` and `ready` functions; it never calls them or asserts request/response behavior. `.opencode/skills/system-skill-advisor/mcp_server/tests/embedders/registry.vitest.ts:31-40`
   - `OllamaAdapter.embed()` contains observable branches for empty inputs, row-count mismatch, dimension mismatch, and error mapping that can regress without any current test failure. `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/adapters/ollama.ts:163-176`, `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/adapters/ollama.ts:250-264`
   - `ready()` depends on `/api/tags` parsing but has no mocked-fetch test for available, unavailable, malformed, or non-OK responses. `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/adapters/ollama.ts:179-193`

2. P2 — Registry exhaustiveness is under-tested for non-default manifests and backend dispatch.

   Reproduction evidence:
   - The production registry declares six manifests, including a `llama-cpp` baseline and multiple Ollama alternatives. `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/registry.ts:13-63`
   - `getAdapter()` has backend-specific dispatch and explicit unsupported-backend branches. `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/registry.ts:85-106`
   - The test resolves only `jina-embeddings-v3`; it does not iterate all manifests, assert duplicate-free names, assert supported dimensions, assert the baseline adapter, or assert unsupported backend error behavior. `.opencode/skills/system-skill-advisor/mcp_server/tests/embedders/registry.vitest.ts:14-40`

3. P2 — Active embedder `vec_N` integration lacks coverage, leaving a migration/use-path gap.

   Reproduction evidence:
   - `setActiveEmbedder()` persists an active pointer and ensures the dimension table exists. `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts:97-105`
   - Once the pointer exists, `loadSkillEmbeddings()` stops reading the legacy `skill_nodes.embedding` columns and instead queries `vec_${active.dim}`. `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:838-876`
   - Existing semantic-shadow tests seed only legacy `skill_nodes.embedding` columns. `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/__tests__/semantic-shadow-cosine.vitest.ts:149-183`
   - Existing schema tests call `setActiveEmbedder()` only for pointer round-trip, not to verify `loadSkillEmbeddings()` or semantic lane behavior after a pointer is active. `.opencode/skills/system-skill-advisor/mcp_server/tests/embedders/schema.vitest.ts:31-45`

## 4. FINDINGS COUNTS

P0: 0, P1: 0, P2: 3

## 5. GAPS FOR NEXT ITER

- Did not execute the test suite; this iteration audited coverage from source/test evidence only.
- Did not assess correctness of the active `vec_N` storage design beyond coverage gaps.
- Did not re-review the prior P2 security finding for `OLLAMA_BASE_URL` scheme validation.
- Did not assess performance/concurrency of embedding refresh or runtime Ollama availability.
- Did not inspect docs/spec traceability except where needed for testing-coverage evidence.

## 6. JSONL DELTA ROW

{"iter":4,"phase":"complete","timestamp":"2026-05-17T21:41:03Z","dimension":"testing-coverage","new_p0":0,"new_p1":0,"new_p2":3,"running_p0":0,"running_p1":0,"running_p2":4,"converged":false,"note":"testing-coverage review complete: 3 P2 gaps covering adapter behavior, registry exhaustiveness, and active vec_N integration"}