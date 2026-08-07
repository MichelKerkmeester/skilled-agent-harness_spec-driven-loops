---
title: "Iter 10 — adversarial-residual (commit ed5eb0e56 post-impl review)"
iter_number: 10
dimension: adversarial-residual
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

Supporting context read for impact confirmation:
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lane-registry.ts` — 42 lines
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts` — lines 300-344

## 2. adversarial-residual CLAIMS

1. SQL escape for vec-table names appears mitigated. `vecTableNameForDim()` validates that `dim` is a positive integer before interpolating it into the table name, and the resulting identifier is always `vec_${dim}`. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts:26-35`, `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts:69-81`.

2. Migration ordering appears safe for the checked path. `initDb()` runs the base schema before `ensureSchemaMigrations()`, and migrations pre-create both supported dimension tables. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:284-289`, `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:238-242`.

3. Runtime manifest injection was not found in the scoped files. The registry uses a frozen in-code manifest array, and adapter selection only resolves entries from that array. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/registry.ts:13-63`, `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/registry.ts:73-98`.

4. The prior Ollama network MITM concern remains supported but is not counted as a new finding in this iteration. `OLLAMA_BASE_URL` is accepted verbatim after trimming trailing slashes and used directly in `fetch()`. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/adapters/ollama.ts:52-56`, `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/adapters/ollama.ts:234-241`.

5. New residual: active embedder coherence is not enforced across name, dimension, and vector table contents. `setActiveEmbedder()` accepts any non-empty name plus any positive integer dimension; same-dimension registered embedders share the same `vec_<dim>` table; `loadSkillEmbeddings()` selects from that table without filtering `model_id`; and semantic-shadow compares the active prompt vector against whatever rows are returned. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts:97-120`, `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/registry.ts:21-62`, `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:840-856`, `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts:70-78`, `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts:134-156`.

## 3. FINDINGS

### P0

None.

### P1

None.

### P2

1. Active embedder/vector-table coherence can be broken by same-dimension switches or malformed active pointers, allowing stale/wrong-model vectors to influence semantic scoring.

   Reproduction evidence:
   - The registry contains multiple 1024-dimensional Ollama embedders: `jina-embeddings-v3`, `mxbai-embed-large-v1`, and `bge-m3`. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/registry.ts:21-62`.
   - The active pointer stores `name` and `dim` independently, but `setActiveEmbedder()` only checks that the name is non-empty and the dimension is positive; it does not verify that the name is registered or that the dimension matches the registered manifest. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts:97-120`.
   - Vector tables are keyed only by dimension (`vec_${dim}`), not model identity. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts:32-35`, `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts:69-80`.
   - Rows include `model_id`, but `loadSkillEmbeddings()` does not filter by the active embedder name/model; it selects all rows from the active dimension table. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:840-856`.
   - Semantic-shadow embeds the prompt using `getAdapter(active.name)` and then scores against the loaded skill vectors. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts:70-78`, `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts:134-156`.
   - If an active pointer pairs a registered name with a mismatched dimension, cosine scoring silently truncates to `Math.min(left.length, right.length)` instead of rejecting the mismatch. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts:19-20`.
   - Impact is user-visible because the lane registry marks `semantic_shadow` live with weight `0.05`, and fusion weights live lanes into the final score. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lane-registry.ts:7-13`, `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:326-339`.

## 4. FINDINGS COUNTS

P0: 0, P1: 0, P2: 1

## 5. GAPS FOR NEXT ITER

- Did not execute mutation tests or create a throwaway SQLite database because this worker pass is read-only.
- Did not inspect CLI/API surfaces that might call `setActiveEmbedder()` because the scoped review focused on residual attack surfaces in the listed implementation files.
- Did not re-count the previously reported Ollama `OLLAMA_BASE_URL` scheme-validation P2 as new.

## 6. JSONL DELTA ROW

{"iter":10,"phase":"complete","timestamp":"2026-05-17T21:48:20Z","dimension":"adversarial-residual","new_p0":0,"new_p1":0,"new_p2":1,"running_p0":0,"running_p1":0,"running_p2":2,"converged":false,"note":"Found one new P2: active embedder/vector-table coherence is not enforced across name, dimension, and model_id, allowing stale same-dim vectors to affect semantic scoring."}