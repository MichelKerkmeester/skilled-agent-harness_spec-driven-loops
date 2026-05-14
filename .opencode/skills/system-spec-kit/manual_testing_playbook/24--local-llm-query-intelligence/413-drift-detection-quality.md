---
title: "413 — Drift detection quality (memory_drift_why explainability)"
description: "Save a memory, then save 5 contradictory memories about the same concept. Call memory_drift_why and verify it surfaces the contradicting memories with sensible drift reasons. Probes the local LLM's ability to detect semantic conflict, not just lexical match."
audited_post_018: true
---

# 413 — Drift detection quality (memory_drift_why explainability)

## 1. OVERVIEW

`memory_drift_why` is the diagnostic that explains "why does my stored knowledge disagree with itself?" — it surfaces memories that contradict or compete with a target. Quality depends on the local LLM's ability to identify semantic conflict.

This scenario stores a baseline memory + 5 progressively-contradicting variants, then calls `memory_drift_why` against the baseline and verifies it surfaces the contradicting variants in order of disagreement strength.

A downstream AI consumer calling `memory_drift_why` should get useful explanations of why retrieval is noisy for a given query topic.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm `memory_drift_why` correctly identifies and ranks contradicting memories.
- Real user request: `Validate that memory_drift_why returns the contradicting memories in order of how strongly they disagree with the baseline.`
- AI-to-CLI handoff prompt: `You are <external-CLI>. I am Claude. Save a baseline memory + 5 contradicting variants, then call memory_drift_why on the baseline and verify the drift explanation ranks the variants by disagreement strength.`
- Expected execution process: store baseline + 5 variants, wait, call `memory_drift_why`, inspect returned drift explanation.
- Expected signals: drift explanation references ≥ 3 of 5 variants; the strongest-contradiction variant is in the top-2 of the drift explanation.
- Desired user-visible outcome: `PASS — drift_why surfaced 4 of 5 contradicting variants; strongest contradiction at position 1.`
- Pass/fail: PASS if ≥ 3/5 variants surfaced AND strongest is rank ≤ 2; PARTIAL if 2/5 surfaced OR strongest is rank 3-4; FAIL if ≤ 1 surfaced.

---

## 3. TEST EXECUTION

### Prompt (AI-to-CLI handoff)

```
You are <external-CLI>. I am Claude validating Memory MCP drift detection. Use mcp__spec_kit_memory__memory_save then mcp__spec_kit_memory__memory_drift_why:

Step 1 — store baseline:
  content: "EmbeddingGemma 300m is the canonical local embedding model for Memory MCP, producing 768-dimensional vectors via either ONNX (hf-local) or GGUF Q8_0 (llama-cpp). Both provider paths are post-014 supported."
  trigger_phrases: ["EmbeddingGemma canonical local model", "768-dim vector default"]
  importance_tier: "important"
  spec_folder: "_sandbox/24--local-llm-query-intelligence/413"
  → save the returned parent_id as BASELINE_ID.

Step 2 — store 5 contradicting variants in increasing-disagreement order:

Variant V1 (mild — supplementary detail, no real contradiction):
  content: "EmbeddingGemma 300m supports task-specific prefixes via the PREFIX_REGISTRY in hf-local.ts. Document and query embeddings use different prefixes."
  trigger_phrases: ["embedding prefix registry", "task-specific embedding prefixes"]

Variant V2 (mild contradiction — different model name):
  content: "MiniLM-L6-v2 is the canonical local embedding model. It produces 384-dimensional vectors and is the default for local search."
  trigger_phrases: ["MiniLM canonical local model", "384 dim default"]

Variant V3 (medium — outdated cascade order):
  content: "Auto cascade resolves to hf-local when no cloud keys are present; llama-cpp is explicit opt-in only and never auto-selects."
  trigger_phrases: ["llama-cpp explicit opt-in", "hf-local default no-key"]

Variant V4 (strong — flat-out wrong dim):
  content: "The Memory MCP standardizes on 1024-dimensional vectors for all local providers. Anything storing 768 is legacy and will fail migration."
  trigger_phrases: ["1024 dim standard local", "768 dim legacy migration"]

Variant V5 (strongest — full denial):
  content: "Memory MCP has no local embedding support. All embeddings require a cloud API key (Voyage or OpenAI). Offline local-LLM embedding is not implemented."
  trigger_phrases: ["no local embedding support", "cloud API required"]

For each variant: save with importance_tier="normal", spec_folder="_sandbox/24--local-llm-query-intelligence/413".

Step 3 — wait 5 seconds for indexing + drift detection.

Step 4 — call mcp__spec_kit_memory__memory_drift_why({ parent_id: BASELINE_ID, limit: 10 }).

Step 5 — return JSON:
  {
    "baseline_id": BASELINE_ID,
    "variant_ids": { V1, V2, V3, V4, V5 },
    "drift_explanation": <full memory_drift_why response>,
    "variants_in_explanation": ["V1", "V3", "V4", "V5"] // which variants surfaced
    "strongest_rank": <rank of V5 in the explanation, or null if absent>,
    "verdict": "PASS|PARTIAL|FAIL" with one-line rationale
  }
```

### Verification

- V1 (no real contradiction) being absent from drift_why is FINE (correct — it's supplementary).
- V5 (strongest) being absent is a FAIL signal.
- Ideal ranking: V5 > V4 > V3 > V2 > V1.

### Expected

```
{
  "baseline_id": "a1b2...",
  "variant_ids": { "V1": "c1...", "V2": "c2...", ..., "V5": "c5..." },
  "drift_explanation": {
    "drift_score": 0.62,
    "contradicting": [
      { "parent_id": "c5...", "score": 0.71, "rationale": "denies local-LLM support" },
      { "parent_id": "c4...", "score": 0.66, "rationale": "1024 vs 768 dim mismatch" },
      { "parent_id": "c2...", "score": 0.58, "rationale": "MiniLM vs EmbeddingGemma" },
      { "parent_id": "c3...", "score": 0.51, "rationale": "cascade-order disagreement" }
    ]
  },
  "variants_in_explanation": ["V5", "V4", "V2", "V3"],
  "strongest_rank": 1,
  "verdict": "PASS — strongest contradiction (V5) at rank 1; 4/5 variants surfaced; V1 correctly excluded."
}
```

### Evidence

- The full AI-to-CLI handoff transcript.
- The 5 variant content strings + parent IDs.
- The drift_why response verbatim.
- The variant-to-rank table.
- An honest assessment of whether V1's exclusion was correct (no real contradiction = correctly excluded vs. real contradiction = missed = closer to FAIL).
- Active provider from memory_health.

---

## 4. CLEAN-UP

```
mcp__spec_kit_memory__memory_bulk_delete({ spec_folder: "_sandbox/24--local-llm-query-intelligence/413" })
```
