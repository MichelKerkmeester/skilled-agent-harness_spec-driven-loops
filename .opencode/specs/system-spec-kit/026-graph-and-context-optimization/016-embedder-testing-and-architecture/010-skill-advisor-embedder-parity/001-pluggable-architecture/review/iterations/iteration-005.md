---
title: "Iter 5 — type-safety (commit ed5eb0e56 post-impl review)"
iter_number: 5
dimension: type-safety
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
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-skill-advisor-embedder-parity/001-pluggable-architecture/review/deep-review-state.jsonl` — 3 lines

## 2. type-safety CLAIMS

1. Public embedder interfaces are explicitly typed, but embedder identity and dimensionality are still plain primitives: `EmbedderManifest.name` is `string`, `EmbedderManifest.dim` is `number`, and `ActiveEmbedder` repeats `name: string` plus `dim: number`. Evidence: <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/types.ts" lines="7-17" /> <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts" lines="8-11" />

2. Backend dispatch is exhaustively typed: `BackendKind` is a closed union and `getAdapter` uses a `never` default after handling `ollama`, `llama-cpp`, `api`, and `sentence-transformers`. Evidence: <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/types.ts" lines="5-5" /> <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/registry.ts" lines="91-105" />

3. Async public methods have explicit return types across adapters and semantic-shadow entry points. Evidence: <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/adapter.ts" lines="20-21" /> <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/adapters/ollama.ts" lines="163-179" /> <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/adapters/llama-cpp-baseline.ts" lines="27-57" /> <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts" lines="64-90" />

4. Unknown JSON boundaries mostly stay unknown until narrowed, but Ollama tag parsing casts the response shape after only checking `models` is an array, then dereferences each element as an `OllamaTag`. Evidence: <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/adapters/ollama.ts" lines="117-135" />

5. SQLite row boundaries use direct type assertions in multiple places; the active embedder path is most consequential because one unbranded persisted dimension selects the vector table while the unbranded name selects the query adapter. Evidence: <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts" lines="84-104" /> <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts" lines="840-875" /> <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts" lines="70-78" />

## 3. FINDINGS

### P0

None.

### P1

None.

### P2

1. Active embedder name/dim are not coupled, allowing silently mixed vector dimensions.

   Evidence:
   - `ActiveEmbedder` stores `name: string` and `dim: number` as independent primitive fields, with no branded type or manifest-derived pair tying a model name to its declared dimension. <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts" lines="8-11" />
   - `getActiveEmbedder` returns the persisted name and dimension after only checking that the dimension parses as a positive integer; it does not verify the pair against `MANIFESTS`. <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts" lines="84-95" />
   - `setActiveEmbedder` validates only non-empty name and positive integer dimension before persisting both values, so `setActiveEmbedder(db, 'jina-embeddings-v3', 768)` is accepted even though the registry declares Jina as 1024-dimensional. <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts" lines="97-121" /> <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/registry.ts" lines="21-28" />
   - At scoring time, `semantic-shadow` embeds the prompt using the adapter selected by `active.name`, while `loadSkillEmbeddings` loads cached skill vectors from the table selected by `active.dim`; cosine then compares only `Math.min(left.length, right.length)`, silently truncating mismatched vectors instead of failing fast. <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts" lines="70-78" /> <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts" lines="840-875" /> <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts" lines="19-40" />

   Reproduction evidence:
   - Persist `active_embedder_name = jina-embeddings-v3` and `active_embedder_dim = 768` through `setActiveEmbedder`; the type system and runtime validators accept it.
   - `withSemanticShadowPromptEmbedding` then produces a 1024-dimensional prompt vector via the Jina adapter, while `loadSkillEmbeddings` reads `vec_768`; `cosineSimilarity` compares the first 768 entries and returns a score, masking the invariant breach.

2. Ollama tag parsing trusts unknown array elements as `OllamaTag`, so malformed `/api/tags` JSON can make `ready()` reject instead of returning `false`.

   Evidence:
   - `OllamaTagsResponse.models` is `unknown`, and `parseOllamaTagNames` only checks `Array.isArray(response.models)`. <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/adapters/ollama.ts" lines="13-15" /> <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/adapters/ollama.ts" lines="117-125" />
   - The map callback then dereferences each element as `model.name` / `model.model` without checking that the element is a non-null object. <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/adapters/ollama.ts" lines="127-133" />
   - `ready()` catches fetch failures only; parsing happens after that catch, so a malformed successful JSON body can reject the `Promise<boolean>`. <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/adapters/ollama.ts" lines="179-193" />

   Reproduction evidence:
   - Mock `/api/tags` as HTTP 200 with body `{"models":[null]}`.
   - `Array.isArray(response.models)` passes, then `model.name` throws `TypeError: Cannot read properties of null`, so `ready(): Promise<boolean>` rejects rather than resolving `false`.

## 4. FINDINGS COUNTS

P0: 0, P1: 0, P2: 2

## 5. GAPS FOR NEXT ITER

- Did not execute `tsc`, `npm build`, or tests; this pass stayed read-only and relied on static evidence.
- Did not inspect the shared `@spec-kit/shared/embeddings` provider implementation beyond its typed call sites.
- Did not review every handler path that may write active embedder metadata; grep found current runtime reads through schema/semantic-shadow.
- Did not evaluate non-type-safety dimensions such as security, performance, or UX except where they reproduced type-boundary failures.

## 6. JSONL DELTA ROW
