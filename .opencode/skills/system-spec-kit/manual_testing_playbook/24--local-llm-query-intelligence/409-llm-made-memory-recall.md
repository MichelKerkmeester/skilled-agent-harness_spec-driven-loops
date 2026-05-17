---
title: "409 - LLM-made memory recall (round-trip quality)"
description: "The local LLM has been storing memories through generate-context.js + memory_save. Validate that deterministic paraphrases of LLM-stored memories surface their exact source IDs without stale corpus rows polluting the result."
audited_post_018: true
fixture_version: "post-surgery"
fixture_file: "409-fixture.json"
---

# 409 - LLM-made memory recall (round-trip quality)

## 1. OVERVIEW

The Memory MCP database contains thousands of LLM-stored memories: every `/memory:save` call, every spec-folder save, every continuity refresh. Each was embedded and stored in a profile-keyed sqlite. This scenario validates that those embeddings still surface their source memory when queried with deterministic paraphrases from a fixed fixture.

A round-trip failure mode would be: store a memory about concept X, query with a faithful paraphrase of X, and the source memory does not appear in top-K. That indicates embedding drift, indexing corruption, weak paraphrase handling, or trigger-phrase routing failure.

---

## 2. SCENARIO CONTRACT

- Objective: Validate deterministic paraphrase recall for LLM-stored memories.
- Real user request: `Read the 10-pair 409 fixture, query each paraphrase, and verify the expected source memory appears in top-3 each time.`
- RCAF Prompt: `As a query-intelligence validation operator, read manual_testing_playbook/24--local-llm-query-intelligence/409-fixture.json, query each fixture paraphrase with Memory MCP, and verify the expected source memory appears in top-3. Return a pass/fail verdict with the per-sample table.`
- Expected execution process: read 10 pairs from `409-fixture.json`; for each pair, query the `query` string and check the rank of `expected_source_memory_id`.
- Expected signals: source memory in top-3 for >= 8 of 10 deterministic fixture rows; mean rank <= 2. Calibration source: 016/004 retrieval-rescue evidence reached 8/10 with the post-surgery fixture.
- Desired user-visible outcome: `PASS - 8 of 10 fixture rows surface their source memory in top-3; mean rank <= 2.0.`
- Pass/fail: PASS if >= 8/10 in top-3; PARTIAL if 5-7/10; FAIL if <= 4/10.

---

## 3. TEST EXECUTION

### Prompt

```
Validate Memory MCP round-trip recall: read 10 deterministic paraphrase pairs from 409-fixture.json, query each paraphrase, report rank distribution.
```

### Commands

1. Load the deterministic fixture:
   ```bash
   jq -c '.[]' .opencode/skills/system-spec-kit/manual_testing_playbook/24--local-llm-query-intelligence/409-fixture.json
   ```
2. For each fixture row, query Memory MCP with its paraphrase:
   ```
   memory_search({ query: "<fixture query>", limit: 10 })
   ```
3. Identify the rank at which `expected_source_memory_id` appears.
4. Build the round-trip table.

### Expected

```
| Sample | Paraphrase query | Source memory ID | Difficulty | Source rank in top-10 |
|-------:|------------------|-----------------:|------------|----------------------:|
| 1      | fixture row 1    | 4460             | easy       | 1                     |
| 2      | fixture row 2    | 7007             | medium     | 1                     |
| 3      | fixture row 3    | 7479             | medium     | 2                     |
| 4      | fixture row 4    | 8048             | medium     | 1                     |
| 5      | fixture row 5    | 7639             | hard       | 3                     |
| 6      | fixture row 6    | 7636             | easy       | 1                     |
| 7      | fixture row 7    | 7183             | easy       | 1                     |
| 8      | fixture row 8    | 12897            | hard       | 2                     |
| 9      | fixture row 9    | 13310            | hard       | 3                     |
| 10     | fixture row 10   | 13352            | medium     | 2                     |
```

Summary: 8/10 or better in top-3, mean rank <= 2.0 -> PASS

### Evidence

- The exact fixture version and active profile DB filename.
- For each sample: the paraphrase query used, the Memory MCP query payload, the expected source memory ID, and the source rank in the response.
- A summary line: `X of 10 in top-3, mean rank Y.Z`.
- Active provider from memory_health.
- Confirmation that all fixture IDs exist in `memory_index`, have `embedding_status = 'success'`, and reference files that exist on disk.

## 4. NOTES

This scenario tests embedding consistency over time: memories stored earlier should still surface today under faithful paraphrases. If the recall rate drops below 80%, possible causes:

1. Provider drift.
2. Index corruption.
3. Trigger-phrase boost decayed below the embedding signal floor.
4. Paraphrase similarity is below the dense embedder's usable semantic margin.

If recall is high (>= 90%), the local-LLM round-trip is healthy and embeddings remain stable across the storage-to-retrieval boundary.

## 5. CLEANUP

No cleanup needed. Treat fixture IDs as read-only.
