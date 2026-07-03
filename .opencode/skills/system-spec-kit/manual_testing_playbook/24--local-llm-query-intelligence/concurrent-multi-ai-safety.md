---
title: "415 — Concurrent multi-AI safety (save during search)"
description: "AI-A is mid-search through Memory MCP when AI-B fires a memory_save into the same DB. Verifies the local-LLM substrate stays consistent under interleaved access: search either returns the pre-save snapshot OR the post-save state — never a corrupt mix."
audited_post_018: true
version: 3.6.0.6
---

# 415 — Concurrent multi-AI safety (save during search)

## 1. OVERVIEW

Two AI assistants share the same Memory MCP. The Memory MCP database is single-writer through SQLite's WAL mode, but concurrent reads + a single writer must produce coherent results.

The risk: AI-A initiates a `memory_search` while AI-B fires `memory_save` into the same DB. The local-LLM embedding pipeline (query embedding → vector search → ranking) must produce either the pre-save state OR the post-save state. A mid-write read returning a partial/corrupt vector index would break downstream consumers.

This scenario simulates the race and checks the result for coherence.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm Memory MCP serves coherent reads during a concurrent write.
- Real user request: `Run a concurrent memory_search while a memory_save fires from another AI session, and verify the search result is coherent (no missing vectors, no duplicate rows, no half-written embeddings).`
- AI-to-CLI handoff prompt: `You are <external-CLI-A>. I am the orchestrator. Run memory_search in a tight loop. Meanwhile <external-CLI-B> will fire 10 memory_save calls. Capture the search responses across the write window and confirm each is internally consistent.`
- Expected execution process: launch 2 parallel external CLI sessions; one loops `memory_search`, the other fires `memory_save × 10`; collect all responses; verify each search response is internally consistent.
- Expected signals: every search response has its declared top-K count match the actual returned items; no duplicate parent_ids within a single response; total search-time errors = 0.
- Desired user-visible outcome: `PASS — 50 concurrent searches across the 10-save write window, all internally consistent; 0 errors.`
- Pass/fail: PASS if all search responses internally consistent AND no errors; PARTIAL if ≤ 5% of responses had duplicates (transient WAL read); FAIL if any response was corrupted or any save failed.

---

## 3. TEST EXECUTION

### Phase 1 — Pre-seed Memory MCP

Orchestrating AI stores 5 baseline memories. For each i in 1..5:

  a. Write `<spec-folder>{i}/research.md`:
     ```markdown
     ---
     title: "Concurrent safety probe baseline 415-{i}"
     description: "Pre-seed for concurrent multi-AI safety test."
     trigger_phrases: ["concurrent safety baseline 415-{i}"]
     ---

     Pre-seed memory 415-baseline-{i}: local LLM concurrent safety probe baseline.
     ```

  b. Save it:
     ```
     mcp__mk_spec_memory__memory_save({
       filePath: "<absolute path from step a>"
     })
     # Do NOT pass retentionPolicy: "ephemeral" — see post-014/022 follow-up note in 401-paraphrase-recall.md.
     ```

### Phase 2 — Launch concurrent reader

External CLI-A (use cli-opencode):

```bash
opencode run --model "gpt-5.5" -c approval_policy=never --sandbox workspace-write - <<'PROMPT'
You are <CLI-A>. Run this tight loop for 30 seconds:

  for i in 1..50:
    response = mcp__mk_spec_memory__memory_search({
      query: "local LLM concurrent safety probe",
      limit: 5,
    })
    record:
      iteration: i
      timestamp_ms: <current>
      response_count: len(response.results)
      parent_ids: [r.parent_id for r in response.results]
      has_duplicates: len(parent_ids) != len(set(parent_ids))
      error: <any exception or null>

  return: array of 50 records as JSON.
PROMPT
```

### Phase 3 — Launch concurrent writer (start ~3 seconds after reader)

External CLI-B (use a different CLI than CLI-A):

