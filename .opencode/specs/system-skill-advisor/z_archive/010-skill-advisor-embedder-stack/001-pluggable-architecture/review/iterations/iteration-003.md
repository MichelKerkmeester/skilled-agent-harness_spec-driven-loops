---
title: "Iter 3 — regression-risk (commit ed5eb0e56 post-impl review)"
iter_number: 3
dimension: regression-risk
executor: cli-devin
model: swe-1.6
recipe: agent-config-deep-review-iter.json
review_target_commit: ed5eb0e56
---

# Iter 003 — regression-risk — Post-impl review of ed5eb0e56

## 1. SCOPE READ

9 scope files:

- `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/adapter.ts` (22 lines)
- `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/types.ts` (18 lines)
- `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/registry.ts` (107 lines)
- `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts` (121 lines)
- `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/adapters/ollama.ts` (266 lines)
- `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/adapters/llama-cpp-baseline.ts` (58 lines)
- `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/index.ts` (34 lines)
- `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts` (987 lines)
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts` (171 lines)

## 2. regression-risk CLAIMS

1. The schema migration creates `vec_metadata` plus dimension-specific vector tables (`vec_768`, `vec_1024`) during DB init, so new databases can hold active-embedder tables without breaking legacy `skill_nodes` columns. Evidence: `ensureSchemaMigrations()` calls `ensureVecMetadataTable()` and `ensureVecTableForDim()` for 768/1024. <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts" lines="238-271" />

2. The active embedder pointer is opt-in: `getActiveEmbedder()` falls back to the legacy baseline when pointer rows are absent, and `loadSkillEmbeddings()` only switches to `vec_<dim>` when `hasActiveEmbedderPointer()` is true. That preserves legacy behavior until activation. <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts" lines="84-95" /> <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts" lines="838-876" />

3. Runtime adapter selection is fail-closed for unknown names: `semantic-shadow` looks up the active name and disables prompt cosine on failure, while `getAdapter()` returns `undefined` for unknown manifests and throws only for unsupported backend types. <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts" lines="69-83" /> <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/registry.ts" lines="85-105" />

4. Dimension mismatch from Ollama is caught at embed time: every returned row must match the manifest dimension before becoming a `Float32Array`. This prevents a wrongly configured Ollama model from writing or scoring a prompt vector with unexpected length. <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/adapters/ollama.ts" lines="260-264" />

5. Regression risk remains in the activation path: `setActiveEmbedder()` creates the pointer/table, but the only refresh function still writes legacy `skill_nodes.embedding`; once the pointer exists, `loadSkillEmbeddings()` ignores those legacy rows and reads only `vec_<dim>`, so the semantic-shadow lane loses all cached skill vectors unless another unreviewed writer populates `vec_<dim>`. <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts" lines="97-120" /> <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts" lines="769-835" /> <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts" lines="838-876" />

## 3. FINDINGS

### P0

None.

### P1

P1-001: Activating a pluggable embedder can silently disable cached semantic-shadow scoring.

- Location: `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:769-835`, `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:838-876`, `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts:97-120`, `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts:134-154`
- Issue: `setActiveEmbedder()` only records the active name/dim and ensures the matching `vec_<dim>` table; `refreshSkillEmbeddings()` still computes embeddings through the legacy provider and writes only `skill_nodes.embedding`; `loadSkillEmbeddings()` switches exclusively to `vec_<active.dim>` whenever an active pointer exists. That means activation can make previously refreshed legacy embeddings invisible to `semantic-shadow`.
- Reproduction evidence:
  1. Existing refresh path writes legacy columns only: `UPDATE skill_nodes SET embedding = ?, embedding_model_id = ?, embedding_content_hash = ?` and never inserts into `vec_<dim>`. <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts" lines="789-827" />
  2. Activation path writes `active_embedder_name` and `active_embedder_dim`, and creates the table, but does not backfill rows. <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts" lines="97-120" />
  3. Once any active pointer exists, `loadSkillEmbeddings()` reads from `vec_<active.dim>` and does not fall back to `skill_nodes.embedding` when that table is empty. <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts" lines="838-876" />
  4. `scoreSemanticShadowLane()` builds `cachedVectors` from `loadSkillEmbeddings()` and returns `null` for each non-fixture skill without a vector, so the lane returns no cached cosine matches. <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts" lines="134-154" />
- Impact: Regression when activating the pluggable architecture: prompt embedding can succeed through the active adapter, but skill-vector lookup is empty, so the semantic-shadow lane becomes inert for SQLite projections until a separate vector-table writer/backfill exists.
- Suggested fix: Either make the refresh path write to `vec_<active.dim>` using the active adapter, or make `setActiveEmbedder()`/activation require and perform a backfill before the pointer becomes visible; optionally add a guarded fallback for baseline active pointers.

### P2

None.

## 4. FINDINGS COUNTS

- P0: 0
- P1: 1
- P2: 0
- Running P0: 0
- Running P1: 1
- Running P2: 1

## 5. GAPS FOR NEXT ITER

- Did not run live Ollama or llama.cpp embedding calls.
- Did not inspect benchmark harness or CLI activation commands outside the scoped files.
- Did not test concurrent DB access or partial migration failure modes.
- Did not revisit iter-2 security finding beyond carrying forward the running P2 count.

## 6. JSONL DELTA ROW
