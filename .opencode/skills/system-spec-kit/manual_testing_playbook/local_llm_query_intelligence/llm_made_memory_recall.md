---
title: "409 - LLM-made memory recall (round-trip quality)"
description: "The local LLM has been storing memories through generate-context.js + memory_save. Validate that deterministic paraphrases of LLM-stored memories surface their exact source IDs without stale corpus rows polluting the result."
audited_post_018: true
fixture_version: "post-surgery"
fixture_file: "409-fixture.json"
version: 3.6.0.3
---

# 409 - LLM-made memory recall (round-trip quality)

## 1. OVERVIEW

The Memory MCP database contains thousands of LLM-stored memories: every `/memory:save` call, every spec-folder save, every continuity refresh. Each was embedded and stored in a profile-keyed sqlite. This scenario validates that those embeddings still surface their source memory when queried with deterministic paraphrases from a fixed fixture.

A round-trip failure mode would be: store a memory about concept X, query with a faithful paraphrase of X, and the source memory does not appear in top-K. That indicates embedding drift, indexing corruption, weak paraphrase handling, or trigger-phrase routing failure.

---

## 2. SCENARIO CONTRACT

- Objective: Validate deterministic paraphrase recall for LLM-stored memories.
- Real user request: `Read the 10-pair 409 fixture, query each paraphrase, and verify the expected source memory appears in top-3 each time.`
- RCAF Prompt: `As a query-intelligence validation operator, read manual_testing_playbook/local_llm_query_intelligence/409_fixture.json, query each fixture paraphrase with Memory MCP, and verify the expected source memory appears in top-3. Return a pass/fail verdict with the per-sample table.`
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
   jq -c '.[]' .opencode/skills/system-spec-kit/manual_testing_playbook/local_llm_query_intelligence/409_fixture.json
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

- Fixture version from frontmatter: `fixture_version: "post-surgery"`; fixture file: `409-fixture.json`.
- Fixture load command executed:
  ```bash
  jq -c '.[]' .opencode/skills/system-spec-kit/manual_testing_playbook/local_llm_query_intelligence/409_fixture.json
  ```
- Fixture load output:
  ```json
  {"query":"documentation verification checklist for the CocoIndex complete-fork author docs phase","expected_source_memory_id":2000,"expected_title_substring":"Verification Checklist: Author Fork Documentation","paraphrase_difficulty":"easy"}
  {"query":"checklist for fixing V8 cross-spec contamination and ADR numeric prefix overreach in the local embeddings migration","expected_source_memory_id":1620,"expected_title_substring":"040 V-rule cross-spec overreach fix","paraphrase_difficulty":"medium"}
  {"query":"deep-research summary comparing Contextador's retrieval ergonomics and MCP query surface against Public's existing substrate","expected_source_memory_id":954,"expected_title_substring":"research-and-baseline","paraphrase_difficulty":"medium"}
  {"query":"ADR about consolidating spec-kit templates into the level and addendum generator instead of leaving compose scripts separate","expected_source_memory_id":1404,"expected_title_substring":"Decision Record: Template System Consolidation","paraphrase_difficulty":"medium"}
  {"query":"research packet for turning review findings into fix-completeness inventories and cross-surface planner checks","expected_source_memory_id":1047,"expected_title_substring":"Feature Specification: Fix-Iteration Quality Meta-Research","paraphrase_difficulty":"hard"}
  {"query":"implementation summary for the FIX-010-v2 remediation of packet docs, review strategy state, and inert planner imports","expected_source_memory_id":1046,"expected_title_substring":"Implementation Summary: FIX-010-v2","paraphrase_difficulty":"easy"}
  {"query":"file ledger resource map for the testing playbook trio follow-up quality pass","expected_source_memory_id":729,"expected_title_substring":"Resource Map - 037 child 003 testing playbook trio","paraphrase_difficulty":"easy"}
  {"query":"plan covering memory indexer invariants, PE lineage guardrails, scan recheck bypass, and constitutional tier cleanup","expected_source_memory_id":1007,"expected_title_substring":"Plan: Memory Indexer Invariants","paraphrase_difficulty":"hard"}
  {"query":"stress-test task list tracking cat-14 pipeline gaps, cat-16 tooling fixes, and the remaining cat-24 memory-recall failure","expected_source_memory_id":908,"expected_title_substring":"Tasks: 052 Stress Test Expansion and Alignment","paraphrase_difficulty":"hard"}
  {"query":"task checklist for the mxbai swap that planned a 20-scenario PASS sample across cat-01, cat-11, cat-15, cat-13, and cat-23","expected_source_memory_id":1096,"expected_title_substring":"Verification Checklist: Real-World Usefulness Test","paraphrase_difficulty":"medium"}
  ```
