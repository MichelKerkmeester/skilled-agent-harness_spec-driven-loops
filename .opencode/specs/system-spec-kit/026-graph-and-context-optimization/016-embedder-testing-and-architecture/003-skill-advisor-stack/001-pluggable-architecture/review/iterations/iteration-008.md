Read-only review pass completed. Per the read-only instruction, I did not modify `iteration-008.md` or append to `deep-review-state.jsonl`; the intended iteration content and JSONL delta are below.

---
title: "Iter 8 — documentation-alignment (commit ed5eb0e56 post-impl review)"
iter_number: 8
dimension: documentation-alignment
executor: cli-devin
model: swe-1.6
recipe: agent-config-deep-review-iter.json
review_target_commit: ed5eb0e56
---

## 1. SCOPE READ

Scoped implementation files read:

- `adapter.ts` — 22 lines <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/adapter.ts" />
- `types.ts` — 18 lines <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/types.ts" />
- `registry.ts` — 107 lines <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/registry.ts" />
- `schema.ts` — 121 lines <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts" />
- `ollama.ts` — 266 lines <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/adapters/ollama.ts" />
- `llama-cpp-baseline.ts` — 58 lines <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/adapters/llama-cpp-baseline.ts" />
- `index.ts` — 34 lines <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/index.ts" />
- `skill-graph-db.ts` — 987 lines <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts" />
- `semantic-shadow.ts` — 171 lines <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts" />

Documentation and state files read for alignment:

- `001-pluggable-architecture/spec.md` — 112 lines <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/003-skill-advisor-stack/001-pluggable-architecture/spec.md" />
- `001-pluggable-architecture/plan.md` — 113 lines <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/003-skill-advisor-stack/001-pluggable-architecture/plan.md" />
- `001-pluggable-architecture/tasks.md` — 83 lines <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/003-skill-advisor-stack/001-pluggable-architecture/tasks.md" />
- `001-pluggable-architecture/implementation-summary.md` — 80 lines <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/003-skill-advisor-stack/001-pluggable-architecture/implementation-summary.md" />
- Parent `003-skill-advisor-stack/spec.md` — 96 lines <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/003-skill-advisor-stack/spec.md" />
- ADR source `004-spec-memory-embedder-bake-off/decision-record.md` — 545 lines <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/004-spec-memory-embedder-bake-off/decision-record.md" />
- `002-jina-swap-and-reindex/spec.md` — 101 lines <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/003-skill-advisor-stack/002-jina-swap-and-reindex/spec.md" />
- Skill advisor `README.md` — 333 lines <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/README.md" />
- Skill advisor `INSTALL_GUIDE.md` — 331 lines <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" />
- `mcp_server/lib/README.md` — 221 lines <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/README.md" />
- `mcp_server/database/README.md` — 35 lines <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/database/README.md" />
- `review/deep-review-state.jsonl` — 6 lines <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/003-skill-advisor-stack/001-pluggable-architecture/review/deep-review-state.jsonl" />

## 2. documentation-alignment CLAIMS

1. The 001 scope-file list is materially aligned with the shipped file set. The spec names `adapter.ts`, `registry.ts`, `ollama.ts`, `llama-cpp-baseline.ts`, `schema.ts`, `skill-graph-db.ts`, `semantic-shadow.ts`, and tests as in scope. <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/003-skill-advisor-stack/001-pluggable-architecture/spec.md" lines="53-62" /> The shipped barrel also exports the new embedder API surface. <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/index.ts" lines="5-34" />

2. The manifest/default claim aligns at the registry layer: the registry declares `DEFAULT_EMBEDDER_NAME = 'jina-embeddings-v3'`, `BASELINE_EMBEDDER_NAME = 'embeddinggemma-300m'`, and 6 manifests including the four required names plus `mxbai` and `bge-m3`. <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/registry.ts" lines="10-63" /> This matches R2. <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/003-skill-advisor-stack/001-pluggable-architecture/spec.md" lines="76-82" />

3. The ADR-012 “Jina production winner” claim aligns with the manifest’s selected Jina profile: ADR-012 selects `jina-embeddings-v3` as production config and records the 1024-dimension tradeoff. <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/004-spec-memory-embedder-bake-off/decision-record.md" lines="515-535" /> The registry defines Jina as a 1024-dim Ollama manifest with the expected `hf.co/gaianet/jina-embeddings-v3-GGUF:Q4_K_M` tag. <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/registry.ts" lines="21-28" />

