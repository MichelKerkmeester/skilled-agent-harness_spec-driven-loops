---
title: "111 -- Deferred lexical-only indexing"
description: "This scenario validates Deferred lexical-only indexing for `111`. It focuses on Confirm embedding-failure fallback and BM25 searchability."
audited_post_018: true
version: 3.6.0.17
id: memory-quality-and-indexing-deferred-lexical-only-indexing
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 111 -- Deferred lexical-only indexing

## 1. OVERVIEW

This scenario validates Deferred lexical-only indexing for `111`. It focuses on Confirm embedding-failure fallback and BM25 searchability.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm embedding-failure fallback and BM25 searchability.
- Real user request: `Please validate Deferred lexical-only indexing against OPENAI_API_KEY and tell me whether the expected signals are present: Memory saved with embedding_status='pending' on embedding failure; BM25/FTS5 lexical search returns the spec-doc record; reindex transitions status to 'success'; vector search works after reindex.`
- Prompt: `Validate deferred lexical-only indexing after embedding failure.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Memory saved with embedding_status='pending' on embedding failure; BM25/FTS5 lexical search returns the spec-doc record; reindex transitions status to 'success'; vector search works after reindex
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if embedding failure falls back to lexical-only indexing, BM25 search works, and reindex recovers full embedding

---

## 3. TEST EXECUTION

### Prompt

```
Validate deferred lexical-only indexing after embedding failure.
```

### Commands

1. simulate embedding failure (e.g., set invalid `OPENAI_API_KEY`)
2. `memory_save(filePath)` → verify memory saved with `embedding_status='pending'`
3. `memory_search({query:"<title of saved memory>"})` → verify BM25/FTS5 retrieval works (lexical match)
4. restore valid API key
5. run `node cli.js reindex` → verify `embedding_status` transitions to `'success'` and `retry_count` increments
6. `memory_search({query:"<semantic query>"})` → verify vector search now works

### Expected

Memory saved with embedding_status='pending' on embedding failure; BM25/FTS5 lexical search returns the spec-doc record; reindex transitions status to 'success'; vector search works after reindex

### Evidence

Precondition check for `OPENAI_API_KEY`:

```text
OPENAI_API_KEY=missing
```

Active embedder check via `embedder_list`:

```json
{
  "summary": "Listed 1 embedders",
  "data": [
    {
      "name": "nomic-embed-text-v1.5",
      "dim": 768,
      "backend": "ollama",
      "active": true,
      "ready": true,
      "notes": "Drop-in 768-dim swap candidate. Retrieval-specialist trained on 235M pairs with hard negatives. Requires prefix tokens. Local-first cascade default per ADR-014."
    }
  ]
}
```

Expected built CLI artifact check for `.opencode/skills/system-spec-kit/mcp-server/dist/cli.js`:

```text
No files found
```

Memory status baseline via `memory_stats`:

```json
{
  "summary": "Memory system: 32457 memories across 3810 folders",
  "data": {
    "byStatus": {
      "pending": 8993,
      "success": 14331,
      "failed": 1359,
      "retry": 1041,
      "partial": 0
    },
    "vectorSearchEnabled": true,
    "lastIndexedAt": "2026-07-02T10:42:12.159Z"
  }
}
```

The required sequence could not be completed: command 4 requires restoring a valid API key, but `OPENAI_API_KEY` is missing; the active embedder is `backend: "ollama"` rather than OpenAI; command 5 requires `node cli.js reindex`, but the expected built CLI artifact `.opencode/skills/system-spec-kit/mcp-server/dist/cli.js` is absent.

### Pass / Fail

- **BLOCKED**: `OPENAI_API_KEY` is missing, the active embedder is Ollama rather than OpenAI, and `.opencode/skills/system-spec-kit/mcp-server/dist/cli.js` is absent, so the required invalid-key save, valid-key restore, and `node cli.js reindex` recovery sequence cannot be executed as written.

### Failure Triage

Verify embedding_status column exists in schema; check BM25/FTS5 index includes pending memories; inspect reindex retry logic and retry_count tracking

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [memory-quality-and-indexing/deferred-lexical-only-indexing.md](../../feature-catalog/memory-quality-and-indexing/deferred-lexical-only-indexing.md)

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: 111
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `memory-quality-and-indexing/deferred-lexical-only-indexing.md`