- Native Memory MCP `memory_search` call attempted for sample 1 with payload equivalent to `memory_search({ query: "documentation verification checklist for the CocoIndex complete-fork author docs phase", limit: 10 })`; the OpenCode tool wrapper injected empty optional `cursor` and `concepts` fields and returned:
  ```json
  {
    "summary": "Error: An unexpected error occurred. Please check logs for details.",
    "data": {
      "error": "An unexpected error occurred. Please check logs for details.",
      "code": "E030",
      "details": {
        "tool": "memory_search",
        "issues": [
          "cursor: Too small: expected string to have >=1 characters",
          "concepts: Too small: expected array to have >=2 items"
        ]
      }
    }
  }
  ```
- Retry with placeholder non-empty `cursor` failed because searches cannot be started with a fake cursor:
  ```json
  {
    "summary": "Error: Cursor is invalid, expired, or out of scope",
    "data": {
      "error": "Cursor is invalid, expired, or out of scope",
      "code": "E_VALIDATION",
      "details": {
        "parameter": "cursor"
      }
    }
  }
  ```
- `memory_health` could not provide active provider or active profile DB filename; both attempts returned exactly:
  ```text
  MCP error -32001: backend recycled; retry
  ```
- Warm CLI fallback command attempted:
  ```bash
  node '.opencode/bin/spec-memory.cjs' memory_health --json '{"reportMode":"full","includeFullReport":false}' --format json --timeout-ms 3000
  ```
- Warm CLI fallback output:
  ```text
  @spec-kit/mcp-server dist is stale. Run: cd .opencode/skills/system-spec-kit/mcp_server && npm run build
  ```
- Active provider from `memory_health`: unavailable because `memory_health` repeatedly failed with `MCP error -32001: backend recycled; retry`.
- Active profile DB filename: unavailable because `memory_health` repeatedly failed and the CLI fallback refused to run due stale dist.
- Per-sample source ranks: unavailable because the required `memory_search({ query: "<fixture query>", limit: 10 })` command path is not executable in the current runtime.
- Summary: `0 of 10 queried; mean rank unavailable`.
- Confirmation that fixture IDs exist in `memory_index`, have `embedding_status = 'success'`, and reference files that exist on disk: unavailable because the scenario's required Memory MCP health/search path is blocked, and rebuilding the stale CLI dist would modify files outside the allowed write path.

### Pass/Fail

BLOCKED - Required Memory MCP search and health evidence could not be collected: native MCP returned `E030` / backend recycle errors, and the warm CLI fallback refused to run because `@spec-kit/mcp-server dist is stale`; rebuilding dist would violate this scenario's allowed write paths.

## 4. NOTES

This scenario tests embedding consistency over time: memories stored earlier should still surface today under faithful paraphrases. If the recall rate drops below 80%, possible causes:

1. Provider drift.
2. Index corruption.
3. Trigger-phrase boost decayed below the embedding signal floor.
4. Paraphrase similarity is below the dense embedder's usable semantic margin.

If recall is high (>= 90%), the local-LLM round-trip is healthy and embeddings remain stable across the storage-to-retrieval boundary.

## 5. CLEANUP

No cleanup needed. Treat fixture IDs as read-only.
