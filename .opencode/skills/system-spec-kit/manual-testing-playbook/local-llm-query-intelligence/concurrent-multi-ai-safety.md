---
title: "415 — Concurrent multi-AI safety (save during search)"
description: "AI-A is mid-search through Memory MCP when AI-B fires a memory_save into the same DB. Verifies the local-LLM substrate stays consistent under interleaved access: search either returns the pre-save snapshot OR the post-save state — never a corrupt mix."
audited_post_018: true
version: 3.6.0.6
id: local-llm-query-intelligence-concurrent-multi-ai-safety
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
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
- Orchestrator prompt: `You are <external-CLI-A>. I am the orchestrator. Run memory_search in a tight loop. Meanwhile <external-CLI-B> will fire 10 memory_save calls. Capture the search responses across the write window and confirm each is internally consistent.`
- Expected execution process: launch 2 parallel external CLI sessions; one loops `memory_search`, the other fires `memory_save × 10`; collect all responses; verify each search response is internally consistent.
- Expected signals: every search response has its declared top-K count match the actual returned items; no duplicate parent_ids within a single response; total search-time errors = 0.
- Desired user-visible outcome: `PASS — 50 concurrent searches across the 10-save write window, all internally consistent; 0 errors.`
- Pass/fail: PASS if all search responses are internally consistent AND no errors occur; a transient duplicate in ≤ 5% of responses (a WAL checkpoint read race) still counts as PASS when the evidence notes it. FAIL if any response was corrupted, any save failed, or duplicates exceed 5% of responses.

---

## 3. TEST EXECUTION


### Commands

Run the steps below in order; each named subsection states its exact tool calls and inputs.

1. Phase 1 — Pre-seed Memory MCP
2. Phase 2 — Launch concurrent reader
3. Phase 3 — Launch concurrent writer (start ~3 seconds after reader)
4. Phase 4 — Verification

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
     mcp__system_spec_memory__memory_save({
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
    response = mcp__system_spec_memory__memory_search({
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
     mcp__system_spec_memory__memory_save({
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

Capture, for every step in the Commands sequence above:

- The exact command or tool call issued, its full output, and its exit status.
- The output lines that carry each expected signal listed in the Scenario Contract.
- Any deviation from the expected result, quoted verbatim from the output.
- The resolved path of every file the run reads or writes.

### Pass / Fail

- **Pass**: All search responses are internally consistent AND no errors occur; a transient duplicate in ≤ 5% of responses (a WAL checkpoint read race) still counts as PASS when the evidence notes it.
- **Fail**: Any response was corrupted, any save failed, or duplicates exceed 5% of responses.

### Failure Triage

1. Re-run each command on its own and record its exit status; the first non-zero exit names the failing step.
2. Check the active embedding provider with `memory_health` — a degraded or lexical-only lane changes recall and is the most common cause of a rank miss.
3. Confirm indexing finished before the query step; re-run the query after the documented wait if the stored record is absent from every result.
4. Compare the observed output against the Expected block field by field and quote the first field that disagrees.

### Notes
- SQLite WAL mode should make this scenario trivially pass. A FAIL here would indicate either a bug in the Memory MCP server's transaction handling, or a misconfiguration (e.g., journal_mode=DELETE forcing exclusive locks).
- A transient duplicate appearing once in 50 iterations (WAL checkpoint race) still counts as PASS — note it in the evidence, and only FAIL when it repeats.
- This is the only scenario in the suite that genuinely stresses the substrate under load. It complements scenario 410 (latency under realistic load) but is concurrency-focused rather than throughput-focused.

### Clean-Up
Loop memory_delete over the 15 captured parent_ids (5 pre-seed + 10 writes), then remove on-disk files:
```
for ID in [<5 baseline parent_ids> + <10 write parent_ids>]:
  mcp__system_spec_memory__memory_delete({ parent_id: ID })

rm -rf <spec-folder>*
```

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Category overview: [local-llm-query-intelligence/README.md](../../manual-testing-playbook/local-llm-query-intelligence/README.md)
- Mechanical local-LLM suites: `.opencode/skills/system-spec-kit/mcp-server/tests/local-llm-features/`

---

## 5. SOURCE METADATA

- Group: Local LLM Query Intelligence
- Playbook ID: 415
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `local-llm-query-intelligence/concurrent-multi-ai-safety.md`