4. The implementation-summary accurately captures the split between registry default and empty-metadata runtime fallback: it says registry default is Jina, while empty `vec_metadata` falls back to Gemma. <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/003-skill-advisor-stack/001-pluggable-architecture/implementation-summary.md" lines="42-46" /> The code implements that fallback through `DEFAULT_ACTIVE_EMBEDDER`. <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts" lines="18-21" />

5. The schema and semantic-shadow wiring match the core plan acceptance criteria: DB init ensures `vec_metadata`, `vec_768`, and `vec_1024`; semantic-shadow reads the active embedder and dispatches through `getAdapter`. <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts" lines="238-271" /> <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts" lines="69-78" />

6. Public README/INSTALL guide coverage for the current embedder default is incomplete but partly deferred by packet structure: 001 explicitly marks docs out of scope. <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/003-skill-advisor-stack/001-pluggable-architecture/spec.md" lines="64-68" /> The parent packet assigns INSTALL_GUIDE/README updates to child 003. <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/003-skill-advisor-stack/spec.md" lines="72-77" />

## 3. FINDINGS

### P0

None.

### P1

None.

### P2

P2-001: Documentation claims an env-var embedder swap path that the implementation does not provide.

- Issue: The packet docs say the operator can swap embedders via env var plus daemon restart, but the shipped active-embedder selection path only reads `vec_metadata`; no scoped implementation code reads an embedder-selection env var.
- Evidence: 001 purpose says “Operator can then swap embedders via env var + daemon restart”. <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/003-skill-advisor-stack/001-pluggable-architecture/spec.md" lines="45-48" />
- Evidence: parent success criteria also require “Operator can swap embedders via env var + daemon restart per INSTALL_GUIDE”. <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/003-skill-advisor-stack/spec.md" lines="88-94" />
- Evidence: 002 scope repeats “set env var or call `setActiveEmbedder('jina-embeddings-v3')`”. <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/003-skill-advisor-stack/002-jina-swap-and-reindex/spec.md" lines="48-55" />
- Reproduction evidence: `getActiveEmbedder()` reads only `active_embedder_name` and `active_embedder_dim` from `vec_metadata`, then falls back to `DEFAULT_ACTIVE_EMBEDDER`; there is no env-var branch. <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts" lines="84-95" />
- Reproduction evidence: `setActiveEmbedder()` persists explicit function arguments into `vec_metadata`; it does not read process env. <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts" lines="97-121" />
- Reproduction evidence: the scoped env usages cover Ollama base URL, DB directory override, and Vitest fixture gates, not active embedder selection. <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/adapters/ollama.ts" lines="52-56" /> <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts" lines="205-207" /> <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts" lines="64-67" />
- Impact: An operator following the docs cannot activate Jina or another embedder by setting an environment variable and restarting; they must mutate `vec_metadata` through `setActiveEmbedder()` or another script. This is likely to cause failed runbooks in 002/003 and stale production-default assumptions.
- Severity rationale: P2 because this is documentation/runbook contract drift rather than direct runtime data loss or incorrect scoring when the DB pointer is already set.

## 4. FINDINGS COUNTS

- P0: 0
- P1: 0
- P2: 1

## 5. GAPS FOR NEXT ITER

- Did not run build/tests or live Ollama probes; this pass stayed documentation-alignment/read-only.
- Did not audit every downstream 002/003 artifact; only targeted lines relevant to active default and swap/runbook claims were read.
- Did not validate generated SQLite contents or actual `vec_metadata` state in a live DB.
- README/INSTALL guide missing-current-default coverage is noted, but 001 marks docs out of scope and parent delegates guide updates to 003, so this pass did not classify that absence as a standalone finding.

## 6. JSONL DELTA ROW

```json
{"iter":8,"phase":"complete","timestamp":"2026-05-17T21:45:59Z","dimension":"documentation-alignment","new_p0":0,"new_p1":0,"new_p2":1,"running_p0":0,"running_p1":0,"running_p2":4,"converged":false,"note":"documentation-alignment review complete: 1 P2 finding — docs claim env-var embedder swap but implementation only selects active embedder from vec_metadata"}
```
