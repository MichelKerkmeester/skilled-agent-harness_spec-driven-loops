---
title: "409 — LLM-made memory recall (round-trip quality)"
description: "The local LLM has been storing memories through generate-context.js + memory_save. Validate that those LLM-stored memories surface for their own trigger phrases and don't drift from the original content under the embedding round-trip."
audited_post_018: true
---

# 409 — LLM-made memory recall (round-trip quality)

## 1. OVERVIEW

The Memory MCP database contains thousands of LLM-stored memories — every `/memory:save` call, every spec-folder save, every continuity refresh. Each was embedded by the local LLM (EmbeddingGemma via llama-cpp) and stored in a profile-keyed sqlite. This scenario validates that those embeddings still surface their source memory when queried with the same trigger phrase the memory was indexed under.

A round-trip failure mode would be: store a memory with trigger phrases [X, Y, Z], query with X → memory doesn't appear in top-K. That would indicate either embedding drift, indexing corruption, or trigger-phrase routing failure.

---

## 2. SCENARIO CONTRACT

- Objective: Validate round-trip embedding integrity for LLM-stored memories.
- Real user request: `Sample 10 random LLM-stored memories, query each with one of its own trigger phrases, and verify the memory appears in top-3 each time.`
- RCAF Prompt: `As a query-intelligence validation operator, sample 10 random memories from the active Memory MCP DB, query each with one of its registered trigger phrases, and verify the source memory appears in top-3. Return a pass/fail verdict with the per-sample table.`
- Expected execution process: sample 10 memories, for each: pick one trigger phrase, query, check rank.
- Expected signals: source memory in top-3 for ≥ 8 of 10 samples; mean rank ≤ 2.
- Desired user-visible outcome: `PASS — 9 of 10 samples surface their source memory in top-3; mean rank 1.6.`
- Pass/fail: PASS if ≥ 8/10 in top-3; PARTIAL if 5-7/10; FAIL if ≤ 4/10.

---

## 3. TEST EXECUTION

### Prompt

```
Validate Memory MCP round-trip recall: sample 10 LLM-stored memories, query each with one of its trigger phrases, report rank distribution.
```

### Commands

1. Sample 10 random memories from the active profile DB:
   ```bash
   # The active profile DB filename varies — discover it first:
   ACTIVE_DB=$(ls .opencode/skills/system-spec-kit/mcp_server/database/context-index__*.sqlite | head -1)

   # Sample 10 random memories with trigger_phrases populated:
   sqlite3 "$ACTIVE_DB" "
     SELECT id, content_hash, trigger_phrases, substr(content, 1, 100)
     FROM memory_index
     WHERE trigger_phrases IS NOT NULL AND length(trigger_phrases) > 5
     ORDER BY random()
     LIMIT 10
   "
   ```
2. For each sampled memory, pick the first trigger phrase from its `trigger_phrases` field.
3. Query Memory MCP with that trigger phrase:
   ```
   memory_search({ query: "<trigger phrase>", limit: 10 })
   ```
4. Identify the rank at which the source memory's parent_id appears.
5. Build the round-trip table.

### Expected

```
| Sample | Trigger phrase                | Source ID    | Source rank in top-10 |
|-------:|-------------------------------|--------------|----------------------:|
| 1      | "spec folder modifications"   | a1b2c3...    | 1                     |
| 2      | "auto cascade fallback"       | d4e5f6...    | 1                     |
| 3      | "voyage embedding migration"  | a7b8c9...    | 2                     |
| 4      | "llama-cpp profile DB"        | f1e2d3...    | 1                     |
| 5      | "context save handover"       | c4b5a6...    | 1                     |
| 6      | "hf-local fallback model"     | e7f8a9...    | 3                     |
| 7      | "profile slug normalization"  | 1a2b3c...    | 2                     |
| 8      | "rebuild memory index"        | 4d5e6f...    | 1                     |
| 9      | "doctor command dispatch"     | 7a8b9c...    | 2                     |
| 10     | "trigger phrase matching"     | 1d2e3f...    | 1                     |
```

Summary: 10/10 in top-3, mean rank 1.5 → PASS

### Evidence

- The exact sqlite sample query and the 10 memory rows it returned.
- For each sample: the trigger phrase used, the Memory MCP query payload, the rank of the source memory in the response.
- A summary line: `X of 10 in top-3, mean rank Y.Z`.
- Active provider from memory_health.
- The active profile DB filename.

## 4. NOTES

This scenario tests **embedding consistency over time** — memories stored months ago should still surface today under their own trigger phrases. If the recall rate drops below 80%, possible causes:
1. Provider drift (system switched from hf-local to llama-cpp without re-embedding — different vectors, different rankings).
2. Index corruption.
3. Trigger-phrase boost decayed below the embedding signal floor.

If the recall is high (≥ 90%), the local-LLM round-trip is healthy and the embeddings remain stable across the storage→retrieval boundary.

## 5. CLEANUP

No cleanup needed — this scenario only reads from the production DB. Treat all sampled IDs as read-only.
