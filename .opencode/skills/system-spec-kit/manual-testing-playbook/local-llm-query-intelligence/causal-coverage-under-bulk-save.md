---
title: "412 — Causal coverage under bulk save (does the local LLM cluster correctly?)"
description: "Save 20 memories spanning 4 distinct topics (5 per topic). Verify causal_edges form within each topic cluster but not across. Probes BGE local fallback's intra-cluster cohesion vs inter-cluster separation."
audited_post_018: true
version: 3.6.0.6
id: local-llm-query-intelligence-causal-coverage-under-bulk-save
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 412 — Causal coverage under bulk save (does the local LLM cluster correctly?)

## 1. OVERVIEW

When many memories are saved in a short window, the causal-edge builder runs on the new batch. Quality depends on the local LLM:
- INTRA-CLUSTER: memories about the same topic should form edges with each other (high recall within cluster).
- INTER-CLUSTER: memories about different topics should NOT form edges (high precision between clusters).

This scenario stores 20 memories spanning 4 topics × 5 memories each, then inspects the resulting edges. A healthy local-LLM stack shows dense intra-cluster edges and sparse inter-cluster edges.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm intra-cluster cohesion + inter-cluster separation in the auto-derived causal graph.
- Real user request: `Save 20 memories spanning 4 topics, then verify causal_edges form within each topic and not across topics.`
- AI-to-CLI handoff prompt: `You are <external-CLI>. I am Claude. Save 20 memories spanning 4 distinct topics (5 each), wait for indexing + edge derivation, then dump the edges and return the intra/inter cluster edge counts.`
- Expected execution process: bulk save, wait, dump edges, compute confusion matrix of edges-by-cluster-pair.
- Expected signals: intra-cluster edges (same-topic) ≥ 2× inter-cluster edges (cross-topic); no single cross-topic pair dominates over its intra-cluster pair.
- Desired user-visible outcome: `PASS — intra/inter ratio 3.4×; ratios per topic all ≥ 2×.`
- Pass/fail: PASS if global intra/inter ≥ 2× AND each topic's intra-count is highest cell in its row; PARTIAL if global ratio ≥ 1.5×; FAIL if intra ≤ inter.

---

## 3. TEST EXECUTION

### Prompt (AI-to-CLI handoff)

```
You are <external-CLI>. I am Claude orchestrating a memory-substrate validation. Save 20 memories grouped into 4 topics (5 memories each) through mcp__mk_spec_memory__memory_save, then verify causal coverage. Topics + sample content:

Topic 1 — embedding provider cascade:
  - "Voyage and OpenAI API keys take priority over local providers"
  - "ollama auto-selects when GGUF runtime is installed locally"
  - "hf-local is the final fallback when no cloud keys and no ollama"
  - "EMBEDDINGS_PROVIDER=auto delegates resolution to factory.ts"
  - "The cascade resumes after warmup failure rather than one-hop fallback"

Topic 2 — profile DB filenames:
  - "Profile slug encodes provider, model, dim, and dtype"
  - "Voyage cloud profile uses 'cloud' as the synthetic dtype slug"
  - "ollama DB ends in __unsloth-bge-base-en-v1.5-gguf__768__q8.sqlite"
  - "hf-local DB ends in __onnx-community_bge-base-en-v1.5-onnx__768__q8.sqlite"
  - "Generic context-index.sqlite is the legacy singleton path"

Topic 3 — doctor command boundaries:
  - "doctor memory operates on the active profile DB via context-index__*.sqlite glob"
  - "doctor causal-graph runs add-only — never deletes existing edges"
  - "doctor update is the all-in-one orchestrator with snapshot + rollback"
  - "doctor command surfaces are hardlinked across .opencode and .claude"
  - "doctor flock prevents concurrent dispatch"

Topic 4 — chunking + retrieval:
  - "Tree-sitter parses code into structural units before embedding"
  - "Chunks are sized 1000 chars with 150 char overlap"
  - "FTS5 + vector hybrid search blends lexical and semantic scores"
  - "Re-rank stage applies channel diversification and confidence cliff"
  - "MMR diversifies the final top-K to avoid duplicate content"

For each of the 20 memories, write a canonical research-doc file at `<spec-folder><topic>-<n>/research.md` where <topic> is 1-4 and <n> is 1-5. Each file has frontmatter (title from content first words, description "Cluster coverage probe", trigger_phrases drawn from the content) and the content sentence as the body. Then call `memory_save({filePath})` once per file (20 calls). Capture the 20 parent_ids grouped by topic. (Do NOT pass `retentionPolicy: "ephemeral"` — see post-014/022 follow-up note in 401-paraphrase-recall.md.)

After all 20 saves complete, wait 8 seconds for indexing + edge derivation. Then:

1. Run mcp__mk_spec_memory__memory_causal_stats({ spec_folder: "_sandbox/local-llm-query-intelligence/412" }).
2. For each pair of the 20 parent IDs you saved, run mcp__mk_spec_memory__memory_causal_link to enumerate edges.
3. Build a 4×4 confusion matrix counting edges where source∈topic_i and target∈topic_j.
4. Return JSON: { memories_by_topic: {1:[...],2:[...],3:[...],4:[...]}, confusion_matrix: [[..]×4], intra_count: N, inter_count: M, ratio: intra/inter, verdict: "PASS|PARTIAL|FAIL" with rationale }.
```

### Verification

- Confirm the 4×4 confusion matrix's diagonal (intra-topic) is the largest cell in each row.
- Confirm intra_count / inter_count ≥ 2.
- If a cross-topic cluster dominates, identify which topic pair and inspect content for legitimate semantic overlap.

### Expected

```
confusion_matrix:
         T1  T2  T3  T4
   T1 [  8,  2,  0,  1 ]
   T2 [  2,  9,  1,  0 ]
   T3 [  0,  1,  7,  2 ]
   T4 [  1,  0,  2,  9 ]

intra_count: 33  (sum of diagonal)
inter_count: 12  (sum of off-diagonal)
ratio: 2.75×
diagonal-row-leader check: 4/4 ✓
→ PASS
```

### Evidence

- BLOCKED before executing scenario commands. The scenario's AI-to-CLI handoff requires creating 20 canonical research-doc files at `<spec-folder><topic>-<n>/research.md`, calling `memory_save({filePath})` for each, then the CLEAN-UP section requires `rm -rf <spec-folder>*` after `memory_delete`.
- Current execution constraint from the user: `Do NOT modify, create, or delete any file OTHER than the single scenario file named below.`
- Current allowed write path from the user: `.opencode/skills/system-spec-kit/manual-testing-playbook/local-llm-query-intelligence/causal-coverage-under-bulk-save.md (this file only)`
- No `memory_save`, `memory_causal_stats`, `memory_causal_link`, `memory_delete`, or `rm -rf <spec-folder>*` commands were run because the scenario's required file creation/deletion would violate the allowed write scope.
- The 20 parent IDs grouped by topic: not produced.
- The full 4×4 confusion matrix: not produced.
- intra_count, inter_count, ratio: not produced.
- The "diagonal is row leader" check per topic: not produced.
- Active provider from memory_health: not checked; blocked before scenario command execution.

### Pass/Fail

BLOCKED — The playbook requires creating and deleting files outside the only user-approved write path, so its required commands cannot be executed exactly as written in the current constrained run.

---

## 4. CLEAN-UP

Loop memory_delete over the 20 captured parent_ids, then remove on-disk files:
```
for ID in <20 parent_ids>:
  mcp__mk_spec_memory__memory_delete({ parent_id: ID })

rm -rf <spec-folder>*
```
