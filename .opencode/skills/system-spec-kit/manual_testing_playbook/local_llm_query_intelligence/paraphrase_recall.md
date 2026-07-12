---
title: "401 — Paraphrase recall"
description: "Validates that a memory stored with one phrasing is retrievable when the operator queries with a paraphrase. Probes BGE local fallback's semantic compression: cosine similarity between original and paraphrase should beat the lexical-overlap-only baseline."
audited_post_018: true
version: 3.6.0.5
---

# 401 — Paraphrase recall

## 1. OVERVIEW

The operator stores a memory using one phrasing (e.g., "Use FSRS algorithm for spaced repetition"). Later, they search with a paraphrased query they didn't store ("apply forgetting-curve scheduling to memory items"). The system must surface the stored memory in the top 3 results, demonstrating that the embedding captures semantic content beyond surface lexical match.

The behavior is user-observable: a real operator stores knowledge in one form, asks about it in another form, and the system bridges the wording gap.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm semantic recall across paraphrase boundary.
- Real user request: `I want to verify that when I search Memory MCP using different words than I stored, the stored memory still surfaces. Test with a stored fact about FSRS and a paraphrased query.`
- RCAF Prompt: `As a query-intelligence validation operator, store a memory containing one phrasing, query it back with a paraphrase the system never saw, and confirm the stored memory appears in the top-3 results. Return a concise pass/fail verdict with the top-K dump and similarity scores.`
- Expected execution process: store via `memory_save`, search via `memory_search`, inspect top-3 hits and their similarity scores.
- Expected signals: the stored memory's parent ID appears in `memory_search` top-3 results with score > 0.5; the rank is at most 3.
- Desired user-visible outcome: `PASS — stored memory ranked #1 (score: 0.82); paraphrase recall confirmed.`
- Pass/fail: PASS if stored memory appears in top-3 with score > 0.5; PARTIAL if rank 4-10; FAIL if absent from top-10.

---

## 3. TEST EXECUTION

### Prompt

```
Verify Memory MCP paraphrase recall: store a memory about FSRS, then query with a paraphrase and report whether the stored memory surfaces in top-3.
```

### Commands

1. Write a canonical research-doc file with the test content. memory_save requires a `filePath` to a canonical spec doc on the allowlist (`research.md` is the simplest fit). Path:
   `<spec-folder>`

   File contents:
   ```markdown
   ---
   title: "FSRS for spaced repetition (scenario 401 baseline)"
   description: "Test memory for paraphrase recall validation."
   trigger_phrases: ["fsrs", "spaced repetition", "memory scheduler"]
   ---

   # FSRS for spaced repetition

   Use FSRS (Free Spaced Repetition Scheduler) algorithm for spaced repetition. FSRS predicts memory stability and difficulty per item, schedules reviews at optimal intervals to minimize forgetting.
   ```

2. Save the memory:
   ```
   memory_save({
     filePath: "<absolute path to the file written in step 1>"
   })
   ```
   Capture the returned `parent_id` as `STORED_ID`.

   > NOTE: do NOT pass `retentionPolicy: "ephemeral"` — it silently triggers
   > governed-ingest enforcement at `lib/governance/scope-governance.ts:235`
   > which requires `tenantId`, `sessionId`, `userId`/`agentId`,
   > `provenanceSource`, `provenanceActor`, and `deleteAfter`. Rely on
   > explicit `memory_delete` cleanup in section 4 instead. See
   > `022-local-llm-legacy-remediation/ai-council/embedding-worker-diagnostic/post-execution-followup.md`.

3. Wait ~3 seconds for indexing + embedding.

4. Query with a paraphrase that does NOT share trigger phrases:
   ```
   memory_search({
     query: "apply forgetting-curve scheduling to memory items at optimal intervals",
     limit: 10,
   })
   ```
5. Inspect the response: extract `{ rank, score, content_preview }` for each of the top 10.

### Expected

The top-3 should include a memory whose content references FSRS or the stored phrasing. The cosine similarity score should be ≥ 0.5 (substantially higher than the unrelated baseline). The lexical overlap between query and stored content is intentionally low ("forgetting-curve scheduling" vs "Free Spaced Repetition Scheduler"), so a lexical-only ranker would fail this test.

### Evidence

- The exact `memory_save` payload and its returned parent ID.
- The exact `memory_search` query string.
- A table of the top 10 results: `rank | score | parent_id | content_snippet`.
- The rank at which the stored memory appears.
- Note which provider was active (ollama vs hf-local) from `memory_health`.

---

## 4. CLEAN-UP

```
memory_delete({ parent_id: STORED_ID })
```

Then remove the on-disk test file:
```
rm -rf <spec-folder>
```