```bash
opencode run --model "gpt-5.5" -c approval_policy=never --sandbox workspace-write - <<'PROMPT'
You are <CLI-B>. Wait 3 seconds for CLI-A's reader to start its loop, then fire 10 memory_save calls back-to-back (no delay between them). For each i in 1..10:

  a. Write `<spec-folder>{i}/research.md`:
     ---
     title: "Concurrent write probe 415-{i}"
     description: "Concurrent write test against active reader."
     trigger_phrases: ["concurrent write probe 415-{i}"]
     ---

     Concurrent write 415-write-{i}: testing interleaved access against an active reader.

  b. Save:
     mcp__mk_spec_memory__memory_save({
       filePath: "<absolute path from step a>"
     })
     # Do NOT pass retentionPolicy: "ephemeral" — see post-014/022 follow-up note in 401-paraphrase-recall.md.

  Record each save's parent_id + timestamp_ms.
  Return: array of 10 save records as JSON.
PROMPT
```

### Phase 4 — Verification

Orchestrating AI cross-references both response sets:

1. From CLI-A's 50 search records:
   - Confirm zero errors.
   - Confirm zero `has_duplicates: true` rows.
   - Confirm all `response_count` values match expected (5 if pre-seed only, up to 10 as writes complete).

2. From CLI-B's 10 save records:
   - Confirm 10 distinct parent_ids returned, no errors.

3. Verify temporal coherence:
   - Searches BEFORE first write should return only pre-seed memories.
   - Searches AFTER last write may return new memories.
   - Searches DURING the write window may return EITHER state — both are valid; corrupt mixes are NOT valid.

### Expected

```
CLI-A reader summary:
  iterations: 50
  errors: 0
  duplicates: 0
  response_count distribution: 5 (×18), 6 (×8), 7 (×6), 8 (×9), 10 (×9)
  observation: smooth progression from 5 to 10 as writes commit, no inconsistencies

CLI-B writer summary:
  saves: 10
  errors: 0
  distinct parent_ids: 10
  total write window: ~6 seconds

Verdict: PASS — 50/50 reads coherent, 10/10 writes succeeded, 0 errors total.
```

### Evidence

- BLOCKED before Phase 1. The scenario commands require writing additional files outside this scenario file:
  - Phase 1 lines 36-53: `Orchestrating AI stores 5 baseline memories. For each i in 1..5:` then `Write `<spec-folder>{i}/research.md`` and `mcp__mk_spec_memory__memory_save({ filePath: "<absolute path from step a>" })`.
  - Phase 3 lines 87-107: `Wait 3 seconds for CLI-A's reader to start its loop, then fire 10 memory_save calls back-to-back` and for each i in 1..10 `Write `<spec-folder>{i}/research.md`` then `mcp__mk_spec_memory__memory_save({ filePath: "<absolute path from step a>" })`.
- User-provided write constraint for this execution: `Do NOT modify, create, or delete any file OTHER than the single scenario file named below.`
- User-provided allowed write path for this execution: `.opencode/skills/system-spec-kit/manual_testing_playbook/24--local-llm-query-intelligence/concurrent-multi-ai-safety.md (this file only)`.
- No pre-seed files were written, no `memory_save` calls were run, no concurrent reader/writer CLI sessions were launched, and no cleanup commands were run, because doing so would require creating and deleting files outside the single allowed write path.
- Pass/Fail: BLOCKED — required scenario setup and writer commands need additional on-disk `research.md` files, which are outside the allowed write paths for this execution.

---

## 4. NOTES

- SQLite WAL mode should make this scenario trivially pass. A FAIL here would indicate either a bug in the Memory MCP server's transaction handling, or a misconfiguration (e.g., journal_mode=DELETE forcing exclusive locks).
- PARTIAL is acceptable if a transient duplicate appears once in 50 iterations (WAL checkpoint race) — note it but don't fail unless it happens repeatedly.
- This is the only scenario in the suite that genuinely stresses the substrate under load. It complements scenario 410 (latency under realistic load) but is concurrency-focused rather than throughput-focused.

## 5. CLEAN-UP

Loop memory_delete over the 15 captured parent_ids (5 pre-seed + 10 writes), then remove on-disk files:
```
for ID in [<5 baseline parent_ids> + <10 write parent_ids>]:
  mcp__mk_spec_memory__memory_delete({ parent_id: ID })

rm -rf <spec-folder>*
```
