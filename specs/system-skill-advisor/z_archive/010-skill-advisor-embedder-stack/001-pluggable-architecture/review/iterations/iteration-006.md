---
title: "Iter 6 — error-handling (commit ed5eb0e56 post-impl review)"
iter_number: 6
dimension: error-handling
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
- Additional caller context: `.opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/scan.ts` — 70 lines

## 2. error-handling CLAIMS

1. Ollama embed network failures propagate as typed errors. `postJson()` catches `fetch()` errors and throws `OllamaBackendUnreachableError` with the base URL and original error message; non-OK embed responses are converted to `OllamaModelNotLoadedError` or `OllamaAdapterError`, and dimension mismatches throw `OllamaDimensionMismatchError`. Evidence: <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/adapters/ollama.ts" lines="214-257" /> <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/adapters/ollama.ts" lines="260-264" />

2. Ollama readiness intentionally degrades to `false` instead of throwing. `ready()` catches fetch failures and returns `false`, and also returns `false` for non-OK responses before parsing tags. This is appropriate for readiness probing, not a swallowed operational embed error. Evidence: <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/adapters/ollama.ts" lines="179-193" />

3. Manifest validation throws normal `Error` objects with file-path context, not thrown strings. JSON parse failures, invalid schema versions, unsupported families, invalid edge arrays, bad weights, and unsupported edge types all throw `Error` instances with source-specific messages before DB mutation begins. Evidence: <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts" lines="471-485" /> <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts" lines="491-547" /> <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts" lines="594-605" />

4. `vecTableNameForDim()` rejects invalid dimensions before interpolating SQL table names. `validateDim()` throws `RangeError` unless the dimension is a positive integer, and both `vecTableNameForDim()` and `setActiveEmbedder()` call it before SQL use. Evidence: <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts" lines="26-35" /> <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts" lines="97-105" />

5. Database init rethrows migration/open failures after best-effort cleanup. `initDb()` wraps directory creation, SQLite open, schema creation, and migrations in a try/catch, closes any partially-open DB, clears module globals, and rethrows the original error. Evidence: <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts" lines="273-305" />

6. Per-row embedding refresh failures are deliberately contained and surfaced in result counters/warnings. `refreshSkillEmbeddings()` catches each provider failure, increments `failed`, clears the row embedding with the attempted model/content hash, records `EMBEDDING-FAILED`, and continues. Evidence: <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts" lines="818-835" />

7. Semantic-shadow disables cosine matching on embedding-path failures instead of breaking advisory scoring. Prompt embedding failures clear the active vector and warn; cached embedding load failures warn and return `[]` for non-fixture projections. Evidence: <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts" lines="69-89" /> <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts" lines="134-146" />

## 3. FINDINGS

### P0

None.

### P1

None.

### P2

- P2: `setActiveEmbedder()` creates the dimension table outside the metadata pointer transaction, so a later pointer-write failure cannot roll back the schema side effect. Reproduction evidence: `setActiveEmbedder()` validates and then calls `ensureVecTableForDim(db, dim)` before declaring/executing `writePointer`; `ensureVecTableForDim()` performs `CREATE TABLE IF NOT EXISTS vec_<dim>` and two `CREATE INDEX IF NOT EXISTS` statements via `db.exec()`. If either `INSERT INTO vec_metadata` statement fails after the DDL has committed, the active pointer is not updated but the new `vec_<dim>` table/indexes remain. This violates rollback expectations for active-embedder migration/setup and can leave orphan vector tables after failed swaps. Evidence: <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts" lines="69-81" /> <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts" lines="97-120" />

## 4. FINDINGS COUNTS

- P0: 0
- P1: 0
- P2: 1

## 5. GAPS FOR NEXT ITER

- Did not run fault-injection tests against SQLite write failures; reproduction is static from transaction boundaries and DDL ordering.
- Did not test live Ollama network behavior; review is source-level only.
- Did not review the future active-vector reindex writer beyond current scoped files.
- Did not assess observability completeness except where catch blocks and warnings intersect error handling.

## 6. JSONL DELTA ROW
