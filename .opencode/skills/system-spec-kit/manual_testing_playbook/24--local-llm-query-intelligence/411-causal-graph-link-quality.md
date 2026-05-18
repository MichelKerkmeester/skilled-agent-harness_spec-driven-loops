---
title: "411 — Causal graph link quality (does the local LLM connect related memories?)"
description: "Save a sequence of causally-related memories (cause → effect → mitigation), then verify memory_causal_link surfaces the chain. Probes whether EmbeddingGemma's semantic representation gives the causal-graph builder enough signal to form correct edges."
audited_post_018: true
---

# 411 — Causal graph link quality (does the local LLM connect related memories?)

## 1. OVERVIEW

The Memory MCP's causal graph is derived from embedding similarity + temporal proximity + explicit `memory_causal_link` calls. The quality of the auto-derived edges depends on the local LLM's embedding: if EmbeddingGemma represents "cause" and "effect" memories in nearby vector space, the causal-edge builder finds them; if it doesn't, edges are missed and the graph degrades.

This scenario stores a 3-step causal chain (problem → root cause → mitigation), waits for indexing + edge derivation, then queries the causal graph to confirm the chain is intact.

The behavior is user-observable: a downstream AI consumer that calls `memory_drift_why` or `memory_causal_stats` gets useful graph context — or doesn't.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm the causal-edge builder forms correct edges between semantically-related memories saved through `memory_save`.
- Real user request: `Verify our causal graph correctly links a 3-step problem→cause→mitigation chain after Memory MCP indexes them.`
- AI-to-CLI handoff prompt: `You are <external-CLI>. I am Claude running the validation workflow. Save a 3-step causal chain to our shared Memory MCP, then call memory_causal_stats and memory_causal_link to surface the chain. Return the resulting edge set as JSON.`
- Expected execution process: store 3 memories via `memory_save`, wait 5s for indexing, query causal stats, verify at least 2 edges link the 3 memories.
- Expected signals: `memory_causal_stats` reports the new memories; at least 2 of 3 possible edges (chain-1→2, 2→3) are present; edge confidence ≥ 0.5.
- Desired user-visible outcome: `PASS — 2 of 2 chain edges formed; confidences 0.78 and 0.71.`
- Pass/fail: PASS if ≥ 2 chain edges with confidence ≥ 0.5; PARTIAL if 1 edge; FAIL if 0 edges or edges link wrong pairs.

---

## 3. TEST EXECUTION

### Prompt (AI-to-CLI handoff template)

The external CLI receives this verbatim:

```
You are <external-CLI>. I am Claude orchestrating a Memory MCP causal-graph validation. The local LLM (EmbeddingGemma via llama-cpp) is the embedding backbone.

1. Write three canonical research-doc files under `<spec-folder>`. memory_save requires `filePath` to a canonical spec doc; the directory containing the file becomes its spec-folder for grouping.

   File A — `<spec-folder>` (problem):
     ---
     title: "Stale results after provider switch"
     description: "Causal chain test — problem step (scenario 411)."
     trigger_phrases: ["stale results after provider switch", "post-migration semantic search"]
     ---
     Memory MCP semantic search returns stale results after a provider switch from hf-local to llama-cpp. Symptoms: top-K contains pre-migration entries with mismatched dimensions.

   File B — `<spec-folder>` (root cause):
     ---
     title: "Embedding dimension mismatch after switch"
     description: "Causal chain test — root cause step (scenario 411)."
     trigger_phrases: ["embedding dimension mismatch after switch", "FTS5 fallback masks stale data"]
     ---
     Provider switches change the embedding dimension and base model. Vectors stored with the old provider are dimensionally incompatible with new queries. The vector-index-store correctly refuses the mismatch but falls back to FTS5, which returns the stale lexical hits.

   File C — `<spec-folder>` (mitigation):
     ---
     title: "Auto-migration on provider switch"
     description: "Causal chain test — mitigation step (scenario 411)."
     trigger_phrases: ["auto-migration on provider switch", "re-embed all rows"]
     ---
     On detected provider switch, run the auto-migration path: factory.ts triggers re-embedding of all rows into the new profile-keyed sqlite, then deletes the old DB. After migration completes, semantic search returns provider-native results without stale FTS5 fallback.

2. Call mcp__mk_spec_memory__memory_save once per file (3 calls total), passing each absolute filePath. Capture the 3 returned parent_ids as A_ID, B_ID, C_ID. (Do NOT pass `retentionPolicy: "ephemeral"` — see post-014/022 follow-up note in 401-paraphrase-recall.md.)

3. Wait 5 seconds for the daemon to index + run the edge-derivation pass.

4. Call mcp__mk_spec_memory__memory_causal_stats() and capture the totals.

5. Call mcp__mk_spec_memory__memory_causal_link with the three parent IDs A_ID/B_ID/C_ID; ask it to return causal edges grouped by source memory.

6. Return a JSON object with:
   {
     "memories": [A_ID, B_ID, C_ID],
     "stats_after_save": <causal_stats output>,
     "edges_among_three": [{source, target, confidence, kind}],
     "verdict": "PASS" | "PARTIAL" | "FAIL" with one-line rationale
   }
```

### Verification

The orchestrating Claude (this playbook caller) verifies the external CLI's response:

- Confirm 3 parent IDs returned and present in stats.
- Confirm `edges_among_three` has ≥ 2 entries linking the chain (A→B, B→C, or both).
- Confirm each edge confidence ≥ 0.5.
- If only same-pair edges (e.g., A↔A self-loops) are reported, that's a FAIL.

### Expected

```
{
  "memories": ["a1b2...", "c3d4...", "e5f6..."],
  "stats_after_save": { "total_memories": <n>, "total_edges": <m> },
  "edges_among_three": [
    { "source": "a1b2...", "target": "c3d4...", "confidence": 0.78, "kind": "semantic" },
    { "source": "c3d4...", "target": "e5f6...", "confidence": 0.71, "kind": "semantic" }
  ],
  "verdict": "PASS — chain formed both expected edges with strong confidence."
}
```

### Evidence

- The exact AI-to-CLI handoff prompt + the CLI's verbatim response.
- The 3 parent IDs.
- The causal_stats delta (pre vs post).
- The edges_among_three list.
- Active provider from `memory_health`.
- An honest note if extra edges formed (causal builder may legitimately link to unrelated memories — note but do not fail unless those wrongly-paired edges dominate the chain edges).

---

## 4. CLEAN-UP

```
mcp__mk_spec_memory__memory_delete({ parent_id: A_ID })
mcp__mk_spec_memory__memory_delete({ parent_id: B_ID })
mcp__mk_spec_memory__memory_delete({ parent_id: C_ID })
```

Then remove the on-disk test files:
```
rm -rf <spec-folder> <spec-folder> <spec-folder>
```

Memory delete also removes the causal edges attached to those memories.
